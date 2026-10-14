// Bloque 1 de paginas de apoyo SEO: astrology app reviews, birth chart app, horoscope app.
import { build, PLAY, BUNDLE } from './gen-seo-hub-lib.mjs';

const CTATOOLS = `
        <div class="cta-box">
            <h3>Everything on this page, free in the browser</h3>
            <p>No account, no signup. Each tool runs locally in your browser and sends nothing to a server.</p>
            <div class="btn-row">
                <a class="play-store-btn" href="${PLAY}" rel="noopener">See the 12 apps on Google Play</a>
                <a class="ghost-btn" href="apps/index.html">Read the app catalogue</a>
            </div>
        </div>`;

const BUNDLEBOX = `
        <div class="cta-box">
            <h3>The written system behind these tools</h3>
            <p>Eight books cover the full method: chart reading, sigils, servitors, lunar work and the goetic tradition. One bundle, one price, PDF.</p>
            <div class="btn-row">
                <a class="play-store-btn" href="${BUNDLE}" rel="noopener">Get the 8-book bundle</a>
                <a class="ghost-btn" href="books/index.html">Browse the books</a>
            </div>
        </div>`;

build({
  slug: 'astrology-app-reviews.html',
  title: 'Astrology App Reviews: 12 Android Apps, Real Ratings',
  desc: 'Honest reviews of the best astrology apps for Android in 2026. What each one is actually good for, which ones stay free, and where the paywalls start.',
  keywords: 'astrology app, astrology apps, astrology app reviews, best astrology app for android, astrology app free, android horoscope app, zodiac app',
  topic: 'Astrology apps',
  kicker: 'Reviewed &middot; 2026',
  h1: 'Astrology App Reviews: The 12 Android Apps Worth Installing',
  lede: 'Most astrology apps are the same three features wrapped in a subscription. These are the ones that do something different, what each one costs, and the honest reason to skip the rest.',
  app: {
    name: 'Astral Lab',
    price: '6.99',
    description: 'Android natal chart app with full ephemeris data, aspect patterns, transit alerts and a grimoire of meanings. One-time purchase, works offline, no subscription.'
  },
  items: [
    { name: 'Astral Lab', url: '/apps/astral-lab.html' },
    { name: 'Lunar Phase Calculator', url: '/apps/lunar-phase-calculator.html' },
    { name: 'Chaos Sigil Generator', url: '/apps/chaos-sigil-generator.html' },
    { name: 'Psi Gym', url: '/apps/psi-gym.html' },
    { name: 'Norse Rune Oracle', url: '/apps/norse-rune-oracle.html' },
    { name: 'NOCTEM Tools', url: '/apps/noctem-tools.html' }
  ],
  speak: ['h1', '#why-list', '#table-heading', '#verdict-heading', '#faq-heading'],
  body: `
        <h2 id="why-list">Why most astrology apps are not worth installing</h2>
        <p>The app stores are full of astrology products that offer one calculation, three free interpretations, and then a weekly subscription for everything else. The subscription is the product. The chart is the funnel. If you open an app, cast your chart, and hit a paywall before you get a single line of interpretation, you have been sold a preview.</p>
        <p>There is a second problem: almost none of them work without a connection. A subscription app in a temple, in a ritual, or on a train is useless, because the moment you need it is exactly the moment there is no signal.</p>
        <p>The apps that survive a year of use in this catalogue solve at least one of those two problems: they either give the whole thing away once, or they keep working with no network.</p>

        <h2 id="table-heading">The 12 apps, ranked by what they are good for</h2>
        <table>
            <thead><tr><th>App</th><th>Does it best at</th><th>Price</th><th>Offline</th></tr></thead>
            <tbody>
                <tr><td>Astral Lab</td><td>Full natal chart, aspects, transits, meanings</td><td>$6.99 once</td><td class="good">Yes</td></tr>
                <tr><td>NOCTEM Tools</td><td>The whole occult box in one app: sigils, gnosis, runes, banishing, journal</td><td>$14.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Lunar Phase Calculator</td><td>Moon phase, illumination, sign and timing for lunar work</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Chaos Sigil Generator</td><td>Drawing and storing sigils with a library per intention</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Psi Gym</td><td>Psi testing, shifting and application practice</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Norse Rune Oracle</td><td>Rune pulls with full futhark meanings</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Unofficial Rider-Waite Tarot</td><td>Full 78-card deck with reversals and spreads</td><td>$9.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Eerie Roads</td><td>Roadside and place divination with historical context</td><td>$9.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Lucid Dream</td><td>Lucid dreaming timers and reality-check training</td><td>$9.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Dream Machine</td><td>Dream journaling, symbol lookup and hypnagogia work</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>Arcana Goetia</td><td>The 72 spirits, ranked, with working notes</td><td>$3.99 once</td><td class="good">Yes</td></tr>
                <tr><td>I Ching Oracle</td><td>Coin toss, hexagram lookup and changing lines</td><td>$3.99 once</td><td class="good">Yes</td></tr>
            </tbody>
        </table>
        <p>Every price on this list is a single payment. No app in this catalogue has a subscription, a trial that expires, or a feature that unlocks monthly.</p>

        <h2 id="astro-reviews">Astrology app reviews, one by one</h2>
        <h3>Astral Lab &mdash; the chart app</h3>
        <p>This is the one that replaces the standard astrology subscription apps. It calculates a full natal chart with proper ephemeris data, lays out the aspect patterns rather than dumping a list, gives you the meanings attached to each placement, and flags transits as they happen. It is $6.99 once and it runs with no connection, so you can open it mid-practice and it does not matter whether you have signal.</p>
        <p><a href="apps/astral-lab.html">Read the full Astral Lab page</a> or try the <a href="tools/full-birth-chart.html">free full birth chart in the browser</a> first, which uses the same approach and costs nothing.</p>
        <h3>NOCTEM Tools &mdash; the box of tools</h3>
        <p>Not an astrology app in the strict sense, but it is the one people buy when they want the whole working set rather than one calculation. Sigils, gnosis timers, runic name translation, banishing routines and a grimoire journal, in one install. $14.99 once. If you are going to buy more than two of the cheaper apps, this is the cheaper route.</p>
        <h3>Lunar Phase Calculator &mdash; the timing app</h3>
        <p>Moon phase, illumination percentage, the sign the moon is in, and the timing windows for the lunar work that actually depends on them. Small app, single purpose, $3.99 once. There is a free version of the phase data in the browser too.</p>
        <h3>Psi Gym &mdash; the practice app</h3>
        <p>Zener card testing, psi testing and shift work, and a place to log results over weeks. It is the only app here aimed at developing a capacity rather than interpreting a symbol. $3.99 once.</p>
        <h3>The divination apps</h3>
        <p>Tarot, runes, the I Ching and the Goetia each get a dedicated app with the full material inside: all 78 cards with reversals, all 24 futhark runes, the full hexagram table with changing lines, and the 72 spirits ranked. None of them hides the content behind a subscription, because the content is the point.</p>
${CTATOOLS}

        <h2 id="verdict-heading">Which astrology app should you actually install?</h2>
        <div class="verdict">
            <p>If you want one app that replaces the whole subscription tier, take <strong>Astral Lab at $6.99</strong>. It is the chart app, it is complete, and it is a single payment.</p>
            <p>If your practice spans more than one system, take <strong>NOCTEM Tools at $14.99</strong> instead of three $3.99 apps and get the box of tools with it.</p>
            <p>If you are still deciding, cast a free chart in the browser first. It costs nothing and it tells you whether the app is worth $6.99 to you.</p>
        </div>
${BUNDLEBOX}`,
  faqTitle: 'Astrology app questions',
  faq: [
    ['What is the best astrology app for Android?', 'Astral Lab at Cha0smagick Labs. It calculates a full natal chart with aspect patterns and transit flags, gives the meanings for each placement, costs $6.99 once and works with no connection.'],
    ['Are there free astrology apps that are actually usable?', 'The browser tools on this site are free and complete: the full birth chart, the sign calculators, the lunar phase data and the planetary hours table all run without an account. The apps are the offline, portable version of the same work.'],
    ['Do any of these apps have subscriptions?', 'No. Every app in this catalogue is a single payment with no recurring fee, no trial and no monthly unlock. That is the whole point of the model.'],
    ['Which astrology app is best for beginners?', 'Astral Lab, because it explains what each placement means instead of leaving you to look it up. A beginner who has to leave the app to understand a word will not open it again.'],
    ['Is a birth chart app better than a website?', 'For learning, a website is fine. For practice, an app is better, because the calculation is instant and it works offline. Astral Lab gives you the chart with no connection, which is the difference between a reference and a tool.'],
    ['What does an astrology app cost in total?', 'One app is $3.99 to $14.99 paid once. NOCTEM Tools at $14.99 covers sigils, gnosis, runes, banishing and the journal, so it is cheaper than buying four of the smaller apps.'],
    ['Can I try an astrology app before paying?', 'Yes. The free birth chart and the free tools on this site do the same core calculation. If the free version is enough for you, you never need to buy anything.'],
    ['Is there an astrology app that works without internet?', 'All twelve do. They are installed on the phone, they read no server, and none of them phone home. That is deliberate, because the moment you most want the chart is usually the moment you have no signal.']
  ],
  next: 'Open the <a href="tools/full-birth-chart.html">free full birth chart</a> to see what a complete chart looks like before you spend anything, then read the <a href="best-occult-apps-android.html">buyers guide to the occult apps</a> if you want the wider picture.'
});

build({
  slug: 'birth-chart-app.html',
  title: 'Birth Chart App: Accurate, Offline, One-Time $6.99',
  desc: 'The birth chart app that shows aspect patterns and transit flags instead of a paywall. $6.99 once, works offline. Free browser chart included.',
  keywords: 'birth chart app, natal chart app, astrology birth chart app, most accurate birth chart app, birth chart calculator app, natal chart calculator, birth chart app free',
  topic: 'Birth chart apps',
  kicker: 'Chart tool &middot; no subscription',
  h1: 'Birth Chart App: The One That Does Not Hide the Chart Behind a Paywall',
  lede: 'A full natal chart with real ephemeris data, aspect patterns, placement meanings and transit alerts. One payment. Works with no connection. And a free browser version if you want to look before you buy.',
  app: {
    name: 'Astral Lab',
    price: '6.99',
    description: 'Birth chart app for Android. Full natal chart, aspect patterns, transit alerts, placement meanings and grimoire entries. One-time purchase, works offline, no subscription.'
  },
  items: [
    { name: 'Full Birth Chart (free tool)', url: '/tools/full-birth-chart.html' },
    { name: 'Astral Sign Calculator (free tool)', url: '/tools/astrology-sign-calculator.html' },
    { name: 'Rising Sign Calculator (free tool)', url: '/tools/rising-sign-calculator.html' },
    { name: 'Moon Sign Calculator (free tool)', url: '/tools/moon-sign-calculator.html' },
    { name: 'Zodiac Cusp Calculator (free tool)', url: '/tools/zodiac-cusp-calculator.html' },
    { name: 'Planetary Retrograde Calendar (free tool)', url: '/tools/planetary-retrograde-calendar.html' }
  ],
  speak: ['h1', '#what-you-get', '#table-heading', '#verdict-heading', '#faq-heading'],
  body: `
        <h2 id="what-you-get">What a birth chart app should actually give you</h2>
        <p>Most of them give you the Sun sign and hold the rest. You tap on the app, you get a glyph, you get a paragraph about being creative, and the moment you ask what your Moon sign does the app asks for a subscription.</p>
        <p>A real natal chart is not a Sun sign. It is a wheel of about thirty positions: Sun, Moon and rising sign, the personal planets, the angles, the houses, and every aspect formed between them. Two people born in the same month can have completely different charts, and the differences between them are where the actual information is.</p>
        <p>What you need from an app, then, is the whole wheel, the aspects drawn as patterns rather than listed as noise, the meanings attached to each placement, and a way to see what is moving now. That is the list this app is judged against.</p>

        <h2>Free chart in the browser first</h2>
        <p>Before you install anything, cast the <a href="tools/full-birth-chart.html">free full birth chart</a>. It runs in your browser, needs no account, and produces the same wheel with the same aspect information. Use it for a month. If you never feel the need for an app, you have saved six dollars and discovered something useful.</p>
        <p>The other free tools cover the pieces separately: <a href="tools/astrology-sign-calculator.html">astrology sign calculator</a>, <a href="tools/rising-sign-calculator.html">rising sign calculator</a>, <a href="tools/moon-sign-calculator.html">moon sign calculator</a>, <a href="tools/zodiac-cusp-calculator.html">zodiac cusp calculator</a> and the <a href="tools/planetary-retrograde-calendar.html">planetary retrograde calendar</a>.</p>

        <h2 id="table-heading">Free chart tool versus paid birth chart app</h2>
        <table>
            <thead><tr><th>What you want</th><th>Free browser tool</th><th>Astral Lab app</th></tr></thead>
            <tbody>
                <tr><td>Full natal wheel</td><td class="good">Yes</td><td class="good">Yes</td></tr>
                <tr><td>Aspect patterns, not a raw list</td><td class="good">Yes</td><td class="good">Yes</td></tr>
                <tr><td>Meanings per placement</td><td>Partial</td><td class="good">Full grimoire</td></tr>
                <tr><td>Transit alerts as they happen</td><td class="bad">No</td><td class="good">Yes</td></tr>
                <tr><td>Works with no connection</td><td class="good">Yes</td><td class="good">Yes</td></tr>
                <tr><td>Saved chart history on your phone</td><td class="bad">No</td><td class="good">Yes</td></tr>
                <tr><td>Cost</td><td>Free</td><td>$6.99 once</td></tr>
            </tbody>
        </table>

        <h2>Why the ephemeris question matters</h2>
        <p>If you have ever compared two birth charts and got different dates for the same planet, you have hit the difference between ephemeris data sets. Precise positions matter more than most apps admit: a planet near the edge of a sign can be mislabelled, and a conjunction at a few minutes of arc is a completely different aspect from one a degree away.</p>
        <p>Both the free browser chart and Astral Lab use proper ephemeris computation rather than lookup tables, which is the main reason the free tool gives you a result you can trust. See <a href="ephemeris-accuracy.html">which ephemeris to use and why</a> if you want the technical detail.</p>

        <h2 id="verdict-heading">The verdict on birth chart apps</h2>
        <div class="verdict">
            <p>The free browser chart is genuinely good enough to learn on and to use for years. Do not pay for anything until you have used it and know exactly which piece you are missing.</p>
            <p>When you do need an app, the missing piece is transit awareness and saved history. <strong>Astral Lab, $6.99 once</strong>, closes that gap without introducing a subscription.</p>
        </div>
        <div class="cta-box">
            <h3>Astral Lab on Google Play</h3>
            <p>Full natal chart, aspect patterns, transit alerts and placement meanings. One payment, works offline, no subscription, no ads.</p>
            <div class="btn-row">
                <a class="play-store-btn" href="${PLAY}" rel="noopener">See it on Google Play</a>
                <a class="ghost-btn" href="tools/full-birth-chart.html">Try the free chart first</a>
            </div>
        </div>
${BUNDLEBOX}`,
  faqTitle: 'Birth chart app questions',
  faq: [
    ['What is the best birth chart app?', 'Astral Lab at Cha0smagick Labs. Full natal wheel, aspect patterns shown as patterns, meanings for every placement, transit flags, $6.99 once, works with no connection.'],
    ['Is there a free birth chart app?', 'The free browser chart on this site gives you the full wheel with aspect information and no account, no signup and no cost. It is the same computation the app uses.'],
    ['What is the most accurate birth chart app?', 'Accuracy comes from the ephemeris, not the interface. Both the free browser chart and Astral Lab compute positions properly instead of using approximate tables, which is why a planet near a sign edge is labelled correctly.'],
    ['Do I need a birth chart app or is a website enough?', 'A website is enough for learning. An app is better for practice, because the chart opens instantly and works with no signal, which is when you actually want it.'],
    ['How much does a birth chart app cost?', 'Astral Lab is $6.99 as a single payment. There is no subscription and nothing unlocks monthly.'],
    ['Can I get my natal chart without giving my birth date to an app?', 'Yes. The browser chart computes locally in the page and sends nothing to a server. Your birth data stays on your device.'],
    ['What is the difference between a natal chart app and a horoscope app?', 'A natal chart app calculates your fixed placements from birth data. A horoscope app gives predictions for a date. One is a chart, the other is a daily feed; only one of them is worth installing.'],
    ['Is the free chart as good as the paid app?', 'For the chart itself, yes: same wheel, same aspects, same precision. The paid app adds transit alerts, saved history and the full meanings library.']
  ],
  next: 'Cast the <a href="tools/full-birth-chart.html">free full birth chart</a> now, then read <a href="horoscope-app.html">how a horoscope app differs</a> if you also want the daily layer.'
});

build({
  slug: 'horoscope-app.html',
  title: 'Horoscope App: Free Daily Readings, No Subscription',
  desc: 'A horoscope app that does not charge weekly. Moon phases, planetary hours, retrogrades and the daily layer, free in the browser or $3.99 once on Android.',
  keywords: 'horoscope apps, best horoscope app, horoscope app free, daily horoscope app, free horoscope without subscription, moon phase app, horoscope android',
  topic: 'Horoscope apps',
  kicker: 'Daily layer &middot; no weekly fee',
  h1: 'Horoscope App: The Daily Layer Without the Weekly Subscription',
  lede: 'Most horoscope apps are free for four days and then charge every week forever. The useful part of a horoscope, the timing layer, can be had free in a browser. Here is what to use instead.',
  app: {
    name: 'Lunar Phase Calculator',
    price: '3.99',
    description: 'Android horoscope and moon phase app: current phase, illumination, sign, next quarters, and the timing windows for lunar work. One-time purchase, works offline.'
  },
  items: [
    { name: 'Lunar Phase (free tool)', url: '/tools/lunar-phase.html' },
    { name: 'Moon Phase Calendar (free tool)', url: '/tools/moon-phase-calendar.html' },
    { name: 'Moon VOC (free tool)', url: '/tools/moon-voc.html' },
    { name: 'Planetary Hours (free tool)', url: '/tools/planetary-hours.html' },
    { name: 'Planetary Retrograde Calendar (free tool)', url: '/tools/planetary-retrograde-calendar.html' },
    { name: 'Sabbat Season Planner (free tool)', url: '/tools/sabbat-season-planner.html' }
  ],
  speak: ['h1', '#problem', '#what-to-use', '#verdict-heading', '#faq-heading'],
  body: `
        <h2 id="problem">The subscription problem with horoscope apps</h2>
        <p>A subscription horoscope app is not selling astrology. It is selling notifications. Once a day the app buzzes, you open it, you read three lines, and it has cost you the price of a coffee every week for a text that could have come from a list of twelve sentences.</p>
        <p>What people are actually looking for when they search for a horoscope app is not predictions. It is <strong>timing</strong>: what phase the moon is in, whether it is void of course, whether a planet is retrograde, when the planetary hours fall. That information is exact, it is free, and it belongs to a calculator rather than to a subscription.</p>

        <h2 id="what-to-use">What to use instead, free in the browser</h2>
        <p>Six tools cover the entire daily layer:</p>
        <ul>
            <li><a href="tools/lunar-phase.html">Lunar phase</a> &mdash; current phase, illumination and sign.</li>
            <li><a href="tools/moon-phase-calendar.html">Moon phase calendar</a> &mdash; the whole month laid out, with the quarters marked.</li>
            <li><a href="tools/moon-voc.html">Moon VOC</a> &mdash; whether the moon is void of course right now.</li>
            <li><a href="tools/planetary-hours.html">Planetary hours</a> &mdash; the hour table for the day, which is what most magick actually follows.</li>
            <li><a href="tools/planetary-retrograde-calendar.html">Planetary retrogrades</a> &mdash; what is retrograde and until when.</li>
            <li><a href="tools/sabbat-season-planner.html">Sabbat season planner</a> &mdash; the esbat dates for the year.</li>
        </ul>
        <p>None of them needs an account, none of them sends a notification, and none of them will ask you for a card.</p>

        <h2>When a horoscope app is still the right choice</h2>
        <p>There is one good reason to want an app: you need the information when you have no browser in front of you. A ritual performed away from a computer, a phone in one hand and a candle in the other, is exactly the situation where a lunar app earns its keep.</p>
        <p>The <a href="apps/lunar-phase-calculator.html">Lunar Phase Calculator</a> is $3.99 once, opens instantly, works with no connection, and gives you the phase, the illumination, the sign and the next quarter. That is the entire tool. There is no weekly anything.</p>

        <h2>Free tool versus subscription app</h2>
        <table>
            <thead><tr><th></th><th>Free browser tools</th><th>Weekly subscription app</th></tr></thead>
            <tbody>
                <tr><td>Moon phase and illumination</td><td class="good">Exact, free</td><td class="good">Usually included</td></tr>
                <tr><td>Void of course check</td><td class="good">Free</td><td>Often premium</td></tr>
                <tr><td>Planetary hours</td><td class="good">Free</td><td>Often premium</td></tr>
                <tr><td>Retrogade calendar</td><td class="good">Free</td><td class="bad">Usually not included</td></tr>
                <tr><td>Works with no connection</td><td class="good">Yes</td><td class="bad">No</td></tr>
                <tr><td>Weekly cost</td><td>Free</td><td>$4 to $9</td></tr>
                <tr><td>Yearly cost</td><td>Free</td><td>$200 to $470</td></tr>
            </tbody>
        </table>
        <p>That last row is the whole argument. A weekly horoscope subscription costs more over a year than every tool on this page combined, and it produces less precise information.</p>

        <h2 id="verdict-heading">The verdict on horoscope apps</h2>
        <div class="verdict">
            <p>For the timing layer, the free browser tools are strictly better than any subscription app: they are exact, they are free and they work offline.</p>
            <p>For the convenience of having it on your phone during a ritual, <strong>Lunar Phase Calculator at $3.99 once</strong> is the cheapest honest option, because it asks for money once.</p>
        </div>
${BUNDLEBOX}`,
  faqTitle: 'Horoscope app questions',
  faq: [
    ['What is the best horoscope app?', 'For accuracy, the free browser tools on this site: lunar phase, moon phase calendar, void of course, planetary hours and retrogrades, all exact and free. For convenience on a phone during practice, the Lunar Phase Calculator app at $3.99 once.'],
    ['Is there a free horoscope app with no subscription?', 'Yes. The lunar phase, moon phase calendar, void of course, planetary hours and retrograde tools here are free, need no account, and have no paid tier at all.'],
    ['Why do horoscope apps charge weekly?', 'Because the daily notification is the product, not the astrology. A weekly subscription is the cheapest way to make someone open an app every day, so that is what gets sold.'],
    ['What is the difference between a horoscope app and a moon phase app?', 'A horoscope app gives you predictions for the day. A moon phase app gives you astronomical data about the moon, which is exact and does not change week to week. The second is what practice actually needs.'],
    ['How much does a good horoscope app cost?', 'The free tools cost nothing. The Lunar Phase Calculator app costs $3.99 as a single payment. Weekly subscription horoscope apps cost $4 to $9 per week.'],
    ['Can I check the moon phase without an app?', 'Yes, in the <a href="tools/lunar-phase.html">free lunar phase tool</a>, in the browser, with no account.'],
    ['Is there a horoscope app that works offline?', 'The Lunar Phase Calculator app does, along with the rest of this catalogue. Subscription horoscope apps generally do not, because the content is fetched from a server.'],
    ['Do I need a horoscope app to do magick?', 'No. The timing layer comes from the moon and the planetary hours, both of which are calculable and free. The narrative prediction is optional and does not affect the practice.']
  ],
  next: 'Check tonight with the <a href="tools/lunar-phase.html">free lunar phase tool</a>, then set up the whole timing layer at once from <a href="tools/index.html">the 62 free tools</a>.'
});