# @carbide/shell

## 1.8.3

### Patch Changes

- 6a04075: Alle Pakete tragen auf npmjs.com das Schlagwort `design-system`. Am Code ändert sich nichts.
- Updated dependencies [6a04075]
  - @odinscode/carbide-core@0.35.3

## 1.8.2

### Patch Changes

- 170393e: Paketseiten auf npmjs.com: README je Paket, englische Beschreibung, Schlagwörter und Verweise auf GitHub und das Storybook. Am Code ändert sich nichts.
- Updated dependencies [170393e]
  - @odinscode/carbide-core@0.35.2

## 1.8.1

### Patch Changes

- Updated dependencies [306fb31]
  - @odinscode/carbide-core@0.35.1

## 1.8.0

### Minor Changes

- 9868b05: Neuer Name, öffentlich auf npmjs.com: Die Pakete heißen jetzt `@odinscode/carbide-core`, `-token`, `-shell`, `-icons-scada` und `-home` statt `@carbide-ui/…`. Verbraucher ersetzen die Namen in `package.json`, Importen und CSS-Importen und brauchen keinen Registry-Eintrag in `.npmrc` mehr.

### Patch Changes

- Updated dependencies [9868b05]
- Updated dependencies [6198e83]
  - @odinscode/carbide-core@0.35.0

## 1.7.2

### Patch Changes

- Updated dependencies [63d04e1]
  - @carbide-ui/core@0.34.0

## 1.7.1

### Patch Changes

- Updated dependencies [dae69c6]
  - @carbide-ui/core@0.33.0

## 1.7.0

### Minor Changes

- cc1cf98: Neuer Name und neue Lizenz: Die Pakete heißen jetzt `@carbide-ui/*` statt `@carbide/*` (der Scope `@carbide` gehört auf npm jemand anderem) und stehen unter Apache 2.0. Verbraucher ersetzen `@carbide/` in `package.json`, Importen und CSS-Importen durch `@carbide-ui/` und tragen in `.npmrc` `@carbide-ui:registry=` statt `@carbide:registry=` ein. Die Schriften in `@carbide-ui/token` bleiben unter der OFL 1.1.

### Patch Changes

- Updated dependencies [cc1cf98]
  - @carbide-ui/core@0.32.0

## 1.6.2

### Patch Changes

- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
  - @carbide/core@0.31.0

## 1.6.1

### Patch Changes

- Updated dependencies [e1912f5]
  - @carbide/core@0.30.0

## 1.6.0

### Minor Changes

- 81418b2: Neu: PageGrid und PageContainer (16-Spalten-Seitenraster, 32 px Gutter) sowie die Floorplans ListReport (Bänder 64/64/Rest) und ObjectPage (64/72/48/Rest) für AdminShell mit mainLayout="fill"; bestehende Anwendungen ändern sich nicht.

## 1.5.18

### Patch Changes

- 1249590: Keine Typzusicherungen mehr im Code (#611): HomeNav und die Bildlauf-Wiederherstellung der Chart-Kachel prüfen das Element mit `instanceof`, BoardShell und ShellNav geben ihre CSS-Variablen ohne Cast weiter. Verhalten unverändert.
- Updated dependencies
  - @carbide/core@0.29.0

## 1.5.17

### Patch Changes

- Updated dependencies [182b844]
  - @carbide/core@0.28.3

## 1.5.16

### Patch Changes

- Updated dependencies [e2deb84]
  - @carbide/core@0.28.2

## 1.5.15

### Patch Changes

- Updated dependencies [8b45ac8]
  - @carbide/core@0.28.1

## 1.5.14

### Patch Changes

- Updated dependencies [2594a8c]
  - @carbide/core@0.28.0

## 1.5.13

### Patch Changes

- Updated dependencies [35c8ace]
  - @carbide/core@0.27.2

## 1.5.12

### Patch Changes

- Updated dependencies [09b1988]
  - @carbide/core@0.27.1

## 1.5.11

### Patch Changes

- Updated dependencies [5959d51]
  - @carbide/core@0.27.0

## 1.5.10

### Patch Changes

- Updated dependencies [41ee50d]
  - @carbide/core@0.26.0

## 1.5.9

### Patch Changes

- Updated dependencies [c592942]
  - @carbide/core@0.25.0

## 1.5.8

### Patch Changes

- Updated dependencies [b1d3b72]
  - @carbide/core@0.24.0

## 1.5.7

### Patch Changes

- @carbide/core@0.23.1

## 1.5.6

### Patch Changes

- Updated dependencies [57384c7]
  - @carbide/core@0.23.0

## 1.5.5

### Patch Changes

- 29242a1: ShellHeader mit Status: Der Titelblock hat eine feste Breite (`--carbide-shell-titles-size`, in AdminShell bis zur Kante der Navigationsspalte) statt sich dem Text anzupassen, sodass Trennlinie und Status nicht mehr von Seite zu Seite wandern. Lange Titel und Kontextzeilen werden mit „…“ gekürzt; als Text übergeben, stehen sie auch als Tooltip.

## 1.5.4

### Patch Changes

- Updated dependencies [90029c1]
  - @carbide/core@0.22.0

## 1.5.3

### Patch Changes

- Updated dependencies [2ed8199]
  - @carbide/core@0.21.0

## 1.5.2

### Patch Changes

- Updated dependencies [b0390a6]
  - @carbide/core@0.20.0

## 1.5.1

### Patch Changes

- Updated dependencies [69698e7]
  - @carbide/core@0.19.1

## 1.5.0

### Minor Changes

- e4ef694: `AdminShell` nimmt mit `panelSize` die Startbreite des Seitenpanels in Prozent (Standard 25), gehalten auf die Grenzen des Splitters (Panel mindestens 15, Hauptbereich mindestens 30).

## 1.4.0

### Minor Changes

- e3a12ea: `ShellMain` hat `layout="fill"`: Der Inhalt füllt die Höhe des Hauptbereichs, statt als Ganzes zu scrollen; `AdminShell` reicht das als `mainLayout` durch. Ohne Angabe bleibt es beim Scrollen wie bisher.

## 1.3.0

### Minor Changes

- 4cea88d: AdminShell reicht `status` (Statusbereich in der Kopfleiste), `navLogo` und `navFooterGroups` (Logo und feste Einträge unten in der Navigationsspalte) an ihre Primitive durch; ohne die neuen Props bleibt alles wie bisher. Die Fußgruppen der Listen-Navigation haben unten jetzt Abstand zum Rand, statt bündig auf der Unterkante zu sitzen.

## 1.2.13

### Patch Changes

- Updated dependencies [2d09266]
  - @carbide/core@0.19.0

## 1.2.12

### Patch Changes

- Updated dependencies [e38f4b5]
  - @carbide/core@0.18.0

## 1.2.11

### Patch Changes

- 9f4869c: BoardShell/Board sind nicht mehr auf eine feste Canvas-Größe von 1920×1200 festgenagelt. Das Grid füllt jetzt die tatsächlich verfügbare Breite/Höhe der Shell und skaliert proportional mit — auch bei kleineren Viewport-Höhen (z. B. 1080p im Vollbild oder ein maximiertes Browserfenster mit Tableiste/Adressleiste), statt am unteren Rand abgeschnitten zu werden.

## 1.2.10

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.3

## 1.2.9

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.2

## 1.2.8

### Patch Changes

- Updated dependencies [5b82279]
  - @carbide/core@0.17.1

## 1.2.7

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.0

## 1.2.6

### Patch Changes

- @carbide/core@0.16.2

## 1.2.5

### Patch Changes

- Updated dependencies [61c2a91]
  - @carbide/core@0.16.1

## 1.2.4

### Patch Changes

- Updated dependencies [348f344]
  - @carbide/core@0.16.0

## 1.2.3

### Patch Changes

- Updated dependencies [9de90f3]
  - @carbide/core@0.15.0

## 1.2.2

### Patch Changes

- Updated dependencies [0ceda5c]
  - @carbide/core@0.14.0

## 1.2.1

### Patch Changes

- Updated dependencies [997b5a2]
  - @carbide/core@0.13.0

## 1.2.0

### Minor Changes

- 3e9e27f: `ShellHeader` und `BoardShell` haben einen neuen Slot `status` zwischen Titel und Aktionen — eine Leiste für die Werte, die ein Bediener den ganzen Tag im Blick behält (offene Aufgaben, Pflanzen-Health, letzter Alarm). Der Titel schrumpft dann auf seinen Inhalt, die Leiste nimmt die freie Breite.

## 1.1.2

### Patch Changes

- Updated dependencies [f735877]
  - @carbide/core@0.12.0

## 1.1.1

### Patch Changes

- Updated dependencies [8a33e76]
  - @carbide/core@0.11.0

## 1.1.0

### Minor Changes

- 965a287: BoardShell hat jetzt eine optionale `backgroundImage`-Prop (je ein Bild für Light- und Dark-Theme) für ein vollflächiges Hintergrundbild hinter dem Board; die Widget-Flächen bleiben opak.

## 1.0.4

### Patch Changes

- Updated dependencies
  - @carbide/core@0.10.0

## 1.0.3

### Patch Changes

- Updated dependencies [72bfd12]
  - @carbide/core@0.9.0

## 1.0.2

### Patch Changes

- Updated dependencies [b7b981b]
  - @carbide/core@0.8.0

## 1.0.1

### Patch Changes

- b5dccdb: Die BoardShell-Leinwand füllt jetzt 1920×1200 (Kopfleiste 80px + 1120px Leinwand) statt der bisherigen 1920×1080 (1000px Leinwand) — der neue Industriestandard.

## 1.0.0

### Major Changes

- 8cbf5c2: BoardShell zeigt sein Menü jetzt als festes Kachel-Raster (Icon, Titel, Beschreibung, farblich gruppiert) statt eines frei gestaltbaren Inhalts. `BoardShellProps.menu` entfällt zugunsten von `menuGroups`, `menuActive`, `onMenuNavigate` und `menuLogo`. `ShellNav` bekommt dafür ein neues `layout="grid"` neben `"list"`, dazu `logo`-Slot, `description` je Eintrag und `accent` je Gruppe. Der Drawer schließt sich jetzt auch bei Klick außerhalb (`Drawer.closeOnInteractOutside`, von `modal` entkoppelt) und lässt Inhalte wie `ShellNav` ihr eigenes Padding/Scrollen übernehmen (`Drawer.unpadded`). Zwei kleinere Fehler behoben: die Kacheln füllten ihre Grid-Zelle nicht mehr ganz aus, und ein Klick auf denselben Menü-Knopf beim Schließen ließ den Drawer kurz zu- und sofort wieder aufspringen (`Drawer.persistentElements`, `Button.ref`).

### Patch Changes

- Updated dependencies [8cbf5c2]
  - @carbide/core@0.7.0

## 0.4.0

### Minor Changes

- Add `footerGroups` to `ShellNav` and `menuFooterGroups` to `BoardShell` for pinning nav items (e.g. settings, sign out) to the bottom of the drawer, separated from the scrollable main groups by a border.

## 0.3.0

### Minor Changes

- `BoardShell` rendert den Navigations-Drawer jetzt selbst statt einen fertigen `menu`-ReactNode entgegenzunehmen: neue Props `menuGroups` (Pflicht, `ShellNavGroup[]`), `menuActive` und `onMenuNavigate` (Pflicht) ersetzen `menu`. Der Drawer schließt sich automatisch nach der Navigation. Zusätzlich neu: `menuLogo` (optionales Logo/Label über den Gruppen), `ShellNavGroup.accent` (Akzentfarbe der Gruppe, z. B. über `seriesColor()`) und `ShellNavItem.description` (Untertext je Eintrag) für ein Karten-Raster-Layout (`ShellNav`s neues `layout="grid"`) statt der bisherigen schlichten Liste.
  
  **Breaking, aber als `minor` geführt** (Konvention dieses Pakets vor 1.0, siehe vorheriger Avatar-Changeset): jeder Aufrufer von `BoardShell`, der bisher `menu={<ShellNav .../>}` übergeben hat, muss auf `menuGroups`/`menuActive`/`onMenuNavigate` umgestellt werden — `ShellNav` selbst wird nicht mehr direkt vom Aufrufer gerendert.
  
  **journal-csc nutzt `BoardShell` im Header** (`frontend/src/pages/home/Home.tsx`, `@carbide/shell: ^0.2.0`) — nach dem Update dort auf die neue Props-Form umstellen (inkl. Icons/Beschreibungen je Menüpunkt, falls gewünscht) und im Browser gegenprüfen, dass der Drawer weiterhin öffnet/schließt und navigiert.

### Patch Changes

- Updated dependencies [d8ad696]
  - @carbide/core@0.6.0

## 0.2.0

### Minor Changes

- 00fa672: `BoardShell`: Raster von 24×40 auf 24×20 Zeilen halbiert, dazu ein einheitlicher Gutter und Außenrand von 16px zwischen bzw. um die Widget-Zellen — vorher berührten sich Widget-Ränder ohne Abstand. Die Leinwand bleibt 1920×1000px, die Zellen werden dadurch anteilig kleiner statt fest 80×25px. **Bricht bestehende Board-Konfigurationen**, deren Widgets `y + h - 1 > 20` erreichen (vorher bis 40 zulässig) — solche Konfigurationen müssen auf das neue Raster neu verteilt werden.

### Patch Changes

- 1660573: `AvatarMenu`: das Dropdown lag hinter einem eigenen, positionierten Header mit z-index (etwa `BoardShell`s) statt davor — `@zag-js/popper` übernimmt beim ersten Positionieren den *berechneten* z-index des Menü-Inhalts, und ohne einen echten Wert dort blieb es bei „auto". `ShellHeader`: Innenabstand links/rechts verdoppelt (16px → 32px), zu wenig Luft zum Rand.
- Updated dependencies [e480b6f]
- Updated dependencies [1660573]
  - @carbide/core@0.5.0

## 0.1.2

### Patch Changes

- Updated dependencies [46f3c71]
  - @carbide/core@0.4.0
