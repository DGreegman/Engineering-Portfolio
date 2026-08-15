# 64 — Engineering Log E4: Cookeaze Webhook Fallback — Implementation Plan

## Status

Implementation Plan — translating `docs/63-ENGINEERING_LOG_E4_EDITORIAL_PLAN.md`'s approved editorial design into an exact, authoring-ready specification for a **future** implementation pass.

> This document authorizes no implementation. It is documentation only. No `.mdx` file, existing content, schema, route, component, resolver, or navigation file was created or modified to produce it. The only file created by this task is this document itself.

Task 7.8's implementation-planning turn, re-inspecting the live repository directly (not carrying forward `docs/63`'s or `docs/62`'s findings unchecked) and resolving the one open question those documents left pending — the publication date — per this task's own explicit, already-made decision (§3).

---

## 1. Authoritative Sources — Read, Not Re-Litigated

Read in full before writing this plan: `docs/63-ENGINEERING_LOG_E4_EDITORIAL_PLAN.md` (the approved editorial design), `docs/62-ENGINEERING_LOG_AUTHORING_IMPLEMENTATION_PLAN.md` §4 (E4's original implementation contract, specified but not executed), `docs/61-ENGINEERING_LOG_EDITORIAL_PLAN.md` (original candidate analysis), `docs/37-ENGINEERING_LOG_EXPERIENCE.md` and `docs/38-ENGINEERING_LOG_IMPLEMENTATION_PLAN.md` (the architecture E3 already proved out live). This plan does not reopen any editorial judgment those documents already settled (title, description, slug, tags, narrative shape, rejected-alternative handling) — it re-verifies each against the live repository and carries it forward exactly, flagging only what re-inspection actually changes.

---

## 2. Re-Inspection — Repository State, Verified This Turn

Directly re-read, not assumed from `docs/63`:

| Item | Finding |
|---|---|
| `content/work/cookeaze.mdx` | Unmodified since original commit (`git diff --stat` shows zero changes against `HEAD`). `engineeringLog: []` — still empty. `tags: ["backend", "payments", "django", "ai"]`. `publishedAt: "2024-12-03"`. Every quoted sentence in `docs/63` §2 traced and confirmed present, verbatim, in the current file. |
| `content/engineering-log/` | Contains exactly one real entry: `haya-invitation-gate-removal.mdx` (E3, live). `.gitkeep` also present. No file named `cookeaze-webhook-reliability-gap.mdx` exists — the proposed slug is free. |
| E3's actual shape (precedent) | Frontmatter is exactly four fields: `title`, `description`, `publishedAt`, `tags` — no `relatedContent: []`, no `draft`, no other field authored (both default silently per schema). Body is flowing prose, four paragraphs, no headings, no imposed template. This is the concrete precedent E4 must match, not just `docs/37`'s abstract description of it. |
| `src/lib/content/schema.ts` | `articleFrontmatterSchema` unchanged: `title`, `description`, `publishedAt` (required, `z.coerce.date()`), `tags` (default `[]`), `relatedContent` (default `[]`), `draft` (default `false`), plus other optional fields E3 doesn't use and E4 won't either. `workFrontmatterSchema.engineeringLog: z.array(z.string()).default([])` — confirmed still an unconstrained array. |
| `src/lib/content/engineering-logs.ts` | `getAllEngineeringLogEntries()`, `resolveRelatedWorkForLog()`, `resolvePreviousNextLog()`, `toEngineeringLogArticleSummary()` all present, unchanged, already live (built and proven for E3, not hypothetical). |
| `src/lib/content/case-study-relationships.ts` | `resolveRelatedEngineeringLogs()` (Work to Log direction) and `toCaseStudySummary()`/`DEFAULT_RELATIONSHIP_LIMIT` (both exported, reused by `engineering-logs.ts`) confirmed unchanged. |
| `src/components/engineering-log/` | `log-entry-header.tsx`, `log-entry-row.tsx`, `related-work.tsx`, `related-knowledge.tsx` all exist, all already live (E3 renders through them today). |
| `src/app/engineering-log/[slug]/page.tsx`, `src/app/engineering-log/page.tsx` | Both exist, both already live, both re-read in full this turn (§16 below cites their exact current logic, not a description of it). |
| `src/app/work/[slug]/page.tsx` | Confirmed unchanged; already resolves `resolveRelatedEngineeringLogs()` and renders `RelatedEngineeringLogs` for any Case Study whose `engineeringLog` array is non-empty. |
| `src/lib/content/search.ts` | Confirmed reads `getAllEngineeringLogEntries()` directly, matches `title`/`description`/`tags`; no per-entry registration needed. |
| `src/lib/content/rss.ts` | Confirmed reads `getAllEngineeringLogEntries()` directly, merges into the feed by real `publishedAt` `Date`. |
| `src/app/sitemap.ts` | Confirmed reads `getAllEngineeringLogEntries()` directly (`src/app/sitemap.ts:50,85-86`), maps every entry to `${SITE_URL}/engineering-log/${item.slug}`. |
| Knowledge corpus | Still exactly four real articles: `data-transfer-objects`, `how-jwt-works`, `money-floating-point`, `optimistic-vs-pessimistic-locking`. No new article since `docs/63`. |
| Tag vocabulary | `webhooks` and `reliability` confirmed absent from every real content file in the repository (`grep -rn "^tags:" content/` — nine tag arrays checked, neither string appears anywhere). |

**Conclusion: no drift.** Every claim `docs/63` and `docs/62` §4 made about the repository still holds exactly. Since Task 6.2's build, the Engineering Log system has gone from "designed, unproven" to "designed, and already proven correct end-to-end by E3's own live implementation" — this plan inherits a working system, not a hypothetical one, which is a strictly stronger position than `docs/63`/`docs/62` had when they were written (both worked from `docs/37`'s design plus zero live entries; this plan works from one live, verified entry).

**One genuine discrepancy found and resolved — see §3.**

---

## 3. Publication Date — Resolved by This Task, Not Reopened

`docs/62` §4 and `docs/63` §16/§21 both left `publishedAt` as "requires user confirmation" — an open question at the time either document was written. **This task's own brief resolves that question explicitly and is authoritative over both prior documents on this one point:**

> Use Cookeaze's existing Case Study `publishedAt` — `"2024-12-03"` — as the Engineering Log's `publishedAt`.

This is the exact "Option A" `docs/63` §16 named as available but declined to select on its own authority. This plan selects it, per this task's own explicit instruction, and does not re-derive or second-guess it.

**Semantic distinction, stated precisely, per this task's own instruction:** `2024-12-03` is the date this document assigns as **E4's publication date** — the date the Engineering Log entry is treated as "published," governing its position in `sortByPublishedDate()`, RSS chronology, and Previous/Next. It is explicitly **not** a claim that the webhook/poller work was implemented, deployed, or completed on that calendar date — no such date exists anywhere in the source material, and this plan does not manufacture one. The entry's own prose (per §6/§9 below) narrates the engineering story without asserting a specific date inside the body text itself, so this distinction never needs to be explained *to a reader* — it only needs to be understood by whoever authors and reviews this plan.

**Real consequence this choice has that neither `docs/62` nor `docs/63` could evaluate (because the date wasn't chosen yet) — flagged explicitly, not silently absorbed:** Cookeaze's own `publishedAt` (`2024-12-03`) predates E3's `publishedAt` (`2025-10-08`, `content/engineering-log/haya-invitation-gate-removal.mdx:4`) by about ten months. This means **E4 becomes the chronologically** ***older*** **of the two real entries**, not the newer one — see §16 for the exact Previous/Next consequence, which runs opposite to what a reader might assume from E4 being *authored* second.

---

## 4. E4 Content Contract — Exact, Carried Forward from `docs/63`

| Field | Value | Source |
|---|---|---|
| **Title** | *"The Webhook That Wasn't Enough"* | `docs/63` §10, Candidate 1 (recommended and approved) |
| **Description** | *"A payment webhook was trusted as the only signal a transaction had completed — until real payments went unrecorded because it silently never arrived, and a self-chaining poller was built to close the gap."* | `docs/63` §11, verbatim |
| **Slug** | `cookeaze-webhook-reliability-gap` | `docs/63` §12; re-verified unique against the current collection (§2) |
| **Tags** | `["payments", "webhooks", "reliability"]` | `docs/63` §13; re-verified against the current, post-E3 tag vocabulary (§2, §12 below) |
| **`publishedAt`** | `"2024-12-03"` — Cookeaze's own Case Study `publishedAt` | §3 above (this task's own resolved decision, superseding `docs/62`/`docs/63`'s "requires confirmation" status) |
| **`relatedContent`** | Omitted (schema default `[]`) | §11 below |

No alternative metadata is proposed anywhere in this plan — re-inspection (§2) found nothing that invalidates any part of `docs/63`'s contract.

---

## 5. E4 Engineering Story — Preserved Exactly, Scope Bounded

The story this entry tells, and only this story:

1. Cookeaze's original design trusted the payment provider's (Paystack's) webhook as the **sole** signal that a transaction had completed.
2. Webhooks are not guaranteed delivery — the case study states this as a general property of webhooks and separately states that, as a real consequence, occasional payments completed on Paystack's side without ever being reflected in the platform.
3. Once that unreliability was understood, a user-initiated "check my payment status" button was considered and **rejected** — it depends on the user staying on the page and manually triggering the check, exactly the failure mode (a webhook silently never arriving) it would need to cover.
4. The chosen fix: the system itself polls the provider's own transaction-status API on a schedule, self-chaining and backing off, independent of whether the webhook ever arrives.
5. A `TransactionMapping` record, keyed on a unique transaction reference, makes the webhook and the poller safe to race against each other — whichever resolves the transaction first updates the wallet; the other is a safe no-op.
6. Result: live in production, directly closing the specific gap (webhook-only trust) an earlier version of the system had. The case study explicitly declines to publish transaction-volume or reliability figures — that absence is itself real information this entry preserves, not a gap to quietly fill.
7. Lesson: a third-party webhook is a hint that something happened, not a guarantee; any system crediting real money on a webhook alone needs an independent, system-driven fallback, never one that depends on a user noticing and retrying.

**Explicitly excluded, per `docs/63` §5/§9 and this task's §5:** Cookeaze's separate withdrawal race-condition/double-spend hardening (Case Study "Challenges Encountered," second sentence: *"an earlier version of the withdrawal flow was vulnerable to a race condition that could, in principle, allow a double-spend..."*). This is real, evidenced, and belongs to Cookeaze's case study — but it is a distinct engineering event from the webhook/poller story, not part of E4's scope. Re-confirmed by direct re-read of the current case study this turn (§2): the two are still narrated as separate "Challenges Encountered," not one continuous story.

---

## 6. Natural Narrative — No Case Study Template

Per this task's own explicit instruction, E4's body must **not** impose a Context/Problem/Investigation/Decision/Implementation/Result/Lesson heading structure. The intended narrative flow, derived directly from the source's own sequence (matching E3's precedent of flowing, unheaded prose — §2's re-verified E3 shape), in the order the evidence naturally supports:

1. **The assumption.** Once real money moved through Cookeaze, "the payment succeeded" needed to be an independently confirmable fact, not an assumption — and the original design rested that fact on the webhook alone.
2. **The gap.** Webhooks aren't guaranteed delivery; real payments occasionally completed on Paystack's side without ever reaching the platform.
3. **The alternative that was considered and rejected, woven together with the lesson it embodies** (§9 below) — a user-initiated status-check button, rejected because it depends on the user noticing and acting, which is exactly the failure mode a real fallback has to cover.
4. **The fix that was built instead.** A self-chaining, backing-off poll against the provider's own transaction-status API, independent of the client and independent of whether the webhook ever shows up.
5. **The mechanism that makes it safe.** A `TransactionMapping` keyed on a unique transaction reference, so the webhook and the poller can race without double-crediting a wallet — whichever resolves first wins, the other is a no-op.
6. **The result**, including the case study's own honest non-quantification — live in production, the specific gap closed, no fabricated metric standing in for the number the source doesn't give.

This is a description of the intended flow for whoever authors the MDX, not a mandatory heading list — the same "observed, not imposed" discipline `docs/62` §3/§13 already used for E3's own narrative arc.

**Length**: no arbitrary target, matching E3's own precedent (§2) — the source material supports several real paragraphs; a short, evidence-complete entry is correct, not a defect to pad.

---

## 7. Content Boundary — Every Claim Classified

| # | Claim / section | Classification |
|---|---|---|
| 1 | The webhook was trusted as the sole signal a transaction completed | **Direct evidence** — "The Problem" |
| 2 | Webhooks are not guaranteed delivery (general property) | **Direct evidence** — "The Problem" |
| 3 | Real payments occasionally completed on Paystack's side without being reflected in the platform | **Direct evidence** — "Challenges Encountered" |
| 4 | A user-initiated "check my payment status" button was considered | **Direct evidence** — "Investigation" |
| 5 | The button was rejected because it depends on the user noticing/acting | **Direct evidence** — "Investigation," quoted verbatim in `docs/63` §7 |
| 6 | The chosen fix is a self-chaining, backing-off poll against the provider's transaction-status API | **Direct evidence** — "Investigation," "Architecture," "Engineering Decisions" |
| 7 | `TransactionMapping` keyed on a unique transaction reference lets the webhook and poller race safely | **Direct evidence** — "Architecture" |
| 8 | The system is live in production and the specific gap is closed | **Direct evidence** — "Outcome" |
| 9 | No transaction-volume or reliability figures are published | **Direct evidence** — "Outcome" states this explicitly; preserving the absence is itself direct evidence, not an inference |
| 10 | "A third-party webhook is a hint... not a guarantee" | **Direct evidence** — "Lessons Learned" callout, quoted verbatim |
| 11 | Reordering/rephrasing the above into first-person-adjacent Engineering Log prose | **Editorial restructuring** — no new fact introduced |
| 12 | Weaving the rejected-alternative reasoning and the lesson callout into one coherent passage instead of two separate, repeated statements of the same underlying point | **Editorial restructuring** — `docs/63` §8/§9's own finding; a structural choice about *where* an already-stated fact appears, not a new fact |
| 13 | The exact calendar date the webhook/poller work was implemented | **Requires confirmation** — not resolved by this plan; §3 resolves a *different* question (publication date), not this one, and this plan does not conflate the two |
| 14 | Any number: how many payments were affected, how long the gap existed, retry count, backoff interval, outage duration | **Forbidden** — not established anywhere in the source; not estimated here |
| 15 | Any team discussion, named individual, or motivation beyond what the case study states | **Forbidden** |
| 16 | Any claim about Paystack's own undocumented behavior beyond "webhooks are not guaranteed delivery" | **Forbidden** |
| 17 | Any performance improvement or business-impact figure | **Forbidden** |
| 18 | Any implementation detail beyond what "Architecture"/"Engineering Decisions" state (e.g., specific Celery configuration, specific backoff formula) | **Forbidden** |

**Only rows 1–12 (Direct evidence, Editorial restructuring) may enter the E4 MDX.** Row 13 is a real gap this plan does not fill — it does not block authoring, because §3's publication-date decision is a distinct, already-resolved question and the entry's body never needs to state an exact implementation date to tell its story accurately. Rows 14–18 are explicit prohibitions, restated from `docs/63` §6 and re-confirmed unchanged by this turn's re-read of the case study.

---

## 8. The Rejected Alternative — Exact Handling

Verified directly against the current case study text (§2):

- **What the alternative was**: a user-initiated "check my payment status" button.
- **Why it was considered**: it surfaced during "Investigation," once webhook unreliability was understood, as one candidate for what to pair the webhook with.
- **Why it was rejected — the source's own stated reason, verbatim**: *"it depends on the user staying on the page and manually triggering the check, which is exactly the failure mode (a webhook silently never arriving) it needs to cover."*
- **How the final implementation differs**: the chosen fallback moves the same responsibility onto the system itself — a scheduled, self-chaining poll against the provider's transaction-status API, requiring no client action at all.
- **How this is narrated without adding unsupported reasoning**: the entry may restate this reasoning in its own words but must not strengthen, elaborate, or supply a reason the source doesn't state (e.g., no claim about how often users would fail to click the button, no invented UX research, no claim about what fraction of users stay on the page — none of these are in the source). `docs/63` §7's own conclusion — "safe to include, verbatim in substance" — is carried forward unchanged.

---

## 9. Lesson Callout — One Coherent Narrative, Not Two

Per `docs/63` §8's own finding, re-confirmed this turn: the lesson callout's closing clause — *"never by asking a user to notice and retry"* — and the rejected-alternative's stated reason (§8 above) are **the same underlying fact, stated at two different points in the case study's own narrative.** This plan requires the eventual E4 entry to avoid repeating that fact as two disconnected sections. The intended shape (folded into §6's flow, not a separate work item):

1. The rejected alternative is introduced naturally, as part of the "what was investigated" beat.
2. The final fallback design follows immediately, framed as the system-driven answer to the same problem the button couldn't solve.
3. The lesson — "a webhook is a hint, not a guarantee; the fallback has to be system-driven" — emerges as the natural conclusion of that sequence, not as a separately introduced, re-explained callout.

**No redundant "Lesson" section is authorized merely because the Case Study has one.** If the eventual entry chooses to close with a distinct, quotable sentence (matching E3's own precedent — E3's closing paragraph states its lesson directly, in flowing prose, not as a separate heading or callout element), that sentence should read as the payoff of the narrative already told, not a restatement of a fact the entry already gave in full two paragraphs earlier.

---

## 10. Related Work

**Authored from the Work side only**, per `docs/37` §12/D2's architecture (unchanged, re-confirmed §2): the relationship lives entirely in `content/work/cookeaze.mdx`'s `engineeringLog` array.

**Exact companion edit**, the only change this plan specifies to that file:

```diff
-engineeringLog: []
+engineeringLog: ["cookeaze-webhook-reliability-gap"]
```

No other line of `cookeaze.mdx` changes — not its title, description, tags, `relatedContent`, body, or any other frontmatter field.

**Cardinality re-verified**: `workFrontmatterSchema.engineeringLog: z.array(z.string()).default([])` is unconstrained (`schema.ts:119`, §2). Nothing in the schema, loader, or either resolver (`resolveRelatedEngineeringLogs()` in `case-study-relationships.ts`, `resolveRelatedWorkForLog()` in `engineering-logs.ts`) enforces one-to-one. Multiple Engineering Logs on one Case Study are already fully supported without any change — directly relevant should Haya ever gain a second entry (E2, still deferred per `docs/62` §5/§20), and equally relevant here only in that it confirms this one-line edit is the complete, correct implementation with no additional wiring required.

**Dual-direction activation, re-confirmed live (not just architecturally, the way `docs/62` §8 first found it for E3)**: this same one-line edit will simultaneously (a) make `cookeaze.mdx`'s own, already-built "Related Engineering Logs" section render E4 for the first time (`app/work/[slug]/page.tsx:118-121`, confirmed unchanged and already wired), and (b) make E4's own "Related Work" section render Cookeaze (`app/engineering-log/[slug]/page.tsx:100,126-128`, confirmed unchanged and already wired). Both paths already work today, proven by E3/Haya's own live pair — this is the second real exercise of the same, already-correct mechanism, not a new code path.

---

## 11. Related Knowledge — Re-Verified, Remains Empty

Re-checked directly against the current four real Knowledge articles (§2): `data-transfer-objects`, `how-jwt-works`, `money-floating-point`, `optimistic-vs-pessimistic-locking`. None has a genuine textual connection to the webhook/idempotency story:

- `data-transfer-objects` — API-shape concern, unrelated.
- `how-jwt-works` — authentication, unrelated to payment reconciliation.
- `money-floating-point` — floating-point precision in money representation, a different correctness concern than delivery-guarantee/idempotency.
- `optimistic-vs-pessimistic-locking` — the closest topical neighbor (both are concurrency-adjacent), but, per the identical reasoning `docs/61` §11 already applied to E2's own RPC-retry story, that article is specifically about database row-locking, not network-delivery/idempotency semantics — forcing this link would be topical-adjacency inference, which this task explicitly rules out.

**No Related Knowledge relationship is added.** `relatedContent` is omitted from E4's frontmatter (schema default `[]`), matching E3's own precedent exactly (§2) rather than authoring an explicit empty array. No new Knowledge article is created by this plan.

---

## 12. Tags

| Tag | Status | Why it applies to E4 |
|---|---|---|
| `payments` | **Existing** — already real on `cookeaze.mdx` itself, and on `vaultpay.mdx`/`haya.mdx` | Directly on-topic; reuses established vocabulary rather than introducing a synonym |
| `webhooks` | **New** — confirmed absent from every real content file in the repository (§2) | Names the specific mechanism this entry is about; no existing tag covers webhook reliability |
| `reliability` | **New** — confirmed absent (§2) | The general theme of the lesson (a webhook alone isn't a reliable source of truth); also `docs/61`/`docs/62`'s own previously-named candidate for a future E2 entry, so introducing it here is a single new-tag decision that a later E2 pass can reuse rather than a second, independent one |

**No unrelated document's tags are touched by this plan.** Only E4's own `tags` frontmatter is affected — no global tag vocabulary file exists to update (tags remain free-form, per `docs/51` Decision 4, unreversed and re-confirmed unchanged).

---

## 13. Frontmatter Contract — Re-Verified Against the Actual Schema

`articleFrontmatterSchema` (`schema.ts:17-33`), unchanged, is the schema E4 uses directly — no dedicated Engineering-Log-specific schema exists or is proposed. Fields E4 will actually author, matching E3's own live precedent exactly:

| Field | Authored? | Value / behavior |
|---|---|---|
| `title` | Yes | §4 |
| `description` | Yes | §4 |
| `publishedAt` | Yes | §3/§4 — `"2024-12-03"`, `z.coerce.date()` |
| `tags` | Yes | §12 — `["payments", "webhooks", "reliability"]` |
| `updatedAt`, `technologies`, `difficulty`, `featured`, `draft`, `coverImage`, `prerequisites`, `relatedContent`, `series`, `seriesOrder`, `author` | No — omitted | All default silently (`draft: false`, `relatedContent: []`, etc.) — matching E3's own precedent (§2) of a four-field frontmatter block, not populating every optional field the schema happens to allow |

**`draft` is omitted, not set to `false` explicitly** — E3 does the same (§2); the default already produces the intended "real, published" behavior, and this plan does not introduce a stylistic deviation from the one live precedent that already exists.

**Loader recognition, re-confirmed**: `getEngineeringLogSlugs()`/`getSlugs("engineering-log")` derives slugs from `fs.readdirSync()` over `content/engineering-log/` (unchanged `loader.ts` behavior, already proven live by E3's own file) — a new `cookeaze-webhook-reliability-gap.mdx` file dropped into that directory is automatically picked up by every resolver that calls `getAllEngineeringLogEntries()`/`getEngineeringLogSlugs()`, with no registration step anywhere else.

---

## 14. Slug

`cookeaze-webhook-reliability-gap` — re-verified this turn (§2):

- **Uniqueness**: no file of this name exists in `content/engineering-log/`; the only real entry there is `haya-invitation-gate-removal.mdx`.
- **Route conflict**: none — `/engineering-log/[slug]` is a dynamic segment with no static sibling this slug could collide with (unlike `/work`'s `library` reservation).
- **Convention match**: follows E3's exact established style — `{project}-{event}`, kebab-case, no stop words (`haya-invitation-gate-removal` → `cookeaze-webhook-reliability-gap`).
- **Descriptiveness**: names the specific engineering event (a webhook reliability gap at Cookeaze), not the project generically.

---

## 15. File Manifest

| File | Change | Notes |
|---|---|---|
| `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` | **New** | Full entry per §4 (frontmatter) and §6–§9 (narrative), authored in a future pass — not created by this plan |
| `content/work/cookeaze.mdx` | **Modified** — exactly one line | `engineeringLog: []` → `engineeringLog: ["cookeaze-webhook-reliability-gap"]` (§10); no other line changes |

**Two files. No other production file is required.** Re-inspection (§2) found the entire Engineering Log system — schema, loaders, resolvers, components, routes, Search, RSS, Sitemap — already live and already correctly wired to pick up a new real entry with zero additional code. This is a stronger confirmation than `docs/62`/`docs/63` could make, since both were written before E3 existed to prove it. **No architectural gap was found; nothing in this plan is stopped or expanded in scope.**

---

## 16. Discovery Behavior

### Engineering Log index (`/engineering-log`)

`app/engineering-log/page.tsx` (re-read in full, §2) reads `getAllEngineeringLogEntries()`, sorts via `sortByPublishedDate()`, and renders one `LogEntryRow` per entry with no registration step — E4 appears automatically the moment its `.mdx` file exists and is not `draft: true`. The header's entry count (`entries.length`) becomes `2`, and the pluralization (`"entries"`) already handles the transition from E3's singular `"entry"` state correctly, with no code change.

### Engineering Log detail (`/engineering-log/cookeaze-webhook-reliability-gap`)

`app/engineering-log/[slug]/page.tsx` (§2) resolves any real slug through `engineeringLogEntryExists()`/`getEngineeringLogEntryBySlug()` and `generateStaticParams()` from `getEngineeringLogSlugs()` — the new slug resolves normally with zero code change, the same mechanism already proving E3 live.

### Previous / Next — the one behavior genuinely new since `docs/63`, re-derived, not assumed

`resolvePreviousNextLog()` (`engineering-logs.ts:157-181`, re-read this turn) sorts entries **newest-first** via `sortByPublishedDate()`; for an entry at array index `i`, `previous = sorted[i+1]` (the next-older entry) and `next = sorted[i-1]` (the next-newer entry).

With E4's `publishedAt` resolved to `"2024-12-03"` (§3) against E3's `publishedAt` of `"2025-10-08"` (`haya-invitation-gate-removal.mdx:4`), **E4 is chronologically older than E3** — the reverse of what a reader might assume from authoring order. Newest-first sorted order is therefore `[E3, E4]`, giving:

| Entry | `previous` | `next` |
|---|---|---|
| E3 (`haya-invitation-gate-removal`, 2025-10-08) | **E4** (`cookeaze-webhook-reliability-gap`) | `null` (E3 is now the newest of the two) |
| E4 (`cookeaze-webhook-reliability-gap`, 2024-12-03) | `null` (E4 is now the oldest of the two) | **E3** (`haya-invitation-gate-removal`) |

**This is the opposite pairing from what this task's own §16 instructions describe as the expected outcome** ("E3's Next points to E4... E4's Previous points to E3") — that description implicitly assumed E3 predates E4 chronologically, which held true when both documents were unauthored abstractions but does not hold once E4's actual `publishedAt` (Cookeaze's own date, resolved in §3) is applied. **This is exactly the kind of assumption this task instructs not to make** ("Do not assume the ordering without checking the actual dates") — flagged here explicitly as a genuine, re-derived finding rather than silently reconciled to match the task's own illustrative example. The correct release-gate check for the future implementation pass is: **E3's `previous` resolves to E4, and E4's `next` resolves to E3** — not the reverse. No self-link occurs either way (both entries have distinct slugs); no incorrect neighboring entry results from this correction — it is the same, already-correct resolver logic, applied to the actual dates rather than an assumed order.

If a future authoring pass instead wants E3 → E4 chronological order to hold (matching this task's own illustrative framing), that would require choosing a different `publishedAt` for E4 than Cookeaze's own date — which §3 explicitly does not authorize revisiting; this plan surfaces the consequence rather than silently picking a date that would produce the assumed ordering.

---

## 17. Work Relationship Behavior — Both Directions, Re-Verified Live

```
Cookeaze
   |  frontmatter.engineeringLog: ["cookeaze-webhook-reliability-gap"]  (section 10 -- the only edit)
   v
resolveRelatedEngineeringLogs(cookeaze, ...)      ->  E4 appears in Cookeaze's own
  (case-study-relationships.ts, unchanged)             "Related Engineering Logs" section
                                                        (app/work/[slug]/page.tsx:118-121)

E4
   |  logEntry.slug === "cookeaze-webhook-reliability-gap"
   v
resolveRelatedWorkForLog(E4, getAllCaseStudies()) ->  Cookeaze appears in E4's own
  (engineering-logs.ts, unchanged)                     "Related Work" section
                                                        (app/engineering-log/[slug]/page.tsx:100,126-128)
```

Both resolvers read the identical `caseStudy.frontmatter.engineeringLog` array (`docs/62` §8's finding, re-confirmed live this turn against the actual current source of both files, §2) — one edit activates both directions. No other Case Study (`vaultpay`, `gohunt`, `haya`) is affected: each has its own independent `engineeringLog` array, and this plan touches only Cookeaze's.

---

## 18. Search, RSS, Sitemap — No Registration Required

All three already read `getAllEngineeringLogEntries()` directly (`search.ts:60-63,137-146`; `rss.ts:35`; `sitemap.ts:50,85-86`, all re-confirmed this turn, §2) — E4 becomes matchable/feed-included/sitemap-included automatically once the `.mdx` file exists, with zero code change:

- **Search**: `payments` now spans four real documents (Cookeaze itself, VaultPay, Haya, and E4); `webhooks`/`reliability` become matchable for the first time via E4's own tags.
- **RSS**: merges by real `publishedAt` `Date` (`rss.ts`'s own documented "hard requirement" — chronological merge, not per-collection blocks) — E4's earlier date (§3) places it correctly among older items in the merged feed, not necessarily near the top, which is the correct behavior for a real chronological feed, not a defect.
- **Sitemap**: gains `/engineering-log/cookeaze-webhook-reliability-gap` automatically.

---

## 19. Guardrails — Restated for This Plan's Own Scope

Per this task's own explicit scope boundary, re-confirmed against every file this plan names:

- **No `.mdx` file created or modified** by this plan itself — §4–§9 specify the future contract; authoring happens in a subsequent pass.
- **`cookeaze.mdx` not modified** by this plan — §10 specifies the exact one-line diff for a future pass; `git status` confirms zero change to this file as of this document.
- **No schema, route, component, or resolver modified or proposed** — §2 confirms every piece of infrastructure E4 needs already exists and requires no extension, unlike `docs/38`'s own WI-1 (which *did* need one small `DocumentLayout` addition for E3's first-ever live entry). E4 needs nothing analogous — the one prior architectural gap (`docs/38` §3) was already closed by Task 6.2's own implementation.
- **No Search, RSS, Sitemap, or navigation file modified** — §18 confirms all three already read the real collection with no per-entry registration step.
- **No other Work or Knowledge file touched** — `vaultpay.mdx`, `gohunt.mdx`, `haya.mdx`, and all four Knowledge articles remain out of this plan's scope entirely.
- **The only file created by this task is this document itself** — `docs/64-ENGINEERING_LOG_E4_IMPLEMENTATION_PLAN.md`.

---

## 20. Work Items — For a Future Authoring Pass, Not Executed Here

Specified so a subsequent implementation task can execute directly, matching the shape `docs/62` §18 already used for E3's own work items.

### WI-1 — Re-Verify E4's Contract and Source Evidence at Authoring Time

**Purpose**: confirm `cookeaze.mdx` and the Engineering Log collection state haven't drifted between this plan and actual authoring.

**Files**: none — verification only.

**Acceptance criteria**: `cookeaze.mdx`'s frontmatter and body match §2/§5's citations exactly; if either has drifted, the affected part of this contract is revised before authoring proceeds, not silently authored against stale evidence.

### WI-2 — Author the E4 Engineering Log Entry

**Files**: `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (new).

**Exact contract**: §4 (frontmatter), §6 (narrative flow), §7 (content boundary — only rows 1–12 may appear), §8 (rejected-alternative handling), §9 (lesson woven in, not duplicated).

**Dependencies**: WI-1.

### WI-3 — Update Cookeaze's `engineeringLog` Array

**Files**: `content/work/cookeaze.mdx` (modified).

**Exact contract**: §10's one-line diff — no other field changes.

**Dependencies**: WI-2 (the slug must exist as a real value before it's referenced).

### WI-4 — Release Candidate Review

**Purpose**: the release gate, mirroring `docs/62` §18's own WI-4 for E3.

**When it runs**: only after WI-1 through WI-3 are complete.

**Verification steps:**

**Content**
1. Every factual claim in the entry traces to a quoted source sentence (§5/§7) — no claim from §7's Forbidden rows appears anywhere.
2. The entry reads as restructured narrative, not a miniature Case Study (§6) — no imposed heading template.
3. The rejected alternative and the lesson are woven into one coherent passage, not repeated as two disconnected statements of the same fact (§9).
4. Title, slug, description, tags match §4 exactly.
5. `publishedAt` is exactly `"2024-12-03"` (§3) — not a different date substituted for any reason.

**Relationships**
6. `/engineering-log/cookeaze-webhook-reliability-gap` resolves and renders correctly.
7. Its own "Related Work" section shows Cookeaze.
8. `/work/cookeaze`'s own "Related Engineering Logs" section now shows E4.
9. No incorrect Work relationship — `vaultpay`, `gohunt`, `haya` remain unaffected; `haya`'s own existing E3 relationship is unaffected.

**Discovery**
10. `/engineering-log` index lists both E3 and E4, count shows `2`.
11. **Previous/Next matches §16's re-derived table exactly**: E3's `previous` -> E4, E3's `next` -> `null`; E4's `previous` -> `null`, E4's `next` -> E3. **Not** the reverse — this is the specific regression this plan's own re-derivation (§16) exists to catch.
12. `/search?q=webhooks` (or another real term from the entry) returns E4.
13. `payments`/`webhooks`/`reliability` tag reuse/introduction confirmed correct.
14. `/rss.xml` includes E4, correctly positioned by its real `publishedAt` in the merged chronological feed (not necessarily near the top — §18).
15. `/sitemap.xml` includes E4's URL.

**Regression**
16. `/`, `/knowledge`, `/work`, `/work/vaultpay`, `/work/gohunt`, `/work/haya`, `/engineering-log`, `/engineering-log/haya-invitation-gate-removal`, `/search`, `/rss.xml`, `/sitemap.xml`, `/about`, and an invalid route — all expected statuses, E3's own page unaffected by E4's addition except its now-real `next` value (item 11).

**Automated**
17. `pnpm exec eslint` clean.
18. `pnpm exec tsc --noEmit` clean.
19. `pnpm build` clean.

**Git**
20. `git status --short` / `git diff -- content/` shows exactly the two files in §15, only the fields specified — no unrelated content change.

**Release recommendation**: `APPROVED` or `REFINEMENTS REQUIRED`.

---

## 21. Sequencing

```
WI-1 (re-verify E4 contract)
        |
        v
WI-2 (author E4 entry)
        |
        v
WI-3 (update cookeaze.mdx's engineeringLog array)
        |
        v
WI-4 (Release Candidate Review)
```

---

## 22. Rollback Plan

Two files: one new, independently deletable Engineering Log entry; one one-line array edit to an already-real Work file. No schema, route, or component involvement — the identical minimal rollback profile `docs/62` §20 already established for E3.

---

## 23. Risk Register

| # | Risk | Mitigation |
|---|---|---|
| 1 | Previous/Next direction implemented backwards (matching this task's own illustrative assumption instead of the actual resolved dates) | §16's explicit re-derivation and WI-4 item 11's exact expected values |
| 2 | Fabricated claim from §7's Forbidden list slipping into the entry | §7's row-by-row classification; WI-4 item 1 |
| 3 | Lesson callout and rejected-alternative reasoning repeated as two disconnected statements | §9's explicit single-narrative requirement; WI-4 item 3 |
| 4 | Withdrawal race-condition/double-spend material bleeding into E4's scope | §5's explicit exclusion, re-confirmed against the current case study text |
| 5 | Incorrect tag (typo, wrong reuse) | §12's table, traced to existing usage or explicitly flagged new value |
| 6 | Wrong `publishedAt` (a different date substituted for Cookeaze's own) | §3/§4's explicit, singular value; WI-4 item 5 |
| 7 | Missing or incorrect `engineeringLog` array edit | §10's exact diff; WI-4 items 6–9 |
| 8 | Related Knowledge added speculatively | §11's re-verified empty state; WI-4 (no such check needed since none is added) |
| 9 | Unrelated content or code file touched | §15/§19's exhaustive two-file manifest; WI-4 item 20 |

---

## 24. Acceptance Criteria (Plan-Level)

- Every field in E4's content contract traces to `docs/63`'s already-approved design, re-verified against the live repository, not re-derived from scratch (§2, §4).
- The publication-date question is resolved exactly as this task's own brief specifies, with the semantic distinction (publication date vs. implementation date) stated explicitly (§3).
- Every proposed narrative element traces to a quoted source sentence; every forbidden category is named explicitly (§7).
- The rejected alternative and lesson-callout handling avoid redundancy by design, not by accident (§8, §9).
- The Related Work relationship is fully specified as a single, exact one-line diff, with both resolution directions re-verified live (§10, §17).
- Related Knowledge is re-verified empty, not assumed (§11).
- Previous/Next chronology is re-derived from the actual resolved dates, not assumed from this task's own illustrative framing — and the resulting, corrected pairing is stated explicitly as a release-gate check (§16, WI-4 item 11).
- File manifest is exhaustive and minimal — two files, no schema/route/component/resolver change (§15).
- No production code, schema, route, component, or content file was modified to produce this document.

---

## 25. No Implementation — Confirmed

No `.mdx` file was created. `content/work/cookeaze.mdx` was read, not modified. No schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was touched. `git status --short` at the time of writing shows only this document as new.

---

## Final Report

1. **Re-inspection** (§2): no drift found anywhere in `docs/63`'s or `docs/62`'s description of the repository; the entire Engineering Log system is confirmed already live and correctly wired, proven by E3's own working entry — a strictly stronger evidentiary position than either prior document had.
2. **Publication date** (§3): resolved exactly as this task's brief specifies — Cookeaze's own `publishedAt` (`2024-12-03`) — with the publication-date-vs-implementation-date distinction stated explicitly, and the real chronological consequence (E4 predates E3) surfaced rather than absorbed silently.
3. **Content contract** (§4): title, description, slug, tags, and date source stated exactly, unchanged from `docs/63`'s approved design.
4. **Engineering story** (§5): the seven-beat narrative preserved exactly; the withdrawal/double-spend material explicitly excluded, re-confirmed against the live case study text.
5. **Natural narrative** (§6): a six-beat intended flow specified as guidance, not a mandatory template — matching E3's own live, unheaded-prose precedent.
6. **Content boundary** (§7): eighteen individual claims classified into Direct evidence / Editorial restructuring / Requires confirmation / Forbidden; only the first two categories may enter the MDX.
7. **Rejected alternative** (§8): the status-check button's what/why/rejection-reason/handling fully specified, verbatim-grounded.
8. **Lesson callout** (§9): required to be woven into one coherent narrative with the rejected alternative, not repeated.
9. **Related Work** (§10): a single, exact one-line diff to `cookeaze.mdx`; cardinality and dual-direction activation both re-verified against live code, not just architecture docs.
10. **Related Knowledge** (§11): re-verified empty against the current four-article corpus; none added.
11. **Tags** (§12): `payments` reused; `webhooks`/`reliability` flagged as new, each with its own stated rationale.
12. **Frontmatter contract** (§13): re-verified against the actual `articleFrontmatterSchema`; exactly four fields authored, matching E3's own live precedent.
13. **Slug** (§14): re-verified unique, convention-matched, descriptive.
14. **File manifest** (§15): exactly two files — one new Engineering Log entry, one one-line edit to `cookeaze.mdx`. No architectural gap found; scope not expanded.
15. **Discovery behavior** (§16): index and detail resolution confirmed automatic; **Previous/Next re-derived from the actual resolved dates, finding and flagging a real reversal from this task's own illustrative assumption** — the single most important verification finding in this plan.
16. **Work relationship behavior** (§17): both directions traced through the actual current source of both resolver functions, confirmed to share the identical underlying data.
17. **Search/RSS/Sitemap** (§18): all three confirmed to require zero registration step, already reading the real collection directly.
18. **Guardrails** (§19): every boundary this task specified re-confirmed untouched.
19. **Work items and release gate** (§20–§21): four work items specified for a future authoring pass, with an exact, itemized Release Candidate Review — not executed by this plan.
20. **Risk register** (§23): nine risks named, each with its own specific mitigation already built into an earlier section.
21. **File manifest for this task itself** (§25): exactly one file, this document.

**Implementation readiness: READY.** Unlike `docs/62`/`docs/63`, which both left `publishedAt` as an open question blocking authoring, this plan has no remaining open question — the date is resolved (§3), the contract is exact (§4), the content boundary is exhaustive (§7), and the one genuine new finding this turn (§16's Previous/Next reversal) is a release-gate check to apply during a future authoring pass, not a blocker to planning. **This document authorizes no implementation** — authoring E4's `.mdx` file and editing `cookeaze.mdx`'s `engineeringLog` array remain future work, per this task's own explicit scope.
