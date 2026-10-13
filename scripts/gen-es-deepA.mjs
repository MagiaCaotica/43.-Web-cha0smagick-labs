// Bloque A: 3 deep-dives ES — servitor, sueño lucid tonight, diario de sueños
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { page } from './gen-es-deep1.mjs';

const R = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// el par EN ya está en el HTML existente (hreflang + og:image); no lo adivinamos
function enPair(slug) {
  const f = path.join(R, 'blog', slug + '.html');
  const src = fs.readFileSync(f, 'utf8');
  const m = src.match(/hreflang="en"\s+href="([^"]+)"/);
  return { en: m ? m[1] : '', enUrl: m ? m[1] : '' };
}

const POSTS = [
  {
    slug: 'es-servitor-primer-servidor',
    title: 'Cómo crear tu primer servitor (paso a paso)',
    desc: 'Guía completa en español para crear tu primer servitor de caos: diseño,vikearia, activación y mantenimiento. Con journal de servidores gratis.',
    h1: 'Cómo crear tu primer servidor: la guía completa',
    lede: 'Un servidor no es un demonio ni un esclavo: es una construcción mental con cuya presencia aprendes a negociar tu propia atención. Te enseñamos el método completo, desde el diseño del nombre hasta el mantenimiento.',
    app: { name: 'NOCTEM Tools', price: '$14.99', url: '/apps/noctem-tools.html' },
    hook: [
      'La mayoría de los que se interested por los servidores fracasan en el mismo punto: copian un ritual de otra persona, no entienden qué construyeron y a las tres semanas lo abandonan porque nunca hubo relación con aquello.',
      'Un servidor, en el marco de la magia del caos, es una representación—aunque sea en papel— de una línea de acción que quieres sostener. Puede ser una memoría de algo que necesitas hacer todos los días, o un recuerdo de un estado mental que te sirve cuando estás agotado.',
      'Lo que sigue es el método completo que usamos nosotros: cuatro pasos, un cuaderno de servidores y unos veinte minutos al día durante el primer mes. No necesitas saber dibujar. Necesitas decidir.'
    ],
    secs: [
      ['Paso 1: decidir qué quieres que el servidor represents', 'El error más común es empezar por el diseño. Empieza por la función. Escribe en una frase qué problema concreto resuelve tu servidor: "recordarme que debo escribir", "volver a la calma antes de una reunión", "mantener el hábito de escribir el diario".', 'Si tu respuesta es "quiero un servidor powerful que me obedezca", todavía no estás listo: eso no es un objetivo, es una fantasía de poder. Un servidor sirve para algo concreto o no sirve para nada. Cuando tengas la frase, todo lo demás se decide solo.'],
      ['Paso 2: elegir medio, nombre ymétodo', 'El medio es el soporte físico: un trozo de papel, una carta, una ficha, un pequeño cuaderno. El nombre debe ser corto, difícil de pronunciar mal y con sonido propio: evita los nombres comunes porque Blond es difícil de evocar con precisión. Un nombre corto y Fonético funciona mejor en visualization.', 'El raton visual importa menos de lo que crees, pero no es irrelevante. Si tu servidor va a estar en una tarjeta de 3×5 cm, dibuja un símbolo abstracto. Si va en una hoja completa, el raton puede ser más elaborado. Lo que no debe ser es bonito por sí solo: debe ser identificable a primera vista cuando lo veas en un sueño o en un trance.'],
      ['Paso 3: activar el servitor', 'La activación se hace en tres movimientos: escribir, sellar y llamar. Escribes su nombre y propósito en el medio. Lo sellas (un símbolo alrededor, un borde, una gota de cera si usas cera). Y lo llamas: pronuncias el nombre tres veces con intención y le dices que está activo desde ese momento.', 'El tercer movimiento es el que la gente pospone. Un servidor que se escribe pero nunca se llama, en la práctica no está activo. La regla operativa es sencilla: si en tres semanas no lo has llamado al menos cinco veces, no está funcionando. Funciona o se retira.'],
      ['Paso 4: vínculo y mantenimiento (el trabajo de 20 minutos)', 'El mantenimiento es lo que separa los servidores que sirven de los que se olvidan en un cajón. Consiste en: llamarlo cuando lo necesitas, anotar qué pasó después de cada llamada, y cada dos semanas revisar si su función sigue siendo relevante.', 'Da igual si el trabajo esLocura o nulo. Anotar es lo que convierte un ritual en un método. El journal de servidores gratuito de Cha0smagick Labs está pensado justo para eso: una llamada al día, una nota de tres líneas, y un registro de resultados.']
    ],
    faq: [
      ['¿Qué es un servidor en magia del caos?', 'Es una representación—así sea en papel— de una línea de acción, una función o un estado mental que quieres sostener. Se activa mediante escritura, sello y llamada, y se mantiene con contactos periódicos anotados.'],
      ['¿Cuánto tiempo tarda un servidor en ' + 'funcionar?', 'La práctica esperada es de tres a seis semanas de uso consistente. Si en ese período no produce ningún cambio observable en tu comportamiento, conviene revisar si la función estaba bien definida.'],
      ['¿Puedo tener más de un servidor?', 'Puedes, y en la práctica la mayoría de los practicantes terminan con dos o tres: uno para una tarea diaria y otro para un estado emocional. Pero cada servidor exige mantenimiento: más de cuatro sin uso real es carga, no recurso.'],
      ['¿Necesito saber dibujar?', 'No. Un símbolo abstracto, un círculo con el nombre adentro o incluso un rectángulo con líneas alcanza. La identificabilidad importa más que la estética.'],
      ['¿Los servidores son peligrosos?', 'No hay ninguna razón para tratar a un servidor como entidad autônoma. Es una herramienta de la propia mente. El riesgo real es el orden inverso:descuidarlo por semanas y no revisar lo que realmente estaba cambiando en tu rutina.']
    ],
    cta: ['Tu servidor merece un cuaderno, no un recuerdo', 'Guarda cada llamada, cada resultado y cada ajuste en el journal de servidores gratis. Cuando quieras llevarlo más lejos, el NOCTEM Tools agrupa el diseño, la activación y el seguimiento en una sola herramienta de pago único.', '/tools/servitor-design-journal.html', 'Abrir el journal gratis', '/apps/noctem-tools.html', 'Ver NOCTEM Tools ($14.99)'],
    rel: [['/es/es-ritual-destierro-espacio.html', 'Cómo limpiar el espacio antes de empezar'], ['/es/es-que-es-la-magia-del-caos.html', 'Qué es la magia del caos en 10 minutos'], ['/es/', 'Todas las guías en español']]
  },
  {
    slug: 'es-como-tener-un-sueno-lucido-esta-noche',
    title: 'Cómo tener un sueño lúcido esta noche',
    desc: 'Técnicas concretas para provocar un sueño lúcido esta noche: Reality Check,diario de sueños y planner de inducción. Gratis y sin registro.',
    h1: 'Cómo tener un sueño lúcido esta noche',
    lede: 'Los sueños lúcidos no son un talento: son una habilidad que aparece cuando la atención deja de disolverse al dormir. Esta es la rutina que usamos para provocarlos esta noche, paso a paso y sin theories.',
    app: { name: 'Lucid Dream', price: '$9.99', url: '/apps/lucid-dream.html' },
    hook: [
      'Si estás leyendo esto de noche, la noticia concreta es que la técnica más rápida para un sueño lúcido esta noche no depende del talento: depende de un trabajo de dos minutos antes de dormir y de un chequeo de realidad constante durante el día.',
      'La diferencia entre el 2% de personas que recuerdan sus sueños y el 98% que no, no es que sueñen menos. Es que los primeros no capturan la señal al despertar. El sueño lúcido es esa señal, amplificada.',
      'Lo que sigue es una rutina de tres piezas que puedes aplicar hoy mismo: Reality Check de día, inducción planificada antes de dormir, y registro de la mañana siguiente. Con eso, la probabilidad de un lucid tonight sube de forma medible en menos de una semana.'
    ],
    secs: [
      ['Pieza 1: el Reality Check que rompe el sueño', 'Consiste en hacer durante el día una pregunta específica y comprobar si estás despierto. La versión que mejor funciona es la de las manos: miras tus manos y te preguntas "¿estoy soñando?". Si los dedos tienen una cantidad inusual, estás en un sueño.', 'La clave no es hacerla una vez, sino hacerla seis u ocho veces al día en momentos donde no tengas que pensar en nada: una cola, un ascensor, un semáforo. El cerebro registra el gesto como "comprobación de estado" y lo repite durante el sueño. Cada comprobación diurna es una Puerta que se abre dentro del sueño.'],
      ['Pieza 2: inducción con el planificador antes de dormir', 'La inducción más fiable para esta noche es la de dormir con una intención escrita: te acuestas, repites mentalmente "voy a recordar mi sueño" mientras te quedas quieto, y te duermes sin mover el cuerpo.', 'La técnica del planificador de inducción funciona mejor si la haces 30 minutos antes, no en la cama. Escribes en el planner la intención exacta de esta noche, te acuestas después, y repites la frase al estilo de una mantra. La diferencia con simplemente "quiero soñar lúcido" es que la frase escrita se queda en la memoria de trabajo cuando te duermes.'],
      ['Pieza 3: el registro de la mañana que consolida', 'Al despertar, anota todo lo que recuerdes antes de moverte. Empieza escribiendo "hubo sueño" aunque no recuerdes nada. Parece tonto, pero el acto de escribir el ancla el recuerdo en la memoria y sube la probabilidad del sueño siguiente.', 'Un registro de entrada con solo tres campos: dónde estaba, qué veía, cómo me sentí— es suficiente. No es un diario de sueños literario; es una base de datos para tu práctica. En tres semanas vas a ver patrones: lugares que repiten, horas en las que sueñas más, símbolos que aparecen antes de/events importantes.'],
      ['Pieza 4: qué hacer cuando estás dentro del sueño', 'El comando más útil es: "¡Claridad!" o "¡Realidad!". En la mayoría de sueños, pronunciar esas palabras estabiliza la escena y evita el despertar. Esas dos palabras son el equivalente onírico de mirar las manos.', 'Si el sueño se deshace, no te frustres: despertar dentro de un sueño lúcido es normal en las primeras tres o cuatro veces. El objetivo de la primera semana no es durar, es recordar que estabas. El aumento de duración viene solo después.']
    ],
    faq: [
      ['¿Puedo tener un sueño lúcido esta misma noche?', 'Sí, con el Reality Check de día (6–8 veces), la intención escrita 30 minutos antes de dormir y el registro al despertar. No hay garantía, pero la probabilidad sube de forma notable en menos de una semana de práctica.'],
      ['¿Cuántas personas tienen sueños lúcidos?', 'Las estimaciones varían entre el 2% y el 8% de forma regular, y hasta el 23% según algunas encuestas que cuentan cualquier lucid episode. La diferencia no es genética: es la atención al despertar.'],
      ['¿Qué es el Reality Check?', 'Es una comprobación de estado que haces durante el día ("¿estoy soñando?", mirar las manos) para que el cerebro repita el gesto dentro del sueño. Es la base de casi todas las técnicas de lucid dreaming.'],
      ['¿Por qué no recuerdo mis sueños?', 'Porque el act of despertar borra la memoria antes de que se consolide. Anotar cualquier cosa al despertar, incluso "hubo sueño", es lo que más rápido recupera esa memoria.'],
      ['¿Funciona con la aplicación o necesito algo más?', 'La app de Lucid Dream (pago único de $9.99) combina planificador de inducción, registro de sueños y temporizador de lucididad en un solo sitio. No hace falta nada más; el movimiento real lo pone el hábito diario.']
    ],
    cta: ['Esta noche empieza con 20 minutos', 'Usa el planner de inducción gratis para dejar escrita tu intención y el registro al despertar. Si quieres que el proceso completo esté en un solo lugar, Lucid Dream agrada inducción, registro y temporizador en una sola app de pago único.', '/tools/lucid-dream-training-planner.html', 'Abrir el planner gratis', '/apps/lucid-dream.html', 'Ver Lucid Dream ($9.99)'],
    rel: [['/es/es-diario-de-suenos-guia.html', 'Cómo llevar un diario de sueños que sirve'], ['/es/es-proyeccion-astral-principiantes.html', 'Proyección astral para principiantes'], ['/es/', 'Todas las guías en español']]
  },
  {
    slug: 'es-diario-de-suenos-guia',
    title: 'Diario de sueños: la guía para empezarlo hoy',
    desc: 'Cómo llevar un diario de sueños que de verdad sirve: qué anotar, cómo leer tus patrones y el método de revisión semanal. Con template gratis.',
    h1: 'Diario de sueños: la guía para empezarlo hoy',
    lede: 'Un diario de sueños no es un cuaderno deidencia: es un conjunto de datos sobre tu vida interna. Te enseñamos qué anotar, cómo buscar patrones y qué hace falta para que valga la pena.',
    app: { name: 'Dream Machine', price: '$3.99', url: '/apps/dream-machine.html' },
    hook: [
      'La mayoría de los diarios de sueños mueren en la segunda semana porque se llenan de "soñé con cosas raras". Ese error de formato es la razón número uno por la que el diario no produce nada.',
      'Un diario útil tiene estructura. No necesitas escribir la película completa: necesitas anotar cuatro datos por entrada, todos los días, y revisarlos el domingo. Con eso, en un mes tienes información real sobre tus patrones.',
      'Lo que sigue es el método completo: el formato de cuatro campos, el procedimiento de lectura semanal y el error de interpretación que hace que la gente deje de usar su diario.'
    ],
    secs: [
      ['El formato de cuatro campos (esto es lo importante)', 'Cada entrada lleva cuatro campos: dónde estaba, qué veía, cómo me sentí y un detalle sensorial. Ejemplo: "casa de mi abuela / el pasillo estaba vacío / ansiedad / smell de madera húmeda".', 'El detalle sensorial es el campo que casi nadie anota y el más útil. El olfato es el sentido que casi no se recuerda conscientemente pero que reaparece en los sueños lúcidos y en los estados de transición. Si fuerzas tu memoria a registrarlo cada mañana, en un mes tendrás un mapa de fragancias asociadas a cada situación vital, y eso es información que ningún oráculo externo te da.'],
      ['Cómo leer tus patrones (revisión de domingo)', 'El domingo, con el cuaderno abierto, buscas: lugares que se repiten,|Emotion recurrente (no el storyline), objetos que aparecen sin que los estés buscando, y la diferencia entre días "planos" y días "con carga".', 'El patrón no es la historia del sueño: es la emoción recurrente. Si tres noches seguidas registras ansiedad y ningunaNight has un símbolo concreto, el patrón no es un símbolo, es la ansiedad. Eso cambia por completo la pregunta de qué hacer con esto.'],
      ['El error de interpretación que arruina los diarios', 'Tratar cada entrada como un presagio. Un sueño de un nettecessor no significa que vayas a perder dinero. Significa que tu sistema de alerta respondió al estrés, probablemente relacionado con el dinero.', 'Los sueños son material simbólico interno, no informes del futuro. Cuando tu diario empieza a llenarse de predicciones, empiezas a recordar solo las entradas que encajan con lo que después pasó, y todo el sistema deja de servir. El diario sirve para entender el presente, no para adivinar la semana que viene.'],
      ['Cómo mantener el hábito más de 30 días', 'El truco es bajar la barra: escribir una sola línea cuenta. Pon el cuaderno (o la app) al lado de la cama, no en la otra habitación. Y escribe siempre antes de levantarte, aunque solo sea "no recuerdo nada".', 'A partir de la semana 4, el formato se vuelve más rico: empiezas a dibujar mapas del sueño, a cronometrar la hora de inicio, y a etiquetar si fue lucid o no. Esa información es la que permite pasar de "tengo sueños" a "tengo un método para trabajar con mis sueños".']
    ],
    faq: [
      ['¿Cada cuánto debo escribir mi diario de sueños?', 'Idealmente al despertar, antes de moverte del sitio. Si olvidaste el 80% del sueño, escribe al menos "hubo sueño, sin detalles": ese anclaje ya sube la probabilidad de recordar algo la mañana siguiente.'],
      ['¿Qué campos debo anotar?', 'Cuatro: dónde estaba, qué veía, cómo me sentí y un detalle sensorial. Con esos cuatro tienes suficiente para encontrar patrones. Las historias largas son opcionales y consumes más tiempo del que aportan al principio.'],
      ['¿Puedo usar una app en vez de un cuaderno?', 'Sí. La app Dream Machine ($3.99, pago único) hace el registro estructurado, el cronómetro de onset y la revisión semanal. Es la alternativa cuando el cuaderno no sobrevive a la cama.'],
      ['¿Los sueños predicen el futuro?', 'No. Los sueños producen información sobre el presente interno: el estrés, las necesidades, los conflictos abiertos. Un diario sirve para entender cómo funcionas, no para anticipar lo que va a pasar.'],
      ['¿Sirve si recuerdo muy poco?', 'Sí. La plaintext de "no recuerdo" también es un dato, y registrar de forma constante mejora tu recuerdo durante la práctica tu recall durante la práctica. Los que llevan un mes registrandoalcanzan un sueño lúcido por semana en promedio.']
    ],
    cta: ['Empieza con el formato de cuatro campos', 'El diccionario de símbolos de sueño gratis te da las columnas de referencia para que la primera entrada no sea una página en blanco. Si prefieres registrar, clasificar y revisar en un solo lugar, Dream Machine lo hace con un pago único.', '/tools/dream-symbol-dictionary.html', 'Abrir el diccionario gratis', '/apps/dream-machine.html', 'Ver Dream Machine ($3.99)'],
    rel: [['/es/es-como-tener-un-sueno-lucido-esta-noche.html', 'Cómo tener un sueño lúcido esta noche'], ['/es/es-proyeccion-astral-principiantes.html', 'Proyección astral para principiantes'], ['/es/', 'Todas las guías en español']]
  }
];

let ok = 0, fail = 0;
for (const p of POSTS) {
  try {
    const pair = enPair(p.slug);
    fs.writeFileSync(path.join(R, 'blog', p.slug + '.html'), page({ ...p, en: pair.en, enUrl: pair.enUrl }));
    ok++;
  } catch (e) { fail++; console.log('FAIL ' + p.slug + ': ' + e.message); }
}
console.log('Bloque A (deep): OK ' + ok + ' / FAIL ' + fail);