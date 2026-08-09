/**
 * RelatedEngineeringLogs
 *
 * "What process produced this?" (`docs/31-CASE_STUDY_EXPERIENCE.md` §1/§6).
 * The Case Study's second closing relationship region — architecturally
 * separate from Related Knowledge (above) on purpose; see that component's
 * own docstring for why the two never merge into one section.
 *
 * `items` is `ResolvedEngineeringLogSummary[]`
 * (`lib/content/case-study-relationships.ts`) — a narrower shape than
 * `ResolvedArticleSummary` (no `difficulty`/`readingTime`) since Engineering
 * Log entries don't carry a difficulty rating the way Knowledge articles do;
 * inventing one here would be exactly the kind of fabricated metadata this
 * codebase's relationship resolvers consistently avoid.
 *
 * Rendered as a quieter row list (title + citation line), not the `Card`
 * grid `RelatedKnowledge` uses — docs/31 §6 frames a log entry as "the
 * messy, uncertain version" of a decision the case study has already
 * narrated polished; visually lighter-weight than the concept-level Related
 * Knowledge cards reflects that a log entry is supporting evidence of
 * honesty, not a parallel piece of primary content. Reuses the same
 * stretched-link row idiom `ProjectLibrary`/`RecentlyPublished` already
 * established elsewhere in this codebase, rather than inventing a fourth
 * row treatment.
 *
 * Returns `null` when empty — today, always, since `content/engineering-log/`
 * has no real entries yet (`lib/content/engineering-logs.ts`'s own
 * docstring). This is the honest, expected state, not an unbuilt region:
 * the same "`null`, not an empty heading" rule every other relationship
 * group in this codebase already applies.
 *
 * A Server Component: static content resolved server-side, no
 * interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import type { ResolvedEngineeringLogSummary } from "@/lib/content/case-study-relationships";

function EngineeringLogRow({ item }: { item: ResolvedEngineeringLogSummary }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-4 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        {item.publishedAt}
      </p>
      <h3 className="mt-1 text-body font-normal text-foreground">
        <Link
          href={item.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {item.title}
        </Link>
      </h3>
    </li>
  );
}

export function RelatedEngineeringLogs({
  items,
}: {
  items: ResolvedEngineeringLogSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Engineering Logs</h2>
        <p className="text-small text-muted-foreground">
          The messier, in-progress record behind this account — where these
          decisions were actually worked out.
        </p>
      </Stack>
      <ol className="max-w-reading divide-y divide-border/50">
        {items.map((item) => (
          <EngineeringLogRow key={item.slug} item={item} />
        ))}
      </ol>
    </Stack>
  );
}
