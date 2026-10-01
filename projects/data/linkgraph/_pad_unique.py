#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Rellena cada wisdom/<app>.json hasta tener 30 slugs UNICOS en la prosa.

rewrite_apps.py contaba ocurrencias de markup, no enlaces distintos, y los
parches anteriores repitieron slugs. Este script lee los targets que la app
tiene disponibles en data/link-graph.json, descarta los ya usados, y anade
una seccion extra por app con enlaces que no aparecen en ninguna otra parte.
"""
import io
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", "..", ".."))
BLOG = os.path.join(ROOT, "blog")
GRAPH = os.path.join(ROOT, "data", "link-graph.json")
WIS = os.path.join(HERE, "wisdom")
MIN_UNIQUE = 30

# encuadre propio de cada app para la seccion de cierre, para que el texto no
# sea el mismo bloque repetido doce veces
FRAMING = {
    "arcana-goetia": (
        "Reading the list without calling anything",
        "A catalogue earns its keep when you can navigate it, not when it frightens you. "
        "The entries below are the ones worth knowing before you start choosing, because "
        "they cover the ground the app's own search will hand you in an order you did not "
        "pick. Read them as a map of the material rather than as a list of candidates.",
    ),
    "astral-lab": (
        "What to read while the chart is still open",
        "A chart is only as good as the vocabulary you bring to it, and most of that "
        "vocabulary is learned elsewhere. The pieces below cover the three axes a "
        "natal chart actually resolves, so that what the app draws stops being the "
        "interesting part.",
    ),
    "chaos-sigil-generator": (
        "The library behind a mark you did not draw",
        "A generated glyph is a compression result, and compression only means something "
        "once the sentence going into it was yours. The writing below is what makes the "
        "aim legible before the algorithm touches it, which is the part the button "
        "cannot do for you.",
    ),
    "dream-machine": (
        "The sleep work this app sits inside",
        "An alarm, a journal and an induction cue are the whole mechanism, and each of "
        "them has a body of writing behind it. The pieces below cover the practices "
        "this app is a front end for, including the ones that work without it.",
    ),
    "eerieroads": (
        "The mechanism, read without the costume",
        "Almost everything worth knowing about this kind of working is written down "
        "somewhere, and most of it predates the vocabulary of entities. The entries "
        "below cover the specification, the maintenance and the retirement of a thing "
        "you build yourself.",
    ),
    "iching-oracle": (
        "The practice behind the cast",
        "A cast is a question, and the line that moves is the answer. The writing below "
        "covers the arithmetic you can check, the method differences worth knowing, and "
        "the daily rhythm that turns a lookup into a practice.",
    ),
    "lucid-dream": (
        "The skill, and the sleep it happens in",
        "Lucid dreaming is a technique with a body of published technique behind it, not "
        "a feature of any one app. The entries below cover induction, checks, alarms, "
        "stabilisation and what to write down once you are awake.",
    ),
    "lunar-phase-calculator": (
        "The year the calendar is for",
        "A moon phase is a date, and what you do with a date is a separate decision that "
        "the calendar never makes for you. The writing below covers the phases, the "
        "eclipses, the correspondence layer and the year-long tracking that turns a "
        "lookup into a schedule.",
    ),
    "noctem-tools": (
        "The practice behind the instrument",
        "Every tool on a phone corresponds to a piece of practice that was worked out "
        "long before the phone existed. The entries below cover the reference material, "
        "the banishing, the catalogue and the servitor, which is where the toolkit is "
        "actually used.",
    ),
    "norse-rune-oracle": (
        "The alphabet underneath the casting",
        "Twenty-four signs with fixed names is a language you can learn, and a language "
        "you can learn is a different thing from a table you consult. The writing below "
        "covers the futhark, the casting methods, the expansion traditions and the "
        "maintenance of a physical set.",
    ),
    "psi-gym": (
        "What the training is a sample of",
        "Scores, timers and streak counters all look like progress and none of them is "
        "the thing being trained. The entries below cover the claims, the statistics, "
        "the training literature and the practice habits that hold up over months.",
    ),
    "unofficial-rider-waite-tarot": (
        "The seventy-eight, and how to read them",
        "A deck of fixed images is a reference, and the skill is recognising before it "
        "is divining. The entries below cover the set, the layouts, the positions, the "
        "reversal question and the record that makes a reading worth keeping.",
    ),
}


def uniq_slugs(doc: dict) -> list:
    out = []
    text = json.dumps(doc, ensure_ascii=False)
    for s in re.findall(r"\]\(([^)]+)\)", text):
        if s not in out:
            out.append(s)
    return out


def anchor(title: str, slug: str, max_words: int = 8) -> str:
    t = re.sub(r"\s+", " ", title or slug.replace("-", " ")).strip()
    words = t.split(" ")
    if len(words) > max_words:
        t = " ".join(words[:max_words])
    return t.replace("[", "(").replace("]", ")")


def main() -> int:
    with io.open(GRAPH, encoding="utf-8") as f:
        graph = json.load(f)
    articles = {a["slug"]: a for a in graph["articles"]}
    apps = {a["slug"]: a for a in graph["apps"]}

    for app in sorted(apps):
        path = os.path.join(WIS, app + ".json")
        if not os.path.exists(path):
            print("[SKIP] sin wisdom:", app)
            continue
        with io.open(path, encoding="utf-8") as f:
            doc = json.load(f)

        used = uniq_slugs(doc)
        need = MIN_UNIQUE - len(used)
        if need <= 0:
            print("[OK]  %-32s %d unicos" % (app, len(used)))
            continue

        pool = [s for s in apps[app]["targets"] if s not in used]
        pool = [s for s in pool if s in articles]
        if len(pool) < need:
            print("[WARN] %-32s faltan targets (%d de %d)" % (app, len(pool), need))
        take = pool[:need]
        if not take:
            print("[FAIL] %-32s sin material nuevo" % app)
            return 1

        h3, intro = FRAMING[app]
        ps = [intro + " " + " ".join(
            "[%s](%s)" % (anchor(articles[s]["title"], s), s) for s in take
        ) + "."]
        ps.append(
            "None of these replaces the others. Read the one that answers the question "
            "you actually arrived with, and leave the rest for the next time you find "
            "yourself back at this page without a question."
        )
        doc["sections"].append({"h3": h3, "p": ps})
        with io.open(path, "w", encoding="utf-8", newline="") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)
        print("[PAD] %-32s +%d -> %d unicos" % (app, len(take), len(used) + len(take)))

    return 0


if __name__ == "__main__":
    sys.exit(main())
