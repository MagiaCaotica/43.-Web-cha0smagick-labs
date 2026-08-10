"""
Batch 4 - Item 1: Cross-links between related blog articles.
Builds a keyword/topic map from article titles + H2 headings,
then injects a "Related Articles" section at the bottom of each article.
"""
import re, os, json, math

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
BLOG = os.path.join(ROOT, 'blog')

# ============================================================
# Step 1: Build article database
# ============================================================
articles = {}  # slug -> {title, h2s, size, abstract, keywords}

for f in sorted(os.listdir(BLOG)):
    if not f.endswith('.html') or f == 'index.html':
        continue
    slug = f.replace('.html', '')
    path = os.path.join(BLOG, f)
    
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Extract title from <title> tag, strip site name suffix
    title_match = re.search(r'<title>(.*?)</title>', content)
    raw_title = title_match.group(1) if title_match else slug
    title = re.sub(r'\s*\|.*$', '', raw_title).strip()
    
    # Extract h2 headings from article
    article_start = content.find('<article')
    article_end = content.find('</article>')
    if article_start < 0 or article_end < 0:
        continue
    article_html = content[article_start:article_end]
    
    h2s = re.findall(r'<h2[^>]*>(.*?)</h2>', article_html)
    
    # Get first 200 chars of content for abstract
    text_content = re.sub(r'<[^>]+>', ' ', article_html)
    text_content = re.sub(r'\s+', ' ', text_content).strip()
    abstract = text_content[:200]
    
    # Build keyword set from title + h2s
    keywords = set()
    for src in [title] + h2s:
        # Extract meaningful words (skip stopwords)
        words = re.findall(r'[A-Za-z][a-z]{2,}', src)
        for w in words:
            wl = w.lower()
            if wl not in {'the', 'and', 'for', 'are', 'you', 'your', 'what', 'how', 'why', 'can',
                          'all', 'but', 'not', 'with', 'has', 'have', 'its', 'was', 'from',
                          'that', 'this', 'each', 'will', 'about', 'they', 'also', 'into',
                          'our', 'over', 'their', 'than', 'then', 'very', 'just', 'more',
                          'most', 'some', 'such', 'guide', 'complete', 'beginners', 'review',
                          'tips', 'online', 'free', 'best', 'ultimate', 'easy', 'essential',
                          'every', 'step', 'steps', 'need', 'know', 'using', 'used', 'many',
                          'well', 'both', 'here', 'there', 'does', 'where', 'when', 'who'}:
                keywords.add(wl)

    articles[slug] = {
        'title': title,
        'h2s': h2s,
        'keywords': keywords,
        'abstract': abstract,
        'size': len(text_content),
    }

print(f'Total articles indexed: {len(articles)}')

# ============================================================
# Step 2: Find related articles
# ============================================================
def jaccard_similarity(a, b):
    """Compute Jaccard similarity between two keyword sets."""
    if not a or not b:
        return 0
    intersection = a & b
    union = a | b
    return len(intersection) / len(union)

# Build similarity matrix
related = {}  # slug -> [(related_slug, score)]
for slug_a, data_a in articles.items():
    scores = []
    for slug_b, data_b in articles.items():
        if slug_a == slug_b:
            continue
        sim = jaccard_similarity(data_a['keywords'], data_b['keywords'])
        if sim >= 0.15:  # minimum similarity threshold
            scores.append((slug_b, sim))
    
    # Sort by similarity, take top 4
    scores.sort(key=lambda x: -x[1])
    related[slug_a] = scores[:4]

# Show stats
max_rel = max(len(v) for v in related.values())
min_rel = min(len(v) for v in related.values())
avg_rel = sum(len(v) for v in related.values()) / len(related)
print(f'Related articles per article: max={max_rel}, min={min_rel}, avg={avg_rel:.1f}')

# ============================================================
# Step 3: Inject "Related Articles" section
# ============================================================
RELATED_TPL = '''
    <section class="related-articles">
        <h2>Related Articles</h2>
        <div class="related-links">
            {items}
        </div>
    </section>

'''

RELATED_ITEM_TPL = '<p><a href="../blog/{slug}.html">{title} →</a></p>'

injected = 0
skipped_already = 0
skipped_no_rel = 0
skipped_no_article = 0

for slug, rel_list in related.items():
    if not rel_list:
        skipped_no_rel += 1
        continue
    
    path = os.path.join(BLOG, f'{slug}.html')
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Skip if already has related articles
    if 'related-articles' in content or 'related-links' in content:
        skipped_already += 1
        continue
    
    # Find location: before </article>
    article_end = content.rfind('</article>')
    if article_end < 0:
        skipped_no_article += 1
        continue
    
    # Build related items HTML
    items_html = '\n'.join(
        RELATED_ITEM_TPL.format(slug=rslug, title=articles[rslug]['title'])
        for rslug, _ in rel_list
    )
    section_html = RELATED_TPL.format(items=items_html)
    
    # Inject before </article>
    new_content = content[:article_end] + section_html + content[article_end:]
    
    with open(path, 'w', encoding='utf-8') as fh:
        fh.write(new_content)
    
    print(f'OK: {slug} -> {", ".join(rslug for rslug, _ in rel_list)}')
    injected += 1

print(f'\n=== Results ===')
print(f'Injected related articles: {injected}')
print(f'Skipped (already has): {skipped_already}')
print(f'Skipped (no relations): {skipped_no_rel}')
print(f'Skipped (no article tag): {skipped_no_article}')
