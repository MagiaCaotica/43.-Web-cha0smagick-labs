"""Debug: Check JSON-LD Article schema format."""
import json, re, os
root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
path = os.path.join(root, 'blog', 'astral-projection-techniques-beginners.html')
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()

# Find all JSON-LD blocks
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
    try:
        data = json.loads(m.group(1).strip())
        t = data.get('@type', 'N/A')
        print(f'Type: {t}')
        print(f'Has speakable: {"speakable" in data}')
        print(f'Keys: {list(data.keys())}')
        print(f'Raw JSON snippet: {m.group(1).strip()[:200]}')
        print()
    except json.JSONDecodeError as e:
        print(f'JSON error: {e}')
        print(f'Raw: {m.group(1).strip()[:200]}')
        print()
