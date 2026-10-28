import type { Meta, StoryObj } from "@storybook/react-vite";
import type { SyntheticEvent } from "react";
import gray from "../primitive/gray.css?inline";
import ramps from "../primitive/ramps.css?inline";
import chart from "../semantic/chart.css?inline";
import color from "../semantic/color.css?inline";
import status from "../semantic/status.css?inline";

const TOKENS = [gray, ramps, color, status, chart].join("\n");

interface Panel {
  title: string;
  tokens: string[];
  background?: string;
}

const PANELS: Panel[] = [
  {
    title: "Gray scale",
    tokens: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map(
      (step) => `--carbide-gray-${step}`,
    ),
  },
  {
    title: "Roles",
    tokens: [
      "--carbide-bg",
      "--carbide-layer-1",
      "--carbide-layer-2",
      "--carbide-layer-3",
      "--carbide-field",
      "--carbide-border-subtle",
      "--carbide-border-strong",
      "--carbide-text",
      "--carbide-text-2",
      "--carbide-text-placeholder",
      "--carbide-text-helper",
      "--carbide-inverse-bg",
      "--carbide-inverse-text",
    ],
  },
  {
    title: "Accent",
    tokens: ["--carbide-accent", "--carbide-accent-text", "--carbide-accent-soft"],
  },
  {
    title: "Signal, same in both themes",
    tokens: [
      "--carbide-signal-alarm",
      "--carbide-signal-warning",
      "--carbide-signal-ok",
      "--carbide-signal-manual",
    ],
  },
  {
    title: "Status: info, success, warn, critical, error",
    tokens: ["info", "success", "warn", "critical", "error"].flatMap((status) =>
      ["bg", "border", "text"].map((role) => `--carbide-status-${status}-${role}`),
    ),
  },
  {
    title: "Series, fixed order",
    tokens: [1, 2, 3, 4, 5, 6].map((slot) => `--carbide-chart-series-${slot}`),
    background: "var(--carbide-layer-1)",
  },
  {
    title: "Thresholds, above every palette",
    tokens: ["negative", "positive", "info", "neutral"].map(
      (kind) => `--carbide-chart-threshold-${kind}`,
    ),
    background: "var(--carbide-layer-1)",
  },
  {
    title: "Series with error bars, fixed order",
    tokens: [1, 2, 3, 4, 5, 6, 7, 8].map((slot) => `--carbide-chart-errorbar-${slot}`),
    background: "var(--carbide-layer-1)",
  },
];

function panel({ title, tokens, background = "var(--carbide-layer-1)" }: Panel): string {
  const rows = tokens
    .map(
      (token) => `
        <li class="row">
          <span class="swatch" style="background: var(${token})"></span>
          <code class="name">${token}</code>
          <code class="value" data-token="${token}"></code>
        </li>`,
    )
    .join("");
  return `
    <section class="panel" style="background: ${background}">
      <h2>${title}</h2>
      <ul class="list">${rows}</ul>
    </section>`;
}

const RESOLVE = `
  const root = getComputedStyle(document.documentElement);
  for (const field of document.querySelectorAll('[data-token]')) {
    field.textContent = root.getPropertyValue(field.dataset.token).trim();
  }`;

function renderDocument(theme: "light" | "dark"): string {
  return `<!doctype html>
<html lang="en" data-theme="${theme}">
<head><meta charset="utf-8"><style>
${TOKENS}
body {
  margin: 0;
  padding: 16px;
  background: var(--carbide-bg);
  color: var(--carbide-text);
  font-family: system-ui, sans-serif;
  font-size: 13px;
}
h1 { font-size: 16px; margin: 0 0 16px; }
h2 { font-size: 13px; margin: 0 0 8px; color: var(--carbide-text-2); font-weight: 500; }
.panel { padding: 12px; margin-bottom: 12px; border: 1px solid var(--carbide-border-subtle); }
.list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.row { display: grid; grid-template-columns: 32px 15em 1fr; align-items: center; gap: 8px; }
.swatch { height: 24px; border: 1px solid var(--carbide-border-strong); }
.name { font-family: ui-monospace, monospace; }
.value { font-family: ui-monospace, monospace; color: var(--carbide-text-helper); }
</style></head>
<body>
<h1>${theme === "dark" ? "Dark" : "Light"} &mdash; data-theme="${theme}"</h1>
${PANELS.map(panel).join("")}
<script>${RESOLVE}</script>
</body></html>`;
}

function resize(event: SyntheticEvent<HTMLIFrameElement>) {
  const frame = event.currentTarget;
  const content = frame.contentDocument;
  if (content === null) {
    throw new Error("The preview frame has no document.");
  }
  frame.style.height = `${content.documentElement.scrollHeight}px`;
}

function Colors() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
      {(["light", "dark"] as const).map((theme) => (
        <iframe
          key={theme}
          onLoad={resize}
          srcDoc={renderDocument(theme)}
          style={{ width: "100%", border: "0" }}
          title={`Color tokens ${theme}`}
        />
      ))}
    </div>
  );
}

const meta: Meta<typeof Colors> = {
  title: "Tokens/Colors",
  component: Colors,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Colors>;

export const Default: Story = {};
