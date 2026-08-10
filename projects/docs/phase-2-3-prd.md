# Phase 2 & 3 PRD — cha0smagicklabs.com

**Objective:** Build automated marketing infrastructure on top of Phase 1 email capture
**Target:** $500/6mo → $5000/6mo through email-driven sales of Android apps + PDF books

---

## Phase 2: Marketing Automation (Formspree → Kit → Email Funnels)

### 2.1 Architecture (Simplified — No Middleware)

```
Kit native form (embedded in index.html hero)
    ↓ (Kit handles everything internally)
Kit Automation → auto-reply (lead magnet PDF) → welcome sequence → promos
```

**Why this works without webhooks:** Kit (ConvertKit) free tier includes native forms with embeddable HTML. When a user subscribes, Kit automatically sends the lead magnet PDF (hosted in Kit Library), tags the subscriber, and triggers automations. **Zero middleware, zero Zapier, zero cost.**

**Why Kit:** Creator-focused email platform built for selling digital products. Free tier: 1,000 subscribers, unlimited broadcasts, visual automations, native forms, landing pages, and file hosting. Tags → sequences → purchase links = ideal for our funnel.

### 2.2 Implementation Steps

| # | Step | Detail | Effort |
|---|------|--------|--------|
| 1 | Create Kit account | Free tier (1K subs) at kit.com | 15 min |
| 2 | Create subscriber tags | `en-subscriber`, `es-subscriber`, `lead-magnet-sent`, `app-buyer`, `book-buyer` | 10 min |
| 3 | Upload lead magnets to Kit Library | Hosts PDFs natively; Kit generates download links for auto-reply | 30 min |
| 4 | Create Kit form (EN) | Embedded form with email field + hidden tag `en-subscriber`. Style matches site. | 30 min |
| 5 | Create Kit form (ES) | Same, tag `es-subscriber` | 30 min |
| 6 | Build Welcome Email Sequence | See 2.3 below. Kit auto-reply sends lead magnet immediately. | 2 hr |
| 7 | Build App Promotion Sequence | Drip: Day 3 → Day 7 → Day 14 app features | 2 hr |
| 8 | Build Spanish parallel sequence | Same structure, ES content | 2 hr |
| 9 | Replace Formspree with Kit form | Update index.html hero form embed to Kit's HTML snippet | 15 min |
| 10 | Analytics / UTM tracking | Link tracking in Kit for click/open/buy rates | 30 min |

**Total Phase 2: ~7 hr setup, ~$0/mo (free tier). No middleware needed.**

### 2.3 Welcome Sequence (automated, bilingual)

| Email | Send Delay | Content | Goal |
|-------|-----------|---------|------|
| #0 (auto-reply) | Instant | "Here's your Quickstart Guide" + download link + brief intro to cha0smagick | Deliver lead magnet |
| #1 | Day 1 | "Welcome to the Occult Underground" — founder story, what you can expect | Build rapport |
| #2 | Day 3 | "Your 3 Free Tools to Start Today" — link sigil-generator, viking-runes, digital-pendulum (/tools/) | Product education (free) |
| #3 | Day 7 | "The App That Started It All" — PSI GYM story, feature deep-dive, Play Store CTA | Sales (low price) |
| #4 | Day 14 | "Why I Wrote the Magical Servitors Manual" — book value prop, Hotmart link | Sales (book) |
| #5 | Day 30 | "The Complete Collection — All 11 Apps" — app catalog overview, bundle framing | Catalog sales |

### 2.4 Lead Magnet Hosting Strategy

**Option A (Recommended):** Upload PDFs to Kit (ConvertKit) Library. Kit hosts files, auto-reply emails include download links, Kit tracks downloads. **Free.**

**Option B (Alternative):** GitHub releases + raw link. Works but Kit's native library is simpler and gives download analytics.

**After Kit integration:** Update `index.html` Formspree to include hidden fields mapping form language to Kit tags: `<input type="hidden" name="_tag" value="en-subscriber">`. Remove the `_redirect` hack once Kit API integration is live.

---

## Phase 3: Blog CTA Optimization + Social Landing Pages

### 3.1 Blog CTA Strategy

**Current state:** 150+ blog articles, inline CTA boxes linking to apps, but no email capture on any article.

**Audit all articles → classify into CTA tiers:**

| Tier | Articles | CTA Strategy |
|------|----------|-------------|
| **High-value** (3,000+ words, evergreen) | ~15-20 | Mid-article email capture + end-of-article product pitch |
| **Medium** (1,000-3,000 words, good quality) | ~60 | End-of-article related product + optional email form |
| **AI-slop** (< 1,000 words) | ~111 | Keep as SEO fodder. Add automated bottom CTA only. No email capture. |

### 3.2 Blog CTA Implementation

**Inline CTA box template** (adds to relevant existing articles):

```html
<div class="cta-box">
  <h3>✨ Master [Topic] with Our App</h3>
  <p>Cha0smagick Labs turns [topic-theory] into a practical Android tool.</p>
  <div class="cta-actions">
    <a href="[play-store-link]" class="cta-button">Get the App</a>
    <a href="#email-section" class="cta-secondary">Get Free Guide</a>
  </div>
</div>
```

**New bottom-of-article email capture:**

```html
<section class="article-email-capture">
  <h3>📩 Want More Occult Knowledge?</h3>
  <p>Get weekly insights, free tools, and exclusive offers.</p>
  <form action="https://formspree.io/f/xnjewopa" method="POST">
    <input type="email" name="email" placeholder="Your email" required>
    <input type="hidden" name="_tag" value="blog-subscriber">
    <button type="submit">Subscribe Free</button>
  </form>
  <p class="fine-print">No spam. Unsubscribe anytime.</p>
</section>
```

**Priority articles for CTA insertion** (highest traffic/content quality):

1. /blog/everything-is-a-servitor.html (cornerstone concept → PSI GYM)
2. /blog/chaos-magick-divination-protocol-mindfulness.html → Norse Rune Oracle
3. /blog/divine-coincidences-statistical-vs-magical.html → I Ching Oracle
4. /blog/digital-grimoires-ai-prompt-preservation.html → Arcana Goetia
5. All /blog/chaos-magick-* series → relevant apps

### 3.3 Social Landing Pages

**Problem:** Social media posts link to homepage with no clear next step. Need landing pages optimized for:
- Instagram/TikTok bio link (one link to rule them all)
- X/Twitter pinned post
- Facebook/Reddit share targets

**Single link-in-bio page: `/landing/`**

A single, clean mobile-optimized page with:
1. Hero: "The Complete Occult Collection" + email capture
2. App grid (11 apps, Play Store badges)
3. Book grid (7 books, Hotmart links)
4. "Free Tools" section (10 web tools)
5. Blog showcase (5 cornerstone articles)
6. Footer with social links

**Campaign landing pages (future):**

| Page | Traffic Source | CTA |
|------|---------------|-----|
| `/landing/psigym/` | Social ad / post | App download + email |
| `/landing/servitors/` | Blog internal link | Email (lead magnet) → book sale |
| `/landing/magical-tools/` | Social bio | App catalog browse |
| `/landing/tarot-chaos/` | Tarot-related content | Tarot app + book |

### 3.4 Social Content Calendar (Weekly)

| Day | Platform | Content Type | Link Target |
|-----|----------|-------------|-------------|
| Mon | Instagram | Tool demo reel (30s, sigil-generator) | /landing/ |
| Tue | X/Twitter | Thread: "3 ways X app changed my practice" | Play Store app page |
| Wed | TikTok | Behind-the-scenes: building an occult app | /landing/ |
| Thu | Instagram | Book highlight (1 book, aesthetics) | Hotmart link |
| Fri | X/Twitter | Free tool feature (viking-runes) | /tools/ |
| Sat | All | Micro-review quote from Play Store | /landing/ |

### 3.5 Implementation Priority

| # | Task | Dependency | Effort |
|---|------|-----------|--------|
| 1 | Create `/landing/` link-in-bio page | None | 2 hr |
| 2 | Insert CTAs into top 5 cornerstone articles | Phase 1 CSS (done) | 2 hr |
| 3 | Create bottom-of-article email capture snippet | Phase 1 Formspree (done) | 1 hr |
| 4 | Set up social accounts with consistent bios → /landing/ | #1 | 1 hr |
| 5 | Insert CTAs into next 10 high-value articles | #3 | 3 hr |
| 6 | Set up Bitly / UTMs for trackable links | None | 30 min |
| 7 | Create first 4 weeks of social content | #1, #4 | 4 hr |

---

## Combined Timeline

```
Week 1: Phase 2 (Kit setup, webhook, welcome sequence)
Week 2: Phase 3 (Landing page, top 5 CTAs, social setup)
Week 3: Phase 2 (Drip sequences, ES parallel)
Week 4: Phase 3 (Remaining CTAs, content calendar launch)
```

## Success Metrics

| Metric | Current | Goal (6mo) | How to Measure |
|--------|---------|-----------|----------------|
| Email subscribers | 0 | 1,000 | Kit dashboard |
| Email open rate | — | >30% | Kit dashboard |
| Email click rate | — | >5% | Kit dashboard |
| Blog-to-email conversion | 0% | 2% | GA4 events |
| Social → landing page traffic | Minimal | 500/mo | GA4 referrals |
| App sales (Google Play) | ~$83/mo | $300/mo | Play Console |
| Book sales (Hotmart) | Minimal | $200/mo | Hotmart dashboard |
| Total revenue/6mo | $500 | $5,000 | Play Console + Hotmart |
