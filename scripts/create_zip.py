import zipfile
import os

def create_project_zip():
    exclude_dirs = {'node_modules', '.git', 'dist', '.cache', '__pycache__'}
    exclude_files = {'package-lock.json', 'bun.lock'}

    os.makedirs('public', exist_ok=True)
    zip_path = os.path.join('public', 'serenemind-ai.zip')

    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk('.'):
            dirs[:] = [d for d in dirs if d not in exclude_dirs and not d.startswith('.')]
            for file in files:
                if file in exclude_files or file.endswith('.pyc') or file == 'serenemind-ai.zip':
                    continue
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, '.')
                if rel_path.startswith('public/serenemind-ai.zip') or rel_path.startswith('public\\serenemind-ai.zip'):
                    continue
                zipf.write(full_path, rel_path)

    print(f"Generated {zip_path} ({os.path.getsize(zip_path)} bytes)")

if __name__ == '__main__':
    create_project_zip()
