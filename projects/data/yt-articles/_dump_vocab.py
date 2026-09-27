# -*- coding: utf-8 -*-
"""Dump the exact parenthetical vocabulary + the servitor titles that still
fail entity extraction, so the mapping tables can be built from real data."""
import io
import json
import os
import re
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

import build_specs as B  # noqa: E402

with io.open(os.path.join(ROOT, "projects", "research",
                          "yt_videos_classified.json"), encoding="utf-8") as f:
    vids = json.load(f)

print("=== do titles carry the leading number? ===")
for v in vids[:5]:
    print("  n=%s  title=%r" % (v.get("n"), v["title"]))

print("\n=== ALL 56 parentheticals (verbatim) ===")
pars = []
for v in vids:
    for m in re.finditer(r"\(([^)]*)\)", v["title"]):
        pars.append(m.group(1).strip())
for p in sorted(set(pars)):
    print("   %-34s x%d" % (p, sum(1 for q in pars if q == p)))

print("\n=== servitors with NO entity (verbatim) ===")
c = 0
for v in vids:
    if v.get("cluster") != "servitors":
        continue
    if not B.extract_entity(v["title"]):
        c += 1
        print("   %r" % v["title"])
print("   total:", c)

print("\n=== titles containing an ALL-CAPS token (any position, len>=3, no digits) ===")
caps_tokens = Counter()
for v in vids:
    for w in re.findall(r"[A-ZÁÉÍÓÚÑÜ]{3,}", v["title"]):
        caps_tokens[w] += 1
for w, n in caps_tokens.most_common(200):
    print("   %-22s %d" % (w, n))
