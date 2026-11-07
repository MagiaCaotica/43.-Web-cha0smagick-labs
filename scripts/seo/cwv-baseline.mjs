#!/usr/bin/env node
/**
 * Baseline de Core Web Vitals con Lighthouse local.
 *
 * Uso: node scripts/seo/cwv-baseline.mjs [mobile|desktop]
 *
 * Requiere Chrome instalado. Usa CHROME_PATH si esta definido; si no, busca
 * el Chrome de BrowserOS. Guarda data/metrics-cwv.json y imprime una tabla.
 *
 * Ojo: esto es laboratorio, no campo. CrUX necesita la API con key y cuota;
 * la cuota anonima de PageSpeed Insights devuelve 429.
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const strategy = process.argv[2] === 'desktop' ? 'desktop' : 'mobile';
const CHROME = process.env.CHROME_PATH
  || path.join(process.env.LOCALAPPDATA || '', 'BrowserOS', 'Application', 'chrome.exe');

const URLS = [
  '/',
  '/tools/sigil-generator.html',
  '/blog/chaos-magick-beginners-complete-guide.html',
  '/apps/chaos-sigil-generator.html',
  '/books/tarot-chaos-pdf.html',
];

if (!existsSync(CHROME)) {
  console.error('No encuentro Chrome. Define CHROME_PATH.');
  process.exit(1);
}
process.env.CHROME_PATH = CHROME;

const outDir = path.join(tmpdir(), 'cwv-baseline');
mkdirSync(outDir, { recursive: true });
const results = [];

for (const url of URLS) {
  const full = 'https://cha0smagicklabs.com' + url;
  const file = path.join(outDir, url.replace(/[^a-z0-9]+/gi, '_') + '.json');
  const args = [
    path.join(ROOT, 'node_modules', 'lighthouse', 'cli', 'index.js'),
    full,
    '--only-categories=performance,accessibility,seo,best-practices',
    '--output=json',
    '--output-path=' + file,
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    '--quiet',
  ];
  if (strategy === 'desktop') args.push('--preset=desktop');

  process.stdout.write(`midiendo ${url} … `);
  try {
    execFileSync(process.execPath, args, { stdio: 'ignore', timeout: 240000 });
  } catch {
    // Lighthouse termina con 1 en Windows al no poder borrar su carpeta temporal
    // (EPERM), pero escribe el informe igual. Solo es un fallo real si no hay JSON.
  }
  if (!existsSync(file)) {
    console.error('sin informe');
    continue;
  }
  const j = JSON.parse(readFileSync(file, 'utf8'));
  const a = j.audits;
  const row = {
    url,
    strategy,
    performance: Math.round((j.categories.performance?.score || 0) * 100),
    accessibility: Math.round((j.categories.accessibility?.score || 0) * 100),
    seo: Math.round((j.categories.seo?.score || 0) * 100),
    best_practices: Math.round((j.categories['best-practices']?.score || 0) * 100),
    lcp_s: Number(a['largest-contentful-paint']?.numericValue / 1000 || 0).toFixed(2),
    cls: Number(a['cumulative-layout-shift']?.numericValue || 0).toFixed(3),
    tbt_ms: Math.round(a['total-blocking-time']?.numericValue || 0),
    fcp_s: Number(a['first-contentful-paint']?.numericValue / 1000 || 0).toFixed(2),
  };
  results.push(row);
  console.log(`${row.performance}/100 · LCP ${row.lcp_s}s · CLS ${row.cls} · TBT ${row.tbt_ms}ms`);
}

const payload = {
  $comment: 'Core Web Vitals de laboratorio (Lighthouse). No es dato de campo: CrUX requiere API key y la cuota anonima da 429. Reproducible con scripts/seo/cwv-baseline.mjs.',
  captured_at: new Date().toISOString().slice(0, 10),
  strategy,
  chrome: CHROME,
  lighthouse: JSON.parse(readFileSync(path.join(ROOT, 'node_modules', 'lighthouse', 'package.json'), 'utf8')).version,
  results,
};
writeFileSync(path.join(ROOT, 'data', 'metrics-cwv.json'), JSON.stringify(payload, null, 2) + '\n');
console.log('\nescrito data/metrics-cwv.json');
