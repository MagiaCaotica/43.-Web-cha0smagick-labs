# Canonical Asset Inventory

**Inventory version:** 1.1.0
**Evidence date:** 2026-09-24
**Repository baseline:** HEAD `751985d`
**Canonical production origin:** `https://cha0smagicklabs.com`

## 1. Purpose and evidence boundary

This document freezes the repository's canonical public/operational surface for P0-01. It is an evidence ledger, not proof that a production listing, checkout, payment, or legal approval exists. External publication state remains unverified unless explicitly stated.

Primary local sources:

- `sitemap.xml` — 492 URL entries; SHA-256 `0e0fb738565568697e4790bd55d4a528d17d39d504cfa0851c3d6099c6259751`; last generated `2026-09-24T15:15:55Z`.
- `robots.txt` — declares `https://cha0smagicklabs.com/sitemap.xml`.
- `scripts/bots/data/offers.json` — reconciled offer catalog; source does not prove publication or sales.
- `docs/revenue-catalog-reconciliation.md` — catalog reconciliation and external blockers.
- `scripts/verify_tech_debt.py` — defines the governed HTML working set.
- `docs/thin-articles-progress.md` — generated content inventory; last regenerated `2026-09-24T16:47:38Z`.

The inventory is intentionally descriptive. It does not change prices, package IDs, URLs, listing states, pages, or checkout configuration.

## 2. Scope decision

The canonical scope is the **tracked/public repository surface plus the governed working-tree files that the local verifier scans**, excluding dependency caches, extracted third-party source, project demos, and auto-shorts tooling artifacts.

The verification rule is:

```text
ROOT.rglob("*.html")
minus paths containing node_modules, .git, projects, auto-shorts, or .github
```

This yields **529 governed HTML files** after the five local legal drafts were added.

The broader filesystem contains **582 HTML files** after excluding only `.git` and `node_modules`. The difference is exactly **53 excluded files**, listed in section 7. Therefore:

```text
582 filesystem HTML = 529 governed public/operational HTML + 53 excluded dependency/source/demo artifacts
```

The historical 524 versus 577 discrepancy is resolved as a historical snapshot; the current working-tree count is 529 versus 582. Neither count proves production publication.

## 3. Governed asset groups

All groups are owned by the repository maintainer unless an external platform is shown. “Local candidate” means present in this working tree and intended for the public surface; it does not mean production availability.

| Asset ID / range | Local scope | Count | Canonical URL rule | Owner | State | Last verified |
|---|---|---:|---|---|---|---|
| `ROOT-001..011` | root HTML (`404`, `best-occult-apps-android`, `checklist-ventas`, `glossary`, `index`, `privacy-policy`, `terms`, `cookie-policy`, `refund-policy`, `disclaimer`, `affiliate-disclosure`) | 11 | `https://cha0smagicklabs.com/<path>` | Repository maintainer | `local_candidate`; five legal pages `legal_owner_pending` | 2026-09-24 |
| `APP-001..012` | `apps/*.html` | 12 | `https://cha0smagicklabs.com/apps/<filename>` | Repository maintainer | `local_candidate` | 2026-09-24 |
| `BLOG-001..467` | `blog/*.html` | 467 | `https://cha0smagicklabs.com/blog/<filename>` | Repository maintainer | `local_candidate`; thin state tracked separately | 2026-09-24 |
| `BOOK-001..007` | `books/*.html` | 7 | `https://cha0smagicklabs.com/books/<filename>` | Repository maintainer | `local_candidate` | 2026-09-24 |
| `LANDING-001..006` | `landing-pages/*.html` | 6 | `https://cha0smagicklabs.com/landing-pages/<filename>` | Repository maintainer | `local_candidate`; commercial state unverified | 2026-09-24 |
| `LEAD-001..002` | `lead-magnet/*.html` | 2 | `https://cha0smagicklabs.com/lead-magnet/<filename>` | Repository maintainer | `local_candidate` | 2026-09-24 |
| `PAGE-001..002` | `pages/*.html` | 2 | `https://cha0smagicklabs.com/pages/<filename>` | Repository maintainer | `local_candidate` | 2026-09-24 |
| `TOOL-001..022` | governed `tools/*.html` outside excluded tooling paths | 22 | `https://cha0smagicklabs.com/tools/<filename>` | Repository maintainer | `local_candidate` | 2026-09-24 |
| **Total** | governed HTML | **529** | canonical production origin above | — | — | — |

`checklist-ventas.html` is present in the governed working set but ignored by `.gitignore` and not tracked. It is explicitly included with that source-control limitation; it is not silently counted as a tracked release artifact.

## 4. Offer and checkout inventory

The following is the complete offer row set from `scripts/bots/data/offers.json`: 12 apps, 7 books, and 1 bundle. Prices and IDs are copied from the catalog; no price is recalculated or invented.

### 4.1 App offers

**Common state for all app rows:** `external_listing_unverified`. The Play URL is the catalog target, not evidence that the listing is live, purchasable, or approved.

| Asset ID | App | Package ID | Catalog price | Play target |
|---|---|---|---:|---|
| `APP-PSI-GYM` | PSI GYM: Zener Cards & ESP | `com.cha0smagicklabs.zenercards` | $3.99 | `https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards` |
| `APP-ARCANA-GOETIA` | Arcana Goetia: Ritual & Sigils | `com.cha0smagick.sigilgeneratorfinal` | $3.99 | `https://play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal` |
| `APP-NORSE-RUNE` | Norse Rune Oracle | `com.japps.norse_oracle` | $3.99 | `https://play.google.com/store/apps/details?id=com.japps.norse_oracle` |
| `APP-DREAM-MACHINE` | Dream Machine: Lucid Dreaming | `com.cha0smagick.dreammachine` | $3.99 | `https://play.google.com/store/apps/details?id=com.cha0smagick.dreammachine` |
| `APP-CHAOS-SIGIL` | Chaos Sigil Generator | `com.app.goetiansealsgeneratorapp` | $3.99 | `https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp` |
| `APP-ASTRAL-LAB` | Astral Lab: Natal Chart & Astrology | `com.cha0smagicklabs.astralchart` | $6.99 | `https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart` |
| `APP-EERIE-ROADS` | Eerie Roads: Haunted Map | `com.cha0smagicklabs.eerieroads` | $9.99 | `https://play.google.com/store/apps/details?id=com.cha0smagicklabs.eerieroads` |
| `APP-ICHING-ORACLE` | I Ching Oracle | `com.app.ichingoracle` | $3.99 | `https://play.google.com/store/apps/details?id=com.app.ichingoracle` |
| `APP-LUCID-DREAM` | Lucid Dream: Astral Projection | `com.cha0smagicklabs.luciddreamer` | $9.99 | `https://play.google.com/store/apps/details?id=com.cha0smagicklabs.luciddreamer` |
| `APP-LUNAR-CALCULATOR` | Lunar Phase Calculator | `com.lunarapp.app` | $3.99 | `https://play.google.com/store/apps/details?id=com.lunarapp.app` |
| `APP-NOCTEM` | NOCTEM: Professional Paranormal Investigation Suite | `com.cha0smagicklabs.noctemapp` | $14.99 | `https://play.google.com/store/apps/details?id=com.cha0smagicklabs.noctemapp` |
| `APP-RIDER-WAITE` | Rider-Waite Tarot Complete | `com.cha0smagick.unofficialraiderwaite` | $9.99 | `https://play.google.com/store/apps/details?id=com.cha0smagick.unofficialraiderwaite` |

**Owner:** repository maintainer for local catalog and app pages.
**Verified:** 2026-09-24 against `scripts/bots/data/offers.json`.
**External limitation:** no Play Console export or transaction evidence is present.

### 4.2 Book offers

| Asset ID | Book | Catalog price | Canonical page | State |
|---|---|---:|---|---|
| `BOOK-CODEX-CHAOTICUS` | Codex Chaoticus | $4.99 | `https://cha0smagicklabs.com/books/codex-chaoticus.html` | `local_candidate` |
| `BOOK-TAROT-CHAOS` | Tarot Chaos | $9.99 | `https://cha0smagicklabs.com/books/tarot-chaos.html` | `local_candidate` |
| `BOOK-SERVITORS` | Magical Servitors Manual | $4.99 | `https://cha0smagicklabs.com/books/magical-servitors-manual.html` | `local_candidate` |
| `BOOK-RUNES` | Treatise of Chaos Hunter Runes | $4.99 | `https://cha0smagicklabs.com/books/treatise-chaos-hunter-runes.html` | `local_candidate` |
| `BOOK-OUIJA` | Ouija Cazadora | $4.99 | `https://cha0smagicklabs.com/books/ouija-cazadora.html` | `local_candidate` |
| `BOOK-LIBER-LVPINUX` | Liber Lvpinux | $4.99 | `https://cha0smagicklabs.com/books/liber-lvpinux.html` | `local_candidate` |
| `BOOK-MIND-THE-GAP` | Mind The Gap | $9.99 | `https://cha0smagicklabs.com/books/mind-the-gap.html` | `local_candidate` |

**Owner:** repository maintainer.
**Verified:** 2026-09-24 against the catalog.
**External limitation:** catalog presence does not prove a successful digital delivery or sale.

### 4.3 Bundle offer

| Field | Value |
|---|---|
| Asset ID | `BUNDLE-BOOKS` |
| Product | Esoteric Books Bundle |
| Hotmart ID | `V107097103W` |
| Catalog price | $19.99 |
| Checkout | `https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W` |
| Funnel | `https://cha0smagicklabs.com/landing-pages/books-bundle.html` |
| Owner | Repository maintainer / Hotmart platform owner unverified |
| State | `external_url_observed_sale_unverified` |
| Last verified | 2026-09-24 |

The observed URL is not a transaction, refund, or net-revenue proof.

## 5. Ownership and lifecycle rules

- Repository maintainer owns source files, canonical metadata, internal links, and local verification.
- External platform owners remain unassigned where the repository lacks a real owner record.
- `local_candidate` means locally present and in scope; it must not be reported as live commerce.
- `external_listing_unverified` means the catalog contains a target but Play evidence is absent.
- `external_url_observed_sale_unverified` means a checkout URL was observed but no completed transaction was evidenced.
- A future state change requires a dated evidence source and an updated inventory version.
- No revenue, conversion, audience, legal approval, or listing availability may be inferred from this file.

## 6. Sitemap and metadata limitations

The sitemap has 492 URL entries, while the governed working set has 529 HTML files. This is a known coverage gap, not a reason to silently alter either count. The local metadata pass reduced the missing canonical count to zero; canonical tags and sitemap inclusion are separate questions and require indexability review.

The current canonical-vs-sitemap comparison finds 40 governed files with a canonical but no matching sitemap path, including root/utility pages, the five legal drafts, landing pages, lead magnets, `pages/about.html`, `pages/app-details.html`, and governed tool/index pages. Some may be intentional noindex/private/utility pages, so the inventory records the gap without declaring every difference an error. The next SEO pass must classify each path as indexable, noindex, retired, or sitemap exception.

These gaps require a separately scoped SEO remediation. They are recorded here so the inventory remains auditable.

## 7. Explicit 53-file exclusion set

These files are excluded from the governed public/operational inventory because they are under `projects/` or `tools/auto-shorts/`, matching the verifier's explicit exclusions. They are not deleted or modified by this inventory.

1. `projects/auto-shorts-full/packages/ffcreator/docs/index.html`
2. `projects/auto-shorts-full/packages/inkpaint/examples/blank.html`
3. `projects/auto-shorts-full/packages/inkpaint/examples/index.html`
4. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/community.html`
5. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/developer.html`
6. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/drawvg-reference.html`
7. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/faq.html`
8. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/fate.html`
9. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-all.html`
10. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-bitstream-filters.html`
11. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-codecs.html`
12. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-devices.html`
13. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-filters.html`
14. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-formats.html`
15. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-protocols.html`
16. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-resampler.html`
17. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-scaler.html`
18. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg-utils.html`
19. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffmpeg.html`
20. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffplay-all.html`
21. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffplay.html`
22. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffprobe-all.html`
23. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/ffprobe.html`
24. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/general.html`
25. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/git-howto.html`
26. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libavcodec.html`
27. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libavdevice.html`
28. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libavfilter.html`
29. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libavformat.html`
30. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libavutil.html`
31. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libswresample.html`
32. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/libswscale.html`
33. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/mailing-list-faq.html`
34. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/nut.html`
35. `projects/auto-shorts/ffmpeg_extracted/ffmpeg-master-latest-win64-gpl/doc/platform.html`
36. `projects/docs/email-welcome-sequence.html`
37. `projects/pinterest-pins/output/01-chaos-magick-quote.html`
38. `projects/pinterest-pins/output/02-tarot-app.html`
39. `projects/pinterest-pins/output/03-rune-meanings.html`
40. `projects/pinterest-pins/output/04-sigil-magic.html`
41. `projects/pinterest-pins/output/05-witchcraft-tips.html`
42. `projects/pinterest-pins/output/06-astrology-app.html`
43. `projects/pinterest-pins/output/07-goetia-sigils.html`
44. `projects/pinterest-pins/output/08-lucid-dreaming.html`
45. `projects/pinterest-pins/output/09-esoteric-books.html`
46. `projects/pinterest-pins/output/10-zener-esp.html`
47. `projects/pinterest-pins/output/11-spell-builder.html`
48. `projects/pinterest-pins/pin-batch.html`
49. `projects/pinterest-pins/pin-renderer.html`
50. `projects/pinterest-pins/pin-template.html`
51. `tools/auto-shorts/packages/ffcreator/docs/index.html`
52. `tools/auto-shorts/packages/inkpaint/examples/blank.html`
53. `tools/auto-shorts/packages/inkpaint/examples/index.html`

## 8. Verification record and limitations

Verification performed locally on 2026-09-24 against HEAD `751985d`. The current working tree contains the documented article, legal, metadata, analytics-test, sitemap and evidence changes described in this ledger, plus the preserved untracked `_verify_nde_tmp.py`; this inventory did not modify that temporary file. No commit was created.

This inventory does **not** close external P0 gates. Still required for those gates: Play Console exports, real Hotmart transaction/checkout evidence, payment and finance exports, legal-owner review, live analytics/CRM evidence, and production deployment smoke evidence.
