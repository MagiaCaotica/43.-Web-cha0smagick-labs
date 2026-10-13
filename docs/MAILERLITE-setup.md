# MailerLite — Guía de configuración (todo lo que TÚ haces en el dashboard)

> Contexto: MailerLite ya está en uso para los lead magnets (EN + ES). Lo pendiente es la
> **monetización por email** (secuencias de venta). Los emails NO se envían desde la web:
> la web solo captura, MailerLite envía y automatiza. Todo lo de abajo es gratis en el plan free.

## 1. Grupos (Audience → Groups)

| Grupo | Para qué |
|---|---|
| `leads-es` | Descargan Guía Rápida de Magia del Caos (ES) |
| `leads-en` | Descargan Quickstart Guide (EN) |
| `compradores` | Compraron algo (Hotmart o Google Play) — se llena vía webhook, ver §5 |

## 2. Formularios (Forms → Embedded)

- En el dashboard crea un **Embedded form** por lead magnet y pega el código que MailerLite te da
  en las páginas existentes de `lead-magnet/` (reemplaza el formulario actual si lo hay).
- Configura cada formulario para añadir al grupo correcto (`leads-es` / `leads-en`).
- Nada más en la web: sin backend, sin API keys expuestas.

## 3. Automación de venta ES: "Quickstart to Buyer"

(Automation → Create automation → trigger: *suscriptor entra al grupo `leads-es`*)

Copia el contenido de `email-sequences/quickstart-to-buyer.json` (asuntos y cuerpo ya están redactados):

| Paso | Delay | Asunto | CTA |
|---|---|---|---|
| e1 | Inmediato | Tu Quickstart está listo 📜 | Entrega el PDF |
| e2 | Día 1 | El error #1 en sigilos (y cómo evitarlo) | Valor puro |
| e3 | Día 3 | Cómo validé mi intuición con datos (no fe) | Valor puro |
| e4 | Día 5 | El grimorio que desearía tener a los 20 años | Valor + link libros |
| e5 | Día 7 | ⏰ 24h: Complete Collection -$40 (Expira mañana) | **CTA de venta** |

En e5 pon el link con UTM: `https://cha0smagicklabs.com/landing-pages/flash-sale.html?utm_source=mailerlite&utm_medium=email&utm_campaign=quickstart-to-buyer`
(mientras el producto $99 de Hotmart no esté activo, el landing cae a los canales vivos: apps en Play + libros bundle $19.99).

## 4. Automación post-compra: "Post-Purchase Upsell"

(`email-sequences/post-purchase-upsell.json` tiene variantes; elige la versión ES)

- Trigger: *suscriptor recibe la etiqueta `comprador`* (se la pone el webhook del §5).
- Envío 1: 24–48 h después de la compra — upsell a **Complete Access $49.99** o **Inner Circle $9/mes**.
- Máximo 2–3 emails; no vendas de más a quien ya compró.

## 5. Hotmart → MailerLite (gratis)

Opciones (de más simple a más automática):

1. **Zapier free** (100 tareas/mes): Hotmart trigger "Compra aprobada" → MailerLite "Add subscriber to group `compradores`" + tag. Sobra para empezar.
2. **Make free** (1.000 ops/mes): mismo flujo, más límite.
3. **Manual** (0 herramientas): cuando Hotmart te avise de una venta, añade el comprador a mano con la etiqueta `comprador`. Con pocas ventas/día es sostenible y gratis.

Google Play NO notifica compras externas → los compradores de apps no llegan por webhook;
puedes capturarlos con un email de soporte/registro voluntario o dejarlos fuera de la
automatización post-compra por ahora.

## 6. Checklist final (10 minutos)

- [ ] Grupos `leads-es`, `leads-en`, `compradores` creados
- [ ] Formularios embedded pegados en las 2 páginas de lead magnet
- [ ] Automación "Quickstart to Buyer" activada (5 emails, delays 0/1/3/5/7 días)
- [ ] Automación "Post-Purchase Upsell" creada (trigger tag `comprador`, queda en pausa hasta tener webhook)
- [ ] Zapier/Make: Hotmart → MailerLite conectado (o modo manual decidido)
- [ ] Email de prueba enviado y revisado en móvil
- [ ] e5 con UTM `utm_source=mailerlite` (así miden las ventas que llegan por email)

## Por qué esto importa (paradigma)

El email es el único canal que te pertenece: cada lead capturado entra a una secuencia que
trabaja solo, 7 días seguidos, sin costo. Con la conversión típica de secuencias (2–5% de la
lista compra en 30 días), 100 leads/semana = 2–5 ventas/semana extra sin tráfico nuevo.
