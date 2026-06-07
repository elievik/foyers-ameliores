import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Charger le fichier .env s'il existe
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Récupérer l'URL de la base de données depuis les variables d'environnement, avec fallback sur SQLite
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./foyers.db")

# Si l'URL utilise postgres:// (format Render par défaut), on le remplace par postgresql:// (requis par SQLAlchemy)
if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

logger.info(f"Connecting to database: {SQLALCHEMY_DATABASE_URL.split('@')[-1]}")

connect_args = {}
# 'check_same_thread' est nécessaire seulement pour SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    print("⚠️  BASE DE DONNÉES : SQLite (données non persistantes, risque de perte !)")
else:
    print("✅ BASE DE DONNÉES : PostgreSQL (Neon) détectée")
    # Pas besoin de connect_args complexes, sslmode=require est déjà dans l'URL Neon

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
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
