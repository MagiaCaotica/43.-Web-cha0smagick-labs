# Semillas para Keyword Planner

`docs/keywords-seeds.txt` — 117 términos, uno por línea, listos para pegar.

## Cómo cargarlos en Keyword Planner

1. **Discover new keywords** → pestaña **Start with keywords** (no "broad topics": los temas amplios te devuelven basura tipo "horoscope").
2. Pega el .txt entero. El planificador acepta hasta 1.000 ideas semilla.
3. **Ubicación:** corre dos veces, no una. `Estados Unidos` (el sitio está en inglés y los precios son USD) y `España + México + Colombia + Argentina` para el bloque en español.
4. **Idioma:** inglés en la primera pasada, español en la segunda. Mezclarlos te ensucia el volumen.
5. **Red:** solo Google. La casilla "Search partners" infla el volumen y no es tu tráfico.
6. Descarga el CSV y me lo pasas.

## Antes de mirar volumen: las tres preguntas

El planificador no te dirá si apuntas mal. Te lo dice el cruce con tu propio contenido:

1. **Cobertura.** ¿Cuántas de tus 949 entradas responden a términos con volumen real, y cuántas persiguen keywords que nadie busca? Eso sale de cruzar slugs de `blog/` con el CSV.
2. **Intención de compra.** Tus activos monetizables son 12 apps, 8 libros y 2 packs. Si el volumen está en "qué es la magia del caos" (gratis, informacional) y no en "sigil generator app" o "chaos magic books", tienes tráfico sin caja.
3. **Competencia.** En nicho oculto el volumen alto suele venir con competencia de YouTube y Reddit. CPC bajo + competencia baja en un término de app = oportunidad de Play Store, no de blog.

## Cómo leeré el CSV cuando llegue

Columnas que necesito (las que exporta el planificador, sin tocar):

- `Keyword`
- `Avg. monthly searches`
- `Competition`
- `Top of page bid (low range)` / `(high range)`
- `Three month change` / `YoY change` (si vienen, mejor)

Cruce que te devuelvo:

| Bloque | Qué responde |
|---|---|
| Keywords con artículo que las cubre | Dónde ya tienes autoridad y solo falta enlazar a app/libro |
| Keywords con volumen y sin artículo | Huecos de contenido, ordenados por volumen × intención comercial |
| Artículos sin keyword | Canibalización y esfuerzo desperdiciado (los 25 "chaos-magic-fundamentals-guide-N" son el primer sospechoso) |
| Keywords de app vs keywords de blog | Si el mercado que buscas está en Play Store y no en Google, y viceversa |
| Bloque ES | Qué está traducido y qué no, con volumen real para decidir si merece la pena |

## Lo que ya sé de tu web, sin el CSV

Del análisis de los 949 slugs de `blog/` y los 71 `tools/`:

- **El peso real está en magia del caos (148), goetia (122), ritual (105), sigilo (66), tarot (55).** Ahí tienes el mercado ganado o en disputa.
- **Lucid dreaming (35), astral (31), ESP/zener (18) y runas (19) son minoría** pero son las que sostienen 6 de tus 12 apps. Si el planificador dice que ese mercado no existe, el problema no es el contenido: son las apps.
- **Casi no hay slugs de compra** (`best * app`, `best * books` sí, pero son pocos). Ese es el hueco más caro.
- **El bloque ES tiene 41 URLs** frente a 949 en inglés. Cualquier keyword española con volumen decente es terreno vacío.

## Advertencia sobre el .txt

Los términos están en el orden de los clusters, no por prioridad. Y no he filtrado por volumen obvio: van también los que sospecho flojos (`paranormal equipment`, `book of shadows`) porque el planificador solo sirve si le preguntas lo que no sabes.

Nota: los términos salen de los títulos y slugs reales del repo, no de una lista genérica de ocultismo. Lo que no está aquí es porque no lo vi en la web.
