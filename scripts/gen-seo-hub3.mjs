import { build, PLAY, BUNDLE } from './gen-seo-hub-lib.mjs';

// ------------------------------------------------------------------ i ching app
build({
  slug: 'i-ching-app.html',
  title: 'I Ching App: Free Online Readings or a $3.99 App?',
  desc: 'The I Ching needs no app, but a free online tool beats three coins in a pocket. Compare free 3-coin readings, changing lines and a $3.99 offline app.',
  keywords: 'i ching app, free i ching online, i ching oracle app, three coin method i ching, i ching changing lines',
  topic: 'I Ching apps',
  kicker: 'I Ching app · honest comparison',
  h1: 'I Ching App: What You Actually Need to Cast a Reading',
  lede: 'The I Ching is three thousand years old and works with three coins. Some of the best tools for it are free and run in a browser. This is what each option is actually for, and when paying for one is worth it.',
  app: {
    name: 'I Ching Oracle',
    description: 'Authentic three-coin method, all 64 hexagrams with full interpretation, and a saved reading history. Offline, multilingual.',
    price: '3.99',
  },
  items: [
    { name: 'Free Online I Ching Oracle', url: '/tools/iching.html' },
    { name: 'I Ching Changing Lines Simulator', url: '/tools/iching-changing-lines.html' },
    { name: 'Free Lunar Phase Calculator', url: '/tools/lunar-phase.html' },
    { name: 'Planetary Hour Calculator', url: '/tools/planetary-hours.html' },
  ],
  speak: ['h1', '#need', '#free', '#faq-heading'],
  body: `
<h2 id="need">What an I Ching app is supposed to do</h2>
<p>Strip away the ornament and an I Ching tool has exactly four jobs: cast, interpret, track changing lines and remember what you read before. Everything else in the category is decoration.</p>
<p>Casting is trivial arithmetic: three coins, six tosses, six lines, one hexagram. Any competent program does it correctly. The parts that actually distinguish a good tool from a bad one are the interpretation text and the history, because those are the two things you cannot do in your head at 2am.</p>
<p>That is worth saying plainly, because most "I Ching apps" in the stores are worse than the free browser version on this site. If you want to know whether to install anything at all, keep reading.</p>

<h2 id="free">The free route, and when it is genuinely enough</h2>
<p>For a weekly or monthly consultation, the free route is not a compromise. It is complete.</p>
<ul>
  <li><strong>Free Online I Ching Oracle</strong> gives you the authentic three-coin method and all 64 hexagrams with interpretation, with no account and no signup. Cast from the browser in seconds.</li>
  <li><strong>I Ching Changing Lines Simulator</strong> adds visual mutating lines, which is the part people usually get wrong: a changing line in the lower trigram and a changing line in the upper trigram produce different resulting hexagrams.</li>
  <li><strong>Free Lunar Phase Calculator</strong> lets you check the timing before you cast. Traditional practice favours the waxing and full moon, and it costs nothing to verify.</li>
</ul>
<p>Those three cover casting, interpretation and timing for free. If your use case stops there, installing an app is spending money to do something your browser already does.</p>

<div class="cta-box">
  <h3>Cast a reading now, free</h3>
  <p>The free I Ching tool on this site uses the same three-coin method as the paid app, with all 64 hexagrams and no signup.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="/tools/iching.html">Open the free I Ching</a>
    <a class="ghost-btn" href="/tools/iching-changing-lines.html">See changing lines</a>
  </div>
</div>

<h2 id="paid">When paying for the I Ching app is worth it</h2>
<p>Three situations justify the $3.99.</p>
<ol>
  <li><strong>You consult often.</strong> Daily or near-daily practice means the reading history becomes the point. You start to see which hexagrams keep arriving for you, and no browser-only workflow supports that well.</li>
  <li><strong>You have no connectivity.</strong> The app works offline. Some ritual work is easier when the phone is not the object of attention.</li>
  <li><strong>You work across languages.</strong> The app is multilingual, which matters if you are consulting with hexagram names in more than one language.</li>
</ol>
<p>What it does not buy you is a better cast. Three coins and correct arithmetic are correct three coins and correct arithmetic either way.</p>

<div class="cta-box">
  <h3>I Ching Oracle for Android</h3>
  <p>Authentic three-coin method, all 64 hexagrams, changing lines and a saved reading history. Offline, multilingual, single payment.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="${PLAY}" rel="noopener" target="_blank">Get I Ching Oracle on Google Play</a>
    <a class="ghost-btn" href="/apps/iching-oracle.html">See what is inside</a>
  </div>
  <p>Studying the tradition around the hexagrams? The 8-book bundle is a single $19.99 payment: <a href="${BUNDLE}" rel="noopener" target="_blank">get the books bundle</a>.</p>
</div>

<h2>Free versus paid, side by side</h2>
<table>
  <thead><tr><th>Feature</th><th>Free tools here</th><th>I Ching Oracle app</th></tr></thead>
  <tbody>
    <tr><td>Three-coin cast</td><td class="good">Yes</td><td class="good">Yes</td></tr>
    <tr><td>All 64 hexagrams</td><td class="good">Yes</td><td class="good">Yes</td></tr>
    <tr><td>Changing lines with resulting hexagram</td><td class="good">Yes</td><td class="good">Yes</td></tr>
    <tr><td>Works offline</td><td class="bad">No</td><td class="good">Yes</td></tr>
    <tr><td>Saved reading history</td><td class="bad">No</td><td class="good">Yes</td></tr>
    <tr><td>Multilingual</td><td class="bad">Single language</td><td class="good">Yes</td></tr>
    <tr><td>Cost</td><td class="good">Free</td><td>$3.99 once</td></tr>
  </tbody>
</table>

<h2>How to cast the three coins correctly</h2>
<p>Quick reference, because the method is simple and easy to get subtly wrong.</p>
<ol>
  <li>Hold three coins of one denomination. Heads is 3, tails is 2.</li>
  <li>Toss all three. The total is 6, 7, 8 or 9. Six and nine are <em>yin</em> lines, seven and eight are <em>yang</em> lines. A 6 is a changing yin line and a 9 is a changing yang line.</li>
  <li>Repeat six times. The first toss is the bottom line, the sixth is the top line.</li>
  <li>Build the lower trigram from lines 1 to 3 and the upper trigram from lines 4 to 6. That is your primary hexagram.</li>
  <li>If any line was 6 or 9, flip those lines to their opposite and that is your <em>changing into</em> hexagram. The changing lines are where the reading lives.</li>
  <li>Read from the bottom line upward, as written. Read the changing lines first if they exist.</li>
</ol>

<div class="verdict">
  <p>The I Ching does not need an app. It needs three coins and somewhere to write down what you saw. The free tools on this site cover casting, interpretation and changing lines with no account, which is enough for anyone consulting weekly. The $3.99 app earns its place only when you want offline use and a history of your readings, not when you want a more accurate cast, because there is no such thing here.</p>
</div>
`,
  faqTitle: 'I Ching app questions',
  faq: [
    ['Do I need an app to use the I Ching?', 'No. Three coins and a surface to toss them on are the traditional method. Apps and online tools are conveniences for interpretation and record keeping, not requirements.'],
    ['Is there a free I Ching I can use online?', 'Yes. The free I Ching tool on this site runs the authentic three-coin method with all 64 hexagrams, no signup and no account.'],
    ['What is the difference between a free and a paid I Ching app?', 'Casting accuracy is identical. Paid versions add offline use, a saved reading history and multiple languages, which matter if you consult often.'],
    ['What does the I Ching Oracle app cost?', 'A single $3.99 payment. There is no subscription and nothing recurring to cancel.'],
    ['How do I read changing lines?', 'A line totalling 6 is a changing yin line and 9 is a changing yang line. Flip those lines to get your resulting hexagram, and read those lines first, from the bottom up.'],
    ['Which hexagram do I read first?', 'Read from the bottom line upward, as written. If there are changing lines, those are the core of the reading. If there are none, read the primary hexagram in order.'],
    ['Does the app work offline?', 'Yes. The paid Android app runs entirely offline, which some people prefer for ritual work. The free browser tools require a connection.'],
    ['What else should I have when I consult the I Ching?', 'A free lunar phase calculator to check timing, and a quiet fifteen minutes. The 8-book bundle covers the tradition for $19.99 if you want the theory behind the hexagrams.'],
  ],
  next: 'Cast a free reading with the I Ching tool on this site. If you consult daily or want offline use and history, I Ching Oracle is $3.99 once on Google Play.',
});

// ----------------------------------------------------------------- celtic cross
build({
  slug: 'celtic-cross.html',
  title: 'Celtic Cross Tarot Spread: All 10 Positions Explained',
  desc: 'Every one of the 10 Celtic Cross positions explained, what each card pair actually means, and a free spread builder. No signup, works offline.',
  keywords: 'celtic cross spread, celtic cross 10 positions, tarot celtic cross meaning, celtic cross layout, how to do a celtic cross reading',
  topic: 'Celtic Cross spread',
  kicker: 'Celtic Cross · all 10 positions',
  h1: 'Celtic Cross Tarot Spread: All 10 Positions Explained',
  lede: 'Ten cards, one centre axis and a staff of four. The Celtic Cross is the most-used deep reading in tarot, and it is also the most frequently misremembered. Here is every position, what it actually answers, and how to read the pairs.',
  app: {
    name: 'Unofficial Rider Waite Tarot',
    description: 'The complete Rider-Waite deck offline on Android with six spreads including the Celtic Cross, in seven languages.',
    price: '9.99',
  },
  items: [
    { name: 'Tarot Spread Builder', url: '/tools/tarot-spread-builder.html' },
    { name: 'Tarot Card Reference', url: '/tools/tarot-card-reference.html' },
    { name: 'Tarot Yes or No', url: '/tools/tarot-yes-no.html' },
    { name: 'Tarot Journal', url: '/tools/tarot-journal.html' },
  ],
  speak: ['h1', '#positions', '#pairs', '#faq-heading'],
  body: `
<h2 id="positions">The ten positions</h2>
<p>Shuffle, cut, and lay the cards in this order. Positions 1 to 3 form the horizontal arm, positions 1 to 6 the vertical staff.</p>
<ol>
  <li><strong>Present.</strong> The heart of the matter, the core of the situation right now. If one card could answer the question, this is it.</li>
  <li><strong>Crossing.</strong> What cuts across the present: the obstacle, the tension, the thing working against you. Often internal.</li>
  <li><strong>Foundation.</strong> The root, below the conscious surface. What is actually generating the situation.</li>
  <li><strong>Recent past.</strong> The energy that is leaving, usually fading within days or weeks.</li>
  <li><strong>Crown.</strong> The conscious goal, the conscious intention, what you are aiming at on purpose.</li>
  <li><strong>Near future.</strong> The next development, arriving soon.</li>
  <li><strong>Self.</strong> Your own attitude and role in the situation, as you are currently holding it.</li>
  <li><strong>Environment.</strong> Other people, external influences, what everyone else brings to it.</li>
  <li><strong>Hopes and fears.</strong> Often the same card, or a pair that contradicts itself. This position is where you are most likely to be honest with yourself.</li>
  <li><strong>Outcome.</strong> Where this is heading if nothing changes. Conditional, not fixed.</li>
</ol>

<h2 id="pairs">How to read the pairs, and why it matters</h2>
<p>Most bad Celtic Cross readings read ten cards in isolation. The spread is designed to be read in pairs, and that is where the structure lives.</p>
<ul>
  <li><strong>1 and 2 (Present and Crossing)</strong> is the central conflict. Present against obstacle. The tension of the situation in one line.</li>
  <li><strong>3 and 4 (Foundation and Past)</strong> is the cause. What is buried under what just happened. Read 3 first, then 4 as its consequence.</li>
  <li><strong>5 and 6 (Crown and Future)</strong> is the trajectory. Conscious intention meeting probable arrival.</li>
  <li><strong>1 and 10 (Present and Outcome)</strong> is the whole reading in two cards: where you are versus where it ends. If these two are the same card, the situation is already resolved, in one direction or the other.</li>
  <li><strong>7, 8 and 9</strong> are the moving part: your attitude, the outside influence, and the hidden motive. Read as a conversation between three people.</li>
</ul>
<p>The staff of four on the right is the staff in many traditional cartomancy layouts. It is read from the bottom up, 4 to 1, which is why it is sometimes called the ascending staff.</p>

<div class="cta-box">
  <h3>Build the layout before you shuffle</h3>
  <p>The free spread builder sets out the positions, lets you write the question above each one and keeps your notes next to the cards. No signup.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="/tools/tarot-spread-builder.html">Open the spread builder</a>
    <a class="ghost-btn" href="/tools/tarot-card-reference.html">Look up a card</a>
  </div>
</div>

<h2>Before you start: the four questions that ruin the reading</h2>
<ol>
  <li><strong>Asking a yes/no question and then reading all ten cards.</strong> A yes/no reading is one card. If you want depth, ask an open question.</li>
  <li><strong>Laying it out with no question.</strong> The cards answer something. If you do not know what, the reading will feel unfocused and you will invent meaning to compensate.</li>
  <li><strong>Reversals without a decision.</strong> Decide whether you are reading reversals before you shuffle, not while reading card seven.</li>
  <li><strong>Interpreting position 10 as fate.</strong> It is a conditional outcome, not a sentence. It describes the path that is open while the present holds.</li>
</ol>

<h2>Free tools versus a complete deck app</h2>
<table>
  <thead><tr><th>Need</th><th>Tool</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Set out and note the 10 positions</td><td class="good">Tarot Spread Builder</td><td class="good">Free</td></tr>
    <tr><td>Look up meanings while reading</td><td class="good">Tarot Card Reference</td><td class="good">Free</td></tr>
    <tr><td>A fast answer, not a deep one</td><td class="good">Tarot Yes or No</td><td class="good">Free</td></tr>
    <tr><td>Record every reading</td><td class="good">Tarot Journal</td><td class="good">Free</td></tr>
    <tr><td>Shuffle and draw offline, 6 spreads</td><td>Rider Waite Tarot app</td><td>$9.99 one-time</td></tr>
    <tr><td>Learn the deck and the method</td><td>Books bundle (8 grimoires)</td><td>$19.99</td></tr>
  </tbody>
</table>

<div class="cta-box">
  <h3>The full Rider-Waite deck on Android</h3>
  <p>The complete deck offline with six spreads including the Celtic Cross, card meanings built in, seven languages. Single payment, no subscription.</p>
  <div class="btn-row">
    <a class="play-store-btn" href="${PLAY}" rel="noopener" target="_blank">Get Rider Waite Tarot on Google Play</a>
    <a class="ghost-btn" href="/apps/unofficial-rider-waite-tarot.html">See the spreads</a>
  </div>
  <p>Want the method behind the cards, not just the deck? The 8-book bundle is $19.99 once: <a href="${BUNDLE}" rel="noopener" target="_blank">get the books bundle</a>.</p>
</div>

<div class="verdict">
  <p>The Celtic Cross is ten positions and five pairs. Read the pairs, not the cards in isolation: one and two for the conflict, three and four for the cause, five and six for the trajectory, and one against ten for the whole arc. Set the layout out with the free spread builder, look meanings up as you go, and if you intend to read this spread weekly the $9.99 deck app earns its place because it shuffles, draws and remembers offline. If it is once a month, the free tools on this site are already enough.</p>
</div>
`,
  faqTitle: 'Celtic Cross questions',
  faq: [
    ['What does the Celtic Cross spread have 10 positions for?', 'Ten cards answer more than one question: the present situation, its obstacle, its root, its direction, your own role, outside forces, hidden motives and the likely outcome, all in one layout.'],
    ['Which cards are read first in a Celtic Cross?', 'Read the pairs, not the cards in isolation. Positions one and two for the central conflict, three and four for the cause, five and six for the trajectory, and one against ten for the whole arc.'],
    ['Do I need a physical deck to do a Celtic Cross?', 'No. The free spread builder on this site sets out the layout and keeps your notes next to each position, and there are free card reference tools for meanings.'],
    ['What are the three cards in the middle of the Celtic Cross?', 'Position seven is the Self, position eight is the Environment and position nine is Hopes and Fears. Read them as a conversation between three parties.'],
    ['Should I read reversed cards in a Celtic Cross?', 'Either way, but decide before you shuffle. Reversals add a layer of tension and are more useful for question-shaped readings than for yes/no ones.'],
    ['Is the staff on the right read separately?', 'Yes. It is the staff of four from traditional cartomancy and is read from the bottom up, position four to position one.'],
    ['Do I need an app to do a Celtic Cross reading?', 'No, but frequent readers usually want offline shuffling and a saved history. The Rider Waite Tarot app is $9.99 once and includes the Celtic Cross among six spreads.'],
    ['How long should a Celtic Cross reading take?', 'Twenty to thirty minutes unhurried is enough for the pairs. The mistake is reading all ten cards in isolation, which doubles the length and loses the structure.'],
  ],
  next: 'Set out the layout with the free Tarot Spread Builder, then use the free card reference while you read. For offline shuffling and history, the Rider Waite Tarot app is $9.99 once.',
});