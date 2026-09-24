/**
 * discord-bot.js — Cha0smagick Labs Discord Bot
 * 
 * Features:
 * - /menu — Main navigation
 * - /apps — List Android apps
 * - /books — List PDF books
 * - /tools — Free tools list
 * - /bundle — Books bundle deal
 * - /blog — Blog categories
 * - /subscribe — MailerLite link
 * - /website — Site link
 * - Welcome message for new members
 * - Auto-reply to keywords in chat channels
 * - BTL: sales conversion via embedded product cards
 */

const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');
const BRAIN = require('./bot-brain');
const logger = require('./logger');
const { askGroq, needsGroq } = require('./groq-ai');
const { createSupportTicket } = require('./ticket-bot');

// Load .env from project root
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!TOKEN) {
  logger.error('discord-bot', '❌ DISCORD_BOT_TOKEN not set in environment');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const WELCOME_CHANNEL = 'welcome';
const GENERAL_CHANNEL = 'general';
const PRODUCTS_CHANNEL = 'products';
const RESOURCES_CHANNEL = 'resources';

// ── Build embeds ──

function appEmbed(app) {
  const embed = new EmbedBuilder()
    .setColor(Colors.DarkPurple)
    .setTitle(`📱 ${app.name}`)
    .setDescription(app.shortDesc)
    .addFields(
      { name: '💰 Price', value: app.price, inline: true },
      { name: '🛒 Buy', value: `[Google Play](${app.url})`, inline: true },
      { name: '🔗 Info', value: `[Funnel Page](${app.funnel})`, inline: true },
    );
  if (app.image) embed.setImage(app.image);
  return embed.setFooter({ text: 'One-time purchase. No subscriptions.' });
}

function bookEmbed(book) {
  const embed = new EmbedBuilder()
    .setColor(Colors.Gold)
    .setTitle(`📖 ${book.name}`)
    .setDescription(book.shortDesc)
    .addFields({ name: '💰 Price', value: book.price, inline: true });
  if (book.image) embed.setImage(book.image);
  return embed.setFooter({ text: 'PDF — instant download.' });
}

function toolEmbed(tool) {
  return new EmbedBuilder()
    .setColor(Colors.Green)
    .setTitle(`🔧 ${tool.name}`)
    .setDescription('Free online tool — no download required.')
    .addFields({ name: '🔗 Link', value: tool.url })
    .setFooter({ text: 'FREE — no registration needed.' });
}

// ── Ready ──

client.once('ready', async () => {
  logger.info('discord-bot', `✅ Discord bot logged in as ${client.user.tag}`);

  // Register slash commands globally
  try {
    await client.application.commands.set([
      new SlashCommandBuilder().setName('menu').setDescription('📋 Main menu'),
      new SlashCommandBuilder().setName('apps').setDescription('📱 List our Android apps'),
      new SlashCommandBuilder().setName('books').setDescription('📖 List our PDF books'),
      new SlashCommandBuilder().setName('tools').setDescription('🔧 Free online tools'),
      new SlashCommandBuilder().setName('bundle').setDescription('🎁 Esoteric Books Bundle (52% off)'),
      new SlashCommandBuilder().setName('blog').setDescription('📰 Blog categories and info'),
      new SlashCommandBuilder().setName('subscribe').setDescription('📧 Free PDF guide subscription'),
      new SlashCommandBuilder().setName('website').setDescription('🌐 Visit our website'),
      new SlashCommandBuilder().setName('contact').setDescription('💬 Contact information'),
      new SlashCommandBuilder().setName('pricing').setDescription('💰 Pricing info — no subscriptions'),
      new SlashCommandBuilder()
        .setName('ask')
        .setDescription('🤖 Ask AI anything about Cha0smagick Labs')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('Your question')
            .setRequired(true)
            .setMaxLength(1000)),
      new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('🎫 Open a support ticket → GitHub Issues')
        .addStringOption(option =>
          option.setName('description')
            .setDescription('Describe your issue or question')
            .setRequired(true)
            .setMaxLength(1000)),
    ]);
    logger.info('discord-bot', '✅ Slash commands registered');
  } catch (err) {
    logger.error('discord-bot', '❌ Failed to register slash commands:', err.message);
  }
});

// ── Slash command handler ──

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'menu':
        await interaction.reply({
          content: BRAIN.helpers.mainMenu(),
          ephemeral: false,
        });
        break;

      case 'apps': {
        const embeds = BRAIN.apps.map(appEmbed);
        // Send in batches of 5 (Discord limit)
        await interaction.reply({ embeds: embeds.slice(0, 5) });
        for (let i = 5; i < embeds.length; i += 5) {
          await interaction.followUp({ embeds: embeds.slice(i, i + 5) });
        }
        break;
      }

      case 'books': {
        const embeds = BRAIN.books.map(bookEmbed);
        await interaction.reply({ embeds: embeds.slice(0, 5) });
        for (let i = 5; i < embeds.length; i += 5) {
          await interaction.followUp({ embeds: embeds.slice(i, i + 5) });
        }
        break;
      }

      case 'tools': {
        const embeds = BRAIN.freeTools.map(toolEmbed);
        await interaction.reply({ embeds: embeds.slice(0, 5) });
        for (let i = 5; i < embeds.length; i += 5) {
          await interaction.followUp({ embeds: embeds.slice(i, i + 5) });
        }
        break;
      }

      case 'bundle': {
        const embed = new EmbedBuilder()
          .setColor(Colors.Gold)
          .setTitle(`🎁 ${BRAIN.bundle.name}`)
          .setDescription(BRAIN.bundle.shortDesc)
          .addFields(
            { name: '💵 Original Price', value: BRAIN.bundle.originalPrice, inline: true },
            { name: '🔥 Bundle Price', value: BRAIN.bundle.price, inline: true },
            { name: '📦 Includes', value: '7 esoteric PDF books — 52% off!' },
          )
          .setURL(BRAIN.bundle.url);
        if (BRAIN.bundle.image) embed.setImage(BRAIN.bundle.image);
        embed.setFooter({ text: 'Limited offer. One-time purchase.' });
        await interaction.reply({ embeds: [embed] });
        break;
      }

      case 'blog':
        await interaction.reply({ content: BRAIN.helpers.blogCategories() });
        break;

      case 'subscribe':
        await interaction.reply({
          content: `📧 **Free Chaos Magick Quickstart Guide**\n\nGet your free PDF guide via email:\nhttps://www.magiadelcaospractica.com/p/magia-del-caos.html\n\nNo spam. Unsubscribe anytime.`,
        });
        break;

      case 'website':
        await interaction.reply({ content: `🌐 **${BRAIN.site.name}**\n${BRAIN.site.url}\n\n📰 Blog: ${BRAIN.site.blog}` });
        break;

      case 'contact':
        await interaction.reply({
          content: `💬 **Contact Us**\n\n📧 magiacaoticapractica@gmail.com\n\n🌀 Telegram: ${BRAIN.social.telegram.channel}\n🐦 X/Twitter: ${BRAIN.social.twitter}\n📌 Pinterest: ${BRAIN.social.pinterest}\n🎮 Discord invite: ${BRAIN.social.discord}`,
        });
        break;

      case 'pricing':
        await interaction.reply({
          content: `💰 **Pricing**\n\n📱 Apps: $3.99–$14.99 USD (one-time)\n📖 Books: $4.99–$9.99 USD (PDF)\n🔧 Tools: FREE\n🎁 Bundle: $19.99 (52% off)\n\n**No subscriptions. No recurring fees.**\nYou buy once, you own it forever.`,
        });
        break;

      case 'ask': {
        const question = interaction.options.getString('question');
        if (!GROQ_API_KEY) {
          await interaction.reply({ content: '⚠️ Groq AI is not configured. Please set GROQ_API_KEY in .env', ephemeral: true });
          break;
        }
        await interaction.deferReply();
        try {
          const answer = await askGroq(question, GROQ_API_KEY);
          const embed = new EmbedBuilder()
            .setColor(Colors.DarkPurple)
            .setTitle('🤖 Cha0smagick AI')
            .setDescription(answer)
            .setFooter({ text: 'Ask another question with /ask' });
          await interaction.editReply({ embeds: [embed] });
        } catch (err) {
          logger.error('discord-bot', '❌ /ask error:', err.message);
          await interaction.editReply({ content: '⚠️ Sorry, I had trouble processing your question. Please try again.' });
        }
        break;
      }

      case 'ticket': {
        const description = interaction.options.getString('description');
        await interaction.deferReply({ ephemeral: true });
        try {
          const result = await createSupportTicket({
            platform: 'discord',
            user: interaction.user.tag,
            text: description,
          });
          await interaction.editReply({ content: `🎫 Ticket created: **Issue #${result.issueNumber}**\n${result.url}` });
        } catch (err) {
          logger.error('discord-bot', '❌ /ticket error:', err.message);
          await interaction.editReply({ content: `⚠️ ${err.message}` });
        }
        break;
      }
    }
  } catch (err) {
    logger.error('discord-bot', `❌ Error handling /${commandName}:`, err.message);
    try {
      if (!interaction.replied) await interaction.reply({ content: '⚠️ Error processing command.', ephemeral: true });
    } catch (_) { /* ignore */ }
  }
});

// ── Welcome new members ──

client.on('guildMemberAdd', async (member) => {
  try {
    const channel = member.guild.channels.cache.find((ch) => ch.name === WELCOME_CHANNEL);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(Colors.DarkPurple)
      .setTitle(`🌟 Welcome to Cha0smagick Labs, ${member.displayName}!`)
      .setDescription(
        `We are an indie developer creating tools for magick, divination, and esoteric practice.\n\n` +
        `• 📱 **12 Android apps** — one-time purchase\n` +
        `• 📖 **7 PDF books** — instant download\n` +
        `• 🔧 **10 free tools** — no registration\n` +
        `• 📰 **467 blog articles** — free reading\n\n` +
        `Type \`/menu\` to explore everything we offer!`
      )
      .setFooter({ text: 'One-time purchases. No subscriptions. Ever.' });

    await channel.send({ embeds: [embed] });
    logger.info('discord-bot', `👋 Welcome message sent to ${member.displayName}`);
  } catch (err) {
    logger.error('discord-bot', '❌ Welcome message error:', err.message);
  }
});

// ── Auto-reply in text channels (with Groq AI) ──

// Wire up groqAsk helper in BRAIN
BRAIN.helpers.groqAsk = askGroq;

client.on('messageCreate', async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;
  // Ignore commands
  if (message.content.startsWith('/')) return;

  // Only auto-reply in specific channels
  const allowedChannels = [GENERAL_CHANNEL, PRODUCTS_CHANNEL, RESOURCES_CHANNEL];
  if (!allowedChannels.includes(message.channel.name)) return;

  // Use smartReply: keyword match first, then Groq
  const reply = await BRAIN.helpers.smartReply(message.content, GROQ_API_KEY);
  if (reply) {
    try {
      await message.reply(reply);
    } catch (err) {
      logger.error('discord-bot', '❌ Auto-reply error:', err.message);
    }
  }
});

// ── Error handling ──

client.on('error', (err) => {
  logger.error('discord-bot', '⚠️ Discord client error:', err.message);
});

// ── Start ──

function init() {
  client.login(TOKEN).catch((err) => {
    logger.error('discord-bot', '❌ Discord login failed:', err.message);
    process.exit(1);
  });
}

module.exports = { init, client };

// Run if called directly
if (require.main === module) {
  init();
}

// /health + /delete-my-data endpoints — plan 3.1.5 + 3.1.12
// Skipped under vitest (no port binding in tests).
if (!process.env.VITEST) {
  const http = require('http');
  const fs = require('fs');
  const path = require('path');
  const logger = require('./logger');
  const HEALTH_PORT = Number(process.env.HEALTH_PORT_DISCORD || 3001);
  const gdprLog = path.join(__dirname, '..', '..', 'logs', 'gdpr-deletion-requests.log');
  http
    .createServer((req, res) => {
      const url = req.url || '/';
      if (url.startsWith('/delete-my-data')) {
        const userId = new URLSearchParams(url.split('?')[1] || '').get('user_id') || 'unknown';
        const entry = JSON.stringify({
          timestamp: new Date().toISOString(),
          type: 'gdpr-deletion-request',
          user_id: userId,
          source: 'discord-bot',
        });
        try {
          fs.mkdirSync(path.dirname(gdprLog), { recursive: true });
          fs.appendFileSync(gdprLog, entry + '\n');
        } catch (err) {
          logger.error('discord-bot', 'GDPR log write failed:', err.message);
        }
        logger.info('discord-bot', 'GDPR deletion requested:', userId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'received', action: 'deletion-requested', user_id: userId }));
        return;
      }
      if (url.startsWith('/health')) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', bot: 'discord', uptime: Math.round(process.uptime()) }));
        return;
      }
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'not-found' }));
    })
    .on('error', (err) => {
      logger.error('discord-bot', 'Health server error (bot continues):', err.message);
    })
    .listen(HEALTH_PORT);
}
