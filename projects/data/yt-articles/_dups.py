"""Report corpus-level slop collisions with the file that owns them.

Usage:  python _dups.py            # summary: every duplicate 8-gram + duplicate H2
        python _dups.py sentences  # for each duplicate 8-gram, the sentences holding it

The `_worklist`/underscore files are skipped. Nothing is written; this is a
read-only diagnostic.
"""

import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")
BLOG = os.path.abspath(os.path.join(HERE, "..", "..", "..", "blog"))

sys.path.insert(0, HERE)
import slop  # noqa: E402

N = slop.NGRAM_N


def content_records():
    for f in sorted(os.listdir(CONTENT)):
        if not f.endswith(".json") or f.startswith("_"):
            continue
        yield int(f[:-5]), os.path.join(CONTENT, f)


def pairs():
    out = []
    import json

    for n, _ in content_records():
        with open(os.path.join(CONTENT, f"{n}.json"), encoding="utf-8") as fh:
            slug = json.load(fh)["slug"]
        path = os.path.join(BLOG, slug + ".html")
        if os.path.exists(path):
            with open(path, encoding="utf-8") as fh:
                out.append((slug, fh.read(), n))
    return out


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "summary"
    ps = pairs()
    n_of = {slug: n for slug, _html, n in ps}

    # --- duplicate H2s -------------------------------------------------
    h2_at = defaultdict(set)
    for slug, html, n in ps:
        for h in slop.h2s(slop._body(html)):
            h2_at[h].add(n)
    dup_h2 = {h: ns for h, ns in h2_at.items() if len(ns) > 1 and h.lower() not in slop._STRUCTURAL_H2}

    # --- duplicate 8-grams --------------------------------------------
    gram_at = defaultdict(set)
    sent_at = defaultdict(list)
    for slug, html, n in ps:
        body = slop._body(html)
        for sent in slop.paragraphs(body):
            ws = sent.lower().split()
            for i in range(len(ws) - N + 1):
                g = " ".join(ws[i : i + N])
                gram_at[g].add(n)
                if g not in sent_at:
                    sent_at[g].append(sent)
    dup_ng = {g: ns for g, ns in gram_at.items() if len(ns) > 2}

    print("=" * 78)
    print(f"DUPLICATE H2  ({len(dup_h2)})")
    for h in sorted(dup_h2, key=lambda x: -len(dup_h2[x])):
        print(f"  {sorted(dup_h2[h])}  |  {h}")
    print()
    print("=" * 78)
    print(f"DUPLICATE {N}-GRAMS  ({len(dup_ng)})")
    for g in sorted(dup_ng, key=lambda x: -len(dup_ng[x])):
        print(f"  x{len(dup_ng[g])}  {sorted(dup_ng[g])}")
        print(f"        {g}")

    if mode == "sentences":
        print()
        print("=" * 78)
        print("SENTENCES HOLDING EACH DUPLICATE")
        for g in sorted(dup_ng):
            print("-" * 78)
            print(f"x{len(dup_ng[g])} {sorted(dup_ng[g])}")
            print(f"  GRAM: {g}")
            for s in dict.fromkeys(sent_at[g]):
                print(f"  SENT: {s[:300]}")


if __name__ == "__main__":
    main()
