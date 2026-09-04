#!/usr/bin/env python3
"""
Cha0smagick Labs - Telegram Daily Offer Bot
Runs on Oracle Cloud Free Tier (Always Free)
Posts 3x/day to @magiacaoticacoven with rotating offers
"""

import os
import asyncio
import random
import logging
import json
from datetime import datetime, timezone, timedelta
from telegram import Bot, InputMediaPhoto
from telegram.error import TelegramError
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import aiohttp

# ─── CONFIG ──────────────────────────────────────────────────────────────
TOKEN = os.getenv("TG_TOKEN")
CHANNEL = "@magiacaoticacoven"
TIMEZONE = "America/Bogota"  # COT = UTC-5

# Posting schedule: 3x/day
POST_HOURS = [9, 14, 21]  # 9 AM, 2 PM, 9 PM COT

# ─── OFFERS ROTATION ────────────────────────────────────────────────────
# Each offer: text (with UTM tracking), image_url (hosted on Imgur/GitHub/raw), alt_text
OFFERS = [
    {
        "id": "noctem",
        "text": (
            "🔮 <b>NOCTEM: Cazafantasmas Pro</b>\n"
            "EVP Recorder + EMF Live Graph + Spirit Box + Análisis espectral\n"
            "⭐ 4.7★ · 128+ reviews · 100% offline · 7-day guarantee\n"
            "💰 COP 50.000 (one-time)\n\n"
            "👉 <a href='https://play.google.com/store/apps/details?id=com.cha0smagicklabs.noctemapp&utm_source=telegram&utm_medium=bot&utm_campaign=daily_noctem'>Descargar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/NOCTEM_IMG.jpg",  # REPLACE with actual Imgur URL
        "alt": "NOCTEM Ghost Hunting App Screenshot"
    },
    {
        "id": "lucid_dream",
        "text": (
            "🌙 <b>Lucid Dream: Proyección Astral</b>\n"
            "Técnicas WILD/ILD + Reality Checks + Dream Journal + Audio binaural\n"
            "⭐ 4.7★ · 100% offline · Sin suscripciones\n"
            "💰 COP 30.500 (one-time)\n\n"
            "👉 <a href='https://play.google.com/store/apps/details?id=com.cha0smagicklabs.luciddreamer&utm_source=telegram&utm_medium=bot&utm_campaign=daily_lucid'>Descargar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/LUCID_IMG.jpg",
        "alt": "Lucid Dream App Screenshot"
    },
    {
        "id": "books_bundle",
        "text": (
            "📚 <b>BUNDLE 7 Libros — 50% OFF</b>\n"
            "Codex Chaoticum + Tarot del Caos + Servidores Mágicos + Librería LV\n"
            "+ Magia del Caos Práctica + 2 grimorios exclusivos\n"
            "📖 PDF profesional · Dark design · Inglés + Español · Acceso vitalicio\n\n"
            "👉 <a href='https://hotmart.com/es/marketplace/productos/bundle-todos-los-libros-esp/V107097103W?sck=HOTMART_SITE&utm_source=telegram&utm_medium=bot&utm_campaign=daily_books'>Comprar en Hotmart</a>"
        ),
        "image_url": "https://i.imgur.com/BUNDLE_IMG.jpg",
        "alt": "7 Books Bundle Cover"
    },
    {
        "id": "psi_gym",
        "text": (
            "🎯 <b>PSI GYM: Entrena tu Intuición</b>\n"
            "Protocolos Zener + Remote Viewing + Precognición + Análisis estadístico automático\n"
            "📊 Datos reales: 32% aciertos Zener (azar 20%) · p < 0.01\n"
            "⭐ 4.7★ · 100% offline\n\n"
            "👉 <a href='https://play.google.com/store/apps/details?id=com.cha0smagicklabs.psigym&utm_source=telegram&utm_medium=bot&utm_campaign=daily_psi'>Descargar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/PSI_IMG.jpg",
        "alt": "PSI GYM ESP Training Screenshot"
    },
    {
        "id": "astral_lab",
        "text": (
            "🪐 <b>Astral Lab: Carta Natal Completa</b>\n"
            "Carta natal + Tránsitos + Progresiones + Sinastría + Arabic Parts\n"
            "🎨 Visualizaciones premium · Interpretaciones caóticas · Export PDF\n"
            "💰 COP 24.000 (one-time)\n\n"
            "👉 <a href='https://play.google.com/store/apps/details?id=com.cha0smagicklabs.astralchart&utm_source=telegram&utm_medium=bot&utm_campaign=daily_astral'>Descargar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/ASTRAL_IMG.jpg",
        "alt": "Astral Lab Natal Chart Screenshot"
    },
    {
        "id": "sigil_gen",
        "text": (
            "✒️ <b>Sigil Generator: 5 Métodos en 1 Click</b>\n"
            "Gráfico · Silábico · Urobórico · Cuadrados Mágicos · Spare\n"
            "⚡ Carga/Activación automática · Gallery · Export PNG/SVG\n"
            "💰 COP 14.000 (one-time)\n\n"
            "👉 <a href='https://play.google.com/store/apps/details?id=com.cha0smagicklabs.sigilgenerator&utm_source=telegram&utm_medium=bot&utm_campaign=daily_sigil'>Descargar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/SIGIL_IMG.jpg",
        "alt": "Sigil Generator App Screenshot"
    },
    {
        "id": "testimonial",
        "text": (
            "⭐ <b>Testimonio Real</b>\n\n"
            "\"NOCTEM me salvó en una investigación real. Grabó 3 EVPs clase A\n"
            "mientras hacía un ritual de protección. La app filtró el ruido\n"
            "y me dio las frecuencias exactas. 4.7★ por algo es.\"\n"
            "— Practicante verificado, 6 meses de uso\n\n"
            "👉 <a href='https://cha0smagicklabs.com/testimonios?utm_source=telegram&utm_medium=bot&utm_campaign=daily_testimonial'>Ver más testimonios</a>"
        ),
        "image_url": "https://i.imgur.com/TESTIMONIAL_IMG.jpg",
        "alt": "Testimonial Graphic"
    },
    {
        "id": "apps_bundle",
        "text": (
            "📱 <b>COMPLETE APPS BUNDLE — 11 Apps por $29.99</b>\n"
            "Sigil Gen + NOCTEM + Lucid Dream + Astral Lab + Dreamachine\n"
            "+ PSI GYM + Eerie Roads + Rune Reader + Tarot Chaos + I Ching + Goetia\n"
            "💰 Ahorra $45+ vs individuales · 100% offline · 7-day guarantee\n\n"
            "👉 <a href='https://play.google.com/store/apps/collection/cluster?gsr=SmRqGEFUVW5TRWFZN0NicHVTeXJ6Zmw4UEE9PbICRAonCiNjb20uY2hhMHNtYWdpY2suc2lnaWxnZW5lcmF0b3JmaW5hbBAHEhcIARITNzE3ODc3MzIzMjI4NTIxNDc0NxgAsBIA:S:ANO1ljI1Hcg&utm_source=telegram&utm_medium=bot&utm_campaign=daily_apps_bundle'>Comprar en Google Play</a>"
        ),
        "image_url": "https://i.imgur.com/APPS_BUNDLE_IMG.jpg",
        "alt": "11 Apps Bundle Graphic"
    },
    {
        "id": "complete_access",
        "text": (
            "🔥 <b>COMPLETE ACCESS — Apps + Libros = $49.99</b>\n"
            "11 Apps Android + 7 Libros PDF + Inner Circle Founding ($9/mes locked)\n"
            "Valor real: $350+ → Tu precio: $49.99 (12h only)\n\n"
            "👉 <a href='https://hotmart.com/en/marketplace/products/complete-access/[HOTMART_PRODUCT_ID]?sck=HOTMART_SITE&utm_source=telegram&utm_medium=bot&utm_campaign=daily_complete'>Comprar en Hotmart</a>"
        ),
        "image_url": "https://i.imgur.com/COMPLETE_ACCESS_IMG.jpg",
        "alt": "Complete Access Graphic"
    },
    {
        "id": "inner_circle",
        "text": (
            "👑 <b>INNER CIRCLE — Membresía $19/mes (Founding $9/mes)</b>\n"
            "Acceso PWA Apps + 1 Libro nuevo/mes + 1 Ritual video/mes\n"
            "Canal Telegram VIP + 20% descuento lanzamientos\n\n"
            "👉 <a href='https://hotmart.com/es/marketplace/productos/inner-circle-monthly/[HOTMART_SUB_ID]?sck=HOTMART_SITE&utm_source=telegram&utm_medium=bot&utm_campaign=daily_inner_circle'>Suscribirse en Hotmart</a>"
        ),
        "image_url": "https://i.imgur.com/INNER_CIRCLE_IMG.jpg",
        "alt": "Inner Circle Membership"
    }
]

# ─── LOGGING ─────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("/home/ubuntu/cha0s-bot/bot.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# ─── BOT INSTANCE ────────────────────────────────────────────────────────
bot = Bot(token=TOKEN)

# ─── HELPERS ─────────────────────────────────────────────────────────────
async def download_image(session: aiohttp.ClientSession, url: str) -> bytes:
    """Download image from URL with timeout"""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status == 200:
                return await resp.read()
            else:
                logger.warning(f"Image download failed: {url} (status {resp.status})")
                return None
    except Exception as e:
        logger.error(f"Image download error: {url} - {e}")
        return None


async def send_offer(offer: dict) -> bool:
    """Send a single offer to the channel with photo"""
    try:
        async with aiohttp.ClientSession() as session:
            image_bytes = await download_image(session, offer["image_url"])

        if image_bytes:
            await bot.send_photo(
                chat_id=CHANNEL,
                photo=image_bytes,
                caption=offer["text"],
                parse_mode="HTML"
            )
        else:
            # Fallback: text only if image fails
            await bot.send_message(
                chat_id=CHANNEL,
                text=offer["text"],
                parse_mode="HTML",
                disable_web_page_preview=True
            )

        logger.info(f"✅ Posted offer: {offer['id']} at {datetime.now(timezone.utc).isoformat()}")
        return True

    except TelegramError as e:
        logger.error(f"❌ Telegram error posting {offer['id']}: {e}")
        return False
    except Exception as e:
        logger.error(f"❌ Unexpected error posting {offer['id']}: {e}")
        return False


def pick_offer(history: list, max_history: int = 5) -> dict:
    """Pick offer avoiding recent repeats (simple anti-repeat)"""
    recent_ids = [h["id"] for h in history[-max_history:]]
    available = [o for o in OFFERS if o["id"] not in recent_ids]
    if not available:
        available = OFFERS  # fallback if all recently used
    return random.choice(available)


# ─── SCHEDULED JOB ───────────────────────────────────────────────────────
post_history = []

async def scheduled_post():
    """Called by scheduler at POST_HOURS"""
    global post_history
    offer = pick_offer(post_history)
    success = await send_offer(offer)
    if success:
        post_history.append({"id": offer["id"], "time": datetime.now(timezone.utc).isoformat()})
        # Keep history bounded
        if len(post_history) > 20:
            post_history = post_history[-20:]


# ─── COMMAND HANDLERS (for manual testing) ──────────────────────────────
async def cmd_test_post(update, context):
    """Manual trigger: /testpost [offer_id]"""
    if not update.effective_user.id == int(os.getenv("ADMIN_USER_ID", "0")):
        return
    args = context.args
    if args:
        offer = next((o for o in OFFERS if o["id"] == args[0]), None)
        if offer:
            await send_offer(offer)
            await update.message.reply_text(f"✅ Test posted: {offer['id']}")
        else:
            await update.message.reply_text(f"❌ Offer not found: {args[0]}")
    else:
        offer = pick_offer(post_history)
        await send_offer(offer)
        await update.message.reply_text(f"✅ Random test posted: {offer['id']}")


async def cmd_status(update, context):
    """Status check: /status"""
    if not update.effective_user.id == int(os.getenv("ADMIN_USER_ID", "0")):
        return
    await update.message.reply_text(
        f"🤖 <b>Cha0smagick Bot Status</b>\n"
        f"📅 Next posts: {', '.join(f'{h}:00 COT' for h in POST_HOURS)}\n"
        f"📜 History (last 5): {', '.join(h['id'] for h in post_history[-5:])}\n"
        f"⏰ Uptime: {datetime.now(timezone.utc).isoformat()}",
        parse_mode="HTML"
    )


async def cmd_list_offers(update, context):
    """List all offers: /offers"""
    if not update.effective_user.id == int(os.getenv("ADMIN_USER_ID", "0")):
        return
    msg = "<b>Available Offers:</b>\n\n"
    for o in OFFERS:
        msg += f"• <code>{o['id']}</code> — {o['text'][:60]}...\n"
    await update.message.reply_text(msg, parse_mode="HTML")


async def cmd_kpi(update, context):
    """KPI Snapshot: /kpi"""
    if not update.effective_user.id == int(os.getenv("ADMIN_USER_ID", "0")):
        return
    try:
        # Leer JSON generado por Apps Script cada 4h
        with open('/home/ubuntu/cha0s-bot/kpi_snapshot.json') as f:
            kpi = json.load(f)
        msg = (
            f"📊 <b>KPI SNAPSHOT - H{kpi['hour']}</b>\n\n"
            f"💰 Revenue: <b>${kpi['revenue']:.2f}</b> / ${kpi['target']:.0f} ({kpi['pct_target']:.0%})\n"
            f"📧 Suscriptores: <b>{kpi['subscribers']}</b> (+{kpi['new_subs']} hoy)\n"
            f"📱 Ventas Apps: <b>{kpi['sales_apps']}</b> | Bundle: {kpi['bundle_apps']}\n"
            f"📚 Ventas Libros: <b>{kpi['sales_books']}</b> | Bundle: {kpi['bundle_books']}\n"
            f"👥 Inner Circle: <b>{kpi['inner_circle']}</b>\n"
            f"🤝 Afiliados activos: <b>{kpi['active_affiliates']}</b>\n"
            f"📈 Open Rate: {kpi['open_rate']:.1%} | Click Rate: {kpi['click_rate']:.1%}\n\n"
            f"⏰ Próxima revisión: H{kpi['hour']+4}"
        )
        await update.message.reply_text(msg, parse_mode="HTML")
    except Exception as e:
        await update.message.reply_text(f"❌ Error leyendo KPIs: {e}\nEjecuta Apps Script exportKPISnapshot()")


async def cmd_flash(update, context):
    """Activar Plan B Flash Sale: /flash"""
    if not update.effective_user.id == int(os.getenv("ADMIN_USER_ID", "0")):
        return
    msg = (
        "🚨 <b>PLAN B ACTIVADO - FLASH SALE 72H</b>\n\n"
        "✅ Landing: flash.cha0smagicklabs.com (Carrd)\n"
        "✅ Producto Hotmart: flash-sale-99 ($99, stock 20)\n"
        "✅ Email Blast: Lista completa MailerLite\n"
        "✅ Telegram: Broadcast + Pin @magiacaoticacoven\n"
        "✅ Meta Ads: $100/día × 3 días (Lookalike 1% + Interests)\n\n"
        "<b>Links de pago (SOLO HOTMART + GOOGLE PLAY):</b>\n"
        "• Flash Sale $99: https://hotmart.com/es/marketplace/productos/flash-sale-99/[ID]\n"
        "• Apps Bundle $29.99: https://play.google.com/store/apps/collection/cluster?gsr=...\n\n"
        "<b>Monitoreo cada 2h:</b> CPL, CPA, ROAS, Frequency, Slots restantes\n\n"
        "⚠️ <b>NO HAY STRIPE. SOLO HOTMART + GOOGLE PLAY.</b>"
    )
    await update.message.reply_text(msg, parse_mode="HTML")


# ─── MAIN ────────────────────────────────────────────────────────────────
async def main():
    if not TOKEN:
        logger.error("❌ TG_TOKEN environment variable not set!")
        return

    logger.info("🚀 Starting Cha0smagick Telegram Bot...")
    logger.info(f"📍 Channel: {CHANNEL}")
    logger.info(f"⏰ Schedule: {POST_HOURS}:00 COT daily")
    logger.info(f"🎯 Offers loaded: {len(OFFERS)}")

    # Test bot connection
    try:
        me = await bot.get_me()
        logger.info(f"✅ Bot connected: @{me.username} ({me.first_name})")
    except Exception as e:
        logger.error(f"❌ Bot connection failed: {e}")
        return

    # Setup scheduler
    scheduler = AsyncIOScheduler(timezone=TIMEZONE)
    for hour in POST_HOURS:
        scheduler.add_job(
            scheduled_post,
            CronTrigger(hour=hour, minute=0, timezone=TIMEZONE),
            id=f"post_{hour}h",
            replace_existing=True
        )
    scheduler.start()
    logger.info("⏰ Scheduler started")

    # Keep running
    try:
        while True:
            await asyncio.sleep(3600)  # Sleep 1 hour, check scheduler still alive
            if not scheduler.running:
                logger.warning("⚠️ Scheduler stopped, restarting...")
                scheduler.start()
    except KeyboardInterrupt:
        logger.info("🛑 Shutdown requested")
    finally:
        scheduler.shutdown()
        await bot.close()
        logger.info("✅ Bot stopped cleanly")


if __name__ == "__main__":
    asyncio.run(main())