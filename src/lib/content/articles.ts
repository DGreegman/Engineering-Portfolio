/**
 * Article Resolution
 *
 * The knowledge/-collection-specific layer on top of the generic content
 * engine (`loader.ts`, `schema.ts`) — Task 4.3.1's "Document Loading" and
 * "Metadata Resolution" scope. Exists so callers (the routing layer today;
 * presentation components in later tasks) reach for one small, typed API
 * instead of passing the `"knowledge"` collection key and
 * `KnowledgeFrontmatter` type argument around by hand at every call site —
 * this is what "metadata loading should remain centralized" means in
 * practice. Nothing here re-implements loading, parsing, or reading-time
 * calculation — `loader.ts` already does all of that generically; this
 * file only narrows and shapes its output for the one collection Task
 * 4.3.1 cares about.
 */
import {
  getAll,
  getBySlug,
  getSlugs,
  filterDrafts,
} from "@/lib/content/loader";
import type { KnowledgeFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";

/** Every Knowledge article slug on disk (drafts included) — the set Step 2 of the routing resolution order checks a candidate slug against. */
export function getArticleSlugs(): string[] {
  return getSlugs("knowledge");
}

/**
 * Whether `slug` resolves to a real Knowledge article file. Cheap
 * existence check for the routing layer — doesn't load or parse the file,
 * so a route can decide "is this an article?" without paying for a load
 * it might not need (e.g. when Step 1 already matched a topic).
 */
export function articleExists(slug: string): boolean {
  return getArticleSlugs().includes(slug);
}

/**
 * Loads one Knowledge article by slug. Throws if it doesn't exist — the
 * same "never fail silently" contract `getBySlug()` itself has (AGENT.md
 * "Error Handling"). Callers where a miss is an *expected* outcome, not a
 * bug (routing, most notably), should check `articleExists()` first rather
 * than catching this.
 */
export function getArticleBySlug(
  slug: string,
): ContentItem<KnowledgeFrontmatter> {
  return getBySlug<KnowledgeFrontmatter>("knowledge", slug);
}

/** Every published (non-draft) Knowledge article — the common case for future listings, prev/next, and related-content resolution. */
export function getAllArticles(): ContentItem<KnowledgeFrontmatter>[] {
  return filterDrafts(getAll<KnowledgeFrontmatter>("knowledge"));
}

/**
 * The centralized metadata shape Task 4.3.1's "Metadata Resolution"
 * section asks for — title, description, topic, tags, difficulty, reading
 * time, published/updated date, series, and the rest of the frontmatter a
 * future presentation layer will need. A flattening view over
 * `ContentItem<KnowledgeFrontmatter>`: nothing here is computed that
 * `loader.ts`/`reading-time` didn't already compute — this exists so every
 * future consumer reads metadata through one shape instead of reaching
 * into `.frontmatter.X` and `.readingTime` separately at each call site.
 *
 * `draft` is deliberately excluded: it's an editorial/publishing-state
 * flag `filterDrafts()` already consumes internally, not reader-facing
 * metadata.
 */
export interface ArticleMetadata {
  title: string;
  description: string;
  topic: KnowledgeFrontmatter["topic"];
  tags: string[];
  technologies: string[];
  difficulty?: KnowledgeFrontmatter["difficulty"];
  readingTime: ContentItem["readingTime"];
  publishedAt: Date;
  updatedAt?: Date;
  series?: string;
  seriesOrder?: number;
  featured: boolean;
  prerequisites: string[];
  relatedContent: string[];
  author?: string;
  coverImage?: string;
}

export function getArticleMetadata(
  item: ContentItem<KnowledgeFrontmatter>,
): ArticleMetadata {
  const fm = item.frontmatter;
  return {
    title: fm.title,
    description: fm.description,
    topic: fm.topic,
    tags: fm.tags,
    technologies: fm.technologies,
    difficulty: fm.difficulty,
    readingTime: item.readingTime,
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt,
    series: fm.series,
    seriesOrder: fm.seriesOrder,
    featured: fm.featured,
    prerequisites: fm.prerequisites,
    relatedContent: fm.relatedContent,
    author: fm.author,
    coverImage: fm.coverImage,
  };
}
