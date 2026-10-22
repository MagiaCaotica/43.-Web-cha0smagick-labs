#!/usr/bin/env python3
"""Un bundle por idioma: el ingles a las paginas inglesas, el espanol a las espanolas.

Verificado en el checkout de Hotmart el 2026-10-22 (pais Estados Unidos):
  - N108147778I  BUNDLE: All PDFs in ENGLISH      -> US$29.99
  - V107097103W  BUNDLE Todos Los Libros ESP      -> US$24.99
Hasta ahora las ~570 paginas inglesas mandaban al producto espanol.

El bundle ingles no publica cuantos PDFs incluye, asi que su copy no afirma
cantidad ni precio de lista: solo el precio cobrado.

  python projects/scripts/fix-bundle-lang.py            # aplica
  python projects/scripts/fix-bundle-lang.py --check    # solo informa
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

EN_CHECKOUT = "https://pay.hotmart.com/N108147778I"
ES_BUNDLE_ID = "V107097103W"

URL_MAP = [
    ("https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/" + ES_BUNDLE_ID, EN_CHECKOUT),
    ("https://pay.hotmart.com/" + ES_BUNDLE_ID, EN_CHECKOUT),
]

TEXT_MAP = [
    ("Get the Bundle for $24.99 →", "Get the English bundle — $29.99 →"),
    ("Get the Complete Bundle →", "Get the English bundle →"),
    ("Get the bundle →", "Get the English bundle →"),
    ("See all nine books — $24.99", "See the English bundle — $29.99"),
    ("all nine books, US$24.99", "the full English bundle, US$29.99"),
    ("All 8 books &mdash; $24.99", "All books in English &mdash; $29.99"),
    ("Get the 9-book bundle", "Get the English book bundle"),
    ("get the books bundle", "get the English books bundle"),
    ("$24.99 USD — 9 books at 59% off.", "$29.99 USD — the full English bundle."),
]

DROP = [", against US$60.91 on the list price"]

ES_TOOLS_TEXT = ("All 8 books &mdash; $24.99", "Los 9 libros &mdash; $24.99")


def git_files(pattern):
    out = subprocess.run(["git", "grep", "-l", pattern, "--", "*.html"],
                         capture_output=True, text=True, encoding="utf-8").stdout
    return [Path(ROOT / l.strip()) for l in out.splitlines() if l.strip()]


def is_spanish(path, text):
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith(("es/", "blog/es-")) or rel == "landing-pages/books-bundle.html":
        return True
    return bool(re.search(r'<html[^>]*lang="es"', text))


def main():
    check = "--check" in sys.argv
    files = sorted(set(git_files(ES_BUNDLE_ID) + git_files("All 8 books")))
    stats = {"en_files": 0, "url": 0, "text": 0, "drop": 0, "es_tools": 0}
    pending = []

    for path in files:
        raw = path.read_text(encoding="utf-8")
        text = raw
        if is_spanish(path, text):
            new = text.replace(*ES_TOOLS_TEXT)
            if new != text:
                stats["es_tools"] += 1
                if not check:
                    path.write_text(new, encoding="utf-8")
            continue

        stats["en_files"] += 1
        for a, b in URL_MAP:
            n = text.count(a)
            if n:
                stats["url"] += n
                text = text.replace(a, b)
        for a, b in TEXT_MAP:
            n = text.count(a)
            if n:
                stats["text"] += n
                text = text.replace(a, b)
        for d in DROP:
            n = text.count(d)
            if n:
                stats["drop"] += n
                text = text.replace(d, "")
        if ES_BUNDLE_ID in text:
            pending.append(path.relative_to(ROOT).as_posix())
        if text != raw and not check:
            path.write_text(text, encoding="utf-8")

    for k, v in stats.items():
        print(f"{k:10s} {v}")
    print(f"paginas EN con el bundle espanol todavia: {len(pending)}")
    for p in pending[:20]:
        print("   ", p)
    return 1 if pending else 0


if __name__ == "__main__":
    sys.exit(main())
