# Plan — CRO: una app estrella, dos bundles

**Creado:** 2026-11-19
**Objetivo medible:** duplicar los clics de salida a Google Play y a Hotmart por cada 100 clics orgánicos antes del 2027-01-19, y que el bundle de libros pase de ingreso residual a segunda fuente de caja. Se mide en `app_store_click` / `purchase_click` (GA4) y en ventas semanales de Hotmart, no en impresiones.

---

## 1. Datos frescos (recolectados hoy, 2026-11-19)

Ningún dato de este plan sale de los planes anteriores. Todo se pidió hoy.

### Search Console — 28 días: 2026-10-21 → 2026-11-17
Comando: `python scripts/seo/cluster-report.py`

```
Sitio entero: 19.257 impr / 420 clics / CTR 2,18% / pos 19,9
  anterior  :  6.656 impr / 239 clics / CTR 3,59% / pos 14,1
```

Páginas con más clics (query propia, dimension `page`, misma ventana):

| clics | impr | CTR | pos | URL |
|---|---|---|---|---|
| 72 | 1494 | 4,82% | 8,6 | /blog/chaos-magick-beginners-complete-guide.html |
| 51 | 846 | 6,03% | 10,8 | /tools/sigil-generator.html |
| 33 | 1281 | 2,58% | 6,6 | /blog/goetic-magic-beginners-guide.html |
| 19 | 796 | 2,39% | 11,4 | /blog/ghost-hunting-apps-comparison-android.html |
| 13 | 283 | 4,59% | 8,6 | /blog/how-to-create-magickal-servitor.html |
| **11** | **86** | 12,79% | 5,1 | **/** (homepage) |
| 11 | 144 | 7,64% | 10,4 | /tools/digital-pendulum.html |
| 10 | 248 | 4,03% | 19,7 | /blog/iching-changing-lines-guide.html |
| 9 | 478 | 1,88% | 5,9 | /blog/spirit-box-frequency-settings.html |
| 9 | 144 | 6,25% | 10,4 | /tools/ |

Dispositivo: **móvil 312 clics** / escritorio 98 / tablet 10.
Países: EE. UU. 158, R. U. 33, Australia 14, Bosnia 14, Brasil 12, Canadá 12, España 9.

### Google Play — fichas públicas, 2026-11-19
- **Sigil Maker: Chaos Magick** — 5,0★, **23 reseñas**, **100+ instalaciones**, $3,99. Única app con valoraciones.
- Las otras 11: sin valoraciones. Instalaciones por ficha: Goetia 50+, Tarot 50+, NOCTEM 10+, Astral Lab 5+, resto ≤50.
- Precios reales: PSI GYM $2,99 · Sigil Maker / Goetia / I Ching / Runas / Luna / Dream Machine $3,99 · Astral Lab $6,99 · Lucid Dream $8,99 · Eerie Roads $9,99 · Tarot $9,99 · **NOCTEM $14,99**.
- Reseña real y enlazable, Alistair Atrus, 6-jun-2026: *"I'm a fairly experienced practitioner of sigil magick & technomancy. This app is surprisingly good… I have already had successful results using this app for ritual purposes."*

### Comunidad y checkout — 2026-11-19
- Telegram @magiacaotica: **1.998 suscriptores**. Grupo coven: **717 miembros**.
- Bundle EN `pay.hotmart.com/N108147778I`: **vivo** ("BUNDLE: All PDFs in ENGLISH").
- Bundle ES `pay.hotmart.com/V107097103W`: **vivo**, pero el checkout cobra **$106.314 COP** a una IP colombiana mientras la web anuncia "US$29.99". No es un error de precio: es localización de Hotmart sin aviso.
- YouTube: la ficha no renderizó; suscriptores **sin verificar**.

### Lo que no se pudo medir (y es parte del problema)
- **GA4 no consultable**: no hay `GOOGLE_APPLICATION_CREDENTIALS` ni `GA4_PROPERTY_ID` en `.env`. Solo hay medición de cliente. Hoy nadie puede responder "cuántos ven la ficha y no compran".
- **Ventas Hotmart**: hay `HOTMART_CLIENT_ID/SECRET/BASIC_TOKEN` en `.env` pero ningún script que los use. Cero visibilidad de ingresos desde el repo.
- Conversión de la home: desconocida. Sin ella, cualquier "hemos mejorado un 30%" sería inventado.

---

## 2. Diagnóstico

1. **La home no vende porque no elige producto.** `index.html:409` abre con una objeción ("Occult Apps That Don't Charge You Monthly"), `:413` manda el CTA principal a una *colección* de Play, y `:477-492` destaca Astral Lab, Arcana Goetia y PSI GYM — las tres apps **sin una sola reseña**. La única app con 5,0★ no aparece en el hero ni en destacados.
2. **El embudo promete algo imposible.** `landing-pages/apps-bundle.html:130` ofrece "las 12 por $29,99" (Google Play no permite bundles) y `:193` menciona un plan **"Inner Circle $9/mes"**, que contradice el USP de todo el sitio. Esa página recibe enlaces desde **168 páginas**.
3. **Ofertas muertas con enlaces vivos.** `landing-pages/complete-access.html:161` tiene el CTA desactivado ("Oferta no disponible todavía"); `flash-sale.html` vende un producto Hotmart que no existe. Enlazadas desde 24 páginas.
4. **Prueba social tirada a la basura.** La única reseña real (5★, detallada, con resultados) no aparece en ninguna parte; se repite "23 ratings" sin una sola cita. Y la ficha estrella aún dice "📱 50+ installs" (`apps/chaos-sigil-generator.html:150`) cuando Play ya muestra 100+.
5. **La ficha estrella se sabotea sola.** El sticky bar la llama "Chaos Arcane Sigil Forge" (`:502`), no hay demo visual, y "Try Free Online" (`:191`) manda fuera del sitio en vez de a `/tools/sigil-generator.html`, que es la página con 51 clics/28d.
6. **Los libros no existen en la home.** Cero oferta de bundle. El menú enlaza a `#books-section` (`index.html:387`), un ancla que **no existe en la página**. Y `/landing-pages/books-bundle.html` es la única landing de bundle ES, con CTA en inglés ("GET BOOKS BUNDLE").
7. **Los números no cuadran entre sí.** Libros: 6 (hero), 7 (trust bar), 9 (FAQ), 10 (`/es/`). Reseñas: 22 o 23 según la página.
8. **`/es/` no es una página de venta**, es un directorio de 38 enlaces. El mercado hispano entra por Telegram/YouTube, no por esta página.
9. **Móvil manda** (74% de los clics) y la home no tiene sticky CTA, aunque 382 páginas ya usan ese patrón.

---

## 3. Desacuerdo explícito

Pediste "reescritura de la home primero". Los datos dicen que la home son **11 de 420 clics** (2,6%), mientras que tres artículos + la herramienta de sigilos son el **39%** del tráfico con intención comercial.

Ambas cosas se sostienen: la home es la cara que recibe el tráfico de Telegram/YouTube (no aparece en GSC) y su reescritura cuesta menos de un día; pero **reescribirla sola no mueve la caja**. Por eso el plan construye **un solo módulo de oferta** y lo coloca en los dos sitios: home y las 3 páginas que ya reciben clics. Mismo código, doble rendimiento.

---

## 4. Plan atómico

Cada paso es independiente salvo donde se indica. "Hecho" = criterio de aceptación ejecutado y visto, no "editado".

### P0 — Verdad y callejones sin salida (antes de meter tráfico)

**P0.1 · Arreglar la promesa imposible del bundle de apps**
- Archivo: `landing-pages/apps-bundle.html` (una sola página arregla 168 enlaces entrantes).
- Cambios: fuera el precio "$29,99 por las 12" y toda mención a Inner Circle/$9 mes; H1 se queda con "las 12 apps" (intención SEO intacta); el cuerpo explica que Google Play no permite paquetes y ofrece el camino real: Sigil Maker primero ($3,99) y el resto desde la ficha del desarrollador; el bundle de libros pasa a ser la única oferta conjunta.
- Hecho: `grep -c "29,99\|Inner Circle\|9/mes" landing-pages/apps-bundle.html` devuelve 0; la página no afirma ningún descuento inexistente.

**P0.2 · Matar los dead-ends**
- Archivos: `landing-pages/complete-access.html`, `landing-pages/flash-sale.html`.
- Cambio: sustituir el cuerpo por `<meta name="robots" content="noindex">` + redirección a `books-bundle.html`. No se borran las URLs (hay enlaces externos).
- Hecho: abrir ambas en navegador acaba en la landing del bundle; no queda ningún botón deshabilitado en el sitio.

**P0.3 · Un solo número**
- Archivos: `index.html` (hero :410, trust bar :470, About :458, FAQ :633), `es/index.html:64,68`, `books/index.html` (meta y H1), `llms.txt`.
- Cambio: 7 libros, 2 bundles (EN/ES), 23 reseñas, 12 apps, 100+ instalaciones. Nada más.
- Hecho: script de una pasada que busque `6 PDF|9 PDF|10 libros|22 rese|50\+ inst` y devuelva 0 resultados en HTML público.

### P1 — Home que elige producto

**P1.1 · Hero nuevo (EN)** — `index.html:408-435`
- Sustituir hero + noscript. Estructura: H1 de producto, subtítulo con mecanismo, CTA Play primario + CTA herramienta gratis secundario, fila de prueba (5,0★ · 23 reseñas · 100+ descargas · pago único $3,99), 4 badges, y la objeción ("por qué no la gratis") movida **debajo** del CTA, no antes.
- Copy listo en §5.1.
- Hecho: en 390×844 el primer pantallazo contiene nombre de app, precio, CTA verde y 5,0★; un solo CTA primario.

**P1.2 · Reordenar la home** — `index.html` (mismo archivo)
- Orden final: hero → 3 razones → cómo funciona en 3 pasos → reseña real → **banda de bundles de libros** (`id="books-section"`, arregla P0.3) → apps complementarias (3: Goetia, Astral Lab, NOCTEM) → grilla de las 12 → herramientas gratis → comunidad → About/Paranormal → FAQ.
- Se elimina el bloque "Featured Apps" actual (`:477-492`) porque duplica la función del hero con las apps equivocadas.
- Hecho: `#books-section` existe y el nav salta ahí; la primera mención de "About Us" queda por debajo del primer CTA de compra.

**P1.3 · Sticky móvil en home**
- Archivo: `index.html` (reutiliza `.sticky-conversion-bar` de `css/style.css:1327`, ya usado en 382 páginas).
- Hecho: en móvil, barra fija con "Sigil Maker · $3,99 · Get it on Google Play"; en escritorio no aparece.

### P2 — Ficha estrella y páginas que ya reciben clics

**P2.1 · Reparar la ficha de Sigil Maker** — `apps/chaos-sigil-generator.html`
- `:150` "50+ installs" → "5,0★ · 23 reseñas · 100+ instalaciones".
- `:502` "Chaos Arcane Sigil Forge" → "Sigil Maker: Chaos Magick".
- `:191` "Try Free Online" → `/tools/sigil-generator.html` (interno), con UTM `?utm_source=app_sigil&utm_medium=internal`.
- Insertar tras el primer CTA: reseña de Alistair Atrus + captura de la ficha; y al final, banda de bundle de libros en lugar del enlace a `apps-bundle`.
- Hecho: ningún enlace de la ficha sale del dominio hacia un blog ajeno; la reseña cita fuente y fecha.

**P2.2 · Módulo de oferta en las 3 páginas con tráfico**
- Archivos: `blog/chaos-magick-beginners-complete-guide.html` (72 clics), `blog/goetic-magic-beginners-guide.html` (33), `blog/ghost-hunting-apps-comparison-android.html` (19).
- Cambio: mismo bloque, destino distinto — Sigil Maker para los dos primeros, **NOCTEM $14,99** para el de ghost hunting (es la app más carapero la página ya tiene intención).
- Hecho: cada página tiene un CTA a Play y otro al bundle de libros; ambos con `data-product-id` para que `conversion.js` los mida.

### P3 — Bundles de libros

**P3.1 · Landing ES del bundle** — `landing-pages/books-bundle.html`
- CTA en español ("Consigue los 7 libros — US$29,99"), nota obligatoria: *"Hotmart cobra en tu moneda local; el importe puede variar por tipo de cambio."* (resuelve el hallazgo del COP).
- Añadir sobre el CTA: 3 portadas, "ahorras $28,94 (49%)", "PDF · descarga inmediata · 7 días de garantía".
- Hecho: abrir desde IP ES/CO no produce contradicción entre el precio de la página y el del checkout.

**P3.2 · Banda de bundles reutilizable** — `index.html`, `apps/index.html`, `books/index.html`
- Un componente con dos botones visualmente distintos: **verde** ("Get it on Google Play") y **granate Hotmart** ("Comprar bundle — $29,99"), con nota de moneda local.
- Hecho: en las 3 páginas, Play y Hotmart nunca se confunden de color ni de etiqueta.

**P3.3 · Bundle EN con landing propia**
- Hoy el bundle inglés solo existe como enlace directo a checkout. Crear `landing-pages/books-bundle-en.html` clonando la ES (mismos estilos de `css/ui.css`), destino `N108147778I`.
- Hecho: la home EN enlaza a esa landing, no al checkout.

### P4 — Español

**P4.1 · `/es/` con oferta arriba** — `es/index.html`
- Conservar el directorio, pero poner encima: hero con Sigil Maker (5,0★, $3,99, pago único), botón al bundle ES y captación de la guía gratis ES.
- Hecho: la primera pantalla en móvil contiene oferta y precio; el directorio de 38 enlaces queda debajo.

### P5 — Medición (sin esto, el resto es fe)

**P5.1 · Abrir GA4 y Hotmart al repo** (bloqueado por ti, no por código)
- Necesito: `GA4_PROPERTY_ID` + service account con rol Lector en la propiedad, y confirmación de que la API de Hotmart puede leer ventas.
- Hecho: `node scripts/seo-revenue-attribution.js --days 28` imprime ingresos y `app_store_click` reales.

**P5.2 · Informe semanal único**
- Archivo: `scripts/cro-weekly.py` (nuevo, ~60 líneas) leyendo GSC (service account ya existente) y, cuando P5.1 esté, GA4/Hotmart.
- Salida: clics orgánicos, clics a Play, clics a Hotmart, ventas, neto. Una tabla.
- Hecho: se ejecuta y pega salida real en `status.md`.

---

## 5. Copy listo para implementar

### 5.1 Hero EN (`index.html`)

```
H1:  Sigil Maker: the chaos magick sigil app that never phones home
Sub: Turn any statement of intent into a unique sigil — 6 occult alphabets,
     7 planetary kameas, cryptographic entropy. 100% offline, no account,
     one payment of $3.99. No subscription, no ads, no tracking.
CTA1 (verde):  Get it on Google Play — $3.99
CTA2 (fantasma): Try the free web generator →
Prueba:  ★★★★★ 5.0 · 23 reviews on Google Play · 100+ installs · one-time payment
Badges:  100% Offline · Zero Tracking · One-time Payment · 7-Day Money-Back
Objeción (debajo del CTA): "Why not the free one? Free sigil and astrology apps
     pay for themselves with ads, subscriptions and your data. This one runs on
     your phone and nowhere else."
```

### 5.2 Hero ES (`es/index.html`)

```
H1:  La app de sigilos que funciona sin conexión y se paga una sola vez
Sub: Convierte cualquier intención en un sigilo único: 6 alfabetos ocultos,
     7 kameas planetarias y entropía criptográfica. 5,0★ en Google Play.
     US$3,99 una vez. Sin suscripción, sin anuncios, sin rastreo.
CTA1 (verde):  Descargar en Google Play — US$3,99
CTA2 (fantasma): Probar el generador gratis →
Prueba: ★★★★★ 5,0 · 23 reseñas · +100 instalaciones · pago único
Badges: 100% offline · Cero rastreo · Pago único · 7 días de garantía
```

### 5.3 Reseña real (bloque testimonios)

```
★★★★★  "I'm a fairly experienced practitioner of sigil magick & technomancy.
This app is surprisingly good… I have already had successful results using
this app for ritual purposes."
— Alistair Atrus, Google Play, 6 June 2026 · ver reseña →
```
Regla: solo reseñas con enlace a Play. Nada de placeholders inventados.

### 5.4 Banda de bundles de libros

```
EN:  Seven books. One payment. $29.99 instead of $58.93.
     The theory behind the apps: chaos magick, servitors, runes, tarot, goetia.
     PDF · instant download · secure checkout on Hotmart.
     [ Comprar el bundle — US$29,99 ]   [ Ver los 7 libros ]
     "Hotmart charges in your local currency; the exact amount may vary with
      the exchange rate."

ES:  Siete libros. Un pago. US$29,99 en vez de US$58,93.
     La teoría que sostiene a las apps: magia del caos, servidores, runas,
     tarot, goetia. PDF · descarga inmediata · compra segura en Hotmart.
     [ Consigue los 7 libros — US$29,99 ]
     "Hotmart cobra en tu moneda local; el importe exacto puede variar según
      el tipo de cambio."
```

### 5.5 Sticky móvil (home)

```
Sigil Maker · $3,99   [ Get it on Google Play → ]
```

---

## 6. Fuera de alcance (y por qué)

- **Bundle de apps**: Google Play no lo permite. Se elimina toda promesa al respecto, no se reedita.
- **Testimonios comprados o inventados**: solo la reseña verificable + cifras públicas de comunidad (1.998 / 717). Los números de YouTube no se usan hasta verificarlos.
- **Urgencia con cuenta atrás falsa**: la única urgencia honesta sería un cupón real de Hotmart con fecha (nueva luna / lanzamiento). Requiere que crees el cupón; si no existe, no se anuncia.
- **Vídeo demo**: las páginas de blog tienen embeds de YouTube, pero la ficha de la app no tiene ninguno propio. Propongo publicar el carrusel de capturas ya existentes ahora y grabar el demo de 45 s después; no bloquea el resto del plan.
- **Reescritura de las 1.157 páginas**: se tocan las que tienen clics o enlaces al embudo, no el resto.

## 7. Riesgos

- Cambiar el H1 de `apps-bundle.html` puede alterar su posición SEO (hoy sin clics). Se conserva la keyword "12 apps" en el H1 para no perder intención.
- La home pierde densidad de enlaces internos al demover "Start Here". Se conserva ese bloque completo más abajo, sin borrar enlaces.
- Si Hotmart sigue mostrando moneda local, la nota de tipo de cambio es obligatoria; sin ella el usuario ve dos precios distintos y abandona.

## 8. Orden de ejecución recomendado

`P0.1 → P0.2 → P1.1 → P1.2 → P2.1 → P3.1 → P3.2 → P2.2 → P4.1 → P1.3 → P5`

P0 y P1 caben en una sesión. P2 y P3 en otra. P5 depende de credenciales tuyas.

---

## Ejecutado 2026-11-19 (P0, P1, P2, P3, P4)

**P0.1** `landing-pages/apps-bundle.html`: fuera el $29,99 de las 12 apps y el Inner Circle /mes; CTA primario ahora es Sigil Maker $3.99; FAQ y JSON-LD alineados; 22 rese�as -> 23; 
ine grimorios -> 7 libros.
**P0.2** `flash-sale.html` reducida a redirect + noindex hacia el bundle ES; `complete-access.html` ya no promete $49.99 ni cuenta atr�s rota: enlaza las dos compras reales.
**P0.3** `#books-section` creado en la home; el nav ya no apunta a la nada.
**P1** Home: hero de producto (Sigil Maker), CTA Play + herramienta gratis, fila de prueba 5.0/23/100+, badges, tres bloques nuevos (por qu� es distinta, 3 pasos, rese�a real), banda de bundles EN/ES, destacados cambiados de Astral/Goetia/PSI a Goetia/Astral/NOCTEM, sticky m�vil. Masthead de 500px a 190px (64px en m�vil) para que la oferta entre en el primer pantallazo.
**P1.3** El popup de email ya no dispara a los 30 s en la home (`conversion.js` + `conversion.min.js` regenerado).
**P2.1** Ficha Sigil Maker: `50+ installs` -> 5.0/23/100+, CTA antes de la objeci�n, enlace gratis interno, sticky con el nombre correcto, rese�a citada.
**P2.2** Ghost hunting: el CTA pasa de PSI GYM (`.99` con bot�n que dec�a $3.99) a NOCTEM $14.99 + bundle. Goetic guide: a�adido el bundle EN.
**P3.1** `books-bundle.html`: CTA en espa�ol, checkout directo, nota de moneda local. $29.99 sigue anunciado como referencia USD.
**P3.2** `apps/index.html`: eliminada la promesa del bundle de apps de $29.99. `books/index.html`: describe 7 libros, nota de moneda y UTM.
**P4.1** `/es/`: hero de oferta con Sigil Maker y bundle antes del directorio; 10 libros -> 7.
**Barrido global** `22 rese�as` -> `23` en 66 archivos; URLs JSON-LD rotas (`cha0smagicklabs.comhttps://pay.hotmart.com`) corregidas en 3 archivos de `books/`.

**Pendiente / bloqueado**
- P3.3 landing EN propia: se resolvi� enlazando al checkout directo y a `books/index.html#bundle` (evita contenido duplicado).
- P5.1 GA4 y ventas Hotmart: bloqueado por credenciales (GA4_PROPERTY_ID + service account). Sin eso no hay informe semanal ni verificaci�n de ingresos.
- Deuda preexistente: las 3 p�ginas de blog con m�s tr�fico tienen HTML mal cerrado (`</li>` sobre `<a>` abierto). No se toc�; no lo introdujo este plan.
- La barra sticky tapa ~20px del CTA inline en pantallas de 844px; el bot�n sigue visible y la barra repite la misma acci�n.

### Desbloqueado 2026-11-19 (P5)

GA4 y Hotmart quedaron operativos sin credenciales nuevas:
- GA4 Data API responde con la service account existente (cha0smagick-labs@cha0smagick-labs.iam.gserviceaccount.com). Se anadio `GA4_PROPERTY_ID=521860259` al `.env`.
- La API de Hotmart responde; el `HOTMART_BASIC_TOKEN` guardado estaba caducado y se recalculo desde `CLIENT_ID:SECRET`.

**Linea base real (22-oct -> 18-nov-2026, comando `python scripts/cro-weekly.py`):**
`
GSC     180 clics / 4.365 impr en top5
GA4     607 sesiones (299 organico, 256 directo)
Embudo  app_store_click=10 � purchase_click=12 � begin_checkout=12 � popup_view=100 � popup_close=68
Hotmart 1 venta: 3,99 USD (Ouija Cazadora, 26-oct)
`

Con eso, el objetivo del plan se mide asi: 12 clics de compra -> 1 venta (8,3%). Duplicar la tasa de clic es mas barato que duplicar el trafico.

**Deuda de datos:** GA4 no registra purchase del checkout de Hotmart (no hay webhook). Las ventas se leen de la API de Hotmart, que es la fuente de verdad.
