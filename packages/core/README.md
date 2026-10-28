# @odinscode/carbide-core

The components of [Carbide UI](https://github.com/odinscode-dev/carbide-ui) for React 19: forms, dialogs, menus, navigation, a data grid with sorting, filters, selection and virtual scrolling, and charts. Every component works in the light and the dark theme and in three densities.

```bash
npm install @odinscode/carbide-token @odinscode/carbide-core react react-dom
```

```tsx
import "@odinscode/carbide-token/css/tokens.css";
import { Button } from "@odinscode/carbide-core";

export function Save() {
  return <Button variant="primary">Save</Button>;
}
```

[Storybook](https://showcase.growdog.tech/carbide-ui/) · [Repository](https://github.com/odinscode-dev/carbide-ui) · Apache License 2.0
