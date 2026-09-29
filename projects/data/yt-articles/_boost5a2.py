# -*- coding: utf-8 -*-
"""Second boost pass for b05a.py: lift n=131, 132, 134 over 1,850 body words."""
import ast
import io
import sys

PATH = "content/_src/b05a.py"
ANCHOR = '        ],\n        "faq": ['

BLOCKS = [
    [
        ("What the movement actually was, historically", [
            "Technopaganism and the cybergoth scenes that carried the term into the nineties drew on "
            "chaos magic, industrial music and early hacker ethics at the same time, and all three "
            "of those had a DIY character that the term inherited. The practice was never going to "
            "be a lineage with a founding text, and it never was.",
            "That is worth stating plainly because the later literature often describes a "
            "continuous tradition where there was an interruption and a reinvention. Crowley wrote "
            "the essay, almost nobody read it, and the people who did use the word in the nineties "
            "were mostly borrowing the name and bringing their own content.",
        ], None),
        ("A season, laid out", [
            "One pre-registered target, four weekly workings, four interleaved uncharged controls, "
            "one log, one review at the end of the month. Screen for half the block, paper for the "
            "rest, and do not tell yourself which was which when you write the entries.",
            "The exercise is not going to produce a dramatic result. It will produce a number, and "
            "the number is worth more than any anecdote because it is the only thing in this field "
            "that anybody could ever aggregate.",
        ], None),
    ],
    [
        ("The escalation curve nobody charts", [
            "Disappointment after a severe experience is what drives somebody to go further, and the "
            "same shape shows up across a dozen areas where the reward is intermittent. The variable "
            "being rewarded is not intensity, it is the size of the discrepancy between expectation "
            "and result.",
            "Recognising the pattern early is worth more than any technique, because the pattern is "
            "invisible from inside it and obvious in description. If the response to a flat result "
            "is to increase the intensity, the process has stopped being an experiment.",
        ], None),
        ("What to write down afterwards, and when", [
            "Same day, before sleep, before conversation. Three questions: what happened, what did "
            "it feel like, and what would have counted as a result in advance. The third is the one "
            "that requires having written it down beforehand, and if you did not, the other two are "
            "a mood report.",
            "Then nothing for a week. No conclusions, no reading about what the experience meant, no "
            "decisions of consequence. Most of the damage from a difficult session happens in the "
            "hours afterwards and none of it happens during it.",
        ], None),
    ],
    [
        ("The practice that produces no information and is still worth doing", [
            "Receptive attention on a narrow, checkable target is dull and it works. Ninety seconds "
            "of sustained contact with a habitual reaction, counted and written down, produces a "
            "number about how often that reaction fires. That number is small, boring, entirely "
            "checkable, and available to nobody but you.",
            "It is also the only part of this area that a sceptic would not dispute, and it is not "
            "the part most people are looking for. Whatever else you take from a practice in this "
            "field, the trainable attention is the thing that survives contact with anybody else.",
        ], None),
        ("A review that can actually be defended", [
            "Read the entries before writing the conclusion and you will get a different and "
            "slightly worse answer. Do both in that order for one block and the gap between them is "
            "the honest measure of how much interpretation is doing, which is the number very few "
            "people in this field have ever computed about themselves.",
            "The whole schedule fits in twenty minutes a week. That is the part that should make "
            "you suspicious of anybody selling you a more elaborate apparatus: if the record cannot "
            "be kept in twenty minutes, it will not be kept, and a record that is not kept is not a "
            "record.",
        ], None),
    ],
]


def render(specs):
    out = []
    for h2, paras, lst in specs:
        out.append("        {")
        out.append('            "h2": "%s",' % h2)
        out.append('            "p": [')
        for i, p in enumerate(paras):
            out.append('                "%s%s' % (p, '",' if i < len(paras) - 1 else '"'))
        out.append("            ],")
        out.append("        },")
    return "\n".join(out)


def main():
    src = io.open(PATH, encoding="utf-8").read()
    pos, positions = 0, []
    while True:
        i = src.find(ANCHOR, pos)
        if i < 0:
            break
        positions.append(i)
        pos = i + len(ANCHOR)
    if len(positions) != 3:
        sys.exit("located %d anchors, expected 3" % len(positions))
    for idx, spec in zip(reversed(positions), reversed(BLOCKS)):
        src = src[:idx] + render(spec) + "\n" + src[idx:]
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("inserted %s sections" % [len(b) for b in BLOCKS])


if __name__ == "__main__":
    main()
