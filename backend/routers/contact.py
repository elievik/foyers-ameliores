from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
import os
import uuid
from database import get_db
from storage import upload_file_to_supabase
import models
import schemas

router = APIRouter()

# Ensure static/images directory exists
os.makedirs("static/images", exist_ok=True)


# ------------------------------
# Contact Info Endpoints
# ------------------------------
@router.get("/info", response_model=schemas.ContactInfo)
def get_contact_info(db: Session = Depends(get_db)):
    # Get first (and only) contact info
    contact_info = db.query(models.ContactInfo).first()
    if not contact_info:
        # Create default if not exists
        contact_info = models.ContactInfo()
        db.add(contact_info)
        db.commit()
        db.refresh(contact_info)
    return contact_info


@router.put("/info", response_model=schemas.ContactInfo)
def update_contact_info(
    phone: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    whatsapp_number: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    contact_info = db.query(models.ContactInfo).first()
    if not contact_info:
        contact_info = models.ContactInfo()
        db.add(contact_info)
    
    if phone is not None:
        contact_info.phone = phone
    if email is not None:
        contact_info.email = email
    if whatsapp_number is not None:
        contact_info.whatsapp_number = whatsapp_number
    
    db.commit()
    db.refresh(contact_info)
    return contact_info


# ------------------------------
# Regional Offices Endpoints
# ------------------------------
@router.get("/regional-offices", response_model=list[schemas.RegionalOffice])
def get_regional_offices(db: Session = Depends(get_db)):
    return db.query(models.RegionalOffice).order_by(models.RegionalOffice.order).all()


@router.get("/regional-offices/{office_id}", response_model=schemas.RegionalOffice)
def get_regional_office(office_id: int, db: Session = Depends(get_db)):
    office = db.query(models.RegionalOffice).filter(models.RegionalOffice.id == office_id).first()
    if not office:
        raise HTTPException(status_code=404, detail="Regional office not found")
    return office


@router.post("/regional-offices", response_model=schemas.RegionalOffice)
async def create_regional_office(
    name: str = Form(...),
    city: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    order: int = Form(0),
    img_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    final_img_url = img_url
    if file:
        final_img_url = await upload_file_to_supabase(file)
    
    db_office = models.RegionalOffice(
        name=name,
        city=city,
        phone=phone,
        address=address,
        order=order,
        img_url=final_img_url or ""
    )
    db.add(db_office)
    db.commit()
    db.refresh(db_office)
    return db_office


@router.patch("/regional-offices/{office_id}", response_model=schemas.RegionalOffice)
async def update_regional_office(
    office_id: int,
    name: Optional[str] = Form(None),
    city: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    address: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    img_url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    db_office = db.query(models.RegionalOffice).filter(models.RegionalOffice.id == office_id).first()
    if not db_office:
        raise HTTPException(status_code=404, detail="Regional office not found")
    
    if name is not None:
        db_office.name = name
    if city is not None:
        db_office.city = city
    if phone is not None:
        db_office.phone = phone
    if address is not None:
        db_office.address = address
    if order is not None:
        db_office.order = order
    
    final_img_url = img_url
    if file:
        final_img_url = await upload_file_to_supabase(file)
    
    if final_img_url is not None:
        db_office.img_url = final_img_url
    
    db.commit()
    db.refresh(db_office)
    return db_office


@router.delete("/regional-offices/{office_id}")
def delete_regional_office(office_id: int, db: Session = Depends(get_db)):
    db_office = db.query(models.RegionalOffice).filter(models.RegionalOffice.id == office_id).first()
    if not db_office:
        raise HTTPException(status_code=404, detail="Regional office not found")
    db.delete(db_office)
    db.commit()
    return {"message": "Regional office deleted successfully"}