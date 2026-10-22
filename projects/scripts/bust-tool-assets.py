#!/usr/bin/env python3
"""
Cache-busting de los assets de las herramientas.

El CDN de GitHub Pages sirve el CSS cacheado: el atomic-tools.css nuevo estaba
en el servidor (10.009 bytes con clamp) pero el navegador seguia aplicando el
viejo. El repo ya usa esta convencion en otros sitios (js/apps-data.min.js?v=...).

Se versionan los tres assets de las 58 herramientas nativas.

  python projects/scripts/bust-tool-assets.py
"""
import re
from pathlib import Path

ROOT = Path(".").resolve()
V = "20261021"

n = {"css": 0, "atomic": 0, "js": 0, "paginas": 0}

for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    if p.name == "index.html":
        continue
    s = p.read_text(encoding="utf-8", errors="ignore")
    if "<iframe" in s:
        continue
    o = s
    s = re.sub(r'href="((?:\.\./)+css/toolkit\.css)(?!\?)"', rf'href="\1?v={V}"', s)
    s = re.sub(r'href="((?:\.\./)+css/atomic-tools\.css)(?!\?)"', rf'href="\1?v={V}"', s)
    s = re.sub(r'src="((?:\.\./)+js/toolkit\.js)(?!\?)"', rf'src="\1?v={V}"', s)
    if s != o:
        p.write_text(s, encoding="utf-8")
        n["paginas"] += 1

# recuento
for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    s = p.read_text(encoding="utf-8", errors="ignore")
    n["css"] += len(re.findall(r"toolkit\.css\?v=", s))
    n["atomic"] += len(re.findall(r"atomic-tools\.css\?v=", s))
    n["js"] += len(re.findall(r"toolkit\.js\?v=", s))

print("=== cache-busting aplicado ===")
print(f"   paginas tocadas   : {n['paginas']}")
print(f"   toolkit.css?v=    : {n['css']}")
print(f"   atomic-tools.css? : {n['atomic']}")
print(f"   toolkit.js?v=     : {n['js']}")
