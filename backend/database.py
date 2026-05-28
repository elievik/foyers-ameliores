from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Pour SQLite (development)
SQLALCHEMY_DATABASE_URL = "sqlite:///./foyers.db"

# Pour PostgreSQL (production)
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@host:port/dbname"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}  # Seulement pour SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dépendance pour les routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
