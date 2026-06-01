from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

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
def create_team_member(member: schemas.TeamMemberCreate, db: Session = Depends(get_db)):
    db_member = models.TeamMember(**member.dict())
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.patch("/{member_id}", response_model=schemas.TeamMember)
def update_team_member(member_id: int, member: schemas.TeamMemberUpdate, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    for key, value in member.dict().items():
        setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

@router.delete("/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(db_member)
    db.commit()
    return {"message": "Member deleted"}
