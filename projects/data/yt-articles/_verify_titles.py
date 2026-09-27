# -*- coding: utf-8 -*-
"""Verify titles.extract_entity / split_subtitle across all 349 titles.
Prints only the rows that need a human decision (empty entity, or an entity
that looks like a stray English/Spanish common word)."""
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

import titles as T  # noqa: E402

with io.open(os.path.join(ROOT, "projects", "research",
                          "yt_videos_classified.json"), encoding="utf-8") as f:
    vids = json.load(f)

rows = []
for v in vids:
    rows.append((v.get("cluster", ""), v["title"],
                 T.extract_entity(v["title"]), T.extract_subtitle(v["title"])))

n_ent = sum(1 for r in rows if r[2])
print("total: %d | with entity: %d | topic: %d" % (len(rows), n_ent, len(rows) - n_ent))

print("\n########## ENTITY EXTRACTED (all %d) ##########" % n_ent)
for cl, t, e, s in rows:
    if e:
        print("%-22s | %-26s | %s" % (e[:26], cl[:20], t[:64]))

print("\n########## NO ENTITY (all %d) ##########" % (len(rows) - n_ent))
for cl, t, e, s in rows:
    if not e:
        print("%-20s | %s" % (cl[:20], t[:80]))
