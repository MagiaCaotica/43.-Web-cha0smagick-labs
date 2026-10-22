#!/usr/bin/env python3
"""El bundle espanol pasa de $24.99 a $29.99: un solo precio para los dos idiomas.

Verificado en el checkout de Hotmart el 2026-10-22 (pais Estados Unidos):
  BUNDLE: All PDFs in ENGLISH   N108147778I   US$29.99
  BUNDLE Todos Los Libros ESP   V107097103W   US$29.99
Los 6 libros sueltos suman US$48.94, asi que el descuento real es 39%, no 49%.

Orden: primero el numero, despues las frases que comparaban dos precios que ya
son el mismo.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

NUMBERS = [
    ("US$24.99", "US$29.99"),
    ("$24.99", "$29.99"),
    ("24,99", "29,99"),
    ("9 Libros", "6 Libros"),
    ("49%", "39%"),
]

PHRASES = [
    # ya no hay dos precios que comparar
    ("The six-book bundle is $29.99 in Spanish and $29.99 in English, 39% off the $48.94 the set costs separately.",
     "The six-book bundle is $29.99, 39% off the $48.94 the set costs separately."),
    ("The six-book bundle costs <strong>$29.99</strong> in Spanish and <strong>$29.99</strong> in English, against",
     "The six-book bundle costs <strong>$29.99</strong>, against"),
    ("What does the bundle cost in each language?", "What does the bundle cost?"),
    ("$29.99 for the Spanish set and $29.99 for the English one, against $48.94 for the six books bought separately. The individual books cost $3.99-$9.99 each.",
     "$29.99 for the six books, against $48.94 bought separately. Individually they cost $3.99-$9.99."),
    ("$29.99 for the Spanish set and $29.99 for the English one. The individual books are unchanged.",
     "$29.99 for the six books. The individual books are unchanged."),
    ("The English bundle is <strong>$29.99</strong>, and the Spanish set is <strong>$29.99</strong> (39% off the $48.94 it costs separately)",
     "The bundle is <strong>$29.99</strong> (39% off the $48.94 the six cost separately)"),
    ("complete books bundle</a> is US$29.99 in English (US$29.99 for the Spanish set; US$48.94 if bought individually).",
     "complete books bundle</a> is US$29.99 for the six books (US$48.94 if bought individually)."),
    ("Yes. The English bundle costs $29.99 USD; the Spanish set is $29.99 against $48.94 for the nine individually.",
     "Yes. The bundle costs $29.99 USD against $48.94 for the six individually."),
    ("Sum of the individual prices: $48.94 USD. English bundle: $29.99 USD. Spanish set: $29.99 USD (39% off).",
     "Sum of the individual prices: $48.94 USD. Bundle: $29.99 USD (39% off)."),
    # la fecha de fin de oferta que nunca se verifico
    ("sigue a <strong>$29.99 hasta el 27 de noviembre</strong> (un 39% sobre los $48.94 sueltos)",
     "cuesta <strong>$29.99</strong> (un 39% menos que los $48.94 sueltos)"),
    # catalogo
    ("9 Chaos Magick Books in PDF", "6 Chaos Magick Books in PDF"),
    # docs
    ("| **Libros PDF en Hotmart** | 9 (bundle $24.99, 9 libros, 59% off) |",
     "| **Libros PDF en Hotmart** | 6 (bundle $29.99; 3 titulos anteriores descatalogados, su contenido vive en estos 6) |"),
]


def git_files(pattern):
    out = subprocess.run(["git", "grep", "-l", "-F", pattern], capture_output=True,
                         text=True, encoding="utf-8").stdout
    return [Path(ROOT / l.strip()) for l in out.splitlines() if l.strip()]


def main() -> int:
    check = "--check" in sys.argv
    targets = set(git_files("24.99")) | set(git_files("9 Libros")) | set(git_files("49%"))
    targets = [p for p in targets if p.suffix in (".html", ".md")]
    stats = {"files": 0, "numbers": 0, "phrases": 0}
    for path in sorted(targets):
        raw = path.read_text(encoding="utf-8")
        text = raw
        for old, new in NUMBERS:
            n = text.count(old)
            stats["numbers"] += n
            if n:
                text = text.replace(old, new)
        for old, new in PHRASES:
            n = text.count(old)
            stats["phrases"] += n
            if n:
                text = text.replace(old, new)
        if text != raw:
            stats["files"] += 1
            if not check:
                path.write_text(text, encoding="utf-8")
    for k, v in stats.items():
        print(f"{k:8s} {v}")

    bad = 0
    for pat in ["24.99", "49%"]:
        for path in git_files(pat):
            if path.suffix in (".html", ".md"):
                print(f"  QUEDA {pat}: {path.relative_to(ROOT).as_posix()}")
                bad += 1
    for pat in ["in Spanish and", "for the Spanish set and", "hasta el 27 de noviembre"]:
        for path in git_files(pat):
            if path.suffix == ".html":
                print(f"  QUEDA comparacion '{pat}': {path.relative_to(ROOT).as_posix()}")
                bad += 1
    print(f"pendientes: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
