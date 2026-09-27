# -*- coding: utf-8 -*-
"""
domains.py - merge + validate the domain library.
Run:  python domains.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

from domains_core import DOMAINS_CORE          # noqa: E402
from domains_ext import DOMAINS_EXT            # noqa: E402

DOMAINS = {}
DOMAINS.update(DOMAINS_CORE)
DOMAINS.update(DOMAINS_EXT)

# ---------------------------------------------------------------- allowlists
# The 71 OG image base names verified present in assets/images/blog/ (preflight 0.4)
OG_ALLOWLIST = set("""
arcana-goetia-app-review arcana-goetia-guide astral-projection-techniques-beginners
austin-osman-spare-sigil-method banishing-guide best-chaos-magick-books-essential-reading
best-esp-training-apps-android binaural-beats-lucid-dreaming-guide
bindrune-wealth-protection-fehu-algiz-othala chaos-hunter-runes-treatise-review
chaos-magick-beginners-complete-guide chaos-magick-beginners-guide chaos-magick-bundle-review
chaos-sigil-generator-app-review clairvoyance-test-online cryptographic-sigil-programming-code
cyber-paganism-digital-spirituality-guide digital-sigil-guide digital-sigil-magic-guide
dream-machine-app-review egregore-creation-collective-thought-forms free-i-ching-online-guide
free-lunar-phase-calculator-guide free-online-rune-reading-guide free-sigil-generator-online-guide
goetic-magic-beginners-guide history-of-chaos-magick how-to-banish-cleanse-space
how-to-charge-sigil-correctly how-to-create-magickal-servitor
how-to-make-digital-sigil-complete-guide i-ching-digital-guide
i-ching-hexagram-meanings-complete-guide i-ching-oracle-app-review
i-ching-three-coin-probability-distribution iching-guide liber-lvpinux-pdf-review
lucid-dreaming-guide lunar-phase-calculator-app-review lunar-phase-guide lunar-phase-magic-guide
magical-servitors-manual-pdf-review new-moon-vs-full-moon-ritual-guide
norse-rune-oracle-app-review norse-runes-beginners-guide norse-runes-guide ouija-cazadora-pdf-review
paradigm-shift-belief-as-tool paradigm-shift-belief-tool planetary-magic-guide
planetary-magic-hours-guide planetary-magic-squares-sigil-creation psi-gym-zener-cards-app-review
psychonaut-guide-consciousness-exploration reality-hacking-techniques
remote-viewing-techniques-beginners rider-waite-tarot-app-review rider-waite-tarot-beginners-guide
scrying-techniques-mirror-crystal-digital sigil-vs-servitor-differences sigil-vs-servitor-guide
tarot-reading-guide tarot-spreads-beginners-guide what-is-cybermancy-digital-sorcery-guide
what-is-gnosis-how-to-achieve what-is-magick-how-spells-work what-is-technomancy-digital-magic
zener-cards-esp-training-guide zener-cards-guide zener-cards-online-esp-test
zener-cards-probability-statistical-significance
""".split())

# The 13 canonical blog/index.html filter values (preflight 0.8)
CANONICAL_CATS = [
    "sigils", "divination", "dreaming", "goetia", "runes", "moon",
    "tarot", "iching", "basics", "reviews", "free-tools", "advanced",
]

# Record keys every domain must have
REQUIRED_KEYS = [
    "label", "intent", "cat", "og", "products", "terms",
    "h2", "facts", "faq", "risk",
]
VALID_INTENTS = {"informational", "commercial", "mixed"}

# risk note library -> consumed by the safety-section builder
RISK_NOTES = {
    "abundance-discipline": (
        "Wealth work fails most often when it becomes compulsive. Fix a review date, write down what you "
        "did, and if you find yourself checking daily, stop."
    ),
    "pact-discipline": (
        "No pact in the historical sources creates money from nothing, and none of them is free. Any "
        "arrangement that escalates the demanded payment is not a price, it is a warning."
    ),
    "consent-discipline": (
        "The line here is other people's autonomy. Work on your own behaviour, your own availability, "
        "your own boundaries. Do not work on overriding somebody's stated preferences."
    ),
    "closure-discipline": (
        "Severance rituals are for your own closure. They are not a method of controlling the other "
        "person, and treating them as one will not work."
    ),
    "medical-boundary": (
        "Nothing here replaces diagnosis or treatment. If you have a health concern, see a clinician "
        "first and use this work only alongside whatever they tell you."
    ),
    "grounding-discipline": (
        "If practice starts interfering with sleep, work, or relationships, reduce the intensity. The "
        "tradition's own advice is a short daily practice rather than an escalating one."
    ),
    "clarity-discipline": (
        "The target must be specific enough to act on. 'Be happy' cannot be worked with; 'three client "
        "conversations this week' can."
    ),
    "self-care-discipline": (
        "Practice that increases distress rather than reducing it should stop. Escalating fixity in "
        "body or appearance work is a recognised warning sign."
    ),
    "epistemics-discipline": (
        "Keep your claims modest. Pre-register a falsifiable prediction, set a deadline, and record "
        "failures. This is not scepticism about the practice; it is the only way to know what it does."
    ),
}


def validate(verbose=True):
    """Return list of error strings. Empty list == library is sound."""
    errs = []

    for key, d in sorted(DOMAINS.items()):
        for rk in REQUIRED_KEYS:
            if rk not in d:
                errs.append("domain '%s' missing key '%s'" % (key, rk))
        if d.get("cat") not in CANONICAL_CATS:
            errs.append("domain '%s' bad cat '%r'" % (key, d.get("cat")))
        if d.get("og") not in OG_ALLOWLIST:
            errs.append("domain '%s' og '%r' NOT in allowlist" % (key, d.get("og")))
        if d.get("intent") not in VALID_INTENTS:
            errs.append("domain '%s' bad intent %r" % (key, d.get("intent")))
        if d.get("risk") not in RISK_NOTES:
            errs.append("domain '%s' unknown risk key %r" % (key, d.get("risk")))
        if len(d.get("h2", [])) < 8:
            errs.append("domain '%s' needs >=8 h2 (has %d)" % (key, len(d.get("h2", []))))
        if len(d.get("faq", [])) < 3:
            errs.append("domain '%s' needs >=3 faq (has %d)" % (key, len(d.get("faq", []))))
        if len(d.get("facts", [])) < 3:
            errs.append("domain '%s' needs >=3 facts (has %d)" % (key, len(d.get("facts", []))))
        if len(d.get("terms", [])) < 5:
            errs.append("domain '%s' needs >=5 terms (has %d)" % (key, len(d.get("terms", []))))
        for t in d.get("terms", []):
            if not re.match(r"^[a-z0-9 .,'\-/?]+$", t):
                errs.append("domain '%s' term not lowercase: %r" % (key, t))

    if verbose:
        print("domains: %d total (%d core + %d ext)" % (
            len(DOMAINS), len(DOMAINS_CORE), len(DOMAINS_EXT)))
        cats = {}
        for d in DOMAINS.values():
            cats[d["cat"]] = cats.get(d["cat"], 0) + 1
        print("cat spread: %s" % json.dumps(cats, sort_keys=True))
        ogs = sorted(set(d["og"] for d in DOMAINS.values()))
        print("distinct OG images used: %d / %d allowlist" % (len(ogs), len(OG_ALLOWLIST)))
        prods = set()
        for d in DOMAINS.values():
            prods.update(d["products"])
        print("distinct product ids referenced: %d" % len(prods))
        if errs:
            print("\nERRORS (%d):" % len(errs))
            for e in errs:
                print("  - %s" % e)
        else:
            print("\nVALIDATION: OK (0 errors)")
    return errs


if __name__ == "__main__":
    sys.exit(1 if validate() else 0)
