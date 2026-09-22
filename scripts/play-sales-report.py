#!/usr/bin/env python3
"""play-sales-report.py — Daily Google Play Console sales fetch/report (task 2.4.8, R16).

Reads the standard Play Console financial-report CSVs (one or more *.csv files
in PLAY_SALES_CSV_DIR), aggregates sales by app + date, and POSTs a daily
summary JSON to a Make.com webhook that appends to Google Sheets and triggers
MailerLite. Service-account API auth is a later user activation — for now the
owner exports the CSV manually:

    Play Console -> Download reports -> Financial -> pick the date range ->
    download the CSV -> drop it in PLAY_SALES_CSV_DIR.

Aggregation rules (tolerant to column-name variations — columns are matched by
normalized keywords, so 'Amount (Merchant Currency)', 'Amount Merchant
Currency' and 'Charged Amount' all resolve to the amount field):
  - Rows whose Description/Transaction Type contains 'fee', 'commission' or
    'tax' are excluded (they are not sales).
  - Refund rows are subtracted (a positive refund amount is negated), so each
    per-app total is net sales.
  - Rows with an unparseable/absent transaction date are skipped by the daily
    filter.

Usage:
  python scripts/play-sales-report.py                 # yesterday (UTC), POST to webhook
  python scripts/play-sales-report.py --date 2026-09-15
  python scripts/play-sales-report.py --dry-run       # build + print payload, skip POST
  python scripts/play-sales-report.py --selftest      # embedded sample CSV, no network

Env vars (see .env.example; loaded from the repo-root .env if present):
  PLAY_SALES_CSV_DIR        — directory with Play financial report CSVs (required)
  PLAY_SALES_WEBHOOK_URL    — Make.com scenario URL (required unless --dry-run/--selftest)
  PLAY_SALES_WEBHOOK_SECRET — optional; when set the POST carries
                              'X-Webhook-Signature: sha256=<hex>' (HMAC-SHA256 over
                              the raw body, timing-safe compare on the receiver —
                              same convention as scripts/webhook-receiver.js)

Local log: logs/play-sales-summary-YYYY-MM-DD.json (one JSON payload per run).

Schedule (daily, after Play publishes the previous day's report):
  0 6 * * * python /path/to/repo/scripts/play-sales-report.py >> /path/to/repo/logs/play-sales-cron.log 2>&1
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import hmac
import io
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / "logs"

# Words that mark a row as NOT a sale (fees/commissions/taxes are excluded).
_EXCLUDE_WORDS = ("fee", "commission", "tax")


def _load_dotenv() -> None:
    """Load repo-root .env (KEY=VALUE lines) without overriding real env vars."""
    env_path = ROOT / ".env"
    if not env_path.is_file():
        return
    try:
        text = env_path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


def normalize_column(name: object) -> str:
    """Lowercase and collapse punctuation so column variants compare equal."""
    return re.sub(r"[^a-z0-9]+", " ", str(name).strip().lower()).strip()


def get_field(row: dict, *keywords: str) -> str:
    """Return the first value whose normalized column name contains all keywords."""
    for col, value in row.items():
        if all(k in col for k in keywords):
            return value.strip()
    return ""


def parse_amount(raw: object) -> float:
    """Parse a Play amount cell ('US$14.99', '$3.99', '3,99', '1.234,56') to float."""
    if raw is None:
        return 0.0
    s = re.sub(r"[^0-9,.\-]", "", str(raw))
    if not s.strip("-.,"):
        return 0.0
    negative = s.lstrip().startswith("-")
    s = s.replace("-", "")
    if "," in s and "." in s:
        # The last separator is the decimal separator.
        if s.rfind(",") > s.rfind("."):
            s = s.replace(".", "").replace(",", ".")  # 1.234,56 -> 1234.56
        else:
            s = s.replace(",", "")  # 1,234.56 -> 1234.56
    elif "," in s:
        head, _, tail = s.rpartition(",")
        if len(tail) == 3 and head:
            s = head.replace(",", "") + tail  # 1,234 -> 1234 (thousands)
        else:
            s = head.replace(",", "") + "." + tail  # 3,99 -> 3.99
    elif "." in s:
        head, _, tail = s.rpartition(".")
        if len(tail) == 3 and head:
            s = head.replace(".", "") + tail  # 1.234 -> 1234 (thousands)
    try:
        value = float(s)
    except ValueError:
        return 0.0
    return -value if negative else value


def parse_date(value: str) -> str | None:
    """Normalize a CSV date cell to YYYY-MM-DD; None if unparseable."""
    s = value.strip()
    if not s:
        return None
    match = re.match(r"^(\d{4})-(\d{2})-(\d{2})", s)
    if match:
        return match.group(0)
    match = re.match(r"^(\d{1,2})/(\d{1,2})/(\d{4})", s)
    if match:
        return f"{match.group(3)}-{int(match.group(1)):02d}-{int(match.group(2)):02d}"
    for fmt in ("%Y/%m/%d", "%m/%d/%Y %H:%M", "%b %d, %Y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    return None


def row_date(row: dict) -> str | None:
    """Transaction date of a normalized row (tolerant fallback to any 'date' column)."""
    return parse_date(get_field(row, "transaction", "date") or get_field(row, "date"))


def classify_row(row: dict) -> str:
    """Classify a normalized row as 'charge', 'refund' or 'fee'."""
    blob = f"{get_field(row, 'description').lower()} {get_field(row, 'transaction', 'type').lower()}"
    if "refund" in blob or "reversal" in blob:
        return "refund"
    if any(word in blob for word in _EXCLUDE_WORDS):
        return "fee"
    return "charge"


def load_csv_rows(csv_dir: Path) -> list[dict]:
    """Read every *.csv in csv_dir into normalized dict rows (BOM-tolerant)."""
    rows: list[dict] = []
    for path in sorted(csv_dir.glob("*.csv")):
        try:
            text = path.read_text(encoding="utf-8-sig", errors="replace")
        except OSError as exc:
            print(f"WARN: cannot read {path.name}: {exc}")
            continue
        reader = csv.DictReader(io.StringIO(text))
        for raw in reader:
            rows.append({normalize_column(k): (v or "") for k, v in raw.items() if k})
    return rows


def aggregate(rows: list[dict]) -> list[dict]:
    """Aggregate net sales by (app, date); fees/taxes excluded, refunds subtracted."""
    buckets: dict[tuple[str, str], dict] = {}
    for row in rows:
        kind = classify_row(row)
        if kind == "fee":
            continue
        app = get_field(row, "app") or get_field(row, "package") or get_field(row, "product", "id") or "unknown"
        date = row_date(row) or "unknown"
        amount = parse_amount(get_field(row, "amount", "merchant") or get_field(row, "amount"))
        if kind == "refund" and amount > 0:
            amount = -amount
        bucket = buckets.setdefault((app, date), {"app": app, "date": date, "amount": 0.0, "transactions": 0})
        bucket["amount"] = round(bucket["amount"] + amount, 2)
        bucket["transactions"] += 1
    return sorted(buckets.values(), key=lambda b: (b["date"], b["app"]))


def build_payload(apps: list[dict], report_date: str, dry_run: bool) -> dict:
    """Daily summary JSON for the Make.com -> Sheets -> MailerLite pipeline."""
    return {
        "source": "play-sales-report",
        "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "report_date": report_date,
        "currency": "USD",  # merchant currency; repo apps are priced in USD
        "total_amount": round(sum(a["amount"] for a in apps), 2),
        "total_transactions": sum(a["transactions"] for a in apps),
        "apps": apps,
        "dry_run": dry_run,
    }


def sign_payload(body: bytes, secret: str) -> str:
    """HMAC-SHA256 signature in the repo convention: 'sha256=<hex>'."""
    digest = hmac.new(secret.encode("utf-8"), body, hashlib.sha256).hexdigest()
    return f"sha256={digest}"


def verify_signature(body: bytes, secret: str, signature: str) -> bool:
    """Timing-safe signature compare (hmac.compare_digest, webhook-receiver.js convention)."""
    return hmac.compare_digest(
        sign_payload(body, secret).encode("utf-8"),
        signature.encode("utf-8"),
    )


def post_webhook(url: str, payload: dict, secret: str | None) -> int:
    """POST the summary JSON; adds X-Webhook-Signature when a secret is set."""
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    headers = {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "play-sales-report/1.0",
    }
    if secret:
        headers["X-Webhook-Signature"] = sign_payload(body, secret)
    request = Request(url, data=body, headers=headers, method="POST")
    with urlopen(request, timeout=30) as response:
        return response.status


def write_log(payload: dict) -> Path:
    """Persist the summary under logs/play-sales-summary-YYYY-MM-DD.json."""
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"play-sales-summary-{payload['report_date']}.json"
    log_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return log_path


# --- Embedded sample data for --selftest (no network calls) ---

_SAMPLE_CSV_PRIMARY = """Description,Transaction Date,Product Title,Product ID,Amount (Merchant Currency),App ID
Charge,2026-09-15,NOCTEM - Paranormal Suite,com.cha0smagick.noctem,US$14.99,com.cha0smagick.noctem
Charge,2026-09-15,PSI GYM - Zener ESP Trainer,com.cha0smagick.psigym,US$3.99,com.cha0smagick.psigym
Google fee,2026-09-15,PSI GYM - Zener ESP Trainer,com.cha0smagick.psigym,-US$0.57,com.cha0smagick.psigym
Charge,2026-09-16,Rider-Waite Tarot Complete,com.cha0smagick.tarot,$9.99,com.cha0smagick.tarot
Refund,2026-09-16,PSI GYM - Zener ESP Trainer,com.cha0smagick.psigym,US$3.99,com.cha0smagick.psigym
"""

# Variant column names: no space in 'TransactionDate', no parens in the amount,
# 'Package Name' instead of 'App ID'.
_SAMPLE_CSV_VARIANT = """Transaction Type,TransactionDate,Product Title,Amount Merchant Currency,Package Name
CHARGE,2026-09-15,Dream Machine,3.99,com.cha0smagick.dreammachine
REFUND,2026-09-15,Dream Machine,3.99,com.cha0smagick.dreammachine
"""


def _parse_csv_text(text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(text))
    return [{normalize_column(k): (v or "") for k, v in raw.items() if k} for raw in reader]


def run_selftest() -> None:
    """Verify aggregation + payload build + HMAC round-trip on embedded samples."""
    print("SELFTEST: play-sales-report embedded sample verification")

    # 1. Amount parsing variants
    assert parse_amount("US$14.99") == 14.99
    assert parse_amount("$9.99") == 9.99
    assert parse_amount("3.99") == 3.99
    assert parse_amount("3,99") == 3.99
    assert parse_amount("1.234,56") == 1234.56
    assert parse_amount("1,234.56") == 1234.56
    assert parse_amount("-US$0.57") == -0.57
    assert parse_amount("") == 0.0
    print("PASS: amount parsing variants")

    # 2. Primary CSV: aggregation by app + date, fee exclusion, refund negation
    rows = _parse_csv_text(_SAMPLE_CSV_PRIMARY)
    apps = aggregate(rows)
    by_key = {(a["app"], a["date"]): a for a in apps}
    assert by_key[("com.cha0smagick.noctem", "2026-09-15")]["amount"] == 14.99
    assert by_key[("com.cha0smagick.noctem", "2026-09-15")]["transactions"] == 1
    assert by_key[("com.cha0smagick.psigym", "2026-09-15")]["amount"] == 3.99  # fee row excluded
    assert by_key[("com.cha0smagick.tarot", "2026-09-16")]["amount"] == 9.99
    assert by_key[("com.cha0smagick.psigym", "2026-09-16")]["amount"] == -3.99  # refund negated
    total = round(sum(a["amount"] for a in apps), 2)
    assert total == 24.98, f"total {total} != 24.98"
    assert sum(a["transactions"] for a in apps) == 4
    print("PASS: primary CSV aggregation (fee excluded, refund negated, totals correct)")

    # 3. Daily filter
    dated = [r for r in rows if row_date(r) == "2026-09-15"]
    apps_15 = aggregate(dated)
    assert len(apps_15) == 2
    assert round(sum(a["amount"] for a in apps_15), 2) == 18.98
    print("PASS: daily filter (2026-09-15 -> 2 apps, 18.98)")

    # 4. Variant column names
    vapps = aggregate(_parse_csv_text(_SAMPLE_CSV_VARIANT))
    assert len(vapps) == 1
    assert vapps[0]["app"] == "com.cha0smagick.dreammachine"
    assert vapps[0]["amount"] == 0.0  # charge +3.99, refund -3.99
    assert vapps[0]["transactions"] == 2
    print("PASS: variant column names (TransactionDate, Amount Merchant Currency, Package Name)")

    # 5. Payload build
    payload = build_payload(apps_15, "2026-09-15", dry_run=True)
    assert payload["source"] == "play-sales-report"
    assert payload["report_date"] == "2026-09-15"
    assert payload["total_amount"] == 18.98
    assert payload["total_transactions"] == 2
    assert payload["dry_run"] is True
    assert len(payload["apps"]) == 2
    print("PASS: payload build")

    # 6. HMAC round-trip (timing-safe compare, webhook-receiver.js conventions)
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    test_secret = "selftest_secret"
    signature = sign_payload(body, test_secret)
    assert signature.startswith("sha256=")
    assert verify_signature(body, test_secret, signature) is True
    assert verify_signature(body, "wrong_secret", signature) is False
    assert verify_signature(body + b" ", test_secret, signature) is False
    print("PASS: HMAC round-trip (sha256=<hex>, timing-safe compare)")

    print("SELFTEST: ALL PASSED")
    sys.exit(0)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Daily Google Play Console sales fetch/report (task 2.4.8).",
    )
    parser.add_argument("--date", help="Target report date YYYY-MM-DD (default: yesterday UTC)")
    parser.add_argument("--dry-run", "--dryrun", dest="dry_run", action="store_true",
                        help="Build and print the payload; skip the webhook POST")
    parser.add_argument("--selftest", action="store_true",
                        help="Run embedded sample verification; no network calls")
    return parser.parse_args()


def main() -> None:
    _load_dotenv()
    args = parse_args()

    if args.selftest:
        run_selftest()
        return

    dry_run = args.dry_run
    csv_dir_env = os.environ.get("PLAY_SALES_CSV_DIR", "").strip()
    webhook_url = os.environ.get("PLAY_SALES_WEBHOOK_URL", "").strip()
    secret = os.environ.get("PLAY_SALES_WEBHOOK_SECRET", "").strip() or None

    report_date = args.date or (datetime.now(timezone.utc) - timedelta(days=1)).strftime("%Y-%m-%d")

    # CSV source: required for a real run; dry-run degrades to an empty summary.
    rows: list[dict] = []
    if not csv_dir_env:
        if dry_run:
            print("WARN: PLAY_SALES_CSV_DIR not set - building empty summary (dry-run)")
        else:
            print("ERROR: PLAY_SALES_CSV_DIR is not set.")
            print("       Export the Play financial report CSV (Play Console -> Download reports -> Financial)")
            print("       and set PLAY_SALES_CSV_DIR in .env (see .env.example), or use --dry-run to preview.")
            sys.exit(1)
    else:
        csv_dir = Path(csv_dir_env)
        if not csv_dir.is_dir():
            if dry_run:
                print(f"WARN: PLAY_SALES_CSV_DIR is not a directory: {csv_dir} - building empty summary (dry-run)")
            else:
                print(f"ERROR: PLAY_SALES_CSV_DIR is not a directory: {csv_dir}")
                sys.exit(1)
        else:
            rows = load_csv_rows(csv_dir)
            if not rows:
                print(f"WARN: no CSV rows found in {csv_dir}")

    # Webhook target: required for a real run (the POST is the point of the run).
    if not webhook_url and not dry_run:
        print("ERROR: PLAY_SALES_WEBHOOK_URL is not set.")
        print("       Set it in .env (Make.com scenario URL) or use --dry-run to preview without POSTing.")
        sys.exit(1)

    dated = [r for r in rows if row_date(r) == report_date]
    apps = aggregate(dated)
    payload = build_payload(apps, report_date, dry_run)

    print(json.dumps(payload, ensure_ascii=False, indent=2))

    log_path = write_log(payload)
    print(f"LOG: summary written to {log_path}")

    if dry_run:
        print("DRY-RUN: payload built (above); POST skipped.")
        return

    status = post_webhook(webhook_url, payload, secret)
    print(f"OK: POSTed to {webhook_url} (HTTP {status})" + (" [HMAC signed]" if secret else ""))


if __name__ == "__main__":
    main()
