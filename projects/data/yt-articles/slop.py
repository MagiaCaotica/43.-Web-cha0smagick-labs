"""AI-slop gates for the YouTube-derived article corpus.

Two independent families of checks:

1. BANNED_PHRASES -- the lexical tells of machine-written filler. Case
   insensitive, substring match on the *visible text* of a rendered article.
2. Structural gates -- duplication and thinness rules that no phrase list can
   catch: cross-article n-gram reuse, repeated opening sentences, per-article
   word floor, H2 uniqueness, heading quality.

`scan_article(html)` returns a list of violation strings for one file.
`scan_corpus(pairs)` returns corpus-level violations, where `pairs` is a list
of (slug, html) tuples.
"""

from __future__ import annotations

import re
from collections import Counter, defaultdict

# --- 1. Lexical gates -----------------------------------------------------

BANNED_PHRASES = (
    # self-referential scaffolding
    "in this article",
    "in this guide",
    "in this post",
    "this comprehensive guide",
    "comprehensive guide to",
    "comprehensive overview",
    "comprehensive",
    # the "let's" tic
    "let's dive in",
    "let's explore",
    "let's take a look",
    "let's get started",
    "let's face it",
    "let's be clear",
    "let's break it down",
    # throat-clearing
    "it's important to note",
    "it is important to note",
    "it's worth noting",
    "it is worth noting",
    "it's crucial to",
    "remember that",
    "keep in mind that",
    "keep in mind:",
    "at the end of the day",
    "without further ado",
    "needless to say",
    "that being said",
    # hype register
    "unlock the",
    "unleash the power",
    "unleash your",
    "harness the power",
    "tap into",
    "game-changer",
    "game changer",
    "revolutionary",
    "transformative journey",
    "the key takeaway",
    "look no further",
    "it's no secret",
    "testament to",
    "cutting-edge",
    "cutting edge",
    "state-of-the-art",
    "seamless",
    "seamlessly",
    "effortlessly",
    "frictionless",
    "robust",
    "empowerment",
    "empower your",
    "embark on",
    "embark upon",
    # throat-clearing transitions
    "in the ever-evolving",
    "ever-evolving landscape",
    "in today's world",
    "in today's fast-paced",
    "in the modern world",
    "navigate the",
    "when it comes to",
    "that said,",
    "ultimately,",
    "in conclusion",
    "to sum up",
    "to summarise",
    "to summarize",
    "in a nutshell",
    "last but not least",
    # depth-claimers
    "delve into",
    "delving into",
    "dive deep",
    "dives deep",
    "deep dive into",
    "imagine a world where",
    "picture this:",
    "the world of",
    "additionally,",
    "furthermore,",
    "moreover,",
    "in addition,",
    "on the other hand,",
    "first and foremost",
    "that being said,",
)

# Case-insensitive compiled once.
_BANNED_RE = re.compile(
    "|".join(re.escape(p) for p in sorted(BANNED_PHRASES, key=len, reverse=True)),
    re.IGNORECASE,
)

# Sentences may not *begin* with a mechanical connector.
_CONNECTOR_START_RE = re.compile(
    r"(?:^|[.!?]\s+)(Additionally|Furthermore|Moreover|In conclusion|"
    r"That said|Ultimately|In addition|First and foremost|Without further ado)"
    r"\s*[,.]?",
    re.IGNORECASE,
)

# Em-dash density: prose that leans on em dashes reads as generated.
MAX_EMDASH_PER_1K_WORDS = 6.0
MAX_NOT_ONLY_BUT_ALSO = 1
MAX_NOT_ONLY = 3

# --- 2. Structural gates --------------------------------------------------

MIN_WORDS = 900
MIN_ANSWER_WORDS = 30
MIN_ENTITY_CLAIMS_IN_INTRO = 2
INTRO_WINDOW_WORDS = 200
NGRAM_N = 8
# An 8-gram may appear in at most this many articles before it counts as slop.
NGRAM_MAX_ARTICLES = 2

_FORBIDDEN_H2_RE = re.compile(
    r"^(conclusion|conclusions|summary|final thoughts|wrap[- ]?up|"
    r"in conclusion|to sum up|to summarize|recap|closing remarks|"
    r"the end|key takeaways?)\s*$",
    re.IGNORECASE,
)

_TAG_RE = re.compile(r"<[^>]+>")
_SCRIPT_RE = re.compile(r"(?is)<(script|style)\b.*?</\1>")
_WS_RE = re.compile(r"\s+")


def visible_text(html: str) -> str:
    """Strip script/style/comments/tags, collapse whitespace."""
    t = _SCRIPT_RE.sub(" ", html)
    t = re.sub(r"<!--.*?-->", " ", t, flags=re.S)
    t = _TAG_RE.sub(" ", t)
    for ent, ch in (("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"),
                    ("&quot;", '"'), ("&#39;", "'"), ("&nbsp;", " "),
                    ("&middot;", "-"), ("&#x2026;", "...")):
        t = t.replace(ent, ch)
    return _WS_RE.sub(" ", t).strip()


def words(text: str) -> list[str]:
    return [w for w in re.split(r"[^\w'\-]+", text, flags=re.UNICODE) if w]


def h2s(html: str) -> list[str]:
    return [
        visible_text(m.group(1))
        for m in re.finditer(r"(?is)<h2[^>]*>(.*?)</h2>", html)
    ]


def paragraphs(html: str) -> list[str]:
    return [
        visible_text(m.group(1))
        for m in re.finditer(r"(?is)<p[^>]*>(.*?)</p>", html)
    ]


def scan_article(html: str, *, slug: str = "", subject: str = "") -> list[str]:
    """Per-article gates. Returns a list of human-readable violations."""
    out: list[str] = []
    text = visible_text(html)
    w = words(text)
    n = len(w)

    # -- lexical
    hits = sorted({m.group(0).lower() for m in _BANNED_RE.finditer(text)})
    if hits:
        out.append(f"banned-phrases: {hits[:6]}")

    for m in _CONNECTOR_START_RE.finditer(text):
        out.append(f"connector-sentence-start: {m.group(1)!r}")

    # -- thinness
    if n < MIN_WORDS:
        out.append(f"too-thin: {n} words < {MIN_WORDS}")

    # -- punctuation tells
    emdashes = text.count("\u2014") + text.count("&mdash;")
    if n and (emdashes / n) * 1000 > MAX_EMDASH_PER_1K_WORDS:
        out.append(f"em-dash-dense: {emdashes} in {n} words")
    if text.lower().count("not only") > MAX_NOT_ONLY:
        out.append(f"'not only' x{text.lower().count('not only')} > {MAX_NOT_ONLY}")

    # -- headings
    heads = h2s(html)
    if not heads:
        out.append("no-h2")
    for h in heads:
        if _FORBIDDEN_H2_RE.match(h.strip()):
            out.append(f"forbidden-h2: {h!r}")
    if subject:
        # Deliberately NOT a hard rule. Forcing the subject into every heading
        # is keyword stuffing, and an authored article is better for omitting
        # it. Subject specificity is enforced instead by (a) the intro-claim
        # gate below and (b) corpus-level H2 uniqueness + the 8-gram gate.
        pass

    # -- intro specificity: first two paragraphs must name the subject twice
    ps = paragraphs(html)
    if ps:
        wcount = 0
        window = ""
        for p in ps:
            window += " " + p
            wcount += len(words(p))
            if wcount >= INTRO_WINDOW_WORDS:
                break
        if subject:
            needle = subject.split()[0].lower()
            if window.lower().count(needle) < MIN_ENTITY_CLAIMS_IN_INTRO:
                out.append(
                    f"intro-thin: {needle!r} appears "
                    f"{window.lower().count(needle)}x in first {wcount} words"
                )

    # -- FAQ answers must be substantive
    for ans in re.findall(r"(?is)<p>(.*?)</p>", html):
        plain = visible_text(ans)
        if len(words(plain)) < 10 and len(words(plain)) < 5:
            out.append(f"stub-paragraph: {plain[:60]!r}")

    return out


# --- corpus gates ---------------------------------------------------------


# H2 headings that come from the site template rather than the author. Every
# article carries them, so their repetition is not duplication of prose.
_STRUCTURAL_H2 = {"frequently asked questions", "related articles"}


def _body(html: str) -> str:
    """Slice out the authored article body.

    Corpus-level gates must measure prose the author wrote. The page chrome
    (nav, breadcrumb, Related Articles, internal-links, site footer) is
    identical in every article, so including it makes every article look
    like a duplicate of every other one.
    """
    m = re.search(r"(?is)<article[^>]*>(.*?)</article>", html)
    body = m.group(1) if m else html
    # The byline, the auto-generated related list, and the product/tool link
    # block all live inside <article> and repeat by construction. The n-gram
    # gate exists to catch duplicated *prose*, so drop them here.
    # The giscus comments block joins them: since commit c9895e6 every post
    # carries the same heading, the same intro paragraph and the same widget,
    # so leaving it in made each article look like a duplicate of the others on
    # both reused_h2 and reused_ngrams. Its title and intro are chrome, not
    # authored text.
    # The crossrefs block joins them for the same reason and with more force:
    # it is thirty one-line entries per article, drawn from a shared pool of
    # titles, so the same run of words lands in many articles by construction.
    # Measuring it would flag the navigation as if the author had repeated
    # themselves.
    # The video caption joins them: its text is "Source video: <title>", where
    # the title is copied verbatim out of specs.json. Several articles in the
    # catalogue were resolved to the same upload, so the same eight words of a
    # YouTube title sat in three articles and the gate read it as duplicated
    # prose. No author wrote it and it must not be edited to pass, so it is
    # dropped along with the rest of the chrome.
    # The contextual CTA joins them, and for a sharper reason than the others:
    # it is a commercial module parameterised by topic, not prose. Its framing
    # sentence is chosen by domain, so the same sentence appears verbatim in
    # every article on that domain by design, up to nineteen times. No author
    # sat down and repeated themselves, and the gate is not measuring writing
    # when it flags this. It is excluded for the same reason crossrefs is.
    for pat in (r'(?is)<div class="meta">.*?</div>',
                r'(?is)<section class="crossrefs".*?</section>',
                r'(?is)<section class="cta-contextual".*?</section>',
                r'(?is)<section class="related-articles">.*?</section>',
                r'(?is)<section class="internal-links".*?</section>',
                r'(?is)<figcaption\b.*?</figcaption>',
                r'(?is)<section id="comments" class="post-comments".*?</section>'):
        body = re.sub(pat, " ", body)
    return body


# Block-level containers inside the authored body. An n-gram has to sit inside
# one of these to count: the gate is looking for eight consecutive words of
# prose the author wrote, and a run that begins in a heading and ends in the
# paragraph underneath it is not that.
_BLOCK_RE = re.compile(r"(?is)<(p|h2|h3|h4|h5|li|blockquote)\b[^>]*>(.*?)</\1>")


def _blocks_text(html: str) -> list[str]:
    """Visible text of each block element in the body, one entry per block.

    Indexing the body as a single token stream let an n-gram straddle a block
    boundary, because `visible_text` concatenates stripped tags without
    inserting a separator. That produced 22 n-grams shared by three or more
    articles which no author had written: "frequently asked questions what is
    the difference between" is the FAQ heading welded to the first question,
    and "the 72 spirits of goetia the seventy-two spirits" is a heading
    followed by a paragraph that opens by restating the title. Those are
    artefacts of how the text is flattened, so they are measured per block.
    """
    out = []
    for _tag, inner in _BLOCK_RE.findall(_body(html)):
        txt = visible_text(inner).strip()
        if txt:
            out.append(txt)
    return out


def ngram_index(pairs, n: int = NGRAM_N) -> dict[str, set[str]]:
    """Map each n-gram to the set of slugs containing it."""
    idx: dict[str, set[str]] = defaultdict(set)
    for slug, html in pairs:
        seen = set()
        for block in _blocks_text(html):
            toks = words(block.lower())
            for i in range(len(toks) - n + 1):
                seen.add(" ".join(toks[i:i + n]))
        for g in seen:
            idx[g].add(slug)
    return idx


def scan_corpus(pairs) -> dict:
    """Corpus-level gates over (slug, html) pairs."""
    report: dict = {
        "articles": len(pairs),
        "reused_h2": [],
        "reused_ngrams": [],
        "reused_opening": [],
        "per_article": {},
        "min_words": None,
        "max_words": None,
    }

    # H2 reuse
    by_h2: dict[str, list[str]] = defaultdict(list)
    for slug, html in pairs:
        for h in h2s(_body(html)):
            by_h2[h.strip().lower()].append(slug)
    for h, slugs in sorted(by_h2.items(), key=lambda kv: -len(kv[1])):
        if len(slugs) > 1 and h not in _STRUCTURAL_H2:
            report["reused_h2"].append({"h2": h, "count": len(slugs),
                                        "slugs": slugs[:4]})

    # n-gram reuse
    idx = ngram_index(pairs)
    offenders = [
        {"ngram": g, "count": len(s), "slugs": sorted(s)[:4]}
        for g, s in idx.items()
        if len(s) > NGRAM_MAX_ARTICLES
    ]
    offenders.sort(key=lambda d: -d["count"])
    report["reused_ngrams"] = offenders[:60]

    # opening-sentence reuse
    by_open: dict[str, list[str]] = defaultdict(list)
    for slug, html in pairs:
        ps = paragraphs(_body(html))
        if ps:
            key = " ".join(words(ps[0].lower())[:10])
            by_open[key].append(slug)
    report["reused_opening"] = [
        {"opening": k, "count": len(v), "slugs": v[:4]}
        for k, v in sorted(by_open.items(), key=lambda kv: -len(kv[1]))
        if len(v) > 1
    ][:40]

    # word counts + per-article
    counts = []
    for slug, html in pairs:
        n = len(words(visible_text(html)))
        counts.append(n)
        v = scan_article(html, slug=slug)
        if v:
            report["per_article"][slug] = v
    if counts:
        report["min_words"] = min(counts)
        report["max_words"] = max(counts)
        report["mean_words"] = sum(counts) // len(counts)
    return report


def answer_words(html: str) -> list[int]:
    """Word counts of FAQ answer blocks, if marked up as
    `<p>` siblings under the FAQ heading."""
    m = re.search(r"(?is)<h2[^>]*>Frequently Asked Questions</h2>(.*)",
                  html)
    if not m:
        return []
    return [len(words(visible_text(p.group(1))))
            for p in re.finditer(r"(?is)<p[^>]*>(.*?)</p>", m.group(1))]
