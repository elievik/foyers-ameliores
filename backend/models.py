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
    region = Column(String, nullable=True)
    status = Column(String, default="Brouillon")  # Brouillon, Envoyé
    agent_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

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
    agent_name = Column(String, nullable=True)          # Nom de l'agent qui a saisi
    statut = Column(String, default="En attente")       # En attente, Vérifié, Annulé
    numero_serie = Column(String, nullable=True)        # Numéro de série du foyer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

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
    agent_name = Column(String, nullable=True)          # Nom de l'agent qui a saisi
    statut = Column(String, default="En attente")       # En attente, Vérifié, Annulé
    numero_serie = Column(String, nullable=True)        # Numéro de série du foyer
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RegionStock(Base):
    __tablename__ = "region_stocks"
    id = Column(Integer, primary_key=True, index=True)
    region = Column(String, unique=True, index=True)
    stock_asuto = Column(Integer, default=0)

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

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="agent") # admin or agent
    region = Column(String, nullable=True) # e.g. Maritime, Plateaux
    prenom = Column(String, nullable=True)
    nom = Column(String, nullable=True)
    is_active = Column(Integer, default=1) # 1 = active, 0 = disabled
    created_at = Column(DateTime(timezone=True), server_default=func.now())


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

class Region(Base):
    __tablename__ = "regions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    distributed = Column(String, default="0")
    icon = Column(String, default="public")
    activity = Column(String, default="Aucune activité enregistrée")
    quote = Column(String, nullable=True)
    cite = Column(String, nullable=True)
    img_url = Column(String)
    order = Column(Integer, default=0)
    is_hidden = Column(Integer, default=0)

class Partner(Base):
    __tablename__ = "partners"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    logo_url = Column(String)
    order = Column(Integer, default=0)

class HeroImage(Base):
    __tablename__ = "hero_images"
    id = Column(Integer, primary_key=True, index=True)
    page = Column(String, unique=True, index=True)  # e.g., "home", "about", "regions"
    title = Column(String)
    image_url = Column(String)
    alt_text = Column(String, default="")


class ContactInfo(Base):
    __tablename__ = "contact_info"
    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String, default="+228 22 45 00 01")
    email = Column(String, default="contact@foyers-togo.tg")
    whatsapp_number = Column(String, default="+22890000000")


class RegionalOffice(Base):
    __tablename__ = "regional_offices"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    city = Column(String)
    phone = Column(String)
    address = Column(String)
    img_url = Column(String, default="")
    order = Column(Integer, default=0)
