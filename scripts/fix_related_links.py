"""One-off: replace dead related-link slugs in articles_a.py / articles_b.py
with real existing blog slugs + their actual <title> from blog/*.html."""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG = os.path.join(ROOT, "blog")

# dead slug -> replacement real slug (verified to exist in blog/)
MAPPING = {
    "goetia-spirits-guide": "goetia-beginners-ritual",
    "sigil-magic-beginners-guide": "austin-osman-spare-sigil-method",
    "best-occult-apps-android": "best-goetia-books-essential-reading-2026",
    "remote-viewing-beginners-guide": "remote-viewing-techniques-beginners",
    "how-to-create-sigils": "austin-osman-spare-sigil-method",
    "servitor-creation-guide": "complete-magickal-servitors-guide",
    "chaos-magick-beginners-guide": "chaos-magick-beginners-complete-guide",
    "norse-rune-meanings-guide": "norse-runes-beginners-guide",
    "elder-futhark-beginners-guide": "hunter-runes-vs-elder-futhark-comparison",
    "best-rune-oracle-apps-android": "norse-rune-oracle-app-review",
    "iching-beginners-guide": "divination-methods-beyond-tarot-guide",
    "moon-magic-beginners-guide": "moon-phases-spell-timing-guide",
    "waxing-waning-moon-spells": "moon-phases-spell-timing-guide",
    "iching-hexagram-meanings-guide": "divination-methods-beyond-tarot-guide",
    "best-iching-apps-android": "divination-methods-beyond-tarot-guide",
    "evp-beginners-guide": "evp-recording-complete-guide",
    "spirit-box-basics": "evp-vs-spirit-box-comparison-guide",
    "ghost-hunting-beginners-guide": "best-ghost-hunting-apps-android-2026",
    "best-ghost-hunting-apps-android": "best-ghost-hunting-apps-android-2026",
    "astral-projection-techniques-guide": "astral-projection-beginners-30-day-program",
    "lucid-dreaming-beginners-guide": "best-lucid-dreaming-apps-android-2026",
    "hypnagogic-state-guide": "binaural-beats-lucid-dreaming-guide",
    "reality-checks-guide": "reality-check-techniques-best-lucidity-methods",
    "tarot-major-arcana-meanings": "tarot-card-meanings-major-arcana-complete-guide",
    "tarot-beginners-guide": "rider-waite-tarot-beginners-guide",
    "rider-waite-tarot-guide": "rider-waite-tarot-beginners-guide",
    "best-tarot-apps-android": "best-tarot-apps-android-2026",
    "mild-technique-guide": "best-lucid-dreaming-apps-android-2026",
    "best-lucid-dreaming-apps-android": "best-lucid-dreaming-apps-android-2026",
}

def real_title(slug):
    p = os.path.join(BLOG, slug + ".html")
    if not os.path.exists(p):
        return slug.replace("-", " ").title()
    m = re.search(r"<title>(.*?)</title>", open(p, encoding="utf-8").read(), re.S)
    if not m:
        return slug.replace("-", " ").title()
    t = m.group(1).strip()
    return re.sub(r"\s*\|.*$", "", t).strip()  # strip "| Site" suffix if any

def fix_file(path):
    src = open(path, encoding="utf-8").read()
    replaced = []
    for dead, real in MAPPING.items():
        pat = re.compile(r'\["' + re.escape(dead) + r'",\s*"[^"]*"\]')
        m = pat.search(src)
        if m:
            title = real_title(real)
            src = pat.sub('["%s", "%s"]' % (real, title.replace('"', '\\"')), src, count=1)
            replaced.append((dead, real, title))
    open(path, "w", encoding="utf-8").write(src)
    return replaced

for f in ("scripts/articles_a.py", "scripts/articles_b.py"):
    p = os.path.join(ROOT, f)
    if not os.path.exists(p):
        print("SKIP (missing):", f); continue
    rep = fix_file(p)
    print(f, "->", len(rep), "links fixed")
    for dead, real, title in rep:
        print("   ", dead, "=>", real, "|", title)
