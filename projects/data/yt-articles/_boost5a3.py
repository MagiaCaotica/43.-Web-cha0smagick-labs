# -*- coding: utf-8 -*-
"""Lift n=132 (the only record in b05a.py under 1,850) over the floor."""
import ast
import io
import sys

PATH = "content/_src/b05a.py"
ANCHOR = '        ],\n        "faq": ['

SPEC = [
    ("Where nobody in this field agrees about anything", [
        "The disagreement is rarely about the data. It is about what counts as a result. One "
        "practitioner logs a feeling of presence, another logs a measurable physiological change, "
        "a third logs only whether the day afterwards was different, and all three write them up "
        "as successes.",
        "Nothing in the literature adjudicates this, because the literature is not in the habit of "
        "adjudicating anything. The practical fix is to declare your outcome in advance, in the "
        "unit you will actually be able to check, and then to stick to that unit when the result "
        "arrives. Most of the apparent argument in this area turns out to be two people using "
        "different definitions and both describing it as clarity.",
    ], None),
    ("The one habit that carries over", [
        "Everything else in altered-state practice is contested and none of it is necessary. "
        "Writing down what happened, the same day, in words that do not flatter it, is the single "
        "habit that pays for itself and costs nothing.",
        "It is also the habit everybody drops, because the experience is more interesting than the "
        "entry and the entry is what makes the experience a practice rather than an event.",
    ], None),
]


def render(specs):
    out = []
    for h2, paras, lst in specs:
        out.append("        {")
        out.append('            "h2": "%s",' % h2)
        out.append('            "p": [')
        for i, p in enumerate(paras):
            out.append('                "%s%s' % (p, '",' if i < len(paras) - 1 else '"'))
        out.append("            ],")
        out.append("        },")
    return "\n".join(out)


def main():
    src = io.open(PATH, encoding="utf-8").read()
    pos, positions = 0, []
    while True:
        i = src.find(ANCHOR, pos)
        if i < 0:
            break
        positions.append(i)
        pos = i + len(ANCHOR)
    if len(positions) != 3:
        sys.exit("located %d anchors, expected 3" % len(positions))
    # n=132 is the SECOND record -> second-to-last anchor
    idx = positions[1]
    src = src[:idx] + render(SPEC) + "\n" + src[idx:]
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("inserted 2 sections into n=132")


if __name__ == "__main__":
    main()
