# Checklist manual del owner — qué solo tú puedes hacer, en qué plataforma y cómo

- **Creado:** 2026-09-26
- **Dueño:** Frater Alek0s (owner) — ejecución local: OpenCode
- **Fuente:** `MASTER_EXECUTION_PLAN.md` §11 (tabla de bloqueos) y §11.2 (cierre local del 2026-09-26)
- **Alcance:** exclusivamente acciones que dependen de una credencial, una plataforma externa o una decisión de contenido que no puedo tomar yo. **Todo lo demás ya está hecho y verificado en local.**
- **Convención de nombres de evidencia:** cuando algo de esta lista produzca un documento o una captura, guárdala con esta forma: `AAAA-MM-DD-<plataforma>-<qué>.json|.png|.csv`. Sin fecha no se acepta como evidencia (§7 del plan).
- **Conocido y no resuelto:** esto cubre los gates externos. Ninguna tarea que aparece aquí está "a medio hacer": o tiene todo el trabajo local hecho y solo le falta tu evidencia, o es una decisión que es tuya por diseño.

---

## 0. Esta semana — desbloquea todo lo demás

Estas dos acciones son la vía crítica. Nada más en esta lista avanza hasta que estén hechas.

### 0.1 Commitear y subir los archivos corregidos — HECHO 2026-09-26

**Estado:** ya está en `origin/main`. No tienes que hacer nada aquí.

Quedaron tres commits, en este orden y con la convención de mensajes del repo (`[P0] …`, cuerpo en ASCII sin tildes):

| Hash | Qué lleva |
|---|---|
| `3fd93b3` | El arreglo de CLS: 370 archivos `.html`, 377 inserciones, 743 borradores. Incluye el canonical de `blog/witchcraft-for-beginners-guide.html`, que iba en el mismo archivo y no se podía aislar. |
| `886182d` | Las dos herramientas nuevas: `scripts/fix-async-css.mjs` y `scripts/analytics/cls-shift-probe.mjs`. |
| `9590f51` | `MASTER_EXECUTION_PLAN.md` (791 → 825 líneas) y este checklist. |

Dos decisiones que tomé y conviene que conozcas:

- **El commit de `d11aa59` está equivocado y no lo borré.** Afirmaba que la causa del CLS era el popup de salida de `js/conversion.js`, como "confirmada". Era falso: el popup no se construye nunca en una corrida de laboratorio porque `CONFIG.popupDelayMs = 30000` y el único `setTimeout` está en L1383. Dejé el commit en la historia (reescribir historia ya publicado rompe los clones de otras personas) y lo refuté explícitamente en `3fd93b3` y en el §2.9.3 del plan. Si lees ese commit, léelo con la corrección al lado.
- **`docs/thin-articles-progress.md` no se commiteó.** `thin_articles_report.py` lo regenera y lo único que había cambiado era la línea de timestamp; el contenido seguía siendo 467/467. Commitear eso era ruido, así que lo revertí antes de commitear. Si lo regeneras tú, vuelve a aparecer modificado y es esperado.

### 0.2 Re-medir Lighthouse en producción — PENDIENTE, es lo único que bloquea

**Por qué sigue abierto:** el gate de la §8 del plan exige evidencia **contra el dominio desplegado**. El arreglo está en `main`, pero hasta que GitHub Pages termine de construir y sirva el commit `9590f51`, el sitio real sigue teniendo el CSS asincrono. El defecto sigue afectando a tus visitantes.

**Dónde:** tú solo tienes que confirmar que Pages ya publicó. En GitHub: repositorio → pestaña **Actions** → workflow **pages** → que el run de `9590f51` esté en verde. Tarda entre 1 y 5 minutos. Si tienes `gh` instalado: `gh run list --limit 3`.

Yo no pude verificarlo desde mi lado por dos razones concretas, ambas externas: el resolvedor DNS local rechazó la consulta de `cha0smagicklabs.com` ("Se ha rechazado la operación DNS") mientras `github.com` respondía 200, o sea que es el bloque del resolver local, no el sitio; y no hay `gh` instalado en el entorno, así que no puedo ver el estado del workflow.

**Una vez deployed, yo corro:**
```
npm run build
npm test
node scripts/analytics/lighthouse-audit.mjs --url https://cha0smagicklabs.com
node scripts/analytics/cls-shift-probe.mjs --url https://cha0smagicklabs.com --viewport desktop
node scripts/analytics/consent-browser-test.mjs --url https://cha0smagicklabs.com
```

**Lo esperado:** CLS de escritorio de ~1.09 a cerca de 0.000, y `performance` de escritorio subiendo de 45 a hopefully 90+. Si el CLS **no** baja, el arreglo no llegó a producción y paramos ahí para investigar el pipeline, no el código.

**Importante, no te lo saltes:** una medición en producción no es lo mismo que la de local. En local medí 5 páginas representativas y todas dieron 0.000, pero eso **no** prueba que las 371 den 0. `blog/index.html` media 0.000 sin el arreglo, o sea que la magnitud del defecto depende de la plantilla. El smoke de las 568 URLs es lo que cubre el resto.

**Lo que este arreglo NO arregla, y hay que mirar aparte:** el `TBT` de móvil (216–236 ms contra un umbral de 200 ms) y el `LCP` de escritorio (2769 ms) siguen abiertos. Son problemas distintos.

---

## 1. Google Play Console — catálogo y disponibilidad (cierra P0-02 y P0-09)

**Por qué:** yo ya reconcilié localmente las 12 páginas de app contra `offers.json` y tengo los 12 package IDs. Lo que me falta es saber si cada app está **realmente publicada** en la tienda, o solo existe en local. Sin esto no puedo afirmar que un CTA de venta lleve a algo que existe.

**Dónde:** `play.google.com/console` → tu proyecto.

1. **Play Store → Apps.** Verás la lista de apps. Para cada una abre la app y entra a **Configuración → Presencia en la ficha de la tienda** (en inglés: *Main store listing*).
2. Para cada app, anota exactamente estos 5 campos en una hoja o en un `.csv`:
   - **Estado:** `Published` / `In draft` / `In review` / `Halted`
   - **URL pública de la ficha** (la que empieza por `play.google.com/store/apps/details?id=`)
   - **Versión publicada** (p.ej. `1.2.0`) y **fecha de última actualización**
   - **Precio** (los productos son de pago único, no suscripción — confírmalo)
   - **Si tiene screenshots o imagen de destacada cargadas** (sí/no, y cuántas)
3. **Play Store → Anuncios / Promocionar** para cada app: si la ficha está publicada, debería existir un enlace "Enlace directo de la ficha". Cópialo.
4. **App content → Data safety** por cada app: anota si está **completado** o **pendiente**. Esto es requisito de Google antes de publicar apps nuevas; si está pendiente, esa app **no** puede publicar.
5. Revisa **Configuración de la tienda → countries**: la app debe estar disponible en Colombia si ese es tu mercado.

**Qué necesito de vuelta:** el CSV con esos 5 campos por app. Con eso escribo `docs/aso-listing-catalog.md` y cierro P0-02 + P0-09, y además puedo decirte qué CTAs del sitio apuntan a apps que no existen.

**Lo que NO voy a hacer:** inventar un estado. Si una app no está publicada, la página y el CTA existen antes que el producto, y eso es una decisión comercial tuya, no una tarea de documentación.

---

## 2. Hotmart — IDs reales, checkout y finanzas (cierra P0-03, P0-04, P0-05)

### 2.1 Los IDs que faltan (desbloquea 2 CTAs ahora mismo)

**Por qué:** hay dos ofertas cuyos botones de compra están **deliberadamente deshabilitados** porque no tengo el ID de checkout real. Puse una regla de no inventar IDs, así que el botón no lleva a ninguna parte. Solo tú puedes sacar el ID de la plataforma.

**Dónde:** `hotmart.com` → panel → **Products**.

1. Abre la lista de productos. Localiza los que en el repo aparecen como `Complete Access` y `Flash Sale` (en `landing-pages/complete-access.html` y `landing-pages/flash-sale.html`).
2. En cada uno, abre **Checkout settings** o **Offers → Offer URL**. Copia **la URL de pago completa**, que tiene esta forma: `https://pay.hotmart.com/XXXXXXXXXXX` (suele acabar en una letra mayúscula seguida de 9 caracteres).
3. Además, busca el bundle, que sí tiene una URL real en el repo: `https://pay.hotmart.com/D93257466P`. **Confírmala abriendo la URL en el navegador**: si lleva a un checkout de pago válido, déjala como está. Si no lleva o da error, es un ID muerto y hay que reemplazarlo.
4. Hay un cuarto ID mencionado en el repo como `V107097103W` que **nunca ha sido verificado**. Trátalo como suspecto: ábrelo. Si no es un checkout válido, no lo uses.
5. Mismo procedimiento para los 7 PDF: anota la URL de checkout de cada uno.

**Qué necesito:** una lista de `producto → URL de checkout`, verificada una por una abriendo cada URL. Con eso habilito los 2 CTAs y cierro P0-03.

### 2.2 La transacción de prueba

**Dónde:** el mismo checkout, con **tu propia tarjeta**.

1. Elige el producto de **menor precio** (o el que puedas devolver).
2. Compra con tarjeta real. **No simules el pago** — un checkout que no se completa de verdad no es un checkout verificado.
3. Anota, con fecha y hora: ID de la transacción, email que se usó, importe cobrado, y los 4 últimos dígitos de la tarjeta.
4. **Haz el refund inmediatamente** desde el panel (Ventas → la transacción → Reembolsar).
5. Confirma que llegó el email de confirmación **y** el de reembolso, y que ambos mencionan la URL de la página donde compraste.

**Por qué importa el refund:** valida el flujo inverso, que es donde se pierden clientes y donde nadie mira. Si el refund falla, tu tasa de reembolso es un flujo de entradas de dinero, y eso es un problema financiero que tú necesitas saber ya.

**Qué necesito:** el ID de la transacción, la marca de tiempo, y confirmación de que el refund llegó. Esto también me sirve para P0-08, porque es un flujo de compra real que reconciliar.

### 2.3 Los números financieros (cierra P0-04 y P0-05)

**Por qué:** no tengo **ningún** número financiero. El plan documenta la fórmula del "Gap to US$5k" pero sin tus números reales es un documento vacío. No los voy a estimar: una proyección inventada es peor que un hueco, porque se lee como un hecho.

**Dónde:** `hotmart.com` panel.

1. **Balances / Withdrawals** → descarga el **extracto de los últimos 30 días**. Necesito por línea: importe bruto, comisión de la plataforma, impuestos retenidos, comisiones de afiliado, y devoluciones.
2. **Sales/Orders** → exporta las ventas de los últimos 30 días en CSV, con una columna por cada tipo de cobro.
3. **Platform → Apps (Android)** → el mismo export, para tus compras dentro de la app.
4. Si usas Hotmart para las apps Android, el reporting de Google Play también vale: `play.google.com/console` → **Finanzas → GANANCIAS**.

**Qué necesito:** los CSV crudos, sin editar. Yo hago el cálculo del **neto real** (bruto − comisión Hotmart − impuestos − devoluciones − comisión de afiliado) y escribo la tabla de Gap-to-5k con la fecha de re-medición puesta.

**Honestidad sobre el alcance:** con esto cierro P0-04 y P0-05 *localmente*. Lo que no puedo es decirte si vas a llegar a US$5k, porque eso depende de semanas de datos que todavía no existen. Lo que sí hago es decirte cuántos días llevas, a qué ritmo vas, y qué tasa de conversión haría falta.

---

## 3. Google Analytics 4 — probar que los eventos llegan (cierra P0-07)

**Por qué:** hay 19 eventos instrumentados y **ninguno ha llegado nunca a GA4**. La instrumentación está probada en local, pero "el evento se dispara" y "GA4 lo recibió y procesó" son cosas distintas, y solo la segunda se prueba con credenciales. Ahora mismo, si el tracking estuviera roto, nadie lo sabría.

**Dónde:** `analytics.google.com` → propiedad `G-V6LHCPN9TK`.

### 3.1 Abrir el modo debug (puedes hacerlo tú solo, en 5 minutos)

1. Ve a **Admin → DebugView**.
2. En otra pestaña, abre `https://cha0smagicklabs.com` con la extensión **Google Analytics Debugger** (Chrome/Edge), o activa el modo debug con `?debug_mode=1`.
3. Navega: clic en una herramienta gratis → arranca una herramienta → llega hasta un CTA de compra. **No hace falta comprar nada.**
4. En DebugView deben aparecer en tiempo real los eventos. Anota los nombres exactos de los eventos que aparecen y cuáles NO aparecen de los que deberían. Eso es un hallazgo útil aunque no completes nada más.

### 3.2 La credencial que me falta (Measurement Protocol)

**Dónde:** `analytics.google.com` → **Admin → Data Streams → [tu stream web] → Configuración avanzada → Measurement Protocol → "API secret" → Crear**.

Copia el **API secret**. Es un dato sensible:

```
GA4_MEASUREMENT_ID=G-V6LHCPN9TK
GA4_MP_API_SECRET=<el secret que acabas de crear>
```

Guárdalo en el archivo `.env` local del repo (que ya está en `.gitignore` — **verifica que lo esté antes de escribir nada ahí**). Ese archivo existe; solo faltan estas dos líneas. **No me lo pegues en el chat.**

El script ya está escrito y funciona en seco:
```
node scripts/analytics/ga4-mp.js --selftest
node scripts/analytics/ga4-mp.js --dryrun
```

**Qué hago yo con la credencial:** enviar los 19 eventos por Measurement Protocol y confirmar que GA4 los devuelve en un informe. Eso convierte "está instrumentado" en "está llegando", que es lo que el gate pide. **Esto es un mensaje a un servidor, no una compra, así que no cuesta dinero ni puede afectar a un cliente.**

### 3.3 Ver el consentimiento rechazado

**Dónde:** `analytics.google.com` → **Informes → Tiempo real**.

1. Abre el sitio en una ventana privada y **rechaza** las cookies.
2. En Tiempo real, mira si entra tráfico.
3. Lo que ya medimos (y es un problema, no un bug): **en la primera visita no hay cookie, así que el código resuelve "consentimiento concedido" por defecto y ya hay peticiones a `googletagmanager` y `doubleclick` ANTES de que el banner aparezca**. Tu "Rechazar" solo surte efecto en la vista siguiente. El propio código lo declara: `// 8. COOKIE CONSENT BANNER (informative — collection is already active)`.
4. **Esto necesita una decisión legal tuya, no una decisión técnica mía.** Ver §5.

**Qué necesito de ti:** una nota de qué día y hora rechazaste, para poder correlacionar con los logs del servidor de Google. Los logs de GA4 no son accesibles para mí.

---

## 4. MailerLite + Make — automatización (cierra P0-08)

**Por qué:** hay 2 secuencias de email escritas (`email-sequences/quickstart-to-buyer.json` y `post-purchase-upsell.json`) y una Cloud Function para RTDN→Make. **Nada está conectado.** El flujo existe como diseño, no como sistema. Esto es dinero parado: alguien que compra y no recibe la secuencia de onboarding se va.

**Dónde:** `mailerlite.com` y `make.com`.

### 4.1 MailerLite

1. **Automations** → mira si existe algún workflow. Si no, hay que crear dos: *Quickstart → Buyer* y *Post-purchase upsell*.
2. **Audiences → Groups** (en la UI puede decir "Groups"): anota los **IDs de los grupos** que necesitas. Se encuentran en la URL de cada grupo o en sus settings.
3. **API → API key** (o *Personal API token*): genera un token y ponlo en `.env` como `MAILERLITE_API_KEY`. **No me lo pegues en el chat.**
4. Pide **un alta de prueba** desde el formulario de suscripción del sitio con **tu** email, y anota fecha y hora.

### 4.2 Make

1. **App → Connections**: crea la conexión con MailerLite usando la API key.
2. Revisa la cuenta de Make y confirma que **el plan tiene operaciones disponibles**. Make cobra por operación, y las 2 automatizaciones van a consumir operaciones reales. No empieces un scenario sin saber cuántos créditos tienes.
3. Crea el scenario RTDN y anota: **ID del scenario**, **ID de la conexión**, y el endpoint de webhook que expone.

**Qué necesito:** los IDs y una ejecución real con log. Sin el log, un webhook no está verificado: puede estar fallando en silencio y nadie se entera hasta que un cliente diga "no me llegó el email".

**Qué NO harás:** nada de esto toca a un cliente hasta que tú lo enciendes. Los scenarios se pueden crear y dejar apagados.

---

## 5. Legal — la decisión que más riesgo tiene (cierra P0-06)

**Por qué:** hay 5 borradores legales, una matriz de proveedores y un footer. **Falta tu firma y falta una prueba en producción.** Y hay un hallazgo concreto que necesita una decisión, no una mejora técnica.

### 5.1 El problema del consentimiento (decisión legal, no técnica)

Lo medido el 2026-09-25 en el dominio real, navegador real:
- Primera visita, sin cookie → el código resuelve **consentimiento concedido**.
- Hay peticiones a Google y a DoubleClick **antes** de que el banner aparezca y antes de que el usuario decida nada.
- El banner dice "esto es informativo: la recolección ya está activa" (`// 8. COOKIE CONSENT BANNER (informative — collection is already active)`).

**Esto puede ser admisible o no según dónde estés y a quién sirves.** No soy abogado y no voy a opinar sobre si lo es. Lo que sí digo es que es un hecho medido, que contradice la lectura ingenua del banner, y que poner un formulario de captación de clientes potenciales o un pixel de publicidad sobre esta base crea riesgo que actualmente no está cubierto.

**Opciones, y por qué creo que una es la correcta:**
1. **Invertir el default a `denied`** y que el banner sea la puerta real. Coste: se pierde algo de cobertura de medición hasta que el usuario acepte. Beneficio: el estado por defecto es conforme. Es lo que hacen la mayoría de jurisdicciones tras el fallo de Google en Francia.
2. Pedir consentimiento explícito y bloquear GA4/DoubleClick hasta entonces, conservando solo lo esencial. Es la opción más conservadora.
3. Dejarlo como está y aceptar el riesgo por escrito. Solo es defendible si tu asesor legal lo confirma.

**Mi recomendación: la 1 o la 2.** No puedo ejecutarlas sin tu confirmación porque cambian el tracking, y el tracking está detrás de P0-07.

### 5.2 Firma y fecha

1. Lee los 5 borradores legales y **aprobábalos o márcalos para cambio**, con fecha.
2. Revisa la **matriz de proveedores y flujo de datos** (quién recibe qué). Es el documento que más veces se ha encontrado mal en auditorías: casi siempre hay un proveedor de analytics o un formulario de email que nadie listó.
3. Revisa las **afirmaciones de claims** — en particular, si alguna página promete algo sobre resultados que no se puede garantizar.

### 5.3 La prueba de retiro en producción (falta y no hay banner)

**Por qué:** aceptar y rechazar ya están verificados con navegador real (30 checks, 0 fallos, y el control negativo falla como debe). **La rama de retiro no tiene banner**, así que no hay nada que probar y, más grave, **no hay forma de que un usuario retire su consentimiento después de haberlo dado**.

1. Decide si quieres un botón o enlace de "retirar consentimiento" (recomendado) visible en el footer.
2. Si lo quieres, dímelo y lo implemento con el mismo mecanismo que el banner.
3. La prueba que falta es alcanzar el estado "retirado" y **verificar en GA4 Tiempo real que el tráfico deja de llegar**. Eso lo puedes hacer tú: rechazas, me dices la hora, y yo lo cruzo.

---

## 6. SEO y GEO (cierra parte de P1-01 y P1-02)

### 6.1 Google Search Console — alta del sitio

**Por qué:** nunca se ha dado de alta. Sin GSC no hay indexación, ni consultas, ni posición, ni datos de campo de Core Web Vitals. **Es un desbloqueante grande y toma 10 minutos.**

**Dónde:** `search.google.com/search-console`.

1. **Add property** → **URL prefix** → `https://cha0smagicklabs.com` (con https, sin slash, sin `www`).
2. Te pide verificar por **HTML tag** o por **DNS**. Elige DNS TXT, que es más difícil de romper.
3. **Sitemaps** → escribe `sitemap.xml` y dale Submit.
4. **Configuración → Usuarios y permisos** → **añade una cuenta de Google** (la que va a manejar esto a futuro). Si solo entras tú y pierdes el acceso, nadie más puede recuperar la propiedad.

**Qué necesito:** que me confirmes que quedó submitted. No necesito acceso a tu cuenta: yo puedo leer los datos si tú los pegas como CSV, o me das acceso como propietario secundario.

### 6.2 Bing Webmaster

**Dónde:** `bing.com/webmasters`. Se **importa desde GSC** en un clic, una vez que GSC esté verificado. Tiene un `IndexNow` que avisa a Bing al publicar.

**Por qué:** es la vía más barata de acelerar la indexación de 371 páginas modificadas.

### 6.3 Rich Results Test

**Dónde:** `search.google.com/search-console` → **Enhancements → Rich Results**, o la herramienta `search.google.com/test/rich-results`.

**Por qué:** el repo tiene 421 `FAQPage`, 314 `HowTo` y 467 `Article`. El Rich Results Test es **el único lugar** donde puedes ver si Google acepta tu JSON-LD. Un JSON-LD válido no es un rich result válido; un validador de JSON no sabe nada de los requisitos de Google.

**Qué necesito:** el resultado para un `FAQPage`, un `HowTo` y un `Article` — uno de cada tipo. Con eso sabré si el structured data está realmente, y si hay oportunidad de rich result.

### 6.4 Un enlace ya arreglado, y una decisión que falta

- **Arreglado por mí:** `blog/witchcraft-for-beginners-guide.html` apuntaba a `https://www.cha0smagick.com/blog/witchcraft-for-beginners-guide` — dominio equivocado y sin `.html`. Ya lo corregí en 7 sitios.
- **Decisión tuya:** ese mismo artículo tiene `og:image` y `twitter:image` apuntando a una imagen que **no existe en el repo**. Cuando alguien lo comparta en WhatsApp o Facebook, sale sin imagen. ¿Le pongo `assets/images/Banner.png` como el resto del sitio, o tienes una imagen propia para ese artículo? **No lo cambié por mi cuenta** porque qué imagen representa un artículo es decisión de contenido.

### 6.5 GEO (cierra parte de P1-02)

Ya está escrito `docs/geo-surface-decision.md` con la recomendación de **no** publicar `llms-full.txt` automáticamente. Necesito tu **aprobación o rechazo** de esa decisión. Si la apruebas, el siguiente paso es medir de verdad: 20 consultas reales a LLMs, registradas con fecha y respuesta, y ver si el sitio aparece citado. Eso son 20 capturas de pantalla en tu nombre.

---

## 7. Google Cloud — Core Web Vitals de campo

**Por qué:** hasta ahora todo es medición de laboratorio. **Los Core Web Vitals que importan para tu ranking son los de campo**, de usuarios reales. Y hay un bloqueo duro: PageSpeed Insights sin API key respondió con **cuota diaria cero** (`"quota_limit_value": "0"`), tres veces seguidas. Reintentar no puede funcionar nunca; no es un rate limit transitorio.

**Dónde:** `console.cloud.google.com`.

1. Crea un proyecto (o usa uno que ya tengas).
2. **APIs & Services → Library** → busca **PageSpeed Insights API** → **Enable**.
3. Ve a **APIs & Services → Credentials** → **Create Credentials → API key**. Cópiala.
4. Con esa clave sí hay cuota. Ponla en `.env` como `PAGESPEED_API_KEY`.

**Qué hago yo:** re-corro el audit y esta vez sí cierra el gate de CWV.

**Honestidad sobre el alcance:** aunque consigas la clave, **no vas a tener datos de campo todavía**, porque el CWV de campo necesita tráfico de usuarios reales, y 568 páginas con poco tráfico no generan datos suficientes durante semanas. La clave te quita el bloqueo duro; no te da la respuesta. Lo que sí te da es una medición de laboratorio por URL, que es útil para detectar regresiones pero **no es lo que Google usa para ranking**. No quiero que confundas esas dos cosas.

---

## 8. Decisiones que te corresponden (no son clics, pero bloquean)

Estas no se pueden automatizar y no las puedo tomar por ti. Las escribo porque son las que más rápido bloquean.

| # | Decisión | Por qué la tomás tú | Impacto si no la tomás |
|---|---|---|---|
| D1 | ¿Invertir el default de cookies a `denied`? (§5.1) | Es riesgo legal, y el default actual es "concedido" | Riesgo legal en cada visita nueva |
| D2 | ¿Construir el botón de "retirar consentimiento"? | Ya medí que la rama de retiro no existe | Los que conceden no pueden retirar |
| D3 | ¿Qué imagen social para `witchcraft-for-beginners-guide`? | Es contenido | Se comparte sin imagen |
| D4 | 15 archivos "excluidos" **están versionados y GitHub Pages los sirve** | Excluir no es no publicar; es una decisión de alcance | Estás publicando cosas que creías excluidas |
| D5 | `checklist-ventas.html` ¿se versiona o se retira? | Está gobernado pero `.gitignore:33` lo bloquea, así que en producción da **404** | Un link roto si alguien lo tiene |
| D6 | ¿Apruebas no publicar `llms-full.txt`? | Es estrategia de exposición | GEO queda sin superficie |
| D7 | Las 371 páginas modificadas, ¿commit único o partido? | Reversibilidad | Si sale mal, revertir es más duro |

---

## 9. Lo que ya está hecho y no necesita nada tuyo

Para que no pierdas tiempo reconstruyendo lo que ya está:

- **P0-01 cerrado:** inventario canónico verificado contra HEAD `f219f9d` con 19 comprobaciones. 568 URLs canónicas, 569 gobernadas, 622 en disco, sitemap 532.
- **Smoke del dominio real:** 568 URLs → 567 `200` + 1 `301` desde `www`, **0 `404`**, 0 inalcanzables.
- **Consentimiento verificado con navegador real** en producción: 30 checks, 0 fallos, y el control negativo devuelve exit 2 (o sea, el test sí es capaz de fallar).
- **CLS de escritorio:** era 0.961, **ya está arreglado** y medido en 0.000. Falta solo el deploy (§0.1).
- **Suite de tests:** 38 pytest + 229 Vitest en 11 archivos, verde, sin regresiones tras el cambio.
- **Deuda técnica:** 569 páginas, 563 con JSON-LD, **0 errores de validación**.
- **19 eventos** declarados y con allowlist de privacidad en `data/analytics-events.json` + `js/analytics-bridge.js`.
- **Play Console, Hotmart y el resto:** inventariados localmente; falta solo la evidencia de plataforma de §1 y §2.

---

## 10. En cuanto me des algo

Cada vez que completas algo, mándame solo: **qué plataforma, la fecha, y el ID, la URL o el export**. Con eso yo cierro la tarea en el plan con la evidencia. No necesitas explicar ni resumir: si el dato está, el gate se cierra; si falta algo, te digo exactamente qué falta.

Y si en algún momento quieres que **yo** ejecute algo de los §1–§4 con tu sesión iniciada, dímelo — varias plataformas admiten que yo navegue con tu navegador abierto, pero prefiero que lo hagas tú cuando envolve dinero o una decisión pública.
