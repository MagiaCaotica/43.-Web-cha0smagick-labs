#!/usr/bin/env python3
"""Round 3: the last 6 offending 8-grams, in two families.

- `british occult order of the nineteenth century its initiatory ...` across
  n=10 / 22 / 179: n=179 had been given wording that re-collided with the
  unchanged keeper. Adding a conjunction before "its" breaks the token run.
- `what is the difference between evocation and invocation` across n=138 / 146 /
  332: n=146 shipped with the same FAQ question as n=138, and n=332's round-2
  answer embedded n=138's wording verbatim.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

CONTENT = pathlib.Path(__file__).resolve().parent / "content"

EDITS: list[tuple[int, str, str]] = [
    (179,
     "Founded in 1888, the Golden Dawn was the most consequential British occult order of the nineteenth century. Its initiatory material then shaped most of the ceremonial practice that followed.",
     "Founded in 1888, the Golden Dawn was the most consequential British occult order of the nineteenth century, and its initiatory material then shaped most of the ceremonial practice that followed."),
    (146,
     "What is the difference between evocation and invocation?",
     "Invocation and evocation are not interchangeable. What separates them?"),
    (332,
     "Two operations get confused here. What is the difference between evocation and invocation?",
     "Two operations get confused here, and telling them apart is most of the technique."),
]


def main() -> None:
    ok = 0
    problems = []
    for n, old, new in EDITS:
        path = CONTENT / f"{n}.json"
        raw = path.read_text(encoding="utf-8")
        if raw.count(old) == 0:
            problems.append(f"n={n}: not found -> {old[:70]!r}")
            continue
        path.write_text(raw.replace(old, new), encoding="utf-8")
        json.loads(path.read_text(encoding="utf-8"))
        ok += 1
        print(f"n={n:>4}  ok")
    print(f"applied {ok}/{len(EDITS)}")
    if problems:
        for p in problems:
            print(f"  {p}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
