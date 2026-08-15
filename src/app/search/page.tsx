/**
 * Search — `/search` (Task 6.4)
 *
 * Implements `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` WI-5
 * (route + query parsing), WI-7 (empty/no-query states), and WI-8
 * (metadata) — WI-6 (result presentation) lives in `SearchResults`
 * (`components/search/`). This file contains no matching or normalization
 * logic of its own; it reads the query string and hands the trimmed query
 * straight to `searchContent()` (`lib/content/search.ts`).
 *
 * Milestone 6 scope only (`docs/41-SEARCH_CORE_DISCOVERY.md` §4/§7): *"a
 * reader who already knows a term can use Search to reach a real page."*
 * No filtering, no ranking, no search index, no client component — a plain
 * server-rendered `GET` form. The query works with JavaScript disabled:
 * submitting re-requests `/search?q=...`, which this Server Component reads
 * directly from `searchParams`.
 *
 * `searchParams` is a `Promise` and must be awaited — confirmed against
 * this project's own bundled docs
 * (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/
 * page.md`) before writing this route, per `AGENTS.md`'s standing "read the
 * docs, don't assume trained-on-Next.js behavior" instruction — the same
 * async contract `app/work/[slug]/page.tsx` already uses for `params`.
 *
 * An empty or missing `q` renders the prompt state (WI-7) — `searchContent`
 * is never called with an empty string, so no collection is even read from
 * disk for a page visited with no query yet.
 */
import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchResults } from "@/components/search/search-results";
import { hasSearchResults, searchContent } from "@/lib/content/search";

export const metadata: Metadata = {
  title: "Search — Engineering Portfolio",
  description:
    "Search Knowledge, Work, and Engineering Log by title, description, or tag.",
  // A search-results URL shouldn't be indexed — docs/41 §18's explicit
  // requirement. No canonical URL, no Open Graph, no structured data —
  // the same bounded metadata scope docs/35/docs/37/docs/40 already drew.
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string | string[] }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const rawQuery = Array.isArray(resolvedParams.q)
    ? resolvedParams.q[0]
    : resolvedParams.q;
  const query = (rawQuery ?? "").trim();

  const results = query ? searchContent(query) : null;

  return (
    <Section spacing="md" width="full">
      <Stack gap="xl" className="max-w-reading">
        <Stack gap="lg">
          <p className="font-mono text-caption text-muted-foreground">Search</p>
          <h1 className="text-h1 text-foreground">
            Find a page across Knowledge, Work, and Engineering Log.
          </h1>

          <form
            method="GET"
            action="/search"
            className="flex flex-wrap items-center gap-2"
          >
            <label htmlFor="search-query" className="sr-only">
              Search query
            </label>
            <Input
              id="search-query"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by title, description, or tag…"
              className="max-w-sm"
            />
            <Button type="submit" variant="outline">
              Search
            </Button>
          </form>
        </Stack>

        {!query ? (
          <p className="text-body text-muted-foreground">
            Enter a term to search Knowledge, Work, and Engineering Log by
            title, description, or tag.
          </p>
        ) : results && hasSearchResults(results) ? (
          <SearchResults results={results} />
        ) : (
          <p className="text-body text-muted-foreground">
            No results for &ldquo;{query}&rdquo;.
          </p>
        )}
      </Stack>
    </Section>
  );
}
