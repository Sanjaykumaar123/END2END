from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for local development, easily switchable to PostgreSQL via env var
# DATABASE_URL = "postgresql://user:password@localhost/dbname"
import os
import shutil

# Vercel Read-Only Patch
# If running in Vercel, move DB to /tmp which is writable
# Vercel Read-Only Patch
# Use In-Memory DB for Vercel Demo to avoid filesystem issues entirely
if os.getenv("VERCEL"):
    DATABASE_URL = "sqlite:///:memory:"
else:
    base_filename = "sentinelnet.db"
    DATABASE_URL = f"sqlite:///./{base_filename}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
