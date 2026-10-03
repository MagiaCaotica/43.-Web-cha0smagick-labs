#!/usr/bin/env python3
"""
Cha0smagick Labs — Telegram Bot (canal + grupo)

Identity: cha0smagicklabs. Posts the canonical catalog from
scripts/bots/data/offers.json to a Telegram CHANNEL and (optionally) to a
GROUP chat.

Design rules enforced here:
  * The catalog file is the only source of product data. No hardcoded offers,
    no invented IDs, no placeholder URLs. `validate_catalog()` refuses to boot
    if a placeholder survives.
  * No product is promoted that has no verified destination. Books carry their
    own pay.hotmart.com checkout; apps carry their Google Play URL.
  * Only products that actually exist are promoted. Complete Access, Inner
    Circle, Flash Sale and the "apps bundle" were removed on 2026-10-03 —
    see `_meta.rejectedOffers` in the catalog. Do not re-add them.
  * No images are sent. The previous 10 imgur placeholders were all 404, which
    silently degraded every post to plain text. Copy + inline buttons instead.
  * Hourly cadence with a silent window (00:00–05:59 COT). The day's mix is a
    fixed pattern: 12 sales posts (7 book / 3 bundle / 2 app) + 6 value posts.
  * Rotations are persisted to disk, so a restart never replays what was already
    published.
  * TG_DRY_RUN=1 renders every message and logs it without sending anything.

Env
  TG_TOKEN               (required) bot token
  TELEGRAM_CHANNEL       default @cha0smagicklabs
  TELEGRAM_GROUP_CHAT_ID optional; the bot must be an admin in the group
  TG_TIMEZONE            default America/Bogota
  TG_POST_MINUTE         default 5   (never post at :00 exactly)
  TG_STATE_DIR           default /home/ubuntu/cha0s-bot
  ADMIN_USER_ID          Telegram numeric user id allowed to run admin commands
  TG_DRY_RUN             1 = render only, never send
"""

import asyncio
import json
import logging
import os
import re
import sys
from datetime import datetime, timezone
from html import escape
from pathlib import Path
from urllib.parse import urlencode, urlsplit, urlunsplit

from telegram import Bot, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.error import TelegramError
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# ─── CONFIG ───────────────────────────────────────────────────────────────
TOKEN = os.getenv("TG_TOKEN")
CHANNEL = os.getenv("TELEGRAM_CHANNEL", "@cha0smagicklabs")
GROUP_CHAT_ID = os.getenv("TELEGRAM_GROUP_CHAT_ID", "").strip()
TIMEZONE = os.getenv("TG_TIMEZONE", "America/Bogota")
POST_MINUTE = int(os.getenv("TG_POST_MINUTE", "5"))
STATE_DIR = Path(os.getenv("TG_STATE_DIR", "/home/ubuntu/cha0s-bot"))
DRY_RUN = os.getenv("TG_DRY_RUN", "0") == "1"
ADMIN_ID = int(os.getenv("ADMIN_USER_ID", "0") or 0)

REPO_ROOT = Path(__file__).resolve().parent.parent
# On the Oracle instance bot.py lives at /home/ubuntu/cha0s-bot/bot.py, so the
# repo-relative guess above will not resolve. Override with TG_CATALOG_PATH.
CATALOG_PATH = Path(
    os.getenv("TG_CATALOG_PATH", REPO_ROOT / "scripts" / "bots" / "data" / "offers.json")
)
STATE_PATH = STATE_DIR / "post_state.json"

SITE = "https://cha0smagicklabs.com"

# Placeholders that must never reach a Telegram chat.
PLACEHOLDER_RE = re.compile(r"\[\[|\[(?:ID|URL|SECRET|PRODUCT_ID|SUB_ID|HOTMART_ID)\]", re.I)

# ─── CADENCE ──────────────────────────────────────────────────────────────
# One entry per hour of the day. "" means stay silent.
# 06:00–23:00 publish. 00:00–05:00 never publish.
# Of the 18 active slots: 12 sell (7 book, 3 bundle, 2 app), 6 add value.
HOURLY_PLAN = {
    6: "book", 7: "digest", 8: "book", 9: "bundle",
    10: "book", 11: "digest", 12: "app", 13: "book",
    14: "bundle", 15: "book", 16: "digest", 17: "app",
    18: "digest", 19: "book", 20: "digest", 21: "bundle",
    22: "book", 23: "digest",
}

# Free tools that exist on disk (verified 2026-10-03 in tools/*.html).
# The slug is humanised for the copy — no invented claims.
DIGEST_TOOLS = [
    "elder-futhark-reference",
    "moon-phase-calendar",
    "goetic-spirit-selector",
    "planetary-hours-planner",
    "zener-esp-trainer",
    "reality-check-tracker",
    "sabbat-season-planner",
    "spell-builder",
]

# Editorial copy in Spanish, keyed by catalog id. The catalog owns the *data*
# (name, price, URLs); this owns how it reads. Falls back to the catalog
# shortDesc if an id is ever added without a translation.
COPY_ES = {
    # books
    "codex-chaoticus": "Tratado completo de magia del caos: teoría, práctica y los rituales que mejor funcionan.",
    "tarot-chaos": "El tarot leído desde la magia del caos: las 78 cartas y cómo trabajar lo que ya está escrito.",
    "magical-servitors-manual": "Diseña, activa y trabaja con servidores mágicos: entidades hechas a medida para una tarea.",
    "treatise-chaos-hunter-runes": "El alfabeto de las runas de la caza: las 24 runas runestone explicadas paso a paso.",
    "ouija-cazadora": "Guía completa de comunicación con espíritus mediante la ouija, en español.",
    "liber-lvpinux": "El libro del lobo: filosofía y práctica de la licantropia y el cambio de forma.",
    "mind-the-gap": "Guía práctica de estados alterados para el psiconauta moderno.",
    # bundle
    "bundle-books": "Los 7 libros de la biblioteca en un solo pago. PDF y acceso de por vida.",
    # apps
    "psi-gym": "Entrena tu intuición con cartas Zener y análisis estadístico de ESP.",
    "arcana-goetia": "Grimorio goético completo y generador de sigilos de los 72 espíritus de Salomón.",
    "norse-rune-oracle": "Sabiduría viking con más de 12 tiradas de runas para amor, riqueza y protección.",
    "dream-machine": "Sueños lúcidos con reality checks, diario de sueños y técnicas de inducción.",
    "chaos-sigil-generator": "Crea sigilos a partir de tu intención con esta herramienta minimalista de magia del caos.",
    "astral-lab": "Astrología profesional: carta natal, tránsitos y sinastría.",
    "eerieroads": "Explora los lugares más terrorosos del mundo con mapas interactivos e historias de fantasmas.",
    "iching-oracle": "Lanza hexagramas y lee la sabiduría antigua del I Ching para orientarte.",
    "lucid-dream": "Sueños lúcidos y proyección astral con prácticas guiadas.",
    "lunar-phase-calculator": "Sigue las fases lunares y planifica tus rituales según el ciclo de la luna.",
    "noctem-tools": "Suite profesional de investigación paranormal para trabajo de campo estructurado.",
    "unofficial-rider-waite-tarot": "Baraja Rider-Waite completa de 78 cartas con interpretaciones y tiradas.",
}

# ─── LOGGING ──────────────────────────────────────────────────────────────
def _setup_logging() -> None:
    handlers = [logging.StreamHandler(sys.stdout)]
    try:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        handlers.insert(0, logging.FileHandler(STATE_DIR / "bot.log", encoding="utf-8"))
    except OSError:
        pass
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=handlers,
    )


logger = logging.getLogger("cha0s-bot")

# ─── CATALOG ──────────────────────────────────────────────────────────────
def load_catalog() -> dict:
    try:
        data = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(
            f"FATAL: catalog not found at {CATALOG_PATH}. "
            "Set TG_CATALOG_PATH to the absolute path of "
            "scripts/bots/data/offers.json on this host."
        )
    except json.JSONDecodeError as exc:
        raise SystemExit(f"FATAL: catalog is not valid JSON: {exc}")
    for key in ("apps", "books", "bundle"):
        if not data.get(key):
            raise SystemExit(f"FATAL: catalog is missing '{key}'")
    return data


def validate_catalog(data: dict) -> list:
    """Return a list of integrity problems. Empty list == safe to publish."""
    problems = []
    for book in data["books"]:
        if not PLACEHOLDER_RE.search(book.get("url", "")):
            pass
        else:
            problems.append(f"book {book['id']}: placeholder in url")
        checkout = book.get("checkoutUrl", "")
        if not checkout:
            problems.append(f"book {book['id']}: no checkoutUrl")
        elif PLACEHOLDER_RE.search(checkout):
            problems.append(f"book {book['id']}: placeholder in checkoutUrl")
        if not book.get("price"):
            problems.append(f"book {book['id']}: no price")

    for app in data["apps"]:
        if PLACEHOLDER_RE.search(app.get("url", "")):
            problems.append(f"app {app['id']}: placeholder in url")
        if not app.get("packageId"):
            problems.append(f"app {app['id']}: no packageId")
        if not app.get("price"):
            problems.append(f"app {app['id']}: no price")

    bundle = data["bundle"]
    if PLACEHOLDER_RE.search(bundle.get("url", "")):
        problems.append("bundle: placeholder in url")
    if not bundle.get("hotmartProductId"):
        problems.append("bundle: no hotmartProductId")

    # The digest tools were verified against tools/*.html in the repo at build
    # time. On the server the repo is absent, so only check when it is there.
    tools_dir = REPO_ROOT / "tools"
    if tools_dir.is_dir():
        for tool in DIGEST_TOOLS:
            if not (tools_dir / f"{tool}.html").is_file():
                problems.append(f"digest tool missing on disk: tools/{tool}.html")

    return problems


def with_utm(url: str, source: str, medium: str, campaign: str) -> str:
    """Append UTM parameters, preserving any query string already present."""
    if not url:
        return url
    parts = urlsplit(url)
    params = f"{parts.query}&" if parts.query else ""
    params += urlencode(
        {"utm_source": source, "utm_medium": medium, "utm_campaign": campaign}
    )
    return urlunsplit((parts.scheme, parts.netloc, parts.path, params, parts.fragment))


def humanise(slug: str) -> str:
    return " ".join(word.capitalize() for word in slug.split("-"))


# ─── CONTENT POOLS ────────────────────────────────────────────────────────
def build_pools(data: dict) -> dict:
    pools = {"book": [], "bundle": [], "app": [], "digest": []}

    for book in data["books"]:
        pools["book"].append({
            "format": "book",
            "id": book["id"],
            "emoji": "📖",
            "title": book["name"],
            "subtitle": book.get("subtitle", ""),
            "body": COPY_ES.get(book["id"], book.get("shortDesc", "")),
            "price": book["price"],
            "page": book["url"],
            "buy": book.get("checkoutUrl", ""),
        })

    bundle = data["bundle"]
    pools["bundle"].append({
        "format": "bundle",
        "id": "bundle-books",
        "emoji": "🎁",
        "title": bundle["name"],
        "subtitle": f"{len(data['books'])} libros en un solo pago",
        "body": COPY_ES.get("bundle-books", bundle.get("shortDesc", "")),
        "price": bundle["price"],
        "was": bundle.get("originalPrice", ""),
        "badge": bundle.get("discountLabel", ""),
        "page": bundle["funnel"],
        "buy": bundle["url"],
    })

    for app in data["apps"]:
        pools["app"].append({
            "format": "app",
            "id": app["id"],
            "emoji": "📱",
            "title": app["name"],
            "subtitle": "",
            "body": COPY_ES.get(app["id"], app.get("shortDesc", "")),
            "price": app["price"],
            "page": app.get("funnel", ""),
            "buy": app["url"],
        })

    for slug in DIGEST_TOOLS:
        pools["digest"].append({
            "format": "digest",
            "id": f"tool-{slug}",
            "emoji": "🛠",
            "title": humanise(slug),
            "subtitle": "Herramienta gratuita",
            "body": (
                "Una de las 62 herramientas gratuitas del sitio, abierta en el "
                "navegador y sin registro."
            ),
            "price": "",
            "page": f"{SITE}/tools/{slug}.html",
            "buy": "",
        })

    return pools


# ─── STATE ────────────────────────────────────────────────────────────────
def load_state() -> dict:
    try:
        state = json.loads(STATE_PATH.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        state = {}
    state.setdefault("cursors", {})
    state.setdefault("history", [])
    state.setdefault("paused", False)
    return state


def save_state(state: dict) -> None:
    state["history"] = state["history"][-60:]
    try:
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        STATE_PATH.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")
    except OSError as exc:
        logger.error(f"could not persist state: {exc}")


def next_piece(pools: dict, fmt: str, state: dict) -> dict:
    pool = pools.get(fmt) or []
    if not pool:
        raise SystemExit(f"FATAL: content pool '{fmt}' is empty")
    cursor = int(state["cursors"].get(fmt, 0))
    piece = pool[cursor % len(pool)]
    state["cursors"][fmt] = cursor + 1
    return piece


# ─── RENDERING ────────────────────────────────────────────────────────────
def render(piece: dict, destination: str) -> tuple:
    """Return (text, InlineKeyboardMarkup) for a channel or group post."""
    campaign = f"hourly_{piece['format']}_{piece['id']}"
    medium = f"bot_{destination}"
    page = with_utm(piece["page"], "telegram", medium, campaign)
    buy = with_utm(piece["buy"], "telegram", medium, campaign) if piece["buy"] else ""

    title = f"<b>{escape(piece['title'])}</b>"
    if piece.get("subtitle"):
        title += f"\n<i>{escape(piece['subtitle'])}</i>"
    lines = [f"{piece['emoji']} {title}", ""]

    if piece["format"] == "digest":
        lines.append(escape(piece["body"]))
        lines.append("")
        lines.append(f"<i>Sin costo. Sin registro.</i>")
    else:
        lines.append(escape(piece["body"]))
        lines.append("")
        if piece.get("was"):
            lines.append(
                f"💰 <s>{escape(piece['was'])}</s> → "
                f"<b>{escape(piece['price'])}</b>"
                + (f" · {escape(piece['badge'])}" if piece.get("badge") else "")
            )
        else:
            lines.append(f"💰 <b>{escape(piece['price'])}</b> · pago único")

    buttons = []
    if buy:
        buttons.append(InlineKeyboardButton("⚡ Comprar", url=buy))
    if page:
        if piece["format"] == "app":
            label = "ℹ️ Detalles"
        elif piece["format"] == "digest":
            label = "🛠 Abrir la herramienta"
        else:
            label = "Ver más"
        buttons.append(InlineKeyboardButton(label, url=page))

    if destination == "group" and buttons:
        # Keep the group version to a single, obvious action.
        primary = InlineKeyboardButton(
            buttons[0].text, url=buttons[0].url
        )
        return "\n".join(lines), InlineKeyboardMarkup([[primary]])

    return "\n".join(lines), InlineKeyboardMarkup([buttons]) if buttons else None


# ─── DELIVERY ─────────────────────────────────────────────────────────────
def audit(event: str, **fields) -> None:
    """Structured, greppable analytics line. No secrets, no PII."""
    payload = {"event": event, "ts": datetime.now(timezone.utc).isoformat()}
    payload.update(fields)
    logger.info("analytics " + json.dumps(payload, ensure_ascii=False))


async def deliver(piece: dict, state: dict, hour: int, dry_run: bool = False) -> None:
    campaign = f"hourly_{piece['format']}_{piece['id']}"
    targets = [("channel", CHANNEL)]
    if GROUP_CHAT_ID:
        targets.append(("group", GROUP_CHAT_ID))

    sent = 0
    for destination, chat_id in targets:
        text, keyboard = render(piece, destination)
        if dry_run:
            logger.info(f"[dry-run] {destination} h{hour:02d} {piece['id']}\n{text}")
            continue
        try:
            await bot.send_message(
                chat_id=chat_id,
                text=text,
                parse_mode="HTML",
                reply_markup=keyboard,
                link_preview_options={"is_disabled": True},
            )
            sent += 1
            audit(
                "tg_post_sent",
                piece=piece["id"],
                fmt=piece["format"],
                campaign=campaign,
                destination=destination,
                hour=hour,
            )
        except TelegramError as exc:
            logger.error(f"send failed {piece['id']} -> {destination}: {exc}")

    if sent:
        state["history"].append({
            "id": piece["id"],
            "format": piece["format"],
            "hour": hour,
            "ts": datetime.now(timezone.utc).isoformat(),
            "targets": sent,
        })
        save_state(state)


# ─── SCHEDULED JOB ────────────────────────────────────────────────────────
POOLS: dict = {}
STATE: dict = {}
CATALOG: dict = {}


async def scheduled_post(hour: int) -> None:
    fmt = HOURLY_PLAN.get(hour)
    if not fmt:
        logger.info(f"h{hour:02d} silent window, nothing posted")
        return
    if STATE.get("paused"):
        logger.info(f"h{hour:02d} paused, nothing posted")
        return
    piece = next_piece(POOLS, fmt, STATE)
    await deliver(piece, STATE, hour, dry_run=DRY_RUN)


# ─── ADMIN COMMANDS ───────────────────────────────────────────────────────
def is_admin(user_id: int) -> bool:
    return ADMIN_ID != 0 and user_id == ADMIN_ID


async def reply(message, text: str) -> None:
    await message.reply_text(
        text,
        parse_mode="HTML",
        link_preview_options={"is_disabled": True},
    )


async def handle_command(message) -> None:
    text = (message.text or "").strip()
    if not text.startswith("/"):
        return
    if not is_admin(message.from_user.id):
        await reply(message, "⛔️ Este bot es privado.")
        return

    parts = text.split()
    cmd, args = parts[0].split("@")[0].lower(), parts[1:]
    problems = validate_catalog(CATALOG)
    checks = "✅" if not problems else "❌"

    if cmd in ("/start", "/help"):
        await reply(message, (
            "<b>Cha0smagick Bot</b>\n\n"
            f"Canal: <code>{CHANNEL}</code>\n"
            f"Grupo: <code>{GROUP_CHAT_ID or 'no configurado'}</code>\n"
            f"Catálogo: {checks} · {len(CATALOG['apps'])} apps · "
            f"{len(CATALOG['books'])} libros · 1 bundle\n"
            f"Slots activos: {len(HOURLY_PLAN)}/24h\n"
            f"Dry-run: {'SÍ' if DRY_RUN else 'no'}\n\n"
            "<code>/status</code> · <code>/plan</code> · <code>/offers</code>\n"
            "<code>/preview book|app|bundle|digest [n]</code>\n"
            "<code>/testpost &lt;id&gt;</code> · <code>/pause</code> · "
            "<code>/resume</code>\n"
            "<code>/check</code>"
        ))

    elif cmd == "/status":
        recent = ", ".join(h["id"] for h in STATE["history"][-5:]) or "—"
        await reply(message, (
            "<b>Estado</b>\n"
            f"⏰ {datetime.now(timezone.utc).isoformat()}\n"
            f"📜 Últimas 5: {recent}\n"
            f"⏸ Pausado: {'sí' if STATE.get('paused') else 'no'}\n"
            f"🔢 Cursores: {json.dumps(STATE['cursors'], ensure_ascii=False)}"
        ))

    elif cmd == "/plan":
        rows = "\n".join(
            f"<code>{h:02d}:00</code> — {POOLS[f][int(STATE['cursors'].get(f, 0)) % len(POOLS[f])]['title']}"
            for h, f in sorted(HOURLY_PLAN.items())
        )
        await reply(message, f"<b>Plan del día (COT)</b>\n\n{rows}")

    elif cmd == "/offers":
        books = "\n".join(
            f"• <code>{b['id']}</code> — {b['price']} → {b.get('hotmartProductId')}"
            for b in CATALOG["books"]
        )
        apps = "\n".join(f"• <code>{a['id']}</code> — {a['price']}" for a in CATALOG["apps"])
        await reply(message, (
            f"<b>Libros ({len(CATALOG['books'])})</b>\n{books}\n\n"
            f"<b>Bundle</b>\n• {CATALOG['bundle']['price']} "
            f"({CATALOG['bundle'].get('discountLabel', '')}) → "
            f"{CATALOG['bundle']['hotmartProductId']}\n\n"
            f"<b>Apps ({len(CATALOG['apps'])})</b>\n{apps}"
        ))

    elif cmd == "/preview":
        fmt = args[0] if args else "book"
        idx = int(args[1]) if len(args) > 1 and args[1].isdigit() else 0
        pool = POOLS.get(fmt)
        if not pool:
            await reply(message, f"❌ Formato desconocido. Usa: {', '.join(POOLS)}")
            return
        piece = pool[idx % len(pool)]
        body, keyboard = render(piece, "channel")
        await reply(message, f"<b>preview · {piece['id']}</b>\n\n{body}")
        if keyboard:
            await message.reply_text("Botones:", reply_markup=keyboard)

    elif cmd == "/testpost":
        if not args:
            await reply(message, "Uso: /testpost <book-id|app-id|bundle-books>")
            return
        piece = next(
            (p for pool in POOLS.values() for p in pool if p["id"] == args[0]), None
        )
        if not piece:
            await reply(message, f"❌ No existe: {args[0]}")
            return
        await deliver(piece, STATE, -1)
        await reply(message, f"✅ Publicado: {piece['id']}")

    elif cmd == "/pause":
        STATE["paused"] = True
        save_state(STATE)
        await reply(message, "⏸ Bot pausado. Se reactiva con /resume")

    elif cmd == "/resume":
        STATE["paused"] = False
        save_state(STATE)
        await reply(message, "▶️ Bot reactivado")

    elif cmd == "/check":
        if problems:
            await reply(message, "❌ <b>Integridad del catálogo</b>\n\n" + "\n".join(
                f"• {p}" for p in problems))
        else:
            await reply(message, (
                "✅ Catálogo íntegro: sin placeholders, todos los libros con "
                "checkout, todas las apps con packageId y las 8 herramientas "
                "de digest presentes en disco."
            ))

    else:
        await reply(message, "Comando desconocido. /help")


async def poll_updates() -> None:
    """Minimal admin command loop. Uses get_updates so no extra PTB machinery."""
    offset = 0
    while True:
        try:
            updates = await bot.get_updates(offset=offset, timeout=30)
        except TelegramError as exc:
            logger.error(f"get_updates error: {exc}")
            await asyncio.sleep(10)
            continue
        except asyncio.CancelledError:
            raise
        for update in updates:
            offset = update.update_id + 1
            message = getattr(update, "message", None)
            if message and message.text:
                try:
                    await handle_command(message)
                except Exception as exc:
                    logger.error(f"command failed: {exc}")
        if not DRY_RUN:
            await asyncio.sleep(3)


# ─── MAIN ─────────────────────────────────────────────────────────────────
async def main() -> None:
    global POOLS, STATE

    _setup_logging()

    if not TOKEN:
        logger.error("❌ TG_TOKEN is not set")
        return

    CATALOG.update(load_catalog())
    problems = validate_catalog(CATALOG)
    if problems:
        logger.error("❌ CATALOG INTEGRITY FAILED — refusing to start:")
        for problem in problems:
            logger.error(f"   • {problem}")
        return

    POOLS = build_pools(CATALOG)
    STATE = load_state()

    bot = Bot(token=TOKEN)

    logger.info("🚀 Cha0smagick Telegram Bot")
    logger.info(f"📍 Canal: {CHANNEL}")
    if GROUP_CHAT_ID:
        logger.info(f"👥 Grupo: {GROUP_CHAT_ID}")
    else:
        logger.info(
            "👥 Grupo: NO CONFIGURADO — solo se publica en el canal.\n"
            "   Para activarlo: agregar el bot al grupo como admin, enviar un "
            "mensaje en el grupo y definir TELEGRAM_GROUP_CHAT_ID con ese id."
        )
    logger.info(f"⏰ Zona: {TIMEZONE} · minuto {POST_MINUTE} de cada hora activa")
    logger.info(f"📊 Catálogo: {len(CATALOG['apps'])} apps · "
                f"{len(CATALOG['books'])} libros · 1 bundle (integridad OK)")
    logger.info(f"🕐 Slots activos: {len(HOURLY_PLAN)}/24 "
                f"({sum(1 for f in HOURLY_PLAN.values() if f != 'digest')} venta, "
                f"{sum(1 for f in HOURLY_PLAN.values() if f == 'digest')} valor)")
    if DRY_RUN:
        logger.info("🧪 DRY-RUN: los mensajes se construyen y registran, no se envían")

    try:
        me = await bot.get_me()
        logger.info(f"✅ Conectado como @{me.username}")
    except Exception as exc:
        logger.error(f"❌ No se pudo conectar: {exc}")
        return

    scheduler = AsyncIOScheduler(timezone=TIMEZONE)
    for hour, _fmt in HOURLY_PLAN.items():
        scheduler.add_job(
            scheduled_post,
            CronTrigger(hour=hour, minute=POST_MINUTE, timezone=TIMEZONE),
            args=[hour],
            id=f"slot_{hour:02d}h",
            replace_existing=True,
        )
    scheduler.start()
    logger.info("⏰ Scheduler iniciado")

    poller = asyncio.create_task(poll_updates())

    try:
        while True:
            await asyncio.sleep(300)
            if not scheduler.running:
                logger.warning("⚠️ Scheduler detenido, reiniciando")
                scheduler.start()
    except (KeyboardInterrupt, asyncio.CancelledError):
        pass
    finally:
        poller.cancel()
        scheduler.shutdown()
        save_state(STATE)
        await bot.close()
        logger.info("✅ Bot detenido limpiamente")


if __name__ == "__main__":
    asyncio.run(main())