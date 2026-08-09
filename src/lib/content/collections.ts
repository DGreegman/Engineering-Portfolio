import path from "node:path";
import type { z } from "zod";
import type { CollectionKey, ContentType } from "@/types/content";
import {
  articleFrontmatterSchema,
  knowledgeFrontmatterSchema,
  workFrontmatterSchema,
  seriesFrontmatterSchema,
  technologyFrontmatterSchema,
} from "./schema";

export const CONTENT_ROOT = path.join(process.cwd(), "content");

interface CollectionConfig {
  /** Absolute path to the collection's directory under content/. */
  dir: string;
  /** Zod schema every item's frontmatter is validated against. */
  schema: z.ZodTypeAny;
  /** Knowledge Type (or "technology") every item in this collection is tagged with. */
  type: ContentType | "technology";
}

/**
 * Single registry mapping each content/ subdirectory to its schema and
 * type. Adding a new collection is one entry here — src/lib/content/loader.ts
 * stays a single generic implementation (Task 1.6 requirement 8: avoid
 * per-type loaders).
 */
export const COLLECTIONS: Record<CollectionKey, CollectionConfig> = {
  knowledge: {
    dir: path.join(CONTENT_ROOT, "knowledge"),
    // knowledgeFrontmatterSchema, not the shared articleFrontmatterSchema —
    // knowledge/ is the only collection whose entries carry a required
    // `topic` (Task 4.3.1). See schema.ts's docstring on
    // knowledgeFrontmatterSchema for why work/ and engineering-log/ don't.
    schema: knowledgeFrontmatterSchema,
    type: "evergreen",
  },
  work: {
    // `workFrontmatterSchema` (Task 5.3), not the shared
    // `articleFrontmatterSchema` — work/ is the only collection whose
    // entries carry the required `domain`/`status` fields the Case Study
    // Experience's Project Header and Previous/Next resolution depend on
    // (see that schema's own docstring). Same reasoning `knowledge`'s own
    // entry already applies for `topic`, immediately below in spirit if
    // not in file position.
    dir: path.join(CONTENT_ROOT, "work"),
    schema: workFrontmatterSchema,
    type: "case-study",
  },
  "engineering-log": {
    dir: path.join(CONTENT_ROOT, "engineering-log"),
    schema: articleFrontmatterSchema,
    type: "engineering-log",
  },
  series: {
    dir: path.join(CONTENT_ROOT, "series"),
    schema: seriesFrontmatterSchema,
    type: "series",
  },
  technologies: {
    dir: path.join(CONTENT_ROOT, "technologies"),
    schema: technologyFrontmatterSchema,
    type: "technology",
  },
};
