# Hotmart Bundle Strategy — 7 Books Bundle

## Current Setup
- 7 PDF books sold individually on Hotmart: $3.99-$9.99 each
- Average price: ~$5.99
- Total individual value: ~$42
- 0 sales tracked to existing pages (no traffic)

## Bundle Strategy

### Option 1: Hotmart Product Bundle (Recommended)
Hotmart supports "Kits" (bundles) where you group multiple products at a discount.

**How to create:**
1. Log in to Hotmart → Products → Create Product → "Kit"
2. Name: "The Complete Occult Library — 7 Esoteric Books Bundle"
3. Select all 7 existing PDF books as component products
4. Set bundle price: ~~$29.99~~ → $19.99 (launch price)
5. This is ~53% off individual prices

**Pricing justification:**
| Item | Individual | Bundle |
|------|-----------|--------|
| 7 Books | $41.93 total | $19.99 |
| Savings | - | 52% |
| Per book | $5.99 avg | $2.86 |

### Option 2: Checkout Upsell (Hotmart Features)
After someone buys ANY individual book, offer the bundle as an upsell:

1. Hotmart Checkout → Upsell Settings
2. Trigger: After purchase of any single book
3. Offer: "Upgrade to the Complete 7-Book Library for just $14.99 more"
4. This converts better than cold bundle sales

### Option 3: Hotmart Sales Page per Book + Bundle
Create a dedicated sales page on the site for the bundle:

```
/books/complete-library.html
```
Linking to Hotmart checkout with the bundle URL.

### Product Page Implementation

Add to the homepage books section and individual book pages:

```html
<div class="cm-collection-section">
  <h3 class="cm-collection-headline">The Complete Occult Library</h3>
  <p class="cm-collection-text">
    All 7 esoteric PDF books in one package — save 52%.
    Includes: Chaos Magick, Sigils, Tarot, Runes, Astral, 
    Dream Interpretation, and Candle Magic guides.
  </p>
  <div class="cm-collection-stats">
    <div class="cm-stat">
      <span class="cm-stat-num">7</span>
      <span class="cm-stat-label">Books</span>
    </div>
    <div class="cm-stat">
      <span class="cm-stat-num">$19.99</span>
      <span class="cm-stat-label">Bundle Price</span>
    </div>
    <div class="cm-stat">
      <span class="cm-stat-num">52%</span>
      <span class="cm-stat-label">Savings</span>
    </div>
  </div>
  <a href="[HOTMART BUNDLE URL]" class="cm-collection-btn" target="_blank">
    Get the Bundle →
  </a>
</div>
```

### Steps to Execute (Manual — Hotmart Dashboard)

1. Go to Hotmart → Products → Create Product → **Kit**
2. Name: "Complete Occult Library — 7 Books"
3. Description: "All 7 premium esoteric PDFs in one download. Save 52%."
4. Select component products (all 7 books)
5. Price: $19.99 (or launch at $14.99 for first 50 buyers)
6. Payment: One-time (not subscription)
7. After creation, copy the Checkout URL
8. Add the bundle CTA to conversion.js or homepage books section

### Automated Welcome Sequence for Bundle Buyers
After bundle purchase, deliver a PDF with:
- Links to download all 7 books
- Bonus: Quickstart ritual guide (new micro-PDF)
- CTA: "Ready to go deeper? Check out our 11 premium Android apps"

### Pricing Experiment

| Version | Price | Perceived Value | Monthly Target |
|---------|-------|-----------------|----------------|
| Launch | $14.99 | "Steal" | 10 sales = $150 |
| Standard | $19.99 | "Great deal" | 10 sales = $200 |
| Premium | $24.99 | "Worth it" | 8 sales = $200 |

Start at $19.99. If conversion is slow, drop to $14.99 launch promo.
