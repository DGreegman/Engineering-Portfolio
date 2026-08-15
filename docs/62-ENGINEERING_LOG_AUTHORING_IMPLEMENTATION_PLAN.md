# 62 — Engineering Log Authoring: Implementation Plan

## Status

Implementation Plan — translating `docs/61-ENGINEERING_LOG_EDITORIAL_PLAN.md`'s approved candidate analysis into an exact, authoring-ready specification.

> This document authorizes no implementation. It is documentation only. No `.mdx` file, existing content, schema, route, component, resolver, or navigation file was created or modified to produce it.

---

## 1. Recommended Implementation Batch: E3 Only

Per this task's own instruction to prefer the smallest meaningful batch, not assume all candidates ship together: **this implementation pass authors E3 alone.** E4 and E2 are fully specified below (§4, §5) as ready, evidence-complete contracts for a *subsequent* pass — not executed here.

**Why E3 alone is the smallest *meaningful* batch, not merely the smallest possible one:**

- E3's own source material is strong enough to exercise the **entire** never-before-real Engineering Log experience in one pass: index population, detail-page rendering, chronology with a single real entry (both Previous/Next sides `null` — an unambiguous state to verify), Related Work in *both* directions simultaneously (§8's finding), Search matching, Tag reuse, RSS inclusion, Sitemap inclusion. Nothing about this system has ever been exercised against real content — E3 alone is sufficient to prove all of it.
- Authoring E4 or E2 in the same pass multiplies the verification surface (two new content files, two Work-file edits, two sets of new-tag decisions) before confirming E3's own path works cleanly end-to-end. If anything is subtly wrong with an edge case (e.g., the empty-Related-Knowledge state, single-entry chronology), it is cleaner to find and fix that against one new item, not two.
- `docs/61` §18's own staged recommendation used sequential language ("E3 first," "E4 second") — consistent with, not contradicted by, treating this as one candidate per implementation pass rather than a bundled batch.

---

## 2. Critical Architectural Rule — Restated, Not Reargued

`docs/37` explicitly rejected a fixed Case Study-style structure for Engineering Log entries. This plan does not impose Context/Problem/Decision/Result headings, does not reuse `ProjectHeader`/`DocumentHeader` patterns, does not reproduce Haya's or Cookeaze's case study content, and does not mechanically convert every Work section into a Log section. Each contract below (§4–§6) proposes a light, source-observed narrative shape, stated as description of what the evidence naturally supports, not a mandate.

---

## 3. E3 Implementation Contract — Haya Invitation-Gate Removal

**Re-verified directly this turn** against `content/work/haya.mdx`'s actual current "Project Evolution" section (unmodified since its original commit, confirmed by `git log`):

- **Evidence sections**: "Project Evolution" — Initial State, Problem/Pressure, Engineering Decision, Change, Observed Result, New Understanding (all six sub-sections present and complete, re-confirmed).
- **Engineering event**: Haya launched behind a closed, invitation-only beta gate, plus a per-analysis Solana/USDC micropayment beyond the free quota.
- **Problem**: an invitation gate solves "who can sign up," not "how much can a signed-up account consume" — the product's real constraint shifted from the first question to the second as it matured past closed beta.
- **Decision**: remove the invitation gate entirely — not pause it — and replace it with tiered subscriptions (Free/Starter/Growth/Scale), free-tier usage protected by quotas and device-fingerprint abuse detection instead of a signup wall; fold the existing per-analysis Solana micropayment into the same subscription checkout flow.
- **Change**: every route and UI surface referencing the invitation code (register/login forms, the OAuth redirect's carried state, the beta-gate redirect) was removed, specifically so no half-migrated state could linger.
- **Result**: the subscription checkout flow was verified end-to-end against a live server with a real signed on-chain USDC transaction; the underlying payment-verification code was hardened afterward as a direct consequence of that exercise (this is also E2's own origin point, confirmed — the two candidates are causally linked in the source material, not independently invented).
- **Lesson**: already stated by the author, as a `<Callout type="key-insight">` — *"An access-control mechanism is not a permanent architectural commitment — it's a decision scoped to the problem the product actually has right now."*

**Directly restructurable, no new facts needed**: the entire event, problem, decision, change, result, and lesson.

**Requires user confirmation**: exact `publishedAt` date (bounded by Haya's own stated range, October 2025 – ongoing 2026 — no more precise date is stated anywhere in the source); the author's own first-person voice.

### Proposed metadata

| Field | Value |
|---|---|
| Title | *"Removing Haya's Invitation Gate"* |
| Slug | `haya-invitation-gate-removal` |
| Description | *"Haya's invitation-only beta gate solved sign-up control, not usage control — removed entirely once the product needed metered access control instead, replaced by tiered subscriptions and device-fingerprint abuse detection."* |
| Tags | `platform` (existing — already a real Haya tag), `access-control` (**new** — flagged explicitly below, not silently introduced) |
| `relatedContent` (Related Knowledge) | none — §9 |
| `publishedAt` | **requires user confirmation**, within October 2025 – 2026 |
| `draft` | omitted (defaults `false`) — this entry is intended for real publication, not left in draft |

**New tag flagged explicitly**: `access-control` does not exist anywhere in the current tag vocabulary. Introducing it is a small, low-risk editorial decision (tags remain free-form per `docs/51` Decision 4 — no schema change, no validation to satisfy) but is named here as a conscious choice for whoever approves this plan to accept, not smuggled in as if it were a reuse of an existing value.

### Proposed natural narrative shape (observed, not imposed)

Derived directly from the source's own sequence, not a template: *why the invitation gate stopped being the right tool* → *what replaced it, and why the removal was total rather than partial* → *what the exercise proved, and what it changed elsewhere* → *the general lesson, in the author's own words*. This mirrors the *order* Haya's own "Project Evolution" section already uses — restructuring, per §12, not new synthesis.

**Content length**: no arbitrary target. The source material honestly supports several real paragraphs (problem framing, the decision and why it was total rather than partial, the verification result, the lesson) — a short, evidence-complete entry is preferred over padding it to match Work's own longer case-study length, which this format is deliberately not trying to match (§2).

---

## 4. E4 Implementation Contract — Cookeaze Webhook Reliability Gap (Next Pass, Not This One)

**Re-verified directly this turn** against `content/work/cookeaze.mdx`, unmodified since its original commit:

- **Evidence sections**: Problem, Investigation, Architecture, Engineering Decisions ("A Self-Chaining Celery Poll as a Webhook Fallback"), Challenges Encountered, Outcome, Lessons Learned — all six independently corroborate the same event, re-confirmed present.
- **Engineering event**: the original design trusted the payment provider's webhook as the sole signal a transaction completed.
- **Problem**: webhooks are not guaranteed delivery — occasional real payments completed on Paystack's side without ever being reflected in the platform.
- **Rejected alternative, confirmed directly in "Investigation"**: a user-initiated "check my payment status" button — rejected because it depends on the user noticing and acting, exactly the failure mode (a webhook silently never arriving) it would need to cover.
- **Decision/change**: a self-chaining Celery polling task, re-queuing itself with backoff, independent of whether the webhook ever arrives; idempotent resolution keyed on a unique transaction reference so the webhook and poller can safely race.
- **Result**: live in production, directly closing the specific gap (webhook-only trust) an earlier version had.
- **Lesson, already stated as a callout**: *"A third-party webhook is a hint that something happened, not a guarantee."*

**Directly restructurable, no new facts needed**: the entire event, the rejected alternative, the decision, and the result.

**Requires user confirmation**: exact `publishedAt` date (bounded by Cookeaze's own stated range, December 2024 – ongoing 2026); how many/which real payments were affected before the fix (the source does not quantify this, and this plan does not estimate one — §12 Forbidden).

### Proposed metadata

| Field | Value |
|---|---|
| Title | *"The Webhook That Wasn't Enough"* |
| Slug | `cookeaze-webhook-reliability-gap` |
| Description | *"Cookeaze's payment system trusted a webhook as its only signal that a transaction completed — until real payments went unrecorded because the webhook never arrived, and a self-chaining poller closed the gap."* |
| Tags | `payments` (existing — already a real Cookeaze tag); `webhooks`, `reliability` (**new**, flagged) |
| `relatedContent` | none — §9 |
| `publishedAt` | requires user confirmation, within December 2024 – 2026 |

**Not executed in this implementation pass** — specified here so the next pass has a ready, re-verified contract, per §1's batch decision.

---

## 5. E2 Implementation Contract — Haya Solana RPC Verification Hardening (Deferred to a Later Pass)

**Re-verified directly this turn**, corroborated across "Challenges Encountered" and "Project Evolution → Observed Result":

- **Problem**: the original single-attempt Solana payment verification wasn't resilient enough under real-world RPC flakiness.
- **Decision/change**: retry/backoff on RPC calls, a `PENDING` intermediate state, and the activation step wrapped in a database transaction.
- **Result**: verified end-to-end against a live server with a real signed on-chain USDC transaction.
- **Missing factual detail**: exact retry/backoff parameters (attempt count, delay curve) are not stated anywhere in the source.

### Proposed metadata

| Field | Value |
|---|---|
| Title | *"When a Single Verification Attempt Wasn't Enough"* |
| Slug | `haya-solana-rpc-verification-hardening` |
| Description | *"Haya's original single-attempt Solana payment verification wasn't resilient enough under real RPC flakiness — hardened with retry/backoff, a PENDING intermediate state, and a transactional activation step."* |
| Tags | `payments`, `concurrency` (existing — both already real Haya tags); `reliability` (new, flagged) |
| `relatedContent` | none — §9 |
| `publishedAt` | requires user confirmation, within October 2025 – 2026 |

**Recommendation: deliberately deferred, not this pass or the immediate next one.** Per `docs/61` §18's own staged sequencing (E3 → E4 → E2), and per §8 below's confirmation that Haya can safely carry more than one Engineering Log entry whenever this is authored — the deferral is about sequencing (avoiding two of the first three entries coming from the same project), not a schema or evidence limitation.

---

## 6. E1 — Confirmation Boundary, Not an Authoring Contract

Per this task's own explicit instruction: **no implementation path is created for E1.** What the repository proves: headless Chromium required real container-level tuning inside Docker (shared memory, sandboxing flags), categorically named, not itemized. What's missing: the exact flags/configuration actually used; whether a specific failure was observed first or the need was anticipated; confirmation the fix fully resolved the issue. **E1 requires user confirmation of this concrete detail before any authoring contract can responsibly be written** — this plan does not propose a title, slug, or description for it, to avoid implying readiness that doesn't exist.

---

## 7. Engineering Log Schema and Frontmatter Contract — Re-Verified

Direct re-read of `schema.ts`, `engineering-logs.ts`, `LogEntryHeader` this turn:

- **Collection schema**: `articleFrontmatterSchema` directly (no dedicated `EngineeringLogFrontmatter` type) — `title: string`, `description: string`, `publishedAt: coerced date`, `updatedAt?: date`, `tags: string[]` (default `[]`), `technologies: string[]` (default `[]`), `difficulty?: enum`, `featured: boolean` (default `false`), `draft: boolean` (default `false`), `coverImage?: string`, `prerequisites: string[]` (default `[]`), `relatedContent: string[]` (default `[]`), `series?: string`, `seriesOrder?: number`, `author?: string`.
- **Rendered by `LogEntryHeader`**: `title`, `description`, `publishedAt`, `tags` only — confirmed, unchanged since Task 6.2.
- **Not required for a real entry to function**: `topic` (doesn't exist on this schema at all), `difficulty`, `technologies`, `featured`, `series`/`seriesOrder`, `author`, `coverImage` — all present in the schema but none is load-bearing for this collection's actual reading experience.
- **Slug convention**: filename minus `.mdx`, kebab-case, matching every other collection — confirmed by `getSlugs()`'s filename-derived behavior, unchanged since Milestone 3.
- **Draft behavior**: `filterDrafts()` excludes any entry with `draft: true` from every real resolver (`getAllEngineeringLogEntries()`, Search, RSS, Sitemap) — confirmed unchanged.

No field is invented anywhere in this plan's proposed contracts (§3–§5) — every field named already exists in the schema exactly as used.

---

## 8. Engineering Log → Work Relationship — Implementation, With a New Finding

Per `docs/61`'s own critical finding, re-verified this turn with one addition: the relationship is authored entirely on the **Work** side, via `WorkFrontmatter.engineeringLog: string[]`.

**New finding this turn, not stated in `docs/61`**: `resolveRelatedEngineeringLogs()` (`case-study-relationships.ts`, the Work→Log direction, powering Haya's own "Related Engineering Logs" section) and `resolveRelatedWorkForLog()` (`engineering-logs.ts`, the Log→Work direction, powering the new entry's own "Related Work" section) **both read the identical `caseStudy.frontmatter.engineeringLog` array** — confirmed by direct grep of both functions this turn. **One frontmatter edit activates both UI directions simultaneously.** This is worth stating precisely rather than only verifying the direction `docs/61` already emphasized: editing `haya.mdx`'s `engineeringLog` array doesn't just make the new entry discoverable *from* Haya — it also makes Haya's own, already-built "Related Engineering Logs" section (currently rendering nothing, since the array is empty) start rendering the new entry, for the first time since Task 5.3 shipped that section.

**Cardinality, re-confirmed**: `engineeringLog: z.array(z.string()).default([])` is an unconstrained array — nothing in the schema, either resolver, or any component enforces one-to-one. **Multiple logs on Haya are already supported without any change**, confirmed directly, not assumed — relevant for a future pass that adds E2 alongside E3, both targeting Haya.

### Exact companion edit for E3 (this pass)

`content/work/haya.mdx`:

```diff
-engineeringLog: []
+engineeringLog: ["haya-invitation-gate-removal"]
```

The one-line array value is the only change to this file — no other field.

---

## 9. Related Knowledge — Confirmed Empty, Not Filled

Per `docs/61` §11, re-verified this turn against the same four real Knowledge articles: no legitimate target exists for E3 (its real conceptual link is to the not-yet-written "Authorization" article), E4 (its real link is to the not-yet-written "Idempotency" article), or E2. **No `relatedContent` value is proposed for any candidate in this plan.** This is a deliberate empty state, not an oversight — consistent with `docs/37`'s own "empty is a valid state" discipline already applied everywhere else in this codebase.

---

## 10. Tags — Final Recommendation

| Log | Reused (existing) | New (flagged, requires conscious acceptance) |
|---|---|---|
| E3 (this pass) | `platform` | `access-control` |
| E4 (next pass) | `payments` | `webhooks`, `reliability` |
| E2 (deferred pass) | `payments`, `concurrency` | `reliability` |

No unrelated tag value anywhere in the repository is modified by this plan. `reliability` appears as a candidate new tag for both E4 and E2 — worth noting for whoever authors the later passes, since introducing it once and reusing it the second time is more consistent than treating it as two separate "new tag" decisions.

---

## 11. Publication Dates

No date is invented anywhere in this plan. E3's `publishedAt` requires user confirmation within Haya's own stated range (October 2025 – 2026); the same applies to E2 within the same range, and to E4 within Cookeaze's own stated range (December 2024 – 2026). No date is derived from file modification timestamps, commit history, or any other unrelated metadata — confirmed, this plan does not attempt that shortcut anywhere.

---

## 12. Content Authoring Boundary — Applied to E3

- **Directly reusable**: the invitation gate's existence and purpose; the problem (sign-up control vs. usage control); the decision (full removal, tiered subscriptions, device-fingerprint detection); the change (every referencing route/UI surface removed); the result (live, signed on-chain verification); the lesson (the author's own callout).
- **Editorial restructuring**: reordering/rephrasing the above into first-person Engineering Log voice, without adding a new factual claim.
- **Requires user confirmation**: exact `publishedAt` date; the author's own voice/tone choices beyond what's already written.
- **Forbidden, and not attempted anywhere in this plan**: any specific metric (how many users were on the invitation list, how long the beta ran), any named individual or team discussion, any claim about business impact beyond what the source states.

---

## 13. Log Structure — E3's Natural Arc, Not a Template

Restated from §3: *why the gate stopped working* → *what replaced it and why the removal was total* → *what the exercise proved* → *the lesson*. This is the order the source material itself already uses in "Project Evolution" — this plan observes and preserves that order; it does not impose a different one, and does not add headings the source doesn't already imply.

---

## 14. Titles, Descriptions, Slugs — Summary

| Log | Title | Slug | Description grounded in source? |
|---|---|---|---|
| E3 | "Removing Haya's Invitation Gate" | `haya-invitation-gate-removal` | Yes — every clause traces to a quoted sentence (§3) |
| E4 | "The Webhook That Wasn't Enough" | `cookeaze-webhook-reliability-gap` | Yes (§4) |
| E2 | "When a Single Verification Attempt Wasn't Enough" | `haya-solana-rpc-verification-hardening` | Yes (§5) |

No generic title ("Working on Haya," "Building Cookeaze") is used anywhere — every title names the specific engineering event, per this task's own explicit instruction. All three slugs verified unique against the current (empty) `content/engineering-log/` directory and against every other collection's real slugs — no conflict.

---

## 15. Exact File Manifest — E3 Only

| File | New/Modified | Change |
|---|---|---|
| `content/engineering-log/haya-invitation-gate-removal.mdx` | **New** | Full entry per §3's contract |
| `content/work/haya.mdx` | Modified | `engineeringLog: []` → `engineeringLog: ["haya-invitation-gate-removal"]` (§8) — the only line changed |

**Two files.** No Knowledge file, no schema file, no route, no component, no resolver, no other Work file (`cookeaze.mdx`, `vaultpay.mdx`, `gohunt.mdx`) is touched by this pass.

---

## 16. Guardrails

Per this task's own §18 list, each confirmed to remain untouched by this plan's own scope: Knowledge articles, Knowledge/Work/Engineering-Log schemas, routes, components, resolvers, Search, RSS, Sitemap, navigation. **No pre-existing architectural gap was found during this planning pass** — §7/§8's re-verification confirms the schema and both relationship resolvers already support everything this plan proposes, exactly as needed. Per this task's own explicit condition, this is stated plainly rather than silently assumed.

---

## 17. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | Invalid Engineering Log frontmatter | `pnpm build` parses every frontmatter file against the real Zod schema — the practical validity check |
| 2 | Duplicate slug | §14 confirms `haya-invitation-gate-removal` is unique against the (empty) collection and every other real slug |
| 3 | Incorrect Work → Log relationship | §8's exact one-line diff, verified against the real schema field name and array shape |
| 4 | Multiple logs on the same Work item mishandled | §8 confirms the schema and both resolvers already support this without change — not a risk for this E3-only pass, but pre-verified for the future E2 pass |
| 5 | Missing Work relationship | §15's two-file manifest explicitly includes the `haya.mdx` companion edit — not forgotten |
| 6 | Incorrect tag | §10's table traces each tag to either existing real usage or an explicitly flagged new value |
| 7 | Fabricated date | §11 — no date is invented; `publishedAt` is explicitly marked as requiring user input before the entry can be finalized |
| 8 | Fabricated engineering claim | §12's boundary — every reusable fact traces to a quoted source sentence (§3) |
| 9 | Accidental Case Study duplication | §2/§13 — the proposed narrative arc is a restructured, shorter account, not a copy of Haya's own case-study prose |
| 10 | Related Knowledge incorrectly added | §9 — explicitly left empty, re-verified, not filled speculatively |
| 11 | Previous/Next chronology | With exactly one real entry, both sides render `null` — the expected, honest state, not a bug |
| 12 | Engineering Log listing order | `sortByPublishedDate()`, unchanged — trivially correct with one entry |
| 13 | Work detail Related Engineering Logs | §8's new finding — the same one-line edit activates this section on Haya's own detail page; explicitly tested in the release gate (§20), not assumed |
| 14 | RSS inclusion | Unchanged `rss.ts` already reads `getAllEngineeringLogEntries()` — the new entry becomes real, included content automatically |
| 15 | Sitemap inclusion | Same reasoning, `sitemap.ts` |
| 16 | Search inclusion | `search.ts` already reads `getAllEngineeringLogEntries()` and matches `title`/`description`/`tags` — the new entry becomes matchable automatically |
| 17 | Existing Work behavior regression | Only `haya.mdx`'s `engineeringLog` array changes; every other field is untouched — `git diff` confirms this at release time |
| 18 | Unrelated content changes | §15's exhaustive two-file manifest; release gate checks `git status`/`git diff` against it exactly |

---

## 18. Work Items

Adapted from the suggested menu where the evidence supports a different shape — collapsed to match the E3-only batch decision (§1) while still fully specifying E4/E2 as designed, not implemented, contracts.

### WI-1 — Re-Verify E3/E4/E2 Content Contracts and Evidence

**Purpose**: confirm §3–§5's re-inspection findings still hold at authoring time.

**Files:** none — verification only.

**Acceptance criteria**: `haya.mdx`/`cookeaze.mdx` frontmatter and body match this document's citations exactly; if either has drifted, the affected contract is revised before authoring proceeds.

### WI-2 — Author E3 Engineering Log Entry

**Files:** `content/engineering-log/haya-invitation-gate-removal.mdx` (new).

**Exact contract:** §3's metadata table, §13's narrative arc, §12's authoring boundary.

**Dependencies:** WI-1; the user-confirmed `publishedAt` date (§11) must be supplied before this can be finalized — not before the plan is approved.

### WI-3 — Update Haya's `engineeringLog` Array

**Files:** `content/work/haya.mdx` (modified).

**Exact contract:** §8's one-line diff.

**Dependencies:** WI-2 (the slug must exist as a real value before it's referenced).

### WI-4 — Release Candidate Review

**Purpose**: the release gate, mirroring every prior implementation plan in this series.

**When it runs:** only after WI-1 through WI-3 are complete.

**Verification steps:**

**Content**
1. Every factual claim in the entry traces to a quoted source sentence (§3/§12) — no fabricated claim.
2. The entry reads as a restructured narrative, not a miniature Case Study (§2) — no imposed heading template.
3. Title, slug, description match §3/§14 exactly.
4. `publishedAt` is a real, user-confirmed date within Haya's stated range.

**Relationships**
5. `/engineering-log/haya-invitation-gate-removal` resolves and renders correctly.
6. Its own "Related Work" section shows Haya.
7. `/work/haya`'s own "Related Engineering Logs" section now shows the new entry — §8's new finding, explicitly tested, not assumed.
8. No incorrect Work relationship — `vaultpay`, `gohunt`, `cookeaze` remain unaffected.

**Discovery**
9. `/engineering-log` index lists the new entry.
10. Previous/Next renders both sides `null` (the honest, expected single-entry state).
11. `/search?q=access-control` (or another real term from the entry) returns it.
12. `platform`/`access-control` tag reuse/introduction confirmed correct.
13. `/rss.xml` includes the new entry.
14. `/sitemap.xml` includes the new entry's URL.

**Regression**
15. `/`, `/knowledge`, `/work`, `/work/haya`, `/work/vaultpay`, `/work/gohunt`, `/work/cookeaze`, `/knowledge/how-jwt-works` (Haya's existing real Related Knowledge target), `/engineering-log`, `/search`, `/rss.xml`, `/sitemap.xml`, `/about`, and an invalid route — all expected statuses.

**Automated**
16. `pnpm exec eslint` clean.
17. `pnpm exec tsc --noEmit` clean.
18. `pnpm build` clean — the practical frontmatter-validity check.

**Git**
19. `git status --short` / `git diff -- content/` shows exactly the two files in §15, only the fields specified — no unrelated content change.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 19. Sequencing

```
WI-1 (re-verify contracts)
        │
        ▼
WI-2 (author E3 entry — pending user-confirmed date)
        │
        ▼
WI-3 (update haya.mdx's engineeringLog array)
        │
        ▼
WI-4 (Release Candidate Review)
```

E4 and E2 (§4, §5) are not sequenced into this plan's own work items — they are ready contracts for a future implementation pass, per §1.

---

## 20. Rollback Plan

Two files: one new, independently deletable Engineering Log entry; one one-line array edit to an already-real Work file. No schema, route, or component involvement — the same minimal rollback profile every content-only task in this milestone has maintained.

---

## 21. Acceptance Criteria (Plan-Level)

- The batch decision (E3 only) is justified with reasoning, not asserted (§1).
- Every proposed fact in E3's contract traces to a quoted source sentence; every gap is named as requiring user confirmation, not filled (§3, §12).
- E4 and E2 are fully specified as ready contracts, satisfying this task's own requirement to plan for them, without being executed in this pass.
- The Work↔Log relationship's dual-direction activation (§8) is stated as a new, re-verified finding, not merely restated from `docs/61`.
- No production code, schema, route, or component change is proposed anywhere.

---

## Summary

This plan authors exactly one real Engineering Log entry — E3, Haya's invitation-gate removal — in this implementation pass, deliberately deferring E4 and E2 (both fully specified, evidence-complete, and ready for a subsequent pass) and E1 (correctly left as a confirmation boundary, not an authoring contract, pending concrete technical detail only the user can supply). The file manifest is the smallest possible for a real Engineering Log entry: one new `.mdx` file and a single-line companion edit to `haya.mdx`'s `engineeringLog` array — re-verified this turn to require no schema, resolver, route, or component change anywhere. A new finding this pass adds to `docs/61`'s own analysis: that one companion edit activates *two* relationship directions simultaneously, since both the Work-side and Log-side resolvers read the identical frontmatter field — worth testing explicitly in the release gate rather than assumed. Every fact in E3's proposed content traces to a quoted sentence already published in Haya's own case study; the only gaps are the exact publication date and the author's own voice, both explicitly marked as requiring confirmation before authoring, not filled in. No production code, content, schema, route, or component was modified to produce this document.

**APPROVED — Task 7.7 implementation plan is ready for authoring.**
