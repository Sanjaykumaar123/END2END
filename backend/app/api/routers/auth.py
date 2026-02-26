from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, Token

router = APIRouter()

@router.post("/login/access-token", response_model=Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(User).filter(User.email == form_data.username).first()
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            {"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "role": getattr(user, "role", "user"),
    }

@router.post("/register", response_model=UserCreate)
def register_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Register a new user
    """
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system",
        )
    
    hashed_password = security.get_password_hash(user_in.password)
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role="commander" # Default role for full demo access
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user_in

from pydantic import BaseModel
from typing import Optional

class GoogleSyncRequest(BaseModel):
    email: str
    full_name: Optional[str] = None

@router.post("/google-sync", response_model=Token)
def google_sync_user(
    request: GoogleSyncRequest,
    db: Session = Depends(deps.get_db)
) -> Any:
    """
    Sync Google OAuth user with FastAPI backend and issue JWT token
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        # Create a new user for the Google OAuth account
        user = User(
            email=request.email,
            hashed_password=security.get_password_hash("google-oauth-dummy-pass"),
            full_name=request.full_name or request.email.split("@")[0],
            role="commander",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            {"sub": user.email}, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
        "role": getattr(user, "role", "user"),
    }
