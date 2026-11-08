#!/usr/bin/env python3
"""Auditoria de atributos alt en las imagenes del sitio.

Uso: python scripts/seo/alt-audit.py

Distingue tres casos:
  - sin atributo alt      -> defecto de accesibilidad, hay que corregirlo
  - alt=""                -> correcto si la imagen es decorativa
  - alt con texto         -> correcto

Sale con codigo 1 si encuentra imagenes sin atributo alt.
"""
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {"projects", "node_modules", "auto-shorts", ".git"}

files = [p for p in ROOT.rglob("*.html")
         if not any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts)]

missing = 0
empty = 0
total = 0
by_file = Counter()

for p in files:
    t = p.read_text(encoding="utf-8", errors="ignore")
    for m in re.finditer(r"<img\b[^>]*>", t, re.I):
        total += 1
        tag = m.group(0)
        if re.search(r"\balt=", tag, re.I):
            if re.search(r'\balt=""', tag):
                empty += 1
            continue
        missing += 1
        by_file[p.relative_to(ROOT).as_posix()] += 1

print(f"imagenes: {total} | sin alt: {missing} | decorativas (alt vacio): {empty}")
for f, n in by_file.most_common(20):
    print(f"  {n:>3}  {f}")
sys.exit(1 if missing else 0)
