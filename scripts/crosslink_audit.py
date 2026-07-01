"""
Cross-linking audit: verify bidirectional links between articles <-> apps/PDFs
"""
import glob, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Map of article slugs -> expected target links
# Format: article_slug: [(target_type, target_path, description)]
EXPECTED_LINKS = {
    "chaos-sigil-generator-app-review": [
        ("app", "../apps/chaos-sigil-generator.html", "Chaos Sigil Generator app"),
        ("play", "com.app.goetiansealsgeneratorapp", "Google Play link"),
    ],
    "how-to-make-digital-sigil-complete-guide": [
        ("app", "../apps/chaos-sigil-generator.html", "Chaos Sigil Generator app"),
        ("blog", "cryptographic-sigil-programming-code.html", "crypto sigil guide"),
    ],
    "planetary-magic-squares-sigil-creation": [
        ("app", "../apps/chaos-sigil-generator.html", "Chaos Sigil Generator app"),
    ],
    "austin-osman-spare-sigil-method": [
        ("app", "../apps/chaos-sigil-generator.html", "Chaos Sigil Generator app"),
    ],
    "norse-rune-oracle-app-review": [
        ("app", "../apps/norse-rune-oracle.html", "Norse Rune Oracle app"),
        ("play", "com.japps.norse_oracle", "Google Play link"),
    ],
    "arcana-goetia-app-review": [
        ("app", "../apps/arcana-goetia.html", "Arcana Goetia app"),
        ("play", "com.cha0smagick.sigilgeneratorfinal", "Google Play link"),
    ],
    "psi-gym-zener-cards-app-review": [
        ("app", "../apps/psi-gym.html", "PSI GYM app"),
    ],
    "best-esp-training-apps-android": [
        ("app", "../apps/psi-gym.html", "PSI GYM app"),
    ],
    "zener-cards-online-esp-test": [
        ("app", "../apps/psi-gym.html", "PSI GYM app"),
    ],
    "clairvoyance-test-online": [
        ("app", "../apps/psi-gym.html", "PSI GYM app"),
    ],
    "remote-viewing-techniques-beginners": [
        ("app", "../apps/psi-gym.html", "PSI GYM app"),
    ],
    "dream-machine-app-review": [
        ("app", "../apps/dream-machine.html", "Dream Machine app"),
    ],
    "rider-waite-tarot-app-review": [
        ("app", "../apps/unofficial-rider-waite-tarot.html", "Rider Waite Tarot app"),
    ],
    "i-ching-oracle-app-review": [
        ("app", "../apps/iching-oracle.html", "I Ching Oracle app"),
    ],
    "lunar-phase-calculator-app-review": [
        ("app", "../apps/lunar-phase-calculator.html", "Lunar Phase Calculator app"),
    ],
    "magical-servitors-manual-pdf-review": [
        ("app", "../apps/manual-activacion-servidores-magicos-pdf.html", "Servitors PDF"),
    ],
    "chaos-hunter-runes-treatise-review": [
        ("app", "../apps/tratado-runas-cazadoras-caos-pdf.html", "Runes Treatise PDF"),
    ],
    "ouija-cazadora-pdf-review": [
        ("app", "../apps/ouija-cazadora-pdf.html", "Ouija Cazadora PDF"),
    ],
    "liber-lvpinux-pdf-review": [
        ("app", "../apps/liber-lvpinux-pdf.html", "Liber Lvpinux PDF"),
    ],
    "free-sigil-generator-online-guide": [
        ("tool", "../tools/sigil-generator.html", "Sigil Generator tool"),
    ],
    "free-online-rune-reading-guide": [
        ("tool", "../tools/viking-runes.html", "Viking Runes tool"),
    ],
    "free-i-ching-online-guide": [
        ("tool", "../tools/iching.html", "I Ching tool"),
    ],
    "free-lunar-phase-calculator-guide": [
        ("tool", "../tools/lunar-phase.html", "Lunar Phase tool"),
    ],
}

# Reverse: which articles should each app page link to?
# app_page: [expected_article_slug]
EXPECTED_BACKLINKS = {
    "apps/chaos-sigil-generator.html": [
        "chaos-sigil-generator-app-review",
        "how-to-make-digital-sigil-complete-guide", 
        "planetary-magic-squares-sigil-creation",
        "austin-osman-spare-sigil-method",
    ],
    "apps/norse-rune-oracle.html": [
        "norse-rune-oracle-app-review",
    ],
    "apps/arcana-goetia.html": [
        "arcana-goetia-app-review",
    ],
    "apps/psi-gym.html": [
        "psi-gym-zener-cards-app-review",
        "best-esp-training-apps-android",
        "zener-cards-online-esp-test",
        "remote-viewing-techniques-beginners", 
        "clairvoyance-test-online",
    ],
    "apps/dream-machine.html": [
        "dream-machine-app-review",
    ],
    "apps/unofficial-rider-waite-tarot.html": [
        "rider-waite-tarot-app-review",
    ],
    "apps/iching-oracle.html": [
        "i-ching-oracle-app-review",
    ],
    "apps/lunar-phase-calculator.html": [
        "lunar-phase-calculator-app-review",
    ],
    "apps/manual-activacion-servidores-magicos-pdf.html": [
        "magical-servitors-manual-pdf-review",
    ],
    "apps/tratado-runas-cazadoras-caos-pdf.html": [
        "chaos-hunter-runes-treatise-review",
    ],
    "apps/ouija-cazadora-pdf.html": [
        "ouija-cazadora-pdf-review",
    ],
    "apps/liber-lvpinux-pdf.html": [
        "liber-lvpinux-pdf-review",
    ],
}

print("=" * 60)
print("CROSS-LINKING AUDIT: Articles -> Apps/PDFs")
print("=" * 60)

all_ok = True
for slug, expected in EXPECTED_LINKS.items():
    path = os.path.join(ROOT, "blog", f"{slug}.html")
    if not os.path.exists(path):
        print(f"  MISSING: blog/{slug}.html")
        all_ok = False
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    
    missing = []
    for etype, etarget, edesc in expected:
        if etarget not in html:
            missing.append(f"    MISSING: {edesc} ({etarget})")
    
    if missing:
        print(f"\n  {slug}:")
        for m in missing:
            print(m)
        all_ok = False
    else:
        print(f"  OK {slug}")

print("\n" + "=" * 60)
print("CROSS-LINKING AUDIT: Apps/PDFs -> Articles")
print("=" * 60)

for app_page, expected_slugs in EXPECTED_BACKLINKS.items():
    path = os.path.join(ROOT, app_page)
    if not os.path.exists(path):
        print(f"  MISSING: {app_page}")
        all_ok = False
        continue
    
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    
    missing = []
    for slug in expected_slugs:
        # Check for link to the article
        article_link = f"blog/{slug}.html"
        if article_link not in html:
            missing.append(f"    MISSING: {slug} ({article_link})")
    
    if missing:
        print(f"\n  {app_page}:")
        for m in missing:
            print(m)
        all_ok = False
    else:
        print(f"  OK {app_page}")

print("\n" + "=" * 60)
if all_ok:
    print("ALL CROSS-LINKS VERIFIED")
else:
    print("SOME CROSS-LINKS MISSING - REVIEW ABOVE")
print("=" * 60)
