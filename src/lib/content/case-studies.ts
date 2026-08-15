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
 * Deliberately its own file, not folded into `lib/content/work.ts`. Task 5.3
 * originally split the two along a data-maturity line — this file resolved
 * real `content/work/*.mdx` documents for the Case Study reading experience
 * specifically, while `work.ts` resolved the Work Landing/Library's own
 * aggregate, placeholder-backed views. **The Real Content Migration (Task
 * 7.1, docs/52) completed the convergence `work.ts`'s own docstring already
 * predicted**: `/work` and `/work/library` now read this file's
 * `getFeaturedCaseStudies()`/`getCaseStudyDomainGroups()`/
 * `getCaseStudyLibrary()` (below), the real `content/work/*.mdx` collection
 * — `work.ts`'s own, identically-named placeholder-backed versions are no
 * longer used by either surface. `work.ts` itself is not modified by that
 * migration and is not merged into this file: it remains Homepage's own,
 * still-legitimate source for its Case Studies section
 * (`src/app/page.tsx`), a dependency Task 7.1 explicitly left untouched
 * (docs/52 §8). See `case-study-relationships.ts`'s docstring for the
 * concrete, still-current consequence this split has for Previous/Next.
 */
import {
  getAll,
  getBySlug,
  getSlugs,
  filterDrafts,
  sortByPublishedDate,
} from "@/lib/content/loader";
import { formatDate } from "@/lib/utils/format-date";
import type { WorkFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";
import type { EngineeringThemeEntry } from "@/lib/constants/placeholder-work-landing";

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

/**
 * Real Content Migration (Task 7.1, docs/52 WI-3/WI-4/WI-5)
 *
 * Everything below this line resolves `/work` and `/work/library` against
 * this file's own real `content/work/*.mdx` collection — never
 * `lib/content/work.ts`'s `PLACEHOLDER_WORK`/`PLACEHOLDER_ARCHITECTURE_
 * HIGHLIGHTS`/`PLACEHOLDER_ENGINEERING_LESSONS`, per docs/52's own explicit
 * guardrail. `work.ts` itself is not modified anywhere by this migration —
 * it remains Homepage's only source for its own Case Studies section
 * (`src/app/page.tsx`), a dependency this migration does not touch.
 *
 * **Naming collision, named explicitly (docs/52 §7)**: `getFeaturedCaseStudies()`
 * below reuses the exact name `work.ts` already exports for its own,
 * placeholder-backed version — the same "reach for the wrong file out of
 * habit" risk `docs/42` §3 already found real once for Search. Import this
 * one, from `case-studies.ts`, for any real-content Discovery surface;
 * `work.ts`'s version is retained only for Homepage.
 */
export function toCaseStudyEntry(
  item: ContentItem<WorkFrontmatter>,
): CaseStudyEntry {
  return {
    title: item.frontmatter.title,
    summary: item.frontmatter.description,
    domain: item.frontmatter.domain,
    status: item.frontmatter.status,
    publishedAt: formatDate(item.frontmatter.publishedAt),
    href: `/work/${item.slug}`,
    featured: item.frontmatter.featured,
  };
}

export interface FeaturedCaseStudiesOptions {
  /** Case studies to select from. Defaults to a fresh getAllCaseStudies() read. */
  caseStudies?: ContentItem<WorkFrontmatter>[];
  /** Maximum number of case studies returned. */
  limit?: number;
}

/**
 * Featured case studies first, newest-first fallback to fill any remaining
 * slots — mirrors `articles.ts`'s `getFeaturedArticles()` exactly, not a
 * divergent algorithm for this collection. **The fallback is required, not
 * optional**: confirmed by direct inspection of every real case study's
 * frontmatter, zero of the 4 real documents set `featured: true` today, so
 * a strict `.filter(featured)` with no fallback would render an
 * honest-but-empty section on day one of this migration (docs/52 §7).
 */
export function getFeaturedCaseStudies({
  caseStudies = getAllCaseStudies(),
  limit = 3,
}: FeaturedCaseStudiesOptions = {}): ContentItem<WorkFrontmatter>[] {
  const featured = sortByPublishedDate(
    caseStudies.filter((item) => item.frontmatter.featured),
  ).slice(0, limit);

  if (featured.length >= limit) return featured;

  const featuredSlugs = new Set(featured.map((item) => item.slug));
  const fallback = sortByPublishedDate(
    caseStudies.filter((item) => !featuredSlugs.has(item.slug)),
  ).slice(0, limit - featured.length);

  return [...featured, ...fallback];
}

export interface CaseStudyDomainGroup {
  domain: string;
  caseStudies: CaseStudyEntry[];
}

/**
 * Groups real case studies by `domain` — the real-data replacement for
 * Architecture Highlights' fixture-backed engineering-theme taxonomy
 * (docs/52 WI-5). `domain` is real, required on every case study, and
 * already used for exactly this kind of engineering-concern navigation
 * elsewhere in this codebase (`findDomainNeighbor()`,
 * `case-study-relationships.ts`). Groups render in first-appearance order
 * within `caseStudies`' own order — never re-sorted — the same "respect
 * whatever order you're handed" discipline `CaseStudyListing`'s own domain
 * grouping already holds itself to.
 */
export function getCaseStudyDomainGroups(
  caseStudies: ContentItem<WorkFrontmatter>[] = getAllCaseStudies(),
): CaseStudyDomainGroup[] {
  const groups: CaseStudyDomainGroup[] = [];
  for (const item of caseStudies) {
    const entry = toCaseStudyEntry(item);
    const existing = groups.find((group) => group.domain === entry.domain);
    if (existing) {
      existing.caseStudies.push(entry);
    } else {
      groups.push({ domain: entry.domain, caseStudies: [entry] });
    }
  }
  return groups;
}

/**
 * The real-content counterpart to `work.ts`'s own `CaseStudyLibrary`/
 * `getCaseStudyLibrary()` (docs/52 WI-4) — deliberately defines its own
 * local shape rather than importing `work.ts`'s interface, even as a
 * type-only import, to keep the two files fully decoupled (docs/52 §9).
 * `themes` is real-shaped (`EngineeringThemeEntry[]`, so `BrowseLenses`'
 * existing prop contract needs no change) but empty by construction: no
 * real per-case-study theme/technology facet exists yet (docs/52 WI-5).
 * `BrowseLenses`' Domain and Status lenses remain fully real and populated
 * regardless — only its one unsupported Theme perspective goes quiet.
 */
export interface CaseStudyLibrary {
  caseStudies: CaseStudyEntry[];
  themes: EngineeringThemeEntry[];
  count: number;
}

export function getCaseStudyLibrary(): CaseStudyLibrary {
  const caseStudies = getAllCaseStudies().map(toCaseStudyEntry);
  return {
    caseStudies,
    themes: [],
    count: caseStudies.length,
  };
}
