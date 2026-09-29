# -*- coding: utf-8 -*-
"""Second b05a pass: 1 H2 + 5 eight-grams."""
import ast
import io
import sys

PATH = "content/_src/b05a.py"

PATCHES = [
    ('"h2": "Designing the record so it can contradict you",',
     '"h2": "A record built to argue with you",'),
    ('"The method is free and the record is free. A purchase is worth considering if you "',
     '"Both the method and the record cost nothing. What money buys is tidier export and a log you "'),
    ('"want the export to be clean and the log to be searchable, which is the unglamorous "',
     '"can search later, and that is the least interesting half of anything. It is not worth a subscription "'),
    ('"A log that has been edited into a good story is worse than no log, because it "',
     '"An entry rewritten afterwards into a tidy narrative is worse than leaving the page "'),
    ('"supplies confidence in place of the uncertainty the record existed to manage.",',
     '"blank, because it hands you certainty where the page was supposed to hold a question.",'),
]


def main():
    src = io.open(PATH, encoding="utf-8").read()
    lines = src.split("\n")
    for needle, repl in PATCHES:
        hits = [i for i, ln in enumerate(lines) if needle in ln]
        if len(hits) != 1:
            sys.exit("MISS %r count=%d" % (needle[:58], len(hits)))
        i = hits[0]
        indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
        lines[i] = indent + repl
        print("ok line %d" % (i + 1))
    ast.parse("\n".join(lines))
    io.open(PATH, "w", encoding="utf-8", newline="").write("\n".join(lines))
    print("applied %d" % len(PATCHES))


if __name__ == "__main__":
    main()
