/**
 * Social Publisher - Cha0smagick LABS
 * 
 * Posts pins and tweets via Post Bridge API (MCP tools).
 * Requires: Post Bridge API key + connected social accounts.
 * 
 * Usage:
 *   node scripts/social-publish.js --help
 *   node scripts/social-publish.js pins --board board_id
 *   node scripts/social-publish.js tweet --accounts 1,2
 * 
 * For manual pin upload: pins/output/*.png are ready to upload.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const POST_BRIDGE_API = 'https://api.post-bridge.com/v1';

// =============================================
// PINTEREST CONTENT CALENDAR - 50 Pins
// =============================================
const PIN_CALENDAR = [
  // WEEK 1: Brand Awareness
  { day: 1, board: 'Chaos Magick',     title: 'Your Reality Is a Canvas',          file: '01-chaos-magick-quote.png', link: 'https://cha0smagicklabs.com/blog/chaos-magick-beginners-guide.html' },
  { day: 1, board: 'Occult Apps',       title: 'Full Tarot Deck in Your Pocket',     file: '02-tarot-app.png',         link: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.unofficialriderwaitetarot' },
  { day: 2, board: 'Rune Meanings',     title: 'Elder Futhark Rune Guide',           file: '03-rune-meanings.png',     link: 'https://cha0smagicklabs.com/tools/viking-runes.html' },
  { day: 2, board: 'Sigil Magick',      title: 'Create Powerful Sigils',             file: '04-sigil-magic.png',       link: 'https://cha0smagicklabs.com/tools/sigil-generator.html' },
  { day: 3, board: 'Witchcraft Spells', title: 'Beginner Witch? Start Here',         file: '05-witchcraft-tips.png',   link: 'https://cha0smagicklabs.com/blog/witchcraft-for-beginners-guide.html' },
  { day: 3, board: 'Astrology Apps',    title: 'Your Natal Chart Decoded',           file: '06-astrology-app.png',     link: 'https://cha0smagicklabs.com/pages/app-details.html?id=astral-lab' },
  { day: 4, board: 'Occult Apps',       title: '72 Spirits, 72 Sigils',               file: '07-goetia-sigils.png',     link: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.goetia' },
  { day: 4, board: 'Occult Apps',       title: 'Control Your Dreams Tonight',        file: '08-lucid-dreaming.png',    link: 'https://cha0smagicklabs.com/pages/app-details.html?id=dream-machine' },
  { day: 5, board: 'Esoteric Books',    title: '7 Esoteric Books',                   file: '09-esoteric-books.png',    link: 'https://cha0smagicklabs.com/#books-section' },
  { day: 5, board: 'Occult Apps',       title: 'Test Your PSI with Data',            file: '10-zener-esp.png',         link: 'https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards' },
  { day: 6, board: 'Witchcraft Spells', title: 'Build Spells That Work',             file: '11-spell-builder.png',     link: 'https://cha0smagicklabs.com/tools/spell-builder.html' },
  { day: 6, board: 'Chaos Magick',      title: 'Gnosis: The Core of All Magick',     file: '01-chaos-magick-quote.png', link: 'https://cha0smagicklabs.com/blog/gnosis-techniques.html' },
  { day: 7, board: 'Tarot Divination',  title: 'Daily Tarot: Celtic Cross Spread',   file: '02-tarot-app.png',         link: 'https://cha0smagicklabs.com/blog/celtic-cross-tarot-spread.html' },
  // ... more pins in full version
];

// =============================================
// TWITTER CONTENT CALENDAR - 30 tweets
// =============================================
const TWEET_CALENDAR = [
  // App promotion tweets
  '🌀 Your mind is the most powerful tool in the universe. Train it with PSI GYM — the professional Zener card ESP trainer. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards #ESP #PsychicTraining',
  
  '🃏 Full Rider Waite Tarot deck on your Android. 78 cards, 12 spreads, card meanings, daily draws. No subscriptions, one-time purchase. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.unofficialriderwaitetarot #Tarot #Divination',
  
  'ᚱ The Elder Futhark speaks. 24 runes of power and wisdom. Norse Rune Oracle app — professional rune readings on Android. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.norseruneoracle #Runes #Norse',
  
  '🌙 Lucid dreaming is a skill you can learn. Dream Machine + Lucid Dream apps — reality checks, dream journals, astral projection. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.dreammachine #LucidDreaming #AstralProjection',
  
  // Educational tweets
  'Sigil magick 101: Write your intention. Remove the vowels. Turn the remaining letters into a symbol. Charge it with gnosis. Release it to the universe. Simple. Powerful. → Free tool: https://cha0smagicklabs.com/tools/sigil-generator.html',
  
  'The difference between a thought and a spell? Focus. Intention. Will. Every witch knows this. New to the craft? Start here → https://cha0smagicklabs.com/blog/witchcraft-for-beginners-guide.html #Witchcraft #BeginnerWitch',
  
  '3 types of divination every occultist should know: 1) Tarot (symbolic reflection), 2) Runes (ancient wisdom), 3) I Ching (cosmic probability). Which speaks to you?',
  
  'Chaos Magick belief: Nothing is true. Everything is permitted. Your beliefs are tools — switch them at will. The complete guide → https://cha0smagicklabs.com/blog/chaos-magick-beginners-guide.html #ChaosMagick',
  
  // Community engagement tweets  
  'We built 11 Android apps for the occult community. 4.7★ average. 128+ reviews. All one-time purchase, no subscriptions. Explore the collection → https://cha0smagicklabs.com',
  
  'Question for practitioners: What divination tool do you use most? Tarot, runes, I Ching, scrying, or something else? 👇',
  
  'Your daily reminder: Magic is not about believing in something. It\'s about doing something. Practice today.',
  
  // Book promotion
  'Written 7 esoteric books? Yes. Codex Chaoticus, Liber Lvpinux, Tarot Chaos, and more. Deep knowledge for serious practitioners. → https://cha0smagicklabs.com #EsotericBooks #Occult',
  
  // Free tools  
  'Free tool: Build custom spells with our interactive Spell Builder. Ingredients, correspondences, timing, and intent. → https://cha0smagicklabs.com/tools/spell-builder.html #Spellcraft #FreeTool',
  
  'Free tool: Candle Color Calculator. Find the perfect candle for any intention — love, protection, prosperity, healing. → https://cha0smagicklabs.com/tools/candle-color-calculator.html #Witchcraft',
  
  // Value tweets
  'The 7 Hermetic Principles applied to everyday life: 1) Mentalism 2) Correspondence 3) Vibration 4) Polarity 5) Rhythm 6) Cause & Effect 7) Gender. Which one resonates today?',
  
  'Your natal chart is not your destiny — it\'s your starting point. Astral Lab app: professional astrology on Android. → https://cha0smagicklabs.com/pages/app-details.html?id=astral-lab',
  
  // Weekend engagement
  'This weekend: 1) Draw a tarot card 2) Light a candle 3) Write one sigil 4) Record your dream. Small practice, big results.',
  
  'Arcana Goetia: The complete Ars Goetia grimoire with all 72 spirit sigils on your Android. Summon, banish, and work with the spirits. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.goetia #Goetia #Occult',
  
  'The I Ching has been used for 3000+ years. Still accurate. Still profound. Still free. → https://cha0smagicklabs.com/tools/iching.html #IChing #Divination',
  
  'New: Complete witchcraft guide for beginners. 6 types of witchcraft, 5 beginner spells, 6-minute daily practice. → https://cha0smagicklabs.com/blog/witchcraft-for-beginners-guide.html',
  
  'What\'s your moon sign? Not sure? Astral Lab can calculate your full natal chart in seconds. → https://cha0smagicklabs.com/pages/app-details.html?id=astral-lab',
  
  'Every sigil is a contract between you and the universe. Write it. Charge it. Forge it. The sigil generator makes it easy. → https://cha0smagicklabs.com/tools/sigil-generator.html',
  
  'Dream recall tip: Keep a notebook by your bed. Write immediately upon waking. Within a week, you\'ll remember 3x more dreams.',
  
  'Eerie Roads: Mysterious Paths — a unique app exploring liminal spaces, liminality, and the uncanny. $9.99 one-time. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.eerieroads',
  
  'Hot take: The best magickal tool is the one you actually use. Not the most expensive. Not the rarest. The one in your hand today.',
  
  'Free occult library: blog/ has 134+ articles on chaos magick, tarot, runes, astrology, lucid dreaming, witchcraft, and more. All free. https://cha0smagicklabs.com/blog/',
  
  'Moon phase right now: Check the current lunar phase and plan your rituals accordingly. → https://cha0smagicklabs.com/tools/lunar-phase.html',
  
  'The Goetic spirits are not demons to be feared — they are archetypes to be understood. 72 paths to self-knowledge. Arcana Goetia. → https://play.google.com/store/apps/details?id=com.cha0smagicklabs.goetia',
  
  'Midweek reset: Take 5 minutes. Close your eyes. Breathe. Visualize your intention. Write it down. The universe responds to clarity.',
  
  'Tarot doesn\'t predict the future. It reveals the present. The cards show you what you already know but haven\'t acknowledged. Deep. → https://cha0smagicklabs.com/blog/tarot-card-meanings-guide.html',
];

// =============================================
// HELPERS
// =============================================

function log(msg) { console.log(`[${new Date().toISOString().slice(0,16)}] ${msg}`); }

function showHelp() {
  console.log(`
Cha0smagick LABS - Social Publisher v1.0

Commands:
  pins                  List all available pin files
  calendar              Show 50-pin content calendar
  tweets                Show 30-tweet content calendar
  publish-pinterest     Upload pins via Post Bridge API (requires API key)
  publish-twitter       Post tweets via Post Bridge API (requires API key)
  
Environment:
  POST_BRIDGE_KEY       Your Post Bridge API key (pb_live_...)
  
Setup:
  1. Get Post Bridge key at https://postbridge.app
  2. Connect Pinterest + Twitter accounts
  3. Run: node scripts/social-publish.js publish-pinterest
  `);
}

// List available pin files
function listPins() {
  const dir = path.join(__dirname, '..', 'pins', 'output');
  if (!fs.existsSync(dir)) { log('No pins/output directory found'); return; }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
  log(`Available pin images (${files.length}):`);
  files.forEach(f => log(`  ${f}`));
}

const args = process.argv.slice(2);
const cmd = args[0];

switch(cmd) {
  case 'pins':      listPins(); break;
  case 'calendar':  console.log(JSON.stringify(PIN_CALENDAR, null, 2)); break;
  case 'tweets':    TWEET_CALENDAR.forEach((t,i) => console.log(`${i+1}. ${t.slice(0,80)}...`)); break;
  case '--help':
  case '-h':
  default:          showHelp();
}
