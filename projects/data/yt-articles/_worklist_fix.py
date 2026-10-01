#!/usr/bin/env python3
"""Rebuild `content/_worklist.json` so it reflects what is actually on disk.

The worklist was generated once at 77/349 and never refreshed, so it still listed
272 pending articles of which 127 have since been authored. This recomputes the
pending set from `specs.json` plus the presence of `content/<n>.json`, and
carries over every spec field the old file held so downstream batch tooling keeps
working.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

HERE = pathlib.Path(__file__).resolve().parent
CONTENT = HERE / "content"
WL = CONTENT / "_worklist.json"
BATCH_SIZE = 26

KEEP = [
    "n", "slug", "h1", "domain", "domain_label", "intent", "blog_category",
    "entity", "entity_source", "focus", "outline", "facts", "spec_faq",
    "products", "tools", "source_url", "risk", "risk_note", "variant_phrase",
    "role_phrase", "subject", "title_tag", "seo_title", "description", "keywords",
]


def main() -> None:
    old = json.loads(WL.read_text(encoding="utf-8"))
    old_by_n = {int(a["n"]): a for a in old.get("articles", [])}

    specs = json.loads((HERE / "specs.json").read_text(encoding="utf-8"))
    specs = sorted(specs, key=lambda s: int(s["n"]))

    pending: list[dict] = []
    done = 0
    for s in specs:
        n = int(s["n"])
        if (CONTENT / f"{n}.json").exists():
            done += 1
            continue
        rec = dict(old_by_n.get(n, {}))
        for key in KEEP:
            if key not in rec and key in s:
                rec[key] = s[key]
        for key in ("n", "slug", "h1"):
            if key not in rec and key in s:
                rec[key] = s[key]
        rec["n"] = n
        pending.append(rec)

    count = (len(pending) + BATCH_SIZE - 1) // BATCH_SIZE
    batches = [
        pending[i * BATCH_SIZE:(i + 1) * BATCH_SIZE] for i in range(count)
    ]

    out = {
        "total": len(specs),
        "done": done,
        "remaining": len(pending),
        "batch_size": BATCH_SIZE,
        "batch_count": len(batches),
        "batches": batches,
        "articles": pending,
        "generated": "2026-10-01",
        "note": (
            "Rebuilt from specs.json against content/*.json on disk. 'articles' "
            "is the pending set in ascending n; 'batches' is the same list "
            "chunked by batch_size."
        ),
    }
    WL.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"total={out['total']} done={out['done']} remaining={out['remaining']} "
          f"batches={out['batch_count']}")
    missing_meta = [a["n"] for a in pending if "slug" not in a]
    print(f"pending entries missing slug/h1 metadata: {len(missing_meta)} {missing_meta[:10]}")
    ns = [a["n"] for a in pending]
    print(f"pending n: {ns}")


if __name__ == "__main__":
    main()
