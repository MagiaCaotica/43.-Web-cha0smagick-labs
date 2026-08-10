"""
Batch 5 - CSS/JS Minification.
Updates all HTML pages to reference minified CSS and JS files.
"""
import os, re

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

def get_html_files():
    targets = []
    for root_dir, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if not d.startswith('.') and d not in ('node_modules', 'env')]
        for f in files:
            if f.endswith('.html'):
                targets.append(os.path.join(root_dir, f))
    return targets

def main():
    files = get_html_files()
    css_replaced = 0
    js_replaced = 0
    already_min = 0
    
    for path in files:
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
        
        original = content
        
        # Replace deferred style.css references (preload + noscript)
        # Pattern: href="css/style.css" but NOT inline critical <style> blocks
        content = re.sub(
            r'(href="[^"]*?)style\.css(?=")',
            r'\1style.min.css',
            content
        )
        
        # Replace shared.js references (preserve any relative path prefix)
        # Pattern: src="<any path>/shared.js" or src='<any path>/shared.js'
        content = re.sub(
            r'(src=["\'])([^"\']*?)shared\.js(["\'])',
            r'\1\2shared.min.js\3',
            content
        )
        
        if content != original:
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(content)
            # Count changes
            if 'style.min.css' in content and 'style.css' in content:
                pass  # both - shouldn't happen but skip
            elif 'style.min.css' in content:
                css_replaced += 1
            if 'shared.min.js' in content:
                js_replaced += 1
        else:
            # Check if already has minified references
            if 'style.min.css' in content and 'shared.min.js' in content:
                already_min += 1
    
    print(f'Files with CSS updated: {css_replaced}')
    print(f'Files with JS updated: {js_replaced}')
    print(f'Already minified: {already_min}')

if __name__ == '__main__':
    main()
