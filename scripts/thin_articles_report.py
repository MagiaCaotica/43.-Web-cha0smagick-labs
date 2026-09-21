#!/usr/bin/env python3
"""Thin-articles progress tracker (task 3.4.1, MASTER_EXECUTION_PLAN.md).

Scans blog/*.html, computes visible-text word counts, and regenerates
docs/thin-articles-progress.md on demand. Re-runnable after every rewrite
batch: an article flips from pending to done automatically once its word
count exceeds the target (1500).

Verification per plan: word count > 1500, data/examples, internal links.
"""
from __future__ import annotations

import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = ROOT / "blog"
REPORT_PATH = ROOT / "docs" / "thin-articles-progress.md"

THIN_THRESHOLD = 800      # plan: thin set = articles under 800 words
DONE_THRESHOLD = 1500     # plan verification: rewrite is done above 1500 words

_SCRIPT = re.compile(r"<script\b.*?</script>", re.IGNORECASE | re.DOTALL)
_STYLE = re.compile(r"<style\b.*?</style>", re.IGNORECASE | re.DOTALL)
_TAG = re.compile(r"<[^>]+>")


def visible_text(html: str) -> str:
    """Strip scripts, styles and tags to approximate visible text."""
    text = _SCRIPT.sub(" ", html)
    text = _STYLE.sub(" ", text)
    text = _TAG.sub(" ", text)
    return text


def word_count(html: str) -> int:
    return len(visible_text(html).split())


def extract_title(html: str) -> str:
    match = re.search(r"<title>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
    return match.group(1).strip() if match else "(no title)"


def status_for(words: int) -> str:
    if words > DONE_THRESHOLD:
        return "done"
    if words >= THIN_THRESHOLD:
        return "expand"
    return "pending"


def scan() -> list[dict]:
    articles: list[dict] = []
    for path in sorted(BLOG_DIR.glob("*.html")):
        try:
            html = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            print(f"WARN: cannot read {path.name}: {exc}")
            continue
        words = word_count(html)
        articles.append({
            "file": path.name,
            "title": extract_title(html),
            "words": words,
            "status": status_for(words),
        })
    return articles


def build_report(articles: list[dict]) -> str:
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    thin = [a for a in articles if a["words"] < THIN_THRESHOLD]
    expand = [a for a in articles if a["status"] == "expand"]
    done = [a for a in articles if a["status"] == "done"]
    lines = [
        "# Thin Articles Progress — task 3.4.1",
        "",
        f"_Regenerated: {now} by `scripts/thin_articles_report.py`._",
        "",
        "Re-runnable: an article flips from `pending` to `done` automatically",
        "once its visible-text word count exceeds 1500 (plan verification).",
        "",
        "## Summary",
        "",
        f"- Total articles: **{len(articles)}**",
        f"- Pending (<800 words): **{len(thin)}**",
        f"- Expand (800-1500): **{len(expand)}**",
        f"- Done (>1500): **{len(done)}**",
        "",
        "## Pending + Expand (rewrite queue, thinnest first)",
        "",
        "| # | File | Words | Status |",
        "|---|------|-------|--------|",
    ]
    queue = sorted(thin + expand, key=lambda a: a["words"])
    for i, a in enumerate(queue, 1):
        title = a["title"][:70].replace("|", "/")
        lines.append(f"| {i} | [{a['file']}]({a['file']}) | {a['words']} | {a['status']} |")
    lines.extend([
        "",
        "## Done (rewritten)",
        "",
    ])
    if done:
        lines.append("| # | File | Words |")
        lines.append("|---|------|-------|")
        for i, a in enumerate(sorted(done, key=lambda a: a["file"]), 1):
            title = a["title"][:70].replace("|", "/")
            lines.append(f"| {i} | [{a['file']}]({a['file']}) | {a['words']} |")
    else:
        lines.append("_None yet._")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    articles = scan()
    report = build_report(articles)
    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(report, encoding="utf-8")
    thin = sum(1 for a in articles if a["words"] < THIN_THRESHOLD)
    done = sum(1 for a in articles if a["status"] == "done")
    print(f"Scanned {len(articles)} articles: {thin} pending (<800), "
          f"{done} done (>1500)")
    print(f"Report: {REPORT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
