import { build, PLAY, BUNDLE } from './gen-seo-hub-lib.mjs';

// ---------------------------------------------------------------- goetic sigil
build({
  slug: 'goetic-sigil.html',
  title: 'Goetic Sigil: How to Draw One for the 72 Spirits',
  desc: 'What a goetic sigil is, how to draw one for any of the 72 spirits, and how to invoke it safely. Free selector and sigil maker. No signup.',
  keywords: 'goetic sigil, goetic magic, sigil of a goetic spirit, 72 demons sigil, how to draw a goetic sigil',
  topic: 'Goetic sigils',
  kicker: 'Goetic sigil · free guide',
  h1: 'Goetic Sigils: What They Are and How to Draw One',
  lede: 'A goetic sigil is the working signature of one of the 72 spirits of the Goetia. This guide explains what the sigil is for, how to draw it from the spirit name, how to charge it, and how to invoke without inviting problems.',
  app: {
    name: 'Arcana Goetia',
    description: 'Complete Goetic grimoire on Android with the 72 spirits, their offices, seals and sigil generation.',
    price: '3.99',
  },
  items: [
    { name: 'Goetic Spirit Selector', url: '/tools/goetic-spirit-selector.html' },
    { name: 'Free Online Sigil Maker', url: '/tools/sigil-generator.html' },
    { name: 'Sigil Charging Timer', url: '/tools/sigil-charging-timer.html' },
    { name: 'Ritual Safety Checklist', url: '/tools/ritual-safety-checklist.html' },
  ],
  speak: ['h1', '#what', '#draw', '#faq-heading'],
  body: `
<h2 id="what">What a goetic sigil actually is</h2>
<p>The Goetia is the best-known section of the <em>Arcana Goetia</em>, the grimoire that closes the historical <em>Lemegeton</em>. It describes 72 spirits, and each spirit has a "seal": a symbol drawn from its name. That symbol is the goetic sigil. It is not an illustration of the spirit. It is a written shorthand, a piece of compressed language that you can draw, charge and carry.</p>
<p>That distinction matters more than it sounds. A sigil is not a picture you decorate. It is a name you compress. In sigil magick you take an intention or a name, remove the letters that carry no sound, join what remains, and end up with a shape that has one job: to hold the intention so you do not have to hold it in your head every time.</p>
<p>For the Goetia specifically, the sigil of a spirit is used to make working with that spirit faster. Drawing the sigil and speaking the spirit's name is a shorter route than reciting a long invocation. That is the entire mechanical claim. Everything else people say about goetic sigils is interpretation layered on top of a simple compression technique.</p>

<h2 id="draw">How to draw a goetic sigil, step by step</h2>
<p>You do not need the seal printed in a grimoire. You can derive it yourself. The classical method reduces the spirit name to its significant letters and shapes them.</p>
<ol>
  <li><strong>Write the spirit's name</strong> exactly as it appears in the grimoire, including the alternate name if the spirit has one. Work from one name at a time, not blended.</li>
  <li><strong>Strip the silent letters.</strong> Remove vowels that are not pronounced, then remove any remaining letters that add no sound. What is left is the skeleton of the name.</li>
  <li><strong>Group by sound.</strong> Join letters that share a sound into single shapes. Common reductions turn S into a curve, M into a doubled arch, and similar for the rest.</li>
  <li><strong>Close the shapes.</strong> Ring every group in a circle so nothing leaks. A sigil that is not closed is not finished; an open sigil disperses.</li>
  <li><strong>Charge it.</strong> Hold the intention of contact with that spirit while you draw it. A sigil drawn without intention is a shape; a sigil drawn with intention is a tool.</li>
  <li><strong>Forget the method.</strong> This step is the one people skip. After charging, put the paper away and stop thinking about the construction. A sigil you keep studying is a sigil you keep rebuilding.</li>
</ol>
<p>If you want this done by hand on a specific spirit rather than derived from a name, use the free <a href="/tools/goetic-spirit-selector.html">Goetic Spirit Selector</a> to narrow the 72 by purpose first, then work from the name it gives you.</p>

<h2 id="invoke">Invoking safely: the part people skip</h2>
<p>Goetic work has a reputation for drama that is mostly about poor technique. Three rules cover most of the risk.</p>
<ul>
  <li><strong>Have a grounding anchor before you start.</strong> Something physical and repeatable: a glass of water you drink at the end, a specific phrase you say, a light you switch off. You want an exit ritual that is boring and automatic, because that is what pulls you out of the working state.</li>
  <li><strong>Keep the working short.</strong> The commonest error is treating a goetic invocation as a long conversation. It is a short, formal contact. Fifteen focused minutes beats two hours of drifting.</li>
  <li><strong>Read the office before you call.</strong> The grimoire states what each spirit is for. Calling a spirit for something outside its office is the most reliable way to get an uninteresting result. The Arcana Goetia app keeps the offices and seals in one place so you can check before you begin.</li>
</ul>
<p>Run the <a href="/tools/ritual-safety-checklist.html">ritual safety checklist</a> before any invocation involving unfamiliar spirits. It is free, takes a minute, and it exists because this is the part that is genuinely hard to improvise.</p>

<div class="cta-box">
  <h3>The full Goetia on Android</h3>
  <p>Arcana Goetia keeps the 72 spirits, their offices, their seals and the working notes in your pocket, offline, for a single payment. No subscription, no account.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="${PLAY}" rel="noopener" target="_blank">Get Arcana Goetia on Google Play</a>
    <a class="ghost-btn" href="/apps/arcana-goetia.html">See what is inside</a>
  </div>
  <p>Prefer the written grimoires? The 8-book bundle covers the Goetia, the 72 spirits ranked and the method behind them for a single $19.99: <a href="${BUNDLE}" rel="noopener" target="_blank">get the books bundle</a>.</p>
</div>

<h2>Free maker or paid grimoire?</h2>
<table>
  <thead><tr><th>You want to</th><th>Use this</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Look up one spirit's office</td><td class="good">Goetic Spirit Selector</td><td class="good">Free</td></tr>
    <tr><td>Draw the sigil yourself</td><td class="good">Free Sigil Maker</td><td class="good">Free</td></tr>
    <tr><td>Charge and log the working</td><td class="good">Sigil Charging Timer</td><td class="good">Free</td></tr>
    <tr><td>Work from the full grimoire offline</td><td>Arcana Goetia app</td><td>$3.99 one-time</td></tr>
    <tr><td>Study the method in depth</td><td>Books bundle (8 grimoires)</td><td>$19.99</td></tr>
  </tbody>
</table>

<h2>Common mistakes when drawing goetic sigils</h2>
<p><strong>Drawing the printed seal from memory.</strong> If your line is wrong the sigil is a different name. Either trace it exactly or derive your own, but do not half-do both.</p>
<p><strong>Charging every working the same way.</strong> Repetition without variation is how people train themselves out of results. Change the anchor, the timing or the space.</p>
<p><strong>Treating the sigil as the spirit.</strong> It is a handle, not a presence. The moment you forget that, you start negotiating with a piece of paper.</p>
<p><strong>Never finishing.</strong> The most common incomplete sigil is a forgotten sigil. If you drew it, charged it and then went back to check your letters, you rebuilt it.</p>

<div class="verdict">
  <p>A goetic sigil is a compressed name. Draw it from the spirit's name, close every shape, charge it once with a clear intention, and leave it alone. The method is short enough to learn in an evening, which is why the expensive tools in this space sell convenience rather than results: the selector to find the spirit, the timer to charge it properly, and the grimoire to check the office before you call.</p>
</div>
`,
  faqTitle: 'Goetic sigil questions',
  faq: [
    ['What is a goetic sigil?', 'It is the written seal of one of the 72 spirits of the Goetia, drawn by compressing the spirit name into closed shapes. It is used as a short, repeatable form of address when working with that spirit.'],
    ['How do I draw a goetic sigil?', 'Write the spirit name, strip silent letters, group the remaining letters by sound, close every group in a circle, charge it with a clear intention, and then stop thinking about how it was made.'],
    ['Do I need the printed seal?', 'No. Deriving your own is the classical method. If you prefer the traditional seal, trace it exactly rather than approximating it from memory.'],
    ['Is it safe to work with the spirits of the Goetia?', 'Risk comes from technique, not from the names. Set a physical grounding anchor first, keep the working short, and read each spirit office before you call it. Those three habits cover most of it.'],
    ['Do I need an app to draw a goetic sigil?', 'Not to draw one. You need a free sigil maker and a charging timer, both available on this site at no cost. The paid app is for reading the grimoire offline, not for the drawing itself.'],
    ['How long should I charge a sigil?', 'Long enough to hold one clear intention without drift. A few focused minutes beats an hour of thinking about it, because over-charging is the same failure as not charging at all.'],
    ['Can I carry a goetic sigil with me?', 'Yes, once charged and finished. Carrying it is a reminder of the intention, not a new working, which is exactly why the forget step matters before you put it away.'],
    ['What is the cheapest way to start with goetic magic?', 'The free tools on this site: the spirit selector to choose a spirit, the sigil maker to draw, and the charging timer to finish. The 8-book grimoire bundle covers the theory for $19.99 if you want the full method.'],
  ],
  next: 'Use the Goetic Spirit Selector to pick a spirit by purpose, draw its sigil with the free maker, and finish with the charging timer. If you want the grimoire itself, Arcana Goetia is $3.99 on Google Play.',
});

// ------------------------------------------------------------ ephemeris accuracy
build({
  slug: 'ephemeris-accuracy.html',
  title: 'Ephemeris Accuracy: Why Your Birth Chart Is Off',
  desc: 'Why cheap ephemeris data shifts planets by days and ruins a birth chart. Simple approximation vs Swiss Ephemeris vs VSOP87, and when it matters.',
  keywords: 'ephemeris accuracy, swiss ephemeris vs approximation, accurate birth chart app, vsop87 accuracy, birth chart wrong ascendant',
  topic: 'Ephemeris accuracy',
  kicker: 'Ephemeris accuracy · the boring part that matters',
  h1: 'Ephemeris Accuracy: Why Cheap Data Shifts Your Birth Chart',
  lede: 'Most birth charts that "look wrong" are not wrong in the interpretation. They are wrong in the arithmetic. The difference between a cheap planetary approximation and a real ephemeris can move your Moon, your Ascendant and entire aspects across whole degrees.',
  app: {
    name: 'Astral Lab',
    description: 'Professional natal charts on Android computed with VSOP87 planetary theory, live transits and an aspect grid.',
    price: '6.99',
  },
  items: [
    { name: 'Free Birth Chart', url: '/tools/full-birth-chart.html' },
    { name: 'Astrology Sign Calculator', url: '/tools/astrology-sign-calculator.html' },
    { name: 'Rising Sign Calculator', url: '/tools/rising-sign-calculator.html' },
    { name: 'Planetary Retrograde Calendar', url: '/tools/planetary-retrograde-calendar.html' },
  ],
  speak: ['h1', '#problem', '#methods', '#faq-heading'],
  body: `
<h2 id="problem">The problem: everyone rounds the planets down</h2>
<p>A planet's position is not a nice number. Pluto at 14 degrees 47 minutes 22 seconds is not 14 degrees, and at certain points in the year the difference between the true value and the rounded one is not subtle.</p>
<p>Where it bites hardest is the fast-moving and the boundary cases:</p>
<ul>
  <li><strong>The Moon.</strong> It moves about 13 degrees a day, so half a degree is nearly three hours of sign drift. If your birth was near midnight, a rounding error can put the Moon in the previous sign.</li>
  <li><strong>The Ascendant.</strong> It can move a full degree every four minutes. Get the birth time slightly wrong, or the ephemeris slightly wrong, and the whole chart is built on a rotated base.</li>
  <li><strong>Retrograde boundaries.</strong> Whether a planet is stationing direct or stationing retrograde decides which house it lands in. That is a binary outcome decided by seconds of arc.</li>
</ul>
<p>This is why the same birth data can produce two charts that disagree about everything, when both were computed on a phone.</p>

<h2 id="methods">Three levels of accuracy, and what each buys you</h2>
<p><strong>Level 1: mean positions.</strong> The classic approach averages a planet's orbit over time to get a smooth curve, then samples that curve. It is cheap and fast and it is wrong by a small amount that grows and shrinks depending on the planet and the century. For a Moon placement, the error can be large enough to change the sign.</p>
<p><strong>Level 2: VSOP87.</strong> A semi-analytic theory of planetary motion with thousands of periodic terms, published by the Paris Observatory. It is accurate to arcseconds-level for the planets over the modern era and it is what serious astrology software uses by default. Astral Lab computes with VSOP87 for exactly this reason.</p>
<p><strong>Level 3: numerical integration.</strong> You integrate the equations of motion numerically from an initial state. This is the most physically honest approach and also the slowest, which is why you mostly see it in research code rather than in apps.</p>
<p>The practical gap between level 1 and level 2 is small in absolute terms and enormous in practical terms, because astrological interpretation cares about signs, houses and exact aspects, all of which are threshold decisions. A threshold plus a rounding error is a coin flip.</p>

<h2>Where the "NASA vs Swiss Ephemeris" debate comes from</h2>
<p>You will see forum arguments about JPL ephemerides versus Swiss Ephemeris. Both are real, both are accurate, and the argument is usually about the wrong thing. JPL publishes positions of solar system bodies for astronomy. Swiss Ephemeris is a precision astrology library. Neither is "more correct" in general: they serve different purposes, and the difference between them is far smaller than the difference between either of them and a mean-position approximation.</p>
<p>The practical rule: if a chart is computed by hand-tapping formulas into a spreadsheet, expect the Moon to be wrong. If it is computed by a library implementing VSOP87 or equivalent, expect it to be right. Everything else is philosophy.</p>

<div class="cta-box">
  <h3>Astral Lab: VSOP87 natal charts, offline</h3>
  <p>Professional chart computation with VSOP87 planetary theory, real-time transits and a full aspect grid. Single payment, no subscription, no account.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="${PLAY}" rel="noopener" target="_blank">Get Astral Lab on Google Play</a>
    <a class="ghost-btn" href="/apps/astral-lab.html">See the features</a>
  </div>
  <p>Working through astrology in general? The 8-book bundle covers sigil magick, the occult tradition and the astronomy behind the symbols for one $19.99 payment: <a href="${BUNDLE}" rel="noopener" target="_blank">get the books bundle</a>.</p>
</div>

<h2>What to do if your chart looks wrong</h2>
<p>Work through it in order. Most apparent errors are one of these four, and none of them needs new software.</p>
<ol>
  <li><strong>Confirm the birth time.</strong> Most chart disputes are birth-time disputes. A chart certificate or a birth record beats a memory, especially for anything involving the Ascendant or houses.</li>
  <li><strong>Check the Moon sign specifically.</strong> It is the single most sensitive position to both time and data precision. If the Moon is the only thing that looks off, suspect one or both.</li>
  <li><strong>Look for planets within a degree of a sign boundary.</strong> A planet at 0 degrees 20 minutes could legitimately be read as either sign. That is a real ambiguity, not an error.</li>
  <li><strong>Only then suspect the software.</strong> If the chart came from a reputable library and the data was right, the arithmetic was right. Do not blame the tool for a disagreement in interpretation.</li>
</ol>

<h2>Free chart first, paid app second</h2>
<table>
  <thead><tr><th>Need</th><th>Tool</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>A chart to look at today</td><td class="good">Free Birth Chart</td><td class="good">Free</td></tr>
    <tr><td>Sun, Moon and Ascendant in one instant</td><td class="good">Astrology Sign Calculator</td><td class="good">Free</td></tr>
    <tr><td>Check the Ascendant specifically</td><td class="good">Rising Sign Calculator</td><td class="good">Free</td></tr>
    <tr><td>Retros and stations for interpretation</td><td class="good">Planetary Retrograde Calendar</td><td class="good">Free</td></tr>
    <tr><td>Professional-grade VSOP87 charts and transits</td><td>Astral Lab app</td><td>$6.99 one-time</td></tr>
  </tbody>
</table>

<div class="verdict">
  <p>Accuracy problems in birth charts are almost always precision problems, not software problems. Mean-position data plus a birth time near a boundary will produce a chart that no interpretation can rescue. If your chart matters to you, start with the free chart tool to see the shape of it, then use an app that computes with a real planetary theory like VSOP87 if you intend to work with it seriously. The $6.99 buys correctness that a free calculator will not give you, and nothing else.</p>
</div>
`,
  faqTitle: 'Ephemeris and birth chart accuracy questions',
  faq: [
    ['How accurate does a birth chart need to be?', 'Accurate enough that no planet sits within a rounding error of a sign or house boundary. In practice that means a real planetary theory such as VSOP87 rather than mean-position approximations.'],
    ['What is VSOP87?', 'A semi-analytic planetary theory published by the Paris Observatory, accurate to roughly arcsecond level over the modern era. It is the default in serious astrology software, and it is what Astral Lab uses.'],
    ['Is a free birth chart calculator inaccurate?', 'The free chart tools on this site are symbolic approximations for exploration, not professional computation. They are fine for learning the shape of a chart and useless for arc-level precision.'],
    ['Does ephemeris accuracy affect the Moon sign?', 'Most of all, yes. The Moon moves about 13 degrees a day, so a small error can shift it into the previous sign. It is the position most sensitive to both data precision and birth-time error.'],
    ['Does it matter if my Ascendant is off by a degree?', 'A lot. The Ascendant moves roughly one degree every four minutes, so a degree of error moves the entire house structure. Everything after the Ascendant is built on it.'],
    ['Are Swiss Ephemeris and NASA JPL data different?', 'They are different tools for different purposes and the difference between them is minor. The gap that actually changes charts is between either of them and a simple mean-position approximation.'],
    ['Why does my chart disagree with another astrologer?', 'Usually birth time, not software. Confirm the exact time first; a chart with the wrong Ascendant and wrong houses cannot be reconciled by interpretation.'],
    ['Do I need a paid app to get an accurate chart?', 'For a correct chart, yes, some form of real ephemeris computation is needed. Free tools on this site are for exploration; a VSOP87 app is a single $6.99 payment with no subscription.'],
  ],
  next: 'Start with the free Birth Chart tool to see the shape of your chart. If you are working with it seriously, Astral Lab computes with VSOP87 for a single $6.99 payment.',
});