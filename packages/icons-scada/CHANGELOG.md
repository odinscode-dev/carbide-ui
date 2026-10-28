# @carbide/icons-scada

## 1.3.2

### Patch Changes

- 6a04075: Alle Pakete tragen auf npmjs.com das Schlagwort `design-system`. Am Code ändert sich nichts.
- Updated dependencies [6a04075]
  - @odinscode/carbide-token@0.9.2

## 1.3.1

### Patch Changes

- 170393e: Paketseiten auf npmjs.com: README je Paket, englische Beschreibung, Schlagwörter und Verweise auf GitHub und das Storybook. Am Code ändert sich nichts.
- Updated dependencies [170393e]
  - @odinscode/carbide-token@0.9.1

## 1.3.0

### Minor Changes

- 9868b05: Neuer Name, öffentlich auf npmjs.com: Die Pakete heißen jetzt `@odinscode/carbide-core`, `-token`, `-shell`, `-icons-scada` und `-home` statt `@carbide-ui/…`. Verbraucher ersetzen die Namen in `package.json`, Importen und CSS-Importen und brauchen keinen Registry-Eintrag in `.npmrc` mehr.

### Patch Changes

- Updated dependencies [9868b05]
- Updated dependencies [6198e83]
  - @odinscode/carbide-token@0.9.0

## 1.2.1

### Patch Changes

- Updated dependencies [dae69c6]
  - @carbide-ui/token@0.8.0

## 1.2.0

### Minor Changes

- cc1cf98: Neuer Name und neue Lizenz: Die Pakete heißen jetzt `@carbide-ui/*` statt `@carbide/*` (der Scope `@carbide` gehört auf npm jemand anderem) und stehen unter Apache 2.0. Verbraucher ersetzen `@carbide/` in `package.json`, Importen und CSS-Importen durch `@carbide-ui/` und tragen in `.npmrc` `@carbide-ui:registry=` statt `@carbide:registry=` ein. Die Schriften in `@carbide-ui/token` bleiben unter der OFL 1.1.

### Patch Changes

- Updated dependencies [cc1cf98]
  - @carbide-ui/token@0.7.0

## 1.1.0

### Minor Changes

- 05514de: Verteiler (Manifold2/4/6/8) nehmen den Zulauf jetzt von oben auf der Mittellinie statt von links; Membran der Membran- und Dosierpumpe setzt auf Höhe der Anschlussleitungen an, der Zulaufpfeil der 3-Wege-Hähne ist ein gefülltes Dreieck.

## 1.0.0

### Major Changes

- 99e0a5e: Anlagensymbole neu gezeichnet auf einem gemeinsamen 96-px-Raster mit Anschlüssen am Rand, ohne Überlappungen; entfernt sind VerticalTank (ersetzt durch CylindricalTank), HorizontalTank, GasCylinder, CylinderBundle, Separator, Co2Display und GenericSensor, neu sind CylindricalTank, Ibc und die Prop position an SwitchMotor und SwitchHandwheel; SwitchActuatorState entfällt (ActuatorState nehmen); die Kreiselpumpe hat keinen fillLevel mehr, Filter und HeatExchanger keine state-Prop, EquipmentState ist wieder exportiert.

## 0.2.6

### Patch Changes

- Updated dependencies [c749983]
  - @carbide/token@0.6.1

## 0.2.5

### Patch Changes

- Updated dependencies [57384c7]
  - @carbide/token@0.6.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @carbide/token@0.5.0

## 0.2.3

### Patch Changes

- Updated dependencies [988845b]
  - @carbide/token@0.4.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @carbide/token@0.3.0

## 0.2.1

### Patch Changes

- Updated dependencies [b7b981b]
  - @carbide/token@0.2.0

## 0.2.0

### Minor Changes

- afc467f: Zustände je Gerätegruppe statt eines gemeinsamen `EquipmentState` (Ticket #97): Anzeigen melden `DisplayState` (ok/warning/alarm/fault, ok grün), Behälter `ContainerState` (fillable/empty/full/overfilled/locked), Kugelhahn mit Motor und Motor-Weiche `ActuatorState` (closed/open/moving/fault/stopped — stopped als hohler Ring), Überdruckventil `ReliefValveState` (ok/alarm). Rückschlagventil, Kugelhahn und Weiche mit Handrad sowie der statische Mischer haben keinen Zustand mehr (`state`-Prop entfernt). Statischer Mischer nach Odins Skizze neu gezeichnet. Füllstandsfläche der Tanks wird jetzt tatsächlich auf die Silhouette beschnitten und deckt das ganze Gefäß ab (100 % = voll).

## 0.1.1

### Patch Changes

- Kreiselpumpe: Zustandspunkt sitzt jetzt wie bei allen anderen Symbolen bei (86, 12) mit Radius 7 statt (82, 14) mit Radius 6. Stilprüfblatt-Story `Icons/StyleGuide` entfernt; `@carbon/icons-react` und `@tabler/icons-react` sind keine devDependencies mehr.
