"""Locate the exact strings that make the current corpus fail its gates.

qa.py reports corpus-level violations without naming every file, so this
resolves each reported offender to a file:line list, plus the nearest
`blog/<slug>.html` that is missing for a dangling `related` entry.

Usage:  python _locate_failures.py
"""
from __future__ import annotations

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")
CONTENT = os.path.join(HERE, "content")

sys.path.insert(0, HERE)
import slop  # noqa: E402
import gen_yt_articles as G  # noqa: E402

# The offenders qa.py reported for the 77-article corpus.
NGRAMS = (
    "and it is the only version of the",
    "and it is worth naming because it is",
)
H2S = (
    "consistency is not prediction",
    "five ways this goes wrong",
)


def main():
    ns = sorted(int(fn[:-5]) for fn in os.listdir(CONTENT) if fn.endswith(".json"))
    print("== corpus n-gram offenders (raw json, case-insensitive) ==")
    for g in NGRAMS:
        hits = [n for n in ns
                if g in open(os.path.join(CONTENT, "%d.json" % n), encoding="utf-8").read().lower()]
        print("  %-46s %s" % (repr(g), hits))
        for n in hits:
            rec = json.load(open(os.path.join(CONTENT, "%d.json" % n), encoding="utf-8"))
            body = json.dumps(rec, ensure_ascii=False)
            for m in re.finditer(re.escape(g), body, re.I):
                s = max(0, m.start() - 110)
                print("       n=%-4d ...%s..." % (n, body[s:m.end() + 110].replace("\n", " ")))

    print("\n== corpus H2 offenders (rendered html) ==")
    for h in H2S:
        rows = []
        for n in ns:
            rec = json.load(open(os.path.join(CONTENT, "%d.json" % n), encoding="utf-8"))
            for i, s in enumerate(rec.get("sections", [])):
                if s.get("h2", "").strip().lower() == h:
                    rows.append((n, i, rec["slug"], s["h2"]))
        print("  %-34s %s" % (repr(h), [(r[0], "sec#%d" % r[1]) for r in rows]))
        for r in rows:
            print("       n=%-4d sec#%-3d slug=%s" % (r[0], r[1], r[2]))

    print("\n== dangling related slugs ==")
    for n in ns:
        rec = json.load(open(os.path.join(CONTENT, "%d.json" % n), encoding="utf-8"))
        for slug, title in rec.get("related", []):
            if not os.path.exists(os.path.join(BLOG, slug + ".html")):
                near = [f[:-5] for f in os.listdir(BLOG) if "divin" in f.lower()]
                print("  n=%-4d %s  (title=%r)" % (n, slug, title))
                print("       blog files containing 'divin': %s" % sorted(near)[:12])

    print("\n== banned phrase sweep across content json ==")
    for n in ns:
        rec = json.load(open(os.path.join(CONTENT, "%d.json" % n), encoding="utf-8"))
        body = json.dumps(rec, ensure_ascii=False)
        for p in slop.BANNED_PHRASES:
            for m in re.finditer(re.escape(p), body, re.I):
                s = max(0, m.start() - 90)
                print("  n=%-4d %-22r ...%s..." % (n, p, body[s:m.end() + 90]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
