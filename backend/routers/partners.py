from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
import os
import uuid
from typing import Optional

router = APIRouter(
    prefix="/api/partners",
    tags=["partners"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Partner])
def get_partners(db: Session = Depends(get_db)):
    return db.query(models.Partner).order_by(models.Partner.order).all()

@router.post("/", response_model=schemas.Partner)
async def create_partner(
    name: str = Form(...),
    order: int = Form(0),
    file: Optional[UploadFile] = File(None),
    logo_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    image_url = logo_url
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        image_url = f"/static/images/{file_name}"
    
    if not image_url:
        raise HTTPException(status_code=400, detail="Either file or logo_url must be provided")
    
    db_partner = models.Partner(
        name=name,
        logo_url=image_url,
        order=order
    )
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    return db_partner

@router.patch("/{partner_id}", response_model=schemas.Partner)
async def update_partner(
    partner_id: int,
    name: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    logo_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    if name:
        db_partner.name = name
    if order is not None:
        db_partner.order = order
    
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        db_partner.logo_url = f"/static/images/{file_name}"
    elif logo_url:
        db_partner.logo_url = logo_url
    
    db.commit()
    db.refresh(db_partner)
    return db_partner

@router.delete("/{partner_id}")
def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    db_partner = db.query(models.Partner).filter(models.Partner.id == partner_id).first()
    if not db_partner:
        raise HTTPException(status_code=404, detail="Partner not found")
    
    # Delete file if it's a local file
    if db_partner.logo_url.startswith("/static/images/"):
        file_path = db_partner.logo_url.replace("/static/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(db_partner)
    db.commit()
    return {"message": "Partner deleted"}
