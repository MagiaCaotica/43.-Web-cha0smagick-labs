import json, os, urllib.parse

ROOT = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"
BLOG_DIR = os.path.join(ROOT, "blog")
BASE_URL = "https://cha0smagicklabs.com/blog"

FOOTER_HTML = """<footer id="site-footer" class="site-footer">
    <div class="footer-grid">
        <div class="footer-section"><h4>Cha0smagick Labs</h4><p>Explore the Art and Practice of Chaos Magick.</p><p>Corporate Cybermancy Solutions — since 2025.</p></div>
        <div class="footer-section"><h4>Quick Links</h4><ul><li><a href="../index.html">Home</a></li><li><a href="../index.html#about">About</a></li><li><a href="../index.html#products">Premium Apps</a></li><li><a href="../tools/">Free Tools</a></li><li><a href="index.html">Blog</a></li><li><a href="../best-occult-apps-android.html">Best Occult Apps</a></li><li><a href="../glossary.html">Glossary</a></li></ul></div>
        <div class="footer-section"><h4>Community</h4><ul><li><a href="https://t.me/magiacaotica" target="_blank">Telegram</a></li><li><a href="https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA" target="_blank">YouTube</a></li><li><a href="https://www.instagram.com/cha0smagick.labs/" target="_blank">Instagram</a></li><li><a href="https://discord.gg/6vNSCaPgPd" target="_blank">Discord</a></li></ul></div>
        <div class="footer-section"><h4>Legal</h4><ul><li><a href="../privacy-policy.html">Privacy Policy</a></li><li><a href="../index.html#contact">Contact</a></li></ul></div>
        <div class="footer-section footer-visitor"><h4>Visitor Count</h4><div class="visitor-count">Visitors: <span id="visitor-count">000000</span></div></div>
    </div>
    <div class="footer-bottom"><p>&copy; 2026 Cha0smagick Labs — Corporate Cybermancy Solutions</p></div>
</footer>"""

LANG_SIDEBAR_HTML = """<div id="lang-sidebar" class="lang-sidebar">
    <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">&#x1f310;</button>
    <div id="lang-flag-list" class="lang-flag-list">
        <button onclick="switchLang('en')" title="English" class="lang-btn"><img src="../assets/images/flags/gb.svg" alt="" class="flag-icon"> EN</button>
        <button onclick="switchLang('es')" title="Espanol" class="lang-btn"><img src="../assets/images/flags/es.svg" alt="" class="flag-icon"> ES</button>
        <button onclick="switchLang('fr')" title="Francais" class="lang-btn"><img src="../assets/images/flags/fr.svg" alt="" class="flag-icon"> FR</button>
        <button onclick="switchLang('de')" title="Deutsch" class="lang-btn"><img src="../assets/images/flags/de.svg" alt="" class="flag-icon"> DE</button>
        <button onclick="switchLang('it')" title="Italiano" class="lang-btn"><img src="../assets/images/flags/it.svg" alt="" class="flag-icon"> IT</button>
        <button onclick="switchLang('pt')" title="Portugues" class="lang-btn"><img src="../assets/images/flags/pt.svg" alt="" class="flag-icon"> PT</button>
        <button onclick="switchLang('ru')" title="Russkiy" class="lang-btn"><img src="../assets/images/flags/ru.svg" alt="" class="flag-icon"> RU</button>
        <button onclick="switchLang('ja')" title="Nihongo" class="lang-btn"><img src="../assets/images/flags/jp.svg" alt="" class="flag-icon"> JP</button>
        <button onclick="switchLang('zh-CN')" title="Zhongwen" class="lang-btn"><img src="../assets/images/flags/cn.svg" alt="" class="flag-icon"> ZH</button>
    </div>
</div>"""

COOKIE_BANNER = """<div id="cookie-consent-banner">
    <p>This site uses cookies for analytics. <a href="../privacy-policy.html" style="color:#ffd700;">Learn more</a></p>
    <div class="cookie-buttons">
        <button class="cookie-btn-accept" onclick="acceptCookies()">Accept</button>
        <button class="cookie-btn-decline" onclick="declineCookies()">Decline</button>
    </div>
</div>"""

GTAG = """<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{'analytics_storage':'denied'});gtag('config','G-V6LHCPN9TK');</script>"""

HEADER_HTML = """<header>
    <div class="header-content">
        <a href="../index.html" class="header-link">
            <picture><source srcset="../assets/images/Banner.webp" type="image/webp">
            <img class="header-logo" src="../assets/images/Banner.png" alt="Cha0smagick Labs Logo" width="200" height="200" loading="eager"></picture>
            <span class="site-title">CHA0SMAGICK LABS</span>
        </a>
        <p>Explore the Art and Practice of Chaos Magick</p>
    </div>
</header>"""

NAV_HTML = """<nav><ul>
    <li><a href="../index.html">Home</a></li>
    <li><a href="../index.html#about">About Us</a></li>
    <li><a href="../index.html#products">Premium Apps</a></li>
    <li><a href="../tools/">Free Tools</a></li>
    <li><a href="index.html">Blog</a></li>
    <li><a href="../glossary.html">Glossary</a></li>
    <li><a href="../best-occult-apps-android.html">Best Apps</a></li>
    <li><a href="../complete-chaos-magick-bundle.html">Bundle</a></li>
</ul></nav>"""

def gen(slug, title, meta_desc, h1, content, faqs=None, keywords=""):
    canonical = BASE_URL + "/" + slug + ".html"
    og = title.split(" | ")[0] if " | " in title else title
    short = og[:40]
    sa = json.dumps({"@context":"https://schema.org","@type":"Article","headline":h1,"description":meta_desc[:200],"image":"https://cha0smagicklabs.com/assets/images/blog/"+slug+".png","author":{"@type":"Person","name":"Frater Alek0s"},"datePublished":"2026-07-16","dateModified":"2026-07-16","publisher":{"@type":"Organization","name":"Cha0smagick Labs","url":"https://cha0smagicklabs.com"}}, ensure_ascii=False)
    sf = ""
    fh = ""
    if faqs:
        ql = [{"@type":"Question","name":q["q"],"acceptedAnswer":{"@type":"Answer","text":q["a"]}} for q in faqs]
        sf = '\n<script type="application/ld+json">\n'+json.dumps({"@context":"https://schema.org","@type":"FAQPage","mainEntity":ql},ensure_ascii=False)+'\n</script>'
        fh = '\n<h2>Frequently Asked Questions</h2>\n'
        for q in faqs:
            fh += '<h3>'+q["q"]+'</h3>\n<p>'+q["a"]+'</p>\n\n'
    km = '\n<meta name="keywords" content="'+keywords+'">' if keywords else ""
    t = urllib.parse.quote(og)
    u = BASE_URL + "/" + slug + ".html"
    sh = '<div class="share">\n<p>Share this guide:\n<a href="https://twitter.com/intent/tweet?text='+t+'&url='+u+'" target="_blank">Twitter</a>\n<a href="https://www.facebook.com/sharer/sharer.php?u='+u+'" target="_blank">Facebook</a>\n<a href="https://www.reddit.com/submit?url='+u+'&title='+t+'" target="_blank">Reddit</a>\n&middot; <a href="index.html">Back to Blog</a> &middot; <a href="../index.html">Back to Home</a>\n</p>\n</div>'
    
    html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<meta name="theme-color" content="#050505">\n<meta name="robots" content="index, follow">\n<title>'+title+'</title>\n<meta name="description" content="'+meta_desc[:160]+'">'+km+'\n<link rel="canonical" href="'+canonical+'">\n<link rel="alternate" href="'+canonical+'" hreflang="en">\n<link rel="alternate" href="'+canonical+'" hreflang="x-default">\n<link rel="manifest" href="../manifest.json">\n<meta property="og:title" content="'+og[:60]+'">\n<meta property="og:description" content="'+meta_desc[:160]+'">\n<meta property="og:url" content="'+canonical+'">\n<meta property="og:type" content="article">\n<meta property="og:image" content="https://cha0smagicklabs.com/assets/images/blog/'+slug+'.png">\n<meta name="twitter:card" content="summary_large_image">\n<link rel="stylesheet" href="../css/style.css">\n'+GTAG+'\n<script type="application/ld+json">\n'+sa+'\n</script>'+sf+'\n</head>\n<body>\n'+HEADER_HTML+'\n'+NAV_HTML+'\n<nav class="breadcrumb-nav">\n    <ol class="breadcrumb-list">\n        <li><a href="../index.html">Home</a></li>\n        <li><a href="index.html">Blog</a></li>\n        <li><span aria-current="page">'+short+'</span></li>\n    </ol>\n</nav>\n<main class="blog-post">\n<article class="article">\n<div class="blog-nav"><a href="index.html">&larr; Back to Blog</a></div>\n<picture>\n    <source srcset="../assets/images/blog/'+slug+'.webp" type="image/webp">\n    <img src="../assets/images/blog/'+slug+'.png" alt="'+og+'" class="blog-featured-image" width="800" height="420" loading="eager">\n</picture>\n<h1>'+h1+'</h1>\n<div class="meta">By Frater Alek0s &bull; <time datetime="2026-07-16">July 16, 2026</time> &bull; 12 min read</div>\n\n'+content+'\n\n'+fh+sh+'\n</article>\n</main>\n'+FOOTER_HTML+'\n<div id="google_translate_element" style="display:none;"></div>\n<script src="../js/shared.js"></script>\n'+LANG_SIDEBAR_HTML+'\n'+COOKIE_BANNER+'\n</body>\n</html>'
    return html

def write_article(slug, html):
    p = os.path.join(BLOG_DIR, slug+".html")
    with open(p, "w", encoding="utf-8") as f:
        f.write(html)
    print("  OK", slug)

print("Generator functions loaded successfully")
