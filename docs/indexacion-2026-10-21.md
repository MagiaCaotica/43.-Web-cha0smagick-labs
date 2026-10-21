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

## 4. Lo que queda, y por qué no lo arregla el código

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

## 7. Tarea del plan

`P1-11 — Auditar y desbloquear la indexación de las URLs del sitemap` →
**hecha** (este informe). `P1-01` sigue abierta: le faltan los `alt` que
faltan, los saltos de encabezado, el presupuesto de CWV y el export de GSC
— que ya puede hacerse con el gate G13.
