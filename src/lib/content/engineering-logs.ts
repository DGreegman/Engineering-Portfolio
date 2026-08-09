/**
 * Engineering Log Resolution
 *
 * The engineering-log/-collection-specific layer on top of the generic
 * content engine — the minimum needed for Related Engineering Logs
 * (docs/31-CASE_STUDY_EXPERIENCE.md §6) to resolve against something real
 * rather than staying permanently unresolvable. `lib/content/collections.ts`
 * already registers `"engineering-log"` (schema: `articleFrontmatterSchema`,
 * type: `"engineering-log"`), and `loader.ts`'s `getSlugs`/`getBySlug` are
 * already generic across every registered collection — this file only
 * narrows that already-existing capability to one typed API, the same
 * minimal role `lib/content/articles.ts`/`case-studies.ts` play for their
 * own collections. No `EngineeringLogFrontmatter` type is introduced:
 * engineering-log/ uses the same `articleFrontmatterSchema` knowledge/ and
 * work/ both extend, so `ArticleFrontmatter` already fits.
 *
 * `content/engineering-log/` holds no real content yet (`.gitkeep` only) —
 * building the *reading experience* for `/engineering-log/[slug]` is not
 * this task's scope (no such route exists, and none is named in
 * `docs/28-WORK_IMPLEMENTATION_PLAN.md`'s Task 5.3 breakdown). This file
 * exists only so `case-study-relationships.ts`'s Related Engineering Logs
 * resolver has a real collection to query — today, that query always
 * returns an empty list, honestly, the same "silently skip what doesn't
 * exist yet" behavior every other relationship resolver in this codebase
 * already applies to unpublished or missing content, never a fabricated
 * result.
 */
import {
  getAll,
  getBySlug,
  getSlugs,
  filterDrafts,
} from "@/lib/content/loader";
import type { ArticleFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";

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
