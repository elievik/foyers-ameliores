from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas

router = APIRouter(
    prefix="/api/testimonials",
    tags=["testimonials"],
)

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
def create_testimonial(testimonial: schemas.TestimonialCreate, db: Session = Depends(get_db)):
    db_testimonial = models.Testimonial(**testimonial.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.patch("/{testimonial_id}", response_model=schemas.Testimonial)
def update_testimonial(testimonial_id: int, testimonial: schemas.TestimonialUpdate, db: Session = Depends(get_db)):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for key, value in testimonial.dict().items():
        setattr(db_testimonial, key, value)
    db.commit()
    db.refresh(db_testimonial)
    return db_testimonial


@router.delete("/{testimonial_id}")
def delete_testimonial(testimonial_id: int, db: Session = Depends(get_db)):
    db_testimonial = db.query(models.Testimonial).filter(models.Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(db_testimonial)
    db.commit()
    return {"message": "Testimonial deleted"}
