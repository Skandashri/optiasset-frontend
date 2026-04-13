import os
import re

api_expr = "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}"

def patch_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'http://localhost:8000' not in content:
        return
        
    print(f"Patching {path}...")
    
    # 1. Replace double-quote urls 
    # e.g. "http://localhost:8000/api/users" -> `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/users`
    # Also matches exact base url without trailing slash
    content = re.sub(r'"http://localhost:8000/api([^"]*)"', r'`' + api_expr + r'/api\1`', content)
    content = re.sub(r'"http://localhost:8000([^"]*)"', r'`' + api_expr + r'\1`', content)
    
    # 2. Replace backtick urls
    # e.g. `http://localhost:8000/api/users/${id}` -> `${process.env...}/api/users/${id}`
    content = re.sub(r'`http://localhost:8000/api([^`]*)`', r'`' + api_expr + r'/api\1`', content)
    content = re.sub(r'`http://localhost:8000([^`]*)`', r'`' + api_expr + r'\1`', content)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            patch_file(os.path.join(root, file))
