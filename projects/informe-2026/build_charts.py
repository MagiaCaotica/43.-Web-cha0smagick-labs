import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

ROOT = Path(r"D:\Paginas web\Cha0smagick Labs\43.-Web-cha0smagick-labs")
DATA = json.loads((ROOT / "projects" / "informe-2026" / "data.json").read_text(encoding="utf-8"))
OUT = ROOT / "projects" / "informe-2026" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

GOLD = "#8a6a2f"
INK = "#1d1d1d"
GREY = "#9a9a9a"
BG = "#ffffff"
plt.rcParams.update({
    "font.family": "DejaVu Sans",
    "font.size": 9,
    "axes.edgecolor": "#cccccc",
    "axes.labelcolor": INK,
    "text.color": INK,
    "xtick.color": "#555555",
    "ytick.color": "#555555",
    "figure.facecolor": BG,
    "axes.facecolor": BG,
})

MONTHS = {"2026-05": "may", "2026-06": "jun", "2026-07": "jul", "2026-08": "ago",
          "2026-09": "sep", "2026-10": "oct", "2026-11": "nov*"}


def save(fig, name):
    fig.tight_layout()
    fig.savefig(OUT / name, dpi=200, bbox_inches="tight")
    plt.close(fig)


# 1. Busqueda: impresiones vs clics
d = DATA["gsc_monthly"]
labels = [MONTHS.get(x["month"], x["month"]) for x in d]
impr = [x["impressions"] for x in d]
clicks = [x["clicks"] for x in d]
fig, ax1 = plt.subplots(figsize=(7.2, 3.1))
ax1.bar(labels, impr, color="#e8dcc2", edgecolor="#d8c9a4", label="Impresiones")
ax1.set_ylabel("Impresiones")
ax1.yaxis.set_major_formatter(FuncFormatter(lambda v, p: f"{v:,.0f}"))
ax2 = ax1.twinx()
ax2.plot(labels, clicks, color=GOLD, marker="o", linewidth=2, label="Clics")
ax2.set_ylabel("Clics")
ax1.set_title("Search Console: la superficie indexada empieza a rendir", loc="left", fontsize=10, color=INK)
h1, l1 = ax1.get_legend_handles_labels()
h2, l2 = ax2.get_legend_handles_labels()
ax1.legend(h1 + h2, l1 + l2, frameon=False, loc="upper left")
ax1.text(0, -0.22, "* noviembre: 17 dias. Fuente: Google Search Console, propiedad sc-domain:cha0smagicklabs.com",
         transform=ax1.transAxes, fontsize=7, color=GREY)
save(fig, "gsc.png")

# 2. Sesiones GA4 por mes
d = DATA["ga4_monthly"]
labels = [MONTHS.get(f"{x['month'][:4]}-{x['month'][4:]}", x["month"]) for x in d]
vals = [x["sessions"] for x in d]
fig, ax = plt.subplots(figsize=(7.2, 2.8))
ax.bar(labels, vals, color=GOLD)
for i, v in enumerate(vals):
    ax.text(i, v + max(vals) * 0.02, f"{v:,}", ha="center", fontsize=8, color="#555555")
ax.set_ylabel("Sesiones")
ax.set_title("Sesiones mensuales (GA4)", loc="left", fontsize=10)
ax.spines[["top", "right"]].set_visible(False)
ax.text(0, -0.22, "* noviembre: 19 dias. Fuente: GA4, propiedad 521860259.",
        transform=ax.transAxes, fontsize=7, color=GREY)
save(fig, "ga4.png")

# 3. Embudo de 28 dias
steps = [("Sesiones", 607), ("Vio un producto", 129), ("Vio la ficha", 82),
         ("Clic de salida", 26), ("Clic de compra", 12), ("Venta registrada", 1)]
names = [s[0] for s in steps][::-1]
vals = [s[1] for s in steps][::-1]
fig, ax = plt.subplots(figsize=(7.2, 3.0))
bars = ax.barh(names, vals, color=["#c9b48a", "#d8c9a4", "#e8dcc2", "#efe6d2", "#f5eee0", GOLD])
for b, v in zip(bars, vals):
    ax.text(b.get_width() + 8, b.get_y() + b.get_height() / 2, f"{v:,}", va="center", fontsize=9)
ax.set_xlim(0, 700)
ax.set_title("Embudo de 28 dias: donde se pierde la venta", loc="left", fontsize=10)
ax.spines[["top", "right", "bottom"]].set_visible(False)
ax.set_xticks([])
ax.text(0, -0.18, "Sesion -> clic de compra: 1,98 %. Clic de compra -> venta: 8,3 %. Fuente: GA4 + Hotmart.",
        transform=ax.transAxes, fontsize=7, color=GREY)
save(fig, "funnel.png")

# 4. Canales
d = DATA["ga4_channels_28d"]
d = [x for x in d if x["sessions"] >= 4]
fig, ax = plt.subplots(figsize=(7.2, 2.6))
ax.barh([x["channel"] for x in d][::-1], [x["sessions"] for x in d][::-1], color=GOLD)
for i, x in enumerate(d[::-1]):
    ax.text(x["sessions"] + 4, i, str(x["sessions"]), va="center", fontsize=8)
ax.set_xlim(0, max(x["sessions"] for x in d) * 1.18)
ax.set_title("Sesiones por canal (28 dias)", loc="left", fontsize=10)
ax.spines[["top", "right", "bottom"]].set_visible(False)
ax.set_xticks([])
save(fig, "channels.png")

# 5. Ventas Hotmart por mes y producto
sales = [s for s in DATA["hotmart_sales"] if s["status"] == "COMPLETE"]
by_month = {}
for s in sales:
    by_month[s["date"][:7]] = by_month.get(s["date"][:7], 0) + 1
months = sorted(by_month)
fig, ax = plt.subplots(figsize=(7.2, 2.6))
ax.bar([MONTHS.get(m, m) for m in months], [by_month[m] for m in months], color=GOLD)
for i, m in enumerate(months):
    ax.text(i, by_month[m] + 0.05, str(by_month[m]), ha="center", fontsize=8)
ax.set_ylim(0, max(by_month.values()) + 1)
ax.set_yticks(range(0, max(by_month.values()) + 2))
ax.set_ylabel("Ventas")
ax.set_title("Ventas verificadas en Hotmart por mes (2026)", loc="left", fontsize=10)
ax.spines[["top", "right"]].set_visible(False)
save(fig, "sales.png")

print("charts:", len(list(OUT.glob("*.png"))))
