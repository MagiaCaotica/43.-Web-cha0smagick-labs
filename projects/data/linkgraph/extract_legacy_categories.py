#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""extract_legacy_categories.py — rescata las categorias del indice anterior.

El grafo solo tiene `category` para los 349 articulos de YouTube, porque su
categoria viene de `blog_category` en specs.json. Los 466 legacy arrive con
`category: null`, ya que no hay JSON de origen del que leerla.

Esas categorias NO eran inventadas: el indice anterior del blog las tenia
puestas a mano, una por articulo, y por eso el filtro por categoria del sitio
funcionaba. Al reconstruir el hub desde el grafo, sin este rescate, los 466
legacy caian todos en `advanced` y once de los doce botones del filtro se
quedaban sin nada que mostrar.

Este script se lee una vez de `git show HEAD:blog/index.html` y guarda el
resultado en `legacy_categories.json`. A partir de ahi el dato vive en el
repositorio y `rebuild_index.py` no depende del historial de git.
"""

import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
OUT = os.path.join(HERE, "legacy_categories.json")
OLD = "blog/index.html"

CARD = re.compile(
    r'<div class="post-card" data-category="([^"]*)">'
    r'[\s\S]{0,400}?<h3><a href="([a-z0-9][a-z0-9\-]*)\.html"',
    re.I,
)


def main():
    raw = subprocess.run(
        ["git", "show", "HEAD:" + OLD],
        cwd=REPO, stdout=subprocess.PIPE, check=True,
    ).stdout.decode("utf-8", "replace")

    found = {}
    for cat, slug in CARD.findall(raw):
        cat = cat.strip()
        if cat and slug not in found:
            found[slug] = cat

    if not found:
        print("FALLO: no se extrajo ninguna categoria del indice anterior")
        return 1

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(found, f, indent=2, ensure_ascii=False, sort_keys=True)
        f.write("\n")

    dist = {}
    for v in found.values():
        dist[v] = dist.get(v, 0) + 1
    print("categorias rescatadas: %d articulos" % len(found))
    for k in sorted(dist, key=lambda x: -dist[x]):
        print("  %-12s %d" % (k, dist[k]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
