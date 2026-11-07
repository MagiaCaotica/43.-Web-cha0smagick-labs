/* Carga Leaflet y el mapa de visitantes solo cuando el mapa se acerca a la
   pantalla. Antes, 51 paginas descargaban 41 KB de Leaflet al inicio aunque
   el mapa estuviera muy por debajo del pliegue.

   Uso en la pagina:
     <script src="../js/lazy-map.js" data-map-script="../js/visitor-map.js" defer></script>
*/
(function () {
  'use strict';
  var started = false;
  var SELF = document.currentScript;

  function load(host) {
    if (started) return;
    started = true;

    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    css.crossOrigin = '';
    document.head.appendChild(css);

    var leaflet = document.createElement('script');
    leaflet.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leaflet.crossOrigin = '';
    leaflet.onload = function () {
      var src = host.getAttribute('data-map-script');
      if (!src) return;
      var app = document.createElement('script');
      app.src = src;
      document.body.appendChild(app);
    };
    document.head.appendChild(leaflet);
  }

  function init() {
    var host = SELF;
    var map = document.getElementById('visitor-map');
    if (!map) return;

    if (!('IntersectionObserver' in window)) {
      load(host);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          io.disconnect();
          load(host);
          return;
        }
      }
    }, { rootMargin: '300px' });
    io.observe(map);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

