# -*- coding: utf-8 -*-
"""One-off: strip dead resolver code from build_specs.py, wire in titles.py."""
import io
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, "build_specs.py")

NEW_RESOLVER = '''# ============================================================== resolver
# Subtitle-first keyword scoring. The clause after the first colon carries the
# real domain signal ("Egregore of Gambling and Bluffing"), so it is weighted
# 3x versus the full title. Parentheticals are deliberately NOT used: 56 of
# them are noise ("Podcast" x17, "Magia del Caos" x5, "4chan", "2024", ...).
CLUSTER_DEFAULT = {
    "servitors": "entity-lore", "podcast": "chaos-basics",
    "chaos/general": "chaos-basics", "chaos/gates": "chaos-basics",
    "mind-science": "mind-science", "chaos/magic-101": "chaos-basics",
    "money": "money", "history": "history-occult",
    "chaos/entity-lore": "entity-lore", "chaos/ritual-craft": "ritual-craft",
    "chaos/servitors": "servitor-craft", "books": "secret-knowledge",
    "chaos/money": "money", "divination": "divination",
    "money-goetia": "money-pact", "chaos/science-bridge": "mind-science",
    "chaos/4chan-memetic": "occult-culture", "dreams-astral": "astral-dreams",
    "technomancy": "technomancy", "chaos/comparative": "comparative",
    "creatures": "creatures-vampire", "sigils": "sigils",
    "protection": "protection", "music": "music-magick", "lunar": "lunar",
    "religion": "prayer", "chaos/culture": "occult-culture",
    "chaos/sigils": "sigils", "chaos/chronology": "history-occult",
}

SUBTITLE_ONLY = {
    "money-pact": ["pact with mammon", "pacts with mammon", "mammon"],
    "luck": ["luck betting lottery", "gambling and bluffing", "betting",
             "apuestas", "loter", "gambling", "bluffing", "juego de"],
    "mind-science": ["psychology of particle", "physics of particle",
                     "physics of particles", "particle physics"],
    "mind-science2": [],
}


def _score(text, weight):
    out = Counter()
    for dom, kws in DOMAIN_KEYWORDS.items():
        for k in kws:
            if k and k in text:
                out[dom] += len(k) * weight
    return out


def resolve_domain(video, fallback_index):
    raw = video.get("title", "") or ""
    clean = T.clean_title(raw)
    sub = ascii_lower(T.extract_subtitle(clean) or "")
    full = ascii_lower(clean)
    cl = video.get("cluster", "")

    if not sub.strip():
        sub = full

    # hard signals that only ever appear in the subtitle clause
    for dom, phrases in (("money-pact", SUBTITLE_ONLY["money-pact"]),
                         ("luck", SUBTITLE_ONLY["luck"]),
                         ("mind-science", SUBTITLE_ONLY["mind-science"])):
        for p in phrases:
            if p in sub:
                return dom, "subtitle-hard"

    scores = _score(sub, 3) + _score(full, 1)
    if not scores:
        return CLUSTER_DEFAULT.get(cl, FALLBACK_CYCLE[fallback_index % len(FALLBACK_CYCLE)]), "cluster"

    top = scores.most_common()
    best, bs = top[0]
    if len(top) > 1 and top[1][1] == bs:
        # tie -> the cluster label is the tiebreak signal
        cd = CLUSTER_DEFAULT.get(cl)
        if cd and cd != best:
            return cd, "tie+cluster"
    return best, "subtitle" if bs >= 9 else "keyword"


'''

with io.open(P, "r", encoding="utf-8") as fh:
    lines = fh.read().split("\n")


def find(pred, start=0):
    for i in range(start, len(lines)):
        if pred(lines[i]):
            return i
    raise SystemExit("anchor not found")


# --- 1. replace the resolver block -------------------------------------
a = find(lambda l: l.startswith("# ") and "resolver" in l and l.startswith("# =="))
b = find(lambda l: l.startswith("# ") and "spec builder" in l and l.startswith("# =="), a)
lines = lines[:a] + NEW_RESOLVER.split("\n") + lines[b:]

# --- 2. drop ENTITY_STOPWORDS .. parenthesised_domain -------------------
a = find(lambda l: l.startswith("ENTITY_STOPWORDS = set"))
b = find(lambda l: l.startswith("# ") and "resolver" in l and l.startswith("# =="), a)
lines = lines[:a] + lines[b:]

# --- 3. drop TITLE_OVERRIDES -------------------------------------------
a = find(lambda l: l.startswith("# Titles whose domain cannot be reliably inferred"))
b = find(lambda l: l.startswith("FALLBACK_CYCLE = ["), a)
lines = lines[:a] + lines[b:]

# --- 4. import titles ---------------------------------------------------
i = find(lambda l: l.startswith("from domains import"))
lines.insert(i + 1, "import titles as T  # noqa: E402")

out = "\n".join(lines)
out = re.sub(r"\n{4,}", "\n\n\n", out)
with io.open(P, "w", encoding="utf-8", newline="\n") as fh:
    fh.write(out)

print("patched build_specs.py: %d -> %d lines" % (982, out.count("\n") + 1))
for probe in ("TITLE_OVERRIDES", "parenthesised_domain", "ENTITY_STOPWORDS",
              "def extract_entity", "STRIPCHARS"):
    print("  %-24s remaining refs: %d" % (probe, out.count(probe)))
