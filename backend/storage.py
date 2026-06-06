import os
import uuid
from supabase import create_client, Client
from fastapi import UploadFile

SUPABASE_URL = os.getenv("SUPABASE_URL", "https://bpujrgwsnynydxmmkvab.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_wxs2HdE3on6x5XTEttnoQQ_QGdDeHNm")
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
            raise e
    return supabase

async def upload_file_to_supabase(file: UploadFile) -> str:
    """
    Uploads a file to Supabase storage and returns the public URL.
    """
    try:
        client = get_supabase_client()
        
        # Create bucket if it doesn't exist (this might fail if the key lacks permissions,
        # but we'll try catching it or assume the bucket exists)
        try:
            client.storage.get_bucket(BUCKET_NAME)
        except Exception:
            try:
                client.storage.create_bucket(BUCKET_NAME, public=True)
            except Exception as e:
                print(f"Bucket creation info/error: {e}")

        # Read file content
        content = await file.read()
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Upload to Supabase
        mime_type = file.content_type or "application/octet-stream"
        res = client.storage.from_(BUCKET_NAME).upload(
            file=content,
            path=unique_filename,
            file_options={"content-type": mime_type}
        )
        
        # Get public URL
        public_url = client.storage.from_(BUCKET_NAME).get_public_url(unique_filename)
        return public_url
    except Exception as e:
        print(f"Error uploading to Supabase: {e}")
        raise e
