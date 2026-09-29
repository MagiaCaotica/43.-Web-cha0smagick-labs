# -*- coding: utf-8 -*-
"""Splice extra sections into b05b.py so each record clears ~1,850 body words.

Anchors are located ONCE and spliced from the LAST record backwards.
"""
import ast
import io
import sys

PATH = "content/_src/b05b.py"
ANCHOR = '        ],\n        "faq": ['

BLOCKS = [
    # ---------------- n=135 (7 sections) ----------------
    [
        ("What the four quarters are doing", [
            "Each quarter is given a name, a natural element and a direction, and the "
            "correspondence between them is old rather than arbitrary. East is air and the element "
            "that moves before anything else does, west is fire and the element that consumes. The "
            "archangels assigned to them are the ones whose traditional jurisdictions match those "
            "qualities.",
            "The two quarters that the abbreviated version keeps, east and west, are the two that "
            "carry the movement. A version with four is more symmetrical and considerably more "
            "pleasant to perform, and the difference is about that rather than about effect. Both "
            "are legitimate and the choice is aesthetic once you have understood the structure.",
        ], None),
        ("A first week, with something to recite", [
            "Learn the four quarter names on day one and the archangels on day three. Do the two "
            "movements on day two until they are automatic. On day five, say the whole thing out loud "
            "in a room, badly, and keep going to the end rather than stopping to correct yourself.",
            "The point of the week is that the words become boring. A banishing you have to think "
            "about is a performance and a performance has to be believed in. A banishing you can say "
            "while making tea is a piece of procedure, and procedure is what makes it reliable.",
        ], [
            "Day one: the four quarter names.",
            "Day two: the two movements, until they stop needing thought.",
            "Day three: the archangels and the elements.",
            "Day five: the whole thing aloud, in one room, without stopping.",
        ]),
        ("What the popular accounts get wrong", [
            "The most common account describes banishing as a fight, which requires an imagined "
            "opponent and therefore supplies one. The second most common describes it as a burst of "
            "power, which requires a belief about what power does and supplies that instead.",
            "Both accounts produce the same observable behaviour, which is why they persist: both "
            "involve arm movements, both involve words, and both are followed by a felt sense of "
            "something having been settled. The difference is invisible from the outside, which is "
            "why it is worth being deliberate about, and why the structural version is more robust "
            "even when the claim behind it is not.",
        ], None),
        ("Where banishing fits in a wider practice", [
            "In a practice that has more than one part to it, banishing belongs at the transitions: "
            "the end of a working, the start of a different kind of session, and the point at which "
            "you have finished with a space for a different purpose.",
            "It is not a substitute for any of the other three operations, and using it as one is the "
            "single most common reason people find it does not work for them. A cluttered room does "
            "not need a declaration of boundary, it needs a clean. A bad hour does not need an exit, "
            "it needs a floor. Reaching for the version you remember rather than the one you need is "
            "the mistake, and it is a mistake of vocabulary rather than of intention.",
        ], None),
        ("Boredom is the point, not a problem with it", [
            "The reaction most beginners have is that it feels like nothing, and that reaction is "
            "correct. A two-minute declaration with no emotional content is doing the same job a "
            "two-minute declaration with strong emotional content is doing, and it is doing it "
            "without the cost.",
            "Practices that are enjoyable tend to become practices that are performed when we feel "
            "like it, and practices that are boring become practices that are performed whether we "
            "feel like it or not. The second is what produces a practice that still exists in ten "
            "years. Nobody keeps a banishing because it felt good and everybody who has one kept it "
            "because it took two minutes.",
        ], None),
        ("Recording it, and what a record is for", [
            "One line: date, what you closed, and whether you left the space. The third field is the "
            "one that earns its keep, because the exit is the part that actually completes the "
            "boundary and the part that gets quietly dropped once a ritual is familiar enough to be "
            "done from memory.",
            "If you want to know whether it is doing anything, the record is the only way. My own "
            "experience over a year of doing it properly was that the sessions I closed cleanly were "
            "the ones I remembered later as finished, and the ones I skipped the exit on were not. "
            "That is a weak result and it is the one I have.",
        ], None),
        ("What to leave out, and for how long", [
            "Leave out the elaborate apparatus, the oils, the sigils, the tools with names. Leave out "
            "the invocations of other entities, which turns a boundary into a negotiation. Leave out "
            "anything that requires you to be angry, because anger is a state that will be hard to "
            "get out of afterwards and a boundary declared while angry is a boundary you may want to "
            "withdraw.",
            "Leave all of it out for the first year. The default position should be that you are "
            "doing the smallest version accurately, and that you are adding to it only when you can "
            "say what the addition is for. That is the whole reason this material is worth learning "
            "and most of the reason it is worth learning early.",
        ], None),
    ],
    # ---------------- n=136 (7 sections) ----------------
    [
        ("What the charge actually is, and why it is short", [
            "The traditional description of the charge is a focusing of attention on the statement "
            "of intent, and the traditional instruction is that it should be brief. The reason for "
            "the brevity is not economy, it is that a charge is an act with a shape rather than a "
            "state to be achieved.",
            "Most people who extend it are trying to feel something particular, which is a different "
            "activity that happens to involve the same objects. The act of reducing a sentence, of "
            "drawing it, of speaking it once and putting it away is the whole of the method, and "
            "everything after that is repetition dressed as progress.",
        ], None),
        ("Reduction methods, and why the choice matters less than it looks", [
            "The standard method drops vowels and keeps consonants. There are variants that also fold "
            "letters together, and some that begin from the letters of the statement in a fixed order "
            "such as first and last. The documented method comes from Spare's 1904 Book of Gates.",
            "The choice changes the glyph and not much else. What matters is that you use one "
            "consistently, because a record that mixes methods cannot be compared across entries, and "
            "comparison across entries is the only reason to keep a reduction log at all.",
        ], [
            "The standard method: vowels out, consonants kept, arranged by hand.",
            "Letter folding, for those who prefer a more compact result.",
            "First-and-last letter methods, which produce a different shape from the same sentence.",
            "A drawing layer on top, which changes nothing and satisfies something.",
        ]),
        ("The dismissal, which is the part that gets skipped", [
            "After the charge you dismiss. The action is deliberate and it should feel like an end "
            "rather than a release, because the object has been declared and is no longer in "
            "relationship with you. People who skip it tend to report the sigil as unfinished, which "
            "is usually an accurate description of what happened.",
            "The physical move that reinforces it is putting the object somewhere you cannot reach "
            "it from, ideally out of the room. That is the mechanism behind the traditional advice "
            "about not carrying a charged sigil on your person, and it is a piece of attention "
            "hygiene rather than a superstition.",
        ], None),
        ("Timing, and the honest version of the advice", [
            "The tradition's guidance is that clarity of target beats accuracy of calendar, and the "
            "practical reason is that the effort spent computing a date is effort not spent making "
            "the sentence specific. A perfect hour on a vague aim produces less than an arbitrary one "
            "on something you could act on this week.",
            "If you want to work with timing anyway, fix the sentence first and choose the date "
            "afterwards, treating it as a useful commitment device rather than as a cause. The moment "
            "you start computing transits before the target is decided, the calculation has become a "
            "way of not deciding, and it will feel exactly like diligence while it happens.",
        ], None),
        ("A record that would survive an audit", [
            "Six fields, and the sixth is the one that is always left out. Date, sentence, reduction, "
            "charge date, pre-registered prediction, deadline, and then what actually happened, "
            "including anything that does not fit.",
            "If the prediction is not written before the charge it is not a prediction. If the "
            "deadline is not fixed in advance it will move, and it will move without your noticing, "
            "which is the single most common way an honest-seeming log turns into a flattering one. "
            "Write both on the same page as the sentence and sign the page with the date.",
        ], None),
        ("What a season of this is supposed to produce", [
            "Mostly nulls. Two or three attempts out of ten produce a result you would defend, and "
            "most of those are cases where the target was a small, dated, externally checkable thing "
            "that you already had a reason to act on.",
            "The reliable result is behavioural. A written statement of intent with a date in it is a "
            "different psychological object from an unstated hope, and having to produce one "
            "changes what you then do with your week. That is a real effect and it is not the one the "
            "marketing usually claims, and it is enough to justify the whole apparatus.",
        ], None),
        ("How to know when to stop", [
            "Stop when the record stops producing information, which happens when you start running "
            "the same target repeatedly, or when the practice has started displacing the ordinary "
            "decisions it was meant to support. Neither of those is a failure of the method and both "
            "are reasons to change what you are doing rather than to intensify.",
            "The tradition's own position is a short daily practice rather than an escalating one, "
            "and that is a piece of practical advice about attention rather than a mystical "
            "preference. People who escalate are usually trying to force a result, and the escalation "
            "produces more effort rather than more information.",
        ], None),
    ],
    # ---------------- n=137 (6 sections) ----------------
    [
        ("Why seventy-two, and what the number does", [
            "The number is not arbitrary in the way that is often claimed. Early demonological "
            "material had grouped these beings into fixed sets, and the arrangement into threes "
            "reflects a structure in the earlier sources rather than an authorial flourish.",
            "The practical consequence is that a catalogue this size is not meant to be read "
            "straight through. It is meant to be indexed, and the index is the office. Anyone who "
            "has read all seventy-two entries has done something nobody designed the text for and "
            "has probably retained less than the person who read the four that matched their problem.",
        ], None),
        ("A selection procedure that does not depend on memory", [
            "Write your question down in one line. Then read only the office line of each entry, "
            "not the description, and mark the ones whose domain contains a word from the question. "
            "Then read the descriptions of those, and only those, in full.",
            "This is a fifteen-minute procedure and it will produce a better selection than an hour "
            "of reading summaries, because it separates the two jobs. The office line is for "
            "selection and the description is for understanding, and mixing them is what produces a "
            "dramatic entity chosen for a domestic question.",
        ], [
            "One line, in your own words, stating the actual problem.",
            "Read office lines only, and mark the domain matches.",
            "Read the full entries for the marks, and no others.",
            "Choose one, and write why in a sentence before you begin.",
        ]),
        ("The seal, and why it is worth making even if you are sceptical", [
            "A seal does a small, concrete job. It fixes a name in a form that cannot be read aloud "
            "in a corridor, which means any contact with it is deliberate, and it gives you an object "
            "that can be placed, moved and put away rather than a possibility you have to keep "
            "generating.",
            "Making one also forces you through the whole sequence once, which is the actual training "
            "value. People who skip the seal and jump to the invocation are skipping the part that "
            "teaches them whether they meant it.",
        ], None),
        ("What to write, and when", [
            "Date, the name, the office you selected it for, your question in your own words, and "
            "what happened. Written on the day, before you have decided what it meant.",
            "The order matters in one specific way. The summary comes last, and writing it first is "
            "the mechanism behind nearly every account of an entity contact that produced a "
            "narrative rather than an event. Decide the question first, do the work, and only then "
            "say what you think happened.",
        ], None),
        ("The distinction that keeps this defensible", [
            "There is a version of this practice that requires you to believe an entity is external "
            "and autonomous, and a version in which the name is a description of a pattern you work "
            "on yourself. The first makes a set of claims that cannot be supported. The second "
            "requires no belief at all and produces most of the same practical results.",
            "That is not a compromise or a fudge. It is the reading the tradition's own most "
            "influential modern writer argued for, and it has the advantage that the classical "
            "office structure still does its job, because the office tells you what pattern you have "
            "picked whether or not you think the pattern has a mind attached to it.",
        ], None),
        ("When it is time to stop, and what to do instead", [
            "Stop when you notice that you are defending the name rather than testing it, when you "
            "have started avoiding the log, or when the practice has quietly become about your "
            "standing in a scene rather than about the question you started with.",
            "None of those is dramatic and all three are reversible, which is the good news. The "
            "correction in each case is the same: go back to a single plain question, use a name "
            "you have never worked with, and write the entry the same day. If that produces nothing, "
            "it will have told you something the accumulating list could not.",
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
    print("inserted %s sections into n=135, n=136, n=137" % [len(b) for b in BLOCKS])


if __name__ == "__main__":
    main()
