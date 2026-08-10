#!/usr/bin/env python3
"""
Fix UTF-8 mojibake in HTML files.

The files contain Unicode characters that were corrupted when UTF-8 bytes
were interpreted as Windows-1252 and re-saved. This script reverses the process.

Fix: encode corrupted text using a complete Windows-1252 byte mapping
to recover the original bytes, then decode those bytes as UTF-8.

Requires: handles ALL 256 byte values including control chars 0x80-0x9F.
"""
import os

# Complete Windows-1252 to Unicode mapping
# Key: Unicode code point, Value: byte value
WIN1252_TO_UNICODE = {
    0x20AC: 0x80,  # €
    0x201A: 0x82,  # ‚
    0x0192: 0x83,  # ƒ
    0x201E: 0x84,  # „
    0x2026: 0x85,  # …
    0x2020: 0x86,  # †
    0x2021: 0x87,  # ‡
    0x02C6: 0x88,  # ˆ
    0x2030: 0x89,  # ‰
    0x0160: 0x8A,  # Š
    0x2039: 0x8B,  # ‹
    0x0152: 0x8C,  # Œ
    0x017D: 0x8E,  # Ž
    0x2018: 0x91,  # '
    0x2019: 0x92,  # '
    0x201C: 0x93,  # "
    0x201D: 0x94,  # "
    0x2022: 0x95,  # •
    0x2013: 0x96,  # –
    0x2014: 0x97,  # —
    0x02DC: 0x98,  # ˜
    0x2122: 0x99,  # ™
    0x0161: 0x9A,  # š
    0x203A: 0x9B,  # ›
    0x0153: 0x9C,  # œ
    0x017E: 0x9E,  # ž
    0x0178: 0x9F,  # Ÿ
}

# Build reverse mapping: Unicode → byte
UNICODE_TO_BYTE = {v: k for k, v in WIN1252_TO_UNICODE.items()}

def encode_as_win1252_bytes(text):
    """
    Encode text as bytes using complete Windows-1252 byte semantics.
    Each Unicode character is converted to its byte value.
    Characters not representable in Windows-1252 raise an error.
    """
    result = bytearray()
    for c in text:
        cp = ord(c)
        if cp < 0x80:
            # ASCII
            result.append(cp)
        elif cp in WIN1252_TO_UNICODE:
            # Windows-1252 extended chars (€, ', ", —, •, etc.)
            result.append(WIN1252_TO_UNICODE[cp])
        elif 0x80 <= cp <= 0xFF:
            # Latin-1 direct mapping (including control chars)
            result.append(cp)
        else:
            raise UnicodeEncodeError(
                'windows-1252', c, len(result), len(result)+1,
                f'character {repr(c)} not in Windows-1252'
            )
    return bytes(result)

SUSPECT_RANGES = [
    (0x80, 0x9F),    # C1 control chars
    (0xA0, 0xFF),    # Latin-1 Supplement
    (0x2013, 0x2027),  # Dashes, quotes, bullets
    (0x2030, 0x203A),  # Per mille, single guillemets
    (0x20AC, 0x20AC),  # Euro sign
    (0x2122, 0x2122),  # Trademark
    (0x02C6, 0x02DC),  # Modifier letters
    (0x0152, 0x0153),  # OE ligatures
    (0x0160, 0x0161),  # S-caron
    (0x0178, 0x017E),  # Y-diaeresis, Z-caron
    (0x0192, 0x0192),  # Florin
]

def is_suspect(cp):
    """Check if a code point is characteristic of mojibake."""
    for lo, hi in SUSPECT_RANGES:
        if lo <= cp <= hi:
            return True
    return False

def try_fix_sequence(chunk):
    """Try to fix a potential mojibake sequence."""
    try:
        raw = encode_as_win1252_bytes(chunk)
        fixed = raw.decode('utf-8')
        if fixed and all(ord(fc) >= 32 or fc in '\n\r\t' for fc in fixed):
            return fixed
    except (UnicodeEncodeError, UnicodeDecodeError):
        pass
    return None

def fix_text(text):
    """
    Fix mojibake corruption in text.
    Processes character by character, attempting to decode mojibake sequences.
    """
    result = []
    i = 0
    while i < len(text):
        c = text[i]
        cp = ord(c)
        
        # Only try fix for suspect characters
        if is_suspect(cp):
            fixed = False
            # Try longer sequences first (greedy, up to 8 chars)
            for length in range(8, 1, -1):
                if i + length > len(text):
                    continue
                chunk = text[i:i+length]
                f = try_fix_sequence(chunk)
                if f:
                    result.append(f)
                    i += length
                    fixed = True
                    break
            
            if fixed:
                continue
        
        # Keep original character
        result.append(c)
        i += 1
    
    return ''.join(result)

def fix_file(filepath):
    """Fix mojibake in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8-sig') as f:
            content = f.read()
    except Exception as e:
        print(f"  ERROR reading {os.path.basename(filepath)}: {e}")
        return False
    
    original = content
    
    # Check if there are any suspect characters
    suspects = sum(1 for c in content if is_suspect(ord(c)))
    if suspects == 0:
        return False
    
    # Fix the text
    fixed = fix_text(content)
    
    if fixed == original:
        return False
    
    # Write fixed content with BOM
    with open(filepath, 'w', encoding='utf-8-sig') as f:
        f.write(fixed)
    
    # Report changes
    changes = sum(1 for a, b in zip(original, fixed) if a != b)
    print(f"  FIXED: {os.path.basename(filepath)} ({suspects} suspects, {changes} chars changed)")
    return True

def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    tools_dir = os.path.join(base, 'tools')
    
    if not os.path.isdir(tools_dir):
        print(f"ERROR: tools directory not found at {tools_dir}")
        return
    
    html_files = sorted([f for f in os.listdir(tools_dir) if f.endswith('.html')])
    print(f"Scanning {len(html_files)} HTML files in tools/")
    
    fixed_count = 0
    for fname in html_files:
        fpath = os.path.join(tools_dir, fname)
        if fix_file(fpath):
            fixed_count += 1
    
    print(f"\nFixed {fixed_count} files")
    if fixed_count == 0:
        print("(no changes needed or fix didn't trigger)")

if __name__ == '__main__':
    main()
