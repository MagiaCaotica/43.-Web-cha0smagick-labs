# -*- coding: utf-8 -*-
"""Line patcher for b04h.py collision fixes.

PATCHES = [(expected substring on the line, replacement for the WHOLE line), ...]
Each must match exactly one line or the run aborts without writing.
"""
import ast
import io
import sys

PATH = "content/_src/b04h.py"

PATCHES = [
    # ---- H2 renames (all in b04h, all duplicates of older articles) ----
    ("Where the practice genuinely helps",
     '"h2": "Where this capacity pays off in ordinary life",'),
    ("The line between sincerity and credulity",
     '"h2": "Sincerity and credulity, told apart",'),
    ("The parabola, and the price of holding it",
     '"h2": "The parabola, and what it costs you",'),
    ("Why the morning decides everything",
     '"h2": "What the sleep architecture does for you",'),
    ("The sleep debt trap",
     '"h2": "Where the practice starts eating its own substrate",'),
    ("A four-week structure that works",
     '"h2": "One month, sequenced the way it actually needs to be",'),
    ("Where the popular version departs from the source",
     '"h2": "Three places the retelling and the source diverge",'),
    ("How to keep a record that will survive contact with you",
     '"h2": "Keeping notes that will still be true in a year",'),
    # ---- n-gram fixes (exact physical lines, verified by grep) ----
    ("takes its moral colour from the aim you gave it. It was central to early chaos ",
     '"takes its moral colour from the aim you set it. It mattered most in the early chaos "'),
    ("clean claim that nothing happens without belief difficult to state.",
     '"claim that nothing can happen without belief difficult to state.",'),
    ("because it made it acceptable to test a claim rather than inherit it. Nothing ",
     '"because it made it respectable to check a claim rather than take one on trust. Nothing "'),
    ("disruption, and all three are reduced by a short daily routine rather than one that ",
     '"disruption, and all three shrink if the routine stays short and fixed rather than "'),
    ("its claims about its own provenance do not hold up. It is readable and it is ",
     '"its account of where it came from is unsupported. It is readable and it is "'),
    ("practice rather than an escalating one. Sleep is the substrate. Optimising ",
     '"routine rather than one that climbs. Sleep is the substrate, and optimising "'),
]


def main():
    lines = io.open(PATH, encoding="utf-8").read().split("\n")
    applied = 0
    for needle, replacement in PATCHES:
        hits = [i for i, ln in enumerate(lines) if needle in ln]
        if len(hits) != 1:
            print("MISS %-52r count=%d" % (needle[:52], len(hits)))
            sys.exit(1)
        lead = lines[hits[0]][: len(lines[hits[0]]) - len(lines[hits[0]].lstrip())]
        lines[hits[0]] = lead + replacement
        applied += 1
        print("ok line %d  %s" % (hits[0] + 1, needle[:52]))
    text = "\n".join(lines)
    ast.parse(text)
    io.open(PATH, "w", encoding="utf-8", newline="").write(text)
    print("applied %d of %d" % (applied, len(PATCHES)))


if __name__ == "__main__":
    main()
