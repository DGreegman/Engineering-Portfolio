import { getAllArticles } from "@/lib/content/articles";
import { formatDate } from "@/lib/utils/format-date";
import type { KnowledgeFrontmatter } from "@/lib/content/schema";
import type { CollectionKey, ContentItem, Difficulty } from "@/types/content";

export interface RelationshipRef {
  slug: string;
  collection: CollectionKey;
}

export interface ResolvedRelationship extends RelationshipRef {
  title: string;
}

/**
 * Relationship resolution (docs/11-Content Model.md "Relationships"): turns
 * a raw slug reference (as authored in frontmatter — `technologies`,
 * `series`) into the real title/metadata of the node it points to.
 *
 * Real resolution is deferred until there's content to resolve against
 * (Task 1.6 requirement 7 — "may initially return placeholders"). Both
 * resolvers below still return the reference unresolved (title = slug)
 * rather than dropping it, so callers can render *something* today and swap
 * to real lookups later without changing their own code. `resolveRelated`
 * and `resolvePrerequisites` used to live here too, in the same
 * unresolved-placeholder shape — Task 4.3.8 ("Related Learning") is the
 * "later" this comment always pointed at for those two specifically: real
 * Knowledge articles exist to resolve against now, so they've been rebuilt
 * below as real lookups rather than kept as placeholders that would have
 * silently kept rendering slugs-as-titles forever. `technologies/` and
 * `series/` still have no loader of their own, so those two stay exactly as
 * Task 1.6 left them.
 */
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

/**
 * A relationship resolved against a real Knowledge article — everything a
 * Related Learning card needs to render (docs/20-ARTICLE_EXPERIENCE.md's
 * "compact set of Knowledge Card previews"), not just a title. Extends
 * `ResolvedRelationship` rather than replacing it: `slug`/`collection`/
 * `title` stay the stable, minimal shape a future cross-collection
 * relationship (`work/`, `engineering-log/`) could also satisfy — this
 * interface only adds the fields Knowledge articles specifically have.
 */
export interface ResolvedArticleSummary extends ResolvedRelationship {
  description: string;
  href: string;
  difficulty?: Difficulty;
  readingTime: string;
  publishedAt: string;
}

/**
 * Every relationship group is capped rather than unbounded — a well-
 * connected article could otherwise accumulate an arbitrarily long list
 * (docs/20's Section 8 "Scalability": "cap Related Concepts visually (3–4
 * shown, regardless of how many the frontmatter lists)"). `sameTopic` gets
 * its own, slightly smaller cap: it's a fallback tier, not a primary
 * relationship, and shouldn't visually outweigh the explicit groups above
 * it when it does render.
 */
const DEFAULT_RELATIONSHIP_LIMIT = 4;
const SAME_TOPIC_FALLBACK_LIMIT = 3;

type KnowledgeItem = ContentItem<KnowledgeFrontmatter>;

function toSummary(item: KnowledgeItem): ResolvedArticleSummary {
  return {
    slug: item.slug,
    collection: "knowledge",
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    href: `/knowledge/${item.slug}`,
    difficulty: item.frontmatter.difficulty,
    readingTime: item.readingTime.text,
    publishedAt: formatDate(item.frontmatter.publishedAt),
  };
}

/**
 * Resolves a raw slug list (`prerequisites` or `relatedContent`) against
 * real, published Knowledge articles — the one lookup both relationship
 * types need, shared here rather than duplicated in each (this task's own
 * "avoid duplicate relationship logic" constraint). Preserves the order the
 * author wrote the slugs in: this is curated, intentional data, not
 * something to re-sort by any other key.
 *
 * A slug with no matching *published* article — a typo, a still-draft
 * article, or content that was later removed — is silently skipped rather
 * than rendered as a broken link or a bare slug standing in for a title.
 * `articles` is expected to already be draft-filtered (`getAllArticles()`
 * is), so this function doesn't need its own knowledge of what "published"
 * means.
 */
/**
 * Exported (Task 5.3): the one lookup Related Knowledge
 * (`case-study-relationships.ts`) needs is identical to what Prerequisites/
 * Related Concepts already do here — resolve a raw slug list against a real
 * Knowledge article collection — and this function already does exactly
 * that generically (it only reads `articles`/a slug list/`excludeSlug`/
 * `limit`, nothing Knowledge-specific beyond the `KnowledgeItem[]` it
 * resolves against). Exporting it directly, rather than duplicating its
 * ~15 lines in a second file, is "prefer extension over duplication"
 * applied at function granularity, not just component granularity.
 */
export function resolveArticleReferences(
  slugs: string[],
  articles: KnowledgeItem[],
  excludeSlug: string,
  limit: number,
): ResolvedArticleSummary[] {
  const bySlug = new Map(articles.map((item) => [item.slug, item]));
  const seen = new Set<string>();
  const resolved: ResolvedArticleSummary[] = [];

  for (const slug of slugs) {
    if (slug === excludeSlug || seen.has(slug)) continue;
    const match = bySlug.get(slug);
    if (!match) continue;
    seen.add(slug);
    resolved.push(toSummary(match));
    if (resolved.length >= limit) break;
  }

  return resolved;
}

/**
 * Prerequisites — concepts a reader should ideally understand before this
 * document (docs/11-Content Model.md "Prerequisites"). Resolves
 * `frontmatter.prerequisites` against real content; `articles` defaults to
 * `getAllArticles()` for standalone callers, but `resolveRelatedLearning`
 * below always passes an already-fetched list so a page render only reads
 * the Knowledge collection from disk once, not once per group.
 */
export function resolvePrerequisites(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  return resolveArticleReferences(
    article.frontmatter.prerequisites,
    articles,
    article.slug,
    limit,
  );
}

/**
 * Related Concepts — conceptually related documents (docs/11-Content
 * Model.md "Related"), associative rather than sequential. Resolves
 * `frontmatter.relatedContent` the same way `resolvePrerequisites` resolves
 * `prerequisites` — same shared helper, same silent-skip-if-unpublished
 * behavior, same authored order preserved.
 */
export function resolveRelated(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  return resolveArticleReferences(
    article.frontmatter.relatedContent,
    articles,
    article.slug,
    limit,
  );
}

type NeighborDirection = "previous" | "next";

/**
 * Finds the immediate series neighbor of `article` in one direction — the
 * next `seriesOrder` after it, or the previous `seriesOrder` before it, in
 * the same series. Shared by `resolveContinueLearning` (Task 4.3.8, "next"
 * only) and `resolvePreviousNext` (Task 4.3.9, both directions) rather than
 * each re-deriving "closest seriesOrder in one direction" independently —
 * exactly the extension point `resolveContinueLearning`'s own docstring
 * anticipated. A deterministic lookup by an explicit `seriesOrder` number,
 * not a similarity heuristic.
 */
function findSeriesNeighbor(
  article: KnowledgeItem,
  articles: KnowledgeItem[],
  direction: NeighborDirection,
): KnowledgeItem | undefined {
  const { series, seriesOrder } = article.frontmatter;
  if (!series || typeof seriesOrder !== "number") return undefined;

  const candidates = articles.filter(
    (item) =>
      item.slug !== article.slug &&
      item.frontmatter.series === series &&
      typeof item.frontmatter.seriesOrder === "number" &&
      (direction === "next"
        ? item.frontmatter.seriesOrder > seriesOrder
        : item.frontmatter.seriesOrder < seriesOrder),
  );
  if (candidates.length === 0) return undefined;

  return candidates.reduce((closest, candidate) => {
    const candidateOrder = candidate.frontmatter.seriesOrder!;
    const closestOrder = closest.frontmatter.seriesOrder!;
    const candidateIsCloser =
      direction === "next"
        ? candidateOrder < closestOrder
        : candidateOrder > closestOrder;
    return candidateIsCloser ? candidate : closest;
  });
}

/**
 * Continue Learning — "the recommended next step in the learning journey"
 * (Task 4.3.8's own scope). Deliberately narrow: the only relationship in
 * the current content model that expresses authored *sequence* (as opposed
 * to prerequisites' "before" or relatedContent's undirected "alongside") is
 * series membership — `docs/20-ARTICLE_EXPERIENCE.md`'s own Previous/Next
 * precedence names series order "the most intentional, author-defined
 * sequence that exists." Reusing it here, rather than inventing a new
 * `nextSteps` frontmatter field, is exactly this task's "reuse the
 * metadata and relationship fields already defined in the content model"
 * constraint.
 *
 * Returns at most one article: the next `seriesOrder` after this one, in
 * the same series. An article with no series, or already at the end of
 * one, returns an empty array — a real, expected outcome (not every
 * article is part of a series, and the last part of one has no next part),
 * which is exactly what lets `resolveRelatedLearning` know it's safe to
 * fall through to the Same Topic tier for that article.
 */
export function resolveContinueLearning(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
): ResolvedArticleSummary[] {
  const next = findSeriesNeighbor(article, articles, "next");
  return next ? [toSummary(next)] : [];
}

/**
 * Same Topic — "when explicit relationships are unavailable, fall back to
 * other articles within the same topic" (Task 4.3.8's own scope: "a
 * graceful fallback rather than the primary navigation strategy"). Reuses
 * `frontmatter.topic` — the one required, controlled-vocabulary field every
 * Knowledge article already carries (`docs/20`'s "Required Schema
 * Dependency: topic") — rather than any similarity scoring: "same topic" is
 * a direct equality check on existing metadata, not a heuristic.
 *
 * Deliberately *not* sorted by recency, popularity, or any other ranking
 * signal — this task explicitly excludes "recently published," "popularity
 * ranking," and "recommendation algorithms" from scope, and a fallback tier
 * ranked by any of those would read as exactly that, however incidentally.
 * Alphabetical by title is the neutral, deterministic order: stable across
 * renders, and not a claim that one article is more relevant than another.
 */
export function resolveSameTopicFallback(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
  limit = SAME_TOPIC_FALLBACK_LIMIT,
): ResolvedArticleSummary[] {
  return articles
    .filter(
      (item) =>
        item.slug !== article.slug &&
        item.frontmatter.topic === article.frontmatter.topic,
    )
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
    .slice(0, limit)
    .map(toSummary);
}

/** The four Related Learning groups Task 4.3.8 defines, in display order. */
export interface RelatedLearningGroups {
  prerequisites: ResolvedArticleSummary[];
  continueLearning: ResolvedArticleSummary[];
  relatedConcepts: ResolvedArticleSummary[];
  sameTopic: ResolvedArticleSummary[];
}

/**
 * The single entry point that composes all four Related Learning groups
 * for one article — the one place this composition happens, so a future
 * consumer reuses this instead of re-implementing "when does Same Topic
 * activate" logic independently. `articles` defaults to one
 * `getAllArticles()` read for standalone callers, but accepts an
 * already-fetched list (the same optional-with-a-default shape every other
 * resolver in this file uses) so a caller that also needs
 * `resolvePreviousNext` — Task 4.3.9's route, notably — can fetch the
 * Knowledge collection once and hand it to both instead of each resolver
 * reading it from disk separately.
 *
 * Same Topic only activates when *both* forward-looking groups — Continue
 * Learning and Related Concepts — are empty. Prerequisites is excluded
 * from that check on purpose: prerequisites answer "what should I have
 * read already," a different axis from "what should I read next," so an
 * article that only has prerequisites authored should still get a
 * same-topic fallback for what comes after it.
 */
export function resolveRelatedLearning(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
): RelatedLearningGroups {
  const continueLearning = resolveContinueLearning(article, articles);
  const relatedConcepts = resolveRelated(article, articles);
  const sameTopic =
    continueLearning.length === 0 && relatedConcepts.length === 0
      ? resolveSameTopicFallback(article, articles)
      : [];

  return {
    prerequisites: resolvePrerequisites(article, articles),
    continueLearning,
    relatedConcepts,
    sameTopic,
  };
}

/**
 * Every Knowledge article sharing `article`'s topic, including `article`
 * itself, in one fixed, deterministic order — the ordering
 * `findTopicNeighbor` walks to find an immediate neighbor. Alphabetical by
 * title (slug as a tie-breaker, for the vanishingly unlikely case of two
 * identical titles), same reasoning as `resolveSameTopicFallback`: Task
 * 4.3.9 explicitly forbids ordering by "publication date or article
 * recency," so this can't reuse `sortByPublishedDate` — alphabetical is
 * the neutral, stable key that isn't a ranking claim.
 */
function sortedTopicSiblings(
  article: KnowledgeItem,
  articles: KnowledgeItem[],
): KnowledgeItem[] {
  return articles
    .filter((item) => item.frontmatter.topic === article.frontmatter.topic)
    .sort(
      (a, b) =>
        a.frontmatter.title.localeCompare(b.frontmatter.title) ||
        a.slug.localeCompare(b.slug),
    );
}

/**
 * Finds `article`'s immediate neighbor within its own topic, in the fixed
 * order `sortedTopicSiblings` establishes — Task 4.3.9's "Topic ordering"
 * precedence tier. No wraparound: the alphabetically-last article in a
 * topic has no topic-tier "next," the same way the first has no topic-tier
 * "previous" — both are real, expected outcomes (this is a position within
 * a list, not a ring), not a bug to paper over by wrapping to the other
 * end.
 */
function findTopicNeighbor(
  article: KnowledgeItem,
  articles: KnowledgeItem[],
  direction: NeighborDirection,
): KnowledgeItem | undefined {
  const siblings = sortedTopicSiblings(article, articles);
  const index = siblings.findIndex((item) => item.slug === article.slug);
  // Defensive only: `article` always shares its own topic with itself, so
  // it's always present in its own `sortedTopicSiblings` list.
  if (index === -1) return undefined;

  const neighborIndex = direction === "next" ? index + 1 : index - 1;
  return siblings[neighborIndex];
}

/** Previous/Next Navigation's resolved pair (Task 4.3.9) — either side may be absent. */
export interface PreviousNextResult {
  previous: ResolvedArticleSummary | null;
  next: ResolvedArticleSummary | null;
}

/**
 * Previous / Next Navigation (Task 4.3.9) — the canonical reading sequence
 * through structured knowledge, distinct from Related Learning's
 * exploratory groups (Task 4.3.8). Resolved independently per side, each
 * cascading through the task's own fixed precedence:
 *
 *   1. Series order    — `findSeriesNeighbor` (shared with Continue Learning)
 *   2. Topic ordering   — `findTopicNeighbor`, alphabetical, no recency
 *   3. No navigation     — that side simply stays `null`
 *
 * Precedence is evaluated per side, not "series covers both sides or
 * neither": the first article in a 3-part series has a real topic-tier
 * "previous" (whatever came before the series started) even though its
 * "next" is served by series order — collapsing that to an all-or-nothing
 * choice between tiers would throw away a real, useful "previous" link for
 * no reason the task asks for. `docs/20-ARTICLE_EXPERIENCE.md`'s own
 * Previous/Next section reasons about "next" the same way, tier by tier;
 * this applies the identical reasoning symmetrically to "previous."
 *
 * Deliberately has no third, chronological-order fallback tier — unlike
 * `docs/20`'s own proposal (which named "global chronological order" as a
 * last resort "never nothing"), this task's own Navigation Resolution
 * section is explicit: "3. No navigation" and "Do not use publication date
 * or article recency." Where the two disagree, this task's concrete scope
 * is authoritative for what gets built.
 */
export function resolvePreviousNext(
  article: KnowledgeItem,
  articles: KnowledgeItem[] = getAllArticles(),
): PreviousNextResult {
  const previous =
    findSeriesNeighbor(article, articles, "previous") ??
    findTopicNeighbor(article, articles, "previous");
  const next =
    findSeriesNeighbor(article, articles, "next") ??
    findTopicNeighbor(article, articles, "next");

  return {
    previous: previous ? toSummary(previous) : null,
    next: next ? toSummary(next) : null,
  };
}
