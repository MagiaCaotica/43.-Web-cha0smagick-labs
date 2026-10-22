#!/usr/bin/env python3
"""
Genera un articulo nuevo con la plantilla real del blog.

Se reusa el head, el pie, los scripts y los bloques de comentarios de un
articulo existente, y se inyecta el contenido, el JSON-LD y los enlaces
internos del nuevo.

  python projects/scripts/_gen_article.py
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"

TEMPLATE = ROOT / "blog" / "how-to-create-magickal-servitor.html"

PERSON = {
    "@type": "Person",
    "@id": f"{SITE}/pages/frater-alek0s.html#person",
    "name": "Frater Alek0s",
    "url": f"{SITE}/pages/frater-alek0s.html",
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
    "@id": f"{SITE}/#organization",
    "name": "Cha0smagick Labs",
    "url": SITE,
    "logo": {"@type": "ImageObject", "url": f"{SITE}/assets/images/Banner.png"},
}


def construir(slug, titulo, h1, descripcion, keywords, fecha, lectura, imagen,
              toc, cuerpo, faq, referencias, enlaces_internos, cta, related, jsonld_extra=None):
    tpl = TEMPLATE.read_text(encoding="utf-8", errors="ignore")

    # ---------- head ----------
    head = tpl[: tpl.find("</head>") + 7]
    head = re.sub(r"<title>.*?</title>", f"<title>{titulo}</title>", head, flags=re.S)
    head = re.sub(r'(?i)<meta name="description" content="[^"]*">',
                   f'<meta name="description" content="{descripcion}">', head)
    head = re.sub(r'(?i)<meta name="keywords" content="[^"]*">',
                   f'<meta name="keywords" content="{keywords}">', head)
    head = re.sub(r'(?i)<link rel="canonical" href="[^"]*">',
                   f'<link rel="canonical" href="{SITE}/blog/{slug}.html">', head)
    head = re.sub(r'(?i)<link rel="alternate" href="[^"]*" hreflang="en">',
                   f'<link rel="alternate" href="{SITE}/blog/{slug}.html" hreflang="en">\n'
                   f'<link rel="alternate" href="{SITE}/blog/{slug}.html" hreflang="x-default">', head)
    head = re.sub(r'(?i)<meta property="og:title" content="[^"]*">',
                   f'<meta property="og:title" content="{titulo}">', head)
    head = re.sub(r'(?i)<meta property="og:description" content="[^"]*">',
                   f'<meta property="og:description" content="{descripcion}">', head)
    head = re.sub(r'(?i)<meta property="og:url" content="[^"]*">',
                   f'<meta property="og:url" content="{SITE}/blog/{slug}.html">', head)
    head = re.sub(r'(?i)<meta property="og:image" content="[^"]*">',
                   f'<meta property="og:image" content="{SITE}/assets/images/blog/{imagen}.png">', head)
    head = re.sub(r'(?i)<meta name="twitter:title" content="[^"]*">',
                   f'<meta name="twitter:title" content="{titulo}">', head)
    head = re.sub(r'(?i)<meta name="twitter:description" content="[^"]*">',
                   f'<meta name="twitter:description" content="{descripcion}">', head)
    head = re.sub(r'(?i)<meta name="twitter:image" content="[^"]*">',
                   f'<meta name="twitter:image" content="{SITE}/assets/images/blog/{imagen}.png">', head)

    # ---------- JSON-LD ----------
    article = {
        "@context": "https://schema.org",
        "@type": "Article",
        "@id": f"{SITE}/blog/{slug}.html#article",
        "headline": h1,
        "description": descripcion,
        "image": f"{SITE}/assets/images/blog/{imagen}.png",
        "author": PERSON,
        "publisher": PUBLISHER,
        "datePublished": fecha,
        "dateModified": fecha,
        "mainEntityOfPage": {"@type": "WebPage", "@id": f"{SITE}/blog/{slug}.html"},
        "inLanguage": "en",
    }
    if jsonld_extra:
        article.update(jsonld_extra)
    crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": f"{SITE}/blog/{slug}.html#breadcrumb",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": f"{SITE}/blog/"},
            {"@type": "ListItem", "position": 3, "name": h1, "item": f"{SITE}/blog/{slug}.html"},
        ],
    }
    bloques = [article]
    if faq:
        bloques.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": f"{SITE}/blog/{slug}.html#faq",
            "mainEntity": [
                {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faq
            ],
        })
    bloques.append(crumbs)
    ld = "\n".join(f'<script type="application/ld+json">{json.dumps(b, ensure_ascii=False)}</script>' for b in bloques)
    head = re.sub(r'(?s)<script[^>]+application/ld\+json[^>]*>.*?</script>\s*', "", head)
    head = head.replace("</head>", ld + "\n</head>")

    # ---------- cuerpo ----------
    nav = tpl[tpl.find('<div class="blog-nav">'): tpl.find("<picture>")]
    pie_main = tpl[tpl.find('<!-- Comments (giscus) -->'): tpl.find("</main>")]
    pie_main = pie_main.replace("</article>", "")

    toc_html = "\n".join(f'            <li><a href="#{i}">{t}</a></li>' for i, t in toc)
    articulo = f"""<main class="blog-post">
<article class="article">
{nav}
        <picture>
            <source srcset="../assets/images/blog/{imagen}.webp" type="image/webp">
            <img src="../assets/images/blog/{imagen}.png" alt="{h1}" class="blog-featured-image" width="800" height="420" loading="eager" style="width:100%;max-width:800px;height:auto;border-radius:8px;margin-bottom:2rem;border:1px solid #333;">
        </picture>

        <h1>{h1}</h1>
<div class="meta">By <a href="{SITE}/pages/frater-alek0s.html" rel="author">Frater Alek0s</a> | <time datetime="{fecha}">{fecha}</time> | {lectura} min read</div>

        <details class="table-of-contents" open>
            <summary>Table of Contents</summary>
            <nav aria-label="Table of Contents">
                <ol>
{toc_html}
</ol>
            </nav>
        </details>
{cuerpo}
{referencias}
{enlaces_internos}
{cta}
{related}
{pie_main}
</article>
</main>"""

    # ---------- pie + scripts ----------
    cola = tpl[tpl.find('<div class="share-section">'):]
    # el share lleva el titulo en el enlace de twitter
    cola = cola.replace(
        "How%20to%20Create%20a%20Magickal%20Servitor%3A%20Complete%20Guide%20to%20Chaos%20M",
        __import__("urllib.parse", fromlist=["quote"]).quote(titulo, safe="")[:80],
    )
    return head + cola[: cola.find("</html>")].replace("</body>", "") + articulo + "</body></html>"


if __name__ == "__main__":
    print("modulo de generacion de articulos cargado")
