// Generador de posts ES lote 2 (10 posts). Uso: node scripts/gen-es-batch2.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.join(__dirname, '..');
const B = 'https://cha0smagicklabs.com';

const CSS = `:root{--bg:#0a0a12;--card:#141424;--amber:#ffb03a;--cyan:#35c4d9;--txt:#e8e8f4;--mut:#9aa0c0;--bd:#2a2a44}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--txt);font:16px/1.7 'Helvetica Neue',Arial,sans-serif}
.wrap{max-width:760px;margin:0 auto;padding:0 20px}
.hero{background:linear-gradient(135deg,#0f0f1e,#1a1a30);border-bottom:2px solid var(--amber);padding:48px 0 32px}
.kicker{color:var(--cyan);text-transform:uppercase;letter-spacing:4px;font-size:13px;margin:0 0 12px}
h1{font-size:34px;line-height:1.25;margin:0 0 14px}.lede{color:var(--mut);font-size:18px;margin:0}
.claimbar{background:#1c1408;border-bottom:1px solid var(--amber);padding:10px 20px;text-align:center;font-size:14px}
.claimbar a{color:var(--amber);font-weight:700;text-decoration:none}
main{padding:32px 0 48px}h2{font-size:24px;margin:36px 0 12px;color:var(--amber)}
h3{font-size:19px;margin:24px 0 8px}.faq h3{color:var(--cyan)}
a{color:var(--cyan)}p{margin:12px 0}
.cta{background:var(--card);border:1px solid var(--amber);border-radius:12px;padding:22px;margin:36px 0}
.cta h2{margin:0 0 8px;font-size:20px}
.btn{display:inline-block;background:var(--amber);color:#14100a;font-weight:700;padding:12px 22px;border-radius:8px;text-decoration:none;margin:6px 8px 0 0}
.btn.ghost{background:transparent;color:var(--cyan);border:1px solid var(--cyan)}
.rel{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}
.rel a{background:var(--card);border:1px solid var(--bd);border-radius:8px;padding:8px 12px;font-size:14px;text-decoration:none}
footer{border-top:1px solid var(--bd);padding:24px 0 40px;color:var(--mut);font-size:14px}
footer a{margin-right:14px}`;

function page(p) {
  const esU = `${B}/blog/${p.slug}.html`;
  const enU = `${B}/blog/${p.en}.html`;
  const img = `${B}/assets/images/blog/${p.en.replace(/\.html$/, '')}.png`;
  const secs = p.secs.map(s => `<h2>${s[0]}</h2>\n${s.slice(1).map(t => `<p>${t}</p>`).join('\n')}`).join('\n');
  const faqs = p.faq.map(f => `<h3>${f[0]}</h3><p>${f[1]}</p>`).join('\n');
  const faqLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  const artLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: img, author: { '@type': 'Person', name: 'Frater Alek0s' }, datePublished: '2026-10-13', dateModified: '2026-10-13', publisher: { '@type': 'Organization', name: 'Cha0smagick Labs', url: B }, inLanguage: 'es', mainEntityOfPage: esU });
  const rel = p.rel.map(r => `<a href="${r[0]}">${r[1]}</a>`).join('');
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${esU}">
<link rel="alternate" hreflang="es" href="${esU}">
<link rel="alternate" hreflang="en" href="${enU}">
<link rel="alternate" hreflang="x-default" href="${enU}">
<meta name="theme-color" content="#050505">
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{'analytics_storage':'denied'});gtag('js',new Date());gtag('config','G-V6LHCPN9TK');</script>
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${esU}">
<meta property="og:type" content="article">
<meta property="og:image" content="${img}">
<meta property="og:locale" content="es_ES">
<meta property="article:published_time" content="2026-10-13">
<script type="application/ld+json">${artLd}</script>
<script type="application/ld+json">${faqLd}</script>
<style>${CSS}</style>
</head>
<body>
<div class="hero"><div class="wrap"><p class="kicker">CHAOSMAGICK LABS · EN ESPAÑOL</p><h1>${p.h1}</h1><p class="lede">${p.lede}</p></div></div>
<div class="claimbar">🥇 El sistema #1 de magia del caos en español: 12 apps + 8 libros + 61 herramientas gratis. <a href="/es/">Explorar el ecosistema →</a></div>
<main class="wrap">
${secs}
<aside class="cta"><h2>${p.cta[0]}</h2><p>${p.cta[1]}</p><p><a class="btn" href="${p.cta[2]}">${p.cta[3]} →</a> <a class="btn ghost" href="/tools/">61 herramientas gratis</a></p></aside>
<div class="faq"><h2>Preguntas frecuentes</h2>${faqs}</div>
<h2>Sigue explorando en español</h2>
<div class="rel">${rel}<a href="/es/">Centro en español</a><a href="/buscar.html">🔍 Buscador del sitio</a></div>
</main>
<footer class="wrap"><a href="/es/">Inicio ES</a><a href="/tools/">Herramientas</a><a href="/apps/">Apps</a><a href="/landing-pages/books-bundle.html">Libros Bundle $19.99</a><a href="/buscar.html">Buscar</a><a href="/">English site</a><br>© Cha0smagick Labs · Frater Alek0s</footer>
<script>(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account','2539880');</script>
</body>
</html>`;
}

const POSTS = [
  { slug: 'es-tirada-de-runas-online-gratis', en: 'free-online-rune-reading-guide.html', title: 'Tirada de Runas Online Gratis: Oráculo Vikingo al Instante (2026)', desc: 'Tira runas online gratis en español: tirada de 3 y 9 runas, cómo interpretar y cuándo sí vale la pena una app de pago. Sin registro ni suscripción.', h1: 'Tirada de Runas Online Gratis', lede: 'La tirada de runas digital funciona igual que la física: preguntas, extraes, interpretas. Aquí está el método honesto para tirar runas online en español sin registrarte ni pagar.', secs: [
    ['Cómo funciona una tirada online', 'El oráculo digital usa aleatoriedad real (el mismo azar que mezclar piedras) y respeta la estructura tradicional: pregunta clara, tirada de 3 (pasado-presente-futuro) o 9 (foto completa de la situación), y lectura considerando posición y orientación. La pantalla no hace menos mágico el método: hace más rápido el registro.'],
    ['La pregunta importa más que la tirada', 'Mal: "¿me va a ir bien?". Bien: "¿qué necesito saber sobre mi decisión de cambiar de trabajo?". Las runas responden a enfoque, no a ansiedad. Antes de tirar, escribe tu pregunta en una línea.'],
    ['Cuándo una app de pago vale la pena', 'La web gratis cubre tiradas puntuales. Una app suma si tiras a diario: historial completo, patrones de runas repetidas y guía de estudio. Norse Rune Oracle cuesta $3.99 de pago único — menos que un café, sin suscripción.'],
  ], faq: [
    ['¿Es "menos válido" tirar runas digitales?', 'El oráculo es un método de reflexión estructurada; la aleatoriedad digital es tan genuina como la física. Lo que decide la calidad de la lectura es la pregunta y tu honestidad interpretativa, no el soporte.'],
    ['¿Cuál es la mejor tirada para principiantes?', 'Tres runas: pasado, presente, consejo. Con 24 runas y 3 posiciones ya hay 13.824 combinaciones — suficiente reto sin agobio. La de 9 runas es para situaciones complejas.'],
  ], cta: ['Tira tu primera runa ahora', 'Oráculo de Runas Nórdicas: gratis, en español, sin registro. Y si quieres historial diario, la app es pago único $3.99 en Google Play.', '/apps/norse-rune-oracle.html', 'Ver la app'], rel: [['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas'], ['/blog/es-tiradas-de-runas-principiantes.html', 'Tiradas para principiantes'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas']] },

  { slug: 'es-tiradas-de-runas-principiantes', en: 'rune-spreads-for-beginners.html', title: 'Tiradas de Runas para Principiantes: 5 Tiradas Simples que Sí Funcionan', desc: '5 tiradas de runas para principiantes: de 1, 3 y 5 runas con posiciones y preguntas de ejemplo. Empieza hoy, en español.', h1: '5 Tiradas de Runas para Principiantes', lede: 'No necesitas tiradas de 15 runas para leer bien. Estas cinco tiradas cubren el 95% de las preguntas reales y enseñan el idioma rúnico por capas.', secs: [
    ['Tirada de 1 runa: el termómetro diario', 'Una pregunta, una runa: "¿qué energía hoy en mi trabajo?". Es la mejor escuela de interpretación: una runa aislada obliga a conocer su significado a fondo, sin apoyarse en contexto. Ideal cada mañana.'],
    ['Tirada de 3 runas: pasado, presente, consejo', 'La clásica universal. Runa 1: qué causó esto. Runa 2: dónde estás. Runa 3: el movimiento recomendado. Encaja en decisiones de empleo, relaciones y salud sin complicarse.'],
    ['Tirada de 5 runas: la foto completa', 'Centro (corazón del asunto), dos arriba (fuerzas que ayudan), dos abajo (fuerzas que frenan), y si usas 6, una extra arriba como "resultado probable". Úsala cuando la pregunta lleva semanas dándole vueltas.'],
  ], faq: [
    ['¿Debo invertir las runas al leer?', 'Cuando aprendes, no: lee solo posición derecha y nota mentalmente si una runa "cae incómoda". Cuando domines las 24, añade inversión como matiz de bloqueo. Mejor un idioma hablado bien que dos a medias.'],
    ['¿Cuántas tiradas al día son demasiadas?', 'Una seria. Tirar la misma pregunta cinco veces es como preguntar a un espejo si te gusta tu cara: solo mide tu ansiedad. Si la respuesta no convence, el problema es la pregunta.'],
  ], cta: ['Practica con guía en español', 'El Tratado de Runas Cazadoras del Caos enseña tiradas, bindrunes y rituales con protocolos completos. PDF en español, descarga inmediata en Hotmart.', '/books/tratado-runas-cazadoras-caos-pdf.html', 'Ver el tratado'], rel: [['/blog/es-tirada-de-runas-online-gratis.html', 'Runas online gratis'], ['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas']] },

  { slug: 'es-cruz-celta-10-posiciones', en: 'celtic-cross-tarot-spread-meaning-positions.html', title: 'La Cruz Celta: Guía Completa de las 10 Posiciones (en Español)', desc: 'Cruz Celta paso a paso: las 10 posiciones del spread de tarot más famoso, cómo leerlas en orden y 3 errores de principiante. En español.', h1: 'La Cruz Celta: las 10 Posiciones Explicadas', lede: 'La Cruz Celta es el spread de tarot más usado del mundo por una razón: cubre pasado, presente, obstáculos y dirección con una sola tirada de 10 cartas.', secs: [
    ['El orden de lectura correcto', '1) Situación presente. 2) El desafío que la cruza. 3) Base: raíz del asunto. 4) Pasado reciente. 5) Lo posible (corona). 6) Lo cercano (futuro inmediato). 7) Tu actitud interna. 8) El entorno: personas y ambiente. 9) Esperanzas y miedos. 10) Resultado probable. Lee de la cruz (1-6) al bastón (7-10): primero el diagnóstico, luego la dinámica.'],
    ['Cómo interpretar sin memorizar 10 significados', 'Truco de lectura: agrupa. Cartas 1+2 = el nudo del problema; 3+4 = de dónde viene; 5+6 = hacia dónde; 7+8+9 = el clima interno y externo; 10 = el horizonte. La Cruz Celta se lee mejor por pares y trío que carta por carta.'],
    ['Los 3 errores clásicos', 'Preguntar sí/no (la cruz celta es diagnóstica, no oracular), mezclar tarot invertido cuando aún no lo dominas, y leer la posición 10 como sentencia fija: es tendencia, no destino — la práctica seria siempre deja margen de agencia.'],
  ], faq: [
    ['¿La Cruz Celta sirve para cualquier pregunta?', 'Sirve para situaciones complejas con historia y varios actores. Para preguntas puntuales ("¿acepto la oferta?"), una tirada de 3 cartas es más honesta y útil.'],
    ['¿Cuánto tiempo toma aprenderla?', 'Una semana de práctica diaria para el orden y el agrupamiento; un mes para leerla con fluidez. La claves es leer por grupos, no memorizar 10 definiciones sueltas.'],
  ], cta: ['Practica la cruz celta offline', 'Tarot Rider Waite: mazo completo offline con significados en contexto, pago único $9.99 en Google Play. Sin anuncios, sin suscripción.', '/apps/unofficial-rider-waite-tarot.html', 'Ver la app $9.99'], rel: [['/blog/es-tarot-rider-waite-principiantes.html', 'Rider Waite para principiantes'], ['/blog/es-carta-muerte-tarot.html', 'Carta de la Muerte'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-tarot-rider-waite-principiantes', en: 'rider-waite-tarot-beginners-guide.html', title: 'Tarot Rider Waite para Principiantes: Guía Completa (2026)', desc: 'Tarot Rider Waite desde cero: la estructura de 78 cartas, arcanos mayores y menores, cómo empezar a leer y qué hacer con los palos. En español.', h1: 'Tarot Rider Waite para Principiantes', lede: 'El Rider Waite (1909) es el mazo que definió el tarot moderno: 78 cartas con escenas ilustradas que se leen como historias. Aquí está tu arranque en español.', secs: [
    ['La estructura: 22 + 56', '22 arcanos mayores (El Loco a El Mundo): arquetipos y fuerzas grandes de la vida. 56 menores en 4 palos: Copas (emociones), Bastos (acción y pasión), Espadas (mente y conflicto), Oros (materia y trabajo). Aprende primero los palos y los números — la lógica de los menores es una escala de 1 a 10 en cada palo.'],
    ['El método de lectura por escena', 'La ventaja del Rider Waite: las cartas menores tienen escenas. En vez de memorizar "3 de Espadas = dolor", mira la imagen: un corazón atravesado por tres espadas, lluvia. La escena cuenta la historia; la tradición confirma. Empieza describiendo la imagen en voz alta — así leían los primeros tarotistas.'],
    ['Tu primer mes de práctica', 'Semana 1: mayores, una carta al día. Semana 2: palos y números. Semana 3: tiradas de 3 cartas (pasado-presente-consejo). Semana 4: la Cruz Celta simplificada. Diario de lectura siempre: fecha, pregunta, cartas, lectura, y revisión a 7 días.'],
  ], faq: [
    ['¿Necesito "cargar" o regalar el primer mazo?', 'El mito de "el primer mazo debe ser regalo" no tiene base tradicional seria: el mazo que uses es el que funcione para ti. Lo que sí ayuda es un primer contacto intencional: recorrerlo completo una vez, carta por carta.'],
    ['¿Tarot físico o app?', 'Físico para el ritual y la sensibilidad; app para práctica constante, significados al instante y tiradas en cualquier lugar. Tarot Rider Waite (pago único $9.99) es la versión digital completa, offline y sin anuncios.'],
  ], cta: ['Lleva el mazo completo en el bolsillo', 'Tarot Rider Waite: 78 cartas offline, significados en español, pago único $9.99, sin suscripción ni anuncios. Google Play.', '/apps/unofficial-rider-waite-tarot.html', 'Descargar la app'], rel: [['/blog/es-cruz-celta-10-posiciones.html', 'La Cruz Celta'], ['/blog/es-carta-muerte-tarot.html', 'Carta de la Muerte'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-carta-muerte-tarot', en: 'death-card-tarot-meaning.html', title: 'Carta de la Muerte en el Tarot: Significado, Sí o No y Invertida', desc: 'La carta de la Muerte no anuncia muerte física: significa fin de ciclo y transformación. Significado derecho, invertido, sí o no y en amor. En español.', h1: 'La Carta de la Muerte: lo que Realmente Significa', lede: 'La carta más temida del tarot casi nunca habla de muerte literal. Habla de cierres: la relación que termina, el trabajo que se acaba, la versión de ti que ya no encaja.', secs: [
    ['Significado derecho: el cierre necesario', 'Derecha, la Muerte señala un fin de ciclo ya en marcha: algo termina para que otra cosa ocupe su lugar. En consultas de trabajo: renuncia, cierre de etapa o cambio de rol. En amor: el final de una relación agotada o la transformación profunda de una que sigue. La energía es de alivio, no de catástrofe — resistir el cierre es lo que duele.'],
    ['Invertida: el cierre que resistes', 'Invertida indica que estás aferrado a algo cuya hora ya pasó: la relación muerta que revives, el empleo que se acaba que niegas. La lectura honesta pregunta: ¿qué estoy manteniendo vivo por miedo, no por vida?'],
    ['¿Sí o no? y en el amor', 'Como respuesta rápida: No, o mejor dicho "esto termina". En el amor no anuncia muerte física nunca: anuncia transformación o ruptura según las cartas vecinas. Junto a cartas de fuerza (El Sol, El Emperador), transformación; junto a espadas, separación limpia.'],
  ], faq: [
    ['¿Puede la Muerte anunciar una muerte real?', 'No en la práctica seria del tarot. La tradición moderna la lee como transformación. Anunciar muertes es lectura irresponsable y dañina — ningún tarotista serio lo hace.'],
    ['¿Qué hacer cuando sale la Muerte?', 'No asustarse: inventariar. ¿Qué en tu vida está claramente terminado? La carta invita a cerrar con dignidad lo que ya cerró por sí mismo.'],
  ], cta: ['Consulta significados offline', 'Tarot Rider Waite con las 78 cartas, significados completos y modo sí/no. Pago único $9.99 en Google Play, sin anuncios.', '/apps/unofficial-rider-waite-tarot.html', 'Ver la app'], rel: [['/blog/es-tarot-rider-waite-principiantes.html', 'Rider Waite para principiantes'], ['/blog/es-cruz-celta-10-posiciones.html', 'La Cruz Celta'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-fases-de-la-luna-significado', en: 'moon-phases-meaning-8-phases-explained.html', title: 'Fases de la Luna: Significado de las 8 Fases para Práctica (2026)', desc: 'Las 8 fases de la luna y su significado para magia y rituales: luna nueva, creciente, llena, menguante y las 4 intermedias. Guía en español.', h1: 'Las 8 Fases de la Luna y su Significado', lede: 'La luna no "emite energía mística" verificable, pero sí estructura el tiempo de la práctica como un metrónomo: sembrar, construir, celebrar, soltar. Así se usan sus 8 fases.', secs: [
    ['El ciclo en 4 movimientos', 'Luna nueva (sembrar: intenciones, sigilos, planes), creciente (construir: acciones, práctica, impulso), luna llena (celebrar y ver resultados: picos, gratitud, evaluación), menguante (soltar: limpiezas, cierres, descanso). Entre ellas, 4 fases de transición (cuartos y gibosas) para ajustar el rumbo.'],
    ['Qué hacer en cada fase — tabla práctica', 'Nueva: escribe tu intención y cárgala como sigilo. Cuarto creciente: avanza el proyecto — es fase de acciones concretas. Llena: revisa, celebra, Haz una lectura de tarot o runas de balance. Cuarto menguante: destierro, ordenar, cerrar cuentas. Gibosa creciente: refina; gibosa menguante: suelta detalles.'],
    ['Por qué funciona como estructura (y no como causalidad)', 'La honestidad del método: no hay evidencia de que la luna cause nada. Lo que sí hace es darte un calendario de intención que evita que tu práctica sea esporádica. Un ciclo de 29.5 días con cuatro ritmos claros convierte la disciplina en ritual.'],
  ], faq: [
    ['¿Debo hacer rituales SOLO en luna llena?', 'No. El mito de la luna llena como única fase "fuerte" es popular pero limitante: cada fase tiene su trabajo. Sembrar en luna nueva es tan válido como celebrar en llena.'],
    ['¿Cómo sé qué fase es hoy?', 'Con una calculadora de fases lunares: gratis online en Cha0smagick Labs, o la app Lunar Phase Calculator (pago único $3.99) con calendario, alertas y notas de ritual.'],
  ], cta: ['Calcula las fases gratis', 'Calculadora de fases lunares online gratis, en español. Para calendario con alertas y registro de rituales, la app cuesta $3.99 pago único.', '/apps/lunar-phase-calculator.html', 'Ver la app $3.99'], rel: [['/blog/es-ritual-luna-nueva.html', 'Ritual de luna nueva'], ['/blog/es-luna-para-hechizos.html', 'Luna para hechizos'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-ritual-luna-nueva', en: 'new-moon-ritual-manifestation.html', title: 'Ritual de Luna Nueva para Manifestar: Paso a Paso (2026)', desc: 'Ritual de luna nueva paso a paso: limpiar el espacio, escribir la intención, cargarla como sigilo y cerrar el ritual. Duración 20 minutos. En español.', h1: 'Ritual de Luna Nueva para Manifestar', lede: 'Un ritual de luna nueva bien hecho toma 20 minutos: limpiar, sembrar, cargar, cerrar. Esta es la versión completa, sin humo y en español.', secs: [
    ['Preparación (5 minutos): espacio y papel', 'Luna nueva = sembrar. Prepara: un lugar tranquilo, papel, bolígrafo y una vela si te gusta el marcador simbólico. Antes de escribir, limpia el espacio a tu manera: orden físico, ventana abierta, o un destierro breve si la semana fue pesada.'],
    ['La siembra (10 minutos): intención y carga', 'Escribe UNA intención en presente ("tengo una entrevista de trabajo en marzo"), conviértela en sigilo (sin vocales, sin repetidas, dibuja el glifo), y cárgala: medita 10 respiraciones profundas y mira el glifo en silencia total, o usa ejercicio físico corto. Guarda el papel sin etiqueta — la luna creciente será tu recordatorio de acción, no de obsesión.'],
    ['Cierre y compromiso de acción', 'Apaga la vela con gratitud breve y escribe en tu calendario la acción terrenal correspondiente (enviar CV, agendar llamada) para los próximos 3 días. La luna nueva abre la ventana; tu acción la usa. Anota la fase y fecha en tu registro para revisar resultados al ciclo siguiente.'],
  ], faq: [
    ['¿Qué hora es mejor para el ritual de luna nueva?', 'La que puedas sostener con constancia: no hay hora "correcta". Muchos practicantes lo hacen al anochecer por la claridad del simbolismo, pero el criterio honesto es la regularidad mes a mes.'],
    ['¿Puedo sembrar varias intenciones en una luna nueva?', 'Mejor una. Tres sigilos en un solo ritual suelen diluir la atención. Si tienes dos áreas urgentes (trabajo y salud), siembra una este ciclo y otra en el siguiente.'],
  ], cta: ['Calendario lunar con alertas', 'Lunar Phase Calculator: fase actual, calendario 2026 completo y notas de ritual. Pago único $3.99 en Google Play.', '/apps/lunar-phase-calculator.html', 'Ver la app'], rel: [['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna'], ['/blog/es-luna-para-hechizos.html', 'Luna para hechizos'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-luna-para-hechizos', en: 'moon-phase-calculator-for-spells.html', title: 'Calendario Lunar para Hechizos: Cast Each Spell on the Right Night', desc: 'Qué hechizo hacer según la fase lunar: sembrar en nueva, construir en creciente, culminar en llena, soltar en menguante. Calendario práctico en español.', h1: 'Calendario Lunar para Hechizos', lede: 'El calendario lunar es la agenda de la práctica: qué noche conviene qué trabajo. Esta guía te da el mapa fase por fase para que cada ritual tenga su momento.', secs: [
    ['El mapa completo por fase', 'Luna nueva: sigilos de inicio, plantar intenciones, rituales de renovación personal. Creciente: hechizos de construcción — atraer clientes, fuerza física, estudio sostenido. Llena: culminación, carga máxima de amuletos, lecturas de balance, celebración. Menguante: destierros, cortar hábitos, limpiezas de espacio, cierres de ciclos. Gibosas: ajuste y refinamiento.'],
    ['La regla de los 3 días de gracia', 'Cada fase tiene pico de ~3 días (la noche exacta y los dos vecinos). No necesitas la noche exacta: el rango de 3 días de la fase vale. Esto evita la frustración de "se me pasó la luna" y hace el calendario realista.'],
    ['Registro: el truco que convierte el calendario en método', 'Anota cada ritual: fase, fecha, intención, resultado a 30 días. En 3-4 ciclos verás tus patrones reales — qué fase te funciona, qué intención te cuesta. Sin registro, el calendario lunar es decoración; con registro, es método.'],
  ], faq: [
    ['¿Puedo hacer un hechizo de "soltar" en luna creciente?', 'Sí — el calendario es estructura, no cárcel. Lo óptimo es respetar el ritmo, pero un destierro urgente no espera 15 días. La regla práctica: urgencia rompe calendario, planeación lo respeta.'],
    ['¿La luna llena "carga más" un amuleto?', 'No hay evidencia de energía lunar medible. Lo que sí hay: el pico emocional de la luna llena concentró tu atención — y la atención es el ingrediente real de la carga. Úsalo como estructura, no como física.'],
  ], cta: ['Tu calendario ritual de bolsillo', 'Lunar Phase Calculator: fases, alertas de luna llena/nueva, notas por ritual. Pago único $3.99, sin suscripción.', '/apps/lunar-phase-calculator.html', 'Ver la app'], rel: [['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna'], ['/blog/es-ritual-luna-nueva.html', 'Ritual de luna nueva'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-iching-online-gratis', en: 'free-i-ching-online-guide.html', title: 'I Ching Online Gratis: Lanza el Libro de los Cambios (2026)', desc: 'Consulta el I Ching online gratis en español: método de 3 monedas, hexagramas con significado y cómo formular la pregunta correcta.', h1: 'I Ching Online Gratis', lede: 'El I Ching (Libro de los Cambios) tiene 3.000 años de uso como herramienta de decisión. Aquí lo lanzas gratis online y aprendes a leer el hexagrama sin morir en el intento.', secs: [
    ['Cómo lanzar: el método de 3 monedas', 'Lanza 3 monedas 6 veces. Cada lanzamiento suma: cara+caras+cruz = 3 puntos (cara = 3, cruz = 2). Con las 6 líneas construyes el hexagrama de abajo hacia arriba. Las líneas 6 y 9 (móviles) cambian: dan el segundo hexagrama, la dirección hacia la que evoluciona tu situación.'],
    ['La pregunta que hace legible la respuesta', 'El I Ching responde mejor a preguntas de proceso: "¿cómo debo manejar esta negociación?" que a preguntas de oráculo: "¿me contratarán?". Formula la situación, no el desenlace. Y una consulta por tema: repetir la misma pregunta es ruido.'],
    ['Leer el hexagrama sin agobio', 'Cada hexagrama tiene nombre e imagen (p. ej. 24, El Retorno: la luz vuelve tras la oscuridad). Lee primero la imagen general, luego el juicio, y si hay líneas móviles, esas son TU texto personal. Es más que suficiente para una consulta útil.'],
  ], faq: [
    ['¿Es válido lanzar el I Ching digitalmente?', 'Sí: el azar de un generador es tan genuino como el de las monedas. La tradición china original usaba tallos de milenrama — el método ha cambiado siempre; la estructura de 6 líneas es lo constante.'],
    ['¿Qué es una línea móvil?', 'Una línea (6 o 9 en la suma) marcada para cambiar: representa la parte de tu situación que está en movimiento activo. Las líneas móviles son el texto más específico de la consulta — léelas primero si existen.'],
  ], cta: ['Lanza tu hexagrama gratis', 'I Ching online gratis con las 64 hexagramas en español. Para práctica diaria con historial, la app I Ching Oracle cuesta $3.99 pago único.', '/apps/iching-oracle.html', 'Ver la app $3.99'], rel: [['/blog/es-iching-metodo-monedas.html', 'Método de monedas'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot'], ['/blog/es-iching-principiantes.html', 'I Ching para principiantes']] },

  { slug: 'es-iching-metodo-monedas', en: 'how-to-cast-iching-digitally.html', title: 'Cómo Lanzar el I Ching Digitalmente: Método de Monedas Explicado', desc: 'El método de 3 monedas del I Ching explicado en español: valores, las 4 combinaciones, líneas móviles y construcción del hexagrama paso a paso.', h1: 'Método de Monedas del I Ching, Paso a Paso', lede: 'Tres monedas, seis lanzamientos, un hexagrama. El método de monedas es la versión accesible del I Ching tradicional — y digital funciona exactamente igual.', secs: [
    ['Los valores: cara y cruz', 'Cara (escudo/inscripción) = 3 puntos. Cruz (figura) = 2 puntos. Cada lanzamiento de 3 monedas suma de 6 a 9: 6 = yin antiguo (línea móvil rota), 7 = yang joven (línea sólida), 8 = yin joven (línea rota), 9 = yang antiguo (línea móvil sólida).'],
    ['Construir el hexagrama de abajo hacia arriba', 'Primer lanzamiento = línea inferior. Sexto = superior. Apila: sólida para 7 y 9, rota para 6 y 8. Resultado: tu hexagrama (la situación actual). Si hubo 6s o 9s, cambia esas líneas: obtienes el segundo hexagrama (la tendencia).'],
    ['Cómo leer los dos hexagramas', 'Hexagrama 1: quién eres en esta situación. Hexagrama 2 (el mutante): hacia dónde va. Las líneas móviles, si hay, son las instrucciones específicas. Sin líneas móviles, la consulta es un retrato estable: lee solo el juicio del hexagrama.'],
  ], faq: [
    ['¿Cuántas líneas móviles es normal tener?', 'De 0 a 3 es lo habitual. Muchas líneas móviles suelen indicar una situación en pleno caos — algunos practicantes reformulan la pregunta y lanzan de nuevo días después.'],
    ['¿Importa qué monedas uso?', 'No. Tres monedas iguales (de verdad o de app), lanzadas con pregunta clara. La herramienta es lo de menos; el registro de la consulta es lo que da calidad.'],
  ], cta: ['Lanza sin contar monedas', 'I Ching Oracle hace el método de monedas por ti: 6 lanzamientos, hexagramas con textos completos en español e historial. Pago único $3.99.', '/apps/iching-oracle.html', 'Ver la app'], rel: [['/blog/es-iching-online-gratis.html', 'I Ching online gratis'], ['/blog/es-iching-principiantes.html', 'I Ching para principiantes'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },
];

let ok = 0, fail = 0;
for (const p of POSTS) {
  try { fs.writeFileSync(path.join(R, 'blog', p.slug + '.html'), page(p)); ok++; }
  catch (e) { console.log('FAIL ' + p.slug + ': ' + e.message); fail++; }
}
console.log(`BATCH2: ok=${ok} fail=${fail} total=${POSTS.length}`);
