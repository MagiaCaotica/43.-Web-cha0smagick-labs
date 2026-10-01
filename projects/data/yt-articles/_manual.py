#!/usr/bin/env python3
"""Six rewrites that sentence indexing could not attribute, so they get their own patch.

Each is a plain field in a content record, but the shared 8-gram starts inside the
structural H2 "Frequently Asked Questions" or spans a sentence boundary that the
indexer resolved to a virtual target. Exact-string replacement, one occurrence
asserted per edit.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

CONTENT = pathlib.Path(__file__).resolve().parent / "content"

EDITS = [
    (9, "Do I have to believe in chaos magic for it to work?",
        "Does chaos magic require belief before it will work?"),
    (186, "Do I have to believe in magic to practise it?",
        "Is belief a precondition for practising magic?"),
    (159, "Should I work with demons?",
        "Is working with demons a sound idea?"),
    (332, "Should I work with demons?",
        "Is it wise to work with demons?"),
    (135, "Banishing removes. Cleansing purifies. Grounding re-establishes your own footing.",
        "A banishing clears the space. A cleansing purifies what is in it. Grounding puts your own footing back under you."),
    (181, "Banishing removes. Cleansing purifies. Grounding re-establishes your own footing in a place you intend to stay in.",
        "The first of those clears the space, the second purifies what occupies it, and the third puts your own footing back under you in a place you mean to stay in."),
]


def main() -> None:
    ok = 0
    for n, old, new in EDITS:
        path = CONTENT / f"{n}.json"
        raw = path.read_text(encoding="utf-8")
        count = raw.count(old)
        if count != 1:
            print(f"ABORT n={n}: old text occurs {count}x")
            raise SystemExit(1)
        path.write_text(raw.replace(old, new), encoding="utf-8")
        # Re-parse so a malformed write cannot pass silently.
        json.loads(path.read_text(encoding="utf-8"))
        print(f"n={n:>4}  {old[:58]!r} -> {new[:58]!r}")
        ok += 1
    print(f"\n{ok} manual edits applied")


if __name__ == "__main__":
    main()
