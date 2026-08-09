/**
 * RelatedKnowledge
 *
 * "What concept does this apply?" (`docs/31-CASE_STUDY_EXPERIENCE.md`
 * §1/§5). One of the Case Study's two closing relationship regions, kept
 * architecturally separate from Related Engineering Logs (below) rather
 * than merged into one "Related" section — docs/31 §3's "single most
 * important intentional structural difference" from the Article
 * Experience's one merged `RelatedLearning`.
 *
 * `items` is `ResolvedArticleSummary[]` (`lib/content/relationships.ts`) —
 * the exact type `RelatedLearning`'s own cards already render, since
 * `resolveRelatedKnowledge()` (`lib/content/case-study-relationships.ts`)
 * resolves against the same Knowledge collection via the same exported
 * `resolveArticleReferences()`. The card markup itself (stretched-link
 * title, description, citation line) intentionally mirrors
 * `RelatedLearning`'s own `RelatedArticleCard` rather than importing it
 * across a route boundary — the same "every route owns its own section
 * components, even where the visual pattern is shared" precedent
 * `FeaturedCaseStudies` already established relative to the homepage's
 * `EngineeringCaseStudies` in Task 5.1.
 *
 * Per docs/31 §5 ("point, don't duplicate... rendered as resolved
 * summaries, not raw links... capped... never fabricated"): returns `null`
 * when empty — a case study with no `relatedContent` authored yet
 * legitimately has nothing here, not an unbuilt region (the same
 * "`null`, not an empty heading" rule `RelatedLearning` already applies to
 * its own groups).
 *
 * A Server Component: static content resolved server-side, no
 * interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

function RelatedKnowledgeCard({ item }: { item: ResolvedArticleSummary }) {
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

export function RelatedKnowledge({
  items,
}: {
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Related Knowledge</h2>
        <p className="text-small text-muted-foreground">
          Engineering concepts this case study depends on, already explained in
          the Knowledge Library.
        </p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <RelatedKnowledgeCard item={item} />
          </li>
        ))}
      </ul>
    </Stack>
  );
}
