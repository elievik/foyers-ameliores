import asyncio
from supabase import create_client

SUPABASE_URL = "https://bpujrgwsnynydxmmkvab.supabase.co"
SUPABASE_KEY = "sb_publishable_wxs2HdE3on6x5XTEttnoQQ_QGdDeHNm"

client = create_client(SUPABASE_URL, SUPABASE_KEY)
try:
    res = client.storage.create_bucket("foyers-images", {"public": True})
    print("Created!", res)
except Exception as e:
    print("Failed:", type(e), e)
