# Cha0smagick Labs 🔮

**Occult Android apps, esoteric PDF books, free web tools, and a 190+ article occult library.**

Static site (HTML/CSS/JS) — GitHub Pages — [cha0smagicklabs.com](https://cha0smagicklabs.com)

## 🚀 Stack

| Layer | Technology |
|-------|-----------|
| Hosting | GitHub Pages (static) |
| Frontend | HTML5, CSS3, Vanilla JS |
| Blog Engine | Python (`generate-articles.py`) — 190+ static HTML articles |
| Analytics | Google Analytics (G-V6LHCPN9TK) + Google Ads Conversion |
| Email | MailerLite (EN + ES lead magnet workflows) |
| Affiliates | `js/affiliate.js` — URL param capture + GA4 events |
| Comments | Giscus (GitHub Discussions) on all blog articles |
| Meta Pixel | Placeholder (needs real Pixel ID) |

## 📦 Products

### Android Apps (11) — $3.99 to $14.99 — One-time purchase (no subs)

| App | Price | Funnel |
|-----|-------|--------|
| PSI GYM — Zener ESP Trainer | $3.99 | [Apps](https://cha0smagicklabs.com/apps/psi-gym.html) |
| Rider-Waite Tarot Complete | $9.99 | [Apps](https://cha0smagicklabs.com/apps/unofficial-rider-waite-tarot.html) |
| Norse Rune Oracle | $3.99 | [Apps](https://cha0smagicklabs.com/apps/norse-rune-oracle.html) |
| Dream Machine | $3.99 | [Apps](https://cha0smagicklabs.com/apps/dream-machine.html) |
| Chaos Sigil Generator | $3.99 | [Apps](https://cha0smagicklabs.com/apps/chaos-sigil-generator.html) |
| Astral Lab | $3.99 | [Apps](https://cha0smagicklabs.com/apps/astral-lab.html) |
| Arcana Goetia | $3.99 | [Apps](https://cha0smagicklabs.com/apps/arcana-goetia.html) |
| NOCTEM — Paranormal Suite | $14.99 | [Apps](https://cha0smagicklabs.com/apps/noctem-tools.html) |
| Eerie Roads | $9.99 | [Apps](https://cha0smagicklabs.com/apps/eerieroads.html) |
| I Ching Oracle | $3.99 | [Apps](https://cha0smagicklabs.com/apps/iching-oracle.html) |
| Lunar Phase Calculator | $3.99 | [Apps](https://cha0smagicklabs.com/apps/lunar-phase-calculator.html) |

### PDF Books (7) — $4.99 to $9.99 — Hotmart
Bundle $19.99 (52% off) — [Buy](https://pay.hotmart.com/D93257466P)

### Free Web Tools (10)
Sigil Generator, I Ching Oracle, Rune Oracle, Lunar Phase Calculator, Spell Builder, Astrology Calculator (Astral Lab Web), Candle Color Calculator, Pendulum, Tengwar Transcriber, Servitor Activator

## 🤖 Bots

| Bot | Platform | Features |
|-----|----------|----------|
| @cha0smagicklabs | Telegram | 11 commands + /ask with Groq AI, auto-reply |
| Cha0smagick LABS#5507 | Discord | 10 slash commands + /ask, rich embeds, auto-reply |

**Stack**: Node.js, `node-telegram-bot-api`, `discord.js` v14, Groq AI (`llama-3.3-70b-versatile`)

**Run**: `node scripts/run-bots.js [telegram|discord|all]`

## 📈 Social

| Channel | Handle | Status |
|---------|--------|--------|
| X/Twitter | @Cha0smagickLABS | 30 tweets posted (campaign complete) |
| Telegram Channel | @cha0smagicklabs | Active, auto-posting |
| Telegram Group | [Join](https://t.me/+krfQJgro4hBkNTE5) | Active (forum) |
| Discord | [Join](https://discord.gg/PSfn26xqgD) | Active |
| Pinterest | Cha0smagick Labs | 137 pins uploaded |

## 📚 Outreach

**23+ contacts reached** via direct email + contact forms. Master list: `docs/outreach-contacts-master.md`

**Process**: Scraped 145+ occult/witchcraft/paranormal blogs → Found emails via Firecrawl → Sent Guest Post, Resource Suggestion, and Collaboration pitches.

## 🔧 Key Scripts

| Script | Purpose |
|--------|---------|
| `scripts/generate-articles.py` | Blog article generator (190+ articles) |
| `scripts/bot-brain.js` | Shared catalog knowledge base for bots |
| `scripts/groq-ai.js` | Groq-powered Q&A module |
| `scripts/telegram-bot.js` | Telegram bot (polling, 11 commands) |
| `scripts/discord-bot.js` | Discord bot (slash commands, rich embeds) |
| `scripts/run-bots.js` | Bot runner (telegram/discord/all) |
| `scripts/add-cross-links.ps1` | Inject topical cross-links (35 articles modified) |
| `scripts/add-giscus-to-articles.ps1` | Inject Giscus comments into all 206 articles |
| `scripts/share-noctem-news.js` | Share NOCTEM posts to Telegram + Discord |
| `scripts/social-publish.js` | X/Twitter + Pinterest post calendar |
| `js/affiliate.js` | Affiliate tracking (?ref= param + GA4 events) |
| `js/conversion.js` | Community CTA injection (Telegram/Discord buttons) |

## 🗺️ Sitemap

`sitemap.xml` — 176+ URLs covering all pages, apps, tools, and blog articles.

## 📋 Strategic Plan Status

Based on `docs/strategic-sales-audit.md`:

| Phase | Status |
|-------|--------|
| ✅ Pinterest (137 pins) | Complete |
| ✅ X/Twitter (30 tweets) | Complete |
| ✅ Bots (Telegram + Discord + Groq) | Complete |
| ✅ Outreach (23+ contacts) | Complete |
| ✅ Blog NOCTEM (10 SEO articles) | Complete |
| ✅ Giscus comments (206 articles) | Complete |
| ✅ Community Nav + Footer | Complete |
| ✅ Interlinking (35 articles) | Complete |
| ✅ Affiliate System | Complete |
| 🔲 Email Monetization (MailerLite emails 2-5) | Pending — needs dashboard setup |
| 🔲 Meta Pixel | Pending — needs real Pixel ID |
| 🔲 Deep Content Strategy | Next phase |

## 🔑 Environment

Copy `.env.example` → `.env` and set:
- `TELEGRAM_BOT_TOKEN` — Telegram bot token
- `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` / `DISCORD_BOT_TOKEN` — Discord app
- `GROQ_API_KEY` — Groq AI (free tier available)
- `FIRECRAWL_API_KEY` — Web scraping (optional)

---

Built by Sisyphus — OhMyOpenCode
