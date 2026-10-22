"""Mueve el indice de contenidos de los articulos ES al principio del cuerpo.

El builder antiguo dejaba una lista de <li> suelta al final del articulo, sin
<ul> y sin nav: invisible como indice y fea de leer. Esto lo convierte en un
<nav class="toc"> colocado antes del cuerpo. Idempotente.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FILES = [
    "blog/es-black-friday-libros-ocultismo-2026.html",
    "blog/es-regalos-ocultismo-navidad-2026.html",
    "blog/es-mejores-apps-astrologia-android-2026.html",
    "blog/es-carta-natal-gratis-como-leerla.html",
    "blog/es-magia-del-caos-para-principiantes.html",
]

LI = r'<li><a href="#[^"]+">.*?</li>'
BLOQUE = re.compile(r"((?:\s*" + LI + r")+)\s*(?=<div class=\"faq\">)", re.S)
MAIN = '<main class="wrap">'


def fix(path: Path) -> str:
    t = path.read_text(encoding="utf-8")
    m = BLOQUE.search(t)
    if not m:
        return "sin bloque suelto"
    items = re.findall(LI, m.group(1), re.S)
    nav = '<nav class="toc" aria-label="Contenido"><ul>' + "".join(items) + "</ul></nav>\n"
    t = t[: m.start()] + t[m.end():]
    if MAIN not in t:
        return "sin <main class=wrap>"
    t = t.replace(MAIN, MAIN + "\n" + nav, 1)
    path.write_text(t, encoding="utf-8")
    return f"{len(items)} enlaces movidos"


def main() -> int:
    for rel in FILES:
        print(f"{rel}: {fix(ROOT / rel)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
