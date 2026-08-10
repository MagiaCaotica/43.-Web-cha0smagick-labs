#!/usr/bin/env python3
"""Audit all 20 Eerie Roads articles."""
import os, re

d = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'
er_page = "../apps/eerieroads.html"

articles = [
    ('1', 'intention-manifestation-guide-gps'),
    ('2', 'chaos-coordinates-synchronicity-guide'),
    ('3', 'sigil-walking-gps-manifestation'),
    ('4', 'digital-privacy-magick-location-data'),
    ('5', 'reality-hacking-entropy-navigation'),
    ('6', 'synchronicity-hunting-beginners-guide'),
    ('7', 'chaos-magick-gps-manifestation-guide'),
    ('8', 'offline-manifestation-app-guide'),
    ('9', 'signs-universe-responding-intentions'),
    ('10', 'geographic-sigils-map-magick'),
    ('11', 'psychic-navigation-intuition-gps'),
    ('12', 'gps-intention-exploration-spiritual-discovery'),
    ('13', 'dark-cartography-night-exploration-magic'),
    ('14', 'synchronicity-journal-tracking-guide'),
    ('15', 'chaos-magick-quantum-observation'),
    ('16', 'gps-manifestation-ritual-step-by-step'),
    ('17', 'liminal-space-gps-coordinates'),
    ('18', 'digital-flaneur-chaos-magick-wandering'),
    ('19', 'digital-shadow-work-privacy-magick'),
    ('20', 'privacy-first-navigation-magical-necessity'),
]

print(f"{'#':>2} {'Slug':55s} {'Words':>6s} {'Size':>5s} {'H2':>3s} {'FAQsch':>6s} {'ERlink':>6s} {'IntLnk':>6s} {'Title':>5s} {'Desc':>5s}")
print('='*110)

for num, slug in articles:
    path = os.path.join(d, slug + '.html')
    if not os.path.exists(path):
        print(f"{num:>2} {slug:55s} NOT FOUND")
        continue
    
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    # Word count (body between H1 and FAQ/Share)
    h1 = c.find('<h1>')
    faq = c.find('Frequently')
    share = c.find('Share this guide')
    end = faq if faq > h1 else (share if share > h1 else h1 + 6000)
    if end > h1:
        body = c[h1:end]
    else:
        body = c[h1:h1+6000]
    words = len(re.sub(r'<[^>]+>', ' ', body).split())
    
    kb = len(c) // 1000
    h2_count = len(re.findall(r'<h2[^>]*>', c))
    faq_schema = c.count('"Question"')
    er_links = c.count(er_page)
    internal_links = len(re.findall(r'href="([^"]+\.html)"', c))
    
    title_m = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
    title_len = len(title_m.group(1)) if title_m else 0
    
    desc_m = re.search(r'<meta name="description" content="([^"]+)"', c)
    desc_len = len(desc_m.group(1)) if desc_m else 0
    
    # Quality flags
    flags = []
    if words >= 500: flags.append('GOOD')
    elif words >= 300: flags.append('OK')
    else: flags.append('SHORT')
    
    if title_len > 60: flags.append('TITLE>60')
    elif title_len < 30: flags.append('TITLE<30')
    
    if desc_len > 160: flags.append('DESC>160')
    elif desc_len < 100: flags.append('DESC<100')
    
    if er_links == 0: flags.append('NOER')
    if h2_count < 2: flags.append('NOHEAD')
    
    print(f"{num:>2} {slug:55s} {words:6d} {kb:4d}K {h2_count:3d} {faq_schema:6d} {er_links:6d} {internal_links:6d} {title_len:5d} {desc_len:5d}  {'|'.join(flags)}")

print()
print('ER_PAGE =', er_page)
print('Legend: GOOD=500+w, OK=300-500w, SHORT=<300w, TITLE>60=over, DESC>160=over, NOER=no Eerie link, NOHEAD=less than 2 H2s')
