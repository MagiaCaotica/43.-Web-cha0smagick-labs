import urllib.request as u

ids = [
    "com.cha0smagick.sigilgeneratorfinal",
    "com.app.goetiansealsgeneratorapp",
    "com.cha0smagick.dreammachine",
    "com.app.ichingoracle",
    "com.lunarapp.app",
    "com.japps.norse_oracle",
    "com.cha0smagick.unofficialraiderwaite",
]

for i in ids:
    try:
        r = u.urlopen(u.Request("https://play.google.com/store/apps/details?id=" + i,
                                headers={"User-Agent": "Mozilla/5.0"}))
        body = r.read().decode("utf-8", "ignore")
        title = "?"
        import re
        m = re.search(r'<title[^>]*>([^<]+)</title>', body)
        if m:
            title = m.group(1)[:60]
        print(i, "=> EXISTS |", title)
    except Exception as e:
        print(i, "=> HTTP 404 (", type(e).__name__, ")")