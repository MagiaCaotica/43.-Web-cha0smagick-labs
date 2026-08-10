"""
Generate unique chaos magick themed images for all blog articles.
Each image: 800x420, dark occult aesthetic, unique per article.
"""
import os, math, random, hashlib, glob
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "assets", "images", "blog")
W, H = 800, 420

# === Color palettes (chaos magick themed) ===
PALETTES = [
    # (bg, accent1, accent2, text, glow)
    ("#0a0a0b", "#c5a059", "#8b0000", "#e0d5c0", "#ffd700"),  # Gold/Blood
    ("#050508", "#6b21a8", "#c084fc", "#e0d5c0", "#a855f7"),  # Purple/Violet
    ("#080808", "#1e40af", "#60a5fa", "#c0d0e0", "#3b82f6"),  # Blue/Arcane
    ("#0a0808", "#991b1b", "#fca5a5", "#e0c0c0", "#ef4444"),  # Crimson/Dark
    ("#080a08", "#065f46", "#6ee7b7", "#c0e0c0", "#10b981"),  # Emerald/Green
    ("#0a0805", "#92400e", "#fcd34d", "#e0d0b0", "#f59e0b"),  # Amber/Ancient
    ("#05050a", "#312e81", "#a5b4fc", "#c0c0e0", "#6366f1"),  # Indigo/Mystic
    ("#08080a", "#831843", "#fbcfe8", "#e0c0d0", "#ec4899"),  # Rose/Dark
    ("#0a0a05", "#713f12", "#fde68a", "#d0d0b0", "#eab308"),  # Gold/Ochre
    ("#050808", "#164e63", "#67e8f9", "#b0d0d0", "#06b6d4"),  # Cyan/Abyss
]

# === Occult symbols as drawing functions ===
def draw_pentagram(draw, cx, cy, r, color, seed=0, **kw):
    """Draw a pentagram (5-pointed star)"""
    points = []
    for i in range(5):
        angle = i * 2 * math.pi / 5 - math.pi / 2
        points.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    for i in range(5):
        draw.line([points[i], points[(i + 2) % 5]], fill=color, width=2)

def draw_hexagram(draw, cx, cy, r, color, seed=0, **kw):
    """Draw a hexagram (Star of David / Seal of Solomon)"""
    # Upward triangle
    for i in range(3):
        a1 = i * 2 * math.pi / 3 - math.pi / 2
        a2 = ((i + 1) % 3) * 2 * math.pi / 3 - math.pi / 2
        draw.line([(cx + r * math.cos(a1), cy + r * math.sin(a1)),
                   (cx + r * math.cos(a2), cy + r * math.sin(a2))], fill=color, width=2)
    # Downward triangle
    for i in range(3):
        a1 = i * 2 * math.pi / 3 + math.pi / 2
        a2 = ((i + 1) % 3) * 2 * math.pi / 3 + math.pi / 2
        draw.line([(cx + r * math.cos(a1), cy + r * math.sin(a1)),
                   (cx + r * math.cos(a2), cy + r * math.sin(a2))], fill=color, width=2)

def draw_spiral(draw, cx, cy, r, color, turns=5, seed=0, **kw):
    """Draw an Archimedean spiral"""
    points = []
    for t in range(100):
        angle = t * turns * 2 * math.pi / 100
        rad = r * t / 100
        points.append((cx + rad * math.cos(angle), cy + rad * math.sin(angle)))
    if len(points) > 1:
        for i in range(len(points) - 1):
            draw.line([points[i], points[i + 1]], fill=color, width=1)

def draw_sigil_lines(draw, cx, cy, r, color, seed=0, **kw):
    """Draw random sigil-like connected lines"""
    random.seed(seed)
    points = []
    for _ in range(8):
        angle = random.random() * 2 * math.pi
        rad = r * (0.2 + 0.8 * random.random())
        points.append((cx + rad * math.cos(angle), cy + rad * math.sin(angle)))
    # Connect in random order
    order = list(range(len(points)))
    random.shuffle(order)
    for i in range(len(order) - 1):
        draw.line([points[order[i]], points[order[i + 1]]], fill=color, width=2)
    # Draw circles at nodes
    for p in points:
        draw.ellipse([p[0] - 3, p[1] - 3, p[0] + 3, p[1] + 3], fill=color)

def draw_eye_of_horus(draw, cx, cy, r, color, seed=0, **kw):
    """Draw a stylized eye / Eye of Horus"""
    # Eye shape
    draw.ellipse([cx - r, cy - r * 0.7, cx + r, cy + r * 0.7], outline=color, width=2)
    # Iris
    draw.ellipse([cx - r * 0.3, cy - r * 0.2, cx + r * 0.3, cy + r * 0.2], fill=color)
    # Pupil
    draw.ellipse([cx - r * 0.1, cy - r * 0.1, cx + r * 0.1, cy + r * 0.1], fill="#000000")
    # Eyebrow curve
    draw.arc([cx - r * 1.2, cy - r * 1.2, cx + r * 1.2, cy], 0, 180, fill=color, width=3)

def draw_moon_phases(draw, cx, cy, r, color, seed=0, **kw):
    """Draw moon phase symbols"""
    for i in range(4):
        x = cx + (i - 1.5) * r * 0.6
        phase_r = r * 0.2
        # Circle
        draw.ellipse([x - phase_r, cy - phase_r, x + phase_r, cy + phase_r], outline=color, width=2)
        # Phase arc
        if i == 0:  # New moon - fill
            draw.ellipse([x - phase_r, cy - phase_r, x + phase_r, cy + phase_r], fill=color)
        elif i == 1:  # Crescent
            draw.pieslice([x - phase_r, cy - phase_r, x + phase_r, cy + phase_r], -90, 90, fill=color)
        elif i == 2:  # Half
            draw.pieslice([x - phase_r, cy - phase_r, x + phase_r, cy + phase_r], -90, 90, fill=color)
            draw.chord([x - phase_r, cy - phase_r, x + phase_r, cy + phase_r], 90, -90, fill=color)
        else:  # Full
            pass

def draw_grid_lines(draw, color, spacing=40):
    """Draw occult grid lines across the image"""
    for x in range(0, W, spacing):
        draw.line([(x, 0), (x, H)], fill=color, width=1)
    for y in range(0, H, spacing):
        draw.line([(0, y), (W, y)], fill=color, width=1)

def draw_runes(draw, cx, cy, r, color, seed=0):
    """Draw stylized rune-like symbols"""
    random.seed(seed)
    runes = [
        [(0, -1), (0, 1), (1, 0)],  # Fehu-like
        [(-1, -1), (1, 1), (0, 0), (0, -1)],  # Uruz-like
        [(0, -1), (-1, 0), (0, 1)],  # Thurisaz-like
        [(-1, -1), (0, -1), (0, 1), (1, 1)],  # Ansuz-like
        [(0, -1), (0, 1), (-1, 0)],  # Raidho-like
        [(-1, -1), (0, 0), (1, -1), (0, 0), (0, 1)],  # Kenaz-like
    ]
    rune = random.choice(runes)
    s = r * 0.15
    for i in range(len(rune) - 1):
        x1 = cx + rune[i][0] * s
        y1 = cy + rune[i][1] * s
        x2 = cx + rune[i + 1][0] * s
        y2 = cy + rune[i + 1][1] * s
        draw.line([(x1, y1), (x2, y2)], fill=color, width=2)

# === Image generation ===
def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def generate_article_image(slug, title, palette_idx=None):
    """Generate a unique chaos magick themed image for an article."""
    seed = sum(ord(c) for c in slug)
    random.seed(seed)
    hashed = hashlib.md5(slug.encode()).hexdigest()
    
    if palette_idx is None:
        palette_idx = int(hashed[:2], 16) % len(PALETTES)
    
    bg_hex, a1_hex, a2_hex, text_hex, glow_hex = PALETTES[palette_idx]
    bg = hex_to_rgb(bg_hex)
    a1 = hex_to_rgb(a1_hex)
    a2 = hex_to_rgb(a2_hex)
    tc = hex_to_rgb(text_hex)
    gc = hex_to_rgb(glow_hex)
    
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img, "RGB")
    
    # 1. Background gradient (subtle)
    for y in range(H):
        alpha = y / H
        r = int(bg[0] * (1 - alpha) + bg[0] * 0.8 * alpha)
        g = int(bg[1] * (1 - alpha) + bg[1] * 0.8 * alpha)
        b = int(bg[2] * (1 - alpha) + bg[2] * 0.8 * alpha)
        draw.line([(0, y), (W, y)], fill=(r, g, b))
    
    # 2. Background grid (subtle, barely visible)
    grid_color = (a1[0], a1[1], a1[2], 20)
    draw_grid_lines(draw, (a1[0] // 3, a1[1] // 3, a1[2] // 3))
    
    # 3. Occult symbols in background (semi-transparent)
    symbol_choices = [
        ("pentagram", draw_pentagram),
        ("hexagram", draw_hexagram),
        ("spiral", draw_spiral),
        ("sigil", draw_sigil_lines),
        ("eye", draw_eye_of_horus),
        ("moon", draw_moon_phases),
        ("runes", draw_runes),
    ]
    
    # Determine symbols based on slug content
    slug_lower = slug.lower()
    if any(w in slug_lower for w in ["sigil", "spare"]):
        primary_symbols = ["sigil", "pentagram", "spiral"]
    elif any(w in slug_lower for w in ["rune", "norse", "viking"]):
        primary_symbols = ["runes", "hexagram", "spiral"]
    elif any(w in slug_lower for w in ["moon", "lunar"]):
        primary_symbols = ["moon", "spiral", "pentagram"]
    elif any(w in slug_lower for w in ["tarot"]):
        primary_symbols = ["pentagram", "hexagram", "eye"]
    elif any(w in slug_lower for w in ["dream", "lucid"]):
        primary_symbols = ["eye", "spiral", "moon"]
    elif any(w in slug_lower for w in ["goetia", "demon", "spirit"]):
        primary_symbols = ["hexagram", "pentagram", "sigil"]
    elif any(w in slug_lower for w in ["zener", "esp", "psi", "clairvoyance", "remote"]):
        primary_symbols = ["eye", "spiral", "sigil"]
    elif any(w in slug_lower for w in ["iching", "i-ching"]):
        primary_symbols = ["hexagram", "spiral", "sigil"]
    elif any(w in slug_lower for w in ["techno", "cyber", "digital"]):
        primary_symbols = ["sigil", "spiral", "hexagram"]
    elif any(w in slug_lower for w in ["astral", "psycho", "reality"]):
        primary_symbols = ["spiral", "eye", "moon"]
    elif any(w in slug_lower for w in ["servitor", "egregore"]):
        primary_symbols = ["sigil", "pentagram", "hexagram"]
    elif any(w in slug_lower for w in ["banish", "cleans"]):
        primary_symbols = ["pentagram", "hexagram", "runes"]
    elif any(w in slug_lower for w in ["gnosis", "paradigm"]):
        primary_symbols = ["spiral", "eye", "hexagram"]
    else:
        primary_symbols = ["pentagram", "hexagram", "spiral"]
    
    # Draw large background symbol
    bg_symbol = random.choice(primary_symbols)
    sym_func = dict(symbol_choices)[bg_symbol]
    sym_color = (a1[0] // 4, a1[1] // 4, a1[2] // 4)
    sym_func(draw, W * 0.7, H * 0.4, 180, sym_color, seed=seed)
    
    # Draw secondary symbols
    for si in range(3):
        s = random.choice(primary_symbols)
        sym_fn = dict(symbol_choices)[s]
        x = random.randint(50, W - 50)
        y = random.randint(50, H - 50)
        rr = random.randint(30, 60)
        c = (a2[0] // 3, a2[1] // 3, a2[2] // 3)
        sym_fn(draw, x, y, rr, c, seed + si)
    
    # 4. Vertical accent line (left side)
    accent_color = a1
    draw.rectangle([(15, 0), (20, H)], fill=accent_color)
    draw.rectangle([(25, 0), (26, H)], fill=(a1[0] // 2, a1[1] // 2, a1[2] // 2))
    
    # 5. Bottom decorative bar
    bar_y = H - 60
    draw.rectangle([(0, bar_y), (W, bar_y + 2)], fill=accent_color)
    draw.rectangle([(0, bar_y + 55), (W, bar_y + 57)], fill=(a1[0] // 2, a1[1] // 2, a1[2] // 2))
    
    # 6. Title text
    # Use default font if no custom font available
    font_size = 28
    try:
        font = ImageFont.truetype("arial.ttf", font_size)
        font_small = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default()
        font_small = font
    
    # Title with shadow
    words = title.split()
    line1 = []
    line2 = []
    mid = len(words) // 2
    # Try to split evenly
    if len(words) <= 4:
        line1 = words
    else:
        w = 0
        for i, word in enumerate(words):
            w += len(word)
            if w < 30:
                line1.append(word)
            else:
                line2.extend(words[i:])
                break
        if not line2:
            line1 = words[:mid]
            line2 = words[mid:]
    
    title1 = " ".join(line1)
    title2 = " ".join(line2) if line2 else ""
    
    # Draw shadow
    shadow_offset = 2
    for dy in range(shadow_offset):
        for dx in range(shadow_offset):
            draw.text((45 + dx, 40 + dy), title1, fill=(0, 0, 0), font=font)
            if title2:
                draw.text((45 + dx, 72 + dy), title2, fill=(0, 0, 0), font=font)
    
    # Draw main text
    draw.text((45, 40), title1, fill=text_hex, font=font)
    if title2:
        draw.text((45, 72), title2, fill=text_hex, font=font)
    
    # Subtitle
    sub = "Cha0smagick Labs"
    draw.text((45, H - 35), sub, fill=(a1[0], a1[1], a1[2]), font=font_small)
    
    # 7. Decorative corner elements
    # Top-right corner accent
    corner_size = 30
    draw.line([(W - corner_size, 0), (W, 0), (W, corner_size)], fill=accent_color, width=2)
    draw.line([(0, H - corner_size), (0, H), (corner_size, H)], fill=accent_color, width=2)
    
    # 8. Subtle vignette overlay
    for i in range(40):
        alpha = 1 - i / 40
        c = int(10 * alpha)
        draw.rectangle([(i, i), (W - i, H - i)], outline=(c, c, c))
    
    return img

def slug_to_title(slug):
    """Convert slug to a readable title for the image."""
    # Remove trailing suffixes
    name = slug.replace("-app-review", "").replace("-guide", "").replace("-complete-guide", "")
    name = name.replace("-for-beginners", "").replace("-beginners", "").replace("-online-guide", "")
    name = name.replace("-manual-pdf-review", "").replace("-pdf-review", "").replace("-treatise-review", "")
    name = name.replace("-techniques-beginners", "")
    # Remove common words
    for w in ["how-to", "what-is", "master", "the", "and", "for", "of", "in", "to"]:
        name = name.replace(f"-{w}-", "-").replace(f"-{w}", "").replace(f"{w}-", "")
    name = name.strip("-")
    # Capitalize
    parts = name.split("-")
    # Max 5 words for image
    parts = parts[:5]
    return " ".join(p.capitalize() for p in parts)

# === Main ===
def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    
    # Get all blog slugs
    blog_files = sorted(glob.glob(os.path.join(ROOT, "blog", "*.html")))
    slugs = []
    for fp in blog_files:
        slug = os.path.splitext(os.path.basename(fp))[0]
        if slug == "index":
            continue
        slugs.append(slug)
    
    print(f"Generating {len(slugs)} unique article images...")
    
    for i, slug in enumerate(slugs):
        title = slug_to_title(slug)
        palette_idx = i % len(PALETTES)
        
        img = generate_article_image(slug, title, palette_idx)
        
        # Save PNG
        png_path = os.path.join(IMG_DIR, f"{slug}.png")
        img.save(png_path, "PNG")
        
        # Save WebP
        webp_path = os.path.join(IMG_DIR, f"{slug}.webp")
        img.save(webp_path, "WEBP", quality=85)
        
        if (i + 1) % 10 == 0:
            print(f"  Generated {i + 1}/{len(slugs)}")
    
    print(f"\nDone! Generated {len(slugs)} images (PNG + WebP)")

if __name__ == "__main__":
    main()
