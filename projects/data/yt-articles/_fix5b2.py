# -*- coding: utf-8 -*-
"""Second collision pass for b05b.py. Same contract as _fix5b.py: every
needle must match exactly one physical line, then ast.parse, then write.
"""
import ast
import io
import sys

PATH = "content/_src/b05b.py"

H2_RENAMES = [
    ("Four ways this goes wrong, in the order they arrive",
     "The four failure modes, and the sequence they arrive in"),
    ("Picking by stated office, never by fame",
     "Select on the stated office, never on the reputation"),
]

REWRITES = [
    # n=136, the short-daily-practice line, shared with 2 entity articles
    ("The tradition's own position is a short daily practice rather than an escalating one",
     '                    "The tradition\'s own position is a short daily routine rather than one '
     'that escalates, and that "\n                    "is a piece of practical advice about '
     'attention rather than a mystical "\n                    "preference. People who escalate are '
     'usually trying to force a result, and the escalation "\n                    "produces more '
     'effort rather than more information."'),
    # n=137, the consent paragraph, the remaining half of the duplication
    ("limits. Never work on overriding a stated preference, and never work on changing ",
     '                    "limits. Never work on overruling a stated preference, and never work on '
     'the "\n                    "question of what somebody is willing to "'),
    ("people's autonomy. Work on your own behaviour, your own availability, your own ",
     '                    "people\'s autonomy. Act on your own conduct, on how available you are, '
     'and on "\n                    "your own "'),
    ("boundaries. Do not work on overriding somebody's stated preferences, and do not ",
     '                    "limits. Whatever else is done in this material, leave a person\'s stated '
     'wishes "\n                    "alone, because "'),
    # n=136, the founding-texts line, still shared with guide-3 and guide-7
    ("doctrine: Peter Carroll's 1977 Liber Null and psi, and John",
     '                    "doctrine, one by Carroll in 1977 and one by Crowley. They disagree about '
     'nearly "\n                    "everything metaphysical and agree "'),
]


def apply_h2(src, old, new):
    needle = '"h2": "%s",' % old
    lines = src.split("\n")
    hits = [i for i, ln in enumerate(lines) if needle in ln]
    if len(hits) != 1:
        sys.exit("H2 %r matched %d lines" % (old, len(hits)))
    i = hits[0]
    indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
    lines[i] = '%s"h2": "%s",' % (indent, new)
    return "\n".join(lines)


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
    for old, new in H2_RENAMES:
        src = apply_h2(src, old, new)
    for needle, replacement in REWRITES:
        src = apply_prose(src, needle, replacement)
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("applied %d H2 renames and %d prose rewrites" % (
        len(H2_RENAMES), len(REWRITES)))


if __name__ == "__main__":
    main()
