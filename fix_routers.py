import os, glob, re

for r in glob.glob("backend/routers/*.py"):
    if r in ["backend/routers/__init__.py"]:
        continue
    with open(r, "r") as f:
        code = f.read()

    # Add imports
    if "from storage import upload_file_to_supabase" not in code and "UploadFile" in code:
        if "from database import get_db" in code:
            code = code.replace("from database import get_db", "from database import get_db\nfrom storage import upload_file_to_supabase")
        elif "import database" in code:
            code = code.replace("import database", "import database\nfrom storage import upload_file_to_supabase")
        elif "from database import SessionLocal" in code:
            code = code.replace("from database import SessionLocal", "from database import SessionLocal\nfrom storage import upload_file_to_supabase")

    # The block we want to replace usually looks like this:
    #         file_extension = os.path.splitext(file.filename)[1]
    #         file_name = f"{uuid.uuid4()}{file_extension}"
    #         file_path = f"static/images/{file_name}" (or static/{file_name})
    #         with open(file_path, "wb") as buffer: (or as f)
    #             content = await file.read()
    #             buffer.write(content)
    #         image_url = f"/static/images/{file_name}"
    
    # We will use regex to find this entire block and replace it.
    # We capture the leading whitespace, and the variable being assigned the URL.
    
    # regex matches from `file_extension` up to the URL assignment.
    pattern = r'( +)file_extension = os\.path\.splitext\(file\.filename\)\[1\].*?\n\1([a-zA-Z0-9_\.]+) = f"/static/[^"]+"'
    
    def repl(m):
        spaces = m.group(1)
        var_name = m.group(2)
        return f"{spaces}{var_name} = await upload_file_to_supabase(file)"
        
    new_code = re.sub(pattern, repl, code, flags=re.DOTALL)
    
    if new_code != code:
        with open(r, "w") as f:
            f.write(new_code)
        print("Fixed", r)

