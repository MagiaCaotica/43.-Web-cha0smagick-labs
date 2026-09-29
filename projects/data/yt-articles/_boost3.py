# -*- coding: utf-8 -*-
"""Append sections to b04h.py so each record clears the 1,850-word body floor.

Anchors are located ONCE and spliced in from the LAST record backwards, so
each block lands in its own article.

Body budget:  n=124 1031 + 6*~150 = ~1930 (15 sections)
              n=125  972 + 7*~150 = ~2020 (16 sections, at the cap)
              n=126 1006 + 6*~150 = ~1905 (15 sections)
"""
import ast
import io
import sys

PATH = "content/_src/b04h.py"
ANCHOR = '        ],\n        "faq": ['

BLOCKS = [
    # ------------------------------------------------ n=124 (6 sections)
    [
        ("What the word is not for", [
            "Three things get called gnosis that are not it. A vivid experience you cannot describe "
            "at the time is not gnosis. A state of calm or absorption is not gnosis unless what you "
            "are doing while in it is sustained contact with something specific. And a conclusion "
            "you reached by thinking hard is not gnosis, however true it turns out to be.",
            "The confusion costs a beginner real time, because the three are experienced similarly "
            "and the three demand completely different amounts of discipline. A person chasing the "
            "first is chasing something that will not arrive on demand. A person chasing the second "
            "is practising attention without an object. A person chasing the third is doing ordinary "
            "reasoning and calling it something else.",
        ], None),
        ("A short history of the term being misapplied", [
            "Gnosis carries the older religious sense of knowledge that is participatory rather than "
            "propositional, and in that sense the word predates the movement entirely. What happened "
            "in the seventies is that a term with a long contemplative history got attached to a "
            "method that is closer to observation than to contemplation, and the two meanings have "
            "been running together ever since.",
            "The practical result is that a beginner can read a serious text, get a technique out of "
            "it that is not the technique described, and have no way of noticing for several months. "
            "The fix is unglamorous. When a text uses the word, find out which of the two senses it "
            "is using before you take anything from the passage.",
        ], None),
        ("How long the attention can actually be held", [
            "For most people, receptive attention on one object survives about ninety seconds before "
            "narration takes over. This is not a deficit and it is not improved by effort in the "
            "moment. It improves by repeated exposure, and the repetition is boring, which is why so "
            "few people do it.",
            "A useful way to train is to count. Sit with one ordinary object, a cup, a window frame, "
            "and count the number of times you notice yourself narrating. On the first day the "
            "number will be high and the exercise will feel pointless. On the tenth day the count "
            "falls. The count is the practice, because it converts an invisible lapse into a number "
            "you can watch go down.",
        ], [
            "Ninety seconds is a normal first session, not a failure.",
            "Counting returns is more useful than judging the quality of attention.",
            "The same object each day trains more than a new object every day.",
        ]),
        ("What a Bayesian approach looks like in practice", [
            "Keeping a record and updating on disconfirming evidence is entirely compatible with a "
            "sincere occult commitment, and it improves reliability more than any other single "
            "change. Nobody in the field objects to it on metaphysical grounds, and a minority "
            "practise it deliberately, which is a revealing statistic.",
            "In practice it looks unglamorous. You keep a number, you set a date, and at the date "
            "you update whatever the number turned out to be rather than defending what you hoped. "
            "The part that requires character is not the recording. It is the update.",
        ], None),
        ("Where the practice genuinely helps", [
            "The narrow and defensible claim is about attention rather than about anything external. "
            "A sustained receptive capacity is useful for anything requiring you to stay with "
            "something you would rather leave, and that set of activities is larger than it first "
            "appears, from debugging a system to sitting with somebody who is upset.",
            "The broader claims are where the evidence thins out. Expectancy can make you more "
            "alert to a particular kind of thing and it can make you equally confident about a "
            "thing that is not there, and the record is the only instrument in the kit that "
            "distinguishes those two outcomes.",
        ], None),
        ("The line between sincerity and credulity", [
            "Sincerity is a commitment to following the process. Credulity is a conclusion about the "
            "world that the process has not earned. They look identical from inside and they diverge "
            "the moment a prediction fails, because a sincere practitioner updates the record and a "
            "credulous one updates the method.",
            "The test is simple and uncomfortable. If your practice has never produced anything you "
            "were wrong about, you are not running an experiment. A method that has never been "
            "wrong about anything is not a method.",
        ], None),
    ],
    # ------------------------------------------------ n=125 (7 sections)
    [
        ("The Quranic account in more detail", [
            "The beings are described as created from smokeless fire, and as given faculties that "
            "include perception, speech and movement. They are divided into communities with their "
            "own beliefs, which means a substantial portion of them are described as disbelieving "
            "the same things people around them believe.",
            "They are subject to moral accountability. They can repent, they can be punished, and "
            "they can convert. This is a much fuller moral category than the servant or the "
            "instrument, and it is the detail that most retellings discard because it does not fit "
            "any of the shapes the folklore needs them in.",
        ], None),
        ("Iblis, and the refusal", [
            "The story of Iblis is the one that most rewards reading the actual text. He is among "
            "the most Knowledgeable of the beings, and he refuses the instruction to bow to Adam, "
            "and he is cast out and becomes the ancestor of a faction of jinn.",
            "Theologically this is a story about the origin of disobedience inside creation rather "
            "than about a separate rebellious species. It also makes the djinn a species with a "
            "history of doing exactly what they were told not to do, which is a considerably more "
            "interesting premise than the grimoire version and one that the grimoire version has no "
            "room for.",
        ], None),
        ("An-Naim, and the talisman market", [
            "The nineteenth-century Cairo text that the Western talisman trade largely depends on "
            "cites the Quran as its authority and then adds a substantial body of folklore about "
            "capture and binding that is not scriptural. The talismans sold to Western buyers are "
            "largely derived from that tradition rather than from the Quran itself.",
            "The market is worth understanding on its own terms. Talismans for particular purposes "
            "are sold, they are priced, and the pricing implies an efficacy claim that the "
            "provenance does not support. Buying one as an object with a history and a specific "
            "lineage is a coherent thing to do. Buying it as insurance against an outcome is being "
            "sold a claim rather than an artefact.",
        ], None),
        ("The Arabian Nights and what it does to the material", [
            "The Nights is the transmission mechanism, and it reshapes the material on the way. "
            "Djinn in the Nights are frequently bound by a ring or placed in a jar, and the binding "
            "is casual and narrative rather than procedural, which means the popular understanding "
            "of djinn as creatures that wait to be trapped comes substantially from a literary "
            "convention.",
            "That is not an accusation against the Nights, which is doing something else and doing "
            "it very well. It is a note about where a modern reader's mental image came from, and "
            "that image is more reliable as a description of the Nights than as a description of "
            "anything upstream.",
        ], None),
        ("How to check a claim about the djinn", [
            "Three questions, in order. Which layer is the claim coming from, scriptural, "
            "theological, folkloric or commercial. What is the earliest source you can find that "
            "says it. And does the modern telling of it contradict the older one, which is common "
            "and almost never acknowledged.",
            "The second question is the expensive one and the third is the cheap one. Doing the "
            "cheap one first will save you from spending the expensive one on a claim that turned "
            "out to be a modern addition with an ancient-sounding name.",
        ], [
            "Which layer does this claim belong to?",
            "What is the earliest source that contains it?",
            "Does the popular version contradict the older one?",
        ]),
        ("What is worth taking into a working practice", [
            "If you work with this material at all, the fire and the earth-binding are the two "
            "motifs that carry most of the weight across every layer. Fire for the nature of the "
            "being, earth for the constraint on it, and the lamp or the ring for the containment. "
            "That trio is stable across the scripture, the folklore and the talisman tradition, "
            "which is unusual and suggests it is doing the work.",
            "What does not survive the crossing is the hierarchy. Ranks, offices and the promise of "
            "service are the layer that varies most and is asserted most confidently. A working "
            "built on the stable motifs will outlive a working built on the hierarchy, and it will "
            "also be easier to check against a source.",
        ], None),
        ("A first fortnight, in order", [
            "Read a modern Quran translation with notes, the passages on the jinn and on Iblis. "
            "Write down what the text actually claims, separately from what you already believed "
            "about them, because the two are difficult to hold apart afterwards and the difficulty "
            "is not intellectual, it is motivational.",
            "Then read one account from the Nights and one modern talisman text, and mark the "
            "places where they disagree with the scripture. In a fortnight you will have a better "
            "position than most of the material available on this subject, and the disagreements you "
            "marked are the actual content.",
        ], None),
    ],
    # ------------------------------------------------ n=126 (6 sections)
    [
        ("A table of the four, and their evidence", [
            "Lucid dreaming has a measurable population base, reliable induction techniques, and a "
            "long history of laboratory work. Out of body experiences have a small self-selected "
            "reporting base, no reliable voluntary production method, and a strong association with "
            "illness and sleep onset. Remote viewing has disputed results and uncontroversial "
            "training effects.",
            "Tulpa practice is different again, because it is a documented contemplative method with "
            "its own purpose rather than a disputed experiment. Putting four things with four "
            "different evidence bases into a single category and calling it astral is the error "
            "that the rest of this page is trying to undo.",
        ], None),
        ("What the log has to contain", [
            "Attempts, successes and content, kept as three separate counts. Collapsing them into "
            "one number is the standard mistake, because a month of five attempts and two lucid "
            "dreams reads very differently from two attempts and two lucid dreams, and only one of "
            "those is remarkable.",
            "Content is the field most often dropped, and it is the most useful over a long run. "
            "People reuse dream imagery constantly without noticing, and a content log is the only "
            "way that reuse becomes visible rather than becoming a private mythology.",
        ], [
            "Attempts, counted, even the ones where you fell back asleep.",
            "Successes, counted only when a reality test confirmed them.",
            "Content, written down rather than recalled later.",
        ]),
        ("What to do when a month produces nothing", [
            "Nothing, for one month. A null month in a practice with this many variables is the "
            "normal state, and the usual response is to escalate, which converts a statistical fact "
            "into a self-inflicted problem.",
            "Check the two things that account for most nulls before changing anything. Was the "
            "reality test being used, or was success being judged on how vivid the dream felt? And "
            "was the practice actually fitted into a real morning routine, or attached to an "
            "intention that was never tested? Almost every stuck month is one of those two.",
        ], None),
        ("The interference question nobody asks", [
            "Lucid dream practice competes directly with ordinary sleep, and the two are not "
            "separable in the way most practice write-ups assume. Waking earlier reduces REM "
            "pressure later in the night, which means the very practice that produces the skill also "
            "erodes the condition that produces it.",
            "This is worth planning for rather than discovering. If the practice is going to last "
            "more than a couple of months, it needs a structure that does not depend on losing "
            "sleep, and the only one that does not is a very short routine run on ordinary "
            "waking mornings. Length and escalation are the two things to resist.",
        ], None),
        ("Where a chaos magician would put all of this", [
            "The framework people usually reach for is a thought form, described as a pattern "
            "fragment rather than a creature, and the instruction is to notice it and let it go "
            "rather than to fight it. That is a workable model and it maps onto something ordinary "
            "and well documented.",
            "The unwanted automatic thought, which is a recognised feature of ordinary cognition "
            "and has a substantial literature on what actually reduces it, is not fixed by "
            "suppression and is reliably worsened by it. The occult version of the remedy and the "
            "clinical version of the remedy arrived at the same place, and neither one requires the "
            "other to be true.",
        ], None),
        ("A defensible order to do all of this in", [
            "Lucid dreaming first, because it is trainable, because the evidence is best, and "
            "because the reality test it requires is the most transferable skill in the group. "
            "Remote viewing second, for the description training rather than for the results. The "
            "others are not a sequence at all, and treating them as stages of progress is the part "
            "of the popular framing that most reliably costs people time.",
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
    print("inserted %s sections into n=124, n=125, n=126" % (
        [len(b) for b in BLOCKS],))


if __name__ == "__main__":
    main()
