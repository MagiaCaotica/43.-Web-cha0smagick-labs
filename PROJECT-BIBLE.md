# PROJECT BIBLE — Cha0smagick Labs Website

> **Este archivo es la fuente de verdad del proyecto.** Leerlo cada vez que se abra el proyecto.
> Última actualización: 2026-08-08 (reorganización completa: estructura web intacta en root, proyectos paralelos en `projects/`)

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

## 2. ESTRUCTURA DE DIRECTORIOS — ROOT (SOLO LA WEB)

```
ROOT/  ← GitHub Pages deploy source
├── index.html                           # HOMEPAGE
├── 404.html                             # Página de error personalizada
├── glossary.html                        # Glosario oculto (100+ términos)
├── best-occult-apps-android.html        # Comparativa de apps
├── privacy-policy.html                  # Política de privacidad
├── sw.js                                # Service Worker v1.1.0
├── manifest.json                        # PWA manifest
├── CNAME                                # cha0smagicklabs.com
├── .nojekyll                            # Desactiva Jekyll en GH Pages
├── _headers                             # Security headers (Netlify-style)
├── robots.txt                           # Crawl rules
├── sitemap.xml                          # ~176 URLs
├── llms.txt                             # LLM-friendly site description
├── CONTENT-PLAN.md                      # Roadmap de contenido
├── PROJECT-BIBLE.md                     # ← ESTE ARCHIVO
│
├── css/
│   ├── style.css                        # Main stylesheet (1758 líneas)
│   └── style.min.css                    # Minified
│
├── js/
│   ├── apps-data.js                     # CATÁLOGO DE DATOS (837 líneas)
│   ├── apps-data.min.js                 # Minified
│   ├── app-render.js                    # MOTOR DE RENDERING (600 líneas)
│   ├── app-render.min.js                # Minified
│   ├── shared.js                        # Funciones compartidas (161 líneas)
│   ├── shared.min.js                    # Minified
│   ├── visitor-map.js                   # Mapa de visitantes (249 líneas)
│   └── visitor-map.min.js               # Minified
│
├── apps/                                # 11 landing pages de apps Android
│   ├── psi-gym.html
│   ├── arcana-goetia.html
│   ├── norse-rune-oracle.html
│   ├── lunar-phase-calculator.html
│   ├── iching-oracle.html
│   ├── chaos-sigil-generator.html
│   ├── unofficial-rider-waite-tarot.html
│   ├── dream-machine.html
│   ├── astral-lab.html
│   ├── noctem-tools.html
│   └── eerieroads.html
│
├── books/                               # 7 landing pages de libros PDF (Hotmart)
│   ├── manual-activacion-servidores-magicos-pdf.html
│   ├── tratado-runas-cazadoras-caos-pdf.html
│   ├── ouija-cazadora-pdf.html
│   ├── liber-lvpinux-pdf.html
│   ├── mind-the-gap-pdf.html
│   ├── codex-chaoticus-pdf.html
│   └── tarot-chaos-pdf.html
│
├── blog/                                # 194 artículos + index
│   ├── index.html                       # Blog index con filtros por categoría
│   └── *.html                           # 194 artículos individuales
│
├── tools/                               # 10 herramientas gratuitas + index
│   ├── index.html                       # Directorio de tools
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
│   └── app-details.html                 # Template dinámico (usa ?id= query params)
│
├── assets/
│   ├── icons/                           # PWA icons (192px, 512px)
│   └── images/
│       ├── Banner.png / .webp           # Logo principal
│       ├── *.png / *.webp               # App icons + screenshots (75 archivos)
│       ├── flags/                       # 9 SVG flags (gb, es, fr, de, it, pt, ru, jp, cn)
│       └── blog/                        # Blog images (71 pares PNG+WebP)
│
├── images/
│   └── tarotchaos.PNG                   # Portada legacy
│
├── lead-magnet/                         # Lead magnets EN/ES
│   ├── guia-rapida-magia-caos-es.html
│   └── quickstart-guide-chaos-magick-en.html
│
├── .github/workflows/
│   └── pages.yml                        # GitHub Actions deploy
│
└── node_modules/                        # Solo para devDeps (terser, clean-css)
```

---

## 3. ESTRUCTURA DE DIRECTORIOS — PROJECTS/ (PROYECTOS PARALELOS)

```
projects/  ← NO se despliega a GitHub Pages. Solo desarrollo/interno.
├── auto-shorts/                         # Proyecto Node.js separado (auto-shorts generator)
│   ├── packages/                        # Monorepo: inkpaint, ffcreator, etc.
│   ├── src/                             # Source code
│   ├── test/                            # Tests
│   ├── ui/                              # UI components
│   ├── shorts/                          # Output shorts
│   ├── res/                             # Resources
│   ├── node_modules/                    # Dependencias (grande)
│   ├── package.json
│   └── LICENSE
│
├── app-submissions/                     # Assets para tiendas de apps (Play Store)
│   ├── metadata.json                    # Metadata de todas las apps
│   ├── arcana-goetia/
│   ├── chaos-sigil-generator/
│   ├── dream-machine/
│   ├── iching-oracle/
│   ├── lunar-phase-calculator/
│   ├── norse-rune-oracle/
│   ├── psi-gym/
│   └── unofficial-rider-waite-tarot/
│
├── clientes/                            # Base de datos clientes + emails
│   ├── base-clientes.csv                # 18KB - Base principal
│   ├── mails2.xlsx                      # Emails crudos
│   ├── mails3.txt                       # Emails parseados
│   ├── _build_base.py                   # Script build base
│   └── _mails3_parsed.json              # JSON parseado
│
├── docs/                                # 20+ documentos estratégicos
│   ├── backlink-outreach.md
│   ├── blog-audit-report.md
│   ├── bot-ecosystem.md
│   ├── bottleneck-resolution.md
│   ├── discord-telegram-audit.md
│   ├── ecosystem-complete.md
│   ├── email-welcome-sequence.html
│   ├── gsc-indexing-verification.md
│   ├── hotmart-bundle-strategy.md
│   ├── launch-playbook.md
│   ├── mailerlite-emails-content.md
│   ├── outreach-contacts-master.md
│   ├── phase-2-3-prd.md
│   ├── pinterest-200-pin-strategy.md
│   ├── pinterest-strategy.md
│   ├── pinterest-upload-guide.md
│   ├── plan-5000-usd.md
│   ├── plan-clientes-b2b.md
│   ├── reddit-posts.md
│   ├── setup-guide-es-automation-meta-disqus.md
│   ├── status-ejecucion.md
│   ├── strategic-sales-audit.md
│   └── twitter-strategy.md
│
├── pinterest-pins/                      # 137 pins Pinterest + generadores
│   ├── output/                          # Pins generados
│   ├── generate-pin-files.js
│   ├── pin-batch.html
│   ├── pin-data-200.json                # 200 pins data
│   ├── pin-data.js
│   ├── pin-data.json
│   ├── pin-renderer.html
│   └── pin-template.html
│
├── research/                            # Investigación de mercado
│   └── play-store-sales-research.md
│
├── scripts/                             # 170+ scripts automatización (Python/JS)
│   ├── generate-app-pages.mjs           # Genera /apps/*.html
│   ├── generate-tool-pages.mjs          # Genera /tools/*.html
│   ├── generate-articles.py             # Genera blog articles
│   ├── minify_assets.py                 # Minifica CSS/JS
│   ├── add_schemas.py                   # Inyecta Schema.org
│   ├── add_hreflang.py                  # Inyecta hreflang
│   ├── add_table_of_contents.py         # Genera TOC
│   ├── add_related_articles.py          # Cross-linking
│   ├── generate-noctem-articles.py      # Artículos NOCTEM (SEO)
│   ├── generate-eerieroads-articles.py
│   ├── generate-coverage_articles.py
│   ├── generate_final_batch.py
│   ├── expand-articles.js / pass2.js
│   ├── bot-brain.js                     # Knowledge base bots
│   ├── groq-ai.js                       # Groq Q&A module
│   ├── telegram-bot.js                  # Telegram bot (11 comandos)
│   ├── discord-bot.js                   # Discord bot (slash commands)
│   ├── run-bots.js                      # Runner (telegram/discord/all)
│   ├── social-publish.js                # X/Twitter + Pinterest calendar
│   ├── share-noctem-news.js
│   ├── share-noctem-posts.js
│   ├── share-noctem-discord.js
│   ├── share-noctem-rest.js
│   ├── pinterest-batch-upload.js / v2.js
│   ├── play-financial-fetch.py
│   ├── play-orders-real.py
│   ├── play-orders.py
│   ├── play-sales-report.py
│   ├── add-cross-links.ps1
│   ├── add-giscus-to-articles.ps1
│   ├── audit_all_articles.py
│   ├── fix_all_issues.py
│   ├── check-published.js
│   ├── check-real-pkgs.py
│   ├── check-pkgs.py
│   └── ... (~150 scripts más)
│
├── undefined/                           # Carpeta temporal / legacy
│
├── *.yaml, *.yml                        # Workflows, configs, snippets (50+ archivos)
│   ├── after-activate.yaml, after-badclick.yaml, after-canvas.yaml
│   ├── after-create.yaml, after-select.yaml, back-workflow.yaml
│   ├── builder-fresh.yaml, builder-main.yaml, builder-ready.yaml
│   ├── builder-steps.yaml, check.yaml, compose-snap-14.yml
│   ├── compose-snap.md, compose-tweet3.md, create-page2.yaml
│   ├── current.yaml, editor-scratch.yaml, email1-open.yaml
│   ├── final-check.yaml, form-dropdown.yaml, form-select.yaml
│   ├── html-editor.yaml, import-html.yaml, kit-automations.yml
│   ├── kit-dashboard-snapshot.yml, kit-dashboard-snapshot2.yml
│   ├── kit-form-editor.yml, kit-forms-deep.yml, kit-forms-list.yml
│   ├── kit-forms-snapshot.yml, kit-rules-deadlock.yml, kit-rules-new.yml
│   ├── kit-sequences.yml, mailerlite-automations.yaml
│   ├── mailerlite-create.yaml, mailerlite-embedded-forms.yml
│   ├── mailerlite-forms-embedded.yml, mailerlite-forms.md
│   ├── page-full.md, pin-creation.yml, pin-page.yml
│   ├── playstore.json, post-activate.yaml, post-tweet2.md
│   ├── refresh.yaml, rules-export.yml, sidebar-full.md
│   ├── simple-editor.yaml, state.yaml, template-gallery.yaml
│   ├── temp_api.ps1, trigger-placed.yaml, workflow-builder.yaml
│   ├── x-compose-2.md, x-compose.md, x-home-snapshot.yml
│   ├── x-home-t19.yml, x-home.yml, x-login-check.md
│   ├── x-profile-2.md, x-snapshot-2.md, home-snap.md
│
├── *.md                                 # Documentos sueltos
│   ├── medium-article-digitizing-the-arcane.md
│   ├── profile-readme-template.md
│
├── *.csv, *.json                        # Datos varios
│   ├── earn.csv, earn.zip
│   ├── ventasago.zip, ventasago2026.csv
│   ├── ventasjul.zip, ventasjul2026.csv
│   ├── stats.csv, reviews.csv
│   ├── cookies.json, cookies_temp.json
│
├── *.png                                # Screenshots/dashboard
│   ├── mailerlite-full.png, mailerlite-workflow.png
│   ├── pinterest-dashboard.png, es-form-preview.png
│
└── *.py, *.ps1                          # Scripts sueltos
    ├── check_titles.py
    ├── temp_api.ps1
```

---

## 4. MAPEO COMPLETO DE PÁGINAS WEB (DEPLOYABLES)

### 4.1 Páginas Core (5)
| Archivo | Descripción |
|---------|-------------|
| `index.html` | Homepage - Hero, apps grid, books section, FAQ, footer con mapa |
| `404.html` | Página de error custom con link a home |
| `glossary.html` | Glosario 100+ términos ocultos |
| `best-occult-apps-android.html` | Comparativa mejores apps ocultas Android |
| `privacy-policy.html` | Política privacidad + cookie consent |

### 4.2 Landing Pages Apps Android (11)
| Archivo | App | Precio | ID en apps-data.js |
|---------|-----|--------|-------------------|
| `apps/psi-gym.html` | PSI GYM: Zener ESP Trainer | $3.99 | `psi-gym` |
| `apps/arcana-goetia.html` | Arcana Goetia: Ritual & Sigils | $3.99 | `arcana-goetia` |
| `apps/norse-rune-oracle.html` | Norse Rune Oracle | $3.99 | `norse-rune-oracle` |
| `apps/lunar-phase-calculator.html` | Lunar Phase Calculator | $3.99 | `lunar-phase-calculator` |
| `apps/iching-oracle.html` | I Ching Oracle | $3.99 | `iching-oracle` |
| `apps/chaos-sigil-generator.html` | Magick Chaos Sigil Generator | $3.99 | `chaos-sigil-generator` |
| `apps/unofficial-rider-waite-tarot.html` | Rider Waite Tarot Complete | $9.99 | `unofficial-rider-waite-tarot` |
| `apps/dream-machine.html` | Dream Machine: Lucid Dreaming | $3.99 | `dream-machine` |
| `apps/astral-lab.html` | Astral Lab | $3.99 | `astral-lab` |
| `apps/noctem-tools.html` | NOCTEM — Paranormal Suite | $14.99 | `noctem-tools` |
| `apps/eerieroads.html` | Eerie Roads: Mysterious Paths | $9.99 | `eerieroads` |

### 4.3 Landing Pages Libros PDF — Hotmart (7)
| Archivo | Libro | Precio | ID en apps-data.js |
|---------|-------|--------|-------------------|
| `books/manual-activacion-servidores-magicos-pdf.html` | Magical Servitors Manual | $3.99 | `manual-activacion-servidores-magicos-pdf` |
| `books/tratado-runas-cazadoras-caos-pdf.html` | Treatise of Chaos Hunter Runes | $3.99 | `tratado-runas-cazadoras-caos-pdf` |
| `books/ouija-cazadora-pdf.html` | Ouija Cazadora | $3.99 | `ouija-cazadora-pdf` |
| `books/liber-lvpinux-pdf.html` | Liber Lvpinux | $3.99 | `liber-lvpinux-pdf` |
| `books/mind-the-gap-pdf.html` | Mind The Gap (self-help) | $9.99 | `mind-the-gap-pdf` |
| `books/codex-chaoticus-pdf.html` | Codex Chaoticus | $4.99 | `codex-chaoticus-pdf` |
| `books/tarot-chaos-pdf.html` | Tarot Chaos | $9.99 | `tarot-chaos-pdf` |

### 4.4 Blog (194 artículos + index)
| Archivo | Descripción |
|---------|-------------|
| `blog/index.html` | Blog index con filtros por categoría (11 categorías) |
| `blog/*.html` | 194 artículos generados via `generate-articles.py` |

**Categorías blog:** `all`, `sigils-code`, `divination`, `dreaming`, `goetia`, `runes`, `moon-magic`, `tarot`, `i-ching`, `basics`, `reviews`, `free-tools`, `advanced`

### 4.5 Herramientas Gratuitas (10 + index)
| Archivo | Tool | HF Space Embed |
|---------|------|----------------|
| `tools/index.html` | Directorio de tools | — |
| `tools/iching.html` | I Ching Oracle | `cha0smagick-oraculo-de-iching.hf.space` |
| `tools/viking-runes.html` | Viking Rune Oracle | `cha0smagick-viking-runes.hf.space` |
| `tools/sigil-generator.html` | Sigil Generator | `cha0smagick-sigil-generator.hf.space` |
| `tools/lunar-phase.html` | Lunar Phase Calculator | `cha0smagick-lunar-phase.hf.space` |
| `tools/spell-builder.html` | Spell Builder | `cha0smagick-spell-builder.hf.space` |
| `tools/astrology-sign-calculator.html` | Astrology Sign Calculator | `cha0smagick-astrology-sign-calculator.hf.space` |
| `tools/candle-color-calculator.html` | Candle Color Calculator | `cha0smagick-candle-color.hf.space` |
| `tools/digital-pendulum.html` | Digital Pendulum | `cha0smagick-digital-pendulum.hf.space` |
| `tools/tengwar-transcriber.html` | Tengwar Transcriber | `cha0smagick-tengwar-transcriber.hf.space` |
| `tools/activador-servidores.html` | Servitor Activator | `cha0smagick-servitor-activator.hf.space` |

### 4.6 Páginas Dinámicas / Templates
| Archivo | Descripción |
|---------|-------------|
| `pages/about.html` | About Us page |
| `pages/app-details.html` | Template dinámico — usa `?id=` query param para renderizar detalle app/libro |

### 4.7 Lead Magnets (2)
| Archivo | Idioma |
|---------|--------|
| `lead-magnet/guia-rapida-magia-caos-es.html` | Español |
| `lead-magnet/quickstart-guide-chaos-magick-en.html` | English |

---

## 5. ARQUITECTURA DE DATOS (RUNTIME)

### 5.1 Archivo central: `js/apps-data.js`

Contiene **dos arrays globales** fuente de verdad del catálogo:

#### `appsData[]` — Aplicaciones Android (11)
| # | ID | Nombre | Precio |
|---|-----|--------|--------|
| 1 | `psi-gym` | PSI GYM: Zener Cards & ESP | $3.99 |
| 2 | `arcana-goetia` | Arcana Goetia: Ritual & Sigils | $3.99 |
| 3 | `norse-rune-oracle` | Norse Rune Oracle | $3.99 |
| 4 | `lunar-phase-calculator` | Lunar Phase Calculator | $3.99 |
| 5 | `iching-oracle` | I Ching Oracle | $3.99 |
| 6 | `chaos-sigil-generator` | Magick Chaos Sigil Generator | $3.99 |
| 7 | `unofficial-rider-waite-tarot` | Unofficial Rider Waite Tarot | $9.99 |
| 8 | `dream-machine` | Dream Machine: Lucid Dreaming | $3.99 |
| 9 | `astral-lab` | Astral Lab | $3.99 |
| 10 | `noctem-tools` | NOCTEM — Paranormal Suite | $14.99 |
| 11 | `eerieroads` | Eerie Roads: Mysterious Paths | $9.99 |

#### `booksData[]` — Libros PDF Hotmart (7)
| # | ID | Nombre | Precio | Idioma |
|---|-----|--------|--------|--------|
| 1 | `manual-activacion-servidores-magicos-pdf` | Magical Servitors Manual | $3.99 | Spanish |
| 2 | `tratado-runas-cazadoras-caos-pdf` | Treatise of Chaos Hunter Runes | $3.99 | Spanish |
| 3 | `ouija-cazadora-pdf` | Ouija Cazadora | $3.99 | Spanish |
| 4 | `liber-lvpinux-pdf` | Liber Lvpinux | $3.99 | Spanish |
| 5 | `codex-chaoticus-pdf` | Codex Chaoticus | $4.99 | EN/ES |
| 6 | `tarot-chaos-pdf` | Tarot Chaos | $9.99 | EN/ES |

---

## 6. SCRIPTS DE GENERACIÓN (EN `projects/scripts/`)

| Script | Propósito | Input | Output |
|--------|-----------|-------|--------|
| `generate-app-pages.mjs` | Genera `/apps/*.html` | `appsData[]` + `booksData[]` (hardcoded) | 18 páginas en `/apps/` |
| `generate-tool-pages.mjs` | Genera `/tools/*.html` | Array `tools[]` hardcoded | 11 páginas en `/tools/` |
| `generate-articles.py` | Genera `/blog/*.html` | Datos Python estructurados | 194 artículos en `/blog/` |
| `minify_assets.py` | Minifica CSS/JS | `css/style.css`, `js/*.js` | `.min.css`, `.min.js` |
| `add_schemas.py` | Inyecta Schema.org | HTML existente | HTML + JSON-LD |
| `add_hreflang.py` | Inyecta hreflang | HTML existente | HTML + hreflang |
| `add_table_of_contents.py` | Genera TOC | Artículos blog | HTML + TOC |
| `add_related_articles.py` | Cross-linking | Artículos blog | HTML + related links |
| `generate-noctem-articles.py` | 10 artículos SEO NOCTEM | Datos NOCTEM | `/blog/noctem-*.html` |
| `bot-brain.js` | Knowledge base bots | Datos catálogo | Objeto JS compartido |
| `telegram-bot.js` | Telegram bot (polling) | `bot-brain.js`, Groq | 11 comandos + /ask |
| `discord-bot.js` | Discord bot (slash) | `bot-brain.js`, Groq | 10 slash + /ask |
| `run-bots.js` | Runner | — | `node run-bots.js [telegram\|discord\|all]` |
| `social-publish.js` | X/Twitter + Pinterest | Calendar + assets | Auto-posting |
| `pinterest-batch-upload.js` | Sube 137 pins | `projects/pinterest-pins/` | Pinterest API |
| `play-sales-report.py` | Reporte ventas Play | Play Console API | CSV/JSON |

---

## 7. MÉTRICAS ACTUALES (AGOSTO 2026)

| Métrica | Cantidad |
|---------|----------|
| **Páginas HTML totales (deployables)** | ~226 |
| Artículos del blog | 194 |
| Landing pages de apps | 11 |
| Landing pages de libros | 7 |
| Herramientas gratuitas | 10 |
| Páginas core | 5 |
| Lead magnets | 2 |
| Archivos JS fuente | 4 (+ 4 minified) |
| Archivos CSS | 1 (+ 1 minified) |
| Imágenes de blog | 142 (71 × 2 formatos) |
| Imágenes de assets | 75 |
| **Scripts en `projects/scripts/`** | ~170 |
| **Documentos en `projects/docs/`** | 21 |
| **Pins Pinterest** | 137 |
| **Apps Android publicadas** | 11 |
| **Libros PDF en Hotmart** | 7 (bundle $19.99) |

---

## 8. SERVICIOS EXTERNOS

| Servicio | Propósito | ID/URL |
|----------|-----------|--------|
| Google Analytics 4 | Analytics | `G-V6LHCPN9TK` |
| Google Translate | Multiidioma (9) | Lazy-loaded |
| Leaflet.js 1.9.4 | Mapa visitantes | unpkg CDN |
| CartoCDN | Tiles dark map | basemaps.cartocdn.com |
| OpenStreetMap | Tiles fallback | tile.openstreetmap.org |
| Hotmart | E-commerce PDFs | Checkout widget lazy-loaded |
| Google Play Store | Apps Android | Links directos |
| HuggingFace Spaces | Tools embebidas (10) | iframes |
| flagcdn.com | Flags SVG | Inline img |
| Google Fonts | Inter + JetBrains Mono | Preconnect + preload |
| Groq AI | Bot Q&A | `llama-3.3-70b-versatile` |
| Telegram Bot API | Telegram bot | `node-telegram-bot-api` |
| Discord.js v14 | Discord bot | `discord.js` |

---

## 9. DEPLOY CHECKLIST

### Pre-deploy (solo afecta ROOT/)
1. ☐ Actualizar `js/apps-data.js` (datos fuente)
2. ☐ Ejecutar `node projects/scripts/generate-app-pages.mjs` (si hay apps/libros nuevos)
3. ☐ Ejecutar `node projects/scripts/generate-tool-pages.mjs` (si hay tools nuevas)
4. ☐ Ejecutar `python projects/scripts/generate-articles.py` (si hay blog posts nuevos)
5. ☐ Ejecutar `python projects/scripts/minify_assets.py`
6. ☐ Actualizar `sitemap.xml` con nuevas URLs
7. ☐ Actualizar `sw.js` PRECACHE_URLS si hay nuevos JS/CSS core
8. ☐ Verificar que las imágenes existen en `assets/images/`
9. ☐ Hacer push a GitHub → GitHub Actions deploya a Pages

### Post-deploy
- Verificar `cha0smagicklabs.com` carga correctamente
- Verificar GA4 events en Realtime
- Verificar sitemap en Search Console

---

## 10. NOTAS IMPORTANTES

1. **Rutas relativas:** Desde `/apps/*.html` y `/blog/*.html`, las rutas a assets usan `../`. Desde `/` (homepage) no.
2. **Dual data:** Los datos de apps/books existen en DOS lugares: `js/apps-data.js` (runtime) Y `projects/scripts/generate-app-pages.mjs` (generación). Si cambias uno, **DEBES** cambiar el otro.
3. **Minificación:** Siempre editar los archivos FUENTE (.js, .css), nunca los .min.js/.min.css directamente.
4. **Imágenes:** Todo debe existir en WebP (primario) + PNG (fallback). La función `buildPictureHtml()` genera el `<picture>` automáticamente.
5. **Consent mode:** GA4 carga con consent DENIED por defecto. Solo se activa con click explícito en "Accept cookies".
6. **No hay backend:** 100% estático. No hay API, no hay base de datos, no hay server-side rendering.
7. **Google Translate:** No existe traducción real del contenido. Se usa Google Translate widget para traducción client-side.
8. **`projects/` NO se despliega:** Solo `ROOT/` es el source de GitHub Pages. `projects/` contiene todo el trabajo interno, scripts, datos, investigación, proyectos paralelos.
9. **auto-shorts es proyecto separado:** Tiene su propio `package.json`, `node_modules`, y estructura. No interfere con la web.

---

## 11. ESTRUCTURA HTML REUTILIZABLE (REFERENCIA RÁPIDA)

Ver secciones 7.1–7.4 en versión anterior del PROJECT-BIBLE.md para:
- Head tags obligatorias
- Header + Nav + Breadcrumb
- Footer completo (mapa + contador + links + social)
- Scripts al final del body (orden importa)

---

## 12. SCHEMA.ORG POR TIPO DE PÁGINA

| Página | Schemas |
|--------|---------|
| Homepage | `Organization`, `WebSite`, `ItemList`, `FAQPage` |
| App Detail | `SoftwareApplication`, `Product`, `BreadcrumbList` |
| Book Detail | `Book`, `Product`, `BreadcrumbList` |
| Tool Page | `WebApplication`, `BreadcrumbList` |
| Blog Article | `Article`/`BlogPosting`, `BreadcrumbList`, `Person` |

---

*Fin del mapeo. Este documento refleja el estado tras la reorganización del 2026-08-08.*