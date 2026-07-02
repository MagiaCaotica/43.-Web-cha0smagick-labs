"""
Remove redundant inline <style> blocks (critical CSS) from HTML files.
These files already load css/style.min.css externally.
The inline blocks contain the entire site CSS with corrupted nav icon symbols.
"""

import re
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Files known to have the CRITICAL CSS INLINED comment + redundant inline CSS
TARGET_FILES = [
    'index.html',
    '404.html',
    'best-occult-apps-android.html',
    'glossary.html',
    'privacy-policy.html',
]

def read_file(path):
    """Read file with latin-1 fallback."""
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        with open(path, 'r', encoding='latin-1') as f:
            return f.read()

def write_file(path, content):
    """Write as UTF-8 without BOM."""
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"  Written: {os.path.relpath(path, BASE_DIR)}")

def remove_inline_style_block(content):
    """Remove the <style> block that contains 'CRITICAL CSS INLINED'."""
    # Pattern: the opening <style> tag, possibly with whitespace/newlines,
    # followed by content including "CRITICAL CSS INLINED", up to </style>
    pattern = r'<style>\s*\n\s*/\* CRITICAL CSS INLINED \*/.*?</style>'
    replaced, count = re.subn(pattern, '', content, count=1, flags=re.DOTALL)
    if count > 0:
        # Clean up extra blank lines left after removal
        replaced = re.sub(r'\n{3,}', '\n\n', replaced)
        return replaced
    return None

def main():
    print("=== Removing redundant inline CSS blocks ===")
    for fname in TARGET_FILES:
        fpath = os.path.join(BASE_DIR, fname)
        if not os.path.exists(fpath):
            print(f"  SKIP (not found): {fname}")
            continue
        content = read_file(fpath)
        new_content = remove_inline_style_block(content)
        if new_content is not None:
            size_before = len(content)
            size_after = len(new_content)
            saved = size_before - size_after
            write_file(fpath, new_content)
            print(f"  Removed {saved} chars ({size_before} -> {size_after})")
        else:
            print(f"  No inline CSS block found in: {fname}")

if __name__ == '__main__':
    main()
