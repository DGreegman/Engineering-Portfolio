/**
 * RelatedCaseStudies
 *
 * "What else demonstrates a similar engineering concern?" (docs/31-
 * CASE_STUDY_EXPERIENCE.md §7) — the Case Study's third closing relationship
 * region (Task 7.3, `docs/55-RELATED_CONTENT_DISCOVERY.md`,
 * `docs/56-RELATED_CONTENT_IMPLEMENTATION_PLAN.md`), alongside the existing
 * Related Knowledge ("what concept does this apply") and Engineering Logs
 * ("what process produced this") regions.
 *
 * `items` arrives already resolved — `resolveRelatedCaseStudies()`
 * (`lib/content/case-study-relationships.ts`) has already filtered, sorted,
 * and capped the collection, and already mapped it to
 * `ResolvedArticleSummary`. This component performs no content loading, no
 * filtering, no sorting, and no relationship resolution of its own — pure
 * presentation over an already-normalized shape, the same "resolution
 * happens once, upstream" discipline every other relationship region in
 * this codebase already holds itself to.
 *
 * Deliberately not a generic `RelatedContent` component (docs/55 §11): this
 * follows `RelatedKnowledge`'s (`components/work/related-knowledge.tsx`)
 * exact, already-established idiom — a stretched-link card grid, hardcoded
 * title/introduction copy (no shared copy-constants object exists for these
 * sections, confirmed by direct inspection before this file was written) —
 * recreated locally rather than imported across files, the same "every
 * route/section owns its own section components, even where the visual
 * pattern is shared" precedent that component's own docstring already
 * states.
 *
 * Returns `null` when `items` is empty — a case study whose domain has no
 * sibling yet legitimately has nothing here, not an unbuilt region (the
 * same "`null`, not an empty heading" rule every other relationship region
 * in this codebase already applies).
 *
 * A Server Component: static content resolved server-side, no
 * interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

function RelatedCaseStudyCard({ item }: { item: ResolvedArticleSummary }) {
  const citation = item.difficulty
    ? `${item.difficulty} · ${item.readingTime} · ${item.publishedAt}`
    : `${item.readingTime} · ${item.publishedAt}`;

  return (
    <Card className="relative h-full transition-[transform,box-shadow] duration-150 ease-out hover:ring-foreground/20 motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]">
      <CardHeader>
        <h3 className="text-h4 text-foreground">
          <Link
            href={item.href}
            className="rounded-sm after:absolute after:inset-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {item.title}
          </Link>
        </h3>
      </CardHeader>
      <CardContent>
        <Stack gap="xs">
          <p className="text-small text-muted-foreground">{item.description}</p>
          <p className="text-caption text-muted-foreground capitalize">
            {citation}
          </p>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function RelatedCaseStudies({
  items,
}: {
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Related Case Studies</h2>
        <p className="text-small text-muted-foreground">
          Other engineering work in the same domain.
        </p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <RelatedCaseStudyCard item={item} />
          </li>
        ))}
      </ul>
    </Stack>
  );
}
