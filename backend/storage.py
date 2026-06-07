import os
import uuid
# pyrefly: ignore [missing-import]
from supabase import create_client, Client
from fastapi import UploadFile, HTTPException

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://bpujrgwsnynydxmmkvab.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwdWpyZ3dzbnlueWR4bW1rdmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NjgzNTMsImV4cCI6MjA5NjM0NDM1M30.MMi_Ij9xPWi2-gi0Ppeip1paS5R0d8IF6RlHRFCBkbk")
BUCKET_NAME = os.getenv("SUPABASE_BUCKET", "foyers-images")

# We don't initialize globally to avoid crashing the server on startup if the key is invalid.
supabase: Client = None

def get_supabase_client() -> Client:
    global supabase
    if supabase is None:
        try:
            supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        except Exception as e:
            print(f"Failed to initialize Supabase client: {e}")
            raise HTTPException(status_code=500, detail=f"Erreur de configuration Supabase: {str(e)}")
    return supabase

async def upload_file_to_supabase(file: UploadFile) -> str:
    """
    Uploads a file to Supabase storage and returns the public URL.
    """
    try:
        client = get_supabase_client()
        
        # Read file content
        content = await file.read()
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Upload to Supabase
        mime_type = file.content_type or "application/octet-stream"
        
        try:
            res = client.storage.from_(BUCKET_NAME).upload(
                file=content,
                path=unique_filename,
                file_options={"content-type": mime_type}
            )
        except Exception as e:
            print("Supabase Upload Error:", str(e))
            if "Bucket not found" in str(e):
                raise HTTPException(status_code=400, detail=f"Le dossier (bucket) '{BUCKET_NAME}' n'existe pas sur Supabase. Veuillez le créer.")
            if "row-level security" in str(e).lower() or "unauthorized" in str(e).lower() or "new row violates" in str(e).lower():
                raise HTTPException(status_code=403, detail="Permission refusée par Supabase. Utilisez la clé 'service_role' ou configurez les policies.")
            raise HTTPException(status_code=500, detail=f"Erreur lors de l'envoi sur Supabase: {str(e)}")
        
        # Get public URL
        public_url = client.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
        return public_url
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur inattendue: {str(e)}")

def list_files_from_supabase() -> list:
    """
    List all files in the Supabase bucket.
    """
    try:
        client = get_supabase_client()
        res = client.storage.from_(BUCKET_NAME).list()
        
        media = []
        for f in res:
            if f.get('name') and not f.get('name').startswith('.'):
                url = client.storage.from_(BUCKET_NAME).get_public_url(f['name'])
                media.append({
                    "id": f.get('id', f['name']),
                    "name": f['name'],
                    "url": url,
                    "created_at": f.get('created_at')
                })
        
        # Sort by creation date descending
        media.sort(key=lambda x: x.get('created_at') or '', reverse=True)
        return media
    except Exception as e:
        print(f"Error listing files from Supabase: {e}")
        return []

def delete_file_from_supabase(filename: str) -> bool:
    """
    Deletes a file from Supabase storage.
    """
    try:
        client = get_supabase_client()
        res = client.storage.from_(BUCKET_NAME).remove([filename])
        return True
    except Exception as e:
        print(f"Error deleting file from Supabase: {e}")
        return False
