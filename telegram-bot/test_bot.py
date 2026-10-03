#!/usr/bin/env python3
"""
Smoke tests for the Cha0smagick Telegram bot.

These exist because `npm test` never touched telegram-bot/bot.py, which is how
a catalog drift reached production unnoticed. Run with:

    TG_TOKEN=dummy python telegram-bot/test_bot.py

or via pytest. No network calls: nothing is sent.
"""

import importlib.util
import json
import os
import sys
from pathlib import Path

os.environ.setdefault("TG_TOKEN", "dry-run-token")

BOT_PATH = Path(__file__).resolve().parent / "bot.py"
spec = importlib.util.spec_from_file_location("cha0s_bot", BOT_PATH)
bot = importlib.util.module_from_spec(spec)
sys.modules["cha0s_bot"] = bot
spec.loader.exec_module(bot)


def test_catalog_is_valid_json_and_populated():
    data = bot.load_catalog()
    assert len(data["apps"]) == 12, f"expected 12 apps, got {len(data['apps'])}"
    assert len(data["books"]) == 7, f"expected 7 books, got {len(data['books'])}"
    assert data["bundle"]["hotmartProductId"] == "V107097103W"


def test_catalog_has_no_integrity_problems():
    problems = bot.validate_catalog(bot.load_catalog())
    assert problems == [], "catalog integrity problems:\n" + "\n".join(problems)


def test_no_placeholders_anywhere_in_catalog():
    blob = json.dumps(bot.load_catalog())
    assert not bot.PLACEHOLDER_RE.search(blob), "placeholder found in catalog"


def test_book_prices_sum_to_bundle_original_price():
    data = bot.load_catalog()
    nums = lambda s: float("".join(c for c in s if c.isdigit() or c == "."))
    total = sum(nums(b["price"]) for b in data["books"])
    assert round(total, 2) == round(nums(data["bundle"]["originalPrice"]), 2), (
        f"book prices sum to {total:.2f} but bundle claims "
        f"{data['bundle']['originalPrice']}"
    )


def test_bundle_price_is_below_original():
    data = bot.load_catalog()
    nums = lambda s: float("".join(c for c in s if c.isdigit() or c == "."))
    assert nums(data["bundle"]["price"]) < nums(data["bundle"]["originalPrice"])


def test_book_page_urls_match_files_on_disk():
    """A book URL must resolve to a real file, not a 404."""
    for book in bot.load_catalog()["books"]:
        slug = book["url"].rsplit("/", 1)[-1]
        assert (bot.REPO_ROOT / "books" / slug).is_file(), f"{slug} not on disk"


def test_every_pool_is_populated():
    pools = bot.build_pools(bot.load_catalog())
    assert len(pools["book"]) == 7
    assert len(pools["bundle"]) == 1
    assert len(pools["app"]) == 12
    assert len(pools["digest"]) == 8


def test_hourly_plan_shape():
    assert len(bot.HOURLY_PLAN) == 18, "expected 18 active hourly slots"
    assert all(6 <= hour <= 23 for hour in bot.HOURLY_PLAN), "posting outside 06:00-23:59"
    assert set(bot.HOURLY_PLAN.values()) <= {"book", "bundle", "app", "digest"}
    sales = sum(1 for f in bot.HOURLY_PLAN.values() if f != "digest")
    assert sales == 12, f"expected 12 sales slots, got {sales}"


def test_render_produces_escaped_text_and_buttons():
    pools = bot.build_pools(bot.load_catalog())
    for fmt, pool in pools.items():
        text, keyboard = bot.render(pool[0], "channel")
        assert text, f"{fmt} rendered empty text"
        assert keyboard is not None, f"{fmt} rendered no buttons"
        assert "<b>" in text or "<i>" in text, f"{fmt} has no markup"
        assert "&amp;" in text or "&" not in text, f"{fmt} has unescaped ampersand"
        urls = [b.url for row in keyboard.inline_keyboard for b in row]
        for url in urls:
            assert url.startswith("https://"), f"{fmt} has non-https url {url}"
            assert not bot.PLACEHOLDER_RE.search(url), f"{fmt} leaked a placeholder"
            assert "utm_source=telegram" in url, f"{fmt} missing UTM"


def test_group_render_has_exactly_one_button():
    pools = bot.build_pools(bot.load_catalog())
    for pool in pools.values():
        _text, keyboard = bot.render(pool[0], "group")
        assert len(keyboard.inline_keyboard) == 1
        assert len(keyboard.inline_keyboard[0]) == 1


def test_rotation_advances_and_wraps():
    pools = bot.build_pools(bot.load_catalog())
    state = {"cursors": {}, "history": [], "paused": False}
    first = bot.next_piece(pools, "book", state)
    second = bot.next_piece(pools, "book", state)
    assert first["id"] != second["id"], "rotation repeated the same book twice"
    for _ in range(5):
        bot.next_piece(pools, "book", state)
    wrapped = bot.next_piece(pools, "book", state)
    assert wrapped["id"] == first["id"], "7-book pool should wrap after 7 picks"


def test_utm_preserves_existing_query_string():
    url = bot.with_utm(
        "https://pay.hotmart.com/W106595764X?checkoutMode=2", "telegram", "bot_channel", "t"
    )
    assert "checkoutMode=2" in url, "with_utm dropped the original query string"
    assert "utm_source=telegram" in url


def test_rejected_offoffers_are_not_in_the_catalog():
    """Complete Access, Inner Circle, Flash Sale and the apps bundle must stay gone."""
    data = bot.load_catalog()
    sellable = json.dumps(
        {"apps": data["apps"], "books": data["books"], "bundle": data["bundle"]}
    ).lower()
    for forbidden in ("complete_access", "complete access", "inner_circle",
                      "inner circle", "flash_sale", "flash sale", "apps_bundle"):
        assert forbidden not in sellable, f"{forbidden} reappeared as a sellable offer"
    meta = data["_meta"].get("rejectedOffers", {})
    assert set(meta) == {"complete_access", "inner_circle", "flash_sale_99", "apps_bundle"}


def test_no_deprecated_preview_parameters_in_bot_source():
    """PTB >= 20 deprecated disable_web_page_preview in favour of link_preview_options.

    Assert on our own source rather than the installed version, so the check
    holds no matter which python-telegram-bot the server has.
    """
    source = BOT_PATH.read_text(encoding="utf-8")
    assert "disable_web_page_preview" not in source, (
        "bot.py still passes disable_web_page_preview — deprecated in PTB >= 20, "
        "use link_preview_options={'is_disabled': True}"
    )
    assert "link_preview_options" in source, "link_preview_options is required for PTB >= 20"


def test_send_message_call_survives_the_installed_ptb():
    """Bind the real signature so a keyword we pass can never be rejected."""
    import inspect
    from telegram import Bot as TelegramBot

    params = inspect.signature(TelegramBot.send_message).parameters
    used = ("chat_id", "text", "parse_mode", "reply_markup", "link_preview_options")
    for name in used:
        assert name in params, f"send_message has no parameter '{name}' in PTB {telegram_ver()}"


def telegram_ver() -> str:
    import telegram

    return getattr(telegram, "__version__", "unknown")


if __name__ == "__main__":
    failures = 0
    for name, fn in sorted(globals().items()):
        if not name.startswith("test_") or not callable(fn):
            continue
        try:
            fn()
            print(f"PASS  {name}")
        except AssertionError as exc:
            failures += 1
            print(f"FAIL  {name}\n      {exc}")
        except Exception as exc:  # noqa: BLE001
            failures += 1
            print(f"ERROR {name}\n      {type(exc).__name__}: {exc}")
    print(f"\n{failures} failure(s)")
    sys.exit(1 if failures else 0)