# -*- coding: utf-8 -*-
"""Trim 4 over-long meta descriptions (11-30 batch) to <=160 chars.
Key-anchored regex on "desc": lines only. Patches data files AND generated HTML.
Does NOT re-run build_10_articles.py (index/sitemap updates not idempotent)."""
import re, html as htmlmod

TARGETS = {
    "goetia-spirits-faq": "Is Goetia safe? Do spirits lie? The 12 most asked Goetia questions answered: safety, deception, timelines, ethics, and digital evocation - with practical guidance.",
    "ghost-hunting-at-home-guide": "How to run your first ghost hunt at home: baseline recordings, room sweeps, the question protocol, the debunk-first rule, and evidence logging that survives review.",
    "astral-projection-verification": "How to verify an astral projection: the wall test, memory granularity, environment pinning, sensory checks, and journal cross-validation to separate real OBE from vivid dreams.",
    "binaural-beats-astral-projection": "Theta and delta binaural beats for astral projection: which frequencies actually work, how to layer them into your exit routine, and why headphones are mandatory.",
}

def trim(s, limit=160):
    if len(s) <= limit:
        return s
    cut = s[:limit].rsplit(' ', 1)[0]
    cut = cut.rstrip(' ,-;:.')
    return cut + '.'

DATA_FILES = ["scripts/article_12.py", "scripts/article_23.py", "scripts/article_24.py", "scripts/article_25.py"]
LINE_RE = re.compile(r'^(\s*"desc": ")([^"]*?)(",?\s*)$', re.M)

for path in DATA_FILES:
    src = open(path, encoding="utf-8").read()
    out, n = LINE_RE.subn(lambda m: m.group(1) + trim(m.group(2)) + m.group(3), src)
    if n:
        open(path, "w", encoding="utf-8").write(out)
        print(f"patched {path}: {n} desc(s)")

for slug, raw in TARGETS.items():
    trimmed = trim(raw)
    html_path = f"blog/{slug}.html"
    src = open(html_path, encoding="utf-8").read()
    new_meta = f'<meta name="description" content="{htmlmod.escape(trimmed, quote=True)}">'
    patched = re.sub(r'<meta name="description" content="[^"]*">', new_meta, src, count=1)
    if patched != src:
        open(html_path, "w", encoding="utf-8").write(patched)
        print(f"patched {html_path}: len {len(trimmed)}")
    else:
        print(f"NO MATCH in {html_path}")
