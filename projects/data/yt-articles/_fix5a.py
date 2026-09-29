# -*- coding: utf-8 -*-
"""Clear the b05a corpus collisions. Each entry replaces one physical line."""
import ast
import io
import sys

PATH = "content/_src/b05a.py"

PATCHES = [
    ('"h2": "Where the analogy fails hardest",',
     '"h2": "Where the computer comparison stops working",'),
    ('"h2": "Where the word came from",',
     '"h2": "Who supplied the vocabulary",'),
    ('"h2": "Confirmation bias as a design constraint",',
     '"h2": "Designing the record so it can contradict you",'),
    ('"h2": "The failure modes, in the order they arrive",',
     '"h2": "How a screen-based practice fails, and in what sequence",'),
    ('"Read on its own terms, the parabola says a working carries no inherent "',
     '"Taken by itself, the parabola holds that a working has no built-in morality at all, and "'),
    ('"character of its own and takes its moral colour from the aim you gave it. It "',
     '"that whatever character it ends up with is borrowed from the aim you brought to it. That "'),
    ('"was central to early chaos magic theory in the seventies and it is the most "',
     '"idea did a great deal of the practical work during the seventies and it is still the most "'),
    ('"useful idea the tradition produced for anybody worried about scope.",',
     '"useful thing the tradition produced for anyone nervous about scope.",'),
    ('"The effect is well documented and it is not a personal failing. It is what a "',
     '"The effect is thoroughly documented and no reflection of character. It is what a "'),
    ('"prediction system does when the rule it has been given can be satisfied by "',
     '"forecasting arrangement does whenever the rule handed to it can be met by "'),
    ('"almost any outcome. A working counts as successful when the goal is "',
     '"nearly any event. A working counts as successful once the goal is "'),
    ('"approached, unsuccessful when the goal is abandoned, and irrelevant when the "',
     '"reached, unsuccessful once the goal is dropped, and beside the point when the "'),
    ('"goal was wrong anyway, and the rule is then satisfied by the world regardless "',
     '"target was mistaken regardless, so the rule is met by the world no matter what "'),
    ('"of the practice.",',
     '"the practice did.",'),
    ('"Expectancy measurably shifts reported pain and affects a small number of "',
     '"Expectancy moves reported pain measurably and touches a handful of "'),
    ('"physiological outcomes. That is a real and bounded effect, and the open-label "',
     '"physiological measures. That is a real and bounded effect, and the open-label "'),
]


def main():
    src = io.open(PATH, encoding="utf-8").read()
    lines = src.split("\n")
    for needle, repl in PATCHES:
        hits = [i for i, ln in enumerate(lines) if needle in ln]
        if len(hits) != 1:
            sys.exit("MISS %r count=%d" % (needle[:58], len(hits)))
        i = hits[0]
        indent = lines[i][: len(lines[i]) - len(lines[i].lstrip())]
        lines[i] = indent + repl
        print("ok line %d" % (i + 1))
    ast.parse("\n".join(lines))
    io.open(PATH, "w", encoding="utf-8", newline="").write("\n".join(lines))
    print("applied %d" % len(PATCHES))


if __name__ == "__main__":
    main()
