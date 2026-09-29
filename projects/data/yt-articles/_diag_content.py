"""Diagnose malformed content/<n>.json records.

Reports the exact line/column of the JSON syntax error (Python's json module
gives a line number, which Node's does not), plus a window of context so the
break can be repaired by hand or by a targeted patch.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")


def diagnose(n, window=3):
    p = os.path.join(CONTENT, "%d.json" % n)
    with open(p, encoding="utf-8") as f:
        raw = f.read()
    try:
        json.loads(raw)
        return n, None, None, len(raw), None
    except json.JSONDecodeError as e:
        lines = raw.split("\n")
        lo = max(0, e.lineno - 1 - window)
        hi = min(len(lines), e.lineno + window)
        ctx = []
        for i in range(lo, hi):
            mark = ">>" if (i + 1) == e.lineno else "  "
            ctx.append("%s %4d| %s" % (mark, i + 1, lines[i][:220]))
        return n, e.msg, (e.lineno, e.colno), len(raw), "\n".join(ctx)


def main():
    targets = [int(a) for a in sys.argv[1:]]
    if not targets:
        targets = []
        for fn in os.listdir(CONTENT):
            if fn.endswith(".json"):
                targets.append(int(fn[:-5]))
    bad = []
    for n in sorted(targets):
        n, msg, pos, size, ctx = diagnose(n)
        if msg is None:
            continue
        bad.append(n)
        print("=== n=%d  bytes=%d" % (n, size))
        print("    %s at line %s col %s" % (msg, pos[0], pos[1]))
        if ctx:
            print(ctx)
        print()
    ok = len(targets) - len(bad)
    print("scanned %d | valid %d | malformed %d -> %s"
          % (len(targets), ok, len(bad), bad))
    return 0


if __name__ == "__main__":
    sys.exit(main())
