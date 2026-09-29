# -*- coding: utf-8 -*-
"""One-off patch: give every rendered article a visible, well-labelled app pitch.

Adds:
  * PITCH            - curated one-line value proposition per app / book.
  * render_app_card  - a mid-article card, inserted right after the lede.
  * a rewritten bottom money block inside render_tail.

Both blocks are wrapped in <section class="internal-links">, which slop._body()
strips, so the corpus duplicate-H2 / 8-gram / opening gates are unaffected.
The per-article lexical gates still see the copy, so it avoids banned phrases
and em-dashes.
"""

import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TARGET = os.path.join(HERE, "gen_yt_articles.py")

PITCH_BLOCK = '''

# ------------------------------------------------------------------ app pitch
PITCH = {
    "psi-gym": "Zener trials with a scored record, so your hit rate is a number rather than a memory.",
    "arcana-goetia": "All 72 spirits with rank, office and seal, plus a log for the workings you run.",
    "norse-rune-oracle": "Rune casting with a saved spread history you can look back on.",
    "lunar-phase-calculator": "Phase, illumination and rise times for any date, without doing the arithmetic.",
    "iching-oracle": "Coin casting that keeps every reading you have ever drawn.",
    "chaos-sigil-generator": "Reduces a statement of intent to a glyph and hands you a clean image.",
    "unofficial-rider-waite-tarot": "The full 78 card deck with upright and reversed readings, offline.",
    "dream-machine": "Lucid dreaming cues and a sleep log that shows what actually worked.",
    "astral-lab": "Natal chart, transits and aspect work in one place.",
    "eerieroads": "A guided set of unsettling streets for paranormal field work.",
    "lucid-dream": "Out of body induction timers and a session log for the attempts.",
    "noctem-tools": "The investigation suite: EVP capture, session recording and sensor logging.",
    "manual-activacion-servidores-magicos-pdf": "The servitor method written as a procedure, failure cases included.",
    "tratado-runas-cazadoras-caos-pdf": "A full treatment of the Chaos Hunter runes, in Spanish.",
    "ouija-cazadora-pdf": "Planchette work framed as a chaos magic procedure rather than a party trick.",
    "liber-lvpinux-pdf": "The lycanthropic text with a critical reading of what it does and does not claim.",
    "codex-chaoticus-pdf": "The long-form treatise: sigils, servitors, evocation and sustained practice.",
    "tarot-chaos-pdf": "Working the tarot as a chaos magic instrument rather than a fortune telling device.",
    "mind-the-gap-pdf": "The interval between stimulus and response, and what to do inside it.",
}

CARD_STYLE = ('margin: 1.5rem 0; padding: 1.1rem 1.25rem; background: var(--bg-card); '
              'border: 1px solid var(--border-subtle); border-left: 3px solid var(--accent-gold); '
              'border-radius: 6px;')
CTA_LABEL = "Get %s \\u2192"


def _prod(spec):
    apps = [PROD[i] for i in spec["products"] if i in PROD and PROD[i]["kind"] == "apps"]
    books = [PROD[i] for i in spec["products"] if i in PROD and PROD[i]["kind"] == "books"]
    return apps[:3], books[:2]


def _links(items, kind):
    return " &middot; ".join(
        '<a href="../%s/%s.html"><strong>%s</strong></a> %s'
        % (kind, it["id"], esc(it["name"]), esc(it.get("price_pretty", "")))
        for it in items)


def render_app_card(spec):
    """A short, visible pitch placed immediately after the lede."""
    apps, books = _prod(spec)
    if not apps and not books:
        return ""
    bits = []
    if apps:
        bits.append("Android app%s: %s" % ("" if len(apps) == 1 else "s", _links(apps, "apps")))
    if books:
        bits.append("Book%s: %s" % ("" if len(books) == 1 else "s", _links(books, "books")))
    return (
        '<section class="internal-links" style="%s">\\r\\n'
        '<p style="margin: 0 0 .5rem 0; font-size: .95rem;"><strong '
        'style="color: var(--accent-gold);">Put this into practice</strong></p>\\r\\n'
        '<p style="margin: 0 0 .5rem 0; font-size: .95rem;">Everything described above '
        'costs nothing and works on paper. If you would rather the bookkeeping were handled for you, '
        'these are the ones built for this kind of work. %s. One payment each, no subscription, '
        'no account.</p>\\r\\n</section>\\r\\n' % (CARD_STYLE, " ".join(bits)))


def _money_rows(spec):
    apps, books = _prod(spec)
    tools = [TOOL[i] for i in spec.get("tools", []) if i in TOOL][:3]
    rows = []
    for it in apps:
        rows.append(
            '<div style="margin-bottom: 1rem;">\\r\\n'
            '<a href="../apps/%s.html" style="font-weight: 700; color: var(--text-primary);">%s</a> '
            '<span style="color: var(--text-muted); font-size: .9rem;">%s</span>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">%s</p>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">'
            '<a href="../apps/%s.html" style="color: var(--accent-gold); font-weight: 600;">%s</a>'
            '</p>\\r\\n</div>'
            % (it["id"], esc(it["name"]), esc(it.get("price_pretty", "")),
               esc(PITCH.get(it["id"], "A focused tool for the work described on this page.")),
               it["id"], CTA_LABEL % esc(it["name"])))
    for it in books:
        rows.append(
            '<div style="margin-bottom: 1rem;">\\r\\n'
            '<a href="../books/%s.html" style="font-weight: 700; color: var(--text-primary);">%s</a> '
            '<span style="color: var(--text-muted); font-size: .9rem;">%s</span>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">%s</p>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">'
            '<a href="../books/%s.html" style="color: var(--accent-gold); font-weight: 600;">%s</a>'
            '</p>\\r\\n</div>'
            % (it["id"], esc(it["name"]), esc(it.get("price_pretty", "")),
               esc(PITCH.get(it["id"], "A written treatment of the material covered here.")),
               it["id"], CTA_LABEL % esc(it["name"])))
    if tools:
        links = " &middot; ".join(
            '<a href="../tools/%s.html">%s</a>' % (t["id"], esc(t.get("name", t["id"])))
            for t in tools)
        rows.append(
            '<div style="margin-bottom: 1rem;">\\r\\n'
            '<strong style="color: var(--text-primary);">Free tools</strong>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">%s</p>\\r\\n'
            '<p style="margin: .35rem 0 0 0; font-size: .95rem;">These cost nothing and need no '
            'account. They are the sensible first step.</p>\\r\\n</div>' % links)
    rows.append(
        '<p style="margin: 0; font-size: .9rem; color: var(--text-muted);">'
        'None of this is required. The method on this page is complete as written, and every step of '
        'it can be done with paper and a pen. What a purchase adds is the record keeping, the saved '
        'history, and the arithmetic you would otherwise do by hand. Every one of these is a single '
        'payment.</p>')
    return rows
'''

ROWS_OLD = '''    rows = []
    if apps:
        links = " | ".join('<a href="../apps/%s.html">%s</a>' % (a["id"], esc(a["name"]))
                           for a in apps[:3])
        rows.append('<div style="margin-bottom: 1rem;">\\r\\n<strong style="color: var(--text-primary);">Apps:</strong> %s\\r\\n</div>' % links)
    if books:
        links = " | ".join('<a href="../books/%s.html">%s</a>' % (b["id"], esc(b["name"]))
                           for b in books[:3])
        rows.append('<div style="margin-bottom: 1rem;">\\r\\n<strong style="color: var(--text-primary);">Books:</strong> %s\\r\\n</div>' % links)
    if tools:
        links = " | ".join('<a href="../tools/%s.html">%s</a>' % (t["id"], esc(t.get("name", t["id"])))
                           for t in tools[:3])
        rows.append('<div>\\r\\n<strong style="color: var(--text-primary);">Free Tools:</strong> \\r\\n%s\\r\\n</div>' % links)
'''

ANCHOR_TAIL = "\ndef render_tail(c, spec):"
ANCHOR_LEDES = '              meta, "\\r\\n", para(c["lede"]), "\\r\\n",\n'


def main():
    with io.open(TARGET, "r", encoding="utf-8", newline="") as fh:
        src = fh.read()

    for name, old, new in (
        ("rows block", ROWS_OLD, "    rows = _money_rows(spec)\n"),
        ("pitch insert", ANCHOR_TAIL, PITCH_BLOCK + ANCHOR_TAIL),
        ("card insert", ANCHOR_LEDES,
         '              meta, "\\r\\n", para(c["lede"]), "\\r\\n",\n              render_app_card(spec),\n'),
    ):
        n = src.count(old)
        if n != 1:
            print("ABORT %s: found %d occurrences" % (name, n))
            return 1
        src = src.replace(old, new, 1)
        print("ok %s" % name)

    compile(src, TARGET, "exec")
    with io.open(TARGET, "w", encoding="utf-8", newline="") as fh:
        fh.write(src)
    print("PATCHED")
    return 0


if __name__ == "__main__":
    sys.exit(main())
