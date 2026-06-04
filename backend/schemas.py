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

# Regions
class RegionBase(BaseModel):
    name: str
    distributed: str = "0"
    icon: str = "public"
    activity: str = "Aucune activité enregistrée"
    quote: Optional[str] = None
    cite: Optional[str] = None
    img_url: str
    order: int = 0

class RegionCreate(RegionBase):
    pass

class RegionUpdate(RegionBase):
    name: Optional[str] = None
    distributed: Optional[str] = None
    icon: Optional[str] = None
    activity: Optional[str] = None
    quote: Optional[str] = None
    cite: Optional[str] = None
    img_url: Optional[str] = None
    order: Optional[int] = None

class Region(RegionBase):
    id: int
    class Config:
        orm_mode = True

# Partners
class PartnerBase(BaseModel):
    name: str
    logo_url: str
    order: int = 0

class PartnerCreate(PartnerBase):
    pass

class PartnerUpdate(PartnerBase):
    name: Optional[str] = None
    logo_url: Optional[str] = None
    order: Optional[int] = None

class Partner(PartnerBase):
    id: int
    class Config:
        orm_mode = True

# Hero Images
class HeroImageBase(BaseModel):
    page: str
    title: str
    image_url: str
    alt_text: str = ""

class HeroImageCreate(HeroImageBase):
    pass

class HeroImageUpdate(HeroImageBase):
    page: Optional[str] = None
    title: Optional[str] = None
    image_url: Optional[str] = None
    alt_text: Optional[str] = None

class HeroImage(HeroImageBase):
    id: int
    class Config:
        orm_mode = True


# Contact Info
class ContactInfoBase(BaseModel):
    phone: str
    email: str
    whatsapp_number: str


class ContactInfoCreate(ContactInfoBase):
    pass


class ContactInfoUpdate(ContactInfoBase):
    phone: Optional[str] = None
    email: Optional[str] = None
    whatsapp_number: Optional[str] = None


class ContactInfo(ContactInfoBase):
    id: int
    class Config:
        orm_mode = True


# Regional Offices
class RegionalOfficeBase(BaseModel):
    name: str
    city: str
    phone: str
    address: str
    img_url: str = ""
    order: int = 0


class RegionalOfficeCreate(RegionalOfficeBase):
    pass


class RegionalOfficeUpdate(RegionalOfficeBase):
    name: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    img_url: Optional[str] = None
    order: Optional[int] = None


class RegionalOffice(RegionalOfficeBase):
    id: int
    class Config:
        orm_mode = True
