#!/usr/bin/env node
// Deja un solo <h1> por pagina: el que esta dentro del contenido.
//
// 37 paginas del blog tienen dos <h1> y en 27 el texto es IDENTICO. El primero
// no es el titulo del articulo: es el titulo de la cabecera, dentro de un
// <a> que lleva a la portada. Un enlace a la portada no es un encabezado, asi
// que Google recibe dos H1 iguales y no puede elegir el titulo.
//
// Hay dos plantillas en el repo, y por eso dos formas de reconocerlo:
//
//   A  class="site-title"   Plantilla nueva: el template ya lo marca asi, o
//                           sea que la clase es un discriminador exacto.
//   B  <header>...<a><h1>  Plantilla vieja, sin clase: el H1 de cabecera es el
//                           primero dentro de un <a> a la portada. Entre el
//                           <a> y el <h1> puede haber un <img class="header-logo">
//                           asi que el hueco no puede cruzar un </a>, para no
//                           capturar el H1 siguiente.
//
// Se degrada a `div` y no a `h2` porque css/style.css ya declara
// `header .site-title, header h1`: la rama .site-title existe justo para cuando
// el titulo de cabecera no es un H1. El estilo queda identico sin tocar el CSS
// y sin crear un encabezado que compita con el H1 real.
//
// Guardas: solo interviene si hay 2+ H1 y el de cabecera es el PRIMERO. El H1
// de contenido nunca se toca.
//
// Uso:  node scripts/seo/fix-duplicate-h1.mjs [--write] [--json]

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.').split(path.sep).join('/');
const WRITE = process.argv.includes('--write');
const JSONOUT = process.argv.includes('--json');
const SKIP = /(^|[\\/])(node_modules|\.git|\.github|vendor|projects|auto-shorts)([\\/]|$)/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, e.name);
    if (SKIP.test(abs)) continue;
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.toLowerCase().endsWith('.html')) out.push(abs);
  }
  return out;
}

// A: el H1 que el propio template marca como titulo del sitio.
const RE_A = /<h1\b([^>]*\bclass\s*=\s*["'][^"']*\bsite-title\b[^"']*["'][^>]*)>([\s\S]*?)<\/h1>/i;
// B: primer H1 dentro de un <a> de vuelta a la portada. El hueco no cruza </a>.
const RE_B = /(<header\b[^>]*>[\s\S]{0,800}?<a\b[^>]*>)(?:(?!<\/a>)[\s\S]){0,300}?<h1\b([^>]*)>([\s\S]*?)<\/h1>/i;

const textOf = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const CLASS_ATTR = /\s*\bclass\s*=\s*(["'])[\s\S]*?\1/i;

const files = walk(ROOT);
const report = [];
const skipped = [];
let written = 0;

for (const abs of files) {
  const rel = abs.split(path.sep).join('/').slice(ROOT.length + 1);
  const html = fs.readFileSync(abs, 'utf8');
  if ((html.match(/<h1\b/gi) || []).length < 2) continue;

  // A primero: la clase es mas fiable que suponer la forma del marcado.
  let rule = 'site-title', at = -1, attrs = '', inner = '';
  const a = html.match(RE_A);
  if (a) {
    at = a.index; attrs = a[1]; inner = a[2];
  } else {
    const b = html.match(RE_B);
    if (b) { rule = 'header-link'; at = b.index + b[1].length; attrs = b[2]; inner = b[3]; }
  }
  if (at < 0) { skipped.push({ rel, why: 'no matchea A ni B' }); continue; }

  // El H1 a degradar tiene que ser el primero de la pagina.
  if (html.search(/<h1\b/i) !== at) {
    skipped.push({ rel, why: 'el H1 de cabecera no es el primero' });
    continue;
  }

  // Se conserva la clase que ya traia y se anade site-title si faltaba.
  const cls = (attrs.match(CLASS_ATTR) || [, null, ''])[2] || attrs.match(/class\s*=\s*(["'])([\s\S]*?)\1/i);
  const cur = (attrs.match(/class\s*=\s*(["'])([\s\S]*?)\1/i) || [, '', ''])[2];
  const merged = /\bsite-title\b/.test(cur) ? cur : (cur ? cur + ' site-title' : 'site-title');
  const rest = attrs.replace(CLASS_ATTR, '');
  const whole = `<h1${attrs}>${inner}</h1>`;
  const out = html.replace(whole, `<div class="${merged}"${rest}>${inner}</div>`);

  report.push({ rel, rule, h1: textOf(inner).slice(0, 70) });
  if (WRITE) { fs.writeFileSync(abs, out, 'utf8'); written++; }
}

if (JSONOUT) {
  console.log(JSON.stringify({ written, report, skipped }, null, 2));
} else {
  const n = (r) => report.filter((x) => x.rule === r).length;
  console.log(`paginas revisadas          : ${files.length}`);
  console.log(`paginas corregidas         : ${report.length}`);
  console.log(`  regla A site-title       : ${n('site-title')}`);
  console.log(`  regla B header-link      : ${n('header-link')}`);
  console.log(`escritas                   : ${WRITE ? written : 0}`);
  console.log(`sin tocar (piden decision) : ${skipped.length}`);
  for (const s of skipped) console.log(`  ${s.rel}  ${s.why}`);
  if (!WRITE && report.length) console.log('\n(dry-run: usa --write para aplicar)');
}