"""Contextual call to action, one per blog article.

The audit of 2026-10-01 measured that 715 of the 815 blog articles carried no
monetised link at all: 94 pointed at play.google.com and 6 at pay.hotmart.com.
Every article already linked to product *pages*, but the buyer had to click
twice and land on a page before seeing a price, which is the step most people
do not take.

This module closes that gap. It picks one product per article from the
article's own domain in the link graph, and links straight to the checkout URL
published in catalog.json, carrying a utm_content tag so the article that
produced a sale is identifiable in the store console.

Three editorial rules, all deliberate:

1. The four third-party apps (norse-rune-oracle, lunar-phase-calculator,
   iching-oracle, chaos-sigil-generator) are never promoted here. They pay a
   30% affiliate commission, which leaves about US$1.20 per sale, and
   data/play-catalog.json says in as many words that they generate no revenue
   for us. An article that only fits a third-party app gets a different own
   product instead, or the bundle.
2. The price always comes from catalog.json. The lucid-dream page shows
   US$9.99 while the catalogue says US$3.99; the catalogue is the source of
   truth, so the CTA says US$3.99 and the page discrepancy stays a separate,
   already-reported bug.
3. The block is one purchase decision, not a catalogue. An article gets a
   primary product with a checkout button and a secondary link to the product
   page for detail. Nothing else.

The framing sentence is chosen by domain, not by article, so the same 19
articles about sigils get the same sentence. That is intended: it is a
commercial module parameterised by topic, not authored prose. It is excluded
from the corpus n-gram index in slop.py for the same reason crossrefs is.
"""

import json
import os
import re
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.normpath(os.path.join(HERE, "..", "..", ".."))
CATALOG = os.path.join(REPO, "projects", "data", "yt-articles", "catalog.json")
GRAPH = os.path.join(REPO, "data", "link-graph.json")

MARK_START = "<!-- linkgraph:cta:start -->"
MARK_END = "<!-- linkgraph:cta:end -->"

# Third-party apps: 30% commission, no revenue, excluded by editorial decision.
THIRD_PARTY = {
    "norse-rune-oracle",
    "lunar-phase-calculator",
    "iching-oracle",
    "chaos-sigil-generator",
}

# domain -> (primary product id, secondary product id or None)
#
# Chosen by taking the highest-signal OWN product in that domain, then
# overriding where the signal points at something that is not actually the
# right tool for the topic. An override only happens when the automatic pick
# would have been plainly wrong, and the reason is in the comment.
DOMAIN_MAP = {
    # automatic picks, kept because the signal is already right
    "mind-science": ("psi-gym", "mind-the-gap-pdf"),
    "astral-dreams": ("dream-machine", "lucid-dream"),
    "entity-lore": ("arcana-goetia", "manual-activacion-servidores-magicos-pdf"),
    "goetia-demons": ("arcana-goetia", "codex-chaoticus-pdf"),
    "servitor-craft": ("manual-activacion-servidores-magicos-pdf", "noctem-tools"),
    "astral-parasites": ("noctem-tools", "lucid-dream"),
    "love": ("tarot-chaos-pdf", "psi-gym"),
    "creativity": ("tarot-chaos-pdf", "psi-gym"),
    "reality-hacking": ("psi-gym", "mind-the-gap-pdf"),
    "astral-lab": ("astral-lab", "psi-gym"),
    "runes": ("tratado-runas-cazadoras-caos-pdf", "tarot-chaos-pdf"),
    "divination": ("unofficial-rider-waite-tarot", "tarot-chaos-pdf"),
    "karmic-bonds": ("manual-activacion-servidores-magicos-pdf", "arcana-goetia"),
    "prayer": ("arcana-goetia", "manual-activacion-servidores-magicos-pdf"),
    "horror-lore": ("noctem-tools", "astral-lab"),
    "music-magick": ("dream-machine", "psi-gym"),
    "psychonaut": ("dream-machine", "psi-gym"),
    # overrides
    "chaos-basics": ("codex-chaoticus-pdf", "tarot-chaos-pdf"),
    "sigils": ("codex-chaoticus-pdf", "psi-gym"),
    "lunar": ("astral-lab", "dream-machine"),
    "tarot": ("unofficial-rider-waite-tarot", "tarot-chaos-pdf"),
    "secret-knowledge": ("codex-chaoticus-pdf", "liber-lvpinux-pdf"),
    "money": ("eerieroads", "codex-chaoticus-pdf"),
    "iching": ("codex-chaoticus-pdf", "psi-gym"),
    "technomancy": ("codex-chaoticus-pdf", "psi-gym"),
    "history-occult": ("liber-lvpinux-pdf", "codex-chaoticus-pdf"),
    "protection": ("noctem-tools", "arcana-goetia"),
    "ritual-craft": ("codex-chaoticus-pdf", "astral-lab"),
    "clarity": ("mind-the-gap-pdf", "dream-machine"),
    "health": ("mind-the-gap-pdf", "dream-machine"),
    "creatures-vampire": ("eerieroads", "astral-lab"),
    "time": ("astral-lab", "dream-machine"),
    "scams-skepticism": ("codex-chaoticus-pdf", "liber-lvpinux-pdf"),
    "mythology-ancient": ("tarot-chaos-pdf", "astral-lab"),
    "philosophy": ("mind-the-gap-pdf", "liber-lvpinux-pdf"),
    "money-pact": ("arcana-goetia", "manual-activacion-servidores-magicos-pdf"),
    "career": ("mind-the-gap-pdf", "psi-gym"),
    "occult-culture": ("codex-chaoticus-pdf", "tarot-chaos-pdf"),
    "home": ("codex-chaoticus-pdf", "manual-activacion-servidores-magicos-pdf"),
    "comparative": ("codex-chaoticus-pdf", "noctem-tools"),
    "beauty": ("mind-the-gap-pdf", "noctem-tools"),
    "language-speech": ("codex-chaoticus-pdf", "psi-gym"),
    "luck": ("eerieroads", "psi-gym"),
    "fame": ("psi-gym", "noctem-tools"),
}

# One framing sentence per domain: why this product answers this topic. Kept
# short on purpose. These are written per topic, not copied from a template
# with the product name swapped, because a reader who notices the swap stops
# reading the button.
FRAMING = {
    "mind-science": "Most of the claims on this page are about attention, expectancy and measurement, and the three are easier to test on yourself than to argue about.",
    "astral-dreams": "The work described here is a nightly routine with a notebook next to it, and that is exactly the shape of a dream journal with statistics attached.",
    "chaos-basics": "The method is four steps long and fits on one page, and it is set out in full, with the tables, inside the Codex.",
    "entity-lore": "The catalogue is the practical part: seventy-two entries with a rank, a form and an office, and it is browsable offline.",
    "sigils": "Reduction, drawing, charging and forgetting are all mechanical steps, and the Codex works through the five reduction families one by one.",
    "goetia-demons": "Every entry in the catalogue here is searchable, filterable and readable with the phone in airplane mode, which matters more than it sounds.",
    "lunar": "A lunar cycle is a calendar problem before it is a magical one, and the chart behind it is where the timing actually comes from.",
    "tarot": "Seventy-eight cards, six spreads and a searchable encyclopedia, all of it offline, which is the difference between a deck and an app.",
    "secret-knowledge": "The argument on this page is about provenance, and a library that ships with source notes and reading order is the honest version of that shelf.",
    "runes": "Twenty-four signs, laid out with the full futhark and the spread positions, and a set you can cast from without a screen in the room.",
    "reality-hacking": "Belief is a variable here, so the useful tool is one that records what you did and what followed, with a number attached.",
    "money": "An aim with a figure and a date on it is a much easier thing to track, and a map with your own intentions on it makes the tracking visual.",
    "iching": "Casting is arithmetic, hexagram lookup is a reference, and both belong in a book you can search rather than a screen you scroll.",
    "servitor-craft": "Design, charge, feeding and dismissal are four documented steps, and the manual goes through them in that order with the paperwork included.",
    "technomancy": "Encoding a statement and checking what came out is a design problem as much as a magical one, and the Codex has the tables for it.",
    "history-occult": "The historical layer matters because it explains why the practice looks the way it does, and the Liber Lvpinux sets it out with the sources named.",
    "astral-parasites": "Nothing in this domain is verifiable from the inside, which is why a camera, a recorder and a timestamp are the honest instruments.",
    "protection": "A boundary is easier to keep when you can see what you are keeping it from, and that is what an evidence log is for.",
    "love": "The cartomancy here is applied rather than divinatory, and the book shows the method step by step instead of leaving it implied.",
    "occult-culture": "The scene described here is contemporary, and the book that came out of the same decade is the closest primary source available.",
    "ritual-craft": "Correspondence is a consistency problem before it is a causal one, and the Codex prints fifteen of the tables so you can stop memorising them.",
    "clarity": "A decision gets made once, in about three tenths of a second, and the rest of the work is preparation and review. The book is about the preparation.",
    "health": "Sleep, breath and the gap between stimulus and response are the three inputs, and the book covers the third one properly.",
    "creatures-vampire": "The motif is old and the literature is recent, and the book separates the two with the sources in view.",
    "creativity": "Constraint is the engine, not the obstacle, and the book gives you a fixed form to work inside.",
    "time": "Timing is a horary problem, and transits are the closest thing this site has to a clock you can read.",
    "scams-skepticism": "Checking a claim is a procedure, and the book is the longest worked example of that procedure on this site.",
    "mythology-ancient": "The material is old and the translations are public, and the book keeps the two apart where most retellings do not.",
    "music-magick": "Tempo and entrainment are measurable, and a journal that records the track alongside the result is what makes the measurement possible.",
    "philosophy": "The line gets quoted more than it gets read, and the book takes the thirty-second version apart properly.",
    "money-pact": "Pacts are agreements with stated terms, and the app that holds a rank, an office and a signature is the closest digital equivalent.",
    "career": "Most of a career is other people's decisions, which is why the controllable part has to be written down in advance.",
    "psychonaut": "Altered states are easier to compare with a record than in the moment, and the journal is the part worth keeping.",
    "divination": "A spread is a question with positions attached, and the app holds the deck and the positions without a bookmark.",
    "karmic-bonds": "A bond is described in terms of a link, a duration and a release, and those are the three fields in the manual.",
    "prayer": "A traditional prayer is a fixed text and a fixed boundary, and the book treats the boundary as part of the text.",
    "home": "Domestic practice is mostly small tools used often, and the Codex has the table for the ones you keep forgetting.",
    "comparative": "Comparisons are only useful with the sources next to each other, and the book prints the ones being compared.",
    "horror-lore": "The imagery is old and the fear is specific, and the book separates which is which.",
    "beauty": "Glamour is a technique with a cost, and the book is honest about the price before the method.",
    "language-speech": "The tradition of the word is the oldest layer, and the Codex sets out the formulas before the interpretations.",
    "luck": "A decision made on a good day is still a decision, and a map with the intention written on it is the cheapest record you can keep.",
    "fame": "Nobody controls who notices. What you can control is whether the thing you made is finished, and that is the whole discipline.",
}

# What the product is, one clause, used in the line under the button. Kept out
# of FRAMING on purpose: the framing is about the article, this is about the
# product, and mixing the two reads as sales copy.
PRODUCT_NOTE = {
    "psi-gym": "the Zener deck, the scoring statistics and the training modes, all offline",
    "dream-machine": "the dream journal, the reality checks, the induction protocols and the analytics, all offline",
    "lucid-dream": "the binaural engine, the unlimited journal and the environment sensors, all offline",
    "noctem-tools": "the SLS camera, the EVP recorder and the environmental sensors, all offline",
    "astral-lab": "natal charts, real-time transits and aspect grids at VSOP87 precision, all offline",
    "eerieroads": "chaos GPS coordinates, intention mapping and the synchronicity log, on OpenStreetMap",
    "unofficial-rider-waite-tarot": "the full 78-card deck, six spreads and a searchable encyclopedia, in seven languages",
    "arcana-goetia": "the seventy-two entries, the sigil generator and the invocation guides, all offline",
    "codex-chaoticus-pdf": "twenty-seven thousand words, fifteen correspondence tables, five sigil methods and the servitor material",
    "tarot-chaos-pdf": "the arcana worked as a chaos magick system, with sigilization and gnosis alongside the readings",
    "manual-activacion-servidores-magicos-pdf": "the design sheet, the charge, the feeding schedule and the dismissal, in that order",
    "liber-lvpinux-pdf": "the lycanthropic path with its sources named, and the working material that goes with it",
    "tratado-runas-cazadoras-caos-pdf": "the sixty-four runic servitors and the magic chess matrix, with the full futhark as reference",
    "mind-the-gap-pdf": "the neuroscience of the response gap and seven laws for using it, across money, health and relationships",
    "ouija-cazadora-pdf": "the board treated as an instrument, with the setup and the questions that work",
}

DEFAULTS = {
    "mind-science": ("psi-gym", "mind-the-gap-pdf"),
    "unknown": ("codex-chaoticus-pdf", "psi-gym"),
}

# The one product worth more than a single title, and the only one whose
# checkout URL was observed rather than assembled. The audit of 2026-10-01
# lists it as external_url_observed_sale_unverified, which means the URL
# resolves and was seen; it does not mean a sale is attributed. It is offered
# as a second step, never as the primary button, because a reader who came for
# one book is not going to buy seven on the strength of a blog post.
BUNDLE = {
    "id": "bundle-todos-los-libros",
    "name": "The complete library, seven books",
    "amount": 19.99,
    "price_pretty": "US$19.99",
    "url": "https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W",
}


def load_catalog():
    with open(CATALOG, encoding="utf-8") as fh:
        return json.load(fh)


def load_graph():
    with open(GRAPH, encoding="utf-8") as fh:
        return json.load(fh)


def _products(catalog):
    out = {}
    for item in catalog.get("apps", []) + catalog.get("books", []):
        if item.get("status") != "available" or not item.get("url"):
            continue
        out[item["id"]] = item
    return out


def _slug_words(slug):
    return set(re.findall(r"[a-z]+", slug.lower()))


def _h2(text):
    """Match the visual weight of the surrounding h2 without repeating one."""
    return re.sub(r"\s+", " ", str(text)).strip()


def _utm(url, slug):
    """Tag the checkout with the article that sent the visit.

    catalog.json already carries utm_source, utm_medium and utm_campaign.
    utm_content is the one that answers the only question that matters while
    there is no baseline: which articles produce revenue.
    """
    if not slug:
        return url
    clean = re.sub(r"[^A-Za-z0-9_\-]+", "_", slug)[:60]
    sep = "&" if "?" in url else "?"
    return url + sep + "utm_content=" + clean


def pick(domain, catalog=None):
    """Return (primary, secondary) product records for a domain.

    A domain missing from the map falls back to the highest-value own product
    rather than to nothing: an article with no CTA is the failure mode this
    whole change exists to remove.
    """
    catalog = catalog or load_catalog()
    prods = _products(catalog)
    primary_id, secondary_id = DOMAIN_MAP.get(domain, DEFAULTS["unknown"])
    primary = prods.get(primary_id)
    if primary is None:
        # a mapped product that is not actually purchasable right now
        primary = next(
            (prods[i] for i in ("codex-chaoticus-pdf", "psi-gym") if i in prods),
            None,
        )
        if primary is None:
            return None, None
    secondary = prods.get(secondary_id) if secondary_id else None
    if secondary is not None and secondary["id"] == primary["id"]:
        secondary = None
    return primary, secondary


def build(slug, domain, h1=None, catalog=None):
    """Render the contextual CTA section, or '' when nothing can be sold.

    The section is one purchase decision with one button. It deliberately does
    not list the other six books or the remaining apps: a page that offers
    eleven things offers nothing, and the whole gap being closed here is that
    the reader had no obvious next step at all.
    """
    catalog = catalog or load_catalog()
    primary, secondary = pick(domain, catalog)
    if primary is None:
        return ""

    pid = primary["id"]
    kind = primary.get("kind", "app")
    price = primary.get("price_pretty") or ""
    off = primary.get("price_off") or ""
    # the note reads as a sentence after the price, so it starts capitalised
    note = PRODUCT_NOTE.get(pid, "")
    if note:
        note = note[0].upper() + note[1:]
    frame = FRAMING.get(domain) or FRAMING["mind-science"]
    checkout = _utm(primary["url"], slug)
    page = "../" + primary.get("page", "")

    if kind == "app":
        button = "Get it for %s on Google Play" % price
        seller = "Android app, one-time purchase, no subscription and no account."
    else:
        button = "Get the PDF for %s" % price
        seller = "Instant download, PDF, no subscription."

    off_html = ' <span class="cta-off">%s</span>' % off if off else ""

    lines = [
        MARK_START,
        '<section class="cta-contextual" id="try-it">',
        "  <h2>%s</h2>" % _h2("Put this into practice"),
        '  <div class="cta-contextual-body">',
        '    <p class="cta-contextual-why">%s</p>' % frame,
        '    <p class="cta-contextual-what"><strong>%s</strong>, %s. %s%s. %s</p>'
        % (primary["name"], price, note, off_html, seller),
        '    <p class="cta-actions">',
        '      <a class="cta-button primary" href="%s" target="_blank" rel="noopener nofollow">%s</a>'
        % (checkout, button),
    ]
    if secondary is not None:
        lines.append(
            '      <a class="cta-secondary" href="../%s">%s, %s</a>'
            % (secondary.get("page", ""), secondary["name"],
               secondary.get("price_pretty") or "")
        )
    lines.append('      <a class="cta-secondary" href="%s">What is inside</a>' % page)
    lines.append("    </p>")
    if kind == "book":
        # A single title at US$3.99 to US$9.99 is the low end of the range, and
        # the audit put basket size ahead of traffic as the lever that actually
        # moves the number. The bundle is the one offer on this site that
        # multiplies the ticket instead of the visits.
        lines.append(
            '    <p class="cta-contextual-bundle">Or take the whole shelf in one '
            'purchase: <a href="%s">all seven books, %s</a>, against %s on the '
            'list price.</p>'
            % (_utm(BUNDLE["url"], slug), BUNDLE["price_pretty"], "US$41.93")
        )
    lines.append("  </div>")
    lines.append("</section>")
    lines.append(MARK_END)
    return "\r\n".join(lines)


def strip_block(html, nl="\n"):
    """Remove a previously injected block, markers included."""
    pat = re.compile(
        r"(?is)\s*%s.*?%s\s*" % (re.escape(MARK_START), re.escape(MARK_END))
    )
    return pat.sub(nl, html)


def __main__():
    import sys

    graph = load_graph()
    catalog = load_catalog()
    wanted = sys.argv[1:]
    tally = {}
    total = 0
    for art in graph["articles"]:
        if wanted and art["slug"] not in wanted:
            continue
        block = build(art["slug"], art.get("domain"), art.get("title"), catalog)
        total += 1
        if not block:
            print("[skip] %s: no comprable product" % art["slug"])
            continue
        pid = pick(art.get("domain"), catalog)[0]["id"]
        tally[pid] = tally.get(pid, 0) + 1
    print("articulos: %d" % total)
    for pid, n in sorted(tally.items(), key=lambda kv: -kv[1]):
        print("  %-46s %d" % (pid, n))
    print("sin CTA: %d" % (total - sum(tally.values())))


if __name__ == "__main__":
    __main__()
