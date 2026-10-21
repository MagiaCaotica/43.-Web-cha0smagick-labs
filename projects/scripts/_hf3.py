#!/usr/bin/env python3
"""Estado hreflang de las 6 tools que tienen version ES en /es/tools/."""
import re
from pathlib import Path

SITE = "https://cha0smagicklabs.com/"
ROOT = Path(".")

ES = sorted((ROOT / "es" / "tools").glob("*.html"))
print("== /es/tools/ ==")
for p in ES:
    src = p.read_text(encoding="utf-8", errors="ignore")
    decl = {}
    for m in re.finditer(r'<link[^>]+hreflang=["\']([^"\']+)["\'][^>]*href=["\']([^"\']+)["\']', src, re.I):
        decl[m.group(1)] = m.group(2)
    for m in re.finditer(r'<link[^>]+href=["\']([^"\']+)["\'][^>]*hreflang=["\']([^"\']+)["\']', src, re.I):
        decl[m.group(2)] = m.group(1)
    can = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', src)
    print(f"   {p.name}")
    print(f"      canonical: {can.group(1) if can else '(ninguno)'}")
    for k, v in decl.items():
        print(f"      {k:10} -> {v.replace(SITE, '')}")

print("\n== /tools/ equivalentes ==")
for p in ES:
    en = ROOT / "tools" / p.name
    if not en.exists():
        print(f"   {p.name}: NO existe en /tools/ (version solo en espanol)")
        continue
    src = en.read_text(encoding="utf-8", errors="ignore")
    decl = {}
    for m in re.finditer(r'<link[^>]+hreflang=["\']([^"\']+)["\'][^>]*href=["\']([^"\']+)["\']', src, re.I):
        decl[m.group(1)] = m.group(2)
    for m in re.finditer(r'<link[^>]+href=["\']([^"\']+)["\'][^>]*hreflang=["\']([^"\']+)["\']', src, re.I):
        decl[m.group(2)] = m.group(1)
    can = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', src)
    print(f"   {p.name}: canonical {can.group(1).replace(SITE, '') if can else '(ninguno)'}")
    for k, v in decl.items():
        print(f"      {k:10} -> {v.replace(SITE, '')}")
