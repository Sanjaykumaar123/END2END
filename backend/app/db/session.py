from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use SQLite for local development, easily switchable to PostgreSQL via env var
# DATABASE_URL = "postgresql://user:password@localhost/dbname"
import os
import shutil

# Vercel Read-Only Patch
# If running in Vercel, move DB to /tmp which is writable
base_filename = "sentinelnet.db"
search_paths = [base_filename, "../" + base_filename, "../../" + base_filename]
src_db = next((p for p in search_paths if os.path.exists(p)), None)

if os.getenv("VERCEL"):
    db_path = f"/tmp/{base_filename}"
    # Copy plain DB to tmp if not exists and source found
    if not os.path.exists(db_path) and src_db:
        shutil.copy(src_db, db_path)
    DATABASE_URL = f"sqlite:///{db_path}"
else:
    DATABASE_URL = f"sqlite:///./{base_filename}"

engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
