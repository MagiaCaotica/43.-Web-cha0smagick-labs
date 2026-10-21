// Generador de posts ES lote 1 (10 posts). Uso: node scripts/gen-es-batch1.mjs
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
  { slug: 'es-como-hacer-un-sigilo-paso-a-paso', en: 'free-sigil-generator-online-guide.html', title: 'Cómo Hacer un Sigilo Paso a Paso: Guía Completa (2026)', desc: 'Aprende a crear un sigilo de magia del caos en 5 pasos: intención, reducción, carga y olvido. Gratis, con generador de sigilos online sin registro.', h1: 'Cómo Hacer un Sigilo Paso a Paso', lede: 'El sigilo es la técnica más probada de la magia del caos: convierte un deseo en un símbolo, lo carga en un estado de gnosis y lo olvida. Aquí tienes el método completo en español.', secs: [
    ['Paso 1: Escribe la intención en presente y afirmativo', 'Formula tu deseo como si ya ocurriera: "tengo trabajo estable", no "quiero que me den el trabajo". Evita negaciones — el inconsciente procesa imágenes, no "no". Una sola frase, concreta y medible.'],
    ['Paso 2: Reduce las letras a un símbolo', 'Elimina las vocales y las letras repetidas de tu frase. Con lo que queda (p. ej. T R B J S), dibuja un glifo: superpongas, rota y fusiona las letras hasta que deje de parecer escritura y se vuelva una forma. No busques que sea bonito: busca que sea tuyo y reconocible al instante.'],
    ['Paso 3: Cárgalo en un estado de gnosis', 'El sigilo debe grabarse cuando la mente consciente esté en silencio: orgasmo, ejercicio intenso, meditación profunda, risa extática o duelo. Mira el glifo en ese pico, luego rompe la atención. Puedes dibujarlo a mano o generarlo digital.'],
    ['Paso 4: Olvida y deja trabajar', 'El olvido no es opcional: es la mecánica. Si recuerdas el deseo, la mente genera expectativa y bloquea el resultado. Guarda el sigilo sin etiqueta, cárgalo una vez y no lo revisites durante semanas.'],
  ], faq: [
    ['¿Necesito pagar por crear un sigilo?', 'No. El sigilo es una técnica, no un producto. Puedes dibujarlo en papel o usar el generador de sigilos gratuito de Cha0smagick Labs, sin registro y sin suscripción. Las apps de pago solo añaden registro de cargas y seguimiento.'],
    ['¿Cuánto tarda un sigilo en funcionar?', 'No hay garantía ni plazo fijo. Los practicantes reportan resultados en días o semanas, y la honestidad manda: la magia del caos trata el sigilo como un experimento medible, no como una promesa.'],
  ], cta: ['Genera tu sigilo ahora', 'Generador de sigilos online gratis, sin registro. Si quieres historial y seguimiento de cargas, la app Chaos Sigil Generator en Google Play cuesta un solo pago de $3.99, sin suscripción.', '/apps/chaos-sigil-generator.html', 'App Chaos Sigil Generator $3.99'], rel: [['/blog/es-como-cargar-un-sigilo.html', 'Cómo cargar un sigilo'], ['/blog/es-sigilo-de-dinero-paso-a-paso.html', 'Sigilo de dinero'], ['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?']] },

  { slug: 'es-como-cargar-un-sigilo', en: 'how-to-charge-sigil-correctly.html', title: 'Cómo Cargar un Sigilo Correctamente: 7 Métodos Probados', desc: 'Siete formas de cargar un sigilo en estado de gnosis: orgasmo, ejercicio, meditación, sueño, dolor, risa y tensión muscular. Guía práctica en español.', h1: 'Cómo Cargar un Sigilo Correctamente: 7 Métodos', lede: 'Cargar un sigilo es mostrarlo a tu mente cuando la mente "de abajo" está despierta y la consciente, dormida. Estos son los siete métodos clásicos y cuándo usar cada uno.', secs: [
    ['Los tres métodos de alta intensidad', 'Orgasmo: el clásico de Austin Osman Spare. Tensa todo el cuerpo, mira el glifo y libera al clímax. Ejercicio intenso: series al fallo, sprint o danza extenuante — fija el sigilo en el segundo de agotamiento total. Dolor controlado: no recomendado para principiantes, pero históricamente documentado.'],
    ['Los cuatro métodos silenciosos', 'Meditación profunda: cuenta respiraciones hasta que el pensamiento se detenga, abre los ojos y mira el sigilo 10 segundos. Frontera del sueño: despiértate a las 4 a.m., mira el glifo y vuelve a dormir. Risas extáticas: ver videos absurdos hasta el desbordamiento. Tensión sostenida: aguanta la respiración con músculos contraídos hasta el punto límite y mira el símbolo.'],
    ['Después de la carga', 'Rompe la atención de golpe, destruye o esconde el papel, y no hables del deseo con nadie. Anota la fecha en un registro privado para verificar resultados con honestidad — eso es lo que convierte la práctica en experimento.'],
  ], faq: [
    ['¿Se puede recargar un sigilo?', 'No se recomienda. La recarga reactiva el deseo consciente y anula el olvido. La práctica estándar es: un sigilo, una carga, un olvido. Si quieres reforzar, crea un sigilo nuevo para el mismo objetivo semanas después.'],
    ['¿Cuál es el mejor método para empezar?', 'Ejercicio intenso. Es seguro, no requiere experiencia en meditación y produce gnosis de forma confiable. El orgasmo funciona igual de bien pero exige mayor disciplina de enfoque.'],
  ], cta: ['Registra tus cargas y resultados', 'La app Chaos Sigil Generator guarda tus sigilos, fechas de carga y estado del objetivo, para que verifiques resultados como un experimento científico. Un solo pago, sin suscripción.', '/apps/chaos-sigil-generator.html', 'Ver la app $3.99'], rel: [['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo'], ['/blog/es-sigilo-de-dinero-paso-a-paso.html', 'Sigilo de dinero'], ['/blog/es-gnosis-magia-del-caos.html', 'Gnosis: técnicas completas']] },

  { slug: 'es-sigilo-de-dinero-paso-a-paso', en: 'money-sigil-guide.html', title: 'Cómo Hacer un Sigilo de Dinero: Paso a Paso sin Promesas Falsas', desc: 'Sigilo de dinero en 4 pasos honestos: intención realista, diseño, carga en gnosis y acción terrenal. Qué esperar y qué no esperar, en español.', h1: 'Cómo Hacer un Sigilo de Dinero', lede: 'El sigilo de dinero es el más pedido y el más malinterpretado. Aquí está la versión honesta: qué puede hacer un sigilo, qué no, y el protocolo exacto para lanzarlo bien.', secs: [
    ['Formular la intención correcta', 'Mal: "quiero ser millonario". Bien: "recibo $300 extra este mes por mi trabajo". El sigilo amplifica caminos que ya existen: si no buscas trabajo, un sigilo de empleo no te contrata. Formula un resultado concreto, alcanzable y con fecha.'],
    ['Diseño y carga', 'Reduce la frase quitando vocales y repetidas, dibuja el glifo, y cárgalo en gnosis: ejercicio al fallo, orgasmo o meditación profunda. Un solo pico de atención, luego olvido. No lo mires más ni comentes el deseo.'],
    ['El paso que casi todos omiten: la acción terrenal', 'Cada sigilo de dinero debe acompañarse de una acción física la misma semana: enviar un CV, pedir un aumento, publicar tu servicio. El sigilo no reemplaza la acción; ordena tu atención para no dejarla escapar.'],
  ], faq: [
    ['¿Es peligroso hacer un sigilo de dinero?', 'No, en sí mismo. El riesgo real es la obsesión: revisar el glifo cada día, lanzar diez versiones del mismo deseo y cancelar el efecto por expectativa. Un sigilo, una carga, una acción física, y sigues con tu vida.'],
    ['¿Funcionan los sigilos de dinero?', 'No hay garantías. Los practicantes reportan resultados variables; la honestidad del método exige tratarlo como experimento con fecha de revisión. Si en 30 días no pasó nada, cambia el enfoque o la intención.'],
  ], cta: ['Practica con registro honesto', 'La app Chaos Sigil Generator guarda cada sigilo con su intención, fecha de carga y fecha de revisión — exactamente lo que necesita un experimento serio. Pago único $3.99 en Google Play.', '/apps/chaos-sigil-generator.html', 'Descargar la app'], rel: [['/blog/es-es-peligroso-un-sigilo-de-dinero.html', '¿Es peligroso un sigilo de dinero?'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo'], ['/blog/es-libro-codex-chaoticus.html', 'Codex Chaoticus (libro)']] },

  { slug: 'es-es-peligroso-un-sigilo-de-dinero', en: 'is-it-dangerous-to-make-a-money-sigil.html', title: '¿Es Peligroso Hacer un Sigilo de Dinero? Riesgos Reales y Mitos', desc: 'Análisis honesto de los riesgos de un sigilo de dinero: obsesión, expectativa,autoengaño y presión financiera. Qué es mito y qué es real, en español.', h1: '¿Es Peligroso Hacer un Sigilo de Dinero?', lede: 'Respuesta corta: el sigilo no abre portales ni atrae maldiciones. Los riesgos reales son psicológicos y se evitan con disciplina. Los examinamos uno por uno.', secs: [
    ['Riesgo 1: obsesión y re-check', 'El error clásico es lanzar el sigilo y luego revisar el banco tres veces al día. Cada revisión reactiva el deseo consciente y anula la mecánica del olvido. La solución es estructural: guarda el sigilo sin etiqueta y fija una única fecha de revisión a 30 días.'],
    ['Riesgo 2: usar magia para reemplazar decisiones', 'Un sigilo no convierte una mala estrategia en buena. Si tu problema es un contrato abusivo o un negocio inviable, el sigilo solo te hará sostenerlo con más entusiasmo. Antes de lanzar, pregúntate: ¿qué decisión estoy postergando?'],
    ['Riesgo 3: autoengaño y falsos positivos', 'Si en 30 días recibiste $20 y estabas esperando $300, el experimento falló. Registrar resultados con honestidad —fechas, montos, criterios previos— es lo que separa una práctica seria de una superstición consoladora.'],
  ], faq: [
    ['¿Puede un sigilo de dinero "atraer" pérdidas?', 'No existe evidencia ni mecanismo para eso. Las pérdidas tienen causas verificables (gastos, contratos, decisiones). El sigilo es un ejercicio de atención y motivación, no una fuerza externa.'],
    ['¿Cuántos sigilos de dinero puedo lanzar a la vez?', 'Uno. Lanzar varios para el mismo objetivo es la forma más común de cancelar el efecto por saturación de expectativa. Si el primero no rinde en su plazo, cambia la intención, no la cantidad.'],
  ], cta: ['La app que impone disciplina', 'Chaos Sigil Generator registra intención, carga y fecha de revisión por sigilo — el antídoto contra la obsesión. $3.99, pago único, garantía de 7 días en Google Play.', '/apps/chaos-sigil-generator.html', 'Ver la app'], rel: [['/blog/es-sigilo-de-dinero-paso-a-paso.html', 'Sigilo de dinero paso a paso'], ['/blog/es-como-cargar-un-sigilo.html', 'Cómo cargar un sigilo'], ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo']] },

  { slug: 'es-que-es-la-magia-del-caos', en: 'chaos-magic-fundamentals-what-is-chaos-magic-guide.html', title: '¿Qué es la Magia del Caos? Fundamentos Explicados en Español', desc: 'La magia del caos explicada en español: creencia como herramienta, pragmatismo sobre dogma, sigilos, gnosis y paradigmas. La guía de fundamentos más clara.', h1: '¿Qué es la Magia del Caos?', lede: 'La magia del caos no es una religión: es un método. No te pide fe, pide experimentos. Esta guía de fundamentos te da el mapa completo en español.', secs: [
    ['La idea central: creencia como herramienta', 'Una creencia es un programa que corras temporalmente. Los caosmagos eligen creencias por su utilidad (para un ritual funciono "como si" existiera un espíritu; para otro, como si el cerebro reprogramara hábitos) y las sueltan después. No es cinismo: es flexibilidad con disciplina experimental.'],
    ['Nace del pragmatismo de Austin Osman Spare y Peter Carroll', 'Spare (década de 1910) inventó la sigilización; Carroll (1978, Liber Null) la sistematizó y fundó la corriente que hoy conoce todo el mundo. La regla de oro: "no se cree nada, todo se somete a prueba". Resultado verificable o se descarta.'],
    ['Las cuatro técnicas base', 'Sigilos (deseo → símbolo → gnosis → olvido), servidores (entidades artificiales construidas por ti), adivinación (tarot, runas, I Ching como generadores de perspectiva) y cambio de paradigma (alternar marcos de creencia sin aferrarse a ninguno). Todo lo demás son variaciones de estas cuatro.'],
  ], faq: [
    ['¿La magia del caos es satanismo?', 'No. No tiene dogma, deidad ni iglesia. Algunos practicantes usan marcos "oscuros", otros usan ángeles, quantum o psicología pura. El marco es una herramienta que se elige y se descarta.'],
    ['¿Necesito un maestro o una iniciación?', 'No. Es la corriente oculta más autodidacta que existe. Un buen libro y 90 días de práctica registrada enseñan más que cualquier iniciación de pago.'],
  ], cta: ['El libro que lo reúne todo', 'Codex Chaoticus: el grimorio digital en español del sistema completo — sigilos, gnosis, servidores y paradigmas. Descarga inmediata en Hotmart.', '/books/codex-chaoticus-pdf.html', 'Ver el libro'], rel: [['/blog/es-gnosis-magia-del-caos.html', 'Gnosis en la magia del caos'], ['/blog/es-creencia-como-herramienta.html', 'Creencia como herramienta'], ['/blog/es-servitor-primer-servidor.html', 'Cómo crear un servitor']] },

  { slug: 'es-gnosis-magia-del-caos', en: 'gnosis-chaos-magick-complete-techniques.html', title: 'Gnosis en la Magia del Caos: Técnicas Completas y Protocolos', desc: 'Qué es la gnosis en magia del caos, cómo alcanzarla (excitatoria e inhibitoria) y cómo usarla para cargar sigilos y lanzar servidores. Guía en español.', h1: 'Gnosis en la Magia del Caos: Técnicas Completas', lede: 'Gnosis es el estado mental donde la mente crítica se apaga y la sugestión se vuelve plástica. Es el motor de toda la magia del caos. Aquí están sus dos familias y sus protocolos.', secs: [
    ['Gnosis excitatoria: subir el voltaje', 'La excitoria alcanza el silencio mental por sobrexcitación: orgasmo, sprint al fallo, danza extática, risa descontrolada. El truco es el punto exacto: en el pico máximo, la mente se vacía por sobrecarga — ahí se muestra el sigilo durante segundos y se corta la atención.'],
    ['Gnosis inhibitoria: bajar el ruido', 'La inhibitoria va por el otro lado: respiración contada, suspensión del aliento, aislamiento sensorial, trance de vigilia en la frontera del sueño. Es más lenta y estable; ideal para quienes no responden a la intensidad. Protocolo básico: 15 minutos de respiración 4-7-8, luego abrir los ojos al glifo.'],
    ['Verificación: ¿estuve en gnosis o solo distraído?', 'El criterio práctico: amnesia parcial de los segundos del pico, distorsión temporal y ausencia de diálogo interno durante el contacto con el sigilo. Si recordaste perfectamente el momento, probablemente no hubo gnosis — ajusta el método y repite.'],
  ], faq: [
    ['¿La gnosis es peligrosa?', 'Los métodos estándar (ejercicio, respiración, meditación) son seguros para personas sanas. Evita hiperventilación prolongada, privación extrema de sueño o sustancias: no aumentan el efecto y sí los riesgos.'],
    ['¿Cuánto se practica la gnosis?', 'Solo en los momentos de carga. No es un estado permanente ni un objetivo de vida: es una puerta que se usa y se cierra. Practicar 2-3 cargas por semana es suficiente.'],
  ], cta: ['Guía completa en formato libro', 'El Manual de Activación de Servidores Mágicos incluye protocolos de gnosis paso a paso, con ejercicios y criterios de verificación. PDF en español, descarga inmediata.', '/books/manual-activacion-servidores-magicos-pdf.html', 'Ver el manual'], rel: [['/blog/es-como-cargar-un-sigilo.html', 'Cómo cargar un sigilo'], ['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?'], ['/blog/es-creencia-como-herramienta.html', 'Creencia como herramienta']] },

  { slug: 'es-creencia-como-herramienta', en: 'chaos-magick-belief-as-tool-paradigm-shifting.html', title: 'La Creencia como Herramienta: Cambio de Paradigma en la Magia del Caos', desc: 'Cómo funciona el cambio de paradigma en magia del caos: adoptar creencias temporalmente, usarlas y soltarlas. Protocolo completo en español.', h1: 'Creencia como Herramienta y Cambio de Paradigma', lede: 'Un paradigma es el conjunto de reglas por las que "funciona" tu realidad. Los caosmagos cambian de paradigma como se cambia de herramienta: a propósito, con fecha de devolución.', secs: [
    ['Qué significa exactamente', 'Adoptar una creencia no es fingir: es operar "como si" fuera cierta, con suficiente seriedad para que tu conducta cambie. Un ritual invocado bajo el paradigma del espíritu funciona distinto que uno bajo el paradigma psicológico — porque tú funcionas distinto. La habilidad es la alternancia, no la fe.'],
    ['El protocolo de cambio en 4 pasos', '1) Elige un paradigma para un periodo definido (2 semanas, un mes). 2) Escríbele sus reglas: qué existe, qué funciona, qué está prohibido. 3) Practica dentro de él sin mezclar marcos. 4) Al terminar, escribe una revisión honesta de resultados y suelta el marco. Sin revisión no hay experimento, solo afición.'],
    ['Por qué es más difícil de lo que suena', 'La mente odia la ambigüedad y te empujará a consolidar un marco "favorito". El antídoto es la alternancia programada: si este mes crees en espíritus, el próximo creerás en neuroplasticidad. Esa rotación mantiene el músculo flexible y evita que cualquier paradigma se vuelva dogma.'],
  ], faq: [
    ['¿No es hipocresía creer y no creer a la vez?', 'No, si lo entiendes como ingeniería temporal: ninguna creencia es permanente ni define tu identidad. Es la misma lógica de un ingeniero que usa un modelo simplificado para diseñar y otro distinto para auditar.'],
    ['¿Sirve para manipular a otros?', 'No es ese su uso. El cambio de paradigma opera sobre tu propia conducta y atención. Prometer resultados a otros con marcos que tú no sostienes es otra cosa: es marketing deshonesto.'],
  ], cta: ['Profundiza con el grimorio completo', 'Codex Chaoticus dedica capítulos completos al cambio de paradigma con ejercicios semanales. PDF en español, descarga inmediata en Hotmart.', '/books/codex-chaoticus-pdf.html', 'Ver Codex Chaoticus'], rel: [['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?'], ['/blog/es-gnosis-magia-del-caos.html', 'Gnosis: técnicas'], ['/blog/es-servitor-primer-servidor.html', 'Cómo crear un servitor']] },

  { slug: 'es-servitor-primer-servidor', en: 'build-your-first-chaos-magic-servitor.html', title: 'Cómo Crear tu Primer Servitor (Servidor Mágico): Guía Completa', desc: 'Crea tu primer servitor en 5 pasos: propósito, forma, habitat, activación y feed. Qué es un servitor, errores comunes y cuándo desmantelarlo. En español.', h1: 'Cómo Crear tu Primer Servitor', lede: 'Un servitor es una entidad artificial que construyes para un trabajo específico: el asistente mental de la magia del caos. Diseño, activación, mantenimiento y desmantelamiento, todo aquí.', secs: [
    ['Diseño: un trabajo, una entidad', 'Define en una frase qué hace ("me recuerda enviar propuestas cada lunes con energía amable"). Un servitor con tres funciones es tres servidores mal gestionados. Asigna forma (un glifo, un animal abstracto), un nombre y un habitat: dónde "vive" (un objeto, una app, un dibujo guardado).'],
    ['Activación y fuel', 'Se activa con una carga en gnosis — el mismo estado que un sigilo. Su combustible es la atención dirigida: un contacto breve programado (mirar su glifo al inicio de la semana) es mejor que obsesión diaria. Sin atención muere solo, lo cual es una característica de seguridad, no un defecto.'],
    ['Feed, revisión y desmantelamiento', 'Cada 30 días: revisó logros, ¿sí o no? Si cumplió, refuerza; si no, ajusta su definición o desmantélalo con un ritual breve de despedida (destruir el soporte + una carga de "licencia"). Nunca dejes servidores huérfanos: sin dueño ni definición se vuelven ruido mental.'],
  ], faq: [
    ['¿Un servitor puede volverse peligroso o "vivo"?', 'Es un constructo de tu propia mente, no un demonio externo. Los casos de "servidores descontrolados" corresponden siempre a definiciones vagas + obsesión. Con definición precisa, revisión mensual y desmantelamiento oportuno, el riesgo es mínimo.'],
    ['¿Cuántos servitors puedo tener?', 'Menos de lo que crees. Tres activos y bien revisados superan a doce abandonados. Si no recuerdas la definición exacta de uno, es candidato a desmantelamiento.'],
  ], cta: ['El manual completo en español', 'Manual de Activación de Servidores Mágicos: diseño, activación, feed y desmantelamiento con plantillas listas. PDF en español, descarga inmediata.', '/books/manual-activacion-servidores-magicos-pdf.html', 'Ver el manual'], rel: [['/blog/es-gnosis-magia-del-caos.html', 'Gnosis: técnicas'], ['/blog/es-que-es-la-magia-del-caos.html', '¿Qué es la magia del caos?'], ['/blog/es-creencia-como-herramienta.html', 'Creencia como herramienta']] },

  { slug: 'es-como-tener-un-sueno-lucido-esta-noche', en: 'how-to-lucid-dream-tonight.html', title: 'Cómo Tener un Sueño Lúcido Esta Noche: 5 Técnicas Rápidas', desc: 'Cinco técnicas para tener un sueño lúcido esta misma noche: realidad + WBTB + MILD combinados, señales de sueño y estabilización. Guía práctica en español.', h1: 'Cómo Tener un Sueño Lúcido Esta Noche', lede: 'Nadie puede garantizar lucidez en una noche específica, pero esta combinación de técnicas es la que más rápido produce el primer sueño lúcido: te la damos como protocolo exacto.', secs: [
    ['El protocolo de esta noche', '1) Durante el día: 5 checks de realidad (mirar las manos, releer un texto dos veces, preguntarte "¿estoy soñando?"). 2) Antes de dormir: escribe en tu diario "esta noche notaré que sueño". 3) Duerme 5 horas. 4) Despiértate con alarma, recuerda un sueño, vuelvete a dormir repitiendo MILD: "la próxima vez que sueñe, notaré que sueño".'],
    ['MILD: la técnica que hace el trabajo', 'MILD (Mnemonic Induction) no es visualizar: es la intención verbalizada con la imagen del sueño que recuerdas. Repites el loop suave, sin tensión, hasta quedarte dormido. La combinación WBTB (despertar a media noche) + MILD es la que más primeros sueños lúcidos produce en la investigación informal de la comunidad.'],
    ['Si logras lucidez: estabiliza antes de explorar', 'Al notar que sueñas: no corras, no mires el techo, frote las manos o toca una superficie y di "claridad ahora". Los primeros sueños duran segundos si te emocionas. Estabiliza primero, explora después.'],
  ], faq: [
    ['¿Es peligroso inducir sueños lúcidos?', 'No. El lucid dreaming es un fenómeno documentado del sueño REM. La única contraindicación práctica: no sacrifiques horas de sueño de forma crónica — WBTB puntual sí, insomnio programado no.'],
    ['¿Necesito una app o algo especial?', 'No para empezar: diario + alarma + técnica. Una app ayuda a registrar señales de sueño y estadísticas de lucidez. Dream Machine (pago único $3.99, sin suscripción) es la que usamos para nuestros experimentos.'],
  ], cta: ['Registra y mide tu lucidez', 'Dream Machine: diario de sueños con señales, alarmas inteligentes y estadísticas de lucidez offline. Pago único $3.99 en Google Play.', '/apps/dream-machine.html', 'Ver Dream Machine'], rel: [['/blog/es-diario-de-suenos-guia.html', 'Diario de sueños: guía'], ['/blog/es-proyeccion-astral-principiantes.html', 'Proyección astral para principiantes'], ['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna']] },

  { slug: 'es-diario-de-suenos-guia', en: 'dream-journaling-lucid-dreaming-complete-guide.html', title: 'Diario de Sueños para Sueños Lúcidos: Guía Completa y Plantilla', desc: 'Cómo llevar un diario de sueños que de verdad aumenta la lucidez: cuándo escribir, qué anotar, señales de sueño y revisión semanal. En español.', h1: 'Diario de Sueños: La Guía Completa', lede: 'El diario de sueños no es romántico: es la infraestructura técnica de la lucidez. Sin registro no hay señales, y sin señales no hay triggers de lucidez confiables.', secs: [
    ['La regla de oro: escribe antes de moverte', 'El recuerdo del sueño se evapora en 90 segundos. Al despertar, no te estires, no revises el teléfono: escribe con los ojos apenas abiertos, aunque sean fragmentos. La primera semana escribirás dos líneas; al mes, párrafos completos. El recuerdo es un músculo.'],
    ['Qué anotar: las 4 columnas', 'Contenido (qué pasó), emoción (qué sentiste), señales (elementos absurdos o recurrentes: lugares, personas, acciones imposibles) y hora de despertar. Las señales repetidas son tu catálogo personal de triggers: cuando aparezcan en el sueño, el check de realidad salta solo.'],
    ['La revisión semanal que multiplica lucidez', 'Cada domingo: lee la semana completa y subraya señales repetidas. Elige 3 como "señales objetivo" y ensaya mentalmente: "cuando vea X, haré un check de realidad". Ese ensayo es lo que convierte el diario en inducción, no en literatura.'],
  ], faq: [
    ['¿Papel o app para el diario de sueños?', 'Papel funciona y es gratis. Una app gana en: hora exacta de despertar, búsqueda de señales repetidas y estadísticas. Dream Machine hace las tres cosas offline, con pago único sin suscripción.'],
    ['¿Cuánto tarda el diario en producir lucidez?', 'La mayoría reporta más sueños recordados en 1-2 semanas y primeras lucideces entre 2 y 6 semanas combinando diario + MILD + checks. Depende de la constancia, no del talento.'],
  ], cta: ['Tu diario con estadísticas', 'Dream Machine registra sueños, extrae señales repetidas y muestra tu tasa de lucidez mes a mes. Offline, pago único $3.99, sin suscripción.', '/apps/dream-machine.html', 'Ver Dream Machine'], rel: [['/blog/es-como-tener-un-sueno-lucido-esta-noche.html', 'Sueño lúcido esta noche'], ['/blog/es-proyeccion-astral-principiantes.html', 'Proyección astral'], ['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna']] },

  { slug: 'es-proyeccion-astral-principiantes', en: 'astral-projection-for-beginners.html', title: 'Proyección Astral para Principiantes: Guía Paso a Paso (2026)', desc: 'Proyección astral para principiantes en español: preparación, vibraciones, técnicas de salida (cuerda, rodar, separación) y seguridad honesta.', h1: 'Proyección Astral para Principiantes', lede: 'La proyección astral es la sensación verificable de salir del cuerpo durante la frontera del sueño. No requiere dones: requiere protocolo. Aquí está el camino de 30 días.', secs: [
    ['Preparación: la frontera del sueño es el laboratorio', 'Proyectas desde el estado hipnagógico: entre vigilia y sueño. Programa: dormir 5 horas, despertar 30 minutos, volver a cama sin luz y sin teléfono. Ese segundo intento de dormir es donde ocurre el 90% de las primeras proyecciones.'],
    ['Las vibraciones y las técnicas de salida', 'Al relajarte profundo llegarán zumbidos, presión y vibraciones: no te asustes, es el umbral. Desde ahí, elige una técnica y practícala siempre la misma: la cuerda (trepar una cuerda imaginaria con las manos), rodar fuera del cuerpo como un tronco, o la separación por intento de movimiento sin mover el físico.'],
    ['Seguridad honesta y verificación', 'No hay evidencia de peligro físico: la parálisis y las vibraciones son fenómenos del sueño. Para verificar la experiencia, programa antes una información que no podías saber (un objeto oculto) y revísala al despertar. El escepticismo metodológico hace la práctica más sólida, no menos mágica.'],
  ], faq: [
    ['¿Puedo quedarme "atrapado" fuera del cuerpo?', 'No. Miles de reportes y la fisiología del sueño coinciden: el retorno es automático — con susto, con deseo o al terminar el ciclo REM. El miedo a quedar atrapado es el mito más repetido y el más falso.'],
    ['¿Cuánto tarda la primera proyección?', 'Con protocolo constante (5h + WBTB + una técnica fija), la mayoría reporta vibraciones en 1-2 semanas y primera separación parcial en 2-6 semanas. La constancia importa más que la técnica.'],
  ], cta: ['Guía práctica offline', 'Astral Lab: cartas natales, sesiones guiadas de relajación y registro de proyecciones. Pago único $6.99 en Google Play, sin suscripción.', '/apps/astral-lab.html', 'Ver Astral Lab'], rel: [['/blog/es-como-tener-un-sueno-lucido-esta-noche.html', 'Sueño lúcido esta noche'], ['/blog/es-diario-de-suenos-guia.html', 'Diario de sueños'], ['/blog/es-fases-de-la-luna-significado.html', 'Fases de la luna']] },

  { slug: 'es-24-runas-futhark-referencia', en: 'all-24-elder-futhark-runes-complete-reference.html', title: 'Las 24 Runas del Futhark Antiguo: Referencia Completa en Español', desc: 'Significado de las 24 runas del Futhark Antiguo: nombre, sonido, significado adivinatorio derecho e invertido, y uso mágico. Referencia en español.', h1: 'Las 24 Runas del Futhark Antiguo: Referencia Completa', lede: 'El Futhark Antiguo es el alfabeto rúnico más antiguo (siglo II). Estas son sus 24 runas con significado adivinatorio y uso mágico, organizadas en tres aettir de ocho.', secs: [
    ['Primer aett: Fehu a Wunjo — lo material y social', 'Fehu (riqueza, flujo), Uruz (fuerza, vitalidad), Thurisaz (defensa, choque), Ansuz (comunicación, inspiración), Raidho (viaje, orden), Kenaz (antorcha, conocimiento), Gebo (regalo, intercambio), Wunjo (alegría, armonía). Este aett gobierna el mundo cotidiano: dinero, cuerpo, palabra y comunidad.'],
    ['Segundo aett: Hagalaz a Sowilo — la prueba y la voluntad', 'Hagalaz (granizo, disrupción necesaria), Nauthiz (necesidad, fricción), Isa (hielo, pausa), Jera (ciclo, cosecha), Eihwaz (tejo, resistencia), Perthro (dado, misterio), Algiz (alce, protección), Sowilo (sol, victoria). Es el aett de la transformación: nada aquí es cómodo, todo es formativo.'],
    ['Tercer aett: Tiwaz a Othala — lo trascendente', 'Tiwaz (justicia, victoria del guerrero), Berkana (abedul, renacer), Ehwaz (caballo, asociación), Mannaz (humano, mente), Laguz (agua, intuición), Ingwaz (semilla, gestación), Dagaz (día, ruptura clara), Othala (herencia, hogar). Cierra el ciclo: de lo social a lo esencial.'],
  ], faq: [
    ['¿Las runas invertidas significan lo contrario?', 'No exactamente: algunas runas (Isa, Gebo) no tienen forma invertible. Una runa invertida suele indicar energía bloqueada, retrasada o mal dirigida, no un significado opuesto automático.'],
    ['¿Puedo usar runas para magia y no solo adivinar?', 'Sí: bindrunes (runas superpuestas para un propósito), amuletos y rituales de carga son uso mágico tradicional. La combinación con sigilos del caos funciona especialmente bien.'],
  ], cta: ['Tira runas online gratis', 'Oráculo de Runas Nórdicas gratis en el navegador: tirada de 9 runas con interpretación en español. Para registro diario y práctica profunda, la app Norse Rune Oracle cuesta $3.99, pago único.', '/apps/norse-rune-oracle.html', 'Ver la app $3.99'], rel: [['/blog/es-tirada-de-runas-online-gratis.html', 'Tirada de runas online'], ['/blog/es-tiradas-de-runas-principiantes.html', 'Tiradas de runas'], ['/blog/es-libro-tratado-runas.html', 'Tratado de runas (libro)']] },
];

let ok = 0, fail = 0;
for (const p of POSTS) {
  try { fs.writeFileSync(path.join(R, 'blog', p.slug + '.html'), page(p)); ok++; }
  catch (e) { console.log('FAIL ' + p.slug + ': ' + e.message); fail++; }
}
console.log(`BATCH1: ok=${ok} fail=${fail} total=${POSTS.length}`);
