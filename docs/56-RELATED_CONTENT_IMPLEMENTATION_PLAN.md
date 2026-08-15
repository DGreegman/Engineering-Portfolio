# 56 — Related Content: Implementation Plan

## Status

Implementation Plan — translating `docs/55-RELATED_CONTENT_DISCOVERY.md`'s recommendation (Work↔Work via `domain` adjacency, Architecture Decision D1) into a precise, file-by-file specification.

> This document authorizes no implementation. It is documentation only. No production source file, route, component, schema, or content was modified to produce it.

---

## 1. Purpose

`docs/55` §14 (D1) recommends one specific, narrow addition: a "Related Case Studies" region on `/work/[slug]`, resolved by same-`domain` adjacency, reusing pieces this repository's own code already anticipated. This document converts that recommendation into work items. Per its own framing: *"Work Case Studies can surface other Case Studies that share the same real `domain` value... an explicit, deterministic discovery mechanism based on existing authored metadata"* — not a recommendation engine, not ranking, not inference.

---

## 2. Existing Architecture — Re-Verified This Turn

Read in full this turn, not assumed from `docs/55`: `case-study-relationships.ts`, `relationships.ts`, `document-layout.tsx`, every file in `components/work/`, `app/work/[slug]/page.tsx`, `case-studies.ts`, and real `content/work/*.mdx` frontmatter.

**Confirmed unchanged since `docs/55`'s own re-inspection**: `case-study-relationships.ts`'s own docstring still states, verbatim, the exact deferral and anticipated resolution strategy `docs/55` §6 quotes — *"This file also does not implement Related Case Studies... It would resolve through this same file, using the same domain... adjacency this module already computes for Previous/Next."* `DEFAULT_RELATIONSHIP_LIMIT = 4` and `toCaseStudySummary()` are both already exported from this exact file, for this exact reuse. `document-layout.tsx` still exposes five slots (`relatedLearning`, `relatedKnowledge`, `engineeringLogs`, `relatedWork`, `previousNext`) and no `relatedCaseStudies` slot. `components/work/` still has no `RelatedCaseStudies` component. Real domain values, re-confirmed: `Backend Infrastructure` (`vaultpay`, `cookeaze`), `AI Systems` (`gohunt`), `Platform Engineering` (`haya`).

---

## 3. Work ↔ Work Resolver

**Design, mirroring an existing shape rather than inventing one**: `resolveSameTopicFallback()` (`relationships.ts`) already establishes the exact pattern this relationship needs — filter siblings sharing a value, exclude self, sort alphabetically (a neutral, non-ranking order, the same reasoning that function's own docstring gives), cap at a shared constant, map to the summary shape. Applied here to `domain` and `WorkItem` instead of `topic` and `KnowledgeItem`:

```text
Current Case Study
       ↓
current.domain
       ↓
getAllCaseStudies() (already real, already draft-filtered)
       ↓
filter: same domain, excluding current case study's own slug
       ↓
sort: alphabetical by title (neutral, not a ranking claim —
      the same reasoning resolveSameTopicFallback() already uses)
       ↓
cap: DEFAULT_RELATIONSHIP_LIMIT (4) — already exported, reused, not
     SAME_TOPIC_FALLBACK_LIMIT (3), since this is proposed as a primary
     Work relationship, not a fallback tier (docs/55 §13)
       ↓
map: toCaseStudySummary() — already exported, already produces
     ResolvedArticleSummary, reused unmodified
```

**Zero new types.** `ResolvedArticleSummary` (`relationships.ts`) is the return shape, exactly as every other Work-side relationship resolver in this file already returns.

**Exact function, placed in `case-study-relationships.ts`** — the file whose own docstring already claims this exact resolver, not `case-studies.ts` (which owns collection loading and the real-content-migration resolvers from Task 7.1, a different concern):

```text
// Conceptual shape — no implementation authorized by this document.
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
```

**Why this is not `findDomainNeighbor()`, stated explicitly to prevent the two being conflated during implementation**: `findDomainNeighbor()` (same file) finds one *immediate positional* neighbor per direction, for Previous/Next — it is not reused here, and this plan does not modify it. `resolveRelatedCaseStudies()` is a new, separate function returning *every* domain sibling (capped), the same "all matching siblings, not one neighbor" shape `resolveSameTopicFallback()` already established for a structurally identical problem in a different collection.

---

## 4. Component

**New, small, Work-scoped — `components/work/related-case-studies.tsx`.** Per `docs/55` §11: no generic `RelatedContent` component; this follows `RelatedKnowledge`'s (`components/work/related-knowledge.tsx`) own exact, already-established idiom, re-read in full this turn — a `Stack`-wrapped `<h2>` + intro paragraph, a `grid` of stretched-link `Card`s, `null` when empty. **Copy is hardcoded directly in the component**, confirmed by direct inspection: `RelatedKnowledge`'s own title/intro text (`"Related Knowledge"`, its intro sentence) is not sourced from `work-copy.ts` — no shared copy-constants object exists for these sections, so `RelatedCaseStudies` follows the identical self-contained pattern; **no `work-copy.ts` change is required**.

```text
// Conceptual shape — no implementation authorized by this document.
export function RelatedCaseStudies({
  items,
}: {
  items: ResolvedArticleSummary[];
}) {
  if (items.length === 0) return null;

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <h2 className="text-h2 text-foreground">Related Case Studies</h2>
        <p className="text-small text-muted-foreground">
          Other engineering work in the same domain.
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

The per-item card reuses `RelatedKnowledgeCard`'s exact markup (stretched-link title, description, citation line) recreated locally — not imported across files — the same "every route/section owns its own section components, even where the visual pattern is shared" precedent `RelatedKnowledge`'s own docstring already states and this exact codebase has now applied identically at least three times (`RelatedKnowledge`, `FeaturedCaseStudies` relative to Homepage's `EngineeringCaseStudies`, `SearchResults`' `SearchResultRow` relative to `LogEntryRow`).

---

## 5. `DocumentLayout` — The One New Slot, Specified Precisely

Per `docs/55` §12: one new slot, `relatedCaseStudies`, following exactly the precedent Task 6.2 set adding `relatedWork` — its own `Section`, its own hardcoded `aria-label="Related Case Studies"`, conditionally omitted when absent (`{relatedCaseStudies && <Section>...}`), no change to any other slot's behavior or the `DocumentLayoutProps` interface's other fields.

**Placement, decided explicitly rather than left implicit**: immediately after `engineeringLogs`, before `relatedWork`, in both the `DocumentLayoutProps` interface and the render — matching the render order `docs/31`'s own approved Case Study structure implies (Related Knowledge → Engineering Logs → this new region → Previous/Next) and keeping Work's own three relationship regions (`relatedKnowledge`, `engineeringLogs`, `relatedCaseStudies`) contiguous in the file, ahead of Engineering Log's own `relatedWord` slot, which belongs to a different collection's page entirely.

---

## 6. Route Wiring

`app/work/[slug]/page.tsx` gains: one more resolver call (`resolveRelatedCaseStudies(caseStudy, allCaseStudies)`, reusing the `allCaseStudies` array already read once per request for `resolvePreviousNextCaseStudy()` — no second disk read), one more import (`RelatedCaseStudies`), one more `DocumentLayout` prop, following the identical `length > 0 ? <Component items={...} /> : undefined` pattern every other relationship prop on this exact page already uses (Task 5.7 RC refinement #2's own "pass no element at all when empty" discipline, re-applied, not reinvented).

---

## 7. File Manifest

| File | New / Modified | Work Item | Exact Reason |
|---|---|---|---|
| `src/lib/content/case-study-relationships.ts` | Modified | WI-1 | Add `resolveRelatedCaseStudies()` — the one resolver this file's own docstring already claimed |
| `src/components/work/related-case-studies.tsx` | New | WI-2 | The one new, small, Work-scoped presentation component (§4) |
| `src/components/content/document-layout.tsx` | Modified | WI-3 | One new slot, `relatedCaseStudies`, following the exact `relatedWork` precedent (§5) |
| `src/app/work/[slug]/page.tsx` | Modified | WI-4 | Resolver call, import, prop wiring (§6) |

**Not touched by this plan, anywhere**: `case-studies.ts` (already has everything it needs from Task 7.1; this relationship belongs in `case-study-relationships.ts`, not here), `relationships.ts` (`resolveSameTopicFallback()` is reused as a *pattern*, not imported or modified), `work-copy.ts` (§4 — no shared copy object exists for this component family), any schema file, any content file, `search.ts` (Task 7.2's own boundary, untouched), `/knowledge/[slug]`, `/engineering-log/[slug]`, Homepage, Search, RSS, Sitemap, navigation.

**Four files — the smallest footprint consistent with `docs/55`'s own recommendation**, tied with Task 7.2's own two-file profile in spirit (one resolver addition, one small component, one layout-slot addition, one route wiring — no new type, no new copy file, no schema change).

---

## 8. Guardrails

- `case-studies.ts`'s existing exports (Task 7.1) are unchanged — this plan only adds to `case-study-relationships.ts`.
- `work.ts` is not touched — no dependency on it exists anywhere in this plan.
- `findDomainNeighbor()`, `resolvePreviousNextCaseStudy()`, `resolveRelatedKnowledge()`, `resolveRelatedEngineeringLogs()`, `toCaseStudySummary()`, `DEFAULT_RELATIONSHIP_LIMIT` — all reused, none modified (confirmed: the new resolver only *calls* `toCaseStudySummary()` and reads the existing constant, exactly as `resolveRelatedKnowledge()` already does).
- `RelatedKnowledge`, `RelatedEngineeringLogs`, `PreviousNext`, `ProjectHeader` — untouched; `RelatedCaseStudies` is additive, not a refactor of any existing component.
- `DocumentLayoutProps`' four existing optional slots (`relatedLearning`, `relatedKnowledge`, `engineeringLogs`, `relatedWork`) and `previousNext` are unchanged in type or behavior — only one new optional slot is added.
- `/knowledge/[slug]`, `/engineering-log/[slug]` — zero dependency on anything this plan touches; confirmed unaffected.
- No schema change — `domain` already exists, already required, already real on all 4 case studies.
- No content change — no case study's frontmatter is edited.
- No new route, no `"use client"`, no new npm dependency.

---

## 9. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | A case study's own domain incorrectly includes itself in its Related Case Studies | `resolveRelatedCaseStudies()`'s filter explicitly excludes `item.slug !== caseStudy.slug`; WI-5 tests VaultPay's own result set for self-absence |
| 2 | Previous/Next's `findDomainNeighbor()` behavior changes | Not modified, not called by the new resolver; WI-5 re-tests Previous/Next unchanged |
| 3 | A case study with a unique domain (GoHunt, Haya) renders an empty heading or placeholder instead of nothing | `RelatedCaseStudies` returns `null` on empty (§4); the route passes `undefined`, not an empty element, when the resolved list is empty (§6) — the identical belt-and-braces pattern every other relationship region already uses |
| 4 | Ordering becomes a ranking claim rather than a neutral order | Alphabetical-by-title only, the same non-ranking justification `resolveSameTopicFallback()` already documents; WI-5 confirms no other sort key is used |
| 5 | The new slot changes any other `DocumentLayout` region's rendering | `DocumentLayoutProps` gains one new optional field only; every existing field's behavior is unchanged (§5); WI-5 diffs the file |
| 6 | Draft case studies leak into a Related Case Studies list | `getAllCaseStudies()` is already `filterDrafts()`-wrapped, reused unmodified |
| 7 | The new resolver reads the collection from disk a second time unnecessarily | `app/work/[slug]/page.tsx` already reads `getAllCaseStudies()` once per request for Previous/Next; the new resolver call reuses that same array (§6), not a second `getAllCaseStudies()` call |
| 8 | `findDomainNeighbor()` and `resolveRelatedCaseStudies()` get conflated during implementation, one accidentally replacing the other | §3 states the distinction explicitly (positional neighbor vs. all-siblings) as a named implementation risk, not left implicit |

---

## 10. Cardinality and Expected Real Yield — Stated Precisely, Not Left to Discovery at Implementation Time

| Case study | Domain | Real Related Case Studies result |
|---|---|---|
| `vaultpay` | Backend Infrastructure | `cookeaze` (1 result) |
| `cookeaze` | Backend Infrastructure | `vaultpay` (1 result) |
| `gohunt` | AI Systems | none — region omitted entirely |
| `haya` | Platform Engineering | none — region omitted entirely |

Consistent with `docs/55`'s own honest yield caveat: this is a small, real result, not zero and not fabricated — two of four real case studies show a genuine Related Case Studies region today; two honestly show none, because no other real case study shares their domain yet.

---

## 11. Work Items

### WI-1 — Resolver

**Files:** `src/lib/content/case-study-relationships.ts` (modified).

**Acceptance criteria:** `resolveRelatedCaseStudies()` added, matching §3's shape exactly; excludes the current case study by slug; sorts alphabetically by title; caps at `DEFAULT_RELATIONSHIP_LIMIT`; reuses `toCaseStudySummary()` unmodified; no existing export in this file changes signature or behavior.

### WI-2 — Component

**Files:** `src/components/work/related-case-studies.tsx` (new).

**Dependencies:** WI-1 (needs `ResolvedArticleSummary`'s shape, already stable and unchanged regardless).

**Acceptance criteria:** returns `null` when `items` is empty; reuses `RelatedKnowledgeCard`'s exact markup pattern, recreated locally, not imported; no new shared copy constant introduced.

### WI-3 — `DocumentLayout` Slot

**Files:** `src/components/content/document-layout.tsx` (modified).

**Dependencies:** none functionally, but sequenced after WI-1/WI-2 conceptually since the slot's own doc comment should describe a resolver and component that already exist.

**Acceptance criteria:** one new optional prop, `relatedCaseStudies`, added to `DocumentLayoutProps` and the render, positioned per §5; every existing prop's behavior, position, and conditional-rendering logic is unchanged; `git diff` on this file shows only the one new slot's addition.

### WI-4 — Route Wiring

**Files:** `src/app/work/[slug]/page.tsx` (modified).

**Dependencies:** WI-1, WI-2, WI-3.

**Acceptance criteria:** one new resolver call, reusing the already-fetched `allCaseStudies` array (§6); one new import; one new `DocumentLayout` prop, following the established `length > 0 ? <Component /> : undefined` pattern; no other prop or resolver call on this page changes.

### WI-5 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/52`'s WI-7, `docs/54`'s WI-4.

**When it runs:** only after WI-1 through WI-4 are complete.

**Verification steps:**

1. `/work/vaultpay` shows a Related Case Studies region containing exactly `cookeaze`, and not itself.
2. `/work/cookeaze` shows a Related Case Studies region containing exactly `vaultpay`, and not itself.
3. `/work/gohunt` shows no Related Case Studies region at all (not an empty heading).
4. `/work/haya` shows no Related Case Studies region at all.
5. Result ordering is alphabetical by title, confirmed directly (trivial with one result each, but the sort call itself is confirmed present in the diff).
6. Related Knowledge, Related Engineering Logs, and Previous/Next on all four case study pages remain unchanged in content and position.
7. No draft case study (a manually-flagged `draft: true` test document, verified via code-path identity with the already-`filterDrafts()`-wrapped `getAllCaseStudies()`, not by authoring new test content) could appear.
8. `document-layout.tsx`'s four pre-existing slots are unchanged, confirmed by diff.
9. `/knowledge/[slug]`, `/engineering-log/[slug]` unchanged — zero diff.
10. Homepage, Search, RSS, Sitemap unchanged — zero diff.
11. No `"use client"` introduced anywhere in the diff.
12. `pnpm exec eslint` clean.
13. `pnpm exec tsc --noEmit` clean.
14. `pnpm build` clean.
15. `git status`/`git diff --stat` match this document's file manifest (§7) exactly — four files.
16. Full regression sweep: `/`, `/knowledge`, `/work`, `/work/library`, `/work/vaultpay`, `/work/gohunt`, `/work/haya`, `/work/cookeaze`, `/engineering-log`, `/about`, `/search`, `/rss.xml`, `/sitemap.xml`, and an invalid URL — all expected statuses.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 12. Sequencing

```
WI-1 (resolver, case-study-relationships.ts)
        │
        ▼
WI-2 (component, related-case-studies.tsx)
        │
        ▼
WI-3 (DocumentLayout slot)
        │
        ▼
WI-4 (route wiring, work/[slug]/page.tsx)
        │
        ▼
WI-5 (Release Candidate Review)
```

Strictly linear — each work item's acceptance criteria depend on the previous one existing (the component needs the resolver's return type stable; the route needs both the component and the slot; the review needs everything wired).

---

## 13. Rollback Plan

Four files: one new resolver function (additive, in an existing file whose other exports are untouched), one new component file (deletable independently), one new optional `DocumentLayout` slot (additive, no existing slot's behavior changes), one route file's incremental wiring (a small, revertable diff). No schema, content, or route change anywhere to unwind — the same simple rollback profile Task 7.1 and Task 7.2 both already established for this milestone.

---

## 14. Milestone 7 Boundary

Per `docs/55` §15 and this task's own explicit exclusions: this plan does not implement a recommendation engine, similarity ranking, AI recommendations, semantic search, vector search, tag-based inference, a new relationship registry, or a new public route. It adds one deterministic resolver over one already-authored, already-real field, following a pattern this repository's own code already anticipated in writing before this task began.

---

## 15. Acceptance Criteria (Plan-Level)

- The resolver's exact shape traces to `resolveSameTopicFallback()`'s already-established pattern, not a new algorithm.
- The resolver lands in `case-study-relationships.ts` — the file that already claimed it in writing — not `case-studies.ts` or a new file.
- The component follows `RelatedKnowledge`'s exact, already-established idiom, including its hardcoded-copy convention.
- The `DocumentLayout` slot addition follows the exact precedent `relatedWork` (Task 6.2) already set.
- Expected real yield (§10) is stated precisely before implementation, not discovered afterward.
- No production code, route, component, schema, or content was modified to produce this document.

---

## Summary

This plan converts `docs/55`'s recommendation into four small, dependency-ordered files: one new resolver (`resolveRelatedCaseStudies()`, `case-study-relationships.ts` — the exact file whose own docstring already promised it), one new component (`RelatedCaseStudies`, `components/work/`, following `RelatedKnowledge`'s established idiom exactly), one new `DocumentLayout` slot (following the `relatedWork` precedent from Task 6.2), and the corresponding route wiring on `/work/[slug]`. Every piece this plan specifies already exists in some form — a resolver pattern (`resolveSameTopicFallback()`), a mapper (`toCaseStudySummary()`), a shared constant (`DEFAULT_RELATIONSHIP_LIMIT`), a slot-addition precedent (`relatedWork`), a component idiom (`RelatedKnowledge`) — this task recombines them, it does not invent new architecture. The real, honest yield is stated precisely in advance: two of four real case studies (VaultPay, Cookeaze) will show a genuine Related Case Studies region; the other two (GoHunt, Haya) honestly show none, because no sibling in their domain exists yet — not a defect, the same "empty is a valid state" discipline this entire milestone has held to throughout. No production code, route, component, schema, or content was modified to produce this document.
