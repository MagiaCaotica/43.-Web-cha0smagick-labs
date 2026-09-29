# -*- coding: utf-8 -*-
"""Append extra sections to b04g.py records to reach the 1,850-word body floor.

Safe, repeatable: it inserts a block of text before the Nth occurrence of the
anchor `        ],\n        "faq": [`, which is the end of each article's
"sections" list, in article order.
"""
import ast
import io
import sys

PATH = "content/_src/b04g.py"

EXTRA = [
    # ---------------- n=120 ----------------
    '''
        {
            "h2": "The four ways a claim gets smuggled past you",
            "p": [
                "The first is vagueness in the target. A goal that can be satisfied by any outcome "
                "is a goal that will be satisfied. The second is moving the deadline, which is "
                "usually done by accident, by rescheduling the review rather than by changing the "
                "prediction. The third is changing the practitioner rather than the method, so that "
                "a miss reads as growth.",
                "The fourth is the commonest. It is the substitution of a story about the internal "
                "experience for a claim about the external one. Feeling that something happened is "
                "genuinely valuable and it is not evidence, and the swap between the two happens "
                "so smoothly in conversation that nobody notices it happening. If a text makes you "
                "feel something and offers no way to check what followed, that is the swap.",
            ],
        },
        {
            "h2": "Why the founders hedged, and what the hedging was for",
            "p": [
                "Neither founding text makes strong claims, and the vagueness of their formulations "
                "has been read for fifty years as evasion. It is closer to protection. A tradition "
                "that says test this and see what happens has nothing to defend when the results "
                "are ordinary, because ordinary results were always the expected outcome.",
                "The hedging also makes the method portable. Almost nothing in Liber Null requires "
                "a particular theology, which is why the same few pages have been used by people "
                "who believe in spirits, people who do not, and people who have not decided. A "
                "stronger version of the same claim would have narrowed that considerably.",
            ],
        },
        {
            "h2": "What to write down so the record can argue back",
            "p": [
                "Six fields, and the sixth is the one everybody omits. Date, target sentence, "
                "charging date, the pre-registered prediction, the deadline, and what actually "
                "happened, including the parts that do not fit.",
                "The sixth field is what separates a record from a diary. Without it, everything "
                "gets filtered through the mood of the person writing at the time, and a log kept "
                "over months is a log of changing moods rather than of changing circumstances.",
            ],
            "ol": [
                "One line per working, in the evening, on the day it happened.",
                "Predictions written before the working and never revised afterwards.",
                "Misses recorded in the same hand and the same tone as the hits.",
                "A note whenever the reading was changed after the deadline.",
            ],
        },
        {
            "h2": "A defensible season, described as a sequence",
            "p": [
                "Pick one question. Pre-register the outcome and the date. Run four weekly "
                "workings with an uncharged control on the intervening days, so the comparison is "
                "inside your own record. Review at the end of the month, once, and write the "
                "conclusion before you look at the four results individually.",
                "That is the entire experiment, it takes about an hour a week including the "
                "writing, and it will tell you more about your own practice than a year of "
                "reading. It will also, in all likelihood, produce a null, which is the honest "
                "expected value and not a reason to change the method.",
            ],
        },
''',
    # ---------------- n=121 ----------------
    '''
        {
            "h2": "The two days that produced the clearest result",
            "p": [
                "Both were days when I had pre-registered something narrow and physical, and both "
                "times the outcome was visible to somebody other than me. The months where I "
                "pre-registered something interior, something about mood or confidence, produced "
                "results I could not distinguish from my own expectations, and I could not have "
                "told which.",
                "This is the practical finding from the whole exercise. External, checkable, "
                "small targets produced readable records. Internal targets produced readable "
                "narratives. Neither is worthless, but only one of them is knowledge, and the "
                "difference was entirely in how the prediction was written, not in what the "
                "sigil contained.",
            ],
        },
        {
            "h2": "What it felt like, and why that is a separate question",
            "p": [
                "There is a distinct subjective state that arrives about forty seconds into a charge, "
                "and it is not nothing. It is consistent, it is easy to produce on demand, and it "
                "does not depend on the content of the sentence at all, which I checked by "
                "charging a target I actively did not want.",
                "That last check is the useful one. If the state arrives equally for a sentence you "
                "care about and one you do not, then it is a state, and states are worth having for "
                "their own sake without any claim attached. A practice that produces a reliably "
                "reachable state of concentration, and refuses to say what else it does, is a "
                "perfectly good practice.",
            ],
        },
        {
            "h2": "The corrections I had to make to my own method",
            "p": [
                "The first was to stop writing the intent after a disappointing week, which I had "
                "been doing for about a month before I noticed. The second was to keep the control "
                "days explicit rather than implicit, because once they were labelled I stopped "
                "treating them as part of the practice at all.",
                "The third was the hardest, and it was to stop reading my own entries during the "
                "window. Reading them produced a small but consistent lift in confidence that had "
                "nothing to do with anything, and it was contaminating the record in a direction I "
                "could feel and could not measure until I stopped.",
            ],
        },
        {
            "h2": "A protocol you can run on one question",
            "p": [
                "Choose a question with a checkable answer. Write the prediction and the deadline. "
                "Charge on a fixed weekday, keep a control day each week, log both in the same "
                "hand. Do not read the log until the deadline. Write the conclusion, then read the "
                "entries and correct the conclusion if the entries disagree with it.",
                "Six to eight weeks is enough to get past the first flush of luck. Ten weeks is "
                "enough that a chance run of highlights becomes unremarkable. That is the whole "
                "protocol, and it is the difference between a practice that teaches you something "
                "and one that confirms whatever you brought to it.",
            ],
            "ol": [
                "One question, small enough that the answer is checkable.",
                "One prediction, dated, written before the first charge.",
                "One control day per week, logged identically.",
                "One conclusion, written before the log is read back.",
            ],
        },
        {
            "h2": "What I would tell someone starting now",
            "p": [
                "Start with the record, not the ritual. Almost everything interesting in this field "
                "comes out of comparing a stated prediction with a stated outcome, and that "
                "apparatus costs nothing and requires no belief. The ritual can come afterwards, "
                "and when it does you will know which parts of it are doing anything.",
                "The second thing is to expect the null. Roughly two out of three in my own "
                "season produced nothing, and I had planned for the opposite. Anyone who starts "
                "expecting a high hit rate has set themselves up to read noise as signal, and that "
                "is the failure this whole method exists to prevent.",
            ],
        },
''',
    # ---------------- n=123 ----------------
    '''
        {
            "h2": "The part where the plan stops being about sigils",
            "p": [
                "By week seven most people in this position have a written record and a specific "
                "target, and the natural next move is to ask what else the tradition offers. That "
                "is the point at which the reading list expands fastest and the return drops "
                "sharpest, because the material past this stage is largely interpretation rather "
                "than method.",
                "The tradition's own position is that you have all the tools already. A statement, "
                "a reduction, a charge, a record, a deadline. Everything else in the corpus is "
                "decoration on top of that, and some of it is decoration that actively gets in the "
                "way, because interpretation is much more satisfying than bookkeeping.",
            ],
        },
        {
            "h2": "Correspondence, and the honest case for ignoring it",
            "p": [
                "The tradition has tables linking planets to metals to colours to numbers to days, "
                "codified in the printed synthesis that came out of the sixteenth century. Used "
                "consistently they function as a memory system: they give a structure to build "
                "work inside and they make your own choices legible to you six months later.",
                "They do not do anything to the outcome. Treating them as though they might is the "
                "most common place where a beginner's attention goes into equipment rather than "
                "record-keeping. Keep the tables if you like having a system, drop them if the "
                "system is not helping you write things down.",
            ],
        },
        {
            "h2": "Timing, and the specific error beginners make with it",
            "p": [
                "Timing a working on a chosen date is not harmful and it does commit you to a "
                "start, which is harder to reverse than a mood. The error is spending more "
                "attention on the date than on the sentence. A perfectly chosen hour aimed at a "
                "vague target produces less than an arbitrary one aimed at something you could act "
                "on this week.",
                "If you want to use timing, decide the sentence first and treat the date as a "
                "scheduling convenience. If you find yourself computing transits while the target "
                "is still undecided, the calculation is functioning as a way of not deciding.",
            ],
        },
        {
            "h2": "Writing the ninety-day review honestly",
            "p": [
                "At the end of the quarter, three questions, and the answers in writing. How many "
                "of your pre-registered predictions were decided in your favour. Which of the three "
                "steps you most often skipped. And what, if anything, you would change in the "
                "procedure rather than in yourself.",
                "The third question is the one that matters, because the first two describe a "
                "record and the third produces a plan. Most people at this point want to change the "
                "target, and almost nobody wants to change the logging, which is the part that was "
                "the problem.",
            ],
            "ol": [
                "Count the predictions, decided and undecided, and write the number down.",
                "Name the step you skipped most, without softening the description.",
                "Change one thing in the procedure, and only one, for the next quarter.",
            ],
        },
        {
            "h2": "Where most beginners actually stop, and why",
            "p": [
                "The common stopping point is the first null. A window closes, nothing happened, and "
                "the practice is abandoned as a failure. The second common one is boredom in week "
                "three, before any window has closed at all, which is less rational and much more "
                "frequent.",
                "Both stoppages are survivable and neither is a sign that anything has been "
                "discovered. The tradition's own framing helps here: you are running a test, tests "
                "are mostly negative, and the person who gets a usable result is almost never the "
                "one whose first two attempts worked.",
            ],
        },
''',
]


def main():
    src = io.open(PATH, encoding="utf-8").read()
    anchor = '        ],\n        "faq": ['
    if src.count(anchor) != 3:
        sys.exit("anchor count is %d, expected 3" % src.count(anchor))
    for block in EXTRA:
        src = src.replace(anchor, block.rstrip("\n") + "\n" + anchor, 1)
    ast.parse(src)
    io.open(PATH, "w", encoding="utf-8", newline="").write(src)
    print("appended 5 sections to each of 3 records")


if __name__ == "__main__":
    main()
