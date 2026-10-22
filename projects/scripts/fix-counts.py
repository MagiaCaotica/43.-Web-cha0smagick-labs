#!/usr/bin/env python3
"""
Unifica las cifras declaradas del sitio contra la realidad.

El problema medido: el numero de herramientas se declaraba de cuatro formas
distintas segun la pagina (61, 62, 71 y 40), y el de libros de dos (7 y 8),
mientras la realidad es:

  - 70 herramientas: data/toolkit.json tiene 70 fichas, tools/ tiene 70
    paginas. Es la fuente de verdad (una ficha por pagina).
  - 6 copias en espanol en es/tools/ que comparten slug con las suyas: no
    son herramientas nuevas, son las mismas en otro idioma, asi que no se
    suman.
  - 9 libros: scripts/bots/data/offers.json.
  - 38 guias en espanol: 37 articulos es-*.html + el hub estacional.

Por que importa mas de lo que parece: una cifra que no cuadra es la razon
mas rapida para que un lector concluya que el resto de las afirmaciones
tambien estan infladas. Google evalua la pagina, pero el lector evalua al
editor.

Este script es idempotente.

  python projects/scripts/fix-counts.py
"""
import json
import re
from pathlib import Path

ROOT = Path(".").resolve()

REAL = {
    "herramientas": None,   # se calcula
    "libros": None,
    "guias_es": None,
}


def medir():
    tk = json.loads((ROOT / "data" / "toolkit.json").read_text(encoding="utf-8"))
    herramientas = len(tk["tools"])
    libros = len(json.loads((ROOT / "scripts" / "bots" / "data" / "offers.json")
                            .read_text(encoding="utf-8"))["books"])
    guias_es = len(list((ROOT / "blog").glob("es-*.html"))) + 1  # + el hub estacional
    return herramientas, libros, guias_es


# (patron, reemplazo)  -- se aplican en orden
REGLAS = [
    # --- herramientas ---
    (r'\b61\s+herramientas\s+web\s+gratis\b', '{H} herramientas web gratis'),
    (r'\b61\s+herramientas\s+gratis\b', '{H} herramientas gratis'),
    (r'\b61\s+herramientas\b', '{H} herramientas'),
    (r'\b61\s+free\s+web\s+tools\b', '{H} free web tools'),
    (r'\b61\s+free\s+tools\b', '{H} free tools'),
    (r'\b62\s+herramientas\b', '{H} herramientas'),
    (r'\b62\s+free\s+tools\b', '{H} free tools'),
    (r'\b71\s+herramientas\s+gratis\b', '{H} herramientas gratis'),
    (r'\b71\s+herramientas\b', '{H} herramientas'),
    (r'\b71\s+free\s+web\s+tools\b', '{H} free web tools'),
    (r'\b71\s+free\s+online\s+tools\b', '{H} free online tools'),
    (r'\b71\s+free\s+sigil\b', '{H} free sigil'),
    (r'\b71\s+free\s+tools\b', '{H} free tools'),
    (r'\b71\s+Free\s+Tools\b', '{H} Free Tools'),
    # --- libros ---
    (r'\b8\s+LIBROS\b', '{L} LIBROS'),
    (r'\b8\s+libros\s+digitales\b', '{L} libros digitales'),
    (r'\b7\s+PDF\s+books\b', '{L} PDF books'),
    (r'\b7\s+pdf\s+books\b', '{L} PDF books'),
    # --- guias en espanol ---
    (r'\b32\s+gu[ií]as\s+completas\b', '{G} guías completas'),
    (r'\b32\s+gu[ií]as\b', '{G} guías'),
]


def main():
    herramientas, libros, guias = medir()
    print(f"   realidad: {herramientas} herramientas, {libros} libros, {guias} guías ES")

    cambios = 0
    paginas = 0
    for p in sorted(ROOT.rglob("*.html")):
        rel = p.as_posix()
        if any(x in rel for x in ("node_modules", ".git", "auto-shorts",
                                  "pinterest-pins", "projects/docs")):
            continue
        s = p.read_text(encoding="utf-8", errors="ignore")
        orig = s
        for pat, rep in REGLAS:
            s = re.sub(pat, rep.format(H=herramientas, L=libros, G=guias), s, flags=re.I)
        if s != orig:
            p.write_text(s, encoding="utf-8")
            cambios += 1
            paginas += 1
    print(f"   {cambios} paginas actualizadas")

    # el indice ES tiene contadores en HTML sueltos
    idx = ROOT / "es" / "index.html"
    s = idx.read_text(encoding="utf-8", errors="ignore")
    s = re.sub(r'(<b>)\d+(</b><span>gu[ií]as en espa[^<]*</span>)', rf'\g<1>{guias}\2', s)
    s = re.sub(r'(<b>)\d+(</b><span>libros digitales</span>)', rf'\g<1>{libros}\2', s)
    s = re.sub(r'(<b>)\d+(</b><span>herramientas gratis</span>)', rf'\g<1>{herramientas}\2', s)
    idx.write_text(s, encoding="utf-8")
    print("   es/index.html: contadores actualizados")

    # verificacion: que no quede ninguna cifra vieja
    print("   verificacion:")
    for pat, nombre in [(r'\b61\s+(?:herramientas|free tools|free web tools)', "61 herramientas"),
                         (r'\b62\s+(?:herramientas|free tools)', "62 herramientas"),
                         (r'\b71\s+(?:herramientas|free tools|free online tools|free sigil)', "71 herramientas"),
                         (r'\b32\s+gu[ií]as', "32 guías"),
                         (r'\b7\s+PDF\s+books', "7 PDF books"),
                         (r'\b8\s+LIBROS', "8 LIBROS")]:
        n = 0
        for p in ROOT.rglob("*.html"):
            rel = p.as_posix()
            if any(x in rel for x in ("node_modules", ".git", "auto-shorts",
                                      "pinterest-pins", "projects/docs")):
                continue
            n += len(re.findall(pat, p.read_text(encoding="utf-8", errors="ignore"), re.I))
        print(f"      {nombre:20} restantes: {n}")


if __name__ == "__main__":
    main()
