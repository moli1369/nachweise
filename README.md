# Nachweise und Projekte — Mohammad Askari Dehestani

Eine einseitige Website, die meine Bewerbungsunterlagen ergänzt. Der
Lebenslauf muss auf zwei Seiten passen; Kursnachweise, Projektdetails und
Ausrüstungslisten passen dort nicht hinein, sind für eine fachliche
Einschätzung aber oft genau das Interessante. Diese Seite trägt das nach.

**Live:** https://moli1369.github.io/nachweise/

## Aufbau

Die Seite ist bewusst kurz: sie passt ohne Scrollen auf einen Schirm. Die
gemalte Szene trägt das Layout, alle Angaben öffnen sich als Tafel — durch
Antippen eines Anlagenteils im Bild oder über die Leiste darunter.

Der Rechner des Technikers öffnet zwei mitlaufende Konsolen: links die
Cisco-Seite der Strecke mit ihrer OSPF-Nachbarschaft, rechts das
MikroTik-Gegenüber beim Ausrichten der Antenne. Die Befehle sind echt, und
der Signalwert im Bild stammt aus derselben Sitzung.

## Technik

Handgeschriebenes HTML, CSS und SVG. Kein Framework, kein Build-Schritt,
keine Abhängigkeiten außer der Schrift von Google Fonts.

    index.html                Seitenstruktur
    assets/css/style.css      Gestaltung, ein Stylesheet mit CSS-Variablen
    assets/js/inhalte.js      sämtliche Texte auf Deutsch und Englisch
    assets/js/app.js          Sprachumschaltung, Tafeln, Szene
    assets/img/szene.svg      die Illustration, rund 30 kB
    assets/certificates/      die neun PDF-Nachweise
    assets/docs/              Lebenslauf, CV und Zertifikatsmappe

Die Illustration ist reines SVG mit Verläufen und Filtern — keine Bilddatei.
Dadurch bleibt die Seite unter 100 kB, skaliert verlustfrei und die
Anlagenteile lassen sich einzeln ansprechen.

Die Tiefenwirkung entsteht ohne 3D-Bibliothek: die Szene ist in vierzehn
Ebenen gestaffelt, die dem Zeiger unterschiedlich schnell folgen. Ferne Hügel
wandern mit, der Vordergrund läuft dagegen. Auf Touchgeräten und bei
`prefers-reduced-motion` bleibt das Bild ruhig.

Barrierefreiheit: Sprungmarke, sichtbarer Tastaturfokus, die Anlagenteile
sind per Tab erreichbar und mit Enter bedienbar, der Dialog schließt mit
Escape und gibt den Fokus zurück, `prefers-reduced-motion` wird respektiert.

## Zweisprachigkeit

Deutsch und Englisch. Die Sprache ergibt sich in dieser Reihenfolge aus
`?lang=de` beziehungsweise `?lang=en` in der Adresse, der zuletzt gewählten
Sprache und der Browsersprache. Umgeschaltet wird ohne Neuladen; `<html lang>`
wird mitgeführt und der Lebenslauf-Knopf wechselt auf die passende Fassung.

Für internationale Unternehmen lässt sich gezielt auf `…/?lang=en` verlinken.

## Inhalte pflegen

Alles steht in `assets/js/inhalte.js`. HTML und CSS bleiben unberührt.

    UI          Oberflächentexte
    NACHWEISE   Kursnachweise
    PROJEKTE    Projektbeschreibungen
    STATIONEN   Berufserfahrung
    KENNTNISSE  technische Kenntnisse
    KONSOLEN    die beiden Sitzungen im Konsolen-Fenster
    TAFELN      die neun Tafeln und ihre Beschriftung im Bild

Ein neuer Nachweis:

```js
{
  datei: "dateiname.pdf",          // liegt in assets/certificates/
  anbieter: "Plattform", jahr: "2026",
  de: { titel: "Kursname", umfang: "ca. 40 Stunden",
        inhalt: "Behandelte Themen.",
        praxis: "Die anschließende praktische Anwendung." },
  en: { titel: "Course name", umfang: "approx. 40 hours",
        inhalt: "Topics covered.",
        praxis: "How it was applied afterwards." }
}
```

Das Feld `praxis` trägt das Gewicht: ein Kursnachweis wird erst dadurch
aussagekräftig, dass die Inhalte danach im Produktivbetrieb angewendet wurden.

## Lokal ansehen

Die Szene wird per `fetch` geladen, was über `file://` nicht funktioniert.
Deshalb einen kleinen Server starten:

```bash
python3 -m http.server 8000
```

Eine Fassung, in der Stylesheet, Skript und Szene direkt in der HTML-Datei
stehen, lässt sich mit dem Skript unter `werkzeug/buendeln.py` erzeugen. Sie
öffnet sich per Doppelklick ohne Server.

## Vor dem Veröffentlichen

- [ ] Die Adresse dieser Seite in den Lebenslauf eintragen
- [ ] Beide Sprachfassungen gegenlesen

Die Nachweise, die Lebensläufe und die Zertifikatsmappe liegen bereits an
ihrem Platz. Weitere Nachweise kommen als PDF nach `assets/certificates/`
und als Eintrag in die Liste `NACHWEISE`; die Zertifikatsmappe erzeugt
`werkzeug/mappe.py` neu.

## Lizenz

Quelltext MIT. Die Nachweise und Projektbeschreibungen sind persönliche
Unterlagen und nicht zur Weiterverwendung freigegeben.
