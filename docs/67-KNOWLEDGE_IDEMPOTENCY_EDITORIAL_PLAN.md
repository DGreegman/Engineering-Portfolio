# 67 — Knowledge Article A3 "Idempotency" — Editorial Design

## Status

Proposal — awaiting review and approval.

> No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, relationship, or navigation file was created or modified to produce this document.

Task 7.11's design-stage editorial plan. `docs/66-MILESTONE_7_DISCOVERY_REASSESSMENT.md` identified A3 ("Idempotency") as the single highest-value remaining content-authoring candidate in Milestone 7. This document does not carry that finding, or `docs/58`'s original candidate write-up, forward unchecked — every claim below is re-verified against the complete, current repository this turn, with discrepancies (if any) reported rather than absorbed.

---

## 1. Authoritative Sources — Read, Re-Verified This Turn

Read in full: `docs/58-CONTENT_EXPANSION_EDITORIAL_PLAN.md`, `docs/66-MILESTONE_7_DISCOVERY_REASSESSMENT.md`, `docs/50-MILESTONE_7_DISCOVERY.md`, `docs/51-MILESTONE_7_DISCOVERY_DECISIONS.md`, `docs/53-DISCOVERY_TAXONOMY_EXPERIENCE.md`, `docs/55-RELATED_CONTENT_DISCOVERY.md`, `docs/56-RELATED_CONTENT_IMPLEMENTATION_PLAN.md`. No filename discrepancy found against this task's own reading list.

Re-inspected directly this turn, complete bodies not excerpts: all four real `content/knowledge/*.mdx` files, `content/work/vaultpay.mdx` (the "second project" `docs/58`/`docs/66` both point to), `content/work/cookeaze.mdx`, `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (E4). Re-read in full: `src/lib/content/schema.ts`, `src/lib/content/articles.ts`, `src/lib/content/relationships.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, `src/app/knowledge/page.tsx`, `src/app/knowledge/[slug]/page.tsx`. Also read, not on this task's list but load-bearing for §6/§18.8: `docs/18-ARTICLE_TEMPLATE.md` (the Knowledge article structure every real article already follows).

---

## 2. Current Knowledge Corpus — Exact Inventory, Re-Verified

| Article | Topic | Tags | Technologies | Series | `featured` | `relatedContent` (outbound) | `publishedAt` |
|---|---|---|---|---|---|---|---|
| `data-transfer-objects` | architecture | api-design, data-modeling, architecture | — | — | false | — | 2026-08-12 |
| `how-jwt-works` | security | jwt, authentication, tokens | — | — | **true** | — | 2026-08-07 |
| `money-floating-point` | backend | floating-point, money, data-modeling, correctness | — | — | **true** | — | 2026-08-12 |
| `optimistic-vs-pessimistic-locking` | distributed-systems | concurrency, databases, locking, correctness | — | — | false | — | 2026-08-12 |

Four real articles, four distinct topics, zero overlap, zero Knowledge→Knowledge `relatedContent` or `prerequisites` anywhere, zero `series`/`seriesOrder` anywhere, zero `technologies` anywhere. Confirmed via `schema.ts`: `articleFrontmatterSchema` requires `title`, `description`, `publishedAt`; `knowledgeFrontmatterSchema` additionally requires `topic` (enum-validated against `TOPIC_SLUGS`). `tags`, `technologies`, `relatedContent`, `prerequisites` all default to `[]`; `featured` defaults `false`. No schema change is needed for anything this document proposes.

Topic coverage: 4 of 8 `TOPIC_SLUGS` populated (`backend`, `architecture`, `distributed-systems`, `security`), each with exactly one article. `system-design`, `cloud`, `performance`, `testing` remain empty. A3 must fit one of the four already-populated topics, per this task's own instruction not to invent a new one — resolved in §7.

---

## 3. Cookeaze / E4 Relationship — Re-Verified Directly, Not Assumed

Both `content/work/cookeaze.mdx` and `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` re-read in full this turn.

### 3.1 Exact idempotency-related engineering event

Cookeaze's payment reconciliation runs two independent resolution paths against the same transaction — a Paystack webhook (push) and a self-chaining Celery poller (pull) — because the webhook alone wasn't a reliable signal (E4's own subject, `docs/63`/`docs/64`). Both paths can, in principle, resolve the same transaction at nearly the same moment.

### 3.2 What actually happened, per the Case Study's own text

**Architecture** (`cookeaze.mdx`), quoted exactly: *"A `TransactionMapping` record is created up front, keyed on a unique transaction reference — this is what makes the two independent paths (webhook and poller) safe to race against each other: whichever one resolves the transaction first updates the wallet; the other, arriving after, finds the transaction already resolved on the same unique reference and is a safe no-op rather than a second credit."*

**Engineering Decisions → "Decision: Idempotent Resolution Keyed on a Unique Transaction Reference"**, quoted exactly: *"The webhook and the poller can, in principle, both resolve the same transaction at nearly the same moment. A unique constraint on the transaction reference — combined with only crediting a wallet from an unresolved-to-resolved state transition — means whichever path gets there first wins and the second is a no-op, rather than depending on a lock the two independent code paths might not both remember to take."*

**Lessons Learned**, the sentence directly following the case study's own callout, quoted exactly: *"Idempotency has to be enforced at the data layer (a unique constraint two independent code paths both respect), not just assumed from 'only one thing should ever call this.'"*

### 3.3 Mechanism/decision actually documented

A unique database constraint on the transaction reference, combined with crediting the wallet only on an unresolved→resolved state transition — the second arrival of a resolution for an already-resolved reference is rejected/no-op'd at the data layer, not merely avoided by application logic assuming only one caller exists.

### 3.4 Direct evidence vs. inference

All of §3.2 is **direct evidence** — three separate, independently locatable statements in the same document, one of which (Lessons Learned) names "Idempotency" as a term explicitly. Nothing here is inferred from an incidental mention; the case study's own "Engineering Decisions" section gives this mechanism a dedicated subsection with its own Alternatives/Trade-offs/Rationale, the identical evidentiary shape already required of an Engineering Log candidate in `docs/61`/`docs/63`.

### 3.5 E4's own text, checked precisely — does "webhook + retries" automatically mean idempotency?

**No, and this document does not assume that.** Re-read in full, E4's relevant paragraph states: *"Making that safe took one more piece: a `TransactionMapping` record created up front, keyed on a unique transaction reference, so the webhook and the poller could race each other without risk. Whichever path resolves the transaction first updates the wallet; the other, arriving after, finds it already resolved on the same reference and is a safe no-op rather than a second credit."* This is the **same mechanism** as §3.2's Architecture quote, restructured — not a generic "we handle retries" claim. The specific, checkable fact that establishes the relationship is: **a second resolution attempt on an already-resolved unique reference is explicitly a safe no-op** — that is the definition of an idempotent operation, demonstrated concretely, not asserted abstractly. A weaker claim ("the webhook has a retry mechanism," "requests are deduplicated") would not by itself establish idempotency — retrying and deduplicating are related but distinct concepts from idempotency itself (§6). E4 clears the higher bar: it describes the *outcome* of applying the same resolution twice (a safe no-op, not a double-credit), which is the actual definition, not just the presence of a retry/redelivery mechanism.

**Precise caveat, stated directly**: E4's own prose never uses the word "idempotent" or "idempotency" anywhere in its body (confirmed by direct text search of the file). The relationship rests on mechanism-equivalence, not shared vocabulary.

### 3.6 Does the evidence support a Knowledge article?

Yes — confirmed independently across two documents (Case Study, Engineering Log entry), one of which explicitly names the term.

### 3.7 Does the evidence support a future Work/Engineering Log → Knowledge relationship?

Yes, for both:
- `cookeaze.mdx` → Idempotency: **direct**, on the strength of §3.2 (three independent statements, one naming the term).
- `cookeaze-webhook-reliability-gap.mdx` (E4) → Idempotency: **legitimate on mechanism-equivalence**, per §3.5 — the same standard already governing `vaultpay.mdx`'s own existing, live `relatedContent` links (§4.5), none of which quote the exact vocabulary term either.

**`E4 → Idempotency` is confirmed, not assumed** — grounded in the specific, checkable "safe no-op on a second resolution" behavior, not a generic inference from "this system has retries."

---

## 4. Second Project — VaultPay, Re-Verified for Genuine Independence

`content/work/vaultpay.mdx` re-read in full this turn — the "second project" `docs/58` §5 and `docs/66` both point to.

### 4.1 The problem

A wallet transfer request can legitimately be retried by a client (a network timeout, client-side retry logic) or arrive duplicated. Applying a retried transfer a second time is a real double-spend, not a cosmetic bug — the case study's own stated engineering requirement.

### 4.2 The engineering decision

**Engineering Decisions → "Decision: Idempotency Keys Stored in PostgreSQL, Not Redis"**, quoted exactly: *"**Alternatives Considered:** Caching idempotency keys in Redis, the more common choice for deduplication. **Trade-offs:** Idempotency checks now share the database's write path instead of a faster, separate cache. **Rationale:** A Redis key can be evicted. An idempotency key that silently disappears and lets a retried transfer through a second time is exactly the double-spend this system exists to prevent — so the idempotency check has to commit atomically with the ledger write it's guarding, in the same database, or it isn't really a guarantee."*

### 4.3 The idempotency mechanism

An idempotency key, persisted in the same PostgreSQL database as the ledger write it guards, checked and recorded **atomically** (in the same transaction) with that write — rejected explicitly as a Redis-cache-based approach because a cache entry can be silently evicted, reopening the exact double-spend window the mechanism exists to close. Independently corroborated by the Architecture section's own system diagram, which names `idempotency_keys` as one of exactly four PostgreSQL tables (`ledger_entries`, `wallet_balances`, `idempotency_keys`, `outbox_events`) — a first-class, load-bearing piece of the data model, not an incidental aside. Also corroborated by Requirements → Engineering: *"Safe behavior under retried/duplicated requests"* is named as one of four explicit engineering requirements.

### 4.4 The resulting lesson

VaultPay's own case study does not state a dedicated, generalized "lesson" sentence about idempotency specifically the way Cookeaze's does (§3.2's Lessons Learned quote) — its closing "Lessons Learned" section is about the ledger's structural-correctness principle generally (*"making the wrong state structurally unrepresentable... is a stronger and more maintainable guarantee than any amount of application-level care"*), which is adjacent to, but not specifically about, idempotency. **This is a real, worth-stating precision**: VaultPay's idempotency evidence is strong at the decision level (a named requirement, a named table, a full Alternatives/Trade-offs/Rationale decision) but does not independently restate a general idempotency lesson the way Cookeaze's does.

### 4.5 Genuine independence from Cookeaze — checked directly, not assumed

- **Different failure mode**: VaultPay's concern is a *retried client request* against a single resolution path; Cookeaze's is *two independent, concurrently-running processes* (webhook, poller) racing to resolve the same event. These are related but distinct instantiations of the same general concept — not one case study restating the other's story, the same standard `docs/65` applied when distinguishing E2 from E3/E4.
- **Different implementation shape**: VaultPay's mechanism is an idempotency-key table checked before a write; Cookeaze's is a unique constraint on an existing reference column combined with a state-transition guard. Both are real, standard idempotency techniques, but they are not the same code shape.
- **Already independently authored as separate real relationships**: `vaultpay.mdx`'s existing `relatedContent` (`optimistic-vs-pessimistic-locking`, `money-floating-point`) and `cookeaze.mdx`'s (currently `[]`) already show these are treated as editorially distinct projects with their own relationship histories, not a single narrative split across two files.

**Conclusion: genuinely independent.** Not turned into an incidental mention or the article's sole thesis — both anchors are treated as co-equal evidence in §6/§9, neither elevated over the other without cause.

### 4.6 Does the evidence support a Knowledge article? A future relationship?

Yes to both, on the identical basis §3.6/§3.7 established for Cookeaze — re-stated separately here per this task's own instruction to verify each independently rather than assume the first verification covers the second.

---

## 5. Discrepancy Check Against `docs/58` / `docs/66`

**No discrepancy found that weakens either prior document's claim.** One finding **strengthens** the record beyond what either prior document credited: `docs/58` §5 quoted only Cookeaze's Engineering Decision; this turn's full-body re-read surfaces a third, independent statement in Cookeaze's own Lessons Learned section that names "Idempotency" as a term directly (§3.2) — not previously quoted by `docs/58` or `docs/66`. Recorded per this task's own instruction to report a strengthening as well as a weakening, not just the latter.

---

## 6. Article Thesis

**Central thesis**: *An operation is only as safe to retry as its idempotency actually guarantees — and that guarantee has to be built deliberately (a unique reference, checked and enforced at the data layer), not assumed from "this should only ever be called once."*

This thesis is chosen, not the more generic "what is idempotency," specifically because it's the one claim **both** real anchors directly support without stretching either: VaultPay's own rejection of a Redis-cached key (because eviction breaks the guarantee) and Cookeaze's own explicit Lessons Learned sentence (*"not just assumed from 'only one thing should ever call this'"*) are both, independently, statements about the same underlying idea — a real guarantee requires deliberate, data-layer enforcement, not an assumption about caller behavior. The article teaches the general concept using these two real, independently-arrived-at instances as its evidence, per this task's own instruction not to write "a generic tutorial disconnected from the portfolio's engineering experience."

**Separated explicitly, per this task's own instruction:**

- **Repository-derived facts**: §3.2, §3.5, §4.2–§4.3 — quoted or precisely paraphrased, attributed to the specific project.
- **Editorial synthesis / general explanation**: the definition of idempotency itself, the standard mechanisms (idempotency keys, natural idempotency, unique constraints), why "just don't call it twice" isn't achievable in practice — general engineering knowledge, not attributed to either project, the same category every existing article's own "Core Concept"/"Implementation" section already contains (§18.8).
- **Claims requiring confirmation**: none identified for the thesis itself — both anchors are Direct evidence, re-verified in full (§3, §4). The one open item requiring input is the article's own `publishedAt` (§11), not a factual claim about either project.
- **Unsupported claims**: any number (retry counts, failure rates, transaction volumes) from either project beyond what's already stated; any claim about *why* VaultPay/Cookeaze chose idempotency keys over some third, unconsidered alternative; any claim about how often a retry or race actually occurred in either real system — Cookeaze's own case study explicitly declines to publish transaction-volume figures, and this document does not fill that silence.

---

## 7. Article Scope — What A3 Should Actually Teach

Evaluated against this task's own candidate list, each judged on whether it supports the thesis (§6), not included by default:

| Concept | Include? | Reasoning |
|---|---|---|
| Duplicate requests | **Yes** | The general failure mode both anchors instantiate |
| Retries | **Yes** | VaultPay's own named context; distinguished explicitly from idempotency itself (a retry mechanism doesn't guarantee idempotency — a system can retry *and* double-apply if it isn't also idempotent; this distinction is worth teaching directly, since conflating the two is a real, common misconception) |
| Webhook redelivery | **Yes, as Cookeaze's real-world example** | Not as a generic topic — grounded specifically in E4/Cookeaze's own documented webhook-vs-poller race |
| Idempotency keys | **Yes** | VaultPay's own named mechanism; the article's primary "Implementation" example |
| Stable operation identifiers | **Yes, folded into "idempotency keys"** | Not a separate section — the same concept under the name both case studies actually use ("unique transaction reference," "idempotency key") |
| Database uniqueness (constraints) | **Yes** | Cookeaze's own mechanism; a second, real implementation pattern distinct from VaultPay's dedicated-table approach, giving the article two genuinely different real techniques rather than one repeated |
| Transactional boundaries | **Yes** | Both anchors' own stated rationale hinges on this — VaultPay's "commit atomically... in the same database" and Cookeaze's "enforced at the data layer" are both, precisely, transactional-boundary claims |
| Safe retry behavior | **Yes** | The article's own practical payoff — what a reader should actually build |
| Same-operation vs. new-operation semantics | **Yes, briefly** | The conceptual core of idempotency itself (is this the *same* request arriving again, or a genuinely *new* one) — necessary to explain *why* a unique reference/key is the mechanism, not optional |
| Generic naturally-idempotent operations (e.g., `SET x = 5` vs. `x = x + 1`) | **Yes, as a brief contrasting example, explicitly labeled generic** | Neither real anchor is this simple; including it teaches the *boundary* of the concept (some operations are idempotent by construction, most aren't) — labeled per §12 as a generic teaching example, not project evidence |
| Any specific retry/backoff algorithm, HTTP status-code semantics for idempotent methods, or distributed-consensus material | **No** | Not evidenced by either anchor; would pull the article toward a different, broader topic than what VaultPay/Cookeaze actually demonstrate |

**Not automatically included, and explicitly excluded**: a survey of HTTP method idempotency (GET/PUT vs POST) — real and related, but neither anchor discusses HTTP semantics at all; including it would be general tutorial content disconnected from the portfolio's own evidence, exactly what this task's §4 instruction warns against.

---

## 8. Existing Knowledge Style — Findings From Reading All Four Articles Completely

Re-read in full this turn (§1): `data-transfer-objects`, `how-jwt-works`, `money-floating-point`, `optimistic-vs-pessimistic-locking`.

- **Heading structure**: identical across all four — Introduction → The Problem → The Core Concept → Visual Model → Implementation → Trade-offs → Common Mistakes → Real-world Examples → Key Takeaways → Related Learning. Matches `docs/18-ARTICLE_TEMPLATE.md`'s own section list exactly, confirmed by direct comparison, not assumed.
- **Depth**: substantial but not exhaustive — each section is a few paragraphs, 3–5 code/diagram examples total per article, no section left thin.
- **Examples**: always at least one real, runnable-looking code snippet (JS, SQL, TS, or Python depending on the concept) plus a plain-text "Visual Model" diagram where a sequence or structural comparison helps (all four articles use one).
- **Code usage**: short, focused snippets illustrating exactly one point each (e.g., `optimistic-vs-pessimistic-locking`'s two SQL blocks — version-column UPDATE, then `SELECT ... FOR UPDATE`), never a large unexplained block — matching `docs/18`'s own "explain the approach before showing code... avoid dropping large blocks of code without context" instruction precisely.
- **Callouts**: none of the four real Knowledge articles use a `<Callout>` component in their body — that pattern is used in Work case studies (`vaultpay.mdx`, `cookeaze.mdx`) and Engineering Log's own closing paragraph style, not in Knowledge. **A3 should not introduce the first Knowledge-article callout without cause** — none is proposed here.
- **Practical advice**: every article has a "Common Mistakes" section (misconceptions/pitfalls/anti-patterns, per `docs/18`) and a "Trade-offs" section explicitly covering Advantages/Disadvantages/Alternatives/When not to use it.
- **Conclusion style**: "Key Takeaways" is a tight bullet list (3–4 items), followed by "Related Learning," which closes with one sentence connecting to another real article or topic, plus a `[Topic](/knowledge/{topic})` link — every one of the four does this identically.
- **Tone**: direct, second-person-adjacent ("you," "your"), confident but not promotional, technical but not jargon-heavy up front (`docs/18`: "use simple language before introducing technical terminology").

**A3 is designed to follow this exact, already-established structure** (§9) — not a novel format, and not Engineering Log's deliberately different, template-free convention (`docs/37`), which this document does not conflate with Knowledge's own, consistently template-following convention.

---

## 9. Article Narrative — Section by Section, Following the Established Template

- **Introduction**: motivate why "just don't call it twice" isn't achievable by assumption — matching every real article's own "why does this problem exist" opening.
- **The Problem**: a request can be retried or a webhook can be redelivered in any real networked system; applying the resulting duplicate is sometimes harmless, sometimes a real correctness failure (a double-spend, a double-credit) — the general problem both real anchors instantiate.
- **The Core Concept**: idempotency defined — an operation is idempotent if applying it more than once produces the same effect as applying it once. Same-operation vs. new-operation semantics: the hard part isn't the definition, it's recognizing *that this is the same operation arriving again*, which requires a stable identifier.
- **Visual Model**: a diagram showing two resolution attempts against the same reference — one arriving first and succeeding, the second arriving after and finding the reference already resolved (mirroring Cookeaze's own webhook/poller race shape, §3.2), plus a brief second diagram contrasting a naturally-idempotent operation (`SET x = 5`) against a naturally non-idempotent one (`x = x + 1`), labeled as a generic illustration (§12).
- **Implementation**: two real, distinct mechanisms — VaultPay's dedicated idempotency-key table, checked atomically with the write it guards (§4.2–§4.3); Cookeaze's unique constraint on an existing reference column plus an unresolved→resolved state-transition guard (§3.2–§3.3) — presented as two genuinely different real implementations of the same principle, not one repeated.
- **Trade-offs**: Advantages (a real, enforceable guarantee under retries/races); Disadvantages (extra storage, an extra check on every write path — VaultPay's own stated trade-off, restructured); Alternatives (a Redis-cached key, explicitly rejected by VaultPay's own Rationale, and locking around the whole codepath, explicitly considered and rejected by Cookeaze's own Alternatives Considered — two real, quotable rejected alternatives, unusually strong grounding for a Trade-offs section); When not to use it — general teaching content (an operation with no real duplicate-delivery risk doesn't need this machinery).
- **Common Mistakes**: assuming "only one thing should ever call this" is enough — Cookeaze's own Lessons Learned sentence (§3.2), restructured directly; caching an idempotency key somewhere it can be silently evicted — VaultPay's own rejected alternative, restructured.
- **Real-world Examples**: VaultPay and Cookeaze, both named directly, each with its own real mechanism described accurately within §12's content boundary.
- **Key Takeaways**: a concise 3–4 item summary, matching every other real article's own closing pattern.
- **Related Learning**: one authored link to `optimistic-vs-pessimistic-locking` (§10's own recommendation), plus a closing sentence and topic link, matching every other article's exact convention.

**Length**: no arbitrary target — two full case studies (one with an explicit named lesson) is at least as much real anchoring material as any of the four already-published articles had.

---

## 10. Metadata — Determined and Justified

| Field | Recommended value | Justification |
|---|---|---|
| **Title** | *"Idempotency: Making 'Do This Twice, Safely' a Real Guarantee"* | Matches the established colon-subtitle convention (`data-transfer-objects`'s own title shape); directly states the thesis (§6) |
| **Description** | *"A retried request or a redelivered webhook isn't a rare failure in a real system — it's a certainty. Idempotency is what makes handling the same operation twice as safe as handling it once."* | Editorial synthesis of §6's thesis; no invented metric or project-specific claim |
| **Slug** | `idempotency` | **Verified unique this turn** — no file of this name exists in `content/knowledge/`, `content/work/`, or `content/engineering-log/` (direct `ls`/`find` check); matches this collection's concept-name slug convention (`optimistic-vs-pessimistic-locking`, `data-transfer-objects`) over a full-title paraphrase |
| **Topic** | `distributed-systems` | §7's own scope (retries, redelivery, racing independent processes) is a distributed/networked-systems problem class first; sits as a direct conceptual sibling to the one real article already there (`optimistic-vs-pessimistic-locking`); independently corroborated by `docs/18-ARTICLE_TEMPLATE.md`'s own "Idempotency in Payment Systems" verification-fixture example, written in Milestone 4, unprompted by this milestone's own content audit. `backend` remains a credible, defensible runner-up (idempotency keys are, mechanically, a database/backend detail), recorded, not dismissed. |
| **Tags** | `idempotency` (new), `correctness` (existing), `concurrency` (existing), `payments` (existing) | See breakdown below |
| **Technologies** | None recommended | Neither real anchor's evidence is technology-specific in a way that adds discovery value — PostgreSQL is already implied by `technologies` on both `vaultpay.mdx`/`cookeaze.mdx` (Work-side); no Knowledge article populates this field today (§2), and this document finds no reason A3 should be the first without a concrete cross-collection technology-discovery need, which `docs/66` §5 already found unjustified |
| **Series** | None — not invented | No real `series` usage exists anywhere (§2); inventing one to hold a single article would violate this task's own explicit "do not invent a Series" instruction and `docs/51` Decision 1/`docs/58` §12's own unreversed deferral |
| **Featured** | **Not recommended** — see §14 | |
| **`publishedAt`** | **Not decided by this document — explicit user input required at authoring time** — see §15 | |

**Tags, individually justified, avoiding the one known topic/tag collision this corpus has already exhibited once (`docs/58` §10, `data-transfer-objects.mdx`'s own topic-restated-as-tag)**:

| Tag | Status | Why it applies | Collision check |
|---|---|---|---|
| `idempotency` | **New** — confirmed absent from the current 22-value tag vocabulary (re-checked via direct grep this turn) | Names the exact concept | N/A |
| `correctness` | Existing — already on `money-floating-point`, `optimistic-vs-pessimistic-locking` | Idempotency is a correctness guarantee, the same category those two articles already use this tag for | Distinct from the topic (`distributed-systems`) |
| `concurrency` | Existing — already on `optimistic-vs-pessimistic-locking`, `vaultpay`, `haya` | Both real anchors involve racing/concurrent operations | Distinct from the topic |
| `payments` | Existing — already on `vaultpay`, `haya`, `cookeaze`, and E4 | Both real anchors are payment-adjacent systems — the article's real-world grounding | Distinct from the topic |

**Deliberately not tagged `distributed-systems`** — that is this article's proposed topic value; repeating it as a tag would reproduce the one redundancy `docs/58` §10 already found and flagged as avoidable.

---

## 11. Featured Decision

Current real `featured` state, re-verified: `how-jwt-works` (beginner, 2026-08-07), `money-floating-point` (beginner, 2026-08-12) — exactly 2, both Knowledge, unchanged since Task 7.6. `getFeaturedArticles()` (`articles.ts`, re-read in full) caps at `limit: 3`, featured-first (newest-first among themselves), then fills any remaining slots with the newest non-featured items.

**Current Start Here composition** (re-confirmed live in `docs/66` §3): `[money-floating-point, how-jwt-works, data-transfer-objects]` — the third slot is a **fallback** slot, currently occupied by `data-transfer-objects` (the newest of the two remaining non-featured articles, tied at `2026-08-12` with `optimistic-vs-pessimistic-locking`, filesystem-order tiebreak).

**Calculated effect if A3 were featured** — computable precisely, independent of A3's own undetermined `publishedAt` (§15): featuring A3 would make the featured group exactly 3 items (`how-jwt-works`, `money-floating-point`, A3), which **exactly fills** `getFeaturedArticles()`'s `limit: 3` — meaning **zero fallback slots would remain**. `data-transfer-objects`, the article currently occupying that one fallback slot, would be **evicted from Start Here entirely** — the first time any article has left Start Here's composition since Task 7.6 activated real featuring. This is true regardless of where A3's own exact date sorts within the featured group, because the eviction is a direct consequence of the group reaching its cap, not of ordering within it.

**Recommendation: do not feature A3.**

**Reasoning, not "important therefore featured" (the exact default this task instructs against)**:

1. `getFeaturedCaseStudies`/`getFeaturedArticles`'s own editorial rule (`docs/58` §7, unreversed): featured content should "best represent the portfolio's engineering perspective or serve as an especially useful entry point." The two current Knowledge picks were both specifically chosen as the most **approachable entry points** — both `beginner` difficulty. A3 is `intermediate` (§10) — it does not fit the specific rationale that governed the existing two picks, even though it is independently strong content.
2. Featuring A3 would silently evict `data-transfer-objects` from Start Here (above) — a real, calculable consequence this document surfaces rather than lets a future implementer discover as a surprise, per `docs/60` §7/§16's own "state the counterintuitive result plainly" precedent.
3. `docs/58` §7's own "keep the featured count small" principle — four real flags already exist; adding a fifth without re-running that deliberate, small-batch editorial exercise (as Task 7.6 did explicitly) is out of this single-article document's proportionate scope.

---

## 12. Publication-Date Decision — Explicit User Input Required

Per this task's own explicit instruction: **this document does not reuse Cookeaze's, VaultPay's, or any other project's `publishedAt`, and does not invent one.** Neither real anchor's own case study states a date for when its idempotency mechanism was specifically designed or implemented (both mechanisms are described as part of each system's original/current architecture, not as a dated event, unlike Engineering Log's own event-dated convention).

> **`publishedAt` requires explicit user input at authoring time.** This is a new Knowledge article, not a restructuring of an already-dated event (unlike E3/E4, which reused their source Case Study's own `publishedAt` per an explicit resolved decision) — no comparable "reuse this project's date" instruction exists or is invented here.

---

## 13. Content Boundary

| Planned material | Source | Classification | Allowed? |
|---|---|---|---|
| VaultPay requires safe behavior under retried/duplicated requests | `vaultpay.mdx`, Requirements → Engineering | Direct evidence | Yes |
| VaultPay stores idempotency keys in PostgreSQL, not Redis, because a cache entry can be evicted | `vaultpay.mdx`, Engineering Decisions | Direct evidence | Yes |
| VaultPay's `idempotency_keys` table sits alongside `ledger_entries`/`wallet_balances`/`outbox_events` | `vaultpay.mdx`, Architecture | Direct evidence | Yes |
| Cookeaze's webhook and poller can race to resolve the same transaction | `cookeaze.mdx`, Architecture | Direct evidence | Yes |
| Cookeaze enforces resolution once via a unique transaction-reference constraint and an unresolved→resolved state-transition guard | `cookeaze.mdx`, Engineering Decisions | Direct evidence | Yes |
| "Idempotency has to be enforced at the data layer... not just assumed from 'only one thing should ever call this'" | `cookeaze.mdx`, Lessons Learned | Direct evidence, quotable near-verbatim | Yes |
| E4 describes the same unique-reference/safe-no-op mechanism, without using the word "idempotent" | `cookeaze-webhook-reliability-gap.mdx` | Direct evidence (mechanism); the absence of the term is also a direct, checked fact | Yes, with the term-absence caveat stated (§3.5) |
| General definition of idempotency; same-operation vs. new-operation semantics; idempotency keys as a general pattern; naturally-idempotent vs. non-idempotent operations (`SET x=5` vs. `x=x+1`) | None — general engineering knowledge | Editorial synthesis, explicitly labeled generic where used as an example (§7, §9) | Yes |
| Redis-cache-based idempotency as a rejected alternative | `vaultpay.mdx`, Engineering Decisions ("Alternatives Considered") | Direct evidence | Yes |
| Locking around the whole codepath as a rejected alternative | `cookeaze.mdx`, Engineering Decisions ("Alternatives Considered") | Direct evidence | Yes |
| Exact number of retries, race occurrences, or duplicate deliveries in either real system | Neither case study states this | **Unsupported** | **No** — forbidden |
| Any outage duration or customer-impact figure | Neither case study states this | **Unsupported** | **No** — forbidden |
| Any claim about Paystack's or Postgres's own undocumented internal behavior beyond what's already stated | Neither case study states this | **Unsupported** | **No** — forbidden |
| Any specific database constraint syntax not already shown in either case study (e.g., an invented exact DDL statement attributed to either project) | Not stated in either source | **Unsupported** if attributed to a specific project; **Allowed** only as a clearly-labeled generic SQL example | Conditional — generic example only, labeled as such |
| Any claim about why the two-anchor comparison itself (VaultPay vs. Cookeaze) was made internally by either team, or any team discussion | Not stated in either source | **Unsupported** | **No** — forbidden |
| `publishedAt` value | N/A | **Requires confirmation** | **No, until confirmed** (§12) |

**Explicit prohibitions, restated per this task's own list, all independently checked against both full case-study bodies this turn**: no invented metrics, retry counts, failure rates, outage durations, customer impact, provider behavior, database constraints (beyond what's directly quoted), architecture details, implementation details, or project motivations appear anywhere in §6–§9's planned content. Where a generic example is used purely for teaching (the `SET x=5` contrast, §7/§9), it is explicitly labeled as generic, never presented as project evidence.

---

## 14. Discovery Impact — Existing Infrastructure Only, No Code Proposed

Every mechanism below is confirmed, by direct re-read this turn, to already exist and require zero code change:

| System | Impact | Confirmed via |
|---|---|---|
| Knowledge index (`/knowledge`) | Appears in Recently Published automatically; Start Here composition unaffected unless featured (§11) | `app/knowledge/page.tsx`, re-read in full — reads `getAllArticles()`/`getFeaturedArticles()` directly |
| Topic page (`/knowledge/distributed-systems`) | Article count goes 1 → 2; the topic's own honest "0/1 Articles" state becomes a real 2-article listing for the first time | `app/knowledge/[slug]/page.tsx`, re-read in full — `getAllArticles().filter(topic===slug)` |
| Same-Topic relationship | **Activates for the first time in this repository's history** — see §16 for the exact, resolver-verified, asymmetric behavior | `relationships.ts`, re-read in full |
| Search | New real title/description/tag-matchable content; `idempotency` becomes searchable for the first time; `correctness`/`concurrency`/`payments` each gain another real cross-collection match | `search.ts`, re-read in full — `matchesQuery()` already checks `title`/`description`/`tags`, no change needed |
| RSS | Gains one real item automatically, positioned by its own real `publishedAt` once set | `rss.ts`, re-read in full — `getFeedItems()` already reads `getAllArticles()` directly |
| Sitemap | Gains one real `/knowledge/idempotency` URL automatically | `sitemap.ts`, re-read in full — `knowledgeEntries` already maps `getAllArticles()` directly |
| E4 → Knowledge relationship | Would go from 0 real edges to 1 (E4's first-ever Related Knowledge link) — **not automatic**, requires the future frontmatter edit named in §17 | `app/engineering-log/[slug]/page.tsx` (confirmed in prior task's own re-inspection) — `resolveArticleReferences(logEntry.frontmatter.relatedContent, ...)` already resolves against `getAllArticles()`; only the source-side array needs a new entry |

**No code change is proposed for any of the above** — every one of these behaviors fires automatically once the MDX file and its frontmatter exist, the identical "dormant mechanism activates on real content" pattern already proven twice this milestone (Tasks 7.6, 7.7/7.8).

---

## 15. Same-Topic Impact — Resolver-Verified, Not Assumed

Per this task's own explicit instruction, `resolveSameTopicFallback()` and `resolveRelatedLearning()` (`relationships.ts`) were re-read in full and traced precisely, not asserted from memory.

```ts
// relationships.ts, confirmed current shape
function resolveRelatedLearning(article, articles = getAllArticles()) {
  const continueLearning = resolveContinueLearning(article, articles); // series-based
  const relatedConcepts = resolveRelated(article, articles);            // article's own relatedContent
  const sameTopic =
    continueLearning.length === 0 && relatedConcepts.length === 0
      ? resolveSameTopicFallback(article, articles)                    // only fires if BOTH above are empty
      : [];
  ...
}
```

`resolveSameTopicFallback(article, articles, limit=3)` filters `articles` to the same `topic`, excludes the article itself, sorts alphabetically by title (a neutral order, not a ranking claim), and caps at 3.

**With A3 filed under `distributed-systems` (§10), the only existing sibling is `optimistic-vs-pessimistic-locking`.** This document recommends A3 author an explicit `relatedContent: ["optimistic-vs-pessimistic-locking"]` (§16) — a real, editorially deliberate Knowledge→Knowledge link (`docs/58` §5's own "worth cross-linking, not merging" finding), the first such link this repository would ever have. Tracing the resolver precisely against that recommendation:

**For A3 itself**: `continueLearning` = `[]` (no series). `relatedConcepts` = `resolveRelated(A3)` → resolves A3's own authored `relatedContent` → finds `optimistic-vs-pessimistic-locking` → returns one item. Since `relatedConcepts.length > 0`, **`sameTopic` does NOT fire for A3** — the fallback tier never activates precisely because the stronger, authored relationship already fired. A3's own Related Learning page shows a **"Related Concepts"** group containing `optimistic-vs-pessimistic-locking`, not a "Same Topic" group.

**For `optimistic-vs-pessimistic-locking`** (left unedited by this document — §17 does not propose touching its frontmatter): `continueLearning` = `[]` (no series). `relatedConcepts` = `resolveRelated(locking)` → the article's own `relatedContent` is still `[]`, unchanged → returns `[]`. Since both are empty, **`sameTopic` DOES fire**: `resolveSameTopicFallback(locking, allArticles)` filters `topic === "distributed-systems"`, excludes self → finds A3 (once it exists) → returns `[A3]`. `optimistic-vs-pessimistic-locking`'s own Related Learning page gains a **"Same Topic"** group containing A3, for the first time ever (previously this group could never have any content — it was the only article in its topic).

**This is asymmetric, and this document states that precisely rather than claiming a symmetric "both articles now link to each other the same way"**: the connection is visible from *both* pages, but through two different, correctly-distinguished mechanisms — an authored, intentional "Related Concepts" link on A3's side (because A3 is the article making the deliberate editorial judgment), and a structural "Same Topic" fallback on `optimistic-vs-pessimistic-locking`'s side (because that article's own frontmatter is untouched, and the fallback tier is exactly what's supposed to catch this case per its own documented purpose — *"a graceful fallback rather than the primary navigation strategy,"* `relationships.ts`'s own docstring). This is editorially honest: the fallback fires only where no stronger, authored relationship exists, exactly as designed — not fabricated or asserted without inspecting the actual code path.

**This is the first real multi-article topic in this repository's history** — every one of the four current real topics has held exactly one article since the corpus began; `distributed-systems` reaching two articles is the first time `resolveSameTopicFallback()` will ever produce a non-empty result against real data anywhere in this codebase, confirmed by cross-checking `docs/66` §3's own corpus inventory (unchanged since that reassessment).

---

## 16. Related Content — Smallest Correct Future Metadata Changes

Per this task's own instruction, resolver directions were re-verified precisely, not assumed:

- **Knowledge's own resolver scope**: `resolveRelatedLearning()`/`resolveRelated()` (`relationships.ts`) resolve a Knowledge article's `relatedContent` **exclusively against `getAllArticles()`** (confirmed by direct re-read of `app/knowledge/[slug]/page.tsx`'s own call site: `resolveRelatedLearning(article, allArticles)` where `allArticles = getAllArticles()`). **A Knowledge article's `relatedContent` can never resolve against Work or Engineering Log — no code path anywhere in this repository reads it that way.**
- **Work's own resolver scope**: `resolveRelatedKnowledge()` (`case-study-relationships.ts`) resolves a Work document's `relatedContent` against `getAllArticles()` (Knowledge) — confirmed unchanged.
- **Engineering Log's own resolver scope**: the Log Detail route resolves a log entry's `relatedContent` against `getAllArticles()` (Knowledge) via the same shared `resolveArticleReferences()` — confirmed unchanged.

**Therefore, per this task's own explicit question**: `E4 → A3` (i.e., `cookeaze-webhook-reliability-gap.mdx` declaring `relatedContent: ["idempotency"]`) **is the only correct direction**. A reciprocal declaration — A3 declaring `relatedContent: ["cookeaze-webhook-reliability-gap"]` — **would be structurally inert**, exactly as `docs/59` §5 already established for the identical Work↔Knowledge question: no Knowledge-side resolver ever queries `getAllEngineeringLogEntries()` or `getAllCaseStudies()`. Declaring it would validate against the schema (the field itself imposes no collection-scoping) but would never be read by any resolver — a real, checkable, structural fact, not a style preference.

**The complete set of smallest correct future metadata changes, none authored by this document**:

| File | Change | Direction | Basis |
|---|---|---|---|
| `content/knowledge/idempotency.mdx` (new) | `relatedContent: ["optimistic-vs-pessimistic-locking"]` authored as part of initial creation | Knowledge → Knowledge | §15 — the first real Knowledge↔Knowledge relationship |
| `content/work/vaultpay.mdx` | `relatedContent` gains `"idempotency"` (third entry, alongside the two already there) | Work → Knowledge | §4 |
| `content/work/cookeaze.mdx` | `relatedContent` gains `"idempotency"` (first entry — currently `[]`) | Work → Knowledge | §3 |
| `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` | `relatedContent` gains `"idempotency"` (first entry — currently unset) | Engineering Log → Knowledge | §3.7 |

No schema change is required for any of these — `relatedContent: z.array(z.string()).default([])` already exists on every collection this touches.

---

## 17. Why A3 Now — Compared Against the Remaining Candidates

Per `docs/58`/`docs/66`'s own remaining-candidate lists, re-checked against current evidence, not re-optimized for completing the list:

| Candidate | Current status | Why A3 is preferred now |
|---|---|---|
| A1 (Authorization) | Evidenced (`how-jwt-works`'s own closing text cues it), untouched | Real, but a single-anchor candidate (one article, one Work connection via `haya`) — A3 has two independent Work-side anchors and one already-published Engineering Log connection |
| A2 (API Versioning) | Evidenced (`data-transfer-objects`'s own closing text cues it), untouched | Single-anchor, weaker Work connection than A1 or A3 |
| A4 (Ledger design) | Evidenced (VaultPay's own governing-rule callout), untouched | Single real anchor (VaultPay only) — A3's second, genuinely independent anchor (Cookeaze) is the differentiator `docs/66` §13 already weighted most heavily |
| A5 (Bounded concurrency) | `docs/58` §5 itself ranked this P2, weaker evidence, closer in territory to the existing locking article | Not reconsidered here — no new evidence changes `docs/58`'s own ranking |
| E1 (Docker/Puppeteer) | Still blocked on user-supplied concrete detail (`docs/61`, unchanged since `docs/66` §5) | Not a Knowledge candidate at all — different collection, different blocker (evidence gap, not prioritization) |
| E5–E7 | Explicitly gated on user framing decisions `docs/58` §18 already named | Same — not this document's candidate set |
| E2 | Deferred (`docs/65`) — not reopened, per that document's own standing instruction and this task's own scope | N/A |
| Technologies / Filtering / Series / Reading Paths | All re-confirmed still below their own stated reconsideration thresholds (`docs/66` §5, unchanged) | Not content candidates at all |

**A3 is preferred specifically because it is the only remaining Knowledge candidate with two genuinely independent real-project anchors (§4.5) plus a legitimate, already-published Engineering Log connection (§3.7) — the same "two independent projects, not one" property `docs/58` §5 originally found decisive, re-verified rather than assumed, and strengthened by this turn's discovery of Cookeaze's own explicit "Idempotency" lesson sentence (§5).**

---

## 18. Future Implementation Plan — Designed, Not Executed

### WI-1 — Re-Verify A3's Contract at Authoring Time

**Purpose**: confirm this document's §2–§4 findings haven't drifted between approval and authoring.

**Files**: none — verification only.

**Dependencies**: none.

### WI-2 — Author the Idempotency Knowledge Article

**Files**: `content/knowledge/idempotency.mdx` (new).

**Exact contract**: §9 (narrative), §10 (metadata, `publishedAt` pending §12), §13 (content boundary), §16's own `relatedContent: ["optimistic-vs-pessimistic-locking"]`.

**Dependencies**: WI-1; the user-supplied `publishedAt` (§12) must be provided before this can be finalized.

### WI-3 — Apply the Three Approved Related-Knowledge Additions

**Files**: `content/work/vaultpay.mdx`, `content/work/cookeaze.mdx`, `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` — each gains exactly one `relatedContent` entry (`"idempotency"`), per §16's table. No other field in any of the three changes.

**Dependencies**: WI-2 (the slug must exist as a real value before it's referenced).

### WI-4 — Release Candidate Review

**Purpose**: the release gate (§19).

**Dependencies**: WI-1 through WI-3 complete.

### Exact future production manifest, derived directly from resolver direction (§16), not assumed

| File | Change |
|---|---|
| `content/knowledge/idempotency.mdx` | New |
| `content/work/vaultpay.mdx` | Modified — `relatedContent` only |
| `content/work/cookeaze.mdx` | Modified — `relatedContent` only |
| `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` | Modified — `relatedContent` only |

**Four files.** No schema, resolver, route, component, Search, RSS, Sitemap, or navigation file appears anywhere in this manifest — every one of §14's Discovery Impact behaviors activates automatically once these four files exist in this exact shape.

---

## 19. Future Release Gate — Specified for the Implementation Task, Not Run Here

**Content**
1. `idempotency.mdx` frontmatter validates against `articleFrontmatterSchema`/`knowledgeFrontmatterSchema` — `pnpm build` parses it without error.
2. Slug is exactly `idempotency`, unique, no collision with any real content file (re-verified, §10).
3. Topic is exactly `distributed-systems`, a valid `TOPIC_SLUGS` member.
4. Tags exactly `["idempotency", "correctness", "concurrency", "payments"]` — no substitution, no `distributed-systems` duplicate (§10).
5. Technologies field absent or empty — no value invented (§10).
6. No `series`/`seriesOrder` field present — confirming no Series was invented (§10).
7. `featured` absent or `false` — confirming §11's recommendation was followed, not silently reversed.
8. `publishedAt` is a real, user-supplied date — not a reused project date, not fabricated (§12).
9. Every claim in the body traces to §13's Direct-evidence or Editorial-synthesis rows; no Unsupported-row content appears anywhere.
10. The generic `SET x=5` example (if used) is clearly labeled as generic, not attributed to either project.

**Evidence accuracy**
11. Both VaultPay and Cookeaze quotes/paraphrases match the live case-study text exactly, re-checked at implementation time (content can drift between plan approval and execution).

**Relationships**
12. `E4 → idempotency` resolves and renders correctly on `/engineering-log/cookeaze-webhook-reliability-gap`'s own Related Knowledge section.
13. `vaultpay`/`cookeaze` each show `idempotency` in their own Related Knowledge sections, alongside (for VaultPay) the two pre-existing entries — order preserved, nothing removed.
14. `idempotency`'s own Related Concepts section shows `optimistic-vs-pessimistic-locking`.
15. **Same-Topic behavior matches §15's exact, resolver-derived prediction**: `optimistic-vs-pessimistic-locking` gains a "Same Topic" group containing `idempotency`; `idempotency` itself shows **no** "Same Topic" group (superseded by its own Related Concepts) — not the reverse, and not symmetric.

**Discovery**
16. `/knowledge/distributed-systems` lists both real articles, count = 2.
17. `/search?q=idempotency` returns the new article.
18. `/rss.xml` includes it, positioned by its real `publishedAt`.
19. `/sitemap.xml` includes `/knowledge/idempotency`.

**Regression**
20. `/knowledge`, `/knowledge/backend`, `/knowledge/architecture`, `/knowledge/security`, `/work/vaultpay`, `/work/cookeaze`, `/engineering-log/cookeaze-webhook-reliability-gap`, `/search`, `/rss.xml`, `/sitemap.xml` — all render correctly, no unrelated content changed.
21. `data-transfer-objects`, `how-jwt-works`, `money-floating-point` — unaffected (§11's "not featured" decision means Start Here composition is unchanged).
22. `haya.mdx`, `gohunt.mdx`, `haya-invitation-gate-removal.mdx` — zero diff, confirmed via `git diff`.

**Automated**
23. `pnpm exec eslint` clean.
24. `pnpm exec tsc --noEmit` clean.
25. `pnpm build` clean.

**Git**
26. `git status --short` / `git diff -- content/` shows exactly the four files in §18's manifest, only the fields specified — no unrelated content change.

---

## 20. Guardrails

- No `.mdx` file created by this document.
- No existing content file modified — the four future changes (§16, §18) are evidenced and recommended, not executed.
- No schema, resolver, route, component, Search, RSS, Sitemap, or navigation file touched.
- No new topic invented — filed under the existing `distributed-systems` (§10).
- No new tag-vocabulary system — one free-form tag addition (`idempotency`), consistent with `docs/51` Decision 4, unreversed.
- No Series invented (§10).
- No publication date invented (§12).
- `featured: true` not recommended (§11).
- E2 (`docs/65`) not reopened.
- The only file created by this task is `docs/67-KNOWLEDGE_IDEMPOTENCY_EDITORIAL_PLAN.md` itself.

---

## Final Report

1. **Current Knowledge corpus** — §2: four real articles, four distinct topics, zero cross-links, zero series, zero technologies; schema re-confirmed to require no change.
2. **A3 evidence anchors** — §3–§4: both re-verified against complete case-study bodies; VaultPay (idempotency-key table, named requirement, rejected Redis alternative) and Cookeaze (unique-reference constraint, explicit "Idempotency" lesson sentence) both independently support a Knowledge article.
3. **Cookeaze/E4 evidence** — §3: E4's own prose describes the identical mechanism without using the term itself; the relationship is grounded in the specific "safe no-op on a second resolution" behavior, not a generic retry/redelivery inference.
4. **Second-project evidence (VaultPay)** — §4: genuinely independent failure mode and implementation shape from Cookeaze's, not an incidental mention elevated into the thesis.
5. **Article thesis** — §6: a real guarantee requires deliberate, data-layer enforcement, not an assumption about caller behavior — the one claim both anchors directly, independently support.
6. **Article scope** — §7: each candidate concept individually evaluated against the thesis; HTTP-method idempotency and distributed-consensus material explicitly excluded as unevidenced.
7. **Repository evidence vs. editorial synthesis** — §6, §13: fully separated in a dedicated content-boundary table, with an explicit Requires-confirmation row (`publishedAt`) and multiple explicit Unsupported rows.
8. **Existing Knowledge style findings** — §8: all four real articles read completely; identical heading structure, code-example density, callout-free body, and closing convention confirmed and matched.
9. **Proposed title/description/slug** — §10: stated and justified; slug verified unique this turn.
10. **Topic** — §10: `distributed-systems`, reasoned (not defaulted) and independently corroborated by `docs/18`'s own pre-existing verification-fixture example.
11. **Tags** — §10: `idempotency` (new), `correctness`/`concurrency`/`payments` (existing); the topic/tag collision risk explicitly avoided.
12. **Technologies** — §10: none recommended; no evidenced need.
13. **Series** — §10: none invented; explicitly confirmed absent.
14. **Featured decision** — §11: not recommended, with the exact Start Here composition consequence (eviction of `data-transfer-objects`) calculated precisely and stated as the reason to decline, not discovered as a surprise.
15. **Publication-date decision** — §12: explicit user input required; no project date reused, none invented.
16. **Related Content decision** — §16: `E4 → idempotency` confirmed as the only correct direction via direct resolver re-inspection; a reciprocal declaration confirmed structurally inert, not merely stylistically discouraged.
17. **Same-topic impact** — §15: resolver-traced precisely; the resulting relationship is asymmetric (Related Concepts on A3's side, Same Topic fallback on `optimistic-vs-pessimistic-locking`'s side) and this is the first real multi-article topic in the repository's history.
18. **Discovery impact** — §14: every system checked individually against its actual current source file; zero code change required anywhere.
19. **Why A3 is the next priority** — §17: compared individually against every other named candidate, not assumed by elimination.
20. **Future implementation manifest** — §18: four files, derived directly from resolver direction, not guessed.
21. **Future work items** — §18: WI-1 through WI-4, sequenced and dependency-stated.
22. **Regression risks** — implicit throughout §19's regression checks (items 20–22), covering every document this design touches or cites.
23. **Release gate** — §19: 26 individually stated checks across content, evidence, relationships, discovery, regression, automated, and git categories.
24. **Guardrails** — §20: every boundary this task specified, individually confirmed.
25. **Git verification**: `git status --short` at the time of writing shows only this document as new (alongside the prior turn's `docs/65`/`docs/66`, untouched by this task); zero diff on any content, schema, resolver, route, component, or navigation file.

**APPROVED — A3 editorial design is ready for implementation planning.**
