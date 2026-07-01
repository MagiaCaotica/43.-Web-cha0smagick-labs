"""
Batch 3 - Item 3: Add speakable schema to all blog Article JSON-LD blocks.
Targets .blog-post p, h2, h3, li for text-to-speech.
"""
import re, os, json

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
BLOG = os.path.join(ROOT, 'blog')

SPEAKABLE_CSS = [".blog-post p", ".blog-post h2", ".blog-post h3", ".blog-post li"]

def find_article_in_data(data):
    """Find the Article schema object, handling @graph wrappers."""
    if data.get('@type') == 'Article':
        return data
    if '@graph' in data and isinstance(data['@graph'], list):
        for item in data['@graph']:
            if item.get('@type') == 'Article':
                # Inject speakable into the @graph item; return the top-level data
                return item
    return None

def add_speakable_single_block(data):
    """Add speakable to a single parsed JSON-LD block. Returns modified data or None."""
    target = find_article_in_data(data)
    if target is None:
        return None
    if 'speakable' in target:
        return data  # already has it, return as-is
    target['speakable'] = {
        "@type": "SpeakableSpecification",
        "cssSelector": SPEAKABLE_CSS
    }
    return data

def add_speakable_to_article(content):
    """Find Article schema blocks and add speakable property."""
    # Pattern to find JSON-LD script blocks
    pattern = r'(<script type="application/ld\+json">)(.*?)(</script>)'
    
    def inject_speakable(match):
        prefix = match.group(1)
        json_str = match.group(2)
        suffix = match.group(3)
        
        try:
            data = json.loads(json_str)
        except json.JSONDecodeError:
            return match.group(0)  # skip invalid JSON
        
        result = add_speakable_single_block(data)
        if result is None:
            return match.group(0)  # no Article found
        
        return prefix + json.dumps(result, ensure_ascii=False) + suffix
    
    return re.sub(pattern, inject_speakable, content, flags=re.DOTALL)

def main():
    files = sorted(os.listdir(BLOG))
    processed = 0
    skipped_has_speakable = 0
    skipped_no_article = 0
    
    for f in files:
        if not f.endswith('.html'):
            continue
        path = os.path.join(BLOG, f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        # Check if has Article schema in JSON-LD (flat or @graph)
        has_article = False
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL):
            try:
                data = json.loads(m.group(1))
                if find_article_in_data(data) is not None:
                    has_article = True
                    break
            except:
                pass
        
        if not has_article:
            skipped_no_article += 1
            continue
        
        # Check if already has speakable
        if 'speakable' in content:
            skipped_has_speakable += 1
            continue
        
        new_content = add_speakable_to_article(content)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(new_content)
            print(f'OK: {f}')
            processed += 1
        else:
            # No change means either no JSON-LD blocks or all non-Article/speakable already present
            pass
    
    print(f'\nProcessed (speakable added): {processed}')
    print(f'Skipped (already had speakable): {skipped_has_speakable}')
    print(f'Skipped (no Article schema): {skipped_no_article}')

if __name__ == '__main__':
    main()
