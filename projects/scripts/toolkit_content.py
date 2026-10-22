#!/usr/bin/env python3
"""
CONTENIDO AD HOC POR HERRAMIENTA.

Nada de texto de familia: cada herramienta tiene su propio limite, su propio
"que puedes esperar" y su propio "que hacer con el resultado". Es lo que
separa una herramienta de un formulario con la misma etiqueta.

Este modulo lo consume projects/scripts/gen-toolkit-data.py.
"""

# slug -> {"value", "limits", "expect", "method"}
CONTENIDO = {

    # ---------------------------------------------------------------- ASTROLOGIA
    "full-birth-chart": {
        "value": "Anota el Sol, la Luna y el Ascendente con el grado, y la fecha. Con tres cartas tuyas en 30 dias veras cuales de los tres se mueve y cuales no: eso ya es un mapa, no una foto.",
        "limits": "Calcula tres posiciones con la media de los elementos orbitales, sin efemerides completas: sirve para orientarse, no para rectificar. La hora de nacimiento es el dato que más pesa, y con la hora equivocada el Ascendente se va de sitio.",
    },
    "rising-sign-calculator": {
        "value": "Apunta el Ascendente y la hora de nacimiento. Si en tres semanas la lectura no te encaja, el error mas probable esta en la hora, no en el signo: eso ya te dice por donde mirar.",
        "limits": "Usa la hora local sin correccion de zona ni horario de verano, y el calculo es aproximado. Sirve para saber por donde empieza tu casa, no para trabajo de horoscopo profesional.",
    },
    "moon-sign-calculator": {
        "value": "La Luna cambia de signo cada dos dias y medio: anota la fecha de cada consulta y en un mes tendras el patron de tu propio ritmo, que es mas util que el signo.",
        "limits": "Calcula la posicion lunar aproximada con la media de los elementos, sin las correcciones de luz y nutacion. El signo puede quedar en el borde de un cambio de signo si tu nacimiento cae a Few horas de ese limite.",
    },
    "zodiac-cusp-calculator": {
        "value": "Anota si caes dentro o fuera del cuspide y con cuantos minutos. Es el dato que explica por que dos personas con la misma fecha tienen lecturas distintas.",
        "limits": "Calcula el cuspide con la media de los elementos y el zodiaco tropical. Los minutos de margen son aproximados y no substituyen el calculo con efemerides completas.",
    },
    "planetary-retrograde-calendar": {
        "value": "Marca en el calendario los periodos retroros que te afectan y, al final de cada uno, anota que paso. En un año tienes el patron real de que te frena y que no.",
        "limits": "Las fechas de inicio y fin son aproximadas, con un margen de algunos dias. Un planeta se retroro igual: la fecha exacta no cambia lo que hagas con ella.",
    },
    "planetary-day-calculator": {
        "value": "Cada dia, antes de empezar, anota el planeta que rige y la tarea que le toca. Al mes, tendras un registro de que tareas se te hacen pesadas y cuales se te dan bien.",
        "limits": "El dia planetario se calcula con el zodiaco tropical y no tiene en cuenta la hora ni el lugar. Es un criterio de planificacion, no una causa.",
    },

    # -------------------------------------------------------------------- LUNAR
    "moon-phase-calendar": {
        "value": "Anota la fase de cada dia que trabajes y que hiciste en ella. Con un mes de anotaciones tienes tu propio calendario, que vale mas que el general.",
        "limits": "Las fases se calculan con la media de los elementos, con un margen de unas horas. Para el calculo exacto de un instante concreto, usa una efemeride.",
    },
    "moon-intention-planner": {
        "value": "Escribe la intencion el dia que te toca y vuelve a ella en la fase siguiente: comparar la intencion con lo que paso es el unico trabajo que da valor a un planner lunar.",
        "limits": "El calendario es orientativo y el momento de la intencion lo eliges tu. El ritmo lunar no decide por ti: la accion sigue siendo tuya.",
    },
    "planetary-hours-planner": {
        "value": "Elige una hora planetaria para un trabajo y anota el resultado. En tres repeticiones de la misma tarea en horas distintas, la comparacion empieza a decirte algo.",
        "limits": "Las horas se calculan con el reloj local, no con el tiempo solar, y en latitudes altas la duracion real se desvía de la regla. Sirve como criterio de planificacion, no como exactitud.",
    },
    "ritual-timing-scorecard": {
        "value": "Puntua cada trabajo con los cuatro criterios y compara semanas. La puntuación no dice si el ritual funciono: te dice cual de tus metodos se sostiene mejor.",
        "limits": "Es una hoja de puntuacion, no un metodo. No sabe nada de tu practica ni de lo que ocurre fuera: solo ordena lo que tu mismo anotas.",
    },
    "sabbat-season-planner": {
        "value": "Marca los ocho sabbats del año con lo que quieres trabajar en cada uno. Con el año completo, las fechas dejan de ser teoria y se convierten en un plan.",
        "limits": "El calendario sabbatico es una tradition, no un calendario astronómico: las fechas siguen al sol equinoccial y a las fases lunares, pero el reparto es cultural.",

    # ------------------------------------------------------------------- TAROT
    },
    "tarot-card-reference": {
        "value": "No la uses para mirar cartas: usala para consultar el significado de la que ya te salió. Y anota cuando el significado te discrepan: esa lista es tu propio mazo.",
        "limits": "Es una referencia de meanings tradicionalizados, no una interpretacion de tu tirada. El mazo Rider-Waite tiene lecturas discutidas; cada una se concreta con el tiempo.",
    },
    "tarot-spread-builder": {
        "value": "Define la tirada con su pregunta antes de tirar, y despues escribe la respuesta en los espacios que dejaste. La estructura es lo que hace comparable una tirada con otra.",
        "limits": "Construye la estructura de la tirada; no tira las cartas ni las interpreta. Y una estructura no es una lectura: la posicion tiene que significar algo para tu pregunta.",
    },
    "tarot-journal": {
        "value": "Una entrada por tirada con la fecha, la pregunta y que decidiste despues. En tres meses, el diario muestra mas que las tiradas: muestra tus patrones de decision.",
        "limits": "Es un diario: guarda lo que escribas, no lo interpreta. Lo que se guarde en este navegador no sale de el, y no hay copia de seguridad automatica.",
    },
    "lenormand-card-draw": {
        "value": "Sortea, lee la carta y anota que la relacionas con la pregunta. Las Lenormand tienen un lenguaje de oficios: usarlas es aprender ese idioma, no sortear a ciegas.",
        "limits": "El mazo Lenormand necesita su libro para leerse; aqui tienes el significado de la carta, no la lectura completa. Es un sistema de codigos, no una prediccion.",
    },
    "sibilla-yes-no-oracle": {
        "value": "Formula una sola pregunta de si o no, tira y anota. Anotar la pregunta es lo que separa la Sibilla de un{quote} casualmente comodo.",
        "limits": "La Sibilla responde a preguntas de si o no, con el metodo antiguo: la carta mas la posicion que ocupa. Fuera de ese uso, el metodo no dice nada.",

    # ----------------------------------------------------------------- ORACULOS
    },
    "pendulum-question-builder": {
        "value": "Escribe la pregunta en una sola linea, con una sola palabra clave. El pendulo contesta mejor a lo que se pregunta con una frase que a lo que se pregunta con un tema.",
        "limits": "Construye la pregunta y su lista de respuestas posibles; no hay pendulo ni simulacion. La honestidad del metodo depende de que las respuestas esten escritas antes de tirar, no despues.",
    },

    # ------------------------------------------------------------------- RUNAS
    "elder-futhark-reference": {
        "value": "Consulta la runa que te toco y vuelve a ella cuando la situation cambie. Las runas son un diccionario de símbolos y no un oráculo: lo que decide es la pregunta.",
        "limits": "Referencia de las 24 runas del Elder Futhark con su significado tradicional; no cubre los sistemas Young Futhark, runicas vikingas ni los codigos Aett, que son otra cosa.",
    },
    "runic-name-translator": {
        "value": "Traduce un nombre y anota el resultado. Un nombre en runas no es un nombre mas: es un recordatorio con forma, y merece un significado que puedas sostener.",
        "limits": "Traduce al Elder Futhark con transliteracion simple, sin staves ni ligaduras: el resultado es legible, no caligrafico. Los nombres propios runicos reales usan otros criterios.",
    },
    "ogham-oracle": {
        "value": "Sortea, lee y anota con la fecha. El Ogham funciona por familias, asi que la posicion de la runa en el grupo dice tanto como el trazo.",
        "limits": "Ogham de una sola linea, con los grupos de sonido y los 20 signos; no incluye los Ogham de mas de una linea ni las formas de data illuminated.",

    # ------------------------------------------------------------------ SIGILOS
    },
    "sigil-intention-encoder": {
        "value": "Escribe la intencion, saca el sigilo y anota el resultado con la fecha. El sigilo no se guarda solo: lo que importa es la accion que decidiste con el.",
        "limits": "Reduce la intencion a trazos y los coloca en la circunferencia, con los metodos de reduccion mas comunes. El glifo es una herramienta de foco, no una garantia de nada.",
    },
    "sigil-charging-planner": {
        "value": "Define la intencion, el tiempo de carga y la accion mundana antes de empezar, y luego compara lo que anotaste con lo que paso. Sin ese registro, cargar es un gesto.",
        "limits": "Es una hoja de planificacion: no dibuja, no carga y no mide nada. El unico juicio que hace es el tuyo, y por eso conviene escribir el criterio antes.",
    },

    # ------------------------------------------------------- CORRESPONDENCIAS
    "magical-correspondence-finder": {
        "value": "Busca la correspondencia de un elemento y usala para elegir, no para justificar. Anota por que la elegiste: en una semana, la justificacion se vuelve la practica.",
        "limits": "Usa las correspondencias clasicas de la tradition hermetica. No son leyes de la naturaleza ni una tabla de equivalentes exacta: son un lenguaje para pensar con simbolos.",
    },
    "elemental-balance-checker": {
        "value": "Comprueba el equilibrio de los elementos de una intencion o de un espacio y anota que corriges. Es una forma de mirar antes de hacer, no un diagnostico.",
        "limits": "Cuenta los elementos por presencia y por polaridad, con una ponderacion simple. No hay medicion fisica detras: es un recuento symbolic para reflection.",

    # ---------------------------------------------------------------- RITUALES
    },
    "candle-intention-planner": {
        "value": "Define que quieres mover de un elemento a otro y con que accion mundane lo acompanias. Sin la accion mundane, el trabajo no tiene donde aterrizar.",
        "limits": "Planifica: no enciende, no compra ni marca el color. El significado de un color de vela es una tradicion, y lo que funciona es lo que tu has comprobado.",
    },
    "spell-ingredient-planner": {
        "value": "Elige los ingredientes y anota por que los eliges y que esperabas. Al mes, la lista de ingredientes es mas informativa que cualquier hechizo.",
        "limits": "Sugiere ingredientes por correspondencia y disponibilidad, y no puedes saber si son apropiados para tu caso: revisa siempre seguridad e intencion antes de usarlos.",
    },
    "banishing-ritual-builder": {
        "value": "Construye el ritual con su intencion, su recorrido y su cierre, y anota el resultado. Un banning sin registro no se puede comparar con el siguiente.",
        "limits": "Es una estructura de ritual de limpieza segun usos comunes, no una instruccion de un grimorio. Hazlo con criterio y sin objetos que no sean tuyos.",
    },

    # ------------------------------------------------------------------ SUENOS
    "lucid-dream-training-planner": {
        "value": "Elige una tecnica, una hora de práctica y una fecha de revision, y anota cada noche si la usaste. La revision a las tres semanas es la que enseña.",
        "limits": "Planifica la practica del sueno lucido: no registra el sueno ni comprueba que haya ocurrido. La tecnica depende de ti y de tu ritmo de sueño.",
    },
    "reality-check-technique-coach": {
        "value": "Practica las comprobaciones fuera del sueno primero y anota cuantas haces. La tecnica solo sirve si ya la sabes hacer despierta.",
        "limits": "Explica y propone comprobaciones de realidad; no las hace por ti ni mide el resultado. La eficacia depende de que las hagas tu, y a menudo dentro del sueno.",
    },
    "dream-symbol-dictionary": {
        "value": "Busca el simbolo tal como lo recordaste, no como crees que era. El diccionario es el punto de partida: lo que significa de verdad lo ves en tres suenos seguidos.",
        "limits": "Diccionario de simbolos oniricos con Associations shedding. No es un lenguaje de signos fijo: cada persona tiene sus propios simbolos y las claves aqui son un punto de partida, no un codigo.",
    },
    "astral-projection-session-timer": {
        "value": "Anota la duracion, la tecnica y lo que recordaste al despertar. La sesionProjection sin registro es una sensacion que se cuenta a si misma.",
        "limits": "Es un temporizador con pauta de respiracion. No mide si hubo proyeccion ni verifica ninguna experiencia: la experiencia no se puede comprobar desde aquí.",

    # ------------------------------------------------------------- BIENESTAR
    },
    "meditation-focus-timer": {
        "value": "Usa el mismo sonido y la misma duracion cada vez, y anota cuanto te costo. La constancia del entorno es lo que hace comparable la practica.",
        "limits": "Un temporizador con una campana de cierre. No mide concentracion, ni pulso, ni nada: la valoracion es tuya y conviene escribirla a mano.",

    # ------------------------------------------------------------ SEGUIMIENTO
    },
    "intention-achievement-tracker": {
        "value": "Registra la intencion, la accion y el resultado con fecha, y revisala a los 30 dias. Lo que no se anota no se puede mejorar: la repeticion no es el metodo, la comparacion si.",
        "limits": "Un registro de intenciones con estado. No mide resultados ni puede saber si un cambio se produjo: la relation entre lo que hiciste y lo que pasó la pones tu.",
    },
    "results-tracking-dashboard": {
        "value": "Mira el panel con una sola pregunta: que metodo se sostiene mejor en mis propios terminos. Sin esa pregunta, un panel es ruido bonito.",
        "limits": "Agrega lo que registras en el navegador: no sabe nada de lo que ocurre fuera. El panel no demuestra nada; solo ordena lo que tu ya anotaste.",

    # -------------------------------------------------------------- SEGURIDAD
    },
    "ritual-safety-checklist": {
        "value": "Usala antes de empezar y guardala. Una lista de seguridad que se lee despues del ritual ya no es una lista de seguridad.",
        "limits": "Lista de comprobacion de uso prudente segun criterios generales, no un protocolo de seguridad de una tradicion concreta. No sustituye leer la documentacion de la propia practica.",
    },
    "consent-boundary-planner": {
        "value": "Escribe que no aceptas antes de la sesion, y revisalo despues. Los limites que no se escriben antes, en el momento, se pierden.",
        "limits": "Herramienta de reflexion sobre consentimiento y limites. No tiene ninguna capacidad de hacer cumplir nada: es un documento, y su valor esta en que lo leas antes.",

    # --------------------------------------------------------- ORGANIZACION
    },
    "digital-grimoire-organizer": {
        "value": "Ordena una vez y vuelve a el cada mes. Un grimorio que se consulta es un grimorio; uno que se archiva es un carpeta.",
        "limits": "Organiza y etiqueta lo que tu registras en el navegador. No importa nada de fuera, no hace busquedas ni sincroniza: es un indice, no una biblioteca.",
    },
    "paranormal-session-prep-checklist": {
        "value": "Usala antes de cada sesion y guardala con la fecha. La mitad del valor de una sesion esta en lo que se preparó antes de empezar.",
        "limits": "Lista de preparacion para una sesion de investigacion, con criterios prudentes. No instrumenta nada y no comprueba que occurri nada: es preparacion, no evidencia.",
    },

    # ------------------------------------------------------------- SIMBOLOS
    "planetary-alphabet-cipher": {
        "value": "Cifra un texto y anota la clave que usaste. Un cifrado sin clave anotada no es un cifrado: es un dibujo.",
        "limits": "Cifra con el alfabeto planetario y una clave de una palabra. Es un ejercicio de correspondencia, no criptografia: el metodo es reversible por diseño y no protege nada.",

    # ---------------------------------------------- PROPIAS (las 15 con JS propio)
    },
    "gnosis-timer": {
        "value": "Anota la duracion, la tecnica y que recuerdas al despertar. Con el registro de 20 sesiones, la gnosis deja de ser una experiencia suelta y se vuelve una practica con curva.",
        "limits": "Mide el tiempo de una sesion de gnosis. No mide si la sesion funciono, no registra lo que viste y no es un metodo de induccion: es un cronometro con la pauta de respiracion.",
        "expect": "Un temporizador con la pauta de respiracion. Lo que salga de ahi depende de tu practica, no de la pagina.",
    },
    "rune-drawer": {
        "value": "Sortea, lee la runa y anota que cambias despues. La runa no dice nada: lo que dice es lo que tu hiciste con ella.",
        "limits": "Sortea una runa al azar y devuelve su significado. No es una prediccion, no tiene en cuenta tu carta, tu situacion ni el momento.",
        "expect": "Una runa con su significado y una pregunta para responder. El valor esta en la reflexion que hagas con ella.",
    },
    "zener-esp-trainer": {
        "value": "Practica series largas, no tiradas sueltas: el acierto por azar es de una entre cinco, y solo una serie de treinta deja ver algo. Anota la serie completa, no el porcentaje.",
        "limits": "Practica percepcion extrasensorial con cartas de Zener: aciertos, fallos y la serie completa. No mide telepatia ni don, y la probabilidad de acierto por azar es de una entre cinco.",
        "expect": "Una serie con aciertos, fallos y el porcentaje de acierto. Un resultado alto puede ser suerte; por eso se practica con series largas y con control.",
    },
    "astrology-sign-calculator": {
        "value": "Sirve para saber por donde empezar. Cuando passes a calcular una carta entera, vuelve a la hora de nacimiento: ahi esta el 90 % de la precision.",
        "limits": "Calcula el signo solar a partir de la fecha. No usa la hora ni el lugar, asi que no puede decirte tu Ascendente ni tu Luna.",
        "expect": "Tu signo solar y su elemento en una frase. Es el punto de partida, no una carta.",
    },
    "candle-color-calculator": {
        "value": "Elige un color y anota por que. En tres velas, la eleccion se vuelve criterio propio y ya no tradicion prestada.",
        "limits": "Relaciona el color de una vela con su correspondencia tradicional. Son asociaciones de tradicion, no reglas universales, y el color final depende del aceite, del paves y de la luz.",
        "expect": "El color con su correspondencia y una justificacion para elegirlo.",
    },
    "digital-pendulum": {
        "value": "Escribe las respuestas posibles antes de tirar, y despues elige una y anota por que. Si cambias de respuesta cada vez, no es el pendulo: eres tu.",
        "limits": "Simula un pendulo con una secuencia aleatoria ponderada. No mide un pendulo real, no es intuitivo y no debe usarse para decidir sobre salud, dinero ni relaciones.",
        "expect": "Una respuesta de una lista de respuestas posibles, con el matiz de cada una para que elijas tu, no la que te gusta.",
    },
    "goetic-spirit-selector": {
        "value": "Guarda el espectro que te devuelve y revisa en 30 dias. La repeticion del criterio es lo que separa una seleccion util de una lectura de inmediato.",
        "limits": "Selecciona los espiritus de la Goetia a partir de criterios que tu le describes. No evoca a nadie, no verifica que el espiritu corresponda a tu caso, y la tradicion goetica tiene reglas propias de seguridad que hay que leer antes de usarla.",
        "expect": "Los espiritus que mejor encajan con lo que describes, con su ambito y sus notas. Es una orientacion, no una invocacion.",
    },
    "iching-changing-lines": {
        "value": "Tira las lineas una a una y anota el hexagrama con su fecha. El hexagrama con lineas mutantes es un patron de momento, y se relee mejor con el registro.",
        "limits": "Convierte monedas en lineas mutantes y en hexagramas. No consulta una secuencia autorizada, no es un oraculo con estado, y las lineas se tiran una a una y en orden.",
        "expect": "El hexagrama con sus lineas que cambian y su lectura tradicional.",
    },
    "moon-voc": {
        "value": "Anota la invitacion de cada dia con lo que hiciste. En un mes, la luna deja de ser un calendario y es un registro de tu ritmo.",
        "limits": "Calcula la vocacion lunar de un dia: la luna y su signo, con la invitacion tradicional. Es astronomia de posicion, no una prediccion, y no depende de tu lugar.",
        "expect": "La luna del dia, su signo y una invitacion breve para el trabajo ritual de ese dia.",
    },
    "planetary-hours": {
        "value": "Usa la hora planetaria para una tarea concreta y anota el resultado. Con la misma tarea en tres horas distintas, la comparacion empieza a enseñar.",
        "limits": "Calcula las horas planetarias a partir de la hora del reloj. Usa el tiempo local y no el solar, y en latitudes altas las duraciones se desvian de la regla traditional.",
        "expect": "La hora planetaria vigente, que planeta rige y hasta cuando. Sirve para elegir el momento de un trabajo, no para decidir el contenido.",
    },
    "planetary-kamea-sigil": {
        "value": "Dibuja el sigilo y repasa el trazado paso a paso. El valor de la kamea esta en que el trazo se recuerda: un sigilo que no sabes repetir no sirve.",
        "limits": "Dibuja el sigilo de una kamea planetaria concreta, con la disposicion tradicional de trazos. No verifica que la kamea este bien trazada ni que el trazo sea correcto: eso se aprende a mano y se revisa.",
        "expect": "El sigilo de la kamea elegida, con el trazado paso a paso para repasarlo.",
    },
    "reality-check-tracker": {
        "value": "Registra cada comprobacion y revisa el recuento cada dos semanas. El numero de aciertos con el tiempo dice mas que la sensacion de una noche suelta.",
        "limits": "Registra las comprobaciones de realidad de una sesion. No las evalua: no distingue una comprobacion eficaz de una que fallo, y no guarda nada fuera de tu navegador.",
        "expect": "Una lista de comprobaciones con su resultado y el recuento de aciertos. El valor esta en comparar semanas.",
    },
    "sigil-charging-timer": {
        "value": "Anota la intensidad cada vez y compara con la semana anterior. La escala no vale nada comparada con nadie: vale comparada contigo.",
        "limits": "Es un temporizador de carga con una escala de intensidad para que anotes como la viviste. No carga nada por si mismo, no verifica la fuerza del sigilo, y el resultado que anotaste es una opinion, no una medida.",
        "expect": "Un temporizador con una escala de intensidad y una nota final. La escala es tuya: lo unico comparable es lo que anotaste la semana anterior.",
    },
    "spell-builder": {
        "value": "Guarda el hechizo con la fecha y con lo que decidiste despues. Un hechizo anotado vale mas que un hechizo perfecto olvidado.",
        "limits": "Compone un hechizo a partir de elementos que eliges y te devuelve una estructura con pasos. No verifica que la combinacion tenga fundamento, no evalua si es seguro en tu caso, y no es un substituto de consultar un libro de ocultismo.",
        "expect": "Un hechizo estructurado: intencion, elementos, pasos y un cierre. Util como borrador, nunca como receta cerrada.",
    },
    "tarot-yes-no": {
        "value": "Anota la carta, la pregunta y lo que decidiste despues. En tres meses, el diario muestra mas que las tiradas: muestra como decides.",
        "limits": "Tira una o tres cartas del Rider-Waite con su significado al derecho y al reves. No es una prediccion, no sabe nada de tu situacion, y las cartas no tienen respuestas fijas: el significado es un punto de partida, no un veredicto.",
        "expect": "Las cartas, su interpretacion y una pregunta para responder. La parte util es la reflexion que escribas despues.",
    },
}
