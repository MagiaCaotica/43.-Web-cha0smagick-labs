"""
Remove hreflang="es" tags from all HTML pages (no Spanish pages exist yet).
"""
import os, re

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

def process():
    count = 0
    for dirpath, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'env')]
        for f in files:
            if not f.endswith('.html'):
                continue
            path = os.path.join(dirpath, f)
            with open(path, 'r', encoding='utf-8') as fh:
                content = fh.read()
            original = content
            # Remove lines containing hreflang="es"
            content = re.sub(r'\s*<link\s+rel="alternate"\s+href="[^"]*"\s+hreflang="es"\s*/?>\s*', '', content)
            content = re.sub(r'\s*<link\s+rel="alternate"\s+hreflang="es"\s+href="[^"]*"\s*/?>\s*', '', content)
            if content != original:
                with open(path, 'w', encoding='utf-8') as fh:
                    fh.write(content)
                count += 1
                print(f'  removed es hreflang: {path}')
    print(f'\nDone! {count} pages updated.')

if __name__ == '__main__':
    process()
