# -*- coding: utf-8 -*-
"""Clear the b05b corpus collisions. Every fix is applied to the NEWEST member
of each pair, which is b05b.py in every case.

Two operations:
  H2_RENAMES  - rewrite a single physical `"h2": "X",` line
  REWRITES    - replace a single physical prose line, given a unique substring
                that must appear on exactly one line
Both validate uniqueness, `ast.parse()` the result, and only then write.
"""
import ast
import io
import sys

PATH = "content/_src/b05b.py"

# ---------------------------------------------------------------- H2 renames
H2_RENAMES = [
    ("A defensible first working", "One first working, with the record written the same day"),
    ("The failure modes, in the order they show up",
     "Four ways this goes wrong, in the order they arrive"),
    ("How to know when to stop", "When to stop, and what to do instead"),
    ("What the classical catalogue actually gives you",
     "What the seventy-two entries actually supply"),
    ("Reading a name before you work with it",
     "Reading the entry rather than the summary of it"),
    ("Choosing by office rather than by reputation",
     "Picking by stated office, never by fame"),
    ("Consent, boundaries and other people",
     "The line that is somebody else's autonomy"),
    ("The distinction the vocabulary was built to protect",
     "The distinction the two words were invented to keep"),
    ("What the modern reading gives up, and what it keeps",
     "What the looser reading discards, and what it retains"),
]

# ------------------------------------------------------------------- prose
# (unique substring on one physical line, replacement for the WHOLE line)
REWRITES = [
    # --- n=136: the founding-texts sentence, shared with guide-3 and guide-7
    ("The name plays on chaos magic and on the Chaos enthroned",
     '                    "The movement took its name from chaos magic and from the figure of Chaos '
     'on the "\n                    "throne in the Book of the Law, and treated the resemblance as a '
     'deliberate claim "\n                    "rather than a borrowed piece of vocabulary. What '
     'makes the movement unusual is not the "\n                    "metaphysics, which is thin, but '
     'the insistence that claims be tested rather than "'),
    ("the conventional starting point. Its founding texts, Peter Carroll's Liber Null and psi ",
     '                    "the conventional starting point. Two short texts set the method rather '
     'than the "\n                    "doctrine: Peter Carroll\'s 1977 Liber Null and psi, and John '
     'Crowley\'s Liber Kaos. They "\n                    "disagree about nearly everything '
     'metaphysical and agree entirely about method. This page "\n                    "gives the whole '
     'sequence once, in order, with the "'),
    # --- n=136: the imperative-sentence advice, shared with guide-8
    ("Write one sentence in the imperative mood with a number or a date in it. The ",
     '                    "Write one sentence as a command, with a quantity or a date inside it. The '
     'imperative is "\n                    "not a stylistic preference; it changes what you are '
     'committing to. A wish "\n                    "describes a state, a command describes an act, and '
     'only one of those is "\n                    "something you can report on."'),
    # --- n=137: the consent paragraph, shared with 5 other articles
    ("This is the hard line in the whole area of entity work",
     '                    "This is the hard line in the whole area of entity work. The line belongs to '
     'the other "\n                    "person\'s autonomy. Act on your own conduct, on your own '
     'availability and on your own "\n                    "limits. Never work on overriding a stated '
     'preference, and never work on changing "\n                    "what somebody is willing to '
     'agree to."'),
    ("The distinction from the pattern-fragment reading is that it is about targets",
     '                    "The distinction from the pattern-fragment reading concerns targets rather '
     'than entities. "\n                    "A pattern you work on yourself is practice. A pattern '
     'aimed at a particular "\n                    "person is an attempt to override a stated '
     'preference, whatever the metaphysics "\n                    "claims."'),
    # --- n=137: the reputation sentence, shared with 2 other articles
    ("Reputation inside this corpus is a product of",
     '                    "Reputation inside this corpus is manufactured by four centuries of '
     'retelling, and "\n                    "the most visible names are prominent for reasons that have '
     'little to do with "\n                    "whether they suit your question. A name that is short '
     'and hard to pronounce "\n                    "travels. A name attached to a memorable story '
     'travels further."'),
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
