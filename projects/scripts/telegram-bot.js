/**
 * telegram-bot.js — Cha0smagick Labs Telegram Bot
 * 
 * Features:
 * - /menu — Main menu with all commands
 * - /apps — List apps with prices
 * - /books — List books with prices
 * - /tools — Free tools list
 * - /bundle — Books bundle deal
 * - /blog — Blog info + categories
 * - /subscribe — MailerLite subscription link
 * - /website — Link to site
 * - /contact — Contact info
 * - Auto-reply in groups for product questions
 * - Channel: auto-post scheduled content (future)
 * - BTL: sales conversion via direct engagement
 */

// Load .env from project root
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { TelegramBot } = require('node-telegram-bot-api');
const BRAIN = require('./bot-brain');
const { askGroq, needsGroq } = require('./groq-ai');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not set in environment');
  process.exit(1);
}

const CHANNEL = process.env.TELEGRAM_CHANNEL || '@cha0smagicklabs';
const GROUP_INVITE = process.env.TELEGRAM_GROUP_INVITE || 'https://t.me/+krfQJgro4hBkNTE5';

let bot;

function init() {
  bot = new TelegramBot(TOKEN, { polling: true });
  console.log('🤖 Telegram bot started (polling)...');

  // ── Commands ──

  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcome = BRAIN.helpers.welcomeMessage('telegram');
    bot.sendMessage(chatId, welcome, {
      parse_mode: 'Markdown',
      reply_markup: {
        keyboard: [['🌀 Menu', '📱 Apps'], ['📖 Books', '🔧 Tools'], ['🎁 Bundle', '📰 Blog']],
        resize_keyboard: true,
        one_time_keyboard: false,
      },
    });
  });

  bot.onText(/\/menu|🌀 Menu/, (msg) => {
    bot.sendMessage(msg.chat.id, BRAIN.helpers.mainMenu(), {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/apps|📱 Apps/, (msg) => {
    const lines = BRAIN.apps.map((a) => `📱 *${a.name}* — ${a.price}\n${a.shortDesc}\n${a.funnel}`);
    const text = `*📱 Our Android Apps*\n\nAll one-time purchase, no subscriptions.\n\n${lines.join('\n\n')}\n\n🔗 Full catalog: ${BRAIN.site.url}`;
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/books|📖 Books/, (msg) => {
    const lines = BRAIN.books.map((b) => BRAIN.helpers.formatBook(b));
    const text = `*📖 Our Esoteric Books (PDF)*\n\n${lines.join('\n\n')}\n\n🎁 Bundle (52% off): ${BRAIN.site.funnel('/bundle.html')}`;
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/tools|🔧 Tools/, (msg) => {
    const lines = BRAIN.freeTools.map((t) => BRAIN.helpers.formatTool(t));
    const text = `*🔧 Free Online Tools*\n\n${lines.join('\n')}`;
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/bundle|🎁 Bundle/, (msg) => {
    const text = `🎁 *${BRAIN.bundle.name}*\n\n${BRAIN.bundle.shortDesc}\n\n💵 ~~${BRAIN.bundle.originalPrice}~~ → *${BRAIN.bundle.price}*\n📦 7 books, 52% off!\n\n🔗 ${BRAIN.bundle.url}`;
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: '🎁 Get the Bundle', url: BRAIN.bundle.url }]],
      },
    });
  });

  bot.onText(/\/blog|📰 Blog/, (msg) => {
    bot.sendMessage(msg.chat.id, BRAIN.helpers.blogCategories(), {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  bot.onText(/\/subscribe|📧 Subscribe/, (msg) => {
    const text = `📧 *Free Chaos Magick Quickstart Guide*\n\nGet your free PDF guide via email:\n🔗 https://www.magiadelcaospractica.com/p/magia-del-caos.html\n\n🇪🇸 Versión en español:\n🔗 https://www.magiadelcaospractica.com/p/magia-del-caos.html\n\nNo spam. Unsubscribe anytime.`;
    bot.sendMessage(msg.chat.id, text, {
      parse_mode: 'Markdown',
    });
  });

  bot.onText(/\/website|🌐 Website/, (msg) => {
    bot.sendMessage(msg.chat.id, `🌐 *${BRAIN.site.name}*\n${BRAIN.site.url}\n\n📰 Blog: ${BRAIN.site.blog}`, {
      parse_mode: 'Markdown',
    });
  });

  bot.onText(/\/contact|💬 Contact/, (msg) => {
    const text = `💬 *Contact Us*\n\n📧 magiacaoticapractica@gmail.com\n\n🌀 Telegram: ${CHANNEL}\n💬 Group: ${GROUP_INVITE}\n🐦 X/Twitter: ${BRAIN.social.twitter}\n📌 Pinterest: ${BRAIN.social.pinterest}\n🎮 Discord: ${BRAIN.social.discord}`;
    bot.sendMessage(msg.chat.id, text, { parse_mode: 'Markdown' });
  });

  // ── /ask command — Ask Groq AI anything about Cha0smagick Labs ──
  bot.onText(/\/ask[ ]?(.+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    let query = match?.[1]?.trim();

    // If no query after /ask, ask user
    if (!query) {
      bot.sendMessage(chatId, '🤖 *Ask me anything about Cha0smagick Labs!*\n\nExample: `/ask What app is best for tarot readings?`\n\nOr just type your question directly in the chat!', {
        parse_mode: 'Markdown',
        reply_to_message_id: msg.message_id,
      });
      return;
    }

    if (!GROQ_API_KEY) {
      bot.sendMessage(chatId, '⚠️ Groq AI is not configured. Please set GROQ_API_KEY in .env', { reply_to_message_id: msg.message_id });
      return;
    }

    try {
      // Show typing indicator
      bot.sendChatAction(chatId, 'typing');
      const answer = await askGroq(query, GROQ_API_KEY);
      bot.sendMessage(chatId, `🤖 *Cha0smagick AI:*\n\n${answer}`, {
        parse_mode: 'Markdown',
        disable_web_page_preview: false,
        reply_to_message_id: msg.message_id,
      });
    } catch (err) {
      console.error('❌ /ask error:', err.message);
      bot.sendMessage(chatId, '⚠️ Sorry, I had trouble processing your question. Please try again.', {
        reply_to_message_id: msg.message_id,
      });
    }
  });

  // ── /help ──
  bot.onText(/\/help/, (msg) => {
    const helpText = `*🤖 Cha0smagick Labs Bot — Help*\n\n` +
      `📱 *Commands:*\n` +
      `/menu — Main navigation\n` +
      `/apps — Browse Android apps\n` +
      `/books — Browse PDF books\n` +
      `/tools — Free online tools\n` +
      `/bundle — Books bundle (52% off)\n` +
      `/blog — Blog articles\n` +
      `/ask [question] — Ask AI anything about Cha0smagick Labs\n` +
      `/subscribe — Free Chaos Magick guide PDF\n` +
      `/website — Visit our site\n` +
      `/contact — Contact info\n\n` +
      `💡 *Tip:* You can also just type any question directly in the chat!`;
    bot.sendMessage(msg.chat.id, helpText, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    });
  });

  // ── Groq-connected auto-reply (groups + private chat) ──
  // Wire up the groqAsk helper in BRAIN
  BRAIN.helpers.groqAsk = askGroq;

  bot.on('message', async (msg) => {
    // Ignore commands (already handled above)
    if (msg.text && msg.text.startsWith('/')) return;
    // Ignore button handlers
    if (msg.text && (msg.text.startsWith('🌀') || msg.text.startsWith('📱') || msg.text.startsWith('📖') || msg.text.startsWith('🔧') || msg.text.startsWith('🎁') || msg.text.startsWith('📰'))) return;

    const query = msg.text || '';
    if (!query.trim()) return;

    // In groups: always try to auto-reply
    // In private chat: reply to any non-command message using smartReply
    const isGroup = msg.chat.type === 'group' || msg.chat.type === 'supergroup';

    if (isGroup || msg.chat.type === 'private') {
      const reply = await BRAIN.helpers.smartReply(query, GROQ_API_KEY);
      if (reply) {
        bot.sendMessage(msg.chat.id, reply, {
          parse_mode: 'Markdown',
          disable_web_page_preview: !query.includes('http'),
          reply_to_message_id: msg.message_id,
        });
      }
    }
  });

  // ── Error handling ──
  bot.on('polling_error', (err) => {
    console.error('⚠️ Telegram polling error:', err.message);
  });

  console.log(`✅ Telegram bot ready — channel: ${CHANNEL}`);
}

// ── Channel message poster (for future scheduled content) ──
async function postToChannel(text, options = {}) {
  if (!bot) throw new Error('Bot not initialized');
  try {
    const result = await bot.sendMessage(CHANNEL, text, {
      parse_mode: 'Markdown',
      disable_web_page_preview: options.noPreview || false,
      ...options,
    });
    console.log(`📢 Posted to channel: ${result.message_id}`);
    return result;
  } catch (err) {
    console.error('❌ Error posting to channel:', err.message);
    throw err;
  }
}

// Export for potential use by other scripts
module.exports = { init, postToChannel };

// Run if called directly
if (require.main === module) {
  init();
}
