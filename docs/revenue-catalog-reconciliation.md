# Reconciliación local de catálogo y checkout

**Fecha:** 2026-09-23  
**Alcance:** repositorio local y páginas públicas HTML. Este documento no sustituye evidencia de Hotmart, Google Play, analytics, CRM ni ventas.

## 1. Regla de evidencia

- **Verificado localmente:** el dato existe en el HTML público o en `scripts/bots/data/offers.json`.
- **Pendiente externo:** Hotmart/Google Play/CRM/analytics no tienen una URL, ID, captura o log primario disponible en este repositorio.
- **No afirmar:** publicación, disponibilidad, precio cobrado, conversión, tráfico o ingresos hasta obtener evidencia externa fechada.

## 2. Catálogo de apps reconciliado

Las 12 páginas `apps/*.html` son la superficie local de catálogo. Los siguientes valores coinciden con la página pública y con el catálogo que consumen los bots:

| slug | página | package ID local | precio mostrado | estado externo |
|---|---|---|---:|---|
| `psi-gym` | `/apps/psi-gym.html` | `com.cha0smagicklabs.zenercards` | US$3.99 | `external_listing_unverified` |
| `arcana-goetia` | `/apps/arcana-goetia.html` | `com.cha0smagick.sigilgeneratorfinal` | US$3.99 | `external_listing_unverified` |
| `norse-rune-oracle` | `/apps/norse-rune-oracle.html` | `com.japps.norse_oracle` | US$3.99 | `external_listing_unverified` |
| `dream-machine` | `/apps/dream-machine.html` | `com.cha0smagick.dreammachine` | US$3.99 | `external_listing_unverified` |
| `chaos-sigil-generator` | `/apps/chaos-sigil-generator.html` | `com.app.goetiansealsgeneratorapp` | US$3.99 | `external_listing_unverified` |
| `astral-lab` | `/apps/astral-lab.html` | `com.cha0smagicklabs.astralchart` | US$6.99 | `external_listing_unverified` |
| `eerieroads` | `/apps/eerieroads.html` | `com.cha0smagicklabs.eerieroads` | US$9.99 | `external_listing_unverified` |
| `iching-oracle` | `/apps/iching-oracle.html` | `com.app.ichingoracle` | US$3.99 | `external_listing_unverified` |
| `lucid-dream` | `/apps/lucid-dream.html` | `com.cha0smagicklabs.luciddreamer` | US$9.99 | `external_listing_unverified` |
| `lunar-phase-calculator` | `/apps/lunar-phase-calculator.html` | `com.lunarapp.app` | US$3.99 | `external_listing_unverified` |
| `noctem-tools` | `/apps/noctem-tools.html` | `com.cha0smagicklabs.noctemapp` | US$14.99 | `external_listing_unverified` |
| `unofficial-rider-waite-tarot` | `/apps/unofficial-rider-waite-tarot.html` | `com.cha0smagick.unofficialraiderwaite` | US$9.99 | `external_listing_unverified` |

**Fuente canónica local:** `scripts/bots/data/offers.json`.  
**Fuente de comparación:** las 12 páginas de `apps/*.html`.  
**Conteo reconciliado:** 12 páginas = 12 entradas de apps.  
**No demuestra:** que cada package exista en Play, que el listing esté publicado, que el precio externo sea el mismo o que exista una venta.

## 3. Libros y bundle

- El catálogo conserva 7 libros.
- Bundle local: US$19.99; precio original local: US$41.93.
- URL Hotmart observada en la landing canónica: `https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W`.
- Estado: `external_url_observed_sale_unverified`; no se presenta como venta confirmada.
- La URL antigua `/bundle.html` no se usa como CTA comercial de bots.

## 4. Ofertas bloqueadas

### Complete Access

- Archivo: `landing-pages/complete-access.html`.
- El ID `[HOTMART_PRODUCT_ID]` no existe en el repositorio.
- El CTA fue convertido en un bloque visible, sin `href` inventado ni evento `begin_checkout`.
- Estado: `BLOCKED_EXTERNAL_ID`.
- Salida: configuración y prueba primaria de un producto Hotmart, seguida de validación de precio,urrency, disponibilidad, refund y compra real.

### Flash Sale

- Archivo: `landing-pages/flash-sale.html`.
- El ID `[HOTMART_FLASH_ID]` no existe en el repositorio.
- Los dos CTA Hotmart fueron convertidos en estados bloqueados, sin `href` inventado.
- El enlace secundario de Google Play permanece como enlace de catálogo, pero no se registra como compra porque su disponibilidad y bundle no están verificados.
- Estado: `BLOCKED_EXTERNAL_ID`.

## 5. Medición y consentimiento local

- Las 12 páginas de apps tienen un default de consentimiento GA4 en estado `denied` para `analytics_storage` y `ad_storage` antes de `gtag('config', ...)`.
- Esto evita medición por defecto, pero no demuestra una implementación legal completa de consent banner, granularidad, opt-out, retención o requisitos jurisdiccionales.
- El bundle registra US$19.99 en el evento local, no US$49.99.
- Complete Access y Flash Sale no registran checkout mientras el CTA está bloqueado.

## 6. Cambios de catálogo que deben permanecer sincronizados

1. `scripts/bots/data/offers.json` es la fuente que consumen los bots.
2. Cada cambio de app, package ID, precio o funnel debe actualizar también la página pública y las pruebas.
3. `scripts/bots/bot-brain.js`, `scripts/bots/discord-bot.js`, `scripts/bots/telegram-bot.js` y `scripts/bots/groq-ai.js` no deben mantener conteos o URLs legacy.
4. El estado externo de cada oferta se registra aparte; reconciliación local no equivale a publicación ni venta.

## 7. Verificación reproducible

Desde la raíz del repositorio:

```text
node -e "const x=require('./scripts/bots/data/offers.json'); if(x.apps.length!==12) process.exit(1); console.log(x.apps.length)"
npm test
node --check scripts/bots/bot-brain.js
node --check scripts/bots/discord-bot.js
node --check scripts/bots/groq-ai.js
```

También se debe comprobar que:

- no exista `[HOTMART_PRODUCT_ID]` ni `[HOTMART_FLASH_ID]` en las dos landings bloqueadas;
- no exista `href` de Hotmart hacia esos placeholders;
- no exista `begin_checkout` activo en esas dos páginas;
- las 12 páginas de apps tengan el default de consentimiento antes de `gtag('config')`.

## 8. Puertas externas que faltan

Hasta que exista evidencia externa fechada, permanecen abiertos:

- ID y URL de checkout de Complete Access;
- ID y URL de checkout de Flash Sale;
- listings, disponibilidad, capturas y data safety de las apps;
- eventos y pruebas de compra en Hotmart/Google Play;
- ledger de cobros, fees, refunds, impuestos y comisiones;
- reconciled GA4/Meta, MailerLite/Make y logs de producción.

**Conclusión:** la brecha local de catálogo, URLs de bots, precios de tracking y CTAs no configurables queda cerrada o marcada como bloqueada de forma segura. El objetivo de US$5.000/mes sigue sin verificación hasta obtener ventas netas reales; no se debe convertir este documento en una afirmación de ingresos.
