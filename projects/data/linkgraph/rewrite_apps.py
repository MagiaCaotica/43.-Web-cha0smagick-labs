#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
rewrite_apps.py — Fase 1 del rediseño de enlaces.

Inyecta en cada apps/<app>.html un módulo "plantilla de sabiduría":
prosa larga escrita a mano por app, con hipervínculos EN EL TEXTO hacia
artículos del blog, más un índice plegable de la biblioteca.

Idempotente: el módulo vive entre los marcadores
    <!-- linkgraph:wisdom:start -->  ...  <!-- linkgraph:wisdom:end -->
y se reescribe entero en cada corrida (nunca se apila).

Fuente de la prosa: projects/data/linkgraph/wisdom/<app>.json
    {
      "lede": "párrafo de apertura (puede llevar enlaces [T](slug))",
      "sections": [ {"h3": "...", "p": ["...", "..."]} , ... ],
      "foot": "párrafo de cierre (opcional)"
    }

Marcado de enlace admitido dentro de la prosa:  [texto visible](slug-de-articulo)
El slug se resuelve a  <a href="../blog/<slug>.html">texto visible</a>

Uso:
    python rewrite_apps.py                 # todas las apps con prosa disponible
    python rewrite_apps.py psi-gym noctem-tools
    python rewrite_apps.py --check         # solo valida, no escribe
"""
from __future__ import annotations

import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
APPS_DIR = os.path.join(ROOT, "apps")
BLOG_DIR = os.path.join(ROOT, "blog")
WISDOM_DIR = os.path.join(HERE, "wisdom")
GRAPH_PATH = os.path.join(ROOT, "data", "link-graph.json")

MIN_LINKS = 30
MARK_START = "<!-- linkgraph:wisdom:start -->"
MARK_END = "<!-- linkgraph:wisdom:end -->"

LINK_RE = re.compile(r"\[([^\]\[]{1,120})\]\(([a-z0-9][a-z0-9\-]{2,120})\)")

# Convierte un título de artículo en un ancla legible y no gigante.
TITLE_STOP = re.compile(
    r"^(the|a|an|of|to|for|and|or|how|why|what|when|where|which|is|are|do|does|"
    r"can|should|with|your|you|my|it|in|on|at|that|this|be|as|by|from)$"
)


def anchor_text(title: str, max_words: int = 9) -> str:
    """Recorta un título para usarlo como ancla sin perder el sentido."""
    t = re.sub(r"\s+", " ", title).strip()
    words = t.split(" ")
    if len(words) <= max_words:
        return t
    return " ".join(words[:max_words]).rstrip(",;:.")


def render_prose(text: str, allowed: set[str], known_titles: dict[str, str],
                 errors: list[str], where: str) -> tuple[str, int, list[str]]:
    """Convierte [texto](slug) en <a href="../blog/slug.html">texto</a>."""
    used: list[str] = []
    n = 0

    def sub(m: "re.Match[str]") -> str:
        nonlocal n
        label, slug = m.group(1).strip(), m.group(2).strip()
        if slug not in known_titles:
            errors.append(f"{where}: slug inexistente en blog/ -> {slug}")
            return m.group(0)
        if slug not in allowed:
            # No es un error: el grafo propone 36, la prosa puede usar más,
            # pero avisamos para que la curaduría lo sepa.
            pass
        n += 1
        if slug not in used:
            used.append(slug)
        return f'<a href="../blog/{slug}.html">{label}</a>'

    return LINK_RE.sub(sub, text), n, used


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_module(app: str, prose: dict, graph_apps: dict, articles: dict) -> tuple[str, int, list[str]]:
    errors: list[str] = []
    known = {a["slug"]: a["title"] for a in articles.values()}
    allowed = set(graph_apps.get("targets", []))

    lede_html, lede_n, lede_used = render_prose(
        prose.get("lede", ""), allowed, known, errors, f"{app}/lede")

    parts: list[str] = []
    total = lede_n
    used = list(lede_used)
    parts.append(f'        <p class="wisdom-lede">{lede_html}</p>')

    for si, sec in enumerate(prose.get("sections", [])):
        h3 = sec.get("h3", "").strip()
        if not h3:
            errors.append(f"{app}/sections[{si}]: falta h3")
            continue
        parts.append(f'        <h3>{esc(h3)}</h3>')
        paras = sec.get("p", [])
        if not isinstance(paras, list) or not paras:
            errors.append(f"{app}/sections[{si}]: falta p[]")
            continue
        for pi, para in enumerate(paras):
            html, n, u = render_prose(para, allowed, known, errors,
                                      f"{app}/sections[{si}]/p[{pi}]")
            total += n
            for s in u:
                if s not in used:
                    used.append(s)
            parts.append(f'        <p>{html}</p>')

    foot = prose.get("foot", "").strip()
    if foot:
        html, n, u = render_prose(foot, allowed, known, errors, f"{app}/foot")
        total += n
        for s in u:
            if s not in used:
                used.append(s)
        parts.append(f'        <p class="wisdom-foot">{html}</p>')

    # Índice plegable con 30 entradas de la biblioteca, agrupadas por dominio.
    idx_parts = ['        <details class="wisdom-index">',
                 '        <summary>Thirty entries from the library</summary>',
                 '        <dl>']
    by_domain: dict[str, list[str]] = {}
    for slug in graph_apps.get("targets", [])[:36]:
        art = articles.get(slug)
        if not art:
            continue
        by_domain.setdefault(art.get("domain", "misc"), []).append(slug)
    for dom in sorted(by_domain, key=lambda d: -len(by_domain[d])):
        idx_parts.append(f'            <dt>{esc(dom)}</dt>')
        idx_parts.append('            <dd>')
        for slug in by_domain[dom]:
            art = articles[slug]
            desc = (art.get("description") or "").strip()
            if len(desc) > 165:
                desc = desc[:162].rsplit(" ", 1)[0] + "…"
            label = anchor_text(art.get("title") or slug)
            idx_parts.append(
                f'            <a href="../blog/{slug}.html">{esc(label)}</a>'
                + (f' <span class="wi-desc">— {esc(desc)}</span>' if desc else ""))
            idx_parts.append("<br>")
        idx_parts.append('            </dd>')
    idx_parts.append('        </dl>')
    idx_parts.append('        </details>')

    h2 = prose.get("h2") or f"The Working Library: {graph_apps.get('name', app)}"
    body = "\n".join(parts + [""] + idx_parts)

    module = (
        f"{MARK_START}\n"
        f'        <section class="wisdom" id="wisdom" aria-labelledby="wisdom-h">\n'
        f'        <h2 id="wisdom-h">{esc(h2)}</h2>\n'
        f"{body}\n"
        f"        </section>\n"
        f"        {MARK_END}"
    )
    return module, total, errors


def inject(path: str, module: str) -> bool:
    html = io.open(path, encoding="utf-8").read()

    # 1) hoja de estilos (idempotente)
    if "css/wisdom.css" not in html:
        m = re.search(r'<link[^>]+href="\.\./css/style\.min\.css"[^>]*>', html)
        if m:
            html = html[:m.end()] + '\n    <link rel="stylesheet" href="../css/wisdom.css">' + html[m.end():]
        else:
            m = re.search(r'</head>', html)
            if not m:
                raise SystemExit(f"{path}: no encuentro </head>")
            html = html[:m.start()] + '    <link rel="stylesheet" href="../css/wisdom.css">\n' + html[m.start():]

    # 2) h1 real: hoy dice el nombre del sitio
    html = fix_h1(html)

    # 3) módulo de sabiduría, entre marcadores
    if MARK_START in html and MARK_END in html:
        a = html.index(MARK_START)
        b = html.index(MARK_END) + len(MARK_END)
        html = html[:a] + module + html[b:]
    else:
        i = html.find('<section class="app-detailed-info"')
        if i < 0:
            raise SystemExit(f"{path}: no encuentro app-detailed-info")
        j = html.find("</section>", i)
        if j < 0:
            raise SystemExit(f"{path}: app-detailed-info sin cerrar")
        anchor = html.rfind('<div class="cta-centered-wrapper">', i, j)
        if anchor < 0:
            anchor = j
        module_block = "\n" + module + "\n        "
        html = html[:anchor] + module_block + html[anchor:]

    io.open(path, "w", encoding="utf-8", newline="").write(html)
    return True


def fix_h1(html: str) -> str:
    """El <h1> de las paginas de app dice hoy el nombre del sitio.

    Lo cambiamos por el nombre real de la app, que vive en el <h2> de
    div.detail-header-info. Se quitan las etiquetas internas del h2 (badges NEW!)
    y se deja solo el texto del nombre.
    """
    m = re.search(r"<h1([^>]*)>(.*?)</h1>", html, re.S)
    if not m:
        return html
    if "Cha0smagick Labs" not in m.group(2):
        return html

    header = re.search(
        r'<div class="detail-header-info">(.*?)</div>', html, re.S
    )
    if not header:
        return html
    h2 = re.search(r"<h2[^>]*>(.*?)</h2>", header.group(1), re.S)
    if not h2:
        return html

    # texto plano del h2, sin etiquetas internas
    plain = re.sub(r"<[^>]+>", " ", h2.group(1))
    plain = re.sub(r"\s+", " ", plain).strip()
    # el h2 suele traer un subtitulo tras ": " o " | "; nos quedamos con la parte
    # que precede al separador cuando el resultado sigue siendo un nombre corto
    head = re.split(r"\s*[::|]\s*", plain)[0].strip()
    name = head if 2 <= len(head) <= 60 else plain
    if not name:
        return html

    # el h1 pasa a contener SOLO el nombre de la app: el nombre del sitio vive
    # ya en el title, en el og:site_name y en el pie, y repetirlo aqui hacia
    # que la pagina no tuviera encabezado propio
    text = re.sub(r"\s+", " ", name).strip()

    return html[: m.start()] + f"<h1{m.group(1)}>{text}</h1>" + html[m.end() :]


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    check = "--check" in sys.argv

    graph = json.load(io.open(GRAPH_PATH, encoding="utf-8"))
    articles = {a["slug"]: a for a in graph["articles"]}
    # en link-graph.json "apps" es una LISTA, no un dict
    apps = {a["slug"]: a for a in graph["apps"]}

    names = args or list(apps)
    rc = 0
    for app in names:
        ga = apps.get(app)
        if not ga:
            print(f"[SKIP] {app}: no esta en link-graph.json")
            rc = 1
            continue
        wpath = os.path.join(WISDOM_DIR, f"{app}.json")
        if not os.path.exists(wpath):
            print(f"[PEND] {app}: sin prosa en wisdom/{app}.json")
            rc = 1
            continue
        prose = json.load(io.open(wpath, encoding="utf-8"))
        module, nlinks, errors = build_module(app, prose, ga, articles)
        for e in errors:
            print(f"  [ERR] {e}")
            rc = 1
        status = "OK" if (nlinks >= MIN_LINKS and not errors) else "FAIL"
        if status == "FAIL":
            rc = 1
        path = os.path.join(APPS_DIR, os.path.basename(ga["path"]))
        if not check:
            inject(path, module)
        print(f"[{status}] {app}: {nlinks} enlaces en el texto "
              f"({'min ' + str(MIN_LINKS) + ' ok' if nlinks >= MIN_LINKS else 'INSUFICIENTE'})")
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
