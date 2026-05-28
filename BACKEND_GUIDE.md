# Guide d'Implémentation Backend - FastAPI

Ce guide vous aidera à mettre en place le backend complet pour le projet **Foyers Améliorés Togo**.

## 1. Installation de l'environnement

```bash
# Créer un dossier backend
mkdir backend && cd backend

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Mac/Linux
# venv\Scripts\activate  # Sur Windows

# Installer les dépendances
pip install fastapi uvicorn sqlalchemy pydantic psycopg2-binary python-multipart
```

## 2. Structure Recommandée

```text
backend/
├── main.py            # Point d'entrée
├── database.py        # Configuration SQLAlchemy
├── models.py          # Modèles de base de données
├── schemas.py         # Schémas Pydantic (validation)
├── crud.py            # Opérations base de données
└── routers/           # Routes API
    ├── news.py
    ├── orders.py
    └── reports.py
```

## 3. Code des Fichiers

### database.py (Configuration de la DB)
```python
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
```

### models.py (Modèles SQLAlchemy)
```python
from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey
from database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(Text)
    region = Column(String)
    date = Column(Date)
    author = Column(String)
    status = Column(String, default="Brouillon")  # Brouillon, Publié

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    file_url = Column(String)

class HimalayenInscription(Base):
    __tablename__ = "himalayen_inscriptions"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    prenoms = Column(String)
    sexe = Column(String)
    telephone = Column(String)
    ville_commune = Column(String)
    adresse_village = Column(String)
    region = Column(String)
    prefecture = Column(String)
    date_inscription = Column(Date)

class AsutoSale(Base):
    __tablename__ = "asuto_sales"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    prenoms = Column(String)
    sexe = Column(String)
    telephone = Column(String)
    ville = Column(String)
    date_vente = Column(Date)
    quantite = Column(Integer)
    prix_unitaire = Column(Integer, default=2500)
```

### schemas.py (Schémas Pydantic)
```python
from pydantic import BaseModel
from datetime import date

# Articles Actualités
class NewsArticleBase(BaseModel):
    title: str
    content: str
    region: str
    author: str
    status: str = "Brouillon"

class NewsArticleCreate(NewsArticleBase):
    date: date

class NewsArticle(NewsArticleBase):
    id: int
    date: date
    class Config:
        orm_mode = True

# Rapports
class ReportBase(BaseModel):
    title: str
    description: str

class ReportCreate(ReportBase):
    file_url: str

class Report(ReportBase):
    id: int
    class Config:
        orm_mode = True

# Inscriptions Himalayen
class HimalayenInscriptionBase(BaseModel):
    nom: str
    prenoms: str
    sexe: str
    telephone: str
    ville_commune: str
    adresse_village: str
    region: str
    prefecture: str

class HimalayenInscriptionCreate(HimalayenInscriptionBase):
    date_inscription: date

class HimalayenInscription(HimalayenInscriptionBase):
    id: int
    date_inscription: date
    class Config:
        orm_mode = True

# Ventes Asuto
class AsutoSaleBase(BaseModel):
    nom: str
    prenoms: str
    sexe: str
    telephone: str
    ville: str
    quantite: int

class AsutoSaleCreate(AsutoSaleBase):
    date_vente: date

class AsutoSale(AsutoSaleBase):
    id: int
    date_vente: date
    prix_unitaire: int
    class Config:
        orm_mode = True
```

### main.py (Point d'entrée)
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import news, orders, reports

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Foyers Améliorés Togo API")

# Configuration CORS pour Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routers
app.include_router(news.router, prefix="/api/news", tags=["Actualités"])
app.include_router(orders.router, prefix="/api/orders", tags=["Commandes"])
app.include_router(reports.router, prefix="/api/reports", tags=["Rapports"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Foyers Améliorés Togo"}
```

### routers/news.py
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir tous les articles
@router.get("/", response_model=List[schemas.NewsArticle])
def get_articles(db: Session = Depends(get_db)):
    return db.query(models.NewsArticle).all()

# Créer un article
@router.post("/", response_model=schemas.NewsArticle)
def create_article(article: schemas.NewsArticleCreate, db: Session = Depends(get_db)):
    db_article = models.NewsArticle(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article
```

### routers/orders.py
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir les inscriptions Himalayen
@router.get("/himalayen", response_model=List[schemas.HimalayenInscription])
def get_himalayen_inscriptions(db: Session = Depends(get_db)):
    return db.query(models.HimalayenInscription).all()

# Créer une inscription Himalayen
@router.post("/himalayen", response_model=schemas.HimalayenInscription)
def create_himalayen_inscription(inscription: schemas.HimalayenInscriptionCreate, db: Session = Depends(get_db)):
    db_inscription = models.HimalayenInscription(**inscription.dict())
    db.add(db_inscription)
    db.commit()
    db.refresh(db_inscription)
    return db_inscription

# Obtenir les ventes Asuto
@router.get("/asuto", response_model=List[schemas.AsutoSale])
def get_asuto_sales(db: Session = Depends(get_db)):
    return db.query(models.AsutoSale).all()

# Créer une vente Asuto
@router.post("/asuto", response_model=schemas.AsutoSale)
def create_asuto_sale(sale: schemas.AsutoSaleCreate, db: Session = Depends(get_db)):
    db_sale = models.AsutoSale(**sale.dict())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale
```

### routers/reports.py
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir tous les rapports
@router.get("/", response_model=List[schemas.Report])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

# Créer un rapport
@router.post("/", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
```

## 4. Lancer le serveur

```bash
# Dans le dossier backend
uvicorn main:app --reload
```

L'API sera disponible sur `http://localhost:8000`
Documentation Swagger : `http://localhost:8000/docs`
Documentation Redoc : `http://localhost:8000/redoc`

## 5. Intégration avec Next.js

Pour connecter votre frontend au backend FastAPI, vous devrez utiliser `fetch` dans vos composants :

```javascript
// Exemple pour récupérer les articles
async function fetchArticles() {
  const res = await fetch('http://localhost:8000/api/news');
  const data = await res.json();
  return data;
}

// Exemple pour créer une inscription Himalayen
async function createHimalayenInscription(data) {
  const res = await fetch('http://localhost:8000/api/orders/himalayen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await res.json();
}
```

## 6. Exemples d'utilisation dans le Frontend

Vous avez déjà un bouton de téléchargement de rapport dans `/admin/page.js`, qui génère un fichier CSV. Pour connecter ça au backend plus tard, vous pourrez remplacer le contenu CSV par des données venant de l'API.
