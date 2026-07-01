"""Verify cross-links in a sample article."""
import os
root = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'
path = os.path.join(root, 'blog', 'chaos-magick-beginners-complete-guide.html')
with open(path, 'r', encoding='utf-8') as fh:
    c = fh.read()
# Find related-articles section
start = c.find('related-articles')
if start > 0:
    end = c.find('</section>', start) + 10
    print(c[start:end])
else:
    print('No related-articles section found')
