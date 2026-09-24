# Legal and Data Vendor Matrix

**Version:** 1.0.0  
**Evidence date:** 2026-09-24  
**Status:** Local working draft — pending review by the legal/privacy owner

This matrix records vendors and data flows visible in the repository. It is not a legal opinion, privacy-policy approval, consent audit, or proof that a production integration is active.

## Vendor inventory

| Vendor / service | Repository evidence | Data or purpose observed | Current state | Required owner evidence |
|---|---|---|---|---|
| Google Analytics 4 | `G-V6LHCPN9TK` in root/legal templates and conversion code; consent default denied in governed legal templates | Web measurement, page views, events, ecommerce parameters | Locally configured; production collection not independently verified | GA4 property/admin export, consent-mode review, live event evidence |
| Google Play Store | `scripts/bots/data/offers.json` app package IDs and Play target URLs | App discovery and download/conversion destination | Catalog targets present; listing state explicitly `external_listing_unverified` | Play Console export and listing owner |
| Hotmart | Bundle ID `V107097103W`, observed checkout URL, related landing pages | Digital product checkout and payment handoff | URL observed; sale, refund, and transaction state unverified | Checkout transaction export, platform owner, finance reconciliation |
| MailerLite / email automation | Placeholder configuration in `js/conversion.js` and related scripts | Newsletter/lead capture integration | Placeholder/unconfigured in inspected code; no live endpoint evidence | Vendor account owner, endpoint config, consent basis, live test |
| Meta / Google Ads | Placeholder IDs and conversion hooks in `js/conversion.js` | Paid-traffic attribution | No verified ad account or pixel/catalog ID | Authorized ad account export and event reconciliation |
| Giscus | Shared comment script in page tails | User comments/discussion | Locally embedded; comment provider configuration not treated as revenue evidence | Provider configuration and moderation/privacy review |
| Google Translate | Hidden translation container and language sidebar in legal template | Optional language translation | UI feature present; no translation data-flow approval inferred | Provider/privacy review and retention settings |
| Service worker (`sw.js`) | Shared tail on root/legal pages | Offline/cache behavior | Local implementation only | Cache/update behavior and production verification |
| Hosting / GitHub Pages | Project Bible and repository deployment conventions; canonical production origin in sitemap | Static site delivery | Local configuration and canonical URLs present; live deploy not verified by this matrix | Deployment owner, domain/DNS evidence, live smoke test |

## Data-flow classification

| Flow | Classification | Current control | Open issue |
|---|---|---|---|
| Page navigation and page views | Behavioral analytics | GA4 consent default denied on legal pages; root index currently had granted default before the consent fix | Confirm all production templates use the intended denied default before consent is granted |
| Checkout clicks | Commercial intent | Named offer/catalog and UTM handling exist locally | Deduplication, attribution, and real transaction evidence |
| Purchase events | Transactional analytics | `scripts/ga4-mp.js` uses environment secrets, `orderId`, and `totalValue`; buyer email hashing is supported when supplied | Server logs/GA4 export and payment reconciliation are external evidence |
| Newsletter submission | Marketing/contact data | Placeholder MailerLite hooks exist; no live provider claim | Consent basis, retention, unsubscribe, and provider configuration |
| App downloads | Acquisition analytics | App package IDs and Play target URLs are cataloged | Play Console listing and download attribution evidence |
| Affiliate clicks | Referral analytics | Affiliate hooks and campaign fields are present in conversion code | Partner agreement, disclosure, attribution, and payment evidence |
| Comments | User-generated content | Giscus UI is loaded on governed pages | Provider privacy, consent, moderation, and retention review |

## Consent and review checklist

- [ ] Legal/privacy owner identifies the controller and contact channel.
- [ ] Owner approves the purpose and lawful basis for each vendor/data flow.
- [ ] Cookie notice lists the actual deployed vendors and purposes.
- [ ] Analytics remains denied until an explicit consent action where required.
- [ ] Newsletter and affiliate forms include required disclosures and unsubscribe/withdrawal handling.
- [ ] Purchase events use transaction IDs and amounts that can be reconciled to payment exports.
- [ ] App package IDs, Hotmart product IDs, and external listing states have named owners.
- [ ] Draft pages are reviewed for jurisdiction-specific refund, privacy, and consumer terms.
- [ ] Production behavior is checked after deployment; local files are not evidence of live operation.

## Known limitations

1. This matrix is based on local source inspection, not vendor contracts or account exports.
2. `V107097103W` and the app package IDs are identifiers in the catalog; their external state is not certified here.
3. No production analytics, CRM, payment, ad, or affiliate evidence was available in the repository review.
4. The root legal pages are working drafts and explicitly say so; they must not be described as legally approved.
5. Any vendor addition or data-flow change requires updating this matrix and the privacy/legal pages together.
