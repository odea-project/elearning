import os
import yaml
import json

# Set your markdown directory here
MARKDOWN_DIR = './topics'
OUTPUT_JSON = './resources/misc/md-manifest.json'

def extract_yaml_header(filepath):
    with open(filepath, encoding='utf-8') as f:
        lines = f.readlines()
    if not lines or not lines[0].startswith('---'):
        return {}
    yaml_lines = []
    for line in lines[1:]:
        if line.startswith('---'):
            break
        yaml_lines.append(line)
    if not yaml_lines:
        return {}
    try:
        return yaml.safe_load(''.join(yaml_lines))
    except Exception as e:
        print(f"YAML error in {filepath}: {e}")
        return {}

manifest = []

# Register main markdown directory
for root, _, files in os.walk(MARKDOWN_DIR):
    for name in files:
        if name.lower().endswith('.md'):
            path = os.path.join(root, name)
            rel_path = os.path.relpath(path, MARKDOWN_DIR)
            header = extract_yaml_header(path)
            manifest.append({
                'filename': rel_path,
                'title': header.get('title', name),
                'keywords': header.get('keywords', []),
                'thumbnail': header.get('thumbnail', None),
                'requirements': header.get('requirements', [])
            })

os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2, ensure_ascii=False)
print(f"Manifest written to {OUTPUT_JSON}")