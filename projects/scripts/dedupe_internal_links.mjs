#!/usr/bin/env node
/**
 * dedupe_internal_links.mjs
 * ---------------------------------------------------------------------------
 * Funde los `<section class="internal-links">Related Resources</section>`
 * duplicados que cierran casi todos los posts de `blog/`.
 *
 * EL PROBLEMA ("cajas que se repiten")
 * -----------------------------------
 * 495 de 635 posts repiten el mismo bloque de recursos relacionados 2 (o mas)
 * veces, con cajas visualmente identicas apiladas y enlaces solapados. Eso es
 * el "revoltijo de cajas" que reporto el usuario.
 *
 * HAY DOS DIALECTOS DE BLOQUE
 * ----------------------------
 * A) SIMPLE - una fila por categoria con enlaces separados por " | ":
 *      <div><strong>Apps:</strong> <a href=..>A</a> | <a href=..>B</a></div>
 *    Es el mayoritario. Se parsea y se regenera limpio: los enlaces se unen por
 *    href, se deduplican y se reordenan en una sola fila.
 *
 * B) RICHO - tarjetas con <p>, <span>, <br>, precios y varios enlaces por
 *    tarjeta. Un parser de texto plano lo trunca y pierde enlaces, asi que
 *    NUNCA se regenera. Se fusiona de forma ESTRUCTURAL: se conserva el
 *    markup interior byte a byte y solo se quita el <h3> y el </section> de
 *    las cajas duplicadas.
 *
 * En ambos casos el resultado es UNA sola <section> con UN solo
 * <h3>Related Resources</h3> y todo el contenido preservado.
 *
 * USO
 * ---
 *   node projects/scripts/dedupe_internal_links.mjs         # aplica
 *   node projects/scripts/dedupe_internal_links.mjs --dry   # solo informa
 *
 * IDEMPOTENTE. Invariante verificada antes de escribir: ningun href presente
 * en el archivo original puede faltar en el resultado.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BLOG = path.join(ROOT, 'blog');
const DRY = process.argv.includes('--dry');
const SKIP_DIRS = new Set(['node_modules', '.git', '.omo', 'dist', 'build', '.github', '.playwright-mcp']);

/* ------------------------------------------------------------------ */
/* Patrones                                                            */
/* ------------------------------------------------------------------ */

const RE_SECTION = /<section class="internal-links"[^>]*>[\s\S]*?<\/section>/g;
const RE_OPEN = /^<section class="internal-links"[^>]*>/;
const RE_H3 = /<h3[^>]*>[\s\S]*?<\/h3>/;
const RE_CAT_BLOCK = /<div([^>]*)>\s*<strong[^>]*>([\s\S]*?)<\/strong>([\s\S]*?)<\/div>/g;
const RE_ENTRY = /^\s*<a\s+[^>]*href\s*=\s*"([^"]*)"[^>]*>([\s\S]*?<\/a>)?\s*([\s\S]*)$/;

// Distancia maxima entre dos cajas para considerarlas el mismo bloque. Por
// encima de esto son dos secciones legitimas y no se tocan.
const MAX_GAP = 20000;

// Una pasada anterior emitio "Apps::" (el parser conservaba los dos puntos del
// <strong> y render los agregaba otra vez). Reparacion idempotente.
const RE_DOUBLE_COLON = /(<strong[^>]*>)([^<]{1,40}?):{2,}(<\/strong>)/g;

const repairDoubleColon = (t) => t.replace(RE_DOUBLE_COLON, '$1$2:$3');

/* ------------------------------------------------------------------ */
/* Estructura                                                           */
/* ------------------------------------------------------------------ */

function openTagOf(section) {
  const m = section.match(RE_OPEN);
  return m ? m[0] : null;
}

/** Contenido entre el <section ...> de apertura y el </section> final. */
function innerOf(section) {
  const open = openTagOf(section);
  if (!open) return null;
  const closeAt = section.lastIndexOf('</section>');
  if (closeAt < 0) return null;
  return section.slice(open.length, closeAt);
}

/**
 * Dialecto rico: el bloque usa <p>, <span>, <br>, <ul> o <table> en vez de
 * una simple lista de " | ". OJO: <div> NO es senal de rico, porque el
 * dialecto simple tambien tiene sus filas en <div>.
 */
function isRich(section) {
  const inner = innerOf(section) || '';
  return /<p[\s>]|<span[\s>]|<br[\s/>]|<ul[\s>]|<ol[\s>]|<table[\s>]/i.test(inner);
}

/** Texto del <h3> de la caja, o null si la caja no tiene titulo. */
function h3TextOf(section) {
  const h3 = section.match(RE_H3);
  if (!h3) return null;
  return h3[0].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------------ */
/* Dialecto A: simple -> parsear y regenerar                           */
/* ------------------------------------------------------------------ */

function parseEntries(body) {
  return body
    .split('|')
    .map((r) => r.trim())
    .filter(Boolean)
    .map((raw) => {
      const m = raw.match(RE_ENTRY);
      if (!m) return { raw };
      return { href: m[1], label: (m[2] || '').replace(/<\/?a[^>]*>/g, ''), tail: (m[3] || '').trim() };
    });
}

function parseSimple(section) {
  const cats = [];
  for (const m of section.matchAll(RE_CAT_BLOCK)) {
    // El <strong> original ya trae los dos puntos; se guardan sin ellos
    // porque renderSimple() los agrega (si no, sale "Apps::").
    const label = m[2].replace(/<[^>]+>/g, '').trim().replace(/:\s*$/, '');
    if (!label) return null;
    cats.push({ label, entries: parseEntries(m[3]) });
  }
  // Si el parser no/accounto todas las filas <div>, no es dialecto simple.
  const divCount = (section.match(/<div[\s>]/g) || []).length;
  if (!cats.length || cats.length !== divCount) return null;
  return cats;
}

function mergeSimple(groups) {
  const order = [];
  const byLabel = new Map();
  for (const cats of groups) {
    for (const cat of cats) {
      if (!byLabel.has(cat.label)) {
        byLabel.set(cat.label, { label: cat.label, seen: new Map(), loose: [] });
        order.push(cat.label);
      }
      const b = byLabel.get(cat.label);
      for (const e of cat.entries) {
        if (e.raw !== undefined) {
          if (!b.loose.includes(e.raw)) b.loose.push(e.raw);
          continue;
        }
        const prev = b.seen.get(e.href);
        if (!prev) b.seen.set(e.href, { ...e });
        else if (!prev.tail && e.tail) prev.tail = e.tail; // texto suelto en la copia duplicada
      }
    }
  }
  return order.map((l) => byLabel.get(l));
}

function renderSimple(open, h3, buckets) {
  const out = [open, h3 || '<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>'];
  buckets.forEach((b, i) => {
    const parts = [];
    for (const e of b.seen.values()) parts.push(`<a href="${e.href}">${e.label}</a>${e.tail ? ' ' + e.tail : ''}`);
    for (const r of b.loose) parts.push(r);
    out.push(`<div${i === buckets.length - 1 ? '' : ' style="margin-bottom: 1rem;">'}>`);
    out.push(`<strong style="color: var(--text-primary);">${b.label}:</strong> ${parts.join(' | ')}`);
    out.push('</div>');
  });
  out.push('</section>');
  return out.join('\n');
}

/* ------------------------------------------------------------------ */
/* Dialecto B: rico -> fusionar markup byte a byte                     */
/* ------------------------------------------------------------------ */

function renderRich(sections) {
  const first = sections[0];
  const open = openTagOf(first);
  const h3 = (first.match(RE_H3) || [''])[0];
  const parts = [open, h3];
  for (const s of sections) {
    let inner = innerOf(s);
    if (inner == null) continue;
    // La caja 1 ya emitio su <h3> arriba; las demas lo pierden para que
    // quede un unico titulo.
    inner = inner.replace(RE_H3, '');
    parts.push(s === first ? inner : '\n' + inner.replace(/^\s+/, ''));
  }
  parts.push('</section>');
  return parts.join('');
}

/* ------------------------------------------------------------------ */
/* Core                                                                */
/* ------------------------------------------------------------------ */

function transform(text) {
  const hits = [];
  for (const m of text.matchAll(RE_SECTION)) hits.push({ start: m.index, end: m.index + m[0].length, html: m[0] });
  if (hits.length < 2) return { status: hits.length === 1 ? 'single' : 'none', out: text };

  // IMPORTANTE: no todas las cajas repetidas son duplicadas. 168 posts
  // tienen DOS bloques distintos que comparten la clase: uno titulado
  // "Related Resources" y otro sin <h3> que es un CTA de oferta ("Put this
  // into practice", con tarjetas <p> y precios). Fusionarlos seria un error
  // editorial. Solo se fusionan cajas con el MISMO texto de <h3>.
  const byTitle = new Map();
  for (const h of hits) {
    const title = h3TextOf(h.html);
    if (title === null) continue; // caja sin titulo: nunca se fusiona
    if (!byTitle.has(title)) byTitle.set(title, []);
    byTitle.get(title).push(h);
  }

  const groups = [];
  let skippedFar = 0;
  for (const [title, list] of byTitle) {
    if (list.length < 2) continue;
    // Solo es un duplicado si las cajas no estan lejanisimas entre si.
    let ok = true;
    for (let i = 1; i < list.length; i++) {
      if (text.slice(list[i - 1].end, list[i].start).length > MAX_GAP) { ok = false; break; }
    }
    if (ok) groups.push({ title, list });
    else skippedFar++;
  }

  if (!groups.length) return { status: 'no-duplicates', out: text, boxes: hits.length, skippedFar, titles: [] };

  // Ediciones no solapadas: una por grupo (la caja 1 se sustituye por la
  // fusionada) y una por cada caja duplicada restante (se borra). Se aplican
  // de derecha a izquierda para que los indices sigan siendo validos. El
  // contenido que habia entre medias (video embebido, share-section,
  // related-articles) NUNCA se toca: solo se eliminan las cajas.
  const edits = [];
  let collapsed = 0;
  let mode = null;
  for (const g of groups) {
    const sections = g.list.map((h) => h.html);
    let replacement = null;
    let gmode = 'rich';
    if (sections.every((s) => !isRich(s))) {
      const parsed = sections.map(parseSimple);
      if (parsed.every(Boolean)) {
        replacement = renderSimple(openTagOf(sections[0]), sections[0].match(RE_H3)[0], mergeSimple(parsed));
        gmode = 'simple';
      }
    }
    if (!replacement) replacement = renderRich(sections);
    mode = mode === null ? gmode : mode === gmode ? gmode : 'mixed';
    edits.push({ start: g.list[0].start, end: g.list[0].end, text: replacement });
    for (let i = 1; i < g.list.length; i++) edits.push({ start: g.list[i].start, end: g.list[i].end, text: '' });
    collapsed += g.list.length - 1;
  }

  edits.sort((a, b) => b.start - a.start);
  let out = text;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

  return { status: 'merged', out, collapsed, mode, groups: groups.length, skippedFar, titles: groups.map((g) => g.title) };
}

/* ------------------------------------------------------------------ */
/* Verificacion                                                         */
/* ------------------------------------------------------------------ */

function hrefs(t) {
  return new Set([...t.matchAll(/href="([^"]+)"/g)].map((m) => m[1]));
}

function verify(out, file, original, res) {
  const errs = [];

  // Invariante critica: ningun enlace puede perderse.
  const before = hrefs(original);
  const after = hrefs(out);
  const lost = [...before].filter((h) => !after.has(h));
  if (lost.length) errs.push(`perdidos ${lost.length} enlaces (${lost.slice(0, 4).join(', ')})`);

  // Cada grupo fusionado debe dejar exactamente una caja con su titulo.
  for (const title of res.titles) {
    const re = new RegExp('<h3[^>]*>' + title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '<\\/h3>', 'g');
    const n = (out.match(re) || []).length;
    if (n !== 1) errs.push(`titulo "${title}" aparece ${n} veces (esperado 1)`);
  }

  // El total de cajas debe bajar exactamente lo que se fusiono.
  const b = (original.match(/<section class="internal-links"/g) || []).length;
  const a = (out.match(/<section class="internal-links"/g) || []).length;
  if (a !== b - res.collapsed) errs.push(`cajas ${b} -> ${a}, se esperaban ${b - res.collapsed}`);

  if (errs.length) throw new Error(`ABORT en ${path.basename(file)}: ${errs.join('; ')}`);
}

/* ------------------------------------------------------------------ */

function htmlFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...htmlFiles(p));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function assertUtf8(text, file) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(new TextEncoder().encode(text));
  } catch {
    throw new Error(`ABORT: ${file} no es UTF-8 valido. No se escribe.`);
  }
}

const files = htmlFiles(BLOG);
const tally = { merged: 0, single: 0, none: 0, 'no-duplicates': 0 };
const modes = { simple: 0, rich: 0, mixed: 0 };
let mergedFiles = 0;
let collapsed = 0;
let repairedFiles = 0;
let skippedFar = 0;
const aborted = [];

for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const text = repairDoubleColon(raw);
  let res;
  try {
    res = transform(text);
  } catch (err) {
    aborted.push(err.message);
    continue;
  }
  tally[res.status]++;
  if (res.skippedFar) skippedFar += res.skippedFar;
  if (res.status !== 'merged' || res.out === text) {
    if (text !== raw) {
      repairedFiles++;
      if (!DRY) fs.writeFileSync(file, text, 'utf8');
    }
    continue;
  }
  try {
    assertUtf8(res.out, file);
    verify(res.out, file, raw, res);
  } catch (err) {
    aborted.push(err.message);
    continue;
  }
  mergedFiles++;
  collapsed += res.collapsed;
  modes[res.mode] = (modes[res.mode] || 0) + 1;
  if (!DRY) fs.writeFileSync(file, res.out, 'utf8');
}

console.log(`\nmode                    : ${DRY ? 'DRY-RUN (nada escrito)' : 'APLICADO'}`);
console.log(`blog/*.html             : ${files.length}`);
console.log(`sin internal-links      : ${tally.none}`);
console.log(`una sola caja           : ${tally.single}`);
console.log(`varias, pero SIN dup    : ${tally['no-duplicates']}  (RR + CTA "Put this into practice")`);
console.log(`FUNDIDAS                : ${mergedFiles} posts, ${collapsed} cajas duplicadas eliminadas`);
console.log(`  dialecto simple       : ${modes.simple || 0}`);
console.log(`  dialecto rico         : ${modes.rich || 0}  (markup preservado byte a byte)`);
console.log(`  mixto                 : ${modes.mixed || 0}`);
console.log(`grupos saltados >20k gap: ${skippedFar}`);
console.log(`reparados "::"          : ${repairedFiles}`);
console.log(`abortados               : ${aborted.length}`);
if (aborted.length) aborted.slice(0, 15).forEach((e) => console.log('   ! ' + e));
if (aborted.length > 15) console.log(`   ... +${aborted.length - 15}`);
console.log('');
