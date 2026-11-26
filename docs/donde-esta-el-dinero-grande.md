# Dónde está el dinero grande

Fecha: 26 nov 2026 · Base: `docs/analisis-keywords-2026-11-26.md` + keywords CSV + catálogo real (12 apps, 8 libros, 2 packs, comunidad de 2.715).

---

## 0. Search Console: la conexión está muerta

`node .gsc.cjs sites` → `invalid_grant`. El refresh token caducó o fue revocado. **No tengo datos de posiciones ni de clics.** Todo lo que sigue son modelos sobre el CSV de keywords, no medición.

Para revivirlo hacen falta dos pasos tuyos:

1. Abrir esta URL y aprobar con la cuenta dueña de la propiedad:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=905033198628-q0vcmsrkndct16td1gqvdejj6umivodf.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A8765%2F&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fwebmasters.readonly&access_type=offline&prompt=consent&include_granted_scopes=true
```

2. El navegador acabará en `http://localhost:8765/?code=...` y fallará. Copia la URL completa y pásamela. Yo ejecuto:

```
node .gsc.cjs exchange "<URL completa>"
```

Con eso respondo la pregunta que de verdad importa: **qué keywords te dan clics hoy, en qué puesto, y cuáles generan cero.** Las consultas ya están escritas en el repo (`top-queries`, `top-pages`, `query-page`, `country`, `device`, `daily`).

---

## 1. La respuesta corta

**El dinero grande no está en otra keyword. Está en el precio del producto.**

Por cada 1.000 visitas que ya podrías tener:

| Oferta | Conversión | Ingreso por 1.000 visitas |
|---|---|---|
| App $3,99 | 2,0% | **$80** |
| Libro $9,99 | 1,0% | $100 |
| Pack $29,99 | 0,5% | $150 |
| Membresía $12/mes (6 meses) | 0,2% | $144 |
| **Curso $97** | **0,3%** | **$291** |

Tu catálogo entero vive entre $2,99 y $29,99. Con el mismo tráfico, un producto de $97 rinde **3,6 veces** más que la app más barata. Eso no requiere una sola visita nueva.

Y al revés: multiplicar el tráfico por 8 con la oferta actual rinde menos que dejar el tráfico igual y arreglar la oferta.

---

## 2. La matriz

Visitas/mes (eje) × oferta (columna). Cifras en USD/mes.

| Oferta | 5.000 visitas | 15.000 visitas | 40.000 visitas |
|---|---|---|---|
| App $3,99 | $399 | $1.197 | $3.192 |
| Libro $9,99 | $500 | $1.498 | $3.996 |
| Pack $29,99 | $750 | $2.249 | $5.998 |
| Membresía $12/mes | $720 | $2.160 | $5.760 |
| **Curso $97** | **$1.455** | **$4.365** | **$11.640** |

Para llegar a **$10.000/mes** hay tres rutas, y solo una es realista este año:

1. 40.000 visitas/mes con curso de $97 → 11.640. Requiere ganar el long tail de astral y astrología.
2. 40.000 visitas/mes con pack + membresía → ~11.700. Mismo requisito de tráfico.
3. **2.715 personas en Telegram usando una membresía de $12/mes** → 2.715 × 0,2%… si conviertes el 3% de la comunidad: 81 × $12 = **$972/mes sin una sola visita nueva**, y eso es solo el 3%.

El tráfico que ya tienes vale poco con este catálogo. La comunidad que ya tienes no se está monetizando en absoluto.

---

## 3. Cuánto tráfico hay realmente disponible

| Cluster | Búsquedas/mes declaradas | Páginas tuyas | Captura al 3% |
|---|---|---|---|
| astral / proyección | 540.400 | 27 | 16.212 |
| astrología / carta natal | 1.449.250 | 39 | 43.478 |
| goetia / demonios | 189.200 | 122 | 5.676 |
| sigilos + caos | 44.200 | 212 | 1.326 |

Pero el volumen declarado está inflado por alias (7 keywords de 50.000 son la misma consulta). Descontando un 40%: **astral + astrología ≈ 800.000/mes reales**, captura al 3% ≈ **24.000 visitas/mes**.

24.000 visitas × curso $97 × 0,3% = **$8.400/mes**. Esa es la meta alcanzable con lo que ya tienes escrito, si ganas posiciones en astral.

---

## 4. Las cuatro palancas, ordenadas por retorno

### Palanca 1 · Precio (retorno ×3,6 · esfuerzo: crear el producto)

No tienes nada entre $29,99 y $300. Ese hueco es el negocio.

- **Curso de goetia a $97.** `goetia` tiene CPC de $11,15: hay anunciantes pagando eso por un clic, lo que significa comprador, no curioso. Ya tienes 122 páginas del tema, la app y el pack. Un curso de 6 módulos con las invocaciones, los sellos y el protocolo de seguridad se vende a $97 en este nicho sin discusión.
- **Membresía de $12/mes.** 2.715 personas ya te siguen gratis. Un 3% convirtiendo son $972/mes recurrentes, y el contenido ya existe (949 posts, 40 herramientas).
- Regla: el pack de $29,99 se queda como **order bump**, no como techo.

### Palanca 2 · Volumen astral/astrología (retorno ×4 · esfuerzo: alto, competencia brutal)

- 24.000 visitas/mes potenciales frente a las 5.676 de goetia.
- Compites con Co-Star y Astro.com, que son gratis. En esos términos no ganas por contenido: ganas por **long tail** (carta natal de X, luna en Y para Z) donde ellos no tienen página.
- Ya tienes 66 páginas. El hueco no es cantidad: es profundidad en las 5 intenciones reales (proyección, viaje astral, plano astral, meditación guiada, fuera del cuerpo) y en las calculadoras, que ya existen y ahora están en inglés.

### Palanca 3 · Play Store (retorno alto · esfuerzo: bajo · lo más desaprovechado)

Tienes 12 apps y **cero estrategia de ASO**. La tienda es un buscador con compradores: quien busca "tarot app" ya quiere instalar. No dependes de Google, ni de un blog, ni de un packing de conversión.

- Coste marginal de un install: $0.
- Precio: $2,99 a $14,99, pago único, sin suscripción. Eso es un argumento de venta real frente a las apps de suscripción.
- Lo que falta: título/subtítulo con la keyword, capturas que vendan el "offline, sin cuenta", y reseñas. Hay scripts ASO en `scripts/aso/`.

Esta palanca puede superar al blog sin escribir una línea más.

### Palanca 4 · Publicidad display y afiliados (retorno bajo · no)

RPM en ocultismo: $3-8 por mil visitas. 24.000 visitas = $72-192/mes, y te destroza la conversión del pack. Los afiliados de apps competitivas pagan $1-3 por install. No es el camino.

---

## 5. Qué haría en las próximas dos semanas

| Orden | Acción | Por qué |
|---|---|---|
| 1 | Reconectar Search Console (2 comandos, arriba) | Sin esto sigues decidiendo a ciegas; es tu única fuente de verdad |
| 2 | Montar la membresía de $12/mes y ofrecerla en los 3 posts de goetia y en la comunidad | 2.715 personas ya están dentro; es dinero sin tráfico nuevo |
| 3 | Diseñar el curso de goetia a $97 como oferta principal del hub | El CPC de $11,15 dice que ahí hay comprador |
| 4 | Reordenar el funnel: app $3,99 como entrada, pack $29,99 como bump, curso $97 como destino | Hoy el techo es $29,99 y compites contigo mismo |
| 5 | ASO de las 3 apps con más margen (NOCTEM $14,99, Rider-Waite $9,99, Astral Lab $6,99) | Distribución gratis que ya tienes pagada |

---

## 6. Límites de este documento

- **Cero datos de Search Console.** No sé si rankeas, ni dónde, ni con qué CTR. Los modelos usan un 3% de captura de volumen, que es un supuesto, no una medición.
- **Los volúmenes del CSV están inflados por alias** y vienen en COP. El orden de magnitud sirve; el número exacto no.
- **Las conversiones (0,2%–2%) son estándar de nicho**, no tuyas.
- **El precio del curso ($97) es una hipótesis de posicionamiento**, no un test. Se valida con previa venta a la comunidad antes de grabarlo.
