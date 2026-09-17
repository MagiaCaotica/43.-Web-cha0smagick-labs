import re
import glob

def check_accessibility(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = {
        'missing_alt': 0,
        'empty_alt': 0,
        'heading_skips': 0,
    }
    
    # Check images without alt
    imgs = re.findall(r'<img[^>]*>', content)
    for img in imgs:
        if 'alt=' not in img:
            issues['missing_alt'] += 1
        elif 'alt=""' in img or "alt=''" in img:
            issues['empty_alt'] += 1
    
    # Check heading structure
    headings = re.findall(r'<h([1-6])[^>]*>', content)
    prev_level = 0
    for h in headings:
        level = int(h)
        if level > prev_level + 1:
            issues['heading_skips'] += 1
        prev_level = level
    
    return issues

if __name__ == "__main__":
    # Plan 1.4.3 — check ALL pages (no sample)
    dirs = ['.', 'apps', 'books', 'tools', 'blog', 'landing-pages']
    page_files = []
    for d in dirs:
        page_files.extend(sorted(glob.glob(d + '/*.html')))

    total = {'missing_alt': 0, 'empty_alt': 0, 'heading_skips': 0}
    for f in page_files:
        issues = check_accessibility(f)
        for k, v in issues.items():
            total[k] += v

    print(f'Accessibility check covered {len(page_files)} pages (ALL pages, no sample):')
    for k, v in total.items():
        print('  ' + k + ': ' + str(v))