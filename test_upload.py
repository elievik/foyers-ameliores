import asyncio
from supabase import create_client
import uuid

SUPABASE_URL = "https://bpujrgwsnynydxmmkvab.supabase.co"
SUPABASE_KEY = "sb_publishable_wxs2HdE3on6x5XTEttnoQQ_QGdDeHNm"

async def test():
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Try bucket creation
    try:
        client.storage.get_bucket("foyers-images")
        print("Bucket exists!")
    except Exception as e:
        print("Bucket get failed:", e)
        try:
            client.storage.create_bucket("foyers-images", public=True)
            print("Bucket created!")
        except Exception as e2:
            print("Bucket creation failed:", e2)

    # Try upload
    try:
        data = b"Hello world"
        file_name = f"test_{uuid.uuid4()}.txt"
        res = client.storage.from_("foyers-images").upload(
            file=data,
            path=file_name,
            file_options={"content-type": "text/plain"}
        )
        print("Upload successful!", res)
    except Exception as e3:
        print("Upload failed:", type(e3), e3)

asyncio.run(test())
