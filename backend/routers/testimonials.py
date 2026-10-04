from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from storage import upload_file_to_supabase
import models
import schemas
from typing import Optional

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.Testimonial])
def get_testimonials(db: Session = Depends(get_db)):
    """Retourne uniquement les témoignages validés (pour le site public)"""
    return db.query(models.Testimonial).filter(
        models.Testimonial.status == "Validé"
    ).order_by(models.Testimonial.order).all()


@router.get("/all", response_model=list[schemas.Testimonial])
def get_all_testimonials(db: Session = Depends(get_db)):
    """Retourne TOUS les témoignages (pour l'admin, inclus en attente et refusés)"""
    return db.query(models.Testimonial).order_by(models.Testimonial.created_at.desc()).all()


@router.post("/", response_model=schemas.Testimonial)
async def create_testimonial(
    name: str = Form(...),
    location: str = Form(...),
    text: str = Form(...),
    order: int = Form(0),
    status: str = Form("Validé"),
    submitted_by: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    avatar_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_url = avatar_url
    if file and file.filename:
        image_url = await upload_file_to_supabase(file)
    
    db_testimonial = models.Testimonial(
        name=name,
        location=location,
        text=text,
        avatar_url=image_url,
        order=order,
        status=status,
        submitted_by=submitted_by
    )
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.patch("/{testimonial_id}", response_model=schemas.Testimonial)
async def update_testimonial(
    testimonial_id: int,
    name: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
    text: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    status: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    avatar_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    if name:
        db_testimonial.name = name
    if location:
        db_testimonial.location = location
    if text:
        db_testimonial.text = text
    if order is not None:
        db_testimonial.order = order
    if status:
        db_testimonial.status = status
    
    if file and file.filename:
        db_testimonial.avatar_url = await upload_file_to_supabase(file)
    elif avatar_url:
        db_testimonial.avatar_url = avatar_url
    
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.patch("/{testimonial_id}/status")
async def update_testimonial_status(
    testimonial_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    """Route dédiée pour changer uniquement le statut (validation admin)"""
    db_t = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_t:
        raise HTTPException(status_code=404, detail="Not found")
    db_t.status = status
    db.commit()
    return {"ok": True, "status": status}


@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_testimonial)
    db.commit()
    return {"ok": True}
