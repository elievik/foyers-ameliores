from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from database import get_db
import models
import schemas

router = APIRouter()

# Ensure static/images directory exists
os.makedirs("static/images", exist_ok=True)

@router.get("/", response_model=list[schemas.HeroImage])
def get_hero_images(db: Session = Depends(get_db)):
    return db.query(models.HeroImage).all()

@router.get("/{page_name}", response_model=schemas.HeroImage)
def get_hero_image_by_page(page_name: str, db: Session = Depends(get_db)):
    hero = db.query(models.HeroImage).filter(models.HeroImage.page == page_name).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero image not found")
    return hero

@router.post("/", response_model=schemas.HeroImage)
async def create_hero_image(
    page: str = Form(...),
    title: str = Form(...),
    alt_text: str = Form(""),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    # Check if page already exists
    existing = db.query(models.HeroImage).filter(models.HeroImage.page == page).first()
    if existing:
        raise HTTPException(status_code=400, detail="Hero image for this page already exists")
    
    final_url = image_url
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_location = f"static/images/{unique_filename}"
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        final_url = f"/static/images/{unique_filename}"
    
    db_hero = models.HeroImage(
        page=page,
        title=title,
        alt_text=alt_text,
        image_url=final_url
    )
    db.add(db_hero)
    db.commit()
    db.refresh(db_hero)
    return db_hero

@router.patch("/{hero_id}", response_model=schemas.HeroImage)
async def update_hero_image(
    hero_id: int,
    page: Optional[str] = Form(None),
    title: Optional[str] = Form(None),
    alt_text: Optional[str] = Form(None),
    image_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_hero = db.query(models.HeroImage).filter(models.HeroImage.id == hero_id).first()
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero image not found")
    
    if page is not None:
        # Check if page is unique
        existing = db.query(models.HeroImage).filter(models.HeroImage.page == page, models.HeroImage.id != hero_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Page already exists")
        db_hero.page = page
    
    if title is not None:
        db_hero.title = title
    if alt_text is not None:
        db_hero.alt_text = alt_text
    
    final_url = image_url
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_location = f"static/images/{unique_filename}"
        
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        final_url = f"/static/images/{unique_filename}"
    
    if final_url is not None:
        db_hero.image_url = final_url
    
    db.commit()
    db.refresh(db_hero)
    return db_hero

@router.delete("/{hero_id}")
def delete_hero_image(hero_id: int, db: Session = Depends(get_db)):
    db_hero = db.query(models.HeroImage).filter(models.HeroImage.id == hero_id).first()
    if not db_hero:
        raise HTTPException(status_code=404, detail="Hero image not found")
    db.delete(db_hero)
    db.commit()
    return {"message": "Hero image deleted successfully"}