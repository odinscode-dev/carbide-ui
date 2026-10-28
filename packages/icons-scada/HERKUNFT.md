# Herkunft

Eine Zeile je Datei mit eigenen Zeichnungen. Grundlage ist immer eine eigene
Geometrie, nicht der Pfad oder die Proportion einer fremden Datei. Motiv und
Verhalten (Füllstand, Rotation, Zustand am Rand) sind aus der Sichtung von
SCADA-Oberflächen wie ThingsBoard/IronFlock und AggreGate übernommen; die Optik
ist in jedem Fall eigenes Werk.

## Aufbau seit 2026-10-18

Der gesamte Symbolsatz wurde neu gezeichnet und auf einen reduzierten Umfang
gebracht, weil sich Anschlussleitungen und Körper überlappten. Eigene
Geometrie nach einem gemeinsamen Raster: `viewBox 0 0 96 96`, Anschlüsse am
Rand (N 48,0 / S 48,96 / W 0,48 / E 96,48), Leitung 6 px mit eckigen Enden,
Kontur 2 px, Stutzen enden exakt auf der Kontur. Der Entwurf entstand als
SVG-Blätter mit Unterstützung eines KI-Agenten, wurde von Hand geprüft und
abgenommen und danach als Komponenten umgesetzt. Alle Zeichnungen sind
eigenes Werk.

| Datei | Motiv | Herkunft |
|---|---|---|
| `src/symbol/Symbol.tsx`, `Symbol.module.css`, `states.ts`, `Vessel.tsx` | gemeinsamer Rahmen, Strichstärken, Zustandsfarben, Füllstandsfläche | eigenes Werk, kein Paket-Export |
| `src/Containers/ConicalTank.tsx`, `CylindricalTank.tsx`, `Ibc.tsx` | Trichtertank, Zylindertank mit flachem Deckel und Boden, IBC | eigenes Werk |
| `src/Displays/*Display.tsx` | Anzeigen F, P, L, pH, EC, I | eigenes Werk |
| `src/Filtration/Filter.tsx` | Filter | eigenes Werk |
| `src/HeatTransfer/HeatExchanger.tsx` | Rohrbündel-Wärmetauscher | eigenes Werk |
| `src/Mixing/StaticMixer.tsx` | statischer Mischer mit vier Leitblechen | eigenes Werk |
| `src/Piping/*.tsx` | Rohre, Ablauf, Tropfer, Düse, Verteiler mit 2/4/6/8 Abgängen als Sammelrohr | eigenes Werk |
| `src/Pumps/*.tsx` | Kreisel-, Membran-, Dosierpumpe | eigenes Werk |
| `src/Switches/*.tsx` | 3-Wege-Hahn mit Motor und mit Handrad, Stellung über `position` | eigenes Werk |
| `src/Valves/*.tsx` | Kugelhahn mit Motor und mit Handrad, Rückschlagventil, Überdruckventil als Eckventil | eigenes Werk |

Nachbesserung am selben Tag: Verteiler mit Zulauf von N auf der Mittellinie
(statt W, dort war der Zulauf beim Verteiler-8 nur 3 px lang), Membran der
Membran- und Dosierpumpe setzt auf der Höhe der Anschlussleitungen an (y 48,
vorher y 56), Zulaufpfeil des 3-Wege-Hahns als gefülltes Dreieck (12 × 14, bei
48 px lesbar).

Entfallen sind: Horizontaltank, Gasflasche, Flaschenbündel, Vertikaltank mit
Kuppel (`VerticalTank`), Separator, CO2-Anzeige, `GenericSensor`.
