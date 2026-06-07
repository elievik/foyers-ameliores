from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict
from storage import upload_file_to_supabase, list_files_from_supabase, delete_file_from_supabase

router = APIRouter()

@router.get("/")
def get_media():
    """
    Retourne la liste des médias (photos) stockés dans le bucket Supabase.
    """
    files = list_files_from_supabase()
    return files

@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
    """
    Téléverse une nouvelle photo dans la médiathèque (Supabase).
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image.")
    
    url = await upload_file_to_supabase(file)
    return {"url": url, "name": file.filename}

@router.delete("/{filename}")
def delete_media(filename: str):
    """
    Supprime une photo de la médiathèque (Supabase).
    """
    success = delete_file_from_supabase(filename)
    if not success:
        raise HTTPException(status_code=500, detail="Erreur lors de la suppression du fichier.")
    return {"message": "Fichier supprimé avec succès."}
