// publish-articles.js — Publica los 4 artículos nuevos en Telegram (@cha0smagicklabs) y Discord (canal general/products)
// Uso: node publish-articles.js  (desde projects/scripts/ con node_modules de dotenv; si no, leer .env manual)
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = 'D:\\Paginas web\\Cha0smagick Labs\\43.-Web-cha0smagick-labs';
const ENV_PATH = path.join(ROOT, '.env');

// Cargar .env manualmente (evita depender de dotenv)
function loadEnv(p) {
  const out = {};
  if (!fs.existsSync(p)) return out;
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

const env = loadEnv(ENV_PATH);
const TELEGRAM_TOKEN = env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL = env.TELEGRAM_CHANNEL || '@cha0smagicklabs';
const DISCORD_TOKEN = env.DISCORD_BOT_TOKEN;

const ARTICLES = [
  { slug: 'servitor-guide-2026', title: 'NEW: The Complete Chaos Magic Servitor Guide 2026 — create, program & dissolve thought forms step by step' },
  { slug: 'noctem-tools-app-review', title: 'NEW: NOCTEM App Review — the best ghost hunting app for Android (EVP, spirit box & EMF in one tool)' },
  { slug: 'runas-para-chaos-magick', title: 'NEW: Runes for Chaos Magic — combine Elder Futhark & sigils (bind rune tutorial inside)' },
  { slug: 'lunar-eclipse-ritual', title: 'NEW: Lunar Eclipse Ritual for Releasing — step-by-step guide 2026 (do it at the exact peak time)' },
];

async function tgSend(text) {
  const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
  const body = new URLSearchParams({ chat_id: TELEGRAM_CHANNEL, text, parse_mode: 'Markdown' });
  const r = await fetch(url, { method: 'POST', body });
  const j = await r.json();
  return { ok: !!j.ok, desc: (j.description || 'ok') };
}

async function dcSend(channelId, content) {
  const url = `https://discord.com/api/v10/channels/${channelId}/messages`;
  const r = await fetch(url, { method: 'POST', headers: { Authorization: `Bot ${DISCORD_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ content }) });
  return { ok: r.ok, status: r.status };
}

async function main() {
  console.log('=== PUBLISH ARTICLES ===');
  if (!TELEGRAM_TOKEN) { console.log('TG: NO TELEGRAM_BOT_TOKEN en .env'); }
  if (!DISCORD_TOKEN) { console.log('DC: NO DISCORD_BOT_TOKEN en .env'); }

  // Telegram
  for (const a of ARTICLES) {
    if (!TELEGRAM_TOKEN) break;
    const text = `${a.title}\n\nRead the full guide → https://cha0smagicklabs.com/blog/${a.slug}.html\n\n#chaosmagick #occult #esotericism`;
    const res = await tgSend(text);
    console.log(`TG ${a.slug}: ${res.ok ? 'OK' : 'FAIL ' + res.desc}`);
  }

  // Discord
  if (DISCORD_TOKEN) {
    try {
      const me = await (await fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bot ${DISCORD_TOKEN}` } })).json();
      console.log('DC bot:', me.username || 'FAIL');
      const guilds = await (await fetch('https://discord.com/api/v10/users/@me/guilds', { headers: { Authorization: `Bot ${DISCORD_TOKEN}` } })).json();
      for (const g of guilds) {
        const chans = await (await fetch(`https://discord.com/api/v10/guilds/${g.id}/channels`, { headers: { Authorization: `Bot ${DISCORD_TOKEN}` } })).json();
        const targets = chans.filter(c => c.type === 0 && /general|products|news|announce/i.test(c.name));
        for (const c of targets) {
          for (const a of ARTICLES) {
            const res = await dcSend(c.id, `${a.title}\nhttps://cha0smagicklabs.com/blog/${a.slug}.html`);
            console.log(`DC ${g.name}#${c.name} ${a.slug}: ${res.ok ? 'OK' : 'FAIL ' + res.status}`);
          }
        }
        if (targets.length === 0) console.log(`DC ${g.name}: no channel general/products/news encontrado`);
      }
    } catch (e) { console.log('DC error:', e.message); }
  }
  console.log('=== DONE ===');
}

main();
