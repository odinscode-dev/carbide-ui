# @carbide/core

## 0.35.3

### Patch Changes

- 6a04075: Alle Pakete tragen auf npmjs.com das Schlagwort `design-system`. Am Code ändert sich nichts.
- Updated dependencies [6a04075]
  - @odinscode/carbide-token@0.9.2

## 0.35.2

### Patch Changes

- 170393e: Paketseiten auf npmjs.com: README je Paket, englische Beschreibung, Schlagwörter und Verweise auf GitHub und das Storybook. Am Code ändert sich nichts.
- Updated dependencies [170393e]
  - @odinscode/carbide-token@0.9.1

## 0.35.1

### Patch Changes

- 306fb31: Toggle neu gestaltet: eckige Schiene mit Schieber, die mit der Dichte wächst, klarer Kontrast in beiden Themes, sichtbarer Tastaturfokus; Screenreader kündigen ihn jetzt als Schalter an (`role="switch"`). API unverändert.

## 0.35.0

### Minor Changes

- 9868b05: Neuer Name, öffentlich auf npmjs.com: Die Pakete heißen jetzt `@odinscode/carbide-core`, `-token`, `-shell`, `-icons-scada` und `-home` statt `@carbide-ui/…`. Verbraucher ersetzen die Namen in `package.json`, Importen und CSS-Importen und brauchen keinen Registry-Eintrag in `.npmrc` mehr.

### Patch Changes

- 6198e83: Keine Verweise mehr auf interne Dokumente und Infrastruktur in Kommentaren, Beispielen und `LIZENZEN.md`. Am Verhalten ändert sich nichts.
- Updated dependencies [9868b05]
- Updated dependencies [6198e83]
  - @odinscode/carbide-token@0.9.0

## 0.34.0

### Minor Changes

- 63d04e1: `PieChart` kann mit `legend={false}` ohne Legende zeichnen, wie die übrigen Diagramme.

## 0.33.0

### Minor Changes

- dae69c6: Tiefe für Leitstand-Kacheln: neue Tokens `--carbide-shadow-raised(-hover)`, `--carbide-raised-top/-bottom`, `--carbide-rim`, `--carbide-inset`, `--carbide-shadow-inset`, `--carbide-track`, `--carbide-glow`; `Tile` kann `elevation="raised"` und `accent`; neue Komponenten `StatusLight`, `SignalBars`, `IconChip`, `StatusChip`, `Well`, `Meter`, `ShareBar`, `MiniBars`, `CellStrip`, `Timeline`; Diagramme blenden mit `axisTitle: false` nur den Achsentitel aus.

### Patch Changes

- Updated dependencies [dae69c6]
  - @carbide-ui/token@0.8.0

## 0.32.0

### Minor Changes

- cc1cf98: Neuer Name und neue Lizenz: Die Pakete heißen jetzt `@carbide-ui/*` statt `@carbide/*` (der Scope `@carbide` gehört auf npm jemand anderem) und stehen unter Apache 2.0. Verbraucher ersetzen `@carbide/` in `package.json`, Importen und CSS-Importen durch `@carbide-ui/` und tragen in `.npmrc` `@carbide-ui:registry=` statt `@carbide:registry=` ein. Die Schriften in `@carbide-ui/token` bleiben unter der OFL 1.1.

### Patch Changes

- Updated dependencies [cc1cf98]
  - @carbide-ui/token@0.7.0

## 0.31.0

### Minor Changes

- 8daecdd: Neue Komponente `BandGauge`: ein Wert auf einer Skala mit farbigen Zonen, optional mit zweiter Marke (z. B. Prognose) (carbide-ui#1426).
- 8daecdd: `BarChart` (und die übrigen kartesischen Diagramme): Mit `categoryKey` zeigt die x-Achse benannte Kategorien statt Zeit (carbide-ui#1424).
- 8daecdd: Diagramme: Reihen können mit `rangeFn` einen Bereich [unten, oben] tragen – Linie und Fläche zeigen ihn als Band, Balken als schwebenden Balken; Achse und Tooltip berücksichtigen beide Enden (carbide-ui#1425).
- 8daecdd: `PieChart`: Jedes Stück kann mit `color` eine eigene Farbe tragen, die den Slot überstimmt (carbide-ui#1422).

### Patch Changes

- 8daecdd: Diagramme: Mit `axisPadding` liegen die Achsenstriche auf runden Schritten statt auf ungerundeten Werten (carbide-ui#1423).

## 0.30.0

### Minor Changes

- e1912f5: DatePicker zeigt im leeren Feld das Muster in der Sprache des Locales (Deutsch: `TT.MM.JJJJ`) und nimmt über den neuen Prop `placeholder` ein frei gesetztes Muster an.

## 0.29.0

### Minor Changes

- DataGrid: neue Eigenschaft `rowActionsWidth` (Standard `9rem`) für die Breite der Aktionsspalte. Die Spalte behält sie auch, wenn die übrigen Spalten mehr Platz brauchen als das Raster hat; das Raster scrollt dann waagerecht (`ScrollArea` mit `axis="both"`), statt den Aktionen-Knopf auf Breite 0 zu drücken (#843).

## 0.28.3

### Patch Changes

- 182b844: Link behält eine übergebene `className` neben der eigenen Klasse, wie die übrigen Komponenten.

## 0.28.2

### Patch Changes

- e2deb84: Accordion, Alert, Badge, CodeSnippet, Divider, Drawer, Flashbar, Form, InlineLoading, List, Notification, ProgressBar, ProgressIndicator, StructuredList, Tag, Tree und Wizard behalten eine übergebene `className` neben ihrer eigenen; bei TextInput, Search und Textarea sitzt sie am Eingabeelement. Vorher wurde sie verworfen. Link bleibt bewusst wie bisher. Achtung: Wer bisher eine wirkungslose `className` übergeben hat, sieht sie jetzt wirken.

## 0.28.1

### Patch Changes

- 8b45ac8: Tile, Modal und DataGrid behalten eine übergebene `className` neben ihrer eigenen (und der Glasfläche): vorher wurde sie verworfen, und etwa eine `max-width` am Tile kam nie an.

## 0.28.0

### Minor Changes

- 2594a8c: DatePicker, DateRangePicker und Calendar nehmen `locale` und `timeZone` entgegen: getippte Daten werden in der Reihenfolge der Sprache gelesen (de-DE: 05.10.2026 ist der 5. Oktober), Monats- und Wochentagsnamen folgen der Sprache, und „heute“ richtet sich nach der Zeitzone statt nach UTC.

## 0.27.2

### Patch Changes

- 35c8ace: Ereignisbereiche, Zielbänder, Ereignis- und Schwellenlinien nehmen dem Zoom keine Mausgesten mehr weg: wer über einem breiten Bereich (Nacht, Lücke) ein Stück aufziehen wollte, zog ins Leere.

## 0.27.1

### Patch Changes

- 09b1988: Wertachsen von LineChart und AreaChart ohne axisPadding runden auf runde Schritte (1, 2, 2.5, 5 mal Zehnerpotenz) statt auf die Ziffern der Daten; die Ticks liegen dann auf 14, 16, 18 statt auf 14.25, 15.2, 16.15.

## 0.27.0

### Minor Changes

- 5959d51: LineChart, AreaChart und BarChart: Serien haben eine eigene Farbe (`color`), lassen sich gestrichelt zeichnen (`dashed`), hervorheben oder abblenden (`emphasis`), zeigen Werte in eigenem Format (`format`) und mit freier Einheit (`unitLabel`, dazu `axisSide` für die Achsenseite); dazu Zielbänder (`bands`), neutrale Bereiche (`tone: "neutral"` an `ChartRangeEvent`) und `legend={false}`.

## 0.26.0

### Minor Changes

- 41ee50d: LineChart und AreaChart bekommen einen Zoom auf der Zeitachse. Mit `onDomainChange` schaltet er sich ein, `domain` (von, bis in Epoch-ms; ohne Angabe die ganze Zeitspanne) hält der Verbraucher: Ziehen mit der Maus wählt den Bereich, auf Touch wischt ein Finger und zwei Finger ziehen auf und zu, dazu Knöpfe für Vergrößern, Verkleinern, Verschieben und „Zoom zurücksetzen" (Texte über `zoomTexts` überschreibbar). Der Chart meldet einen Bereich pro Geste, `null` heißt „alles zeigen"; die Wertachsen passen sich dem sichtbaren Ausschnitt an, Ereignislinien, -bereiche und Zielbänder bleiben lagerichtig. Zeitachsen über mehr als einen Tag beschriften ihre Ticks jetzt mit Datum und Uhrzeit statt nur mit der Uhrzeit.

## 0.25.0

### Minor Changes

- c592942: Menu: Einträge haben die neue Eigenschaft `name`, den zugänglichen Namen, wenn er mehr sagen muss als der sichtbare Text, etwa „Löschen: Laptop" für ein „Löschen" in einer Tabellenzeile.

## 0.24.0

### Minor Changes

- b1d3b72: Neue Komponente `Menu`: ein Auswahlmenü mit beliebigem Auslöser (`trigger`), Einträgen aus Text oder eigenem Inhalt (etwa einem Tag), Gruppen, `danger` und `disabled`. Mit `value` bekommt der aktuelle Eintrag ein Häkchen und wird als gewählter Radio-Eintrag ausgewiesen. Optik wie `Select` und `AvatarMenu`, Tastaturbedienung über Ark UI.

## 0.23.1

### Patch Changes

- Updated dependencies [c749983]
  - @carbide/token@0.6.1

## 0.23.0

### Minor Changes

- 57384c7: Neue Home-Oberfläche: `HomeShell surface="home"` schaltet flachen grünlichen Grund, runde Karten (18 px) und runde Bedienelemente (12 px, Felder als volle Box) ein, ohne Glas. Dafür teilt `@carbide/token` den Radius in `--carbide-radius-surface` und `--carbide-radius-control` (Standard: `--carbide-radius`, ohne `surface` ändert sich nichts) und bringt die Palette unter `[data-surface='home']`; `@carbide/core` liest die neuen Tokens.

### Patch Changes

- Updated dependencies [57384c7]
  - @carbide/token@0.6.0

## 0.22.0

### Minor Changes

- 90029c1: AvatarMenu: neue Eigenschaften `logoutCancelText` (Abbrechen-Knopf des Abmelde-Dialogs) und `triggerLabel` (zugänglicher Name des Auslösers). Damit ist jeder sichtbare Text überschreibbar; ohne sie bleibt der Text aus dem Katalog.

## 0.21.0

### Minor Changes

- 2ed8199: RankingChart: Beschriftungen bleiben einzeilig und werden mit „…“ gekürzt statt in die Nachbarzeilen umzubrechen; der volle Text steht im Tooltip des Balkens und als Titel der Beschriftung. ChartTooltip hat dafür die neue Eigenschaft `showTextLabel`.

## 0.20.0

### Minor Changes

- b0390a6: Tabs: `layout="fill"` — the strip stays put and the selected panel scrolls under it in the parent's height; `--carbide-tabs-list-size` sets the strip's minimum height (a floorplan's tab band).

## 0.19.1

### Patch Changes

- 69698e7: `ScrollArea` mit `axis="vertical"` (Standard) hält ihren Inhalt so breit wie den sichtbaren Bereich; ein breites Kind (etwa ein Codeblock) dehnt ihn nicht mehr über den Rand, wo er abgeschnitten wurde.

## 0.19.0

### Minor Changes

- 2d09266: ChartSeries bekommt `axisIntegers`: die Wertachse zeigt dann nur ganze Zahlen (für Zählwerte wie Suchen pro Tag), nie einen Tick wie 0,5.

## 0.18.0

### Minor Changes

- e38f4b5: Diagramme können Werte pro Kalendertag zeigen: `resolution="day"` an LineChart, AreaChart und BarChart (Achse und Tooltip zeigen das Datum statt der Uhrzeit, `at` ist der UTC-Mitternacht-Zeitstempel des Tages, `locale` bestimmt die Schreibweise). BarChart stapelt mit `stacked`, und neu ist `RankingChart` für horizontale Balken einer Rangliste.

## 0.17.3

### Patch Changes

- DataGrid: added `variant="glass"`, matching Tile/Modal/Tabs — a grid sitting on a photo or another background image can now become a glass pane instead of an opaque surface. Header and row backgrounds stay on their own opaque tokens, so contrast is unaffected.

## 0.17.2

### Patch Changes

- DataGrid: row hover now tints with the accent colour instead of reusing the sticky header's own background — hovering a row used to paint it the exact same colour as the header, making the two indistinguishable.

## 0.17.1

### Patch Changes

- 5b82279: Fix floating popovers (DatePicker, DateRangePicker, Select, Dropdown, ButtonDropdown, Popover, Breadcrumb's overflow menu) rendering behind an open Modal.
  
  `@zag-js/popper` copies the content element's *computed* z-index onto the positioner's `--z-index` custom property the first time it positions a floating element. Every affected component set `z-index` only on `.positioner`, never on `.content` — so the copied value was `auto`, which loses to a Modal's explicit `z-index: var(--carbide-z-modal)` (9000) regardless of DOM order. `AvatarMenu` and `Tooltip` already had the fix (a real z-index on `.content` too); this applies the same pattern everywhere else.

## 0.17.0

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

### Patch Changes

- Updated dependencies
  - @carbide/token@0.5.0

## 0.16.2

### Patch Changes

- Updated dependencies [988845b]
  - @carbide/token@0.4.0

## 0.16.1

### Patch Changes

- 61c2a91: `ScrollArea` no longer shows a scrollbar when content fits entirely within
  the visible area — neither the native browser scrollbar (Chrome/WebKit was
  missing `::-webkit-scrollbar { display: none }`) nor its own thumb on
  hover (previously relied on zag-js's `hiddenState`, which incorrectly
  stayed "not hidden" when there was nothing to scroll).

## 0.16.0

### Minor Changes

- 348f344: Charts: bar axes start at zero (`axisFromZero` on the cartesian chart, set by `BarChart`), so a bar half as long is half as much; `ml` joins the quantity units.

## 0.15.0

### Minor Changes

- 9de90f3: Charts: `BarChart` takes `barSize`, every cartesian chart takes `ticks` for an exact time axis (one tick per event), and the tooltip is a Carbide card -- layer 1, hairline, elevated shadow, series swatch, mono values -- instead of recharts' inline-styled box.

## 0.14.0

### Minor Changes

- 0ceda5c: `Popover` nimmt eine `background`-Farbe an, die Fläche und Pfeil einfärbt — für Popovers über dunklen Boards, die sich sonst nicht vom Untergrund abheben.

## 0.13.0

### Minor Changes

- 997b5a2: `Popover` nimmt eine `width` (CSS-Länge) an. Ohne sie wächst der Inhalt wie bisher bis 22 rem; mit ihr bekommt eine breite Liste oder Tabelle ihre eigene Breite, gedeckelt nur noch vom Fenster.

## 0.12.0

### Minor Changes

- f735877: `ChartSeries` bekommt `axisPadding`: Die Y-Achse einer Serie passt sich dann an ihre Daten an (Minimum minus Anteil der Spanne bis Maximum plus Anteil), statt bei null zu beginnen — Bewegungen bleiben sichtbar, auch bei versteckter Achse.

## 0.11.0

### Minor Changes

- 8a33e76: Add `axisHidden` to `ChartSeries` to hide a value axis's tick labels and unit label while keeping the series on its own independent scale. Useful for dashboards that overlay several probes with unrelated units on one chart.

## 0.10.0

### Minor Changes

- Remove the focus ring entirely. Breaking: `--carbide-focus`, `--carbide-focus-width`, `--carbide-focus-offset` and the `[data-focus-ring='off']` opt-out are gone from `@carbide/token`; `@carbide/core` components (Checkbox, RadioButton, Toggle, StructuredList) no longer draw a focus box-shadow. Focus still moves via the DOM as before, it's just no longer painted.

### Patch Changes

- Updated dependencies
  - @carbide/token@0.3.0

## 0.9.0

### Minor Changes

- 72bfd12: Popover hat jetzt ein `autoFocus`-Prop. Standard bleibt `true`; auf `false` gesetzt, verschiebt das Öffnen den Fokus nicht mehr in den Inhalt — wichtig für reine Hover-Infopopover, wo das bisherige automatische Fokussieren einen `:focus-visible`-Ring auslöste, obwohl per Maus/Touch geöffnet wurde.

## 0.8.0

### Minor Changes

- b7b981b: Popover hat jetzt einen Elevation-Schatten (`--carbide-shadow-elevated`, neu im Token-Paket) und ein `borderColor`-Prop zum Überschreiben der Rahmenfarbe.

### Patch Changes

- Updated dependencies [b7b981b]
  - @carbide/token@0.2.0

## 0.7.0

### Minor Changes

- 8cbf5c2: BoardShell zeigt sein Menü jetzt als festes Kachel-Raster (Icon, Titel, Beschreibung, farblich gruppiert) statt eines frei gestaltbaren Inhalts. `BoardShellProps.menu` entfällt zugunsten von `menuGroups`, `menuActive`, `onMenuNavigate` und `menuLogo`. `ShellNav` bekommt dafür ein neues `layout="grid"` neben `"list"`, dazu `logo`-Slot, `description` je Eintrag und `accent` je Gruppe. Der Drawer schließt sich jetzt auch bei Klick außerhalb (`Drawer.closeOnInteractOutside`, von `modal` entkoppelt) und lässt Inhalte wie `ShellNav` ihr eigenes Padding/Scrollen übernehmen (`Drawer.unpadded`). Zwei kleinere Fehler behoben: die Kacheln füllten ihre Grid-Zelle nicht mehr ganz aus, und ein Klick auf denselben Menü-Knopf beim Schließen ließ den Drawer kurz zu- und sofort wieder aufspringen (`Drawer.persistentElements`, `Button.ref`).

## 0.6.0

### Minor Changes

- d8ad696: `Avatar` zeigt jetzt den vollen Namen statt Initialen und ist dafür länglich (abgerundetes Rechteck) statt kreisrund — passend für kurze Kontonamen wie „odin", „admin", „client"; sehr lange Namen werden mit Ellipse abgeschnitten. `AvatarMenu` zeigt zusätzlich den Kontonamen fett über einem Trenner oberhalb der Einträge. Die Rollenfarbe (`accountRole`) heißt jetzt `"admin" | "client"` statt `"admin" | "user"` — `"user"` entfällt ersatzlos (kein bekannter Aufrufer setzt bisher `accountRole`, daher kein Typfehler zu erwarten). **ambient-app nutzt `AvatarMenu` bereits im BoardShell-Header** (`frontend/src/pages/home/Home.tsx`, `@carbide/core: ^0.5.0`) — nach dem Update dort das neue Aussehen (Form, voller Name statt Initialen, Kontoname-Kopfzeile) im Browser gegenprüfen, auch wenn keine Codeänderung nötig ist.

## 0.5.0

### Minor Changes

- e480b6f: `Avatar` und `AvatarMenu` bekommen eine optionale Prop `accountRole` (`"admin" | "user"`), die den Avatar rot (Admin) bzw. blau (User) einfärbt. `AvatarMenu` bekommt außerdem `onLogout` (plus überschreibbare `logoutLabel`/`logoutConfirmTitle`/`logoutConfirmMessage`/`logoutConfirmText`): damit erscheint „Log out" immer als letzter Menüpunkt und fragt vor dem Abmelden nach, analog zu `HomeNav`. Beides ist rein additiv, bestehende Aufrufer sind nicht betroffen.

### Patch Changes

- 1660573: `AvatarMenu`: das Dropdown lag hinter einem eigenen, positionierten Header mit z-index (etwa `BoardShell`s) statt davor — `@zag-js/popper` übernimmt beim ersten Positionieren den *berechneten* z-index des Menü-Inhalts, und ohne einen echten Wert dort blieb es bei „auto". `ShellHeader`: Innenabstand links/rechts verdoppelt (16px → 32px), zu wenig Luft zum Rand.

## 0.4.0

### Minor Changes

- 46f3c71: Neue Komponenten `Avatar` (Bild mit Initialen-Fallback aus `name`) und `AvatarMenu` (Avatar als Trigger für ein Dropdown-Menü, Mechanik wie `ButtonDropdown`) — für den Kontobereich im Header von Shells wie `BoardShell` (Ticket #107).
