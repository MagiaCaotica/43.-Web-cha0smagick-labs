# PLAN DE MÁXIMA CONVERSIÓN — Cha0smagick Labs
**Fecha**: 12-ago-2026 · **Autor**: Sisyphus · **Estado**: EN EJECUCIÓN
**Objetivo**: Maximizar la conversión de ventas de apps (12) y libros (7) con el ECOSISTEMA ACTUAL (sitio estático GH Pages + MailerLite + Play Store + Hotmart), arreglando todos los blockers encontrados en la auditoría.

---

## 1. VEREDICTO DE LA AUDITORÍA (resumen ejecutivo)

- **Realidad**: ~1.5 pedidos/día TOTALES ($196.91 en 37 días jul-ago, $407.20 lifetime). Meta: 10+/día POR APP.
- **Diagnóstico unánime (todas las auditorías)**: infraestructura de conversión 9/10, distribución 1/10. Problema #1 = distribución/tráfico. Problema #2 = ceguera de medición (no sabemos qué canal convierte).
- **Este plan tiene DOS frentes simultáneos**:
  - **FRENTE A (este documento, código)**: arreglar TODOS los blockers de conversión y medición encontrados → más ventas por visita.
  - **FRENTE B (ejecución manual usuario)**: publicar canales de distribución ya listos (Reddit, ES form, outreach) → más visitas.

---

## 2. BLOCKERS ENCONTRADOS → ACCIÓN (código, se implementa ahora)

### P0 — MEDICIÓN CIEGA (sin esto no sabemos si algo funciona)
| # | Problema | Fix | Archivo |
|---|----------|-----|---------|
| 1 | GA4 consent-gated: `analytics_storage='denied'` por defecto → mayoría del tráfico invisible | Consent no-bloqueante: usar `'denied'` solo en EEUU/UE con banner sutil, o default `granted` con banner informativo; evento `cookie_consent` | js/shared.js |
| 2 | GSC NO verificado (sin meta tag en ninguna página; plan-5000-usd.md mintió "Configurado") | Añadir `<meta name="google-site-verification" content="...">` en index.html (usuario completa token real) | index.html |
| 3 | Meta Pixel ausente (placeholder nunca inyectado) | Inyectar snippet Meta Pixel en shared.js con ID real (usuario completa; Meta bloqueada hasta 02-dic-2026, dejar listo) | js/shared.js |
| 4 | Google Ads Conversion tag NO existe (README miente) | Dejar placeholder AW-XXXXX documentado (no activo) | js/shared.js |
| 5 | Sin UTM en CTAs Play/Hotmart → imposible atribuir ventas | UTM en TODOS los CTAs: `?utm_source=cha0smagicklabs&utm_medium=website&utm_campaign={página}` en apps-data.js, conversion.js, index.html | js/apps-data.js, js/conversion.js |
| 6 | Sin eventos purchase/view_item/form_submit | Añadir eventos GA4: `view_item` en landing apps, `purchase` en CTA Play/Hotmart, `form_submit` en email forms | js/conversion.js, js/app-render.js, js/shared.js |
| 7 | GA4 huérfano G-EVSTP1L5DN (dominio viejo) en witchcraft-for-beginners | Reemplazar por G-V6LHCPN9TK | blog/witchcraft-for-beginners-guide.html |
| 8 | Sin ads.txt/app-ads.txt | Crear ambos archivos en root | ads.txt, app-ads.txt |
| 9 | SECURITY: .env con secretos reales en git (Telegram/Discord/Groq/MailerLite JWT) | `git rm --cached .env`, añadir .gitignore, documentar rotación | .env, .gitignore |

### P0 — HOMEPAGE INVISIBLE PARA GOOGLE (SEO crítico)
| # | Problema | Fix | Archivo |
|---|----------|-----|---------|
| 10 | Home 100% JS-driven: HTML estático SIN ningún `<a href>` a apps/books → Google sin JS no ve productos | Añadir `<noscript>` block con links estáticos a las 19 páginas de producto + HTML fallback visible | index.html |
| 11 | Sitemap incluye 62 artículos noindex → confunde a Google | Regenerar sitemap.xml sin los 62 noindex (62 artículos AI-slop <500 palabras) | sitemap.xml |

### P1 — FUGAS DE LEADS Y CONVERSIÓN
| # | Problema | Fix | Archivo |
|---|----------|-----|---------|
| 12 | conversion.js NO carga en homepage (la página más importante) | Añadir `<script src="js/conversion.js">` en index.html | index.html |
| 13 | Sin popups ni exit-intent (captura de email débil) | Añadir popup MailerLite + exit-intent (delay 30s + mouseout) en conversion.js, activo en blog/tools/home | js/conversion.js |
| 14 | Form ES I95d94 nunca publicado, workflow en draft sin step email | ACCIÓN MANUAL usuario (dashboard MailerLite) — documentado §4 | — |
| 15 | Solo 1 de 5 emails de secuencia activo | ACCIÓN MANUAL usuario — documentado §4 | — |
| 16 | Sin post-purchase loop (cero onboarding/cross-sell/review-request) | Añadir review-request template + cross-sell en emails (documentar); añadir "gracias por comprar → comunidad + apps relacionadas" en CTA | docs |
| 17 | Affiliate.js inerte: ningún link usa `data-affiliate="true"` | Activar sistema: añadir `data-affiliate="true"` a CTAs principales | index.html, js/conversion.js |

### P2 — PRUEBA SOCIAL Y COMPARTICIÓN
| # | Problema | Fix | Archivo |
|---|----------|-----|---------|
| 18 | Testimonios solo contenedores JS vacíos | Renderizar 5 reviews reales estáticos (4.7★/128 reviews) en home | index.html |
| 19 | Sin share buttons verificados | Añadir botones compartir X/Pinterest/WhatsApp/Facebook funcionales en blog y apps | js/conversion.js |
| 20 | Sin screenshots/videos en landing apps | Añadir slots de screenshot (assets/ si existen; si no, placeholder documentado) | apps/*.html, js/app-render.js |

---

## 3. FRENTE B — CANALES DE DISTRIBUCIÓN (ejecución manual, prioridad por ROI)

| Canal | Estado | Acción | Impacto estimado |
|-------|--------|--------|------------------|
| **Reddit** | 3 posts listos, SIN publicar | Publicar 1/día en r/chaosmagick, r/occult, r/witchcraft (sin links pagados, aportar valor) | +tráfico nicho cualificado |
| **Email ES** | form I95d94 sin publicar + workflow draft | Publicar form + añadir step "Send email" (subject: "¡Tu Guía Gratis de Magia del Caos está aquí!") | recupera 30% tráfico español |
| **Email EN** | solo Email 1 de 5 activo | Activar emails 2-5 (mailerlite-emails-content.md) | +LTV por cross-sell |
| **Pinterest** | 137/200 pins | Subir 63 pins restantes (11 PNGs listos) | +tráfico visual |
| **Outreach** | 23/308 contactados | Enviar 3 templates a blogs tier-1 (Rune Soup, Lucky Mojo) | backlinks + referidos |
| **Shorts/TikTok** | NO ejecutado | 194 artículos → guiones 30-60s (auto-shorts repo listo) | potencial viral |
| **Google Ads** | pack copy listo (09-ago) | NUNCA a $3.99 sin tráfico validado; testear SOLO bundle $19.99 $5/día | marginal |
| **Meta Ads** | cuenta restringida hasta 02-dic-2026 | Preparar todo, NO pautar hasta desbloqueo | bloqueado |

---

## 4. ACCIONES MANUALES DEL USUARIO (no automatizables desde código)

1. **GSC**: completar token `google-site-verification` real en index.html → verify cha0smagicklabs.com (magiacaoticapractica@gmail.com) → enviar sitemap → pedir indexación de home + 5 artículos deep.
2. **Rotar secretos**: .env → cambiar tokens Telegram/Discord/Groq/MailerLite en los paneles (estaban commiteados).
3. **MailerLite ES**: publicar form I95d94 + activar workflow 194262410018686857 añadiendo step email.
4. **MailerLite EN**: activar emails 2-5 de la secuencia (mailerlite-emails-content.md).
5. **Meta Pixel**: completar Pixel ID real en shared.js cuando Meta se desbloquee (02-dic).
6. **Google Ads**: si se pauta, completar AW-XXXXX conversion ID.
7. **Publicar**: 3 posts Reddit + 63 pins + outreach emails (copiar-pegar, no hay SMTP).

---

## 5. CRITERIOS DE ÉXITO (en 30 días)

- [ ] GA4 mostrando tráfico real (consent arreglado) → saber visitas reales/mes
- [ ] GSC verificado con sitemap limpio → saber clicks de búsqueda
- [ ] UTM + eventos purchase/view_item → atribución de ventas por canal
- [ ] conversion.js en homepage + popups → +email subscribers
- [ ] Form ES activo → +30% tráfico español capturado
- [ ] 10+ pedidos/día TOTALES (primer hito; luego escalar por app)
- [ ] Sin secretos en git
