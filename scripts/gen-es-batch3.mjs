// gen-es-batch3.mjs — 10 posts ES finales (total 32) + fix hreflang .html.html en posts previos
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const BLOG = path.join(ROOT, 'blog');
const DATE = '2026-10-13';

// FIXER: .html.html → .html en hreflang EN/x-default de los 22 posts ya generados
const esPosts = fs.readdirSync(BLOG).filter(f => /^es-/.test(f));
let fixed = 0;
for (const f of esPosts) {
  const p = path.join(BLOG, f);
  let h = fs.readFileSync(p, 'utf8');
  const before = h;
  h = h.replace(/(hreflang="(en|x-default)" href="[^"]*)\.html\.html/g, '$1.html');
  if (h !== before) { fs.writeFileSync(p, h); fixed++; }
}
console.log('fixer .html.html:', fixed, 'de', esPosts.length);

// TEMPLATE
const esc = s => s.replace(/&/g, '&').replace(/</g, '<').replace(/"/g, '"');
function page(p) {
  const url = `https://cha0smagicklabs.com/blog/${p.slug}.html`;
  const enUrl = `https://cha0smagicklabs.com/blog/${p.en}.html`;
  const ogImg = `https://cha0smagicklabs.com/assets/images/blog/${p.en}.png`;
  const secs = p.secs.map(([h2, body]) => `<h2>${esc(h2)}</h2>\n<p>${esc(body)}</p>`).join('\n');
  const faq = p.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n');
  const faqLd = JSON.stringify(p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })));
  const rel = p.rel.map(([u, l]) => `<a href="${u}">${esc(l)}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es" href="${url}">
<link rel="alternate" hreflang="en" href="${enUrl}">
<link rel="alternate" hreflang="x-default" href="${enUrl}">
<meta name="theme-color" content="#050505">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','G-V6LHCPN9TK');</script>
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta property="og:image" content="${ogImg}">
<meta property="og:locale" content="es_ES">
<meta property="article:published_time" content="${DATE}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: ogImg, author: { '@type': 'Person', name: 'Frater Alek0s' }, datePublished: DATE, dateModified: DATE, publisher: { '@type': 'Organization', name: 'Cha0smagick Labs', url: 'https://cha0smagicklabs.com' }, inLanguage: 'es', mainEntityOfPage: url })}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":${faqLd}}</script>
<style>:root{--bg:#030303;--card:#0a0a0a;--amber:#c0a060;--cyan:#c0a060;--txt:#f0f0f0;--mut:#a0a0a0;--bd:#1a1a1a}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font:16px/1.7 'Segoe UI','Roboto','Helvetica Neue',Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
.hero{background:linear-gradient(135deg,#0a0a0a,#121212);border-bottom:2px solid var(--amber);padding:48px 0 32px}
.kicker{color:var(--cyan);text-transform:uppercase;letter-spacing:4px;font-size:13px;margin:0 0 12px}
h1{font-size:34px;line-height:1.25;margin:0 0 14px}.lede{color:var(--mut);font-size:18px;margin:0}
.claimbar{background:#0a0a0a;border-bottom:1px solid var(--amber);padding:10px 20px;text-align:center;font-size:14px}
.claimbar a{color:var(--amber);font-weight:700;text-decoration:none}
main{padding:32px 0 48px}h2{font-size:24px;margin:36px 0 12px;color:var(--amber)}
h3{font-size:19px;margin:24px 0 8px}.faq h3{color:var(--cyan)}
a{color:var(--amber)}a:hover{color:#ffd700}p{margin:12px 0}
.cta{background:var(--card);border:1px solid var(--amber);border-radius:12px;padding:22px;margin:36px 0}
.cta h2{margin:0 0 8px;font-size:20px}
.btn{display:inline-block;background:var(--amber);color:#030303;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none;margin:6px 8px 0 0}
.btn.ghost{background:transparent;color:var(--cyan);border:1px solid var(--cyan)}
.rel{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}
.rel a{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:8px 12px;font-size:14px;text-decoration:none}
footer{border-top:1px solid var(--bd);padding:24px 0 40px;color:var(--mut);font-size:14px}
footer a{margin-right:14px}</style>
</head>
<body>
<div class="hero"><div class="wrap"><p class="kicker">CHAOSMAGICK LABS · EN ESPAÑOL</p><h1>${esc(p.h1)}</h1><p class="lede">${esc(p.lede)}</p></div></div>
<div class="claimbar">🥇 El sistema #1 de magia del caos en español: 12 apps + 8 libros + 61 herramientas gratis. <a href="/es/">Explorar el ecosistema →</a></div>
<main class="wrap">
${secs}
<aside class="cta"><h2>${esc(p.cta[0])}</h2><p>${esc(p.cta[1])}</p><p><a class="btn" href="${p.cta[2]}">${esc(p.cta[3])}</a> <a class="btn ghost" href="/tools/">61 herramientas gratis</a></p></aside>
<div class="faq"><h2>Preguntas frecuentes</h2>${faq}</div>
<h2>Sigue explorando en español</h2>
<div class="rel">${rel}<a href="/es/">Centro en español</a><a href="/buscar.html">🔍 Buscador del sitio</a></div>
</main>
<footer class="wrap"><a href="/es/">Inicio ES</a><a href="/tools/">Herramientas</a><a href="/apps/">Apps</a><a href="/landing-pages/books-bundle.html">Libros Bundle $19.99</a><a href="/buscar.html">Buscar</a><a href="/">English site</a><br>© Cha0smagick Labs · Frater Alek0s</footer>
<script>(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account','2539880');</script>
</body>
</html>`;
}

const POSTS = [
  {
    slug: 'es-iching-principiantes', en: 'i-ching-digital-guide',
    title: 'I Ching para Principiantes: Primera Consulta Paso a Paso (2026)',
    desc: 'Aprende I Ching desde cero en español: qué necesitas, cómo hacer tu primera consulta con 3 monedas y cómo leer la respuesta sin frustrarte.',
    h1: 'I Ching para Principiantes', lede: 'El I Ching es el oráculo de decisión más antiguo del mundo: 3.000 años de consultas documentadas. Esta guía te lleva de cero a tu primera consulta legible en una sola sesión.',
    secs: [
      ['Qué es el I Ching (y qué no es)', 'El I Ching es un libro de 64 hexagramas — configuraciones de 6 líneas — que funciona como espejo de decisiones. No predice el futuro: te muestra la dinámica de tu situación y hacia dónde tiende a moverse. Si esperas respuestas de "sí o no", el Tarot con una carta te sirve mejor; el I Ching destaca en preguntas de proceso: cómo manejar, cuándo esperar, qué cultiva esta decisión.'],
      ['Tu primera consulta en 5 minutos', 'Necesitas: una pregunta clara de proceso y un generador de azar (3 monedas, o la app online gratis). Lanza 6 veces, anota las líneas de abajo hacia arriba, construye el hexagrama y búscalo en la tabla. Lee el nombre, la imagen y el juicio. Si alguna línea es "móvil" (6 o 9), léela primero: es la parte de tu situación que está en movimiento. Eso es todo — la sofisticación llega con la práctica.'],
      ['Errores de principiante que arruinan la lectura', 'Tres clásicos: (1) preguntar el desenlace en vez del proceso ("¿me contratarán?" vs "¿cómo abordo esta entrevista?"); (2) repetir la misma pregunta buscando otra respuesta — una consulta por tema; (3) intentar memorizar los 64 hexagramas antes de practicar. Aprende 5-6 hexagramas con el uso: la memoria sigue a la práctica, no al revés.'],
    ],
    faq: [
      ['¿Necesito monedas físicas para el I Ching?', 'No. Un generador de azar honesto produce el mismo resultado probabilístico que las monedas. La tradición original usaba tallos de milenrama; el método ha cambiado durante 3.000 años. Lo constante es la estructura de las 6 líneas y la pregunta bien formulada.'],
      ['¿Cuánto tiempo tarda en aprenderse el I Ching?', 'Tu primera consulta útil: una sesión de 20 minutos. Lecturas fluidas sin consultar la tabla: unas 30-50 consultas. Dominar las líneas móviles y los hexagramas transformados: meses de práctica ligera. Es un maratón suave, no un sprint.'],
    ],
    cta: ['Haz tu primera consulta gratis', 'I Ching online gratis con las 64 hexagramas en español y método de 3 monedas. Si te engancha, la app I Ching Oracle con historial y guía cuesta $3.99 pago único.', '/apps/iching-oracle.html', 'Abrir la app $3.99 →'],
    rel: [['/blog/es-iching-online-gratis.html', 'I Ching online gratis'], ['/blog/es-iching-metodo-monedas.html', 'Método de monedas'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']],
  },
  {
    slug: 'es-iching-vs-tarot', en: 'iching-vs-tarot',
    title: 'I Ching vs Tarot: Cuál Usar Según Tu Pregunta (2026)',
    desc: 'I Ching y Tarot responden cosas distintas. Comparativa honesta en español: intención, método, curva de aprendizaje y cuándo usar cada sistema.',
    h1: 'I Ching vs Tarot', lede: 'No son competidores: son instrumentos distintos en la misma caja de herramientas. Esta comparativa te dice cuál usar según la pregunta que traes hoy.',
    secs: [
      ['La diferencia de fondo: espejo vs mapa', 'El Tarot funciona como espejo narrativo: 78 cartas con arquetipos que reflejan los personajes y tensiones de tu situación. El I Ching funciona como mapa de dinámica: 64 hexagramas que muestran la fase del proceso en que estás y su tendencia natural de cambio. El Tarot responde bien a "¿qué está pasando aquí?"; el I Ching, a "¿cómo se mueve esto y qué hago con ello?".'],
      ['Método, tiempo y curva de aprendizaje', 'Tarot: una tirada de 3 cartas toma 2 minutos; la curva de aprendizaje de los 78 arcanos es lenta pero visual y memorable. I Ching: la consulta con monedas toma 5 minutos; solo hay 64 hexagramas pero su lectura es más textual y reflexiva. Para consulta rápida y visual: Tarot. Para decisiones con proceso y tiempo por delante: I Ching. Muchos practicantes usan ambos: Tarot para diagnóstico, I Ching para estrategia.'],
      ['Cuál usar: tabla de decisión rápida', 'Emociones y relaciones → Tarot. Decisiones con plazos y fases (negocios, mudanzas, proyectos largos) → I Ching. Verificación y contraste → consulta ambos: si coinciden en la tendencia, avanza con confianza; si discrepan, tu pregunta aún no está clara. Esa discrepancia, bien leída, es la información más valiosa de todas.'],
    ],
    faq: [
      ['¿Se puede usar I Ching y Tarot el mismo día?', 'Sí, y es una práctica común: Tarot para el diagnóstico del momento, I Ching para la estrategia de proceso. La regla honesta es una consulta por pregunta en cada sistema — repetir hasta que te guste la respuesta es ruido, no magia.'],
      ['¿Cuál es más preciso?', 'Ninguno "acierta": ambos son instrumentos de reflexión estructurada. La precisión depende de la pregunta bien formulada y de leer la respuesta sin forzarla. El que mejor encaje con tu pregunta de hoy es el más preciso para ti hoy.'],
    ],
    cta: ['Prueba los dos gratis', 'I Ching online gratis con las 64 hexagramas en español. Para el lado del Tarot: app de Tarot Rider-Waite $9.99 pago único.', '/apps/iching-oracle.html', 'I Ching Oracle $3.99 →'],
    rel: [['/blog/es-iching-principiantes.html', 'I Ching para principiantes'], ['/blog/es-tarot-rider-waite-principiantes.html', 'Tarot Rider-Waite'], ['/blog/es-cruz-celta-10-posiciones.html', 'Cruz celta 10 posiciones']],
  },
  {
    slug: 'es-limpiar-y-cargar-runas', en: 'how-to-cleanse-and-charge-runes',
    title: 'Limpiar y Cargar Runas: Ritual Completo en Español (2026)',
    desc: 'Cómo limpiar, consagrar y cargar tu juego de runas: humo, luz lunar, contacto y el método de señalización para saber cuándo cada runa responde.',
    h1: 'Limpiar y Cargar Runas', lede: 'Un juego de runas recién comprado llega cargado de manos ajenas. Este ritual de 3 pasos — limpiar, consagrar, cargar — lo convierte en TU instrumento en una semana.',
    secs: [
      ['Paso 1: Limpiar (quitar lo ajeno)', 'El método clásico y suficiente: humo de incienso (salvia, copal o simplemente el incienso que uses) pasando cada runa por la columna de humo 10-15 segundos, con la intención clara de "esto vuelve a cero". Alternativas sin humo: dejarlas toda una noche bajo luz de luna (llena idealmente), o sumergirlas en sal gruesa seca (nunca agua con madera). El método importa menos que hacerlo con intención y sin prisa.'],
      ['Paso 2: Consagrar (nombrar el propósito)', 'Con el juego limpio, tómalo entre las manos y declara su propósito: "Este juego responde solo a mí y solo a preguntas honestas". Esto no es decoración: fija el contrato de uso. Practicantes de magia del caos trátalo como creencia temporal operativa — funciona porque lo haces funcionar.'],
      ['Paso 3: Cargar (tu impronta)', 'Carga por contacto: lleva las runas contigo una semana (bolsillo, debajo de la almohada), mézclalas y tira una tirada diaria sin pregunta para acostumbrarte a su "peso". El método de señalización final: baraja boca abajo, saca una runa, invierte las que sientas "activas" — ese día conocerás su vocabulario de respuesta. Cuando puedas nombrar cada runa a ciegas por su peso y textura, está cargado.'],
    ],
    faq: [
      ['¿Cada cuánto hay que limpiar las runas?', 'Regla práctica: después de consultas para terceros, después de una sesión especialmente pesada, o cada luna nueva como mantenimiento. Si sientes que las tiradas salen "opacas", ese es tu indicador de que toca limpieza.'],
      ['¿Sirven las runas compradas online o de impresión?', 'Sí — la carga es lo que las hace instrumentos, no el material. Una runa impresa limpiada, consagrada y cargada por contacto funciona igual que una tallada en madera antigua. El ritual es del practicante, no del objeto.'],
    ],
    cta: ['Tira con tus runas cargadas', 'Norse Rune Oracle: 24 runas del Futhark Antiguo con significados en español, $3.99 pago único en Google Play.', '/apps/norse-rune-oracle.html', 'Ver la app $3.99 →'],
    rel: [['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas: referencia'], ['/blog/es-tirada-de-runas-online-gratis.html', 'Tirada de runas gratis'], ['/blog/es-tiradas-de-runas-principiantes.html', 'Tiradas para principiantes']],
  },
  {
    slug: 'es-pendulo-principiantes', en: 'pendulum-divination-beginners',
    title: 'Péndulo para Principiantes: Guía Completa en Español (2026)',
    desc: 'Cómo usar un péndulo desde cero: calibración, preguntas cerradas, programa de señales y los errores que hacen que el péndulo "no funcione".',
    h1: 'Péndulo para Principiantes', lede: 'El péndulo es la herramienta adivinatoria más rápida de aprender y la más fácil de arruinar con expectativas equivocadas. Guía honesta de cero a respuestas útiles.',
    secs: [
      ['Qué hace (y qué no hace) un péndulo', 'Un péndulo responde preguntas cerradas (sí / no / neutral) mediante micro-movimientos ideomotores: tu mente sabe algo y el cuerpo lo traduce en movimiento. Es un canal de intui­ción estructurada, no un radar del futuro. Úsalo para afinar decisiones, verificar intuiciones y explorar tu propia mapa interna — no para "saber" hechos externos que no puedes conocer.'],
      ['Calibración: el paso que todos se saltan', 'Sujeta el péndulo quieto y pregúntale en voz alta: "Muéstrame mi SÍ". Anota la dirección (vertical, horizontal, circular). "Muéstrame mi NO". "Muéstrame neutral/indeciso". Repite durante 3 días hasta que las señales sean consistentes. Sin este programa de señales, todo movimiento parece respuesta — y no lo es.'],
      ['Preguntas que funcionan (y las que no)', 'Funcionan: preguntas cerradas, una por vez, sin doble negación ("¿me conviene esta opción?" — no "¿no es verdad que no debería...?"). No funcionan: preguntas abiertas ("¿qué debería hacer con mi vida?") — para eso están el Tarot o el I Ching. Regla de oro: si la pregunta se responde con una palabra, es de péndulo.'],
    ],
    faq: [
      ['¿Importa el material del péndulo?', 'No. Metal, madera, un anillo en hilo: la respuesta es ideomotora, tuya. Calibrado con constancia, cualquier objeto colgante funciona. Elige por comodidad de agarre, no por propiedades místicas.'],
      ['¿Por qué mi péndulo no se mueve?', 'Casi siempre es una de tres: falta calibración (señales no programadas), tensión muscular (sujeta más flojo, antepoya apoyado) o una pregunta ambigua que tu mente no puede cerrar en sí/no. Vuelve a calibración y simplifica la pregunta.'],
    ],
    cta: ['Prueba el péndulo digital gratis', 'Péndulo digital online: calibra sí/no/neutral y lanza consultas cerradas al instante. Gratis, sin registro.', '/tools/digital-pendulum.html', 'Abrir el péndulo gratis →'],
    rel: [['/blog/es-iching-principiantes.html', 'I Ching para principiantes'], ['/blog/es-ritual-destierro-espacio.html', 'Ritual de destierro']],
  },
  {
    slug: 'es-ritual-destierro-espacio', en: 'how-to-banish-cleanse-space',
    title: 'Ritual de Destierro: Limpiar tu Espacio Paso a Paso (2026)',
    desc: 'Guía práctica en español del destierro (banishing): cuándo hacerlo, el método simple de 4 pasos y cómo saber si funcionó. Para limpiar espacios y reiniciar.',
    h1: 'Ritual de Destierro de Espacio', lede: 'El destierro es el lavado de manos del practicante: borra la carga residual de un espacio antes de cualquier trabajo serio. Sin él, trabajas sobre mesa sucia.',
    secs: [
      ['Cuándo desterrar (y cuándo es innecesario)', 'Destierra: antes de iniciar un trabajo mágico serio, después de conflictos o visitas intensas, al mudarte, y como mantenimiento mensual. Es innecesario (y hasta contraproducente por exceso) hacerlo todos los días: un espacio sobrelimpiado pierde su propio carácter. La señal de que toca destierro: sensación de pesadez, mal sueño en esa habitación, o trabajo que "no pega".'],
      ['El método simple de 4 pasos', '1) Barrido físico: ordena y limpia de verdad — la magia no sustituye el trapo. 2) Umbral: abre una ventana (salida para lo que se va) y recorre cada esquina con humo de incienso o palma, insiste donde sientes pesadez. 3) Declaración en cada habitación: "Este espacio está limpio y es mío". 4) Sello: cierra la ventana, marca las 4 direcciones o simplemente repite el cierre con voz firme. Duración total: 15 minutos para un apartamento.'],
      ['Cómo saber si funcionó', 'La prueba es operativa, no sentimental: duerme esa noche en el espacio y observa. Aire liviano, sueño más profundo, ganas de estar ahí = destierro exitoso. Si persiste la pesadez, repite con enfoque en la fuente: los objetos heredados o regalados cargados son los sospechosos habituales — límpialos individualmente o retíralos.'],
    ],
    faq: [
      ['¿Se puede desterrar sin incienso?', 'Sí: sustituye el humo por sonido (palmas, campana) o por agua con sal recorriendo los umbrales. El elemento activo es la intención recorriendo el espacio, el humo es solo el vehículo más cómodo.'],
      ['¿El destierro borra "entidades" de verdad?', 'En magia del caos, lo que importa es el efecto: el destierro borra la carga psicológica y ambiental acumulada, y esa borrado cambia cómo te sientes y trabajas en el espacio. Si crees en entidades, el ritual también las despide — el método es compatible con ambas cosmologías.'],
    ],
    cta: ['Construye tu destierro personalizado', 'Banishing Ritual Builder: genera tu ritual de destierro paso a paso online, gratis y sin registro.', '/tools/banishing-ritual-builder.html', 'Abrir el builder gratis →'],
    rel: [['/blog/es-gnosis-magia-del-caos.html', 'Gnosis en magia del caos'], ['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?']],
  },
  {
    slug: 'es-runas-para-magia-del-caos', en: 'runas-para-chaos-magick',
    title: 'Runas para Magia del Caos: Uso Práctico y Sigilos Rúnicos (2026)',
    desc: 'Cómo usar runas en magia del caos: como alfabeto de sigilos, como oráculo de decisión y como carga de objetos. Guía práctica en español.',
    h1: 'Runas para Magia del Caos', lede: 'Las runas son de las pocas herramientas tradicionales que encajan de forma natural en la metodología del caos: alfabeto, oráculo y carga en un solo sistema.',
    secs: [
      ['Las runas como alfabeto de sigilos', 'La técnica más directa: escribe tu intención, reduce sus letras a las runas equivalentes (el Futhark Antiguo cubre los sonidos esenciales), superponlas y estiliza hasta que sea un símbolo ilegible. Ese sigilo rúnico se carga igual que cualquier sigilo de caos: concentración, olvido, olvidar el símbolo. Ventaja sobre el alfabeto latino: las runas tienen forma angular que se superpone limpiamente y una resonancia cultural que muchos practicantes encuentran más "densa".'],
      ['Runas como oráculo de decisión', 'Para tiradas, el método de una runa por decisión basta: agita el saco, pregunta en voz alta, saca una. La runa que sale es el principio a considerar. Para más profundidad: 3 runas (pasado-presente-tendencia). La referencia completa de las 24 con significados está en nuestra guía de Futhark Antiguo — no la repito aquí.'],
      ['Carga de objetos con runas', 'Cualquier objeto se carga marcándolo con la runa del propósito: Fehu (prosperidad), Algiz (protección), Sowilo (energía y éxito). Márcalo con marcador permanente, grava o incluso visualización trazada con el dedo. El objeto queda como ancla portable del sigilo — recíbelo, míralo, recarga con una mirada.'],
    ],
    faq: [
      ['¿Las runas funcionan si no soy nórdico ni creo en Odin?', 'Sí. En magia del caos las runas se usan como sistema simbólico operativo, no como religión. La tradición es un depósito de formas probadas; el motor es tu técnica: concentración, carga y resultado observable.'],
      ['¿Qué runa es mejor para principiantes?', 'Una sola: aprende Fehu ( prosperidad y recursos) para sigilos de dinero y Algiz (protección) para objetos cargados. Con dos runas puedes resolver el 80% de los usos prácticos de entrada. El resto del Futhark llega con el uso.'],
    ],
    cta: ['Consulta tus runas ahora', 'Norse Rune Oracle: las 24 runas con significados en español, tiradas de 1 y 3, $3.99 pago único.', '/apps/norse-rune-oracle.html', 'Ver la app $3.99 →'],
    rel: [['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas: referencia'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Sigilos paso a paso'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas']],
  },
  {
    slug: 'es-libros-magia-del-caos', en: 'best-chaos-magick-books-essential-reading',
    title: 'Los Mejores Libros de Magia del Caos: Lectura Esencial (2026)',
    desc: 'Qué libros leer para aprender magia del caos en orden correcto: de Carroll a las obras modernas, con nuestra colección en español como base práctica.',
    h1: 'Los Mejores Libros de Magia del Caos', lede: 'La biblioteca esencial de la magia del caos cabe en una estantería corta. Este es el orden de lectura que funciona — con el clásico anglosajón y con las opciones en español.',
    secs: [
      ['El canon: por dónde empezar', 'El orden que recomendamos: (1) un manual de fundamentos — Liber Null & Psychonaut de Peter Carroll es el texto fundacional (~$15 en inglés); (2) Condensed Chaos de Phil Hine (~$14) como la versión más accesible y práctica; (3) un texto de práctica específica según tu interés: sigilos, servitores o adivinación. Estos dos clásicos siguen siendo los mejores por densidad de técnica por página — todo lo demás es variación o profundización.'],
      ['La alternativa en español', 'El problema del canon: todo en inglés, denso, y con jerga de los 70. Nuestra colección está escrita directamente en español con enfoque práctico: Codex Chaoticus como manual de sistema, Tarot Chaos para adivinación aplicada, Ouija Cazadora y Tratado de Runas Cazadoras para trabajo específico. Es la ruta recomendada si el inglés te frena: misma técnica, menos fricción.'],
      ['Qué NO comprar (todavía)', 'Evita como primer libro: tomas históricos (interesantes después), colecciones de ensayos dispersos, y cualquier libro que prometa "resultados en 7 días". La magia del caos es una práctica de meses: el primer libro debe ser un manual con ejercicios, no una enciclopedia.'],
    ],
    faq: [
      ['¿Puedo aprender magia del caos solo con libros?', 'Los libros dan el mapa, la práctica da el territorio: sigilos, diario de resultados y revisión. La combinación correcta es un manual + práctica diaria simple (un sigilo a la semana) + registro. Solo libros = teoría bien documentada y cero resultados.'],
      ['¿En qué orden leo la colección Cha0smagick?', 'Codex Chaoticus primero (sistema completo), luego el que responda a tu interés actual: Tarot Chaos si te mueve la adivinación, Tratado de Runas si vienes de los oráculos nórdicos, Ouija Cazadora si el contacto te llama. El orden de los específicos es libre.'],
    ],
    cta: ['Empieza con el bundle de 7 grimorios', 'Los 7 libros digitales completos por $19.99 (en vez de comprarlos sueltos a $3.99-$9.99). Pago único vía Hotmart con garantía.', '/landing-pages/books-bundle.html', 'Ver el bundle $19.99 →'],
    rel: [['/blog/es-libro-tratado-runas.html', 'Tratado de Runas'], ['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?'], ['/blog/es-creencia-como-herramienta.html', 'Creencia como herramienta']],
  },
  {
    slug: 'es-libro-tratado-runas', en: 'chaos-hunter-runes-treatise-review',
    title: 'Tratado de Runas Cazadoras de Caos: Qué Contiene y Para Quién Es (2026)',
    desc: 'Resumen honesto del Tratado de Runas Cazadoras de Caos: contenido, enfoque, para quién sirve y cómo se integra con el resto de la colección.',
    h1: 'Tratado de Runas Cazadoras de Caos', lede: 'Un grimorio que une la tradición rúnica con la metodología del caos. Esto es lo que contiene, cómo se usa y para quién es (y no es).',
    secs: [
      ['Qué contiene el Tratado', 'El Tratado cruza dos sistemas: las 24 runas del Futhark Antiguo y la metodología del caos (sigilos, gnosis, resultado observable). Contiene: la referencia de cada runa con su significado adivinatorio y su uso mágico, técnicas de carga rúnica aplicadas a sigilos, y protocolos de trabajo con runas como herramientas de decisión. No es un texto histórico: es un manual de uso.'],
      ['Para quién es (y para quién no)', 'Es para ti si: ya tiras runas y quieres pasarlas de oráculo a herramienta mágica; vienes de la magia del caos y quieres un sistema simbólico con más profundidad que el alfabeto latino; o practicas en español y cansa traducir jerga nórdica del inglés. No es para ti si: buscas reconstrucción histórica del paganismo nórdico, o nunca has hecho un sigilo — empieza por el Codex Chaoticus o por nuestra guía gratuita de sigilos.'],
      ['Cómo se integra con la colección', 'Ruta natural: Codex Chaoticus (fundamentos) → Tratado de Runas (especialización oracular) → Ouija Cazadora (trabajo de contacto). Con la app Norse Rune Oracle ($3.99) tienes el compañero digital: tiradas diarias mientras lees, para fijar el vocabulario rúnico por uso y no por memorización.'],
    ],
    faq: [
      ['¿Necesito saber noruego o nórdico antiguo?', 'No. El Tratado está en español y las runas se trabajan como símbolos operativos, no como idioma. Los nombres (Fehu, Algiz, Sowilo...) se aprenden con el uso en unas semanas.'],
      ['¿Puedo usar el Tratado con cualquier juego de runas?', 'Sí: madera, resina, piedras o impresas. El Tratado define el método; el material es irrelevante. Lo único recomendable es un juego dedicado que hayas limpiado y cargado — tenemos guía gratuita del ritual completo.'],
    ],
    cta: ['Descarga el Tratado en PDF', 'Tratado de Runas Cazadoras de Caos, PDF descargable con garantía de 7 días. También incluido en el bundle de 7 grimorios ($19.99).', '/books/tratado-runas-cazadoras-caos-pdf.html', 'Ver el libro →'],
    rel: [['/blog/es-libros-magia-del-caos.html', 'Mejores libros de magia del caos'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas'], ['/blog/es-runas-para-magia-del-caos.html', 'Runas para magia del caos']],
  },
  {
    slug: 'es-ouija-seguridad', en: 'ouija-board-safety-protection-rituals',
    title: 'Ouija: Seguridad y Protección — Ritual Completo en Español (2026)',
    desc: 'Cómo usar la ouija con protocolos de seguridad reales: preparación, reglas de sesión, cierre obligatorio y qué hacer si algo se siente mal.',
    h1: 'Ouija: Seguridad y Protección', lede: 'La ouija no es un juego ni una puerta al infierno: es un instrumento de contacto que exige protocolo. Esta es la versión en español de las reglas que importan.',
    secs: [
      ['Antes de la sesión: preparación', 'Tres reglas de preparación: (1) nevera mental clara — define en voz alta con qué tipo de contacto estás abierto y con cuál no; (2) destierra el espacio (nuestra guía de destierro sirve exactamente para esto); (3) cierre planeado — decide la señal de fin antes de empezar ("gracias y despedida en el nombre de..."), porque la sesión sin cierre planeado es la que genera las malas experiencias. Participantes: 2-4, todos sobrios, nadie que no quiera estar.'],
      ['Durante la sesión: las reglas que protegen', 'Reglas de oro: nunca preguntar por tu propia muerte ni fechas; nunca invitar ("ven conmigo"); cortar toda sesión con presencia de miedo — no se negocia con la sensación de alarma; y el operador más experimentado dirige el cierre, no el más entusiasmado. Si el planchette se vuelve errático o repetitivo, es señal de sesión agotada: ciérrala aunque la conversación sea interesante.'],
      ['El cierre: no negociable', 'El cierre se hace SIEMPRE, incluso si la sesión fue tenue: agradecimiento explícito, despedida declarada, planchette a descansar, y una verificación personal de 24 horas (¿duermes bien? ¿el espacio se siente liviano?). Si algo quedó cargado, el destierro de la guía anterior lo resuelve. Esta disciplina es la diferencia entre una práctica sostenible y anécdotas incómodas.'],
    ],
    faq: [
      ['¿Es peligrosa la ouija?', 'Con protocolo y cierre, el riesgo es comparable al de cualquier práctica de introspección profunda: bajo y gestionable. Sin protocolo — sesiones improvisadas, sin cierre, con participantes aterrados — acumulas malas experiencias que se alimentan a sí mismas. La variable de seguridad no es el tablero: es el operador.'],
      ['¿Puedo usar la ouija sola?', 'La regla clásica dice que no, y la razón es práctica: un segundo participante estabiliza la sesión (testigo, filtro de sugestión, ayuda al cierre). Si Practicas solo, prefiere un formato más contenido — nuestros protocolos de contacto en Ouija Cazadora incluyen variantes de sesión individual con límites más estrictos.'],
    ],
    cta: ['Aprende el protocolo completo', 'Ouija Cazadora: protocolos de contacto, protección y cierre en español, PDF con garantía de 7 días.', '/books/ouija-cazadora-pdf.html', 'Ver el libro →'],
    rel: [['/blog/es-ritual-destierro-espacio.html', 'Ritual de destierro'], ['/blog/es-libros-magia-del-caos.html', 'Mejores libros'], ['/blog/es-gnosis-magia-del-caos.html', 'Gnosis en magia del caos']],
  },
  {
    slug: 'es-goetia-invocar', en: 'goetia-beginners-ritual',
    title: 'Goetia para Principiantes: Primer Ritual Seguro en Español (2026)',
    desc: 'Qué es la Goetia, cómo funciona un primer ritual seguro para principiantes y por qué el marco del caos la hace más accesible (sin promesas baratas).',
    h1: 'Goetia para Principiantes', lede: 'La Goetia — los 72 espíritus del Ars Goetia — tiene fama de territorio avanzado. Con el marco del caos y un protocolo serio, tu primer ritual puede ser seguro y controlado.',
    secs: [
      ['Qué es la Goetia (en una párrafo honesto)', 'La Goetia es un grimorio del siglo XVII que cataloga 72 espíritus con sus sellos, atributos y jerarquías. Interpretaciones en espectro: entidades independientes, arquetipos psicológicos, o programas operativos — la magia del caos te deja elegir la cosmología y usar el método igual. Lo que el marco del caos aporta: sin pactos eternos, sin deudas, sin terror — un espíritu se invoca para una tarea, se agradece y se despide.'],
      ['Tu primer ritual: estructura mínima segura', 'Estructura de 6 pasos: (1) elige un espíritu con atributo claro y documento (empieza por los benignos del catálogo); (2) prepara el espacio: destierro previo obligatorio; (3) dibuja o imprime el sello del espíritu — es el punto de contacto; (4) entra en gnosis (nuestra guía de gnosis cubre los métodos); (5) declara la petición en voz alta, específica y con plazo; (6) cierre: agradecimiento, despedida, destierro posterior. Un espíritu, una tarea, una sesión.'],
      ['Errores que convierten una práctica en problema', 'Los tres clásicos: invocar sin tarea definida ("solo a ver qué pasa"), saltarse el cierre por curiosidad, y acumular espíritus en paralelo. La disciplina de Goetia es del operador: tarea clara, sesión contenida, cierre completo. Con eso, la experiencia es intensa pero gestionable — y los resultados, medibles en tu diario.'],
    ],
    faq: [
      ['¿La Goetia es peligrosa para principiantes?', 'Con protocolo completo (destierro, tarea definida, cierre), el riesgo principal es psicológico: material intenso mal procesado. Empieza por espíritus de atributos constructivos, sesiones cortas, y registro en diario. Si ya practicas destierro y sigilos con resultados, estás listo para un primer ritual.'],
      ['¿Necesito materiales caros o círculo físico?', 'No: el círculo puede ser trazado con sal, cinta o visualización. Lo esencial: sello del espíritu, espacio desterrado y protocolo completo. El gasto máximo razonable es un incienso y una vela — el equipo del ritual está entre tus manos y tu disciplina.'],
    ],
    cta: ['Explora el catálogo de espíritus', 'Arcana Goetia: los 72 espíritus con sellos, atributos y protocolo de invocación en tu Android. $3.99 pago único.', '/apps/arcana-goetia.html', 'Ver la app $3.99 →'],
    rel: [['/blog/es-ritual-destierro-espacio.html', 'Ritual de destierro'], ['/blog/es-gnosis-magia-del-caos.html', 'Gnosis en magia del caos'], ['/blog/es-libros-magia-del-caos.html', 'Mejores libros de magia del caos']],
  },
];

let ok = 0, fail = 0;
for (const p of POSTS) {
  try {
    fs.writeFileSync(path.join(BLOG, `${p.slug}.html`), page(p));
    ok++;
  } catch (e) { console.error('FAIL', p.slug, e.message); fail++; }
}
console.log(`batch3: ${ok} escritos, ${fail} fallos — total ES posts: ${fs.readdirSync(BLOG).filter(f => /^es-/.test(f)).length}`);
