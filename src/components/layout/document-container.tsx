/**
 * DocumentContainer
 *
 * The two-zone reading layout every Engineering Article uses — Task 4.3.2's
 * "Reading Layout": the Table of Contents Region and Document Body Region
 * side by side at desktop, stacked at everything below `lg`
 * (`docs/20-ARTICLE_EXPERIENCE.md`'s "Overall document structure" — the
 * reading column and TOC rail, two of that section's three zones; the
 * third, site chrome, is `WorkspaceLayout` and is untouched by this
 * component).
 *
 * `body`'s width is capped at `max-w-reading` (the existing 72ch token —
 * this task's explicit "do not introduce a new reading width") applied
 * directly as a class here, not via the `ReadingContainer` component: that
 * component also brings `mx-auto`, which would center the body *within
 * whatever width this flex column happens to have* rather than left-align
 * it. On a wide viewport the column is wider than 72ch, and centering would
 * shift the body's actual text away from the left edge every other region
 * on this page (Breadcrumb, Document Header, ...) already aligns to — the
 * same class of alignment bug already chased down once in this codebase
 * (Task 4.1's sidebar/hero alignment fix). `flex-1` lets the column grow to
 * fill available space; `max-w-reading` caps how much of that width the
 * text actually uses; the result sits flush left, same edge as everything
 * above and below it. `min-w-0` is the standard flex-child fix that lets
 * this column shrink below its content's intrinsic width if needed — no
 * behavior change today (nothing here can't already wrap), but it's the
 * safe default this kind of flex column should have before long code
 * blocks exist to make its absence a real bug.
 *
 * `sidebar` renders second in DOM order, body first — the same reasoning
 * `ReadmeHero`/`WorkspaceSnapshot` already established: primary content
 * should reach a keyboard or screen-reader user before secondary/
 * supporting content does, regardless of which side it's *visually* on.
 *
 * A Server Component: pure structure, no client interactivity.
 */
import { SidebarContainer } from "@/components/layout/sidebar-container";

export function DocumentContainer({
  body,
  sidebar,
}: {
  body: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <div className="min-w-0 max-w-reading flex-1">{body}</div>
      <SidebarContainer>{sidebar}</SidebarContainer>
    </div>
  );
}
