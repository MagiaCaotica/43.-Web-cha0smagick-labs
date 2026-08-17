# -*- coding: utf-8 -*-
"""Audit Batch B5 (A101-A110): desc<=160, zero slop, no dead links, sitemap count."""
import glob
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SLUGS = [
    'free-sigil-generator-vs-chaos-sigil-generator-app',
    'free-i-ching-vs-i-ching-oracle-app',
    'free-rune-oracle-vs-norse-rune-oracle-app',
    'free-lunar-phase-vs-lunar-phase-calculator-app',
    'free-spell-builder-vs-occult-apps',
    'free-astrology-sign-calculator-vs-astral-lab',
    'free-candle-color-calculator-vs-moon-apps',
    'free-digital-pendulum-vs-tarot-apps',
    'free-tengwar-transcriber-and-rune-identity',
    'free-servitor-activator-vs-sigil-apps',
]
SLOP_PATTERNS = [
    r'\bdelve\b',
    r'\btapestry\b',
    r'\bjourney\b(?![-\s]*(is|of|through|card|reading|tarot))(?=[-\s]+[a-z])',
    r'\bunlock\b',
    r'\bembark\b',
    r'\bseamless\b',
    r'\bpowerhouse\b',
    r'\bgame-chang\w*\b',
    r'\bleverage\b',
    r'\bfoster\b',
    r'\bholistic\b',
    r'\bharness\b',
    r'\bcrucial\b',
    r"\bin today's fast-paced\b",
    r'\bin the world of\b',
    r"\bwhether you'?re a seasoned\b",
    r'\bempower\w*\b',
]

failures = []

# 1. desc length
files = glob.glob(str(ROOT / 'scripts' / 'article_*.py'))
total = 0
for f in files:
    total += 1
    text = Path(f).read_text(encoding='utf-8')
    m = re.search(r"^\s*'desc':\s*'([^']*)'", text, re.M)
    if m:
        desc = m.group(1)
        if len(desc) > 160:
            failures.append(f'desc>160 ({len(desc)}): {Path(f).name}')
print(f'total article files: {total}')
print(f'desc>160 violations: {len([x for x in failures if x.startswith("desc")])}')

# 2. slop on B5 HTML
slop_hits = 0
for slug in SLUGS:
    html_path = ROOT / 'blog' / f'{slug}.html'
    if not html_path.exists():
        failures.append(f'missing HTML: {slug}')
        continue
    html = html_path.read_text(encoding='utf-8')
    for pat in SLOP_PATTERNS:
        if re.search(pat, html, re.I):
            slop_hits += 1
            failures.append(f'slop "{pat}" in {slug}')
print(f'B5 slop hits: {slop_hits}')

# 3. dead internal links (strip ../ prefix)
dead = 0
for slug in SLUGS:
    html_path = ROOT / 'blog' / f'{slug}.html'
    if not html_path.exists():
        continue
    html = html_path.read_text(encoding='utf-8')
    for href in re.findall(r'href="([^"]+)"', html):
        if href.startswith('http') or href.startswith('#'):
            continue
        target = href.lstrip('../')
        target = target.split('#')[0]
        if not target:
            continue
        if not (ROOT / target).exists():
            dead += 1
            failures.append(f'dead link {href} in {slug}')
print(f'B5 dead internal links: {dead}')

# 4. sitemap count + B5 presence
sitemap = (ROOT / 'sitemap.xml').read_text(encoding='utf-8')
count = len(re.findall(r'<url>', sitemap))
print(f'sitemap <url> count: {count}')
missing = [s for s in SLUGS if f'/blog/{s}.html' not in sitemap]
print(f'B5 slugs missing from sitemap: {len(missing)}')
if missing:
    failures.append(f'missing slugs: {missing}')

print('---')
if failures:
    print('FAILURES:')
    for f_ in failures:
        print(' ', f_)
    sys.exit(1)
print('B5 AUDIT PASS')