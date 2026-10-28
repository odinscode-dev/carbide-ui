# Lizenzen in @odinscode/carbide-token

**Der Inhalt dieses Pakets steht unter der Apache License 2.0** (`LICENSE`), mit
einer Ausnahme: den Schriftdateien unter `fonts/`, die unter der SIL Open Font
License 1.1 stehen. Dazu enthält es Farbwerte aus zwei
Apache-2.0-Werken, siehe unten.

## Farbwerte aus `@carbon/colors` und `@cloudscape-design/design-tokens`

Die Grauleiter in `primitive/gray.css` stammt aus `@carbon/colors`, die neun
Farbrampen in `primitive/ramps.css` (Systempalette, seit Ticket #114 tonal,
`style-dictionary/core/palette-values.ts` aus `cloudscape-design/components`;
`blue-2` und `pink` daraus in OKLCH abgeleitet) sowie Schwellenwerte in
`semantic/chart.css` aus Cloudscape (`@cloudscape-design/design-tokens`). Beide stehen
unter der Apache License 2.0; die Werte wurden einmal ausgelesen und stehen als
Literale im CSS, keines der Pakete ist eine Abhängigkeit. Die Pflicht aus
Abschnitt 4 der Lizenz — Nennung und Weitergabe der NOTICE-Hinweise — erfüllt
die Datei `NOTICE` in diesem Paket. Sie geht überall mit, wo das Paket hingeht.

## Ausnahme: die Schriften unter `fonts/`

`CarbideSans-Var.woff2` und `CarbideSans-Italic-Var.woff2` sind seit Ticket #83
(2026-09-11) aus Red Hat Text abgeleitet statt vorher aus IBM Plex Sans.
`CarbideDisplay-Var.woff2` und `CarbideDisplay-Italic-Var.woff2` sind seit
Ticket #84 neu, aus Red Hat Display, ausschließlich für Überschriften und
große Kennzahlen. Beide teilen sich `fonts/OFL.txt` — ein Release, ein
Lizenztext. `CarbideMono-100.woff2` bis `CarbideMono-800.woff2` sind seit
Ticket #82 aus JetBrains Mono NL abgeleitet statt vorher aus IBM Plex Mono,
eigener Lizenztext `fonts/OFL-JetBrainsMono.txt`. Zwei Quellen,
zwei Lizenzdateien: unterschiedliche Copyright-Zeile zwischen Red Hat und
JetBrains, deshalb nicht zusammengefasst.

Die Lizenz verlangt, dass Copyright-Vermerk und Lizenztext bei jeder Kopie der
Schriften vorhanden sind, und lässt dafür ausdrücklich auch die Metadatenfelder
der Schriftdatei selbst zu. Diese sind hier vollständig gefüllt. Wer nur die
WOFF2-Dateien ausliefert, etwa an einen Browser, muss deshalb nichts zusätzlich
beilegen.

Die OFL greift nur auf die Schriftdateien selbst über. Sie stellt keine Bedingung
an den Code, der die Schriften einbindet, und keine an Dokumente oder
Benutzeroberflächen, die damit gesetzt werden. Der Rest dieses Pakets bleibt
davon unberührt.

Die Dateien tragen den Namen Carbide, nie den der Quelle. Bei Plex ist „Plex"
ein Reserved Font Name, den eine veränderte Fassung nicht führen darf. JetBrains
Mono kennt keine RFN-Klausel, beansprucht den Namen aber als Marke (Name-ID 7
im Font: „JetBrains Mono is a trademark of JetBrains s.r.o."). Red Hat Text und
Red Hat Display haben weder eine RFN-Klausel noch einen Markenhinweis im Font
selbst — umbenannt wird trotzdem, aus Konsistenz mit den anderen Quellen. Drei
Quellen, drei Begründungen, gleiches Ergebnis. Copyright, Lizenzbeschreibung,
Lizenz-URL und die Markenhinweise, soweit vorhanden, stehen unverändert in den
Metadaten jeder Datei.

Bauablauf: `scripts/build-fonts.py` im Repository.

Die Lizenzübersicht des gesamten Projekts liegt in `LIZENZEN.md` an der Wurzel
des Repositorys.
