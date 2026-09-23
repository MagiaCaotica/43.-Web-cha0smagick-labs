# 2.4.7 (R7) — Play Console RTDN → Cloud Function → Make.com webhook

Arquitectura:

```
Google Play Console (RTDN)
        │  Real-Time Developer Notifications
        ▼
Cloud Pub/Sub topic (play-rtdn)
        │  push subscription
        ▼
Cloud Function (rtdnHandler — deploy/cloud-function/rtdn-to-make/index.js)
        │  payload normalizado {type:'play-rtdn', kind, packageName, notificationType, purchaseToken, orderId, eventTime}
        ▼  HMAC X-Webhook-Signature: sha256=<hex>
Make.com webhook  →  Google Sheets  →  Telegram admin / MailerLite
```

## Cobertura

RTDN cubre **suscripciones** (purchased, renewed, canceled, expired, revoked, on_hold...) y
**compras anuladas** (voided purchases). Las ventas **one-time** de apps ($3.99–$14.99) NO llegan
por RTDN → para esas usar el fetch diario **2.4.8** (`scripts/play-sales-report.py`).

## Setup (activación — requiere cuenta GCP)

```bash
# 1. Crear topic Pub/Sub
gcloud pubsub topics create play-rtdn

# 2. Vincular en Play Console:
#    Play Console → Monetization setup → Google Play Billing → Linked topics
#    → añadir "play-rtdn" (la cuenta de servicio de Play obtiene acceso automático)

# 3. Deploy de la Cloud Function
gcloud functions deploy rtdnHandler \
  --runtime=nodejs20 \
  --region=us-east1 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars "RTDN_MAKE_WEBHOOK_URL=https://hook.eu.make.com/xxxx,RTDN_MAKE_WEBHOOK_SECRET=<secreto>,PLAY_PACKAGE_NAMES=com.cha0smagick.app1,com.cha0smagick.app2"

# 4. Crear la push subscription (endpoint = URL de la función)
gcloud pubsub subscriptions create play-rtdn-push \
  --topic=play-rtdn \
  --push-endpoint=https://us-east1-<project>.cloudfunctions.net/rtdnHandler \
  --push-auth-service-account=<service-account>@<project>.iam.gserviceaccount.com
```

## Variables de entorno

| Variable | Requerido | Descripción |
|---|---|---|
| `RTDN_MAKE_WEBHOOK_URL` | live | Webhook de Make.com destino |
| `RTDN_MAKE_WEBHOOK_SECRET` | recomendado | Secreto HMAC — el Make side debe verificar `X-Webhook-Signature: sha256=<hex>` (timing-safe) |
| `PLAY_PACKAGE_NAMES` | opcional | Allowlist de paquetes (coma separada); vacío = aceptar todos |

## Test

```bash
# Selftest local (payloads embebidos, sin red)
node deploy/cloud-function/rtdn-to-make/index.js

# Test end-to-end con mensaje de prueba
gcloud pubsub topics publish play-rtdn --message="$(echo -n '{"version":"1.0","testNotification":{"version":"1.0"}}' | base64 -w0)"
```

## Notas

- Mensajes inválidos → HTTP 200 `ignored` (Pub/Sub no reintenta); error reenviando → HTTP 500 (Pub/Sub reintenta con backoff).
- Logs: Cloud Functions stdout (structured) + local `logs/play-rtdn.jsonl`.
- Verificación del plan (R7): "webhook fires on Play purchase" → usar el test end-to-end con una compra real de prueba.
