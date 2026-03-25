from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# load environment variables
load_dotenv()

# get database URL (fallback to sqlite if not provided)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./graphshield.db")

# handle sqlite separately
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# create engine
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# base class for models
Base = declarative_base()


def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()