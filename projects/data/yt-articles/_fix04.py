"""PATCHES: (line number, expected substring, replacement line). Run after reading the file."""
import ast
import sys

PATH = "content/_src/b04f.py"

PATCHES = [
    (
        '"h2": "Step three, construct the seal",',
        '"h2": "Step three, drawing the seal",',
    ),
    (
        '"h2": "Step four, the working itself",',
        '"h2": "Step four, the contact itself",',
    ),
    (
        '"h2": "What actually tends to happen",',
        '"h2": "What a first series actually produces",',
    ),
    (
        '"h2": "When to stop, and what to write when you do",',
        '"h2": "The stopping rule, and what to write at the end",',
    ),
    (
        '"h2": "Choosing by office rather than by reputation",',
        '"h2": "Picking by stated office, never by fame",',
    ),
    (
        '"h2": "Why the modern approach relaxes the framework",',
        '"h2": "What the modern reading gives up, and what it keeps",',
    ),
    (
        '"h2": "A defensible first working",',
        '"h2": "One first working, specified",',
    ),
]


def main():
    with open(PATH, encoding="utf-8") as f:
        text = f.read()
    lines = text.split("\n")
    for old, new in PATCHES:
        hits = [i for i, l in enumerate(lines) if old in l]
        if len(hits) != 1:
            print("MISS count=%d for %r" % (len(hits), old[:60]))
            return 1
        i = hits[0]
        indent = len(lines[i]) - len(lines[i].lstrip())
        lines[i] = " " * indent + new
        print("ok line %d" % (i + 1))
    ast.parse("\n".join(lines))
    with open(PATH, "w", encoding="utf-8", newline="") as f:
        f.write("\n".join(lines))
    print("applied %d of %d" % (len(PATCHES), len(PATCHES)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
