#!/usr/bin/env python3
"""Add product mentions and BTL CTAs to articles that are missing them."""
import os, re

BLOG = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'

# Product page mapping
PRODUCTS = {
    'codex chaoticus': {'page': '../books/codex-chaoticus-pdf.html', 'is_app': False},
    'tarot chaos': {'page': '../books/tarot-chaos-pdf.html', 'is_app': False},
    'astral lab': {'page': '../apps/astral-lab.html', 'is_app': True},
}

# Articles to fix: (prefix, product_name, btl_html)
fixes = [
    # Codex Chaoticus articles missing the mention
    ('sigil-magic-complete-theory-practice', 'codex chaoticus',
     '<p>For a complete exploration of sigil theory, practice, and advanced techniques including cryptographic sigilization and planetary kameas, the <strong>Codex Chaoticus</strong> provides the most comprehensive digital grimoire ever written on chaos magick.</p>'),
    ('egregore-collective-thought-form-power', 'codex chaoticus',
     '<p>The <strong>Codex Chaoticus</strong> dedicates an entire chapter to egregores, astrosomes, and psychopomps, with detailed instructions for creating, maintaining, and safely dissolving collective thought-forms.</p>'),
    ('chaos-magick-belief-as-tool-paradigm-shifting', 'codex chaoticus',
     '<p>Paradigm shifting is covered in depth in the <strong>Codex Chaoticus</strong>, which provides structured exercises for developing the meta-position that makes belief as a tool a practical daily skill.</p>'),
    ('pop-magick-modern-culture-magic', 'codex chaoticus',
     '<p>The <strong>Codex Chaoticus</strong> includes a comprehensive chapter on pop magick and digital magick, with practical techniques for using modern culture as a magical system.</p>'),
    ('technomancy-digital-magic-complete-guide', 'codex chaoticus',
     '<p>Technomancy is one of the advanced topics covered in the <strong>Codex Chaoticus</strong>, which bridges traditional chaos magick with digital practice for the 21st-century practitioner.</p>'),
    ('chaos-magick-history-origins-development', 'codex chaoticus',
     '<p>The <strong>Codex Chaoticus</strong> provides the most complete written history of chaos magick available, from Austin Osman Spare through the IOT to contemporary digital practitioners.</p>'),
    ('neuroplasticity-magic-brain-hacking', 'codex chaoticus',
     '<p>The <strong>Codex Chaoticus</strong> integrates chaos magick with neuroscience, featuring APA-formatted references and detailed explanations of how magical practice physically rewires neural pathways.</p>'),
    # Tarot Chaos articles
    ('tarot-as-gnosis-technology', 'tarot chaos',
     '<p>The <strong>Tarot Chaos</strong> PDF expands on this concept with detailed techniques for using each of the 78 cards as gnosis portals, including specific rituals and correspondences.</p>'),
    ('chaos-tarot-spreads-non-linear', 'tarot chaos',
     '<p>The <strong>Tarot Chaos</strong> PDF features over a dozen original chaotic spread systems, including the Spiral, the Void, and the Mirror layouts described in this article.</p>'),
    ('tarot-paradigm-shifting-techniques', 'tarot chaos',
     '<p>Paradigm shifting with tarot is a central theme of the <strong>Tarot Chaos</strong> PDF, which provides card-based rituals for adopting and releasing belief systems at will.</p>'),
    # Astral Lab articles
    ('moon-sign-meaning-emotions-astrology', 'astral lab',
     '<p><strong>Astral Lab</strong> calculates your exact Moon sign, house placement, and aspects based on your birth data — all offline with zero tracking and unlimited profile storage.</p>'),
]

fixed = 0
for prefix, product, insert_html in fixes:
    # Find the article
    for f in os.listdir(BLOG):
        if f.startswith(prefix) and f.endswith('.html'):
            path = os.path.join(BLOG, f)
            with open(path, 'r', encoding='utf-8') as fh:
                c = fh.read()
            
            # Check if product is already mentioned
            if product not in c.lower():
                # Insert before the FAQ section or at end of body
                faq_pos = c.find('Frequently Asked Questions')
                if faq_pos < 0:
                    faq_pos = c.find('</article>')
                
                if faq_pos > 0:
                    c = c[:faq_pos] + '\n' + insert_html + '\n' + c[faq_pos:]
                    
                    # Also add BTL CTA if missing
                    if 'cta-box' not in c:
                        product_data = PRODUCTS.get(product)
                        if product_data:
                            if product_data['is_app']:
                                btl = f'\n<div class="cta-box"><p><strong>Deepen your practice with the right digital tools.</strong><br>Astral Lab provides professional-grade chart calculations, transit tracking, and aspect analysis — all offline with zero tracking.</p><a href="{product_data["page"]}" target="_blank">Discover Astral Lab &rarr;</a></div>\n'
                            else:
                                btl = f'\n<div class="cta-box"><p><strong>Want the complete system?</strong><br>This topic is explored in depth in the full PDF guide, with step-by-step instructions, correspondences, and practical exercises you can start using today.</p><a href="{product_data["page"]}" target="_blank">Get the PDF &rarr;</a></div>\n'
                            c = c.replace('</article>', btl + '\n</article>')
                    
                    with open(path, 'w', encoding='utf-8') as fh:
                        fh.write(c)
                    print(f'  Fixed: {f} -> added {product} mention')
                    fixed += 1
            else:
                print(f'  OK: {f} (already has {product})')
            break

print(f'\nTotal fixed: {fixed}')
