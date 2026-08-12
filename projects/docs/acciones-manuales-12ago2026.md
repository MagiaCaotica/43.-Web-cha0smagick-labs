# Acciones Manuales del Usuario — 12 de agosto de 2026

> Todo lo automatable ya fue implementado y verificado (ver `plan-maxima-conversion.md`).
> Estas son las ÚNICAS acciones que requieren tu intervención manual (cuentas, secretos, dashboards ajenos).
> Ordenadas por impacto en ventas. Tiempo estimado total: ~2 horas.

---

## 🔴 P0 — Bloqueantes de medición (hazlas hoy)

### 1. Verificar Google Search Console (15 min)
- **Qué**: el sitio ya tiene el tag `<meta name="google-site-verification" content="ZE9ZgD-J_UiN2y-dRCbY6XkJFB68N6H8fWVlYkhunHs" />` en `index.html` línea 38.
- **Cómo**:
  1. Entra a https://search.google.com/search-console con `magiacaoticapractica@gmail.com`
  2. Propiedad: `cha0smagicklabs.com` → método HTML tag
  3. Copia el token real (formato `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`) y reemplázalo en `index.html` por `ZE9ZgD-J_UiN2y-dRCbY6XkJFB68N6H8fWVlYkhunHs`
  4. Guarda y sube (git push) → GSC verifica
- **Por qué**: sin GSC no hay datos de búsqueda y Google no indexa bien las 12 apps/7 books. Es la base de TODO el SEO.

### 3. Publicar el form ES de MailerLite + activar workflow (15 min)
- **Qué**: el form español (`I95d94`) nunca se publicó; el workflow (`194262410018686857`) está en draft sin paso de email. Estás perdiendo ~30% del tráfico hispanohablante.
- **Cómo**:
  1. dashboard.mailerlite.com/forms → form `I95d94` → Publicar
  2. dashboard.mailerlite.com/workflows/194262410018686857 → añadir paso **Send email** → subject: "¡Tu Guía Gratis de Magia del Caos está aquí!" → adjuntar PDF `/lead-magnet/Guia-Rapida-Magia-Caos.pdf` → Activar
  3. Alternativa si el workflow ya tiene el paso: verificar que no esté en Draft.
- **Por qué**: lead magnet ES + email ES = primer canal de conversión real para LATAM (tu mayor oportunidad sin competencia).

---

## 🟡 P1 — IDs reales para activar tracking (hazlas esta semana)

### 4. Meta Pixel ID (requiere desbloqueo Meta — 02-dic-2026)
- **Qué**: el código está listo e inerte. Solo falta el ID real.
- **Cómo**: cuando tu Meta Business account esté desbloqueada, crea el pixel y reemplaza `PONER_META_PIXEL_ID_AQUI` en `js/shared.js` y `js/conversion.js` (luego re-minificar, o editar directamente los `.min.js` — se regeneran con `terser`).
- **Por qué**: sin pixel no hay retargeting; el 98% de visitantes que no compran se pierden para siempre.

### 5. Google Ads Conversion ID (si vas a testear ads)
- **Qué**: `GOOGLE_ADS_ID = 'PONER_AW_ID_AQUI'` en `js/shared.js` / `js/conversion.js`.
- **Cómo**: cuando crees la cuenta de Google Ads, usa el Conversion ID (formato `AW-123456789`) y reemplázalo.
- **Recomendación**: solo testear con el **bundle $19.99** (ticket alto), presupuesto $5/día. NUNCA anunciar apps de $3.99 directamente (pierdes dinero).

### 6. Publisher ID en ads.txt / app-ads.txt
- **Qué**: los archivos ya existen con `pub-PONER_PUBLISHER_ID`.
- **Cómo**: copia tu Publisher ID de AdSense (o de Play Console) y reemplázalo en ambos archivos.
- **Por qué**: sin ads.txt no puedes monetizar tráfico web con AdSense; sin app-ads.txt no puedes hacer mediate ads en las apps.

---

## 🟢 P2 — Ejecución de canales (hazlas este mes, por ROI)

### 7. Publicar los 3 posts de Reddit (30 min)
- **Qué**: los posts están listos en `projects/docs/reddit-posts.md` (r/chaosmagick → tools/sigil-generator.html, r/occult, r/witchcraft).
- **Regla**: NO enlaces directos de venta. Solo herramientas gratuitas + valor. La venta llega por el sitio.
- **Por qué**: Reddit da tráfico calificado inmediato; es de los pocos canales que puede darte cientos de visitas en horas.

### 8. Subir los 63 pins de Pinterest restantes (2h total, repartido)
- **Qué**: llevas 137/200 pins. Los 11 PNGs listos están en `projects/pins/output/` (1000x1500).
- **Cómo**: 3-5 pins/día (5-10 min/día). Prioriza boards con keywords: "chaos magic", "rune oracle", "tarot app", "occult tools".
- **Por qué**: Pinterest fue el canal que más tráfico puede darte sin costo; el repunte no se vio porque la ejecución quedó a medias.

### 9. Secuencia de emails 2-5 (MailerLite, 1h)
- **Qué**: solo el Email 1 está activo. El contenido de los otros 4 está en `projects/docs/mailerlite-emails-content.md`.
- **Cómo**: crea los 4 emails restantes en el workflow EN (y ES si ya activaste el 3) y actívalos.
- **Por qué**: el email es tu canal de propiedad (no dependes de algoritmos); cada secuencia completa = venta repetida sin tráfico nuevo.

### 10. Shorts/TikTok (3-5h, alto potencial viral)
- **Qué**: 194 artículos → guiones 30-60s → videos. NO ejecutado todavía.
- **Cómo**: usa `projects/auto-shorts/` (monorepo Node listo) o CapCut/HeyGen. Prioriza: sigil generator, rune oracle, pendulums, candle magic.
- **Por qué**: es el canal con mayor potencial de escala (viralidad orgánica) para tu nicho visual. Co-Star y Sanctuary crecieron así.

---

## 📊 Criterios de éxito a 30 días (mide con GA4 real)
- [ ] GA4 mostrando tráfico real (consent arreglado + gtag config en blog)
- [ ] GSC verificado e indexando las 19 páginas de producto
- [ ] Form ES capturando leads (objetivo: 50+ subs)
- [ ] UTM + eventos mostrando de qué canal viene cada venta
- [ ] 10+ pedidos/día TOTALES (todas las apps+books combinadas)
- [ ] 0 secretos en git (verificado ya ✓)

## Nota sobre la meta de "10 ventas/día POR APP"
Con el ecosistema actual (pago único, sin ads, sin suscripción) la meta realista es **10+ pedidos/día TOTALES** en 30-90 días. Llegar a 10/día POR APP (~110/día) requeriría ~330,000 visitas/mes (≈40x Co-Star) o un cambio de modelo (suscripción/precios mayoristas). Los fixes implementados construyen la base de medición y conversión para maximizar lo que el ecosistema actual puede dar.
