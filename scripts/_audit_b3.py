# -*- coding: utf-8 -*-
"""Audit Batch B3: desc<=160, zero slop, no dead internal links, sitemap counts."""
import glob
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
BLOG = ROOT / "blog"

B3_SLUGS = [
    "can-anyone-learn-esp-the-science-says-maybe",
    "the-psychic-abilities-you-already-have-and-how-to-train-them",
    "lucid-dreaming-as-a-superpower-for-problem-solving",
    "manifesting-wealth-why-money-sigils-work-for-some-people",
    "the-fools-journey-is-your-life-a-hopeful-reading",
    "what-the-i-ching-can-teach-you-about-difficult-choices",
    "rune-divination-for-daily-guidance-a-gentle-start",
    "the-moon-as-your-manifestation-calendar",
    "angels-spirits-and-you-a-framework-for-contact",
    "astral-travel-for-healing-old-wounds",
]

# --- 1. desc <= 160 across ALL article files ---
bad_desc = []
for f in sorted(SCRIPTS.glob("article_*.py")):
    m = re.search(r"'desc':\s*'((?:[^'\\]|\\.)*)'", f.read_text(encoding="utf-8"))
    if m:
        desc = m.group(1)
        # unescape basic sequences
        desc = desc.replace("\\u2019", "'").replace("\\u2014", "-").replace("\\'", "'")
        if len(desc) > 160:
            bad_desc.append((f.name, len(desc)))

# --- 2. zero slop on B3 HTML (placeholder lorem/ipsum/todo/xxx) ---
SLOP = re.compile(r"\b(lorem ipsum|todo|fixme|xxx|placeholder|coming soon)\b", re.I)
slop_hits = []
for slug in B3_SLUGS:
    p = BLOG / f"{slug}.html"
    if not p.exists():
        slop_hits.append((slug, "MISSING HTML"))
        continue
    txt = p.read_text(encoding="utf-8")
    if SLOP.search(txt):
        slop_hits.append((slug, "SLOP"))

# --- 3. no dead internal links on B3 HTML ---
dead_links = []
for slug in B3_SLUGS:
    p = BLOG / f"{slug}.html"
    if not p.exists():
        continue
    txt = p.read_text(encoding="utf-8")
    for href in re.findall(r'href="([^"]+)"', txt):
        if href.startswith(("http", "#", "mailto:")):
            continue
        target = href.split("#")[0].lstrip("/")
        while target.startswith("../"):
            target = target[3:]
        if target.endswith(".html"):
            if not (ROOT / target).exists():
                dead_links.append((slug, href))

# --- 4. sitemap counts + B3 presence ---
sm = (ROOT / "sitemap.xml").read_text(encoding="utf-8")
url_count = len(re.findall(r"<url>", sm))
missing_in_sitemap = [s for s in B3_SLUGS if s not in sm]

print("=== B3 AUDIT ===")
print(f"total article files: {len(list(SCRIPTS.glob('article_*.py')))}")
print(f"desc>160 violations: {len(bad_desc)}")
for name, ln in bad_desc:
    print(f"  {name}: {ln} chars")
print(f"B3 slop hits: {len(slop_hits)}")
for s in slop_hits:
    print(f"  {s}")
print(f"B3 dead internal links: {len(dead_links)}")
for s in dead_links:
    print(f"  {s}")
print(f"sitemap <url> count: {url_count}")
print(f"B3 slugs missing from sitemap: {len(missing_in_sitemap)}")
for s in missing_in_sitemap:
    print(f"  {s}")
ok = (not bad_desc) and (not slop_hits) and (not dead_links) and (not missing_in_sitemap)
print("RESULT:", "PASS" if ok else "FAIL")
