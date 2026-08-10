# Checklist CRO — Páginas clave de conversión (Entregable 4)

> Objetivo: convertir al visitante del blog en comprador de apps/libros del sitio.
> Páginas auditadas (análisis real del HTML en disco, 2026-08-09):
> 1. `index.html` — home "The Complete Occult Collection: 11 Apps & 7 Books"
> 2. `best-occult-apps-android.html` — guía de compra "Best Occult Apps for Android 2026" (mejor conversión actual: 9 CTAs directos a Google Play)
> 3. `lead-magnet/quickstart-guide-chaos-magick-en.html` — landing gratuita (lead magnet), hoy desconectada de la oferta

Nota: **no existe página "FAQ" dedicada ni "LTrump"** en el sitio; las secciones FAQ viven en index.html (7 preguntas) y best-occult-apps-android.html (3 preguntas).

---

## Diagnóstico en una frase por página

| Página | Conversión hoy | Problema raíz |
|---|---|---|
| `index.html` | Media | Los 2 CTAs principales llevan a `#products` (scroll interno), no a la tienda; CTA de compra real está disperso. |
| `best-occult-apps-android.html` | Buena | CTAs Play directos excelentes; falta precio en tabla comparativa, urgencia y prueba social cuantificada. |
| `lead-magnet/...en.html` | Nula | 0 botones, 1 enlace en todo el documento: la sección 5 "Tools, Apps & Resources" menciona apps y libros SIN enlazarlos. |

---

## 1. `index.html` (home)

### P0 — Alto impacto
- [ ] **CTA directo a Google Play en el hero**: añadir botón "Get on Google Play" (colección de apps, `https://play.google.com/store/apps/developer?id=...`) junto a "Explore the collection →". El scroll interno `#products` no convierte al visitante frío del blog.
- [ ] **Conectar el lead magnet EN**: CTA "📥 Download Free Quickstart PDF" ya existe → añadir un segundo enlace a la misma landing desde la sección "Why the Complete Collection" (captura de email → lista para secuencia de venta).
- [ ] **Precio visible en el primer viewport**: "💰 One-Time Payment" y "🔒 100% Offline & Private" están en la sección inferior "Why Our Tools Work" → subir un sello ("One-time payment, no subscription, 100% offline") junto al H1/CTA.

### P1 — Medio
- [ ] **FAQ de objeción**: añadir 3-4 preguntas orientadas a compra: "¿Cómo funciona el pago único?", "¿Las apps reciben actualizaciones?", "¿Qué pasa después de comprar?", "¿Funcionan sin conexión en todos los dispositivos Android?". (Actuales: 7 preguntas institucionales, ninguna sobre compra.)
- [ ] **Schema FAQPage JSON-LD** en la home (las FAQ ya son visibles; falta marcado estructurado para rich results).
- [ ] **Prueba social real**: "Trusted by 128+ Practitioners" y "What Practitioners Say" no muestran evidencia (23 estrellas sin contexto visible) → añadir 3-5 testimonios con nombre/inicial + fuente (Google Play rating), o al menos estrellas + "4.x on Google Play".

### P2 — Pulido
- [ ] **Una sola zona "Community"**: hay 5 CTAs de comunidad dispersos (Blog, YouTube, Telegram×2, Instagram, Discord banner) que diluyen la acción de compra → agruparlos en el footer/banner final.
- [ ] **UTM en CTAs Play** desde la home (`?utm_source=cha0smagicklabs.com&utm_medium=home`) para medir conversión real.

## 2. `best-occult-apps-android.html` (guía de compra)

### P0
- [ ] **`<h1>` con guión correcto**: el H1 usa "– 2026 Buyer's Guide"; mantener, pero revisar codificación (se renderiza mal en consolas cp1252; en UTF-8 OK).

### P1
- [ ] **Columna de precio en la tabla comparativa**: añadir "Price" (one-time vs subscription) — es la ventaja diferencial frente a competidores SaaS; visible ya en copy (BUYSIG:36) pero no como tabla comparable.
- [ ] **Sticky CTA** "GET IT ON Google Play" al hacer scroll (la página es larga; 9 secciones duplicadas).
- [ ] **FAQ extra**: "¿En qué dispositivos funciona?" + "¿Garantía/devolución?" + "¿Actualizaciones incluidas?" (3 actuales: offline, suscripción, alternativas gratis).
- [ ] **Schema FAQPage JSON-LD** aquí también.

### P2
- [ ] **Prueba social cuantificada**: número de descargas + rating medio de Google Play junto a la tabla ("4.5★ · 1,000+ downloads").

## 3. `lead-magnet/quickstart-guide-chaos-magick-en.html` (landing EN)

### P0 (crítico — es el embudo de entrada EN)
- [ ] **CORREGIR TYPO del H1**: "Quickstart **Guideto** Chaos Magick" → "Quickstart **Guide to** Chaos Magick" (SEO + confianza).
- [ ] **Enlazar la sección 5**: "5.1 Android Apps for the Chaos Magician" → enlazar 2-3 apps concretas (apps/*.html) y la colección; "5.2 Books for Deeper Study" → enlazar books/*.html; hoy LINKS:1 en todo el documento.
- [ ] **CTA final de conversión**: el H3 "Get the Complete Collection" existe sin botón → añadir botón "Browse All Apps & Books" → `index.html#products` + "Download on Google Play".

### P1
- [ ] **Formulario de captura**: la landing no tiene forms/inputs → si es lead magnet, añadir opt-in por email (lo que exige backend/third-party; alternativa mínima: enlace directo a la oferta).
- [ ] **META-DESC vacía** (extraído: vacía) → escribir una con keyword "chaos magick quickstart guide".

---

## Medición sugerida (post-fixes)
- UTM en todos los CTAs Play (`utm_source`, `utm_medium`, `utm_campaign`).
- Pico de scroll en home (análisis propio o herramienta externa) para validar el hero.
- Ratio clics `#products` → clic Play en best-occult.

---

**Fuente de datos:** extracción automática del HTML real (script `projects/ventas/_cro2.js`), 2026-08-09.