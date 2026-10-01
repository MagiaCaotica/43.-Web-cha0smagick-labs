import json, os, re, sys

os.chdir(r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs")
NS = [int(x) for x in sys.argv[1:]] or [143, 144, 145, 146, 189, 190]

GLOBE = 'class="lang-globe"'
for n in NS:
    slug = json.load(open("projects/data/yt-articles/content/%d.json" % n, encoding="utf-8"))["slug"]
    p = "blog/%s.html" % slug
    b = open(p, encoding="utf-8").read()
    checks = {
        "ldjson4": b.count("application/ld+json") == 4,
        "globe1": b.count(GLOBE) == 1,
        "langleft": "left:0;right:auto" in b,
        "afstart": "align-items:flex-start !important" in b,
        "cmt_before_footer": 0 < b.find('section id="comments"') < b.rfind("<footer"),
        "giscus": "giscus" in b,
        "RR1": b.count("Related Resources") == 1,
        "fffd0": "\ufffd" not in b,
        "mojibake": "\u00c3\u00a9" not in b and "\u00ef\u00bf\u00bd" not in b,
        "embed": "youtube.com/embed/" in b,
        "videoobj": '"@type": "VideoObject"' in b,
        "canonical": 'https://cha0smagicklabs.com/blog/%s.html' % slug in b,
        "ends": b.rstrip().endswith("</html>"),
    }
    bad = [k for k, v in checks.items() if not v]
    print(("%-46s" % slug[:44]), "OK" if not bad else "FAIL " + ",".join(bad))
