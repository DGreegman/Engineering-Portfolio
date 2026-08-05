/**
 * Shared content-engine types. Kept separate from src/lib/content/schema.ts
 * so type-only consumers don't need to pull in the Zod runtime.
 */

/**
 * Knowledge Types from docs/11-Content Model.md, mapped 1:1 to content/
 * folders (see src/lib/content/collections.ts). "technology" is not a
 * Knowledge Type in the Content Model — technologies/ holds entities
 * referenced by knowledge nodes, not knowledge nodes themselves.
 */
export const CONTENT_TYPES = [
  "evergreen",
  "case-study",
  "engineering-log",
  "series",
] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];

/** docs/05-Knowledge Architecture.md "Difficulty Levels". */
export const DIFFICULTIES = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** One key per content/ subdirectory this engine understands. */
export const COLLECTION_KEYS = [
  "knowledge",
  "work",
  "engineering-log",
  "series",
  "technologies",
] as const;
export type CollectionKey = (typeof COLLECTION_KEYS)[number];

export interface Heading {
  depth: 2 | 3 | 4;
  text: string;
  slug: string;
}

export interface ReadingTimeResult {
  text: string;
  minutes: number;
  words: number;
}

export interface ContentItem<Frontmatter = Record<string, unknown>> {
  slug: string;
  collection: CollectionKey;
  type: ContentType | "technology";
  frontmatter: Frontmatter;
  /** Raw MDX body — frontmatter stripped, not yet compiled to React. */
  body: string;
  readingTime: ReadingTimeResult;
  filePath: string;
}
