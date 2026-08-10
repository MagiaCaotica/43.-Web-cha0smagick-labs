"""Debug the speakable check conditions."""
import os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
path = os.path.join(root, 'blog', 'astral-projection-techniques-beginners.html')
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()

print('Article in content:', 'Article' in c)
print('json+ld in content:', 'ld+json' in c)
print('Article with ld+json in content:', 'Article' in c and 'ld+json' in c)

# Check the exact patterns
import re
matches = list(re.finditer(r'<script type="application/ld\+json">(.*?)</script>', c, re.DOTALL))
print(f'JSON-LD blocks found: {len(matches)}')
for m in matches:
    data = m.group(1).strip()
    if 'Article' in data or 'Article' in data:
        print(f'  Contains Article: length={len(data)}, starts with: {data[:50]}')

# Check the main() function condition
cond1 = 'Article' not in c
cond2 = '"@type": "Article"' not in c
print(f'cond1 (Article not in content): {cond1}')
print(f'cond2 (@type Article not in content): {cond2}')
if cond1 or cond2:
    print(f'  Would skip this article!')
    
# Check exact @type: Article pattern
if '"@type": "Article"' in c:
    print('EXACT match: "@type": "Article" found')
else:
    # Try with more flexible matching
    if '@type' in c:
        idx = c.find('@type')
        print(f'  @type found at {idx}: ...{c[idx:idx+50]}...')
