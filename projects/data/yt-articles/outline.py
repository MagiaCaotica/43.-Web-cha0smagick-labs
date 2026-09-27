"""Per-article outline construction.

Why this module exists
----------------------
`domains.py` carries one H2 list per domain. Rotating those lists across 349
articles would give ~7.4 articles an identical skeleton, which is textbook
duplication. Every heading produced here is instead built from a *role phrase*
that is unique to the article (its entity or its focus), so no two articles in
the corpus can share an H2.

The role phrase is the grammatical object the article is actually about:
"a magickal servitor for Clauneck", "a wealth pact with Mammon",
"a love working for ALEXIA". The 16 heading shapes below all embed that role
phrase, which is what guarantees uniqueness.
"""
import re

FAQ_HEADING = "Frequently Asked Questions"

# Role phrase per domain. {S} is replaced by the article subject.
# Missing domains fall back to GENERIC_ROLES.
GENERIC_ROLES = [
    "the {S} working",
    "a full {S} protocol",
    "the {S} method",
    "{S} from the ground up",
]

DOMAIN_ROLES = {
    "money": ["a money sigil for {S}", "a prosperity working on {S}",
              "an abundance ritual built around {S}"],
    "money-pact": ["a wealth pact with {S}", "the {S} contract",
                   "a financial working using {S}"],
    "love": ["a love working for {S}", "a relationship ritual using {S}",
             "the {S} attraction protocol"],
    "karmic-bonds": ["a cord-binding working on {S}",
                     "a karmic tie ritual for {S}"],
    "health": ["a healing working for {S}", "the {S} recovery protocol",
               "a health ritual addressing {S}"],
    "protection": ["a shield working for {S}", "a ward built around {S}",
                   "a banishing ritual against {S}"],
    "luck": ["a luck working for {S}", "a wager-and-chance ritual using {S}",
             "the {S} fortune protocol"],
    "career": ["a career working for {S}", "a professional ritual on {S}",
               "a {S} direction protocol"],
    "creativity": ["a creativity working for {S}",
                   "a generative ritual aimed at {S}"],
    "beauty": ["a beauty working on {S}", "a grooming ritual for {S}",
               "the {S} presentation protocol"],
    "clarity": ["a clarity working on {S}", "a mental-focus ritual for {S}"],
    "fame": ["a fame working for {S}", "a visibility ritual built on {S}"],
    "home": ["a home working for {S}", "a domestic ritual protecting {S}"],
    "entity-lore": ["a magickal servitor for {S}", "the {S} entity",
                    "an invocation working for {S}"],
    "servitor-craft": ["a servitor built for {S}", "the {S} servitor craft",
                       "a full {S} invocation sequence"],
    "goetia-demons": ["a Goetic working with {S}", "the {S} spirit contract",
                      "a working drawn from {S}"],
    "astral-dreams": ["an astral working using {S}", "the {S} projection method",
                      "a dream practice built on {S}"],
    "dream-journal": ["a dream journal method for {S}",
                      "the {S} dream-recording practice"],
    "divination": ["a divinatory method using {S}", "the {S} reading protocol"],
    "tarot": ["a tarot practice centred on {S}", "the {S} spread method"],
    "runes": ["a rune working built on {S}", "the {S} rune protocol"],
    "iching": ["an I Ching consultation about {S}",
               "the {S} hexagram method"],
    "lunar": ["a lunar working timed to {S}", "the {S} moon-phase protocol"],
    "reality-hacking": ["a reality-hacking script for {S}",
                        "a {S} reality shift protocol"],
    "mind-science": ["the cognitive mechanics behind {S}",
                     "a research-grounded look at {S}"],
    "sigils": ["a sigil for {S}", "the {S} sigil method",
               "a sigil-construction working on {S}"],
    "chaos-basics": ["a first working built on {S}",
                     "a beginner practice using {S}",
                     "the {S} entry point into chaos magick"],
    "technomancy": ["a technomantic working for {S}",
                    "a digital ritual built on {S}"],
    "ritual-craft": ["a ritual technique for {S}", "the {S} craft method"],
    "history-occult": ["the history behind {S}", "the {S} historical record"],
    "comparative": ["how {S} compares to the alternatives",
                    "the {S} lineage comparison"],
    "mythology-ancient": ["the ancient material behind {S}",
                          "the {S} mythological record"],
    "philosophy": ["the philosophical case for {S}",
                   "the {S} position examined"],
    "scams-skepticism": ["spotting fake {S} teachers",
                         "how to vet {S} claims"],
    "occult-culture": ["the cultural reading of {S}", "the {S} subculture"],
    "horror-lore": ["the horror folklore around {S}", "the {S} dread record"],
    "prayer": ["the prayer practice built on {S}", "the {S} invocation prayer"],
    "music-magick": ["a musical working built on {S}", "the {S} sound ritual"],
    "creatures-vampire": ["the {S} creature tradition",
                          "the {S} undead working"],
    "psychonaut": ["a psychonautic practice using {S}",
                   "the {S} consciousness method"],
    "time": ["a time-working practice using {S}", "the {S} timing method"],
    "language-speech": ["a language working built on {S}",
                        "the {S} speech protocol"],
    "astral-parasites": ["a clearing practice for {S}",
                         "the {S} astral-parasite method"],
    "secret-knowledge": ["a full {S} dossier", "the {S} knowledge protocol"],
    "travel-movement": ["a movement working built on {S}",
                        "the {S} travel protocol"],
    "binding-relationships": ["a binding practice for {S}",
                             "the {S} cord method"],
    "wisdom-memory": ["a memory working built on {S}", "the {S} recall method"],
}

# 16 heading shapes. Every one embeds the role phrase, which is unique per
# article, so every heading is unique per article.
SHAPES = [
    "{R}: what it actually is",
    "Where {R} comes from",
    "Building {R} from nothing",
    "Charging {R}: the working sequence",
    "{R} in practice, step by step",
    "Why {R} fails, and what to change",
    "Testing {R} without fooling yourself",
    "{R}: tools, timing and materials",
    "Keeping {R} alive after the first charge",
    "Signs {R} is actually working",
    "The ethics of working with {R}",
    "{R}: the mistakes beginners make",
    "When to abandon {R}",
    "Repeating {R} without it going stale",
    "How {R} fits into the rest of your practice",
    "{R} and the people who wrote about it",
]

# Angle variants reshuffle which shapes appear and in what order, so two
# articles on the same domain with the same angle family still diverge.
VARIANT_OFFSETS = {
    "Beginner Path": (0, 1),
    "Protocol": (5, 2),
    "Framework": (9, 3),
    "Field Notes": (13, 5),
    "Reference": (3, 7),
    "Critique": (7, 11),
}

BODY_SHAPES = 15  # shapes used for body sections; FAQ heading is appended last


_LEAD_JUNK = re.compile(
    r"^(?:what|why|how|when|where|who|which|the|a|an|is|are|was|were|do|does|"
    r"can|should|to|of|in|on|for|and|or|my|your|this|that|these|those)\b\s*",
    re.I,
)
_TRIM_PUNCT = re.compile(r"^[\s\W_]+|[\s\W_]+$", re.U)


_PAREN = re.compile(r"\([^)]*\)")
_PIPE = re.compile(r"\s*[|•·–—]\s*")
_QFRAME = re.compile(
    r"^(?:what|why|how|when|where|who|which|is|are|was|were|do|does|can|"
    r"should|would|could)\b\s*", re.I,
)
_TRAILING = re.compile(
    r"^(?:from|to|of|in|on|for|and|or|but|start|about|with|that|this|your|my|"
    r"it|is|are|be|do|does|can|how|why|what|the|a|an|para|con|de|del|la|el|"
    r"los|las|y|que|hows|work|works)$", re.I)
_SPLIT = re.compile(r"\s+(?:and|or|but|para|con|de|del|la|el|los|las|y)\s+",
                    re.I)


def _titlecase_words(words):
    out = []
    for w in words:
        if re.fullmatch(r"[A-Z0-9&.']{2,}", w):      # keep acronyms: YHWH, AI, 4CHAN
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:].lower() if w else w)
    return out


# Article-title boilerplate that sits in front of the real subject.
_TITLE_PREFIX = re.compile(
    r"^(?:the\s+)?(?:complete|ultimate|full|definitive|essential|big|short|"
    r"quick|easy|simple|beginner'?s?|advanced|official|real|true)?\s*"
    r"(?:guide|tutorial|masterclass|explained|explainer|breakdown|"
    r"introduction|intro|primer|overview|cheat\s?sheet|summary)?\s*"
    r"(?:to|on|about|of|for)?\s*",
    re.I,
)
_EXTRA_PREFIX = re.compile(
    r"^(?:how\s+to|the\s+art\s+of|everything\s+about|all\s+about|"
    r"a\s+complete\s+guide\s+to|my\s+journey\s+into|learning)\s+", re.I)


def topic_subject(clean_title, fallback_label, max_words=5):
    """Derive a per-video subject phrase, unique across the corpus.

    Topic articles have no entity name, so the subject has to come from the
    title itself. Using the domain label instead would make every article in a
    domain share headings, which is exactly the duplication we are avoiding.
    """
    text = _PAREN.sub(" ", clean_title or "")
    text = _PIPE.split(text)[0]
    if ":" in text:
        head, _, tail = text.partition(":")
        if len(head.split()) <= 8 and len(tail.split()) >= 2:
            text = tail
    text = _TRIM_PUNCT.sub(" ", text).strip()
    if not text:
        return fallback_label

    words = text.split()
    # Drop a leading question frame, then keep the first meaningful clause.
    joined = _QFRAME.sub("", " ".join(words))
    for _ in range(2):
        new = _EXTRA_PREFIX.sub("", joined)
        new = _TITLE_PREFIX.sub("", new).strip()
        if new == joined or not new:
            break
        joined = new
    words = joined.split()
    while words and _LEAD_JUNK.match(words[0]):
        words = words[1:]
    if not words:
        return fallback_label

    # Trim to a clause boundary so we never end mid-phrase.
    clause = words[:max_words]
    if len(words) > max_words:
        cut = None
        for i in range(max_words - 1, 1, -1):
            if _SPLIT.fullmatch(words[i]):
                cut = i
                break
        clause = words[:cut] if cut else clause

    # Drop a dangling connective or verb left by the trim.
    while clause and _TRAILING.match(clause[-1]):
        clause = clause[:-1]
    if len(clause) < 2:
        # A one-word stub like "Magic" or "Guía" carries no signal; retry with
        # the other half of the title before giving up on the title entirely.
        alt = (clean_title or "").split(":")
        alt = _TRIM_PUNCT.sub(" ", alt[-1] if len(alt) > 1 else alt[0]).split()
        alt = [w for w in alt if not _LEAD_JUNK.match(w)][:max_words]
        if len(alt) >= 2:
            clause = alt
    if not clause:
        return fallback_label

    clause = [w for w in clause if _LEAD_JUNK.sub("", w)]
    if not clause:
        return fallback_label
    return " ".join(_titlecase_words(clause))


def role_phrase(domain, subject, idx=0):
    """Return the grammatical object this article is about."""
    forms = DOMAIN_ROLES.get(domain) or GENERIC_ROLES
    form = forms[idx % len(forms)]
    return form.format(S=subject)


def _choose_shapes(variant, n):
    """Deterministically pick BODY_SHAPES shapes + their order."""
    start, stride = VARIANT_OFFSETS.get(variant, (0, 1))
    picked = []
    i = start
    while len(picked) < BODY_SHAPES:
        picked.append(SHAPES[i % len(SHAPES)])
        i += stride if stride % 2 == 1 else stride + 1
    return picked


def build_outline(subject, domain, n, variant, idx=0):
    """Return (role_phrase, [h2, ...]) with the FAQ heading pinned last."""
    r = role_phrase(domain, subject, idx)
    heads = [s.format(R=r) for s in _choose_shapes(variant, n)]
    return r, heads + [FAQ_HEADING]


def dedupe_check(outlines):
    """Return a list of heading strings shared by more than one article."""
    seen = {}
    for slug, heads in outlines:
        for h in heads:
            if h == FAQ_HEADING:
                continue
            seen.setdefault(h.lower(), []).append(slug)
    return {h: v for h, v in seen.items() if len(v) > 1}


_BAD_HEAD = re.compile(r"^(conclusion|summary|final thoughts|wrap[-\s]?up|"
                       r"in conclusion|to sum up)\b", re.I)


def validate_headings(heads, subject):
    """Cheap per-article guard: no generic meta-heading, subject must appear."""
    problems = []
    for h in heads:
        if h == FAQ_HEADING:
            continue
        if _BAD_HEAD.match(h):
            problems.append(f"generic heading: {h}")
        if subject.lower() not in h.lower():
            problems.append(f"heading lacks subject: {h}")
    return problems
