# -*- coding: utf-8 -*-
"""S6.5: insert 'verified_by' key into ESP/lucid article dicts (A83,A84,A85,A119,A121,A122,A128)."""
import re

# stat/source rows per article (apostrophe-free strings; rendered via verified_by_block)
DATA = {
    "article_83.py": [
        ("Feedback sharpens ESP test scores", "Training studies, 1950s-present"),
        ("No reliable repeatable proof yet", "Parapsychology literature review"),
        ("Consistent scores over hundreds of runs matter", "Rhine protocols"),
    ],
    "article_84.py": [
        ("Hunches are rapid nonconscious processing", "Cognitive psychology"),
        ("Habit logging improves hunch accuracy", "Decision-making research"),
        ("Talent is trainable, not fixed", "Skill acquisition studies"),
    ],
    "article_85.py": [
        ("Dreams help solve problems", "Barrett, The Committee of Sleep (2001)"),
        ("Lucid dreaming trains in weeks", "Stumbrys, Erlacher and Schredl (2016)"),
    ],
    "article_119.py": [
        ("Lucid dreaming is a natural REM state", "Sleep research"),
        ("Lucid dreaming is trainable and safe", "Voss et al., Frontiers (2014)"),
    ],
    "article_121.py": [
        ("One-in-five chance per card", "Zener protocol, 1933"),
        ("Five of twenty-five hits expected", "Rhine, Extra-Sensory Perception (1934)"),
    ],
    "article_122.py": [
        ("p below 0.05 marks significance", "Standard statistics"),
        ("Small but consistent meta-analytic effect", "Utts, Statistical Science (1991)"),
    ],
    "article_128.py": [
        ("About 55 percent of people ever lucid dream", "Saunders et al. (2016)"),
        ("About 23 percent monthly, 11 percent weekly", "Saunders et al. (2016)"),
        ("Journaling is the strongest predictor", "Sleep research"),
    ],
}


def to_py(rows):
    items = ",\n".join(
        "        ({!r}, {!r})".format(s, src) for s, src in rows
    )
    return (
        "    'verified_by': [\n"
        + items
        + ",\n    ],\n"
    )


for fname, rows in DATA.items():
    path = "scripts/" + fname
    with open(path, "r", encoding="utf-8") as fh:
        content = fh.read()
    if "verified_by" in content:
        print(f"{fname}: SKIP (already has verified_by)")
        continue
    # faq is the last dict key; its list closes with "\n    ],\n}" (trailing comma) then dict "}"
    idx = content.rfind("\n    ],\n}")
    if idx == -1:
        print(f"{fname}: FAIL (faq close not found)")
        continue
    new = content[: idx + len("\n    ]\n")] + to_py(rows) + "}"
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(new)
    print(f"{fname}: OK inserted {len(rows)} rows")