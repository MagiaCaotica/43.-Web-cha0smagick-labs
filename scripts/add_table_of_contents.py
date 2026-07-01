"""
Batch 4 - Item 2: Table of Contents injection.
For articles with >=5 section H2 headings, adds id attributes to each
section H2 (preserving existing ones) and injects a collapsible ToC
right before the first section heading.
Uses string-level replacements for maximum stability.
"""
import re, os

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
BLOG = os.path.join(ROOT, 'blog')

def slugify(text):
    slug = text.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s-]+', '-', slug).strip('-')
    return slug or 'heading'

def get_unique_id(text, existing_ids):
    base = slugify(text)
    if base not in existing_ids:
        return base
    counter = 2
    while f'{base}-{counter}' in existing_ids:
        counter += 1
    return f'{base}-{counter}'

def clean_inner(text):
    """Strip HTML tags from inner content for display."""
    return re.sub(r'<[^>]+>', '', text).strip()

def main():
    files = sorted(os.listdir(BLOG))
    injected = 0
    skipped_no_article = 0
    skipped_few_h2 = 0
    skipped_already = 0

    for filename in files:
        if not filename.endswith('.html') or filename == 'index.html':
            continue

        path = os.path.join(BLOG, filename)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()

        if 'table-of-contents' in content:
            skipped_already += 1
            continue

        article_start = content.find('<article')
        article_end = content.find('</article>')
        if article_start < 0 or article_end < 0:
            skipped_no_article += 1
            continue

        before_article = content[:article_start]
        article_html = content[article_start:article_end]
        after_article = content[article_end:]

        is_pattern_1 = bool(re.search(r'class="blog-meta"', article_html))

        # Find all H2 heading tags with their exact text
        h2_matches = list(re.finditer(
            r'<h2([^>]*)>(.*?)</h2>', article_html, re.IGNORECASE | re.DOTALL
        ))

        # Pattern 1: first H2 is the article title, skip it
        if is_pattern_1:
            section_h2s = h2_matches[1:]
        else:
            section_h2s = h2_matches

        # Exclude H2s inside the injected related-articles section
        related_idx = article_html.find('<section class="related-articles">')
        if related_idx >= 0:
            section_h2s = [m for m in section_h2s if m.start() < related_idx]

        if len(section_h2s) < 5:
            skipped_few_h2 += 1
            continue

        # Collect all existing IDs
        existing_ids = set(re.findall(r'id="([^"]*)"', content))

        # Build maps: full_tag -> new_tag (with id), and collect toc entries
        id_replacements = {}   # old_tag -> new_tag (unique by full tag)
        toc_entries = []       # (heading_id, display_text)

        for match in section_h2s:
            full_tag = match.group(0)
            attrs = match.group(1).strip()
            inner = match.group(2)

            text = clean_inner(inner)
            if not text:
                continue

            existing = re.search(r'id="([^"]*)"', attrs)
            if existing:
                hid = existing.group(1)
            else:
                hid = get_unique_id(text, existing_ids)
                existing_ids.add(hid)
                new_attrs = f' id="{hid}"' + (f' {attrs}' if attrs else '')
                new_tag = f'<h2{new_attrs}>{inner}</h2>'
                id_replacements[full_tag] = new_tag

            toc_entries.append((hid, text))

        # Apply id replacements (from end to start to preserve positions)
        for old_tag, new_tag in id_replacements.items():
            article_html = article_html.replace(old_tag, new_tag, 1)

        # Build ToC HTML
        toc_items = '\n'.join(
            f'            <li><a href="#{hid}">{htext}</a></li>'
            for hid, htext in toc_entries
        )

        toc_block = (
            '\n        <details class="table-of-contents" open>\n'
            '            <summary>Table of Contents</summary>\n'
            '            <nav aria-label="Table of Contents">\n'
            '                <ol>\n'
            f'{toc_items}\n'
            '                </ol>\n'
            '            </nav>\n'
            '        </details>\n'
        )

        # Find the first section H2 in the now-modified article_html
        # Use string search to find its position
        first_section_tag = section_h2s[0].group(0)
        # The tag might have been modified if we added an id
        if first_section_tag in id_replacements:
            first_section_tag = id_replacements[first_section_tag]
        inject_pos = article_html.find(first_section_tag)
        if inject_pos < 0:
            # Fallback: find any <h2> that matches the first section text
            fallback_text = clean_inner(section_h2s[0].group(2))
            for m in re.finditer(r'<h2[^>]*>.*?</h2>', article_html, re.DOTALL):
                if clean_inner(m.group(2)) == fallback_text:
                    inject_pos = m.start()
                    break
            if inject_pos < 0:
                print(f'WARN: cannot find injection point in {filename}, skipping')
                continue

        new_article_html = article_html[:inject_pos] + toc_block + article_html[inject_pos:]
        new_content = before_article + new_article_html + after_article

        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(new_content)

        print(f'OK: {filename} ({len(toc_entries)} sections)')
        injected += 1

    print(f'\n=== Results ===')
    print(f'Injected ToC: {injected}')
    print(f'Skipped (already has): {skipped_already}')
    print(f'Skipped (<5 H2s): {skipped_few_h2}')
    print(f'Skipped (no article): {skipped_no_article}')

if __name__ == '__main__':
    main()
