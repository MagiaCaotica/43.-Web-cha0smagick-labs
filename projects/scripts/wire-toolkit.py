#!/usr/bin/env python3
"""
Conecta la capa de valor (css/toolkit.css + js/toolkit.js) a las 58
herramientas nativas (las 40 del motor comun y las 15 propias con sus copias
en espanol). Las 18 embebidas quedan fuera, como se pidio.

Es idempotente: si ya esta conectado, no lo toca.

  python projects/scripts/wire-toolkit.py
"""
import re
from pathlib import Path

ROOT = Path(".").resolve()
CSS = '<link rel="stylesheet" href="../css/toolkit.css">'
JS = '<script src="../js/toolkit.js" defer></script>'

n = {"css": 0, "js": 0, "omitidas": 0, "ya": 0}

for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    if p.name == "index.html":
        continue
    src = p.read_text(encoding="utf-8", errors="ignore")
    if "<iframe" in src:
        n["omitidas"] += 1
        continue

    original = src

    if "toolkit.css" not in src:
        m = re.search(r'(?i)(<link[^>]+href="\.\./css/[a-z\-]+\.css"[^>]*>)', src)
        if m:
            src = src[: m.end()] + "\n    " + CSS + src[m.end():]
            n["css"] += 1
        else:
            m2 = re.search(r"(?i)</head>", src)
            if m2:
                src = src[: m2.start()] + "    " + CSS + "\n" + src[m2.start():]
                n["css"] += 1

    if "toolkit.js" not in src:
        m = re.search(r"(?i)</body>", src)
        if m:
            src = src[: m.start()] + "  " + JS + "\n" + src[m.start():]
            n["js"] += 1

    if src != original:
        p.write_text(src, encoding="utf-8")

print("=== toolkit conectado ===")
print(f"   css añadida   : {n['css']}")
print(f"   js añadida    : {n['js']}")
print(f"   embebidas fuera: {n['omitidas']}")
