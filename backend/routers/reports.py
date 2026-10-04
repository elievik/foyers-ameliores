from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import database
from storage import upload_file_to_supabase
import models
import schemas
import os
import uuid

router = APIRouter()
get_db = database.get_db

# Obtenir tous les rapports (admin: tous, agent: filtrés par région)
@router.get("/", response_model=List[schemas.Report])
def get_reports(region: Optional[str] = None, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Report)
    if region:
        query = query.filter(models.Report.region == region)
    if status:
        query = query.filter(models.Report.status == status)
    return query.order_by(models.Report.id.desc()).all()

# Créer un rapport (brouillon par défaut)
@router.post("/", response_model=schemas.Report)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    region: Optional[str] = Form(None),
    agent_name: Optional[str] = Form(None),
    status: Optional[str] = Form("Brouillon"),
    file: Optional[UploadFile] = File(None),
    file_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    final_file_url = file_url
    if file:
        final_file_url = await upload_file_to_supabase(file)
    
    db_report = models.Report(
        title=title,
        description=description,
        file_url=final_file_url,
        region=region,
        agent_name=agent_name,
        status=status or "Brouillon"
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

# Mettre à jour un rapport (ex: passer de Brouillon à Envoyé)
@router.patch("/{report_id}", response_model=schemas.Report)
async def update_report(
    report_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    file_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if title is not None:
        db_report.title = title
    if description is not None:
        db_report.description = description
    if status is not None:
        db_report.status = status
    if file:
        db_report.file_url = await upload_file_to_supabase(file)
    elif file_url is not None:
        db_report.file_url = file_url
    
    db.commit()
    db.refresh(db_report)
    return db_report

# Supprimer un rapport
@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    db_report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not db_report:
        raise HTTPException(status_code=404, detail="Report not found")
    db.delete(db_report)
    db.commit()
    return {"message": "Report deleted successfully"}
