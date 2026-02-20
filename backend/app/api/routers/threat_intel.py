from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.services.threat_intel import scan_message
from app.api import deps
from app.models.user import User
from app.models.message import Message
from datetime import datetime, timedelta

router = APIRouter()

class ScanRequest(BaseModel):
    lines: str
    file_url: str | None = None
    file_type: str | None = None
    file_size: str | None = None
    integrity_hash: str | None = None
    channel_id: str = "general"
    ttl_seconds: int | None = None  # Self-destruct timer
    reply_to_id: int | None = None

class ScanResponse(BaseModel):
    message_id: int
    ai_score: float
    opsec_risk: str
    phishing_risk: str
    vulgar_risk: str
    explanation: str

@router.post("/scan", response_model=ScanResponse)
async def scan(
    request: ScanRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    # DEDUPLICATION: Prevent duplicate messages from race conditions
    if request.integrity_hash:
        recent_duplicate = db.query(Message).filter(
            Message.sender_id == current_user.id,
            Message.integrity_hash == request.integrity_hash,
            Message.timestamp > datetime.utcnow() - timedelta(seconds=10)
        ).first()
        
        if recent_duplicate:
            # If we already have this message, return the existing result instead of saving twice
            return {
                "message_id": recent_duplicate.id,
                "ai_score": recent_duplicate.ai_score or 0.0,
                "opsec_risk": recent_duplicate.opsec_risk or "SAFE",
                "phishing_risk": recent_duplicate.phishing_risk or "LOW",
                "explanation": "Duplicate message recognized and merged."
            }

    # Perform scan
    result = await scan_message(request.lines)
    
    # Save to Database for HQ Dashboard
    # Determine Receiver ID for DMs
    receiver_id = None
    if request.channel_id.startswith("dm_"):
        try:
            parts = request.channel_id.split("_")
            if len(parts) == 3:
                u1, u2 = int(parts[1]), int(parts[2])
                if current_user.id == u1:
                    receiver_id = u2
                elif current_user.id == u2:
                    receiver_id = u1
        except:
            pass

    risk_score = result["ai_score"]
    opsec_risk = result["opsec_risk"]
    phishing_risk = result["phishing_risk"]
    vulgar_risk = result.get("vulgar_risk", "CLEAN")
    # Block if OPSEC is HIGH or message is vulgar
    is_blocked = opsec_risk == "HIGH" or vulgar_risk == "VULGAR"

    db_message = Message(
        sender_id=current_user.id,
        content_encrypted=request.lines, # In real app, this would be encrypted on client
        ai_score=risk_score,
        opsec_risk=opsec_risk,
        phishing_risk=phishing_risk,
        vulgar_risk=vulgar_risk,
        is_blocked=is_blocked,
        file_url=request.file_url,
        file_type=request.file_type,
        file_size=request.file_size,
        integrity_hash=request.integrity_hash,
        channel_id=request.channel_id,
        receiver_id=receiver_id,
        reply_to_id=request.reply_to_id,
        expiration=datetime.utcnow() + timedelta(seconds=request.ttl_seconds) if request.ttl_seconds else None
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    
    return {
        "message_id": db_message.id,
        **result
    }


class DeleteLastRequest(BaseModel):
    channel_id: str = "general"
    count: int = 2  # Number of last messages to delete

@router.delete("/last")
async def delete_last_messages(
    request: DeleteLastRequest,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    """
    Delete the last N messages from a channel.
    """
    # Fetch last N message IDs in this channel
    last_msgs = (
        db.query(Message)
        .filter(Message.channel_id == request.channel_id)
        .order_by(Message.id.desc())
        .limit(request.count)
        .all()
    )
    ids_to_delete = [m.id for m in last_msgs]
    if not ids_to_delete:
        raise HTTPException(status_code=404, detail="No messages found to delete.")

    deleted = db.query(Message).filter(Message.id.in_(ids_to_delete)).delete(synchronize_session=False)
    db.commit()
    return {"deleted_count": deleted, "deleted_ids": ids_to_delete}
