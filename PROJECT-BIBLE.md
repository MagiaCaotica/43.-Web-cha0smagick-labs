# PROJECT BIBLE — Cha0smagick Labs Website

> **Este archivo es la fuente de verdad del proyecto.** Leerlo cada vez que se abra el proyecto.
> Última actualización: 2026-07-16

---

## 1. RESUMEN DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Dominio** | `cha0smagicklabs.com` |
| **Tipo** | Sitio web estático (HTML/CSS/JS puro, sin framework) |
| **Hosting** | GitHub Pages (via GitHub Actions) |
| **Stack** | HTML5 + CSS custom + Vanilla JS |
| **Analytics** | Google Analytics 4 (`G-V6LHCPN9TK`) con consent denied by default |
| **Traducción** | Google Translate widget (9 idiomas, lazy-loaded) |
| **Mapa** | Leaflet.js (lazy-loaded con IntersectionObserver) |
| **PWA** | `manifest.json` + `sw.js` (cache-first assets, network-first HTML) |
| **Pagos** | Google Play Store (apps) + Hotmart (PDF books) |
| **Build** | `terser` (JS minification) + `clean-css-cli` (CSS minification) |

---

## 2. ESTRUCTURA DE DIRECTORIOS

```
ROOT/
├── index.html                    # HOMEPAGE
├── 404.html                      # Página de error personalizada
├── glossary.html                 # Glosario oculto (100+ términos)
├── best-occult-apps-android.html # Comparativa de apps
├── privacy-policy.html           # Política de privacidad
├── sw.js                         # Service Worker v1.1.0
├── manifest.json                 # PWA manifest
├── CNAME                         # cha0smagicklabs.com
├── .nojekyll                     # Desactiva Jekyll en GH Pages
├── _headers                      # Security headers (Netlify-style)
├── robots.txt                    # Crawl rules
├── sitemap.xml                   # ~70+ URLs
├── llms.txt                      # LLM-friendly site description
├── CONTENT-PLAN.md               # Roadmap de contenido
├── PROJECT-BIBLE.md              # ← ESTE ARCHIVO
│
├── css/
│   ├── style.css                 # Main stylesheet (1758 líneas)
│   └── style.min.css             # Minified
│
├── js/
│   ├── apps-data.js              # CATÁLOGO DE DATOS (837 líneas)
│   ├── apps-data.min.js          # Minified
│   ├── app-render.js             # MOTOR DE RENDERING (600 líneas)
│   ├── app-render.min.js         # Minified
│   ├── shared.js                 # Funciones compartidas (161 líneas)
│   ├── shared.min.js             # Minified
│   ├── visitor-map.js            # Mapa de visitantes (249 líneas)
│   └── visitor-map.min.js        # Minified
│
├── apps/                         # 9 landing pages de apps Android
│   ├── psi-gym.html
│   ├── arcana-goetia.html
│   ├── norse-rune-oracle.html
│   ├── lunar-phase-calculator.html
│   ├── iching-oracle.html
│   ├── chaos-sigil-generator.html
│   ├── unofficial-rider-waite-tarot.html
│   ├── dream-machine.html
│   └── astral-lab.html
│
├── books/                        # 7 landing pages de libros PDF (Hotmart)
│   ├── manual-activacion-servidores-magicos-pdf.html
│   ├── tratado-runas-cazadoras-caos-pdf.html
│   ├── ouija-cazadora-pdf.html
│   ├── liber-lvpinux-pdf.html
│   ├── mind-the-gap-pdf.html
│   ├── codex-chaoticus-pdf.html
│   └── tarot-chaos-pdf.html
│
├── blog/                         # 79 artículos + index
│   ├── index.html                # Blog index con filtros por categoría
│   └── *.html                    # 79 artículos individuales
│
├── tools/                        # 10 herramientas gratuitas + index
│   ├── index.html                # Directorio de tools
│   ├── iching.html
│   ├── viking-runes.html
│   ├── sigil-generator.html
│   ├── lunar-phase.html
│   ├── spell-builder.html
│   ├── astrology-sign-calculator.html
│   ├── candle-color-calculator.html
│   ├── digital-pendulum.html
│   ├── tengwar-transcriber.html
│   └── activador-servidores.html
│
├── pages/
│   ├── about.html
│   └── app-details.html          # Template dinámico (usa ?id= query params)
│
├── assets/
│   ├── icons/                    # PWA icons (192px, 512px)
│   └── images/
│       ├── Banner.png / .webp    # Logo principal
│       ├── *.png / *.webp        # App icons + screenshots (75 archivos)
│       ├── flags/                # 9 SVG flags (gb, es, fr, de, it, pt, ru, jp, cn)
│       └── blog/                 # Blog images (71 pares PNG+WebP)
│
├── images/
│   └── tarotchaos.PNG            # Portada legacy
│
├── submissions/                  # Assets para tiendas de apps
│   ├── metadata.json             # Metadata de todas las apps
│   └── */                        # .aab + .apk por app
│
├── scripts/                      # 54 scripts de automatización
│   ├── generate-app-pages.mjs    # Genera /apps/*.html desde apps-data.js
│   ├── generate-tool-pages.mjs   # Genera /tools/*.html
│   ├── generate-articles.py      # Genera blog articles
│   ├── minify_assets.py          # Minifica CSS/JS
│   ├── add_schemas.py            # Inyecta Schema.org
│   ├── add_hreflang.py           # Inyecta hreflang
│   ├── add_table_of_contents.py  # Genera TOC
│   ├── add_related_articles.py   # Cross-linking
│   └── ...                       # ~46 scripts más
│
├── .github/workflows/
│   └── pages.yml                 # GitHub Actions deploy
│
└── node_modules/                 # Solo para devDeps (terser, clean-css)
```

---

## 3. ARQUITECTURA DE DATOS

### 3.1 Archivo central: `js/apps-data.js`

Contiene **dos arrays globales** que son la fuente de verdad de todo el catálogo:

#### `appsData[]` — Aplicaciones Android + 1 libro en appsData

| # | ID | Nombre | Precio | Tipo |
|---|-----|--------|--------|------|
| 1 | `psi-gym` | PSI GYM: Zener Cards & ESP | $3.99 | App |
| 2 | `arcana-goetia` | Arcana Goetia: Ritual & Sigils | $3.99 | App |
| 3 | `norse-rune-oracle` | Norse Rune Oracle | $3.99 | App |
| 4 | `lunar-phase-calculator` | Lunar Phase Calculator | $3.99 | App |
| 5 | `iching-oracle` | I Ching Oracle | $3.99 | App |
| 6 | `chaos-sigil-generator` | Magick Chaos Sigil Generator | $3.99 | App |
| 7 | `unofficial-rider-waite-tarot` | Unofficial Rider Waite Tarot | $9.99 | App |
| 8 | `dream-machine` | Dream Machine: Lucid Dreaming | $3.99 | App |
| 9 | `mind-the-gap-pdf` | Mind The Gap (self-help) | $9.99 | Book (Hotmart) |

#### `booksData[]` — Libros PDF vendidos via Hotmart

| # | ID | Nombre | Precio | Idioma |
|---|-----|--------|--------|--------|
| 1 | `manual-activacion-servidores-magicos-pdf` | Magical Servitors Manual | $3.99 (60% off) | Spanish |
| 2 | `tratado-runas-cazadoras-caos-pdf` | Treatise of Chaos Hunter Runes | $3.99 (80% off) | Spanish |
| 3 | `ouija-cazadora-pdf` | Ouija Cazadora | $3.99 (60% off) | Spanish |
| 4 | `liber-lvpinux-pdf` | Liber Lvpinux | $3.99 (90% off) | Spanish |
| 5 | `codex-chaoticus-pdf` | Codex Chaoticus | $4.99 | EN/ES |
| 6 | `tarot-chaos-pdf` | Tarot Chaos | $9.99 | EN/ES |

### 3.2 Schema de datos — App en `appsData`

```javascript
{
    id: "psi-gym",                          // ID único (kebab-case, usado en URLs)
    name: "PSI GYM: Zener Cards & ESP",     // Nombre completo
    price: "$3.99 USD",                      // Precio formateado
    url: "https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards",
    status: "available",                     // "available" | "coming soon"
    description: "Train your intuition...",  // Descripción corta (1 línea)
    image: "assets/images/zener.webp",       // Ruta relativa al icono (WebP preferido)
    seo: {
        title: "PSI GYM | Zener Cards...",   // Title tag SEO
        description: "Enhance your...",       // Meta description
        keywords: "zener cards, esp..."       // Meta keywords
    },
    screenshots: [                           // Array de rutas (relativas a /apps/)
        "../assets/images/z1.webp",
        "../assets/images/z2.webp",
        "../assets/images/z3.webp"
    ],
    detailedDescription: `                   // HTML crudo para la página de detalle
        <h3>Title</h3>
        <p>Content...</p>
        <ul><li>Feature...</li></ul>
    `
}
```

### 3.3 Schema de datos — Libro en `booksData`

```javascript
{
    id: "manual-activacion-servidores-magicos-pdf",  // ID único
    name: "Magical Servitors Manual",                 // Nombre
    author: "Frater Alek0s",                          // Autor
    language: "Spanish",                              // Idioma
    languageFlag: "es",                               // Código de flag (usado en flagcdn.com)
    price: "$3.99 USD (60% off)",                     // Precio con descuento
    type: "book",                                     // SIEMPRE "book"
    status: "available",
    image: "assets/images/servidores.png",             // Portada
    description: "Learn how to create...",             // Descripción corta
    hotmartLink: "https://pay.hotmart.com/...",        // Link de compra Hotmart
    seo: { title, description, keywords },
    detailedDescription: `HTML...`                    // HTML crudo
}
```

---

## 4. MOTOR DE RENDERING: `js/app-render.js`

### Funciones principales

| Función | Dónde se usa | Qué hace |
|---------|-------------|----------|
| `buildPictureHtml(src, alt, cls, loading, w, h)` | Utilitaria | Genera `<picture>` con WebP source + PNG fallback |
| `renderAppsGrid()` | Homepage `#apps-grid` | Renderiza grid de apps con cards, precios, botones Play Store |
| `renderBooksSection()` | Homepage | Renderiza sección de libros, ordenados por precio (asc) |
| `renderAppDetails()` | `pages/app-details.html?id=X` | Renderiza detalle completo de app/libro con SEO dinámico |
| `renderAlsoLike(currentId)` | Páginas de detalle | Cross-selling: hasta 3 apps relacionadas |
| `renderItemListSchema()` | Homepage | Genera Schema.org ItemList para rich results |
| `loadHotmartWidget()` | Libros | Lazy-load del widget de checkout de Hotmart |
| `initCollapsibleSections()` | Todas las páginas | Convierte secciones en colapsables |
| `initVisitorCounter()` | Todas las páginas | Lee/incrementa contador en localStorage |

### Ejecución en DOMContentLoaded

```javascript
// 1. Contador de visitas
initVisitorCounter();

// 2. Convierte secciones en colapsables
// Busca h2/h3 que matcheen "Cybermancy", "About Us", "Contact Us"
// y envuelve hermanos en .collapsible-content

// 3. Homepage
if (document.getElementById('apps-grid')) {
    renderAppsGrid();
    renderBooksSection();
    renderItemListSchema();  // defer
}

// 4. Páginas de detalle
if (document.getElementById('app-details')) {
    const params = new URLSearchParams(window.location.search);
    const appId = params.get('id');
    renderAppDetails(appId);
    renderAlsoLike(appId);
}

// 5. Secciones colapsables
initCollapsibleSections();
```

---

## 5. SCRIPTS DE GENERACIÓN DE PÁGINAS

### 5.1 `scripts/generate-app-pages.mjs`

Genera las 15 páginas estáticas en `/apps/*.html` a partir de los datos hardcodeados en el script.

**Uso:**
```bash
node scripts/generate-app-pages.mjs
```

**Qué hace:**
1. Lee `appsData[]` y `booksData[]` (copiados dentro del script)
2. Para cada entrada, genera un HTML completo con:
   - SEO meta tags (title, description, keywords, canonical, OG, Twitter Card)
   - Schema.org JSON-LD (SoftwareApplication para apps, Book para libros, Product para precio)
   - Critical CSS inlined
   - Header con logo + nav
   - Breadcrumb
   - Sección de detalle con imagen, precio, descripción
   - Screenshots gallery
   - Botón Play Store o Hotmart
   - "You May Also Like" cross-selling
   - Footer con mapa + contador
   - Scripts: app-render.js + inline SW + Leaflet
3. Escribe en `apps/{id}.html`

**IMPORTANTE:** Si añades un app/libro a `js/apps-data.js`, DEBES también añadirlo al array dentro de `scripts/generate-app-pages.mjs` y ejecutar el script para regenerar las páginas.

### 5.2 `scripts/generate-tool-pages.mjs`

Genera las páginas de tools funnel en `/tools/*.html`.

**Uso:**
```bash
node scripts/generate-tool-pages.mjs
```

**Schema de tool:**
```javascript
{
    id: 'iching',
    title: 'Free I Ching Oracle Online',
    description: '...',
    keywords: '...',
    h1: 'I Ching Oracle',
    hfSpace: 'https://cha0smagick-oraculo-de-iching.hf.space',  // HuggingFace Space embed
    appPage: '../apps/iching-oracle.html',                        // Link a app premium
    playStoreUrl: 'https://play.google.com/...',
    appName: 'I Ching Oracle App',
    appPrice: '$3.99',
    heroDesc: '...',
    benefits: ['...', '...'],                                     // Array de beneficios
    features: '...'                                               // Texto de conversión
}
```

**Estructura de cada tool page:**
- Header con título
- Nav: Home, All Free Tools, Premium Apps, Blog
- Breadcrumb
- Hero section
- Benefits grid
- iframe embebido (HuggingFace Space)
- CTA box → Premium App
- Footer

### 5.3 `scripts/generate-articles.py`

Genera artículos del blog desde datos estructurados en Python.

**Uso:**
```bash
python scripts/generate-articles.py
```

---

## 6. CÓMO AÑADIR CONTENIDO NUEVO

### 6.1 Añadir una NUEVA APP Android

**Pasos:**

1. **Preparar assets:**
   - Icono de la app: `assets/images/{appid}.webp` (y `.png` fallback)
   - Screenshots: `assets/images/{prefix}1.webp`, `{prefix}2.webp`, `{prefix}3.webp` (mínimo 3)

2. **Añadir datos en `js/apps-data.js`:**
   ```javascript
   // Añadir al array appsData[]
   {
       id: "nueva-app",                              // kebab-case único
       name: "Nueva App: Subtítulo",
       price: "$3.99 USD",
       url: "https://play.google.com/store/apps/details?id=com.cha0smagicklabs.nuevaapp",
       status: "available",
       description: "Descripción corta para la card. 👁️",
       image: "assets/images/nueva-app.webp",
       seo: {
           title: "Nueva App | Título SEO Optimizado",
           description: "Meta description con keywords...",
           keywords: "keyword1, keyword2, keyword3..."
       },
       screenshots: [
           "../assets/images/na1.webp",
           "../assets/images/na2.webp",
           "../assets/images/na3.webp"
       ],
       detailedDescription: `
           <h3>Hook title</h3>
           <p>Descripción detallada con HTML...</p>
           <h4>✨ Features</h4>
           <ul><li><strong>Feature:</strong> Descripción</li></ul>
           <h4>❓ FAQ</h4>
           <p><strong>Pregunta?</strong><br>Respuesta</p>
       `
   }
   ```

3. **Añadir al array en `scripts/generate-app-pages.mjs`** (mismo schema, pero screenshots usan `.png`)

4. **Generar la página:**
   ```bash
   node scripts/generate-app-pages.mjs
   ```

5. **Añadir al sitemap.xml:**
   ```xml
   <url>
       <loc>https://cha0smagicklabs.com/apps/nueva-app.html</loc>
       <lastmod>2026-07-16</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.8</priority>
   </url>
   ```

6. **Submissions (opcional):**
   - Añadir metadata en `submissions/metadata.json`
   - Crear carpeta `submissions/nueva-app/` con `.aab` y `.apk`

### 6.2 Añadir un NUEVO LIBRO PDF (Hotmart)

**Pasos:**

1. **Preparar assets:**
   - Portada: `assets/images/{bookid}.png` (o `.webp`)

2. **Añadir datos en `js/apps-data.js`:**
   ```javascript
   // Añadir al array booksData[]
   {
       id: "nuevo-libro-pdf",                          // kebab-case + "-pdf"
       name: "Nombre del Libro",
       author: "Frater Alek0s",
       language: "Spanish",                            // o "English / Spanish"
       languageFlag: "es",                             // "es", "us", "us,es"
       price: "$4.99 USD",
       type: "book",                                   // SIEMPRE "book"
       status: "available",
       image: "assets/images/nuevolibro.png",
       description: "Descripción corta del libro.",
       hotmartLink: "https://pay.hotmart.com/XXXXX?checkoutMode=2",
       seo: {
           title: "Nombre del Libro | Título SEO | PDF",
           description: "Meta description...",
           keywords: "keyword1, keyword2..."
       },
       detailedDescription: `
           <h1>Nombre del Libro</h1>
           <p>Descripción detallada...</p>
           <h2>Qué encontrarás</h2>
           <ul><li><strong>Tema:</strong> Descripción</li></ul>
           <h2>Formato</h2>
           <ul><li>PDF profesional — descarga instantánea</li></ul>
       `
   }
   ```

3. **Añadir al array en `scripts/generate-app-pages.mjs`** (mismo schema)

4. **Generar:**
   ```bash
   node scripts/generate-app-pages.mjs
   ```

5. **Actualizar sitemap.xml**

### 6.3 Añadir una NUEVA TOOL Gratuita

**Pasos:**

1. **Crear el HuggingFace Space** (o embedding externo) con la funcionalidad

2. **Añadir datos en `scripts/generate-tool-pages.mjs`:**
   ```javascript
   // Añadir al array tools[]
   {
       id: 'nueva-tool',
       title: 'Free Nueva Tool Online — Subtítulo SEO',
       description: 'Meta description...',
       keywords: 'keyword1, keyword2...',
       h1: 'Nueva Tool',
       hfSpace: 'https://nueva-tool.hf.space',
       appPage: '../apps/app-relacionada.html',
       playStoreUrl: 'https://play.google.com/store/apps/details?id=...',
       appName: 'App Premium Relacionada',
       appPrice: '$3.99',
       heroDesc: 'Descripción del hero...',
       benefits: [
           'Beneficio 1',
           'Beneficio 2',
           'Beneficio 3',
           'Beneficio 4',
           'Beneficio 5'
       ],
       features: 'Texto de conversión hacia la app premium.'
   }
   ```

3. **Generar:**
   ```bash
   node scripts/generate-tool-pages.mjs
   ```

4. **Añadir al sitemap.xml**

5. **Añadir link en `tools/index.html`** (directorio de tools)

### 6.4 Añadir un NUEVO BLOG POST

**Pasos:**

1. **Preparar imagen featured:**
   - `assets/images/blog/{slug}.png` + `assets/images/blog/{slug}.webp`

2. **Generar el artículo:**
   - Usar `scripts/generate-articles.py` si el artículo sigue el template estándar
   - O crear manualmente `blog/{slug}.html` copiando la estructura de un artículo existente

3. **Categorías disponibles** (para `data-category`):
   ```
   all | sigils-code | divination | dreaming | goetia | runes | moon-magic |
   tarot | i-ching | basics | reviews | free-tools | advanced
   ```

4. **Añadir al blog index:**
   - El `blog/index.html` carga artículos dinámicamente
   - Añadir entrada al array de artículos en el HTML

5. **Actualizar sitemap.xml**

6. **Cross-linking (opcional):**
   ```bash
   python scripts/add_related_articles.py
   ```

---

## 7. ESTRUCTURA HTML REUTILIZABLE

### 7.1 Head tags (obligatorias en cada página)

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#050505">
<meta name="robots" content="index, follow">
<meta name="author" content="Cha0smagick Labs - Frater Alek0s">

<title>SEO Title | Cha0smagick Labs</title>
<meta name="description" content="Meta description...">
<meta name="keywords" content="keywords...">
<link rel="canonical" href="https://cha0smagicklabs.com/path">

<!-- OG -->
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:image" content="https://cha0smagicklabs.com/assets/images/image.webp">
<meta property="og:url" content="https://cha0smagicklabs.com/path">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Cha0smagick Labs">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="...">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="...">

<!-- Favicon & PWA -->
<link rel="icon" type="image/x-icon" href="../assets/favicon.ico">
<link rel="apple-touch-icon" href="../assets/images/Banner.png">
<link rel="manifest" href="../manifest.json">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

<!-- CSS -->
<link rel="stylesheet" href="../css/style.min.css">

<!-- GA4 (privacy-first) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-V6LHCPN9TK"></script>
<script>
  window.dataLayer=window.dataLayer||[];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('consent','default',{'analytics_storage':'denied'});
  gtag('config','G-V6LHCPN9TK');
</script>

<!-- Schema.org (varía por tipo de página) -->
<script type="application/ld+json">{ ... }</script>
```

### 7.2 Header + Nav

```html
<header>
    <div class="header-content">
        <a href="../index.html" class="header-link">
            <picture>
                <source srcset="../assets/images/Banner.webp" type="image/webp">
                <img class="header-logo" src="../assets/images/Banner.png" alt="Cha0smagick Labs Logo" width="200" height="200" loading="eager">
            </picture>
            <span class="site-title">CHA0SMAGICK LABS</span>
        </a>
        <p>Explore the Art and Practice of Chaos Magick</p>
    </div>
</header>

<nav>
    <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../index.html#about">About Us</a></li>
        <li><a href="../index.html#products">Premium Apps</a></li>
        <li><a href="../tools/">Free Tools</a></li>
        <li><a href="../index.html#books-section">Books</a></li>
        <li><a href="../blog/">Blog</a></li>
        <li><a href="../glossary.html">Glossary</a></li>
        <li><a href="../best-occult-apps-android.html">Best Apps</a></li>
    </ul>
</nav>

<div class="breadcrumb">
    <a href="../index.html">Home</a> › <a href="index.html">Section</a> › Page Name
</div>
```

### 7.3 Footer (completo)

```html
<footer>
    <div class="footer-parallel-container">
        <div class="footer-left-side">
            <div class="map-wrapper" id="map-wrapper">
                <div id="visitor-map" class="visitor-leaflet-map"></div>
            </div>
            <div class="visitor-counter">
                <span class="counter-label">Number of Ascended Ones:</span>
                <span id="visitor-count" class="counter-value">000000</span>
            </div>
        </div>
        <div class="footer-right-side">
            <div class="footer-content">
                <div class="footer-links">
                    <h4>Cha0smagick Labs</h4>
                    <ul>
                        <li><a href="https://magiadelcaospractica.com">Official Blog</a></li>
                        <li><a href="../privacy-policy.html">Privacy & Legal</a></li>
                        <li><a href="https://play.google.com/store/apps/dev?id=5224914033326414083">Google Play Developer</a></li>
                    </ul>
                </div>
                <div class="footer-social">
                    <h4>Community</h4>
                    <ul>
                        <li><a href="https://t.me/magiacaotica" target="_blank">Telegram</a></li>
                        <li><a href="https://www.youtube.com/channel/UCglU9np0SqGcnrCMLyVOqKA" target="_blank">YouTube</a></li>
                        <li><a href="https://www.instagram.com/cha0smagick.labs/" target="_blank">Instagram</a></li>
                        <li><a href="https://discord.gg/6vNSCaPgPd" target="_blank">Discord</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <p>&copy; 2026 Cha0smagick Labs. All rights reserved. Designed with digital magic.</p>
</footer>
```

### 7.4 Scripts al final del body

```html
<!-- Language Switcher -->
<div id="lang-sidebar" class="lang-sidebar">
    <button id="lang-toggle-btn" class="lang-toggle-btn" title="Select Language" onclick="toggleLangSidebar()">🌐</button>
    <div id="lang-flag-list" class="lang-flag-list" style="display:none;">
        <button onclick="switchLang('en')" class="lang-btn"><img src="../assets/images/flags/gb.svg" class="flag-icon"> EN</button>
        <button onclick="switchLang('es')" class="lang-btn"><img src="../assets/images/flags/es.svg" class="flag-icon"> ES</button>
        <button onclick="switchLang('fr')" class="lang-btn"><img src="../assets/images/flags/fr.svg" class="flag-icon"> FR</button>
        <button onclick="switchLang('de')" class="lang-btn"><img src="../assets/images/flags/de.svg" class="flag-icon"> DE</button>
        <button onclick="switchLang('it')" class="lang-btn"><img src="../assets/images/flags/it.svg" class="flag-icon"> IT</button>
        <button onclick="switchLang('pt')" class="lang-btn"><img src="../assets/images/flags/pt.svg" class="flag-icon"> PT</button>
        <button onclick="switchLang('ru')" class="lang-btn"><img src="../assets/images/flags/ru.svg" class="flag-icon"> RU</button>
        <button onclick="switchLang('ja')" class="lang-btn"><img src="../assets/images/flags/jp.svg" class="flag-icon"> JP</button>
        <button onclick="switchLang('zh-CN')" class="lang-btn"><img src="../assets/images/flags/cn.svg" class="flag-icon"> ZH</button>
    </div>
</div>
<div id="google_translate_element" style="display:none;"></div>

<!-- Cookie Consent -->
<div id="cookie-consent-banner">
    <p>This site uses cookies for analytics. <a href="../privacy-policy.html" style="color:#ffd700;">Learn more</a></p>
    <div class="cookie-buttons">
        <button class="cookie-btn-accept" onclick="acceptCookies()">Accept</button>
        <button class="cookie-btn-decline" onclick="declineCookies()">Decline</button>
    </div>
</div>

<!-- Scripts (orden importa) -->
<script src="../js/apps-data.min.js"></script>
<script src="../js/app-render.min.js"></script>
<script src="../js/shared.min.js"></script>
<script src="../js/visitor-map.min.js"></script>
```

---

## 8. SCHEMA.ORG POR TIPO DE PÁGINA

### Homepage
- `Organization` (logo, social links)
- `WebSite` (search action)
- `ItemList` (apps + books)
- `FAQPage` (FAQ section)

### App Detail (`/apps/*.html`)
- `SoftwareApplication` (Android app)
- `Product` (precio + disponibilidad)
- `BreadcrumbList`

### Book Detail (`/apps/*-pdf.html`)
- `Book` (autor, ISBN si aplica)
- `Product` (precio)
- `BreadcrumbList`

### Tool Page (`/tools/*.html`)
- `WebApplication` (herramienta gratuita)
- `BreadcrumbList`

### Blog Article (`/blog/*.html`)
- `Article` o `BlogPosting`
- `BreadcrumbList`
- `Person` (autor)

---

## 9. CSS DESIGN SYSTEM

### Variables clave (`:root`)

```css
/* Backgrounds */
--bg-body: #030303;
--bg-card: #0a0a0a;
--bg-nav: rgba(5,5,5,0.9);

/* Text */
--text-primary: #f0f0f0;
--text-body: #a0a0a0;

/* Accent */
--accent-gold: #c0a060;
--accent-light: #ffd700;

/* Layout */
--max-width: 1200px;

/* Grid de apps */
/* repeat(auto-fill, minmax(280px, 1fr)) */
/* gap: 2rem */
```

### Clases CSS importantes

| Clase | Uso |
|-------|-----|
| `.app-card` | Card de app/libro en grid |
| `.play-store-btn` | Botón verde Google Play con pulse animation |
| `.hotmart-btn` | Botón Hotmart para libros |
| `.app-details` | Contenedor de detalle de app |
| `.detail-header-layout` | Header flex con imagen + info |
| `.detail-main-image` | Imagen principal del detalle |
| `.screenshots-row` | Gallery de screenshots |
| `.cta-box` | Caja de conversión con borde gold |
| `.breadcrumb` | Breadcrumb con separador `›` |
| `.visitor-leaflet-map` | Contenedor del mapa |
| `.lang-sidebar` | Sidebar fijo de idiomas |
| `.collapsible-section` | Secciones colapsables |
| `.discount-badge` | Badge rojo de descuento |
| `.section-toggle` | Toggle de colapsables |
| `.benefits` | Grid de beneficios en tools |
| `.tool-frame` | iframe container en tools |

### Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { ... }
/* Tablet */
@media (max-width: 900px) { ... }
/* Small mobile */
@media (max-width: 600px) { ... }
```

---

## 10. SERVICIOS EXTERNOS

| Servicio | Propósito | ID/URL |
|----------|-----------|--------|
| Google Analytics 4 | Analytics | `G-V6LHCPN9TK` |
| Google Translate | Multiidioma | Lazy-loaded |
| Leaflet.js 1.9.4 | Mapa visitantes | unpkg CDN |
| CartoCDN | Tiles dark map | basemaps.cartocdn.com |
| OpenStreetMap | Tiles fallback | tile.openstreetmap.org |
| Hotmart | E-commerce PDFs | Checkout widget lazy-loaded |
| Google Play Store | Apps Android | Links directos |
| HuggingFace Spaces | Tools embebidas | iframes |
| flagcdn.com | Flags SVG | Inline img |
| Google Fonts | Inter + JetBrains Mono | Preconnect + preload |

---

## 11. SERVICE WORKER (`sw.js` v1.1.0)

### Estrategia de cache

| Tipo de request | Estrategia |
|-----------------|------------|
| Assets estáticos (JS, CSS, images, fonts) | **Cache-first** → network fallback |
| HTML pages | **Network-first** → cache fallback |
| Google Analytics/GTM | **Skip** (no cache) |
| Sin match en cache + offline | Fallback a `/404.html` |

### Precache (en install)

```
/, /index.html, /css/style.min.css, /manifest.json,
/assets/icons/icon-192.png, /assets/icons/icon-512.png,
/js/apps-data.min.js?v=20260703, /js/app-render.min.js?v=20260703
```

**Cache name:** `cha0smagick-v4`

**Al actualizar el SW:** Cambiar `CACHE_NAME` y actualizar los `?v=` query strings en `PRECACHE_URLS`.

---

## 12. DEPLOY

### GitHub Actions (`.github/workflows/pages.yml`)

El sitio se despliega automáticamente a GitHub Pages al hacer push a la rama principal.

### Checklist pre-deploy

1. ☐ Actualizar `js/apps-data.js` (datos fuente)
2. ☐ Ejecutar `node scripts/generate-app-pages.mjs` (si hay apps/libros nuevos)
3. ☐ Ejecutar `node scripts/generate-tool-pages.mjs` (si hay tools nuevas)
4. ☐ Ejecutar `python scripts/generate-articles.py` (si hay blog posts nuevos)
5. ☐ Ejecutar `python scripts/minify_assets.py` (minificar CSS/JS)
6. ☐ Actualizar `sitemap.xml` con nuevas URLs
7. ☐ Actualizar `sw.js` PRECACHE_URLS si hay nuevos JS/CSS core
8. ☐ Verificar que las imágenes existen en `assets/images/`
9. ☐ Hacer push a GitHub

---

## 13. SCRIPTS DE UTILIDAD DISPONIBLES

| Script | Propósito |
|--------|-----------|
| `generate-app-pages.mjs` | Genera páginas de apps/books |
| `generate-tool-pages.mjs` | Genera páginas de tools |
| `generate-articles.py` | Genera artículos del blog |
| `minify_assets.py` | Minifica CSS y JS |
| `add_schemas.py` | Inyecta Schema.org en HTML |
| `add_hreflang.py` | Inyecta hreflang tags |
| `add_table_of_contents.py` | Genera TOC automático |
| `add_related_articles.py` | Cross-linking entre artículos |
| `crosslink_audit.py` | Audita links internos |
| `check_anchors.py` | Verifica anchors rotos |
| `check_article_schema.py` | Valida Schema.org en artículos |
| `analyze_images.py` | Analiza tamaño/formato de imágenes |
| `keyword-article-map.md` | Mapeo keyword → artículo |

---

## 14. MÉTRICAS ACTUALES

| Métrica | Cantidad |
|---------|----------|
| Páginas HTML totales | ~110 |
| Artículos del blog | 79 |
| Landing pages de apps | 9 |
| Landing pages de libros | 7 |
| Herramientas gratuitas | 10 |
| Páginas core | 5 (home, 404, glossary, best-apps, privacy) |
| Archivos JS fuente | 4 (+ 4 minified) |
| Archivos CSS | 1 (+ 1 minified) |
| Imágenes de blog | 142 (71 × 2 formatos) |
| Imágenes de assets | 75 |
| Scripts de utilidad | 54 |
| Integridad externas | 8 (GA, Translate, Leaflet, CartoCDN, Hotmart, Play Store, HF, Google Fonts) |

---

## 15. NOTAS IMPORTANTES

1. **Rutas relativas:** Desde `/apps/*.html` y `/blog/*.html`, las rutas a assets usan `../`. Desde `/` (homepage) no.
2. **Dual data:** Los datos de apps/books existen en DOS lugares: `js/apps-data.js` (runtime) Y `scripts/generate-app-pages.mjs` (generación). Si cambias uno, debes cambiar el otro.
3. **Minificación:** Siempre editar los archivos FUENTE (.js, .css), nunca los .min.js/.min.css directamente.
4. **Imágenes:** Todo debe existir en WebP (primario) + PNG (fallback). La función `buildPictureHtml()` genera el `<picture>` automáticamente.
5. **Consent mode:** GA4 carga con consent DENIED por defecto. Solo se activa con click explícito en "Accept cookies".
6. **No hay backend:** 100% estático. No hay API, no hay base de datos, no hay server-side rendering.
7. **Google Translate:** No existe traducción real del contenido. Se usa Google Translate widget para traducción client-side.
