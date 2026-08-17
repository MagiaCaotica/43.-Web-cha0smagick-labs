# -*- coding: utf-8 -*-
"""
_rotate_lastmod.py — S5.2: Yearly lastmod freshness rotation for seasonal posts.

Reads the 10 Wave-C1 seasonal article files (article_111..120.py) and rotates
their `lastmod` key to today's date, so search engines see the content as fresh
when the season rolls around again. Run once per year (e.g. January) then
re-run `python scripts/build_10_articles.py` to regenerate the blog HTML.

Usage: python scripts/_rotate_lastmod.py [YYYY-MM-DD]
(defaults to today's date)
"""
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPTS = ROOT / "scripts"

SEASONAL_FILES = [SCRIPTS / f"article_{n}.py" for n in range(111, 121)]

NEW_LASTMOD = sys.argv[1] if len(sys.argv) > 1 else date.today().isoformat()

LASTMOD_RE = re.compile(r"('lastmod'\s*:\s*')\d{4}-\d{2}-\d{2}(')")


def rotate(path: Path) -> tuple[bool, str]:
    raw = path.read_text(encoding="utf-8")
    new, n = LASTMOD_RE.subn(rf"\g<1>{NEW_LASTMOD}\g<2>", raw)
    if n == 0:
        return False, "lastmod key not found"
    if n > 1:
        return False, f"WARN: {n} lastmod matches (expected 1) - not writing"
    if new == raw:
        return False, "already current"
    path.write_text(new, encoding="utf-8")
    return True, f"rotated to {NEW_LASTMOD}"


def main() -> None:
    print(f"Rotating lastmod to {NEW_LASTMOD} on {len(SEASONAL_FILES)} seasonal files")
    changed = 0
    for f in SEASONAL_FILES:
        ok, msg = rotate(f)
        if ok:
            changed += 1
        print(f"  {f.name}: {msg}")
    print(f"Done. {changed} file(s) updated.")


if __name__ == "__main__":
    main()