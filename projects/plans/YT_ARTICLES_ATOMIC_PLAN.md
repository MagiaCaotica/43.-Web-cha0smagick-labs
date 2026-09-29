# ATOMIC PLAN — YouTube → SEO/GEO/ASO Deep-Dive Articles

**Source channel:** `https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA`
**Videos:** 349 (complete inventory: `projects/research/YT_VIDEO_INVENTORY.md`)
**Target:** 1 long-form English article per video → 349 articles in `blog/`
**Date plan authored:** 2026-09-26
**Status:** PLAN COMPLETE — execution begins at Phase 0

---

## 0. MISSION & NON-NEGOTIABLES

### 0.1 Mission
Convert every YouTube video into a genuinely useful, genuinely authoritative English
deep-dive article that ranks on **SEO** (Google/Bing), **GEO** (ChatGPT / Perplexity /
AI Overviews / Claude), and supports **ASO** (Google Play keyword authority), while
carrying a soft BTL funnel that sells our 11 Android apps + 7 PDF books without the reader
feeling sold to.

### 0.2 Hard constraints (from the request)
| # | Constraint | Enforcement |
|---|---|---|
| C1 | One article per video, all videos covered | `n_video` field 1..349, validated complete & unique |
| C2 | Every article in **English** | Generator asserts no Spanish stopwords; `lang="en"` |
| C3 | Funnel in **every** article | `funnel_stage` required; QA gate rejects missing CTA |
| C4 | Always selling apps or books | `primary_product` ∈ {11 apps, 7 books} for ≥92% of articles; tools/free for the rest |
| C5 | Rich/useful content **first**, BTL **second** | Value sections ≥70% of word count precede the money section |
| C6 | Rank #1 SEO + GEO + ASO | Per-article checklist §3 |
| C7 | No skills / agents / tasks — all done inline | No delegation in this plan's execution |
| C8 | Plan first, then follow it | This file is the contract; execution logs into §11 |
| C9 | Sitemap + any other needed integration | Phase 5 is mandatory, not optional |
| C10 | Anti-cannibalization vs 466 existing posts | Phase 1b gate — collisions are hard-fail |
| **C11** | **Every article is a sales asset, not just an essay** | See §3.4.1 below. Mid-article app card after the lede + closing money block with name, price, one-line pitch and `Get {NAME} →` CTA. **No article may ship without it.** |
| **C12** | **Every article names and links the ONE app most related to its topic** | The app card leads with `spec["products"][0]` as a hero: linked name, price, pitch, and a `Get {NAME} →` buy link inside the article body. Relevance comes from the spec's product order; never re-sort it. See §3.4.1. |

### 0.2.1 C11 — THE MONETISATION RULE (binding, applies to all 349)

Added after the audit of the first 141 shipped articles. The audit found that every
article carried a bare link row (`Apps: X | Y | Z`) at **84% of document depth**, with
**zero in-body app mentions**. That is a technical link, not a funnel, and it failed C4
and C5. Every article now follows this shape:

**1. Mid-article card — immediately after the lede, so it is visible on entry.**

```html
<section class="internal-links" style="...border-left: 3px solid var(--accent-gold)...">
  <h3>Put this into practice</h3>
  <p>Everything described above costs nothing and works on paper. If you would rather
     the bookkeeping were handled for you, these are the ones built for this kind of work.</p>
  <p>Android app(s): <b>Name</b> $3.99 · <b>Name</b> $3.99</p>
  <p>Book(s): <b>Name</b> $4.99</p>
  <p>One payment each, no subscription, no account.</p>
</section>
```

**2. Closing money block — after the FAQ, before the related-articles list.** For each
of up to 3 apps and 2 books: the name as a bold link, the price, a **one-line pitch**
explaining what that product does for *this* kind of work, and a CTA link
`Get {NAME} →`. Then a free-tools block, then a closing paragraph stating that the
method itself is free and that a purchase buys the record keeping, the saved history
and the arithmetic:

> None of this is required. The method on this page is complete as written, and every
> step of it can be done with paper and a pen. What a purchase adds is the record
> keeping, the saved history, and the arithmetic you would otherwise do by hand. Every
> one of these is a single payment.

**3. Framing rules that must not be broken.**
- One payment. **Never** mention a subscription, a free trial, an account requirement,
  ads, or a freemium tier.
- The method stays free and the article must say so, which is what makes the pitch honest.
- The pitch is per product (12 apps + 7 books, each with its own line in the `PITCH` map
  in `gen_yt_articles.py`), never a generic "buy our app".

**4. Why the copy is gate-neutral — do not "fix" this by moving the copy.**
`slop._body()` strips `<section class="internal-links">` before measuring the corpus
gates, so rich repeated sales copy cannot create duplicate H2s or 8-grams. The
per-article lexical gates (`BANNED_PHRASES`, em-dash ≤6 per 1k words, `MIN_WORDS=900`)
still read the whole visible text, so the copy must avoid banned phrases and em-dashes.
**Both blocks must stay wrapped in `<section class="internal-links">`.**

**5. Authoring-side obligation.** The renderer builds both blocks from
`spec["products"]` and `spec["tools"]`, so a new content record needs no marketing copy
of its own. The one thing each author must still supply is the money/product FAQ item
(plan C4), and its phrasing must be unique corpus-wide because 8-grams are shared with
the surrounding prose.

### 0.3 Honest scope statement
349 × ~2,600 words ≈ **900,000 words** / ~10 MB of HTML. That is not hand-writable in one
session. The mechanism is therefore a **data-driven generator** — the exact pattern the repo
already uses in `projects/scripts/generate-articles.py` (194 articles) — but fed with a
**rich, hand-authored per-video Article Spec** so output is article-specific, not template
slop. Split:

- **Tier A — Hand-authored bodies (30 articles).** The 30 highest-view videos where demand
  is already proven. Full hand-written prose, 2,800–4,000 words each.
- **Tier B — Spec-composed bodies (319 articles).** 40+ field spec per video, expanded by
  variant-pool section builders into 2,200–3,000 words of spec-driven prose.

Target average: **2,600 words/article**, minimum floor **1,800 words** (QA hard gate).

---

## 1. PHASE 0 — PREFLIGHT VERIFICATION (atomic, read-only)

| ID | Step | Verification |
|---|---|---|
| 0.1 | Load `projects/data/yt-articles/_template.json`, assert 11 keys | `Object.keys().length === 11` |
| 0.2 | Load `projects/research/yt_videos.json`, assert 349 rows, all `id` unique | `new Set(ids).size === 349` |
| 0.3 | Load `projects/research/existing_blog_slugs.json`, assert 466 | length check |
| 0.4 | Enumerate `assets/images/blog/*.png` → build `og_image_pool` (71 names) | dir listing |
| 0.5 | Read `js/apps-data.js` → `appsData[]` (11) + `booksData[]` (7) | regex extract |
| 0.6 | Read `js/conversion.js` + `js/affiliate.js` → confirm CTA class names & GA4 event names | grep |
| 0.7 | Record `sitemap.xml` URL count (532) + `llms.txt` `## Recent Blog Posts` anchor | string index |
| 0.8 | Record `blog/index.html` card pattern + `<div class="posts">` insert offset | string index |
| 0.9 | Confirm `python` 3.12 + `lxml`/`json` available; confirm no npm step needed (static HTML) | version print |
| 0.10 | Write `projects/data/yt-articles/_preflight.json` with all of the above as machine-readable facts | file exists |

**Gate 0-PASS** — all 10 assertions true. Any failure aborts to repair before Phase 1.

---

## 2. PHASE 1 — ARTICLE SPEC: THE BRAIN OF THE OPERATION

### 2.1 The Article Spec schema (one row per video, 349 rows)

Authored by me, in batches, into `projects/data/yt-articles/specs/<NN>-<cluster>.json`.

```jsonc
{
  "n_video": 130,                    // 1..349, unique, complete
  "video_id": "XXXXXXXXXXX",
  "video_title": "COMPLETE GUIDE TO PACTS WITH MAMMON",
  "video_url": "https://www.youtube.com/watch?v=...",
  "cluster": "money-goetia",
  "views": 35000,                    // demand signal; drives Tier A selection

  // ---------- SEO ----------
  "slug": "mammon-pact-guide-chaos-magick",   // 3-6 words, unique vs 466 existing
  "h1": "Mammon Pact Guide: A Complete Chaos Magick Ritual for Wealth",
  "meta_title": "Mammon Pact Guide: Chaos Magick Wealth Ritual",   // <=60 chars
  "meta_desc": "A step-by-step Mammon pact ritual in chaos magick...", // 140-155 chars
  "meta_keywords": ["mammon pact", "chaos magick wealth", "goetic wealth"],
  "primary_kw": "mammon pact",
  "secondary_kws": ["pact with mammon", "goetia of wealth", "chaos magick money ritual"],
  "search_intent": "informational+commercial",
  "long_tail_modifier": "chaos magick",
  "people_also_ask": [ /* 4 real PAA-style questions, used verbatim in FAQ */ ],

  // ---------- GEO (Generative Engine Optimization) ----------
  "answer_first_paragraph": "A Mammon pact is...",  // 40-60 word definition, DEFINITIVENESS
  "key_terms": ["Mammon", "Goetia", "pact", "abundance", " egregore"],
  "citable_facts": ["Mammon is Goetia #40...", "..."],  // 3-6 quotable sentences
  "entity_links": ["Mammon", "Goetia", "Baphomet", "Austin Osman Spare"],

  // ---------- Structure ----------
  "category": "goetia",              // must be an existing blog/ filter button
  "og_image": "arcana-goetia-guide", // MUST exist in og_image_pool
  "excerpt": "One line for the blog index card (<=140 chars)",
  "h2_outline": [                    // 8-11 sections, each a section TYPE + data
    {"type":"definition","h":"What a Mammon Pact Actually Is"},
    {"type":"history","h":"Mammon in the Ars Goetia"},
    {"type":"howto","h":"The Pact Procedure, Step by Step","steps":[...]},
    {"type":"science","h":"Why Sigils Work: The Cognitive Frame"},
    {"type":"mythbust","h":"Three Mistakes Practitioners Make"},
    {"type":"compare","h":"Mammon Pact vs Sigil vs Servitor"},
    {"type":"objection","h":"What If Nothing Happens?"},
    {"type":"cta","h":"Put This Into Practice Today"}
  ],
  "faq": [ {"q":"...","a":"..."} ],  // 5-7, verbatim, ALSO becomes FAQPage schema
  "glossary_terms": ["pact","effervevescence","gnosis"], // -> cross-link glossary.html
  "internal_links_out": ["history-of-chaos-magick","sigil-vs-servitor-differences"],

  // ---------- BTL / Funnel ----------
  "funnel_stage": "BOFU",            // TOFU | MOFU | BOFU | HOLD
  "value_ratio": 0.74,               // % of words before the money section (>=0.70)
  "primary_product": "arcana-goetia",// app id or book id
  "secondary_product": "codex-chaoticus",
  "free_tool": "sigil-generator",    // the TOFU offer
  "cta_type": "app-install",         // tool | app-install | book-pdf | bundle | community
  "aso_keywords": ["goetia", "ritual sigils", "sigil generator"], // Play Store field

  // ---------- Production ----------
  "tier": "A",                       // A = hand-authored body, B = composed
  "word_target": 3200,
  "date": "2026-09-26"
}
```

### 2.2 Spec authoring batches (atomic)

| Batch | Videos | Cluster filter | Spec file |
|---|---|---|---|
| S1 | 1–40 | money / money-goetia | `specs/01-money.json` |
| S2 | 41–80 | servitors (first 40) | `specs/02-servitors-a.json` |
| S3 | 81–120 | servitors (next 40) | `specs/03-servitors-b.json` |
| S4 | 121–160 | servitors (last 10) + chaos/servitors | `specs/04-servitors-c.json` |
| S5 | 161–200 | chaos/general + chaos/gates | `specs/05-chaos-core.json` |
| S6 | 201–240 | magic-101 + ritual-craft + entity-lore | `specs/06-chaos-101.json` |
| S7 | 241–280 | mind-science + science-bridge + technomancy | `specs/07-mind-tech.json` |
| S8 | 281–320 | history + books + religion + culture + chronology | `specs/08-history-books.json` |
| S9 | 321–349 | divination + dreams-astral + lunar + sigils + protection + creatures + music + 4chan-memetic + comparative | `specs/09-rest.json` |
| S10 | podcast 35 | podcast | `specs/10-podcast.json` |

Per row, 6 atomic actions:
1. Read title + duration + views from `yt_videos_classified.json`
2. Derive `slug` (English, SEO-shaped, verb/noun, ≤5 words)
3. Derive `primary_kw` + 3 `secondary_kws` + `long_tail_modifier`
4. Write `h1`, `meta_title` (≤60), `meta_desc` (140–155), `excerpt` (≤140)
5. Write `h2_outline` (8–11 typed sections) + `faq` (5–7) + `key_terms` + `citable_facts`
6. Assign `category` / `og_image` / funnel / products / `aso_keywords` / tier

### 2.3 Slug anti-cannibalization (PHASE 1b — hard gate)

| ID | Rule |
|---|---|
| 1b.1 | `slug ∉ existing_466` (exact) |
| 1b.2 | `slug` normalized (strip `-`) `∉` normalized existing 466 |
| 1b.3 | No two new specs share a slug |
| 1b.4 | `primary_kw` collision check: flag any new kw whose **normalized** form matches an existing 466 slug core → requires a different `long_tail_modifier` |
| 1b.5 | Per cluster, no two specs share the same `h2_outline` H2 set (Jaccard similarity < 0.6) |
| 1b.6 | Per cluster, `primary_kw` must be unique (no duplicate primary targets) |
| 1b.7 | Output `_cannibalization_report.json` with any flagged pairs + chosen disambiguation |

**Gate 1-PASS** — zero unresolved collisions.

---

## 3. PHASE 2 — GENERATOR ENGINE

Single script: `projects/scripts/gen_yt_articles.py` (Python 3.12, stdlib only —
`json`, `re`, `hashlib`, `pathlib`, `datetime`, `html`). Mirrors repo convention.

### 3.1 Assembly contract (validated formula)

```
head1(rebuilt) + style + gtag + "\r\n" + breadcrumbLd(rebuilt) + "\r\n"
+ cssLink + "\r\n" + bodyHeader + articleOpen(rebuilt h1) + metaLine(rebuilt)
+ intro + body + tail(rebuilt) + footer
```

### 3.2 Module list (atomic build order)

| ID | Module | Responsibility |
|---|---|---|
| 2.1 | `Template` | load `_template.json`, expose 11 fragments, provide `rebuild_*` for the 5 mutable ones |
| 2.2 | `TextUtil` | `esc()`, `slugify()`, `title_case()`, `stable_pick(slug, pool)` = `hashlib.sha1(slug).digest()[0] % len(pool)`, `words()` |
| 2.3 | `HeadBuilder` | title/description/keywords/canonical/og:*/twitter:*/article:published_time/article:modified_time + `<meta name="keywords">` |
| 2.4 | `SchemaBuilder` | **Article/BlogPosting** (headline, description, image, datePublished, dateModified, author `Person` Frater Alek0s w/ `sameAs`, publisher `Organization` w/ logo.png, `wordCount`, `timeRequired`, `inLanguage":"en"`, `mainEntityOfPage`, `articleSection`, `keywords`) + **FAQPage** + **BreadcrumbList** (3 items) |
| 2.5 | `MetaLine` | `⬢`-separated byline: `By Frater Alek0s ⬢ <time datetime="YYYY-MM-DD">Month D, YYYY</time> ⬢ N min read` |
| 2.6 | `SectionBuilder` | 12 section types, each with a **variant pool of 5–9 prose patterns**, `stable_pick` per article → no two articles in a cluster share phrasing |
| 2.7 | `BodyAssembler` | renders `h2_outline` in order, injects TOC (`<nav id="toc">` w/ anchor links — matches existing `add_table_of_contents.py` output), assigns heading ids |
| 2.8 | `TableBuilder` | comparison tables from spec data (3–5 rows × 3–4 cols) with `<thead>/<tbody>` + scope attrs |
| 2.9 | `FaqBuilder` | visible `<h2>FAQ</h2>` + `<details>` accordion **and** the same Q/A in FAQPage JSON (visible content = GEO requirement) |
| 2.10 | `CtaBuilder` | funnel-aware money block; 5 CTA variants (tool / app-install / book-pdf / bundle / community); `.cta-*` classes already styled by `conversion.js`; GA4 event attributes |
| 2.11 | `TailBuilder` | `related-articles` (5 links, mix of 2 new siblings + 3 existing) + `internal-links` (3 apps / 3 books / 3 tools) |
| 2.12 | `TierABody` | if `tier=="A"`, load hand-authored `bodies/<slug>.html` instead of composing |
| 2.13 | `Validator` | per-article assertions run before write (see Phase 4) |
| 2.14 | `Writer` | writes `blog/<slug>.html` as **UTF-8 no BOM**, `\n` newlines, idempotent (skips if exists + `--force` to overwrite) |

### 3.3 Section types (12) and their GEO/SEO payload

| type | SEO payload | GEO payload |
|---|---|---|
| `definition` | H2 + first 100-word definition paragraph | `answer_first_paragraph` verbatim → LLMA-extractable |
| `history` | H2 + dated H3 timeline | citable facts w/ years |
| `howto` | H2 + numbered `<ol>` with `<h3>` per step | step list = procedure chunk |
| `science` | H2 + mechanism explanation | bridges occult ↔ cognition/quantum framing |
| `mythbust` | H2 + myth/fact pairs | high citation likelihood |
| `compare` | H2 + table | comparison tables are heavily cited by LLMs |
| `listicle` | H2 + `<ul>` of N items | list extraction |
| `objection` | H2 + objection→answer | E-E-A-T trust signal |
| `casestudy` | H2 + narrative + result | anecdotal evidence w/ specificity |
| `caution` | H2 + safety/ethics note | YMYL-adjacent trust |
| `glossary` | H2 + `<dl>` terms → `../glossary.html#term` | entity disambiguation |
| `cta` | H2 + funnel money block | commercial intent capture |

### 3.4 The money block (funnel) — per-stage behaviour

| Stage | Placement | Content | Target |
|---|---|---|---|
| **TOFU** | mid-article + end | free web tool, lead magnet (`/lead-magnet/quickstart-guide-chaos-magick-en.html`) | tool page + email list |
| **MOFU** | late | free/low-price app (Psi Gym, Chaos Sigil Generator $3.99), newsletter | app install / subscriber |
| **BOFU** | late + final | the `primary_product` deep card w/ price, rating hook, Play/Hotmart link, `?ref=` affiliate | purchase |
| **HOLD** | final | community (Telegram/Discord), bundle $19.99, related books | LTV / repeat |

Rotation rules: never two consecutive articles in the same `n_video` order with the same
`primary_product`; apps and books alternate by cluster affinity; `servitors` cluster
rotates across all 11 apps + servitors books.

**→ Enforced as C11 (§0.2.1) and the built implementation is §3.4.1. The table above is
the intent; §3.4.1 is the contract the generator actually satisfies.**

### 3.4.1 C11 — the two blocks the generator actually emits

| Block | Placement | Contents | Function |
|---|---|---|---|
| **App card** | immediately after the lede (~8% depth) | `Put this into practice`, "costs nothing, works on paper", then the **hero app**: its linked name, price, its one-line pitch, and a `Get {NAME} →` buy link. Secondary apps and books follow in one muted line. Closes with "One payment, no subscription, no account." | visible on entry; names the single most relevant app and makes it buyable before the reader invests 2,000 words |
| **Money block** | after the FAQ, before related articles | per app/book: bold linked name, price, one-line `PITCH` line, `Get {NAME} →` CTA; then free tools; then "None of this is required… What a purchase adds is the record keeping, the saved history, and the arithmetic" | the actual conversion block, with the honesty line that makes it sell |

Both are `<section class="internal-links">`, which is why they cost nothing in corpus
collision terms. See §0.2.1 for the full rule, the framing prohibitions (no subscription,
no trial, no account, no ads) and the reason the wrapping must not be changed.

**The hero slot is not arbitrary.** `render_app_card()` takes `spec["products"][0]`, and
`build_specs.py` orders that list by topical fit, so the app in the hero slot is the one
that actually matches the article. A Lovecraft article leads with Eerie Roads, an
out-of-body article with Astral Lab, a sigil article with the Chaos Sigil Generator. A
books-only spec falls back to `books[0]` as hero. **Do not sort `spec["products"]`
alphabetically or by price — doing so silently breaks the relevance guarantee.**

---

## 4. PHASE 2b — TIER A HAND-AUTHORED BODIES (30)

Selected = top 30 by `views`, weighted toward proven demand clusters
(Mammon 35k · Clauneck family ~14k · 3 Hechiceras 4.2k · Stolas 4.1k · witch-king 1.4k ·
gnosis · Austin Osman Spare 2.1k · servitor management · all money-goetia).

Per article, atomic:
1. Create `projects/data/yt-articles/bodies/<slug>.html`
2. Write full body: 8–11 `<section>`s, 2,800–4,000 words
3. Reuse the same section-type HTML conventions (tables as real `<table>`, steps as `<ol>`)
4. Include: 1 comparison table, 1 objection block, 1 safety/caution note, 1 glossary `<dl>`, 5+ internal `../blog/` links
5. Run `Validator`; fix until pass
6. Mark spec `tier:"A"` and `body:"bodies/<slug>.html"`

---

## 5. PHASE 3 — GENERATION RUN (9 batches)

| Batch | Specs | Articles | Command |
|---|---|---|---|
| B1 | S1 money | ~40 | `python projects/scripts/gen_yt_articles.py --spec specs/01-money.json` |
| B2 | S2 servitors-a | ~40 | `--spec specs/02-servitors-a.json` |
| B3 | S3 servitors-b | ~40 | `--spec specs/03-servitors-b.json` |
| B4 | S4 + S6 | ~50 | `--spec specs/04-servitors-c.json --spec specs/06-chaos-101.json` |
| B5 | S5 chaos-core | ~40 | `--spec specs/05-chaos-core.json` |
| B6 | S7 mind-tech | ~40 | `--spec specs/07-mind-tech.json` |
| B7 | S8 history-books | ~40 | `--spec specs/08-history-books.json` |
| B8 | S9 rest | ~29 | `--spec specs/09-rest.json` |
| B9 | S10 podcast | ~35 | `--spec specs/10-podcast.json` |

After **each** batch: run the batch validator (§6) and print a pass/fail table.
Total = 349 files.

---

## 6. PHASE 4 — QA GATE (hard, runs per article + per batch + final)

| ID | Assertion | Fail action |
|---|---|---|
| 4.1 | File is valid UTF-8, **no BOM** | abort write |
| 4.2 | Zero mojibake sequences (`Ã¢`, `â€`, `Ã³`, U+FFFD) | abort write — **this is the bug that already affects 152 legacy files** |
| 4.3 | `<html>…</html>`, `<body>…</body>`, `<article>…</article>`, `<main>…</main>`, `<footer>…</footer>` all balanced | abort write |
| 4.4 | Exactly one `<h1>`; H1 count 1, H2 8–11, H3 0–30 | warn |
| 4.5 | Word count ≥ 1800, ≤ 4500 | abort write |
| 4.6 | `meta_title` ≤ 60 chars | auto-truncate + warn |
| 4.7 | `meta_desc` 120–160 chars | warn |
| 4.8 | `primary_kw` present in: H1, meta_desc, first 100 words, ≥1 H2, ≥1 FAQ answer, body | abort write |
| 4.9 | `FAQPage` JSON parses; question count == visible FAQ count | abort write |
| 4.10 | `Article` JSON parses; has `wordCount`, `timeRequired`, `datePublished`, `dateModified`, `author`, `image` | abort write |
| 4.11 | `og_image` exists as `assets/images/blog/<og_image>.png` **or** `.webp` | abort write |
| 4.12 | `canonical` = `https://cha0smagicklabs.com/blog/<slug>` | abort write |
| 4.13 | ≥1 money CTA + `primary_product` link resolves to an existing `apps/*.html` or `books/*.html` | abort write |
| 4.14 | ≥2 `related-articles` links resolve to existing blog files | warn (new siblings may not exist yet) |
| 4.15 | `lang="en"`; zero Spanish stopword hits above threshold | warn |
| 4.16 | `id="toc"` present; every TOC href resolves to an in-page id | abort write |
| 4.17 | Exactly one `id` per heading (no duplicate ids) | abort write |
| 4.18 | File size 18–90 KB | warn |

Final aggregate gate: 349/349 files, 0 abort-level failures, mean words ≥ 2400.

---

## 7. PHASE 5 — INTEGRATIONS (mandatory)

### 5.1 `sitemap.xml`
- Append 349 `<url>` blocks before `</urlset>`, preserving existing 532.
- `loc` = `https://cha0smagicklabs.com/blog/<slug>`
- `lastmod` = spec date · `changefreq` = `monthly` · `priority` by funnel:
  BOFU 0.8 · MOFU 0.8 · TOFU 0.7 · HOLD 0.6
- Result: 881 `<url>` entries. Validate as XML.

### 5.2 `llms.txt` (GEO — highest-leverage LLM surface)
- New `## YouTube Deep-Dive Series` section listing all 349 with one-line descriptions.
- Extend `## Recent Blog Posts` with the 40 most recent.
- Add `## Play Store Apps` with per-app keyword lines (ASO reinforcement).
- Keep file valid markdown, keep it < 60 KB.

### 5.3 `blog/index.html`
- Insert 349 `<div class="post-card" data-category="…">` cards immediately after
  `<div class="posts">`, newest first.
- Exact card pattern (verified):
```html
<div class="post-card" data-category="goetia">
<div class="date">September 26, 2026</div>
<h3><a href="mammon-pact-guide-chaos-magick">Mammon Pact Guide: A Complete Chaos Magick Ritual for Wealth</a></h3>
<div class="excerpt">…</div>
<a class="read-more" href="mammon-pact-guide-chaos-magick">Read More →</a>
</div>
```
- Every `data-category` **must** be an existing filter button value. Existing values:
  `paranormal, natal-astrology, goetia, lucid, esp, lunar, tarot, iching, runes, sigils, astral-projection, moon, divination, esp-training, lucid-dreaming, moon-magic, apps, digital-tools, astral, lunar-magic, advanced, basics, dreaming, reviews, free-tools`.
  (Map: money→`sigils`/`basics`; servitors→`basics`/`advanced`; technomancy→`digital-tools`; podcast→`basics`; mind-science→`paranormal`; history→`paranormal`; books→`reviews`.)

### 5.4 Internal link graph
- Build `projects/data/yt-articles/_linkgraph.json`: for each new article, 5 outbound
  (2 new siblings in same cluster + 3 existing 466) and 5 inbound (chosen by
  reciprocal cluster affinity).
- Inject reciprocal inbound links into the *existing* articles' `related-articles`
  sections **only where that section already exists** (never restructure legacy files).
- Skip any legacy file flagged as mojibake (152 files) — report instead.

### 5.5 `glossary.html` cross-links
- 3–5 `<dfn>` glossary terms per new article link to `../glossary.html#<term>`.
- Verify anchor exists in `glossary.html`; drop non-existent anchors.

### 5.6 Analytics / conversion wiring
- Every CTA carries `data-ga-event` matching existing `js/conversion.js` + `js/affiliate.js`
  conventions (`?ref=` on Hotmart links, GA4 `event` on Play buttons).
- No change to core JS → **`sw.js` PRECACHE_URLS stays untouched** (bible §9 rule).

### 5.7 Sitemap sharding
Not required at 881 URLs (limit 50,000). No action.

---

## 8. PHASE 6 — DISTRIBUTION, ASO, BUILD

| ID | Step | Detail |
|---|---|---|
| 6.1 | **ASO keyword sheet** | `projects/data/yt-articles/_aso_keywords.json` — per article, the 3 Play Store keywords it supports, aggregated per app into a ranked 100-char keyword field proposal. Feeds real ASO work, not just blog text. |
| 6.2 | Social queue | `projects/data/yt-articles/_social_queue.json` — per article: X thread (3 posts), Telegram post w/ video embed, Discord post, Pinterest pin (2 pins: 1000×1500 + text overlay caption). Consumed by `projects/scripts/social-publish.js`. **Drafted, not auto-posted.** |
| 6.3 | Lead-magnet alignment | new-series link added to `lead-magnet/quickstart-guide-chaos-magick-en.html` |
| 6.4 | Root pages | add a "YouTube Deep-Dive Series" strip to `index.html` (max 6 featured) + link to `blog/index.html` |
| 6.5 | Bundle CTA | confirm `books/bundle` target exists for HOLD-stage CTAs |
| 6.6 | Build | `npm run build:js` + `npm run build:css` **only if** core assets changed (they do not) |
| 6.7 | Validate | full re-run of §6 aggregate gate + XML sitemap parse + `blog/index.html` card count == 466+349 |
| 6.8 | Report | final table: files written, words, avg, funnel distribution, product distribution, category distribution, any legacy mojibake left untouched |

---

## 9. SEO / GEO / ASO PER-ARTICLE CHECKLIST (the #1 ranking contract)

### SEO
- [ ] Unique slug, 3–6 words, keyword-front where natural
- [ ] `meta_title` ≤ 60 chars with primary kw
- [ ] `meta_desc` 140–155 chars, primary kw + benefit + soft CTA
- [ ] H1 unique, primary kw present
- [ ] 8–11 H2s, primary kw in ≥1 H2, secondary kws distributed
- [ ] ≥1800 words, ≥1 real `<table>`, ≥1 `<ol>` procedure
- [ ] 5+ internal links out, 5 in
- [ ] canonical absolute, `og:*` + `twitter:*` complete, image 1200×630
- [ ] `Article` + `BreadcrumbList` + `FAQPage` JSON-LD valid
- [ ] `datePublished` / `dateModified` real
- [ ] in `sitemap.xml` with priority
- [ ] listed on `blog/index.html` with a filter category

### GEO (LLM citation)
- [ ] **Answer-first paragraph**: definitional, self-contained, 40–60 words, in the first 100 words
- [ ] 3–6 `citable_facts` stated as quotable, attributable sentences
- [ ] 5+ `key_terms` defined in-text on first use
- [ ] Comparison table (LLMs cite tables above prose)
- [ ] FAQ block **visible** in HTML, not JS-only, and mirrored in FAQPage JSON
- [ ] Entity names spelled consistently (Mammon, Baphomet, Austin Osman Spare…)
- [ ] Author `Person` + `Organization` + `sameAs` for source attribution
- [ ] Listed in `llms.txt` with a one-line summary
- [ ] `<html lang="en">`, `inLanguage: en`

### ASO
- [ ] App name appears naturally in H1/H2/body where topically honest
- [ ] 3 `aso_keywords` recorded for the Play Store keyword field
- [ ] `app-install` CTA with Play link + `data-ga-event`
- [ ] Store-feature language reused (one-time purchase, no ads, no subscription) — matches the real listing
- [ ] Article slug/title reused as the store's "promotional keyword" candidate

### Funnel / BTL
- [ ] `value_ratio` ≥ 0.70 — value before pitch
- [ ] exactly one `cta_type` primary CTA block, plus one soft secondary
- [ ] free tool offered (TOFU) in ≥80% of articles
- [ ] price stated on the BOFU card (matches `apps-data.js` / real store price)
- [ ] no false claims, no guaranteed-outcome language (trust + policy safety)

---

## 10. RISK REGISTER

| Risk | Likelihood | Mitigation |
|---|---|---|
| Thin/duplicate content → Google demotes whole set | MED | §6 word floor + §2.3 outline-similarity gate + variant pools |
| 152 legacy mojibake files drag down site quality | HIGH (pre-existing) | Do **not** silently fix. Report at 6.8; offer a separate repair pass using the verified `latin1→utf8` transform |
| `blog/index.html` is stale (doesn't list all 466) | CONFIRMED | Only append new cards; do not attempt a full rebuild of the legacy grid |
| Play Store keyword field over-optimisation | MED | §9 ASO caps at 3 keywords/article; aggregate + dedupe at 6.1 |
| 10 MB of new HTML slows deploy | LOW | Static GitHub Pages; no build step change; no sw.js churn |
| Store/app price drift | MED | Generator reads prices from `js/apps-data.js` at write time — never hardcodes |
| Aff cannibalization inside the new set (90 servitors videos) | HIGH | §2.3 rules 1b.4/1b.5/1b.6 — cluster keyword uniqueness + outline Jaccard < 0.6 |

---

## 11. EXECUTION LOG (filled as work proceeds)

| Phase | Status | Notes |
|---|---|---|
| 0 Preflight | ☑ DONE | Baseline captured in `projects/data/yt-articles/_prestate.json` (`s`=112193 html, `l`=13583, `i`=256223 bytes) |
| 1 Specs | ☑ DONE | `specs.json` = 349 specs, all slugs unique. 43 domains, 124 named entities, 225 domainless. Resolvers: subtitle 276, cluster 29, tie+cluster 16, subtitle-hard 3, keyword 25 |
| 1b Anti-cannibal | ☑ DONE | 0 collisions against the 466 pre-existing posts (`_spec_report.json`) |
| 2 Generator | ☑ DONE | `gen_yt_articles.py` renders from authored content records + specs. `qa.py` patched at line 88 to skip `_`-prefixed files so `content/_worklist.json` no longer crashes it |
| 2b Tier A bodies | ☐ SUPERSEDED | The 30-hand-authored tier was replaced by a spec-driven pipeline: every body is authored inline as a `content/_src/bNNx.py` module (C7 forbids delegation), validated by `_emit.py` |
| 3 Generation | ◐ IN PROGRESS | **147 of 349 rendered.** 70 content records authored inline. 202 remain (batch 4 onward). Newest file: `content/_src/b04c.py` (n=105,106,107) |
| 4 QA | ☑ GREEN at 147 | `qa.py` → `reused_h2: none / reused_ngrams: 0 / reused_opening: none / ALL GREEN (147 article(s), 0 failing)`. Run `qa.py` after **every** batch — `_dups.py` under-reports and is a hint only |
| 4b **C11 Monetisation audit + fix** | ☑ DONE | Audit of the first 141 found a bare link row at 84% depth with **zero in-body app mentions** — a failure of C4/C5. Fixed via `_money_patch.py`: `render_app_card()` after the lede + `_money_rows()` closing block. Result: 1,022 `Get … →` CTAs, per-product pitch + price for 12 apps and 7 books, one-payment framing. Rule recorded as **C11** in §0.2 and §3.4.1. Committed `5fd84dc`, pushed `26adceb..5fd84dc main -> main` |
| 4c **C12 hero app in every article** | ☑ DONE | `render_app_card()` rewritten: `spec["products"][0]` is now a hero with linked name, price, its `PITCH` line and a `Get {NAME} →` buy link **inside the article body**; secondary apps/books in one muted line; closes "One payment, no subscription, no account." `build_specs.py` already orders `products` by topical fit, so the hero is the most relevant app per article. Rule recorded as **C12** in §0.2 and §3.4.1, with an explicit warning never to re-sort `spec["products"]` |
| 5 Integrations | ☐ | `integrate.py` not yet run: `sitemap.xml`, `llms.txt`, `blog/index.html` still lack the new articles |
| 6 Distribution/ASO/Build | ☐ | |

---

## 12. FILE MANIFEST (deliverables)

**Reconciled with the delivered implementation** — the original manifest assumed
`projects/scripts/gen_yt_articles.py` and a sharded `specs/01..10-*.json`. Reality is a
flat, self-contained pipeline in `projects/data/yt-articles/`. Entries marked ✱ are
tools built during execution that the original manifest did not anticipate.

```
projects/plans/YT_ARTICLES_ATOMIC_PLAN.md          ← this file
projects/data/yt-articles/
  _preflight.json            ← P0  DONE
  _prestate.json             ← P0  DONE  (baseline snapshot before any change)
  build_catalog.py           ← P1  DONE
  build_entities.py          ← P1  DONE
  build_specs.py             ← P1  DONE  (emits 349 specs)
  specs.json                 ← P1  DONE  *** replaces specs/01..10-*.json ***
  _spec_report.json          ← P1b DONE  (0 collisions vs the 466 legacy posts)
  domains.py domains_core.py domains_ext.py       ← P1  DONE
  entities.py entity_filter.py                    ← P1  DONE
  outline.py titles.py                            ← P1/P2 DONE
  gen_yt_articles.py          ← P2  DONE  *** lives here, not in projects/scripts/ ***
    PITCH / CARD_STYLE / _prod / render_app_card / _money_rows   ← C11 money blocks
  _money_patch.py            ← ✱ one-off, idempotent-safe patcher that added C11
  _emit.py                   ← ✱ validates content/_src/b*.py → content/<n>.json
  _fill_from_spec.py         ← ✱ injects the 8 boilerplate keys from specs.json
  _lede.py                   ← ✱ LEDGES = {n: "..."} override map, appended at END
  _src/_pool.py              ← ✱ 544-entry {slug: title} map, regenerable
  _src/b01a..bNNx.py         ← P3  THE AUTHORED BODIES  *** replaces bodies/*.html ***
  _src/_fix01.py _fix02.py   ← ✱ collision patchers (H2 single-line patches only)
  content/<n>.json           ← P3  64 written of 349
  _worklist.json             ← ✱ remaining-n batches, grouped
  qa.py slop.py integrate.py ← P4/P5 DONE
  _dups.py                   ← ✱ corpus duplicate-H2 + 8-gram report (hint only)
  _why.py                    ← ✱ per-article gate problems, short output
  _diag_content.py _repair_content.py             ← ✱ malformed-JSON repair
  _locate_failures.py _audit_resolver.py _patch_entity.py _patch_resolver.py
  _patch_strip.py _verify_titles.py _dump_vocab.py
  _linkgraph.json            ← P5.4  PENDING
  _aso_keywords.json         ← P6.1  PENDING
  _social_queue.json         ← P6.2  PENDING
  _report.json               ← P6.8  PENDING
blog/<slug>.html             ← P3  141 of 349 written
sitemap.xml   (532 → 881)    ← P5.1  PENDING  (integrate.py)
llms.txt                      ← P5.2  PENDING
blog/index.html               ← P5.3  PENDING
```
