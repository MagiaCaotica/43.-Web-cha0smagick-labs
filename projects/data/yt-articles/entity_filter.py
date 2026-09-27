# -*- coding: utf-8 -*-
"""
entity_filter.refine(raw_title) -> str | None

Post-processes titles.extract_entity() output.  Two jobs:

  1. REJECT entities that are not proper nouns.  The channel's ALL-CAPS
     runs include a lot of ordinary words ("SUCCESS", "CONTROLLING",
     "ESTAFA", "MEMETIC") that the pattern matcher happily grabs.
  2. TRIM fragments.  Several titles are "<NAME>   <domain phrase>" with no
     colon, so the greedy match swallows the descriptor:
         "AURORE Egregore Que Combate Traumas"   -> AURORE
         "LUX Egregore de los Lujos Materiales"  -> LUX
         "Of JERDEHL"                             -> JERDEHL

Kept deliberately separate from titles.py so the verified extraction order
there stays untouched.
"""
import re

import titles as T

# --------------------------------------------------------------------------
# 1. Rejection list: words that are never servitor / entity names.
#    Matched on norm_key (accent-stripped, lower, single-spaced).
#    Trailing-underscore variants are deliberate: they kill an exact
#    match on a common word without blocking a longer compound
#    ("magic_" blocks "magic" but not "magick").
# --------------------------------------------------------------------------
ENTITY_NOISE = set("""
virus success exito successfully broken breakage memetic memeticism
controlling controller control necromancy necromante grimoire grimoires
grimoorio grimoorios manifesting manifestando manifestacion discover
descubre descubrimiento within meme memes satanic satanismo satanist
system systems sistema sistemas reality realidad mage magos mago
summoning invocacion summon glamour magic magick magica learn learns
aprende archaeology arqueologia arqueology contact contacto obtain
obtener theory teoria theories liberar liber page paginas pagina
anarchy anarquismo anarchy meditation meditacion neuroplasticidad
neuroscience neurociencia quantum quantica physics fisica
cat cats gato gatos halloween luck suerte secret secrets secreto secretos
prosperity scam fraud Millionaire billionaire abundance
artist artists work working works_job job career
cannabis weed marijuana hypnosis telepatia mind minds
estafa vhs invocacin proyeccin grimorios meditacion
egregores paranormal ocultismo hechizo atraera tecnopaganismo
desterrar witchcraft cybermagic spiritual unificada
juan peter carlos campos
escritura transform transforming transformar transformate
effect efecto energy energia energetica vibration vibracion
controversy polemica polemicas debate
breakthrough discovery answers secrets_ secretsx
manifest reality_ real real_ truly_
consciousness subconscious subconsciente mente
power poder force forces
fortuneodin fortuneodin wealth money dinero dinero_ paz peace war
guerra truth verdad life vida death muerte fear miedo time tiempo_
infinite infinito infinity full total grand gran now new best top
real_case guide guides tutorial course class
""".split())

# Accent-mangled tokens that survive a bad decode upstream.
ENTITY_NOISE |= {
    "invocacin", "proyeccin", "fisica", "cuantica", "meditacion",
    "desterrar", "atraera", "tecnopaganismo", "egregores",
    "ocultismo", "grimorios", "escritura", "vhs", "estafa",
    "hechizo", "paranormal", "neuroplasticidad",
}

# --------------------------------------------------------------------------
# 2. Fragment markers.  If one of these appears inside the extracted entity,
#    keep only the text before it.
#    NOTE: " al " is deliberately NOT a marker -- it truncated the real
#    entity "Gourmand al Ashara" down to "Gourmand".
# --------------------------------------------------------------------------
FRAGMENT_MARKERS = [
    " egregore", " para ", " of ", " que ", " en la ", " en el ",
    " de los ", " de las ", " del ", " and the ", " for ", " to ",
    " con ", " desde ", " to monetize",
]

# Leading articles / prepositions that are never part of an entity name.
LEADING_JUNK = re.compile(r"^(?:of|al|el|la|los|las|para|the|a|an)\s+", re.I)

# Anything that is literally a podcast banner, not a name.
PODCAST_BANNER = re.compile(r"^(?:podcast|chaotic podcast|podcast caotico)\b", re.I)


def _norm(value):
    """norm_key: accent-stripped, lower, single-spaced."""
    return T.norm_key(value)


def _valid(entity):
    """Cheap sanity gate on a candidate entity name."""
    if not entity:
        return False
    if not (3 <= len(entity) <= 44):
        return False
    if any(ch.isdigit() for ch in entity):
        return False
    words = [w for w in _norm(entity).split() if w]
    if not words:
        return False
    # at least one substantive word
    if not any(len(w) >= 3 and w not in T.STOPWORDS for w in words):
        return False
    return True


def _trim(entity):
    """Cut at the first fragment marker, then drop a dangling article."""
    low = entity.lower()
    cut = len(entity)
    for marker in FRAGMENT_MARKERS:
        idx = low.find(marker)
        if 0 < idx < cut:
            cut = idx
    head = entity[:cut].strip().strip("-–—|,")
    head = LEADING_JUNK.sub("", head).strip()
    return head


def refine(raw_title):
    """Return a clean entity name, or None when the title is a topic."""
    if not raw_title:
        return None
    candidate = T.extract_entity(T.clean_title(raw_title))
    if not candidate:
        return None
    # strip decorative punctuation
    candidate = candidate.strip(" \t\u00a0-–—|:,.!?¿¡*")
    if not candidate or PODCAST_BANNER.match(candidate):
        return None
    candidate = _trim(candidate)
    if not candidate:
        return None
    candidate = T.titlecase(candidate)
    if not _valid(candidate):
        return None
    if _norm(candidate) in ENTITY_NOISE:
        return None
    return candidate
