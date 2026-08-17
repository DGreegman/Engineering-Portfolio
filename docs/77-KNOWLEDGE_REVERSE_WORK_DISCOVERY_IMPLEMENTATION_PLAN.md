# 77 — Knowledge → Work Reverse Discovery: Implementation Plan

## Status

Implementation Plan — translating `docs/76-MILESTONE_7_DISCOVERY_REASSESSMENT.md` §13/§21/§22's approved finding into a precise, file-by-file specification.

> This document authorizes no implementation. No production source file, route, component, schema, or content was created or modified to produce it.

Task 7.25's implementation-planning turn. Every claim below is re-verified against the live repository this turn — the corpus counts, the exact resolver/component code, and the exact `DocumentLayout` prop list are all read fresh, not carried forward from `docs/76` unchecked.

> **Note on this task's own instructions**: the incoming task specification was received truncated — it ends mid-codeblock partway through §7 ("Do Not Reverse Via Tags / Topics / Domains"), with no further numbered sections or a "required document structure" list arriving. Sections 1–7 as received are followed exactly; everything past that point (resolver placement, component design, `DocumentLayout` wiring, release gate, work items, guardrails) follows the established structural convention this exact document series already uses for a feature implementation plan — `docs/56-RELATED_CONTENT_IMPLEMENTATION_PLAN.md` is the closest precedent (also a small, single-direction relationship addition) and is used as the template for the sections `docs/56` itself contains.

---

## 1. Feature Scope, Restated Precisely

**What this plan authorizes designing (not building)**: a new, narrow, one-directional Discovery region on `/knowledge/[slug]` — **"Applied In These Case Studies"** — showing which real, published Work case study or case studies name the current Knowledge article in their own `relatedContent` array.

**What this plan explicitly does not cover**: a Knowledge → Engineering Log reverse relationship. `docs/76` §13's own evidence (100% Knowledge coverage) is specific to Work→Knowledge edges; the one real Knowledge↔Engineering-Log edge (E4 → `idempotency`) has no parallel "universal coverage" finding, and no such reverse relationship is proposed here. This is not a generic Related Content feature — it is the single, specific, evidenced reverse direction `docs/76` §13 named.

---

## 2. Authoritative Documents — Read in Full

Read in full this turn: `docs/76`, `75`, `74`, `72`, `62`, `56`, `55`, `51`, `50`. Also directly inspected this turn (not assumed from any prior document): `content/knowledge/*.mdx` (7 files), `content/work/*.mdx` (4 files), `src/lib/content/relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `case-studies.ts`, `articles.ts`, `schema.ts`, `src/components/content/document-layout.tsx`, `src/components/work/related-knowledge.tsx`, `src/components/engineering-log/related-work.tsx`, `src/app/knowledge/[slug]/page.tsx`, `src/app/engineering-log/[slug]/page.tsx`, and the current import graph across all three relationship files (`grep ^import`, this turn).

---

## 3. Corpus Re-Verification — Recomputed Fresh, Not Assumed From `docs/76`

### Knowledge — 7 real articles

| Slug | Title | Topic | Tags | `relatedContent` | `publishedAt` |
|---|---|---|---|---|---|
| `append-only-ledger` | The Ledger Pattern: Why a Balance Should Never Be a Field You Update | architecture | ledger, data-modeling, correctness, payments | `money-floating-point`, `idempotency` | 2026-08-16 |
| `data-transfer-objects` | Data Transfer Objects: Why Fetched, Stored, and Exposed Data Need Different Types | architecture | api-design, data-modeling, architecture | — | 2026-08-12 |
| `how-jwt-works` | How JWT Works | security | jwt, authentication, tokens | — | 2026-08-07 |
| `idempotency` | Idempotency: Making "Do This Twice, Safely" a Real Guarantee | distributed-systems | idempotency, correctness, concurrency, payments | `optimistic-vs-pessimistic-locking` | 2026-08-16 |
| `money-floating-point` | Why Money Should Never Use Floating Point | backend | floating-point, money, data-modeling, correctness | — | 2026-08-12 |
| `optimistic-vs-pessimistic-locking` | Optimistic vs Pessimistic Locking | distributed-systems | concurrency, databases, locking, correctness | — | 2026-08-12 |
| `transactional-outbox` | The Transactional Outbox: Making an Event as Durable as the Change It Describes | distributed-systems | outbox, reliability, correctness, payments | `idempotency`, `append-only-ledger` | 2026-08-16 |

### Work — 4 real case studies

| Slug | Title | `relatedContent` (→ Knowledge) | Domain | `engineeringLog` | `publishedAt` |
|---|---|---|---|---|---|
| `cookeaze` | Cookeaze: Reconciling a Wallet Ledger Against an Unreliable Payment Webhook | `idempotency` | Backend Infrastructure | `cookeaze-webhook-reliability-gap` | 2024-12-03 |
| `gohunt` | GoHunt: Learning Go by Building a Job-Matching Pipeline I'd Actually Use | `data-transfer-objects` | AI Systems | — | 2026-07-01 |
| `haya` | Haya: An AI-Powered UX Analysis Platform, Built for Concurrency and Trust | `how-jwt-works` | Platform Engineering | `haya-invitation-gate-removal` | 2025-10-08 |
| `vaultpay` | VaultPay: A Wallet Ledger Reasoned From First Principles | `optimistic-vs-pessimistic-locking`, `money-floating-point`, `append-only-ledger`, `transactional-outbox` | Backend Infrastructure | — | 2026-08-01 |

### The exact Work → Knowledge graph, recomputed by direct frontmatter read this turn

7 authored edges: `vaultpay`→4, `gohunt`→1, `haya`→1, `cookeaze`→1. Plus 1 Engineering-Log→Knowledge edge (E4 → `idempotency`, not part of this feature's own scope — §1). **`docs/76`'s "8 total cross-collection `relatedContent` links" figure is confirmed independently, not merely trusted.**

### The exact reverse map — every Knowledge article's real inbound Work edge(s)

| Knowledge article | Inbound Work document(s) | Count |
|---|---|---|
| `append-only-ledger` | `vaultpay` | 1 |
| `money-floating-point` | `vaultpay` | 1 |
| `optimistic-vs-pessimistic-locking` | `vaultpay` | 1 |
| `transactional-outbox` | `vaultpay` | 1 |
| `idempotency` | `cookeaze` | 1 |
| `data-transfer-objects` | `gohunt` | 1 |
| `how-jwt-works` | `haya` | 1 |

**Confirmed: all 7 real Knowledge articles (100%) have exactly one real inbound Work edge today.** No article has zero, none has more than one yet — the cardinality is uniformly 1, but nothing in the schema or this plan's own resolver design assumes that stays true (§6).

---

## 4. The Existing Forward Relationship (Work → Knowledge) — Verified, Not Modified

| Question | Answer, verified against live code this turn |
|---|---|
| Where is Work's `relatedContent` declared? | `workFrontmatterSchema` extends `articleFrontmatterSchema` (`schema.ts`) — `relatedContent: z.array(z.string()).default([])`, not redeclared, inherited as-is |
| How is it resolved? | `resolveRelatedKnowledge(caseStudy, knowledgeArticles = getAllArticles(), limit = DEFAULT_RELATIONSHIP_LIMIT)` in `case-study-relationships.ts`, which calls the shared `resolveArticleReferences()` (`relationships.ts`) directly |
| How are target Knowledge articles loaded? | `getAllArticles()` (`articles.ts`) — already `filterDrafts()`-wrapped |
| Draft handling | Handled entirely by `getAllArticles()`'s own `filterDrafts()` wrap — no separate check in the resolver |
| Missing targets | `resolveArticleReferences()`'s `bySlug.get(slug)` returns `undefined` for a typo'd/unpublished slug → silently skipped, never rendered as a broken link |
| Ordering | Authored array order preserved (the `for (const slug of slugs)` loop iterates the source's own declared order, not a re-sort) |
| Duplicates | Guarded by a `seen: Set<string>` inside `resolveArticleReferences()` — a slug repeated twice in one array's own authoring only resolves once |
| Self-links | Guarded by an `excludeSlug` parameter — defensive only, since Work and Knowledge slugs are disjoint namespaces and a genuine self-link is structurally impossible |
| Summary mapper | `toSummary()` (`relationships.ts`) — maps a Knowledge `ContentItem` to `ResolvedArticleSummary` |
| Component | `RelatedKnowledge` (`components/work/related-knowledge.tsx`) — `null` when `items.length === 0`; card markup (stretched-link title, description, `difficulty · readingTime · publishedAt` citation) hand-recreated locally, not imported across the route boundary |
| `DocumentLayout` slot | `relatedKnowledge` |

**Nothing above is modified by this plan.**

---

## 5. The Reverse-Pattern Precedent (Engineering Log → Work) — Verified in Full

`resolveRelatedWorkForLog()`, `engineering-logs.ts`:

| Question | Answer, verified against live code this turn |
|---|---|
| Resolver/function name | `resolveRelatedWorkForLog(logEntry, caseStudies = getAllCaseStudies(), limit = DEFAULT_RELATIONSHIP_LIMIT)` |
| Source collection (the item being resolved *for*) | Engineering Log |
| Target collection (being searched) | Work |
| Lookup direction | Reverse — starts from a log entry, asks *"which Case Study or Case Studies name me in their own array"* — the opposite direction from `resolveRelatedEngineeringLogs()`, which reads the Work document's own `engineeringLog` array forward |
| Filtering logic | `for (const caseStudy of caseStudies) { if (!caseStudy.frontmatter.engineeringLog.includes(logEntry.slug)) continue; ... }` — plain array membership, no tag/topic/domain involved anywhere |
| Ordering | The caller's own array order (`getAllCaseStudies()`'s default order) — **not** any order declared by the log entry itself, since the relationship is authored on the *other* side; there is no single "declared order" belonging to the source item to preserve |
| Cardinality | Explicitly many-to-many, documented in the function's own docstring — always returns an array, never assumes "at most one" |
| Draft handling | `caseStudies` defaults to `getAllCaseStudies()`, already `filterDrafts()`-wrapped |
| Summary mapper | `toCaseStudySummary()` (`case-study-relationships.ts`), imported directly — not re-implemented |
| Component/layout integration | `RelatedWork` (`components/engineering-log/related-work.tsx`) → `DocumentLayout`'s `relatedWork` slot → wired in `app/engineering-log/[slug]/page.tsx` |

**Structurally reusable, not literally reusable**: the *shape* — iterate the target collection's own already-loaded array, test one field via `.includes()` against the source item's own slug, push the target's existing summary mapper's output, cap at the shared limit, no de-dup `Set` (each iteration visits a distinct target document at most once, so no duplicate can occur) — transfers exactly. What must be Work-specific, not copied verbatim: the field being tested (`relatedContent`, not `engineeringLog`), the source item's type (`KnowledgeItem`, not `EngineeringLogItem`), and the file this new function lives in (§6).

**One additional, load-bearing fact this precedent establishes**: `case-study-relationships.ts` and `engineering-logs.ts` already form a two-file import cycle in the live codebase (`case-study-relationships.ts` imports `getAllEngineeringLogEntries` from `engineering-logs.ts`; `engineering-logs.ts` imports `DEFAULT_RELATIONSHIP_LIMIT`/`toCaseStudySummary` back from `case-study-relationships.ts`), confirmed by direct `grep ^import` this turn. This cycle already builds and runs correctly — both cross-imports are used only inside function bodies, never at module-evaluation time. This precedent is cited directly in §6's own architecture decision, not invented fresh.

---

## 6. Resolver Design

### 6.1 — Where the resolver belongs (Architecture Decision)

**Context**: the new resolver needs `getAllCaseStudies()`, `toCaseStudySummary()`, and `DEFAULT_RELATIONSHIP_LIMIT` — all three already live in `case-study-relationships.ts`. It is called from `/knowledge/[slug]/page.tsx`, a route that today imports every one of its resolvers from `relationships.ts`.

**Options considered**:

- **(A) Place it in `relationships.ts`** — mirrors "the reverse resolver lives with the file that owns the *page* that renders it" (the same shape `resolveRelatedWorkForLog()` follows: it lives in `engineering-logs.ts`, the file owning `/engineering-log/[slug]`'s other resolvers, not in `case-study-relationships.ts`, which owns the *target* collection). Requires `relationships.ts` to import `toCaseStudySummary`/`DEFAULT_RELATIONSHIP_LIMIT` from `case-study-relationships.ts` — a **new** two-file cycle (today `relationships.ts` imports from neither sibling relationship file, confirmed by direct `grep` this turn).
- **(B) Place it in `case-study-relationships.ts`** — every dependency the function needs (`getAllCaseStudies`, `toCaseStudySummary`, `DEFAULT_RELATIONSHIP_LIMIT`) is already local to this exact file; it already imports `getAllArticles` (Knowledge) for its own existing `resolveRelatedKnowledge()`, so accepting a `KnowledgeItem` parameter here is a natural, symmetric extension of a file that already reasons about both collections in the opposite direction. **Zero new imports, zero new circular dependency.**

**Chosen approach: (B).** The route already has a precedent for importing a resolver from whichever file owns the mechanism rather than requiring a same-collection wrapper — `/engineering-log/[slug]/page.tsx` imports `resolveArticleReferences` directly from `relationships.ts` for its own Related Knowledge resolution, not from a re-export inside `engineering-logs.ts`. `/knowledge/[slug]/page.tsx` importing one resolver directly from `case-study-relationships.ts`, alongside its existing imports from `relationships.ts`, follows the identical, already-established pattern.

**Rejected, explicitly**: option (A) is not chosen — not because the reverse-pattern precedent it follows is wrong (§5 confirms an equivalent cycle already exists and already works safely between `case-study-relationships.ts` and `engineering-logs.ts`), but because option (B) achieves the same result with **no new cycle at all**, a strictly smaller footprint for an equally small feature. Introducing a second circular dependency in this codebase when a zero-cycle option exists and costs nothing extra is not justified.

### 6.2 — Exact resolver

Conceptual shape — no implementation authorized by this document:

```text
// Placed in case-study-relationships.ts, alongside resolveRelatedKnowledge()
// (the forward direction) and resolveRelatedWorkForLog()'s own sibling
// precedent in engineering-logs.ts.

type KnowledgeItem = ContentItem<KnowledgeFrontmatter>;
// ^ new local type alias, mirroring this file's existing WorkItem/
//   EngineeringLogItem aliases; requires one new type-only import,
//   `KnowledgeFrontmatter` from "@/lib/content/schema" (ArticleFrontmatter/
//   WorkFrontmatter are already imported from that same file).

export function resolveRelatedWorkForArticle(
  article: KnowledgeItem,
  allCaseStudies: WorkItem[] = getAllCaseStudies(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  const resolved: ResolvedArticleSummary[] = [];

  for (const caseStudy of allCaseStudies) {
    if (!caseStudy.frontmatter.relatedContent.includes(article.slug)) {
      continue;
    }
    resolved.push(toCaseStudySummary(caseStudy));
    if (resolved.length >= limit) break;
  }

  return resolved;
}
```

**Traced against the seven steps a correct resolver needs, per this task's own §6**:

1. **Receives the current Knowledge article** — `article: KnowledgeItem`, the same single already-resolved item every other Knowledge-page resolver call already receives (`resolveRelatedLearning(article, ...)`, `resolvePreviousNext(article, ...)`).
2. **Loads/filters the real Work collection using the existing content loader** — `getAllCaseStudies()` (`case-studies.ts`), already `filterDrafts()`-wrapped; no new loader, no bypass of `case-studies.ts`'s own draft-filtering.
3. **Selects Work documents whose `relatedContent` contains the article's slug** — `caseStudy.frontmatter.relatedContent.includes(article.slug)`, exactly and only this test (§7).
4. **Excludes anything that should not be visible** — drafts are already excluded by step 2's own source (`getAllCaseStudies()`); no separate exclusion logic is needed since, unlike the forward direction, a genuine self-link is structurally impossible (Work and Knowledge slugs are disjoint namespaces) — matching `resolveRelatedWorkForLog()`'s own precedent of omitting a self-exclusion guard for the identical structural reason.
5. **Preserves deterministic ordering** — the caller's own array order (`getAllCaseStudies()`'s default order), the same "no order belongs to the source item itself" reasoning `resolveRelatedWorkForLog()`'s own docstring already states, since the relationship is authored entirely on the Work side.
6. **Maps to the existing Work summary type** — `toCaseStudySummary()`, imported and reused, not re-implemented; returns `ResolvedArticleSummary[]`, the exact shape `RelatedKnowledge`'s own card markup already renders.
7. **Applies the established relationship cardinality convention** — `DEFAULT_RELATIONSHIP_LIMIT` (4), the same primary-relationship-region cap `relatedKnowledge`/`relatedCaseStudies`/`relatedWork` all already use — not `SAME_TOPIC_FALLBACK_LIMIT` (3), since this is a primary relationship region for Knowledge, not a fallback tier.

**No de-dup `Set`**: each pass through `allCaseStudies` visits a distinct Work document at most once; two different Work documents both naming the same Knowledge slug is the intended many-to-many yield (two real cards), not a duplicate to collapse — identical to `resolveRelatedWorkForLog()`'s own precedent.

**Missing/stale references**: a Work document whose `relatedContent` contains a typo'd or since-removed Knowledge slug simply never matches any real article's own call — the same silent-skip, never-fabricate behavior every resolver in this codebase already has; no special handling is added.

**Not a new generic relationship abstraction**: this is one function, in one existing file, testing one existing field, reusing one existing mapper and one existing shared constant. No `RelationshipEngine`, no registry, no config-driven relationship type.

---

## 7. Reversal Constraint — Verified Satisfied

Per this task's own explicit instruction, the reverse relationship must be based on:

```text
work.frontmatter.relatedContent.includes(knowledge.slug)
```

**Confirmed**: §6.2's resolver body contains exactly this test — `caseStudy.frontmatter.relatedContent.includes(article.slug)` — and nothing else. No `tags`, `topic`, or `domain` field is read anywhere in this resolver. This is the same authored-adjacency discipline (`docs/24` Principle 8) every relationship in this codebase already follows — the relationship is the author's own explicit `relatedContent` declaration, not an inferred similarity signal.

---

## 8. Section Title and Copy

**"Applied In These Case Studies"** — used exactly as specified, not renamed. No compelling semantic reason was found in the live repository to prefer "Related Work"/"Related Projects"/"More Work"/"Similar Projects": those names would misdescribe the relationship as symmetric or similarity-based, when it is neither — it is the *reverse* of an explicit, already-authored, asymmetric edge, and "Applied In" states that precisely (the concept is *applied in* the case study; the case study does not "relate to" the concept in some vaguer, bidirectional sense).

**Intro line** (hardcoded directly in the component, matching every sibling relationship component's own no-shared-copy-file convention, re-confirmed for `RelatedKnowledge` in §4 and explicitly restated by `docs/56` §4): *"Real engineering work where this concept was actually built, not just explained."*

---

## 9. Component

**New, small, `components/content/`-scoped** — `components/content/applied-in-case-studies.tsx`. Placed alongside `related-learning.tsx`, not in `components/work/` (that directory is Work's own page-scoped components) and not in `components/knowledge/` (per `document-layout.tsx`'s own docstring, that directory is reserved for the Knowledge *library's* browsing/discovery surfaces — `StartHere`, `BrowseByTopic` — not the article detail page's own reading-experience regions, which is exactly where `related-learning.tsx`, `previous-next.tsx`, and `document-header.tsx` already live).

Conceptual shape — no implementation authorized by this document:

```text
export function AppliedInCaseStudies({
  items,
}: {
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Applied In These Case Studies</h2>
        <p className="text-small text-muted-foreground">
          Real engineering work where this concept was actually built, not
          just explained.
        </p>
      </Stack>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <li key={item.slug}>{/* card, matching RelatedKnowledgeCard's exact markup */}</li>
        ))}
      </ul>
    </Stack>
  );
}
```

The per-item card reuses `RelatedKnowledgeCard`'s exact markup (stretched-link title, description, `difficulty · readingTime · publishedAt` citation line) — `ResolvedArticleSummary` is the identical shape whether it wraps a Knowledge or a Work item, so the card renders correctly with no field-level branching. Recreated locally, not imported across the `components/work/` boundary — the same "every route/section owns its own section components, even where the visual pattern is shared" precedent `RelatedKnowledge`, `RelatedCaseStudies`, and `RelatedWork` have each already independently followed.

---

## 10. `DocumentLayout` — The One New Slot

One new optional prop, **`appliedInCaseStudies`**, added to `DocumentLayoutProps` and the render — following exactly the precedent already set twice (`relatedWork`, Task 6.2; `relatedCaseStudies`, Task 7.3): its own hardcoded `aria-label="Applied In These Case Studies"`, conditionally omitted `Section` (`{appliedInCaseStudies && <Section>...}`), no change to any other slot's type, position, or conditional-rendering logic.

**Why a new slot, not a reuse of `relatedLearning`**: `relatedLearning` is already correctly scoped to a genuinely different set of relationships — Prerequisites, Continue Learning, Related Concepts, Same-Topic — all Knowledge-internal (`resolveRelatedLearning()`'s own single-collection scope, confirmed unchanged in `relationships.ts` this turn). Folding a cross-collection, Work-facing region into that slot would misrepresent it as one more Knowledge-internal exploratory group, the identical reasoning `document-layout.tsx`'s own docstring already gives, twice, for why `relatedWork` and `relatedCaseStudies` each became their own slot rather than reusing an existing, differently-scoped one.

**Placement**: immediately after `relatedLearning`, before `relatedKnowledge` — keeping Knowledge's two closing-relationship regions (`relatedLearning`, `appliedInCaseStudies`) contiguous, exactly mirroring how Work's three regions (`relatedKnowledge`, `engineeringLogs`, `relatedCaseStudies`) are already kept contiguous and ahead of Engineering Log's own, single `relatedWork` slot for a different collection's page entirely.

```text
// Conceptual diff — no implementation authorized by this document.

export interface DocumentLayoutProps {
  breadcrumb?: React.ReactNode;
  header?: React.ReactNode;
  seriesBanner?: React.ReactNode;
  tableOfContents?: React.ReactNode;
  body?: React.ReactNode;
  relatedLearning?: React.ReactNode;
  /** Knowledge only (Task 7.25) — see this file's own docstring. */
  appliedInCaseStudies?: React.ReactNode;
  relatedKnowledge?: React.ReactNode;
  engineeringLogs?: React.ReactNode;
  relatedCaseStudies?: React.ReactNode;
  relatedWork?: React.ReactNode;
  previousNext?: React.ReactNode;
}

// ...render, inserted immediately after the existing relatedLearning block:
{appliedInCaseStudies && (
  <Section aria-label="Applied In These Case Studies" spacing="md" width="full">
    {appliedInCaseStudies}
  </Section>
)}
```

`document-layout.tsx`'s own module docstring gains one new paragraph describing this slot, matching the documentation discipline every prior slot addition (`relatedWork`, `relatedCaseStudies`) already followed in that same file.

---

## 11. Route Wiring

`app/knowledge/[slug]/page.tsx` gains, in Step 2 (article resolution) only:

- One new resolver call: `resolveRelatedWorkForArticle(article, allCaseStudies)`.
- One new collection read: `const allCaseStudies = getAllCaseStudies();` — **the first time this route reads the Work collection at all.** Named explicitly, not hidden: every other resolver call on this page (`resolveRelatedLearning`, `resolvePreviousNext`) already reuses a single, once-per-request `getAllArticles()` read; this feature necessarily adds one *additional* `getAllCaseStudies()` read per request, since no prior code path on this route touched Work. This is a small, real, one-collection-read cost — the honest trade-off of the feature, not a hidden one.
- One new import: `resolveRelatedWorkForArticle` from `@/lib/content/case-study-relationships`, and `getAllCaseStudies` from `@/lib/content/case-studies`.
- One new import: `AppliedInCaseStudies` from `@/components/content/applied-in-case-studies`.
- One new `DocumentLayout` prop, following the identical `length > 0 ? <Component items={...} /> : undefined` discipline this exact page already applies to `relatedLearning` (Task 5.7 RC refinement #2 — pass no element at all, not an always-truthy one, so `DocumentLayout`'s own `{appliedInCaseStudies && <Section>}` check actually omits the region):

```text
// Conceptual diff — no implementation authorized by this document.

const allCaseStudies = getAllCaseStudies();
const relatedLearningGroups = resolveRelatedLearning(article, allArticles);
const previousNext = resolvePreviousNext(article, allArticles);
const appliedCaseStudies = resolveRelatedWorkForArticle(article, allCaseStudies);

// ...
appliedInCaseStudies={
  appliedCaseStudies.length > 0 ? (
    <AppliedInCaseStudies items={appliedCaseStudies} />
  ) : undefined
}
```

**No change to Step 1 (topic resolution)** — this feature is scoped entirely to Step 2's article branch; `TopicHero`, `StartHere`, `LearningSeries`, `TopicArticleList`, `RelatedTopics` and their own resolvers are untouched.

---

## 12. File Manifest

| File | New / Modified | Exact Reason |
|---|---|---|
| `src/lib/content/case-study-relationships.ts` | Modified | Add `resolveRelatedWorkForArticle()` (§6) and one new type-only import (`KnowledgeFrontmatter`) |
| `src/components/content/applied-in-case-studies.tsx` | New | The one new, small, Knowledge-scoped presentation component (§9) |
| `src/components/content/document-layout.tsx` | Modified | One new slot, `appliedInCaseStudies`, following the exact `relatedWork`/`relatedCaseStudies` precedent (§10) |
| `src/app/knowledge/[slug]/page.tsx` | Modified | One new resolver call, one new collection read, one new import pair, one new `DocumentLayout` prop (§11) |

**Four files — the smallest footprint consistent with `docs/76`'s own recommendation**, matching `docs/56`'s own four-file profile for the structurally identical Work↔Work addition.

**Not touched by this plan, anywhere**: `relationships.ts` (no new import into this file — §6.1's own architecture decision), `case-studies.ts` (already has everything needed; `getAllCaseStudies()` is called, never modified), `engineering-logs.ts` (no Knowledge↔Engineering-Log relationship is in scope — §1), `articles.ts`, any schema file, any content file, `components/work/related-knowledge.tsx` (the forward direction, unmodified), `search.ts`, `rss.ts`, `sitemap.ts`, `/work/[slug]`, `/engineering-log/[slug]`, Homepage, navigation.

---

## 13. Expected Real Yield — Stated Precisely, Not Left to Discovery at Implementation Time

| Knowledge article | Real "Applied In These Case Studies" result |
|---|---|
| `append-only-ledger` | `vaultpay` (1 card) |
| `data-transfer-objects` | `gohunt` (1 card) |
| `how-jwt-works` | `haya` (1 card) |
| `idempotency` | `cookeaze` (1 card) |
| `money-floating-point` | `vaultpay` (1 card) |
| `optimistic-vs-pessimistic-locking` | `vaultpay` (1 card) |
| `transactional-outbox` | `vaultpay` (1 card) |

**Every one of the 7 real Knowledge articles renders exactly one card. None renders zero, none renders more than one — 100% coverage, uniform cardinality, confirmed by §3's own fresh recomputation.** This is the concrete, non-speculative value this feature ships on day one: four articles (`append-only-ledger`, `money-floating-point`, `optimistic-vs-pessimistic-locking`, `transactional-outbox`) gain their first-ever visible path back to VaultPay; `idempotency`, `data-transfer-objects`, and `how-jwt-works` each gain their first-ever visible path back to Cookeaze, GoHunt, and Haya respectively.

---

## 14. Guardrails

- `resolveRelatedKnowledge()`, `resolveRelatedEngineeringLogs()`, `resolveRelatedCaseStudies()`, `findDomainNeighbor()`, `resolvePreviousNextCaseStudy()`, `toCaseStudySummary()`, `DEFAULT_RELATIONSHIP_LIMIT` — all reused as-is inside `case-study-relationships.ts`; none is modified, none changes signature.
- `resolveRelatedLearning()`, `resolvePreviousNext()`, `resolveSameTopicFallback()`, `resolveArticleReferences()`, `toSummary()` (`relationships.ts`) — untouched; `relationships.ts` gains zero new imports and zero new exports.
- `resolveRelatedWorkForLog()` (`engineering-logs.ts`) — untouched; not called by, and does not call, the new resolver.
- `RelatedKnowledge`, `RelatedCaseStudies`, `RelatedWork`, `RelatedLearning`, `PreviousNext`, `DocumentHeader` — untouched; `AppliedInCaseStudies` is additive, not a refactor of any existing component.
- `DocumentLayoutProps`'s six existing slots (`relatedLearning`, `relatedKnowledge`, `engineeringLogs`, `relatedCaseStudies`, `relatedWork`, `previousNext`) are unchanged in type, position, or conditional-rendering behavior — only one new optional slot is added.
- No schema change — `relatedContent` already exists, already required-by-default (`z.array(z.string()).default([])`), already real on all 4 Work documents.
- No content change — no `.mdx` file's frontmatter is edited by this plan.
- No new route, no `"use client"`, no new npm dependency, no tag/topic/domain read anywhere in the new resolver (§7).
- `/work/[slug]`, `/engineering-log/[slug]`, Search, RSS, Sitemap, navigation — zero dependency on anything this plan touches.

---

## 15. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | A Knowledge article incorrectly shows a Work document that doesn't actually reference it | Resolver's own filter is the literal `.includes(article.slug)` test (§6, §7); WI-5 spot-checks all 7 real articles against §13's own precomputed table |
| 2 | Ordering becomes a ranking claim rather than the caller's own neutral collection order | §6.2's ordering is `getAllCaseStudies()`'s own default order, not re-sorted; WI-5 confirms no additional sort call exists in the diff |
| 3 | The new resolver reads the Work collection from disk more than once per request | `app/knowledge/[slug]/page.tsx` calls `getAllCaseStudies()` exactly once (§11) and passes the same array into `resolveRelatedWorkForArticle()`, not a second internal call |
| 4 | A draft Work document leaks into the "Applied In" list | `getAllCaseStudies()` is already `filterDrafts()`-wrapped, reused unmodified |
| 5 | The new `DocumentLayout` slot changes any other region's rendering | `DocumentLayoutProps` gains one new optional field only (§10); every existing field's type/position/behavior is unchanged; WI-5 diffs the file |
| 6 | `resolveRelatedWorkForLog()` and `resolveRelatedWorkForArticle()` get conflated during implementation | §5/§6 state the distinction explicitly (Engineering-Log-sourced vs. Knowledge-sourced, different files) as a named implementation risk, not left implicit |
| 7 | A new circular import is introduced between `relationships.ts` and `case-study-relationships.ts` | §6.1's own architecture decision places the resolver in `case-study-relationships.ts` specifically to avoid this; WI-5 confirms `relationships.ts`'s own import list is unchanged |
| 8 | Topic-page Step 1 of `/knowledge/[slug]` is accidentally affected | This feature is scoped entirely to Step 2 (§11); WI-5 re-tests all 8 topic pages unchanged |
| 9 | The section renders an empty heading instead of nothing, for a hypothetical future Knowledge article with zero inbound Work edges | `AppliedInCaseStudies` returns `null` on empty (§9); the route passes `undefined`, not an empty element (§11) — the identical belt-and-braces pattern every other relationship region already uses |

---

## 16. Work Items

### WI-1 — Resolver

**Files**: `src/lib/content/case-study-relationships.ts` (modified).

**Acceptance criteria**: `resolveRelatedWorkForArticle()` added, matching §6.2 exactly; one new type-only import (`KnowledgeFrontmatter`) added to the existing `schema.ts` import line; a new local `KnowledgeItem` type alias added, matching this file's existing `WorkItem`/`EngineeringLogItem` alias convention; the file's own module docstring gains one new paragraph describing the addition (matching the documentation discipline `relatedCaseStudies`'s own addition already followed); no existing export in this file changes signature or behavior; `relationships.ts` remains untouched.

### WI-2 — Component

**Files**: `src/components/content/applied-in-case-studies.tsx` (new).

**Dependencies**: WI-1 (needs `ResolvedArticleSummary`'s shape, already stable regardless).

**Acceptance criteria**: returns `null` when `items` is empty; reuses `RelatedKnowledgeCard`'s exact markup pattern, recreated locally, not imported across `components/work/`; heading text is exactly "Applied In These Case Studies" (§8); no new shared copy constant introduced.

### WI-3 — `DocumentLayout` Slot

**Files**: `src/components/content/document-layout.tsx` (modified).

**Dependencies**: none functionally, sequenced after WI-1/WI-2 conceptually so the slot's own doc comment describes a resolver and component that already exist.

**Acceptance criteria**: one new optional prop, `appliedInCaseStudies`, added to `DocumentLayoutProps` and the render, positioned per §10; every existing prop's behavior, position, and conditional-rendering logic is unchanged; `git diff` on this file shows only the one new slot's addition.

### WI-4 — Route Wiring

**Files**: `src/app/knowledge/[slug]/page.tsx` (modified).

**Dependencies**: WI-1, WI-2, WI-3.

**Acceptance criteria**: one new `getAllCaseStudies()` call (§11), reused for the single new resolver call — not called twice; one new import pair; one new `DocumentLayout` prop, following the established `length > 0 ? <Component /> : undefined` pattern already used for `relatedLearning` on this exact page; Step 1 (topic resolution) shows zero diff; no other prop or resolver call on this page changes.

### WI-5 — Release Candidate Review

**Purpose**: the release gate, mirroring `docs/56`'s own WI-5.

**When it runs**: only after WI-1 through WI-4 are complete.

**Verification steps**:

1. Each of the 7 real Knowledge article pages shows exactly the one real card named in §13's own table — no more, no fewer, no wrong target.
2. Result ordering matches `getAllCaseStudies()`'s own default order (trivial to confirm with one result each; the absence of any additional sort call is confirmed directly in the diff).
3. Related Learning and Previous/Next on all 7 Knowledge article pages remain unchanged in content and position.
4. All 8 `/knowledge/[topic]` pages remain unchanged — zero diff in Step 1's own behavior.
5. `/work/vaultpay`, `/work/cookeaze`, `/work/gohunt`, `/work/haya` — Related Knowledge, Related Engineering Logs, Related Case Studies, Previous/Next all remain unchanged.
6. `/engineering-log/[slug]` (both real entries) unchanged — zero diff, zero dependency on anything this plan touches.
7. `document-layout.tsx`'s six pre-existing slots are unchanged, confirmed by diff.
8. No draft Knowledge or Work document (verified via code-path identity with the already-`filterDrafts()`-wrapped loaders, not by authoring new test content) could appear.
9. Homepage, Search, RSS, Sitemap, navigation unchanged — zero diff.
10. No `"use client"` introduced anywhere in the diff.
11. `pnpm exec eslint` clean.
12. `pnpm exec tsc --noEmit` clean.
13. `pnpm build` clean.
14. `git status`/`git diff --stat` match this document's file manifest (§12) exactly — four files.
15. Full regression sweep: `/`, `/knowledge`, all 8 `/knowledge/[topic]` pages, all 7 `/knowledge/[slug]` article pages, `/work`, `/work/library`, all 4 `/work/[slug]` pages, `/engineering-log`, both `/engineering-log/[slug]` pages, `/about`, `/search`, `/rss.xml`, `/sitemap.xml`, and an invalid URL — all expected statuses.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 17. Sequencing

```
WI-1 (resolver, case-study-relationships.ts)
        │
        ▼
WI-2 (component, applied-in-case-studies.tsx)
        │
        ▼
WI-3 (DocumentLayout slot)
        │
        ▼
WI-4 (route wiring, knowledge/[slug]/page.tsx)
        │
        ▼
WI-5 (Release Candidate Review)
```

Strictly linear, matching `docs/56`'s own sequencing shape — each work item's acceptance criteria depend on the previous one existing.

---

## 18. Rollback Plan

Four files: one new resolver function (additive, in an existing file whose other exports are untouched), one new component file (deletable independently), one new optional `DocumentLayout` slot (additive, no existing slot's behavior changes), one route file's incremental wiring (a small, revertable diff). No schema, content, or route change anywhere to unwind — the same simple rollback profile `docs/56`'s own Work↔Work addition already established.

---

## 19. Milestone 7 Boundary — Non-Goals

Per `docs/76` §22's own framing and this task's own explicit exclusions: this plan does not implement a recommendation engine, similarity ranking, AI recommendations, semantic search, tag/topic/domain-based inference (§7), a new relationship registry, a new public route, or a generic `RelatedContent` component usable by any collection. It also does not implement a Knowledge → Engineering Log reverse relationship (§1) — no evidence parallel to `docs/76` §13's 100%-coverage finding exists for that direction. `docs/55` §15 previously listed "No Knowledge→Work... relationship (no evidence requires it)" as an explicit non-goal at design time; `docs/76` §13 is the document that found the evidence `docs/55` was missing, specifically and only for the Work direction — this plan is the direct consequence of that one finding, not a broader reopening of `docs/55`'s other non-goals.

---

## 20. Acceptance Criteria (Plan-Level)

- The resolver's exact shape traces to `resolveRelatedWorkForLog()`'s already-established reverse-lookup pattern (§5), not a new algorithm.
- The resolver lands in `case-study-relationships.ts`, chosen explicitly over `relationships.ts` to avoid introducing a new circular import, with the reasoning stated as an Architecture Decision (§6.1), not left implicit.
- The reversal test is exactly `work.frontmatter.relatedContent.includes(knowledge.slug)` — verified against the resolver body directly (§7), no tag/topic/domain signal anywhere.
- The component follows `RelatedKnowledge`'s exact, already-established idiom, including its hardcoded-copy convention (§9).
- The section title is exactly "Applied In These Case Studies," not renamed to a generic alternative (§8).
- The `DocumentLayout` slot addition follows the exact precedent `relatedWork`/`relatedCaseStudies` already set (§10).
- Expected real yield (§13) is stated precisely before implementation, not discovered afterward — 100% coverage, cardinality 1 for every one of the 7 real articles.
- The one new per-request cost (an additional `getAllCaseStudies()` read on `/knowledge/[slug]`) is named explicitly, not hidden (§11).
- No production code, route, component, schema, or content was modified to produce this document.

---

## Summary

This plan converts `docs/76` §13/§21/§22's approved finding into four small, dependency-ordered files: one new resolver (`resolveRelatedWorkForArticle()`, placed in `case-study-relationships.ts` specifically to avoid a new circular import — §6.1), one new component (`AppliedInCaseStudies`, `components/content/`, following `RelatedKnowledge`'s established idiom exactly), one new `DocumentLayout` slot (`appliedInCaseStudies`, following the `relatedWork`/`relatedCaseStudies` precedent), and the corresponding route wiring on `/knowledge/[slug]`. Every piece this plan specifies already exists in some form — a reverse-lookup pattern (`resolveRelatedWorkForLog()`), a mapper (`toCaseStudySummary()`), a shared constant (`DEFAULT_RELATIONSHIP_LIMIT`), a slot-addition precedent (`relatedWork`, `relatedCaseStudies`), a component idiom (`RelatedKnowledge`) — this task recombines them, it does not invent new architecture. The real, honest yield is stated precisely in advance: all 7 real Knowledge articles will show exactly one real card each — 100% coverage, confirmed by a fresh, independent recomputation of the corpus (§3), not merely trusted from `docs/76`. No production code, route, component, schema, or content was modified to produce this document.
