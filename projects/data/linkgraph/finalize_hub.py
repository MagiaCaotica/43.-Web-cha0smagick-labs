#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""finalize_hub.py — estilos del hub y sitemap completo.

Lo que corrige, medido antes de escribir nada:

  * `blog/index.html` no enlazaba `css/wisdom.css`, asi que el hub no tendria
    ni los estilos de sus propios grupos ni los de los modulos de referencia
    que ahora llevan los 815 articulos;
  * `sitemap.xml` declaraba 604 URLs, de las cuales solo 539 eran de blog:
    278 de los 815 articulos no estaban declarados para ningun buscador.

Por eso este script hace dos cosas y solo dos:

  1. anade al final de `css/wisdom.css` el bloque de estilos del hub, con
     marcadores para no duplicarlo, y enlaza esa hoja en `blog/index.html`;
  2. reconstruye el conjunto de URLs de blog en `sitemap.xml` conservando
     intactas las entradas que ya no son de blog (raiz, tools, apps, books y
     las cuatro paginas legales) y anadiendo una entrada por cada articulo.

Idempotente en las dos operaciones.
"""

import os
import re
import sys
from datetime import date

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
INDEX = os.path.join(BLOG, "index.html")
SITEMAP = os.path.join(REPO, "sitemap.xml")
CSS = os.path.join(REPO, "css", "wisdom.css")

CSS_MARK_START = "/* linkgraph:hub:styles:start */"
CSS_MARK_END = "/* linkgraph:hub:styles:end */"
CSS_LINK = '<link rel="stylesheet" href="../css/wisdom.css">'

SITE = "https://cha0smagicklabs.com"

HUB_CSS = CSS_MARK_START + """
.hub-jump {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.5rem;
  margin: 0 0 2.5rem;
  padding: 1rem 1.1rem;
  background: var(--bg-card, #141a2e);
  border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  border-radius: 10px;
}
.hub-jump-link {
  display: inline-block;
  padding: 0.25rem 0.6rem;
  font-size: 0.78rem;
  letter-spacing: 0.02em;
  color: #cfe0ff;
  text-decoration: none;
  border: 1px solid rgba(255, 176, 58, 0.28);
  border-radius: 999px;
}
.hub-jump-link:hover,
.hub-jump-link:focus-visible {
  color: #0b1026;
  background: #ffb03a;
  border-color: #ffb03a;
}
.hub-jump-link .hub-count {
  color: #8a93b8;
  font-variant-numeric: tabular-nums;
  margin-left: 0.15rem;
}
.hub-jump-link:hover .hub-count,
.hub-jump-link:focus-visible .hub-count { color: #0b1026; }

.hub-group { margin: 0 0 2.75rem; }
.hub-h2 {
  position: relative;
  margin: 0 0 0.35rem;
  padding: 0 0 0.5rem 0.85rem;
  font-size: 1.32rem;
  line-height: 1.25;
  color: #f5f7ff;
  border-bottom: 1px solid rgba(255, 176, 58, 0.22);
}
.hub-h2::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.3em;
  bottom: 0.75em;
  width: 6px;
  border-radius: 3px;
  background: linear-gradient(180deg, #ffb03a, #ff8c42);
}
.hub-h2 .hub-n {
  margin-left: 0.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8a93b8;
  vertical-align: middle;
}
.hub-group .posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(19rem, 1fr));
  gap: 1rem;
}
.hub-group .post-card {
  border-left: 3px solid rgba(255, 176, 58, 0.5);
}
.hub-group .post-card .date { color: #8a93b8; }
.hub-group .post-card h3 { font-size: 1rem; line-height: 1.3; }
.hub-group .post-card h3 a { color: #f5f7ff; text-decoration: none; }
.hub-group .post-card h3 a:hover { color: #ffd79a; }
.hub-group .post-card .excerpt { font-size: 0.84rem; line-height: 1.5; }

@media (max-width: 640px) {
  .hub-group .posts { grid-template-columns: 1fr; }
  .hub-h2 { font-size: 1.12rem; }
}
""" + CSS_MARK_END


def ensure_css():
    changed = []
    with open(CSS, "r", encoding="utf-8", newline="") as f:
        css = f.read()
    if CSS_MARK_START in css:
        new_css = re.sub(
            re.escape(CSS_MARK_START) + ".*?" + re.escape(CSS_MARK_END),
            lambda _m: HUB_CSS, css, count=1, flags=re.S)
        if new_css != css:
            with open(CSS, "w", encoding="utf-8", newline="") as f:
                f.write(new_css)
            changed.append("wisdom.css: estilos del hub actualizados")
    else:
        nl = "\r\n" if "\r\n" in css else "\n"
        new_css = css.rstrip() + nl + nl + HUB_CSS.replace("\n", nl) + nl
        with open(CSS, "w", encoding="utf-8", newline="") as f:
            f.write(new_css)
        changed.append("wisdom.css: +%d lineas de estilos del hub"
                       % HUB_CSS.count("\n"))
    return changed


def ensure_index_link():
    with open(INDEX, "r", encoding="utf-8", newline="") as f:
        html = f.read()
    if CSS_LINK in html:
        return []
    m = re.search(r'<link[^>]+rel="stylesheet"[^>]+href="\.\./css/[^"]+"[^>]*>', html)
    if not m:
        print("FALLO: blog/index.html no enlaza ninguna hoja ../css/")
        return None
    nl = "\r\n" if "\r\n" in html else "\n"
    new = html[:m.end()] + nl + CSS_LINK + html[m.end():]
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(new)
    return ["blog/index.html: enlaza wisdom.css"]


def ensure_sitemap():
    with open(SITEMAP, "r", encoding="utf-8", newline="") as f:
        sm = f.read()

    entries = re.findall(r"<url>[\s\S]*?</url>", sm)
    if not entries:
        print("FALLO: sitemap.xml no tiene entradas <url>")
        return None

    def loc_of(e):
        m = re.search(r"<loc>([^<]+)</loc>", e)
        return m.group(1) if m else ""

    # se conservan tal cual las entradas que no son de articulo
    others = [e for e in entries if "/blog/" not in loc_of(e)]
    # la plantilla se toma de una entrada de blog existente, para no inventar
    # un formato que el resto del archivo no usa
    blog_entries = [e for e in entries if "/blog/" in loc_of(e)]
    template = blog_entries[0] if blog_entries else None
    if template is None:
        print("FALLO: no hay entradas de blog en sitemap.xml")
        return None

    slugs = sorted(f[:-5] for f in os.listdir(BLOG) if f.endswith(".html"))
    stamp = date.today().isoformat()
    new_blog = []
    for slug in slugs:
        loc = "%s/blog/%s.html" % (SITE, slug)
        if re.search(r"<lastmod>", template):
            entry = re.sub(r"<lastmod>[^<]*</lastmod>",
                           "<lastmod>%s</lastmod>" % stamp, template)
        else:
            entry = template
        new_blog.append(re.sub(r"<loc>[^<]*</loc>",
                               "<loc>%s</loc>" % loc, entry, count=1))

    # los articulos van al final, justo antes de </urlset>
    head = sm[:sm.index("<url>")]
    tail = "</urlset>"
    new_sm = head + "\r\n".join(others + new_blog) + "\r\n" + tail
    with open(SITEMAP, "w", encoding="utf-8", newline="") as f:
        f.write(new_sm)
    return ["sitemap.xml: %d entradas de blog (antes %d), %d de otras paginas"
            % (len(new_blog), len(blog_entries), len(others))]


def main():
    notes = []
    for fn in (ensure_css, ensure_index_link, ensure_sitemap):
        r = fn()
        if r is None:
            return 1
        notes.extend(r)
    if not notes:
        print("sin cambios")
    for n in notes:
        print(n)
    return 0


if __name__ == "__main__":
    sys.exit(main())
