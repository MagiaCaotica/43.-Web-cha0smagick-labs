"""
Batch 3 - Item 1: Lazy-load Leaflet on all pages.
Removes synchronous Leaflet CSS/JS from <head>, wraps map init in IntersectionObserver.
"""
import re, os, sys

ROOT = r'D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs'

# Pages with Leaflet loaded synchronously
PAGES = [
    'index.html',
    'best-occult-apps-android.html',
    'pages/app-details.html',
    'apps/arcana-goetia.html',
    'apps/dream-machine.html',
    'apps/chaos-sigil-generator.html',
    'apps/iching-oracle.html',
    'apps/liber-lvpinux-pdf.html',
    'apps/lunar-phase-calculator.html',
    'apps/manual-activacion-servidores-magicos-pdf.html',
    'apps/norse-rune-oracle.html',
    'apps/ouija-cazadora-pdf.html',
    'apps/tratado-runas-cazadoras-caos-pdf.html',
    'apps/unofficial-rider-waite-tarot.html',
    'apps/psi-gym.html',
]

def leaflet_css_pattern():
    return r'<link rel="stylesheet" href="https://unpkg.com/leaflet@[^"]+/dist/leaflet\.css"[^>]*>\s*'

def leaflet_js_pattern():
    return r'<script src="https://unpkg.com/leaflet@[^"]+/dist/leaflet\.js"[^>]*></script>\s*'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    
    # 1. Remove Leaflet CSS link
    content = re.sub(leaflet_css_pattern(), '', content)
    
    # 2. Remove Leaflet JS script
    content = re.sub(leaflet_js_pattern(), '', content)
    
    # 3. Replace map init block with IntersectionObserver + lazy-load
    # Find the block: from document.addEventListener(...) through the closing });
    # We'll match from the specific line 'var mapEl = ...' up to 'window.addEventListener('resize', ...'
    map_start = content.find("var mapEl = document.getElementById('visitor-map')")
    if map_start == -1:
        print(f'  WARNING: No map init found in {filepath}')
        return content if content == original else content
    
    # Find the end of the block — the </script> or the next <script> or the final });
    # Look for the pattern: 2-3 closing braces+paren after invalidateSize
    block_end = content.find("window.addEventListener('resize', function() { map.invalidateSize(); });", map_start)
    if block_end == -1:
        print(f'  WARNING: Cannot find end of map init in {filepath}')
        return content
    
    # The block goes from map_start to block_end + length of that line + the closing }); 
    # Actually, let me find the final }); after the invalidateSize line
    after_resize = block_end + len("window.addEventListener('resize', function() { map.invalidateSize(); });")
    # Find the closing }); — there should be one within 10 chars
    rest = content[after_resize:after_resize+20]
    # Match the final }); and optionally whitespace
    closer = re.match(r'\s*\}\);?\s*', rest)
    if closer:
        block_end_pos = after_resize + closer.end()
    else:
        # Just use up to after_resize and add the necessary closing
        print(f'  WARNING: Unexpected end format in {filepath}: {repr(rest[:30])}')
        block_end_pos = after_resize
    
    # Extract the visitor data and map settings from the original block
    orig_block = content[map_start:block_end_pos]
    
    # Extract the visitor data array
    visitors_match = re.search(r'(var visitors = \[.*?\]);', orig_block, re.DOTALL)
    visitors_data = visitors_match.group(1) if visitors_match else 'var visitors = [];'
    
    # Extract the maxVisits value
    maxvisits_match = re.search(r'(var maxVisits = \d+;)', orig_block)
    maxvisits_data = maxvisits_match.group(1) if maxvisits_match else 'var maxVisits = 1;'
    
    # Build the lazy-load replacement (non-f-string to avoid brace escaping issues)
    js_block_template = r"""var mapEl = document.getElementById('visitor-map');
        if (!mapEl) return;

        // Lazy-load Leaflet when map enters viewport
        var observer = new IntersectionObserver(function(entries) {
            if (entries[0].isIntersecting) {
                observer.disconnect();
                loadLeaflet(function() {
                    initVisitorMap();
                });
            }
        });
        observer.observe(mapEl);

        function initVisitorMap() {
            var tileUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
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

            L.tileLayer(tileUrl, {
                attribution: tileAttr,
                maxZoom: 8,
                minZoom: 1
            }).addTo(map);

            VISITORS_DATA_PLACEHOLDER

            MAXVISITS_DATA_PLACEHOLDER

            visitors.forEach(function(v) {
                var lat = v[0], lng = v[1], visits = v[2], loc = v[3];
                var radius = 3 + (visits / maxVisits) * 10;
                var opacity = 0.4 + (visits / maxVisits) * 0.6;

                var marker = L.circleMarker([lat, lng], {
                    radius: radius,
                    fillColor: '#ff4444',
                    color: '#ff4444',
                    weight: 1,
                    fillOpacity: opacity,
                    opacity: 0.8
                }).addTo(map);

                marker.bindTooltip(loc + ' \u2014 ' + visits + ' visits', {
                    direction: 'top',
                    offset: [0, -radius],
                    className: 'visitor-tooltip'
                });
            });

            setTimeout(function() { map.invalidateSize(); }, 500);
            window.addEventListener('resize', function() { map.invalidateSize(); });
        }"""
    lazy_block = js_block_template.replace('VISITORS_DATA_PLACEHOLDER', visitors_data)
    lazy_block = lazy_block.replace('MAXVISITS_DATA_PLACEHOLDER', maxvisits_data)
    
    content = content[:map_start] + lazy_block + content[block_end_pos:]
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    processed = 0
    for page in PAGES:
        path = os.path.join(ROOT, page)
        if not os.path.exists(path):
            print(f'SKIP (not found): {page}')
            continue
        result = process_file(path)
        if result:
            print(f'OK: {page}')
            processed += 1
        else:
            print(f'NO CHANGE: {page}')
    print(f'\nProcessed: {processed}/{len(PAGES)}')

if __name__ == '__main__':
    main()
