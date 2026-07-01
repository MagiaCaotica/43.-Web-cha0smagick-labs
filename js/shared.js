/* ========================================================================
   Cha0smagick Labs — Shared Site Functionality
   Language Switcher · Cookie Consent · Visitor Counter · Utilities
   ======================================================================== */

// ========================================================================
// 1. SERVICE WORKER
// ========================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        var swPath = 'sw.js';
        // Detect relative path depth for SW registration
        var path = window.location.pathname;
        if (path.indexOf('/blog/') !== -1 || path.indexOf('/apps/') !== -1 || path.indexOf('/tools/') !== -1 || path.indexOf('/pages/') !== -1) {
            swPath = '../sw.js';
        }
        navigator.serviceWorker.register(swPath).catch(function(err) {
            console.log('SW registration skipped:', err);
        });
    });
}

// ========================================================================
// 2. VISITOR COUNTER
// ========================================================================
document.addEventListener('DOMContentLoaded', function() {
    var el = document.getElementById('visitor-count');
    if (el) {
        var count = localStorage.getItem('chaos_visit_count_v2');
        if (!count) count = 1;
        else count = parseInt(count) + 1;
        localStorage.setItem('chaos_visit_count_v2', count);
        el.textContent = count.toString().padStart(6, '0');
    }
});

// ========================================================================
// 3. LANGUAGE SWITCHER (Google Translate) — lazy-loaded on first click
// ========================================================================
var _gtLoaded = false;

function toggleLangSidebar() {
    var el = document.getElementById('lang-flag-list');
    if (!el) return;
    el.style.display = (el.style.display === 'none' || el.style.display === '') ? 'flex' : 'none';
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,pt,ru,ja,zh-CN',
        autoDisplay: false
    }, 'google_translate_element');
}

function switchLang(lang) {
    // Lazy-load the Google Translate script on first interaction
    if (!_gtLoaded) {
        _gtLoaded = true;
        var s = document.createElement('script');
        s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(s);
    }
    var tries = 0;
    var iv = setInterval(function() {
        var sel = document.querySelector('.goog-te-combo');
        if (sel) {
            sel.value = lang;
            sel.dispatchEvent(new Event('change'));
            clearInterval(iv);
            var fl = document.getElementById('lang-flag-list');
            if (fl) fl.style.display = 'none';
        }
        if (++tries > 30) clearInterval(iv);
    }, 150);
}

// ========================================================================
// 4. COOKIE CONSENT
// ========================================================================
(function() {
    var c = document.cookie.match(/(?:^|;\s*)cookie_consent=([^;]*)/);
    if (!c) {
        setTimeout(function() {
            var banner = document.getElementById('cookie-consent-banner');
            if (banner) banner.style.display = 'block';
        }, 1000);
    }
})();

function acceptCookies() {
    document.cookie = "cookie_consent=accepted; max-age=31536000; path=/; SameSite=Lax";
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'granted' });
    }
}

function declineCookies() {
    document.cookie = "cookie_consent=declined; max-age=31536000; path=/; SameSite=Lax";
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    if (typeof gtag === 'function') {
        gtag('consent', 'update', { 'analytics_storage': 'denied' });
    }
}

// ========================================================================
// 5. GLOSSARY ACCORDION — auto-open term when linked via URL hash
// ========================================================================
document.addEventListener('DOMContentLoaded', function() {
    // If URL has a hash, try to open the corresponding <details> term
    if (window.location.hash) {
        var target = document.getElementById(window.location.hash.substring(1));
        if (target && target.tagName === 'DETAILS') {
            target.setAttribute('open', '');
            // Scroll to it with offset
            setTimeout(function() {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }
    // Also intercept clicks on internal anchor links to open details
    document.addEventListener('click', function(e) {
        var a = e.target.closest('a[href^="#"]');
        if (a) {
            var id = a.getAttribute('href').substring(1);
            if (id) {
                var details = document.getElementById(id);
                if (details && details.tagName === 'DETAILS') {
                    // Small delay to let the browser navigate the hash first
                    setTimeout(function() {
                        details.setAttribute('open', '');
                    }, 50);
                }
            }
        }
    });

// ========================================================================
// 4. LAZY LOAD LEAFLET MAP (on scroll into viewport)
// ========================================================================
function loadLeaflet(callback) {
    if (typeof L !== 'undefined') {
        callback();
        return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.crossOrigin = 'anonymous';
    script.onload = callback;
    document.head.appendChild(script);
}

}); // close DOMContentLoaded listener
