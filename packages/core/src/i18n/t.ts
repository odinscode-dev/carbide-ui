import { en } from "./en.js";

const CATALOG_LOCALE = "en";

type Catalog = typeof en;
type CatalogKey = keyof Catalog & string;

type BaseOf<K extends string> = K extends `${infer Base}.${Intl.LDMLPluralRule}` ? Base : never;

export type MessageKey = CatalogKey | BaseOf<CatalogKey>;

export type MessageValues = Record<string, string | number>;

const CATALOG: ReadonlyMap<string, string> = new Map(Object.entries(en));

const PLACEHOLDER = /\{(\w+)\}/g;

export function t(key: MessageKey, values?: MessageValues): string {
  return interpolate(selectText(key, values), key, values);
}

function selectText(key: MessageKey, values: MessageValues | undefined): string {
  const count = values?.count;
  if (typeof count === "number") {
    const category = new Intl.PluralRules(CATALOG_LOCALE).select(count);
    const form = CATALOG.get(`${key}.${category}`);
    if (form !== undefined) {
      return form;
    }
  }

  const text = CATALOG.get(key);
  if (text === undefined) {
    throw new Error(`No text in catalog for '${key}'.`);
  }
  return text;
}

function interpolate(template: string, key: MessageKey, values: MessageValues | undefined): string {
  return template.replaceAll(PLACEHOLDER, (_match: string, name: string) => {
    const value = values?.[name];
    if (value === undefined) {
      throw new Error(`Placeholder '{${name}}' in '${key}' has no value.`);
    }
    return String(value);
  });
}
