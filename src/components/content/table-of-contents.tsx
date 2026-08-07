/**
 * TableOfContents
 *
 * Renders the document's `tableOfContents` slot (`DocumentLayout`, Task
 * 4.3.2) inside the existing sticky `SidebarContainer` rail (also Task
 * 4.3.2 — this component adds no positioning/responsive behavior of its
 * own; it just fills the space that already collapses below `lg` and
 * stays pinned above it).
 *
 * Fed the exact `Heading[]` `extractHeadings()` (`lib/content/toc.ts`)
 * produced from the article's raw MDX source — computed once by the route
 * and passed to `ArticleBody` too (see that file's and
 * `mdx-components.tsx`'s docstrings), so the `href="#slug"` this renders
 * always points at an `id` the body actually has. No parsing happens here.
 *
 * Renders nothing when `headings` is empty — a short article with no h2-h4
 * headings legitimately has no Table of Contents, not an unbuilt region;
 * same reasoning as `DocumentLayout`'s Series Banner fix (a placeholder
 * would be dishonest here, not helpful).
 *
 * A flat list with per-depth indentation, not a nested tree built from the
 * flat `Heading[]`: `docs/20`'s ask is "reflect heading hierarchy," and a
 * fixed left-padding step per `depth` already reads as a hierarchy without
 * needing to infer parent/child relationships from a flat array — which
 * would also have to guess at what to do with a heading level that's
 * skipped or appears without a parent, a real possibility in freely
 * authored MDX. Only h2-h4 exist in `Heading` at all (`extractHeadings()`
 * never returns anything else), so "render only supported heading levels"
 * is satisfied by the input type, not extra filtering here.
 *
 * Each link carries `data-toc-link` — the only thing
 * `ActiveSectionTracker` (the client half of this task) needs to find it
 * again and toggle `aria-current` on the right one. The active-link
 * styling itself lives here, as a plain `aria-current:*` Tailwind variant,
 * not in the client component — it only ever flips an attribute, it never
 * decides what "active" looks like.
 *
 * Not wrapped in an extra visibility/breakpoint class of its own: that's
 * `SidebarContainer`'s job (`hidden lg:block`), already built and out of
 * this task's scope to touch. Keeping this component breakpoint-agnostic
 * also means a future mobile TOC (drawer, sheet, ...) can reuse it
 * unmodified inside a different container — `docs/21`'s "remain possible
 * without redesigning this implementation."
 *
 * A Server Component: the list itself is static, data-driven markup. Only
 * `ActiveSectionTracker`, rendered as a child here, needs the browser.
 */
import { ActiveSectionTracker } from "@/components/content/active-section-tracker";
import type { Heading } from "@/types/content";

const INDENT_CLASS: Record<Heading["depth"], string> = {
  2: "pl-0",
  3: "pl-4",
  4: "pl-8",
};

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of Contents">
      <p className="mb-3 text-small font-medium text-foreground">
        On This Page
      </p>
      <ol className="space-y-2 border-l border-border text-small">
        {headings.map((heading) => (
          <li key={heading.slug} className={INDENT_CLASS[heading.depth]}>
            <a
              href={`#${heading.slug}`}
              data-toc-link
              className="block -ml-px border-l-2 border-transparent py-0.5 pl-3 text-muted-foreground transition-colors hover:text-foreground aria-current:border-foreground aria-current:font-medium aria-current:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
      <ActiveSectionTracker headingIds={headings.map((h) => h.slug)} />
    </nav>
  );
}
