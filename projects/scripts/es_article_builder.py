#!/usr/bin/env python3
"""
Constructor de articulos en espanol, sobre la plantilla real de
blog/es-que-es-la-magia-del-caos.html (que es la que usa el resto del corpus
ES: <html lang="es">, rutas absolutas, pie propio y hreflang al equivalente
en ingles).

  from es_article_builder import construir_es
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TPL = ROOT / "blog" / "es-que-es-la-magia-del-caos.html"
SITE = "https://cha0smagicklabs.com"


def construir_es(slug, titulo, h1, lede, desc, keywords, en_href, toc, cuerpo,
                 faq, rel, fecha="2026-10-22", imagen=None):
    tpl = TPL.read_text(encoding="utf-8", errors="ignore")
    s = tpl
    url = f"{SITE}/blog/{slug}.html"

    # ---------------- head ----------------
    s = re.sub(r"(?is)<title>.*?</title>", f"<title>{titulo}</title>", s, count=1)
    s = re.sub(r'(?i)(<meta name="description" content=")[^"]*(")',
               lambda m: m.group(1) + desc + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta name="keywords" content=")[^"]*(")',
               lambda m: m.group(1) + keywords + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<link rel="canonical" href=")[^"]*(")',
               lambda m: m.group(1) + url + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<link rel="alternate"[^>]*hreflang="en"[^>]*href=")[^"]*(")',
               lambda m: m.group(1) + en_href + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<link rel="alternate"[^>]*hreflang="es"[^>]*href=")[^"]*(")',
               lambda m: m.group(1) + url + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta property="og:title" content=")[^"]*(")',
               lambda m: m.group(1) + titulo + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta property="og:description" content=")[^"]*(")',
               lambda m: m.group(1) + desc + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta property="og:url" content=")[^"]*(")',
               lambda m: m.group(1) + url + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta name="twitter:title" content=")[^"]*(")',
               lambda m: m.group(1) + titulo + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta name="twitter:description" content=")[^"]*(")',
               lambda m: m.group(1) + desc + m.group(2), s, count=1)
    s = re.sub(r'(?i)(<meta property="article:published_time" content=")[^"]*(")',
               lambda m: m.group(1) + fecha + m.group(2), s, count=1)
    if imagen:
        s = re.sub(r'(?i)(<meta property="og:image" content=")[^"]*(")',
                   lambda m: m.group(1) + f"{SITE}/assets/images/blog/{imagen}.png" + m.group(2), s, count=1)
        s = re.sub(r'(?i)(<meta name="twitter:image" content=")[^"]*(")',
                   lambda m: m.group(1) + f"{SITE}/assets/images/blog/{imagen}.png" + m.group(2), s, count=1)
    else:
        # la imagen social es la del propio articulo, no la de la plantilla
        s = re.sub(r'(?i)(<meta property="og:image" content=")[^"]*(")',
                   lambda m: m.group(1) + f"{SITE}/assets/images/blog/{slug}.png" + m.group(2), s, count=1)
        s = re.sub(r'(?i)(<meta name="twitter:image" content=")[^"]*(")',
                   lambda m: m.group(1) + f"{SITE}/assets/images/blog/{slug}.png" + m.group(2), s, count=1)

    # ---------------- JSON-LD de la cabecera ----------------
    import json as _json

    article_ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": titulo,
        "description": desc,
        "image": f"{SITE}/assets/images/blog/{imagen}.png" if imagen else f"{SITE}/assets/images/Banner.png",
        "inLanguage": "es",
        "author": {"@type": "Person", "name": "Frater Alek0s",
                   "url": f"{SITE}/pages/frater-alek0s.html"},
        "publisher": {"@type": "Organization", "name": "Cha0smagick Labs", "url": SITE,
                      "logo": {"@type": "ImageObject", "url": f"{SITE}/assets/images/Banner.png"}},
        "datePublished": fecha,
        "dateModified": fecha,
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
    }
    faq_ld = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": url + "#faq",
        "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a in faq
        ],
    }
    nuevos_ld = (
        '<script type="application/ld+json">' + _json.dumps(article_ld, ensure_ascii=False) + "</script>\n"
        '<script type="application/ld+json">' + _json.dumps(faq_ld, ensure_ascii=False) + "</script>"
    )
    s = re.sub(r'(?s)<script type="application/ld\+json">.*?</script>\s*', "", s)
    s = s.replace("</head>", nuevos_ld + "\n</head>", 1)

    # ---------------- hreflang: en, es y x-default ----------------
    s = re.sub(r'(?is)<link rel="alternate"[^>]*hreflang="x-default"[^>]*>\s*', "", s)
    s = re.sub(r'(?is)(<link rel="alternate"[^>]*hreflang="en"[^>]*>\s*)',
               r'\1<link rel="alternate" hreflang="es" href="' + url + '">\n'
               r'    <link rel="alternate" hreflang="x-default" href="' + url + '">\n', s, count=1)

    # ---------------- hero ----------------
    s = re.sub(r'(?is)(<div class="hero"><div class="wrap">).*?(</div></div>)',
               lambda m: (m.group(1)
                          + '<p class="kicker">CHAOSMAGICK LABS · EN ESPAÑOL</p>'
                          + f'<h1>{h1}</h1>'
                          + f'<p class="lede">{lede}</p>'
                          + m.group(2)), s, count=1)

    # ---------------- cuerpo + faq + relacionados ----------------
    i = s.find('<main class="wrap">')
    j = s.find('</main>', i)
    if i < 0 or j < 0:
        raise SystemExit("no encuentro los marcadores del cuerpo")

    toc_html = ""
    if toc:
        toc_html = ('<nav class="toc" aria-label="Contenido"><ul>'
                    + "".join(f'<li><a href="#{a}">{t}</a></li>' for a, t in toc)
                    + "</ul></nav>\n")
    faq_html = '<div class="faq"><h2>Preguntas frecuentes</h2>' + "".join(
        f'<h3>{q}</h3><p>{a}</p>' for q, a in faq) + "</div>"
    rel_html = '<div class="rel">' + "".join(f'<a href="{h}">{t}</a>' for h, t in rel) + "</div>"

    s = s[:i] + '<main class="wrap">\n' + toc_html + cuerpo + "\n" + faq_html + "\n" + rel_html + "\n" + s[j:]

    out = ROOT / "blog" / f"{slug}.html"
    out.write_text(s, encoding="utf-8")
    return out
