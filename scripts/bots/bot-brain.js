/**
 * bot-brain.js — Shared Knowledge Base for Telegram & Discord Bots
 * 
 * Central product catalog, website links, and response templates.
 * Single source of truth for both bots.
 */

const fs = require('fs');
const path = require('path');

// ── Dynamic offers (3.1.1 — R21) ──
// Source of truth: data/offers.json. Update the JSON to change what bots show —
// no code change needed. Optional remote refresh via env OFFERS_API_URL.
const OFFERS_FILE = path.join(__dirname, 'data', 'offers.json');

function loadLocalCatalog() {
  try {
    const raw = JSON.parse(fs.readFileSync(OFFERS_FILE, 'utf8'));
    if (Array.isArray(raw.apps) && Array.isArray(raw.books) && raw.bundle) return raw;
    console.warn('⚠️ offers.json invalid shape — using empty catalog');
  } catch (err) {
    console.warn('⚠️ offers.json not readable (' + err.message + ') — using empty catalog');
  }
  return { apps: [], books: [], bundle: {} };
}

const CATALOG = loadLocalCatalog();

async function refreshOffers() {
  const url = process.env.OFFERS_API_URL;
  if (url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const remote = await res.json();
      if (!Array.isArray(remote.apps) || !Array.isArray(remote.books) || !remote.bundle) {
        throw new Error('invalid catalog shape');
      }
      CATALOG.apps = remote.apps;
      CATALOG.books = remote.books;
      CATALOG.bundle = remote.bundle;
      return { source: 'remote', apps: CATALOG.apps.length, books: CATALOG.books.length };
    } catch (err) {
      console.warn('⚠️ offers remote refresh failed (' + err.message + ') — keeping current catalog');
    }
  }
  const local = loadLocalCatalog();
  CATALOG.apps = local.apps;
  CATALOG.books = local.books;
  CATALOG.bundle = local.bundle;
  return { source: 'local', apps: CATALOG.apps.length, books: CATALOG.books.length };
}

const BRAIN = {
  version: '1.0.0',
  
  // ── Website ──
  site: {
    name: 'Cha0smagick Labs',
    url: 'https://cha0smagicklabs.com',
    blog: 'https://cha0smagicklabs.com/blog/',
    library: 'https://cha0smagicklabs.com/blog/',
    funnel: (slug) => `https://cha0smagicklabs.com${slug}`,
  },

  // ── Social ──
  social: {
    telegram: {
      channel: 'https://t.me/cha0smagicklabs',
      group: 'https://t.me/+krfQJgro4hBkNTE5',
    },
    discord: 'https://discord.gg/PSfn26xqgD',
    twitter: 'https://x.com/Cha0smagickLABS',
    pinterest: 'https://pinterest.com/cha0smagicklabs',
  },

  // ── Apps (Google Play — one-time purchase, no subscriptions) ──
  // Data lives in data/offers.json (source of truth, 3.1.1 R21)
  apps: CATALOG.apps,

  // ── Books (PDF — one-time purchase, no subscriptions) ──
  // Data lives in data/offers.json (source of truth, 3.1.1 R21)
  books: CATALOG.books,

  // ── Bundle ──
  // Data lives in data/offers.json (source of truth, 3.1.1 R21)
  bundle: CATALOG.bundle,

  // ── Free Tools ──
  freeTools: [
    { name: 'I Ching Oracle', url: 'https://cha0smagicklabs.com/tools/iching-online.html' },
    { name: 'Rune Oracle Online', url: 'https://cha0smagicklabs.com/tools/runes-online.html' },
    { name: 'Sigil Generator (Free)', url: 'https://cha0smagicklabs.com/tools/sigil-generator.html' },
    { name: 'Lunar Phase', url: 'https://cha0smagicklabs.com/tools/lunar-phase.html' },
    { name: 'Spell Builder', url: 'https://cha0smagicklabs.com/tools/spell-builder.html' },
    { name: 'Astrology Chart', url: 'https://cha0smagicklabs.com/tools/astrology.html' },
    { name: 'Candle Color Calculator', url: 'https://cha0smagicklabs.com/tools/candle-color-calculator.html' },
    { name: 'Pendulum Online', url: 'https://cha0smagicklabs.com/tools/pendulum.html' },
    { name: 'Tengwar Translator', url: 'https://cha0smagicklabs.com/tools/tengwar.html' },
    { name: 'Activador de Servidores', url: 'https://cha0smagicklabs.com/tools/activador-servidores.html' },
  ],

  // ── MailerLite ──
  mailerLite: {
    en: {
      name: 'EN Lead Magnet - Chaos Magick Guide',
      formId: 'I95d94', // confirmado
      group: 'Lead Magnet - Magia del Caos ES',
      description: 'Free Chaos Magick Quickstart Guide PDF',
    },
    es: {
      name: 'ES Lead Magnet - Guia Magia Caos',
      group: 'Lead Magnet - Magia del Caos ES',
      description: '¡Guía Rápida de Magia del Caos — PDF gratuito!',
    },
  },

  // ── Blog Stats ──
  blog: {
    articleCount: 467,
    categories: [
      'chaos-magick',
      'tarot',
      'runes',
      'astrology',
      'witchcraft',
      'lucid-dreaming',
      'goetia',
      'sigils',
      'divination',
      'spells',
    ],
  },

  // ── Response Helpers ──
  helpers: {
    // Format a single app for display
    formatApp: (app) =>
      `📱 *${app.name}*\n${app.shortDesc}\n💰 ${app.price} (one-time, no subs)\n🔗 ${app.funnel}`,

    formatBook: (book) =>
      `📖 *${book.name}*\n${book.shortDesc}\n💰 ${book.price}\n🔗 ${book.url}`,

    formatTool: (tool) =>
      `🔧 *${tool.name}* (FREE)\n🔗 ${tool.url}`,

    // Welcome message for new members
    welcomeMessage: (platform) =>
      `🌟 *Welcome to Cha0smagick Labs!*\n\n` +
      `We are an indie developer creating tools for magick, divination, and esoteric practice. ` +
      `${platform === 'discord' ? 'Explore our channels to learn more!' : 'Use /menu to explore our apps, books, and free tools.'}\n\n` +
      `🔥 *One-time purchases, no subscriptions. Ever.*`,

    // Main menu
    mainMenu: () =>
      `🌀 *Cha0smagick Labs — Main Menu*\n\n` +
      `📱 /apps — Browse our Android apps\n` +
      `📖 /books — Esoteric PDF books\n` +
      `🔧 /tools — Free online tools\n` +
      `📰 /blog — Read our articles (467)\n` +
      `🎁 /bundle — Books bundle (52% off!)\n` +
      `📧 /subscribe — Free PDF guide\n` +
      `🌐 /website — Visit our site\n` +
      `💬 /contact — Get in touch\n\n` +
      `_One-time purchases. No subscriptions. Ever._`,

    // Sales pitch templates
    guestPostPitch: (blogName) =>
      `Hola equipo de ${blogName},\n\n` +
      `Soy el creador de Cha0smagick Labs, un estudio independiente de apps y libros esotéricos ` +
      `(12 apps Android, 7 libros PDF, 10 herramientas gratuitas, 467 artículos).\n\n` +
      `Me encantaría ofrecer un guest post GRATIS para su blog sobre temas como:\n` +
      `• Magia del caos para principiantes\n` +
      `• Cómo crear sigilos efectivos\n` +
      `• Los 7 principios herméticos explicados\n` +
      `• Guía de herramientas de adivinación\n\n` +
      `Sin costo, sin strings attached. Solo compartir conocimiento.\n\n` +
      `Saludos,\nGrindho — Cha0smagick Labs`,

    resourceSuggestion: (blogName) =>
      `Hello ${blogName} team,\n\n` +
      `I run Cha0smagick Labs — an indie developer of 12 Android apps for the occult community ` +
      `(tarot, runes, goetia, sigils, astrology, lucid dreaming) plus 7 PDF books and 10 free tools.\n\n` +
      `I thought your audience might find value in some of our free resources:\n` +
      `• ${BRAIN.site.funnel('/tools/spell-builder.html')} — Interactive spell builder\n` +
      `• ${BRAIN.site.url}/tools/ — Free divination tools (I Ching, Runes, Pendulum)\n` +
      `• ${BRAIN.site.blog} — 467 free articles on chaos magick, tarot, astrology\n\n` +
      `All our apps are one-time purchase, no subscriptions. We believe quality occult tools ` +
      `should be accessible, not a monthly bill.\n\n` +
      `Would you be open to including us in a resource roundup?\n\n` +
      `Best,\nGrindho — Cha0smagick Labs`,

    linkRequest: (blogName) =>
      `Hi ${blogName} team,\n\n` +
      `I noticed your excellent article on [TOPIC] and thought our free guide on ` +
      `"Chaos Magick for Beginners" might be a valuable addition:\n` +
      `→ ${BRAIN.site.funnel('/blog/witchcraft-for-beginners-guide.html')}\n\n` +
      `We also have a free Chaos Magick Quickstart Guide available via email subscription.\n\n` +
      `Would you consider adding a link if it fits your readers?\n\n` +
      `Thanks,\nGrindho — Cha0smagick Labs`,

    // Dynamic offers (3.1.1 — R21): get one offer by id from the live catalog
    getOffer: (id) => CATALOG.apps.find((a) => a.id === id) || CATALOG.books.find((b) => b.id === id) || null,
    getOfferImage: (id) => {
      const offer = CATALOG.apps.find((a) => a.id === id) || CATALOG.books.find((b) => b.id === id) || null;
      return (offer && offer.image) || null;
    },

    // Refresh offers from remote API (env OFFERS_API_URL) or re-read local JSON
    refreshOffers,

    // Groq-powered intelligent Q&A (imported in bot files)
    groqAsk: null, // Set by bot files: async (query, apiKey) => string

    // Use Groq for complex queries, fallback to keyword match for simple
    smartReply: async (query, groqApiKey) => {
      if (!query || !query.trim()) return null;
      // First try keyword match (instant)
      const keywordReply = BRAIN.helpers.autoReply(query);
      if (keywordReply) return keywordReply;
      // If no keyword match AND Groq is available, use AI
      if (BRAIN.helpers.groqAsk && groqApiKey) {
        try {
          return await BRAIN.helpers.groqAsk(query, groqApiKey);
        } catch (err) {
          console.error('⚠️ Groq smart reply error:', err.message);
          return null;
        }
      }
      return null;
    },

    // Auto-reply for Telegram group / Discord
    autoReply: (query) => {
      const q = query.toLowerCase();
      if (q.includes('tarot') || q.includes('rider')) {
        return `🎴 Check our Complete Rider-Waite Tarot app: ${BRAIN.site.funnel('/apps/unofficial-rider-waite-tarot.html')}\nAll 78 cards, multiple spreads, full interpretations. $9.99 one-time.`;
      }
      if (q.includes('run') || q.includes('futhark')) {
        return `ᚱ Norse Rune Oracle: 12+ spreads, Elder Futhark meanings. ${BRAIN.site.funnel('/apps/norse-rune-oracle.html')}`;
      }
      if (q.includes('sigil')) {
        return `✏️ Create powerful sigils with our Chaos Sigil Generator: ${BRAIN.site.funnel('/apps/chaos-sigil-generator.html')}\nOr try the free online version: ${BRAIN.site.funnel('/tools/sigil-generator.html')}`;
      }
      if (q.includes('goetia') || q.includes('spirit')) {
        return `🗝️ Arcana Goetia: Complete 72 spirits grimoire + sigil generator. ${BRAIN.site.funnel('/apps/arcana-goetia.html')}`;
      }
      if (q.includes('dream') || q.includes('lucid')) {
        return `🌙 Dream Machine: Lucid dreaming app with reality checks and dream journal. ${BRAIN.site.funnel('/apps/dream-machine.html')}`;
      }
      if (q.includes('astro') || q.includes('horoscope') || q.includes('zodiac')) {
        return `🌟 Astral Lab: Professional astrology app with natal charts and transits. ${BRAIN.site.funnel('/apps/astral-lab.html')}`;
      }
      if (q.includes('moon') || q.includes('lunar')) {
        return `🌝 Lunar Phase Calculator: Track moon phases for ritual planning. ${BRAIN.site.funnel('/apps/lunar-phase-calculator.html')}`;
      }
      if (q.includes('free') || q.includes('gratis') || q.includes('tool')) {
        return `🔧 Free tools:\n• I Ching: ${BRAIN.site.funnel('/tools/iching-online.html')}\n• Runes: ${BRAIN.site.funnel('/tools/runes-online.html')}\n• Sigil Generator: ${BRAIN.site.funnel('/tools/sigil-generator.html')}\n• Spell Builder: ${BRAIN.site.funnel('/tools/spell-builder.html')}\n• Candle Color Calculator: ${BRAIN.site.funnel('/tools/candle-color-calculator.html')}\n• Pendulum: ${BRAIN.site.funnel('/tools/pendulum.html')}`;
      }
      if (q.includes('book') || q.includes('pdf') || q.includes('ebook')) {
        return `📖 We have 7 esoteric PDF books:\n• Codex Chaoticus ($4.99)\n• Tarot Chaos ($9.99)\n• Magical Servitors Manual ($4.99)\n• And more!\nFull catalog: ${BRAIN.site.url}/books/\n🎁 Bundle (all 7 books) at 52% off: ${BRAIN.bundle.url}`;
      }
      if (q.includes('bundle') || q.includes('pack') || q.includes('oferta') || q.includes('descuento')) {
        return `🎁 *Esoteric Books Bundle*\n7 books for only $19.99 USD (52% off!)\nIncludes: Codex Chaoticus, Tarot Chaos, Magical Servitors Manual, Treatise of Chaos Hunter Runes, Ouija Cazadora, Liber Lvpinux, Mind The Gap\n🔗 ${BRAIN.bundle.url}`;
      }
      if (q.includes('precio') || q.includes('price') || q.includes('cost') || q.includes('cuanto') || q.includes('subscription') || q.includes('suscripcion') || q.includes('mensual')) {
        return `💰 All our apps are $3.99-$14.99 USD. All books are $4.99-$9.99 USD.\n**One-time purchase. No subscriptions. No recurring fees.**\nYou buy once, you own it forever.`;
      }
      if (q.includes('who') || q.includes('what is') || q.includes('chaos magick') || q.includes('magia del caos')) {
        return `🌀 *Cha0smagick Labs* is an indie developer creating digital tools for magick, divination, and esoteric practice. We have 12 Android apps, 7 PDF books, 10 free tools, and 467 blog articles. Founded by Grindho.\n\nWebsite: ${BRAIN.site.url}\nBlog: ${BRAIN.site.blog}`;
      }
      return null; // No auto-reply matched
    },

    // Blog categories as hashtags
    blogCategories: () =>
      `📰 *Our Blog Categories:*\n` +
      `• Chaos Magick\n• Tarot & Divination\n• Runes & Norse\n• Astrology\n• Witchcraft\n• Lucid Dreaming\n• Goetia\n• Sigils\n• Spells & Rituals\n\n` +
      `Read 467 free articles: ${BRAIN.site.blog}`,
  },
};

module.exports = BRAIN;
