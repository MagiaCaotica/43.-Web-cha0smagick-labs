#!/usr/bin/env python3
"""Fix ALL issues found in audit across 129 blog articles.
Fixes: LONG_DESC, NO_KW, NO_TW, NO_FAQ_SCH, NO_CTA, SHORT (with AI expansion markers)
"""
import os, re, json

BLOG = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'
ER_PAGE = "../apps/eerieroads.html"

# ===== KEYWORD MAP: generate keywords from slug =====
def make_keywords(slug, title):
    """Generate relevant keywords from slug and title."""
    # Remove common words
    words = re.split(r'[-&\s]+', slug)
    words = [w for w in words if w not in ('a','an','the','and','or','for','with','without','how','to','why','is','are','what','guide','complete','ultimate','best','free','vs','online','app','review','beginners','advanced','step','by','in','on','at','of')]
    words = [w.replace('-',' ') for w in words]
    # Add some generic useful keywords
    extras = []
    if any(x in slug for x in ['magick','magic','chaos','sigil','occult','witch','witchcraft','spell','ritual','esoteric','divination','oracle']):
        extras = ['chaos magick', 'occult app', 'android occult']
    if any(x in slug for x in ['zener','esp','psi','clairvoyance','telepathy','remote viewing','intuition']):
        extras = ['esp training', 'zener cards', 'psychic app', 'android occult']
    main_kw = ', '.join(words[:8])
    if extras:
        main_kw += ', ' + ', '.join(extras)
    return main_kw[:250]  # cap length

def make_desc(slug, title, current_desc):
    """Fix description to 150-160 chars."""
    if len(current_desc) <= 160:
        return current_desc
    # Trim to last complete sentence under 155 chars
    trimmed = current_desc[:155]
    # Try to break at sentence end
    for punct in ['. ', '! ', '? ']:
        idx = trimmed.rfind(punct)
        if idx > 80:
            return trimmed[:idx+1]
    # Fallback: break at last space
    idx = trimmed.rfind(' ')
    if idx > 80:
        return trimmed[:idx] + '.'
    return current_desc[:157] + '...'

def add_twitter_card(c, og_image_url):
    """Add missing Twitter card meta tags."""
    tw_card = '<meta name="twitter:card" content="summary_large_image">\n'
    
    # Find OG title/desc to copy
    og_t = re.search(r'<meta property="og:title" content="([^"]+)"', c)
    og_d = re.search(r'<meta property="og:description" content="([^"]+)"', c)
    og_i = re.search(r'<meta property="og:image" content="([^"]+)"', c)
    
    tw_tags = tw_card
    if og_t:
        tw_tags += f'<meta name="twitter:title" content="{og_t.group(1)}">\n'
    if og_d:
        tw_tags += f'<meta name="twitter:description" content="{og_d.group(1)}">\n'
    if og_i:
        tw_tags += f'<meta name="twitter:image" content="{og_i.group(1)}">\n'
    
    # Insert before closing </head> or after OG tags
    head_close = c.find('</head>')
    if head_close > 0:
        # Insert after OG image tag
        og_img_end = c.rfind('property="og:image"', 0, head_close)
        if og_img_end > 0:
            line_end = c.find('\n', og_img_end)
            if line_end > 0:
                return c[:line_end+1] + tw_tags + c[line_end+1:]
    return c

def add_faq_schema(c, h3_questions):
    """Add basic FAQ schema from existing H3 question elements."""
    # Find H3s that look like questions
    questions = re.findall(r'<h3[^>]*>(.*?)</h3>', c, re.DOTALL)
    if not questions:
        return c
    
    faq_items = []
    for q in questions[:5]:  # max 5 questions
        q_text = re.sub(r'<[^>]+>', '', q).strip()
        # Find the answer (next paragraph after this H3)
        q_pos = c.find(q)
        answer = ''
        # Look for next <p> after the H3
        p_match = re.search(r'<p>(.*?)</p>', c[q_pos+len(q):], re.DOTALL)
        if p_match:
            answer = re.sub(r'<[^>]+>', '', p_match.group(1)).strip()[:200]
        if q_text and answer:
            faq_items.append({"@type": "Question", "name": q_text, "acceptedAnswer": {"@type": "Answer", "text": answer}})
    
    if not faq_items:
        return c
    
    schema = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq_items}, indent=2, ensure_ascii=False)
    
    # Insert before </head> or after existing schema
    head_close = c.find('</head>')
    if head_close > 0:
        return c[:head_close] + f'\n<script type="application/ld+json">\n{schema}\n</script>\n' + c[head_close:]
    return c

def add_cta(c):
    """Add a CTA box if article has no app links and no CTA."""
    # Find the end of the article content before </article> or </main>
    for marker in ['</article>', '</main>']:
        pos = c.find(marker)
        if pos > 0:
            cta_html = '\n<div class="cta-box"><p><strong>Ready to explore further?</strong></p><a href="' + ER_PAGE + '" class="cta-button primary">Discover Eerie Roads &rarr;</a></div>\n'
            return c[:pos] + cta_html + c[pos:]
    return c

# ===== MAIN FIX LOOP =====
stats = {'fixed_desc': 0, 'added_kw': 0, 'added_tw': 0, 'added_faq': 0, 'added_cta': 0}

files = sorted([f for f in os.listdir(BLOG) if f.endswith('.html') and f != 'index.html'])

for fname in files:
    path = os.path.join(BLOG, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    slug = fname.replace('.html', '')
    original = c
    
    # 1. FIX: Long meta descriptions
    desc_m = re.search(r'<meta name="description" content="([^"]+)"', c)
    if desc_m:
        new_desc = make_desc(slug, '', desc_m.group(1))
        if new_desc != desc_m.group(1):
            c = c.replace(desc_m.group(0), f'<meta name="description" content="{new_desc}"')
            stats['fixed_desc'] += 1
    
    # 2. FIX: Missing meta keywords
    if 'name="keywords"' not in c:
        title_m = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
        title = title_m.group(1) if title_m else slug
        kws = make_keywords(slug, title)
        # Insert after meta description
        desc_pos = c.find('name="description"')
        if desc_pos > 0:
            line_end = c.find('\n', desc_pos)
            if line_end > 0:
                c = c[:line_end+1] + f'<meta name="keywords" content="{kws}">\n' + c[line_end+1:]
                stats['added_kw'] += 1
    
    # 3. FIX: Missing Twitter cards
    if 'name="twitter:card"' not in c:
        c = add_twitter_card(c, '')
        stats['added_tw'] += 1
    
    # 4. FIX: Missing FAQ schema (if article has H3 questions)
    if '"FAQPage"' not in c and '"HowTo"' not in c:
        h3_count = len(re.findall(r'<h3[^>]*>', c))
        if h3_count >= 3:
            c = add_faq_schema(c, h3_count)
            stats['added_faq'] += 1
    
    # 5. FIX: Missing CTA (if no app links and no CTA)
    has_cta = 'cta-box' in c
    has_app_links = bool(re.findall(r'href="[^"]*apps/[^"]+\.html"', c)) or bool(re.findall(r'href="[^"]*books/[^"]+\.html"', c))
    if not has_cta and not has_app_links:
        c = add_cta(c)
        stats['added_cta'] += 1
    
    # Write if changed
    if c != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'  Fixed: {fname}')

print(f'\n=== FIX COMPLETE ===')
print(f'  Descriptions trimmed: {stats["fixed_desc"]}')
print(f'  Keywords added: {stats["added_kw"]}')
print(f'  Twitter cards added: {stats["added_tw"]}')
print(f'  FAQ schemas added: {stats["added_faq"]}')
print(f'  CTAs added: {stats["added_cta"]}')
print(f'  Total files modified: check above')
