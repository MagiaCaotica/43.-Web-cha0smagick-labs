# Replace inline Google Translate init with lazy-load version in app pages
import os, glob

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
apps_dir = os.path.join(root, 'apps')

old_block_start = '<div id="google_translate_element"'
old_block_end = '<script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>'

new_block = '''<div id="google_translate_element" style="position:fixed;bottom:1rem;right:1rem;z-index:9999;"></div>
<script>
var _gtLoaded = false;
function googleTranslateElementInit() {
  new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
}
document.addEventListener('click', function _loadGt() {
  if (!_gtLoaded) {
    _gtLoaded = true;
    var s = document.createElement('script');
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(s);
  }
}, { once: true });
</script>'''

count = 0
for html_file in sorted(glob.glob(os.path.join(apps_dir, '*.html'))):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the old block: from google_translate_element div to the element.js script tag
    start_idx = content.find(old_block_start)
    if start_idx == -1:
        print(f"  SKIP (no translate): {os.path.basename(html_file)}")
        continue
    
    end_idx = content.find(old_block_end, start_idx)
    if end_idx == -1:
        print(f"  SKIP (no element.js): {os.path.basename(html_file)}")
        continue
    
    end_idx += len(old_block_end)
    
    old = content[start_idx:end_idx]
    content = content[:start_idx] + new_block + content[end_idx:]
    
    # Also remove the goog-te-banner-frame style override that may exist
    # (keep existing styles, just replace the translate block)
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)
    count += 1
    print(f"  FIXED: {os.path.basename(html_file)}")

print(f'\nFixed {count} app pages')
