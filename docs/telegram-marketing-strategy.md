# Estrategia de mercadeo Telegram — Cha0smagick Labs

> **Estado: las secciones 1–6 describen el bot ANTES del cambio. Ya fue corregido.**
> Lo que quedó escrito y verificado está en la [sección 9](#9-implementado-2026-10-03).
> La sección 7 tiene las decisiones resueltas y las que siguen pendientes.

**Fecha:** 2026-10-03
**Alcance:** bot de Telegram (`telegram-bot/bot.py`) → canal `@cha0smagicklabs` + grupo.
**Identidad:** `cha0smagicklabs` para canal y grupo.
**Pedido:** los mensajes cada hora deben dirigir a artículos, apps y libros para la venta.
**Base:** auditoría de `telegram-bot/bot.py`, `scripts/bots/data/offers.json`, `docs/revenue-catalog-reconciliation.md`, `landing-pages/*.html`, `books/*.html`, `apps/*.html`.

---

## 0. Veredicto

**La estrategia actual no es "frecuencia baja". Es "frecuencia baja apuntando a destinos rotos".**

Hoy el bot publica 3 mensajes/día (9h, 14h, 21h COT) con 11 ofertas. De esas 11:

| Estado | Count | Detalle |
|---|---:|---|
| Checkout real y observed | **1** | Bundle de libros → Hotmart `V107097103W` |
| Listings de Play sin verificar | 5 | NOCTEM, Lucid Dream, PSI Gym, Astral Lab, Sigil Generator |
| Sin venta (no es oferta) | 1 | Testimonio |
| Apunta a colección de Play (no es checkout) | 1 | Apps Bundle |
| **Checkout con placeholder `[ID]` publicado al canal** | **3** | Complete Access, Inner Circle, y `/flash` → Flash Sale |

Y mientras tanto: **los 7 libros tienen checkout real de Hotmart verificado en el repo (`pay.hotmart.com/...`) y el bot NO los promueve en absoluto.**

Es decir: el bot vende 1 SKU y desperdicia 7 SKUs con checkout directo. Subir a 24 mensajes/hora sobre esta base multiplica el tráfico hacia 3 checkouts rotos y desperdicia el inventario que sí cobra.

**El camino a más ventas no es más frecuencia. Es, en este orden:**

1. Sacar del canal los 3 checkouts con placeholder (pérdida de confianza + riesgo de spam flag).
2. Conectar los 7 libros con su checkout real → 7 SKU nuevos en rotación Immediately.
3. Convertir "cada hora" en 24 slots con función propia (venta / valor / comunidad), no 24 anuncios.
4. Instrumentar un evento por nivel para poder decidir con datos.

---

## 1. Auditoría — qué está posteando hoy el bot

`POST_HOURS = [9, 14, 21]` (L26) · `CHANNEL = "@magiacaoticacoven"` (L22) · `OFFERS` L30-150 · rotación `pick_offer` L214-220 (excluye los últimos 5, `random.choice`, historial en memoria bounded a 20, **sin persistencia**).

| id | URL que postea | Precio en el mensaje | Precio canónico | Foto | Válido |
|---|---|---|---|---|---|
| `noctem` | Play `com.cha0smagicklabs.noctemapp` | "COP 50.000" | US$14.99 | `NOCTEM_IMG.jpg` 💀 | ❌ precio sin fuente, foto muerta |
| `lucid_dream` | Play `com.cha0smagicklabs.luciddreamer` | "COP 30.500" | US$9.99 | `LUCID_IMG.jpg` 💀 | ❌ precio sin fuente, foto muerta |
| `books_bundle` | Hotmart `V107097103W` | "50% OFF" | $19.99 / orig $41.93 | `BUNDLE_IMG.jpg` 💀 | ⚠️ único checkout real |
| `psi_gym` | Play `com.cha0smagicklabs.zenercards` | (sin precio) | US$3.99 | `PSI_IMG.jpg` 💀 | ⚠️ sin precio, foto muerta |
| `astral_lab` | Play `com.cha0smagicklabs.astralchart` | "COP 24.000" | US$6.99 | `ASTRAL_IMG.jpg` 💀 | ❌ precio sin fuente, foto muerta |
| `sigil_gen` | Play `com.cha0smagick.sigilgeneratorfinal` | "COP 14.000" | US$3.99 | `SIGIL_IMG.jpg` 💀 | ❌ precio sin fuente, foto muerta |
| `testimonial` | `/testimonios` | — | — | `TESTIMONIAL_IMG.jpg` 💀 | ❌ no es oferta, foto muerta |
| `apps_bundle` | colección Google Play | "11 Apps por $29.99" | no existe | `APPS_BUNDLE_IMG.jpg` 💀 | ❌ colección ≠ checkout |
| `complete_access` | Hotmart `…/complete-access/[HOTMART_PRODUCT_ID]` | "$49.99 · Valor real $350+" | no existe | `COMPLETE_ACCESS_IMG.jpg` 💀 | 🚫 **placeholder al canal** |
| `inner_circle` | Hotmart `…/inner-circle-monthly/[HOTMART_SUB_ID]` | "$19/mes, Founding $9/mes" | no existe | `INNER_CIRCLE_IMG.jpg` 💀 | 🚫 **placeholder al canal** |

Handler adicional `cmd_flash` (L304-321) publica **`flash-sale-99/[ID]`** y `flash.cha0smagicklabs.com` → 🚫 tercer placeholder.

**Las 10 fotos son `i.imgur.com/<NAME>_IMG.jpg` con comentario `# REPLACE with actual Imgur URL`. Son 404.** El bot cae al fallback de texto plano, así que el canal publica texto sin imagen — y las 11 ofertas se ven iguales.

---

## 2. Los defectos (con evidencia)

### 🚫 Críticos — bloquean venta y confianza

| # | Defecto | Evidencia | Impacto |
|---|---|---|---|
| D1 | 3 rutas de venta con placeholder `[HOTMART_PRODUCT_ID]`, `[HOTMART_SUB_ID]`, `[ID]` se publican al canal | `bot.py` L134, L145, L316 | Click → 404. Pérdida de confianza + los clientes reportan spam |
| D2 | **La web ya se arregló, el bot no.** `landing-pages/complete-access.html` y `flash-sale.html` ya no tienen placeholder ni `href` de Hotmart (verificado: `hasPlaceholder:false`, `hasHrefHotmart:false`, marcador BLOCKED ✅) | `docs/revenue-catalog-reconciliation.md` §4 | **Drift**: el plan cerró el hueco local en landings, pero el bot que postea nunca se actualizó |
| D3 | Los 7 libros tienen checkout real (`pay.hotmart.com`) y el bot no los ofrece | `books/*-pdf.html` | 7 SKU con cobro directo desperdiciados |
| D4 | Las 4 fotos de libros… no: **las 10 fotos del bot son 404** | `bot.py` L40-148 | Canal sin imagen, 11 ofertas indistinguibles |
| D5 | Precios "COP 50.000 / 30.500 / 24.000 / 14.000" sin fuente ni reconciliación | `bot.py` L37,48,84,96 | Viola guardrail 4 (no cambiar precios sin fuente de verdad) |
| D6 | "4.7★ · 128+ reviews", "7-day guarantee", "$99 stock 20", "Meta Ads $100/día" | `bot.py` L36,122,311,314 | Claims no verificables en repo → riesgo legal + reclamaciones |
| D7 | `/kpi` lee `/home/ubuntu/cha0s-bot/kpi_snapshot.json` generado por un Apps Script `exportKPISnapshot()` que **solo existe en un template archivado** | repo-wide: `kpi_snapshot` aparece solo en `bot.py` y `projects/docs/archive/kpi-dashboard-template.md` | El comando `/kpi` **siempre falla**. No hay ledger (B-004) |
| D8 | `apps_bundle` vende como "11 Apps por $29.99" contra una **colección de Google Play** | `bot.py` L117-123 | Guardrail 5: colección ≠ checkout. No hay oferta |

### ⚠️ Estructurales

| # | Defecto | Detalle |
|---|---|---|
| S1 | Doble identidad de canal | `bot.py` postea a `@magiacaoticacoven`; `scripts/bots/telegram-bot.js` y README dicen `@cha0smagicklabs`. ¿Dos canales o uno mal escrito? |
| S2 | **El grupo no existe** | No hay `GROUP_CHAT_ID` ni posting al grupo. `TELEGRAM_GROUP_INVITE` solo existe en el bot JS como invite link. La mitad del pedido no está construida |
| S3 | Catálogo duplicado | `bot.py` hardcodea 11 ofertas; `offers.json` tiene 12 apps + 7 libros + bundle. Fuente de verdad ignorada → guardrail 1 roto por diseño |
| S4 | Sin tests que cubran el bot | `npm test` corre `verify_play_catalog.mjs` + `pytest scripts/` + `vitest scripts/bots/test/`. **Nada cubre `telegram-bot/bot.py`** → el drift D2 no fue detectado |
| S5 | `post_history` en memoria | Reinicio → pierde histórico → repitemysgs y viola la anti-repetición |
| S6 | Sin UTM/deep-link por oferta en libros | Solo los links de Play llevan UTM. Los de libros, no |
| S7 | Sin evento de conversión | No hay forma de saber qué mensaje vendió |
| S8 | Sin `TESTIMONIAL_IMG` etc. en disco | No hay assets en repo para las fotos |

---

## 3. Reconciliación de precios — 4 fuentes en desacuerdo

| Libro | `offers.json` | Página real (`books/*-pdf.html`) | Checkout real |
|---|---:|---:|---|
| codex-chaoticus-pdf | $4.99 | $4.99 ✓ | `pay.hotmart.com/W106595764X` (237 archivos) |
| tarot-chaos-pdf | $9.99 | $9.99 ✓ | `pay.hotmart.com/J106598345U` (33) |
| mind-the-gap-pdf | $9.99 | $9.99 ✓ | `pay.hotmart.com/V106730857R` (36) |
| manual-activacion-servidores-magicos-pdf | $4.99 | **$3.99** ✗ | `pay.hotmart.com/D104270399P` (55) |
| tratado-runas-cazadoras-caos-pdf | $4.99 | **$3.99** ✗ | `pay.hotmart.com/F104270966V` (39) |
| ouija-cazadora-pdf | $4.99 | **$3.99** ✗ | `pay.hotmart.com/B104271332D` (7) |
| liber-lvpinux-pdf | $4.99 | **$3.99** ✗ | `pay.hotmart.com/O104271155J` (26) |

**Suma real de los 7 precios de página = $40.93.** El bundle declara `originalPrice $41.93` → **descuadre de $1.00**.

**Claim de descuento inconsistente en 4 superficies:**
- `bot.py` L58: "50% OFF"
- `landing-pages/books-bundle.html`: "50%"
- `README.md`: "52% off"
- `offers.json`: $41.93 → $19.99 = 52.3%

Con la suma real ($40.93) el descuento es **51.1%** → ningún claim actual es exacto.

**Bundle con dos IDs en uso activo:**
- `V107097103W` → 770 ocurrencias (blog + landing + bot.py)
- `D93257466P` → 6 archivos (`checklist-ventas.html`, 2 blog, README)

**Otros conflictos:**
- `offers.json` tiene las **7 URLs de libros rotas** (`/books/<id>.html` vs archivo real `/books/<id>-pdf.html`).
- **Astral Lab**: `offers.json` dice $6.99 ✓ correcto (163 menciones en el site confirman $6.99). **`README.md` dice $3.99** → README es el que está mal.
- `README.md` dice "11 Apps"; hay 12.

---

## 4. Estructura nueva de mercadeo

### 4.1 Pirámide de oferta verificada — 4 tiers

Ningún mensaje sale si su tier no cumple. Esto reemplaza la rotación plana de 11 ofertas.

| Tier | Definición | Contenido | Permitido en canal |
|---|---|---|---|
| **T0 · COBRO INMEDIATO** | Checkout externo **observed en repo** y precio reconciliado | 7 libros (`pay.hotmart.com/*`) + bundle (`V107097103W`) | ✅ CTA directo siempre |
| **T1 · INSTALACIÓN** | Página `apps/*.html` + packageId real, listing externo sin verificar | 12 apps | ✅ CTA a Play, copy con honestidad de estado |
| **T2 · VALOR** | Herramientas gratis, blog, lead magnet | 10 herramientas, 194 artículos | ✅ CTA suave al final |
| **T3 · BLOQUEADO** | Sin ID externo | Complete Access, Inner Circle, Flash Sale, Apps Bundle | 🚫 **Fuera del canal** hasta tener ID |

> Regla dura: **T3 no se publica.** No es marketing, esIncumplimiento de los guardrails 2 y 5.

### 4.2 Arquitectura de rotación — 4 formatos, no 11 Copies

El problema actual: 11 ofertas con la misma estructura (emoji + título + features + precio + link). Se ven idénticas. La rotación aleatoria sobre formato único **no genera ninguna venta incremental**.

Nuevo: **4 formatos que_rotan, 20 piezas**.

| Formato | Función | Cards | Ejemplo |
|---|---|---:|---|
| **F1 · OFERTA DIRECTA** | Venta pura | 8 | "📖 Tarot del Caos — $9.99 · 1 libro, PDF, acceso vitalicio" |
| **F2 · PROBLEMA→SOLUCIÓN** | Venta con contexto | 4 | "Si ya no distingues una señal de un eco: 3 herramientas + 1 libro" |
| **F3 · MICROCONTENIDO** | Valor puro, sin venta | 5 | "Runa Ansuz: qué significa realmente" |
| **F4 · COMUNIDAD** | Interacción | 3 | Poll, "¿Cuál descargaste?", Behind-the-scenes, encuesta de producto |

Regla de mezcla por cada 10 slots: **5 F1 + 2 F2 + 2 F3 + 1 F4.**

### 4.3 Cadencia "cada hora" — 24 slots con función propia

"Cada hora" no puede significar "24 anuncios por hora". Significa **24 slots con función asignada**. Un canal de 24 anuncios comerciales al día se reporta como spam y pierde miembros.

| Franja (COT) | Slots | Contenido |
|---|---:|---|
| 06:00–08:59 | 3 | 1 F1 (libro del día, ángulo "mañana") · 1 F3 · 1 F4 (buenos días) |
| 09:00–11:59 | 3 | 1 F1 (app del día) · 1 F2 · 1 F3 |
| 12:00–14:59 | 3 | 1 F1 (libro, ángulo "mediodía") · 1 F4 · 1 F3 |
| 15:00–17:59 | 3 | 1 F1 (app del día) · 1 F2 · 1 F3 |
| 18:00–20:59 | 3 | 1 F1 (bundle, ángulo "noche") · 1 F4 · 1 F3 |
| 21:00–23:59 | 3 | 1 F1 (mejor ángulo del día) · 1 F2 · 1 F4 (cierre + mañana) |
| 00:00–05:59 | 6 | **Silencio o digest de 1 slot.** Son horas de baja atención en COT → KILL FILL. Un slot a las 02:00 no vende; sí hace bajar el engagement rate del canal. |

**Total: 12 F1-equivalentes (6 venta directa + 6 venta con contexto) + 6 valor + 3 comunidad + 3 digest/nocturno.**

Esto es **4× la exposición comercial actual** (de 3/día a ~12/día) sin ser spam.

### 4.4 Anatomía del mensaje — 3 plantillas (no 1)

**F1 · OFERTA DIRECTA** (≤ 900 chars)
```
<emoji> <b>Título del producto</b>
<b>1 línea de beneficio concreto</b>
✅ feature · ✅ feature · ✅ feature

💵 $X.99 USD · pago único
👉 <a href="<URL_CANONICA_CON_UTM>">Comprar</a>
```
Regla: sin claims no verificables. Sin "4.7★" hasta tener el dato. Sin "7-day guarantee" hasta tener el politique. Si no hay evidencia, no va.

**F2 · PROBLEMA→SOLUCIÓN** (≤ 1100 chars)
```
<emoji> <b>El problema, nombrado</b>
<1 párrafo: por qué la gente sigue estancada>

Lo que ya existe para eso:
→ <producto A> — $X · <1 línea>
→ <producto B> — $X · <1 línea>

👉 <a href="<URL>">Empezar por aquí</a>
```

**F3 · MICROCONTENIDO** (≤ 900 chars)
```
<emoji> <b>Tema</b>
<2-3 frases de valor real, densas, sin relleno>

📖 Guía completa: <a href="<URL blog>">leer</a>
```
Sin producto. Sin precio. Su trabajo es reducir resistencia y_attrs.

**F4 · COMUNIDAD** (≤ 700 chars)
```
<emoji> <b>Pregunta o afirmación</b>
<texto que invite a responder>

💬 Responde aquí abajo
```

### 4.5 Canal vs Grupo — roles distintos (hoy inexistente)

No es lo mismo. El grupo **no debe recibir el mismo contenido que el canal**.

| | Canal | Grupo |
|---|---|---|
| Quién lee | Suscriptores pasivos | Participantes activos |
| Función del bot | **Broadcast** de 3 F1/día + digest | **Conversación** + respuesta a dudas |
| Frecuencia de venta | Hasta 12/día | **Máx. 2/día** y siempre con contexto |
| Contenido dominante | F1, F2, F3 | F4, respuestas, soporte, encuestas de producto |
| Nunca | — | Spam de enlaces repetidos (Telegram penaliza + es hostil al grupo) |
| Implementación | `CHANNEL` | `TELEGRAM_GROUP_CHAT_ID` (**no existe — hay que crearlo**) |

**Regla de oro del grupo:** el bot **responde**, no **insiste**. Si alguien pide un enlace, el bot lo manda **una vez**, con el precio exacto y el estado honesto. El grupo es un mostrador, no un banner.

### 4.6 Links y medición

**Cada oferta → un destino y un UTM únicos y estables.** Today only Play links have UTMs.

```
&utm_source=telegram&utm_medium=bot&utm_campaign=<slug_oferta>&utm_content=<formato>
```

**Eventos GA4 a emitir** (vía webhook simple que ya existe en `scripts/bots/telegram-bot.js` L280-305):
| Evento | Se dispara cuando | Pregunta que responde |
|---|---|---|
| `tg_post_sent` | Bot publica | ¿Cuánto expo realmente? |
| `tg_offer_click` | Bot registra click (deep-link `t.me/<bot>?start=<offer>`) | ¿Qué oferta vende? |
| `tg_checkout_start` | Click al checkout | ¿Cuánto tráfico llega a Hotmart? |
| `tg_purchase_reconciled` | Transacción confirmada en Hotmart | ¿Cuánto **cobrado neto**? |

**El último es el único que importa.** B-004 sigue abierto: sin ledger de net price / fees / refunds / impuestos / commissions, no hay Gap-to-5k calculable.

### 4.7 Anti-spam y compliance (requisito, no opcional)

- **Tasa de publicación:** 24/día en un canal de <5.000 miembros es alta. Activar por fases (ver §6).
- **Telegram ToS:** promotional posts en grupos requieren opt-in o al menos contexto. El bot **debe** comprobar `chat_member` del usuario antes de responder con links en el grupo.
- **`/testpost` y `/flash` son admin-only** — bien. Añadir `/stop` (kill switch) que pause el scheduler sin reiniciar el servicio.
- **`claims`:** todo "garantía", "reviews", "rating", "precio anterior" requiere fuente fechada en el repo o desaparece del copy.

---

## 5. Lo que hay que verificar ANTES de subir la frecuencia

Sin esto, más frecuencia = más rápido a un bloqueo y más rápido a cero confianza.

### P0 — antes de cualquier cambio de frecuencia (1 sesión)

| # | Acción | Bloquea |
|---|---|---|
| V1 | **Confirmar cuál canal es el real**: `@magiacaoticacoven` o `@cha0smagicklabs`. ¿Uno, dos, o uno mal escrito? | Todo |
| V2 | **Obtener el `TELEGRAM_GROUP_CHAT_ID`** del grupo `t.me/+krfQJgro4hBkNTE5` | §4.5 |
| V3 | **Confirmar que `V107097103W` está activo y cobra** en Hotmart (1 lectura del panel) | T0 |
| V4 | **Resolver `V107097103W` vs `D93257466P`** (bundle) | T0 |
| V5 | **Obtener IDs reales** de Complete Access + Inner Circle, o **declararlos T3 permanentemente** | T3 |
| V6 | **Confirmar los 12 listings en Google Play** (existen, precio, availability). Al menos comprobar que `com.cha0smagicklabs.noctemapp` responde. | T1 |
| V7 | **Aprobar la política de garantía/refund** de cada app antes de escribir "7-day guarantee" | copy |

### P1 — antes de las primeras 2 semanas (3–5 días)

| # | Acción | Bloquea |
|---|---|---|
| V8 | **Arreglar las 10 fotos**: subir screenshots reales a un host estable o **quitar `image_url` del schema** y usar `send_message` con formatting | D4 |
| V9 | **Resolver los 4 precios de libro** ($4.99 vs $3.99) — decide cuál es el cobrado | T0 |
| V10 | **Recalcular `originalPrice` del bundle** a la suma real ($40.93) y unificar el claim de descuento en las 4 superficies | D6 |
| V11 | **Arreglar las 7 URLs de libros** en `offers.json` (`/books/<id>-pdf.html`) | D3 |
| V12 | **Migrar `bot.py` a leer `offers.json`** + añadir test que lo cubra | S3, S4 |
| V13 | **Persistir `post_history`** (SQLite o JSON file) | S5 |
| V14 | **Confirmar los 6 checkouts `pay.hotmart.com/*`** de los 7 libros | T0 |

### P2 — antes de las primeras 4 semanas

| # | Acción | Bloquea |
|---|---|---|
| V15 | Implementar deep-link + `tg_offer_click` | medición |
| V16 | Crear el ledger (B-004): una fila por transacción con net price, fees, refunds, comisión | Gap-to-5k |
| V17 | Escribir el runbook de deploy/rollback/alertas (B-014) | escala |
| V18 | Construir el `/kpi` real (o borrar el comando) | D7 |

---

## 6. Roadmap por fases — de 3/día a 24/día

**Nunca subir frecuencia yArrancar una fase al mismo tiempo.**

| Fase | Frecuencia | Contenido | Duración | Condición de salida |
|---|---|---|---|---|
| **F0 · Limpieza** | 3/día (actual) | Solo T0 + T1. T3 fuera. Fotos o texto. Precios reconciliados. | 1 semana | V1-V14 resueltos |
| **F1 · Validación** | 6/día | 4 F1/día (libros) + 1 F2 + 1 F3. Sin grupo. | 2 semanas | `tg_offer_click` reportado para ≥4 ofertas + **primer cobro confirmado** |
| **F2 · Grupo** | 8/día | + grupo en modo conversación. + 3 libros más. | 2 semanas | Sin reportes de spam + engagement rate estable |
| **F3 · Cadencia alta** | 12/día | Mix completo 5/2/2/1. F1 diario de app. | 2 semanas | `effect cobrado neto` medible + sin claim disputes |
| **F4 · Horario completo** | 24 slots | 12 venta + 6 valor + 3 comunidad + 3 digest. | — | Solo si engagement rate de F4 ↑ y no hay growth de "unfollow" |

**Regla de avance:** cada fase requiere **datos de la fase anterior**. Sin `tg_offer_click` no se sube. Sin cobro confirmado no se sube.

---

## 7. Decisiones — resueltas y pendientes

### 7.1 Resueltas por vos (2026-10-03)

| # | Pregunta | Respuesta | Efecto aplicado |
|---|---|---|---|
| 1 | ¿Qué identidad es la real? | **`cha0smagicklabs`**, y hay que hacerlo **para canal y grupo** | `TELEGRAM_CHANNEL` por defecto = `@cha0smagicklabs`. El grupo usa la misma marca vía `TELEGRAM_GROUP_CHAT_ID` |
| 5 | ¿Complete Access e Inner Circle existen en Hotmart? | **No existen** | Eliminados del bot y registrados en `_meta.rejectedOffers` con instrucción de no re-introducirlos |
| 6 | El bundle | **Es el de libros. No hay bundle de apps** | `apps_bundle` eliminado (apuntaba a una colección de Google Play, que no es un checkout). El único bundle es `books-bundle` |

### 7.2 Resueltas por evidencia, sin necesidad de decisión comercial

| # | Pregunta | Resolución | Razón |
|---|---|---|---|
| 3 | Los 4 libros a $3.99 | **`offers.json` se alinea a $3.99** | El precio que cobra es el de la página, porque la página tiene el checkout real. Alinear el catálogo no cambia nada comercial; cambiar la página sí cambiaría el precio de un producto vivo |
| 6 | ¿Fotos de las 12 apps? | **Sin fotos** | Las 10 `imgur.com/*_IMG.jpg` eran 404 y degradaban cada post a texto plano sin avisar. Copy + botones inline es más limpio que una imagen rota |
| — | `originalPrice` del bundle | **$41.93 → $40.93** | La suma real de los 7 precios de página es $40.93. El descuento real es **51.2%**, así que la etiqueta pasó de "52%"/"50%" a **"51% off"** |

### 7.3 Pendientes — siguen bloqueando, no las puedo cerrar yo

| # | Pregunta | Por qué sigue abierta |
|---|---|---|
| 2 | El ID numérico del grupo | No está en ningún archivo del repo. Un invite link no permite postear: el bot tiene que ser **admin** del grupo. Sin ese dato el bot publica solo en el canal y lo dice en el log |
| 4 | Bundle: ¿`V107097103W` o `D93257466P`? | Dejé `V107097103W` (770 referencias) porque no tengo evidencia de que el otro esté malo. `D93257466P` aparece en 6 archivos (`checklist-ventas.html`, 2 artículos, README). Necesito que decidas cuál cobra |
| 7 | Meta para subir frecuencia | Definí el gate pero no el número: ¿1 venta confirmada o 5? |
| — | `README.md` dice "11 Apps" (hay 12) y Astral Lab a $3.99 (real $6.99) | No lo toqué: es doc, no el bot. Queda como inconsistencia conocida |

---

## 8. Lo que NO voy a hacer sin que lo pidas explícitamente

- No cambio precios de páginas vivas ni creo IDs de Hotmart.
- No toco `landing-pages/` — ya están corregidas y auditadas.
- No commiteo sin que lo pidas.
- No subo la frecuencia por encima de 18 slots sin que se vea una venta confirmada.

---

## 9. Implementado (2026-10-03)

Lo que sí quedó escrito y verificado:

| Archivo | Qué cambió |
|---|---|
| `scripts/bots/data/offers.json` | URLs de los 7 libros ya no dan 404 (ahora apuntan a los `-pdf.html` reales), checkout real por libro, 4 precios alineados a la página, `originalPrice` a $40.93, `discountLabel` "51% off", `_meta.rejectedOffers` con los 4 descartes |
| `telegram-bot/bot.py` | Reescrito: lee el catálogo, sin ofertas hardcodeadas, sin imágenes, 18 slots/hora con ventana de silencio, canal + grupo, UTM, rotación persistida, kill switch, comandos de admin reales |
| `telegram-bot/test_bot.py` | Nuevo. 15 tests que fijan el invariantes (integridad, precios, URLs en disco, cadencia, UTM, PTB) |
| `telegram-bot/cha0s-bot.service` | Token fuera del unit (`EnvironmentFile`), documenta `TG_CATALOG_PATH` obligatorio en el servidor |

**Defectos críticos que quedan cerrados en el bot:** los 2 checkouts con placeholder que se publicaban al canal, el drift web-arreglado/bot-no, las 10 fotos 404, los claims inventados ("4.7★", "128+ reviews", "7-day guarantee"), los precios COP sin fuente, la mezcla de dos identidades de canal, y un defecto nuevo que encontré al reescribir: **los comandos de admin nunca estuvieron registrados** — el bot creaba `Bot` pero nunca un `Application`, así que `/testpost`, `/status`, `/kpi` y `/flash` no existían en producción.

**Defecto nuevo encontrado al reescribir (y corregido):** PTB 22 sigue aceptando `disable_web_page_preview`, pero está deprecado en favor de `link_preview_options`. El bot lo pasaba en dos sitios; un test ahora falla si vuelve a aparecer.

### 9.1 Antes de que esto se publique

```powershell
# 1. Tests (no tocan la red)
$env:PYTHONIOENCODING="utf-8"; python telegram-bot\test_bot.py

# 2. Ver el texto exacto SIN enviar nada
$env:TG_TOKEN="x"; $env:TG_DRY_RUN="1"; python telegram-bot\bot.py

# 3. En el servidor: el catálogo tiene que estar a mano
#    TG_CATALOG_PATH=/home/ubuntu/cha0s-bot/offers.json

# 4. grupo: agregar el bot como admin, escribir un mensaje ahí,
#    y poner TELEGRAM_GROUP_CHAT_ID con ese id
```

### 9.2 Lo que sigue sin poder medirse

No hay forma de demostrar todavía que esto vende más: falta `tg_offer_click`, falta el ledger de cobros (B-004) y las 12 apps siguen con `listingStatus: external_listing_unverified`. El bot ahora apunta a destinos reales, pero "apuntar a un checkout real" no es lo mismo que "cobrar". El siguiente gate es una venta confirmada, no un post enviado.

---

## Anexo — comandos de verificación

```powershell
# Placeholders que NO deben existir en el bot
Select-String -Path telegram-bot\bot.py -Pattern '\[HOTMART_|\[ID\]'

# Fotos 404
Select-String -Path telegram-bot\bot.py -Pattern 'imgur\.com/.*_IMG\.jpg'

# Ofertas reales del catálogo (post-fix debe dar 12 apps + 7 libros + 1 bundle)
node -e "const x=require('./scripts/bots/data/offers.json');console.log(x.apps.length,x.books.length,Object.keys(x.bundle).length)"

# El bot NO está cubierto por tests
npm test   # corre verify_play_catalog + pytest scripts/ + vitest scripts/bots/test/ — ninguno toca bot.py
```
