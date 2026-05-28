from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir tous les rapports
@router.get("/", response_model=List[schemas.Report])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

# Créer un rapport
@router.post("/", response_model=schemas.Report)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    db_report = models.Report(**report.dict())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report
