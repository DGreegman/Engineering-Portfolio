/**
 * AppliedInCaseStudies
 *
 * "Which real, published Work case study or case studies applied this
 * concept?" (Task 7.26, `docs/76-MILESTONE_7_DISCOVERY_REASSESSMENT.md` §13,
 * `docs/77-KNOWLEDGE_REVERSE_WORK_DISCOVERY_IMPLEMENTATION_PLAN.md` §8–§9)
 * — the Knowledge article's own closing region for the reverse of Work's
 * "Related Knowledge": not "what concept does this apply" (that question is
 * `RelatedKnowledge`'s, on `/work/[slug]`) but "where has this concept
 * actually been applied." Deliberately titled "Applied In These Case
 * Studies," not a generic "Related Work"/"Related Projects" — the
 * relationship it renders is the reverse of an explicit, already-authored,
 * asymmetric edge (`resolveRelatedWorkForArticle()`,
 * `lib/content/case-study-relationships.ts`), not a symmetric or
 * similarity-based one, and the title says so precisely.
 *
 * `items` is `ResolvedArticleSummary[]` (`lib/content/relationships.ts`) —
 * the identical shape `RelatedKnowledge`'s and `RelatedCaseStudies`' own
 * cards already render, since `toCaseStudySummary()` produces the same
 * summary regardless of which relationship resolved it. The card markup
 * itself (stretched-link title, description, citation line) intentionally
 * mirrors `RelatedKnowledgeCard`'s (`components/work/related-knowledge.tsx`)
 * rather than importing it across a route boundary — the same "every route
 * owns its own section components, even where the visual pattern is
 * shared" precedent `RelatedKnowledge`, `RelatedCaseStudies`, and
 * `RelatedWork` have each already independently followed.
 *
 * Returns `null` when empty — a Knowledge article with no real inbound
 * Work edge legitimately has nothing here, not an unbuilt region (the same
 * "`null`, not an empty heading" rule every other relationship region in
 * this codebase already applies).
 *
 * A Server Component: static content resolved server-side, no
 * interactivity, no `"use client"`.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

function AppliedCaseStudyCard({ item }: { item: ResolvedArticleSummary }) {
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

export function AppliedInCaseStudies({
  items,
}: {
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">
          Applied In These Case Studies
        </h2>
        <p className="text-small text-muted-foreground">
          Real engineering work where this concept was actually built, not just
          explained.
        </p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <AppliedCaseStudyCard item={item} />
          </li>
        ))}
      </ul>
    </Stack>
  );
}
