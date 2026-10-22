#!/usr/bin/env python3
"""Saca el renderizador de js/atomic-tools.js para ver como monta la interfaz."""
import re
from pathlib import Path

s = Path("js/atomic-tools.js").read_text(encoding="utf-8", errors="ignore")

for nombre in ["function fieldMarkup", "function control", "function renderForm", "function renderResult",
               "function showError", "function mount", "function track", "function store", "function load"]:
    i = s.find(nombre)
    if i < 0:
        print(f"--- {nombre}: NO ENCONTRADA")
        continue
    # hasta la siguiente funcion de primer nivel
    j = s.find("\nfunction ", i + 10)
    if j < 0:
        j = i + 2600
    bloque = s[i:j]
    print(f"--- {nombre}  ({len(bloque)} chars)")
    print("\n".join("    " + l for l in bloque.split("\n")[:34]))
    print()
