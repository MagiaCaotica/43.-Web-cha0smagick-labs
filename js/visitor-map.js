// Visitor map — shared Leaflet renderer (plan 1.1.3)
// Extracted from the identical inline init previously duplicated in 12 app + 7 book pages.
// Usage: after the Leaflet CDN script, load <script src="../js/visitor-map.js"></script>
// Optional per-page data override: window.VISITOR_DATA = [[lat,lng,visits,"loc"],...];
(function () {
    'use strict';

    var DEFAULT_VISITORS = [[34.0584,-118.278,130,"Los Angeles, US"],[3.4372,-76.5225,89,"Santiago de Cali, Colombia"],[37.4043,-122.0748,76,"Mountain View, US"],[37.751,-97.822,73,"United States"],[51.2993,9.491,69,"Germany"],[51.4964,-0.1224,61,"United Kingdom"],[52.5155,13.4062,41,"Berlin, Germany"],[13.0878,80.2785,34,"Chennai, India"],[40.4172,-3.684,28,"Spain"],[55.7123,12.0564,28,"Denmark"],[53.2851,-6.3713,25,"Dublin, Ireland"],[60,-95,17,"Canada"],[36.6865,-6.1361,14,"Jerez de la Frontera, Spain"],[52.3824,4.8995,14,"Netherlands"],[54.6816,25.3225,11,"Vilnius, Lithuania"],[38.7057,-9.1359,9,"Portugal"],[35.698,51.4115,9,"Iran"],[50.0833,16.7667,9,"Czechia"],[23,-102,9,"Mexico"],[51.5077,-0.119,8,"London, UK"],[42.8333,12.8333,8,"Italy"],[37.3824,-5.9761,8,"Seville, Spain"],[46.4355,30.4104,7,"Ukraine"],[52.3759,4.8975,6,"Amsterdam, Netherlands"],[50.8509,4.3447,6,"Belgium"],[4.6358,-73.4664,6,"La Mesa, Colombia"],[40.7876,-74.06,6,"Secaucus, US"],[19.3837,-99.1757,5,"Mexico City, Mexico"],[49.685,11.415,5,"Betzenstein, Germany"],[-27,133,4,"Australia"],[44.8166,20.4721,4,"Belgrade, Serbia"],[40.4165,-3.7026,3,"Madrid, Spain"],[53.4663,-2.1342,3,"Manchester, UK"],[25,45,2,"Saudi Arabia"],[1.3248,103.8566,2,"Singapore"],[-34,-64,2,"Argentina"],[41.0214,28.9948,2,"Turkey"],[-34.8272,-58.3956,2,"Florencio Varela, Argentina"],[-33.7967,-59.5208,1,"Baradero, Argentina"],[-29,24,1,"South Africa"],[18.4667,-69.9,1,"Santo Domingo, Dominican Rep."],[-4.3,15.3,1,"Kinshasa, DR Congo"],[47.4984,19.0404,1,"Budapest, Hungary"],[45.8293,15.9793,1,"Zagreb, Croatia"],[-21.9065,-47.8747,1,"Sao Carlos, Brazil"],[14.6328,-90.5199,1,"Guatemala City"],[-10.3383,-62.8954,1,"Cacaulandia, Brazil"],[-30.1146,-51.1639,1,"Porto Alegre, Brazil"],[-36.8506,174.7679,1,"Auckland, New Zealand"],[-6.175,106.8286,1,"Indonesia"],[45.4643,9.1895,1,"Milan, Italy"],[-10,-55,1,"Brazil"],[55.8822,26.5268,1,"Latvia"],[52.2394,21.0362,1,"Poland"],[59.3247,18.056,1,"Sweden"],[33.874,35.5089,1,"Beirut, Lebanon"],[37.5647,15.0631,1,"Gravina di Catania, Italy"],[43.6426,-79.4002,1,"Toronto, Canada"]];
    var DEFAULT_MAX_VISITS = 130;

    function initVisitorMap(visitors, maxVisits) {
        var mapEl = document.getElementById('visitor-map');
        if (!mapEl || typeof L === 'undefined') return;

        // CARTO Basemaps key (plan 1.3.11): client-side public basemap key, rotation record in root .env (CARTO_API_KEY).
        var tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=cb1_3oz4_1_1a77bbfada7c8f46d51a0ac6';
        var tileAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

        var map = L.map('visitor-map', {
            center: [20, 0],
            zoom: 1,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true,
            doubleClickZoom: false,
            touchZoom: true,
            keyboard: false,
            attributionControl: true,
            worldCopyJump: true
        });

        L.tileLayer(tileUrl, { attribution: tileAttr, maxZoom: 8, minZoom: 1 }).addTo(map);

        visitors.forEach(function (v) {
            var lat = v[0], lng = v[1], visits = v[2], loc = v[3];
            var radius = 3 + (visits / maxVisits) * 10;
            var opacity = 0.4 + (visits / maxVisits) * 0.6;
            L.circleMarker([lat, lng], {
                radius: radius,
                fillColor: '#ff4444', color: '#ff4444', weight: 1,
                fillOpacity: opacity, opacity: 0.8
            }).bindTooltip(loc + ' — ' + visits + ' visits', {
                direction: 'top', offset: [0, -radius], className: 'visitor-tooltip'
            }).addTo(map);
        });

        setTimeout(function () { map.invalidateSize(); }, 500);
        window.addEventListener('resize', function () { map.invalidateSize(); });
    }

    window.initVisitorMap = initVisitorMap;

    document.addEventListener('DOMContentLoaded', function () {
        initVisitorMap(window.VISITOR_DATA || DEFAULT_VISITORS, DEFAULT_MAX_VISITS);
    });
})();
