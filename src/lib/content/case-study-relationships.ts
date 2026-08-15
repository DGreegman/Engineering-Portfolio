import { getAllArticles } from "@/lib/content/articles";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import {
  resolveArticleReferences,
  type ResolvedArticleSummary,
} from "@/lib/content/relationships";
import { formatDate } from "@/lib/utils/format-date";
import type { ArticleFrontmatter, WorkFrontmatter } from "@/lib/content/schema";
import type { ContentItem } from "@/types/content";

/**
 * Case Study Relationship Resolution
 *
 * The work/-scoped counterpart to `relationships.ts` — Related Knowledge,
 * Related Engineering Logs, and Previous/Next for a Case Study, kept in
 * their own file rather than added to `relationships.ts` directly, per this
 * task's own "keep Work-specific behavior isolated from the shared reading
 * infrastructure" constraint. `relationships.ts` itself is untouched beyond
 * exporting one already-generic function (`resolveArticleReferences`,
 * reused directly below) — this file adds Work-specific resolution, it
 * doesn't fork Knowledge's.
 *
 * A concrete architectural note worth stating once, here, since it shapes
 * every function below: Previous/Next and "same domain" adjacency resolve
 * against `getAllCaseStudies()` — the **real** `content/work/*.mdx`
 * collection (`case-studies.ts`) — never against `lib/content/work.ts`'s
 * `getProjectLibrary()`/`getEngineeringThemes()`, which still serve the
 * Work Landing and Case Study Library's own placeholder-backed views
 * (Tasks 5.1/5.2, untouched by this task). These are two different data
 * maturities today — a fixture array describing three example projects,
 * and a real MDX collection that (outside of temporary verification
 * fixtures) starts empty — and merging them now would mean either the
 * document experience depending on fixture data it shouldn't, or the
 * Landing/Library resolvers depending on real content they don't manage.
 * `lib/content/work.ts`'s own docstring already describes the natural
 * convergence path (its functions "become" real Content Engine queries
 * later) — once that happens, both files read the same real collection and
 * this distinction dissolves on its own; forcing it now is out of this
 * task's scope.
 *
 * A direct consequence: `docs/31-CASE_STUDY_EXPERIENCE.md` §7's "same-theme
 * or same-domain adjacency" precedence tier is implemented here as
 * same-**domain** adjacency only. Theme adjacency would need case studies
 * to carry theme metadata of their own, which this task's minimal schema
 * addition (`workFrontmatterSchema`) deliberately doesn't include — see
 * that schema's own docstring for why. Documented as a known limitation in
 * this task's implementation report, not a silent simplification.
 *
 * **Related Case Studies (Task 7.3, `docs/56-RELATED_CONTENT_IMPLEMENTATION_
 * PLAN.md`) is now implemented — see `resolveRelatedCaseStudies()` below.**
 * It resolves through this same file, using the same domain adjacency
 * `findDomainNeighbor()` already computes for Previous/Next, exactly as
 * anticipated here before this task began. Theme adjacency remains out of
 * scope, for the identical reason stated above: case studies still carry
 * no theme metadata of their own.
 */

type WorkItem = ContentItem<WorkFrontmatter>;
type EngineeringLogItem = ContentItem<ArticleFrontmatter>;

/**
 * Four is an intentional editorial maximum, not an incidental implementation
 * detail — confirmed explicitly during Task 5.6's architecture review, so
 * this doesn't drift into "just a number that happened to be here" over
 * time. Its lineage: `docs/20-ARTICLE_EXPERIENCE.md` §8 ("cap Related
 * Concepts visually (3–4 shown, regardless of how many the frontmatter
 * lists)") set the original editorial ceiling for Knowledge's own
 * relationship groups; `docs/31-CASE_STUDY_EXPERIENCE.md` §5 explicitly
 * carried that same ceiling over for the Case Study's Related Knowledge
 * ("capped at a small number regardless of how many a well-connected case
 * study accumulates"); `docs/34-KNOWLEDGE_INTEGRATION.md` §4 then adopted
 * the existing constant rather than proposing a new one. Reusing the same
 * literal constant `relationships.ts` already defines for Knowledge's own
 * groups (rather than each file inventing its own) is itself part of that
 * intent — one editorial ceiling, shared, not two numbers that could drift
 * apart. Changing this value is a design decision that revisits `docs/34`
 * §4, not a routine tuning knob.
 *
 * Exported as of Task 6.2 (`docs/38-ENGINEERING_LOG_IMPLEMENTATION_PLAN.md`
 * WI-2): `engineering-logs.ts`'s own `resolveRelatedWorkForLog()` needs the
 * identical editorial ceiling for the identical reason — one shared
 * constant every relationship group in this workspace reads, not a second
 * number reintroduced at the one call site that happens to live in a
 * different file.
 */
export const DEFAULT_RELATIONSHIP_LIMIT = 4;

/**
 * Exported as of Task 6.2 (docs/38 WI-2): `engineering-logs.ts`'s
 * `resolveRelatedWorkForLog()` needs the identical
 * `ContentItem<WorkFrontmatter> → ResolvedArticleSummary` mapping this
 * function already performs for Related Knowledge — the same "one mapping,
 * not two" reasoning `DEFAULT_RELATIONSHIP_LIMIT`'s own docstring just
 * gave for the cap, applied here to the shape instead of the number.
 */
export function toCaseStudySummary(item: WorkItem): ResolvedArticleSummary {
  return {
    slug: item.slug,
    collection: "work",
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    href: `/work/${item.slug}`,
    difficulty: item.frontmatter.difficulty,
    readingTime: item.readingTime.text,
    publishedAt: formatDate(item.frontmatter.publishedAt),
  };
}

/**
 * Related Knowledge (docs/31 §5, formalized as one of three Knowledge
 * Integration mechanisms by docs/34 §1/§4 — the other two being inline MDX
 * links, unchanged infrastructure, and the Work Landing's Engineering
 * Lessons → Knowledge links) — resolves `frontmatter.relatedContent`
 * against real, published Knowledge articles. Reuses
 * `resolveArticleReferences()` directly rather than re-implementing the
 * same lookup/exclude/cap logic: the function only needs a slug list and a
 * `KnowledgeItem[]` to resolve against, neither of which is Knowledge-
 * specific in a way that would prevent a Work item's `relatedContent` from
 * using it too. `limit`'s default is `DEFAULT_RELATIONSHIP_LIMIT` — see
 * that constant's own docstring for why it stays fixed at four.
 */
export function resolveRelatedKnowledge(
  caseStudy: WorkItem,
  knowledgeArticles = getAllArticles(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  return resolveArticleReferences(
    caseStudy.frontmatter.relatedContent,
    knowledgeArticles,
    caseStudy.slug,
    limit,
  );
}

export interface ResolvedEngineeringLogSummary {
  slug: string;
  title: string;
  description: string;
  href: string;
  publishedAt: string;
}

function toEngineeringLogSummary(
  item: EngineeringLogItem,
): ResolvedEngineeringLogSummary {
  return {
    slug: item.slug,
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    href: `/engineering-log/${item.slug}`,
    publishedAt: formatDate(item.frontmatter.publishedAt),
  };
}

/**
 * Related Engineering Logs (docs/31 §6) — resolves
 * `frontmatter.engineeringLog` against real Engineering Log entries. Today
 * `content/engineering-log/` is empty (see `engineering-logs.ts`'s own
 * docstring), so this honestly returns an empty list for every case study
 * until real log entries exist — the same "silently skip what doesn't
 * resolve" behavior every other relationship resolver in this codebase
 * already applies, not a special case invented for this one.
 */
export function resolveRelatedEngineeringLogs(
  caseStudy: WorkItem,
  logEntries = getAllEngineeringLogEntries(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedEngineeringLogSummary[] {
  const bySlug = new Map(logEntries.map((item) => [item.slug, item]));
  const resolved: ResolvedEngineeringLogSummary[] = [];

  for (const slug of caseStudy.frontmatter.engineeringLog) {
    const match = bySlug.get(slug);
    if (!match) continue;
    resolved.push(toEngineeringLogSummary(match));
    if (resolved.length >= limit) break;
  }

  return resolved;
}

/**
 * Related Case Studies (Task 7.3, docs/55-RELATED_CONTENT_DISCOVERY.md §6,
 * docs/56 §3) — "what else demonstrates a similar engineering concern"
 * (docs/31 §7), resolved by same-`domain` adjacency: the one authored field
 * every real case study already carries, reused rather than requiring a new
 * one (docs/55 §6's own Architecture Decision D1 — deriving from `domain`
 * is authored-adjacency, not inferred similarity, the same category of
 * signal `resolveSameTopicFallback()` (`relationships.ts`) already uses for
 * Knowledge's own fallback tier).
 *
 * **Deliberately not `findDomainNeighbor()`, below** — that function finds
 * one *immediate positional* neighbor per direction, for Previous/Next; this
 * one returns *every* domain sibling (capped), the same "all matching
 * siblings, not one neighbor" shape `resolveSameTopicFallback()` already
 * established for a structurally identical problem in a different
 * collection. The two are not interchangeable and neither is modified by
 * the other's addition.
 *
 * Sorted alphabetically by title — a neutral, deterministic order, not a
 * relevance ranking claim, the same reasoning `resolveSameTopicFallback()`'s
 * own docstring already gives for its identical choice. `limit` defaults to
 * `DEFAULT_RELATIONSHIP_LIMIT`, the same shared editorial ceiling every
 * other Work-side relationship group in this file already uses — this is a
 * primary Work relationship region, not a fallback tier, so it uses the
 * shared default rather than Knowledge's smaller fallback-specific cap.
 * Reuses `toCaseStudySummary()` unmodified — no new mapping logic, no new
 * result type.
 */
export function resolveRelatedCaseStudies(
  caseStudy: WorkItem,
  allCaseStudies: WorkItem[] = getAllCaseStudies(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  return allCaseStudies
    .filter(
      (item) =>
        item.slug !== caseStudy.slug &&
        item.frontmatter.domain === caseStudy.frontmatter.domain,
    )
    .sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title))
    .slice(0, limit)
    .map(toCaseStudySummary);
}

type NeighborDirection = "previous" | "next";

/**
 * Finds `caseStudy`'s immediate neighbor sharing its `domain`, in
 * `allCaseStudies`' own resolved order — the same "position within a fixed
 * order, no wraparound" logic `relationships.ts`'s `findTopicNeighbor`
 * already established for Knowledge's topic-tier Previous/Next, applied to
 * domain instead of topic and to the real Work collection instead of
 * Knowledge's.
 */
function findDomainNeighbor(
  caseStudy: WorkItem,
  allCaseStudies: WorkItem[],
  direction: NeighborDirection,
): WorkItem | undefined {
  const siblings = allCaseStudies.filter(
    (item) => item.frontmatter.domain === caseStudy.frontmatter.domain,
  );
  const index = siblings.findIndex((item) => item.slug === caseStudy.slug);
  if (index === -1) return undefined;

  const neighborIndex = direction === "next" ? index + 1 : index - 1;
  return siblings[neighborIndex];
}

/**
 * Finds `caseStudy`'s immediate neighbor in the full collection's own
 * resolved order (`getAllCaseStudies()`'s array order — "engineering
 * significance, not authoring convenience," docs/30 §3, applied here as
 * the tier-3 fallback rather than any chronological sort — see this file's
 * own docstring on why chronology is never used).
 *
 * Architecture review note (Task 5.3, post-implementation refinement #1):
 * this tier is a **temporary fallback, not a semantic ordering guarantee.**
 * `getAllCaseStudies()`'s order is today whatever `getSlugs("work")`
 * returns — filesystem directory order, currently alphabetical by
 * filename, an incidental property of `fs.readdirSync()`
 * (`lib/content/loader.ts`), not an authored or resolved relationship.
 * Long term, Previous/Next must not remain dependent on that incidental
 * ordering — the actual continuation a reader should follow needs to come
 * from an explicit engineering relationship (Engineering Collection order,
 * once that capability exists — `docs/29-WORK_LANDING_PROPOSAL.md` §10 —
 * or another documented editorial relationship), not from whatever order
 * files happen to sit in on disk. This tier exists only because, absent
 * such a relationship, "no navigation" would be a worse reader experience
 * than "some navigation, honestly the weakest tier" — it is deliberately
 * the *last* resort in `resolvePreviousNextCaseStudy`'s precedence, below,
 * and should stay there rather than quietly becoming load-bearing.
 */
function findCollectionNeighbor(
  caseStudy: WorkItem,
  allCaseStudies: WorkItem[],
  direction: NeighborDirection,
): WorkItem | undefined {
  const index = allCaseStudies.findIndex(
    (item) => item.slug === caseStudy.slug,
  );
  if (index === -1) return undefined;

  const neighborIndex = direction === "next" ? index + 1 : index - 1;
  return allCaseStudies[neighborIndex];
}

export interface CaseStudyPreviousNextResult {
  previous: ResolvedArticleSummary | null;
  next: ResolvedArticleSummary | null;
}

/**
 * Previous / Next Case Study (docs/31 §7). Precedence, most to least
 * meaningful — the governing rule stays "the most meaningful continuation
 * of engineering understanding, not simply the previous project created"
 * (docs/31 §7); the tiers below are today's best resolvable approximation
 * of it, not its definition:
 *
 *   1. Engineering Collection order — future capability (docs/29 §10),
 *      doesn't exist yet, so this tier never resolves today.
 *   2. Same-domain adjacency — `findDomainNeighbor`, above. (Same-*theme*
 *      adjacency, docs/31 §7's other tier-2 signal, is out of scope — see
 *      this file's own docstring.)
 *   3. The collection's own default order — `findCollectionNeighbor`,
 *      above. Never chronological, and never nothing unless the entire
 *      real collection has only this one case study, which is an honest
 *      "no navigation" outcome (`PreviousNext` already renders nothing
 *      when both sides are null), not a bug. This tier is explicitly a
 *      temporary fallback, not a semantic ordering guarantee — see
 *      `findCollectionNeighbor`'s own docstring for why, and what should
 *      replace it as the real relationship models it approximates become
 *      available.
 *
 * Reuses the existing `PreviousNext` component unmodified: both sides
 * resolve to `ResolvedArticleSummary` (`toCaseStudySummary`, above), the
 * exact shape that component already expects — no new presentation
 * component needed for this region, only new resolution.
 */
export function resolvePreviousNextCaseStudy(
  caseStudy: WorkItem,
  allCaseStudies: WorkItem[] = getAllCaseStudies(),
): CaseStudyPreviousNextResult {
  const previous =
    findDomainNeighbor(caseStudy, allCaseStudies, "previous") ??
    findCollectionNeighbor(caseStudy, allCaseStudies, "previous");
  const next =
    findDomainNeighbor(caseStudy, allCaseStudies, "next") ??
    findCollectionNeighbor(caseStudy, allCaseStudies, "next");

  return {
    previous: previous ? toCaseStudySummary(previous) : null,
    next: next ? toCaseStudySummary(next) : null,
  };
}
