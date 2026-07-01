"""Check blog article content structure for speakable schema."""
import re, os
root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
for f in ['blog/astral-projection-techniques-beginners.html', 'blog/sigil-engine-cryptographic-guide.html', 'blog/chaos-magick-beginners-complete-guide.html']:
    path = os.path.join(root, f)
    with open(path, 'r', encoding='utf-8') as fh:
        c = fh.read()
    print(f'=== {f} ===')
    # Find all article-like tags with their classes
    for m in re.finditer(r'<(article|main|section|div)[^>]*class="([^"]*)"', c):
        print(f'  <{m.group(1)} class="{m.group(2)}">')
    # Find the first h1
    h1 = re.search(r'<h1[^>]*>(.*?)</h1>', c)
    if h1: print(f'  H1: {h1.group(1)[:80]}')
    # Find blog-meta
    meta = re.search(r'class="blog-meta"', c)
    if meta: print(f'  Has blog-meta class')
    # Check for any content wrapper
    for cls in ['content', 'article', 'post', 'entry', 'main']:
        if re.search(r'class="[^"]*' + cls + '[^"]*"', c):
            print(f'  Has class containing "{cls}"')
    print()
