/**
 * Search Resolution — `/search` (Task 6.4)
 *
 * Implements `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` WI-2
 * (content loading), WI-3 (matching), and WI-4 (result normalization) in
 * one file — the same "one resolver file per concern" shape `case-
 * studies.ts`/`articles.ts` already establish, applied here to a resolver
 * that spans collections instead of owning one.
 *
 * Uses an index generated from the real Knowledge, Work, and Engineering
 * Log MDX files during `mdx:prepare`. This keeps the same source
 * collections as their loaders while avoiding filesystem reads and
 * frontmatter parsing on each Worker request. Work entries come from
 * `content/work/*.mdx`, not the separate placeholder fixture used by the
 * Work landing/library.
 *
 * `series` and `technologies` never participate: both are empty and
 * routeless today, so neither has anywhere a search result could link to
 * (docs/41 §11, D3). About never participates either — it's a single
 * static page, not a collection with a `getAll*()` read path (docs/41 D3).
 *
 * Matching is a plain case-insensitive substring test against `title`,
 * `description`, and — as of Task 7.2 (Tag Discovery,
 * `docs/54-TAG_DISCOVERY_IMPLEMENTATION_PLAN.md`) — each individual value in
 * `tags`. Still no `technologies`, no MDX body content, no fuzzy/ranked
 * relevance (docs/41 §8, D2 for the original two fields; docs/54 §5/§6 for
 * why `tags` extends the identical algorithm rather than introducing a new
 * one). An empty or whitespace-only query matches nothing — never
 * "everything" — so `/search` with no real query can't silently become an
 * unbounded listing page.
 *
 * The generated index retains `publishedAt` as an ISO timestamp for
 * chronological sorting, then formats the date only when producing the
 * display summary. This avoids sorting shortened labels such as `"Aug
 * 2026"`.
 *
 * Results retain the existing `ResolvedArticleSummary` shape used by
 * relationship cards across Knowledge, Work, and Engineering Log.
 *
 * Results are grouped by collection, not merged into one flat,
 * cross-collection chronological list (docs/42 WI-6, resolving docs/41 §24
 * Q3) — a direct consequence of the ordering constraint above: once each
 * group is normalized, there's no reliable shared sort key left to merge
 * three groups by.
 */
import { formatDate } from "@/lib/utils/format-date";
import type { Difficulty } from "@/types/content";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";

export interface SearchResults {
  knowledge: ResolvedArticleSummary[];
  work: ResolvedArticleSummary[];
  engineeringLog: ResolvedArticleSummary[];
}

type SearchCollection = "knowledge" | "work" | "engineering-log";

export interface SearchDocument {
  collection: SearchCollection;
  slug: string;
  title: string;
  description: string;
  tags: readonly string[];
  difficulty?: Difficulty;
  publishedAt: string;
  readingTime: string;
}

/**
 * Case-insensitive substring match against a document's own `title`,
 * `description`, and (Task 7.2, docs/54 §5/§6) each individual `tags`
 * value. Applied identically across all three collections so match
 * behavior can't silently diverge per collection.
 *
 * `tags` is matched per element (`.some()`), never by joining the array
 * into one string first: joining could let a query span two unrelated
 * tags' boundary (e.g. `["ab", "cd"]` joined as `"ab cd"` would spuriously
 * match a query like `"b c"`) — a false positive with no basis in either
 * tag's actual meaning (docs/54 §6). The two existing `title`/`description`
 * clauses are unchanged from their original Task 6.4 form.
 */
function matchesQuery(
  title: string,
  description: string,
  tags: readonly string[],
  query: string,
): boolean {
  const normalizedQuery = query.toLowerCase();
  return (
    title.toLowerCase().includes(normalizedQuery) ||
    description.toLowerCase().includes(normalizedQuery) ||
    tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
}

/**
 * The single entry point `app/search/page.tsx` calls. `query` is expected
 * pre-trimmed by the caller (the route owns query-string parsing, per
 * docs/42 WI-5); an empty string here returns three empty groups rather
 * than every document in every collection.
 */
export function searchContent(
  query: string,
  searchIndex: readonly SearchDocument[],
): SearchResults {
  if (!query) {
    return { knowledge: [], work: [], engineeringLog: [] };
  }

  const matchedDocuments = (collection: SearchCollection) =>
    (searchIndex as readonly SearchDocument[])
      .filter(
        (item) =>
          item.collection === collection &&
          matchesQuery(item.title, item.description, item.tags, query),
      )
      .sort(
        (left, right) =>
          Date.parse(right.publishedAt) - Date.parse(left.publishedAt),
      )
      .map(toSearchSummary);

  const knowledge = matchedDocuments("knowledge");
  const work = matchedDocuments("work");
  const engineeringLog = matchedDocuments("engineering-log");

  return { knowledge, work, engineeringLog };
}

function toSearchSummary(item: SearchDocument): ResolvedArticleSummary {
  const pathCollection = item.collection;
  return {
    slug: item.slug,
    collection: item.collection,
    title: item.title,
    description: item.description,
    href: `/${pathCollection}/${item.slug}`,
    ...(item.difficulty ? { difficulty: item.difficulty } : {}),
    readingTime: item.readingTime,
    publishedAt: formatDate(new Date(item.publishedAt)),
  };
}

/**
 * Whether any of the three groups has a match — the single definition of
 * "this query found nothing," the same role `hasRelatedLearningContent()`
 * (`relationships.ts`) already plays for Related Learning's four groups,
 * applied here to Search's three (docs/42 WI-7).
 */
export function hasSearchResults(results: SearchResults): boolean {
  return (
    results.knowledge.length > 0 ||
    results.work.length > 0 ||
    results.engineeringLog.length > 0
  );
}
