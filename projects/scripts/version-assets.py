#!/usr/bin/env python3
"""
Versiona TODOS los assets del sitio con el hash de su contenido, en un solo
sitio. Es el unico que debe tocar las referencias: si dos scripts escriben
la version, uno pisa al otro y vuelve el problema de la cache.

Por que existe: el CSS se cargaba sin parametro de version, asi que el
navegador y el CDN seguian sirviendo la copia anterior despues de un
deploy. Durante esta sesion eso hizo que tres cambios parecieran no
aplicarse (el sistema visual de las herramientas, la barra sticky y el hueco
inferior del body). Con el hash en la URL, cada cambio genera una URL nueva.

Ademas actualiza la constante DATA_VERSION del JS del toolkit, que es la que
versiona la carga del catalogo de herramientas.

  python projects/scripts/version-assets.py
"""
import hashlib
import re
from pathlib import Path

ROOT = Path(".").resolve()

ASSETS = {
    "style.min.css": "css/style.min.css",
    "wisdom.css": "css/wisdom.css",
    "atomic-tools.css": "css/atomic-tools.css",
    "toolkit.css": "css/toolkit.css",
    "toolkit.js": "js/toolkit.js",
    "analytics-bridge.js": "js/analytics-bridge.js",
    "shared.min.js": "js/shared.min.js",
    "conversion.min.js": "js/conversion.min.js",
    "atomic-tools.js": "js/atomic-tools.js",
}


def hash_de(rel):
    p = ROOT / rel
    return hashlib.sha1(p.read_bytes()).hexdigest()[:10] if p.exists() else "0"


VERSION = {nombre: hash_de(rel) for nombre, rel in ASSETS.items()}

n = {"paginas": 0, "refs": 0}
for p in sorted(ROOT.rglob("*.html")):
    s = str(p)
    if any(x in s for x in ("node_modules", ".git", "auto-shorts", "pinterest-pins", "projects/docs")):
        continue
    src = p.read_text(encoding="utf-8", errors="ignore")
    o = src

    def fix(m):
        prefijo, nombre = m.group(1), m.group(2)
        v = VERSION.get(nombre)
        if not v:
            return m.group(0)
        n["refs"] += 1
        return f'{prefijo}{nombre}?v={v}"'

    src = re.sub(r'(href="[^"]*?)(style\.min\.css|wisdom\.css|atomic-tools\.css|toolkit\.css)(?:\?v=[0-9a-zA-Z]+)?"', fix, src)
    src = re.sub(r'(src="[^"]*?)(toolkit\.js|analytics-bridge\.js|shared\.min\.js|conversion\.min\.js|atomic-tools\.js)(?:\?v=[0-9a-zA-Z]+)?"', fix, src)
    if src != o:
        p.write_text(src, encoding="utf-8")
        n["paginas"] += 1

# la constante de version del JS del toolkit (versiona la carga del catalogo)
js_path = ROOT / "js" / "toolkit.js"
js = js_path.read_text(encoding="utf-8", errors="ignore")
js2 = re.sub(r"var DATA_VERSION = '[^']*';", f"var DATA_VERSION = '{VERSION['toolkit.js']}';", js)
if js2 != js:
    js_path.write_text(js2, encoding="utf-8")
    print(f"   js/toolkit.js: DATA_VERSION = {VERSION['toolkit.js']}")

print("=== versionado de assets ===")
for k, v in VERSION.items():
    print(f"   {k:20} v={v}")
print(f"   paginas actualizadas: {n['paginas']} | referencias versionadas: {n['refs']}")
