# -*- coding: utf-8 -*-
"""Post-boost tuning for b05b.py.

(a) n=136 is one section over the 16 cap: delete one of its spliced sections.
(b) All three records are short of the ~1,900 body-word target, and n=135 and
    n=137 are already AT the 16-section ceiling, so the only way to add words
    is to extend existing paragraphs. `extend()` appends a sentence to the end
    of a named paragraph, found by locating its opening words on a single
    physical line and walking forward to that paragraph's terminating line.
"""
import ast
import io
import re
import sys

PATH = "content/_src/b05b.py"

# (a) section to delete from n=136, identified by its h2
DELETE_H2 = "What a season of this is supposed to produce"

# (b) paragraph-opening fragment -> sentence to append
EXTEND = [
    # n=135
    ("needs no tools, it takes about two minutes",
     " A ritual that can be done in a queue is a ritual that will actually be done when it is "
     "needed, which is the only property that has kept it in continuous use."),
    ("which makes it unusually safe to hand to a beginner",
     " It is also the version people are least embarrassed to be seen doing, and the social "
     "cost of a ritual is a real cost that this one happens to avoid."),
    # n=136
    ("The second common break is editing the sentence after a disappointing week",
     " A sigil is not a wish, and the difference shows up in how the sentence is written, which "
     "is why the whole method begins with writing rather than with drawing."),
    ("it is a piece of attention hygiene rather than a superstition",
     " None of it requires belief in an external being, which is the part that makes the "
     "sequence usable by somebody who would find a theology embarrassing."),
    # n=137
    ("It is not a device for trapping anything and it is not more powerful than the",
     " Treating it as a trap is the commonest way the classical material gets turned into "
     "something it was not built to be."),
    ("failure modes, and a person expecting one and performing the other will draw",
     " The vocabulary distinction exists so that this confusion can be corrected, and most "
     "modern writing removes the means of correcting it."),
    ("Read the entry, not the summary of the entry",
     " If you cannot do that, you have not understood it yet, and an entity you do not "
     "understand becomes a surface you project onto rather than a tool you work with."),
]


def delete_section(src, h2):
    marker = '        {\n            "h2": "%s",' % h2
    start = src.find(marker)
    if start < 0:
        sys.exit("h2 not found: %s" % h2)
    end = src.find("\n        },\n", start)
    if end < 0:
        sys.exit("no terminator for %s" % h2)
    return src[:start] + src[end + len("\n        },\n"):]


def extend(src, frag, sentence):
    idx = src.find(frag)
    if idx < 0:
        sys.exit("fragment not found: %s" % frag[:50])
    # walk forward to the terminating line of that paragraph
    line_start = src.rfind("\n", 0, idx) + 1
    pos = line_start
    while True:
        nl = src.find("\n", pos)
        if nl < 0:
            sys.exit("ran off the end looking for the end of: %s" % frag[:50])
        line = src[pos:nl]
        stripped = line.rstrip()
        # A wrapped continuation line also ends with '"' (the quote closes the
        # implicit concatenation), but it is preceded by a space. The last
        # line of a paragraph ends with '",' (non-final) or a bare '"' that is
        # NOT preceded by a space (final paragraph).
        if stripped.endswith('",') or (
            stripped.endswith('"') and not stripped.endswith(' "')
        ):
            # Append the sentence INSIDE the string literal: re-emit this
            # physical line with the text inserted before its closing quote.
            if stripped.endswith('",'):
                new_line = stripped[:-2] + " " + sentence.strip() + '",'
            else:
                new_line = stripped[:-1] + " " + sentence.strip() + '"'
            return src[:pos] + new_line + src[nl:]
        pos = nl + 1


def main():
    src = io.open(PATH, encoding="utf-8").read()
    src = delete_section(src, DELETE_H2)
    for frag, sentence in EXTEND:
        src = extend(src, frag, sentence)
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("deleted 1 section from n=136, extended %d paragraphs" % len(EXTEND))


if __name__ == "__main__":
    main()
