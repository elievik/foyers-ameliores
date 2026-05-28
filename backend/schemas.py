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
