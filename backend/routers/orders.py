from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir les inscriptions Himalayen
@router.get("/himalayen", response_model=List[schemas.HimalayenInscription])
def get_himalayen_inscriptions(db: Session = Depends(get_db)):
    return db.query(models.HimalayenInscription).all()

# Créer une inscription Himalayen
@router.post("/himalayen", response_model=schemas.HimalayenInscription)
def create_himalayen_inscription(inscription: schemas.HimalayenInscriptionCreate, db: Session = Depends(get_db)):
    db_inscription = models.HimalayenInscription(**inscription.dict())
    db.add(db_inscription)
    db.commit()
    db.refresh(db_inscription)
    return db_inscription

# Obtenir les ventes Asuto
@router.get("/asuto", response_model=List[schemas.AsutoSale])
def get_asuto_sales(db: Session = Depends(get_db)):
    return db.query(models.AsutoSale).all()

# Créer une vente Asuto
@router.post("/asuto", response_model=schemas.AsutoSale)
def create_asuto_sale(sale: schemas.AsutoSaleCreate, db: Session = Depends(get_db)):
    db_sale = models.AsutoSale(**sale.dict())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale
