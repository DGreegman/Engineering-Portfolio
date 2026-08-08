/**
 * PreviousNext
 *
 * The Engineering Article's closing sequential-navigation region — Task
 * 4.3.9's own scope, slotting into `DocumentLayout`'s `previousNext` prop
 * (Task 4.3.2). Renders the pair `lib/content/relationships.ts`'s
 * `resolvePreviousNext()` already resolved: the canonical "what comes
 * before/after this document" reading sequence, distinct from Related
 * Learning's exploratory groups (Task 4.3.8) — this is *the* next step,
 * not *a* next step among several.
 *
 * No resolution happens here — precedence (series order, then topic
 * ordering, then nothing), the per-side cascade, and the "no recency"
 * constraint all live in `resolvePreviousNext`, once, so this file can't
 * drift from that logic or duplicate it (this task's "avoid duplicate
 * navigation logic" constraint). This component only decides how to
 * *show* a `{ previous, next }` pair it's handed.
 *
 * Each side renders independently and is entirely optional: `previous`
 * and `next` are each nullable, and the grid below simply leaves an empty
 * cell for whichever side is absent — CSS Grid keeps the present side in
 * its correct column (previous on the left, next on the right) regardless
 * of whether its sibling exists, which a flex `justify-between` layout
 * can't guarantee once one child is missing entirely. The whole component
 * returns `null` when both sides are absent (this task's "if neither
 * exists, render nothing"), the same "possibly nothing to show, so the
 * route always passes a real element and this component decides for
 * itself" pattern `TableOfContents` and `RelatedLearning` already
 * established for their own slots.
 *
 * Visual design deliberately withholds the `Card` treatment `StartHere`/
 * `RelatedLearning` use — this task's own "avoid large promotional cards"
 * and "emphasize article titles rather than controls" — instead pairing a
 * small `Previous`/`Next` caption with an arrow glyph beneath which the
 * article title itself is the one real, prominent link. A thin top border
 * (`border-t`) is the section's only chrome, integrating it as the
 * document's own footer rather than another card-shaped block competing
 * with Related Learning above it.
 *
 * `<nav aria-label="Previous and next article">` — its own landmark,
 * matching `Breadcrumb`/`TableOfContents`'s precedent of each navigation
 * region owning a distinctly-labeled `<nav>` inside `DocumentLayout`'s
 * `<section>` wrapper (this task's "preserve semantic navigation
 * landmarks" constraint).
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

function NavLink({
  direction,
  article,
}: {
  direction: "previous" | "next";
  article: ResolvedArticleSummary;
}) {
  const isNext = direction === "next";
  const Icon = isNext ? ArrowRight : ArrowLeft;

  return (
    <Link
      href={article.href}
      className={cn(
        "group -m-2 flex flex-col gap-1 rounded-md p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isNext && "sm:items-end sm:text-right",
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1 text-caption text-muted-foreground",
          isNext && "sm:flex-row-reverse",
        )}
      >
        <Icon aria-hidden="true" className="size-3.5" />
        {isNext ? "Next" : "Previous"}
      </span>
      <span className="text-body font-medium text-foreground underline-offset-4 group-hover:underline group-focus-visible:underline">
        {article.title}
      </span>
    </Link>
  );
}

export function PreviousNext({
  previous,
  next,
}: {
  previous: ResolvedArticleSummary | null;
  next: ResolvedArticleSummary | null;
}) {
  // "If neither exists, render nothing" — this task's own Rendering
  // requirement, applied to the section as a whole.
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Previous and next article"
      className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2"
    >
      <div>
        {previous && <NavLink direction="previous" article={previous} />}
      </div>
      <div>{next && <NavLink direction="next" article={next} />}</div>
    </nav>
  );
}
