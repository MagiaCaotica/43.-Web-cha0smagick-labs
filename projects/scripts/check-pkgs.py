import urllib.request, json, re, concurrent.futures
pkgs = ['com.cha0smagicklabs.astralchart','com.app.goetiansealsgeneratorapp','com.cha0smagick.dreammachine','com.cha0smagicklabs.eerieroads','com.cha0smagick.sigilgeneratorfinal','com.app.ichingoracle','com.cha0smagicklabs.luciddreamer','com.lunarapp.app','com.cha0smagicklabs.noctemapp','com.japps.norse_oracle','com.cha0smagick.unofficialraiderwaite','com.cha0smagick.unofficialraiderwaite','com.cha0smagicklabs.zenercards']
def check(p):
    url='https://play.google.com/store/apps/details?id='+p+'&hl=en'
    try:
        req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
        r=urllib.request.urlopen(req,timeout=15)
        body=r.read().decode('utf-8','ignore')
        if r.status==200:
            t=re.search(r'<title>([^<]+)</title>',body)
            title=t.group(1).strip()[:70] if t else '?'
            return f'{p}: EXISTS | {title!r}'
        return f'{p}: status={r.status}'
    except urllib.error.HTTPError as e:
        return f'{p}: HTTP {e.code}'
    except Exception as e:
        return f'{p}: ERR {type(e).__name__} {str(e)[:50]}'
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as ex:
    for r in ex.map(check,pkgs): print(r)