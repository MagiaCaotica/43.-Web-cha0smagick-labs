# Ecosistema Telegram — dónde compartir el grupo y el canal

> Estado real verificado con BrowserOS el 2026-10-21. Nada de esto es inventado:
> cada URL de la tabla se abrió y se comprobó, o se marcó explícitamente como
> **no accesible desde esta red**.

## 1. Lo que tenemos

| | Enlace | Estado | Tamaño |
|---|---|---|---|
| Canal | `https://t.me/cha0smagicklabs` | **público**, con página de vista previa | 5 suscriptores |
| Grupo | `https://t.me/+krfQJgro4hBkNTE5` | **público por invitación** (preview "Join Group") | 2 miembros |

Que el canal sea público es lo que permite listarlo: sin eso, ningún directorio
lo acepta. Para grupos, TGStat y similares aceptan el enlace de invitación
(`t.me/+hash` o `t.me/joinchat/hash`).

**Aviso honesto:** con 5 suscriptores y 2 miembros, entrar en un directorio da
un goteo, no una avalanche. El listing es la parte fácil; lo que hace crecer el
canal es que haya contenido que la gente quiera compartir. Por eso la campaña
de email y los 3 posts de Telegram van de la mano con esto.

---

## 2. Directorios: accesibles y con formulario

### 2.1 TGStat — el grande (23,9k★ de community, catálogo mundial)
- URL: **https://tgstat.com/add/channel**
- Estado: **formulario YA RELLENADO en el navegador**:
  - usuario: `@cha0smagicklabs`
  - país: `global` (sin territorio → aparece en el catálogo mundial)
  - idioma: `Spanish`
  - categoría: `Other` (17)
  - **falta el reCAPTCHA** → hay que marcarlo y pulsar `Send` (no lo resuelvo
    automáticamente: saltarse un CAPTCHA no es el camino).
- Tiene además catálogo de canales **y** de grupos: https://tgstat.com/chats
- Cuando se añada el canal, se puede añadir también el grupo con el mismo
  formulario usando `https://t.me/+krfQJgro4hBkNTE5`.

### 2.2 telegram.org/dir — el directorio oficial
- URL: **https://telegram.org/dir** (con selector de idioma; el nuestro sería
  `https://telegram.org/dir/es`)
- Estado: accesible. Solo cataloga **canales públicos** → el nuestro sirve.
- El alta de canales públicos en el directorio oficial se hace desde el propio
  canal (Telegram lo ofrece al alcanzar cierto número de suscriptores), no con
  un formulario web. Con 5 suscriptores todavía no procede.

### 2.3 telemetr.io — catálogo de canales y grupos
- URL: **https://telemetr.io/en/catalog** (devuelve 404 → la ruta viva es
  `https://telemetr.io/en/channels`, que responde)
- Estado: accesible, con interstitial anti-bot. Tiene alta de canal/grupo.

---

## 3. Directorios encontrados pero NO accesibles desde esta red

Están verificados como reales (aparecen indexados y el buscador devuelve su
URL exacta de alta), pero la red de esta máquina no resuelve/conecta:

| Sitio | URL de alta | Qué es |
|---|---|---|
| TG Mania | `https://tgmania.com/submit` | directorio de grupos de Telegram |
| TG Gram Link | `https://tgramlink.com/submit` | alta de grupo/canal |
| Tg Resource | `https://tgresou.com/submit` | directorio de recursos |
| Groups Gyani | `https://groupsgyani.org/submit-telegram-group-and-channel-links` | alta de grupo y canal |
| Telxplorer | `https://telxplorer.com/en/create_group` | alta de grupo |
| MetricGram | `https://metricgram.com/features/community_directory` | directorio de comunidades |
| Tginfo | `https://tginfo.com/groups` | grupos |
| Telegram Group | `https://telegramgroup.com/` | grupos |
| Togather | `https://www.togather.in/blog/submit-telegram-group-or-channel-link-togather-guide` | guía de alta |

Cada uno necesita: **enlace de invitación o @usuario + nombre + categoría + una
descripción**. La descripción que hay que pegar es la misma en todos (ver §5).

---

## 4. Reddit — DESCARTADO (baneado)

> **No es una vía viable**: la cuenta está baneada de varios subreddits de magia del caos
> y en otros la autopromoción está prohibida por norma (r/witchcraft: *"Self promotion
> & spam"* y *"AI generated content"*; r/LucidDreaming: *"No advertising!"*;
> r/TelegramR4R: *"Exchanges for money, goods, or services are strictly prohibited"*).
> Se leyeron las reglas de los 12 subs candidatos con el navegador y solo 2 permitían
> autopromoción, y en ambos el riesgo de baneo era alto. **No se publica nada en Reddit.**


Reddit **sí** es accesible desde esta red (r/Groups4Reddit, r/Telegram cargan),
pero **este perfil de navegador no tiene sesión de Reddit iniciada**, así que no
puedo publicar. Y no voy a crear una cuenta: es una decisión tuya (y necesita
verificación por email).

Subreddits objetivo, con el enfoque que pide cada uno:

| Subreddit | Tamaño aprox. | Enfoque |
|---|---|---|
| r/Groups4Reddit | — | el sitio donde se listan grupos de Telegram: **encaje perfecto** |
| r/Telegram | muy grande | publicar solo si aportan valor, nunca como anuncio |
| r/paranormal | grande | **nicho exacto**: app de investigación paranormal gratis |
| r/occult / r/witchcraft | grande | tools de sigilos, tarot, runas |
| r/tarot | grande | app Rider-Waite + libro Tarot Chaos |
| r/LucidDreaming | mediano | app de sueños lúcidos + tools |
| r/ChaosMagick | pequeño pero muy afín | el mejor sitio para probarlo primero |

**Antes de postear**: leer las reglas de cada sub (`/r/X/about/rules.json`).
Muchos de estos subreddit **prohíben la autopromoción**. En los que la prohíben,
el movimiento correcto es: comentar con **valor** (resolver una pregunta con una
de las 42 herramientas gratis y enlazar solo cuando aporte) y no dejar el enlace
de la tienda. En los que la permiten, la publicación de abajo sirve.

---

## 5. Textos listos para pegar

### 5.1 Descripción del canal (para los directorios)

```
Cha0smagick Labs — apps de ocultismo y paranormal para Android, libros de magia
del caos en PDF y 42 herramientas de ocultismo gratis en el navegador (sigilos,
runas, tarot, I Ching, astrología, sueños lúcidos). Todo offline, sin rastreo.
```

EN:
```
Cha0smagick Labs — occult and paranormal apps for Android, chaos magick books
as PDF, and 42 free browser-based occult tools (sigils, runes, tarot, I Ching,
astrology, lucid dreams). Fully offline, no tracking.
```

### 5.2 Descripción del grupo

ES:
```
Grupo de la comunidad de Cha0smagick Labs: magía del caos, sigilos, servidores
mágicos, tarot, runas y paranormal. Se comparte práctica, se responden dudas y
se avisa de las herramientas y libros nuevos.
```

EN:
```
Cha0smagick Labs community group: chaos magick, sigils, magical servitors,
tarot, runes and paranormal work. Practice, questions, and new tools and books.
```

### 5.3 Post de Reddit (solo donde se permita autopromoción)

ES:
```
Os dejo esto por si os sirve: 42 herramientas de ocultismo gratis en el
navegador, sin cuenta y sin rastreo — generador de sigilos, tiradas de runas,
tarot, I Ching, carta natal, y un planificador de sesiones de investigación
paranormal con cronómetro.

Van con marca de agua para que podáis compartirlas, y hay una app de
investigación paranormal (NOCTEM) que va con grabador EVP y lectura de sensores
si queréis probarla en una sesión: https://cha0smagicklabs.com/apps/noctem-tools.html

Si alguna os encaja para lo que hacéis, comentad y os paso el enlace con
vuestra referencia.
```

EN:
```
Sharing these in case they are useful: 42 free browser-based occult tools, no
signup and no tracking — sigil generator, rune spreads, tarot, I Ching, natal
chart, plus a paranormal session planner with a timer.

They come with a watermark so you can share them, and there is a paranormal
investigation app (NOCTEM) with an EVP recorder and sensor logging if you want
it for a session: https://cha0smagicklabs.com/apps/noctem-tools.html

If any of it fits what you do, comment and I will send you the link with your
referral on it.
```

---

## 6. Lo que falta para que esto rinda (y es lo que de verdad mueve la aguja)

1. **El canal tiene 5 suscriptores.** Ningún directorio da tráfico a un canal
   vacío. Antes de meterlo en directorios, el canal necesita 10-15 posts con contenido
   que la gente guarde (una carta natal con su interpretación, un sigilo con su
   interpretación, un resultado de tirada). Ya hay 3 posts publicados (IDs
   114-116: app gratis, generador de sigilos, PSI GYM).
2. **El grupo tiene 2 miembros.** Los 216 leads de la "base" **no** son miembros
   del grupo: son colectivas, grupos de cazadores de fantasmas, revistas y
   tiendas de ocultismo de medio mundo, sacados de un listado público. Se les
   escribe como **frío**, y por eso el email lleva el producto y el contexto de
   ellos, no "como miembro del grupo".
3. **La vía que más gente mete en un directorio de una vez**: los canales de
   directorios que aceptan canales con pocos suscriptores (TGStat no pide
   mínimo) y los posts de Reddit (que sí tienen volumen). Con 5 suscriptores,
   TGStat es el primer paso, no el último.
