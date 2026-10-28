export interface QuantitySpec {
  quantity: "pressure" | "flow" | "volume" | "conductivity" | "ph" | "temperature" | "level";
  fractionDigits: number;
}

export const QUANTITIES = {
  bar: { quantity: "pressure", fractionDigits: 2 },
  "l/min": { quantity: "flow", fractionDigits: 1 },
  ml: { quantity: "volume", fractionDigits: 0 },
  "mS/cm": { quantity: "conductivity", fractionDigits: 2 },
  pH: { quantity: "ph", fractionDigits: 1 },
  "°C": { quantity: "temperature", fractionDigits: 1 },
  "%": { quantity: "level", fractionDigits: 0 },
} as const satisfies Record<string, QuantitySpec>;

export type Unit = keyof typeof QUANTITIES;
