/**
 * fix_lang_globe.mjs
 * ------------------------------------------------------------------
 * Repairs the site-wide language-picker button in every HTML page:
 *
 *   1. The globe glyph had been corrupted by a latin1/cp1252 round-trip
 *      during an earlier bulk write. Across 753 pages the button body was
 *      variously literal "??" (369 files), mojibake prefixes like "ðŸŒ"
 *      (46 files), "-xR-" style garbage (169 files), a bare word
 *      "Language" (5 files) or -- in only 23 files -- the real U+1F310
 *      emoji. Almost none of them rendered a globe.
 *      => Replaced with an INLINE SVG globe: font-independent, cannot be
 *         re-corrupted by an encoding round-trip, and inherits the
 *         button colour (so :hover still works).
 *
 *   2. 20 files had lost their `title` attribute entirely.
 *      => Restored to "Select Language".
 *
 *   3. Same corruption class hit the flag buttons' `title` tooltips
 *      ("Espa|ol", "???????", "???" ...).
 *      => Restored to the correct native language names.
 *
 * The script is IDEMPOTENT: re-running it produces byte-identical output.
 *
 *   Usage:  node projects/scripts/fix_lang_globe.mjs [--dry]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');

const SKIP_DIRS = new Set(['node_modules', '.git', '.omo', 'dist', 'build', '.github']);

// Feather-style globe, drawn with primitives so there is no encoded asset.
// Vertical meridian + horizontal equator inside a stroked circle.
const GLOBE_SVG =
  '<svg class="lang-globe" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' +
  'width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
  '<circle cx="12" cy="12" r="9"/>' +
  '<path d="M3 12h18"/>' +
  '<path d="M12 3c2.5 2.7 3.8 5.8 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.8-3.8-9S9.5 5.7 12 3z"/>' +
  '</svg>';

// Native language names, written as escapes so this script stays pure ASCII
// and cannot itself be damaged by an encoding round-trip.
const LANG_NAMES = {
  en: 'English',
  es: 'Espa\u00f1ol',
  fr: 'Fran\u00e7ais',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Portugu\u00eas',
  ru: '\u0420\u0443\u0441\u0441\u043a\u0438\u0439',
  ja: '\u65e5\u672c\u8a9e',
  'zh-CN': '\u4e2d\u6587',
};

const TOGGLE_BTN = /<button([^>]*\blang-toggle-btn\b[^>]*)>([\s\S]*?)<\/button>/g;
const FLAG_BTN = /<button([^>]*\bswitchLang\('([^']+)'\)[^>]*)>([\s\S]*?)<\/button>/g;

const stats = {
  files: 0,
  skippedNonUtf8: 0,
  toggleChanged: 0,
  toggleAlreadyOk: 0,
  flagChanged: 0,
  written: 0,
};

/** Strip every title="..." from an attribute string, then append a clean one. */
function withTitle(attrs, title) {
  const cleaned = attrs.replace(/\s+title\s*=\s*"[^"]*"/g, '');
  return `${cleaned} title="${title}"`;
}

function fixToggle(html) {
  return html.replace(TOGGLE_BTN, (match, attrs, inner) => {
    const next = `<button${withTitle(attrs, 'Select Language')}>${GLOBE_SVG}</button>`;
    if (next === match) {
      stats.toggleAlreadyOk += 1;
    } else {
      stats.toggleChanged += 1;
    }
    return next;
  });
}

function fixFlags(html) {
  return html.replace(FLAG_BTN, (match, attrs, code, inner) => {
    const name = LANG_NAMES[code];
    if (!name) return match; // unknown locale -> leave untouched
    const next = `<button${withTitle(attrs, name)}>${inner}</button>`;
    if (next === match) {
      // already correct; still counted via toggle stats, nothing to do
    } else {
      stats.flagChanged += 1;
    }
    return next;
  });
}

/** Reject files that are not valid UTF-8 so we never corrupt legacy bytes. */
function isValidUtf8(buf) {
  try {
    new TextDecoder('utf-8', { fatal: true }).decode(buf);
    return true;
  } catch {
    return false;
  }
}

function* walk(dir) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      yield* walk(full);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      yield full;
    }
  }
}

for (const file of walk(ROOT)) {
  stats.files += 1;
  const rel = path.relative(ROOT, file);

  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch (err) {
    console.error(`SKIP (unreadable) ${rel}: ${err.message}`);
    stats.skippedNonUtf8 += 1;
    continue;
  }

  const html = buf.toString('utf8');
  if (!isValidUtf8(buf)) {
    console.error(`SKIP (not valid UTF-8, left untouched) ${rel}`);
    stats.skippedNonUtf8 += 1;
    continue;
  }

  const before = html;
  const after = fixFlags(fixToggle(html));

  if (after === before) continue;

  if (!DRY) {
    fs.writeFileSync(file, after, 'utf8');
    stats.written += 1;
  } else {
    stats.written += 1;
  }
}

console.log(DRY ? '[DRY RUN] ' : '');
console.log(`html files scanned        : ${stats.files}`);
console.log(`buttons given the SVG globe: ${stats.toggleChanged}`);
console.log(`buttons already correct    : ${stats.toggleAlreadyOk}`);
console.log(`flag titles repaired       : ${stats.flagChanged}`);
console.log(`files skipped (encoding)   : ${stats.skippedNonUtf8}`);
console.log(`files rewritten            : ${stats.written}`);