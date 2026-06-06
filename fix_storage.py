import os
import glob
import re

routers = glob.glob("backend/routers/*.py")

for r in routers:
    if r == "backend/routers/hero_images.py":
        continue
    with open(r, "r") as f:
        content = f.read()
    
    if "from storage import upload_file_to_supabase" not in content:
        content = content.replace("from database import get_db", "from database import get_db\nfrom storage import upload_file_to_supabase")
        # if not found
        if "from database import get_db" not in content:
             content = content.replace("import database", "import database\nfrom storage import upload_file_to_supabase")

    # Replace the block for image upload
    # Pattern to match:
    #     if file:
    #         file_extension = ...
    #         ...
    #         final_url = f"/static/images/{unique_filename}"
    
    # We will use regex to find:
    # if file:
    #    [any indented lines until the block ends]
    
    # Actually, simpler to just find `with open(..., "wb")` and surrounding lines.
    
    # Let's replace the whole `if file:` block manually or via regex carefully.
    
    new_content = re.sub(
        r'if\s+file:\s+file_extension.*?final_url\s*=\s*f"/static/images/\{unique_filename\}"',
        r'if file:\n        final_url = await upload_file_to_supabase(file)',
        content,
        flags=re.DOTALL
    )
    
    # for reports.py
    new_content = re.sub(
        r'if\s+file:\s+file_extension.*?final_file_url\s*=\s*f"/static/\{file_name\}"',
        r'if file:\n        final_file_url = await upload_file_to_supabase(file)',
        new_content,
        flags=re.DOTALL
    )
    
    # for contact.py where final_img_url is used
    new_content = re.sub(
        r'if\s+file:\s+file_extension.*?final_img_url\s*=\s*f"/static/images/\{unique_filename\}"',
        r'if file:\n        final_img_url = await upload_file_to_supabase(file)',
        new_content,
        flags=re.DOTALL
    )
    
    if content != new_content:
        with open(r, "w") as f:
            f.write(new_content)
        print(f"Updated {r}")
