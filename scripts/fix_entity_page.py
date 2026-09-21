#!/usr/bin/env python3
"""Fix Article JSON-LD missing mainEntityOfPage (finding 3.5.1, MASTER_EXECUTION_PLAN.md).

148 of 467 blog articles have Article JSON-LD without mainEntityOfPage
(Rich Results validator treats this as incomplete). Adds
{"@type":"WebPage","@id":<canonical>} from the article's canonical URL.

Idempotent: only touches scripts missing the key. Re-run = no changes.

NO NEW DEPENDENCIES (stdlib only).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "blog"

_LD = re.compile(
    r'(<script type="application/ld\+json">)(\{.*?\})(</script>)',
    re.DOTALL,
)
_CANON = re.compile(r'<link rel="canonical" href="(.*?)"', re.IGNORECASE)


def fix_article_ld(html: str, canonical: str) -> str:
    changed = False

    def replace(match: re.Match[str]) -> str:
        nonlocal changed
        try:
            data = json.loads(match.group(2))
        except json.JSONDecodeError:
            return match.group(0)
        if not isinstance(data, dict) or data.get("@type") != "Article":
            return match.group(0)
        if "mainEntityOfPage" in data:
            return match.group(0)
        data["mainEntityOfPage"] = {"@type": "WebPage", "@id": canonical}
        changed = True
        return match.group(1) + json.dumps(data, ensure_ascii=False) + match.group(3)

    updated = _LD.sub(replace, html)
    return updated if changed else html


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    fixed = 0
    no_canonical = 0
    total = 0

    for path in sorted(BLOG_DIR.glob("*.html")):
        total += 1
        html = path.read_text(encoding="utf-8", errors="replace")
        if "_ld+json" not in html and "ld+json" not in html:
            continue
        canon_m = _CANON.search(html)
        if not canon_m:
            no_canonical += 1
            continue
        updated = fix_article_ld(html, canon_m.group(1))
        if updated == html:
            continue
        if not dry_run:
            path.write_text(updated, encoding="utf-8")
        fixed += 1

    mode = "DRY-RUN" if dry_run else "WRITE"
    print(f"[{mode}] fixed={fixed} no-canonical={no_canonical} (total={total})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
