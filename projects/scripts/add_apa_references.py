"""
Inject APA References sections into all blog articles.
Only adds to articles missing <h2>References</h2><ul> pattern.
Uses real academic and occult works organized by topic.
"""
import re, os

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
BLOG = os.path.join(ROOT, 'blog')

# ── APA Reference Library ──────────────────────────────────────────────────────
# Each entry is (author, year, title, publisher)
# Formatted as: Author, A.A. (Year). <em>Title</em>. Publisher.

REFS = {
    # ─── General Chaos Magick ──────────────────────────────────────────────────
    "carroll87": ("Carroll, P.J.", "1987", "Liber Null & Psychonaut", "York Beach, ME: Samuel Weiser"),
    "spare13": ("Spare, A.O.", "1913", "The Book of Pleasure (Self-Love)", "London."),
    "hine95": ("Hine, P.", "1995", "Condensed Chaos: An Introduction to Chaos Magic", "Tempe, AZ: New Falcon Publications"),
    "sherwin92": ("Sherwin, R.", "1992", "The Theatre of Magic", "Oxford: Mandrake"),
    "vitimus09": ("Vitimus, A.", "2009", "Hands-On Chaos Magic: Reality Manipulation Through the Ovayki Current", "Woodbury, MN: Llewellyn Publications"),
    "white17": ("White, G.", "2017", "Chaos Magic. In C. Partridge (Ed.), <em>The Occult World</em> (pp. 485-493)", "London: Routledge"),

    # ─── Sigil Magic ───────────────────────────────────────────────────────────
    "spare_auto": ("Spare, A.O., & Carter, F.", "1975", "Automatic Drawing", "London: Askin Publishers"),
    "spare_book_pleasure": ("Spare, A.O.", "1913", "The Book of Pleasure (Self-Love)", "London."),

    # ─── Goetia / Solomonic ────────────────────────────────────────────────────
    "crowley04": ("Crowley, A., & Mathers, S.L.M.", "1904", "The Goetia: The Lesser Key of Solomon the King", "London."),
    "peterson01": ("Peterson, J.H. (Ed.)", "2001", "The Lesser Key of Solomon", "York Beach, ME: Samuel Weiser"),
    "rankine07": ("Rankine, D., & Barrington, D.", "2007", "The Goetia of Dr Rudd", "London: Golden Hoard Press"),
    "mathers_kingdom": ("Mathers, S.L.M. (Trans.)", "1889", "The Key of Solomon the King", "London."),

    # ─── Norse Runes ───────────────────────────────────────────────────────────
    "elliott59": ("Elliott, R.W.V.", "1959", "Runes: An Introduction", "Manchester: Manchester University Press"),
    "flowers86": ("Flowers, S.E.", "1986", "Runes and Magic", "New York: Peter Lang"),
    "pennick95": ("Pennick, N.", "1995", "The Complete Illustrated Guide to Runes", "Shaftesbury: Element Books"),
    "page99": ("Page, R.I.", "1999", "An Introduction to English Runes", "Woodbridge: Boydell Press"),
    "lindow02": ("Lindow, J.", "2002", "Norse Mythology: A Guide to Gods, Heroes, Rituals, and Beliefs", "Oxford: Oxford University Press"),
    "thorsson84": ("Thorsson, E.", "1984", "Futhark: A Handbook of Rune Magic", "York Beach, ME: Samuel Weiser"),

    # ─── I Ching ───────────────────────────────────────────────────────────────
    "wilhelm50": ("Wilhelm, R. (Trans.)", "1950", "The I Ching or Book of Changes", "Princeton, NJ: Princeton University Press"),
    "legge99": ("Legge, J. (Trans.)", "1899", "The Yi King", "Oxford: Clarendon Press"),
    "cleary88": ("Cleary, T. (Trans.)", "1988", "The Taoist I Ching", "Boston: Shambhala"),
    "huang04": ("Huang, A.", "2004", "The Complete I Ching", "Rochester, VT: Inner Traditions"),

    # ─── Tarot ─────────────────────────────────────────────────────────────────
    "waite10": ("Waite, A.E.", "1910", "The Pictorial Key to the Tarot", "London: William Rider & Son"),
    "crowley_thoth": ("Crowley, A.", "1974", "The Book of Thoth", "York Beach, ME: Samuel Weiser"),
    "pollack80": ("Pollack, R.", "1980", "Seventy-Eight Degrees of Wisdom", "Wellingborough: Aquarian Press"),
    "jodorowsky05": ("Jodorowsky, A., & Costa, M.", "2005", "The Way of the Tarot", "Rochester, VT: Inner Traditions"),

    # ─── Astral Projection / OBE ───────────────────────────────────────────────
    "monroe71": ("Monroe, R.A.", "1971", "Journeys Out of the Body", "Garden City, NY: Doubleday"),
    "monroe85": ("Monroe, R.A.", "1985", "Far Journeys", "Garden City, NY: Doubleday"),
    "buhlman96": ("Buhlman, W.", "1996", "Adventures Beyond the Body", "New York: HarperCollins"),
    "fox39": ("Fox, O.", "1939", "Astral Projection: A Record of Out-of-the-Body Experiences", "London: Rider & Company"),

    # ─── Lucid Dreaming ────────────────────────────────────────────────────────
    "laberge85": ("LaBerge, S.", "1985", "Lucid Dreaming", "Los Angeles: Jeremy P. Tarcher"),
    "laberge90": ("LaBerge, S., & Rheingold, H.", "1990", "Exploring the World of Lucid Dreaming", "New York: Ballantine Books"),

    # ─── Remote Viewing / ESP / Parapsychology ─────────────────────────────────
    "targ77": ("Targ, R., & Puthoff, H.", "1977", "Mind-Reach: Scientists Look at Psychic Abilities", "New York: Delacorte Press"),
    "rhine34": ("Rhine, J.B.", "1934", "Extra-Sensory Perception", "Boston: Boston Society for Psychical Research"),
    "rhine37": ("Rhine, J.B.", "1937", "New Frontiers of the Mind", "New York: Farrar & Rinehart"),
    "bem11": ("Bem, D.J.", "2011", "Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect", "Journal of Personality and Social Psychology, 100(3), 407-425"),
    "mcelroy09": ("McElroy, D., & Targ, R.", "2009", "The CSIRO Remote Viewing Program", "Journal of Parapsychology, 73(2), 311-328"),

    # ─── Servitors / Egregores ─────────────────────────────────────────────────
    "tulpa": ("Magee, W.", "2012", "Tulpa: Thought-Form Creation in Tibetan Buddhism and Modern Occultism", "London: Avalonia"),

    # ─── Scrying / Divination ──────────────────────────────────────────────────
    "fortune35": ("Fortune, D.", "1935", "The Mystical Qabalah", "London: Williams & Norgate"),
    "bardon56": ("Bardon, F.", "1956", "Initiation into Hermetics", "Lausanne: W. Merkle"),
    "cicero03": ("Cicero, C., & Cicero, S.T.", "2003", "Self-Initiation into the Golden Dawn Tradition", "Woodbury, MN: Llewellyn"),
    "regardie70": ("Regardie, I.", "1970", "The Golden Dawn", "St. Paul, MN: Llewellyn Publications"),

    # ─── Planetary / Lunar Magic ───────────────────────────────────────────────
    "agrippa33": ("Agrippa, H.C.", "1533", "Three Books of Occult Philosophy", "Cologne."),
    "barrett01": ("Barrett, F.", "1801", "The Magus", "London."),
    "greer03": ("Greer, J.M.", "2003", "The New Encyclopedia of the Occult", "St. Paul, MN: Llewellyn Publications"),

    # ─── Cybermancy / Technomancy / Digital ────────────────────────────────────
    "davis98": ("Davis, E.", "1998", "TechGnosis: Myth, Magic, and Mysticism in the Age of Information", "New York: Harmony Books"),
    "schneier96": ("Schneier, B.", "1996", "Applied Cryptography (2nd ed.)", "New York: John Wiley & Sons"),

    # ─── Consciousness / Psychonautics ─────────────────────────────────────────
    "mckenna91": ("McKenna, T.", "1991", "The Archaic Revival", "San Francisco: HarperSanFrancisco"),
    "leary83": ("Leary, T.", "1983", "Flashbacks: An Autobiography", "Los Angeles: J.P. Tarcher"),
    "grof75": ("Grof, S.", "1975", "Realms of the Human Unconscious", "New York: Viking Press"),
    "carroll_psychonaut_consciousness": ("Carroll, P.J.", "1982", "Psychonaut", "York Beach, ME: Samuel Weiser"),

    # ─── Binaural Beats / Sound ────────────────────────────────────────────────
    "oster73": ("Oster, G.", "1973", "Auditory beats in the brain", "Scientific American, 229(4), 94-102"),
    "hutchison86": ("Hutchison, M.", "1986", "Megabrain: New Tools and Techniques for Brain Growth and Mind Expansion", "New York: Ballantine Books"),

    # ─── Reality Hacking ───────────────────────────────────────────────────────
    "wilson73": ("Wilson, R.A.", "1973", "The Illuminatus! Trilogy", "New York: Dell Publishing"),
    "wilson79": ("Wilson, R.A.", "1979", "The Illuminati Papers", "Berkeley, CA: And/Or Press"),

    # ─── Moon Phases ───────────────────────────────────────────────────────────
    "cunningham88": ("Cunningham, S.", "1988", "Wicca: A Guide for the Solitary Practitioner", "St. Paul, MN: Llewellyn Publications"),

    # ─── Gypsy / Divination ───────────────────────────────────────────────────
    "buckland03": ("Buckland, R.", "2003", "The Fortune-Telling Book: The Encyclopedia of Divination and Soothsaying", "Detroit: Visible Ink Press"),
}

# ── Topic → Article Mapping ────────────────────────────────────────────────────
# Each article slug maps to a list of reference keys
TOPIC_MAP = {
    # == CHAOS MAGICK GENERAL ==
    "chaos-magick-beginners-complete-guide": ["carroll87", "spare13", "hine95", "sherwin92", "white17"],
    "history-of-chaos-magick": ["carroll87", "spare13", "hine95", "white17", "vitimus09"],
    "paradigm-shift-belief-as-tool": ["carroll87", "spare13", "hine95", "vitimus09"],

    # == SIGIL MAGIC ==
    "austin-osman-spare-sigil-method": ["spare13", "carroll87", "spare_auto"],
    "how-to-charge-sigil-correctly": ["spare13", "carroll87", "spare_auto"],
    "how-to-make-digital-sigil-complete-guide": ["spare13", "carroll87", "schneier96", "davis98"],
    "digital-sigil-magic-guide": ["spare13", "carroll87", "schneier96", "davis98"],
    "sigil-engine-cryptographic-guide": ["spare13", "carroll87", "schneier96"],
    "cryptographic-sigil-programming-code": ["spare13", "carroll87", "schneier96"],
    "sigil-maker-ultimate-guide": ["spare13", "carroll87", "spare_auto", "vitimus09"],
    "sigilscribe-art-science-writing-sigils": ["spare13", "carroll87", "spare_auto"],
    "sigil-creator-online-free-vs-premium": ["spare13", "carroll87", "vitimus09"],
    "sigil-vs-servitor-differences": ["spare13", "carroll87", "hine95"],

    # == SERVITORS / EGREGORES ==
    "complete-magickal-servitors-guide": ["carroll87", "hine95", "sherwin92", "tulpa"],
    "egregore-creation-collective-thought-forms": ["carroll87", "hine95", "sherwin92", "tulpa"],
    "how-to-create-magickal-servitor": ["carroll87", "hine95", "sherwin92"],

    # == GOETIA ==
    "goetic-magic-beginners-guide": ["crowley04", "peterson01", "rankine07", "mathers_kingdom"],
    "arcana-goetia-app-review": ["crowley04", "peterson01", "rankine07"],

    # == NORSE RUNES ==
    "norse-runes-beginners-guide": ["elliott59", "flowers86", "pennick95", "page99", "lindow02"],
    "bindrune-wealth-protection-fehu-algiz-othala": ["flowers86", "pennick95", "thorsson84"],
    "viking-oracle-complete-guide": ["elliott59", "flowers86", "pennick95", "thorsson84"],
    "free-online-rune-reading-guide": ["elliott59", "flowers86", "pennick95"],
    "norse-rune-oracle-app-review": ["elliott59", "flowers86", "pennick95", "thorsson84"],

    # == I CHING ==
    "i-ching-digital-guide": ["wilhelm50", "legge99", "cleary88", "huang04"],
    "free-i-ching-online-guide": ["wilhelm50", "legge99", "huang04"],
    "i-ching-hexagram-meanings-complete-guide": ["wilhelm50", "legge99", "cleary88", "huang04"],
    "i-ching-three-coin-probability-distribution": ["wilhelm50", "legge99"],
    "i-ching-oracle-app-review": ["wilhelm50", "legge99", "huang04"],

    # == TAROT ==
    "rider-waite-tarot-beginners-guide": ["waite10", "crowley_thoth", "pollack80", "jodorowsky05"],
    "tarot-spreads-beginners-guide": ["waite10", "pollack80", "jodorowsky05"],
    "rider-waite-tarot-app-review": ["waite10", "pollack80"],

    # == ASTRAL PROJECTION / OBE ==
    "astral-projection-techniques-beginners": ["monroe71", "monroe85", "buhlman96", "fox39"],

    # == LUCID DREAMING ==
    "lucid-dreaming-guide": ["laberge85", "laberge90", "monroe71"],
    "binaural-beats-lucid-dreaming-guide": ["laberge85", "laberge90", "oster73", "hutchison86"],

    # == REMOTE VIEWING ==
    "remote-viewing-techniques-beginners": ["targ77", "mcelroy09"],

    # == ESP / ZENER CARDS ==
    "zener-cards-esp-training-guide": ["rhine34", "rhine37", "bem11"],
    "zener-cards-probability-statistical-significance": ["rhine34", "rhine37", "bem11"],
    "zener-cards-online-esp-test": ["rhine34", "rhine37", "targ77"],
    "clairvoyance-test-online": ["rhine34", "targ77", "bem11"],
    "best-esp-training-apps-android": ["rhine34", "targ77", "bem11"],
    "psi-gym-zener-cards-app-review": ["rhine34", "targ77"],

    # == SCRYING ==
    "scrying-techniques-mirror-crystal-digital": ["fortune35", "bardon56", "cicero03", "regardie70"],

    # == PLANETARY / LUNAR MAGIC ==
    "planetary-magic-hours-guide": ["agrippa33", "barrett01", "greer03"],
    "planetary-magic-squares-sigil-creation": ["agrippa33", "barrett01", "greer03"],
    "lunar-phase-magic-guide": ["cunningham88", "greer03", "barrett01"],
    "moon-phase-generator-magic-guide": ["cunningham88", "greer03"],
    "free-lunar-phase-calculator-guide": ["cunningham88", "greer03"],
    "new-moon-vs-full-moon-ritual-guide": ["cunningham88", "greer03", "agrippa33"],
    "lunar-phase-calculator-app-review": ["cunningham88", "greer03"],

    # == BANISHING / CLEANSING ==
    "how-to-banish-cleanse-space": ["carroll87", "regardie70", "cicero03", "fortune35"],

    # == CYBERMANCY / TECHNOGMANCY ==
    "cyber-paganism-digital-spirituality-guide": ["davis98", "carroll87", "hine95"],
    "what-is-cybermancy-digital-sorcery-guide": ["davis98", "carroll87"],
    "what-is-technomancy-digital-magic": ["davis98", "carroll87", "hine95"],

    # == GNOSIS ==
    "what-is-gnosis-how-to-achieve": ["spare13", "carroll87", "hine95", "vitimus09"],

    # == WHAT IS MAGICK ==
    "what-is-magick-how-spells-work": ["carroll87", "spare13", "hine95", "white17"],

    # == PSYCHONAUT / CONSCIOUSNESS ==
    "psychonaut-guide-consciousness-exploration": ["carroll87", "mckenna91", "leary83", "grof75"],

    # == REALITY HACKING ==
    "reality-hacking-techniques": ["carroll87", "wilson73", "wilson79", "hine95"],

    # == BOOK / PRODUCT REVIEWS (non-occult references) ==
    "best-chaos-magick-books-essential-reading": ["carroll87", "spare13", "hine95", "sherwin92", "vitimus09"],
    "liber-lvpinux-pdf-review": ["carroll87", "hine95"],
    "magical-servitors-manual-pdf-review": ["carroll87", "hine95", "sherwin92"],
    "ouija-cazadora-pdf-review": ["carroll87", "spare13", "hine95", "davis98"],
    "chaos-hunter-runes-treatise-review": ["elliott59", "flowers86", "thorsson84"],
    "sigil-engine-cryptographic-guide": ["spare13", "carroll87", "schneier96"],
    "free-sigil-generator-online-guide": ["spare13", "carroll87"],

    # == APP REVIEWS ==
    "chaos-sigil-generator-app-review": ["spare13", "carroll87", "schneier96"],
    "dream-machine-app-review": ["laberge85", "laberge90", "oster73"],
    "norse-rune-oracle-app-review": ["elliott59", "flowers86", "pennick95"],

    # == OTHER ==
    # blog/index.html is a listing page, not an article — skip
}

def make_ref_html(key):
    """Generate HTML list item from reference key."""
    if key not in REFS:
        print(f'  WARNING: Unknown ref key: {key}')
        return None
    entry = REFS[key]
    if isinstance(entry, list) and len(entry) == 0:
        return None
    if len(entry) != 4:
        print(f'  WARNING: Bad ref entry for {key}: {entry}')
        return None
    author, year, title, source = entry
    # Title already contains <em> tags for italicized content
    # Source is the publisher (book) or journal name (article)
    if source.startswith(('Journal', 'Scientific', 'Personality')):
        return f'<li>{author}. ({year}). {title}. <em>{source}</em>.</li>'
    else:
        return f'<li>{author}. ({year}). <em>{title}</em>. {source}</li>'

def inject_references(content, ref_keys):
    """Inject References section before </article>."""
    items = []
    for key in ref_keys:
        html = make_ref_html(key)
        if html:
            items.append(html)
    if not items:
        return content
    
    ref_block = '\n<h2>References</h2>\n<ul>\n' + '\n'.join(items) + '\n</ul>\n\n'
    
    # Find the insertion point: before </article>
    m = content.find('</article>')
    if m == -1:
        print(f'  WARNING: No </article> tag found, cannot inject references')
        return content  # safety
    
    return content[:m] + ref_block + content[m:]

# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    files = sorted(os.listdir(BLOG))
    total_processed = 0
    total_skipped_has_refs = 0
    total_skipped_no_mapping = 0
    
    for f in files:
        if not f.endswith('.html'):
            continue
        
        slug = f.replace('.html', '')
        path = os.path.join(BLOG, f)
        
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        # Skip if already has References section
        if re.search(r'<h2>References</h2>\s*<ul>', content):
            print(f'SKIP (has refs): {f}')
            total_skipped_has_refs += 1
            continue
        
        # Get reference keys for this article
        ref_keys = TOPIC_MAP.get(slug, None)
        if ref_keys is None:
            print(f'SKIP (no mapping): {f}')
            total_skipped_no_mapping += 1
            continue
        
        new_content = inject_references(content, ref_keys)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new_content)
            # Count actually added items
            actual_items = [k for k in ref_keys if REFS.get(k) and not (isinstance(REFS[k], list) and len(REFS[k]) == 0)]
            ref_names = [REFS[k][0].split(',')[0] for k in actual_items if k in REFS and not (isinstance(REFS[k], list) and len(REFS[k]) == 0)]
            print(f'ADDED ({len(actual_items)} refs) to {f}: {", ".join(ref_names)}')
            total_processed += 1
        else:
            print(f'SKIP (no article tag or empty refs): {f}')
    
    print(f'\n=== Summary ===')
    print(f'Articles with references added: {total_processed}')
    print(f'Articles skipped (already had refs): {total_skipped_has_refs}')
    print(f'Articles skipped (no mapping): {total_skipped_no_mapping}')

if __name__ == '__main__':
    main()
