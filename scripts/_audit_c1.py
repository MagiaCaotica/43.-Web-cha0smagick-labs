# -*- coding: utf-8 -*-
"""C1 audit: desc<=160, zero slop on C1 HTML, no dead internal links, sitemap count, C1 slugs in sitemap."""
import glob
import re
from pathlib import Path

ROOT = Path('.')
C1_SLUGS = [
    'new-moon-dates-2026-2027-ritual-calendar',
    'mercury-retrograde-2026-complete-survival-guide',
    'halloween-evp-night-how-to-run-a-public-session',
    'lunar-eclipse-rituals-2026',
    'full-moon-charging-nights-2026',
    'samhain-deep-dive-the-witches-new-year',
    'new-year-intention-setting-with-sigils',
    'christmas-gift-guide-occult-apps-under-10',
    'world-sleep-day-lucid-dreaming-as-sleep-science',
    'eclipse-season-astral-projection-opportunities',
]

SLOP_PATTERNS = [
    r'\bdelve\b', r'\btapestry\b', r'\bunlock\b', r'\bembark\b', r'\bseamless\b',
    r'\bpowerhouse\b', r'\bgame-chang', r'\bleverage\b', r'\bfoster\b', r'\bholistic\b',
    r'\bharness\b', r'\bcrucial\b', r"in today's fast-paced", r'in the world of',
    r"whether you're a seasoned", r'\bempower',
    r'\bjourney\b(?![\-\s]*(is|of|through|card|reading|tarot))(?=[\-\s]+[a-z])',
]

# 1) desc <= 160 across article files
files = sorted(glob.glob('scripts/article_*.py'))
viol = []
for f in files:
    txt = Path(f).read_text(encoding='utf-8')
    m = re.search(r"'desc':\s*'([^']*)'", txt)
    if m and len(m.group(1)) > 160:
        viol.append((f, len(m.group(1))))
print(f'total article files: {len(files)}')
print(f'desc>160 violations: {len(viol)}')
for f, n in viol:
    print(f'  {f}: {n} chars')

# 2) zero slop on C1 HTML
slop_hits = []
for slug in C1_SLUGS:
    html = (ROOT / 'blog' / f'{slug}.html')
    if not html.exists():
        print(f'  MISSING HTML: {slug}')
        continue
    txt = html.read_text(encoding='utf-8')
    for pat in SLOP_PATTERNS:
        for m in re.finditer(pat, txt, re.IGNORECASE):
            ctx = txt[max(0, m.start() - 40):m.end() + 40].replace('\n', ' ')
            slop_hits.append((slug, pat, ctx))
print(f'C1 slop hits: {len(slop_hits)}')
for s in slop_hits[:20]:
    print(f'  {s[0]} :: {s[1]} :: ...{s[2]}...')

# 3) dead internal links on C1 HTML (strip ../ prefix)
dead = []
for slug in C1_SLUGS:
    html = ROOT / 'blog' / f'{slug}.html'
    if not html.exists():
        continue
    txt = html.read_text(encoding='utf-8')
    for href in re.findall(r'href="([^"]+)"', txt):
        if href.startswith('http') or href.startswith('mailto') or href.startswith('#'):
            continue
        target = re.sub(r'^(\.\./)+', '', href)
        target = target.split('#')[0]
        if target and not (ROOT / target).exists():
            dead.append((slug, href))
print(f'C1 dead internal links: {len(dead)}')
for d in dead[:20]:
    print(f'  {d[0]} -> {d[1]}')

# 4) sitemap url count + C1 slugs in sitemap
sitemap = (ROOT / 'sitemap.xml').read_text(encoding='utf-8')
print(f'sitemap <url> count: {len(re.findall(r"<url>", sitemap))}')
missing = [s for s in C1_SLUGS if s not in sitemap]
print(f'C1 slugs missing from sitemap: {len(missing)}')
for s in missing:
    print(f'  {s}')