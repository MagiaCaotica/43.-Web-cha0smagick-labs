"""Verify speakable injection in flat and @graph Article schemas."""
import json, re, os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
tests = [
    ('flat', os.path.join(root, 'blog', 'astral-projection-techniques-beginners.html')),
    ('@graph', os.path.join(root, 'blog', 'paradigm-shift-belief-as-tool.html')),
    ('no Article', os.path.join(root, 'blog', 'index.html')),
]

for label, path in tests:
    with open(path, 'r', encoding='utf-8') as fh:
        c = fh.read()
    found_speakable = False
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
        try:
            data = json.loads(m.group(1))
            if '@graph' in data:
                for item in data['@graph']:
                    if 'speakable' in item:
                        found_speakable = True
                        print(f'[{label}] speakable in @graph>: {json.dumps(item["speakable"], indent=2)}')
            elif 'speakable' in data:
                found_speakable = True
                print(f'[{label}] speakable: {json.dumps(data["speakable"], indent=2)}')
        except:
            pass
    if not found_speakable:
        print(f'[{label}] No speakable found (expected for non-Article)')
