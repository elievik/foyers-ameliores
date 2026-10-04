from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# ─── HIMALAYEN ──────────────────────────────────────────────────────────────

@router.get("/himalayen", response_model=List[schemas.HimalayenInscription])
def get_himalayen_inscriptions(
    region: Optional[str] = None,
    statut: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.HimalayenInscription)
    if region:
        query = query.filter(models.HimalayenInscription.region == region)
    if statut:
        query = query.filter(models.HimalayenInscription.statut == statut)
    return query.order_by(models.HimalayenInscription.id.desc()).all()

@router.post("/himalayen", response_model=schemas.HimalayenInscription)
def create_himalayen_inscription(
    inscription: schemas.HimalayenInscriptionCreate,
    db: Session = Depends(get_db)
):
    db_inscription = models.HimalayenInscription(**inscription.dict())
    db.add(db_inscription)
    db.commit()
    db.refresh(db_inscription)
    return db_inscription

@router.patch("/himalayen/{id}/statut", response_model=schemas.HimalayenInscription)
def update_himalayen_statut(
    id: int,
    update: schemas.HimalayenInscriptionUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(models.HimalayenInscription).filter(models.HimalayenInscription.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Inscription non trouvée")
    
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
        
    db.commit()
    db.refresh(record)
    return record

@router.delete("/himalayen/{id}")
def delete_himalayen(id: int, db: Session = Depends(get_db)):
    record = db.query(models.HimalayenInscription).filter(models.HimalayenInscription.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Inscription non trouvée")
    db.delete(record)
    db.commit()
    return {"message": "Supprimé avec succès"}

# ─── ASUTO ──────────────────────────────────────────────────────────────────

@router.get("/asuto", response_model=List[schemas.AsutoSale])
def get_asuto_sales(
    ville: Optional[str] = None,
    statut: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.AsutoSale)
    if ville:
        query = query.filter(models.AsutoSale.ville == ville)
    if statut:
        query = query.filter(models.AsutoSale.statut == statut)
    return query.order_by(models.AsutoSale.id.desc()).all()

@router.post("/asuto", response_model=schemas.AsutoSale)
def create_asuto_sale(sale: schemas.AsutoSaleCreate, db: Session = Depends(get_db)):
    db_sale = models.AsutoSale(**sale.dict(), prix_unitaire=2500)
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

@router.patch("/asuto/{id}/statut", response_model=schemas.AsutoSale)
def update_asuto_statut(
    id: int,
    update: schemas.AsutoSaleUpdate,
    db: Session = Depends(get_db)
):
    record = db.query(models.AsutoSale).filter(models.AsutoSale.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
        
    update_data = update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
        
    db.commit()
    db.refresh(record)
    return record

@router.delete("/asuto/{id}")
def delete_asuto(id: int, db: Session = Depends(get_db)):
    record = db.query(models.AsutoSale).filter(models.AsutoSale.id == id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
    db.delete(record)
    db.commit()
    return {"message": "Supprimé avec succès"}
