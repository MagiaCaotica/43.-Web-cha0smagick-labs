#!/usr/bin/env python3
"""
Los dos articulos estacionales en ingles, pareja de los dos en espanol:

  blog/black-friday-occult-books-2026.html    (Black Friday: 27 Nov, 36 dias)
  blog/christmas-occult-books-gift-guide-2026.html  (Navidad: 64 dias)

El contenido estacional necesita 4-6 semanas de antelacion para posicionar y
para que Google lo tenga en la cache a tiempo. Black Friday es el mas
urgente: publicar el 22 de octubre da margen de sobra.

El angulo no es "compra ya" sino "decide bien": la SERP de "best occult
books" la ganan las guias que dicen que NO compres algo todavia. Y el bundle
es de nueve libros, asi que la pregunta real del lector es cual de los nueve
le sirve, no si quiere el pack.

  python projects/scripts/articles/en-seasonal.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from article_builder import construir  # noqa: E402

# ======================================================================
# 1. BLACK FRIDAY
# ======================================================================
slug = "black-friday-occult-books-2026"
titulo = "Black Friday 2026: 9 occult books, and which one you should start with"
h1 = "Black Friday 2026: nine occult books, and which one you should actually start with"
desc = ("The nine-book grimoire bundle drops to $24.99 until 27 November, 59% off the $60.91 it would cost separately. "
        "What each book covers, who it is for, and the honest case for buying one instead of nine.")
keywords = ("black friday 2026 occult books, occult book bundle, chaos magick books, grimoirs pdf, "
            "best occult books to start with, tarot chaos, servitors manual, chaos hunter runes, "
            "catoliconomicon, mind the gap, liber lvpinux")
en_href = "https://cha0smagicklabs.com/blog/black-friday-occult-books-2026.html"

toc = [
    ("the-deal", "The deal, with no small print"),
    ("the-nine", "The nine, one by one"),
    ("start-here", "Where to start if you are starting from zero"),
    ("what-you-dont-need", "What you do not need yet"),
    ("try-before-you-buy", "Try before you buy"),
    ("how-you-get-it", "How you get it, and what happens if it is not for you"),
]

cuerpo = """
<p>The biggest discount of the year has a date attached, and dates are the one
thing that does not negotiate. This Black Friday, the nine-book grimoire bundle
drops to <strong>$24.99</strong> until <strong>27 November</strong>, against the
<strong>$60.91</strong> the same nine cost separately. That is a real 59% off
real books, with no invented bundle and no inflated reference price.</p>
<p>But nobody needs nine grimoires. The useful question is not whether you want
the pack, it is which of the nine is the one you will actually finish. This is
that guide, and it includes the case for buying a single book instead.</p>

<h2 id="the-deal">The deal, with no small print</h2>
<p><strong>Nine PDF books</strong>, delivered immediately after checkout, no
subscription, no account with a publisher you have to remember to cancel
later. You pay once, you download them, they work offline on any device.</p>
<p>What the bundle does <strong>not</strong> include: anything else. There is
no course attached, no coaching, no membership that renews quietly in the
background. It is nine PDFs you read. If someone is selling you that this comes
with more, they are selling you something else.</p>
<p>The discount is time-boxed because the bundle has a purchase window, not
because the price is going up. When the window closes the bundle goes back to
its normal price, and the individual books stay where they are.</p>

<h2 id="the-nine">The nine, one by one</h2>
<p>This is the honest breakdown: what each one covers and who it is for. Not
every book suits every practitioner, and a book that is wrong for you does not
get smarter because it is on sale.</p>
<h3>Codex Chaoticus ($4.99)</h3>
<p>The complete chaos magick grimoire: sigils, gnosis, servitors, paradigms and
the exercises for each. If you are buying one book, this is the one, because
everything else in the bundle assumes you have read it. It is also the right
starting point for someone who has never done this before, and the reference
the practicing reader keeps coming back to.</p>
<h3>Magical Servitors Manual ($3.99)</h3>
<p>Creating and working with servitors: design, activation phrase,
feeding, maintenance. The shortest of the nine and the one that produces a
visible result fastest, because a well-designed servitor shows up inside a
single session. For anyone who has done sigils and wants something that keeps
working between sessions.</p>
<h3>Treatise of Chaos Hunter Runes ($3.99)</h3>
<p>The chaos rune system in full: the reduced alphabet, the planetary and
day attributions, and how to cast deliberately. It is the natural companion to
Tarot Chaos rather than a substitute for it. One works with character, the
other with timing and situation.</p>
<h3>Tarot Chaos ($9.99)</h3>
<p>The Rider-Waite deck read from a chaos magick position: the symbols as a map
of the person rather than as prediction. For readers who already use tarot and
want the chaos reading of the same cards, or who want tarot without the
fortune-telling framing.</p>
<h3>Mind The Gap ($9.99)</h3>
<p>Altered states, practically: how to prepare, what to do at each level, and
how to avoid turning the experience into a ladder of Huxley and friends. No
dogma, just protocol. For the practitioner who no longer needs the concept
explained to them.</p>
<h3>CATHOLICONOMICON ($9.99)</h3>
<p>Chaos magick for Catholic practitioners: how symbolic work sits inside a
faith, what can and cannot be done, and where the line is. It is the book
that prevents the most questions. For the Catholic who takes their faith
seriously and wants to practise without breaking it.</p>
<h3>Liber Lvpinux ($3.99)</h3>
<p>The book of the wolf: lycanthropy as philosophy and practice, in a chaos
magick key. Not a novel. A piece of work on shadow, hunger and identity, for
readers drawn to the mythology of the wolf and the psychology of the limit.</p>
<h3>Ouija Cazadora ($3.99)</h3>
<p>Spirit communication through the ouija board, in Spanish, with the full
protocol. It is the only one of the nine originally written in Spanish and the
most argued-over in the collection. If the ouija is your thing, this is the
one. If it is not, it is not worth buying because it sounds interesting.</p>
<h3>The Complete Practical Treatise on Magical Servitors ($9.99)</h3>
<p>The long servitor grimoire, with everything the short manual leaves out:
variations, transference, long-term maintenance, and the problems that show up
once a servitor has been running for months. It completes the $3.99 manual
rather than duplicating it.</p>

<h2 id="start-here">Where to start if you are starting from zero</h2>
<p>Order matters more than quantity. If you have never practised, this is the
route that works:</p>
<ol>
<li><strong>Codex Chaoticus</strong> for the framework and your first sigils.
It is the book the other eight lean on.</li>
<li><strong>Magical Servitors Manual</strong> once sigils are familiar: it is
the first step from a one-off working to something with continuity.</li>
<li><strong>Treatise of Chaos Hunter Runes</strong> or <strong>Tarot Chaos</strong>,
whichever calls you. They are the same level and you do not need both at once.</li>
<li>The rest when you actually need them.</li>
</ol>
<p>If you already have a practice and want the whole shelf, the bundle makes
sense on price. It does not make sense because you need nine books.</p>

<h2 id="what-you-dont-need">What you do not need yet</h2>
<p>One thing the discount hides: buying a single book is more expensive per
book. The bundle is better value per unit, but only if you are going to read
them. If you are torn between two, buying those two on their own leaves enough
budget for the third in two months, when you know whether you want it.</p>
<p>And the useful warning: <strong>none of this starts with reading</strong>.
It starts with doing. One chapter, one practice, one written record. Reading
nine books without practising is collecting opinions, and no discount fixes
that.</p>

<h2 id="try-before-you-buy">Try before you buy</h2>
<p>Before you pay, check that this is the tradition for you. There are
<strong>61 free tools</strong> on this site, and several of them hand you the
thing you were looking for:</p>
<ul>
<li><a href="../tools/sigil-generator.html">The sigil generator</a>: your first
sigil, in the browser, no account, no payment.</li>
<li><a href="../tools/iching.html">The I Ching oracle</a>: a full three-coin
cast, to see whether the system suits you.</li>
<li><a href="../tools/rune-drawer.html">The rune drawer</a> and
<a href="../tools/lunar-phase.html">the lunar phase calculator</a>.</li>
</ul>
<p>If you want the whole method in writing after using those, the bundle is
for you. If you already know it is, buy it now. Both are fine answers.</p>

<h2 id="how-you-get-it">How you get it, and what happens if it is not for you</h2>
<p>Checkout is on Hotmart, the same platform you would use for the individual
books. All nine PDFs arrive immediately and access does not expire. If after
reading the first one you decide it is not what you were after, the publisher's
satisfaction guarantee applies exactly as it does for a single book: email
<a href="mailto:magiacaoticapractica@gmail.com">magiacaoticapractica@gmail.com</a>
and the refund is processed. English or Spanish, either way.</p>
<p>One detail: the bundle is the Spanish edition, which is the one sold in the
Spanish store. The English editions are available individually, with the same
seasonal discount while it runs.</p>
"""

faq = [
    ("How long does the $24.99 price last?",
     "Until 27 November 2026, which is Black Friday. After that the bundle returns to its normal price and the "
     "nine books stay available individually at their regular prices."),
    ("Are these the same books sold individually?",
     "Yes, the same nine, in the Spanish edition. What the offer changes is the price of the set, not the content."),
    ("Is there a subscription or a renewal?",
     "No. You pay once, download the nine PDFs, and access does not expire. There is no membership to forget about "
     "and nothing to cancel."),
    ("What if I only want one book?",
     "Then buy that one. The bundle is better value per unit, but only if you are genuinely going to read nine. "
     "Codex Chaoticus alone covers the most, and the Magical Servitors Manual is the shortest."),
    ("Does it come in English?",
     "The bundle is the Spanish edition, sold in the Spanish store. The English editions are sold individually, "
     "with the same seasonal discount while it runs."),
    ("What if I do not like it?",
     "The publisher's satisfaction guarantee applies to the bundle exactly as it does to a single book: write, ask for "
     "the refund, and it is refunded."),
]

rel = [
    ("chaos-magick-beginners-complete-guide.html", "Chaos Magic for Beginners: the complete guide"),
    ("how-to-create-magickal-servitor.html", "How to create a magical servitor"),
    ("../tools/sigil-generator.html", "Free sigil generator"),
    ("best-chaos-magick-books-essential-reading.html", "The essential chaos magick reading list"),
]

FECHA = "2026-10-22"

referencias = """
<section id="references">
<h2>References</h2>
<ul>
<li><a href="best-chaos-magick-books-essential-reading.html">The essential chaos magick reading list</a>: the same nine books, read as a syllabus rather than a bundle.</li>
<li><a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners</a>: the framework the Codex introduces, in one guide.</li>
<li><a href="how-to-create-magickal-servitor.html">How to create a magical servitor</a>: the method the two servitor books expand.</li>
</ul>
</section>
"""

enlaces_internos = """
<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Apps:</strong> <a href="../apps/chaos-sigil-generator.html">Chaos Sigil Generator</a> | <a href="../apps/psi-gym.html">PSI GYM</a> | <a href="../apps/unofficial-rider-waite-tarot.html">Tarot Rider Waite</a>
</div>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Books:</strong> <a href="../landing-pages/books-bundle.html">The 9-book bundle ($24.99, 59% off)</a>
</div>
<div>
<strong style="color: var(--text-primary);">Free tools:</strong> <a href="../tools/sigil-generator.html">Sigil generator</a> | <a href="../tools/iching.html">I Ching oracle</a> | <a href="../tools/rune-drawer.html">Rune drawer</a>
</div>
</section>
"""

cta = """
<section class="cta-contextual" id="try-it" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-top: 0;">The bundle, until 27 November</h3>
<p style="margin-bottom: 1rem;">Nine grimoires, <strong>$24.99</strong> instead of $60.91. One payment,
permanent access, and the same satisfaction guarantee as a single book.</p>
<p style="margin-bottom: 0;">
<a class="cta-button primary" href="https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W" rel="noopener">Get the bundle →</a>
</p>
</section>
"""

rel = [
    ("chaos-magick-beginners-complete-guide.html", "Chaos Magic for Beginners: the complete guide"),
    ("how-to-create-magickal-servitor.html", "How to create a magical servitor"),
    ("best-chaos-magick-books-essential-reading.html", "The essential chaos magick reading list"),
    ("../tools/sigil-generator.html", "Free sigil generator"),
]

rel_html = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in rel)
out = construir(slug, titulo, h1, desc, keywords, FECHA, 11, slug, toc, cuerpo, faq,
                referencias, enlaces_internos, cta, rel_html)
(ROOT / "blog" / f"{slug}.html").write_text(out, encoding="utf-8")
print("escrito: blog/" + slug + ".html")

# ======================================================================
# 2. NAVIDAD
# ======================================================================
slug2 = "christmas-occult-books-gift-guide-2026"
titulo2 = "Christmas 2026: which occult book to gift (and when not to gift one)"
h1_2 = "Christmas 2026 occult gift guide: which of the nine books to give, and when not to"
desc2 = ("A gift guide for occult books that starts with the awkward part: when an occult book is the wrong gift. "
         "Then which of the nine grimoires fits which person, and how to give a PDF without it going to waste.")
keywords2 = ("occult gift guide, christmas occult books, occult book gifts, chaos magick gift, "
             "gift ideas occult, esoteric gifts christmas, tarot gift, rune gift, servitor gift")
en_href2 = "https://cha0smagicklabs.com/blog/christmas-occult-books-gift-guide-2026.html"

toc2 = [
    ("the-hard-part", "The hard part: when an occult book is the wrong gift"),
    ("which-book", "Which book, for which person"),
    ("giving-a-pdf", "Giving a PDF without it going to waste"),
    ("when-to-buy", "When to buy it"),
]

cuerpo2 = """
<p>Giving an occult book has a difficulty no other gift has: it depends
entirely on who is receiving it. The same grimoire can be the perfect gift or
an intrusion, and the difference is not the book. It is whether the person has
ever said anything about this.</p>
<p>The nine-book bundle is at <strong>$24.99 until 27 November</strong> (59% off
the $60.91 the set costs separately), so there is time to decide and to order
before the window closes.</p>

<h2 id="the-hard-part">The hard part: when an occult book is the wrong gift</h2>
<p>Three cases where buying the bundle is precisely the wrong decision, said
plainly:</p>
<ul>
<li><strong>Someone who has not mentioned it.</strong> A grimoire given to a
skeptic is not a thoughtful gift, it is a statement about them. If they have
not asked, give them something they can open without committing to
anything.</li>
<li><strong>Someone in a vulnerable period.</strong> Not censorship, care:
nothing here helps in that moment, and a letter about sigils can land worse
than intended.</li>
<li><strong>A partner who does not share this.</strong> A love ritual given with
that intention, to a person who does not believe in it, is pressure shaped
like a gift.</li>
</ul>
<p>In all three cases, the same money in a book that is read for pleasure works
better. The bundle only makes sense if the person is already inside it.</p>

<h2 id="which-book">Which book, for which person</h2>
<table>
<thead><tr><th>Who you are giving to</th><th>Book</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Someone already deep in chaos magick</td><td>CATHOLICONOMICON</td><td>The one that answers the questions nobody else in the set answers, and it looks nothing like what they already own</td></tr>
<tr><td>Someone starting from zero</td><td>Codex Chaoticus</td><td>The only one that stands alone: sigils, gnosis, servitors, paradigms</td></tr>
<tr><td>A tarot reader</td><td>Tarot Chaos</td><td>The same deck they already use, read from a different position</td></tr>
<tr><td>Someone into runes</td><td>Treatise of Chaos Hunter Runes</td><td>The full system, not just the alphabet</td></tr>
<tr><td>Someone who already does sigils and wants something that lasts</td><td>The Complete Practical Treatise on Magical Servitors</td><td>The long grimoire, with the maintenance the short one leaves out</td></tr>
<tr><td>Someone working with altered states</td><td>Mind The Gap</td><td>Protocol, not theory</td></tr>
<tr><td>Someone drawn to shadow and wolf imagery</td><td>Liber Lvpinux</td><td>Philosophy and practice, not a novel</td></tr>
<tr><td>Someone who is into the ouija</td><td>Ouija Cazadora</td><td>The only one originally written in Spanish, with the full protocol</td></tr>
</tbody>
</table>

<h2 id="giving-a-pdf">Giving a PDF without it going to waste</h2>
<p>The files are downloaded and read on any device, so there are two ways to
give one:</p>
<ul>
<li><strong>The download link with a note.</strong> The usual route, and it
works: the PDF arrives and the person opens it when they want to. The gift does
not get lost in a mailbox.</li>
<li><strong>Reading part of it aloud.</strong> If the book is for someone you
already share this with, twenty minutes of your favourite chapter before they
open it is what turns a PDF into a gift.</li>
</ul>
<p>On timing: the bundle price holds until 27 November, but the Christmas
buying peak is the second week of December. If the gift is for Christmas, buy
it before the 27th so it arrives with margin and can still be reprinted if
the wrong one turns up.</p>

<h2 id="when-to-buy">When to buy it</h2>
<p>If you genuinely do not know which book fits, there is a way to find out
without spending anything. The free tools run on the same logic as the books:
<a href="../tools/sigil-generator.html">make a sigil</a>,
<a href="../tools/iching.html">cast some coins</a> or
<a href="../tools/rune-drawer.html">draw some runes</a> and watch whether the
idea of it holds their attention. If it does, the bundle is for them. If it
does not, a book on witchcraft is the better present.</p>
"""

faq2 = [
    ("Is a nine-book bundle a good gift?",
     "It is a good gift for someone already inside chaos magick who wants the whole method. For someone who has "
     "never mentioned it, a single book they can open without commitment works better."),
    ("How long does the $24.99 price last?",
     "Until 27 November 2026. After that the bundle returns to its normal price and the individual books are "
     "unchanged."),
    ("What if they do not like it?",
     "The publisher's satisfaction guarantee applies to the bundle exactly as it does to one book: write to "
     "magiacaoticapractica@gmail.com, ask for the refund, and it is refunded."),
    ("Is there a subscription?",
     "No. One payment, immediate download, permanent access."),
    ("Are the English and Spanish books the same?",
     "The bundle is the Spanish edition. The English editions are sold individually, with the same seasonal "
     "discount while it runs."),
]

rel2 = [
    ("black-friday-occult-books-2026.html", "Black Friday: the nine books and which one to start with"),
    ("chaos-magick-beginners-complete-guide.html", "Chaos Magic for Beginners: the complete guide"),
    ("best-chaos-magick-books-essential-reading.html", "The essential chaos magick reading list"),
    ("../tools/sigil-generator.html", "Free sigil generator"),
]

rel2_html = "".join(f'<li><a href="{h}">{t}</a></li>' for h, t in rel2)
out2 = construir(slug2, titulo2, h1_2, desc2, keywords2, FECHA, 9, slug2, toc2, cuerpo2, faq2,
                 referencias, enlaces_internos, cta, rel2_html)
(ROOT / "blog" / f"{slug2}.html").write_text(out2, encoding="utf-8")
print("escrito: blog/" + slug2 + ".html")
