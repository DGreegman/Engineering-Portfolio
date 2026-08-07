/**
 * ArticleBody
 *
 * Renders an Engineering Article's MDX content — Task 4.3.4's Document
 * Body Region content, slotting into `DocumentLayout`'s `body` prop
 * (Task 4.3.2). Composes the existing `MDXContent` renderer
 * (`lib/content/mdx.tsx`, built in an earlier milestone and left
 * deliberately unwired — "not wired into any route yet — no article pages
 * exist in this task," that component's own docstring) with this task's
 * `mdxComponents` map.
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
 * A Server Component: `MDXContent`/`MDXRemote` compile and render MDX
 * server-side; nothing in this file or `mdxComponents` needs a client
 * boundary.
 */
import { MDXContent } from "@/lib/content/mdx";
import { mdxComponents } from "@/components/content/mdx-components";

export function ArticleBody({ source }: { source: string }) {
  return (
    <div className="[&>*:first-child]:mt-0">
      <MDXContent source={source} components={mdxComponents} />
    </div>
  );
}
