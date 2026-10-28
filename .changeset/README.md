# Changesets

Jede Änderung, die ein veröffentlichtes Paket betrifft, bringt eine Datei
hier mit — im selben Commit. Aufbau:

```md
---
"@odinscode/carbide-core": patch
---

Ein deutscher Satz: was sich für den Verbraucher ändert.
```

`patch` für Korrekturen, `minor` für neue Props oder Komponenten, `major`
für Umbenennungen und entfernte Exporte. Mehrere Pakete in einer Datei sind
erlaubt. `pnpm changeset` fragt das interaktiv ab, von Hand schreiben geht
genauso.

Veröffentlichen: `pnpm version-packages` hebt Versionen, schreibt die
`CHANGELOG.md` je Paket, bumpt abhängige Pakete (`core` neu ⇒ `shell` und
`home` bekommen einen Patch) und löscht die Changeset-Dateien. Das
committen und pushen — die CI veröffentlicht auf `main` alles, dessen
Version noch nicht in der Registry liegt, und setzt Git-Tags.

