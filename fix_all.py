import os, glob, re

for r in glob.glob("backend/routers/*.py"):
    if r in ["backend/routers/hero_images.py", "backend/routers/reports.py", "backend/routers/contact.py"]:
        continue
        
    with open(r, "r") as f:
        code = f.read()
        
    if "from storage import upload_file_to_supabase" not in code:
        if "from database import get_db" in code:
            code = code.replace("from database import get_db", "from database import get_db\nfrom storage import upload_file_to_supabase")
        elif "import database" in code:
            code = code.replace("import database", "import database\nfrom storage import upload_file_to_supabase")
        elif "from database import SessionLocal" in code:
            code = code.replace("from database import SessionLocal", "from database import SessionLocal\nfrom storage import upload_file_to_supabase")
            
    # Replace anything inside "if file:" up to the URL assignment
    # e.g., image_url = f"/static/images/{file_name}"
    # Let's find:
    # if file:
    #     ...
    #     <var_name> = f"/static/images/{...}"
    
    pattern = r'(if\s+file:\s+).*?([a-zA-Z0-9_]+)\s*=\s*f"/static/[^"]+"'
    
    def repl(m):
        return f"{m.group(1)}    {m.group(2)} = await upload_file_to_supabase(file)"
        
    new_code = re.sub(pattern, repl, code, flags=re.DOTALL)
    
    # Also handle db_member.img_url = f"/static/images/{file_name}" (like in patch endpoints)
    pattern2 = r'(if\s+file:\s+).*?(db_[a-zA-Z0-9_]+\.[a-zA-Z0-9_]+)\s*=\s*f"/static/[^"]+"'
    def repl2(m):
        return f"{m.group(1)}    {m.group(2)} = await upload_file_to_supabase(file)"
    new_code = re.sub(pattern2, repl2, new_code, flags=re.DOTALL)

    if new_code != code:
        with open(r, "w") as f:
            f.write(new_code)
        print("Fixed", r)
    else:
        print("No change in", r)
