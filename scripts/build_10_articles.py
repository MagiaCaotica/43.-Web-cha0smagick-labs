# -*- coding: utf-8 -*-
"""
build_10_articles.py — Data-driven article builder.

Clones the canonical blog template (blog/zener-cards-esp-training-guide.html)
and renders each article from STRUCTURED DATA (scripts/articles_a.py +
scripts/articles_b.py). Nothing is hardcoded as HTML blobs: every section is
declared as {t: type, ...} and rendered to HTML here.

Usage:
    python scripts/build_10_articles.py
"""
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE = ROOT / "blog" / "zener-cards-esp-training-guide.html"
INDEX = ROOT / "blog" / "index.html"
SITEMAP = ROOT / "sitemap.xml"
BLOG_DIR = ROOT / "blog"

GA_ID = "G-V6LHCPN9TK"
SITE = "https://cha0smagicklabs.com"
AUTHOR = "Frater Alek0s"
PUBLISHER = "Cha0smagick Labs"

sys.path.insert(0, str(Path(__file__).resolve().parent))
from articles_a import ARTICLES_A  # noqa: E402
from articles_b import ARTICLES_B  # noqa: E402

ARTICLES = ARTICLES_A + ARTICLES_B


# ---------------------------------------------------------------- rendering

def _esc(text):
    return (text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace('"', "&quot;"))


def render_sections(sections):
    """Render a list of {t: type, ...} dicts to article HTML."""
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
    """Rebuild <title>..HowTo </script> (everything before <style)."""
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


SHARE_INTENTS = {
    "share-twitter": "https://twitter.com/intent/tweet?url={u}&text={t}",
    "share-reddit": "https://www.reddit.com/submit?url={u}&title={t}",
    "share-telegram": "https://t.me/share/url?url={u}&text={t}",
    "share-tumblr": "https://www.tumblr.com/share/link?url={u}&name={t}",
    "share-facebook": "https://www.facebook.com/sharer/sharer.php?u={u}",
    "share-pinterest": "https://pinterest.com/pin/create/button/?url={u}&description={t}",
}


def share_block(match, a):
    """Rewrite share-button hrefs, keeping each button's inner SVG intact."""
    url_enc = urllib.parse.quote(f"{SITE}/blog/{a['slug']}.html", safe="")
    title_enc = urllib.parse.quote(a["title"], safe="")

    def repl(m):
        cls = m.group("cls")
        href = SHARE_INTENTS.get(cls, m.group("href")).format(u=url_enc, t=title_enc)
        return (
            f'<a class="share-btn {cls}" href="{href}" target="_blank" '
            f'rel="noopener">{m.group("inner")}</a>'
        )

    pattern = (
        r'<a class="share-btn (?P<cls>share-\w+)" href="(?P<href>[^"]*)"'
        r'[^>]*>(?P<inner>.*?)</a>'
    )
    return re.sub(pattern, repl, match.group(0), flags=re.S)


# ---------------------------------------------------------------- build

def build_article(a, template):
    slug = a["slug"]
    body = body_block(a)
    html = template

    # 1. head region: <title> through HowTo </script> (before <style>)
    html = re.sub(
        r"<title>.*?</script>", head_block(a), html, count=1, flags=re.S
    )
    # 2. breadcrumb
    html = re.sub(
        r'<div class="breadcrumb">.*?</div>',
        f'<div class="breadcrumb"><a href="index.html">Community Blog</a> | {a["title"]}</div>',
        html,
        count=1,
        flags=re.S,
    )
    # 3. featured picture
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
    # 4. h1
    html = re.sub(r"<h1>.*?</h1>", f"<h1>{a['title']}</h1>", html, count=1, flags=re.S)
    # 5. meta line
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
    # 6. table of contents
    html = re.sub(
        r'<details class="table-of-contents".*?</details>',
        toc_block(a),
        html,
        count=1,
        flags=re.S,
    )
    # 7. article body + references
    html = re.sub(
        r'<h2 id="what-are-zener-cards">.*?<h2>References</h2>.*?</ul>',
        body,
        html,
        count=1,
        flags=re.S,
    )
    # 8. share buttons (rewrite hrefs, keep SVGs)
    html = re.sub(
        r'<div class="share-buttons">.*?</div>\s*</div>',
        lambda m: share_block(m, a),
        html,
        count=1,
        flags=re.S,
    )
    return html


# ---------------------------------------------------------------- index

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


# ---------------------------------------------------------------- sitemap

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


# ---------------------------------------------------------------- main

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
        print(f"OK {ok}/10 {slug}.html")


if __name__ == "__main__":
    main()
