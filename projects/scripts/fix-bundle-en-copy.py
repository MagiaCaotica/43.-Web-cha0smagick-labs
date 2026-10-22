#!/usr/bin/env python3
"""Los 16 articulos EN con precio escrito a mano pasan al bundle ingles.

El resto de la web ya se movio con fix-bundle-lang.py (URL + textos de plantilla).
Aqui quedan las frases sueltas, que hay que reescribir una a una: decian
"9 libros / $24.99 / 59% / $60.91", todo del producto espanol.

Precio verificado en el checkout el 2026-10-22: EN $29.99. El bundle ingles no
publica cuantos PDFs incluye, asi que su copy no afirma cantidad.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

BUNDLE_CTA = '<a href="https://pay.hotmart.com/N108147778I">Complete books bundle in English: $29.99</a>'
OLD_CTA = '<a href="../landing-pages/books-bundle.html">Complete books bundle: 9 books, $24.99</a>'

SUBS = {
    "blog/catholic-chaos-magick-beginners-guide.html": [(OLD_CTA, BUNDLE_CTA)],
    "blog/catholic-pentacle-ritual-chaos-magick.html": [(OLD_CTA, BUNDLE_CTA)],
    "blog/catholic-sigil-magick-sacramental-symbols.html": [(OLD_CTA, BUNDLE_CTA)],
    "blog/chaos-magick-and-the-roman-rites.html": [(OLD_CTA, BUNDLE_CTA)],
    "blog/saint-correspondences-chaos-magick-working.html": [(OLD_CTA, BUNDLE_CTA)],
    "blog/best-occult-books-beginners-2026.html": [
        ("The Cha0smagick Labs 9-book bundle at $24.99 offers exceptional value.",
         "The Cha0smagick Labs English bundle at $29.99 offers exceptional value."),
        ("If you commit to the path, the 9-book bundle at $24.99 is the most economical expansion.",
         "If you commit to the path, the English bundle at $29.99 is the most economical expansion."),
        ("The <strong>Complete 9-Book Bundle</strong> at $24.99 offers a 59% discount over buying each book individually",
         "The <strong>English book bundle</strong> at $29.99 costs less than buying each book individually"),
        ("the Complete 9-Book Bundle at $24.99 is the most economical way to expand your library. At 59% off the individual prices, you",
         "the English book bundle at $29.99 is the most economical way to expand your library. At a lower price than the individual books, you"),
        ("<strong>Normally $60.91 individually — yours for $24.99.</strong> That is less than $3 per book.",
         "<strong>The whole English library is $29.99.</strong>"),
    ],
    "blog/best-witchcraft-books-beginners-2026.html": [
        ("The Complete 9-Book Bundle from Cha0smagick Labs costs $24.99 for all nine books — less than $3 per book.",
         "The complete English bundle from Cha0smagick Labs costs $29.99."),
        ("offers a more economical path: all nine esoteric PDF books for $24.99, a 59% discount over buying each book individually.",
         "offers a more economical path: the English PDF library for $29.99, cheaper than buying each book individually."),
        ("At $24.99 for all nine books, you pay less than $3 per book.",
         "At $29.99 for the English library, you pay less per book."),
        ("⚡ Get All 9 Books for $24.99 — 59% Off", "⚡ Get the English book bundle — $29.99"),
        ("<strong>Normally $60.91 — yours for $24.99.</strong> Instant PDF download via Hotmart. Less than $3 per book.",
         "<strong>$29.99 once.</strong> Instant PDF download via Hotmart."),
        ("costs $24.99 for all nine books, less than $3 per book.",
         "costs $29.99."),
    ],
    "blog/big-three-explained.html": [
        ('bundle with 9 books for $24.99.', 'series; the English bundle is $29.99.'),
    ],
    "blog/goetic-magic-beginners-guide.html": [
        ('>book bundle</a> is $24.99.', '>English book bundle</a> is $29.99.'),
    ],
    "blog/haunted-roads-guide.html": [
        ("complete Chaos Magick bundle with 9 books on Hotmart &mdash; $24.99 for everything.",
         "complete Chaos Magick bundle in English on Hotmart &mdash; $29.99 for everything."),
    ],
    "celtic-cross.html": [
        ("Books bundle (9 grimoires)</td><td>$24.99", "English book bundle</td><td>$29.99"),
        ("The 9-book bundle is $24.99 once:", "The English book bundle is $29.99 once:"),
    ],
    "ephemeris-accuracy.html": [
        ("The 9-book bundle covers sigil magick, the occult tradition and the astronomy behind the symbols for one $24.99 payment:",
         "The English book bundle covers sigil magick, the occult tradition and the astronomy behind the symbols for one $29.99 payment:"),
    ],
    "goetic-sigil.html": [
        ("The 9-book grimoire bundle covers the theory for $24.99 if you want the full method.",
         "The English book bundle covers the theory for $29.99 if you want the full method."),
        ("The 9-book bundle covers the Goetia, the 72 spirits ranked and the method behind them for a single $24.99:",
         "The English book bundle covers the Goetia, the 72 spirits ranked and the method behind them for a single $29.99:"),
        ("Books bundle (9 grimoires)</td><td>$24.99", "English book bundle</td><td>$29.99"),
    ],
    "i-ching-app.html": [
        ("The 9-book bundle covers the tradition for $24.99 if you want the theory behind the hexagrams.",
         "The English book bundle covers the tradition for $29.99 if you want the theory behind the hexagrams."),
        ("The 9-book bundle is a single $24.99 payment:", "The English book bundle is a single $29.99 payment:"),
    ],
}


def flexible(old):
    return re.compile(r"\s+".join(re.escape(w) for w in old.split()))


def main() -> int:
    missing = 0
    for rel, pairs in SUBS.items():
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        for old, new in pairs:
            pat = flexible(old)
            n = len(pat.findall(text))
            if n == 0:
                print(f"  YA APLICADO      {rel}: {old[:60]}")
                continue
            text = pat.sub(lambda m: new, text)
            print(f"  {n}x  {rel}: {new[:55]}")
        path.write_text(text, encoding="utf-8")

    # comprobacion: ninguna pagina EN debe seguir vendiendo el bundle espanol
    for rel in SUBS:
        text = (ROOT / rel).read_text(encoding="utf-8")
        for m in re.finditer(r".{0,40}(?:US\$|\$)24\.99.{0,30}", text):
            print(f"  QUEDA $24.99 en {rel}: {m.group(0)!r}")
            missing += 1
    print(f"pendientes: {missing}")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
