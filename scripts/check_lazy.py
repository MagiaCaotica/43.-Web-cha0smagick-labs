import glob

count_lazy = 0
count_no_lazy = 0
for f in glob.glob('blog/*.html'):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
        if 'blog-featured-image' in content:
            if 'loading="lazy"' in content or "loading='lazy'" in content:
                count_lazy += 1
            else:
                count_no_lazy += 1

print('Blog featured images with lazy: ' + str(count_lazy))
print('Blog featured images without lazy: ' + str(count_no_lazy))