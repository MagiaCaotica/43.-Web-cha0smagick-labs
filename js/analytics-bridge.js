(function (global) {
  'use strict';

  var EVENTS = [
    'tool_start', 'tool_complete', 'cta_click', 'app_store_click', 'book_click',
    'outbound_click', 'email_signup', 'content_share', 'experiment_exposure',
    'conversion_import',
    /* Mirrored from conversion.js so every funnel event lands in one
       consent-gated, PII-filtered pipeline instead of only in gtag. */
    'tool_funnel_view', 'tool_funnel_click', 'purchase_click', 'begin_checkout',
    'lead_magnet_view', 'popup_view', 'popup_close', 'share', 'affiliate_click'
  ];
  // Union of data/analytics-events.json (required + optional) and the fields the
  // call sites actually send. Anything not listed here is dropped, so a key that
  // is added at a call site but forgotten here disappears silently -- keep both
  // sides in sync.
  var ALLOWED_KEYS = {
    tool_start: ['tool_id', 'category', 'entry_point', 'source', 'consent_version'],
    tool_complete: ['tool_id', 'category', 'duration_bucket', 'result_bucket', 'result_present', 'source'],
    cta_click: ['tool_id', 'cta_type', 'placement', 'destination_type'],
    app_store_click: ['tool_id', 'app_id', 'store', 'placement', 'source', 'campaign'],
    book_click: ['book_id', 'placement', 'source', 'campaign'],
    outbound_click: ['tool_id', 'destination_host', 'domain_class', 'placement'],
    email_signup: ['source', 'placement', 'content_id'],
    content_share: ['content_id', 'channel', 'source'],
    experiment_exposure: ['experiment_id', 'variant', 'surface', 'placement'],
    conversion_import: ['source', 'status', 'metric', 'value_bucket', 'currency', 'transaction_id_hash'],
    /* conversion.js funnel events. `items` is intentionally absent: it is an
       array, so safeValue() would drop it anyway, and GA4 needs the raw gtag
       copy for item-level revenue -- the bridge keeps the flat summary. */
    tool_funnel_view: ['tool_id', 'category', 'apps', 'has_book', 'related', 'source', 'surface'],
    tool_funnel_click: ['tool_id', 'product_type', 'product_id', 'source', 'placement'],
    purchase_click: ['currency', 'value', 'destination', 'link_url', 'page', 'page_type'],
    begin_checkout: ['currency', 'value', 'link_url', 'page'],
    lead_magnet_view: ['form_name', 'form_destination', 'page', 'page_type'],
    popup_view: ['trigger', 'page', 'page_type'],
    popup_close: ['reason', 'page'],
    share: ['method', 'content_type', 'item_id', 'content_id', 'channel', 'page'],
    affiliate_click: ['affiliate_id', 'product', 'page']
  };
  /* The site's single source of truth for consent. shared.js (cmApplyConsent) and
     conversion.js (applyConsent) both read this cookie: collection is GRANTED
     unless the visitor explicitly declined. This bridge must agree with them,
     otherwise it either records nothing (opt-in) or records against a refusal
     (opt-out). Only "declined" blocks. */
  var CONSENT_COOKIE = 'cookie_consent';
  var consentKey = 'cha0_analytics_consent';
  var state = { consent: null };
  var valueLimit = 120;

  function readCookie(name) {
    try {
      var prefix = name + '=';
      var parts = String(global.document && global.document.cookie || '').split(';');
      for (var i = 0; i < parts.length; i++) {
        var part = parts[i].replace(/^\s+/, '');
        if (part.indexOf(prefix) === 0) return decodeURIComponent(part.slice(prefix.length));
      }
    } catch (_) {
      // Cookie access can throw in sandboxed frames; fall through.
    }
    return null;
  }

  /* Consent resolution order:
       1. explicit setConsent() call (explicit wins, in either direction)
       2. cha0_analytics_consent in localStorage (written by a prior setConsent)
       3. cookie_consent cookie -- the same cookie the rest of the site uses
     The cookie is re-read on every check (it is a cheap in-memory read) so a
     visitor who declines from the banner after the bridge loaded is still
     honoured; setConsent() pins the decision for the rest of the page view. */
  function consentGranted() {
    if (state.consent !== null) return state.consent;
    try {
      var stored = global.localStorage ? global.localStorage.getItem(consentKey) : null;
      if (stored === 'granted') return true;
      if (stored === 'denied') return false;
    } catch (_) {
      // Storage is optional; fall back to the cookie.
    }
    return readCookie(CONSENT_COOKIE) !== 'declined';
  }

  function safeValue(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value !== 'string') return undefined;
    var clean = value.trim().replace(/[<>]/g, '').slice(0, valueLimit);
    return clean || undefined;
  }

  function sanitize(eventName, params) {
    var allowed = ALLOWED_KEYS[eventName] || [];
    var output = {};
    allowed.forEach(function (key) {
      var value = safeValue(params && params[key]);
      if (value !== undefined) output[key] = value;
    });
    return output;
  }

  function track(eventName, params) {
    if (!consentGranted() || EVENTS.indexOf(eventName) === -1) return false;
    global.dataLayer = global.dataLayer || [];
    global.dataLayer.push(Object.assign({
      event: eventName,
      analytics_source: 'cha0_bridge'
    }, sanitize(eventName, params || {})));
    return true;
  }

  function setConsent(value) {
    state.consent = value === true || value === 'granted';
    try {
      if (global.localStorage) global.localStorage.setItem(consentKey, state.consent ? 'granted' : 'denied');
    } catch (_) {
      // Storage is optional; consent state remains in memory.
    }
  }

  function bind(root) {
    var scope = root || global.document;
    if (!scope || typeof scope.addEventListener !== 'function') return;
    scope.addEventListener('click', function (event) {
      var element = event.target && event.target.closest ? event.target.closest('[data-analytics-event]') : null;
      if (!element) return;
      var name = element.getAttribute('data-analytics-event');
      var params = {};
      try {
        params = JSON.parse(element.getAttribute('data-analytics-params') || '{}');
      } catch (_) {
        params = {};
      }
      track(name, params);
    }, { passive: true });
  }

  /* --- Derived, DOM-driven events ----------------------------------------
   * These five need no markup. The bridge reads them off the elements the site
   * already produces, so there is no `data-analytics-event` to forget and no
   * diff across hundreds of anchors to rot. Hand-tagging links would be the
   * same signal with a maintenance cost.
   *
   * Three contract entries are deliberately NOT wired here:
   *   conversion_import   server-side by nature (Play sales, Hotmart, cohort
   *                       CSVs). A page cannot honestly report a sale it did
   *                       not observe; those live in the import scripts.
   *   experiment_exposure there is no experiment running to expose. The event
   *                       is armed in the contract, but emitting a variant that
   *                       does not exist would invent data.
   *   cta_click           "CTA" is undefined here, and the funnel already emits
   *                       the precise version of it (tool_funnel_click).
   *                       Counting both would double every funnel click.
   * ---------------------------------------------------------------------- */
  var OWN_HOSTS = { 'cha0smagicklabs.com': 1, 'www.cha0smagicklabs.com': 1 };
  /* Matched per DNS label so short hosts work: t.me is two labels, x.com is
     two, facebook.com is two. A substring test misses t.me entirely. */
  var SOCIAL_LABELS = {
    facebook: 1, instagram: 1, twitter: 1, telegram: 1, linkedin: 1, pinterest: 1,
    reddit: 1, whatsapp: 1, discord: 1, youtube: 1, threads: 1, mastodon: 1,
    tiktok: 1, wa: 1, x: 1, t: 1, me: 1
  };
  var EMAIL_HOSTS = /(mailerlite|mailchimp|convertkit|buttondown|klaviyo)/;
  var MAILERLITE_FORM = /(mailerlite|ml-embedded)/i;

  function hostOf(url) {
    try {
      return new URL(url, global.location.href).hostname.toLowerCase();
    } catch (_) {
      return '';
    }
  }

  /* Coarse bucket, not the raw host: enough to segment, and it cannot leak a
     full referrer into the analytics payload. */
  function domainClass(host) {
    if (!host) return 'unknown';
    if (OWN_HOSTS[host]) return 'own_site';
    if (/play\.google\.com$/.test(host)) return 'app_store';
    if (/hotmart\./.test(host)) return 'checkout';
    if (EMAIL_HOSTS.test(host)) return 'email';
    var labels = host.split('.');
    for (var i = 0; i < labels.length; i++) {
      if (SOCIAL_LABELS[labels[i]]) return 'social';
    }
    return 'external';
  }

  /* Nearest id, else nearest first class. Enough to place a click without
     inventing a placement taxonomy nobody agreed on. */
  function placementOf(el) {
    var node = el;
    var guard = 0;
    while (node && node !== global.document && guard < 25) {
      if (node.id) return String(node.id).slice(0, 60);
      if (node.getAttribute) {
        var cls = node.getAttribute('class');
        if (cls) return String(cls).split(/\s+/)[0].slice(0, 60);
      }
      node = node.parentNode;
      guard += 1;
    }
    return 'page';
  }

  function appIdFrom(href) {
    try {
      return new URL(href, global.location.href).searchParams.get('id') || '';
    } catch (_) {
      return '';
    }
  }

  /* Book id: from /books/<id>.html, or the Hotmart offer code in the query. */
  function bookIdFrom(href) {
    try {
      var url = new URL(href, global.location.href);
      var books = url.pathname.match(/\/books\/([a-z0-9-]+)\.html?$/i);
      if (books) return books[1];
      var offer = url.searchParams.get('checkout') || url.pathname.match(/\/([A-Z0-9]{6,})P?$/);
      return offer ? String(offer[1] || offer[0]) : '';
    } catch (_) {
      return '';
    }
  }

  /* Un enlace al propio host nunca es outbound, sea cual sea el host: comparar
     solo contra la lista fija hacia que en staging, en localhost o en una
     preview el sitio entero pareciera "externo" y cada clic se contara como
     salida. */
  function isOwnLink(href) {
    var host = hostOf(href);
    if (!host) return true;
    if (OWN_HOSTS[host]) return true;
    try {
      return String(global.location.hostname || '').toLowerCase() === host;
    } catch (_) {
      return true;
    }
  }

  function onAnchorClick(event) {
    var el = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!el) return;
    var href = el.getAttribute('href') || '';
    // Ignore in-page anchors, mailto/tel/javascript and empty hrefs.
    if (!href || /^(#|mailto:|tel:|javascript:)/i.test(href)) return;

    var host = hostOf(href);
    var placement = placementOf(el);

    if (/play\.google\.com/.test(host)) {
      track('app_store_click', {
        tool_id: toolIdFromPage(),
        app_id: appIdFrom(href),
        store: 'google_play',
        placement: placement
      });
    }

    var looksLikeBook = /\/books\/[a-z0-9-]+\.html?$/i.test(href) || /hotmart\./.test(host);
    if (looksLikeBook) {
      track('book_click', { book_id: bookIdFrom(href), placement: placement });
    }

    if (!isOwnLink(href)) {
      track('outbound_click', {
        tool_id: toolIdFromPage(),
        destination_host: host,
        domain_class: domainClass(host),
        placement: placement
      });
    }
  }

  /* The funnel stamps the active tool on the page; when present it lets every
     derived click be attributed to a tool without a second data attribute. */
  function toolIdFromPage() {
    try {
      var app = global.document.querySelector('[data-atomic-tool]');
      if (app) return app.getAttribute('data-atomic-tool') || '';
    } catch (_) {
      // Ignore: attribution is best-effort.
    }
    return '';
  }

  /* conversion.js tags its own share anchors with data-cm-share, so the channel
     is already in the DOM. A share click also produces an outbound_click (the
     destination really is external) -- two true statements about one click, not
     a double count. */
  function onShareClick(event) {
    var el = event.target && event.target.closest
      ? event.target.closest('[data-cm-share]')
      : null;
    if (!el) return;
    track('content_share', {
      content_id: global.location.pathname,
      channel: el.getAttribute('data-cm-share') || 'unknown',
      source: 'share_buttons'
    });
  }

  function onFormSubmit(event) {
    var form = event.target;
    if (!form || String(form.tagName || '').toUpperCase() !== 'FORM') return;
    var identity = (form.className || '') + ' ' + ((form.getAttribute && form.getAttribute('data-form')) || '') +
      ((form.closest && form.closest('.ml-embedded')) ? ' ml-embedded' : '');
    if (!MAILERLITE_FORM.test(identity)) return;
    track('email_signup', { source: 'mailerlite', placement: placementOf(form) });
  }

  var autoBound = false;
  function autoBind(root) {
    var scope = root || global.document;
    if (!scope || typeof scope.addEventListener !== 'function') return;
    if (autoBound) return;
    autoBound = true;
    // The declarative channel: data-analytics-event wins when present, so an
    // explicit tag is never double-counted by the derived handlers below.
    bind(scope);
    scope.addEventListener('click', onAnchorClick, { passive: true, capture: true });
    scope.addEventListener('click', onShareClick, { passive: true, capture: true });
    scope.addEventListener('submit', onFormSubmit, { passive: true, capture: true });
  }

  /* Idempotent: shared.js also loads this file, and the tool pages carry an
     explicit <script> tag. The flag has to be read BEFORE the object literal is
     reassigned -- assigning first wipes the marker and the second evaluation
     re-registers every delegated listener, firing each event twice. */
  var alreadyInstalled = !!(global.Cha0Analytics && global.Cha0Analytics.__installed);

  global.Cha0Analytics = {
    events: EVENTS.slice(),
    setConsent: setConsent,
    track: track,
    bind: bind,
    autoBind: autoBind,
    isConsentGranted: consentGranted,
    __installed: true
  };

  if (!alreadyInstalled) autoBind(global.document);
}(window));
