// scripts/gen-es-compare1.mjs — 5 comparativas ES con datos reales extraidos del repo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pageCompare, writePages } from './gen-es-lib.mjs';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// ---- indice real de apps (H1 + primer precio del HTML) ----
const APPS = {};
for (const f of fs.readdirSync(path.join(R, 'apps')).filter((x) => x.endsWith('.html'))) {
  const h = fs.readFileSync(path.join(R, 'apps', f), 'utf8');
  const h1 = h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const price = h.match(/\$\s?(\d+\.\d{2})/);
  APPS[f.replace('.html', '')] = {
    name: h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : f,
    price: price ? '$' + price[1] : 'variable',
    url: '/apps/' + f,
  };
}
const A = (slug) => APPS[slug];

const PAGES = [
  {
    slug: 'mejores-apps-magia-del-caos',
    title: 'Las 12 mejores apps de magia del caos en español',
    desc: 'Comparativa completa de las 12 apps de magia del caos en español: precio real, para qué sirve cada una y cuál comprar primero. Pago único, sin suscripciones.',
    h1: 'Las 12 mejores apps de magia del caos en español',
    lede: 'Doce apps, un solo pago por app y ninguna suscripción. Esta comparativa ordena las que publicamos según el trabajo que hacen, con el precio real de cada una y qué conviene comprar primero si solo vas a gastar en una o dos.',
    secs: [
      ['Criterio de esta comparativa', 'Ordenamos las apps por utilidad real, no por popularidad. Para cada una importa el precio exacto, si funciona sin conexión, y sobre todo qué resuelve: sigilos, tarot, runas, cartas astrales, sueños o azogamiento. Ninguna hace todo bien, y por eso una buena compra es la que cubre el trabajo que ya haces.'],

      ['Cómo elegir sin gastar de más', 'Empieza por la herramienta que ya usas en el navegador. Si hoy haces sigilos en el móvil, compra el generador de sigilos. Si ya trabajas con las cartas, el tarot. Y si lo que quieres es guardar resultados de todo lo que haces, la suite es la que tiene sentido porque cubre las doce.'],
    ],
    table: {
      head: ['App', 'Precio', 'Para qué sirve', 'Sin conexión'],
      rows: [
        [A('chaos-sigil-generator').name, A('chaos-sigil-generator').price, 'Generar sigilos de magia del caos', '+Sí'],
        [A('psi-gym').name, A('psi-gym').price, 'Entrenar y medir habilidades psi', '+Sí'],
        [A('dream-machine').name, A('dream-machine').price, 'Inductor de sueños lúcidos', '+Sí'],
        [A('norse-rune-oracle').name, A('norse-rune-oracle').price, 'Tiradas de runas vikingas', '+Sí'],
        [A('iching-oracle').name, A('iching-oracle').price, 'I Ching por monedas y hexagramas', '+Sí'],
        [A('unofficial-rider-waite-tarot').name, A('unofficial-rider-waite-tarot').price, 'Tarot Rider Waite completo', '+Sí'],
        [A('lunar-phase-calculator').name, A('lunar-phase-calculator').price, 'Fases de luna para rituales', '+Sí'],
        [A('arcana-goetia').name, A('arcana-goetia').price, 'Arcana Goetia con rituales', '+Sí'],
        [A('astral-lab').name, A('astral-lab').price, 'Cartas astrales y aspectos', '+Sí'],
        [A('eerieroads').name, A('eerieroads').price, 'Mapas de caminosparanormales', '+Sí'],
        [A('lucid-dream').name, A('lucid-dream').price, 'Entrenamiento de sueños lúcidos', '+Sí'],
        [A('noctem-tools').name, A('noctem-tools').price, 'Suite completa de 12 herramientas', '+Sí'],
      ],
    },
    pros: [[
      'Doce apps con precio fijo y sin suscripción mensual',
      'Todas funcionan sin conexión, en el teléfono',
      'Cada app resuelve un trabajo concreto',
    ], [
      'Doce compras si quieres el ecosistema entero',
      'No hay una versión de pago dentro de cada app',
    ]],
    verdict: 'Si vas a comprar una sola, elige la que corresponde al trabajo que ya haces: sigilos, tarot, runas o sueños. Si vas a comprar varias, la suite NOCTEM incluye las doce herramientas en un solo pago y sale mejor de precio que sumarlas una por una.',
    faq: [
      ['¿Las apps tienen suscripción mensual?', 'No. Todas se compran una sola vez a un precio fijo y no piden cuentas ni pagos recurrentes.'],
      ['¿Puedo usarlas sin internet?', 'Sí. Funcionan sin conexión una vez instaladas, algo que importa en las sesiones de ritual.'],
      ['¿Cuál es más barata?', 'Varias de ellas están en el precio más bajo del catálogo. La diferencia está en la función, no en el importe.'],
      ['¿Hay una forma de tener todo?', 'Sí: la suite incluye las doce herramientas en un solo pago.'],
    ],
    rel: [
      ['/es/noctem-vs-apps-individuales.html', 'Suite completa frente a comprar apps sueltas'],
      ['/es/tarot-rider-waite-app-vs-mazo-fisico.html', 'App de tarot frente a mazo físico'],
      ['/es/apps-suenos-lucidos-comparativa.html', 'Comparativa de apps de sueños lúcidos'],
    ],
  },

  {
    slug: 'tarot-rider-waite-app-vs-mazo-fisico',
    title: 'App de tarot Rider Waite o mazo físico: cuál conviene',
    desc: 'Tarot Rider Waite en app o en mazo físico: comparación real de precio, manipulación y aprendizaje. Con la opción de pago único en Google Play.',
    h1: 'App de tarot Rider Waite o mazo físico: cuál conviene',
    lede: 'El mazo físico nunca se rompe y la app nunca se pierde. Ninguna de las dos opciones gana en todo, así que la comparación honesta es por tipo de practicante y por tipo de sesión.',
    secs: [
      ['Dónde gana el mazo físico', 'El mazo físico gana en algo que ninguna app iguala: el peso, el ruido al barajar y el gesto. Para el trabajo ritual serio: muchas personas necesitan que la carta tenga grosor. Además el mazo envejece y se desgasta, y eso no se estropea: se vuelve tuyo.'],

      ['Dónde gana la app', 'La app gana cuando necesitas velocidad o portabilidad. Buscar una carta concreta entre 78 es inmediato, las cartas se giran con un dedo y no llevas nada encima. Y hay una ventaja que la comparación suele olvidar: con la app puedes ver el reverso ampliado sin desentravarte de la tirada.'],

      ['Lo que ninguna de las dos resuelve', 'Ninguna de las dos te da la lectura. Ese trabajo es tuyo: la carta es un descriptor y la interpretación depende de lo que registres después. Si quieres que el tarot te sirva de algo, necesitas un registro de resultados, no un mazo más bonito.'],
    ],
    table: {
      head: ['Criterio', 'App de tarot', 'Mazo físico'],
      rows: [
        ['Precio', A('unofficial-rider-waite-tarot').price + ' pago único', 'Precio del mazo, una vez'],
        ['Sin conexión', '+Sí', '−No aplica'],
        ['Velocidad de búsqueda', '+Inmediata', '−Manual'],
        ['Reverso ampliado', '+Sí', '−Depende del tamaño'],
        ['Ritual con peso y ruido', '−No', '+Sí'],
        ['Durabilidad', '−Depende del móvil', '+Dura años'],
      ],
    },
    pros: [[
      'Un solo pago, sin suscripción',
      '78 cartas con reverso ampliado',
      'Cabe en el bolsillo y no se rompe',
    ], [
      'Pierde el gesto físico del mazo',
      'Hay que revisar el móvil con frecuencia',
    ]],
    verdict: 'Si tu práctica es diaria y breve, la app gana: es más rápida, cuesta una vez y no ocupa sitio. Si haces sesiones largas con mazo en la mesa, el físico tiene algo que la app no puede replicar. Muchos practicantes terminan usando las dos cosas, y no es contradictorio.',
    faq: [
      ['¿La app es una copia del mazo Rider Waite?', 'Muestra las mismas 78 cartas del Rider Waite, que es un mazo de dominio público. La diferencia es la pantalla.'],
      ['¿Necesito conexión a internet?', 'No. Funciona sin conexión una vez instalada.'],
      ['¿Puedo usar la app para tiradas de tres cartas?', 'Sí, es el formato más usado y el más cómodo en pantalla.'],
    ],
    rel: [
      ['/es/tarot-gratis-vs-pago.html', 'Tarot gratis o de pago: qué te conviene'],
      ['/es/mejores-apps-magia-del-caos.html', 'Las 12 apps comparadas'],
      ['/blog/es-tarot-rider-waite-principiantes.html', 'Guía de tarot para principiantes'],
    ],
  },

  {
    slug: 'astral-lab-vs-co-star',
    title: 'Astral Lab o Co-Star: cartas astrales con pago único',
    desc: 'Comparativa entre Astral Lab y Co-Star: precio, modelo de negocio y qué te da cada app de astrología en tu teléfono.',
    h1: 'Astral Lab o Co-Star: cartas astrales con pago único',
    lede: 'Las dos te dan la carta astral de tu fecha de nacimiento. La diferencia real no está en los cálculos sino en el modelo: una app es un producto que compras una vez y la otra es un servicio que crece con tu cuenta.',
    secs: [
      ['La diferencia que casi nadie menciona', 'Una app de pago único hace exactamente lo mismo el día uno y el día trescientos. Las apps de servicios gratis suelenmutable su nivel gratuito con el tiempo: muchas cosas se desbloquean, otras se van. Con una app comprada, el riesgo de perder funciones es cero.'],

      ['Qué aporta cada enfoque', 'Co-Star es conocida por su tono casual y por el contenido social, y funciona mejor si te gusta leer sobre signos que consultar la carta. Una app de carta astral de pago único es mejor herramienta de trabajo: carta completa, aspectos y datos de nacimiento disponibles de inmediato, sin depender de la configuración del servicio.'],

      ['Cómo decidir en treinta segundos', 'Pregúntate una cosa: ¿quiero el horóscopo del día o la carta natal completa? Si es la carta, elige pago único. Si es el horóscopo con contenido y comunidad, el modelo gratis tiene su valor y no compensa pagar por algo que se cambia cada semana.'],
    ],
    table: {
      head: ['Criterio', 'Astral Lab', 'Co-Star'],
      rows: [
        ['Precio', A('astral-lab').price + ' pago único', 'Modelo gratuito con servicios'],
        ['Carta astral completa', '+Sí', '−Parcial'],
        ['Funciona sin conexión', '+Sí', '−Requiere conexión'],
        ['Sin suscripción', '+Sí', '−No aplica'],
        ['Contenido diario', '−No', '+Sí'],
      ],
    },
    pros: [[
      'Un solo pago y sin cuentas',
      'Carta natal y aspectos siempre disponibles',
      'Sin conexión',
    ], [
      'No tiene contenido social ni horóscopo diario',
      'Menos contenido de fondo que un servicio gratuito',
    ]],
    verdict: 'Si lo que necesitas es la carta astral como herramienta de trabajo, la de pago único es la opción coherente: la compras una vez y funciona siempre. El servicio gratuito gana solo si su contenido diario es lo que realmente te hizo instalarla.',
    faq: [
      ['¿Cuál calcula mejor la carta astral?', 'Ambas partn de los mismos datos de nacimiento. La diferencia está en la profundidad de lo que muestra y en que puedas consultarla sin conexión.'],
      ['¿Necesito crear cuenta?', 'No en el modelo de pago único.'],
      ['¿Puedo usar la app sin internet?', 'Sí, es una de sus ventajas frente a los servicios en la nube.'],
    ],
    rel: [
      ['/es/mejores-apps-magia-del-caos.html', 'Todas las apps comparadas'],
      ['/es/noctem-vs-apps-individuales.html', 'Suite frente a apps sueltas'],
      ['/tools/full-birth-chart.html', 'Calculadora de carta natal gratis'],
    ],
  },

  {
    slug: 'generador-sigilos-app-vs-hacerlo-a-mano',
    title: 'Generador de sigilos en app o hacerlo a mano',
    desc: 'App de sigilos o trazo manual: cuándo conviene cada método, qué se pierde al automatizar y cuándo el trazo a mano es mejor.',
    h1: 'Generador de sigilos en app o hacerlo a mano',
    lede: 'La app te da simetría perfecta en dos segundos. El trazo a mano te cuesta diez minutos y te da algo que la app no puede darte: la intención viajando por el movimiento de tu mano.',
    secs: [
      ['Qué gana la app', 'La app gana en lo mecánico: los trazos salen simétricos, la retícula está recta y el resultado es presentable. Si el sigilo va a usarse como imagen de wallpaper, para imprimir o para compartir, la app te ahorra el trabajo de corregir la geometría a mano.'],

      ['Qué gana el trazo a mano', 'El trazo manual gana en algo que la app no mide: el momento de la intención. Muchas personas usan el sigilo como objeto de atención y el proceso de dibujarlo ya es medio trabajo. Además, un sigilo trazado a mano es irrepetible y por eso no se puede clonar ni copiar en otro contexto.'],

      ['La recomendación honesta', 'Usa la app para preparar, marca y mano para móvil. Es decir: genera la geometría, imprímela o pásala al móvil como guía, y traza encima con tu propia línea. Así tienes la simetría y la intención, que es la combinación más fuerte.'],
    ],
    table: {
      head: ['Criterio', 'App de sigilos', 'Trazo a mano'],
      rows: [
        ['Tiempo', '+Inmediato', '−10 minutos'],
        ['Simetría exacta', '+Siempre', '−A ojo'],
        ['Intención en el trazo', '−No', '+Sí'],
        ['Formato listo para imprimir', '+Sí', '−Hay que escanear'],
        ['Uso como wallpaper', '+Sí', '−Depende del trazo'],
      ],
    },
    pros: [[
      'Geometría limpia y simétrica',
      'Se puede imprimir de inmediato',
      'Gratis en el navegador para probar',
    ], [
      'El trazo no lleva intención',
      'El resultado es idéntico cada vez',
    ]],
    verdict: 'Para empezar, la herramienta gratis del navegador es suficiente y no cuesta nada. Cuando ya trabajas con sigilos cada semana, la app en el móvil compensa por comodidad. Y si lo que buscas es que el sigilo sea un objeto tuyo, dibújalo a mano.',
    faq: [
      ['¿Cuál herramienta uso para empezar?', 'La del navegador: es gratis y no requiere instalar nada.'],
      ['¿La app hace el sigilo más rápido?', 'Sí, y con geometría exacta. El valor del trazo manual está en otro lado.'],
      ['¿Puedo imprimir un sigilo generado en la app?', 'Sí, esa es una de las ventajas frente al trazo manual.'],
    ],
    rel: [
      ['/tools/sigil-generator.html', 'Generador de sigilos gratis en el navegador'],
      ['/blog/es-como-hacer-un-sigilo-paso-a-paso.html', 'Cómo hacer un sigilo paso a paso'],
      ['/blog/es-como-cargar-un-sigilo.html', 'Cómo cargar un sigilo'],
    ],
  },

  {
    slug: 'runas-app-vs-libro-de-runas',
    title: 'App de runas o libro de runas: qué comprar primero',
    desc: 'App de runas vikingas o libro de runas: comparación de precio y uso real para principiantes y praticantes advanced.',
    h1: 'App de runas o libro de runas: qué comprar primero',
    lede: 'Una te da respuestas rápidas y la otra te da el sistema. La pregunta correcta no es cuál es mejor, sino cuál te falta: velocidad o comprensión.',
    secs: [
      ['Qué resuelve cada una', 'La app resuelve el momento: necesitas una tirada ahora, con cuatro estilos y reloj para que no te desvíes del primer impulso. El libro resuelve el sistema: por qué cada runa significa lo que significa, qué fila es cuál y cómo encajan en la práctica. Uno sirve para el día a día y el otro para el resto de la vida.'],

      ['El orden que funciona', 'Si vienes de cero, empieza por la herramienta gratis del navegador para hacer tiradas sin gastar nada. Cuando ya te interese el sistema, compra el libro. Y cuando el libro te exhausta, la app deja de ser un juguete y se vuelve el instrumento de trabajo.'],

      ['Cuándo comprar la app directamente', 'La app tiene sentido desde el primer día si ya hiciste tiradas antes y sabes lo que buscas. Para principiantes la respuesta honesta es: empieza gratis, lee, y solo compra cuando la pregunta te aparezca sola cada semana.'],
    ],
    table: {
      head: ['Criterio', 'App de runas', 'Libro de runas'],
      rows: [
        ['Precio', A('norse-rune-oracle').price + ' pago único', 'Incluido en el bundle de libros'],
        ['Formato', '−Tarda 2 minutos', '+Sin conexión'],
        ['Entender el sistema', '− superficial', '+Profundo'],
        ['Sin conexión', '+Sí', '+Sí'],
        ['Útil el primer día', '+Sí', '−Mejor al segundo mes'],
      ],
    },
    pros: [[
      'Cuatro estilos de tirada en el mismo sitio',
      'Sin conexión y sin suscripción',
      'Precio bajo',
    ], [
      'No explica el sistema completo',
      'Si ya dominas runas, aporta poco al principio',
    ]],
    verdict: 'Empieza por la herramienta gratis del navegador y por la guía de runas en español. Cuando ya hagas tiradas cada semana, la app es la inversión más barata del catálogo y la que más uso le vas a sacar.',
    faq: [
      ['¿Qué necesito para empezar con runas?', 'Nada comprado: una herramienta gratis y una guía bastan para las primeras semanas.'],
      ['¿Cuál primero si tengo poco presupuesto?', 'Primero el libro, porque el sistema es lo que no se improvisa.'],
      ['¿La app incluye explicaciones?', 'Incluye las tiradas y las referencias; el sistema completo está en el libro.'],
    ],
    rel: [
      ['/blog/es-24-runas-futhark-referencia.html', 'Referencia de las 24 runas del Futhark'],
      ['/blog/es-tirada-de-runas-online-gratis.html', 'Tirada de runas gratis en el navegador'],
      ['/books/tratado-runas-cazadoras-caos-pdf.html', 'Tratado de runas en PDF'],
    ],
  },
];

writePages(PAGES, pageCompare, 'es');