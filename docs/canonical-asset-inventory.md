# Canonical Asset Inventory

**Inventory version:** 1.2.0
**Evidence date:** 2026-09-25
**Repository baseline:** HEAD `f219f9d` (re-verified after the plan-sync commit)
**Canonical production origin:** `https://cha0smagicklabs.com` (`CNAME` present)
**Supersedes:** inventory version 1.1.0, which was verified against the stale baseline `751985d` and understated every count below

## 1. Purpose and evidence boundary

This document freezes the repository's canonical public/operational surface for P0-01. It is an evidence ledger, not proof that a production listing, checkout, payment, or legal approval exists. External publication state remains unverified unless explicitly stated.

Primary local sources:

- `sitemap.xml` — 532 URL entries; SHA-256 `574d3a1d84903a1c06513f19efdb65bac3091f2a2b738b6651a866327df9d584`; last regenerated `2026-09-24T19:05:20Z` (i.e. *after* inventory v1.1.0 was written, which is why v1.1.0 recorded 492 entries).
- `robots.txt` — declares `https://cha0smagicklabs.com/sitemap.xml`.
- `scripts/bots/data/offers.json` — reconciled offer catalog; source does not prove publication or sales.
- `docs/revenue-catalog-reconciliation.md` — catalog reconciliation and external blockers.
- `scripts/verify_tech_debt.py` — defines the governed HTML working set.
- `docs/thin-articles-progress.md` — generated content inventory; last regenerated `2026-09-24T16:47:38Z`.

The inventory is intentionally descriptive. It does not change prices, package IDs, URLs, listing states, pages, or checkout configuration.

## 2. Scope decision

**Decision (v1.2.0): the canonical public surface is the Git-tracked governed HTML set — 568 files. The filesystem governed set (569) is the working candidate set, and the one-file difference is named, not hidden.**

The working-set rule is unchanged and is what `scripts/verify_tech_debt.py` scans:

```text
ROOT.rglob("*.html")
minus paths containing node_modules, .git, projects, auto-shorts, or .github
```

Recomputed on 2026-09-25 against HEAD `f219f9d`:

```text
622 filesystem HTML   (excluding only .git and node_modules)
  = 569 governed working-set HTML
  + 53  excluded dependency / third-party-source / demo artifacts (section 7)
```

The `569` is independently confirmed by the auditor: `python scripts/verify_tech_debt.py` reports "pages scanned: 569". Two different implementations of the same rule agreeing on 569 is the strongest local evidence available for that number.

The filesystem total is **622**, not the 582 recorded in v1.1.0.

### 2.1 Resolution of the 524/577 and 529/582 "discrepancies"

These were never two competing definitions. They are three snapshots of one invariant, where the governed-to-filesystem delta is **constant at exactly 53**:

| Snapshot | Governed | Filesystem | Delta | Baseline |
|---|---:|---:|---:|---|
| First ledger draft | 524 | 577 | 53 | pre-legal-drafts |
| Inventory v1.1.0 | 529 | 582 | 53 | `751985d` |
| Inventory v1.2.0 (this file) | 569 | 622 | 53 | `f219f9d` |

Growth between v1.1.0 and v1.2.0 is **+40 governed** and **+40 filesystem**, and it is fully attributable: `tools/*.html` went from 22 to 62 as the free-tool surface expanded by 40 tools. Nothing else in the governed set changed size. The invariant `filesystem = governed + 53` held at every snapshot, so there is no unresolved discrepancy to escalate — only growth to record.

**None of these counts proves production publication.** They prove what the working tree and the tracked set contain.

### 2.2 Tracked surface versus working set

| Set | Count | Meaning |
|---|---:|---|
| Canonical public surface (git-tracked, governed) | **568** | Published by GitHub Pages from `main`; this is the release surface |
| Governed working set (filesystem) | **569** | Canonical surface plus locally-present ungoverned-by-git files |
| Difference | **1** | `checklist-ventas.html` only |

`checklist-ventas.html` is present on disk, is in the governed working set, and is **excluded from source control** by `.gitignore:33:/checklist-ventas.html` (confirmed via `git check-ignore -v`). It is therefore **not deployable and not published**. Its asset state is recorded as `local_candidate_untracked_gitignored`, not as a release artifact.

`git ls-files "*.html"` returns **583** tracked HTML files. Of those, **15 sit inside the section 7 exclusion paths** (under `projects/` and `tools/auto-shorts/`) and are nonetheless tracked on `main` — which means they *are* served by GitHub Pages even though this inventory excludes them from the governed surface.

**Consequence that must not be glossed over:** the section 7 exclusion set is a *governance-scope* decision, not a *publication* fact. 38 of the 53 excluded files are untracked (genuinely not published); **15 are tracked and therefore live in production**. Treating "excluded" as "not published" would understate the real public surface. This is recorded here as a known, deliberate, and unresolved classification debt; retiring those 15 paths from `main` is out of scope for P0-01, which may not delete pages.

GitHub Pages automation present on this baseline: `.github/workflows/` contains `bot-deploy.yml`, `ci.yml`, `lighthouse.yml`, `pages.yml`, `security-scan.yml`, `social-publish.yml`, `staging.yml`.

## 3. Governed asset groups

All groups are owned by the repository maintainer unless an external platform is shown. “Local candidate” means present in this working tree and intended for the public surface; it does not mean production availability.

| Asset ID / range | Local scope | Count | Canonical URL rule | Owner | State | Last verified |
|---|---|---:|---|---|---|---|
| `ROOT-001..011` | root HTML (`404`, `best-occult-apps-android`, `checklist-ventas`, `glossary`, `index`, `privacy-policy`, `terms`, `cookie-policy`, `refund-policy`, `disclaimer`, `affiliate-disclosure`) | 11 | `https://cha0smagicklabs.com/<path>` | Repository maintainer | `local_candidate`; five legal pages `legal_owner_pending` | 2026-09-25 |
| `APP-001..012` | `apps/*.html` | 12 | `https://cha0smagicklabs.com/apps/<filename>` | Repository maintainer | `local_candidate` | 2026-09-25 |
| `BLOG-001..467` | `blog/*.html` | 467 | `https://cha0smagicklabs.com/blog/<filename>` | Repository maintainer | `local_candidate`; thin state tracked separately | 2026-09-25 |
| `BOOK-001..007` | `books/*.html` | 7 | `https://cha0smagicklabs.com/books/<filename>` | Repository maintainer | `local_candidate` | 2026-09-25 |
| `LANDING-001..006` | `landing-pages/*.html` | 6 | `https://cha0smagicklabs.com/landing-pages/<filename>` | Repository maintainer | `local_candidate`; commercial state unverified | 2026-09-25 |
| `LEAD-001..002` | `lead-magnet/*.html` | 2 | `https://cha0smagicklabs.com/lead-magnet/<filename>` | Repository maintainer | `local_candidate` | 2026-09-25 |
| `PAGE-001..002` | `pages/*.html` | 2 | `https://cha0smagicklabs.com/pages/<filename>` | Repository maintainer | `local_candidate` | 2026-09-25 |
| `TOOL-001..062` | governed `tools/*.html` outside excluded tooling paths | 62 (61 tools + `tools/index.html` hub) | `https://cha0smagicklabs.com/tools/<filename>` | Repository maintainer | `local_candidate`; all 61 tool pages carry `WebApplication` JSON-LD and a `data/tool-funnels.json` funnel entry | 2026-09-25 |
| **Total** | governed HTML working set | **569** | canonical production origin above | — | — | — |
| **Canonical public surface** | governed **and** git-tracked | **568** | as above | — | excludes `checklist-ventas.html` (gitignored) | — |

`checklist-ventas.html` is present in the governed working set but is **excluded from source control** by `.gitignore` (rule `/checklist-ventas.html`, line 33; confirmed with `git check-ignore -v`). It is therefore recorded with state `local_candidate_untracked_gitignored`: it is in scope of the working set, it is **not** part of the 568-file canonical public surface, and it is not deployed. It is not silently counted as a tracked release artifact.

Tool-count cross-check: `tools/*.html` contains **62** files, of which `tools/index.html` is a navigation hub and not a tool. The remaining **61** are exactly the 61 keys in `data/tool-funnels.json` and exactly the 61 `WebApplication` JSON-LD entities reported by `scripts/verify_tech_debt.py`. Zero funnel keys lack a file, and zero tool files lack a funnel entry.

## 4. Offer and checkout inventory

The following is the complete offer row set from `scripts/bots/data/offers.json`: **12 apps, 7 books, and 1 bundle** — recomputed on 2026-09-25 from the JSON object keys, and matching the 12 `apps/*.html` and 7 `books/*.html` governed counts exactly. Prices and IDs are copied from the catalog; no price is recalculated or invented.

The catalog's own `_meta` block declares `reconciledAt: 2026-09-23`, `externalListingStatus: unverified`, `priceSource: public app page`, and states the file is the source of truth for bot offers. That self-declared `unverified` status is consistent with the state column used throughout this section: presence in the catalog is not evidence of a live listing or a sale.

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
| Catalog price | $19.99 USD (catalog also records `originalPrice` $41.93 USD) |
| Checkout | `https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W` |
| Funnel | `https://cha0smagicklabs.com/landing-pages/books-bundle.html` |
| Image | **absent** — the catalog field `image` is `null` for the bundle; no image asset is evidenced for this offer |
| Owner | Repository maintainer / Hotmart platform owner unverified |
| State | `external_url_observed_sale_unverified` |
| Last verified | 2026-09-25 against `scripts/bots/data/offers.json` |

The observed URL is not a transaction, refund, or net-revenue proof. The missing bundle image is recorded as a catalog gap, not as a pricing or listing defect, and no image was fabricated to close it.

## 5. Ownership and lifecycle rules

- Repository maintainer owns source files, canonical metadata, internal links, and local verification.
- External platform owners remain unassigned where the repository lacks a real owner record.
- `local_candidate` means locally present and in scope; it must not be reported as live commerce.
- `external_listing_unverified` means the catalog contains a target but Play evidence is absent.
- `external_url_observed_sale_unverified` means a checkout URL was observed but no completed transaction was evidenced.
- A future state change requires a dated evidence source and an updated inventory version.
- No revenue, conversion, audience, legal approval, or listing availability may be inferred from this file.

## 6. Sitemap and metadata limitations

The sitemap has **532** URL entries, while the governed working set has **569** HTML files — a coverage gap of 37. The local metadata pass reduced the missing-canonical count to zero, and that still holds in substance: all **569** governed files emit a `rel="canonical"` tag (0 files without the tag). However, **one of those tags points at the wrong origin** and is recorded as an open defect in section 6.1, so the count of correct production-origin canonicals is **568 of 569**. Canonical presence and sitemap inclusion remain separate questions that require indexability review.

The 37 files that have a correct canonical but no matching sitemap path are enumerated below so the gap is auditable rather than asserted. None of them is assumed to be an error: some are intentionally noindex, private, or utility pages. **No path was silently added to or removed from the sitemap by this inventory**, and no classification is asserted where the repository has not been reviewed.

| Group | Count | Paths with canonical but no sitemap entry |
|---|---:|---|
| Root / utility / legal | 6 | `404.html`, `affiliate-disclosure.html`, `checklist-ventas.html`, `cookie-policy.html`, `disclaimer.html`, `refund-policy.html` |
| `landing-pages/` | 6 | `affiliate-dashboard.html`, `affiliate-terms.html`, `apps-bundle.html`, `books-bundle.html`, `complete-access.html`, `flash-sale.html` |
| `lead-magnet/` | 2 | `guia-rapida-magia-caos-es.html`, `quickstart-guide-chaos-magick-en.html` |
| `pages/` | 2 | `about.html`, `app-details.html` |
| `tools/` | 21 | `activador-servidores.html`, `astrology-sign-calculator.html`, `candle-color-calculator.html`, `digital-pendulum.html`, `gnosis-timer.html`, `goetic-spirit-selector.html`, `iching.html`, `iching-changing-lines.html`, `lunar-phase.html`, `moon-voc.html`, `planetary-hours.html`, `planetary-kamea-sigil.html`, `reality-check-tracker.html`, `rune-drawer.html`, `sigil-charging-timer.html`, `sigil-generator.html`, `spell-builder.html`, `tarot-yes-no.html`, `tengwar-transcriber.html`, `viking-runes.html`, `zener-esp-trainer.html` |
| **Total** | **37** | — |

Note that `checklist-ventas.html` appears in this list while being gitignored and untracked, so it is neither in the sitemap nor deployable; its canonical tag is a local-only artifact.

### 6.1 Open defect: `blog/witchcraft-for-beginners-guide.html` canonical points at the wrong origin

Found while re-verifying the canonical coverage on 2026-09-25. This is the single exception to the 569/569 canonical-tag coverage:

| Field | Observed value |
|---|---|
| File | `blog/witchcraft-for-beginners-guide.html` |
| Emitted canonical | `https://www.cha0smagicklabs.com/blog/witchcraft-for-beginners-guide` |
| Expected canonical | `https://cha0smagicklabs.com/blog/witchcraft-for-beginners-guide.html` |
| Defects | (1) wrong host — `www.cha0smagicklabs.com` instead of the production origin in `CNAME`, which is `cha0smagicklabs.com` with no `www`; (2) extensionless path — the deployed file is a real `.html` path, so the canonical does not resolve to a served URL |

Why this matters: a canonical on a different host instructs crawlers to consolidate the page's ranking signals onto `www.cha0smagicklabs.com`. If that host is not served, the page risks being dropped from the index entirely; if it is served, the page competes with itself. Either way this is a live SEO defect on a governed `blog/` asset.

**It was deliberately not fixed as part of P0-01.** This task's mandate is to freeze and record the canonical surface; it may not change pages, and a canonical rewrite is a page change that belongs to the separately scoped SEO remediation (P1-01). The defect is recorded here, not silently repaired, and no attempt was made to guess whether `www.` resolves in production — that check requires external DNS evidence that does not exist locally.

`index.html` emits `https://cha0smagicklabs.com/` (bare origin, trailing slash). That is correct for a homepage and is **not** counted as a defect.

These gaps require a separately scoped SEO remediation (P1-01) that must classify each path as indexable, noindex, retired, or sitemap exception, and fix the section 6.1 canonical. They are recorded here so the inventory remains auditable.

## 7. Explicit 53-file exclusion set

These 53 files are excluded from the governed public/operational inventory because they sit under `projects/` or `tools/auto-shorts/`, matching the verifier's explicit exclusions. They are not deleted or modified by this inventory.

**Re-verified 2026-09-25: the set is exact and has not drifted.** Recomputing the exclusion rule against the filesystem returns 53 files; all 53 are listed below, none listed below is now in scope, and no new excluded file has appeared. Zero drift in both directions.

**But exclusion does not mean unpublished.** 15 of these 53 files are tracked on `main` and are therefore served by GitHub Pages: `projects/docs/email-welcome-sequence.html`, the 13 `projects/pinterest-pins/output/*.html` files, `projects/pinterest-pins/pin-batch.html`, `pin-renderer.html`, and `pin-template.html`. The remaining 38 are untracked extracted/dependency artifacts. Retiring the 15 tracked paths from production is a separate decision that P0-01 explicitly may not take, because this task may not delete or unpublish pages; it is logged here as classification debt.

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

**Verification performed locally on 2026-09-25 against HEAD `f219f9d`, on a clean working tree.** This supersedes the v1.1.0 record, which was verified against `751985d` and understated every count. Commands used are reproducible offline and require no credentials:

| Claim | Command / source | Result |
|---|---|---|
| 569 governed HTML | filesystem walk applying the section 2 rule, cross-checked against `python scripts/verify_tech_debt.py` | 569, both agree |
| 622 filesystem HTML | filesystem walk excluding only `.git` and `node_modules` | 622 |
| delta = 53 | 622 − 569 | 53, matches section 7 exactly |
| exclusion set unchanged | recompute rule, diff against section 7 list | 0 stale, 0 new |
| 568 canonical public surface | `git ls-files "*.html"` ∩ governed | 568 of 569 tracked |
| 1 untracked governed file | `git check-ignore -v checklist-ventas.html` | ignored by `.gitignore:33` |
| 15 tracked-but-excluded files | `git ls-files "*.html"` ∩ exclusion paths | 15 |
| 532 sitemap entries | count of `<loc>` in `sitemap.xml` | 532 |
| sitemap SHA-256 | `sha256(sitemap.xml)` | `574d3a1d…7df9d584` |
| 0 missing canonical tag | canonical-tag presence scan over all 569 governed files | 0 files without a `rel="canonical"` tag |
| **1 wrong-origin canonical** | canonical `href` scanned for the `cha0smagicklabs.com` origin | **1 defect**: `blog/witchcraft-for-beginners-guide.html`, see section 6.1 |
| 37 canonical-without-sitemap | canonical target set minus sitemap path set | 37, enumerated in section 6 |
| 61 tools = 61 funnels = 61 `WebApplication` | `tools/*.html` minus `index.html`, `data/tool-funnels.json` keys, `verify_tech_debt.py` JSON-LD tally | 61 = 61 = 61 |
| 12 apps / 7 books / 1 bundle | key count of `scripts/bots/data/offers.json` | 12 / 7 / 1 |

No working-tree file outside this ledger was modified, and no price, URL, page, package ID, or checkout configuration was altered. `git status --porcelain` at verification time reported exactly one entry, this ledger.

The untracked temporary file `_verify_nde_tmp.py` **is still present** on this baseline (1.536 bytes, mtime `2026-09-23T17:44:32Z`). It is untracked and ignored by `.gitignore:29:_*_tmp.py`, so it is outside both the 568-file canonical surface and the 569-file working set. It was read only to confirm its existence and was **not** modified or deleted by this inventory. (Inventory v1.1.0 described the same file; its presence is unchanged.)

### 8.1 What this inventory still does not prove

This ledger is a local evidence record. It closes the P0-01 requirement to freeze the canonical surface and to resolve or explicitly exclude the 524/577 and 529/582 historical discrepancies. It does **not** close any external P0 gate. Still required elsewhere: Play Console exports and public listing URLs, real Hotmart transaction and checkout evidence, payment/finance/refund exports, legal-owner review with dates, live analytics/CRM evidence, production deployment smoke evidence, a decision on whether the 15 tracked-but-excluded paths should stay published, and the section 6.1 canonical repair.

### 8.2 Known open items carried forward

| # | Item | Routed to |
|---|---|---|
| 1 | `blog/witchcraft-for-beginners-guide.html` canonical on the wrong host, extensionless | P1-01 SEO remediation (section 6.1) |
| 2 | 15 tracked files inside the section 7 exclusion paths are still published | P0-01 follow-up; needs an owner decision, not a local edit |
| 3 | 37 correct canonicals absent from the 532-entry sitemap, unclassified as indexable / noindex / retired | P1-01 SEO remediation |
| 4 | `checklist-ventas.html` is a governed page that gitignore prevents from ever shipping | P0-01 follow-up; either track it or drop it from the working set |
| 5 | All 12 app and 1 bundle offer states remain `external_listing_unverified` / `sale_unverified` | P0-02 / P0-04 (external evidence) |
