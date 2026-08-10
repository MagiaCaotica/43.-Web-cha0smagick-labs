#!/usr/bin/env python3
"""Update blog/index.html with all new articles and sitemap.xml."""
import os, re

BLOG = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'
ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
INDEX = os.path.join(BLOG, 'index.html')
SITEMAP = os.path.join(ROOT, 'sitemap.xml')

# Read existing index
with open(INDEX, 'r', encoding='utf-8') as f:
    index_html = f.read()

# Find existing slugs already in the index
existing_slugs = set(re.findall(r'href="([^"]+\.html)"', index_html))
existing_slugs = {s.replace('.html', '').split('/')[-1] for s in existing_slugs}

# Get all blog articles
all_files = sorted([f.replace('.html', '') for f in os.listdir(BLOG) 
                    if f.endswith('.html') and f != 'index.html'])

# Find which ones are NOT in the index
new_slugs = [s for s in all_files if s not in existing_slugs]

# Category mapping based on slug
def get_category(slug):
    if any(x in slug for x in ['tarot', 'rider-waite', 'celtic-cross']): return 'tarot'
    if any(x in slug for x in ['astral-lab', 'natal-chart', 'astrology', 'planetary-transits', 'rising-sign', 'moon-sign', 'venus-sign', 'mercury-sign', 'mars-sign']): return 'divination'
    if any(x in slug for x in ['gnosis', 'sigil-magic', 'sigil-', 'servitor', 'egregore', 'pop-magick', 'technomancy', 'neuroplasticity', 'magical-correspondences']): return 'advanced'
    if any(x in slug for x in ['chaos-hunter', 'hunter-rune', 'magic-chess', 'activating-chaos', 'hunter-runes']): return 'runes'
    if any(x in slug for x in ['ouija', 'planchette']): return 'advanced'
    if any(x in slug for x in ['lycanthropy', 'wolf-archetype', 'animagus', 'primal-instinct', 'shadow-beast', 'lvpinux']): return 'advanced'
    if any(x in slug for x in ['tarot-chaos', 'tarot-astrology', 'tarot-pathworking', 'tarot-shadow', 'tarot-intention', 'tarot-deck']): return 'tarot'
    if any(x in slug for x in ['response-gap', 'emotional-regulation', 'habit-formation', 'decisive-moment', 'stillness-meditation', 'pause-technique', 'identity-shift', 'accumulation', 'surrender', 'direction-clarity']): return 'basics'
    if any(x in slug for x in ['chaos-magick-belief', 'chaos-magick-history']): return 'advanced'
    return 'basics'

# Build HTML for new articles
new_cards = []
for slug in new_slugs:
    # Try to get a title from the article itself
    path = os.path.join(BLOG, slug + '.html')
    title = slug.replace('-', ' ').title()
    excerpt = ''
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            c = f.read()
        # Extract H1 as title
        h1_m = re.search(r'<h1>(.*?)</h1>', c, re.DOTALL)
        if h1_m:
            title = re.sub(r'<[^>]+>', '', h1_m.group(1)).strip()
            if len(title) > 80:
                title = title[:77] + '...'
        # Extract meta description as excerpt
        desc_m = re.search(r'<meta name="description" content="([^"]+)"', c)
        if desc_m:
            excerpt = desc_m.group(1)
            if len(excerpt) > 150:
                excerpt = excerpt[:147] + '...'
    
    cat = get_category(slug)
    card = f"""<div class="post-card" data-category="{cat}">
<div class="date">July 21, 2026</div>
<h3><a href="{slug}.html">{title}</a></h3>
<div class="excerpt">{excerpt}</div>
<a class="read-more" href="{slug}.html">Read More →</a>
</div>"""
    new_cards.append(card)

if not new_cards:
    print("No new articles to add to index.")
else:
    # Insert before the filter script
    insert_marker = '<script>\nfunction filterCategory'
    idx = index_html.find(insert_marker)
    if idx > 0:
        batch_header = f'\n\n<!-- === NEW BATCH 6: COVERAGE EXPANSION ({len(new_cards)} articles - July 21, 2026) === -->\n'
        new_content = index_html[:idx] + batch_header + '\n'.join(new_cards) + '\n\n' + index_html[idx:]
        with open(INDEX, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Added {len(new_cards)} new articles to blog/index.html")
    else:
        print("ERROR: Could not find insertion point")

# ===== UPDATE SITEMAP =====
with open(SITEMAP, 'r', encoding='utf-8') as f:
    sitemap = f.read()

urlset_close = sitemap.rfind('</urlset>')
if urlset_close > 0:
    new_urls = []
    for slug in new_slugs:
        entry = f"""  <url>
    <loc>https://cha0smagicklabs.com/blog/{slug}.html</loc>
    <lastmod>2026-07-21</lastmod>
    <priority>0.9</priority>
  </url>"""
        new_urls.append(entry)
    
    sitemap = sitemap[:urlset_close] + '\n'.join(new_urls) + '\n' + sitemap[urlset_close:]
    with open(SITEMAP, 'w', encoding='utf-8') as f:
        f.write(sitemap)
    print(f"Added {len(new_urls)} new URLs to sitemap.xml")
else:
    print("ERROR: Could not find </urlset>")

print(f"\nTotal: {len(new_slugs)} new articles indexed")
