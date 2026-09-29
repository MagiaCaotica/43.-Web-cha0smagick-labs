"""Report exactly why one or more articles fail the gate.

Usage:  python _why.py [n ...]

Runs qa.check_one(n) and prints the problem list for each failing article,
plus the raw slop.scan_article verdict. Read-only: it re-renders, as qa.py does.
"""
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import qa  # noqa: E402


def main():
    if len(sys.argv) > 1:
        ns = [int(x) for x in sys.argv[1:] if x.isdigit()]
    else:
        cdir = os.path.join(HERE, "content")
        ns = sorted(
            int(f[:-5])
            for f in os.listdir(cdir)
            if f.endswith(".json") and not f.startswith("_")
        )
    for n in ns:
        res = qa.check_one(n)
        # check_one returns [dest, slug, words, body_words, h2, problems]
        problems = res[-1] if isinstance(res, (list, tuple)) else res
        if not problems:
            print("n=%d  OK  %s" % (n, " ".join(str(x) for x in res[:5])))
            continue
        print("n=%d  %d problem(s):" % (n, len(problems)))
        for p in problems:
            print("    - %s" % (p,))


if __name__ == "__main__":
    main()
