# Fix language sidebar placeholder text in all HTML files
# Replaces: ??????? -> Русский, ??? -> 日本語, ?? -> 中文
import os
import glob

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

replacements = [
    ('title="???????"', 'title="Русский"'),
    ('title="???"', 'title="日本語"'),
    ('title="??"', 'title="中文"'),
]

count = 0
for html_file in glob.glob(os.path.join(root, '**', '*.html'), recursive=True):
    relpath = os.path.relpath(html_file, root)
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            changed = True
    
    if changed:
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f'  Fixed: {relpath}')

print(f'\nFixed {count} files')
