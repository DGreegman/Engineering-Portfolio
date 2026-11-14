import type { MDXComponents } from "mdx/types";
import { createElement } from "react";
import { getCompiledMdx } from "../../../.generated-mdx/registry";

/**
 * Selects a Next-compiled MDX module from the build-generated registry.
 * The content loader still reads source MDX for metadata, search, feeds,
 * and heading extraction; this renderer only uses the compiled React
 * component, so Worker requests do not evaluate generated source strings.
 */
export function MDXContent({
  collection,
  slug,
  components,
}: {
  collection: "work" | "knowledge" | "engineering-log";
  slug: string;
  components: MDXComponents;
}) {
  const compiledMdx = getCompiledMdx(collection, slug);
  if (!compiledMdx) {
    throw new Error(
      `No compiled MDX module registered for ${collection}/${slug}`,
    );
  }

  return createElement(compiledMdx, { components });
}
