# Plan Tráfico Autopilot — 1 venta/hora sin pagar (auditado 2026-10-12)

## Veredicto de la auditoría
La automatización YA EXISTE en el repo, construida en el MASTER_EXECUTION_PLAN 3.3.x.
Lo que falta no es código: es (1) 2 API keys gratis, (2) un programador de tareas,
(3) un puente entre las tarjetas PNG nuevas y el calendario social.

## Lo que ya tienes construido (auditado línea por línea)

| Activo | Script | Estado | Costo |
|---|---|---|---|
| Publicación diaria Pinterest API v5 + Telegram + X | `scripts/social-publish.js` (`npm run social:daily`) | ✅ Completo: calendario 13 pins/7 días + 30 tweets, evergreen rotation, feedback loop de performance | Gratis (solo keys) |
| Bot Telegram con catálogo + auto-respuesta ventas | `scripts/bots/telegram-bot.js` (+ Groq AI opcional) | ✅ Funcional, canal @cha0smagicklabs, grupo inner-circle | Gratis |
| Bot Discord | `scripts/bots/discord-bot.js` | ✅ | Gratis |
| Generador de artículos blog + imágenes + sitemap | `projects/scripts/generate-articles.py`, `generate_blog_images.py`, `gen_sitemap.py` | ✅ (820+ posts ya publicados así) | Gratis |
| Análisis diario de performance → prioriza contenido | `scripts/analytics-daily.js` (`npm run analytics:daily`) | ✅ Con smoke test | Gratis |
| Oportunidades de enlaces SEO | `scripts/seo/link-opportunities.mjs` (`npm run links:scan`) | ✅ | Gratis |
| Imágenes para pins | `pins/output/` | ⚠️ Estáticas, no regeneran con las tools nuevas | — |

## Los 4 movimientos del autopilot (en orden de palanca)

### 1. Programar lo que ya existe (30 min, $0)
Con el scheduler (Task Scheduler de Windows vía plugin):
- `social:daily` → diario 09:00 (Publishes tool-of-the-day a Telegram + Pinterest si hay token)
- `analytics:daily` → diario 06:00 (dry-run por defecto; --live cuando haya keys GA4)
- `links:scan` → semanal lunes
- `bot:telegram` → proceso permanente (atención de ventas 24/7, auto-respuestas)
Riesgo: `social:daily` sin keys = solo logs; no falla (skip-if-no-key verificado).

### 2. Las 2 keys gratis que faltan (15 min, $0)
- **TELEGRAM_BOT_TOKEN**: BotFather → /newbot → 2 min. Canal ya definido (@cha0smagicklabs).
- **PINTEREST_TOKEN + PINTEREST_BOARD_ID**: developers.pinterest.com → app gratuita →
  token con boards:read,pins:write. **Pinterest es tu canal #1**: audiencia ocultista
  masiva, tráfico con intención, y el API v5 es gratuito sin límite práctico.
- X/Twitter free tier NO permite postear por API (de pago) → queda fuera; el calendario
  de 30 tweets puede postearse manual o vía el bridge (skip-if-no-key, ya preparado).
- Ambas keys van SOLO en `.env` (patrón existente, nunca en código).

### 3. Puente PNG cards → social (el eslabón nuevo, 1-2h)
Las tarjetas PNG del share viral viven solo en el navegador del visitante. Para
alimentar Pinterest/Telegram con visuales frescos diarios:
- Nuevo script `scripts/gen-daily-pin.mjs`: Playwright (ya instalado) abre la tool del
  día, ejecuta su demo, captura el resultado sobre el tema navy/ámbar (1080×1920 para
  Pinterest), watermark + URL + REF. Guarda en `pins/output/daily/<slug>.png`.
- `social-publish.js daily` ya prioriza pins con `file` existente → wiring directo.
- Regla anti-spam: 1 tool/día, rotación de 61 días = contenido nuevo 2 meses por ciclo.

### 4. IndexNow + sitemap vivo (30 min, $0)
- `data/<key>.txt` + ping a api.indexnow.org tras cada build → indexación instantánea
  en Bing/Yandex/DuckDuckGo (Google no soporta IndexNow; ahí el sitemap manda).
- `gen_sitemap.py` al final del pipeline de artículos.

## Cadencia resultante (sin tocar nada humano)
06:00 analytics-daily → 09:00 social:daily (tool del día + pin + tweet calendar +
Telegram) → bots vivos 24/7 → semanal links:scan → mensual lote de artículos →
IndexNow tras cada build.

## Matemática honesta
61 tools × 1 post/día ≈ 61 días de contenido perennne en 3 canales con feedback loop
que re-prioriza lo que convierte. Con 10K impresiones/día en Pinterest y un CTR del
1.5% + conversión site del 2-3% = 3-5 visitas compradoras/día desde un canal solo.
La viralidad de las PNG cards (M1) multiplica lo anterior — cada visitante es un
medio de distribución adicional.

## Qué NO hacemos (y por qué)
- Comprar tráfico: pediste $0. El retargeting Meta ($5/día) queda como opción cuando
  la unit economics lo justifique — es el único acelerón que el dinero compra.
- Spam en Reddit/grupos ajenos: baneos + daño de marca. Solo canales propios + Pinterest.
- Generar artículos masivos sin revisión: riesgo de thin content = penalización SEO.
  Cadencia mensual con revisión humana mínima.

## Checklist de activación (orden de ejecución)
1. [ ] TELEGRAM_BOT_TOKEN en .env (tú: 2 min)
2. [ ] PINTEREST_TOKEN + BOARD_ID en .env (tú: 15 min)
3. [ ] Registrar 4 jobs en el scheduler (yo: 30 min)
4. [ ] gen-daily-pin.mjs + wiring (yo: 1-2h)
5. [ ] IndexNow key + script ping (yo: 30 min)
6. [ ] `npm run social:selftest` + primer `social:daily --dry-run` (verificación)
