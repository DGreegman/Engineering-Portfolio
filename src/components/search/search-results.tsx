/**
 * SearchResults
 *
 * `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` WI-6 — renders
 * Search's three matched groups, grouped by collection rather than merged
 * into one flat, chronologically-interleaved list (docs/41 §24 Q3, resolved
 * here): each group is already sorted by a real `Date` before
 * normalization (`lib/content/search.ts`'s own docstring); merging after
 * normalization would mean sorting an already-formatted string
 * (`"Aug 2026"`), which isn't a reliable chronological key. Grouping avoids
 * that problem by construction instead of working around it.
 *
 * Each row mirrors `LogEntryRow`'s (`components/engineering-log/`) visual
 * idiom — date, title, one-line description, whole-row stretched-link
 * clickability — recreated locally rather than imported across a route
 * boundary, the same "every route owns its own section components, even
 * where the visual pattern is shared" precedent `RelatedWork`'s own
 * docstring already established for this exact situation.
 *
 * A collection with zero matches renders nothing for that group — no
 * heading, no per-group "nothing here" message. The page-level empty state
 * (`app/search/page.tsx`, WI-7) is the only "no results" message this
 * experience ever shows — the same "empty group is a valid, silent state,
 * not an error" discipline `docs/37`'s own empty-state ruling already
 * established, applied here to a subset of results rather than a whole
 * collection.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";
import type { SearchResults as SearchResultsData } from "@/lib/content/search";

function SearchResultRow({ item }: { item: ResolvedArticleSummary }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-6 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        {item.publishedAt}
      </p>
      <h3 className="mt-1 text-h4 text-foreground">
        <Link
          href={item.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {item.title}
        </Link>
      </h3>
      <Stack gap="xs" className="mt-2">
        <p className="text-small text-muted-foreground">{item.description}</p>
      </Stack>
    </li>
  );
}

function SearchResultGroup({
  label,
  items,
}: {
  label: string;
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="sm">
      <h2 className="text-h2 text-foreground">{label}</h2>
      <ol className="divide-y divide-border/50">
        {items.map((item) => (
          <SearchResultRow key={item.slug} item={item} />
        ))}
      </ol>
    </Stack>
  );
}

export function SearchResults({ results }: { results: SearchResultsData }) {
  return (
    <Stack gap="xl">
      <SearchResultGroup label="Knowledge" items={results.knowledge} />
      <SearchResultGroup label="Work" items={results.work} />
      <SearchResultGroup
        label="Engineering Log"
        items={results.engineeringLog}
      />
    </Stack>
  );
}
