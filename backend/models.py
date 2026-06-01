from sqlalchemy import Column, Integer, String, Date, Text, ForeignKey, DateTime
from sqlalchemy.sql import func
from database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, index=True, unique=True)  # URL-friendly version of title
    content = Column(Text)
    region = Column(String)
    date = Column(Date)
    author = Column(String)
    status = Column(String, default="Brouillon")  # Brouillon, Publié
    image_url = Column(String)  # Image URL or path
    featured = Column(Integer, default=0)  # 0 = not featured, 1 = featured

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

class ResellerRequest(Base):
    __tablename__ = "reseller_requests"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String)
    prenoms = Column(String)
    telephone = Column(String)
    ville = Column(String)
    region = Column(String)
    autre = Column(Text, nullable=True)
    status = Column(String, default="En attente")  # En attente, Validé, Refusé
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TeamMember(Base):
    __tablename__ = "team_members"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    icon = Column(String, default="person")
    img_url = Column(String)
    order = Column(Integer, default=0)


class ProductImage(Base):
    __tablename__ = "product_images"
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)  # "Foyer Himalayen" or "Foyer Asuto"
    img_url = Column(String)
    order = Column(Integer, default=0)

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    text = Column(String)
    avatar_url = Column(String, nullable=True)
    order = Column(Integer, default=0)
