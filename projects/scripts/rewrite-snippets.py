#!/usr/bin/env python3
"""
Reescritura de snippets para las paginas que YA RANKING en pagina 1 y no
consiguen clics.

El dato (Search Console, 28 dias, 2026-10-21):
  pagina                                  impr  clics  pos   query principal
  /blog/astrology-apps-android-guide      629      3  14.6  best astrology apps 2026 (107, pos 6.2)
  /blog/sigil-vs-servitor-differences       93      1   6.4  sigil vs servitor
  /blog/planetary-magic-hours-guide        21      0   5.6  planetary magic hours
  /blog/ai-machine-learning-paranormal...   18      0   7.6  ai machine learning paranormal research
  /blog/paranormal-investigation-step...    17      0   7.4  paranormal investigation guide
  /blog/evp-vs-spirit-box-comparison       15      0   7.6  evp vs spirit box

La SERP de este nicho gana con un patron concreto: el a\u00f1o en el titulo,
el nombre de los competidores en el titulo o en la descripcion, y una
respuesta directa (la "AI Overview" de Google ya es la posicion 1).

Regla: nada que la pagina no pueda sostener. Si la pagina no dice haber
probado las apps, el titulo no dice "we tested".
"""
import json
import re
from pathlib import Path

ROOT = Path(".").resolve()

REGLAS = {
    "blog/astrology-apps-android-guide.html": {
        "title": "Best Astrology Apps for Android 2026: 6 Compared",
        "h1": "Best Astrology Apps for Android 2026: 6 compared, side by side",
        "desc": ("Co-Star, The Pattern, CHANI, Time Nomad, Astro Matrix and Astral Lab compared by price, "
                 "privacy, ephemeris and offline use, plus a 30-day test you can run on any app. "
                 "Play Store listings checked on 21 October 2026."),
        "og": "Best Astrology Apps for Android 2026: 6 compared by price, privacy, ephemeris and offline use",
    },
    "blog/sigil-vs-servitor-differences.html": {
        "title": "Sigil vs Servitor: the 5 differences that decide it",
        "h1": "Sigil vs servitor: the five differences that decide which one you need",
        "desc": ("A sigil fires once and is done. A servitor is designed, fed and maintained. "
                 "The five differences that matter, how to choose between them, and what each one costs "
                 "in effort and attention."),
        "og": "Sigil vs servitor: the five differences that decide which one you need",
    },
    "blog/planetary-magic-hours-guide.html": {
        "title": "Planetary Hours: the table, the calculator and when to use them",
        "h1": "Planetary hours: the table, the calculator and when each one is the right tool",
        "desc": ("Which planet rules which hour, how to find your own local hours (not just the clock), "
                 "and a free calculator that gives you the hour for your city and date."),
        "og": "Planetary hours: the table, the calculator and when each one is the right tool",
    },
    "blog/ai-machine-learning-paranormal-research.html": {
        "title": "Machine Learning in Paranormal Research: where it helps",
        "h1": "Machine learning in paranormal research: where it actually helps",
        "desc": ("Classification, not detection. Where machine learning genuinely narrows a "
                 "paranormal dataset, where it manufactures results out of noise, and how to tell "
                 "the two apart before you build anything on top of it."),
        "og": "Machine learning in paranormal research: where it helps and where it invents",
    },
    "blog/paranormal-investigation-step-by-step-guide.html": {
        "title": "How to Run a Paranormal Investigation: 6 phases",
        "h1": "How to run a paranormal investigation: the six phases, in order",
        "desc": ("Research, baseline, systematic sweep, trigger objects, analysis and documentation. "
                 "What to do in each phase, what a phase should produce, and the checks that keep "
                 "the session honest."),
        "og": "How to run a paranormal investigation: the six phases, in order",
    },
    "blog/evp-vs-spirit-box-comparison-guide.html": {
        "title": "EVP Recording vs Spirit Box: what each one proves",
        "h1": "EVP recording versus the spirit box: what each one can and cannot show",
        "desc": ("One records the room and lets you analyse it afterwards. The other generates its own "
                 "voice-shaped noise. The difference decides which claim you can honestly make."),
        "og": "EVP recording versus the spirit box: what each one can and cannot show",
    },
}


def main():
    cambios = 0
    for rel, r in REGLAS.items():
        p = ROOT / rel
        src = p.read_text(encoding="utf-8", errors="ignore")
        o = src

        # title
        src = re.sub(r"(?is)<title>.*?</title>", f"<title>{r['title']}</title>", src, count=1)
        # meta description
        src = re.sub(
            r'(?i)(<meta name="description" content=")[^"]*(")',
            lambda m: m.group(1) + r["desc"].replace('"', "'") + m.group(2),
            src, count=1)
        # og:title / og:description / twitter
        src = re.sub(r'(?i)(<meta property="og:title" content=")[^"]*(")',
                      lambda m: m.group(1) + r["og"].replace('"', "'") + m.group(2), src, count=1)
        src = re.sub(r'(?i)(<meta property="og:description" content=")[^"]*(")',
                      lambda m: m.group(1) + r["desc"].replace('"', "'") + m.group(2), src, count=1)
        src = re.sub(r'(?i)(<meta name="twitter:title" content=")[^"]*(")',
                      lambda m: m.group(1) + r["title"].replace('"', "'") + m.group(2), src, count=1)
        src = re.sub(r'(?i)(<meta name="twitter:description" content=")[^"]*(")',
                      lambda m: m.group(1) + r["desc"].replace('"', "'") + m.group(2), src, count=1)
        # h1 (solo el primero)
        src = re.sub(r"(?is)(<h1[^>]*>).*?(</h1>)",
                     lambda m: m.group(1) + r["h1"] + m.group(2), src, count=1)
        # JSON-LD headline
        src = re.sub(r'("headline"\s*:\s*")[^"]*(")',
                      lambda m: m.group(1) + r["h1"].replace('"', "'") + m.group(2), src, count=1)
        src = re.sub(r'("name"\s*:\s*")[^"]*(")',
                      lambda m: m.group(1) + r["h1"].replace('"', "'") + m.group(2), src, count=1)

        if src != o:
            p.write_text(src, encoding="utf-8")
            cambios += 1
            print(f"   {rel}")
            print(f"      title: {r['title']} ({len(r['title'])} car.)")
            print(f"      desc : {r['desc'][:96]}... ({len(r['desc'])} car.)")

    print(f"\npaginas reescritas: {cambios}")


if __name__ == "__main__":
    main()
