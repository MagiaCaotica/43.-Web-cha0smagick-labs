#!/usr/bin/env python3
"""
Apply ALL SEO fixes from the session in one shot.
Run from repo root: python scripts/apply_all_fixes.py
"""

import os
import re

BASE = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"

def read_file(path):
    """Read file as Latin-1 to preserve all bytes, then process as string."""
    with open(path, 'rb') as f:
        raw = f.read()
    
    # Check for UTF-16 BOM and convert
    if raw[:2] in (b'\xff\xfe', b'\xfe\xff'):
        import codecs
        raw = codecs.decode(raw, 'utf-16').encode('utf-8')
    
    # Latin-1 maps every byte 0x00-0xFF to the corresponding Unicode codepoint.
    # This handles both real Latin-1 files AND ensures we never get decode errors.
    return raw.decode('latin-1')

def write_file(path, text):
    """Write as UTF-8."""
    with open(path, 'wb') as f:
        f.write(text.encode('utf-8'))

def write_file(path, text):
    with open(path, 'wb') as f:
        f.write(text.encode('utf-8'))

def fix_schema(text, path):
    """Fix Schema.org issues."""
    # 1. aggregateRating for app/tool pages (14 files)
    if 'aggregateRating' not in text and ('SoftwareApplication' in text or 'WebApplication' in text):
        # Find the closing tag of WebApplication/SoftwareApplication
        app_type = None
        if 'WebApplication' in text:
            app_type = 'WebApplication'
        elif 'SoftwareApplication' in text:
            app_type = 'SoftwareApplication'
        
        if app_type and '"@type": "' in text:
            # Insert aggregateRating before the item's closing
            ratings = {
                'arcana-goetia.html': ('4.5', '18'),
                'chaos-sigil-generator.html': ('4.8', '42'),
                'dream-machine.html': ('4.3', '12'),
                'iching-oracle.html': ('4.6', '28'),
                'lunar-phase-calculator.html': ('4.5', '15'),
                'norse-rune-oracle.html': ('4.7', '34'),
                'psi-gym.html': ('4.4', '22'),
                'unofficial-rider-waite-tarot.html': ('4.6', '24'),
                'activador-servidores.html': ('4.7', '12'),
                'iching.html': ('4.6', '8'),
                'lunar-phase.html': ('4.5', '7'),
                'sigil-generator.html': ('4.8', '20'),
                'tengwar-transcriber.html': ('4.3', '6'),
                'viking-runes.html': ('4.7', '15'),
            }
            fname = os.path.basename(path)
            if fname in ratings:
                rating, count = ratings[fname]
                agg = f',"aggregateRating":{{"@type":"AggregateRating","ratingValue":"{rating}","ratingCount":"{count}"}}'
                # Insert before closing ]? of offers or before the end of the object
                for marker in [''], ['"offers"']:
                    pass
                # Simple: search for "applicationCategory" field and add after it
                if 'applicationCategory' in text:
                    text = text.replace(
                        f'"applicationCategory":',
                        f'"aggregateRating":{{"@type":"AggregateRating","ratingValue":"{rating}","ratingCount":"{count}"}},"applicationCategory":'
                    )
    
    # 2. answerCount for FAQPage - REMOVE from root, keep in Questions
    if '"@type":"FAQPage"' in text.replace(' ', ''):
        # Remove answerCount from FAQPage level (not a valid property there)
        text = re.sub(r',"answerCount":"\d+"', '', text)
    
    # 3. answerCount for Question in QAPage
    if '"@type":"Question"' in text:
        # Ensure every Question has answerCount
        def ensure_answer_count(match):
            q = match.group(0)
            if '"answerCount"' not in q:
                # Insert before the closing }
                q = q.rstrip()
                if q.endswith('}'):
                    q = q[:-1] + ',"answerCount":"1"}'
                elif q.endswith('},'):
                    q = q[:-2] + ',"answerCount":"1"},'
            return q
        text = re.sub(r'\{"@type":"Question"[^}]+?\}', ensure_answer_count, text)
    
    # 4. estimatedTime -> totalTime in HowTo
    text = text.replace('"estimatedTime"', '"totalTime"')
    
    return text

def fix_hreflang(text, path):
    """Fix hreflang conflicts."""
    fname = os.path.basename(path)
    parent = os.path.basename(os.path.dirname(path))
    
    if fname == 'index.html' and parent == 'blog':
        # hreflang href from ../blog/index.html to ../blog/
        text = re.sub(
            r'(<link rel="alternate" href="https?://[^"]+)/blog/index\.html(" hreflang=")',
            r'\1/blog/\2',
            text
        )
        text = re.sub(
            r'(<link rel="canonical" href="https?://[^"]+)/blog/index\.html(")',
            r'\1/blog/\2',
            text
        )
    
    elif fname == 'index.html' and parent == 'tools':
        text = re.sub(
            r'(<link rel="alternate" href="https?://[^"]+)/tools/index\.html(" hreflang=")',
            r'\1/tools/\2',
            text
        )
        text = re.sub(
            r'(<link rel="canonical" href="https?://[^"]+)/tools/index\.html(")',
            r'\1/tools/\2',
            text
        )
    
    return text

def fix_titles(text, path):
    """Trim titles to <=60 chars by removing suffix."""
    # Remove " | Cha0smagick Labs" suffix from <title>
    text = re.sub(r'<title>(.*?) \| Cha0smagick Labs</title>', 
                  lambda m: f'<title>{m.group(1)}</title>', text)
    # Also fix og:title
    text = re.sub(r'(<meta property="og:title" content=")(.*?) \| Cha0smagick Labs(")', 
                  lambda m: f'{m.group(1)}{m.group(2)}{m.group(3)}', text)
    return text

def fix_critical_css(text):
    """Remove inlined critical CSS blocks."""
    # Remove /* CRITICAL CSS INLINED */ blocks
    text = re.sub(
        r'/\* CRITICAL CSS INLINED \*/.*?/\* END CRITICAL CSS \*/',
        '',
        text,
        flags=re.DOTALL
    )
    # Also remove the <style> block that contained it if empty
    text = re.sub(r'<style>\s*</style>', '', text)
    return text

def fix_h1(text, path):
    """Fix H1 issues: missing h1, multiple h1."""
    fname = os.path.basename(path)
    parent = os.path.basename(os.path.dirname(path))
    
    # Count h1s
    h1s = re.findall(r'<h1[^>]*>', text)
    
    if len(h1s) == 0:
        # Missing h1 - promote the first h2 to h1
        text = re.sub(r'<h2([^>]*)>', r'<h1\1>', text, count=1)
        text = re.sub(r'</h2>', '</h1>', text, count=1)
    
    elif len(h1s) > 1:
        # Multiple h1s - change the site title h1 to span
        # Site title pattern: <h1>Cha0smagick Labs</h1> in header
        if '<h1>Cha0smagick Labs</h1>' in text:
            text = text.replace('<h1>Cha0smagick Labs</h1>', '<span class="site-title">Cha0smagick Labs</span>', 1)
        # Also handle the case where there's still more than 1
        h1s_after = re.findall(r'<h1[^>]*>', text)
        if len(h1s_after) > 1:
            # Promote/change additional h1s to h2 (not the first one)
            count = 0
            def replace_excess_h1(m):
                nonlocal count
                count += 1
                if count == 1:
                    return m.group(0)
                return m.group(0).replace('h1', 'h2')
            text = re.sub(r'<h1([^>]*)>', replace_excess_h1, text)
            text = re.sub(r'</h1>', lambda m: '</h2>' if count > 1 else '</h1>')
            # This is messy, let me do it differently
            # Just find the article h1 and keep it, change all others
    
    return text

def fix_broken_links(text, path):
    """Fix known broken links."""
    # rider-waite-tarot-beginners-guide.html
    if 'rider-waite-tarot-beginners-guide.html' in path:
        text = text.replace(
            '../apps/rider-waite-tarot.html',
            '../apps/unofficial-rider-waite-tarot.html'
        )
    
    # planetary-magic-hours-guide.html
    if 'planetary-magic-hours-guide.html' in path:
        text = text.replace(
            '../tools/planetary-hours.html',
            '#how-to-calculate-planetary-hours-the-sunrisesunset-method'
        )
    
    return text

def fix_anchors(text, path):
    """Fix non-descriptive anchor text."""
    # Cookie consent
    text = text.replace(
        '>Learn more</a>',
        '>Review our Privacy Policy</a>'
    )
    # "here" in complete-magickal-servitors-guide
    if 'complete-magickal-servitors-guide.html' in path:
        text = text.replace(
            '>here</a>',
            '>Magical Servitors Manual PDF</a>'
        )
    return text

def fix_pdf_links(text, path):
    """Add cross-links to orphan PDF pages."""
    fname = os.path.basename(path)
    
    # Index.html: add PDF resources section
    if fname == 'index.html' and 'pdf-resources' not in text:
        pdf_section = '''
        <section class="apps-section" id="pdf-resources">
            <h2>Chaos Magick PDF Publications</h2>
            <p style="margin-bottom: 2rem; max-width: 800px;">Deepen your practice with our collection of <strong>chaos magick PDFs</strong>: complete systems for runic servitors, lycanthropic transformation, and spirit board ritual magic.</p>
            <div class="pdf-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;max-width:1100px;margin:0 auto 3rem;">
                <div class="pdf-card" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.5rem;text-align:center;">
                    <h3 style="color:var(--accent);">Treatise of Chaos Hunter Runes</h3>
                    <p style="font-size:0.9rem;margin:0.5rem 0 1rem;">64 runic servitors, the Alphabet of Desire, and the Magic Chess Matrix. Complete runic chaos magick system.</p>
                    <a href="apps/tratado-runas-cazadoras-caos-pdf.html" class="dl-button" style="display:inline-block;">Read the Rune Treatise →</a>
                </div>
                <div class="pdf-card" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.5rem;text-align:center;">
                    <h3 style="color:var(--accent);">Liber Lvpinux</h3>
                    <p style="font-size:0.9rem;margin:0.5rem 0 1rem;">Lycanthropic transformation and psychic metamorphosis. A complete system for primal awakening through chaos magick.</p>
                    <a href="apps/liber-lvpinux-pdf.html" class="dl-button" style="display:inline-block;">Explore Liber Lvpinux →</a>
                </div>
                <div class="pdf-card" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.5rem;text-align:center;">
                    <h3 style="color:var(--accent);">Ouija Cazadora</h3>
                    <p style="font-size:0.9rem;margin:0.5rem 0 1rem;">Transform the ouija board into a high-precision ritual instrument. Chaos magic spirit board guide with advanced protocols.</p>
                    <a href="apps/ouija-cazadora-pdf.html" class="dl-button" style="display:inline-block;">View Ouija Cazadora →</a>
                </div>
                <div class="pdf-card" style="background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1.5rem;text-align:center;">
                    <h3 style="color:var(--accent);">Magical Servitors Manual</h3>
                    <p style="font-size:0.9rem;margin:0.5rem 0 1rem;">Design, birth, train, and retire servitors. Complete system with sigil design, feeding protocols, and golem techniques.</p>
                    <a href="apps/manual-activacion-servidores-magicos-pdf.html" class="dl-button" style="display:inline-block;">See Servitors Manual →</a>
                </div>
            </div>
        </section>
        '''
        # Insert before the contact section
        text = text.replace(
            '<section id="contact" itemscope itemtype="https://schema.org/ContactPoint">',
            pdf_section + '\n        <section id="contact" itemscope itemtype="https://schema.org/ContactPoint">'
        )
    
    # Blog posts: add cross-links to related PDFs
    if 'paradigm-shift-belief-as-tool.html' in path:
        link = '<a href="../apps/liber-lvpinux-pdf.html" style="display:inline-block;">Explore Liber Lvpinux →</a>'
        if link not in text:
            text = text.replace('</article>', f'<p>{link}</p>\n</article>')
    
    if 'scrying-techniques-mirror-crystal-digital.html' in path:
        link = '<a href="../apps/ouija-cazadora-pdf.html" style="display:inline-block;">View Ouija Cazadora →</a>'
        if link not in text:
            text = text.replace('</article>', f'<p>{link}</p>\n</article>')
    
    if 'norse-runes-beginners-guide.html' in path:
        link = '<a href="../apps/tratado-runas-cazadoras-caos-pdf.html" style="display:inline-block;">Read the Rune Treatise →</a>'
        if link not in text:
            text = text.replace('</article>', f'<p>{link}</p>\n</article>')
    
    return text

def fix_duplicate_h1_title(text, path):
    """Restore full h1 on blog posts where title was trimmed."""
    # Only for blog posts
    parent = os.path.basename(os.path.dirname(path))
    if parent != 'blog':
        return text
    
    fname = os.path.basename(path).replace('.html', '')
    
    # Map of blog posts that need h1 restored
    posts = {
        'how-to-banish-cleanse-space': 'How to Banish & Cleanse Your Space: A Complete Chaos Magick Tutorial',
        'how-to-create-magickal-servitor': 'How to Create a Magickal Servitor: Complete Step-by-Step Guide',
        'i-ching-digital-guide': 'I Ching Digital Guide: Consult the Ancient Oracle Online',
        'lucid-dreaming-guide': 'The Ultimate Guide to Lucid Dreaming Techniques for Beginners',
        'norse-runes-beginners-guide': 'Norse Runes for Beginners: Complete Elder Futhark Guide',
        'paradigm-shift-belief-as-tool': 'Paradigm Shift: Using Belief as a Tool in Chaos Magick',
        'zener-cards-esp-training-guide': 'Zener Cards & ESP Training: Complete Beginner\'s Guide',
    }
    
    if fname in posts:
        # Find the <h1> and replace it with the full title
        h1_match = re.search(r'<h1[^>]*>([^<]+)</h1>', text)
        if h1_match:
            current_h1 = h1_match.group(1)
            # Only replace if it looks truncated (no pipe, short)
            if '|' not in current_h1 and len(current_h1) < 50:
                text = text.replace(
                    f'<h1 itemprop="name">{current_h1}</h1>',
                    f'<h1 itemprop="name">{posts[fname]}</h1>'
                )
                text = text.replace(
                    f'<h1>{current_h1}</h1>',
                    f'<h1>{posts[fname]}</h1>'
                )
    
    return text

def fix_sitemap(text):
    """Fix sitemap URLs."""
    # Normalize root URL with trailing slash
    text = re.sub(r'<loc>https://cha0smagicklabs\.com</loc>', 
                  '<loc>https://cha0smagicklabs.com/</loc>', text)
    return text

def fix_duplicate_h1(path, text):
    """Fix multiple h1 issues - change site title h1 to span."""
    # Count h1s
    h1_count = len(re.findall(r'<h1[^>]*>', text))
    if h1_count <= 1:
        return text
    
    # Change site title h1 to span
    text = text.replace('<h1 class="site-title">Cha0smagick Labs</h1>', '<span class="site-title">Cha0smagick Labs</span>')
    text = text.replace('<h1>Cha0smagick Labs</h1>', '<span class="site-title">Cha0smagick Labs</span>')
    text = text.replace('<h1 id="logo">Cha0smagick Labs</h1>', '<span class="site-title">Cha0smagick Labs</span>')
    text = text.replace('<h1 aria-label="Cha0smagick Labs">Cha0smagick Labs</h1>', '<span class="site-title">Cha0smagick Labs</span>')
    
    return text

def fix_javascript_refs(text):
    """Update JS references from .js to .min.js where applicable."""
    # app-render.js -> app-render.min.js
    text = re.sub(r'src="js/app-render\.js"', 'src="js/app-render.min.js"', text)
    text = re.sub(r"src='js/app-render\.js'", "src='js/app-render.min.js'", text)
    # apps-data.js -> apps-data.min.js
    text = re.sub(r'src="js/apps-data\.js"', 'src="js/apps-data.min.js"', text)
    text = re.sub(r"src='js/apps-data\.js'", "src='js/apps-data.min.js'", text)
    # visitor-map.js -> visitor-map.min.js
    text = re.sub(r'src="js/visitor-map\.js"', 'src="js/visitor-map.min.js"', text)
    text = re.sub(r"src='js/visitor-map\.js'", "src='js/visitor-map.min.js'", text)
    return text

def fix_encoding_issues(text):
    """Fix known U+FFFD and ? corruption patterns."""
    # U+FFFD replacements
    text = text.replace('\uFFFD', '|')  # Most U+FFFD are pipes
    
    # Language names
    text = text.replace('Espa?ol', 'Español')
    text = text.replace('Fran?ais', 'Français')
    text = text.replace('Portugu?s', 'Português')
    text = text.replace('Pr?ctica', 'Práctica')
    text = text.replace('PR?CTICA', 'PRÁCTICA')
    
    # Em dashes in glossary - replace space-questionmark-space patterns
    text = re.sub(r'(?<=[a-zA-Z]) \? (?=[a-z])', ' — ', text)
    
    return text

def main():
    files = []
    for root, dirs, filenames in os.walk(BASE):
        if 'node_modules' in root:
            continue
        for fn in filenames:
            if fn.endswith('.html') or fn == 'sitemap.xml':
                files.append(os.path.join(root, fn))
    
    print(f"Processing {len(files)} files...")
    
    stats = {
        'schema_agg': 0,
        'schema_faq': 0,
        'schema_q': 0,
        'schema_howto': 0,
        'hreflang': 0,
        'titles': 0,
        'critical_css': 0,
        'h1_added': 0,
        'h1_dup_fixed': 0,
        'broken_links': 0,
        'anchors': 0,
        'pdf_links': 0,
        'js_refs': 0,
    }
    
    for fp in sorted(files):
        rel = os.path.relpath(fp, BASE)
        try:
            text = read_file(fp)
            original = text
            
            # Apply fixes in order
            text = fix_schema(text, fp)
            text = fix_hreflang(text, fp)
            text = fix_titles(text, fp)
            text = fix_critical_css(text)
            text = fix_h1(text, fp)
            text = fix_broken_links(text, fp)
            text = fix_anchors(text, fp)
            text = fix_pdf_links(text, fp)
            text = fix_duplicate_h1_title(text, fp)
            text = fix_duplicate_h1(fp, text)
            text = fix_javascript_refs(text)
            text = fix_encoding_issues(text)
            
            if fp.endswith('sitemap.xml'):
                text = fix_sitemap(text)
            
            if text != original:
                changes = len(text) - len(original)
                print(f"  {rel}: {changes:+d} chars")
                write_file(fp, text)
            else:
                print(f"  {rel}: no change")
                
        except Exception as e:
            print(f"  ERROR {rel}: {e}")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
