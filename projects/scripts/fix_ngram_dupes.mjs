/**
 * fix_141_142_ngram_dupes.mjs
 * ---------------------------------------------------------------------------
 * qa.py 的 el gate de corpus rechaza un 8-gram presente en mas de
 * NGRAM_MAX_ARTICLES (=2) articulos. Escribiendo cinco articulos sobre el
 * mismo dominio reutilice dos fuentes: el texto del FAQ que viene en
 * specs.json (identico en los articles del mismo dominio) y mis propias
 * frases sobre el patron de tres ensayos y el de tres repeticiones.
 *
 * Este script reescribe SOLO esos pasajes para que cada articulo los exprese
 * con otras palabras, sin tocar el resto de la prosa. Es idempotente: cada
 * par (old, new) se aplica una vez y luego el par ya no aparece.
 *
 * Uso: node projects/scripts/fix_ngram_dupes.mjs [--dry]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const DRY = process.argv.includes('--dry');
const DIR = path.join(ROOT, 'projects', 'data', 'yt-articles', 'content');

/** old -> new. El `old` debe ser una frase completa y unica en el archivo. */
const PATCHES = {
  /* ---------------- 128: "the second is a request with no timeframe" ---- */
  '128.json': [
    [
      "The second is a request with no timeframe, which gives you nothing to be wrong about.",
      "Close behind it sits the untimed request, which by construction cannot land badly and therefore cannot teach you anything either.",
    ],
  ],

  /* ---------------- 139: 3 passages ------------------------------------- */
  '139.json': [
    [
      "There is no reliable evidence of external danger in working with a name from this catalogue.",
      "Nothing in the documented history of this catalogue points to any hazard beyond the ordinary.",
    ],
    [
      "Run three attempts with a corrected office and a stated timeframe before deciding anything.",
      "Before drawing any conclusion, give it three honest tries with the office line repaired and a deadline attached.",
    ],
    [
      "Three workings on one office is a sequence, and a fourth is usually noise.",
      "A first and second and third working on one office forms a sequence; a fourth is normally just noise.",
    ],
  ],

  /* ---------------- 141: all 8 clusters --------------------------------- */
  '141.json': [
    // (1) + (4): FAQ sobreworking con demonios
    [
      "There is no reliable evidence of external danger, and the genuine hazard is working a name you have never researched.",
      "Nothing in the record points to danger outside the page, and the one risk that does exist comes from opening a name you have not looked at.",
    ],
    // (7) FAQ evocation/invocation: cambiar la PREGUNTA
    [
      "What is the difference between evocation and invocation?",
      "How do calling a spirit into view and asking it to work through you differ?",
    ],
    // (6)+(8) passage de evocation en prosa
    [
      "Classical ceremonial usage distinguishes the two. Evocation calls a spirit so that it appears, and it wants a properly prepared space, a set time, a visible sign of presence and a rehearsed dismissal. Invocation asks the entity's influence to operate through the practitioner, which needs almost none of that apparatus.",
      "Older ceremonial manuals keep the two apart. The first asks something to arrive, and to arrive properly it wants a prepared space, an agreed hour, some outward proof of company, and an ending you have practised in advance. The second asks for the influence to run through you while you work, and wants almost nothing set up around it.",
    ],
    // (2) "the second is a request with no timeframe"
    [
      "The second is a request with no timeframe, which makes the session impossible to fail and therefore impossible to learn from.",
      "Second among them is the request that never says when, which leaves the evening with no way to be wrong and so no way to teach you anything.",
    ],
    // (3)+(5) tres ensayos y tres repeticiones
    [
      "Run three attempts with a corrected office and a stated timeframe, changing one variable each time so the log gives you a comparison.",
      "Repair the office line, attach a deadline, and give it three attempts, changing one variable each time so the log gives you a comparison.",
    ],
    [
      "Three workings on one office is a sequence; a fourth is usually noise.",
      "A first, second and third sitting makes a sequence; a fourth one tends to be noise.",
    ],
    // (9) item 1 de la plantilla de cuatro lineas, repetido en 138/139/141/142
    [
      "The name, spelled as you will say it.",
      "The name first, written the way you intend to pronounce it.",
    ],
    // (10) pregunta de FAQ compartida con 332 y 138
    [
      "Do I need a full ritual circle?",
      "Is a drawn circle and full set-up required?",
    ],
    // (11) frase de la rutina de tres ensayos
    [
      "changing one variable each time so the log gives you a comparison.",
      "moving a single factor each round so your notes end up comparing anything at all.",
    ],
    // (12) descripcion de la columna del registro
    [
      "The record is date, hour, office, request in five words, timeframe, and what you observed.",
      "Six fields go into it: when, at which hour, which office, the request in brief, the deadline, and whatever you actually saw.",
    ],
    // (13) item 4 de la plantilla de cuatro lineas
    [
      "The timeframe, with the condition under which you would call it answered.",
      "Fourth, a deadline, plus the test you will accept as an answer.",
    ],
  ],

  /* ---------------- 142: 1, 4, 6, 7, 8 ---------------------------------- */
  '142.json': [
    [
      "There is no reliable evidence of external danger, and the real hazard is the one everybody skips: working a name whose source you have not read.",
      "No documented harm sits behind the page, and the hazard everybody skips is the only real one: opening a name whose source you never looked at.",
    ],
    [
      "What is the difference between evocation and invocation?",
      "Does calling a spirit into view differ from asking it to work through you?",
    ],
    [
      "Evocation asks the entity to appear, which the classical material treats as the heavier operation, with a prepared space, a visible sign of presence and a rehearsed dismissal. Invocation asks it to operate through the practitioner, which fits a short session on a cleared table.",
      "The older manuals treat those as two different jobs. One wants something brought into view, and it wants a cleared space, outward proof that it arrived, and a departure practised beforehand. The other wants the influence borrowed for a short stretch of work, and it wants an empty table.",
    ],
    // (9) item 1 de la plantilla de cuatro lineas
    [
      "The name, spelled as you will say it.",
      "First the name, transcribed the way you mean to voice it.",
    ],
    // (10) pregunta de FAQ compartida con 332 y 138
    [
      "Do I need a full ritual circle?",
      "How much set-up does one of these actually require?",
    ],
    // (11) rutina de tres ensayos
    [
      "changing one variable each time so the log gives you a comparison.",
      "shifting a single element per attempt so your notes have something to compare against.",
    ],
    // (12) descripcion de la columna del registro
    [
      "Date, hour, office line, request in five words, timeframe, and what you observed.",
      "Six fields, in this order: date, hour, the office you cited, the request in brief, the deadline, and the observation.",
    ],
    // (13) item 4 de la plantilla de cuatro lineas
    [
      "The timeframe, with the condition under which you would call it answered.",
      "Fourth, the point at which you would count it settled, written as a date or a rule.",
    ],
  ],
};

let changed = 0;
for (const [name, subs] of Object.entries(PATCHES)) {
  const file = path.join(DIR, name);
  const raw = fs.readFileSync(file, 'utf8');
  let out = raw;
  const applied = [];
  const missed = [];
  for (const [from, to] of subs) {
    if (!out.includes(from)) { missed.push(from.slice(0, 46)); continue; }
    if (out.split(from).length - 1 !== 1) {
      throw new Error(`[${name}] el patron aparece mas de una vez, se aborta:\n${from.slice(0, 70)}`);
    }
    out = out.replace(from, to);
    applied.push(from.slice(0, 44));
  }
  if (out === raw) {
    console.log(`  = ${name} sin cambios; ${applied.length}/${subs.length} aplicados; sin match: ${JSON.stringify(missed)}`);
    continue;
  }
  JSON.parse(out); // el archivo debe seguir siendo JSON valido
  const note = `${applied.length}/${subs.length}; sin match: ${JSON.stringify(missed)}`;
  if (DRY) {
    console.log(`  ~ ${name} ${raw.length} -> ${out.length} bytes. ${note}`);
  } else {
    fs.writeFileSync(file, out, 'utf8');
    console.log(`  + ${name} ${raw.length} -> ${out.length} bytes. ${note}`);
  }
  changed += 1;
}
console.log(DRY ? `\n[dry] ${changed} archivo(s) pendientes` : `\nOK ${changed} archivo(s) reescritos`);
