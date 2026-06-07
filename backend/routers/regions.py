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

@router.get("/", response_model=list[schemas.Region])
def get_regions(db: Session = Depends(get_db)):
    return db.query(models.Region).order_by(models.Region.order).all()

@router.post("/", response_model=schemas.Region)
async def create_region(
    name: str = Form(...),
    distributed: str = Form("0"),
    icon: str = Form("public"),
    activity: str = Form("Aucune activité enregistrée"),
    quote: Optional[str] = Form(None),
    cite: Optional[str] = Form(None),
    order: int = Form(0),
    file: Optional[UploadFile] = File(None),
    img_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_url = img_url
    if file:
        image_url = await upload_file_to_supabase(file)
    
    if not image_url:
        raise HTTPException(status_code=400, detail="Either file or img_url must be provided")
    
    db_region = models.Region(
        name=name,
        distributed=distributed,
        icon=icon,
        activity=activity,
        quote=quote,
        cite=cite,
        img_url=image_url,
        order=order
    )
    db.add(db_region)
    db.commit()
    db.refresh(db_region)
    return db_region

@router.patch("/{region_id}", response_model=schemas.Region)
async def update_region(
    region_id: int,
    name: Optional[str] = Form(None),
    distributed: Optional[str] = Form(None),
    icon: Optional[str] = Form(None),
    activity: Optional[str] = Form(None),
    quote: Optional[str] = Form(None),
    cite: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    img_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_region = db.query(models.Region).filter(models.Region.id == region_id).first()
    if not db_region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    if name:
        db_region.name = name
    if distributed is not None:
        db_region.distributed = distributed
    if icon:
        db_region.icon = icon
    if activity:
        db_region.activity = activity
    if quote is not None:
        db_region.quote = quote
    if cite is not None:
        db_region.cite = cite
    if order is not None:
        db_region.order = order
    
    if file:
        db_region.img_url = await upload_file_to_supabase(file)
    elif img_url:
        db_region.img_url = img_url
    
    db.commit()
    db.refresh(db_region)
    return db_region

@router.delete("/{region_id}")
def delete_region(region_id: int, db: Session = Depends(get_db)):
    db_region = db.query(models.Region).filter(models.Region.id == region_id).first()
    if not db_region:
        raise HTTPException(status_code=404, detail="Region not found")
    
    db.delete(db_region)
    db.commit()
    return {"message": "Region deleted"}
