/**
 * ArticleBody
 *
 * Renders an Engineering Article's MDX content — Task 4.3.4's Document
 * Body Region content, slotting into `DocumentLayout`'s `body` prop
 * (Task 4.3.2). Selects a build-compiled MDX module from the generated
 * registry and passes this document's component map into it.
 *
 * `headings` (Task 4.3.5): the same `Heading[]` `extractHeadings()`
 * produced from this article's raw MDX source, computed once by the route
 * and threaded down here so `getMdxComponents()` can bind matching `id`s
 * onto the rendered h2/h3/h4 elements — see `mdx-components.tsx`'s own
 * docstring for why this is the *only* place slugs are computed. Optional
 * and defaulted to `[]` rather than required: every caller today passes a
 * real list, but a body with no headings (a very short article) is a valid
 * document, not an error.
 *
 * `max-w-reading` is not reapplied here — `DocumentContainer` (Task 4.3.2)
 * already caps whatever it receives as its `body` slot at that width, so
 * doing it again here would be redundant, not incorrect, but pointless.
 *
 * `[&>*:first-child]:mt-0` cancels the first rendered element's own
 * top margin (every heading/paragraph override in `mdx-components.tsx`
 * carries one, spacing it from whatever came *before* it) — otherwise the
 * body's first element would double up with `DocumentContainer`'s own
 * Section-level top padding instead of sitting flush beneath it.
 *
 * A Server Component: the selected compiled module renders server-side;
 * nothing in this file or `mdx-components.tsx` needs a client
 * boundary — `getMdxComponents()` is a plain function called once during
 * this Server Component's own render, not client state.
 */
import { MDXContent } from "@/lib/content/mdx";
import { getMdxComponents } from "@/components/content/mdx-components";
import type { Heading } from "@/types/content";

export function ArticleBody({
  collection,
  slug,
  headings = [],
}: {
  collection: "work" | "knowledge" | "engineering-log";
  slug: string;
  headings?: Heading[];
}) {
  return (
    <div className="article-body-prose [&>*:first-child]:mt-0">
      <MDXContent
        collection={collection}
        slug={slug}
        components={getMdxComponents(headings)}
      />
    </div>
  );
}
