# 42 — Search / Core Discovery — Implementation Plan

## Status

Implementation Plan — translating the approved `docs/41-SEARCH_CORE_DISCOVERY.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/41` establishes *what* Task 6.4 should do and *why*, and draws the Milestone 6 / Milestone 7 boundary this plan must not cross. This document establishes *exactly what changes, file by file* — the same role `docs/36`/`docs/38`/`docs/40` played for Tasks 6.1–6.3. Re-inspection (§3) found one real discrepancy between `docs/41`'s assumptions and the actual content layer, corrected here rather than carried forward silently.

---

## 2. Authoritative Inputs & Constraints

`docs/41-SEARCH_CORE_DISCOVERY.md` is the architecture authority. Carried forward unchanged:

- **Milestone 6 boundary**: *"A reader who already knows a term can use Search to reach a real page."* No filtering, faceting, ranking, indexing library, live search, or command palette — all Milestone 7 (`docs/41` §7, §21).
- **Server-rendered, GET-based `/search?q=`** — no client component for the query itself, no debounce, no client-side state (`docs/41` §8, D1).
- **Substring matching only**, against `title`/`description`, ordered by recency — no fuzzy/ranked relevance (`docs/41` §8, D2).
- **Three participating collections**: Knowledge, Work, Engineering Log — `series`/`technologies` excluded (no route to link to, both empty); About excluded (not a collection) (`docs/41` §11, D3).
- **Header's existing disabled Search button activates in place** — no `PRIMARY_NAVIGATION` change, no `MobileNavigation` change (`docs/41` §10, D4).
- **Out of scope regardless of milestone**: 404, RSS, Sitemap (`docs/41` §7).

---

## 3. Re-Inspection Findings — Including One Corrected Discrepancy

Re-verified directly against the actual repository.

### Confirmed, matching `docs/41` exactly

- No `src/app/search/` exists. No catch-all route, no `not-found.tsx`.
- `Header` (`src/components/navigation/header.tsx`) still renders the disabled `Search` button exactly as `docs/41` described — `disabled`, `aria-label="Search (coming soon)"`, `title="Search (coming soon)"`, positioned before the identically-patterned RSS button and the real GitHub link (`render={<a href={GITHUB_URL} ... />}`).
- `PRIMARY_NAVIGATION` (`lib/navigation/config.ts`) still lists exactly four entries; `MobileNavigation`'s own docstring still states it deliberately excludes Search.
- `components/ui/` still contains only `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `separator.tsx`, `skeleton.tsx`, `tooltip.tsx` — no `Input` primitive.
- `package.json` still has no search/indexing library.
- `getAllArticles()` (`lib/content/articles.ts`) and `getAllEngineeringLogEntries()` (`lib/content/engineering-logs.ts`) are exactly what `docs/41` described: real, `getAll()`-backed reads over `content/knowledge/` and `content/engineering-log/`.

### Corrected — `docs/41`'s Work resolver assumption was wrong

`docs/41` §11/§12 recommends reusing `getProjectLibrary()`/`getFeaturedCaseStudies()` (`lib/content/work.ts`) for Work's search coverage. **Direct re-inspection of `lib/content/work.ts` shows both functions read `PLACEHOLDER_WORK`** (`lib/constants/placeholder-work.ts`) — a hand-authored fixture array, not the real `content/work/*.mdx` collection. `work.ts`'s own docstring confirms this is deliberate and already documented: *"Two different data maturities today (fixture array vs. real MDX collection), kept in two files."*

The correct resolver — confirmed by direct comparison — is **`lib/content/case-studies.ts`'s `getAllCaseStudies()`**, which reads the real `content/work/*.mdx` collection (`getAll<WorkFrontmatter>("work")`, filtered for drafts) — the exact function `app/work/[slug]/page.tsx` and `engineering-logs.ts`'s own `resolveRelatedWorkForLog()` already use for relationship resolution against real case studies.

**Evidence this isn't a false alarm:** `PLACEHOLDER_WORK`'s `summary` field is independently hand-written and has already drifted from the real MDX `description` frontmatter for the same project — confirmed by direct comparison (VaultPay's placeholder summary reads *"Designing a wallet infrastructure that remains correct under concurrent transactions"*; the real `content/work/vaultpay.mdx` frontmatter `description` reads *"Designing a wallet system around a double-entry, append-only ledger so correctness under concurrency doesn't depend on getting a balance update right every time."*). Matching search queries against the placeholder's text would search copy that isn't what `/work/vaultpay` actually says — a real correctness bug, not a style nitpick, and exactly the kind of "two sources of truth drifting apart" failure `docs/24` Principle 3 exists to prevent.

**Correction applied throughout this plan:** every Work-related work item below reads `getAllCaseStudies()` (`case-studies.ts`), never `work.ts`. `docs/41`'s own architecture (three collections, substring match, no ranking) is otherwise unaffected — this is a resolver-selection correction, not a scope change.

### New finding — a ready-made normalization shape already exists

`lib/content/relationships.ts`'s `ResolvedArticleSummary` (`{ slug, collection, title, description, href, difficulty?, readingTime, publishedAt }`) is already the shared shape three existing functions produce:

| Collection | Existing function | Location | Exported? |
|---|---|---|---|
| Knowledge | `toSummary()` | `relationships.ts` | No (module-private) |
| Work | `toCaseStudySummary()` | `case-study-relationships.ts` | **Yes** (exported in Task 6.2 for reuse) |
| Engineering Log | `toEngineeringLogArticleSummary()` | `engineering-logs.ts` | No (module-private) |

This is a direct, load-bearing reuse opportunity `docs/41` didn't have visibility into at the proposal stage: Search's result-normalization work item doesn't need a new type or new mapping logic — it needs two of these three functions exported (Knowledge's and Engineering Log's; Work's already is) and reused as-is. See WI-4.

No other discrepancy found.

---

## 4. Route Contract

```text
GET /search
GET /search?q=<term>
```

- No `q` param (or empty/whitespace-only after trimming) → the prompt state (§ WI-7), zero collections read, zero matching performed.
- Non-empty `q` → trimmed, matched case-insensitively as a substring against `title` and `description` across Knowledge, Work, and Engineering Log (WI-2/WI-3), grouped by collection (§ WI-6, resolving `docs/41` §24 Q3 — see WI-6's own rationale), each group ordered by `sortByPublishedDate()`.
- No pagination, no result cap — the same "small, fully-known dataset" reasoning `docs/41` §13 already gives for not needing an index applies equally to not needing a page-2.
- `searchParams` is read the same way this repository's other dynamic route inputs already are — `app/work/[slug]/page.tsx`'s `params` is awaited (`const { slug } = await params`), confirming this project's Next.js version treats route inputs as async. **Whoever implements WI-5 must confirm the exact `searchParams` shape against `node_modules/next/dist/docs/` before writing it** (per `AGENTS.md`'s standing instruction — this is a customized Next.js build, not assumed-stock behavior), rather than this plan prescribing syntax it can't verify without reading code, which it isn't authorized to write.

---

## 5. Work Items

### WI-1 — `components/ui/input.tsx`

**Purpose:** the one new shared UI primitive this task's scope requires (`docs/41` §12/§21) — a plain, styled text input, not a search-specific control.

**Files to create:** `src/components/ui/input.tsx`.

**Exact responsibility:** a native `<input>` wrapped in the same `cva`-based styling convention `button.tsx` already establishes (border/ring/focus-visible tokens, `disabled:opacity-50`, etc.), exporting a `cn()`-merged `className` prop the same way every other `ui/` primitive does. **No `@base-ui/react` primitive wraps it** — unlike `Dialog`/`Menu`, a single-line text input has no focus-trap, portal, or open/close state for a headless library to manage; a styled native `<input type="search">` is the complete, correct implementation, and reaching for a headless wrapper here would be exactly the "abstraction added without a concrete need" `docs/24` Principle 2 warns against.

**Dependencies:** none.

**Acceptance criteria:** matches `Button`'s existing visual language (border, radius, focus-visible ring) without importing anything from `components/search/` or otherwise being search-specific in name or styling; usable by any future form in this codebase, not coupled to this task.

---

### WI-2 — Content Loading (`lib/content/search.ts`)

**Purpose:** read the three participating collections through their existing, real resolvers — no new content-loading path (`docs/41` §11).

**Files to create:** `src/lib/content/search.ts` (new file; the collection-spanning resolver `docs/41` §13 describes, mirroring `case-studies.ts`/`articles.ts`'s "one resolver file per concern" shape rather than bolting this logic onto any single collection's existing file).

**Exact responsibility:**

```text
Knowledge  →  getAllArticles()          (lib/content/articles.ts)
Work       →  getAllCaseStudies()       (lib/content/case-studies.ts — §3's correction, NOT work.ts)
Eng. Log   →  getAllEngineeringLogEntries()  (lib/content/engineering-logs.ts)
```

Each called exactly once per request — the same "resolve once, reuse everywhere" discipline `app/work/[slug]/page.tsx`'s own docstring already states for its three relationship reads.

**Dependencies:** none (reads existing exports only).

**Acceptance criteria:** `search.ts` imports `getAllCaseStudies` from `case-studies.ts`, never anything from `work.ts`; no new frontmatter reading, parsing, or filesystem access — every read goes through an existing `getAll*()` function.

---

### WI-3 — Matching (`lib/content/search.ts`)

**Purpose:** the query-matching logic itself — case-insensitive substring test, nothing more (`docs/41` §8, D2).

**Files:** same file as WI-2.

**Exact responsibility:** one small, shared predicate — conceptually `matchesQuery(title: string, description: string, query: string): boolean`, comparing lowercased query against lowercased `title`/`description` via a substring test (`.includes()`), applied identically across all three collections so match behavior can't silently diverge per collection. Applied at the `ContentItem`/frontmatter level (before normalization, WI-4) so `sortByPublishedDate()` (WI-2/WI-6) still has a real `Date` to sort against — normalizing first and sorting the already-stringified `publishedAt` (e.g. `"Aug 2026"`) would sort lexicographically, not chronologically, which is wrong at a year boundary. This ordering-of-operations detail is the one real implementation trap in an otherwise simple work item, worth stating explicitly so WI-5 doesn't rediscover it by shipping a subtly wrong sort.

**Dependencies:** WI-2 (reads its collection arrays).

**Acceptance criteria:** matching is case-insensitive; an empty or whitespace-only query matches nothing (never "matches everything" — that would silently turn `/search` with no real query into an unbounded listing page, a behavior `docs/41` never asked for); matching never inspects MDX body content, `tags`, or `technologies` — title/description only, exactly as scoped.

---

### WI-4 — Result Normalization (`lib/content/search.ts` + two small exports)

**Purpose:** shape matched results into the one summary type this codebase already has for exactly this purpose — `ResolvedArticleSummary` (`lib/content/relationships.ts`) — reusing three existing mapping functions rather than inventing a fourth, parallel `SearchResult` type (§3's "ready-made shape" finding).

**Files to modify:**
- `src/lib/content/relationships.ts` — export `toSummary()` (currently module-private).
- `src/lib/content/engineering-logs.ts` — export `toEngineeringLogArticleSummary()` (currently module-private).

**Files to create:** none beyond WI-2/WI-3's `search.ts`, which imports all three:

```text
Knowledge  →  toSummary()                       (relationships.ts — newly exported)
Work       →  toCaseStudySummary()               (case-study-relationships.ts — already exported, Task 6.2)
Eng. Log   →  toEngineeringLogArticleSummary()    (engineering-logs.ts — newly exported)
```

**Dependencies:** WI-2, WI-3.

**Acceptance criteria:** `search.ts` contains **zero** hand-written mapping logic duplicating what these three functions already do — it only calls them; the two newly-exported functions' behavior is provably unchanged (an `export` keyword addition only — no modification to either function's body, verified by diff).

---

### WI-5 — Route (`src/app/search/page.tsx`)

**Purpose:** the page itself — query parsing, wiring WI-2–WI-4's `search.ts` exports, composing the result.

**Files to create:** `src/app/search/page.tsx`.

**Exact responsibility:** an async Server Component reading `searchParams` (per §4's own caution — exact syntax verified against this project's actual Next.js docs before being written, not assumed), trimming `q`, and — if non-empty — calling a single conceptual `search.ts` export (e.g. `searchContent(query: string): { knowledge: ResolvedArticleSummary[]; work: ResolvedArticleSummary[]; engineeringLog: ResolvedArticleSummary[] }`, WI-2–WI-4's combined surface) that returns the three already-matched, already-sorted, already-normalized groups. The page itself contains no matching or normalization logic of its own — it renders WI-1's `Input` inside a plain `GET` `<form>`, and passes the resolved groups to WI-6/WI-7's presentation.

**Dependencies:** WI-1, WI-2, WI-3, WI-4.

**Acceptance criteria:** no `"use client"`; no logic in this file duplicates anything `search.ts` already exports; the form's `method="GET"` and `action="/search"` make the page fully functional with JavaScript disabled, per `docs/41` D1's own requirement.

---

### WI-6 — Result Presentation

**Purpose:** render the three matched groups — resolving `docs/41` §24 Q3 (grouped vs. flat) explicitly, in favor of **grouped by collection**.

**Files to create:** either inline JSX in `app/search/page.tsx`, or a small new `src/components/search/search-results.tsx` if the three groups' rendering is substantial enough to warrant its own file (an implementation-task granularity decision, the same kind `docs/39`/`docs/40` already left open elsewhere — not fixed by this plan either way).

**Exact responsibility — and why grouped, not flat:** each of the three `ResolvedArticleSummary[]` groups (WI-4's output) is already independently sorted by real `Date` (WI-3's ordering-of-operations note). **Merging all three into one flat, chronologically-interleaved list would require comparing across collections after normalization, when only a formatted string (`"Aug 2026"`) remains** — not a reliable sort key. Presenting three separately-labeled, separately-sorted groups (a `<h2>` per collection with real results, omitted entirely if that collection's group is empty) avoids this problem by construction rather than working around it, which is the concrete engineering reason — not just a stylistic preference — this plan resolves Q3 in favor of grouping.

**Dependencies:** WI-5.

**Acceptance criteria:** a collection with zero matches renders no heading and no empty sub-message for that collection (§ WI-7 covers the page-level empty state, not a per-group one — a `docs/37`-style "empty collection is a valid state, not an error" distinction, applied here to a subset of results rather than a whole collection); every result is a real link (`href` from `ResolvedArticleSummary`) with the document's own title as its accessible name.

---

### WI-7 — Empty / No-Query States

**Purpose:** the two honest non-error states `docs/41` §19 specifies.

**Files:** `app/search/page.tsx` (or `search-results.tsx` if WI-6 splits it out).

**Exact responsibility:**
- No `q` param at all → a prompt state ("enter a term to search Knowledge, Work, and Engineering Log," or equivalent honest copy) — no results section rendered, no "0 results" message for a search that was never run.
- `q` present, zero matches across all three groups → `"No results for '<query>'"` (or equivalent) — never a fabricated near-match, never silently substituting unrelated content.

**Dependencies:** WI-5, WI-6.

**Acceptance criteria:** the prompt state and the zero-results state are visually and textually distinct — a reader can always tell whether their query ran and found nothing, versus not having entered one yet.

---

### WI-8 — Metadata

**Purpose:** `/search`'s own `export const metadata`, matching every other real route's existing pattern (`docs/41` §18).

**Files:** `app/search/page.tsx`.

**Exact responsibility:** a real, page-specific `title`/`description`, plus `robots: { index: false }` (or the equivalent `robots: "noindex"` string form — verified against this project's actual `Metadata` type before being written) on the query-bearing route, per `docs/41` §18's explicit requirement that a search-results URL shouldn't be indexed.

**Dependencies:** none (independent of WI-2–WI-7, but lives in the same file as WI-5).

**Acceptance criteria:** `robots` is present and set to non-indexing; no canonical URL, no Open Graph, no structured data — matching the same bounded scope `docs/35`/`docs/37`/`docs/40` each already drew.

---

### WI-9 — Header Search Activation

**Purpose:** the one navigation change this task makes — enabling the existing disabled icon (`docs/41` §10, D4).

**Files to modify:** `src/components/navigation/header.tsx`.

**Exact responsibility:** remove `disabled`; change `aria-label`/`title` from `"Search (coming soon)"` to `"Search"`; add `render={<a href="/search" aria-label="Search" />}`, `nativeButton={false}` — the exact same shape the adjacent `GithubIcon` button in the same cluster already uses (confirmed, `header.tsx` lines 85–102), not a new interaction pattern. **No other line in this file changes** — `PrimaryNavigation`, the wordmark, `ThemeToggle`, `MobileNavigation`, and the RSS button are all untouched.

**Dependencies:** none (independent of WI-1–WI-8; can happen at any point in the sequence, but is listed last among the "build" work items since it's the one change to an already-shipped, shared file and should land once `/search` is confirmed to actually work — no reason to point a live link at an unfinished page mid-implementation).

**Acceptance criteria:** `git diff` on this file shows only the Search button's five changed attributes/props (mirroring GitHub's own button shape) — the RSS button, `PrimaryNavigation`, `MobileNavigation`, `ThemeToggle`, and the wordmark link show zero diff.

---

### WI-10 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/36`'s WI-7, `docs/38`'s WI-9, and `docs/40`'s WI-10.

**When it runs:** only after WI-1 through WI-9 are complete.

**Verification steps:**

1. **Functional** — `/search` with no `q` shows the prompt state; a query matching a real Knowledge/Work/Engineering Log title or description returns that result, grouped correctly, linking to a real, working detail route; a nonsense query shows the honest zero-results state.
2. **Resolver correctness, specifically** — confirm `search.ts` imports `getAllCaseStudies` from `case-studies.ts` and never anything from `work.ts` (§3's correction); a query matching real MDX case-study copy (e.g. a phrase from `vaultpay.mdx`'s actual `description`) returns a result, and a query matching only `PLACEHOLDER_WORK`'s drifted `summary` text does **not** (proof the correct source is wired in, not the fixture).
3. **Scope boundary held** — no filtering UI, no tag/technology facets, no relevance score or ranking indicator, no search index or new dependency, no live/as-you-type behavior, no command palette anywhere in the shipped code (`docs/41` §7/§21, re-verified against the actual diff, not assumed from this plan alone).
4. **`series`/`technologies`/About never appear as results** — confirmed by direct test, not by code inspection alone.
5. **No client component** — `app/search/page.tsx`, `search.ts`, and `search-results.tsx` (if split out) contain no `"use client"`; the form works with JavaScript disabled.
6. **No guardrail crossed** — `PRIMARY_NAVIGATION`, `MobileNavigation`, `FOOTER_NAVIGATION`, `work.ts`, every existing collection's listing/detail page all show zero diff; `Header`'s diff is exactly WI-9's five attributes.
7. **Automated checks:** `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
8. **Git diff vs. this plan's file manifest (§6)** — exact match.
9. **Metadata** — `/search`'s `robots` value confirmed non-indexing.
10. **Accessibility** — the query input has a real associated label, the form is submittable via Enter with no JS, every result link has a real accessible name, heading hierarchy is correct (one `<h1>`, one `<h2>` per non-empty result group), focus-visible is present on the input and every result link.
11. **Responsive** — no horizontal overflow, desktop/tablet/mobile.
12. **Console errors** — none, both themes.

**Release recommendation:** **Approved** or **Refinements Required**, the identical format every prior implementation plan in this series has used.

---

## 6. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/components/ui/input.tsx` | New | WI-1 |
| `src/lib/content/search.ts` | New | WI-2, WI-3, WI-4 |
| `src/lib/content/relationships.ts` | Modified (export `toSummary`) | WI-4 |
| `src/lib/content/engineering-logs.ts` | Modified (export `toEngineeringLogArticleSummary`) | WI-4 |
| `src/app/search/page.tsx` | New | WI-5, WI-6 (possibly), WI-7, WI-8 |
| `src/components/search/search-results.tsx` | New, only if WI-6 splits it out | WI-6 |
| `src/components/navigation/header.tsx` | Modified (Search button activation only) | WI-9 |

**Not touched by this plan, anywhere:** `lib/content/work.ts`, `lib/constants/placeholder-work.ts`, `lib/content/case-studies.ts`, `lib/content/case-study-relationships.ts` (read-only — its existing exports are reused, not modified), `lib/content/articles.ts`, `lib/navigation/config.ts`, `components/navigation/mobile-navigation.tsx`, `components/navigation/footer.tsx`, `content/pages/`, `lib/content/collections.ts`, any existing route under `app/knowledge/`, `app/work/`, `app/engineering-log/`, `app/about/`.

Four or five new files, three modified files (two of them a single-line `export` addition each) — the smallest production-code footprint of any Core Pages task this milestone, apart from About's own zero-modified-file result.

---

## 7. Sequencing

```
WI-1 (ui/input.tsx)
       │
WI-2 (content loading) ──▶ WI-3 (matching) ──▶ WI-4 (normalization)
                                                       │
                                                       ▼
                                          WI-5 (route + query parsing)
                                                       │
                                    ┌──────────────────┼──────────────────┐
                                    ▼                  ▼                  ▼
                              WI-6 (results)     WI-7 (empty states)  WI-8 (metadata)
                                    │                  │                  │
                                    └──────────────────┴──────────────────┘
                                                       │
                                                       ▼
                                          WI-9 (Header activation)
                                                       │
                                                       ▼
                                              WI-10 (RC review)
```

WI-1 has no dependency and can happen anytime before WI-5. WI-2→WI-3→WI-4 are strictly sequential within `search.ts` (each builds on the last). WI-5 depends on WI-1 and WI-4. WI-6/WI-7/WI-8 all depend on WI-5 and can proceed in parallel. WI-9 is deliberately sequenced after WI-5–WI-8 (§ WI-9's own reasoning — don't link to an unfinished page). WI-10 is strictly last.

---

## 8. Explicit Guardrails

- No filtering, faceting, tag/technology/series pages, reading paths, or related-content recommendation engine anywhere in this task's files.
- No search index, no ranking algorithm, no new npm dependency.
- No live/as-you-type search, no client component for the query input, no command palette, no keyboard shortcut trigger.
- No `PRIMARY_NAVIGATION`/`MobileNavigation`/`FOOTER_NAVIGATION` change.
- No modification to `work.ts`, `placeholder-work.ts`, `collections.ts`, or `content/pages/`.
- No 404, RSS, or Sitemap route.
- `toSummary()`/`toEngineeringLogArticleSummary()` exports are additive only — no behavioral change to either function.

---

## 9. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Implementation reaches for `work.ts` out of habit (it's the file every prior Work-adjacent task has touched) instead of `case-studies.ts` | Medium | §3's correction is stated with concrete before/after evidence, not just a rule; WI-10 step 2 tests for it directly, not just inspects imports |
| Sorting after normalization (using the formatted `publishedAt` string) instead of before, producing a subtly wrong chronological order | Medium | WI-3's own docstring-level note names the trap explicitly, and WI-6's grouped-not-flat resolution removes the cross-collection version of this problem by construction |
| `robots: noindex` gets forgotten since it's easy to treat as optional polish | Low | WI-8 states it as an explicit acceptance criterion, and WI-10 step 9 checks it directly |
| A future editor duplicates `toSummary()`'s logic instead of importing the newly-exported version, because it's easy to miss that it's now exported | Low | WI-4's acceptance criterion requires zero hand-written mapping logic in `search.ts`, checked at review, not just assumed |

---

## 10. Verification Plan

Inherits `docs/41` §22 in full; formally executed and signed off by WI-10.

---

## 11. Rollback Plan

WI-1 through WI-8 are new files or additive-only exports — deletable/revertable independently with no cross-file cleanup. WI-9's `Header` change is a five-attribute diff on one existing file, trivially revertable to its exact prior disabled state. No schema change, no data migration, no irreversible step anywhere in this plan.

---

## 12. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/41` — none introduces a new architectural decision beyond what §3's resolver correction and §24 Q3's resolution required.
- The `work.ts` vs. `case-studies.ts` discrepancy is documented with concrete evidence (not just asserted) and corrected throughout every affected work item.
- File manifest (§6) is exhaustive; guardrails (§8) leave no reasonable path into Milestone 7 territory.
- No production code, component, route, or content was modified to produce this document.

---

## 13. Final Report Requirements

WI-10's own deliverable — work items completed, file manifest as actually diffed vs. this plan's prediction, all twelve WI-10 verification steps individually, guardrail confirmation, and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/41-SEARCH_CORE_DISCOVERY.md`'s architecture into ten work items — a new `ui/input.tsx` primitive, a new `search.ts` resolver that reuses three collections' existing `getAll*()` reads and (once two more functions are exported) three existing `toXSummary()` mappers rather than inventing new content-loading or normalization logic, a server-rendered `/search` route with no client component, and a five-attribute activation of Header's already-existing Search button. Re-inspection surfaced one real, evidenced discrepancy in `docs/41`'s own resolver assumption — Work's search coverage must come from `case-studies.ts`'s real MDX collection, not `work.ts`'s placeholder fixture, which has already drifted from the real case studies' actual copy — corrected throughout this plan rather than carried forward. The Milestone 6 boundary holds throughout: every work item either reaches a real page for a reader who already has a term in mind, or supports that goal directly; nothing here ranks, indexes, facets, or recommends.
