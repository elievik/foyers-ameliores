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
