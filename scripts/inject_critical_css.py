"""
Batch 3 - Item 3: Critical CSS Inlining
Extracts above-fold styles from style.css and inlines them into <head> of every HTML page.
Replaces external <link> with deferred loading (preload + onload swap).

Uses a curated selector list to extract relevant rule blocks from style.css.
"""
import re, os

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
CSS_PATH = os.path.join(ROOT, 'css', 'style.min.css')

# ============================================================
# Step 1: Read full stylesheet
# ============================================================
with open(CSS_PATH, 'r', encoding='utf-8') as fh:
    full_css = fh.read()

# ============================================================
# Step 2: Extract critical rules using a robust CSS block parser
# ============================================================

def extract_css_blocks(source):
    """Extract top-level CSS rule blocks with their selectors.
    Returns list of (selector, body) tuples. Handles @media with nested rules."""
    blocks = []
    i = 0
    length = len(source)
    
    while i < length:
        # Skip whitespace and comments
        while i < length and (source[i] in ' \t\n\r' or source[i:i+2] == '/*'):
            if source[i:i+2] == '/*':
                end = source.find('*/', i + 2)
                i = end + 2 if end != -1 else length
            else:
                i += 1
        
        if i >= length:
            break
        
        # Check for @media (or other at-rules with nested blocks)
        if source[i] == '@':
            # Find opening brace
            brace_start = source.find('{', i)
            if brace_start == -1:
                break
            # For @media, the content inside is nested CSS rules
            # We need to handle the nested structure
            inner_start = brace_start + 1
            inner_end = find_matching_brace(source, brace_start)
            if inner_end == -1:
                break
            
            at_rule_selector = source[i:brace_start].strip()
            inner_content = source[inner_start:inner_end]
            
            # Extract nested rules from @media
            nested_blocks = extract_css_blocks(inner_content)
            # Re-wrap with @media
            for sel, body in nested_blocks:
                wrapped_selector = f'{at_rule_selector} {{ {sel} }}'
                blocks.append((wrapped_selector, body))
            
            i = inner_end + 1
            continue
        
        # Regular rule: find selector and body
        brace_start = source.find('{', i)
        if brace_start == -1:
            break
        
        selector = source[i:brace_start].strip()
        
        # Find matching closing brace (handle nested braces)
        body_end = find_matching_brace(source, brace_start)
        if body_end == -1:
            break
        
        body = source[brace_start + 1:body_end].strip()
        
        if selector and body:
            blocks.append((selector, body))
        
        i = body_end + 1
    
    return blocks

def find_matching_brace(text, start):
    """Find the matching closing brace for opening brace at position start."""
    if text[start] != '{':
        return -1
    depth = 1
    i = start + 1
    in_string = False
    string_char = None
    
    while i < len(text) and depth > 0:
        ch = text[i]
        
        # Track string boundaries to avoid false brace matching
        if in_string:
            if ch == string_char and (i == 0 or text[i-1] != '\\'):
                in_string = False
        else:
            if ch in '"\'':
                in_string = True
                string_char = ch
            elif ch == '{':
                depth += 1
            elif ch == '}':
                depth -= 1
            elif ch == '/' and text[i+1:i+2] == '*':
                # Skip comments
                end = text.find('*/', i + 2)
                i = end + 1 if end != -1 else i
                continue
        
        i += 1
    
    return i - 1 if depth == 0 else -1

# --------------------------------------------------------------------------
# Critical selectors (above-fold — first viewport content)
# We use specific patterns to avoid matching below-fold rules.
# --------------------------------------------------------------------------
CRITICAL_SELECTOR_PATTERNS = [
    # CSS vars + reset + base
    ':root', '*::before', '*::after', 'body', 
    # Universal/link/image base
    'a ', '.header-link', 'a:hover', 'img',
    # Header (always above fold)
    'header,', 'header .', 'header.', '.header-logo', '.site-title',
    # Navigation (always above fold)
    'nav,', 'nav ul', 'nav li', 'nav a',
    # Main layout containers
    'main {', 'main.', 'section {', 'section.',
    # Typography — only heading-specific patterns that avoid false matches
    'h1,', 'h2,', 'h3,', 'h4,', 'h5,', 'h6,', 'h1.', 'h2.', 'h3.',
    # Hero section (above fold on homepage)
    'section.hero', '.hero-', '.hero-cta',
    # Buttons & CTAs (above fold on app pages)
    '.cta-button', '.google-play-btn', '.play-store-btn',
    # Blog/article layout (main reading area, above fold when viewing article)
    '.blog-post', '.article', '.blog-post h2', '.blog-post h3', '.blog-post p',
    # Table of Contents (injected on long articles)
    '.table-of-contents',
    # Glossary (above fold on glossary page)
    '.glossary-hero', '.alpha-nav', '.glossary-intro',
    # App detail layout
    '.app-detail-',
    # Navigation utilities
    '.breadcrumb-list', '.breadcrumb-', '.back-link',
    # Footer (technically below fold but prevents flash on short pages)
    'footer', 'footer.',
    # Blog listing page hero
    '.blog-intro',
    # Language selector (visible in header area)
    '.language-selector',
    # Cookie consent (fixed position, always visible)
    '#cookie-consent-banner',
    # FAQ (below fold but on pages where it might be visible)
    '#faq-section',
    # Progress bar
    '.progress-bar',
]

def is_selector_critical(selector):
    """Check if a CSS selector matches critical patterns."""
    if selector.startswith('/*'):
        return False
    for pattern in CRITICAL_SELECTOR_PATTERNS:
        if pattern in selector:
            return True
    return False

# Extract blocks and filter
all_blocks = extract_css_blocks(full_css)
print(f'Total rule blocks found: {len(all_blocks)}')

critical_blocks = []
for selector, body in all_blocks:
    if is_selector_critical(selector):
        critical_blocks.append((selector, body))

# Build critical CSS string (semi-minified)
critical_parts = []
for selector, body in critical_blocks:
    critical_parts.append(f'{selector}{{{body}}}')

critical_css = '\n'.join(critical_parts)

print(f'Critical blocks: {len(critical_blocks)}')
print(f'Full CSS: {len(full_css)} bytes ({len(full_css)/1024:.1f} KB)')
print(f'Critical CSS: {len(critical_css)} bytes ({len(critical_css)/1024:.1f} KB, {len(critical_css)/len(full_css)*100:.1f}%)')

# ============================================================
# Step 3: Inject into every HTML page
# ============================================================
# Handle both root-level (css/style.css) and subdirectory (../css/style.css) paths
CSS_LINK_PATTERN = re.compile(
    r'<link rel="stylesheet" href="(\.\./)?css/style\.css">'
)
DEFERRED_LINK_TPL = '<link rel="preload" href="{prefix}css/style.css" as="style" onload="this.rel=\'stylesheet\'">\n    <noscript><link rel="stylesheet" href="{prefix}css/style.css"></noscript>'

INJECT_PATHS = [
    ROOT,
    os.path.join(ROOT, 'blog'),
    os.path.join(ROOT, 'apps'),
]

total_pages = 0
injected_pages = 0
already_done = 0
no_link = 0

for base_path in INJECT_PATHS:
    if not os.path.isdir(base_path):
        continue
    for f in sorted(os.listdir(base_path)):
        if not f.endswith('.html'):
            continue
        filepath = os.path.join(base_path, f)
        total_pages += 1
        
        with open(filepath, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        # Skip if already done
        if '/* CRITICAL CSS INLINED */' in content:
            already_done += 1
            continue
        
        # Find the CSS link (handle both css/style.css and ../css/style.css)
        match = CSS_LINK_PATTERN.search(content)
        if not match:
            no_link += 1
            continue
        
        original_link = match.group(0)
        prefix = match.group(1) or ''
        
        # Build inline style
        inline_style = f'    <style>\n        /* CRITICAL CSS INLINED */\n{critical_css}\n    </style>'
        deferred_link = DEFERRED_LINK_TPL.format(prefix=prefix)
        
        # Replace external link with inline + deferred
        new_content = content.replace(original_link, inline_style + '\n\n    ' + deferred_link, 1)
        
        with open(filepath, 'w', encoding='utf-8') as fh:
            fh.write(new_content)
        
        print(f'OK: {f}')
        injected_pages += 1

print(f'\n=== Results ===')
print(f'Total HTML pages: {total_pages}')
print(f'Injected critical CSS: {injected_pages}')
print(f'Already done: {already_done}')
print(f'No style.css link found: {no_link}')
