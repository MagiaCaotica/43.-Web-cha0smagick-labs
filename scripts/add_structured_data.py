#!/usr/bin/env python3
"""
Add Product schema to book pages and BreadcrumbList to blog articles.
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://cha0smagicklabs.com"
PUBLISHER = "Cha0smagick Labs"

# Book data for Product schema
BOOKS = {
    "manual-activacion-servidores-magicos-pdf.html": {
        "name": "Magical Servitors Manual",
        "description": "Learn how to create and activate magical servitors with Chaos Magick. Practical guide by Frater Alekos.",
        "image": f"{SITE}/assets/images/servidores.png",
        "price": "3.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "tratado-runas-cazadoras-caos-pdf.html": {
        "name": "Tratado de Runas Cazadoras del Caos",
        "description": "Chaos magick rune grimoire with hunter runes system for protection and prosperity workings.",
        "image": f"{SITE}/assets/images/runas-cazadoras.png",
        "price": "9.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "ouija-cazadora-pdf.html": {
        "name": "Ouija Cazadora",
        "description": "Paranormal investigation guide for spirit communication using the Ouija board method.",
        "image": f"{SITE}/assets/images/ouija.png",
        "price": "7.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "liber-lvpinux-pdf.html": {
        "name": "Liber LVPIVNX",
        "description": "Advanced chaos magick grimoire for sigil magic and servitor creation.",
        "image": f"{SITE}/assets/images/liber-lvpinux.png",
        "price": "14.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "codex-chaoticus-pdf.html": {
        "name": "Codex Chaoticus",
        "description": "Complete chaos magick reference with sigils, rituals, and paradigm shifting techniques.",
        "image": f"{SITE}/assets/images/codex-chaoticus.png",
        "price": "19.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "tarot-chaos-pdf.html": {
        "name": "Tarot Chaos",
        "description": "Chaos magick approach to tarot with archetypal sigils and non-linear spreads.",
        "image": f"{SITE}/assets/images/tarot-chaos.png",
        "price": "12.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
    "mind-the-gap-pdf.html": {
        "name": "Mind the Gap",
        "description": "Bridging paranormal research and technomancy - field investigation methods and digital tools.",
        "image": f"{SITE}/assets/images/mind-the-gap.png",
        "price": "9.99",
        "url": "https://pay.hotmart.com/D104270399P?checkoutMode=2",
    },
}

def add_product_schema_to_book(filepath: Path, book_data: dict):
    """Add Product schema to a book page."""
    content = filepath.read_text(encoding="utf-8")
    
    # Check if Product schema already exists
    if '"@type": "Product"' in content:
        print(f"Already has Product schema: {filepath.name}")
        return False
    
    # Build Product schema
    product_schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        "@id": f"{SITE}/books/{filepath.name}#product",
        "name": book_data["name"],
        "description": book_data["description"],
        "image": book_data["image"],
        "brand": {"@type": "Brand", "name": PUBLISHER},
        "offers": {
            "@type": "Offer",
            "url": book_data["url"],
            "price": book_data["price"],
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
        }
    }
    
    product_json = json.dumps(product_schema, separators=(',', ':'))
    
    # Find the last </script> tag before </head> and insert after it
    # Look for the last script type="application/ld+json" block
    pattern = r'(</script>\s*)</head>'
    replacement = f'\\1\n    <script type="application/ld+json">{product_json}</script>\n</head>'
    new_content = re.sub(pattern, replacement, content)
    
    if new_content != content:
        filepath.write_text(new_content, encoding="utf-8")
        print(f"Added Product schema to: {filepath.name}")
        return True
    else:
        print(f"Could not find insertion point: {filepath.name}")
        return False


def add_breadcrumb_to_blog(filepath: Path):
    """Add BreadcrumbList schema to a blog article."""
    content = filepath.read_text(encoding="utf-8")
    
    # Check if BreadcrumbList already exists
    if 'BreadcrumbList' in content:
        return False
    
    # Extract title from the page
    title_match = re.search(r'<title>([^<]+)</title>', content)
    title = title_match.group(1) if title_match else "Article"
    
    slug = filepath.stem
    url = f"{SITE}/blog/{slug}.html"
    
    breadcrumb_schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "@id": f"{url}#breadcrumb",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": SITE + "/blog/index.html"},
            {"@type": "ListItem", "position": 3, "name": title, "item": url}
        ]
    }
    
    breadcrumb_json = json.dumps(breadcrumb_schema, separators=(',', ':'))
    
    # Find </head> and insert before it
    head_end = content.find('</head>')
    if head_end == -1:
        return False
    
    # Try to find the last </script> before </head>
    script_end = content.rfind('</script>', 0, head_end)
    if script_end != -1:
        # Insert after the last </script> before </head>
        insert_pos = script_end + len('</script>')
        new_content = content[:insert_pos] + f'\n    <script type="application/ld+json">{breadcrumb_json}</script>\n' + content[insert_pos:]
    else:
        # No script tags in head - insert directly before </head>
        new_content = content[:head_end] + f'\n    <script type="application/ld+json">{breadcrumb_json}</script>\n' + content[head_end:]
    
    filepath.write_text(new_content, encoding="utf-8")
    return True


def main():
    print("Adding Product schema to book pages...")
    books_dir = ROOT / "books"
    for filepath in books_dir.glob("*.html"):
        if filepath.name in BOOKS:
            add_product_schema_to_book(filepath, BOOKS[filepath.name])
    
    print("\nAdding BreadcrumbList schema to blog articles...")
    blog_dir = ROOT / "blog"
    count = 0
    for filepath in blog_dir.glob("*.html"):
        if add_breadcrumb_to_blog(filepath):
            count += 1
            if count % 50 == 0:
                print(f"  Processed {count} articles...")
    
    print(f"\nDone. Added BreadcrumbList to {count} blog articles.")


if __name__ == "__main__":
    main()