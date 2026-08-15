# 55 — Related Content Discovery: Design Proposal

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document. No route, component, schema, or content was created or modified to produce it.

Task 7.3's design-stage proposal, following Task 7.1 (Real Content Migration) and Task 7.2 (Tag Discovery), both complete and approved.

---

## 1. Core Question

> Can readers discover useful connected content from a page they are already reading, using relationships that are explicit, trustworthy, and already compatible with this repository's architecture?

Answered by direct re-inspection, not assumed: **yes, partially, already** — five relationship types are already built, wired, and rendering (§4), one more than either `docs/50` or `docs/51` credited (§7 corrects this). What's genuinely missing is narrower than "Related Content" as a category: **Work↔Work is the one real gap**, and the evidence in §5–§6 shows it can be closed without a schema change, by reusing a field and a resolution strategy this codebase's own code already anticipated. The recommendation (§14) is a small, single addition to already-proven architecture, not a new subsystem — and it comes with an honest yield caveat (§4, §16) this document does not paper over.

---

## 2. Decisions Carried Forward From `docs/51`, Not Reopened

- Related Content stays small.
- Existing explicit relationship resolvers remain authoritative — none is replaced or redesigned here.
- No similarity/ranking engine — every relationship this document discusses, existing or proposed, is authored-metadata-driven.
- A Work↔Work resolver was named as a possible deferred extension — evaluated concretely in §5–§6, not re-decided from scratch.
- `docs/24` Principle 8 (authored over inferred) governs every option considered.

---

## 3. Re-Inspection Method

Every relationship type, resolver, and consumer named below was confirmed this turn by direct file read — `relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `articles.ts`, `schema.ts`, `document-layout.tsx`, `app/knowledge/[slug]/page.tsx`, `app/work/[slug]/page.tsx`, `app/engineering-log/[slug]/page.tsx`, and every `Related*` component — plus every real `content/*.mdx` frontmatter block, not carried forward from any prior document unchecked.

---

## 4. Current Relationship Map

| Relationship | Source | Target | Authored field | Resolver | UI component | Route | Cardinality | Ordering | Limit | Empty behavior | Real data today |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Prerequisites | Knowledge | Knowledge | `prerequisites: string[]` | `resolvePrerequisites()` | `RelatedLearning` | `/knowledge/[slug]` | Many | Authored order preserved | 4 (`DEFAULT_RELATIONSHIP_LIMIT`) | Group omitted if empty | **Zero** — no real article sets `prerequisites` |
| Related Concepts | Knowledge | Knowledge | `relatedContent: string[]` | `resolveRelated()` | `RelatedLearning` | `/knowledge/[slug]` | Many | Authored order preserved | 4 | Group omitted if empty | **Zero** — no real Knowledge article sets `relatedContent` |
| Continue Learning | Knowledge | Knowledge | `series`/`seriesOrder` | `resolveContinueLearning()` | `RelatedLearning` | `/knowledge/[slug]` | 0 or 1 | Series order | 1 | Omitted if empty | **Zero** — no real content uses `series` |
| Same Topic (fallback) | Knowledge | Knowledge | `topic` (derived, not authored per-pair) | `resolveSameTopicFallback()` | `RelatedLearning` | `/knowledge/[slug]` | Many | Alphabetical by title | 3 (`SAME_TOPIC_FALLBACK_LIMIT`) | Omitted if empty | **Zero** — every real topic has exactly one real article, so there is never a sibling to show |
| Work → Knowledge | Work | Knowledge | `relatedContent: string[]` | `resolveRelatedKnowledge()` | `RelatedKnowledge` (`components/work/`) | `/work/[slug]` | Many | Authored order preserved | 4 | Omitted if empty | **One real link** — `haya.mdx` → `how-jwt-works` |
| Work → Engineering Log | Work | Engineering Log | `engineeringLog: string[]` | `resolveRelatedEngineeringLogs()` | `RelatedEngineeringLogs` (`components/work/`) | `/work/[slug]` | Many | Authored order preserved | 4 | Omitted if empty | **Zero** — all 4 real case studies set `engineeringLog: []` |
| Engineering Log → Work | Engineering Log | Work | Work's own `engineeringLog: string[]`, reverse-resolved | `resolveRelatedWorkForLog()` | `RelatedWork` (`components/engineering-log/`) | `/engineering-log/[slug]` | Many | Caller's order (`getAllCaseStudies()`) | 4 | Omitted if empty | **Zero** — `content/engineering-log/` has no real entries to test against |
| **Engineering Log → Knowledge** | Engineering Log | Knowledge | `relatedContent: string[]` | `resolveArticleReferences()` (shared, imported directly — no wrapper) | `RelatedKnowledge` (`components/engineering-log/` — a **different** component than Work's) | `/engineering-log/[slug]` | Many | Authored order preserved | 4 | Omitted if empty | **Zero** — same reason as above |
| Previous/Next (Knowledge) | Knowledge | Knowledge | `series`/`seriesOrder`, then `topic` | `resolvePreviousNext()` | `PreviousNext` | `/knowledge/[slug]` | 0, 1 each side | Series, then alphabetical-within-topic | 1 each side | Side omitted if empty | Real — every real article has a topic-tier previous/next among its 4 siblings |
| Previous/Next (Work) | Work | Work | `domain`, then collection order | `resolvePreviousNextCaseStudy()` | `PreviousNext` | `/work/[slug]` | 0, 1 each side | Domain-adjacent, then array order | 1 each side | Side omitted if empty | Real — domain tier fires for VaultPay↔Cookeaze (both "Backend Infrastructure") |
| Previous/Next (Engineering Log) | Engineering Log | Engineering Log | `publishedAt` | `resolvePreviousNextLog()` | `PreviousNext` | `/engineering-log/[slug]` | 0, 1 each side | Chronological | 1 each side | Side omitted if empty | Untestable — zero real entries |
| **Work → Work** | Work | Work | **None — no field exists** | **None** | **None** | `/work/[slug]` | — | — | — | — | **Does not exist** — explicitly, deliberately deferred (`app/work/[slug]/page.tsx`'s own docstring) |

**The one finding this table makes unavoidable**: of the eight already-wired relationship regions above (excluding Previous/Next, which is sequential navigation, not "related content"), **exactly one produces a real, non-empty result today** — Work → Knowledge, via Haya's single `relatedContent` entry. Every other relationship type is correct, tested infrastructure with nothing real to resolve against — not a code gap, a content-corpus-size gap (8 total real documents, 0 real Engineering Log entries, exactly one article per real topic).

---

## 5. Correction to `docs/50`/`docs/51`: Engineering Log → Knowledge Already Exists

`docs/50` §5.3 and `docs/51` §8's own Related Content decision both discuss the existing relationship infrastructure without naming Engineering Log → Knowledge specifically as already built. Direct re-inspection this turn (`app/engineering-log/[slug]/page.tsx`, confirmed) shows it is: a log entry's `relatedContent` is resolved against `getAllArticles()` via `resolveArticleReferences()` (the exact shared helper Knowledge's own Related Concepts already uses) and rendered by `components/engineering-log/related-knowledge.tsx` — a real, separate component from Work's own `RelatedKnowledge`, sharing only the `relatedKnowledge` `DocumentLayout` slot name, not implementation. This is recorded here as a direct correction, following this doc series' own established discipline of re-verifying rather than restating prior findings unchecked — not a new capability this document proposes, one that already shipped in Task 6.2 and simply wasn't named precisely before.

---

## 6. Work ↔ Work — The One Real Candidate

**No authored field exists today capable of expressing "Case Study A relates to Case Study B."** Confirmed by direct re-read of `workFrontmatterSchema` (`schema.ts`): `domain`, `status`, `timeline`, `engineeringLog` are the only fields beyond the shared article base — no `relatedWork`, `relatedProjects`, `relatedCaseStudies`, or equivalent.

**But a resolution *strategy* was already anticipated, in writing, before this task**. `case-study-relationships.ts`'s own docstring states it directly: *"This file also does not implement Related Case Studies... It would resolve through this same file, using the same domain (and eventually theme) adjacency this module already computes for Previous/Next, whenever the task that owns the Work relationship/navigation model in full picks it up."* `app/work/[slug]/page.tsx`'s own docstring states the identical deferral independently. Two files, written at different times, agree on the same anticipated shape: **derive it from `domain`, don't author a new field.**

**Evaluated against this task's own A/B framing (§5 of the authorization)** — and against a third option that framing didn't name:

- **(A) A new authored field** (`relatedWork: string[]`, mirroring `relatedContent`) — technically small and architecturally consistent with the existing pattern, but it launches with **zero real data**, exactly the fate every other authored-field relationship in §4 has met (Prerequisites, Related Concepts, Continue Learning, Work→Engineering Log — all real, all empty). It would also require content authoring, out of this design-only task's scope regardless.
- **(B) Premature, unsupported by the current content model** — the honest read if "supported" means "would launch with real data across a meaningful share of the real corpus." Four case studies is a small base for any relationship type to look rich immediately.
- **(C) Not listed in the original framing, and the one this document recommends: derive it from the already-real `domain` field, exactly as already anticipated in writing.** No schema change. No new authoring burden — `domain` is already set on all 4 real case studies. And unlike (A), it does **not** launch empty: `vaultpay.mdx` and `cookeaze.mdx` both set `domain: "Backend Infrastructure"` — a real pair, confirmed by direct grep, exists today.

**The precise resolution shape, distinct from the existing `findDomainNeighbor()` — stated explicitly to avoid conflating two different existing patterns**: `findDomainNeighbor()` (`case-study-relationships.ts`) finds the single *immediate* domain-adjacent neighbor in each direction, for Previous/Next — a positional query. Related Case Studies needs *every* case study sharing a domain, capped — the shape `resolveSameTopicFallback()` (`relationships.ts`) already establishes for Knowledge's own domain-shaped fallback tier (`articles.filter(item => item.frontmatter.topic === article.frontmatter.topic)...slice(0, limit)`), not `findDomainNeighbor()`'s. A Work↔Work resolver should follow `resolveSameTopicFallback()`'s pattern, applied to `domain` instead of `topic` — reuse of an existing shape, not a new one, and not a duplicate of the positional neighbor-finder already serving a different purpose (Previous/Next).

---

## 7. Knowledge Relationships — What's Built vs. What's Surfaced

All four Knowledge → Knowledge relationship tiers (§4) are built, wired, and rendering on every real article via `RelatedLearning` — none is unsurfaced. The honest finding is not "unbuilt," it's **"unpopulated"**: real content simply hasn't authored `prerequisites` or `relatedContent` yet, and the corpus is too small (one article per topic) for the Same Topic fallback to ever fire. **Knowledge never links to Work or Engineering Log** — `resolveRelatedLearning()`'s every resolver call resolves exclusively against `getAllArticles()` (confirmed, `relationships.ts`), an intentional, single-collection scope this document does not propose changing (no evidence requires it, and `docs/51`'s own Related Content decision explicitly scoped this task narrowly).

---

## 8. Engineering Log Relationships — Both Directions Already Real, Both Untestable

Both Engineering Log → Work (Task 6.2) and Engineering Log → Knowledge (§5, corrected) exist, wired, correct. Neither has real data to resolve against — `content/engineering-log/` remains empty. **No new Engineering Log relationship type is proposed here merely for symmetry** — Engineering Log already has both a forward (→Knowledge) and reverse (→Work) cross-collection relationship; adding an Engineering-Log↔Engineering-Log "related entries" tier would duplicate what chronological Previous/Next already does for a collection whose own IA (`docs/03`) explicitly makes chronology its primary structure, not topic- or domain-based grouping.

---

## 9. Related Content vs. Tag Discovery — Made Concrete, Not Asserted

Per this task's own framing: Tags answer *"what other content has this metadata,"* Relationships answer *"what content did the author explicitly decide belongs with this piece."* The real data proves these are genuinely different, non-overlapping mechanisms, not two names for the same thing:

- **The one real editorial relationship in this repository — `haya.mdx`'s `relatedContent: ["how-jwt-works"]` — is invisible to Tag Search.** Confirmed by direct comparison: `how-jwt-works`'s tags are `["jwt", "authentication", "tokens"]`; `haya`'s tags are `["backend", "ai", "concurrency", "payments", "platform"]` — **zero overlap**. A reader tag-searching any of Haya's five tags would never be led to `how-jwt-works`, and vice versa. The author's explicit judgment — these two documents belong together — carries information no shared metadata field encodes.
- Conversely, `concurrency` (Task 7.2's own cross-collection Tag Search proof) connects `optimistic-vs-pessimistic-locking`, `vaultpay`, and `haya` — a real, useful connection, but **no author declared it**; it's an emergent property of independently-chosen tags, not an editorial decision either document's author made about the other.

**Neither mechanism should absorb the other.** This document does not propose deriving relationships from tag overlap (that would be exactly the "inferred similarity" `docs/24` Principle 8 and `docs/51` both already rule out), and does not propose surfacing Related Content results inside `/search` (that would blur Search's own already-approved, narrow boundary, `docs/41`/`docs/54`).

---

## 10. UX Placement

Per this task's own hint, confirmed by the existing pattern (§4): every relationship type that exists today lives exclusively on a **detail page** (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`) — never a listing page. This is structural, not incidental: a listing page (`/knowledge`, `/work`, `/work/library`, `/engineering-log`) has no single "current document" for a relationship to be relative *to* — "related to what?" has no answer at the top of a list. **Work↔Work, if built, belongs on `/work/[slug]` only**, the identical placement every existing relationship type already uses. No listing page gains a Related Content region under this proposal.

---

## 11. Existing UI Components — Reused, Not Generalized

Confirmed inventory: `RelatedLearning` (Knowledge, `components/content/`), `RelatedKnowledge` ×2 (Work-scoped and Engineering-Log-scoped — two separate files, confirmed, not one shared component despite the same name), `RelatedEngineeringLogs` (Work-scoped), `RelatedWork` (Engineering-Log-scoped), `ContinueExploring`, `PreviousNext`, `DocumentLayout`. Every one of these already follows the same established precedent, stated explicitly in `RelatedKnowledge`'s own docstring: *"every route owns its own section components, even where the visual pattern is shared."*

**No generic `RelatedContent` component is proposed.** A hypothetical Work↔Work UI would be a new, small, Work-scoped component (e.g. `RelatedCaseStudies`, `components/work/`) following the identical stretched-link-card idiom `RelatedKnowledge` already uses — not a cross-collection abstraction, and not a reskin of an existing component whose data vocabulary belongs to a different relationship (per this task's own "avoid abstraction for abstraction's sake" instruction, and the identical reasoning `document-layout.tsx`'s own docstring already gives for why `relatedWork` became its own slot instead of overloading `relatedKnowledge` or `engineeringLogs`).

---

## 12. DocumentLayout — Slot Capacity, Not Modified

`document-layout.tsx` (re-read in full this turn, not modified) currently exposes five relationship-adjacent slots: `relatedLearning` (Knowledge), `relatedKnowledge` (Work→Knowledge *and*, confirmed §5, Engineering-Log→Knowledge — two different callers, same slot name, different components), `engineeringLogs` (Work→Engineering-Log), `relatedWork` (Engineering-Log→Work), and `previousNext` (all three, sequential). **A hypothetical Work↔Work relationship would need one new slot** — e.g. `relatedCaseStudies` — following exactly the precedent Task 6.2 already set when `relatedWork` was added: a new, separately-landmarked `Section`, its own `aria-label`, conditionally omitted when absent, no change to any other slot's behavior. `document-layout.tsx`'s own docstring already states the reasoning this exact addition would follow (*"Deliberately a new... slot rather than reusing `engineeringLogs`... or `relatedKnowledge`... already correctly scoped to a genuinely different relationship"*) — Related Case Studies answers *"what else demonstrates a similar engineering concern,"* distinct from both of Work's existing two relationship regions (*"what concept does this apply"*, *"what process produced this"*). **Not modified by this document** — the exact addition is specified for a future implementation plan to make, not made here.

---

## 13. Cardinality

| Relationship | Cardinality | UI behavior |
|---|---|---|
| Every existing relationship type (§4) | Zero → many | Zero: region omitted entirely (`&& <Section>` pattern, confirmed uniform across every consumer). One or many: rendered as a list, capped at `DEFAULT_RELATIONSHIP_LIMIT` (4) or, for Knowledge's Same Topic fallback specifically, `SAME_TOPIC_FALLBACK_LIMIT` (3) — the one already-justified exception, per that constant's own docstring ("a fallback tier, not a primary relationship, and shouldn't visually outweigh the explicit groups above it") |
| Work↔Work, if built | Zero → many, same shape | Would reuse `DEFAULT_RELATIONSHIP_LIMIT` (4) — the shared editorial ceiling every Work-side relationship already uses, not `SAME_TOPIC_FALLBACK_LIMIT` (3), since this is proposed as a primary Work relationship region, not a fallback tier the way Knowledge's Same Topic is |

The pattern is uniform and this document does not propose changing it: **zero → render nothing (not an empty heading, not a placeholder); one or many → a capped list in the collection's own established visual idiom.**

---

## 14. Architecture Decision — D1: Derive Work↔Work From `domain`, Not a New Field

**Context**: A Work↔Work relationship has no authored field today; two independent existing docstrings already anticipated resolving it from `domain` adjacency rather than a new field.

**Options Considered**: (A) a new `relatedWork`-style authored field; (B) conclude the content model doesn't yet support this relationship and defer further; (C) derive it from the existing, real `domain` field via a `resolveSameTopicFallback()`-shaped resolver.

**Chosen Approach**: (C).

**Rationale**: `domain` is already authored (real, required, on every real case study) — deriving from it is not inference in the `docs/24` Principle 8 sense (no similarity scoring, no embeddings, no heuristic); it's the same authored-adjacency pattern Knowledge's own Same Topic fallback already uses, one collection over. It requires no schema change (this task's own guardrail) and no new content authoring, and — unlike option (A) — it does not launch with zero real data: VaultPay↔Cookeaze is real today. Option (B) is not chosen because the evidence doesn't support "unsupported" — the data and the resolution pattern both already exist; what's missing is one small resolver function following an established shape.

**Trade-offs**: Domain-adjacency is a coarser signal than an explicit, author-declared `relatedWork: ["gohunt"]` would be — the same trade-off Knowledge's Same Topic fallback already accepts for its own tier, documented there as "a graceful fallback rather than the primary navigation strategy." Unlike that precedent, this document proposes domain-adjacency as Work's *primary* Work↔Work signal, since no more explicit alternative exists — worth naming as a real, accepted limitation, not glossed over. If authors later want to declare a specific pair's relationship more precisely than shared domain allows, that's a future, separately-evidenced schema decision (option A), not ruled out permanently by choosing (C) now.

**Consequences**: One new small resolver in `case-study-relationships.ts` (following `resolveSameTopicFallback()`'s shape, applied to `domain`), one new small component (`RelatedCaseStudies`, `components/work/`), one new `DocumentLayout` slot (§12) — all specified precisely enough for an implementation plan to execute, none of it built here.

---

## 15. Explicit Non-Goals

- No schema change (`domain` already exists; no new field is authored or required).
- No content authored or edited.
- No `DocumentLayout` modification (§12 documents the exact future change; this document makes none).
- No new generic `RelatedContent` component (§11).
- No relationship derived from tag overlap or any other inferred-similarity signal (§9, §14).
- No Related Content region added to any listing page (§10).
- No Engineering-Log↔Engineering-Log relationship type (§8).
- No Knowledge→Work or Knowledge→Engineering-Log relationship (no evidence requires it; `resolveRelatedLearning()`'s single-collection scope is unchanged).
- No implementation plan — this document is design-only, per its own authorization.

---

## 16. Open Questions

**Q1 — Should the four already-real, currently-empty relationship types (Prerequisites, Related Concepts, Continue Learning, Work→Engineering-Log) be prioritized for editorial follow-through (authors adding `relatedContent`/`prerequisites`/`engineeringLog` entries to real frontmatter) ahead of, or alongside, building Work↔Work?** *Why it matters:* §4's own table shows the bottleneck for four of five existing relationship types is content, not code — building a sixth resolver doesn't address that. *Evidence needed:* an editorial/content-ownership decision, not an architectural one; this document doesn't resolve it, only names it.

**Q2 — Once real Engineering Log content exists, should its own Previous/Next (currently the collection's only real sequential mechanism) gain a topic- or domain-like grouping tier, or does chronology alone remain sufficient?** *Why it matters:* today this is untestable (zero real entries); nothing here should be decided against data that doesn't exist yet.

**Q3 — If Work↔Work's domain-adjacency yield stays at one pair as the real corpus grows slowly, at what point does that justify revisiting option (A) (an explicit `relatedWork` field)?** *Why it matters:* names a concrete revisit trigger rather than leaving the domain-derived approach as a permanent, undiscussed ceiling.

---

## 17. Acceptance Criteria (Document-Level)

- Every existing relationship type is re-verified against the live repository, not restated from `docs/50`/`docs/51` unchecked — including the one correction (§5) those documents' own characterization missed.
- The Work↔Work recommendation is grounded in two independent, pre-existing docstrings' own anticipated design, not invented fresh.
- The one architecture decision (D1, §14) follows the same Options/Rationale/Trade-offs/Consequences discipline this doc series already establishes, and is honest about its own limitation (coarser than an explicit field) rather than overselling it.
- The Tags-vs-Relationships distinction (§9) is proven with real data (the Haya/JWT zero-tag-overlap fact), not merely asserted.
- No production code, route, component, schema, or content was modified to produce this document.

---

## Summary

Five relationship types already exist in this repository, not four — Engineering Log → Knowledge shipped in Task 6.2 and is corrected into the record here (§5). Of all five, exactly one produces a real result today (Haya → `how-jwt-works`); the rest are correct, tested infrastructure waiting on content the corpus hasn't grown into yet, a finding this document treats as the central, honest fact governing everything else it recommends. The one genuine gap — Work↔Work — can be closed without a schema change, without new content authoring, and without inventing a resolution strategy: two independent files already wrote down the answer (`domain` adjacency, the same pattern Knowledge's own Same Topic fallback already uses) before this task began. It produces one real pair today (VaultPay ↔ Cookeaze), a modest but honest yield this document does not inflate. Tags and Relationships are proven, not asserted, to be genuinely different discovery mechanisms — the repository's own single real editorial relationship is completely invisible to tag search. Nothing here proposes a generic Related Content component, a new DocumentLayout modification (the exact future one is specified, not made), or any relationship derived from inferred similarity. No production code, route, component, schema, or content was modified to produce this document.
