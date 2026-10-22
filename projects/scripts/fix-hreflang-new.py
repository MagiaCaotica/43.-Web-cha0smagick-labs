#!/usr/bin/env python3
"""
Cierra los pares hreflang de los 7 articulos nuevos.

Tres problemas medidos por audit-hreflang.py:

  1. es-magia-del-caos-para-principiantes.html apuntaba a un EN que no
     existe: chaos-magic-beginners-complete-guide.html. El real es
     chaos-magick-beginners-complete-guide.html (con "magick").
  2. Las paginas EN nuevas no declaraban su version en espanol, y las EN
     que ya existian y son el par de un ES nuevo tampoco.
  3. Las paginas ES nuevas declaraban 'es' apuntandose a si mismas, que no
     es el patron del repo (y que el auditor marca).

El patron que ya usan las 32 ES y los pares que funcionan en el repo:

    pagina EN:  hreflang en -> la EN
                hreflang es -> la ES
                hreflang x-default -> la EN
    pagina ES:  hreflang en -> la EN
                hreflang x-default -> la EN

Sin reciprocidad, Google ignora el par: la version en espanol no hereda
nada y las dos paginas compiten entre si.

Ademas: una pagina noindex no deberia declarar hreflang (no se anuncia, y
un alternate a una pagina noindex es una contradiccion). Se quitan de
complete-access.html y dashboard-colombia.html.

  python projects/scripts/fix-hreflang-new.py
"""
import re
from pathlib import Path

ROOT = Path(".").resolve()
SITE = "https://cha0smagicklabs.com"

# ES -> EN real (el par EN<->ES de cada articulo ES nuevo)
PARES = {
    "es-black-friday-libros-ocultismo-2026": "black-friday-occult-books-2026",
    "es-regalos-ocultismo-navidad-2026": "christmas-occult-books-gift-guide-2026",
    "es-mejores-apps-astrologia-android-2026": "astrology-apps-android-guide",
    "es-carta-natal-gratis-como-leerla": "birth-chart-app-accuracy-comparison",
    "es-magia-del-caos-para-principiantes": "chaos-magick-beginners-complete-guide",
}

ALT_RE = re.compile(r'(?i)<link\s+rel="alternate"[^>]*>\n?')


def fijar(p, bloque):
    """Sustituye todos los alternate de la pagina por el bloque dado."""
    s = p.read_text(encoding="utf-8", errors="ignore")
    s = ALT_RE.sub("", s)
    m = re.search(r'(?i)<link\s+rel="canonical"[^>]*>', s)
    if m:
        s = s[: m.end()] + "\n" + bloque + s[m.end():]
    else:
        s = re.sub(r"(?i)(</head>)", bloque + r"\1", s, count=1)
    p.write_text(s, encoding="utf-8")


def main():
    print("--- 1. el EN de principiantes apuntaba a un slug inexistente")
    p = ROOT / "blog" / "es-magia-del-caos-para-principiantes.html"
    s = p.read_text(encoding="utf-8", errors="ignore")
    mal = "chaos-magic-beginners-complete-guide.html"
    bien = "chaos-magick-beginners-complete-guide.html"
    if mal in s:
        s = s.replace(mal, bien)
        p.write_text(s, encoding="utf-8")
        print(f"   {mal} -> {bien}")
    else:
        print("   ya correcto")

    print("--- 2. reciprocidad con el patron del repo")
    for es_slug, en_slug in PARES.items():
        en_p = ROOT / "blog" / f"{en_slug}.html"
        es_p = ROOT / "blog" / f"{es_slug}.html"
        if not en_p.exists():
            print(f"   {en_slug}: no existe")
            continue
        en_url = f"{SITE}/blog/{en_slug}.html"
        es_url = f"{SITE}/blog/{es_slug}.html"

        # la EN declara en + es + x-default (x-default a la EN)
        fijar(en_p,
              f'<link rel="alternate" hreflang="en" href="{en_url}">\n'
              f'<link rel="alternate" hreflang="es" href="{es_url}">\n'
              f'<link rel="alternate" hreflang="x-default" href="{en_url}">\n')
        # la ES declara en + x-default (los dos a la EN)
        fijar(es_p,
              f'<link rel="alternate" hreflang="en" href="{en_url}">\n'
              f'<link rel="alternate" hreflang="x-default" href="{en_url}">\n')
        print(f"   par: {en_slug} <-> {es_slug}")

    print("--- 3. hreflang en paginas noindex: se quitan")
    for rel in ["landing-pages/complete-access.html", "tools/dashboard-colombia.html"]:
        p = ROOT / rel
        if not p.exists():
            continue
        s = p.read_text(encoding="utf-8", errors="ignore")
        antes = len(ALT_RE.findall(s))
        s = ALT_RE.sub("", s)
        p.write_text(s, encoding="utf-8")
        print(f"   {rel}: {antes} alternate eliminado(s)")

    print("--- 4. el hub estacional (solo en espanol): x-default a si mismo")
    hub = ROOT / "blog" / "calendario-estacional-magia-caos.html"
    if hub.exists():
        url = f"{SITE}/blog/calendario-estacional-magia-caos.html"
        fijar(hub, f'<link rel="alternate" hreflang="x-default" href="{url}">\n')
        print("   calendario-estacional-magia-caos.html: x-default")


if __name__ == "__main__":
    main()
