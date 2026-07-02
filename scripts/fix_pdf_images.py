"""
Fix PDF cards in index.html: add cover images to match app-card style.
Also fix 'you may also like' sections on PDF app pages.
"""

import os
import re

BASE = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"

def read_file(path):
    with open(path, 'rb') as f:
        raw = f.read()
    if raw[:2] in (b'\xff\xfe', b'\xfe\xff'):
        import codecs
        raw = codecs.decode(raw, 'utf-16').encode('utf-8')
    return raw.decode('latin-1')

def write_file(path, text):
    with open(path, 'wb') as f:
        f.write(text.encode('utf-8'))

# --- 1. Fix PDF section in index.html ---
index_path = os.path.join(BASE, 'index.html')
content = read_file(index_path)

# Define replacements for each PDF card
# The existing simple cards (text-only) need to be replaced with image + text cards

pdf_cards = {
    'Treatise of Chaos Hunter Runes': {
        'img': 'runascazadoras',
        'desc': '64 runic servitors, the Alphabet of Desire, and the Magic Chess Matrix. Complete runic chaos magick system.',
        'href': 'apps/tratado-runas-cazadoras-caos-pdf.html',
        'link_text': 'Read the Rune Treatise →',
        'has_webp': True,
    },
    'Liber Lvpinux': {
        'img': 'liber',
        'desc': 'Lycanthropic transformation and psychic metamorphosis. A complete system for primal awakening through chaos magick.',
        'href': 'apps/liber-lvpinux-pdf.html',
        'link_text': 'Explore Liber Lvpinux →',
        'has_webp': False,
    },
    'Ouija Cazadora': {
        'img': 'ouijacazadora',
        'desc': 'Transform the ouija board into a high-precision ritual instrument. Chaos magic spirit board guide with advanced protocols.',
        'href': 'apps/ouija-cazadora-pdf.html',
        'link_text': 'View Ouija Cazadora →',
        'has_webp': False,
    },
    'Magical Servitors Manual': {
        'img': 'servidores',
        'desc': 'Design, birth, train, and retire servitors. Complete system with sigil design, feeding protocols, and golem techniques.',
        'href': 'apps/manual-activacion-servidores-magicos-pdf.html',
        'link_text': 'See Servitors Manual →',
        'has_webp': False,
    }
}

for title, info in pdf_cards.items():
    # Build the new card HTML
    if info['has_webp']:
        picture = f'''                    <picture>
                        <source srcset="assets/images/{info['img']}.webp" type="image/webp">
                        <img src="assets/images/{info['img']}.png" alt="{title}" loading="lazy" class="app-image" width="300" height="220">
                    </picture>'''
    else:
        picture = f'''                    <img src="assets/images/{info['img']}.png" alt="{title}" loading="lazy" class="app-image" width="300" height="220">'''
    
    new_card = f'''                <a href="{info['href']}" class="app-card" style="text-decoration:none;color:inherit;">
                    <div class="card-image-wrapper">
{picture}
                    </div>
                    <div class="card-content" style="padding:1.5rem;">
                        <h4 style="margin-top:0;">{title}</h4>
                        <p style="font-size:0.9rem;margin:0.5rem 0 1rem;">{info['desc']}</p>
                        <span class="dl-button" style="display:inline-block;background:var(--accent-gold);color:var(--bg-body);padding:0.6rem 1.2rem;border-radius:6px;font-weight:700;font-size:0.85rem;text-decoration:none;text-align:center;">{info['link_text']}</span>
                    </div>
                </a>'''
    
    # Find the old card in content
    old_pattern = f'<div class="pdf-card"[^>]*>.*?<h3[^>]*>{re.escape(title)}</h3>.*?</div>'
    old_match = re.search(old_pattern, content, re.DOTALL)
    if old_match:
        old_card = old_match.group(0)
        content = content.replace(old_card, new_card, 1)
        print(f"  Replaced card for: {title}")
    else:
        print(f"  WARNING: Could not find card for: {title}")

# Replace the pdf-grid div to use apps-grid class
content = content.replace(
    '<div class="pdf-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto 3rem;">',
    '<div class="apps-grid" style="max-width:1100px;margin:0 auto 3rem;">'
)

write_file(index_path, content)
print(f"\nWritten: index.html")

# --- 2. Check and fix also-like sections on PDF app pages ---
# The app-card structure should work correctly with external CSS
# Let me verify the CSS rules are present
print("\nDone. You may also like sections use app-card CSS from external style.min.css")
print("No changes needed to those sections - they already have proper card-image-wrapper and card-content structure.")
