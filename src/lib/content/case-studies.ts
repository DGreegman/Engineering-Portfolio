/**
 * Case Study Resolution
 *
 * The work/-collection-specific layer on top of the generic content engine
 * (`loader.ts`, `schema.ts`) — Task 5.3's document-loading counterpart to
 * `lib/content/articles.ts`, mirroring that file's shape exactly rather
 * than introducing a differently-organized equivalent. Exists for the
 * identical reason: `app/work/[slug]/page.tsx` reaches for one small, typed
 * API instead of passing the `"work"` collection key and `WorkFrontmatter`
 * type argument around by hand at every call site. Nothing here
 * re-implements loading, parsing, or reading-time calculation — `loader.ts`
 * already does all of that generically; this file only narrows and shapes
 * its output for the `work` collection.
 *
 * Deliberately its own file, not folded into `lib/content/work.ts` — that
 * file resolves the Work Landing/Library's own aggregate, placeholder-
 * backed views (`getFeaturedCaseStudies()`, `getProjectLibrary()`,
 * `getEngineeringThemes()`) for Tasks 5.1/5.2, which this task does not
 * touch. This file resolves real `content/work/*.mdx` documents for the
 * Case Study reading experience specifically — two different data
 * maturities today (fixture array vs. real MDX collection), kept in two
 * files so neither task's scope leaks into the other's ("keep Work-specific
 * behavior isolated," this task's own constraint, applied at the file
 * boundary as well as the component one). See `case-study-relationships.ts`'s
 * docstring for the concrete consequence this has for Previous/Next, and
 * `lib/content/work.ts`'s own "Convergence with the Case Study Experience"
 * note for the intended long-term architecture — one resolver, reading one
 * real content source, serving `/work`, `/work/library`, and
 * `/work/[slug]` alike — which this file and that one are expected to
 * merge into once the real Content Engine replaces both. Not a gap to
 * close now: a second dataset invented to bridge it early would be exactly
 * the duplication this split is deliberately avoiding.
 */
import {
  getAll,
  getBySlug,
  getSlugs,
  filterDrafts,
} from "@/lib/content/loader";
import type { WorkFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";

/** Every case study slug on disk (drafts included) — the set `app/work/[slug]/page.tsx` checks a candidate slug against. */
export function getCaseStudySlugs(): string[] {
  return getSlugs("work");
}

/**
 * Whether `slug` resolves to a real case study file. Cheap existence check
 * for the routing layer — doesn't load or parse the file. Also the one
 * place a content-authoring naming discipline is worth stating: a case
 * study's slug must never be `"library"`, the same "structural segment
 * must never be shadowable by content reusing its name" discipline
 * `docs/20-ARTICLE_EXPERIENCE.md` already documented for Knowledge topic
 * slugs — unlike that case, this isn't a routing conflict Next.js would
 * even hit (`app/work/library/` is a static segment, `app/work/[slug]/` a
 * dynamic one, and Next.js resolves the static one first without
 * ambiguity), but a case study literally titled to collide with the
 * Library's own URL would still be a confusing, avoidable choice.
 */
export function caseStudyExists(slug: string): boolean {
  return getCaseStudySlugs().includes(slug);
}

/**
 * Loads one case study by slug. Throws if it doesn't exist — the same
 * "never fail silently" contract `getBySlug()` itself has. Callers where a
 * miss is an *expected* outcome (routing, most notably) should check
 * `caseStudyExists()` first rather than catching this.
 */
export function getCaseStudyBySlug(slug: string): ContentItem<WorkFrontmatter> {
  return getBySlug<WorkFrontmatter>("work", slug);
}

/** Every published (non-draft) case study — the common case for Previous/Next and relationship resolution. */
export function getAllCaseStudies(): ContentItem<WorkFrontmatter>[] {
  return filterDrafts(getAll<WorkFrontmatter>("work"));
}

/**
 * The centralized metadata shape this route needs — title, description,
 * domain, status, timeline, difficulty, reading time, dates, tech stack,
 * and the relationship slug lists a future consumer might also need. A
 * flattening view over `ContentItem<WorkFrontmatter>`, the same role
 * `ArticleMetadata`/`getArticleMetadata()` play for Knowledge.
 */
export interface CaseStudyMetadata {
  title: string;
  description: string;
  domain: string;
  status: WorkFrontmatter["status"];
  timeline?: string;
  difficulty?: WorkFrontmatter["difficulty"];
  technologies: string[];
  readingTime: ContentItem["readingTime"];
  publishedAt: Date;
  updatedAt?: Date;
  featured: boolean;
  relatedContent: string[];
  engineeringLog: string[];
}

export function getCaseStudyMetadata(
  item: ContentItem<WorkFrontmatter>,
): CaseStudyMetadata {
  const fm = item.frontmatter;
  return {
    title: fm.title,
    description: fm.description,
    domain: fm.domain,
    status: fm.status,
    timeline: fm.timeline,
    difficulty: fm.difficulty,
    technologies: fm.technologies,
    readingTime: item.readingTime,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    featured: fm.featured,
    relatedContent: fm.relatedContent,
    engineeringLog: fm.engineeringLog,
  };
}
