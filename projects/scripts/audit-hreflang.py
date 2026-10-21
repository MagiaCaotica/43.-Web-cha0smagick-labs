#!/usr/bin/env python3
"""
hreflang: cada par EN<->ES tiene que ser coherente.
  - la URL de hreflang debe existir de verdad
  - y coincidir con el canonical de la pagina destino
  - y la pagina destino debe declarar la vuelta (reciprocidad)

Un hreflang roto hace que Google ignore ese par: la version en espanol no
hereda nada y las dos paginas compiten entre si.

  python projects/scripts/audit-hreflang.py
"""
import re
import sys
from pathlib import Path

SITE = "https://cha0smagicklabs.com/"
ROOT = Path(".")

ARCHIVOS = [p for p in ROOT.rglob("*.html")
            if not any(x in str(p) for x in ("node_modules", ".git", "auto-shorts", "pinterest-pins"))]

_cache = {}


def leer(p):
    if p not in _cache:
        _cache[p] = p.read_text(encoding="utf-8", errors="ignore")
    return _cache[p]


def url_a_fichero(url):
    rel = url.split(SITE, 1)[-1].split("?")[0].split("#")[0]
    p = ROOT / rel
    if p.is_file():
        return p
    if p.is_dir() and (p / "index.html").is_file():
        return p / "index.html"
    return None


def canonical_de(p):
    if p is None:
        return None
    m = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', leer(p), re.I)
    return m.group(1) if m else None


def hreflangs_de(p):
    src = leer(p)
    out = {}
    for m in re.finditer(r'<link[^>]+hreflang=["\']([^"\']+)["\'][^>]*href=["\']([^"\']+)["\']', src, re.I):
        out[m.group(1)] = m.group(2)
    for m in re.finditer(r'<link[^>]+href=["\']([^"\']+)["\'][^>]*hreflang=["\']([^"\']+)["\']', src, re.I):
        out[m.group(2)] = m.group(1)
    return out


roto, incoherente, sin_vuelta = [], [], []
declaraciones = 0
for p in ARCHIVOS:
    propias = hreflangs_de(p)
    mi_canonical = canonical_de(p)
    for lang, url in propias.items():
        declaraciones += 1
        destino = url_a_fichero(url)
        if destino is None:
            roto.append((str(p), lang, url))
            continue
        can = canonical_de(destino)
        if can and can.rstrip("/") != url.rstrip("/"):
            incoherente.append((str(p), lang, url, can))
        if mi_canonical and mi_canonical not in hreflangs_de(destino).values():
            sin_vuelta.append((str(p), lang, url))

print("=== hreflang en todo el sitio ===")
print(f"paginas revisadas: {len(ARCHIVOS)} | declaraciones: {declaraciones}")
print(f"destino inexistente                : {len(roto)}")
print(f"canonical del destino distinto     : {len(incoherente)}")
print(f"la pagina destino no declara vuelta: {len(sin_vuelta)}")

for etiqueta, lista in (("DESTINO INEXISTENTE", roto), ("CANONICAL DISTINTO", incoherente), ("SIN VUELTA", sin_vuelta)):
    if not lista:
        continue
    print(f"\n-- {etiqueta} --")
    for item in lista[:15]:
        if etiqueta == "CANONICAL DISTINTO":
            a, l, u, c = item
            print(f"   {a}\n      {l} -> {u}\n      canonical: {c}")
        else:
            a, l, u = item
            print(f"   {a}\n      {l} -> {u}")

if not (roto or incoherente or sin_vuelta):
    print("\nOK: todos los pares hreflang son coherentes y reciprocos.")

sys.exit(0 if not (roto or incoherente or sin_vuelta) else 1)
