# 54 — Tag Discovery: Implementation Plan

## Status

Implementation Plan — translating `docs/53-DISCOVERY_TAXONOMY_EXPERIENCE.md`'s recommendation (extend Search's matching to `tags`) into a precise, file-by-file specification.

> This document authorizes no implementation. It is documentation only. No production source file, route, component, schema, or content was modified to produce it.

---

## 1. Purpose

`docs/53` §12 recommends one specific, narrow change: `/search`'s existing matching extends from `title`/`description` to also include `tags` — reusing the shipped Milestone 6 Search experience rather than building a parallel Tag system. This document converts that recommendation into work items. Per this task's own explicit framing, the implementation is additive to an already-approved architecture (`docs/41`/`docs/42`), not a redesign — every section below states what stays exactly as shipped before stating what changes.

---

## 2. Current Implementation — Re-Verified This Turn, Not Assumed From `docs/42`

Read in full this turn: `src/lib/content/search.ts`, `src/app/search/page.tsx`, `src/components/search/search-results.tsx`, `src/lib/content/relationships.ts`, `src/lib/content/articles.ts`, `src/lib/content/case-studies.ts`, `src/lib/content/engineering-logs.ts`, `src/lib/content/schema.ts`.

**Confirmed unchanged since Task 6.4** (`git log -- src/lib/content/search.ts` shows one commit, no later touch — including Task 7.1, which never modified this file): `search.ts`'s content-loading, matching, and normalization logic; `search/page.tsx`'s query parsing, metadata, and empty-state structure; `search-results.tsx`'s rendering. Task 7.1 changed what `getAllCaseStudies()` and `getAllArticles()` feed into elsewhere (`/knowledge`, `/work`), not their own contracts — both were already Search's real, correct data source before Task 7.1 and remain so.

**Confirmed this turn, not carried forward**: `articleFrontmatterSchema.tags: z.array(z.string()).default([])` (`schema.ts` line 22) — the shared base every one of the three participating collections extends or uses directly. `ResolvedArticleSummary` (`relationships.ts`) — `{slug, collection, title, description, href, difficulty?, readingTime, publishedAt}` — confirmed to still carry **no `tags` field**, and this plan does not add one (§8).

---

## 3. Current Search Contract — Documented, Not Redesigned

| Aspect | Current behavior |
|---|---|
| Participating collections | Knowledge (`getAllArticles()`), Work (`getAllCaseStudies()`), Engineering Log (`getAllEngineeringLogEntries()`) — all three draft-filtered |
| Input query | `GET /search?q=`, trimmed server-side in `search/page.tsx` before reaching `searchContent()` |
| Matching | Case-insensitive substring test, `title` and `description` only (`matchesQuery()`, `search.ts`) |
| Normalization | `toSummary()` (Knowledge), `toCaseStudySummary()` (Work), `toEngineeringLogArticleSummary()` (Engineering Log) — all three already-exported mappers producing `ResolvedArticleSummary` |
| Grouping | By collection — three separate arrays (`SearchResults` interface), never merged into one flat list |
| Ordering | `sortByPublishedDate()`, applied per collection **before** normalization (dates are real `Date` objects pre-normalization; post-normalization `publishedAt` is an already-formatted string) |
| Empty state | No `q` → prompt paragraph, no collections read from disk. `q` present, zero matches → `"No results for '<query>'."` A collection with zero matches renders no heading (`SearchResultGroup` returns `null`) |
| Metadata | Static `title`/`description`, `robots: { index: false, follow: true }` |
| Noindex | Confirmed present, `search/page.tsx`'s own `metadata` export |

**None of this is redesigned by this plan.** Every row above stays true after implementation except the single "Matching" row, which gains one additional field (§6/§7).

---

## 4. Tag Source of Truth — Confirmed Per Collection

| Collection | Schema | Real, populated data today |
|---|---|---|
| Knowledge | `knowledgeFrontmatterSchema` extends `articleFrontmatterSchema` → `tags` present | **Yes** — all 4 real articles set it |
| Work | `workFrontmatterSchema` extends `articleFrontmatterSchema` → `tags` present | **Yes** — all 4 real case studies set it |
| Engineering Log | uses `articleFrontmatterSchema` directly → `tags` present | Schema-ready; **zero real entries** (`content/engineering-log/` still `.gitkeep` only) |

The implementation consumes `item.frontmatter.tags` directly — the exact field every one of these three schemas already validates and every one of the 8 real documents already authors. **No Tag collection, constants file, registry, or alias map is created** — direct repository evidence (§4 above, `docs/53` §4) shows the field already exists, is already populated in two of three collections, and needs no new storage.

---

## 5. Matching Semantics — Decided, Consistent With the Existing Contract

Per this task's own instruction to prefer consistency absent concrete evidence against it: **tags are matched with the identical case-insensitive substring test `title`/`description` already use**, applied per-tag.

- `"concurrency"` against a document tagged `["concurrency", ...]` → matches (exact-length substring).
- `"Concurrency"` (different case) → matches — the existing `.toLowerCase()` normalization on both sides already handles this, unchanged.
- `"curr"` against a document tagged `["concurrency", ...]` → matches — `"concurrency".includes("curr")` is `true` (confirmed by direct string inspection: `concurrency`'s characters at index 3–6 are `c-u-r-r`). Consistent with how `"curr"` would already partial-match a title/description containing "concurrency" today — no new matching behavior class introduced, only a new field it can match against.

**No fuzzy matching, stemming, ranking, tokenization, or semantic search is introduced** — the match predicate remains a plain `.includes()` call, run once more per document, against one more field.

---

## 6. Tag Matching — Individual Values, Not a Joined String

Per this task's own explicit preference: tags are matched **per individual authored value**, not by joining the array into one string first. `tags: ["security", "backend"]` is matched as: does *any* element of this array, lowercased, contain the query as a substring — `tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))`.

**Why not join-then-match, stated explicitly rather than left implicit**: joining (`tags.join(" ")` or similar) before matching would let a query span two unrelated tags' boundary — e.g., a document tagged `["ab", "cd"]` joined as `"ab cd"` would spuriously match a query like `"b c"`, a false positive with no basis in either tag's actual meaning. Per-element matching has no such failure mode, and is the smaller, more literal read of "does this document have a tag matching the query" — the question a reader is actually asking.

**Title/description matching semantics are not touched** — `matchesQuery()`'s existing two `.includes()` checks stay byte-identical; only a third, tag-array check is added to the same `||` chain (§10).

---

## 7. Result Normalization — Unchanged, No New Type

Per this task's own explicit instruction: **no `TagSearchResult` type is created.** `ResolvedArticleSummary` (`relationships.ts`) is reused exactly as shipped — a document matched via its tags produces the identical result shape a title/description match already produces, rendered by the identical, unmodified `SearchResultRow`/`SearchResultGroup` (`search-results.tsx`). A search result's tags are not displayed in the result row, are not added to `ResolvedArticleSummary`, and are not surfaced anywhere new — the only observable change is that more documents can now appear in a result set for a given query, not that any document's result *looks* different.

---

## 8. Ordering — Unchanged, No Tag-Specific Ranking

`sortByPublishedDate()` still runs once per collection, still before normalization, on the same `ContentItem[]` array `matchesQuery()` just filtered — regardless of *which* field (title, description, or now tags) caused a document to pass the filter. **A document matched only through its tags sorts into the exact same chronological position it would occupy if it had matched via title** — there is no second ranking pass, no tag-match-gets-priority rule, and no mechanism in the current architecture that could express one without new code this plan doesn't add. This is not a design choice being newly made here — it's a direct consequence of `matchesQuery()` staying a single boolean predicate: the sort step downstream has no way to know *which* clause of the `||` fired, by construction.

---

## 9. Duplicates — Prevented by Construction, No Second Layer

A document whose `title` **and** `tags` both satisfy the query is filtered exactly once: `.filter((item) => matchesQuery(...))` evaluates one boolean per item, and `matchesQuery()`'s three checks are combined with `||` — the predicate is `true` the moment *any* clause matches, and `.filter()` includes the item at most once regardless of how many clauses would have matched independently. **No second deduplication layer is added or needed** — the existing single-pass filter already has this property, and extending the `||` chain by one more clause does not change it. Confirmed by direct inspection of `matchesQuery()`'s current shape (§2) — it is not three separate matchers whose results get unioned; it is one function returning one boolean.

---

## 10. Empty / No-Match States — Unchanged

- No `q` → the existing prompt state, unchanged code path (`searchContent()` is still never called with an empty string).
- `q` present, zero matches across title, description, *and now* tags → the existing `"No results for '<query>'."` message, unchanged — `hasSearchResults()`'s own three-group-length check needs no modification, since it already tests the *output* of `searchContent()`, not which field produced it.

**No Tag-specific empty state is created.**

---

## 11. Search UI — One Justified, Minimal Copy Change; No Structural Change

Per this task's own explicit preference for **no UI change**, re-inspected directly: `search/page.tsx` states, in three separate places, that Search covers *"title and description"* / *"title or description"* — the `<title>`/`description` metadata, the `Input`'s `placeholder` attribute, and the prompt-state paragraph shown when no query has been entered. **Once tags participate in matching, all three statements become factually inaccurate** — not a completeness nitpick, but the same "honest, not fabricated" standard this codebase already holds its content to (`docs/01`'s own "Never..." list; every prior Milestone 6 empty-state ruling). This plan corrects the wording in those three copy strings only — no new element, no new component, no structural or layout change, no client behavior. `search-results.tsx` is untouched entirely (§7 — no tags are ever rendered in a result row, so nothing there needs new copy).

**Exact wording change, the smallest available**: `"...by title or description..."` → `"...by title, description, or tag..."` in each of the three locations named above.

---

## 12. SEO

`robots: { index: false, follow: true }` stays exactly as shipped. Search does not become indexable because it now matches one more field — indexability was never a function of *what* Search matches, only of whether a search-results URL should be crawled, which this plan does not reconsider. **No canonical Tag pages are created by this task.**

---

## 13. Routes

No new route. The only user-facing route involved remains `/search?q=`. `PRIMARY_NAVIGATION`, `MobileNavigation`, `lib/navigation/config.ts` are untouched — nothing about Search's entry point in Header changes (it already links to `/search`, unconditionally, since Task 6.4).

---

## 14. RSS / Sitemap

Untouched, confirmed by file manifest (§16) — `src/app/rss.xml/`, `src/lib/content/rss.ts`, `src/app/sitemap.ts` all show zero planned diff. Tags remain document metadata; they do not become RSS items or Sitemap URLs, because no Tag-specific page exists for either to point at — consistent with `docs/51` Decision 1's identical reasoning for why Series doesn't appear in either feed today.

---

## 15. Data Normalization

`docs/53` §4 already confirmed, by direct inspection of every real tag value, that **no case or spelling drift exists in the current repository's authored data**. This plan does not introduce a normalization layer, a canonicalization step, or an alias map to guard against a problem that hasn't been observed. The one normalization already in place — `.toLowerCase()` on both the query and the field being matched — is the exact mechanism `matchesQuery()` already uses for `title`/`description`; extending it to `tags` reuses that same mechanism, not a new one (§6).

---

## 16. Content Model

No schema change. `tags` already exists, already validated as `z.array(z.string()).default([])`, on all three participating collections (§4). Tags do not become a controlled vocabulary, gain an alias mechanism, or move into a dedicated collection — `docs/51` Decision 4 stays exactly as decided. This task only makes already-authored metadata searchable; it does not change what that metadata is or how it's authored.

---

## 17. Architecture — The Preferred Flow, Confirmed as the Only Flow

```text
Search page (app/search/page.tsx, copy-only change, §11)
        ↓
searchContent() (lib/content/search.ts — the one logic change, §18)
        ↓
getAllArticles() / getAllCaseStudies() / getAllEngineeringLogEntries()
   (unchanged — already real, already draft-filtered)
        ↓
toSummary() / toCaseStudySummary() / toEngineeringLogArticleSummary()
   (unchanged — already exported, already produce ResolvedArticleSummary)
        ↓
SearchResults / SearchResultGroup / SearchResultRow (unchanged, §7)
```

No second resolver, no second result type, no second UI — confirmed as the actual shape by direct re-inspection, not merely asserted as the preferred one. Only `matchesQuery()`'s own field list expands.

---

## 18. Client / Server

No `"use client"` exists on any file this plan touches or reads, and none is introduced. `GET /search?q=` remains the entire interaction mechanism — no instant filtering, no debounce, no client-side state. This plan adds server-side comparison logic only (one more `.includes()` clause, evaluated per request, per document).

---

## 19. Work Items

Derived from the code, not the suggested menu applied blindly — the actual change is small enough that WI-1 (verification) and WI-2 (implementation) are the only two substantive items; WI-3 (cross-collection verification) and WI-4 (RC review) are both verification-only and could in principle merge, but are kept separate because they test different things (WI-3: the one specific, evidenced cross-collection claim this task exists to prove; WI-4: the full regression sweep).

### WI-1 — Verify Current Contracts (no code change)

**Purpose**: confirm §2–§4's re-inspection findings hold at implementation time, not just at planning time (repositories drift between a plan's approval and its execution).

**Files:** none modified — a verification-only step.

**Acceptance criteria:** `schema.ts`'s `tags` field, `search.ts`'s current `matchesQuery()` shape, and `ResolvedArticleSummary`'s field list all match this document's §2–§4 exactly; if any has drifted, WI-2 is blocked until this document is revised, not silently implemented against stale assumptions.

---

### WI-2 — Extend Matching to Tags

**Purpose**: the one functional change this task makes.

**Files to modify:** `src/lib/content/search.ts` only.

**Exact responsibility:**

```text
// Conceptual shape — no implementation authorized by this document.
function matchesQuery(
  title: string,
  description: string,
  tags: string[],
  query: string,
): boolean {
  const normalizedQuery = query.toLowerCase();
  return (
    title.toLowerCase().includes(normalizedQuery) ||
    description.toLowerCase().includes(normalizedQuery) ||
    tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
  );
}
```

All three call sites within `searchContent()` (Knowledge, Work, Engineering Log) pass `item.frontmatter.tags` as the new third argument — the identical field, read the identical way, across all three collections, so match behavior cannot silently diverge per collection (mirroring `matchesQuery()`'s own existing docstring commitment).

**Dependencies:** WI-1.

**Acceptance criteria:** `matchesQuery()`'s two existing clauses are byte-identical to their pre-change form; the third clause uses `.some()` over individual tag values, never a joined string (§6); every one of the three `searchContent()` call sites is updated identically; `ResolvedArticleSummary`, `SearchResults`, `hasSearchResults()` are byte-identical to their pre-change form.

---

### WI-2.1 — Search Page Copy Correction

**Purpose**: the one presentation change this task makes, justified by §11's factual-accuracy finding, not bundled into WI-2 since it's a different file and a different kind of change (copy, not logic).

**Files to modify:** `src/app/search/page.tsx` only — three string literals (`metadata.description`, the `Input`'s `placeholder`, the no-query prompt paragraph).

**Dependencies:** none functionally, but sequenced after WI-2 so the copy change ships describing behavior that's actually live, not behavior still in flight.

**Acceptance criteria:** no JSX structure change, no new element, no new import; `git diff` on this file shows exactly three string-literal edits.

---

### WI-3 — Cross-Collection Discovery Verification

**Purpose**: prove, with real repository data, the one concrete claim this task exists to deliver — that a real tag can surface results across collections. Per this task's own explicit instruction: **use real repository tags, do not create fixture content, do not hard-code the verification example into the implementation.**

**Verification, not implementation:**

- Query `concurrency` (the real, already-authored tag `docs/53` §4 identified — present on `optimistic-vs-pessimistic-locking` (Knowledge), `vaultpay` (Work), and `haya` (Work)) must return all three documents, grouped correctly by collection.
- Confirm none of the three appears via title/description alone (i.e., that this specific result genuinely demonstrates tag-matching, not a coincidental title match) — a real, checkable distinction: none of the three titles or descriptions contains the substring "concurrency" (confirmed by direct re-read of all three documents' frontmatter, §4/`docs/53` §4).
- Confirm a query for a tag that exists in only one collection (e.g., `jwt`, present only on `how-jwt-works`) returns exactly one result, in the correct group, not three empty groups.

**Dependencies:** WI-2.

---

### WI-4 — Release Candidate Review

**Purpose**: the release gate, mirroring `docs/42`'s own WI-10, `docs/49`'s WI-4, `docs/52`'s WI-7.

**When it runs:** only after WI-1, WI-2, WI-2.1, WI-3 are complete.

**Verification steps** — per this task's own §24, organized identically:

**Search behavior**
1. No query still renders the prompt state.
2. A query matching only a real title still returns that result.
3. A query matching only a real description still returns that result.
4. A query matching only a real tag returns that result (§ WI-3).
5. Matching remains case-insensitive for all three fields, confirmed with a mixed-case tag query.
6. Substring semantics remain correct — a partial tag query (e.g., `curr`) still matches (§6).

**Cross-collection**
7. `concurrency` returns real results from both Knowledge and Work, grouped correctly (§ WI-3).
8. Engineering Log's code path is confirmed identical in shape to the other two (no divergent logic), even though zero real entries exist to test against today.

**Existing behavior**
9. No document appears twice in any result group.
10. Ordering within each group is still `sortByPublishedDate()`'s newest-first, unchanged by which field matched.
11. Result grouping (by collection, three sections) is unchanged.
12. Result links (`href`) are unchanged — still real, working detail-page URLs.
13. The zero-results empty state is unchanged, textually and structurally.

**Boundary**
14. No `/tags/[slug]` or `/tag/[slug]` route exists anywhere in the diff.
15. No new content collection, constants file, registry, or alias map exists anywhere in the diff.
16. No schema file shows any diff.
17. No content file shows any diff.
18. No ranking, scoring, or ordering logic beyond `sortByPublishedDate()` exists anywhere in the diff.
19. No fuzzy/semantic matching library or logic exists anywhere in the diff.
20. No `"use client"` exists anywhere in the diff.
21. `/search`'s `robots: { index: false }` is confirmed still present, unchanged.
22. `src/app/rss.xml/`, `src/lib/content/rss.ts` show zero diff.
23. `src/app/sitemap.ts` shows zero diff.

**Automated**
24. `pnpm exec eslint` clean.
25. `pnpm exec tsc --noEmit` clean.
26. `pnpm build` clean.

**Regression**
27. `/`, `/knowledge`, `/work`, `/engineering-log`, `/about`, `/search`, `/rss.xml`, `/sitemap.xml`, and an invalid URL (404) all return their expected status, unchanged.

**Git**
28. `git status --short` / `git diff --stat` / `git diff` match this document's file manifest (§20) exactly — two files, both individually justified.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 20. File Manifest

| File | New / Modified / Untouched | Work Item | Exact Reason |
|---|---|---|---|
| `src/lib/content/search.ts` | Modified | WI-2 | `matchesQuery()` gains a third clause (`tags`, per-value substring match); all three `searchContent()` call sites pass `frontmatter.tags` — the one functional change this task makes |
| `src/app/search/page.tsx` | Modified | WI-2.1 | Three copy strings corrected from "title or description" to "title, description, or tag" — a factual-accuracy fix, not a structural change (§11) |
| `src/components/search/search-results.tsx` | **Untouched** | — | No new result field is rendered (§7); the existing row/group rendering already handles a tag-matched result identically to any other |
| `src/lib/content/relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts` | **Untouched** | — | `ResolvedArticleSummary` and all three `toXSummary()` mappers stay exactly as shipped (§7) |
| `src/lib/content/articles.ts`, `case-studies.ts` | **Untouched** | — | `getAllArticles()`/`getAllCaseStudies()` already real, already draft-filtered, already read by `search.ts` unchanged |
| Any schema file | **Untouched** | — | `tags` already exists on every participating collection (§4, §16) |
| Any content file | **Untouched** | — | No content authored or edited |
| `src/lib/navigation/config.ts`, `src/components/navigation/*` | **Untouched** | — | Search's Header entry point already links to `/search` unconditionally since Task 6.4 |
| `src/app/rss.xml/`, `src/lib/content/rss.ts`, `src/app/sitemap.ts` | **Untouched** | — | §14 |

**Two files touched — the smallest footprint consistent with the one honest, evidenced copy-accuracy exception to "no UI change" (§11).** No speculative file listed; every entry's disposition is justified by direct re-inspection (§2–§4), not assumed.

---

## 21. Guardrails

Per this task's own §21 list, each confirmed to remain untouched by this plan's own file manifest (§20): `src/app/page.tsx`, `src/app/knowledge/`, `src/app/work/`, `src/app/engineering-log/`, `src/app/about/`, `src/app/not-found.tsx`, `src/app/rss.xml/`, `src/app/sitemap.ts`, `src/components/navigation/`, `src/lib/navigation/`, `src/lib/constants/`, `content/`, every schema file.

---

## 22. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | Tag matching changes existing title/description behavior | WI-2's acceptance criterion: the two existing `matchesQuery()` clauses are byte-identical; WI-4 steps 2–3 re-test both directly |
| 2 | Documents appear twice | §9's structural argument (single boolean predicate, single `.filter()` pass); WI-4 step 9 |
| 3 | Tag matching becomes ranked unexpectedly | §8's structural argument (sort runs on the same filtered `ContentItem[]`, blind to which clause matched); WI-4 step 10 |
| 4 | Search starts returning placeholder data | `search.ts` already reads `getAllArticles()`/`getAllCaseStudies()` — unchanged, still real, confirmed §2; WI-1 re-verifies at implementation time |
| 5 | Engineering Log behavior changes unexpectedly | The same, uniform `matchesQuery()` call is used for all three collections — no per-collection divergence introduced; WI-4 step 8 confirms code-path identity even with zero real data to test |
| 6 | Search becomes indexable | `robots: { index: false }` untouched by this plan's own file manifest; WI-4 step 21 |
| 7 | Tags accidentally become a new public taxonomy | No route, no new type, no new component anywhere in the manifest (§20); WI-4 steps 14–15 |
| 8 | Existing empty states change | §10's structural argument (`hasSearchResults()` untouched); WI-4 step 13 |
| 9 | Existing result ordering changes | §8; WI-4 step 10 |
| 10 | Existing result normalization changes | §7 (`ResolvedArticleSummary` and all three mappers untouched); WI-4 steps 11–12 |

---

## 23. Milestone 7 Boundary

Per this task's own §25: this plan does not implement Tag pages, Technology pages, Series routes, Reading Paths, a filtering UI, ranking, semantic search, recommendations, indexing, or analytics. It makes one already-authored, already-validated metadata field searchable through the already-shipped Search experience — nothing more.

---

## 24. Sequencing

```
WI-1 (verify current contracts)
        │
        ▼
WI-2 (extend matchesQuery to tags, search.ts)
        │
        ▼
WI-2.1 (search page copy correction)
        │
        ▼
WI-3 (cross-collection verification, real data)
        │
        ▼
WI-4 (Release Candidate Review)
```

Strictly linear — WI-2.1 depends on WI-2 landing first (so the corrected copy describes real, live behavior); WI-3 needs WI-2 complete to test against; WI-4 is last by definition.

---

## 25. Rollback Plan

Two files, both simple, independently revertable diffs — a three-clause boolean function and three string literals. No schema, content, or route change anywhere to unwind. The smallest rollback profile of any Milestone 7 task so far, tied with Task 7.1's own `work.ts`-untouched profile for simplicity.

---

## 26. Acceptance Criteria (Plan-Level)

- Every work item traces to `docs/53`'s own recommendation — no new architectural decision introduced beyond the two narrow, evidenced exceptions (per-value matching over joined-string matching, §6; the copy correction, §11).
- The cross-collection verification (WI-3) uses only real, already-authored repository data — no fixture content created.
- File manifest (§20) is exhaustive and minimal — two files, each individually justified; guardrails (§21) leave no reasonable path to a new route, schema, or content change.
- No production code, route, component, schema, or content was modified to produce this document.

---

## Summary

This plan converts `docs/53`'s recommendation into two work items landing in two files: `search.ts` gains one additional clause in its existing `matchesQuery()` predicate, matching `tags` per-value with the identical case-insensitive substring test `title`/`description` already use; `search/page.tsx` gains a three-string copy correction so its own claims about what Search covers stay accurate once tags participate. Every other file in the existing Search architecture — result normalization, the result UI, ordering, empty states, metadata, noindex — is confirmed untouched and unchanged, by direct re-inspection rather than assumption. The plan's own release gate specifically proves, with real repository data, the one concrete claim motivating this entire task: a real, already-authored tag (`concurrency`) surfaces a Knowledge article and two Work case studies together, a connection no existing page makes today. No Tag route, no Tag collection, no controlled vocabulary, no ranking, and no schema change is introduced anywhere in this plan.
