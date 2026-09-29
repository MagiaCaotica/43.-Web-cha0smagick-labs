# -*- coding: utf-8 -*-
"""Remove every section whose h2 appears in BOOST_H2 from a bNNx.py file.

Textual, not AST-based, so the file's formatting survives. Each section is a
contiguous run starting at `        {\n            "h2": "<X>",` and ending at
the matching `        },\n` (or `        }\n` if it is the last one).
"""
import ast
import io
import re
import sys

PATH = sys.argv[1] if len(sys.argv) > 1 else "content/_src/b04g.py"

BOOST_H2 = [
    # first _boost04g run
    "The four ways a claim gets smuggled past you",
    "Why the founders hedged, and what the hedging was for",
    "What to write down so the record can argue back",
    "A defensible season, described as a sequence",
    "The two days that produced the clearest result",
    "What it felt like, and why that is a separate question",
    "The corrections I had to make to my own method",
    "A protocol you can run on one question",
    "What I would tell someone starting now",
    "The part where the plan stops being about sigils",
    "Correspondence, and the honest case for ignoring it",
    "Timing, and the specific error beginners make with it",
    "Writing the ninety-day review honestly",
    "Where most beginners actually stop, and why",
]

src = io.open(PATH, encoding="utf-8").read()
removed = 0
for h2 in BOOST_H2:
    marker = '        {\n            "h2": "%s",' % h2
    start = src.find(marker)
    if start < 0:
        continue
    # find the end of this section: the next line that is exactly 8-space "},"
    end = src.find("\n        },\n", start)
    if end < 0:
        sys.exit("no terminator for %s" % h2)
    end += len("\n        },\n")
    src = src[:start] + src[end:]
    removed += 1

ast.parse(src)
io.open(PATH, "w", encoding="utf-8", newline="").write(src)
print("removed %d boost sections from %s" % (removed, PATH))
