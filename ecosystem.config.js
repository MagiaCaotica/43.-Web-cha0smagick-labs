// PM2 ecosystem config — plan 3.1.4
// Both bots with auto-restart and timestamps. Log rotation: install
// `pm2 install pm2-logrotate` on the host (documents in docs/bot-deployment.md).
module.exports = {
  apps: [
    {
      name: 'chaos-telegram-bot',
      script: 'scripts/bots/telegram-bot.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      out_file: './logs/telegram-out.log',
      error_file: './logs/telegram-err.log',
      merge_logs: true,
      time: true,
    },
    {
      name: 'chaos-discord-bot',
      script: 'scripts/bots/discord-bot.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      out_file: './logs/discord-out.log',
      error_file: './logs/discord-err.log',
      merge_logs: true,
      time: true,
    },
  ],
};
