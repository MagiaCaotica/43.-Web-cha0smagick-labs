"""Phase 5 integrations: publish authored articles into sitemap.xml, llms.txt and blog/index.html.

Idempotent. Re-running never double-inserts: every write is guarded by a
membership test against the exact string that would be inserted.

Run:  python projects/data/yt-articles/integrate.py [--dry]
"""
from __future__ import annotations

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")

SITE = "https://cha0smagicklabs.com"
TODAY_ISO = "2026-09-26"
TODAY_HUMAN = "September 26, 2026"

SITEMAP = os.path.join(ROOT, "sitemap.xml")
LLMS = os.path.join(ROOT, "llms.txt")
INDEX = os.path.join(BLOG, "index.html")

CANONICAL_CATS = {
    "sigils", "divination", "dreaming", "goetia", "runes", "moon",
    "tarot", "iching", "basics", "reviews", "free-tools", "advanced",
}

# blog/index.html opens the card grid with this exact tag; new cards go right
# after it so they appear at the top of the blog.
POSTS_OPEN = '<div class="posts">'


def load_specs() -> dict:
    with open(os.path.join(HERE, "specs.json"), encoding="utf-8") as fh:
        raw = json.load(fh)
    return {str(s["n"]): s for s in raw}


def read(path: str) -> str:
    """Read WITHOUT newline translation.

    newline="" is mandatory here. The default (None) puts the stream in
    universal-newline mode, which silently rewrites every CRLF to LF. Writing
    that string back re-saves the whole file with different line endings —
    which is exactly how sitemap.xml lost its CRLF on the first run.
    """
    with open(path, encoding="utf-8", newline="") as fh:
        return fh.read()


def write(path: str, text: str) -> None:
    """Preserve whatever newline convention the file already uses."""
    crlf = "\r\n" in text
    with open(path, "w", encoding="utf-8", newline="" if crlf else "\n") as fh:
        fh.write(text)


def clip(text: str, limit: int) -> str:
    text = " ".join(text.split())
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(",;:. ")
    return cut + "..."


def esc(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;")
                .replace(">", "&gt;").replace('"', "&quot;"))


def collect() -> list[dict]:
    """One row per shipped content record, joined to its spec."""
    specs = load_specs()
    rows = []
    cdir = os.path.join(HERE, "content")
    for name in sorted(os.listdir(cdir)):
        if not name.endswith(".json"):
            continue
        with open(os.path.join(cdir, name), encoding="utf-8") as fh:
            rec = json.load(fh)
        n = str(rec["n"])
        spec = specs.get(n)
        if spec is None:
            raise SystemExit(f"no spec row for n={n}")
        cat = spec["blog_category"]
        if cat not in CANONICAL_CATS:
            raise SystemExit(f"n={n} non-canonical category {cat!r}")
        if not os.path.isfile(os.path.join(BLOG, rec["slug"] + ".html")):
            raise SystemExit(f"n={n} rendered page missing: {rec['slug']}.html")
        rows.append({
            "n": n,
            "slug": rec["slug"],
            "cat": cat,
            "h1": rec["h1"],
            "seo_title": rec["seo_title"],
            "description": rec["description"],
            "views": spec.get("views", 0),
        })
    return rows


def do_sitemap(rows: list[dict]) -> tuple[int, int]:
    xml = read(SITEMAP)
    if "</urlset>" not in xml:
        raise SystemExit("sitemap.xml: no </urlset>")
    nl = "\r\n" if "\r\n" in xml else "\n"
    added = 0
    blocks = []
    for r in rows:
        loc = f"{SITE}/blog/{r['slug']}.html"
        if f"<loc>{loc}</loc>" in xml:
            continue
        blocks.append(
            f"  <url>{nl}"
            f"    <loc>{loc}</loc>{nl}"
            f"    <lastmod>{TODAY_ISO}</lastmod>{nl}"
            f"    <changefreq>weekly</changefreq>{nl}"
            f"    <priority>0.7</priority>{nl}"
            f"  </url>{nl}"
        )
        added += 1
    if blocks:
        xml = xml.replace("</urlset>", "".join(blocks) + "</urlset>", 1)
        write(SITEMAP, xml)
    return added, xml.count("<url>")


def do_llms(rows: list[dict]) -> tuple[int, int]:
    """Newest entries go at the top of the '## Recent Blog Posts' section."""
    txt = read(LLMS)
    marker = "## Recent Blog Posts"
    if marker not in txt:
        raise SystemExit("llms.txt: no '## Recent Blog Posts' section")
    nl = "\r\n" if "\r\n" in txt else "\n"
    head, _, rest = txt.partition(marker)
    added = 0
    lines = []
    for r in rows:
        url = f"{SITE}/blog/{r['slug']}.html"
        if url in txt:
            continue
        lines.append(f"- [{r['seo_title']}]({url}): {clip(r['description'], 300)}{nl}")
        added += 1
    if lines:
        # keep exactly one blank line between the heading and the first entry
        rest = rest.lstrip(nl)
        txt = f"{head}{marker}{nl}{nl}{''.join(lines)}{rest}"
        write(LLMS, txt)
    return added, txt.count(f"- [{SITE}/blog/")


def do_index(rows: list[dict]) -> tuple[int, int]:
    html = read(INDEX)
    at = html.find(POSTS_OPEN)
    if at < 0:
        raise SystemExit("blog/index.html: no <div class=\"posts\">")
    insert_at = at + len(POSTS_OPEN)
    # this file is CRLF; emitting LF cards would sprinkle bare LFs through it
    nl = "\r\n" if "\r\n" in html else "\n"
    cards = []
    for r in rows:
        slug = r["slug"]
        if html.count(f'href="{slug}.html"') > 0:
            continue
        cards.append(
            f'{nl}<div class="post-card" data-category="{r["cat"]}">{nl}'
            f'<div class="date">{TODAY_HUMAN}</div>{nl}'
            f'<h3><a href="{slug}.html">{esc(r["h1"])}</a></h3>{nl}'
            f'<div class="excerpt">{esc(clip(r["description"], 155))}</div>{nl}'
            f'<a class="read-more" href="{slug}.html">Read More →</a>{nl}'
            f'</div>{nl}'
        )
    if cards:
        html = html[:insert_at] + "".join(cards) + html[insert_at:]
        write(INDEX, html)
    return len(cards), html.count('class="post-card"')


def main() -> int:
    dry = "--dry" in sys.argv
    rows = collect()
    rows.sort(key=lambda r: -int(r["views"] or 0))
    print(f"shipped content records: {len(rows)}")
    for r in rows:
        print(f"  n={r['n']:>3} {r['views']:>6} {r['cat']:<12} {r['slug']}")
    if dry:
        print("\n--dry: no files written")
        return 0
    a, t = do_sitemap(rows)
    print(f"sitemap.xml   +{a} url(s), {t} total")
    a, _ = do_llms(rows)
    print(f"llms.txt      +{a} entries")
    a, t = do_index(rows)
    print(f"blog/index    +{a} cards, {t} post-cards total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
