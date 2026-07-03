from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, get_db
from routers import news, orders, reports, resellers, team, product_images, testimonials, regions, partners, hero_images, contact, media
from sqlalchemy.orm import Session
import os
import uuid

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Foyers Améliorés Togo API", redirect_slashes=True)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Configuration CORS pour Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclure les routers
app.include_router(news.router, prefix="/api/news", tags=["Actualités"])
app.include_router(orders.router, prefix="/api/orders", tags=["Commandes"])
app.include_router(reports.router, prefix="/api/reports", tags=["Rapports"])
app.include_router(resellers.router, prefix="/api/resellers", tags=["Demandes Revendeurs"])
app.include_router(team.router, prefix="/api/team", tags=["Équipe"])
app.include_router(product_images.router, prefix="/api/product-images", tags=["Images Produits"])
app.include_router(testimonials.router, prefix="/api/testimonials", tags=["Témoignages"])
app.include_router(regions.router, prefix="/api/regions", tags=["Régions"])
app.include_router(partners.router, prefix="/api/partners", tags=["Partenaires"])
app.include_router(hero_images.router, prefix="/api/hero-images", tags=["Hero Images"])
app.include_router(contact.router, prefix="/api/contact", tags=["Contact"])
app.include_router(media.router, prefix="/api/media", tags=["Médiathèque"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Foyers Améliorés Togo"}

@app.get("/api/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    from models import HimalayenInscription, AsutoSale, NewsArticle
    
    himalayen_count = db.query(HimalayenInscription).count()
    asuto_count = db.query(AsutoSale).count()
    total_sales = asuto_count * 2500  # Since each Asuto is 2500f
    news_count = db.query(NewsArticle).count()
    total_orders = himalayen_count + asuto_count
    
    # Calculate total CO2 saved (example: 2.85 tons per 100 units)
    co2_saved = round((total_orders / 100) * 2.85, 2)
    
    # Get recent activity
    recent_himalayen = db.query(HimalayenInscription).order_by(HimalayenInscription.id.desc()).limit(3).all()
    recent_asuto = db.query(AsutoSale).order_by(AsutoSale.id.desc()).limit(3).all()
    
    recent_activity = []
    
    for h in recent_himalayen:
        recent_activity.append({
            "region": h.region or "Togo",
            "action": f"Nouvelle inscription: {h.nom} {h.prenoms}",
            "date": h.date_inscription.isoformat() if h.date_inscription else "Maintenant",
            "status": "Terminé"
        })
        
    for a in recent_asuto:
        recent_activity.append({
            "region": a.ville or "Togo",
            "action": f"Nouvelle vente: {a.nom} {a.prenoms} ({a.quantite} unités)",
            "date": a.date_vente.isoformat() if a.date_vente else "Maintenant",
            "status": "Confirmé"
        })
    
    # Sort by date (newest first)
    recent_activity.sort(key=lambda x: x["date"], reverse=True)
    
    return {
        "total_orders": total_orders,
        "himalayen_count": himalayen_count,
        "asuto_count": asuto_count,
        "total_sales": total_sales,
        "co2_saved": co2_saved,
        "news_count": news_count,
        "recent_activity": recent_activity[:5]
    }
