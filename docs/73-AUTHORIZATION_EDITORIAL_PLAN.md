# 73 — Knowledge Candidate A1 "Authorization" — Editorial Discovery

## Status

Proposal — evidence re-derived, recommendation revised.

> No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or metadata file was created or modified to produce this document.

Task 7.20's editorial-discovery turn. `docs/58`'s original A1 candidate description is not carried forward unchecked — every claim below is re-derived from the complete, current bodies of all four real Work case studies and all six real Knowledge articles, re-read this turn.

---

## 1. Executive Recommendation

**A1 (Authorization), as originally scoped, is downgraded.** Direct re-inspection of the complete case-study bodies for all four real Work projects finds no dedicated, non-overlapping Engineering Decision anywhere in this repository that documents an authorization mechanism — a materially thinner evidence base than either A3 or A4 had. Worse, the one substantial authorization-adjacent narrative that does exist (Haya's access-control evolution) is not new evidence at all — it is the same source material already fully restructured into a published Engineering Log entry (E3), raising a real content-overlap concern of the same category `docs/65` used to defer E2.

A stronger, previously-unconsidered candidate was found during this same re-inspection: **VaultPay's own "Transactional Outbox for Downstream Events" Engineering Decision** — a complete, dedicated, currently-unused Alternatives/Trade-offs/Rationale record, not claimed by `idempotency.mdx` or `append-only-ledger.mdx` (both explicitly scoped it out as "supporting detail, not central"). This document recommends a future task perform its own full editorial-discovery pass on that candidate, mirroring this one, rather than authorizing it here.

**Conclusion: RECOMMENDATION CHANGED — A1 is no longer the highest-value next content task.**

---

## 2. Current Corpus Snapshot — Re-Verified This Turn

### Knowledge — 6 real articles

| Slug | Topic | Tags | Technologies | Series | Featured | `relatedContent` | `publishedAt` | Difficulty |
|---|---|---|---|---|---|---|---|---|
| `append-only-ledger` | architecture | ledger, data-modeling, correctness, payments | — | — | false | `money-floating-point`, `idempotency` | 2026-08-16 | advanced |
| `data-transfer-objects` | architecture | api-design, data-modeling, architecture | — | — | false | — | 2026-08-12 | intermediate |
| `how-jwt-works` | security | jwt, authentication, tokens | — | — | true | — | 2026-08-07 | beginner |
| `idempotency` | distributed-systems | idempotency, correctness, concurrency, payments | — | — | false | `optimistic-vs-pessimistic-locking` | 2026-08-16 | intermediate |
| `money-floating-point` | backend | floating-point, money, data-modeling, correctness | — | — | true | — | 2026-08-12 | beginner |
| `optimistic-vs-pessimistic-locking` | distributed-systems | concurrency, databases, locking, correctness | — | — | false | — | 2026-08-12 | intermediate |

### Work — 4 real case studies

| Slug | Domain | `engineeringLog` | `relatedContent` |
|---|---|---|---|
| `cookeaze` | Backend Infrastructure | `cookeaze-webhook-reliability-gap` | **`idempotency`** (Task 7.19) |
| `gohunt` | AI Systems | — | `data-transfer-objects` |
| `haya` | Platform Engineering | `haya-invitation-gate-removal` | `how-jwt-works` |
| `vaultpay` | Backend Infrastructure | — | `optimistic-vs-pessimistic-locking`, `money-floating-point`, `append-only-ledger` |

### Engineering Log — 2 real entries

`haya-invitation-gate-removal` (E3, `haya`, tags: platform/access-control), `cookeaze-webhook-reliability-gap` (E4, `cookeaze`, tags: payments/webhooks/reliability, `relatedContent: ["idempotency"]`).

**Confirmed exact totals**: 6 Knowledge, 4 Work, 2 Engineering Log, **12 total real documents** — matching the task's own expected baseline, independently re-verified via direct `ls`/frontmatter read, not assumed.

---

## 3. Why A1 Is No Longer the Next Candidate

Re-evaluated against A2 and one newly-identified candidate, using fresh evidence rather than `docs/58`/`docs/66`/`docs/72`'s own prior characterization:

| Candidate | Dedicated Engineering Decision anywhere in the corpus? | Independent anchors | Overlap risk | Evidence verdict |
|---|---|---|---|---|
| **A1 (Authorization)** | **None** — no project documents a permission-check, role model, or resource-ownership mechanism as its own Engineering Decision | 0 full decisions; 1 motivational cue (`how-jwt-works`); 1 thin clause (`cookeaze`); 1 already-published narrative (`haya`, = E3) | **High** — the one substantial narrative *is* E3's own primary source material | Weak, downgraded |
| A2 (API Versioning) | **None** — no project documents a contract-evolution, deprecation, or versioning decision | 0 full decisions; 1 motivational cue (`data-transfer-objects`'s own closing sentence); GoHunt's DTO decision is `data-transfer-objects`'s own already-claimed territory, not a versioning decision | Moderate — would likely restate `data-transfer-objects` rather than extend it | Weaker than A1 |
| **Transactional Outbox (new)** | **Yes** — VaultPay's own "Decision: Transactional Outbox for Downstream Events," full Alternatives/Trade-offs/Rationale, re-read in full this turn | 1 full, dedicated decision (VaultPay); not yet used by `idempotency.mdx` or `append-only-ledger.mdx`, both of which explicitly scoped it out | Low — genuinely distinct from every published Knowledge article's own thesis | **Strongest available** |

This table is the core finding of this document, detailed in full below (§4, §7, §9).

---

## 4. Evidence Inventory — A1, Re-Derived From Complete Source Material

All four real Work case studies re-read in full this turn (not excerpted), specifically searching for any authorization-relevant passage — permission checks, role models, resource ownership, access decisions distinct from authentication.

| Source | Passage | Classification | Usable for A1? |
|---|---|---|---|
| `how-jwt-works`, Related Learning | *"JWTs answer authentication — confirming who someone is. They don't, by themselves, answer authorization — what that person is allowed to do once confirmed. Those are related but genuinely separate concerns, worth understanding as two different problems rather than one."* | **Direct evidence** — but motivational, not project evidence. Names the conceptual gap, documents no mechanism. | Yes, as the conceptual hook only |
| `cookeaze`, Implementation | *"Structured JSON logging covers AI services, payment/wallet flows, and authentication specifically, including explicit security-alert logging for things like unauthorized payment-verification attempts."* | **Direct evidence**, but a single clause inside a sentence about logging — no decision, no rationale, no mechanism described | Thin — confirms an authorization concept exists in production, teaches nothing about how |
| `haya`, "Decision: A Pay-Per-Analysis Gate, Later Replaced by Subscription Quotas" + entire "Project Evolution" section | Full Alternatives/Trade-offs/Rationale for the invitation-gate removal and subscription-tier replacement | **Direct evidence, substantial** — but this is **the identical source material `docs/62` §3 already cites as E3's own primary source**, already fully restructured and published | **Disqualifying overlap** — re-using it here would substantially retell E3 |
| `haya`, "Decision: Three Parallel Authentication Methods" | Wallet/OAuth/password sign-in, JWT sessions | Direct evidence, but explicitly **authentication**, not authorization — the case study's own text draws this line itself (linking out to `how-jwt-works`) | Not usable for A1 — belongs to `how-jwt-works`'s own territory |
| `haya`, Executive Summary | *"team workspaces: invite members, assign review tasks against specific report sections, comment collaboratively"* | Named as a functional capability only — **no permission model, role check, or ownership-check mechanism is documented anywhere in Haya's Engineering Decisions or Architecture sections** | **Requires confirmation** — the feature exists; how authorization works for it is undocumented. Cannot be authored without inventing a mechanism. |
| `vaultpay`, Architecture | *"Domain Services (auth, wallets, transactions, fraud, KYC)"* | "auth" is undifferentiated (authentication and authorization not distinguished); no dedicated decision | Not usable — too generic to support any specific claim |
| `gohunt`, Constraints + Trade-offs | *"Single developer, single user — no budget or need for multi-user auth or infrastructure at this stage."* / *"authentication and multi-tenant data isolation were deliberately deferred rather than built speculatively for a use case that doesn't exist yet."* | **Direct evidence — of absence.** GoHunt explicitly states it has no authorization mechanism, by design | **Actively disqualifies GoHunt as an anchor** — not merely unevidenced, but affirmatively documented as not built |

**Verdict**: rows 1 and 2 (Direct evidence) are real but too thin to anchor a trustworthy article alone. Row 3, the only substantial evidence, is disqualified by direct overlap with already-published content (§6). Row 5 cannot be authored without invention. Rows 4/6 are not usable. Row 7 actively rules out one of the four projects as a candidate anchor at all.

---

## 5. The Thesis Problem

`docs/58`'s original framing — distinguish authentication from authorization; explain role/permission checks, resource ownership, object-level authorization, server-side enforcement — was never tested against whether the *portfolio's own real projects* document any of those mechanisms. Re-checked directly this turn: **none of them do.** The only mechanism-level "authorization" story with real depth in this corpus (Haya's access-control-model evolution) is not about permission checks on resources at all — it's about *who is allowed to sign up and how much a signed-up account may consume*, a narrower, different question already fully told as E3.

**No precise, evidence-grounded thesis distinct from E3's own can currently be stated.** A version of A1 that avoided the E3 overlap entirely (using only `how-jwt-works`'s cue and `cookeaze`'s one clause) would be thinner than any Knowledge article this collection has published — a single conceptual distinction plus one unelaborated clause, without the "two independent, dedicated anchors" depth that made A3 and A4 both trustworthy. This document does not propose that thin a version as ready.

---

## 6. Article Boundaries — Why the E3 Overlap Is Real, Not Incidental

Compared directly against `docs/65`'s own standard for judging E2's disqualifying overlap with E3: the test was not "same project," it was "does the new content substantially retell an already-published account of the same events." Applied here: if A1 were built from Haya's invitation-gate/subscription-tier decision, its evidence, its narrative arc, and its lesson would be drawn from the exact paragraph range `docs/62` §3 already cites as E3's own source, restructured a second time into a different template. This is a stronger overlap than A3/A4 ever had with any Engineering Log entry — neither VaultPay's idempotency-key decision nor its ledger decision has ever been independently narrated as its own Engineering Log entry; Haya's access-control decision already has been.

---

## 7. Existing Knowledge Overlap Analysis

| Existing article | What it owns | A1 risk |
|---|---|---|
| `how-jwt-works` | Authentication — JWTs, sessions, revocation | A1 may reference the authentication/authorization distinction `how-jwt-works` itself already states, but must not re-teach JWT mechanics |
| `optimistic-vs-pessimistic-locking` | Concurrent-write serialization | No overlap risk identified — authorization and locking share no real conceptual boundary in this corpus's own evidence |
| `idempotency` | Duplicate-operation safety | No overlap risk identified |
| `data-transfer-objects` | Boundary-shaped types (fetched/stored/exposed) | No overlap risk identified |
| `money-floating-point` | Numeric representation | No overlap risk identified |
| `append-only-ledger` | Derived state / source-of-truth architecture | No overlap risk identified |
| **Engineering Log E3** | Haya's own dated, first-person-adjacent access-control-removal story | **The real, disqualifying risk** — not an existing Knowledge article, but an already-published account of the one substantial piece of evidence A1 would need |

---

## 8. Real Project Anchors — Accepted and Rejected, Explicitly

| Project | Accepted as an anchor? | Why |
|---|---|---|
| Haya | **Rejected** for A1's own primary evidence | Its one substantial passage is E3's own source material (§4, §6); its authentication material belongs to `how-jwt-works`; its team-workspace feature has no documented mechanism |
| Cookeaze | **Rejected as a sole anchor, usable only as thin corroboration** | One clause, no decision, no rationale — insufficient alone; already carries a real, unrelated `relatedContent` link to `idempotency` (Task 7.19) |
| VaultPay | **Rejected for A1 specifically** — no authorization-relevant decision exists in its text at all | The word "auth" appears once, generically, in a service list |
| GoHunt | **Explicitly and affirmatively rejected** | The case study's own text states authentication/authorization were deliberately not built — this is disqualifying evidence, not merely absent evidence |

**No anchor was accepted on domain or tag similarity alone** — every rejection above traces to a specific, re-read passage, per this task's own explicit instruction.

---

## 9. Related Content Opportunities — None Authorized

Because A1 itself is not advanced to implementation, no relationship metadata is proposed. For completeness, the relationships a well-evidenced A1 *would* have needed are named and explicitly not recommended:

- **A1 → `how-jwt-works`**: would have been legitimate (the conceptual-distinction cue is real) — not proposed, since A1 itself is not proceeding.
- **`haya` → A1**: would have been the most obvious candidate — **explicitly rejected**, since it would compound the same overlap problem this document already found disqualifying (§6), not merely fail to add value.
- **Engineering Log → A1**: no Engineering Log entry documents an authorization mechanism distinct from E3's own access-control story; not evidenced.

**Strong-looking relationship rejected explicitly**: `haya → A1`, precisely because domain/topic adjacency ("Haya already has a security/access-control angle") is exactly the kind of similarity this task's own instruction rules out as insufficient justification on its own — the actual text underneath that similarity is already spoken for by E3.

---

## 10. Topic Decision — Contingent, Not Executed

Had A1 proceeded, `security` (`how-jwt-works`'s own topic, currently 1 article) would have been the correct topic, creating the repository's third multi-article topic — re-confirmed against the current `TOPIC_SLUGS` vocabulary and article counts (§2). This finding is preserved for a future task, since it does not depend on A1's own weak evidence — it's a fact about the taxonomy, independent of whether A1 specifically is the article that eventually fills it. **Not executed; no file modified.**

---

## 11. Tag Decision — Not Finalized

Not proposed, since no article is being authored. For reference: `security` already exists as a *topic*, not a tag; no dedicated "authorization" or "access-control" *tag* exists in Knowledge today (`access-control` exists only on E3, Engineering-Log-scoped). Any future version of this candidate would need its own tag analysis, not inherited from this document's own now-superseded thesis.

---

## 12. Technology Decision — Not Applicable

Not evaluated in detail — no article is proceeding. Consistent with A3's and A4's own precedent (`docs/67` §10, `docs/70` §9), any future authorization-adjacent article would likely warrant no `technologies` value, since the underlying concept is portable across languages and frameworks — noted for continuity, not decided here.

---

## 13. Series Decision

**None.** Re-confirmed this turn: zero real `series`/`seriesOrder` values anywhere across all 12 real documents. No Series is invented regardless of this document's own recommendation change.

---

## 14. Featured Decision — Not Applicable

Not evaluated — no article is proceeding to authoring.

---

## 15. Publication-Date Requirement

Not applicable — no article is being authored by this document. Restated as standing guidance for whichever candidate is eventually authored: publication date is never invented, never assumed from a project's own date, and always an explicit, separately-supplied input, per every prior editorial plan in this series (`docs/67` §12, `docs/70` §18).

---

## 16. Proposed Article Structure — Not Executed

Not designed in full, since A1 is not advancing. Had it proceeded on the thin evidence base identified in §4, the natural Knowledge-article structure (Introduction → The Problem → The Core Concept → ... → Related Learning, matching every real article's own convention, `docs/18`) would still apply — restated as a standing constraint for any future authorization-adjacent article, not a structure designed against content this document does not recommend authoring.

---

## 17. Visual / Code Example Policy — Not Applicable

Not evaluated in detail. Noted for continuity: any future version would need to distinguish real project evidence from illustrative examples with the same discipline `docs/67`/`docs/70` already applied, labeling any generic permission-check pseudocode explicitly as illustrative rather than implying it describes a specific project's real code — a real risk for an authorization article specifically, since no real project's own permission-check code is documented anywhere in this corpus (§4).

---

## 18. Discovery Impact — Not Applicable to A1 as Currently Evidenced

Not claimed. Per this task's own instruction not to claim impact conditional on an unresolved input without marking it conditional: since A1 itself is not proceeding, no topic/tag/Search/RSS/Sitemap impact is asserted for it. The one impact fact that remains true regardless of which candidate is eventually authored: **`security` remains available as this repository's next multi-article topic opportunity** (§10), independent of which article eventually fills it.

---

## 19. Risks and Regression Considerations

- **Risk avoided by this document's own recommendation change**: authoring A1 from Haya's access-control story would have produced a Knowledge article substantially overlapping E3's own already-published content — the same category of problem `docs/65` already identified and avoided once for E2. This document extends that same discipline to Knowledge-collection candidates, not only Engineering Log ones.
- **No regression risk from this document itself** — no production file was touched (§21).
- **Risk for a future task**: authoring the Transactional Outbox candidate without first performing its own full editorial-discovery pass (mirroring this one) would repeat the exact shortcut this document was commissioned to avoid for A1 — explicitly flagged so it isn't skipped next time (§23).

---

## 20. Implementation Footprint Prediction

**None for A1.** No future production manifest is proposed, since no editorial contract was approved. Were the Transactional Outbox candidate to advance through its own future editorial-discovery and implementation-planning stages, its footprint would plausibly resemble A3's/A4's own two-file shape (one new Knowledge article, one `vaultpay.mdx` `relatedContent` addition) — stated here only as a directional expectation, not a commitment, since that candidate's own discovery pass has not yet been performed.

---

## 21. Explicit Open Questions

**One genuinely open question, not resolvable from the repository alone**: should a future task revisit A1 with a narrower, explicitly-thin scope (just the authentication/authorization conceptual distinction, `how-jwt-works`'s cue, and Cookeaze's one clause, with no Haya material at all) — accepting a shorter, less-anchored article than this collection's own established norm — or should A1 remain deferred until a real project in this portfolio documents an actual permission/role/ownership mechanism as its own dedicated Engineering Decision? **This document does not decide that question** — it is a genuine editorial-standards call (how thin is too thin), not one the repository's own evidence can resolve unilaterally, and is named here rather than answered by default.

**No other open question was found requiring user input** — every other finding in this document (the E3 overlap, GoHunt's disqualification, the Transactional Outbox candidate's own strength) is fully evidence-resolved, per this task's own instruction not to leave a decision open where the repository already answers it.

---

## 22. Verification

```
git status --short
```

Confirmed: only `docs/65`–`docs/72` (prior turns' own outputs, untouched by this task) and `docs/73` (this document) appear as new/modified paths; `content/knowledge/idempotency.mdx`, `content/knowledge/append-only-ledger.mdx`, `content/work/vaultpay.mdx` (M), `content/work/cookeaze.mdx` (M), and `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (M) are all prior tasks' (7.13/7.17/7.19) own already-approved output — pre-existing, not attributable to this task. `git diff --stat -- content/ src/` shows zero change attributable to this document.

---

## 23. Recommended Next Step

**Do not author A1 in its currently-evidenced form.** Two concrete paths forward, neither authorized by this document:

1. **Preferred**: commission a fresh editorial-discovery pass (mirroring this task's own structure) for **VaultPay's Transactional Outbox pattern** — the strongest currently-available candidate, with a complete, dedicated, unused real-project anchor (§3, §4).
2. **Deferred, not rejected**: revisit A1 only if a future real project documents an actual permission/role/ownership mechanism as its own dedicated Engineering Decision, or if an explicit editorial-standards decision (§21) accepts a thinner article than this collection's established norm.

**No implementation is authorized by this document.**

---

## Final Report

- **Is A1 still approved?** No — downgraded, per §1/§3, on evidence grounds re-derived this turn, not asserted.
- **Strongest evidence found (for any candidate)**: VaultPay's own "Transactional Outbox for Downstream Events" Engineering Decision — complete, dedicated, currently unused by any published Knowledge article.
- **Strongest evidence found for A1 specifically**: `how-jwt-works`'s own authentication/authorization distinction (motivational) and Cookeaze's one-clause "unauthorized payment-verification attempts" logging mention (thin) — both real, both insufficient alone.
- **Rejected evidence**: Haya's access-control-evolution decision (disqualified by direct overlap with E3, §6); Haya's authentication decision (belongs to `how-jwt-works`); Haya's team-workspace feature (undocumented mechanism, would require invention); VaultPay's generic "auth" mention (too generic); GoHunt entirely (explicitly, affirmatively disqualified by its own text, §4/§8).
- **Thesis**: no precise, evidence-grounded, non-overlapping thesis could be stated for A1 as originally scoped (§5).
- **Overlap boundaries**: fully mapped against all six real Knowledge articles (§7); the one real risk is Engineering Log E3, not any Knowledge article.
- **Relationship opportunities**: none authorized; the one strong-looking relationship (`haya → A1`) explicitly rejected with reasoning (§9).
- **Topic/tags/technology/featured/publication-date decisions**: not finalized, correctly deferred as not applicable to a candidate that isn't advancing (§10–§15).
- **Discovery impact**: not claimed for A1; the one durable fact (`security`'s own multi-article-topic opportunity) preserved for whichever future article eventually fills it (§18).
- **Exact file created**: `docs/73-AUTHORIZATION_EDITORIAL_PLAN.md` — the only file created or modified by this task.
- **Git verification**: confirmed via `git status --short` (§22); zero production change attributable to this task.

**RECOMMENDATION CHANGED — A1 is no longer the highest-value next content task.**
