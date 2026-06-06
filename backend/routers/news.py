from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import database
from storage import upload_file_to_supabase
import models
import schemas
import os
import uuid
from datetime import date

router = APIRouter()
get_db = database.get_db

# Helper to generate slug
def generate_slug(title: str) -> str:
    return title.lower().replace(' ', '-').replace("'", '').replace('"', '')

# Obtenir tous les articles
@router.get("/", response_model=List[schemas.NewsArticle])
def get_articles(db: Session = Depends(get_db)):
    return db.query(models.NewsArticle).all()

# Obtenir un article par ID
@router.get("/id/{article_id}", response_model=schemas.NewsArticle)
def get_article_by_id(article_id: int, db: Session = Depends(get_db)):
    db_article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

# Obtenir un article par slug
@router.get("/slug/{slug}", response_model=schemas.NewsArticle)
def get_article_by_slug(slug: str, db: Session = Depends(get_db)):
    db_article = db.query(models.NewsArticle).filter(models.NewsArticle.slug == slug).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return db_article

# Créer un article avec fichier upload
@router.post("/", response_model=schemas.NewsArticle)
async def create_article(
    title: str = Form(...),
    content: str = Form(...),
    region: str = Form(...),
    author: str = Form(...),
    status: str = Form("Brouillon"),
    featured: int = Form(0),
    date: Optional[date] = Form(None),
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    article_date = date or date.today()
    slug = generate_slug(title)
    
    # Handle image
    final_image_url = image_url
    if file:
        final_image_url = await upload_file_to_supabase(file)
    
    db_article = models.NewsArticle(
        title=title,
        slug=slug,
        content=content,
        region=region,
        author=author,
        status=status,
        featured=featured,
        date=article_date,
        image_url=final_image_url
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

# Mettre à jour un article
@router.patch("/{article_id}", response_model=schemas.NewsArticle)
async def update_article(
    article_id: int,
    title: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    region: Optional[str] = Form(None),
    author: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    featured: Optional[int] = Form(None),
    date: Optional[date] = Form(None),
    file: Optional[UploadFile] = File(None),
    image_url: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    db_article = db.query(models.NewsArticle).filter(models.NewsArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    if title:
        db_article.title = title
        db_article.slug = generate_slug(title)
    if content:
        db_article.content = content
    if region:
        db_article.region = region
    if author:
        db_article.author = author
    if status:
        db_article.status = status
    if featured is not None:
        db_article.featured = featured
    if date:
        db_article.date = date
        
    # Handle image
    if file:
        db_article.image_url = await upload_file_to_supabase(file)
    elif image_url:
        db_article.image_url = image_url
        
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
