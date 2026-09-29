"""Apply targeted text patches to content/<n>.json to clear QA gate failures.

Patches are exact-substring replacements on the raw file text, so the existing
human-authored formatting survives untouched. Every patch is validated three
ways before anything is written: the old string must be present exactly once,
the file must still parse, and the parsed object must still carry the full
record schema. A file that fails any check is reported and left alone.

Usage:  python _patch_gates.py
"""
from __future__ import annotations

import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
CONTENT = os.path.join(HERE, "content")

REQUIRED = ("n", "slug", "h1", "seo_title", "description", "keywords",
            "published", "published_human", "lede", "sections", "faq", "related")

# (n, old, new, why)
PATCHES = (
    # -- n=164: dangling `related` slug + H2 duplicated from n=26
    (164,
     '"divination-practice-daily-beginner"',
     '"rune-divination-for-daily-guidance-a-gentle-start"',
     "related slug pointed at a blog file that does not exist"),
    (164,
     '"Starting a Daily Divination Practice from Scratch"',
     '"Rune Divination for Daily Guidance: A Gentle Start"',
     "related title must match the slug it now points at"),
    (164,
     '"h2": "Consistency is not prediction"',
     '"h2": "Consistency is not the same as accuracy"',
     "H2 reused from n=26 (corpus reused_h2 gate)"),

    # -- H2 duplicated between n=78 and n=103
    (103,
     '"h2": "Five ways this goes wrong"',
     '"h2": "Five failure modes, and what triggers them"',
     "H2 reused from n=78 (corpus reused_h2 gate)"),

    # -- 8-gram "and it is the only version of the" in n=68, n=151, n=225
    (151,
     ", and it is the only version of the question you can answer honestly.",
     ", and only the dated version of that question can be answered honestly.",
     "8-gram shared with n=68 and n=225 (NGRAM_MAX_ARTICLES=2)"),
    (225,
     ", and it is the only version of the claim that survives contact with a probability calculator.",
     ", and only the narrow version of that claim survives contact with a probability calculator.",
     "8-gram shared with n=68 and n=151"),

    # -- 8-gram "and it is worth naming because it is" in n=103, n=129, n=195
    (129,
     "The real overlap is functional and it is worth naming because it is the part that survives.",
     "The real overlap is functional, and that is the part that survives.",
     "8-gram shared with n=103 and n=195"),
    (195,
     "There is a category of servitor that should never be built, and it is worth naming because it is the one most often requested.",
     "There is a category of servitor that should never be built, and it happens to be the one most often requested.",
     "8-gram shared with n=103 and n=129"),

    # -- n=202: banned phrase
    (202,
     "the transition is often seamless",
     "the transition is often unnoticed",
     "banned phrase 'seamless' (slop.BANNED_PHRASES)"),
)


def apply(n, old, new):
    p = os.path.join(CONTENT, "%d.json" % n)
    with open(p, encoding="utf-8") as f:
        raw = f.read()
    count = raw.count(old)
    if count != 1:
        return n, "SKIP(old appears %dx)" % count, None
    new_raw = raw.replace(old, new, 1)
    try:
        obj = json.loads(new_raw)
    except json.JSONDecodeError as e:
        return n, "ABORT(patch breaks JSON: %s)" % e, None
    missing = [k for k in REQUIRED if k not in obj]
    if missing:
        return n, "ABORT(schema missing %s)" % missing, None
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_raw)
    return n, "ok", obj["slug"]


def main():
    applied = failed = 0
    for n, old, new, why in PATCHES:
        n, status, slug = apply(n, old, new)
        print("[%-6s] n=%-4d %s" % (status.split("(")[0], n, why))
        if status == "ok":
            applied += 1
        elif status.startswith(("SKIP", "ABORT")):
            print("         %s" % status)
            failed += 1
    print("\npatches %d | applied %d | needs review %d" % (len(PATCHES), applied, failed))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
