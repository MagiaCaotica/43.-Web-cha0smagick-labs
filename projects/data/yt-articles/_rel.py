"""Look up `related` link candidates from the pool of real blog files.

`related` entries must be [slug, title] pairs whose slug resolves to a real
blog/<slug>.html.  The pool is generated into content/_src/_pool.py; this
script searches it so candidates can be picked without pulling the whole pool
into a context window.

Usage (from repo root or projects/data/yt-articles):
    python _rel.py sigil            # every title/slug mentioning 'sigil'
    python _rel.py sigil goetia -n 20
    python _rel.py --all            # print the whole pool, filtered later
    python _rel.py --slugs-only     # bare slugs, one per line, no titles
"""

import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "content", "_src"))

import _pool  # noqa: E402

POOL = dict(_pool.PRE_EXISTING)


def main():
    argv = list(sys.argv[1:])
    slugs_only = "--slugs-only" in argv
    limit = 25
    if "-n" in argv:
        i = argv.index("-n")
        limit = int(argv[i + 1])
        del argv[i : i + 2]
    args = [a for a in argv if not a.startswith("-")]
    if not args:
        keys = sorted(POOL)
    else:
        needles = [a.lower() for a in args]
        keys = [k for k in sorted(POOL) if any(n in k or n in POOL[k].lower() for n in needles)]
    hits = len(keys)
    for k in keys[:limit]:
        print(k if slugs_only else "%s | %s" % (k, POOL[k]))
    print("--- %d match(es), showing %d, pool size %d" % (hits, min(limit, hits), len(POOL)))


if __name__ == "__main__":
    main()
