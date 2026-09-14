with open('scripts/generate_blog.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the _esc function - use proper HTML entity codes
old = 'return (text.replace("&", "&").replace("<", "<")\n                .replace(">", ">").replace(\'"\', """))'
new = 'return (text.replace("&", chr(38)+"amp;").replace("<", chr(38)+"lt;")\n                .replace(">", chr(38)+"gt;").replace(\'"\', chr(38)+"quot;"))'

content = content.replace(old, new)

with open('scripts/generate_blog.py', 'w', encoding='utf-8') as f:
    f.write(content)
print('Fixed _esc function')