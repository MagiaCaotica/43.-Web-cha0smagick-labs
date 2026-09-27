# -*- coding: utf-8 -*-
"""
build_specs.py - map all 349 YouTube videos onto a domain and emit a full
Article Spec per video.

Mechanism (deliberate, to avoid template slop across 349 pieces):
  1. The ENTITY_NAME is lifted out of the video title itself
     ("INVOCACION A B MASHINA" -> "B Mashina", "84 BUNE Made Me RICH" -> "Bune")
  2. The DOMAIN comes from a three-tier resolver:
       a. explicit per-video override table (ambiguous titles)
       b. parenthetical in the title  ("112 B MASHINA (goals)" -> career)
       c. keyword scoring against a domain keyword index
  3. Every remaining spec field (slug, title tags, description, keywords,
     outline, FAQ, product rotation, related links, ASO row) is derived
     from the resolved domain + the entity + a rotating variant index, so
     two videos on the same domain still differ in structure and angle.

Run:  python build_specs.py
Out:  specs.json  (349 rows) + _spec_report.json
"""
import json
import os
import re
import sys
import unicodedata
from collections import Counter, OrderedDict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
sys.path.insert(0, HERE)

from domains import DOMAINS, CANONICAL_CATS, RISK_NOTES, validate  # noqa: E402
import titles as T  # noqa: E402
import entity_filter  # noqa: E402
import outline as O  # noqa: E402
import build_entities  # noqa: E402

VIDEOS = os.path.join(ROOT, "projects", "research", "yt_videos_classified.json")
EXISTING = os.path.join(ROOT, "projects", "research", "existing_blog_slugs.json")
CATALOG = os.path.join(HERE, "catalog.json")
OUT = os.path.join(HERE, "specs.json")

TODAY_ISO = "2026-09-26"
TODAY_HUMAN = "September 26, 2026"
AUTHOR = "Frater Alek0s"
SITE = "https://cha0smagicklabs.com"


# ===================================================================== utils
def strip_accents(s):
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def ascii_lower(s):
    return re.sub(r"\s+", " ", strip_accents(s).lower()).strip()


def slugify(s, maxlen=60):
    s = ascii_lower(s)
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    s = re.sub(r"-{2,}", "-", s)
    if len(s) > maxlen:
        cut = s[:maxlen].rsplit("-", 1)[0]
        s = cut if len(cut) >= 30 else s[:maxlen].rstrip("-")
    return s


def titlecase(s):
    small = {"a", "an", "and", "as", "at", "but", "by", "for", "from",
             "in", "into", "nor", "of", "on", "or", "the", "to", "up", "via", "vs"}
    words = s.split()
    out = []
    for i, w in enumerate(words):
        if i > 0 and w.lower() in small:
            out.append(w.lower())
        else:
            out.append(w[:1].upper() + w[1:])
    return " ".join(out)


def deaccent_keep(s):
    """Human-readable entity name: keep original case, drop accents."""
    return strip_accents(s).strip()


# ==================================================== domain keyword index
DOMAIN_KEYWORDS = {
    "money": ["dinero", "money", "riqueza", "wealth", "abundance", "abundancia",
              "abundante", "prosperity", "prosperidad", "fortuna", "millon", "millones",
              "economia", "econom", "finanzas", "finance", "invers", "pact", "pacto",
              "pacts", "mammon", "clauneck", "dinero/apuestas", "bets", "apuestas",
              "estabilidad economica", "oportunidades financieras", "techelon del dinero",
              "ludibriel", "juego/apuestas", "star light", "starlight", "zarpa",
              "betz", "tevyah", "jerdehl", "dominivince", "ronda", "jupiturio",
              "mantis de la suerte", "la suerte", "monetizar", "clientes", "clients"],
    "money-pact": ["pact with mammon", "pacts with mammon", "pact", "pacto",
                   "secret babylonian ritual", "chaos magic of money", "dinero con magia del caos"],
    "love": ["love", "amor", "ex", "seduction", "seducir", "atraccion", "attraction",
             "relacion", "relationship", "win back", "vuelve", "casual encounters",
             "encuentros casuales", "el alfa", "my mirror", "allie", "mi espejo",
             "carnal", "libido", "seduc"],
    "karmic-bonds": ["cortar vinculos", "eliminar vinculos", "contacto cero",
                     "soul contract", "cord", "vínculo", "vinculo", "trauma",
                     "traumas", "miedos", "miedo", "aurore", "holpe", "tristeza"],
    "health": ["heal", "healing", "curacion", "curación", "salud", "health",
               "disease", "enfermedad", "cocada", "asipu", "depresion", "depresión",
               "ansiedad", "alexia", "adiccion", "adicciones", "vicios", "rabbi",
               "prevenir vih", "vih", "nuri", "harven", "calma", "equilibrio",
               "melialpa", "covid"],
    "protection": ["banish", "protect", "proteccion", "protección", "protection",
                   "malldicion", "maldición", "maldiciones", "hechizo", "spell",
                   "brujeria", "brujería", "abuso", "violencia", "ataque", "ataques",
                   "defensa", "corto", "cut", "dolor", "abuso sexual", "lahos",
                   "el eye", "shield", "amulet", "talisman", "limpieza energetica",
                   "limpiar", "cleanse"],
    "luck": ["suerte", "luck", "lucky", "fortune", "azar", "chance", "mantis"],
    "career": ["trabajo", "job", "career", "clientes", "clients", "estudio", "study",
               "examen", "exam", "universidad", "university", "profesion", "profesional",
               "carrera", "headhunter", "realizacion laboral", "estudio", "la profesora",
               "oportunity", "oportunidad", "trabajo", "empleo", "academic"],
    "creativity": ["creativ", "creativi", "writing", "escritura", "musica", "musical",
                   "musy", "arte", "art", "artist", "artista", "inspiracion",
                   "inspiración", "compotera", "or ki za hex", "monetize",
                   "monetizar", "applause", "creativi", "canalizacion"],
    "beauty": ["belleza", "beauty", "skin", "piel", "facial", "facial", "looks",
               "physical", "fisico", "físico", "cuerpo", "bodies", "perfect",
               "bonita", "mani", "my mirror", "autoestima", "seduc", "el alfa",
               "vulcanatlas", "cuerpos perfectos"],
    "clarity": ["claridad", "clarity", "decision", "decis", "focus", "concentr",
                "sabiduria", "sabiduría", "wisdom", "conocimiento", "mind",
                "telepathic", "memoria", "memory", "mental", "estudiar", "clarividencia",
                "gyvu", "oculta secretos", "misteriosa", "mysterious", "hidden secrets",
                "vharmon", "mago", "concentracion", "concentración", "estudio",
                "aprende", "learn", "hablar", "speech", "eloquence", "vocabulario"],
    "fame": ["followers", "seguidores", "fame", "fama", "audience", "audiencia",
             "influencia", "influence", "social media", "artpop", "viral",
             "popularidad", "popularity", "notoriedad"],
    "home": ["home", "casa", "house", "household", "hogar", "family", "familia",
             "asistencia", "asistence", "el collar", "ayuda", "assist", "homework",
             "housework", "domestic", "abundance in the home"],
    "entity-lore": ["invocacion", "invocación", "invocar", "invocation", "servidor",
                    "servitors", "servidores", "entity", "entidad", "entidades",
                    "demon", "demonio", "demonio", "spirits", "spirit", "espiritu",
                    "the djinn", "djinn", "onironomicon", "non-human races", "nightmare",
                    "hive mind", "kek", "zod", "zose", "the dev", "videojuegos",
                    "programacion", "headhunter", "cualk", "clown"],
    "servitor-craft": ["servidor", "servitors", "servidores", "crear tu servidor",
                       "servidores magicos", "servidores magicos y caoticos",
                       "revolucion de los servidores", "desterrar", "desterrar a un servidor",
                       "destructor", "faq", "preguntas", "20 preguntas", "servers",
                       "tulpa", "thoughtform", "servitor", "chotek", "outsource",
                       "soliloki", "cocada", "manage", "management", "cochicholupos",
                       "manipula mentes", "alimentar", "feed", "charge", "cargar"],
    "goetia-demons": ["72", "goetia", "solomon", "salomon", "rey salomon", "demonios",
                      "demons", "claurizan", "president", "stolas", "abraxas",
                      "yaldabaoth", "glycon", "paimon", "baal", "bael", "on",
                      "72 demons", "solomon's", "rey de"],
    "astral-dreams": ["astral", "proyeccion", "proyección", "lucid", "lúcido",
                      "suenos", "sueños", "dream", "out of body", "bilocation",
                      "bilocation", "remote viewing", "clarivision", "hazel",
                      "tulpa", "pearl", "astral larvae", "larvae", "viajar entre dimensiones",
                      "awoken", "viajar", "journey astral", "dreams", "sleep"],
    "dream-journal": ["journal", "diario", "suenos", "sueños", "dreams", "recordar suenos",
                      "lucid", "lúcido", "oneiros", "oniromancia", "oneiromancia"],
    "divination": ["divination", "divinacion", "divinación", "oracle", "oraculo",
                   "oracular", "clairvoyance", "tarot", "runes", "runas", "futhark",
                   "iching", "i ching", "ouija", "scrying", "test", "prueba"],
    "tarot": ["tarot", "tarot para", "arcana", "cartas", "deck", "baraja"],
    "runes": ["runes", "runas", "futhark", "rune", "runas vikingas", "bindrune",
              "fehu", "algiz", "othala", "norse"],
    "iching": ["iching", "i ching", "hexagram", "hexagrama", "ching", "moneda"],
    "lunar": ["moon", "luna", "lunar", "lunar", "planetary", "planet", "lunaria",
              "aikendu", "solar", "moon magic", "lunar magick", "full moon",
              "new moon", "moon phase", "fase lunar"],
    "reality-hacking": ["gnosis", "paradigm", "paradigma", "belief", "creencia",
                        "imagination", "imaginacion", "matrix", "matrix", "manifest",
                        "manifestar", "ley de atraccion", "atracción", "reality",
                        "hack", "self experiment", "confirmation", "believe", "realidad",
                        "deseos", "voluntad", "deseos mas profundos", "adventurapraem",
                        "manifestar verdad", "reprogram"],
    "mind-science": ["telepathic", "telepathy", "telepatia", "telepatía", "mind",
                     "technology doesn't", "technology", "placebo", "efecto placebo",
                     "hypnosis", "hipnosis", "neuro", "brain", "cerebro", "physics",
                     "quantum", "quantica", "cuantica", "entropy", "entropia",
                     "fractal", "neurocienc", "statistical", "estadistic", "zener",
                     "probability", "probabilidad", "science", "ciencia", "por que tu mente",
                     "why does your mind", "systems", "sistemas adaptativos",
                     "science bridge", "neurociencia", "adaptativos"],
    "sigils": ["sigil", "sigilo", "sigils", "sigilos", "glyph", "glifo", "letter",
               "letra", "letter reduction", "geometry", "geometria", "geometría",
               "sacred geometry", "graficos", "gráficos", "generator", "generador",
               "acusticos", "acústicos", "sigilkore", "hyper-accelerated",
               "hyper accelerated", "teoria y practica de los sigilos", "how to charge",
               "cargar", "charge"],
    "chaos-basics": ["what is chaos magic", "que es la magia del caos", "mago del caos",
                     "beginner", "principiante", "iniciacion", "basic principles",
                     "terminos basicos", "términos básicos", "delusions", "delusiones",
                     "controversias", "polemicas", "polémicas", "false masters",
                     "falsos maestros", "exponiendo", "mago", "become a chaos",
                     "convertirte", "polvo", "poder", "teoria", "theoria"],
    "technomancy": ["technomancy", "technomagia", "tecnomagia", "cybermagia",
                    "cyber", "ciber", "techno", "tecnomago", "codigo", "code",
                    "programming", "programacion", "programación", "cell phone",
                    "telefono", "teléfono", "tecnopagan", "digital", "internet",
                    "hacktiv", "ciberactiv", "sigilkore", "applied"],
    "ritual-craft": ["incense", "incienso", "cannabis", "cannab", "correspondence",
                     "correspondencia", "ley de correspondencia", "attraction law",
                     "ley de atraccion", "atracción", "altar", "ritual tools",
                     "material", "wands", "wand", "varita", "why wizards use",
                     "colores", "colors", "offerings", "tools", "materials"],
    "history-occult": ["history", "historia", "satanic panic", "black metal",
                       "lovecraft", "crowley", "spare", "austin osman spare",
                       "juan", "constantine", "secretos de la historia", "wars",
                       "war", "historico", "historico", "orden", "order", "mormon",
                       "conquistador", "ancient magic", "antigua magia", "satanismo",
                       "left-hand", "left hand", "history of magic", "war"],
    "comparative": [" vs ", "versus", "than ", "que es mejor", "comparative",
                    "teosofia", "theosophy", "tantra", "red magic", "magia roja",
                    "diferencias", "differences", "chaos vs"],
    "mythology-ancient": ["annunaki", "atlantis", "atlantida", "atlántida",
                          "ancient gods", "dioses del dinero", "forbidden archaeology",
                          "arqueologia prohibida", "alien god", "dios alienigena",
                          "dios alienígena", "abraxas", "rueda universal",
                          "anunnaki", "anuket", "mytholog"],
    "philosophy": ["nothing is true", "everything is permitted", "philosophy",
                   "filosofia", "filosofía", "inteligencia", "intelligence",
                   "black magicians", "magos negros", "permitted", "permite",
                   "todo esta permitido", "is nothing true", "reality hacking",
                   "hacking"],
    "scams-skepticism": ["scam", "estafa", "fakes", "falsos", "false master",
                         "maestros falsos", "identify", "identificar", "chargers",
                         "estafadores", "facebook", "espejos", "mirror", "engaño",
                         "fake guru", "guru", "trampa"],
    "occult-culture": ["4chan", "meme", "memetic", "kek", "cult", "south america",
                       "sur de america", "witchcraft in", "brujeria en", "punk",
                       "anarchism", "anarquismo", "diy", "comics", "comic",
                       "alan moore", "moore", "urban occult", "occulto urbano",
                       "culture", "cultura", "subculture", "scene"],
    "horror-lore": ["lovecraft", "cthulhu", "eldritch", "weird fiction", "horror",
                    "terror", "horrorcore", "alien god", "vampire", "vampiro",
                    "werewolf", "lobo", "hombre lobo", "creature", "criatura",
                    "mythological creatures", "creatures"],
    "prayer": ["oracion", "oración", "prayer", "pray", "saint", "santo", "cipriano",
               "cyprian", "marta", "santa marta", "vencer enemigos", "enemigos"],
    "music-magick": ["music", "musica", "música", "orchestra", "orquesta", "star",
                     "estrella", "lamento", "salsa", "banda sonora", "soundtrack",
                     "binaural", "beats", "frecuenc", "frequency", "frequencies",
                     "despertar espiritual", "sound", "sonido"],
    "creatures-vampire": ["vampire", "vampiro", "vampires", "werewolf", "lobo",
                          "hombre lobo", "lvpinux", "become a", "convertirse en",
                          "transformation", "transformacion", "criatura", "creature"],
    "psychonaut": ["psychonaut", "psiconauta", "hypnosis", "hipnosis", "altered states",
                   "estados alterados", "consciousness", "consciencia", "exploracion",
                   "exploración", "drugs", "drogas", "substancia", "dissociation",
                   "disociacion", "disociación", "psicodelic", "psychedelic"],
    "time": ["time", "tiempo", "domina el tiempo", "fotamecus", "acelerar", "accelerate",
             "causality", "causalidad", "chrono", "temporal", "sequence", "secuencia"],
    "language-speech": ["language", "lengua", "idioma", "languages", "idiomas",
                        "zora", "zora", "zoray", "speech", "hablar", "speaking",
                        "eloquence", "elocuencia", "words", "palabras", "vocabulario",
                        "vocabulary", "comunicacion", "communication"],
    "astral-parasites": ["larva", "larvae", "larvas", "parasite", "parasito", "parásito",
                         "parasitos", "cortana", "gourmand", "ashara", "eliminare",
                         "remove entity", "clear astral", "energetic cleansing",
                         "limpieza", "cleansing", "sweep"],
    "secret-knowledge": ["book", "libro", "libros", "grimoire", "grimorio",
                         "pdf", "review", "resena", "reseña", "liber", "kybalion",
                         "enoch", "top 10", "mejores libros", "necronomicon",
                         "vishanti", "apophenion", "book of enoch", "libro de enoch",
                         "vampyros", "oculto", "secreto", "secret", "secrets",
                         "libros de magia", "magical books"],
    "travel-movement": ["viaje", "viajar", "travel", "journey", "cruzar", "crossing",
                        "threshold", "umbral", "proteccion de viaje", "safe journey",
                        "entre dimensiones", "otherworld", "otro mundo"],
    "binding-relationships": ["bind", "vincular", "atadura", "contrato", "contract",
                             "fidelidad", "fidelity", "honesty", "traicion",
                             "traición", "betrayal", "juramento", "oath", "atrapar",
                             "manipula mentes", "cochicholupos"],
    "wisdom-memory": ["sabiduria", "sabiduría", "wisdom", "memory", "memoria",
                      "inteligencia", "intelligenc", "aprender", "learn",
                      "comprender", "understanding", "entender", "retener",
                      "retencion", "dhyana", "arquetipo"],
}

FALLBACK_CYCLE = [
    "chaos-basics", "entity-lore", "servitor-craft", "money", "sigils",
    "divination", "reality-hacking", "mind-science", "ritual-craft",
    "history-occult",
]


# ==================================================== entity name extraction
# ============================================================== resolver
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


# ============================================================== spec builder
ENT_ARTICLE = "a magickal servitor dedicated to"
ENT_NOUN = {
    "money": "financial outcomes",
    "money-pact": "a negotiated arrangement",
    "love": "attraction and connection",
    "karmic-bonds": "severance and closure",
    "health": "healing and recovery",
    "protection": "protection and defence",
    "luck": "chance and fortune",
    "career": "professional outcomes",
    "creativity": "creative output",
    "beauty": "appearance and confidence",
    "clarity": "clarity and focus",
    "fame": "audience and influence",
    "home": "the household",
    "entity-lore": "a working relationship",
    "servitor-craft": "a single defined task",
    "goetia-demons": "a classical office",
    "astral-dreams": "the dream body",
    "dream-journal": "dream recall",
    "divination": "a reading",
    "tarot": "a reading",
    "runes": "a casting",
    "iching": "a consultation",
    "lunar": "timing",
    "reality-hacking": "a self-experiment",
    "mind-science": "a measurable effect",
    "sigils": "a sigil",
    "chaos-basics": "a working method",
    "technomancy": "a ritual interface",
    "ritual-craft": "a prepared space",
    "history-occult": "a source",
    "comparative": "a working method",
    "mythology-ancient": "a primary source",
    "philosophy": "a position",
    "scams-skepticism": "a vetting process",
    "occult-culture": "a community",
    "horror-lore": "a literary mode",
    "prayer": "a petition",
    "music-magick": "a soundscape",
    "creatures-vampire": "a practice frame",
    "psychonaut": "a state shift",
    "time": "a sequence",
    "language-speech": "a statement",
    "astral-parasites": "a clearing protocol",
    "secret-knowledge": "a working canon",
    "travel-movement": "a safe passage",
    "binding-relationships": "a declared term",
    "wisdom-memory": "a study schedule",
}

# 6 angle variants per domain keep two same-domain articles structurally distinct
ANGLE_VARIANTS = [
    ("Beginner Path", "the first-time practitioner's route through"),
    ("Protocol", "the full operational sequence, step by step"),
    ("Framework", "the underlying structure and why it is shaped this way"),
    ("Field Notes", "what actually happens in practice, including the failures"),
    ("Reference", "the tables, correspondences and terms you will need"),
    ("Critique", "the honest limits, failure modes and counterarguments"),
]


def main():
    errs = validate(verbose=True)
    if errs:
        print("\nABORT: domain library invalid")
        return 1

    with open(VIDEOS, "r", encoding="utf-8") as f:
        videos = json.load(f)
    with open(EXISTING, "r", encoding="utf-8") as f:
        existing = set(json.load(f))
    with open(CATALOG, "r", encoding="utf-8") as f:
        cat = json.load(f)
    prod_by_id = OrderedDict()
    for it in cat["apps"] + cat["books"]:
        prod_by_id[it["id"]] = it

    specs = []
    used_slugs = {}
    dom_counter = Counter()
    resolvers = Counter()
    fb_index = 0

    for v in videos:
        raw_title = v["title"]
        dom, how = resolve_domain(v, fb_index)
        if how.startswith("cluster") or how == "cluster":
            fb_index += 1
        if dom not in DOMAINS:
            dom = "chaos-basics"
        d = DOMAINS[dom]
        resolvers[how] += 1
        dom_counter[dom] += 1

        n = dom_counter[dom]
        variant = ANGLE_VARIANTS[(n - 1) % len(ANGLE_VARIANTS)]

        entity, entity_src = build_entities.match(raw_title)
        ent_noun = ENT_NOUN.get(dom, "a working outcome")
        topic = ascii_lower(d["label"])
        focus = topic

        # ---- slug: prefer entity, else focus + angle
        if entity and len(entity) > 2:
            slug = slugify("%s-%s" % (entity, d["terms"][0]))
        else:
            slug = slugify("%s-%s-guide" % (focus, d["terms"][0]))
        if not slug or len(slug) < 8:
            slug = slugify("%s-chaos-magic" % (entity or topic))

        # de-dupe slugs
        base = slug
        k = 2
        while slug in used_slugs:
            slug = "%s-%d" % (base[:55], k)
            k += 1
        used_slugs[slug] = True

        # ---- titles
        h1 = entity or titlecase(d["label"])
        if entity:
            title_t = "%s: Complete Chaos Magic Guide to %s" % (h1, titlecase(d["label"]))
        else:
            title_t = "%s %s: %s" % (
                titlecase(focus.title()), variant[0],
                titlecase(d["label"]))
        title_t = re.sub(r"\s+", " ", title_t).strip()
        if len(title_t) > 68:
            title_t = title_t[:68].rsplit(" ", 1)[0]

        seo_title = "%s | %s %s" % (
            h1 if entity else titlecase(d["label"]),
            titlecase(d["label"]), variant[0])
        seo_title = re.sub(r"\s+", " ", seo_title).strip()
        if len(seo_title) > 60:
            seo_title = seo_title[:60].rsplit(" ", 1)[0]

        # ---- keywords: entity variants + domain terms + long tail
        kws = []
        if entity:
            kws.append("%s sigil" % ascii_lower(entity))
            kws.append("%s ritual" % ascii_lower(entity))
            kws.append("%s invocation" % ascii_lower(entity))
            kws.append("%s chaos magic" % ascii_lower(entity))
        kws.extend(d["terms"])
        kws.append("%s %s" % (variant[0].lower(), d["terms"][0]))
        seen = set()
        kws = [k for k in kws if not (k in seen or seen.add(k))][:14]

        # ---- description
        desc_bits = []
        if entity:
            desc_bits.append(
                "A complete working guide to %s: what it is, the %s structure behind it, "
                "and the full protocol." % (entity, d["label"].lower()))
        else:
            desc_bits.append(
                "A complete working guide to %s covering %s." % (topic, d["label"].lower()))
        desc_bits.append("Includes step-by-step protocol, honest failure modes, and FAQ.")
        description = " ".join(desc_bits)
        if len(description) > 158:
            description = description[:158].rsplit(" ", 1)[0] + "..."

        # ---- H1 target noun for the intro/CTA
        target = entity or titlecase(d["label"])

        # ---- outline: headings are built from a per-article role phrase
        #      (the entity, or a subject phrase lifted from the title) so no
        #      two articles in the corpus can share an H2. Rotating the
        #      shared domain list would give ~7 articles one skeleton.
        subject = entity or O.topic_subject(
            T.clean_title(raw_title), d["label"])
        role, h2s = O.build_outline(subject, dom, n, variant, idx=(n * 3) % 3)

        # ---- product rotation: rotate the domain product list per spec so
        #      the CTA alternates across the catalog
        prods = d["products"]
        r = (n - 1) % max(1, len(prods))
        rotated = prods[r:] + prods[:r]
        chosen = [prod_by_id[p] for p in rotated if p in prod_by_id][:3]
        # guarantee at least one book on money/pact/secret-knowledge
        if dom in ("money", "money-pact", "secret-knowledge", "servitor-craft"):
            if not any(c["kind"] == "book" for c in chosen):
                for p in rotated:
                    if p in prod_by_id and prod_by_id[p]["kind"] == "book":
                        chosen[-1] = prod_by_id[p]
                        break

        # ---- tools rotation for the free-tool CTA block
        tools = cat["tools"]
        tsel = [tools[(i * 7 + n) % len(tools)] for i in range(3)] if tools else []

        # ---- FAQ: domain faq, rotated, always >=3
        faq = d["faq"]
        fr = (n - 1) % max(1, len(faq))
        faq = faq[fr:] + faq[:fr]

        specs.append(OrderedDict([
            ("n", v["n"]),
            ("vid", v["id"]),
            ("cluster", v.get("cluster", "")),
            ("resolver", how),
            ("domain", dom),
            ("domain_label", d["label"]),
            ("intent", d["intent"]),
            ("blog_category", d["cat"]),
            ("risk", d["risk"]),
            ("risk_note", RISK_NOTES[d["risk"]]),
            ("variant", variant[0]),
            ("variant_phrase", variant[1]),
            ("entity", entity),
        ("entity_source", entity_src),
            ("focus", focus),
            ("focus", focus),
            ("ent_noun", ent_noun),
            ("h1", h1),
            ("title_tag", title_t),
            ("seo_title", seo_title),
            ("description", description),
            ("keywords", kws),
            ("slug", slug),
            ("og", d["og"]),
            ("outline", h2s),
        ("subject", subject),
        ("role_phrase", role),
            ("facts", d["facts"]),
            ("faq", faq),
            ("products", [c["id"] for c in chosen]),
            ("tools", [t["id"] for t in tsel]),
            ("source_url", v.get("url", "")),
            ("views", v.get("views", 0)),
            ("duration", v.get("dur", "")),
            ("published", TODAY_ISO),
            ("published_human", TODAY_HUMAN),
            ("author", AUTHOR),
            ("collides_existing", slug in existing),
        ]))

    # ---------------------------------------------------------- write out
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(specs, f, ensure_ascii=False, indent=1)

    collisions = [s["slug"] for s in specs if s["collides_existing"]]
    n_entities = sum(1 for s in specs if s["entity"])
    report = {
        "total": len(specs),
        "domains_used": len(dom_counter),
        "entity_named": n_entities,
        "domainless": len(specs) - n_entities,
        "resolvers": dict(resolvers),
        "collisions_with_existing_466": collisions,
        "domain_spread": dict(dom_counter.most_common()),
        "cat_spread": dict(Counter(s["blog_category"] for s in specs)),
        "unique_slugs": len(set(s["slug"] for s in specs)),
    }
    with open(os.path.join(HERE, "_spec_report.json"), "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=1)

    print("\n================ SPEC BUILD REPORT ================")
    print("specs written      : %d" % report["total"])
    print("unique slugs       : %d" % report["unique_slugs"])
    print("domains exercised  : %d / %d" % (report["domains_used"], len(DOMAINS)))
    print("entity-named specs : %d" % n_entities)
    print("topic specs        : %d" % report["domainless"])
    print("resolver mix       : %s" % json.dumps(resolvers, sort_keys=True))
    print("slug collisions w/ existing 466: %d %s" % (
        len(collisions), collisions[:12] if collisions else ""))
    print("category spread    : %s" % json.dumps(report["cat_spread"], sort_keys=True))
    print("\ndomain spread (top 20):")
    for dname, c in dom_counter.most_common(20):
        print("  %-22s %3d" % (dname, c))
    return 0


if __name__ == "__main__":
    sys.exit(main())
