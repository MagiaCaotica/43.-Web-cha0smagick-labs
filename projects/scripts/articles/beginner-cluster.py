#!/usr/bin/env python3
"""
Dos articulos del cluster que mejor funciona, decididos por las impressiones
de los anclas que Google ya muestra:

  /blog/chaos-magick-beginners-complete-guide.html#common-beginner-mistakes
      91 impressiones, 0 clics, posicion 8.8 (pagina 1)
  .../#suggested-learning-path-8-weeks-to-competent-practice
      90 impressiones, 0 clics, posicion 8.9 (pagina 1)

Ese articulo principal es el mejor del sitio (899 impressiones, 45 clics). Las
secciones que mas se muestran son las que tienen demanda y todavia no tienen
pagina propia.

  python projects/scripts/articles/beginner-cluster.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from article_builder import construir  # noqa: E402

FECHA = "2026-10-21"
SITE = "https://cha0smagicklabs.com"

COMUN = [
    ("", ""),
]

# ======================================================================
# 1. LOS ERRORES DE LOS PRINCIPIANTES
# ======================================================================
slug1 = "chaos-magic-common-beginner-mistakes"
titulo1 = "Chaos Magic: the 10 mistakes beginners make (and how to avoid them)"
h1_1 = "Chaos Magic: the 10 mistakes beginners make, and what to do instead"
desc1 = ("The mistakes that make a first working fail are predictable and almost never "
         "about power. Ten of them, what each one looks like in practice, and the correction "
         "for each, drawn from keeping practice logs.")
kw1 = ("chaos magic beginner mistakes, chaos magick for beginners, what beginners get wrong "
       "chaos magic, chaos magic sigil mistakes, beginner chaos magic mistakes")

toc1 = [
    ("why-most-first-workings-fail", "Why most first workings fail"),
    ("mistake-1", "Mistake 1: treating the sigil as the spell"),
    ("mistake-2", "Mistake 2: charging with force instead of focus"),
    ("mistake-3", "Mistake 3: no record, so no feedback"),
    ("mistake-4", "Mistake 4: changing the method every time it fails"),
    ("mistake-5", "Mistake 5: not defining what failure looks like"),
    ("mistake-6", "Mistake 6: starting with the Goetia"),
    ("mistake-7", "Mistake 7: skipping the mundane"),
    ("mistake-8", "Mistake 8: borrowing symbols without the system"),
    ("mistake-9", "Mistake 9: selling the outcome"),
    ("mistake-10", "Mistake 10: treating a bad working as a failed method"),
    ("a-way-to-check", "A way to check whether you are doing this right"),
    ("mistakes-faq", "FAQ"),
]

cuerpo1 = """
<h2 id="why-most-first-workings-fail">Why most first workings fail</h2>
<p>Not because the practitioner lacked power, and not because the technique was
wrong. Almost always it is one of ten things, and they are the same ten for
almost everyone. They are listed here in the order they tend to appear, because
the first four account for most of the failed first attempts and the last six
show up once the first working has succeeded and the beginner believes the
method is the problem.</p>
<p>None of this is a matter of belief. Every point below is about what you can
observe in your own record, which is the only thing that separates a practice
from a hope.</p>

<h2 id="mistake-1">Mistake 1: treating the sigil as the spell</h2>
<p>The sigil is a focusing device, not the working. It is a way to hold an
intent in one shape so the mind stops restating it, which is what makes the
charge possible. People who treat the drawing as the act spend their energy on
the aesthetics of the symbol and arrive at the charge with nothing left.</p>
<p><strong>What it looks like:</strong> three attempts at the same intention
with a different sigil each time, and the sigil taking twenty minutes.</p>
<p><strong>The correction:</strong> draw the sigil once, quickly, without
judging how it looks. If you do not like the shape, draw another one, but never
redraw a sigil you have already charged with. The shape is not the point and
neither is the shape's beauty.</p>

<h2 id="mistake-2">Mistake 2: charging with force instead of focus</h2>
<p>Intensity is the most common advice beginners receive and the least useful.
Charging is a matter of sustained attention, not effort. Pushing harder on a
vague intention produces a vaguer intention at higher volume, and it produces
tension, and tension is the opposite of what a charge needs.</p>
<p><strong>What it looks like:</strong> the working ends with the practitioner
tense, drained, and unsure what was done. Or a charge that is repeated four or
five times because the first one did not feel like it landed.</p>
<p><strong>The correction:</strong> write the intention as a single sentence in
the present tense, with a subject, a verb and a condition, then charge it
calmly for a fixed time, long enough to be boring. If nothing happens, that
is information. It is not a verdict on your power, it is a data point about the
intention.</p>

<h2 id="mistake-3">Mistake 3: no record, so no feedback</h2>
<p>This is the mistake that turns a practice into a hobby. A working with no
record cannot be compared with the next one, so nothing accumulates. Most
beginners keep a dream journal and no practice journal, which is the wrong way
round: the dream is the input, the practice is the thing being trained.</p>
<p><strong>What it looks like:</strong> a year of workings, a strong feeling
that something worked once and no way to find out which one it was.</p>
<p><strong>The correction:</strong> one line per working. Date, intention in one
sentence, symbol, method, what happened, and what you would count as a miss.
That is the whole format. Fifteen seconds per entry, and it is the difference
between a practice and a sequence of events.</p>

<h2 id="mistake-4">Mistake 4: changing the method every time it fails</h2>
<p>When a working does not produce an observable result, the natural response
is to try something else. Then you have two variables and no conclusion. If the
method changes every time, no method is ever tested, and the practitioner
concludes that nothing works, when in fact nothing was ever given the chance
to work twice.</p>
<p><strong>What it looks like:</strong> a different sigil system, a different
charging technique and a different timing rule for every attempt, with the
conclusion drawn from the last one.</p>
<p><strong>The correction:</strong> hold the method constant for a run of
attempts and change only the intention. Ten workings with the same method and
ten intentions tell you something. Ten workings with ten methods tell you
nothing except that you were busy.</p>

<h2 id="mistake-5">Mistake 5: not defining what failure looks like</h2>
<p>If a working does nothing, is that a failure? Maybe. But most people
cannot say, because they never said in advance what they would have counted as
a result. The answer arrives afterwards and it is always generous.</p>
<p><strong>What it looks like:</strong> a working that produced nothing, later
described as a subtle success, a delayed effect or a lesson. Sometimes that is
true. Without a criterion written in advance, it cannot be told apart from
self-deception.</p>
<p><strong>The correction:</strong> before the working, write one sentence:
"this would count as a result if...". It can be mundane. A letter arriving, a
change in a recurring situation, a conversation that goes differently. What
matters is that it was written before the result and that it could have been
written down as a miss.</p>

<h2 id="mistake-6">Mistake 6: starting with the Goetia</h2>
<p>The Goetia is a hard, particular and well-documented body of work with
its own conventions, its own evocation structure and its own safety
considerations. It is a fine place to be after a year of sigils, and a poor
first project, because a failed Goetia working tells a beginner nothing they
can act on. The failure modes are too many to diagnose and the tradition
expects more context than the beginner has.</p>
<p><strong>The correction:</strong> start with a single sigil for a small,
mundane intention. Learn to charge, to record and to define a result. The
Goetia will still be there, and you will be able to tell what went wrong.</p>

<h2 id="mistake-7">Mistake 7: skipping the mundane</h2>
<p>Chaos magick insists on a mundane component: the walk to the mailbox, the
email that gets sent, the phone call. Beginners skip it, because the magical
part is more interesting. The mundane anchor is what makes the working
verifiable, and without it the result cannot be observed, only felt.</p>
<p><strong>What it looks like:</strong> a working with no action attached, and
no way of knowing afterwards whether anything happened.</p>
<p><strong>The correction:</strong> attach one ordinary action to every
working. It should be small, it should be something you would notice, and it
should be written in the log before the working.</p>

<h2 id="mistake-8">Mistake 8: borrowing symbols without the system</h2>
<p>Using a sigil from someone else, or a planetary symbol from a tradition
without knowing what it stands for, is common and it produces two problems. The
symbol carries meaning that was designed for a different intention, and the
practitioner cannot inspect their own symbols, which is the skill the whole
practice builds.</p>
<p><strong>The correction:</strong> draw your own. Even a rough one. The act
of constructing the character is where the intention gets encoded, and it is
the only part of the process where you can be wrong in a way that teaches you
something.</p>

<h2 id="mistake-9">Mistake 9: selling the outcome</h2>
<p>A working that is promised as a guarantee is already a worse working, for
two reasons. It raises the stakes so much that attention scatters, and it
makes a miss feel like a personal failure instead of a data point, which is
what stops people recording misses at all.</p>
<p><strong>The correction:</strong> state the intention in terms of a situation
you can influence, and leave the outcome out of it. "The situation where the
invoice is overdue" is a workable intention. "Money arrives" is a promise, and
promises do not get charged.</p>

<h2 id="mistake-10">Mistake 10: treating a bad working as a failed method</h2>
<p>The opposite error, and it comes later. After a run of misses, the
practitioner concludes that the method is wrong and abandons it, when the
record usually shows something narrower: the intention was too vague, the
symbol was drawn badly, the timing was not observed, or the mundane action was
too small to notice.</p>
<p><strong>The correction:</strong> read the log before changing the method.
The log will usually name the problem. If it does not, then you have learned
the only thing the log could teach you, which is that the method was not
recorded well enough to judge.</p>

<h2 id="a-way-to-check">A way to check whether you are doing this right</h2>
<p>One page, six lines per working, and no system more complicated than that:</p>
<table>
<thead><tr><th>Line</th><th>What it captures</th></tr></thead>
<tbody>
<tr><td>Date and time</td><td>Enough to spot a pattern in timing</td></tr>
<tr><td>Intention, one sentence</td><td>Whether it was specific enough to charge</td></tr>
<tr><td>Method</td><td>Held constant so that comparisons are possible</td></tr>
<tr><td>Symbol</td><td>Your own drawing, and how it felt to draw it</td></tr>
<tr><td>Mundane action</td><td>One ordinary act, written before the working</td></tr>
<tr><td>Result, or "no result"</td><td>Recorded the same day, with the criterion from before</td></tr>
</tbody>
</table>
<p>After ten entries, three things become visible that were invisible before:
which intentions are too vague, which hours work and which do not, and whether
the method is producing anything at all. None of that is available to someone
who remembers their workings instead of writing them down.</p>

<h2 id="mistakes-faq">FAQ</h2>
<h3>Is the sigil really necessary for a chaos magic working?</h3>
<p>No. The sigil is a focusing device, not a requirement, and plenty of
practitioners work with a written intention alone. What matters is that the
intention is held in one shape for long enough to be charged. A sigil is the
most common way to do that, not the only one.</p>
<h3>How long should a charge last?</h3>
<p>Long enough to be boring. Anything past the point of concentration is
wasted effort, and anything shorter is usually just an intention without a
charge. Pick a time you can hold, keep it, and keep it the same for a run of
workings so that the variable stays constant.</p>
<h3>What if I get no result at all?</h3>
<p>Then you have a data point, which is what the log is for. Check the
criterion you wrote before the working, and check whether the intention was
specific and the mundane action observable. If both were sound, change one
thing and repeat. That is the whole method.</p>
<h3>Does this mean chaos magic does not work?</h3>
<p>It means the practice is trainable. Nothing on this list is about whether
the tradition is true. It is about whether you can tell, after the fact, what
you did.</p>
"""

faq1 = [
    ("Is the sigil really necessary for a chaos magic working?",
     "No. The sigil is a focusing device, not a requirement. What matters is that the intention is held in "
     "one shape for long enough to be charged, and plenty of practitioners work with a written intention alone."),
    ("How long should a charge last?",
     "Long enough to be boring. Past the point of concentration is wasted effort, and shorter is usually an "
     "intention without a charge. Pick a time you can hold and keep it constant across a run of workings so "
     "that the variable does not move."),
    ("What if I get no result at all?",
     "Then you have a data point, which is what the log is for. Check the criterion you wrote before the working, "
     "and check whether the intention was specific and the mundane action observable. If both were sound, change "
     "one thing and repeat."),
    ("Does this mean chaos magic does not work?",
     "It means the practice is trainable. Nothing on that list is about whether the tradition is true. It is about "
     "whether you can tell, after the fact, what you did."),
]

ref1 = """
<section id="references">
<h2>References and further reading</h2>
<ul>
<li><a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners: the complete guide</a>, the longer version this page condenses.</li>
<li><a href="how-to-create-magickal-servitor.html">How to create a magickal servitor</a>, for when the practice is ready for something longer.</li>
<li><a href="../tools/sigil-generator.html">The free sigil generator</a>, for the first point about not spending twenty minutes on the drawing.</li>
</ul>
</section>
"""

int1 = """
<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Apps:</strong> <a href="../apps/chaos-sigil-generator.html">Chaos Sigil Generator</a> | <a href="../apps/psi-gym.html">PSI GYM</a> | <a href="../apps/arcana-goetia.html">Arcana Goetia</a>
</div>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Guides:</strong> <a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners</a> | <a href="chaos-magic-8-week-learning-path.html">An 8-week path to competent practice</a>
</div>
<div>
<strong style="color: var(--text-primary);">Free tools:</strong> <a href="../tools/sigil-generator.html">Sigil generator</a> | <a href="../tools/zener.html">Zener trainer</a>
</div>
</section>
"""

cta1 = """
<section class="cta-contextual" id="try-it" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-top: 0;">Start with the practice log, not the power</h3>
<p style="margin-bottom: 1rem;">The <strong>Chaos Sigil Generator</strong> draws the symbol so that
the charge is the part you spend your attention on. It works offline, needs no
account and costs $3.99 once.</p>
<p style="margin-bottom: 0;">
<a class="cta-button primary" href="https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp" rel="noopener">Chaos Sigil Generator on Google Play ($3.99, one-time)</a>
</p>
</section>
"""

rel1 = """
<section class="related-articles" style="margin: 2rem 0;">
<h2 style="color: var(--accent-gold);">Read next</h2>
<div class="related-links">
<ul>
<li><a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners: the complete guide</a></li>
<li><a href="chaos-magic-8-week-learning-path.html">An 8-week path to competent chaos magic practice</a></li>
<li><a href="sigil-vs-servitor-differences.html">Sigil vs servitor: what actually differs</a></li>
</ul>
</div>
</section>
"""

# ======================================================================
# 2. EL CAMINO DE 8 SEMANAS
# ======================================================================
slug2 = "chaos-magic-8-week-learning-path"
titulo2 = "An 8-Week Path to Competent Chaos Magic Practice (with a log)"
h1_2 = "An 8-week path to competent chaos magic practice, one week at a time"
desc2 = ("Eight weeks, one working a week, and a log that tells you afterwards whether it "
         "worked. A plan for beginners who want a trainable practice instead of a series of "
         "attempts.")
kw2 = ("chaos magic learning path, 8 week chaos magic plan, how to learn chaos magic, chaos magic "
       "beginner programme, chaos magick for beginners, learn chaos magick step by step")

toc2 = [
    ("what-this-is", "What this is, and what it is not"),
    ("before-week-one", "Before week one: the setup"),
    ("week-1", "Week 1: one sigil, one intention"),
    ("week-2", "Week 2: the same method, a new intention"),
    ("week-3", "Week 3: holding the charge"),
    ("week-4", "Week 4: reading your own record"),
    ("week-5", "Week 5: the mundane anchor"),
    ("week-6", "Week 6: the first longer working"),
    ("week-7", "Week 7: reading for someone else"),
    ("week-8", "Week 8: reviewing the cycle"),
    ("learning-path-faq", "FAQ"),
]

cuerpo2 = """
<h2 id="what-this-is">What this is, and what it is not</h2>
<p>One working a week, for eight weeks, each one written down. That is the
whole method. The point is not the workings. The point is to end the eight
weeks with a record you can read, and with a practice you can repeat.</p>
<p>It is not a spiritual programme and it does not escalate into anything
dramatic. Most beginners who start this way end it able to do one thing
properly: put an intention into a symbol, charge it, and find out afterwards
whether it did anything. That is worth more than a year of attempts nobody
wrote down.</p>
<p>One working a week is deliberate. It is slow enough that you can actually
do it, and slow enough that you remember what you did.</p>

<h2 id="before-week-one">Before week one: the setup</h2>
<p>Two things, and then start.</p>
<ul>
<li><strong>A log.</strong> A page, a notebook, anything. One entry per
working, six lines: date and time, the intention in one sentence, the method,
the symbol, the mundane action, and the result or "no result". Write the
criterion for success in the entry <em>before</em> the working, not after.</li>
<li><strong>One mundane anchor.</strong> Decide now what ordinary action you
will attach to every working. It should be small and observable: checking the
mail, making the call, opening the letter. The same action every time, so
that the results are comparable.</li>
</ul>
<p>Then read
<a href="chaos-magic-common-beginner-mistakes.html">the ten mistakes
beginners make</a> once. It saves weeks.</p>

<h2 id="week-1">Week 1: one sigil, one intention</h2>
<p><strong>Do:</strong> pick one small, ordinary intention. Not money, not
health, not a person. A situation you can influence and check. Write it in one
sentence in the present tense. Draw a sigil for it in a single stroke per
character, without judging the result. Charge it for a fixed time you can
hold without strain. Do the mundane action. Write the entry the same
evening.</p>
<p><strong>Do not:</strong> redraw the sigil. Do it once and charge what you
drew. Do not try a second charge because the first felt weak. One working, one
entry, one week.</p>
<p><strong>What "good" looks like:</strong> one entry, six lines, and a
criterion written before the working. That is the entire target of week one.
The result matters less than the record.</p>

<h2 id="week-2">Week 2: the same method, a new intention</h2>
<p>Repeat the method exactly and change only the intention. Same drawing
style, same charging time, same mundane action, same slot in the week. This is
the week that starts building a comparison, because now you have two entries
that differ in exactly one thing.</p>
<p>If week one produced something, do not build on it. Do the second working
the same way and see whether it produces the same kind of thing. If week one
produced nothing, week two tells you whether that was the intention or the
week.</p>

<h2 id="week-3">Week 3: holding the charge</h2>
<p>Same method again, and this time pay attention to the charge itself rather
than the result. Write one sentence in the log about what the charge felt
like: easy, difficult, restless, boring, gone.</p>
<p>Most beginners find that the charge is much easier than they expected, and
that the difficulty they had been experiencing was in the worrying rather than
in the working. If your week three charge is calm and your week one charge
was tense, that is a real finding, and it belongs in the log before the
intentions change.</p>

<h2 id="week-4">Week 4: reading your own record</h2>
<p>No new working this week. Read the three entries you have and answer three
questions in writing:</p>
<ol>
<li>Which intention was the most specific, and which was the vaguest?</li>
<li>Which of the three came closest to the criterion you wrote in advance?</li>
<li>What was different about the entry you are least sure of?</li>
</ol>
<p>Do not change anything yet. Write the answers down. Most beginners
discover that the difference between their best and worst entry is the
precision of the intention, not the effort of the charge, and that is a
finding worth keeping.</p>

<h2 id="week-5">Week 5: the mundane anchor</h2>
<p>Same method, and this week make the mundane action do the work. Whatever
the intention is about, attach the ordinary action to it in a way that
connects: if the intention concerns a letter, post the letter; if it concerns
a conversation, have the conversation. Keep the charge the same length.</p>
<p>The reason for the week is that a working without a mundane component
cannot be observed, only felt, and "I think it worked" is not a result you can
build on.</p>

<h2 id="week-6">Week 6: the first longer working</h2>
<p>Same method, but this one is bigger and takes longer. Not a new technique:
the same sigil, the same charge, applied to a situation with more at stake
and given a longer, more careful charge. Write the criterion in advance, as
always, and pick something where you will be able to tell in a week whether
it worked.</p>
<p>If the first five weeks produced a good record, this is where the practice
starts to feel like something rather than a series of exercises. If they did
not, do this one small and make the log better instead.</p>

<h2 id="week-7">Week 7: reading for someone else</h2>
<p>Same method, and this week the intention belongs to another person, with
their permission and without being told what they should expect. Work it the
way you would work your own. Record the result in the same format, including
the mundane action, and ask them the same day what they noticed.</p>
<p>This is where a beginner's practice usually becomes real, because another
person's account is the first piece of information that is not their own
memory. It is also where the temptation to interpret appears, so write their
account in their words, not yours.</p>

<h2 id="week-8">Week 8: reviewing the cycle</h2>
<p>No new working. Read all seven entries and answer four questions:</p>
<ol>
<li>Which intention produced the most observable result, and what did the
others have that it did not?</li>
<li>Which part of the method produced the most reliable result: the symbol,
the charge, the mundane action, or the precision of the intention?</li>
<li>Which entries would you call a miss, and were they misses by the criterion
you wrote in advance?</li>
<li>What will you keep exactly the same for the next eight weeks?</li>
</ol>
<p>That last question is the one that matters. A cycle is only worth something
if the next one is comparable, and the next one is only comparable if the
method does not change.</p>

<h2 id="learning-path-faq">FAQ</h2>
<h3>How long should each working take?</h3>
<p>The sigil takes under a minute, the charge takes as long as you can hold
attention without strain, and the mundane action takes what it takes. Most
beginners spend twenty minutes on a whole working and most of that is the
writing in the log.</p>
<h3>What if I miss a week?</h3>
<p>Do not make it up and do not double up. Skip it, leave a gap in the log, and
carry on. A gap is data: if the weeks you miss are also the weeks nothing
happens, that is worth seeing.</p>
<h3>Do I need a sigil every time?</h3>
<p>For these eight weeks, yes, because holding the method constant is the
point. After the cycle you can test what happens with a written intention
instead, and that is a good week nine.</p>
<h3>What if nothing happens in eight weeks?</h3>
<p>Then you have seven entries, a method you can repeat and a set of results
you can compare, and the next cycle starts from facts rather than from a
feeling. That is a better position than the one most beginners are in after
eight weeks of unstructured attempts.</p>
"""

faq2 = [
    ("How long should each working take?",
     "The sigil takes under a minute, the charge takes as long as you can hold attention without strain, and the "
     "mundane action takes what it takes. Most beginners spend twenty minutes on a whole working and most of that "
     "is the writing in the log."),
    ("What if I miss a week?",
     "Do not make it up and do not double up. Skip it, leave a gap in the log and carry on. A gap is data: if the "
     "weeks you miss are also the weeks nothing happens, that is worth seeing."),
    ("Do I need a sigil every time?",
     "For these eight weeks, yes, because holding the method constant is the point. After the cycle you can test "
     "what happens with a written intention instead, and that makes a good week nine."),
    ("What if nothing happens in eight weeks?",
     "Then you have seven entries, a method you can repeat and a set of results you can compare, and the next cycle "
     "starts from facts rather than from a feeling. That is a better position than the one most beginners are in "
     "after eight weeks of unstructured attempts."),
]

ref2 = """
<section id="references">
<h2>References and further reading</h2>
<ul>
<li><a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners: the complete guide</a>, the reference for the methods used here.</li>
<li><a href="chaos-magic-common-beginner-mistakes.html">The 10 mistakes beginners make</a>, read this before week one.</li>
<li><a href="sigil-binding-unbinding-techniques-complete-guide.html">Sigil binding and unbinding</a>, for the charge itself.</li>
</ul>
</section>
"""

int2 = """
<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Apps:</strong> <a href="../apps/chaos-sigil-generator.html">Chaos Sigil Generator</a> | <a href="../apps/psi-gym.html">PSI GYM</a> | <a href="../apps/arcana-goetia.html">Arcana Goetia</a>
</div>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Guides:</strong> <a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners</a> | <a href="chaos-magic-common-beginner-mistakes.html">The 10 mistakes beginners make</a>
</div>
<div>
<strong style="color: var(--text-primary);">Free tools:</strong> <a href="../tools/sigil-generator.html">Sigil generator</a> | <a href="../tools/zener.html">Zener trainer</a>
</div>
</section>
"""

cta2 = """
<section class="cta-contextual" id="try-it" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-top: 0;">One working a week, and the tool to do it with</h3>
<p style="margin-bottom: 1rem;">The <strong>Chaos Sigil Generator</strong> draws the symbol so that the
charge gets the attention, and works offline on the device with no account.
$3.99 once, not a subscription.</p>
<p style="margin-bottom: 0;">
<a class="cta-button primary" href="https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp" rel="noopener">Chaos Sigil Generator on Google Play ($3.99, one-time)</a>
</p>
</section>
"""

rel2 = """
<section class="related-articles" style="margin: 2rem 0;">
<h2 style="color: var(--accent-gold);">Read next</h2>
<div class="related-links">
<ul>
<li><a href="chaos-magick-beginners-complete-guide.html">Chaos Magic for Beginners: the complete guide</a></li>
<li><a href="chaos-magic-common-beginner-mistakes.html">The 10 mistakes beginners make</a></li>
<li><a href="sigil-binding-unbinding-techniques-complete-guide.html">Sigil binding and unbinding techniques</a></li>
</ul>
</div>
</section>
"""

for slug, titulo, h1, desc, kw, toc, cuerpo, faq, ref, intl, cta, rel, cat in [
    (slug1, titulo1, h1_1, desc1, kw1, toc1, cuerpo1, faq1, ref1, int1, cta1, rel1, "basics"),
    (slug2, titulo2, h1_2, desc2, kw2, toc2, cuerpo2, faq2, ref2, int2, cta2, rel2, "basics"),
]:
    html = construir(slug, titulo, h1, desc, kw, FECHA, 11, slug, toc, cuerpo, faq, ref, intl, cta, rel)
    out = ROOT / "blog" / f"{slug}.html"
    out.write_text(html, encoding="utf-8")
    print("articulo escrito:", out.name, len(html), "bytes")
