import re, os, sys

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
action = sys.argv[1] if len(sys.argv) > 1 else 'audit'

if action == 'audit':
    # Classify all blog articles by reference status
    files = sorted(os.listdir(os.path.join(root, 'blog')))
    total = 0
    has_refs = 0
    no_refs = []
    
    for f in files:
        if not f.endswith('.html'):
            continue
        total += 1
        path = os.path.join(root, 'blog', f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        # Look for reference-like headings
        if re.search(r'<h[23][^>]*>.*?(?:references|bibliography|further\s+reading|works\s+cited|sources)', content, re.IGNORECASE | re.DOTALL):
            has_refs += 1
        else:
            no_refs.append(f)
    
    print(f'Total articles: {total}')
    print(f'With reference section: {has_refs}')
    print(f'Without reference section: {len(no_refs)}')
    print()
    for f in no_refs:
        print(f'  MISSING: {f}')

elif action == 'show':
    # Show existing reference sections from files that have them
    files = [
        'blog/chaos-magick-beginners-complete-guide.html',
        'blog/complete-magickal-servitors-guide.html',
        'blog/sigil-vs-servitor-differences.html',
        'blog/how-to-banish-cleanse-space.html',
        'blog/what-is-gnosis-how-to-achieve.html',
        'blog/sigil-engine-cryptographic-guide.html',
        'blog/cryptographic-sigil-programming-code.html',
    ]
    for f in files:
        path = os.path.join(root, f)
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        # Find references section
        m = re.search(r'(<h[23][^>]*>.*?(?:references|bibliography|further\s+reading|works\s+cited|sources).*?</h[23]>.*?)(?=<h[23]|<section[^>]*(?:id=|class=)[^>]*(?:references|bibliography|further)|</article|</main|</body)', content, re.IGNORECASE | re.DOTALL)
        if m:
            print(f'=== {f} ===')
            refs = m.group(1).strip()
            # Truncate if too long
            if len(refs) > 3000:
                refs = refs[:3000] + '\n... [truncated]'
            print(refs)
            print()
