# Base de Clientes / Contactos + Plan de Email

> Generada automáticamente desde `clientes/mails2.xlsx` y `clientes/mails3.txt`
> ⚠️ Estas NO son compras de apps: son **contactos B2B** (youtubers, canales, grupos de investigación paranormal, portales, podcasts). Se tratan como **outreach/influencer + newsletter**, no como transacción de venta directa.

## 1. Base organizada (resultado)

| Métrica | Valor |
|---|---|
| **Total de contactos unificados (dedupe)** | **308** |
| YouTubers/canales con nombre (mails2.xlsx) | 42 |
| Emails de grupos/portales/podcasts paranormales (mails3.txt) | 266 |
| Idioma ES | 288 |
| Idioma EN | 20 |
| Tipo: youtuber/canal | 42 |
| Tipo: admin/media | 41 |
| Tipo: grupo | 216 |
| Tipo: intl (dominio europeo) | 9 |

**Archivo maestro:** `clientes/base-clientes.csv` (columnas: email, nombre, idioma, tipo, fuente).
- Ordenado por email, dedupe global (`mails3` ∩ `mails2` sin duplicados).
- Script reproducible: `clientes/_build_base.py`.

## 2. Verificación: ¿incluidos en el plan de ventas?

- `docs/launch-playbook.md` **NO incluye a estos 308**. Solo menciona los "23 contactos" de backlink-outreach (blogs, no influencers).
- `docs/strategic-sales-audit.md` reconoce el influencer/cross-promotion como **pilar de distribución** (p.35, p.77) pero no tenía lista lista.
- ➡️ **Activo pendiente a agregar al plan** (lo hago a continuación en docs/launch-playbook.md).
- La secuencia de email 2-5 (docs/mailerlite-emails-content.md) está pensada para **compradores**, no para estos contactos. Aquí toca mensaje distinto.

## 3. Estrategia de email propuesta (qué hacer con ellos)

Son influencers/portales, no compradores. El valor está en:
- **Newsletter/cross-promo**: afiliación + mención del sitio → tráfico.
- **App gratis a cambio** (lo que el usuario pidió): "te doy app gratis para que la conozcas y, si quieres, la recomiendes/afil приходи".

Secuencia de 2 correos por segmento (segmentados: ES influencers / EN influencers / grupos offline):

| Paso | Público | Asunto (ES) | Objetivo | CTA |
|---|---|---|---|---|
| **Email 1 — rompe hielo** | 308 | "Hola [nombre], soy creador de apps oscultismo/paranormal" | Calentar: presentar Cha0smagick Labs, 11 apps, sin venta | Visitar chaos0smagicklabs.com |
| **Email 2 — app gratis condicionada** | 1-7 días | "¿Quieres una app gratis de quien quieras?" | Afilic newsletter + probar la app | Responder SÍ + afiliar |
| **Follow-up** | no-respondedores | "Asunto alterno" | Trigger | Repl y visita web |

Reglas:
- La app gratis se da **solo si responden SÍ a la afiliación** de la newsletter (mailerlite) + visitan la web (**guión exacto del usuario**).
- No hay SMTP → copiar-pegar desde Gmail/Hotmail con plantillas en `docs/backlink-outreach.md` (mismo patrón).
- 20 EN: mensaje en inglés. 9 intl europeos idem.

### Draft Email 1 — ES (rompe hielo)
```
Asunto: El mago de las apps ocultas (sin venta)

Hola {nombre},

Soy [tu nombre], fundador de **Cha0smagick Labs**: un estudio indie de apps de
ocultismo, loevero, y esos temas que a ti también te vuelan.

Hice 11 apps (grimorios sigilos, NOCTEM, arcanos, etc.) y un bundle en Hotmart.
Sin vendette nada: solo por curiosidad/asociación, mírate la web.

👉 cha0smagicklabs.com

Si te interesa lo que hago, estaría encantado de colaborar contigo — ya sea
mencionarte, escribiros cross-ficción, o darte una app gratis.

¿Te pinto?
```

### Draft Email 2 — app gratis si afili
```
{Asunto}: ¿Quieres una app gratis de quien quieras?

Hola {nombre}, era lo que te escribí el otro día.

He pensado que, si te interesa el mundo ocultista, te mola probar **cualquiera
de mis apps gratis** — la que quieras: NOCTEM, Sigil Forge, Arcana, el grimorio...

Solo dos condiciones y son fáciles:
1. Te suscribes a mi newsletter (1 mail/semana, valió la pena).
2. Visitas la web una vez para que no suene a cosa rara.

cha0smagicklabs.com

Di **SÍ** y te paso el código de la app que elijas. Tiempo de oferta: estos días.
```

**Métrica de éxito:** conversión Newsletter afilic ≥ 15% de los que responden; 8-15 apps regaladas; retorno en menciones/backlinks (branding).

## 4. Acción concreta (siguiente paso)
1. ✅ Base creada (`base-contacts.csv`, 308).
2. ✅ Email drafts v1 (ES + EN) listos.
3. ⏳ **Agregar este plan al `docs/launch-playbook.md`** alinear con distribución Instagram (falta).
4. ⏳ Importar a MailerLite (subsegmento) o copiar-pegar a Gmail/Outlook.