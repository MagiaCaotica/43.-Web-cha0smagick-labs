#!/usr/bin/env python3
"""
Convert PNG images to WebP format for better performance.
"""

from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMAGES_DIR = ROOT / "assets" / "images"

# PNG files missing WebP equivalents
MISSING_WEBP = [
    "astrallab.png",
    "bundle.png",
    "codexchaoticus.png",
    "eerieroads.png",
    "liber.png",
    "lucid.png",
    "luciddreamer.png",
    "mindthegap.PNG",
    "noctemnobg.png",
    "ouijacazadora.png",
    "servidores.png",
    "tarotchaos.png",
]

def convert_to_webp(png_path: Path, quality: int = 85):
    """Convert a PNG image to WebP format."""
    webp_path = png_path.with_suffix('.webp')
    
    try:
        with Image.open(png_path) as img:
            # Convert RGBA to RGB if needed (WebP supports transparency)
            if img.mode in ('RGBA', 'LA'):
                # Keep transparency for WebP
                pass
            elif img.mode == 'P':
                img = img.convert('RGBA')
            elif img.mode not in ('RGB', 'RGBA'):
                img = img.convert('RGB')
            
            # Save as WebP
            img.save(webp_path, 'WEBP', quality=quality, method=6)
            print(f"Converted: {png_path.name} -> {webp_path.name} ({webp_path.stat().st_size} bytes)")
            return True
    except Exception as e:
        print(f"Error converting {png_path.name}: {e}")
        return False

def main():
    print("Converting PNG images to WebP...")
    converted = 0
    for png_name in MISSING_WEBP:
        # Handle case-insensitive file systems
        png_path = None
        for ext in [png_name, png_name.lower(), png_name.upper()]:
            p = IMAGES_DIR / ext
            if p.exists():
                png_path = p
                break
        
        if png_path and png_path.exists():
            if convert_to_webp(png_path):
                converted += 1
        else:
            print(f"Not found: {png_name}")
    
    print(f"\nDone. Converted {converted} images.")

if __name__ == "__main__":
    main()