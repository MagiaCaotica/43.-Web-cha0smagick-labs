# -*- coding: utf-8 -*-
"""Audit C3 batch (A131-A140): desc<=160, zero slop, no dead links, sitemap count, C3 slugs in sitemap."""
import glob
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__)) + os.sep + '..'
os.chdir(ROOT)

C3_SLUGS = [
    'how-we-test-occult-apps-our-methodology',
    'why-we-dont-do-subscriptions-and-never-will',
    'our-privacy-policy-explained-in-plain-english',
    'who-is-frater-alek0s-meet-the-author',
    'how-to-vet-an-occult-app-before-buying',
    'we-answer-every-support-email-heres-proof',
    'refund-policy-what-happens-if-you-dont-like-it',
    'the-history-of-cha0smagick-labs-since-2025',
    'app-security-where-your-data-lives-it-doesnt',
    '10-occult-myths-debunked-by-practitioners',
]

SLOP_PATTERNS = [
    r'\bdelve\b', r'\btapestry\b',
    r'\bjourney\b(?![\-\s]*(is|of|through|card|reading|tarot))(?=[\-\s]+[a-z])',
    r'\bunlock\b', r'\bembark\b', r'\bseamless\b', r'\bpowerhouse\b',
    r'\bgame[- ]chang', r'\bleverage\b', r'\bfoster\b', r'\bholistic\b',
    r'\bharness\b', r'\bcrucial\b', r"in today's fast-paced", r'in the world of',
    r"whether you're a seasoned", r'\bempower\b',
]
SLOP_RE = [re.compile(p, re.IGNORECASE) for p in SLOP_PATTERNS]

# desc check
files = sorted(glob.glob('scripts/article_*.py'))
desc_bad = []
for f in files:
    txt = open(f, encoding='utf-8').read()
    m = re.search(r"'desc':\s*'(.*?)'", txt, re.S)
    if m:
        d = m.group(1)
        # unescape simple escapes for accurate length
        d2 = d.replace("\\'", "'").replace('\\u2019', '\u2019').replace('\\u2018', '\u2018')
        if len(d2) > 160:
            desc_bad.append((os.path.basename(f), len(d2), d2[:100]))
print('total article files:', len(files))
print('desc>160 violations:', len(desc_bad))
for x in desc_bad:
    print('  ', x)

# slop + dead links on C3 HTML
slop_hits = []
dead = []
for slug in C3_SLUGS:
    html_path = os.path.join('blog', slug + '.html')
    if not os.path.exists(html_path):
        print('MISSING HTML:', slug)
        continue
    html = open(html_path, encoding='utf-8').read()
    for p, rx in zip(SLOP_PATTERNS, SLOP_RE):
        for m in rx.finditer(html):
            ctx = html[max(0, m.start() - 60):m.end() + 60].replace('\n', ' ')
            slop_hits.append((slug, p, ctx))
    for m in re.finditer(r'href="([^"]+)"', html):
        href = m.group(1)
        if href.startswith('http') or href.startswith('mailto:') or href.startswith('#'):
            continue
        target = href
        while target.startswith('../'):
            target = target[3:]
        target = target.split('#')[0]
        if not target:
            continue
        if not os.path.exists(os.path.join(ROOT, target)):
            dead.append((slug, href))
print('C3 slop hits:', len(slop_hits))
for s in slop_hits[:20]:
    print('  ', s)
print('C3 dead internal links:', len(dead))
for d in dead[:20]:
    print('  ', d)

# sitemap
smap = open('sitemap.xml', encoding='utf-8').read()
n_urls = smap.count('<url>')
print('sitemap total url count:', n_urls)
missing = [s for s in C3_SLUGS if s not in smap]
print('C3 slugs missing from sitemap:', len(missing))
for s in missing:
    print('  ', s)