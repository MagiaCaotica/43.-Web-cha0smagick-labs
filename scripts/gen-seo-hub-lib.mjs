// Genera paginas raiz de apoyo para los huecos de Search Console que no tenian landing propia.
// Reutiliza nav, footer, fuentes y CSS de best-occult-apps-android.html (mismo patron que gen-sigil-maker.mjs).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const TPL = path.join(ROOT, 'best-occult-apps-android.html');
const SITE = 'https://cha0smagicklabs.com';
const PLAY = 'https://play.google.com/store/apps/developer?id=Cha0smagick+Labs';
const BUNDLE = 'https://pay.hotmart.com/D93257466P';
const BANNER = SITE + '/assets/images/Banner.png';

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

const CSS = `
    <style>
    .kicker { color: var(--accent-gold, #c0a060); font-size: .78rem; letter-spacing: .16em; text-transform: uppercase; margin: 0 0 .6rem; font-family: 'JetBrains Mono', monospace; }
    .hero-box { border: 1px solid var(--border-card, #333); border-radius: var(--radius-md, 8px); background: var(--bg-card, #0a0a0a); padding: 1.6rem 1.5rem; margin-bottom: 2rem; }
    .hero-box p { margin: .6rem 0 0; color: var(--text-secondary, #999); font-size: .95rem; }
    h2 { margin-top: 2.4rem; }
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
    .good { color: #7bd88f; }
    .bad { color: #e08a8a; }
    .faq-q { margin-top: 1.6rem; }
    .faq-q h3 { margin-bottom: .4rem; color: var(--text-primary, #fff); font-size: 1rem; }
    .faq-q p { color: var(--text-secondary, #999); margin: 0; }
    .verdict { border-left: 3px solid var(--accent-gold, #c0a060); padding: .2rem 0 .2rem 1rem; margin: 1.6rem 0; }
    .verdict p { margin: .4rem 0; color: var(--text-secondary, #999); }
    @media (max-width: 520px) { .btn-row { flex-direction: column; } }
    </style>
</head>`;

function schemaFor(p) {
  const url = SITE + '/' + p.slug;
  const out = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE + '/' },
        { '@type': 'ListItem', position: 2, name: p.h1, item: url }
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': url + '#webpage',
      url,
      name: p.title,
      description: p.desc,
      isPartOf: { '@id': SITE + '/#website' },
      primaryImageOfPage: BANNER,
      inLanguage: 'en',
      about: { '@type': 'Thing', name: p.topic },
      breadcrumb: { '@id': url + '#breadcrumb' }
    }
  ];
  if (p.app) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      '@id': url + '#app',
      name: p.app.name,
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Android',
      description: p.app.description,
      offers: {
        '@type': 'Offer',
        price: p.app.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        category: 'PaidApplication'
      },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '221', bestRating: '5' }
    });
  }
  if (p.items) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: p.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: SITE + it.url
      }))
    });
  }
  out.push({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': url + '#faq',
    mainEntity: p.faq.map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  });
  out.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url + '#speakable',
    speakable: { '@type': 'SpeakableSpecification', cssSelector: p.speak || ['h1', '#faq-heading'] }
  });
  return out;
}

function build(p) {
  const url = SITE + '/' + p.slug;
  const head = headTop + `${p.title}</title>
    <link rel="stylesheet" href="css/style.min.css">
    <meta name="description" content="${p.desc}">
    <meta name="keywords" content="${p.keywords}">
    <link rel="canonical" href="${url}">
    <link rel="alternate" hreflang="en" href="${url}">
    <meta property="og:title" content="${p.title}">
    <meta property="og:description" content="${p.desc}">
    <meta property="og:image" content="${BANNER}">
    <meta property="og:image:width" content="319">
    <meta property="og:image:height" content="316">
    <meta property="og:url" content="${url}">
    <meta property="og:type" content="article">
    <meta property="og:locale" content="en">
    <meta property="og:site_name" content="Cha0smagick Labs">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${p.title}">
    <meta name="twitter:description" content="${p.desc}">
    <meta name="twitter:image" content="${BANNER}">
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
` + schemaFor(p).map(s => '    <script type="application/ld+json">\n' + JSON.stringify(s, null, 2) + '\n    </script>').join('\n') + '\n' + CSS;

  const body = `
    <main>
        <div class="hero-box">
            <p class="kicker">${p.kicker}</p>
            <h1>${p.h1}</h1>
            <p>${p.lede}</p>
        </div>
${p.body}
        <h2 id="faq-heading">${p.faqTitle}</h2>
${p.faq.map(([q, a]) => `        <div class="faq-q"><h3>${q}</h3><p>${a}</p></div>`).join('\n')}

        <h2>Where to go next</h2>
        <p>${p.next}</p>
    </main>`;

  const out = path.join(ROOT, p.slug);
  fs.writeFileSync(out, head + '\n' + nav + body + '\n' + foot, 'utf8');
  const words = fs.readFileSync(out, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim().split(' ').length;
  console.log(`OK ${p.slug} (${words} palabras visibles)`);
}

export { build, PLAY, BUNDLE, SITE };