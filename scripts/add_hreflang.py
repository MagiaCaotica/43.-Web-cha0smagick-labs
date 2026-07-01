"""
Batch 4 - Item 3: hreflang annotations.
Adds Spanish (es) hreflang tags to all pages already having en + x-default,
and adds full hreflang sets (en, es, x-default) to pages missing them.
"""
import re, os

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
DOMAIN = 'https://cha0smagicklabs.com'

# Get all HTML files across site
def get_html_files():
    targets = []
    for root_dir, dirs, files in os.walk(ROOT):
        # Skip hidden dirs and node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'env')]
        for f in files:
            if f.endswith('.html'):
                full = os.path.join(root_dir, f)
                rel = os.path.relpath(full, ROOT)
                targets.append((full, rel))
    return targets

def url_from_relpath(relpath):
    """Convert relative path to full URL."""
    url_path = relpath.replace('\\', '/')
    return f'{DOMAIN}/{url_path}'

def es_url_from_relpath(relpath):
    """Convert relative path to Spanish URL."""
    url_path = relpath.replace('\\', '/')
    return f'{DOMAIN}/es/{url_path}'

def main():
    files = get_html_files()
    print(f'Total HTML files: {len(files)}')
    
    added_es_to_existing = 0
    added_full_hreflang = 0
    skipped = 0
    
    for fullpath, relpath in files:
        with open(fullpath, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        url = url_from_relpath(relpath)
        es_url = es_url_from_relpath(relpath)
        
        # Case 1: Already has x-default hreflang -> add es after it
        xdefault_pattern = re.compile(
            r'(\s*<link\s+rel="alternate"\s+(?:href="[^"]*"\s+)?hreflang="x-default"\s+(?:href="[^"]*")?\s*/?>)',
            re.IGNORECASE
        )
        xdefault_match = xdefault_pattern.search(content)
        
        if xdefault_match:
            # Check if es already exists
            if f'hreflang="es"' in content:
                skipped += 1
                continue
            
            # Match the closing format of existing hreflang tags
            xdefault_tag = xdefault_match.group(1)
            # Capture leading whitespace for consistent indentation
            leading_ws = re.match(r'^(\s*)', xdefault_tag).group(1) if xdefault_tag else ''
            es_close = ' />' if xdefault_tag.rstrip().endswith('/>') else '>'
            # Detect attribute order: if hreflang comes before href, match that order
            if 'hreflang="x-default" href=' in xdefault_tag:
                es_tag = f'{leading_ws}<link rel="alternate" hreflang="es" href="{es_url}"{es_close}'
            else:
                es_tag = f'{leading_ws}<link rel="alternate" href="{es_url}" hreflang="es"{es_close}'
            new_content = content.replace(
                xdefault_tag,
                xdefault_tag + '\n' + es_tag
            )
            with open(fullpath, 'w', encoding='utf-8') as fh:
                fh.write(new_content)
            added_es_to_existing += 1
            print(f'  +es: {relpath}')
            continue
        
        # Case 2: No hreflang at all -> add en, es, x-default after canonical or </title>
        if 'hreflang' not in content:
            # Try to insert after canonical link
            canonical_match = re.search(
                r'(\s*)(<link rel="canonical" href="[^"]*"\s*/?>)', content, re.IGNORECASE
            )
            if canonical_match:
                insert_pos = canonical_match.end()
                indent = canonical_match.group(1) or '    '
                close = ' />' if canonical_match.group(2).rstrip().endswith('/>') else '>'
            else:
                # Insert after </title>
                title_match = re.search(r'(</title>)', content, re.IGNORECASE)
                if title_match:
                    insert_pos = title_match.end()
                    indent = '    '
                    close = '>'
                else:
                    skipped += 1
                    print(f'  SKIP (no anchor): {relpath}')
                    continue
            
            en_tag = f'{indent}<link rel="alternate" href="{url}" hreflang="en"{close}'
            es_tag = f'{indent}<link rel="alternate" href="{es_url}" hreflang="es"{close}'
            xd_tag = f'{indent}<link rel="alternate" href="{url}" hreflang="x-default"{close}'
            insert_block = f'\n{en_tag}\n{es_tag}\n{xd_tag}'
            
            new_content = content[:insert_pos] + insert_block + content[insert_pos:]
            with open(fullpath, 'w', encoding='utf-8') as fh:
                fh.write(new_content)
            added_full_hreflang += 1
            print(f'  +all: {relpath}')
            continue
    
    print(f'\n=== Results ===')
    print(f'Added es to existing: {added_es_to_existing}')
    print(f'Added full hreflang set: {added_full_hreflang}')
    print(f'Skipped (already has es): {skipped}')
    print(f'Total processed: {added_es_to_existing + added_full_hreflang + skipped}')

if __name__ == '__main__':
    main()
