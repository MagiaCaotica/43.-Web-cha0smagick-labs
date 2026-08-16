# MASSIVE APP SALES — Execution Plan (atomic checklist)

> Goal: mass sales of the 11 premium Android apps (one-time payment, $3.99–$14.99, ZERO subscriptions/ads).
> Status source of truth: this file. Mark each item `[x]` atomically when done.
> Builder: `python scripts/build_10_articles.py` (data-driven, 0% hardcoded HTML).
> Article schema: slug/title/index_title/desc(≤160)/keywords/og_alt/date_iso 2026-08-16/date_display 'August 16, 2026'/lastmod/read_min/category/excerpt/cta_apps/related(4 [slug,Title] via `from related_titles import RELATED_TITLES as RT`)/references(3)/howto(4-6)/toc/sections({t:p|h2|h3|ul|ol|table — table uses headers+rows})/faq(3).
> One article per Write call (25KB truncation limit). Wire new lists into build_10_articles.py before building.

---

## ✅ COMPLETED SO FAR

- [x] **Audit 10 original articles** (structure 15/14 checks PASS, zero AI slop, desc fix applied)
- [x] **Fix 9 over-length descriptions** (≤160 in data files + HTML)
- [x] **20 new articles (11-30)** written, built, verified: 30/30 files, index cards 30/30, sitemap 746 lines, desc≤160, zero slop, no dead links
- [x] **This plan file** persisted for balance-safe resume

## 📦 Current asset inventory

- 279 existing blog articles + 30 new = 309 posts; sitemap.xml = 746 lines
- 11 apps: PSI GYM $3.99 · Rider-Waite Tarot $9.99 · Norse Rune Oracle $3.99 · Dream Machine $3.99 · Chaos Sigil Generator $3.99 · Astral Lab $3.99 · Arcana Goetia $3.99 · NOCTEM $14.99 · Eerie Roads $9.99 · I Ching Oracle $3.99 · Lunar Phase Calculator $3.99
- 10 free web tools (traffic magnets) · 7 PDF books (Hotmart) · GA4 G-V6LHCPN9TK · affiliate.js (?ref=) · Giscus · MailerLite EN/ES
- Files: scripts/build_10_articles.py · articles_a/b/c/d/e/f.py · article_11..30.py · related_titles.py · fix_desc_lengths(_2).py · fix_related_links.py

---

## 1. The 6 Psychological Angles

| Angle | Reader feeling | Article type | Apps |
|---|---|---|---|
| Need | "I need an answer NOW" | Quick-result guides, tool→app bridge | All, esp. I Ching/Runes/Tarot/Lunar |
| Dreams/Hope | "I could become psychic/lucid/wealthy" | Transformation journeys, 30-day experiments | PSI GYM, Dream Machine, Astral Lab, Sigil, Lucid Dream |
| Fears | "Is my house haunted? Is Goetia dangerous?" | Safe-handling + curiosity content | Eerie Roads, NOCTEM, Arcana Goetia |
| Economic | "I can't pay $15/month" | Price-anchoring, one-time vs subscription | ALL (strongest untapped) |
| Identity | "I'm a witch/chaos magician/psychonaut" | Lifestyle + identity content | All |
| Curiosity/Urgency | "What's happening Friday?" | Seasonal/calendar (new moon, eclipse, Halloween, retrograde) | Lunar, Eerie Roads, Sigil, Tarot |

---

## 2. Funnel Architecture — 120 new articles in 3 waves

### WAVE A — BOFU Sales Content (40) — SELLS FASTEST — DO FIRST

**Batch A1 (10) — comparison + price-anchoring (monetize fastest):**
- [x] A31. `dream-machine-vs-awoken-comparison` → dream-machine — "Dream Machine vs Awoken (2026): Which Lucid Dreaming App Wins?" (kw: dream machine vs awoken, awoken alternative, best lucid dreaming app comparison; feature table, price table, verdict, migration guide; related: dream-machine-app-review, best-lucid-dreaming-apps-android-2026, best-offline-lucid-dreaming-app-2026, how-to-lucid-dream-tonight)
- [x] A32. `psi-gym-vs-free-zener-test` → psi-gym — "PSI GYM vs Free Online Zener Tests (2026): Why Scoring Matters" (kw: psi gym vs free, zener test accuracy, ESP trainer comparison; related: psi-gym-app-review, zener-cards-esp-training-guide, zener-card-test-score-meaning, best-esp-training-apps-android)
- [x] A33. `best-goetia-app-comparison` → arcana-goetia — "Best Goetia App for Android (2026): Arcana Goetia vs the Alternatives" (kw: goetia app, goetia 72 spirits app, best goetia app android; related: arcana-goetia-app-review, goetia-beginners-ritual, best-goetia-books-essential-reading-2026, which-goetia-spirit-for-love-money-knowledge)
- [x] A34. `why-stop-paying-subscription-occult-apps` → ALL — "Why I Stopped Paying for Subscription Occult Apps (2026)" (kw: occult apps no subscription, one-time payment apps, subscription fatigue; price table of competitors; related: best-tarot-apps-android-2026, best-ghost-hunting-apps-android-2026, best-lucid-dreaming-apps-android-2026)
- [x] A35. `true-cost-tarot-app-subscription-vs-onetime` → unofficial-rider-waite-tarot — "The True Cost of a Tarot App: Subscription vs One-Time Payment (2026)" (kw: tarot app subscription cost, tarot app one time payment, tarot app price; 3-year cost table; related: best-tarot-apps-android-2026, rider-waite-tarot-beginners-guide, tarot-card-meanings-major-arcana-complete-guide)
- [x] A36. `best-sigil-generator-app-onetime` → chaos-sigil-generator — "Best Sigil Generator App: One-Time Payment Options (2026)" (kw: sigil generator app, sigil maker app, sigil generator one time payment; related: chaos-sigil-generator-app-review, sigil-maker-ultimate-guide, how-to-charge-sigil-without-meditation, money-sigil-guide)
- [x] A37. `best-offline-tarot-app-android` → unofficial-rider-waite-tarot — "Best Offline Tarot App for Android (2026): No Subscription, No Ads" (kw: offline tarot app, tarot app without subscription, tarot app no ads; related: best-tarot-apps-android-2026, rider-waite-tarot-beginners-guide, two-card-tarot-spread)
- [x] A38. `dream-machine-vs-lucid-dream-app` → dream-machine + lucid-dream — "Dream Machine vs Lucid Dream (2026): Which Cha0smagick App Should You Buy?" (kw: dream machine vs lucid dream, lucid dreaming app comparison; feature table both apps; related: dream-machine-app-review, lucid-dream-app-review, best-lucid-dreaming-apps-android-2026)
- [x] A39. `free-tools-vs-premium-apps-occult` → ALL — "Free Tools vs Premium Apps: What You Actually Gain by Upgrading (2026)" (kw: free vs paid occult tools, free sigil generator vs app, upgrade occult apps; tool→app bridge; related: free-sigil-generator-online-guide, free-iching-online-guide, free-lunar-phase-calculator-guide, free-online-rune-reading-guide)
- [x] A40. `one-time-vs-subscription-calculator-occult` → ALL — "One-Time vs Subscription: The 3-Year Cost Calculator for Occult Apps (2026)" (kw: one time payment vs subscription, occult app cost comparison, subscription calculator apps; 3-year comparison table; related: why-stop-paying-subscription-occult-apps, best-tarot-apps-android-2026)

**Batch A2 (10) — feature deep-dives + reviews:**
- [x] "How to Use the Dream Journal in Dream Machine: Complete Guide" → dream-machine
- [x] "How to Read Changing Lines with the I Ching Oracle App" → iching-oracle
- [x] "Eerie Roads Reviewed After 90 Nights of EVP Sessions" → eerieroads
- [x] "NOCTEM Paranormal Suite: Complete Feature Tour (2026)" → noctem-tools
- [x] "Using the Astral Lab App: From Hypnagogia to Full Projection" → astral-lab
- [x] "Lunar Phase Calculator App: Tracking Spells Across the Year" → lunar-phase-calculator
- [x] "Norse Rune Oracle App: How to Do the Nine-Rune Cast Digitally" → norse-rune-oracle
- [x] "PSI GYM Training Modes: A Practical Walkthrough" → psi-gym
- [x] "Arcana Goetia App: Browsing the 72 Spirits Like a Pro" → arcana-goetia
- [x] "Chaos Sigil Generator App: Design, Charge, Forget" → chaos-sigil-generator

**Batch A3 (10) — reviews (3rd-party honest tone):**
- [x] 5 reviews: Dream Machine (90-night), PSI GYM (30-day score log), Arcana Goetia (72-spirit test), Eerie Roads (field), Tarot (200 readings)
- [x] 5 "app + practice" reviews: Rune Oracle, I Ching, Lunar, Astral Lab, Sigil Generator

### WAVE B — Emotional MOFU Content (50)

**Batch B1 (12) — transformation journeys:**
- [ ] "30 Days of Zener Training: My Score Went from 6 to 14" → psi-gym
- [ ] "My First Lucid Dream After 3 Weeks with Dream Machine" → dream-machine
- [ ] "I Made a Money Sigil Every New Moon for 3 Months: Results" → chaos-sigil-generator
- [ ] "How Astral Projection Changed My Fear of Death" → astral-lab
- [ ] "Learning to Read Runes: From Confusion to Daily Practice" → norse-rune-oracle
- [ ] "My First Year with a Digital Tarot Practice" → unofficial-rider-waite-tarot
- [ ] "From Skeptic to Practitioner: How the I Ching Answered Hard Questions" → iching-oracle
- [ ] "What 100 EVP Sessions Taught Me About Grief" → eerieroads
- [ ] "The Night I Summoned (and Dismissed) My First Goetia Spirit" → arcana-goetia
- [ ] "Lucid Dreaming Stopped My Nightmares in 30 Days" → lucid-dream
- [ ] "Moon Magic for a Year: Tracking Every Phase" → lunar-phase-calculator
- [ ] "A Complete Beginner's First Month of ESP Training" → psi-gym

**Batch B2 (10) — fear-handling (ethical):**
- [ ] "What Actually Happens in an EVP Session: No Jump Scares" → eerieroads
- [ ] "Goetia for Beginners: What No One Tells You First" → arcana-goetia
- [ ] "Is It Dangerous to Make a Money Sigil?" → chaos-sigil-generator
- [ ] "Why People Fear the Death Card (And Why They Shouldn't)" → unofficial-rider-waite-tarot
- [ ] "Am I Haunted or Is It Pareidolia? Honest Signs" → eerieroads/noctem-tools
- [ ] "Astral Projection Safety: What Can Actually Go Wrong" → astral-lab
- [ ] "Ouija vs Digital Spirit Box: Fear Compared" → eerieroads
- [ ] "Can You Get 'Stuck' Out of Body? The Truth" → astral-lab
- [ ] "The Dark Moon Isn't Scary: A Witch's Perspective" → lunar-phase-calculator
- [ ] "Sigil Backfire: Myth, Psychology, or Real?" → chaos-sigil-generator

**Batch B3 (10) — hope/dream:**
- [ ] "Can Anyone Learn ESP? The Science Says Maybe" → psi-gym
- [ ] "The Psychic Abilities You Already Have (And How to Train Them)" → psi-gym
- [ ] "Lucid Dreaming as a Superpower for Problem Solving" → dream-machine/lucid-dream
- [ ] "Manifesting Wealth: Why Money Sigils Work for Some People" → chaos-sigil-generator
- [ ] "The Fool's Journey Is Your Life: A Hopeful Reading" → unofficial-rider-waite-tarot
- [ ] "What the I Ching Can Teach You About Difficult Choices" → iching-oracle
- [ ] "Rune Divination for Daily Guidance: A Gentle Start" → norse-rune-oracle
- [ ] "The Moon as Your Manifestation Calendar" → lunar-phase-calculator
- [ ] "Angels, Spirits, and You: A Framework for Contact" → arcana-goetia
- [ ] "Astral Travel for Healing Old Wounds" → astral-lab

**Batch B4 (8) — identity/lifestyle:**
- [ ] "The Digital Grimoire: Organizing Your Whole Practice" → all
- [ ] "The Tech-Witch Starter Pack: 5 Tools + 3 Apps" → all
- [ ] "What Cybermancy Says About the Modern Practitioner" → all
- [ ] "Building a Daily Occult Practice in 15 Minutes" → all
- [ ] "Occult Apps and Privacy: What Your Data Says (Ours: Nothing)" → all (trust)
- [ ] "The Psychonaut's Toolkit: Dreams, OBE, and ESP" → astral-lab/psi-gym
- [ ] "Chaos Magick for Skeptics: A Practical Intro" → chaos-sigil-generator
- [ ] "A Witch's Year with the Lunar Phase App" → lunar-phase-calculator

**Batch B5 (10) — tool→app bridges (one per free tool):**
- [ ] Free Sigil Generator → Chaos Sigil Generator app bridge
- [ ] Free I Ching → I Ching Oracle app bridge
- [ ] Free Rune Oracle → Norse Rune Oracle app bridge
- [ ] Free Lunar Phase → Lunar Phase Calculator app bridge
- [ ] Free Spell Builder → (all apps) bridge
- [ ] Free Astrology Sign Calculator → Astral Lab bridge
- [ ] Free Candle Color Calculator → candle/moon apps bridge
- [ ] Free Digital Pendulum → divination apps bridge
- [ ] Free Tengwar Transcriber → identity content bridge
- [ ] Free Servitor Activator → servitor + sigil apps bridge

### WAVE C — Seasonal + GEO + Authority (30)

**Batch C1 (10) — seasonal/calendar:**
- [ ] "New Moon Dates 2026–2027: Ritual Calendar" → lunar-phase-calculator
- [ ] "Mercury Retrograde 2026: Complete Survival Guide" → tarot/iching
- [ ] "Halloween EVP Night: How to Run a Public Session" → eerieroads
- [ ] "Lunar Eclipse Rituals 2026" → lunar-phase-calculator
- [ ] "Full Moon Charging Nights 2026" → lunar-phase-calculator
- [ ] "Samhain Deep-Dive: The Witches' New Year" → tarot/runes
- [ ] "New Year Intention Setting with Sigils" → chaos-sigil-generator
- [ ] "Christmas Gift Guide: Occult Apps for $10 or Less" → all (gifting)
- [ ] "World Sleep Day: Lucid Dreaming as Sleep Science" → dream-machine/lucid-dream
- [ ] "Eclipse Season: Astral Projection Opportunities" → astral-lab

**Batch C2 (10) — GEO/AI-citation bait (definitional + stats):**
- [ ] "What Is a Zener Card? Definition, History, Statistics" → psi-gym
- [ ] "ESP Test Statistics Explained for Beginners" → psi-gym
- [ ] "All 24 Elder Futhark Runes: The Complete Reference" → norse-rune-oracle
- [ ] "The 78 Tarot Cards: Complete Reference List" → unofficial-rider-waite-tarot
- [ ] "The 72 Goetia Spirits: Complete Ranked List" → arcana-goetia
- [ ] "I Ching Hexagram List: All 64 with One-Line Meanings" → iching-oracle
- [ ] "Moon Phases Explained: Dates, Energies, Rituals" → lunar-phase-calculator
- [ ] "Lucid Dreaming Statistics: What Research Actually Shows" → dream-machine
- [ ] "What Is a Spirit Box? How It Works + Frequencies" → eerieroads
- [ ] "Sigil Magic Statistics: Does It Work?" → chaos-sigil-generator

**Batch C3 (10) — authority/trust:**
- [ ] "How We Test Occult Apps: Our Methodology" → all
- [ ] "Why We Don't Do Subscriptions (And Never Will)" → all
- [ ] "Our Privacy Policy Explained in Plain English" → all
- [ ] "Who Is Frater Alek0s? Meet the Author" → all
- [ ] "How to Vet an Occult App Before Buying" → all
- [ ] "We Answer Every Support Email — Here's Proof" → all (trust)
- [ ] "Refund Policy: What Happens If You Don't Like It" → all
- [ ] "The History of Cha0smagick Labs (Since 2025)" → all
- [ ] "App Security: Where Your Data Lives (It Doesn't)" → all
- [ ] "10 Occult Myths Debunked by Practitioners" → all

---

## 3. Per-App Distribution (of the 120)

| App | Price | Articles | 
|---|---|---|
| Dream Machine | $3.99 | 18 |
| Lucid Dream | $3.99 | 14 |
| Unofficial Rider-Waite Tarot | $9.99 | 16 |
| PSI GYM | $3.99 | 14 |
| Chaos Sigil Generator | $3.99 | 12 |
| Arcana Goetia | $3.99 | 12 |
| Eerie Roads | $9.99 | 10 |
| NOCTEM | $14.99 | 6 |
| Norse Rune Oracle | $3.99 | 8 |
| I Ching Oracle | $3.99 | 6 |
| Lunar Phase Calculator | $3.99 | 4 |
| **Total** | | **120** |

---

## 4. ASO Pass (11 apps — one-time)

- [ ] Title/subtitle keyword front-loading per app
- [ ] Short description with 5 keywords + price anchor ("One-time payment. No subscription. No ads.")
- [ ] Full description 300-500 words (transformation + fear-busting copy)
- [ ] Screenshots with benefit captions + feature graphic USPs
- [ ] Review velocity: post-purchase prompt + MailerLite review request
- [ ] On-site app pages: FAQ schema + review schema + price CTA

## 5. GEO

- [ ] Definitional/stats posts (Wave C2) — AI citation bait
- [ ] Yearly lastmod freshness rotation on seasonal posts
- [ ] Extend llms.txt with app feature lists
- [ ] Keep speakable schema + FAQ headers on all posts

---

## 6. Conversion Mechanics

- [ ] Free-tool → app bridge banners on all 10 tool pages
- [ ] Email capture on every MOFU article (MailerLite EN/ES lead magnets)
- [ ] Seasonal email blasts synced to calendar content
- [ ] Sticky conversion bar on BOFU articles (`.sticky-conversion-bar` CSS already in template)
- [ ] "Verified by" stats boxes on ESP/lucid articles (GEO compounding)

---

## 7. KPIs (90-day)

| Metric | Target |
|---|---|
| New articles published | 120 (8-10/week) |
| Blog → app page clicks | ≥ 3,000/month |
| App page → Play Store installs | ≥ 5% CTR |
| Play Store conversion | ≥ 15% |
| Monthly app sales (all apps) | ≥ 200 units |
| Top-3 long-tail rankings | ≥ 40 |
| AI-citation queries (GEO) | ≥ 10 |

---

## 8. Resume Protocol (after balance recharge)

1. Read this file → mark last `[x]`.
2. If mid-batch: finish current batch (write remaining article_{n}.py files).
3. Wire new ARTICLES lists into build_10_articles.py if not done.
4. Run `python scripts/build_10_articles.py` → verify with the audit pattern (30-file check, desc≤160, zero slop, no dead links, index + sitemap counts).
5. Update this file's checkboxes. Next batch.
