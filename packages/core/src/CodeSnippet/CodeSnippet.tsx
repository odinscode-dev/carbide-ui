import { Clipboard } from "@ark-ui/react/clipboard";
import type { RootContent } from "hast";
import type { HTMLAttributes, ReactNode } from "react";
import { useId, useState } from "react";
import bash from "refractor/bash";
import { refractor } from "refractor/core";
import css from "refractor/css";
import go from "refractor/go";
import json from "refractor/json";
import markup from "refractor/markup";
import sql from "refractor/sql";
import tsx from "refractor/tsx";
import yaml from "refractor/yaml";
import { t } from "../i18n/t.js";
import { joinClassNames } from "../joinClassNames/joinClassNames.js";
import { ScrollArea } from "../ScrollArea/index.js";
import styles from "./CodeSnippet.module.css";

for (const language of [bash, css, go, json, markup, sql, tsx, yaml]) {
  refractor.register(language);
}

export type CodeSnippetLanguage = "bash" | "css" | "go" | "html" | "json" | "sql" | "tsx" | "yaml";

const REFRACTOR_LANGUAGE: Record<CodeSnippetLanguage, string> = {
  bash: "bash",
  css: "css",
  go: "go",
  html: "markup",
  json: "json",
  sql: "sql",
  tsx: "tsx",
  yaml: "yaml",
};

function nodeToReact(node: RootContent, key: number): ReactNode {
  if (node.type === "text") {
    return node.value;
  }
  if (node.type !== "element") {
    return null;
  }
  return (
    <span className={node.properties.className?.join(" ")} key={key}>
      {node.children.map((child, index) => nodeToReact(child, index))}
    </span>
  );
}

function highlighted(code: string, language: CodeSnippetLanguage): ReactNode {
  return refractor
    .highlight(code, REFRACTOR_LANGUAGE[language])
    .children.map((node, index) => nodeToReact(node, index));
}

export type CodeSnippetType = "single" | "multi";

const COLLAPSES_ABOVE_LINES = 10;

const FEEDBACK_MS = 2000;

export interface CodeSnippetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "defaultValue"> {
  code: string;

  language?: CodeSnippetLanguage;

  type?: CodeSnippetType;

  collapsible?: boolean;

  copyText?: string;

  copiedText?: string;

  showMoreText?: string;

  showLessText?: string;
}

function lineCount(code: string): number {
  const count = code.split("\n").length;
  return code.endsWith("\n") ? count - 1 : count;
}

export function CodeSnippet({
  code,
  language,
  type = "single",
  collapsible = false,
  copyText,
  copiedText,
  showMoreText,
  showLessText,
  id,
  className,
  ...rest
}: CodeSnippetProps) {
  const blockId = useId();
  const [expanded, setExpanded] = useState(false);
  const copyLabel = copyText ?? t("codeSnippet.copy");
  const copiedLabel = copiedText ?? t("codeSnippet.copied");

  const isCollapsible = type === "multi" && collapsible && lineCount(code) > COLLAPSES_ABOVE_LINES;
  const content = language === undefined ? code : highlighted(code, language);

  return (
    <Clipboard.Root
      {...rest}
      className={joinClassNames(styles.root, className)}
      data-state={isCollapsible ? (expanded ? "expanded" : "collapsed") : undefined}
      data-type={type}
      ids={id === undefined ? undefined : { root: id }}
      timeout={FEEDBACK_MS}
      translations={{ triggerLabel: (copied) => (copied ? copiedLabel : copyLabel) }}
      value={code}
    >
      <div className={styles.viewport}>
        {type === "multi" ? (
          <ScrollArea axis="horizontal">
            <pre className={styles.code} id={blockId}>
              {content}
            </pre>
          </ScrollArea>
        ) : (
          <pre className={styles.code} id={blockId}>
            {content}
          </pre>
        )}
      </div>
      <Clipboard.Trigger className={styles.copy}>
        <svg aria-hidden="true" className={styles.copyIcon} viewBox="0 0 16 16">
          <path
            d="M5.5 5.5h8v8h-8zM10.5 2.5h-8v8"
            fill="none"
            stroke="currentcolor"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        <svg aria-hidden="true" className={styles.copiedIcon} viewBox="0 0 16 16">
          <path
            d="M3 8.5l3.5 3.5L13 5"
            fill="none"
            stroke="currentcolor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
        <span aria-hidden="true" className={styles.feedback}>
          {copiedLabel}
        </span>
      </Clipboard.Trigger>
      {isCollapsible && (
        <button
          aria-controls={blockId}
          aria-expanded={expanded}
          className={styles.toggle}
          onClick={() => setExpanded((open) => !open)}
          type="button"
        >
          {expanded
            ? (showLessText ?? t("codeSnippet.showLess"))
            : (showMoreText ?? t("codeSnippet.showMore"))}
          <svg aria-hidden="true" className={styles.chevron} viewBox="0 0 16 16">
            <path
              d="M4 6l4 4 4-4"
              fill="none"
              stroke="currentcolor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      )}
    </Clipboard.Root>
  );
}
