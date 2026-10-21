// Shared deep-dive builder for ES posts + ES compare pages (cha0smagicklabs.com)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const R = path.join(__dirname, '..');
export const B = 'https://cha0smagicklabs.com';

// Extract the EN pair (hreflang=en) + og:image from an existing ES post
export function readPair(slug) {
  const file = path.join(R, 'blog', `es-${slug}.html`);
  if (!fs.existsSync(file)) return { en: slug, enUrl: null, ogImg: null };
  const src = fs.readFileSync(file, 'utf8');
  const enUrl = (src.match(/hreflang="en"\s+href="([^"]+)"/) || [])[1] || null;
  const ogImg = (src.match(/og:image"\s+content="([^"]+)"/) || [])[1] || null;
  const enSlug = enUrl ? enUrl.replace(/\.html$/, '').split('/').pop() : slug;
  return { en: enSlug, enUrl, ogImg };
}

export const CSS = `
:root{--navy:#030303;--card:#0a0a0a;--amber:#c0a060;--cyan:#c0a060;--white:#f0f0f0;--muted:#a0a0a0;--line:rgba(255,255,255,.08)}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--navy);color:var(--white);font:17px/1.75 'Segoe UI','Roboto','Helvetica Neue',Helvetica,Arial,sans-serif;max-width:840px;margin:0 auto;padding:24px 20px 60px}
a{color:var(--cyan);text-decoration:none}
a:hover{text-decoration:underline}
.kicker{color:var(--cyan);text-transform:uppercase;letter-spacing:5px;font-size:13px;font-weight:700;margin-bottom:10px}
h1{font-size:clamp(28px,5vw,42px);line-height:1.2;font-weight:800;margin:8px 0 12px}
h2{font-size:24px;font-weight:800;color:var(--amber);margin:38px 0 12px}
h3{font-size:19px;margin:22px 0 8px;color:var(--white)}
p{margin:12px 0;color:#999999}
.lede{font-size:19px;color:var(--muted);margin-bottom:6px}
.claimbar{background:linear-gradient(90deg,rgba(255,176,58,.12),rgba(53,196,217,.10));border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin:26px 0;font-size:15px;color:var(--white)}
.cta{background:var(--card);border:1px solid var(--amber);border-radius:14px;padding:20px 22px;margin:30px 0}
.cta h3{margin-top:0;color:var(--amber)}
.cta p{margin:8px 0 14px}
.btn{display:inline-block;background:var(--amber);color:#12100a;font-weight:800;padding:11px 20px;border-radius:10px;margin:4px 8px 4px 0}
.btn.ghost{background:transparent;color:var(--cyan);border:1px solid var(--cyan)}
.btn:hover{text-decoration:none;filter:brightness(1.08)}
table{width:100%;border-collapse:collapse;margin:20px 0;font-size:15px}
th,td{border:1px solid var(--line);padding:10px 12px;text-align:left;vertical-align:top}
th{background:var(--card);color:var(--amber)}
td{color:#999999}
td.good{color:#7ee2a8}td.bad{color:#f08d8d}
.proscons{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}
@media(max-width:640px){.proscons{grid-template-columns:1fr}}
.pc{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px}
.pc h3{margin-top:0}
.pc ul{margin:8px 0 0 18px;color:#999999}
.verdict{background:var(--card);border-left:4px solid var(--amber);border-radius:10px;padding:18px 20px;margin:26px 0}
.faq{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 22px;margin:14px 0}
.faq h3{color:var(--cyan);margin:0 0 6px;font-size:17px}
.rel{margin-top:34px}
.rel a{display:block;padding:8px 0;border-bottom:1px solid var(--line)}
footer{margin-top:44px;padding-top:18px;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
footer nav a{display:inline-block;margin:0 10px 6px 0}
.tag{display:inline-block;background:rgba(53,196,217,.12);color:var(--cyan);border-radius:20px;padding:3px 12px;font-size:13px;margin:0 6px 8px 0}
`;

function jsonld(p, type) {
  const main = type === 'compare'
    ? {
        '@type': 'Article', headline: p.title, description: p.desc,
        author: { '@type': 'Person', name: 'Frater Alek0s' },
        inLanguage: 'es', datePublished: '2026-10-13',
        mainEntityOfPage: `${B}/es/${p.slug}.html`,
      }
    : {
        '@type': 'Article', headline: p.title, description: p.desc,
        author: { '@type': 'Person', name: 'Frater Alek0s' },
        inLanguage: 'es', datePublished: '2026-10-13',
        mainEntityOfPage: `${B}/blog/${p.slug}.html`,
      };
  const faq = {
    '@type': 'FAQPage',
    mainEntity: p.faq.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [main, faq] })
    .replace(/</g, '\\u003c');
}

function head({ lang, title, desc, canonical, hreflangs, og, json }) {
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${canonical}">
${hreflangs}
<meta name="theme-color" content="#0a0a12">
<meta property="og:type" content="article">
<meta property="og:locale" content="es_ES">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${og}">
<script type="application/ld+json">${json}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied'});gtag('config','G-V6LHCPN9TK');</script>
<style>${CSS}</style>`;
}

const MAILERLITE = `<script>(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account','2539880');</script>`;

export function footer() {
  return `<footer><nav>
<a href="/es/">🏠 Inicio ES</a><a href="/tools/">🧰 Herramientas gratis</a><a href="/apps/">📱 Apps</a><a href="/landing-pages/books-bundle.html">📚 Libros Bundle $19.99</a><a href="/buscar.html">🔍 Buscar</a><a href="/">English site</a>
</nav><p>© 2026 Cha0smagick Labs · Escrito por Frater Alek0s</p></footer>
${MAILERLITE}`;
}

export function faqBlock(faq) {
  return faq.map(([q, a]) => `<div class="faq"><h3>${q}</h3><p>${a}</p></div>`).join('\n');
}

export function claimbar() {
  return `<div class="claimbar">🥇 <b>El sistema #1 de magia del caos en español:</b> 12 apps + 8 libros + 61 herramientas gratis. <a href="/es/">Explorar el ecosistema →</a></div>`;
}

export const BTL = `<div class="cta"><h3>💎 Pasa de la práctica al ecosistema completo</h3>
<p>Esto es solo el inicio. Cha0smagick Labs es el único ecosistema completo de magia del caos en español e inglés: 12 apps de pago único, 8 grimorios digitales y 61 herramientas web gratis.</p>
<a class="btn" href="https://pay.hotmart.com/D93257466P">📚 Bundle: los 8 grimorios digitales — $19.99 (antes $79.92)</a>
<a class="btn" href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs">📱 Las 12 apps en Google Play — $3.99–$14.99, pago único</a>
<a class="btn ghost" href="/landing-pages/complete-access.html">🥇 Inner Circle — acceso completo + comunidad</a>
</div>`;

// Deep-dive blog post (1400-1800 words)
export function pageDeep(p) {
  const { en, ogImg } = p._pair || readPair(p.slug);
  const og = ogImg || `${B}/assets/images/blog/${en}.png`;
  const canonical = `${B}/blog/${p.slug}.html`;
  const hreflangs = `<link rel="alternate" hreflang="es" href="${canonical}">
<link rel="alternate" hreflang="en" href="${B}/blog/${en}.html">
<link rel="alternate" hreflang="x-default" href="${B}/blog/${en}.html">`;
  const [ct, ctx, b1t, b1u, b2t, b2u] = p.ctaMid;
  const ctaMid = `<div class="cta"><h3>⚡ ${ct}</h3><p>${ctx}</p>
<a class="btn" href="${b1u}">${b1t}</a><a class="btn ghost" href="${b2u}">${b2t}</a></div>`;
  const secsHtml = p.secs.map(([h2, ...paras], i) => {
    const body = paras.map(t => `<p>${t}</p>`).join('\n');
    return `<h2>${h2}</h2>\n${body}\n${i === 1 ? ctaMid : ''}`;
  }).join('\n');
  const rel = p.rel.map(([u, l]) => `<a href="${u}">${l}</a>`).join('\n');
  return `<!DOCTYPE html>
<html lang="es">
<head>
${head({ title: p.title, desc: p.desc, canonical, hreflangs, og, json: jsonld(p, 'blog') })}
</head>
<body>
<div class="kicker">CHAOSMAGICK LABS · EN ESPAÑOL · ${p.tags || 'GUÍA COMPLETA'}</div>
<h1>${p.h1}</h1>
<p class="lede">${p.lede}</p>
<p>Por <b>Frater Alek0s</b> · 13 oct 2026 · <span class="tag">${p.tags || 'guía'}</span></p>
${claimbar()}
${secsHtml}
${BTL}
<h2>Preguntas frecuentes</h2>
${faqBlock(p.faq)}
<div class="rel"><h2>Sigue explorando en español</h2>
${rel}
<a href="/es/">🥇 El hub en español: apps, libros y 61 herramientas</a>
<a href="/buscar.html">🔍 Buscar artículos y herramientas específicas</a>
</div>
${footer()}
</body>
</html>`;
}

// ES compare page (1200-1600 words)
export function pageCompare(p) {
  const canonical = `${B}/es/${p.slug}.html`;
  const hreflangs = `<link rel="alternate" hreflang="es" href="${canonical}">` +
    (p.xDefault ? `\n<link rel="alternate" hreflang="x-default" href="${p.xDefault}">` : '');
  const og = p.ogImg || `${B}/assets/images/og-default.png`;
  const table = p.table ? `<table><thead><tr>${p.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead>
<tbody>${p.table.rows.map(r => `<tr>${r.map((c, i) => `<td${c && c.startsWith('+') ? ' class="good"' : c && c.startsWith('−') ? ' class="bad"' : ''}>${c}</td>`).join('')}</tr>`).join('\n')}</tbody></table>` : '';
  const pros = p.pros ? `<div class="proscons">
<div class="pc"><h3>✅ Pros</h3><ul>${p.pros[0].map(x => `<li>${x}</li>`).join('')}</ul></div>
<div class="pc"><h3>❌ Contras</h3><ul>${p.pros[1].map(x => `<li>${x}</li>`).join('')}</ul></div>
</div>` : '';
  const secsHtml = p.secs.map(([h2, ...paras]) => `<h2>${h2}</h2>\n${paras.map(t => `<p>${t}</p>`).join('\n')}`).join('\n');
  const rel = p.rel.map(([u, l]) => `<a href="${u}">${l}</a>`).join('\n');
  return `<!DOCTYPE html>
<html lang="es">
<head>
${head({ title: p.title, desc: p.desc, canonical, hreflangs, og, json: jsonld(p, 'compare') })}
</head>
<body>
<div class="kicker">CHAOSMAGICK LABS · COMPARATIVA · EN ESPAÑOL</div>
<h1>${p.h1}</h1>
<p class="lede">${p.lede}</p>
<p>Por <b>Frater Alek0s</b> · 13 oct 2026 · <span class="tag">comparativa 2026</span></p>
${claimbar()}
${secsHtml}
${table}
${pros}
${p.verdict ? `<div class="verdict"><h2 style="margin-top:0">🏆 Veredicto</h2><p>${p.verdict}</p></div>` : ''}
<div class="cta"><h3>💎 Empieza hoy con el ecosistema</h3>
<p>Apps de pago único (sin suscripciones), bundle de libros al mejor precio y 61 herramientas gratis para practicar hoy mismo.</p>
<a class="btn" href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs">📱 Ver las 12 apps en Google Play ($3.99–$14.99)</a>
<a class="btn" href="https://pay.hotmart.com/D93257466P">📚 Bundle 8 libros — $19.99</a>
<a class="btn ghost" href="/tools/">🧰 61 herramientas gratis</a>
</div>
<h2>Preguntas frecuentes</h2>
${faqBlock(p.faq)}
<div class="rel"><h2>Sigue explorando en español</h2>
${rel}
<a href="/es/">🥇 El hub en español: apps, libros y 61 herramientas</a>
</div>
${footer()}
</body>
</html>`;
}

export function writePages(pages, builder, dir, prefix = '') {
  let ok = 0, fail = 0;
  for (const p of pages) {
    try {
      p._pair = builder === pageDeep ? readPair(p.slug) : {};
      fs.writeFileSync(path.join(R, dir, `${prefix}${p.slug}.html`), builder(p));
      ok++;
    } catch (e) {
      console.error(`FAIL ${p.slug}: ${e.message}`);
      fail++;
    }
  }
  console.log(`OK ${ok} / FAIL ${fail} → ${dir}/`);
}
