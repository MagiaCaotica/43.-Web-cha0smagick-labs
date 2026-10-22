#!/usr/bin/env python3
"""
Dos articulos para el cluster de astrologia, decidedos con las posiciones
medidas de Search Console (28 dias, 2026-10-21):

  'site.astro.com swisseph sidereal lahiri houses documentation'  pos 9.2
      Nadie cubre en el sitio el tema del zodiaco siddharta y el ayanamsa, que
      es lo que la gente busca cuando entra por la documentacion de
      Swiss Ephemeris. Ademas es la pregunta que sigue al articulo de
      ephemerides recien publicado.
  'natal chart app' (pos 44), 'birth chart app' (pos 44),
  'astrology birth chart app' (pos 30), 'carta natal es' (pos 38)
      14 impresiones en cuatro queries comerciales, todas en paginas 4-6, y
      sin una pagina propia que las capturara.

  python projects/scripts/articles/astrology-cluster.py
"""
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "projects" / "scripts"))
from article_builder import construir  # noqa: E402

FECHA = "2026-10-21"

# ======================================================================
# A. SIDEREAL VS TROPICAL
# ======================================================================
slugA = "sidereal-vs-tropical-zodiac-lahiri-ayanamsa"
tituloA = "Tropical vs Sidereal Zodiac: what the ayanamsa actually changes (Lahiri and the rest)"
h1A = "Tropical vs sidereal zodiac: what the ayanamsa actually changes, and what it does not"
descA = ("The two zodiacs are the same sky with a different zero. Here is what the ayanamsa "
         "is, how far it has moved by 2026, and the part most articles get wrong: the aspects "
         "do not change, only the sign labels and the houses.")
kwA = ("sidereal vs tropical zodiac, ayanamsa, lahiri ayanamsa, vedic astrology zodiac, "
       "precession of the equinoxes, ayanamsa 2026, sidereal zodiac, tropical zodiac difference, "
       "raman ayanamsa, house systems placidus koch equal")

tocA = [
    ("two-zero-points", "Two zero points for the same sky"),
    ("what-the-ayanamsa-is", "What the ayanamsa is"),
    ("how-far-it-has-moved", "How far it has moved by 2026"),
    ("what-changes-and-what-does-not", "What changes and what does not"),
    ("which-ayanamsa", "Which ayanamsa: Lahiri, Raman and the rest"),
    ("house-systems", "House systems, and where they break"),
    ("what-our-app-does", "What our app does, and why"),
    ("how-to-check", "How to check it yourself"),
    ("ayanamsa-faq", "FAQ"),
]

cuerpoA = """
<h2 id="two-zero-points">Two zero points for the same sky</h2>
<p>The planets do not care which zodiac you use. The difference is entirely in
where you put the zero, and the zero moves.</p>
<p>The tropical zodiac puts 0 degrees of Aries at the vernal equinox, the
moment the Sun crosses the celestial equator going north, around 21 March. That
keeps the signs lined up with the seasons, which is why it works for
planting, and it is the default in Western astrology.</p>
<p>The sidereal zodiac puts 0 degrees of Aries at a fixed point in the
background stars. It stays with the constellations, and it is what Jyotish, the
Indian tradition of astrology, uses.</p>
<p>The distance between the two is the <strong>ayanamsa</strong>, and it is not
a rounding error. It is currently about 24 degrees, which is a little under a
whole sign.</p>

<h2 id="what-the-ayanamsa-is">What the ayanamsa is</h2>
<p>Precession is the slow drift of the equinoxes along the ecliptic, caused by
the Earth's axis precessing like a spinning top. The whole cycle takes about
25,700 years, and the equinox currently sits about 24 degrees behind where it
sat when the zodiac was defined. That difference, measured from a chosen
reference star, is the ayanamsa.</p>
<p>Two things follow from this that are worth holding onto:</p>
<ul>
<li><strong>The ayanamsa is a choice of reference point, not a measurement of
the sky.</strong> Different traditions anchor it to different stars or
epochs, and the values differ by a degree or more.</li>
<li><strong>It changes by about 50 seconds of arc per year.</strong> A value
quoted for 2020 is out of date for 2026 by roughly three minutes of arc, which
is enough to move a planet across a house cusp.</li>
</ul>

<h2 id="how-far-it-has-moved">How far it has moved by 2026</h2>
<p>The Lahiri ayanamsa, also called Chitrapaksha, was about
<strong>23 degrees 51 minutes</strong> at the start of 2000. Adding the
precession rate of roughly 50.3 seconds a year for the 26 years since gives
something close to <strong>24.2 degrees in 2026</strong>.</p>
<p>That figure is worth quoting, and worth checking against the source rather
than taking from an article, including this one: the values published by the
Indian government and by the Swiss Ephemeris documentation are the ones to
compare against, and they move every year.</p>
<p>At 24 degrees, and with each sign spanning 30 degrees, a planet can be in a
different sign in the two zodiacs, and for a period of about 24 days per year
it can be in a different sign in the two systems even when the ayanamsa is
computed exactly. That is the everyday source of the arguments: the same
birth chart, two sign labels.</p>

<h2 id="what-changes-and-what-does-not">What changes and what does not</h2>
<p>This is the part that most explanations of the two zodiacs get wrong, and
getting it wrong leads to a lot of wasted argument.</p>
<table>
<thead><tr><th>Element</th><th>Tropical versus sidereal</th><th>Why</th></tr></thead>
<tbody>
<tr><td>The position of a planet</td><td>The same, in both systems</td><td>The ayanamsa is a rotation of the whole reference frame, not a different measurement</td></tr>
<tr><td>The sign a planet falls in</td><td>Usually different</td><td>A 24 degree shift lands most planets in the neighbouring sign</td></tr>
<tr><td>The distance between two planets</td><td><strong>Identical</strong></td><td>Angular separation does not depend on where the zero is</td></tr>
<tr><td>The aspects between two planets</td><td><strong>Identical</strong></td><td>A conjunction in the tropical zodiac is a conjunction in the sidereal one</td></tr>
<tr><td>The house a planet falls in</td><td>Different</td><td>The house cusps are anchored to the frame, so the whole grid rotates with it</td></tr>
<tr><td>The Ascendant and Midheaven</td><td>Different</td><td>They are angles of the frame, so they rotate with the ayanamsa</td></tr>
</tbody>
</table>
<p>So if two charts disagree about whether there is a square between Venus
and Mars, the ayanamsa is not the reason. A square is a square in both
systems, and the disagreement comes from a different time, a different
latitude, or a different house system.</p>
<p>The opposite mistake is just as common: treating a sign label as if it
carried meaning on its own. A planet at 4 degrees of Scorpio in the tropical
zodiac is at about 10 degrees of Scorpio in the sidereal one, and that is
all that changed. The conjunction, the opposition, the house it falls in: all
still there, and if the house changed, the house is the thing to check.</p>

<h2 id="which-ayanamsa">Which ayanamsa: Lahiri, Raman and the rest</h2>
<p>There is no single sidereal zodiac. Each tradition anchors the zero
differently, and the results differ by a degree or so, which is enough to
change a sign label in the marginal cases.</p>
<table>
<thead><tr><th>Ayanamsa</th><th>Used by</th><th>Note</th></tr></thead>
<tbody>
<tr><td>Lahiri (Chitrapaksha)</td><td>The Indian government calendar, most Jyotish practice, and most software as a default</td><td>The most widely used, and the one to check against when comparing software</td></tr>
<tr><td>Raman (BVP)</td><td>Some South Indian and international sidereal astrology</td><td>Differs from Lahiri by roughly a degree</td></tr>
<tr><td>Krishnamurti</td><td>Some Western sidereal astrology</td><td>Anchored to a different star, and to a different year</td></tr>
<tr><td>Fagan-Bradley</td><td>Western sidereal astrology</td><td>Not a precession figure at all, but an anti-precession correction, and it is larger</td></tr>
<tr><td>True node, zero ayanamsa</td><td>Some sidereal astrology</td><td>The sidereal zodiac with no precession correction at all, and therefore no ayanamsa to argue about</td></tr>
</tbody>
</table>
<p>When software lists an "ayanamsa" option, the question to ask is not which
one is right but which one the comparison chart was drawn with. Two charts can
use two different ayanamsas and two different house systems and still be
presented as a disagreement about the sky.</p>

<h2 id="house-systems">House systems, and where they break</h2>
<p>The house system decides where the sky is divided into twelve, and this is
where most of the confusion in a comparison comes from, because the two
things are usually discussed together and are entirely separate.</p>
<ul>
<li><strong>Whole sign</strong> gives each sign its own house, starting from
the sign containing the Ascendant. Simple, and the oldest of the four in
regular use.</li>
<li><strong>Placidus</strong> divides by time: the cusp of the tenth house is
placed by semi-arc division, the eleventh by the projection of the equator
onto the ecliptic, and so on. It is the most common system in Western
practice.</li>
<li><strong>Koch</strong> is a variant that places the Ascendant on the
ecliptic and divides the rest from there. It differs from Placidus in the
higher degrees and in the size of the intermediate houses.</li>
<li><strong>Equal</strong> divides the ecliptic from the Ascendant in equal
steps. It always produces a house of a sensible size, which is its main
practical advantage.</li>
<li><strong>Porphyry</strong> takes the quadrants of the ecliptic and
divides each by time. It is the standard in Hellenistic work and it stays
well behaved at high latitudes.</li>
</ul>
<p>Every system except whole sign and equal breaks down as you approach the
poles. Placidus houses become undefined above the Arctic Circle, and the
divisions become strange well before that. If you were born above 66
degrees north or south, this is not a detail: it is the reason two programs
will not give you the same chart, and the reason to prefer equal, whole sign
or Porphyry for a chart you intend to keep.</p>

<h2 id="what-our-app-does">What our app does, and why</h2>
<p>Astral Lab uses the <strong>tropical</strong> zodiac, the default for
Western practice, and the house systems it offers are listed in the app.</p>
<p>We are not going to argue that one is more correct. A zodiac is a
convention for labelling a rotation of the sky, and the two conventions exist
because different traditions want different things from them. If you work in
Jyotish, you want a sidereal ayanamsa, usually Lahiri, and you want the
houses calculated for the system your source uses, and no Western app is
going to serve that well.</p>
<p>What a Western app can do well is the part that is not a convention:
computing the positions accurately, handling the time zone and the daylight
saving rule correctly, and letting you check the result. That is where we put
the effort, and
<a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">the ephemeris comparison</a>
sets out the series we use and how to verify any app's output, including
ours, against a reference.</p>

<h2 id="how-to-check">How to check it yourself</h2>
<p>Two checks, both quick.</p>
<ol>
<li><strong>The ayanamsa.</strong> Take a position from your chart, subtract
the ayanamsa for that date, and see whether the result is the sidereal
position your sidereal source gives you. If your source uses a different
ayanamsa than the one you subtracted, the difference you see is the
difference between the two ayanamsas, not an error.</li>
<li><strong>The house system.</strong> Compute the same chart in a second
program set to a different house system, and compare the cusps rather than
the planet positions. The planets will match exactly, because the planets do
not depend on the house system. If the planets differ, you have a time
problem, not a house problem.</li>
</ol>

<h2 id="ayanamsa-faq">FAQ</h2>
<h3>Is the sidereal zodiac more accurate than the tropical one?</h3>
<p>That question has no answer inside astrology, because the two are measuring
the same sky and labelling it differently. The accuracy question that does
have an answer is whether the underlying positions are computed correctly, and
that is about the ephemeris rather than the zero point.</p>
<h3>How much does the ayanamsa change in a year?</h3>
<p>About 50 seconds of arc, which is the general precession in longitude. Over
a decade, roughly 8 minutes of arc, which is enough to move a slow planet
across a house cusp. Always use the value for the year of the chart.</p>
<h3>Do the aspects change between the two zodiacs?</h3>
<p>No. Angular separation does not depend on where the zero is, so a
conjunction, square or opposition is the same in both systems. Only the sign
labels and the house placements move, and the house movement follows the
ayanamsa.</p>
<h3>Which ayanamsa should I use?</h3>
<p>Whichever the source you are reading or the chart you are comparing
against uses. If you are working from Indian sources, it is Lahiri. If you
are reading a Western sidereal book, check which one it uses, because
Fagan-Bradley and Raman give visibly different results.</p>
<h3>Does the house system matter more than the zodiac?</h3>
<p>For most charts, yes. The zodiac choice changes sign labels; the house
system changes the houses themselves, and therefore changes which part of a
chart a planet belongs to. A planet that is in the tenth house in Placidus
can be in the ninth in Koch.</p>
"""

faqA = [
    ("Is the sidereal zodiac more accurate than the tropical one?",
     "That question has no answer inside astrology, because the two are measuring the same sky and labelling it "
     "differently. The accuracy question that does have an answer is whether the underlying positions are computed "
     "correctly, and that is about the ephemeris rather than the zero point."),
    ("How much does the ayanamsa change in a year?",
     "About 50 seconds of arc, which is the general precession in longitude. Over a decade, roughly 8 minutes of arc, "
     "which is enough to move a slow planet across a house cusp. Always use the value for the year of the chart."),
    ("Do the aspects change between the two zodiacs?",
     "No. Angular separation does not depend on where the zero is, so a conjunction, square or opposition is the same "
     "in both systems. Only the sign labels and the house placements move, and the house movement follows the ayanamsa."),
    ("Which ayanamsa should I use?",
     "Whichever the source you are reading or the chart you are comparing against uses. If you are working from Indian "
     "sources, it is Lahiri. If you are reading a Western sidereal book, check which one it uses, because Fagan-Bradley "
     "and Raman give visibly different results."),
    ("Does the house system matter more than the zodiac?",
     "For most charts, yes. The zodiac choice changes sign labels; the house system changes the houses themselves, and "
     "therefore changes which part of a chart a planet belongs to. A planet that is in the tenth house in Placidus can be "
     "in the ninth in Koch."),
]

refA = """
<section id="references">
<h2>References</h2>
<ul>
<li><a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL versus Swiss Ephemeris</a>: the series used to compute the positions, and how to check any app's output against a reference.</li>
<li><a href="astrology-aspects-guide-conjunction-opposition-trine-square.html">The four aspects</a>: what an aspect is and why the separation is independent of the zodiac.</li>
<li><a href="birth-chart-beginners-guide.html">Birth chart for beginners</a>: the parts of a chart and what each one is for.</li>
<li>The published ayanamsa tables of the Swiss Ephemeris and of the Indian government calendar. Check the value for the
year of the chart there rather than quoting a secondary source, including this one.</li>
</ul>
</section>
"""

intA = """
<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Apps:</strong> <a href="../apps/astral-lab.html">Astral Lab</a> | <a href="../apps/lunar-phase-calculator.html">Lunar Phase Calculator</a> | <a href="../apps/psi-gym.html">PSI GYM</a>
</div>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Guides:</strong> <a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL vs Swiss Ephemeris</a> | <a href="astrology-aspects-guide-conjunction-opposition-trine-square.html">The four aspects</a> | <a href="birth-chart-beginners-guide.html">Birth chart for beginners</a>
</div>
<div>
<strong style="color: var(--text-primary);">Free tools:</strong> <a href="../tools/astrology-sign-calculator.html">Astrology sign calculator</a> | <a href="../glossary.html">Magick glossary</a>
</div>
</section>
"""

ctaA = """
<section class="cta-contextual" id="try-it" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-top: 0;">A chart you can check</h3>
<p style="margin-bottom: 1rem;"><strong>Astral Lab</strong> computes tropical positions with VSOP87 and
ELP-2000, lets you pick the house system, and runs entirely on the device with
no account. $6.99 once, not a subscription.</p>
<p style="margin-bottom: 0;">
<a class="cta-button primary" href="https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart" rel="noopener">Astral Lab on Google Play ($6.99, one-time)</a>
</p>
</section>
"""

relA = """
<section class="related-articles" style="margin: 2rem 0;">
<h2 style="color: var(--accent-gold);">Read next</h2>
<div class="related-links">
<ul>
<li><a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL vs Swiss Ephemeris</a></li>
<li><a href="astrology-apps-android-guide.html">Best astrology apps for Android, compared</a></li>
<li><a href="astrology-aspects-guide-conjunction-opposition-trine-square.html">The four aspects explained</a></li>
</ul>
</div>
</section>
"""

# ======================================================================
# B. APPS DE CARTA NATAL
# ======================================================================
slugB = "birth-chart-app-accuracy-comparison"
tituloB = "Birth chart apps: how to tell which one is actually right for your chart"
h1B = "Birth chart apps: how to tell which one is actually right for your chart"
descB = ("Four questions decide whether a birth chart app is any good: the time, the ephemeris, the "
         "house system and the zodiac. A comparison, a method to check any app in ten minutes, and "
         "what to do when the birth time itself is wrong.")
kwB = ("birth chart app, natal chart app, best natal chart calculator, chart calculator app, "
       "carta natal app, natal chart accuracy, astrology birth chart app, free natal chart calculator")

tocB = [
    ("what-a-chart-is", "What a birth chart actually is"),
    ("four-questions", "The four questions that decide whether an app is any good"),
    ("accuracy", "Question 1: accuracy, and what accuracy is worth"),
    ("the-time", "Question 2: the birth time, which no app can fix"),
    ("houses", "Question 3: the house system, where the apps differ most"),
    ("zodiac", "Question 4: the zodiac, and why it is the least important"),
    ("the-options", "The options, and what each one is for"),
    ("check-it-yourself", "How to check any birth chart app in ten minutes"),
    ("when-the-time-is-wrong", "When the birth time itself is wrong"),
    ("birth-chart-faq", "FAQ"),
]

cuerpoB = """
<h2 id="what-a-chart-is">What a birth chart actually is</h2>
<p>A birth chart is a diagram of the sky at one moment, at one place. Four
things define it, and every birth chart app is making four decisions that can
be right or wrong:</p>
<ol>
<li><strong>The instant.</strong> The exact moment, in universal time, with the
timezone and the daylight saving rule of the birth place applied correctly.</li>
<li><strong>The positions.</strong> Where the planets were, computed from an
ephemeris.</li>
<li><strong>The frame.</strong> Which zodiac, and which ayanamsa if it is
sidereal.</li>
<li><strong>The division.</strong> Which house system, which turns the sky
into twelve parts.</li>
</ol>
<p>Two apps that disagree are almost always disagreeing about the first or the
fourth. The second and the third are settled questions with documented
answers, and you can check them.</p>

<h2 id="four-questions">The four questions that decide whether an app is any good</h2>
<p>Any comparison of birth chart apps that does not cover these four is
decorative. A list of features tells you what an app does, and the four
questions tell you whether you can trust what it tells you.</p>

<h2 id="accuracy">Question 1: accuracy, and what accuracy is worth</h2>
<p>Accuracy here means one thing: how close the computed position is to the
true position. The useful unit is the arcminute, and the useful conversion is
this one: <strong>one arcminute of longitude is about four seconds of birth
time</strong>, because the Ascendant moves roughly a quarter of a degree for
every minute that passes.</p>
<p>So a difference of one arcminute between two apps can put a planet in a
different house, if that planet happens to sit within an arcminute of a cusp.
A difference of one arcsecond cannot do anything to a chart at all.</p>
<p>Both the popular astrology ephemeris and the astronomy standard are in the
arcsecond class when implemented in full, and the difference between them is
not what makes two apps disagree. The
<a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">ephemeris comparison</a>
covers the series, the licences and the method for checking a position
yourself.</p>

<h2 id="the-time">Question 2: the birth time, which no app can fix</h2>
<p>This is where the errors actually live, and no amount of ephemeris
precision touches it.</p>
<ul>
<li><strong>The timezone.</strong> A birth time recorded in local time has to
be converted with the offset that was in force on that date in that place,
including any daylight saving rule that applied then and not now.</li>
<li><strong>Daylight saving.</strong> One hour of error moves the Ascendant
about 15 degrees. That is a different chart.</li>
<li><strong>The missing time.</strong> When a birth time is unknown, a program
has to assume something, and the most common assumption is noon. Noon is
rarely right, and it moves the Ascendant by up to 90 degrees depending on
where the year falls. Some programs quietly default to it without saying so,
which is the single worst behaviour in this category.</li>
<li><strong>Coordinates.</strong> Entering a city name instead of coordinates
puts the Ascendant in the right neighbourhood, and the houses in the wrong
one, because the ascendant moves about one degree for every four minutes of
latitude near the extremes.</li>
</ul>
<p>The rule to hold: if an app lets you enter coordinates, enter coordinates.
If it does not tell you what it assumed about the time, it is not telling you
enough.</p>

<h2 id="houses">Question 3: the house system, where the apps differ most</h2>
<p>The planets are the same in every app. The houses are where the disagreement
lives, and the differences are large: a planet can sit in the ninth house in
one program and the tenth in another, for a perfectly ordinary birth time.</p>
<p>There are four systems in regular use, and the choice is not a matter of
correctness. Whole sign and equal house are the well-behaved ones, and they
are what you want above the Arctic Circle, where Placidus stops producing
sensible results. Placidus is the Western default. Koch differs from Placidus
in the higher degrees. Porphyry is the Hellenistic standard and stays
sensible at high latitudes.</p>
<p>The
<a href="sidereal-vs-tropical-zodiac-lahiri-ayanamsa.html">guide to house
systems and ayanamsas</a> goes through what each one does and where it
breaks.</p>

<h2 id="zodiac">Question 4: the zodiac, and why it is the least important</h2>
<p>Most apps let you choose tropical or sidereal. It is the least consequential
of the four decisions, because the ayanamsa rotates the whole frame: the
positions are the same, the aspects are the same, and what changes is the
sign label and, through it, the house placement.</p>
<p>If two apps give you different signs for the same planet and the same
time, that is the ayanamsa and it is expected. If they give you different
positions, that is a bug or a time problem. Knowing which is which saves an
argument.</p>

<h2 id="the-options">The options, and what each one is for</h2>
<p>Three kinds of option, and they are not rivals:</p>
<table>
<thead><tr><th>Kind</th><th>What it is good for</th><th>What to watch</th></tr></thead>
<tbody>
<tr><td>Free web tools</td><td>Finding your sun sign, checking a moon phase, seeing what a chart looks like</td><td>Usually one calculation, a default house system, and no way to choose the zodiac</td></tr>
<tr><td>Paid Android apps</td><td>A full chart you own, on the device, with no account and no tracking</td><td>Check what the app says about birth time assumptions, and whether it can export the data</td></tr>
<tr><td>Professional software</td><td>Rectification, secondary progressions, heliacal work, a hundred years of ephemeris</td><td>Subscription, an account, and a learning curve that is real</td></tr>
</tbody>
</table>
<p>For most people the second row is the right one: a paid app that computes
the chart on the device, stores it locally and costs a single purchase is
both cheaper and more private than a subscription, and it does the same
arithmetic.</p>
<p>Our own comparison of the Android options, with the prices and listing
states read from the Play Store on 21 October 2026, is
<a href="astrology-apps-android-guide.html">here</a>, including the
disclosure that two of the apps in it are ours.</p>

<h2 id="check-it-yourself">How to check any birth chart app in ten minutes</h2>
<p>This works on any app, including the one you made, and including the paid
one.</p>
<ol>
<li><strong>Enter a birth time you are certain about.</strong> Use a public
figure whose time is documented, so you can compare against a printed
ephemeris.</li>
<li><strong>Write down the Sun, Moon and Ascendant degrees and minutes</strong>,
not just the signs.</li>
<li><strong>Check the Moon against a reference.</strong> The Moon moves the
most, so it is the most sensitive test. The Astronomical Almanac and the
Horizons interface both give an independent value for the same instant.</li>
<li><strong>Check the Ascendant against the same reference</strong>, with the
latitude and longitude of the place, and with the same house system.</li>
<li><strong>Now change the house system</strong> and see the cusps move. The
planets should not move at all. If they do, the app is recomputing
something it should not, and that is worth knowing before you rely on it.</li>
</ol>
<p>Expect agreement within a few arcseconds on the Moon and a couple of
arcseconds on the inner planets. If you are seeing a discrepancy of degrees,
it is the time, not the ephemeris, and step two above will find it in a
minute.</p>

<h2 id="when-the-time-is-wrong">When the birth time itself is wrong</h2>
<p>Some percentage of birth times are wrong, missing, or recorded in a
different zone. No app can repair that, and any program that offers to will
be guessing.</p>
<p>What can be done is narrower and still useful. A birth time can be
<strong>rectified</strong>: you test candidate times against the known events
of a life and see which one fits the pattern better. It is a real technique
with a real literature, it is time-consuming, and it is a separate discipline
from computing a chart. It is also the point at which the more elaborate
professional software starts to earn its price, because rectification is
easier with a hundred years of ephemeris and a house system you can change
on the fly.</p>
<p>For everyone else, the honest approach is to compute the chart with the
best time available, and to treat the parts of the chart that depend most on
the time, the Ascendant and the house placements, as provisional. The Sun
changes by about a degree a day and is nearly time-independent. The Moon
changes by half a degree an hour and is not.</p>

<h2 id="birth-chart-faq">FAQ</h2>
<h3>Which birth chart app is the most accurate?</h3>
<p>The question is not well posed until you separate the four decisions. The
positions are settled and every competent app gets them right to within an
arcsecond. What differs between apps is the time handling, the house system
and the zodiac, and those are choices rather than accuracies. Check the
positions yourself with the method above, and pick on the house system and
the privacy.</p>
<h3>Is there a free birth chart app that is actually good?</h3>
<p>For a first look, yes: the free web tools on this site compute a chart
with a stated house system, and they are enough to understand what a chart
contains. For a chart you keep, with the time handled properly, the choices
narrow down quickly.</p>
<h3>What is the difference between an astrology app and a professional program?</h3>
<p>Mostly ephemeris depth and the house systems on offer, and the ability to
rectify. If you want transits, progressions and a hundred years of data, the
professional programs earn their cost. If you want your own chart, calculated
on your device, with nothing sent anywhere, a one-off purchase app is enough
for most people.</p>
<h3>Does the chart change if I change the house system?</h3>
<p>The house placements change, sometimes by a whole house. The planet
positions do not change at all, and neither do the aspects. If a program
changes the planet positions when you switch house systems, it has a bug.</p>
"""

faqB = [
    ("Which birth chart app is the most accurate?",
     "The question is not well posed until you separate the four decisions. The positions are settled and every "
     "competent app gets them right to within an arcsecond. What differs between apps is the time handling, the "
     "house system and the zodiac, and those are choices rather than accuracies."),
    ("Is there a free birth chart app that is actually good?",
     "For a first look, yes: the free web tools here compute a chart with a stated house system, and they are enough "
     "to understand what a chart contains. For a chart you keep, with the time handled properly, the choices narrow "
     "down quickly."),
    ("What is the difference between an astrology app and a professional program?",
     "Mostly ephemeris depth and the house systems on offer, and the ability to rectify. If you want transits, "
     "progressions and a hundred years of data, the professional programs earn their cost. If you want your own chart, "
     "calculated on your device, with nothing sent anywhere, a one-off purchase app is enough for most people."),
    ("Does the chart change if I change the house system?",
     "The house placements change, sometimes by a whole house. The planet positions do not change at all, and neither "
     "do the aspects. If a program changes the planet positions when you switch house systems, it has a bug."),
]

refB = """
<section id="references">
<h2>References and further reading</h2>
<ul>
<li><a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL versus Swiss Ephemeris</a>: the accuracy question in full, with the method for checking a position against Horizons.</li>
<li><a href="sidereal-vs-tropical-zodiac-lahiri-ayanamsa.html">Tropical versus sidereal, the ayanamsa and the house systems</a>.</li>
<li><a href="birth-chart-beginners-guide.html">Birth chart for beginners</a>: what the parts of a chart are for.</li>
<li><a href="astrology-apps-android-guide.html">The Android comparison</a>, with the Play Store data read on 21 October 2026 and our disclosure.</li>
</ul>
</section>
"""

intB = """
<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Apps:</strong> <a href="../apps/astral-lab.html">Astral Lab</a> | <a href="../apps/lunar-phase-calculator.html">Lunar Phase Calculator</a> | <a href="../apps/psi-gym.html">PSI GYM</a>
</div>
<div style="margin-bottom: 1rem;">
<strong style="color: var(--text-primary);">Guides:</strong> <a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL vs Swiss Ephemeris</a> | <a href="sidereal-vs-tropical-zodiac-lahiri-ayanamsa.html">Tropical vs sidereal and the house systems</a> | <a href="birth-chart-beginners-guide.html">Birth chart for beginners</a>
</div>
<div>
<strong style="color: var(--text-primary);">Free tools:</strong> <a href="../tools/astrology-sign-calculator.html">Astrology sign calculator</a> | <a href="../tools/lunar-phase.html">Lunar phase</a>
</div>
</section>
"""

ctaB = """
<section class="cta-contextual" id="try-it" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">
<h3 style="color: var(--accent-gold); margin-top: 0;">Your own chart, on your device</h3>
<p style="margin-bottom: 1rem;"><strong>Astral Lab</strong> computes the chart with VSOP87 and ELP-2000
precision, lets you choose the house system, and keeps everything local. No
account, no tracking, $6.99 once.</p>
<p style="margin-bottom: 0;">
<a class="cta-button primary" href="https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart" rel="noopener">Astral Lab on Google Play ($6.99, one-time)</a>
</p>
</section>
"""

relB = """
<section class="related-articles" style="margin: 2rem 0;">
<h2 style="color: var(--accent-gold);">Read next</h2>
<div class="related-links">
<ul>
<li><a href="nasa-jpl-vs-swiss-ephemeris-accuracy.html">NASA JPL vs Swiss Ephemeris</a></li>
<li><a href="sidereal-vs-tropical-zodiac-lahiri-ayanamsa.html">Tropical vs sidereal, ayanamsa and house systems</a></li>
<li><a href="astrology-apps-android-guide.html">Best astrology apps for Android, compared</a></li>
</ul>
</div>
</section>
"""

for slug, titulo, h1, desc, kw, toc, cuerpo, faq, ref, intl, cta, rel in [
    (slugA, tituloA, h1A, descA, kwA, tocA, cuerpoA, faqA, refA, intA, ctaA, relA),
    (slugB, tituloB, h1B, descB, kwB, tocB, cuerpoB, faqB, refB, intB, ctaB, relB),
]:
    html = construir(slug, titulo, h1, desc, kw, FECHA, 12, slug, toc, cuerpo, faq, ref, intl, cta, rel)
    out = ROOT / "blog" / f"{slug}.html"
    out.write_text(html, encoding="utf-8")
    print("articulo escrito:", out.name, len(html), "bytes")
