# 60 — Editorial Metadata Enrichment: Implementation Plan

## Status

Implementation Plan — translating `docs/59-EDITORIAL_METADATA_ENRICHMENT.md`'s approved four-file metadata change into an exact, line-level specification.

> This document authorizes no implementation. It is documentation only. No production source file, content file, schema, route, or component was modified to produce it.

---

## 1. Purpose

`docs/59` established, and re-verified against the live repository, that Task 7.6's objective — three `relatedContent` declarations, four `featured: true` flags — touches exactly four content files, requires zero code/schema/route change, and produces a precisely predictable before/after result. This document converts that design into work items with exact diffs, following the same file-by-file discipline `docs/52`/`docs/54`/`docs/56` already established for production code, now applied to content frontmatter.

---

## 2. Re-Confirmed Manifest — Exact Paths, Re-Verified This Turn

Re-inspected directly, not assumed from `docs/59`:

| File | Exists | Current relevant frontmatter |
|---|---|---|
| `content/work/vaultpay.mdx` | Confirmed | `relatedContent: []`, no `featured` line |
| `content/work/gohunt.mdx` | Confirmed | `relatedContent: []`, no `featured` line |
| `content/knowledge/how-jwt-works.mdx` | Confirmed | no `featured` line |
| `content/knowledge/money-floating-point.mdx` | Confirmed | no `featured` line |

No path differs from `docs/59`'s own manifest — the four-file correction (from the seven files this task's own brief initially expected) holds unchanged.

---

## 3. Relationship Direction — Restated, Not Re-Derived

Unchanged from `docs/59` §5: `relatedContent` is directional by construction — Work's own resolver (`resolveRelatedKnowledge()`) resolves exclusively against Knowledge; Knowledge's own resolver (`resolveRelated()`) resolves exclusively against Knowledge. A `Knowledge → VaultPay` declaration is not merely unnecessary — it is unreadable by any code path in this repository, since no Knowledge-side resolver ever queries `getAllCaseStudies()`. **No reciprocal declaration is planned anywhere in this document.**

---

## 4. Exact Frontmatter Diffs

Each diff shown in context, using the real current frontmatter re-confirmed in §2 — not a generic template.

### `content/work/vaultpay.mdx`

```diff
   difficulty: "advanced"
+  featured: true
   domain: "Backend Infrastructure"
   status: "In Progress"
   timeline: "Ongoing, 2026 — Phase 2 of a 6-phase roadmap"
-  relatedContent: []
+  relatedContent: ["optimistic-vs-pessimistic-locking", "money-floating-point"]
   engineeringLog: []
```

`featured` is inserted immediately after `difficulty` — matching `articleFrontmatterSchema`'s own declared field order (`difficulty` immediately precedes `featured` in `schema.ts`), the smallest-friction placement rather than an arbitrary one.

### `content/work/gohunt.mdx`

```diff
   difficulty: "intermediate"
+  featured: true
   domain: "AI Systems"
   status: "Completed"
   timeline: "2026, 28 commits to a working core loop"
-  relatedContent: []
+  relatedContent: ["data-transfer-objects"]
   engineeringLog: []
```

### `content/knowledge/how-jwt-works.mdx`

```diff
   difficulty: "beginner"
+  featured: true
```

(`featured` becomes the new last frontmatter line, immediately before the closing `---` — the schema-consistent position, and, since Knowledge frontmatter today ends at `difficulty`, also the only line added.)

### `content/knowledge/money-floating-point.mdx`

```diff
   difficulty: "beginner"
+  featured: true
```

**No other line, in any of the four files, changes.** `title`, `description`, `topic`, `tags`, `technologies`, `domain`, `status`, `timeline`, `publishedAt`, `difficulty`, `engineeringLog`, and every body/prose line are byte-identical before and after.

---

## 5. Slug Verification

Every slug used above re-verified against the real collection this turn, not assumed:

| Slug used | Resolves to | Published? |
|---|---|---|
| `optimistic-vs-pessimistic-locking` | `content/knowledge/optimistic-vs-pessimistic-locking.mdx` | Yes — no `draft` field set, defaults `false` |
| `money-floating-point` | `content/knowledge/money-floating-point.mdx` | Yes |
| `data-transfer-objects` | `content/knowledge/data-transfer-objects.mdx` | Yes |

Each value is the file's own slug (filename minus `.mdx`) — never a title, never an invented alias. `getArticleSlugs()`/`articleExists()` (`articles.ts`) resolve slugs from filenames exclusively (`docs/11`'s "URL Philosophy," unchanged since Milestone 3), so these three values are exactly what `resolveArticleReferences()` will look up.

---

## 6. Relationship Evidence — Preserved From `docs/59`, Not Re-Argued

- **VaultPay → Locking**: VaultPay's own "Pessimistic Locking for Concurrent Transfers" decision names the identical `SELECT ... FOR UPDATE` mechanism the Knowledge article's "Pessimistic: A Row Lock" section teaches.
- **VaultPay → Money**: VaultPay's own "Integer Arithmetic for Money" decision uses the identical kobo/₦5,000 example and integer-representation principle the Knowledge article's "The Fix: Represent the Smallest Unit as an Integer" section teaches.
- **GoHunt → DTO**: GoHunt's own "Separate DTOs for Fetched, Stored, and API-Exposed Job Data" decision describes the identical fetched/stored/exposed three-boundary structure the Knowledge article teaches via its own `FetchedJobDTO`/`StoredJob`/`PublicJobDTO` example.

**The implementation stays metadata-only** — none of this evidence is copied into any file's frontmatter or body; it exists only to justify the slug values in §4.

---

## 7. Featured Semantics — Resolver Behavior Reconfirmed, Before/After Restated Precisely

`getFeaturedArticles()` (`articles.ts`) / `getFeaturedCaseStudies()` (`case-studies.ts`) — unchanged since Task 7.1, re-confirmed this turn: featured items first (sorted newest-first among themselves), non-featured items fill remaining slots up to `limit: 3`, also newest-first. **No new ordering mechanism is introduced; this document only supplies new inputs to the existing algorithm.**

### Knowledge — a real composition change, restated precisely

- **Before**: `[data-transfer-objects, money-floating-point, optimistic-vs-pessimistic-locking]` (all three share `publishedAt: 2026-08-12`, tie broken by filesystem/array order). `how-jwt-works` (2026-08-07, the only distinctly older article) is excluded.
- **After**: featured group `[money-floating-point, how-jwt-works]` (2 items, sorted newest-first) + 1 fallback slot from `[data-transfer-objects, optimistic-vs-pessimistic-locking]` → `data-transfer-objects`. Result: `[money-floating-point, how-jwt-works, data-transfer-objects]`.
- **Net effect**: `optimistic-vs-pessimistic-locking` moves from included to excluded; `how-jwt-works` moves from excluded to included.

### Work — an explicit no-visible-change expectation, stated as a regression baseline, not an oversight

- **Before**: `[vaultpay, gohunt, haya]` (all four dates distinct, no ties; `cookeaze` excluded as oldest).
- **After**: featured group `[vaultpay, gohunt]` + 1 fallback slot from `[haya, cookeaze]` → `haya`. Result: `[vaultpay, gohunt, haya]` — **identical composition and order.**
- **This is the expected, correct outcome, not a sign the change did nothing** — the editorial state becomes explicit and durable (no longer dependent on `vaultpay`/`gohunt` staying the two newest case studies) even though today's rendered output doesn't move. WI-4 verifies this exact "no visible change" result rather than treating any Work-landing diff as automatically suspicious.

---

## 8. Exact Featured Files — Individually Justified, Re-Confirmed

| Document | Current `featured` | Reason selected (§6, `docs/59`) | Expected UI effect |
|---|---|---|---|
| `vaultpay` | absent (false) | Most architecturally rigorous case study | No visible change (§7) — becomes genuinely curated |
| `gohunt` | absent (false) | Clearest "real tool in daily use" narrative; corroborates Relationship 3 | No visible change (§7) — becomes genuinely curated |
| `how-jwt-works` | absent (false) | Most approachable Knowledge entry point; cues a real next article | Newly included in Start Here (§7) |
| `money-floating-point` | absent (false) | Most approachable Knowledge entry point; vivid, memorable example | Stays included, now for editorial reasons instead of date-fallback |

No substitution from `docs/59`'s four picks — none was found invalid on this turn's re-inspection.

---

## 9. No New Content — Confirmed Boundary

Zero new articles, case studies, Engineering Log entries, tags, technologies, or relationships beyond the three named in §4/§6. Every value this plan specifies (three slugs, four `featured: true` lines) already exists as a real, re-verified fact about the repository (§5).

---

## 10. No Production Code — Confirmed, Not Assumed

Re-confirmed this turn, matching `docs/59` §3/§9: `articles.ts`, `case-studies.ts`, `relationships.ts`, `case-study-relationships.ts`, every Homepage/Knowledge/Work component, every route, every schema file already support both `relatedContent` and `featured` exactly as needed. **No blocker was found.** Per this task's own §10 instruction, this is stated explicitly rather than silently assumed — the condition that would require stopping and documenting a gap instead of proceeding does not apply here.

---

## 11. Expected UI Impact — Exact Path, Re-Traced

```text
/work/vaultpay
  → Related Knowledge (existing component, unmodified)
      → Optimistic vs Pessimistic Locking   (new)
      → Why Money Should Never Use Floating Point   (new)

/work/gohunt
  → Related Knowledge (existing component, unmodified)
      → Data Transfer Objects: Why Fetched, Stored, and Exposed Data Need Different Types   (new)

/knowledge (Start Here)
  → composition changes exactly per §7's Knowledge prediction

/work (Featured Case Studies)
  → composition and order unchanged — §7's Work prediction
```

Resolver path unchanged: `app/work/[slug]/page.tsx` → `resolveRelatedKnowledge()` → `resolveArticleReferences()` → `toSummary()` → `RelatedKnowledge`. No UI file is modified to produce this document or by the eventual implementation.

---

## 12. Empty / Existing Relationship Behavior

No new relationship component or empty-state logic is required — confirmed, `RelatedKnowledge`'s existing `items.length === 0 → null` guard and the route's existing `length > 0 ? <Component/> : undefined` pattern already handle every case these three new entries can produce. **No duplicate-link risk**: `optimistic-vs-pessimistic-locking`, `money-floating-point`, and `data-transfer-objects` are not reachable from VaultPay or GoHunt through any other relationship mechanism today (Related Case Studies resolves Work↔Work only; no Knowledge article currently links back) — confirmed by direct check, not assumed.

---

## 13. Ordering

No ordering logic is introduced. Related Knowledge preserves `resolveArticleReferences()`'s existing "authored array order" behavior — VaultPay's two entries render in the order written in `relatedContent` (locking, then money — §4's diff order), a deliberate, stated choice (locking is the more directly transaction-adjacent decision in VaultPay's own Engineering Decisions ordering, mirroring the case study's own section sequence), not left to chance. Featured ordering reuses the existing, unmodified algorithm (§7).

---

## 14. Draft Handling

All three relationship targets and all four featured documents are re-confirmed published (no `draft` field set, defaulting `false`, §5/§2). `getAllArticles()`/`getAllCaseStudies()` remain the draft-filtering authority — unchanged, not touched by this plan. No draft-related frontmatter is added anywhere.

---

## 15. File Diff Boundary

| File | Only these fields change |
|---|---|
| `vaultpay.mdx` | `relatedContent`; `featured` (new line) |
| `gohunt.mdx` | `relatedContent`; `featured` (new line) |
| `how-jwt-works.mdx` | `featured` (new line) |
| `money-floating-point.mdx` | `featured` (new line) |

No title, description, topic, tags, technologies, domain, status, timeline, difficulty, `publishedAt`, `engineeringLog`, or body/prose line changes anywhere, in any file. No file outside this table is touched.

---

## 16. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | Incorrect Knowledge slug | §5 re-verifies all three against real filenames this turn |
| 2 | Wrong relationship direction | §3 — structurally impossible to get backwards given the diff shape (arrays added only to Work files) |
| 3 | Reciprocal relationship accidentally added | §3 explicit guardrail; WI-4 confirms zero diff on the two target Knowledge files' `relatedContent` (they have none to begin with) |
| 4 | Unpublished target | §5/§14 — all three confirmed published |
| 5 | Malformed frontmatter | §4's diffs are exact, minimal, YAML-valid; WI-4 runs `pnpm build` (which parses every frontmatter file) as a hard verification |
| 6 | Unrelated metadata changed | §15's exhaustive per-file field list |
| 7 | Knowledge Featured ordering unexpectedly changes | §7 states the exact predicted before/after; any other result is the regression |
| 8 | Work Featured composition unexpectedly changes | §7 states "no visible change" as the expected, correct result — any composition change *is* the regression here |
| 9 | Existing relationships disappear | Haya's own `relatedContent: ["how-jwt-works"]` is not in the diff boundary (§15) — untouched |
| 10 | Duplicate Related Knowledge links | §12 — no overlap with any existing relationship mechanism, confirmed |
| 11 | RSS output unexpectedly changes | Neither `relatedContent` nor `featured` is read by `rss.ts`, confirmed unchanged since `docs/47` |
| 12 | Sitemap output unexpectedly changes | Neither field is read by `sitemap.ts`, confirmed unchanged since `docs/49` |
| 13 | Search behavior changes | Neither field is a matched field (`docs/54`'s boundary) |
| 14 | Unrelated content files modified | WI-4's `git diff -- content/` step checks the complete file list, not just the four expected ones |

---

## 17. Work Items

Derived from the repository, not the suggested menu applied blindly — in this case the suggested WI-1 through WI-4 sequence already matches what the evidence supports, so it's kept as-is rather than reshuffled for its own sake.

### WI-1 — Verify Exact Content/Slug/Frontmatter Contracts

**Purpose**: confirm §2/§4/§5's re-inspection findings still hold at implementation time (content can drift between a plan's approval and its execution, the same caution every prior implementation plan in this series has applied).

**Files:** none modified — verification only.

**Acceptance criteria:** the four files' current frontmatter matches §2 exactly; the three target slugs still resolve to real, published files; if any has drifted, WI-2/WI-3 are blocked until this document is revised, not silently implemented against stale assumptions.

### WI-2 — Add Three `relatedContent` Declarations

**Files to modify:** `content/work/vaultpay.mdx`, `content/work/gohunt.mdx`.

**Exact change:** per §4's diffs — `relatedContent: []` → the specified populated arrays, in the specified order (§13).

**Dependencies:** WI-1.

**Acceptance criteria:** exactly two files change; `relatedContent` is the only field affected in each; values are exactly the three re-verified slugs (§5); no reciprocal declaration is added to any Knowledge file.

### WI-3 — Add Four `featured: true` Flags

**Files to modify:** `content/work/vaultpay.mdx`, `content/work/gohunt.mdx`, `content/knowledge/how-jwt-works.mdx`, `content/knowledge/money-floating-point.mdx`.

**Exact change:** per §4's diffs — one new `featured: true` line per file, positioned immediately after `difficulty` (§4's own placement rationale).

**Dependencies:** WI-1. (Independent of WI-2 in principle — both land in `vaultpay.mdx`/`gohunt.mdx` but touch different fields — sequenced after WI-2 only so both Work files' diffs can be verified together in one pass rather than two.)

**Acceptance criteria:** exactly four files carry the new line; no other line in any file changes; the two Knowledge files show a one-line diff each; the two Work files' `featured` addition is the second of that file's two changes (alongside WI-2's `relatedContent` change).

### WI-4 — Release Candidate Review

**Purpose**: the release gate, mirroring `docs/52`'s WI-7, `docs/54`'s WI-4, `docs/56`'s WI-5 — now applied to a content-only change.

**When it runs:** only after WI-1 through WI-3 are complete.

**Verification steps:**

**Metadata**
1. Exactly four content files changed — confirmed via `git status --short` / `git diff --stat`.
2. Exactly three `relatedContent` entries added, across two files, matching §4 exactly.
3. Exactly four `featured: true` flags added, matching §8 exactly.
4. No other frontmatter field changed in any of the four files (§15).
5. No body/prose content changed in any of the four files.

**Relationships**
6. `/work/vaultpay` resolves and renders both `optimistic-vs-pessimistic-locking` and `money-floating-point` in Related Knowledge.
7. `/work/gohunt` resolves and renders `data-transfer-objects` in Related Knowledge.
8. All three targets confirmed published, reachable, correct titles/links.
9. No reciprocal declaration exists on any Knowledge file.

**UI**
10. VaultPay's detail page shows both new Related Knowledge items, correctly ordered (§13).
11. GoHunt's detail page shows the new Related Knowledge item.
12. `/knowledge` Start Here composition matches §7's predicted after-state exactly: `[money-floating-point, how-jwt-works, data-transfer-objects]`.
13. `/work` Featured Case Studies composition and order match §7's predicted (unchanged) state exactly: `[vaultpay, gohunt, haya]`.

**Regression**
14. `/`, `/knowledge`, `/knowledge/how-jwt-works`, `/knowledge/money-floating-point`, `/work`, `/work/vaultpay`, `/work/gohunt`, `/engineering-log`, `/search`, `/rss.xml`, `/sitemap.xml`, `/about`, and an invalid route — all return expected status codes.

**Automated**
15. `pnpm exec eslint` clean.
16. `pnpm exec tsc --noEmit` clean.
17. `pnpm build` clean (also the practical MDX-frontmatter-validity check per risk #5).

**Git**
18. `git status --short` shows only the four files in §2/§15.
19. `git diff -- content/` shows only the field-level changes specified in §15 — no unexpected line anywhere.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 18. Sequencing

```
WI-1 (verify current contracts)
        │
        ▼
WI-2 (relatedContent, 2 files)
        │
        ▼
WI-3 (featured, 4 files — 2 overlap with WI-2's files)
        │
        ▼
WI-4 (Release Candidate Review)
```

Strictly linear. WI-2 and WI-3 could in principle run in parallel (different fields, no dependency between them), but are sequenced so `vaultpay.mdx`/`gohunt.mdx` each receive both their changes in one reviewable pass rather than two separate touches to the same file.

---

## 19. Guardrails

All production source code, all components, all routes, all schemas, all other content files, Search, RSS, Sitemap, navigation, and every `docs/` file other than this one — confirmed untouched by this plan's own scope (§10, §16 risk #14's own verification step). No file is created by this plan except `docs/60-EDITORIAL_METADATA_ENRICHMENT_IMPLEMENTATION_PLAN.md` itself.

---

## 20. Rollback Plan

Four content files, each a one-or-two-line frontmatter diff — the simplest possible rollback profile in this entire milestone: reverting is deleting the added lines / restoring the original `relatedContent: []` values, with zero cross-file cleanup, zero schema/route/component involvement.

---

## 21. Acceptance Criteria (Plan-Level)

- Every diff in §4 is exact, minimal, and traceable to `docs/59`'s own re-verified evidence — no new relationship or featured pick is introduced beyond what was already approved.
- The manifest (§2) and diff boundary (§15) are exhaustive; no file outside the four is authorized for change.
- The Work "no visible change" expectation (§7/§16 risk #8) is stated as the correct outcome in advance, not discovered as a surprise during review.
- No production code, content, schema, route, or component was modified to produce this document.

---

## Summary

This plan converts `docs/59`'s approved design into four work items landing in exactly four content files — two `relatedContent` array populations (VaultPay gaining two entries, GoHunt gaining one) and four `featured: true` line additions, every value re-verified against the live repository this turn rather than copied forward. No code, schema, route, or component changes are required or proposed anywhere — confirmed, not assumed. The plan states its own most counterintuitive expected result plainly rather than treating it as a risk to discover later: Work's Featured Case Studies output will not visibly change at all, because `vaultpay` and `gohunt` already surface through the existing newest-first fallback — the four-flag change makes that curation genuine and durable without moving anything a reader currently sees. Knowledge's Start Here output does change, precisely as predicted: `optimistic-vs-pessimistic-locking` exits, `how-jwt-works` enters. The release gate (WI-4) verifies both outcomes exactly as stated, alongside a `git diff -- content/` check confirming the diff touches nothing beyond the four approved files and their approved fields. No production code, content, schema, route, or component was modified to produce this document.
