# 75 — Knowledge Candidate "Transactional Outbox" — Implementation Plan

## Status

Implementation Plan — translating `docs/74-TRANSACTIONAL_OUTBOX_EDITORIAL_PLAN.md`'s approved editorial contract into an exact, dependency-ordered, buildable specification.

> This document authorizes no implementation. No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce it.

Task 7.22's implementation-planning turn. Every assumption below is re-verified against the live repository this turn, not copied from `docs/74` unchecked.

---

## 1. Executive Implementation Recommendation

The editorial contract in `docs/74` is complete and re-verifies exactly against the live repository (§2), with one gap found and closed, not silently ignored: `docs/74` establishes the thesis, topic, tags, technology, series, featured, and relationship decisions precisely, but never states an exact `title`/`description` string or a `difficulty` value — both left as prose reasoning rather than finalized frontmatter values. This plan derives both directly from `docs/74`'s own stated thesis and reasoning (§3), not from new invention, and flags this explicitly as a plan-level completion, not a reinterpretation of the editorial decision. No other discrepancy was found between `docs/74` and the live repository.

**Conclusion: APPROVED — Transactional Outbox implementation plan is ready for authoring**, pending the one explicit, expected gate (publication date, §13).

---

## 2. Authoritative Source Documents — Read, Re-Verified

Read in full: `docs/74`, `docs/73`, `docs/72`, `docs/70`, `docs/69`, `docs/66`, `docs/58`. No filename discrepancy against this task's own reading list.

Re-inspected directly this turn: `content/knowledge/` (6 files), `content/work/vaultpay.mdx` (`relatedContent: ["optimistic-vs-pessimistic-locking", "money-floating-point", "append-only-ledger"]`, unchanged in content since Task 7.17 — only its own YAML array formatting has since been reflowed to multi-line by an external formatter, a cosmetic change this plan does not need to account for or revert), `content/work/cookeaze.mdx` (`relatedContent: ["idempotency"]`, Task 7.19), `content/work/haya.mdx`, `content/work/gohunt.mdx`, both Engineering Log entries, and the current tag vocabulary across all 12 real documents. **No discrepancy found between `docs/74` and the live repository** — every relationship, topic count, and tag claim `docs/74` made re-verifies exactly.

---

## 3. Current Corpus Snapshot — Re-Verified, Not Assumed

| Collection | Count | Confirmed via |
|---|---:|---|
| Knowledge | 6 | Direct `ls content/knowledge/*.mdx` |
| Work | 4 | Direct `ls content/work/*.mdx` |
| Engineering Log | 2 | Direct `ls content/engineering-log/*.mdx` |
| **Total** | **12** | Matches this task's own expected baseline, independently re-verified |

`content/series/`, `content/technologies/`: both still `.gitkeep`-only. Current tag vocabulary: 24 unique values, re-confirmed via direct grep across all 12 documents, unchanged since `docs/72`.

---

## 4. Exact Content Contract

| Field | Approved value | Source |
|---|---|---|
| Slug | `transactional-outbox` | `docs/74` §23 — re-verified unique this turn, no collision in any collection |
| Title | *"The Transactional Outbox: Making an Event as Durable as the Change It Describes"* | **Derived this turn** directly from `docs/74` §6's own thesis language ("as durable as," the event/change relationship) — `docs/74` establishes the thesis precisely but never states a final title string; this is a plan-level completion, not a new editorial decision |
| Description | *"Publishing an event right after committing a database write leaves a gap where the write can succeed and the event can vanish, or the reverse. Writing the event in the same transaction as the change it describes closes that gap structurally."* | **Derived this turn**, same basis — restates `docs/74` §4/§6's own Rationale quote and thesis in the collection's established description style, deliberately distinct from VaultPay's own case-study description |
| Topic | `distributed-systems` | `docs/74` §12 |
| Tags | `outbox` (new), `reliability` (existing, currently Engineering-Log-only), `correctness` (existing), `payments` (existing) | `docs/74` §13 |
| Technologies | None | `docs/74` §14 |
| Series | None | `docs/74` §15 |
| Featured | Not recommended — **do not add `featured: true`** | `docs/74` §16 |
| Difficulty | `intermediate` | **Derived this turn** — `docs/74` §16 reasons only that the article is "likely intermediate-to-advanced" without finalizing a value; `intermediate` is chosen because the core mechanism (write the event in the same transaction) is a single, bounded insight comparable in teaching weight to `idempotency`'s own `intermediate` rating, not a paradigm-level reframing the way `append-only-ledger`'s "everything is derived" thesis was (rated `advanced`) |
| `relatedContent` | `["idempotency", "append-only-ledger"]` | `docs/74` §11 |
| `publishedAt` | **Not supplied — explicit gate, §13** | `docs/74` §17 |

**No value above reinterprets `docs/74`'s own editorial decision** — the two derived fields (title/description, difficulty) are mechanical completions of already-fixed reasoning, flagged explicitly rather than silently filled in.

---

## 5. Evidence Boundaries — Carried Forward, Re-Stated for Implementation

Per `docs/74` §5, restated as a binding implementation constraint, with the one caveat this task's own §22 discipline requires be preserved exactly:

**Already implemented/documented (may be stated as real, present-tense fact)**: the transactional write itself — VaultPay's own Architecture section states, present tense, that "the ledger already writes to" the outbox table. The `outbox_events` table, alongside `ledger_entries`/`wallet_balances`/`idempotency_keys`, is named as part of the current data model.

**Planned/future (must be stated as planned, never as deployed)**: the downstream delivery machinery — the relay poller, the RabbitMQ hand-off, actual webhook/notification delivery. VaultPay's own Implementation section places "the outbox/webhooks/audit logging layer" explicitly *after* "the current phase" (ledger + idempotency + concurrency control).

**These two claims must never be collapsed into one** — the article must not say or imply VaultPay "already operates a complete RabbitMQ-backed outbox pipeline." It may say VaultPay already writes the event transactionally; it may say VaultPay has *designed* (not yet *validated in production*) the downstream delivery layer.

**Forbidden, explicitly, per this task's own list, each independently re-checked against VaultPay's complete text this turn**: presenting as deployed — RabbitMQ, a relay worker/poller's own internals, downstream webhook delivery, exact retry policy, exact delivery guarantees (at-least-once/exactly-once), queue topology, broker configuration, or any infrastructure detail beyond what's directly named. None of these is documented beyond the bare mention already quoted in `docs/74` §4 — none may be elaborated with invented specifics.

---

## 6. Article Structure Contract

Following `docs/74` §18 exactly, with each section's evidence classification made explicit for the author:

| Section | Purpose | Claims allowed | Classification |
|---|---|---|---|
| Introduction | A state change and its announcement are two different writes | General framing | General engineering explanation |
| The Problem | Publishing after (not as part of) the transaction creates a window where one write succeeds without the other | The "dual-write problem," stated generically | General engineering explanation |
| The Core Concept | Write the event in the same transaction; a separate process reads and delivers later | General pattern description | General engineering explanation |
| Visual Model | Contrast same-transaction outbox write vs. publish-after-commit | Mirrors VaultPay's own architecture shape | Illustrative, explicitly labeled |
| Implementation | The general pattern; VaultPay's own `outbox_events` table and its stated Rationale | VaultPay's own decision, quoted/paraphrased precisely; **the write-vs-delivery caveat (§5) stated here explicitly, not omitted** | VaultPay evidence + General engineering explanation, clearly separated |
| Trade-offs | Advantages/Disadvantages/Alternatives/When not to use it | VaultPay's own stated trade-off and rejected alternative (publish-after-commit) | VaultPay evidence (Alternatives/Trade-offs) + Editorial synthesis (when-not-to-use) |
| Common Mistakes | Conflating publish-after-commit with same-transaction write; forgetting the consumer needs idempotency | The idempotency forward-pointer, correctly bounded (§7) | Editorial synthesis |
| Real-world Examples | VaultPay, named directly, with the write-vs-delivery distinction stated honestly | VaultPay evidence only | VaultPay evidence |
| Key Takeaways | Concise summary | Synthesis of the above | Editorial synthesis |
| Related Learning | Links to `idempotency` and `append-only-ledger` with stated boundaries; `distributed-systems` topic link | The authored relationships (§8) | Editorial synthesis + the relationship itself |

**No section is added merely for length** — every row traces to a specific piece of `docs/74`'s own approved contract (§4–§8 of that document).

---

## 7. Existing-Content Boundaries — Re-Confirmed for Implementation

| Existing content | What it owns | Outbox's own boundary |
|---|---|---|
| `idempotency` | Safe handling of a **repeated** operation | Outbox owns reliable **handoff** from a local transaction to downstream event processing — not duplicate-safety. The article may name that a relay poller's retries mean the consumer needs idempotency, as a forward pointer, but duplicate-safety must not become the article's own main thesis. |
| `append-only-ledger` | Deriving correct **business state** from immutable history | Outbox owns reliable **publication of downstream events** — a different problem (internal state correctness vs. external communication reliability). Must not become a second ledger article. |
| `optimistic-vs-pessimistic-locking` | Serializing concurrent writers to the same row | No genuine overlap (`docs/74` §8) — concurrency may appear **only as incidental context, if at all**; this article does not need to reference locking to make its own point, and must not re-teach it if mentioned. |
| E4 | **Inbound** payment-webhook reliability | Outbox is the mirror-image, **outbound** event-publication reliability problem. `docs/74` §10 explicitly rejected an E4 relationship — no resolver supports a Knowledge → Engineering Log direction, and E4's own text never describes an outbox-shaped mechanism. **No E4 relationship is authorized by this plan.** |

---

## 8. Relationship Contract

Re-verified against the actual resolver code this turn (`relationships.ts`, `case-study-relationships.ts`, both unchanged since their last full read this milestone):

| # | Source | Target | Direction | Exact metadata change | Why the existing resolver supports it |
|---|---|---|---|---|---|
| 1 | New article (`transactional-outbox.mdx`) | `idempotency` | Knowledge → Knowledge | Authored as part of the new file's own `relatedContent: ["idempotency", "append-only-ledger"]` | `resolveRelatedLearning()`/`resolveRelated()` resolve a Knowledge article's own `relatedContent` exclusively against `getAllArticles()` — the identical mechanism already proven live for `idempotency → optimistic-vs-pessimistic-locking` and `append-only-ledger → money-floating-point`/`idempotency` |
| 2 | New article | `append-only-ledger` | Knowledge → Knowledge | Same array, second entry | Same mechanism |
| 3 | `vaultpay.mdx` | New article | Work → Knowledge | `relatedContent` gains a fourth entry: `["optimistic-vs-pessimistic-locking", "money-floating-point", "append-only-ledger", "transactional-outbox"]` | `resolveRelatedKnowledge()` (`case-study-relationships.ts`) resolves a Work document's own `relatedContent` against `getAllArticles()` — the identical mechanism already carrying VaultPay's three existing real entries |

**No reciprocal metadata is added anywhere** — `idempotency.mdx` and `append-only-ledger.mdx` both stay untouched; a reciprocal declaration on either would be schema-valid but read by zero resolvers (Knowledge → Knowledge relationships are one-directional, authored-only), the identical structural fact already established for every prior relationship in this series. **No new resolver, no generic relationship abstraction, and no relationship based on shared topic/tag/domain alone** is introduced or proposed.

---

## 9. Topic / Same-Topic Contract

**Current `distributed-systems` corpus, re-verified this turn**: 2 real articles — `optimistic-vs-pessimistic-locking` (`relatedContent` empty), `idempotency` (`relatedContent: ["optimistic-vs-pessimistic-locking"]`, non-empty). Adding the new article makes this **the first three-article topic in the repository's history.**

**Traced precisely against `resolveRelatedLearning()`/`resolveSameTopicFallback()`'s unmodified logic:**

- **New article**: its own `relatedContent` (§4, §8) is non-empty → **Same-Topic fallback does not fire**. Its own page shows "Related Concepts" containing `idempotency` and `append-only-ledger`.
- **`optimistic-vs-pessimistic-locking`** (left untouched — no edit proposed to this file): `relatedContent` remains empty → **Same-Topic fallback fires**, now returning **two** siblings for the first time ever (`idempotency` and the new article, both within the topic, alphabetically sorted: *"Idempotency..."* before *"The Transactional Outbox..."*). Its own "More From This Topic" region gains a second card.
- **`idempotency`**: its own `relatedContent` (`["optimistic-vs-pessimistic-locking"]`) remains non-empty and is **not proposed to be edited** → Same-Topic fallback still does not fire for it, and it gains **no visible connection to the new article anywhere on its own page** — this is expected, asymmetric, and matches the identical mechanics already proven for `append-only-ledger`'s own arrival (`docs/71` §8).

**Previous/Next, traced precisely, not assumed unchanged**: `findTopicNeighbor()` orders siblings alphabetically by title. With three articles (*"Idempotency..."*, *"Optimistic vs Pessimistic Locking"*, *"The Transactional Outbox..."*), sorted order is `[idempotency, optimistic-vs-pessimistic-locking, transactional-outbox]`. **A real, expected change to an existing file's own rendered behavior, though not to its content**: `optimistic-vs-pessimistic-locking` currently has no "Next" (it is the alphabetically-last of two); after this article lands, it will gain a real **Next → the new article** for the first time — a live behavior change with zero edit to `optimistic-vs-pessimistic-locking.mdx` itself, flagged here precisely so it is not mistaken for an unexpected regression during the release gate (§16, §17).

---

## 10. Tags Contract

Exactly `["outbox", "reliability", "correctness", "payments"]` — no substitution, no addition, no renaming of any existing tag. `outbox` is new (confirmed absent from the current 24-value vocabulary, re-checked this turn). `reliability` is existing but currently used only by E4 — this article would make it the first tag to span Knowledge and Engineering Log. `correctness` and `payments` are both existing, multi-document Knowledge tags. **Not tagged `distributed-systems`** — that is the topic value, avoiding the collision this corpus has already flagged and avoided three times.

---

## 11. Technology Contract

**No `technologies` field.** RabbitMQ is explicitly **not** added — VaultPay's own text documents it as a planned, not-yet-implemented piece of a future phase (§5), making it doubly inappropriate as a taught technology: it would misrepresent both the article's own portable thesis (which holds regardless of broker choice) and VaultPay's own real, current implementation status. No technology is added merely because it appears anywhere in VaultPay's case study.

---

## 12. Featured Contract

Current featured state, re-verified this turn: `how-jwt-works`, `money-floating-point` — unchanged since Task 7.6. Current Start Here fallback slot occupant: `append-only-ledger` (`2026-08-16`), per its own live-verified Task 7.17 outcome.

**This article is not featured — `featured: true` is not added, per `docs/74` §16.**

**Expected Start Here behavior after publication, calculated precisely, not guessed**: with `featured` correctly absent, the new article competes for the single existing fallback slot purely on `publishedAt`, against `append-only-ledger` (`2026-08-16`) and `idempotency` (`2026-08-16`, currently displaced). **This document does not predict which one wins that slot** — the outcome depends entirely on the still-unresolved publication date (§13). If the new article's date is the newest of the three, it will occupy the fallback slot and displace `append-only-ledger`, the identical mechanical pattern already observed twice (A3 displacing `data-transfer-objects`; A4 displacing `idempotency` via a date tie). If its date is older than `append-only-ledger`'s, Start Here's composition will not change at all. **Neither outcome is a defect** — this is the same deterministic, unmodified algorithm correctly responding to whatever real date is eventually supplied.

---

## 13. Publication-Date Gate

> **Before the MDX file is created, ask the user for the publication date.**

No date is inferred. No default (e.g., "today's date") is used. VaultPay's own `publishedAt` is not reused. This is a hard gate — Work Item 2 (§18) below exists specifically to enforce it, and no later work item may proceed until it is satisfied.

---

## 14. Production File Manifest

| File | Change | Why | Resolver that consumes it |
|---|---|---|---|
| `content/knowledge/transactional-outbox.mdx` | **New** — full frontmatter (§4) and body (§6) | The article itself | `getAllArticles()` (`articles.ts`), automatically |
| `content/work/vaultpay.mdx` | **Modified** — `relatedContent` gains a fourth entry, `"transactional-outbox"` | The one evidenced, resolver-confirmed Work → Knowledge relationship (§8, row 3) | `resolveRelatedKnowledge()` (`case-study-relationships.ts`) |

**No other file.** Not modified, and not required by any resolver re-verified this turn: `content/knowledge/idempotency.mdx`, `content/knowledge/append-only-ledger.mdx` (no reciprocal edit needed — §8), `content/knowledge/optimistic-vs-pessimistic-locking.mdx` (its own new "Next" neighbor and second Same-Topic card are both automatic, §9), `content/work/cookeaze.mdx`, `content/work/haya.mdx`, `content/work/gohunt.mdx`, either Engineering Log entry, or any schema/resolver/route/component file. **No file is added merely to make a relationship symmetrical.**

---

## 15. Expected Discovery Impact

| System | Expected impact | Conditional on publication date? |
|---|---|---|
| Knowledge index | New article appears in Recently Published; Start Here composition per §12 | Partially (Start Here only) |
| Topic page (`/knowledge/distributed-systems`) | Article count 2 → **3** | No |
| Same-Topic | `optimistic-vs-pessimistic-locking` gains a two-card fallback group; the new article shows Related Concepts instead (§9) | No |
| Previous/Next | `optimistic-vs-pessimistic-locking` gains a real "Next" for the first time; the new article gets "Previous → locking" (§9) | No — alphabetical, date-independent |
| Search | Discoverable via title, description, and all four tags — `outbox` individually tested since it's new | No |
| RSS | One new item; exact chronological position not predicted (§13) | **Yes** |
| Sitemap | One new URL; count increases by exactly one | No |
| Relationships | Only the three edges in §8 — no speculative relationship rendered anywhere | No |

**No code change is required for any of the above** — every behavior activates automatically through infrastructure already proven across four prior content rounds this milestone (Tasks 7.6, 7.13, 7.17, 7.19).

---

## 16. Release Gate

**Content**
1. Metadata exactly matches §4 — no substitution.
2. Article structure matches §6 — no imposed Case Study structure, no section added for length.
3. No claim that VaultPay has deployed RabbitMQ, a relay worker, or downstream webhook delivery (§5).
4. The write-vs-delivery distinction (§5) is explicitly present in the article's own text, not just implied.
5. No accidental overlap with `idempotency`, `append-only-ledger`, `optimistic-vs-pessimistic-locking`, or E4 (§7).

**Relationships**
6. New article's own Related Concepts renders `idempotency` and `append-only-ledger`, no duplicate.
7. `vaultpay.mdx`'s Related Knowledge renders four cards, no duplicate, no self-link.
8. No reciprocal metadata anywhere — `idempotency.mdx`, `append-only-ledger.mdx` both zero diff.
9. No E4 relationship exists in either direction.

**Topic**
10. `/knowledge/distributed-systems` shows 3 real articles, count = 3.
11. `optimistic-vs-pessimistic-locking`'s "More From This Topic" shows both `idempotency` and the new article — zero diff on that file.
12. `optimistic-vs-pessimistic-locking`'s own Previous/Next gains a real "Next" for the first time (§9) — confirmed as expected, not flagged as a regression.
13. `idempotency` shows no connection to the new article anywhere on its own page (§9).

**Search**
14. Title, description, and each of the four tags individually tested — `outbox` specifically confirmed as newly searchable.
15. Grouped under "Knowledge," no duplicate result.

**RSS**
16. New item present; title/description/link/guid/category correct; `pubDate` matches the real, user-supplied date; chronological position computed fresh against that date, not predicted in advance.

**Sitemap**
17. New URL present; count increases by exactly one; no unrelated URL changes.

**Regression**
18. `/`, `/knowledge`, `/knowledge/distributed-systems`, all six pre-existing Knowledge article pages, `/work/vaultpay`, `/work/cookeaze`, `/work/haya`, `/work/gohunt`, both Engineering Log pages, `/search`, `/rss.xml`, `/sitemap.xml`, `/about`, and an invalid route — all expected statuses.

**Automated**
19. `pnpm exec eslint` clean.
20. `pnpm exec tsc --noEmit` clean.
21. `pnpm build` clean.

**Git**
22. `git status --short` / `git diff -- content/` shows exactly the two files in §14, only the fields specified.

**Release recommendation**: `APPROVED` or `REFINEMENTS REQUIRED`, the identical binary format every prior implementation plan in this series has used.

---

## 17. Regression Risks

| # | Risk | Concrete test |
|---|---|---|
| 1 | Article claims RabbitMQ is already deployed | Manual text review against §5's forbidden list; release gate item 3 |
| 2 | Article claims the downstream relay/delivery exists today | Same, §5 |
| 3 | Article drifts into re-teaching idempotency as its own thesis | Release gate item 5; compare word count/emphasis of the idempotency mention against the rest of the article |
| 4 | Article drifts into re-teaching the ledger's derive-vs-mutate thesis | Release gate item 5 |
| 5 | Same-Topic fires incorrectly (e.g., for the new article itself, or not for `optimistic-vs-pessimistic-locking`) | Release gate items 11, 13 — live page inspection, not resolver-code trust alone |
| 6 | Previous/Next regresses unexpectedly on an *existing* file | Release gate item 12 — the one *expected* change (`optimistic-vs-pessimistic-locking` gaining a Next) is pre-documented so it isn't mistaken for a defect; any *other* Previous/Next change would be a real regression |
| 7 | Relationship authored in the wrong direction | Release gate items 6–9; re-verified against §8's resolver trace |
| 8 | Accidental reciprocal metadata added to `idempotency.mdx`/`append-only-ledger.mdx` | Release gate item 8 — `git diff` on both files must be empty |
| 9 | Publication-date ordering produces an unexpected but *correct* Start Here/RSS result | §12/§13 — pre-documented as conditional, not asserted in advance; release gate items 1, 16 compute the actual result fresh |
| 10 | Start Here fallback slot changes unexpectedly | §12 — pre-calculated as conditional; not a defect either way |
| 11 | Search returns a duplicate result | Release gate item 15 |
| 12 | RSS ordering wrong | Release gate item 16 |
| 13 | Sitemap count wrong | Release gate item 17 |
| 14 | Unrelated production file modified | Release gate item 22 — exact two-file manifest enforced |

---

## 18. Work Items and Dependencies

```
WI-1 (re-verify implementation contract)
        │
        ▼
WI-2 (user publication-date gate — blocking)
        │
        ▼
WI-3 (author the new MDX)
        │
        ▼
WI-4 (apply the one approved VaultPay metadata edit)
        │
        ▼
WI-5 (live relationship/topic/discovery verification)
        │
        ▼
WI-6 (full regression)
        │
        ▼
WI-7 (Release Candidate Review)
```

**WI-1 — Re-verify implementation contract**: files, none — verification only. Confirms §2–§14 still hold at authoring time (content and code can drift between plan approval and execution).

**WI-2 — User publication-date gate**: files, none. This is not an implementation step — it is the explicit checkpoint (§13) confirming a real date has been supplied before WI-3 begins. No date may be inferred here.

**WI-3 — Author the MDX**: `content/knowledge/transactional-outbox.mdx` (new). Exact contract: §4 (metadata), §6 (structure), §5 (evidence boundary). Depends on WI-1, WI-2.

**WI-4 — Apply the approved metadata edit**: `content/work/vaultpay.mdx` (modified, one new `relatedContent` entry, §8 row 3, §14). Depends on WI-3 (the slug must exist before it's referenced).

**WI-5 — Live relationship/topic/discovery verification**: the checks in §9, §15 (relationship rendering, Same-Topic asymmetry, Previous/Next, Search, RSS, Sitemap), performed against a live build.

**WI-6 — Full regression**: §16's Regression section, §18 of `docs/74`'s own risk list re-confirmed.

**WI-7 — Release Candidate Review**: §16 in full, concluding `APPROVED`/`REFINEMENTS REQUIRED`.

**No work item is executed by this document.**

---

## 19. Guardrails

**In scope**: only the two files named in §14, exactly as specified.

**Out of scope, explicitly, none to be touched under any circumstance without stopping to report an architectural gap first**: `src/lib/content/schema.ts`, `src/lib/content/articles.ts`, `src/lib/content/relationships.ts`, `src/lib/content/case-study-relationships.ts`, `src/lib/content/engineering-logs.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, any Knowledge/Work/Engineering-Log route or component, Search, RSS, Sitemap, navigation, any unrelated content file, `content/knowledge/optimistic-vs-pessimistic-locking.mdx` (its own live behavior changes automatically, §9 — it is never edited), `content/work/cookeaze.mdx`, `content/work/haya.mdx`, `content/work/gohunt.mdx`, E3, E4, A3 (`idempotency.mdx`), A4 (`append-only-ledger.mdx`), and the now-downgraded A1/A2 candidates (`docs/73`) — none is reopened by this plan. **No architecture change of any kind is proposed.**

---

## 20. Implementation Sequence

1. User supplies the publication date.
2. Agent re-verifies the approved contract (WI-1).
3. Agent authors the MDX (WI-3).
4. Agent applies only the one approved metadata edit (WI-4).
5. Agent runs `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build`.
6. Agent runs live verification (WI-5).
7. Agent performs the full regression review (WI-6).
8. Agent reports `APPROVED` or `REFINEMENTS REQUIRED` (WI-7).

**No step may silently infer the publication date — step 1 is a hard precondition for every step after it.**

---

## 21. Final Authorization Statement

This document authorizes no implementation. `content/knowledge/transactional-outbox.mdx` and the one-line `vaultpay.mdx` edit remain future work, gated explicitly on the publication date (§13). No production file was created or modified to produce this document.

```
git status --short
```

Confirmed: only `docs/65`–`docs/74` (prior turns' own outputs, untouched by this task) and `docs/75` (this document) appear as new paths under `docs/`; the modified/untracked content files (`content/knowledge/idempotency.mdx`, `content/knowledge/append-only-ledger.mdx`, `content/work/vaultpay.mdx`, `content/work/cookeaze.mdx`, `content/engineering-log/cookeaze-webhook-reliability-gap.mdx`) are all prior tasks' (7.13/7.17/7.19) own already-approved, pre-existing output — not attributable to this task. `git diff --stat -- content/ src/` shows zero change attributable to this document.

---

## Final Report

1. **Plan status**: complete; one gap in `docs/74` (missing exact title/description/difficulty) found and closed via mechanical derivation from its own stated reasoning, not new invention (§1, §4).
2. **Exact production manifest**: two files — `content/knowledge/transactional-outbox.mdx` (new), `content/work/vaultpay.mdx` (modified, one `relatedContent` entry) (§14).
3. **Content contract**: full metadata table, every value traced to `docs/74` or explicitly flagged as a derived completion (§4).
4. **Evidence boundaries**: the write-vs-delivery distinction restated as a binding constraint, with the exact forbidden claims list (§5).
5. **Relationship contract**: three edges, each resolver-verified this turn, no reciprocal metadata (§8).
6. **Topic/Same-Topic impact**: `distributed-systems` becomes the first three-article topic; the asymmetric fallback behavior traced precisely, including the one *expected* live change to `optimistic-vs-pessimistic-locking`'s own Previous/Next (§9).
7. **Featured behavior**: not featured; Start Here's exact conditional outcome stated, not guessed (§12).
8. **Publication-date gate**: explicit, blocking, stated as WI-2 (§13, §18).
9. **Work items**: WI-1 through WI-7, dependency-ordered (§18).
10. **Release gate**: 22 individually stated checks (§16).
11. **Regression risks**: 14 individually named risks, each with a concrete test (§17).
12. **Guardrails**: every file this plan must not touch named explicitly (§19).
13. **Git verification**: confirmed via `git status --short`; zero production change attributable to this task (§21).

**APPROVED — Transactional Outbox implementation plan is ready for authoring.**
