"""Fill the boilerplate keys of content records that were written without them.

Authored by hand, and never touched here:
    lede, sections, faq, related
and any synced key that is already present in the file.

Synced from specs.json only when MISSING, so hand-written metadata on the
already-rendered records is preserved exactly as authored:
    n, slug, h1, seo_title, description, keywords, published, published_human

Key order is forced to match the canonical schema so diffs stay readable.

Usage:
    python _fill_from_spec.py            # fill missing keys in every record
    python _fill_from_spec.py 3 5 8      # only these n
    python _fill_from_spec.py --check    # report what would be filled, write nothing
"""

from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")
SPECS = os.path.join(HERE, "specs.json")

# Authored content, then synced metadata. Order is the canonical schema order.
ORDER = [
    "n",
    "slug",
    "h1",
    "seo_title",
    "description",
    "keywords",
    "published",
    "published_human",
    "lede",
    "sections",
    "faq",
    "related",
]

SYNCED = ORDER[:8]
AUTHORED = ORDER[8:]

REQUIRED = set(ORDER)


def load_specs() -> dict[int, dict]:
    with open(SPECS, encoding="utf-8") as fh:
        raw = json.load(fh)
    if isinstance(raw, dict):
        items = raw.values()
    else:
        items = raw
    out: dict[int, dict] = {}
    for spec in items:
        out[int(spec["n"])] = spec
    return out


def spec_month(spec: dict) -> tuple[str, str]:
    """Derive an ISO date and a human date from the spec's own field."""
    published = spec.get("published") or "2026-09-26"
    human = spec.get("published_human")
    if human:
        return str(published), str(human)
    year, month, day = (int(p) for p in str(published).split("-"))
    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    return str(published), "%s %d, %d" % (months[month - 1], day, year)


def sync_one(n: int, specs: dict[int, dict], check: bool) -> str:
    path = os.path.join(CONTENT, "%d.json" % n)
    if not os.path.isfile(path):
        return "skip n=%d (no content record)" % n
    with open(path, encoding="utf-8") as fh:
        rec = json.load(fh)

    spec = specs.get(n)
    if spec is None:
        return "FAIL n=%d has no spec" % n

    published, human = spec_month(spec)
    wanted = {
        "n": n,
        "slug": spec["slug"],
        "h1": spec["h1"],
        "seo_title": spec["seo_title"],
        "description": spec["description"],
        "keywords": list(spec["keywords"]),
        "published": published,
        "published_human": human,
    }

    absent = [k for k in wanted if k not in rec or rec[k] in (None, "", [])]
    unknown = [k for k in rec if k not in REQUIRED]
    if unknown:
        return "FAIL n=%d unknown keys: %s" % (n, sorted(unknown))

    if check:
        if absent:
            return "fill n=%d %s" % (n, absent)
        return "ok n=%d" % n
    if not absent:
        return "ok n=%d" % n

    merged = {k: rec[k] for k in ORDER if k in rec}
    for k in absent:
        merged[k] = wanted[k]
    missing = REQUIRED - set(merged)
    if missing:
        return "FAIL n=%d still missing: %s" % (n, sorted(missing))
    with open(path, "w", encoding="utf-8") as fh:
        json.dump({k: merged[k] for k in ORDER}, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    return "filled n=%d %s" % (n, absent)


def main() -> int:
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    check = "--check" in sys.argv
    specs = load_specs()
    targets = [int(a) for a in args] if args else sorted(specs)
    lines = [sync_one(n, specs, check) for n in targets]
    bad = [ln for ln in lines if ln.startswith(("FAIL", "fill", "drift"))]
    for ln in bad[:40]:
        print(ln)
    print(
        "%s %d record(s), %d needing attention"
        % ("CHECK" if check else "sync", len(lines), len(bad))
    )
    return 1 if any(ln.startswith("FAIL") for ln in lines) else 0


if __name__ == "__main__":
    raise SystemExit(main())
