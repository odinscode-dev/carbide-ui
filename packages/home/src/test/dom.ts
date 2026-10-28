// What a test needs from a query that may find nothing: the element, or a failure at that line
// instead of a missing property further down.

export function must<T>(value: T | null | undefined, what = "element"): T {
  if (value === null || value === undefined) throw new Error(`Expected ${what}, found none`);
  return value;
}

export function buttonOf(element: Element | null | undefined): HTMLButtonElement {
  const found = must(element, "a <button>");
  if (!(found instanceof HTMLButtonElement)) {
    throw new Error(`Expected a <button>, found <${found.tagName.toLowerCase()}>`);
  }
  return found;
}
