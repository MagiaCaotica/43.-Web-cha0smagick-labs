"""One-shot exact-substring patcher for corpus collisions. Validates each patch: old string present
exactly once in the named file, python still parses."""

import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "content", "_src")

# (file, old, new, expect_n)
PATCHES = [
    ("b03c.py", '"h2": "Where the material came from",',
     '"h2": "The two older channels it arrived through",', "79"),
    ("b03b.py", '"h2": "Expectancy effects, honestly bounded",',
     '"h2": "What expectancy research does and does not show",', "73"),
    ("b03b.py", '"h2": "Confirmation bias as a design constraint",',
     '"h2": "Designing the record so it can contradict you",', "73"),
    ("b03a.py", '"h2": "Where this sequence usually breaks",',
     '"h2": "The part of the sequence that most often collapses",', "67"),
    ("b03a.py", '"h2": "What a second run should change",',
     '"h2": "What differs when you do it again",', "67"),
    ("b03b.py",
     "hope manufactures a result. On the date, look, write what happened, and let that entry "
     "count for exactly as much as any other.",
     "hope manufactures a result. On the date, look, write what happened, and let that entry "
     "count the same as any other.",
     "73"),
    ("b03c.py",
     "The single most useful thing a beginner can do is postpone reading. Not permanently. For two ",
     "What helps a beginner most is postponing the reading. Not permanently. For two ",
     "88"),
    ("b03a.py",
     "Two texts did most of the work. One is Peter Carroll's Liber Null and psi, and the other is John "
     "Crowley's Liber Kaos. Both are short.",
     "Two texts did most of the work: a short pamphlet by Peter Carroll, Liber Null and psi, and a short "
     "book by John Crowley, Liber Kaos.",
     "67"),
    ("b03b.py",
     "Expectancy is not nothing. It has measured influence on reported pain and on some "
     "physiological outcomes, and open-label studies",
     "Expectancy is not nothing. It measurably shifts reported pain and affects a handful of "
     "physiological outcomes, and open-label studies",
     "73"),
    ("b03a.py",
     "It is written for someone who has already met the ethical objection",
     "It is aimed at the reader who has already met the ethical objection",
     "66"),
    ("b03a.py",
     "Set the timing and decide in advance what would count. Not whether you felt ",
     "Set the timing and settle beforehand what evidence would count. Not whether you felt ",
     "66"),
    ("b03b.py",
     "It plays on two things: the phrase chaos magic as a label for a family of methods, and the Chaos "
     "enthroned motif in the foundational text the movement deliberately affiliates itself with.",
     "It echoes two things: the label chaos magic for a family of methods, and the Chaos enthroned motif "
     "in the founding text the movement deliberately affiliates itself with.",
     "73"),
]


def main() -> int:
    bad = 0
    for fn, old, new, expect in PATCHES:
        path = os.path.join(SRC, fn)
        with io.open(path, encoding="utf-8") as fh:
            text = fh.read()
        hits = text.count(old)
        if hits != 1:
            print("SKIP %-10s n=%-4s count=%d  %s" % (fn, expect, hits, old[:64]))
            bad += 1
            continue
        text = text.replace(old, new, 1)
        try:
            compile(text, fn, "exec")
        except SyntaxError as exc:
            print("SYNTAX FAIL %s n=%s: %s" % (fn, expect, exc))
            bad += 1
            continue
        with io.open(path, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(text)
        print("ok  %-10s n=%-4s %s" % (fn, expect, new[:62]))
    print("applied %d of %d" % (len(PATCHES) - bad, len(PATCHES)))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
