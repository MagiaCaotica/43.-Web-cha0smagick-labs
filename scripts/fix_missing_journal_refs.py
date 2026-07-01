"""Add missing journal article references to 5 files that lost them."""
import re, os

root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

FIXES = {
    'best-esp-training-apps-android.html': [
        '<li>Bem, D.J. (2011). Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect. <em>Journal of Personality and Social Psychology, 100(3), 407-425</em>.</li>',
    ],
    'clairvoyance-test-online.html': [
        '<li>Bem, D.J. (2011). Feeling the future: Experimental evidence for anomalous retroactive influences on cognition and affect. <em>Journal of Personality and Social Psychology, 100(3), 407-425</em>.</li>',
    ],
    'binaural-beats-lucid-dreaming-guide.html': [
        '<li>Oster, G. (1973). Auditory beats in the brain. <em>Scientific American, 229(4), 94-102</em>.</li>',
    ],
    'dream-machine-app-review.html': [
        '<li>Oster, G. (1973). Auditory beats in the brain. <em>Scientific American, 229(4), 94-102</em>.</li>',
    ],
    'remote-viewing-techniques-beginners.html': [
        '<li>McElroy, D., &amp; Targ, R. (2009). The CSIRO Remote Viewing Program. <em>Journal of Parapsychology, 73(2), 311-328</em>.</li>',
    ],
}

for f, items in FIXES.items():
    path = os.path.join(root, 'blog', f)
    with open(path, 'r', encoding='utf-8') as fh:
        content = fh.read()
    
    # Find the <ul> inside the References section and add items before </ul>
    m = re.search(r'(<h2>References</h2>\s*<ul>.*?)(</ul>)', content, re.DOTALL)
    if m:
        new_li = '\n'.join(items)
        content = content[:m.end(1)] + '\n' + new_li + '\n' + content[m.start(2):]
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'FIXED: {f} (added {len(items)} journal refs)')
    else:
        print(f'ERROR: No refs ul found in {f}')

print('Done.')
