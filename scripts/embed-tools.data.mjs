/**
 * embed-tools.data.mjs
 * ---------------------------------------------------------------------------
 * Fuente de verdad EDITORIAL de las 9 paginas de embeds externos (Gen3).
 *
 * Que vive aqui y que NO:
 *   - Aqui: metadatos SEO de cada pagina (title, description, keywords, H1,
 *     lede, tldr), URL del embed, idioma, categoria de venta, y el mapping
 *     autoral app/libro.
 *   - En scripts/deepdive/<slug>.mjs: el cuerpo largo del articulo
 *     (sections), las preguntas de FAQ y los long-tail objetivo (targets).
 *   - NO en ningun sitio: precios y URLs de Play Store / Hotmart. Esos se
 *     derivan en build-embed-funnels.mjs de data/tool-funnels.json, que a su
 *     vez se deriva de js/apps-data.js. Nunca se escriben a mano.
 *
 * REGLA DE IDIOMA: todas las paginas se publican en ingles. El copy se escribe
 * para el buscador en ingles, no como traduccion del espanol.
 *
 * Que es un "embed": la herramienta real NO esta en este repo. Son apps
 * publicadas en GitHub Pages / Streamlit bajo la cuenta del usuario, y la
 * pagina de este repo la envuelve en un iframe para convertir su uso en
 * trafico propio hacia apps y libros.
 *
 * Uso:  node scripts/build-embed-funnels.mjs
 */

import { BEAT_THE_DEALER } from './deepdive/beat-the-dealer.mjs';
import { ROULETTE_LAB } from './deepdive/roulette-lab.mjs';
import { PIXELLIBRE } from './deepdive/pixellibre.mjs';
import { INWO_ILLUMINATI } from './deepdive/inwo-illuminati.mjs';
import { SCHRECKNET } from './deepdive/schrecknet-nosferatu.mjs';
import { PENTEX } from './deepdive/pentex-werewolf.mjs';
import { SYNTHETIC_GODS } from './deepdive/synthetic-gods.mjs';
import { VERBO_HECHO_CODIGO } from './deepdive/verbo-hecho-codigo.mjs';
import { DASHBOARD_COLOMBIA } from './deepdive/dashboard-colombia.mjs';

export const EMBED_TOOLS = [
  // =========================================================================
  // 1. BEAT THE DEALER
  // =========================================================================
  {
    ...BEAT_THE_DEALER,
    slug: 'beat-the-dealer',
    lang: 'en',
    name: 'Beat the Dealer',
    category: 'Probabilidad',
    embed: {
      url: 'https://cha0smagick.github.io/beat-the-dealer-web-learn-poker-for-free/',
      title: 'Beat the Dealer — free interactive blackjack course',
      height: 760
    },
    title: 'Beat the Dealer — Free Blackjack Strategy Course',
    description:
      'Free interactive course on Thorp’s Beat the Dealer: blackjack basics, basic strategy, card counting and live-computed odds. No signup, no money.',
    keywords:
      'blackjack strategy chart, card counting, learn blackjack free, beat the dealer thorp, blackjack odds, basic strategy blackjack, blackjack probability, free blackjack course, 21 blackjack rules, how to count cards in blackjack',
    h1: 'Beat the Dealer: Learn Blackjack Strategy Free',
    lede:
      'A free, browser-based course that teaches blackjack the way Edward O. Thorp’s 1962 book did: by showing you the arithmetic behind every decision instead of handing you a chart to memorise.',
    tldr:
      'Beat the Dealer is a free interactive course covering blackjack rules, basic strategy, card counting and bankroll management, with every strategy table computed live in your browser and no text reproduced from Thorp’s book.',
    compare: [
      { feature: 'Full blackjack rules and basic strategy course', free: true, premium: true },
      { feature: 'Strategy tables computed live in your browser', free: true, premium: true },
      { feature: 'Card counting explained with its real conditions', free: true, premium: true },
      { feature: 'Bankroll and bet-sizing rules covered', free: true, premium: true },
      { feature: 'Lab exercises and glossary reference', free: true, premium: false },
      { feature: 'A written system for acting under uncertainty', free: false, premium: true }
    ],
    bookAdds: [
      'A written method instead of a blackjack table — sigils, dice and timing treated as one system rather than three hobbies.',
      'The probability and intention material the labs only gesture at: why an outcome is not guaranteed by sincerity.',
      'One-time payment, PDF, yours to keep and re-read.'
    ],
    apps: [],
    book: 'codex-chaoticus-pdf',
    related: ['roulette-lab', 'zener-esp-trainer', 'digital-pendulum']
  },

  // =========================================================================
  // 2. ROULETTE LAB
  // =========================================================================
  {
    ...ROULETTE_LAB,
    slug: 'roulette-lab',
    lang: 'en',
    name: 'Roulette Lab',
    category: 'Probabilidad',
    embed: {
      url: 'https://cha0smagick.github.io/roulette-game-lab-website/',
      title: 'Roulette Lab — free roulette odds and bet simulator',
      height: 760
    },
    title: 'Roulette Lab — Free Roulette Odds Simulator',
    description:
      'Play the wheel on three layouts, place any of the fourteen bets and watch the arithmetic that pays for them. Free roulette lab, no money, no signup.',
    keywords:
      'roulette odds, roulette probability, roulette simulator, free roulette game, roulette house edge, roulette bet types, roulette wheel online, roulette lab, european roulette odds, roulette payout chart',
    h1: 'Roulette Lab: Free Roulette Odds and Bet Simulator',
    lede:
      'A roulette table with three layouts and all fourteen bet types, where every bet shows the arithmetic that pays for it — the true probability, the payout, and what the house takes.',
    tldr:
      'Roulette Lab is a free roulette simulator that lets you place any of fourteen bet types on three table layouts and shows the exact probability and payout behind each one, without any money involved.',
    compare: [
      { feature: 'Three roulette table layouts', free: true, premium: true },
      { feature: 'All fourteen bet types', free: true, premium: true },
      { feature: 'Live probability and payout per bet', free: true, premium: true },
      { feature: 'No account, no money, no install', free: true, premium: true },
      { feature: 'A written system for working with chance', free: false, premium: true }
    ],
    bookAdds: [
      'Dice, probability and intent treated as one practice instead of a casino trick.',
      'The material on why outcomes are not guaranteed by sincerity — the useful half of chance.',
      'One-time payment, PDF, yours to keep.'
    ],
    apps: [],
    book: 'codex-chaoticus-pdf',
    related: ['beat-the-dealer', 'zener-esp-trainer', 'digital-pendulum']
  },

  // =========================================================================
  // 3. PIXELLIBRE
  // =========================================================================
  {
    ...PIXELLIBRE,
    slug: 'pixellibre',
    lang: 'en',
    name: 'PixelLibre',
    category: 'Imagen',
    embed: {
      url: 'https://cha0smagick.github.io/free-image-tools-web/',
      title: 'PixelLibre — free online image editor',
      height: 820
    },
    title: 'PixelLibre — Free Online Image Editor, No Signup',
    description:
      'Free browser-based image editor: resize, crop, filter, add text, remove the background with on-device AI and export PNG, JPG or WebP. No signup, no watermark.',
    keywords:
      'free image editor online, image editor no signup, remove background online free, resize image for instagram, png to jpg converter, photo editor in browser, webp converter free, crop image online, add text to photo, offline image editor, image editor without watermark',
    h1: 'PixelLibre: Free Online Image Editor With No Signup',
    lede:
      'A complete image editor that runs inside your browser — resize, crop, rotate, filter, add text, round the corners, remove the background with on-device AI, and export. No account, no watermark, and your photos never leave your machine.',
    tldr:
      'PixelLibre is a free image editor that runs entirely in your browser: resizing, cropping, filters, text, rounded corners, AI background removal executed locally, and export to PNG, JPG or WebP, with no signup and no watermark.',
    compare: [
      { feature: 'Resize, crop, rotate and mirror', free: true, premium: true },
      { feature: 'Filters, adjustments and text', free: true, premium: true },
      { feature: 'Remove background with local AI', free: true, premium: true },
      { feature: 'Export to PNG, JPG and WebP', free: true, premium: true },
      { feature: 'Works offline once cached', free: true, premium: true },
      { feature: 'Watermark, signup or limits', free: false, premium: true }
    ],
    bookAdds: [
      'The method that gives an icon its meaning: how a statement of intent is reduced to a single symbol.',
      'Instructions for charging, timing and recording, which no editor does for you.',
      'One-time payment, PDF, yours to keep.'
    ],
    appPitch:
      'The editor covers the file. The app covers the full cycle: generate the sigil, charge it with the ritual timer, log the intent in your library, and repeat it offline.',
    appNote: '100% offline — No ads — No tracking — One-time payment',
    apps: ['chaos-sigil-generator'],
    book: 'codex-chaoticus-pdf',
    related: ['sigil-generator', 'tengwar-transcriber', 'verbo-hecho-codigo']
  },

  // =========================================================================
  // 4. INWO
  // =========================================================================
  {
    ...INWO_ILLUMINATI,
    slug: 'inwo-illuminati',
    lang: 'en',
    name: 'INWO — Illuminati: New World Order',
    category: 'Juegos de mesa',
    embed: {
      url: 'https://cha0smagick.github.io/Virtual-Illuminati-New-World-order-INWO-game/game/',
      title: 'INWO — Illuminati New World Order, free online card game',
      height: 800
    },
    title: 'INWO Online — Play Illuminati New World Order Free',
    description:
      'Play Illuminati: New World Order (INWO) in your browser against the machine: place secret societies, control groups and complete your project. Free, no install.',
    keywords:
      'illuminati new world order game online, INWO online, play INWO free, secret society card game online, how to play illuminati new world order, INWO card game rules, digital card game solo play, card game with AI opponent, free card game no download, inwo card list',
    h1: 'INWO Online: Play Illuminati New World Order Free',
    lede:
      'The browser version of Illuminati: New World Order. You take control of a secret society, place and fight over groups, and race to complete your own project — against an automatic opponent, with the full deck and the rules built in.',
    tldr:
      'INWO is the Illuminati: New World Order card game playable in your browser: control secret societies, fight over groups on a three-level board, and complete your project before the machine does, with no install and no signup.',
    compare: [
      { feature: 'Full deck, board and action log', free: true, premium: true },
      { feature: 'Built-in quick rules reference', free: true, premium: true },
      { feature: 'Automatic opponent, no install or signup', free: true, premium: true },
      { feature: 'Plays on a phone', free: false, premium: true },
      { feature: 'A card system to consult, not just to play', free: false, premium: true }
    ],
    bookAdds: [
      'All 78 cards treated as a working system, including the combinations that recur and the ones that never work.',
      'The complete method for working with symbols, rather than just owning a deck.',
      'One-time payment, PDF, yours to keep.'
    ],
    appPitch:
      'If you already know the rules, the natural next step is taking the deck and the system to your phone: all 78 Rider-Waite cards with reversed meanings, combinations, and reading that works offline.',
    appNote: 'Works offline — No ads — No subscription',
    apps: ['unofficial-rider-waite-tarot'],
    book: 'tarot-chaos-pdf',
    related: ['tarot-card-reference', 'tarot-yes-no', 'pentex-werewolf']
  },

  // =========================================================================
  // 5. SCHRECKNET
  // =========================================================================
  {
    ...SCHRECKNET,
    slug: 'schrecknet-nosferatu',
    lang: 'en',
    name: 'SchreckNET',
    category: 'Rol y ambientación',
    embed: {
      url: 'https://cha0smagick.github.io/schreckNET_nosferatu_web_rpg_vampire_the_mascarade/index.html',
      title: 'SchreckNET — Vampire the Masquerade network compendium',
      height: 780
    },
    title: 'SchreckNET — Vampire the Masquerade Clan Compendium',
    description:
      'A recovered mirror of a dead Vampire: The Masquerade network: clans, kindred index, dossiers, Prague Warren maps, 31 documents and sewer games. Free, no account.',
    keywords:
      'vampire the masquerade clan compendium, nosferatu clan vampire, vampire the masquerade clans, kindred index vampire, vampire rpg lore, schrecknet, vtm clan compendium, vampire the masquerade second inquisition, nosferatu disciplines, vampire the masquerade clan list',
    h1: 'SchreckNET: A Vampire the Masquerade Network Compendium',
    lede:
      'A free in-world companion for Vampire: The Masquerade — clan pages, a kindred index, dossiers on people who know what you are, the Prague Warren laid out level by level, and a thirty-one document file server.',
    tldr:
      'SchreckNET is a free Vampire: The Masquerade lore compendium presented as a mirror of a dead network, containing clan pages, a kindred index, dossiers, the Prague Warren cartography, a 31-document file server and four playable sewer exercises.',
    compare: [
      { feature: 'Clan pages, kindred index and dossiers', free: true, premium: true },
      { feature: 'Prague Warren cartography and global node map', free: true, premium: true },
      { feature: '31-document file server with field manuals', free: true, premium: true },
      { feature: 'Four playable sewer exercises', free: true, premium: true },
      { feature: 'Read without an account or email', free: true, premium: true },
      { feature: 'A written system for the research the campaign implies', free: false, premium: true }
    ],
    bookAdds: [
      'The written discipline behind the fieldwork: how to gather, record and act on what you find.',
      'A complete system instead of a reference page, one-time payment as PDF.',
      'The book your group reads between sessions when the campaign turns serious.'
    ],
    apps: ['noctem-tools'],
    book: 'codex-chaoticus-pdf',
    related: ['pentex-werewolf', 'synthetic-gods', 'verbo-hecho-codigo']
  },

  // =========================================================================
  // 6. PENTEX
  // =========================================================================
  {
    ...PENTEX,
    slug: 'pentex-werewolf',
    lang: 'en',
    name: 'Pentex Industries',
    category: 'Rol y ambientación',
    embed: {
      url: 'https://cha0smagick.github.io/Pentex_website_werewolf_RPG/',
      title: 'Pentex Industries — Werewolf the Apocalypse corporate world guide',
      height: 780
    },
    title: 'Pentex Industries — Werewolf the Apocalypse World Guide',
    description:
      'The public record of Pentex Industries: mission, leadership, 41 facilities and newsroom. The corporate-horror megacorp from Werewolf: The Apocalypse, free.',
    keywords:
      'pentex industries, werewolf the apocalypse pentex, pentex wiki, werewolf rpg clan lore, corporate horror rpg, pentex industries nyse, werewolf the apocalypse resources, pentex metagame, wyrm sourcebook, garou nation politics',
    h1: 'Pentex Industries: The Werewolf the Apocalypse World Guide',
    lede:
      'The public-facing website of Pentex Industries Worldwide — a century-old materials group quietly attempting the largest industrial work ever built. Mission, leadership, forty-one facilities, newsroom, careers, and a restricted portal you will not get into.',
    tldr:
      'Pentex Industries is a free in-world companion site for Werewolf: The Apocalypse, containing the corporate mission, leadership directory, forty-one facilities, sustainability record, newsroom and careers of the setting’s most dangerous company.',
    compare: [
      { feature: 'Mission, leadership and full directory', free: true, premium: true },
      { feature: 'All 41 facilities, nine featured', free: true, premium: true },
      { feature: 'Sustainability record and newsroom', free: true, premium: true },
      { feature: 'Careers and metagame sections', free: true, premium: true },
      { feature: 'No account, no payment', free: true, premium: true },
      { feature: 'A written system for the lycanthropic path', free: false, premium: true }
    ],
    bookAdds: [
      'The written lycanthropic path that this corporate world is built around.',
      'A complete system rather than a setting reference, so the campaign has rules behind it.',
      'PDF, one-time payment, yours to keep.'
    ],
    apps: ['noctem-tools'],
    book: 'liber-lvpinux-pdf',
    related: ['schrecknet-nosferatu', 'synthetic-gods', 'inwo-illuminati']
  },

  // =========================================================================
  // 7. THE SYNTHETIC GODS
  // =========================================================================
  {
    ...SYNTHETIC_GODS,
    slug: 'synthetic-gods',
    lang: 'en',
    name: 'The Synthetic Gods',
    category: 'Rol y ambientación',
    embed: {
      url: 'https://cha0smagick.github.io/thy-Syntetic-gods---mage-the-ascencion/',
      title: 'The Synthetic Gods — Mage the Ascension digital chronicle',
      height: 820
    },
    title: 'The Synthetic Gods — Mage the Ascension Chronicle',
    description:
      'A 1999-web chronicle for Mage: The Ascension: code as sigil, webrings feeding egregores, and 10,000 worshippers birthing an astrosoma — with a working sigil workshop.',
    keywords:
      'mage the ascension, egregore, astrosoma, code magick, sigils in code, virtual adepts, technocracy, mage the ascension chronicle, digital web sphere, geocities mage, mage the ascension traditions, how to play mage the ascension',
    h1: 'The Synthetic Gods: A Mage the Ascension Digital Chronicle',
    lede:
      'A chronicle for Mage: The Ascension set in the chaotic frontier of the 1999 web, where code is crafted into sigils, webrings breed egregores fed by daily visits, and enough sustained worship crystallises into a god of silicon.',
    tldr:
      'The Synthetic Gods is a free fan chronicle for Mage: The Ascension set in the 1999 web: three acts on sigils in code, webring egregores and astrosomas, faction dossiers, appendices and a working sigil workshop that reduces an intent to a symbol.',
    compare: [
      { feature: 'Three acts plus appendices and faction dossiers', free: true, premium: true },
      { feature: 'Working sigil workshop with five arrangements', free: true, premium: true },
      { feature: 'Egregore and astrosoma mechanics explained', free: true, premium: true },
      { feature: 'Runs locally, no signup', free: true, premium: true },
      { feature: 'A sigil library and intent journal that persist', free: false, premium: true },
      { feature: 'A written system for the whole intent cycle', free: false, premium: true }
    ],
    bookAdds: [
      'The complete cycle the chronicle only describes: intent, sigil, charge, release, verification.',
      'Timing and correspondence material that decides whether a piece of work lands.',
      'PDF, one-time payment, yours to keep.'
    ],
    apps: ['chaos-sigil-generator'],
    book: 'codex-chaoticus-pdf',
    related: ['verbo-hecho-codigo', 'pentex-werewolf', 'schrecknet-nosferatu']
  },

  // =========================================================================
  // 8. EL VERBO HECHO CODIGO
  // =========================================================================
  {
    ...VERBO_HECHO_CODIGO,
    slug: 'verbo-hecho-codigo',
    lang: 'en',
    name: 'El Verbo Hecho Código',
    category: 'Rol y ambientación',
    embed: {
      url: 'https://cha0smagick.github.io/Verbohechocodigo/',
      title: 'The Word Made Code — a Mage the Ascension campaign for World of Darkness',
      height: 820
    },
    title: 'The Word Made Code — A Mage the Ascension Campaign',
    description:
      'A complete nine-chapter Mage: The Ascension campaign set in modern Iberoamerica: bestiary, 23-NPC roster, factions, player characters and seven city boards. Free to play.',
    keywords:
      'mage the ascension campaign, world of darkness campaign, homebrew mage campaign, latin american urban fantasy rpg, gematria in rpg, free tabletop campaign, dark urban fantasy campaign, campaign setting bogota medellin, tabletop campaign with bestiary and npc roster',
    h1: 'The Word Made Code: A Mage the Ascension Campaign for World of Darkness',
    lede:
      'A nine-chapter campaign for World of Darkness / Mage: The Ascension, set in contemporary Iberoamerica, where YHWH — a god made of numbers — is about to be born and three factions are fighting over who gets to be its father.',
    tldr:
      'The Word Made Code is a free nine-chapter Mage: The Ascension campaign set in Bogotá, Medellín, Lima, Mexico City, São Paulo, Buenos Aires and the Caribbean, with a bestiary, a 23-character NPC roster and ready-to-play character templates.',
    compare: [
      { feature: 'Nine complete campaign chapters', free: true, premium: true },
      { feature: 'Bestiary and 23-character NPC roster', free: true, premium: true },
      { feature: 'Seven city boards across Iberoamerica', free: true, premium: true },
      { feature: 'Readable without signup or payment', free: true, premium: true },
      { feature: 'A written system for working with sigils', free: false, premium: true },
      { feature: 'Persistent log of your sigils and intents', free: false, premium: true }
    ],
    bookAdds: [
      'The written system the campaign assumes: from a statement of intent to a sigil and its charging.',
      'Correspondence and timing material for when your group wants to play harder.',
      'PDF, one-time payment, yours to keep.'
    ],
    appPitch:
      'The campaign gives you the world. The app gives you the system to play it with: generate the sigil from the Word, charge it, log the intent, and run the cycle again offline.',
    appNote: '100% offline — No ads — No tracking — One-time payment',
    apps: ['chaos-sigil-generator'],
    book: 'codex-chaoticus-pdf',
    related: ['synthetic-gods', 'pentex-werewolf', 'dashboard-colombia']
  },

  // =========================================================================
  // 9. DASHBOARD DE VIOLENCIA Y CRIMEN EN COLOMBIA
  // =========================================================================
  {
    ...DASHBOARD_COLOMBIA,
    slug: 'dashboard-colombia',
    lang: 'en',
    name: 'Colombia Violence & Crime Dashboard',
    category: 'Datos',
    embed: {
      url: 'https://dashboard-violencia-y-crimen-colombia.streamlit.app/',
      title: 'Colombia violence and crime data dashboard',
      height: 820
    },
    title: 'Colombia Violence & Crime Data Dashboard (Free)',
    description:
      'Free interactive dashboard on violence and crime in Colombia, open in your browser. Learn how to read crime statistics properly before you quote a single number.',
    keywords:
      'colombia violence statistics, crime data colombia, colombia homicide rate, security data colombia, bogota crime statistics, medellin violence data, crime statistics by city, how to read crime statistics, open data colombia, denominators crime data',
    h1: 'Colombia Violence & Crime Data Dashboard',
    lede:
      'A free interactive panel for exploring violence and crime data in Colombia, open in the browser with no signup — and the reading guide you need before you quote a single figure from it.',
    tldr:
      'The Colombia Violence & Crime Dashboard is a free interactive panel for exploring violence and crime data in the country from your browser, with no signup or download, best read alongside an explanation of how crime statistics are actually constructed.',
    compare: [
      { feature: 'Interactive exploration of violence and crime data', free: true, premium: true },
      { feature: 'Opens in the browser, no signup', free: true, premium: true },
      { feature: 'Free, with nothing to download', free: true, premium: true },
      { feature: 'Your own charts and images, produced locally', free: false, premium: true },
      { feature: 'A written method for acting on the data', free: false, premium: true }
    ],
    bookAdds: [
      'The method for going from data to action without confusing certainty with hope.',
      'A complete written system, one payment, as a PDF.',
      'The part no dashboard gives you: what to do with the reading.'
    ],
    apps: [],
    book: 'codex-chaoticus-pdf',
    related: ['verbo-hecho-codigo', 'pixellibre', 'roulette-lab']
  }
];

/**
 * Categorias de venta nuevas para build-tool-funnels.mjs.
 * Ya estan anadidas alli; se exporta aqui para que el generador de embeds
 * pueda avisar si alguien las borra de alli sin querer.
 */
export const CATEGORY_ADDENDUM = {
  Probabilidad: { es: {}, en: {} },
  'Rol y ambientación': { es: {}, en: {} },
  Imagen: { es: {}, en: {} },
  'Juegos de mesa': { es: {}, en: {} },
  Datos: { es: {}, en: {} }
};