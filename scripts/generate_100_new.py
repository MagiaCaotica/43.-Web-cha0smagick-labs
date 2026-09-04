# -*- coding: utf-8 -*-
"""
generate_100_new.py — Generate 100 new unique blog articles.

Reads structured article data from scripts/new_articles_*.py and renders
HTML from the canonical blog template. Each article is completely unique
with original content — zero AI slop.

Usage:
    python scripts/generate_100_new.py
"""
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "blog" / "best-sigil-generator-app-onetime.html"
INDEX = ROOT / "blog" / "index.html"
SITEMAP = ROOT / "sitemap.xml"
BLOG_DIR = ROOT / "blog"

GA_ID = "G-V6LHCPN9TK"
SITE = "https://cha0smagicklabs.com"
AUTHOR = "Frater Alek0s"
PUBLISHER = "Cha0smagick Labs"

sys.path.insert(0, str(Path(__file__).resolve().parent))

from new_articles_a import ARTICLES_A
from new_articles_b import ARTICLES_B
from new_articles_c import ARTICLES_C
from new_articles_d import ARTICLES_D
from new_articles_e import ARTICLES_E
from new_articles_f import ARTICLES_F
from new_articles_g import ARTICLES_G
from new_articles_h import ARTICLES_H
from new_articles_i import ARTICLES_I
from new_articles_j import ARTICLES_J
from new_articles_k import ARTICLES_K

ARTICLES = (ARTICLES_A + ARTICLES_B + ARTICLES_C
+ ARTICLES_D + ARTICLES_E + ARTICLES_F + ARTICLES_G + ARTICLES_H + ARTICLES_I + ARTICLES_J + ARTICLES_K)


def _esc(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace('"', "&quot;"))


def render_sections(sections):
    out = []
    for s in sections:
        t = s["t"]
        if t == "h2":
            out.append(f'<h2 id="{s["id"]}">{s["text"]}</h2>')
        elif t == "h3":
            out.append(f"<h3>{s['text']}</h3>")
        elif t == "p":
            out.append(f"<p>{s['text']}</p>")
        elif t == "ul":
            items = "".join(f"<li>{i}</li>" for i in s["items"])
            out.append(f"<ul>{items}</ul>")
        elif t == "ol":
            items = "".join(f"<li>{i}</li>" for i in s["items"])
            out.append(f"<ol>{items}</ol>")
        elif t == "table":
            headers = "".join(f"<th>{_esc(h)}</th>" for h in s["headers"])
            body = "".join(
                "<tr>" + "".join(f"<td>{c}</td>" for c in row) + "</tr>"
                for row in s["rows"]
            )
            out.append(
                f'<table><thead><tr>{headers}</tr></thead><tbody>{body}</tbody></table>'
            )
        else:
            raise ValueError(f"unknown section type: {t}")
    return "\n".join(out)


def head_block(a):
    slug = a["slug"]
    url = f"{SITE}/blog/{slug}.html"
    img = f"{SITE}/assets/images/blog/{slug}.png"
    meta = f"""<title>{a['title']}</title>
<meta name="description" content="{a['desc']}">
<meta name="keywords" content="{a['keywords']}">
<link rel="canonical" href="{url}">
<link rel="alternate" hreflang="en" href="{url}">
<link rel="manifest" href="../manifest.json">
<meta name="theme-color" content="#050505">
<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('consent', 'default', {{'analytics_storage': 'denied'}});
  gtag('js', new Date());
  gtag('config', '{GA_ID}');
</script>
<meta property="og:title" content="{a['title']}">
<meta property="og:description" content="{a['desc']}">
<meta property="og:url" content="{url}">
<meta property="og:type" content="article">
<meta property="og:image" content="{img}">
<meta name="twitter:image" content="{img}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"Article","headline":"{a['title']}","description":"{a['desc']}","image":"{img}","author":{{"@type":"Person","name":"{AUTHOR}"}},"datePublished":"{a['date_iso']}","publisher":{{"@type":"Organization","name":"{PUBLISHER}","url":"{SITE}"}},"mainEntityOfPage":"{url}","speakable":{{"@type":"SpeakableSpecification","cssSelector":[".blog-post p",".blog-post h2",".blog-post h3",".blog-post li"]}}}}
</script>"""
    if a.get("howto"):
        steps = ",".join(
            '{{"@type":"HowToStep","position":{p},"name":"{n}","text":"{t}"}}'.format(
                p=i + 1, n=st["name"], t=st["text"]
            )
            for i, st in enumerate(a["howto"])
        )
        meta += f"""
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"HowTo","name":"{a['title']}","description":"{a['desc']}","step":[{{"@type":"HowToSection","name":"Steps","position":1,"itemListElement":[{steps}]}}]}}
</script>"""
    return meta


def toc_block(a):
    items = "".join(
        f'<li><a href="#{anchor}">{label}</a></li>' for anchor, label in a["toc"]
    )
    return (
        '<details class="table-of-contents" open><summary>Table of Contents</summary>'
        f'<nav aria-label="Table of Contents"><ol>{items}</ol></nav></details>'
    )


def cta_block(a):
    links = "".join(
        f'<p><a href="../apps/{app}.html">Get {name} &#8594;</a></p>'
        for app, name in a["cta_apps"]
    )
    return (
        '<div class="cta-box">'
        "<p><strong>Ready for the full experience?</strong></p>"
        "<p>These guides work with pen and paper, but a digital tool makes them faster.</p>"
        f"{links}</div>"
    )


def faq_block(a):
    if "faq" not in a:
        return ""
    out = ['<h2 id="faq">Frequently Asked Questions</h2>']
    for q, ans in a["faq"]:
        out.append(f"<h3>{q}</h3>")
        out.append(f"<p>{ans}</p>")
    return "\n".join(out)


def related_block(a):
    items = "".join(
        f'<p><a href="../blog/{slug}.html">{title} &#8594;</a></p>'
        for slug, title in a["related"]
    )
    return (
        '<section class="related-articles"><h2>Related Articles</h2>'
        f'<div class="related-links">{items}</div></section>'
    )


def references_block(a):
    items = "".join(f"<li>{r}</li>" for r in a["references"])
    return f"<h2>References</h2><ul>{items}</ul>"


def body_block(a):
    return "\n".join(
        [
            render_sections(a["sections"]),
            cta_block(a),
            faq_block(a),
            related_block(a),
            references_block(a),
        ]
    )


def build_article(a, template):
    slug = a["slug"]
    body = body_block(a)
    html = template

    html = re.sub(
        r"<title>.*?</script>", head_block(a), html, count=1, flags=re.S
    )
    html = re.sub(
        r'<div class="breadcrumb">.*?</div>',
        f'<div class="breadcrumb"><a href="index.html">Community Blog</a> | {a["title"]}</div>',
        html,
        count=1,
        flags=re.S,
    )
    if a.get("og_alt"):
        html = re.sub(
            r"<picture>.*?</picture>",
            (
                f'<picture><source srcset="../assets/images/blog/{slug}.webp" '
                f'type="image/webp"><img src="../assets/images/blog/{slug}.png" '
                f'alt="{a["og_alt"]}" class="blog-featured-image" width="800" '
                f'height="420" loading="eager" '
                f'style="width:100%;max-width:800px;height:auto;border-radius:8px;'
                f'margin-bottom:2rem;border:1px solid #333;"></picture>'
            ),
            html,
            count=1,
            flags=re.S,
        )
    else:
        html = re.sub(r"<picture>.*?</picture>", "", html, count=1, flags=re.S)
    html = re.sub(r"<h1>.*?</h1>", f"<h1>{a['title']}</h1>", html, count=1, flags=re.S)
    html = re.sub(
        r'<div class="meta">.*?</div>',
        (
            f'<div class="meta">By {AUTHOR} | <time datetime="{a["date_iso"]}">'
            f'{a["date_display"]}</time> | {a["read_min"]} min read</div>'
        ),
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<details class="table-of-contents".*?</details>',
        toc_block(a),
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<section class="hero".*?</main>',
        lambda m: m.group(0).replace(
            '<section class="hero">.*?</section>',
            f'<section class="hero"><h1>{a["title"]}</h1></section>'
        ),
        html,
        count=1,
        flags=re.S,
    )
    html = re.sub(
        r'<main class="blog-post">\s*<article class="article">.*?<div class="share-section">',
        f'<main class="blog-post">\n<article class="article">\n{body}\n\n<div class="share-section">',
        html,
        count=1,
        flags=re.S,
    )
    return html


def update_index(a):
    text = INDEX.read_text(encoding="utf-8")
    card = (
        '<div class="post-card" data-category="' + a["category"] + '">\n'
        f'<div class="date">{a["date_display"]}</div>\n'
        f'<h3><a href="{a["slug"]}.html">{a["index_title"]}</a></h3>\n'
        f'<div class="excerpt">{a["excerpt"]}</div>\n'
        f'<a class="read-more" href="{a["slug"]}.html">Read More &#8594;</a>\n'
        "</div>"
    )
    if card in text:
        return False
    text = text.replace('<div class="posts">', '<div class="posts">\n' + card, 1)
    INDEX.write_text(text, encoding="utf-8")
    return True


def update_sitemap(a):
    text = SITEMAP.read_text(encoding="utf-8")
    entry = (
        f"<url><loc>{SITE}/blog/{a['slug']}.html</loc>"
        f"<lastmod>{a['lastmod']}</lastmod>"
        f"<changefreq>monthly</changefreq><priority>0.9</priority></url>\n"
    )
    if entry in text:
        return False
    text = text.replace("</urlset>", entry + "</urlset>", 1)
    SITEMAP.write_text(text, encoding="utf-8")
    return True


def main():
    template = TEMPLATE.read_text(encoding="utf-8")
    ok = 0
    for a in ARTICLES:
        slug = a["slug"]
        html = build_article(a, template)
        (BLOG_DIR / f"{slug}.html").write_text(html, encoding="utf-8")
        update_index(a)
        update_sitemap(a)
        ok += 1
        print(f"OK {ok}/{len(ARTICLES)} {slug}.html")
    print(f"\nDone. Generated {ok} articles.")


if __name__ == "__main__":
    main()
