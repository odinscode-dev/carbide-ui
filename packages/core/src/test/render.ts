import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

export interface Root {
  tag: string;

  attrs: Record<string, string>;

  markup: string;
}

const ROOT_TAG = /^<([a-z][\w-]*)((?:\s+[^\s=>]+(?:="[^"]*")?)*)\s*\/?>/;
const ATTRIBUTE = /([^\s=]+)(?:="([^"]*)")?/g;

const ENTITIES: ReadonlyMap<string, string> = new Map([
  ["&quot;", '"'],
  ["&#x27;", "'"],
  ["&lt;", "<"],
  ["&gt;", ">"],
  ["&amp;", "&"],
]);

function unescapeEntity(text: string): string {
  return text.replaceAll(/&(?:quot|#x27|lt|gt|amp);/g, (match) => ENTITIES.get(match) ?? match);
}

export function renderRoot(element: ReactElement): Root {
  const markup = renderToStaticMarkup(element);
  const head = ROOT_TAG.exec(markup);
  if (head === null) {
    throw new Error(`No root element in markup: ${markup}`);
  }
  return parseTag(head, markup);
}

const TAG = /<([a-z][\w-]*)((?:\s+[^\s=>]+(?:="[^"]*")?)*)\s*\/?>/g;

export function renderPart(element: ReactElement, part: string): Root {
  const markup = renderToStaticMarkup(element);
  for (const match of markup.matchAll(TAG)) {
    const candidate = parseTag(match, markup);
    if (candidate.attrs["data-part"] === part) {
      return candidate;
    }
  }
  throw new Error(`No element with data-part='${part}' in markup: ${markup}`);
}

function parseTag(match: RegExpExecArray | RegExpMatchArray, markup: string): Root {
  const tag = match[1];
  if (tag === undefined) {
    throw new Error(`Start tag without a name in markup: ${markup}`);
  }

  const attrs: Record<string, string> = {};
  for (const [, name, value] of (match[2] ?? "").matchAll(ATTRIBUTE)) {
    if (name !== undefined) {
      attrs[name] = unescapeEntity(value ?? "");
    }
  }
  return { tag, attrs, markup };
}
