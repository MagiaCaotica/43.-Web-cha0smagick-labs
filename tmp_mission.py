import re,glob
hits=[]
for f in glob.glob('pages/*.html')+['index.html','PROJECT-BIBLE.md','community.html']:
    try: t=open(f,encoding='utf-8').read()
    except: continue
    for m in re.finditer(r'(?i)(mission|misi[oó]n|vision|visi[oó]n|who we are|qui[eé]nes somos)',t):
        s=max(0,m.start()-90); hits.append((f, re.sub(r'\s+',' ',t[s:m.start()+160])[:230]))
seen=set()
for f,s in hits:
    if f in seen: continue
    seen.add(f); print(f,'::',s,'\n')
