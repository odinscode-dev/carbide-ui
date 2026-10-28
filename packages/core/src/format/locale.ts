const FALLBACK = "en-US";

export interface LocaleOptions {
  locale?: string;
}

export function resolveLocale(locale?: string): string {
  if (locale !== undefined) {
    return locale;
  }
  const nav: Navigator | undefined = globalThis.navigator;
  return nav?.language ?? FALLBACK;
}
