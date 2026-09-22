#!/usr/bin/env python3
"""cohort-analysis.py — MailerLite export → monthly cohort pivot tables (task 2.6.4, R29).

Reads a MailerLite subscribers export CSV and an optional sales/conversions
CSV, groups subscribers into MONTHLY cohorts by subscribe month (e.g. 2026-01)
and computes per cohort: size, buyers count, conversion rate, total revenue and
average revenue per buyer (LTV proxy) — so "Jan 2026 buyers LTV vs Jul 2026
buyers" is directly comparable in one pivot table.

Column tolerance (columns are matched by normalized keywords, so 'email',
'E-mail', 'subscribe_date', 'Subscribe Date', 'created_at' and 'Created At'
all resolve to the same field):
  - Subscribers: email, subscribe date (subscribe_date/created_at variants),
    status (tolerated, not used in the math) plus optional purchase/conversion
    custom fields (e.g. last_purchase_date set by scripts/webhook-receiver.js)
    whose non-empty value marks the subscriber as a buyer.
  - Sales: email, amount, date. Emails missing from the sales CSV are handled
    gracefully (0 revenue rows). Sales emails not present in the subscribers
    export are counted as unmatched and excluded from cohort math. A purchase
    timestamp alone is never misread as the subscribe date.

Usage:
  python scripts/cohort-analysis.py --subscribers subscribers.csv
  python scripts/cohort-analysis.py --subscribers subs.csv --sales sales.csv
  python scripts/cohort-analysis.py --dry-run      # build + print, skip POST
  python scripts/cohort-analysis.py --selftest     # embedded samples, no network

Env vars (see .env.example; loaded from the repo-root .env if present):
  COHORT_SUBSCRIBERS_CSV — MailerLite subscribers export CSV (required;
                           --subscribers overrides)
  COHORT_SALES_CSV       — sales/conversions CSV (optional; --sales overrides)
  COHORT_WEBHOOK_URL     — Make.com scenario URL (required unless --dry-run/--selftest)
  COHORT_WEBHOOK_SECRET  — optional; when set the POST carries
                           'X-Webhook-Signature: sha256=<hex>' (HMAC-SHA256 over
                           the raw body, timing-safe compare on the receiver —
                           same convention as scripts/webhook-receiver.js)

Local logs: logs/cohort-analysis-YYYY-MM-DD.json + logs/cohort-analysis-YYYY-MM-DD.csv
(one pivot per run, run date in UTC).
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
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
LOG_DIR = ROOT / "logs"

# Words that mark a date column as NOT the subscribe date (a purchase or
# unsubscribe timestamp must never be misread as the cohort month).
_DATE_EXCLUDE_WORDS = ("purchase", "conversion", "unsubscribe")

# Keyword fragments whose non-empty value marks a subscriber as a buyer via
# optional purchase/conversion custom fields.
_BUYER_FIELD_KEYWORDS = (("purchase",), ("spent",), ("conversion",), ("converted",))


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


def row_email(row: dict) -> str:
    """Email of a row (tolerant: 'email', 'e-mail' -> 'e mail', 'mail')."""
    value = get_field(row, "email")
    if value:
        return value
    return get_field(row, "e mail") or get_field(row, "mail")


def parse_amount(raw: object) -> float:
    """Parse an amount cell ('US$14.99', '$3.99', '3,99', '1.234,56') to float."""
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


def cohort_month_of(row: dict) -> str | None:
    """Subscribe month (YYYY-MM) of a row; None if no subscribe date resolves."""
    for keywords in (("subscribe", "date"), ("subscribed", "at"),
                     ("created", "at"), ("created", "date")):
        raw = get_field(row, *keywords)
        if raw:
            parsed = parse_date(raw)
            if parsed:
                return parsed[:7]
    # Last resort: any 'date' column that is not a purchase/unsubscribe timestamp.
    for col, value in row.items():
        if "date" in col and not any(word in col for word in _DATE_EXCLUDE_WORDS):
            parsed = parse_date(value)
            if parsed:
                return parsed[:7]
    return None


def row_is_buyer(row: dict) -> bool:
    """Buyer evidence from optional purchase/conversion custom fields."""
    return any(get_field(row, *keywords) for keywords in _BUYER_FIELD_KEYWORDS)


def row_amount(row: dict) -> str:
    """Amount cell of a sales row (tolerant: amount/revenue/value)."""
    return get_field(row, "amount") or get_field(row, "revenue") or get_field(row, "value")


def _parse_subscribers_text(text: str) -> list[dict]:
    """Parse subscribers CSV text into normalized loader rows."""
    rows: list[dict] = []
    for raw in csv.DictReader(io.StringIO(text)):
        row = {normalize_column(k): (v or "") for k, v in raw.items() if k}
        rows.append({
            "email": row_email(row).strip().lower(),
            "cohort_month": cohort_month_of(row),
            "is_buyer": row_is_buyer(row),
        })
    return rows


def load_subscribers(path: Path) -> list[dict]:
    """Read the MailerLite subscribers export CSV (BOM-tolerant)."""
    try:
        text = path.read_text(encoding="utf-8-sig", errors="replace")
    except OSError as exc:
        print(f"ERROR: cannot read subscribers CSV {path}: {exc}")
        sys.exit(1)
    return _parse_subscribers_text(text)


def _parse_sales_text(text: str) -> list[dict]:
    """Parse sales CSV text into normalized rows (rows without an email are skipped)."""
    sales: list[dict] = []
    for raw in csv.DictReader(io.StringIO(text)):
        row = {normalize_column(k): (v or "") for k, v in raw.items() if k}
        email = row_email(row).strip().lower()
        if not email:
            continue  # a row without an email cannot be attached to a cohort
        sales.append({"email": email, "amount": parse_amount(row_amount(row))})
    return sales


def load_sales(path: Path) -> list[dict]:
    """Read the sales/conversions CSV (BOM-tolerant)."""
    try:
        text = path.read_text(encoding="utf-8-sig", errors="replace")
    except OSError as exc:
        print(f"ERROR: cannot read sales CSV {path}: {exc}")
        sys.exit(1)
    return _parse_sales_text(text)


def compute_cohorts(subscribers: list[dict], sales: list[dict]) -> tuple[list[dict], dict]:
    """Monthly cohort pivot: size, buyers, conversion rate, revenue, LTV per cohort month."""
    revenue_by_email: dict[str, float] = defaultdict(float)
    for sale in sales:
        revenue_by_email[sale["email"]] = round(revenue_by_email[sale["email"]] + sale["amount"], 2)

    cohorts: dict[str, dict] = {}
    subscriber_emails: set[str] = set()
    skipped = 0
    for sub in subscribers:
        email, month = sub["email"], sub["cohort_month"]
        if not email or month is None:
            skipped += 1
            continue
        subscriber_emails.add(email)
        bucket = cohorts.setdefault(month, {"cohort_month": month, "size": 0, "buyers": 0, "_emails": set()})
        bucket["size"] += 1
        bucket["_emails"].add(email)
        if sub["is_buyer"] or email in revenue_by_email:
            bucket["buyers"] += 1

    unmatched = sum(1 for email in revenue_by_email if email not in subscriber_emails)

    rows: list[dict] = []
    for month in sorted(cohorts):
        bucket = cohorts[month]
        buyers = bucket["buyers"]
        revenue = round(sum(revenue_by_email.get(e, 0.0) for e in bucket["_emails"]), 2)
        rows.append({
            "cohort_month": month,
            "size": bucket["size"],
            "buyers": buyers,
            "conversion_rate_pct": round(buyers / bucket["size"] * 100, 1) if bucket["size"] else 0.0,
            "total_revenue": revenue,
            "ltv_per_buyer": round(revenue / buyers, 2) if buyers else 0.0,
        })

    totals = {
        "total_subscribers": sum(r["size"] for r in rows),
        "total_buyers": sum(r["buyers"] for r in rows),
        "total_revenue": round(sum(r["total_revenue"] for r in rows), 2),
        "unmatched_sales_emails": unmatched,
        "skipped_subscribers": skipped,
    }
    return rows, totals


def render_table(rows: list[dict]) -> str:
    """Console pivot table: 'cohort month | size | buyers | conv% | LTV'."""
    table: list[tuple[str, ...]] = [("cohort month", "size", "buyers", "conv%", "LTV")]
    for r in rows:
        table.append((
            r["cohort_month"],
            str(r["size"]),
            str(r["buyers"]),
            f"{r['conversion_rate_pct']:.1f}%",
            f"${r['ltv_per_buyer']:.2f}",
        ))
    widths = [max(len(t[i]) for t in table) for i in range(len(table[0]))]
    align = ("<", ">", ">", ">", ">")  # cohort month left, metrics right-aligned
    lines = [
        " | ".join(
            t[i].ljust(widths[i]) if align[i] == "<" else t[i].rjust(widths[i])
            for i in range(len(widths))
        )
        for t in table
    ]
    lines.insert(1, "-+-".join("-" * w for w in widths))
    return "\n".join(lines)


def build_payload(rows: list[dict], totals: dict, report_date: str, dry_run: bool) -> dict:
    """Cohort summary JSON for the Make.com -> Sheets pipeline."""
    return {
        "source": "cohort-analysis",
        "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "report_date": report_date,
        "currency": "USD",  # repo apps are priced in USD
        "cohorts": rows,
        **totals,
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
        "User-Agent": "cohort-analysis/1.0",
    }
    if secret:
        headers["X-Webhook-Signature"] = sign_payload(body, secret)
    request = Request(url, data=body, headers=headers, method="POST")
    with urlopen(request, timeout=30) as response:
        return response.status


def write_log(payload: dict) -> Path:
    """Persist the summary under logs/cohort-analysis-YYYY-MM-DD.json."""
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / f"cohort-analysis-{payload['report_date']}.json"
    log_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return log_path


def write_csv(rows: list[dict], report_date: str) -> Path:
    """Persist the pivot table under logs/cohort-analysis-YYYY-MM-DD.csv."""
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    csv_path = LOG_DIR / f"cohort-analysis-{report_date}.csv"
    with csv_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["cohort_month", "size", "buyers", "conversion_rate_pct",
                         "total_revenue", "ltv_per_buyer"])
        for r in rows:
            writer.writerow([r["cohort_month"], r["size"], r["buyers"],
                             r["conversion_rate_pct"], r["total_revenue"], r["ltv_per_buyer"]])
    return csv_path


# --- Embedded sample data for --selftest (no network calls) ---

_SAMPLE_SUBSCRIBERS = """email,subscribe_date,status
ana@example.com,2026-01-05,active
bruno@example.com,2026-01-12,active
carla@example.com,2026-01-20,active
diego@example.com,2026-07-02,active
elena@example.com,2026-07-15,active
"""

_SAMPLE_SALES = """email,amount,date
ana@example.com,$30,2026-02-01
bruno@example.com,50,2026-02-03
diego@example.com,US$20,2026-08-01
zoe@unknown.com,99,2026-02-10
"""

# Variant column names: 'E-mail' (hyphen), 'Created At', Spanish 'Estado',
# plus a purchase custom field marking a buyer without a sales row.
_SAMPLE_SUBSCRIBERS_VARIANT = """E-mail,Created At,Estado,last_purchase_date
fatima@example.com,2026/03/08,active,
gonzalo@example.com,2026-03-21,active,2026-04-01
"""

# A purchase timestamp alone is NOT a subscribe date: the row is skipped.
_SAMPLE_SUBSCRIBERS_NO_DATE = """email,last_purchase_date
hugo@example.com,2026-05-01
"""


def run_selftest() -> None:
    """Verify cohort math + payload build + HMAC round-trip on embedded samples."""
    print("SELFTEST: cohort-analysis embedded sample verification")

    # 1. Primary sample: 3 subscribers in 2026-01 of whom 2 bought ($30 + $50)
    #    -> cohort 2026-01: size=3, buyers=2, conv=66.7%, LTV=$40.
    subs = _parse_subscribers_text(_SAMPLE_SUBSCRIBERS)
    sales = _parse_sales_text(_SAMPLE_SALES)
    rows, totals = compute_cohorts(subs, sales)
    by_month = {r["cohort_month"]: r for r in rows}
    assert by_month["2026-01"]["size"] == 3, f"size {by_month['2026-01']['size']} != 3"
    assert by_month["2026-01"]["buyers"] == 2, f"buyers {by_month['2026-01']['buyers']} != 2"
    assert by_month["2026-01"]["conversion_rate_pct"] == 66.7
    assert by_month["2026-01"]["total_revenue"] == 80.00
    assert by_month["2026-01"]["ltv_per_buyer"] == 40.00
    assert by_month["2026-07"]["size"] == 2
    assert by_month["2026-07"]["buyers"] == 1
    assert by_month["2026-07"]["conversion_rate_pct"] == 50.0
    assert by_month["2026-07"]["total_revenue"] == 20.00
    assert by_month["2026-07"]["ltv_per_buyer"] == 20.00
    assert totals["unmatched_sales_emails"] == 1  # zoe@unknown.com has no cohort
    assert totals["total_subscribers"] == 5
    assert totals["total_buyers"] == 3
    assert totals["total_revenue"] == 100.00
    print("PASS: primary sample (2026-01: size=3 buyers=2 conv=66.7% LTV=$40"
          " vs 2026-07: size=2 buyers=1 conv=50.0% LTV=$20)")
    print(render_table(rows))

    # 2. Variant columns + buyer via purchase field + zero-revenue buyer
    vsubs = _parse_subscribers_text(_SAMPLE_SUBSCRIBERS_VARIANT)
    vrows, vtotals = compute_cohorts(vsubs, [])
    vby = {r["cohort_month"]: r for r in vrows}
    assert vby["2026-03"]["size"] == 2
    assert vby["2026-03"]["buyers"] == 1  # gonzalo via last_purchase_date
    assert vby["2026-03"]["conversion_rate_pct"] == 50.0
    assert vby["2026-03"]["total_revenue"] == 0.00  # no sales rows -> graceful 0
    assert vby["2026-03"]["ltv_per_buyer"] == 0.00
    assert vtotals["skipped_subscribers"] == 0
    print("PASS: variant columns (E-mail, Created At) + purchase-field buyer + zero-revenue LTV")

    # 3. Purchase timestamp alone is not a subscribe date -> row skipped
    nsubs = _parse_subscribers_text(_SAMPLE_SUBSCRIBERS_NO_DATE)
    nrows, ntotals = compute_cohorts(nsubs, [])
    assert nrows == []
    assert ntotals["skipped_subscribers"] == 1
    print("PASS: purchase date never misread as subscribe date (row skipped)")

    # 4. Payload build
    payload = build_payload(rows, totals, "2026-09-22", dry_run=True)
    assert payload["source"] == "cohort-analysis"
    assert payload["report_date"] == "2026-09-22"
    assert payload["total_revenue"] == 100.00
    assert payload["total_subscribers"] == 5
    assert payload["dry_run"] is True
    assert len(payload["cohorts"]) == 2
    print("PASS: payload build")

    # 5. HMAC round-trip (timing-safe compare, webhook-receiver.js conventions)
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
        description="MailerLite export -> monthly cohort pivot tables (task 2.6.4).",
    )
    parser.add_argument("--subscribers",
                        help="MailerLite subscribers export CSV (overrides COHORT_SUBSCRIBERS_CSV)")
    parser.add_argument("--sales",
                        help="Sales/conversions CSV with email, amount, date (overrides COHORT_SALES_CSV)")
    parser.add_argument("--dry-run", "--dryrun", dest="dry_run", action="store_true",
                        help="Build and print the pivot table; skip the webhook POST")
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
    subscribers_arg = (args.subscribers or os.environ.get("COHORT_SUBSCRIBERS_CSV", "")).strip()
    sales_arg = (args.sales or os.environ.get("COHORT_SALES_CSV", "")).strip()
    webhook_url = os.environ.get("COHORT_WEBHOOK_URL", "").strip()
    secret = os.environ.get("COHORT_WEBHOOK_SECRET", "").strip() or None

    report_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    # Subscribers CSV: required in every mode (an empty cohort pivot is meaningless).
    if not subscribers_arg:
        print("ERROR: COHORT_SUBSCRIBERS_CSV is not set.")
        print("       Export the subscribers CSV from MailerLite (Subscribers -> Export CSV),")
        print("       set COHORT_SUBSCRIBERS_CSV in .env (see .env.example) or pass --subscribers.")
        sys.exit(1)
    subscribers_path = Path(subscribers_arg)
    if not subscribers_path.is_file():
        print(f"ERROR: subscribers CSV not found: {subscribers_path}")
        sys.exit(1)

    # Sales CSV: optional; an explicitly configured path that is missing is an error.
    sales: list[dict] = []
    if sales_arg:
        sales_path = Path(sales_arg)
        if not sales_path.is_file():
            print(f"ERROR: sales CSV not found: {sales_path}")
            sys.exit(1)
        sales = load_sales(sales_path)

    # Webhook target: required for a real run (the POST is the point of the run).
    if not webhook_url and not dry_run:
        print("ERROR: COHORT_WEBHOOK_URL is not set.")
        print("       Set it in .env (Make.com scenario URL) or use --dry-run to preview without POSTing.")
        sys.exit(1)

    subscribers = load_subscribers(subscribers_path)
    if not subscribers:
        print(f"WARN: no subscriber rows found in {subscribers_path}")

    rows, totals = compute_cohorts(subscribers, sales)
    payload = build_payload(rows, totals, report_date, dry_run)

    print(render_table(rows))
    print(json.dumps(payload, ensure_ascii=False, indent=2))

    json_path = write_log(payload)
    csv_path = write_csv(rows, report_date)
    print(f"LOG: pivot written to {json_path} + {csv_path}")

    if dry_run:
        print("DRY-RUN: pivot built (above); POST skipped.")
        return

    status = post_webhook(webhook_url, payload, secret)
    print(f"OK: POSTed to {webhook_url} (HTTP {status})" + (" [HMAC signed]" if secret else ""))


if __name__ == "__main__":
    main()
