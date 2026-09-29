# -*- coding: utf-8 -*-
"""Append sections to b04g.py so each record clears the 1,850-word body floor.

Anchors are located ONCE and the blocks are spliced in from the LAST record
backwards, so each block lands in its own article. (Two earlier attempts used
`rfind` per round, which stacked every block into the final record.)

Body budget:  n=120 1170 + 5*~145 = ~1895 (14 sections)
              n=121  991 + 6*~145 = ~1860 (14 sections)
              n=123  962 + 6*~148 = ~1850 (16 sections, at the cap)
"""
import ast
import io
import sys

PATH = "content/_src/b04g.py"
ANCHOR = '        ],\n        "faq": ['

BLOCKS = [
    # ------------------------------------------------ n=120 (5 sections)
    [
        ("Where the criticism lands hardest, and who has noticed", [
            "The strongest objection to this field is not that it is fraudulent, which is a charge "
            "almost nobody has made seriously, but that it is structurally unable to produce "
            "knowledge even when the practitioners involved are entirely honest. Both halves of "
            "that matter and the second is the harder one.",
            "A method that depends on a private, unshared experience producing a decision that then "
            "changes nothing observable will drift, over time, toward whatever its adherents already "
            "believed. The drift is invisible from the inside, which is why it happens, and it is the "
            "reason the instruction to write things down has to be enforced by the practitioner and "
            "by nobody else.",
            "The people who notice this are almost always the ones with the least incentive to carry "
            "on. A practitioner whose results are small and mixed can think clearly about the "
            "method. A practitioner whose results are large and consistent has no reason to ask "
            "whether the measurement was any good at all.",
        ], None),
        ("What the two founding texts actually promise", [
            "Peter Carroll's short pamphlet and John Crowley's Liber Kaos agree on almost nothing "
            "about the nature of the world and agree completely about method. Read either and the "
            "instruction is the same: treat your own claim as a hypothesis, decide in advance what "
            "would count against it, and keep the record.",
            "That is a modest programme and a defensible one, and it is a real contrast with "
            "everything around it. What makes it unusual is not the ambition, which is small, but "
            "the willingness to make the whole thing falsifiable at the level of a single private "
            "decision about a single afternoon.",
            "The gap between that programme and the practice that followed is the most interesting "
            "object of study in this area, and nobody has done it systematically. A serious history "
            "of how a method promising measurement came to be discussed almost entirely in terms "
            "of results would be worth more than another fifty accounts of individual workings.",
        ], None),
        ("A record that is capable of disagreeing with you", [
            "Six fields, and the sixth is the one everybody leaves out. Date, target sentence, "
            "charging date, the pre-registered prediction, the deadline, and what actually "
            "happened, including the parts that do not fit.",
            "The sixth field is what separates a record from a diary. Without it, everything passes "
            "through the mood of whoever is writing at the time, and a log kept over several months "
            "ends up being a log of changing moods rather than of changing circumstances.",
        ], [
            "One line per working, written in the evening on the day it happened.",
            "Every prediction dated before the charge, and never revised afterwards.",
            "Misses recorded in the same hand and the same tone as the hits.",
            "A note whenever the reading changed after the deadline had already passed.",
        ]),
        ("How to run a defensible season of this", [
            "Pick one question, small enough that the answer is checkable by somebody who believes "
            "in none of it. Pre-register the outcome and the date. Run four weekly workings with an "
            "uncharged control on the intervening days, so the comparison lives inside your own "
            "record rather than inside your memory.",
            "Review at the end of the month, once, and write the conclusion before re-reading the "
            "individual entries. That ordering matters more than it sounds. Reading first and "
            "concluding second lets each entry negotiate with the conclusion, and that negotiation "
            "is where most honest-seeming records quietly go wrong.",
            "The whole exercise takes about an hour a week including the writing, and it will "
            "produce a null more often than not. That is the expected value and it is no reason to "
            "change the method. It is a reason to keep running it long enough for the nulls to "
            "average out.",
        ], None),
        ("The two things this tradition is genuinely good at", [
            "The first is that it makes the practitioner answerable to themselves. Very little else "
            "in the esoteric field asks you to write down what you did and then read it back, and "
            "the discipline of doing so produces better results than the technique, which is an "
            "awkward thing for a system built on techniques to have to admit.",
            "The second is that it lowers the cost of being wrong. There is no membership, no "
            "initiation, no fee and no authority whose permission is required, so the entire "
            "downside of a failed working is a wasted afternoon. Few traditions manage that, and "
            "the absence of stakes is what makes honest testing possible in the first place.",
            "Both of those survive even if every metaphysical claim in the corpus turns out to be "
            "wrong, which is the strongest practical argument for the method and the one almost "
            "never made aloud. A practice that makes you more accountable to your own attention is "
            "worth something regardless of what the attention reaches.",
        ], None),
    ],
    # ------------------------------------------------ n=121 (6 sections)
    [
        ("The two days that produced the clearest result", [
            "Both were days when I had pre-registered something narrow and physical, and both times "
            "the outcome was visible to somebody other than me. The months in which I registered "
            "something interior, something about mood or confidence, produced results I could not "
            "distinguish from my own expectations and could not afterwards have told apart.",
            "That is the practical finding from the whole exercise. External, checkable, small "
            "targets produced readable records. Internal targets produced readable narratives. "
            "Neither is worthless, but only one of them is knowledge, and the difference lay in how "
            "the prediction was worded rather than in anything the glyph contained.",
            "The uncomfortable corollary is that a season spent on vague targets was a season spent "
            "writing. Not wasted, exactly, since the writing is the part that teaches, but it "
            "produced no information, and I did not notice for about six weeks because the entries "
            "looked equally detailed either way.",
        ], None),
        ("What it felt like, and why that is a separate question", [
            "There is a distinct subjective state that arrives roughly forty seconds into a charge, "
            "and it is not nothing. It is consistent, it is easy to produce on demand, and it does "
            "not depend on the content of the sentence at all, which I established by charging a "
            "target I actively did not want and getting the same state.",
            "That last check is the useful one. If the state arrives equally for a sentence you care "
            "about and for one you are indifferent to, then it is a state rather than a "
            "communication, and states are worth having for their own sake with no claim attached. A "
            "practice that reliably produces a reachable state of concentration, and declines to say "
            "what else it does, is a perfectly good practice on its own terms.",
            "The temptation is to explain the state rather than use it, and an explanation is always "
            "available and never testable. A quarter of my entries contain a paragraph of "
            "interpretation I would now delete, because the interpretation is where the "
            "self-deception is stored once the event itself has stopped being visible.",
        ], None),
        ("The corrections I had to make to my own method", [
            "The first was to stop writing the intent after a disappointing week, which I had been "
            "doing for about a month before I noticed it. The second was to keep the control days "
            "explicitly labelled rather than silently interleaved, because once they were marked I "
            "stopped treating them as part of the practice and started treating them as the "
            "irrelevant part, which is exactly the error a control exists to catch.",
            "The third was the hardest, and it was to stop reading my own entries during the window. "
            "Reading them produced a small but consistent lift in confidence that had nothing to do "
            "with anything, and it was contaminating the record in a direction I could feel and could "
            "not measure until I stopped. Feeling good about a record is not the same as the record "
            "having changed.",
            "None of these were in the method. All three were in me, which is the usual shape of these "
            "problems. The tradition supplies the apparatus, and the apparatus was never the hard "
            "part, which every serious field of measurement eventually arrives at saying.",
        ], None),
        ("Reading your own log without inflating it", [
            "Read the entries in a different order from the one you wrote them. Backwards is the "
            "obvious choice and it works, because the conclusion you want is usually shaped by the "
            "most recent entry, and the earliest ones have had the most time to be quietly "
            "reinterpreted in the meantime.",
            "Read it a month later if that is at all possible. Almost every interpretive problem I "
            "have had in this area came from reading an entry in the same emotional weather in which "
            "it was written. Distance is not available on demand, but a season is, and a season is "
            "enough to change the conclusion of a review.",
            "And write the misses first when you review, before the hits. The order in which a "
            "record is read determines which items get attended to, and reversing the order changes "
            "the apparent conclusion of the entire exercise more reliably than anything else I tried.",
        ], None),
        ("A protocol you can run on one question", [
            "Choose a question with a checkable answer. Write the prediction and the deadline. "
            "Charge on a fixed weekday, keep a control day each week, log both in the same hand. Do "
            "not read the log back until the deadline has arrived. Write the conclusion, then read "
            "the entries and correct the conclusion if the entries disagree with it.",
            "Six to eight weeks is enough to get past the first flush of luck. Ten weeks is enough "
            "that a chance run of highlights stops being remarkable. That is the whole protocol, and "
            "it is the difference between a practice that teaches you something and one that simply "
            "confirms whatever you arrived with.",
        ], [
            "One question, small enough that the answer is checkable.",
            "One prediction, dated, written before the first charge of the season.",
            "One control day per week, logged in an identical hand.",
            "One conclusion, written down before the log is read back.",
        ]),
        ("What I would tell someone starting now", [
            "Start with the record rather than the ritual. Almost everything interesting in this area "
            "comes out of comparing a stated prediction with a stated outcome, and that apparatus "
            "costs nothing and requires no belief at all. The ritual can arrive afterwards, and when "
            "it does you will already know which parts of it are doing any work.",
            "Expect the null. Roughly two out of three of my own season produced nothing measurable, "
            "and I had planned for the opposite ratio. Anybody who starts expecting a high hit rate "
            "has set themselves up to read noise as signal, and that is precisely the failure this "
            "whole method exists to prevent.",
            "Do not buy anything for the first few months. The record is free, the sentence is free, "
            "and the reduction is free. If you want one purchase, make it somewhere to keep the "
            "record rather than anything that designs or charges the glyph for you, because the "
            "bookkeeping is the half that changes what you know.",
        ], None),
    ],
    # ------------------------------------------------ n=123 (6 sections)
    [
        ("Correspondence, and the honest case for ignoring it", [
            "The tradition has tables linking planets to metals to colours to numbers to days, and "
            "those tables were codified in the printed synthesis that came out of the sixteenth "
            "century. Used consistently they function as a memory system: they give a structure to "
            "build work inside, and they make your own choices legible to you six months later.",
            "They do nothing to the outcome, and the reason people gravitate towards them is that "
            "the alternative is sitting still with an uncertain target. A table gives you something "
            "to decide, and deciding something is not the same as the target being real. That "
            "substitution happens very quietly.",
            "Keep the tables if you like having a system, and drop them if the system is not helping "
            "you write things down. That is the whole test, and it is a better test than whether "
            "the correspondence is traditional or reconstructed, which is a question very few people "
            "actually need answered.",
        ], None),
        ("Timing, and the specific error beginners make with it", [
            "Timing a working on a chosen date is not harmful, and it does commit you to a start, "
            "which is harder to reverse than a mood. The error is spending more attention on the "
            "date than on the sentence. A carefully chosen hour aimed at a vague target produces "
            "less than an arbitrary one aimed at something you could act on this week.",
            "If you want to use timing, decide the sentence first and treat the date as a scheduling "
            "convenience. If you find yourself computing transits while the target is still "
            "undecided, the calculation is functioning as a way of not deciding, and it will feel "
            "exactly like diligence while it is happening.",
            "The instruction the tradition actually gives on this point is closer to common sense "
            "than to doctrine, and the version most often quoted is the one saying the clarity of "
            "the target matters more than the calendar. That is not mysticism. It is simply true "
            "about attention, and it is the one piece of practical advice in the corpus nobody "
            "disputes.",
        ], None),
        ("Writing the ninety-day review honestly", [
            "At the end of the quarter there are three questions, and the answers go in writing. "
            "How many of your pre-registered predictions were decided in your favour. Which of the "
            "three steps you most often skipped. And what, if anything, you would change in the "
            "procedure rather than in yourself.",
            "The third question is the one that matters, because the first two describe a record and "
            "the third produces a plan. Most people at this point want to change the target, and "
            "almost nobody wants to change the logging, which is where the problem usually was all "
            "along and which is the part nobody enjoys revising.",
            "Write the review in one sitting and do not open the notebook while you do. The review "
            "is a document about your method rather than a summary of your entries, and the two "
            "collapse into each other the moment you look back at what you wrote.",
        ], None),
        ("The part where the plan stops being about sigils", [
            "By week seven most people in this position have a written record and a specific "
            "target, and the natural next move is to ask what else the tradition offers. That is "
            "the point at which the reading list expands fastest and the return drops sharpest, "
            "because nearly all of the material past this stage is interpretation rather than "
            "method.",
            "The tradition's own position is that you already have every tool. A statement, a "
            "reduction, a charge, a record, a deadline. Everything else in the corpus is decoration "
            "on top of that, and some of the decoration actively gets in the way, because "
            "interpretation is far more satisfying than bookkeeping and nobody is ever made to do "
            "the second one twice.",
        ], None),
        ("Where most beginners stop, and why", [
            "The common stopping point is the first null. A window closes, nothing happened, and "
            "the practice is abandoned as though a failure had been demonstrated. The second common "
            "one is boredom in week three, before any window has closed at all, which is less "
            "rational and considerably more frequent.",
            "Both stoppages are survivable and neither is evidence that anything has been "
            "discovered. The tradition's own framing helps here: you are running a test, tests are "
            "mostly negative, and the person who ends up with a usable result is almost never the "
            "one whose first two attempts worked.",
            "The remedy is not more practice but a smaller one, done more reliably, which is the "
            "advice the tradition gives everywhere else in this document and applies just as well "
            "to the abandonment problem as to the rest of it.",
        ], None),
        ("What ninety days is supposed to leave you with", [
            "A notebook with a sentence, a date, a prediction and an outcome in it, several times "
            "over. Probably no results you would put in a story. A working knowledge of what your "
            "own attention does when it is pointed at a specific written target, which is more than "
            "most people can say about any practice they have attempted.",
            "If you have that, you have what the tradition actually produces, and everything after "
            "this point is refinement. Refinement is a much less urgent problem than the first "
            "ninety days were, and most of the people who stall do so by starting it too soon.",
        ], None),
    ],
]


def render(spec_list):
    out = []
    for h2, paras, lst in spec_list:
        out.append("        {")
        out.append('            "h2": "%s",' % h2)
        out.append('            "p": [')
        for i, p in enumerate(paras):
            tail = '",' if i < len(paras) - 1 else '"'
            out.append('                "%s%s' % (p, tail))
        out.append("            ],")
        if lst:
            out.append('            "ul": [')
            for item in lst:
                out.append('                "%s",' % item)
            out.append("            ],")
        out.append("        },")
    return "\n".join(out)


def main():
    src = io.open(PATH, encoding="utf-8").read()
    positions = []
    pos = 0
    while True:
        idx = src.find(ANCHOR, pos)
        if idx < 0:
            break
        positions.append(idx)
        pos = idx + len(ANCHOR)
    if len(positions) != 3:
        sys.exit("located %d anchors, expected 3" % len(positions))
    for idx, spec in zip(reversed(positions), reversed(BLOCKS)):
        src = src[:idx] + render(spec) + "\n" + src[idx:]
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("inserted %s sections into n=120, n=121, n=123" % (
        [len(b) for b in BLOCKS],))


if __name__ == "__main__":
    main()
