"""Revert critical CSS: restore original <link>, remove inline style blocks."""
import re, os
ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
count = 0
for base in [ROOT, os.path.join(ROOT, 'blog'), os.path.join(ROOT, 'apps')]:
    for f in os.listdir(base):
        if not f.endswith('.html'): continue
        path = os.path.join(base, f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        if '/* CRITICAL CSS INLINED */' not in content: continue
        prefix = '../' if base != ROOT else ''
        old_style_link = f'{prefix}css/style.css'
        content = re.sub(r'\s*<style>\s*/\*\s*CRITICAL CSS INLINED\s*\*/(.*?)</style>', '', content, flags=re.DOTALL)
        deferred_pattern = re.compile(
            r'\s*<link rel="preload" href="' + re.escape(old_style_link) + r'" as="style" onload="this.rel=\'stylesheet\'">\s*<noscript><link rel="stylesheet" href="' + re.escape(old_style_link) + r'"></noscript>'
        )
        content = deferred_pattern.sub(f'\n    <link rel="stylesheet" href="{old_style_link}">', content)
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        count += 1
print(f'Reverted {count} pages')
