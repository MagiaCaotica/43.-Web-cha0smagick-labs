# Generate complete sitemap.xml for cha0smagicklabs.com
import os
from datetime import datetime

base = 'https://cha0smagicklabs.com'
# Site root is two levels up from projects/scripts/
root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

EXCLUDE_DIRS = {
    'node_modules', 'auto-shorts', 'scripts', 'data', 'projects',
    'pinterest-pins', '.git', '__pycache__', 'venv', 'env',
    'ffmpeg_extracted', 'tools', 'es/tools'
}

pages = []
for dirpath, dirnames, filenames in os.walk(root):
    # Skip excluded directories
    rel_dir = os.path.relpath(dirpath, root).replace('\\', '/')
    if any(rel_dir.startswith(excl) or excl in rel_dir.split('/') for excl in EXCLUDE_DIRS):
        dirnames[:] = []  # Don't recurse into subdirs
        continue
    
    for fn in filenames:
        if not fn.endswith('.html'):
            continue
        abspath = os.path.join(dirpath, fn)
        relpath = os.path.relpath(abspath, root).replace('\\', '/')
        if relpath == '404.html':
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
    if p == 'dark-fantasy-gallery.html' or p == 'es/dark-fantasy-gallery.html':
        return 0.9
    if p.startswith('dark-fantasy/') or p.startswith('es/dark-fantasy/'):
        return 0.8
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

# Also copy to projects/ for reference
import shutil
shutil.copy2(sitemap_path, os.path.join(os.path.dirname(__file__), 'sitemap.xml'))
