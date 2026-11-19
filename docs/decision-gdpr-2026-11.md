# Decisión: exposición de datos personales (noviembre 2026)

**Fecha:** 2026-11-19
**Estado:** registro interno de decisión. No es asesoramiento jurídico.
**Responsable:** dirección.

## Qué pasó

El repositorio era público y GitHub Pages servía la raíz completa. Varios ficheros con datos
personales y credenciales estuvieron accesibles por HTTP 200:

| Fichero | Contenido | Estado |
|---|---|---|
| `projects/clientes/base-clientes.csv`, `mails2.xlsx`, `mails3.txt` | Base de clientes: nombres, correos y datos de contacto | Retirado 2026-11-19 |
| `projects/ventasago2026.csv`, `ventasjul2026.csv`, `earn.csv` y sus `.zip` | Exportes de Play con ciudad, estado y código postal del comprador | Retirado 2026-11-19 |
| `projects/reviews.csv`, `projects/stats.csv` | Reseñas y métricas de usuarios | Retirado 2026-11-19 |
| `projects/cookies.json` | Cookies de sesión de Google, MailerLite, Pinterest, Stripe, X, Reddit y LinkedIn | Retirado 2026-11-19 |
| `.env` (en 2 commits) | Tokens de Telegram, Discord y Groq | Purgado del historial 2026-11-19 |
| `_ml-*.js`, `temp_api.ps1` | JWT de la API de MailerLite | Purgado del historial 2026-11-19 |

**Ventana de exposición:** desconocida. GitHub Pages no entrega logs de acceso, así que no se puede
demostrar que nadie los descargara. Se trata, por tanto, como **posible acceso no autorizado**.

**Qué se hizo:** retirada del árbol, purga del historial con `git filter-repo`, force-push y
verificación de 404 en producción. Los objetos antiguos pueden seguir accesibles por SHA hasta que
GitHub recolecte basura.

## Evaluación de riesgo

| Factor | Valoración |
|---|---|
| Categorías de datos | Identificativos y de contacto; ubicación aproximada (ciudad/CP) de compradores; credenciales de sesión |
| Datos sensibles (art. 9) | No consta |
| Número de afectados | No determinado; la base de clientes y los exportes de ventas son de escala pequeña |
| Accesibilidad | Pública, sin autenticación, indexable solo si alguien enlazó los ficheros |
| Riesgo para los derechos | Medio: suplantación o phishing posibles con correos + nombres; acceso a cuentas si las cookies seguían vivas |
| Prueba de acceso | Ninguna; ausencia de logs = incertidumbre, no inocuidad |

## Decisión

1. **Rotar todas las credenciales** que aparecían (Telegram, Discord, Groq, MailerLite) y cerrar
   sesiones en Google, Stripe, Pinterest, X, Reddit y LinkedIn. Sin esto, la purga es cosmética.
2. **No afirmar** en ningún canal que los datos no se consultaron.
3. **Evaluar la notificación** a la autoridad de control (AEPD, España) en 72 horas desde el
   conocimiento, si se concluye riesgo alto. Con los datos actuales el riesgo se clasifica como medio;
   la decisión final corresponde a dirección con asesoría legal.
4. **Conservar este registro** como prueba de la evaluación (art. 33.5 RGPD).
5. **Eliminar las copias locales** de los ficheros retirados que no sean necesarias para la operación
   (incluido el bundle de seguridad creado para la purga) una vez verificada la web.
6. **Impedir la recurrencia:** ningún fichero con datos de clientes, ventas o credenciales se guarda
   dentro del repo publicado. Se guardan fuera, y `.gitignore` lo refleja.

## Comprobaciones pendientes (dueño)

- [ ] Revocar el JWT de MailerLite y comprobar que devuelve 401.
- [ ] Rotar bot de Telegram, Discord (secret y bot) y Groq.
- [ ] Cerrar sesiones y cambiar contraseñas en las cuentas listadas.
- [ ] Revisar actividad reciente en Google Play Console, Stripe y MailerLite.
- [ ] Decidir notificación a la AEPD y, si procede, a los afectados.
- [ ] Pedir a soporte de GitHub la purga de objetos antiguos o pasar el repo a privado.
- [ ] Borrar `%TEMP%\opencode\pre-purge.bundle` (contiene los secretos).
