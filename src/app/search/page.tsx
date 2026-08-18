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
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

// Task 8.2 (docs/83 §5, §10): one local const, read three times below.
const description =
  "Search Knowledge, Work, and Engineering Log by title, description, or tag.";

export const metadata: Metadata = {
  title: "Search",
  description,
  // A search-results URL shouldn't be indexed — docs/41 §18's explicit
  // requirement, unmodified by Task 8.2: appended to below, never
  // replaced. A person directly sharing a /search link should still see
  // an accurate preview (docs/82 §16) — a different concern from whether
  // search engines index the page, which this field alone governs.
  robots: {
    index: false,
    follow: true,
  },
  // Task 8.3 (docs/84 §11, docs/85 §9): a single, query-agnostic canonical
  // — this page's metadata is static, so it structurally cannot vary by
  // `?q=`, which is exactly correct for consolidating every query variant
  // onto one URL. Kept alongside, not instead of, the `noindex` above —
  // defense-in-depth, not a replacement for it. `types` repeated verbatim
  // from root, same reasoning as every other route in this task.
  alternates: {
    canonical: "/search",
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  openGraph: {
    title: "Search",
    description,
    url: "/search",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search",
    description,
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
