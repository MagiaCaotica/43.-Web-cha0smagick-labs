# Setup Guide: ES Automation + Meta Pixel + Disqus + Discord

> **Última actualización**: 2026-07-28
> **Propósito**: Pasos manuales que el administrador debe ejecutar en sus respectivos dashboards.

---

## 1. Activar ES Automation en MailerLite

**Qué es**: La automatización de Email Service (ES) en español ya está configurada pero **no activa** en el dashboard de MailerLite.

**Assets existentes**:
- Formulario ES listo en MailerLite ✅
- `docs/email-welcome-sequence.html` — 3 emails de bienvenida en español ✅

**Pasos**:
1. Ir a [MailerLite Dashboard](https://dashboard.mailerlite.com)
2. Ir a **Automations** → seleccionar la automation "ES Welcome Sequence"
3. Verificar que los 3 emails están correctos:
   - Email 1: Bienvenida + freebie (enlace a Codex Chaoticus)
   - Email 2: Artículo recomendado (tarot/sigilos)
   - Email 3: Oferta de app (Dream Machine o Chaos Sigil Generator)
4. Hacer clic en **Publish / Activate**
5. Configurar **trigger**: "When subscriber joins group ES"

> ⚠️ MailerLite tiene límite de 1000 suscriptores en plan gratuito. Si superas eso, necesitarás actualizar.

---

## 2. Agregar Meta Pixel (Facebook Retargeting)

**Dónde va**: En todas las páginas del sitio, dentro del `<head>` O justo después del `<body>`.

**Pasos**:
1. Ir a [Facebook Events Manager](https://www.facebook.com/events_manager)
2. Ir a **Connect Data Sources** → **Web** → **Meta Pixel**
3. Crear pixel → copiar el ID (ej: `1234567890`)
4. Agregar el código base pixel en todas las páginas. El snippet estándar es:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
<!-- End Meta Pixel Code -->
```

5. Reemplazar `YOUR_PIXEL_ID` con tu ID real
6. Insertar este código en el `<head>` de `index.html` (home) y en el `includes/header.html` (para que se cargue en todas las páginas)
7. **Verificar** con [Facebook Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper) extensión de Chrome

**Eventos adicionales recomendados**:
- `fbq('track', 'ViewContent')` — en páginas de blog
- `fbq('track', 'Search')` — en búsquedas
- `fbq('track', 'Purchase', {value: 3.99, currency: 'USD'})` — en apps después de compra

---

## 3. Agregar Disqus a los Artículos del Blog

**Dónde va**: Dentro de cada artículo del blog, entre el contenido y el footer. Disqus es un sistema de comentarios embedido.

**Pasos**:
1. Ir a [Disqus Admin](https://disqus.com/admin/create/)
2. Crear un nuevo sitio → `cha0smagicklabs` (o similar)
3. Copiar el **embed code** de Disqus (shortname)
4. Agregar este snippet en la plantilla de artículos (después del contenido, antes del footer):

```html
<!-- Disqus Comments -->
<div id="disqus_thread"></div>
<script>
    var disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = window.location.pathname;
    };
    (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://YOUR_SHORTNAME.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
</script>
<noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
<!-- End Disqus Comments -->
```

5. Reemplazar `YOUR_SHORTNAME` con tu shortname real
6. **Agregar a TODOS los artículos** existentes (se puede hacer con batch edit en el code editor)
7. Alternativa: usar **self-hosted remark42** si prefieres no depender de Disqus

---

## 4. Configurar Discord Server

**Qué hacer**: El servidor Discord ya está creado pero vacío. Necesita estructura y contenido.

**Estructura sugerida de canales**:

```
# 📜 ─ BIENVENIDA
# 📢 ─ anuncios
# 👋 ─ presentaciones
# 📋 ─ normas

# 🔮 ─ MAGIA Y OCULTISMO
# 🃏 ─ tarot
# ✏️ ─ sigilos
# 🌙 ─ sueños-lucidos
# 📖 ─ grimorio-compartido

# 💬 ─ COMUNIDAD
# 🗣️ ─ charla-general
# 🤝 ─ colaboraciones
# 📸 ─ shows-your-altar

# 🛠️ ─ APPS
# ⚙️ ─ chaos-sigil-generator
# 💭 ─ dream-machine
# 🐛 ─ bugs-y-feedback

# 🔒 ─ MIEMBROS-VIP (futuro, opcional)
```

**CTA en el sitio**:
- Agregar enlace a Discord en `conversion.js` (en `includes/`)
- Usar un invite link **permanente** (sin expiración)
- Colocar el CTA en: footer, popup de salida, y después de cada artículo

**Widget Discord** (opcional):
```html
<iframe src="https://discord.com/widget?id=SERVER_ID&theme=dark"
  width="350" height="500" allowtransparency="true" frameborder="0"
  sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
</iframe>
```

---

## 5. Google Ads Retargeting (Opcional pero Recomendado)

Después de Meta Pixel, el siguiente paso es Google Ads:

1. Ir a [Google Ads](https://ads.google.com/) → **Tools** → **Audience Manager**
2. Crear **remarketing tag** → copiar snippet global
3. Agregar snippet en `<head>` del sitio (junto al Meta Pixel)
4. Crear campaña de remarketing: 5-10% de presupuesto, segmentar visitantes de los últimos 30 días

---

## Resumen de Acciones Prioritarias

| # | Acción | Tiempo | Dificultad |
|---|--------|--------|------------|
| 1 | Activar ES automation en MailerLite dashboard | 5 min | Fácil |
| 2 | Agregar Meta Pixel code al sitio | 15 min | Fácil |
| 3 | Agregar Disqus a artículos del blog | 30 min | Media |
| 4 | Estructurar canales de Discord | 30 min | Fácil |
| 5 | Agregar CTA Discord en conversion.js | 10 min | Fácil |
| 6 | Google Ads remarketing tag | 20 min | Media |

**Recomendación**: Hacer #1 hoy (5 min), #2 y #3 esta semana, #4 y #5 en la misma sesión.
