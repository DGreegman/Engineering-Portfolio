/**
 * RelatedKnowledge
 *
 * "What concept does this touch?" (`docs/37-ENGINEERING_LOG_EXPERIENCE.md`
 * §8/§13). The Engineering Log entry's other closing relationship region,
 * kept architecturally separate from Related Work (§12) for the same
 * reason Work's own Case Study keeps Related Knowledge and Related
 * Engineering Logs separate (`docs/31-CASE_STUDY_EXPERIENCE.md` §3) —
 * concept and outcome are different questions.
 *
 * No new mechanism: resolves `frontmatter.relatedContent` via the existing,
 * exported `resolveArticleReferences()` (`lib/content/relationships.ts`) —
 * the identical function Knowledge's own Related Concepts and Work's own
 * Related Knowledge already call, same cap
 * (`DEFAULT_RELATIONSHIP_LIMIT`), same "silently skip an unresolvable
 * slug" honesty guarantee (docs/37 §13's own "no new mechanism" ruling).
 *
 * `items` is `ResolvedArticleSummary[]` — the card markup mirrors Work's
 * own `RelatedKnowledge` card idiom rather than importing that component
 * across a route boundary, the same "every route owns its own section
 * components" precedent this collection's `RelatedWork` component
 * (`related-work.tsx`) already follows for the identical reason.
 *
 * Returns `null` when empty.
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
          Engineering concepts this entry touches, already explained in the
          Knowledge Library.
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
