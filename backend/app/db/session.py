import os
import shutil
import ssl
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Prioritize connection string from environment variable
DB_CONNECTION_ERROR = None
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Sanitize URL
    if DATABASE_URL.startswith("psql"):
        DATABASE_URL = DATABASE_URL.split(" ")[-1]
    
    DATABASE_URL = DATABASE_URL.strip().strip("'").strip('"')

    if "?" in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("sslmode=require", "").replace("channel_binding=require", "")
        DATABASE_URL = DATABASE_URL.replace("?&", "?").replace("&&", "&").strip("&")
        if DATABASE_URL.endswith("?"):
            DATABASE_URL = DATABASE_URL[:-1]

    try:
        if DATABASE_URL.startswith("postgres://"):
            DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
        elif DATABASE_URL.startswith("postgresql://"):
            DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)
        elif DATABASE_URL.startswith("neondb://"):
             DATABASE_URL = DATABASE_URL.replace("neondb://", "postgresql+pg8000://", 1)
            
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        engine = create_engine(
            DATABASE_URL,
            connect_args={"ssl_context": ssl_context},
            pool_pre_ping=True,
            pool_recycle=300
        )
    except Exception as e:
        DB_CONNECTION_ERROR = f"{str(e)} || TRIED_URL_START: {DATABASE_URL[:25] if DATABASE_URL else 'None'}..."
        print(f"DATABASE CONNECTION FAILED AT IMPORT: {e}")
        # Fallback to local SQLite file instead of memory to prevent reset bug
        DATABASE_URL = "sqlite:///./sentinelnet_fallback.db"
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
        )

elif os.getenv("VERCEL"):
    # Vercel Fallback: Use /tmp for writable file-based SQLite
    DATABASE_URL = "sqlite:////tmp/sentinelnet.db"
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
    
else:
    # Local Development: File-based SQLite
    try:
        base_filename = "sentinelnet.db"
        DATABASE_URL = f"sqlite:///./{base_filename}"
        engine = create_engine(
            DATABASE_URL, connect_args={"check_same_thread": False}
        )
    except Exception as e:
         # Extreme Fallback
        DATABASE_URL = "sqlite:///./sentinelnet_fallback.db"
        engine = create_engine(
            DATABASE_URL,
            connect_args={"check_same_thread": False},
        )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
