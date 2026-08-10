#!/usr/bin/env python3
"""Audit ALL 129 blog articles - v2 with correct word count."""
import os, re, json

d = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs\blog'
ER_PAGE = "../apps/eerieroads.html"

files = sorted([f for f in os.listdir(d) if f.endswith('.html') and f != 'index.html'])

results = []
SHORT_THRESH = 300

for fname in files:
    path = os.path.join(d, fname)
    with open(path, 'r', encoding='utf-8') as f:
        c = f.read()
    
    slug = fname.replace('.html', '')
    kb = len(c) / 1000
    
    # Word count from <main> content
    main_s = c.find('<main')
    main_e = c.find('</main>')
    if main_s > 0 and main_e > main_s:
        body_html = c[main_s:main_e]
    else:
        body_html = c
    body_text = re.sub(r'<[^>]+>', ' ', body_html)
    body_text = re.sub(r'\s+', ' ', body_text).strip()
    word_count = len(body_text.split())
    
    # H2 count
    h2_count = len(re.findall(r'<h2[^>]*>', c))
    h3_count = len(re.findall(r'<h3[^>]*>', c))
    
    # Schema
    has_schema_article = '"Article"' in c and '"@type": "Article"' in c
    has_schema_faq = '"FAQPage"' in c
    has_schema_howto = '"HowTo"' in c
    
    # Title
    title_m = re.search(r'<title>(.*?)</title>', c, re.DOTALL)
    title_text = title_m.group(1) if title_m else ''
    title_len = len(title_text)
    
    # Meta description
    desc_m = re.search(r'<meta name="description" content="([^"]+)"', c)
    desc_text = desc_m.group(1) if desc_m else ''
    desc_len = len(desc_text)
    
    # Meta keywords
    has_kw = 'name="keywords"' in c
    
    # OG / Twitter
    has_og = 'property="og:title"' in c
    has_tw = 'name="twitter:card"' in c
    has_canon = 'rel="canonical"' in c
    has_bread = 'breadcrumb' in c.lower()
    
    # Links
    app_links = len(re.findall(r'href="[^"]*apps/[^"]+\.html"', c))
    book_links = len(re.findall(r'href="[^"]*books/[^"]+\.html"', c))
    er_links = c.count(ER_PAGE) + c.count('eerieroads')
    blog_links = len(re.findall(r'href="[^"]*blog/[^"]+\.html"', c))
    all_internal = app_links + book_links + blog_links
    
    # Images
    img_count = len(re.findall(r'<img[^>]+>', c))
    
    # CTA
    has_cta = 'cta-box' in c
    
    # Date
    date_m = re.search(r'<time datetime="([^"]+)"', c)
    date_pub = date_m.group(1) if date_m else 'unknown'
    
    # Read time
    read_m = re.search(r'(\d+)\s*min read', c)
    read_time = read_m.group(1) if read_m else '?'
    
    # Issues
    issues = []
    if word_count < SHORT_THRESH: issues.append(f'SHORT({word_count}w)')
    if h2_count < 2: issues.append(f'LOW_H2({h2_count})')
    if not has_schema_article: issues.append('NO_ART_SCH')
    if not has_schema_faq and not has_schema_howto and h3_count >= 3: issues.append('NO_FAQ_SCH')
    if not has_cta and app_links == 0 and book_links == 0: issues.append('NO_CTA')
    if desc_len > 165: issues.append(f'LONG_DESC({desc_len})')
    if not has_kw: issues.append('NO_KW')
    if not has_tw: issues.append('NO_TW')
    
    # Category (based on slug patterns)
    if any(x in slug for x in ['eerieroads', 'eerieroad', 'gps', 'coordinate', 'intention-manifestation', 'chaos-coordinate', 'sigil-walking', 'reality-hack', 'synchronicity-hunt', 'offline-manifest', 'geographic-sigil', 'psychic-navigation', 'dark-cartograph', 'synchronicity-journal', 'quantum-observ', 'liminal-space', 'digital-flaneur', 'digital-shadow', 'privacy-first']):
        category = 'EERIE_ROADS'
    elif any(x in slug for x in ['psi-gym', 'zener', 'esp', 'clairvoyance', 'remote-view', 'remote-perception', 'psi-hit', 'increase-esp', 'scientific-studies', 'can-you-train']):
        category = 'PSI_GYM'
    elif any(x in slug for x in ['dream-machine', 'lucid-dream', 'dream-journal', 'dream-control', 'dream-sign', 'wake-back', 'theta-wave', 'reality-check', 'oneironautics', 'mild-vs']):
        category = 'DREAM_MACHINE'
    elif any(x in slug for x in ['arcana-goetia', 'goetic']):
        category = 'ARCANA_GOETIA'
    elif any(x in slug for x in ['norse-rune', 'viking-oracle', 'bindrune']):
        category = 'NORSE_RUNE'
    elif any(x in slug for x in ['lunar-phase', 'moon-phase', 'new-moon']):
        category = 'LUNAR_PHASE'
    elif any(x in slug for x in ['iching', 'i-ching']):
        category = 'I_CHING'
    elif any(x in slug for x in ['chaos-sigil', 'sigil-maker', 'sigil-creator', 'sigil-engine', 'sigilscribe', 'sigil-vs', 'how-to-make-digital', 'how-to-charge', 'cryptographic-sigil']):
        category = 'SIGIL'
    elif any(x in slug for x in ['rider-waite', 'tarot-spread', 'tarot-chaos']):
        category = 'TAROT'
    elif any(x in slug for x in ['astral-lab', 'astrology-app']):
        category = 'ASTRAL_LAB'
    elif any(x in slug for x in ['astral-project', 'astral-realm', 'energy-body', 'silver-cord', 'vibrational-state', 'monroe-method', 'obe-chaos']):
        category = 'ASTRAL'
    elif any(x in slug for x in ['chaos-magick-beginner', 'what-is-magick', 'what-is-gnosis', 'paradigm-shift', 'history-of-chaos', 'complete-magickal', 'how-to-create', 'how-to-banish', 'egregore']):
        category = 'CORE_CHAOS'
    else:
        category = 'OTHER'
    
    results.append({
        'no': len(results) + 1,
        'slug': slug,
        'category': category,
        'kb': round(kb, 1),
        'words': word_count,
        'h2': h2_count,
        'h3': h3_count,
        'sch_article': has_schema_article,
        'sch_faq': has_schema_faq or has_schema_howto,
        'title_len': title_len,
        'desc_len': desc_len,
        'has_kw': has_kw,
        'has_og': has_og,
        'has_tw': has_tw,
        'has_canon': has_canon,
        'has_bread': has_bread,
        'app_links': app_links,
        'er_links': er_links,
        'all_links': all_internal,
        'img_count': img_count,
        'has_cta': has_cta,
        'date': date_pub[:10],
        'read_min': read_time,
        'issues': issues,
        'issues_n': len(issues)
    })

# === CATEGORY STATS ===
cats = {}
for r in results:
    cats.setdefault(r['category'], []).append(r)

# === PRINT REPORT ===
print(f"\n{'='*150}")
print(f"FULL AUDIT REPORT - {len(results)} ARTICLES")
print(f"{'='*150}")
print(f"{'No':>4s} {'Category':16s} {'Article':50s} {'Words':>6s} {'KB':>5s} {'H2':>3s} {'H3':>3s} {'Sch':>4s} {'Title':>5s} {'Desc':>5s} {'AppL':>4s} {'BlogL':>4s} {'Img':>3s} {'Date':>12s} {'Issues'}")
print(f"{'─'*150}")

for r in results:
    sch = 'Y' if r['sch_article'] else 'N'
    issues_s = ','.join(r['issues'][:4]) if r['issues'] else '✓'
    flag = '⚠' if r['issues'] else ' '
    print(f"{r['no']:4d} {r['category']:16s} {r['slug'][:50]:50s} {r['words']:6d} {r['kb']:5.1f} {r['h2']:3d} {r['h3']:3d} {sch:4s} {r['title_len']:5d} {r['desc_len']:5d} {r['app_links']:4d} {r['all_links']:4d} {r['img_count']:3d} {r['date']:12s} {issues_s[:35]:35s}")

# === SUMMARY STATS ===
total_issues = sum(r['issues_n'] for r in results)
articles_with_issues = sum(1 for r in results if r['issues_n'] > 0)
avg_words = sum(r['words'] for r in results) / len(results)
min_words = min(r['words'] for r in results)
max_words = max(r['words'] for r in results)

print(f"\n{'='*150}")
print(f"SUMMARY STATISTICS")
print(f"{'='*150}")
print(f"Total articles: {len(results)}")
print(f"Average words: {avg_words:.0f}")
print(f"Word range: {min_words} - {max_words}")
print(f"Articles with issues: {articles_with_issues}/{len(results)} ({articles_with_issues/len(results)*100:.0f}%)")
print(f"Total issues found: {total_issues}")
print(f"\nIssue breakdown:")
for issue_type in sorted(set(i.split('(')[0] for r in results for i in r['issues'])):
    count = sum(1 for r in results if any(issue_type in i for i in r['issues']))
    print(f"  {issue_type}: {count} articles")

print(f"\nCategory breakdown:")
for cat, items in sorted(cats.items()):
    avg = sum(r['words'] for r in items) / len(items)
    issues_c = sum(r['issues_n'] for r in items)
    no_cta = sum(1 for r in items if not r['has_cta'] and r['app_links'] == 0)
    print(f"  {cat:20s} {len(items):3d} articles  avg={avg:5.0f}w  issues={issues_c:3d}  noCTA={no_cta:2d}")

# Export
with open(os.path.join(d, '..', 'scripts', 'audit_results_v2.json'), 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2, ensure_ascii=False)
print(f"\nFull JSON: scripts/audit_results_v2.json")
