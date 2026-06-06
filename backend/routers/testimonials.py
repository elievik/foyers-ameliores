from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from storage import upload_file_to_supabase
import models
import schemas
import os
import uuid
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
    return db.query(models.Testimonial).order_by(models.Testimonial.order).all()


@router.post("/", response_model=schemas.Testimonial)
async def create_testimonial(
    name: str = Form(...),
    location: str = Form(...),
    text: str = Form(...),
    order: int = Form(0),
    file: Optional[UploadFile] = File(None),
    avatar_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_url = avatar_url
    if file:
        image_url = await upload_file_to_supabase(file)
    
    db_testimonial = models.Testimonial(
        name=name,
        location=location,
        text=text,
        avatar_url=image_url,
        order=order
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
    
    if file:
        db_testimonial.avatar_url = await upload_file_to_supabase(file)
    elif avatar_url:
        db_testimonial.avatar_url = avatar_url
    
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    
    # Delete file if it's a local file
    if db_testimonial.avatar_url and db_testimonial.avatar_url.startswith("/static/images/"):
        file_path = db_testimonial.avatar_url.replace("/static/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(db_testimonial)
    db.commit()
    return {"message": "Testimonial deleted"}
