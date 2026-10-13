// scripts/gen-es-compare2.mjs — 5 comparativas ES restantes con datos reales del repo
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pageCompare, writePages } from './gen-es-lib.mjs';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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
    slug: 'iching-app-vs-monedas-fisicas',
    title: 'App de I Ching o monedas físicas: comparación real',
    desc: 'I Ching en el móvil o tirando monedas en casa: precio, precisión y uso ritual. Comparativa honesta con la opción de pago único.',
    h1: 'App de I Ching o monedas físicas: comparación real',
    lede: 'Tres monedas y una app hacen lo mismo en el fondo: seis líneas. La diferencia está en la rapidez, en el precio y en si necesitas el objeto físico para que el trabajo tenga sentido.',
    secs: [
      ['Qué gana la app', 'La app gana en velocidad y en consistencia. Las seis líneas salen en un segundo, puedes volver a tirar el mismo hexagrama si el resultado no te cuadra y, sobre todo, la acción de leer el hexagrama con su cambio está a un toque. Para el trabajo diario es más cómoda.'],

      ['Qué ganan las monedas', 'Las monedas ganan en el gesto. Lanzar tres monedas y esperar el resultado mientras suenan en la mesa produce una pausa real, y esa pausa es parte del trabajo en muchas tradiciones. Además el método es universal: no necesitas aprender nada nuevo ni actualizar nada.'],

      ['La respuesta práctica', 'Usa la app para el trabajo diario y para consultar hexagramas al momento. Y usa las monedas cuando la consulta sea importante y quieras el ritual completo. No sonfy opciones excluyentes: la app te sirve para practicar y las monedas para festejar.'],
    ],
    table: {
      head: ['Criterio', 'App de I Ching', 'Monedas físicas'],
      rows: [
        ['Precio', A('iching-oracle').price + ' pago único', '−Casi gratis'],
        ['Velocidad', '+Inmediata', '−Hay que lanzar'],
        ['Sin conexión', '+Sí', '+Sí'],
        ['Ritual con pausa real', '−No', '+Sí'],
        ['Líneas que cambian', '+Marcadas al toque', '−A mano'],
        ['Ideal para', 'Práctica diaria', 'Consulta importante'],
      ],
    },
    pros: [[
      'Un solo pago y sin suscripción',
      'Hexagramas con cambio al instante',
      'Sirve para practicar a diario',
    ], [
      'Pierde la pausa del lanzamiento',
      'Es una pantalla más que un objeto',
    ]],
    verdict: 'Si quieres empezar hoy sin gastar, la herramienta gratis del navegador cumple. Cuando ya tiras a diario y el I Ching forma parte de tu rutina, la app es la compra más barata que te va a resultar útil.',
    faq: [
      ['¿La app hace las seis líneas igual que las monedas?', 'Sí, replica el método de tres monedas con seis líneas y marca las que cambian.'],
      ['¿Necesito monedas para usar la app?', 'No. La app trabaja sola.'],
      ['¿Cuál elijo para principiar?', 'Empieza con las monedas si ya tienes un juego. Si no, prueba primero la herramienta gratis del navegador.'],
    ],
    rel: [
      ['/blog/es-iching-principiantes.html', 'Guía de I Ching para principiantes'],
      ['/blog/es-iching-online-gratis.html', 'I Ching online gratis'],
      ['/blog/es-iching-vs-tarot.html', 'I Ching o tarot: cuál usar'],
    ],
  },

  {
    slug: 'apps-suenos-lucidos-comparativa',
    title: 'Comparativa de apps de sueños lúcidos en español',
    desc: 'Comparamos las apps de sueños lúcidos por precio y función: inducción, entrenamiento y registro. Todas con pago único, sin suscripciones.',
    h1: 'Comparativa de apps de sueños lúcidos en español',
    lede: 'Hay dos familias de apps para sueños lúcidos: las que te duermen y las que te entrenan. Comparamos las nuestras por lo que hacen, no por lo que promete su nombre.',
    secs: [
      ['Inducción o entrenamiento', 'Una app de inducción te lleva a dormir con una técnica concreta: sound, vibración o visualisation. Una app de entrenamiento te hace repetir ejercicios de realidad durante el día para que el chequeo automático de tu cuerpo funcione cuando duermas. Son objetivos distintos y no se sustituyen.'],

      ['Por qué el registro manda', 'Ninguna app registra por ti lo que pasó dentro del sueño. Eso lo hace el cuaderno, y por eso el registro es la pieza que más impacto tiene sobre si esto te va a funcionar. La app te da la técnica y el cuaderno te da el resultado.'],

      ['Qué mirar antes de comprar', 'Mira tres cosas: si funciona sin conexión, si no tiene suscripción y si hay algo más que el temporizador. Si la app solo trae un temporizador, la herramienta gratis del navegador hace lo mismo.'],
    ],
    table: {
      head: ['App', 'Precio', 'Función principal', 'Sin conexión'],
      rows: [
        [A('dream-machine').name, A('dream-machine').price, 'Inducción para dormir lucido', '+Sí'],
        [A('lucid-dream').name, A('lucid-dream').price, 'Entrenamiento diario', '+Sí'],
        [A('psi-gym').name, A('psi-gym').price, 'Chequeo de realidad y entrenamiento', '+Sí'],
        [A('noctem-tools').name, A('noctem-tools').price, 'Suite completa de herramientas', '+Sí'],
      ],
    },
    pros: [[
      'Pago único en todas, sin suscripción',
      'Funcionan sin conexión',
      'Cubren inducción y entrenamiento',
    ], [
      'Ninguna registra los sueños por ti',
      'El cuaderno sigue siendo obligatorio',
    ]],
    verdict: 'Si tu problema es quedarte dormido sin darte cuenta, empieza por la de inducción. Si te despiertas y no sabes que estabas soñando, necesitas entrenamiento y no inducción. La suite incluye las dos y la herramienta de registro.',
    faq: [
      ['¿Cuál necesito para empezar?', 'La de inducción si el problema es quedarte dormido. La de entrenamiento si te despiertas sin saber que soñabas.'],
      ['¿Tengo que llevar un cuaderno?', 'Es lo más importante que puedes hacer. La app da la técnica, el cuaderno da el resultado.'],
      ['¿Funcionan sin internet?', 'Sí, todas funcionan sin conexión una vez instaladas.'],
    ],
    rel: [
      ['/blog/es-como-tener-un-sueno-lucido-esta-noche.html', 'Cómo tener un sueño lúcido esta noche'],
      ['/blog/es-diario-de-suenos-guia.html', 'Guía del diario de sueños'],
      ['/es/mejores-apps-magia-del-caos.html', 'Todas las apps comparadas'],
    ],
  },

  {
    slug: 'tarot-gratis-vs-pago',
    title: 'Tarot gratis o de pago: qué te conviene de verdad',
    desc: 'Tarot gratis en el navegador o app de pago: comparativa de calidad, funciones y coste real. Sin marketing, con datos.',
    h1: 'Tarot gratis o de pago: qué te conviene de verdad',
    lede: 'El tarot gratis sirve para empezar y para una consulta rápida. El de pago sirve para cuando quieres el mazo completo en el móvil y sin depender de un anuncio. La diferencia real está en el acceso, no en la calidad de las cartas.',
    secs: [
      ['Qué puedes hacer gratis', 'Puedes barajar, tirar y consultar una carta con las herramientas del navegador. Para una pregunta de sí o no es más que suficiente, y para probar si el tarot te sirve, también. El límite real es la continuidad: no guardas tiradas ni las revisas después.'],

      ['Qué añade el de pago', 'El de pago añade lo que hace que el tarot sea una práctica y no un juego suelto: las 78 cartas en el móvil, tiradas guardadas, reverso ampliado y nada de anuncios. Y al ser una compra única, el coste se reparte en los meses de uso, no se renueva cada mes.'],

      ['Cómo no gastar de más', 'Regla simple: no compres hasta haber hecho al menos diez tiradas gratis y haberlas apuntado. Si después de diez sigues queriendo el tarot, ya sabes que lo vas a usar y la compra se justifica sola.'],
    ],
    table: {
      head: ['Criterio', 'Tarot gratis (web)', 'App de tarot de pago'],
      rows: [
        ['Precio', '+Gratis', A('unofficial-rider-waite-tarot').price + ' una vez'],
        ['Barajar y tirar', '+Sí', '+Sí'],
        ['Las 78 cartas', '−Según la herramienta', '+Sí'],
        ['Sin anuncios', '−No siempre', '+Sí'],
        ['Tiradas guardadas', '−No', '+Sí'],
        ['Sin conexión', '−Necesita conexión', '+Sí'],
      ],
    },
    pros: [[
      'Puedes probar sin gastar nada',
      'Sin permanencia ni tarjeta',
      'Ideal para tiradas sueltas',
    ], [
      'Sin registro de tiradas',
      'Depende de la conexión en muchas herramientas',
    ]],
    verdict: 'Empieza gratis y hazte diez tiradas apuntadas. Si las haces de verdad, el día que quieras el mazo completo en el móvil ya sabes que no es un capricho, y entonces la compra es la compra más fácil de justificar.',
    faq: [
      ['¿Puedo hacer tarot gratis en el navegador?', 'Sí, hay varias herramientas gratuitas para barajar, tirar y consultar cartas.'],
      ['¿La app tiene suscripción?', 'No, se paga una vez y no hay pagos recurrentes.'],
      ['¿Qué necesito para dejar de depender de una app de tarot online?', 'Una app de pago único: las cartas contigo, sin conexión y sin anuncios.'],
    ],
    rel: [
      ['/es/tarot-rider-waite-app-vs-mazo-fisico.html', 'App o mazo físico'],
      ['/blog/es-tarot-rider-waite-principiantes.html', 'Tarot para principiantes'],
      ['/tools/tarot-spread-builder.html', 'Constructor de tiradas gratis'],
    ],
  },

  {
    slug: 'libros-magia-del-caos-vs-cursos-online',
    title: 'Libros de magia del caos o curso online: cuál elegir',
    desc: 'Comparativa entre comprar libros de magia del caos y un curso online: coste real, ritmo, profundidad y qué funciona mejor.',
    h1: 'Libros de magia del caos o curso online: cuál elegir',
    lede: 'Un curso te da orden y un libro te da sistema. Ambos sirven, y la elección depende de si tu problema es la falta de orden o la falta de contenido.',
    secs: [
      ['Qué resuelve el libro', 'El libro es donde vive el sistema. Explica por qué se hace lo que se hace, qué es la magia del caos más allá de los mitos y qué se puede hacer con un sigilo o con un servidor. No se puede resumir en vídeo: es un texto que se lee despacio y se consulta durante años.'],

      ['Qué resuelve el curso', 'El curso resuelve lo que el libro no puede: la secuencia. Te dice qué hacer primero, en qué orden y qué errores evitar. Es cómodo cuando llevas meses atascado en el mismo punto. Su límite es la duración: cuando el curso termina, sigues sin material de consulta.'],

      ['La matemática de por qué el libro gana', 'Doce libros de este catálogo salen por menos que un solo curso de cabecera. Y un libro no caduca ni te quita el acceso. Para un tema como la magia del caos, donde lo importante es la práctica con registro, el libro funciona mejor como material de consulta permanente.'],
    ],
    table: {
      head: ['Criterio', 'Libros en PDF', 'Curso online'],
      rows: [
        ['Precio del bundle', '+8 libros por $19.99', '−Un curso por más'],
        ['Duración', '+Eterna', '−Al terminar el curso'],
        ['Velocidad', '−A tu ritmo', '+Siguiente lección'],
        ['Profundidad del sistema', '+Alta', '+Alta'],
        ['Acceso desde el móvil', '+Sí', '+Sí'],
      ],
    },
    pros: [[
      'Ocho libros por el precio de uno',
      'Material de consulta permanente',
      'Se leen y se releen a tu ritmo',
    ], [
      'No hay un orden que te guíe paso a paso',
      'Requiere que leas de verdad',
    ]],
    verdict: 'Para empezar, el bundle de libros es mejor compra que un curso: el mismo dinero te da años de material, no un contenido que se acaba. Y cuando quieras el orden, las guías de este sitio hacen ese papel gratis.',
    faq: [
      ['¿Qué incluye el bundle?', 'Ocho libros en PDF sobre sigilos, runas, goetia, servidores, tarot y método de trabajo.'],
      ['¿Cuál es el precio?', 'El bundle completo cuesta $19.99 en un solo pago.'],
      ['¿Puedo leerlos en el móvil?', 'Sí, son PDF y puedes leerlos en cualquier pantalla.'],
    ],
    rel: [
      ['/blog/es-libros-magia-del-caos.html', 'Los libros de magia del caos explicados'],
      ['/es/noctem-vs-apps-individuales.html', 'Suite de apps frente a compras sueltas'],
      ['/landing-pages/books-bundle.html', 'Ver el bundle de libros'],
    ],
  },

  {
    slug: 'noctem-vs-apps-individuales',
    title: 'Suite completa o comprar apps sueltas: qué sale mejor',
    desc: 'Comparativa entre la suite de doce herramientas y comprar las apps por separado. Precio real de cada opción y cuándo conviene cada una.',
    h1: 'Suite completa o comprar apps sueltas: qué sale mejor',
    lede: 'Comprar por separado da libertad para elegir solo lo que uses. La suite da todo de una vez y suele salir mejor de precio. La decisión depende de una sola pregunta: ¿cuántas vas a usar de verdad?',
    secs: [
      ['La cuenta sencilla', 'Multiplica el precio de las apps que te interesan y compara. Si el número se acerca al de la suite, ya tienes la respuesta: la suite incluye además el resto de herramientas, que son la parte que más se usa. La suite es la opción con mejor precio por herramienta.'],

      ['Cuándo comprar por separado', 'Comprar apps sueltas tiene sentido cuando hay una sola que te interesa de verdad y no piensas usar las demás. Es la opción de probar sin decidir, y como cada app es barata, el riesgo es mínimo. El riesgo real es comprar dos o tres y quedarse sin las que de verdad ibas a usar.'],

      ['Por qué no hay bundle en la tienda', 'Google Play no permite vender un paquete de varias apps desde la tienda. Por eso la suite se vende como una sola app que contiene las doce herramientas, no como un paquete dentro de la tienda. Es la única forma legal y por eso es la que funciona.'],
    ],
    table: {
      head: ['Criterio', 'Suite completa', 'Apps sueltas'],
      rows: [
        ['Precio', A('noctem-tools').price + ' pago único', 'Desde ' + A('chaos-sigil-generator').price],
        ['Herramientas incluidas', '+12', '−Solo las que elijas'],
        ['Formato', 'Una sola app', '+Una app por trabajo'],
        ['Sin suscripción', '+Sí', '+Sí'],
        ['Mejor para', 'Trabajar con todo', 'Probar una sola cosa'],
      ],
    },
    pros: [[
      'Doce herramientas en un solo pago',
      'Mejor precio por herramienta',
      'Sin suscripciones ni cuentas',
    ], [
      'Si solo quieres una, es más caro',
      'La app lleva todas las herramientas juntas',
    ]],
    verdict: 'Si vas a usar tres o más, la suite sale mejor de precio y además incluye herramientas que no habías pensado comprar. Si solo quieres una y probarla, el precio de la app suelta es el más bajo del catálogo y también es una compra segura.',
    faq: [
      ['¿Puedo comprar las apps por separado?', 'Sí, cada app se compra por separado en su propia ficha de Google Play.'],
      ['¿Por qué no hay paquete en la tienda?', 'Porque Google Play no permite vender paquetes de varias apps. La suite es una única app con las doce herramientas.'],
      ['¿Hay suscripción?', 'No. Todo se paga una vez y no hay pagos mensuales en ninguna opción.'],
    ],
    rel: [
      ['/es/mejores-apps-magia-del-caos.html', 'Las 12 apps comparadas una a una'],
      ['/es/astral-lab-vs-co-star.html', 'Comparativa con una app de pago único'],
      ['/apps/noctem-tools.html', 'Ficha de la suite completa'],
    ],
  },
];

writePages(PAGES, pageCompare, 'es');