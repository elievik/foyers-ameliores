from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

# Articles Actualités
class NewsArticleBase(BaseModel):
    title: str
    slug: str
    content: str
    region: str
    author: str
    status: str = "Brouillon"
    image_url: Optional[str] = None
    featured: int = 0

class NewsArticleCreate(NewsArticleBase):
    date: date

class NewsArticleUpdate(NewsArticleBase):
    date: Optional[date] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    content: Optional[str] = None
    region: Optional[str] = None
    author: Optional[str] = None
    status: Optional[str] = None
    image_url: Optional[str] = None
    featured: Optional[int] = None

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

# Demandes Revendeurs
class ResellerRequestBase(BaseModel):
    nom: str
    prenoms: str
    telephone: str
    ville: str
    region: str
    autre: Optional[str] = None

class ResellerRequestCreate(ResellerRequestBase):
    pass

class ResellerRequestUpdate(BaseModel):
    status: str

class ResellerRequest(ResellerRequestBase):
    id: int
    status: str
    created_at: datetime
    class Config:
        orm_mode = True

# Team Members
class TeamMemberBase(BaseModel):
    name: str
    role: str
    icon: str = "person"
    img_url: str
    order: int = 0

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    id: int
    class Config:
        orm_mode = True


# Product Images
class ProductImageBase(BaseModel):
    product_name: str
    img_url: str
    order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageUpdate(ProductImageBase):
    pass

class ProductImage(ProductImageBase):
    id: int
    class Config:
        orm_mode = True


# Testimonials
class TestimonialBase(BaseModel):
    name: str
    location: str
    text: str
    avatar_url: Optional[str] = None
    order: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(TestimonialBase):
    pass

class Testimonial(TestimonialBase):
    id: int
    class Config:
        orm_mode = True
