# GEO / AI Surface Decision

**Decision version:** 1.0.0  
**Evidence date:** 2026-09-24  
**Owner:** GEO / SEO / Editorial  
**Status:** `IN_PROGRESS` — decisión local documentada; falta crawler output y evidencia de citas/referrals

## Decision

Se conserva `llms.txt` como índice breve de superficie pública, pero no se todavía se publica `llms-full.txt` como fuente de verdad. Motivo: el repositorio tiene un `llms.txt` existente que todavía no refleja toda la oferta reconciliada (incluye menos apps y libros que `scripts/bots/data/offers.json`) y contiene descripciones de producto que requieren revisión de propietario. Un archivo generado automáticamente sin revisión puede propagar precios, estados de publicación o claims no verificados.

La decisión queda sujeta a estas condiciones:

1. `scripts/bots/data/offers.json` y `docs/canonical-asset-inventory.md` son las fuentes locales de catálogo y estado.
2. Toda entidad publicada debe tener `source_url`, `owner`, `last_reviewed`, canonical y estado (`published`, `draft`, `unverified_external` o `retired`).
3. `llms.txt` es un índice corto; cualquier lista detallada debe vivir en un mapa de entidades versionado y revisable.
4. Los precios, listings, Hotmart y claims de resultado no se presentan como producción hasta tener evidencia externa.
5. No se interpretan solicitudes o respuestas de un crawler como ranking, citas o demanda.

## Baseline local

| Elemento | Observación | Limitación |
|---|---|---|
| `llms.txt` | Existe, 94 líneas, describe herramientas, apps, cuatro publicaciones, páginas y notas técnicas | No contiene el catálogo completo de 12 apps y 7 libros; algunos precios/features son claims locales y el listing externo no está verificado |
| `llms-full.txt` | No existe | No se crea automáticamente en esta pasada |
| `sitemap.xml` | Existe y declara el dominio canónico | No prueba indexación, recepción por crawler ni cobertura live |
| `docs/canonical-asset-inventory.md` | Versión 1.0.0, 2026-09-24, resuelve superficie y owners | Es evidencia local, no export de publicación |
| `scripts/bots/data/offers.json` | 12 apps, 7 libros, bundle observado | Metadata declara listing/ventas externas sin verificar |
| Páginas legales | Cinco borradores nuevos | Requieren owner legal y revisión formal |

## Entity map required

Cada fila de la futura tabla de entidades debe incluir, como mínimo:

- `entity_id`
- `entity_type` (`brand`, `person`, `app`, `book`, `tool`, `page`)
- `name`
- `canonical_url`
- `source_url`
- `owner`
- `state`
- `last_reviewed`
- `known_limitations`

Los estados externos que hoy deben permanecer abiertos son `external_listing_unverified` para apps, `external_url_observed_sale_unverified` para el bundle y `legal_owner_pending` para páginas legales. No se cambia un estado por tener un `.aab`, una URL o una página HTML.

## 20 consultas reproducibles

La consulta se ejecuta desde una superficie pública y se registra fecha, proveedor, texto exacto, respuesta, URL citada y limitations. Estas consultas son una propuesta de medición, no resultados publicados:

1. `site:cha0smagicklabs.com best occult apps Android`
2. `Cha0smagick Labs app catalog package ID`
3. `Cha0smagick Labs free divination tools`
4. `Cha0smagick Labs Zener cards PSI GYM`
5. `Cha0smagick Labs sigil generator privacy`
6. `Cha0smagick Labs I Ching Oracle Android`
7. `Cha0smagick Labs lunar phase calculator app`
8. `Cha0smagick Labs Rider Waite Tarot app`
9. `Cha0smagick Labs Arcana Goetia app`
10. `Cha0smagick Labs Dream Machine lucid dreaming`
11. `Cha0smagick Labs Eerie Roads app`
12. `Cha0smagick Labs NOCTEM tools`
13. `Cha0smagick Labs Codex Chaoticus book`
14. `Cha0smagick Labs Tarot Chaos book`
15. `Cha0smagick Labs Magical Servitors Manual`
16. `Cha0smagick Labs Liber Lvpinux book`
17. `Cha0smagick Labs books bundle Hotmart`
18. `what does Cha0smagick Labs sell`
19. `Cha0smagick Labs privacy policy analytics consent`
20. `Cha0smagick Labs contact support`

## Acceptance gate

Esta tarea no pasa a `DONE` hasta tener:

- crawler output fechado y reproducible;
- 20 respuestas con URLs/citas cuando el proveedor las exponga;
- mapa de entidades completo y revisado;
- un owner que approve la decisión de publicar `llms.txt`/`llms-full.txt`;
- coherencia con sitemap, canonical, `offers.json` y políticas legales;
- registro de citas/referrals, sin presentarlo como ranking garantizado.

## Known limitations

La ausencia de `llms-full.txt` no es por sí sola un defecto. La presencia de `llms.txt` no prueba descubrimiento, citas, autoridad ni tráfico. Los archivos actuales son locales y no sustituyen una auditoría del dominio publicado.
