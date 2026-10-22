#!/usr/bin/env python3
"""Guardia: los articulos estacionales no pueden inventar una fecha de fin de oferta.

El checkout de Hotmart (2026-10-22) muestra $24.99 para el bundle ES y $29.99
para el EN, sin campana con fecha de cierre. La fecha "27 de noviembre" que
llevaban estos articulos no estaba verificada: se retiro. Esta comprobacion
evita que vuelva a colarse al regenerarlos.

  python projects/scripts/check-seasonal-claims.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

FILES = [
    "blog/black-friday-occult-books-2026.html",
    "blog/christmas-occult-books-gift-guide-2026.html",
    "blog/es-black-friday-libros-ocultismo-2026.html",
    "blog/es-regalos-ocultismo-navidad-2026.html",
]

# frases que prometen una rebaja con fecha, o escasez, sin fuente
PROHIBIDO = [
    r"drops to \$",
    r"price holds until",
    r"until 27 November",
    r"baja a \$",
    r"hasta el 27 de noviembre",
    r"descuento dura hasta",
    r"antes de que se agote",
]


def main() -> int:
    bad = 0
    for rel in FILES:
        text = (ROOT / rel).read_text(encoding="utf-8")
        for pat in PROHIBIDO:
            for m in re.finditer(pat, text, re.I):
                ctx = re.sub(r"\s+", " ", text[max(0, m.start() - 60):m.end() + 60])
                print(f"  {rel}: {ctx}")
                bad += 1
    print(f"afirmaciones sin fuente: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
