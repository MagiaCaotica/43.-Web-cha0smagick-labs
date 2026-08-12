/**
 * Cha0smagick Labs - Conversion Engine
 * Injects email capture, lead magnets, and sales CTAs into every page.
 * Goal: 1 visit → 1 sale. No dead ends.
 * Loads on blog articles, tools, app-details, and homepage.
 */
(function() {
  'use strict';

  /* ============================================================
   * CONFIG
   * ============================================================ */
  var CONFIG = {
    // MailerLite
    mlAccount: '2539880',
    mlFormEN: 'UOlyYH',   // EN lead magnet form
    mlFormES: 'I95d94',   // ES lead magnet form (not published yet)

    // Lead Magnet PDFs
    leadMagnetEN: '/lead-magnet/Quickstart-Guide-Chaos-Magick.pdf',
    leadMagnetES: '/lead-magnet/Guia-Rapida-Magia-Caos.pdf',

    // Play Store collection URL
    playStoreURL: 'https://play.google.com/store/apps/dev?id=7060930672313565766',

    // App categories for related suggestions
    appCategories: {
      divination: ['norse-rune-oracle', 'iching-oracle', 'unofficial-rider-waite-tarot', 'astral-lab'],
      sigils: ['chaos-sigil-generator', 'arcana-goetia'],
      psychic: ['psi-gym', 'dream-machine', 'lucid-dream'],
      astrology: ['astral-lab', 'lunar-phase-calculator'],
      goetia: ['arcana-goetia']
    },

    /* --- Measurement IDs -------------------------------------------------
     * ga4Id         : live GA4 measurement ID.
     * googleAdsId   : PLACEHOLDER. Conversions stay OFF until a real
     *                 "AW-XXXXXXXXX" is pasted here (see shared.js).
     * metaPixelId   : PLACEHOLDER. Meta business account is restricted until
     *                 2026-12-02, so no real Pixel ID exists yet. Paste the
     *                 numeric ID here and fbq() activates automatically.
     * -------------------------------------------------------------------- */
    ga4Id: 'G-V6LHCPN9TK',
    googleAdsId: 'PONER_AW_ID_AQUI',
    metaPixelId: 'PONER_META_PIXEL_ID_AQUI',

    // Email popup behaviour
    popupDelayMs: 30000,      // (a) 30s dwell
    popupScrollPct: 50,       // (a) or 50% scroll depth
    popupPages: ['homepage', 'blog', 'tools']
  };

  /* ============================================================
   * MEASUREMENT CORE
   * ------------------------------------------------------------
   * conversion.js is the ONLY script present on ~227 of the 281 pages
   * (blog articles load nothing else but the gtag library), so the
   * measurement bootstrap has to live here as well as in shared.js.
   * Every block below is idempotent via a window.__cm* flag, so pages
   * that load both files still initialise exactly once.
   * ============================================================ */

  function idIsReal(id, prefix) {
    if (!id || typeof id !== 'string') return false;
    if (id.indexOf('PONER_') === 0) return false;
    if (prefix && id.indexOf(prefix) !== 0) return false;
    return true;
  }

  function getCookie(name) {
    var m = document.cookie.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : null;
  }

  // Safe GA4 dispatch.
  function track(eventName, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', eventName, params || {});
    } catch (e) { /* analytics must never break the page */ }
  }

  /* --- GA4 bootstrap + consent -------------------------------------------
   * Two separate defects made most traffic invisible in GA4:
   *   1. Blog templates load gtag/js but never call gtag('js')/gtag('config'),
   *      so those ~190 article pages reported nothing at all.
   *   2. Pages that DO have the inline snippet declared consent 'default'
   *      as 'denied', which withholds hits until the user clicks Accept.
   * This function repairs both: it only creates the config when one is
   * genuinely missing (never duplicating an existing init), and it pushes a
   * consent update to 'granted' unless the visitor explicitly declined.
   * ---------------------------------------------------------------------- */
  function ensureGtag() {
    if (window.__cmGtagReady) return;
    window.__cmGtagReady = true;

    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== 'function') {
      window.gtag = function () { window.dataLayer.push(arguments); };
    }

    var configured = false;
    try {
      for (var i = 0; i < window.dataLayer.length; i++) {
        var row = window.dataLayer[i];
        if (row && row[0] === 'config' && row[1] === CONFIG.ga4Id) { configured = true; break; }
      }
    } catch (e) {}

    applyConsent(); // consent first, so the very first hit is already correct

    if (!configured) {
      window.gtag('js', new Date());
      window.gtag('config', CONFIG.ga4Id);
    }

    if (idIsReal(CONFIG.googleAdsId, 'AW-')) {
      window.gtag('config', CONFIG.googleAdsId);
    }
  }

  // Granted by default; denied only when the visitor opted out via the banner.
  function applyConsent() {
    if (typeof window.gtag !== 'function') return;
    var state = getCookie('cookie_consent') === 'declined' ? 'denied' : 'granted';
    window.gtag('consent', 'update', {
      'analytics_storage': state,
      'ad_storage': state,
      'ad_user_data': state,
      'ad_personalization': state
    });
  }

  /* --- Meta Pixel (inert until a real ID is supplied) --------------------- */
  function initMetaPixel() {
    if (window.__cmPixelReady) return;
    if (!idIsReal(CONFIG.metaPixelId)) return;
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

    fbq('init', CONFIG.metaPixelId);
    fbq('track', 'PageView');
  }

  /* --- UTM helper --------------------------------------------------------
   * Canonical implementation lives in shared.js; this guarded copy keeps
   * conversion.js self-sufficient on the pages that omit shared.js.
   * ---------------------------------------------------------------------- */
  function addUTM(url, campaign) {
    if (typeof window.addUTM === 'function' && window.addUTM !== addUTM) {
      return window.addUTM(url, campaign);
    }
    if (!url || typeof url !== 'string') return url;
    if (url.indexOf('utm_source=') !== -1) return url;
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
  if (typeof window.addUTM !== 'function') window.addUTM = addUTM;

  function priceNum(price) {
    if (!price) return 0;
    var m = String(price).match(/[\d.]+/);
    return m ? parseFloat(m[0]) : 0;
  }

  // Short page slug used to build readable utm_campaign values.
  function pageSlug() {
    var p = window.location.pathname.replace(/\.html?$/i, '').replace(/^\/+|\/+$/g, '');
    if (!p) return 'home';
    return p.split('/').pop().replace(/[^a-zA-Z0-9_\-]/g, '_').slice(0, 40) || 'home';
  }

  /* --- Attribute every outbound Play Store / Hotmart link ----------------
   * Covers links hard-coded in the HTML as well as anything injected later
   * (MutationObserver), so no CTA can ship without attribution.
   * ---------------------------------------------------------------------- */
  function tagOutboundLinks(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var links;
    try {
      links = scope.querySelectorAll('a[href*="play.google.com"], a[href*="hotmart.com"]');
    } catch (e) { return; }

    Array.prototype.forEach.call(links, function (a) {
      if (a.getAttribute('data-cm-tagged') === '1') return;
      a.setAttribute('data-cm-tagged', '1');

      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return;

      var campaign = pageSlug() + '_cta';
      var tagged = addUTM(href, campaign);
      if (tagged !== href) a.setAttribute('href', tagged);

      // Opt the link into the affiliate ?ref= system (shared.js listener).
      if (!a.hasAttribute('data-affiliate')) a.setAttribute('data-affiliate', 'true');
      if (!a.hasAttribute('data-product')) {
        var pid = (href.match(/[?&]id=([\w.]+)/) || [])[1] ||
                  (href.match(/hotmart\.com\/([A-Z0-9]+)/i) || [])[1] || '';
        if (pid) a.setAttribute('data-product', pid);
      }
    });
  }

  function watchForNewLinks() {
    if (window.__cmLinkObserver || typeof MutationObserver === 'undefined') return;
    var pending = null;
    window.__cmLinkObserver = new MutationObserver(function () {
      if (pending) return;                       // coalesce bursts
      pending = setTimeout(function () {
        pending = null;
        tagOutboundLinks(document);
      }, 250);
    });
    try {
      window.__cmLinkObserver.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }

  /* --- Affiliate activation ----------------------------------------------
   * Mirrors shared.js so pages without shared.js still persist ?ref=.
   * ---------------------------------------------------------------------- */
  function bindAffiliate() {
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

    try {
      var incoming = new URLSearchParams(window.location.search).get('ref');
      if (incoming) writeRef(incoming);
    } catch (e) {}

    // Capture phase so the cookie is written even when the anchor calls
    // stopPropagation() (several product cards do).
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[data-affiliate="true"]');
      if (!a) return;
      var ref = readRef();
      if (ref) {
        writeRef(ref); // refresh the 60-day window
        try {
          var u = new URL(a.href, location.origin);
          if (!u.searchParams.get('ref')) {
            u.searchParams.set('ref', ref);
            a.href = u.toString();
          }
        } catch (err) {}
      }
      track('affiliate_click', {
        affiliate_id: ref || '(none)',
        product: a.getAttribute('data-product') || a.href,
        page: location.pathname
      });
    }, true);
  }

  /* --- purchase_click ----------------------------------------------------
   * Guard is shared with app-render.js so the event fires exactly once even
   * when both scripts are on the page.
   * ---------------------------------------------------------------------- */
  function bindPurchaseTracking() {
    if (window.__cmPurchaseClickBound) return;
    window.__cmPurchaseClickBound = true;

    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var href = a.getAttribute('href') || '';
      var isPlay = href.indexOf('play.google.com') !== -1;
      var isHotmart = href.indexOf('hotmart.com') !== -1;
      if (!isPlay && !isHotmart) return;

      var productId = a.getAttribute('data-product') ||
        (href.match(/[?&]id=([\w.]+)/) || [])[1] ||
        (href.match(/hotmart\.com\/([A-Z0-9]+)/i) || [])[1] || 'unknown';

      var name = productId, price = 0, category = isHotmart ? 'book' : 'app';
      try {
        var pool = [].concat(getAppsData() || []).concat(getBooksData() || []);
        var found = pool.filter(function (p) {
          return p.id === productId ||
            (p.url && p.url.indexOf(productId) !== -1) ||
            (p.hotmartLink && p.hotmartLink.indexOf(productId) !== -1);
        })[0];
        if (found) {
          name = found.name;
          price = priceNum(found.price);
          category = found.type === 'book' ? 'book' : 'app';
        }
      } catch (err) {}

      var items = [{
        item_id: productId,
        item_name: name,
        item_category: category,
        item_brand: 'Cha0smagick Labs',
        price: price,
        currency: 'USD',
        quantity: 1
      }];

      track('purchase_click', {
        currency: 'USD',
        value: price,
        destination: isPlay ? 'google_play' : 'hotmart',
        link_url: href,
        page: location.pathname,
        items: items
      });
      track('begin_checkout', { currency: 'USD', value: price, items: items });

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: [productId], content_name: name,
          content_type: 'product', value: price, currency: 'USD'
        });
      }
    }, true);
  }

  /* --- form_submit (MailerLite lead capture) ------------------------------ */
  function bindFormTracking() {
    if (window.__cmFormBound) return;
    window.__cmFormBound = true;

    document.addEventListener('submit', function (e) {
      var form = e.target;
      if (!form || form.tagName !== 'FORM') return;

      var isML = !!(form.closest('.ml-embedded, .ml-form-embedContainer, .ml-form-embedWrapper')) ||
        /mailerlite/i.test(form.getAttribute('action') || '') ||
        !!form.querySelector('input[type="email"], input[name="fields[email]"]');
      if (!isML) return;

      var formId = (form.closest('.ml-embedded') || {}).dataset;
      track('form_submit', {
        form_id: (formId && formId.form) || CONFIG.mlFormEN,
        form_name: 'mailerlite_lead_magnet',
        form_destination: 'mailerlite',
        page: location.pathname,
        page_type: getPageType(),
        location: form.closest('#cm-email-popup') ? 'popup' : 'inline'
      });
      // GA4 recommended lead event — makes the conversion visible in reports.
      track('generate_lead', { currency: 'USD', value: 0, method: 'mailerlite' });

      if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
    }, true);
  }

  /* ============================================================
   * HELPERS
   * ============================================================ */

  // Detect page type
  function getPageType() {
    var path = window.location.pathname;

    // Check for language in path
    if (path.indexOf('/es/') === 0) return 'es-page';

    if (path.indexOf('/blog/') !== -1) return 'blog';
    if (path.indexOf('/tools/') !== -1) return 'tools';
    if (path.indexOf('/pages/app-details.html') !== -1) return 'app-details';
    if (path === '/' || path === '/index.html') return 'homepage';
    if (path.indexOf('/books/') !== -1) return 'books';

    return 'other';
  }

  // Detect if Spanish (checks html lang attr)
  function isSpanish() {
    return document.documentElement.lang &&
           document.documentElement.lang.indexOf('es') === 0;
  }

  // Get article main heading text for context
  function getArticleHeading() {
    var h1 = document.querySelector('article h1, .article h1, .blog-post h1');
    return h1 ? h1.textContent.trim() : '';
  }

  // Get apps data if available (from apps-data.js)
  function getAppsData() {
    return (typeof appsData !== 'undefined') ? appsData : null;
  }

  function getBooksData() {
    return (typeof booksData !== 'undefined') ? booksData : null;
  }

  // Build mailerLite Universal JS once
  function loadMailerLite() {
    if (window._mlLoaded) return;
    window._mlLoaded = true;

    // Check if ml function already exists
    if (typeof window.ml === 'function') return;

    /* BUGFIX: the previous snippet was called with only 4 arguments, so the
     * queue-stub name parameter was undefined and the stub was attached to
     * window["https://static.mailerlite.com/js/universal.js"] instead of
     * window.ml. The following `window.ml(...)` call therefore threw a
     * TypeError on every page, aborting run() — which silently killed the
     * lead-magnet form, the collection CTA and everything scheduled after it.
     * Passing 'ml' as the name argument (per MailerLite's official snippet)
     * restores the intended behaviour. */
    (function (w, d, e, u, f, l, n) {
      w[f] = w[f] || function () { (w[f].q = w[f].q || []).push(arguments); };
      l = d.createElement(e); l.async = 1;
      l.src = u + '?v=' + ~~(new Date().getTime() / 3600000);
      n = d.getElementsByTagName(e)[0];
      if (n && n.parentNode) n.parentNode.insertBefore(l, n);
      else d.head.appendChild(l);
    })(window, document, 'script', 'https://static.mailerlite.com/js/universal.js', 'ml');

    try { window.ml('account', CONFIG.mlAccount); } catch (e) { /* non-fatal */ }
  }

  // Insert HTML after an element
  function insertAfter(referenceNode, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    referenceNode.parentNode.insertBefore(fragment, referenceNode.nextSibling);
  }

  // Insert HTML before an element
  function insertBefore(referenceNode, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    var fragment = document.createDocumentFragment();
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild);
    }
    referenceNode.parentNode.insertBefore(fragment, referenceNode);
  }

  // Append HTML to element
  function appendHtml(element, html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    while (temp.firstChild) {
      element.appendChild(temp.firstChild);
    }
  }

  // Check if element exists
  function exists(selector) {
    return document.querySelector(selector) !== null;
  }

  // Get random items from array
  function getRandomItems(arr, n) {
    var shuffled = arr.slice();
    var i = arr.length;
    var temp, index;
    while (i--) {
      index = Math.floor(Math.random() * i);
      temp = shuffled[i];
      shuffled[i] = shuffled[index];
      shuffled[index] = temp;
    }
    return shuffled.slice(0, n);
  }

  /* ============================================================
   * INJECTORS
   * ============================================================ */

  // --- Lead Magnet Email Form ---
  function injectLeadMagnet(targetSelector, position) {
    position = position || 'after';
    var target = document.querySelector(targetSelector);
    if (!target) return;

    var lang = isSpanish();
    var headline = lang
      ? 'ðŸ”— Â¡ObtÃ©n Tu GuÃa RÃ¡pida de Magia del Caos GRATIS!'
      : 'ðŸ”— Get Your FREE Chaos Magick Quickstart Guide!';
    var subtext = lang
      ? 'Aprende tÃ©cnicas de sigilos, gnosis y servidores en este PDF de 10 pÃ¡ginas. Ingresa tu email y te lo envÃ­o al instante.'
      : 'Learn sigil techniques, gnosis states & servitor creation in this 10-page PDF. Enter your email and I\'ll send it instantly.';
    var btnText = lang ? 'Enviar mi GuÃ­a Gratis â†”' : 'Send My Free Guide â†”';
    var formSlug = lang ? CONFIG.mlFormES : CONFIG.mlFormEN;
    var privacyText = lang
      ? 'Sin spam. Puedes darte de baja cuando quieras.'
      : 'No spam. Unsubscribe anytime.';

    // Don't inject if form already present on page
    if (document.querySelector('.ml-embedded[data-form="' + formSlug + '"]')) return;
    if (document.getElementById('cm-cta-lead-magnet')) return;

    var html = '\
<section id="cm-cta-lead-magnet" class="cm-section cm-lead-section">\
  <div class="cm-lead-inner">\
    <div class="cm-lead-content">\
      <h3 class="cm-lead-headline">' + headline + '</h3>\
      <p class="cm-lead-subtext">' + subtext + '</p>\
      <div class="ml-embedded" data-form="' + formSlug + '"></div>\
      <p class="cm-lead-privacy">' + privacyText + '</p>\
    </div>\
  </div>\
</section>';

    if (position === 'after') {
      insertAfter(target, html);
    } else {
      insertBefore(target, html);
    }

    // Load MailerLite universal JS
    loadMailerLite();
  }

  // --- Complete Collection CTA ---
  function injectCollectionCTA(targetSelector, position) {
    position = position || 'after';
    var target = document.querySelector(targetSelector);
    if (!target) return;
    if (document.getElementById('cm-cta-collection')) return;

    var lang = isSpanish();
    var headline = lang
      ? 'âœ¨ La ColecciÃ³n Completa de Magia del Caos'
      : 'âœ¨ The Complete Occult Collection';
    var text = lang
      ? '11 Apps Android premium + 7 Libros PDF. Todo lo que necesitas para tu prÃ¡ctica de Magia del Caos, en un solo ecosistema. 100% offline, sin suscripciones.'
      : '11 Android apps + 7 PDF books. Everything for your Chaos Magick practice in one complete ecosystem. 100% offline, no subscriptions.';
    var cta = lang
      ? 'Ver Todos los Productos â†”'
      : 'Browse All Products â†”';

    var html = '\
<section id="cm-cta-collection" class="cm-section cm-collection-section">\
  <div class="cm-collection-inner">\
    <h3 class="cm-collection-headline">' + headline + '</h3>\
    <p class="cm-collection-text">' + text + '</p>\
    <div class="cm-collection-stats">\
      <div class="cm-stat">\
        <span class="cm-stat-num">11</span>\
        <span class="cm-stat-label">Android Apps</span>\
      </div>\
      <div class="cm-stat">\
        <span class="cm-stat-num">7</span>\
        <span class="cm-stat-label">PDF Books</span>\
      </div>\
      <div class="cm-stat">\
        <span class="cm-stat-num">4.7 â˜…</span>\
        <span class="cm-stat-label">128+ Reviews</span>\
      </div>\
    </div>\
    <a href="/#products" class="cm-collection-btn">' + cta + '</a>\
  </div>\
</section>';

    if (position === 'after') {
      insertAfter(target, html);
    } else {
      insertBefore(target, html);
    }
  }

  // --- App-Specific Promotion (for tools pages) ---
  function injectToolUpgradeCTA(toolName, appUrl, appPrice) {
    appPrice = appPrice || '$4.99';
    if (document.getElementById('cm-cta-tool-upgrade')) return;

    var target = document.querySelector('.tool-container, #results, main > div:last-child, .features, main');
    if (!target) {
      target = document.querySelector('.blog-post, article') || document.body;
    }

    // Find the last child that's a div or main content
    var insertPoint = target;
    if (target === document.body) {
      insertPoint = document.querySelector('footer');
      if (!insertPoint) insertPoint = document.body;
    }

    var html = '\
<section id="cm-cta-tool-upgrade" class="cm-section cm-tool-cta">\
  <div class="cm-tool-cta-inner">\
    <h3>' + (isSpanish() ? 'Â¿Te gusta esta herramienta?' : 'Love this tool?') + '</h3>\
    <p>' + (isSpanish()
      ? 'ObtÃ©n la app premium de ' + toolName + ' en Google Play. Sin anuncios, sin rastreo, 100% offline.'
      : 'Get the premium ' + toolName + ' app on Google Play. No ads, no tracking, 100% offline.') + '</p>\
    <div class="cm-tool-cta-btns">\
      <a href="' + appUrl + '" class="cm-btn cm-btn-primary" target="_blank">\
        <svg class="cm-play-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 0 1 0 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>\
        ' + (isSpanish() ? 'COMPRAR EN PLAY STORE' : 'GET IT ON PLAY STORE') + '\
      </a>\
    </div>\
    <p class="cm-tool-price">' + (isSpanish() ? 'Solo ' : 'Just ') + appPrice + ' â€” ' + (isSpanish() ? 'pago Ãºnico' : 'one-time payment') + '</p>\
  </div>\
</section>';

    if (insertPoint === target) {
      appendHtml(target, html);
    } else {
      insertBefore(insertPoint, html);
    }
    loadMailerLite();
  }

  // --- Social Share Buttons (X · Pinterest · WhatsApp · Facebook) ---
  // Prefers an existing .share-buttons container (97 blog templates already
  // ship an empty one); otherwise a row is created at the TOP of the article,
  // where share intent is highest. Guarded by window.__cmShareInjected, the
  // same flag app-render.js uses, so only one row can ever exist.
  function injectShareButtons() {
    if (window.__cmShareInjected) return;
    if (document.getElementById('cm-social-share')) return;

    var article = document.querySelector('article.article, .blog-post, article');
    if (!article) return;

    var rawUrl = window.location.href;
    var rawTitle = document.title;
    var url = encodeURIComponent(rawUrl);
    var title = encodeURIComponent(rawTitle);
    var description = encodeURIComponent(
      (document.querySelector('meta[name="description"]') || {}).content || rawTitle
    );

    var ICONS = {
      x: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
      pinterest: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0a12 12 0 0 0-4.36 23.17c-.1-.79-.2-2.02.04-2.89.22-.79 1.4-5.69 1.4-5.69s-.36-.72-.36-1.78c0-1.67.97-2.92 2.18-2.92 1.03 0 1.53.77 1.53 1.7 0 1.03-.66 2.58-1 4.01-.28 1.2.6 2.18 1.78 2.18 2.14 0 3.78-2.25 3.78-5.5 0-2.88-2.07-4.89-5.02-4.89-3.42 0-5.43 2.56-5.43 5.22 0 1.03.4 2.14.89 2.74a.36.36 0 0 1 .08.34l-.33 1.35c-.05.22-.17.27-.4.16-1.5-.7-2.44-2.88-2.44-4.64 0-3.78 2.74-7.25 7.92-7.25 4.15 0 7.38 2.96 7.38 6.92 0 4.13-2.6 7.45-6.22 7.45-1.21 0-2.35-.63-2.74-1.38l-.75 2.85c-.27 1.04-1 2.35-1.49 3.14A12 12 0 1 0 12 0z"/></svg>',
      whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.99 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.887 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a12.02 12.02 0 0 0 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/></svg>',
      facebook: '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.925 23.094 9.101 24v-8.437H6.627v-3.49h2.474V9.9c0-3.476 2.06-5.398 5.22-5.398 1.512 0 3.093.271 3.093.271v3.42h-1.743c-1.717 0-2.252 1.072-2.252 2.171v2.607h3.833l-.612 3.49h-3.22V24C20.075 23.094 24 18.1 24 12.073"/></svg>'
    };

    // window.open target URLs (600x500 popup, wired below)
    var NETS = [
      { key: 'x', label: 'X', cls: 'cm-social-x', href: 'https://twitter.com/intent/tweet?text=' + title + '&url=' + url },
      { key: 'pinterest', label: 'Pinterest', cls: 'cm-social-pin', href: 'https://pinterest.com/pin/create/button/?url=' + url + '&description=' + description },
      { key: 'whatsapp', label: 'WhatsApp', cls: 'cm-social-wa', href: 'https://wa.me/?text=' + encodeURIComponent(rawTitle + ' ' + rawUrl) },
      { key: 'facebook', label: 'Facebook', cls: 'cm-social-fb', href: 'https://www.facebook.com/sharer/sharer.php?u=' + url }
    ];

    var buttons = NETS.map(function (n) {
      return '<a href="' + n.href + '" target="_blank" rel="noopener" ' +
        'data-cm-share="' + n.key + '" class="cm-social-btn ' + n.cls + '" ' +
        'aria-label="Share on ' + n.label + '">' + ICONS[n.key] +
        '<span>' + n.label + '</span></a>';
    }).join('');

    var label = isSpanish() ? 'Comparte este art\u00EDculo:' : 'Share this article:';

    /* Reuse the container the blog templates already render.
     * 85 of the 225 article templates ship a .share-buttons div that is
     * ALREADY populated with plain <a> links (Twitter/Facebook/Reddit/
     * Pinterest). Appending a second row there would duplicate the widget,
     * so instead we upgrade what is there — wire the existing anchors to the
     * 600x500 popup + GA4 tracking — and only add the networks that are
     * genuinely missing. */
    var host = document.querySelector('.share-buttons');
    if (host) {
      window.__cmShareInjected = true;
      host.id = host.id || 'cm-social-share';

      var existing = host.querySelectorAll('a[href]');
      if (existing.length) {
        // Upgrade in place.
        Array.prototype.forEach.call(existing, function (a) {
          if (a.hasAttribute('data-cm-share')) return;
          var h = a.getAttribute('href') || '';
          var key = /twitter\.com|\/\/x\.com/.test(h) ? 'x'
                  : /pinterest\./.test(h) ? 'pinterest'
                  : /wa\.me|whatsapp/.test(h) ? 'whatsapp'
                  : /facebook\.com/.test(h) ? 'facebook'
                  : /reddit\.com/.test(h) ? 'reddit'
                  : 'other';
          a.setAttribute('data-cm-share', key);
        });

        // Add any of our four networks that the template omitted.
        var present = {};
        Array.prototype.forEach.call(host.querySelectorAll('a[data-cm-share]'), function (a) {
          present[a.getAttribute('data-cm-share')] = true;
        });
        var missing = NETS.filter(function (n) { return !present[n.key]; });
        if (missing.length) {
          host.insertAdjacentHTML('beforeend', missing.map(function (n) {
            return '<a href="' + n.href + '" target="_blank" rel="noopener" ' +
              'data-cm-share="' + n.key + '" class="cm-social-btn ' + n.cls + '" ' +
              'aria-label="Share on ' + n.label + '">' + ICONS[n.key] +
              '<span>' + n.label + '</span></a>';
          }).join(''));
        }
      } else {
        // Empty container — fill it.
        host.insertAdjacentHTML('beforeend',
          '<span class="cm-social-label">' + label + '</span>' +
          '<div class="cm-social-buttons">' + buttons + '</div>');
      }

      bindShareClicks(host);
      return;
    }

    window.__cmShareInjected = true;
    var html = '\
<section id="cm-social-share" class="cm-section cm-social-section">\
  <div class="cm-social-inner">\
    <span class="cm-social-label">' + label + '</span>\
    <div class="cm-social-buttons">' + buttons + '</div>\
  </div>\
</section>';

    // Top of the article — highest share intent.
    var heading = article.querySelector('h1');
    if (heading) {
      insertAfter(heading, html);
    } else {
      article.insertAdjacentHTML('afterbegin', html);
    }
    bindShareClicks(document.getElementById('cm-social-share'));
  }

  // Opens the network in a 600x500 popup instead of a new tab, and reports
  // a GA4 `share` event.
  function bindShareClicks(scope) {
    if (!scope) return;
    scope.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-cm-share]');
      if (!a) return;
      e.preventDefault();
      window.open(a.href, 'cm_share_win', 'width=600,height=500,noopener,scrollbars=yes,resizable=yes');
      track('share', {
        method: a.getAttribute('data-cm-share'),
        content_type: getPageType(),
        item_id: location.pathname
      });
    });
  }

  function injectTestimonials() {
    if (document.getElementById('cm-testimonials')) return;

    var article = document.querySelector('article.article, .blog-post, article');
    if (!article) return;

    // Aggregate stats from our Play Store presence
    var html = '\
<section id="cm-testimonials" class="cm-section cm-testimonials-section">\
  <h3 class="cm-testimonials-heading">' + (isSpanish() ? 'Lo Que Dicen Nuestros Usuarios' : 'What Our Users Say') + '</h3>\
  <div class="cm-testimonials-stats">\
    <div class="cm-tstat">\
      <span class="cm-tstat-num">4.7</span>\
      <span class="cm-tstat-label">' + (isSpanish() ? 'Estrellas' : 'Stars') + '</span>\
      <div class="cm-tstat-stars">\
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>\
      </div>\
    </div>\
    <div class="cm-tstat-sep"></div>\
    <div class="cm-tstat">\
      <span class="cm-tstat-num">128+</span>\
      <span class="cm-tstat-label">' + (isSpanish() ? 'Rese\u00F1as' : 'Reviews') + '</span>\
      <span class="cm-tstat-sub">' + (isSpanish() ? 'En Google Play' : 'Across Google Play') + '</span>\
    </div>\
    <div class="cm-tstat-sep"></div>\
    <div class="cm-tstat">\
      <span class="cm-tstat-num">11</span>\
      <span class="cm-tstat-label">' + (isSpanish() ? 'Apps' : 'Apps') + '</span>\
      <span class="cm-tstat-sub">' + (isSpanish() ? 'Premium sin publicidad' : 'Premium Ad-Free') + '</span>\
    </div>\
  </div>\
  <div class="cm-guarantee-badge" style="background:#151515;border:1px solid #c9a84c;border-radius:8px;padding:16px 20px;text-align:center;margin-top:16px">\
    <span style="color:#c9a84c;font-weight:600;font-size:1.05em">🛡️ ' + (isSpanish() ? 'Garant\u00EDa de Reembolso de 7 D\u00EDas' : '7-Day Money-Back Guarantee') + '</span>\
    <p style="color:#bbb;margin:6px 0 0;font-size:0.9em">' + (isSpanish() ? 'Si no quedas satisfecho, te devolvemos tu dinero. Sin preguntas. Compra con confianza.' : 'Not satisfied? Get a full refund. No questions asked. Buy with confidence.') + '</p>\
  </div>\
  <div class="cm-testimonials-cta" style="margin-top:12px">\
    <a href="/" class="cm-collection-btn">' + (isSpanish() ? 'Ver la Colecci\u00F3n Completa' : 'View the Complete Collection') + '</a>\
  </div>\
</section>';

    insertBefore(document.querySelector('footer'), html);
  }

  // --- Community CTA (Discord + Telegram) ---
  function injectCommunityCTA() {
    if (document.getElementById('cm-community-cta')) return;

    var html = '\
<section id="cm-community-cta" class="cm-section cm-community-section">\
  <div class="cm-community-inner">\
    <h3 class="cm-community-heading">' + (isSpanish() ? '\u00DAnete a la Comunidad' : 'Join the Community') + '</h3>\
    <p class="cm-community-desc">' + (isSpanish() ? 'Conecta con otros practicantes de magia del caos, comparte experiencias y recibe contenido exclusivo.' : 'Connect with fellow chaos magick practitioners, share experiences, and get exclusive content.') + '</p>\
    <div class="cm-community-buttons">\
      <a href="https://t.me/cha0smagicklabs" target="_blank" rel="noopener" class="cm-community-btn cm-community-telegram" aria-label="Join Telegram">\
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>\
        <span>Telegram</span>\
      </a>\
      <a href="https://t.me/+krfQJgro4hBkNTE5" target="_blank" rel="noopener" class="cm-community-btn cm-community-telegram-group" aria-label="Join Telegram Group">\
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>\
        <span>' + (isSpanish() ? 'Grupo' : 'Group') + '</span>\
      </a>\
      <a href="https://discord.gg/PSfn26xqgD" target="_blank" rel="noopener" class="cm-community-btn cm-community-discord" aria-label="Join Discord">\
        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.1776-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>\
        <span>Discord</span>\
      </a>\
    </div>\
  </div>\
</section>';

    insertBefore(document.querySelector('footer'), html);
  }

  function injectRelatedApps() {
    if (document.getElementById('cm-related-apps')) return;

    var target = document.querySelector('footer');
    if (!target) {
      target = document.querySelector('.blog-post, article');
    }
    if (!target) return;

    var apps = getAppsData();
    if (!apps) return;

    var related = [];
    appsList.forEach(function(id) {
      var app = apps.find(function(a) { return a.id === id; });
      if (app) related.push(app);
    });

    if (related.length === 0) {
      // Fallback: show 3 random apps
      related = getRandomItems(apps, 3);
    }

    if (related.length === 0) return;

    var itemsHtml = related.map(function(app) {
      var price = app.price ? app.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '$4.99';
      var imgSrc = app.image ? app.image.replace(/\.webp$/i, '.png') : '';
      return '\
<div class="cm-app-card">\
  <a href="/apps/' + app.id + '.html" class="cm-app-card-link">\
    <div class="cm-app-card-img-wrap">\
      <img src="' + imgSrc + '" alt="' + app.name + '" loading="lazy" width="80" height="80">\
    </div>\
    <div class="cm-app-card-body">\
      <h4>' + app.name + '</h4>\
      <p>' + app.shortDescription + '</p>\
      <span class="cm-app-price">' + price + '</span>\
    </div>\
  </a>\
</div>';
    }).join('');

    var heading = isSpanish() ? 'Apps Relacionadas' : 'You Might Also Like';

    var html = '\
<section id="cm-related-apps" class="cm-section cm-related-section">\
  <h3 class="cm-related-heading">' + heading + '</h3>\
  <div class="cm-related-grid">' + itemsHtml + '</div>\
</section>';

    insertBefore(target, html);
  }

  /* ============================================================
   * EMAIL CAPTURE POPUP + EXIT INTENT
   * ------------------------------------------------------------
   * Triggers (whichever fires first):
   *   (a) 30s dwell  OR  50% scroll depth
   *   (b) exit-intent — pointer leaves through the top of the viewport
   *       (desktop only; mobile has no equivalent gesture)
   * Shown at most once per session (sessionStorage) and never again once
   * the visitor subscribes or dismisses it.
   * ============================================================ */

  var SESSION_KEY = 'cm_popup_shown_v1';

  function popupAlreadySeen() {
    try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch (e) { return false; }
  }

  function markPopupSeen() {
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch (e) {}
  }

  function isDesktop() {
    return window.matchMedia ? window.matchMedia('(min-width: 1024px)').matches
                             : window.innerWidth >= 1024;
  }

  function buildPopup() {
    // index.html ships an empty #exit-intent-popup placeholder; reuse it when
    // present, otherwise create our own host element.
    var host = document.getElementById('exit-intent-popup');
    if (!host) {
      host = document.createElement('div');
      host.id = 'exit-intent-popup';
      document.body.appendChild(host);
    }

    var lang = isSpanish();
    var formSlug = lang ? CONFIG.mlFormES : CONFIG.mlFormEN;

    host.setAttribute('aria-hidden', 'true');
    host.innerHTML = '\
<div id="cm-email-popup" class="cm-popup-overlay" role="dialog" aria-modal="true" aria-labelledby="cm-popup-title">\
  <div class="cm-popup-box">\
    <button type="button" class="cm-popup-close" aria-label="' + (lang ? 'Cerrar' : 'Close') + '">&times;</button>\
    <h3 id="cm-popup-title" class="cm-popup-title">' +
      (lang ? '\u00A1Espera! Ll\u00E9vate la Gu\u00EDa Gratis' : 'Wait — Grab the Free Guide') + '</h3>\
    <p class="cm-popup-text">' +
      (lang
        ? 'Gu\u00EDa R\u00E1pida de Magia del Caos: 10 p\u00E1ginas sobre sigilos, gnosis y servidores. Gratis, al instante.'
        : 'Chaos Magick Quickstart: a 10-page PDF on sigils, gnosis states & servitors. Free, delivered instantly.') + '</p>\
    <div class="ml-embedded" data-form="' + formSlug + '"></div>\
    <p class="cm-popup-privacy">' +
      (lang ? 'Sin spam. Cancela cuando quieras.' : 'No spam. Unsubscribe anytime.') + '</p>\
  </div>\
</div>';

    loadMailerLite();

    var overlay = host.querySelector('#cm-email-popup');
    var closeBtn = host.querySelector('.cm-popup-close');

    function close(reason) {
      host.style.display = 'none';
      host.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      track('popup_close', { reason: reason || 'button', page: location.pathname });
    }

    closeBtn.addEventListener('click', function () { close('button'); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close('overlay');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && host.style.display === 'block') close('escape');
    });

    return host;
  }

  function showPopup(trigger) {
    if (popupAlreadySeen()) return;
    markPopupSeen();

    // Build on first show; reuse the same host on any later call.
    var host = document.getElementById('cm-email-popup')
      ? document.getElementById('exit-intent-popup')
      : buildPopup();
    if (!host) return;

    host.style.display = 'block';
    host.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    track('popup_view', { trigger: trigger, page: location.pathname, page_type: getPageType() });
  }

  function initEmailPopup() {
    if (window.__cmPopupBound) return;
    if (CONFIG.popupPages.indexOf(getPageType()) === -1) return; // home/blog/tools only
    if (popupAlreadySeen()) return;
    window.__cmPopupBound = true;

    var fired = false;
    function fire(trigger) {
      if (fired) return;
      fired = true;
      showPopup(trigger);
    }

    // (a1) dwell timer
    var timer = setTimeout(function () { fire('timer_30s'); }, CONFIG.popupDelayMs);

    // (a2) scroll depth
    function onScroll() {
      var doc = document.documentElement;
      var scrollable = (doc.scrollHeight - window.innerHeight);
      if (scrollable <= 0) return;
      var pct = (window.scrollY / scrollable) * 100;
      if (pct >= CONFIG.popupScrollPct) {
        window.removeEventListener('scroll', onScroll);
        fire('scroll_50pct');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    // (b) exit intent — desktop only
    if (isDesktop()) {
      document.addEventListener('mouseout', function (e) {
        if (fired) return;
        if (e.relatedTarget || e.toElement) return;   // still inside the page
        if (e.clientY > 10) return;                   // must exit via the top
        fire('exit_intent');
      });
    }

    // Stop the timer once the popup has been shown by another trigger.
    var stopper = setInterval(function () {
      if (fired) { clearTimeout(timer); clearInterval(stopper); }
    }, 1000);
  }

  /* ============================================================
   * ROUTER - Run appropriate injections per page type
   * ============================================================ */

  function run() {
    var pageType = getPageType();

    // Never run on admin/payment pages
    if (pageType === 'other') return;

    switch (pageType) {

      case 'blog': {
        // 1. Social share buttons at top of article
        injectShareButtons();

        // 2. Testimonials section
        injectTestimonials();

        // 3. Community CTA (Telegram + Discord)
        injectCommunityCTA();

        // 3. Lead magnet email form at article bottom (before footer)
        var articleEl = document.querySelector('article.article');
        if (!articleEl) {
          articleEl = document.querySelector('.blog-post');
        }
        if (articleEl) {
          injectLeadMagnet('article.article, .blog-post');
        }

        // 4. Collection CTA after lead magnet
        // (will be injected after the lead section loads)
        // We schedule this after a short delay to ensure lead section is in DOM
        setTimeout(function() {
          var leadSection = document.getElementById('cm-cta-lead-magnet');
          if (leadSection) {
            injectCollectionCTA('#cm-cta-lead-magnet');
          } else {
            // fallback: inject before footer
            var footer = document.querySelector('footer');
            if (footer) injectCollectionCTA('footer', 'before');
          }
        }, 100);

        break;
      }

      case 'tools': {
        // Check if it's tool index or a specific tool page
        var isToolPage = !window.location.pathname.endsWith('/tools/') &&
                         !window.location.pathname.endsWith('/tools/index.html');

        if (isToolPage) {
          // Determine which app to promote based on tool name
          var path = window.location.pathname.toLowerCase();
          var toolAppMap = {
            'sigil': { name: 'Magick Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'rune': { name: 'Norse Rune Oracle', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.norone', price: '$4.99' },
            'iching': { name: 'I Ching Oracle', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.iching', price: '$4.99' },
            'candle': { name: 'Lunar Phase Calculator', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.lunar', price: '$3.99' },
            'lunar': { name: 'Lunar Phase Calculator', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.lunar', price: '$3.99' },
            'astrology': { name: 'Astral Lab', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.astrallab', price: '$4.99' },
            'pendulum': { name: 'PSI GYM', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.psigym', price: '$4.99' },
            'spell': { name: 'Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'tengwar': { name: 'Chaos Sigil Generator', url: 'https://play.google.com/store/apps/details?id=com.chaosmagick.sigilgenerator', price: '$4.99' },
            'servidor': { name: 'Arcana Goetia', url: 'https://play.google.com/store/apps/details?id=com.cha0smagick.goetia', price: '$4.99' }
          };

          var matched = null;
          for (var key in toolAppMap) {
            if (path.indexOf(key) !== -1) {
              matched = toolAppMap[key];
              break;
            }
          }

          if (matched) {
            // Inject upgrade CTA after tool results
            injectToolUpgradeCTA(matched.name, matched.url, matched.price);
          } else {
            // Generic tool CTA
            var apps = getAppsData();
            if (apps && apps.length > 0) {
              var randomApp = apps[Math.floor(Math.random() * apps.length)];
              var price = randomApp.price ? randomApp.price.replace(/\sUSD.*$/, '').replace(/\(.*?\)/, '').trim() : '$4.99';
              injectToolUpgradeCTA(randomApp.name, randomApp.url, price);
            }
          }
        } else {
          // Tools index page - inject lead magnet at bottom
          var toolsFooter = document.querySelector('footer');
          if (toolsFooter) {
            injectLeadMagnet('footer', 'before');
          }
        }
        // Also inject lead magnet on tool pages
        if (isToolPage) {
          var toolContent = document.querySelector('.tool-container, .blog-post, article, main');
          if (toolContent) {
            injectLeadMagnet('footer', 'before');
          }
        }
        break;
      }

      case 'app-details': {
        // Share row on product pages too (guarded — app-render.js may own it)
        injectShareButtons();

        // Wait for app-render to finish rendering
        var checkRender = setInterval(function() {
          var detailInfo = document.getElementById('app-detailed-info');
          var alsoLike = document.querySelector('.also-like-grid');
          if (detailInfo || alsoLike) {
            clearInterval(checkRender);

            // Inject lead magnet after app details but before "You May Also Like"
            if (detailInfo) {
              injectLeadMagnet('#app-detailed-info');
            }

            // Inject collection CTA after lead magnet
            setTimeout(function() {
              var leadSection = document.getElementById('cm-cta-lead-magnet');
              if (leadSection) {
                injectCollectionCTA('#cm-cta-lead-magnet');
              } else if (detailInfo) {
                injectCollectionCTA('#app-detailed-info');
              }
            }, 200);
          }
        }, 300);

        // Timeout after 10 seconds
        setTimeout(function() { clearInterval(checkRender); }, 10000);

        // Also fix noindex tag on app-details (should be indexable)
        var metaRobots = document.querySelector('meta[name="robots"]');
        if (metaRobots && metaRobots.getAttribute('content') === 'noindex, follow') {
          metaRobots.setAttribute('content', 'index, follow');
        }
        break;
      }

      case 'books': {
        // Share row on book sales pages
        injectShareButtons();

        // Book pages - inject lead magnet + collection CTA
        var bookFooter = document.querySelector('footer');
        var bookContent = document.querySelector('.blog-post, article, main');
        if (bookContent) {
          injectLeadMagnet('footer', 'before');
          setTimeout(function() {
            var leadSection = document.getElementById('cm-cta-lead-magnet');
            if (leadSection) {
              injectCollectionCTA('#cm-cta-lead-magnet');
            } else if (bookContent) {
              injectCollectionCTA('footer', 'before');
            }
          }, 100);
        }
        break;
      }

      case 'homepage': {
        // Homepage already has email form in hero
        // Add collection value section below apps (if not already there)
        break;
      }

      default: {
        // Generic: inject on any unrecognized page with article-like content
        var genericArticle = document.querySelector('.blog-post, article');
        if (genericArticle) {
          injectLeadMagnet('footer', 'before');
        }
        break;
      }
    }
  }

  /* ============================================================
   * CSS STYLES (injected once)
   * ============================================================ */

  function injectStyles() {
    if (document.getElementById('cm-styles')) return;

    var css = '\
<style id="cm-styles">\
.cm-section {\
  max-width: 800px;\
  margin: 2rem auto;\
  padding: 0 1rem;\
}\
\
/* Lead Magnet Section */\
.cm-lead-section {\
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);\
  border: 1px solid #c0a060;\
  border-radius: 12px;\
  padding: 2rem;\
  margin: 2.5rem auto;\
  text-align: center;\
}\
.cm-lead-headline {\
  color: #ffd700;\
  font-size: 1.4rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-lead-subtext {\
  color: #ccc;\
  font-size: 0.95rem;\
  line-height: 1.6;\
  margin-bottom: 1.2rem;\
}\
.cm-lead-privacy {\
  color: #666;\
  font-size: 0.75rem;\
  margin-top: 0.8rem;\
}\
\
/* Collection Section */\
.cm-collection-section {\
  background: #0a0a0a;\
  border: 1px solid #333;\
  border-radius: 12px;\
  padding: 2rem;\
  text-align: center;\
}\
.cm-collection-headline {\
  color: #c0a060;\
  font-size: 1.3rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-collection-text {\
  color: #a0a0a0;\
  font-size: 0.95rem;\
  line-height: 1.6;\
  max-width: 600px;\
  margin: 0 auto 1.5rem;\
}\
.cm-collection-stats {\
  display: flex;\
  justify-content: center;\
  gap: 2rem;\
  margin-bottom: 1.5rem;\
  flex-wrap: wrap;\
}\
.cm-stat {\
  text-align: center;\
}\
.cm-stat-num {\
  display: block;\
  font-size: 1.8rem;\
  font-weight: 700;\
  color: #c0a060;\
  font-family: "JetBrains Mono", Consolas, monospace;\
}\
.cm-stat-label {\
  display: block;\
  font-size: 0.75rem;\
  color: #888;\
  text-transform: uppercase;\
  letter-spacing: 1px;\
}\
.cm-collection-btn {\
  display: inline-block;\
  padding: 0.8rem 2rem;\
  background: #c0a060;\
  color: #000 !important;\
  text-decoration: none;\
  border-radius: 6px;\
  font-weight: 700;\
  font-size: 0.9rem;\
  transition: background 0.3s;\
}\
.cm-collection-btn:hover {\
  background: #ffd700;\
}\
\
/* Tool Upgrade CTA */\
.cm-tool-cta {\
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);\
  border: 1px solid #c0a060;\
  border-radius: 12px;\
  padding: 2rem;\
  margin: 2rem auto;\
  text-align: center;\
}\
.cm-tool-cta h3 {\
  color: #ffd700;\
  font-size: 1.3rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 0.8rem;\
}\
.cm-tool-cta p {\
  color: #ccc;\
  font-size: 0.95rem;\
  margin-bottom: 1.2rem;\
}\
.cm-tool-cta-btns {\
  margin-bottom: 0.5rem;\
}\
.cm-btn {\
  display: inline-flex;\
  align-items: center;\
  gap: 0.5rem;\
  padding: 0.8rem 1.8rem;\
  border-radius: 6px;\
  text-decoration: none;\
  font-weight: 700;\
  font-size: 0.85rem;\
  transition: all 0.3s;\
}\
.cm-btn-primary {\
  background: #c0a060;\
  color: #000 !important;\
}\
.cm-btn-primary:hover {\
  background: #ffd700;\
}\
.cm-play-icon {\
  width: 20px;\
  height: 20px;\
}\
.cm-tool-price {\
  color: #888;\
  font-size: 0.85rem;\
  font-style: italic;\
}\
\
/* Related Apps */\
.cm-related-section {\
  margin: 3rem auto;\
}\
.cm-related-heading {\
  color: #c0a060;\
  font-size: 1.2rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  text-align: center;\
  margin-bottom: 1.5rem;\
}\
.cm-related-grid {\
  display: grid;\
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\
  gap: 1rem;\
}\
.cm-app-card {\
  background: #0a0a0a;\
  border: 1px solid #1a1a1a;\
  border-radius: 8px;\
  overflow: hidden;\
  transition: border-color 0.3s;\
}\
.cm-app-card:hover {\
  border-color: #c0a060;\
}\
.cm-app-card-link {\
  display: flex;\
  gap: 1rem;\
  padding: 1rem;\
  text-decoration: none;\
  color: inherit;\
}\
.cm-app-card-img-wrap {\
  flex-shrink: 0;\
}\
.cm-app-card-img-wrap img {\
  width: 80px;\
  height: 80px;\
  border-radius: 8px;\
}\
.cm-app-card-body h4 {\
  color: #ffd700;\
  font-size: 0.95rem;\
  font-weight: 500;\
  margin-bottom: 0.3rem;\
}\
.cm-app-card-body p {\
  color: #999;\
  font-size: 0.8rem;\
  line-height: 1.4;\
  margin-bottom: 0.3rem;\
}\
.cm-app-price {\
  color: #c0a060;\
  font-size: 0.85rem;\
  font-weight: 700;\
}\
\
/* Social Share */\
.cm-social-section {\
  margin: 2rem auto;\
  padding: 1rem 0;\
}\
.cm-social-inner {\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  gap: 1rem;\
  flex-wrap: wrap;\
}\
.cm-social-label {\
  color: #888;\
  font-size: 0.85rem;\
  text-transform: uppercase;\
  letter-spacing: 1px;\
}\
.cm-social-buttons {\
  display: flex;\
  gap: 0.5rem;\
}\
.cm-social-btn {\
  display: inline-flex;\
  align-items: center;\
  gap: 0.4rem;\
  padding: 0.5rem 1rem;\
  border-radius: 6px;\
  text-decoration: none;\
  font-size: 0.8rem;\
  font-weight: 600;\
  transition: all 0.3s;\
}\
.cm-social-x {\
  background: #1a1a1a;\
  color: #fff !important;\
  border: 1px solid #333;\
}\
.cm-social-x:hover {\
  background: #333;\
  border-color: #555;\
}\
.cm-social-pin {\
  background: #bd081c;\
  color: #fff !important;\
}\
.cm-social-pin:hover {\
  background: #9a0715;\
}\
.cm-social-wa {\
  background: #25D366;\
  color: #062512 !important;\
}\
.cm-social-wa:hover {\
  background: #1da851;\
}\
.cm-social-fb {\
  background: #1877F2;\
  color: #fff !important;\
}\
.cm-social-fb:hover {\
  background: #0f5fc4;\
}\
\
/* Email Capture Popup (timer / scroll / exit-intent) */\
#exit-intent-popup {\
  display: none;\
}\
.cm-popup-overlay {\
  position: fixed;\
  inset: 0;\
  z-index: 99999;\
  background: rgba(0, 0, 0, 0.82);\
  display: flex;\
  align-items: center;\
  justify-content: center;\
  padding: 1rem;\
  animation: cmPopupFade 0.25s ease-out;\
}\
@keyframes cmPopupFade {\
  from { opacity: 0; }\
  to   { opacity: 1; }\
}\
.cm-popup-box {\
  position: relative;\
  width: 100%;\
  max-width: 460px;\
  background: linear-gradient(135deg, #0a0a0a 0%, #141414 100%);\
  border: 1px solid #c0a060;\
  border-radius: 12px;\
  padding: 2rem 1.75rem 1.5rem;\
  text-align: center;\
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);\
  max-height: 90vh;\
  overflow-y: auto;\
  animation: cmPopupRise 0.28s ease-out;\
}\
@keyframes cmPopupRise {\
  from { transform: translateY(18px); opacity: 0; }\
  to   { transform: translateY(0); opacity: 1; }\
}\
.cm-popup-close {\
  position: absolute;\
  top: 8px;\
  right: 12px;\
  width: 34px;\
  height: 34px;\
  background: transparent;\
  border: 0;\
  color: #888;\
  font-size: 1.9rem;\
  line-height: 1;\
  cursor: pointer;\
  border-radius: 50%;\
  transition: color 0.2s, background 0.2s;\
}\
.cm-popup-close:hover {\
  color: #ffd700;\
  background: rgba(255, 215, 0, 0.08);\
}\
.cm-popup-title {\
  color: #ffd700;\
  font-size: 1.25rem;\
  font-weight: 200;\
  letter-spacing: 1.5px;\
  text-transform: uppercase;\
  margin: 0 0 0.7rem;\
}\
.cm-popup-text {\
  color: #ccc;\
  font-size: 0.92rem;\
  line-height: 1.55;\
  margin: 0 0 1.1rem;\
}\
.cm-popup-privacy {\
  color: #666;\
  font-size: 0.72rem;\
  margin: 0.8rem 0 0;\
}\
@media (max-width: 600px) {\
  .cm-popup-box { padding: 1.6rem 1.1rem 1.2rem; }\
  .cm-popup-title { font-size: 1.05rem; }\
}\
\
/* Testimonials */\
.cm-testimonials-section {\
  background: #0a0a0a;\
  border: 1px solid #1a1a1a;\
  border-radius: 12px;\
  padding: 2rem;\
  margin: 2rem auto;\
  text-align: center;\
}\
.cm-testimonials-heading {\
  color: #c0a060;\
  font-size: 1.2rem;\
  font-weight: 200;\
  letter-spacing: 2px;\
  text-transform: uppercase;\
  margin-bottom: 1.5rem;\
}\
.cm-testimonials-stats {\
  display: flex;\
  justify-content: center;\
  align-items: center;\
  gap: 2rem;\
  flex-wrap: wrap;\
  margin-bottom: 1.5rem;\
}\
.cm-tstat {\
  text-align: center;\
}\
.cm-tstat-num {\
  display: block;\
  font-size: 2rem;\
  font-weight: 700;\
  color: #ffd700;\
  font-family: "JetBrains Mono", Consolas, monospace;\
}\
.cm-tstat-label {\
  display: block;\
  font-size: 0.85rem;\
  color: #ccc;\
  text-transform: uppercase;\
  letter-spacing: 1px;\
  margin-bottom: 0.3rem;\
}\
.cm-tstat-sub {\
  display: block;\
  font-size: 0.75rem;\
  color: #666;\
}\
.cm-tstat-stars {\
  font-size: 1.3rem;\
  color: #ffd700;\
  letter-spacing: 3px;\
}\
.cm-tstat-sep {\
  width: 1px;\
  height: 60px;\
  background: #333;\
}\
.cm-testimonials-cta {\
  margin-top: 0.5rem;\
}\
\
/* Responsive */\
@media (max-width: 600px) {\
  .cm-lead-section,\
  .cm-collection-section,\
  .cm-tool-cta {\
    padding: 1.5rem;\
  }\
  .cm-lead-headline {\
    font-size: 1.1rem;\
  }\
  .cm-collection-stats {\
    gap: 1rem;\
  }\
  .cm-stat-num {\
    font-size: 1.4rem;\
  }\
  .cm-related-grid {\
    grid-template-columns: 1fr;\
  }\
}\
\
/* Community CTA */\
.cm-community-section {\
  margin: 3rem auto;\
  text-align: center;\
}\
.cm-community-inner {\
  background: linear-gradient(135deg, #0a0a0a 0%, #111 100%);\
  border: 1px solid #5865F2;\
  border-radius: 12px;\
  padding: 2.5rem 2rem;\
}\
.cm-community-heading {\
  font-size: 1.5rem;\
  color: #5865F2;\
  margin: 0 0 0.8rem 0;\
}\
.cm-community-desc {\
  color: #ccc;\
  max-width: 500px;\
  margin: 0 auto 1.5rem auto;\
  line-height: 1.5;\
}\
.cm-community-buttons {\
  display: flex;\
  gap: 1rem;\
  justify-content: center;\
  flex-wrap: wrap;\
}\
.cm-community-btn {\
  display: inline-flex;\
  align-items: center;\
  gap: 0.5rem;\
  padding: 0.75rem 1.5rem;\
  border-radius: 8px;\
  text-decoration: none;\
  font-weight: 600;\
  font-size: 0.95rem;\
  transition: all 0.3s;\
  color: #fff;\
}\
.cm-community-telegram {\
  background: #0088cc;\
}\
.cm-community-telegram:hover {\
  background: #0077b5;\
}\
.cm-community-telegram-group {\
  background: #179cde;\
}\
.cm-community-telegram-group:hover {\
  background: #1489c9;\
}\
.cm-community-discord {\
  background: #5865F2;\
}\
.cm-community-discord:hover {\
  background: #4752c4;\
}\
</style>';

    document.head.insertAdjacentHTML('beforeend', css);
  }

  /* ============================================================
   * INIT
   * ============================================================ */

  function init() {
    /* --- Measurement first -------------------------------------------
     * These run synchronously, before any DOM work, so a rendering error
     * further down can never cost us the pageview. All are idempotent.
     * ------------------------------------------------------------------ */
    ensureGtag();          // GA4 bootstrap + consent 'granted' by default
    initMetaPixel();       // inert until META_PIXEL_ID is real
    bindAffiliate();       // ?ref= capture + 60-day cookie on product clicks
    bindPurchaseTracking();// purchase_click / begin_checkout
    bindFormTracking();    // form_submit / generate_lead

    // Inject styles
    injectStyles();

    // Run after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  function onReady() {
    tagOutboundLinks(document); // UTM + affiliate on hard-coded HTML CTAs
    watchForNewLinks();         // ...and on anything injected later
    run();                      // page-type specific CTA injection
    initEmailPopup();           // 30s / 50% scroll / exit-intent capture
  }

  init();
})();
