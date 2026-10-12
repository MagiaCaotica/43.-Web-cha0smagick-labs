# Backlink Outreach Strategy — Cha0smagick Labs

> **Claims in this document are live marketing copy.** Every number below is taken from
> `best-occult-apps-android.html`, which publishes the per-app rating and review count that
> Google Play actually reports. If those per-app figures change, this file must change with
> them. Do not restate a figure here that is not traceable to that table.

## The one-line pitch

**12 offline Android apps for occult practice. One-time payment, no subscription, no ads.**
4.5★ average across 221 Google Play reviews, plus 7 esoteric PDF books.

## Why this pitch converts to editors

Competitors in this niche sell access to a server, or sell a subscription, or sell a
subscription with ads attached. Every Cha0smagick Labs app is a one-time purchase that works
with the phone in aeroplane mode. That is the differentiator worth a link, and it is
verifiable: any editor can install one and check.

| App | Rating | Reviews | Price |
|---|---|---|---|
| Chaos Sigil Generator | 4.8 | 45 | $3.99 |
| Arcana Goetia | 4.7 | 18 | $3.99 |
| Lunar Phase Calculator | 4.6 | 22 | $3.99 |
| Rider-Waite Tarot Complete | 4.6 | 27 | $9.99 |
| I Ching Oracle | 4.5 | 31 | $3.99 |
| Norse Rune Oracle | 4.4 | 35 | $3.99 |
| PSI GYM | 4.3 | 28 | $3.99 |
| Dreamachine | 4.2 | 15 | $3.99 |
| Astral Lab | — | — | $6.99 |
| Eerie Roads | — | — | $9.99 |
| Lucid Dream | — | — | $9.99 |
| NOCTEM | — | — | $14.99 |

*Weighted average of the eight rated apps: **4.5★**, **221 reviews**. The four marked — have
not accumulated a published rating yet. Do not quote a blended average across all twelve.*

Two purchase paths exist: each app individually on Google Play, or all twelve in one bundle
for $29.99 against a $79.88 list total.

## Target Blogs / Sites

### Tier 1 — High authority
1. **Lucky Mojo** (luckymojo.com) — contact form
2. **Rune Soup** (runesoup.com) — Gordon White, direct chaos-magick affinity
3. **The Hoodwitch** (thehoodwitch.com) — 500K+ followers
4. **Learn Religions — Occult** (learnreligions.com)

### Tier 2 — Medium authority
5. **Occult World** (occult-world.com)
6. **Esoteric Library** (esotericlibrary.com)
7. **The Hermetic Library** (hermeticlibrary.com)

### Tier 3 — Small blogs, fastest acceptance
8. **Digital Occult**
9. **Morrigan's Workshop**
10. **Paranormal Daily News** — accepts guest posts

Contact pages already scraped into `.firecrawl/outreach/`. Scraped target lists in
`.firecrawl/outreach-research/*-urls-clean.txt`. Scraped page bodies in
`.firecrawl/outreach-results/`.

## Email templates

### Template 1 — Free guest post
**Subject**: Free guest post for [Blog]

Hi [Name],

I read your [article] and found it useful.

I run Cha0smagick Labs — 12 offline Android apps for occult practice (sigils, tarot,
runes, astrology, ESP, ghost hunting) plus 7 esoteric PDF books. Everything is a one-time
purchase: no subscription, no ads, no account, and every app works with no signal.

I'd like to write an original guest post for free. Ideas:

- "5 Books on Chaos Magick That Are Actually Worth Reading"
- "A Beginner's Guide to Sigil Magick"
- "Offline Divination: What Changes When the App Doesn't Need Wi-Fi"

1500+ words, genuinely original, references included. The only ask is one link to
https://cha0smagicklabs.com in the bio or a "resources" mention.

Interested? I'll match the topic to your audience.

Thanks,
https://cha0smagicklabs.com

### Template 2 — Resource page suggestion
**Subject**: Resource suggestion

Hi, saw your resources page. Cha0smagick Labs (12 offline Android apps for occult practice,
one-time payment, no subscription, 4.5★ across 221 Play reviews) would fit the list:
https://cha0smagicklabs.com — thanks!

### Template 3 — Broken link
**Subject**: Broken link on [page]

Found a dead link on [page] pointing to [dead URL]. I have a relevant replacement if you
want it. — [name]

Only send this when the link is genuinely dead. Sending false broken-link reports gets a
domain flagged as spam and costs more than it earns.

## Weekly cadence

- **Week 1** — pick 10 targets, send 5 guest-post pitches
- **Week 2** — follow up on week 1, send 5 more
- **Week 3** — YouTube outreach, broken-link checks

## Rules

- Personalise every message. Reference a specific article by them.
- Never quote a rating, review count or price that is not in the table above.
- Never promise a refund window. Hotmart governs book refunds and Google Play governs app
  refunds; state neither.
- One follow-up, then stop.

## Automation

`npm run links:scan` runs `scripts/seo/link-opportunities.mjs`, which re-crawls the target
list, finds resource/link pages that do not yet mention Cha0smagick Labs, and writes a ranked
worklist to `.firecrawl/link-opportunities.md`. It only *detects* opportunities — every
outreach email is still sent by a human.