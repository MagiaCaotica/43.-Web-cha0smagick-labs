#!/usr/bin/env python3
"""Article -> product mapping (task 3.4.6, MASTER_EXECUTION_PLAN.md).

Reads scripts/bots/data/offers.json (source of truth, task 3.1.1), scores
each product against every blog article's title/description/body keywords,
and rewrites each article's <section class="internal-links"> ("Related
Resources") with article-specific app/book links plus the bundle offer.

Idempotent: scoring is deterministic, so re-running produces the same
output. Re-run after every rewrite batch to keep mappings in sync with
new or changed articles.

NO NEW DEPENDENCIES (stdlib only).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "blog"
OFFERS_PATH = ROOT / "scripts" / "bots" / "data" / "offers.json"

_SCRIPT = re.compile(r"<script\b.*?</script>", re.IGNORECASE | re.DOTALL)
_STYLE = re.compile(r"<style\b.*?</style>", re.IGNORECASE | re.DOTALL)
_TAG = re.compile(r"<[^>]+>")
_SECTION = re.compile(
    r'<section class="internal-links".*?</section>', re.IGNORECASE | re.DOTALL
)

_SECTION_STYLE = (
    'margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); '
    'border: 1px solid var(--border-subtle); border-radius: 8px;'
)

_TOP_APPS = 3
_TOP_BOOKS = 2


def strip_html(html: str) -> str:
    text = _SCRIPT.sub(" ", html)
    text = _STYLE.sub(" ", text)
    return _TAG.sub(" ", text)


def extract_meta(html: str) -> tuple[str, str]:
    title_m = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    desc_m = re.search(
        r'<meta\s+name="description"\s+content="(.*?)"', html, re.IGNORECASE
    )
    title = title_m.group(1) if title_m else ""
    desc = desc_m.group(1) if desc_m else ""
    return title, desc


def tokenize(text: str) -> list[str]:
    words = re.findall(r"[a-z0-9]+", text.lower())
    tokens = set()
    for word in words:
        tokens.add(word)
        if len(word) > 3 and word.endswith("s"):
            tokens.add(word[:-1])
    return tokens


def product_tokens(product: dict) -> set[str]:
    tokens = set(tokenize(product.get("name", "")))
    for tag in product.get("tags", []):
        tokens.update(tokenize(tag))
    return tokens


def funnel_to_relative(funnel: str) -> str:
    """https://cha0smagicklabs.com/apps/psi-gym.html -> ../apps/psi-gym.html"""
    path = funnel.split("://", 1)[-1].split("/", 1)[-1]
    return f"../{path}"


def score_product(article_tokens: set[str], strong_text_tokens: set[str],
                  product: dict) -> int:
    ptoks = product_tokens(product)
    strong_hits = len(article_tokens & ptoks & strong_text_tokens)
    weak_hits = len(article_tokens & ptoks)
    return 2 * strong_hits + max(0, weak_hits - strong_hits)


def rank(products: list[dict], article_tokens: set[str],
         strong_text_tokens: set[str], top_n: int) -> list[dict]:
    scored = [
        (score_product(article_tokens, strong_text_tokens, p), i, p)
        for i, p in enumerate(products)
    ]
    # score desc, then stable by catalog order
    scored.sort(key=lambda t: (-t[0], t[1]))
    return [p for _, _, p in scored[:top_n]]


def build_section(apps: list[dict], books: list[dict], bundle: dict) -> str:
    app_links = " | ".join(
        f'<a href="{funnel_to_relative(a["funnel"])}">{a["name"]}</a>'
        for a in apps
    )
    book_links = " | ".join(
        f'<a href="{funnel_to_relative(b["url"])}">{b["name"]}</a>'
        for b in books
    )
    return (
        f'<section class="internal-links" style="{_SECTION_STYLE}">\n'
        f'<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">'
        f"Related Resources</h3>\n"
        f'<div style="margin-bottom: 1rem;">\n'
        f'<strong style="color: var(--text-primary);">Apps:</strong> {app_links}\n'
        f"</div>\n"
        f'<div style="margin-bottom: 1rem;">\n'
        f'<strong style="color: var(--text-primary);">Books:</strong> {book_links}\n'
        f"</div>\n"
        f'<div>\n'
        f'<strong style="color: var(--text-primary);">Bundle:</strong> '
        f'<a href="{funnel_to_relative(bundle["url"])}">{bundle["name"]}</a> '
        f"({bundle['price']} — {bundle['shortDesc']})\n"
        f"</div>\n"
        f"</section>"
    )


def main() -> int:
    dry_run = "--dry-run" in sys.argv
    limit = 0
    if "--limit" in sys.argv:
        limit = int(sys.argv[sys.argv.index("--limit") + 1])

    offers = json.loads(OFFERS_PATH.read_text(encoding="utf-8"))
    apps = offers.get("apps", [])
    books = offers.get("books", [])
    bundle = offers.get("bundle", {})

    mapped = 0
    no_section = 0
    unchanged = 0
    files = sorted(BLOG_DIR.glob("*.html"))
    if limit:
        files = files[:limit]

    for path in files:
        html = path.read_text(encoding="utf-8", errors="replace")
        if 'class="internal-links"' not in html:
            no_section += 1
            continue

        title, desc = extract_meta(html)
        # Score from content EXCLUDING the current internal-links section:
        # the section's own product names would otherwise feed back into the
        # keyword corpus and shift rankings on re-run (non-idempotent).
        body_text = strip_html(_SECTION.sub(" ", html))
        article_tokens = tokenize(f"{title} {desc} {body_text}")
        # strong text = title + description + first 1200 chars of body
        strong_text_tokens = tokenize(f"{title} {desc} {body_text[:1200]}")

        top_apps = rank(apps, article_tokens, strong_text_tokens, _TOP_APPS)
        top_books = rank(books, article_tokens, strong_text_tokens, _TOP_BOOKS)
        new_section = build_section(top_apps, top_books, bundle)

        updated = _SECTION.sub(lambda _: new_section, html, count=1)
        if updated == html:
            unchanged += 1
            continue
        if not dry_run:
            path.write_text(updated, encoding="utf-8")
        mapped += 1
        if dry_run and mapped <= 5:
            names = ", ".join(a["name"].split(":")[0] for a in top_apps)
            bnames = ", ".join(b["name"] for b in top_books)
            print(f"  {path.name}: [{names}] | [{bnames}]")

    mode = "DRY-RUN" if dry_run else "WRITE"
    print(f"[{mode}] mapped={mapped} no-section={no_section} "
          f"already-current={unchanged} (total={len(files)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
