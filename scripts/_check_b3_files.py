# -*- coding: utf-8 -*-
"""Check whether B3 article files (83-92) exist on disk and whether articles_l.py exists."""
import os

scripts_dir = os.path.join(os.getcwd(), 'scripts')
print('CWD:', os.getcwd())
print('scripts_dir exists:', os.path.isdir(scripts_dir))

b3_files = ['article_%d.py' % i for i in range(83, 93)]
for f in b3_files:
    p = os.path.join(scripts_dir, f)
    print(f, '->', os.path.isfile(p))

l_file = os.path.join(scripts_dir, 'articles_l.py')
print('articles_l.py ->', os.path.isfile(l_file))
