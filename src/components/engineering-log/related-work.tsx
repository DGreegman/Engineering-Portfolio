/**
 * RelatedWork
 *
 * "Which Case Study or Case Studies did this process feed into?"
 * (`docs/37-ENGINEERING_LOG_EXPERIENCE.md` §8/§12). The Engineering Log
 * entry's own closing relationship region — the reverse direction of
 * Work's `RelatedEngineeringLogs`, resolved by `resolveRelatedWorkForLog()`
 * (`lib/content/engineering-logs.ts`), never authored on the log entry's
 * own frontmatter (docs/37 §12's own "reverse-lookup, not a new field").
 *
 * `items` is `ResolvedArticleSummary[]` — the same shape `RelatedKnowledge`
 * (Work) already renders, since `resolveRelatedWorkForLog()` reuses that
 * collection's own `toCaseStudySummary()` mapping directly. The card
 * markup mirrors `RelatedKnowledge`'s own `RelatedKnowledgeCard` rather
 * than importing it across a route boundary — the same "every route owns
 * its own section components, even where the visual pattern is shared"
 * precedent `FeaturedCaseStudies` established relative to the homepage's
 * `EngineeringCaseStudies`, and `RelatedKnowledge` itself already applied
 * relative to Knowledge's own `RelatedLearning`.
 *
 * **Cardinality is many-to-many (docs/37 §12) — this component renders a
 * list whose length is whatever `items` actually contains, never a
 * special-cased "singular" layout for exactly one match.** A single-item
 * list and a multi-item list are the same component state; only the
 * number of `<li>`s differs.
 *
 * Returns `null` when empty — the same "`null`, not an empty heading" rule
 * every other relationship group in this codebase already applies
 * (`RelatedKnowledge`, `RelatedEngineeringLogs`).
 *
 * A Server Component: static content resolved server-side, no
 * interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

function RelatedWorkCard({ item }: { item: ResolvedArticleSummary }) {
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

export function RelatedWork({ items }: { items: ResolvedArticleSummary[] }) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Related Work</h2>
        <p className="text-small text-muted-foreground">
          Where this process led — the Case Study or Case Studies this
          entry&apos;s work fed into.
        </p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>
            <RelatedWorkCard item={item} />
          </li>
        ))}
      </ul>
    </Stack>
  );
}
