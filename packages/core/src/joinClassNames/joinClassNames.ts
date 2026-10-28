/**
 * Joins class names, skipping the missing and empty ones; `undefined` when
 * none is left. A component puts its own class first and the caller's
 * `className` after it, so the caller's class reaches the element instead of
 * being overwritten by the component's.
 */
export function joinClassNames(...names: readonly (string | undefined)[]): string | undefined {
  const present = names.filter((name): name is string => name !== undefined && name !== "");
  return present.length === 0 ? undefined : present.join(" ");
}
