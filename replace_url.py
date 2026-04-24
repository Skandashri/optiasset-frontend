import os

def replace_in_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    if 'http://localhost:8000' in content:
        print(f"Replacing in {file_path}")
        new_content = content.replace("http://localhost:8000", "https://asset-management-system-1-cm2v.onrender.com")
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

def scan_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    scan_directory(r"c:\Users\SKANDASHRI S N\tessacloud\optiasset-frontend\src")
