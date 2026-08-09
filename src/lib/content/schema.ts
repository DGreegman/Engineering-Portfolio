import { z } from "zod";
import { DIFFICULTIES } from "@/types/content";
import { TOPIC_SLUGS } from "@/lib/content/topics";

export const difficultySchema = z.enum(DIFFICULTIES);

/**
 * Frontmatter authors write for knowledge/, work/, and engineering-log/
 * content. Fields drawn from docs/10-Technical Architecture.md's Metadata
 * Standard, plus series membership and author from docs/11-Content Model.md.
 *
 * `slug` and `readingTime` are deliberately absent: slugs come from the
 * filename (see lib/content/loader.ts) so URLs stay stable even if a title
 * changes (docs/11-Content Model.md "URL Philosophy"), and reading time is
 * always computed, never authored by hand (Task 1.6 requirement 5).
 */
export const articleFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  difficulty: difficultySchema.optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  coverImage: z.string().optional(),
  prerequisites: z.array(z.string()).default([]),
  relatedContent: z.array(z.string()).default([]),
  series: z.string().optional(),
  seriesOrder: z.number().int().optional(),
  author: z.string().optional(),
});
export type ArticleFrontmatter = z.infer<typeof articleFrontmatterSchema>;

/**
 * `topic` — Task 4.3.1's "Required Schema Dependency: `topic`"
 * (docs/20-ARTICLE_EXPERIENCE.md). Required, singular, controlled
 * vocabulary (`TOPIC_SLUGS`), independent of `tags`: `tags` are free-form
 * and multi-valued (docs/11-Content Model.md's Tag Model — "represent
 * concepts... power filtering and discovery"); `topic` answers a different
 * question — "which single shelf does this document live on?" — the same
 * way a physical book has exactly one call number even if it's
 * cross-referenced under several subject headings.
 */
export const topicSchema = z.enum(TOPIC_SLUGS);

/**
 * Frontmatter for knowledge/ content specifically — extends
 * `articleFrontmatterSchema` with the required `topic` field rather than
 * adding `topic` to the shared schema directly, since `work/` (case
 * studies) and `engineering-log/` entries also use
 * `articleFrontmatterSchema` (see collections.ts) and aren't "located"
 * within one of the eight knowledge topics the way an evergreen article
 * is — requiring `topic` on those collections too would misapply a
 * knowledge-library-specific concept to content that isn't part of the
 * knowledge library.
 */
export const knowledgeFrontmatterSchema = articleFrontmatterSchema.extend({
  topic: topicSchema,
});
export type KnowledgeFrontmatter = z.infer<typeof knowledgeFrontmatterSchema>;

/**
 * Frontmatter for work/ (Case Study) content specifically — Task 5.3's own
 * "Required Schema Dependency," the identical role `topic` played for
 * `knowledgeFrontmatterSchema` in Task 4.3.1: `docs/31-CASE_STUDY_
 * EXPERIENCE.md` §3/§7 commits the Case Study's Project Header and
 * Previous/Next resolution to a metadata vocabulary — Domain, Status,
 * Timeline, Difficulty — that `articleFrontmatterSchema` alone doesn't
 * carry. Extends the shared schema rather than duplicating its fields,
 * exactly as `knowledgeFrontmatterSchema` already does.
 *
 * `difficulty`, `technologies`, and `relatedContent` are deliberately *not*
 * redeclared here — all three already exist on `articleFrontmatterSchema`
 * and are reused as-is: `difficulty` answers "how difficult was the
 * engineering challenge itself" for a case study (docs/31 §3's explicit
 * distinction from the Article's "how hard is this to learn" use of the
 * same field); `technologies` is exactly `docs/26-CASE_STUDY_TEMPLATE.md`'s
 * "Tech Stack" field under a name the content model already established —
 * adding a second, differently-named field for the same fact would be
 * exactly the kind of duplication `24-ENGINEERING_PRINCIPLES.md` Principle
 * 3 (Single Source of Truth) rules out, so the Project Header's supporting
 * technology line (docs/31 §3/§7: "technology belongs in supporting
 * metadata, not the primary identity") reads `technologies` directly;
 * `relatedContent` is reused for Related Knowledge resolution (docs/31 §5)
 * via the same `resolveArticleReferences()` `relationships.ts` already
 * exports for Knowledge's own Related Concepts — "reuse the metadata and
 * relationship fields already defined in the content model," the identical
 * constraint Task 4.3.8 held itself to for `resolveContinueLearning()`.
 *
 * `domain` and `status` are required, matching `CaseStudyEntry`
 * (`lib/constants/placeholder-work.ts`) — the Work Landing and Case Study
 * Library's own vocabulary, reused here rather than invented fresh, per
 * docs/31 §3's "the same collection's own facets reused at the document
 * level." `timeline` is optional: not every case study needs one stated.
 *
 * `engineeringLog` is new: the one relationship type Knowledge articles
 * have no equivalent of. Resolved by `case-study-relationships.ts`'s
 * `resolveRelatedEngineeringLogs()` against `content/engineering-log/`
 * (registered in `collections.ts`, currently empty) — an unresolved slug
 * (inevitable today, since no Engineering Log content exists yet) is
 * silently skipped, the same "honest, not fabricated" behavior
 * `resolveArticleReferences()` already applies to Knowledge's own
 * relationships.
 *
 * `Category`, `Project`, `Role`, `Team Size`, `Repository`, and `Live
 * Demo` from `docs/26-CASE_STUDY_TEMPLATE.md`'s full frontmatter table are
 * deliberately not modeled here — none of them are load-bearing for the
 * reading experience `docs/31` actually specifies (its Project Header
 * commits to Domain/Status/Timeline/Difficulty only). Adding schema fields
 * a design proposal never asked the reading experience to render would be
 * scope beyond what this task approved, not readiness for it.
 */
export const workFrontmatterSchema = articleFrontmatterSchema.extend({
  domain: z.string().min(1),
  status: z.enum(["Completed", "In Progress"]),
  timeline: z.string().optional(),
  engineeringLog: z.array(z.string()).default([]),
});
export type WorkFrontmatter = z.infer<typeof workFrontmatterSchema>;

/**
 * Frontmatter for series/ entries. A series is a container that groups
 * other content, not an article itself — fields from docs/11-Content
 * Model.md's "Series Model".
 */
export const seriesFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  order: z.number().int().default(0),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()).default([]),
});
export type SeriesFrontmatter = z.infer<typeof seriesFrontmatterSchema>;

/**
 * Frontmatter for technologies/ entries. A technology is a reusable entity
 * referenced by knowledge nodes, not a knowledge node itself — fields from
 * docs/11-Content Model.md's "Technology Model".
 */
export const technologyFrontmatterSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  category: z.string().optional(),
  officialWebsite: z.string().url().optional(),
  logo: z.string().optional(),
  color: z.string().optional(),
});
export type TechnologyFrontmatter = z.infer<typeof technologyFrontmatterSchema>;
