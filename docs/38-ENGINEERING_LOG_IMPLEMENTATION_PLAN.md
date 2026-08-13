# 38 — Engineering Log Implementation Plan

## Status

Implementation Plan — translating the approved `docs/37-ENGINEERING_LOG_EXPERIENCE.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/37` establishes *what* Task 6.2 should do and *why*. This document establishes *exactly what changes, file by file*, following the same role `docs/36-HOMEPAGE_IMPLEMENTATION_PLAN.md` played for Task 6.1. Every work item traces to a specific section of `docs/37`. Where re-inspection of the actual repository found `docs/37`'s own description was not an exact implementation contract, that discrepancy is reported explicitly (§3) rather than silently reconciled — per this task's own instruction.

---

## 2. Authoritative Inputs & Constraints

`docs/37-ENGINEERING_LOG_EXPERIENCE.md` is the architecture authority. The three-way boundary it establishes is carried forward **unchanged** and governs every work item below:

```
Engineering Log  →  raw discovery/process (debugging, experiments, failed approaches, lessons learned)
Case Study       →  refined engineering conclusion
Knowledge        →  reusable engineering explanation
```

No work item may blur these — concretely: the Log Entry Header never gains Case-Study-style metadata (Domain/Status/Difficulty) or Knowledge-style metadata (`topic`); the Log Detail body is never given an imposed multi-section template; nothing here writes to or reads from `content/work/` or `content/knowledge/` except through the existing, unmodified resolvers those collections already expose.

Also carried forward unchanged from `docs/37`:

- **Chronology, not facets, governs discovery** (D3) — the Index is a flat, newest-first list; no category/tag browsing UI.
- **Related Work is many-to-many** (§12) — `resolveRelatedWorkForLog()` always returns a collection, never a single item or a null-vs-one union.
- **Previous/Next is pure chronological adjacency** (§14) — the one collection in this workspace where that's the *correct* signal, not a fallback.
- **No new content collection, no schema change** — `engineering-log/` keeps using `articleFrontmatterSchema` exactly as registered today.

---

## 3. Re-Inspection Findings — Where `docs/37` Was Not an Exact Contract

Re-inspecting the actual current files (not re-reading `docs/37`'s own summary of them) surfaced one real discrepancy, reported here rather than silently absorbed into the work items below.

### Finding: `DocumentLayout` has no slot for "Related Work" — one is required

`docs/37` §15 (Component Reuse) states `DocumentLayout | Both Index and Detail's structural skeleton | None [modification needed]`. Direct inspection of `src/components/content/document-layout.tsx`'s actual render body shows this is correct for the *skeleton as a whole*, but **not precise enough for the Related Work region specifically**:

```tsx
{relatedLearning && (<Section aria-label="Related Learning" ...>{relatedLearning}</Section>)}
{relatedKnowledge && (<Section aria-label="Related Knowledge" ...>{relatedKnowledge}</Section>)}
{engineeringLogs && (<Section aria-label="Engineering Logs" ...>{engineeringLogs}</Section>)}
```

Each of the three existing closing-relationship slots has its landmark `aria-label` **hardcoded by `DocumentLayout` itself**, not derived from whatever content is passed in. None of the three labels fits "Related Work":

- `relatedLearning` → Knowledge's own merged four-group section; wrong shape (Log has no prerequisites/continueLearning/sameTopic groups) and wrong label.
- `engineeringLogs` → hardcoded `aria-label="Engineering Logs"`, i.e. the Case Study's *own* Related Engineering Logs region — using it to hold Related *Work* content on a *Log* page would render a landmark labeled "Engineering Logs" wrapping Case Study links. Backwards.
- `relatedKnowledge` → correctly fits the Log Detail's own **Related Knowledge** need (`docs/37` §13) — this one *is* directly reusable as-is, confirming `docs/37` §15 was right about that specific region.

**Resolution — the smallest correct extension, not a workaround:** add one new optional slot to `DocumentLayoutProps`, mirroring exactly how Task 5.3 added `relatedKnowledge` and `engineeringLogs` to this same file for the same reason (a new closing-relationship region needing its own correctly-labeled landmark):

```ts
// Addition to DocumentLayoutProps — conceptual, no implementation authorized here.
relatedWork?: React.ReactNode;
```

```tsx
// Addition to DocumentLayout's render body, same conditional-Section pattern
// every other optional closing region already uses:
{relatedWork && (
  <Section aria-label="Related Work" spacing="md" width="full">
    {relatedWork}
  </Section>
)}
```

This is a **shared-component modification**, not a Log-scoped one — `document-layout.tsx` is used by `/knowledge/[slug]` and `/work/[slug]` too. It is additive and optional (an unset prop renders nothing, identical to how `relatedLearning`/`relatedKnowledge`/`engineeringLogs` already behave when omitted), so neither existing route's rendering changes. This is called out as its own work item (WI-1) specifically because it's the one piece of this plan that touches a file outside `engineering-log`'s own scope, and needed to be found by re-inspection rather than assumed safe from `docs/37`'s summary alone.

No other discrepancy was found. `PreviousNext`, `Breadcrumb`, `ArticleBody`, `TableOfContents`, `extractHeadings`, `sortByPublishedDate`, `resolveArticleReferences`, `getAllCaseStudies()`, and every loader in `lib/content/engineering-logs.ts` match `docs/37`'s description exactly, confirmed by direct re-read of each file's current signature.

---

## 4. Current → Target State

```
                       BEFORE (today)                       AFTER (Task 6.2)

/engineering-log        does not exist (404)                 Index: real, chronological, real count
/engineering-log/[slug] does not exist (404)                 Detail: real MDX reading experience

Related Work            no mechanism exists                  resolveRelatedWorkForLog() — reverse
  (on a Log entry)                                            lookup over getAllCaseStudies(), always
                                                                a collection (§12's cardinality finding)

Previous/Next            no mechanism exists                  resolvePreviousNextLog() — pure
  (on a Log entry)                                             chronological adjacency

DocumentLayout            3 closing-relationship slots         + 1 new optional `relatedWork` slot
                          (relatedLearning/relatedKnowledge/
                           engineeringLogs)

Every existing link       404s (homepage preview CTA,          Resolves
into this system          PRIMARY_NAVIGATION, FOOTER_
                           NAVIGATION, every Case Study's
                           Related Engineering Logs)
```

---

## 5. Work Items

### WI-1 — `DocumentLayout`: Add the `relatedWork` Slot

**Purpose:** close the gap found in §3 — give Related Work a correctly-labeled landmark to render into, without disturbing the two existing consumers of this shared component.

**Files to inspect/change:** `src/components/content/document-layout.tsx` (modify — the only file this plan changes outside `engineering-log`'s own scope).

**Exact implementation responsibility:**
1. Add `relatedWork?: React.ReactNode;` to `DocumentLayoutProps`, positioned among the other optional closing-relationship slots (near `relatedKnowledge`/`engineeringLogs`, not `previousNext`, matching the props interface's existing grouping).
2. Destructure `relatedWork` in the component signature.
3. Add `{relatedWork && (<Section aria-label="Related Work" spacing="md" width="full">{relatedWork}</Section>)}` to the render body, positioned after `engineeringLogs`' own conditional block and before `previousNext` — Related Work reads as "where this log's process ended up," which belongs after the two existing "what this document relates to" regions and before the sequential-navigation footer, the same ordering logic already governing the existing three.
4. Update the file's own docstring to document the new slot's purpose and ownership, matching how the `relatedKnowledge`/`engineeringLogs` slots are already documented inline (`/** Case Study only (Task 5.3) — see this file's own docstring. */`) — this one should read `/** Engineering Log only (Task 6.2) */`.

**Dependencies:** none — this is the first work item because WI-4 (Log Detail route) depends on it.

**Expected behavior:** `/knowledge/[slug]` and `/work/[slug]` render byte-for-byte identically to before (neither passes `relatedWork`, so the new conditional block never renders for either route) — verified, not assumed.

**Acceptance criteria:** `DocumentLayoutProps` gains exactly one new optional field; the render body gains exactly one new conditional `Section` block, matching the existing three's structure precisely; `git diff` on this file shows only additive changes — no existing line removed or reordered beyond the new block's insertion point.

---

### WI-2 — Resolver: `resolveRelatedWorkForLog()`

**Purpose:** the reverse-lookup `docs/37` §12 specifies — "which Case Study or Case Studies name this log entry in their own `engineeringLog` array."

**Files to inspect/change:** `src/lib/content/engineering-logs.ts` (modify — the natural home per `docs/37` §12's own placement reasoning, mirroring `case-study-relationships.ts`'s role for Work).

**Exact implementation responsibility:**

```ts
// Conceptual signature — no implementation authorized by this document.
export function resolveRelatedWorkForLog(
  logEntry: ContentItem<ArticleFrontmatter>,
  caseStudies: ContentItem<WorkFrontmatter>[] = getAllCaseStudies(),
  limit = DEFAULT_RELATIONSHIP_LIMIT,
): ResolvedArticleSummary[] {
  // Filter caseStudies where frontmatter.engineeringLog.includes(logEntry.slug),
  // map each match through a toCaseStudySummary()-equivalent (reuse the exact
  // mapping case-study-relationships.ts's own toCaseStudySummary() already
  // performs — same target shape, do not redefine it a second time), cap at
  // `limit`, preserve getAllCaseStudies()'s own returned order (no re-ranking
  // — docs/37 §12's own "no significance judgment this proposal wasn't asked
  // to make").
}
```

Two design points fixed by `docs/37` §12 and restated here as non-negotiable implementation constraints, not suggestions:

1. **Always returns an array**, including a single-match case — never `ResolvedArticleSummary | null`, never a "pick the first match" shortcut.
2. **Reuses `DEFAULT_RELATIONSHIP_LIMIT`** (currently 4, defined in `case-study-relationships.ts`) rather than defining a second cap constant — importing the existing constant, not duplicating its value, so the two never drift apart.

**Where `toCaseStudySummary`-equivalent mapping comes from:** `case-study-relationships.ts`'s own `toCaseStudySummary()` is a private, unexported function today — it cannot be imported directly. Two options, left to the implementation task to choose based on which produces less duplication once both exist side by side: (a) export `toCaseStudySummary()` from `case-study-relationships.ts` and import it here, or (b) write an equivalent local mapping in `engineering-logs.ts`. Option (a) is the more architecturally consistent choice (one mapping, not two) but crosses a file this plan doesn't otherwise touch — noted as an implementation-level decision, not fixed here, the same way `docs/36` left comparable small choices open where either answer satisfies the architecture equally.

**Dependencies:** `getAllCaseStudies()` (`case-studies.ts`, unmodified), `ResolvedArticleSummary` type (`relationships.ts`, unmodified), `DEFAULT_RELATIONSHIP_LIMIT` (`case-study-relationships.ts`, unmodified, imported not duplicated).

**Expected behavior:** given a log entry no Case Study names, returns `[]`. Given a log entry exactly one Case Study names, returns a one-element array. Given a log entry two or more Case Studies independently name (the many-to-many case `docs/37` §12 confirms the schema permits), returns all of them, up to `limit`, in `getAllCaseStudies()`'s own order.

**Acceptance criteria:** zero duplicate slugs in the output (impossible to produce duplicates given the filter's own logic, but the acceptance test should confirm it against real data, not just by inspection of the code); output length never exceeds `limit`; a case study whose `engineeringLog` array is empty or doesn't include this slug never appears; function reads `getAllCaseStudies()` by default but accepts an already-fetched list (the same optional-with-a-default shape every resolver in this codebase already uses), so a future Log Detail page reading both this and other Work-scoped data doesn't pay for a second disk read.

---

### WI-3 — Resolver: `resolvePreviousNextLog()`

**Purpose:** pure chronological adjacency (`docs/37` §14) — the immediate next/previous entry by `publishedAt`.

**Files to inspect/change:** `src/lib/content/engineering-logs.ts` (same file as WI-2 — both resolvers belong together, both are small).

**Exact implementation responsibility:**

```ts
// Conceptual signature — no implementation authorized by this document.
export function resolvePreviousNextLog(
  logEntry: ContentItem<ArticleFrontmatter>,
  allEntries: ContentItem<ArticleFrontmatter>[] = getAllEngineeringLogEntries(),
): { previous: ResolvedArticleSummary | null; next: ResolvedArticleSummary | null } {
  // sortByPublishedDate(allEntries) (lib/content/loader.ts, already generic,
  // already non-mutating — reused directly, no second comparator written),
  // find logEntry's index in that sorted order, previous = one index toward
  // the older end, next = one index toward the newer end. No wraparound —
  // the oldest entry has no "previous," the newest has no "next," matching
  // Knowledge's own findTopicNeighbor() precedent (relationships.ts) for
  // "position within a fixed order, no ring."
}
```

**Dependencies:** `sortByPublishedDate()` (`loader.ts`, unmodified), `getAllEngineeringLogEntries()` (`engineering-logs.ts`, unmodified, already in this file), `ResolvedArticleSummary` type.

**Expected behavior:** with today's real (empty) collection, called with any entry, both sides are `null` — moot until real content exists, honest, not an error. With two or more real entries, adjacency is correct and never wraps.

**Acceptance criteria:** matches `resolvePreviousNextCaseStudy`'s own "no wraparound, `null` is a valid and expected outcome" contract exactly; returns the shape `PreviousNext` (the presentation component, WI-6) already expects unmodified.

---

### WI-4 — New Components: Log Entry Header, Log Row, Related Work Section

**Purpose:** the three new presentation pieces `docs/37` §15/§17 specify — each a recombination of an idiom that already exists at least three times elsewhere in this codebase, none introducing a new visual pattern.

**Files to inspect/change (all new):**
- `src/components/engineering-log/log-entry-header.tsx` — title, date, tags. Explicitly **not** `ProjectHeader` or `DocumentHeader` reused or extended (`docs/37` §8/§17/D4 — neither's metadata vocabulary fits; forcing it would fabricate Domain/Status/Difficulty or a required `topic` a log entry doesn't have).
- `src/components/engineering-log/log-entry-row.tsx` — the Index's own listing row: title, date, one-line description. Follows the exact stretched-link idiom (`relative`, `after:absolute after:inset-0`, `hover:bg-muted/40 focus-within:ring-2`) already used by `ProjectLibrary`'s `LibraryRow`, `EngineeringLog`'s (homepage) `LogEntryRow`, and `RelatedEngineeringLogs`' `EngineeringLogRow` — a fourth instance of an existing pattern, not a new one.
- `src/components/engineering-log/related-work.tsx` — Detail's Related Work section, rendering `resolveRelatedWorkForLog()`'s output. Follows the card idiom `docs/37` §15 specifies reusing *as a pattern* (title-as-link, quiet citation line) rather than importing `components/work/related-knowledge.tsx` directly — matching the "every route owns its own section components" precedent `FeaturedCaseStudies` already established relative to the homepage's `EngineeringCaseStudies` in Task 5.1. Implements the full zero/one/multiple behavior `docs/37` §12's "UI Behavior by Count" table specifies: `if (items.length === 0) return null;` as its first line (matching `RelatedKnowledge`/`RelatedEngineeringLogs`' own precedent exactly), otherwise a list — the same component renders one row or several without a special-cased "singular" branch.

**Dependencies:** WI-2 (Related Work section renders `resolveRelatedWorkForLog()`'s output shape).

**Expected behavior / acceptance criteria:** all three are Server Components (no interactivity, no browser API needed — matching every other presentation component this codebase has for this class of content); `LogEntryHeader` renders no Domain/Status/Difficulty/topic anywhere, by construction (there's no such prop to pass); `RelatedWork`'s zero-state produces no DOM trace at all (verified the same way Task 6.1's WI-5 verified `EngineeringLog`'s own empty state — inspecting rendered HTML for the section's absence, not just visually).

---

### WI-5 — Route: `/engineering-log/[slug]` (Log Detail)

**Purpose:** the individual entry reading experience.

**Files to inspect/change:** `src/app/engineering-log/[slug]/page.tsx` (new).

**Exact implementation responsibility:** mirrors `app/work/[slug]/page.tsx`'s own structure precisely — `generateStaticParams()` from `getEngineeringLogSlugs()`; `generateMetadata()` returning `{}` for an unresolvable slug (matching `/work/[slug]`'s own pattern) with a real `title`/`description` otherwise; the page body checks `engineeringLogEntryExists(slug)` and calls `notFound()` if false, before doing any other work (the same "check existence before loading" discipline `/work/[slug]` already uses); `extractHeadings()` called exactly once, shared by `TableOfContents` and `ArticleBody`; `getAllCaseStudies()` and (if `resolveArticleReferences` needs it for Related Knowledge) `getAllArticles()` each read from disk exactly once per request, shared across whichever resolvers need them — the identical "resolve once, reuse everywhere" discipline every prior document route in this codebase already follows.

```
DocumentLayout
  breadcrumb        → Breadcrumb: Engineering Log → {title}   (2 segments — docs/37 §8, no category tier)
  header             → LogEntryHeader (WI-4)
  tableOfContents    → TableOfContents (unmodified, reused)
  body               → ArticleBody (unmodified, reused)
  relatedKnowledge   → a new, Log-scoped Related Knowledge component (see note below),
                         fed resolveArticleReferences(logEntry.frontmatter.relatedContent, ...)
  relatedWork        → RelatedWork (WI-4), fed resolveRelatedWorkForLog() (WI-2)  — the new slot, WI-1
  previousNext       → PreviousNext (unmodified, reused), fed resolvePreviousNextLog() (WI-3)
```

**Related Knowledge component note:** `docs/37` §13 specifies reusing `resolveArticleReferences()` (the resolver) directly — already exported, already generic. The *presentation* component, per the same "every route owns its own section components" discipline WI-4 already applies to Related Work, should be a small Log-scoped component (e.g. `components/engineering-log/related-knowledge.tsx`) rather than importing `components/work/related-knowledge.tsx` — listed here as part of WI-5's own scope rather than WI-4's, since it's simple enough (title + description + citation card, identical to Work's own `RelatedKnowledgeCard` idiom) not to need its own separate work item.

**Dependencies:** WI-1 (the `relatedWork` slot), WI-2, WI-3, WI-4.

**Expected behavior:** a real (or temporary verification-fixture) entry renders completely; an invalid slug calls `notFound()`, producing Next's existing default 404 (the pre-existing, out-of-scope gap `docs/37` §2/§7 already named and declined to fix here).

**Acceptance criteria:** exactly one `<h1>`; breadcrumb has exactly two segments; Related Work, Related Knowledge, and Previous/Next each independently render `null` when their resolver returns nothing, verified against real (empty-today) data, not assumed from the component's own code.

---

### WI-6 — Route: `/engineering-log` (Log Index)

**Purpose:** chronological discovery.

**Files to inspect/change:** `src/app/engineering-log/page.tsx` (new).

**Exact implementation responsibility:** composed directly from `Section`/`Stack` (matching `app/work/library/page.tsx`'s own composition — no `DocumentLayout`, which is a single-document skeleton, not a listing page's; `docs/37` §15 already draws this line explicitly). Reads `getAllEngineeringLogEntries()` once, sorts via `sortByPublishedDate()`, renders an Index Header (real count — `docs/37` §8's own "never a guess" requirement) and the chronological listing (`LogEntryRow`, WI-4) or, per `docs/37` §22, an **honest empty-state message** when the collection is empty — explicitly **not** `null`-when-empty the way the homepage's own preview section now behaves (Task 6.1's WI-5): the Index is the collection's *own dedicated page*, and a reader who navigated here deliberately should see "nothing logged yet," not a page that silently renders as if it doesn't exist. This distinction is `docs/37` §22's own explicit ruling, restated here so it isn't accidentally implemented as `return null` by analogy to the homepage's different, already-established pattern.

Closes with `ContinueExploring` (`components/work/continue-exploring.tsx`, already generalized to accept `title`/`introduction`/`links` as props in Task 5.2 — reused directly, not reimplemented), routed into `/work` and `/knowledge`, never back into content this same page already showed in full — the identical "guide outward, never deeper into the same page" discipline that component's own docstring already states.

**Dependencies:** WI-4 (`LogEntryRow`).

**Expected behavior:** with today's real, empty collection, renders the Index Header with an honest zero count and the empty-state message — verified live, not assumed.

**Acceptance criteria:** exactly one `<h1>`; real count in the header matches `getAllEngineeringLogEntries().length` exactly; `ContinueExploring`'s links are genuinely contextual (into Work/Knowledge), never a repeat of what the Index itself already shows.

---

### WI-7 — Route Metadata

**Purpose:** both new routes gain their own SEO-boundary metadata, matching every other route's existing pattern.

**Files to inspect/change:** `src/app/engineering-log/page.tsx`, `src/app/engineering-log/[slug]/page.tsx` (both — folded into WI-5/WI-6's own file changes, called out separately here only so it isn't skipped as "obviously covered").

**Exact implementation responsibility:** `export const metadata` on the Index (matching `/work`'s own plain-object pattern); `generateMetadata()` on the Detail route (matching `/work/[slug]`'s own pattern — `{}` for an unresolvable slug, real `title`/`description` from the entry's own frontmatter otherwise).

**Explicit non-goal, restated from `docs/37` §21:** no canonical URL, no Open Graph, no structured data — this workspace has no `SITE_URL` yet, and this task doesn't introduce one.

**Dependencies:** none beyond WI-5/WI-6 existing.

**Acceptance criteria:** both routes' rendered `<title>`/meta description are real and route-specific, never the root layout's generic fallback.

---

### WI-8 — Navigation Verification (No Code Change Expected)

**Purpose:** confirm, rather than assume, that `docs/37` §10's claim — "every existing link into this system already points at the correct destination" — holds exactly, now that the destinations exist to check against.

**Files to inspect:** `lib/navigation/config.ts`, `components/home/engineering-log.tsx`, `components/work/related-engineering-logs.tsx` — **read-only inspection, no changes expected or authorized**.

**Exact implementation responsibility:** none — this work item is a verification checkpoint, not a build step. If inspection finds any of these three files' links do *not* already point at `/engineering-log`/`/engineering-log/[slug]` correctly, that is a discrepancy to report (per this task's own instruction), not a change to make silently within this plan.

**Dependencies:** WI-5, WI-6 (routes must exist to verify links resolve).

**Acceptance criteria:** live `GET` on every link source confirms 200, not 404, with zero source-file changes required.

---

### WI-9 — Release Candidate Review

**Purpose:** the release gate for Task 6.2 as a whole, mirroring `docs/36`'s own WI-7 pattern exactly.

**When it runs:** only after WI-1 through WI-8 are complete.

**Verification steps:**

1. **Functional** — every acceptance criterion from WI-1–WI-8, re-checked live together.
2. **Related Work cardinality, specifically** — verify against a temporary fixture scenario with *two* Case Studies independently naming the same log slug (not just zero/one), confirming `resolveRelatedWorkForLog()` returns both, unranked, capped correctly at `DEFAULT_RELATIONSHIP_LIMIT` — the one behavior `docs/37`'s own amendment (§12) specifically requires and that a zero/one-only test would not catch.
3. **`DocumentLayout` regression** — `/knowledge/[slug]` and `/work/[slug]` render identically to their pre-Task-6.2 state; the new `relatedWork` slot never renders on either route.
4. **Empty states, both kinds, not conflated** — Index renders an honest message (not `null`) when empty; Detail's Related Work/Related Knowledge/Previous-Next each render `null` when empty — confirmed as two *different*, both-correct behaviors, not a copy-paste of one onto the other.
5. **Invalid slug** — `/engineering-log/this-does-not-exist` calls `notFound()`, produces Next's existing default 404, matching every other dynamic route.
6. **Every existing link resolves** — WI-8's own check, re-confirmed.
7. **No guardrail crossed** — `content/work/`, `content/knowledge/`, `/work`, `/knowledge`, `lib/content/work.ts`, `lib/content/articles.ts` all show zero diff; the only file touched outside `engineering-log`'s own scope is `document-layout.tsx` (WI-1), and its diff is purely additive.
8. **Automated checks:** `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
9. **Git diff vs. this plan's file manifest (§6)** — exact match, no extras.
10. **Console errors** — none, on both new routes, both themes, desktop and mobile.
11. **Responsive** — no horizontal overflow on either new route.
12. **Accessibility** — heading hierarchy, landmark labels (including the new `aria-label="Related Work"` — confirm it's distinct from and never collides with "Related Knowledge"/"Engineering Logs"), focus visibility, reduced motion.

**Release recommendation:** **Approved** or **Refinements Required**, per the identical format `docs/36` WI-7 established — refinements route back through the specific failing work item(s), then WI-9 re-runs in full.

---

## 6. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/components/content/document-layout.tsx` | Modified — one new optional slot | WI-1 |
| `src/lib/content/engineering-logs.ts` | Modified — two new resolver functions | WI-2, WI-3 |
| `src/components/engineering-log/log-entry-header.tsx` | New | WI-4 |
| `src/components/engineering-log/log-entry-row.tsx` | New | WI-4 |
| `src/components/engineering-log/related-work.tsx` | New | WI-4 |
| `src/components/engineering-log/related-knowledge.tsx` | New | WI-5 |
| `src/app/engineering-log/[slug]/page.tsx` | New | WI-5, WI-7 |
| `src/app/engineering-log/page.tsx` | New | WI-6, WI-7 |
| *(possibly)* `src/lib/content/case-study-relationships.ts` | Modified — export `toCaseStudySummary()` if that option is chosen over a local equivalent | WI-2 (implementation-level choice) |

**Not touched by this plan, anywhere:** `content/work/`, `content/knowledge/`, `lib/content/work.ts`, `lib/content/articles.ts`, `lib/content/case-studies.ts`, `lib/content/relationships.ts` (read, not modified), `lib/navigation/config.ts`, `components/home/engineering-log.tsx`, `components/work/related-engineering-logs.tsx`, `components/work/project-header.tsx`, `components/content/document-header.tsx`, any file under `app/work/` or `app/knowledge/`, `app/page.tsx`, `app/not-found.tsx` (doesn't exist; not created).

---

## 7. Sequencing

```
WI-1 (DocumentLayout slot)
  │
  ├──▶ WI-2 (resolveRelatedWorkForLog)  ──┐
  ├──▶ WI-3 (resolvePreviousNextLog)      │
  └──▶ WI-4 (new components) ─────────────┼──▶ WI-5 (Detail route) ──┐
                                            │                          ├──▶ WI-8 (nav verification) ──▶ WI-9 (RC review)
                                    WI-6 (Index route) ────────────────┘
                                            │
                                          WI-7 (metadata, folded into WI-5/WI-6)
```

WI-2 and WI-3 have no dependency on each other and can proceed in parallel once WI-1 exists (both are pure logic, independently testable before any UI). WI-6 (Index) depends only on WI-4's `LogEntryRow`, not on WI-5 — the two routes can be built in either order or in parallel. WI-9 is strictly last, exactly as `docs/36`'s WI-7 was.

---

## 8. Explicit Guardrails

- `content/work/*.mdx` and `content/knowledge/*.mdx` — **zero changes**. No real Engineering Log content is authored by this plan or its implementation (`docs/37`'s own "explicitly deferred" list, §24).
- `lib/content/work.ts`, `lib/content/articles.ts`, `lib/content/case-studies.ts` — **zero changes**. Every resolver this plan needs from Work already exists (`getAllCaseStudies()`) and is only *read from*, never modified.
- `app/work/[slug]/page.tsx`, `app/knowledge/[slug]/page.tsx`, `app/work/page.tsx`, `app/knowledge/page.tsx`, `app/page.tsx` — **zero changes**.
- `lib/navigation/config.ts` — **zero changes** (WI-8 verifies, does not modify).
- `document-layout.tsx` — **exactly one additive change** (WI-1); no existing slot's behavior, label, or rendering changes.
- No new content collection, no schema change to `articleFrontmatterSchema` or `workFrontmatterSchema` — the many-to-many Related Work relationship is entirely computed (WI-2), never authored via a new field.
- No new client component anywhere in this plan — every new file is a Server Component, matching `docs/37` §20's own "no new client component" finding.
- No `app/not-found.tsx` created — the pre-existing, out-of-scope gap stays exactly that.
- No RSS, no search, no facet/filter UI, no comments/bookmarks/reading-progress — `docs/37` §7's Non-Goals, unchanged.

---

## 9. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `relatedWork` slot ordering or labeling drifts from the other three, producing an inconsistent closing-region sequence | Low | WI-1's acceptance criteria fix both the position and the exact `aria-label` string precisely |
| `resolveRelatedWorkForLog()` silently caps or reorders in a way that hides a real second match | Medium | WI-9 step 2 specifically tests the two-Case-Studies-one-log scenario, not just zero/one |
| Index's empty state is implemented as `return null` by analogy to the homepage's own (different, already-shipped) empty behavior | Medium | WI-6 and WI-9 step 4 both call this out explicitly as a distinct, non-analogous case |
| A new component silently reintroduces Case-Study-style metadata (a badge, a status label) into the Log Entry Header | Low | WI-4's acceptance criteria state directly that no such prop should exist to pass |
| `toCaseStudySummary()` gets duplicated instead of exported, and the two copies drift | Low | WI-2 names both options explicitly and flags the export as the more consistent one, leaving only which file to prefer as the open choice |

---

## 10. Verification Plan

Inherits `docs/37` §25 in full; formally executed and signed off by WI-9 (§5), the same relationship `docs/36`'s own §9/WI-7 established between "what must be verified" and "where it's actually checked."

---

## 11. Rollback Plan

WI-2–WI-8 are additive new files or additive resolver functions — reverting any one is deleting its own file(s) with no cross-file cleanup required, except WI-1: reverting the `relatedWork` slot requires confirming no other work item's file still references it (WI-5 does, directly) — so WI-1 should only be reverted together with WI-5, not independently, if a rollback is ever needed mid-implementation.

---

## 12. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/37` — none introduces a new architectural decision beyond the one discrepancy found and resolved in §3.
- The `DocumentLayout` gap is documented precisely, with the smallest correct fix specified, not silently worked around by misusing an existing slot.
- The many-to-many Related Work behavior (`docs/37`'s own amendment) is carried through every relevant work item's signature and acceptance criteria, not just restated once and forgotten.
- File manifest (§6) is exhaustive; guardrails (§8) leave no reasonable path to scope expansion into Work/Knowledge content, schema, or existing routes.
- No production code, component, route, or content was modified to produce this document.

---

## 13. Final Report Requirements

WI-9's own deliverable — a closing report following the same format `docs/36`'s WI-7 report (and the Task 5.7/6.1 report series before it) already established: work items completed, file manifest as actually diffed vs. this plan's prediction, all twelve WI-9 verification steps individually, guardrail confirmation, the one implementation-level choice left open here (WI-2's `toCaseStudySummary()` export-vs-duplicate decision), and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/37-ENGINEERING_LOG_EXPERIENCE.md`'s architecture into nine work items. Re-inspection of the actual repository — not just `docs/37`'s own description of it — found one real gap `docs/37` didn't resolve precisely enough to implement directly: `DocumentLayout` has no slot whose landmark label fits "Related Work," and the correct fix is one small, additive extension to that shared component, mirroring exactly how Task 5.3 added the two closing-relationship slots Work itself needed. Every other work item is new, Log-scoped code — two small resolver functions and a handful of Server Components, each a recombination of an idiom that already exists elsewhere in this codebase, never a new pattern. The many-to-many Related Work relationship `docs/37`'s own amendment established is carried through precisely, with its own dedicated verification step (WI-9.2) specifically because a zero/one-only test would not catch a regression there. Nothing in this plan touches Work or Knowledge's own content, schema, or routes.
