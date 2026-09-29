# -*- coding: utf-8 -*-
"""Boost b05a.py records to the 1,850+ body-word floor.

Anchors are located ONCE and spliced in from the LAST record backwards, so
each block lands in its own article.
"""
import ast
import io
import sys

PATH = "content/_src/b05a.py"
ANCHOR = '        ],\n        "faq": ['

BLOCKS = [
    [
        ("The interface problem, stated plainly", [
            "Every application of this practice depends on somebody having built an interface, and "
            "the interface will have a purpose that is not yours. Products are designed for "
            "retention, and a tool that helps you finish with it is a commercially awkward object.",
            "The practical consequence is that the most polished tool in this space is likely to be "
            "the one least suited to a practice whose whole point is to produce a conclusion and "
            "move on. Judge any of them by whether it makes leaving easy, which is the one property "
            "that no retention-minded product will offer you.",
        ], [
            "Can the whole record be exported in a format you can still read?",
            "Does the tool make it easy to stop, or easy to continue?",
            "Is anything in the interface optimising for time-on-app?",
        ]),
        ("The three failures nobody publishes", [
            "Platform drift is the first. A practice that depends on a specific app's behaviour is "
            "one product decision away from not working, and no amount of commitment survives a "
            "changed interface. The people who still have ten-year records are the ones who wrote "
            "in a notebook.",
            "Account capture is the second. The moment a practice needs a login it has a business "
            "model, and business models eventually aim at people who have already committed, which "
            "is an unpleasant thing to have happen to something you were doing for your own sake. "
            "The third is the drift of the claim itself, where a metaphor about networks hardens "
            "into a statement about reality and nobody notices the transition because it happened "
            "gradually in conversation.",
        ], None),
        ("What the cryptography does and does not give you", [
            "The compression analogy is exact and worth keeping: a long statement becomes a short "
            "glyph that means it, and anyone who can invert the reduction recovers the statement. "
            "That is a real structural parallel to what the practitioner is doing, and it is the "
            "reason the sigil tradition works as well as it does.",
            "The signature analogy is the one that fails under load, because a cryptographic "
            "signature is verified mechanically and a sigilised intention is verified by nobody. "
            "Any tradition that leans on the signature image has to handle that asymmetry "
            "honestly, and most of the material does not.",
        ], None),
        ("A small experiment nobody has run", [
            "Take one pre-registered target. Charge a screen-rendered sigil for it on one schedule. "
            "Charge a hand-drawn sigil for an equivalent target on an interleaved schedule. Log "
            "both blind, so you cannot tell them apart when you write the entries.",
            "It takes a season and a notebook. It would settle a question this field has argued "
            "about for three decades, and the reason it has not been done is the reason the nulls "
            "in every corner of this area have not been published: the result is likely to be "
            "uninteresting and the conversation afterwards will be about anything else.",
        ], None),
    ],
    [
        ("What the clinical literature actually contributes", [
            "Three findings, and they are the transferable part. Set and setting dominate the "
            "valence of an altered state, which is the strongest and most replicated result in the "
            "area. Integration predicts better outcomes, which is the most useful piece of advice. "
            "And expectation shapes reported experience, which is a genuine effect with a clean "
            "boundary.",
            "Everything else that gets called psychonautic practice is imported from somewhere "
            "else and rarely arrives with its caveats attached. That is the pattern to watch for in "
            "any field that borrows heavily from a clinical one, and it is not unique to this one.",
        ], None),
        ("Why high intensity is the wrong first move", [
            "The argument is about information, not safety. A mild method run for an hour produces "
            "a result you can describe afterwards, which means it can be logged, compared and "
            "repeated. A severe method produces something usually described as ineffable, which "
            "cannot be logged and therefore contributes nothing to anything.",
            "It also produces a worse escalation curve, because the disappointment after a severe "
            "experience is what drives somebody to go further, and the same failure mode shows up "
            "in a dozen areas where the reward is intermittent. The pattern is worth recognising "
            "early rather than after the fact.",
        ], [
            "Start with the least intense method that still produces something.",
            "Have a partner who knows what is happening in the room.",
            "Decide the stopping rule before the session rather than during it.",
        ]),
        ("The harm that is not physical", [
            "Physical risk is the easy part and it is well understood. The harder risk is "
            "interpretive: a state in which ordinary categories stop holding can produce a "
            "conclusion that is genuinely felt to be knowledge, and that conclusion can then govern "
            "behaviour for months afterwards.",
            "This is where the field is most careless, because the conclusion is usually not a claim "
            "about anything testable. Nobody can disprove an ineffable experience, which is exactly "
            "why it is dangerous: unfalsifiable conclusions still get acted on. The remedy is the "
            "one above, defer the interpretation and return to ordinary tasks.",
        ], None),
        ("A first month, described as it usually happens", [
            "Week one, journal and a short dream practice, with a partner informed about what you "
            "are doing. Week two, keep the record and add nothing. Week three, notice what you "
            "actually wrote rather than what you remember writing.",
            "Week four, read the entries backwards and write down the version you would have given "
            "at the start of the month. The distance between those two accounts is the honest "
            "measure of how much interpretation is doing, and it is available to anybody willing to "
            "look.",
        ], None),
    ],
    [
        ("Belief as a number rather than a position", [
            "The most useful move in the whole area is to treat your credence in a particular "
            "working as a quantity you could write down and revise, rather than as an identity you "
            "have. Almost nobody does this, including people who are careful about everything else.",
            "Try it once. Before a working, write how likely you think the outcome is. After the "
            "deadline, write it again. Most people find the first number was much higher than the "
            "evidence warrants and the second much higher than the first, and finding that out "
            "once is usually more persuasive than any argument anybody can make.",
        ], [
            "What is my credence in this specific outcome, as a percentage?",
            "What would move it by ten points in either direction?",
            "Who else would have to agree before I changed it?",
        ]),
        ("Where the strong sceptic position fails", [
            "The confident version argues that practising requires believing, which is false in the "
            "technical sense and confuses a provisional commitment with a closed position. Having "
            "made that move, the position never has to look at results at all, which is why it is "
            "so common and so rarely examined.",
            "The opposite failure belongs to some practitioners, who treat a provisional working "
            "commitment as a permanent one and then read everything afterwards as confirmation. "
            "Both errors have the same shape: a decision about how to interpret a result is made "
            "before the result exists, which is precisely what a test is supposed to prevent.",
        ], None),
        ("The season, laid out as a schedule", [
            "Four months, one question at a time, nothing larger than a single afternoon's work. "
            "Each block is four weekly workings with an interleaved uncharged control, a written "
            "prediction, a fixed deadline, and one review at the end of the block.",
            "The reviews are the whole point. Read the entries before writing the conclusion and "
            "you will get a different and slightly worse answer, and doing both in that order for "
            "one block is enough to show anybody what the record is actually saying.",
        ], None),
        ("What the field has never done", [
            "There is no published body of pre-registered trials in this area. Not a small one, not "
            "a bad one: none. Practitioners run workings, sometimes keep notes, and almost never "
            "publish the notes, which means the entire accumulated experience of the field exists "
            "as anecdote distributed informally and never aggregated.",
            "That is fixable at the level of one person, which is the level this page is written "
            "for. It is not fixable by argument, because there is no body of evidence to argue "
            "from. A season of your own careful record would add more to what is known than any "
            "amount of further reading, and it costs about twenty minutes a week.",
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
        if lst:
            out.append('            "ul": [')
            for it in lst:
                out.append('                "%s",' % it)
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
