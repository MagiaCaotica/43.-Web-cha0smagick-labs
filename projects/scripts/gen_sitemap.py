# Generate complete sitemap.xml for cha0smagicklabs.com
import os
from datetime import datetime

base = 'https://cha0smagicklabs.com'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

pages = []
for dirpath, dirnames, filenames in os.walk(root):
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        abspath = os.path.join(dirpath, fn)
        relpath = os.path.relpath(abspath, root).replace('\\', '/')
        if relpath == '404.html':
            continue
        # Skip non-HTML template files
        if relpath.startswith('scripts/') or relpath.startswith('node_modules/'):
            continue
        # Skip duplicate root-level articles that exist in blog/
        if relpath == 'what-is-magick-how-spells-work.html':
            continue
        # Skip non-web directories
        pages.append(relpath)

now = datetime.now().strftime('%Y-%m-%d')

def get_priority(p):
    if p == 'index.html':
        return 1.0
    if p.startswith('blog/'):
        return 0.9
    if p.startswith('apps/'):
        return 0.8
    if p.startswith('tools/'):
        return 0.7
    if p.startswith('pages/'):
        return 0.6
    if p in ('glossary.html', 'best-occult-apps-android.html', 'privacy-policy.html'):
        return 0.7
    return 0.8

pages.sort(key=lambda p: (-get_priority(p), p))

lines = ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for p in pages:
    url = base if p == 'index.html' else f'{base}/{p}'
    lines.append('  <url>')
    lines.append(f'    <loc>{url}</loc>')
    lines.append(f'    <lastmod>{now}</lastmod>')
    lines.append(f'    <priority>{get_priority(p):.1f}</priority>')
    lines.append('  </url>')
lines.append('</urlset>')

sitemap_path = os.path.join(root, 'sitemap.xml')
with open(sitemap_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines) + '\n')

print(f'Sitemap generated: {len(pages)} URLs -> {sitemap_path}')
for p in pages:
    print(f'  {get_priority(p):.1f} {base if p == "index.html" else f"{base}/{p}"}')
