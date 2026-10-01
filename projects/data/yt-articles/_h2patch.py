#!/usr/bin/env python3
"""Rename the 4 reused H2s so no H2 repeats across the corpus.

Strategy: keep the lowest-n article's H2 wording, rewrite the other(s).
Also verifies the new wording does not collide with any existing H2 in the corpus.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

BASE = pathlib.Path(__file__).resolve().parent
CONTENT = BASE / "content"

# old_h2 (lowercased) -> {n_that_must_be_rewritten: new_h2}
RENAMES = {
    "writing down a prediction before you start": {
        147: "recording the prediction in advance",
    },
    "where the material came from": {
        150: "tracing the source material",
    },
    "what survives if you drop the ontology": {
        173: "what remains without the belief system",
    },
    "the autonomic results are the solid part": {
        173: "measuring the involuntary responses",
    },
    "banishing, cleansing, and grounding are three jobs": {
        181: "clearing, purifying and settling are separate operations",
    },
    "a first working, in order": {
        349: "a first working, run in sequence",
    },
}


def load(n: int) -> dict:
    return json.loads((CONTENT / f"{n}.json").read_text(encoding="utf-8"))


def save(n: int, data: dict) -> None:
    path = CONTENT / f"{n}.json"
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


def all_h2() -> dict[str, set[int]]:
    """lowercased H2 -> set of n that use it."""
    out: dict[str, set[int]] = {}
    for path in sorted(CONTENT.glob("[0-9]*.json")):
        n = int(path.stem)
        data = json.loads(path.read_text(encoding="utf-8"))
        for sec in data.get("sections", []):
            h2 = sec.get("h2")
            if isinstance(h2, str) and h2.strip():
                out.setdefault(h2.strip().lower(), set()).add(n)
    return out


def main() -> None:
    # Pre-check: a proposed H2 must not already exist in an article we are not
    # renaming. Re-running the script is fine: a proposal that already landed on
    # its own target no longer exists anywhere else.
    existing = all_h2()
    rename_targets = {n for targets in RENAMES.values() for n in targets}
    for old, targets in RENAMES.items():
        for n, new in targets.items():
            others = [m for m in existing.get(new, set()) if m != n]
            if others:
                print(f"ABORT: {new!r} already present in {sorted(others)}")
                return

    changed: list[tuple[int, str, str]] = []
    for old, targets in RENAMES.items():
        for n, new in targets.items():
            data = load(n)
            hit = False
            for sec in data.get("sections", []):
                if isinstance(sec.get("h2"), str) and sec["h2"].strip().lower() == old:
                    sec["h2"] = new
                    hit = True
            if not hit:
                print(f"WARN: n={n} does not contain H2 {old!r}")
                continue
            save(n, data)
            changed.append((n, old, new))

    for n, old, new in changed:
        print(f"n={n:>4}  {old!r} -> {new!r}")

    # Verify.
    after = all_h2()
    reused = {h: sorted(ns) for h, ns in after.items() if len(ns) > 1}
    print(f"\nH2s used by more than one article: {len(reused)}")
    for h, ns in sorted(reused.items()):
        print(f"  {h!r} -> {ns}")


if __name__ == "__main__":
    main()
