// @vitest-environment jsdom

import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Accordion } from "../Accordion/Accordion.js";
import { Alert } from "../Alert/Alert.js";
import { Badge } from "../Badge/Badge.js";
import { CodeSnippet } from "../CodeSnippet/CodeSnippet.js";
import { Dialog } from "../Dialog/Dialog.js";
import { Divider } from "../Divider/Divider.js";
import { Drawer } from "../Drawer/Drawer.js";
import { Flashbar } from "../Flashbar/Flashbar.js";
import { Form } from "../Form/Form.js";
import { InlineLoading } from "../InlineLoading/InlineLoading.js";
import { Link } from "../Link/Link.js";
import { List } from "../List/List.js";
import { Notification } from "../Notification/Notification.js";
import { ProgressBar } from "../ProgressBar/ProgressBar.js";
import { ProgressIndicator } from "../ProgressIndicator/ProgressIndicator.js";
import { Search } from "../Search/Search.js";
import { StructuredList } from "../StructuredList/StructuredList.js";
import { Tag } from "../Tag/Tag.js";
import { Textarea } from "../Textarea/Textarea.js";
import { TextInput } from "../TextInput/TextInput.js";
import { Tree } from "../Tree/Tree.js";
import { Wizard } from "../Wizard/Wizard.js";

// A caller's `className` has to reach the element it is meant for, next to
// the component's own class. Where `...rest` goes to an input, the class goes
// to that input, not to the wrapper.
const CASES: readonly { name: string; element: ReactElement; tag: string }[] = [
  {
    name: "Accordion",
    element: <Accordion className="mine" items={[{ value: "a", title: "A", content: "x" }]} />,
    tag: "div",
  },
  {
    name: "Alert",
    element: <Alert className="mine">x</Alert>,
    tag: "div",
  },
  { name: "Badge", element: <Badge className="mine">x</Badge>, tag: "span" },
  { name: "CodeSnippet", element: <CodeSnippet className="mine" code="a" />, tag: "div" },
  { name: "Divider", element: <Divider className="mine" />, tag: "hr" },
  {
    name: "Drawer",
    element: (
      <Drawer className="mine" open title="T">
        x
      </Drawer>
    ),
    tag: "div",
  },
  {
    name: "Flashbar",
    element: (
      <Flashbar
        className="mine"
        items={[{ id: "a", state: "info", title: "T", content: "x", onDismiss: () => undefined }]}
      />
    ),
    tag: "div",
  },
  { name: "Form", element: <Form className="mine" />, tag: "form" },
  { name: "InlineLoading", element: <InlineLoading className="mine" />, tag: "div" },
  {
    name: "Link",
    element: (
      <Link className="mine" href="/">
        x
      </Link>
    ),
    tag: "a",
  },
  { name: "List", element: <List className="mine" items={[]} />, tag: "ul" },
  {
    name: "Notification",
    element: <Notification className="mine">x</Notification>,
    tag: "div",
  },
  { name: "ProgressBar", element: <ProgressBar className="mine" label="L" />, tag: "div" },
  {
    name: "ProgressIndicator",
    element: (
      <ProgressIndicator className="mine" current={0} steps={[{ label: "A", state: "current" }]} />
    ),
    tag: "div",
  },
  { name: "Search", element: <Search className="mine" />, tag: "input" },
  {
    name: "StructuredList",
    element: (
      <StructuredList
        className="mine"
        columns={[{ key: "a", header: "A" }]}
        rows={[{ value: "r", cells: { a: "x" } }]}
      />
    ),
    tag: "table",
  },
  { name: "Tag", element: <Tag className="mine">x</Tag>, tag: "span" },
  { name: "Textarea", element: <Textarea className="mine" label="L" />, tag: "textarea" },
  { name: "TextInput", element: <TextInput className="mine" label="L" />, tag: "input" },
  { name: "Tree", element: <Tree className="mine" nodes={[]} />, tag: "div" },
  {
    name: "Wizard",
    element: (
      <Wizard
        activeStep={0}
        className="mine"
        isStepValid={() => true}
        onCancel={() => undefined}
        onStepChange={() => undefined}
        onSubmit={() => undefined}
        steps={[{ title: "A", content: "x" }]}
      />
    ),
    tag: "div",
  },
  {
    name: "Dialog (through Modal)",
    element: <Dialog className="mine" message="M" open title="T" />,
    tag: "div",
  },
];

function opensTag(markup: string, tag: string): string[] {
  return [...markup.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))].map((match) => match[0]);
}

describe("className passthrough", () => {
  it.each(CASES)("$name keeps a caller's className on its $tag", ({ element, tag }) => {
    const carriers = opensTag(renderToStaticMarkup(element), tag).filter((open) =>
      /class="[^"]*\bmine\b[^"]*"/.test(open),
    );
    expect(carriers).toHaveLength(1);
    expect(carriers[0]).toMatch(/class="[^"]+ mine"|class="mine"/);
  });
});
