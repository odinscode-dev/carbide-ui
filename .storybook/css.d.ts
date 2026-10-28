/* What Vite makes of a CSS import, for the program at the root: the
   Storybook configuration and the story files of every package. The same
   declarations live in each package once more for its own build. */

declare module "*.module.css" {
  const classes: Record<string, string>;
  export default classes;
}

/** Vite serves a CSS file imported with `?inline` as a string. */
declare module "*.css?inline" {
  const css: string;
  export default css;
}
