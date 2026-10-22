#!/usr/bin/env python3
"""Cierra la verdad del catalogo: 6 libros en el bundle y cada idioma con lo suyo.

Hechos (dueno, 2026-10-22): el bundle son 6 libros; los otros 3 titulos estan
descatalogados y su contenido vive dentro de esos 6.
  EN bundle N108147778I  $29.99
  ES bundle V107097103W  $24.99
Los 6 sueltos suman $48.94 (4.99 + 9.99x4 + 3.99), asi que "59%" y "$60.91"
-eran la cuenta de los 9- dejan de ser ciertos: pasan a 49% (ES) y 39% (EN).

Solo tres libros son solo-espanol: manual de servidores, tratado de runas y
ouija cazadora. En una pagina inglesa no se ofrecen: su contenido esta dentro
de los 6, asi que el lector ingles recibe el tratado completo de servidores (EN)
o el bundle ingles.

Nada de porcentajes sin fuente: fuera los badges "60% / 80% / 90% off".
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EN_BUNDLE = "https://pay.hotmart.com/N108147778I"
COMPLETE_TREATISE = "https://pay.hotmart.com/U108075109V"

ES_ONLY = {
    "D104270399P": "manual",
    "F104270966V": "tratado",
    "B104271332D": "ouija",
}

MARKETPLACE = re.compile(r"https://hotmart\.com/es/marketplace/productos/[a-z0-9-]+/([A-Z][A-Z0-9]+)")

# texto visible: solo el que vende un libro solo-espanol desde una pagina inglesa
TEXT_EN = [
    ("See the Magical Servitors Manual — $3.99", "Complete Treatise on Magical Servitors — $9.99"),
    ("See Magical Servitors Manual — $3.99", "Complete Treatise on Magical Servitors — $9.99"),
    ("Magical Servitors Manual, $3.99", "Complete Treatise on Magical Servitors, $9.99"),
    ("BUY THE PDF MANUAL", "BUY THE PDF"),
    ("Get the Magical Servitors Manual", "Get the Complete Treatise on Magical Servitors"),
    ("Magical Servitors Manual, $3.99. The design sheet, the charge, the feeding schedule and the dismissal, in that order . Instant download, PDF, no subscription.",
     "Complete Treatise on Magical Servitors, $9.99. Design, charge, feeding schedule, dismissal and the full method. Instant download, PDF, no subscription."),
    ("See Chaos Hunter Runes — $3.99", "Get the English bundle — $29.99"),
    ("The book: Chaos Hunter Runes &mdash; $3.99", "Get the English bundle &mdash; $29.99"),
    ("Get the Treatise of Chaos Hunter Runes", "Get the English bundle"),
    ("Treatise of Chaos Hunter Runes, $3.99. The sixty-four runic servitors and the magic chess matrix, with the full futhark as reference . Instant download, PDF, no subscription.",
     "The six English books, $29.99: chaos magick, servitors, tarot and mental discipline. Instant download, PDF, no subscription."),
    ("See the Ouija Cazadora — $3.99", "Get the English bundle — $29.99"),
]

COUNT_EN = [
    ("all nine books", "all six books"),
    ("nine books", "six books"),
    ("nine-book", "six-book"),
    ("nine grimoires", "six books"),
    ("All 9 books", "All 6 books"),
    ("all 9 books", "all 6 books"),
    ("9 books", "6 books"),
    ("9-book", "6-book"),
    ("59% off", "39% off"),
    ("59%", "39%"),
    ("$60.91", "$48.94"),
    ("US$60.91", "US$48.94"),
]

COUNT_ES = [
    ("9 libros", "6 libros"),
    ("nueve libros", "seis libros"),
    ("nueve grimorios", "seis libros"),
    ("9 tratados", "6 tratados"),
    ("Bundle 9 Libros", "Bundle 6 Libros"),
    ("los 9", "los 6"),
    ("59% OFF", "49% OFF"),
    ("59%", "49%"),
    ("$60.91", "$48.94"),
    ("US$60.91", "US$48.94"),
]

CTA_OFF = re.compile(r'\s*<span class="cta-off">[^<]*</span>')


def git_files(pattern):
    out = subprocess.run(["git", "grep", "-l", "-F", pattern, "--", "*.html"],
                         capture_output=True, text=True, encoding="utf-8").stdout
    return [Path(ROOT / l.strip()) for l in out.splitlines() if l.strip()]


def is_spanish(path, text=None):
    text = text or path.read_text(encoding="utf-8", errors="ignore")[:4000]
    return bool(re.search(r'<html[^>]*lang="es"', text))


def safe_replace(text, old, new):
    """Reemplaza sin tocar las lineas de hreflang alternate."""
    out = []
    for line in text.splitlines(keepends=True):
        if 'rel="alternate"' in line or 'rel="canonical"' in line:
            out.append(line)
        else:
            out.append(line.replace(old, new))
    return "".join(out)


def main() -> int:
    check = "--check" in sys.argv
    targets = set()
    for pat in ["V107097103W", "N108147778I", "59%", "60.91", "9 libros", "nueve libros",
                "9 books", "nine", "cta-off", "hotmart.com/es/marketplace",
                "manual-activacion-servidores", "tratado-runas-cazadoras", "ouija-cazadora",
                "catholiconomicon-es-pdf", "magical-servitors-es-pdf"]:
        targets.update(git_files(pat))

    stats = {k: 0 for k in ("files", "badge", "locale", "text", "count", "es_book")}
    for path in sorted(targets):
        raw = path.read_text(encoding="utf-8")
        text = raw
        spanish = is_spanish(path, text)

        # 1. fuera los badges de descuento sin fuente
        text, n = CTA_OFF.subn("", text)
        stats["badge"] += n

        # 2. cuentas y descuentos, por idioma
        for old, new in (COUNT_ES if spanish else COUNT_EN):
            if old in text:
                stats["count"] += text.count(old)
                text = text.replace(old, new)

        if not spanish:
            # 3. el marketplace espanol deja de ser la puerta de un libro ingles
            def repl(m):
                pid = m.group(1)
                if pid in ES_ONLY:
                    return COMPLETE_TREATISE if pid == "D104270399P" else EN_BUNDLE
                return f"https://pay.hotmart.com/{pid}"
            text, n = MARKETPLACE.subn(repl, text)
            stats["locale"] += n

            # 4. libros solo-espanol fuera de las paginas inglesas
            stats["es_book"] += text.count("manual-activacion-servidores-magicos-pdf.html")
            text = safe_replace(text, "manual-activacion-servidores-magicos-pdf.html",
                                "complete-practical-treatise-magical-servitors-pdf.html")
            for old, new in TEXT_EN:
                if old in text:
                    stats["text"] += text.count(old)
                    text = text.replace(old, new)
            text = safe_replace(text, "tratado-runas-cazadoras-caos-pdf.html",
                                "https://pay.hotmart.com/N108147778I")
            text = safe_replace(text, "ouija-cazadora-pdf.html", "https://pay.hotmart.com/N108147778I")
            text = safe_replace(text, "catholiconomicon-es-pdf.html", "catholiconomicon-pdf.html")
            text = safe_replace(text, "complete-practical-treatise-magical-servitors-es-pdf.html",
                                "complete-practical-treatise-magical-servitors-pdf.html")

        if text != raw:
            stats["files"] += 1
            if not check:
                path.write_text(text, encoding="utf-8")

    for k, v in stats.items():
        print(f"{k:8s} {v}")

    # verificacion
    bad = 0
    for pat, label in [("hotmart.com/es/marketplace", "marketplace ES"),
                       ("59%", "59%"), ("60.91", "60.91"),
                       ("cta-off", "badge descuento"),
                       ("books/manual-activacion-servidores-magicos-pdf.html", "ficha manual ES"),
                       ("books/tratado-runas-cazadoras-caos-pdf.html", "ficha runas ES"),
                       ("books/ouija-cazadora-pdf.html", "ficha ouija ES")]:
        for path in git_files(pat):
            text = path.read_text(encoding="utf-8", errors="ignore")
            if is_spanish(path, text):
                continue
            print(f"  QUEDA {label}: {path.relative_to(ROOT).as_posix()}")
            bad += 1
    for path in git_files("9 libros") + git_files("nueve libros") + git_files("9 books"):
        text = path.read_text(encoding="utf-8", errors="ignore")
        if is_spanish(path, text):
            continue
        print(f"  QUEDA '9 libros/9 books': {path.relative_to(ROOT).as_posix()}")
        bad += 1
    print(f"pendientes: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
