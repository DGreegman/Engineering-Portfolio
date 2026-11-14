import type { MDXComponents } from "mdx/types";

/**
 * Global MDX provider for Next's compiled MDX modules.
 * Article-specific renderers are passed by ArticleBody through `components`.
 */
export function useMDXComponents(): MDXComponents {
  return {};
}
