"""Replaces the fix_h1 placeholder in rewrite_apps.py with a real implementation."""
import pathlib
import re

path = pathlib.Path(__file__).resolve().parent / "rewrite_apps.py"
src = path.read_text(encoding="utf-8")

old_start = src.index("def fix_h1(html: str) -> str:")
old_end = src.index("def main() -> int:")

new = '''def fix_h1(html: str) -> str:
    """El <h1> de las paginas de app dice hoy el nombre del sitio.

    Lo cambiamos por el nombre real de la app, que vive en el <h2> de
    div.detail-header-info. Se quitan las etiquetas internas del h2 (badges NEW!)
    y se deja solo el texto del nombre.
    """
    m = re.search(r"<h1([^>]*)>(.*?)</h1>", html, re.S)
    if not m:
        return html
    if "Cha0smagick Labs" not in m.group(2):
        return html

    header = re.search(
        r'<div class="detail-header-info">(.*?)</div>', html, re.S
    )
    if not header:
        return html
    h2 = re.search(r"<h2[^>]*>(.*?)</h2>", header.group(1), re.S)
    if not h2:
        return html

    # texto plano del h2, sin etiquetas internas
    plain = re.sub(r"<[^>]+>", " ", h2.group(1))
    plain = re.sub(r"\\s+", " ", plain).strip()
    # el h2 suele traer un subtitulo tras ": " o " | "; nos quedamos con la parte
    # que precede al separador cuando el resultado sigue siendo un nombre corto
    head = re.split(r"\\s*[::|]\\s*", plain)[0].strip()
    name = head if 2 <= len(head) <= 60 else plain
    if not name:
        return html

    # reconstruye el h1 conservando sus atributos y cualquier clase interna
    inner = re.sub(r"<[^>]+>", "", m.group(2)).strip()
    prefix = re.match(r"^(.*?Cha0smagick Labs)", inner, re.S)
    lead = prefix.group(1).strip() if prefix else ""
    text = f"{lead} {name}".strip() if lead else name
    text = re.sub(r"\\s+", " ", text).strip()
    if lead:
        text = f"{lead} \\u2014 {name}"

    return html[: m.start()] + f"<h1{m.group(1)}>{text}</h1>" + html[m.end() :]


'''

src = src[:old_start] + new + src[old_end:]
path.write_text(src, encoding="utf-8")
print("fix_h1 implemented")
