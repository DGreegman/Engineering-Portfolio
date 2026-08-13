/**
 * Engineering Log Resolution
 *
 * The engineering-log/-collection-specific layer on top of the generic
 * content engine — originally the minimum needed for Related Engineering
 * Logs (docs/31-CASE_STUDY_EXPERIENCE.md §6) to resolve against something
 * real rather than staying permanently unresolvable. `lib/content/
 * collections.ts` already registers `"engineering-log"` (schema:
 * `articleFrontmatterSchema`, type: `"engineering-log"`), and `loader.ts`'s
 * `getSlugs`/`getBySlug` are already generic across every registered
 * collection — this file only narrows that already-existing capability to
 * one typed API, the same minimal role `lib/content/articles.ts`/
 * `case-studies.ts` play for their own collections. No
 * `EngineeringLogFrontmatter` type is introduced: engineering-log/ uses the
 * same `articleFrontmatterSchema` knowledge/ and work/ both extend, so
 * `ArticleFrontmatter` already fits.
 *
 * `content/engineering-log/` holds no real content yet (`.gitkeep` only).
 *
 * Task 6.2 (`docs/37-ENGINEERING_LOG_EXPERIENCE.md`,
 * `docs/38-ENGINEERING_LOG_IMPLEMENTATION_PLAN.md` WI-2/WI-3) extends this
 * file with the two resolvers `/engineering-log/[slug]` needs —
 * `resolveRelatedWorkForLog()` and `resolvePreviousNextLog()` — rather than
 * introducing a third relationship file. `case-study-relationships.ts`
 * exists as its own file specifically because Work has real, structural
 * reasons to keep its relationship logic separate from Knowledge's
 * (`relationships.ts`'s own docstring); Engineering Log has no such
 * competing reason to split its two new resolvers out of the file that
 * already owns this collection's every other accessor.
 */
import {
  getAll,
  getBySlug,
  getSlugs,
  filterDrafts,
  sortByPublishedDate,
} from "@/lib/content/loader";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import {
  DEFAULT_RELATIONSHIP_LIMIT,
  toCaseStudySummary,
} from "@/lib/content/case-study-relationships";
import type { ResolvedArticleSummary } from "@/lib/content/relationships";
import { formatDate } from "@/lib/utils/format-date";
import type { ArticleFrontmatter, WorkFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";

type EngineeringLogItem = ContentItem<ArticleFrontmatter>;

export function getEngineeringLogSlugs(): string[] {
  return getSlugs("engineering-log");
}

export function engineeringLogEntryExists(slug: string): boolean {
  return getEngineeringLogSlugs().includes(slug);
}

export function getEngineeringLogEntryBySlug(
  slug: string,
): ContentItem<ArticleFrontmatter> {
  return getBySlug<ArticleFrontmatter>("engineering-log", slug);
}

/** Every published (non-draft) Engineering Log entry — empty today; see this file's own docstring. */
export function getAllEngineeringLogEntries(): ContentItem<ArticleFrontmatter>[] {
  return filterDrafts(getAll<ArticleFrontmatter>("engineering-log"));
}

/**
 * Related Work (docs/37 §12, docs/38 WI-2) — the reverse of
 * `resolveRelatedEngineeringLogs()` (`case-study-relationships.ts`): that
 * function resolves a Case Study's own `frontmatter.engineeringLog` array
 * against real log entries; this one starts from a log entry and asks
 * "which Case Study or Case Studies name *me* in their own array." No new
 * frontmatter field exists for a log entry to author this relationship
 * itself — `docs/37` §12 deliberately rejected adding one, since the fact
 * is already fully derivable from data Work already owns.
 *
 * **Cardinality is many-to-many, verified against the actual schema
 * (`workFrontmatterSchema.engineeringLog: z.array(z.string())`) and real
 * data before this was written — see docs/37 §12's own "Cardinality"
 * subsection for the full evidence.** Nothing prevents two independent
 * Case Studies from each naming the same log slug, so this function always
 * returns a collection — never a single item, never `null` for "found
 * one" versus an array for "found several." A caller must not assume the
 * first element is somehow more canonical than the rest; order follows
 * `caseStudies`' own incoming order (`getAllCaseStudies()`'s, by default),
 * never a re-derived significance ranking this function wasn't asked to
 * compute.
 *
 * Reuses `toCaseStudySummary()` and `DEFAULT_RELATIONSHIP_LIMIT`
 * (`case-study-relationships.ts`, both exported specifically for this
 * reuse) rather than a second copy of either — one mapping from a Work
 * item to its summary shape, one editorial cap, shared across both
 * directions of this relationship.
 */
export function resolveRelatedWorkForLog(
  logEntry: EngineeringLogItem,
  caseStudies: ContentItem<WorkFrontmatter>[] = getAllCaseStudies(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  const resolved: ResolvedArticleSummary[] = [];

  for (const caseStudy of caseStudies) {
    if (!caseStudy.frontmatter.engineeringLog.includes(logEntry.slug)) {
      continue;
    }
    resolved.push(toCaseStudySummary(caseStudy));
    if (resolved.length >= limit) break;
  }

  return resolved;
}

export interface EngineeringLogPreviousNextResult {
  previous: ResolvedArticleSummary | null;
  next: ResolvedArticleSummary | null;
}

/**
 * Exported (Task 6.4, `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md`
 * WI-4): `lib/content/search.ts` needs the identical Engineering Log →
 * summary mapping this file already uses for Previous/Next — the same
 * "reuse, don't duplicate" precedent `toCaseStudySummary()`
 * (`case-study-relationships.ts`) and `toSummary()` (`relationships.ts`)
 * both already set for Work and Knowledge respectively.
 */
export function toEngineeringLogArticleSummary(
  item: EngineeringLogItem,
): ResolvedArticleSummary {
  return {
    slug: item.slug,
    collection: "engineering-log",
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    href: `/engineering-log/${item.slug}`,
    readingTime: item.readingTime.text,
    publishedAt: formatDate(item.frontmatter.publishedAt),
  };
}

/**
 * Previous / Next (docs/37 §14, docs/38 WI-3) — pure chronological
 * adjacency, deliberately the one collection in this workspace where
 * publish order *is* the correct signal rather than a fallback (docs/37
 * §14's own reasoning: unlike Work's default order, which means
 * engineering significance, docs/03-SITEMAP.md already establishes
 * chronology as this collection's own primary structure). Reuses
 * `sortByPublishedDate()` (`lib/content/loader.ts`, already generic,
 * already non-mutating) rather than a second date comparator.
 *
 * No wraparound — the oldest entry has no "previous," the newest has no
 * "next," the same "position within a fixed order, no ring" contract
 * `resolvePreviousNextCaseStudy`'s own domain/collection neighbor finders
 * already establish for Work.
 */
export function resolvePreviousNextLog(
  logEntry: EngineeringLogItem,
  allEntries: EngineeringLogItem[] = getAllEngineeringLogEntries(),
): EngineeringLogPreviousNextResult {
  const sorted = sortByPublishedDate(allEntries);
  const index = sorted.findIndex((item) => item.slug === logEntry.slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  // Newest-first order: the entry one position later in the array is
  // older (chronologically "previous"); one position earlier is newer
  // ("next") — matching sortByPublishedDate()'s own documented
  // newest-first contract.
  const previousEntry = sorted[index + 1];
  const nextEntry = sorted[index - 1];

  return {
    previous: previousEntry
      ? toEngineeringLogArticleSummary(previousEntry)
      : null,
    next: nextEntry ? toEngineeringLogArticleSummary(nextEntry) : null,
  };
}
