# -*- coding: utf-8 -*-
"""Probe: find the article-body wrapper in a B5 HTML file."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
h = (ROOT / 'blog' / 'free-sigil-generator-vs-chaos-sigil-generator-app.html').read_text(encoding='utf-8')
m = re.search(r'<main.*?</main>', h, re.S)
print('main found:', bool(m))
tags = re.findall(r'<(article|section|div)[^>]*class="([^"]*)"', h)
print('containers:', tags[:12])
body = re.search(r'<article[^>]*>(.*?)</article>', h, re.S)
print('article body found:', bool(body))
if body:
    print('body length:', len(body.group(1)))
    # check slop inside body only
    for pat in ['Step-by-Step', 'Complete Guide', 'Master the', 'Master your', 'Remember,']:
        print(pat, 'in body:', bool(re.search(pat, body.group(1), re.I)))