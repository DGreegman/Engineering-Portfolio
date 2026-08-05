import type { CollectionKey } from "@/types/content";

export interface RelationshipRef {
  slug: string;
  collection: CollectionKey;
}

export interface ResolvedRelationship extends RelationshipRef {
  title: string;
}

/**
 * Relationship resolution (docs/11-Content Model.md "Relationships"): turns
 * a raw slug reference (as authored in frontmatter — `prerequisites`,
 * `relatedContent`, `technologies`, `series`) into the real title/metadata
 * of the node it points to.
 *
 * Real resolution is deferred until there's content to resolve against
 * (Task 1.6 requirement 7 — "may initially return placeholders"). Every
 * resolver below returns the reference unresolved (title = slug) rather
 * than dropping it, so callers can render *something* today and swap to
 * real lookups later without changing their own code — these functions are
 * the seam that fills in, not a shape that gets redesigned.
 */
export function resolveRelated(slugs: string[]): ResolvedRelationship[] {
  return slugs.map((slug) => ({ slug, collection: "knowledge", title: slug }));
}

export function resolvePrerequisites(slugs: string[]): ResolvedRelationship[] {
  return slugs.map((slug) => ({ slug, collection: "knowledge", title: slug }));
}

export function resolveTechnologies(slugs: string[]): ResolvedRelationship[] {
  return slugs.map((slug) => ({
    slug,
    collection: "technologies",
    title: slug,
  }));
}

export function resolveSeries(
  slug: string | undefined,
): ResolvedRelationship | null {
  if (!slug) return null;
  return { slug, collection: "series", title: slug };
}
