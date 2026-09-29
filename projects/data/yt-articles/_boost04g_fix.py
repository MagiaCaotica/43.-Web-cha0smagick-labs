# -*- coding: utf-8 -*-
"""Undo the mis-ordered insert in _boost04g.py, then redo it correctly.

The first run inserted all three blocks before the FIRST anchor occurrence
instead of one before each. This strips them and re-inserts from the last
article backwards, so each block lands in its own record.
"""
import ast
import io
import sys

PATH = "content/_src/b04g.py"
ANCHOR = '        ],\n        "faq": ['

sys.path.insert(0, ".")
from _boost04g import EXTRA  # noqa: E402


def main():
    src = io.open(PATH, encoding="utf-8").read()
    # 1. strip every inserted block, in the order they were added
    for block in EXTRA:
        token = block.rstrip("\n") + "\n"
        if token in src:
            src = src.replace(token, "", 1)
    if src.count(ANCHOR) != 3:
        sys.exit("after strip, anchor count is %d" % src.count(ANCHOR))
    # 2. re-insert from the last article backwards
    for block in reversed(EXTRA):
        token = block.rstrip("\n") + "\n"
        idx = src.rfind(ANCHOR)
        src = src[:idx] + token + src[idx:]
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("redone: 5 sections each, one block per record")


if __name__ == "__main__":
    main()
