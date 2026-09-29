# -*- coding: utf-8 -*-
"""Corpus 8-gram repair. Each patch: exact old string present once -> new string.
Breaks repeated runs in the money-FAQ phrasing and the technomancy consent sentence.
Also defines a ROTATION of money-FAQ question phrasings for future batches."""

ROTATION = [
    "What does a paid application actually add to {t}?",
    "Is a paid tool worth it for {t}?",
    "What am I paying for if I buy an app for {t}?",
    "Does buying software change what I can do with {t}?",
    "Where does the money actually go in a paid version of {t}?",
    "What does a one-time purchase get me for {t}?",
    "Is there anything a purchased version of {t} does better?",
    "What is the paid upgrade for {t} actually buying?",
]

PATCHES = [
    # --- money-FAQ question rotation (each old string occurs exactly once) ---
    (
        "b01d.py",
        '"What does a paid application actually add to a digital working?",',
        '"Is a paid tool worth it for a digital working?",',
    ),
    (
        "b01d.py",
        '"What does a paid application add to a musical working?",',
        '"What am I paying for if I buy an app for musical workings?",',
    ),
    (
        "b01d.py",
        '"What does a paid application add to clarity work?",',
        '"Does buying software change what I can do with clarity work?",',
    ),
    (
        "b01e.py",
        '"What does a paid application actually add to this work?",',
        '"What is the paid upgrade for this kind of practice actually buying?",',
    ),
    (
        "b01e.py",
        '"What does a paid application add to a philosophical practice?",',
        '"Where does the money actually go in a paid version of this?",',
    ),
    (
        "b01e.py",
        '"What does a paid application add to working with this material?",',
        '"What does a one-time purchase get me for working with this material?",',
    ),
    (
        "b01e.py",
        '"What does a paid application add to making sigils?",',
        '"Is there anything a purchased version of a sigil tool does better?",',
    ),
    (
        "b01f.py",
        '"What does a paid application add to historical study?",',
        '"What am I paying for if I buy an app for historical study?",',
    ),
    (
        "b01f.py",
        '"What does a paid application actually add to this practice?",',
        '"Is a paid tool worth it for a practice log?",',
    ),
    (
        "b01f.py",
        '"What does a paid application add to a technomantic working?",',
        '"Does buying software change what I can do with a screen working?",',
    ),
    (
        "b01f.py",
        '"What does a paid application add to computational workings?",',
        '"What is the paid upgrade for computational workings actually buying?",',
    ),
    # --- technomancy consent sentence, reworded in the two newer copies ---
    (
        "b01d.py",
        "The part that touches another person's attention, data or money needs their agreement, and preferably "
        "needs it in a form you could show someone afterwards. A great many online rituals fail this quietly, "
        "by including a share "
        "button in the middle of what was supposed to be a private charge.",
        "Anything that reaches another person's attention, data or money needs their agreement, and preferably "
        "needs it in a form you could show someone afterwards. A great many online workings fail this quietly, "
        "by leaving a share "
        "control sitting in the middle of what was supposed to be a private act.",
    ),
    (
        "b01f.py",
        "The part of the working that "
        "touches another person's attention, data or money needs their agreement, in a form you could show "
        "someone afterwards. This is "
        "different from the usual ethics discussion, which is about intention, and it is more useful "
        "because it is checkable.",
        "Only the part of the working that "
        "reaches someone else's attention, data or money needs their agreement, in a form you could show "
        "another person afterwards. This is "
        "different from the usual ethics discussion, which is about intention, and it is more useful "
        "because it is checkable.",
    ),
    (
        "b01f.py",
        "The part of the working that "
        "touches a device you alone own can be elaborate. The part that touches another person's attention, "
        "data or money requires their agreement, in a form you could show someone later. This is different "
        "from the usual ethics discussion, which is about intention, and it is more useful because it is "
        "checkable.",
        "The part of the working that "
        "touches a device you alone own can be elaborate. Anything that reaches another person's attention, "
        "their data or their money requires their agreement, obtained in a form you could show someone later. "
        "This is different from the usual ethics discussion, which is about intention, and it is more useful "
        "because it is checkable.",
    ),
]

if __name__ == "__main__":
    import os
    import sys

    here = os.path.join(os.path.dirname(os.path.abspath(__file__)))
    ok = 0
    for fname, old, new in PATCHES:
        path = os.path.join(here, fname)
        with open(path, encoding="utf-8") as fh:
            src = fh.read()
        n = src.count(old)
        if n != 1:
            print("SKIP %s : found %d occurrences of %r" % (fname, n, old[:60]))
            continue
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(src.replace(old, new))
        ok += 1
    print("APPLIED %d/%d patches" % (ok, len(PATCHES)))
    sys.exit(0 if ok == len(PATCHES) else 1)
