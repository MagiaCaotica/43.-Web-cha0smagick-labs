#!/usr/bin/env python3
"""Round 2 of the duplicate-prose fix: 31 exact-string edits.

Round 1 rewrote 117 sentences and cut the corpus from 109 offending 8-grams to 29,
but several rewrites collided with each other (three articles ended up with the
same new wording for the evocation/invocation question) and six articles written
earlier the same morning brought their own repeats.

Most offenders here straddle a sentence boundary, which is why the sentence index
classified them as virtual targets, so they are patched directly rather than through
`_apply.py`. Occurrence counts are reported rather than asserted, because a few of
these strings live in more than one field.
"""
from __future__ import annotations

import json
import pathlib
import sys

sys.stdout.reconfigure(encoding="utf-8")

CONTENT = pathlib.Path(__file__).resolve().parent / "content"

EDITS: list[tuple[int, str, str]] = [
    # --- descent-from-demonological-sources family (128 is the keeper) ---
    (139,
     "The modern Goetia as a brand, the video essays, the apps, the commentary layered on top, is a twenty-first century phenomenon sitting on older material that descends from Jewish and Christian demonological sources, the Book of Enoch among them, arriving through the seventeenth-century Conjuratio Ben-Maimon and the Lemuria.",
     "The modern Goetia as a brand, the video essays, the apps, the commentary layered on top, is a twenty-first century phenomenon sitting on older material. That older material runs back through Jewish and Christian demonological writing, the Book of Enoch among them, and arrives by way of the seventeenth-century Conjuratio Ben-Maimon and the Lemuria."),
    (142,
     "The underlying material descends from Jewish and Christian demonological sources, the Pseudepigrapha Book of Enoch among them, and arrives in the seventeenth century through the Conjuratio Ben-Maimon and the Lemuria.",
     "Underneath it sits a stratum of Jewish and Christian demonological writing, the Pseudepigrapha Book of Enoch among it, which reaches the grimoire lineage in the seventeenth century by way of the Conjuratio Ben-Maimon and the Lemuria."),
    (145,
     "The material descends from Jewish and Christian demonological sources, particularly the Pseudepigrapha Book of Enoch, which lists a tribunal of fallen angels and the duties assigned to them.",
     "Its sources are Jewish and Christian demonological texts, and the Pseudepigrapha Book of Enoch in particular supplies a tribunal of fallen angels together with the duties assigned to them."),
    (160,
     "The material descends from Jewish and Christian demonological sources, the Pseudepigrapha Book of Enoch above all, and enters the grimoire lineage through the Lemuria and the Conjuratio Ben-Maimon of the seventeenth century.",
     "Jewish and Christian demonological writing is where this material begins, the Pseudepigrapha Book of Enoch above all, and it enters the grimoire lineage through the Lemuria and the Conjuratio Ben-Maimon of the seventeenth century."),
    # --- falsifiable-prediction family (151 is the keeper) ---
    (171,
     "Write down a falsifiable prediction before the attempt, attach a date, and count every attempt including the ones you were certain would fail.",
     "Put a falsifiable prediction in writing before the attempt, pin a date to it, and log every attempt, including the ones you were sure would fail."),
    (349,
     "Get the prediction down before you start, attach a date, and count every attempt including the failures.",
     "Write the prediction down before you begin, date it, and keep count of every attempt, failures included."),
    # --- expectancy / physiological outcomes (110 is the keeper) ---
    (117,
     "Expectancy effects measurably shift reported pain and affect a small number of physiological outcomes. That is a genuine finding, and it is limited.",
     "Expectancy effects measurably shift reported pain and reach a handful of physiological outcomes. The finding is genuine, and it is narrow."),
    (124,
     "Expectancy effects measurably shift reported pain and affect a small number of physiological outcomes. That is a genuine and limited effect, and it is a long way from healing a disease or moving money.",
     "Expectancy effects measurably shift reported pain and reach a handful of physiological outcomes. What you get there is genuine but narrow, and it is a long way from healing a disease or moving money."),
    # --- the three earliest grimoires (13 is the keeper) ---
    (22,
     "Among the earliest grimoires are the Ars Notoria, the Ars Almadel and the Lemuria, assembled across medieval and early-modern Western Europe out of Arabic, Jewish and Latin material.",
     "Among the earliest grimoires sit the Ars Notoria and the Ars Almadel, alongside the Lemuria, all compiled in Western Europe across the medieval and early-modern periods out of Arabic, Jewish and Latin material."),
    (179,
     "The Ars Notoria, the Ars Almadel and the Lemuria work well as first exercises precisely because they are short, formulaic, and largely borrowed.",
     "The Lemuria, the Ars Almadel and the Ars Notoria make useful first exercises for a plain reason: each one is short, formulaic and largely borrowed."),
    # --- initiatory material shaped the ceremonial practice (13 is the keeper) ---
    (108,
     "Its initiatory material shaped most of the ceremonial practice that followed, which means a great deal of what gets taught today carries a nineteenth-century British provenance however ancient its imagery.",
     "Most of the ceremonial practice that came afterwards was shaped by its initiatory material, so a great deal of what gets taught today carries a nineteenth-century British provenance however ancient its imagery."),
    (179,
     "Founded in 1888, the Golden Dawn was the most consequential British occult order of the nineteenth century, and its initiatory material shaped most of the ceremonial practice that came after.",
     "Founded in 1888, the Golden Dawn was the most consequential British occult order of the nineteenth century. Its initiatory material then shaped most of the ceremonial practice that followed."),
    # --- aspects of the magician's own mind (96 is the keeper) ---
    (142,
     "Peter Carroll held that entities in chaos magic work best taken as aspects of the magician's own mind rather than as external beings.",
     "Carroll's position was that entities in chaos magic are best handled as aspects of the magician's own mind, not as external beings."),
    (159,
     "Peter Carroll's widely-cited definition treated entities in chaos magic as aspects of the magician's own mind rather than as external beings.",
     "Carroll's most-cited definition treated entities in chaos magic as aspects of the magician's own mind, and stopped short of external beings."),
    # --- evocation vs invocation (154 is the keeper) ---
    (159,
     "Evocation and invocation are not the same thing. How do they differ?",
     "Evocation and invocation are two different operations. What separates them?"),
    (332,
     "Evocation and invocation are not the same thing. How do they differ?",
     "Two operations get confused here. What is the difference between evocation and invocation?"),
    # --- the three ranks of the Goetia (35 is the keeper) ---
    (79,
     "Seventy-two named entities arranged in three ranks: nine Presidents, thirty-six Dukes and thirty Kings, then sorted into small sets of two to four names apiece.",
     "Seventy-two named entities sorted into three ranks: nine Presidents, then thirty-six Dukes and thirty Kings, the lot sorted into small sets of two to four names apiece."),
    (145,
     "Seventy-two, divided into three ranks: nine Presidents, thirty-six Dukes, and thirty Kings.",
     "The number is seventy-two, and they divide three ways: nine Presidents, thirty-six Dukes, thirty Kings."),
    # --- families of two, three or four (35 is the keeper) ---
    (157,
     "Below the ranks the spirits are sorted into families of two, three or four, and those families are not decorative.",
     "Beneath the ranking the spirits sort into twos, threes and fours, and those groupings earn their place."),
    (160,
     "The seventy-two also sort into families of two, three or four, and that grouping is often the more useful unit because it shows which entries were designed to operate together.",
     "Rank is not the only organising layer. The seventy-two also group in twos, threes and fours, and that grouping often proves the more useful unit because it shows which entries were built to work together."),
    # --- rows in a demonological catalogue (139 is the keeper) ---
    (157,
     "Historically they are rows in a demonological catalogue, and not one of them has evidence of agency outside the page.",
     "The historical record offers catalogue entries and nothing more; not one of them shows any sign of agency beyond the printed page."),
    (160,
     "Historically they are rows in a demonological catalogue, with nothing behind them acting outside the page.",
     "What the historical record supplies is a catalogue, not agency: nothing behind any of them acts outside the page."),
    # --- the ordinary condition of the field (75 is the keeper) ---
    (85,
     "Provenance usually cannot be established at all, which is the ordinary condition of the field rather than anything scandalous.",
     "Provenance usually cannot be established at all. That is the ordinary state of the field, not a scandal."),
    (179,
     "Often you cannot, and that describes the ordinary condition of the field rather than a personal failure.",
     "Often you cannot, and that is the ordinary state of the field rather than a personal failing."),
    # --- Austin Osman Spare's 1904 work (9 is the keeper) ---
    (50,
     "The technique of reducing a statement of intent to a glyph is documented in Austin Osman Spare's 1904 work, and it spread through the material that followed him rather than through any formal body of teaching.",
     "Austin Osman Spare's 1904 work is where the technique of reducing a statement of intent to a glyph is first documented, and it spread through the material that followed him rather than through any formal body of teaching."),
    (190,
     "The method is documented in Austin Osman Spare's 1904 work.",
     "Documentation of the method sits in Austin Osman Spare's 1904 work."),
    # --- for reasons that have nothing to do with (84 is the keeper) ---
    (147,
     "Occasionally the frame will be right for reasons that have nothing to do with the frame, which is no argument against using it.",
     "Sometimes the frame will be right for reasons unconnected to the frame itself, which is still no argument against using it."),
    (185,
     "Use length as the first filter here. Most of the long books in this category are long for reasons that have nothing to do with the material being any good.",
     "Use length as the first filter here. Most of the long books in this category run long for reasons unconnected to whether the material is any good."),
    # --- oldest surviving fragments of Jewish apocalyptic literature (85 is the keeper) ---
    (106,
     "Among the oldest surviving fragments of Jewish apocalyptic literature sits the Book of Enoch.",
     "The Book of Enoch belongs to the oldest surviving fragments of Jewish apocalyptic writing."),
    (156,
     "The oldest surviving fragments of Jewish apocalyptic literature include the Book of Enoch.",
     "The Book of Enoch is one of the earliest surviving pieces of Jewish apocalyptic literature."),
]


def main() -> None:
    applied = 0
    problems: list[str] = []
    by_file: dict[int, int] = {}
    for n, old, new in EDITS:
        path = CONTENT / f"{n}.json"
        raw = path.read_text(encoding="utf-8")
        count = raw.count(old)
        if count == 0:
            problems.append(f"n={n}: old text not found -> {old[:70]!r}")
            continue
        path.write_text(raw.replace(old, new), encoding="utf-8")
        json.loads(path.read_text(encoding="utf-8"))  # fail loudly on a bad write
        applied += 1
        by_file[n] = by_file.get(n, 0) + 1
        if count > 1:
            print(f"note n={n}: old text occurred {count}x, all replaced")

    print(f"applied {applied}/{len(EDITS)} edits across {len(by_file)} files")
    for n in sorted(by_file):
        print(f"  n={n:>4}  {by_file[n]}")
    if problems:
        print(f"\nPROBLEMS ({len(problems)}):")
        for p in problems:
            print(f"  {p}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
