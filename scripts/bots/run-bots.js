/**
 * run-bots.js — Start Telegram and/or Discord bots
 * 
 * Usage:
 *   node scripts/run-bots.js telegram   # Only Telegram
 *   node scripts/run-bots.js discord    # Only Discord
 *   node scripts/run-bots.js all        # Both (default)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });

// Error tracking → Sentry/GlitchTip (3.1.7): global handlers + optional DSN reporting
const { initErrorTracking } = require('./error-tracker');

const mode = process.argv[2] || 'all';

async function main() {
  initErrorTracking();

  if (mode === 'all' || mode === 'telegram') {
    console.log('🌀 Starting Telegram bot...');
    try {
      const telegramBot = require('./telegram-bot');
      telegramBot.init();
    } catch (err) {
      console.error('❌ Telegram bot error:', err.message);
    }
  }

  if (mode === 'all' || mode === 'discord') {
    console.log('🎮 Starting Discord bot...');
    try {
      const discordBot = require('./discord-bot');
      discordBot.init();
    } catch (err) {
      console.error('❌ Discord bot error:', err.message);
    }
  }

  if (mode === 'all') {
    console.log('✅ Both bots starting. Press Ctrl+C to stop.');
  }
}

main().catch(console.error);
