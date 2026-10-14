// Genera /sigil-maker.html — landing comercial raiz para la keyword head "sigil maker".
// Reutiliza nav, footer, fuentes y CSS de best-occult-apps-android.html para no divergir del resto del sitio.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TPL = path.join(ROOT, 'best-occult-apps-android.html');
const OUT = path.join(ROOT, 'sigil-maker.html');
const SITE = 'https://cha0smagicklabs.com';

const tpl = fs.readFileSync(TPL, 'utf8');

function slice(from, to) {
  const a = tpl.indexOf(from);
  if (a === -1) throw new Error('no encontre ' + from);
  const b = tpl.indexOf(to, a);
  if (b === -1) throw new Error('no encontre ' + to + ' despues de ' + from);
  return tpl.slice(a, b + to.length);
}

const nav = slice('<body>', '</header>');
const foot = slice('</footer>', '</html>');
const headTop = slice('<!DOCTYPE html>', '<title>');

const TITLE = 'Sigil Maker Online Free — Create Sigils, No Signup';
const DESC = 'Free sigil maker online. Design a sigil from letters, numbers or symbols, download it and charge it with a timer. No signup. Android app $3.99.';

const PLAY = 'https://play.google.com/store/apps/developer?id=Cha0smagick+Labs';
const BUNDLE = 'https://pay.hotmart.com/D93257466P';

const schema = [
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
      { '@type': 'ListItem', position: 2, name: 'Sigil Maker', item: SITE + '/sigil-maker.html' }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITE + '/sigil-maker.html#webpage',
    url: SITE + '/sigil-maker.html',
    name: TITLE,
    description: DESC,
    isPartOf: { '@id': SITE + '/#website' },
    primaryImageOfPage: SITE + '/assets/images/Banner.png',
    inLanguage: 'en',
    about: { '@type': 'Thing', name: 'Sigil creation' },
    breadcrumb: { '@id': SITE + '/sigil-maker.html#breadcrumb' }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': SITE + '/sigil-maker.html#app',
    name: 'Chaos Sigil Generator',
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android',
    description: 'Android sigil maker app. Draws sigils from letters, numbers, planetary or elemental glyphs, saves them as PNG and keeps a library of every sigil you build. One-time purchase, works offline.',
    offers: {
      '@type': 'Offer',
      price: '3.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'PaidApplication'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '221',
      bestRating: '5',
      worstRating: '1'
    }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Free sigil tools on this site',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sigil Generator', url: SITE + '/tools/sigil-generator.html' },
      { '@type': 'ListItem', position: 2, name: 'Sigil Intention Encoder', url: SITE + '/tools/sigil-intention-encoder.html' },
      { '@type': 'ListItem', position: 3, name: 'Sigil Charging Timer', url: SITE + '/tools/sigil-charging-timer.html' },
      { '@type': 'ListItem', position: 4, name: 'Sigil Charging Planner', url: SITE + '/tools/sigil-charging-planner.html' },
      { '@type': 'ListItem', position: 5, name: 'Planetary Kamea Sigil', url: SITE + '/tools/planetary-kamea-sigil.html' },
      { '@type': 'ListItem', position: 6, name: 'Gnosis Timer', url: SITE + '/tools/gnosis-timer.html' }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': SITE + '/sigil-maker.html#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a sigil maker?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A sigil maker is a tool that takes an intention, reduces it to its core letters or sounds, and draws a single geometric symbol from those shapes. It replaces the word with a symbol so the symbol carries the intention instead of the sentence.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is this sigil maker free and do I need to sign up?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. The sigil maker on this page and the browser tools are free, need no account, and send nothing to a server. The charge timer and the intention encoder also run entirely in your browser.'
        }
      },
      {
        '@type': 'Question',
        name: 'How do I make a sigil step by step?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Write the intention as a clear statement of will, cut it down to the fewest meaningful letters, reduce those letters to circles, lines and curves, connect the strokes into one closed figure, then erase the individual letters until only the figure remains. Charge it, then forget about it.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the best sigil maker app for Android?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Chaos Sigil Generator at Cha0smagick Labs. It is a one-time $3.99 purchase, it works with no connection, it offers letter, number, planetary and elemental drawing modes, it exports PNG at high resolution, and it keeps a library of every sigil you have built.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the difference between a sigil maker and a sigil generator?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A generator draws the symbol mechanically from the letters. A maker does the same drawing but also holds the rest of the process: fixing the intention, charging the sigil with attention, and logging results so you can repeat what worked.'
        }
      },
      {
        '@type': 'Question',
        name: 'Should I charge my sigil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Charging focuses attention on the sigil at the moment of creation. It can be as short as a few minutes of gnosis with a timer. The sigil works either way; charging mainly keeps the image clear and loaded in memory.'
        }
      },
      {
        '@type': 'Question',
        name: 'How long should I wait before acting on a sigil?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Forget it. Common chaos magick guidance is not to look at the sigil again for a few days, because repeatedly checking weakens the gnosis you built into it. Act on the intention, not on the drawing.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I use these sigils for anything I want?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sigils are a focus for intention, not a substitute for medical, legal or financial advice. Keep them away from other people’s health and safety, and use them on things that are yours to influence.'
        }
      }
    ]
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': SITE + '/sigil-maker.html#speakable',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['#step-intention', '#step-letters', '#step-shapes', '#step-charge', '#faq-heading']
    }
  }
];

const css = `
<style>
.kicker { color: var(--accent-gold, #c0a060); font-size: .78rem; letter-spacing: .16em; text-transform: uppercase; margin: 0 0 .6rem; font-family: 'JetBrains Mono', monospace; }
.hero-sigil { border: 1px solid var(--border-card, #333); border-radius: var(--radius-md, 8px); background: var(--bg-card, #0a0a0a); padding: 1.6rem 1.5rem; margin-bottom: 2rem; }
.hero-sigil p { margin: .6rem 0 0; color: var(--text-secondary, #999); font-size: .95rem; }
h2 { margin-top: 2.4rem; }
.steps { list-style: none; padding: 0; counter-reset: s; }
.steps li { counter-increment: s; position: relative; padding: 0 0 1.1rem 3rem; margin-bottom: 1.1rem; border-bottom: 1px solid var(--border-card, #2a2a2a); }
.steps li:last-child { border-bottom: 0; }
.steps li::before { content: counter(s); position: absolute; left: 0; top: 0; width: 2rem; height: 2rem; border-radius: 50%; background: var(--accent-gold, #c0a060); color: #000; font-weight: 700; font-family: 'JetBrains Mono', monospace; display: flex; align-items: center; justify-content: center; }
.steps li strong { display: block; color: var(--text-primary, #fff); margin-bottom: .3rem; }
.steps li span { color: var(--text-secondary, #999); font-size: .95rem; }
.tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem; margin: 1.2rem 0; }
.tool-card { display: block; border: 1px solid var(--border-card, #333); border-radius: var(--radius-md, 8px); background: var(--bg-card, #0a0a0a); padding: 1.1rem 1.2rem; text-decoration: none; }
.tool-card b { display: block; color: var(--accent-gold, #c0a060); margin-bottom: .35rem; }
.tool-card span { color: var(--text-secondary, #999); font-size: .9rem; line-height: 1.5; }
.cta-box { border: 1px solid var(--accent-gold, #c0a060); border-radius: var(--radius-md, 8px); background: rgba(192,160,96,.06); padding: 1.6rem; margin: 2rem 0; }
.cta-box h3 { margin: 0 0 .6rem; color: var(--accent-gold, #c0a060); }
.cta-box p { color: var(--text-secondary, #999); font-size: .95rem; }
.btn-row { display: flex; flex-wrap: wrap; gap: .8rem; margin-top: 1.1rem; }
.play-store-btn { display: inline-block; background: var(--accent-gold, #c0a060); color: #000; padding: .7rem 1.2rem; border-radius: 6px; font-weight: 600; text-decoration: none; }
.ghost-btn { display: inline-block; border: 1px solid var(--border-card, #333); color: var(--text-primary, #fff); padding: .7rem 1.2rem; border-radius: 6px; text-decoration: none; }
table { width: 100%; border-collapse: collapse; margin: 1.2rem 0; font-size: .92rem; }
th, td { border: 1px solid var(--border-card, #333); padding: .7rem .8rem; text-align: left; }
th { color: var(--accent-gold, #c0a060); }
.faq-q { margin-top: 1.6rem; }
.faq-q h3 { margin-bottom: .4rem; color: var(--text-primary, #fff); font-size: 1rem; }
.faq-q p { color: var(--text-secondary, #999); margin: 0; }
@media (max-width: 520px) { .btn-row { flex-direction: column; } }
</style>
</head>`;

const head = headTop + `${TITLE}</title>
    <link rel="stylesheet" href="css/style.min.css">
    <meta name="description" content="${DESC}">
    <meta name="keywords" content="sigil maker, sigil maker online, sigil creator, make sigil online, sigil maker app, how to make a sigil, sigil generator free">
    <link rel="canonical" href="${SITE}/sigil-maker.html">
    <link rel="alternate" hreflang="en" href="${SITE}/sigil-maker.html">
    <meta property="og:title" content="${TITLE}">
    <meta property="og:description" content="${DESC}">
    <meta property="og:image" content="${SITE}/assets/images/Banner.png">
    <meta property="og:image:width" content="319">
    <meta property="og:image:height" content="316">
    <meta property="og:url" content="${SITE}/sigil-maker.html">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="en">
    <meta property="og:site_name" content="Cha0smagick Labs">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:description" content="${DESC}">
    <meta name="twitter:image" content="${SITE}/assets/images/Banner.png">
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    <link rel="apple-touch-icon" href="assets/images/Banner.png">
    <link rel="manifest" href="manifest.json">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://unpkg.com" crossorigin>
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', { 'analytics_storage': 'denied', 'ad_storage': 'denied', 'ad_user_data': 'denied', 'ad_personalization': 'denied' });
      gtag('js', new Date());
      gtag('config', 'G-V6LHCPN9TK');
    </script>
` + schema.map(s => '    <script type="application/ld+json">\n' + JSON.stringify(s, null, 2) + '\n    </script>').join('\n') + '\n' + css;

const main = `
    <main>
        <div class="hero-sigil">
            <p class="kicker">Sigil maker &middot; free online</p>
            <h1>Sigil Maker: Create Your Sigil Free Online</h1>
            <p>Turn a clear intention into one closed symbol you can charge, forget and act on. No account, no signup, no upload. Everything below runs in your browser.</p>
        </div>

        <h2>What a sigil maker actually does</h2>
        <p>A sigil is a compressed picture of a sentence. The sigil maker takes the words you want, keeps only the letters that carry the meaning, turns those letters into basic shapes, and joins the shapes into one figure. Once the figure exists, the sentence is gone: you are left holding the intention itself, without the words that keep reminding you of the request.</p>
        <p>That is the whole mechanism. Everything else in this tradition is about how much attention you can put into that figure before you let it go.</p>

        <h2>How to make a sigil step by step</h2>
        <ol class="steps">
            <li id="step-intention"><strong>Fix the intention as a statement</strong><span>Not a wish, not a demand. Write it as something you would accept as true: "the job is signed", "I sleep through the night", "the message arrives". Vague intentions produce vague sigils.</span></li>
            <li id="step-letters"><strong>Cut it to the fewest letters</strong><span>Drop articles and filler. Keep only the words that carry the claim. Long intentions are the most common reason a sigil fails to feel charged.</span></li>
            <li id="step-shapes"><strong>Reduce the letters to shapes</strong><span>A becomes a circle, M becomes two peaks, I becomes a line. Rotate, mirror and overlap freely. Repetition is allowed and often helps.</span></li>
            <li id="step-charge"><strong>Join the strokes into one closed figure</strong><span>No open ends. A closed shape is easier to hold in mind as a single object. Then erase the letters so only the figure remains.</span></li>
            <li id="step-forget"><strong>Charge it, then forget it</strong><span>Give it a short burst of attention with a timer, then stop looking at it. The forgetting is part of the method, not a side effect.</span></li>
        </ol>
        <p><a href="tools/sigil-generator.html">Open the free sigil generator</a> to draw steps three and four automatically, then use the charging timer for step five.</p>

        <h2>Free sigil tools on this site</h2>
        <p>Six browser tools that cover the whole process. None of them stores anything or asks for an email.</p>
        <div class="tool-grid">
            <a class="tool-card" href="tools/sigil-generator.html"><b>Sigil Generator</b><span>Draws the symbol from letters, numbers or glyphs and exports a PNG.</span></a>
            <a class="tool-card" href="tools/sigil-intention-encoder.html"><b>Sigil Intention Encoder</b><span>Reduces a long sentence to the minimum set of letters worth drawing.</span></a>
            <a class="tool-card" href="tools/sigil-charging-timer.html"><b>Sigil Charging Timer</b><span>Sets a fixed window for attention so the charge is not accidental.</span></a>
            <a class="tool-card" href="tools/sigil-charging-planner.html"><b>Sigil Charging Planner</b><span>Picks the moment to build the sigil around your day.</span></a>
            <a class="tool-card" href="tools/planetary-kamea-sigil.html"><b>Planetary Kamea Sigil</b><span>Builds the seven-square figure used for planetary attunement.</span></a>
            <a class="tool-card" href="tools/gnosis-timer.html"><b>Gnosis Timer</b><span>Short fixed interval for building state before you draw.</span></a>
        </div>

        <h2>The sigil maker app for Android</h2>
        <p>The browser generator draws one shape per session. The Android app keeps a library, so every sigil you have ever built stays in one place with the intention written next to it. That library is the difference between a tool you used once and a practice you can audit.</p>
        <ul>
            <li><strong>Chaos Sigil Generator &mdash; $3.99, one-time.</strong> Letter, number, planetary and elemental modes, high resolution PNG export, offline, no ads.</li>
            <li><strong>NOCTEM Tools &mdash; $14.99, one-time.</strong> The full box: sigils, gnosis timers, runic name translation, banishing routines and a grimoire journal in one app.</li>
        </ul>
        <p>Every app in this catalogue is a single purchase. There are no subscriptions and no recurring fees on any of them.</p>
        <div class="cta-box">
            <h3>Take the sigil maker off this page</h3>
            <p>The Android apps work with no connection, so a sigil can be built on a plane, in a ritual, or wherever the attention is. One payment, keeps working forever.</p>
            <div class="btn-row">
                <a class="play-store-btn" href="${PLAY}" rel="noopener">See the 12 apps on Google Play</a>
                <a class="ghost-btn" href="apps/index.html">Read the full catalogue</a>
            </div>
        </div>

        <h2>Charging your sigil</h2>
        <p>Charging is the part that decides whether the sigil feels alive. You are not asking the drawing to do something; you are loading it with your own attention at the moment you made it. Most people who say their sigils "do not work" charged them with doubt, checked them ten minutes later, and abandoned the method before the gnosis had time to set.</p>
        <p>A short, deliberate charge beats a long, distracted one. Four focused minutes with the figure in view is usually enough. After that, close the tools and go do something else.</p>
        <p>The <a href="tools/sigil-charging-timer.html">charging timer</a> sets the window for you so you are not tempted to end it early.</p>

        <h2>Free maker, paid app, or book</h2>
        <table>
            <thead><tr><th>Option</th><th>What you get</th><th>Price</th></tr></thead>
            <tbody>
                <tr><td>Browser sigil maker</td><td>Draw one symbol, export one PNG</td><td>Free</td></tr>
                <tr><td>Chaos Sigil Generator app</td><td>All drawing modes plus a library of every sigil</td><td>$3.99 once</td></tr>
                <tr><td>NOCTEM Tools app</td><td>Sigil library, timers, runic names, banishing, journal</td><td>$14.99 once</td></tr>
                <tr><td>Codex Chaoticus (book)</td><td>The drawing and charging methods written out in full</td><td>PDF</td></tr>
            </tbody>
        </table>
        <p>The eight-book bundle covers the whole system, sigils included, at a single price. It is the cheapest way to get past the first three sigils and into an actual method.</p>
        <div class="btn-row">
            <a class="play-store-btn" href="${BUNDLE}" rel="noopener">Get the 8-book bundle</a>
            <a class="ghost-btn" href="books/index.html">Browse the books</a>
        </div>

        <h2 id="faq-heading">Sigil maker questions</h2>
        <div class="faq-q"><h3>What is a sigil maker?</h3><p>A tool that takes an intention, reduces it to the letters that matter, and draws one geometric figure from those shapes. The symbol carries the intention instead of the sentence.</p></div>
        <div class="faq-q"><h3>Is this sigil maker free and do I need to sign up?</h3><p>Yes, free, with no account. The generator, the intention encoder and the charging timer all run in your browser and send nothing anywhere.</p></div>
        <div class="faq-q"><h3>How do I make a sigil step by step?</h3><p>Fix the intention as a statement, cut it to the fewest meaningful letters, reduce the letters to circles and lines, connect them into one closed figure, charge it briefly, then forget it.</p></div>
        <div class="faq-q"><h3>What is the best sigil maker app for Android?</h3><p>The Chaos Sigil Generator at Cha0smagick Labs: one-time $3.99, works offline, exports high resolution PNG and keeps a library of every sigil you build.</p></div>
        <div class="faq-q"><h3>What is the difference between a sigil maker and a sigil generator?</h3><p>The generator draws the symbol. The maker also fixes the intention, charges it with attention and logs the result so you can repeat what worked.</p></div>
        <div class="faq-q"><h3>Should I charge my sigil?</h3><p>It helps. Charging focuses your attention at the moment of creation. The sigil functions either way, but a charged one is far easier to hold in mind.</p></div>
        <div class="faq-q"><h3>How long should I wait before acting on a sigil?</h3><p>Forget it first. Repeatedly checking the drawing weakens the attention you put into it. Act on the intention, not on the picture.</p></div>
        <div class="faq-q"><h3>Can I use these sigils for anything I want?</h3><p>Keep them off other people's health and safety. A sigil concentrates your own intention; it is not medical, legal or financial advice.</p></div>

        <h2>Next steps</h2>
        <p>Draw your first sigil with the <a href="tools/sigil-generator.html">free generator</a>, charge it with the <a href="tools/sigil-charging-timer.html">charging timer</a>, then read <a href="blog/free-sigil-generator-online-guide.html">the step-by-step guide</a> so you know what to do when the first one does nothing.</p>
    </main>`;

fs.writeFileSync(OUT, head + '\n' + nav + main + '\n' + foot, 'utf8');
const words = fs.readFileSync(OUT, 'utf8').replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().split(' ').length;
console.log('OK sigil-maker.html (' + words + ' palabras visibles)');