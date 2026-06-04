from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
import os
import uuid
from typing import Optional

router = APIRouter(
    prefix="/api/regions",
    tags=["regions"],
)

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
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        image_url = f"/static/images/{file_name}"
    
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
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        db_region.img_url = f"/static/images/{file_name}"
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
    
    # Delete file if it's a local file
    if db_region.img_url.startswith("/static/images/"):
        file_path = db_region.img_url.replace("/static/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(db_region)
    db.commit()
    return {"message": "Region deleted"}
