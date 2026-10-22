#!/usr/bin/env python3
"""
Enriquece los articulos con las señales de E-E-A-T que faltaban.

Que hace, en cada articulo de /blog:
  1. schema author -> Person con @id, url a la pagina de autor, jobTitle y
     sameAs (las cuentas reales). Antes: 470 de 834 no tenian url, y 145
     apuntaban a la home.
  2. schema publisher -> Organization con @id, url y logo. La entidad
     completa (direccion, contacto, foundingDate) queda definida una sola vez
     en la home, la pagina de autor y la politica editorial.
  3. byline visible -> "By Frater Alek0s" pasa a ser un enlace a la pagina
     de autor con rel="author".
  4. fecha visible coherente con el schema: si el <time datetime> no cuadraba
     con datePublished, se corrige.
  5. "Updated <fecha>" visible solo donde dateModified > datePublished (ahi si
     hay una revision real; no se inventa una en el resto).

Es idempotente: se puede volver a ejecutar sin cambiar nada mas.

  python projects/scripts/enrich-author-eeat.py
"""
import json
import re
from pathlib import Path

ROOT = Path(".")
SITE = "https://cha0smagicklabs.com"
AUTOR_URL = f"{SITE}/pages/frater-alek0s.html"
PERSON_ID = f"{AUTOR_URL}#person"
ORG_ID = f"{SITE}/#organization"

MESES = {
    "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
    "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12,
}

PERSON = {
    "@type": "Person",
    "@id": PERSON_ID,
    "name": "Frater Alek0s",
    "url": AUTOR_URL,
    "jobTitle": "Founder",
    "sameAs": [
        "https://x.com/Cha0smagickLABS",
        "https://www.instagram.com/cha0smagick.labs/",
        "https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA",
        "https://t.me/cha0smagicklabs",
    ],
}
PUBLISHER = {
    "@type": "Organization",
    "@id": ORG_ID,
    "name": "Cha0smagick Labs",
    "url": SITE,
    "logo": {"@type": "ImageObject", "url": f"{SITE}/assets/images/Banner.png"},
}


def emparejar_llaves(txt, inicio):
    """Devuelve (fin_indice_exclusive, texto_interno) del objeto que empieza en 'inicio'."""
    i = txt.index("{", inicio)
    nivel = 0
    en_cadena = False
    escape = False
    for j in range(i, len(txt)):
        c = txt[j]
        if en_cadena:
            if escape:
                escape = False
            elif c == "\\":
                escape = True
            elif c == '"':
                en_cadena = False
            continue
        if c == '"':
            en_cadena = True
        elif c == "{":
            nivel += 1
        elif c == "}":
            nivel -= 1
            if nivel == 0:
                return j + 1, txt[i + 1:j]
    return None, None


def reemplazar_campo(bloque, campo, valor_json):
    """Sustituye "campo": { ... } por "campo": <valor_json> dentro de un bloque."""
    m = re.search(r'"' + campo + r'"\s*:\s*', bloque)
    if not m:
        return bloque
    fin, _ = emparejar_llaves(bloque, m.end())
    if fin is None:
        return bloque
    return bloque[:m.start()] + f'"{campo}": {valor_json}' + bloque[fin:]


def fecha_legible(iso):
    y, m, d = iso.split("-")
    mes = [v for k, v in MESES.items() if v == int(m)][0]
    return f"{mes} {int(d)}, {y}"


def main():
    n = {"procesados": 0, "autor": 0, "publisher": 0, "byline": 0, "fecha": 0, "updated": 0, "time": 0}
    for p in sorted((ROOT / "blog").glob("*.html")):
        src = p.read_text(encoding="utf-8", errors="ignore")
        original = src

        # ---------- 1. JSON-LD ----------
        bloques = list(re.finditer(r'(?s)<script[^>]+application/ld\+json[^>]*>(.*?)</script>', src))
        art = None
        for m in bloques:
            try:
                j = json.loads(m.group(1))
            except Exception:
                continue
            if j.get("@type") in ("Article", "BlogPosting"):
                art = (m, j)
                break
        if art is None:
            continue
        m, j = art
        bloque = m.group(1)
        nuevo = bloque
        if json.dumps(j.get("author"), sort_keys=True) != json.dumps(PERSON, sort_keys=True):
            nuevo = reemplazar_campo(nuevo, "author", json.dumps(PERSON, ensure_ascii=False))
            n["autor"] += 1
        if json.dumps(j.get("publisher"), sort_keys=True) != json.dumps(PUBLISHER, sort_keys=True):
            nuevo = reemplazar_campo(nuevo, "publisher", json.dumps(PUBLISHER, ensure_ascii=False))
            n["publisher"] += 1
        if nuevo != bloque:
            src = src[:m.start(1)] + nuevo + src[m.end(1):]

        # ---------- 2. byline visible ----------
        pub = j.get("datePublished", "")[:10]
        mod = j.get("dateModified", "")[:10]
        # 2a. el nombre del autor pasa a ser enlace
        if re.search(r"By Frater Alek0s(?!\s*<)", src) and f'href="{AUTOR_URL}"' not in src:
            src = src.replace(
                "By Frater Alek0s",
                f'By <a href="{AUTOR_URL}" rel="author">Frater Alek0s</a>',
            )
            n["byline"] += 1
        # 2b. fecha visible coherente con el schema
        if pub:
            mt = re.search(r'(<time[^>]*datetime=")(\d{4}-\d{2}-\d{2})("[^>]*>)([^<]{0,40})', src)
            if mt and mt.group(2) != pub:
                vis = re.sub(r"[A-Za-z]+ \d{1,2}, \d{4}", fecha_legible(pub), mt.group(4))
                src = src[:mt.start()] + mt.group(1) + pub + mt.group(3) + vis + src[mt.end():]
                n["fecha"] += 1
            elif not mt and pub in src and re.search(r'class="(?:meta|blog-meta|post-meta)"', src):
                pass
        # 2c. "Updated" solo si hay una revision real
        if pub and mod and mod > pub and f'datetime="{mod}"' not in src:
            mt = re.search(r'(<time[^>]*datetime="' + re.escape(pub) + r'"[^>]*>[^<]{0,40}</time>)', src)
            if mt:
                src = src.replace(
                    mt.group(1),
                    mt.group(1) + f' | Updated <time datetime="{mod}">{fecha_legible(mod)}</time>',
                    1,
                )
                n["updated"] += 1

        if src != original:
            p.write_text(src, encoding="utf-8")
            n["procesados"] += 1

    print("=== enriquecimiento E-E-A-T de los articulos ===")
    for k, v in n.items():
        print(f"   {k:12} {v}")


if __name__ == "__main__":
    main()
