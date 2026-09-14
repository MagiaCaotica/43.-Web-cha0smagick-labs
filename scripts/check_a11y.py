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

# Check all app pages
total = {'missing_alt': 0, 'empty_alt': 0, 'heading_skips': 0}
for f in glob.glob('apps/*.html'):
    issues = check_accessibility(f)
    for k, v in issues.items():
        total[k] += v

# Check all book pages
for f in glob.glob('books/*.html'):
    issues = check_accessibility(f)
    for k, v in issues.items():
        total[k] += v

# Check sample of blog pages
for f in glob.glob('blog/*.html')[:50]:
    issues = check_accessibility(f)
    for k, v in issues.items():
        total[k] += v

print('Total issues (apps + books + 50 blog sample):')
for k, v in total.items():
    print('  ' + k + ': ' + str(v))