from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import database
import models
import schemas

router = APIRouter()
get_db = database.get_db

# Obtenir tous les articles
@router.get("/", response_model=List[schemas.NewsArticle])
def get_articles(db: Session = Depends(get_db)):
    return db.query(models.NewsArticle).all()

# Obtenir un article par ID
@router.get("/{article_id}", response_model=schemas.NewsArticle)
def get_article(article_id: int, db: Session = Depends(get_db)):
    db_article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

# Créer un article
@router.post("/", response_model=schemas.NewsArticle)
def create_article(article: schemas.NewsArticleCreate, db: Session = Depends(get_db)):
    db_article = models.NewsArticle(**article.dict())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

# Supprimer un article
@router.delete("/{article_id}")
def delete_article(article_id: int, db: Session = Depends(get_db)):
    db_article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    db.delete(db_article)
    db.commit()
    return {"message": "Article deleted successfully"}
