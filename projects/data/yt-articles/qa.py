"""QA gate for one or more rendered YouTube-derived articles.

Usage:  python qa.py [n ...]        (no args = every content record present)

Checks, per article:
  * slop.scan_article violations (banned AI-tell phrases, connector starts,
    em-dash density, not-only-both, word floor, FAQ answer length, forbidden H2s)
  * structure: </head> present, ends </html>, <article>/<main>/<body>/<html>/<footer>
    tag balance, U+FFFD count, ld+json block count, visible word count, H2 count
  * integration: canonical + og:url point at the right slug, og:image file
    exists on disk, every related slug resolves to a real blog file,
    internal app/book/tool hrefs resolve to real page files
  * corpus level (2+ articles): reused H2s, reused 8-grams, reused openings
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")
SITE = "https://cha0smagicklabs.com"

sys.path.insert(0, HERE)
import gen_yt_articles as G  # noqa: E402
import slop  # noqa: E402

TAGS = ("html", "head", "body", "main", "article", "footer")


def check_one(n):
    dest, body_words = G.render(n)
    rec = json.load(open(os.path.join(HERE, "content", "%d.json" % n), encoding="utf-8"))
    html = open(dest, encoding="utf-8").read()
    problems = []

    viol = slop.scan_article(html)
    if viol:
        problems.append("slop: %s" % viol)

    if "</head>" not in html:
        problems.append("missing </head>")
    if not html.rstrip().endswith("</html>"):
        problems.append("does not end </html>")
    for t in TAGS:
        o = len(re.findall(r"<%s[\s>]" % t, html))
        c = html.count("</%s>" % t)
        if o != c:
            problems.append("unbalanced <%s> open=%d close=%d" % (t, o, c))
    if "\ufffd" in html:
        problems.append("U+FFFD x%d" % html.count("\ufffd"))
    if html.count("application/ld+json") != 4:
        problems.append("ld+json count=%d (want 4)" % html.count("application/ld+json"))
    if "youtube-nocookie.com/embed/" not in html:
        problems.append("source video embed missing")
    if '"@type": "VideoObject"' not in html:
        problems.append("VideoObject ld+json missing")

    slug = rec["slug"]
    canon = "%s/blog/%s.html" % (SITE, slug)
    if canon not in html:
        problems.append("canonical missing/wrong")
    m = re.search(r'property="og:image" content="([^"]+)"', html)
    if not m:
        problems.append("no og:image")
    else:
        p = os.path.join(ROOT, m.group(1).replace("https://cha0smagicklabs.com/", "").replace("/", os.sep))
        if not os.path.exists(p):
            problems.append("og:image file missing: %s" % os.path.basename(p))

    for s, _t in rec.get("related", []):
        if not os.path.exists(os.path.join(BLOG, s + ".html")):
            problems.append("related slug not found: %s" % s)
    for href in re.findall(r'href="\.\./(apps|books|tools)/([^"]+)\.html"', html):
        kind, pid = href
        if not os.path.exists(os.path.join(ROOT, kind, pid + ".html")):
            problems.append("internal %s link missing: %s" % (kind, pid))

    vis = len(slop.words(slop.visible_text(html)))
    return dest, slug, vis, body_words, len(slop.h2s(html)), problems


def main():
    ns = [int(a) for a in sys.argv[1:]]
    if not ns:
        cdir = os.path.join(HERE, "content")
        ns = sorted(int(f[:-5]) for f in os.listdir(cdir) if f.endswith(".json"))
    recs = {}
    for n in ns:
        recs[n] = json.load(open(os.path.join(HERE, "content", "%d.json" % n), encoding="utf-8"))

    pairs, fails = [], 0
    for n in ns:
        dest, slug, vis, bw, nh2, probs = check_one(n)
        pairs.append((slug, open(dest, encoding="utf-8").read()))
        status = "PASS" if not probs else "FAIL"
        if probs:
            fails += 1
        print("[%s] n=%-4d %-46s words=%-5d h2=%-3d" % (status, n, slug, vis, nh2))
        for p in probs:
            print("        - %s" % p)

    if len(pairs) > 1:
        r = slop.scan_corpus(pairs)
        print("\nCORPUS (%d articles)" % len(pairs))
        for k in ("reused_h2", "reused_ngrams", "reused_opening"):
            v = r.get(k)
            if v:
                fails += 1
                items = list(v.items())[:8] if isinstance(v, dict) else list(v)[:8]
                print("  %s: %d -> %s" % (k, len(v), items))
            else:
                print("  %s: none" % k)
    print("\n%s  (%d article(s), %d failing)" % ("ALL GREEN" if not fails else "FAILURES PRESENT", len(pairs), fails))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
