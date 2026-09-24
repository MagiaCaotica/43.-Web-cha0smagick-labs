# Editorial Content Registry

**Registry version:** 0.1.0-local
**Evidence date:** 2026-09-24
**Owner:** Editorial / SEO
**Status:** `IN_PROGRESS` — cobertura local de los 151 artículos expandidos; la atribución y el QA de conversión siguen pendientes

## Scope and source of truth

This registry covers the 151 tracked blog files changed by the local thin-content work. The source list is reproducible from the current working-tree diff:

```text
git diff --name-only -- blog
```

The canonical product/offer source remains `scripts/bots/data/offers.json`; the canonical surface and states are recorded in `docs/canonical-asset-inventory.md`. This registry does not claim external listing status, purchase, assisted revenue, or search demand.

Each entry must eventually be enriched with:

- `cluster` and `search_intent`
- `offer_id` and `cta_url`, or an explicit `no_cta_review_needed`
- `internal_links_added` and a destination audit
- `quality_score` against intent, source support, originality, readability, links and CTA
- `owner` and `last_reviewed`
- `revenue_source`, `assisted_conversion_status`, and `known_limitations`

Until those fields are reviewed, every row has the conservative state `expanded_local / conversion_pending`.

## Editorial and offer mapping rules

| Temporary cluster | Typical filename signals | Catalog candidates for later review | Default intent | CTA rule |
|---|---|---|---|---|
| ESP / Zener training | zener, ESP, PSI GYM | `psi-gym` | informational how-to or commercial investigation | CTA only after protocol and demand review |
| Dream / astral practice | dream, lucid, astral, sleep | `dream-machine`, `astral-lab` | how-to, safety, or commercial investigation | Do not promise sleep or projection outcomes |
| Paranormal / EVP | EVP, spirit box, paranormal, haunted, SLS, NOCTEM, Eerie Roads | `eerieroads`, `noctem-tools` | safety, how-to, or commercial investigation | Consent, permission and evidence limits are mandatory |
| Occult practice | sigil, Goetia, servitor, angel, occult | `arcana-goetia`, `chaos-sigil-generator` | reference, how-to, or reflective practice | No guarantee of contact, power, money or protection |
| Divination / astronomy | tarot, I Ching, rune, moon, lunar, numerology, astrology, pendulum, scrying | `unofficial-rider-waite-tarot`, `iching-oracle`, `norse-rune-oracle`, `lunar-phase-calculator` | reference or decision support | Do not present symbolic readings as factual forecasts |
| App / trust / privacy | app, security, data, subscription, cost | relevant reconciled app offer | commercial investigation or trust review | Show price only from the catalog and mark external state unverified |
| History / ritual culture | history, Samhain, Sabbat, cybermancy, grimoire, witchcraft | books/tools only when relevant | educational or cultural reference | Cite the source tradition and avoid borrowed authority |

## Coverage index (151 files)

The following list is the complete current local scope. Every line represents one expanded article and must receive a demand/intent/CTA decision before it is used for revenue or paid acquisition.

```text
10-occult-myths-debunked-by-practitioners.html
ai-machine-learning-paranormal-research.html
all-24-elder-futhark-runes-complete-reference.html
am-i-haunted-or-is-it-pareidolia.html
angel-magic-archangels-grimoire-guide.html
angels-spirits-and-you-a-framework-for-contact.html
app-security-where-your-data-lives-it-doesnt.html
arcana-goetia-ritual-test.html
arcana-goetia-spirit-browser-guide.html
astral-lab-app-review.html
astral-lab-hypnagogia-to-projection.html
astral-projection-app-guide.html
astral-projection-changed-my-fear-of-death.html
astral-projection-for-beginners.html
astral-projection-safety-what-can-actually-go-wrong.html
astral-projection-verification.html
astral-travel-for-healing-old-wounds.html
beginners-first-month-esp-training.html
best-esp-training-schedule-daily-psi-practice.html
best-goetia-app-comparison.html
best-offline-lucid-dreaming-app-2026.html
best-offline-tarot-app-android.html
best-sigil-generator-app-onetime.html
big-three-explained.html
binaural-beats-astral-projection.html
can-anyone-learn-esp-the-science-says-maybe.html
can-you-get-stuck-out-of-body-the-truth.html
chakra-balancing-witches-guide.html
christmas-gift-guide-occult-apps-under-10.html
cryptographic-sigil-programming-code.html
crystal-magic-beginners-reference-guide.html
cyber-paganism-digital-spirituality-guide.html
dark-moon-meaning-witchcraft.html
death-card-tarot-meaning.html
digital-spellcasting-technomancy-guide.html
divination-methods-beyond-tarot-guide.html
dream-incubation-manifestation-guide-2026.html
dream-machine-dream-journal-guide.html
dream-machine-long-term-review.html
dream-machine-vs-awoken-comparison.html
dream-machine-vs-lucid-dream-app.html
eclipse-season-astral-projection-opportunities.html
eerieroads-90-night-review.html
elemental-magic-air-fire-water-earth-guide.html
esp-test-for-kids.html
esp-test-statistics-explained-for-beginners.html
evp-recording-complete-guide.html
evp-spirit-box-session-setup.html
evp-vs-spirit-box-comparison-guide.html
ex-tarot-spread.html
fehu-rune-meaning.html
first-goetia-summoning-experience.html
first-lucid-dream-3-weeks-dream-machine.html
fools-journey-tarot-roadmap.html
free-i-ching-vs-i-ching-oracle-app.html
free-sigil-generator-vs-chaos-sigil-generator-app.html
free-tools-vs-premium-apps-occult.html
full-moon-charging-nights-2026.html
ghost-hunting-at-home-guide.html
goetia-beginners-ritual.html
goetia-for-beginners-what-no-one-tells-you-first.html
goetia-seals-and-sigils-guide.html
goetia-spirits-faq.html
halloween-evp-night-how-to-run-a-public-session.html
haunted-roads-guide.html
herbal-magic-correspondences-guide.html
history-of-chaos-magick.html
how-long-sigil-takes-to-work.html
how-to-cast-iching-digitally.html
i-ching-hexagram-list-all-64-one-line-meanings.html
iching-career-questions.html
iching-changing-lines-guide.html
iching-for-love-questions.html
iching-vs-tarot.html
is-it-dangerous-to-make-a-money-sigil.html
kitchen-witchery-beginners-guide.html
learning-to-read-runes-daily-practice.html
liber-lvpinux-pdf-review.html
lucid-dreaming-alarm-guide.html
lucid-dreaming-as-a-superpower-for-problem-solving.html
lucid-dreaming-control-techniques-advanced.html
lucid-dreaming-statistics-what-research-shows.html
lucid-dreaming-stopped-my-nightmares.html
lunar-eclipse-ritual.html
lunar-phase-calculator-app-review.html
lunar-phase-year-tracking-guide.html
magical-servitors-manual-pdf-review.html
manifesting-wealth-why-money-sigils-work-for-some-people.html
mercury-retrograde-2026-complete-survival-guide.html
money-sigil-guide.html
money-sigils-90-day-transformation.html
moon-magic-for-a-year-tracking-every-phase.html
moon-phase-calculator-for-spells.html
moon-phases-explained-dates-energies-rituals.html
new-moon-dates-2026-2027-ritual-calendar.html
new-moon-ritual-manifestation.html
new-year-intention-setting-with-sigils.html
nightmares-lucid.html
noctem-feature-tour-guide.html
norse-rune-nine-rune-digital-cast.html
norse-rune-oracle-daily-practice.html
numerology-beginners-life-path-guide.html
occult-apps-and-privacy-what-your-data-says.html
ogham-divination-celtic-tree-alphabet-guide.html
one-time-vs-subscription-calculator-occult.html
ouija-vs-digital-spirit-box-fear-compared.html
paranormal-investigation-step-by-step-guide.html
pendulum-divination-beginners-guide.html
psi-gym-30-day-esp-training-log.html
psi-gym-app-review.html
psi-gym-training-modes-guide.html
psi-gym-vs-free-zener-test.html
psychonaut-guide-consciousness-exploration.html
remote-perception-training-zener-real-world.html
rune-divination-for-daily-guidance-a-gentle-start.html
rune-spreads-for-beginners.html
samhain-deep-dive-the-witches-new-year.html
science-behind-sls-camera-ghost-hunting.html
scrying-techniques-mirror-crystal-digital.html
servitor-guide-2026.html
sigil-backfire-myth-psychology-or-real.html
sigil-magic-meaning-origins-chaos-magick.html
sigil-money-experiment.html
sls-camera-paranormal-investigation-guide.html
spirit-box-frequency-settings.html
tarot-para-chaos-practitioner.html
the-72-goetia-spirits-complete-ranked-list.html
the-78-tarot-cards-complete-reference-list.html
the-dark-moon-isnt-scary-a-witchs-perspective.html
the-digital-grimoire-organizing-your-whole-practice.html
the-fools-journey-is-your-life-a-hopeful-reading.html
the-history-of-cha0smagick-labs-since-2025.html
the-moon-as-your-manifestation-calendar.html
the-psychic-abilities-you-already-have-and-how-to-train-them.html
the-tech-witch-starter-pack-5-tools-plus-3-apps.html
true-cost-tarot-app-subscription-vs-onetime.html
two-card-tarot-spread.html
what-100-evp-sessions-taught-me-about-grief.html
what-actually-happens-in-an-evp-session.html
what-cybermancy-says-about-the-modern-practitioner.html
what-is-a-spirit-box-how-it-works-frequencies.html
what-is-a-zener-card-definition-history-statistics.html
what-the-i-ching-can-teach-you-about-difficult-choices.html
wheel-of-the-year-sabbat-guide.html
which-goetia-spirit-for-love-money-knowledge.html
why-people-fear-the-death-card.html
why-stop-paying-subscription-occult-apps.html
world-sleep-day-lucid-dreaming-as-sleep-science.html
zener-card-telepathy-test.html
zener-card-test-score-meaning.html
zener-training-30-day-score-journey.html
```

## Conversion review queue

The next editorial pass must add a row-level decision for each file: `keep`, `refresh`, `consolidate`, or `retire`; then attach the most relevant reconciled offer and CTA, query/intent evidence, internal-link destination, owner and review date. A word count above 1,500 is not an approval.

## Known limitations

The registry does not contain GSC queries, assisted revenue, production listing evidence, or owner approvals. It is an auditable local scaffold, not a claim that 151 pages are commercially validated.
