#!/usr/bin/env python3
"""Cierra la distribucion del bundle: lo que quedaba apuntando a la landing espanola.

Tres cosas, solo en paginas inglesas:
  1. los enlaces a landing-pages/books-bundle.html pasan al checkout ingles;
  2. el pie de pagina repetido (152 paginas) anuncia el precio del bundle ingles;
  3. las frases sueltas de books/ y books/index.html.

Precio verificado en el checkout el 2026-10-22: EN US$29.99, ES US$24.99
(los nueve sueltos suman US$60.91, o sea 59% menos).
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EN_CHECKOUT = "https://pay.hotmart.com/N108147778I"

# articulos donde la comparacion ES/EN es deliberada
WHITELIST = {
    "blog/black-friday-occult-books-2026.html",
    "blog/christmas-occult-books-gift-guide-2026.html",
}
# books/ compara a proposito el precio del set espanol con el del bundle ingles
WHITELIST_PREFIX = ("books/",)

HREF_PATTERNS = [
    r'href="(?:\.\./|https://cha0smagicklabs\.com/|/)landing-pages/books-bundle\.html"',
    r'href="landing-pages/books-bundle\.html"',
]

TEXT_MAP = [
    ("$24.99 USD — 9 books at 59% off.", "$29.99 USD — the full English bundle."),
    ("complete books bundle</a> is US$24.99 instead of US$60.91 separately.",
     "complete books bundle</a> is US$29.99 in English (US$24.99 for the Spanish set; US$60.91 if bought individually)."),
    ("plus the full bundle for $24.99 USD (59% off)", "plus the English bundle for $29.99 USD"),
    ("Yes. The 9-book bundle costs $24.99 USD instead of $60.91 USD (59% off).",
     "Yes. The English bundle costs $29.99 USD; the Spanish set is $24.99 against $60.91 for the nine individually."),
    ("plus a bundle of all 9 for $24.99 USD (59% off the $60.91 USD total)",
     "plus the English bundle for $29.99 USD"),
    ("Sum of individual prices: $60.91 USD. Bundle price: $24.99 USD (59% off).",
     "Sum of the individual prices: $60.91 USD. English bundle: $29.99 USD. Spanish set: $24.99 USD (59% off)."),
    ("Or get the 9-book bundle for $24.99", "Or get the English bundle for $29.99"),
    ("Books Bundle $24.99", "Bundle $29.99"),
]


def files_with(pattern):
    out = subprocess.run(["git", "grep", "-l", pattern, "--", "*.html"],
                         capture_output=True, text=True, encoding="utf-8").stdout
    return [Path(ROOT / l.strip()) for l in out.splitlines() if l.strip()]


def is_spanish(path):
    text = path.read_text(encoding="utf-8", errors="ignore")[:3000]
    return bool(re.search(r'<html[^>]*lang="es"', text))


def main() -> int:
    check = "--check" in sys.argv
    targets = set(files_with("books-bundle.html")) | set(files_with("24\\.99")) | set(files_with("60\\.91"))
    stats = {"files": 0, "href": 0, "text": 0}
    for path in sorted(targets):
        if is_spanish(path):
            continue
        rel = path.relative_to(ROOT).as_posix()
        text = path.read_text(encoding="utf-8")
        original = text
        for pat in HREF_PATTERNS:
            text, n = re.subn(pat, f'href="{EN_CHECKOUT}"', text)
            stats["href"] += n
        for old, new in TEXT_MAP:
            pat = re.compile(r"\s+".join(re.escape(w) for w in old.split()))
            text, n = pat.subn(lambda m: new, text)
            stats["text"] += n
        if text != original:
            stats["files"] += 1
            if not check:
                path.write_text(text, encoding="utf-8")

    for k, v in stats.items():
        print(f"{k:8s} {v}")

    leftover = []
    for path in sorted(targets):
        if is_spanish(path):
            continue
        rel = path.relative_to(ROOT).as_posix()
        if rel in WHITELIST or rel.startswith(WHITELIST_PREFIX):
            continue
        text = path.read_text(encoding="utf-8")
        for m in re.finditer(r".{0,45}(?:US\$|\$)24\.99.{0,40}", text):
            leftover.append(f"{rel}: {m.group(0)!r}")
    print(f"quedan precios del bundle espanol en paginas EN: {len(leftover)}")
    for l in leftover[:10]:
        print("   ", l)
    return 1 if leftover else 0


if __name__ == "__main__":
    sys.exit(main())
