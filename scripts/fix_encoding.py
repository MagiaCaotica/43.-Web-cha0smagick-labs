#!/usr/bin/env python3
"""Fix known encoding corruption patterns across HTML files.

Only targets CONFIRMED broken characters, never guesses.
"""

import os
import re
import glob

BASE = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"

def count_issues(filepath):
    """Count encoding issues in a file."""
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    ufffd = 0
    qmark = 0
    dbl_qmark = 0
    
    i = 0
    while i < len(raw):
        if i + 2 < len(raw) and raw[i] == 0xEF and raw[i+1] == 0xBF and raw[i+2] == 0xBD:
            ufffd += 1
            i += 3
        elif raw[i] == 0x3F:
            if i + 1 < len(raw) and raw[i+1] == 0x3F:
                dbl_qmark += 1
                i += 2
            else:
                qmark += 1
                i += 1
        else:
            i += 1
    return ufffd, qmark, dbl_qmark


def fix_ufffd(filepath):
    """Fix only known U+FFFD corruption patterns."""
    with open(filepath, 'rb') as f:
        raw = f.read()
    
    orig_len = len(raw)
    
    # Check if there's anything to fix
    has_fffd = False
    for i in range(len(raw) - 2):
        if raw[i] == 0xEF and raw[i+1] == 0xBF and raw[i+2] == 0xBD:
            has_fffd = True
            break
    
    if not has_fffd:
        return raw  # No U+FFFD, skip
    
    text = raw.decode('utf-8')
    original = text
    
    # ---- KNOWN PATTERNS ----
    
    # Language names (Spanish, French, Portuguese)
    text = text.replace('Pr\uFFFDctica', 'Práctica')
    text = text.replace('PR\uFFFDTICA', 'PRÁCTICA')
    text = text.replace('Espa\uFFFDol', 'Español')
    text = text.replace('Fran\uFFFDais', 'Français')
    text = text.replace('Portugu\uFFFDs', 'Português')
    
    # Pipe separators in titles (Labs | Sigil Maker)
    text = re.sub(r'(?<=Labs )\uFFFD(?= Sigil)', '|', text)
    text = re.sub(r'(?<=Apps )\uFFFD(?= Sigil)', '|', text)
    text = re.sub(r'(?<=Collection")\uFFFD', '|', text)
    text = re.sub(r'Online \uFFFD Create Your', 'Online | Create Your', text)
    
    # Em dashes in descriptions
    text = re.sub(r'(?<=Solutions )\uFFFD(?= Techno)', '—', text)
    text = re.sub(r'(?<=Techno-Sorcery )\uFFFD(?= Cybermancy)', '—', text)
    text = re.sub(r'(?<=Cybermancy )\uFFFD(?= Cyberpaganism)', '—', text)
    text = re.sub(r'(?<=digital ritualism )\uFFFD(?= led by)', '—', text)
    text = re.sub(r'(?<=user-centric interfaces )\uFFFD(?= all)', '—', text)
    text = re.sub(r'(?<=PDF )\uFFFD(?= a \d+-page)', '—', text)
    
    # Star rating
    text = text.replace('4.7\uFFFD', '4.7★')
    text = text.replace('4.8\uFFFD', '4.8★')
    text = text.replace('4.5\uFFFD', '4.5★')
    
    # CSS content pseudo-elements
    text = re.sub(r'li::before\{content:\s*"\uFFFD"\s*;', 'li::before{content: "→";', text)
    text = re.sub(r'a\[href="/"\]::before\{content:\s*"\uFFFD\s*"\s*;', 'a[href="/"]::before{content: "| ";', text)
    
    # Link arrows at end
    text = re.sub(r'\uFFFD</a>', '→</a>', text)
    
    # Generic spaced em dash (space-FFFD-space)
    text = re.sub(r' \uFFFD ', ' — ', text)
    
    # Any remaining U+FFFD -> replace with middle dot as fallback
    remaining = sum(1 for c in text if c == '\uFFFD')
    if remaining > 0:
        text = text.replace('\uFFFD', '·')
    
    changed = sum(1 for c in original if c == '\uFFFD') - sum(1 for c in text if c == '\uFFFD')
    if changed > 0:
        print(f"    Fixed {changed} U+FFFD")
    
    return text.encode('utf-8')


def main():
    files = []
    for root, dirs, filenames in os.walk(BASE):
        if 'node_modules' in root:
            continue
        for fn in filenames:
            if fn.endswith('.html'):
                files.append(os.path.join(root, fn))
    
    print(f"Scanning {len(files)} HTML files...")
    
    total_ufffd = 0
    total_qmark = 0
    total_dbl = 0
    fixable_ufffd_files = []
    
    for fp in sorted(files):
        u, q, d = count_issues(fp)
        if u > 0:
            fixable_ufffd_files.append(fp)
            total_ufffd += u
        total_qmark += q
        total_dbl += d
    
    print(f"\nFiles with U+FFFD: {len(fixable_ufffd_files)} ({total_ufffd} total)")
    print(f"Files with ?? : various ({total_dbl} total)")
    print(f"Total single ? : {total_qmark} (most are legitimate)")
    
    if fixable_ufffd_files:
        print("\nFiles needing U+FFFD fix:")
        for fp in fixable_ufffd_files:
            u, _, _ = count_issues(fp)
            rel = os.path.relpath(fp, BASE)
            print(f"  {rel}: {u} U+FFFD")
        
        print("\n=== Fixing U+FFFD ===")
        for fp in fixable_ufffd_files:
            rel = os.path.relpath(fp, BASE)
            print(f"  {rel}")
            new_raw = fix_ufffd(fp)
            with open(fp, 'wb') as f:
                f.write(new_raw)
        
        # Verify
        print("\n=== Verification ===")
        still_broken = 0
        for fp in fixable_ufffd_files:
            u, _, _ = count_issues(fp)
            if u > 0:
                rel = os.path.relpath(fp, BASE)
                print(f"  STILL BROKEN: {rel}: {u} U+FFFD")
                still_broken += u
        if still_broken == 0:
            print("  ALL U+FFFD FIXED!")
        else:
            print(f"  {still_broken} U+FFFD remaining")
    else:
        print("\nNo files with U+FFFD to fix.")

if __name__ == '__main__':
    main()
