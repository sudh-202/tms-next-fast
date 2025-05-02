from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# On Render.com, save SQLite DB in the persistent /data directory
if os.environ.get("RENDER") and os.path.exists("/data"):
    # Use persistent volume for SQLite on Render
    DATABASE_URL = "sqlite:////data/app.db"
else:
    # Local SQLite database
    DATABASE_URL = "sqlite:///./app.db"

# Create SQLite engine with appropriate settings
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class for models
Base = declarative_base()

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()