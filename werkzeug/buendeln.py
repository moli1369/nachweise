#!/usr/bin/env python3
"""Bündelt Stylesheet, Skripte und Szene in eine einzelne HTML-Datei.

    python3 werkzeug/buendeln.py

Ergebnis: einzeldatei.html im Projektordner. Diese Fassung öffnet sich
per Doppelklick, weil sie ohne fetch auskommt.
"""
import re
import pathlib

wurzel = pathlib.Path(__file__).resolve().parent.parent

html = (wurzel / "index.html").read_text(encoding="utf-8")
css = (wurzel / "assets/css/style.css").read_text(encoding="utf-8")
inhalte = (wurzel / "assets/js/inhalte.js").read_text(encoding="utf-8")
app = (wurzel / "assets/js/app.js").read_text(encoding="utf-8")
svg = (wurzel / "assets/img/szene.svg").read_text(encoding="utf-8")
svg = re.sub(r"<\?xml[^>]*\?>\s*", "", svg).strip()

html = html.replace(
    '<link rel="stylesheet" href="assets/css/style.css">',
    "<style>\n" + css + "\n</style>")
html = html.replace('<div id="szene"></div>', '<div id="szene">\n' + svg + "\n</div>")

# Die Szene steht bereits im Dokument, das Nachladen entfällt.
app = app.replace("szeneLaden();", "szeneVerdrahten();")
app = re.sub(r"async function szeneLaden\(\) \{.*?\n\}\n", "", app, flags=re.S)

html = html.replace(
    '<script src="assets/js/inhalte.js"></script>\n<script src="assets/js/app.js"></script>',
    "<script>\n" + inhalte + "\n" + app + "\n</script>")

ziel = wurzel / "einzeldatei.html"
ziel.write_text(html, encoding="utf-8")
print(f"{ziel.name} geschrieben, {len(html) / 1024:.0f} kB")
