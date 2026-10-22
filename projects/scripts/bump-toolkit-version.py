#!/usr/bin/env python3
"""
Versiona los assets de las herramientas con el hash de su contenido.

Una version fija se rompe: el CDN cachea la URL y el fichero cambia sin que
la URL cambie, y el navegador se queda con la version anterior. Con el hash
del contenido, cualquier cambio genera una URL nueva y no hay que acordarse
de subir la version a mano.

  python projects/scripts/bump-toolkit-version.py
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(".").resolve()
CSS = ROOT / "css" / "toolkit.css"
JS = ROOT / "js" / "toolkit.js"
CSS2 = ROOT / "css" / "atomic-tools.css"

h = hashlib.sha1()
for f in (CSS, CSS2, JS):
    h.update(f.read_bytes())
VERSION = h.hexdigest()[:10]

n = 0
for p in sorted(list((ROOT / "tools").glob("*.html")) + list((ROOT / "es" / "tools").glob("*.html"))):
    s = p.read_text(encoding="utf-8", errors="ignore")
    o = s
    s = re.sub(r'(toolkit\.css)\?v=[0-9a-zA-Z]+', rf'\1?v={VERSION}', s)
    s = re.sub(r'(toolkit\.js)\?v=[0-9a-zA-Z]+', rf'\1?v={VERSION}', s)
    s = re.sub(r'(atomic-tools\.css)\?v=[0-9a-zA-Z]+', rf'\1?v={VERSION}', s)
    if s != o:
        p.write_text(s, encoding="utf-8")
        n += 1

# la constante de version del JS debe coincidir con la del HTML
js = JS.read_text(encoding="utf-8")
js2 = re.sub(r"var DATA_VERSION = '[^']*';", f"var DATA_VERSION = '{VERSION}';", js)
if js2 != js:
    JS.write_text(js2, encoding="utf-8")

print(f"=== version de assets: {VERSION} ({n} paginas) ===")
