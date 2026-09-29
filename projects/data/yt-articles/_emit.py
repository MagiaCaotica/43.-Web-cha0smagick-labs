"""Emit authored content records from the readable Python sources in content/_src/.

The hand-authored artefact for each article is a Python literal in
`content/_src/b*.py` (single-quoted prose, no JSON escaping).  This module
merges those with the boilerplate keys in specs.json, validates them against
the authoring contract, and writes canonical JSON to `content/<n>.json`.

Only `lede`, `sections`, `faq` and `related` are authored by hand.  Everything
else comes from the spec, using the same merge order and the same JSON
formatting as _fill_from_spec.py, so a record written here is indistinguishable
from one written by hand.

Validation is deliberately strict: a record that would fail the QA gate is
rejected before it reaches disk, with the reason printed.

Usage (from projects/data/yt-articles):
    python _emit.py            # write every article in content/_src/
    python _emit.py --check    # validate and report, write nothing
"""

from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")
SRC = os.path.join(CONTENT, "_src")

sys.path.insert(0, HERE)
import _fill_from_spec as filler  # noqa: E402

ORDER = filler.ORDER
SYNCED = filler.SYNCED

REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))


def collect() -> dict:
    """Merge every b*.py in content/_src into one {n: record} mapping.

    `content/_src/_lede.py` may define LEDGES = {n: "..."} to replace a lede
    without rewriting the batch file that owns the rest of the record.
    """
    articles = {}
    for name in sorted(os.listdir(SRC)):
        if not name.startswith("b") or not name.endswith(".py"):
            continue
        ns = {}
        with open(os.path.join(SRC, name), "r", encoding="utf-8") as fh:
            exec(compile(fh.read(), name, "exec"), ns)  # noqa: S102
        for n, rec in ns.get("ARTICLES", {}).items():
            if int(n) in articles:
                raise SystemExit("n=%s defined twice in the batch sources" % n)
            articles[int(n)] = rec
    patch = os.path.join(SRC, "_lede.py")
    if os.path.isfile(patch):
        ns = {}
        with open(patch, "r", encoding="utf-8") as fh:
            exec(compile(fh.read(), "_lede.py", "exec"), ns)  # noqa: S102
        for n, text in ns.get("LEDGES", {}).items():
            n = int(n)
            if n in articles:
                articles[n]["lede"] = text
    return articles


def valid_slugs(specs):
    """Slugs a `related` entry may point at: real blog files, or spec slugs.

    All 349 spec slugs are allowed because every one of them is rendered before
    qa.py runs, at which point the file exists.
    """
    pool = set(s["slug"] for s in specs.values())
    blog = os.path.join(REPO, "blog")
    if os.path.isdir(blog):
        pool |= set(f[:-5] for f in os.listdir(blog) if f.endswith(".html"))
    return pool


def merge(rec, n, specs):
    """Add the spec-derived keys the author did not write, in canonical order."""
    spec = specs.get(n)
    if spec is None:
        raise SystemExit("n=%s has no spec" % n)
    published, human = filler.spec_month(spec)
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
    out = dict((k, rec[k]) for k in ORDER if k in rec)
    for k in SYNCED:
        if out.get(k) in (None, "", []):
            out[k] = wanted[k]
    return dict((k, out[k]) for k in ORDER if k in out)


def validate(n, rec, pool):
    """Refuse to write a record that could not pass the authoring contract."""
    bad = []
    for key in ORDER:
        if key not in rec:
            bad.append("missing key %s" % key)
    if bad:
        return bad

    lede = rec["lede"]
    if not isinstance(lede, str):
        bad.append("lede is not a string")
    else:
        w = len(lede.split())
        if not 120 <= w <= 300:
            bad.append("lede is %d words (want 120-300)" % w)

    secs = rec["sections"]
    if not isinstance(secs, list) or not 7 <= len(secs) <= 16:
        got = len(secs) if isinstance(secs, list) else "?"
        bad.append("%s sections (want 7-16)" % got)
        return bad
    h2s = [str(s.get("h2", "")) for s in secs]
    if len(set(h2s)) != len(h2s):
        bad.append("duplicate h2 inside this article")
    for s in secs:
        ps = s.get("p") or []
        if not ps:
            bad.append("section %r has no paragraphs" % s.get("h2"))
        for para in ps:
            words = len(str(para).split())
            if words < 20:
                bad.append("stub paragraph (%dw) in %r" % (words, s.get("h2")))
        for opt in ("ol", "ul"):
            for item in s.get(opt) or []:
                if len(str(item).split()) < 4:
                    bad.append("stub list item in %r" % s.get("h2"))

    faq = rec["faq"]
    if not isinstance(faq, list) or len(faq) != 5:
        got = len(faq) if isinstance(faq, list) else "?"
        bad.append("%s faq items (want 5)" % got)
    else:
        for item in faq:
            if not isinstance(item, (list, tuple)) or len(item) != 2:
                bad.append("malformed faq item: %r" % (item,))
            elif len(str(item[1]).split()) < 32:
                bad.append("faq answer too short: %r" % (item[0],))

    rel = rec["related"]
    if not isinstance(rel, list) or len(rel) != 5:
        got = len(rel) if isinstance(rel, list) else "?"
        bad.append("%s related items (want 5)" % got)
    else:
        seen = set()
        for item in rel:
            if not isinstance(item, (list, tuple)) or len(item) != 2:
                bad.append("malformed related item: %r" % (item,))
                continue
            if item[0] in seen:
                bad.append("duplicate related slug: %s" % item[0])
            seen.add(item[0])
            if item[0] not in pool:
                bad.append("related slug will not resolve: %s" % item[0])
    return bad


def main():
    check = "--check" in sys.argv
    specs = filler.load_specs()
    pool = valid_slugs(specs)
    articles = collect()
    if not articles:
        raise SystemExit("no batch sources found in content/_src/")

    merged = {}
    failures = 0
    for n in sorted(articles):
        try:
            rec = merge(articles[n], n, specs)
        except SystemExit as exc:
            print("n=%s REJECT  %s" % (n, exc))
            failures += 1
            continue
        problems = validate(n, rec, pool)
        if problems:
            failures += 1
            print("n=%s REJECT" % n)
            for p in problems:
                print("    %s" % p)
        else:
            merged[n] = rec

    if failures:
        print("\n%d record(s) rejected; nothing written" % failures)
        return 1

    for n in sorted(merged):
        if check:
            continue
        with open(os.path.join(CONTENT, "%d.json" % n), "w", encoding="utf-8") as fh:
            json.dump(merged[n], fh, ensure_ascii=False, indent=2)
            fh.write("\n")
    print("%s %d record(s) from content/_src/" % ("CHECK" if check else "WROTE", len(merged)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
