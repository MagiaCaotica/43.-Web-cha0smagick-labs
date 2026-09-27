# -*- coding: utf-8 -*-
"""
titles.py - title normalisation + entity/subtitle extraction.

The channel's real title shapes (verified against all 349 titles) are:

  "Invoking ZORAY: Magical Servant, Creator and Decoder of Languages"
  "Invocation to the HIVE MIND: The Ultimate Magical Servant ..."
  "Invocation of the Witch-king: The Magical Servant that Transforms ..."
  "Invoca al Rey Lich en la Vida Real!"
  "Invocando a Elon: la magia del caos detras de Frecuencias"
  "Invocacion al TECELON DEL DINERO   Egregore de la Riqueza Extrema"
  "Invoking THE EYE: Magical Server of Balance and the STATUS QUO"
  "\\U0001f9ff RELMUS: Magical Servitor to Energize | Transmute ..."
  "El Surgimiento del Servidor Magico DOGEPE: Una Revolucion Cripto"
  "Activador Gratuito de Servidores Magicos del Caos Online Tecnomancia"

So:  an ENTITY is a proper noun named in an invocation phrase, OR an ALL-CAPS
    run;  a SUBTITLE is the clause after the first colon.

Note the leading number is NOT part of the title - it lives in the `n` field.
Titles are also truncated with a trailing "..." and carry emoji prefixes and
full-width colons.
"""
import re
import unicodedata

# ------------------------------------------------------------------ charsets
EMOJI = re.compile(
    "[" "\U0001F000-\U0001FAFF" "←-⇿" "⌀-⏿"
    "①-⓿" "■-◿" "\U0001F1E6-\U0001F1FF" "️" "‍"
    "\U00013000-\U0001342F" "]"
)
FULLWIDTH = {
    "：": ":", "，": ",", "！": "!", "？": "?",
    "（": "(", "）": ")", "・": " ", "　": " ",
}

INVOCATION_PATTERNS = [
    r"invocaci[oó]n\s+a\s+(?:l[ao]s?\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invocaci[oó]n\s+(?:to|of)\s+(?:the\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invocando\s+a\s+(?:l[ao]s?\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invocando\s+(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invocar\s+a\s+(?:l[ao]s?\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invoc\w*\s+(?:to\s+the\s+|to\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
    r"invok\w*\s+(?:to\s+the\s+|to\s+)?(?:the\s+)?(.+?)(?::|\s{2,}|\s*[|\-–]\s*|,\s*chaos|,|$)",
]

# Channel-wide episode prefix. The real topic is everything AFTER it - a
# "PODCAST EP XI review" article would be pure SEO filler.
PODCAST_PREFIX = re.compile(r"^\s*PODCAST\b.*?[:\-–]\s*", re.I)

# words that must never be treated as an entity
STOPWORDS = set("""
the a an el la los las un una unos unas y o of to for and in on at with
from through your you my me our their it its his her they them this that
these those into over under about after before during while
true false real reales nuevo new faq top how why when who what where
is are was were be been being do does did done can could should would
will shall may might must have has had
ghost hunting protection amulet magic magick chaos love money tarot runes
rune moon lunar dream dreams sigil sigils ritual rituals guide manual
complete secret secrets art war black left right hand path applied hyper
accelerated futhark mental mind code program practical power basic
principles iniciacion principiante beginner thelema
misteriosa my this that these those good bad best worst
podcast caos magia caotico caotica magico magica magicos magicas
aprender quien del servior servidor servidores servidora invocacion
invocando invocar invoco descub como para por con que los las una mas
ego egregore egregor demonio demon magical servant server serving
youtube magiccaotico audio dark ambient energy god chaos2024
chan cia not internet death gnosis tulpa kabbalistic protocol life
""".split())

# Titles that open with a question / defining frame are TOPIC titles, never
# entity names. Tiers 2/3 (ALL-CAPS hunting) must not fire on these.
# NOTE: articles are deliberately NOT in this set - many entities on this
# channel are named "The Djinn", "The Eye", "The Headhunter", "The Healer".
QUESTION_FRAME = re.compile(
    r"^\s*(what|who|how|why|when|where|which|is|are|was|were)\b",
    re.I,
)


def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def norm_key(s):
    """Aggressively fold a string down to a comparable key."""
    s = s or ""
    for k, v in FULLWIDTH.items():
        s = s.replace(k, v)
    s = EMOJI.sub(" ", s)
    s = strip_accents(s).lower()
    s = re.sub(r"[^a-z0-9]+", " ", s)
    return re.sub(r"\s+", " ", s).strip()


def clean_title(t):
    """Emoji out, full-width folded, podcast prefix dropped, trailing ellipsis
    removed, space-tightened. Original casing is preserved (accents kept for
    display)."""
    if not t:
        return ""
    for k, v in FULLWIDTH.items():
        t = t.replace(k, v)
    t = EMOJI.sub(" ", t)
    t = PODCAST_PREFIX.sub("", t)
    t = re.sub(r"\.\.\.\s*$", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def split_subtitle(t):
    """Return (head, subtitle). Splits on the first colon when the clause after
    it is long enough to be a description rather than a tag."""
    if ":" not in t:
        return t.strip(), ""
    head, _, rest = t.partition(":")
    if len(rest.strip()) < 8:
        return t.strip(), ""
    return head.strip(), rest.strip()


def titlecase(s):
    small = {"a", "an", "and", "as", "at", "but", "by", "de", "del", "for",
             "from", "in", "into", "la", "las", "los", "el", "nor", "of",
             "on", "or", "the", "to", "up", "via", "y"}
    out = []
    for i, w in enumerate(s.split()):
        core = re.sub(r"[^A-Za-zÁÉÍÓÚÑÜáéíóúñü]", "", w)
        if i > 0 and core.lower() in small:
            out.append(w.lower())
        elif w[:1].isupper():
            out.append(w)
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)


def _clean_entity(s):
    s = re.sub(r"^[\s:;,.\-–—|]+", "", s)
    s = re.sub(r"[\s:;,.\-–—|]+$", "", s)
    s = re.sub(r"\s+", " ", s).strip()
    # drop leading article
    s = re.sub(r"^(the|el|la|los|las|un|una|a)\s+", "", s, flags=re.I)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def _entity_ok(ent):
    if not ent or len(ent) < 3 or len(ent) > 44:
        return False
    if re.search(r"\d", ent):
        return False
    if norm_key(ent) in STOPWORDS:
        return False
    # reject if every word is a stopword ("The Ultimate Magical Servant")
    words = [w for w in re.findall(r"[A-Za-z]+", ent)]
    if not words:
        return False
    good = [w for w in words if w.lower() not in STOPWORDS]
    if not good:
        return False
    # at least one non-stopword word of >=3 chars
    return any(len(w) >= 3 for w in good)


def _shorten_candidates(cand):
    """Yield progressively shorter prefixes so a long greedy match can still
    yield a real proper noun (e.g. 'Cortana Expulsion of Astral Larvae ...')."""
    seen = [cand]
    words = cand.split()
    for n in (1, 2, 3, 4):
        if len(words) > n:
            seen.append(" ".join(words[:n]))
    return seen


def extract_entity(raw_title):
    """Return the entity proper noun, or '' when the title is a topic title."""
    t = clean_title(raw_title)
    if not t:
        return ""
    head, _sub = split_subtitle(t)

    # (1) explicit invocation phrases
    for pat in INVOCATION_PATTERNS:
        m = re.search(pat, head, flags=re.I)
        if m:
            raw = m.group(1)
            for cand in _shorten_candidates(_clean_entity(raw)):
                if _entity_ok(cand):
                    return titlecase(cand)

    # (2) leading contiguous ALL-CAPS run.
    #     Skipped for question / defining frames: "What is a TULPA" is a topic,
    #     not an invocation of Tulpa.
    words = head.split()
    qframe = bool(QUESTION_FRAME.match(head))
    run = []
    for w in words:
        bare = re.sub(r"[^A-Za-zÁÉÍÓÚÑÜ]", "", w)
        if (len(bare) > 1 and bare.upper() == bare
                and not re.search(r"\d", w)):
            run.append(bare)
        else:
            break
    if run and not qframe:
        cand = _clean_entity(" ".join(run))
        if _entity_ok(cand):
            return titlecase(cand)

    # (3) any ALL-CAPS token of >=3 letters in the head, longest wins,
    #     skipping stopwords; ties resolved by earliest position
    cands = []
    for w in words:
        bare = re.sub(r"[^A-Za-zÁÉÍÓÚÑÜ]", "", w)
        if len(bare) >= 3 and bare.upper() == bare and bare.lower() not in STOPWORDS:
            cands.append((len(bare), head.index(w), bare))
    if cands and not qframe:
        cands.sort(key=lambda x: (-x[0], x[1]))
        cand = _clean_entity(cands[0][2])
        if _entity_ok(cand):
            return titlecase(cand)

    # (4) short-title fallback: one capitalised non-stopword token
    if len(words) <= 3 and not qframe:
        for w in words:
            bare = re.sub(r"[^A-Za-zÁÉÍÓÚÑÜ]", "", w)
            if (len(bare) >= 4 and bare[:1].isupper()
                    and bare.lower() not in STOPWORDS):
                cand = _clean_entity(bare)
                if _entity_ok(cand):
                    return titlecase(cand)
                break
    return ""


def extract_subtitle(raw_title):
    """The descriptive clause after the colon - where the real domain signal is."""
    t = clean_title(raw_title)
    _head, sub = split_subtitle(t)
    if sub:
        return sub
    # no colon: use the descriptive tail after the entity
    ent = extract_entity(t)
    if ent:
        low = norm_key(ent)
        idx = norm_key(t).find(low)
        if idx >= 0:
            return t
    return t
