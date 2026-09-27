#!/usr/bin/env python
"""Render blog articles from AUTHORED content records + derived specs.

Architecture (deliberate):
  content/<n>.json   -> SOURCE OF TRUTH for slug, h1, seo_title, description,
                         keywords, lede, sections, faq, sources, cta
  specs.json         -> supplies domain, blog_category, products, tools, og,
                         risk_note, intent, variant (the funnel + taxonomy)
  catalog.json       -> app/book/tool names, prices, links (never hardcoded)
  _template.json     -> the page chrome (head, style, header, footer)

The generator contains NO prose. Every sentence in the output body comes from a
content record, so two articles can never share text by construction.
"""
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")
CONTENT = os.path.join(HERE, "content")

SITE = "https://cha0smagicklabs.com"
AUTHOR = "Frater Alek0s"
LOGO = SITE + "/assets/images/logo.png"


def load(name):
    with open(os.path.join(HERE, name), "r", encoding="utf-8") as fh:
        return json.load(fh)


TPL = load("_template.json")
SPECS = {s["n"]: s for s in load("specs.json")}
CAT = load("catalog.json")
PROD = {}
for kind in ("apps", "books"):
    for item in CAT.get(kind, []):
        PROD[item["id"]] = dict(item, kind=kind)
TOOL = {t["id"]: t for t in CAT.get("tools", [])}


# ---------------------------------------------------------------- meta patching
def _esc_attr(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;")
            .replace(">", "&gt;").replace('"', "&quot;"))


def set_tag(html, pattern, value, attr="content"):
    """Replace the attr value inside the first tag matching pattern."""
    rx = re.compile(pattern, re.I | re.S)

    def sub(m):
        whole = m.group(0)
        if re.search(r'%s="' % attr, whole, re.I):
            return re.sub(r'(%s=")[^"]*(")' % attr,
                          lambda x: x.group(1) + _esc_attr(value) + x.group(2),
                          whole, count=1, flags=re.I)
        return whole

    out, n = rx.subn(sub, html, count=1)
    if n != 1:
        raise ValueError("meta patch missed: %s" % pattern)
    return out


def build_head1(c, spec, url, faq):
    h = TPL["head1"]
    title_tag = c["seo_title"]
    kw = ", ".join(c["keywords"])
    og = "%s/assets/images/blog/%s.png" % (SITE, spec["og"])
    date = c.get("published", "2026-09-26")

    h, n = re.subn(r"<title>.*?</title>",
                   "<title>%s | Cha0smagick Labs</title>" % _esc_attr(title_tag),
                   h, count=1, flags=re.I | re.S)
    if n != 1:
        raise ValueError("title patch missed")
    h = set_tag(h, r'<meta name="description"[^>]*>', c["description"])
    h = set_tag(h, r'<meta name="keywords"[^>]*>', kw)
    h = set_tag(h, r'<link rel="canonical"[^>]*>', url)
    h = set_tag(h, r'<link rel="alternate"[^>]*>', url)
    for prop in ("og:title", "og:description", "og:image", "og:url"):
        h = set_tag(h, r'<meta property="%s"[^>]*>' % prop, {
            "og:title": c["h1"], "og:description": c["description"],
            "og:image": og, "og:url": url}[prop])
    for name in ("twitter:title", "twitter:description", "twitter:image"):
        h = set_tag(h, r'<meta name="%s"[^>]*>' % name, {
            "twitter:title": c["h1"], "twitter:description": c["description"],
            "twitter:image": og}[name])
    h = set_tag(h, r'<meta property="article:published_time"[^>]*>', date)
    h = set_tag(h, r'<meta property="article:modified_time"[^>]*>', date)
    return h + ldjson_article(c, spec, url, faq) + ldjson_faq(faq, url)


def ldjson_article(c, spec, url, faq):
    data = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {"@type": "WebPage", "@id": url},
        "headline": c["h1"][:110],
        "description": c["description"],
        "image": [SITE + "/assets/images/blog/%s.png" % spec["og"]],
        "datePublished": c.get("published", "2026-09-26") + "T00:00:00+00:00",
        "dateModified": c.get("published", "2026-09-26") + "T00:00:00+00:00",
        "inLanguage": "en",
        "isAccessibleForFree": True,
        "wordCount": c.get("word_count", 0),
        "timeRequired": "PT%sM" % c.get("read_min", 20),
        "author": {"@type": "Person", "name": AUTHOR,
                   "url": SITE + "/blog/index.html"},
        "publisher": {"@type": "Organization", "name": "Cha0smagick Labs",
                      "logo": {"@type": "ImageObject", "url": LOGO,
                               "width": 512, "height": 512}},
    }
    if faq:
        data["mainEntity"] = {"@id": url + "#faq"}
    return ('\r\n<script type="application/ld+json">'
            + json.dumps(data, ensure_ascii=False) + "</script>")


def ldjson_faq(faq, url):
    if not faq:
        return ""
    data = {"@context": "https://schema.org", "@type": "FAQPage",
            "@id": url + "#faq", "mainEntity": [
                {"@type": "Question", "name": q,
                 "acceptedAnswer": {"@type": "Answer", "text": a}}
                for q, a in faq]}
    return ('\r\n<script type="application/ld+json">'
            + json.dumps(data, ensure_ascii=False) + "</script>")


def build_breadcrumb_ld(c, url):
    data = {"@context": "https://schema.org", "@type": "BreadcrumbList",
            "@id": url + "#breadcrumb", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Home",
                 "item": SITE + "/"},
                {"@type": "ListItem", "position": 2, "name": "Blog",
                 "item": SITE + "/blog/index.html"},
                {"@type": "ListItem", "position": 3,
                 "name": c["seo_title"] + " | Cha0smagick Labs", "item": url}]}
    return ('<script type="application/ld+json">'
            + json.dumps(data, ensure_ascii=False) + "</script>")


# ---------------------------------------------------------------- body markup
def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))


def para(t):
    return "<p>%s</p>" % esc(t)


def ol(items):
    return ("<ol>\r\n" + "\r\n".join("<li>%s</li>" % esc(i) for i in items)
            + "\r\n</ol>")


def ul(items):
    return ("<ul>\r\n" + "\r\n".join("<li>%s</li>" % esc(i) for i in items)
            + "\r\n</ul>")


def render_sections(sections):
    out = []
    for s in sections:
        out.append("<h2>%s</h2>" % esc(s["h2"]))
        for p in s.get("p", []):
            out.append(para(p))
        if s.get("ol"):
            out.append(ol(s["ol"]))
        if s.get("ul"):
            out.append(ul(s["ul"]))
        if s.get("html"):
            out.append(s["html"])
    return "\r\n".join(out)


def render_faq(faq):
    out = ["<h2>Frequently Asked Questions</h2>"]
    for q, a in faq:
        out.append("<h3>%s</h3>" % esc(q))
        out.append(para(a))
    return "\r\n".join(out)


def render_tail(c, spec):
    rel = "".join('<p><a href="../blog/%s.html">%s</a></p>\r\n' % (s, esc(t))
                  for s, t in c.get("related", []))
    apps = [PROD[i] for i in spec["products"] if i in PROD and PROD[i]["kind"] == "apps"]
    books = [PROD[i] for i in spec["products"] if i in PROD and PROD[i]["kind"] == "books"]
    tools = [TOOL[i] for i in spec.get("tools", []) if i in TOOL]
    rows = []
    if apps:
        links = " | ".join('<a href="../apps/%s.html">%s</a>' % (a["id"], esc(a["name"]))
                           for a in apps[:3])
        rows.append('<div style="margin-bottom: 1rem;">\r\n<strong style="color: var(--text-primary);">Apps:</strong> %s\r\n</div>' % links)
    if books:
        links = " | ".join('<a href="../books/%s.html">%s</a>' % (b["id"], esc(b["name"]))
                           for b in books[:3])
        rows.append('<div style="margin-bottom: 1rem;">\r\n<strong style="color: var(--text-primary);">Books:</strong> %s\r\n</div>' % links)
    if tools:
        links = " | ".join('<a href="../tools/%s.html">%s</a>' % (t["id"], esc(t.get("name", t["id"])))
                           for t in tools[:3])
        rows.append('<div>\r\n<strong style="color: var(--text-primary);">Free Tools:</strong> \r\n%s\r\n</div>' % links)
    return (
        '<section class="related-articles">\r\n        <h2>Related Articles</h2>\r\n'
        '        <div class="related-links">\r\n' + rel +
        '        </div>\r\n    </section>\r\n'
        '<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; '
        'background: var(--bg-card); border: 1px solid var(--border-subtle); '
        'border-radius: 8px;">\r\n<h3 style="color: var(--accent-gold); '
        'margin-bottom: 1rem;">Related Resources</h3>\r\n'
        + "\r\n".join(rows) +
        '\r\n</div>\r\n</section>\r\n</article>\r\n</main>')


def render(n):
    path = os.path.join(CONTENT, "%d.json" % n)
    if not os.path.exists(path):
        return None, "no content record"
    with open(path, "r", encoding="utf-8") as fh:
        c = json.load(fh)
    spec = SPECS.get(n)
    if spec is None:
        return None, "no spec"

    slug = c["slug"]
    url = "%s/blog/%s.html" % (SITE, slug)
    faq = [(q, a) for q, a in c.get("faq", [])]

    body_words = sum(len(p.split()) for s in c["sections"] for p in s.get("p", []))
    body_words += sum(len(i.split()) for s in c["sections"] for i in s.get("ol", []) + s.get("ul", []))
    body_words += sum(len(a.split()) for _, a in faq)
    c["word_count"] = body_words
    c["read_min"] = max(6, round(body_words / 220.0))

    head1 = build_head1(c, spec, url, faq)
    header = re.sub(r'(<a href="index\.html">Blog</a> \u2b3a )[^\r\n<]*',
                    lambda m: m.group(1) + esc(c["h1"]), TPL["bodyHeader"])
    meta = ('<div class="meta">By %s \u2b22 <time datetime="%s">%s</time> \u2b22 %d min read</div>'
            % (AUTHOR, c.get("published", "2026-09-26"),
               c.get("published_human", "September 26, 2026"), c["read_min"]))

    parts = [head1, TPL["style"], TPL["gtag"], "\r\n", build_breadcrumb_ld(c, url),
             "\r\n", TPL["cssLink"], "\r\n</head>\r\n", header,
             '<main class="blog-post">\r\n<article>\r\n    <h1>%s</h1>\r\n    ' % esc(c["h1"]),
             meta, "\r\n", para(c["lede"]),
             render_sections(c["sections"]), "\r\n",
             render_faq(faq) if faq else "", "\r\n",
             render_tail(c, spec), TPL["footer"]]

    out = "".join(parts)
    dest = os.path.join(BLOG, slug + ".html")
    with open(dest, "w", encoding="utf-8", newline="") as fh:
        fh.write(out)
    return dest, body_words


def main():
    only = [int(x) for x in sys.argv[1:] if x.isdigit()]
    targets = only or sorted(SPECS)
    ok = miss = 0
    words = []
    for n in targets:
        dest, info = render(n)
        if dest is None:
            miss += 1
            continue
        ok += 1
        if isinstance(info, int):
            words.append(info)
    print("rendered %d | missing content records %d" % (ok, miss))
    if words:
        print("body words: min %d max %d mean %d"
              % (min(words), max(words), sum(words) // len(words)))


if __name__ == "__main__":
    main()
