/**
 * Share 10 NOCTEM posts to Discord only (no running bot conflict)
 * Run: node scripts/share-noctem-discord.js
 * Then restart bots: node scripts/run-bots.js all
 */
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const TOKEN = process.env.DISCORD_BOT_TOKEN;

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
  console.log('Connecting to Discord...');
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
  });
  await client.login(TOKEN);
  console.log(`Logged in as ${client.user.tag}`);

  for (const guild of client.guilds.cache.values()) {
    console.log(`\nServer: ${guild.name} (${guild.id})`);
    const channels = guild.channels.cache.filter(c => c.type === 0);
    console.log(`Channels: ${channels.map(c => '#'+c.name).join(', ') || 'none'}`);
    
    let target = channels.find(c => /general|announcements|chat|blog/i.test(c.name))
      || channels.find(c => /resources|products/i.test(c.name))
      || channels.first();

    if (target) {
      console.log(`Posting ${POSTS.length} articles to #${target.name}...`);
      for (let i = 0; i < POSTS.length; i++) {
        const embed = {
          title: `${i+1}/10 📡 ${POSTS[i].title}`,
          url: `${BASE}/${POSTS[i].slug}.html`,
          color: 0x1a1a2e,
          description: 'A complete guide from Cha0smagick Labs — learn about professional paranormal investigation with NOCTEM.',
          footer: { text: 'NOCTEM — Professional Paranormal Investigation Suite' },
          timestamp: new Date().toISOString()
        };
        await target.send({ embeds: [embed] });
        console.log(`  [${i+1}/10] Sent`);
        await sleep(1500);
      }
    }
  }

  console.log('\n✅ Discord posts done!');
  client.destroy();
  process.exit(0);
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });
