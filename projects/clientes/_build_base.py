# -*- coding: utf-8 -*-
"""Compila la base de clientes/contactos: mails2.xlsx + mails3.txt, dedupe, clasifica."""
import re, json, csv, collections, os

OUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ---- mails2: 42 contactos nombrados (youtubers/canales) ----
xls = [
("El Grimorio de Riggs","necronomiconrelatos@gmail.com","ES"),
("King Frostmare","frostmarebiz@gmail.com","ES"),
("Jaime Maussan","contacto@tercermilenio.tv","ES"),
("Breakman","contacto.breakman@gmail.com","ES"),
("La habitacion oscura","relatosterror94@hotmail.com","ES"),
("Atraviesa lo desconocido","bresserito@hotmail.com","ES"),
("Viaje a lo desconocido","lashistoriasdeviajantes@gmail.com","ES"),
("Historias del Buho","historiasdelbuho@hotmail.com","ES"),
("Dross","representacionesdross@gmail.com","ES"),
("Contacto con la Ciencia","mianmu68@gmail.com","ES"),
("Viral Top","viraltop.contacto@gmail.com","ES"),
("The Odwin","theodwinyt@gmail.com","ES"),
("Los Mejores Top 10","losmejorestop10contacto@gmail.com","ES"),
("Magnus Mefisto","magnusmefisto17@gmail.com","ES"),
("Danny Phantom","dalizerdanyelo@gmail.com","ES"),
("Revelando el Velo","revelandoelvelo.correo@gmail.com","ES"),
("El Mundo DKBza","mihistoriadkb@gmail.com","ES"),
("Nastrastromacerus","natrastocrus1758@gmail.com","ES"),
("Your Everyday Theorist","youreverydaytheorist@gmail.com","EN"),
("Mindfuck w/ Patrick James","mindfkd@protonmail.com","EN"),
("Misterios Encurridos","misteriosencurridos@tierrademisterios.com","ES"),
("Top 5 Unknowns","top5unknowns@viralnationtalent.com","EN"),
("Ufovnis","gameforyou21@gmail.com","ES"),
("Ghost Vidz","top5ghostbusiness@gmail.com","EN"),
("Slapped Ham","slappedham@helmtalentgroup.com","EN"),
("Bug Buho","bugbuho@gmail.com","ES"),
("Disturban","disturban123@gmail.com","EN"),
("Goose Pimples","sponsorship@goosepimplesyt.com","EN"),
("El Doctualista","el.doct.mentalista@gmail.com","ES"),
("La Caja Negra","cajanegracorreos@gmail.com","ES"),
("Aura Tenebrosa","auratenebrosa@gmail.com","ES"),
("Canal del Crimen","alvaromatusm@gmail.com","ES"),
("Secure Team","secureteamnews@gmail.com","EN"),
("El Desconectado","contacto@eldesconectado.net","ES"),
("Finding UFO","contact@findingufo.tv","EN"),
("The Poltergeist Diaries","poltergeistdiaries@gmail.com","EN"),
("Pablo Barrera - Magia K","azanigra@protonmail.com","ES"),
("El Grimorio","analelgrimorio@gmail.com","ES"),
("Pedro Poch","pochpedro@outlook.es","ES"),
("BloodyMire","mbnebot@gmail.com","ES"),
("La Cripta de John Dee","jdoom@hotmail.es","ES"),
("Rabino Shimshon Kabbalah","deborah@kabbalahinstitute.com","EN"),
]

# ---------- mails3.txt: ~267 emails paranormal/ufo (grupos, podcasts, portales) ----------
emails3 = set()
raw = open(os.path.join(OUT_DIR, "mails3.txt"), encoding="utf-8", errors="replace").read()
for chunk in re.split(r"[,;\n]+", raw):
    m = re.search(r"[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}", chunk)
    if m:
        emails3.add(m.group(0).strip().lower())

# dedupe global
all_contacts = {}
for (nombre, correo, idioma) in xls:
    all_contacts[correo] = {"nombre": nombre, "idioma": idioma, "fuente": "mails2_nombrado", "tipo": "youtuber/canal"}
for e in emails3:
    if e in all_contacts:
        continue
    nombre = ""
    # infer name from local-part
    local = e.split("@")[0]
    nombre = local.replace(".", " ").replace("_", " ").replace("-", " ").title()
    all_contacts[e] = {"nombre": nombre, "idioma": "ES" if "the" not in local else "EN", "fuente": "mails3", "tipo": "grupo/portador/podcast"}

# type heuristic
def classify(e):
    dom = e.split("@")[1]
    local = e.split("@")[0]
    if e in all_contacts and all_contacts[e]["fuente"] == "mails2_nombrado":
        return all_contacts[e]["tipo"]
    if any(k in local for k in ["admin", "contact", "info", "support", "webmaster", "marketing", "sponsorship", "media"]):
        return "admin/media"
    if dom.endswith((".de", ".es", ".fr", ".it", ".at")) or dom in ("uetl", "unseen.is"):
        return "intl"
    return "grupo"

for e in all_contacts:
    all_contacts[e]["tipo"] = classify(e)

# write CSV
with open(os.path.join(OUT_DIR, "base-clientes.csv"), "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["email", "nombre", "idioma", "tipo", "fuente"])
    for e in sorted(all_contacts):
        c = all_contacts[e]
        w.writerow([e, c["nombre"], c["idioma"], c["tipo"], c["fuente"]])

by_src = collections.Counter(c["fuente"] for c in all_contacts.values())
by_type = collections.Counter(c["tipo"] for c in all_contacts.values())
by_lang = collections.Counter(c["idioma"] for c in all_contacts.values())
print("TOTAL CONTACTOS unificados:", len(all_contacts))
print("por fuente:", dict(by_src))
print("por tipo:", dict(by_type))
print("por idioma:", dict(by_lang))
print("archivo: clientes/clientes_receipt.csv")