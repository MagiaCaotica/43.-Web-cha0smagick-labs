/* Price localization — plan 2.3.16
 * Timezone-based country detection (Intl API — no external calls, privacy-first,
 * works offline). Displays USD prices in local LATAM currency with approximate
 * hardcoded rates (approx. 2026-09; update periodically or wire an FX API later).
 * Target elements: [data-usd-price] attributes on landing pages.
 */
(function () {
  var LOCALES = {
    'America/Bogota':      { currency: 'COP', rate: 4000, locale: 'es-CO' },
    'America/Argentina':   { currency: 'ARS', rate: 1250, locale: 'es-AR' },
    'America/Mexico_City': { currency: 'MXN', rate: 18.5, locale: 'es-MX' },
    'America/Sao_Paulo':   { currency: 'BRL', rate: 5.4,  locale: 'pt-BR' }
  };

  function detectConfig() {
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
    for (var prefix in LOCALES) {
      if (tz.indexOf(prefix) === 0) return LOCALES[prefix];
    }
    return null; // outside LATAM — keep USD as-is
  }

  function formatLocal(usd, cfg) {
    var local = usd * cfg.rate;
    // psychological rounding: COP nearest 100, ARS nearest 50, MXN/BRL nearest 10
    var step = cfg.currency === 'COP' ? 100 : cfg.currency === 'ARS' ? 50 : 10;
    local = Math.round(local / step) * step;
    try {
      return new Intl.NumberFormat(cfg.locale, {
        style: 'currency', currency: cfg.currency, currencyDisplay: 'code',
        maximumFractionDigits: 0
      }).format(local);
    } catch (e) {
      return cfg.currency + ' ' + local;
    }
  }

  function localizePrices() {
    var els = document.querySelectorAll('[data-usd-price]');
    if (!els.length) return;
    var cfg = detectConfig();
    if (!cfg) return;
    for (var i = 0; i < els.length; i++) {
      var usd = parseFloat(els[i].getAttribute('data-usd-price'));
      if (!isNaN(usd) && usd > 0) {
        els[i].textContent = formatLocal(usd, cfg);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', localizePrices);
  } else {
    localizePrices();
  }

  // exposed for testing / manual trigger
  window.cmPriceLocale = { detectConfig: detectConfig, localizePrices: localizePrices, formatLocal: formatLocal };
})();
