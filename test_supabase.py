import asyncio
from supabase import create_client

SUPABASE_URL = "https://bpujrgwsnynydxmmkvab.supabase.co"
# Dummy key to see if client creation works with dummy key
SUPABASE_KEY = "sb_publishable_wxs2HdE3on6x5XTEttnoQQ_QGdDeHNm"

try:
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Client created successfully!")
except Exception as e:
    print("Client creation failed:", e)

