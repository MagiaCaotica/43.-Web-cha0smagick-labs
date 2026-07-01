"""Check which files don't have Article schema."""
import json, re, os
root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
blog = os.path.join(root, 'blog')
for f in sorted(os.listdir(blog)):
    if not f.endswith('.html'):
        continue
    path = os.path.join(blog, f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    has_article = False
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL):
        try:
            data = json.loads(m.group(1))
            if data.get('@type') == 'Article':
                has_article = True
                break
        except:
            pass
    if not has_article:
        print(f'MISSING Article schema: {f}')
