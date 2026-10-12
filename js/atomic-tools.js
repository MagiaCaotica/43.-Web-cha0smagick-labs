/* Atomic Tools engine v2 - real per-tool computation, local-only, no deps. */
(function () {
  'use strict';

  var DATA_URL = '../data/atomic-tools.json';
  var host = document.querySelector('[data-atomic-tool]');
  if (!host) return;
  var toolId = host.getAttribute('data-atomic-tool') || '';
  var mount = document.getElementById('atomic-app');
  if (!mount) return;

  /* ---------- utils ---------- */
  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function list(v) { return Array.isArray(v) ? v : (v ? [v] : []); }
  function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
  function load(key) { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (e) { return null; } }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function seedFrom(str) {
    var h = 2166136261;
    str = String(str || '');
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function fromYmd(s) { var p = String(s).split('-'); return new Date(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  function fmtDate(s) {
    var d = fromYmd(s); if (isNaN(d.getTime())) return '';
    return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
  }
  function track(name, props) {
    try { if (window.Cha0Analytics && typeof window.Cha0Analytics.track === 'function') window.Cha0Analytics.track(name, props); } catch (e) {}
  }

  /* ---------- astronomy (mean elements, no ephemeris) ---------- */
  var J2000 = Date.UTC(2000, 0, 1, 12, 0, 0);
  function daysSinceJ2000(date) { return (date.getTime() - J2000) / 86400000; }
  function sunLongitude(date) { return ((280.460 + 0.98564736 * daysSinceJ2000(date)) % 360 + 360) % 360; }
  function moonLongitude(date) { return ((218.316 + 13.176396 * daysSinceJ2000(date)) % 360 + 360) % 360; }
  function phaseAngle(date) { return ((moonLongitude(date) - sunLongitude(date)) % 360 + 360) % 360; }
  function phaseName(deg) {
    if (deg < 11.25 || deg >= 348.75) return 'Luna Nueva';
    if (deg < 78.75) return 'Creciente inicial';
    if (deg < 101.25) return 'Cuarto Creciente';
    if (deg < 168.75) return 'Gibosa Creciente';
    if (deg < 191.25) return 'Luna Llena';
    if (deg < 258.75) return 'Gibosa Menguante';
    if (deg < 281.25) return 'Cuarto Menguante';
    return 'Menguante inicial';
  }
  function illum(deg) { return Math.round((1 - Math.cos(deg * Math.PI / 180)) / 2 * 100); }

  var SIGNS = [
    { n: 'Aries', e: 'Fuego', m: 'Cardinal', r: 'Marte', ini: [3, 21], fin: [4, 19] },
    { n: 'Tauro', e: 'Tierra', m: 'Fijo', r: 'Venus', ini: [4, 20], fin: [5, 20] },
    { n: 'Géminis', e: 'Aire', m: 'Mutable', r: 'Mercurio', ini: [5, 21], fin: [6, 20] },
    { n: 'Cáncer', e: 'Agua', m: 'Cardinal', r: 'Luna', ini: [6, 21], fin: [7, 22] },
    { n: 'Leo', e: 'Fuego', m: 'Fijo', r: 'Sol', ini: [7, 23], fin: [8, 22] },
    { n: 'Virgo', e: 'Tierra', m: 'Mutable', r: 'Mercurio', ini: [8, 23], fin: [9, 22] },
    { n: 'Libra', e: 'Aire', m: 'Cardinal', r: 'Venus', ini: [9, 23], fin: [10, 22] },
    { n: 'Escorpio', e: 'Agua', m: 'Fijo', r: 'Plutón', ini: [10, 23], fin: [11, 21] },
    { n: 'Sagitario', e: 'Fuego', m: 'Mutable', r: 'Júpiter', ini: [11, 22], fin: [12, 21] },
    { n: 'Capricornio', e: 'Tierra', m: 'Cardinal', r: 'Saturno', ini: [12, 22], fin: [1, 19] },
    { n: 'Acuario', e: 'Aire', m: 'Fijo', r: 'Urano', ini: [1, 20], fin: [2, 18] },
    { n: 'Piscis', e: 'Agua', m: 'Mutable', r: 'Neptuno', ini: [2, 19], fin: [3, 20] }
  ];
  function signOf(lon) { return SIGNS[Math.floor((((lon % 360) + 360) % 360) / 30) % 12]; }
  function sunSign(date) {
    var m = date.getMonth() + 1, d = date.getDate();
    for (var i = 0; i < SIGNS.length; i++) {
      var s = SIGNS[i];
      if (s.ini[0] === s.fin[0]) { if (m === s.ini[0] && d >= s.ini[1] && d <= s.fin[1]) return s; continue; }
      if (s.ini[0] < s.fin[0]) { if ((m === s.ini[0] && d >= s.ini[1]) || (m === s.fin[0] && d <= s.fin[1])) return s; continue; }
      if ((m === s.ini[0] && d >= s.ini[1]) || (m === s.fin[0] && d <= s.fin[1])) return s;
    }
    return SIGNS[0];
  }
  var DAY_RULER = ['Sol', 'Luna', 'Marte', 'Mercurio', 'Jupiter', 'Venus', 'Saturno'];
  var DAY_RULER_ES = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  var CHALDEAN = ['Saturno', 'Jupiter', 'Marte', 'Sol', 'Venus', 'Mercurio', 'Luna'];
  var CHALDEAN_NUM = { Saturno: 3, Jupiter: 4, Marte: 5, Sol: 6, Venus: 7, Mercurio: 8, Luna: 1 };
  var ACCENT = { Jupiter: 'Júpiter', Miercoles: 'Miércoles', Sabado: 'Sábado' };
  function accent(s) { return ACCENT[s] || s; }

  /* ---------- reference data ---------- */
  var MAJORS = [
    ['El Loco', 'inicio, libertad, riesgo', 'Avanza sin mapa; no fuerces el salto', 'Si, si actúas', 'Moneda sin valor', 'Aire'],
    ['La Maga', 'poder, recurso, voluntad', 'Ya tienes lo necesario a mano', 'Si', 'Vela negra o azul', 'Agua'],
    ['La Sacerdotisa', 'secreto, silencio, saber oculto', 'Observa antes de hablar', 'No', 'Guarda el dato que no has contado', 'Agua'],
    ['La Emperatriz', 'creatividad, fertilidad, deleite', 'Deja crecer algo sin podarlo', 'Si', 'Pan y agua sobre la mesa', 'Tierra'],
    ['El Emperador', 'estructura, límite, autoridad', 'Ordena el marco del deseo', 'Si', 'Sello de cera y regla fija', 'Fuego'],
    ['El Hierofante', 'tradición, enseñanza, marca', 'Usa lo aprendido; no inventes el dogma', 'Si', 'Palabra clave y ceremonia', 'Tierra'],
    ['Los Enamorados', 'elección, vínculo, valores', 'Decide con lo que de verdad importa', 'Si', 'Dos opciones escritas', 'Aire'],
    ['El Carro', 'avance, dirección, victoria', 'Mueve sin mirar atrás', 'Si', 'Maniobra con volante fijo', 'Agua'],
    ['La Justicia', 'equilibrio, verdad, consecuencia', 'Paga lo que debe pagarse', 'Si', 'Balanza y escritura recta', 'Aire'],
    ['El Ermitaño', 'retiro, estudio, búsqueda', 'Cierra la puerta y busca dentro', 'No', 'Luz tenue y silencio', 'Tierra'],
    ['La Rueda de la Fortuna', 'giro, azar, ciclo', 'Acepta el cambio de turno', 'Variable', 'Rueda, dados o molinillo', 'Fuego'],
    ['La Fuerza', 'dominio suave, paciencia', 'Domina el impulso con paciencia', 'Si', 'Manejo consciente de la fuerza', 'Fuego'],
    ['El Colgado', 'suspensión, entrega, otra mirada', 'Cambia el ángulo y espera', 'No', 'Inversión de perspectiva', 'Agua'],
    ['La Muerte', 'fin, cierre, transformación', 'Termina para poder empezar', 'No', 'Lista de cierre', 'Agua'],
    ['La Templanza', 'mesura, mezcla, paciencia', 'Ajusta la mezcla sin forzarla', 'Si', 'Dos vasos y moderación', 'Fuego'],
    ['El Diablo', 'apego, sombra, atadura', 'Mira el lazo que tú eliges', 'No', 'Cadena propia o espejo', 'Tierra'],
    ['La Torre', 'ruptura, revelación, crisis', 'Lo que cae, cae porque no aguantaba', 'Si, destructivo', 'Cae una estructura inútil', 'Fuego'],
    ['La Estrella', 'esperanza, guía, inspiración', 'Sigue la luz pequeña, no la grande', 'Si', 'Agua bajo las estrellas', 'Aire'],
    ['La Luna', 'sueño, miedo, espejismo', 'Lo que ves de noche cambia a la luz', 'No', 'Luz difusa y tiniebla', 'Agua'],
    ['El Sol', 'claridad, éxito, alegría', 'Se puede ver: conviene decirlo', 'Si', 'Luz directa y calor', 'Fuego'],
    ['El Juicio', 'llamado, despertar, balance', 'Se acabó la duda: elige y responde', 'Si', 'Llamado interno con nombre propio', 'Fuego'],
    ['El Mundo', 'cierre completo, integración', 'Cierra el ciclo y celébralo', 'Si', 'Corona y círculo cerrado', 'Tierra']
  ];
  var SUITS = {
    Bastos: { e: 'Fuego', t: 'acción, deseo, creación' },
    Copas: { e: 'Agua', t: 'sentimiento, relación, imaginación' },
    Espadas: { e: 'Aire', t: 'mente, conflicto, verdad' },
    Oros: { e: 'Tierra', t: 'materia, trabajo, recurso' }
  };
  var RANKS = ['As', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve', 'Diez', 'Sota', 'Caballero', 'Reina', 'Rey'];
  var RANK_MEAN = {
    As: 'comienzo limpio', Dos: 'equilibrio en tensión', Tres: 'primer crecimiento', Cuatro: 'estabilidad y pausa',
    Cinco: 'choque y ajuste', Seis: 'acuerdo', Siete: 'evaluación y duda', Ocho: 'movimiento rápido',
    Nueve: 'cumbre y ceder a', Diez: 'cierre de ciclo', Sota: 'mensaje o noticia',
    Caballero: 'impulso dirigido', Reina: 'dominio por sagacidad', Rey: 'autoridad y estructura'
  };
  function buildDeck() {
    var d = [], suitKeys = Object.keys(SUITS);
    MAJORS.forEach(function (m, i) {
      d.push({
        name: m[0], arcana: 'Arcano Mayor ' + (i + 1), kw: m[1], mean: m[2], el: m[5],
        rev: 'Al revés la energía se bloquea o se exagera: mismo tema, otra forma.'
      });
    });
    suitKeys.forEach(function (s) {
      RANKS.forEach(function (r) {
        d.push({
          name: r + ' de ' + s, arcana: 'Arcano Menor', kw: SUITS[s].t, el: SUITS[s].e,
          mean: 'Clave de ' + RANK_MEAN[r] + ', en energía de ' + SUITS[s].e.toLowerCase() + '.',
          rev: 'Al revés, ' + RANK_MEAN[r].split(' ')[0] + ' se vuelve resistencia o se entrega antes de tiempo.'
        });
      });
    });
    return d;
  }
  var DECK = buildDeck();

  var LENORMAND = [
    ['Caballero', 'noticias, llegada'], ['Trébol', 'suerte breve'], ['Arpa', 'música, curación'],
    ['Nave', 'viaje, sin hogar'], ['Árbol', 'salud, crecimiento lento'], ['Nube', 'confusión, reserva'],
    ['Serpiente', 'enredo, lo no deseado'], ['Cofre', 'riqueza, ahorro'], ['Gato', 'femenino, vecindario'],
    ['Carta', 'documento, verdad escrita'], ['Cuchara', 'unión, éxito lento'], ['Calle', 'camino, dependencia'],
    ['Ratones', 'desgaste, pérdida'], ['Corazón', 'amor, emoción'], ['Águila', 'éxito, mirada alta'],
    ['Estrella', 'claridad, guía'], ['Búho', 'sabiduría, vigilancia'], ['Rana', 'renovación, salto'],
    ['Sello', 'apoyo, documento oficial'], ['Pajarita', 'velocidad, descarga'], ['Osito', 'dulzor, infancia'],
    ['Lirio', 'pureza, sensualidad'], ['Sol', 'energía, éxito claro'], ['Luna', 'recompensa, reconocimiento'],
    ['Clave', 'seguridad, dinero guardado'], ['Cruz', 'carga, inacabado'], ['Mordaza', 'silencio, secreto'],
    ['Calavera', 'peligro, muerte simbólica'], ['Ancla', 'trabajo, estabilidad'], ['Destilación', 'transformación, crisis'],
    ['Mariposas', 'cambio, libertad'], ['Racimo', 'cosecha, abundancia'], ['Yunque', 'voluntad, trabajo duro'],
    ['Bruja', 'duda, magia femenina'], ['Hielos', 'soledad, pausa'], ['Mar', 'abundancia, emociones'],
    ['Moneda', 'dinero, desembolso']
  ];

  var RUNES = [
    ['ᚠ', 'Fehu', 'f', 'riqueza, flujo', 'Fuego'],
    ['ᚢ', 'Uruz', 'u', 'fuerza bruta, inicio', 'Tierra'],
    ['ᚦ', 'Thurisaz', 'th', 'ruptura, conflicto, necesidad', 'Fuego'],
    ['ᚨ', 'Ansuz', 'a', 'voz, palabra, señal', 'Aire'],
    ['ᚱ', 'Raidho', 'r', 'viaje, orden, victoria', 'Aire'],
    ['ᚲ', 'Kenaz', 'k', 'fuego pequeño, discusión', 'Fuego'],
    ['ᚷ', 'Gebo', 'g', 'don, intercambio', 'Aire'],
    ['ᚹ', 'Wunjo', 'w', 'gloria, armonía', 'Aire'],
    ['ᚺ', 'Hagalaz', 'h', 'adversidad, perturbación', 'Aire'],
    ['ᚾ', 'Nauthiz', 'n', 'necesidad, restricción', 'Hielo'],
    ['ᛁ', 'Isa', 'i', 'quietud, espera', 'Hielo'],
    ['ᛃ', 'Jera', 'j', 'cosecha madura, ciclos', 'Aire'],
    ['ᛇ', 'Eihwaz', 'ei', 'protección, alerta', 'Hielo'],
    ['ᛈ', 'Perthro', 'p', 'apertura, posibilidad', 'Agua'],
    ['ᛉ', 'Algiz', 'z', 'protección, intuición', 'Aire'],
    ['ᛊ', 'Sowilo', 's', 'sol, éxito', 'Fuego'],
    ['ᛏ', 'Tiwaz', 't', 'espada, justicia', 'Fuego'],
    ['ᛒ', 'Berkano', 'b', 'crecimiento, fertilidad', 'Tierra'],
    ['ᛖ', 'Ehwaz', 'e', 'caballo, movimiento', 'Aire'],
    ['ᛗ', 'Mannaz', 'm', 'humanidad, resolución', 'Agua'],
    ['ᛚ', 'Laguz', 'l', 'oscuridad, agua', 'Agua'],
    ['ᛜ', 'Ingwaz', 'ng', 'potencial, fertilidad', 'Fuego'],
    ['ᛞ', 'Dagaz', 'd', 'umbral, amanecer', 'Aire'],
    ['ᛟ', 'Othala', 'o', 'legado, raíz', 'Tierra']
  ];
  var RUNE_MAP = {
    a: 'ᚨ', b: 'ᛒ', d: 'ᛞ', e: 'ᛖ', f: 'ᚠ', g: 'ᚷ', h: 'ᚺ', i: 'ᛁ', k: 'ᚲ',
    l: 'ᛚ', m: 'ᛗ', n: 'ᚾ', o: 'ᛟ', p: 'ᛈ', r: 'ᚱ', s: 'ᛊ', t: 'ᛏ', u: 'ᚢ', w: 'ᚹ', z: 'ᛉ'
  };
  RUNE_MAP['ng'] = 'ᛜ'; RUNE_MAP['th'] = 'ᚦ'; RUNE_MAP['ei'] = 'ᛇ';

  var OGHAM = [
    ['Beithe', 'B', 'fresno', 'movimiento, rayo, escritura'],
    ['Luis', 'L', 'salvia', 'sombra, ciclo'],
    ['Fearn', 'F', 'aliso', 'flujo, escucha'],
    ['Sail', 'S', 'sauce', 'asombro, valor'],
    ['Nuin', 'N', 'nogal', 'conflicto, poder oculto'],
    ['Huath', 'H', 'espino', 'dureza, gran energía'],
    ['Dair', 'D', 'roble', 'puerta, decisión'],
    ['Tinne', 'T', 'espino blanco', 'victoria, rechazo'],
    ['Coll', 'C', 'avellano', 'potencial, magia'],
    ['Cress', 'C', 'aliso', 'protegido, cambio'],
    ['Gort', 'G', 'hiedra', 'invierno, muerte y renacimiento'],
    ['Getal', 'G', 'rosa de verano', 'oso, misterio'],
    ['Ruis', 'R', 'serbal', 'defensa, hechizo'],
    ['Ailm', 'A', 'aliso', 'rayo, pureza'],
    ['Onn', 'O', 'rosa de verano', 'luna, fertilidad'],
    ['Ur', 'U', 'brezo', 'necesidad, deseo'],
    ['Eadbhadh', 'E', 'manzano', 'juicio, escritura'],
    ['Eamhancholl', 'E', 'arce', 'protección, elección'],
    ['Straif', 'S', 'espada', 'poder, acción'],
    ['Rigil', 'R', 'roble', 'ciclo, integridad']
  ];

  var DREAM = {
    agua: ['Inconsciente emocional', 'adaptarse, soltar o sentirte ahogado en lo que sientes'],
    sangre: ['Vida y cuerpo', 'límite o herida que pide atención'],
    muerte: ['Transformación', 'fin real de un ciclo; en el sueño nadie muere de verdad'],
    volar: ['Libertad y trascendencia', 'alejarte del problema o despegue interno'],
    perro: ['Instinto y lealtad', 'un instinto que te avisa de algo'],
    gato: ['Independencia y magia doméstica', 'secreto o sensualidad'],
    casa: ['El self y la familia', 'seguridad o malestar según el estado del hogar'],
    madre: ['Origen y cuidado', 'sostén o dependencia'],
    padre: ['Autoridad y ley', 'estructura o juicio interno'],
    dientes: ['Pérdida de control', 'transición y ansiedad por lo que se agota'],
    embarazo: ['Nuevo proyecto', 'algo que crece y aún no tiene nombre'],
    examen: ['Juicio externo', 'miedo a la evaluación'],
    persecucion: ['Amenaza difusa', 'evitación activa'],
    caer: ['Pérdida de control', 'soltar y despertar'],
    incendio: ['Purga urgente', 'transformación que hay que atravesar'],
    oscuridad: ['Lo no iluminado', 'bajar a lo profundo a propósito'],
    escalera: ['Ascenso o descenso', 'niveles de tu propia experiencia'],
    aguas: ['Proceso de cambio', 'lo que se mueve por dentro']
  };

  var CANDLES = {
    Blanco: { p: 'Luna', e: 'espiritualidad, pureza, alineación', d: 'limpieza y nuevos comienzos', w: 'bendición y paz' },
    Amarillo: { p: 'Sol', e: 'claridad, éxito', d: 'dinero y abundancia', w: 'trabajo y excelencia' },
    Rojo: { p: 'Marte', e: 'poder, deseo', d: 'coraje y pasión', w: 'acción rápida' },
    Azul: { p: 'Jupiter', e: 'protección, expansión', d: 'comunicación', w: 'estudio y viajes' },
    Verde: { p: 'Mercurio', e: 'trabajo, salud', d: 'dinero y estudio', w: 'negocios y aprendizaje' },
    Morado: { p: 'Saturno', e: 'poder espiritual, obstáculos', d: 'liberación', w: 'protección e iniciación' }
  };

  var ELEM = {
    Fuego: { d: 'Este o Sureste', day: 'Martes', col: 'Rojo, naranja, amarillo', inc: 'clavo y canela', planet: 'Sol y Marte', suit: 'Bastos', rune: 'Fehu', n: 'emprender, deseo y acción' },
    Tierra: { d: 'Sur o Suroeste', day: 'Sabado', col: 'Verde, marrón, amarillo pálido', inc: 'cedro y vetiver', planet: 'Saturno y Venus', suit: 'Oros', rune: 'Berkano', n: 'cuerpo, dinero y constancia' },
    Aire: { d: 'Oeste o Noroeste', day: 'Miercoles', col: 'Blanco, gris, amarillo claro', inc: 'lavanda y romero', planet: 'Mercurio y Jupiter', suit: 'Espadas', rune: 'Raidho', n: 'palabra, idea y aprendizaje' },
    Agua: { d: 'Norte o Noreste', day: 'Lunes', col: 'Azul, verde azulado, blanco', inc: 'salvia y sándalo', planet: 'Luna y Neptuno', suit: 'Copas', rune: 'Laguz', n: 'emoción, sueño y vínculo' }
  };

  var CHALDEAN_LETTER = {
    a: [1, 'Saturno'], b: [2, 'Jupiter'], c: [3, 'Marte'], d: [4, 'Sol'], e: [5, 'Venus'], f: [6, 'Mercurio'],
    g: [7, 'Luna'], h: [8, 'Saturno'], i: [9, 'Jupiter'], j: [1, 'Jupiter'], k: [2, 'Marte'], l: [3, 'Sol'],
    m: [4, 'Venus'], n: [5, 'Mercurio'], o: [6, 'Luna'], p: [7, 'Saturno'], q: [8, 'Jupiter'], r: [9, 'Marte'],
    s: [1, 'Sol'], t: [2, 'Venus'], u: [3, 'Mercurio'], v: [4, 'Luna'], w: [5, 'Saturno'], x: [6, 'Jupiter'],
    y: [7, 'Marte'], z: [8, 'Sol']
  };

  var ELEM_KEYWORDS = {
    fuego: ['pasion', 'accion', 'empezar', 'atreverse', 'coraje', 'deseo', 'ambicion', 'deporte', 'crear', 'liderar'],
    tierra: ['dinero', 'casa', 'salud', 'estabilidad', 'trabajo', 'emprender', 'construir', 'habito', 'cuerpo', 'practica'],
    aire: ['estudio', 'hablar', 'comunicar', 'escribir', 'aprender', 'idea', 'negocio', 'redes', 'viaje', 'ensayo'],
    agua: ['amor', 'familia', 'sueno', 'intuicion', 'sanacion', 'duelo', 'perdon', 'vinculo', 'relacion', 'llanto', 'proteccion']
  };

  /* ---------- per-kind computation ---------- */
  function R(title, lead) { return { title: title, lead: lead, rows: [], blocks: [], tips: [] }; }

  var KINDS = {};

  KINDS['birth-chart'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var s = sunSign(d), moon = signOf(moonLongitude(d)), ph = phaseAngle(d);
    var mode = {
      Fuego: 'con impulso y convicción', Tierra: 'con método y sentido práctico',
      Aire: 'con curiosidad y palabra', Agua: 'con emoción y memoria'
    }[s.e];
    var r = R('Carta natal en lectura de síntesis', 'Sol en ' + s.n + ', Luna en ' + moon.n + ', regente ' + s.r + '.');
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Sol', value: s.n + ' (' + s.e + ', ' + s.m + ')' });
    r.rows.push({ label: 'Luna', value: moon.n + ' (' + moon.e + ')' });
    r.rows.push({ label: 'Fase lunar', value: phaseName(ph) + ', ' + illum(ph) + '% iluminada' });
    r.rows.push({ label: 'Regente', value: accent(s.r) });
    r.blocks.push({ h: 'Qué dice tu Sol', p: ['Tu energía vital sale de ' + s.n + ' (' + norm(s.e) + '): actúas ' + mode + '.', 'El regente ' + accent(s.r) + ' es el planeta que más pesa en tu vida.'] });
    r.blocks.push({ h: 'Cómo integrarlo', p: ['Lee tu Luna (' + moon.n + ') como la parte emocional que necesita cuidado.', 'Hoy tu fase es ' + norm(phaseName(ph)) + ': tu umbral interno pide ' + (illum(ph) > 50 ? 'soltar y revisar' : 'sembrar y empezar') + '.'] });
    r.tips.push('Es una aproximación sin efemérides: el ascendente y las casas exactas los calcula la app Astral Lab.');
    return r;
  };

  KINDS['rising-sign'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var p = String(v.time || '06:00').split(':'), hh = +p[0] || 6, mm = +p[1] || 0;
    var s = sunSign(d), off = Math.round((hh + mm / 60 - 6) / 2) % 12;
    var asc = SIGNS[(SIGNS.indexOf(s) + off + 24) % 12];
    var way = { Fuego: 'con energía directa', Tierra: 'con calma práctica', Aire: 'con conversación', Agua: 'con sensibilidad' }[asc.e];
    var r = R('Ascendente estimado', 'El ascendente avanza un signo cada dos horas desde el orto.');
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Hora', value: v.time });
    r.rows.push({ label: 'Sol', value: s.n });
    r.rows.push({ label: 'Ascendente', value: accent(asc.n) + ' (' + asc.e + ')' });
    r.rows.push({ label: 'Regente', value: accent(asc.r) });
    r.blocks.push({ h: 'Qué es el ascendente', p: ['Es tu puerta de entrada: el estilo con el que te ven y abres cada situación.', 'En ' + accent(asc.n) + ' (' + norm(asc.e) + ') arrancas ' + way + '.'] });
    r.blocks.push({ h: 'Para afinar', p: ['Falta tu ciudad de nacimiento para calcularlo con coordenadas reales y casas exactas.'] });
    r.tips.push('La app Astral Lab calcula ascendente y casas con efemérides exactas.');
    return r;
  };

  KINDS['moon-sign'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var lon = moonLongitude(d), m = signOf(lon), ph = phaseAngle(d);
    var reg = { Aries: 'Marte', Tauro: 'Venus', 'Géminis': 'Mercurio', 'Cáncer': 'Luna', Leo: 'Sol', Virgo: 'Mercurio', Libra: 'Venus', Escorpio: 'Plutón y Marte', Sagitario: 'Júpiter', Capricornio: 'Saturno', Acuario: 'Urano', Piscis: 'Neptuno' };
    var r = R('Tu signo lunar', 'La Luna recorre el zodiaco cada 27,3 días; esta es una aproximación por longitud media.');
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Luna en', value: m.n + ' (' + m.e + ')' });
    r.rows.push({ label: 'Grado aproximado', value: Math.round(lon % 30) + ' grados' });
    r.rows.push({ label: 'Fase', value: phaseName(ph) + ', ' + illum(ph) + '% iluminada' });
    r.rows.push({ label: 'Regente lunar', value: accent(reg[m.n] || '') });
    r.blocks.push({ h: 'Qué indica la Luna', p: ['Tu Luna en ' + m.n + ' describe cómo necesitas sentirte seguro y cómo te nutres emocionalmente.', 'Regida por ' + accent(reg[m.n] || 'un planeta') + ': ahí está el recurso de tu mundo emocional.'] });
    r.blocks.push({ h: 'Práctica', p: ['Cuando te sientes alterado, vuelve a lo que tu Luna ' + m.n + ' necesita: ritmo, compañía o espacio.'] });
    r.tips.push('Cerca de un cúspide la lectura puede variar un día: la app Astral Lab usa efemérides exactas.');
    return r;
  };

  KINDS['cusp'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var s = sunSign(d), next = SIGNS[(SIGNS.indexOf(s) + 1) % 12], prev = SIGNS[(SIGNS.indexOf(s) + 11) % 12];
    var r = R('Cúspide solar', 'Tu Sol está en ' + s.n + ' el ' + fmtDate(v.date) + '.');
    r.rows.push({ label: 'Signo solar', value: s.n });
    r.rows.push({ label: 'Entra', value: next.n + ' desde el ' + next.ini[0] + ' de ' + MESES[next.ini[1] - 1] });
    r.rows.push({ label: 'Sale', value: prev.n });
    r.rows.push({ label: 'Tu fecha', value: d.getDate() + '/' + (d.getMonth() + 1) });
    r.blocks.push({ h: 'Cómo leer un borde solar', p: ['Sol en ' + s.n + ' significa que esa expresión se hace más visible en la segunda mitad de ' + next.n + '.', 'En las primeras semanas de ' + s.n + ' sueles sentirte más ' + norm(prev.n) + '.', 'A tres días del cambio la lectura es bisagra: mezcla de ambos signos.'] });
    r.blocks.push({ h: 'Uso práctico', p: ['Si tu fecha coincide con el cambio, enfócate en el signo de grado que tengas, no solo en el nombre.'] });
    return r;
  };

  KINDS['retrograde'] = function (v) {
    var parts = String(v.month || '').split('-');
    var month = +parts[1], year = +v.year || +parts[0];
    if (!year || !month) return null;
    var plan = [
      { p: 'Mercurio', per: 115.877, len: 21, anchor: Date.UTC(2025, 2, 14), inv: 'comunicar, contratos, viajes' },
      { p: 'Venus', per: 583.92, len: 42, anchor: Date.UTC(2025, 2, 1), inv: 'amor, valores, dinero' },
      { p: 'Marte', per: 779.94, len: 72, anchor: Date.UTC(2024, 11, 6), inv: 'acción, conflicto, energía' }
    ];
    var found = [], y0 = Date.UTC(year, 0, 1), y1 = Date.UTC(year + 1, 0, 1);
    plan.forEach(function (a) {
      var k = Math.floor((y0 - a.anchor) / (a.per * 86400000));
      for (var n = k - 1; n <= k + Math.ceil((y1 - y0) / (a.per * 86400000)) + 1; n++) {
        var st = a.anchor + n * a.per * 86400000;
        if (st < y0 || st >= y1) continue;
        if (new Date(st).getMonth() !== month - 1) continue;
        found.push(a.p + ' retrógrado del ' + new Date(st).getDate() + '/' + month + ' al ' + new Date(st + a.len * 86400000).getDate() + '/' + month + ' - temas: ' + a.inv);
      }
    });
    var r = R('Retrógrados de ' + month + '/' + year, 'Ventanas aproximadas por período sinódico, con margen de tres días.');
    r.rows.push({ label: 'Mes', value: month + '/' + year });
    r.rows.push({ label: 'Ventanas', value: found.length ? found.length + ' en este mes' : 'Ninguna mayor' });
    r.blocks.push({ h: 'Ventanas', p: found.length ? found : ['No se detectan retrógrados mayores en este mes según el cálculo.'] });
    r.blocks.push({ h: 'Cómo usar el retrógrado', p: ['En retrógrado se revisa, no se lanza: contratos, compras grandes y decisiones de amor esperan.', 'Sirve para limpiar, corregir y reescribir; evita empezar desde cero.'] });
    r.tips.push('Las fechas reales varían cada año: la app Astral Lab mantiene el calendario actualizado.');
    return r;
  };

  KINDS['planetary-day'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var wd = d.getDay(), ruler = accent(DAY_RULER[wd]), ph = phaseAngle(d);
    var fav = {
      Sol: 'visibilidad, vitalidad y liderazgo', Luna: 'emociones, casa y ciclos',
      Marte: 'acción, deseo y coraje', Mercurio: 'estudio, habla y negocios',
      Jupiter: 'expansión, suerte y enseñanza', Venus: 'amor, belleza y armonía',
      Saturno: 'estructura, disciplina y tiempo'
    }[DAY_RULER[wd]];
    var r = R('Día planetario: ' + accent(DAY_RULER_ES[wd]), ruler + ' rige este día.');
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Regente', value: ruler });
    r.rows.push({ label: 'Número planetario', value: String(CHALDEAN_NUM[DAY_RULER[wd]]) });
    r.rows.push({ label: 'Fase lunar', value: phaseName(ph) + ' (' + illum(ph) + '%)' });
    r.blocks.push({ h: 'Se recomienda hoy', p: [fav + '.'] });
    r.blocks.push({ h: 'Tabla rápida', p: ['Puedes calcular tus horas planetarias con la herramienta de Horas Planetarias.'] });
    return r;
  };

  KINDS['tarot-reference'] = function (v) {
    var q = norm(v.query);
    var res = DECK.filter(function (c) { return norm(c.name + ' ' + c.kw + ' ' + c.arcana).indexOf(q) !== -1; }).slice(0, 12);
    var r = R('Referencia de Tarot', 'Mazo Rider-Waite: 22 arcanos mayores y 56 menores.');
    r.rows.push({ label: 'Búsqueda', value: v.query || 'todas' });
    r.rows.push({ label: 'Coincidencias', value: String(res.length) });
    r.blocks.push({ h: 'Arcana', p: res.length ? res.map(function (c) { return c.name + ' - ' + c.kw + '. Al derecho: ' + c.mean + ' Al revés: ' + c.rev; }) : ['Sin coincidencias. Prueba con una palabra clave como amor, dinero o conflicto.'] });
    return r;
  };

  KINDS['spread-builder'] = function (v) {
    var q = v.question || '', n = +v.count || 3;
    var positions = { 1: ['Mensaje central'], 2: ['Sí o No', 'Bloqueo actual'], 3: ['Pasado', 'Presente', 'Futuro'], 4: ['Situación', 'Obstáculo', 'Consejo', 'Resultado'], 5: ['Pasado', 'Presente', 'Futuro', 'Consejo', 'Síntesis'] }[n] || ['Lectura libre'];
    var rnd = rng(seedFrom(q + v.count + new Date().toDateString()));
    var cards = [], r = R('Tirada de ' + n + ' cartas', 'Posiciones: ' + positions.join(' | '));
    for (var i = 0; i < n; i++) {
      var c = DECK[Math.floor(rnd() * DECK.length)], rev = rnd() > 0.5;
      cards.push({ c: c, rev: rev, pos: positions[i] });
      r.rows.push({ label: positions[i], value: c.name + (rev ? ' (al revés)' : '') });
    }
    r.blocks.push({ h: 'Interpretación', p: cards.map(function (x) { return x.pos + ': ' + x.c.mean + (x.rev ? ' Al revés: ' + x.c.rev : ''); }) });
    r.blocks.push({ h: 'Qué esperar', p: ['Es una lectura simbólica de autoconocimiento, no una predicción.'] });
    r.tips.push('La app de Tarot Rider-Waite tiene las 78 cartas con imágenes y reverso.');
    return r;
  };

  KINDS['journal'] = function (v) {
    var r = R('Registro de tarot', v.question ? 'Pregunta: ' + v.question : 'Entrada de diario.');
    r.rows.push({ label: 'Fecha', value: new Date().toLocaleDateString('es') });
    r.rows.push({ label: 'Pregunta', value: v.question || 'sin pregunta' });
    r.rows.push({ label: 'Notas', value: v.notes ? 'escritas' : 'no escritas' });
    r.blocks.push({ h: 'Siguiente paso', p: ['Guarda la pregunta y las notas con el botón de guardar.', 'Vuelve en 48 horas y responde: qué cambió en la situación y en tu cuerpo.'] });
    return r;
  };

  KINDS['draw'] = function (v) {
    var n = +v.count || 3, rnd = rng(seedFrom(v.question + new Date().toDateString()));
    var cards = [], r = R('Lectura Lenormand de ' + n + ' cartas', v.question ? 'Sobre: ' + v.question : 'Sin pregunta: se lee como mensaje general.');
    for (var i = 0; i < n; i++) {
      var c = LENORMAND[Math.floor(rnd() * LENORMAND.length)];
      cards.push(c);
      r.rows.push({ label: 'Carta ' + (i + 1), value: c[0] + ' - ' + c[1] });
    }
    r.blocks.push({ h: 'Combinaciones', p: cards.length > 1 ? [cards[0][0] + ' más ' + cards[1][0] + ' apuntan a ' + cards[0][1] + ' y ' + cards[1][1] + '.'] : ['Una sola carta: lee su significado al pie de la letra.'] });
    r.blocks.push({ h: 'Cómo leer', p: ['Las cartas hablan en presente y en simbolismo concreto: pregunta por hechos, no por quién.'] });
    return r;
  };

  KINDS['yes-no'] = function (v) {
    var lean = seedFrom(norm(v.question)) % 100;
    var ans = lean < 40 ? 'Sí' : (lean < 70 ? 'Sí, con matices' : (lean < 85 ? 'No' : 'No por ahora'));
    var r = R('Sibilla: ' + ans, 'Respuesta simbólica reproducible a partir de tu pregunta.');
    r.rows.push({ label: 'Pregunta', value: v.question });
    r.rows.push({ label: 'Tendencia', value: ans });
    r.rows.push({ label: 'Índice', value: lean + ' de 100' });
    r.blocks.push({ h: 'Cómo leer', p: ['El sí con matices aparece cuando la intención es posible pero necesita condiciones.', 'No decidas con esto: úsalo como pregunta para tu propia reflexión.'] });
    return r;
  };

  KINDS['question-builder'] = function (v) {
    var r = R('Preguntas para péndulo', 'Tema: ' + v.topic + '.');
    r.rows.push({ label: 'Tema', value: v.topic });
    r.rows.push({ label: 'Opción A', value: v.optionA });
    r.rows.push({ label: 'Opción B', value: v.optionB });
    r.blocks.push({ h: 'Preguntas sugeridas', p: [
      v.optionA + ' es la mejor opción para ' + v.topic + '?',
      v.optionB + ' es la mejor opción para ' + v.topic + '?',
      'El momento actual favorece actuar sobre ' + v.topic + '?',
      'Necesito información que todavía no tengo sobre ' + v.topic + '?'
    ] });
    r.blocks.push({ h: 'Protocolo', p: ['Calibra el péndulo con un hecho que conoces: tu nombre.', 'Repite cada pregunta tres veces y cuenta sí, no o neutro. Dos de tres iguales es fiable.', 'Anota todo y no mezcles preguntas.'] });
    r.tips.push('La app Psi Gym incluye péndulo, sigilos y primeras sesiones guiadas.');
    return r;
  };

  KINDS['rune-reference'] = function (v) {
    var q = norm(v.query);
    var res = RUNES.filter(function (u) { return norm(u[1] + u[2] + u[3]).indexOf(q) !== -1; }).slice(0, 12);
    var r = R('Referencia Elder Futhark', 'Las 24 runas con nombre, transliteración y significado.');
    r.rows.push({ label: 'Búsqueda', value: v.query || 'todas' });
    r.rows.push({ label: 'Coincidencias', value: String(res.length) });
    r.blocks.push({ h: 'Runas', p: res.length ? res.map(function (u) { return u[0] + ' ' + u[1] + ' (' + u[2] + ') - ' + u[3] + ', elemento ' + u[4]; }) : ['Sin coincidencias. Prueba con viaje, fuego o protección.'] });
    return r;
  };

  KINDS['rune-translator'] = function (v) {
    var name = String(v.name || '').trim();
    var low = norm(name).replace(/[^a-z ]/g, '').replace(/\s+/g, '');
    if (!low) return null;
    var out = '', table = [], i = 0;
    while (i < low.length) {
      var three = low.substr(i, 3), two = low.substr(i, 2), ch = low[i];
      if (three === 'ing' || two === 'ng') { out += RUNE_MAP.ng; table.push('ng - Ingwaz'); i += three === 'ing' ? 3 : 2; continue; }
      if (two === 'th') { out += RUNE_MAP.th; table.push('th - Thurisaz'); i += 2; continue; }
      if (two === 'ei') { out += RUNE_MAP.ei; table.push('ei - Eihwaz'); i += 2; continue; }
      var g = RUNE_MAP[ch];
      if (g) { out += g; table.push(ch + ' - ' + g); }
      else table.push(ch + ' - sin runa equivalente');
      i++;
    }
    var r = R('Tu nombre en runas', 'Transliteración al Futhark antiguo.');
    r.rows.push({ label: 'Nombre', value: name });
    r.rows.push({ label: 'Runas', value: out || 'sin resultado' });
    r.rows.push({ label: 'Letras procesadas', value: String(table.length) });
    r.blocks.push({ h: 'Tabla letra a letra', p: table.slice(0, 20) });
    r.blocks.push({ h: 'Cómo usarlo', p: ['Escribe las runas en orden, redibuja el glifo como sigilo y traza el act en una sola línea.'] });
    r.tips.push('Para nombres y sigilos rituales la app Chaos Sigil Generator automatiza el proceso.');
    return r;
  };

  KINDS['ogham'] = function (v) {
    var rnd = rng(seedFrom(v.question + new Date().toDateString()));
    var r = R('Oráculo Ogham', v.question ? 'Pregunta: ' + v.question : 'Tirada libre.'), picks = [];
    for (var i = 0; i < 3; i++) {
      var o = OGHAM[Math.floor(rnd() * OGHAM.length)];
      picks.push(o);
      r.rows.push({ label: 'Beth ' + (i + 1), value: o[0] + ' (' + o[1] + ') - ' + o[3] });
    }
    r.blocks.push({ h: 'Lectura', p: picks.map(function (o) { return o[0] + ' (' + o[1] + '): ' + o[3] + '.'; }) });
    r.blocks.push({ h: 'Símbolo', p: ['El Ogham se escribe en línea con los scores a la derecha; cada letra tiene un árbol y una posición estacional.'] });
    return r;
  };

  KINDS['cipher'] = function (v) {
    var letters = norm(v.text).replace(/[^a-z ]/g, '').replace(/ /g, '').split('');
    if (!letters.length) return null;
    var counts = {}, rows = [];
    letters.forEach(function (ch) {
      var e = CHALDEAN_LETTER[ch];
      if (!e) return;
      counts[e[0]] = (counts[e[0]] || 0) + 1;
      rows.push(ch.toUpperCase() + ' - ' + e[0] + ', ' + accent(e[1]));
    });
    var dom = Object.keys(counts).map(function (k) { return k + ' ' + counts[k]; }).join(', ');
    var r = R('Cifra del alfabeto planetario', 'Cada letra se asocia a un número y a un planeta.');
    r.rows.push({ label: 'Texto', value: v.text });
    r.rows.push({ label: 'Letras', value: String(letters.length) });
    r.rows.push({ label: 'Planetas dominantes', value: dom || 'sin datos' });
    r.blocks.push({ h: 'Correspondencia letra a planeta', p: rows.slice(0, 26) });
    r.blocks.push({ h: 'Para qué sirve', p: ['Este mapa es la base de los sigilos planetarios: repetir un planeta agrupa sus letras en el glifo.'] });
    return r;
  };

  KINDS['encoder'] = function (v) {
    var txt = norm(v.intention).replace(/[^a-zñ ]/g, ''), words = txt.split(/\s+/).filter(Boolean);
    var letters = txt.replace(/ /g, '').split('');
    var seen = [], cons = [];
    letters.forEach(function (ch) {
      if ('aeiou'.indexOf(ch) === -1) { cons.push(ch); if (seen.indexOf(ch) === -1) seen.push(ch); }
    });
    var r = R('Codificador de intención, método Spare', 'Tu intención reducida a su esqueleto consonante.');
    r.rows.push({ label: 'Intención', value: v.intention });
    r.rows.push({ label: 'Palabras', value: String(words.length) });
    r.rows.push({ label: 'Consonantes únicos', value: String(seen.length) });
    r.rows.push({ label: 'Esqueleto Spare', value: (seen.join('') || '-').toUpperCase() });
    r.rows.push({ label: 'Consonantes', value: (cons.join('') || '-').toUpperCase() });
    r.blocks.push({ h: 'Cómo hacer el sigilo', p: ['Toma el esqueleto consonante ' + (seen.join('') || '-').toUpperCase() + '.', 'Quita las vocales que ya están representadas en las letras que quedan.', 'Junta las letras en un glifo único y redibuja hasta que resuene con tu intención.'] });
    r.blocks.push({ h: 'Automatizar', p: ['La app Chaos Sigil Generator hace el trazo y te da la imagen lista para imprimir.'] });
    return r;
  };

  KINDS['correspondences'] = function (v) {
    var el = v.element || 'Fuego', it = norm(v.intention), best = el;
    Object.keys(ELEM_KEYWORDS).forEach(function (k) {
      if (ELEM_KEYWORDS[k].some(function (w) { return it.indexOf(w) !== -1; })) {
        best = k.charAt(0).toUpperCase() + k.slice(1);
      }
    });
    var E = ELEM[best];
    var r = R('Correspondencias de ' + best, best !== el ? 'Tu intención sugiere ' + best + ' (habías elegido ' + el + ').' : 'Mapa de correspondencias para tu ritual.');
    r.rows.push({ label: 'Elemento', value: best });
    r.rows.push({ label: 'Dirección', value: accent(E.d) });
    r.rows.push({ label: 'Día', value: accent(E.day) });
    r.rows.push({ label: 'Colores', value: accent(E.col) });
    r.rows.push({ label: 'Incienso', value: accent(E.inc) });
    r.rows.push({ label: 'Planeta', value: accent(E.planet) });
    r.rows.push({ label: 'Carta', value: E.suit });
    r.rows.push({ label: 'Runa', value: E.rune });
    r.blocks.push({ h: 'Para ' + norm(v.intention), p: [E.n + '.'] });
    r.blocks.push({ h: 'Uso', p: ['Enciende la vela del color y orienta el espacio hacia ' + E.d + '.', 'Pon el objeto en el centro y nombra la intención en voz alta.'] });
    return r;
  };

  KINDS['calendar'] = function (v) {
    var p = String(v.month || '2025-01').split('-'), year = +p[0], mon = (+p[1] || 1) - 1;
    if (!year) return null;
    var r = R('Calendario lunar de ' + MESES[mon], 'Cambios de fase del mes por longitud media de la Luna.');
    var lines = [], last = '';
    var cur = new Date(year, mon, 1), guard = 0;
    while (cur.getMonth() === mon && guard++ < 40) {
      var pn = phaseName(phaseAngle(cur));
      if (pn !== last) { lines.push(pad(cur.getDate()) + ' - ' + pn + ' (' + illum(phaseAngle(cur)) + '%)'); last = pn; }
      cur.setDate(cur.getDate() + 1);
    }
    r.rows.push({ label: 'Mes', value: mon + 1 + '/' + year });
    r.rows.push({ label: 'Cambios de fase', value: String(lines.length) });
    r.blocks.push({ h: 'Fases', p: lines });
    r.blocks.push({ h: 'Cómo usar', p: ['Empieza en Luna Nueva, expande en creciente, consolida en Llena y suelta en menguante.'] });
    r.tips.push('La app Lunar Phase te da la hora exacta y el signo lunar de cada día.');
    return r;
  };

  KINDS['planner'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var ph = phaseAngle(d), name = phaseName(ph), il = illum(ph);
    var advice = name === 'Luna Llena' ? 'Momento de culminación: tu intención está en su pico.'
      : name.indexOf('Cuarto') !== -1 ? 'Punto de decisión: revisa la mitad de tu trabajo.'
      : (name.indexOf('Creciente') !== -1 || name.indexOf('Gibosa') !== -1) ? 'Fase de expansión: lanza y crece.'
      : name.indexOf('Menguante') !== -1 ? 'Fase de liberación: suelta lo que ya no sirve.'
      : 'Semilla: define la intención con precisión.';
    var r = R('Planificador de intención lunar', 'Para "' + v.intention + '" el ' + fmtDate(v.date) + '.');
    r.rows.push({ label: 'Intención', value: v.intention });
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Fase', value: name });
    r.rows.push({ label: 'Iluminación', value: il + '%' });
    r.rows.push({ label: 'Ciclo', value: il <= 50 ? 'creciente' : 'menguante' });
    r.blocks.push({ h: 'Qué hacer', p: [advice] });
    r.blocks.push({ h: 'Recuerda', p: ['La luna organiza tu atención: no decide por ti.'] });
    return r;
  };

  KINDS['hours-planner'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var wd = d.getDay(), start = CHALDEAN.indexOf(DAY_RULER[wd]), day = [], night = [], i;
    for (i = 0; i < 12; i++) {
      day.push(pad((6 + i) % 24) + ':00 a ' + pad((7 + i) % 24) + ':00 - ' + accent(CHALDEAN[(start + i) % 7]));
    }
    for (i = 0; i < 12; i++) {
      night.push(pad((18 + i) % 24) + ':00 a ' + pad((19 + i) % 24) + ':00 - ' + accent(CHALDEAN[(start + 12 + i) % 7]));
    }
    var r = R('Horas planetarias del ' + fmtDate(v.date), 'Método caldeo: 12 horas diurnas desde el orto y 12 nocturnas desde el ocaso.');
    r.rows.push({ label: 'Día', value: accent(DAY_RULER_ES[wd]) });
    r.rows.push({ label: 'Regente del día', value: accent(DAY_RULER[wd]) });
    r.rows.push({ label: 'Orto asumido', value: '06:00' });
    r.rows.push({ label: 'Ocaso asumido', value: '18:00' });
    r.blocks.push({ h: 'Horas diurnas', p: day });
    r.blocks.push({ h: 'Horas nocturnas', p: night });
    r.blocks.push({ h: 'Uso', p: ['Trabaja en la hora de tu planeta: Mercurio para comercio, Luna para lo emocional, Marte para la acción.'] });
    r.tips.push('Para horas exactas por ciudad, la app Astral Lab geolocaliza el orto y el ocaso.');
    return r;
  };

  KINDS['scorecard'] = function (v) {
    var d = fromYmd(v.date); if (isNaN(d.getTime())) return null;
    var ph = phaseAngle(d), ruler = DAY_RULER[d.getDay()];
    var sc = CHALDEAN_NUM[ruler] * 10 + illum(ph) / 10;
    var verdict = sc >= 78 ? 'Momento fuerte' : (sc >= 55 ? 'Momento aceptable' : 'Momento de espera');
    var r = R('Tarjeta de valoración temporal', 'Intención "' + v.intention + '" el ' + fmtDate(v.date) + '.');
    r.rows.push({ label: 'Fecha', value: fmtDate(v.date) });
    r.rows.push({ label: 'Día planetario', value: accent(DAY_RULER_ES[d.getDay()]) + ' (' + accent(ruler) + ')' });
    r.rows.push({ label: 'Fase lunar', value: phaseName(ph) });
    r.rows.push({ label: 'Puntuación', value: Math.round(sc) + ' de 100' });
    r.rows.push({ label: 'Veredicto', value: verdict });
    r.blocks.push({ h: 'Desglose', p: ['Puntuación = número planetario por 10 más porcentaje de iluminación lunar.', verdict === 'Momento fuerte' ? 'Avanza hoy.' : verdict === 'Momento aceptable' ? 'Adelanta, pero con calma.' : 'Guarda la energía para un momento más favorable.'] });
    return r;
  };

  KINDS['candle'] = function (v) {
    var col = v.color || 'Blanco', C = CANDLES[col] || CANDLES.Blanco;
    var r = R('Vela de ' + col, 'Para tu intención: "' + v.intention + '".');
    r.rows.push({ label: 'Color', value: col });
    r.rows.push({ label: 'Planeta', value: accent(C.p) });
    r.rows.push({ label: 'Significado', value: C.e });
    r.rows.push({ label: 'Día', value: C.d });
    r.rows.push({ label: 'Uso', value: C.w });
    r.blocks.push({ h: 'Micro ritual', p: ['Enciende la vela, nombra la intención en voz alta, visualiza el resultado y deja que arda en un lugar seguro.'] });
    r.tips.push('La app Astral Lab sugiere el color según día planetario y luna del día.');
    return r;
  };

  KINDS['ingredients'] = function (v) {
    var it = norm(v.intention), avail = norm(v.available);
    var all = ['romero', 'lavanda', 'salvia', 'cedro', 'vetiver', 'clavo', 'canela', 'hierba de san juan', 'sal', 'cera de abeja', 'aceite de oliva', 'piedra del color del elemento'];
    var have = avail ? all.filter(function (h) { return avail.indexOf(norm(h)) !== -1; }) : [];
    var sug = all.filter(function (h) { return have.indexOf(h) === -1; }).slice(0, 5);
    var r = R('Ingredientes para tu ritual', 'Intención: "' + v.intention + '".');
    r.rows.push({ label: 'Disponibles', value: have.length ? have.join(', ') : 'no indicados' });
    r.rows.push({ label: 'Sugeridos', value: sug.join(', ') });
    r.blocks.push({ h: 'Combina', p: ['Elige uno o tres de tus disponibles más uno que te llame de la lista: la intuición cuenta.'] });
    return r;
  };

  KINDS['banishing'] = function (v) {
    var met = v.method || 'Purificación';
    var steps = {
      Purificación: ['Enciende una vela del elemento que tu ritual contradice', 'Limpia el espacio con humo, sal y agua', 'Enuncia en voz baja el límite que pones: ' + v.boundary, 'Cierra el círculo saliendo del espacio'],
      Clausura: ['Marca el límite con un objeto: puerta, papel o dibujo', 'Dilo en voz alta: ' + v.boundary, 'Retira el objeto que representa lo que se va', 'Sella con un símbolo: sello, nudo o siete puntos'],
      Reorganización: ['Haz una lista de lo que queda y lo que se va', 'Reordena el espacio físico', 'Enuncia el nuevo orden: ' + v.boundary]
    }[met] || ['Enuncia el límite y ciérralo simbólicamente.'];
    var r = R('Ritual de ' + norm(met).toLowerCase(), 'Límite declarado: "' + v.boundary + '".');
    r.rows.push({ label: 'Método', value: met });
    r.rows.push({ label: 'Límite', value: v.boundary });
    r.blocks.push({ h: 'Pasos', p: steps });
    r.tips.push('La app Arcana Goetia incluye rituales de cierre y lista de espíritus.');
    return r;
  };

  KINDS['balance'] = function (v) {
    var f = +v.fire || 0, w = +v.water || 0, e = +v.earth || 0, a = +v.air || 0, tot = f + w + e + a;
    if (!tot) return null;
    var pct = {
      Fuego: Math.round(f / tot * 100), Agua: Math.round(w / tot * 100),
      Tierra: Math.round(e / tot * 100), Aire: Math.round(a / tot * 100)
    };
    var arr = Object.keys(pct).map(function (k) { return { k: k, v: pct[k] }; }).sort(function (x, y) { return y.v - x.v; });
    var r = R('Equilibrio elemental', 'Fuego ' + pct.Fuego + '%, Agua ' + pct.Agua + '%, Tierra ' + pct.Tierra + '%, Aire ' + pct.Aire + '%.');
    r.rows.push({ label: 'Total', value: String(tot) });
    r.rows.push({ label: 'Dominante', value: arr[0].k + ' (' + arr[0].v + '%)' });
    r.rows.push({ label: 'Menos presente', value: arr[3].k + ' (' + arr[3].v + '%)' });
    r.blocks.push({ h: 'Lectura', p: ['Tu elemento dominante ' + arr[0].k + ' marca tu talento natural; ' + arr[3].k + ' es lo que necesitas cultivar.'] });
    r.blocks.push({ h: 'Reequilibrar ' + arr[3].k, p: [ELEM[arr[3].k].n + '.'] });
    return r;
  };

  KINDS['coach'] = function (v) {
    var steps = {
      'Registro reflexivo': ['Anota el sueño al despertar', 'Marca un símbolo en la bitácora', 'Al día siguiente revisa qué significaba'],
      'Comprobaciones de realidad': ['Cada hora mira el pulgar: sueño o realidad', 'Si es sueño, pronuncia lucidez internamente'],
      'Visualización suave': ['Imagina la escena lucida con los cinco sentidos', 'Practica de cinco a diez minutos antes de dormir']
    }[v.technique] || ['Practica de cinco a diez minutos al día'];
    var r = R('Plan de sueños lúcidos', 'Técnica: ' + v.technique + '.');
    r.rows.push({ label: 'Técnica', value: v.technique });
    r.rows.push({ label: 'Duración', value: v.duration + ' minutos' });
    r.blocks.push({ h: 'Tu rutina', p: steps });
    r.blocks.push({ h: 'Expectativas', p: ['Con ' + v.duration + ' minutos diarios los consolidadores llegan en dos a cuatro semanas.'] });
    r.tips.push('La app Dream Machine incluye técnicas de comprobación de realidad y diario de sueños.');
    return r;
  };

  KINDS['reality-check'] = function (v) {
    var r = R('Coach de comprobaciones de realidad', 'Contexto: ' + v.context + '.');
    r.rows.push({ label: 'Frase ancla', value: v.phrase });
    r.rows.push({ label: 'Contexto', value: v.context });
    r.blocks.push({ h: 'Plan', p: [
      'Cada vez que aparezca "' + v.phrase + '" haz el ancla: mira la mano y repite la frase.',
      'Ancla también con la escritura: mira el texto, cambia de tema, vuelve.',
      'Registra cada lucidez lograda con fecha y contexto.'
    ] });
    r.tips.push('Lucid Dream incluye la bitácora de producción lucida.');
    return r;
  };

  KINDS['dictionary'] = function (v) {
    var s = norm(v.symbol);
    var keys = Object.keys(DREAM);
    var hit = keys.filter(function (k) { return s.indexOf(k) !== -1 || k.indexOf(s) !== -1; });
    var r = R('Diccionario de sueños', 'Símbolo: "' + v.symbol + '".');
    r.rows.push({ label: 'Símbolo', value: v.symbol });
    r.rows.push({ label: 'Coincidencias', value: String(hit.length) });
    r.blocks.push({ h: 'Interpretación', p: hit.length ? hit.map(function (k) { return k + ': ' + DREAM[k][0] + ' - ' + DREAM[k][1]; }) : ['Sin entrada exacta. Prueba con palabras simples: agua, casa, vuelo, dientes o muerte.'] });
    r.blocks.push({ h: 'Principio', p: ['El sueño es lenguaje personal: empieza por qué te hizo sentir, no por el diccionario.'] });
    return r;
  };

  KINDS['checklist'] = function (v) {
    var items = [
      { k: 'space', label: 'Espacio', note: 'Ritual en un lugar limpio, con techo y sin interrupciones durante la sesión' },
      { k: 'fire', label: 'Fuego', note: 'Vela o fuego abierto con supervision, extintor a mano y sin telas cerca' },
      { k: 'consent', label: 'Consentimiento', note: 'Todas las personas presentes han aceptado participar y pueden retirarse' }
    ];
    var ok = items.filter(function (i) { return v[i.k] === 'Sí'; });
    var r = R('Checklist de seguridad ritual', ok.length + ' de ' + items.length + ' condiciones verificadas.');
    r.rows.push({ label: 'Resultado', value: ok.length === items.length ? 'Completo: puedes empezar' : 'Incompleto: resuelve lo que falta' });
    items.forEach(function (i) { r.rows.push({ label: i.label, value: v[i.k] === 'Sí' ? 'Verificado' : 'Pendiente' }); });
    r.blocks.push({ h: 'Qué verificaste', p: items.map(function (i) { return i.label + ': ' + i.note; }) });
    r.blocks.push({ h: 'Si falta algo', p: ['No fuerces el inicio: resuelve la condición pendiente o cambia de espacio.', 'Nunca dejes fuego sin vigilancia y nunca actúes sobre otra persona sin su consentimiento explícito.'] });
    r.tips.push('La app Noctem Tools incluye listas de seguridad y preparación para sesiones.');
    return r;
  };

  KINDS['consent'] = function (v) {
    var r = R('Consentimiento y límites', 'Contexto: ' + v.context + '.');
    r.rows.push({ label: 'Contexto', value: v.context });
    r.rows.push({ label: 'Límite', value: v.boundary });
    r.blocks.push({ h: 'Acuerdo', p: ['Al cerrar este ritual, "' + v.boundary + '" queda fuera.', 'Puedes detener la práctica en cualquier momento sin dar explicaciones.'] });
    r.blocks.push({ h: 'Buena práctica', p: ['Nombra el límite en voz alta y, si puedes, por escrito.'] });
    return r;
  };

  KINDS['organizer'] = function (v) {
    var r = R('Grimorio digital', 'Entrada: "' + v.title + '".');
    r.rows.push({ label: 'Título', value: v.title });
    r.rows.push({ label: 'Entrada', value: v.entry });
    r.blocks.push({ h: 'Guardar', p: ['Usa el botón Guardar resumen local para guardar esta entrada en este navegador y recuperarla luego.'] });
    return r;
  };

  KINDS['prep'] = function (v) {
    var r = R('Checklist de preparación', 'Hora: ' + v.time + '.');
    r.rows.push({ label: 'Hora', value: v.time });
    r.rows.push({ label: 'Anclaje', value: v.ground });
    r.blocks.push({ h: 'Antes de empezar', p: ['Prepara el espacio y el olor.', 'Define una intención de una frase.', 'Marca tu ancla: ' + v.ground + '.', 'Silencia el móvil y cierra otras tareas.'] });
    return r;
  };

  KINDS['charge'] = function (v) {
    var met = v.method || 'Visualización';
    var steps = {
      Visualización: ['Mira el sigilo', 'Imagina la intención como una forma de luz', 'Sostén la imagen de tres a cinco minutos'],
      Meditación: ['Respira lento', 'Mira el sigilo con los ojos cerrados', 'Deja que la intención se cargue'],
      'Ritual simbólico': ['Enciende vela del color del sigilo', 'Traza el sigilo con el dedo o una pluma', 'Nombra la intención y guarda el sigilo']
    }[met] || ['Mira el sigilo y carga tu intención en silencio.'];
    var r = R('Carga de sigilo', 'Método: ' + met + '.');
    r.rows.push({ label: 'Intención', value: v.intention });
    r.rows.push({ label: 'Método', value: met });
    r.blocks.push({ h: 'Pasos', p: steps });
    r.tips.push('La app Chaos Sigil Generator guarda tus sigilos y su carga.');
    return r;
  };

  KINDS['servitor'] = function (v) {
    var r = R('Diario de servidores', 'Servidor: "' + v.name + '".');
    r.rows.push({ label: 'Nombre', value: v.name });
    r.rows.push({ label: 'Propósito', value: v.purpose });
    r.blocks.push({ h: 'Ficha', p: [
      'Nombre: ' + v.name + '.',
      'Propósito: ' + v.purpose + '.',
      'Declaración: sirvo a ' + v.purpose + '.',
      'Alimentación: recordatorio visual y sonido.',
      'Retiro: cuando termine la tarea, se libera con gratitud.'
    ] });
    r.tips.push('El Manual de Activación de Servidores en PDF explica el método completo.');
    return r;
  };

  KINDS['planificador-estacional'] = function (v) {
    var y = +v.year || new Date().getFullYear(), sea = v.season || 'Equinoccio';
    var d = { Equinoccio: [20, 3], Solsticio: [21, 6], Samhain: [31, 10], Imbolc: [1, 2] }[sea] || [21, 3];
    var work = {
      Equinoccio: 'Equilibrio: revisa metas, poda y siembra proyectos nuevos.',
      Solsticio: 'Plenitud: culmina lo que ya está en marcha.',
      Samhain: 'Fin de ciclo: suelta, guarda registros y deja morir lo muerto.',
      Imbolc: 'Umbral: ordena, distingue y formula tus intenciones del año.'
    }[sea];
    var r = R('Temporada sabática: ' + sea, 'Fecha aproximada del sabbat en ' + y + '.');
    r.rows.push({ label: 'Temporada', value: sea });
    r.rows.push({ label: 'Fecha aproximada', value: d[0] + ' de ' + MESES[d[1] - 1] + ' de ' + y });
    r.blocks.push({ h: 'Foco de la temporada', p: [work] });
    r.blocks.push({ h: 'Las ocho sabbats', p: ['Imbolc 1 feb, Ostara 20 mar, Beltane 1 may, Litha 21 jun, Lughnasadh 1 ago, Mabon 22 sep, Samhain 31 oct, Yule 21 dic.'] });
    r.tips.push('La app Astral Lab te da la hora exacta de cada sabbat con tu ubicación.');
    return r;
  };

  /* ---------- interactive widgets ---------- */
  function buildTimer(mins) {
    var left = Math.round(mins * 60), timer = null, running = false;
    var box = document.createElement('div');
    box.className = 'atomic-timer';
    box.innerHTML = '<div class="atomic-timer-display" id="atomic-timer-d">--:--</div>' +
      '<div class="atomic-actions"><button class="atomic-button" type="button" id="atomic-timer-go">Iniciar</button>' +
      '<button class="atomic-button atomic-button-secondary" type="button" id="atomic-timer-reset">Reiniciar</button></div>' +
      '<p class="atomic-status" id="atomic-timer-s" role="status" aria-live="polite">Listo.</p>';
    var disp = box.querySelector('#atomic-timer-d');
    var go = box.querySelector('#atomic-timer-go');
    var st = box.querySelector('#atomic-timer-s');
    function paint() { disp.textContent = pad(Math.floor(left / 60)) + ':' + pad(left % 60); }
    function tick() {
      left--; paint();
      if (left <= 0) {
        if (timer) clearInterval(timer);
        timer = null; running = false; go.textContent = 'Iniciar';
        st.textContent = 'Tiempo completo. Vuelve lentamente a la realidad.';
        var key = 'atomic-log:' + toolId, log = load(key) || [];
        log.push({ at: new Date().toISOString(), value: mins + ' minutos' });
        store(key, log);
      }
    }
    go.addEventListener('click', function () {
      if (running) {
        if (timer) clearInterval(timer);
        timer = null; running = false; go.textContent = 'Continuar'; st.textContent = 'En pausa.';
      } else {
        running = true; go.textContent = 'Pausar'; timer = setInterval(tick, 1000); st.textContent = 'En curso.';
      }
    });
    box.querySelector('#atomic-timer-reset').addEventListener('click', function () {
      if (timer) clearInterval(timer);
      timer = null; running = false; go.textContent = 'Iniciar';
      left = Math.round(mins * 60); paint(); st.textContent = 'Listo.';
    });
    paint();
    return box;
  }

  /* ---------- result renderer ---------- */
  function renderResult(res, labels) {
    var r = document.getElementById('atomic-result');
    if (!r) return;
    r.hidden = false;
    var html = '<p class="atomic-kicker">Resultado</p><h2>' + esc(res.title) + '</h2><p class="atomic-lead">' + esc(res.lead) + '</p>';
    if (res.rows.length) {
      html += '<div class="atomic-result-grid">' + res.rows.map(function (x) {
        return '<div><span>' + esc(x.label) + '</span><strong>' + esc(x.value) + '</strong></div>';
      }).join('') + '</div>';
    }
    res.blocks.forEach(function (b) {
      html += '<h3>' + esc(b.h) + '</h3><ul class="atomic-steps">' + b.p.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>';
    });
    if (res.tips.length) {
      html += '<div class="atomic-notice"><strong>Nota</strong><span> ' + res.tips.map(esc).join(' ') + '</span></div>';
    }
    html += '<div class="atomic-actions"><button id="atomic-save" class="atomic-button atomic-button-secondary" type="button">Guardar resumen local</button>' +
      '<button id="atomic-print" class="atomic-button atomic-button-secondary" type="button">Imprimir</button></div>' +
      '<span id="atomic-save-status" class="atomic-status" role="status" aria-live="polite"></span>';
    r.innerHTML = html;
    document.getElementById('atomic-save').addEventListener('click', function () {
      var ok = store('atomic-tool:' + toolId, { savedAt: new Date().toISOString(), title: res.title, values: labels });
      var s = document.getElementById('atomic-save-status');
      s.textContent = ok ? 'Resumen guardado en este navegador.' : 'No se pudo guardar localmente: puedes imprimir o copiar.';
    });
    document.getElementById('atomic-print').addEventListener('click', function () { window.print(); });
  }

  /* ---------- form ---------- */
  function fieldMarkup(field) {
    var id = esc(field.id), label = esc(field.label || field.id), req = field.required ? ' required' : '';
    var base = 'id="field-' + id + '" name="' + id + '" aria-describedby="help-' + id + '"';
    var control = '';
    switch (field.type) {
      case 'textarea': control = '<textarea ' + base + req + ' rows="5" placeholder="Escribe con tus propias palabras"></textarea>'; break;
      case 'select': control = '<select ' + base + req + '><option value="">Selecciona una opción</option>' + list(field.options).map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + '</option>'; }).join('') + '</select>'; break;
      case 'checkbox': control = '<input ' + base + ' type="checkbox" value="Sí">'; break;
      case 'number': control = '<input ' + base + req + ' type="number" inputmode="decimal" step="any" min="0" placeholder="Escribe un número">'; break;
      case 'date': control = '<input ' + base + req + ' type="date">'; break;
      case 'time': control = '<input ' + base + req + ' type="time">'; break;
      case 'month': control = '<input ' + base + req + ' type="month">'; break;
      case 'search': control = '<input ' + base + req + ' type="search" placeholder="Buscar: amor, fuego, viaje">'; break;
      default: control = '<input ' + base + req + ' type="text" placeholder="Escribe tu respuesta">';
    }
    return '<div class="atomic-field' + (field.type === 'checkbox' ? ' checkbox-control' : '') + '">' +
      '<div class="atomic-label-row"><label for="field-' + id + '">' + label + (field.required ? '<span aria-hidden="true"> *</span>' : '') + '</label>' +
      (field.type === 'checkbox' ? '<span class="field-optional">opcional</span>' : '') + '</div>' + control +
      '<small id="help-' + id + '">Se guarda solo en este navegador cuando sea posible.</small></div>';
  }
  function getValue(form, field) {
    var input = form.elements.namedItem(field.id);
    if (!input) return '';
    if (field.type === 'checkbox') return form.querySelectorAll('[name="' + field.id + '"]:checked').length ? 'Sí' : '';
    return typeof input.value === 'string' ? input.value.trim() : '';
  }

  function renderForm(tool) {
    var fields = list(tool.fields);
    mount.innerHTML =
      '<div class="atomic-hero"><p class="atomic-kicker">' + esc(tool.category || 'Herramienta simbólica') + '</p>' +
      '<h1>' + esc(tool.name) + '</h1><p class="atomic-lead">' + esc(tool.description || '') + '</p>' +
      '<div class="atomic-notice"><strong>Herramienta gratuita</strong><span> Usa esta página como herramienta de reflexión y registro. No sustituye atención médica, psicológica, legal o financiera.</span></div></div>' +
      '<section class="atomic-card"><h2>Configura tu lectura</h2><p class="atomic-muted">Completa los campos y obtén una lectura simbólica reproducible en este dispositivo.</p>' +
      '<form id="atomic-form" novalidate>' + fields.map(fieldMarkup).join('') +
      '<div class="atomic-actions"><button class="atomic-button" type="submit">Generar resultado</button><button class="atomic-button atomic-button-secondary" type="reset">Limpiar</button></div>' +
      '<p id="atomic-form-status" class="atomic-status" role="status" aria-live="polite"></p></form></section>' +
      '<section id="atomic-result" class="atomic-card atomic-result" hidden></section>' +
      '<section class="atomic-card"><h2>Cómo usar esta herramienta</h2><ol class="atomic-steps">' +
      list(tool.method).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
      '<h3>Qué esperar</h3><p>' + esc(tool.result || 'Obtendrás una guía práctica para reflexionar y registrar tu proceso.') + '</p>' +
      '<h3>Uso responsable</h3><p>' + esc(tool.safety || 'No uses esta herramienta para sustituir decisiones importantes ni para obtener datos de terceros sin consentimiento.') + '</p></section>' +
      '<section class="atomic-card atomic-faq"><h2>Preguntas frecuentes</h2>' +
      '<details><summary>¿La lectura es una predicción?</summary><p>No. Es una interpretación simbólica y de autoconocimiento; las decisiones importantes deben apoyarse en información y contexto reales.</p></details>' +
      '<details><summary>¿Se envía mi información a un servidor?</summary><p>El motor funciona en el navegador. La página no necesita cuenta y solo guarda lo que elijas guardar localmente en este dispositivo.</p></details></section>';

    var form = document.getElementById('atomic-form');
    var status = document.getElementById('atomic-form-status');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var startedAt = Date.now();
      var missing = fields.filter(function (f) { return f.required && !getValue(form, f); });
      if (missing.length) {
        status.textContent = 'Completa: ' + missing.map(function (f) { return f.label || f.id; }).join(', ') + '.';
        status.className = 'atomic-status is-error';
        return;
      }
      status.textContent = 'Calculando...';
      status.className = 'atomic-status';
      track('tool_start', { tool_id: toolId, category: tool.category || 'tool', source: 'atomic_tool' });

      var values = {}, labels = [];
      fields.forEach(function (f) {
        var val = getValue(form, f);
        if (val) { values[f.id] = val; labels.push({ label: f.label || f.id, value: val }); }
      });

      var res = null, widget = null;
      if (tool.kind === 'timer') {
        res = R('Temporizador', tool.name + ': ' + values.minutes + ' minutos.');
        res.rows.push({ label: 'Duración', value: values.minutes + ' minutos' });
        res.blocks.push({ h: 'Cómo usarlo', p: ['Inicia el temporizador, respira lento y vuelve cuando suene.'] });
        widget = buildTimer(+values.minutes || 5);
      } else if (tool.kind === 'tracker' || tool.kind === 'dashboard') {
        var key = 'atomic-log:' + toolId, log = load(key) || [];
        log.push({ at: new Date().toISOString(), value: values.value || values.step || '' });
        store(key, log);
        res = R(tool.kind === 'dashboard' ? 'Panel de seguimiento' : 'Seguimiento de intención', 'Registros guardados en este navegador: ' + log.length + '.');
        res.rows.push({ label: 'Total de registros', value: String(log.length) });
        res.blocks.push({ h: 'Historial', p: log.slice(-6).reverse().map(function (x) { return new Date(x.at).toLocaleString('es') + ' - ' + x.value; }) });
      } else if (KINDS[tool.kind]) {
        res = KINDS[tool.kind](values, tool);
      }
      if (!res) { res = R(tool.name, 'Lectura de referencia.'); res.rows.push({ label: 'Herramienta', value: tool.name }); }

      renderResult(res, labels);
      if (widget) {
        var box = document.getElementById('atomic-result');
        var anchor = box.querySelector('.atomic-actions');
        box.insertBefore(widget, anchor);
      }

      status.textContent = 'Resultado generado.';
      status.className = 'atomic-status is-success';
      var sec = Math.round((Date.now() - startedAt) / 1000);
      track('tool_complete', {
        tool_id: toolId, category: tool.category || 'tool', result_present: true,
        duration_bucket: sec <= 30 ? '0-30' : sec <= 60 ? '31-60' : sec <= 180 ? '61-180' : sec <= 600 ? '181-600' : '601+',
        source: 'atomic_tool'
      });
      var rr = document.getElementById('atomic-result');
      if (rr) rr.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function showError(error) {
    mount.innerHTML = '<section class="atomic-card atomic-error"><h1>No se pudo cargar la herramienta</h1><p>Actualiza la página o comprueba la conexión. No se han enviado tus datos.</p></section>';
    console.error('[atomic-tools]', error);
  }

  fetch(DATA_URL)
    .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then(function (catalog) {
      var tool = catalog.tools && catalog.tools[toolId];
      if (!tool) throw new Error('Unknown tool ' + toolId);
      document.title = tool.name + ' | Herramientas gratuitas | Cha0smagick Labs';
      renderForm(tool);
    })
    .catch(showError);
})();