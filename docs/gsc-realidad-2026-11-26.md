# Search Console, primera lectura real

Fecha: 26 nov 2026 · Propiedad: `sc-domain:cha0smagicklabs.com` · Ventanas: 30 días (26 oct – 25 nov) y 116 días (1 ago – 25 nov).

---

## 1. Los números

| Métrica | Últimos 30 días | Media de 4 meses |
|---|---|---|
| Clics | **378** | 246/mes |
| Impresiones | **21.774** | 9.939/mes |
| CTR | 1,74% | 2,48% |
| Posición media | ~21 | ~22 |

**Crecimiento real:** primeros 30 días del periodo → 107 clics y 3.643 impresiones. Últimos 30 → 374 clics y 19.836 impresiones. **Impresiones ×5,4 en cuatro meses.** El sitio está despegando, no estancado.

Pero el punto de partida es minúsculo: 21.774 impresiones/mes frente a los 2,38M de búsquedas/mes que declara el CSV. **Estás visible en el 0,9% del mercado que te asignaste.**

---

## 2. Quién trae el tráfico (30 días)

| Página | Clics | Impr. | CTR | Pos. |
|---|---|---|---|---|
| `chaos-magick-beginners-complete-guide` | 70 | 1.249 | 5,6% | 8,9 |
| `goetic-magic-beginners-guide` | 34 | 1.175 | 2,9% | 6,6 |
| `tools/sigil-generator` | 25 | 412 | 6,1% | 15,6 |
| `ghost-hunting-apps-comparison-android` | 18 | 678 | 2,6% | 11,3 |
| `/` (home) | 12 | 85 | 14,1% | 5,5 |
| `tools/digital-pendulum` | 11 | 161 | 6,8% | 12,0 |
| `tools/` | 10 | 126 | 7,9% | 8,7 |
| `how-to-charge-sigil-correctly` | 8 | 211 | 3,8% | 6,2 |
| `how-to-create-magickal-servitor` | 8 | 125 | 6,4% | 12,1 |
| `spirit-box-frequency-settings` | 8 | 476 | **1,7%** | 5,9 |
| `iching-changing-lines-guide` | 7 | 286 | 2,5% | 20,7 |
| `the-72-goetia-spirits-complete-ranked-list` | 7 | 418 | **1,7%** | 9,4 |

Dos páginas sostienen el 28% de los clics del sitio. El resto es cola larga.

---

## 3. El hallazgo incómodo: ranking alto, CTR roto

Hay páginas en **posición 5-11 con CTR de 1,7%**. Eso no es normal: en posición 6 el CTR esperado es 4-6%.

| Página | Pos. | CTR | CTR esperado | Clics que faltan |
|---|---|---|---|---|
| `spirit-box-frequency-settings` | 5,9 | 1,7% | 6% | **+18** |
| `the-72-goetia-spirits-complete-ranked-list` | 9,4 | 1,7% | 4% | **+10** |
| `goetic-magic-beginners-guide` | 6,6 | 2,9% | 6% | **+31** |
| `ghost-hunting-apps-comparison-android` | 11,3 | 2,6% | 2% | 0 (posición baja) |
| `how-to-charge-sigil-correctly` | 6,2 | 3,8% | 6% | +4 |

Los títulos ya están bien escritos y coinciden con la consulta (`Best Sweep Rate for a Spirit Box: 200 ms Slices (2026)`). Con posición 6 y título correcto, un CTR de 1,7% apunta a que **Google está respondiendo la consulta arriba** (fragmento destacado o AI Overview) y el usuario no llega a hacer clic. Es una hipótesis: no lo he verificado en la SERP.

**Total recuperable con esta tabla: +63 clics/mes, un 17% más de tráfico sin escribir nada.** No cambia la vida, pero es gratis.

---

## 4. Canibalización: dos peleas internas que cuestan dinero

### Astrología (la más caras de todas)

| Consulta | Página | Impr. | Pos. |
|---|---|---|---|
| best astrology app | `blog/astrology-apps-android-guide` | 76 | **82** |
| best astrology app | `astrology-apps-compared.html` | 50 | **79** |
| astrology apps | `blog/astrology-apps-android-guide` | 40 | **88** |
| astrology apps | `astrology-apps-compared.html` | 36 | **93** |

Dos páginas compitiendo por lo mismo, las dos en posición 80. **855 impresiones/mes tiradas a la basura.** Tienes la app (`Astral Lab`, $6,99) y el CPC de `best astrology app` es $6,94: hay comprador. Google no sabe cuál de tus dos páginas es la buena, así que no muestra ninguna.

### Goetia (y aquí me equivoqué)

Cuatro páginas sobre lo mismo. La que **sí** rankea:

- `goetic-magic-beginners-guide` — 1.175 impr, posición 6,6, 34 clics.
- `the-72-goetia-spirits-complete-ranked-list` — 418 impr, posición 9,4, 7 clics.
- `the-72-spirits-of-goetia-...` — posición 30-55.

Y `blog/72-goetia-demons-complete-list.html` — **184 enlaces internos, cero impresiones en 30 días.** Google la considera duplicada de las otras y no la muestra nunca.

**Corrección honesta: el trabajo de la fase 1 (CTA, title, description) fue a esa página invisible.** El CTA está bien escrito pero en un folio que nadie lee. Las páginas con tráfico (`goetic-magic-beginners-guide`, `the-72-goetia-spirits-complete-ranked-list`) ya tenían Play y Hotmart desde antes. No rompí nada, pero el retorno de esa fase fue cero.

---

## 5. Cuánto dinero hay hoy en el SEO

378 clics/mes. Con el techo de tu catálogo:

| Supuesto | Ingreso/mes |
|---|---|
| 2% a pack $29,99 | **$227** |
| 0,3% a curso $97 | $110 |
| Ambos mezclados | $200-350 |

Y arreglando el CTR (+63 clics): **$265**. Es decir, todo el potencial inmediato del SEO son decenas de dólares, no miles.

Para llegar a **$5.000/mes por SEO** necesitas ~25.000 clics/mes, o sea **18 veces** el tráfico actual. A tu ritmo de crecimiento (×5,4 cada 4 meses) eso es alcanzable en 8-12 meses **si el ritmo se mantiene**, y no se mantiene solo.

---

## 6. Dónde está el dinero que sí existe

| Fuente | Tamaño ahora | Techo realista | Depende de |
|---|---|---|---|
| **Play Store (ASO)** | 0 organizado | $1.000-3.000/mes | títulos, capturas, reseñas de 12 apps |
| **Comunidad (2.715)** | $0 | $900-1.500/mes | membresía $12/mes al 3% |
| **Curso $97** | $0 | $1.500-3.000/mes | preventa a la comunidad |
| **SEO** | $200-350/mes | $1.000/mes en 6 meses | CTR + consolidar astrología |

Los tres primeros no dependen de Google. El cuarto es el que crece solo, y por eso no se abandona: se mantiene con el arreglo de CTR y la consolidación, sin invertir más contenido.

---

## 7. Qué hacer, en orden

| # | Acción | Ganancia esperada |
|---|---|---|
| 1 | **Consolidar astrología**: una sola página para `best astrology app`, la otra redirige 301. Reescribir la que quede para la consulta exacta. | 855 impr/mes dejan de estar en posición 80 |
| 2 | **Consolidar goetia**: el hub es `goetic-magic-beginners-guide` (ya rankea 6,6). `72-goetia-demons-complete-list` pasa a enlazar hacia él o se fusiona. | un solo destino para la keyword de $11,15 CPC |
| 3 | **CTR**: reescribir title/meta de las 3 páginas con posición 5-11 y CTR <3%, con el número en el título | +40-60 clics/mes |
| 4 | **ASO de 3 apps** (NOCTEM, Rider-Waite, Astral Lab) | el único canal sin techo de Google |
| 5 | **Membresía $12** a la comunidad existente | ingreso recurrente sin tráfico |

---

## 8. Límites

- Search Console da clics e impresiones, no ingresos. Las conversiones de la sección 5 son supuestos de nicho.
- Los "clics que faltan" usan una curva de CTR por posición estándar; tu SERP real puede tener fragmentos que se lleven el clic.
- No verifiqué si hay AI Overview en esas consultas. Si lo hay, el CTR no se arregla con títulos: se arregla yendo a intenciones transaccionales.
- La posición media (~21) es un promedio que mezcla página 1 y página 5. No describe ninguna página concreta.
