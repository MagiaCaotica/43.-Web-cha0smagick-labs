import sys
f = sys.argv[1]
h = open(f, 'r', encoding='utf-8').read()
# Debug globe
idx = h.find('toggleLangSidebar')
if idx >= 0:
    snippet = h[idx:idx+60]
    print(repr(snippet))
    for c in snippet:
        if ord(c) > 127:
            print(f"  U+{ord(c):04X} = {c}")
checks = [
    ("header-link", 'class="header-link"' in h),
    ("Banner.webp", 'Banner.webp' in h),
    ("CHA0SMAGICK LABS", 'CHA0SMAGICK LABS' in h),
    ("breadcrumb-nav", 'breadcrumb-nav' in h),
    ("glossary link", 'glossary.html' in h),
    ("best-occult link", 'best-occult-apps-android' in h),
    ("bundle link", 'complete-chaos-magick-bundle' in h),
    ("footer-grid", 'footer-grid' in h),
    ("em dash", '\u2014' in h),
    ("globe emoji", '\U0001f310' in h),
]
for name, ok in checks:
    status = "OK" if ok else "FAIL"
    print(f"  [{status}] {name}")
print(f"Size: {len(h)} bytes")
