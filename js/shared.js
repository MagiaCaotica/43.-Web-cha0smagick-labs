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
// 3. LANGUAGE SWITCHER (Google Translate)
// ========================================================================
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
