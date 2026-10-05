#!/usr/bin/env node
// fix-head-debt.mjs — corrige la deuda mecanica de <head> que queda tras 2a5c93bf.
//
// MIDIDA REAL (scripts/seo/measure-head-debt.mjs, 921 HTML):
//   title >60 = 381   missing viewport = 93   og:title = 11   og:desc = 11
//   sin schema = 9    lang = 2   h1 = 3   title = 1   desc = 1   canonical = 2   desc>160 = 7
//
// HALLAZGO QUE CAMBIA LA REGLA: de los 363 titles >60 medidos aqui,
// 334 son de UN solo segmento y 0 tienen la marca como sufijo. La plantilla
// rota "A | A | Cha0smagick Labs" YA fue reparada en 2a5c93bf. Lo que queda no es
// repeticion de plantilla: es que el propio tema es largo. Asi que no se recorta a
// lo bruto: se recorta con criterio y en frontera de palabra.
//
// Uso:  node scripts/seo/fix-head-debt.mjs            (informe, no escribe)
//       node scripts/seo/fix-head-debt.mjs --write    (aplica)
//       node scripts/seo/fix-head-debt.mjs --json

import fs from 'node:fs';
import path from 'node:path';

const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;
const SITE = 'https://cha0smagicklabs.com';
const TITLE_MAX = 60;
const DESC_MAX = 160;

// ---------------------------------------------------------------- entities
const ENT = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'", '&mdash;': '—', '&ndash;': '–', '&middot;': '·', '&hellip;': '…', '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”' };
const dec = (s) => s.replace(/&(?:amp|lt|gt|quot|#39|apos|mdash|ndash|middot|hellip|rsquo|lsquo|ldquo|rdquo);/g, (m) => ENT[m] ?? m);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const norm = (s) => dec(s).replace(/\s+/g, ' ').trim();

// ---------------------------------------------------------------- title
// Recorta en frontera de palabra. Antepone un "…" solo si ya se perdio
// contenidoDot, porque un titulo que empieza por puntos suspensivos se ve peor
// en el SERP que uno simplemente corto.
function clipWords(s, max) {
  if (s.length <= max) return s;
  const words = s.split(' ');
  let out = '';
  for (const w of words) {
    const next = out ? out + ' ' + w : w;
    if (next.length > max) break;
    out = next;
  }
  out = out.replace(/[\s,;:.\-–—&/]+$/u, ''); // no terminar en puntuacion colgante
  if (!out) out = s.slice(0, max).replace(/\s+\S*$/u, ''); // primer token mas largo que el limite
  return out + (out.length < s.length ? '…' : '');
}

// --- Candidatos de recorte, en cascada.
//
// MEDIDO (no supuesto): los 30 clusters de slug duplicado del blog (ver
// docs/seo-audit-2026-10-03.md, "#1 Self-cannibalisation") comparten un PREFIJO
// largo. "Hidden, Lost and Forbidden Knowledge: ..." es identico en sus 15 copias
// hasta mucho mas alla del caracter 60. Si recorte por la cabeza antes del ":",
// las 15 copias caen en el MISMO string y creo 63 titles duplicados, empeorando
// justo la cannibalizacion que se intento arreglar. Por eso el orden es:
//
//   1. clip en frontera de palabra (conserva mas texto que distingue)
//   2. cabeza antes de ":" si es sustancial (mas legible, peOR para uniqueness)
//   3. si ambos colisionan -> NO se toca el titulo y se reporta el cluster
//
// El caller deduplica y aplica esta cascada; aqui solo se ofrecen candidatos.
function candidates(rawTitle) {
  const full = norm(rawTitle);
  if (full.length <= TITLE_MAX) return [];

  // Los de dos o mas segmentos: el segmento 0 ES el tema (medido: 29 casos,
  // p.ej. "Arcana Goetia: Ritual & Sigils | Goetic Grimoire & 72 Spirits...").
  const segs = full.split('|').map((s) => s.trim()).filter(Boolean);
  const base = segs.length >= 2 ? segs[0] : full;
  if (base.length <= TITLE_MAX) return [base];

  const out = [clipWords(base, TITLE_MAX)];

  const i = base.indexOf(':');
  if (i > 0) {
    const head = base.slice(0, i).trim();
    if (head.length >= 25) {
      // La cabeza es mas legible; se ofrece como 2a opcion, no como primera.
      out.push(head);
    } else {
      const tail = base.slice(i + 1).trim();
      if (tail) {
        const joined = `${head}: ${tail}`;
        out.push(joined.length <= TITLE_MAX ? joined : clipWords(joined, TITLE_MAX));
      }
    }
  }
  return [...new Set(out)].filter((c) => c && c.length <= TITLE_MAX);
}

function newDesc(rawDesc) {
  const full = norm(rawDesc);
  if (full.length <= DESC_MAX) return { value: full, changed: false };
  return { value: clipWords(full, DESC_MAX), changed: true };
}

// ---------------------------------------------------------------- seo helpers
function canonicalFor(rel) {
  const clean = rel.replace(/\\/g, '/').replace(/^\.\//, '');
  const file = clean.split('/').pop();
  const dir = clean.includes('/') ? clean.slice(0, clean.lastIndexOf('/') + 1) : '';
  const base = file === 'index.html' ? '' : file.replace(/\.html$/, '');
  const slug = dir + base;
  return SITE + (slug ? '/' + slug : '/');
}

function upsertMeta(html, attr, content, { after } = {}) {
  const re = new RegExp(`<meta\\s+${attr}\\s*=\\s*["'][^"']*["'][^>]*>`, 'i');
  if (re.test(html)) return html;
  const tag = `<meta ${attr}="${esc(content)}">`;
  if (after) {
    const ra = new RegExp(`(<meta\\s+${after}\\s*=\\s*["'][^"']*["'][^>]*>)`, 'i');
    if (ra.test(html)) return html.replace(ra, `$1\n    ${tag}`);
  }
  const rc = /(<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>)/i;
  if (rc.test(html)) return html.replace(rc, `$1\n    ${tag}`);
  const rh = /(<head[^>]*>)/i;
  if (rh.test(html)) return html.replace(rh, `$1\n    ${tag}`);
  return html;
}

function upsertCanonical(html, url) {
  if (/<link\s+rel\s*=\s*["']canonical["']/i.test(html)) return html;
  const tag = `<link rel="canonical" href="${url}">`;
  const rm = /(<meta\s+name\s*=\s*["']description["'][^>]*>)/i;
  if (rm.test(html)) return html.replace(rm, `$1\n    ${tag}`);
  const rc = /(<meta\s+charset\s*=\s*["'][^"']*["'][^>]*>)/i;
  if (rc.test(html)) return html.replace(rc, `$1\n    ${tag}`);
  return html;
}

function setLang(html) {
  const m = html.match(/<html\b([^>]*)>/i);
  if (!m) return { html, changed: false };
  if (/\blang\s*=/i.test(m[1])) return { html, changed: false };
  return { html: html.replace(m[0], `<html lang="es"${m[1]}>`), changed: true };
}

// ---------------------------------------------------------------- walk
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!SKIP.test(p)) walk(p, out); }
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const files = walk('.');

// ---------------------------------------------------------------- pase 1: reserva de titulos
// Se recorre dos veces porque la eleccion del titulo depende de la GLOBALIDAD:
// un titulo solo es aceptable si no colisiona con NINGUN otro titulo del sitio,
// ni con los que ya son <=60, ni con los que el propio script este escribiendo.
const pages = files.map((f) => {
  const rel = f.replace(/\\/g, '/').replace(/^\.\//, '');
  const html = fs.readFileSync(f, 'utf8');
  const tm = html.match(/<title>([\s\S]*?)<\/title>/i);
  return { f, rel, html, cur: tm ? norm(tm[1]) : '' };
});

const claimed = new Set();
for (const p of pages) if (p.cur && p.cur.length <= TITLE_MAX) claimed.add(p.cur.toLowerCase());

const chosen = new Map();   // rel -> titulo nuevo
const clusters = new Map(); // titulo -> [rels que no pudieron discerning]
const skipped = [];

for (const p of pages) {
  const cands = candidates(p.cur);
  if (!cands.length) continue;
  let hit = null;
  for (const c of cands) {
    const k = c.toLowerCase();
    if (!claimed.has(k)) { hit = c; break; }
  }
  if (hit) { chosen.set(p.rel, hit); claimed.add(hit.toLowerCase()); continue; }
  // Ningun candidato es libre: la pagina es miembro de un cluster de slug.
  // NO se degrada el titulo a un duplicado; se deja como esta y se reporta.
  const k = cands[0].toLowerCase();
  if (!clusters.has(k)) clusters.set(k, []);
  clusters.get(k).push(p.rel);
  skipped.push(p.rel);
}

// ---------------------------------------------------------------- pase 2: aplicar
const report = [];
for (const p of pages) {
  let html = p.html;
  const orig = html;
  const acts = [];
  let titleText = p.cur;

  // --- title
  const newT = chosen.get(p.rel);
  if (newT) {
    const tm = html.match(/<title>([\s\S]*?)<\/title>/i);
    if (tm) {
      html = html.replace(tm[0], `<title>${esc(newT)}</title>`);
      acts.push('title');
      titleText = newT;
    }
  }

  // --- description
  const dm = html.match(/<meta\s+name\s*=\s*["']description["']\s*content\s*=\s*["']([\s\S]*?)["'][^>]*>/i)
          || html.match(/<meta\s+content\s*=\s*["']([\s\S]*?)["']\s*name\s*=\s*["']description["'][^>]*>/i);
  let descText = '';
  if (dm) {
    descText = norm(dm[1]);
    if (descText.length > DESC_MAX) {
      const d = newDesc(dm[1]);
      const re = new RegExp(dm[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      html = html.replace(re, dm[0].replace(dm[1], esc(d.value)));
      acts.push('desc');
      descText = d.value;
    }
  }

  // --- viewport / og / canonical / lang (todo anadido, nada se reescribe)
  if (!/<meta\s+name\s*=\s*["']viewport["']/i.test(html)) { html = upsertMeta(html, 'name="viewport"', 'width=device-width, initial-scale=1', { after: 'charset' }); acts.push('viewport'); }
  if (titleText && !/<meta\s+property\s*=\s*["']og:title["']/i.test(html)) { html = upsertMeta(html, 'property="og:title"', titleText); acts.push('og:title'); }
  if (descText && !/<meta\s+property\s*=\s*["']og:description["']/i.test(html)) { html = upsertMeta(html, 'property="og:description"', descText); acts.push('og:description'); }
  if (!/<link\s+rel\s*=\s*["']canonical["']/i.test(html)) { html = upsertCanonical(html, canonicalFor(p.rel)); acts.push('canonical'); }
  const l = setLang(html);
  if (l.changed) { html = l.html; acts.push('lang'); }

  if (html !== orig) {
    report.push({ f: p.rel, acts, title: titleText, descLen: descText.length });
    if (WRITE) fs.writeFileSync(p.f, html, 'utf8');
  }
}

if (JSONOUT) { console.log(JSON.stringify({ report, clusters: [...clusters], skipped }, null, 2)); }
else {
  const counts = {};
  for (const r of report) for (const a of r.acts) counts[a] = (counts[a] || 0) + 1;
  console.log(WRITE ? 'ESCRITO:' : 'SIMULACION (--write para aplicar)');
  console.log('ficheros a modificar:', report.length);
  console.log('acciones:', JSON.stringify(counts));

  // Verificacion dura: ningun titulo debe quedar duplicado tras el cambio.
  const finalTitles = new Map();
  for (const p of pages) {
    const t = chosen.get(p.rel) ?? p.cur;
    if (!t) continue;
    const k = t.toLowerCase();
    if (finalTitles.has(k)) finalTitles.get(k).push(p.rel);
    else finalTitles.set(k, [p.rel]);
  }
  const dupes = [...finalTitles.entries()].filter(([, v]) => v.length > 1);
  console.log(`titulos duplicados tras aplicar: ${dupes.length} grupos`);

  console.log(`\n-- CLUSTERS: ${clusters.size} titulos que NO se tocan por colision --`);
  console.log('   (son los clusters de slug duplicado del blog; ver docs/seo-audit-2026-10-03.md)');
  const sorted = [...clusters.entries()].sort((a, b) => b[1].length - a[1].length);
  for (const [t, v] of sorted.slice(0, 12)) console.log(`   [${v.length}] "${t}"  p.ej. ${v[0]}`);
  if (sorted.length > 12) console.log(`   ... y ${sorted.length - 12} mas`);

  console.log('\n-- 12 ejemplos de titulo recortado --');
  for (const r of report.filter((x) => x.acts.includes('title')).slice(0, 12)) console.log(`   ${r.f}  "${r.title}"`);
}
