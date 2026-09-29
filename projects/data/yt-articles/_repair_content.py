"""Repair malformed content/<n>.json records.

Several records were written with a truncated tail: the final entry of
`sections` is missing its closing brace, or its `p` array is missing the
closing bracket. Rather than hand-patch each file, this walks the JSON
decoder's reported line and tries single-line delimiter insertions (and
append-to-previous-line) at that point, recursing up to MAX_DEPTH so a file
with more than one break is still recovered.

A candidate is accepted only when the whole document parses *and* the parsed
result is a dict carrying the full record schema. Nothing is written unless
the repaired text round-trips.

Usage:  python _repair_content.py [n ...]     (no args = every content record)
Exit 0 when nothing remains malformed, 1 otherwise.
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")

REQUIRED = ("n", "slug", "h1", "seo_title", "description", "keywords",
            "published", "published_human", "lede", "sections", "faq", "related")

MAX_DEPTH = 5

# Candidate delimiter lines, most likely first, at the failure point.
INSERTS = ("    }", "    ]", "  },", "  ],", "      }", "      ]", "}", "]")
# Candidate appends to the end of the line *before* the failure point.
APPENDS = (" }", " ]", "},", "],", "  }", "  ]")


def _ok(text):
    try:
        obj = json.loads(text)
    except Exception:
        return None
    if not isinstance(obj, dict):
        return None
    missing = [k for k in REQUIRED if k not in obj]
    if missing:
        return None
    return obj


def _fix(lines, idx, depth, trail):
    """Try to make `lines` parse. Return (fixed_lines, trail) or None."""
    if depth > MAX_DEPTH:
        return None
    if idx >= len(lines):
        return None
    for ins in INSERTS:
        cand = lines[:idx] + [ins] + lines[idx:]
        obj = _ok("\n".join(cand))
        if obj is not None:
            return cand, trail + ["line %d: inserted %r" % (idx + 1, ins)]
        got = _fix(cand, idx + 1, depth + 1, trail + ["line %d: inserted %r" % (idx + 1, ins)])
        if got:
            return got
    if idx > 0:
        for app in APPENDS:
            base = list(lines)
            base[idx - 1] = base[idx - 1] + app
            obj = _ok("\n".join(base))
            if obj is not None:
                return base, trail + ["line %d: appended %r" % (idx, app)]
            got = _fix(base, idx, depth + 1, trail + ["line %d: appended %r" % (idx, app)])
            if got:
                return got
    return None


def repair(n, write=True):
    p = os.path.join(CONTENT, "%d.json" % n)
    with open(p, encoding="utf-8") as f:
        raw = f.read()
    if _ok(raw) is not None:
        return n, "already valid", []
    try:
        json.loads(raw)
    except json.JSONDecodeError as e:
        lines = raw.split("\n")
        idx = max(0, e.lineno - 1)
    got = _fix(lines, idx, 0, [])
    if not got:
        return n, "UNREPAIRABLE", []
    new_lines, trail = got
    new = "\n".join(new_lines)
    if _ok(new) is None:
        return n, "UNREPAIRABLE", trail
    if write:
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(new)
    return n, "repaired", trail


def main():
    targets = [int(a) for a in sys.argv[1:]]
    if not targets:
        targets = sorted(int(fn[:-5]) for fn in os.listdir(CONTENT) if fn.endswith(".json"))
    bad = []
    for n in targets:
        n, status, trail = repair(n)
        if status != "already valid":
            print("[%s] n=%d" % (status, n))
            for t in trail:
                print("       %s" % t)
        if status != "already valid" and status != "repaired":
            bad.append(n)
    print("\nscanned %d | unrepairable %d -> %s" % (len(targets), len(bad), bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
