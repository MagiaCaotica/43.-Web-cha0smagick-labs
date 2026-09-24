# Analytics Event Contract

**Contract version:** 1.0.0
**Evidence date:** 2026-09-24
**Scope:** browser funnel events and server-side purchase evidence in this repository

This contract is an implementation and measurement specification. It does not prove that any event reached GA4, that a Play or Hotmart transaction occurred, or that a CRM/MailerLite automation ran in production.

## 1. Measurement rules

1. A browser outbound click is not a purchase. `purchase_click` and `begin_checkout` describe intent or navigation only.
2. A completed purchase is represented only by a server-validated `purchase` event or a separately reconciled transaction export. The current Hotmart receiver accepts only `PURCHASE_COMPLETE` with order status `APPROVED`; the Play RTDN handler handles subscription/voided notifications, not a completed browser click.
3. GA4 event names and parameter names are stable identifiers. Do not place names, emails, payment details, or arbitrary URL query strings in event names.
4. Browser events must respect the page's consent state. The repository has inconsistent historical consent defaults; the canonical page-level default is now denied, but the shared `js/conversion.js` behavior must be audited before claiming consent-complete measurement.
5. Event payloads must be deterministic for a given user action. The existing `__cmPurchaseTracked` guard prevents the app renderer and conversion script from sending duplicate `purchase_click` events on the same click.

## 2. Event registry

### `view_item`

- **Owner:** `js/app-render.js`; shared product pages.
- **Trigger:** a product/app/book detail view renders successfully.
- **Purpose:** product impression and ecommerce funnel entry.
- **Required parameters:** `currency`, `value`, `items[]`.
- **Item fields:** `item_id`, `item_name`, `item_category`, `item_brand`, `price`, `currency`, `quantity`.
- **Optional:** page path, UTM fields, device context.
- **PII policy:** product/catalog fields only; no customer email, name, payment data, or free-form user text.
- **Observed implementation:** `js/app-render.js` fires `view_item` for rendered app/book details and uses catalog IDs and USD values.
- **Status:** `observed_local`; production reach not verified.

### `view_item_list`

- **Owner:** `js/app-render.js`; app catalogue grid.
- **Trigger:** the app catalogue grid renders.
- **Purpose:** list impression and merchandising measurement.
- **Required parameters:** `item_list_id`, `item_list_name`, `items[]` (up to the current 20-item cap).
- **Item fields:** `item_id`, `item_name`, `item_category`, `price`, `currency`, `index`.
- **PII policy:** catalog data only.
- **Observed implementation:** uses `item_list_id: "apps_grid"` and `item_list_name: "Android Apps Catalogue"`.
- **Status:** `observed_local`; not a purchase signal.

### `begin_checkout`

- **Owner:** `js/app-render.js` and `js/conversion.js`.
- **Trigger:** outbound click on a reconciled app/book/checkout link.
- **Purpose:** standard ecommerce checkout-start signal for GA4 reports.
- **Required parameters:** `currency`, `value`, `items[]`.
- **Item fields:** same catalog fields as `view_item`.
- **Optional:** `destination`, `link_url`, `page`.
- **PII policy:** destination URL must be a known catalog/checkout URL; strip tracking tokens and never append email or payment data.
- **Important limitation:** this event fires when the visitor leaves the local site; it does not mean a checkout was created or completed.
- **Status:** `observed_local`; not a completed checkout proof.

### `purchase_click`

- **Owner:** `js/app-render.js` and `js/conversion.js`.
- **Trigger:** outbound click on a purchase link, including Play and Hotmart destinations.
- **Purpose:** local custom intent signal paired with the standard `begin_checkout` event.
- **Required parameters:** `currency`, `value`, `destination`, `link_url`, `page`, `items[]`.
- **Destination values currently used:** `google_play`, `hotmart`.
- **PII policy:** use catalog IDs and approved destination URLs only; no customer identity fields.
- **Important limitation:** this is not a purchase. The name is intentionally a click signal and must not be counted as revenue without a matching server transaction.
- **Status:** `observed_local`; production reach not verified.

### `purchase`

- **Owner:** server-side `scripts/ga4-mp.js`, invoked by the Hotmart receiver or another trusted server integration.
- **Trigger:** a trusted purchase source supplies a completed transaction and required credentials/configuration.
- **Purpose:** completed ecommerce purchase measurement.
- **Required parameters:** `transaction_id` (from `orderId`), `value` (from `totalValue`), `currency`, `items[]`.
- **Item fields:** `item_id`, `item_name`, `price`, `quantity`, `item_brand`, `item_category`.
- **Optional privacy-preserving field:** `buyer_email_hash`, a truncated lowercase/trimmed SHA-256 digest as implemented by `scripts/ga4-mp.js`.
- **PII policy:** never put raw email, buyer name, or payment details in GA4. Raw buyer data belongs only in an access-controlled operational system and must not be copied into this contract as event data.
- **Validation:** `scripts/ga4-mp.js` requires `orderId` and `totalValue`; dry-run mode is available and must be used when credentials or real traffic are absent.
- **Status:** `implemented_server_seam_external_evidence_pending`; no real transaction is claimed.

### `affiliate_click`

- **Owner:** `js/affiliate.js`, `js/conversion.js`, and `js/shared.js` where loaded.
- **Trigger:** click on a link marked as an affiliate/referral link.
- **Purpose:** referral instrumentation and attribution.
- **Required parameters:** `affiliate_id`, `product`, `page`.
- **PII policy:** never send email, order ID, payment data, or arbitrary query strings as the affiliate identifier.
- **Observed implementation:** referral token is added as `ref`; event sends the resolved affiliate ID, product data attribute or URL, and current pathname.
- **Status:** `observed_local`; downstream attribution and commission evidence remain external.

### `lead_submit`

- **Owner:** MailerLite/CRM integration owner; not currently identified in the audited browser seams.
- **Trigger:** a confirmed newsletter/lead form submission after server-side validation.
- **Purpose:** qualified lead measurement.
- **Required parameters:** `form_id`, `lead_type`, `consent_state`, `source`, `medium`, `campaign`, `landing_page`.
- **PII policy:** send no raw email/name to GA4; if an external CRM needs identity, keep it in the CRM's consented system and send only an approved opaque reference.
- **Status:** `not_observed_in_audited_seams`; do not report lead conversions from page views or button clicks.

### `app_download`

- **Owner:** Play Store/landing-page measurement owner; not currently identified in the audited browser seams.
- **Trigger:** a confirmed app-install or Play Store conversion signal, not a normal outbound link click.
- **Purpose:** app acquisition measurement.
- **Required parameters:** `app_id`, `package_id`, `destination`, `source`, `medium`, `campaign`.
- **PII policy:** package ID and campaign fields only; no device fingerprinting or user identity.
- **Status:** `not_observed_in_audited_seams`; a Play Console export is required before claiming downloads.

### `add_payment_info`

- **Owner:** checkout/payment integration owner; external.
- **Trigger:** payment-provider evidence that payment details were successfully submitted.
- **Purpose:** checkout funnel signal, if the provider permits a privacy-safe event.
- **Required parameters:** `payment_type`, `currency`, `value`, `transaction_id` or provider-safe opaque reference.
- **PII policy:** never send card number, CVV, bank details, or raw customer identity to GA4.
- **Status:** `not_observed_local`; must not be synthesized from a button click.

## 3. Server evidence boundaries

### Hotmart receiver

`scripts/webhook-receiver.js` validates the Hotmart HMAC signature, accepts only `PURCHASE_COMPLETE`, and requires `data.order.status === "APPROVED"` before extracting a purchase. It then maps `order.id`, `order.total_price.value`, currency, product, buyer, and affiliate fields, optionally sends a GA4 Measurement Protocol purchase, tags MailerLite, and writes a JSONL log.

This is an implementation seam, not production evidence. The receiver also currently writes raw buyer email/name to its JSONL log; that operational storage requires a privacy-owner decision and access-control review before production use.

### Play RTDN handler

`deploy/cloud-function/rtdn-to-make/index.js` parses subscription notifications and `VOIDED_PURCHASE` notifications, preserving notification type, purchase token, order ID, and event time. Its self-test uses synthetic data. It is not evidence of a real Play transaction and must not be treated as a general `purchase` event without a separate approved mapping.

## 4. Current audit findings

| Finding | Evidence | Consequence |
|---|---|---|
| Browser outbound events exist | `js/app-render.js`, `js/conversion.js`, `js/affiliate.js` | Funnel instrumentation is locally observable |
| `purchase_click` is custom and not a purchase | comments and payload in both browser files | Revenue dashboards must not sum it as sales |
| Server `purchase` seam exists | `scripts/ga4-mp.js` and Hotmart receiver | Real credentials and transactions remain external evidence |
| Email is hashed for GA4 MP | `buyer_email_hash` implementation | GA4 contract is privacy-preserving, subject to owner review |
| Raw buyer data is logged by Hotmart receiver | `logPurchaseToJSONL` | Legal/privacy review required before production |
| RTDN is subscription/voided-focused | RTDN handler | It does not prove a browser purchase or one-time sale |
| Consent behavior is historically inconsistent | root page was granted by default; legal/template pages denied | Measurement acceptance requires a consent audit |
| `lead_submit` and `app_download` not found in audited seams | targeted repository search | Keep those contracts as unverified until real instrumentation exists |

## 5. Implementation acceptance

A future implementation may mark an event `observed_local` only when the source seam exists and a behavior test proves its trigger/guard. It may mark an event `externally_verified` only when dated production evidence is attached (for example, a Play export, signed Hotmart webhook log, GA4 export, or CRM reconciliation). No local spec, dry run, or synthetic self-test qualifies as production evidence.

## 6. External evidence still required

- Play Console export for listing, package, install, and purchase/subscription state.
- Real Hotmart transaction export or access to a production webhook log.
- Finance-approved net collected baseline and refund/void reconciliation.
- GA4 export showing consent state, event receipt, and deduplication.
- MailerLite/CRM export showing consent and lead/buyer reconciliation.
- Privacy/legal owner review of raw webhook-log retention and the draft legal pages.
