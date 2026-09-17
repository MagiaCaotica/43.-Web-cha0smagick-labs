#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_blog.py — Unified Blog Article Generator for Cha0smagick Labs

Consolidates: generate_100_new.py + generate-blog-articles.py
Generates SEO-optimized blog articles with full schema support.

Usage:
    python scripts/generate_blog.py [--dry-run] [--articles A,B,C]
"""

import re
import sys
import json
import argparse
from pathlib import Path
from typing import Dict, List, Any, Optional

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
sys.path.insert(0, str(ROOT))  # repo root: article data modules H-K live here

# Import all article data modules
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

ALL_ARTICLES = (ARTICLES_A + ARTICLES_B + ARTICLES_C
    + ARTICLES_D + ARTICLES_E + ARTICLES_F + ARTICLES_G + ARTICLES_H + ARTICLES_I + ARTICLES_J + ARTICLES_K)

ARTICLE_MODULES = {
    'A': ARTICLES_A, 'B': ARTICLES_B, 'C': ARTICLES_C, 'D': ARTICLES_D,
    'E': ARTICLES_E, 'F': ARTICLES_F, 'G': ARTICLES_G, 'H': ARTICLES_H,
    'I': ARTICLES_I, 'J': ARTICLES_J, 'K': ARTICLES_K,
}


def _esc(text: str) -> str:
    return (text.replace("&", chr(38)+"amp;").replace("<", chr(38)+"lt;")
                .replace(">", chr(38)+"gt;").replace('"', chr(38)+"quot;"))


def render_sections(sections: List[Dict]) -> str:
    out = []
    for s in sections:
        t = s.get("t")
        if t is None:
            # Legacy section format (draft modules H/I/J): {"name", "content"} dicts.
            name = s.get("name", "")
            content = s.get("content", "")
            if name:
                out.append(f"<h2>{name}</h2>")
            for para in content.split("\n\n"):
                para = para.strip()
                if para:
                    out.append(f"<p>{para}</p>")
            continue
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


def build_head(a: Dict) -> str:
    slug = a["slug"]
    url = f"{SITE}/blog/{slug}.html"
    img = f"{SITE}/assets/images/blog/{slug}.png"
    date_iso = a.get("date_iso", "2026-08-16")
    date_display = a.get("date_display", "August 16, 2026")
    read_min = a.get("read_min", "10 min read")
    
    # Article schema
    article_schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": a['title'],
        "description": a['desc'],
        "image": img,
        "author": {"@type": "Person", "name": AUTHOR, "url": SITE},
        "publisher": {
            "@type": "Organization",
            "name": PUBLISHER,
            "logo": {"@type": "ImageObject", "url": f"{SITE}/assets/images/Banner.png"}
        },
        "datePublished": date_iso,
        "dateModified": date_iso,
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".blog-post p", ".blog-post h2", ".blog-post h3", ".blog-post li"]
        }
    }
    article_json = json.dumps(article_schema, separators=(',', ':'))
    
    # Build meta using string concatenation to avoid f-string issues
    meta_parts = [
        f"<title>{a['title']}</title>",
        f'<meta name="description" content="{a["desc"]}">',
        f'<meta name="keywords" content="{a["keywords"]}">',
        f'<link rel="canonical" href="{url}">',
        f'<link rel="alternate" hreflang="en" href="{url}">',
        '<link rel="manifest" href="../manifest.json">',
        '<meta name="theme-color" content="#050505">',
        f'<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>',
        '<script>',
        '  window.dataLayer = window.dataLayer || [];',
        "  function gtag(){dataLayer.push(arguments);}",
        "  gtag('consent', 'default', {'analytics_storage': 'denied'});",
        "  gtag('js', new Date());",
        f"  gtag('config', '{GA_ID}');",
        '</script>',
        f'<meta property="og:title" content="{a["title"]}">',
        f'<meta property="og:description" content="{a["desc"]}">',
        f'<meta property="og:url" content="{url}">',
        '<meta property="og:type" content="article">',
        f'<meta property="og:image" content="{img}">',
        '<meta property="og:locale" content="en">',
        '<meta property="og:site_name" content="Cha0smagick Labs">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{a["title"]}">',
        f'<meta name="twitter:description" content="{a["desc"]}">',
        f'<meta name="twitter:image" content="{img}">',
        '<link rel="icon" type="image/x-icon" href="../assets/favicon.ico">',
        '<link rel="apple-touch-icon" href="../assets/images/Banner.png">',
        f'<script type="application/ld+json">{article_json}</script>'
    ]
    meta = "\n".join(meta_parts)
    
    # HowTo schema
    if a.get("howto"):
        steps = [
            {"@type": "HowToStep", "position": i + 1, "name": st["name"], "text": st["text"]}
            for i, st in enumerate(a["howto"])
        ]
        howto_schema = {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": a['title'],
            "description": a['desc'],
            "step": [{"@type": "HowToSection", "name": "Steps", "position": 1, "itemListElement": steps}]
        }
        howto_json = json.dumps(howto_schema, separators=(',', ':'))
        meta += f'\n<script type="application/ld+json">{howto_json}</script>'
    
    # FAQ schema
    if a.get("faq"):
        faq_items = [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": ans}}
            for q, ans in a["faq"]
        ]
        faq_schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq_items
        }
        faq_json = json.dumps(faq_schema, separators=(',', ':'))
        meta += f'\n<script type="application/ld+json">{faq_json}</script>'
    
    # BreadcrumbList schema
    breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/index.html"},
            {"@type": "ListItem", "position": 3, "name": a['title'], "item": url}
        ]
    }
    breadcrumb_json = json.dumps(breadcrumb_schema, separators=(',', ':'))
    meta += f'\n<script type="application/ld+json">{breadcrumb_json}</script>'
    
    return meta


def toc_block(a: Dict) -> str:
    items = "".join(
        f'<li><a href="#{anchor}">{label}</a></li>' for anchor, label in a["toc"]
    )
    return (
        '<details class="table-of-contents" open><summary>Table of Contents</summary>'
        f'<nav aria-label="Table of Contents"><ol>{items}</ol></nav></details>'
    )


def cta_block(a: Dict) -> str:
    links = "".join(
        f'<p><a href="../apps/{app}.html">Get {name} \u2192</a></p>'
        for app, name in a.get("cta_apps", [])
    )
    return (
        '<div class="cta-box">'
        "<p><strong>Ready for the full experience?</strong></p>"
        "<p>These guides work with pen and paper, but a digital tool makes them faster.</p>"
        f"{links}</div>"
    )


def faq_block(a: Dict) -> str:
    if "faq" not in a:
        return ""
    out = ['<h2 id="faq">Frequently Asked Questions</h2>']
    for q, ans in a["faq"]:
        out.append(f"<h3>{q}</h3>")
        out.append(f"<p>{ans}</p>")
    return "\n".join(out)


def related_block(a: Dict) -> str:
    items = "".join(
        f'<p><a href="../blog/{slug}.html">{title} \u2192</a></p>'
        for slug, title in a.get("related", [])
    )
    return (
        '<section class="related-articles"><h2>Related Articles</h2>'
        f'<div class="related-links">{items}</div></section>'
    )


def references_block(a: Dict) -> str:
    items = "".join(f"<li>{r}</li>" for r in a.get("references", []))
    return f"<h2>References</h2><ul>{items}</ul>"


def _slugify(text: str) -> str:
    parts = [ch if ch.isalnum() else " " for ch in text.lower()]
    return "-".join("".join(parts).split())


# Legacy draft modules (H/I/J) reference apps in dot notation; map to real app slugs.
_LEGACY_APP_MAP = {
    "astrology": "astral-lab",
    "charts": "lunar-phase-calculator",
    "cryptozoology": "eerieroads",
    "ghost-hunting": "noctem-tools",
    "goetia": "arcana-goetia",
    "nde-research": "astral-lab",
    "parapsychology": "psi-gym",
    "rituals": "chaos-sigil-generator",
    "runes": "norse-rune-oracle",
    "sigils": "chaos-sigil-generator",
}


def normalize_article(a: Dict) -> Dict:
    """Normalize legacy draft article dicts (modules H/I/J) to the renderer contract.

    Legacy shapes: toc/cta_apps as plain strings, faq/related/references as dicts.
    """
    toc = a.get("toc", [])
    if toc and isinstance(toc[0], str):
        a = {**a, "toc": [(_slugify(t), t) for t in toc]}
    cta = a.get("cta_apps", [])
    if cta and isinstance(cta[0], str):
        def _legacy_app(c: str):
            slug = c.split(".")[-1]
            return (_LEGACY_APP_MAP.get(slug, slug), slug.replace("-", " ").title())
        a = {**a, "cta_apps": [_legacy_app(c) for c in cta]}
    faq = a.get("faq", [])
    if faq and isinstance(faq[0], dict):
        a = {**a, "faq": [(f["q"], f["a"]) for f in faq]}
    related = a.get("related", [])
    if related and isinstance(related[0], dict):
        a = {**a, "related": [(r["slug"], r["title"]) for r in related]}
    refs = a.get("references", [])
    if refs and isinstance(refs[0], dict):
        a = {**a, "references": [f'{r["title"]} — {r["url"]}' for r in refs]}
    howto = a.get("howto")
    if isinstance(howto, str):
        a = {**a, "howto": [{"name": "How to Use", "text": howto}]}
    return a


def body_block(a: Dict) -> str:
    return "\n".join([
        render_sections(a["sections"]),
        cta_block(a),
        faq_block(a),
        related_block(a),
        references_block(a),
    ])


def build_article(a: Dict, template: str) -> str:
    a = normalize_article(a)
    slug = a["slug"]
    body = body_block(a)
    html = template

    html = re.sub(
        r"<title>.*?</script>", lambda _m: build_head(a), html, count=1, flags=re.S
    )
    html = re.sub(
        r'<div class="breadcrumb">.*?</div>',
        lambda _m: f'<div class="breadcrumb"><a href="index.html">Community Blog</a> | {a["title"]}</div>',
        html,
        count=1,
        flags=re.S,
    )
    if a.get("og_alt"):
        html = re.sub(
            r"<picture>.*?</picture>",
            lambda _m: (
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
    
    # Add footer and scripts after share-section
    html = html.replace(
        '</div>\n</article>\n</main>',
        '''</div>
</article>
</main>
<footer id="site-footer" class="site-footer">
    <div class="footer-grid">
        <div class="footer-section">
            <h4>Cha0smagick Labs</h4>
            <p>Explore the Art and Practice of Chaos Magick.</p>
            <p>Corporate Cybermancy Solutions | since 2025.</p>
        </div>
        <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="../index.html">Home Page</a></li>
                <li><a href="../index.html#about">About</a></li>
                <li><a href="../index.html#products">Premium Apps</a></li>
                <li><a href="../tools/">Free Online Tools</a></li>
                <li><a href="index.html">Read Blog</a></li>
                <li><a href="../best-occult-apps-android.html">Best Occult Apps</a></li>
                <li><a href="../glossary.html">Glossary</a></li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>Legal</h4>
            <ul>
                <li><a href="../privacy-policy.html">Privacy Policy</a></li>
                <li><a href="../index.html#contact">Contact Us</a></li>
            </ul>
        </div>
        <div class="footer-section footer-visitor">
            <h4>Visitor Count</h4>
            <div class="visitor-count">Visitors: <span id="visitor-count">000000</span></div>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; 2026 Cha0smagick Labs | Corporate Cybermancy Solutions</p>
    </div>
</footer>
<div id="google_translate_element" style="display:none;"></div>
<div id="cookie-consent-banner">
    <p>This site uses cookies for analytics and to improve your experience. <a href="../privacy-policy.html" style="color:#ffd700;">Review our Privacy Policy</a></p>
    <div class="cookie-buttons">
        <button class="cookie-btn-accept" onclick="acceptCookies()">Accept</button>
        <button class="cookie-btn-decline" onclick="declineCookies()">Decline</button>
    </div>
</div>
<script src="../js/shared.min.js"></script>
<div id="lang-sidebar" class="lang-sidebar">
    <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">??</button>
    <div id="lang-flag-list" class="lang-flag-list">
        <button onclick="switchLang('en')" title="English" class="lang-btn"><img src="../assets/images/flags/gb.svg" alt="English" class="flag-icon"> EN</button>
        <button onclick="switchLang('es')" title="Espa\u00f1ol" class="lang-btn"><img src="../assets/images/flags/es.svg" alt="Spanish" class="flag-icon"> ES</button>
    </div>
</div>
<div class="giscus-container" style="max-width:800px;margin:2rem auto;padding:0 1rem;">
    <div id="giscus-comments"></div>
</div>
<script src="https://giscus.app/client.js" data-repo="MagiaCaotica/43.-Web-cha0smagick-labs" data-repo-id="R_kgDOQ95-4g" data-category="General" data-category-id="DIC_kwDOQ95-4s4DCREq" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="dark_dimmed" data-lang="en" data-loading="lazy" crossorigin="anonymous" async>
</script>
</body>
</html>'''
    )
    
    # Ensure critical CSS is inlined
    if '<style>' not in html:
        html = html.replace('</head>', '<style>/* Critical CSS inlined by generate_blog.py */</style>\n</head>')
    
    return html


def _ensure_index() -> None:
    """Create a minimal blog index scaffold when missing (fresh clone or
    isolated test tree) so card insertion always has its anchor."""
    if not INDEX.exists():
        INDEX.write_text(
            '<!DOCTYPE html>\n<html lang="en">\n<head>\n'
            '  <meta charset="utf-8">\n'
            "  <title>Blog — Cha0smagick Labs</title>\n"
            "</head>\n<body>\n"
            '<div class="posts">\n</div>\n'
            "</body>\n</html>\n",
            encoding="utf-8",
        )


def update_index(a: Dict) -> bool:
    _ensure_index()
    text = INDEX.read_text(encoding="utf-8")
    card = (
        '<div class="post-card" data-category="' + a["category"] + '">\n'
        f'<div class="date">{a["date_display"]}</div>\n'
        f'<h3><a href="{a["slug"]}.html">{a["index_title"]}</a></h3>\n'
        f'<div class="excerpt">{a["excerpt"]}</div>\n'
        f'<a class="read-more" href="{a["slug"]}.html">Read More \u2192</a>\n'
        "</div>"
    )
    if card in text:
        return False
    text = text.replace('<div class="posts">', '<div class="posts">\n' + card, 1)
    INDEX.write_text(text, encoding="utf-8")
    return True


def _ensure_sitemap() -> None:
    """Create a minimal sitemap scaffold when missing so URL insertion
    always has its ``</urlset>`` anchor."""
    if not SITEMAP.exists():
        SITEMAP.write_text(
            '<?xml version="1.0" encoding="UTF-8"?>\n'
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
            "</urlset>\n",
            encoding="utf-8",
        )


def update_sitemap(a: Dict) -> bool:
    _ensure_sitemap()
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


def generate_articles(articles: List[Dict], dry_run: bool = False) -> int:
    template = TEMPLATE.read_text(encoding="utf-8")
    ok = 0
    for a in articles:
        slug = a["slug"]
        html = build_article(a, template)
        if not dry_run:
            (BLOG_DIR / f"{slug}.html").write_text(html, encoding="utf-8")
            update_index(a)
            update_sitemap(a)
        ok += 1
        print(f"OK {ok}/{len(articles)} {slug}.html")
    return ok


def main():
    parser = argparse.ArgumentParser(description="Generate blog articles for Cha0smagick Labs")
    parser.add_argument("--dry-run", action="store_true", help="Generate but don't write files")
    parser.add_argument("--articles", type=str, help="Comma-separated list of article modules to generate (e.g., A,B,C)")
    parser.add_argument("--list", action="store_true", help="List all available articles")
    args = parser.parse_args()
    
    if args.list:
        for mod_name, mod_articles in ARTICLE_MODULES.items():
            print(f"\n=== Module {mod_name} ({len(mod_articles)} articles) ===")
            for a in mod_articles:
                print(f"  - {a['slug']}: {a['title']}")
        return
    
    if args.articles:
        selected_modules = [m.strip().upper() for m in args.articles.split(",")]
        articles = []
        for mod in selected_modules:
            if mod in ARTICLE_MODULES:
                articles.extend(ARTICLE_MODULES[mod])
            else:
                print(f"Warning: Module {mod} not found", file=sys.stderr)
    else:
        articles = ALL_ARTICLES
    
    print(f"Generating {len(articles)} articles...")
    if args.dry_run:
        print("DRY RUN - no files will be written")
    
    count = generate_articles(articles, dry_run=args.dry_run)
    print(f"\nDone. Generated {count} articles.")


if __name__ == "__main__":
    main()