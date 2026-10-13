// Cha0smagick Labs — buscador interno con preview (js/search.js)
// Lee js/search-index.json y renderiza resultados con título, badge de categoría y preview de descripción.
(function () {
  var input = document.getElementById('search-input');
  var list = document.getElementById('search-results');
  var count = document.getElementById('search-count');
  if (!input || !list) return;
  var INDEX = null;

  fetch('/js/search-index.json').then(function (r) { return r.json(); }).then(function (data) {
    INDEX = data;
    if (count) count.textContent = data.length + ' páginas indexadas';
    // soporte ?q= desde el hub o links externos
    var q = new URLSearchParams(location.search).get('q');
    if (q) { input.value = q; render(q); }
  }).catch(function () { if (count) count.textContent = 'No se pudo cargar el índice'; });

  function score(item, q) {
    var t = (item.t || '').toLowerCase(), d = (item.d || '').toLowerCase(), u = (item.u || '').toLowerCase();
    var s = 0;
    if (t === q) s += 100;
    if (t.indexOf(q) === 0) s += 60; else if (t.indexOf(q) !== -1) s += 30;
    if (d.indexOf(q) !== -1) s += 12;
    if (u.indexOf(q.replace(/-/g, '')) !== -1 || u.indexOf(q) !== -1) s += 8;
    // términos múltiples: todas las palabras deben aparecer en título+desc
    var words = q.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      var all = t + ' ' + d;
      for (var i = 0; i < words.length; i++) if (all.indexOf(words[i]) === -1) return 0;
      s += 20;
    }
    return s;
  }

  var CAT = { blog: 'Guía', tools: 'Herramienta', apps: 'App', books: 'Libro', 'landing-pages': 'Oferta' };

  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) { list.innerHTML = ''; if (count) count.textContent = INDEX ? INDEX.length + ' páginas indexadas' : ''; return; }
    if (!INDEX) return;
    var hits = [];
    for (var i = 0; i < INDEX.length; i++) {
      var s = score(INDEX[i], q);
      if (s > 0) hits.push([s, INDEX[i]]);
    }
    hits.sort(function (a, b) { return b[0] - a[0]; });
    var top = hits.slice(0, 30);
    if (count) count.textContent = top.length ? top.length + ' resultados (de ' + hits.length + ')' : 'Sin resultados — prueba con otra palabra';
    list.innerHTML = top.map(function (h) {
      var it = h[1];
      var cat = CAT[it.u.split('/')[1]] || '';
      var badge = cat ? '<span class="badge">' + cat + '</span>' : '';
      return '<a class="result" href="' + it.u + '"><b>' + it.t + '</b>' + badge + '<p>' + it.d + '</p></a>';
    }).join('');
  }

  var t = null;
  input.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { render(input.value); }, 180); });
})();
