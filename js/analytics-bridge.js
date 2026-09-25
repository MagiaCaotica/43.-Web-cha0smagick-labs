(function (global) {
  'use strict';

  var EVENTS = [
    'tool_start', 'tool_complete', 'cta_click', 'app_store_click', 'book_click',
    'outbound_click', 'email_signup', 'content_share', 'experiment_exposure',
    'conversion_import'
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
    conversion_import: ['source', 'status', 'metric', 'value_bucket', 'currency', 'transaction_id_hash']
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

  global.Cha0Analytics = {
    events: EVENTS.slice(),
    setConsent: setConsent,
    track: track,
    bind: bind,
    isConsentGranted: consentGranted
  };

  /* Arm the declarative channel on load. Without this, bind() has to be called
     by hand and every data-analytics-event attribute in the markup is inert.
     Safe to call twice: the listener only ever records delegated clicks. */
  if (global.document && typeof global.document.addEventListener === 'function') {
    bind(global.document);
  }
}(window));
