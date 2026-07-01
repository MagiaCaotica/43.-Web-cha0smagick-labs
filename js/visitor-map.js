/* ========================================================================
   Cha0smagick Labs - Visitor Map (Leaflet)
   Ubicacion: /js/visitor-map.js
   - Lazy-load Leaflet ONLY when map enters viewport
   - Safe-guards against script order race (no dependency on shared.js timing)
   - Fallback to OpenStreetMap tiles if CartoCDN fails (network/region)
   - Self-contained: IDs, data and styles handled safely
   ======================================================================== */
(function () {
    'use strict';

    // --------------------------- VISITOR DATA ----------------------------
    var VISITORS = [
        [34.0584, -118.2780, 130, 'Los Angeles, US'],
        [3.4372, -76.5225, 89, 'Santiago de Cali, Colombia'],
        [37.4043, -122.0748, 76, 'Mountain View, US'],
        [37.7510, -97.8220, 73, 'United States'],
        [51.2993, 9.4910, 69, 'Germany'],
        [51.4964, -0.1224, 61, 'United Kingdom'],
        [52.5155, 13.4062, 41, 'Berlin, Germany'],
        [13.0878, 80.2785, 34, 'Chennai, India'],
        [40.4172, -3.6840, 28, 'Spain'],
        [55.7123, 12.0564, 28, 'Denmark'],
        [53.2851, -6.3713, 25, 'Dublin, Ireland'],
        [60.0000, -95.0000, 17, 'Canada'],
        [36.6865, -6.1361, 14, 'Jerez de la Frontera, Spain'],
        [52.3824, 4.8995, 14, 'Netherlands'],
        [54.6816, 25.3225, 11, 'Vilnius, Lithuania'],
        [38.7057, -9.1359, 9, 'Portugal'],
        [35.6980, 51.4115, 9, 'Iran'],
        [50.0833, 16.7667, 9, 'Czechia'],
        [23.0000, -102.0000, 9, 'Mexico'],
        [51.5077, -0.1190, 8, 'London, UK'],
        [42.8333, 12.8333, 8, 'Italy'],
        [37.3824, -5.9761, 8, 'Seville, Spain'],
        [46.4355, 30.4104, 7, 'Ukraine'],
        [52.3759, 4.8975, 6, 'Amsterdam, Netherlands'],
        [50.8509, 4.3447, 6, 'Belgium'],
        [4.6358, -73.4664, 6, 'La Mesa, Colombia'],
        [40.7876, -74.0600, 6, 'Secaucus, US'],
        [19.3837, -99.1757, 5, 'Mexico City, Mexico'],
        [49.6850, 11.4150, 5, 'Betzenstein, Germany'],
        [-27.0000, 133.0000, 4, 'Australia'],
        [44.8166, 20.4721, 4, 'Belgrade, Serbia'],
        [40.4165, -3.7026, 3, 'Madrid, Spain'],
        [53.4663, -2.1342, 3, 'Manchester, UK'],
        [25.0000, 45.0000, 2, 'Saudi Arabia'],
        [1.3248, 103.8566, 2, 'Singapore'],
        [-34.0000, -64.0000, 2, 'Argentina'],
        [41.0214, 28.9948, 2, 'Turkey'],
        [-34.8272, -58.3956, 2, 'Florencio Varela, Argentina'],
        [-33.7967, -59.5208, 1, 'Baradero, Argentina'],
        [-29.0000, 24.0000, 1, 'South Africa'],
        [18.4667, -69.9000, 1, 'Santo Domingo, Dominican Rep.'],
        [-4.3000, 15.3000, 1, 'Kinshasa, DR Congo'],
        [47.4984, 19.0404, 1, 'Budapest, Hungary'],
        [45.8293, 15.9793, 1, 'Zagreb, Croatia'],
        [-21.9065, -47.8747, 1, 'Sao Carlos, Brazil'],
        [14.6328, -90.5199, 1, 'Guatemala City'],
        [-10.3383, -62.8954, 1, 'Cacaulandia, Brazil'],
        [-30.1146, -51.1639, 1, 'Porto Alegre, Brazil'],
        [-36.8506, 174.7679, 1, 'Auckland, New Zealand'],
        [-6.1750, 106.8286, 1, 'Indonesia'],
        [45.4643, 9.1895, 1, 'Milan, Italy'],
        [-10.0000, -55.0000, 1, 'Brazil'],
        [55.8822, 26.5268, 1, 'Latvia'],
        [52.2394, 21.0362, 1, 'Poland'],
        [59.3247, 18.0560, 1, 'Sweden'],
        [33.8740, 35.5089, 1, 'Beirut, Lebanon'],
        [37.5647, 15.0631, 1, 'Gravina di Catania, Italy'],
        [43.6426, -79.4002, 1, 'Toronto, Canada']
    ];

    var MAX_VISITS = 130;

    // ----------------------- LEAFLET LOADER (lazy) ------------------------
    var LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    var LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

    function ensureLeafletCss() {
        if (document.querySelector('link[data-leaflet-css]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = LEAFLET_CSS;
        link.crossOrigin = 'anonymous';
        link.setAttribute('data-leaflet-css', '1');
        document.head.appendChild(link);
    }

    function loadLeaflet(cb) {
        if (typeof window.L !== 'undefined') { cb(); return; }
        if (window.__leafletLoadingPromise) {
            window.__leafletLoadingPromise.then(cb);
            return;
        }
        ensureLeafletCss();
        window.__leafletLoadingPromise = new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = LEAFLET_JS;
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.onload = function () { resolve(); };
            script.onerror = function () { reject(new Error('Leaflet CDN failed')); };
            document.head.appendChild(script);
        });
        window.__leafletLoadingPromise.then(cb, function (err) {
            console.warn('[visitor-map]', err.message);
        });
    }

    // ---------------------- FALLBACK TILES (OSM) --------------------------
    function osmFallbackLayer() {
        return {
            url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        };
    }

    // ----------------------- INITIALIZE THE MAP ---------------------------
    function initMap() {
        var el = document.getElementById('visitor-map');
        if (!el) return;

        // Force a real height: Leaflet needs a non-zero container size.
        // We bump the wrapper to ensure visibility even if CSS is missing.
        var wrapper = document.getElementById('map-wrapper');
        if (wrapper) {
            var cs = window.getComputedStyle(wrapper);
            if (!cs.height || cs.height === '0px') {
                wrapper.style.minHeight = '260px';
                wrapper.style.height = '260px';
            }
        }

        var L = window.L;
        if (!L) return;

        // Prevent double-init
        if (el._leaflet_id) { return; }

        var map = L.map('visitor-map', {
            center: [20, 0],
            zoom: 1,
            minZoom: 1,
            maxZoom: 8,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            doubleClickZoom: false,
            touchZoom: true,
            keyboard: false,
            attributionControl: true,
            worldCopyJump: true,
            preferCanvas: false
        });

        // Primary (dark) tiles with fallback to OSM on tile load error.
        var primaryUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        var fall = osmFallbackLayer();

        try {
            var tileLayer = L.tileLayer(primaryUrl, {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 8,
                minZoom: 1,
                crossOrigin: true,
                errorTileUrl: ''
            });
            tileLayer.on('tileerror', function () {
                // After several failures, switch to OSM.
                if (!map._fallbackActive) {
                    map._fallbackActive = true;
                    map.removeLayer(tileLayer);
                    L.tileLayer(fall.url, {
                        attribution: fall.attr,
                        maxZoom: 18,
                        minZoom: 1
                    }).addTo(map);
                }
            });
            tileLayer.addTo(map);
        } catch (e) {
            L.tileLayer(fall.url, {
                attribution: fall.attr,
                maxZoom: 18,
                minZoom: 1
            }).addTo(map);
        }

        // Visitors (circle markers, red gradient).
        var maxV = MAX_VISITS;
        VISITORS.forEach(function (v) {
            var lat = v[0], lng = v[1], visits = v[2], loc = v[3];
            var radius = 3 + (visits / maxV) * 10;
            var opacity = 0.4 + (visits / maxV) * 0.6;
            var marker = L.circleMarker([lat, lng], {
                radius: radius,
                fillColor: '#ff4444',
                color: '#ff4444',
                weight: 1,
                fillOpacity: opacity,
                opacity: 0.8
            }).addTo(map);
            marker.bindTooltip(loc + ' — ' + visits + ' visits', {
                direction: 'top',
                offset: [0, -radius],
                className: 'visitor-tooltip'
            });
        });

        // Force layout recalc (Leaflet quirk in flex/grid containers).
        setTimeout(function () { map.invalidateSize(); }, 200);
        setTimeout(function () { map.invalidateSize(); }, 800);
        window.addEventListener('resize', function () { map.invalidateSize(); });

        window.__visitorMapInstance = map;
    }

    // ------------------- OBSERVER (prevent early init) --------------------
    function bootstrap() {
        var el = document.getElementById('visitor-map');
        if (!el) return;

        // If Leaflet is already ready (rare path) we still wait for viewport.
        if (typeof IntersectionObserver === 'undefined') {
            // Old browsers: just init immediately.
            loadLeaflet(initMap);
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    observer.disconnect();
                    loadLeaflet(initMap);
                }
            });
        }, { rootMargin: '100px' });

        observer.observe(el);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    } else {
        bootstrap();
    }
})();
