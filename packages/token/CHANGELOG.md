# @carbide/token

## 0.9.2

### Patch Changes

- 6a04075: Alle Pakete tragen auf npmjs.com das Schlagwort `design-system`. Am Code ändert sich nichts.

## 0.9.1

### Patch Changes

- 170393e: Paketseiten auf npmjs.com: README je Paket, englische Beschreibung, Schlagwörter und Verweise auf GitHub und das Storybook. Am Code ändert sich nichts.

## 0.9.0

### Minor Changes

- 9868b05: Neuer Name, öffentlich auf npmjs.com: Die Pakete heißen jetzt `@odinscode/carbide-core`, `-token`, `-shell`, `-icons-scada` und `-home` statt `@carbide-ui/…`. Verbraucher ersetzen die Namen in `package.json`, Importen und CSS-Importen und brauchen keinen Registry-Eintrag in `.npmrc` mehr.

### Patch Changes

- 6198e83: Keine Verweise mehr auf interne Dokumente und Infrastruktur in Kommentaren, Beispielen und `LIZENZEN.md`. Am Verhalten ändert sich nichts.

## 0.8.0

### Minor Changes

- dae69c6: Tiefe für Leitstand-Kacheln: neue Tokens `--carbide-shadow-raised(-hover)`, `--carbide-raised-top/-bottom`, `--carbide-rim`, `--carbide-inset`, `--carbide-shadow-inset`, `--carbide-track`, `--carbide-glow`; `Tile` kann `elevation="raised"` und `accent`; neue Komponenten `StatusLight`, `SignalBars`, `IconChip`, `StatusChip`, `Well`, `Meter`, `ShareBar`, `MiniBars`, `CellStrip`, `Timeline`; Diagramme blenden mit `axisTitle: false` nur den Achsentitel aus.

## 0.7.0

### Minor Changes

- cc1cf98: Neuer Name und neue Lizenz: Die Pakete heißen jetzt `@carbide-ui/*` statt `@carbide/*` (der Scope `@carbide` gehört auf npm jemand anderem) und stehen unter Apache 2.0. Verbraucher ersetzen `@carbide/` in `package.json`, Importen und CSS-Importen durch `@carbide-ui/` und tragen in `.npmrc` `@carbide-ui:registry=` statt `@carbide:registry=` ein. Die Schriften in `@carbide-ui/token` bleiben unter der OFL 1.1.

## 0.6.1

### Patch Changes

- c749983: Home-Oberfläche: Die Palette steht nur noch am Dokument-Element und an Elementen mit eigenem `data-theme`; die Shell-Wurzel erbt sie. Vorher überschrieb ihr helles Grundset das dunkle Theme, das eine App am Dokument-Element setzt.

## 0.6.0

### Minor Changes

- 57384c7: Neue Home-Oberfläche: `HomeShell surface="home"` schaltet flachen grünlichen Grund, runde Karten (18 px) und runde Bedienelemente (12 px, Felder als volle Box) ein, ohne Glas. Dafür teilt `@carbide/token` den Radius in `--carbide-radius-surface` und `--carbide-radius-control` (Standard: `--carbide-radius`, ohne `surface` ändert sich nichts) und bringt die Palette unter `[data-surface='home']`; `@carbide/core` liest die neuen Tokens.

## 0.5.0

### Minor Changes

- Glaskachel als geteilte Variante: `variant="glass"` an `Tile`, `Modal` und `Tabs`
  
  Der Glaseffekt — eine geblurrte, fast deckende Scheibe mit Lichtkante und
  weichem Schlagschatten, für Oberflächen über einem Hintergrundfoto — lag
  bisher in growdog in sieben Stylesheets wortgleich kopiert. Er gehört ins
  Paket, nicht in die Anwendung.
  
  `@carbide/token` bringt dafür `semantic/glass.css` mit: `--carbide-glass-fill`,
  `-edge`, `-rim`, `-shadow` und `-blur` je Thema, dazu die beiden Anker
  `--carbide-glass-rim-base` und `--carbide-glass-shadow-base` zum Umfärben und
  `--carbide-glass-glow` für eine dritte Schattenlage in einer Akzentfarbe.
  
  `@carbide/core` zeichnet damit die Scheibe: `<Tile variant="glass">`,
  `<Modal variant="glass">` und `<Tabs variant="glass">` (bei Tabs nur die
  Leiste, nicht die Panels). Hover- und Auswahl-Rückmeldung bleibt wie sie ist.
  Ohne die Prop ändert sich nichts.

## 0.4.0

### Minor Changes

- 988845b: Die neun Farbrampen sind jetzt tonal statt kontrastbenannt: 300 hell bis 900 dunkel, 600 die Hauptfarbe, ein Wertesatz für beide Themes, Werte aus Cloudscapes Systempalette. Statusrollen, Nav-Gruppen, Syntax und Fehlerbalken lesen im Dunkeln die helleren Stufen. Token-Namen unverändert — wer eine Rampenstufe direkt nutzt (verboten), sieht andere Farben.

## 0.3.0

### Minor Changes

- Remove the focus ring entirely. Breaking: `--carbide-focus`, `--carbide-focus-width`, `--carbide-focus-offset` and the `[data-focus-ring='off']` opt-out are gone from `@carbide/token`; `@carbide/core` components (Checkbox, RadioButton, Toggle, StructuredList) no longer draw a focus box-shadow. Focus still moves via the DOM as before, it's just no longer painted.

## 0.2.0

### Minor Changes

- b7b981b: Popover hat jetzt einen Elevation-Schatten (`--carbide-shadow-elevated`, neu im Token-Paket) und ein `borderColor`-Prop zum Überschreiben der Rahmenfarbe.
