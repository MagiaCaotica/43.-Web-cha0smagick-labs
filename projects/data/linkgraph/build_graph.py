#!/usr/bin/env python3
"""build_graph.py -- Construye el grafo de enlazado interno del sitio.

Fuente unica de verdad para:
  * las 12 paginas de apps      -> data/link-graph.json  (apps[])
  * los 816 articulos de blog/  -> data/link-graph.json  (articles[])

De donde sale la senal:
  * Los 349 articulos de yt-articles tienen taxonomia autoritativa en
    specs.json (domain, cluster, blog_category, risk, products, tools, keywords).
  * Los ~467 legacy NO tienen JSON, pero todos (813/814) traen
    <meta name="keywords"> y una docena de <h2>. Se clasifican por
    centroide TF contra los 43 dominios que ya existen en specs.json, de modo
    que el vocabulario del grafo no se inventa: se hereda de los que si lo
    tienen.

Seleccion de destinos (determinista y auditable):
    mismo dominio ............ +40
    mismo cluster ............ +25
    solapamiento Jaccard ..... +30 * jaccard(tokens)
    comparte app/producto .... +10
    misma risk-discipline .... +5
    misma blog_category ...... +5
    ya estaba en su "Related"  +3   (y se fija antes de rellenar)
  Empuje por diversidad: maximo 6 destinos por dominio, para que los 30 de un
  articulo formen una red y no una camarilla. El tope se relaja en cascada
  (6 -> 8 -> 12 -> sin tope) si hace falta para llegar a 30.

Uso:
    python build_graph.py [--min-targets 30] [--out ../../../data/link-graph.json]
"""

from __future__ import annotations

import argparse
import html
import json
import math
import os
import re
import sys
from collections import Counter, defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
APPS = os.path.join(REPO, "apps")
SPECS = os.path.join(REPO, "projects", "data", "yt-articles", "specs.json")

SITE_SUFFIX = re.compile(r"\s*\|\s*Cha0smagick Labs\s*$", re.I)
BAD_TITLES = {
    "cha0smagick labs",
    "cha0smagick labs - home",
    "home",
    "blog",
    "cha0smagick labs blog",
}

STOP = set(
    """
a an and are as at be but by can for from had has have how in into is it its
of on or that the their them then there these they this to was were what when
where which who will with you your our not no do does did so such than too
very just also more most other some any each few most own same only just
about over under again further once here there both all
""".split()
)

WORD = re.compile(r"[a-z0-9']+")
H2_RE = re.compile(r"<h2\b[^>]*>(.*?)</h2>", re.I | re.S)
H1_RE = re.compile(r"<h1\b[^>]*>(.*?)</h1>", re.I | re.S)
TITLE_RE = re.compile(r"<title\b[^>]*>(.*?)</title>", re.I | re.S)
META_KW_RE = re.compile(
    r"<meta\s+name=[\"']keywords[\"']\s+content=[\"'](.*?)[\"']", re.I | re.S
)
META_KW_RE2 = re.compile(
    r"<meta\s+content=[\"'](.*?)[\"']\s+name=[\"']keywords[\"']", re.I | re.S
)
HREF_RE = re.compile(r"href=[\"']([^\"']+)[\"']", re.I)
TAG_RE = re.compile(r"<[^>]+>")


def strip_tags(fragment: str) -> str:
    return html.unescape(TAG_RE.sub(" ", fragment)).strip()


def clean_text(fragment: str) -> str:
    return re.sub(r"\s+", " ", strip_tags(fragment)).strip()


def tokens(text: str) -> list[str]:
    return [w for w in WORD.findall(text.lower()) if len(w) > 2 and w not in STOP]


def read(path: str) -> str:
    with open(path, "r", encoding="utf-8") as fh:
        return fh.read()


# ---------------------------------------------------------------- apps
# Curaduria explicita: que tema de articulos le corresponde a cada app.
# Es deliberado -- son 12 entradas y el desajuste se nota en la pagina.
APP_THEME = {
    "astral-lab": {
        "domains": {"lunar", "time", "divination", "comparative", "psychonaut"},
        "keywords": {
            "natal", "chart", "astrology", "astrological", "zodiac", "birth",
            "horoscope", "planet", "house", "ascendant", "transit", "ephemeris",
            "sign", "retrograde", "conjunction", "astrologer",
        },
    },
    "lunar-phase-calculator": {
        "domains": {"lunar", "time", "astral-dreams"},
        "keywords": {
            "moon", "lunar", "phase", "new moon", "full moon", "waxing",
            "waning", "lunation", "eclipse", "tide", "month",
        },
    },
    "iching-oracle": {
        "domains": {"iching", "divination", "philosophy"},
        "keywords": {
            "iching", "i ching", "hexagram", "yijing", "yin", "yang", "trigram",
            "changing", "line", "consultation", "book of changes",
        },
    },
    "norse-rune-oracle": {
        "domains": {"runes", "divination", "mythology-ancient"},
        "keywords": {
            "rune", "runes", "futhark", "elder", "runic", "bindrune", "norse",
            "germanic", "gothic", "letterform",
        },
    },
    "unofficial-rider-waite-tarot": {
        "domains": {"tarot", "divination", "clarity"},
        "keywords": {
            "tarot", "card", "cards", "arcana", "major", "minor", "deck",
            "spread", "waite", "rider", "suit", "querent",
        },
    },
    "lucid-dream": {
        "domains": {"astral-dreams"},
        "keywords": {
            "lucid", "dream", "dreams", "rem", "recall", "sleep", "waking",
            "check", "reality check", "hypnagogia", "morning",
        },
    },
    "dream-machine": {
        "domains": {"astral-dreams", "psychonaut", "mind-science"},
        "keywords": {
            "dream", "dreams", "hypnagogia", "lucid", "projection", "astral",
            "sleep", "vigil", "imagery", "ritual", "trance",
        },
    },
    "psi-gym": {
        "domains": {"mind-science", "reality-hacking", "psychonaut"},
        "keywords": {
            "psi", "esp", "telepathy", "training", "psi-gym", "signal",
            "intuition", "sensitivity", "debunking", "zener", "hypothesis",
        },
    },
    "chaos-sigil-generator": {
        "domains": {"sigils", "chaos-basics"},
        "keywords": {
            "sigil", "sigils", "glyph", "letter", "reduction", "encoding",
            "spare", "charge", "statement", "imperative", "design",
        },
    },
    "arcana-goetia": {
        "domains": {"entity-lore", "goetia-demons"},
        "keywords": {
            "goetia", "goetic", "spirit", "spirits", "entity", "entities",
            "office", "rank", "duke", "king", "president", "family",
            "invocation", "evocation", "72",
        },
    },
    "eerieroads": {
        "domains": {"entity-lore", "servitor-craft", "protection"},
        "keywords": {
            "servitor", "servants", "eerie", "thoughtform", "task", "feeding",
            "dismissal", "egress", "tulpa", "artificial servant", "egregore",
        },
    },
    "noctem-tools": {
        "domains": {"servitor-craft", "ritual-craft", "entity-lore", "protection"},
        "keywords": {
            "ritual", "tools", "correspondence", "incense", "candle", "altar",
            "materials", "banishing", "lbr", "cleansing", "timing", "planetary",
        },
    },
}


# ------------------------------------------------------------- scraping
def scrape_article(path: str) -> dict:
    """Extrae de un HTML de blog/ lo que se puede usar como senal."""
    raw = read(path)
    name = os.path.basename(path)
    slug = name[:-5] if name.endswith(".html") else name

    t = TITLE_RE.search(raw)
    page_title = clean_text(t.group(1)) if t else ""
    page_title = SITE_SUFFIX.sub("", page_title).strip()

    h1s = [clean_text(m) for m in H1_RE.findall(raw)]
    h1s = [h for h in h1s if h]
    # El h1 de los legacy suele ser el nombre del sitio: no sirve de titulo.
    title = ""
    for cand in h1s:
        if cand.lower() not in BAD_TITLES and len(cand) > 6:
            title = cand
            break
    if not title:
        for cand in h1s:
            if cand.lower() not in BAD_TITLES:
                title = cand
                break
    if not title:
        title = page_title

    h2s = [clean_text(m) for m in H2_RE.findall(raw)]
    h2s = [h for h in h2s if h]

    kw_blob = ""
    m = META_KW_RE.search(raw) or META_KW_RE2.search(raw)
    if m:
        kw_blob = html.unescape(m.group(1))
    kws = [k.strip() for k in re.split(r"[,;|]", kw_blob) if k.strip()]

    related = []
    for href in HREF_RE.findall(raw):
        if "../blog/" in href:
            cand = href.split("../blog/")[-1]
            cand = cand.split("/")[-1]
            if cand.endswith(".html"):
                cand = cand[:-5]
            if cand and cand != slug and cand != "index":
                related.append(cand)

    return {
        "slug": slug,
        "family": "unknown",
        "title": title,
        "page_title": page_title,
        "h1s": h1s[:3],
        "h2s": h2s,
        "keywords": kws,
        "existing_related": sorted(set(related)),
        "bytes": len(raw),
        "has_main": "</main>" in raw.lower(),
    }


CONTENT = os.path.join(REPO, "projects", "data", "yt-articles", "content")


def load_specs() -> dict[str, dict]:
    """specs.json indexado POR N. Ojo: su campo `slug` esta obsoleto en 44
    casos (p.ej. n=68 dice `chaos-magic-fundamentals-...-9` pero el articulo
    real se publico como `magical-servants-for-beginners-...`). El slug de
    verdad vive en content/<n>.json, y el taxonomia (domain/cluster/risk/
    products) vive en specs.json. El join correcto es por `n`."""
    if not os.path.exists(SPECS):
        return {}
    data = json.loads(read(SPECS))
    if isinstance(data, dict):
        data = data.get("specs") or data.get("items") or list(data.values())
    out = {}
    for sp in data:
        if isinstance(sp, dict) and sp.get("n") is not None:
            out[str(sp["n"])] = sp
    return out


def load_content() -> dict[str, dict]:
    """content/<n>.json -> {n: record}. Fuente de verdad para slug, h1,
    seo_title, description, keywords y related."""
    out = {}
    if not os.path.isdir(CONTENT):
        return out
    for name in sorted(os.listdir(CONTENT)):
        if not re.fullmatch(r"\d+\.json", name):
            continue
        try:
            rec = json.loads(read(os.path.join(CONTENT, name)))
        except json.JSONDecodeError:
            print(f"  ! content/{name} no es JSON valido, se omite")
            continue
        if isinstance(rec, dict) and rec.get("slug"):
            out[name[:-5]] = rec
    return out


# ------------------------------------------------------- clasificacion
# Reglas por patron de slug, EN ORDEN: gana la primera que casa. Los ~466
# legacy no tienen JSON de origen, pero su slug es auto-descriptivo, y una
# regla por prefijo es auditable de un vistazo -- cosa que un clasificador
# estadistico no es. Solo si ninguna casa se recurre al centroide TF.
SLUG_RULES: list[tuple[str, str]] = [
    (r"^(tarot|rider-waite)", "tarot"),
    (r"(^|-)iching|i-ching|hexagram", "iching"),
    (r"rune|futhark|bindrune", "runes"),
    (r"goetia|goetic|arcana-goetia|72-spirits|72-demons", "goetia-demons"),
    (r"servitor|servant|b-mashina|bune-executor|eerieroads", "servitor-craft"),
    (r"entity|invocation-ritual-entity|theoretical", "entity-lore"),
    (r"lucid|awoken|(^|-)dream|dreams|sleep", "astral-dreams"),
    (r"astral", "astral-dreams"),
    (r"sigil", "sigils"),
    (r"gnosis|paradigm|reality-hacking|belief-as-a-tool", "reality-hacking"),
    (r"(^|-)psi|(^|-)esp|zener|remote-perception|clairvoyance|telepath"
     r"|mind-science|glamour-magick|fisica-cuantica|placebo|parapsych"
     r"|paranormal|psychic", "mind-science"),
    (r"pact-with-a-demon|money-pact|demonic-wealth-pact", "money-pact"),
    (r"money|wealth|abundance|millionaire|clauneck|manifesting|cash",
     "money"),
    (r"(^|-)love|attraction|ice-magic|karmic|cupid", "love"),
    (r"banish|banishing|protection|unhex|cleansing|astran|ward", "protection"),
    (r"prayer|cyprian|marta|saint|devotional", "prayer"),
    (r"creativ|applause|artist|writing|block", "creativity"),
    (r"technomancy|cyber|digital-|spellcasting", "technomancy"),
    (r"career|for-job|job-success|study|client", "career"),
    (r"hidden|forbidden|grimorio|grimoire|kybalion|liber-|enoch|occult-secrets"
     r"|book-of", "secret-knowledge"),
    (r"history|hermetic|golden-dawn|renaissance|chronolog|timeline|ars-",
     "history-occult"),
    (r"philosoph|paraconsist|nothing-is-true", "philosophy"),
    (r"comparing|comparative", "comparative"),
    (r"annunaki|atlantida|ancient|mytholog|sumerian|mesopotam|myth-|greek"
     r"|egypt|norse-myth", "mythology-ancient"),
    (r"incense|incenso|altar|correspondence|ritual-material|candle|ceremonial",
     "ritual-craft"),
    (r"music|musical|binaural|sound|rhythm", "music-magick"),
    (r"moon|lunar|eclipse|phases-explained", "lunar"),
    (r"(^|-)luck|serendipity|chance", "luck"),
    (r"language|speech|eloquence", "language-speech"),
    (r"(^|-)beauty|skin|miracle", "beauty"),
    (r"feng|(^|-)home", "home"),
    (r"fame|celebrity", "fame"),
    (r"lovecraft|cthulhu|eldritch|horror|cosmic|weird-cosmology", "horror-lore"),
    (r"psychonaut|altered-state|breathwork|kundalini|altered", "psychonaut"),
    (r"scam|debunk|skeptic|pseudoscience|myth", "scams-skepticism"),
    (r"parasite|energy-work|auras", "astral-parasites"),
    (r"time-magic|causality|(^|-)time-", "time"),
    (r"occult-culture|modern-practice|witchcraft|(^|-)wicca|folk-|left-hand",
     "occult-culture"),
    (r"clarity|(^|-)focus|decision", "clarity"),
    (r"vampir|lvpinux", "creatures-vampire"),
    (r"chakra|aura|reiki|healing", "health"),
    (r"chaos-magic-fundamentals|what-is-chaos-magic|(^|-)chaos-|practitioner",
     "chaos-basics"),
    (r"libro|book", "secret-knowledge"),
]
COMPILED_RULES = [(re.compile(p), d) for p, d in SLUG_RULES]


def rule_domain(slug: str, title: str) -> str | None:
    probe = f"{slug} {title or ''}".lower()
    for rx, dom in COMPILED_RULES:
        if rx.search(probe):
            return dom
    return None


def build_centroids(specs: dict[str, dict], arts: list[dict]) -> dict[str, Counter]:
    """Centroid de tokens por domain, construido SOLO con los ya clasificados
    por regla (o con los 349 que traen taxonomia de specs.json)."""
    acc: dict[str, Counter] = defaultdict(Counter)
    for a in arts:
        if not a.get("domain"):
            continue
        blob = " ".join(
            [a["title"] or "", " ".join(a["keywords"]), " ".join(a["h2s"][:8])]
        )
        for t in tokens(blob):
            acc[a["domain"]][t] += 1
    n = len(acc)
    for c in acc.values():
        for t in list(c):
            df = sum(1 for other in acc.values() if t in other)
            if df >= max(2, n * 0.6):
                del c[t]
    return dict(acc)


def classify(a: dict, cents: dict[str, Counter]) -> tuple[str, str]:
    """Regla de slug primero; centroide TF normalizado como red de seguridad.
    Se normaliza por |centroid| y por |tokens del articulo| para que un
    dominio grande no se lleve siempre la puntuacion."""
    hit = rule_domain(a["slug"], a.get("title", ""))
    if hit:
        return hit, "rule"
    blob = " ".join(
        [a["title"] or "", " ".join(a["keywords"]), " ".join(a["h2s"][:12])]
    )
    toks = set(tokens(blob))
    if not toks:
        return "chaos-basics", "fallback"
    best, best_score = "chaos-basics", 0.0
    for dom, c in cents.items():
        overlap = toks & set(c)
        if not overlap:
            continue
        score = sum(math.log(1 + c[t]) for t in overlap) / math.sqrt(
            len(c) * len(toks)
        )
        if score > best_score:
            best, best_score = dom, score
    if best_score <= 0.0:
        return "chaos-basics", "fallback"
    return best, "tf"


# --------------------------------------------------------- targets
def jaccard(a: set, b: set) -> float:
    if not a or not b:
        return 0.0
    inter = len(a & b)
    return inter / float(len(a | b))


def pick_targets(src: dict, pool: list[dict], index: dict, want: int) -> list[str]:
    src_tok = set(src["tokset"])
    src_prod = set(src.get("products") or [])
    scored = []
    for c in pool:
        if c["slug"] == src["slug"]:
            continue
        s = 0.0
        if c.get("domain") == src.get("domain"):
            s += 40
        if c.get("cluster") and c["cluster"] == src.get("cluster"):
            s += 25
        s += 30 * jaccard(src_tok, c["tokset"])
        if src_prod & set(c.get("products") or []):
            s += 10
        if c.get("risk") and c["risk"] == src.get("risk"):
            s += 5
        if c.get("category") and c["category"] == src.get("category"):
            s += 5
        if c["slug"] in src["existing_related"]:
            s += 3
        scored.append((s, c["slug"]))
    # desempate determinista: slug como clave secundaria
    scored.sort(key=lambda t: (-t[0], t[1]))

    # 1) se fijan primero los que ya estaban en su bloque Related
    chosen: list[str] = []
    chosen_set: set[str] = set()
    for sl in src["existing_related"]:
        if len(chosen) >= want:
            break
        if sl in index and sl not in chosen_set:
            chosen.append(sl)
            chosen_set.add(sl)

    # 2) se rellena por scoring, con tope de diversidad por dominio
    for cap in (6, 8, 12, 10**6):
        per_dom: Counter = Counter()
        for sl in chosen:
            per_dom[index[sl].get("domain")] += 1
        for _, sl in scored:
            if len(chosen) >= want:
                break
            if sl in chosen_set:
                continue
            dom = index[sl].get("domain")
            if per_dom[dom] >= cap:
                continue
            per_dom[dom] += 1
            chosen.append(sl)
            chosen_set.add(sl)
        if len(chosen) >= want:
            break
    return chosen


# ------------------------------------------------------------- main
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--min-targets", type=int, default=30)
    ap.add_argument("--max-per-domain", type=int, default=6)
    ap.add_argument(
        "--out", default=os.path.join(REPO, "data", "link-graph.json")
    )
    args = ap.parse_args()

    specs = load_specs()
    contents = load_content()
    names = sorted(f for f in os.listdir(BLOG) if f.endswith(".html"))
    names = [n for n in names if n != "index.html"]
    print(f"blog articles: {len(names)}   specs: {len(specs)}   content: {len(contents)}")

    # indice n -> record de content (solo los que de verdad estan publicados)
    by_n = {}
    for n, rec in contents.items():
        if rec["slug"] + ".html" in names:
            by_n[n] = rec
    print(f"contenido renderizado en blog/: {len(by_n)}")

    arts = [scrape_article(os.path.join(BLOG, n)) for n in names]
    slug2art = {a["slug"]: a for a in arts}
    for a in arts:
        a["domain"] = ""
        a["cluster"] = ""
        a["category"] = ""
        a["risk"] = ""
        a["products"] = []
        a["tools"] = []
        a["seo_title"] = a["title"]
        a["description"] = ""

    for n, rec in by_n.items():
        a = slug2art[rec["slug"]]
        sp = specs.get(n, {})
        a["family"] = "yt"
        a["n"] = n
        a["domain"] = sp.get("domain") or rule_domain(a["slug"], a["title"]) or "chaos-basics"
        a["cluster"] = sp.get("cluster") or ""
        a["category"] = sp.get("blog_category") or ""
        a["risk"] = sp.get("risk") or ""
        a["products"] = sp.get("products") or []
        a["tools"] = sp.get("tools") or []
        a["title"] = rec.get("h1") or a["title"]
        a["seo_title"] = rec.get("seo_title") or ""
        a["description"] = rec.get("description") or ""
        if rec.get("keywords"):
            a["keywords"] = rec["keywords"]

    # El clasificador necesita los dominios ya sembrados, asi que se construye
    # el corpus de centrpides con los yt y se aplica a los legacy en dos olas.
    cents = build_centroids(specs, arts)
    n_leg = 0
    for a in arts:
        if a["family"] == "yt":
            continue
        a["family"] = "legacy"
        dom, how = classify(a, cents)
        a["domain"] = dom
        a["classified_by"] = how
        n_leg += 1
    print(f"classified legacy: {n_leg}")
    by_dom = Counter(a["domain"] for a in arts if a["family"] == "legacy")
    print("legacy domains:", " ".join(f"{k}:{v}" for k, v in by_dom.most_common(16)))
    hows = Counter(a.get("classified_by", "spec") for a in arts)
    print("classified_by:", dict(hows))

    # titulo: si el h1 era el nombre del sitio o es un fragmento inutil, se
    # recompone desde el slug (solo para legacy; los yt usan su h1 de verdad).
    fixed = 0
    for a in arts:
        if a["family"] != "legacy":
            continue
        t = (a["title"] or "").strip()
        if len(t) < 8 or t.lower() in BAD_TITLES:
            a["title"] = " ".join(w.capitalize() for w in a["slug"].split("-"))
            a["title_derived"] = True
            fixed += 1
    print(f"titulos legacy derivados del slug: {fixed}")


    for a in arts:
        blob = " ".join(
            [a["title"] or "", " ".join(a["keywords"]), " ".join(a["h2s"])]
        )
        a["tokset"] = set(tokens(blob))

    index = {a["slug"]: a for a in arts}
    pool = arts
    want = max(args.min_targets, 30)
    for a in arts:
        a["targets"] = pick_targets(a, pool, index, want)

    counts = Counter(len(a["targets"]) for a in arts)
    print("target count histogram:", dict(sorted(counts.items())))

    # ---- apps
    app_rows = []
    for fname in sorted(f for f in os.listdir(APPS) if f.endswith(".html")):
        slug = fname[:-5]
        theme = APP_THEME.get(slug, {"domains": set(), "keywords": set()})
        doms, kws = theme["domains"], theme["keywords"]
        ranked = []
        for a in arts:
            if a["slug"] == "index":
                continue
            s = 0.0
            if a.get("domain") in doms:
                s += 40
            if slug in (a.get("products") or []):
                s += 35
            hit = len(set(tokens(" ".join(a["keywords"]) + " " + a["title"])) & kws)
            s += 6 * hit
            ranked.append((s, a["slug"]))
        ranked.sort(key=lambda t: (-t[0], t[1]))
        app_rows.append(
            {
                "slug": slug,
                "path": f"apps/{fname}",
                "domains": sorted(doms),
                "keywords": sorted(kws),
                "targets": [s for _, s in ranked[:36]],
            }
        )
        print(f"  app {slug:32s} -> {len(ranked)} candidates")

    doc = {
        "version": 1,
        "generated": os.environ.get("LINKGRAPH_DATE", "2026-10-01"),
        "min_targets": want,
        "max_per_domain": args.max_per_domain,
        "domains": sorted({a["domain"] for a in arts}),
        "apps": app_rows,
        "articles": [
            {
                "slug": a["slug"],
                "family": a["family"],
                "title": a["title"],
                "domain": a["domain"],
                "cluster": a["cluster"],
                "category": a["category"],
                "risk": a["risk"],
                "keywords": a["keywords"],
                "h2s": a["h2s"][:14],
                "products": a["products"],
                "tools": a["tools"],
                "description": a.get("description", ""),
                "existing_related": a["existing_related"],
                "title_derived": a.get("title_derived", False),
                "targets": a["targets"],
            }
            for a in arts
        ],
    }
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(doc, fh, ensure_ascii=False, indent=1)
    print(f"wrote {args.out}  ({os.path.getsize(args.out)} bytes)")
    print(f"articles={len(doc['articles'])} apps={len(doc['apps'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
