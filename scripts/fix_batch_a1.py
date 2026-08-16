# -*- coding: utf-8 -*-
# One-off atomic fixer for batch A1 issues:
#  1) articles 36 & 40: related pairs [RT[k], RT[k]] (title in slug slot) -> [k, RT[k]]
#  2) blog/{36,40}.html: related hrefs ../blog/{Title}.html -> ../blog/{slug}.html
#  3) descs >160: why-stop-paying-subscription-occult-apps (166), free-tools-vs-premium-apps-occult (161)
#     -> trim in data file AND html meta, both <=160
import re, sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__)))
from related_titles import RELATED_TITLES as RT

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
title_to_slug = {v: k for k, v in RT.items()}

def patch(path, fn):
    with open(path, 'r', encoding='utf-8') as f:
        src = f.read()
    new = fn(src)
    if new != src:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new)
        return True
    return False

def trim_desc(d, limit=160):
    if len(d) <= limit:
        return d
    cut = d[:limit]
    cut = cut.rsplit(' ', 1)[0]
    return cut.rstrip(' ,-;:.') + '.'

changed = []

# 1) fix .py related pairs in articles 36 & 40
for num in (36, 40):
    p = os.path.join(ROOT, 'scripts', f'article_{num}.py')
    def fix_related(src):
        return re.sub(
            r'\[RT\["([^"]+)"\], RT\["\1"\]\]',
            lambda m: f'["{m.group(1)}", RT["{m.group(1)}"]]',
            src,
        )
    if patch(p, fix_related):
        changed.append(f'article_{num}.py related pairs')

# 2) fix hrefs in the two built HTML files
for num, slug in ((36, 'best-sigil-generator-app-onetime'), (40, 'one-time-vs-subscription-calculator-occult')):
    p = os.path.join(ROOT, 'blog', slug + '.html')
    def fix_href(src):
        def repl(m):
            title = m.group(1)
            s = title_to_slug.get(title)
            return f'../blog/{s}.html' if s else m.group(0)
        return re.sub(r'href="\.\./blog/([^"]+)\.html"', repl, src)
    if patch(p, fix_href):
        changed.append(f'blog/{slug}.html hrefs')

# 3) trim 2 descs in data files + html
desc_fixes = {
    'why-stop-paying-subscription-occult-apps': (
        'Why I Stopped Paying for Subscription Occult Apps (2026)',
        'Subscription fatigue is real: $9.99 monthly apps cost $359 over three years. One-time occult apps with no ads, no accounts, and no fees explained.',
    ),
    'free-tools-vs-premium-apps-occult': (
        'Free Tools vs Premium Apps: What You Actually Gain by Upgrading (2026)',
        'Free occult tools are great for trying a practice. Here is exactly what you gain from premium apps, and how to decide in ten minutes.',
    ),
}
# map slug -> data file
slug_to_file = {
    'why-stop-paying-subscription-occult-apps': 'scripts/article_34.py',
    'free-tools-vs-premium-apps-occult': 'scripts/article_39.py',
}
for slug, (title, new_desc) in desc_fixes.items():
    assert len(new_desc) <= 160, f'{slug} new desc too long: {len(new_desc)}'
    # data file desc literal
    df = os.path.join(ROOT, slug_to_file[slug])
    def fix_data_desc(src):
        return re.sub(r'^(\s*"desc": ")[^"]*(",\s*)$', lambda m: m.group(1) + new_desc + m.group(2), src, flags=re.M)
    if patch(df, fix_data_desc):
        changed.append(f'{slug_to_file[slug]} desc')
    # html meta
    hp = os.path.join(ROOT, 'blog', slug + '.html')
    def fix_html_desc(src):
        return re.sub(r'(<meta name="description" content=")[^"]*(")',
                      lambda m: m.group(1) + new_desc + m.group(2), src)
    if patch(hp, fix_html_desc):
        changed.append(f'blog/{slug}.html desc')

print('CHANGED:', changed if changed else 'nothing')
