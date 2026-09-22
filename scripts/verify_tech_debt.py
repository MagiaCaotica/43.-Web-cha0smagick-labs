#!/usr/bin/env python3
"""3.5.1+3.5.2 Tech Debt verification: structured data + images audit.

- 3.5.1: validates JSON-LD blocks (Article, Product, FAQPage, HowTo,
  BreadcrumbList, Organization, WebSite) for required fields -- local proxy
  for Google Rich Results Test.
- 3.5.2: audits <img> tags for lazy loading, intrinsic sizing (width+height)
  and format mix (webp vs raster).

Usage: python scripts/verify_tech_debt.py
Stdlib only. Exit 1 if validation errors found (so CI can gate on it).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Required fields per JSON-LD type (Rich Results proxy, minimal viable set)
REQ = {
    "Article": ["headline", "datePublished", "author"],
    "Product": ["name", "offers"],
    "FAQPage": ["mainEntity"],
    "HowTo": ["step"],
    "BreadcrumbList": ["itemListElement"],
    "Organization": ["name", "url"],
    "WebSite": ["name", "url"],
}

LD_RE = re.compile(
    r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
    re.S | re.I,
)
IMG_RE = re.compile(r"<img\b[^>]*>", re.I)
EXCLUDE_PARTS = ("node_modules", ".git", "projects", "auto-shorts", ".github")


def collect_html_files():
    files = []
    for p in ROOT.rglob("*.html"):
        rel = p.relative_to(ROOT)
        if any(s in rel.parts for s in EXCLUDE_PARTS):
            continue
        files.append(p)
    return sorted(files)


def validate_ld(block_text, path, errors, types_count):
    try:
        data = json.loads(block_text.strip())
    except json.JSONDecodeError as exc:
        errors.append("%s: JSON parse error: %s" % (path, exc))
        return
    items = data if isinstance(data, list) else [data]
    for item in items:
        if not isinstance(item, dict):
            errors.append("%s: non-dict item in JSON-LD" % path)
            continue
        t = item.get("@type")
        graph = item.get("@graph")
        names = t if isinstance(t, list) else ([t] if t else [])
        if not names and isinstance(graph, list):
            # @graph container: valid schema.org pattern, recurse into items
            for sub in graph:
                if isinstance(sub, dict):
                    validate_ld(json.dumps(sub), path, errors, types_count)
            continue
        if not names:
            errors.append("%s: JSON-LD without @type" % path)
            continue
        for name in names:
            types_count[name] = types_count.get(name, 0) + 1
        req = REQ.get(names[0])
        if req:
            missing = [f for f in req if f not in item]
            if missing:
                errors.append(
                    "%s: %s missing %s" % (path, names[0], ",".join(missing))
                )


def audit_imgs(html, stats):
    for match in IMG_RE.finditer(html):
        tag = match.group(0)
        stats["total"] += 1
        if 'loading="lazy"' in tag or "loading='lazy'" in tag:
            stats["lazy"] += 1
        if re.search(r"\bwidth=", tag) and re.search(r"\bheight=", tag):
            stats["sized"] += 1
        src = re.search(r'src=["\']([^"\']+)["\']', tag)
        if src:
            if src.group(1).lower().endswith(".webp"):
                stats["webp"] += 1
            elif src.group(1).lower().endswith((".png", ".jpg", ".jpeg", ".gif")):
                stats["raster"] += 1


def main():
    files = collect_html_files()
    errors = []
    types_count = {}
    stats = {"total": 0, "lazy": 0, "sized": 0, "webp": 0, "raster": 0}
    pages_with_ld = 0

    for f in files:
        try:
            html = f.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            errors.append("%s: read error %s" % (f.relative_to(ROOT), exc))
            continue
        blocks = LD_RE.findall(html)
        if blocks:
            pages_with_ld += 1
            for block in blocks:
                validate_ld(block, str(f.relative_to(ROOT)), errors, types_count)
        audit_imgs(html, stats)

    print("pages scanned: %d" % len(files))
    print("pages with JSON-LD: %d" % pages_with_ld)
    print(
        "JSON-LD types: %s"
        % ", ".join("%s=%d" % (k, v) for k, v in sorted(types_count.items()))
    )
    print("validation errors: %d" % len(errors))
    for err in errors[:20]:
        print("  - %s" % err)
    if len(errors) > 20:
        print("  ... (%d more)" % (len(errors) - 20))
    print(
        "images: total=%d lazy=%d sized(w+h)=%d webp=%d raster=%d"
        % (stats["total"], stats["lazy"], stats["sized"], stats["webp"], stats["raster"])
    )
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
