# Cha0smagick Labs — Links de Google Play y de compra de libros

Extraído de `apps/`, `books/` y `landing-pages/` del repo. Los links van sin parámetros `utm_*` para que sirvan en cualquier sitio.

## Google Play

Página de desarrollador: https://play.google.com/store/apps/dev?id=5224914033326414083

| App | Precio | Link |
|---|---|---|
| Chaos Sigil Generator (Chaos Arcane Sigil Forge) | $3.99 | https://play.google.com/store/apps/details?id=com.app.goetiansealsgeneratorapp |
| PSI GYM: Zener Cards & ESP | $2.99 | https://play.google.com/store/apps/details?id=com.cha0smagicklabs.zenercards |
| Arcana Goetia: Ritual & Sigils | $3.99 | https://play.google.com/store/apps/details?id=com.cha0smagick.sigilgeneratorfinal |
| Norse Rune Oracle | $3.99 | https://play.google.com/store/apps/details?id=com.japps.norse_oracle |
| Dream Machine: Lucid Dreaming | $3.99 | https://play.google.com/store/apps/details?id=com.cha0smagick.dreammachine |
| Astral Lab: Natal Chart & Astrology | $6.99 | https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart |
| Eerie Roads: Haunted Map | $9.99 | https://play.google.com/store/apps/details?id=com.cha0smagicklabs.eerieroads |
| I Ching Oracle | $3.99 | https://play.google.com/store/apps/details?id=com.app.ichingoracle |
| Lucid Dream: Astral Projection | $8.99 | https://play.google.com/store/apps/details?id=com.cha0smagicklabs.luciddreamer |
| Lunar Phase Calculator | $3.99 | https://play.google.com/store/apps/details?id=com.lunarapp.app |
| NOCTEM: Paranormal Investigation Suite | $14.99 | https://play.google.com/store/apps/details?id=com.cha0smagicklabs.noctemapp |
| Rider-Waite Tarot Complete | $9.99 | https://play.google.com/store/apps/details?id=com.cha0smagick.unofficialraiderwaite |

Nota: el bundle de 12 apps se gestiona dentro de Google Play; no existe link de checkout propio en el repo.

## Libros (Hotmart)

### Los 8 títulos actuales

| Libro | Precio | Link de compra |
|---|---|---|
| TECHNOMANCY | $9.99 | https://pay.hotmart.com/V108625258J |
| Chaos Magick for Absolute Beginners | $9.99 | https://pay.hotmart.com/T108463145B |
| The Complete Practical Treatise on Magical Servitors | $9.99 | https://pay.hotmart.com/U108075109V |
| Catholiconomicon (edición bilingüe EN/ES) | $9.99 | https://hotmart.com/en/marketplace/products/catholiconomicon-a-rimbonic-grimoire-of-the-universal-law-bilingual-en-es-edition/A107900946S |
| Codex Chaoticus | $4.99 | https://pay.hotmart.com/W106595764X |
| Tarot Chaos | $9.99 | https://hotmart.com/en/marketplace/products/the-chaos-tarot/J106598345U |
| Liber Lvpinux | $3.99 | https://pay.hotmart.com/O104271155J |
| Mind The Gap | $9.99 | https://hotmart.com/en/marketplace/products/mind-the-gap-the-0-3-seconds-that-control-your-life/V106730857R |

TECHNOMANCY, Chaos Magick for Absolute Beginners, Servitors y Catholiconomicon usan el mismo checkout para su edición en español (son bilingües o comparten producto).

### Packs

| Pack | Precio | Link |
|---|---|---|
| Bundle 8 libros (inglés) | $29.99 | https://pay.hotmart.com/N108147778I |
| Pack 10 libros (español) | $29.99 | https://pay.hotmart.com/V107097103W |

### Títulos descatalogados (solo para quien ya los compró)

| Libro | Link |
|---|---|
| Manual de Activación de Servidores Mágicos | https://pay.hotmart.com/U108075109V |
| Treatise of Chaos Hunter Runes | https://pay.hotmart.com/N108147778I |
| Ouija Cazadora | https://pay.hotmart.com/N108147778I |

Los dos últimos no tienen checkout propio: su página apunta al bundle inglés.

## Ruta interna en el sitio

- Apps: `apps/index.html` y una ficha por app en `apps/*.html`
- Libros: `books/index.html` y una ficha por libro en `books/*-pdf.html`
- Packs: `landing-pages/books-bundle.html` (EN) y `landing-pages/books-bundle-en.html` (EN)
