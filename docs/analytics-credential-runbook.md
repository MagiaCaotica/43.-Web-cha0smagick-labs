# Runbook de credenciales y conexión

**Estado:** preparado para ejecución; no contiene secretos
**Objetivo:** conectar datos reales sin convertir dry-run en evidencia

## 1. Preparación local

1. Crear una copia local de `.env.example` como `.env`.
2. Completar solo secretos y IDs en la máquina autorizada.
3. Mantener `.env`, `logs/`, archivos de service account y exports fuera de Git.
4. Ejecutar primero el health check en dry-run.

```powershell
Copy-Item .env.example .env
npm run analytics:health
npm run analytics:smoke
npm run analytics:daily -- --dry-run
```

No pegar secretos en issues, commits, HTML, planes o capturas.

## 2. GA4

### Browser público

`G-V6LHCPN9TK` es un identificador público de medición, no una contraseña. El smoke test confirma si el navegador realmente lo envía después del consentimiento.

### Data API y Measurement Protocol

Configurar:

- `GA4_PROPERTY_ID`
- `GA4_CLIENT_ID`
- `GA4_MP_API_SECRET`
- `GOOGLE_APPLICATION_CREDENTIALS`, solo como ruta local a un archivo no commiteado

Validar que el service account tenga permiso mínimo de lectura. Ejecutar primero `ga4-mp.js --selftest` y luego `--dryrun`; el modo live requiere una prueba explícita y una fecha pequeña.

## 3. Google Play

1. Crear o seleccionar un service account en Google Cloud.
2. Vincularlo al Play Console con acceso mínimo.
3. Guardar el JSON fuera del repositorio.
4. Configurar `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON` o `GOOGLE_APPLICATION_CREDENTIALS`.
5. Configurar `GOOGLE_PLAY_PACKAGE_NAME` y `PLAY_FETCH_DAYS`.
6. Ejecutar `ga4-play-purchases.js --selftest` y después `--dryrun --save`.
7. Comparar una fecha con el panel Play antes de activar live.

No se debe suponer que una compra de Google Play está atribuida a una herramienta solo porque el usuario hizo clic.

## 4. Hotmart y webhook

1. Crear un secreto de webhook en Hotmart.
2. Configurar `HOTMART_WEBHOOK_SECRET`.
3. Mantener `WEBHOOK_DRYRUN=true` hasta validar firma y reintentos.
4. Si se usa MailerLite, configurar `MAILERLITE_API_KEY` con permisos mínimos.
5. Ejecutar `webhook-receiver.js --selftest` y después una prueba firmada no destructiva.

El receptor no debe devolver datos de clientes a logs públicos.

## 5. Cohortes y ventas

- `COHORT_SUBSCRIBERS_CSV` y `COHORT_SALES_CSV` deben ser exports fechados y controlados.
- `PLAY_SALES_CSV_DIR` solo debe contener archivos de la fuente autorizada.
- Ejecutar `cohort-analysis.py --dry-run` y `play-sales-report.py --dry-run`.
- Registrar fecha, fuente, número de filas, hash del archivo y estado de reconciliación; no registrar PII.

## 6. Adsense

No se encontró un adaptador `*adsense*` ni una API configurada. No se debe inventar un ID ni reportar ingresos de Adsense desde el código actual. Para conectar Adsense se necesita una de estas vías:

- exportación oficial agregada;
- API autenticada y aprobada;
- revisión manual de un export fechado.

El revenue de Adsense debe mantenerse separado de compras de apps y Hotmart.

## 7. Primer live run

1. `npm run analytics:health -- --save` y confirmar `mode=live-capable`.
2. Ejecutar cada adaptador en modo live con una fecha pequeña.
3. Comparar cada total con la fuente oficial.
4. Guardar `logs/analytics-health.json` y los reportes generados; Git los ignora.
5. Solo después cambiar flags dry-run a `false` y programar la ejecución diaria.

## 8. Credenciales en GitHub

`gh` no está instalado en este entorno, por lo que no se pudo inspeccionar GitHub Secrets. Si se usa Actions, configurar secretos desde GitHub Settings/API y nunca en YAML. Mantener `.env` y service-account JSON fuera del repositorio.

## 9. Rotación y revocación

Si una credencial aparece en un log, commit, issue o captura:

1. revocarla inmediatamente;
2. emitir una nueva;
3. eliminar el artefacto expuesto;
4. revisar auditoría de accesos;
5. documentar fecha, alcance y acción.

## 10. Definición de “live”

Un sistema está live solo cuando:

- hay una solicitud real exitosa a la fuente;
- el reporte tiene `dry_run=false`;
- el total se reconcilia con la fuente;
- la fecha y la zona horaria están documentadas;
- no hay PII en el output;
- la ejecución se puede repetir y detectar duplicados.

La presencia de un ID público, un script o un webhook no es suficiente.
