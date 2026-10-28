# @odinscode/carbide-icons-scada

Plant symbols of [Carbide UI](https://github.com/odinscode-dev/carbide-ui) as React components: pumps, valves, tanks, piping, filters, heat exchangers and displays. Each symbol takes its state as a prop (for example `running`, `warning`, `alarm`, `fault`) and draws on a shared grid, so the connections line up into piping diagrams.

```bash
npm install @odinscode/carbide-token @odinscode/carbide-icons-scada react react-dom
```

```tsx
import "@odinscode/carbide-token/css/tokens.css";
import { CentrifugalPump } from "@odinscode/carbide-icons-scada";

export function Pump() {
  return <CentrifugalPump state="running" />;
}
```

[Storybook](https://showcase.growdog.tech/carbide-ui/) · [Repository](https://github.com/odinscode-dev/carbide-ui) · Apache License 2.0
