# -*- coding: utf-8 -*-
"""Audit resolve_domain / extract_entity against the real titles."""
import io
import json
import os
import sys
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)

import build_specs as B  # noqa: E402

with io.open(os.path.join(ROOT, "projects", "research",
                          "yt_videos_classified.json"), encoding="utf-8") as f:
    vids = json.load(f)

print("total videos:", len(vids))

n_paren = sum(1 for v in vids if "(" in v["title"])
print("titles containing '(':", n_paren)
n_allcaps_lead = 0
for v in vids:
    t = v["title"]
    t2 = B.re.sub(r"^\s*(?:\d+[a-z]?\s+)+", "", t)
    head = t2.split("(")[0].strip()
    w = head.split()
    if w and w[0].upper() == w[0] and len(w[0]) > 1 and w[0].isalpha():
        n_allcaps_lead += 1
print("titles with a leading ALL-CAPS first token:", n_allcaps_lead)

# override table reachability
hit = 0
miss = []
for v in vids:
    k = B.ascii_lower(v["title"])
    k2 = B.re.sub(r"^\d+\s*", "", k).strip()
    found = None
    for cand in (k, k2, B.re.sub(r"\b\d+x\b\s*", "", k2).strip()):
        if cand and cand in B.TITLE_OVERRIDES:
            found = cand
            break
    if found:
        hit += 1
    else:
        miss.append(v["title"])
print("\noverride keys: %d | videos hitting an override: %d | missing: %d"
      % (len(B.TITLE_OVERRIDES), hit, len(miss)))
print("\n--- 40 override entries that no video reaches (dead keys) ---")
reached = set()
for v in vids:
    k = B.ascii_lower(v["title"])
    k2 = B.re.sub(r"^\d+\s*", "", k).strip()
    for cand in (k, k2, B.re.sub(r"\b\d+x\b\s*", "", k2).strip()):
        if cand and cand in B.TITLE_OVERRIDES:
            reached.add(cand)
dead = [x for x in B.TITLE_OVERRIDES if x not in reached]
for d in dead[:40]:
    print("   ", d)

print("\n--- entity extraction on the 90 cluster=servitors videos ---")
ok = 0
bad = []
for v in vids:
    if v.get("cluster") != "servitors":
        continue
    e = B.extract_entity(v["title"])
    if e:
        ok += 1
    else:
        bad.append(v["title"])
print("servitors with entity:", ok, " without:", len(bad))
for b in bad[:25]:
    print("   NO-ENTITY:", b)

print("\n--- suspicious: entity extracted but domain is not entity-shaped ---")
ENTITYISH = {"entity-lore", "servitor-craft", "goetia-demons", "money-pact",
             "binding-relationships", "astral-parasites", "creatures-vampire"}
susp = []
for i, v in enumerate(vids):
    dom, how = B.resolve_domain(v, i)
    e = B.extract_entity(v["title"])
    if e and dom not in ENTITYISH:
        susp.append((v["title"], e, dom, how))
print("count:", len(susp))
for t, e, d, h in susp[:35]:
    print("   %-52s -> %-16s [%s/%s]" % (t[:52], e, d, h))
