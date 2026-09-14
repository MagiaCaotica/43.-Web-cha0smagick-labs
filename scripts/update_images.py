#!/usr/bin/env python3
"""
Update HTML files to use WebP images with <picture> elements and add lazy loading.
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def update_image_references(content: str) -> str:
    """Update img tags to use WebP with picture elements and lazy loading."""
    
    # Pattern to find img tags with PNG/JPG sources
    # We'll look for <img src=".../image.png" ...> and convert to <picture><source type="image/webp" srcset=".../image.webp"><img src=".../image.png" loading="lazy" ...></picture>
    
    def replace_img(match):
        full_tag = match.group(0)
        src_match = re.search(r'src=["\']([^"\']+)["\']', full_tag)
        if not src_match:
            return full_tag
        
        src = src_match.group(1)
        # Check if it's a PNG or JPG
        if not (src.endswith('.png') or src.endswith('.jpg') or src.endswith('.jpeg') or src.endswith('.PNG')):
            return full_tag
        
        # Check if already in a picture element
        before_tag = content[:match.start()]
        if '<picture>' in before_tag[-200:]:
            # Already in picture element, just add loading="lazy" if not present
            if 'loading=' not in full_tag:
                full_tag = full_tag.replace('<img ', '<img loading="lazy" ')
            return full_tag
        
        # Build webp src
        webp_src = src.rsplit('.', 1)[0] + '.webp'
        
        # Extract other attributes
        alt_match = re.search(r'alt=["\']([^"\']*)["\']', full_tag)
        alt = alt_match.group(1) if alt_match else ''
        
        width_match = re.search(r'width=["\']([^"\']*)["\']', full_tag)
        width = width_match.group(1) if width_match else ''
        
        height_match = re.search(r'height=["\']([^"\']*)["\']', full_tag)
        height = height_match.group(1) if height_match else ''
        
        class_match = re.search(r'class=["\']([^"\']*)["\']', full_tag)
        cls = class_match.group(1) if class_match else ''
        
        # Build picture element
        attrs = []
        if alt:
            attrs.append(f'alt="{alt}"')
        if width:
            attrs.append(f'width="{width}"')
        if height:
            attrs.append(f'height="{height}"')
        if cls:
            attrs.append(f'class="{cls}"')
        attrs.append('loading="lazy"')
        attr_str = ' '.join(attrs)
        
        picture = f'<picture><source srcset="{webp_src}" type="image/webp"><img src="{src}" {attr_str}></picture>'
        return picture
    
    # Replace img tags
    content = re.sub(r'<img\s+[^>]*src=["\'][^"\']*\.(?:png|jpg|jpeg|PNG)["\'][^>]*>', replace_img, content)
    
    return content

def process_file(filepath: Path):
    """Process a single HTML file."""
    try:
        content = filepath.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        try:
            content = filepath.read_text(encoding="latin-1")
        except:
            print(f"Skipping {filepath} - encoding issue")
            return False
    new_content = update_image_references(content)
    
    if new_content != content:
        filepath.write_text(new_content, encoding="utf-8")
        return True
    return False

def main():
    print("Updating HTML files to use WebP with picture elements...")
    
    html_files = list(ROOT.rglob('*.html'))
    updated = 0
    
    for filepath in html_files:
        if process_file(filepath):
            updated += 1
            if updated % 50 == 0:
                print(f"  Updated {updated} files...")
    
    print(f"\nDone. Updated {updated} HTML files.")

if __name__ == "__main__":
    main()