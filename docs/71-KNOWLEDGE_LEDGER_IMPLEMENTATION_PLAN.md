# 71 — Knowledge Article A4 "Append-Only Ledger" — Implementation Plan

## Status

Implementation Plan — translating `docs/70-LEDGER_DESIGN_EDITORIAL_PLAN.md`'s approved editorial contract into an exact, dependency-ordered, implementation-ready specification.

> This document authorizes no implementation. No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce it.

Task 7.16's implementation-planning turn. Every assumption below is re-verified against the live repository this turn, not copied from `docs/70` unchecked.

---

## 1. Read Before Planning — Confirmed, No Drift

Read in full: `docs/70-LEDGER_DESIGN_EDITORIAL_PLAN.md`, `docs/69-MILESTONE_7_DISCOVERY_REASSESSMENT.md`, `docs/68-KNOWLEDGE_IDEMPOTENCY_IMPLEMENTATION_PLAN.md`, `docs/67-KNOWLEDGE_IDEMPOTENCY_EDITORIAL_PLAN.md`, `docs/58-CONTENT_EXPANSION_EDITORIAL_PLAN.md`.

Re-inspected directly this turn: `content/knowledge/` (5 files, unchanged), `content/work/vaultpay.mdx` (`relatedContent: ["optimistic-vs-pessimistic-locking", "money-floating-point"]`, unchanged), `content/work/cookeaze.mdx` (`relatedContent: []`, unchanged), `content/engineering-log/` (2 files, unchanged), `src/lib/content/schema.ts`, `src/lib/content/relationships.ts`, `src/lib/content/case-study-relationships.ts`, `src/lib/content/articles.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, `src/app/knowledge/page.tsx`, `src/app/knowledge/[slug]/page.tsx`, `src/components/content/related-learning.tsx`, `src/components/work/related-knowledge.tsx` — all confirmed unchanged since the last time each was fully read this milestone (`docs/68`, `docs/70`'s own re-inspection). Slug `append-only-ledger` re-verified unique — no collision in `content/knowledge/`, `content/work/`, or `content/engineering-log/`.

**No contradiction found between `docs/70` and the live repository.** Every metadata value, relationship direction, and resolver claim in `docs/70` re-verifies exactly.

---

## 2. Approved A4 Contract — Carried Forward Exactly

| Field | Approved value | `docs/70` reference |
|---|---|---|
| Core thesis | *A value that must stay provably correct should be derived from an immutable history rather than stored as a mutated field.* An engineering principle, not a VaultPay-specific tutorial. | §3 |
| Title | *"The Ledger Pattern: Why a Balance Should Never Be a Field You Update"* | §11 |
| Description | *"A stored balance can silently drift from reality — a crashed request, a bad migration, a bug nobody noticed. Deriving it from an append-only history instead makes drift structurally impossible, not just unlikely."* | §11 |
| Slug | `append-only-ledger` — re-verified unique this turn | §11 |
| Topic | `architecture` | §7 |
| Featured | Not recommended — **do not add `featured: true`** | §17 |
| Tags | `ledger` (new), `data-modeling`, `correctness`, `payments` (all existing) | §8 |
| Technologies | None | §9 |
| Series | None — not invented | §10 |
| `relatedContent` | `["money-floating-point", "idempotency"]` — no other Knowledge relationship | §15–§16 |
| `publishedAt` | Explicit user input required | §18 — see §3 below |

**No alternative metadata is proposed anywhere in this plan.**

---

## 3. Publication Date — External Prerequisite, Not Invented

> **Publication date is not yet supplied and is treated as USER INPUT REQUIRED before authoring.**

No date is invented; VaultPay's own `publishedAt` (`2026-08-01`) is not reused — VaultPay is still `status: "In Progress"`, its ledger/idempotency/concurrency-control phase is its own *current*, undated phase, and reusing that date would misattribute an ongoing project's date to this new article. No project-event date is used as a stand-in. **This is the one and only blocker direct repository evidence reveals** — re-confirmed this turn (§1): no schema gap, no resolver gap, no missing infrastructure. This document is not blocked on the date; every other section proceeds to full specification.

---

## 4. Future Production File Manifest

Re-derived directly from resolver inspection (§5), matching `docs/70`'s own §23 baseline exactly:

| File | Change | Why |
|---|---|---|
| `content/knowledge/append-only-ledger.mdx` | **New** — full frontmatter and body | The article itself |
| `content/work/vaultpay.mdx` | **Modified** — `relatedContent` gains one entry (`"append-only-ledger"`), the third alongside its existing two | §5 — the one resolver-confirmed, evidenced Work → Knowledge relationship |

**No other production file.** Not modified, and not required by any resolver (§5): `content/work/cookeaze.mdx`, `content/knowledge/money-floating-point.mdx`, `content/knowledge/optimistic-vs-pessimistic-locking.mdx`, `content/knowledge/idempotency.mdx`, `content/knowledge/data-transfer-objects.mdx`, `content/knowledge/how-jwt-works.mdx`, `content/engineering-log/*.mdx`, any schema/resolver/route/component file.

---

## 5. Relationship Direction — Resolver-Verified

Re-read this turn: `app/work/[slug]/page.tsx`, `app/knowledge/[slug]/page.tsx`, `case-study-relationships.ts`, `relationships.ts`.

- **`vaultpay` → A4**: `resolveRelatedKnowledge()` (`case-study-relationships.ts`) resolves `vaultpay.mdx`'s own `relatedContent` against `getAllArticles()` via the shared `resolveArticleReferences()` — the identical mechanism already carrying VaultPay's two existing real entries. Adding a third slug (`append-only-ledger`) requires **only** editing `vaultpay.mdx`'s own array — no code change, no companion edit to A4's own frontmatter beyond what its own contract (§2) already specifies. **Confirmed**: adding A4 to VaultPay's `relatedContent` does not require any corresponding edit to A4 beyond A4's own already-planned `relatedContent` — the two directions are independent, each authored on its own source side.
- **A4 → `money-floating-point`, A4 → `idempotency`**: `resolveRelatedLearning()`/`resolveRelated()` (`relationships.ts`) resolve a Knowledge article's own `relatedContent` **exclusively against `getAllArticles()`** — confirmed via `app/knowledge/[slug]/page.tsx`'s own call site (`resolveRelatedLearning(article, allArticles)` where `allArticles = getAllArticles()`). Both targets are real, published Knowledge articles; both resolve correctly with zero code change, the identical mechanism already proven live for `idempotency → optimistic-vs-pessimistic-locking` (Task 7.13).
- **Existing target articles do not need reciprocal metadata**: `money-floating-point.mdx` and `optimistic-vs-pessimistic-locking.mdx`'s own analogue, and `vaultpay.mdx` itself, all stay outside this plan's own inbound-editing scope except where §4 already names the one legitimate exception (`vaultpay.mdx`'s own outbound array). A reciprocal declaration on either existing Knowledge article (e.g., `money-floating-point.mdx` declaring `relatedContent: ["append-only-ledger"]`) is not proposed — not because it would be technically invalid (the schema permits it), but because it is not part of this document's own approved authoring contract and no resolver requires it for A4's own relationships to work in either direction.
- **Cookeaze**: confirmed, per `docs/70` §6, no relationship is evidenced — `cookeaze.mdx` is not touched by this plan, and no code path would resolve a Cookeaze→A4 link even if one were mistakenly added, since no such claim exists in Cookeaze's own text.

---

## 6. `money-floating-point` Relationship — Boundary Restated for Implementation

**Why the relationship is useful**: a reader learning "derive the balance from history, don't mutate a field" (A4) has an adjacent, unanswered question — "and how do I represent that value precisely once I have it?" — which is exactly `money-floating-point`'s own subject.

**The boundary, restated precisely so the article doesn't blur it**:
- **A4** teaches: ledger structure, immutable/append-only transaction history, deriving a current value (correctness) from that recorded history rather than an independently mutable field.
- **`money-floating-point`** teaches: numeric representation — why monetary arithmetic must avoid native floating-point types, regardless of whether the value in question is stored in a mutable field or derived from a ledger.

**Guardrail for authoring**: A4 must not re-explain floating-point representation, integer-cents conversion, or `Decimal` types — those are `money-floating-point`'s own content. A4 may reference the *existence* of that concern (e.g., "this article assumes the values in the ledger are already represented precisely — see `money-floating-point` for that separate problem") without restating its solution.

**Future release verification**: A4's own Related Concepts region must render `money-floating-point` as one of its cards, confirmed by direct page inspection, not assumed from the frontmatter alone.

---

## 7. `idempotency` Relationship — Boundary Restated for Implementation

**Why the relationship is useful**: a reader who has just learned "derive, don't mutate" (A4) has a natural next question — "what stops the same transaction from being derived into the ledger twice?" — which is `idempotency`'s own subject, and the identical "lesson, then the next question it raises" pattern `idempotency`'s own Related Learning section already uses for its own link to `optimistic-vs-pessimistic-locking`.

**The boundary, restated precisely**:
- **A4** teaches: ledger state and its invariants — is the current value derivable from a trustworthy, unbroken history.
- **`idempotency`** teaches: making a repeated/duplicated operation safe — applying the same operation twice should have the same effect as once.

**Guardrail for authoring**: A4 must not re-explain idempotency keys, unique-reference constraints, or retry/duplicate-delivery mechanics — those are `idempotency`'s own content, already published. A4 may name that a real system needs both properties together (VaultPay itself has both, as two separate, adjacent Engineering Decisions) without re-teaching the second one.

**Future release verification**: A4's own Related Concepts region must render `idempotency` as a second card, alongside `money-floating-point`, confirmed by direct page inspection.

---

## 8. Same-Topic Behavior — Resolver-Traced, Not Assumed

**Current `architecture` topic corpus, re-verified this turn**: exactly **one** real article — `data-transfer-objects` (`topic: "architecture"`, confirmed by direct frontmatter re-read, §1). No other real Knowledge article currently carries this topic.

**A4 creates the first multi-article `architecture` topic** — the second multi-article topic in this repository's history, after `distributed-systems` (`optimistic-vs-pessimistic-locking`/`idempotency`, Task 7.13).

**Traced directly against `relationships.ts`'s unmodified `resolveRelatedLearning()`/`resolveSameTopicFallback()` shape** (identical logic already proven live in Task 7.13, re-applied here to a different topic pair):

- **For A4**: its own `relatedContent` (§2) resolves to `["money-floating-point", "idempotency"]` — non-empty. Since `resolveRelatedLearning()` only falls through to `resolveSameTopicFallback()` when both `continueLearning` and `relatedConcepts` are empty, **Same-Topic fallback does not fire for A4** — its own Related Learning region shows a "Related Concepts" group (two cards: `money-floating-point`, `idempotency`), not a "More From This Topic" group.
- **For `data-transfer-objects`** (left untouched, per §4 — its own `relatedContent` stays empty): both `continueLearning` and `relatedConcepts` remain empty, so **Same-Topic fallback fires**: `resolveSameTopicFallback(data-transfer-objects, allArticles)` filters `topic === "architecture"`, excludes self, finds A4 → returns `[A4]`. `data-transfer-objects`'s own Related Learning region gains a **"More From This Topic"** group (exact rendered heading, confirmed against `related-learning.tsx`, §1) containing A4, for the first time — with **zero edit to `data-transfer-objects.mdx` itself**.

**This is the identical asymmetric pattern already proven live for `idempotency` ↔ `optimistic-vs-pessimistic-locking`** (`docs/68` §7, live-verified in Task 7.13's own release gate) — now confirmed to generalize to a second topic pair rather than being a one-off. The release gate (§16, §22) must verify this exact, resolver-derived asymmetry directly against the rendered UI, not assume it from the pattern alone.

---

## 9. Article Content Contract

Per `docs/70` §3/§12–§14, restated as an implementation boundary:

**The article is a Knowledge article. It is explicitly NOT:**
- A VaultPay case study (no Executive Summary/Constraints/Validation-shaped sections; VaultPay is evidence, not the subject).
- A financial-accounting tutorial using VaultPay as cover (double-entry bookkeeping is referenced only as a brief, generic illustration of the general pattern's real-world precedent, not taught in full).
- A concurrency article (locking is named only as motivating context, per `docs/70` §5's own overlap finding — never re-taught as a mechanism).
- An idempotency article (duplicate-safety is named only as an adjacent, cross-linked concern — never re-taught).
- A database implementation specification (no schema beyond the two named tables VaultPay's own Architecture section states, and no SQL beyond what's directly quoted or clearly labeled generic).

**The article teaches**: *"Values that must remain provably correct should be derived from immutable history rather than maintained as independently mutable state."* VaultPay is the article's real-world example, every VaultPay-specific claim must trace directly to the case study (§11), and any generic example must be explicitly labeled illustrative (§11).

---

## 10. Content Structure — Concrete Implementation Structure

`docs/70` §12 already specifies which sections the thesis supports; this plan makes each concrete for an author to proceed from without guessing, following the exact structure every real Knowledge article already uses (re-confirmed this turn against all five real articles' own heading lists, unchanged): Introduction → The Problem → The Core Concept → Visual Model → Implementation → Trade-offs → Common Mistakes → Real-world Examples → Key Takeaways → Related Learning. **Not** Problem → Decision → Change → Result.

| Section | Purpose | Evidence source | Direct evidence or editorial synthesis? | Prohibited in this section |
|---|---|---|---|---|
| Introduction | Motivate why a stored balance being wrong is a real risk | General framing | Editorial synthesis | Any VaultPay-specific claim not yet earned by later sections |
| The Problem | A directly-mutated field can drift via a crash, retry, or bug | VaultPay, "The Problem" (a directly-updatable balance column can drift; a crashed/retried/concurrent request can each leave an unreconstructable state) | Direct evidence, generalized | Any specific incident, failure rate, or drift magnitude — none is stated |
| The Core Concept | Stored vs. derived state; why a structural guarantee beats application-level care | VaultPay, Investigation + Lessons Learned (quoted precisely, `docs/70` §2) | Direct evidence (the principle) + editorial synthesis (the general framing) | Presenting the principle as unique to VaultPay rather than the source's own generalized claim |
| Visual Model | Contrast a mutated-field balance against an append-only ledger + computed projection | VaultPay, Architecture (`ledger_entries`/`wallet_balances` as two distinct tables) | Direct evidence for the two-table shape; generic diagram framing otherwise | Inventing a schema beyond the two named tables |
| Implementation | The append-only-log-plus-projection pattern; reversals as compensating entries | VaultPay, Engineering Decisions ("Double-Entry, Append-Only Ledger" — reversals are compensating entries, not deletions) | Direct evidence | Any SQL/schema beyond what's shown or clearly labeled generic; no undocumented database guarantee |
| Trade-offs | Advantages/Disadvantages/Alternatives/When not to use it | VaultPay's own stated trade-off ("every balance read now requires a computed projection or a maintained cache of one") and rejected alternative (a single mutable field) | Direct evidence + editorial synthesis for the "when not to use it" case | No invented performance cost beyond VaultPay's own stated qualitative trade-off — no benchmark number exists to cite |
| Common Mistakes | Treating a correction as an edit rather than a new compensating entry; assuming application-level care is a substitute | VaultPay, Lessons Learned, restructured | Direct evidence | No invented "common mistake" beyond what the source's own reasoning supports |
| Real-world Examples | VaultPay named directly; double-entry bookkeeping's real-world precedent as a brief, clearly-generic second illustration | VaultPay, throughout; double-entry accounting as general domain knowledge | Direct evidence (VaultPay) + generic illustration (accounting precedent, explicitly labeled) | No fabricated second real project |
| Key Takeaways | Concise summary | Synthesis of the above | Editorial synthesis | No new claim introduced here that wasn't already established above |
| Related Learning | Link to `money-floating-point` and `idempotency` with the boundary stated (§6–§7); topic link | §6, §7, §2 | Editorial synthesis + the authored relationship itself | No third Knowledge link beyond the two approved (§2) |

---

## 11. Evidence Boundary — Implementation-Time Table

| Category | Examples | Allowed? |
|---|---|---|
| **Direct VaultPay evidence** | The governing rule; `ledger_entries`/`wallet_balances` as two tables; reversals as compensating entries; the Lessons Learned sentence; the stated "design intent, not load-tested" caveat | Yes |
| **General engineering explanation** | Stored vs. derived state; the general append-only-log-plus-projection pattern; why a structural guarantee is stronger than application-level discipline | Yes, as editorial synthesis |
| **Generic examples** | Illustrative SQL/pseudocode for an append-only insert plus a computed-sum read; double-entry bookkeeping's real-world precedent | Yes, **only if explicitly labeled illustrative/generic**, never presented as VaultPay's own documented schema |
| **Missing information** | Exact retry/backoff parameters for anything ledger-adjacent; any detail VaultPay's own text doesn't state | Requires confirmation — not authorable |
| **Unsupported claims** | Transaction volume, throughput, performance numbers, failure rates, customer impact, exact database schema beyond the two named tables, undocumented SQL, undocumented database guarantees, undocumented accounting behavior, undocumented production incidents, team discussions, implementation motivations beyond each Decision's own stated Rationale, any architecture not stated in VaultPay's own text | **Forbidden** |

**Every prohibited category above is independently re-checked against VaultPay's complete, live case-study body this turn (§1)** — none is present in the planned content (§10), and none may be introduced during authoring.

---

## 12. Featured Behavior

**A4 is not featured — `featured: true` must not be added (§2).**

**Why, restated for implementation**: the two current Knowledge featured picks (`how-jwt-works`, `money-floating-point`) were both chosen specifically as the most *approachable* entry points (both `beginner` difficulty). A4's likely difficulty (matching VaultPay's own `advanced` rating and the sophistication of "derive, don't mutate" as a concept) does not fit that rationale — the identical reasoning already applied to A3 (`docs/67` §11) and restated by `docs/70` §17.

**Calculated Start Here impact, using current real article dates, not assumed**: current featured group is `[money-floating-point, how-jwt-works]` (2, cap 3); the one fallback slot is currently occupied by `idempotency` (`2026-08-16`, the newest non-featured article). With A4 correctly unfeatured, it competes for that same one fallback slot against `idempotency`, `data-transfer-objects`, and `optimistic-vs-pessimistic-locking` (the latter two both `2026-08-12`) purely by publication date — **this document does not predict the outcome**, since A4's own date is not yet supplied (§3). **If A4's eventual date is newer than `idempotency`'s (`2026-08-16`), A4 will occupy the fallback slot and `idempotency` will be displaced from Start Here — the identical mechanical consequence already observed once (A3 itself displacing `data-transfer-objects` in Task 7.13's own release gate).** This is stated here as an anticipated, explicable release-gate calculation, not a defect to prevent — the featured *algorithm* is not modified by this plan, and whichever single article loses the one fallback slot remains fully live at its own URL regardless.

---

## 13. Search — No Code Change

`search.ts` (re-read in full this turn) already matches `title`, `description`, and each individual `tags` value against all three real collections, unchanged since Task 7.2. **No code change required.**

**Future release-gate verification**:
- Title/description substring queries return A4.
- Each approved tag is tested individually, **specifically including `ledger` — the one new tag** — confirming `/search?q=ledger` returns A4; the three existing tags (`data-modeling`, `correctness`, `payments`) are also each individually re-tested to confirm no regression in their own existing matches.
- Result grouped under the *"Knowledge"* heading, correct URL (`/knowledge/append-only-ledger`).

---

## 14. RSS — No Code Change, Chronology Deferred

`rss.ts` (re-read in full this turn) already merges all three collections by real `publishedAt`. **No code change required.**

**Future release-gate verification, once §3's prerequisite is resolved**: A4 appears in `/rss.xml`; title/description/absolute URL/GUID match the approved contract (§2) exactly; `pubDate` matches the eventually-supplied date, RFC-822-formatted; **chronological position is not predicted in advance** — the release gate must compute it fresh against whatever date is actually used, the identical discipline `docs/68` §14 already applied to A3's own RSS verification.

---

## 15. Sitemap — No Code Change

`sitemap.ts` (re-read in full this turn) already maps `getAllArticles()` directly. **No code change required.**

**Future release-gate verification**: `/sitemap.xml` contains `/knowledge/append-only-ledger`; total URL count increases by **exactly one** — current count (re-confirmed live during Task 7.13) is 25; after A4, 26, with every other category unchanged; `lastModified` follows the existing, unmodified `updatedAt ?? publishedAt` policy — since A4 will have no `updatedAt`, this resolves to whatever `publishedAt` is eventually supplied.

---

## 16. Knowledge Index / Topic Page

**Future release verification**:
- A4 appears on `/knowledge` (Recently Published, per its real date once known; Start Here per §12's own conditional calculation).
- A4 appears on `/knowledge/architecture`, alongside `data-transfer-objects` — article count = **2**, confirmed via `TopicHero`'s own live-computed `articleCount` prop, no code change needed.
- No placeholder content anywhere in this flow — this route has read exclusively real content since Task 7.1, re-confirmed unchanged this turn.
- Ordering follows the existing, unmodified `getFeaturedArticles()`/`sortByPublishedDate()` behavior — not reimplemented.
- Same-Topic behavior matches §8's exact resolver-derived prediction: A4 shows "Related Concepts" (not Same-Topic); `data-transfer-objects` shows "More From This Topic" containing A4, with zero diff on that file.

---

## 17. VaultPay Verification

**Future release verification**:
- `vaultpay.mdx`'s own Related Knowledge section (Work-side) renders **three** cards: `optimistic-vs-pessimistic-locking`, `money-floating-point`, and the new `append-only-ledger` — correct titles, correct links (`/knowledge/append-only-ledger`), no duplicate.
- VaultPay itself is never shown in its own Related Knowledge list — structurally guaranteed by `resolveArticleReferences()`'s own `excludeSlug` parameter, unchanged.
- No reciprocal metadata was added unnecessarily — A4's own frontmatter contains no reference back to `vaultpay` (Knowledge articles have no Work-pointing relationship field at all, confirmed by schema re-read, §1); this is structural, not merely a style choice.
- **`cookeaze.mdx` remains untouched and must not gain A4** — confirmed by `git diff -- content/work/cookeaze.mdx` showing zero lines in the release gate (§22).

---

## 18. Current Knowledge Regression

**Future release verification, each individually re-checked**:
- `optimistic-vs-pessimistic-locking` — zero frontmatter diff; its own existing Same-Topic relationship with `idempotency` (Task 7.13) remains exactly as it was, unaffected by A4 landing in a different topic.
- `money-floating-point` — zero frontmatter diff; gains a new **inbound** Related Concepts reference from A4 (§6) but its own outbound relationships, if any, are unaffected (it currently has none).
- `data-transfer-objects` — zero frontmatter diff; gains the new "More From This Topic" behavior (§8, §16), the one expected, resolver-derived change to its own *rendered* page, not its own file.
- `how-jwt-works` — entirely unaffected; different topic, no relationship path to A4.
- `idempotency` — zero frontmatter diff; gains a new **inbound** Related Concepts reference from A4 (§7); its own existing outbound relationship to `optimistic-vs-pessimistic-locking` (Task 7.13) is unaffected.
- A3's own relationships (`idempotency` ↔ `optimistic-vs-pessimistic-locking`, E4 → `idempotency`) — all confirmed unaffected, since none of their own source files is touched by this plan.

---

## 19. Engineering Log Regression

**Future release verification**:
- E3 (`haya-invitation-gate-removal`) — zero diff, zero behavior change; no relationship path to A4 exists or is proposed.
- E4 (`cookeaze-webhook-reliability-gap`) — zero diff; its own existing `relatedContent: ["idempotency"]` (Task 7.13) is unaffected; **E4 must not gain A4** — confirmed via `git diff` showing zero lines on this file (§22), since this plan's own manifest (§4) never touches it.
- Work ↔ Engineering Log relationships (`haya`↔E3, `cookeaze`↔E4, both directions) — unaffected; neither `haya.mdx` nor `cookeaze.mdx` is touched by this plan.

---

## 20. Discovery Journeys — Re-Tested at Release, Not Assumed Improved

Per this task's own instruction not to claim improvement without live output, the future release gate must re-run all seven journeys (`docs/69` §12 framing) and record the **actual** result:

1. **Find by topic** — `/knowledge/architecture` must show 2 real articles; claim only "strengthened" if the live page confirms it.
2. **Find by tag** — `/search?q=ledger` (new) and `/search?q=payments` (existing, now potentially a 6th real cross-collection instance) must be individually tested, not assumed.
3. **Find a related concept** — A4's own Related Concepts region and `data-transfer-objects`'s new "More From This Topic" region must both be independently verified live (§8, §16).
4. **Discover an engineering story** — unaffected by this plan; re-tested only as a regression check (§19), not claimed as strengthened.
5. **Engineering story → Knowledge** — unaffected; E4 → `idempotency` remains the only real instance; not claimed as strengthened by A4.
6. **Move between same-topic Knowledge articles** — strengthened only if the live `architecture`-topic pairing (A4 ↔ `data-transfer-objects`) is confirmed to behave identically in kind to the already-proven `distributed-systems` pairing; must be verified, not inferred from the resolver trace alone.
7. **Find through Search** — re-tested for title/description/all four tags.

**Journeys 4 and 5 are correctly not claimed as improved by this plan** — A4 is a Knowledge-only addition with no Engineering Log anchor (`docs/70` §6), and this section states that honestly rather than inflating A4's own impact.

---

## 21. Automated Checks

Future implementation must run `pnpm exec eslint .`, `pnpm exec tsc --noEmit`, `pnpm build` — all three expected clean, since no code file is touched by this plan (§4); running them anyway is the same verify-don't-assume discipline every prior implementation plan in this series has applied.

---

## 22. Release Gate

**Content**
1. Thesis matches §2/§9 exactly — a source-of-truth/derivation principle, not a VaultPay narrative or a concurrency/idempotency article.
2. Every claim traces to §11's Direct-evidence or Editorial-synthesis rows; zero Unsupported-row content.
3. No duplication with `money-floating-point` (representation) or `optimistic-vs-pessimistic-locking` (concurrency serialization) or `idempotency` (duplicate-safety) — each boundary independently re-checked (§6, §7, §9).
4. Matches existing Knowledge style (§10) — no imposed Case Study structure.

**Metadata**
5. Title, description exactly match §2 — no substitution.
6. Slug is `append-only-ledger`, unique, re-verified at authoring time.
7. Topic is exactly `architecture`.
8. Tags exactly `["ledger", "data-modeling", "correctness", "payments"]` (or the precise final order chosen in `docs/70`) — no fifth value, no `architecture` duplicate.
9. No `technologies` value present.
10. No `series`/`seriesOrder` present.
11. `featured` absent or `false`.
12. `publishedAt` is the real, user-supplied value — not VaultPay's, not invented.
13. `relatedContent` exactly `["money-floating-point", "idempotency"]` — no third value, no substitution.

**Relationships**
14. `vaultpay.mdx`'s Related Knowledge shows three cards including A4, correctly linked, no duplicate.
15. A4's own Related Concepts shows `money-floating-point` and `idempotency`.
16. `data-transfer-objects`'s own "More From This Topic" shows A4, with **zero diff** on that file (§8).
17. No unnecessary reciprocal metadata anywhere — `money-floating-point.mdx`, `optimistic-vs-pessimistic-locking.mdx` both zero diff; `cookeaze.mdx` zero diff; E4's own `relatedContent` unchanged, still exactly `["idempotency"]`.

**Discovery**
18. `/knowledge` includes A4 per its real date; Start Here composition matches §12's conditional prediction once the date is known.
19. `/knowledge/architecture` shows both real articles, count = 2.
20. `/search?q=ledger`, plus each of the other three tags individually, all return A4, grouped under "Knowledge."
21. `/rss.xml` includes A4 with correct title/description/URL/GUID/date/category.
22. `/sitemap.xml` includes `/knowledge/append-only-ledger`; total count = 26.

**Regression**
23. `optimistic-vs-pessimistic-locking`, `money-floating-point`, `data-transfer-objects`, `how-jwt-works`, `idempotency` — each individually re-checked, zero unrelated diff.
24. `vaultpay.mdx` — only the one new `relatedContent` entry differs.
25. `cookeaze.mdx` — zero diff.
26. E3 — zero diff. E4 — zero diff, `relatedContent` unchanged.
27. A3's own relationships — unaffected (§18).
28. An invalid route — 404, unchanged.

**Automated**
29. `pnpm exec eslint` clean.
30. `pnpm exec tsc --noEmit` clean.
31. `pnpm build` clean.

**Git**
32. `git status --short` / `git diff -- content/` shows exactly the two files in §4, only the fields specified — no unrelated content change.

**Release recommendation**: `APPROVED` or `REFINEMENTS REQUIRED`, the identical binary format every prior implementation plan in this series has used.

---

## 23. Guardrails

This task creates only `docs/71-KNOWLEDGE_LEDGER_IMPLEMENTATION_PLAN.md`. No production file may change. The future implementation must not modify: `src/lib/content/schema.ts`, `src/lib/content/articles.ts`, `src/lib/content/relationships.ts`, `src/lib/content/case-study-relationships.ts`, `src/lib/content/engineering-logs.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, any Knowledge route or component, `content/work/cookeaze.mdx`, `content/engineering-log/*.mdx`, any unrelated Knowledge article, or navigation — none is required by anything re-verified this turn (§1, §5, §8). **If any such change becomes necessary during authoring, the correct response is to stop and report an architectural gap, not silently expand scope**, the identical discipline this doc series has held to throughout.

```
git status --short
```

Confirmed: only `docs/65`–`docs/70` (prior turns, untouched by this task) and `docs/71` (this document) appear as new; `git diff --stat -- content/ src/` is empty for anything attributable to this task.

---

## Final Report

1. **Implementation-plan status**: complete, design-only, no production change made.
2. **Exact A4 contract**: carried forward exactly from `docs/70` (§2) — no alternative metadata invented.
3. **Exact future file manifest**: two files — `content/knowledge/append-only-ledger.mdx` (new), `content/work/vaultpay.mdx` (modified, `relatedContent` only) (§4).
4. **Publication-date dependency**: explicit external prerequisite, the one and only blocker direct evidence reveals (§3).
5. **Relationship direction**: `vaultpay → A4`, `A4 → money-floating-point`, `A4 → idempotency`, all re-verified against the actual resolver code; no reciprocal metadata required or proposed anywhere (§5).
6. **Same-Topic behavior**: `architecture` currently 1 article, becomes the repository's second multi-article topic; resolver-traced asymmetry confirmed to generalize from the `distributed-systems` precedent (§8).
7. **Content structure**: exact section-by-section purpose/evidence/prohibition table, sufficient to author without guessing (§10).
8. **Evidence boundary**: full table, every forbidden category re-checked against the live VaultPay text this turn (§11).
9. **Featured behavior**: not featured, reasoned; the exact Start Here consequence conditionally calculated and stated as an anticipated release-gate outcome, not a surprise (§12).
10. **Search verification plan**: all four tags individually tested, `ledger` specifically flagged as the new one (§13).
11. **RSS verification plan**: exact fields specified; chronology explicitly deferred until the date exists (§14).
12. **Sitemap verification plan**: exact count (26) and `lastModified` policy stated (§15).
13. **Knowledge/topic verification plan**: exact count (2), Same-Topic asymmetry re-verified live (§16).
14. **VaultPay verification plan**: three-card Related Knowledge, no duplicate, no self-reference, Cookeaze confirmed untouched (§17).
15. **Regression plan**: every existing Knowledge article, VaultPay, Cookeaze, E3, E4, and A3's own relationships individually covered (§18–§19).
16. **Discovery journey plan**: all seven re-tested at release; journeys 4/5 honestly stated as unaffected, not inflated (§20).
17. **Automated checks**: eslint/tsc/build, all expected clean (§21).
18. **Release gate**: 32 individually stated checks across Content, Metadata, Relationships, Discovery, Regression, Automated, and Git categories (§22).
19. **Guardrails**: every file this plan must not touch named explicitly; re-confirmed no resolver requires an exception (§23).
20. **Git verification**: `git status --short` confirms only this document as new from this task; `git diff --stat -- content/ src/` shows zero change attributable to it.

**READY WITH USER INPUT — Implementation plan is complete, but publication date must be supplied before authoring.**
