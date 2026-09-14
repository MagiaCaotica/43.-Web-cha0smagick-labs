#!/usr/bin/env python3
"""
Add internal linking to blog articles - cross-links to apps, books, and tools.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BLOG_DIR = ROOT / "blog"

# App slugs and their display names
APPS = {
    'psi-gym': 'PSI GYM',
    'arcana-goetia': 'Arcana Goetia',
    'norse-rune-oracle': 'Norse Rune Oracle',
    'lunar-phase-calculator': 'Lunar Phase Calculator',
    'iching-oracle': 'I Ching Oracle',
    'chaos-sigil-generator': 'Chaos Sigil Generator',
    'unofficial-rider-waite-tarot': 'Rider-Waite Tarot',
    'dream-machine': 'Dream Machine',
    'astral-lab': 'Astral Lab',
    'eerieroads': 'Eerie Roads',
    'lucid-dream': 'Lucid Dream',
    'noctem-tools': 'NOCTEM',
}

# Book slugs and display names
BOOKS = {
    'manual-activacion-servidores-magicos-pdf': 'Magical Servitors Manual',
    'tratado-runas-cazadoras-caos-pdf': 'Tratado de Runas Cazadoras del Caos',
    'ouija-cazadora-pdf': 'Ouija Cazadora',
    'liber-lvpinux-pdf': 'Liber LVPIVNX',
    'codex-chaoticus-pdf': 'Codex Chaoticus',
    'tarot-chaos-pdf': 'Tarot Chaos',
    'mind-the-gap-pdf': 'Mind the Gap',
}

# Tool pages
TOOLS = {
    'sigil-generator': 'Sigil Generator',
    'rune-caster': 'Rune Caster',
    'i-ching': 'I Ching',
    'natal-chart': 'Natal Chart',
    'lunar-phase': 'Lunar Phase',
    'zener-test': 'Zener ESP Test',
    'dream-journal': 'Dream Journal',
    'pendulum': 'Pendulum',
    'tarot-reader': 'Tarot Reader',
    'moon-calendar': 'Moon Calendar',
}

def find_relevant_links(content, title):
    """Find relevant apps/books/tools based on article content."""
    content_lower = content.lower()
    title_lower = title.lower()
    combined = content_lower + ' ' + title_lower
    
    relevant_apps = []
    relevant_books = []
    relevant_tools = []
    
    # Keyword mapping for apps
    app_keywords = {
        'psi-gym': ['zener', 'esp', 'psychic', 'intuition', 'clairvoyance', 'precognition', 'psi'],
        'arcana-goetia': ['goetia', 'demon', 'evocation', 'spirit', 'goetic', 'ars goetia'],
        'norse-rune-oracle': ['rune', 'futhark', 'norse', 'odin', 'divination', 'cast'],
        'lunar-phase-calculator': ['lunar', 'moon', 'phase', 'moon phase', 'esbat'],
        'iching-oracle': ['i ching', 'iching', 'hexagram', 'coin', 'divination', 'yijing'],
        'chaos-sigil-generator': ['sigil', 'chaos magick', 'sigil generator', 'spare', 'chaos magic'],
        'unofficial-rider-waite-tarot': ['tarot', 'rider-waite', 'major arcana', 'minor arcana', 'card reading'],
        'dream-machine': ['lucid dream', 'dream machine', 'lucid dreaming', 'wild', 'wbtb', 'dream journal'],
        'astral-lab': ['astral', 'astrology', 'natal chart', 'birth chart', 'planet', 'transit'],
        'eerieroads': ['paranormal', 'ghost', 'haunted', 'investigation', 'evp', 'spirit box'],
        'lucid-dream': ['lucid dream', 'dream journal', 'reality check', 'wild', 'wbtb'],
        'noctem-tools': ['paranormal', 'emf', 'spirit box', 'ghost hunting', 'noctem'],
    }
    
    book_keywords = {
        'manual-activacion-servidores-magicos-pdf': ['servitor', 'servitors', 'thoughtform', 'egregore', 'activation'],
        'tratado-runas-cazadoras-caos-pdf': ['rune', 'chaos', 'hunter rune', 'cazadoras', 'futhark'],
        'ouija-cazadora-pdf': ['ouija', 'spirit board', 'planchette', 'communication'],
        'liber-lvpinux-pdf': ['chaos', 'lvpinux', 'sigil', 'grimoire', 'chaos magick'],
        'codex-chaoticus-pdf': ['chaos', 'chaoticus', 'grimoire', 'codex', 'sigil'],
        'tarot-chaos-pdf': ['tarot', 'chaos', 'archetypal', 'spread'],
        'mind-the-gap-pdf': ['paranormal', 'research', 'investigation', 'mind the gap'],
    }
    
    tool_keywords = {
        'sigil-generator': ['sigil', 'generator', 'create sigil'],
        'rune-caster': ['rune', 'cast', 'futhark'],
        'i-ching': ['i ching', 'iching', 'hexagram'],
        'natal-chart': ['natal chart', 'birth chart', 'astrology'],
        'lunar-phase': ['moon phase', 'lunar phase', 'moon'],
        'zener-test': ['zener', 'esp', 'test'],
        'dream-journal': ['dream', 'journal', 'lucid'],
        'pendulum': ['pendulum', 'divination'],
        'tarot-reader': ['tarot', 'reading', 'cards'],
        'moon-calendar': ['moon', 'calendar', 'phase'],
    }
    
    for slug, keywords in app_keywords.items():
        if any(kw in combined for kw in keywords):
            relevant_apps.append((slug, APPS[slug]))
    
    for slug, keywords in book_keywords.items():
        if any(kw in combined for kw in keywords):
            relevant_books.append((slug, BOOKS[slug]))
    
    for slug, keywords in tool_keywords.items():
        if any(kw in combined for kw in keywords):
            relevant_tools.append((slug, TOOLS[slug]))
    
    return relevant_apps, relevant_books, relevant_tools

def build_internal_links_section(apps, books, tools):
    """Build the internal links HTML section."""
    if not apps and not books and not tools:
        return ''
    
    html = ['<section class="internal-links" style="margin: 2rem 0; padding: 1.5rem; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: 8px;">']
    html.append('<h3 style="color: var(--accent-gold); margin-bottom: 1rem;">Related Resources</h3>')
    
    if apps:
        html.append('<div style="margin-bottom: 1rem;">')
        html.append('<strong style="color: var(--text-primary);">Apps:</strong> ')
        links = [f'<a href="../apps/{slug}.html">{name}</a>' for slug, name in apps[:3]]
        html.append(' | '.join(links))
        html.append('</div>')
    
    if books:
        html.append('<div style="margin-bottom: 1rem;">')
        html.append('<strong style="color: var(--text-primary);">Books:</strong> ')
        links = [f'<a href="../books/{slug}.html">{name}</a>' for slug, name in books[:3]]
        html.append(' | '.join(links))
        html.append('</div>')
    
    if tools:
        html.append('<div>')
        html.append('<strong style="color: var(--text-primary);">Free Tools:</strong> ')
        links = [f'<a href="../tools/{slug}.html">{name}</a>' for slug, name in tools[:3]]
        html.append(' | '.join(links))
        html.append('</div>')
    
    html.append('</section>')
    return '\n'.join(html)

def process_article(filepath):
    """Process a single blog article."""
    content = filepath.read_text(encoding='utf-8')
    
    # Extract title
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else ''
    
    # Find relevant links
    apps, books, tools = find_relevant_links(content, title)
    
    if not apps and not books and not tools:
        return False
    
    # Build internal links section
    links_section = build_internal_links_section(apps, books, tools)
    
    # Insert before the References section or at the end of article
    # Look for <h2>References</h2> or </article>
    ref_pattern = r'(<h2>References</h2>)'
    if re.search(ref_pattern, content):
        content = re.sub(ref_pattern, links_section + '\n\\1', content, count=1)
    else:
        # Insert before </article>
        content = content.replace('</article>', links_section + '\n</article>', 1)
    
    filepath.write_text(content, encoding='utf-8')
    return True

def main():
    print('Adding internal links to blog articles...')
    updated = 0
    
    for filepath in sorted(BLOG_DIR.glob('*.html')):
        if filepath.name == 'index.html':
            continue
        if process_article(filepath):
            updated += 1
            if updated % 50 == 0:
                print(f'  Updated {updated} articles...')
    
    print(f'\nDone. Updated {updated} blog articles with internal links.')

if __name__ == '__main__':
    main()