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
import subprocess
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://cha0smagicklabs.com"
SITEMAP = ROOT / "sitemap.xml"

LOC_RE = re.compile(r"<loc>(.*?)</loc>")

# ---------------------------------------------------------------------------
# LAS TRES REGLAS QUE EL SITEMAP NO PUEDE VIOLAR
# ---------------------------------------------------------------------------
# 1. Una pagina con noindex no se anuncia. Google registra el error
#    "Submitted URL marked noindex" y gasta presupuesto de rastreo en una
#    URL que el mismo le dijo que no indexe.
# 2. Una pagina que git no publica no se anuncia. GitHub Pages en modo
#    legacy publica el repositorio tal cual: lo que .gitignore excluye NO
#    existe en produccion y el sitemap lo convierte en un 404.
# 3. lastmod dice la verdad: la fecha del ultimo commit que toco el
#    fichero. Conservar el lastmod viejo para siempre hacia que Google
#    creyera que el sitio entero llevaba meses sin cambios, y por tanto
#    que no merecia la pena volver a rastrearlo.
# ---------------------------------------------------------------------------
NOINDEX_RE = re.compile(
    r"<meta[^>]+name=[\"']robots[\"'][^>]*content=[\"'][^\"']*noindex", re.I
)


def git_tracked():
    """Ficheros que git publica (y por tanto Pages sirve)."""
    out = subprocess.run(
        ["git", "ls-files"], cwd=ROOT, capture_output=True, text=True, check=True
    ).stdout
    return {line for line in out.splitlines() if line}


def git_dates():
    """fichero -> fecha (YYYY-MM-DD) del ultimo commit que lo toco."""
    out = subprocess.run(
        ["git", "log", "--pretty=format:@@%cs", "--name-only", "--no-merges"],
        cwd=ROOT,
        capture_output=True,
        text=True,
    ).stdout
    dates = {}
    current = None
    for line in out.splitlines():
        if line.startswith("@@"):
            current = line[2:].strip()
        elif line and current and line not in dates:
            dates[line] = current
    return dates


TRACKED = git_tracked()
GIT_DATES = git_dates()


CANON_RE = re.compile(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', re.I)


def canonical_of(path):
    """Canonical declarado por la pagina, o None."""
    try:
        head = path.read_text(encoding="utf-8", errors="ignore")[:20000]
    except OSError:
        return None
    m = CANON_RE.search(head)
    return m.group(1).strip() if m else None


def is_publishable(rel_path):
    """Se puede anunciar en el sitemap: existe, git lo publica y no es noindex."""
    if rel_path.replace("\\", "/") not in TRACKED:
        return False
    fp = ROOT / rel_path
    if not fp.is_file():
        return False
    try:
        head = fp.read_text(encoding="utf-8", errors="ignore")[:20000]
    except OSError:
        return False
    return NOINDEX_RE.search(head) is None

# El bloque COMPLETO, envuelto en <url>...</url>, e incluyendo su
# indentacion previa. Guardar solo el contenido interno (como hacia una
# version anterior) reescribia el sitemap sin envoltorios y la siguiente
# ejecucion no encontraba nada que conservar. Sin capturar tambien los
# espacios, las entradas nuevas perdian su indentacion en la segunda pasada
# y el script no era idempotente.
ENTRY_RE = re.compile(r"[ \t]*<url>.*?</url>", re.S)


def get_lastmod(filepath):
    """Ultima modificacion real del fichero: la fecha del commit que lo toco.

    Antes se guardaba el mtime del disco y despues se conservaba para
    siempre, con lo que lastmod se congelaba. Con la fecha del commit el
    valor es estable entre ejecuciones y truthful.
    """
    try:
        rel = filepath.resolve().relative_to(ROOT).as_posix()
    except ValueError:
        rel = ""
    if rel in GIT_DATES:
        return GIT_DATES[rel]
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

    def add(loc, filepath, freq, priority):
        rel = filepath.resolve().relative_to(ROOT).as_posix()
        if not is_publishable(rel):
            return
        urls.append(
            {"loc": loc, "lastmod": get_lastmod(filepath), "changefreq": freq, "priority": priority}
        )

    # Homepage
    add(SITE + "/", ROOT / "index.html", "weekly", "1.0")

    # Paginas de indice de seccion
    for path, freq, priority in [
        ("/tools/", "weekly", "0.8"),
        ("/blog/", "daily", "0.9"),
        ("/es/", "weekly", "0.7"),
    ]:
        fp = ROOT / path.lstrip("/")
        target = fp / "index.html" if fp.is_dir() else fp
        if target.exists():
            add(SITE + path, target, freq, priority)

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
            add(f"{SITE}/{folder}/{fp.name}", fp, freq, priority)

    # Paginas sueltas de la raiz (legales, landings y fichas de app)
    for fp in sorted(ROOT.glob("*.html")):
        if fp.name in ("index.html", "404.html"):
            continue
        add(f"{SITE}/{fp.name}", fp, "monthly", "0.7")

    return {u["loc"]: u for u in urls}


def existing():
    """URLs ya presentes, en orden, con sus metadatos."""
    if not SITEMAP.exists():
        return []
    text = SITEMAP.read_text(encoding="utf-8")
    out = []
    for m in ENTRY_RE.finditer(text):
        block = m.group(0)
        loc = LOC_RE.search(block)
        if not loc:
            continue
        lm = re.search(r"<lastmod>(.*?)</lastmod>", block, re.S)
        cf = re.search(r"<changefreq>(.*?)</changefreq>", block, re.S)
        pr = re.search(r"<priority>(.*?)</priority>", block, re.S)
        out.append(
            {
                "loc": loc.group(1),
                "lastmod": lm.group(1).strip() if lm else "",
                "changefreq": cf.group(1).strip() if cf else "monthly",
                "priority": pr.group(1).strip() if pr else "0.7",
            }
        )
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
    kept, dropped, added, refreshed = [], [], [], []

    prev = existing()
    seen = {e["loc"] for e in prev}
    emitted = set()

    # 1. Se conserva lo que ya estaba y sigue siendo publicable, actualizando
    #    su lastmod con la fecha real del ultimo commit que toco el fichero.
    for entry in prev:
        target = file_for(entry["loc"])
        if not target.exists():
            dropped.append(entry["loc"] + "  (no existe en disco)")
            continue
        rel = target.resolve().relative_to(ROOT).as_posix()
        if not is_publishable(rel):
            dropped.append(entry["loc"] + "  (noindex o no lo publica git)")
            continue
        fresh = get_lastmod(target)
        if entry["lastmod"] != fresh:
            refreshed.append(entry["loc"])
        entry["lastmod"] = fresh
        # El sitemap anuncia la URL que la pagina declara como canonical.
        # Si la pagina dice ".../blog/" y el sitemap dice ".../blog/index.html",
        # Google marca la entrada como canonical distinto y la descarta.
        canon = canonical_of(target)
        if canon and canon.startswith(SITE) and canon != entry["loc"]:
            misma_pagina = canon.rstrip("/") == entry["loc"].replace("/index.html", "").rstrip("/")
            if misma_pagina:
                entry["loc"] = canon
        if entry["loc"] in emitted:
            dropped.append(entry["loc"] + "  (duplicada: misma URL dos veces)")
            continue
        emitted.add(entry["loc"])
        kept.append(render(entry))

    # 2. Se anade lo que falte y se sepa generar. 'seen' se recalcula porque
    #    arriba algunas entradas pudieron cambiar de URL (canonical).
    seen = {LOC_RE.search(block).group(1) for block in kept}
    for loc, entry in known.items():
        if loc not in seen:
            kept.append(render(entry))
            added.append(loc)
            seen.add(loc)

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
    print(f"  lastmod actualizado: {len(refreshed)}")
    if dropped:
        print(f"  eliminadas ({len(dropped)}):")
        for loc in dropped:
            print(f"    - {loc}")


if __name__ == "__main__":
    main()