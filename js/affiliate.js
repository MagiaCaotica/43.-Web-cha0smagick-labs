/**
 * Cha0smagick Labs — Manual Affiliate Tracker
 * Free, zero-dependency, privacy-first.
 * Captures ?ref= param → 60-day cookie + localStorage → auto-tags affiliate links.
 * Fires GA4 'affiliate_click' event on click.
 */
(function () {
  'use strict';

  // 1. Capture ?ref= on landing, persist 60 days
  var params = new URLSearchParams(window.location.search);
  var ref = params.get('ref');
  if (ref) {
    var cleaned = ref.replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 32);
    var expires = new Date();
    expires.setDate(expires.getDate() + 60);
    document.cookie = 'cm_ref=' + encodeURIComponent(cleaned) +
      '; expires=' + expires.toUTCString() + '; path=/; SameSite=Lax';
    try {
      localStorage.setItem('cm_ref', JSON.stringify({
        id: cleaned,
        ts: Date.now(),
        landing: location.pathname
      }));
    } catch (e) {}
  }

  // 2. Read current ref
  function getRef() {
    var m = document.cookie.match(/(?:^|;\s*)cm_ref=([^;]+)/);
    if (m) return decodeURIComponent(m[1]);
    try {
      var stored = JSON.parse(localStorage.getItem('cm_ref') || 'null');
      if (stored && Date.now() - stored.ts < 60 * 24 * 60 * 60 * 1000) {
        return stored.id;
      }
    } catch (e) {}
    return null;
  }

  // 3. Tag outbound affiliate links + fire GA4
  document.addEventListener('DOMContentLoaded', function () {
    var ref = getRef();
    if (!ref) return;

    document.querySelectorAll('a[data-affiliate="true"]').forEach(function (a) {
      try {
        var url = new URL(a.href, location.origin);
        url.searchParams.set('ref', ref);
        a.href = url.toString();
      } catch (e) {}
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-affiliate="true"]');
      if (!a) return;
      if (typeof gtag === 'function') {
        gtag('event', 'affiliate_click', {
          affiliate_id: ref,
          product: a.getAttribute('data-product') || a.href,
          page: location.pathname
        });
      }
    });
  });

  // 4. Expose global helper
  window.cmAffiliate = {
    current: getRef,
    appendRef: function (url) {
      var r = getRef();
      if (!r) return url;
      try {
        var u = new URL(url, location.origin);
        u.searchParams.set('ref', r);
        return u.toString();
      } catch (e) { return url; }
    }
  };
})();
