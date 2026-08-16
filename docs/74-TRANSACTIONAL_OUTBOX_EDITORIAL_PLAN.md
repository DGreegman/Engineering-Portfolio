# 74 — Knowledge Candidate "Transactional Outbox" — Editorial Discovery

## Status

Proposal — awaiting review and approval.

> No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce this document.

Task 7.21's editorial-discovery turn, following `docs/73`'s downgrade of A1. This candidate is not assumed approved merely because it surfaced as the strongest alternative — the same evidentiary standard that disqualified A1 is applied here, in full, against VaultPay's complete case-study text re-read this turn.

---

## 1. Executive Recommendation

**Approved, with one honest evidence caveat carried into the eventual article.** VaultPay's "Decision: Transactional Outbox for Downstream Events" is a complete, dedicated Engineering Decision — Alternatives Considered, Trade-offs, and Rationale all present, re-read in full this turn — grounding a precise, self-contained thesis distinct from every other real or published Knowledge/Engineering-Log content in this repository. The one caveat, found by re-reading the *complete* case study rather than the single decision paragraph (per this task's own instruction): the case study's own "Implementation" section places "the outbox/webhooks/audit logging layer" **after** "the current phase," meaning the downstream *consumption* side of this pattern (the relay poller, the RabbitMQ hand-off, actual webhook/notification delivery) is documented as planned, not yet built — while the *transactional write itself* ("the ledger already writes to" the outbox) is stated in the present tense, i.e., already real. This distinction must be preserved honestly in the eventual article, not smoothed over.

**Conclusion: APPROVED — Transactional Outbox editorial design is ready for implementation planning.**

---

## 2. Why This Candidate Surfaced

`docs/73` §3 found A1 (Authorization) disqualified by a direct content-overlap with E3 and an absence of any dedicated Engineering Decision anywhere in the corpus for authorization specifically. During that same complete re-read of VaultPay's case study, one of its five real Engineering Decisions — Transactional Outbox — was found to be fully documented and not yet claimed by either `idempotency.mdx` or `append-only-ledger.mdx`, both of which explicitly scoped it out as "supporting detail, not central" (`docs/70` §2's own evidence table). This document re-verifies that finding from scratch rather than inheriting it.

---

## 3. Current Corpus Snapshot — Re-Verified This Turn

6 Knowledge articles, 4 Work case studies, 2 Engineering Log entries, 12 total real documents — unchanged since `docs/72`/`docs/73`, re-confirmed by direct directory listing this turn. One metadata change has landed since `docs/73`: `content/work/cookeaze.mdx` now carries `relatedContent: ["idempotency"]` (Task 7.19) — the one previously-open metadata-only opportunity is now closed (§20).

---

## 4. VaultPay Evidence Inventory — Complete Re-Read, Not a Single Paragraph

Every passage in `content/work/vaultpay.mdx` relevant to outbox/downstream-events/consistency/failure-handling, located and quoted exactly:

| Section | Passage | Note |
|---|---|---|
| Architecture (system diagram + prose) | *"PostgreSQL is the single source of truth — `ledger_entries`..., `wallet_balances`..., `idempotency_keys`, and `outbox_events` (for reliably publishing what happened, addressed below)."* | Names the table as part of the current data model |
| Architecture (prose, continued) | *"Asynchronous work (notifications, webhooks) is planned to move through RabbitMQ in a later phase, consumed from the same outbox the ledger already writes to."* | **The critical, precise sentence**: "the ledger already writes to" (present tense — the write side is real) vs. "is planned to move through RabbitMQ in a later phase" (future — the consumption/delivery side is not yet built) |
| Engineering Decisions → "Decision: Transactional Outbox for Downstream Events" | *"**Alternatives Considered:** Publishing to a queue directly from the request handler, immediately after writing the ledger. **Trade-offs:** Downstream consumers (notifications, webhooks) see an event slightly after the ledger write commits, via a relay poller, rather than immediately. **Rationale:** If the queue publish happens outside the database transaction and fails, the money movement is real but nobody downstream ever hears about it — or the reverse. Writing the event to an `outbox_events` table in the same transaction as the ledger entry means the event's existence is exactly as durable as the money movement it describes."* | The complete, dedicated decision record |
| Implementation | *"The project is being built in phases — scaffolding, then core wallets/auth/transfers, then the double-entry ledger with idempotency and concurrency control (**the current phase**), then **the outbox/webhooks/audit logging layer**, then fraud detection, then KYC tiers, then multi-currency support."* | **Confirms the phasing**: the outbox/webhooks *layer* (the consumption/delivery machinery) is explicitly the *next* phase, not the current one |
| Outcome | *"VaultPay is a working, phased implementation... Phase 2 (the ledger, idempotency, and concurrency control this case study documents) is the current stage of a six-phase roadmap."* | Corroborates: Phase 2 is ledger/idempotency/concurrency; the outbox consumption layer is a later phase |

**No other passage in the complete case study touches this topic** — re-confirmed by full-text search this turn, not assumed.

---

## 5. Evidence Classification

| Claim | Classification | Basis |
|---|---|---|
| An event describing a state change should be written in the same database transaction as that change | **Direct evidence** | The Decision's own Rationale, quoted in full (§4) |
| The alternative (publishing to a queue directly from the request handler) risks a state change with no corresponding event, or the reverse | **Direct evidence** | The Decision's own Alternatives Considered + Rationale |
| Downstream consumers see the event slightly later, via a relay poller, rather than immediately | **Direct evidence** | The Decision's own Trade-offs |
| The write of the event into `outbox_events` is already happening (present tense) | **Direct evidence** | Architecture's own "the ledger already writes to" phrasing |
| The consumption/delivery layer (relay poller → RabbitMQ → webhooks/notifications) is a planned, not-yet-reached phase | **Direct evidence** | Implementation's own explicit phase ordering — **this caveat must be preserved in the article, not omitted** |
| General explanation of the "dual-write problem" (two independent systems, no shared transaction, one succeeding without the other) | **General engineering explanation** | Standard, portable concept; not attributed to VaultPay |
| General explanation of at-least-once vs. exactly-once delivery semantics | **General engineering explanation**, used only if kept generic | Not documented for VaultPay specifically — see forbidden list below |
| Exact relay-poller polling interval, retry policy, RabbitMQ topology, exchange/queue naming, delivery-semantics guarantee, isolation level, or any database schema beyond the four named tables | **Forbidden** | Not stated anywhere in the source; none of these details exists in the case study |
| Whether the outbox mechanism has ever been exercised under real production load or failure | **Requires confirmation / honestly absent** | Not stated; the case study's own "not yet load-tested" caveat (already required for A4, `docs/70` §14) applies with equal or greater force here, since this specific layer is explicitly *less* built than the ledger/idempotency mechanisms A4 already covers |

**Only rows classified Direct evidence, safe Editorial restructuring (none proposed beyond direct restatement here), and clearly-labeled General engineering explanation may enter the eventual article — consistent with every prior editorial plan in this series.**

---

## 6. Exact Central Thesis

> **An event that announces a state change is only as trustworthy as the transaction that produced it — publishing it as a separate step, outside that transaction, reopens exactly the gap the change was supposed to close.**

Not *"What is the Transactional Outbox pattern?"* — that framing would invite a generic textbook survey. This thesis is the precise claim VaultPay's own Rationale makes (§4, §5), stated once, generalized past VaultPay's own domain the same way `idempotency.mdx`'s own thesis was generalized past its two source projects (`docs/67` §3's own precedent for this exact move). It is useful beyond VaultPay (any system that both mutates state and needs to tell something else about it has this exact problem) while remaining fully traceable to what VaultPay actually documented.

---

## 7. What the Article Owns

The relationship between a local transaction, the state it changes, and an event announcing that change to a system outside the transaction's own boundary — specifically, why writing the event *inside* the same transaction (not immediately after) is what makes the event's existence match the state change's own durability. This is not owned by any other real or published content in this repository (§8).

---

## 8. Existing Knowledge Overlap Boundaries — All Six Articles, Plus E3/E4, Individually Checked

| Existing content | What it owns | Overlap risk with Outbox |
|---|---|---|
| `how-jwt-works` | Authentication | None |
| `optimistic-vs-pessimistic-locking` | Serializing concurrent writers to the same row | **None** — Outbox's own failure mode is about a single writer's transaction boundary relative to a *separate* downstream system, not about two writers contending for the same resource. Cleaner boundary than A4 ever had with this article (A4 at least had concurrency as motivating context; Outbox does not). |
| `data-transfer-objects` | Boundary-shaped types across fetch/store/expose | None |
| `money-floating-point` | Numeric representation | None |
| `idempotency` | Making a **repeated** operation safe | **Precise boundary, not merged**: idempotency governs what happens when the *same* event/operation arrives more than once; Outbox governs whether the event is *sent at all*, reliably, in the first place. A relay poller *retrying* a failed publish could redeliver — meaning a real system built this way still needs its consumer to be idempotent — but that is a downstream consequence Outbox's own article should name as a boundary and a forward pointer (§10, §11), not re-teach. |
| `append-only-ledger` | Where a value's source of truth lives, derived from immutable history | **Precise boundary, not merged**: the ledger governs *internal* correctness of a computed value; Outbox governs *reliable external communication* that a change happened. A system can have a flawless append-only ledger and still silently lose every webhook notification without an outbox — the two are complementary, solving different halves of the same real system's correctness story (both, not coincidentally, present side-by-side in VaultPay's own architecture). |
| E3 (Haya, access control) | Access-control-model evolution | None — no shared subject matter |
| E4 (Cookeaze, webhook reliability) | An **inbound** webhook that might never arrive, solved by a poller that pulls | **Mirror-image relationship, not a repeat**: E4 solves "what if a webhook we're *waiting to receive* never shows up"; Outbox solves "what if an event we're *supposed to send* is silently lost because we crash between the DB commit and the publish." Same broad theme (webhook/event reliability), opposite direction, genuinely complementary rather than duplicative — worth narrating as a comparison in the article's own prose, **not** grounds for an authored relationship (§9 explains why the resolver architecture doesn't support it anyway). |

**No overlap found that would make this article redundant with anything already published or already designed.**

---

## 9. Real Project Anchors

**VaultPay is the sole legitimate anchor — confirmed, not assumed, by direct re-inspection of the other three real case studies this turn**:

- **Cookeaze**: uses a webhook-plus-poller *redundancy* pattern (two independent paths racing to resolve the same fact), not a transactional-outbox pattern (writing an event in the same transaction as a state change for later, reliable delivery). Structurally different mechanism — not an independent anchor for this specific concept.
- **Haya**: no event-publishing, message-queue, or downstream-notification mechanism is documented anywhere in its case study.
- **GoHunt**: explicitly single-user, no downstream-consumer or notification architecture exists or is claimed.

**No connection is inferred from generic words** (`event`, `webhook`, `queue`, `async`, `retry`) appearing elsewhere in the corpus without the actual outbox mechanism being described — per this task's own explicit instruction, each of the three non-anchors above was checked against its own real text, not its own use of adjacent vocabulary.

---

## 10. Rejected Anchors and Evidence

- **Cookeaze and Haya as co-anchors** — rejected (§9); neither documents the actual mechanism.
- **E4 as a relationship target** — the mirror-image conceptual connection is real (§8) but **not evidenced strongly enough to author a relationship**: E4's own prose never describes an outbox-shaped mechanism, and no resolver in this repository supports a Knowledge → Engineering Log direction in the first place (confirmed, re-verified against `relationships.ts` this turn — Knowledge's own `relatedContent` resolves exclusively against `getAllArticles()`). Rejected on both evidentiary and architectural grounds, not merely one.
- **RabbitMQ as a taught technology** — rejected (§14); named in the source, but explicitly as a *planned*, not-yet-implemented broker, doubly inappropriate to enshrine as a `technologies` value.
- **`optimistic-vs-pessimistic-locking` as a relationship target** — considered and rejected; no genuine conceptual overlap exists (§8), and forcing one would repeat exactly the "adjacent-sounding but textually unsupported" mistake `docs/73` found disqualifying for A1's own `haya` relationship.

---

## 11. Related Content Opportunities

| Source | Target | Direction | Evidence | Meaningful? | Future metadata change |
|---|---|---|---|---|---|
| The new article | `idempotency` | Authored, Knowledge → Knowledge | Both anchored in VaultPay's own architecture (`idempotency_keys` and `outbox_events` sit side by side); a relay poller retrying a failed publish is a real reason a consumer needs idempotency | Yes — the natural "next question" a reader would have | New article's own `relatedContent` includes `"idempotency"` |
| The new article | `append-only-ledger` | Authored, Knowledge → Knowledge | Same VaultPay anchor; complementary halves of the same real system's correctness story (§8) | Yes | New article's own `relatedContent` includes `"append-only-ledger"` |
| `vaultpay.mdx` | The new article | Authored, Work → Knowledge | VaultPay is the sole, complete anchor (§9) | Yes — the obvious, primary relationship | `vaultpay.mdx`'s `relatedContent` gains a fourth entry |
| E4 | The new article | Would-be Engineering Log → Knowledge | Conceptually real (§8) but textually absent from E4's own prose | **Rejected** (§10) | None proposed |
| `optimistic-vs-pessimistic-locking` | The new article | Would-be Same-Topic (if same topic) or authored | No genuine conceptual overlap | **Rejected** (§10) | None — though Same-Topic fallback will still connect them automatically if both land in `distributed-systems`, which is a resolver behavior, not an authored claim (§18) |

**No relationship is added by this document. No reciprocal metadata is proposed on any existing file — `idempotency.mdx` and `append-only-ledger.mdx` both stay untouched, consistent with this series' own established discipline (`docs/67` §16, `docs/70` §6/§23) of leaving existing target articles unedited and letting Same-Topic fallback (where applicable) or one-directional authored links carry the relationship.**

---

## 12. Topic Decision

**Recommendation: `distributed-systems`.**

**Reasoning, not a default**: the article's actual failure mode (§6) is specifically about **two independent systems — a local database and an external message broker — with no shared transaction, needing to agree on a fact.** This is a canonical distributed-systems problem (sometimes named "the dual-write problem"), arguably a more central distributed-systems concern than `append-only-ledger`'s own placement (which is about a single system's internal state derivation, no second system involved at all). `architecture` was considered and is a credible runner-up (the mechanism is, mechanically, about how writes are structured), but the specific failure this decision addresses only exists because of a network/process boundary between two systems — the deciding factor.

**Current article count**: `distributed-systems` currently holds 2 (`optimistic-vs-pessimistic-locking`, `idempotency`). Adding this article would make it **3 — the first topic in this repository's history to reach three real articles**, a genuinely new milestone, not a repeat of the two-article pattern A4 already proved.

**Same-Topic impact, traced precisely, not assumed**: the new article's own `relatedContent` (§11) will be non-empty, so Same-Topic fallback will not fire for it. `optimistic-vs-pessimistic-locking` (left untouched, its own `relatedContent` still empty) will gain a **two-card** "More From This Topic" group — `idempotency` and the new article both — the first time this fallback group has ever shown more than one card. `idempotency` itself will **not** show the new article anywhere on its own page, because its own `relatedContent` is already non-empty (pointing at `optimistic-vs-pessimistic-locking`) and is not proposed to be edited — the relationship is visible only from the new article's own page and from `optimistic-vs-pessimistic-locking`'s fallback group, not from `idempotency`'s.

**Previous/Next impact**: the new article would participate in `findTopicNeighbor()`'s alphabetical ordering within `distributed-systems`, alongside the other two — the exact neighbor pairing depends on the article's final title, not predicted here.

---

## 13. Tag Decision

| Tag | Status | Current usage | Why it fits | Discovery effect |
|---|---|---|---|---|
| `outbox` | **New** — confirmed absent from the current 24-value vocabulary | None | Names the specific mechanism, the same "name the pattern, don't rely on an umbrella term" precedent `idempotency`/`ledger`/`webhooks`/`access-control` already set | Singleton on arrival, expected |
| `reliability` | Existing, but **currently Engineering-Log-only** (E4 alone) | 1 document | The article's entire concern is reliable event publication | **Would make `reliability` cross-collection for the first time (Knowledge + Engineering Log)** — a genuinely new discovery effect, distinct from `payments`'s own already-established three-collection status |
| `correctness` | Existing | `money-floating-point`, `idempotency`, `optimistic-vs-pessimistic-locking`, `append-only-ledger` (4 Knowledge docs) | The guarantee being taught is a correctness guarantee (the event and the state change must agree) | Deepens an already-strong Knowledge-internal cluster |
| `payments` | Existing, already spans all three collections | 6 real documents | VaultPay's own real-world grounding, the same role this tag plays for `idempotency`/`append-only-ledger` | Deepens the one tag that already spans all three collections |

**Deliberately not tagged `distributed-systems`** — that is the proposed topic value, avoiding the one collision this corpus has already flagged and avoided twice (`docs/58` §10, `docs/67` §10, `docs/70` §8).

**Not tagged `concurrency`** — considered and rejected: unlike `append-only-ledger`, concurrency is not even contextually present in this specific decision's own Rationale (§4) — no concurrent-writer scenario is described anywhere in the outbox decision text, only a single-writer-vs-external-system failure mode. Tagging it would misrepresent the article's actual scope.

---

## 14. Technology Decision

**No `technologies` value is recommended.**

VaultPay's own text names `outbox_events` (a table, not a technology) and RabbitMQ (a broker) — but RabbitMQ is explicitly documented as a **planned**, not-yet-implemented piece of the architecture (§4), making it doubly inappropriate to enshrine as a taught technology: it would misrepresent both (a) the article's own portable thesis, which applies regardless of broker choice, and (b) VaultPay's own real, current implementation status. This mirrors the identical decision already made for `idempotency` and `append-only-ledger` (`docs/67` §10, `docs/70` §9) — the third consecutive Knowledge article to correctly decline a Technology assignment despite its Work-side anchor having a real, populated `technologies` field.

---

## 15. Series Decision

**None.** Re-confirmed this turn: zero real `series`/`seriesOrder` values anywhere across all 12 real documents. No Series is invented merely because this would be VaultPay's fourth Knowledge-derived article.

---

## 16. Featured Decision

Current featured state, re-confirmed this turn: `how-jwt-works`, `money-floating-point` — unchanged since Task 7.6. Current Start Here fallback slot is occupied by `append-only-ledger` (`2026-08-16`, winning its tie with `idempotency` by filesystem/array order, per Task 7.17's own live-verified outcome).

**Calculated effect if this article were featured**: the featured group would reach exactly 3, filling `getFeaturedArticles()`'s cap entirely — zero fallback slots would remain, and `append-only-ledger` (the article currently occupying that slot) would be displaced from Start Here. The identical mechanical consequence already observed twice (A3 displacing `data-transfer-objects`; A4 displacing `idempotency` via date tiebreak).

**Recommendation: do not feature it.**

**Reasoning**: the two current Knowledge featured picks were both chosen as the most *approachable* entry points (`beginner` difficulty). This article's likely difficulty (intermediate-to-advanced, given VaultPay's own `advanced` rating and the specificity of the transactional-boundary concept) does not fit that rationale — the identical reasoning already applied to A3 and A4 (`docs/67` §11, `docs/70` §17).

---

## 17. Publication-Date Requirement

> **Not chosen. Explicit user confirmation is required before authoring.**

No date is invented; VaultPay's own `publishedAt` is not reused, today's date is not assumed, and no historical/event date is substituted — identical discipline to every prior editorial plan in this series (`docs/67` §12, `docs/70` §18).

---

## 18. Proposed Article Structure

Following the same, consistently-used Knowledge template (`docs/18`, re-confirmed against all six real articles): Introduction → The Problem → The Core Concept → Visual Model → Implementation → Trade-offs → Common Mistakes → Real-world Examples → Key Takeaways → Related Learning. **Not** the Work Case Study structure.

Only sections the evidence and thesis actually support:

1. **Introduction** — a state change and an announcement of that change are two different writes; what happens when only one of them succeeds.
2. **The Problem** — publishing an event immediately after (not as part of) the transaction that produced it creates a window where the database commits and the publish fails, or the publish "succeeds" and the transaction later rolls back — the "dual-write problem," stated in general terms.
3. **The Core Concept** — write the event in the *same* transaction as the change it describes, so the two either both happen or neither does; a separate process then reads the outbox and delivers, on its own schedule, decoupled from the original request.
4. **Visual Model** — contrast a same-transaction outbox write against a publish-after-commit call, mirroring VaultPay's own architecture shape.
5. **Implementation** — the general pattern: an outbox table written in the same transaction as the business change; a separate relay process reads and delivers, marking rows delivered. Grounded directly in VaultPay's own `outbox_events` table and its stated Rationale (§4), with the delivery-side caveat (§5, row 5) stated plainly, not omitted.
6. **Trade-offs** — Advantages (the event's existence has the same durability guarantee as the change) / Disadvantages (delivery is no longer immediate — VaultPay's own stated trade-off) / Alternatives (publishing directly from the request handler, explicitly rejected by VaultPay) / When not to use it (general editorial synthesis — a value with no downstream consumer that needs to know doesn't need this).
7. **Common Mistakes** — assuming a queue publish immediately after a commit is "basically the same thing" as doing it in the same transaction; forgetting that a relay poller's own retries mean the consumer must be idempotent (the explicit, correctly-bounded forward pointer to `idempotency`, §11).
8. **Real-world Examples** — VaultPay, named directly, with the write-vs-delivery distinction (§4) stated honestly rather than implying the full pipeline is production-proven.
9. **Key Takeaways** — concise summary.
10. **Related Learning** — links to `idempotency` and `append-only-ledger`, each with its own stated boundary (§8, §11); `distributed-systems` topic link.

---

## 19. Code / Diagram Policy

- **VaultPay evidence**: the `outbox_events`/`ledger_entries` table relationship, and the "write in the same transaction" mechanic, may be shown grounded in VaultPay's own stated architecture — explicitly labeled as VaultPay's own design where attributed.
- **Illustrative educational examples**: any SQL/pseudocode showing the general "write state + event in one transaction, relay reads and delivers separately" pattern must be labeled illustrative, the same discipline already applied to `append-only-ledger`'s own generic SQL block (`docs/71` §10/§11).
- **Forbidden**: any RabbitMQ-specific configuration, exchange/queue topology, exact polling interval, retry policy, or delivery-semantics guarantee — none of this is documented, and inventing it would misrepresent both the general pattern (which doesn't require any specific broker) and VaultPay's own real, still-partial implementation status (§4, §5).

---

## 20. Discovery Impact

| System | Impact | Conditional on publication date? |
|---|---|---|
| Topic (`distributed-systems`) | 2 → **3** real articles — the first three-article topic in this repository | No |
| Same-Topic fallback | `optimistic-vs-pessimistic-locking` gains a two-card "More From This Topic" group (`idempotency` + the new article) — the first multi-card fallback group ever rendered | No |
| Knowledge Previous/Next | The new article participates in the topic's alphabetical neighbor ordering, alongside the other two | No — mechanism is date-independent (alphabetical by title within topic) |
| Related Concepts | New article's own page shows `idempotency` and `append-only-ledger` | No |
| Work → Knowledge | `vaultpay.mdx`'s own Related Knowledge grows to **four** real entries — the most of any Work document | No |
| Engineering Log → Knowledge | No change — no relationship is evidenced (§10) | No |
| Search | Discoverable via `outbox` (new), `reliability`, `correctness`, `payments`, plus title/description text | No |
| RSS | Would appear, positioned by its real `publishedAt` once supplied | **Yes — conditional, not predicted** |
| Sitemap | One new URL | No — count increases by exactly one regardless of date |

---

## 21. Candidate Comparison — Re-Derived Against Current Evidence

| Candidate | Dedicated decision? | Anchors | Overlap risk | New writing | Status |
|---|---|---|---|---|---|
| **Transactional Outbox** | **Yes**, complete (§4) | 1 (VaultPay), sole and sufficient | Low, precisely bounded (§8) | Full article | **This document's recommendation** |
| A1 (Authorization) | None anywhere in the corpus | 0 usable; 1 disqualified by E3 overlap | High | Full article | Downgraded (`docs/73`) |
| A2 (API Versioning) | None | 0 real; 1 motivational cue only | Moderate-high (would restate `data-transfer-objects`) | Full article | Weaker than A1, unchanged |
| `cookeaze` → `idempotency` (metadata only) | N/A | N/A | N/A | None | **Already completed** (Task 7.19) — no longer an available candidate |

**Project concentration, named honestly, not hidden**: authoring this article would make VaultPay the source of **four** of the repository's real Knowledge articles' Work-side connections — a real, growing concentration `docs/70` §21 already flagged once and this document does not pretend has gone away. Unlike A1's own disqualifying problem, this concentration is not accompanied by a content-overlap defect (§8 finds none) — it is a diversity trade-off worth naming, not a redundancy problem worth blocking on, the identical distinction `docs/70` §21 already drew for A4 itself.

---

## 22. Risks

- **The write-vs-delivery evidence gap (§4, §5)** — the single largest risk to article quality: if the eventual author implies the full outbox-to-webhook pipeline is production-proven, that would misrepresent the source. Mitigated by stating this caveat explicitly in this document (§1, §5) and requiring it be preserved in the article itself (§18, step 5/8).
- **Idempotency re-teaching risk** — a real risk given the natural adjacency (§8); mitigated by the explicit "name it, point to it, don't re-teach it" boundary already stated (§8, §18 step 7).
- **Project concentration** — named, not hidden (§21); not disqualifying on its own.
- **No regression risk from this document itself** — no production file was touched (§24).

---

## 23. Implementation Footprint Prediction

**New**: `content/knowledge/transactional-outbox.mdx` — verified this turn, no slug collision anywhere in `content/knowledge/`, `content/work/`, or `content/engineering-log/`.

**Existing metadata edit required**: `content/work/vaultpay.mdx` — `relatedContent` gains a fourth entry, the same one-line, resolver-proven pattern already used three times for this exact file (Tasks 7.6, 7.17).

**No other file.** No schema, resolver, route, component, Search, RSS, Sitemap, or navigation change — every behavior in §20 activates automatically through infrastructure already proven across four prior content rounds this milestone. `idempotency.mdx`, `append-only-ledger.mdx`, `optimistic-vs-pessimistic-locking.mdx`, `cookeaze.mdx`, `haya.mdx`, `gohunt.mdx`, and both Engineering Log entries must all remain untouched — none is evidenced as needing a change.

**None of these edits is made by this document.**

---

## 24. Open Questions

**One, carried forward from the same category `docs/70`/`docs/67` already used**: the exact `publishedAt` value (§17) — the only expected open implementation input, per this task's own instruction.

**No other open question was found.** The write-vs-delivery evidence nuance (§4, §5) is not an open question — it is a resolved, precisely-stated content-boundary requirement for the eventual article, not a gap requiring further discovery.

---

## 25. Recommended Next Step

Commission an implementation plan (mirroring `docs/68`/`docs/71`'s own structure) translating this document's approved contract into an exact, dependency-ordered specification — the same two-stage process this milestone has used for every prior content addition. **No implementation is authorized by this document.**

---

## Guardrails

No production file was created or modified. Only `docs/74-TRANSACTIONAL_OUTBOX_EDITORIAL_PLAN.md` was created.

```
git status --short
```

Confirmed: only `docs/65`–`docs/73` (prior turns' own outputs, untouched by this task) and `docs/74` (this document) appear as new paths under `docs/`; the modified content files (`content/knowledge/idempotency.mdx`, `content/knowledge/append-only-ledger.mdx`, `content/work/vaultpay.mdx`, `content/work/cookeaze.mdx`, `content/engineering-log/cookeaze-webhook-reliability-gap.mdx`) are all prior tasks' (7.13/7.17/7.19) own already-approved, pre-existing output — not attributable to this task. `git diff --stat -- content/ src/` shows zero change attributable to this document.

---

## Final Report

1. **Recommendation**: Approved, with one evidence caveat carried forward into the eventual article (§1).
2. **Evidence strength**: one complete, dedicated Engineering Decision — Alternatives/Trade-offs/Rationale all present — stronger than A1's zero and comparable in shape to A3's/A4's own anchors (§4).
3. **Exact VaultPay anchors**: the "Decision: Transactional Outbox for Downstream Events" record, plus corroborating Architecture and Implementation passages (§4).
4. **Thesis**: an event is only as trustworthy as the transaction that produced it (§6).
5. **Existing-content overlap**: none found across all six Knowledge articles and E3/E4, each individually checked with a stated boundary (§8).
6. **Rejected evidence**: Cookeaze and Haya as co-anchors; E4 as a relationship target; RabbitMQ as a technology; locking as a relationship target (§9, §10).
7. **Relationship opportunities**: `vaultpay → [new article]` (primary), `[new article] → idempotency`, `[new article] → append-only-ledger` — all evidenced, none authored by this document (§11).
8. **Topic/tags/technology decisions**: `distributed-systems` (reasoned, creates the first three-article topic); `outbox` (new), `reliability` (new cross-collection use), `correctness`, `payments`; no technology (§12–§14).
9. **Featured decision**: not featured, with the exact Start Here consequence calculated in advance (§16).
10. **Publication-date requirement**: explicit user input required, not invented (§17).
11. **Proposed article structure**: full section-by-section plan, evidence-bounded (§18).
12. **Discovery impact**: every system individually assessed; RSS explicitly marked conditional on the unresolved date, per this task's own instruction (§20).
13. **Candidate comparison**: re-derived; this candidate is stronger than A1/A2 on dedicated-evidence grounds; the one previously-available metadata-only opportunity is already complete (§21).
14. **Implementation footprint prediction**: exactly two files, both individually justified (§23).
15. **Open questions**: exactly one — publication date (§24).
16. **Git verification**: confirmed via `git status --short`; zero production change attributable to this task.

**APPROVED — Transactional Outbox editorial design is ready for implementation planning.**
