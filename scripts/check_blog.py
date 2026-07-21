#!/usr/bin/env python3
"""Verify blog/index.html structure."""
import re

with open(r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Count post-cards
post_cards = re.findall(r'<div class="post-card"', html)
print(f"Total post-card divs: {len(post_cards)}")

# Check new slug presence
new_slugs = [
    "can-you-train-intuition-science-esp-methods",
    "zener-card-probability-calculator-esp-scores",
    "clairvoyance-telepathy-precognition-differences-testing",
    "scientific-studies-zener-cards-esp-validation",
    "increase-esp-accuracy-advanced-protocols",
    "psi-hitting-vs-psi-missing-score-patterns",
    "remote-perception-training-zener-real-world",
    "esp-training-chaos-magick-gnosis-integration",
    "history-zener-cards-rhine-digital-esp",
    "best-esp-training-schedule-daily-psi-practice",
    "mild-vs-wild-vs-wbtc-lucid-dreaming-techniques-compared",
    "theta-waves-lucid-dreaming-brainwave-science",
    "dream-signs-identification-personal-lucidity-triggers",
    "wake-back-to-bed-protocol-step-by-step-wbtb",
    "reality-check-techniques-best-lucidity-methods",
    "dream-journaling-lucid-dreaming-complete-guide",
    "lucid-dream-stabilization-stop-waking-up",
    "dream-control-shape-lucid-dream-environment",
    "lucid-dreaming-problem-solving-creative-breakthroughs",
    "oneironautics-science-practice-dream-exploration",
    "astral-projection-techniques-rope-roll-out-phasing-compared",
    "vibrational-state-obe-precursor-recognition",
    "silver-cord-theory-astral-projection-body-mind",
    "astral-projection-safety-complete-guide",
    "astral-realms-navigating-non-physical-reality",
    "energy-body-activation-astral-travel-preparation",
    "astral-projection-beginners-30-day-program",
    "obe-chaos-magick-sigil-work-integration",
    "monroe-method-hemi-sync-astral-travel",
    "astral-projection-vs-lucid-dreaming-differences",
]

missing = [s for s in new_slugs if s not in html]
if not missing:
    print("All 30 new slugs FOUND in blog/index.html")
else:
    print(f"MISSING: {missing}")

# Check structure: posts div -> post-cards -> script
posts_open = html.count('<div class="posts">')
posts_close = html.count('</div>')
print(f'Posts div open: {posts_open}')

# Check filter categories exist
cats = {"divination", "dreaming", "advanced", "all", "sigils", "goetia", "runes", "moon", "tarot", "iching", "basics", "reviews", "free-tools"}
for c in cats:
    if f'data-category="{c}"' not in html:
        print(f"WARNING: category '{c}' not found in any post-card")

# Check HTML entity encoding in hrefs
bad_hrefs = re.findall(r'href="([^"]*&amp;[^"]*)"', html)
if bad_hrefs:
    print(f"Found &amp; in href attributes: {bad_hrefs[:3]}")
else:
    print("No &amp; in href attributes (good)")

print("Done checking blog/index.html")
