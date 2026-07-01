"""Check paradigm-shift JSON-LD."""
import json, re, os
path = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog\paradigm-shift-belief-as-tool.html'
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL):
    data_str = m.group(1).strip()
    print(f'Found JSON-LD block, length={len(data_str)}')
    print(f'Starts: {data_str[:100]}')
    try:
        data = json.loads(data_str)
        print(f'Type: {data.get("@type")}')
        print(f'Keys: {list(data.keys())[:10]}')
    except json.JSONDecodeError as e:
        print(f'JSON error: {e}')
