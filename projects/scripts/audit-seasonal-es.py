#!/usr/bin/env python3
"""
AUDITORIA DE ESTACIONALIDAD, CORPUS EN ESPANOL Y EL EXPERIMENTO DE COLOMBIA.

Tres preguntas:
  1. ¿Hay contenido estacional? ¿Para que temporadas y cuando se publico?
     (el contenido estacional necesita 4-6 semanas de antelacion para
     posicionar, asi que la pregunta no es solo "que hay" sino "que hay
     publicado con tiempo de sobra para la proxima temporada")
  2. ¿Cuanto hay en espanol y que se traga el embudo de venta?
  3. ¿Que hace dashboard-colombia con la seccion de herramientas?

  python projects/scripts/audit-seasonal-es.py
"""
import json
import re
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(".").resolve()
HOY = date(2026, 10, 22)

TEMPORADAS = {
    "halloween": [r"halloween", r"samhain", r"all hallows", r"hallowe"],
    "navidad": [r"christmas", r"xmas", r"navidad", r"nativity", r"advent", r"pues"],
    "ano-nuevo": [r"new year", r"new year's", r"ano nuevo", r"año nuevo"],
    "black-friday": [r"black friday", r"cyber monday", r"cybermonday"],
    "san-valentin": [r"valentine", r"san valentin", r"san valentín"],
    "verano": [r"summer solstice", r"solstice", r"solsticio"],
    "equinoccio": [r"equinox", r"equinoccio"],
    "halloween-es": [r"halloween", r"samhain"],
    "dia-muertos": [r"day of the dead", r"dia de muertos", r"día de muertos"],
    "imagen": [r"epiphany", r"epifania"],
    "carnaval": [r"carnival", r"carnaval"],
}


def texto(p):
    s = p.read_text(encoding="utf-8", errors="ignore")
    s = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()


print("=" * 78)
print("1. CONTENIDO ESTACIONAL")
print("=" * 78)
htmls = [p for p in ROOT.rglob("*.html")
          if not any(x in str(p) for x in ("node_modules", ".git", "auto-shorts", "pinterest-pins", "projects/docs"))]
encontrado = {}
for p in htmls:
    t = texto(p).lower()
    for nombre, patrones in TEMPORADAS.items():
        for pat in patrones:
            if re.search(pat, t):
                encontrado.setdefault(nombre, []).append(p.relative_to(ROOT).as_posix())
                break
for nombre in TEMPORADAS:
    lista = encontrado.get(nombre, [])
    print(f"   {nombre:16} {len(lista):>3} pagina(s)")
    for x in lista[:4]:
        print(f"        {x}")

# el calendario: cuando toca cada uno
print()
print("   calendario (hoy es 2026-10-22):")
calendario = [
    ("Halloween", date(2026, 10, 31), 9),
    ("Black Friday", date(2026, 11, 27), 36),
    ("Navidad", date(2026, 12, 25), 64),
    ("Ano Nuevo", date(2027, 1, 1), 71),
    ("San Valentin", date(2027, 2, 14), 115),
    ("Dia de Muertos", date(2026, 11, 2), 11),
]
for nombre, d, dias in calendario:
    estado = "pasado" if d < HOY else f"en {dias} dias"
    print(f"      {nombre:16} {d}  {estado}")

print()
print("=" * 78)
print("2. CORPUS EN ESPANOL")
print("=" * 78)
es_art = [p for p in (ROOT / "blog").glob("es-*.html")]
es_tools = [p for p in (ROOT / "es" / "tools").glob("*.html")] if (ROOT / "es" / "tools").exists() else []
en_art = [p for p in (ROOT / "blog").glob("*.html") if not p.name.startswith("es-") and p.name != "index.html"]
print(f"   articulos en ingles : {len(en_art)}")
print(f"   articulos en espanol: {len(es_art)}")
print(f"   herramientas ES    : {len(es_tools)}")
print(f"   ratio ES/EN        : {len(es_art) / max(1, len(en_art)) * 100:.1f}%")
print()
print("   los articulos en espanol que hay:")
for p in sorted(es_art):
    t = texto(p)
    print(f"      {p.name[:52]:54} {len(t.split()):>5} palabras")
print()
print("   donde apuntan los ES: cuanta CTA de venta tienen")
with_cta = 0
for p in es_art:
    s = p.read_text(encoding="utf-8", errors="ignore")
    if re.search(r'(apps/|books/|play\.google|hotmart|landing-pages/)', s):
        with_cta += 1
print(f"      con enlace a app o libro: {with_cta}/{len(es_art)}")

print()
print("=" * 78)
print("3. EL EXPERIMENTO DE COLOMBIA")
print("=" * 78)
dc = ROOT / "tools" / "dashboard-colombia.html"
if dc.exists():
    s = dc.read_text(encoding="utf-8", errors="ignore")
    print(f"   robots          : {(re.search(r'(?i)<meta name=.robots.[^>]*content=.([^\"]*)', s) or [0,'?'])[1]}")
    print(f"   canonical       : {(re.search(r'(?i)rel=.canonical.[^>]*href=.([^\"]*)', s) or [0,'?'])[1]}")
    print(f"   en el sitemap   : {'dashboard-colombia' in (ROOT / 'sitemap.xml').read_text(encoding='utf-8')}")
    print(f"   titulo          : {(re.search(r'(?is)<title>(.*?)</title>', s) or [0,'?'])[1][:70]}")
    print(f"   palabras        : {len(texto(dc).split())}")
    print(f"   iframe          : {bool(re.search(r'<iframe', s))}")
print()
print("   la seccion de herramientas: donde aparece dashboard-colombia")
for p in [ROOT / "tools" / "index.html", ROOT / "index.html"]:
    if not p.exists():
        continue
    s = p.read_text(encoding="utf-8", errors="ignore")
    i = s.find("dashboard-colombia")
    if i > 0:
        ctx = re.sub(r"\s+", " ", s[max(0, i - 400):i + 200])
        print(f"      {p.relative_to(ROOT).as_posix()}: ...{ctx[-380:]}")
