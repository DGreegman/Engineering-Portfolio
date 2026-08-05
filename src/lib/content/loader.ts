import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { calculateReadingTime } from "@/lib/reading-time";
import type { CollectionKey, ContentItem } from "@/types/content";
import { COLLECTIONS } from "./collections";

const MDX_EXTENSION = ".mdx";

function isMdxFile(filename: string): boolean {
  return filename.endsWith(MDX_EXTENSION);
}

/**
 * All slugs available in a collection, derived from filenames. Slugs are
 * never read from frontmatter — a single, stable source of truth keeps
 * URLs permanent even if a title changes later (docs/11-Content Model.md
 * "URL Philosophy").
 */
export function getSlugs(collection: CollectionKey): string[] {
  const { dir } = COLLECTIONS[collection];
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter(isMdxFile)
    .map((filename) => filename.slice(0, -MDX_EXTENSION.length));
}

/**
 * Loads and validates a single content item. Throws a descriptive error —
 * never fails silently (AGENT.md "Error Handling") — when frontmatter
 * doesn't match the collection's schema.
 *
 * Route-independent: reads directly from the filesystem, so it can be
 * called from a page, a script, or a future search indexer alike (Task 1.6
 * requirement 4).
 */
export function getBySlug<Frontmatter = Record<string, unknown>>(
  collection: CollectionKey,
  slug: string,
): ContentItem<Frontmatter> {
  const { dir, schema, type } = COLLECTIONS[collection];
  const filePath = path.join(dir, `${slug}${MDX_EXTENSION}`);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content: body } = matter(raw);

  let frontmatter: Frontmatter;
  try {
    frontmatter = schema.parse(data) as Frontmatter;
  } catch (error) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), filePath)}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return {
    slug,
    collection,
    type,
    frontmatter,
    body,
    readingTime: calculateReadingTime(body),
    filePath,
  };
}

/**
 * Loads every item in a collection. Includes drafts — pair with
 * filterDrafts().
 *
 * A single malformed file is logged loudly (never silently) but does not
 * take down the whole collection — one author's typo shouldn't be able to
 * break every listing/index/search result across the knowledge base. Direct
 * lookups via getBySlug() still throw hard, so a page fetching one specific
 * slug fails as expected and is caught by Next's error boundary.
 */
export function getAll<Frontmatter = Record<string, unknown>>(
  collection: CollectionKey,
): ContentItem<Frontmatter>[] {
  const items: ContentItem<Frontmatter>[] = [];
  for (const slug of getSlugs(collection)) {
    try {
      items.push(getBySlug<Frontmatter>(collection, slug));
    } catch (error) {
      console.error(error instanceof Error ? error.message : String(error));
    }
  }
  return items;
}

/**
 * Excludes items whose frontmatter has `draft: true`. A no-op for
 * collections without a draft field (e.g. technologies/).
 */
export function filterDrafts<Frontmatter>(
  items: ContentItem<Frontmatter>[],
): ContentItem<Frontmatter>[] {
  return items.filter((item) => {
    const { draft } = item.frontmatter as { draft?: boolean };
    return draft !== true;
  });
}

/**
 * Sorts by `publishedAt` descending (newest first). Items without a
 * `publishedAt` (e.g. series/technologies) sort last, preserving relative
 * order.
 */
export function sortByPublishedDate<Frontmatter>(
  items: ContentItem<Frontmatter>[],
): ContentItem<Frontmatter>[] {
  return [...items].sort((a, b) => {
    const aDate = (a.frontmatter as { publishedAt?: Date }).publishedAt;
    const bDate = (b.frontmatter as { publishedAt?: Date }).publishedAt;
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return bDate.getTime() - aDate.getTime();
  });
}
