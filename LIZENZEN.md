# Lizenzen

**Carbide UI steht unter der Apache License 2.0** (`LICENSE`), Copyright 2026
Vitali Wottschel. Jedes Paket trägt eine Kopie des Lizenztexts. Die einzige
Ausnahme sind die Schriftdateien in `@odinscode/carbide-token`: Sie bleiben unter der SIL
Open Font License 1.1, siehe unten.

Diese Datei nennt die fremden Bestandteile und die Pflichten, die daraus folgen.
Aufgenommen werden nur Bausteine, deren Lizenzbedingungen sich erfüllen lassen
(bevorzugt MIT und Apache 2.0, Copyleft nur nach ausdrücklicher Entscheidung).

Stand: 2026-09-10. Bei jedem neuen Baustein hier ergänzen, und Renovate-PRs, die
eine Hauptversion anheben, auf Lizenzwechsel prüfen.

## Abhängigkeiten im Code

| Baustein | Lizenz | Pflicht | Paket |
|---|---|---|---|
| React, React DOM | MIT | Nennung | `@odinscode/carbide-core`, `@odinscode/carbide-shell` (peer) |
| Ark UI | MIT | Nennung | `@odinscode/carbide-core` |
| TanStack Table | MIT | Nennung | `@odinscode/carbide-core` |
| TanStack Virtual | MIT | Nennung | `@odinscode/carbide-core` |
| Recharts | MIT | Nennung | `@odinscode/carbide-core` |
| refractor (Syntaxhervorhebung, Ticket #58) | MIT | Nennung | `@odinscode/carbide-core` |

Geprüft mit `pnpm licenses list --prod` am 2026-09-11: 138 × MIT, 11 × ISC
(d3-Bausteine unter Recharts), 3 × Apache 2.0 (`@internationalized/date`,
`@internationalized/number`, `@swc/helpers`), 1 × BSD-3-Clause (`d3-ease`),
1 × 0BSD (`tslib`), 1 × „MIT AND ISC" (`victory-vendor`). refractors eigene
Kette (`hastscript`, `parse-entities`, `property-information`,
`space-separated-tokens`, `comma-separated-tokens`) läuft in den 138 MIT mit.
Kein Copyleft im Produktivbaum.

Alle genannten Lizenzen erlauben den Einbau in proprietäre Software. Die Nennung
in dieser Datei erfüllt ihre Bedingung.

## Gestaltung und Schriften

| Baustein | Lizenz | Pflicht | Stand |
|---|---|---|---|
| Red Hat Text | OFL 1.1 | Lizenztext beilegen; veränderte Dateien umbenannt | **liegt bei**, seit Ticket #83, siehe unten |
| Red Hat Display | OFL 1.1 | Lizenztext beilegen; veränderte Dateien umbenannt | **liegt bei**, seit Ticket #84, siehe unten |
| JetBrains Mono (NL, ohne Ligaturen) | OFL 1.1 | Lizenztext beilegen; veränderte Dateien umbenannt | **liegt bei**, seit Ticket #82, siehe unten |
| @carbon/colors | Apache 2.0 | Nennung | **erfüllt**, `packages/token/NOTICE` — das Paket liefert selbst keine NOTICE-Datei mit, geprüft am 2026-09-10 gegen 11.58.0 |
| @cloudscape-design/design-tokens | Apache 2.0 | Nennung, NOTICE beilegen | **erfüllt**, `packages/token/NOTICE` — Farbrampen, Schwellenwerte, Fehlerbalken; Werte aus 3.0.112, geprüft am 2026-09-10 (#46) |
| Carbon Icons | Apache 2.0 | Nennung, NOTICE beilegen | folgt mit #40 |
| Tabler Icons | MIT | Nennung | folgt mit #40 |

Ausgeschlossen: die draw.io-Stencils und der draw.io-Ordner der FUXA-SVG-Widgets
(Atlassian-Klausel, unklare Kette). Wikimedia-P&ID-Symbole stehen unter CC BY-SA 4.0
und kämen nur nach ausdrücklicher Entscheidung in Frage.

### Farbwerte aus Carbon und Cloudscape

`@odinscode/carbide-token` enthält Farbwerte aus zwei Apache-2.0-Werken: die Grauleiter
aus `@carbon/colors`, die neun Farbrampen, vier Schwellenwertfarben und acht
Fehlerbalken-Serien aus `@cloudscape-design/design-tokens`. Beide Pakete sind
**keine Abhängigkeit** — die Werte wurden einmal ausgelesen und stehen als
Literale im CSS. Apache 2.0 erlaubt das auch in proprietärer Software; die
Pflicht aus Abschnitt 4 ist die Nennung und, wo das Werk eine NOTICE-Datei
mitbringt, deren Weitergabe. Beides steht in `packages/token/NOTICE`, die
Datei geht mit dem Paket mit (`files` in der `package.json`).

Cloudscape sagt über seine Farben, sie kämen „from the broader AWS brand
palette". Odin hat sie am 2026-09-10 trotzdem gewählt; betroffen sind nur
Status- und Dataviz-Farben, die Grauflächen bleiben Carbon Cool Gray.

### Die Schriften sind die einzige Ausnahme von Apache 2.0

Unter `packages/token/fonts/` liegen WOFF2-Dateien aus zwei Quellen, beide unter
der SIL Open Font License 1.1: **Carbide Sans** seit 2026-09-11 aus Red Hat Text
statt vorher IBM Plex Sans, **Carbide Display** seit 2026-09-11 neu aus Red Hat
Display (ausschließlich für Überschriften und große Kennzahlen), **Carbide
Mono** seit 2026-09-11 aus JetBrains Mono NL statt vorher IBM Plex Mono.
**Diese Dateien bleiben unter der OFL, auch wenn das Paket ringsum unter Apache 2.0
ist.** Das ist kein Widerspruch: Die OFL erlaubt ausdrücklich, Schriften mit
beliebiger Software zu bündeln, zu verbreiten und zu verkaufen. Sie greift nur
auf die Schriftdateien selbst über und niemals auf den Code, der sie benutzt,
oder auf damit gesetzte Dokumente.

Zwei unterschiedliche Urheber heißt zwei Lizenztexte: `fonts/OFL.txt` (The Red
Hat Project Authors, Carbide Sans **und** Carbide Display — ein Release, ein
Lizenztext) und `fonts/OFL-JetBrainsMono.txt` (The JetBrains Mono Project
Authors, Carbide Mono) — nicht zusammengefasst, weil die Copyright-Zeilen
zwischen Red Hat und JetBrains unterschiedlich sind, auch wenn der Lizenztext
selbst identisch ist.

Daraus folgen genau zwei Pflichten, beide erfüllt:

1. **Copyright-Vermerk und Lizenztext liegen bei jeder Kopie der Schriften.**
   Die OFL lässt dafür drei Wege zu: eine eigene Textdatei, einen lesbaren Header
   oder die Metadatenfelder in der Schriftdatei selbst. Der dritte Weg ist bei uns
   bereits erfüllt, jede Datei trägt Copyright, Lizenzbeschreibung und Lizenz-URL
   in ihren Metadaten. Eine Anwendung, die nur die WOFF2-Dateien an Browser
   ausliefert, muss deshalb nichts zusätzlich beilegen. Beide `OFL*.txt`-Dateien
   liegen trotzdem im Paket, weil es nichts kostet und jede Auslegung abdeckt.
2. **Der Name der Quellschrift darf im Schriftnamen nicht vorkommen.** Bei Plex
   (bis Ticket #82/#83) war das ein Reserved Font Name (Bedingung 3 der Lizenz).
   JetBrains Mono kennt keine RFN-Klausel, beansprucht den Namen aber als Marke
   (Name-ID 7 im Font: „JetBrains Mono is a trademark of JetBrains s.r.o.").
   Red Hat Text und Red Hat Display haben weder eine RFN-Klausel noch einen
   Markenhinweis im Font selbst — umbenannt wird trotzdem, aus Konsistenz und
   weil „Red Hat" unabhängig vom Font als Marke von Red Hat, Inc. gilt. Ergebnis
   in allen Fällen gleich: Die Dateien heißen Carbide Sans, Carbide Display und
   Carbide Mono, nie beim Namen der Quelle.

Copyright-Vermerk, Lizenzbeschreibung und Lizenz-URL stehen unverändert in den
Metadaten jeder Datei. Die Markenhinweise bleiben ebenfalls stehen, soweit
vorhanden; die Namensregel der OFL bezieht sich ausdrücklich nur auf den
primären Schriftnamen.

Bauablauf: `packages/token/scripts/build-fonts.py`.
