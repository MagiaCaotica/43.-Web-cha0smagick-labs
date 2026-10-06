const fs = require('fs');
const path = require('path');

// Un <source srcset> que da 404 NO hace fallback al <img>: el navegador
// muestra imagen rota. Aqui se comprueba cada srcset de <picture> contra disco.
const SKIP = /(^|[\\/])(node_modules|\.git|vendor|projects|tools[\\/]auto-shorts)([\\/]|$)/;
const html = [];
(function w(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const a = path.join(d, e.name);
    if (SKIP.test(a)) continue;
    if (e.isDirectory()) w(a);
    else if (e.name.endsWith('.html')) html.push(a);
  }
})('.');

const DRY = process.argv.includes('--dry');
const FIXABLE = /(^|\/)images\//; // ruta tipo ../images/x.webp -> ../assets/images/x.webp

let rotos = [];
let arreglables = [];

for (const f of html) {
  const c = fs.readFileSync(f, 'utf8');
  const dir = path.dirname(f);
  for (const m of c.matchAll(/<source[^>]+srcset="([^"]+)"/g)) {
    const s = m[1].trim();
    if (/^https?:|^\/\//i.test(s)) continue; // absoluta, no se comprueba en disco
    const target = path.normalize(path.join(dir, s.split(/[?#]/)[0]));
    if (fs.existsSync(target)) continue;
    rotos.push({ f: f.replace(/\\/g, '/'), src: s, existe: false });
    // ¿existe la misma imagen bajo assets/?
    const alt = target.replace(/(^|[\\/])images([\\/])/, (a, b, c2) => b + 'assets' + c2);
    if (alt !== target && fs.existsSync(alt)) arreglables.push({ f, src: s, alt: alt.replace(/\\/g, '/') });
  }
}

console.log(DRY ? '=== DRY-RUN ===' : '=== ESCRITURA ===');
console.log('paginas revisadas: ' + html.length);
console.log('srcset rotos: ' + rotos.length + '   de ellos arreglables moviendo a assets/: ' + arreglables.length);
rotos.slice(0, 15).forEach(r => console.log('  ROTO  ' + r.f + '  ->  ' + r.src));
if (arreglables.length) {
  console.log('\n--- applicantando ---');
  const byFile = new Map();
  for (const a of arreglables) {
    if (!byFile.has(a.f)) byFile.set(a.f, []);
    byFile.get(a.f).push(a);
  }
  let n = 0;
  for (const [f, list] of byFile) {
    let c = fs.readFileSync(f, 'utf8');
    for (const a of list) {
      // Sustituye solo dentro del atributo srcset, no en cualquier /images/
      const re = new RegExp('(<source[^>]+srcset=")' + a.src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(")');
      if (re.test(c)) { c = c.replace(re, (m, x, y) => x + a.alt + y); n++; }
    }
    if (!DRY) fs.writeFileSync(f, c, 'utf8');
  }
  console.log('  srcset corregidos: ' + n + ' en ' + byFile.size + ' ficheros');
}