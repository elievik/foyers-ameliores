from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

@router.get("/", response_model=List[schemas.RegionStock])
def get_all_stocks(region: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.RegionStock)
    if region:
        query = query.filter(models.RegionStock.region == region)
    return query.all()

@router.post("/", response_model=schemas.RegionStock)
def init_or_update_stock(stock_in: schemas.RegionStockBase, db: Session = Depends(get_db)):
    stock = db.query(models.RegionStock).filter(models.RegionStock.region == stock_in.region).first()
    if stock:
        # Update existing
        stock.stock_asuto = stock_in.stock_asuto
    else:
        # Create new
        stock = models.RegionStock(region=stock_in.region, stock_asuto=stock_in.stock_asuto)
        db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock

@router.patch("/{region}", response_model=schemas.RegionStock)
def modify_stock(region: str, update: schemas.RegionStockUpdate, db: Session = Depends(get_db)):
    stock = db.query(models.RegionStock).filter(models.RegionStock.region == region).first()
    if not stock:
        stock = models.RegionStock(region=region, stock_asuto=update.stock_asuto)
        db.add(stock)
    else:
        stock.stock_asuto = update.stock_asuto
    db.commit()
    db.refresh(stock)
    return stock
