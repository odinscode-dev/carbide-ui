# @carbide/home

## 0.9.2

### Patch Changes

- 170393e: Paketseiten auf npmjs.com: README je Paket, englische Beschreibung, Schlagwörter und Verweise auf GitHub und das Storybook. Am Code ändert sich nichts.
- Updated dependencies [170393e]
  - @odinscode/carbide-core@0.35.2

## 0.9.1

### Patch Changes

- Updated dependencies [306fb31]
  - @odinscode/carbide-core@0.35.1

## 0.9.0

### Minor Changes

- 9868b05: Neuer Name, öffentlich auf npmjs.com: Die Pakete heißen jetzt `@odinscode/carbide-core`, `-token`, `-shell`, `-icons-scada` und `-home` statt `@carbide-ui/…`. Verbraucher ersetzen die Namen in `package.json`, Importen und CSS-Importen und brauchen keinen Registry-Eintrag in `.npmrc` mehr.

### Patch Changes

- Updated dependencies [9868b05]
- Updated dependencies [6198e83]
  - @odinscode/carbide-core@0.35.0

## 0.8.2

### Patch Changes

- Updated dependencies [63d04e1]
  - @carbide-ui/core@0.34.0

## 0.8.1

### Patch Changes

- Updated dependencies [dae69c6]
  - @carbide-ui/core@0.33.0

## 0.8.0

### Minor Changes

- cc1cf98: Neuer Name und neue Lizenz: Die Pakete heißen jetzt `@carbide-ui/*` statt `@carbide/*` (der Scope `@carbide` gehört auf npm jemand anderem) und stehen unter Apache 2.0. Verbraucher ersetzen `@carbide/` in `package.json`, Importen und CSS-Importen durch `@carbide-ui/` und tragen in `.npmrc` `@carbide-ui:registry=` statt `@carbide:registry=` ein. Die Schriften in `@carbide-ui/token` bleiben unter der OFL 1.1.

### Patch Changes

- Updated dependencies [cc1cf98]
  - @carbide-ui/core@0.32.0

## 0.7.6

### Patch Changes

- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
- Updated dependencies [8daecdd]
  - @carbide/core@0.31.0

## 0.7.5

### Patch Changes

- Updated dependencies [e1912f5]
  - @carbide/core@0.30.0

## 0.7.4

### Patch Changes

- 1249590: Keine Typzusicherungen mehr im Code (#611): HomeNav und die Bildlauf-Wiederherstellung der Chart-Kachel prüfen das Element mit `instanceof`, BoardShell und ShellNav geben ihre CSS-Variablen ohne Cast weiter. Verhalten unverändert.
- Updated dependencies
  - @carbide/core@0.29.0

## 0.7.3

### Patch Changes

- Updated dependencies [182b844]
  - @carbide/core@0.28.3

## 0.7.2

### Patch Changes

- Updated dependencies [e2deb84]
  - @carbide/core@0.28.2

## 0.7.1

### Patch Changes

- Updated dependencies [8b45ac8]
  - @carbide/core@0.28.1

## 0.7.0

### Minor Changes

- 29e30a0: HomeNav und HomeShell nehmen `logoutCancelText` entgegen: der Abbrechen-Knopf des Abmelde-Dialogs lässt sich übersetzen, statt englisch „Cancel“ zu bleiben.

## 0.6.8

### Patch Changes

- Updated dependencies [2594a8c]
  - @carbide/core@0.28.0

## 0.6.7

### Patch Changes

- Updated dependencies [35c8ace]
  - @carbide/core@0.27.2

## 0.6.6

### Patch Changes

- Updated dependencies [09b1988]
  - @carbide/core@0.27.1

## 0.6.5

### Patch Changes

- Updated dependencies [5959d51]
  - @carbide/core@0.27.0

## 0.6.4

### Patch Changes

- Updated dependencies [41ee50d]
  - @carbide/core@0.26.0

## 0.6.3

### Patch Changes

- Updated dependencies [c592942]
  - @carbide/core@0.25.0

## 0.6.2

### Patch Changes

- Updated dependencies [b1d3b72]
  - @carbide/core@0.24.0

## 0.6.1

### Patch Changes

- @carbide/core@0.23.1

## 0.6.0

### Minor Changes

- 57384c7: Neue Home-Oberfläche: `HomeShell surface="home"` schaltet flachen grünlichen Grund, runde Karten (18 px) und runde Bedienelemente (12 px, Felder als volle Box) ein, ohne Glas. Dafür teilt `@carbide/token` den Radius in `--carbide-radius-surface` und `--carbide-radius-control` (Standard: `--carbide-radius`, ohne `surface` ändert sich nichts) und bringt die Palette unter `[data-surface='home']`; `@carbide/core` liest die neuen Tokens.

### Patch Changes

- Updated dependencies [57384c7]
  - @carbide/core@0.23.0

## 0.5.10

### Patch Changes

- Updated dependencies [90029c1]
  - @carbide/core@0.22.0

## 0.5.9

### Patch Changes

- Updated dependencies [2ed8199]
  - @carbide/core@0.21.0

## 0.5.8

### Patch Changes

- Updated dependencies [b0390a6]
  - @carbide/core@0.20.0

## 0.5.7

### Patch Changes

- Updated dependencies [69698e7]
  - @carbide/core@0.19.1

## 0.5.6

### Patch Changes

- Updated dependencies [2d09266]
  - @carbide/core@0.19.0

## 0.5.5

### Patch Changes

- Updated dependencies [e38f4b5]
  - @carbide/core@0.18.0

## 0.5.4

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.3

## 0.5.3

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.2

## 0.5.2

### Patch Changes

- Updated dependencies [5b82279]
  - @carbide/core@0.17.1

## 0.5.1

### Patch Changes

- Updated dependencies
  - @carbide/core@0.17.0

## 0.5.0

### Minor Changes

- f909bb3: HomeShell/HomeNav: neue Prop `navActions`/`actions` — Icon-Schaltflächen in der Fußzeile der Leiste oberhalb von Abmelden, für app-weiten Zustand wie einen zu öffnenden und zu sperrenden verschlüsselten Bereich; mit `tone` in einer Statusfarbe.

## 0.4.16

### Patch Changes

- @carbide/core@0.16.2

## 0.4.15

### Patch Changes

- Updated dependencies [61c2a91]
  - @carbide/core@0.16.1

## 0.4.14

### Patch Changes

- Updated dependencies [348f344]
  - @carbide/core@0.16.0

## 0.4.13

### Patch Changes

- Updated dependencies [9de90f3]
  - @carbide/core@0.15.0

## 0.4.12

### Patch Changes

- Updated dependencies [0ceda5c]
  - @carbide/core@0.14.0

## 0.4.11

### Patch Changes

- Updated dependencies [997b5a2]
  - @carbide/core@0.13.0

## 0.4.10

### Patch Changes

- Updated dependencies [f735877]
  - @carbide/core@0.12.0

## 0.4.9

### Patch Changes

- Updated dependencies [8a33e76]
  - @carbide/core@0.11.0

## 0.4.8

### Patch Changes

- Updated dependencies
  - @carbide/core@0.10.0

## 0.4.7

### Patch Changes

- Updated dependencies [72bfd12]
  - @carbide/core@0.9.0

## 0.4.6

### Patch Changes

- Updated dependencies [b7b981b]
  - @carbide/core@0.8.0

## 0.4.5

### Patch Changes

- Updated dependencies [8cbf5c2]
  - @carbide/core@0.7.0

## 0.4.4

### Patch Changes

- Updated dependencies [d8ad696]
  - @carbide/core@0.6.0

## 0.4.3

### Patch Changes

- Updated dependencies [e480b6f]
- Updated dependencies [1660573]
  - @carbide/core@0.5.0

## 0.4.2

### Patch Changes

- Updated dependencies [46f3c71]
  - @carbide/core@0.4.0
