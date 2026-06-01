from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from database import SessionLocal
import models
import schemas
import os
import uuid
from typing import Optional

router = APIRouter(
    prefix="/api/product-images",
    tags=["product-images"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=list[schemas.ProductImage])
def get_all_images(db: Session = Depends(get_db)):
    return db.query(models.ProductImage).order_by(models.ProductImage.product_name, models.ProductImage.order).all()


@router.get("/product/{product_name}", response_model=list[schemas.ProductImage])
def get_product_images(product_name: str, db: Session = Depends(get_db)):
    return db.query(models.ProductImage).filter(models.ProductImage.product_name == product_name).order_by(models.ProductImage.order).all()


@router.post("/", response_model=schemas.ProductImage)
async def create_product_image(
    product_name: str = Form(...),
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
    
    db_image = models.ProductImage(
        product_name=product_name,
        img_url=image_url,
        order=order
    )
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


@router.patch("/{image_id}", response_model=schemas.ProductImage)
async def update_product_image(
    image_id: int,
    product_name: Optional[str] = Form(None),
    order: Optional[int] = Form(None),
    file: Optional[UploadFile] = File(None),
    img_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    if product_name:
        db_image.product_name = product_name
    if order is not None:
        db_image.order = order
    
    if file:
        file_extension = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = f"static/images/{file_name}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        db_image.img_url = f"/static/images/{file_name}"
    elif img_url:
        db_image.img_url = img_url
    
    db.commit()
    db.refresh(db_image)
    return db_image


@router.delete("/{image_id}")
def delete_product_image(image_id: int, db: Session = Depends(get_db)):
    db_image = db.query(models.ProductImage).filter(models.ProductImage.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    # Delete file if it's a local file
    if db_image.img_url.startswith("/static/images/"):
        file_path = db_image.img_url.replace("/static/", "")
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.delete(db_image)
    db.commit()
    return {"message": "Image deleted"}
