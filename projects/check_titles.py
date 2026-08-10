#!/usr/bin/env python3
"""Check title attribute corruption."""
import os, re

root = r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs"
fp = os.path.join(root, 'complete-chaos-magick-bundle.html')

with open(fp, 'r', encoding='utf-8') as f:
    text = f.read()

# Find all title attributes in the sidebar area
section = text[text.find('lang-sidebar'):text.find('</body>')]

for m in re.finditer(r'title="([^"]*)"', section):
    t = m.group(1)
    if any(ord(c) > 127 for c in t):
        print("Corrupted title:", repr(t))
        print("  Hex:", ' '.join(hex(ord(c)) for c in t))
        # Try the roundtrip fix
        try:
            fixed = t.encode('latin-1').decode('utf-8')
            print("  Fixed:", repr(fixed))
        except Exception as e:
            print("  Roundtrip error:", e)
