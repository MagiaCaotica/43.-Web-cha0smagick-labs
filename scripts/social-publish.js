#!/usr/bin/env node
/**
 * Social Publishing Automation - Cha0smagick LABS
 *
 * MASTER_EXECUTION_PLAN 3.3.1-3.3.4:
 *   3.3.1  Cron daily social publishing (Pinterest + X/Twitter + Telegram channel)
 *   3.3.2  Evergreen content rotation with performance boost
 *   3.3.3  Blog auto-post (new article -> Telegram channel + X)
 *   3.3.4  Analytics feedback loop (post performance -> calendar priority)
 *
 * Publishers:
 *   - Telegram channel: scripts/bots/telegram-bot.js (TELEGRAM_BOT_TOKEN)
 *   - Pinterest direct API v5: PINTEREST_TOKEN + PINTEREST_BOARD_ID (image_base64)
 *   - Bridge aggregator (Post Bridge / Ayrshare-style): POST_BRIDGE_KEY + POST_BRIDGE_URL
 *     NOTE: api.post-bridge.com returned 404 publicly during research (2026-09-21).
 *     The bridge stays configurable and skip-if-no-key so the daily run never fails.
 *
 * Usage:
 *   node scripts/social-publish.js daily [--dry-run]
 *   node scripts/social-publish.js blog
 *   node scripts/social-publish.js calendar
 *   node scripts/social-publish.js tweets
 *   node scripts/social-publish.js pins
 *   node scripts/social-publish.js record <id> <score>
 *   node scripts/social-publish.js state
 *   node scripts/social-publish.js selftest
 *   node scripts/social-publish.js --help
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

// =============================================
// CONSTANTS
// =============================================
const SITE_URL = 'https://cha0smagicklabs.com';
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data');
const STATE_PATH = path.join(DATA_DIR, 'social-state.json');
const PERF_PATH = path.join(DATA_DIR, 'social-performance.json');
const PIN_DIRS = [
  path.join(ROOT, 'pins', 'output'),
  path.join(ROOT, 'projects', 'pins', 'output'),
];
const POST_BRIDGE_URL_DEFAULT = 'https://api.post-bridge.com/v1';
const PINTEREST_API = 'https://api.pinterest.com/v5';

// =============================================
// PINTEREST CONTENT CALENDAR - 13 Pins (7-day cycle)
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
];

// =============================================
// TWITTER CONTENT CALENDAR - 30 tweets
// =============================================
const TWEET_CALENDAR = [
  // App promotion tweets
   '🌀 Your mind is the most powerful tool in the universe. Train it with PSI GYM — the professional Zener card ESP trainer. → https://cha0smagicklabs.com/apps/psi-gym.html #ESP #PsychicTraining',

   '🃏 Full Rider Waite Tarot deck on your Android. 78 cards, 12 spreads, card meanings, daily draws. No subscriptions, one-time purchase. → https://cha0smagicklabs.com/apps/unofficial-rider-waite-tarot.html #Tarot #Divination',

   'ᚱ The Elder Futhark speaks. 24 runes of power and wisdom. Norse Rune Oracle app — professional rune readings on Android. → https://cha0smagicklabs.com/apps/norse-rune-oracle.html #Runes #Norse',

   '🌙 Lucid dreaming is a skill you can learn. Dream Machine + Lucid Dream apps — reality checks, dream journals, astral projection. → https://cha0smagicklabs.com/apps/dream-machine.html #LucidDreaming #AstralProjection',

  // Educational tweets
   'Sigil magick 101: Write your intention. Remove the vowels. Turn the remaining letters into a symbol. Charge it with gnosis. Release it to the universe. Simple. Powerful. → https://cha0smagicklabs.com/apps/chaos-sigil-generator.html',

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

   'Your natal chart is not your destiny — it\'s your starting point. Astral Lab app: professional astrology on Android. → https://cha0smagicklabs.com/apps/astral-lab.html',

  // Weekend engagement
  'This weekend: 1) Draw a tarot card 2) Light a candle 3) Write one sigil 4) Record your dream. Small practice, big results.',

   'Arcana Goetia: The complete Ars Goetia grimoire with all 72 spirit sigils on your Android. Summon, banish, and work with the spirits. → https://cha0smagicklabs.com/apps/arcana-goetia.html #Goetia #Occult',

   'The I Ching has been used for 3000+ years. Still accurate. Still profound. Still free. → https://cha0smagicklabs.com/apps/iching-oracle.html #IChing #Divination',

  'New: Complete witchcraft guide for beginners. 6 types of witchcraft, 5 beginner spells, 6-minute daily practice. → https://cha0smagicklabs.com/blog/witchcraft-for-beginners-guide.html',

   'What\'s your moon sign? Not sure? Astral Lab can calculate your full natal chart in seconds. → https://cha0smagicklabs.com/apps/astral-lab.html',

   'Every sigil is a contract between you and the universe. Write it. Charge it. Forge it. The Chaos Sigil Generator makes it easy. → https://cha0smagicklabs.com/apps/chaos-sigil-generator.html',

  'Dream recall tip: Keep a notebook by your bed. Write immediately upon waking. Within a week, you\'ll remember 3x more dreams.',

   'Eerie Roads: Mysterious Paths — a unique app exploring liminal spaces, liminality, and the uncanny. $9.99 one-time. → https://cha0smagicklabs.com/apps/eerieroads.html',

  'Hot take: The best magickal tool is the one you actually use. Not the most expensive. Not the rarest. The one in your hand today.',

  'Free occult library: blog/ has 134+ articles on chaos magick, tarot, runes, astrology, lucid dreaming, witchcraft, and more. All free. https://cha0smagicklabs.com/blog/',

   'Moon phase right now: Check the current lunar phase and plan your rituals accordingly. → https://cha0smagicklabs.com/apps/lunar-phase-calculator.html',

   'The Goetic spirits are not demons to be feared — they are archetypes to be understood. 72 paths to self-knowledge. Arcana Goetia. → https://cha0smagicklabs.com/apps/arcana-goetia.html',

  'Midweek reset: Take 5 minutes. Close your eyes. Breathe. Visualize your intention. Write it down. The universe responds to clarity.',

  'Tarot doesn\'t predict the future. It reveals the present. The cards show you what you already know but haven\'t acknowledged. Deep. → https://cha0smagicklabs.com/blog/tarot-card-meanings-guide.html',
];

// =============================================
// HELPERS
// =============================================

function log(msg) { console.log(`[${new Date().toISOString().slice(0, 16)}] ${msg}`); }

function loadJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT' || err instanceof SyntaxError) return fallback;
    throw err;
  }
}

function saveJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
}

// ---------- State (3.3.1 persistence) ----------

function loadState(file = STATE_PATH) {
  const s = loadJson(file, null);
  if (!s || typeof s !== 'object') {
    return { version: 1, lastRun: null, seeded: false, published: {} };
  }
  return {
    version: 1,
    lastRun: typeof s.lastRun === 'string' ? s.lastRun : null,
    seeded: Boolean(s.seeded),
    published: s.published && typeof s.published === 'object' ? s.published : {},
  };
}

function saveState(state, file = STATE_PATH) {
  saveJson(file, state);
}

// ---------- Blog auto-post (3.3.3) ----------

function listBlogArticles(blogDir) {
  const out = [];
  for (const f of fs.readdirSync(blogDir)) {
    if (!f.endsWith('.html')) continue;
    const full = path.join(blogDir, f);
    const html = fs.readFileSync(full, 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || f;
    const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    out.push({ file: f, path: full, title: title.trim(), desc: desc.trim(), mtime: fs.statSync(full).mtimeMs });
  }
  return out;
}

function buildBlogPostText(article, siteUrl = SITE_URL) {
  return `📖 ${article.title}\n${article.desc}\n→ ${siteUrl}/blog/${article.file}`;
}

function selectFreshArticles(articles, state, now, maxPosts = 3) {
  if (!state.seeded) return [];
  const since = state.lastRun ? Date.parse(state.lastRun) : 0;
  return articles
    .filter((a) => a.mtime > since && !state.published[`blog/${a.file}`])
    .sort((a, b) => b.mtime - a.mtime)
    .slice(0, maxPosts);
}

// ---------- Calendar rotation (3.3.2 evergreen + 3.3.4 feedback loop) ----------

function pickCalendarItem(cal, perf, now, idPrefix = 'cal') {
  const day = Math.floor(now.getTime() / 86400000);
  const entries = cal.map((item, i) => {
    const key = `${idPrefix}-${i + 1}`;
    const rec = perf && perf[key];
    const score = rec && typeof rec.score === 'number' && rec.score > 0 ? Math.floor(rec.score) : 0;
    return { item, key, index: i, score };
  });
  const hasScores = entries.some((e) => e.score > 0);
  if (!hasScores) {
    // 3.3.2 evergreen rotation: no performance data -> cycle through all content by day
    return entries[day % entries.length];
  }
  // 3.3.4 feedback loop: weighted rotation — each item appears (1 + score) times
  // per cycle, so high performers are posted more often while every item still rotates.
  const pool = [];
  for (const e of entries) {
    for (let k = 0; k <= e.score; k++) pool.push(e);
  }
  return pool[day % pool.length];
}

// ---------- HTTP (stdlib only, no new dependencies) ----------

function postJson(url, body, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request(
      {
        hostname: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          'Content-Length': Buffer.byteLength(data),
        },
        timeout: 30000,
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => { raw += c; });
        res.on('end', () => {
          let parsed = null;
          try { parsed = JSON.parse(raw); } catch (err) { parsed = null; } // non-JSON body: keep raw
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ status: res.statusCode, data: parsed, raw });
          } else {
            reject(new Error(`HTTP ${res.statusCode} ${url}: ${(parsed && parsed.message) || raw.slice(0, 200)}`));
          }
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error(`Timeout ${url}`)));
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// =============================================
// PUBLISHERS
// =============================================

async function publishTelegram(text, opts = {}) {
  if (!process.env.TELEGRAM_BOT_TOKEN) {
    log('WARN Telegram: TELEGRAM_BOT_TOKEN missing, skip');
    return { skipped: true, reason: 'no-token' };
  }
  const tg = require('./bots/telegram-bot.js');
  tg.init();
  await tg.postToChannel(text, opts);
  return { sent: true };
}

function findPinImage(file) {
  for (const dir of PIN_DIRS) {
    const full = path.join(dir, file);
    if (fs.existsSync(full)) return full;
  }
  return null;
}

async function publishPinterestPin(pin, boardId) {
  const token = process.env.PINTEREST_TOKEN;
  if (!token) {
    log('WARN Pinterest: PINTEREST_TOKEN missing, skip');
    return { skipped: true, reason: 'no-token' };
  }
  if (!boardId) {
    log('WARN Pinterest: PINTEREST_BOARD_ID missing, skip');
    return { skipped: true, reason: 'no-board' };
  }
  const imgPath = findPinImage(pin.file);
  if (!imgPath) {
    log(`WARN Pinterest: pin image not found locally: ${pin.file}`);
    return { skipped: true, reason: 'no-image' };
  }
  const data = fs.readFileSync(imgPath).toString('base64');
  const body = {
    board_id: boardId,
    title: pin.title.slice(0, 100),
    description: `${pin.title} — ${pin.link}`.slice(0, 500),
    link: pin.link,
    media_source: { source_type: 'image_base64', content_type: 'image/png', data },
  };
  const res = await postJson(`${PINTEREST_API}/pins`, body, token);
  return { sent: true, id: res.data && res.data.id };
}

function bridgeConfig() {
  const key = process.env.POST_BRIDGE_KEY;
  if (!key) return null;
  const url = (process.env.POST_BRIDGE_URL || POST_BRIDGE_URL_DEFAULT).replace(/\/+$/, '');
  return { key, url };
}

async function publishViaBridge(text, platforms, mediaUrls) {
  const cfg = bridgeConfig();
  if (!cfg) {
    log('WARN Bridge: POST_BRIDGE_KEY missing, skip');
    return { skipped: true, reason: 'no-key' };
  }
  const body = { post: text, platforms };
  if (mediaUrls && mediaUrls.length) body.mediaUrls = mediaUrls;
  const res = await postJson(`${cfg.url}/post`, body, cfg.key);
  return { sent: true, data: res.data };
}

// =============================================
// FLOWS
// =============================================

async function autoPostBlog(state, now, opts = {}) {
  const blogDir = opts.blogDir || path.join(ROOT, 'blog');
  const errors = [];
  if (!state.seeded) {
    state.seeded = true;
    log('First run: seeded blog state (existing articles are baseline, nothing posted)');
    return { seeded: true, posted: [], errors };
  }
  const fresh = selectFreshArticles(listBlogArticles(blogDir), state, now, opts.maxPosts || 3);
  const posted = [];
  for (const a of fresh) {
    const text = buildBlogPostText(a);
    if (opts.dryRun) {
      posted.push({ file: a.file, dryRun: true });
      continue;
    }
    try {
      const tg = await publishTelegram(text);
      const bridge = await publishViaBridge(text, ['twitter']);
      const anySent = (tg && tg.sent) || (bridge && bridge.sent);
      if (anySent) {
        state.published[`blog/${a.file}`] = now.toISOString();
        posted.push({ file: a.file });
        log(`Blog posted: ${a.file}`);
      } else {
        errors.push(`No publisher available for blog post ${a.file} (will retry next run)`);
      }
    } catch (err) {
      errors.push(`blog/${a.file}: ${err.message}`);
    }
  }
  return { seeded: false, posted, errors };
}

async function postCalendar(state, now, opts = {}) {
  const perf = loadJson(PERF_PATH, {});
  const pinEntry = pickCalendarItem(PIN_CALENDAR, perf, now, 'pin');
  const tweetEntry = pickCalendarItem(TWEET_CALENDAR, perf, now, 'tweet');
  const key = `social/${now.toISOString().slice(0, 10)}`;
  if (state.published[key]) {
    return { skipped: true, key };
  }
  const results = { key, selection: { pin: pinEntry.key, tweet: tweetEntry.key }, errors: [] };
  if (opts.dryRun) {
    results.pin = { dryRun: true, title: pinEntry.item.title, board: pinEntry.item.board, score: pinEntry.score };
    results.tweet = { dryRun: true, score: tweetEntry.score };
    log(`Dry-run pin: ${pinEntry.key} "${pinEntry.item.title}" (score ${pinEntry.score})`);
    log(`Dry-run tweet: ${tweetEntry.key} (score ${tweetEntry.score})`);
    return results;
  }
  // Pin -> Pinterest direct, fallback bridge aggregator
  try {
    let r = await publishPinterestPin(pinEntry.item, process.env.PINTEREST_BOARD_ID);
    if (r.skipped) r = await publishViaBridge(pinEntry.item.title, ['pinterest'], [pinEntry.item.link]);
    results.pin = r;
  } catch (err) {
    errors.push(`pin: ${err.message}`);
  }
  // Tweet -> bridge (X/Twitter) + Telegram mirror (no preview)
  try {
    const bridge = await publishViaBridge(tweetEntry.item, ['twitter']);
    const telegram = await publishTelegram(tweetEntry.item, { noPreview: true });
    results.tweet = { bridge, telegram };
  } catch (err) {
    errors.push(`tweet: ${err.message}`);
  }
  const pinSent = results.pin && results.pin.sent;
  const tweetSent = results.tweet && ((results.tweet.bridge && results.tweet.bridge.sent) || (results.tweet.telegram && results.tweet.telegram.sent));
  if (pinSent || tweetSent) {
    state.published[key] = now.toISOString();
  }
  return results;
}

async function runDaily(opts = {}) {
  const now = opts.now || new Date();
  const state = loadState();
  const out = { date: now.toISOString().slice(0, 10), blog: null, calendar: null };
  out.blog = await autoPostBlog(state, now, opts);
  out.calendar = await postCalendar(state, now, opts);
  state.lastRun = now.toISOString();
  if (!opts.dryRun) saveState(state);
  return out;
}

function recordScore(id, score) {
  const perf = loadJson(PERF_PATH, {});
  perf[id] = { score: Number(score), updatedAt: new Date().toISOString() };
  saveJson(PERF_PATH, perf);
  log(`Recorded ${id} score=${score}`);
}

// =============================================
// SELFTEST (pure functions, no network)
// =============================================

function selftest() {
  const failures = [];
  const assert = (cond, name) => { if (!cond) failures.push(name); };

  // Calendars
  assert(PIN_CALENDAR.length === 13, 'PIN_CALENDAR has 13 entries');
  assert(TWEET_CALENDAR.length === 30, 'TWEET_CALENDAR has 30 entries');
  assert(PIN_CALENDAR.every((p) => p.day && p.board && p.title && p.file && p.link), 'pins have all fields');

  // Rotation: consecutive days advance by 1 with no scores
  const cal = ['a', 'b', 'c'];
  const d0 = new Date('2026-09-21T00:00:00Z');
  const d1 = new Date('2026-09-22T00:00:00Z');
  const e0 = pickCalendarItem(cal, {}, d0, 'cal');
  const e1 = pickCalendarItem(cal, {}, d1, 'cal');
  assert(e1.index === (e0.index + 1) % 3, 'evergreen rotation advances by 1/day');
  const wCounts = { a: 0, b: 0, c: 0 };
  for (let d = 0; d < 12; d++) {
    const wDay = new Date(Date.UTC(2026, 8, 21) + d * 86400000);
    const we = pickCalendarItem(cal, { 'cal-3': { score: 9 } }, wDay, 'cal');
    wCounts[we.item]++;
  }
  assert(wCounts.c === 10 && wCounts.a === 1 && wCounts.b === 1, 'performance boost: weighted rotation favors top scorer');

  // Blog selection
  const now = new Date('2026-09-21T12:00:00Z');
  const arts = [
    { file: 'a.html', mtime: Date.parse('2026-09-20T10:00:00Z') },
    { file: 'b.html', mtime: Date.parse('2026-09-21T11:00:00Z') },
    { file: 'c.html', mtime: Date.parse('2026-09-19T10:00:00Z') },
  ];
  assert(selectFreshArticles(arts, { seeded: false, lastRun: null, published: {} }, now, 3).length === 0, 'no selection before seeding');
  const sel = selectFreshArticles(arts, { seeded: true, lastRun: '2026-09-20T00:00:00Z', published: {} }, now, 3);
  assert(sel.length === 2 && sel[0].file === 'b.html', 'selects fresh unpublished newest-first');

  // Blog text
  assert(
    buildBlogPostText({ title: 'T', desc: 'D', file: 't.html' }) === '📖 T\nD\n→ https://cha0smagicklabs.com/blog/t.html',
    'buildBlogPostText format'
  );

  if (failures.length) {
    console.error(`SELFTEST FAIL (${failures.length}):`);
    failures.forEach((f) => console.error(`  - ${f}`));
    process.exitCode = 1;
  } else {
    log('SELFTEST OK');
  }
}

// =============================================
// CLI
// =============================================

function showHelp() {
  console.log(`
Cha0smagick LABS - Social Publishing v2.0 (Plan 3.3.1-3.3.4)

Commands:
  daily [--dry-run]     Daily run: blog auto-post + calendar post + save state
  blog                  Show articles that WOULD be auto-posted now (dry)
  calendar              Show pin content calendar (13)
  tweets                Show tweet content calendar (30)
  pins                  List available pin image files
  record <id> <score>   Record post performance score (3.3.4 feedback loop)
  state                 Show current social-state.json
  selftest              Run pure-function selftest (no network)

Environment:
  TELEGRAM_BOT_TOKEN    Telegram bot token (channel posting)
  TELEGRAM_CHANNEL      Target channel (default @cha0smagicklabs)
  PINTEREST_TOKEN       Pinterest API token (direct v5 posting)
  PINTEREST_BOARD_ID    Pinterest board ID (calendar boards are names; API needs ID)
  POST_BRIDGE_KEY       Bridge aggregator key (pb_live_... / Ayrshare-style)
  POST_BRIDGE_URL       Bridge base URL (default ${POST_BRIDGE_URL_DEFAULT};
                        verified 404 publicly 2026-09-21 - set only if you have access)

Publishers degrade gracefully: missing credentials are skipped with a warning,
the daily run never fails because of absent secrets.
  `);
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];
  const dryRun = args.includes('--dry-run');

  (async () => {
    switch (cmd) {
      case 'daily': {
        const out = await runDaily({ dryRun });
        console.log(JSON.stringify(out, null, 2));
        break;
      }
      case 'blog': {
        const state = loadState();
        const arts = state.seeded
          ? selectFreshArticles(listBlogArticles(path.join(ROOT, 'blog')), state, new Date(), 3)
          : [];
        console.log(JSON.stringify(arts.map((a) => ({ file: a.file, title: a.title })), null, 2));
        break;
      }
      case 'calendar':
        console.log(JSON.stringify(PIN_CALENDAR, null, 2));
        break;
      case 'tweets':
        TWEET_CALENDAR.forEach((t, i) => console.log(`${i + 1}. ${t.slice(0, 80)}`));
        break;
      case 'pins':
        listPins();
        break;
      case 'record': {
        const id = args[1];
        const score = args[2];
        if (!id || score === undefined) {
          console.error('Usage: node scripts/social-publish.js record <id> <score>');
          process.exitCode = 1;
          break;
        }
        recordScore(id, score);
        break;
      }
      case 'state':
        console.log(JSON.stringify(loadState(), null, 2));
        break;
      case 'selftest':
        selftest();
        break;
      case '--help':
      case '-h':
        showHelp();
        break;
      default:
        showHelp();
    }
  })().catch((err) => {
    console.error(`FATAL: ${err.message}`);
    process.exitCode = 1;
  });
}

// Listed pins helper (kept before module.exports for require-time safety)
function listPins() {
  let found = null;
  for (const dir of PIN_DIRS) {
    if (fs.existsSync(dir)) { found = dir; break; }
  }
  if (!found) { log('No pins/output directory found'); return; }
  const files = fs.readdirSync(found).filter((f) => f.endsWith('.png'));
  log(`Available pin images in ${found} (${files.length}):`);
  files.forEach((f) => log(`  ${f}`));
}

module.exports = {
  PIN_CALENDAR,
  TWEET_CALENDAR,
  SITE_URL,
  STATE_PATH,
  PERF_PATH,
  loadState,
  saveState,
  listBlogArticles,
  buildBlogPostText,
  selectFreshArticles,
  pickCalendarItem,
  postJson,
  bridgeConfig,
  publishTelegram,
  publishPinterestPin,
  publishViaBridge,
  autoPostBlog,
  postCalendar,
  runDaily,
  recordScore,
  selftest,
};
