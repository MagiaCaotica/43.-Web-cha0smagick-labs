# Viral Growth — 5 movidas (2026-10-12)

Objetivo: pasar de ~1 venta/día a ventas por hora = **tráfico × conversión × ticket**.
Estado code-side: COMPLETADO y testeado. Lo que queda requiere dashboards externos.

## M1 — Artefactos compartibles (code: ✅)
`js/conversion.js` inyecta en TODAS las tool pages una barra: copiar enlace (utm),
WhatsApp, X, y **tarjeta PNG 1080×1080** con el resultado del visitante + watermark
`cha0smagick.com/tools/<slug>` + código REF. En móvil usa Web Share API nativa.
Test: `node scripts/test-viral.mjs`.
- **Pendiente tuyo**: publicar (deploy). Compartir funciona sin config externa.

## M2 — Retargeting Meta (code: ✅ ViewContent/InitiateCheckout ya emiten)
El pixel dispara `PageView` global, `ViewContent` en cada página de books/apps y
`InitiateCheckout` en clicks de pago. Con eso, en **Meta Events Manager**:
1. Verificar que llegan los 3 eventos (Events Manager → Test Events, abrir la web).
2. Crear audiencias: (a) Todos los visitantes 30 días, (b) ViewContent books/apps 14
   días, (c) InitiateCheckout sin compra 7 días (carrito caliente).
3. Campaign: objetivo **Sales**, бюджет desde $5/día, creativos = las tarjetas PNG de
   las tools + testimonios. Retargeting (b)+(c) primero: es la conversión más barata.

## M3 — Order bump Hotmart (dashboard externo)
En Hotmart → **Herramientas → Order Bump / Upsell**:
1. En el checkout de cada PDF, añade como bump el **bundle completo** (landing ya
   existe: `landing-pages/books-bundle.html` para la descripción).
2. Upsell post-compra: app Android correspondiente (Play Store link) o bundle.
3. Verifica en `landing-pages/flash-sale.html` que el link de compra apunta al
   checkout correcto. Ticket sube sin tráfico extra.

## M4 — Social proof (code: ✅, datos: te toca)
Strip de confianza inyectado en todas las páginas de books/apps + testimonios.
- **Pendiente tuyo**: `data/social-proof.json` está vacío A PROPÓSITO. Cuando un
  comprador escriba (Hotmart, email, WhatsApp), pide permiso y pega la cita literal:
  `{"text":"…","author":"M. — Colombia"}`. Máx 3 se muestran. NUNCA inventes citas.

## M5 — Email automation MailerLite (dashboard externo)
Eventos GA4 ya emitidos: `form_submit`, `generate_lead` (captura 30s/50%/exit),
`tool_funnel_view`, `tool_funnel_click`, `share_artifact`.
1. MailerLite → Automations → crear flujo **"Usó herramienta"**: trigger = form del
   lead magnet → Día 1: cómo exprimir la herramienta que usó + link → Día 3: pitch del
   libro relacionado con esa categoría (usar el mapa de `data/tool-funnels.json`).
2. Segundo flujo **"Carrito abandonado"** si MailerLite recibe e-commerce (opcional).

## Verificación
```
npm run build:js
node scripts/test-viral.mjs      # 10/10
node scripts/test-tool-funnels.mjs  # 331/331
```
