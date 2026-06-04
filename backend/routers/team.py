from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
import os
import uuid
from typing import Optional

router = APIRouter(
    prefix="/api/team",
    tags=["team"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.TeamMember])
def get_team_members(db: Session = Depends(get_db)):
    return db.query(models.TeamMember).order_by(models.TeamMember.order).all()

@router.post("/", response_model=schemas.TeamMember)
async def create_team_member(
    name: str = Form(...),
    role: str = Form(...),
    icon: str = Form("person"),
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
    
    db_member = models.TeamMember(
        name=name,
        role=role,
        icon=icon,
        img_url=image_url,
        order=order
    )
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.patch("/{member_id}", response_model=schemas.TeamMember)
async def update_team_member(
    member_id: int,
    name: Optional[str] = Form(None),
    role: Optional[str] = Form(None),
    icon: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    img_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    if name:
        db_member.name = name
    if role:
        db_member.role = role
    if icon:
        db_member.icon = icon
    if order is not None:
        db_member.order = order
    
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        db_member.img_url = f"/static/images/{file_name}"
    elif img_url:
        db_member.img_url = img_url
    
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Delete file if it's a local file
    if db_member.img_url and db_member.img_url.startswith("/static/images/"):
        file_path = db_member.img_url.replace("/static/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(db_member)
    db.commit()
    return {"message": "Member deleted"}
