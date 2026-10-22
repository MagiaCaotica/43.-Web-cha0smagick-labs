"""Acentua las palabras inequivocas de los articulos ES nuevos.

Solo toca texto fuera de atributos HTML. Lista curada: excluye homografos
ambiguos (que/como/mas contextual, practica, publica, solo, periodo).
Idempotente. Verifica que no quedan ocurrencias ni caracteres CJK.
Ejecutar despues de regenerar cualquier articulo ES con los builders.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

FILES = [
    "blog/es-black-friday-libros-ocultismo-2026.html",
    "blog/es-regalos-ocultismo-navidad-2026.html",
    "blog/es-mejores-apps-astrologia-android-2026.html",
    "blog/es-carta-natal-gratis-como-leerla.html",
    "blog/es-magia-del-caos-para-principiantes.html",
    "blog/calendario-estacional-magia-caos.html",
]

WORDS = {
    "mas": "más", "dias": "días", "dia": "día",
    "unico": "único", "unica": "única",
    "guia": "guía", "guias": "guías",
    "astrologia": "astrología",
    "metodo": "método", "metodos": "métodos",
    "cual": "cuál", "cuales": "cuáles",
    "articulo": "artículo", "articulos": "artículos",
    "sesion": "sesión",
    "intencion": "intención", "despues": "después",
    "version": "versión",
    "pagina": "página", "paginas": "páginas",
    "aqui": "aquí", "asi": "así",
    "numero": "número", "numeros": "números",
    "tambien": "también",
    "relacion": "relación",
    "ultimo": "último", "ultima": "última",
    "teoria": "teoría",
    "accion": "acción", "decision": "decisión", "eleccion": "elección",
    "energia": "energía", "emocion": "emoción",
    "comparacion": "comparación", "aplicacion": "aplicación",
    "rapido": "rápido", "basico": "básico", "magico": "mágico",
    "util": "útil", "facil": "fácil",
    "informacion": "información", "meditacion": "meditación",
    "atencion": "atención", "conexion": "conexión",
    "explicacion": "explicación", "recomendacion": "recomendación",
    "descripcion": "descripción", "categoria": "categoría",
    "proximo": "próximo", "proxima": "próxima",
    "mitologia": "mitología", "psicologia": "psicología",
    "historico": "histórico", "automatico": "automático",
    "especifico": "específico", "tipico": "típico",
    "sabado": "sábado", "cancion": "canción", "corazon": "corazón",
    "resena": "reseña", "senal": "señal", "senalado": "señalado",
    "diseno": "diseño", "anos": "años", "ano": "año",
    "nino": "niño", "manana": "mañana", "espanol": "español",
    "astronomo": "astrónomo", "simbolico": "simbólico",
    "tecnica": "técnica", "tecnico": "técnico",
    "percepcion": "percepción", "creacion": "creación",
    "analisis": "análisis", "proposito": "propósito",
    "segun": "según", "opcion": "opción", "filosofia": "filosofía",
    "magicos": "mágicos",
}

# Homografos resueltos por contexto: solo en estas locuciones.
PHRASES = {
    "forma practica": "forma práctica",
    "la filosofia y la practica": "la filosofía y la práctica",
    "una practica": "una práctica",
    "tienes practica": "tienes práctica",
    "tratado practico": "tratado práctico",
    "filosofia y practica": "filosofía y práctica",
    "en la practica": "en la práctica",
    "ficha publica": "ficha pública",
    "sesion publica": "sesión pública",
}

ATTR = re.compile(r'\s[\w:-]+="[^"]*"')


def keep_case(src: str, dst: str) -> str:
    if src.isupper() and len(src) > 1:
        return dst.upper()
    if src[0].isupper():
        return dst[0].upper() + dst[1:]
    return dst


def fix_text(text: str) -> str:
    # "¿Que ..." / "¿Como ..." son interrogativos inequivocos.
    text = re.sub(r"(¿\s*)(Que|Como)\b", lambda m: m.group(1) + ("Qué" if m.group(2) == "Que" else "Cómo"), text)

    for src, dst in PHRASES.items():
        text = re.sub(re.escape(src), lambda m, d=dst: keep_case(m.group(0), d), text, flags=re.IGNORECASE)

    def rep(m):
        src = m.group(0)
        return keep_case(src, WORDS[src.lower()])

    pattern = re.compile(r"\b(" + "|".join(sorted(WORDS, key=len, reverse=True)) + r")\b", re.IGNORECASE)
    return pattern.sub(rep, text)


def process(path: Path) -> int:
    raw = path.read_text(encoding="utf-8")
    saved = []

    def stash(m):
        saved.append(m.group(0))
        return f"\x00{len(saved) - 1}\x00"

    out = ATTR.sub(stash, raw)
    out = fix_text(out)
    out = re.sub(r"\x00(\d+)\x00", lambda m: saved[int(m.group(1))], out)
    if out != raw:
        path.write_text(out, encoding="utf-8")
    return len(re.findall(r"[áéíóúñÁÉÍÓÚÑ]", out))


def main() -> int:
    total = 0
    for rel in FILES:
        p = ROOT / rel
        n = process(p)
        total += n
        print(f"{rel}: {n} acentos")
    cjk = 0
    for rel in FILES:
        cjk += len(re.findall(r"[\u4e00-\u9fff\u0400-\u04ff]", (ROOT / rel).read_text(encoding="utf-8")))
    print(f"TOTAL acentos={total} cjk={cjk}")
    return 1 if cjk else 0


if __name__ == "__main__":
    sys.exit(main())
