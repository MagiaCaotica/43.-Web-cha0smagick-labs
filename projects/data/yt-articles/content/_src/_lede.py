"""Lede overrides for records whose opening paragraph was under the 120-word floor.

`_emit.py collect()` applies this after the `b*.py` files are loaded, so a
record can be corrected here without touching the file that owns the rest of
it.  Every replacement is 130-190 words.
"""

LEDGES = {}

LEDGES[28] = (
    "The question behind a great deal of magic practice is empirical and stubborn: does the working produce a "
    "result that would not have happened otherwise, and how would you know? Most accounts answer it with "
    "anecdote, which is the least useful category of evidence available. This page takes the other route and "
    "reports what was actually measured over twelve weeks of structured practice, including the entries where "
    "nothing happened and the two where something did. The four questions it keeps returning to are simple. Was "
    "the condition specified before the run, was there a date by which you would check, was the chance rate of "
    "the result calculated, and were the nulls written down on the day. It is written for practitioners willing "
    "to be their own control group, and for readers who would rather see a clean null than an explanation for "
    "an inconvenient week."
)

LEDGES[29] = (
    "Time work is the least examined corner of practical magic and the most reliably misunderstood. It attracts "
    "claims about acceleration, retroactive change and reordered chronology that would be unremarkable in "
    "fiction and are corrosive as practice. What survives examination is considerably narrower and more useful: "
    "attention to sequence, honest duration, and a particular kind of patience most people have never "
    "practised. This page works through the material in the order a beginner can actually use it, spends some "
    "time on what the popular literature gets wrong about physics, and ends with a working sequence you could "
    "run this week without buying anything at all. If the sequence is all you take from it, that is a good "
    "outcome, because the sequence is the part that survives complete scepticism about the rest."
)

LEDGES[30] = (
    "Screen-based ritual produces a great deal of writing and very little published data, which is an "
    "uncomfortable position for a practice whose entire reputation rests on methodological rigour. This page "
    "tries to correct the ratio. It reports what happened across twelve workings run to a fixed protocol over "
    "eleven weeks: the six that produced nothing, the two that produced something unexpected, and the practical "
    "conclusions that came out of keeping records nobody had asked for. The uncomfortable finding is that the "
    "device mattered less than the object, and the useful finding is that an illegible glyph produced no result "
    "at all. If you are sceptical of technomancy, this page is written so that you can check every claim "
    "against a procedure rather than take any of it on trust."
)

LEDGES[31] = (
    "Sigilkore treats the sigil as an engineering problem. Given a statement, produce a glyph that carries it, "
    "and be able to say exactly what each stroke encodes. This page works through that sequence in the order it "
    "has to happen, from the reduction of a sentence to the deletion of the file afterwards, and it treats the "
    "aesthetic dimension as real but secondary. The assumption throughout is that you want a method you can "
    "repeat and somebody else could audit, not a one-off gesture. That assumption changes several things people "
    "usually skip, including how the intent is worded, how long the charge runs, and why the forgetting step is "
    "the one worth getting right. Everything claimed here is checkable, including the parts most instructions "
    "leave vague."
)

LEDGES[32] = (
    "Most descriptions of chaos magic are written by people explaining what it is not. This one attempts the "
    "opposite: a structural account of how the movement is put together, why it took the shape it did, and what "
    "the design implies about which parts survive contact with a sceptic. The interest is in the architecture "
    "rather than the outcomes, because architecture is what determines whether a practice can be improved by "
    "anybody or has merely been preserved. It is written for readers who already have the basic vocabulary and "
    "want to know which parts are load-bearing. The claim it makes is that the tradition's real contribution "
    "was methodological, and that a rule requiring you to state in advance what would count as success is worth "
    "more than the cosmology that came with it."
)

LEDGES[33] = (
    "This is the report nobody writes: a year of chaos magic practice kept properly, with the wins in the first "
    "paragraph and the failures occupying considerably more space. The intention is not to discourage anybody. "
    "It is to show what the practice actually looks like from inside a schedule that has to keep running "
    "alongside a job, some bad weeks, and a stretch of five weeks when nothing was written down at all. The "
    "three conditions for the year were fixed in week one and never revised, and there is a verdict at the end "
    "which is much less dramatic than the ones usually published. If you are deciding whether the method is "
    "worth the trouble, this is more use to you than any description of it, including the good descriptions."
)

LEDGES[34] = (
    "This page is built as a reference rather than an argument. It sets out the terms, the numbers and the "
    "diagnostic questions that recur whenever somebody tries to work out whether a practice of attention "
    "produces anything at all. The reasoning underneath is laid out elsewhere and is not repeated here, "
    "because a table you can consult is worth more than a position you have to agree with first. Everything "
    "below is meant to be quoted, argued with, or used as a checklist when reviewing a year of your own "
    "records. If you read one section, read the diagnostic checklist near the end. It is the part that does the "
    "work, and it applies equally to a claim made by a grimoire, a podcast, a research paper or a friend."
)

LEDGES[35] = (
    "The seventy-two spirits of the Ars Goetia are the most reproduced piece of western grimoire material in "
    "circulation and the least well understood. Between the seventeenth-century text, the twentieth-century "
    "compilations and the present-day media, they have acquired a reputation their original context does not "
    "support. This page works through the structure of the list, traces where it came from, explains what an "
    "entry actually instructs, and sets out a way to work with the material that requires no belief in any of "
    "the claims attached to it. It is written for practitioners who want the source rather than the brand, and "
    "for readers who have been handed a recommendation without a domain and would like to know how the "
    "selection is supposed to work."
)

LEDGES[56] = (
    "Most people who try a money sigil do it once, feel nothing, and quietly decide the whole thing was "
    "pointless. The ones who get anywhere run a cycle with dates written on it, record what happened, "
    "and let the record act as the judge. I did that over twelve weeks, twice, and the second cycle "
    "produced a different answer from the first. What follows is the whole procedure, the rules I set "
    "before touching anything, the three sigils I charged, the weeks where nothing at all happened, and "
    "the tools I used to keep track. The method itself costs nothing to run. The bookkeeping is the "
    "piece everyone skips, and it is also the piece that carries the result, which is the whole reason "
    "this is written as a report rather than a set of instructions."
)

LEDGES[57] = (
    "The Liber Lvpinux is described online as a book about turning into a werewolf. It is not, and "
    "almost everything written about it online is describing a different book. What it actually "
    "contains is a short nineteenth century text concerned with lycanthropy as a spiritual and "
    "demonic subject, written by a man who believed in it and recorded what he thought was going on. "
    "This page works through the book itself, sets it against the other grimoires people reach for "
    "when they want to become something, and then asks the practical question: what can an honest "
    "practitioner take from a text whose central claim you have to reject while still respecting the "
    "author enough to use his method properly. The answer turns out to be narrower than most people "
    "want, and considerably more useful than most of what is sold under the same name."
)

LEDGES[58] = (
    "Abundance work arrives wrapped in a lot of vocabulary, and most of that vocabulary is doing less "
    "work than it appears to. The terms are worth learning, but not for the reasons usually given. They "
    "are worth learning because a shared vocabulary lets you state a target precisely, and precision is "
    "the only variable in this practice that reliably changes the outcome. What follows is a "
    "reference: the words, what each one actually commits you to, the measures that make a target "
    "countable, the numbers that recur in the tradition and where they came from, and a schedule you "
    "can copy rather than one you have to invent from scratch. Nothing here depends on a purchase, and "
    "the section on tracking is there because the bookkeeping is where most of these attempts quietly "
    "fail."
)

LEDGES[69] = (
    "Most explanations of chaos magic describe what the method is. Very few describe what happens when "
    "someone actually uses it for two months, which is the part that decides whether you keep going. "
    "This is a report from that side of the fence: the workings that produced something, the workings "
    "that produced nothing, and the two or three habits that turned out to matter more than any technique "
    "involved. The chapters that follow cover the sequence I followed, the records I kept, the tools I "
    "tried, and the stretches where I stopped writing anything down at all. That last part turned out to "
    "be the most instructive. Nothing here requires you to believe anything in particular, and the "
    "conclusions I draw are deliberately narrower than the ones usually advertised."
)
