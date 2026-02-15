from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import router as api_router
from app.db.session import engine
# Explicit imports of Base and Models triggers registration in Base.metadata
from app.db.base import Base
from app.models.user import User
from app.models.message import Message

# Create tables on startup
# This guarantees that the /tmp database on Vercel has the schema initialized
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SentinelNet API", version="1.0.0")

# Configure CORS for Vercel
# Allowing "*" with allow_credentials=False prevents protocol errors
# We use Bearer auth (headers), so cookies/credentials aren't strictly needed for this demo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "message": "SentinelNet Secure Gateway Active",
        "env": "Vercel",
        "tables": list(Base.metadata.tables.keys())
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "operational",
        "tables": list(Base.metadata.tables.keys())
    }
