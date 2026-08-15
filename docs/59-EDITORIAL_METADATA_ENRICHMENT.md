# 59 — Editorial Metadata Enrichment: Design Proposal

## Status

Proposal — awaiting review and approval.

> No production code, content, schema, route, or component was modified to produce this document.

Task 7.6's design-stage proposal, converting `docs/58-CONTENT_EXPANSION_EDITORIAL_PLAN.md`'s two P0 recommendations — three `relatedContent` links, four `featured: true` flags — into a precise, re-verified specification.

---

## 1. The Central Finding: Four Files, Not Seven

This task's own framing expected *"3 Work Case Study MDX files"* + *"4 Knowledge article MDX files"* = 7, while explicitly cautioning not to assume filenames. Direct re-inspection this turn finds **exactly four content files change, not seven**:

- **Two of the three relationships share a single source file.** VaultPay is the source of *both* Relationship 1 (→ locking) and Relationship 2 (→ money-floating-point) — one file, one `relatedContent` array gaining two entries, not two files.
- **`relatedContent` is a source-declared, one-directional field.** A relationship's *target* document requires zero frontmatter change — the same way a hyperlink only requires editing the page that contains it, never the page it points to. Confirmed by direct re-read of every relationship resolver this session has touched (`resolveArticleReferences`, `resolveRelatedKnowledge`): none of them read or expect anything on the target side.

The four files, precisely: `content/work/vaultpay.mdx` (two relationship entries + featured), `content/work/gohunt.mdx` (one relationship entry + featured), `content/knowledge/how-jwt-works.mdx` (featured only), `content/knowledge/money-floating-point.mdx` (featured only — its status as a relationship *target* requires no change to this file). `content/knowledge/optimistic-vs-pessimistic-locking.mdx` and `content/knowledge/data-transfer-objects.mdx` are relationship targets and are **not modified at all**. This correction is carried through every section below rather than silently reconciled.

---

## 2. Re-Inspection — Current Metadata State, Verified Directly This Turn

| File | `publishedAt` | `relatedContent` (current) | `featured` (current) |
|---|---|---|---|
| `content/knowledge/data-transfer-objects.mdx` | 2026-08-12 | *(field absent in real use)* | absent (defaults `false`) |
| `content/knowledge/how-jwt-works.mdx` | 2026-08-07 | absent | absent (defaults `false`) |
| `content/knowledge/money-floating-point.mdx` | 2026-08-12 | absent | absent (defaults `false`) |
| `content/knowledge/optimistic-vs-pessimistic-locking.mdx` | 2026-08-12 | absent | absent (defaults `false`) |
| `content/work/cookeaze.mdx` | 2024-12-03 | `[]` | absent (defaults `false`) |
| `content/work/gohunt.mdx` | 2026-07-01 | `[]` | absent (defaults `false`) |
| `content/work/haya.mdx` | 2025-10-08 | `["how-jwt-works"]` | absent (defaults `false`) |
| `content/work/vaultpay.mdx` | 2026-08-01 | `[]` | absent (defaults `false`) |

`featured` is confirmed absent (not `false`, simply unwritten) in every one of the 8 real files' frontmatter — the schema default (`z.boolean().default(false)`) is doing all the work today, re-confirmed by direct grep. Filesystem order (the order `getSlugs()`/`getAllArticles()`/`getAllCaseStudies()` return before any sort, confirmed by `fs.readdirSync()` — alphabetical): Knowledge = `[data-transfer-objects, how-jwt-works, money-floating-point, optimistic-vs-pessimistic-locking]`; Work = `[cookeaze, gohunt, haya, vaultpay]`. This ordering matters precisely for the before/after prediction in §7.

---

## 3. Schema and Resolver Support — Confirmed, Not Assumed

Direct re-read of `schema.ts`, `articles.ts`, `case-studies.ts`, `relationships.ts`, `case-study-relationships.ts` this turn:

- `relatedContent: z.array(z.string()).default([])` and `featured: z.boolean().default(false)` both live on `articleFrontmatterSchema` — inherited by both `knowledgeFrontmatterSchema` and `workFrontmatterSchema` without redeclaration. Both fields already exist on every collection this task touches. No schema change is required, and none is proposed.
- `resolveRelatedKnowledge()` (`case-study-relationships.ts`) already resolves a Work document's `relatedContent` against `getAllArticles()` via the shared `resolveArticleReferences()` (`relationships.ts`) — already wired into `/work/[slug]/page.tsx`, already rendering via `RelatedKnowledge` (`components/work/`), confirmed unchanged since Task 7.3.
- `getFeaturedArticles()` (`articles.ts`) and `getFeaturedCaseStudies()` (`case-studies.ts`) both already implement featured-first-then-newest-fallback, confirmed unchanged since Task 7.1 — no code change is required for either objective.

No gap was found. Per this task's own §9 instruction, this section states that explicitly rather than proceeding past an unverified assumption: the existing implementation already supports both `relatedContent` and `featured` exactly as needed, confirmed by direct inspection, not carried forward from `docs/58`.

---

## 4. Relationship Verification — Each Re-Checked Individually

### Relationship 1 — `vaultpay` → `optimistic-vs-pessimistic-locking`

- Source slug `vaultpay` confirmed — `content/work/vaultpay.mdx` exists, real, published (no `draft` field set, defaults `false`).
- Target slug `optimistic-vs-pessimistic-locking` confirmed — `content/knowledge/optimistic-vs-pessimistic-locking.mdx` exists, real, published.
- Schema support confirmed (§3).
- Content support re-verified by direct re-read this turn: VaultPay's own "Pessimistic Locking for Concurrent Transfers" decision states that `SELECT ... FOR UPDATE` blocks a second transfer from reading a balance the first hasn't finished changing — the identical mechanism and syntax the Knowledge article's own "Pessimistic: A Row Lock" section teaches.
- Does not already exist: confirmed, `vaultpay.mdx`'s current `relatedContent` is `[]`.
- No contradictory metadata found.

### Relationship 2 — `vaultpay` → `money-floating-point`

- Source/target existence and schema support confirmed, same basis as above.
- Content support re-verified: VaultPay's "Integer Arithmetic for Money" decision states that ₦5,000 is stored as `500000`, never `5000.00` — the identical kobo/naira example and integer-representation principle the Knowledge article's own "The Fix: Represent the Smallest Unit as an Integer" section teaches, down to the same currency and numeric example.
- Does not already exist, no contradiction: confirmed — this becomes the second entry in the same `relatedContent` array as Relationship 1 (§1).

### Relationship 3 — `gohunt` → `data-transfer-objects`

- Source slug `gohunt` confirmed, real, published. Target slug `data-transfer-objects` confirmed, real, published.
- Content support re-verified: GoHunt's own "Separate DTOs for Fetched, Stored, and API-Exposed Job Data" decision names its actual types — the case study's Architecture and Engineering Decisions sections describe fetched, stored, and API-exposed job shapes as three distinct concerns — materially the same three-boundary structure (fetched / stored / exposed) the Knowledge article teaches using its own `FetchedJobDTO` / `StoredJob` / `PublicJobDTO` example.
- Does not already exist, no contradiction: confirmed, `gohunt.mdx`'s current `relatedContent` is `[]`.

No relationship from `docs/58` was found unsupported on re-verification. All three proceed exactly as proposed.

---

## 5. Relationship Direction — Resolved Explicitly

`relatedContent` is directional by construction, not by convention — confirmed by direct inspection of every resolver that touches it:

- A Work document's `relatedContent` is resolved by `resolveRelatedKnowledge()` exclusively against `getAllArticles()` (Knowledge only).
- A Knowledge document's `relatedContent` is resolved by `resolveRelated()`/`resolveArticleReferences()` exclusively against the Knowledge collection itself (same-collection only, confirmed via `relationships.ts`).

A reciprocal declaration on the Knowledge side would not merely be redundant — it would be inert. If `optimistic-vs-pessimistic-locking.mdx` declared `relatedContent: ["vaultpay"]`, no code path anywhere in this repository would ever read it: Knowledge's own relationship resolver only ever looks up slugs against `getAllArticles()`, never `getAllCaseStudies()`. This is a structural fact, not a style preference, and it settles this task's own §5 question decisively: the three relationships are declared source → target, on the Work side only, and no reverse declaration is proposed.

---

## 6. Featured Content — Four Recommendations, Re-Verified Against Current Repository

Per this task's own instruction to re-verify rather than replace `docs/58`'s picks unless evidence proves one invalid — all four re-checked directly this turn, none found invalid:

| Document | Collection | Current `featured` | Why it represents the portfolio well |
|---|---|---|---|
| `vaultpay` | Work | absent (false) | Most architecturally rigorous case study — explicit decision framework, governing rule stated as a callout, honest about what isn't yet measured |
| `gohunt` | Work | absent (false) | Clearest "real tool in daily use" narrative; independently corroborates a real Knowledge article via Relationship 3 |
| `how-jwt-works` | Knowledge | absent (false) | Most approachable entry point (beginner difficulty); its own text already cues a real next article |
| `money-floating-point` | Knowledge | absent (false) | Most approachable entry point (beginner difficulty); vivid, memorable, concrete example |

Already surfaced by fallback today? Partially, and unevenly — re-verified precisely (§7): `vaultpay` and `gohunt` already appear in the current, fallback-only Featured Case Studies output; `how-jwt-works` currently does **not** appear in Start Here's fallback output (it's the one article excluded today, being the oldest of four); `money-floating-point` currently does appear. This unevenness is exactly why explicit `featured: true` flags matter here — two of the four recommended documents are not reliably surfaced by the fallback mechanism alone.

---

## 7. Featured Semantics — Preserved Exactly, With Precise Before/After Prediction

No redefinition of `featured` is proposed. The existing algorithm (`getFeaturedArticles()`/`getFeaturedCaseStudies()`, unchanged since Task 7.1): featured items first (sorted newest-first among themselves), then non-featured items fill any remaining slots up to the limit (3), also newest-first. Computed precisely against the real dates and filesystem order in §2 — not estimated:

### Knowledge (Start Here, `/knowledge` and `/knowledge/{topic}`)

- Before (0 featured, fallback-only, limit 3): three articles share the same `publishedAt` (2026-08-12) — `data-transfer-objects`, `money-floating-point`, `optimistic-vs-pessimistic-locking` — and a stable sort preserves their filesystem order among the tie. Result: `[data-transfer-objects, money-floating-point, optimistic-vs-pessimistic-locking]`. `how-jwt-works` (2026-08-07, the only distinctly older article) is excluded today.
- After (`how-jwt-works`, `money-floating-point` featured): featured group sorted newest-first gives `[money-floating-point, how-jwt-works]` (2 items); one fallback slot remains, filled from the non-featured remainder `[data-transfer-objects, optimistic-vs-pessimistic-locking]` (tied date, filesystem order) which gives `data-transfer-objects`. Result: `[money-floating-point, how-jwt-works, data-transfer-objects]`.
- Net change: `optimistic-vs-pessimistic-locking` moves from included to excluded; `how-jwt-works` moves from excluded to included. A real, precisely predicted composition change, not merely a re-labeling.

### Work (Featured Case Studies, `/work`)

- Before (0 featured, fallback-only, limit 3): all four dates are distinct, no ties. Sorted newest-first: `vaultpay` (2026-08-01), `gohunt` (2026-07-01), `haya` (2025-10-08), `cookeaze` (2024-12-03, excluded). Result: `[vaultpay, gohunt, haya]`.
- After (`vaultpay`, `gohunt` featured): featured group sorted newest-first gives `[vaultpay, gohunt]` (2 items); one fallback slot from the non-featured remainder `[haya, cookeaze]`, newest-first, gives `haya`. Result: `[vaultpay, gohunt, haya]`.
- Net change: **none** in composition or order — the same three case studies, in the same order, appear before and after. The only change is *why* `vaultpay`/`gohunt` appear (genuine editorial curation, not incidental fallback luck). `cookeaze` remains excluded either way.

No new ranking system, no new featured collection, no change to the `limit: 3` default — confirmed unchanged in both resolvers.

---

## 8. No New Content — Confirmed Boundary

Zero new Knowledge articles, Work case studies, Engineering Log entries, Series, Reading Paths, tags, or technology values are authorized or proposed. Every value referenced in this document (slugs, dates, existing tags/technologies) already exists in the repository, re-verified in §2 and §4 — none is invented.

---

## 9. No Code Changes — Confirmed, Not Assumed

Per §3: every resolver, component, route, loader, and schema this task's objectives depend on already exists and already works, confirmed by direct inspection this turn. No gap was found requiring this task to stop and expand scope — the explicit condition this task's own §9 sets for doing so does not apply here.

---

## 10. Relationship UI Impact — Exact Path, Verified

```text
/work/vaultpay
  → Related Knowledge section (existing, unmodified)
      → Optimistic vs Pessimistic Locking   (new)
      → Why Money Should Never Use Floating Point   (new)

/work/gohunt
  → Related Knowledge section (existing, unmodified)
      → Data Transfer Objects: Why Fetched, Stored, and Exposed Data Need Different Types   (new)

/work/haya
  → Related Knowledge section (existing, unmodified)
      → How JWT Works   (unchanged — already real since before this task)
```

Resolver path, confirmed by direct read: `app/work/[slug]/page.tsx` calls `resolveRelatedKnowledge(caseStudy, knowledgeArticles)` (`case-study-relationships.ts`), which calls `resolveArticleReferences()` (`relationships.ts`), which calls `toSummary()`, rendered by the `RelatedKnowledge` component. Every step already exists, already wired, already rendering for `haya`'s one real link today — the new entries flow through the identical path, not a new one.

---

## 11. Discovery Impact

| System | Impact |
|---|---|
| Related Knowledge | 1 real relationship becomes 4 (VaultPay ×2, GoHunt ×1, Haya ×1 unchanged) |
| Related Case Studies (Task 7.3) | Unaffected — that mechanism resolves by `domain`, not `relatedContent`; no change |
| Search | Unaffected directly — `relatedContent`/`featured` are not matched fields (`docs/54`'s boundary, unchanged); `featured` status has no bearing on search result inclusion or ordering |
| Homepage | `getFeaturedArticles()` output changes (§7); Homepage's Case Studies section is unaffected — confirmed, it reads `work.ts`'s separate, untouched fixture-backed resolver (`docs/52` §8), not `case-studies.ts`'s `getFeaturedCaseStudies()` |
| `/knowledge`, `/knowledge/{topic}` (Start Here) | Composition changes exactly as predicted in §7 |
| `/work` (Featured Case Studies) | No composition change (§7) — same three case studies, now genuinely curated |
| Engineering Log | Unaffected — no Engineering Log file is touched |
| RSS, Sitemap | Unaffected — neither reads `relatedContent` or `featured`; both already read `getAllArticles()`/`getAllCaseStudies()` unfiltered by either field, confirmed unchanged since Task 7.1 and `docs/47`/`docs/49` |

No new Discovery mechanism is introduced anywhere in this document — every impact above is existing infrastructure exposing metadata that will now be present, exactly as `docs/58`/this task intend.

---

## 12. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | Incorrect source/target slug | §4 re-verifies all three by direct filename/existence check, not copied from `docs/58` unchecked |
| 2 | Relationship points to unpublished content | All four documents involved confirmed to have no `draft` field set (defaults `false`) — real, published |
| 3 | Duplicate relationship declaration | §4 confirms all three `relatedContent` arrays are currently `[]` — no duplicate risk |
| 4 | Incorrect relationship direction | §5 resolves this structurally, not by convention — reversed declarations are inert, confirmed by resolver behavior |
| 5 | Featured item ordering changes unexpectedly | §7 computes the exact before/after for both collections from real dates — no surprise expected, and the Work case's "no change" finding is itself the strongest possible regression guard |
| 6 | Fallback behavior changes unexpectedly | Fallback algorithm itself is untouched (§3); §7's predictions already account for its exact behavior |
| 7 | Unrelated content becomes featured | Exactly four documents are flagged, each individually justified (§6); no other document's frontmatter is touched |
| 8 | RSS/Sitemap changes unexpectedly | §11 confirms neither field is read by either system |
| 9 | Search behavior changes unexpectedly | §11 confirms neither field is a matched field |
| 10 | Metadata formatting breaks MDX frontmatter | §14 states the exact, minimal YAML shape for each edit; no other line in any of the four files is touched |

---

## 13. Exact File Manifest — Four Files, Corrected From This Task's Own Seven-File Assumption

| File | Change |
|---|---|
| `content/work/vaultpay.mdx` | `relatedContent: []` → `relatedContent: ["optimistic-vs-pessimistic-locking", "money-floating-point"]`; add `featured: true` |
| `content/work/gohunt.mdx` | `relatedContent: []` → `relatedContent: ["data-transfer-objects"]`; add `featured: true` |
| `content/knowledge/how-jwt-works.mdx` | Add `featured: true` |
| `content/knowledge/money-floating-point.mdx` | Add `featured: true` |

Not modified, confirmed explicitly: `content/knowledge/optimistic-vs-pessimistic-locking.mdx`, `content/knowledge/data-transfer-objects.mdx` (relationship targets — no frontmatter change required, §1), `content/work/haya.mdx` (already has its one real relationship; not among the four featured picks), `content/work/cookeaze.mdx` (not touched by this batch at all). No production code, schema, route, or component file.

---

## 14. Content Diff Expectation — Metadata-Only Boundary, Stated Precisely

Exactly two kinds of line-level change, across exactly four files:

1. `relatedContent` array value change (2 files: `vaultpay.mdx`, `gohunt.mdx`) — replacing `[]` with a populated array of already-verified real slugs.
2. `featured` line addition (4 files) — a single new `featured: true` line where the field is currently entirely absent (not `false` → `true`; absent → present, §2).

No title, description, tag, technology, topic, difficulty, status, domain, timeline, or body/prose change of any kind, anywhere. The eventual implementation's diff, per file, should be exactly one or two changed/added lines — nothing else.

---

## 15. Git Safety — Release-Gate Requirement

The eventual implementation must run `git diff -- content/` and confirm:

- Exactly the four files in §13 appear, no others.
- Within each file, only the specific field(s) named in §14 differ — confirmed by inspecting the diff's changed lines directly, not just the file list.
- No file outside `content/` appears in `git status` at all.

This is stated here as a mandatory release-gate step (§16), not merely a suggestion — the same discipline `docs/52`/`docs/54`/`docs/56` already applied to production-code diffs, extended here to content.

---

## 16. Release Gate

Relationships: all three source documents correct (§4); all three target documents correct and published (§4); all relationships supported by direct content re-verification, not assumed (§4); direction correct, source-side only (§5); no reciprocal declarations added (§5); existing `RelatedKnowledge` UI displays all three once implemented (§10).

Featured: all four approved documents flagged, none substituted (§6); Featured/Start Here behavior changes exactly as predicted in §7 — Knowledge composition changes (locking excluded, `how-jwt-works` included), Work composition stays identical; no unrelated document becomes featured (§13's exhaustive file list).

Scope: exactly four content files (§13, corrected from this task's own seven-file assumption); metadata-only changes (§14); zero code, schema, route, or component files in the diff (§3, §9).

Regression: `/`, `/knowledge`, `/work`, `/work/vaultpay`, `/work/gohunt`, `/work/haya`, `/knowledge/how-jwt-works`, `/knowledge/money-floating-point`, `/knowledge/optimistic-vs-pessimistic-locking`, `/knowledge/data-transfer-objects`, `/search`, `/rss.xml`, `/sitemap.xml`, `/engineering-log`, `/about`, and 404 — all expected to return unchanged status codes; `/work/vaultpay` and `/work/gohunt` expected to show new Related Knowledge content; `/knowledge` and `/work` expected to show the exact composition changes predicted in §7.

Automated checks: `pnpm exec tsc --noEmit`, `pnpm exec eslint`, `pnpm build` — all expected clean, since no code file is touched; running them anyway is the same verify-don't-assume discipline this document has applied throughout.

Git: `git status --short` / `git diff -- content/` must match §13 exactly (§15).

---

## 17. Final Recommendation

**APPROVED — Task 7.6 design is ready for implementation planning.**

All three relationships and all four featured recommendations survive direct re-verification against the live repository. No schema or resolver gap was found. The file manifest is corrected from seven files to four, with the reasoning made explicit rather than silently reconciled, and every consequence of that correction (§7's precise before/after predictions, §13's exact list) is carried through consistently.

---

## 18. Final Report

1. Current metadata state — §2: all 8 real documents' `relatedContent`/`featured`/`publishedAt` values, confirmed by direct grep this turn.
2. Three relationship verifications — §4: each individually re-checked (source, target, existence, publication, content support, non-duplication); none found unsupported.
3. Relationship direction decision — §5: source-side only, structurally enforced by the resolvers' own collection-scoping; reciprocal declarations would be inert, not just redundant.
4. Four Featured recommendations — §6: re-verified, none replaced; two (`vaultpay`, `gohunt`) already surface via fallback today, two (`how-jwt-works` critically, `money-floating-point` incidentally) do not reliably.
5. Featured behavior impact — §7: Knowledge composition changes precisely (locking → excluded, JWT → included); Work composition is unchanged in both membership and order.
6. Existing UI impact — §10: exact resolver-to-component path traced, already proven by Haya's one existing real link.
7. Discovery impact — §11: Related Knowledge strengthened; Related Case Studies, Search, RSS, Sitemap, Engineering Log all confirmed unaffected; Homepage's Case Studies section confirmed unaffected (separate, untouched resolver).
8. Regression risks — §12: all ten named risks from this task's own list, each with a specific verification already performed or specified.
9. Exact four-file manifest — §13: corrected from this task's own seven-file assumption, with the correction's reasoning stated explicitly (§1).
10. Metadata-only boundary — §14: exactly two kinds of line-level change, across exactly four files, nothing else.
11. Release gate — §16: relationships, featured, scope, regression, automated checks, git — all specified.
12. Confirmation: no production code, content, schema, route, or component was modified to produce this document.
