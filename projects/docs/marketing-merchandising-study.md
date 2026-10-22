# Marketing & merchandising study — Cha0smagick Labs

Written 2026-10-12. Every number in here was measured from the site's own data
(GSC `sc-domain:cha0smagicklabs.com`, the Play Developer API, and the repo).
Nothing is a best-practice citation. Where the data disagrees with a common
strategy, the data wins and the strategy gets dropped.

---

## 1. The demand map — what people are actually asking for

120 days of queries, 2026-06-11 → 2026-10-09, 562 rows, grouped by intent.

| Intent cluster | Queries | Impressions | Clicks | What it is |
|---|---|---|---|---|
| Free-tool intent | ~20 | ~45 | 1 | `free sigil maker` (11i, **p14.5**), `sigil maker online free` (8i, p25.3), `sigil maker free` (5i, p17.2), `free sigil maker online` (1i, p8.0) |
| Head astrology | ~15 | ~120 | 0 | `best astrology apps` (82i, p10.6), `best astrology apps 2026` (27i, p7.8) |
| Chaos magick / goetic | ~15 | ~120 | 5 | `goetic magic` (54i, p9.2), `chaos magic sigil generator` (20i, p6.8) |
| Technical / reference | ~5 | ~30 | 0 | `nasa jpl vs swiss ephemeris reddit` (15i, **p5.5**) |
| **Competitor-alternative** | **4** | **7** | **0** | `app like costar` (2i, p61), `apps like co star` (1i, p61) |
| Offline / privacy | 2 | 7 | 0 | `moon phase tracker app` (5i, p20.8) |
| Free / cheap astrology | 7 | 10 | 0 | `best astrology app free` (1i, **p1.0**) |

### What this kills and what it confirms

**It kills the four-comparison-pages plan.** Competitor-alternative intent is 7
impressions in 120 days and `apps like co star` sits at **position 61**. Four
pages would have targeted effectively zero demand. That recommendation was wrong
and was withdrawn before it was built.

**It confirms one comparison page is worth it — exactly one.** Co-Star, The
Pattern, Time Nomad and Astro Matrix are all *astrology* apps. Of the 12 apps in
the catalogue, **only Astral Lab competes in that category.** The other 11 —
sigils, servitors, runes, tarot, I Ching, dreams, paranormal, lunar phases, ESP —
have no named competitor to compare against. Building four pages would have been
four pages of thin content with nothing to rank for. `compare/astral-lab-vs-co-star.html`
is the one that survives, and it extends if it earns impressions.

**It relocates the real opportunity.** `free sigil maker` at p14.5 with 11
impressions is worth more than every competitor page combined, because it is the
one query with both volume *and* a ranking problem. The page
(`tools/sigil-generator.html`) is already 1,193 words with 8 h2 and 10 h3 and
"free" in the title. The constraint there is impressions, not copy. Adding words
will not move it.

---

## 2. The funnel, as it now stands

```
   free tools (62)          blog (820)          landing pages (6)
   53 have a funnel CTA ──► 741 of 820 can    ──► apps-bundle ($29.99)
                             sell BOTH books       books-bundle ($29.99)
                             and apps             per-app Play pages
                             (was 19 of 820)
```

The structural bug that was fixed: every post's CTA block already linked the
*other* product type's landing page but never its checkout. App posts sent
readers to a page describing a book; book posts never saw a Play link at all.
Anchors were **added, never repointed**, so no existing internal link was lost.

---

## 3. The conversion problem that is still open

**The site gets ~5.5 clicks a day.** Even at a wildly optimistic 5% conversion
that is 8 sales a month. The user-facing goal of "one sale per hour" needs:

| Conversion rate | Sessions needed / month | Multiple of current |
|---|---|---|
| 5% | 14,400 | 93× |
| 2% | 36,000 | 232× |
| 0.5% | 144,000 | 929× |

**No amount of on-page work closes a 93× gap.** The funnel work above raises the
*conversion rate* on traffic that exists. Only authority and demand raise the
traffic. Both are listed below as separate tracks.

---

## 4. Pricing architecture

| Product | Price | Notes |
|---|---|---|
| 7 apps | $3.99 | Entry tier |
| Astral Lab | $6.99 | Competes with $9.99–$14.99 one-time rivals |
| 3 apps | $9.99 | Eerie Roads, Lucid Dream, Rider-Waite Tarot |
| NOCTEM | $14.99 | Flagship |
| **12-app bundle** | **$29.99** | vs $79.88 list = **62% off**, arithmetically true |
| Books | $3.99–$9.99 | 8 titles |
| **8-book bundle** | **$29.99** | vs $50.92 list |

**The strongest argument the site has and it is buried.** Co-Star is $7.99
*per month*. Astral Lab is $6.99 *once*. Over two years that is $6.99 against
$191.76 — a 27× difference — for two apps in the same professional category. The
comparison page now leads with that arithmetic.

**Two things are not to be done:**
- Do not discount the bundle below $29.99. It is the only mechanism that sells
  the suite, and it is the only place the "these complement each other" story
  can land in a transaction.
- Do not add a subscription. It would be the single most damaging change
  available: the entire differentiation against Co-Star and The Pattern is
  "pays once", and the newsletter and email sequences are built on that.

---

## 5. The review problem

**221 reviews, weighted average 4.51**, across 8 of 12 apps — measured from the
per-app figures the site publishes in `best-occult-apps-android.html`.

**Four apps declare no rating at all: Astral Lab, Eerie Roads, Lucid Dream,
NOCTEM.** Those are the four newest and four most expensive ($6.99–$14.99),
including the flagship and the only app with a comparison page. A $14.99 app with
zero visible reviews converts materially worse than a $3.99 app with 45.

**This is the single highest-leverage non-SEO lever and it is outside the repo.**
No HTML edit raises a Play rating. Only in-app review prompts and real users do.
The rating claim was corrected site-wide in `5c97694d` from a false "4.7★ / 128+
reviews" (4.7 was one app's individual score presented as a portfolio average)
to the measured 4.5★ / 221.

---

## 6. Backlinks — target roundups, not witch blogs

Measured across the 50-page scraped outreach corpus:

- **0 of 50 documents link a competitor app.**
- **0 of 50 link Cha0smagick Labs.**
- 14 of 50 are shaped like resource/further-reading lists.

**The witch-and-practice blog corpus does not cite apps. It cites books.** Sending
app-pitch emails into that corpus is the wrong bet and would waste the domain's
first outreach impressions.

**The right targets are app roundup sites.** Example already found:
`oneironauts.io/blog/best-lucid-dreaming-apps` — "12 Best Lucid Dreaming Apps in
2026 (Tested & Ranked)". `scripts/seo/link-opportunities.mjs` scores for this:
a page that already links a competitor (+20, +5 each), that declares itself a
resource list (+14), or that is a ranked best-of (+10). Pages already linking us
are excluded. Outbound-link count is only a tiebreaker, and only for pages
already flagged as curated — an earlier version of the score rewarded tag
archives with 500 outbound links, which is how link farms get mistaken for
opportunities.

**Not automatable:** the decision to publish a link is a human editor's. Only the
search for where that decision goes yes is.

---

## 7. GEO / AI search

`robots.txt` previously allowed every AI crawler implicitly via `User-agent: *`
but named none of them and pointed at no machine-readable file. Now explicit
blocks for GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, anthropic-ai
and Applebot-Extended.

`llms.txt` (42 KB, 196 absolute links) and `llms-full.txt` (229 KB, all 820
article URLs) already existed and are spec-compliant. They are deliberately
**not** in `sitemap.xml` — they are not HTML pages and Search Console would
report them as invalid URLs.

---

## 8. What to do next, in order

1. **Get reviews on the four zero-rating apps.** In-app prompt after first
   successful use, not on launch. Highest revenue-per-hour of anything on this
   list.
2. **Send the 19 outreach emails** from `.firecrawl/link-opportunities.md`.
   Target roundup sites first. One follow-up, then stop.
3. **Extend `compare/` only if Astral Lab vs Co-Star earns impressions.** Do not
   pre-build pages for apps with no competitor.
4. **Watch `free sigil maker` position weekly.** p14.5 → p5 is worth more than
   every comparison page. Its constraint is impressions, so the lever is inbound
   links to the tool, not more words.
5. **Do not chase head terms.** `best astrology apps` is held by brands with
   authority the site cannot accumulate by editing HTML.

## 9. Claims discipline

Every published figure must be one the site can substantiate:

- Never quote a rating not in `best-occult-apps-android.html`'s table. Four apps
  have none — say so rather than averaging them in.
- Never promise a refund window. Hotmart governs the books, Google Play governs
  the apps.
- Count is 12 apps. `projects/docs/archive/**` still says 11 and needs correcting
  before the affiliate kit is sent again.