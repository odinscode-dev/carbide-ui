import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const LIGHT = ":root";

const LIGHT_THEME = ":root, [data-theme='light']";
const SYSTEM_DARK = "@media (prefers-color-scheme: dark) :root:not([data-theme='light'])";
const CHOSEN_DARK = "[data-theme='dark']";

interface Block {
  selector: string;
  declarations: Map<string, string>;
}

function parseBlocks(css: string): Block[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const result: Block[] = [];
  const stack: string[] = [];
  let buffer = "";

  for (const char of text) {
    if (char === "{") {
      stack.push(buffer.trim().replace(/\s+/g, " "));
      buffer = "";
      continue;
    }
    if (char === "}") {
      const declarations = new Map<string, string>();
      for (const part of buffer.split(";")) {
        const colonIndex = part.indexOf(":");
        if (colonIndex === -1) continue;
        declarations.set(
          part.slice(0, colonIndex).trim(),
          part
            .slice(colonIndex + 1)
            .trim()
            .replace(/\s+/g, " "),
        );
      }
      if (declarations.size > 0) {
        result.push({ selector: stack.join(" "), declarations });
      }
      buffer = "";
      stack.pop();
      continue;
    }
    buffer += char;
  }
  return result;
}

function readBlocks(path: string): Block[] {
  return parseBlocks(readFileSync(new URL(path, import.meta.url), "utf8"));
}

function block(file: Block[], selector: string): Map<string, string> {
  const matches = file.filter((b) => b.selector === selector);
  expect(matches, `Block ${selector} is missing or duplicated`).toHaveLength(1);

  const first = matches[0];
  if (first === undefined) {
    throw new Error(`Block ${selector} is missing`);
  }
  return first.declarations;
}

function check(
  declarations: Map<string, string> | Block | undefined,
  expected: Record<string, string>,
) {
  expect(declarations, "the expected block is missing").toBeDefined();
  if (declarations === undefined) {
    throw new Error("the expected block is missing");
  }
  const entries = declarations instanceof Map ? declarations : declarations.declarations;
  expect(Object.fromEntries(entries)).toStrictEqual(expected);
}

describe("primitive/gray.css: gray scale", () => {
  const file = readBlocks("./primitive/gray.css");

  it("carries the eleven cool-gray steps from decision/carbide-graupalette", () => {
    check(block(file, LIGHT), {
      "--carbide-gray-0": "oklch(1 0 0)",
      "--carbide-gray-100": "oklch(0.9668 0.0058 264.5)",
      "--carbide-gray-200": "oklch(0.9081 0.0081 253.9)",
      "--carbide-gray-300": "oklch(0.8268 0.0107 248.0)",
      "--carbide-gray-400": "oklch(0.7314 0.0129 248.0)",
      "--carbide-gray-500": "oklch(0.6414 0.0152 258.4)",
      "--carbide-gray-600": "oklch(0.5416 0.0139 248.1)",
      "--carbide-gray-700": "oklch(0.4387 0.0113 243.0)",
      "--carbide-gray-800": "oklch(0.3447 0.0120 243.2)",
      "--carbide-gray-900": "oklch(0.2680 0.0103 229.3)",
      "--carbide-gray-1000": "oklch(0.1973 0.0087 240.4)",
    });
  });

  it("knows only this one block", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT]);
  });
});

const RAMPS = {
  "--carbide-red-300": "#ff9e9e",
  "--carbide-red-400": "#ff7a7a",
  "--carbide-red-500": "#ff3d3d",
  "--carbide-red-600": "#db0000",
  "--carbide-red-700": "#c20000",
  "--carbide-red-800": "#990000",
  "--carbide-red-900": "#700000",
  "--carbide-orange-300": "#ffbb45",
  "--carbide-orange-400": "#ff9900",
  "--carbide-orange-500": "#fa6f00",
  "--carbide-orange-600": "#d14600",
  "--carbide-orange-700": "#9e3700",
  "--carbide-orange-800": "#7a2b00",
  "--carbide-orange-900": "#5c1b00",
  "--carbide-yellow-300": "#ffed4d",
  "--carbide-yellow-400": "#ffe347",
  "--carbide-yellow-500": "#fbd332",
  "--carbide-yellow-600": "#f2b100",
  "--carbide-yellow-700": "#db9200",
  "--carbide-yellow-800": "#9e6900",
  "--carbide-yellow-900": "#855900",
  "--carbide-green-300": "#62ff57",
  "--carbide-green-400": "#00e500",
  "--carbide-green-500": "#2bb534",
  "--carbide-green-600": "#00802f",
  "--carbide-green-700": "#007029",
  "--carbide-green-800": "#005c26",
  "--carbide-green-900": "#00471e",
  "--carbide-teal-300": "#00f5e4",
  "--carbide-teal-400": "#00d6c8",
  "--carbide-teal-500": "#00ada2",
  "--carbide-teal-600": "#008077",
  "--carbide-teal-700": "#00665f",
  "--carbide-teal-800": "#00524c",
  "--carbide-teal-900": "#003d39",
  "--carbide-blue-1-300": "#75cfff",
  "--carbide-blue-1-400": "#42b4ff",
  "--carbide-blue-1-500": "#0099ff",
  "--carbide-blue-1-600": "#006ce0",
  "--carbide-blue-1-700": "#004a9e",
  "--carbide-blue-1-800": "#003b8f",
  "--carbide-blue-1-900": "#002b66",
  "--carbide-blue-2-300": "#b1bfff",
  "--carbide-blue-2-400": "#92a2fe",
  "--carbide-blue-2-500": "#7887ff",
  "--carbide-blue-2-600": "#555ee1",
  "--carbide-blue-2-700": "#3a409e",
  "--carbide-blue-2-800": "#2f328f",
  "--carbide-blue-2-900": "#212466",
  "--carbide-purple-300": "#d4a8ff",
  "--carbide-purple-400": "#bf80ff",
  "--carbide-purple-500": "#ad5cff",
  "--carbide-purple-600": "#962eff",
  "--carbide-purple-700": "#7300e5",
  "--carbide-purple-800": "#5900b2",
  "--carbide-purple-900": "#45008a",
  "--carbide-pink-300": "#f69ec7",
  "--carbide-pink-400": "#f37ab7",
  "--carbide-pink-500": "#ef3fa5",
  "--carbide-pink-600": "#cc0a87",
  "--carbide-pink-700": "#b50877",
  "--carbide-pink-800": "#8e055d",
  "--carbide-pink-900": "#680242",
};

describe("primitive/ramps.css: nine tonal ramps with seven steps", () => {
  const file = readBlocks("./primitive/ramps.css");

  it("carries all 63 steps from Cloudscape's system palette (decision/carbide-farbrampen-tonal)", () => {
    check(block(file, LIGHT), RAMPS);
  });

  it("is a lightness scale: 300 is the lightest step, 900 the darkest", () => {
    // WCAG relative luminance — a plain channel sum would rank the pure
    // green 400 (#00e500) below the muted 500 (#2bb534).
    const brightness = (hex: string) => {
      const channel = (offset: number) => {
        const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
    };
    for (const hue of [
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue-1",
      "blue-2",
      "purple",
      "pink",
    ]) {
      const ramp = new Map(Object.entries(RAMPS));
      const color = (step: number): string => {
        const value = ramp.get(`--carbide-${hue}-${step}`);
        if (value === undefined) throw new Error(`no ${hue} ${step} in the ramp`);
        return value;
      };
      for (const step of [300, 400, 500, 600, 700, 800]) {
        expect(brightness(color(step)), `${hue} ${step}`).toBeGreaterThan(
          brightness(color(step + 100)),
        );
      }
    }
  });

  it("knows only this one block: the same values serve both themes", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT]);
  });
});

const ROLES_LIGHT = {
  "--carbide-bg": "var(--carbide-gray-100)",
  "--carbide-layer-1": "var(--carbide-gray-0)",
  "--carbide-layer-2": "var(--carbide-gray-100)",
  "--carbide-layer-3": "var(--carbide-gray-0)",
  "--carbide-field": "var(--carbide-gray-0)",
  "--carbide-border-subtle": "var(--carbide-gray-200)",
  "--carbide-border-strong": "var(--carbide-gray-500)",
  "--carbide-text": "var(--carbide-gray-1000)",
  "--carbide-text-2": "var(--carbide-gray-700)",
  "--carbide-text-placeholder": "var(--carbide-gray-400)",
  "--carbide-text-helper": "var(--carbide-gray-600)",
  "--carbide-inverse-bg": "var(--carbide-gray-800)",
  "--carbide-inverse-text": "var(--carbide-gray-100)",
  "--carbide-overlay": "color-mix(in oklab, var(--carbide-gray-1000) 50%, transparent)",
};

const ROLES_DARK = {
  "--carbide-bg": "var(--carbide-gray-1000)",
  "--carbide-layer-1": "var(--carbide-gray-900)",
  "--carbide-layer-2": "var(--carbide-gray-800)",
  "--carbide-layer-3": "var(--carbide-gray-700)",
  "--carbide-field": "var(--carbide-gray-900)",
  "--carbide-border-subtle": "var(--carbide-gray-800)",
  "--carbide-border-strong": "var(--carbide-gray-600)",
  "--carbide-text": "var(--carbide-gray-100)",
  "--carbide-text-2": "var(--carbide-gray-300)",
  "--carbide-text-placeholder": "var(--carbide-gray-600)",
  "--carbide-text-helper": "var(--carbide-gray-400)",
  "--carbide-inverse-bg": "var(--carbide-gray-100)",
  "--carbide-inverse-text": "var(--carbide-gray-1000)",
  "--carbide-overlay": "color-mix(in oklab, var(--carbide-gray-1000) 70%, transparent)",
};

const ACCENT_DARK = {
  "--carbide-accent": "oklch(0.78 0.12 245)",
  "--carbide-accent-text": "oklch(from var(--carbide-accent) calc(l + 0.09) c h)",
  "--carbide-accent-soft": "color-mix(in oklab, var(--carbide-accent) 22%, var(--carbide-layer-1))",
};

describe("semantic/color.css: roles, accent, signal", () => {
  const file = readBlocks("./semantic/color.css");

  it("populates all roles, the accent and the four signal colors in the light block", () => {
    check(block(file, LIGHT_THEME), {
      ...ROLES_LIGHT,
      "--carbide-accent": "oklch(0.60 0.14 245)",
      "--carbide-accent-text": "oklch(from var(--carbide-accent) calc(l - 0.09) c h)",
      "--carbide-accent-soft":
        "color-mix(in oklab, var(--carbide-accent) 16%, var(--carbide-layer-1))",
      "--carbide-signal-alarm": "oklch(0.58 0.22 27)",
      "--carbide-signal-warning": "oklch(0.78 0.17 80)",
      "--carbide-signal-ok": "oklch(0.66 0.18 145)",
      "--carbide-signal-manual": "oklch(0.60 0.18 250)",
      "--carbide-on-signal": "var(--carbide-gray-0)",
    });
  });

  it.each([SYSTEM_DARK, CHOSEN_DARK])(
    "populates the dark mapping and nothing else in %s",
    (selector) => {
      check(block(file, selector), { ...ROLES_DARK, ...ACCENT_DARK });
    },
  );

  it("keeps the order light, system setting, explicit choice", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT_THEME, SYSTEM_DARK, CHOSEN_DARK]);
  });

  it("defines no role that exists only in the dark block", () => {
    const light = block(file, LIGHT_THEME);
    for (const selector of [SYSTEM_DARK, CHOSEN_DARK]) {
      for (const name of block(file, selector).keys()) {
        expect(light.has(name), `${name} is missing in the light block`).toBe(true);
      }
    }
  });
});

const STATUS_LIGHT = {
  "--carbide-status-info-bg":
    "color-mix(in oklab, var(--carbide-accent) 10%, var(--carbide-layer-1))",
  "--carbide-status-info-border": "var(--carbide-accent)",
  "--carbide-status-info-text": "var(--carbide-accent-text)",
  "--carbide-status-success-bg":
    "color-mix(in oklab, var(--carbide-green-600) 10%, var(--carbide-layer-1))",
  "--carbide-status-success-border": "var(--carbide-green-600)",
  "--carbide-status-success-text": "var(--carbide-green-600)",
  "--carbide-status-warn-bg":
    "color-mix(in oklab, var(--carbide-yellow-600) 10%, var(--carbide-layer-1))",
  "--carbide-status-warn-border": "var(--carbide-yellow-600)",
  "--carbide-status-warn-text": "var(--carbide-yellow-800)",
  "--carbide-status-critical-bg":
    "color-mix(in oklab, var(--carbide-orange-600) 10%, var(--carbide-layer-1))",
  "--carbide-status-critical-border": "var(--carbide-orange-600)",
  "--carbide-status-critical-text": "var(--carbide-orange-600)",
  "--carbide-status-error-bg":
    "color-mix(in oklab, var(--carbide-red-600) 10%, var(--carbide-layer-1))",
  "--carbide-status-error-border": "var(--carbide-red-600)",
  "--carbide-status-error-text": "var(--carbide-red-600)",
};

const STATUS_DARK = {
  "--carbide-status-info-bg":
    "color-mix(in oklab, var(--carbide-accent) 16%, var(--carbide-layer-1))",
  "--carbide-status-info-border": "var(--carbide-accent)",
  "--carbide-status-info-text": "var(--carbide-accent-text)",
  "--carbide-status-success-bg":
    "color-mix(in oklab, var(--carbide-green-500) 16%, var(--carbide-layer-1))",
  "--carbide-status-success-border": "var(--carbide-green-500)",
  "--carbide-status-success-text": "var(--carbide-green-500)",
  "--carbide-status-warn-bg":
    "color-mix(in oklab, var(--carbide-yellow-400) 16%, var(--carbide-layer-1))",
  "--carbide-status-warn-border": "var(--carbide-yellow-400)",
  "--carbide-status-warn-text": "var(--carbide-yellow-400)",
  "--carbide-status-critical-bg":
    "color-mix(in oklab, var(--carbide-orange-400) 16%, var(--carbide-layer-1))",
  "--carbide-status-critical-border": "var(--carbide-orange-400)",
  "--carbide-status-critical-text": "var(--carbide-orange-400)",
  "--carbide-status-error-bg":
    "color-mix(in oklab, var(--carbide-red-400) 16%, var(--carbide-layer-1))",
  "--carbide-status-error-border": "var(--carbide-red-400)",
  "--carbide-status-error-text": "var(--carbide-red-400)",
};

describe("semantic/status.css: five statuses with surface, border and text", () => {
  const file = readBlocks("./semantic/status.css");

  it("populates all fifteen light roles from the ramps, info from the accent", () => {
    check(block(file, LIGHT_THEME), STATUS_LIGHT);
  });

  it.each([SYSTEM_DARK, CHOSEN_DARK])(
    "repeats every role in %s so nested cells get the dark ramp value",
    (selector) => {
      check(block(file, selector), STATUS_DARK);
    },
  );

  it("mixes every surface in oklab, never in oklch", () => {
    for (const [name, value] of block(file, LIGHT_THEME)) {
      if (name.endsWith("-bg")) {
        expect(value, name).toMatch(/^color-mix\(in oklab, /);
      }
    }
  });

  it("keeps the order light, system setting, explicit choice", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT_THEME, SYSTEM_DARK, CHOSEN_DARK]);
  });
});

const THRESHOLDS_LIGHT = {
  "--carbide-chart-threshold-negative": "#db0000",
  "--carbide-chart-threshold-positive": "#00802f",
  "--carbide-chart-threshold-info": "#006ce0",
  "--carbide-chart-threshold-neutral": "#656871",
};

const THRESHOLDS_DARK = {
  "--carbide-chart-threshold-negative": "#ff7a7a",
  "--carbide-chart-threshold-positive": "#2bb534",
  "--carbide-chart-threshold-info": "#75cfff",
  "--carbide-chart-threshold-neutral": "#a4a4ad",
};

const ERROR_BARS = {
  "--carbide-chart-errorbar-1": "var(--carbide-blue-2-300)",
  "--carbide-chart-errorbar-2": "var(--carbide-pink-300)",
  "--carbide-chart-errorbar-3": "var(--carbide-teal-300)",
  "--carbide-chart-errorbar-4": "var(--carbide-purple-300)",
  "--carbide-chart-errorbar-5": "var(--carbide-orange-300)",
  "--carbide-chart-errorbar-6": "var(--carbide-blue-2-400)",
  "--carbide-chart-errorbar-7": "var(--carbide-pink-400)",
  "--carbide-chart-errorbar-8": "var(--carbide-teal-400)",
};

/* Quiet on a dark surface means the darker end of the ramps. */
const ERROR_BARS_DARK = {
  "--carbide-chart-errorbar-1": "var(--carbide-blue-2-700)",
  "--carbide-chart-errorbar-2": "var(--carbide-pink-700)",
  "--carbide-chart-errorbar-3": "var(--carbide-teal-700)",
  "--carbide-chart-errorbar-4": "var(--carbide-purple-700)",
  "--carbide-chart-errorbar-5": "var(--carbide-orange-700)",
  "--carbide-chart-errorbar-6": "var(--carbide-blue-2-600)",
  "--carbide-chart-errorbar-7": "var(--carbide-pink-600)",
  "--carbide-chart-errorbar-8": "var(--carbide-teal-600)",
};

const SERIES_DARK = {
  "--carbide-chart-series-1": "oklch(0.66 0.13 245)",
  "--carbide-chart-series-2": "oklch(0.64 0.15 55)",
  "--carbide-chart-series-3": "oklch(0.64 0.15 350)",
  "--carbide-chart-series-4": "oklch(0.67 0.14 92)",
  "--carbide-chart-series-5": "oklch(0.62 0.14 300)",
  "--carbide-chart-series-6": "oklch(0.60 0.15 140)",
};

describe("semantic/chart.css: chart roles, series, thresholds, error bars", () => {
  const file = readBlocks("./semantic/chart.css");

  it("populates the chart roles and the six series slots in the light block", () => {
    check(block(file, LIGHT_THEME), {
      "--carbide-chart-grid": "var(--carbide-border-subtle)",
      "--carbide-chart-axis": "var(--carbide-border-strong)",
      "--carbide-chart-axis-text": "var(--carbide-text-2)",
      "--carbide-chart-series": "var(--carbide-chart-series-1)",
      "--carbide-chart-area-alpha": "0.12",
      "--carbide-chart-ref-line": "var(--carbide-accent-text)",
      "--carbide-chart-ref-area-alpha": "0.08",
      "--carbide-chart-tooltip-bg": "var(--carbide-inverse-bg)",
      "--carbide-chart-tooltip-text": "var(--carbide-inverse-text)",
      "--carbide-chart-series-1": "oklch(0.60 0.14 245)",
      "--carbide-chart-series-2": "oklch(0.66 0.16 55)",
      "--carbide-chart-series-3": "oklch(0.60 0.17 350)",
      "--carbide-chart-series-4": "oklch(0.72 0.14 92)",
      "--carbide-chart-series-5": "oklch(0.50 0.16 300)",
      "--carbide-chart-series-6": "oklch(0.55 0.15 140)",
      ...THRESHOLDS_LIGHT,
      ...ERROR_BARS,
    });
  });

  it.each([SYSTEM_DARK, CHOSEN_DARK])(
    "swaps series, thresholds and error bars in %s",
    (selector) => {
      check(block(file, selector), { ...SERIES_DARK, ...THRESHOLDS_DARK, ...ERROR_BARS_DARK });
    },
  );

  it("keeps the order light, system setting, explicit choice", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT_THEME, SYSTEM_DARK, CHOSEN_DARK]);
  });
});

const MONO_WEIGHTS = [100, 200, 300, 400, 500, 600, 800];

describe("typography.css: fonts, sizes and tracking", () => {
  const file = readBlocks("./typography.css");
  const fontFaces = file.filter((b) => b.selector === "@font-face");

  it("declares Carbide Sans with the weight range", () => {
    check(fontFaces[0], {
      "font-family": "'Carbide Sans'",
      "font-style": "normal",
      "font-weight": "300 700",
      "font-display": "swap",
      src: "url('../fonts/CarbideSans-Var.woff2') format('woff2')",
    });
  });

  it("declares Carbide Display with the weight range", () => {
    check(fontFaces[1], {
      "font-family": "'Carbide Display'",
      "font-style": "normal",
      "font-weight": "300 900",
      "font-display": "swap",
      src: "url('../fonts/CarbideDisplay-Var.woff2') format('woff2')",
    });
  });

  it.each(MONO_WEIGHTS)("declares Carbide Mono at %i", (weight) => {
    check(fontFaces[MONO_WEIGHTS.indexOf(weight) + 2], {
      "font-family": "'Carbide Mono'",
      "font-style": "normal",
      "font-weight": String(weight),
      "font-display": "swap",
      src: `url('../fonts/CarbideMono-${weight}.woff2') format('woff2')`,
    });
  });

  it("declares nine cuts and no more", () => {
    expect(fontFaces).toHaveLength(2 + MONO_WEIGHTS.length);
  });

  it("carries the font tokens from reference/carbide-tokens", () => {
    check(block(file, LIGHT), {
      "--carbide-font-sans": "'Carbide Sans', system-ui, sans-serif",
      "--carbide-font-display": "'Carbide Display', 'Carbide Sans', system-ui, sans-serif",
      "--carbide-font-mono": "'Carbide Mono', ui-monospace, monospace",
      "--carbide-fs-label": "12px",
      "--carbide-fs-small": "13px",
      "--carbide-fs-body": "var(--carbide-font-body)",
      "--carbide-fs-lead": "18px",
      "--carbide-fs-h3": "20px",
      "--carbide-fs-h2": "26px",
      "--carbide-fs-h1": "32px",
      "--carbide-fs-display": "44px",
      "--carbide-tracking-display": "-0.02em",
      "--carbide-tracking-heading": "-0.01em",
      "--carbide-tracking-body": "0",
      "--carbide-tracking-small": "0.01em",
      "--carbide-tracking-label": "0.02em",
      "--carbide-tracking-caps": "0.08em",
      "--carbide-tracking-dense": "0.005em",
    });
  });

  it("knows only the light block besides the cuts", () => {
    expect(file.filter((b) => b.selector !== "@font-face").map((b) => b.selector)).toStrictEqual([
      LIGHT,
    ]);
  });
});

describe("fonts/: the built font files", () => {
  const fontsDir = new URL("../fonts/", import.meta.url);

  it.each([
    "CarbideSans-Var.woff2",
    "CarbideSans-Italic-Var.woff2",
    "CarbideDisplay-Var.woff2",
    "CarbideDisplay-Italic-Var.woff2",
    ...MONO_WEIGHTS.map((weight) => `CarbideMono-${weight}.woff2`),
  ])("%s exists as WOFF2 in the package", (filename) => {
    const content = readFileSync(new URL(filename, fontsDir));
    expect(content.subarray(0, 4).toString("latin1")).toBe("wOF2");
  });

  it("includes the OFL license text for Carbide Sans and Display (Red Hat)", () => {
    const text = readFileSync(new URL("OFL.txt", fontsDir), "utf8");
    expect(text).toContain("SIL OPEN FONT LICENSE");
    expect(text).toContain("The Red Hat Project Authors");
  });

  it("includes the OFL license text for Carbide Mono (JetBrains Mono)", () => {
    const text = readFileSync(new URL("OFL-JetBrainsMono.txt", fontsDir), "utf8");
    expect(text).toContain("SIL OPEN FONT LICENSE");
    expect(text).toContain("The JetBrains Mono Project Authors");
  });
});

const COMPACT = ":root, [data-density='compact']";
const DENSE = "[data-density='dense']";
const LARGE = "[data-density='large']";

describe("density.css: spacing and the three density sets", () => {
  const file = readBlocks("./density.css");

  it("carries the ten spacings from reference/carbide-tokens", () => {
    check(block(file, LIGHT), {
      "--carbide-sp-1": "2px",
      "--carbide-sp-2": "4px",
      "--carbide-sp-3": "8px",
      "--carbide-sp-4": "12px",
      "--carbide-sp-5": "16px",
      "--carbide-sp-6": "24px",
      "--carbide-sp-7": "32px",
      "--carbide-sp-8": "48px",
      "--carbide-sp-9": "64px",
      "--carbide-sp-10": "80px",
    });
  });

  it("populates compact and makes the same set the default without an attribute", () => {
    check(block(file, COMPACT), {
      "--carbide-font-body": "14px",
      "--carbide-fs-body": "var(--carbide-font-body)",
      "--carbide-control-h": "32px",
      "--carbide-row-h": "32px",
      "--carbide-gutter": "16px",
      "--carbide-touch-min": "0",
      "--carbide-radius": "0",
      "--carbide-radius-surface": "var(--carbide-radius)",
      "--carbide-radius-control": "var(--carbide-radius)",
    });
  });

  it("populates dense with the tracking surcharge for roles under 16 px", () => {
    check(block(file, DENSE), {
      "--carbide-font-body": "13px",
      "--carbide-fs-body": "var(--carbide-font-body)",
      "--carbide-tracking-body": "0.005em",
      "--carbide-tracking-small": "0.015em",
      "--carbide-tracking-label": "0.025em",
      "--carbide-control-h": "28px",
      "--carbide-row-h": "24px",
      "--carbide-gutter": "8px",
      "--carbide-touch-min": "0",
      "--carbide-radius": "0",
      "--carbide-radius-surface": "var(--carbide-radius)",
      "--carbide-radius-control": "var(--carbide-radius)",
    });
  });

  it("populates large with the minimum touch size", () => {
    check(block(file, LARGE), {
      "--carbide-font-body": "16px",
      "--carbide-fs-body": "var(--carbide-font-body)",
      "--carbide-control-h": "44px",
      "--carbide-row-h": "48px",
      "--carbide-gutter": "24px",
      "--carbide-touch-min": "44px",
      "--carbide-radius": "2px",
      "--carbide-radius-surface": "var(--carbide-radius)",
      "--carbide-radius-control": "var(--carbide-radius)",
    });
  });

  it.each([COMPACT, DENSE, LARGE])("sets --carbide-fs-body next to its source in %s", (set) => {
    const declarations = block(file, set);
    expect(declarations.has("--carbide-font-body")).toBe(true);
    expect(declarations.get("--carbide-fs-body")).toBe("var(--carbide-font-body)");
  });

  it("keeps the order compact, dense, large", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT, COMPACT, DENSE, LARGE]);
  });
});

describe("semantic/home.css: the home surface", () => {
  const file = readBlocks("./semantic/home.css");
  const HOME = "[data-surface='home']";
  const HOME_LIGHT = ":root[data-surface='home'], [data-surface='home'][data-theme='light']";
  const HOME_SYSTEM_DARK =
    "@media (prefers-color-scheme: dark) :root[data-surface='home']:not([data-theme='light'])";
  const HOME_CHOSEN_DARK = "[data-surface='home'][data-theme='dark']";

  const shape = {
    "--carbide-radius": "4px",
    "--carbide-radius-surface": "18px",
    "--carbide-radius-control": "12px",
    "--carbide-home-radius-inner": "14px",
    "--carbide-field-border-width": "1px",
    "--carbide-field-radius-end": "var(--carbide-radius-control)",
  };
  const light = {
    "--carbide-bg": "#eef2ec",
    "--carbide-layer-1": "#ffffff",
    "--carbide-layer-2": "#f6f8f4",
    "--carbide-layer-3": "#ffffff",
    "--carbide-field": "#f6f8f4",
    "--carbide-border-subtle": "#dfe5dd",
    "--carbide-text": "#1d2823",
    "--carbide-text-2": "#5a6a60",
    "--carbide-text-helper": "#5a6a60",
    "--carbide-text-placeholder": "#8a978f",
  };
  const dark = {
    "--carbide-bg": "#14181a",
    "--carbide-layer-1": "#1e2426",
    "--carbide-layer-2": "#242b2d",
    "--carbide-layer-3": "#1e2426",
    "--carbide-field": "#242b2d",
    "--carbide-border-subtle": "#2f383b",
    "--carbide-text": "#eef2ec",
    "--carbide-text-2": "#a9b4ad",
    "--carbide-text-helper": "#a9b4ad",
    "--carbide-text-placeholder": "#7d8983",
  };

  it("carries the radii and the field shape on every surface element", () => {
    check(block(file, HOME), shape);
  });

  it("carries the light palette on the document element and on an explicit light theme", () => {
    check(block(file, HOME_LIGHT), light);
  });

  it("declares no palette on a plain surface element: it inherits the document element's theme", () => {
    // Regression: a light palette on every [data-surface='home'] painted the
    // shell root light over a dark document element (found live in growdog).
    expect(block(file, HOME).has("--carbide-bg")).toBe(false);
    expect(block(file, HOME).has("--carbide-text")).toBe(false);
  });

  it("carries the dark palette for the system preference and for a chosen theme", () => {
    check(block(file, HOME_SYSTEM_DARK), dark);
    check(block(file, HOME_CHOSEN_DARK), dark);
  });

  it("sets nothing without the attribute: every block is scoped to the surface", () => {
    for (const b of file) {
      expect(b.selector).toContain(HOME.slice(0, HOME.indexOf("=")));
    }
  });

  it("comes after density.css so the surface wins over a density on the same element", () => {
    const text = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
    expect(text.indexOf("./semantic/home.css")).toBeGreaterThan(text.indexOf("./density.css"));
  });
});

const REDUCED = "@media (prefers-reduced-motion: reduce) :root";

const DURATIONS = {
  "--carbide-duration-fast-1": "70ms",
  "--carbide-duration-fast-2": "110ms",
  "--carbide-duration-moderate-1": "150ms",
  "--carbide-duration-moderate-2": "240ms",
  "--carbide-duration-slow-1": "400ms",
  "--carbide-duration-slow-2": "700ms",
};

describe("motion.css: layers and motion", () => {
  const file = readBlocks("./motion.css");

  it("carries the layers and the motion from reference/carbide-tokens", () => {
    check(block(file, LIGHT), {
      "--carbide-z-hidden": "-1",
      "--carbide-z-header": "8000",
      "--carbide-z-overlay": "8000",
      "--carbide-z-modal": "9000",
      "--carbide-z-dropdown": "9100",
      "--carbide-z-floating": "10000",
      ...DURATIONS,
      "--carbide-ease-standard": "cubic-bezier(0.2, 0, 0.38, 0.9)",
      "--carbide-ease-entrance": "cubic-bezier(0, 0, 0.38, 0.9)",
      "--carbide-ease-exit": "cubic-bezier(0.2, 0, 1, 0.9)",
    });
  });

  it("sets every duration to 0ms under prefers-reduced-motion and nothing else", () => {
    check(
      block(file, REDUCED),
      Object.fromEntries(Object.keys(DURATIONS).map((token) => [token, "0ms"])),
    );
  });

  it("knows exactly these two blocks", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT, REDUCED]);
  });
});

const SYNTAX = {
  "--carbide-syntax-keyword": "var(--carbide-purple-600)",
  "--carbide-syntax-string": "var(--carbide-green-600)",
  "--carbide-syntax-number": "var(--carbide-orange-600)",
  "--carbide-syntax-function": "var(--carbide-blue-2-600)",
  "--carbide-syntax-name": "var(--carbide-teal-600)",
  "--carbide-syntax-variable": "var(--carbide-blue-1-600)",
};

const SYNTAX_DARK = {
  "--carbide-syntax-keyword": "var(--carbide-purple-400)",
  "--carbide-syntax-string": "var(--carbide-green-500)",
  "--carbide-syntax-number": "var(--carbide-orange-400)",
  "--carbide-syntax-function": "var(--carbide-blue-2-400)",
  "--carbide-syntax-name": "var(--carbide-teal-500)",
  "--carbide-syntax-variable": "var(--carbide-blue-1-400)",
};

describe("semantic/syntax.css: six roles for syntax highlighting", () => {
  const file = readBlocks("./semantic/syntax.css");

  it("populates the six roles at step 600 in the light block", () => {
    check(block(file, LIGHT_THEME), SYNTAX);
  });

  it.each([SYSTEM_DARK, CHOSEN_DARK])("reads the lighter steps in %s", (selector) => {
    check(block(file, selector), SYNTAX_DARK);
  });

  it("keeps the order light, system setting, explicit choice", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT_THEME, SYSTEM_DARK, CHOSEN_DARK]);
  });
});

describe("breakpoint.css: the five Carbon breakpoints", () => {
  const file = readBlocks("./breakpoint.css");

  it("carries the five steps from reference/carbide-tokens", () => {
    check(block(file, LIGHT), {
      "--carbide-bp-sm": "320px",
      "--carbide-bp-md": "672px",
      "--carbide-bp-lg": "1056px",
      "--carbide-bp-xlg": "1312px",
      "--carbide-bp-max": "1584px",
    });
  });

  it("knows only this one block", () => {
    expect(file.map((b) => b.selector)).toStrictEqual([LIGHT]);
  });
});

describe("tokens.css", () => {
  const text = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");

  it.each([
    "primitive/gray.css",
    "primitive/ramps.css",
    "semantic/color.css",
    "semantic/status.css",
    "density.css",
    "semantic/home.css",
    "typography.css",
    "motion.css",
    "semantic/chart.css",
    "semantic/syntax.css",
    "breakpoint.css",
  ])("imports %s", (path) => {
    expect(text).toContain(`@import './${path}';`);
  });
});
