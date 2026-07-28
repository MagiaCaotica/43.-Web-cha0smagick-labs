# Google Search Console + Indexing Status

## Problema Detectado
**NO hay tag de verificación de Google Search Console** en ninguna página del sitio. Sin verificación, Google no indexa correctamente ni reporta errores.

## Acción 1: Verificar en Google Search Console
1. Ve a https://search.google.com/search-console
2. Usa magiacaoticapractica@gmail.com
3. Añade propiedad: `cha0smagicklabs.com`
4. Elige método "HTML tag"
5. Copia el meta tag: `<meta name="google-site-verification" content="XXXXXXXXXXXX" />`
6. Pégalo en el `<head>` de `index.html` y en todos los templates

## Acción 2: Actualizar Sitemap (Urgente)
El sitemap.xml actual (1,129 líneas) incluye TODOS los artículos, incluyendo los 62 que marcamos como `noindex`. Google se confunde.

Necesitas:
- **Regenerar sitemap.xml excluyendo los 62 archivos noindex** (los <10KB que tienen `content="noindex, follow"`)
- Enviar el nuevo sitemap a GSC

Alternativa rápida: editar sitemap.xml manualmente y quitar las URLs noindex. Los archivos afectados son los ∼62 en `blog/` con tamaño <10KB.

## Acción 3: Solicitar Indexación Manual
En GSC:
1. Ve a "URL Inspection"
2. Pega la URL de tu homepage
3. Click "Request Indexing"
4. Haz lo mismo con los 5 artículos principales:
   - witchcraft-for-beginners-guide.html
   - chaos-magick-beginners-guide.html
   - sigil-magic-guide.html
   - astral-projection-techniques-beginners.html
   - tarot-card-meanings-guide.html

## Acción 4: Monitorear
- En 48-72 horas GSC mostrará datos de indexing
- Verifica "Coverage" report para errores
- Verifica "Performance" para clicks e impresiones

## Estado Actual del SEO
| Elemento | Estado |
|----------|--------|
| Sitemap XML | ✅ Existe (1,129 URLs) |
| robots.txt | ✅ Configurado (incluye sitemap) |
| GSC Verification | ❌ NO CONFIGURADO |
| Indexing | ❌ Desconocido (sin GSC) |
| Schema JSON-LD | ✅ En index.html |
| hreflang | ✅ Configurado |
| GA4 | ✅ Configurado |
| Noindex (62 articles) | ✅ Aplicado |
| Share buttons | ✅ En conversion.js |

## Prioridad
**Ahora mismo**: Configurar GSC → Enviar sitemap → Solicitar indexing (15 min).
