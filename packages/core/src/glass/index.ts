/**
 * The pane class every `variant="glass"` component adds next to its own
 * root class. Styles only — there is no Glass component: the effect has to
 * sit on the component's own element (its border, its overflow, its
 * backdrop), and a wrapper around it would paint a second pane.
 */
export type { Variant } from "./variant.js";
export { glassClassName, variantAttribute } from "./variant.js";
