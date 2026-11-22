# Posicionamiento: Arcana Goetia como app ancla

**Fecha:** 2026-11-22
**Base:** directorio `D:\16-Apps` (solo lectura), auditoría web propia, Search Console 90 días, ficha pública de Play.

---

## 1. Decisión

La app ancla pasa a ser **Arcana Goetia (72 espíritus)**, no Sigil Maker.

Motivo: la intención de compra del nicho está en «invocar», «72 demonios», «sello de X», no en «hacer un sigilo».
Sigil Maker sigue siendo el **activo de confianza** (5,0 · 23 reseñas · 100+ instalaciones): se usa como prueba de que el estudio entrega, no como oferta principal.

Lo que se vende no es «una app que invoca demonios» —eso no es verificable— sino **el ritual completo en el bolsillo: el sello, el comando de invocación, la hora planetaria, el altar y el registro de cada operación**. Eso es exactamente lo que hay en el código y lo que declara Play.

---

## 2. Inventario de `D:\16-Apps`

Leído sin modificar. 22 carpetas, 12 con código Android.

| Carpeta | Package | App | ¿En el catálogo? |
|---|---|---|---|
| `Ghost_Detector_FINAL` | `com.cha0smagicklabs.noctemapp` | NOCTEM | Sí |
| `zenercards` | `com.cha0smagicklabs.zenercards` | PsiGym | Sí |
| `Norse_rune_oracle11` | `com.japps.norse_oracle` | VÖLVA (Viking Runes) | Sí |
| `Lunar_app_final` | `com.lunarapp.app` | Luna Harmony (Moon) | Sí |
| `Ichingoracle` | `com.app.ichingoracle` | I Ching | Sí |
| `DReammachine` | `com.cha0smagick.dreammachine` | Dream Machine | Sí |
| `astralchart` | `com.cha0smagicklabs.astralchart` | Astral Lab | Sí |
| `EerieRoads` | `com.cha0smagicklabs.eerieroads` | Eerie Roads | Sí |
| `luciddreamer` | `com.cha0smagicklabs.luciddreamer` | Lucid Dream | Sí |
| `ArcheoKit` | `com.cha0smagicklabs.archeokit` | ArcheoKit | **No** (producto nuevo) |
| `omnidice` | `com.cha0smagicklabs.omnidice` | OmniDice | **No** |
| `UFOToolkitUfoHuntingTools` | `com.cha0smagicklabs.ufotoolkit` | UFO Toolkit | **No** |
| `dlers-app` | Flutter, «Unlock your home's potential» | — | **No** (no es ocultismo) |

**Faltan en el directorio las tres apps del centro del catálogo:** Sigil Maker (`com.app.goetiansealgeneratorapp`), **Arcana Goetia** (`com.cha0smagick.sigilgeneratorfinal`) y Rider-Waite Tarot. Sin su código no se puede auditar su entrega; solo su ficha pública.

---

## 3. Promesa vs entrega (lo que sí se pudo verificar)

Comprobado sobre `AndroidManifest.xml`, dependencias de Gradle y llamadas de red en el código.

| App | Permisos de red/ubicación | Hallazgo | Veredicto |
|---|---|---|---|
| NOCTEM | Cámara, micro, almacenamiento. **Sin INTERNET** | Offline real | Promesa cumplida |
| PsiGym | Solo vibración | Sin red ni SDK | Cumplida |
| Viking Runes | Notificaciones, arranque | Sin red | Cumplida |
| I Ching | Notificaciones | Sin red | Cumplida |
| Dream Machine | Notificaciones, alarma | Sin red (usa WorkManager, no analítica) | Cumplida |
| Astral Lab | Notificaciones | Sin red | Cumplida |
| **Moon** | **INTERNET + ubicación** (`play-services-location`) | Fases calculadas en local; la ubicación se usa para salida/puesta | **«100% offline» era falso**: corregido en la web |
| **Lucid Dream** | **INTERNET + ubicación**; llama a `api.open-meteo.com` | El diario y el audio son locales; el clima es opcional y usa red | **Corregido**: «offline por defecto, clima opcional» |
| **Eerie Roads** | **INTERNET + ubicación**, osmdroid | Mapa por teselas: offline solo con zonas descargadas | **Corregido**: «funciona en modo avión con mapas descargados» |

**Riesgo detectado y ya mitigado:** el sitio afirmaba «no internet permission» y «100% offline» de forma global. Tres apps publicadas no lo cumplen. Eso alimenta reembolsos, reseñas de una estrella y desajustes con la declaración de Data Safety de Play.

**Verificado después en `D:\Aplicaciones Android`** (solo lectura):

| App | Package | Permisos | Qué hay realmente en el código |
|---|---|---|---|
| **Arcana Goetia** | `com.cha0smagick.sigilgeneratorfinal` | Ubicación aproximada, notificaciones, almacenamiento. **Sin INTERNET** | `entities.json` con **72 entidades**: nombre, rango, legiones, historia, `invocation_command`, `encryption_key`, planeta, elemento, dirección, metal, color, incienso, rango zodiacal y hora planetaria. Pantallas: Library, Summoning Motor, Guide, History, Suite. `SunCalculator` + `PlanetaryTime` calculan la hora desde tu ubicación; `RitualRecord` (Room) guarda cada operación; recordatorio diario; audio y háptica. |
| **Sigil Maker** | `Magickal Seals Generator` | Notificaciones, almacenamiento, vibración. Sin INTERNET | `SealCanvas`, `SealPalette`, `SatorArepo`, `GamificationModule`, `SigilAudio`: generador de sellos con módulo de gamificación y cuadrado Sator. |
| **Tarot** | `Unoficcial Rider Waite` | Notificaciones, alarmas, vibración. Sin INTERNET | **IA en el dispositivo**: MiniLM `int8.tflite` de 23 MB + Gemini Nano opcional vía AICore, con fallback a un oráculo local. Lexicones en 7 idiomas. |

Conclusión: **el nuevo ancla está justificada por el producto**, no solo por la demanda. La app entrega protocolo, altar, cálculo de hora planetaria y registro de operaciones. Es más de lo que la web contaba.

---

## 4. Demanda real (Search Console, 90 días)

| Grupo | Consultas | Impresiones | Clics | Posición media |
|---|---|---|---|---|
| Sigilo (sigil, maker, generator) | 153 | 2.025 | 76 | 8-12 |
| **Goetia / demonio / invocar** | **82** | **613** | **9** | **8-59** |
| Espíritu | 27 | 125 | 0 | — |
| Ritual | 26 | 91 | 1 | — |

Señales concretas:
- `goetic magick` — posición 8,1, **0 clics** (snippet que no invita).
- `goetic` — posición 24,8, 46 impresiones, 0 clics.
- `goetia demons` — posición 58,9; `paimon goetia` — 31,7.
- **`/blog/72-goetia-demons-complete-list.html` está «Discovered – currently not indexed»**: 79 KB, 31 enlaces internos, en sitemap, y Google no la ha rastreado. La página que debería capturar el núcleo de la intención es invisible.

Lectura: el embudo goetia no falla por falta de producto ni de contenido, falla porque **el hub no existe para Google** y el sitio tiene 1.052 URLs de las que 343 no reciben ni una impresión (33 %). El presupuesto de rastreo se está gastando en páginas muertas.

---

## 5. Qué se ha cambiado ya

1. **Home**: hero y barra fija venden Arcana Goetia; el CTA secundario lleva al hub de los 72 (enlazado desde la página más rastreada del sitio). Sigil Maker queda como prueba («del estudio detrás de Sigil Maker, 5.0★»).
2. **Hub de los 72**: banda de conversión hacia la app, con la frase que separa leer de practicar.
3. **Claims de offline**: corregidos en Moon, Lucid Dream y Eerie Roads con lo que hace cada app.

---

## 6. Plan de 30 días (goetia)

| # | Acción | Métrica |
|---|---|---|
| 1 | Reducir el sitemap a las URLs vivas (sacar las 343 sin impresión, noindex o consolidar) para liberar rastreo | la página de los 72 pasa a «Indexada» |
| 2 | 10 páginas de espíritu con intención de compra (Paimon, Bael, Astaroth, Asmoday, Buer, Sitri, Vassago, Marbas, Amon, Valefor): sello, oficio, correspondencias, protocolo y CTA a la app | 10 páginas indexadas, 100 clics/mes |
| 3 | Reescribir títulos de las 5 consultas goetias en posición 5-15 | CTR ≥ 4 % en el clúster |
| 4 | Lead magnet «Protocolo de primera invocación (7 días)» en PDF, captado en el hub y en la guía | 100 suscriptores |
| 5 | Pedir reseña a compradores de la app (hoy 0 reseñas con 50+ instalaciones) | 5 reseñas |
| 6 | Página de la app: capturas del altar y del protocolo, no solo del sello | clic de compra por sesión ≥ 4 % |

## 7. Retención

La app es pago único: retener significa **volver a usarla**. Tres palancas:
- Protocolo de 7 días que obliga a abrir la app una vez al día (email + PDF).
- Diario de operaciones (si la app guarda historial, exponerlo en la portada de la app; si no, es la siguiente función a construir).
- Reseña y comunidad: pedir la opinión en el día 3 del protocolo, no al comprar.

## 8. Riesgos

- **Sobreventa**: «command the 72 spirits» puede leerse como resultado garantizado. La web ya usa «protocolo», «sello» y «altar»; mantener ese vocabulario y evitar promesas de resultado.
- **Público vulnerable**: mantener el descargo de la página del hub (contenido histórico, no instrucción) y no usar urgencia falsa.
- **Data Safety de Play**: las declaraciones de Moon, Lucid Dream y Eerie Roads deben coincidir con los permisos reales; si no, la ficha puede ser retirada.
- **Dependencia de una sola app**: si Goetia no sube de 50 instalaciones en 60 días, el problema es distribución, no producto; no cambiar de ancla otra vez.
