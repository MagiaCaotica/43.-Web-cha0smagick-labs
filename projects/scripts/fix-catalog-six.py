#!/usr/bin/env python3
"""El catalogo queda en 6 libros: los 3 descatalogados salen de la venta visible.

Hecho del dueno (2026-10-22): el bundle son 6 libros; los otros 3 estan
descatalogados y su contenido vive dentro de esos 6:
  Magical Servitors Manual                      -> Complete Practical Treatise
  Treatise of Chaos Hunter Runes
  Ouija Cazadora
Siguen accesibles (hay quien ya los compro), pero dejan de ocupar sitio en el
catalogo, en la landing y en las guias de temporada: menos ruido, menos duda.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

DEPRECATED = [
    ("Magical Servitors Manual", "./manual-activacion-servidores-magicos-pdf.html"),
    ("Treatise of Chaos Hunter Runes", "./tratado-runas-cazadoras-caos-pdf.html"),
    ("Ouija Cazadora", "./ouija-cazadora-pdf.html"),
]

# nombres en espanol de la landing
TITLES = [t for t, _ in DEPRECATED] + ["Manual de Servidores", "Runas Cazadoras"]

SEASONAL = [
    "blog/black-friday-occult-books-2026.html",
    "blog/es-black-friday-libros-ocultismo-2026.html",
]

WORDS = [
    ("The nine, one by one", "The six, one by one"),
    ("Los nueve, uno por uno", "Los seis, uno por uno"),
    ("the nine PDFs", "the six PDFs"),
    ("los nueve PDF", "los seis PDF"),
    ("of the nine", "of the six"),
    ("de los nueve", "de los seis"),
    ("the nine", "the six"),
    ("los nueve", "los seis"),
]


def drop_cards(text, open_tag):
    """Quita los bloques cuyo titulo esta descatalogado."""
    removed = 0
    if open_tag == '<article class="card">':
        parts = text.split(open_tag)
        out = [parts[0]]
        for seg in parts[1:]:
            head, _, tail = seg.partition("</article>")
            if any(f"<h3>{t}" in head for t in TITLES):
                removed += 1
                out.append(tail)
            else:
                out.append(open_tag + seg)
        return "".join(out), removed

    pattern = re.compile(r'<div class="book-card">.*?</div>\s*</div>', re.S)
    def repl(m):
        nonlocal removed
        if any(t in m.group(0) for t in TITLES):
            removed += 1
            return ""
        return m.group(0)
    return pattern.sub(repl, text), removed


def drop_sections(text):
    """Quita el bloque de un libro descatalogado: de su <h3> al siguiente <h3>/<h2>."""
    removed = 0
    for title in TITLES:
        m = re.search(r"<h3[^>]*>\s*" + re.escape(title), text)
        if not m:
            continue
        start = m.start()
        nxt = re.search(r"<h[23][^>]*>", text[m.end():])
        end = m.end() + nxt.start() if nxt else len(text)
        text = text[:start] + text[end:]
        removed += 1
    return text, removed


def main() -> int:
    check = "--check" in sys.argv
    stats = {"cards": 0, "sections": 0, "words": 0, "prices": 0}

    index = ROOT / "books/index.html"
    text = index.read_text(encoding="utf-8")
    text, n = drop_cards(text, '<article class="card">')
    stats["cards"] += n
    text = re.sub(r"<h1>9 Books on Chaos", "<h1>6 Books on Chaos", text)
    note = ('<p class="deprecated-note">Three earlier titles are deprecated: their content is '
            'included in these six. They stay available for anyone who already bought them: '
            + ", ".join(f'<a href="{href}">{name}</a>' for name, href in DEPRECATED) + ".</p>")
    if "deprecated-note" not in text:
        text = text.replace("</div>\n    </section>", note + "\n</div>\n    </section>", 1)
    if not check:
        index.write_text(text, encoding="utf-8")

    landing = ROOT / "landing-pages/books-bundle.html"
    text = landing.read_text(encoding="utf-8")
    text, n = drop_cards(text, '<div class="book-card">')
    stats["cards"] += n
    text = text.replace("<h1>9 Grimorios Digitales Completos</h1>",
                        "<h1>6 Grimorios Digitales Completos</h1>")
    for old, new in [('"price":"24.99"', '"price":"29.99"'),
                     ("value: 24.99", "value: 29.99")]:
        stats["prices"] += text.count(old)
        text = text.replace(old, new)
    if not check:
        landing.write_text(text, encoding="utf-8")

    home = ROOT / "index.html"
    text = home.read_text(encoding="utf-8")
    text = text.replace("<strong>12 Apps & 9 Books</strong>", "<strong>12 Apps & 6 Books</strong>")
    if not check:
        home.write_text(text, encoding="utf-8")

    for rel in SEASONAL:
        path = ROOT / rel
        text = path.read_text(encoding="utf-8")
        text, n = drop_sections(text)
        stats["sections"] += n
        for old, new in WORDS:
            stats["words"] += text.count(old)
            text = text.replace(old, new)
        if not check:
            path.write_text(text, encoding="utf-8")

    for k, v in stats.items():
        print(f"{k:9s} {v}")

    bad = 0
    for pat in ["24.99", "9 libros", "9 Books", "9 Grimorios"]:
        out = __import__("subprocess").run(["git", "grep", "-l", "-F", pat],
                                           capture_output=True, text=True, encoding="utf-8").stdout
        for line in out.splitlines():
            if line.endswith((".html", "index.html")) or line.endswith(".html"):
                print(f"  QUEDA {pat}: {line}")
                bad += 1
    print(f"pendientes: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
