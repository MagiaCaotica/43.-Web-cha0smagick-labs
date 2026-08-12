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
// 4. MEASUREMENT IDS
// ------------------------------------------------------------------------
//  GA4_ID          -> live Google Analytics 4 measurement ID.
//  GOOGLE_ADS_ID   -> Google Ads conversion ID (format "AW-XXXXXXXXX").
//                     PLACEHOLDER ON PURPOSE. Do NOT fire conversions until a
//                     real ID is pasted here: gtag('config', 'AW-...') with a
//                     fake ID silently poisons the Ads account's conversion data.
//                     Once the real ID exists, replace the string below — the
//                     wiring in cmEnsureGtag() activates automatically.
//  META_PIXEL_ID   -> Meta (Facebook) Pixel ID.
//                     PLACEHOLDER ON PURPOSE. The Meta business account is
//                     restricted until 2026-12-02, so no real ID exists yet.
//                     Replace the string below with the numeric Pixel ID and
//                     the full fbq() bootstrap in cmInitMetaPixel() goes live
//                     with zero further changes.
// ========================================================================
var GA4_ID = 'G-V6LHCPN9TK';
var GOOGLE_ADS_ID = 'PONER_AW_ID_AQUI';
var META_PIXEL_ID = 'PONER_META_PIXEL_ID_AQUI';

// True only when a placeholder has been swapped for a real value.
function cmIdIsReal(id, prefix) {
    if (!id || typeof id !== 'string') return false;
    if (id.indexOf('PONER_') === 0) return false;
    if (prefix && id.indexOf(prefix) !== 0) return false;
    return true;
}

// ========================================================================
// 5. GA4 BOOTSTRAP + CONSENT (default GRANTED)
// ------------------------------------------------------------------------
// Historically the inline page snippet set consent default to 'denied', which
// made the vast majority of sessions invisible in GA4 (nothing is sent until
// the user clicks Accept, and most never do). We now default to 'granted' and
// keep the banner purely informative with a working opt-out: Decline pushes a
// consent 'update' to 'denied' and stops collection from that point on.
// ========================================================================
function cmGetCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
}

// Idempotent gtag bootstrap. Several page templates load the gtag library but
// never run the inline dataLayer/config snippet, so GA4 received nothing from
// them. This creates the bootstrap only when it is genuinely missing — it never
// duplicates an existing gtag init.
function cmEnsureGtag() {
    if (window.__cmGtagReady) return;
    window.__cmGtagReady = true;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
        window.gtag = function () { window.dataLayer.push(arguments); };
    }

    // Has this page already issued gtag('config', GA4_ID)?
    var configured = false;
    try {
        for (var i = 0; i < window.dataLayer.length; i++) {
            var row = window.dataLayer[i];
            if (row && row[0] === 'config' && row[1] === GA4_ID) { configured = true; break; }
        }
    } catch (e) {}

    // Consent BEFORE config so the first hit already carries the right state.
    cmApplyConsent();

    if (!configured) {
        window.gtag('js', new Date());
        window.gtag('config', GA4_ID);
    }

    // Google Ads: only wired when a real AW- id has been provided.
    if (cmIdIsReal(GOOGLE_ADS_ID, 'AW-')) {
        window.gtag('config', GOOGLE_ADS_ID);
    }
}

// Applies granted-by-default consent, or denied when the visitor opted out.
function cmApplyConsent() {
    if (typeof window.gtag !== 'function') return;
    var declined = cmGetCookie('cookie_consent') === 'declined';
    var state = declined ? 'denied' : 'granted';
    window.gtag('consent', 'update', {
        'analytics_storage': state,
        'ad_storage': state,
        'ad_user_data': state,
        'ad_personalization': state
    });
}

// ========================================================================
// 6. META PIXEL  (inert until META_PIXEL_ID is real)
// ========================================================================
function cmInitMetaPixel() {
    if (window.__cmPixelReady) return;
    if (!cmIdIsReal(META_PIXEL_ID)) return; // placeholder -> stay inert
    window.__cmPixelReady = true;

    /* Standard Meta Pixel base code */
    !function (f, b, e, v, n, t, s) {
        if (f.fbq) return; n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
        t = b.createElement(e); t.async = !0; t.src = v;
        s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
}

// ========================================================================
// 7. UTM ATTRIBUTION HELPER
// ------------------------------------------------------------------------
// addUTM('https://play.google.com/...', 'psi_gym_card')
//   -> https://play.google.com/...?utm_source=cha0smagicklabs&utm_medium=website&utm_campaign=psi_gym_card
// Preserves existing query strings, never double-tags, keeps the #hash.
// ========================================================================
function addUTM(url, campaign) {
    if (!url || typeof url !== 'string') return url;
    if (url.indexOf('utm_source=') !== -1) return url; // already attributed
    if (/^(mailto:|tel:|javascript:|#)/i.test(url)) return url;

    var hash = '';
    var hashAt = url.indexOf('#');
    if (hashAt !== -1) { hash = url.slice(hashAt); url = url.slice(0, hashAt); }

    var camp = String(campaign || 'site_cta').replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 64);
    var sep = url.indexOf('?') !== -1 ? '&' : '?';
    return url + sep +
        'utm_source=cha0smagicklabs&utm_medium=website&utm_campaign=' +
        encodeURIComponent(camp) + hash;
}
window.addUTM = addUTM;

// ========================================================================
// 8. COOKIE CONSENT BANNER (informative — collection is already active)
// ========================================================================
cmEnsureGtag();
cmInitMetaPixel();

(function () {
    function showBannerIfNeeded() {
        if (cmGetCookie('cookie_consent')) return; // already chose
        setTimeout(function () {
            var banner = document.getElementById('cookie-consent-banner');
            if (banner) banner.style.display = 'block';
        }, 1000);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBannerIfNeeded);
    } else {
        showBannerIfNeeded();
    }
})();

function acceptCookies() {
    document.cookie = "cookie_consent=accepted; max-age=31536000; path=/; SameSite=Lax";
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'analytics_storage': 'granted',
            'ad_storage': 'granted',
            'ad_user_data': 'granted',
            'ad_personalization': 'granted'
        });
    }
}

function declineCookies() {
    document.cookie = "cookie_consent=declined; max-age=31536000; path=/; SameSite=Lax";
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) banner.style.display = 'none';
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'analytics_storage': 'denied',
            'ad_storage': 'denied',
            'ad_user_data': 'denied',
            'ad_personalization': 'denied'
        });
    }
}

// ========================================================================
// 9. GLOSSARY ACCORDION — auto-open term when linked via URL hash
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
// 10. LAZY LOAD LEAFLET MAP (on scroll into viewport)
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

// ========================================================================
// 11. AFFILIATE ACTIVATION
// ------------------------------------------------------------------------
// js/affiliate.js could only tag links that were already marked
// data-affiliate="true" — and nothing on the site was. This global,
// capture-phase listener does two jobs on every product click:
//   1. persists the current ?ref= affiliate id as a 60-day cookie, and
//   2. rewrites the outbound href to carry ?ref=<id> BEFORE navigation.
// Delegated on document, so it also covers links injected later by
// conversion.js / app-render.js.
// ========================================================================
(function () {
    if (window.__cmAffiliateBound) return;
    window.__cmAffiliateBound = true;

    var REF_DAYS = 60;

    function readRef() {
        var m = document.cookie.match(/(?:^|;\s*)cm_ref=([^;]+)/);
        if (m) return decodeURIComponent(m[1]);
        try {
            var s = JSON.parse(localStorage.getItem('cm_ref') || 'null');
            if (s && Date.now() - s.ts < REF_DAYS * 864e5) return s.id;
        } catch (e) {}
        return null;
    }

    function writeRef(id) {
        var clean = String(id).replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 32);
        if (!clean) return null;
        var exp = new Date();
        exp.setDate(exp.getDate() + REF_DAYS);
        document.cookie = 'cm_ref=' + encodeURIComponent(clean) +
            '; expires=' + exp.toUTCString() + '; path=/; SameSite=Lax';
        try {
            localStorage.setItem('cm_ref', JSON.stringify({
                id: clean, ts: Date.now(), landing: location.pathname
            }));
        } catch (e) {}
        return clean;
    }

    // Capture ?ref= on landing (affiliate.js may not be loaded on this page).
    try {
        var incoming = new URLSearchParams(window.location.search).get('ref');
        if (incoming) writeRef(incoming);
    } catch (e) {}

    document.addEventListener('click', function (e) {
        var a = e.target && e.target.closest && e.target.closest('a[data-affiliate="true"]');
        if (!a) return;

        var ref = readRef();
        if (ref) {
            // Re-affirm the 60-day window on every affiliate interaction.
            writeRef(ref);
            try {
                var u = new URL(a.href, location.origin);
                if (!u.searchParams.get('ref')) {
                    u.searchParams.set('ref', ref);
                    a.href = u.toString();
                }
            } catch (err) {}
        }

        if (typeof gtag === 'function') {
            gtag('event', 'affiliate_click', {
                affiliate_id: ref || '(none)',
                product: a.getAttribute('data-product') || a.href,
                page: location.pathname
            });
        }
    }, true); // capture phase: runs before any stopPropagation() on the anchor
})();
