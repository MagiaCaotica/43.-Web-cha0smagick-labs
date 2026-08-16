# Cola de Tweets Pendientes — Ronda 2 (guardados 12-ago-2026)

**Motivo**: se alcanzó el límite diario de tweets de X el 12-ago-2026.
**Cuándo publicar**: mañana (13-ago-2026), respetando el límite diario y las ventanas de engagement (7am / 1pm / 7pm EST).
**Método**: vía navegador Playwright (sesión @Cha0smagickLABS activa) — patrón validado:
`browser_run_code_unsafe` (filename o code) → `page.goto('https://x.com/compose/post')` → `page.locator('[data-testid="tweetTextarea_0"]').first()` → `keyboard.type(t, {delay:4})` → `page.locator('[data-testid="tweetButton"]').first().click()` → waits 2.5s/0.8s/3s. Lotes de 3 (5 dan timeout MCP). Rate limit X: delay 2.5-5s, máx 5 posts/30min.

## Tweets pendientes (5)

1. **Goetia fear-bait** → https://cha0smagicklabs.com/apps/arcana-goetia.html
"99% of 'demon' content online is fear-bait for engagement. The other 1% is actual scholarship. Guess which one I made an app about. 72 spirits. Seals. Enns. No candles required."

2. **Runes vs religion** → https://cha0smagicklabs.com/apps/norse-rune-oracle.html
"Christians crossed themselves for protection. Vikings carved runes. Guess which one is older — and which one still works. Algiz. Thurisaz. Othala. Learn what they actually mean."

3. **Dream Machine** → https://cha0smagicklabs.com/apps/dream-machine.html
"You dream 4-6 times a night. You remember 1% of it. Your subconscious talks to you constantly and you're ignoring it. Start journaling tonight."

4. **PSI GYM Zener** → https://cha0smagicklabs.com/apps/psi-gym.html
"Psychic ability is a muscle. Zener cards measure it. Most people score 20% (random). Trained people score 40-60%. You can't improve what you don't measure."

5. **PSI GYM cierre social proof** → https://cha0smagicklabs.com/apps/psi-gym.html
"128+ five-star reviews. 4.7 average. 11 apps, $3.99 each, one-time, no ads, no tracking. The occult collection the Play Store didn't want you to find."

## Estado de publicación 12-ago-2026 (para no duplicar)

**Ronda 1 (30/30 publicados)** — proyectos/docs/tweets-x-30-12ago2026.md
**Ronda 2 publicados (25/30 confirmados)**:
- Lote 1 (5 NOCTEM → /apps/noctem-tools.html) ✓
- Lote 2 (5 tarot/eerie: ex-tarot x2, church tarot, ex-spread blog, Clinton Road) ✓
- Lote 3 (2 astral: Sun sign mask + Moon sign → /apps/astral-lab.html) ✓
- Lote 3b (3: Astrology OFFLINE astral-lab, Dark tourism eerieroads, Every state road eerieroads) ✓
- Lote 4 (3 libros: Mind the Gap 0.3s, Servitors thought forms, Mainstream rune books → books/*-pdf.html) ✓
- Lote 5 (3: bundle $19.99 home, Unpopular opinion sigils, Applied 100 jobs → chaos-sigil-generator) ✓
- Lote 6 (1-3 goetia/runas: "People fear the 72 demons" CONFIRMADO a 42s; "99% demon content" y "Christians crossed" SIN CONFIRMAR — verificar en perfil antes de publicar desde la cola)
- Lote 7 (3: Full moon/new moon lunar-phase, Gut feeling I Ching, Nightmares lucid-dream) ✓

**No publicados (guardados en esta cola, 5)**: 99% demon content, Christians crossed runes, Dream 4-6 times, Psychic ability Zener, 128+ reviews. Si la verificación del perfil confirma que "99% demon content" o "Christians crossed" SÍ se publicaron en el lote 6, saltarlos de la cola.
