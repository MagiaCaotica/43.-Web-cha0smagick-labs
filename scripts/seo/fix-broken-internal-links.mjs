#!/usr/bin/env node
// Repara los enlaces internos rotos del sitio.
//
// Contexto: `verify-final.mjs` reportaba 389 enlaces rotos, pero no son 389
// problemas: son 147 destino distintos multiplicados por los cruces. Se
// reducen a cinco causas, y cuatro son mecanicas:
//
//   R1  prefijo duplicado   `blog/apps/psi-gym.html` escrito desde un articulo
//                           de `blog/`. El destino real es `apps/psi-gym.html`.
//                           47 destinos, ~110 ocurrencias.
//   R2  slug truncado      `blog/tarot-reversed-meanings-complete-guide.html`
//                           cuando el archivo real termina en `-2026`.
//                           Un unico archivo empieza por el slug roto.
//   R3  titulo como slug   Alguien building enlaces con el <title> en vez del
//                           slug: `blog/EVP & Spirit Box Session Setup (2026).html`.
//                           Mapa explicito, uno por uno.
//   R4  tool renombrada    `tools/rune-caster.html` no existe; la que existe es
//                           `tools/rune-drawer.html`. Mapa explicito.
//   R5  sin equivalente    No hay tool que corresponda y el enlace no estaba
//                           respaldando ninguna afirmacion: se desenvuelve,
//                           dejando el texto y quitando el `<a>`. No se
//                           inventa un destino.
//
// Diseno:
//  - R1 y R2 solo actuan si el destino reparado EXISTE y es UNICO. La unicidad
//    es lo que impide que una correccion plausible sea en realidad otra pagina.
//  - R3 y R4 son mapas explicitos y auditables, no heuristicas.
//  - Nada se borra: un enlace sin equivalente conserva su texto.
//  - Idempotente: tras correrlo, el reporte de enlaces rotos da 0 o solo los
//    casos que el script no puede decidir sin ayuda.
//
// Uso:  node scripts/seo/fix-broken-internal-links.mjs
//       node scripts/seo/fix-broken-internal-links.mjs --write
//       node scripts/seo/fix-broken-internal-links.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

// ---------------------------------------------------------------- R3 ---
// Titulo -> slug real. Cada entrada se verifico contra el <title> del archivo:
// el slug indicado es el unico cuyo titulo normalizado coincide o es el
// prefijo comun mas largo. `evp-spirit-box-session-setup` esta aparte porque el
// titulo truncado no alcanza a identificar un unico articulo.
const TITLE_MAP = {
  '5 Best Tarot Spreads for Love and Relationships: Deepen Your Connection.html': 'blog/tarot-spreads-for-love-relationships.html',
  'Arcana Goetia App Review: Summon the 72 Spirits on Android.html': 'blog/arcana-goetia-app-review.html',
  'Celtic Cross Tarot Spread: Complete Guide to All 10 Positions.html': 'blog/celtic-cross-tarot-spread-meaning-positions.html',
  'EVP & Spirit Box Session Setup: A Complete Guide (2026).html': 'blog/evp-spirit-box-session-setup.html',
  'EVP vs Spirit Box: Understanding Paranormal Audio Investigation Methods.html': 'blog/evp-vs-spirit-box-comparison-guide.html',
  'Goetia Seals & Sigils: How to Use the 72 Seals of Solomon (2026).html': 'blog/goetia-seals-and-sigils-guide.html',
  'Haunted Roads Guide: The Best Haunted Road Trip Itineraries & Urban Legends.html': 'blog/haunted-roads-guide.html',
  'How to Cast the I Ching Digitally: Coin Method Explained (2026).html': 'blog/how-to-cast-iching-digitally.html',
  'How to Safely Invoke a Goetic Spirit for Beginners: Step-by-Step Ritual 2026.html': 'blog/goetia-beginners-ritual.html',
  'I Ching Hexagram Meanings: Complete 64 Hexagram Guide (2026).html': 'blog/i-ching-hexagram-meanings-complete-guide.html',
  'I Ching Oracle App Review: Best Book of Changes App for.html': 'blog/i-ching-oracle-app-review.html',
  'Norse Rune Oracle App Review: Best Viking Rune Reader.html': 'blog/norse-rune-oracle-app-review.html',
  'Norse Runes Guide: Elder Futhark Divination for Beginners.html': 'blog/norse-runes-beginners-guide.html',
  'Rider Waite Tarot for Beginners: Complete Guide to the 78 Cards.html': 'blog/rider-waite-tarot-beginners-guide.html',
  'Rune Spreads for Beginners: 5 Simple Layouts That Actually Work (2026).html': 'blog/rune-spreads-for-beginners.html',
  'Spirit Box Frequency Settings: Best Sweep Rates for Clear EVP (2026).html': 'blog/spirit-box-frequency-settings.html',
  'Tarot Card Combinations: How to Read Multiple Cards Together in a Spread.html': 'blog/tarot-card-combinations-reading-techniques.html',
  'Tarot Spreads for Beginners: Celtic Cross, 3-Card & More.html': 'blog/tarot-spreads-beginners-guide.html',
  // El texto del enlace ya era el slug correcto: solo se reconstruyo mal el href.
  'Which Goetia Spirit Should You Call? Love, Money & Knowledge (2026).html': 'blog/which-goetia-spirit-for-love-money-knowledge.html',
};

// ---------------------------------------------------------------- R4 ---
// Tool renombrada o con otro nombre. La decision de a donde va cada una es de
// producto, no mecanica, asi que queda escrita y es facil de revertir.
const TOOL_MAP = {
  // 182 enlaces. "Caster" y "drawer" son el mismo acto: tirar runas.
  'tools/rune-caster.html': 'tools/rune-drawer.html',
  // 31 enlaces. No hay diario de suenos; lo mas cercano es el planificador de
  // suenos lucidos, que es la herramienta de suenos del set.
  'tools/dream-journal.html': 'tools/lucid-dream-training-planner.html',
  // 30 enlaces. No hay "lector de tarot"; la referencia de cartas es lo que
  // cumple la misma funcion para alguien que consulta una tirada.
  'tools/tarot-reader.html': 'tools/tarot-card-reference.html',
  // Renombres directos.
  'tools/candle-color.html': 'tools/candle-color-calculator.html',
  'tools/moon-phase.html': 'tools/moon-phase-calendar.html',
  // El unico nombre cercano en cada caso.
  'tools/astrology-calculator.html': 'tools/astrology-sign-calculator.html',
  'tools/mercury-retrograde-tracker.html': 'tools/planetary-retrograde-calendar.html',
  'tools/moon-phase-calculator.html': 'tools/lunar-phase.html',
  'tools/moon-calendar.html': 'tools/moon-phase-calendar.html',
  'tools/planetary-hour-calculator.html': 'tools/planetary-hours.html',
};

// ---------------------------------------------------------------- R5 ---
// Sin equivalente en el catalogo. Un enlace cada uno, en paginas de cuerpo.
// Se desenvuelven: el texto se conserva, el `<a>` desaparece. Ninguno
// respaldaba una afirmacion comercial, asi que no se pierde contenido.
const UNWRAP = [
  'tools/contract-checklist.html',
  'tools/flame-reading.html',
  'tools/numerology.html',
  'tools/progressions.html',
  'tools/retrograde-protocol.html',
  'tools/synastry.html',
  'tools/transit-tracker.html',
  // Articulos que el catalogo nunca tuvo. Se comprobo con busqueda por titulo
  // (ningun articulo comparte mas de 2 de sus palabras significativas) y con
  // `git log --diff-filter=AD`: nunca existieron. Reapuntar a "lo mas parecido"
  // seria inventar un destino, asi que solo se quita el enlace.
  'blog/the-book-of-samuels-magick.html',
  'blog/goetian-demon-hierarchies.html',
  'blog/astrology-houses-complete-guide.html',
  'blog/synastry-relationship-astrology-guide.html',
  'blog/best-dream-interpretation-apps-android-2026.html',
  'blog/best-dream-journal-apps-2026.html',
  'blog/how-to-create-sigil-spare-method-step-guide.html',
  'blog/dream-journaling-methods-digital-2026.html',
  'blog/dream-machine-app-dream-incubation-guide.html',
  'blog/new-moon-intention-setting.html',
  'blog/full-moon-ritual-releasing.html',
  'blog/meditation-for-psychic-protection-guide.html',
  'blog/history-of-ghost-hunting.html',
  'blog/astrology-transits-guide.html',
  'blog/reiki-complete-guide.html',
  'blog/crystal-healing-guide.html',
  'blog/meditation-guide.html',
  'blog/herbalism-guide.html',
  'blog/sigil-magic-complete-guide.html',
  'blog/best-psychic-apps-onetime.html',
  'blog/best-divination-tools-2026.html',
  // `docs/` es documentacion interna, no una pagina publicada.
  'docs/revenue-catalog-reconciliation.html',
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

const exists = (rel) => fs.existsSync(rel) || fs.existsSync(rel + 'index.html') || fs.existsSync(rel.replace(/\/$/, '') + '/index.html');

const allFiles = walk(ROOT).map((a) => a.split(path.sep).join('/').slice(ROOT.length + 1));
const byStem = new Map();
for (const f of allFiles) {
  const s = f.replace(/\.html$/, '');
  if (!byStem.has(s)) byStem.set(s, []);
  byStem.get(s).push(f);
}

// R2: slug truncado. Solo si hay UN solo archivo cuyo stem empieza por el roto.
// ---------------------------------------------------------------- R2b ---
// Slug casi correcto pero no resoluble por unicidad. El destino se verifico
// contra el <title> del archivo indicado: o coincide el titulo entero, o el
// slug roto es el slug real con un prefijo/`the` de mas o de menos.
const SLUG_MAP = {
  'blog/psychic-abilities-you-already-have-and-how-to-train-them.html': 'blog/the-psychic-abilities-you-already-have-and-how-to-train-them.html',
  'blog/planets-in-natal-charts.html': 'blog/natal-planets-explained.html', // titulo identico
  'blog/how-to-make-money-sigil.html': 'blog/money-sigil-guide.html', // titulo "How to Make a Money Sigil..."
  'blog/natal-chart-reading-guide-beginners.html': 'blog/natal-astrology-chart-reading-guide.html',
  'blog/rune-reading-guide.html': 'blog/free-online-rune-reading-guide.html',
  'blog/chaos-magic-servitor-guide-2026.html': 'blog/servitor-guide-2026.html', // titulo identico
  // La pagina legal vive en la raiz, no en `pages/`.
  'pages/privacy-policy.html': 'privacy-policy.html',
  // Typo de guion: `iching` por `i-ching`.
  'blog/iching-oracle-app-review.html': 'blog/i-ching-oracle-app-review.html',
  // Un slug de tool escrito dentro de `blog/`.
  'blog/i-ching.html': 'tools/iching.html',
  'blog/lunar-phase-calendar.html': 'tools/lunar-phase.html',
  'blog/dream-machine-how-to-lucid-dreaming.html': 'apps/dream-machine.html',
};

function resolveTruncatedSlug(brokenStem) {
  const hits = allFiles.filter((f) => f.replace(/\.html$/, '').startsWith(brokenStem));
  return hits.length === 1 ? hits[0] : null;
}

const DIR_SEG = /^(blog|apps|books|tools|landing-pages|pages|lead-magnet)$/;

// Devuelve la URL RELATIVA desde `fromRel` hacia `toRel`.
function relHref(fromRel, toRel) {
  const rel = path.posix.relative(path.posix.dirname(fromRel), toRel);
  return rel.startsWith('.') ? rel : './' + rel.replace(/^\.\//, '');
}

function resolve(brokenAbs, fromRel) {
  // R3 explicito
  const base = path.posix.basename(brokenAbs);
  if (TITLE_MAP[base]) return { rule: 'R3', to: TITLE_MAP[base] };

  // R2b explicito
  if (SLUG_MAP[brokenAbs]) return { rule: 'R2b', to: SLUG_MAP[brokenAbs] };

  // R4 explicito
  if (TOOL_MAP[brokenAbs]) return { rule: 'R4', to: TOOL_MAP[brokenAbs] };

  // R5 explicito
  if (UNWRAP.includes(brokenAbs)) return { rule: 'R5', to: null };

  // R1 prefijo duplicado: blog/apps/X -> apps/X. Solo si existe.
  const m = brokenAbs.match(/^([^/]+)\/([^/]+)\/(.+)$/);
  if (m) {
    const [, a, b, rest] = m;
    if (DIR_SEG.test(a) && DIR_SEG.test(b)) {
      const cand = `${b}/${rest}`;
      if (exists(cand)) return { rule: 'R1', to: cand };
    }
  }

  // R2 slug truncado, en cualquier directorio.
  const stem = brokenAbs.replace(/\.html$/, '');
  if (byStem.has(stem)) return { rule: 'R2', to: byStem.get(stem)[0] };
  const t = resolveTruncatedSlug(stem);
  if (t) return { rule: 'R2', to: t };

  return null;
}

const report = [];
const unresolved = [];
let changed = 0;

for (const rel of allFiles) {
  const abs = path.join(ROOT, rel);
  const html = fs.readFileSync(abs, 'utf8');
  if (!/<a\b[^>]*href=/i.test(html)) continue;

  let out = html;
  const touched = [];
  let unwrapped = 0;

  out = out.replace(/<a\b([^>]*?)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi, (whole, pre, href, post, inner) => {
    if (/^(https?:|mailto:|tel:|javascript:|data:|\/\/|#)/i.test(href)) return whole;
    if (!/\.html?$|\/$/.test(href)) return whole;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(rel), href));
    if (exists(target)) return whole;

    const r = resolve(target, rel);
    if (!r) { unresolved.push({ from: rel, target, href }); return whole; }
    if (r.to === null) { unwrapped++; touched.push({ rule: 'R5', target }); return inner; }
    const nh = relHref(rel, r.to);
    if (!exists(path.posix.normalize(path.posix.join(path.posix.dirname(rel), nh)))) {
      unresolved.push({ from: rel, target, href, why: `la reparacion ${r.rule} -> ${r.to} tampoco existe` });
      return whole;
    }
    touched.push({ rule: r.rule, from: href, to: nh });
    return `<a${pre}href="${nh}"${post}>${inner}</a>`;
  });

  if (out !== html) {
    report.push({ file: rel, fixes: touched.length, unwrapped, touched });
    changed++;
    if (WRITE) fs.writeFileSync(abs, out, 'utf8');
  }
}

const byRule = {};
for (const r of report) for (const t of r.touched) byRule[t.rule] = (byRule[t.rule] || 0) + 1;

if (JSONOUT) {
  console.log(JSON.stringify({ pages: report.length, byRule, unresolved, report }, null, 2));
} else {
  console.log(`paginas con enlaces reparados : ${report.length}`);
  console.log(`enlaces reescritos            : ${Object.values(byRule).reduce((a, b) => a + b, 0)}`);
  console.log(`enlaces desenvolvados (R5)    : ${report.reduce((n, r) => n + r.unwrapped, 0)}`);
  console.log(`paginas escritas              : ${WRITE ? changed : 0}`);
  console.log(`por regla: ${Object.entries(byRule).map(([k, v]) => `${k}=${v}`).join('  ') || '-'}`);
  console.log(`SIN DECISION (${unresolved.length}) — no se invento nada:`);
  const seen = new Set();
  for (const u of unresolved) {
    if (seen.has(u.target)) continue;
    seen.add(u.target);
    console.log(`  ${u.target}   (${unresolved.filter((x) => x.target === u.target).length} enlaces)  ${u.why || ''}`);
  }
  if (!WRITE && report.length) console.log('\n(dry-run: usa --write para aplicar)');
}