import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Trimmed descriptions (~155-165 chars each)
const updates = {
  'apps/iching-oracle.html': {
    meta: 'Cast the I Ching with an authentic three-coin algorithm. 64 hexagrams with full interpretations, reading history, journaling, and multilingual support. The most accurate I Ching oracle app for Android.',
    lead: 'Cast the I Ching with an authentic three-coin algorithm. All 64 hexagrams with full interpretations, reading history, journal entry, and multilingual support — 100% offline.',
  },
  'apps/norse-rune-oracle.html': {
    meta: 'Get accurate rune readings with the Norse Rune Oracle. 12+ spreads for love, wealth, protection & daily guidance. Authentic Elder Futhark divination app for Android. Unlock Viking wisdom now.',
    lead: 'Unlock Viking wisdom with 12+ rune spreads for love, wealth, protection, and daily guidance. Authentic Elder Futhark divination — 100% offline, no ads.',
  },
  'apps/chaos-sigil-generator.html': {
    meta: 'Create unique cryptographic sigils from your intentions. Supports Runic, Egyptian, Hebrew, Arabic, Greek & Cyrillic alphabets plus Planetary Kameas. The ultimate chaos magick sigil app for Android.',
    lead: 'Encode your Will into unique cryptographic sigils using ancient alphabets and planetary magic squares. 6 writing systems, 7 planetary kameas — all offline.',
  },
  'apps/arcana-goetia.html': {
    meta: 'Command the 72 spirits of Solomon with Arcana Goetia. Digital sigil generator, complete Lemegeton lore, and guided invocation — all offline. The ultimate Goetic app for Android practitioners.',
    lead: 'Command the 72 spirits of Solomon with precision sigils, complete Lemegeton lore, and guided rituals — all offline. Your digital grimoire for serious Goetic practice.',
  },
  'apps/psi-gym.html': {
    meta: 'Enhance your psychic abilities with PSI GYM. Professional Zener card training, ESP testing & statistical analysis. The ultimate intuition trainer for Android — sharpen your extrasensory perception.',
    lead: 'Train your intuition and extrasensory perception with professional Zener cards and advanced statistical tracking. Turn any moment into a psychic training session.',
  },
  'apps/dream-machine.html': {
    meta: 'Train your mind to wake within the dream. Lucid dreaming induction with dream journal, reality checks, binaural beats and MILD/WILD techniques. The complete lucid dreaming app for Android.',
    lead: 'Master the art of lucid dreaming with induction protocols, dream journal, reality checks, and binaural beats. Wake up inside your dreams tonight.',
  },
  'apps/lunar-phase-calculator.html': {
    meta: 'Track lunar phases for magic rituals, biodynamic gardening, and wellness timing. Precision moon data, guided rituals, and stunning live visualization. The ultimate lunar phase app for Android.',
    lead: 'Track moon phases for magic, wellness, and biodynamic gardening with stunning real-time visuals. Moonrise, moonset, illumination — all at your fingertips.',
  },
  'apps/unofficial-rider-waite-tarot.html': {
    meta: 'Full Rider-Waite tarot deck offline. 6 spreads, upright & reversed meanings, searchable encyclopedia, and 7 languages. The most complete and accessible tarot app for Android.',
    lead: 'Full Rider-Waite deck offline with 6 spreads, encyclopedia, and 7-language support. Every card, every symbol, every spread — all in your pocket.',
  },
  'apps/liber-lvpinux-pdf.html': {
    meta: 'Discover Liber Lvpinux by Frater Alekos — a complete grimoire on lycanthropic chaos magic and the path of the animagus. Includes rituals, sigils, and shapeshifting techniques. Download the PDF.',
    lead: 'A complete grimoire on lycanthropy, chaos magic and the path of the animagus. Rituals, sigils, and shapeshifting techniques for the modern werewolf.',
  },
  'apps/tratado-runas-cazadoras-caos-pdf.html': {
    meta: 'Discover the Chaos Hunter Runes — a disruptive magical system by Zener of Cydonia. Master the 64 runic servitors, the Magic Chess Matrix, and advanced sigil warfare. Download the PDF.',
    lead: 'A complete magical system by Zener of Cydonia. Master the 64 runic servitors, the Magic Chess Matrix, and sigil warfare techniques for chaos practitioners.',
  },
  'apps/ouija-cazadora-pdf.html': {
    meta: 'Master the ouija board with Chaos Magic. A practical guide by Zener de Cydonia and Frater Alekos for safe and effective spirit communication and oracular rituals. Download the PDF.',
    lead: 'Master the ouija board with Chaos Magic. A practical guide for safe and effective spirit communication, possession cleansing, and oracular rituals.',
  },
  'apps/manual-activacion-servidores-magicos-pdf.html': {
    meta: 'Learn how to create and activate magical servitors with Chaos Magick. Practical step-by-step guide by Frater Alekos with sigil design, feeding protocols, and empowerment. Download the PDF.',
    lead: 'Learn to create and activate magical servitors with Chaos Magick. Practical guide with sigil design, feeding protocols, and empowerment techniques.',
  },
};

let count = 0;
for (const [file, { meta, lead }] of Object.entries(updates)) {
  const fp = resolve(root, file);
  let content = readFileSync(fp, 'utf8');
  let changed = false;

  const escMeta = meta.replace(/"/g, '&quot;');

  const metaRegex = /<meta name="description" content="[^"]*">/;
  const newMeta = `<meta name="description" content="${escMeta}">`;
  if (content.match(metaRegex)?.[0] !== newMeta) {
    content = content.replace(metaRegex, newMeta);
    changed = true;
  }

  const ogRegex = /<meta property="og:description" content="[^"]*">/;
  const newOg = `<meta property="og:description" content="${escMeta}">`;
  if (content.match(ogRegex)?.[0] !== newOg) {
    content = content.replace(ogRegex, newOg);
    changed = true;
  }

  const twRegex = /<meta name="twitter:description" content="[^"]*">/;
  const newTw = `<meta name="twitter:description" content="${escMeta}">`;
  if (content.match(twRegex)?.[0] !== newTw) {
    content = content.replace(twRegex, newTw);
    changed = true;
  }

  const leadRegex = /<p class="lead-text">[^<]*<\/p>/;
  const newLead = `<p class="lead-text">${lead}</p>`;
  if (content.match(leadRegex)?.[0] !== newLead) {
    content = content.replace(leadRegex, newLead);
    changed = true;
  }

  if (changed) {
    writeFileSync(fp, content, 'utf8');
    count++;
    console.log(`✓ ${file}`);
  }
}

console.log(`\nDone — ${count} files updated.`);
