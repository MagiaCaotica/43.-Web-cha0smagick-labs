# AUDITORÍA SEO · GEO · ASO — cha0smagicklabs.com

> Objetivo del usuario: viralizar la web alcanzando el **#1 en long-tail keywords de alta ganancia y baja/nula competencia**, enfocado 100% a nuestro mercado (ocultismo/chaos magick, ES + EN, compra única sin suscripciones).
> Revisión 1 — 2026-10-13. Datos extraídos directamente del repo (950 HTML, sitemap, robots.txt, JSON-LD). Sin herramientas de volumen de keywords disponibles (búsqueda web caída durante la auditoría) — las keywords se priorizan por conocimiento de dominio + intención transaccional; validar en Google Search Console (gratuito) tras indexación.

---

## 1. RESUMEN EJECUTIVO

**Puntuación global: 8.2/10 técnico · 6.5/10 contenido · 3/10 autoridad (0 backlinks conocidos) · 4/10 ES**

| Área | Estado | Veredicto |
|---|---|---|
| Técnico SEO | 924 URLs en sitemap, robots.txt correcto, schema masivo, imgs 100% con alt | ✅ Sobresaliente |
| GEO (AI engines) | llms.txt + llms-full.txt (820 artículos), SpeakableSpecification ×704, FAQPage ×1767, GPTBot/ClaudeBot permitidos | ✅ Líder en el nicho |
| Contenido EN | 822 artículos blog + 62 tools, 3,300–3,700 palabras en series | ✅ Fuerte, con títulos truncados |
| Contenido ES | 53 páginas ES vs 894 EN, **cero hreflang** | 🚨 Océano azul sin explotar |
| ASO | 12 apps con SoftwareApplication+Offer, pero sin aggregateRating ni reviews | ⚠️ Corregible gratis |
| Autoridad | Sin estrategia de backlinks | ❌ La pieza que falta |

**La oportunidad #1 de viralidad no es técnica — es el mercado hispano:** 53/947 páginas en español cuando "generador de sigilos online gratis", "tarot rider waite app español" o "I Ching online gratis" tienen decenas de miles de búsquedas mensuales con SERPs débiles (herramientas genéricas, sitios sin marca, foros). Somos el único ecosistema completo (12 apps + 8 libros + 61 tools gratis) — en español casi no hay competencia organizada.

**Las 5 acciones con mayor ROI (todas gratis):**
1. **Expansión ES 53→150+ páginas** con pares EN/ES + hreflang bidireccional (sección 6).
2. **Retitular las series** con long-tail exacto (titles de 18–24 chars → 50–60 chars con keyword).
3. **ASO mínimo viable**: título Play ≤30 chars con keyword, primer screenshot con beneficio, prompt de review en la app → aggregateRating real.
4. **62 tool-pages → mini-landings SEO**: cada tool ya es un activo free; añadir bloque "cómo usar + artículo relacionado + CTA app/libro" con FAQPage propia.
5. **Backlinks orgánicos del nicho**: directorios ocultos, reddit r/chaosmagick (valor primero), Pinterest 5–10 pins/día hacia tools.

---

## 2. INVENTARIO

- **Sitemap: 924 URLs** = 822 blog EN (algunos ES) + 62 tools + ~40 root/books/apps/landing/compare.
- ~950 HTML reales en repo (walk del filesystem duplicó subdirectorios).
- Estructura: `/` root · `/books/` (9 landings PDF + index) · `/apps/` (12 landings) · `/tools/` (62) · `/blog/` (822) · `/compare/` (astral-lab-vs-co-star) · `/landing-pages/` (bundle, flash-sale, complete-access, affiliate) · `/lead-magnet/`.

## 3. SALUD TÉCNICA (números reales)

| Métrica | Valor | Impacto |
|---|---|---|
| Sin canonical | 3 | trivial |
| Sin meta description | 50 | corregir |
| Desc 51–155 chars mal | 185 (9.7%) | corregir lote |
| Titles mal longitud | 91 (18–24 chars truncados) | **prioridad alta** |
| Sin OpenGraph | 52 | corregir |
| Sin schema | 56 | corregir |
| H1 = 0 | 20 | corregir |
| H1 múltiples | 0 | ✅ |
| Sin lang | 36 | corregir |
| Sin viewport | 4 | corregir |
| Imgs sin alt | **0 de 15,302** | ✅ |

**Schema activo:** FAQPage ×1,767 · BreadcrumbList ×1,762 · BlogPosting/Article ×949 · Person ×1,728 (autor Frater Alek0s = E-E-A-T) · Product ×73 · Offer ×248 · SoftwareApplication ×52 · SpeakableSpecification ×704.
**robots.txt:** Allow /, Disallow /404 y /submissions, sitemap referenciado, GPTBot/ClaudeBot explícitamente permitidos (ventaja GEO vs competidores que los bloquean).

## 4. SEO POR SECCIÓN

### Root (index.html)
- Sin hreflang. Trust bar 4.5★/221 reviews. Cataloga "12 apps + 8 books".
- **Acción:** hreflang cluster + link a versión ES de homepage (cuando exista).

### Books (9 landings)
- Product+Offer schema. ES solo en catholiconomicon-es-pdf.
- **Acción:** clonar cada landing a par ES con `<link rel="alternate" hreflang>` mutuo; keywords transaccionales ES ("comprar libro magia del caos pdf", "grimorio digital español").

### Apps (12 landings)
- SoftwareApplication+Offer correctos, playLink presente. Sin aggregateRating (Google no mostrará estrellas).
- **Acción ASO:** aggregateRating cuando haya reviews Play reales (no inventar); keyword en H1 de cada landing ("Zener card test app", "Sigil generator app").

### Tools (62) — LA MINA DE ORO
- Ya posicionan como "gratis + sin registro", capturan email → tool-funnels.json mapea 61 tools→apps→books.
- **Acción:** cada tool debe tener (a) H1 con keyword long-tail exacta, (b) bloque "How to use" 300+ palabras, (c) FAQPage schema propia (3–5 preguntas), (d) link al artículo blog relacionado y a la app/libro correspondiente, (e) datos Speakable ya presentes.

### Blog (822)
- Series = capítulos distintos reales (no spun): H1 propios, 3,300–3,700 palabras, fecha+autor.
- **Problema único:** titles 18–24 chars truncados en SERP y slugs `-2/-3` sin keyword.
- **Acción:** retitular 50 títulos de series con long-tail exacto. Mantener slugs (no romper URLs); el title es lo que rankea.

### Compare (vs pages)
- Solo 1 página (astral-lab-vs-co-star). Patrón ganador probado ("X vs Y" = intención comercial, KD baja).
- **Acción:** 10 nuevas: tarot-chaos-vs-rider-waite, psi-gym-vs-zener-tradicional, dream-machine-vs-suenos-app, etc.

### Landing pages
- flash-sale/apps-bundle/books-bundle correctos tras la corrección de bundle (ver AUDITORIA-1-venta-por-hora.md).
- affiliate-terms L83: fila "Apps Bundle ($29.99)" obsoleta — limpiar cuando se reactive el programa de afiliados (punto 6 diferido).

## 5. GEO — MOTOR DE RESPUESTAS IA (ChatGPT, Perplexity, Google AI Overviews)

Estado: **de los mejores preparados del nicho** — llms.txt + llms-full.txt (820 artículos, 229KB), 704 SpeakableSpecification, 1,767 FAQPage, bots de IA permitidos.

Acciones restantes:
1. **llms-full.txt**: añadir sección "What is cha0smagicklabs.com" con ecosistema + precios + diferenciador ("only complete chaos magick ecosystem — books, apps, free tools — English & Spanish, one-time payment").
2. Las respuestas de IA citan respuestas directas: las FAQPage nuevas (tools) deben responder en 1–2 frases extraíbles.
3. Añadir `Organization` schema en root con logo + sameAs (Pinterest, GitHub) si falta.

## 6. ASO — GOOGLE PLAY (12 APPS)

| App | Precio | Estado ASO |
|---|---|---|
| Psi Gym (Zener) | $3.99 | SoftwareApplication OK, sin rating |
| Tarot Rider Waite | $9.99 | idem |
| Norse Rune Oracle | $3.99 | idem |
| Dream Machine | $3.99 | idem |
| Chaos Sigil Generator | $3.99 | idem |
| Astral Lab | $6.99 | idem |
| Arcana Goetia | $3.99 | idem |
| I Ching | $3.99 | idem |
| Lunar Phase | $3.99 | idem |
| Eerie Roads | $9.99 | idem |
| Lucid Dream | $9.99 | idem |
| NOCTEM (suite) | $14.99 | idem |

**ASO mínimo viable (gratis, sin redeploy de código):**
1. **Título Play ≤30 chars con keyword** — "Sigil Generator - Chaos Magick" no "Cha0smagick Sigil Thing". La keyword en título es el factor #1 de ASO.
2. **Primer screenshot = beneficio en texto grande** ("Free Sigil Generator · No Signup").
3. **Descripción Play**: primeras 3 líneas venden (visible sin expandir) con keyword exacta 2–3 veces.
4. **In-app review prompt** tras 3ª sesión de uso → ratings reales → aggregateRating en landing → estrellas en SERP (rich snippet). CTR +30% típico.
5. Landing web de cada app = página "X app for android" con Schema SoftwareApplication — ya existe; añadir aggregateRating cuando haya datos reales.

## 7. ESTRATEGIA LONG-TAIL — ALTA GANANCIA / BAJA COMPETENCIA

### Por qué ganamos
- Competencia EN en keywords tool: generadores genéricos sin marca, subreddits, sitios viejos sin schema. Nosotros: schema completo, tools funcionales gratis, marca, 61 herramientas.
- Competencia ES: **prácticamente inexistente** en el cruce ocultismo+software. 53 páginas ES vs 894 EN — invertir en ES es viralidad más barata.

### Keywords objetivo (validar volumen en GSC; intención confirmada por tipo de SERP)

**ES — herramientas (transaccional, KD≈0–15):**
| Keyword | Página destino | Estado |
|---|---|---|
| generador de sigilos online gratis | tools/ (sigil) + blog ES nuevo | crear tool-page ES |
| I Ching online gratis español | tools/iching | tool existe EN |
| test de cartas Zener online gratis | tools/ + psi-gym | crear ES |
| calendario lunar para hechizos | tools/ + blog ES | crear ES |
| ouija digital online gratis | tools/ + ouija-cazadora | crear ES |
| significado de los sueños diccionario | tools/dream-symbol-dictionary | ES version |
| runas vikingas significados guía completa | blog runas-para-chaos-magick (existe) | retitular |
| lectura de tarot gratis sin registro | apps tarot + tools | crear ES |
| péndulo digital online | tools/digital-pendulum | ES version |
| carta natal completa gratis | tools/full-birth-chart | ES version |
| temporizador de gnosis meditación | tools/gnosis-timer | ES version |
| tirada lenormand online gratis | tools/lenormand-card-draw | ES version |
| como hacer un sigilo paso a paso | blog ES (crear) | info → tool |
| proyección astral app android | apps/astral-lab ES | crear ES |
| libro magia del caos español pdf | books/catholiconomicon-es | existe, potenciar |

**EN — herramientas + buy-intent (KD≈10–30):**
| Keyword | Página destino |
|---|---|
| sigil generator free online no signup | tools/ sigil (title fix) |
| zener card test online free | tools/ + psi-gym |
| i ching coin toss online | tools/iching |
| elder futhark runes meaning chart | tools/elder-futhark-reference |
| dream symbol dictionary a–z | tools/dream-symbol-dictionary |
| banishing ritual how to | tools/banishing-ritual-builder |
| astral projection timer app | tools/ + astral-lab |
| lucid dream app one time payment | apps/lucid-dream |
| offline tarot app no subscription | apps/tarot |
| candle color meanings chart | tools/candle-color-calculator |
| chaos magick books in spanish | books/ ES |
| birth chart free full report no email | tools/full-birth-chart |
| pendulum divination online | tools/digital-pendulum |
| lenormand draw online free | tools/lenormand-card-draw |
| lunar calendar for spells | tools/ lunar |

### 3 palancas estructurales

1. **Expansión ES 53→150+**: clonar jerarquía EN clave → ES (homepage ES, books ES, apps ES, 40 tools ES, 40 blog ES). Cada par con hreflang mutuo + canonical self. Plantilla única = coste marginal bajo (scripts).
2. **Retitulado de series (50 títulos)**: de "Chaos Magick Fundamentals (2)" a "Chaos Magick Fundamentals: Testing Your Rituals (Step 2)". Keyword exacta al inicio, 50–60 chars.
3. **10 compare pages**: intención comercial pura, competencia casi nula fuera de astrología mainstream.

## 8. PLAN 4 SEMANAS (todo gratis)

**Semana 1 — Fundaciones**
- hreflang + homepage ES stub + corregir 91 titles mal (lote por script).
- ASO: reescribir 12 títulos Play + primeras líneas de descripción (2h).
- GSC: verificar dominio, enviar sitemap, activar Performance baseline.

**Semana 2 — ES attack**
- 15 tools ES (las de la tabla) + books ES completos + par de hreflang.
- Retitular 50 series + 50 meta descriptions rotas.

**Semana 3 — Contenido cluster**
- 10 compare pages + 10 blog ES long-tail ("cómo hacer un sigilo", "ritual luna nueva dinero") interlinkeando tool+app+libro.
- llms-full.txt sección ecosistema + Organization schema.

**Semana 4 — Autoridad**
- Pinterest 5–10 pins/día (pins/ ya existe como carpeta) hacia tools ES/EN.
- Reddit r/chaosmagick, r/witchcraft: 10 respuestas útiles con tool link solo cuando aporte (regla 90/10).
- Directorios del nicho + pedir inclusión en resource pages ("best chaos magick resources").

**KPI de control:** GSC impressions semana a semana por cluster; objetivo semanal: +10k impressions acumuladas; primer top-10 long-tail a ~4–6 semanas (indexación de páginas nuevas ~2–4 semanas).

## 9. RIESGOS Y SUPUESTOS

1. **KD/volumen estimados** por conocimiento de dominio (búsqueda web no disponible en la sesión). GSC dará datos reales gratis — decisión final de prioridad debe usarlos.
2. **Contenido ES clonado**: traducir con criterio (no machine-raw), conservar datos/precios; Google penaliza traducción automática de baja calidad a escala.
3. **aggregateRating**: solo con reviews reales de Play; inventarlo = penalización manual.
4. **hreflang requiere recíproco**: cada tag debe apuntar a página existente; 404 en pares rompe la señal.
5. **GSC sin verificar** = sin datos. Es el primer paso de la semana 1.

---

*Auditoría generada sobre estado real del repo: 924 URLs sitemap, ~950 HTML, 62 tools, 12 apps, schema inventory completo (sección 3). Complementa: docs/AUDITORIA-1-venta-por-hora.md (conversión) y docs/MAILERLITE-setup.md (email).*
