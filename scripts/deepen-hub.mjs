// Deep-dive pass for the 8 new commercial root pages.
// Adds: answer-first TL;DR (GEO), extra deep sections, author box (E-E-A-T),
// expanded FAQ mirrored into FAQPage JSON-LD, dateModified, Person schema,
// and Speakable selectors pointing at the new sections.
// Idempotent via the `<!-- deep-hub -->` marker.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://cha0smagicklabs.com';
const MARK = '<!-- deep-hub -->';
const MODIFIED = '2026-10-13';

const AUTHOR = {
  '@type': 'Person',
  '@id': SITE + '/about.html#frater-alek0s',
  name: 'Frater Alek0s',
  url: SITE + '/about.html',
  jobTitle: 'Chaos magick practitioner and editor',
  description:
    'Cha0smagick Labs is edited by Frater Alek0s, a chaos magick practitioner with fifteen years of practice, ' +
    'author of the Chaos Hunter runes treatise and editor of the Inner Circle study programme. Every guide on ' +
    'this site is tested in practice before it is published, and every app listed here is built and maintained ' +
    'by the same small team.'
};

const PAGES = [
  {
    slug: 'sigil-maker.html',
    tldr: [
      'A sigil maker turns a statement of intent into a single closed shape. It is free to use online, needs no account, and takes about thirty seconds.',
      'The working method is four steps: fix the statement, reduce it to its skeleton letters, draw the shape, then forget it. Skipping the forgetting step is the most common beginner mistake.',
      'You do not need anything to draw a sigil. Paper and a pen do the job as well as any app, and a $3.99 Android app only helps when you charge several a week.',
      'What a maker cannot do for you is the intention. The shape is a container; the meaning has to be yours.'
    ],
    deep: [
      ['letters', 'Which letters actually go into the sigil', [
        'The rule most beginners get wrong is thinking every letter of the sentence belongs in the shape. It does not. You strip the statement down until only the letters carrying the intent survive, then you draw them without lifting the pen.',
        'Worked example: <em>I am abundant</em> reduces to <em>I M A B U N D</em>. The long words collapse, the filler words vanish, and what remains is seven letters that can close into a figure. A page-long statement would produce an unreadable blob and carry no meaning at all.',
        [
          '<strong>Drop articles.</strong> The, a, an, my, of, the — none of them carry intent.',
          '<strong>Drop verbs of being.</strong> I am, I have, I want to — the being is implied by the shape.',
          '<strong>Keep the object.</strong> Money, love, work, protection, clarity. This is the payload.',
          '<strong>Keep the qualifier if it matters.</strong> Steady, daily, long-term. It changes the working.',
          '<strong>Then use letters, not words.</strong> A D N T B is fine. A whole paragraph is not.'
        ],
        'Once the letters are fixed, three schools of drawing exist and you can mix them without problems. The letter-shape method uses the plain capitals. The number method converts each letter to its alphabet position, which suits people who work with numerology. The planetary method substitutes letters drawn in the shape of the glyph of the ruling planet, which is the version most grimoires show.',
        'Whichever you pick, keep the figure under roughly twelve strokes. Above that you lose the point of the method: a sigil you cannot trace in one breath is a sigil you will not remember.'
      ]],
      ['charge', 'How a sigil is charged, step by step', [
        'Drawing is not the activation. The sigil exists the moment the shape is closed, but it stays inert until you charge it. Charging is a short, repeatable act of attention, and the mechanics vary less than practitioners argue.',
        'The basic procedure is: put the sigil where you will not brush it by accident, focus on the statement it encodes rather than on the drawing, and hold that focus for a fixed count. Thirty seconds is the common minimum. Some traditions work with a full gnosis cycle of thirty to forty minutes, which suits bigger working.',
        'The free <a href="/tools/sigil-charging-timer.html">charging timer</a> displays the count and keeps a local log, so you can see how long each working actually took instead of guessing afterwards. There is also a <a href="/tools/gnosis-timer.html">gnosis timer</a> for the longer breathwork and drumming cycles.',
        'Two mistakes spoil most first attempts. The first is charging while doubting the shape — if you think it is ugly or badly drawn, you charge doubt. The second is charging the same sigil repeatedly because you are not sure it took. One clean charging, then use it, is the correct pattern.',
        'If you build sigils often enough to feel the difference, the Android app is worth it: <a href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs"><strong>Chaos Sigil Generator is $3.99, one-time, no subscription</strong></a>. It adds encrypted sigils, six alphabet sets including runic, Hebrew, Cyrillic and Arabic, plus a saved library. For a single sigil it is overkill, and the free maker covers that.'
      ]],
      ['records', 'How to keep a record that makes the method work', [
        'The difference between a practice that improves and one that wanders is a record. A sigil book is not mystical bookkeeping; it is how you learn which statements worked, which shapes read clearly, and how long charging actually took.',
        'Keep three columns and nothing more: the statement as written, the sigil, and what happened afterwards. Date the last column. Review the book monthly and you will notice patterns — that sigils with seven strokes read faster than those with fourteen, that money work tends to need re-charging after a fortnight, that the words you dropped mattered more than you thought.',
        [
          '<strong>Write the statement, not the intention.</strong> "Rent paid" is a fact to charge. "Become wealthy" is a mood.',
          '<strong>Sketch, do not photograph.</strong> A hand copy is a memory anchor.',
          '<strong>Note the date you forgot the drawing.</strong> That is the real start of the working.',
          '<strong>Note the first sign.</strong> Even "nothing happened for nine days" is data.',
          '<strong>Review monthly.</strong> Ten minutes, then add the sigil to your next charging if it worked.'
        ],
        'The same discipline is what separates the apps that earn their price from the ones that do not. <a href="https://play.google.com/store/apps/developer?id=Cha0smagick+Labs"><strong>NOCTEM is $14.99</strong></a> includes a saved library for long projects, and the free <a href="/tools/digital-grimoire-organizer.html">digital grimoire organiser</a> does the same job in the browser if you would rather not install anything.'
      ]]
    ],
    faqExtra: [
      ['Is a sigil maker just a drawing app?', 'A drawing app gives you a canvas. A sigil maker does the reduction for you: it strips the statement to its intent letters and closes the shape without a pen lift. That step is the method, and it is the part beginners spend the most time learning. The free tools on this site do it for you with no account.'],
      ['Can I make a sigil for someone else?', 'Yes. The statement is what matters, not who holds the paper. What does not work is making the sigil and handing it over unread: the forget-it step has to be yours for the working to hold, so let the person redraw it from your description or give them the statement instead.'],
      ['Does the sigil have to be redrawn every time?', 'Redrawing is a mnemonic, not a rule. Some practitioners keep one drawing and charge it repeatedly; others destroy it after the forgetting step and redraw whenever the working is due. Redrawing each time costs you ten seconds and works more reliably for beginners.'],
      ['What if I cannot draw straight lines?', 'Then do not draw freehand. Use the online generator, which lays the letters on a consistent path, or trace on graph paper with a ruler. A slightly imperfect closed shape performs exactly as well as a beautiful one; the only real failure is an open shape, because an open figure does not hold the charge.']
    ]
  },
  {
    slug: 'goetic-sigil.html',
    tldr: [
      'A goetic sigil is the written seal of one of the 72 spirits of the Goetia, drawn so it can be carried instead of read.',
      'Draw it by taking the spirit name and its office, stripping to intent letters, and closing the figure in one stroke. The free <a href="/tools/goetic-spirit-selector.html">Goetic Spirit Selector</a> tells you which spirit fits the job before you start.',
      'Invocation needs three rules: get the name exactly right, do not attempt a name you cannot pronounce, and never work a spirit you have not read about first.',
      'Arcana Goetia on Google Play is $3.99, one-time, and carries the full grimoire plus the sigil generator so you are not reading a 400-year-old PDF to get the names right.'
    ],
    deep: [
      ['naming', 'Getting the name right before anything else', [
        'Almost every failed goetic working fails at the same step: the name was wrong. The Goetia gives Latin names with precise spellings, and the popular transliterations circulate with variants that are not interchangeable. Zazel and Zazel are not the same office. Botis and Both are not the same spirit.',
        'The rule is simple and it is not negotiable: copy the name from a reliable edition, not from a forum post or a translation you found once. Arcana Goetia carries the names in their standard form alongside the office each one holds, which removes the most common source of error at the point where people actually need it.',
        'The second error is drawing before you know the spirit. The selection comes first. Different spirits hold different offices — one for money, one for love, one for protection, one for knowledge, one for loss — and working the wrong one is how a beginner ends up with an unexplained series of failures. The <a href="/tools/goetic-spirit-selector.html">free selector</a> filters the 72 by purpose in a few seconds.',
        'Once you have the name and the office, the sigil is the easy part. The difficult part is whether the working matches the office.'
      ]],
      ['variants', 'The three drawings people confuse', [
        'Three drawings circulate for goetic spirits and they are not interchangeable, which is why search results contradict each other.',
        'The <strong>name sigil</strong> uses the spirit name reduced to intent letters. This is the standard goetic method and the one every serious grimoire shows. It is what the free maker produces.',
        'The <strong>seal sigil</strong> is the older planetary form: the name is reduced further to its alphabet numbers, and the numbers are drawn as planetary glyphs. It is more elaborate and easier to get wrong, so it suits a second working rather than a first one.',
        'The <strong>mark sigil</strong> is a single abstract figure a practitioner invents for the spirit and then keeps constant. It is efficient once established because you no longer redraw the name, but you have to actually build the record to use it.',
        'Whichever you choose, the mechanics are the same: reduce the statement to its letters, draw without lifting the pen, close the figure, then forget the drawing. The goetic office does the rest.'
      ]],
      ['practice', 'What an actual goetic working looks like', [
        'A working that produces results follows a fixed order and takes about fifteen minutes. This is the shape most practitioners converge on, and it is short enough that you can run it while the question is still fresh.',
        [
          '<strong>1. Define the office, not the wish.</strong> "Love" is a mood. "A partner who answers when I write" is a fact you can check.',
          '<strong>2. Select the spirit whose office covers it.</strong> Use the free selector, then read the office in a real edition before you commit.',
          '<strong>3. Draw the sigil.</strong> Name reduced to intent letters, one stroke, closed figure.',
          '<strong>4. Charge it.</strong> Statement in mind, not the drawing. Thirty seconds minimum, or a full gnosis cycle for a big working. The <a href="/tools/sigil-charging-timer.html">charging timer</a> keeps the count honest.',
          '<strong>5. Forget the drawing.</strong> Put the paper away, close the book, and do not look at it again while the working is live.',
          '<strong>6. Stop signalling.</strong> No repeated checking, no "did it work yet" rituals. The enquiry itself is usually the thing breaking the working.',
          '<strong>7. Record the date.</strong> Note when the sigil was drawn so you can charge again on the correct cycle instead of daily.'
        ],
        'That last point is where beginners lose most of the ground. Re-charging every day because nothing has happened yet is the single most common reason a goetic working stalls. The honest default is: charge once, wait the period that fits the office, then reassess. Two weeks for a love working, a month for money. If nothing has moved by then, the usual problem is the office, not the ritual.',
        'This is exactly why a real grimoire matters more than a sigil generator. The generator draws the figure in four seconds. What you need is the office description, the day and night attribution, and the name in a form you can trust. That is the argument for the $3.99 app rather than the free tool, and it is worth being honest about: if you are going to work with the Goetia seriously, you will eventually pay for a proper edition anyway.'
      ]]
    ],
    faqExtra: [
      ['Is drawing a goetic sigil the same as summoning the spirit?', 'No, and the difference matters. Drawing and charging a sigil is a way of addressing a spirit — it opens the channel and carries your intent. Full invocation, with the order of offices and the response asked for, is a different and longer act. Most practitioners treat the sigil as the standing part of the practice and the invocation as the occasional event.'],
      ['Can I work a spirit without reading the grimoire?', 'Technically you can draw the sigil, but you should not. Without the office you do not know what you are asking for, and without the name in its standard form the address does not land. The standard names are public domain, but the editions are not always free, which is why a $3.99 app carrying the full grimoire is a cheaper entry point than hunting PDFs.'],
      ['What if nothing happens after a goetic working?', 'Nothing happening is a normal outcome, not proof the method is broken. Check four things in order: the office matched the request, the name was spelled from a real edition, the sigil was closed, and the enquiry was stopped rather than repeated. If all four check out, the usual answer is timing — charge again on the cycle that fits the office instead of daily.'],
      ['Do I need to keep the sigil visible?', 'No. The opposite is the method: forgetting the drawing is what releases it, and keeping it in sight while you wait is the most common way people accidentally break their own working. Store it, date it, and put it away.']
    ]
  },
  {
    slug: 'astrology-app-reviews.html',
    tldr: [
      'La mayoria de las apps de astrologia que dominan las tiendas cobran una suscripcion de 30 a 60 dolares al ano por funciones que puedes calcular gratis en el navegador.',
      'Solo hay tres razones reales para pagar una app: precision de efemerides, modo avion y un mazo de tarot completo offline.',
      'Astral Lab ($6.99, pago unico) es la unica de la lista que calcula con VSOP87 y no tiene suscripcion.',
      'Si tu pregunta es "que signo soy", ninguna app te va a decir nada que un gratis no te diga mejor.'
    ],
    deep: [
      ['offline', 'What actually makes an astrology app worth paying for', [
        'Un buen programa de astrologia hace tres cosas: calcula posiciones planetarias, las cruza en aspectos y las dibuja en una carta legible. Las tres se pueden hacer gratis, pero la primera es la unica donde la calidad de la libreria importa de verdad.',
        'La posicion de un planeta sale de una efemeride: una tabla de donde estaba cada cuerpo celeste dia a dia. Las hay de tres Precision. La mayoria de apps usan la version abreviada, calculada con promedios. Las mejores usan VSOP87, que es la teoria planetary completa publicada por el Observatorio de Paris.',
        'La diferencia no es academica. En una carta natal el error se nota cuando un planeta cae justo sobre el borde de un signo o de una casa: el signo entero puede cambiar. Con promedios, tu Ascendente puede quedar dos signos desplazado.',
        'Por eso, antes de comparar caracteristicas, compara la efemeride que usa la app. Si no la dice en la ficha tecnica, asumeme la peor.'
      ], '|What to check|Why it matters|', '|Ephemeris used|A first planet on the edge of a sign can shift the whole reading|', '|Offline mode|Your chart works on a plane, in a ritual, or when the server is down|', '|One-time vs subscription|A $6.99 purchase you own beats a $60 annual fee you rent|', '|Aspect grid|See every angle at once instead of hunting for it|', '|Retrograde calendar|Know before you plan, not after|', '|Export to PDF|Bring the chart to your grimoire journal|'],
      ['store', 'What the Play Store listings actually promise (and hide)', [
        'Las fichas de la tienda dicen muy poco y esconden lo importante. En las doce apps de astrologia que revisamos, la mayoria no menciona quePrecision de efemeride usa, si funciona sin conexion, ni si hay suscripcion oculta.',
        'Tres señales de alerta en cualquier ficha: un boton "Desbloquear" sin precio visible, un "Subscribe" en la pantalla de inicio, y un precio de suscripcion tan bajo que parece un anzuelo. Las tres aparecen en la mayoria de la categoria.',
        'La senal positiva es la opuesta: un precio unico visible en la propia ficha, sin asteriscos, y un boton que dice "Comprar" y no "Empezar prueba". Es exactamente lo que hacen las apps de este ecosistema.'
      ], '|Signal in the listing|What it actually tells you|', '|"Free" with an unlock button|A trial disguised as free|', '|Weekly or monthly subscription|Monthly bait: the annual price is 5 to 7 times the monthly one|', '|"Offline" not mentioned anywhere|Your chart dies when the server does|', '|One clear purchase price, no asterisks|An app you own|'],
      ['privacy', 'Why we do not read your birth data from a server', [
        'Tu fecha, hora y lugar de nacimiento son datos que identifican a una persona concreta en cualquier combinacion, y muchos servidores de astrologia los guardan para siempre porque son el producto.',
        'Una app que calcula en tu telefono no tiene por que enviar nada. En Astral Lab el calculo ocurre en el dispositivo; el unico dato que sale es el evento de analitica anonimo.',
        'Si te preocupa esto de forma concreta, elige una app que funcione sin cuenta. La nuestra no te pide registro ni correo electronico en ningun punto.'
      ]]
    ],
    casesTitle: 'Which one fits your actual question',
    cases: [
      ['|Your question|What to use|Cost|', '|"What sign am I?"|astrology-sign-calculator, then rise with rising-sign-calculator|Free|', '|"Full chart with real aspects"|Astral Lab|$6.99 once|', '|"Chart on the moon-phase you are ritualing for"|moon-phase-calendar + planetary-hours|Free|', '|"Is Mercury retrograde?"|planetary-retrograde-calendar|Free|', '|"Tarot reading, no birth data"|Unofficial Rider Waite Tarot|$9.99 once|', '|"Dreams, not stars"|Dream Machine or Lucid Dream|$3.99 to $9.99 once|', '|"Psi test for friends"|Psi Gym|$3.99 once|']
    ],
    faqExtra: [
      ['Is there a free astrology app that does not need an account?', 'Yes. astrology-sign-calculator, rising-sign-calculator and full-birth-chart work entirely in the browser with no signup, and the charts are calculated on your device.'],
      ['Why do most apps charge $60 a year?', 'Because the subscription is the business model, not the software. The calculation is the cheap part; the recurring revenue comes from features that would cost almost nothing to ship once.'],
      ['Which app in this list is the most accurate?', 'Astral Lab. It is the only one that states it uses VSOP87 planetary theory rather than mean positions, which is the difference between a chart that holds up and one that shifts a sign at the edges. See our ephemeris accuracy page for the full explanation.'],
      ['Do I need my exact birth time?', 'For the Ascendant and the houses, yes. Without a time you still get your Sun and Moon sign, but the rest of the chart is an estimate. Most people find their birth time on a birth certificate rather than guessing.'],
      ['Is a $6.99 app really better than a free website?', 'Different, not better. The free tools are enough for a Sun sign, a Moon sign and a rough chart. The paid app adds aspect precision, a printable chart and offline use. It is worth it if you read charts weekly, not if you read one a year.']
    ]
  },
  {
    slug: 'birth-chart-app.html',
    tldr: [
      'Una carta natal gratuita sirve para el signo solar y poco mas. La precision de la hora de nacimiento solo aparece cuando el Ascendente importa.',
      'El error mas comun no es de la app: es de la hora. Sin la hora exacta, la casa ascendente es una suposicion.',
      'El factor que mas cambia el resultado es la efemeride: VSOP87 frente a posiciones medias cambia hasta dos signos en los bordes.',
      'Astral Lab ($6.99, pago unico) calcula VSOP87 en el dispositivo, con rejilla de aspectos y sin suscripcion.'
    ],
    deep: [
      ['time', 'Get your birth time right before you blame the app', [
        'Si tu hora de nacimiento se redondea a la hora mas cercana, tu Ascendente puede moverse hasta quince grados: media casa. Media casa en el eje de las casas es suficiente para que un planeta cambie de signo.',
        'La hora mas comun que se registra mal es la de un nacimiento cerca de medianoche. Un registro de 23:52 frente a 00:08 es la diferencia entre un signo ascendente y otro.',
        'Tres fuentes, en este orden: el certificado de nacimiento, el registro hospitalario, y como ultima opcion la hora aproximada que te da un familiar. Anota tambien la zona horaria y si habia horario de verano, porque eso desplaza el reloj.'
      ], '|Source|Reliability|', '|Birth certificate|Exact, includes the timezone|', '|Hospital record|Exact, usually same day|', '|A relative remembering "around noon"|Fine for the Sun sign, useless for the Ascendant|', '|A site that asks only the date|Only calculates Sun and Moon|'],
      ['method', 'Mean positions, VSOP87, and why the difference is visible', [
        'Las efemerides se calculan de dos formas. Las posiciones medias usan orbitas circulares promediadas, rapidas, con error de hasta un grado. VSOP87 integra la teoria planetaria completa y baja de esa a centimas de grado.',
        'Un grado no parece nada hasta que te fijas en que el zodiaco son 30 grados por signo. Un grado es doce minutos de tiempo. La conclusion es distinta.',
        'El caso peor es el Ascendente: se mueve un grado cada cuatro minutos de tiempo. Un error de dos grados son ocho minutos de reloj, y en un borde de signo eso es un signo entero equivocado.',
        'En una carta con planetas cerca de los limites, la diferencia se ve. En una carta con planetas bien puestos, ninguna de las dos te va a dar una respuesta diferente. Ahi la decision no importa, y conviene decirlo claro para no vender humo.'
      ], '|Ephemeris|Error|Matters most for|', '|Mean positions (abbreviated)|Up to 1 degree|Ascendants and planets near sign edges|', '|VSOP87|Less than 0.01 degree|Everything, but only visibly at the edges|', '|Swiss Ephemeris (library)|Depends on the build used|If the app says which one, ask why|'],
      ['reading', 'What to look at first in your own chart', [
        'El orden de lectura correcto evita el 90 por ciento de las lecturas superficiales. Empieza por el Sol: describe lo que haces de forma visible. Luego la Luna: como lo llevas por dentro. Tercero el Ascendente: como te presentas al mundo.',
        'La cuarta posicion es el Parte de Fortuna, que en la tradicion hellenistica es el punto mas util y casi nunca se muestra. Se calcula con la relacion entre el Sol y el Ascendente.',
        'Los aspectos entre planetas son lo que convierte una lista de posiciones en una lectura. Trigo y Marte en trígono es una cosa; en quintiles es otra muy distinta, y la mayoria de las apps gratuitas no distingue entre las dos.'
      ], '|Position|What it describes|', '|Sun|Visible behaviour, purpose|', '|Moon|Internal emotional life, needs|', '|Ascendant|How you approach the world, appearance|', '|Mercury|How you think and speak|', '|Venus|What you value and how you relate|', '|Mars|How you assert and act|', '|Part of Fortune|Bodily wellbeing, often omitted|']
    ],
    casesTitle: 'Free first, or pay first',
    cases: [
      ['|Your situation|Best route|', '|"I just want my Sun sign"|astrology-sign-calculator, free, no signup|', '|"Sun, Moon and a rough chart"|full-birth-chart, free, on device|', '|"My Ascendant looks wrong"|Check the birth time first, then compare in Astral Lab|', '|"Aspects and a printable chart"|Astral Lab, $6.99 once, VSOP87|', '|"Retrogrades for planning"|planetary-retrograde-calendar, free|', '|"The moment for a ritual"|planetary-hours-planner, free|', '|"Nothing, I just want the free chart"|full-birth-chart and rise with rising-sign-calculator|']
    ],
    faqExtra: [
      ['Is a birth chart app accurate?', 'It is as accurate as its ephemeris and your birth time. A chart calculated with VSOP87 and an exact birth time is reliable; a chart calculated with mean positions and a rounded time can be wrong by a whole sign.'],
      ['What if I do not know my birth time?', 'You still get your Sun sign, and your Moon sign if you know it approximately. The Ascendant and the houses need an exact time. Try the hospital record or a birth certificate before you give up on it.'],
      ['Do I need to give my birth data to a website?', 'Not for the free tools here. full-birth-chart and astrology-sign-calculator calculate in your browser and send nothing. This is the reason we built them as web tools instead of only as apps.'],
      ['What is VSOP87?', 'A complete mathematical theory of planetary motion published by the Paris Observatory in 1988. Astrology programs that use it produce positions accurate to fractions of a degree instead of to a degree.'],
      ['Should I pay for a chart app or compute it free?', 'Compute it free first. If the free chart already answers your question, you do not need the app. Astral Lab is worth $6.99 when you read charts weekly, want aspects, or want the chart to work offline.']
    ]
  },
  {
    slug: 'horoscope-app.html',
    tldr: [
      'La lectura de horoscopo diaria no necesita app: las 62 herramientas de este sitio cubren la parte astronomica gratis y sin registro.',
      'El problema de las apps de horoscopo no es la prediccion, es el cobro: de 30 a 60 dolares al ano por un texto generado.',
      'Si tu interes es la luna y los ciclos, el Calendario Lunar gratis es mejor que cualquier app de horoscopo.',
      'Pagar solo tiene sentido si quieres predicciones personalizadas a partir de tu carta, y no un texto de hoy.'
    ],
    deep: [
      ['business', 'What subscription horoscope apps actually sell', [
        'Una app de horoscopo no calcula la carta natal de forma relevante en su version gratuita: ofrece un texto corto y luego cobra por mas largo. El texto no mejora con el nivel de pago, solo se alarga.',
        'La lectura gratuita de la mayoria de apps sale de una plantilla con el signo substituted. La de pago sale de la misma plantilla con mas adjetivos. Ninguna de las dos consulta los tránsitos con precision.',
        'El modelo de negocio es predecible: acquisition barata, suscripcion mensual, cancelacion en el segundo mes. El rango real que se ve en la categoria es de 30 a 60 dolares al año, y algunas llegan a 470 al año en planes "premium".',
        'Lo que si es informacion real en una app de pago son los tránsitos: que planetas aspectan tu carta esta semana. Eso lo puedes calcular tu mismo con planetary-retrograde-calendar y planetary-hours-planner, gratis.'
      ], '|What you get|Free tier|Paid tier|', '|Daily text|One paragraph|Three paragraphs, same template|', '|Real transits|No|Yes, in the good apps|', '|Birth chart|Basic or none|Full|', '|Cost|0|30 to 470 dollars a year|', '|Cancel path|Hard to find|Usually hidden in settings|'],
      ['astro', 'The part that is actually astronomical (and free)', [
        'Lo que hace que un dia "sea de Leo" es el Sol en la constellation de Leo, y eso es un calculo, no una opinion. La luna tambien importa: cambia el signo que se te atribuye en la practica tradicional cada dos dias y medio.',
        'Este sitio calcula las fases lunares con datos en tiempo real, con la hora de luna llena y la fecha de la proxima luna nueva, sin cuenta ni publicidad.',
        'Tambien estan los seis signos calculados al instante, y las horas planetarias, que son el equivalente mas cercano que existe al "horoscopo del dia": dicen que hora es buena para empezar algo y no que te pasara algo.',
        'Ninguna app de horoscopo te da eso con la misma precision y sin pedirte la tarjeta.'
      ], '|Tool|What it tells you|', '|lunar-phase|The current phase, illumination, next full and new moon|', '|moon-phase-calendar|A calendar view for planning rituals|', '|astrology-sign-calculator|Sun, Moon and Ascendant for any instant|', '|planetary-hours|Which planet rules the hour, right now|', '|planetary-retrograde-calendar|Every upcoming station|', '|moon-voc|When the Moon is void of course, traditionally useless for launching|'],
      ['honest', 'When a horoscope app is the right answer', [
        'Hay un caso legitimo: quieres que alguien te diga algo sobre tu carta, y leerla tu mismo te resulta agotador. Entonces una lectura pagada tiene sentido, con dos condiciones: que use tu carta natal real, y que puedas cancelar cuando quieras.',
        'Hay un segundo caso: trackers de habitos. Algunas apps de horoscopo son disfraz de diario, y en ese caso el valor esta en escribir, no en la prediccion. Para eso esta el diario de suenos de este ecosistema.',
        'Y hay un tercero, mas raro: la notificacion diaria como recordatorio. Si te funciona como ritual de anclaje, el problema no es la app sino el precio que pagas por ella.'
      ]]
    ],
    casesTitle: 'Free tool for each horoscope need',
    cases: [
      ['|What you want|Tool|Cost|', '|"Today I am a what sign"|astrology-sign-calculator|Free|', '|"What moon is this"|lunar-phase, moon-phase-calendar|Free|', '|"Is Mercury retrograde"|planetary-retrograde-calendar|Free|', '|"When can I start something"|planetary-hours-planner|Free|', '|"What does my chart say about love"|Astral Lab, then your own reading|$6.99 once|', '|"Something to read every morning"|Any of the above, plus a journal|free|', '|"A person to read it for me"|A real reader, not a subscription|varies|']
    ],
    faqExtra: [
      ['Is there a free horoscope app without a subscription?', 'The tools here are free and need no app or account: lunar-phase, moon-phase-calendar, astrology-sign-calculator and planetary-hours. They give you the astronomical facts the horoscope is built on.'],
      ['Why do horoscope apps hide the cancel button?', 'Because most subscriptions are never cancelled by accident. Retention is the whole model. If you subscribe, set a calendar reminder the day you sign up.'],
      ['Is a horoscope app better than a free website?', 'Only if it personalises from your birth chart. Most of them serve the same text to everyone with the same Sun sign, which a free site can do just as well.'],
      ['What is the cheapest way to track the moon?', 'lunar-phase and moon-phase-calendar, free, no signup, real-time data. The Lunar Phase Calculator app at $3.99 is the same thing without a browser, if you want it on your phone permanently.'],
      ['Can I get a personalised reading without paying every year?', 'Yes. Buy the chart once with Astral Lab ($6.99, VSOP87, no subscription) and read it yourself. Paying annually for a horoscope is only justified if you want someone else to interpret it for you.']
    ]
  },
  {
    slug: 'ephemeris-accuracy.html',
    tldr: [
      'Most "wrong" birth charts are wrong because of the birth time, not the software.',
      'Mean positions and VSOP87 differ by minutes of arc, which is enough to move a house cusp.',
      'NASA JPL and Swiss Ephemeris are both excellent; they use different models and different licences.',
      'You can check your own chart against two independent sources in under five minutes.',
      'Astral Lab ($6.99, one time) computes VSOP87 instead of rounding to whole degrees.'
    ],
    deep: [
      ['precision', 'What "accurate" actually means in a birth chart', [
        'When people say a chart is inaccurate, they almost always mean one of two different things. The first is a data error: the software took the wrong time, the wrong place, or applied the wrong timezone. That is a bug and it is fixable. The second is a method difference: two programs use different planetary models and land on positions that differ by a fraction of a degree. Neither is a bug.',
        'The magnitude matters more than most people realise. The Moon moves about 13 degrees per day, roughly half a degree per hour. An error of two hours in the birth time shifts the Moon by a full degree, which can move it into a different sign. The Ascendant moves about one degree every four minutes, so it is the fastest point in the chart and the first to break when the time is uncertain.',
        'House cusps amplify the problem. Many programs round to whole degrees or to whole minutes of arc before plotting cusps. If a cusp lands at 29 degrees and 58 minutes and gets rounded to 0 degrees 00, the house changes. This single rounding step is the most common source of a chart that "looks wrong" to an experienced reader.',
        'Positions of the outer planets are far less sensitive. Uranus, Neptune and Pluto drift so slowly that a birth time error of an hour moves them by a fraction of an arc-minute. If your birth time is uncertain, the slow planets are still reliable. Planets with a high daily motion, meaning the Moon, the Sun, Mercury and Venus, are the ones worth being careful about.'
      ]],
      ['sources', 'Which ephemeris to trust, and why the NASA and Swiss debate is not really a debate', [
        'The JPL ephemerides are the reference solution produced by NASA Jet Propulsion Laboratory. The current high-precision model is called DE440. It is fitted to radar observations of the planets and to historical observations going back centuries. JPL publishes it openly and free, and it is the input that most serious astronomy software ends up using.',
        'Swiss Ephemeris is a commercial library by Astrodienst. It is not a rival model; it is an implementation. It uses JPL data underneath for the most part and adds a very large set of traditional and historical quantities that JPL does not publish, such as planetary nodes in several definitions, the Part of Fortune, house systems beyond Placidus, and the full catalogue of fixed stars with their names.',
        'Meeus algorithms are the third option you will meet. Jean Meeus published astronomical algorithms in books that anyone can read and implement. They are accurate enough for astrology, typically to a few arc-seconds, and they are completely free to use with no licence question. This is why many small astrology apps use them.',
        'The debate that circulates online treats these as rivals with different accuracy. In practice they agree far more often than the arguments suggest. When two programs give you different Ascendants, the cause is almost always house system or timezone, not ephemeris. Check those two before you suspect the maths.'
      ], [
        '|Source|Model|Precision|What it adds|Licence|',
        '|JPL DE440 (NASA)|Fitted to radar and historical data|Very high|Nothing extra, pure reference data|Free, public domain|',
        '|Swiss Ephemeris|JPL data plus Astrodienst extensions|High|Nodes, Part of Fortune, fixed stars, extra house systems|Commercial, paid library|',
        '|Meeus algorithms|Analytical series in printed form|Arc-second level|Nothing extra|Free to implement|',
        '|Rounded "mean position"|Planets averaged over their orbit|Lowest|Round numbers that are easy to compute|Free but lossy|',
        '|Online free chart sites|Varies, often Meeus or rounded|Unknown|Usually a lead-in to a subscription|Varies|'
      ]],
      ['check', 'How to check your own chart in five minutes', [
        'You do not need to buy anything to audit a chart. The method is comparison: compute the same birth data in two independent places and look at where they disagree.',
        'Start with the Ascendant, because it is the fastest-moving point and the most diagnostic. Compute the chart twice. If the two Ascendants differ by more than two degrees, the problem is your birth time or your timezone, not the ephemeris. If they differ by less than a degree, your time is fine and any remaining difference is rounding.',
        'Then check the Moon. The Moon moves so fast that it is the second fastest test. Two charts that agree on the Ascendant but put the Moon in different signs usually differ in how they treat daylight saving time.',
        'Finally check whether the slow planets agree. If Uranus, Neptune and Pluto match between two programs, you have confirmed that both are using real ephemeris data and that the disagreement is a rounding artefact rather than a modelling difference.',
        'Only after all three checks should you suspect the ephemeris itself. In my experience that is the rarest cause by a wide margin.'
      ], [
        ['Compare your Ascendant in two free charts. More than two degrees apart means your birth time or timezone is wrong, not the software.', '/tools/full-birth-chart.html plus any second free calculator'],
        ['Compare the Moon position. If the charts agree on the Ascendant but not the Moon, check daylight saving time for the year you were born.', '/tools/full-birth-chart.html'],
        ['Check the slow planets. If Uranus, Neptune and Pluto agree, both programs use real ephemeris data and the difference is rounding.', '/tools/planetary-retrograde-calendar.html'],
        ['Check the house system. Equal houses and Placidus give different cusps from the same data; this is a setting, not an error.', '/tools/rising-sign-calculator.html'],
        ['If your birth time is genuinely unknown, treat the Moon and the Ascendant as a range rather than a point, and rely on the slow planets.', '/tools/astrology-sign-calculator.html'],
        ['For a chart you will keep and read repeatedly, use one that computes VSOP87 and does not round cusps.', 'Astral Lab, $6.99 one time']
      ]]
    ],
    casesTitle: 'Symptom to cause to tool',
    cases: [
      ['|Symptom|Most likely cause|Where to look|', '|Ascendant differs by more than 2 degrees between programs|Birth time or timezone error|Two free charts, compare the Ascendant|', '|Charts agree on Ascendant but not Moon|Daylight saving applied wrongly|Compare Moon position in two charts|', '|Planets match but house cusps look wrong|Rounding to whole degrees|Check house system, then try VSOP87|', '|A planet appears in the wrong sign only in one program|House system mismatch, not ephemeris|Switch between Placidus and Equal|', '|Whole chart shifts by about one sign|All four birth inputs are wrong|Time, date, place and timezone together|', '|You only need the slow planets|Birth time uncertainty is fine|Use Uranus, Neptune and Pluto as the reliable core|']
    ],
    faqExtra: [
      ['Is my birth chart wrong?', 'Almost never because of the software. In order of likelihood the error is the birth time, the timezone, the daylight saving flag, then the house system. Only after all four are correct is it worth suspecting the ephemeris.'],
      ['Which is more accurate, NASA JPL or Swiss Ephemeris?', 'For the raw planetary positions they agree closely. Swiss Ephemeris adds traditional quantities that JPL does not publish, such as the Part of Fortune and named fixed stars. If you need those, Swiss is the only option. If you need pure modern planets, either one is fine.'],
      ['Do I need my birth time to the minute?', 'For the Ascendant and the house cusps, yes. For the Sun sign and the slow planets, no. If you only know the hour, you can still build a usable chart, but treat the Ascendant as approximate.'],
      ['What is VSOP87?', 'VSOP87 is a semi-analytic theory of planetary motion that models each planet as a long series of periodic terms. It is more precise than averaging a planet over its orbit, and it is what apps that advertise degree-accurate charts are usually using.'],
      ['Does Astral Lab use VSOP87?', 'Yes. Astral Lab ($6.99, one time purchase, no subscription) computes VSOP87 planetary positions and real-time transits, which is why its ascendant and cusp positions stay stable instead of drifting by rounding.']
    ]
  },
  {
    slug: 'i-ching-app.html',
    tldr: [
      'You do not need an app to cast an I Ching reading; you need three coins and a clear question.',
      'The three-coin method is deterministic: same coins, same result, every time.',
      'What an app adds is a saved history, instant interpretation and no fiddling with a page.',
      'The free tools here cover the whole method, including changing lines.',
      'I Ching Oracle ($3.99, one time) adds history and works with no connection at all.'
    ],
    deep: [
      ['coins', 'The three-coin method, exactly how it works', [
        'Three coins, two faces. The classic convention assigns 3 to the inscribed side and 2 to the plain side. Toss all three and add the values. The sum can only be 6, 7, 8 or 9, and each sum has a fixed meaning.',
        'A sum of 6 is an old yin line: broken and changing. It means the situation is at its end and is about to move. A sum of 7 is a young yang line: solid and stable. A sum of 8 is a young yin line: broken but stable, meaning the influence is present but not yet acting. A sum of 9 is an old yang line: solid and changing, at its peak and about to weaken.',
        'The changing lines are the whole point of the method. When a line is changing you draw it as solid or broken with an extra mark beside it. Stack the six lines from the bottom up to build your primary hexagram. Then flip each changing line and rebuild to get your opposite hexagram. The lines that changed are read first and individually, because they describe the mechanism of the change.',
        'Three coins give you every one of the 64 hexagrams with a fair probability and no repetition bias, which is why the method feels cleaner than drawing yarrow stalks. The sums are not equally likely in practice because the coins are not perfectly balanced, but the bias is small enough that practitioners ignore it.'
      ], [
        '|Toss|Sum|Line|Name|Meaning|',
        '|TTT|9|Old yang|Solid, changing|Yang at its peak, about to weaken into yin|',
        '|TTH or THT or HTT|8|Young yin|Broken, stable|Yin present but not yet acting|',
        '|THH or HTH or HHT|7|Young yang|Solid, stable|Yang growing, nothing special happening|',
        '|HHH|6|Old yin|Broken, changing|Yin at its peak, about to change into yang|'
      ]],
      ['reading', 'How to read the hexagram once you have it', [
        'A hexagram is read as two trigrams stacked. The lower trigram is the situation as it is now, formed by the first three lines from the bottom. The upper trigram is what is moving it, formed by the top three. Reading the pair tells you the dynamic, not a verdict.',
        'Beyond the primary hexagram there are three derived hexagrams, and each answers a different question. The nuclear hexagram, formed by the middle two lines of each trigram, describes the internal situation and what is not yet visible. The inverse hexagram, where you swap yin and yang in every line, describes where the situation is heading if nothing changes. And the opposite hexagram, built from your changing lines, is the specific outcome.',
        'The ten wings are the interpretive texts traditionally attached to each hexagram. The Great Image describes the whole pattern. The Judgement gives the overall verdict. The Image describes the ideal. The six line texts describe the six stages of the process, and most of the nuance lives in the specific line you land on rather than in the hexagram as a whole.',
        'This is why the line texts matter. Two people casting the same hexagram with a different changing line get materially different readings, because they are reading different stages of the same process.'
      ], [
        '|Hexagram|Formed from|What it answers|', '|Primary|Bottom line up|Situation right now|', '|Nuclear|Middle two lines of each trigram|What is happening below the surface|', '|Inverse|Every line flipped|Where this goes if nothing changes|', '|Opposite|Changing lines flipped|Specific outcome of the change|',
        '|Line texts|Each of the six lines|Six stages of the process, read one at a time|'
      ]],
      ['keeping', 'Getting more out of every cast', [
        'The single biggest improvement in I Ching practice is writing the question down before you throw the coins, and writing what you predicted afterwards. Ten minutes of that turns a random sequence into a trackable record.',
        'Keep one line per reading: date, the question in your own words, the hexagram names, the changing line, and what happened. After a year you will have a much clearer sense of which hexagrams actually show up for you, and whether your reading accuracy depends on the question or on your state.',
        'Cast once and read, then cast again if you genuinely do not know what to do. Casting repeatedly with the same question teaches you nothing, because you are reading your own impatience rather than the change.',
        'If you work with the method regularly, a saved history is worth more than a prettier interface. That is the only thing a paid app genuinely adds over a free tool, and it is why I Ching Oracle costs $3.99 once rather than a subscription.'
      ], [
        ['Cast a reading for a yes or no question.', '/tools/iching.html'],
        ['See the changing lines drawn as they come.', '/tools/iching-changing-lines.html'],
        ['Choose the right moment to start something.', '/tools/planetary-hours.html'],
        ['Read your library of recorded castings over time.', 'I Ching Oracle, $3.99 one time']
      ]]
    ],
    casesTitle: 'What people use the I Ching for',
    cases: [
      ['|Question type|Cast for|Read first|', '|"Should I take this job"|Hexagram 1 and 4|Crossing line in the third place|', '|"Is this relationship honest"|Hexagram 1 and 6|The second line, which governs the inner state|', '|"When should I start"|Hexagram 1 and 2|The first line, which governs beginnings|', '|"What am I missing"|Hexagram 4 and 5|Nuclear hexagram, for the hidden situation|', '|"Is this safe to keep doing"|Hexagram 1 and 3|Third line, the one that carries the risk|', '|"What happens if I wait"|Hexagram 1 and 4|Inverse hexagram, for the drift of waiting|']
    ],
    faqExtra: [
      ['Do I really need an app to cast an I Ching reading?', 'No. The method is three coins and a question. The free tools here cast it, draw the changing lines and give the full interpretation of all 64 hexagrams, with no account and no connection required.'],
      ['How many coins do I need, and which side counts for what?', 'Three coins. The traditional convention gives 3 to the inscribed side and 2 to the plain side, and you add them up. The result can be 6, 7, 8 or 9, and each maps to one of the four line types.'],
      ['Which hexagram do I read if there are changing lines?', 'Read the primary hexagram first, then the specific changing lines one by one, because they describe the mechanism of the change. The opposite hexagram built from those lines gives the outcome.'],
      ['Can I use the I Ching every day?', 'Yes, and practitioners often do. Cast once for the day with a clear question and read it properly rather than casting repeatedly for the same question, which tends to produce noise rather than insight.'],
      ['Is it worth paying for an I Ching app?', 'Only for the saved history. I Ching Oracle ($3.99, one time, no subscription) adds a searchable record of your castings, which is the one thing a free page cannot do. Everything else is covered free here.']
    ]
  },
  {
    slug: 'celtic-cross.html',
    tldr: [
      'The Celtic Cross is ten cards in a fixed shape: one significator, a staff of four, and a crossing card.',
      'Positions one to four are the situation, five to eight are the deeper layers, nine is the final outcome.',
      'Position six, the heart of the matter, is the card most readers over-look.',
      'Free tools here build the layout and log the notes without a subscription.',
      'Unofficial Rider Waite Tarot ($9.99, one time) gives you the full deck offline.'
    ],
    deep: [
      ['layout', 'What each of the ten positions actually answers', [
        'The Celtic Cross is not ten separate cards read one after another. It is a diagram with three blocks, and the order of reading matters because each block answers a different level of the question.',
        'The first block is the crossing: card one, the heart of the matter, crossed by card two, what crosses or challenges it. Read as a pair, these two alone usually tell you what is going on.',
        'The staff is four cards going down. Card three sits above the crossing and describes the conscious basis, what you know and are working with. Card four goes below and describes the unconscious, the foundation under everything else. Together they are the vertical axis of the situation.',
        'The staff of three is the horizontal axis. Card five is the conscious goal, what you are aiming at. Card six, to the right of the crossing, is the heart of the matter in its nearest form, the thing under your nose. Card seven is yourself, your attitude and your role. Card eight is the environment, what surrounds you.',
        'Card nine, above the staff, is the final outcome. Card ten, to the right of the staff, is the culmination. Both describe where this ends up, and they sometimes disagree, which is itself information.'
      ], [
        '|Position|Name|Block|What it describes|', '|1|Heart of the matter|Crossing|The core of the situation right now|', '|2|What crosses it|Crossing|The force acting on or against you|', '|3|Conscious basis|Staff|What you know and are using|', '|4|Unconscious|Staff|The foundation under the conscious|', '|5|Conscious goal|Staff of three|What you are aiming at|', '|6|Heart, nearest|Staff of three|The thing closest and most obvious|', '|7|Yourself|Staff of three|Your attitude and role|', '|8|Environment|Staff of three|Circumstances around you|', '|9|Final outcome|Above|Where this is going|', '|10|Culmination|Right of staff|How it ends in practice|'
      ]],
      ['pairs', 'The five pairs that carry most of the reading', [
        'Reading ten cards in sequence tends to blur them. Reading five pairs keeps the structure, and each pair answers one specific question.',
        'One and six together give the tension at the centre: what is happening, and what is closest to you. Seven and eight show the exchange between your attitude and your environment, which is where most of a reading actually resolves.',
        'Two and seven, the crossing card against yourself, show the challenge in terms of your own position rather than the outside force. Three and eight, conscious basis against environment, show whether your understanding matches your circumstances. Five and ten, goal against culmination, show whether what you are aiming at is what you get.',
        'Four and nine are the pair most often misread. The unconscious foundation compared with the final outcome tells you whether the change is going in the direction of something you have not acknowledged yet, or against it.'
      ]],
      ['technique', 'Getting a clean Celtic Cross reading', [
        'Deal freehand rather than from a machine shuffle if you can, but be consistent: if you always shuffle the same way, the reading stays honest. The important thing is not the method, it is that the method does not change between readings.',
        'Reversals are optional and you should pick a convention and keep it. Traditional practice often reads the Celtic Cross with upright cards only, because ten reversed cards become unreadable. If you use reversals, record the convention in your journal so you read old spreads consistently.',
        'Number the positions before you start, and note the card as you deal it rather than trying to remember. Ten cards is the point where memory starts failing, and a mislabelled position silently corrupts the whole spread.',
        'Write one sentence per position as you go, not a full interpretation. Full interpretation belongs after the layout is complete and you can see the whole shape, which is when cross-position meaning becomes visible.'
      ], [
        ['Set up the ten positions with numbers before dealing.', '/tools/tarot-spread-builder.html'],
        ['Look up any card you do not know well.', '/tools/tarot-card-reference.html'],
        ['Log the reading with dates and your question.', '/tools/tarot-journal.html'],
        ['Read a full Rider-Waite deck offline, with no subscription.', 'Unofficial Rider Waite Tarot, $9.99 one time']
      ]]
    ],
    casesTitle: 'Celtic Cross for common questions',
    cases: [
      ['|Question type|Read first|Then check|', '|"Should I stay in this job"|Cards 1 and 2|Three and eight, whether you understand the situation|', '|"What is really going on here"|Cards 1 and 6|Position four, the unconscious basis|', '|"Will this relationship last"|Cards 2 and 7|Five against ten, goal versus outcome|', '|"What am I not seeing"|Card 4|Card 9, whether the change matches the foundation|', '|"Should I act now"|Cards 3 and 5|Two, what is crossing the situation|', '|"How will this end"|Cards 9 and 10|Card 7, your own part in it|']
    ],
    faqExtra: [
      ['How long should a Celtic Cross reading take?', 'Long enough to note one sentence per position before interpreting any of them. That takes twenty minutes for a first spread and five once the positions are familiar. Reading ten cards in the moment is where layouts get corrupted.'],
      ['Do the cards need to be reversed in a Celtic Cross?', 'Not necessarily. Many traditional readers use upright cards only for this spread, because ten reversed cards are hard to hold in mind. Either convention works as long as you record it and read your old spreads the same way.'],
      ['Which position matters most?', 'Position six, the heart of the matter in its nearest form. It sits beside the crossing and is where most readers under-look, but it is usually the closest actionable description of the situation.'],
      ['Can I use the Celtic Cross every day?', 'For deep questions, yes, but not for the small ones. This is a ten-card layout and it uses up attention; if you run it daily it stops being special and you start filling positions with what you expect instead of what is there.'],
      ['What if the reading contradicts itself?', 'Then the contradiction is the reading. Cards nine and ten disagreeing, or the conscious basis failing to match the environment, tells you the situation has not settled yet. Write down both halves instead of picking the one you prefer.']
    ]
  },
  // __PAGES__
];

const CSS = `
    .deep-tldr { background: rgba(192,160,96,.07); border-left: 4px solid var(--accent-gold, #c0a060); padding: 1.1rem 1.4rem; margin: 2rem 0; border-radius: 0 6px 6px 0; }
    .deep-tldr h2 { margin-top: 0; font-size: 1.05rem; letter-spacing: .06em; text-transform: uppercase; color: var(--accent-gold, #c0a060); }
    .deep-tldr ul { margin: .6rem 0 0; padding-left: 1.2rem; }
    .deep-tldr li { margin-bottom: .45rem; }
    .deep-author { margin: 2.5rem 0 1.5rem; padding: 1.2rem 1.4rem; border: 1px solid rgba(255,255,255,.12); border-radius: 8px; background: rgba(255,255,255,.02); }
    .deep-author h2 { margin-top: 0; font-size: 1.05rem; }
    .deep-author p { margin-bottom: .5rem; }
    .deep-case { margin: 1.6rem 0; }
    .deep-case h3 { margin-bottom: .4rem; }
`;

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function section([id, h2, ...parts]) {
  let out = `<section id="${id}">\n<h2>${h2}</h2>\n`;
  for (const p of parts) {
    if (Array.isArray(p)) {
      out += '<ul>\n' + p.map((li) => `  <li>${li}</li>`).join('\n') + '\n</ul>\n';
    } else if (p.startsWith('|')) {
      const rows = p.split('\n').filter((r) => r.trim());
      const head = rows[0].slice(1).split('|').map((c) => c.trim());
      const body = rows.slice(1).map((r) => r.slice(1).split('|').map((c) => c.trim()));
      out += '<table>\n<thead><tr>' + head.map((c) => `<th>${c}</th>`).join('') + '</tr></thead>\n<tbody>\n';
      out += body.map((r) => '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>').join('\n');
      out += '\n</tbody>\n</table>\n';
    } else {
      out += `<p>${p}</p>\n`;
    }
  }
  return out + '</section>\n';
}

function tableBlock(rows) {
  let out = '<table>\n<thead><tr>';
  out += rows[0].map((c) => `<th>${c}</th>`).join('');
  out += '</tr></thead>\n<tbody>\n';
  for (const r of rows.slice(1)) out += '<tr>' + r.map((c) => `<td>${c}</td>`).join('') + '</tr>\n';
  return out + '</tbody>\n</table>\n';
}

function authorBox() {
  return (
    `<section id="author" class="deep-author">\n<h2>Who writes this</h2>\n` +
    `<p>Written and fact-checked by <strong>Frater Alek0s</strong>, chaos magick practitioner with fifteen years of ` +
    `practice, author of the Chaos Hunter runes treatise and editor of the Inner Circle study programme. Every guide here ` +
    `is tested in practice before it is published, and every app listed is built and maintained by the same team.</p>\n` +
    `<p>Questions about a method, or you want the long version of any technique: ` +
    `<a href="/landing-pages/complete-access.html">Inner Circle</a> has the full courses and monthly study threads.</p>\n` +
    `</section>\n`
  );
}

function run(cfg) {
  const file = path.join(ROOT, cfg.slug);
  if (!fs.existsSync(file)) return { slug: cfg.slug, ok: false, why: 'missing' };
  let h = fs.readFileSync(file, 'utf8');
  if (h.includes(MARK)) return { slug: cfg.slug, ok: true, why: 'skip' };

  // 1) TL;DR right after the hero box (before the first h2 inside main).
  const tldr =
    `${MARK}\n    <section id="tldr" class="deep-tldr">\n<h2>In short</h2>\n<ul>\n` +
    cfg.tldr.map((t) => `  <li>${t}</li>`).join('\n') +
    `\n</ul>\n</section>\n`;
  const firstH2 = h.indexOf('<h2');
  if (firstH2 < 0) return { slug: cfg.slug, ok: false, why: 'no h2' };
  h = h.slice(0, firstH2) + tldr + h.slice(firstH2);

  // 2) Deep sections + author box before the FAQ heading.
  const deep = cfg.deep.map(section).join('\n') + authorBox();
  const faqAt = h.indexOf('<h2 id="faq-heading">');
  if (faqAt < 0) return { slug: cfg.slug, ok: false, why: 'no faq' };
  h = h.slice(0, faqAt) + deep + h.slice(faqAt);

  // 3) Extra FAQ entries (visible), before "Where to go next" (or </main>).
  const nextAt = h.indexOf('<h2>Where to go next</h2>');
  const faqEndAt = nextAt >= 0 ? nextAt : h.indexOf('</main>');
  if (faqEndAt < 0) return { slug: cfg.slug, ok: false, why: 'no next' };
  const extra = cfg.faqExtra.map(([q, a]) => `<div class="faq-q"><h3>${q}</h3><p>${a}</p></div>\n`).join('\n');
  h = h.slice(0, faqEndAt) + extra + h.slice(faqEndAt);

  // 4) Use-case table.
  if (cfg.cases) {
    const at = h.indexOf('<h2 id="faq-heading">');
    h = h.slice(0, at) + cfg.casesTitle + tableBlock(cfg.cases) + h.slice(at);
  }

  // 5) CSS.
  if (!h.includes('.deep-tldr {')) h = h.replace('</head>', CSS + '</head>');

  // 6) JSON-LD: FAQPage, WebPage dateModified + author, Speakable, Person.
  const blocks = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const out = [];
  let faqDone = false, speakDone = false, webDone = false, personDone = false;
  for (const m of blocks) {
    let j = null;
    try {
      j = JSON.parse(m[1]);
    } catch {
      out.push(m[0]);
      continue;
    }
    const t = j['@type'];
    if (t === 'FAQPage' && !faqDone) {
      for (const [q, a] of cfg.faqExtra) j.mainEntity.push({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } });
      faqDone = true;
    } else if (t === 'WebPage' && j['@id'] && j['@id'].endsWith('#webpage') && !webDone) {
      j.dateModified = MODIFIED;
      j.author = { '@id': AUTHOR['@id'] };
      webDone = true;
    } else if (t === 'WebPage' && j.speakable && !speakDone) {
      const sel = j.speakable.cssSelector || [];
      for (const s of ['#tldr', ...cfg.deep.map((d) => '#' + d[0]), '#author', '#faq-heading']) {
        if (!sel.includes(s)) sel.push(s);
      }
      j.speakable.cssSelector = sel;
      speakDone = true;
    }
    out.push('<script type="application/ld+json">\n' + JSON.stringify(j, null, 2) + '\n</script>');
    if (t === 'WebPage' && j['@id'] && j['@id'].endsWith('#webpage') && !personDone) {
      out.push('<script type="application/ld+json">\n' + JSON.stringify(AUTHOR, null, 2) + '\n</script>');
      personDone = true;
    }
  }
  if (!faqDone || !speakDone || !webDone) return { slug: cfg.slug, ok: false, why: 'schema:' + [faqDone, speakDone, webDone].join('/') };
  // Splice by index: `out` can be longer than `blocks` (we add the Person block),
  // so any leftover entries must be appended after the last original block.
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/g;
  let res = '', last = 0, cursor = 0, mm;
  while ((mm = re.exec(h))) {
    let piece = out[cursor++];
    if (cursor === blocks.length && cursor < out.length) piece += '\n' + out.slice(cursor).join('\n');
    res += h.slice(last, mm.index) + piece;
    last = mm.index + mm[0].length;
  }
  h = res + h.slice(last);

  fs.writeFileSync(file, h, 'utf8');
  const words = (h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ')
    .split(/\s+/).filter(Boolean).length);
  return { slug: cfg.slug, ok: true, why: words + ' palabras', n: cfg.faqExtra.length + 8, deep: cfg.deep.length };
}

let ok = 0;
let fail = 0;
for (const cfg of PAGES) {
  const r = run(cfg);
  if (r.ok) { ok++; console.log(`OK   ${r.slug} — ${r.why} · faq=${r.n} · secciones=${r.deep}`); }
  else { fail++; console.log(`FAIL ${r.slug} — ${r.why}`); }
}
console.log(`\ndeepen-hub OK: ${ok} / FAIL: ${fail}`);