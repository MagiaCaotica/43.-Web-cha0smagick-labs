# -*- coding: utf-8 -*-
"""Audit for Batch C2 (A121-A130): desc<=160, slop, dead links, sitemap count."""
import glob
import os
import re

ROOT = os.path.abspath('.')
SLUGS = [
    'what-is-a-zener-card-definition-history-statistics',
    'esp-test-statistics-explained-for-beginners',
    'all-24-elder-futhark-runes-complete-reference',
    'the-78-tarot-cards-complete-reference-list',
    'the-72-goetia-spirits-complete-ranked-list',
    'i-ching-hexagram-list-all-64-one-line-meanings',
    'moon-phases-explained-dates-energies-rituals',
    'lucid-dreaming-statistics-what-research-shows',
    'what-is-a-spirit-box-how-it-works-frequencies',
    'sigil-magic-statistics-does-it-work',
]

SLOP_PATTERNS = [
    r'\bdelve\b', r'\btapestry\b', r'\bjourney\b(?![\-\s]*(is|of|through|card|reading|tarot))(?=[\-\s]+[a-z])',
    r'\bunlock\b', r'\bembark\b', r'\bseamless\b', r'\bpowerhouse\b', r'\bgame-chang',
    r'\bleverage\b', r'\bfoster\b', r'\bholistic\b', r'\bharness\b', r'\bcrucial\b',
    r"in today's fast-paced", r'in the world of', r"whether you're a seasoned", r'\bempower',
]

# ---- 1. desc <= 160 across all article files ----
bad_desc = []
files = sorted(glob.glob(os.path.join('scripts', 'article_*.py')))
for f in files:
    src = open(f, encoding='utf-8').read()
    m = re.search(r"'desc':\s*'([^']*)'", src)
    if m and len(m.group(1)) > 160:
        bad_desc.append((os.path.basename(f), len(m.group(1))))

# ---- 2. slop on C2 HTML ----
slop_hits = []
for slug in SLUGS:
    html_path = os.path.join('blog', slug + '.html')
    if not os.path.exists(html_path):
        slop_hits.append((slug, 'HTML MISSING'))
        continue
    html = open(html_path, encoding='utf-8').read()
    for pat in SLOP_PATTERNS:
        for m in re.finditer(pat, html, re.IGNORECASE):
            start = max(0, m.start() - 40)
            ctx = html[start:m.end() + 40].replace('\n', ' ')
            slop_hits.append((slug, pat, ctx))

# ---- 3. dead internal links on C2 HTML ----
dead_links = []
for slug in SLUGS:
    html_path = os.path.join('blog', slug + '.html')
    if not os.path.exists(html_path):
        continue
    html = open(html_path, encoding='utf-8').read()
    for m in re.finditer(r'href="([^"#]+)(?:#[^"]*)?"', html):
        target = m.group(1)
        if target.startswith(('http://', 'https://', 'mailto:')):
            continue
        t = target
        while t.startswith('../'):
            t = t[3:]
        if not os.path.exists(os.path.join(ROOT, t)):
            dead_links.append((slug, target))

# ---- 4. sitemap count + C2 presence ----
sitemap = open('sitemap.xml', encoding='utf-8').read()
url_count = sitemap.count('<url>')
missing = [s for s in SLUGS if s not in sitemap]

print('total article files:', len(files))
print('desc>160 violations:', len(bad_desc))
for f, n in bad_desc:
    print('  ', f, n)
print('C2 slop hits:', len(slop_hits))
for h in slop_hits[:20]:
    print('  ', h)
print('C2 dead internal links:', len(dead_links))
for d in dead_links[:20]:
    print('  ', d)
print('sitemap <url> count:', url_count)
print('C2 slugs missing from sitemap:', len(missing))
for s in missing:
    print('  ', s)
print('AUDIT', 'PASS' if not bad_desc and not slop_hits and not dead_links and not missing else 'FAIL')