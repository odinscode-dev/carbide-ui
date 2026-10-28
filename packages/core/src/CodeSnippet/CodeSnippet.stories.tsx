import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { matrix } from "../../../../.storybook/matrix.js";
import { CodeSnippet } from "./CodeSnippet.js";

const ONE_LINER = "pnpm add @odinscode/carbide-core @odinscode/carbide-token";

const BLOCK = `import { Tree } from "@odinscode/carbide-core";

export function Plant() {
  return <Tree nodes={NODES} expanded={["hall-1"]} />;
}`;

const LANG = `services:
  web:
    image: nginx:1.29-alpine
    restart: unless-stopped
    environment:
      - TZ=Europe/Berlin
      - NGINX_HOST=example.com
      - NGINX_PORT=80
      - NGINX_ENTRYPOINT_QUIET_LOGS=1
      - NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d # templates are rendered into this directory on start
    volumes:
      - ./site:/usr/share/nginx/html:ro
    ports:
      - "8080:80"`;

const GO = `package main

import "fmt"

func main() {
	x := 1 // count
	fmt.Println(x)
}`;

const CSS_SNIPPET = `.root[data-state='collapsed'] {
  max-height: calc(10 * 1.5 * var(--carbide-fs-body));
  /* fade-out at the bottom edge */
}`;

const SQL_SNIPPET = "SELECT id, name FROM tickets WHERE state = 'open' ORDER BY id LIMIT 10;";

const JSON_SNIPPET = `{ "name": "@odinscode/carbide-core", "private": true, "count": 8 }`;

const HTML_SNIPPET = `<button type="button" aria-label="Copy">
  <!-- Icon -->
</button>`;

const BASH_SNIPPET =
  'curl -sS -H "Authorization: Bearer $API_TOKEN" https://api.example.com/v1/projects/carbide-ui/issues';

const meta: Meta<typeof CodeSnippet> = {
  title: "Core/CodeSnippet",
  component: CodeSnippet,
  args: { code: ONE_LINER },
};
export default meta;

type Story = StoryObj<typeof CodeSnippet>;

export const Default: Story = {};

export const Single: Story = { args: { type: "single" } };

export const Multi: Story = { args: { type: "multi", code: BLOCK } };

export const Collapsed: Story = { args: { type: "multi", code: LANG, collapsible: true } };

export const Expanded: Story = {
  args: { type: "multi", code: LANG, collapsible: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Show more" }));
    await expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
  },
};

export const Copied: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole("button", { name: "Copy" }));
  },
};

export const LongLine: Story = {
  args: {
    code: 'curl -sS -H "Authorization: Bearer $API_TOKEN" https://api.example.com/v1/projects/carbide-ui/issues?state=open&limit=50 | jq -r ".[] | .number, .title"',
  },
};

export const Highlighted: Story = { args: { type: "multi", code: BLOCK, language: "tsx" } };

export const Languages: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", width: "100%" }}>
      <CodeSnippet code={BLOCK} language="tsx" type="multi" />
      <CodeSnippet code={GO} language="go" type="multi" />
      <CodeSnippet code={HTML_SNIPPET} language="html" type="multi" />
      <CodeSnippet code={CSS_SNIPPET} language="css" type="multi" />
      <CodeSnippet code={SQL_SNIPPET} language="sql" />
      <CodeSnippet code={LANG} language="yaml" type="multi" />
      <CodeSnippet code={JSON_SNIPPET} language="json" />
      <CodeSnippet code={BASH_SNIPPET} language="bash" />
    </div>
  ),
};

export const Matrix: Story = {
  decorators: [matrix],
  parameters: { layout: "fullscreen" },
  render: () => (
    <div style={{ display: "grid", gap: "var(--carbide-sp-3)", width: "100%" }}>
      <CodeSnippet code={ONE_LINER} />
      <CodeSnippet code={BLOCK} language="tsx" type="multi" />
      <CodeSnippet code={LANG} collapsible type="multi" />
      <CodeSnippet code={LANG} collapsible type="multi" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button", { name: "Show more" });

    for (const [index, button] of buttons.entries()) {
      if (index % 2 === 1) {
        await userEvent.click(button);
      }
    }
  },
};
