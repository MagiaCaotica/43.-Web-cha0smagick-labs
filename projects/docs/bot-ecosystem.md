# Cha0smagick Labs — Bot Ecosystem

> **Last updated**: 2026-07-29
> **Status**: Both bots running 24/7 via `node scripts/run-bots.js all`

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    bot-brain.js (Shared KB)                   │
│  • Product catalog (10 apps, 7 books, 10 tools, 134+ blog)   │
│  • Social links, MailerLite forms, outreach templates         │
│  • ###.helpers.autoReply() + ###.helpers.smartReply()         │
│  • Wired to groq-ai.js for intelligent Q&A                   │
└──────────────┬──────────────────────────────┬────────────────┘
               │                              │
     ┌─────────▼──────────┐       ┌──────────▼───────────┐
     │  telegram-bot.js    │       │   discord-bot.js     │
     │  (node-telegram-    │       │   (discord.js v14)   │
     │   bot-api)          │       │                      │
     │                     │       │                      │
     │  • 12 commands       │       │  • 11 slash commands │
     │  • Keyboard buttons  │       │  • Rich embeds       │
     │  • Group auto-reply  │       │  • Welcome messages  │
     │  • Channel posting   │       │  • Channel auto-reply│
     │  • Groq /ask AI      │       │  • Groq /ask AI      │
     └─────────┬───────────┘       └──────────┬────────────┘
               │                              │
               └──────────┬───────────────────┘
                          │
               ┌──────────▼───────────┐
               │    groq-ai.js         │
               │  (Groq API client)    │
               │                       │
               │  POST → api.groq.com  │
               │  Model: llama3-70b    │
               │  System prompt: full  │
               │  Cha0smagick catalog  │
               └──────────────────────┘
```

## 2. File Manifest

| File | Purpose |
|------|---------|
| `scripts/groq-ai.js` | Groq API client — `askGroq(query, apiKey)` → AI response. System prompt has full product catalog. Handles ES/EN, BTL sales optimization. |
| `scripts/bot-brain.js` | Shared knowledge base. Product data, helpers, **.smartReply()** (keyword → Groq fallback), 3 outreach templates. |
| `scripts/telegram-bot.js` | Telegram bot. 12 commands: /menu, /apps, /books, /tools, /bundle, /blog, /ask, /subscribe, /website, /contact, /help, /pricing. Keyboard buttons. Group auto-reply with Groq. |
| `scripts/discord-bot.js` | Discord bot. 11 slash commands. Rich embeds (purple=apps, gold=books, green=tools). Welcome messages. Channel auto-reply with Groq. |
| `scripts/run-bots.js` | Runner: `node scripts/run-bots.js telegram|discord|all` |
| `.env` | All credentials (Telegram, Discord, Groq) |
| `.env.example` | Template for new devs |

## 3. Commands Reference

### Telegram Bot (@cha0smagicklabs)

| Command | Description |
|---------|-------------|
| `/start` | Welcome + keyboard menu |
| `/menu` or 🌀 Menu | Main navigation |
| `/apps` or 📱 Apps | All 10 Android apps with prices |
| `/books` or 📖 Books | 7 PDF books with prices |
| `/tools` or 🔧 Tools | 10 free online tools |
| `/bundle` or 🎁 Bundle | Books bundle (52% off) |
| `/blog` or 📰 Blog | Blog categories |
| `/ask [question]` | Ask AI anything about Cha0smagick Labs |
| `/subscribe` | Free Chaos Magick PDF guide |
| `/website` | Site link |
| `/contact` | All social links |
| `/help` | Full command list |

### Discord Bot (Cha0smagick LABS#5507)

| Slash Command | Description |
|---------------|-------------|
| `/menu` | Main navigation |
| `/apps` | All apps with rich embeds |
| `/books` | All books with rich embeds |
| `/tools` | Free tools with rich embeds |
| `/bundle` | Bundle deal with embed |
| `/blog` | Blog categories |
| `/ask question:` | Ask AI anything |
| `/subscribe` | Free PDF guide |
| `/website` | Site link |
| `/contact` | Contact info |
| `/pricing` | Pricing summary |

## 4. Groq AI Integration

**API Key**: gsk_your_groq_api_key_here

**Model**: `llama3-70b-8192` (via Groq — fastest LLM inference)

**System Prompt**: 500+ lines covering:
- Complete product catalog (apps, books, tools, bundle)
- Pricing and URLs
- Social channels and contact
- BTL sales strategy (listen → recommend → value → CTA)
- Multi-language support (ES ↔ EN)

**Smart Reply Flow**:
1. User sends message → `smartReply(query, apiKey)`
2. Try keyword match first (`autoReply`) — instant, no API call
3. If no keyword match → call `askGroq(query, apiKey)` → Groq API
4. Return AI response or null

**Cost**: Free tier (Groq gives ~30 req/min on llama3-70b). ~500K credits remaining.

## 5. BTL Sales Strategy

Both bots implement BTL (Below The Line) sales:

1. **Listen**: Bot analyzes what the user asks about:
   - Tarot → recommend Rider-Waite Tarot app
   - Runes → recommend Norse Rune Oracle + free rune tool
   - Sigils → recommend Chaos Sigil Generator + free sigil tool
   - Dreams → recommend Dream Machine
   - Goetia → recommend Arcana Goetia
   - Astrology → recommend Astral Lab
   - Paranormal → recommend Eerie Roads
   - Books → show catalog + push bundle

2. **Value pitch**: Always mention "One-time purchase. No subscriptions. Ever."

3. **CTA**: Direct link to product page or free tool

4. **Follow-up**: Groq AI handles complex questions (comparisons, recommendations for beginners, etc.)

## 6. How to Run

```bash
# From project root:
node scripts/run-bots.js all          # Both bots
node scripts/run-bots.js telegram     # Telegram only
node scripts/run-bots.js discord      # Discord only

# Individual (for testing):
node scripts/telegram-bot.js
node scripts/discord-bot.js
```

## 7. Environment Variables

```env
# ── Telegram ──
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL=@cha0smagicklabs
TELEGRAM_GROUP_INVITE=https://t.me/+...

# ── Discord ──
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
DISCORD_BOT_TOKEN=...

# ── Groq AI ──
GROQ_API_KEY=gsk_...
```

## 8. Dependencies

- `node-telegram-bot-api` — Telegram polling bot
- `discord.js` (v14) — Discord bot with slash commands
- `dotenv` — Environment variable loading
- `groq-ai.js` — Custom module (uses native `fetch`, no extra deps)

## 9. Next Steps / Roadmap

- [ ] **Scheduled channel posts**: Auto-post daily occult content to Telegram channel
- [ ] **Analytics tracking**: Log which products users ask about most
- [ ] **Multi-turn conversation**: Maintain chat history in Groq for context
- [ ] **Webhook mode**: Switch Telegram to webhook (requires HTTPS)
- [ ] **Payment integration**: Stripe/PayPal links directly in bot
- [ ] **Auto-reply training**: Fine-tune Groq on specific FAQ patterns
