#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Puerta de verificacion del grafo de enlaces interno.

Comprueba, sobre el arbol ya renderizado, lo que el encargo pedia:

  1. cada articulo del blog tiene al menos MIN_CROSSREF cruces a otros
     articulos del blog, y esos cruces son UNICOS (repetir un enlace no es
     una referencia);
  2. cada pagina de app tiene al menos MIN_APP enlaces al blog EN EL TEXTO
     (dentro del bloque de sabiduria, excluyendo el indice plegable);
  3. ningun pagina se enlaza a si misma y los marcadores de inyeccion
     aparecen exactamente una vez;
  4. el trabajo de este arbol no introduce deuda nueva.

El punto 4 es el que importa de verdad. El corpus tenia antes de empezar:
cierres de etiqueta huerfanos, <h1> que decia el nombre del sitio, y enlaces
a ../books/*.html y ../tools/*.html que no existen en disco. Nada de eso lo
introdujo este trabajo, asi que la puerta lo MIDE y lo separa en vez de
bloquear por ello. La deuda se calcula sobre el mismo archivo tal y como
esta en HEAD, y solo se considera fallo lo que aparece ahora y no estaba
antes. Para comparar hay que leer HEAD en bytes: la redireccion de
PowerShell escribe UTF-16 y rompe la lectura.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(REPO, "blog")
APPS = os.path.join(REPO, "apps")
GRAPH = os.path.join(REPO, "data", "link-graph.json")

MIN_CROSSREF = 30
MIN_APP = 30

MARK_START = "<!-- linkgraph:refs:start -->"
MARK_END = "<!-- linkgraph:refs:end -->"
W_START = "<!-- linkgraph:wisdom:start -->"
W_END = "<!-- linkgraph:wisdom:end -->"
C_START = "<!-- linkgraph:cta:start -->"
C_END = "<!-- linkgraph:cta:end -->"

# The contextual CTA is checked separately from the cross-reference block
# because it answers a different question. Crossrefs ask "is the reader given
# somewhere to go next"; the CTA asks "can this reader buy anything from this
# page", and the audit of 2026-10-01 measured that 715 of 815 articles could
# not answer that second question at all.
CTA_HREF_RE = re.compile(
    r'<a[^>]+class="cta-button primary"[^>]+href="(https://[^"]+)"', re.I)
CTA_COUNT_RE = re.compile(r'<a[^>]+class="cta-button primary"', re.I)
CTA_SECONDARY_RE = re.compile(r'<a[^>]+class="cta-secondary"[^>]+href="([^"]+)"', re.I)
CHECKOUT_HOSTS = ("play.google.com", "pay.hotmart.com", "hotmart.com")
VALID_CATALOG_URLS = None

VOID = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}

HREF_RE = re.compile(r'href="([^"]+)"')
CROSSREF_LI_RE = re.compile(r'<li>\s*<a href="\.\./blog/([^"#?]+)\.html"', re.I)
BLOG_HREF_RE = re.compile(r'href="(?:\.\./)?blog/([^"#?]+)\.html"', re.I)
SELF_NAME_RE = re.compile(r"<h1[^>]*>\s*Cha0smagick Labs\b", re.I)


def head_text(rel: str) -> str:
    """El archivo tal y como esta en HEAD, o cadena vacia si no estaba."""
    try:
        out = subprocess.run(
            ["git", "show", "HEAD:" + rel.replace("\\", "/")],
            cwd=REPO, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
        )
    except OSError:
        return ""
    if out.returncode != 0:
        return ""
    return out.stdout.decode("utf-8", "replace")


def slice_between(html: str, start: str, end: str) -> str | None:
    i = html.find(start)
    if i < 0:
        return None
    j = html.find(end, i)
    if j < 0:
        return None
    return html[i:j + len(end)]


def balance(html: str) -> list[str]:
    """Etiquetas estructurales sin cerrar. Ignora comentarios, script/style."""
    body = re.sub(r"(?is)<!--.*?-->", " ", html)
    body = re.sub(r"(?is)<(script|style|textarea)\b.*?</\1>", " ", body)
    out: list[str] = []
    for m in re.finditer(r"<\s*(/?)\s*([a-zA-Z][a-zA-Z0-9]*)\b[^>]*?(/?)\s*>", body):
        closing, name, selfclose = m.group(1), m.group(2).lower(), m.group(3)
        if name in VOID or selfclose:
            continue
        if not closing:
            out.append(name)
        elif out and out[-1] == name:
            out.pop()
        else:
            out.append("!" + name)
    return out


def internal_hrefs(html: str) -> list[str]:
    found = []
    for href in HREF_RE.findall(html):
        href = href.strip()
        if not href or href.startswith(("http://", "https://", "mailto:",
                                        "tel:", "javascript:", "#", "data:")):
            continue
        if ".html" not in href:
            continue
        path = href.split("#")[0].split("?")[0]
        if path:
            found.append(path)
    return found


def debt(html: str, base: str) -> set[str]:
    """Deuda estructural heredable: no la introduce este trabajo."""
    d: set[str] = set()
    unbal = balance(html)
    if unbal:
        d.add("tags: " + ",".join(sorted(unbal)))
    if "�" in html:
        d.add("u+fffd")
    if not html.rstrip().endswith("</html>"):
        d.add("no-cierra-html")
    for href in internal_hrefs(html):
        if not os.path.isfile(os.path.normpath(os.path.join(base, href))):
            d.add("href-roto: " + href)
    return d


def check_article(path, rel, failures, legacy):
    with open(path, "r", encoding="utf-8", newline="") as fh:
        html = fh.read()
    slug = os.path.splitext(os.path.basename(path))[0]
    st = {"slug": slug, "crossref": 0, "markers": html.count(MARK_START)}

    base = os.path.dirname(path)
    now = debt(html, base)
    was = debt(head_text(rel), base)
    new = now - was
    if new:
        failures.append(f"{rel}: deuda nueva {sorted(new)[:5]}")
    legacy.append((rel, len(now), len(new)))

    if st["markers"] > 1:
        failures.append(f"{rel}: {st['markers']} marcadores de refs (debe ser 1)")

    block = slice_between(html, MARK_START, MARK_END)
    if block is None:
        m = re.search(r'(?is)<section class="crossrefs".*?</section>', html)
        block = m.group(0) if m else None
    if block is None:
        failures.append(f"{rel}: sin bloque de cruces")
        return st
    targets = CROSSREF_LI_RE.findall(block)
    uniq = set(targets)
    st["crossref"] = len(uniq)
    if len(targets) != len(uniq):
        failures.append(f"{rel}: cruces repetidos dentro del bloque")
    if st["crossref"] < MIN_CROSSREF:
        failures.append(f"{rel}: solo {st['crossref']} cruces unicos (min {MIN_CROSSREF})")
    if slug in uniq:
        failures.append(f"{rel}: se enlaza a si mismo")
    for t in uniq:
        if not os.path.isfile(os.path.join(BLOG, t + ".html")):
            failures.append(f"{rel}: destino inexistente blog/{t}.html")

    check_cta(path, rel, html, slug, failures, st)
    return st


def catalog_urls():
    """Checkout URLs published in catalog.json, as a set for prefix matching.

    A URL that is not in the catalogue is a fail, not a warning: these are the
    only endpoints verified against the real store, and inventing one is the
    exact failure the two blocked landing pages already have.
    """
    global VALID_CATALOG_URLS
    if VALID_CATALOG_URLS is not None:
        return VALID_CATALOG_URLS
    import json
    path = os.path.join(REPO, "projects", "data", "yt-articles", "catalog.json")
    with open(path, encoding="utf-8") as fh:
        cat = json.load(fh)
    out = set()
    for item in cat.get("apps", []) + cat.get("books", []):
        if item.get("url"):
            out.add(item["url"].split("?")[0])
    # the library bundle lives outside catalog.json; it is recorded in cta.py
    sys.path.insert(0, HERE)
    try:
        import cta
        out.add(cta.BUNDLE["url"].split("?")[0])
    except Exception:
        pass
    VALID_CATALOG_URLS = out
    return out


def check_cta(path, rel, html, slug, failures, st):
    """One purchasable CTA per article, pointing at a real checkout."""
    st["cta"] = 0
    cta_marks = html.count(C_START)
    if cta_marks != 1 or html.count(C_END) != 1:
        failures.append(f"{rel}: {cta_marks} marcadores de CTA (debe ser 1 par)")
        return

    block = slice_between(html, C_START, C_END)
    if block is None:
        m = re.search(r'(?is)<section class="cta-contextual".*?</section>', html)
        block = m.group(0) if m else None
    if block is None:
        failures.append(f"{rel}: sin bloque de CTA")
        return

    buttons = CTA_COUNT_RE.findall(block)
    hrefs = CTA_HREF_RE.findall(block)
    if len(buttons) != 1:
        failures.append(f"{rel}: {len(buttons)} botones primarios de CTA (debe ser 1)")
    if len(hrefs) != 1:
        failures.append(f"{rel}: {len(hrefs)} hrefs de checkout (debe ser 1)")
        return
    url = hrefs[0]
    st["cta"] = 1

    if not any(h in url for h in CHECKOUT_HOSTS):
        failures.append(f"{rel}: el CTA no va a un checkout: {url[:80]}")
    if not any(url.startswith(c) for c in catalog_urls()):
        failures.append(f"{rel}: checkout fuera de catalog.json: {url[:80]}")
    if "utm_content=" not in url:
        failures.append(f"{rel}: el checkout no lleva utm_content (no se puede atribuir)")
    elif "utm_content=%s" % slug not in url:
        failures.append(f"{rel}: utm_content no corresponde al slug")
    if 'rel="noopener nofollow"' not in block:
        failures.append(f"{rel}: el CTA sale sin rel=noopener nofollow")

    # the secondary links must resolve on disk
    for href in CTA_SECONDARY_RE.findall(block):
        if href.startswith("http"):
            continue
        target = os.path.normpath(os.path.join(os.path.dirname(path), href))
        if not os.path.isfile(target):
            failures.append(f"{rel}: enlace secundario roto {href}")
    return st


def check_app(path, rel, failures, legacy):
    with open(path, "r", encoding="utf-8", newline="") as fh:
        html = fh.read()
    slug = os.path.splitext(os.path.basename(path))[0]
    st = {"slug": slug, "in_text": 0, "markers": html.count(W_START)}

    base = os.path.dirname(path)
    now = debt(html, base)
    was = debt(head_text(rel), base)
    new = now - was
    if new:
        failures.append(f"{rel}: deuda nueva {sorted(new)[:5]}")
    legacy.append((rel, len(now), len(new)))

    if SELF_NAME_RE.search(html):
        failures.append(f"{rel}: el h1 sigue diciendo el nombre del sitio")
    if st["markers"] > 1:
        failures.append(f"{rel}: {st['markers']} marcadores de wisdom (debe ser 1)")

    block = slice_between(html, W_START, W_END)
    if block is None:
        failures.append(f"{rel}: sin bloque de sabiduria")
        return st
    if "<details" in block:
        block = block[:block.index("<details")]
    uniq = set(BLOG_HREF_RE.findall(block))
    st["in_text"] = len(uniq)
    if st["in_text"] < MIN_APP:
        failures.append(f"{rel}: solo {st['in_text']} enlaces al blog en el texto (min {MIN_APP})")
    if slug in uniq:
        failures.append(f"{rel}: se enlaza a si misma")
    for t in uniq:
        if not os.path.isfile(os.path.join(BLOG, t + ".html")):
            failures.append(f"{rel}: destino inexistente blog/{t}.html")
    return st


def main(argv):
    only = [a for a in argv[1:] if not a.startswith("-")]
    with open(GRAPH, "r", encoding="utf-8") as fh:
        json.load(fh)  # el grafo tiene que estar legible antes de mirar el arbol
    failures: list[str] = []
    legacy: list[tuple] = []
    arts: list[dict] = []
    apps: list[dict] = []

    for name in sorted(f for f in os.listdir(BLOG) if f.endswith(".html")):
        if name == "index.html":
            continue
        if only and os.path.splitext(name)[0] not in only:
            continue
        arts.append(check_article(os.path.join(BLOG, name), "blog/" + name, failures, legacy))
    for name in sorted(f for f in os.listdir(APPS) if f.endswith(".html")):
        if only and os.path.splitext(name)[0] not in only:
            continue
        apps.append(check_app(os.path.join(APPS, name), "apps/" + name, failures, legacy))

    cr = [a["crossref"] for a in arts]
    it = [a["in_text"] for a in apps]
    cta = [a.get("cta", 0) for a in arts]
    tot = sum(cr) + sum(it)
    print(f"articulos verificados : {len(arts)}")
    print(f"  cruces unicos       : min {min(cr) if cr else 0} "
          f"media {sum(cr)/len(cr):.1f} max {max(cr) if cr else 0}")
    print(f"  CTA de compra       : {sum(cta)} de {len(arts)} articulos "
          f"({100.0*sum(cta)/len(arts) if arts else 0:.1f}%)")
    print(f"apps verificadas      : {len(apps)}")
    print(f"  enlaces en el texto : min {min(it) if it else 0} "
          f"media {sum(it)/len(it):.1f} max {max(it) if it else 0}")
    print(f"TOTAL de referencias cruzadas: {tot}")
    print(f"deuda pre-existente: {sum(d[1] for d in legacy)} hallazgos | "
          f"{sum(d[2] for d in legacy)} introducidos ahora")

    if failures:
        print(f"\nFALLA ({len(failures)}):")
        for p in failures[:80]:
            print("  -", p)
        if len(failures) > 80:
            print(f"  ... y {len(failures) - 80} mas")
        return 1
    print("\nALL GREEN")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
