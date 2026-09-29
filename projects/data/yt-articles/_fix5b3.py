# -*- coding: utf-8 -*-
"""Third and final collision pass for b05b.py. Same contract as _fix5b.py."""
import ast
import io
import sys

PATH = "content/_src/b05b.py"

REWRITES = [
    ("The tradition's own position is a short daily routine rather than one that escalates",
     '                    "The tradition\'s own position is a short fixed routine rather than a '
     'climbing one, "\n                    "and that is a piece of practical advice about attention '
     'rather than a mystical "\n                    "preference. People who escalate are usually trying '
     'to force a result, and escalation "\n                    "produces more effort rather than more '
     'information."'),
    ("Each of the seventy-two has a rank, a visible form, an office and a set of ",
     '                    "Each of the seventy-two is given a standing, an appearance, a jurisdiction '
     'and a list "\n                    "of "'),
    ("aspects of the magician's own mind, which removes nearly all of the risk without ",
     '                    "facets of the practitioner\'s own mind, which removes nearly all of the '
     'risk without "'),
]


def apply_prose(src, needle, replacement):
    lines = src.split("\n")
    hits = [i for i, ln in enumerate(lines) if needle in ln]
    if len(hits) != 1:
        sys.exit("prose %r matched %d lines" % (needle[:40], len(hits)))
    i = hits[0]
    indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
    lines[i : i + 1] = [indent + r for r in replacement.split("\n")]
    return "\n".join(lines)


def main():
    src = io.open(PATH, encoding="utf-8").read()
    for needle, replacement in REWRITES:
        src = apply_prose(src, needle, replacement)
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("applied %d prose rewrites" % len(REWRITES))


if __name__ == "__main__":
    main()
