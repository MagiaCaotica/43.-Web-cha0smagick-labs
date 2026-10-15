#!/usr/bin/env python3
"""
Generate sitemap.xml for all pages.

POR QUE ESTE SCRIPT ES ADITIVO Y NO REGENERADOR
----------------------------------------------
La version anterior reconstruia sitemap.xml desde cero. Eso convertia el
fichero en un artefacto fragile: cualquier URL anadida a mano o por otro
script (tools/, es/, landing-pages/, lead-magnet/, las paginas legales de
raiz) desaparecia en la siguiente ejecucion. Medido antes de arreglarlo:
ejecutarlo borraba 104 URLs de 984, incluidas las cuatro paginas legales
obligatorias. Cuatro lineas mal elegidas y 104 enlaces muertos.

Ahora el script:
  1. Descubre TODAS las URLs que puede, incluyendo tools/.
  2. Lee el sitemap existente y CONSERVA el orden, el lastmod y la
     prioridad de todo lo que ya estaba. Idempotente: si nada cambia,
     el fichero no cambia y el diff es cero.
  3. Anade solo las URLs nuevas, con metadatos de este script.
  4. Elimina solo las URLs cuyo fichero ya no existe en disco.

Es decir: no puede perder trabajo que no sea suyo para perder.
"""

import re
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://cha0smagicklabs.com"
SITEMAP = ROOT / "sitemap.xml"

LOC_RE = re.compile(r"<loc>(.*?)</loc>")
# El bloque COMPLETO, envuelto en <url>...</url>, e incluyendo su
# indentacion previa. Guardar solo el contenido interno (como hacia una
# version anterior) reescribia el sitemap sin envoltorios y la siguiente
# ejecucion no encontraba nada que conservar. Sin capturar tambien los
# espacios, las entradas nuevas perdian su indentacion en la segunda pasada
# y el script no era idempotente.
ENTRY_RE = re.compile(r"[ \t]*<url>.*?</url>", re.S)


def get_lastmod(filepath):
    """Last modified date of a file, YYYY-MM-DD."""
    return datetime.fromtimestamp(filepath.stat().st_mtime).strftime("%Y-%m-%d")


def file_for(loc):
    """URL -> Path en disco, resolviendo los indices de directorio."""
    path = loc.split(SITE, 1)[-1].split("?", 1)[0].split("#", 1)[0]
    target = ROOT / path.lstrip("/")
    if target.is_dir():
        target = target / "index.html"
    return target


def discover():
    """URLs que este script es capaz de generar, con sus metadatos."""
    urls = []

    def add(loc, lastmod, freq, priority):
        urls.append(
            {"loc": loc, "lastmod": lastmod, "changefreq": freq, "priority": priority}
        )

    # Homepage
    add(SITE + "/", get_lastmod(ROOT / "index.html"), "weekly", "1.0")

    # Paginas de indice de seccion
    for path, freq, priority in [
        ("/tools/", "weekly", "0.8"),
        ("/blog/", "daily", "0.9"),
        ("/es/", "weekly", "0.7"),
    ]:
        fp = ROOT / path.lstrip("/")
        target = fp / "index.html" if fp.is_dir() else fp
        if target.exists():
            add(SITE + path, get_lastmod(target), freq, priority)

    # Directorios con paginas de contenido
    for folder, freq, priority in [
        ("apps", "monthly", "0.9"),
        ("books", "monthly", "0.9"),
        ("blog", "weekly", "0.8"),
        ("es", "weekly", "0.7"),
        ("tools", "monthly", "0.8"),
        ("landing-pages", "monthly", "0.7"),
        ("lead-magnet", "monthly", "0.6"),
        ("compare", "monthly", "0.7"),
        ("pages", "monthly", "0.6"),
    ]:
        for fp in sorted((ROOT / folder).glob("*.html")):
            if fp.name == "index.html":
                continue
            add(f"{SITE}/{folder}/{fp.name}", get_lastmod(fp), freq, priority)

    # Paginas sueltas de la raiz (legales, landings y fichas de app)
    for fp in sorted(ROOT.glob("*.html")):
        if fp.name in ("index.html", "404.html"):
            continue
        add(f"{SITE}/{fp.name}", get_lastmod(fp), "monthly", "0.7")

    return {u["loc"]: u for u in urls}


def existing():
    """URLs ya presentes, en orden, con su bloque XML original."""
    if not SITEMAP.exists():
        return []
    text = SITEMAP.read_text(encoding="utf-8")
    out = []
    for m in ENTRY_RE.finditer(text):
        loc = LOC_RE.search(m.group(0))
        if loc:
            out.append((loc.group(1), m.group(0)))
    return out


def render(entry):
    return (
        "  <url>\n"
        f"    <loc>{entry['loc']}</loc>\n"
        f"    <lastmod>{entry['lastmod']}</lastmod>\n"
        f"    <changefreq>{entry['changefreq']}</changefreq>\n"
        f"    <priority>{entry['priority']}</priority>\n"
        "  </url>"
    )


def main():
    known = discover()
    kept, dropped, added = [], [], []

    # 1. Se conserva todo lo que ya estaba, en su orden y con su metadatos.
    for loc, block in existing():
        target = file_for(loc)
        if target.exists():
            kept.append(block)
        else:
            dropped.append(loc)

    seen = {loc for loc, _ in existing()}
    # 2. Se anade lo que falte y se sepa generar.
    for loc, entry in known.items():
        if loc not in seen:
            kept.append(render(entry))
            added.append(loc)

    xml = "\n".join(
        ['<?xml version="1.0" encoding="UTF-8"?>',
         '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
        + kept
        + ["</urlset>", ""]
    )
    SITEMAP.write_text(xml, encoding="utf-8")

    print(f"Generated sitemap.xml with {len(kept)} URLs")
    print(f"  conservadas: {len(kept) - len(added)}")
    print(f"  anadidas:    {len(added)}")
    if dropped:
        print(f"  eliminadas por no existir en disco: {len(dropped)}")
        for loc in dropped:
            print(f"    - {loc}")


if __name__ == "__main__":
    main()