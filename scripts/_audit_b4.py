# -*- coding: utf-8 -*-
"""B4 audit: desc<=160, zero slop, no dead internal links, sitemap count, B4 slugs present."""
import glob
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"
BLOG = ROOT / "blog"
SITEMAP = ROOT / "sitemap.xml"
INDEX = ROOT / "index.html"

B4_SLUGS = [
    "the-digital-grimoire-organizing-your-whole-practice",
    "the-tech-witch-starter-pack-5-tools-plus-3-apps",
    "what-cybermancy-says-about-the-modern-practitioner",
    "building-a-daily-occult-practice-in-15-minutes",
    "occult-apps-and-privacy-what-your-data-says",
    "the-psychonauts-toolkit-dreams-obe-and-esp",
    "chaos-magick-for-skeptics-a-practical-intro",
    "a-witchs-year-with-the-lunar-phase-app",
]

SLOP_PATTERNS = [
    r"\bdelve\b",
    r"\btapestry\b",
    r"\bjourney\b(?![-\s]*(is|of|through|card|reading|tarot))",
    r"\bunlock\b",
    r"\bembark\b",
    r"\bseamless\b",
    r"\bpowerhouse\b",
    r"\bgame-chang\w*\b",
    r"\bleverage\b",
    r"\bfoster\b",
    r"\bholistic\b",
    r"\bharness\b",
    r"\bcrucial\b",
    r"\bin today's fast-paced\b",
    r"\bin the world of\b",
    r"\bwhether you'?re a seasoned\b",
    r"\bempower\w*\b",
]

problems = []

# 1. desc <= 160 across all article files
files = sorted(glob.glob(str(SCRIPTS / "article_*.py")))
print(f"total article files: {len(files)}")
desc_viol = 0
for f in files:
    txt = Path(f).read_text(encoding="utf-8")
    m = re.search(r"'desc':\s*'((?:[^'\\]|\\.)*)'", txt)
    if m:
        desc = m.group(1).encode("utf-8").decode("unicode_escape")
        if len(desc) > 160:
            desc_viol += 1
            problems.append(f"DESC>160 {Path(f).name}: {len(desc)} chars")
print(f"desc>160 violations: {desc_viol}")

# 2. slop on B4 HTML
slop_hits = 0
for slug in B4_SLUGS:
    html = (BLOG / f"{slug}.html")
    if not html.exists():
        problems.append(f"MISSING HTML {slug}")
        slop_hits += 1
        continue
    txt = html.read_text(encoding="utf-8")
    for pat in SLOP_PATTERNS:
        for m in re.finditer(pat, txt, re.IGNORECASE):
            slop_hits += 1
            problems.append(f"SLOP {slug}: {m.group(0)}")
print(f"B4 slop hits: {slop_hits}")

# 3. dead internal links on B4 HTML (strip ../ prefix)
dead = 0
for slug in B4_SLUGS:
    html = BLOG / f"{slug}.html"
    if not html.exists():
        continue
    txt = html.read_text(encoding="utf-8")
    for href in re.findall(r'href="([^"#]+)"', txt):
        if href.startswith(("http://", "https://", "mailto:")):
            continue
        target = href
        while target.startswith("../"):
            target = target[3:]
        if not target:
            continue
        if not (ROOT / target).exists():
            dead += 1
            problems.append(f"DEAD {slug}: {href}")
print(f"B4 dead internal links: {dead}")

# 4. sitemap count + B4 presence
smap = SITEMAP.read_text(encoding="utf-8") if SITEMAP.exists() else ""
url_count = len(re.findall(r"<url>", smap))
print(f"sitemap <url> count: {url_count}")
missing = [s for s in B4_SLUGS if f"/blog/{s}.html" not in smap]
print(f"B4 slugs missing from sitemap: {len(missing)}")
for s in missing:
    problems.append(f"SITEMAP MISSING {s}")

print("---")
if problems:
    print("PROBLEMS:")
    for p in problems:
        print(" ", p)
    sys.exit(1)
print("B4 AUDIT PASS")