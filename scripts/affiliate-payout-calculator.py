#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
affiliate-payout-calculator.py — Calculadora de pagos de afiliados (plan 2.5.1, R8)

Funcionalidad:
- Lee un CSV de conversiones de afiliados (export de Make.com/Sheets o manual)
- Filtra solo conversiones con estado aprobada/completada (refunds se excluyen)
- Calcula comisión por afiliado según data/affiliate-rates.json
  (30% apps, 35% apps-bundle, 40% books-bundle, 35% complete-access, default 30%)
- Aplica mínimo de pago ($25 USD): comisión debajo → carryover al mes siguiente
- Genera reporte mensual (CSV + JSON en logs/) y tabla en consola
- POST opcional del resumen a Make.com (AFFILIATE_PAYOUT_WEBHOOK_URL → Sheets + email mensual)

Uso:
  python scripts/affiliate-payout-calculator.py --conversions data/affiliate-conversions.csv
  python scripts/affiliate-payout-calculator.py --conversions ... --dry-run
  python scripts/affiliate-payout-calculator.py --selftest

Variables de entorno:
  AFFILIATE_CONVERSIONS_CSV       — ruta del CSV de conversiones (alternativa a --conversions)
  AFFILIATE_PAYOUT_WEBHOOK_URL    — URL del escenario Make.com (Sheets + email mensual)
  AFFILIATE_PAYOUT_WEBHOOK_SECRET — secreto HMAC opcional (header X-Webhook-Signature: sha256=<hex>)
"""

import argparse
import csv
import hashlib
import hmac
import json
import os
import sys
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATES_PATH = os.path.join(ROOT, 'data', 'affiliate-rates.json')
LOGS_DIR = os.path.join(ROOT, 'logs')
VALID_STATUSES = {'approved', 'completed', 'aprobada', 'completada'}


def load_rates(path=RATES_PATH):
    """Carga las tasas de comisión desde data/affiliate-rates.json."""
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)


def parse_conversions(path):
    """Lee el CSV de conversiones; normaliza cabeceras; descarta filas inválidas."""
    rows = []
    skipped = 0
    with open(path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        for raw in reader:
            norm = {(k or '').strip().lower(): (v or '').strip() for k, v in raw.items()}
            email = norm.get('email') or norm.get('affiliate') or norm.get('affiliate_email') or ''
            product = (norm.get('product') or norm.get('product_slug') or '').strip().lower()
            status = (norm.get('status') or '').strip().lower()
            try:
                amount = float(norm.get('amount') or norm.get('price') or 0)
            except ValueError:
                amount = 0.0
            date = norm.get('date') or norm.get('purchase_date') or ''
            if not email or not product:
                skipped += 1
                continue
            rows.append({
                'affiliate': email,
                'product': product,
                'amount': amount,
                'date': date,
                'status': status,
            })
    return rows, skipped


def compute_payouts(conversions, rates):
    """Agrega por afiliado; comisión por fila = amount × rate(product)."""
    per = defaultdict(lambda: {'conversions': 0, 'gross': 0.0, 'commission': 0.0})
    rates_map = rates.get('rates', {})
    default_rate = float(rates.get('default_rate', 0.30))
    for row in conversions:
        status = (row['status'] or '').strip().lower()
        if status not in VALID_STATUSES:
            continue
        a = per[row['affiliate']]
        a['conversions'] += 1
        a['gross'] += row['amount']
        rate = float(rates_map.get(row['product'], default_rate))
        a['commission'] += row['amount'] * rate
    for a in per.values():
        a['gross'] = round(a['gross'], 2)
        a['commission'] = round(a['commission'], 2)
    return dict(per)


def apply_min_payout(payouts, min_usd):
    """Marca carryover para afiliados con comisión < mínimo de pago."""
    result = {}
    for email, stats in payouts.items():
        entry = dict(stats)
        entry['carryover'] = stats['commission'] < min_usd
        entry['payout'] = 0.0 if entry['carryover'] else stats['commission']
        result[email] = entry
    return result


def build_summary(payouts, month):
    """Resumen JSON para Sheets/Make.com."""
    payable = {e: s for e, s in payouts.items() if not s['carryover']}
    carryover = {e: s for e, s in payouts.items() if s['carryover']}
    return {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'month': month,
        'total_payout': round(sum(s['payout'] for s in payable.values()), 2),
        'affiliates_payable': payable,
        'affiliates_carryover': carryover,
    }


def post_webhook(summary, url, secret=None):
    """POST del resumen a Make.com con HMAC opcional (X-Webhook-Signature)."""
    body = json.dumps(summary, ensure_ascii=False).encode('utf-8')
    headers = {'Content-Type': 'application/json'}
    if secret:
        sig = hmac.new(secret.encode('utf-8'), body, hashlib.sha256).hexdigest()
        headers['X-Webhook-Signature'] = f'sha256={sig}'
    req = urllib.request.Request(url, data=body, headers=headers, method='POST')
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status


def write_report(summary, logs_dir=LOGS_DIR):
    """Escribe el reporte mensual CSV + JSON en logs/."""
    os.makedirs(logs_dir, exist_ok=True)
    json_path = os.path.join(logs_dir, f"affiliate-payout-{summary['month']}.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    csv_path = os.path.join(logs_dir, f"affiliate-payout-{summary['month']}.csv")
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        w = csv.writer(f)
        w.writerow(['affiliate', 'conversions', 'gross', 'commission', 'carryover', 'payout'])
        for email, s in sorted(summary['affiliates_payable'].items()):
            w.writerow([email, s['conversions'], s['gross'], s['commission'], 'no', s['payout']])
        for email, s in sorted(summary['affiliates_carryover'].items()):
            w.writerow([email, s['conversions'], s['gross'], s['commission'], 'yes', 0])
    return json_path, csv_path


def print_table(summary):
    """Tabla de pagos en consola."""
    print(f"\n{'Afiliado':<36} {'Conv':>5} {'Bruto':>10} {'Comisión':>10} {'Estado':>10} {'Pago':>10}")
    print('-' * 86)
    for email, s in sorted(summary['affiliates_payable'].items()):
        print(f"{email:<36} {s['conversions']:>5} {s['gross']:>10.2f} {s['commission']:>10.2f} {'pagable':>10} {s['payout']:>10.2f}")
    for email, s in sorted(summary['affiliates_carryover'].items()):
        print(f"{email:<36} {s['conversions']:>5} {s['gross']:>10.2f} {s['commission']:>10.2f} {'carryover':>10} {0.0:>10.2f}")
    print(f"\nTotal a pagar {summary['month']}: ${summary['total_payout']:.2f}")


def selftest():
    """Auto-test con datos embebidos: verifica rates, filtros, mínimo y carryover."""
    rates = {
        'rates': {'apps': 0.30, 'apps-bundle': 0.35, 'books-bundle': 0.40, 'complete-access': 0.35},
        'default_rate': 0.30,
        'min_payout_usd': 25,
    }
    sample = [
        {'affiliate': 'a@example.com', 'product': 'apps', 'amount': 3.99, 'date': '2026-09-01', 'status': 'approved'},
        {'affiliate': 'a@example.com', 'product': 'books-bundle', 'amount': 19.99, 'date': '2026-09-02', 'status': 'approved'},
        {'affiliate': 'a@example.com', 'product': 'apps', 'amount': 3.99, 'date': '2026-09-03', 'status': 'refunded'},
        {'affiliate': 'b@example.com', 'product': 'complete-access', 'amount': 20.00, 'date': '2026-09-04', 'status': 'completed'},
        {'affiliate': 'b@example.com', 'product': 'books-bundle', 'amount': 20.00, 'date': '2026-09-05', 'status': 'APPROVED'},
        {'affiliate': 'b@example.com', 'product': 'apps-bundle', 'amount': 30.00, 'date': '2026-09-06', 'status': 'completed'},
    ]
    payouts = compute_payouts(sample, rates)
    # a: (3.99*0.30 + 19.99*0.40) = 1.197 + 7.996 = 9.19 (refunded excluido)
    assert payouts['a@example.com']['conversions'] == 2, payouts
    assert payouts['a@example.com']['commission'] == 9.19, payouts
    # b: (20*0.35 + 20*0.40 + 30*0.35) = 7 + 8 + 10.5 = 25.5 (status APPROVED normalizado)
    assert payouts['b@example.com']['conversions'] == 3, payouts
    assert payouts['b@example.com']['commission'] == 25.5, payouts
    final = apply_min_payout(payouts, rates['min_payout_usd'])
    assert final['a@example.com']['carryover'] is True and final['a@example.com']['payout'] == 0.0
    assert final['b@example.com']['carryover'] is False and final['b@example.com']['payout'] == 25.5
    summary = build_summary(final, '2026-09')
    assert summary['total_payout'] == 25.5, summary
    print('selftest OK — rates por producto, filtro refunded, normalización de status, mínimo de pago y carryover verificados')
    return 0


def main():
    parser = argparse.ArgumentParser(description='Calculadora de pagos de afiliados (plan 2.5.1)')
    parser.add_argument('--conversions', help='CSV de conversiones (default: env AFFILIATE_CONVERSIONS_CSV)')
    parser.add_argument('--month', help='Mes del reporte YYYY-MM (default: mes actual UTC)')
    parser.add_argument('--dry-run', action='store_true', help='Genera reporte sin POST a Make.com')
    parser.add_argument('--selftest', action='store_true', help='Auto-test con datos embebidos (sin red)')
    args = parser.parse_args()

    if args.selftest:
        sys.exit(selftest())

    src = args.conversions or os.environ.get('AFFILIATE_CONVERSIONS_CSV')
    if not src:
        print('ERROR: falta el CSV de conversiones (--conversions o env AFFILIATE_CONVERSIONS_CSV)', file=sys.stderr)
        sys.exit(2)

    rates = load_rates()
    rows, skipped = parse_conversions(src)
    if not rows:
        print('ERROR: 0 conversiones válidas en el CSV', file=sys.stderr)
        sys.exit(2)
    if skipped:
        print(f'aviso: {skipped} filas inválidas descartadas')

    month = args.month or datetime.now(timezone.utc).strftime('%Y-%m')
    payouts = apply_min_payout(compute_payouts(rows, rates), float(rates.get('min_payout_usd', 25)))
    summary = build_summary(payouts, month)
    json_path, csv_path = write_report(summary)
    print_table(summary)
    print(f'\nreporte: {json_path}')
    print(f'reporte: {csv_path}')

    webhook_url = os.environ.get('AFFILIATE_PAYOUT_WEBHOOK_URL')
    if args.dry_run:
        print('dry-run: POST a Make.com omitido')
    elif webhook_url:
        status = post_webhook(summary, webhook_url, os.environ.get('AFFILIATE_PAYOUT_WEBHOOK_SECRET'))
        print(f'webhook Make.com: HTTP {status}')
    else:
        print('aviso: AFFILIATE_PAYOUT_WEBHOOK_URL no configurado — reporte solo local')


if __name__ == '__main__':
    main()
