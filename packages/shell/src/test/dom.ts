// What a test needs from a query that may find nothing: the element, or a failure at that line
// instead of a missing property further down.

export function must<T>(value: T | null | undefined, what = "element"): T {
  if (value === null || value === undefined) throw new Error(`Expected ${what}, found none`);
  return value;
}

export function htmlOf(element: Element | null | undefined): HTMLElement {
  const found = must(element, "an HTML element");
  if (!(found instanceof HTMLElement))
    throw new Error(`Expected an HTML element, found <${found.tagName.toLowerCase()}>`);
  return found;
}
