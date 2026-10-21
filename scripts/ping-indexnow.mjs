// IndexNow ping: avisa a Bing/Yandex/Seznam de que han cambiado URLs.
//
// Uso:
//   node scripts/ping-indexnow.mjs            -> solo las paginas del ultimo commit
//   node scripts/ping-indexnow.mjs --all      -> todas las URLs del sitemap
//   node scripts/ping-indexnow.mjs <url> ...  -> esas URLs
//
// La clave se verifica en <host>/<clave>.txt, asi que el host tiene que ser
// el del sitio de verdad: antes apuntaba a cha0smagick.com, un dominio que
// no resuelve, y por eso el ping nunca servia para nada.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const key = fs.readFileSync(path.join(root, 'indexnow-key.txt'), 'utf8').trim();
const host = new URL(process.env.SITE_URL || 'https://cha0smagicklabs.com').host;
const SITE = `https://${host}`;

/** Ficheros .html que cambiaron entre el commit base y HEAD. */
function changedFiles(base) {
  const range = base ? `${base}..HEAD` : 'HEAD~1..HEAD';
  try {
    const out = execSync(`git diff --name-only ${range} -- "*.html"`, { cwd: root, encoding: 'utf8' });
    return out.split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

/** Ruta en disco -> URL publica del sitio. */
function toUrl(file) {
  const rel = file.replace(/\\/g, '/');
  if (rel === 'index.html') return `${SITE}/`;
  if (rel.endsWith('/index.html')) return `${SITE}/${rel.slice(0, -'index.html'.length)}`;
  return `${SITE}/${rel}`;
}

let urls = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (process.argv.includes('--all')) {
  const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
} else if (!urls.length) {
  urls = changedFiles(process.env.INDEXNOW_BASE).map(toUrl);
}
if (!urls.length) { console.log('indexnow: sin URLs que avisar'); process.exit(0); }

// El protocolo admite 10.000 URLs por peticion.
const CHUNK = 10000;
for (let i = 0; i < urls.length; i += CHUNK) {
  const batch = urls.slice(i, i + CHUNK);
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation: `${SITE}/${key}.txt`, urlList: batch })
  });
  console.log(`indexnow: ${res.status} — ${batch.length} URLs enviadas (${host})`);
  if (res.status >= 400) { console.log(await res.text()); process.exit(1); }
}
