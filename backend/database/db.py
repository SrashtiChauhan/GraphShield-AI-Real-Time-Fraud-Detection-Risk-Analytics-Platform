from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# database URL (local placeholder for now)
DATABASE_URL = "sqlite:///./graphshield.db"

# create database engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

# session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    """
    Dependency to get database session
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()