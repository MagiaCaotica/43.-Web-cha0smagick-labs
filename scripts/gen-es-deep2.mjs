// Generador de posts ES deep-dive lote 2 (10 posts ampliados). Uso: node scripts/gen-es-deep2.mjs
// Mismo template page() que gen-es-batch2.mjs + hook intro, CTA con herramienta gratis y bloque BTL final.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const R = path.join(__dirname, '..');
const B = 'https://cha0smagicklabs.com';

const CSS = `:root{--bg:#030303;--card:#0a0a0a;--amber:#c0a060;--cyan:#c0a060;--txt:#f0f0f0;--mut:#a0a0a0;--bd:#1a1a1a}
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
.btl{background:linear-gradient(135deg,#1c1408,#101020);border:2px solid var(--amber);border-radius:12px;padding:26px;margin:36px 0}
.btl h2{margin:0 0 12px;font-size:22px}
.btl p{margin:10px 0}
footer{border-top:1px solid var(--bd);padding:24px 0 40px;color:var(--mut);font-size:14px}
footer a{margin-right:14px}`;

function page(p) {
  const esU = `${B}/blog/${p.slug}.html`;
  const enU = `${B}/blog/${p.en}.html`;
  const img = `${B}/assets/images/blog/${p.en.replace(/\.html$/, '')}.png`;
  const hook = (p.hook || []).map(t => `<p>${t}</p>`).join('\n');
  const secs = p.secs.map(s => `<h2>${s[0]}</h2>\n${s.slice(1).map(t => `<p>${t}</p>`).join('\n')}`).join('\n');
  const faqs = p.faq.map(f => `<h3>${f[0]}</h3><p>${f[1]}</p>`).join('\n');
  const faqLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } })) });
  const artLd = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.desc, image: img, author: { '@type': 'Person', name: 'Frater Alek0s' }, datePublished: '2026-10-13', dateModified: '2026-10-13', publisher: { '@type': 'Organization', name: 'Cha0smagick Labs', url: B }, inLanguage: 'es', mainEntityOfPage: esU });
  const rel = p.rel.map(r => `<a href="${r[0]}">${r[1]}</a>`).join('');
  const btl = `<aside class="btl"><h2>Empieza hoy</h2>
<p>📚 <a href="https://pay.hotmart.com/D93257466P" rel="noopener"><strong>8 Libros Bundle $19.99</strong></a>: los 8 tratados de la serie Cha0smagick en PDF, en español, con descarga inmediata. 51% de descuento frente a comprarlos por separado.</p>
<p>📱 <a href="${p.app[0]}" rel="noopener"><strong>${p.app[1]}</strong></a>: ${p.app[2]}</p>
<p>🔮 ¿Práctica continua? El <strong>Inner Circle</strong> ($9/mes) es la membresía del ecosistema Cha0smagick Labs: comunidad de practicantes y material exclusivo para llevar tu trabajo al siguiente nivel.</p>
</aside>`;
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
${hook}
${secs}
<aside class="cta"><h2>${p.cta[0]}</h2><p>${p.cta[1]}</p><p><a class="btn" href="${p.cta[2]}">${p.cta[3]} →</a> <a class="btn ghost" href="${p.tool[0]}">${p.tool[1]}</a></p></aside>
<div class="faq"><h2>Preguntas frecuentes</h2>${faqs}</div>
${btl}
<h2>Sigue explorando en español</h2>
<div class="rel">${rel}<a href="/es/">Centro en español</a><a href="/buscar.html">🔍 Buscador del sitio</a></div>
</main>
<footer class="wrap"><a href="/es/">Inicio ES</a><a href="/tools/">Herramientas</a><a href="/apps/">Apps</a><a href="/landing-pages/books-bundle.html">Libros Bundle $19.99</a><a href="/buscar.html">Buscar</a><a href="/">English site</a><br>© Cha0smagick Labs · Frater Alek0s</footer>
<script>(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[]).push(arguments);},l=d.createElement(e),l.async=1,l.src=u,n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})(window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');ml('account','2539880');</script>
</body>
</html>`;
}

const POSTS = [
  { slug: 'es-tirada-de-runas-online-gratis', en: 'free-online-rune-reading-guide.html', title: 'Tirada de Runas Online Gratis: Oráculo Vikingo al Instante (2026)', desc: 'Tira runas online gratis en español: tirada de 3 y 9 runas, cómo interpretar y cuándo sí vale la pena una app de pago. Sin registro ni suscripción.', h1: 'Tirada de Runas Online Gratis', lede: 'La tirada de runas digital funciona igual que la física: preguntas, extraes, interpretas. Aquí está el método completo para tirar runas online en español, sin registro y sin pagar un céntimo.', hook: [
    'Hay un momento, en toda consulta rúnica, en que el mundo se queda quieto. Sacudes la bolsa, metes la mano y sientes el peso frío de una piedra entre los dedos. Esa sensación no se puede descargar. Pero la pregunta que la acompaña, la estructura de la tirada y la honestidad de tu lectura: eso sí viaja perfecto por una pantalla.',
    'Si llegaste aquí buscando una tirada de runas online gratis, probablemente te pasó algo de esto: una decisión que no se aclara, un patrón que se repite, o simplemente la curiosidad de acercarte al oráculo vikingo sin comprar nada ni registrarte en ningún sitio. Bienvenido: estás en el lugar correcto.',
    'Esta guía no es un adorno de buscadores. Es el método que usan los practicantes serios: qué tirada elegir según tu pregunta, cómo interpretar sin memorizar 24 significados de golpe, y cuándo tiene sentido pasar de la web gratuita a una app de pago. Empieza por el principio y tira tu primera runa hoy mismo.',
  ], secs: [
    ['Qué es una tirada de runas (y por qué funciona igual online)',
      'Las runas del Futhark Antiguo son un alfabeto de 24 signos usado en el norte de Europa entre los siglos II y VIII. Su uso adivinatorio aparece en fuentes como la Saga de Egil y la tradición moderna lo reconstruyó con un método claro: formulas una pregunta, extraes runas al azar y las lees según su posición en la tirada.',
      'El oráculo digital replica exactamente esa estructura. La aleatoriedad de un generador es tan genuina como la de mezclar piedras en una bolsa de tela: en ambos casos el resultado escapa a tu control consciente, que es precisamente lo que hace útil al oráculo. Lo que cambia es la velocidad de registro: la pantalla anota por ti, guarda el historial y te muestra el significado al instante.',
      'Hay un detalle que los puristas olvidan: la tradición original usaba tallos, astillas y marcas grabadas en madera. El soporte siempre fue intercambiable. Lo constante es el método: pregunta, azar, posición, interpretación.'],
    ['Paso a paso: tu primera tirada online en 5 minutos',
      'Primero, escribe tu pregunta en una sola línea. No la pienses: escríbela. "¿Qué necesito saber sobre mi decisión de cambiar de trabajo?" es una buena pregunta. "¿Me va a ir bien?" no lo es, porque no le da al oráculo nada concreto que responder.',
      'Segundo, elige la tirada. Para empezar, la de 3 runas: pasado, presente, consejo. Tercero, tira con calma: respira, visualiza la pregunta y extrae. Cuarto, lee cada runa en su posición antes de buscar significados sueltos en internet: el contexto de la posición es la mitad del mensaje.',
      'Quinto, anota la lectura completa: fecha, pregunta, runas, interpretación y cómo te sentiste. Sin registro no hay aprendizaje; con él, en un mes tendrás un mapa de tus propios patrones que ningún manual puede darte.'],
    ['Tirada de 3 runas: el caballo de batalla diario',
      'Es la tirada más usada del mundo rúnico y por buena razón: cubre el 80% de las preguntas reales. Runa 1: qué causó esto. Runa 2: dónde estás ahora. Runa 3: el movimiento recomendado. Encaja en decisiones de empleo, relaciones, salud y dinero sin complicarse.',
      'Ejemplo real: pregunta "¿qué necesito saber sobre mi conflicto con mi socio?". Sale Ansuz (comunicación) en pasado, Isa (bloqueo) en presente y Raidho (movimiento ordenado) en consejo. Lectura: la relación nació de buenas conversaciones, hoy está congelada, y la salida es retomar el diálogo con estructura, no esperar que se derrita solo.',
      'Con 24 runas y 3 posiciones existen 13.824 combinaciones posibles. Ninguna tirada se repite lo suficiente como para volverse mecánica, y esa variedad es la que mantiene vivo el oráculo año tras año.'],
    ['Tirada de 9 runas: la foto completa',
      'Cuando la situación es compleja (varias personas, meses de historia, decisiones encadenadas), la tirada de 9 runas da el panorama. Extraes 9 runas y las colocas en una cuadrícula de 3x3, de una en una, sin mirar los significados hasta el final.',
      'El orden de lectura: centro (el corazón del asunto), luego las 4 runas de la cruz interna (arriba, abajo, izquierda, derecha: fuerzas inmediatas), y por último las 4 esquinas (influencias de fondo, contexto, lo que aún no es visible).',
      'No intentes leer las 9 de golpe. Empieza por el centro, forma frases de dos runas vecinas y deja que el mapa se arme solo. Una tirada de 9 bien leída vale más que cinco tiradas de 3 mal formuladas.'],
    ['Cómo interpretar sin memorizar 24 significados',
      'Truco de los practicantes veteranos: aprende las 3 familias antes que las runas sueltas. El Futhark Antiguo se divide en 3 aettir de 8 runas: el aett de Freyr (riqueza, crecimiento, lo material), el de Hagalaz (prueba, cambio, lo inevitable) y el de Tyr (justicia, decisión, lo espiritual).',
      'Cuando una runa te sea desconocida, pregúntate primero a qué familia pertenece: ¿habla de recursos, de transformación o de decisión? Luego afina con su nombre: Fehu es riqueza móvil (ganancia, pero también gasto), Othala es riqueza fija (herencia, hogar, lo que no se vende).',
      'En dos semanas de práctica diaria con este sistema, las 24 runas dejan de ser una lista y se vuelven un idioma. Y un idioma se lee, no se recita.'],
    ['Los 4 errores que arruinan una tirada online',
      'Error 1: tirar la misma pregunta cinco veces esperando una respuesta mejor. El oráculo mide, no negocia; repetir solo mide tu ansiedad. Error 2: preguntas vagas. "¿Cómo va todo?" produce lecturas vagas, siempre.',
      'Error 3: leer cada runa aislada de su posición. La misma runa en "pasado" y en "consejo" dice cosas distintas. Error 4: ignorar el registro. La memoria selectiva te hará recordar los aciertos y olvidar los fallos; el diario te muestra la verdad completa.',
      'Y un quinto, más sutil: usar el oráculo para decisiones que ya tomaste. Si buscas permiso, no busques runas. El oráculo es una brújula, no un chaperón.'],
    ['Cuándo una app de pago vale la pena',
      'La web gratuita cubre tiradas puntuales perfectamente. Una app suma cuando la práctica se vuelve diaria: historial completo con fechas, detección de runas repetidas (esos patrones que a mano se te escapan), guía de estudio progresiva y modo offline para tirar sin conexión.',
      'Norse Rune Oracle cuesta $3.99 de pago único: menos que un café, sin suscripción y sin anuncios. Si tiras más de dos veces por semana, se paga sola en el primer mes de uso.',
      'Si tiras una vez al mes, quédate con la web: es honesto y suficiente. La herramienta correcta es la que sigue tu ritmo, no la que te obliga a cambiarlo.'],
  ], faq: [
    ['¿Es "menos válido" tirar runas digitales?', 'No. El oráculo es un método de reflexión estructurada y la aleatoriedad digital es tan genuina como la física. La calidad de una lectura depende de la pregunta y de tu honestidad interpretativa, no del soporte. La tradición original usaba madera, hueso y tallos: el medio siempre fue intercambiable.'],
    ['¿Cuál es la mejor tirada para principiantes?', 'La de 3 runas: pasado, presente, consejo. Con 24 runas y 3 posiciones hay 13.824 combinaciones, suficiente variedad sin agobio. La de 9 runas es para situaciones complejas con varios actores o meses de historia.'],
    ['¿Puedo hacer varias tiradas seguidas sobre lo mismo?', 'No tiene sentido práctico. Tirar la misma pregunta repetidamente solo mide tu ansiedad, no cambia la situación. Si la respuesta no te convence, el problema casi siempre está en cómo está formulada la pregunta: reformúlala y espera al día siguiente.'],
    ['¿Qué significa una runa invertida (merkstave)?', 'Algunas runas tienen forma simétrica y no pueden invertirse; otras sí, y su lectura invertida matiza bloqueo, retraso o energía mal dirigida. Si estás empezando, lee solo posición derecha y anota cuando una runa "cae incómoda": con el tiempo ese instinto se vuelve dato.'],
    ['¿Las runas predicen el futuro?', 'La lectura seria de runas no predice: diagnostica y orienta. Muestran la dinámica actual de una situación y las tendencias probables si nada cambia. El margen de agencia siempre es tuyo, y esa es precisamente la utilidad del oráculo: ver el mapa antes de elegir el camino.'],
    ['¿Necesito consagrar o "cargar" las runas digitales?', 'Los rituales de consagración aplican a un objeto físico que vas a manipular. En el oráculo digital, el equivalente honesto es la intención: una pregunta clara y un momento de calma antes de tirar. El método hace el resto.'],
  ], cta: ['Tira tu primera runa ahora', 'Oráculo de Runas Nórdicas online: gratis, en español, sin registro. Y si quieres historial diario y patrones automáticos, la app Norse Rune Oracle es pago único $3.99 en Google Play.', '/apps/norse-rune-oracle.html', 'Ver la app $3.99'], tool: ['/tools/viking-runes.html', 'Oráculo de runas gratis'], app: ['/apps/norse-rune-oracle.html', 'Norse Rune Oracle ($3.99, pago único)', 'el oráculo rúnico completo en tu bolsillo: tiradas ilimitadas, historial y guía de las 24 runas del Futhark Antiguo'], rel: [['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas del Futhark'], ['/blog/es-tiradas-de-runas-principiantes.html', 'Tiradas para principiantes'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas']] },

  { slug: 'es-tiradas-de-runas-principiantes', en: 'rune-spreads-for-beginners.html', title: 'Tiradas de Runas para Principiantes: 5 Tiradas Simples que Sí Funcionan', desc: '5 tiradas de runas para principiantes: de 1, 3 y 5 runas con posiciones y preguntas de ejemplo. Empieza hoy, en español.', h1: '5 Tiradas de Runas para Principiantes', lede: 'No necesitas tiradas de 15 runas para leer bien. Estas cinco tiradas cubren el 95% de las preguntas reales y te enseñan el idioma rúnico por capas, sin agobio.', hook: [
    'El error clásico del principiante en runas no es interpretar mal: es empezar demasiado grande. Compra el mazo, mira un vídeo de alguien tirando doce runas con nombres nórdicos impronunciables, y decide que esto no es para él. Falso. El oráculo rúnico se aprende como cualquier idioma: primero palabras sueltas, luego frases cortas, y solo al final, párrafos enteros.',
    'Esta guía te da las cinco tiradas que cubren prácticamente toda pregunta que te vas a hacer en tu primer año de práctica. Cada una con sus posiciones, ejemplos de preguntas y el momento adecuado para usarla. Nada de teoría de sobremesa: esto es para tirar hoy.',
    'La regla de oro antes de empezar: una tirada es una conversación estructurada con tu propia intuición, no una máquina de respuestas. Cuanto más clara la pregunta, más útil la respuesta. Todo lo demás se aprende tirando.',
  ], secs: [
    ['Antes de tirar: la pregunta bien hecha',
      'Una tirada de runas responde a enfoque, no a ansiedad. La diferencia entre una lectura útil y una sopa de generalidades casi siempre está en la pregunta. Mal: "¿me va a ir bien en el amor?". Bien: "¿qué necesito saber para que mi relación actual funcione mejor?".',
      'Fórmula práctica: situación concreta + qué quieres saber. "Mi búsqueda de empleo lleva tres meses" + "¿qué estoy haciendo mal?". Escribe la pregunta en una línea antes de tocar la bolsa. Si no cabe en una línea, todavía no sabes qué preguntas.',
      'Este paso de 30 segundos es el que separa una consulta seria de un entretenimiento. Los lectores veteranos lo hacen siempre, aunque lleven décadas tirando.'],
    ['Tirada de 1 runa: el termómetro diario',
      'Una pregunta, una runa. "¿Qué energía tengo hoy para mi proyecto?" y extraes. Es la mejor escuela de interpretación que existe: una runa aislada te obliga a conocer su significado a fondo, sin apoyarte en el contexto de las vecinas.',
      'Hazlo cada mañana durante dos semanas y tendrás algo mejor que un manual: tu propia relación con las 24 runas. Anota fecha, pregunta, runa y una frase de lectura. A los 14 días, relee el diario: verás patrones que ningún libro te habría enseñado.',
      'Es también la tirada ideal para días de prisa. Treinta segundos de pausa consciente valen más que una tirada de 9 hecha con la cabeza en otra parte.'],
    ['Tirada de 3 runas: pasado, presente, consejo',
      'La clásica universal y el caballo de batalla del oráculo rúnico. Runa 1: qué causó esto. Runa 2: dónde estás ahora. Runa 3: el movimiento recomendado. Encaja en decisiones de empleo, relaciones, salud y dinero sin complicarse.',
      'Ejemplo: "¿qué necesito saber sobre mi discusión de ayer con mi hermana?". Perthro (misterio, lo oculto) en pasado, Kenaz (antorcha, claridad) en presente, Gebo (intercambio, regalo) en consejo. Lectura: había algo que no se dijo en su momento, hoy hay oportunidad de aclararlo, y la salida es dar sin esperar reciprocidad inmediata.',
      'Cuando domines esta tirada, el resto del oráculo se abre solo: las tiradas mayores son variaciones de la misma lógica de posiciones.'],
    ['Tirada de 5 runas: la foto completa',
      'Cuando la pregunta lleva semanas dando vueltas, la tirada de 5 da el mapa. Centro: el corazón del asunto. Dos superiores: fuerzas que ayudan. Dos inferiores: fuerzas que frenan. Si quieres una sexta runa, colócala encima como "resultado probable si mantengo el rumbo".',
      'La clave de esta tirada es leer por pares: las dos de arriba juntas, las dos de abajo juntas, y cada par contra el centro. Las runas no viven aisladas; el significado emerge de la tensión entre posiciones.',
      'Úsala una vez por situación, no una vez por día. La tirada de 5 es una radiografía: repetirla cada mañana solo mide tu ansiedad, no la evolución del asunto.'],
    ['Tirada de las Nornas: el pasado, el presente, el porvenir',
      'Versión nórdica de la tirada de 3, con nombres propios: Urd (lo que fue), Verdandi (lo que se vuelve) y Skuld (lo que debe venir). Es la tirada ideal para preguntas de trayectoria: "¿hacia dónde va esta relación?", "¿qué camino toma mi carrera si sigo así?".',
      'La diferencia con la tirada de 3 clásica es el matiz de Skuld: no es un futuro escrito, es la deuda que el presente está contrayendo. Lo que siembro hoy, Skuld lo cobra mañana.',
      'Esa lectura de responsabilidad es pura sabiduría nórdica: el destino en la mitología nórdica no es una sentencia, es una consecuencia. La tirada de las Nornas te muestra la cuenta que estás acumulando.'],
    ['El diario de tiradas: el truco que separa a los que aprenden de los que no',
      'Sin registro, el oráculo es entretenimiento. Con registro, es método. Anota en cada tirada: fecha, fase lunar si la usas, pregunta exacta, runas, lectura completa y una revisión a 7 o 30 días: ¿qué pasó realmente?',
      'En tres meses tendrás datos que ningún libro puede darte: qué runas te salen cuando te bloqueas, qué posiciones lees mejor, qué tipo de preguntas te dan lecturas precisas. El diario convierte la intuición en habilidad medible.',
      'Y hay un beneficio silencioso: escribir la lectura te obliga a comprometerte con una interpretación. "Ya veremos qué significa" no es una lectura; una frase escrita, sí.'],
    ['Los 4 errores del principiante (y cómo evitarlos)',
      'Uno: tirar en estado de ansiedad pura. El oráculo necesita una pregunta, no un grito. Dos: buscar el significado de cada runa en internet antes de intentar leerla tú. Primero tu lectura, luego la confirmación.',
      'Tres: mezclar tiradas y preguntas. Una tirada, una pregunta, una lectura. Cuatro: abandonar a la tercera semana porque "no pasa nada". El oráculo rúnico es como el gimnasio: los resultados llegan a los que mantienen la rutina, no a los que la intentan.',
      'Si solo recuerdas una cosa de esta guía, que sea esta: la constancia vale más que el talento. Dos semanas de tiradas diarias de 1 runa te enseñan más que dos meses de vídeos.'],
  ], faq: [
    ['¿Debo invertir las runas al leer?', 'Cuando aprendes, no: lee solo posición derecha y nota mentalmente si una runa "cae incómoda". Cuando domines las 24, añade la inversión como matiz de bloqueo o energía mal dirigida. Mejor un idioma hablado bien que dos a medias.'],
    ['¿Cuántas tiradas al día son demasiadas?', 'Una seria. Tirar la misma pregunta cinco veces es como preguntar a un espejo si te gusta tu cara: solo mide tu ansiedad. Si la respuesta no convence, el problema es la pregunta, no la tirada.'],
    ['¿Qué tirada uso para una decisión sí/no?', 'Las runas no son un oráculo de sí/no puro, pero la tirada de 1 runa sirve como brújula: runas de crecimiento y movimiento (Fehu, Raidho, Sowilo) inclinan a sí; runas de pausa y bloqueo (Isa, Hagalaz, Nauthiz) inclinan a espera. Para matices, la de 3 es más honesta.'],
    ['¿Puedo tirar runas para otra persona?', 'Sí, con su consentimiento y su pregunta. La tirada para terceros funciona mejor cuando la persona formula su propia pregunta y tú solo operas el oráculo. Tirar "por encima de la cabeza" de alguien que no pidió nada suele producir lecturas proyectivas, no oraculares.'],
    ['¿Cuánto tarda en "funcionar" una tirada?', 'La lectura es inmediata; la verificación llega con los hechos. Revisa tus tiradas a 7 y 30 días: verás que muchas runas describían la dinámica con una precisión incómoda. Ese contraste entre lectura y realidad es donde se aprende de verdad.'],
  ], cta: ['Practica las 5 tiradas hoy', 'Saca la bolsa (o la web): el tirador de runas online es gratis y sin registro. Para historial diario y patrones automáticos, Norse Rune Oracle es pago único $3.99 en Google Play.', '/apps/norse-rune-oracle.html', 'Ver la app $3.99'], tool: ['/tools/rune-drawer.html', 'Tirador de runas gratis'], app: ['/apps/norse-rune-oracle.html', 'Norse Rune Oracle ($3.99, pago único)', 'practica las 5 tiradas con historial automático, patrones de runas repetidas y guía de estudio de las 24 runas'], rel: [['/blog/es-tirada-de-runas-online-gratis.html', 'Runas online gratis'], ['/blog/es-24-runas-futhark-referencia.html', 'Las 24 runas'], ['/blog/es-limpiar-y-cargar-runas.html', 'Limpiar y cargar runas']] },

  { slug: 'es-cruz-celta-10-posiciones', en: 'celtic-cross-tarot-spread-meaning-positions.html', title: 'La Cruz Celta: Guía Completa de las 10 Posiciones (en Español)', desc: 'Cruz Celta paso a paso: las 10 posiciones del spread de tarot más famoso, cómo leerlas en orden y 3 errores de principiante. En español.', h1: 'La Cruz Celta: las 10 Posiciones Explicadas', lede: 'La Cruz Celta es el spread de tarot más usado del mundo por una razón: cubre pasado, presente, obstáculos y dirección con una sola tirada de 10 cartas. Aquí están sus 10 posiciones, el orden de lectura y los errores que debes evitar.', hook: [
    'Hay tiradas de tarot que se aprenden y tiradas que se heredan. La Cruz Celta es de las segundas: la usaban los tarotistas de salón de París, la publicó Arthur Edward Waite en 1911 y sigue siendo la consulta completa por excelencia. Diez cartas que, bien leídas, cuentan una historia entera: de dónde vienes, dónde estás, qué te frena y hacia dónde vas.',
    'El problema de la Cruz Celta no es su dificultad: es que casi todo el mundo la aprende mal. Memoriza diez significados sueltos, lee carta por carta como quien repasa una lista de la compra, y se pierde lo que hace grande a esta tirada: la conversación entre posiciones.',
    'Esta guía te la enseña como se lee de verdad: preparación, orden, agrupamiento y un ejemplo completo. Al final tendrás lo necesario para tu primera Cruz Celta seria, con mazo físico o con la app.',
  ], secs: [
    ['Por qué la Cruz Celta es el spread rey',
      'Popularizada por Arthur Edward Waite en "The Pictorial Key to the Tarot" (1911), la Cruz Celta es el único spread que aparece en casi todos los manuales de tarot del siglo XX. Su ventaja es estructural: en una sola tirada cubre situación, obstáculo, raíz, pasado, futuro cercano, actitud interna, entorno, esperanzas y resultado.',
      'Es una tirada diagnóstica: no responde "sí o no", responde "qué está pasando aquí y qué hacer con ello". Por eso es la favorita para situaciones complejas: un cambio de carrera, una relación en crisis, un proyecto estancado.',
      'Y por eso también es la peor tirada para preguntas simples. Usar la Cruz Celta para "¿acepto la oferta?" es como usar un escáner corporal para saber si tienes hambre.'],
    ['Preparación: el significificante, el barajado y el corte',
      'Antes de las 10 cartas, tres decisiones. Primera: si usas significificante (una carta que representa al consultante). Es opcional; muchos lectores serios lo omiten. Segunda: el barajado, con la pregunta en mente. Tercera: el corte, que marca la actitud del consultante ante la situación.',
      'No hay una forma "correcta" de barajar: la correcta es la que te permite concentrarte en la pregunta. Lo que sí importa es no barajar dos veces "por si acaso": el oráculo no premia la duda.',
      'Si tiras para otra persona, deja que ella baraje y corte. La tirada gana honestidad cuando el consultante participa físicamente en la preparación.'],
    ['Las 10 posiciones, una por una',
      '1) Situación presente: el corazón del asunto. 2) El desafío: lo que cruza y complica la situación. 3) La base: raíz profunda, a veces inconsciente. 4) El pasado reciente: lo que acaba de influir. 5) La corona: lo posible, la meta consciente o el ideal. 6) El futuro inmediato: lo que se acerca.',
      '7) Tu actitud: cómo el consultante vive la situación por dentro. 8) El entorno: personas, ambiente, influencias externas. 9) Esperanzas y miedos: a menudo la misma carta sirve para ambos. 10) Resultado probable: la tendencia si nada cambia.',
      'Aprende las posiciones en este orden y en voz alta. En tres días de práctica las tendrás sin esfuerzo, y a partir de ahí la tirada se lee sola.'],
    ['El orden de lectura correcto: cruz y bastón',
      'La Cruz Celta se lee en dos bloques. Primero la cruz (cartas 1 a 6): el diagnóstico. Qué pasa, qué lo complica, de dónde viene, hacia dónde va. Segundo el bastón (cartas 7 a 10, la columna vertical a la derecha): la dinámica. Actitud, entorno, expectativas y desenlace.',
      'Leer primero la cruz y después el bastón evita el error más común: saltar a la carta 10 (resultado) sin entender el camino. El resultado de una Cruz Celta es una consecuencia, no una sentencia.',
      'Este orden también te da una estructura narrativa para la consulta: primero el diagnóstico en voz alta, luego la dinámica, y al final una síntesis de dos frases que una la historia completa.'],
    ['Lectura por grupos: el truco de los pares',
      'El secreto de los lectores fluidos: no leen 10 cartas, leen 5 grupos. Cartas 1+2: el nudo del problema (situación contra desafío). Cartas 3+4: el origen (raíz y pasado reciente). Cartas 5+6: la dirección (ideal y futuro cercano).',
      'Cartas 7+8+9: el clima (actitud interna, entorno, esperanzas y miedos). Carta 10: el horizonte. Con este agrupamiento, una Cruz Celta se lee en 10 minutos con coherencia narrativa, en vez de 40 minutos de monólogos sueltos.',
      'Practica el agrupamiento con tiradas de estudio antes de usarlo con consultas reales. En una semana, tu cerebro deja de pedir la lista de posiciones y empieza a pedir los pares.'],
    ['Los 3 errores clásicos (y cómo corregirlos)',
      'Error 1: usarla para preguntas sí/no. La Cruz Celta es diagnóstica; para "¿acepto la oferta?" una tirada de 3 cartas es más honesta. Error 2: meter cartas invertidas antes de dominar las derechas. Un idioma a la vez.',
      'Error 3: leer la posición 10 como destino fijo. Es tendencia, no sentencia: la práctica seria siempre deja margen de agencia. Si el resultado incomoda, la pregunta correcta es "¿qué cambiaría esta tendencia?", no "¿cómo lo evito?".',
      'Hay un cuarto error, más moderno: tirar la Cruz Celta a diario "para ver cómo evoluciona". Es una tirada de consulta, no de seguimiento. Para seguimiento, mejor un diario y una tirada semanal de 3.'],
    ['Ejemplo completo: cambio de trabajo',
      'Pregunta: "¿qué necesito saber sobre mi posible cambio de empresa?". Sale El Emperador en presente (estructura, control), la Torre en desafío (ruptura inminente), el Cuatro de Oros en base (aferrarse a lo seguro).',
      'En el bastón: el Rey de Copas en actitud (calma aparente, mar interior agitado), el Ocho de Bastos en entorno (todo se mueve rápido), la Estrella en esperanzas y el As de Oros en resultado.',
      'Lectura en una frase: la ruptura ya está en marcha, tu aferramiento a la seguridad es la raíz, y el nuevo comienzo material es real si dejas de agarrarte al muro. Así se lee una Cruz Celta: una historia, no diez cartas.'],
  ], faq: [
    ['¿La Cruz Celta sirve para cualquier pregunta?', 'Sirve para situaciones complejas con historia y varios actores. Para preguntas puntuales ("¿acepto la oferta?", "¿le digo la verdad?"), una tirada de 3 cartas es más honesta y útil. La Cruz Celta es un escáner completo, no un test rápido.'],
    ['¿Cuánto tiempo toma aprenderla?', 'Una semana de práctica diaria para el orden y el agrupamiento; un mes para leerla con fluidez. La clave no es memorizar 10 definiciones: es aprender a leer por grupos de cartas, como se lee un párrafo y no letra por letra.'],
    ['¿Qué hago si salen muchas cartas invertidas?', 'Si usas inversión, léelas como matiz: bloqueo, exceso o energía mal dirigida. Si aún no dominas las derechas, da la vuelta a todas y lee solo posición derecha. La tirada no pierde valor: gana claridad.'],
    ['¿Puedo usar la Cruz Celta con cualquier mazo?', 'Sí. Funciona con Rider Waite, Marsella, Thoth o cualquier mazo de 78 cartas. Con mazos de escenas (como el Rider Waite) la lectura narrativa es más fácil; con el Marsella se apoya más en números y palos.'],
    ['¿La posición 10 es un destino fijo?', 'No. Es la tendencia probable si el consultante mantiene su actitud actual (carta 7) y el entorno no cambia (carta 8). La Cruz Celta describe una trayectoria, y las trayectorias se pueden corregir. Ese margen de agencia es lo que hace útil a la tirada.'],
    ['¿Necesito el significificante para tirar la Cruz Celta?', 'No es obligatorio. Waite lo incluía en su método, pero muchos lectores profesionales lo omiten sin pérdida de precisión. Si te ayuda a concentrar la pregunta, úsalo; si te complica el barajado, déjalo fuera.'],
  ], cta: ['Practica la Cruz Celta hoy', 'Construye tu tirada con el constructor de tiradas de tarot online, gratis y en español. Para práctica diaria con las 78 cartas offline, Tarot Rider Waite es pago único $9.99 en Google Play.', '/apps/unofficial-rider-waite-tarot.html', 'Ver la app $9.99'], tool: ['/tools/tarot-spread-builder.html', 'Constructor de tiradas gratis'], app: ['/apps/unofficial-rider-waite-tarot.html', 'Tarot Rider Waite ($9.99, pago único)', 'las 78 cartas completas, offline y sin anuncios, con significados en contexto para cada posición de la Cruz Celta'], rel: [['/blog/es-tarot-rider-waite-principiantes.html', 'Rider Waite para principiantes'], ['/blog/es-carta-muerte-tarot.html', 'Carta de la Muerte'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-tarot-rider-waite-principiantes', en: 'rider-waite-tarot-beginners-guide.html', title: 'Tarot Rider Waite para Principiantes: Guía Completa (2026)', desc: 'Tarot Rider Waite desde cero: la estructura de 78 cartas, arcanos mayores y menores, cómo empezar a leer y qué hacer con los palos. En español.', h1: 'Tarot Rider Waite para Principiantes', lede: 'El Rider Waite (1909) es el mazo que definió el tarot moderno: 78 cartas con escenas ilustradas que se leen como historias. Aquí está tu arranque completo desde cero, en español.', hook: [
    'Abre un mazo Rider Waite por cualquier página y verás algo que ningún otro oráculo tiene: historias dibujadas. Un hombre colgado de un árbol por el pie. Una torre alcanzada por un rayo. Una mujer con leones domesticados a sus pies. El tarot Rider Waite no se memoriza: se mira, y las imágenes cuentan la lectura antes de que abras cualquier manual.',
    'Creado en 1909 por Arthur Edward Waite con ilustraciones de Pamela Colman Smith, es el mazo más influyente del tarot moderno: casi todos los mazos posteriores copian su estructura. Si aprendes el Rider Waite, aprendes el idioma del tarot entero.',
    'Esta guía es tu primer mes de práctica: la estructura del mazo, los cuatro palos, el método de lectura por escena y un plan de estudio semana a semana. Sin humo, sin promesas mágicas: método puro para leer de verdad.',
  ], secs: [
    ['Por qué el Rider Waite es EL mazo para empezar',
      'Antes de 1909, los mazos de tarot (como el Marsella) tenían los arcanos menores ilustrados solo con símbolos: tres espadas, cinco copas. Waite y Colman Smith rompieron con eso: cada carta menor tiene una escena completa. Un corazón atravesado por tres espadas. Un artesano contemplando sus copas llenas de emoción.',
      'Esa decisión cambió el tarot para siempre: hizo posible leer por imagen, sin memorizar 56 significados. Para un principiante es la diferencia entre aprender un idioma con frases y aprenderlo con palabras sueltas.',
      'Además, al ser el mazo de referencia de casi toda la literatura tarotística posterior, cualquier libro o curso que compres después encajará con tu mazo. Empezar por el Rider Waite es empezar por el estándar.'],
    ['La estructura: 22 + 56',
      'El mazo tiene 78 cartas en dos bloques. Los 22 arcanos mayores (del Loco al Mundo): arquetipos y fuerzas grandes de la vida, los personajes del viaje. Los 56 arcanos menores en 4 palos de 14 cartas cada uno: Copas (emociones, agua), Bastos (acción y pasión, fuego), Espadas (mente y conflicto, aire) y Oros (materia y trabajo, tierra).',
      'Cada palo va del As (1, inicio puro) al 10 (culminación), y añade 4 figuras: Paje (aprendizaje), Caballero (movimiento), Reina (recepción, interioridad) y Rey (dominio, exterioridad). Con esta lógica, la mitad del mazo se deduce en vez de memorizarse.',
      'No necesitas aprender las 78 cartas de golpe. Necesitas entender la arquitectura: 22 personajes, 4 elementos, una escala numérica. El resto es práctica.'],
    ['Los 4 palos y su elemento: la brújula rápida',
      'Cuando no recuerdes el significado de una carta menor, pregunta por su palo. Copas: ¿qué siento? Bastos: ¿qué hago o qué me apasiona? Espadas: ¿qué pienso o qué me preocupa? Oros: ¿qué tengo o qué construyo?',
      'Y por su número: los Ases son inicios, los 5 son conflicto o pérdida, los 8 son movimiento y trabajo, los 10 son cierres de ciclo. Palo + número te da el 70% del significado de cualquier carta menor. La escena de la imagen te da el resto.',
      'Esta brújula funciona incluso con cartas que nunca has visto. Es la diferencia entre un mazo que se estudia y un mazo que se lee.'],
    ['El método de lectura por escena',
      'La ventaja del Rider Waite: las cartas menores tienen escenas. En vez de memorizar "3 de Espadas = dolor", mira la imagen: un corazón atravesado por tres espadas, lluvia encima. La escena cuenta la historia; la tradición confirma.',
      'Ejercicio de los primeros días: saca una carta y descríbela en voz alta como si se la contaras a alguien que no la ve. "Un hombre camina hacia un acantilado con una rosa y una mochila, un perro ladra a sus pies". Después compara con el significado tradicional: El Loco, el inicio confiado. En dos semanas, tu ojo lee solo.',
      'Este método no es un truco moderno: es como leían los primeros tarotistas del Rider Waite. La imagen primero, el manual después. La memoria llega como consecuencia, no como requisito.'],
    ['Los arcanos mayores: el viaje del Loco',
      'Los 22 mayores se leen como un viaje: el Loco sale al mundo con inocencia total y atraviesa arquetipos hasta El Mundo, la culminación. En el camino: el Mago (voluntad y recursos), la Emperatriz (abundancia), la Torre (ruptura de estructuras falsas), la Muerte (fin de ciclos), el Sol (claridad y éxito).',
      'No intentes aprendértelos de golpe. Una carta al día, con su imagen y una frase propia, y en tres semanas tendrás el viaje completo en la cabeza.',
      'Cuando en una tirada salen varios mayores, la situación toca fuerzas grandes: lecciones de vida, no detalles cotidianos. Presta atención: el oráculo está subiendo el volumen.'],
    ['Tu primer mes de práctica, semana a semana',
      'Semana 1: arcanos mayores, una carta al día con descripción de imagen y significado. Semana 2: palos y números, sin cartas sueltas: aprende la lógica de cada palo. Semana 3: tiradas de 3 cartas (pasado, presente, consejo) con diario de lectura.',
      'Semana 4: la Cruz Celta simplificada o tiradas de 5. Regla de oro durante todo el mes: anota fecha, pregunta, cartas y lectura, y revisa a 7 días. El diario es lo que convierte curiosidad en habilidad.',
      'Si un día no puedes tirar, describe una carta de memoria. La constancia importa más que la perfección: 15 minutos diarios baten a 3 horas el domingo.'],
    ['Mazo físico o app: cuándo usar cada uno',
      'El mazo físico tiene el ritual: barajar, cortar, sentir las cartas. Es insustituible para la sensibilidad y para tiradas a otras personas. La app tiene la constancia: práctica en cualquier momento, significados al instante, historial de tiradas y modo offline.',
      'Los lectores que progresan usan ambos: físico para las tiradas serias, app para el estudio diario. No son rivales, son turnos distintos del mismo trabajo.',
      'Tarot Rider Waite (pago único $9.99, sin suscripción ni anuncios) es la versión digital completa del mazo, con las 78 cartas y significados en contexto. Si estudias en el metro, en la cola del súper o en la pausa del café, es la herramienta que hace posible la constancia.'],
  ], faq: [
    ['¿Necesito "cargar" o regalar el primer mazo?', 'El mito de que "el primer mazo debe ser un regalo" no tiene base tradicional seria: el mazo que uses es el que funcione para ti. Lo que sí ayuda es un primer contacto intencional: recorrer las 78 cartas una vez, en orden, mirando cada imagen.'],
    ['¿Tarot físico o app?', 'Físico para el ritual y la sensibilidad; app para práctica constante, significados al instante y tiradas en cualquier lugar. Tarot Rider Waite (pago único $9.99) es la versión digital completa, offline y sin anuncios.'],
    ['¿Cuánto tarda en aprenderse el tarot?', 'Para leer tiradas de 3 cartas con soltura: un mes de práctica diaria. Para fluidez con el mazo completo: de 3 a 6 meses. El tarot es un idioma: se aprende usándolo, no leyendo manuales de memoria.'],
    ['¿Debo aprender los significados invertidos desde el inicio?', 'No. Aprende primero las 78 cartas derechas. Las inversiones son matices (bloqueo, exceso, energía mal dirigida) que se añaden cuando la base es sólida. Muchos lectores profesionales ni siquiera las usan.'],
    ['¿El tarot predice el futuro?', 'La lectura seria del tarot no predice: diagnostica tendencias y orienta decisiones. Las cartas muestran la dinámica actual de una situación y su probable evolución si nada cambia. El margen de acción siempre es del consultante.'],
    ['¿Puedo aprender con un mazo Marsella o Thoth?', 'Sí, pero el camino es más empinado: el Marsella exige memorizar los menores (no tienen escenas) y el Thoth tiene un sistema simbólico propio (Crowley, astrología, cábala). El Rider Waite es la puerta de entrada estándar por su legibilidad visual.'],
  ], cta: ['Lleva el mazo completo en el bolsillo', 'Consulta cualquier carta con la referencia de tarot online, gratis y en español. Para práctica diaria con las 78 cartas offline, Tarot Rider Waite es pago único $9.99 en Google Play.', '/apps/unofficial-rider-waite-tarot.html', 'Descargar la app'], tool: ['/tools/tarot-card-reference.html', 'Referencia de cartas gratis'], app: ['/apps/unofficial-rider-waite-tarot.html', 'Tarot Rider Waite ($9.99, pago único)', 'las 78 cartas ilustradas, significados en español, tiradas guiadas y modo offline para tu práctica diaria'], rel: [['/blog/es-cruz-celta-10-posiciones.html', 'La Cruz Celta'], ['/blog/es-carta-muerte-tarot.html', 'Carta de la Muerte'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-carta-muerte-tarot', en: 'death-card-tarot-meaning.html', title: 'Carta de la Muerte en el Tarot: Significado, Sí o No y Invertida', desc: 'La carta de la Muerte no anuncia muerte física: significa fin de ciclo y transformación. Significado derecho, invertido, sí o no y en amor. En español.', h1: 'La Carta de la Muerte: lo que Realmente Significa', lede: 'La carta más temida del tarot casi nunca habla de muerte literal. Habla de cierres: la relación que termina, el trabajo que se acaba, la versión de ti que ya no encaja. Aquí está su significado completo.', hook: [
    'Es la carta que hace que un consultante se ponga rígido en la silla. La Muerte: un esqueleto con armadura a caballo, pisando coronas, mientras un sol nace entre dos torres al fondo. Nadie quiere verla salir en su tirada. Y sin embargo, entre los tarotistas serios es de las cartas más bienvenidas: anuncia que algo que ya estaba muerto por fin va a ser enterrado.',
    'La Muerte (arcano mayor XIII) no anuncia muerte física en la práctica seria del tarot. Anuncia transformación: el fin de un ciclo que ya se agotó y el espacio que se abre cuando dejas de aferrarte. Es una carta de alivio disfrazada de amenaza.',
    'En esta guía verás su simbología completa, el significado derecho e invertido, cómo responde a preguntas de sí/no, qué dice en el amor y cómo matiza la lectura según las cartas vecinas. Sin miedo y sin adornos.',
  ], secs: [
    ['Por qué la Muerte asusta (y por qué no debería)',
      'El miedo a esta carta es cultural, no tradicional. En los manuales clásicos (Waite incluido) la Muerte significa fin de ciclo, transformación, transición. La asociación con muerte literal es invención del cine y de lectores irresponsables que usan el miedo como herramienta.',
      'La paradoja de la Muerte: es una de las cartas más honestas del mazo. No promete, no amenaza: constata. Algo en tu vida ya terminó su función, y la carta solo te está informando de lo que tu intuición ya sabe.',
      'Los tarotistas profesionales la reciben con alivio. En una tirada estancada, la Muerte es la carta que explica por qué nada avanza: porque algo viejo ocupa el sitio de algo nuevo.'],
    ['La simbología: lo que dice la imagen',
      'Mira la carta del Rider Waite con calma. El esqueleto lleva armadura: la transformación es inevitable e imparcial, no se negocia. Cabalga sobre un caballo blanco: purificación, avance imparable. El estandarte con la rosa de cinco pétalos: la vida que renace tras la muerte, el ciclo que continúa.',
      'En el suelo, un rey yace pisado: lo que cae es lo rígido, lo que se creía eterno. Un obispo reza: incluso las estructuras espirituales se renuevan. Una mujer mira hacia otro lado y un niño ofrece una flor: la inocencia de quien acepta el cambio.',
      'Y al fondo, entre dos torres, un sol naciente: la salida ya está en el horizonte. Waite dibujó el amanecer dentro de la carta más oscura del mazo. Ese detalle es toda la enseñanza.'],
    ['Significado derecho: el cierre necesario',
      'Derecha, la Muerte señala un fin de ciclo ya en marcha. En consultas de trabajo: renuncia, cierre de etapa, cambio de rol o de sector. En amor: el final de una relación agotada o la transformación profunda de una que sigue. En proyectos: el abandono necesario de un camino que ya no lleva a ninguna parte.',
      'La energía de la carta es de alivio, no de catástrofe. Lo que duele no es el cierre: es resistirlo. Cuando la Muerte sale derecha, la pregunta útil no es "¿qué se pierde?" sino "¿qué estoy impidiendo que nazca al no soltar lo viejo?".',
      'Fíjate en el matiz temporal: la Muerte no anuncia un fin que va a llegar. Constata un fin que ya está ocurriendo. La carta llega tarde a la noticia, no temprano.'],
    ['Invertida: el cierre que resistes',
      'Invertida, la Muerte indica aferramiento: estás manteniendo vivo algo cuya hora ya pasó. La relación muerta que se reviva cada domingo, el empleo que se acaba y se niega, la identidad profesional que ya no describe a quien eres.',
      'La lectura honesta pregunta: ¿qué estoy sosteniendo por miedo y no por vida? La Muerte invertida no castiga: advierte. El cierre va a ocurrir de todos modos; la única variable es si ocurre con dignidad o con drama.',
      'En tiradas repetidas, la Muerte invertida que insiste es de los mensajes más claros del mazo: el oráculo no cambia de tema hasta que el tema se atiende.'],
    ['¿Sí o no? Y qué dice en el amor',
      'Como respuesta rápida a preguntas cerradas: No, o mejor dicho "esto termina". No es un no moral: es un no de ciclo. Si preguntas "¿debo seguir en este proyecto?" y sale la Muerte, la respuesta es que ese proyecto, tal como está, ya se acabó.',
      'En el amor, la Muerte nunca anuncia muerte física: anuncia transformación o ruptura según las cartas vecinas. Junto a fuerzas constructivas (El Sol, El Emperador, el As de Copas): transformación profunda de la relación. Junto a espadas y torres: separación limpia.',
      'El contexto manda. La misma carta que cierra una relación agotada puede estar bendiciendo la renovación de una que tiene vida. Por eso las tiradas de una sola carta para el amor son una trampa: sin contexto, la Muerte asusta; con contexto, orienta.'],
    ['La Muerte con cartas vecinas: cómo matiza la lectura',
      'La Muerte rara vez viene sola, y sus vecinas definen el tono. Con la Torre: ruptura súbita y necesaria. Con el Juicio: renacimiento, segunda oportunidad tras el cierre. Con el Colgado: un final que llevas meses viendo venir y no aceptas.',
      'Con el As de Bastos o el Sol: lo que nace después tiene energía real. Con el Cuatro de Oros: el aferramiento es el verdadero problema de la consulta.',
      'Aprende a leer la Muerte en su párrafo, no en su línea. Una carta mayor nunca habla sola: habla con la tirada que la rodea, y esa conversación es la lectura.'],
    ['Qué hacer cuando sale la Muerte',
      'Primero: respirar. No es una amenaza, es un inventario. Segundo: preguntarte con honestidad qué en tu vida está claramente terminado: la relación, el trabajo, el hábito, la versión de ti que ya no encaja.',
      'Tercero: cerrar con dignidad. La Muerte del Rider Waite no destruye: recoge. Un cierre consciente (una conversación pendiente, una despedida, un correo de desvinculación) convierte la energía de la carta en movimiento en vez de en resistencia.',
      'Y cuarto: mirar el sol naciente del fondo de la carta. Todo cierre de ciclo en el tarot lleva un amanecer dibujado. Esta carta no es la excepción: es la regla más visible.'],
  ], faq: [
    ['¿Puede la Muerte anunciar una muerte real?', 'No en la práctica seria del tarot. La tradición moderna la lee como transformación y fin de ciclo. Anunciar muertes es lectura irresponsable y dañina: ningún tarotista profesional serio lo hace, y si alguien te lo dice, busca otro tarotista.'],
    ['¿Qué hacer cuando sale la Muerte en una tirada?', 'No asustarse: inventariar. Pregúntate qué en tu vida está claramente terminado y qué estás manteniendo por inercia. La carta invita a cerrar con dignidad lo que ya cerró por sí mismo, y a mirar el espacio que se abre.'],
    ['¿Es mala señal en tiradas de amor?', 'No es buena ni mala: es honesta. En el amor anuncia transformación o ruptura según las cartas vecinas. Junto a cartas de fuerza y luz (El Sol, El Emperador), transformación profunda; junto a espadas, separación. Nunca anuncia muerte física.'],
    ['¿Qué significa la Muerte en posición de futuro?', 'Que el ciclo actual se está cerrando y el desenlace pasará por un cambio de estado: no habrá vuelta a la situación anterior. Leída bien, es información valiosa: te permite preparar el cierre en lugar de sufrirlo.'],
    ['¿Por qué me sale la Muerte repetidamente?', 'Cuando una carta se repite en tiradas distintas, el mensaje insiste. Suele indicar un cierre que el consultante lleva tiempo evitando: el oráculo no cambia de tema hasta que el tema se atiende. Revisa qué área de tu vida pide renovación.'],
    ['¿La Muerte invertida es peor que derecha?', 'No peor: más incómoda. Derecha, el cierre avanza y el alivio llega. Invertida, el cierre se resiste y el desgaste se alarga. La diferencia es de timing y actitud, no de gravedad.'],
  ], cta: ['Consulta la Muerte y las 78 cartas', 'El oráculo de tarot sí/no online responde preguntas cerradas al instante, gratis y en español. Para tener las 78 cartas con significados completos en el bolsillo, Tarot Rider Waite es pago único $9.99.', '/apps/unofficial-rider-waite-tarot.html', 'Ver la app $9.99'], tool: ['/tools/tarot-yes-no.html', 'Oráculo sí/no gratis'], app: ['/apps/unofficial-rider-waite-tarot.html', 'Tarot Rider Waite ($9.99, pago único)', 'las 78 cartas con significados completos, modo sí/no y tiradas guiadas, offline y sin anuncios'], rel: [['/blog/es-tarot-rider-waite-principiantes.html', 'Rider Waite para principiantes'], ['/blog/es-cruz-celta-10-posiciones.html', 'La Cruz Celta'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

  { slug: 'es-fases-de-la-luna-significado', en: 'moon-phases-meaning-8-phases-explained.html', title: 'Fases de la Luna: Significado de las 8 Fases para Práctica (2026)', desc: 'Las 8 fases de la luna y su significado para magia y rituales: luna nueva, creciente, llena, menguante y las 4 intermedias. Guía en español.', h1: 'Las 8 Fases de la Luna y su Significado', lede: 'La luna no emite energía mística verificable, pero sí estructura el tiempo de la práctica como un metrónomo: sembrar, construir, celebrar, soltar. Así se usan sus 8 fases, con honestidad y método.', hook: [
    'Cada 29,5 días, la luna completa su ciclo: oscura, creciente, llena, menguante, y otra vez oscura. Los practicantes de magia llevan siglos usando ese reloj celeste para estructurar su trabajo. Y aquí viene la parte que casi nadie dice en voz alta: no hay evidencia de que la luna cause nada. Lo que sí hay es algo igual de valioso: un calendario natural que convierte la disciplina en ritual.',
    'Porque el verdadero problema de la práctica espiritual no es la falta de poder: es la falta de constancia. Un ritual suelto en marzo no cambia nada. Un ciclo sostenido de intenciones, acciones, revisiones y cierres, mes tras mes, cambia la relación que tienes con tus propios objetivos.',
    'Esta guía te da las 8 fases con su significado práctico, una tabla de qué hacer en cada una, y la explicación honesta de por qué funciona como estructura y no como causalidad. Sin humo: método lunar.',
  ], secs: [
    ['El ciclo en 4 movimientos',
      'El ciclo lunar se entiende en 4 grandes movimientos. Luna nueva: sembrar. Intenciones, sigilos, planes que aún no existen. Luna creciente: construir. Acciones, práctica, impulso hacia lo sembrado. Luna llena: celebrar y ver. Picos, gratitud, evaluación honesta de resultados. Luna menguante: soltar. Limpiezas, cierres, descanso.',
      'Entre esos 4 polos hay 4 fases de transición (cuartos y gibosas) que sirven para ajustar el rumbo. El ciclo completo dura 29,5 días: un mes natural de trabajo espiritual con principio y final claros.',
      'Si el ciclo completo te abruma, trabaja solo los 4 movimientos. Los cuartos y las gibosas son refinamiento para practicantes avanzados, no requisitos de entrada.'],
    ['Las 8 fases, una por una',
      'Luna nueva: el disco es invisible, el cielo está oscuro. Es el momento de la semilla. Creciente iluminante: una fina hoz crece cada noche. Impulso inicial. Cuarto creciente: media luna. Decisiones y primeros obstáculos. Gibosa creciente: casi llena. Refinamiento del proyecto.',
      'Luna llena: disco completo. Culminación, carga máxima, celebración. Gibosa menguante: el disco empieza a decrecer. Gratitud y evaluación. Cuarto menguante: media luna decreciente. Destierro, orden, cierre. Luna vacía o negra: los últimos días antes de la nueva. Descanso profundo, silencio, preparación del siguiente ciclo.',
      'Aprende las 8 en orden una sola vez y ya las tendrás para siempre: son la misma historia contada dos veces, una subiendo y otra bajando.'],
    ['Qué hacer en cada fase: la tabla práctica',
      'Nueva: escribe tu intención y cárgala como sigilo. Creciente: avanza el proyecto con acciones concretas, es fase de trabajo visible. Cuarto creciente: revisa obstáculos y decide. Gibosa creciente: refina detalles, ensaya, prepara la culminación.',
      'Llena: celebra, carga amuletos, haz una lectura de tarot o runas de balance. Gibosa menguante: agradece y evalúa resultados con el diario. Cuarto menguante: destierro, ordenar, cerrar cuentas, limpiar el espacio. Luna vacía: no fuerces trabajo; descansa y deja que el ciclo se renueve.',
      'Imprime esta tabla o cópiala en tu diario. El valor del calendario lunar está en consultarlo, no en saberlo de memoria.'],
    ['Luna nueva y luna llena: los dos polos de trabajo',
      'Si solo vas a trabajar dos noches al mes, que sean estas. La luna nueva es la noche de la siembra: una intención escrita, un sigilo cargado, un compromiso de acción. Es íntima, silenciosa, hacia adentro.',
      'La luna llena es la noche de la culminación: revisar lo sembrado, celebrar lo logrado, cargar objetos, hacer lecturas de balance. Es social, luminosa, hacia afuera.',
      'Sembrar en nueva y evaluar en llena es el esqueleto mínimo de una práctica lunar completa. Todo lo demás es músculo que se añade con los meses.'],
    ['Por qué funciona como estructura (y no como causalidad)',
      'La honestidad del método: no hay evidencia científica de que la fase lunar cause efecto alguno sobre hechizos, emociones o resultados. Los estudios sobre "efecto luna llena" en comportamiento no se sostienen al revisarse.',
      'Lo que sí hace la luna es darte un calendario de intención que evita que tu práctica sea esporádica. Un ciclo de 29,5 días con cuatro ritmos claros convierte la disciplina en ritual: sembrar, construir, celebrar, soltar.',
      'La estructura hace el trabajo que la "energía" dice hacer. Y hay algo más: un calendario externo y compartido (millones de practicantes miran la misma luna) crea sensación de pertenencia y compromiso que ningún calendario personal consigue.'],
    ['Cómo integrar el ciclo lunar a tu calendario real',
      'No necesitas rituales elaborados: necesitas anclajes. Pon alertas en el móvil para luna nueva y llena. En la nueva, 20 minutos de ritual de siembra. En la llena, 15 minutos de revisión y gratitud. Los cuartos, si puedes, 5 minutos de ajuste.',
      'El registro es lo que convierte el calendario en método: anota fase, fecha, intención y resultado a 30 días. En 3 o 4 ciclos verás tus patrones reales, y tu práctica lunar dejará de ser creencia para convertirse en datos propios.',
      'La app Lunar Phase Calculator existe exactamente para esto: alertas automáticas de cada fase y notas de ritual por fecha. La estructura que no depende de tu memoria es la que sobrevive a los meses malos.'],
    ['Errores comunes con las fases lunares',
      'Error 1: creer que solo la luna llena "sirve". Cada fase tiene su trabajo; sembrar en luna nueva es tan válido como celebrar en llena. Error 2: obsesionarse con la noche exacta. Cada fase tiene un pico de unos 3 días: el rango vale.',
      'Error 3: trabajar contra el ciclo por ansiedad (destierros en creciente, siembras en menguante) de forma sistemática. La urgencia rompe calendario, la planeación lo respeta.',
      'Error 4: no registrar nada. Sin diario, el ciclo lunar es decoración. Con diario, es el sistema de práctica más barato y sostenible que existe: cuesta cero y dura toda la vida.'],
  ], faq: [
    ['¿Debo hacer rituales SOLO en luna llena?', 'No. El mito de la luna llena como única fase "fuerte" es popular pero limitante: cada fase tiene su trabajo. Sembrar en luna nueva es tan válido como celebrar en llena, y soltar en menguante es tan necesario como ambas.'],
    ['¿Cómo sé qué fase es hoy?', 'Con una calculadora de fases lunares: gratis online en Cha0smagick Labs, o con la app Lunar Phase Calculator (pago único $3.99) que añade calendario completo, alertas y notas de ritual.'],
    ['¿Qué es la luna negra o luna vacía?', 'Los últimos días del ciclo, cuando el disco aún no es visible pero la nueva no ha llegado. Es fase de descanso y silencio: no se siembra ni se celebra, se deja vaciar. Algunos practicantes la usan para trabajo introspectivo profundo.'],
    ['¿Las fases lunares afectan a todo el mundo igual?', 'No hay evidencia de efecto universal. Lo que sí varía es tu relación personal con el ciclo: algunos notan picos de energía en llena, otros duermen mal. Tu propio registro, mes a mes, vale más que cualquier generalidad.'],
    ['¿Puedo trabajar contra la fase actual?', 'Sí cuando hay urgencia real: un destierro necesario no espera 15 días. La regla práctica es honesta: la urgencia rompe el calendario, la planeación lo respeta. Lo que no funciona es trabajar sistemáticamente contra el ciclo por pura ansiedad.'],
    ['¿Cuánto dura exactamente el ciclo lunar?', '29,5 días de media (el ciclo sinódico), con variaciones. Cada fase dura unos 3,5 días y el plenilunio o novilunio exactos son un punto, no un día. Por eso las calculadoras lunares son más precisas que el ojo.'],
  ], cta: ['Calcula las fases gratis', 'La calculadora de fases lunares online es gratis, en español y sin registro. Para calendario completo con alertas y notas de ritual, la app Lunar Phase Calculator cuesta $3.99 de pago único.', '/apps/lunar-phase-calculator.html', 'Ver la app $3.99'], tool: ['/tools/moon-phase-calendar.html', 'Calendario lunar gratis'], app: ['/apps/lunar-phase-calculator.html', 'Lunar Phase Calculator ($3.99, pago único)', 'fase actual, calendario lunar completo, alertas de luna nueva y llena, y notas de ritual por fecha'], rel: [['/blog/es-ritual-luna-nueva.html', 'Ritual de luna nueva'], ['/blog/es-luna-para-hechizos.html', 'Luna para hechizos'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-ritual-luna-nueva', en: 'new-moon-ritual-manifestation.html', title: 'Ritual de Luna Nueva para Manifestar: Paso a Paso (2026)', desc: 'Ritual de luna nueva paso a paso: limpiar el espacio, escribir la intención, cargarla como sigilo y cerrar el ritual. Duración 20 minutos. En español.', h1: 'Ritual de Luna Nueva para Manifestar', lede: 'Un ritual de luna nueva bien hecho toma 20 minutos: limpiar, sembrar, cargar, cerrar. Esta es la versión completa, paso a paso, sin humo y en español.', hook: [
    'La luna nueva es la noche más oscura del mes, y precisamente por eso es la noche de las semillas. Nada brilla todavía: todo está por hacer. Los practicantes serios no la usan para pedir milagros, la usan para plantar intenciones con la misma seriedad con que un agricultor siembra: terreno preparado, una sola semilla, y luego trabajo de todos los días.',
    'El ritual que vas a leer abajo no requiere cristales caros, ni incienso importado, ni conocimientos previos. Requiere 20 minutos, un papel, un bolígrafo y honestidad sobre lo que de verdad quieres. Si tienes una vela, mejor: el marcador simbólico ayuda. Si no tienes nada de eso, también funciona.',
    'Lo que sí es innegociable es la estructura: limpiar el espacio, escribir UNA intención, cargarla como sigilo y cerrar con un compromiso de acción terrenal. Esa estructura es la diferencia entre un ritual y una lista de deseos.',
  ], secs: [
    ['Por qué la luna nueva es el momento de sembrar',
      'En el ciclo lunar, la fase nueva es la de menor luz: el disco es invisible. Simbólicamente es el punto de partida, el cero, la semilla bajo tierra. Todo lo que se siembra aquí tiene un ciclo completo por delante para crecer: la creciente para construir, la llena para culminar, la menguante para soltar lo que sobra.',
      'Por eso los rituales de luna nueva son de inicio: intenciones, sigilos, planes, renovaciones personales. No es la noche para culminar ni para desterrar: es la noche para decidir qué va a crecer en los próximos 29 días.',
      'Y hay una razón psicológica además de la simbólica: la oscuridad reduce estímulos. Un ritual en luna nueva compite con menos ruido mental que uno en llena, cuando la energía (y la agenda) están al máximo.'],
    ['Preparación (5 minutos): espacio y materiales',
      'Necesitas: un lugar tranquilo donde no te interrumpan, papel, bolígrafo y, si te gusta el marcador simbólico, una vela. Eso es todo. La luna nueva no pide aparato: pide atención.',
      'Antes de escribir, decide la intención con calma. Este es el paso que la mayoría se salta y el que decide todo: una intención vaga produce un ritual vacío. Tómate los 5 minutos de preparación para saber exactamente qué vas a sembrar.',
      'Pon el móvil en silencio y fuera de la habitación. Veinte minutos de atención intacta valen más que dos horas de ritual interrumpido.'],
    ['Paso 1: limpiar el espacio (2 minutos)',
      'La limpieza no es mística: es psicológica. Ordena la mesa, abre la ventana un momento, o haz un destierro breve si la semana fue pesada (una palmada fuerte en cada esquina, o simplemente sacudir un paño hacia la puerta).',
      'El objetivo es entrar en el ritual con un espacio que respire. Tu atención es el ingrediente real del ritual, y la limpieza es la forma más rápida de recuperarla.',
      'Si tu espacio vive en caos permanente, no esperes a tener la casa perfecta: limpia solo la mesa donde vas a trabajar. El ritual necesita un islote de orden, no un océano.'],
    ['Paso 2: escribir la intención (5 minutos)',
      'Escribe UNA intención, en presente, específica y verificable. "Tengo una entrevista de trabajo en marzo" funciona. "Quiero que me vaya bien" no: no hay nada que agarrar. Una sola intención por ritual: tres sigilos en una noche diluyen la atención hasta anularla.',
      'Si tienes dos áreas urgentes (trabajo y salud), siembra una este ciclo y otra en el siguiente. El ciclo lunar es mensual: tienes doce siembras al año. La paciencia es parte del método.',
      'Prueba del lápiz: una intención bien escrita se puede verificar con hechos. "Tengo una entrevista agendada" se verifica mirando el calendario. "Estoy en paz" no se verifica: es un estado, no una siembra.'],
    ['Paso 3: convertir la intención en sigilo y cargarla (5 minutos)',
      'El sigilo clásico: escribe la intención, quita las vocales, quita las letras repetidas, y dibuja un glifo uniendo las letras restantes. Ese glifo es tu sigilo: la intención comprimida en un símbolo que la mente consciente no puede "leer" y por tanto no puede sabotear.',
      'La carga: medita 10 respiraciones profundas mirando el glifo en silencio total, o usa ejercicio físico corto (sentadillas, respiración de fuego) hasta el pico de intensidad, y mira el sigilo en ese instante. Guarda el papel sin etiqueta: la creciente será tu recordatorio de acción, no de obsesión.',
      'El olvido deliberado es parte del método: un sigilo que revisas cada día se convierte en ansiedad con dibujo. Siembra, carga, guarda. La creciente hará el recordatorio por ti.'],
    ['Cierre y compromiso de acción (3 minutos)',
      'Apaga la vela con gratitud breve (un "gracias" basta) y escribe en tu calendario la acción terrenal correspondiente para los próximos 3 días: enviar el CV, agendar la llamada, apuntarse al gimnasio. La luna nueva abre la ventana; tu acción la usa.',
      'Anota en tu registro la fase, la fecha y la intención. La revisión llega en luna llena: qué creció, qué se estancó, qué necesita otra siembra. Sin ese cierre de ciclo, el ritual es solo teatro.',
      'El compromiso de acción es el paso con mejor retorno de toda la práctica: convierte una noche simbólica en un mes de trabajo real. Los rituales que funcionan son los que terminan en el calendario, no en el cajón.'],
    ['Errores que arruinan un ritual de luna nueva',
      'Error 1: sembrar cinco intenciones porque "todas importan". Ninguna crece. Error 2: intenciones en futuro ("tendré") en vez de presente ("tengo"): el presente compromete, el futuro pospone.',
      'Error 3: repetir el ritual cada dos días con la misma intención: la siembra es mensual, la acción es diaria. Error 4: no hacer nada después del ritual y esperar que el sigilo trabaje solo. El sigilo abre la puerta; caminar es cosa tuya.',
      'Y el error más silencioso: no registrar la siembra. Sin fecha ni intención anotadas, la revisión de luna llena es adivinanza. Con registro, es evaluación.'],
  ], faq: [
    ['¿Qué hora es mejor para el ritual de luna nueva?', 'La que puedas sostener con constancia: no hay hora "correcta". Muchos practicantes lo hacen al anochecer por la claridad del simbolismo, pero el criterio honesto es la regularidad mes a mes, no la precisión horaria.'],
    ['¿Puedo sembrar varias intenciones en una luna nueva?', 'Mejor una. Tres sigilos en un solo ritual suelen diluir la atención hasta anular el efecto. Si tienes dos áreas urgentes, siembra una este ciclo y otra en el siguiente: tienes doce siembras al año.'],
    ['¿Qué hago si me pierdo la luna nueva?', 'Nada dramático: la fase tiene un pico de unos 3 días, así que tienes margen. Si se pasó del todo, espera al cuarto creciente para acciones y siembra en el próximo ciclo. La ansiedad por "perder la luna" hace más daño que perderla.'],
    ['¿Necesito velas, incienso o cristales?', 'No. El ritual mínimo es papel, bolígrafo y atención. La vela ayuda como marcador simbólico de inicio y cierre, y el incienso puede ayudar a marcar el cambio de estado, pero son ayudas, no requisitos.'],
    ['¿Cuándo reviso los resultados de mi siembra?', 'En luna llena, dos semanas después: qué creció, qué se estancó. Y a los 30 días, en la siguiente luna nueva: resultado completo del ciclo. El registro escrito es lo que convierte la revisión en aprendizaje real.'],
    ['¿Puedo hacer el ritual de luna nueva para otra persona?', 'Puedes acompañar, pero la intención debe ser de quien la siembra. Un sigilo cargado con el deseo de otro rara vez tiene fuerza, porque la carga emocional no es tuya. Mejor: enséñale el método y siembra cada uno lo suyo.'],
  ], cta: ['Planifica tu siembra lunar', 'El planificador de intenciones lunares online te guía en la siembra, gratis y en español. Para calendario con alertas de cada fase, la app Lunar Phase Calculator es pago único $3.99.', '/apps/lunar-phase-calculator.html', 'Ver la app $3.99'], tool: ['/tools/moon-intention-planner.html', 'Planificador lunar gratis'], app: ['/apps/lunar-phase-calculator.html', 'Lunar Phase Calculator ($3.99, pago único)', 'alertas de luna nueva y llena, calendario 2026 completo y notas de ritual para registrar cada siembra'], rel: [['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna'], ['/blog/es-luna-para-hechizos.html', 'Luna para hechizos'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-luna-para-hechizos', en: 'moon-phase-calculator-for-spells.html', title: 'Calendario Lunar para Hechizos: Cast Each Spell on the Right Night', desc: 'Qué hechizo hacer según la fase lunar: sembrar en nueva, construir en creciente, culminar en llena, soltar en menguante. Calendario práctico en español.', h1: 'Calendario Lunar para Hechizos', lede: 'El calendario lunar es la agenda de la práctica: qué noche conviene qué trabajo. Esta guía te da el mapa fase por fase para que cada hechizo tenga su momento.', hook: [
    'Pregúntale a cualquier practicante veterano cuál es su secreto y te dirá lo mismo con distintas palabras: el timing. No el ingrediente exótico, no la vela cara, no la palabra en latín. El timing. Un hechizo de siembra en luna nueva, un trabajo de construcción en creciente, una culminación en llena, un destierro en menguante. El mismo trabajo en la noche equivocada rinde la mitad.',
    'El calendario lunar no es una superstición añadida: es la estructura que evita que tu práctica sea un cajón de sastre. Cada fase tiene un carácter, y alinear el trabajo con ese carácter es la diferencia entre rituales que se sienten completos y rituales que se sienten forzados.',
    'Aquí tienes el mapa completo: qué hechizo hacer en cada fase, la regla de los 3 días de gracia que te quita la ansiedad del reloj, y el sistema de registro que convierte el calendario en método medible.',
  ], secs: [
    ['El mapa completo por fase',
      'Luna nueva: sigilos de inicio, plantar intenciones, rituales de renovación personal, arranques de proyecto. Creciente: hechizos de construcción, atraer clientes, fuerza física, estudio sostenido, crecimiento de cualquier tipo. Llena: culminación, carga máxima de amuletos, lecturas de balance, celebración.',
      'Menguante: destierros, cortar hábitos, limpiezas de espacio, cierres de ciclos, cortar lazos. Gibosas: ajuste y refinamiento, la creciente para pulir lo que crece, la menguante para soltar detalles que estorban. Luna vacía: descanso, silencio, no forzar trabajo.',
      'Guarda este mapa como referencia rápida. El 90% de las dudas de timing se resuelven con una pregunta: ¿esto inicia, construye, culmina o suelta?'],
    ['Luna nueva: la noche de la siembra',
      'Todo hechizo que inicia algo pertenece aquí: sigilos de intención, rituales de arranque, primeras piedras. La energía simbólica de la fase es el punto cero: el disco invisible, la semilla bajo tierra.',
      'El ritual clásico de luna nueva es el de siembra de intención: una intención escrita, convertida en sigilo y cargada. Si tu práctica mensual solo tiene una noche, que sea esta: sin siembra no hay ciclo.',
      'Y una regla de honestidad: si llegas a la luna nueva sin saber qué sembrar, no improvises. Mejor una siembra bien pensada dos días después (dentro del rango de la fase) que una intención inventada por ansiedad.'],
    ['Creciente: la fase de construcción',
      'Del primer cuarto a la gibosa, la luna crece cada noche y el trabajo crece con ella. Es la fase de los hechizos de atracción y desarrollo: prosperidad, clientes, fuerza, estudio, amor que ya existe y quiere crecer.',
      'Ojo con el matiz: creciente es para construir lo que ya se sembró, no para sembrar de nuevo. Si en creciente te das cuenta de que nunca sembraste en la nueva, no improvises una siembra tardía: anótalo y siembra bien el próximo ciclo.',
      'El trabajo de creciente es el más terrenal de todos: llamadas, propuestas, entrenamiento, estudio. Los hechizos de esta fase funcionan mejor cuando acompañan acciones visibles, no cuando las sustituyen.'],
    ['Llena: culminación y carga máxima',
      'La luna llena es el pico del ciclo: el momento de culminar, celebrar y cargar. Carga de amuletos y herramientas (déjalos toda la noche a la vista del cielo, si el clima lo permite), lecturas de tarot o runas de balance, y rituales de gratitud.',
      'Es también la mejor noche para ver resultados: lo sembrado en la nueva ya muestra su forma. La llena no es para empezar nada: es para reconocer lo que ya está en marcha.',
      'Y una advertencia práctica: la llena activa agendas y emociones. Si tu llena siempre acaba siendo caótica, reduce el ritual al mínimo: una vela, cinco minutos de gratitud, y a dormir. La constancia vence al espectáculo.'],
    ['Menguante: destierro y limpieza',
      'Cuando el disco decrece, el trabajo decrece con él: es la fase de quitar. Destierros de hábitos e influencias, limpiezas de espacio (físicas y rituales), cortes de lazos, cierres de cuentas y de ciclos.',
      'El destierro clásico de menguante es simple y efectivo: escribe en papel lo que quieres soltar, quémalo o rómpelo, y barre los restos hacia fuera de casa. Hecho en menguante, con intención y registro, es de los rituales con mejor relación esfuerzo-resultado.',
      'La menguante es también la fase de mantenimiento que nadie celebra: ordenar el altar, limpiar herramientas, revisar el diario. Lo que cuidas en menguante, lo recibes listo en la nueva.'],
    ['La regla de los 3 días de gracia',
      'Cada fase tiene un pico de unos 3 días: la noche exacta y las dos vecinas. No necesitas la noche exacta: el rango de la fase vale. Esto evita la frustración de "se me pasó la luna" y hace el calendario realista para gente con trabajo, familia y vida.',
      'La excepción honesta: la urgencia rompe calendario. Un destierro necesario no espera 15 días a que llegue la menguante. La regla práctica: la planeación respeta el ciclo, la urgencia lo usa como referencia y actúa.',
      'Esta regla es la que convierte el calendario lunar en un sistema sostenible. Los calendarios que exigen precisión perfecta se abandonan al segundo mes; los que dan margen, duran años.'],
    ['Registro: el truco que convierte el calendario en método',
      'Anota cada ritual: fase, fecha, intención, técnica y resultado a 30 días. En 3 o 4 ciclos verás tus patrones reales: qué fase te funciona mejor, qué tipo de intención te cuesta, qué técnicas te dan resultados consistentes.',
      'Sin registro, el calendario lunar es decoración; con registro, es método. Y hay un beneficio secundario que nadie menciona: el registro te obliga a definir "resultado" antes de tirar, y esa definición mejora la calidad de cada hechizo desde el diseño.',
      'El registro también protege contra el sesgo de memoria: sin él, recordarás los aciertos y olvidarás los fallos, y tu práctica se volverá una colección de anécdotas en vez de un cuerpo de experiencia.'],
  ], faq: [
    ['¿Puedo hacer un hechizo de "soltar" en luna creciente?', 'Sí: el calendario es estructura, no cárcel. Lo óptimo es respetar el ritmo, pero un destierro urgente no espera 15 días. La regla práctica: la urgencia rompe calendario, la planeación lo respeta.'],
    ['¿La luna llena "carga más" un amuleto?', 'No hay evidencia de energía lunar medible. Lo que sí hay: el pico emocional de la luna llena concentra tu atención, y la atención es el ingrediente real de la carga. Úsalo como estructura, no como física.'],
    ['¿Qué hago en luna vacía (luna negra)?', 'Descansar. Es el final del ciclo, antes de la nueva: no se siembra ni se celebra. Algunos practicantes la usan para introspección profunda o simplemente para no hacer nada. El vacío también es parte del ciclo.'],
    ['¿Los hechizos de amor van mejor en luna creciente?', 'Los de crecimiento de una relación existente, sí: creciente es construcción. Para iniciar algo nuevo, luna nueva. Para cerrar un vínculo que ya murió, menguante. El tipo de trabajo amoroso decide la fase, no al revés.'],
    ['¿Cómo planifico un mes completo de trabajo lunar?', 'Con tres anclajes: siembra en nueva (20 minutos), construcción semanal en creciente (acciones concretas), revisión y carga en llena (15 minutos), y limpieza en menguante si toca. Con alertas en el móvil y un registro simple, el ciclo se sostiene solo.'],
    ['¿Importa el signo zodiacal de la luna?', 'Es un refinamiento, no un requisito. La fase (nueva, creciente, llena, menguante) es la estructura principal; el signo añade matiz para practicantes avanzados. Si estás empezando, domina las fases primero: el 90% del valor está ahí.'],
  ], cta: ['Tu calendario ritual de bolsillo', 'Consulta la fase lunar actual online, gratis y en español. Para alertas de cada fase y notas por ritual, la app Lunar Phase Calculator es pago único $3.99 en Google Play.', '/apps/lunar-phase-calculator.html', 'Ver la app'], tool: ['/tools/lunar-phase.html', 'Fase lunar ahora gratis'], app: ['/apps/lunar-phase-calculator.html', 'Lunar Phase Calculator ($3.99, pago único)', 'fases, alertas de cada fase lunar y notas de ritual por fecha para planificar tu mes completo de trabajo'], rel: [['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna'], ['/blog/es-ritual-luna-nueva.html', 'Ritual de luna nueva'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-iching-online-gratis', en: 'free-i-ching-online-guide.html', title: 'I Ching Online Gratis: Lanza el Libro de los Cambios (2026)', desc: 'Consulta el I Ching online gratis en español: método de 3 monedas, hexagramas con significado y cómo formular la pregunta correcta.', h1: 'I Ching Online Gratis', lede: 'El I Ching (Libro de los Cambios) tiene 3.000 años de uso como herramienta de decisión. Aquí lo lanzas gratis online y aprendes a leer el hexagrama sin morir en el intento.', hook: [
    'Tres mil años de consultas no se sostienen con moda. El I Ching, el Libro de los Cambios, es probablemente el oráculo más antiguo que sigue en uso: lo consultaron estrategas de la China Zhou, lo tradujo al alemán Richard Wilhelm, y lo usaron desde Carl Jung hasta generaciones de emprendedores y escritores. Su pregunta de fondo no es "¿qué va a pasar?" sino "¿cómo se mueve esta situación y qué posición debo tomar?".',
    'Si llegaste buscando lanzar el I Ching online gratis, estás en el sitio correcto: aquí tienes el oráculo completo en español, sin registro. Y si es tu primera consulta, esta guía te evita el error clásico: lanzar las monedas, leer un hexagrama con nombre impenetrable y abandonar.',
    'El método es simple: 3 monedas, 6 lanzamientos, un hexagrama. La lectura tiene un orden claro: imagen, juicio, líneas móviles. En 15 minutos tienes una consulta seria. Vamos por partes.',
  ], secs: [
    ['Qué es el I Ching y por qué sigue vivo',
      'El I Ching es un sistema de 64 hexagramas: figuras de 6 líneas (yang sólidas y yin rotas) que describen otros tantos arquetipos de situación. "El Retorno": la luz vuelve tras la oscuridad. "La Espera": el momento pide paciencia nutrida. "El Poder de lo Pequeño": la influencia sutil vence a la fuerza bruta.',
      'Su vigencia tiene una razón simple: no predice hechos, describe dinámicas. Y las dinámicas humanas (el estancamiento, la transición, el exceso de confianza) no han cambiado en 3.000 años. Es un mapa de situaciones, no una bola de cristal.',
      'Por eso lo usan perfiles tan distintos: el general que necesita saber si esperar o atacar, el escritor bloqueado, el directivo ante una decisión ambigua. El oráculo no sabe de tu oficio: sabe de dinámicas.'],
    ['Cómo lanzar: el método de 3 monedas',
      'Lanza 3 monedas 6 veces. Cada moneda vale: cara = 3 puntos, cruz = 2 puntos. Suma las tres: 6, 7, 8 o 9. Con cada suma dibujas una línea: 7 = yang joven (línea sólida), 8 = yin joven (línea rota), 6 y 9 = líneas móviles (yin y yang antiguos, que cambian).',
      'El primer lanzamiento es la línea inferior; el sexto, la superior. Apila las 6 líneas de abajo hacia arriba y tienes tu hexagrama. El oráculo online hace todo este proceso por ti, pero conviene conocerlo: entender el método es entender la lectura.',
      'Si prefieres ver el detalle completo del método (probabilidades, combinaciones, construcción línea a línea), tenemos una guía dedicada al método de monedas enlazada al final de este artículo.'],
    ['La pregunta que hace legible la respuesta',
      'El I Ching responde mejor a preguntas de proceso que a preguntas de oráculo. "¿Cómo debo manejar esta negociación?" produce lecturas accionables. "¿Me contratarán?" produce lecturas vagas, porque le pide al oráculo un dato que no le corresponde dar.',
      'Formula la situación, no el desenlace. Y una consulta por tema: repetir la misma pregunta es ruido, no profundidad. Si la respuesta no se entiende, el problema casi siempre está en la pregunta, no en el hexagrama.',
      'Truco de formulación: empieza la pregunta con "¿cómo...?" o "¿qué necesito...?". Esas dos estructuras producen las consultas más útiles en la práctica.'],
    ['Leer el hexagrama sin agobio',
      'Cada hexagrama tiene tres capas de texto. El nombre y la imagen: la metáfora central ("24, El Retorno: la luz vuelve tras la oscuridad"). El juicio: la actitud que la situación pide. Y las líneas: el detalle posición por posición.',
      'Orden de lectura recomendado: primero la imagen general, luego el juicio, y si hay líneas móviles, esas son TU texto personal: la parte de la consulta que habla específicamente de tu momento. Con esas tres capas, una consulta es completa.',
      'No intentes leer los 64 hexagramas como lista de estudio. Aprende los que te van saliendo: en seis meses de consultas reales habrás dominado los 15 o 20 que de verdad te visitan.'],
    ['Líneas móviles: el texto personal de tu consulta',
      'Cuando una línea sale 6 o 9, es móvil: está en transición activa. Marca el hexagrama mutante: el segundo hexagrama hacia el que evoluciona tu situación. Las líneas móviles son el texto más específico de la consulta y se leen primero si existen.',
      'De 0 a 3 líneas móviles es lo habitual. Muchas líneas móviles suelen indicar una situación en pleno caos: algunos practicantes reformulan la pregunta y lanzan de nuevo días después. No es superstición: es sentido común.',
      'Si quieres profundizar en cómo se calculan y leen las líneas móviles, la calculadora de líneas móviles del sitio hace el trabajo por ti y está enlazada al final.'],
    ['Errores comunes al consultar el I Ching',
      'Error 1: preguntar sí/no. El I Ching es un oráculo de proceso; para decisiones cerradas, mejor una tirada de runas o tarot sí/no. Error 2: lanzar en estado de ansiedad pura: el oráculo necesita pregunta, no grito.',
      'Error 3: leer solo el nombre del hexagrama y quedarse en la metáfora. El juicio y las líneas son donde está la acción. Error 4: consultar diez veces al día. Una consulta seria por tema y por día: la repetición es ansiedad, no profundidad.',
      'Y el error más caro: no anotar la consulta. El I Ching habla en metáforas que a veces se entienden a posteriori. Sin registro, esas revelaciones se pierden; con registro, la consulta de hoy explica la de hace tres meses.'],
    ['Cuándo la app vale la pena',
      'La web gratuita cubre consultas puntuales perfectamente. La app suma cuando la práctica se vuelve diaria: historial de consultas con fechas, textos completos de los 64 hexagramas offline, seguimiento de hexagramas mutantes y registro de líneas móviles.',
      'I Ching Oracle cuesta $3.99 de pago único: sin suscripción, sin anuncios. Si consultas más de una vez por semana, se paga sola en el primer mes.',
      'Si consultas una vez al mes, la web es suficiente y honesta. La herramienta correcta es la que sigue tu ritmo, no la que te obliga a cambiarlo.'],
  ], faq: [
    ['¿Es válido lanzar el I Ching digitalmente?', 'Sí: el azar de un generador es tan genuino como el de las monedas. La tradición china original usaba tallos de milenrama, un método mucho más lento; las monedas llegaron después. El método ha cambiado siempre: la estructura de 6 líneas es lo constante.'],
    ['¿Qué es una línea móvil?', 'Una línea (6 o 9 en la suma de las monedas) marcada para cambiar: representa la parte de tu situación que está en movimiento activo. Las líneas móviles son el texto más específico de la consulta y definen el hexagrama mutante, la tendencia de evolución.'],
    ['¿Puedo hacer varias consultas al día?', 'Una seria por tema. Repetir la misma pregunta el mismo día es ruido: solo mide tu ansiedad. Si la respuesta no se entiende, reformula la pregunta y espera al día siguiente. El I Ching premia la pausa, no la insistencia.'],
    ['¿Qué traducción usar en español?', 'La referencia clásica es la versión de Richard Wilhelm (traducida al español por Vicente Simó, editorial Trotta): es la más completa y comentada. Para empezar, cualquier versión seria con los 64 hexagramas completos sirve; la profundidad llega con Wilhelm.'],
    ['¿El I Ching predice el futuro?', 'No en el sentido literal: describe la dinámica actual de una situación y su tendencia de evolución. Su valor está en la posición que recomienda tomar, no en el pronóstico. Es un consejero de estrategia con 3.000 años de antigüedad.'],
    ['¿Qué significa el hexagrama mutante?', 'Es el segundo hexagrama que resulta de cambiar las líneas móviles: representa hacia dónde evoluciona tu situación si la dinámica actual continúa. Hexagrama 1: dónde estás. Hexagrama 2: hacia dónde vas. Las líneas móviles: el cómo.'],
  ], cta: ['Lanza tu hexagrama gratis', 'El oráculo de I Ching online es gratis, en español y sin registro: 6 lanzamientos, hexagrama completo con imagen y juicio. Para práctica diaria con historial, la app I Ching Oracle es pago único $3.99.', '/apps/iching-oracle.html', 'Ver la app $3.99'], tool: ['/tools/iching.html', 'Oráculo I Ching gratis'], app: ['/apps/iching-oracle.html', 'I Ching Oracle ($3.99, pago único)', 'los 64 hexagramas con textos completos en español, historial de consultas y modo offline'], rel: [['/blog/es-iching-metodo-monedas.html', 'Método de monedas'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot'], ['/blog/es-iching-principiantes.html', 'I Ching para principiantes']] },

  { slug: 'es-iching-metodo-monedas', en: 'how-to-cast-iching-digitally.html', title: 'Cómo Lanzar el I Ching Digitalmente: Método de Monedas Explicado', desc: 'El método de 3 monedas del I Ching explicado en español: valores, las 4 combinaciones, líneas móviles y construcción del hexagrama paso a paso.', h1: 'Método de Monedas del I Ching, Paso a Paso', lede: 'Tres monedas, seis lanzamientos, un hexagrama. El método de monedas es la versión accesible del I Ching tradicional, y digital funciona exactamente igual. Aquí está el método completo, paso a paso.', hook: [
    'Antes de las monedas, el I Ching se lanzaba con tallos de milenrama: un ritual de manipulación y conteo que podía tomar media hora por consulta. Las monedas llegaron como simplificación y se quedaron: tres monedas, seis lanzamientos, un hexagrama en cinco minutos. La tradición no perdió lo esencial: la estructura de 6 líneas y su lógica de cambio siguen intactas.',
    'Este es el método que necesitas dominar para consultar el I Ching con seriedad, sea con monedas físicas, con la app o con el oráculo online. No es complicado, pero tiene detalles que casi todos los tutoriales se saltan: las probabilidades reales de cada línea, el orden de construcción y la lectura de los dos hexagramas.',
    'Al final de esta guía vas a poder lanzar, construir y leer un hexagrama completo sin mirar ningún manual. Y vas a entender por qué las líneas móviles son la parte más valiosa de toda consulta.',
  ], secs: [
    ['De las milenramas a las monedas: por qué este método ganó',
      'El método clásico de tallos de milenrama (shi) es un ritual de 18 manipulaciones con una distribución ligeramente distinta (favorece levemente las líneas yin). Las monedas simplificaron el ritual con una distribución simétrica: líneas estables 4 veces más probables que las móviles.',
      'Por eso ganaron: rapidez y equilibrio. Y por eso el método digital es igual de válido: un generador aleatorio reproduce exactamente la misma distribución que las monedas. Lo que importa no es el objeto, es la estructura de probabilidades.',
      'Los puristas defienden los tallos por el ritual, y tienen razón en algo: la lentitud obliga a la concentración. Si ese es tu caso, úsalos. Pero no confundas lentitud con precisión: la matemática de las monedas es impecable.'],
    ['Los valores: cara y cruz',
      'Cara (el lado con escudo o inscripción) = 3 puntos. Cruz (el lado con figura) = 2 puntos. Cada lanzamiento de 3 monedas suma entre 6 y 9: 6 = yin antiguo (línea rota móvil), 7 = yang joven (línea sólida), 8 = yin joven (línea rota), 9 = yang antiguo (línea sólida móvil).',
      'Truco de memoria: los números impares (7, 9) son yang, sólidos; los pares (6, 8) son yin, rotos. Y los "antiguos" (6, 9) son los móviles: la línea está en transición. Con esa regla, la tabla completa se deduce sola.',
      'Define desde el principio qué lado de TUS monedas es cara y apúntalo. El error más común del principiante no es el método: es cambiar de criterio entre consultas.'],
    ['Las 4 combinaciones y sus probabilidades',
      'Con 3 monedas hay 4 resultados posibles. Tres cruces (2+2+2=6): yin antiguo, móvil, probabilidad 1/8. Dos caras y una cruz (3+3+2=8): yin joven, probabilidad 3/8. Una cara y dos cruces (3+2+2=7): yang joven, probabilidad 3/8. Tres caras (3+3+3=9): yang antiguo, móvil, probabilidad 1/8.',
      'Fíjate en la asimetría: las líneas estables son 4 veces más probables que las móviles. El oráculo no vive en cambio permanente: la mayoría de las líneas describen estructura, y las pocas móviles marcan exactamente dónde está el movimiento.',
      'Esta asimetría es una característica, no un defecto: un hexagrama con todas las líneas móviles sería ilegible. El método está diseñado para señalar el cambio, no para bañarlo todo en transición.'],
    ['Construir el hexagrama de abajo hacia arriba',
      'El primer lanzamiento es la línea inferior; el sexto, la superior. Siempre. Apila: línea sólida para 7 y 9, línea rota para 6 y 8. Anota cada lanzamiento antes del siguiente: un error de apunte arruina la consulta entera.',
      'El orden de abajo hacia arriba no es capricho: refleja cómo crece la situación, de la base (lo establecido) a la cima (lo que emerge). Al terminar tienes tu hexagrama: la fotografía de la situación actual.',
      'Truco de apunte: dibuja las 6 líneas en una columna y escribe al lado el número de cada suma (6, 7, 8 o 9). Con ese registro, reconstruir el hexagrama y sus líneas móviles es trivial.'],
    ['Cómo leer los dos hexagramas',
      'Si hubo líneas móviles (6s o 9s), cámbialas: las sólidas se vuelven rotas y viceversa. El resultado es el hexagrama mutante: la tendencia hacia la que evoluciona tu situación. Hexagrama 1: quién eres en esta situación. Hexagrama 2: hacia dónde va.',
      'Las líneas móviles, si hay, son las instrucciones específicas: léelas primero. Sin líneas móviles, la consulta es un retrato estable: lee solo el nombre, la imagen y el juicio del hexagrama. No inventes movimiento donde no lo hay.',
      'La lectura de los dos hexagramas es una conversación: el primero describe el terreno, el segundo la dirección. Entre ambos, y con las líneas móviles como guía, la consulta deja de ser una metáfora y se vuelve un mapa.'],
    ['Trucos de registro y práctica',
      'Lleva un registro de consultas: fecha, pregunta, hexagrama inicial, líneas móviles, hexagrama mutante y revisión a 30 días. En dos meses tendrás tu propio mapa: qué hexagramas te visitan en cada tipo de situación y qué tan precisas fueron las tendencias.',
      'Segundo truco: lanza siempre con la pregunta escrita. La diferencia entre una consulta seria y un juego de monedas está en ese papel. Y tercero: una consulta por tema. La repetición no profundiza, ensucia.',
      'El registro tiene un efecto secundario valioso: al releer consultas antiguas, aprendes el "idioma" personal de tu oráculo. Cada practicante desarrolla una relación distinta con los mismos 64 hexagramas, y esa relación solo se descubre con historial.'],
    ['Errores frecuentes con las monedas',
      'Error 1: confundir cara y cruz entre sesiones. Define desde el principio qué lado vale 3 y apúntalo. Error 2: construir el hexagrama de arriba hacia abajo: el resultado es otro hexagrama, y la lectura entera se invalida.',
      'Error 3: ignorar las líneas móviles porque "complican". Son la parte más específica del oráculo. Error 4: lanzar con monedas distintas cada vez. Da igual cuáles uses, pero usa las mismas: el ritual consistente entrena la atención.',
      'Y el error 5, el más moderno: lanzar diez veces al día desde el móvil por aburrimiento. El I Ching no es una app de entretenimiento: es una herramienta de decisión. Una consulta pensada vale por veinte lanzamientos nerviosos.'],
  ], faq: [
    ['¿Cuántas líneas móviles es normal tener?', 'De 0 a 3 es lo habitual: cada línea tiene 1/8 de probabilidad de ser móvil. Muchas líneas móviles suelen indicar una situación en pleno caos: algunos practicantes reformulan la pregunta y lanzan de nuevo días después.'],
    ['¿Importa qué monedas uso?', 'No. Tres monedas iguales (de verdad o de app), lanzadas con pregunta clara. Lo que importa es la consistencia del método y el registro de la consulta, no el metal de las monedas.'],
    ['¿Puedo lanzar con la app en vez de monedas físicas?', 'Sí: un generador aleatorio reproduce exactamente la misma distribución de probabilidades que las monedas. La tradición original usaba tallos de milenrama: el soporte siempre ha cambiado. La estructura de 6 líneas es lo constante.'],
    ['¿Qué hago si me equivoco al apuntar una línea?', 'Si lo detectas antes de terminar, reinicia la consulta completa: un hexagrama con una línea corregida a mano ya no es una consulta limpia. Si lo detectas después, anótalo en el registro y vuelve a lanzar otro día con la misma pregunta.'],
    ['¿Por qué mi hexagrama no cambia nunca?', 'Porque las líneas estables son 4 veces más probables que las móviles. Un hexagrama sin líneas móviles es un retrato estable de la situación: no es un fallo del método, es información. Si la situación no se mueve, el oráculo no la mueve.'],
    ['¿Cuál es la diferencia entre línea 6 y línea 9?', 'La 6 es yin antiguo: línea rota en transición, cediendo. La 9 es yang antiguo: línea sólida en transición, agotándose. Ambas son móviles y definen el hexagrama mutante, pero su texto específico en el I Ching es distinto: léelas por separado.'],
  ], cta: ['Lanza sin contar monedas', 'El oráculo de I Ching online hace el método de monedas por ti: 6 lanzamientos, hexagrama completo en español. Para práctica diaria con historial y textos offline, I Ching Oracle es pago único $3.99.', '/apps/iching-oracle.html', 'Ver la app'], tool: ['/tools/iching-changing-lines.html', 'Calculadora de líneas móviles gratis'], app: ['/apps/iching-oracle.html', 'I Ching Oracle ($3.99, pago único)', 'el método de monedas automatizado, los 64 hexagramas con textos completos e historial de consultas'], rel: [['/blog/es-iching-online-gratis.html', 'I Ching online gratis'], ['/blog/es-iching-principiantes.html', 'I Ching para principiantes'], ['/blog/es-iching-vs-tarot.html', 'I Ching vs Tarot']] },

];

let ok = 0, fail = 0;
for (const p of POSTS) {
  try { fs.writeFileSync(path.join(R, 'blog', p.slug + '.html'), page(p)); ok++; }
  catch (e) { console.log('FAIL ' + p.slug + ': ' + e.message); fail++; }
}
console.log(`DEEP2: ok=${ok} fail=${fail} total=${POSTS.length}`);

// Verificación: palabras visibles (sin script/style) + strings requeridos
const REQ = ['hreflang="en"', 'FAQPage', 'pay.hotmart.com/D93257466P', 'sistema #1 de magia del caos'];
let totalWords = 0, allOk = true;
console.log('');
console.log('ARCHIVO'.padEnd(40) + 'PALABRAS'.padStart(9) + '  ESTADO');
for (const p of POSTS) {
  const f = path.join(R, 'blog', p.slug + '.html');
  let html = '';
  try { html = fs.readFileSync(f, 'utf8'); }
  catch { allOk = false; console.log(p.slug.padEnd(40) + 'MISSING'.padStart(9) + '  FAIL'); continue; }
  const visible = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
  const words = visible.split(/\s+/).filter(Boolean).length;
  totalWords += words;
  const missing = REQ.filter(s => !html.includes(s));
  const pass = words >= 1200 && missing.length === 0;
  if (!pass) allOk = false;
  console.log(p.slug.padEnd(40) + String(words).padStart(9) + '  ' + (pass ? 'OK' : 'FAIL' + (missing.length ? ' missing: ' + missing.join(' | ') : '')));
}
console.log('');
console.log('TOTAL palabras visibles: ' + totalWords + ' | ' + (allOk ? 'ALL OK' : 'HAY FALLOS: revisar arriba'));
