/**
 * Share 10 NOCTEM blog posts to Telegram channel, Telegram group, and Discord
 * Run: node scripts/share-noctem-posts.js
 */
require('dotenv').config();
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL = process.env.TELEGRAM_CHANNEL; // @cha0smagicklabs
const TG_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const NOCTEM_POSTS = [
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

const BASE_URL = 'https://cha0smagicklabs.com/blog';

function buildMessage(post, i) {
  return `${i+1}/10 📡 ${post.title}\n\nRead the full guide:\n${BASE_URL}/${post.slug}.html\n\n#NOCTEM #ParanormalInvestigation #GhostHunting`;
}

function buildDiscordEmbed(post, i) {
  return {
    title: `${i+1}/10 📡 ${post.title}`,
    description: `Read the full guide on Cha0smagick Labs`,
    url: `${BASE_URL}/${post.slug}.html`,
    color: 0x1a1a2e,
    footer: { text: 'NOCTEM — Professional Paranormal Investigation Suite' },
    timestamp: new Date().toISOString()
  };
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function sendTelegram(chatId, text) {
  const res = await fetch(`${TG_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: false })
  });
  const data = await res.json();
  if (!data.ok) console.error(`  TG error: ${data.description}`);
  else console.log(`  TG OK: ${data.result.message_id}`);
}

async function main() {
  // --- 1. Get Telegram group chat ID from updates ---
  console.log('Getting Telegram updates to find group chat ID...');
  const updatesRes = await fetch(`${TG_API}/getUpdates`);
  const updates = await updatesRes.json();
  
  let groupChatId = null;
  if (updates.ok && updates.result) {
    for (const u of updates.result) {
      const chat = u.message?.chat || u.my_chat_member?.chat;
      if (chat && (chat.type === 'group' || chat.type === 'supergroup')) {
        groupChatId = chat.id;
        console.log(`  Found group: "${chat.title}" (ID: ${chat.id})`);
        break;
      }
    }
  }
  if (!groupChatId) {
    console.log('  No group found in updates. Group messages will be skipped.');
    console.log('  To fix: send a message in the Telegram group, then re-run.');
  }

  // --- 2. Send to Telegram channel ---
  console.log(`\nSending ${NOCTEM_POSTS.length} posts to Telegram channel ${TELEGRAM_CHANNEL}...`);
  for (let i = 0; i < NOCTEM_POSTS.length; i++) {
    const text = buildMessage(NOCTEM_POSTS[i], i);
    console.log(`  [${i+1}/${NOCTEM_POSTS.length}] ${NOCTEM_POSTS[i].title}`);
    await sendTelegram(TELEGRAM_CHANNEL, text);
    await sleep(2000); // rate limit
  }

  // --- 3. Send to Telegram group ---
  if (groupChatId) {
    console.log(`\nSending to Telegram group (ID: ${groupChatId})...`);
    for (let i = 0; i < NOCTEM_POSTS.length; i++) {
      const text = buildMessage(NOCTEM_POSTS[i], i);
      console.log(`  [${i+1}/${NOCTEM_POSTS.length}] ${NOCTEM_POSTS[i].title}`);
      await sendTelegram(groupChatId, text);
      await sleep(2000);
    }
  }

  // --- 4. Send to Discord via REST API (no client needed, works alongside running bot) ---
  console.log('\nSending to Discord via REST API...');
  const { DISCORD_BOT_TOKEN } = process.env;
  
  // Get guilds first
  const guildsRes = await fetch('https://discord.com/api/v10/users/@me/guilds', {
    headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
  });
  const guilds = await guildsRes.json();
  if (!Array.isArray(guilds) || guilds.length === 0) {
    console.log('  No Discord guilds found or invalid token.');
  } else {
    for (const guild of guilds) {
      console.log(`  Server: ${guild.name} (${guild.id})`);
      // Get channels for this guild
      const chRes = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/channels`, {
        headers: { Authorization: `Bot ${DISCORD_BOT_TOKEN}` }
      });
      const channels = await chRes.json();
      if (!Array.isArray(channels)) continue;
      
      const textChannels = channels.filter(c => c.type === 0);
      console.log(`    Text channels: ${textChannels.map(c => `#${c.name}`).join(', ') || 'none'}`);
      
      // Pick target channel
      let target = textChannels.find(c => /general|announcements|chat|blog/i.test(c.name))
        || textChannels.find(c => /resources|products/i.test(c.name))
        || textChannels[0];
      
      if (target) {
        console.log(`\n  Sending ${NOCTEM_POSTS.length} posts to Discord #${target.name}...`);
        for (let i = 0; i < NOCTEM_POSTS.length; i++) {
          const embed = buildDiscordEmbed(NOCTEM_POSTS[i], i);
          const msgRes = await fetch(`https://discord.com/api/v10/channels/${target.id}/messages`, {
            method: 'POST',
            headers: { 
              Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ embeds: [embed] })
          });
          if (msgRes.ok) console.log(`    [${i+1}/${NOCTEM_POSTS.length}] OK`);
          else console.log(`    [${i+1}/${NOCTEM_POSTS.length}] Error: ${msgRes.status}`);
          await sleep(1500);
        }
      } else {
        console.log('    No suitable channel found.');
      }
    }
  }

  console.log('\n✅ All posts shared!');
  process.exit(0);
}

main().catch(err => {
  console.error('❌', err.message);
  process.exit(1);
});
