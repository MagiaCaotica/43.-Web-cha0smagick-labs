#!/usr/bin/env python3
"""
Cha0smagick Labs Blog Article Generator
Generates 100 SEO-optimized blog articles following the existing template pattern.
Each article includes deep-dive content + BTL CTAs to convert readers into app buyers.
"""

import os
import json
from datetime import date

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(BASE_DIR, "blog")

DATE_STR = "August 16, 2026"
DATE_ISO = "2026-08-16"
AUTHOR = "Frater Alek0s"
READ_TIME = "10 min read"
BASE_URL = "https://cha0smagicklabs.com"

# ─── CSS Template (inlined critical CSS) ──────────────────────────────────
CRITICAL_CSS = """\
:root{--bg-body: #030303;
  --bg-header: #050505;
  --bg-nav: rgba(5,5,5,0.9);
  --bg-card: #0a0a0a;
  --bg-section: transparent;
  --bg-footer: #030303;
  --bg-code: #0a0a0a;
  --text-primary: #f0f0f0;
  --text-body: #a0a0a0;
  --text-secondary: #999;
  --text-muted: #666;
  --text-dim: #444;
  --accent-gold: #c0a060;
  --accent-light: #ffd700;
  --accent-white: #fff;
  --border-subtle: #1a1a1a;
  --border-mid: #333;
  --border-card: #1a1a1a;
  --font-main: 'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Consolas', monospace;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.4s ease;
  --max-width: 1200px;}
*, *::before, *::after{margin:0; padding:0; box-sizing:border-box;}
body{font-family: var(--font-main); background-color: var(--bg-body); color: var(--text-body); line-height: 1.8; -webkit-font-smoothing: antialiased;}
a:hover{color: var(--accent-light);}
img{max-width:100%; height:auto;}
header .site-title, header h1{margin:0; font-size:3rem; letter-spacing:6px; text-transform:uppercase; font-weight:200; color:var(--accent-white); text-shadow:0 0 20px rgba(255,255,255,0.1);}
nav ul{list-style:none; padding:0; margin:0; display:flex; justify-content:center; background:transparent; flex-wrap:wrap;}
nav ul li a{display:block; color:var(--text-muted); text-decoration:none; font-size:0.8rem; text-transform:uppercase; letter-spacing:2px; padding:1.2rem 2rem; transition:all var(--transition-normal); border-bottom:1px solid transparent;}
nav ul li a:hover{color:var(--accent-white); background-color:var(--bg-card); border-bottom:1px solid var(--accent-white);}
section h2, section h3{color:var(--text-primary); font-weight:200; text-transform:uppercase; letter-spacing:3px; border-left:2px solid var(--border-mid); padding-left:1.5rem; margin-bottom:1.5rem; border-bottom:none;}
section.hero{text-align:center; padding:3rem 0 2rem; border-bottom:none; position:relative; margin-bottom:4rem;}
section.hero::after{content:''; display:block; width:80px; height:1px; background:var(--accent-gold); margin:0 auto; position:absolute; bottom:0; left:50%; transform:translateX(-50%);}
section.hero h1{color:var(--text-primary); font-size:1.5rem; font-weight:200; letter-spacing:3px; text-transform:uppercase; max-width:900px; margin:0 auto 1.2rem; border:none; padding:0; line-height:1.5;}
section.hero p{color:var(--text-secondary); max-width:750px; margin:1rem auto; font-size:1rem; line-height:1.7;}
.hero-cta-link{display:inline-block; margin-top:0.5rem; padding:0.6rem 1.8rem; background:var(--accent-gold); color:#000 !important; text-decoration:none !important; border-radius:6px; font-weight:700; font-size:0.9rem; text-transform:uppercase; letter-spacing:1px; transition:all 0.3s ease;}
.hero-cta-link:hover{background:var(--accent-light); transform:translateY(-2px); box-shadow:0 4px 20px rgba(255,215,0,0.3);}
section.ceo-bio{padding:1rem 0; border-top:1px solid var(--border-subtle); border-bottom:1px solid var(--border-subtle); margin-bottom:4rem;}
section.ceo-bio p{color:var(--text-secondary); line-height:1.8; font-size:0.95rem;}
section.ceo-bio a, a.inline-link{color:var(--accent-gold); text-decoration:underline;}
section.ceo-bio a:hover, a.inline-link:hover{color:var(--accent-light);}
section.apps-section{margin-bottom:4rem;}
section.apps-section p{color:var(--text-secondary); font-size:0.95rem; margin-bottom:2rem;}
.cta-button{display:inline-block; padding:0.75rem 1.5rem; background:transparent; border:1px solid var(--accent-gold); color:var(--accent-gold); text-decoration:none; font-family:var(--font-mono); font-weight:bold; text-transform:uppercase; font-size:0.85rem; border-radius:var(--radius-md); transition:all var(--transition-fast); cursor:pointer;}
.cta-button:hover{background:var(--accent-gold); color:var(--bg-body);}
.cta-button.primary{background:var(--accent-gold); color:var(--bg-body); border:1px solid var(--accent-gold); padding:0.85rem 2rem; font-size:0.95rem;}
.cta-button.primary:hover{background:var(--accent-light); border-color:var(--accent-light);}
.play-store-btn{display:inline-flex; align-items:center; justify-content:center; gap:10px; background:#3DDC84; color:#000 !important; text-decoration:none !important; font-family:'Segoe UI','Roboto','Helvetica Neue',sans-serif; font-weight:700; font-size:0.85rem; letter-spacing:0.5px; border:none; border-radius:6px; padding:12px 28px; cursor:pointer; transition:all 0.25s ease; text-transform:uppercase; position:relative; box-shadow:0 2px 8px rgba(61,220,132,0.3);}
.play-store-btn:hover{background:#2DBD6E; color:#000 !important; transform:translateY(-2px); box-shadow:0 6px 20px rgba(61,220,132,0.5);}
.play-store-btn .play-icon{width:22px; height:22px; flex-shrink:0;}
.breadcrumb,.breadcrumb-nav{max-width:var(--max-width); margin:0 auto; padding:0.75rem 2rem; font-size:0.8rem; color:var(--text-dim); font-family:var(--font-mono);}
.breadcrumb a:hover{text-decoration:underline;}
.breadcrumb-list{list-style:none; display:flex; flex-wrap:wrap; gap:0.5rem; padding:0; margin:0;}
.breadcrumb-list li::before{content:"|"; margin-right:0.5rem; color:var(--accent-gold);}
.breadcrumb-list li:first-child::before{content:none;}
.breadcrumb-list a{color:var(--accent-gold); text-decoration:none;}
footer{background-color:var(--bg-footer); color:var(--text-dim); text-align:center; padding:4rem 1rem; border-top:1px solid #111; font-size:0.8rem; letter-spacing:2px; text-transform:uppercase;}
footer a{color:#777; text-decoration:none;}
footer a:hover{color:var(--accent-white);}
.site-footer{letter-spacing:0; text-transform:none;}
.footer-grid{display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:2rem; max-width:var(--max-width); margin:0 auto 3rem; text-align:left;}
.footer-section h4{color:var(--accent-gold); font-family:var(--font-mono); font-size:0.85rem; text-transform:uppercase; letter-spacing:1px; margin-bottom:1rem;}
.footer-section p{color:var(--text-dim); font-size:0.8rem; line-height:1.6; letter-spacing:0; text-transform:none; margin-bottom:0.5rem;}
.footer-section ul{list-style:none; padding:0; margin:0;}
.footer-section li{margin-bottom:0.4rem;}
.footer-section a{color:var(--text-dim); font-size:0.8rem; text-transform:none; letter-spacing:0;}
.footer-section a:hover{color:var(--accent-gold);}
#faq-section{max-width:var(--max-width); margin:4rem auto; padding:2rem; border-top:1px solid var(--border-subtle);}
#faq-section h2{color:var(--text-primary); font-family:var(--font-mono); text-transform:uppercase; letter-spacing:2px; font-size:1.3rem; margin-bottom:2rem; text-align:center; border-left:none; padding-left:0;}
.blog-post,.article{max-width:800px; margin:0 auto; padding:2rem 1rem;}
.blog-post h2,.article h2{color:var(--text-primary); font-weight:200; text-transform:uppercase; letter-spacing:3px; margin:2rem 0 1rem;}
.blog-post h3,.article h3{color:var(--text-primary); font-weight:300; margin:1.5rem 0 0.8rem;}
.blog-post p,.article p{color:var(--text-secondary); margin-bottom:1.2rem; line-height:1.8;}
.blog-post ul,.blog-post ol,.article ul,.article ol{margin-bottom:1.5rem; padding-left:1.5rem; color:var(--text-secondary);}
.blog-post li,.article li{margin-bottom:0.5rem;}
.blog-meta,.article .meta{color:var(--text-dim); font-size:0.85rem; margin-bottom:2rem; font-family:var(--font-mono);}
.blog-nav a{color:var(--accent-gold); font-size:0.9rem;}
.blog-nav a:hover{color:var(--accent-light);}
.article h1{color:var(--accent-light); font-size:2rem; margin-bottom:.5rem;}
.article .cta-box{background:var(--bg-card); border:1px solid var(--accent-gold); border-radius:var(--radius-lg); padding:1.5rem; margin:2rem 0; text-align:center;}
.article .cta-box p{color:var(--text-body); margin-bottom:.8rem;}
.article .cta-box a{display:inline-block; padding:.7rem 1.8rem; background:var(--accent-gold); color:var(--bg-body); text-decoration:none; border-radius:6px; font-weight:700; transition:background var(--transition-normal);}
.article .cta-box a:hover{background:var(--accent-light);}
.share a:hover{color:var(--accent-light);}
section.intro{text-align:center; max-width:700px; margin:2rem auto; padding:0 1rem;}
section.intro h2{color:var(--text-primary); font-size:1.3rem; margin-bottom:0.8rem;}
section.intro p{color:var(--text-secondary); font-size:0.95rem; line-height:1.7;}
.bottom-cta{text-align:center; max-width:650px; margin:3rem auto; padding:2rem 1rem; border-top:1px solid var(--border-subtle);}
.bottom-cta h3{color:var(--accent-gold); font-size:1.1rem; margin-bottom:0.8rem;}
.bottom-cta p{color:var(--text-secondary); font-size:0.9rem; margin-bottom:1.2rem;}
.bottom-cta a{display:inline-block; background:var(--accent-gold); color:var(--bg-body); padding:0.7rem 1.8rem; border-radius:6px; font-weight:700; text-decoration:none; transition:all 0.3s;}
.bottom-cta a:hover{background:var(--accent-light); transform:translateY(-2px);}
.table-of-contents{background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); padding:1rem 1.5rem; margin:1.5rem 0 2rem; font-size:0.95rem;}
.table-of-contents summary{cursor:pointer; font-weight:600; color:var(--accent); padding:0.25rem 0; user-select:none; font-size:1.05rem;}
.table-of-contents summary::-webkit-details-marker{color:var(--accent);}
.table-of-contents[open] summary{margin-bottom:0.75rem;}
.table-of-contents nav ol{padding-left:1.5rem; margin:0;}
.table-of-contents nav ol li{margin:0.35rem 0;}
.table-of-contents nav ol li a{color:var(--text); text-decoration:none; transition:color var(--transition-fast);}
.table-of-contents nav ol li a:hover{color:var(--accent-light); text-decoration:underline;}
.related-articles{padding:1.2rem;}
.related-links a:hover{color:var(--accent-light); text-decoration:underline;}
#cookie-consent-banner{display:none; position:fixed; bottom:0; left:0; right:0; background:rgba(10,10,10,0.97); border-top:1px solid #333; padding:1rem 1.5rem; z-index:999999; backdrop-filter:blur(10px); text-align:center;}
#cookie-consent-banner p{color:#aaa; font-size:0.85rem; margin-bottom:0.8rem;}
#cookie-consent-banner .cookie-buttons{display:flex; gap:0.8rem; justify-content:center; flex-wrap:wrap;}
.blog-intro{text-align:center; padding:1.5rem 1rem; color:#888; font-size:1rem; margin-bottom:1rem;}
.post-card h2 a:hover{color:var(--accent-light);}
.post-card .post-meta span{margin-right:0.8rem;}
@media(max-width:600px){.container{padding:0 1rem 2rem;}.table-of-contents,.related-articles{padding:1rem;}}
"""

# ─── HTML Header Template ─────────────────────────────────────────────────

def make_head(slug, title, description, keywords, og_image, app_id=None, app_name=None, extra_schema=None):
    """Generate the <head> section for a blog article."""
    canonical = f"{BASE_URL}/blog/{slug}.html"
    og_img = f"{BASE_URL}/assets/images/blog/{slug}.png"
    tw_img = f"{BASE_URL}/assets/images/blog/{slug}.png"
    
    schema_article = json.dumps({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": og_img,
        "author": {"@type": "Person", "name": AUTHOR, "url": BASE_URL},
        "publisher": {"@type": "Organization", "name": "Cha0smagick Labs", "logo": {"@type": "ImageObject", "url": f"{BASE_URL}/assets/images/Banner.png"}},
        "datePublished": DATE_ISO,
        "dateModified": DATE_ISO,
        "mainEntityOfPage": {"@type": "WebPage", "@id": canonical},
        "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".blog-post p", ".blog-post h2", ".blog-post h3", ".blog-post li"]}
    }, separators=(',', ':'))
    
    head = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#050505">
<meta name="robots" content="index, follow">
<meta name="author" content="Cha0smagick Labs - {AUTHOR}">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="en" href="{canonical}">
<link rel="manifest" href="../manifest.json">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:type" content="article">
<meta property="og:image" content="{og_img}">
<meta property="og:locale" content="en">
<meta property="og:site_name" content="Cha0smagick Labs">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{tw_img}">
<link rel="icon" type="image/x-icon" href="../assets/favicon.ico">
<link rel="apple-touch-icon" href="../assets/images/Banner.png">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('consent',{{'analytics_storage':'denied'}});gtag('config','G-V6LHCPN9TK');</script>
<script type="application/ld+json">{schema_article}</script>
"""
    
    # HowTo schema for tutorial-style articles
    return head, og_img


def make_head_full(slug, title, description, keywords, og_image, steps=None, faqs=None):
    """Generate complete <head> with HowTo and FAQ schemas."""
    head, og_img = make_head(slug, title, description, keywords, og_image)
    canonical = f"{BASE_URL}/blog/{slug}.html"
    
    # Build HowTo schema if steps provided
    if steps:
        howto_steps = []
        for i, step in enumerate(steps, 1):
            howto_steps.append({
                "@type": "HowToStep",
                "position": i,
                "name": step["name"],
                "text": step["text"]
            })
        howto_schema = json.dumps({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": title,
            "description": description,
            "step": [{"@type": "HowToSection", "name": "Steps", "position": 1, "itemListElement": howto_steps}]
        }, separators=(',', ':'))
        head += f"<script type=\"application/ld+json\">{howto_schema}</script>\n"
    
    # FAQ schema if faqs provided
    if faqs:
        faq_items = []
        for q, a in faqs:
            faq_items.append({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a}
            })
        faq_schema = json.dumps({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq_items
        }, separators=(',', ':'))
        head += f"<script type=\"application/ld+json\">{faq_schema}</script>\n"
    
    return head, og_img


# ─── HTML Body Template ───────────────────────────────────────────────────

def make_body(slug, title, meta_line, toc_items, content_html, cta_boxes=None, faqs=None, related_links=None, share_url=None):
    """Generate the <body> content for a blog article."""
    if share_url is None:
        share_url = f"{BASE_URL}/blog/{slug}.html"
    
    body = f"""<header><p class="site-heading">Cha0smagick Labs Blog</p><p>Cybermancy Guides & Digital Occult Tutorials</p></header>
<nav aria-label="Main navigation">
    <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../index.html#about">About Us</a></li>
        <li><a href="../tools/">Free Tools</a></li>
        <li><a href="../index.html#products">Apps</a></li>
        <li><a href="../index.html#books-section">Books</a></li>
        <li><a href="index.html">Blog</a></li>
        <li><a href="../index.html#contact">Contact</a></li>
    </ul>
</nav>
<div class="breadcrumb"><a href="index.html">Community Blog</a> | {title}</div>
<main class="blog-post">
<article>
<div class="blog-nav"><a href="index.html">&larr; Back to Blog</a></div>

<picture><source srcset="../assets/images/blog/{slug}.webp" type="image/webp"><img src="../assets/images/blog/{slug}.png" alt="{title}" class="blog-featured-image" width="800" height="420" loading="eager" style="width:100%;max-width:800px;height:auto;border-radius:8px;margin-bottom:2rem;border:1px solid #333;"></picture>
<h1>{title}</h1>
<div class="meta">By {AUTHOR} | <time datetime="{DATE_ISO}">{DATE_STR}</time> | {meta_line}</div>

<details class="table-of-contents" open><summary>Table of Contents</summary><nav aria-label="Table of Contents"><ol>
"""
    
    for item in toc_items:
        body += f'<li><a href="#{item}">{item.replace("-", " ").title()}</a></li>\n'
    
    body += '</ol></nav></details>\n'
    body += content_html
    
    # CTA boxes
    if cta_boxes:
        for box in cta_boxes:
            body += f"""<div class="cta-box">
<p><strong>{box['title']}</strong></p>
<p>{box['desc']}</p>
<p><a href="{box['href']}">{box['cta_text']}</a></p>
</div>\n"""
    
    # FAQ section
    if faqs:
        body += '<h2>FAQ</h2>\n'
        for q, a in faqs:
            body += f'<h3>{q}</h3>\n<p>{a}</p>\n'
    
    # Related articles
    if related_links:
        body += '<section class="related-articles"><h2>Related Articles</h2><div class="related-links">\n'
        for link_text, link_url in related_links:
            body += f'<p><a href="{link_url}">{link_text}</a></p>\n'
        body += '</div></section>\n'
    
    # References
    body += '<h2>References</h2><ul>'
    
    # Share section
    body += """</ul>
<div class="share-section">
    <h3 style="text-align:center;color:#c5a059;margin-bottom:1.5rem;">Share This Article</h3>
    <div class="share-buttons">
"""
    
    # Social share buttons
    platforms = [
        ("Share on X", f"https://twitter.com/intent/tweet?text={title}&url={share_url}", "twitter"),
        ("Share on Reddit", f"https://www.reddit.com/submit?url={share_url}&title={title}", "reddit"),
        ("Share on Telegram", f"https://t.me/share/url?url={share_url}&text={title}", "telegram"),
        ("Share on Facebook", f"https://www.facebook.com/sharer/sharer.php?u={share_url}", "facebook"),
        ("Share on Pinterest", f"https://pinterest.com/pin/create/button/?url={share_url}&description={title}", "pinterest"),
    ]
    
    for label, url, platform in platforms:
        body += f"""        <a href="{url}" target="_blank" class="share-btn share-{platform}" title="{label}">
            <span>{label}</span>
        </a>
"""
    
    body += """    </div>
</div>

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
        <button onclick="switchLang('es')" title="Espa|ol" class="lang-btn"><img src="../assets/images/flags/es.svg" alt="Spanish" class="flag-icon"> ES</button>
    </div>
</div>
<div class="giscus-container" style="max-width:800px;margin:2rem auto;padding:0 1rem;">
    <div id="giscus-comments"></div>
</div>
<script src="https://giscus.app/client.js" data-repo="MagiaCaotica/43.-Web-cha0smagick-labs" data-repo-id="R_kgDOQ95-4g" data-category="General" data-category-id="DIC_kwDOQ95-4s4DCREq" data-mapping="pathname" data-strict="0" data-reactions-enabled="1" data-emit-metadata="0" data-input-position="top" data-theme="dark_dimmed" data-lang="en" data-loading="lazy" crossorigin="anonymous" async>
</script>
</body>
</html>"""
    
    return body


def make_full_html(slug, title, description, keywords, steps, faqs, content_html, meta_line=None, related_links=None, share_url=None):
    """Generate a complete HTML article."""
    if meta_line is None:
        meta_line = READ_TIME
    
    og_img = f"{BASE_URL}/assets/images/blog/{slug}.png"
    
    # Build full head with schemas
    canonical = f"{BASE_URL}/blog/{slug}.html"
    head, _ = make_head(slug, title, description, keywords, og_img)
    
    # Add HowTo schema
    if steps:
        howto_steps = []
        for i, step in enumerate(steps, 1):
            howto_steps.append({
                "@type": "HowToStep",
                "position": i,
                "name": step["name"],
                "text": step["text"]
            })
        howto_schema = json.dumps({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": title,
            "description": description,
            "step": [{"@type": "HowToSection", "name": "Steps", "position": 1, "itemListElement": howto_steps}]
        }, separators=(',', ':'))
        head += f"<script type=\"application/ld+json\">{howto_schema}</script>\n"
    
    # Add FAQ schema
    if faqs:
        faq_items = []
        for q, a in faqs:
            faq_items.append({
                "@type": "Question",
                "name": q,
                "acceptedAnswer": {"@type": "Answer", "text": a}
            })
        faq_schema = json.dumps({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faq_items
        }, separators=(',', ':'))
        head += f"<script type=\"application/ld+json\">{faq_schema}</script>\n"
    
    # Build the complete HTML
    head_section = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="theme-color" content="#050505">
<meta name="robots" content="index,follow">
<meta name="author" content="Cha0smagick Labs - {AUTHOR}">
<title>{title}</title>
<meta name="description" content="{description}">
<meta name="keywords" content="{keywords}">
<link rel="canonical" href="{canonical}">
<link rel="alternate" hreflang="en" href="{canonical}">
<link rel="manifest" href="../manifest.json">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{canonical}">
<meta property="og:type" content="article">
<meta property="og:image" content="{og_img}">
<meta property="og:locale" content="en">
<meta property="og:site_name" content="Cha0smagick Labs">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_img}">
<link rel="icon" type="image/x-icon" href="../assets/favicon.ico">
<link rel="apple-touch-icon" href="../assets/images/Banner.png">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('consent',{{'analytics_storage':'denied'}});gtag('config','G-V6LHCPN9TK');</script>
<script type="application/ld+json">{json.dumps({"@context":"https://schema.org","@type":"Article","headline":title,"description":description,"image":og_img,"author":{"@type":"Person","name":AUTHOR,"url":BASE_URL},"publisher":{"@type":"Organization","name":"Cha0smagick Labs","logo":{"@type":"ImageObject","url":f"{BASE_URL}/assets/images/Banner.png"}},"datePublished":DATE_ISO,"dateModified":DATE_ISO,"mainEntityOfPage":{"@type":"WebPage","@id":canonical},"speakable":{{"@type":"SpeakableSpecification","cssSelector":[".blog-post p",".blog-post h2",".blog-post h3",".blog-post li"]}}},separators=(',',':'))}</script>
"""
    
    if steps:
        howto_steps = []
        for i, step in enumerate(steps, 1):
            howto_steps.append({"@type": "HowToStep", "position": i, "name": step["name"], "text": step["text"]})
        howto_schema = json.dumps({"@context": "https://schema.org", "@type": "HowTo", "name": title, "description": description, "step": [{"@type": "HowToSection", "name": "Steps", "position": 1, "itemListElement": howto_steps}]}, separators=(',', ':'))
        head_section += f'<script type="application/ld+json">{howto_schema}</script>\n'
    
    if faqs:
        faq_items = [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]
        faq_schema = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq_items}, separators=(',', ':'))
        head_section += f'<script type="application/ld+json">{faq_schema}</script>\n'
    
    # CSS
    head_section += f'<style>{CRITICAL_CSS}</style>\n'
    head_section += '<link rel="preload" href="../css/style.min.css" as="style" onload="this.rel=\'stylesheet\'">\n<noscript><link rel="stylesheet" href="../css/style.min.css"></noscript>\n'
    head_section += '</head>\n'
    
    body_section = make_body(slug, title, meta_line, [], content_html, [], faqs, related_links, share_url)
    
    return head_section + body_section


print("Generator loaded successfully.")
print(f"Base dir: {BASE_DIR}")
print(f"Blog dir: {BLOG_DIR}")