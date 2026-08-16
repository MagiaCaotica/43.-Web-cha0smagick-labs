# Plan de Ventas Automatizadas — cha0smagicklabs.com

**Meta**: $500-1,000/mes a 6-12 meses (blanco: $833/mes, promedio del plan-5000-usd)
**Presupuesto**: $0 (100% herramientas gratuitas)
**Intervención humana**: 5-10 h/semana; tras la configuración inicial, casi todo es alimentar contenido y revisar métricas
**Mercado**: LATAM (embudo WhatsApp/Hotmart) + Global (embudo email/Google Play)
**Fecha**: 2026-08-10 · **Estado**: pendiente de ejecución del checklist inicial

---

## 1. Diagnóstico en una línea

El sistema de **conversión** está construido (9/10: embudos de email, popups planificados, 7 libros + bundle en Hotmart, 11 apps, afiliados, comunidad). Lo que falta es **distribución**: nadie llega. Y el embudo actual usa el canal gringo (email) para un público cuyo canal natural de compra es WhatsApp.

> Nadie compra porque nadie llega. Y los que llegan (email) no son el público que compra en LATAM.

---

## 2. Por qué EE.UU. ≠ LATAM (el diferencial)

| Dimensión | Gringo (lo que NO te sirve) | LATAM (lo que SÍ) |
|---|---|---|
| Canal de venta | Email + landing (abre ~20%) | **WhatsApp/DM** (abre ~90%+, respuesta directa, genera confianza) |
| Pago | Tarjeta internacional/Stripe | Tarjetas *solo locales* no pagan USD → **Hotmart con OXXO / Pix / PSE / NEQUI / MercadoPago** |
| Adquisición | X/Twitter, Product Hunt, SEO-SaaS | **TikTok/Reels/Shorts** + **red de afiliados Hotmart** (1M+ afiliados LATAM) + Pinterest (buscador perpetuo) |
| Confianza | Reviews, sistema de estrellas | Prueba social en DM/WhatsApp, comunidad (Discord/Telegram), creadores que ya siguen |

**Conclusión**: no un embudo, sino **dos embudos paralelos compartiendo una sola fábrica de contenido**.

---

## 3. Arquitectura: 2 embudos, 1 máquina

```
        FABRICA DE CONTENIDO (220 articulos -> guiones -> videos, con auto-shorts)
                      |
        +-------------+--------------+
        v                            v
   EMBUDO A - LATAM            EMBUDO B - GLOBAL
   TikTok + IG Reels           YouTube Shorts
        |                            |
   Bio -> WhatsApp Business      Sitio web (SEO + popups)
   (catalogo + auto-respuesta)  -> MailerLite (secuencias EN activas)
        |                            |
   Hotmart checkout local       Google Play + Hotmart global
   (OXXO/Pix/PSE/MercadoPago)   (USD, tarjetas internacionales)
        |                            |
   +-----> Comunidad Discord/Telegram + Referidos <-----+
```

Ambos embudos convergen en: **comunidad + referidos** (word-of-mouth programado).

---

## 4. Los 4 motores de adquisición (100% automatizables)

### 4.1 Motor TikTok/Reels/Shorts — "fábrica de cortos"
- **Materia prima**: 220 artículos del blog (134 indexados) → 220+ guiones de 30-60 s.
- **Herramienta**: ya tienes el pipeline `auto-shorts`/ffcreator en el repo → el humano solo **selecciona y sube**.
- **Frecuencia**: 1-3 videos/semana. Consistencia > viralidad.
- **Formato ganador** (tu público: "los que quieren resolver problemas con una de nuestras apps"):
  `Problema del día (ritual/pesadilla/energía/dinero) → solución con la app X → CTA: link en bio`.
- **CTA en cada video**: comentario fijado + bio → WhatsApp (LATAM) o sitio (global).

### 4.2 Motor afiliados Hotmart — el "viral" real
- Programa de afiliados con **40% de comisión** para atraer afiliados al marketplace de Hotmart (1M+ afiliados LATAM).
- Los afiliados LATAM **pueden cobrar su comisión localmente** (OXXO/Pix/PSE) → es tu amplificación sin costo.
- Proporciona material: banners, links cortos, 3 capturas de pantalla, un guion de video para que lo republicuen.

### 4.3 Motor Pinterest — búsqueda perpetua
- Ya hay 137 pins. **Convertir la cuenta a Business** (15 min, una sola vez) → desbloquea API y programación.
- Programar **5-10 pins/semana en bloque** desde los 220 artículos (Tailwind free tier o la API tras conversión).
- Pinterest es buscador: cada pin da clics durante meses sin mantenimiento.

### 4.4 Motor referidos — word-of-mouth programado
- Email Día 7 (ya diseñado en MailerLite): "Compraste X → te regalamos 30% por recomendar".
- WhatsApp: enlace de referido automático tras la compra (respuesta automática).
- En la comunidad: canal `#recompensas` visible (prueba social pública).

---

## 5. La máquina de ventas automatizada (el funnel)

| Etapa | Pieza | Estado |
|---|---|---|
| 0. Lead magnet | PDF "Guía Rápida" (EN + ES) ya en MailerLite para capturar email | Listo |
| 1. Captura | Popup exit-intent + banner promo (planificado en plan-5000-usd) | Pendiente de instalación |
| 2. Nutrición | Secuencia email 5 días EN+ES → vende el libro de menor precio ($4.99) | Activa |
| 3. Upsell checkout | Hotmart bundle 7 libros $19.99 (−52%) en upsell de checkout | Listo |
| 4. Cross-sell apps | Email Día 7: "Eres comprador → 50% en la app X" | Borrador listo |
| 5. **Colección Completa** | **TU idea**: bundle "todas las apps + todos los libros" con descuento progresivo (20→30→40% según cuánto lleves) — por construir en Hotmart | **Nuevo** |
| 6. Referidos + reviews | Enlace de referido + pedido de review (Play/Hotmart) → círculo virtuoso | Pendiente |

**Decisión clave**: el embudo empieza vendiendo el **libro barato ($4.99)** como puerta de entrada LATAM (pago local, decisión sin fricción) y **asciende** al bundle → apps → Colección Completa. Para el público "resolver problemas", el lead magnet y el primer video de cada app siembran esa escalera.

---

## 6. Qué se vende y a quién (alineado con tu público)

Cada app resuelve un problema → el artículo/blog correspondiente atrae a ese público → el corto lo engancha → la venta cierra en su canal.

| Problema (público) | App | Contenido | Canal de cierre |
|---|---|---|---|
| Sueños/pesadillas, interpretación | App de sueños | Artículos + cortos "qué significa soñar X" | WhatsApp / Hotmart |
| Rituales/energía diaria | Apps de rituales/talismanes | Guías paso a paso | WhatsApp / Hotmart |
| Tarot/decisiones | Unofficial Rider Waite Tarot | "3 tiradas para decidir Y" (7 idiomas) | Play Store / Hotmart |
| Entrenar intuición/telepatía | PSI GYM | Tests Zener + "afina tu intuición" | Play Store |
| Crear sigilos para manifestar | Magick Chaos Sigil Generator | Guía de sigilos paso a paso | Play Store (+ cross-sell bundle) |
| Consultar las runas | Norse Rune Oracle | "Qué significa cada runa" | Play Store |
| Tener sueños lúcidos / interpretarlos | Dream Machine | Cortos "método MILD/WILD" | Play Store / Hotmart (libro de sueños) |
| Astrología / carta natal | Astral Lab (offline) | Artículos de signos y casas | Play Store |
| Trabajo espiritual guiado | Arcana Goetia | Tutorial: sigilos de los 72 espíritus | Play Store (+ cross-sell bundle) |
| Decidir con el I Ching | I Ching Oracle | "3 monedas, 64 hexagramas" | Play Store |
| Magia/rituales según la luna | Lunar Phase Calculator | Calendario lunar (magia y jardín) | Play Store |
| Manifestar intención / sincronicidad | Eerie Roads | "GPS del caos": ruta aleatoria con intención | Play Store |
| Investigación paranormal profesional | NOCTEM ($14.99) | SLS/EVO/EMF: el video más viral de TikTok | Play Store (alto ticket) |

> ⚠️ Verificar si `apps/lucid-dream.html` es alias de Dream Machine antes de publicar títulos duplicados en Play.

> Regla: **posicionamiento específico gana** ("app para interpretar sueños" > "app esotérica"). Un video = un problema = una app.

---

## 7. Intervención humana MÍNIMA

### 7.1 Configuración inicial — 3-4 horas, UNA sola vez
- [ ] **1. Hotmart**: verificar 7 libros publicados con checkout local activo (OXXO/Pix/PSE/MercadoPago) + bundle $19.99 en upsell.
- [ ] **2. Programa de afiliados** Hotmart: comisión 40% + material para afiliados (banners, link corto, 3 capturas, guion).
- [ ] **3. WhatsApp Business**: perfil completo + catálogo (7 libros + bundle) + **respuesta automática con catálogo** al primer mensaje.
- [ ] **4. Pinterest → Business** (15 min): conversión de cuenta + conexión para programar.
- [ ] **5. Meta Pixel real**: crear ID + pegar en el sitio (10 min) — necesario para ads cuando haya presupuesto.
- [ ] **6. MailerLite**: activar workflow ES (si no está) + instalar popup exit-intent / banner promo.
- [ ] **7. Bios**: TikTok/IG/YT → link a "tienda" (enlace en bio → Hotmart + WhatsApp).
- [ ] **8. Colección Completa**: crear el bundle grande en Hotmart (20→30→40% progresivo).

### 7.2 Rutina semanal (5-10 h, con automatización de por medio)
- 1-3 videos/semana desde los guiones generados por auto-shorts (solo seleccionar y subir).
- Programar pins en bloque (una sesión semanal).
- 30 min/semana respondiendo comunidad Discord/Telegram + DM de WhatsApp.
- 15 min/semana revisando métricas (GA4 + Hotmart + WhatsApp Business).

---

## 8. Métricas y metas

- **Meta**: $833/mes (promedio del rango $500-1,000) — consistente con plan-5000-usd.
- Conversión 1% → **3,000-5,000 visitas/mes** requeridas.
- **KPIs semanales**: vistas TikTok, clics a bio, suscriptores email, ventas Hotmart, conversaciones WhatsApp.
- **Primera meta de validación**: 5 ventas de libros en 30 días (cualquier ingreso demuestra el flujo).

---

## 9. No hacer (antipatrones)

- No X/Twitter como canal primario (público gringo, no convierte en LATAM).
- No ads pagados todavía (presupuesto $0) — primero validar el funnel orgánico.
- No perseguir viralidad — consistencia de 1-3 videos/semana gana a largo plazo.
- No posicionamiento genérico ("app esotérica") — específico por problema.
- No esperar a tener todo perfecto para empezar a publicar.