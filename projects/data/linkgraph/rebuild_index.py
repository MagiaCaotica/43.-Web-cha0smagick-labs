#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""rebuild_index.py — convierte blog/index.html en un hub navegable por tema.

Diagnostico que motives el script (medido, no supuesto):

  * el indice listaba 539 de los 815 articulos del directorio, o sea 277
    articulos reales no aparecian en ninguna parte del hub;
  * las 539 referencias que si existian apuntan a archivos que existen, asi
    que no hay enlaces muertos: el indice simplemente quedo atras respecto al
    catalogo;
  * no hay ni un solo <h2>: 542 <h3> planos, de modo que no hay ningun eje por
    el que recorrer el conjunto;
  * el filtro por categoria ya funciona (JS `filterCategory`, botones
    `.cat-btn`, tarjetas con `data-category`), asi que se conserva intacto.

Que hace:

  1. lee data/link-graph.json, que ya tiene los 815 articulos con dominio,
     cluster, categoria, titulo y descripcion;
  2. agrupa por los 43 dominios, ordenando los dominios por numero de
     articulos y dentro de cada uno por fecha descendente;
  3. emite un `<h2>` por dominio con su recuento, y dentro las mismas
     tarjetas `.post-card` que ya usaba el sitio, conservando
     `data-category` para que el filtro existente siga funcionando;
  4. antepone una tira de anclas a los dominios, para poder saltar de un
     tema a otro sin recorrer 800 lineas;
  5. sustituye SOLO el bloque de contenido, entre los marcadores. El head,
     el header, el nav, los botones de categoria, el footer y los cuatro
     scripts (gtag, shared, affiliate, conversion) no se tocan.

Idempotente: si los marcadores ya estan, reemplaza el bloque en vez de
apilarlo. Si el numero de tarjetas no cuadra con el grafo, falla con rc=1.
"""

import json
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
INDEX = os.path.join(BLOG, "index.html")
GRAPH = os.path.join(REPO, "data", "link-graph.json")
LEGACY_CAT_FILE = os.path.join(HERE, "legacy_categories.json")

# Relleno con extract_legacy_categories.py; se carga en load().
LEGACY_CATEGORY = {}

MARK_START = "<!-- linkgraph:hub:start -->"
MARK_END = "<!-- linkgraph:hub:end -->"

# el filtro existente usa estos nombres; el orden es el del sitio original
CATEGORY_ORDER = [
    "sigils", "divination", "dreaming", "goetia", "runes", "moon", "tarot",
    "iching", "basics", "reviews", "free-tools", "advanced",
]

# nombres legibles para los 43 dominios del grafo
DOMAIN_LABEL = {
    "astral-dreams": "Dreams, projection and the sleeping mind",
    "mind-science": "What the measurements actually support",
    "tarot": "Tarot, the deck and the reading",
    "sigils": "Sigils, glyphs and reduction",
    "lunar": "The moon, its phases and its timing",
    "chaos-basics": "The foundations of chaos magic",
    "runes": "Runes, futhark and runic alphabets",
    "goetia-demons": "The 72 spirits of the Goetia",
    "iching": "The I Ching and changing lines",
    "astral-parasites": "Entities, parasites and the frames people put on them",
    "technomancy": "Technomancy and cyber occultism",
    "secret-knowledge": "Lost, forbidden and hidden knowledge",
    "servitor-craft": "Servitors, thoughtforms and their upkeep",
    "entity-lore": "Working with named entities",
    "reality-hacking": "Gnosis, belief and paradigm shift",
    "history-occult": "The history of the occult, layer by layer",
    "love": "Love, attraction and the consent problem",
    "protection": "Banishing, cleansing and grounding",
    "occult-culture": "The occult scene and how it distributes itself",
    "creativity": "Creative output, blocks and constraints",
    "ritual-craft": "Ritual materials, correspondences and tables",
    "health": "Health rituals and the medical boundary",
    "time": "Time, causality and constructs",
    "music-magick": "Music as ritual technology",
    "creatures-vampire": "Vampires, identity practice and what to avoid",
    "mythology-ancient": "Ancient myth, and the reading conditions it needs",
    "money": "Money workings and what the ledger says",
    "money-pact": "Pacts, and why they are a different kind of request",
    "karmic-bonds": "Karmic bonds and the logic of obligation",
    "philosophy": "Philosophy of the occult",
    "comparative": "Comparing traditions instead of mixing them",
    "psychonaut": "Psychonautics and altered states",
    "horror-lore": "Weird fiction as a corpus, not a mood",
    "career": "Career, clients and study",
    "prayer": "Devotional and protective prayer",
    "divination": "Divination as a thinking practice",
    "scams-skepticism": "Scams, false teachers and how to spot them",
    "runes ": "Runes",
    "language-speech": "Language, speech and expression",
    "beauty": "Beauty and appearance workings",
    "astral-parasite": "Astral parasites",
    "luck": "Luck, chance and marginal decisions",
    "fame": "Fame and reputation",
    "home": "The home and the space it is",
}

DATE_PATTERNS = [
    r'<time[^>]*datetime="([^"]+)"',
    r'<meta[^>]+property="article:published_time"[^>]+content="([^"]+)"',
    r'<meta[^>]+name="date"[^>]+content="([^"]+)"',
    r'class="date"[^>]*>([^<]+)<',
]


def esc(s):
    return (s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
             .replace('"', "&quot;"))


def load():
    with open(GRAPH, "r", encoding="utf-8") as f:
        graph = json.load(f)
    LEGACY_CATEGORY.clear()
    if os.path.exists(LEGACY_CAT_FILE):
        with open(LEGACY_CAT_FILE, "r", encoding="utf-8") as f:
            LEGACY_CATEGORY.update(json.load(f))
    return graph


def article_date(slug):
    """Fecha visible del artículo, o None. Se lee del HTML porque el grafo
    no la guarda; se aceptan varios patrones porque los 815 archivos no
    comparten plantilla."""
    path = os.path.join(BLOG, slug + ".html")
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8", errors="replace") as f:
            html = f.read(60000)
    except OSError:
        return None
    for pat in DATE_PATTERNS:
        m = re.search(pat, html, re.I)
        if m:
            val = re.sub(r"\s+", " ", m.group(1)).strip()
            if 4 <= len(val) <= 40:
                return val
    return None


def month_key(date_str):
    """Ordena por fecha sin depender del formato: usa el año y el mes si
    aparecen como números, y si no cae al final en orden alfabético estable."""
    m = re.search(r"(20\d{2})[-/ ]?(\d{1,2})?", date_str or "")
    if not m:
        return (0, 0, date_str or "")
    month = int(m.group(2) or 0)
    return (int(m.group(1)), month, "")


def label_for(domain):
    if domain in DOMAIN_LABEL:
        return DOMAIN_LABEL[domain]
    return domain.replace("-", " ").replace("_", " ").capitalize()


def build_block(graph):
    # articles es una LISTA de fichas, no un diccionario indexado por slug
    articles = graph["articles"]
    groups = defaultdict(list)
    for a in articles:
        if not os.path.exists(os.path.join(BLOG, a["slug"] + ".html")):
            continue
        groups[a.get("domain") or "chaos-basics"].append(a)

    ordered = sorted(
        groups.items(),
        key=lambda kv: (-len(kv[1]), label_for(kv[0])),
    )

    out = [MARK_START]
    out.append('<nav class="hub-jump" aria-label="Browse by topic">')
    for domain, items in ordered:
        anchor = "topic-" + re.sub(r"[^a-z0-9]+", "-", domain).strip("-")
        out.append(
            '<a class="hub-jump-link" href="#%s">%s <span class="hub-count">%d</span></a>'
            % (anchor, esc(label_for(domain)), len(items))
        )
    out.append("</nav>")

    for domain, items in ordered:
        anchor = "topic-" + re.sub(r"[^a-z0-9]+", "-", domain).strip("-")
        items.sort(key=lambda a: (month_key(article_date(a["slug"])), a["title"]),
                   reverse=True)
        out.append('<section class="hub-group">')
        out.append(
            '<h2 id="%s" class="hub-h2">%s <span class="hub-n">%d</span></h2>'
            % (anchor, esc(label_for(domain)), len(items))
        )
        out.append('<div class="posts">')
        for a in items:
            # Los 349 de YouTube traen su categoria de specs.json. Los 466
            # legacy llegan con category=null en el grafo, y su categoria si
            # existia: estava puesta a mano en el indice anterior. Sin este
            # rescate caerian todos en `advanced` y once de los doce botones
            # del filtro se quedarian vacios. Ver extract_legacy_categories.py
            cat = a.get("category") or LEGACY_CATEGORY.get(a["slug"]) or "advanced"
            if cat not in CATEGORY_ORDER:
                cat = "advanced"
            date = article_date(a["slug"])
            title = a.get("title") or a["slug"]
            desc = re.sub(r"\s+", " ", a.get("description") or "").strip()
            if len(desc) > 190:
                desc = desc[:187].rsplit(" ", 1)[0] + "..."
            out.append(
                '<div class="post-card" data-category="%s">\r\n'
                '%s'
                '<h3><a href="%s.html">%s</a></h3>\r\n'
                '<div class="excerpt">%s</div>\r\n'
                '<a class="read-more" href="%s.html">Read More →</a>\r\n'
                '</div>'
                % (
                    cat,
                    ('<div class="date">%s</div>\r\n' % esc(date)) if date else "",
                    a["slug"], esc(title), esc(desc), a["slug"],
                )
            )
        out.append("</div>")
        out.append("</section>")
    out.append(MARK_END)
    return "\r\n".join(out), ordered


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    check = "--check" in sys.argv
    if not os.path.exists(INDEX):
        print("falta %s" % INDEX)
        return 1

    graph = load()
    block, ordered = build_block(graph)
    n_cards = block.count('class="post-card"')
    n_articles = len(graph["articles"])
    print("dominios: %d | tarjetas: %d | articulos en el grafo: %d"
          % (len(ordered), n_cards, n_articles))
    if n_cards != n_articles:
        print("FALLO: %d tarjetas para %d articulos" % (n_cards, n_articles))
        return 1

    with open(INDEX, "r", encoding="utf-8", newline="") as f:
        html = f.read()

    if MARK_START in html and MARK_END in html:
        pattern = re.compile(
            re.escape(MARK_START) + ".*?" + re.escape(MARK_END), re.S)
        new = pattern.sub(lambda _m: block, html, count=1)
        mode = "reemplazo"
    else:
        # El indice viejo era un unico <div class="posts"> con las 539
        # tarjetas, seguido del script del filtro. Se borra ese bloque
        # entero y se pone el nuevo en su lugar; el script del filtro se
        # conserva porque las tarjetas nuevas siguen llevando data-category.
        script = re.search(
            r"<script>\s*function\s+filterCategory[\s\S]*?</script>", html)
        if not script:
            print("FALLO: no encuentro el script filterCategory")
            return 1
        outer = html.find('<div class="posts">')
        if outer < 0 or outer > script.start():
            print("FALLO: no encuentro el <div class=\"posts\"> del indice viejo")
            return 1
        new = html[:outer] + block + "\r\n\r\n" + html[script.start():]
        mode = "insercion"

    # comprobaciones de cierre
    problems = []
    for tag in ("html", "head", "body", "main", "section", "div", "a", "h2", "h3"):
        o = len(re.findall(r"<%s[\s>]" % tag, new))
        c = len(re.findall(r"</%s>" % tag, new))
        if o != c:
            problems.append("%s %d/%d" % (tag, o, c))
    if "\ufffd" in new:
        problems.append("contiene U+FFFD")
    if not new.rstrip().endswith("</html>"):
        problems.append("no termina en </html>")
    # cero articulos duplicados y cero enlaces al propio indice
    slugs = re.findall(r'<h3><a href="([a-z0-9][a-z0-9\-]*)\.html">', new)
    if len(slugs) != len(set(slugs)):
        problems.append("tarjetas duplicadas")
    for s in set(slugs):
        if not os.path.exists(os.path.join(BLOG, s + ".html")):
            problems.append("slug muerto: %s" % s)
            break
    if problems:
        print("FALLO: " + "; ".join(problems))
        return 1

    # el filtro por categoria depende de que ningun boton se quede vacio
    used = set(re.findall(r'class="post-card" data-category="([^"]*)"', new))
    empty = [c for c in CATEGORY_ORDER if c not in used]
    unknown = sorted(used - set(CATEGORY_ORDER) - {"all"})
    if empty:
        problems.append("botones de categoria sin tarjetas: " + ", ".join(empty))
    if unknown:
        problems.append("categorias sin boton: " + ", ".join(unknown))
    if problems:
        print("FALLO: " + "; ".join(problems))
        return 1

    if new == html:
        print("sin cambios (%s)" % mode)
        return 0
    if check:
        print("check OK (%s, %d tarjetas)" % (mode, n_cards))
        return 0
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(new)
    print("escrito blog/index.html (%s, %d tarjetas, %d bytes)"
          % (mode, n_cards, len(new)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
