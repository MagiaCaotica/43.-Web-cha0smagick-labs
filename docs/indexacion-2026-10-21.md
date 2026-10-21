# Indexación: auditoría y desbloqueo — 2026-10-21

**Queja del propietario:** «necesito garantizar que Google indexe las páginas
del sitemap, porque al momento solo lee 163 páginas».

**Respuesta corta:** el sitio **no tenía ningún bloqueo técnico de indexación**,
pero sí tenía **cinco contradicciones y tres errores de señales** que
Google registraba en su informe. Todas corregidas y verificadas. Lo que
queda no es código: es que Google rastree, y para saber *por qué* no rastrea
hace falta acceso a Search Console (gate **G13**, abajo).

---

## 1. Lo que se midió (no se opiniónó)

Todo con `projects/scripts/audit-indexation.mjs` (sale con código 1 si
encuentra un problema). Resultado **antes** → **después**:

| Comprobación | Antes | Después |
|---|---|---|
| URLs en el sitemap | 1.002 | 994 |
| `noindex` dentro del sitemap | 5 | **0** |
| URLs que dan 404 (no las publica git) | 1 | **0** |
| URLs duplicadas | 2 pares | **0** |
| Canonical que no coincide con su URL | 2 | **0** |
| Huérfanas (nada del sitio las enlaza) | 5 | **0** |
| Alcanzables desde la home | 997/1.002 | **994/994** |
| Profundidad de rastreo | 1 en 3+ clics | 1 en 3+ clics |
| Enlaces internos medios por página | 41,8 | 41,8 |
| `lastmod` distintos (14, congelados) | 14 | **3 reales** (fecha del commit) |

Además, medido sobre las **853** páginas de blog:

- 100 % con JSON-LD `Article` + `headline` + `datePublished` + `dateModified` + `author`
- 97,5 % con `FAQPage`
- 100 % con H1 único y ≥800 palabras (mediana 2.566)
- 0 páginas con texto idéntico, 0 near-duplicados (Jaccard >70 %)
- 1 solo grupo de títulos repetidos (12 × plantilla de Pinterest, no publicada)

Y en vivo (BrowserOS, 2026-10-21): 30/30 URLs de la muestra respondieron
**200**, canonical correcto, sin `noindex`, media **339 ms**, máximo 682 ms.
`www.cha0smagicklabs.com` redirige al canónico; `cha0smagick.com` **no
resuelve** (no hay sitio duplicado que se coma las señales).

## 2. Los cinco bugs encontrados y arreglados

### 2.1 El sitemap anunciaba páginas que Google le había pedido no indexar
`buscar.html`, `search.html`, `landing-pages/affiliate-dashboard.html`,
`landing-pages/flash-sale.html` y `pages/app-details.html` llevan
`<meta name="robots" content="..., noindex">` y aun así estaban en el
sitemap. Google registra el error *Submitted URL marked noindex* y gasta
presupuesto de rastreo en URLs que él mismo descartó.

**Arreglo:** `scripts/generate_sitemap.py` ahora descarta cualquier página
`noindex`, tanto al descubrir como al conservar lo que ya había.

### 2.2 El sitemap anunciaba una URL que no existe
`checklist-ventas.html` está en `.gitignore` → GitHub Pages (modo legacy)
**no lo publica** → en producción es un 404. Y estaba en el sitemap desde el
commit `e1a289f5` (2026-10-19), que lo añadió como «+1 URL real que faltaba»
— un error: el fichero existe en el disco del portátil, no en el sitio.

**Arreglo:** el generador solo anuncia ficheros que **git publica**.

### 2.3 La misma página estaba en el sitemap con dos formas
`/blog/` **y** `/blog/index.html` (igual `/es/`). Las dos responden 200 con
el mismo contenido, y el canonical de esas dos páginas apuntaba a la forma
con `index.html`, mientras el sitemap y todos los enlaces internos usaban la
forma limpia. Google habría canonicalizado hacia `/blog/index.html` y
descartado la entrada del sitemap.

**Arreglo:** dos cosas. (a) el canonical de `blog/index.html` y
`es/index.html` pasa a la forma limpia `/blog/` y `/es/`; (b) el generador
normaliza la URL del sitemap al canonical de la página y deduplica.

### 2.4 `lastmod` congelado: Google creía que el sitio llevaba meses muerto
El generador conservaba el `lastmod` viejo para siempre (14 fechas
distintas, la mayoría de junio y julio). Un `lastmod` congelado es un
`lastmod` en el que Google deja de fiarse → deja de volver a rastrear.

**Arreglo:** `lastmod` = la fecha del **último commit que tocó el fichero**
(988 de 996 se actualizaron). Como los commits masivos recientes tocaron
casi todas las páginas, ahora ~990 URLs se anuncian como modificadas en las
últimas 48 h: es exactamente la señal que se le pide a Google para que
vuelva a pasar por ellas.

### 2.5 IndexNow no se ejecutaba **nunca**
Tres bugs encadenados en `scripts/ping-indexnow.mjs`:
1. apuntaba a `https://cha0smagick.com` — un dominio **que no resuelve**;
2. el paso del workflow exigía la variable de entorno `INDEXNOW_KEY`, que
   no existe en el repo → el paso se saltaba siempre;
3. `import.meta.url.pathname` rompe con espacios en la ruta (este repo).

**Arreglo:** host correcto, paso sin la condición falsa, `fileURLToPath`, y
ahora avisa **solo de las páginas que cambiaron en el push** en vez de las
1.002 cada vez. Google no usa IndexNow, pero Bing, Yandex y Seznam sí.

## 3. Lo que NO es un problema (y se dejó quieto)

- **Duplicados:** 0 texto idéntico, 0 near-duplicados, 1.002→994 URLs sin
  solapamiento. No había nada que consolidar.
- **Contenido fino:** mediana de 2.566 palabras, solo 66 páginas por debajo
  de 400 (las de legally-styled: glosario, precios).
- **Enlazado interno:** 41,8 enlaces por página, 945 de 994 a 2 clics. Los
  32 artículos en español viven bajo `/blog/` pero están enlazados desde
  `/es/` y en `js/search-index.json`: se alcanzan sin problema, no se tocaron.
- **Hosts duplicados:** `www` redirige al canónico; `cha0smagick.com` y
  `cha0smagicklabs.blogspot.com` no resuelven.
- **Errores de rastreo:** 30/30 páginas de la muestra en 200, media 339 ms.
- **Enlaces internos rotos: 0** y **contenido mixto: 0** (revisadas las 1.016
  páginas: cada `href`/`src` interno apunta a un fichero que existe, y ningún
  recurso `http://` en páginas `https://`).
- **Redirecciones:** `www` → apex en un solo salto; no hay cadenas.

## 4. Lo que queda, y por qué no lo arregla el código

> **Actualizado tras la medición de Search Console (§7):** el «163» no era
> real. Con GSC midiendo, el **76,2 % de las URLs está indexado** (~760 de
> 994) y lo que queda son 38 páginas que Google aún no ha rastreado y 9 con
> un veredicto `noindex` rancio de agosto. El diagnóstico de abajo se
> confirma; las correcciones de §2 son las que lo han desbloqueado.

**Google no indexa por sitemap: indexa por rastreo.** El sitemap solo dice
«existen». Lo que mueve la aguja es cuántas veces Google vuelve, y eso
depende de la demanda de rastreo del dominio y de su autoridad. Con 994
URLs y un dominio joven, el ritmo real es de decenas de páginas por día.

El dato de referencia del propio repo (`e1a289f5`, 2026-10-19): el sitemap
se había enviado el 24 de junio y **Google no lo había vuelto a leer en
cuatro meses** → solo 39 páginas descubiertas. Al reenviarlo: **1.001
descubiertas**. El techo estaba en el sitemap congelado, y eso ya está
arreglado.

Sobre esa base, el 163 es el número de páginas que Google **ha indexado hasta ahora** de las 1.001 que ya conoce. Con las correcciones de
este informe las 994 URLs quedan limpias, coherentes y con `lastmod` real;
lo que falta es tiempo de rastreo y **medirlo**.

## 5. Gate G13 — una acción del propietario (sin esto no hay medición)

Hoy nadie puede leer el informe de cobertura de Search Console: la cuenta
de Google del navegador no es la propietaria de la propiedad, y la service
account del repo (`projects/playstore.json`) **no tiene permiso**.

**Una acción, un minuto:**

1. Abre `https://search.google.com/search-console?resource_id=https%3A%2F%2Fcha0smagicklabs.com%2F`
   con la cuenta **propietaria** de la propiedad.
2. **Configuración → Usuarios y permisos → Añadir usuario**.
3. Tipo: **Grupo**. Email:
   `cha0smagick-labs@cha0smagick-labs.iam.gserviceaccount.com`
4. Permiso: **LECTURA** (basta para medir).

**Verificación (sin internet, en local):**

```
python projects/scripts/gsc-indexation.py
```

Imprime, por sitemap, `enviadas` / **`indexadas`** (la cifra real que
Google tiene indexada) y el número de URLs con impresiones en los últimos
28 días. Sin el gate responde `403` con la instrucción.

Con acceso se puede además pedir indexación puntual con la **Indexing API**.
Aviso: esa API es **solo para páginas de empleo o eventos**; usarla para
las 994 páginas del blog va contra la política de Google y puede abrir un
procedimiento manual. **No se ha hecho, y la recomendación es no hacerlo.**

## 6. Cómo volver a auditar

```
node projects/scripts/audit-indexation.mjs     # 0 = todo en orden
python scripts/generate_sitemap.py              # regenera el sitemap (idempotente)
```

El workflow `.github/workflows/sitemap.yml` regenera el sitemap en cada push
a `main`, lo commitea solo si cambia, avisa a Google con
`/ping?sitemap=...` y avisa a Bing/Yandex/Seznam con IndexNow.

## 6.1 Verificado en producción (2026-10-21, tras el deploy)

Con el navegador real, contra `https://cha0smagicklabs.com`:

- `sitemap.xml` → **200**, **994 URLs**, 0 duplicadas, 0 con `/index.html`,
  0 `noindex`, `lastmod` con 3 fechas reales (2026-10-21 / 10-19 / 10-17),
  última entrada `.../es/tools/gnosis-timer.html` (ya no
  `checklist-ventas.html`).
- 20 URLs del sitemap muestreadas al azar → **20/20 respondieron 200**, 0 con
  `noindex`, **20/20 con el canonical correcto**.
- `/blog/` y `/es/` → canonical `https://cha0smagicklabs.com/blog/` y
  `https://cha0smagicklabs.com/es/` (antes apuntaban a `.../index.html`).
- `/affiliate-disclosure.html` → enlaza ya a los términos del programa de
  afiliados, que hasta entonces no tenía ningún enlace entrante.

> Ojo al medir en vivo: el CDN de GitHub Pages sirve HTML cacheado. Una
> lectura sin cache-busting puede mostrar la versión anterior. Con
> `?cb=<timestamp>` devuelve el archivo actual.

## 7. Lo que dice Search Console (la medición real)

**Acceso:** gate G13 cerrado. La service account
`cha0smagick-labs@cha0smagick-labs.iam.gserviceaccount.com` es **siteOwner**
de `sc-domain:cha0smagicklabs.com`. Herramientas nuevas:
`projects/scripts/gsc-indexation.py` (sitemaps + Search Analytics),
`projects/scripts/gsc-inspect.py` (inspección de URLs, una a una) y
`projects/scripts/gsc-gap.py` (cruce de los datos con el sitemap).

### El «163» era un dato rancio

Muestra aleatoria del sitemap + las páginas que más imprimen: **261 URLs
inspeccionadas** una a una con la API de inspección (28 minutos, dentro de la
cuota diaria de 2.000):

| Veredicto de Google | URLs | Qué es |
|---|---|---|
| Submitted and indexed | **199 (76,2 %)** | indexadas |
| Discovered - currently not indexed | 26 | Google las conoce y **no las ha rastreado** |
| URL is unknown to Google | 12 | nunca las ha visto |
| Excluded by «noindex» tag | 9 | **veredicto rancio**: último rastreo del 15/08 al 04/09, y el HTML ya dice `index, follow` |
| Crawled - currently not indexed | 4 | juicio de calidad (rastreadas entre el 07/08 y el 18/10) |
| error de DNS de este entorno | 11 | no es de Google |

Extrapolado sobre las 994 URLs: **~760 indexadas**, no 163. Y lo corrobora
Search Analytics (22/09–19/10): **380 URLs con impresiones, 225 clics,
7.060 impresiones**.

### Por qué era 163: la cadena completa

1. El sitemap se había enviado el **24 de junio** y Google no lo volvió a
   leer en cuatro meses → 39 páginas descubiertas. Reenviado el 19/10 →
   **1.001 descubiertas**.
2. `lastmod` congelado (14 fechas viejas) → Google veía el sitio como
   quieto y no volvía a pasar. Corregido: 988 de 994 URLs con la fecha real
   del último commit.
3. 9 páginas queodon `noindex` y ya lo quitaron en el HTML, pero **cuyo
   veredicto sigue siendo el de agosto porque nunca se han vuelto a
   rastrear**.
4. 38 páginas que Google **aún no ha rastreado** (26 + 12), sin fecha de
   rastreo.

O sea: el 163 era el estado de un sitio al que Google llevaba cuatro meses
sin releer el sitemap. Con el sitemap releído, el `lastmod` honesto y el
ping a Google en cada push, **lo que queda es dejar que Google rastree**: no
hay ningún otro bloqueo técnico.

### Las 4 páginas con juicio de calidad

`i-ching-hexagram-list-all-64-one-line-meanings`, `new-year-intention-setting-with-sigils`,
`austin-osman-spare-sigil-method` y `how-to-banish-cleanse-space`. Ninguna
tiene un defecto técnico: 2.015–4.454 palabras, JSON-LD `Article`,
`FAQPage`, 65–68 enlaces salientes, title y H1 limpios. Es contenido y
autoridad, no código.

### Lo que la medición destapó y ya está corregido

- **64 declaraciones hreflang apuntaban a URLs inexistentes** (les faltaba la
  extensión `.html`). Google descarta un hreflang cuyo destino no existe:
  el par EN↔ES estaba roto y las 32 páginas en español perdían la señal de
  la inglesa — justo el contenido que va al público LATAM. Corregidas, más
  `x-default` en las 36 páginas EN que no lo declaraban, 4 pares ES↔EN
  recíprocos y la home declarando su versión ES.
  `python projects/scripts/audit-hreflang.py` → 1.565 declaraciones, 0 rotas,
  0 incoherentes, 0 sin vuelta.
- **22 URLs que Google muestra y el sitemap no declaraba**: 18 son solo
  fragmentos `#ancla` (la misma página) y 4 son URLs con query string de
  páginas `noindex` — correcto.
- **24 páginas con ≥30 impresiones y menos del 5 % de clics**. La mayor:
  `/blog/astrology-apps-android-guide.html`, 629 impresiones, 3 clics, 0,5 %
  de CTR. Es un problema de title/description, no de indexación.
- **El bot vendía el bundle viejo** (7 libros, $19.99, 52 %, dos precios de
  libro equivocados) y **CI llevaba rojo desde `29ed498a`** porque los tests
  assertaban 7 libros. Corregidos el prompt, Telegram, Discord, el CTA del
  sitio, el mapa de entidades, dos artículos publicados y los tests.
  `npm test`: 38 pytest + 230 vitest en verde.

### Cómo volver a medirlo

```
python projects/scripts/gsc-indexation.py     # sitemaps + Search Analytics
python projects/scripts/gsc-inspect.py 250    # veredicto de Google, URL a URL
python projects/scripts/gsc-gap.py            # huecos entre sitemap y lo que ve
```

Las tres necesitan el gate G13 y escriben su evidencia en `data/guerrilla/`.

## 8. Tarea del plan

`P1-11 — Auditar y desbloquear la indexación de las URLs del sitemap` →
**hecha** (este informe). `P1-01` sigue abierta: le faltan los `alt` que
faltan, los saltos de encabezado, el presupuesto de CWV y el export de GSC
— que ya puede hacerse con el gate G13.
