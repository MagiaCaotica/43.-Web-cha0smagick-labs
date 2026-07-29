/**
 * Share NOCTEM posts — Telegram group + Discord (REST API)
 * Run: node scripts/share-noctem-rest.js
 */
require('dotenv').config();

const POSTS = [
  { slug: 'sls-camera-paranormal-investigation-guide', title: 'SLS Camera Explained: How Skeleton Tracking Revolutionizes Paranormal Investigations' },
  { slug: 'evp-recording-complete-guide', title: 'EVP Recording: The Complete Guide to Capturing Electronic Voice Phenomena' },
  { slug: 'ghost-hunting-apps-comparison-android', title: 'Best Ghost Hunting Apps for Android: A Complete Comparison' },
  { slug: 'paranormal-investigation-step-by-step-guide', title: 'How to Conduct a Paranormal Investigation: Step-by-Step Guide' },
  { slug: 'science-behind-sls-camera-ghost-hunting', title: 'The Science Behind SLS Cameras and Skeleton Tracking in Ghost Hunting' },
  { slug: 'urban-exploration-paranormal-investigation-guide', title: 'Urban Exploration and Paranormal Investigation: Documenting the Unknown' },
  { slug: 'evp-vs-spirit-box-comparison-guide', title: 'EVP vs Spirit Box: Understanding Paranormal Audio Investigation Methods' },
  { slug: 'privacy-paranormal-investigation-apps-guide', title: 'Why Privacy Matters in Paranormal Investigation Apps' },
  { slug: 'smartphone-paranormal-investigation-tools', title: 'Best Paranormal Investigation Equipment You Already Have in Your Pocket' },
  { slug: 'ai-machine-learning-paranormal-research', title: 'How ML Kit and AI Are Revolutionizing Paranormal Research' }
];
const BASE = 'https://cha0smagicklabs.com/blog';
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TG_TOKEN}`;
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function tgMsg(p, i) {
  return `${i+1}/10 📡 ${p.title}\n\nRead more:\n${BASE}/${p.slug}.html\n\n#NOCTEM #ParanormalInvestigation`;
}

function dcEmbed(p, i) {
  return {
    title: `${i+1}/10 📡 ${p.title}`,
    url: `${BASE}/${p.slug}.html`,
    color: 0x1a1a2e,
    description: 'A complete guide from Cha0smagick Labs for professional paranormal investigation with NOCTEM.',
    footer: { text: 'NOCTEM — Professional Paranormal Investigation Suite' }
  };
}

async function main() {
  // --- 1. Telegram Group ---
  console.log('Finding Telegram group...');
  const updRes = await fetch(`${TG_API}/getUpdates`);
  const upd = await updRes.json();
  let groupId = null;
  if (upd.ok && upd.result) {
    for (const u of upd.result) {
      const chat = u.message?.chat;
      if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
        groupId = chat.id;
        console.log(`  Group: "${chat.title}" (ID: ${groupId})`);
        break;
      }
    }
  }
  if (groupId) {
    console.log(`Sending ${POSTS.length} posts to Telegram group...`);
    for (let i = 0; i < POSTS.length; i++) {
      const res = await fetch(`${TG_API}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: groupId, text: tgMsg(POSTS[i], i), parse_mode: 'HTML', disable_web_page_preview: false })
      });
      const d = await res.json();
      console.log(`  TG Group [${i+1}/10] ${d.ok ? 'OK' : 'FAIL: '+d.description}`);
      await sleep(2000);
    }
  } else {
    console.log('  No group found. Send a message to the group first.');
  }

  // --- 2. Discord ---
  console.log('\nSending to Discord...');
  const { Client, GatewayIntentBits } = require('discord.js');
  const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
  await client.login(DISCORD_TOKEN);
  console.log(`  Logged in as ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    console.log(`  Server: ${guild.name}`);
    const channels = guild.channels.cache.filter(c => c.type === 0);
    let target = channels.find(c => /general|announcements|chat|blog/i.test(c.name))
      || channels.find(c => /resources|products/i.test(c.name))
      || channels.first();
    if (target) {
      console.log(`  Posting to #${target.name}...`);
      for (let i = 0; i < POSTS.length; i++) {
        await target.send({ embeds: [dcEmbed(POSTS[i], i)] });
        console.log(`  DC [${i+1}/10] Sent`);
        await sleep(1500);
      }
    }
  }

  console.log('\n✅ Done!');
  client.destroy();
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
