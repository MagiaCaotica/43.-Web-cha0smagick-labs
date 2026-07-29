# Cha0smagick Labs Ecosystem — Complete Documentation

> Last Updated: July 29, 2026

---

## 1. Website (`cha0smagicklabs.com`)

### Architecture
- **Hosting**: GitHub Pages — static site
- **Domain**: cha0smagicklabs.com (GitHub Pages custom domain)
- **Stack**: Pure HTML5, CSS3, Vanilla JavaScript
- **Analytics**: GA4 (G-V6LHCPN9TK) + Google Ads conversion tracking
- **Affiliates**: `js/affiliate.js` captures `?ref=` params, stores 60-day cookie, fires GA4 events
- **Comments**: Giscus (GitHub Discussions) on all blog articles

### Site Structure
```
/
├── index.html              — Landing page
├── apps/                   — 11 Android app funnel pages
├── tools/                  — 10 free web tool pages
├── blog/                   — 190+ static HTML articles
│   └── index.html          — Blog hub (post cards with filters)
├── pages/                  — Books, about, contact, privacy
├── js/
│   ├── app-render.js       — Dynamic app page rendering
│   ├── apps-data.js        — All app/product data (1140 lines)
│   ├── affiliate.js        — Affiliate tracking system
│   ├── conversion.js       — Community CTA injection
│   └── app-render.min.js   — Minified renderer
├── assets/
│   ├── images/             — WebP + PNG product images
│   ├── css/                — style.css + fonts
│   └── pdf/                — Free lead magnet PDFs (EN + ES)
├── scripts/                — Node.js + PowerShell tooling
├── docs/                   — Documentation
└── sitemap.xml             — 176+ URLs
```

### SEO Features
- Schema.org Article + FAQPage on all blog posts
- Open Graph + Twitter Card meta tags
- Canonical URLs + hreflang (en)
- BreadcrumbList structured data
- JSON-LD SoftwareApplication schema for apps
- XML sitemap with priority + changefreq
- Already in Google Search Console

---

## 2. Blog Engine

### Generator
- **File**: `scripts/generate-articles.py` (1900+ lines)
- **Function**: `generate_article()` creates full HTML with schema, OG, breadcrumbs, FAQ
- **Template**: Critical CSS, GA4, nav, share buttons, Giscus comments
- **Process**: Article dicts → `write_article(slug, html)` → writes `blog/{slug}.html`

### Content Stats
- 190+ articles across 15+ topics
- 10 NOCTEM paranormal investigation articles (new)
- Topical clusters: sigil, tarot, zener, lucid, chaos, servitor, astral, rune, ouija, paranormal, lunar, divination, gps, ritual, astrology

### Cross-Linking
- **Script**: `scripts/add-cross-links.ps1` — 15 topical clusters, 35 articles interlinked
- Idempotent (skips already-injected), injects "More on [topic]" aside before `</main>`

---

## 3. Products

### Android Apps (11)
All one-time purchase (no subscriptions or in-app purchases):

| ID | Name | Price | Category |
|----|------|-------|----------|
| psi-gym | PSI GYM — Zener ESP Trainer | $3.99 | ESP Training |
| unofficial-rider-waite-tarot | Rider-Waite Tarot Complete | $9.99 | Divination |
| norse-rune-oracle | Norse Rune Oracle | $3.99 | Divination |
| dream-machine | Dream Machine | $3.99 | Lucid Dreaming |
| chaos-sigil-generator | Chaos Sigil Generator | $3.99 | Sigil Magic |
| astral-lab | Astral Lab | $3.99 | Astrology |
| arcana-goetia | Arcana Goetia | $3.99 | Goetia |
| noctem-tools | NOCTEM — Paranormal Suite | $14.99 | Paranormal |
| eerieroads | Eerie Roads | $9.99 | Paranormal |
| iching-oracle | I Ching Oracle | $3.99 | Divination |
| lunar-phase-calculator | Lunar Phase Calculator | $3.99 | Lunar Magic |

### PDF Books (7)
Via Hotmart:
- Codex Chaoticus ($4.99)
- Tarot Chaos ($9.99)
- Magical Servitors Manual ($4.99)
- Treatise of Chaos Hunter Runes ($4.99)
- Ouija Cazadora ($4.99)
- Liber Lvpinux ($4.99)
- Mind The Gap ($9.99)
- **Bundle**: $19.99 (52% off)

### Free Web Tools (10)
Sigil Generator, I Ching Oracle, Rune Oracle, Lunar Phase Calculator, Spell Builder, Astrology Calculator, Candle Color Calculator, Pendulum, Tengwar Transcriber, Servitor Activator

---

## 4. Telegram Bot (@cha0smagicklabs)

### Commands
| Command | Description |
|---------|-------------|
| `/start` | Welcome message with keyboard |
| `/menu` | Main product menu |
| `/apps` | List all Android apps with prices |
| `/books` | List all PDF books with prices |
| `/tools` | Free web tools |
| `/bundle` | Books bundle info ($19.99) |
| `/blog` | Recent articles |
| `/subscribe` | MailerLite EN form |
| `/website` | Link to cha0smagicklabs.com |
| `/contact` | Contact info + social links |
| `/help` | All commands |
| `/ask [question]` | Groq AI Q&A about products |

### Features
- Polling mode (no webhooks needed)
- Inline keyboard for navigation
- Auto-reply in groups (keyword + Groq fallback)
- Channel posting (bot posts to @cha0smagicklabs)

### Channel
- @cha0smagicklabs — public, for announcements
- Group: private forum with topics (ID: -1003559339441)

---

## 5. Discord Bot (Cha0smagick LABS#5507)

### Slash Commands
| Command | Description |
|---------|-------------|
| `/menu` | Welcome + main menu |
| `/apps` | List apps with embeds (purple) |
| `/books` | List books with embeds (gold) |
| `/tools` | Free tools (green) |
| `/bundle` | Bundle info |
| `/blog` | Recent articles |
| `/subscribe` | MailerLite link |
| `/website` | Site link |
| `/contact` | Social links |
| `/pricing` | All prices in one embed |
| `/ask question:` | Groq AI Q&A |

### Features
- Rich embeds per product type
- Welcome message on member join
- Auto-reply in general/resources channels
- 10 slash commands registered globally

### Server
- Invite: discord.gg/PSfn26xqgD
- Channels: #general, #news, #resources, #products, etc.

---

## 6. Groq AI Integration

### Module: `scripts/groq-ai.js`
- **Model**: `llama-3.3-70b-versatile` (via Groq API)
- **System Prompt**: Full Cha0smagick Labs catalog (11 apps, 7 books, 10 tools, bundle, blog, social)
- **Languages**: English + Spanish (auto-detects)
- **BTL Sales**: Built-in soft-sell strategy with product recommendations
- **Smart Reply**: `smartReply()` in bot-brain.js — keyword match first (instant), Groq fallback for complex questions

### Files
- `scripts/groq-ai.js` — Groq client + system prompt
- `scripts/bot-brain.js` — `smartReply()` helper wired to both bots
- `scripts/_test-groq.js` — Test script (4 tests passed)
- `docs/bot-ecosystem.md` — Bot architecture docs

---

## 7. Social Media

### X/Twitter (@Cha0smagickLABS)
- **Campaign**: 30 tweets from TWEET_CALENDAR (`scripts/social-publish.js` lines 47-111)
- **Account**: @Cha0smagickLABS (Google OAuth via Playwright)
- **Posting pattern**: x.com/home → execCommand('insertText') → force-click tweetButtonInline
- **Mix**: App promos, educational, engagement questions, philosophical quotes
- **All URLs** → cha0smagicklabs.com funnel pages

### Pinterest
- 137 pins uploaded (confirmed by user)
- Pins link to cha0smagicklabs.com pages

---

## 8. MailerLite

### Accounts
- Email: magiacaoticapractica@gmail.com
- Plan: Free tier (14-day trial, 1k subscribers)

### Workflows
| Workflow | Status | Emails |
|----------|--------|--------|
| ES Lead Magnet - Guia Magia Caos | Active | 1 email (PDF welcome) |
| EN Lead Magnet - Chaos Magick Guide | Active | 1 email (PDF welcome, 1 completed) |

### Forms
- ES form: Leads via site (group: "Lead Magnet - Magia del Caos ES")
- EN form: Leads via site
- Both embedded on website

**Verdict**: Automations trigger on form submit. 0 ES subscribers, 2 total subscribers. PDFs send automatically.

---

## 9. Outreach (23+ Contacts)

### Direct Email (Gmail)
1. Occult World — Resource Suggestion ✅
2. Hermetic Library — Open Access Resource ✅
3. Lucky Mojo — Guest Post GRATIS (Spanish) ✅
4. Mage By Default — Resource Suggestion ✅
5. Digital Occult Library — Resource Suggestion ✅
6. Learn Religions — Resource Suggestion ✅
7. Morrigan's Workshop — Collaboration ✅
8. Bad Witch — Guest Post ✅
9. Notebook Witch — Resource Suggestion ✅
10. Goddess Has Your Back — Guest Post ✅
11. New World Witchery — Guest Post ✅
12. Cottage Witch Apothecary — Resource Suggestion ✅
13. Phoenyx Midnight — Guest Post ✅
14. Sinister Coffee — Collaboration ✅
15. Strange Phenomenon — Resource ✅
16. Boise Ghost — Resource ✅
17. Occultist — Guest Post (Spanish) ✅
18. Order of Dark Arts — Guest Post (English) ✅
19. Occult Bhagvat Blog — Resource Suggestion (Spanish) ✅
20. School of Occult Science — Resource Suggestion (English) ✅

### Contact Forms
21. Rune Soup — Guest Post pitch ✅
22. The Hoodwitch — Guest Post pitch ✅
23. Esoteric Library — Resource suggestion ✅
24. Paranormal Daily News — Email fallback ✅

### Data Sources
- FeedSpot 40 Occult Blogs → 24 with emails
- FeedSpot 60 Witchcraft Blogs → 51 URLs scraped
- FeedSpot 70 Paranormal Blogs → 61 URLs scraped
- FeedSpot 35 Metaphysical Blogs → 33 URLs scraped

---

## 10. Tracking & Analytics

### Current
- **Google Analytics** (GA4): G-V6LHCPN9TK — installed on all pages
- **Google Ads**: Conversion tracking in GTAG
- **Google Consent Mode v2**: Basic implementation (default deny)

### Pending
- **Meta Pixel**: Placeholder ID "000000000000000" in GTAG block — needs real Pixel from business.facebook.com/events-manager

---

## 11. Infrastructure

### Hosting
- GitHub Pages (free)
- Custom domain: cha0smagicklabs.com
- Auto-deploys via git push

### Secrets Management
- `.env` in `.gitignore` — never committed
- `.env.example` with placeholders for sharing
- Previous secret leak cleaned (Discord token + Groq key removed from tracking)

### File Structure
```
.gitignore           — .env, .firecrawl, .playwright-mcp, .omo ignored
.env                 — Local secrets (not tracked)
docs/                — All documentation
.firecrawl/          — Scraped data (gitignored)
.playwright-mcp/     — Browser automation artifacts (gitignored)
.omo/                — OpenCode continuation data (gitignored)
```

---

## 12. Key Automation Scripts

| Script | Language | What It Does |
|--------|----------|-------------|
| `scripts/generate-articles.py` | Python | Generates blog HTML articles with SEO |
| `scripts/add-cross-links.ps1` | PowerShell | Injects related articles into blog posts |
| `scripts/add-giscus-to-articles.ps1` | PowerShell | Injects Giscus comments into all articles |
| `scripts/share-noctem-news.js` | Node.js | Shares blog posts to Telegram + Discord |
| `scripts/telegram-bot.js` | Node.js | Telegram bot with 11 commands + Groq |
| `scripts/discord-bot.js` | Node.js | Discord bot with 10 slash commands + Groq |
| `scripts/groq-ai.js` | Node.js | Groq AI Q&A module |
| `scripts/bot-brain.js` | Node.js | Shared product knowledge base |
| `scripts/run-bots.js` | Node.js | Bot launcher (telegram/discord/all) |
| `scripts/generate-noctem-articles.py` | Python | Generated 10 NOCTEM blog posts |
| `scripts/social-publish.js` | Node.js | X/Twitter + Pinterest calendar |

---

## 13. Remaining Work

### Short-term (User Action)
1. **Meta Pixel**: Create at business.facebook.com/events-manager → replace "000000000000000"
2. **Email Monetization**: Log into MailerLite, create emails 2-5 in EN workflow
3. **Giscus**: Install GitHub App (done) → comments active on all 206 articles

### Medium-term
4. **Discord/Telegram Community Growth** — promote invites
5. **Deep Content Strategy** — content hub expansion
6. **Google Search Console** — submit sitemap (already added)

### Future Phases
7. YouTube channel / podcast
8. Paid advertising (Google Ads + Meta)
9. Cross-promotion with contacted blogs
10. Automated content repurposing (blog → social → video)

---

*Documentation generated by Sisyphus — July 2026*
