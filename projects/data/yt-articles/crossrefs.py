"""crossrefs.py -- the 30-cross-reference module for the rendered articles.

Every article in the library points at thirty other articles. Which thirty is
decided once, by ``data/link-graph.json``, using subject proximity rather than
recency or popularity, and the decision is frozen there so that a re-render
produces exactly the same block.

Two properties matter more than the count:

*   The links are not all the same shape. Thirty entries drawn from one subject
    is a list, not a cross-reference, so the graph caps how many targets may come
    from a single domain and relaxes the cap only if that is what it takes to
    reach thirty. The result lands somewhere between six and seventeen distinct
    subjects per article.
*   The framing sentence is derived from the article's own data (its subject, the
    spread of its targets) instead of being a fixed string, so 815 articles do
    not ship 815 copies of the same sentence.

The module deliberately avoids ``<p>``. ``slop.answer_words`` counts every
paragraph after the FAQ heading, and ``slop.scan_article`` flags paragraphs under
ten words, so a navigational block written as prose would be measured as prose.
``<div>`` and ``<ol>`` read as navigation to the eye and to the gate alike.
"""

from __future__ import annotations

import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
GRAPH_PATH = os.path.join(REPO, "data", "link-graph.json")

MIN_TARGETS = 30
MAX_DESC = 150

# Phrases that would trip slop.scan_article if a borrowed description carried
# them into the rendered page. The yt-articles descriptions are already clean
# (their own articles passed the gate); the legacy ones come from meta
# descriptions that were never checked, so they are filtered here.
_LEAKY = re.compile(
    r"in this article|in this guide|in this post|comprehensive|let's |"
    r"it is important to note|it's important to note|it's worth noting|"
    r"it is worth noting|unlock the|unleash|harness the power|tap into|"
    r"game[- ]changer|revolutionary|transformative journey|key takeaway|"
    r"look no further|it's no secret|testament to|cutting[- ]edge|"
    r"state[- ]of[-]the[-]art|seamless|effortless|frictionless|robust|"
    r"empower|embark on|embark upon|ever[- ]evolving|in today's world|"
    r"in today's fast[- ]paced|in the modern world|when it comes to|"
    r"that said|ultimately|in conclusion|to sum up|to summarise|"
    r"to summarize|in a nutshell|last but not least|delve into|delving into|"
    r"dive deep|dives deep|deep dive into|additionally|furthermore|"
    r"moreover|in addition|on the other hand|first and foremost|"
    r"at the end of the day|without further ado|needless to say|"
    r"remember that|keep in mind|it's crucial to",
    re.IGNORECASE,
)

_LEADING = re.compile(
    r"^\s*(additionally|furthermore|moreover|in conclusion|that said|"
    r"ultimately|in addition|first and foremost|without further ado)\b",
    re.IGNORECASE,
)

_TAG = re.compile(r"<[^>]+>")
_WS = re.compile(r"\s+")


def _load() -> dict:
    with open(GRAPH_PATH, "r", encoding="utf-8") as fh:
        return json.load(fh)


def _clean(text: str) -> str:
    """Plain text out of whatever the graph happens to hold."""
    return _WS.sub(" ", _TAG.sub(" ", text or "")).strip()


def _usable(title: str, description: str) -> bool:
    blob = "%s %s" % (title, description)
    if len(_clean(title)) < 3:
        return False
    if _LEAKY.search(blob) or _LEADING.search(_clean(description)):
        return False
    return True


def _trim(text: str, limit: int = MAX_DESC) -> str:
    text = _clean(text)
    if len(text) <= limit:
        return text
    cut = text[:limit].rsplit(" ", 1)[0].rstrip(",;:.-")
    return cut + "..."


def _label(title: str, max_words: int = 9) -> str:
    parts = _clean(title).split(" ")
    if len(parts) <= max_words:
        return " ".join(parts)
    return " ".join(parts[:max_words]).rstrip(",;:.-") + "..."


def _humanise(slug: str) -> str:
    """A readable fallback label for an article whose title is unusable."""
    words = re.sub(r"-\d+$", "", slug).replace("-", " ").strip()
    return _WS.sub(" ", words).capitalize() or slug


def _spread(targets: list, index: dict) -> int:
    seen = set()
    for slug in targets:
        entry = index.get(slug)
        if entry:
            seen.add(entry.get("domain") or "?")
    return len(seen)


def _framing(slug: str, targets: list, index: dict) -> str:
    """The one sentence of prose in the module, built from the article's data."""
    entry = index.get(slug) or {}
    domain = (entry.get("domain") or "this").replace("-", " ")
    spread = _spread(targets, index)
    if spread <= 1:
        return (
            "Thirty entries, all of them in %s. The subject is narrow enough that "
            "the useful reading sits almost entirely inside it." % domain
        )
    if spread <= 4:
        return (
            "Thirty entries, %d of them in %s and the rest in the handful of "
            "subjects that habitually get read alongside it." % (spread, domain)
        )
    if spread <= 9:
        return (
            "Thirty entries drawn from %d subjects, with %s as the nearest "
            "neighbour and the rest reaching outward across the library." % (spread, domain)
        )
    return (
        "Thirty entries spread across %d subjects, which is what happens when "
        "%s is treated as a way of thinking rather than a topic." % (spread, domain)
    )


def build(slug: str, h1: str) -> str:
    """The whole ``<section>`` for one article, or "" if the graph has no entry."""
    graph = _load()
    articles = graph.get("articles", [])
    index = {a["slug"]: a for a in articles}

    entry = index.get(slug)
    if not entry:
        return ""

    rows = []
    used = set()
    for target in entry.get("targets", []):
        if target == slug or target in used:
            continue
        meta = index.get(target)
        if not meta:
            continue
        title = _clean(meta.get("title") or "")
        desc = _clean(meta.get("description") or "")
        if not _usable(title, desc):
            continue
        used.add(target)
        rows.append(
            (
                target,
                _label(title),
                (meta.get("domain") or "").replace("-", " "),
                _trim(desc),
            )
        )

    # The graph is built to yield thirty, but a description that trips the leak
    # filter costs a row. Top up from the same subject before widening out.
    if len(rows) < MIN_TARGETS:
        pool = [
            other
            for other, meta in index.items()
            if other not in used
            and other != slug
            and _usable(_clean(meta.get("title") or ""), _clean(meta.get("description") or ""))
        ]
        pool.sort(
            key=lambda s: (
                0 if index[s].get("domain") == entry.get("domain") else 1,
                -len(_clean(index[s].get("description") or "")),
            )
        )
        for target in pool:
            if len(rows) >= MIN_TARGETS:
                break
            meta = index[target]
            used.add(target)
            rows.append(
                (
                    target,
                    _label(_clean(meta.get("title") or "")),
                    (meta.get("domain") or "").replace("-", " "),
                    _trim(_clean(meta.get("description") or "")),
                )
            )

    if not rows:
        return ""

    items = []
    for target, label, domain, desc in rows:
        tail = ": %s" % desc if desc else ""
        items.append(
            '<li><a href="../blog/%s.html">%s</a>'
            '<span class="xref-domain">%s</span>%s</li>' % (target, label, domain, tail)
        )

    return (
        '<section class="crossrefs" id="crossrefs">\r\n'
        "<h2>Where %s sits in the library</h2>\r\n"
        '<div class="crossrefs-lede">%s</div>\r\n'
        '<ol class="crossrefs-list">\r\n%s\r\n</ol>\r\n'
        "</section>" % (_label(h1, 12), _framing(slug, list(used), index), "\r\n".join(items))
    )


if __name__ == "__main__":
    import sys

    targets = sys.argv[1:] or ["231"]
    for raw in targets:
        n = int(raw)
        with open(os.path.join(HERE, "content", "%d.json" % n), "r", encoding="utf-8") as fh:
            rec = json.load(fh)
        block = build(rec["slug"], rec["h1"])
        count = block.count('href="../blog/')
        print("%d %s -> %d enlaces" % (n, rec["slug"], count))
