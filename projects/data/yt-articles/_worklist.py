"""Emit the worklist of specs that still need an authored content record.

Writes `content/_worklist.json` (n, slug, h1, domain, intent, entity) for
every spec without a valid content/<n>.json, plus a `batches` split of 26
articles each so the work can be fanned out or worked through sequentially.
Ordering follows spec n so batches stay stable across runs.
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")
OUT = os.path.join(CONTENT, "_worklist.json")

REQUIRED = ("n", "slug", "h1", "seo_title", "description", "keywords",
            "published", "published_human", "lede", "sections", "faq", "related")

BATCH = 26


def valid(n):
    p = os.path.join(CONTENT, "%d.json" % n)
    if not os.path.exists(p):
        return False
    try:
        obj = json.load(open(p, encoding="utf-8"))
    except Exception:
        return False
    return isinstance(obj, dict) and all(k in obj for k in REQUIRED)


def main():
    specs = json.load(open(os.path.join(HERE, "specs.json"), encoding="utf-8"))
    if isinstance(specs, dict):
        specs = list(specs.values())
    todo = []
    for s in sorted(specs, key=lambda x: int(x["n"])):
        n = int(s["n"])
        if valid(n):
            continue
        todo.append({
            "n": n,
            "slug": s.get("slug"),
            "h1": s.get("h1"),
            "domain": s.get("domain"),
            "domain_label": s.get("domain_label"),
            "intent": s.get("intent"),
            "blog_category": s.get("blog_category"),
            "entity": s.get("entity"),
            "entity_source": s.get("entity_source"),
            "focus": s.get("focus"),
            "outline": s.get("outline"),
            "facts": s.get("facts"),
            "spec_faq": s.get("faq"),
            "products": s.get("products"),
            "tools": s.get("tools"),
            "source_url": s.get("source_url"),
            "risk": s.get("risk"),
            "risk_note": s.get("risk_note"),
            "variant_phrase": s.get("variant_phrase"),
            "role_phrase": s.get("role_phrase"),
            "subject": s.get("subject"),
            "title_tag": s.get("title_tag"),
            "seo_title": s.get("seo_title"),
            "description": s.get("description"),
            "keywords": s.get("keywords"),
        })
    batches = [todo[i:i + BATCH] for i in range(0, len(todo), BATCH)]
    doc = {
        "total": len(specs),
        "done": len(specs) - len(todo),
        "remaining": len(todo),
        "batch_size": BATCH,
        "batch_count": len(batches),
        "batches": [{"index": i + 1, "ns": [x["n"] for x in b], "count": len(b)}
                    for i, b in enumerate(batches)],
        "articles": todo,
    }
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2, ensure_ascii=False)
    print("wrote %s" % OUT)
    print("done %d | remaining %d | batches %d of %d"
          % (doc["done"], doc["remaining"], doc["batch_count"], BATCH))
    for b in doc["batches"]:
        print("  batch %2d  n=%s" % (b["index"], b["ns"]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
