# One-off line-number patcher for content/_src/*.py.
# Anchors on (filename, 1-based line number, expected substring, replacement substring).
# Refuses if the expected substring is not on that exact line, and refuses if the
# result does not parse. Safe to re-run: an already-applied line is a no-op.

import ast
import io
import sys

PATCHES = [
    ("b04c.py", 215, "worth your time",
     '                "How much of the reading list genuinely repays the effort?",'),
    ("b04c.py", 447, "worth your time",
     '                "Which of these texts is worth the hours it will take you?",'),
    ("b04c.py", 231, "subscription worth it",
     '                "What does the price actually cover in a bundle like this?",'),
    ("b04c.py", 678, "genuinely refuse to support",
     '                "What would a fair-minded version of this material concede?",'),
    ("b04d.py", 108, "worth your time",
     '                "How would a working occultist order this material?",'),
    ("b04d.py", 239, "subscription worth it",
     '                "Is a paid shelf of history books worth the money?",'),
]

BASE = "content" + "\\_src"


def main():
    by_file = {}
    for name, line, expect, repl in PATCHES:
        by_file.setdefault(name, []).append((line, expect, repl))

    for name, edits in sorted(by_file.items()):
        path = BASE + "\\" + name
        lines = io.open(path, encoding="utf-8").read().split("\n")
        for line_no, expect, repl in edits:
            idx = line_no - 1
            if idx >= len(lines):
                print("MISS %s:%d out of range" % (name, line_no))
                sys.exit(1)
            cur = lines[idx]
            if expect in cur:
                if cur == repl:
                    print("ok (already applied) %s:%d" % (name, line_no))
                    continue
                lines[idx] = cur.replace(expect, "", 1) and repl or repl
                print("ok %s:%d" % (name, line_no))
                continue
            if expect not in cur and repl == cur:
                print("ok (already applied) %s:%d" % (name, line_no))
                continue
            print("MISS %s:%d expected %r in %r" % (name, line_no, expect, cur[:90]))
            sys.exit(1)
        text = "\n".join(lines)
        ast.parse(text)
        io.open(path, "w", encoding="utf-8", newline="").write(text)
        print("WROTE %s" % path)


if __name__ == "__main__":
    main()
