/**
 * Runs before every test file, also under the default environment `node` --
 * there the guard simply does not apply, because `globalThis.ResizeObserver`
 * does not exist in the first place.
 *
 * jsdom does not know `ResizeObserver` (a deliberate decision of that project,
 * see https://github.com/jsdom/jsdom/issues/3368). ScrollArea (Ticket #7)
 * needs it in an effect; every component that embeds ScrollArea and is
 * rendered client-side under `// @vitest-environment jsdom` -- first Wizard,
 * Ticket #34 -- otherwise breaks with `ResizeObserver is not defined`.
 */
class ResizeObserverStub implements ResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub;
}

/**
 * Same reason as the ResizeObserver stub above: jsdom does not know
 * `IntersectionObserver` either. Since ScrollArea moved to
 * `@ark-ui/react/scroll-area` (Ticket #102) the Zag machine needs it in an
 * effect to track the viewport's visibility.
 */
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = IntersectionObserverStub;
}

/**
 * jsdom has neither `navigator.clipboard` nor `document.execCommand`. Zag
 * (Ark `Clipboard`, in CodeSnippet) falls back to `execCommand("copy")`
 * without `clipboard.writeText` and throws there -- an unhandled error since
 * test/stories.test.tsx runs the story `CodeSnippet/Copied` with its click.
 * A stub that swallows the text is enough: the `copied` state is what gets
 * checked, not the clipboard.
 */
if (typeof navigator !== "undefined" && navigator.clipboard === undefined) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: (): Promise<void> => Promise.resolve() },
  });
}
