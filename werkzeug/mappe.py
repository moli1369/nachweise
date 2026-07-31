#!/usr/bin/env python3
"""Erzeugt die Zertifikatsmappe: Deckblatt, Inhaltsverzeichnis, Nachweise.

    pip install reportlab pypdf
    python3 werkzeug/mappe.py

Neue Nachweise werden in POSTEN eingetragen; die Reihenfolge dort ist die
Reihenfolge in der Mappe.
"""
import io
import pathlib

from pypdf import PdfReader, PdfWriter
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas

WURZEL = pathlib.Path(__file__).resolve().parent.parent

POSTEN = [
    ("Microsoft Azure Administration",   "TOSINSO",       "Oktober 2023",  "TCN-0005439", "azure-administration.pdf"),
    ("Microsoft Azure Fundamentals",     "TOSINSO",       "Oktober 2023",  "TCN-0005438", "azure-fundamentals.pdf"),
    ("MCSA Windows Server 2022",         "TOSINSO",       "Mai 2023",      "TCN-0004102", "mcsa-windows-server.pdf"),
    ("LPIC 2 — Linux Engineer",          "TOSINSO",       "Mai 2023",      "TCN-0004153", "lpic-2.pdf"),
    ("LPIC 1 — Linux Administrator",     "TOSINSO",       "Mai 2023",      "TCN-0004152", "lpic-1.pdf"),
    ("LPI Linux Essentials",             "TOSINSO",       "Mai 2023",      "TCN-0004151", "linux-essentials.pdf"),
    ("Cisco CCNA 200-301",               "Maktabkhooneh", "Mai 2023",      "MK-PECLJ0",   "ccna.pdf"),
    ("Advanced Python Programming",      "Maktabkhooneh", "Januar 2023",   "MK-GY99YX",   "python-fortgeschritten.pdf"),
    ("Python Programming for Beginners", "Maktabkhooneh", "Dezember 2022", "MK-CA7JM5",   "python-grundlagen.pdf"),
]

VORSPANN = [
    "Diese Mappe bündelt neun Kursabschlüsse der iranischen Bildungsplattformen",
    "TOSINSO und Maktabkhooneh aus den Jahren 2022 und 2023.",
    "",
    "Prüfungszentren für Herstellerzertifizierungen waren im Iran nicht verfügbar.",
    "Die Kurse ordnen eine Praxis, die zu diesem Zeitpunkt bereits mehrere Jahre lief.",
    "Die AZ-104-Prüfung lege ich in Deutschland ab.",
]


def deckblatt():
    puffer = io.BytesIO()
    c = canvas.Canvas(puffer, pagesize=A4)
    breite, hoehe = A4
    links = 25 * mm

    c.setFillColorRGB(.09, .11, .12)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(links, hoehe - 45 * mm, "Zertifikatsmappe")
    c.setFont("Helvetica", 13)
    c.setFillColorRGB(.36, .39, .37)
    c.drawString(links, hoehe - 56 * mm, "Mohammad Askari Dehestani")
    c.setFont("Helvetica", 10)
    c.drawString(links, hoehe - 63 * mm,
                 "Systemadministrator · Netzwerk und IT-Infrastruktur · Nürnberg-Erlangen")

    c.setStrokeColorRGB(.81, .78, .72)
    c.setLineWidth(.6)
    c.line(links, hoehe - 72 * mm, breite - links, hoehe - 72 * mm)

    c.setFont("Helvetica", 9.5)
    text = c.beginText(links, hoehe - 84 * mm)
    text.setLeading(14)
    for zeile in VORSPANN:
        text.textLine(zeile)
    c.drawText(text)

    c.setFillColorRGB(.09, .11, .12)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(links, hoehe - 118 * mm, "Inhalt")

    y = hoehe - 128 * mm
    for i, (titel, anbieter, datum, nummer, _) in enumerate(POSTEN, 1):
        c.setFillColorRGB(.09, .11, .12)
        c.setFont("Helvetica", 10)
        c.drawString(links, y, f"{i}.")
        c.drawString(links + 8 * mm, y, titel)
        c.setFillColorRGB(.36, .39, .37)
        c.setFont("Helvetica", 8.5)
        c.drawString(links + 8 * mm, y - 4.6 * mm, f"{anbieter} · {datum} · Nr. {nummer}")
        c.setStrokeColorRGB(.88, .86, .81)
        c.setLineWidth(.4)
        c.line(links, y - 8 * mm, breite - links, y - 8 * mm)
        y -= 14 * mm

    c.setFillColorRGB(.53, .56, .54)
    c.setFont("Helvetica", 8)
    c.drawString(links, 20 * mm, "Stand: Juli 2026")
    c.showPage()
    c.save()
    puffer.seek(0)
    return puffer


def main():
    schreiber = PdfWriter()
    schreiber.append(PdfReader(deckblatt()))
    ordner = WURZEL / "assets/certificates"
    for *_, datei in POSTEN:
        schreiber.append(PdfReader(ordner / datei))

    ziel = WURZEL / "assets/docs/Zertifikatsmappe.pdf"
    with open(ziel, "wb") as f:
        schreiber.write(f)
    seiten = len(PdfReader(ziel).pages)
    print(f"{ziel.name}: {seiten} Seiten, {ziel.stat().st_size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
