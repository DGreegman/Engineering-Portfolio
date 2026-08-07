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
