"""Print the FULL duplicate-8-gram and duplicate-H2 lists from qa.py's corpus scan."""
import re
import slop
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CDIR = os.path.join(HERE, "content")
BLOG = os.path.abspath(os.path.join(HERE, "..", "..", "..", "blog"))

ns = sorted(
    int(f[:-5])
    for f in os.listdir(CDIR)
    if f.endswith(".json") and not f.startswith("_")
)
pairs = []
for n in ns:
    rec = json.load(open(os.path.join(CDIR, "%d.json" % n), encoding="utf-8"))
    slug = rec["slug"]
    p = os.path.join(BLOG, slug + ".html")
    if not os.path.exists(p):
        continue
    pairs.append((slug, open(p, encoding="utf-8").read()))

r = slop.scan_corpus(pairs)
n2s = {}
for n, slug in enumerate(ns):
    pass

print("H2:", len(r["reused_h2"]))
for h in r["reused_h2"]:
    print("  H", h)
print("NGRAMS:", len(r["reused_ngrams"]))
for g in r["reused_ngrams"]:
    print("  G", g)
print("OPENINGS:", r["reused_opening"])
