"""
Migrate apps/*.html from old map-footer to standard footer-grid.
Replaces everything after </main> with the standardized footer structure.
"""
import os, glob, re

APPS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "apps")

NEW_FOOTER = '''    <footer id="site-footer" class="site-footer">
        <div class="footer-grid">
            <div class="footer-section">
                <h4>Cha0smagick Labs</h4>
                <p>Explore the Art and Practice of Chaos Magick.</p>
                <p>Corporate Cybermancy Solutions \u2014 since 2025.</p>
            </div>
            <div class="footer-section">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../index.html#about">About</a></li>
                    <li><a href="../index.html#products">Premium Apps</a></li>
                    <li><a href="../tools/">Free Tools</a></li>
                    <li><a href="../blog/">Blog</a></li>
                    <li><a href="../best-occult-apps-android.html">Best Occult Apps</a></li>
                    <li><a href="../complete-chaos-magick-bundle.html">Complete Bundle</a></li>
                    <li><a href="../glossary.html">Glossary</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Community</h4>
                <ul>
                    <li><a href="https://t.me/magiacaotica" target="_blank">Telegram</a></li>
                    <li><a href="https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA" target="_blank">YouTube</a></li>
                    <li><a href="https://www.instagram.com/cha0smagick.labs/" target="_blank">Instagram</a></li>
                    <li><a href="https://discord.gg/6vNSCaPgPd" target="_blank">Discord</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4>Legal</h4>
                <ul>
                    <li><a href="../privacy-policy.html">Privacy Policy</a></li>
                    <li><a href="../index.html#contact">Contact</a></li>
                </ul>
            </div>
            <div class="footer-section footer-visitor">
                <h4>Visitor Count</h4>
                <div class="visitor-count">Visitors: <span id="visitor-count">000000</span></div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Cha0smagick Labs \u2014 Corporate Cybermancy Solutions</p>
        </div>
    </footer>'''

POST_FOOTER = '''    <div id="google_translate_element" style="display:none;"></div>
<script src="../js/shared.js"></script>
<div id="lang-sidebar" class="lang-sidebar">
    <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">\U0001f310</button>
    <div id="lang-flag-list" class="lang-flag-list">
        <button onclick="switchLang('en')" title="English" class="lang-btn"><img src="../assets/images/flags/gb.svg" alt="" class="flag-icon"> EN</button>
        <button onclick="switchLang('es')" title="Espa\u00f1ol" class="lang-btn"><img src="../assets/images/flags/es.svg" alt="" class="flag-icon"> ES</button>
        <button onclick="switchLang('fr')" title="Fran\u00e7ais" class="lang-btn"><img src="../assets/images/flags/fr.svg" alt="" class="flag-icon"> FR</button>
        <button onclick="switchLang('de')" title="Deutsch" class="lang-btn"><img src="../assets/images/flags/de.svg" alt="" class="flag-icon"> DE</button>
        <button onclick="switchLang('it')" title="Italiano" class="lang-btn"><img src="../assets/images/flags/it.svg" alt="" class="flag-icon"> IT</button>
        <button onclick="switchLang('pt')" title="Portugu\u00eas" class="lang-btn"><img src="../assets/images/flags/pt.svg" alt="" class="flag-icon"> PT</button>
        <button onclick="switchLang('ru')" title="\u0420\u0443\u0441\u0441\u043a\u0438\u0439" class="lang-btn"><img src="../assets/images/flags/ru.svg" alt="" class="flag-icon"> RU</button>
        <button onclick="switchLang('ja')" title="\u65e5\u672c\u8a9e" class="lang-btn"><img src="../assets/images/flags/jp.svg" alt="" class="flag-icon"> JP</button>
        <button onclick="switchLang('zh-CN')" title="\u4e2d\u6587" class="lang-btn"><img src="../assets/images/flags/cn.svg" alt="" class="flag-icon"> ZH</button>
    </div>
</div>
<div id="google_translate_element" style="display:none;"></div>
<div id="cookie-consent-banner">
    <p>This site uses cookies for analytics and to improve your experience. <a href="../privacy-policy.html" style="color:#ffd700;">Learn more</a></p>
    <div class="cookie-buttons">
        <button class="cookie-btn-accept" onclick="acceptCookies()">Accept</button>
        <button class="cookie-btn-decline" onclick="declineCookies()">Decline</button>
    </div>
</div>
</body>
</html>'''

REPLACEMENT = NEW_FOOTER + "\n" + POST_FOOTER

files = sorted(glob.glob(os.path.join(APPS_DIR, "*.html")))
count = 0
for fp in files:
    with open(fp, "r", encoding="utf-8") as f:
        html = f.read()
    
    # Find the </main> tag
    idx = html.find("</main>")
    if idx == -1:
        print(f"  SKIP {os.path.basename(fp)}: no </main> found")
        continue
    
    # Everything before and including </main>
    before = html[:idx + len("</main>")]
    # Replace everything after </main> with new standardized ending
    new_html = before + "\n" + REPLACEMENT
    
    with open(fp, "w", encoding="utf-8") as f:
        f.write(new_html)
    print(f"  OK {os.path.basename(fp)}")
    count += 1

print(f"\nMigrated {count} apps pages to footer-grid")
