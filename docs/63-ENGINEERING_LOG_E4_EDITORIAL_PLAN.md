# 63 — Engineering Log E4: Cookeaze Webhook Fallback — Editorial Design Proposal

## Status

Proposal — awaiting review and approval.

> No `.mdx` file, existing content, schema, route, component, or resolver was created or modified to produce this document.

Task 7.8's design-stage proposal, freshly re-verifying E4 against the complete current Cookeaze case study and the now-real Engineering Log state (E3, published and approved) — not repeating `docs/61`'s classification unchecked.

---

## 1. Current Engineering Log State — Re-Inspected Post-E3

- **Real entries**: exactly one — `content/engineering-log/haya-invitation-gate-removal.mdx`, confirmed live, approved.
- **Cookeaze**: unmodified since its original commit (confirmed via `git log`) — every citation below traces to the same, unchanged text `docs/61` originally read.
- **Contract, re-confirmed unchanged**: `articleFrontmatterSchema` directly (`title`, `description`, `publishedAt`, `tags`, `relatedContent`, no `topic`/`difficulty` rendered); Work relationship authored via `WorkFrontmatter.engineeringLog` (source-side only, confirmed by re-reading `case-study-relationships.ts`/`engineering-logs.ts`); Related Knowledge via the entry's own `relatedContent`; `sortByPublishedDate()` chronology; `filterDrafts()` draft handling — all unchanged, all already proven correct by E3's own live verification (Task 7.7's release gate).
- **New since `docs/61`**: the tag vocabulary now includes `platform` and `access-control` (both introduced by E3) — re-checked, `webhooks` and `reliability` still do not exist anywhere in the repository.
- **Nothing E3 established is extended or modified here** unless E4's own evidence specifically requires it — none does.

---

## 2. E4 Source Evidence — Re-Verified, Section by Section

Direct re-read of `content/work/cookeaze.mdx` this turn, not carried forward from `docs/61`:

| Claim | Source section | Quoted |
|---|---|---|
| Webhook trusted as sole signal | "The Problem" | *"The initial design trusted the payment provider's webhook as the single signal that a transaction had completed."* |
| Webhooks aren't guaranteed delivery; real gap occurred | "The Problem," "Challenges Encountered" | *"a webhook can be delayed, dropped, or (rarely) delivered more than once"*; *"occasional payments that completed on Paystack's side without ever being reflected in the platform"* |
| Rejected alternative | "Investigation" | *"A user-initiated 'check my payment status' button was rejected — it depends on the user staying on the page and manually triggering the check, which is exactly the failure mode... it needs to cover."* |
| Chosen fallback | "Investigation," "Architecture," "Engineering Decisions" | Self-chaining, backing-off Celery poll, independent of the webhook |
| Idempotency mechanism | "Architecture," "Engineering Decisions" | `TransactionMapping` keyed on a unique transaction reference — "whichever [path] resolves the transaction first updates the wallet; the other... is a safe no-op" |
| Result | "Outcome" | *"directly closing the specific gap (webhook-only trust) that an earlier version of the system had"*; explicitly no metrics published |
| Lesson | "Lessons Learned" (callout) | *"A third-party webhook is a hint that something happened, not a guarantee... that fallback has to be driven by the system itself, never by asking a user to notice and retry."* |

All four elements `docs/61` originally cited — the problem, the fallback, the rejected alternative, and the lesson callout — are re-confirmed present and unchanged.

---

## 3. The Actual Engineering Story

- **What was happening**: once real money moved through Cookeaze, "the payment succeeded" needed to be a fact the backend could independently confirm, not an assumption.
- **What problem existed**: the original design trusted the payment provider's webhook alone; webhooks aren't guaranteed delivery, and real payments occasionally completed on the provider's side without ever being reflected in the platform.
- **What was investigated**: what to pair the webhook with, once its unreliability was understood.
- **What alternative was considered and rejected**: a user-initiated "check my payment status" button — rejected because it depends on the user noticing and acting, exactly the failure mode it would need to cover.
- **What approach was chosen**: the system itself polling the provider's own transaction-status API on a schedule, self-chaining with backoff, independent of the client.
- **What changed structurally**: a `TransactionMapping` record created up front, keyed on a unique transaction reference, so the webhook and poller can safely race — whichever resolves first wins, the other is a no-op.
- **What the resulting behavior was**: live in production, closing the specific gap; no metrics are published, and the case study is explicit about that absence rather than silent about it.
- **What lesson was documented**: a webhook is a hint, not a guarantee; the fallback has to be system-driven, never dependent on a user noticing.

These are evidence questions, answered directly from the source — not a heading template to impose on the eventual entry (§11).

---

## 4. Engineering Log vs. Knowledge — Explicit

E4 correctly belongs in Engineering Log, not Knowledge, and this isn't a close call: the specific Cookeaze project event (a real design that trusted a webhook alone, a real gap that resulted, a real fallback that was built) is well-evidenced and narrow — not the thin-event case this task's §6 asks to watch for. **Two things are true simultaneously, not in tension**: the project event is Log-shaped (specific, dated-to-a-project, first-person-adjacent), and the general lesson it produced ("webhooks are hints, not guarantees") is *also* independently reusable enough to be a legitimate future Knowledge candidate — exactly `docs/58`'s own "Idempotency"/reliability-adjacent candidate territory, already named in `docs/61` §11 as E4's natural future Related Knowledge target. **E4 is not reclassified** — the specific war story stays a Log entry; the generalizable concept remains a separate, not-yet-written, not-proposed-here Knowledge article.

---

## 5. Evidence Classification

| Element | Classification |
|---|---|
| The webhook-trust problem | **Strong** |
| The rejected status-check button | **Strong** |
| The chosen self-chaining poller | **Strong** |
| The idempotent resolution mechanism | **Strong** |
| The production result | **Strong** (including the case study's own explicit non-quantification, which is itself real, usable information — see §8) |
| The lesson callout | **Strong** |
| Exact event date | **Insufficient without user input** — §18 |
| Quantified impact (how many payments, how long) | **Insufficient, and correctly excluded** — the source itself declines to quantify this (§8) |
| Withdrawal race-condition/double-spend hardening | **Strong evidence exists, but out of E4's scope** — a distinct engineering event, not part of the webhook/poller story (§11) |

No fresh evidence downgrades `docs/61`'s original Strong classification — if anything, this re-read confirms it more precisely, with the rejected-alternative and lesson-callout evidence both re-verified as explicit rather than inferred.

---

## 6. No Fabrication — Explicit Compliance

Not invented anywhere in this document: an outage duration, a payment volume, a webhook failure rate, a specific retry count or backoff interval (the source names the *mechanism* — self-chaining, backing-off — never a number), a latency figure, a team discussion, a deadline, a motivation beyond what's stated, Paystack's own undocumented behavior, or any performance/business metric. The case study's own explicit silence on transaction-volume and reliability figures is treated as real information to preserve, not a gap to quietly fill.

---

## 7. Rejected Alternative — Verified in Full

1. **The alternative**: a user-initiated "check my payment status" button.
2. **Why considered**: as a way to pair with the webhook once its unreliability was understood — the same investigative question that led to the poller.
3. **What the source actually says about rejecting it**: *"it depends on the user staying on the page and manually triggering the check, which is exactly the failure mode (a webhook silently never arriving) it needs to cover."*
4. **Is the reason explicit?** Yes — stated directly, not inferred.
5. **Safe to include?** Yes, verbatim in substance — this plan does not strengthen or embellish the stated reasoning.

---

## 8. Lesson Callout — Located and Assessed

Exact text, "Lessons Learned": *"A third-party webhook is a hint that something happened, not a guarantee. Any system crediting real money on a webhook alone needs an independent way to confirm the same fact — and that fallback has to be driven by the system itself, never by asking a user to notice and retry."*

- **Can be restructured directly**: yes.
- **Needs contextual explanation**: minimal — it's already self-contained and general.
- **Risk of misleading wording outside the case study**: none found — this is worth noting precisely: the callout's closing clause (*"never by asking a user to notice and retry"*) is the same reasoning that explains *why* the status-check button was rejected (§7) — the lesson and the rejected alternative are causally the same fact, stated twice in the source at two different points in its own narrative. The eventual entry should weave these together rather than repeat them as two separate, disconnected points — a structural observation about the source, not a template imposed on it.

---

## 9. Content Boundary

| Content | Status |
|---|---|
| The webhook-trust problem and its real consequence | Can author — directly supported |
| The rejected status-check button and its stated reason | Can author — directly supported |
| The self-chaining poller and its backoff behavior | Can author — directly supported |
| The idempotent resolution mechanism (unique transaction reference) | Can author — directly supported |
| The production result and the case study's own non-quantification | Can author — directly supported, including the honest absence of metrics |
| The lesson (webhook = hint, not guarantee; system-driven fallback) | Can author — directly supported, restructured per §8 |
| Exact event date | Requires user confirmation — §18 |
| Withdrawal race-condition/double-spend hardening | Exclude from E4 — real, evidenced, but a separate engineering event, not this story's scope (§11) |
| Any specific metric, incident count, or timeline beyond what's stated | Exclude — not established anywhere in the source |

---

## 10. Proposed Title

Three candidates, evaluated against this task's own "avoid generic" instruction:

1. *"The Webhook That Wasn't Enough"* — evocative, directly grounded in the case study's own framing (*"a webhook alone turned out not to be a reliable source of truth"*).
2. *"When Trusting a Webhook Wasn't Enough"* — a close variant, slightly more explanatory.
3. *"Building a Fallback for an Unreliable Payment Webhook"* — more literal/technical, less evocative.

**Recommended: Candidate 1** — matches `docs/61`'s own original choice, names the specific event rather than the project, and avoids every generic pattern this task warns against ("Building Cookeaze," "Cookeaze Webhooks," "Cookeaze Payment System").

---

## 11. Proposed Description

Deliberately distinct from Cookeaze's own case-study description (*"Hardening a creator-payout wallet system against double-spends and race conditions once a webhook alone turned out not to be a reliable source of truth..."* — broader, covering two concerns) — E4's description is scoped narrowly to the webhook/poller story alone, not the case study's wider framing:

> *"A payment webhook was trusted as the only signal a transaction had completed — until real payments went unrecorded because it silently never arrived, and a self-chaining poller was built to close the gap."*

Concise, contains no unsupported claim, and reads as a distinct sentence rather than a paraphrase of the case study's own.

---

## 12. Proposed Slug

`cookeaze-webhook-reliability-gap` — verified unique against the current collection (one real entry, `haya-invitation-gate-removal`, no conflict); matches E3's established style (project name + event, kebab-case); readable; compatible with the Related Work relationship mechanism (a plain string slug, no special characters).

---

## 13. Tags — Re-Verified Against the Current, Post-E3 Vocabulary

| Tag | Status | Why it applies |
|---|---|---|
| `payments` | **Existing** — already real on `cookeaze.mdx` itself and on `vaultpay.mdx`/`haya.mdx` | Directly on-topic; reuses established vocabulary |
| `webhooks` | **New** — confirmed absent from the entire repository, including post-E3 | Names the specific mechanism this entry is about; no existing tag covers it |
| `reliability` | **New** — confirmed absent | The general theme of the lesson; also a candidate for E2 (`docs/61`/`docs/62`'s own note that introducing it once and reusing it for E2 later is more consistent than treating each as a separate new-tag decision) |

No unrelated tag is touched. Both new values are flagged explicitly, not silently introduced, consistent with `docs/51` Decision 4's unreversed free-form-tags position.

---

## 14. Related Work

**Cookeaze** — the future implementation adds E4's slug to `content/work/cookeaze.mdx`'s existing `engineeringLog: []` array (currently empty, confirmed by re-read this turn). **Not modified by this document.** Per the same dual-direction finding `docs/62` established for E3: this one edit will simultaneously activate Cookeaze's own "Engineering Logs" section (currently rendering nothing) and the new entry's own "Related Work" section — both resolvers read the identical field, confirmed unchanged.

---

## 15. Related Knowledge — Re-Verified, Still Empty

Checked again against the same four real Knowledge articles (unchanged since E3 — no new Knowledge article was introduced): `data-transfer-objects`, `how-jwt-works`, `money-floating-point`, `optimistic-vs-pessimistic-locking`. None has a genuine textual connection to the webhook/idempotency story. **No Related Knowledge relationship recommended.** The one legitimate future target — a not-yet-written "Idempotency" or reliability-focused Knowledge article — remains exactly where `docs/61` left it: named as an opportunity, not fabricated as a present relationship.

---

## 16. Publication Date — An Editorial Decision, Not a Silent Default

Cookeaze's case study establishes only a project-level range: `publishedAt: "2024-12-03"`, `timeline: "December 2024 – ongoing, 2026 (380+ commits, small team)"`. **No specific date for the webhook/poller event itself is stated anywhere in the source.** Per this task's own explicit instruction, this document does **not** default to reusing Cookeaze's own `publishedAt` — it names that as one *available* editorial option, presented explicitly for the user to choose or reject, the same way E3's actual authoring turn required a direct question rather than an assumption:

- **Option A**: reuse Cookeaze's own `publishedAt` (2024-12-03) as a defensible stand-in, the same choice made for E3.
- **Option B**: a specific date the user supplies, if one is known or preferred.

**This plan does not pick one** — `publishationDate requires user confirmation` before authoring, exactly as `docs/62` required for E3.

---

## 17. Content Transformation

**Restructuring** — the strongest possible classification. Every element of the core narrative (problem, rejected alternative, chosen fallback, idempotency mechanism, result, lesson) is already explicitly stated across six corroborating sections of the real case study. No Expansion is needed for the story itself; only the publication date requires input beyond what the source establishes. This matches `docs/61`'s original assessment, now reconfirmed rather than merely repeated.

---

## 18. Precedent, Not Template

E3 establishes the *mechanical* precedent this plan reuses: flat frontmatter (`title`, `description`, `publishedAt`, `tags`, no `topic`/`difficulty`), the `engineeringLog` array wiring, flowing prose with no imposed headings, a length proportional to what the evidence actually supports. **E4's own narrative shape is not copied from E3's** — it emerges from Cookeaze's own sequence (assumption → gap → rejected fix → real fix → result → lesson), which happens to rhyme with E3's shape only because both source stories genuinely have that arc, not because a template was applied to force it.

---

## 19. Discovery Impact

| System | Impact |
|---|---|
| Engineering Log index | 1 entry → 2, first real chronological ordering exercised (not just a single-entry, both-`null` Previous/Next state) |
| Engineering Log detail | Second real exercise of the reading experience |
| Previous/Next chronology | **New behavior E3 alone couldn't exercise** — with two real entries, one side of each becomes non-`null` for the first time, ordered by `publishedAt` |
| Related Work | Second real activation of both relationship directions (Cookeaze ↔ E4), independent of Haya's own |
| Search | New real title/description/tag-matchable content; `payments` tag now spans three real documents (Cookeaze itself, VaultPay, and this new entry) |
| Tags | `webhooks`/`reliability` enter the vocabulary for the first time |
| RSS | Second real Engineering Log feed item |
| Sitemap | Second real Engineering Log URL |

**No new Discovery functionality is proposed.** The one genuinely new *behavior* (not feature) this candidate exercises that E3 alone could not is real Previous/Next chronology between two actual entries — worth naming explicitly as a release-gate check for the eventual implementation, not assumed to work identically to E3's necessarily-empty single-entry state.

---

## 20. Corpus Strategy — Re-Evaluated Post-E3

The originally planned sequence — E3 (Haya), E4 (Cookeaze) — **remains sensible, and is now doubly confirmed rather than merely restated**: with E3 live, authoring E4 next continues the project-diversity goal `docs/61` §18 set out to achieve (two of the first two entries from two different real projects, not two from the same one). **E2 is deliberately not recommended next**, even though it already exists as a fully-specified, Strong-evidence candidate (`docs/62` §5) — authoring E2 (also Haya) before E4 would make the collection's first two entries both come from the same project, exactly the outcome the original sequencing was designed to avoid. This is not a rejection of E2's own readiness — it remains ready — only a sequencing decision, restated with the evidence that's actually available *now* (E3 published) rather than assumed in advance.

---

## 21. Implementation Readiness

**READY WITH USER INPUT.** Every factual element of the narrative is Strong evidence, directly restructurable without invention (§5, §9). The only missing piece is the publication date (§16) — a metadata/editorial decision, not a content-evidence gap, identical in kind to what E3 itself required before authoring. `docs/61`'s original Strong classification is not downgraded; this fresh re-read finds it, if anything, more precisely confirmed (the rejected-alternative and lesson-callout evidence both re-verified as explicit, and one additional finding — the causal link between the lesson callout and the rejected alternative, §8 — sharpens the story further without requiring new invention).

---

## 22. No Implementation — Confirmed

No `.mdx` file was created. `cookeaze.mdx` was read, not modified. No other content, schema, resolver, route, or component file was touched.

---

## 23. File Manifest

Only `docs/63-ENGINEERING_LOG_E4_EDITORIAL_PLAN.md` was created.

---

## 24. Release Review

`git status` confirms only this document as a new file — verified in the Final Report below.

---

## Final Report

1. **Current Engineering Log state** — §1: one real entry (E3), Cookeaze unmodified, contract unchanged and already proven correct.
2. **E4 source evidence** — §2: all four originally-cited elements re-verified present and unchanged, each traced to its exact source section.
3. **Engineering event/problem** — §3: webhook trusted as sole signal; not guaranteed delivery; real payments occasionally went unrecorded.
4. **Decision/change** — §3, §7: self-chaining, backing-off poller; idempotent resolution via a unique transaction reference.
5. **Rejected alternative** — §7: a user-initiated status-check button, rejected for depending on the user noticing — verified explicit, not inferred.
6. **Documented lesson** — §8: the callout, quoted in full, with a new finding (its causal link to the rejected-alternative reasoning).
7. **Engineering Log vs. Knowledge classification** — §4: correctly Log, not reclassified; the reusable lesson is named as a separate, future Knowledge opportunity, not conflated with this entry.
8. **Evidence strength** — §5: Strong across every narrative element; Insufficient (and correctly excluded, not invented) for exact date and quantified impact.
9. **Proposed title** — §10: *"The Webhook That Wasn't Enough,"* with two alternatives considered and rejected on stated grounds.
10. **Proposed description** — §11: deliberately distinct from Cookeaze's own case-study description.
11. **Proposed slug** — §12: `cookeaze-webhook-reliability-gap`, verified unique.
12. **Tags** — §13: `payments` reused; `webhooks`/`reliability` flagged as new, not silently introduced.
13. **Related Work** — §14: Cookeaze, via the (unmodified) `engineeringLog` array; dual-direction activation named explicitly.
14. **Related Knowledge** — §15: none recommended, re-verified against the current corpus.
15. **Publication date decision** — §16: not defaulted; presented as an explicit open choice requiring user confirmation before authoring.
16. **Natural narrative** — §3, §18: the source's own real sequence, not a template.
17. **Content boundary** — §9: full table, every claim classified.
18. **Authoring effort** — §17: Restructuring, the strongest classification available.
19. **Discovery impact** — §19: every system named; one genuinely new *behavior* (real two-entry Previous/Next) identified and flagged for explicit release-gate testing.
20. **Corpus strategy** — §20: E3→E4 sequencing reaffirmed with fresh reasoning; E2 deliberately not recommended next, for sequencing reasons, not readiness ones.
21. **Implementation readiness** — §21: READY WITH USER INPUT.
22. **Exact file manifest** — §23: one file, this document.
23. **Git verification**: `git status --short` shows only `docs/63-ENGINEERING_LOG_E4_EDITORIAL_PLAN.md` as a new, untracked file; `cookeaze.mdx` and every other content/production file show zero diff.
24. **Final recommendation**: **APPROVED — E4 editorial design is ready for implementation planning.**
