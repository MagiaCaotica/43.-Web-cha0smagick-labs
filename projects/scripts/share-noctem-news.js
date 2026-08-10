/**
 * Share NOCTEM posts to Telegram "New!" topic + Discord #news
 * Run: node scripts/share-noctem-news.js
 */
require('dotenv').config();
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TG_API = `https://api.telegram.org/bot${TG_TOKEN}`;
const TG_GROUP = -1003559339441;
const TG_THREAD = 15; // "New!" topic
const DC_CHANNEL = '1532162771469340722'; // #news

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
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  // 1. Telegram "New!" topic
  console.log('Telegram "New!" topic...');
  for (let i = 0; i < POSTS.length; i++) {
    const text = `${i+1}/10 📡 ${POSTS[i].title}\n\nRead more:\n${BASE}/${POSTS[i].slug}.html\n\n#NOCTEM #ParanormalInvestigation #GhostHunting`;
    const r = await fetch(`${TG_API}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ chat_id: TG_GROUP, message_thread_id: TG_THREAD, text, parse_mode: 'HTML', disable_web_page_preview: false })
    });
    const d = await r.json();
    console.log(`  [${i+1}/10] ${d.ok ? 'OK' : 'FAIL: '+d.description}`);
    await sleep(2000);
  }

  // 2. Discord #news
  console.log('\nDiscord #news...');
  const { Client, GatewayIntentBits } = require('discord.js');
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  await client.login(process.env.DISCORD_BOT_TOKEN);
  console.log(`  Logged in as ${client.user.tag}`);
  
  const channel = await client.channels.fetch(DC_CHANNEL);
  if (!channel) { console.log('  #news channel not found'); client.destroy(); process.exit(1); }
  
  for (let i = 0; i < POSTS.length; i++) {
    await channel.send({
      embeds: [{
        title: `${i+1}/10 📡 ${POSTS[i].title}`,
        url: `${BASE}/${POSTS[i].slug}.html`,
        color: 0x1a1a2e,
        description: 'A complete guide from Cha0smagick Labs — professional paranormal investigation with NOCTEM.',
        footer: { text: 'NOCTEM — Professional Paranormal Investigation Suite' }
      }]
    });
    console.log(`  [${i+1}/10] Sent`);
    await sleep(1500);
  }

  console.log('\n✅ All done!');
  client.destroy();
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
