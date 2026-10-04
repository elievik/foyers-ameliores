from fastapi import FastAPI, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base, get_db, SessionLocal
from routers import news, orders, reports, resellers, team, product_images, testimonials, regions, partners, hero_images, contact, media, stock, auth
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session
import os
import uuid

# Créer les tables manquantes (create_all ne touche jamais aux tables existantes)
Base.metadata.create_all(bind=engine)

# Ajoute automatiquement les colonnes manquantes sur les tables déjà existantes,
# pour qu'une évolution du modèle ne casse plus jamais les routes en prod.
# Uniquement additif : aucune colonne ni ligne n'est jamais supprimée ici.
def sync_missing_columns():
    inspector = inspect(engine)
    existing_tables = set(inspector.get_table_names())
    with engine.begin() as conn:
        for table in Base.metadata.sorted_tables:
            if table.name not in existing_tables:
                continue
            existing_columns = {col["name"] for col in inspector.get_columns(table.name)}
            for column in table.columns:
                if column.name in existing_columns:
                    continue
                ddl_type = column.type.compile(dialect=engine.dialect)
                conn.execute(text(f'ALTER TABLE "{table.name}" ADD COLUMN "{column.name}" {ddl_type}'))
                print(f"Migration: colonne '{column.name}' ajoutée à la table '{table.name}'")

sync_missing_columns()

def create_default_users():
    from models import User
    from routers.auth import get_password_hash

    default_users = [
        {
            "email": "foyer@gmail.com",
            "password": "admin123",
            "role": "admin",
            "prenom": "Admin",
            "nom": "Global",
            "region": None
        },
        {
            "email": "maritime@gmail.com",
            "password": "maritime123",
            "role": "agent",
            "prenom": "Agent",
            "nom": "Maritime",
            "region": "Maritime"
        },
        {
            "email": "plateau@gmail.com",
            "password": "plateau123",
            "role": "agent",
            "prenom": "Agent",
            "nom": "Plateaux",
            "region": "Plateaux"
        },
        {
            "email": "centrale@gmail.com",
            "password": "centrale123",
            "role": "agent",
            "prenom": "Agent",
            "nom": "Centrale",
            "region": "Centrale"
        },
        {
            "email": "kara@gmail.com",
            "password": "kara123",
            "role": "agent",
            "prenom": "Agent",
            "nom": "Kara",
            "region": "Kara"
        },
        {
            "email": "savane@gmail.com",
            "password": "savane123",
            "role": "agent",
            "prenom": "Agent",
            "nom": "Savanes",
            "region": "Savanes"
        },
    ]

    db = SessionLocal()
    try:
        for u in default_users:
            existing = db.query(User).filter(User.email == u["email"]).first()
            if not existing:
                db.add(User(
                    email=u["email"],
                    hashed_password=get_password_hash(u["password"]),
                    role=u["role"],
                    prenom=u["prenom"],
                    nom=u["nom"],
                    region=u["region"]
                ))
        db.commit()
        print("✅ Comptes par défaut vérifiés/créés")
    finally:
        db.close()

create_default_users()

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
app.include_router(stock.router, prefix="/api/stock", tags=["Stock"])
app.include_router(auth.router, prefix="/api/auth", tags=["Authentification"])

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Foyers Améliorés Togo"}

@app.get("/api/stats")
def get_dashboard_stats(region: str = None, db: Session = Depends(get_db)):
    from models import HimalayenInscription, AsutoSale, NewsArticle, RegionStock, AgentReport
    
    h_query = db.query(HimalayenInscription)
    a_query = db.query(AsutoSale)
    s_query = db.query(RegionStock)
    r_query = db.query(AgentReport)
    
    if region:
        h_query = h_query.filter(HimalayenInscription.region == region)
        a_query = a_query.filter(AsutoSale.ville == region)
        s_query = s_query.filter(RegionStock.region == region)
        r_query = r_query.filter(AgentReport.region == region)
    
    himalayen_count = h_query.count()
    asuto_count = a_query.count()
    stocks = s_query.all()
    total_sales = asuto_count * 2500
    news_count = db.query(NewsArticle).count()
    total_orders = himalayen_count + asuto_count
    co2_saved = round((total_orders / 100) * 2.85, 2)
    
    recent_himalayen = h_query.order_by(HimalayenInscription.id.desc()).limit(10).all()
    recent_asuto = a_query.order_by(AsutoSale.id.desc()).limit(10).all()
    recent_reports = r_query.order_by(AgentReport.id.desc()).limit(10).all()
    
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
        
    for r in recent_reports:
        recent_activity.append({
            "region": r.region or "Togo",
            "action": f"Nouveau rapport: {r.title}",
            "date": r.created_at.isoformat() if r.created_at else "Maintenant",
            "status": r.status
        })
    
    recent_activity.sort(key=lambda x: x["date"], reverse=True)
    
    return {
        "total_orders": total_orders,
        "himalayen_count": himalayen_count,
        "asuto_count": asuto_count,
        "total_sales": total_sales,
        "co2_saved": co2_saved,
        "news_count": news_count,
        "reports_count": r_query.count(),
        "recent_activity": recent_activity[:15],
        "stocks": [{"region": s.region, "stock_asuto": s.stock_asuto} for s in stocks]
    }


@app.get("/api/region-detail/{region_name}")
def get_region_detail(region_name: str, db: Session = Depends(get_db)):
    """Retourne toutes les données soumises par les agents pour une région donnée"""
    from models import HimalayenInscription, AsutoSale, AgentReport, RegionStock

    himalayen = db.query(HimalayenInscription).filter(
        HimalayenInscription.region == region_name
    ).order_by(HimalayenInscription.id.desc()).all()

    asuto = db.query(AsutoSale).filter(
        AsutoSale.ville == region_name
    ).order_by(AsutoSale.id.desc()).all()

    reports = db.query(AgentReport).filter(
        AgentReport.region == region_name
    ).order_by(AgentReport.id.desc()).all()

    stock = db.query(RegionStock).filter(RegionStock.region == region_name).first()

    return {
        "region": region_name,
        "stock_asuto": stock.stock_asuto if stock else 0,
        "himalayen": [
            {
                "id": h.id,
                "nom": h.nom,
                "prenoms": h.prenoms,
                "telephone": h.telephone,
                "prefecture": h.prefecture,
                "adresse_village": h.adresse_village,
                "date_inscription": h.date_inscription.isoformat() if h.date_inscription else None,
                "statut": h.statut or "En attente",
                "agent_name": h.agent_name,
                "numero_serie": h.numero_serie,
            }
            for h in himalayen
        ],
        "asuto": [
            {
                "id": a.id,
                "nom": a.nom,
                "prenoms": a.prenoms,
                "telephone": a.telephone,
                "quantite": a.quantite,
                "date_vente": a.date_vente.isoformat() if a.date_vente else None,
                "statut": a.statut or "En attente",
                "agent_name": a.agent_name,
                "numero_serie": a.numero_serie,
            }
            for a in asuto
        ],
        "reports": [
            {
                "id": r.id,
                "title": r.title,
                "description": r.description,
                "status": r.status,
                "agent_name": r.agent_name,
                "created_at": r.created_at.isoformat() if r.created_at else None,
                "file_url": r.file_url,
            }
            for r in reports
        ],
        "summary": {
            "total_himalayen": len(himalayen),
            "total_asuto": len(asuto),
            "total_reports": len(reports),
            "total_ventes_fcfa": sum(a.quantite * 2500 for a in asuto),
            "co2_saved": round((len(himalayen) + len(asuto)) / 100 * 2.85, 2),
        }
    }

