import re
t=open('pages/about.html',encoding='utf-8').read()
# texto visible del about
body=re.sub(r'<script[\s\S]*?</script>','',t)
body=re.sub(r'<style[\s\S]*?</style>','',body)
txt=re.sub(r'<[^>]+>',' ',body)
txt=re.sub(r'\s+',' ',txt)
i=txt.lower().find('vision')
print(txt[max(0,i-700):i+900])
