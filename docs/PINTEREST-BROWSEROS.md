# Publicar en Pinterest desde BrowserOS (runbook)

> Guía operativa verificada. Todo lo de aquí se probó en producción: **7 pines publicados** con la
> sesión real de la cuenta `Cha0smagick Labs` (`magiacaoticamagiadelcaosprctic`).
>
> Última verificación: 2026-10-14 · commits `6379c057`, `bba70e1a`

---

## 0. Por qué este método (y no la API)

Pinterest restringe la **API v5** por *tier* de la app. Con la app en **Trial access** la API responde:

```
403 {"code":29,"message":"Apps with Trial access may not create Pins in production
      https://api.pinterest.com - use API Sandbox https://api-sandbox.pinterest.com instead."}
```

La **interfaz web de Pinterest no está sujeta a ese tier**. Publicando por la UI con la sesión del
usuario, los pines se crean en los tableros reales aunque la app siga en Trial.

Por eso el pipeline de publicación se apoya en el navegador, no en `api.pinterest.com`.

---

## 1. Piezas del sistema

| Pieza | Qué es |
|---|---|
| BrowserOS | Chromium 155 (`C:\Users\USER\AppData\Local\BrowserOS\Application\chrome.exe`). Conserva el perfil real del usuario con la sesión de Pinterest iniciada. |
| CDP `:9222` | Puerto de depuración que abre el script. PermiteControlledar el navegador desde Node. |
| `scripts/pin-browser.mjs` | El publicador. Conecta por CDP, abre el pin-builder, sube la imagen, rellena título y enlace y pulsa Publicar. |
| `pins/output/daily/` | La cola. Un `.png` + un `.json` (metadatos) por pin. |
| `pins/output/daily/*.published` | Marcadores. Si existe, ese pin ya se publicó y se salta. |
| Job `pinterest-buffer` | Tarea programada de Windows: cada 2 h ejecuta el script → 12 pines/día espaciados. |

---

## 2. Ejecutar manualmente

```powershell
# Ver la cola sin publicar nada
node scripts\pin-browser.mjs --dry-run

# Publicar los 3 primeros pendientes (tope por defecto)
node scripts\pin-browser.mjs

# Publicar uno concreto
node scripts\pin-browser.mjs --only=s07

# Cambiar el tope de un ciclo
$env:PIN_BROWSER_LIMIT = "1"; node scripts\pin-browser.mjs
```

Salida esperada:

```
pin-browser: pendientes: 6 | tope por ciclo: 3
pin-browser: publicado s07-<slug> -> https://cha0smagicklabs.com/blog/...
pin-browser: publicado s08-<slug> -> https://cha0smagicklabs.com/blog/...
pin-browser: fin del ciclo
```

## 3. Job programado

```powershell
show my jobs            # ver el job pinterest-buffer
run pinterest-buffer now   # dispararlo a mano
delete job pinterest-buffer  # borrarlo
```

Cron actual: `13 */2 * * *` → 12 ejecuciones/día, 3 pines por ejecución.

---

## 4. El flujo exacto (si hay que tocar el script)

Este es el mapeo del DOM, verificado el 2026-10-14. Los ids llevan sufijo uuid, por eso se usan selectores de prefijo.

```js
const { chromium } = require('playwright');
const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
const ctx = browser.contexts()[0] ?? await browser.newContext();
const page = ctx.pages()[0] ?? await ctx.newPage();

// 1) CRÍTICO: sin esto Pinterest NO renderiza y todos los botones miden 0x0
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setFocusEmulationEnabled', { enabled: true });
await cdp.send('Page.bringToFront');

// 2) Abrir el constructor de pines
await page.goto('https://co.pinterest.com/pin-builder/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4500);

// 3) Dismiss del onboarding (solo la primera vez)
const ent = page.locator('button:has-text("Entendido")');
if (await ent.count()) await ent.first().click({ timeout: 2500 });

// 4) Subir la imagen
await page.locator('input[type=file]').first().setInputFiles(pngPathEnDisco);
await page.waitForTimeout(9000);

// 5) Título y enlace
await page.fill('textarea[id^="pin-draft-title-"]', titulo);
await page.fill('textarea[id^="pin-draft-link-"]', url);
await page.waitForTimeout(1500);

// 6) Publicar — OJO: el test-id dice "board-dropdown" pero es el botón Publicar
await page.locator('[data-test-id="board-dropdown-save-button"]').first().click();

// 7) Confirmación
await page.locator('[role=dialog]:has-text("Has creado un Pin"), [role=dialog]:has-text("created a Pin")')
  .waitFor({ state: 'visible', timeout: 30000 });

// 8) Cerrar el modal de éxito
await page.keyboard.press('Escape');
for (let i = 0; i < 4; i++) { await page.mouse.click(20, 20); await page.waitForTimeout(150); }
```

### Mapa de selectores

| Qué | Selector | Notas |
|---|---|---|
| Subir imagen | `input[type=file]` | hay exactamente 1 |
| Título | `textarea[id^="pin-draft-title-"]` | placeholder "Añade un título" |
| Enlace destino | `textarea[id^="pin-draft-link-"]` | placeholder "Añade un enlace de destino" |
| Descripción | `textarea[id^="pin-draft-description-"]` | **NO existe** en el formulario actual |
| Texto alternativo | botón `pin-draft-alt-text-button` | existe, no se rellena |
| Selector de tablero | `board-dropdown-select-button` / `board-dropdown-item-selected` | por defecto queda "Occult Apps" |
| Botón Publicar | `[data-test-id="board-dropdown-save-button"]` dentro de `pin-builder-draft` | texto "Publicar" |
| Confirmación | `[role=dialog]:has-text("Has creado un Pin")` | modal de éxito |
| Onboarding | `button:has-text("Entendido")` | dismiss |

---

## 5. Trampas (cada una costó una iteración)

1. **Pestaña oculta = Pinterest no renderiza.** Si `document.hidden === true` la SPA monta el shell vacío, `body.innerText` devuelve `""` y todos los botones miden 0×0 → los clicks dan timeout. Se arregla con `Emulation.setFocusEmulationEnabled` + `Page.bringToFront`. **Este es el fallo nº1.**
2. **Sin `button:has-text("Crear Pin")` en el header.** Ese botón no existe en la barra superior. El script entra directo por URL a `/pin-builder/`, mucho más fiable.
3. **`/pin/create/` y `/pin/create/button/` están obsoletas.** Redirigen a `?show_error=true` o rompen el shell. La ruta buena es `https://co.pinterest.com/pin-builder/`.
4. **CORS.** La imagen NO se puede traer desde `cha0smagicklabs.com` con `fetch` dentro de la página (GitHub Pages no manda `Access-Control-Allow-Origin`). Se sube con `setInputFiles` leyendo el PNG de disco.
5. **El backdrop del modal de éxito intercepta los punteros.** Después de publicar, cualquier click falla con timeout. Cerrar con `Escape` + clicks en (20,20) antes de la siguiente iteración.
6. **`ERR_CONNECTION_REFUSED` a `127.0.0.1:9200`.** Son del **servidor propio de BrowserOS, que está muerto**. No son errores de Pinterest. Se pueden ignorar.
7. **No usar `browser.close()`** al final: mataría el navegador real del usuario y perdería la sesión.
8. **`require` no existe** dentro de `browser_run_code_unsafe` del MCP de Playwright. Los valores hay que pasarlos como literales.
9. **Endpoints internos**: `ImageUploadResource` devuelve 404 (`code 51`). Pinterest renombró los recursos internos; no replicarlos a mano, usar la UI.
10. **Ráfaga = riesgo de penalización.** No drenar los 13 pendientes de golpe. El tope por defecto (3) y el job cada 2 h existen por eso.

---

## 6. Automatizar el arranque de BrowserOS

El script no necesita que el navegador esté abierto: `ensureBrowser()` comprueba `http://127.0.0.1:9222/json/version` y, si no responde, lanza:

```
C:\Users\USER\AppData\Local\BrowserOS\Application\chrome.exe
  --remote-debugging-port=9222 --no-first-run --no-default-browser-check
```

**No se pasa `--user-data-dir` a propósito**: el ejecutable ya usa `C:\Users\USER\AppData\Local\BrowserOS\User Data`, que es donde está la sesión de Pinterest.

Override si hace falta:

```powershell
$env:BROWSEROS_CDP   = "http://127.0.0.1:9222"
$env:BROWSEROS_EXE   = "D:\ruta\chrome.exe"
```

---

## 7. Sessión: requisitos

La sesión debe estar iniciada en BrowserOS. Se comprueba en el propio navegador:

```js
await page.goto('https://www.pinterest.com/');
await page.waitForTimeout(3000);
await page.evaluate(() =>
  fetch('/resource/ApiResource/get/?source_url=/&data={"options":{"url":"/v3/users/me/"}}',
        { credentials: 'include' })
    .then(r => r.json())
    .then(d => ({ auth: d.resource_response.is_authenticated, user: d.resource_response.data.username }))
);
```

Debe devolver `auth: true` con `magiacaoticamagiadelcaosprctic`. Si devuelve `false`, hay que iniciar sesión en BrowserOS a mano.

Si algún día se cierra la sesión, el flujo OAuth sigue en `scripts/pinterest-token.mjs`
(`url` → `exchange "<code>"` → `boards`).

---

## 8. Cuándo dejar de usar este método

En cuanto Pinterest apruebe **Standard access** a la app:

1. Verificar que `scripts/pin-buffer.mjs` publica (API v5, mucho más limpio y sin navegador).
2. Desactivar el workflow `pins-hourly` de GitHub Actions para no duplicar pines.
3. Cambiar el job programado a `node scripts\pin-buffer.mjs`.

Comprobación rápida del token contra la API:

```powershell
$env:PINTEREST_TOKEN="pina_..."; $env:PINTEREST_BOARD_ID="1126251888005053062"
node scripts\pin-buffer.mjs --dry-run
node scripts\pin-buffer.mjs
```

Si responde `403 code 29`, sigue en Trial → sigue con `pin-browser.mjs`.

---

## 9. Resumen en una línea

> El job publica 3 pines cada 2 horas abriendo el pin-builder en el Chromium de BrowserOS con la
> sesión del usuario, subiendo la imagen del PNG, rellenando título y enlace, y marcando el archivo
> como `.published`. El Trial access de la app solo bloquea la API, no la web.
