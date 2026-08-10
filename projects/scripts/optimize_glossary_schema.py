"""
Glossary schema optimization:
1. Extract 63 term names from QAPage JSON-LD
2. Extract anchor IDs from HTML <details id="...">
3. Enhance CollectionPage with mainEntity ItemList
4. Add DefinedTermSet schema as the primary glossary schema
"""
import json, re, os

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
path = os.path.join(ROOT, 'glossary.html')

with open(path, 'r', encoding='utf-8') as fh:
    content = fh.read()

# --- Step 1: Extract terms from QAPage ---
qa_entries = []  # list of (question_name, anchor_id)
for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', content, re.DOTALL):
    try:
        data = json.loads(m.group(1))
        if data.get('@type') == 'QAPage':
            for entity in data.get('mainEntity', []):
                name = entity.get('name', '')
                if name:
                    qa_entries.append(name)
    except:
        pass

print(f'Found {len(qa_entries)} QAPage entries')

# --- Step 2: Build title->anchor map from HTML ---
# Each glossary term is: <details class="glossary-term" id="ANCHOR">
#   <summary><h3>TITLE <a href="#ANCHOR" ...>#</a></h3></summary>
# Extract TITLE and ANCHOR pairs

html_title_to_anchor = {}
html_original_titles = {}
for m in re.finditer(
    r'<details[^>]*id="([^"]+)"[^>]*>\s*<summary>\s*<h3>(.*?)<a\s+href=',
    content, re.DOTALL
):
    anchor = m.group(1)
    title_html = m.group(2)
    # Extract plain text (remove any HTML entities)
    title = title_html.strip()
    # Handle HTML entities
    title = title.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>').replace('&#39;', "'").replace('&quot;', '"')
    html_title_to_anchor[title.lower()] = anchor
    html_original_titles[title.lower()] = title

print(f'Extracted {len(html_title_to_anchor)} title->anchor mappings from HTML')

# --- Step 3: Map QAPage questions to HTML anchors ---
# Strategy: for each QAPage question, extract the core term name and look it up in the HTML map
import difflib

def normalize_term(text):
    """Normalize a term name for matching."""
    t = text.lower().strip()
    # Remove articles
    for art in ['an ', 'a ', 'the ']:
        if t.startswith(art):
            t = t[len(art):]
    return t.strip()

def extract_core_term(question):
    """Extract the core term from a QAPage question like 'What is Gnosis in Chaos Magick?' -> 'Gnosis'"""
    name = question
    # Remove question prefix
    for prefix in ['What is ', 'What are ', 'What does ', 'How to ', 'How does ']:
        if name.startswith(prefix):
            name = name[len(prefix):]
            break
    # Remove trailing ?
    name = name.rstrip('?').strip()
    
    # Remove context suffixes like " in Chaos Magick", " in Enochian Magic"
    name = re.sub(r'\s+in\s+.*', '', name)
    
    # Remove articles
    for art in ['an ', 'a ', 'the ']:
        if name.lower().startswith(art):
            name = name[len(art):]
            break
    
    return name.strip()

term_list = []
html_title_lower = {k: v for k, v in html_title_to_anchor.items()}

for q in qa_entries:
    core = extract_core_term(q)
    core_lower = core.lower().strip()
    
    # Strategy 1: Direct match in HTML titles
    if core_lower in html_title_lower:
        term_list.append((q, html_title_lower[core_lower]))
        continue
    
    # Strategy 2: Fuzzy match - find closest HTML title
    html_titles = list(html_title_lower.keys())
    matches = difflib.get_close_matches(core_lower, html_titles, n=1, cutoff=0.6)
    if matches:
        term_list.append((q, html_title_lower[matches[0]]))
        continue
    
    # Strategy 3: Manual overrides
    if q in MANUAL_OVERRIDES:
        term_list.append((q, MANUAL_OVERRIDES[q]))
        continue
    
    print(f'WARNING: No match for "{q[:60]}" -> core="{core}"')

# Build URL for each term
BASE = 'https://cha0smagicklabs.com/glossary.html'
item_list = []
for q, anchor in term_list:
    # Get clean term display name
    name = extract_core_term(q)
    
    # Use the HTML <h3> title if it's more descriptive (with proper case)
    for lower_title, h3_anchor in html_title_to_anchor.items():
        if h3_anchor == anchor:
            name = html_original_titles.get(lower_title, lower_title)
            break
    
    item_list.append({
        "@type": "DefinedTerm",
        "name": name,
        "url": f"{BASE}#{anchor}"
    })

print(f'Mapped {len(term_list)}/{len(qa_entries)} terms to anchors')
print(f'ItemList has {len(item_list)} entries')

# --- Step 4: Build the enhanced CollectionPage ---
# Find existing CollectionPage and replace it
collection_page = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": "https://cha0smagicklabs.com/glossary.html#collection",
    "name": "Chaos Magick Glossary & Encyclopedia",
    "description": "Comprehensive glossary of Chaos Magick terms and occult terminology — over 60 terms defined with practical context for the modern practitioner.",
    "about": { "@type": "Thing", "name": "Chaos Magick" },
    "mainEntity": {
        "@type": "ItemList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": i + 1,
                "item": entry
            }
            for i, entry in enumerate(item_list)
        ]
    }
}

# Add DefinedTermSet as well (semantically richer for glossaries)
defined_term_set = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": "https://cha0smagicklabs.com/glossary.html#termset",
    "name": "Chaos Magick Glossary & Encyclopedia",
    "description": "Comprehensive glossary of Chaos Magick terms and occult terminology — over 60 terms defined with practical context for the modern practitioner.",
    "about": { "@type": "Thing", "name": "Chaos Magick" },
    "hasDefinedTerm": [
        entry for entry in item_list
    ]
}

# --- Step 5: Rebuild glossary schema section ---
# Strategy: remove any existing CollectionPage and DefinedTermSet blocks,
# then inject the new correct ones after BreadcrumbList

# Find the BreadcrumbList end position (we inject after it)
breadcrumb_end = content.find('</script>', content.find('BreadcrumbList'))
if breadcrumb_end == -1:
    print('ERROR: Could not find BreadcrumbList')
    exit(1)

# Find and remove existing CollectionPage/DefinedTermSet blocks
# Search for the @type pattern in script blocks
blocks_to_remove = []
search_pos = 0
while True:
    # Find next script block
    start = content.find('<script type="application/ld+json">', search_pos)
    if start == -1:
        break
    end = content.find('</script>', start)
    if end == -1:
        break
    end += len('</script>')
    
    block = content[start:end]
    # Check if it contains CollectionPage or DefinedTermSet
    if '"CollectionPage"' in block or '"DefinedTermSet"' in block:
        blocks_to_remove.append(block)
    
    search_pos = end

# Remove them (in reverse order to preserve positions)
for block in reversed(blocks_to_remove):
    content = content.replace(block, '', 1)

# Now inject new CollectionPage + DefinedTermSet after BreadcrumbList
# Find the BreadcrumbList end again (it moved if we removed blocks after it)
breadcrumb_end = content.find('</script>', content.find('BreadcrumbList'))
if breadcrumb_end == -1:
    print('ERROR: Could not find BreadcrumbList after cleanup')
    exit(1)

new_collection_str = json.dumps(collection_page, ensure_ascii=False, indent=4)
new_termset_str = json.dumps(defined_term_set, ensure_ascii=False, indent=4)

injection_block = (
    '\n\n    <script type="application/ld+json">\n'
    + new_collection_str + '\n'
    + '    </script>\n\n'
    + '    <script type="application/ld+json">\n'
    + new_termset_str + '\n'
    + '    </script>'
)

new_content = content[:breadcrumb_end + len('</script>')] + injection_block + content[breadcrumb_end + len('</script>'):]

with open(path, 'w', encoding='utf-8') as fh:
    fh.write(new_content)
print(f'SUCCESS: Glossary schemas updated')
print(f'  Removed {len(blocks_to_remove)} old schema blocks')
print(f'  Injected new CollectionPage + DefinedTermSet')
