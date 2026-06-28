"""
Generate sitemap.xml for Cha0smagick Labs
"""
import os, glob, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://cha0smagicklabs.com"
TODAY = "2026-06-26"

# Priority map
PRIORITIES = {
    "index.html": ("weekly", "1.0"),
    "best-occult-apps-android.html": ("weekly", "0.9"),
    "glossary.html": ("weekly", "0.9"),
    "complete-chaos-magick-bundle.html": ("monthly", "0.8"),
    "privacy-policy.html": ("monthly", "0.5"),
}
BLOG_PRIORITY = ("monthly", "0.7")
APP_PRIORITY = ("monthly", "0.9")
PDF_PRIORITY = ("monthly", "0.8")
TOOL_PRIORITY = ("weekly", "0.8")
BLOG_INDEX_PRIORITY = ("weekly", "0.8")

entries = []

# All HTML files
all_files = []
for pattern in ["*.html", "apps/*.html", "blog/*.html", "tools/*.html", "pages/*.html"]:
    all_files.extend(glob.glob(os.path.join(ROOT, pattern), recursive=True))

# Sort by type
for fp in sorted(all_files):
    rel = os.path.relpath(fp, ROOT).replace("\\", "/")
    fname = os.path.basename(fp)
    
    # Skip unwanted pages
    if rel in ("404.html", "pages/app-details.html"):
        continue
    
    # Determine priority and changefreq
    if rel == "index.html":
        cf, pr = "weekly", "1.0"
    elif rel.startswith("apps/"):
        cf, pr = ("monthly", "0.9") if "pdf" not in fname else ("monthly", "0.8")
    elif rel.startswith("blog/"):
        if fname == "index.html":
            cf, pr = BLOG_INDEX_PRIORITY
        else:
            cf, pr = BLOG_PRIORITY
    elif rel.startswith("tools/"):
        cf, pr = TOOL_PRIORITY
    elif rel in PRIORITIES:
        cf, pr = PRIORITIES[rel]
    else:
        cf, pr = "monthly", "0.7"
    
    loc = f"{BASE}/{rel}"
    entries.append((loc, cf, pr))

# Build XML
xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

for loc, cf, pr in entries:
    xml += "    <url>\n"
    xml += f"        <loc>{loc}</loc>\n"
    xml += f"        <lastmod>{TODAY}</lastmod>\n"
    xml += f"        <changefreq>{cf}</changefreq>\n"
    xml += f"        <priority>{pr}</priority>\n"
    xml += "    </url>\n"

xml += "</urlset>\n"

with open(os.path.join(ROOT, "sitemap.xml"), "w", encoding="utf-8") as f:
    f.write(xml)

print(f"Generated sitemap.xml with {len(entries)} URLs")
