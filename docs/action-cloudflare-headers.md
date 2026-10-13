# Activar cabeceras de seguridad y cache (Cloudflare)

**Estado actual: la politica del sitio NO se aplica en produccion.**

`_headers` en la raiz del repo esta escrito en la sintaxis de Netlify. GitHub Pages la ignora:
no lee ese archivo y no emite ninguna de las cabeceras que define. Verificado en vivo
(2026-10-12) contra `https://cha0smagicklabs.com/`: `X-Content-Type-Options`, `X-Frame-Options`,
`Referrer-Policy`, `Strict-Transport-Security`, `Content-Security-Policy` y `Permissions-Policy`
todas vienen `null`. Lo unico que GitHub Pages si emite es `server: GitHub.com`, `gzip` y
`Cache-Control: max-age=600` (fijo, no configurable).

Consecuencia: la CSP nunca se evaluo, el HSTS nunca se activo, el cache de assets no existe y
el sitio queda sin proteccion de framing, sin `nosniff` y con un TTL de cache de 10 minutos
en HTML. El `_headers` no es basura: es el diseno correcto, solo que en la plataforma equivocada.

## Que hay que hacer

Poner Cloudflare por delante del dominio. Es la unica via que da control real de cabeceras sin
migrar de hosting. Coste: el plan Free basta para esto.

1. Crear la cuenta y anadir `cha0smagicklabs.com`.
2. DNS: cambiar los records CNAME de GitHub Pages a los que Cloudflare asigna (rojo nube).
   El dominio ya esta en un CNAME a `magia-caotica.github.io`; solo cambia el destino.
3. SSL/TLS: modo **Full (strict)**. GitHub Pages ya emite certificado valido para el dominio,
   asi que strict funciona sin excepciones.
4. Rules -> Response Header Modification: crear una regla para el host completo con las reglas
   de abajo. Cloudflare no lee `_headers`, hay que traducirlas.
5. Verificar con `curl -sI https://cha0smagicklabs.com | grep -i 'content-security'` y confirmar
   que aparecen `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, `Content-Security-Policy` y `Permissions-Policy`.

## Reglas a traducir (equivalente exacto de `_headers`)

Cloudflare permite hasta 100 reglas por cuenta. Traduccion directa:

Regla 1 — host completo `cha0smagicklabs.com` (equivalente al bloque `/*`):

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Regla 2 — CSP (ojo: Cloudflare a veces rechaza el valor si lleva `;` en某些 campos; si falla la
regla, partirla en dos o usar un Response Header Transform Worker):

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com translate.google.com unpkg.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com unpkg.com; font-src fonts.gstatic.com; img-src 'self' data: https: *.tile.openstreetmap.org *.basemaps.cartocdn.com; connect-src 'self' www.google-analytics.com translate.google.com *.basemaps.cartocdn.com; frame-src translate.google.com; media-src 'self'
```

Regla 3 — cache de assets, cuando `http.request.uri.path` empieza por `/assets/`:

```
Cache-Control: public, max-age=31536000, immutable
```

Regla 4 — cache de HTML, cuando `http.request.uri.path` acaba en `.html`:

```
Cache-Control: public, max-age=3600
```

Regla 5 — `/sw.js`:

```
Cache-Control: no-cache
Service-Worker-Allowed: /
```

Regla 6 — `/manifest.json`:

```
Cache-Control: public, max-age=3600
```

## Antes de activar la CSP

La CSP lleva `'unsafe-inline'` y `'unsafe-eval'` porque el sitio tiene JSON-LD inline, el
snippet de MailerLite inline, los botones de analytics inline y el service worker. No es una CSP
estrecha, asi que activarla no va a romper el sitio. Aun asi, aplicar en este orden para poder
diagnosticar cualquier fallo:

1. Anadir las cabeceras sin CSP. Confirmar que el sitio sigue bien en el movil.
2. Activar la CSP en modo `Content-Security-Policy-Report-Only` con
   `report-uri https://<dominio-de-reportes>/` y revisar los violaciones.
3. Cambiar a `Content-Security-Policy` cuando el reporte salga limpio.

Si aparece `Refused to load ... 'unsafe-inline'`, la causa es siempre una de estas cuatro
(script inline de MailerLite, config de gtag, JSON-LD, o el worker del service worker).
La solucion temporal es `script-src ... 'unsafe-inline'`, que ya esta en la regla.

## Lo que Cloudflare NO resuelve

- **`service worker` y `sw.js`**: sigue funcionando igual, Cloudflare no lo toca. El
  `Service-Worker-Allowed: /` de la regla 5 es lo que permite el scope raiz.
- **El HTML que GitHub Pages sirve con `Cache-Control: max-age=600`**: las reglas 4 y 6 pisan ese
  valor, pero hay que confirmar que en la respuesta de Cloudflare gana la regla y no el origin.
  Si gana el origin, hay que desactivar "Origin Cache" / usar una Cache Rule de Cloudflare en vez
  de una Response Header Rule.
- **El repo sigue siendo la fuente de verdad**: `_headers` se puede dejar en el repo como
  documentacion de la politica, pero no hay que esperar que GitHub Pages lo lea.

## Alternativa sin coste: GitHub Actions + workflow

Si no se quiere meter Cloudflare, la unica forma de fijar cabeceras sobre GitHub Pages es un
proxy. No hay soporte nativo. Un Worker de Cloudflare en el plan Free (10M req/mes) puede hacer
lo mismo que el paso 4 sin cambiar el DNS a orange-nube, pero sigue siendo Cloudflare.
La decision real es: o Cloudflare, o se acepta que la CSP y el HSTS no existen.
