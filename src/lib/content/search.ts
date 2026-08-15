/**
 * Search Resolution — `/search` (Task 6.4)
 *
 * Implements `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` WI-2
 * (content loading), WI-3 (matching), and WI-4 (result normalization) in
 * one file — the same "one resolver file per concern" shape `case-
 * studies.ts`/`articles.ts` already establish, applied here to a resolver
 * that spans collections instead of owning one.
 *
 * Reads exactly three collections — Knowledge, Work, Engineering Log —
 * through their existing, real `getAll*()` resolvers, never a new
 * content-loading path (docs/41 §11). **Work's coverage reads
 * `getAllCaseStudies()` (`case-studies.ts`), the real `content/work/*.mdx`
 * collection — never `lib/content/work.ts`'s `getProjectLibrary()`/
 * `getFeaturedCaseStudies()`, which read the hand-authored `PLACEHOLDER_
 * WORK` fixture instead.** `docs/42` §3 documents this correction with
 * direct evidence (the placeholder's `summary` text has already drifted
 * from the real case studies' actual `description` frontmatter) — this
 * file is where that correction is actually load-bearing, not just noted.
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
 * Matching and sorting happen at the `ContentItem` level, *before*
 * normalization to `ResolvedArticleSummary` — `sortByPublishedDate()` needs
 * each item's real `frontmatter.publishedAt` `Date`; the normalized summary
 * only carries an already-formatted string (`"Aug 2026"`), which would sort
 * lexicographically, not chronologically, if sorted after the fact
 * (docs/42 WI-3's own documented trap).
 *
 * Normalization reuses three existing mappers rather than a fourth,
 * parallel type or hand-written mapping logic (docs/42 WI-4): `toSummary()`
 * (`relationships.ts`), `toCaseStudySummary()` (`case-study-
 * relationships.ts`, already exported in Task 6.2), and
 * `toEngineeringLogArticleSummary()` (`engineering-logs.ts`) — all three
 * newly or previously exported specifically for this reuse, and all three
 * already produce the exact `ResolvedArticleSummary` shape every relation-
 * ship group across Knowledge/Work/Engineering Log already renders.
 *
 * Results are grouped by collection, not merged into one flat,
 * cross-collection chronological list (docs/42 WI-6, resolving docs/41 §24
 * Q3) — a direct consequence of the ordering constraint above: once each
 * group is normalized, there's no reliable shared sort key left to merge
 * three groups by.
 */
import { getAllArticles } from "@/lib/content/articles";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import {
  getAllEngineeringLogEntries,
  toEngineeringLogArticleSummary,
} from "@/lib/content/engineering-logs";
import { toCaseStudySummary } from "@/lib/content/case-study-relationships";
import {
  toSummary,
  type ResolvedArticleSummary,
} from "@/lib/content/relationships";
import { sortByPublishedDate } from "@/lib/content/loader";

export interface SearchResults {
  knowledge: ResolvedArticleSummary[];
  work: ResolvedArticleSummary[];
  engineeringLog: ResolvedArticleSummary[];
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
  tags: string[],
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
export function searchContent(query: string): SearchResults {
  if (!query) {
    return { knowledge: [], work: [], engineeringLog: [] };
  }

  const knowledge = sortByPublishedDate(
    getAllArticles().filter((item) =>
      matchesQuery(
        item.frontmatter.title,
        item.frontmatter.description,
        item.frontmatter.tags,
        query,
      ),
    ),
  ).map(toSummary);

  const work = sortByPublishedDate(
    getAllCaseStudies().filter((item) =>
      matchesQuery(
        item.frontmatter.title,
        item.frontmatter.description,
        item.frontmatter.tags,
        query,
      ),
    ),
  ).map(toCaseStudySummary);

  const engineeringLog = sortByPublishedDate(
    getAllEngineeringLogEntries().filter((item) =>
      matchesQuery(
        item.frontmatter.title,
        item.frontmatter.description,
        item.frontmatter.tags,
        query,
      ),
    ),
  ).map(toEngineeringLogArticleSummary);

  return { knowledge, work, engineeringLog };
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
