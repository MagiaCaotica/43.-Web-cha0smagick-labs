/* =============================================================================
   TOOLKIT: la capa de valor comun a todas las herramientas gratuitas.

   Que la herramienta sea gratis no significa que el resultado se quede
   dentro de la pagina. Este script anade tres cosas a CUALQUIER herramienta
   (las del motor comun y las propias):

   1. ACCIONES DE RESULTADO: copiar, descargar el texto, descargar la imagen
      cuando hay lienzo, e imprimir. Sin esto, el resultado de un generador
      de sigilos es un juguete: no te lo puedes llevar.
   2. LECTURAS GUARDADAS: lo que se guarda tiene que poder recuperarse, con
      fecha, y poder abrirse otra vez. Antes se guardaba en el navegador y no
      habia forma de volver a verlo.
   3. SIGUIENTE PASO: que hacer con el resultado, y cual es la version que
      hace esto mejor. Sin una puerta, la herramienta gratuita es un callejon
      sin salida.

   Ademas: una barra de accion fija en movil, para no tener que subir a
   pulsar el boton.

   Se carga en todas las herramientas nativas. No depende de nada.
   ========================================================================== */
(function () {
  'use strict';

  var TOOLS = {};       // slug -> { result, next, value, app }
  // La ruta de datos depende de la profundidad: /tools/x.html esta a un
  // nivel del raiz y /es/tools/x.html a dos.
  var UP = (function () {
    var dirs = location.pathname.split('/').length - 2;
    var s = '';
    for (var i = 0; i < dirs; i++) s += '../';
    return s || './';
  })();
  // Version del catalogo de herramientas: hay que subirla cuando cambie
  // data/toolkit.json, o el CDN sirvira el JSON viejo y el bloque de
  // confianza saldra vacio.
  var DATA_VERSION = '684e2ef3da';
  var DATA_URL = UP + 'data/toolkit.json?v=' + DATA_VERSION;
  var slug = (function () {
    var m = location.pathname.match(/\/tools\/([^/]+)\.html/i);
    return m ? m[1].toLowerCase() : '';
  })();

  /* --------------------------------------------------------- utilidades */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function store(key, value) {
    try {
      if (value === undefined) {
        var raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      }
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) { return false; }
  }
  function stamp() {
    var d = new Date();
    return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  }

  /* ------------------------------------------------- area de resultado */
  function resultArea() {
    var meta = TOOLS[slug] || {};
    if (meta.result) {
      var r = $(meta.result);
      if (r) return r;
    }
    var cand = $('#atomic-result, .tool-result, .result-panel, .results-panel, .result, .output');
    for (var i = 0; i < cand.length; i++) {
      if (cand[i] && cand[i].offsetParent !== null) return cand[i];
    }
    return cand[0] || null;
  }

  function resultText(area) {
    if (!area) return '';
    var clone = area.cloneNode(true);
    // se quitan los titulos: un encabezado fijo no es un resultado, y hacia
    // que la barra de acciones apareciera antes de tener nada que copiar.
    $$('button, .tk-actions, .tk-saved, script, style, h1, h2, h3, h4, h5, h6', clone).forEach(function (n) { n.remove(); });
    return (clone.innerText || clone.textContent || '').replace(/\n{3,}/g, '\n\n').trim();
  }

  /* ------------------------------------------------------ acciones */
  function buildActions(area) {
    if (!area) return;
    var host = area.parentElement || area;

    // Si el area ya tiene una fila de acciones (la del motor comun), se
    // anaden los botones ahi en vez de crear una segunda fila.
    var existing = $('.atomic-actions', host);
    var bar = existing || el('div', 'tk-actions');
    if (!existing) {
      bar.setAttribute('role', 'group');
      bar.setAttribute('aria-label', 'Acciones sobre el resultado');
    }
    if (existing && existing.dataset.tkDone) return;
    if (existing) existing.dataset.tkDone = '1';

    var status = el('span', 'tk-status');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');

    function feedback(msg) {
      status.textContent = msg;
      window.setTimeout(function () { status.textContent = ''; }, 6000);
    }

    var txt = resultText(area);

    var copy = el('button', 'tk-btn tk-btn-ghost', 'Copiar resultado');
    copy.type = 'button';
    copy.addEventListener('click', function () {
      var text = resultText(area);
      if (!text) { feedback('No hay resultado que copiar todavia.'); return; }
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        feedback(ok ? 'Resultado copiado al portapapeles.' : 'No se pudo copiar. Usa Descargar texto.');
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          feedback('Resultado copiado al portapapeles.');
        }, fallback);
      } else {
        fallback();
      }
    });
    bar.appendChild(copy);

    var dl = el('button', 'tk-btn tk-btn-ghost', 'Descargar texto');
    dl.type = 'button';
    dl.addEventListener('click', function () {
      var text = resultText(area);
      if (!text) { feedback('No hay resultado que descargar todavia.'); return; }
      var head = (TOOLS[slug] && TOOLS[slug].name) || 'Resultado';
      var blob = new Blob([head + '\n' + stamp() + '\n\n' + text + '\n\ncha0smagicklabs.com/tools/' + slug + '\n'], { type: 'text/plain;charset=utf-8' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = slug + '-resultado.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(function () { URL.revokeObjectURL(a.href); }, 1500);
      feedback('Texto descargado.');
    });
    bar.appendChild(dl);

    var canvas = $('canvas', area);
    if (canvas) {
      var png = el('button', 'tk-btn tk-btn-ghost', 'Descargar imagen');
      png.type = 'button';
      png.addEventListener('click', function () {
        try {
          var url = canvas.toDataURL('image/png');
          var a = document.createElement('a');
          a.href = url;
          a.download = slug + '.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          feedback('Imagen descargada.');
        } catch (e) {
          feedback('El navegador no permite exportar este lienzo. Usa Captura de pantalla.');
        }
      });
      bar.appendChild(png);
    }

    var print = el('button', 'tk-btn tk-btn-ghost', 'Imprimir');
    print.type = 'button';
    print.addEventListener('click', function () { window.print(); });
    // El motor comun ya pone su propio boton de imprimir dentro del
    // resultado: no se duplica.
    var yaHayImprimir = $$('button', area).some(function (b) {
      return /imprimir|print/i.test(b.textContent || '');
    });
    if (!yaHayImprimir) bar.appendChild(print);

    bar.appendChild(status);
    // Si aun no hay resultado, la barra se oculta: un boton de "copiar" sobre
    // un area vacia parece un fallo.
    if (!resultText(area)) bar.hidden = true;
    if (!existing) host.appendChild(bar);
  }

  /* ------------------------------------------- lecturas guardadas */
  var KEY = 'tk:reading:' + slug;

  function buildSaved() {
    if (document.querySelector('.tk-saved')) return;
    var list = store(KEY);
    if (!list || !list.length) return;

    var section = el('section', 'tk-card tk-saved');
    var h = el('h2', null, 'Tus lecturas guardadas');
    section.appendChild(h);
    var p = el('p', 'tk-muted', 'Se guardan solo en este navegador. No se envian a ningun sitio.');
    section.appendChild(p);

    var ul = el('ul', 'tk-saved-list');
    list.slice().reverse().forEach(function (item) {
      var li = el('li');
      var b = el('button', 'tk-btn tk-btn-ghost tk-saved-open', 'Abrir');
      b.type = 'button';
      b.addEventListener('click', function () {
        var area = resultArea();
        if (!area) return;
        area.innerHTML = item.html || '';
        area.hidden = false;
        buildActions(area);
        area.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      li.appendChild(b);
      var t = el('span', 'tk-saved-title', item.title || 'Lectura');
      li.appendChild(t);
      var d = el('span', 'tk-saved-date', item.at || '');
      li.appendChild(d);
      var del = el('button', 'tk-btn tk-btn-ghost tk-saved-del', 'Borrar');
      del.type = 'button';
      del.addEventListener('click', function () {
        var rest = (store(KEY) || []).filter(function (x) { return x.id !== item.id; });
        store(KEY, rest);
        section.remove();
        if (!rest.length) return;
        buildSaved();
      });
      li.appendChild(del);
      ul.appendChild(li);
    });
    section.appendChild(ul);
    var main = $('main') || document.body;
    main.appendChild(section);
  }

  function watchSaves() {
    // El motor comun guarda con su propio boton; se intercepta para que
    // tambien aparezca en la lista.
    var main = $('main') || document.body;
    var observer = new MutationObserver(function () {
      var btn = $('#atomic-save');
      if (!btn || btn.dataset.tkHooked) return;
      btn.dataset.tkHooked = '1';
      btn.addEventListener('click', function () {
        window.setTimeout(function () {
          var area = resultArea();
          if (!area) return;
          var list = store(KEY) || [];
          list.push({
            id: Date.now(),
            at: stamp(),
            title: ($('h2', area) ? $('h2', area).textContent : 'Lectura'),
            html: area.innerHTML
          });
          if (list.length > 12) list = list.slice(-12);
          store(KEY, list);
          buildSaved();
        }, 60);
      });
    });
    observer.observe(main, { childList: true, subtree: true });
  }

  /* --------------------------------------------------- herramientas embebidas
     La app vive en un iframe externo: no se puede copiar su resultado desde
     aqui. Lo que si sirve es abrirla aparte y llevar el enlace, y avisar si
     el servidor externo no responde. */
  function buildEmbed() {
    var frame = $('iframe');
    if (!frame) return;
    var src = frame.getAttribute('src') || '';
    if (!src) return;

    var cont = frame.closest('.tool-frame') || frame.parentElement;
    if (!cont || cont.querySelector('.tk-embed')) return;

    var box = el('div', 'tk-embed');
    var p = el('p', 'tk-about-text',
      'La herramienta se ejecuta en su propia aplicación, incrustada aquí. Si prefieres usarla en una pestaña aparte, o si no carga, puedes abrirla directamente.');
    box.appendChild(p);

    var fila = el('div', 'tk-actions');
    var abrir = el('a', 'tk-btn tk-btn-ghost', 'Abrir en una pestaña nueva');
    abrir.href = src;
    abrir.target = '_blank';
    abrir.rel = 'noopener';
    fila.appendChild(abrir);

    var copiar = el('button', 'tk-btn tk-btn-ghost', 'Copiar el enlace');
    copiar.type = 'button';
    copiar.addEventListener('click', function () {
      var texto = src;
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = texto;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        document.body.removeChild(ta);
        estado.textContent = ok ? 'Enlace copiado.' : 'No se pudo copiar: abre la herramienta y copia la direccion.';
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(texto).then(function () { estado.textContent = 'Enlace copiado.'; }, fallback);
      } else { fallback(); }
    });
    fila.appendChild(copiar);

    var estado = el('span', 'tk-status');
    estado.setAttribute('role', 'status');
    fila.appendChild(estado);
    box.appendChild(fila);
    cont.appendChild(box);

    // si la app externa no carga en 9 segundos, se avisa con el enlace directo
    var cargado = false;
    frame.addEventListener('load', function () { cargado = true; });
    window.setTimeout(function () {
      if (cargado) return;
      var aviso = el('p', 'tk-embed-fallback');
      aviso.appendChild(el('strong', null, 'La herramienta incrustada no ha cargado. '));
      aviso.appendChild(document.createTextNode('Puede que el servidor externo este lento o caido. Puedes '));
      var a = el('a', null, 'abrirla directamente');
      a.href = src;
      a.target = '_blank';
      a.rel = 'noopener';
      aviso.appendChild(a);
      aviso.appendChild(document.createTextNode(' o probar con la version para Android.'));
      box.insertBefore(aviso, box.firstChild);
    }, 9000);
  }

  /* ---------------------------------------------------- siguiente paso */
  function buildNext() {
    var meta = TOOLS[slug];
    if (!meta || !meta.next) return;
    if (document.querySelector('.tk-next')) return;

    var section = el('section', 'tk-card tk-next');
    var h = el('h2', null, meta.next.title || 'Y ahora que');
    section.appendChild(h);
    if (meta.next.text) section.appendChild(el('p', 'tk-muted', meta.next.text));

    if (meta.value) {
      var v = el('p', 'tk-next-value', meta.value);
      section.appendChild(v);
    }

    if (meta.next.link && meta.next.label) {
      var a = el('a', 'tk-btn', meta.next.label);
      a.href = meta.next.link;
      if (meta.next.external) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      section.appendChild(a);
    }
    var main = $('main') || document.body;
    main.appendChild(section);
  }

  /* ------------------------------------------- bloque sobre la herramienta
     E-E-A-T: que mide y que NO mide, como se usa, que puede esperar el
     usuario, donde acaban sus datos, quien lo hizo y cuando se reviso.
     El motor comun ya pone metodo, expectativa y uso responsable; aqui solo
     se anade lo que falta, para no repetir. */
  function buildAbout() {
    var meta = TOOLS[slug];
    if (!meta || !meta.about) return;
    if (document.querySelector('.tk-about')) return;

    var atomico = !!document.querySelector('[data-atomic-tool]');
    var a = meta.about;
    var section = el('section', 'tk-card tk-about');
    section.appendChild(el('h2', null, 'Sobre esta herramienta'));

    // 1. conflicto de intereses: la app que se recomienda la hacemos nosotros
    if (meta.next && meta.next.label) {
      var d = el('p', 'tk-disclosure-inline');
      d.appendChild(el('strong', null, 'Transparencia: '));
      d.appendChild(document.createTextNode('la versión de pago que aparece más abajo es nuestra, '));
      d.appendChild(document.createTextNode('Cha0smagick Labs. La herramienta gratuita sigue siendo gratuita y sin cuentas; no cobramos por usarla ni guardamos tus datos.'));
      section.appendChild(d);
    }

    // 2. limites
    if (a.limits) {
      section.appendChild(el('h3', null, 'Qué es y qué no es'));
      section.appendChild(el('p', 'tk-about-text', a.limits));
    }

    // 3. metodo, expectativa y uso responsable (solo si la pagina no los trae)
    if (!atomico) {
      if (a.method && a.method.length) {
        section.appendChild(el('h3', null, 'Cómo se usa'));
        var ol = el('ol', 'tk-about-steps');
        a.method.forEach(function (m) { ol.appendChild(el('li', null, m)); });
        section.appendChild(ol);
      }
      if (a.expect) {
        section.appendChild(el('h3', null, 'Qué puedes esperar'));
        section.appendChild(el('p', 'tk-about-text', a.expect));
      }
      if (a.safety) {
        section.appendChild(el('h3', null, 'Uso responsable'));
        section.appendChild(el('p', 'tk-about-text', a.safety));
      }
    }

    // 4. pie: autor, politica editorial, revision y datos
    var foot = el('p', 'tk-about-foot');
    foot.appendChild(document.createTextNode('Herramienta hecha por '));
    var au = el('a', null, 'Frater Alek0s');
    au.href = '../pages/frater-alek0s.html';
    au.rel = 'author';
    foot.appendChild(au);
    foot.appendChild(document.createTextNode('. '));
    var pol = el('a', null, 'Política editorial');
    pol.href = '../pages/editorial-policy.html';
    foot.appendChild(pol);
    if (a.reviewed) {
      var f = new Date(a.reviewed + 'T12:00:00');
      foot.appendChild(document.createTextNode('. Revisada el ' + f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) + '.'));
    }
    foot.appendChild(document.createTextNode(' Todo se calcula en tu navegador: no se envía lo que escribes a ningún servidor y no hace falta cuenta.'));
    section.appendChild(foot);

    var main = $('main') || document.body;
    main.appendChild(section);
  }

  /* --------------------------------------------------- FAQ cuando falta
     Las herramientas propias que no traian preguntas frecuentes reciben las
     suyas, del catalogo. Si la pagina ya tiene <details>, no se duplica nada. */
  function buildFaq() {
    var meta = TOOLS[slug];
    if (!meta || !meta.about || !meta.about.faq || !meta.about.faq.length) return;
    if (document.querySelector('.tk-faq')) return;
    if ($$('details').length) return;

    var section = el('section', 'tk-card tk-faq');
    section.appendChild(el('h2', null, 'Preguntas frecuentes'));
    var lista = el('div', 'tk-faq-list');
    meta.about.faq.forEach(function (par) {
      var d = el('details');
      d.appendChild(el('summary', null, par[0]));
      d.appendChild(el('p', 'tk-about-text', par[1]));
      lista.appendChild(d);
    });
    section.appendChild(lista);
    var main = $('main') || document.body;
    main.appendChild(section);
  }

  /* ------------------------------------------- barra de accion movil */
  function buildMobileBar() {
    if (window.matchMedia('(min-width: 761px)').matches) return;
    var form = $('#atomic-form');
    if (!form || document.querySelector('.tk-mobilebar')) return;
    var submit = $('.atomic-actions .atomic-button[type="submit"]', form);
    if (!submit) return;

    var bar = el('div', 'tk-mobilebar');
    var label = el('span', 'tk-mobilebar-label', 'Tu lectura');
    var b = el('button', 'tk-btn', submit.textContent || 'Generar resultado');
    b.type = 'button';
    b.addEventListener('click', function () {
      var status = $('#atomic-form-status');
      if (status) status.textContent = 'Revisa los campos marcados y pulsa Generar resultado.';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    bar.appendChild(label);
    bar.appendChild(b);
    document.body.appendChild(bar);
  }

  /* ------------------------------------------------------ arranque */
  function enhance() {
    buildEmbed();
    buildActions(resultArea());
    buildSaved();
    buildAbout();
    buildFaq();
    buildNext();
    buildMobileBar();
  }

  /* El motor comun reescribe el HTML del resultado al enviar el formulario:
     si no se observase, la barra de acciones se perderia en cada calculo. */
  function watchResult() {
    var area = resultArea();
    if (!area || area.dataset.tkWatched) return;
    area.dataset.tkWatched = '1';
    var pending = null;
    new MutationObserver(function () {
      window.clearTimeout(pending);
      pending = window.setTimeout(function () {
        var bar = $('.tk-actions', area.parentElement || area);
        if (bar) bar.remove();
        buildActions(area);
        var nuevo = $('.tk-actions', area.parentElement || area);
        if (nuevo) nuevo.hidden = !resultText(area);
      }, 60);
    }).observe(area, { childList: true, subtree: true });
  }

  fetch(DATA_URL)
    .then(function (r) { return r.ok ? r.json() : { tools: {} }; })
    .then(function (data) {
      TOOLS = (data && data.tools) || {};
      enhance();
      watchResult();
      watchSaves();
      document.documentElement.classList.add('tk-ready');
    })
    .catch(function () { enhance(); });
})();
