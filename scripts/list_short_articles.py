#!/usr/bin/env python3
"""List all articles with <300 words that need expansion."""
import json

with open('scripts/audit_results_v2.json', encoding='utf-8') as f:
    results = json.load(f)

short = [r for r in results if r['words'] < 300]
print(f'Articles still SHORT (<300w): {len(short)}')
print()
for r in sorted(short, key=lambda x: x['words']):
    print(f'  {r["words"]:4d}w  {r["category"]:20s}  {r["slug"]}')
