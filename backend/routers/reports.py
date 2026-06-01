from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import database
import models
import schemas
import os
import uuid

router = APIRouter()
get_db = database.get_db

# Obtenir tous les rapports
@router.get("/", response_model=List[schemas.Report])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()

# Créer un rapport avec fichier upload
@router.post("/", response_model=schemas.Report)
async def create_report(
    title: str = Form(...),
    description: str = Form(...),
    file: Optional[UploadFile] = File(None),
    file_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    final_file_url = file_url
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/{file_name}"
        with open(file_path, "wb") as buffer:
            content_bytes = await file.read()
            buffer.write(content_bytes)
        final_file_url = f"/static/{file_name}"
    
    db_report = models.Report(
        title=title,
        description=description,
        file_url=final_file_url
    )
    db.add(db_report)
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
