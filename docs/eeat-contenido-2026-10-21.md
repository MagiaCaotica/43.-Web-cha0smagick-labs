# Auditoría de E-E-A-T, confianza y calidad de contenido — 2026-10-21

**Encargo:** «audita contenido y autoridad, trustworthiness, E-E-A-T y todo lo
que se te ocurra para elevar eso. Haz todo el trabajo de contenido necesario».

**Método:** se midió antes de tocar nada. La auditoría vive en
`projects/scripts/audit-eeat.mjs` y `projects/scripts/audit-hreflang.py`, y el
contenido nuevo se decidió con los datos de Search Console, no con suposiciones.

---

## 1. El punto de partida, medido

| Señal | Antes | Después |
|---|---|---|
| Artículos con `author.url` que no es la home | 44,3 % | **99,8 %** |
| Artículos con `Person` completo (sameAs, jobTitle) | 1,1 % | **99,8 %** |
| Artículos con `Organization` referenciada por `@id` | 0 % | **99,8 %** |
| Artículos que enlazan a la página de autor | 10,5 % | **98,9 %** |
| Páginas de confianza presentes | 7 de 8 | **8 de 8** |
| Frases repetidas literalmente en el cuerpo | 2.599 | **112** |
| Frases de plantilla ("Includes step-by-step protocol…") | 1.373 | **0** |
| Enlaces internos medios por página | 41,8 | **44,6** |
| URLs del sitemap | 994 | **1.000** |

Lo que ya estaba bien y **no se tocó**: mediana de 2.858 palabras por artículo,
100 % con H2 y listas, 99,9 % con FAQ, 0 textos idénticos, 0 near-duplicados,
0 aperturas repetidas, 0 duplicados de título salvo 12 plantillas de Pinterest
que no se publican.

## 2. Las carencias de confianza que faltaban

**No existía página de autor.** El `author.url` del schema apuntaba a la home
en el 56 % de los artículos, y en el 10 % de los casos el nombre era texto
plano sin enlace. Un autor al que no se puede llegar no demuestra nada.

**No existía política editorial.** Es una de las páginas de confianza que
Google y los lectores esperan, y además es la que hace creíble el resto: sin
ella, decir "esto está revisado" no significa nada.

**No existía página de contacto.** El pie tenía un email suelto y un anchor
`#contact` en la home. Se creó una con email, canales de la comunidad, zona
horaria, plazos de respuesta y las páginas que ya contestan la mayoría de las
preguntas.

**La `Organization` del schema no tenía dirección, contacto ni `sameAs`.** La
home ya traía una entidad parcial; ahora la entidad completa (dirección,
`contactPoint`, `email`, `foundingDate`, `knowsAbout`, `areaServed`, `sameAs`)
está definida en la home, la página de autor, la política editorial y el
contacto, y **referenciada por `@id`** desde los 1.000 artículos. Es la
arquitectura correcta: la entidad se define una vez y se referencia desde
todas partes, en vez de repetirla 1.000 veces.

**Cero fechas de revisión visibles.** Ahora la página de autor y la política
editorial llevan la suya, y los 51 artículos que sí tienen una revisión real
(fecha de modificación posterior a la de publicación) muestran
`Updated <fecha>`. En los demás no se inventa una: la fecha de modificación
sigue siendo la última edición de contenido, no la última pasada de formato.

**El `SearchAction` de la home estaba roto**: apuntaba a `/?s={search_term}`
cuando la búsqueda del sitio lee el parámetro `q`. El buscador de Google
habría llevado a la home sin resultados.

## 3. Lo que se escribió

### Página de autor — `pages/frater-alek0s.html`

Perfil, las dos disciplinas (práctica e ingeniería) y por qué no se mezclan, la
regla de honestidad, **cuatro comprobaciones que puede hacer el lector en cinco
minutos**, una tabla de datos verificables con su enlace, y una sección de lo
que el sitio no hace. Todo construido sobre la biografía que ya existía en
`blog/who-is-frater-alek0s-meet-the-author.html`, sin inventar una sola
afirmación nueva. Schema `ProfilePage` + `Person` con `sameAs`.

### Política editorial — `pages/editorial-policy.html`

Quién escribe y quién revisa, las seis reglas de escritura, **la
confirmación de cómo se usa la IA** (redacción y edición; nunca testimonios,
cifras ni experiencia inventada; ninguna cita fabricada; sin páginas en
masa), la política comercial, lo que se rechaza, y un **registro de
correcciones** con las tres últimas correcciones reales del sitio.

### Contacto — `contact.html`

Email con qué escribir en cada caso, los seis canales de la comunidad con lo
que se trata en cada uno, la ubicación, y las páginas que ya contestan lo
más habitual. Schema `ContactPage`.

### Bloque Trust en el pie de 979 páginas

Enlace al autor, a la política editorial y al contacto en **todas** las
páginas. Sin esto las tres páginas nuevas quedaban huérfanas.

## 4. Contenido: tres artículos y dos tablas, decididos con datos

Las decisiones salieron de Search Console, con posición y no solo con
impresiones. Una query en la página 5 no se arregla con el título.

| Query | Impresiones | Clics | Posición | Decisión |
|---|---|---|---|---|
| `nasa jpl vs swiss ephemeris reddit` | 14 | 0 | **4,6** (página 1) | Artículo nuevo: comparar VSOP87/ELP-2000 con Swiss Ephemeris desde la experiencia real de Astral Lab, con las cifras en arcminutos, el método para comprobar cualquier app con Horizons, y una sección de lo que **no** se ha hecho |
| `8 phases of the moon definitions` | 13 | 0 | 74,8 | Tabla de las 8 fases (iluminación, duración, uso) en la página que ya posiciona: una tabla es la forma que la SERP usa para listas |
| `tarot card meanings` | 14 | 0 | 50,0 | Tabla de las 78 cartas con significado upright y reversed, para convertir la página en referencia de consulta |
| anclas `#common-beginner-mistakes` | 91 | 0 | 8,8 | Artículo nuevo: los 10 errores de los principiantes, con el síntoma y la corrección de cada uno |
| anclas `#suggested-learning-path-8-weeks…` | 90 | 0 | 8,9 | Artículo nuevo: un camino de 8 semanas, un working por semana, con preguntas y criterios en cada semana |

Las dos páginas del cluster de principiantes son el objetivo de las anclas que
Google ya muestra en la página 1 del mejor artículo del sitio (899
impresiones, 45 clics). Cada artículo nuevo se enlaza desde la sección
correspondiente de esa guía, lleva tarjeta en el índice, imagen propia y
entrada en el sitemap.

**Lo que NO se escribió, y por qué:** la query `best app for destiny matrix
compatibility between two birth dates` (8 impresiones, posición 7,9) se
descartó. Astral Lab no tiene esa función, así que una comparativa sobre ella
habría sido contenido sin experiencia propia: exactamente lo que la política
editorial que se acaba de escribir prohíbe. Si algún día la app lo tiene, se
escribe; mientras tanto, no.

## 5. Contenido a escala: qué se quitó y qué se dejó

**1.373 repeticiones de la misma frase** ("Includes step-by-step protocol,
honest failure modes, and FAQ") en 406 artículos: meta descriptions,
descripciones del schema, excerpts de las tarjetas de los índices y
descripciones de los enlaces relacionados. Sustituidas por **el primer
párrafo real de cada artículo**, que ya existía y no se estaba usando. La
frase aparece hoy 0 veces.

**Los 15 meta descriptions** que eran la plantilla "A complete working guide to
X covering X" se reemplazaron igual, por el primer párrafo real.

**Las rayas em se dejaron.** Hay 5.147, pero la mayoría son uso correcto
("interaction-not"), y una pasada mecánica para sustituirlas arriesga romper el
texto sin ganancia de SEO. Queda como decisión consciente, no como descuido.

**El "the fact that" (76 veces), el vocabulario de stock (23) y las
transiciones de relleno (2) se dejaron**: por debajo del umbral en que un
lector los nota, y porque el cuerpo ya es único (0 textos idénticos, 0
aperturas repetidas).

## 6. Verificación

- **3.393 bloques JSON-LD, 0 inválidos.**
- `npm test`: **38 pytest + 230 vitest en verde**. El verificador de catálogo
  de Play detectó un `package id` inventado por mí en el CTA del artículo
  nuevo (escribí el id del paquete con un guion bajo en lugar del real, que
  termina en `astralchart`) y lo corrigió. Ese control hizo su trabajo.
- `audit-indexation.mjs`: 1.000 URLs, 0 duplicadas, 0 `noindex`, 0 404, 0
  huérfanas, todas alcanzables en ≤3 clics.
- `audit-hreflang.py`: 1.453 declaraciones, 0 rotas, 0 incoherentes, 0 sin
  reciprocidad, 0 en páginas `noindex`, 0 autorreferencias.

## 7. Cómo volver a medirlo

```
node projects/scripts/audit-eeat.mjs             # las señales de confianza
python projects/scripts/audit-hreflang.py        # los pares de idioma
python projects/scripts/gsc-queries.py           # queries y huecos reales
python projects/scripts/gsc-clusters.py          # demanda contra cobertura
node projects/scripts/audit-indexation.mjs      # sitemap, contradicciones, rastreo
```

Las cuatro de GSC necesitan el gate **G13** (service account como
`siteOwner` de `sc-domain:cha0smagicklabs.com`, ya cerrado el 2026-10-21) y
escriben su evidencia en `data/guerrilla/`.

## 8. Lo que queda abierto

- **El efecto de los artículos nuevos no se puede medir todavía.** Se
 necesitan 4-6 semanas para que Google los rastree y para que el dato de
  impressions se mueva. La medición de esta semana es la de antes del
  trabajo.
- **El e-E-A-T de autor necesita enlaces externos.** Una página de autor
  enlazada solo desde el propio sitio no se convierte en autoridad de
  fuera. Eso es trabajo de relations públicas, no de código.
- **La dirección física no se publica.** El schema lleva
  `addressLocality: Bogotá` y `addressCountry: CO`, pero no la calle. Publicar
  un domicilio particular es una decisión del propietario, no del técnico.
- **Faltan dos clusters con demanda y poca cobertura**: `astrologia` (826
  impresiones, 4 clics) y `paranormal` (254 impresiones, 3 clics). En ambos
  casos la posición media está en páginas 4-9, así que el trabajo es de
  autoridad y de profundidad, no de snippet.
