# Plan: concentrar el SEO en vez de multiplicarlo

## Petición

El Maestro de forja pregunta cuál es el próximo paso de SEO y pide crear flujo de clientes hacia las páginas que venden (libros en Hotmart, apps en Play Store). Sostiene, con razón, que ya se le dijo que "más contenido" no era la respuesta.

## Diagnóstico (datos reales, 2026-10-26 a 2026-11-24)

- 387 clics y 19.975 impresiones en 28 días. CTR 1,94 %, bajando desde 3,16 % mientras las impresiones suben 117 %.
- 949 páginas en `/blog`, de las cuales **196 son copias numeradas** de otra página (`...-2.html`, `...-13.html`).
- Familias medidas:
  - `chaos-magic-fundamentals-what-is-chaos-magic-guide`: **27 copias**, todas con 0 clics, impresiones repartidas entre ellas (42, 40, 15, 5, 4...) y posiciones de 8 a 84.
  - `the-mind-science-of-practice-why-does-magic-work-placeb`: 18 copias.
  - `hidden-lost-and-forbidden-knowledge-occult-secrets-guid`: 16.
  - `the-72-spirits-of-goetia-72-demons-of-goetia-guide`: 13.
  - `wealth-and-abundance-chaos-money-ritual-guide`: 12.
- Las copias comparten título, descripción y bloques de enlaces cruzados con el mismo ancla ("Clarity, Decisions and Focus" ×4 en la misma página).
- Consecuencia: Google reparte la señal de un tema entre 27 URLs casi idénticas y no posiciona ninguna. Eso explica impresiones altas con posiciones 20-90 y CTR a la baja.

No es un problema de falta de páginas. Es de páginas que compiten consigo mismas.

## Lo que NO se va a hacer

- No se publican páginas nuevas.
- No se reescriben títulos otra vez (ya se hizo en 7 páginas y el CTR medido aún mezcla el cambio).
- No se borra nada de golpe.

## Alcance

### Fase 1 — piloto con la familia más grande (27 URLs)

1. Elegir la superviviente: la URL sin sufijo (`chaos-magic-fundamentals-what-is-chaos-magic-guide.html`).
2. En las otras 26: añadir `<link rel="canonical">` a la superviviente y `<meta name="robots" content="noindex,follow">`.
3. Reescribir los enlaces internos que apuntan a las 26 copias para que apunten a la superviviente (mismo ancla, misma posición).
4. Sacar las 26 del `sitemap.xml`.
5. No se borran los archivos: siguen respondiendo 200 para no romper enlaces externos ni marcadores.

### Fase 2 — resto de familias

Solo si la fase 1 mueve posiciones. Mismo procedimiento sobre las ~170 URLs restantes, familia por familia.

### Fase 3 — arreglar el emparejamiento producto-lector

Dos CTA que ofrecen el producto equivocado:

- `blog/spirit-box-frequency-settings.html`: hoy ofrece Eerie Roads y Dream Machine a quien busca ajustes de spirit box. Debe ofrecer **NOCTEM** (suite de investigación paranormal, $14.99) y el libro **Ouija Cazadora**.
- `blog/iching-changing-lines-guide.html`: hoy ofrece Codex Chaoticus y PSI GYM. Debe ofrecer la app **I Ching Oracle**.

## Archivos que se tocan (fase 1)

- 26 × `blog/chaos-magic-fundamentals-what-is-chaos-magic-guide-*.html` (canonical + noindex).
- Todos los `.html` que enlacen a esas 26 URLs (reescritura del href).
- `sitemap.xml`.

## Criterio de aceptación

- `java -jar vnu.jar --errors-only` sobre los archivos tocados: 0 errores.
- `grep` de `chaos-magic-fundamentals-what-is-chaos-magic-guide-\d+\.html` fuera de las propias copias: 0 resultados.
- Las 26 copias responden 200 y declaran canonical + noindex; la superviviente no lleva noindex.
- `sitemap.xml` ya no lista las 26.
- A 3-4 semanas (Search Console): la superviviente gana impresiones y posición media para las consultas de la familia, y el CTR del sitio no baja.

## Riesgo y reversión

- Riesgo bajo: los archivos se quedan, los enlaces se redirigen a la superviviente y todo el cambio está en el `<head>`.
- Reversión: quitar canonical y noindex de las 26 (un commit) y restaurar los hrefs.

## Lo que queda fuera

- Backlinks: sin ellos, consolidar mejora la distribución de la señal, no la autoridad del dominio. Es el techo real del sitio y no se puede fabricar.
- Google Merchant: el canal nuevo (25 productos) hay que medirlo 7 días antes de tocar nada.
- El bloque `linkgraph:refs` con anclas repetidas: candidato a eliminar en fase 2, cuando las familias estén consolidadas.

## Ejecutado (2026-11-25)

Fase 1, familia `chaos-magic-fundamentals-what-is-chaos-magic-guide`:

- 866 enlaces internos de 162 archivos reescritos a la superviviente.
- 26 copias con `noindex, follow` y `canonical` a la superviviente. Los archivos siguen dando 200.
- 26 entradas fuera del sitemap (1.105 → 1.079 URLs). El generador `scripts/generate_sitemap.py` ya respeta noindex, así que el refresco automático no las repone.
- 26 tarjetas duplicadas retiradas de `blog/index.html` (842 → 816 tarjetas).
- `vnu`: 0 errores en los archivos tocados y en `blog/index.html`.
- Herramienta reutilizable: `node scripts/seo/consolidate-family.cjs <prefijo> [--write]`.

Fase 3:

- `blog/spirit-box-frequency-settings.html`: CTA pasa de Mind The Gap + Dream Machine a NOCTEM (EVP, SLS, temporizador) + Ouija Cazadora.
- `blog/iching-changing-lines-guide.html`: fuera PSI GYM del CTA, dentro el simulador gratuito de líneas cambiantes.

## Cómo se mide

A 3-4 semanas en Search Console, por URL:

- `blog/chaos-magic-fundamentals-what-is-chaos-magic-guide.html`: impresiones y posición media para las consultas de la familia (hoy repartidas entre 27 URLs, 0 clics).
- CTR del sitio: no debe bajar.
- Clics de salida hacia `/apps/noctem-tools.html` y `/tools/iching-changing-lines.html` (GA4 o el `purchase_click` que ya emite conversion.js).

Si la superviviente no se mueve, la hipótesis de canibalización es falsa y el problema es autoridad: entonces la fase 2 no se hace y el foco pasa a enlaces externos.

