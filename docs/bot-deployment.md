# Bot Deployment — Cha0smagick Labs (plan 3.1.10)

Guía reproducible para desplegar los bots de Telegram y Discord en un servidor Linux.

## Prerrequisitos

- Node.js 22+ (`node --version`)
- PM2 (`npm install -g pm2`) **o** systemd (opción B)
- El repo clonado en `/opt/cha0smagick-labs`
- `.env` en la raíz del repo con: `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `GROQ_API_KEY`

## Opción A — PM2 (recomendada para desarrollo)

```bash
cd /opt/cha0smagick-labs
npm install --omit=dev
pm2 start ecosystem.config.js     # ambos bots online con auto-restart
pm2 install pm2-logrotate         # rotación de logs (10MB por defecto)
pm2 save                          # persiste la lista de procesos
pm2 startup                       # arranca en boot
```

Comandos útiles:
```bash
pm2 status                        # estado de ambos bots
pm2 logs chaos-telegram-bot       # logs en vivo
pm2 reload ecosystem.config.js    # reinicia con código nuevo (deploy)
```

## Opción B — systemd (producción sin PM2)

```bash
sudo cp deploy/systemd/chaos-*.service /etc/systemd/system/
sudo mkdir -p /var/log/cha0s
sudo systemctl daemon-reload
sudo systemctl enable --now chaos-telegram-bot chaos-discord-bot
```

Comandos útiles:
```bash
systemctl status cha0s-telegram-bot
journalctl -u cha0s-discord-bot -f
sudo systemctl restart cha0s-telegram-bot   # deploy
```

## Health checks (plan 3.1.5)

| Bot | Endpoint |
|---|---|
| Telegram | `curl http://localhost:3000/health` → `{"status":"ok","bot":"telegram",...}` |
| Discord | `curl http://localhost:3001/health` → `{"status":"ok","bot":"discord",...}` |

Uptime externo (plan 3.1.8, manual): apuntar UptimeRobot/Better Uptime a los endpoints
`/health` (puertos 3000/3001 expuestos vía firewall o túnel).

## GDPR (plan 3.1.12)

- `GET /delete-my-data?chat_id=XXX` (Telegram, puerto 3000) o `?user_id=XXX` (Discord, puerto 3001)
- Registra la solicitud en `logs/gdpr-deletion-requests.log` (JSON lines) y responde confirmación
- La eliminación REAL en sistemas externos (MailerLite, Hotmart) es manual/API: ejecutar
  desde el dashboard de cada servicio usando el ID registrado

## Logs

Ambos bots usan logging estructurado JSON (`scripts/bots/logger.js`, plan 3.1.6):
cada línea es `{"timestamp","level","context","message"}`. Levels: `info`, `warn`, `error`.

## Deploy desde CI (plan 3.2.5, pendiente de servidor)

El workflow `.github/workflows/bot-deploy.yml` requiere secrets de GitHub:
`BOT_HOST` (IP/hostname), `BOT_SSH_KEY` (clave privada), `BOT_USER`. Push a `main`
→ SSH + `pm2 reload ecosystem.config.js`.
