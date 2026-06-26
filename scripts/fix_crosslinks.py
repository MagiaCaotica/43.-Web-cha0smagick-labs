"""
Fix cross-linking between articles and apps/PDFs.
1. Add blog article links to apps pages (in a "Read Our Review" section)
2. Add app page links to generated articles (in the generator itself)
"""
import os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Mapping: article_slug -> (app_page_path, app_title, description)
ARTICLE_APP_MAP = {
    "chaos-sigil-generator-app-review": ("../apps/chaos-sigil-generator.html", "Chaos Sigil Generator", "Digital sigil creation tool"),
    "how-to-make-digital-sigil-complete-guide": ("../apps/chaos-sigil-generator.html", "Chaos Sigil Generator", "Digital sigil creation tool"),
    "planetary-magic-squares-sigil-creation": ("../apps/chaos-sigil-generator.html", "Chaos Sigil Generator", "Digital sigil creation tool"),
    "austin-osman-spare-sigil-method": ("../apps/chaos-sigil-generator.html", "Chaos Sigil Generator", "Digital sigil creation tool"),
    "norse-rune-oracle-app-review": ("../apps/norse-rune-oracle.html", "Norse Rune Oracle", "Elder Futhark divination app"),
    "arcana-goetia-app-review": ("../apps/arcana-goetia.html", "Arcana Goetia", "72 spirits of Solomon grimoire"),
    "psi-gym-zener-cards-app-review": ("../apps/psi-gym.html", "PSI GYM", "Zener cards ESP training"),
    "best-esp-training-apps-android": ("../apps/psi-gym.html", "PSI GYM", "Zener cards ESP training"),
    "zener-cards-online-esp-test": ("../apps/psi-gym.html", "PSI GYM", "Zener cards ESP training"),
    "remote-viewing-techniques-beginners": ("../apps/psi-gym.html", "PSI GYM", "Zener cards ESP training"),
    "clairvoyance-test-online": ("../apps/psi-gym.html", "PSI GYM", "Zener cards ESP training"),
    "dream-machine-app-review": ("../apps/dream-machine.html", "Dream Machine", "Binaural beats for lucid dreaming"),
    "binaural-beats-lucid-dreaming-guide": ("../apps/dream-machine.html", "Dream Machine", "Binaural beats for lucid dreaming"),
    "rider-waite-tarot-app-review": ("../apps/unofficial-rider-waite-tarot.html", "Rider Waite Tarot", "Digital tarot reader"),
    "tarot-spreads-beginners-guide": ("../apps/unofficial-rider-waite-tarot.html", "Rider Waite Tarot", "Digital tarot reader"),
    "i-ching-oracle-app-review": ("../apps/iching-oracle.html", "I Ching Oracle", "Book of Changes divination"),
    "i-ching-hexagram-meanings-complete-guide": ("../apps/iching-oracle.html", "I Ching Oracle", "Book of Changes divination"),
    "lunar-phase-calculator-app-review": ("../apps/lunar-phase-calculator.html", "Lunar Phase Calculator", "Moon phase tracker"),
    "new-moon-vs-full-moon-ritual-guide": ("../apps/lunar-phase-calculator.html", "Lunar Phase Calculator", "Moon phase tracker"),
    "chaos-magick-bundle-review": ("../complete-chaos-magick-bundle.html", "Complete Chaos Magick Bundle", "All apps + PDFs bundle"),
    "magical-servitors-manual-pdf-review": ("../apps/manual-activacion-servidores-magicos-pdf.html", "Magical Servitors Manual", "Advanced servitor creation PDF"),
    "chaos-hunter-runes-treatise-review": ("../apps/tratado-runas-cazadoras-caos-pdf.html", "Chaos Hunter: Runes Treatise", "Viking sorcery PDF"),
    "ouija-cazadora-pdf-review": ("../apps/ouija-cazadora-pdf.html", "Ouija Cazadora", "Digital spirit board PDF"),
    "liber-lvpinux-pdf-review": ("../apps/liber-lvpinux-pdf.html", "Liber Lvpinux", "Cyber-grimoire PDF"),
}

# =========================================================
# PART 1: Add "Read Our Review" section to apps pages
# =========================================================
# Reverse map: app_page -> article_slug
APP_ARTICLE_REVERSE = {}
for slug, (app_path, app_title, _) in ARTICLE_APP_MAP.items():
    app_filename = os.path.basename(app_path)
    if app_filename not in APP_ARTICLE_REVERSE:
        APP_ARTICLE_REVERSE[app_filename] = []
    APP_ARTICLE_REVERSE[app_filename].append((slug, app_title))

print("=" * 60)
print("PART 1: Adding blog review links to apps pages")
print("=" * 60)

for app_filename, article_list in APP_ARTICLE_REVERSE.items():
    app_path = os.path.join(ROOT, "apps", app_filename)
    if not os.path.exists(app_path):
        print(f"  SKIP {app_filename}: not found")
        continue
    
    with open(app_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Check if already has blog review links
    if 'blog/' in html and 'review' in html.lower():
        # Check specific slugs
        has_links = all(f"blog/{slug}.html" in html for slug, _ in article_list)
        if has_links:
            print(f"  OK {app_filename} (already has review links)")
            continue
    
    # Find the "You May Also Like" section or insert before </main>
    insert_before = '</main>'
    
    # Build the review links HTML
    links_html = '\n    <section class="also-like-section">\n        <h2>Read Our In-Depth Review</h2>\n        <div class="review-links">\n'
    for slug, title in article_list:
        links_html += f'            <p><a href="../blog/{slug}.html" style="color:#ffd700;">{title} Review \u2192</a></p>\n'
    links_html += '        </div>\n    </section>\n    '
    
    # Insert before </main>
    idx = html.find(insert_before)
    if idx >= 0:
        html = html[:idx] + links_html + html[idx:]
        with open(app_path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  ADDED {app_filename}: {len(article_list)} review link(s)")
    else:
        print(f"  FAIL {app_filename}: no </main> found")

# =========================================================
# PART 2: Verify and fix article -> app links
# We need to ensure each article links to its local app page
# =========================================================
print("\n" + "=" * 60)
print("PART 2: Verifying article -> app page links")
print("=" * 60)

for slug, (app_path, app_title, desc) in ARTICLE_APP_MAP.items():
    article_path = os.path.join(ROOT, "blog", f"{slug}.html")
    if not os.path.exists(article_path):
        print(f"  SKIP {slug}: article not found")
        continue
    
    with open(article_path, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Check if app path is linked
    if app_path in html:
        print(f"  OK {slug} -> {app_path}")
    else:
        # Add a link in the content before FAQ
        # Find the FAQ section or end of content
        faq_idx = html.find('<h2>Frequently Asked Questions</h2>')
        if faq_idx < 0:
            faq_idx = html.find('</article>')
        
        if faq_idx >= 0:
            # Count indentation from the line
            link_html = f'\n<h2>About the App</h2>\n<p><a href="{app_path}">{app_title}</a> is a premium Android app for {desc}. Download from Google Play or read our full review above.</p>\n'
            html = html[:faq_idx] + link_html + html[faq_idx:]
            with open(article_path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"  FIXED {slug}: added link to {app_path}")

print("\nDone!")
