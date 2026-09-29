# -*- coding: utf-8 -*-
"""Consent-sentence repair in the two newer technomancy copies (n=24, n=25).
n=14 in b01d.py keeps the original phrasing, so it becomes the sole owner of the 8-gram."""

PATCHES = [
    (
        "b01f.py",
        '                "touches a device you alone own can be as elaborate as you like. The part that touches another "\n'
        '                "person\'s attention, data or money needs their agreement, in a form you could show someone "\n',
        '                "touches a device you alone own can be as elaborate as you like. Anything that reaches another "\n'
        '                "person\'s attention, data or money needs their agreement, obtained in a form you could show someone "\n',
    ),
    (
        "b01f.py",
        '                "device only you own can be elaborate. The part that touches another person\'s attention, data or "\n'
        '                "money requires their agreement, obtained in a form you could show someone later. T',
        '                "device only you own can be elaborate. Anything that reaches another person\'s attention, data or "\n'
        '                "money requires their agreement, obtained in a form you could show someone later. T',
    ),
]

if __name__ == "__main__":
    import os
    import sys

    here = os.path.dirname(os.path.abspath(__file__))
    ok = 0
    for fname, old, new in PATCHES:
        path = os.path.join(here, fname)
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        n = src.count(old)
        if n != 1:
            print("SKIP %s : %d occurrences" % (fname, n))
            continue
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(src.replace(old, new))
        ok += 1
    print("APPLIED %d/%d" % (ok, len(PATCHES)))
    sys.exit(0 if ok == len(PATCHES) else 1)
