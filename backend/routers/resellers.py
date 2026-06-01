from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir toutes les demandes revendeurs
@router.get("/", response_model=List[schemas.ResellerRequest])
def get_reseller_requests(db: Session = Depends(get_db)):
    return db.query(models.ResellerRequest).order_by(models.ResellerRequest.created_at.desc()).all()

# Créer une demande revendeur
@router.post("/", response_model=schemas.ResellerRequest)
def create_reseller_request(request: schemas.ResellerRequestCreate, db: Session = Depends(get_db)):
    db_request = models.ResellerRequest(**request.dict())
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

# Mettre à jour le statut d'une demande
@router.patch("/{request_id}", response_model=schemas.ResellerRequest)
def update_reseller_request(request_id: int, update: schemas.ResellerRequestUpdate, db: Session = Depends(get_db)):
    db_request = db.query(models.ResellerRequest).filter(models.ResellerRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    db_request.status = update.status
    db.commit()
    db.refresh(db_request)
    return db_request

# Supprimer une demande
@router.delete("/{request_id}")
def delete_reseller_request(request_id: int, db: Session = Depends(get_db)):
    db_request = db.query(models.ResellerRequest).filter(models.ResellerRequest.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Demande non trouvée")
    db.delete(db_request)
    db.commit()
    return {"message": "Demande supprimée avec succès"}
