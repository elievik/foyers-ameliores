from database import engine, Base
from models import (
    NewsArticle, Report, HimalayenInscription, 
    AsutoSale, ResellerRequest, TeamMember, 
    ProductImage, Testimonial
)

# Create all tables (this will add new columns if they don't exist)
Base.metadata.create_all(bind=engine)
print("Database tables updated successfully!")
