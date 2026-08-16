# 68 — Knowledge Article A3 "Idempotency" — Implementation Plan

## Status

Implementation Plan — translating `docs/67-KNOWLEDGE_IDEMPOTENCY_EDITORIAL_PLAN.md`'s approved editorial contract into an exact, dependency-ordered, implementation-ready specification.

> This document authorizes no implementation. No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce it.

Task 7.12's implementation-planning turn. Every assumption below is re-verified against the live repository this turn, not copied from `docs/67` unchecked, per this task's own explicit instruction.

---

## 1. Authoritative Sources — Read, Re-Verified

Read in full for this task: `docs/67-KNOWLEDGE_IDEMPOTENCY_EDITORIAL_PLAN.md`, `docs/66-MILESTONE_7_DISCOVERY_REASSESSMENT.md`, `docs/58-CONTENT_EXPANSION_EDITORIAL_PLAN.md`, `docs/56-RELATED_CONTENT_IMPLEMENTATION_PLAN.md`, `docs/55-RELATED_CONTENT_DISCOVERY.md`. No filename discrepancy against this task's own reading list.

Re-inspected directly this turn, complete files not excerpts: all four real `content/knowledge/*.mdx`, `content/work/cookeaze.mdx`, `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (E4), `content/knowledge/optimistic-vs-pessimistic-locking.mdx`, `src/lib/content/schema.ts`, `src/lib/content/articles.ts`, `src/lib/content/relationships.ts`, `src/lib/content/engineering-logs.ts`, `src/lib/content/case-study-relationships.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, `src/app/knowledge/page.tsx`, `src/app/knowledge/[slug]/page.tsx`, `src/components/content/related-learning.tsx`, `src/components/engineering-log/related-knowledge.tsx`.

**One routing discrepancy confirmed, not new to this task but re-verified directly**: there is no `src/app/knowledge/[topic]/page.tsx` — topic and article resolution both live in the single `src/app/knowledge/[slug]/page.tsx` route (Next.js cannot host two dynamic segment names at the same path position; `docs/20`'s own "Routing Resolution Order" governs this, already documented in that file's own header comment). Read the actual file at its real location.

**`git status --short` at the start of this task**: only `docs/65`, `docs/66`, `docs/67` appear as untracked — zero diff on any content, schema, resolver, route, or component file, confirming no drift since `docs/67` was approved.

---

## 2. Editorial Contract — Carried Forward Exactly From `docs/67`

| Field | Approved value | `docs/67` reference |
|---|---|---|
| Title | *"Idempotency: Making 'Do This Twice, Safely' a Real Guarantee"* | §10 |
| Description | *"A retried request or a redelivered webhook isn't a rare failure in a real system — it's a certainty. Idempotency is what makes handling the same operation twice as safe as handling it once."* | §10 |
| Slug | `idempotency` | §10 — re-verified unique this turn: no file of this name in `content/knowledge/`, `content/work/`, or `content/engineering-log/` |
| Topic | `distributed-systems` | §10 |
| Tags | `idempotency`, `correctness`, `concurrency`, `payments` | §10 |
| Technologies | None | §10 — no real anchor's evidence is technology-specific in a way that adds discovery value; would also be the first Knowledge article to populate the field, unjustified without a concrete need |
| Series | None — not invented | §10 — zero real `series` usage exists anywhere in the corpus |
| Featured | Not recommended | §11 |
| `publishedAt` | **Explicit user input required** | §12 — see §4 below |
| Article scope | §7's own concept table — duplicate requests, retries, webhook redelivery, idempotency keys, database uniqueness, transactional boundaries, safe retry behavior, same-vs-new-operation semantics; explicitly excludes HTTP-method idempotency survey and distributed-consensus material | §7 |
| Narrative structure | Introduction → The Problem → The Core Concept → Visual Model → Implementation → Trade-offs → Common Mistakes → Real-world Examples → Key Takeaways → Related Learning | §8–§9 |
| Evidence boundary | §13's content-boundary table — direct evidence, editorial synthesis, requires confirmation, forbidden | §13 |

**No alternative metadata is proposed anywhere in this plan.** No discrepancy found between `docs/67`'s contract and the current repository state — every field re-verifies exactly (§1's `git status` confirmation; direct slug/tag/topic re-checks below in §11).

---

## 3. Publication Date — External Authoring Prerequisite, Not Invented

Per this task's own explicit instruction, re-stated as binding:

> **Publication date is an external authoring prerequisite and must be supplied before the MDX is created.**

No date is reused from Cookeaze (`2024-12-03`), E4 (`2024-12-03`), VaultPay (`2026-08-01`), or any other real document, and none is invented. This is not a question this document asks the user to resolve inline — it is recorded as an unresolved input WI-3 depends on (§20), the same "requires confirmation, not silently defaulted" discipline `docs/64` §3 applied to a comparable question, applied here in the opposite direction (there, a date was explicitly resolved by task instruction; here, one is explicitly withheld by task instruction). **This document is not blocked on the date** — every other section proceeds to full specification regardless.

---

## 4. Expected Production Footprint — Re-Derived, With One Discrepancy Against `docs/67` Recorded Explicitly

`docs/67` §16 recommended **four** future metadata changes: the new A3 file, plus three `relatedContent` additions (`vaultpay.mdx`, `cookeaze.mdx`, and E4). **This task's own §5 instruction narrows the expected future production footprint to exactly two files** — the new A3 MDX and E4's `relatedContent` only — explicitly directing that `content/work/cookeaze.mdx`, `optimistic-vs-pessimistic-locking.mdx`, other Knowledge articles, and other Engineering Log entries are **not** to be modified "unless direct inspection proves an existing resolver requires something else."

**Discrepancy recorded, not silently reconciled**: `docs/67`'s four-file recommendation and this task's two-file scope are not in conflict over what's *evidenced* — both agree the VaultPay/Cookeaze Work-side links are real, legitimate, editorially justified relationships (`docs/67` §3–§4). They differ over what's *in this implementation pass's own batch*. Direct resolver re-inspection this turn (§6) confirms: no resolver, route, or component **requires** the Work-side links to exist for E4→A3, A3's own Related Concepts, or `optimistic-vs-pessimistic-locking`'s own Same-Topic behavior to function correctly — all three are independently complete without touching `vaultpay.mdx` or `cookeaze.mdx` at all. **Resolver inspection does not prove the narrower scope invalid; it confirms the narrower scope is architecturally sufficient and correct on its own.** This mirrors the exact "smallest meaningful batch, not everything designed at once" discipline `docs/62` §1 already established when it authored E3 alone despite E4 already being fully specified in the same document.

**Therefore, per this task's own explicit scope, the approved future production footprint for this implementation pass is exactly two files:**

1. **New**: `content/knowledge/idempotency.mdx`
2. **Existing**: `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` — receiving only the approved `relatedContent` addition (§6)

**Not modified by this plan, and explicitly deferred (not rejected) for a possible future, separately-scoped batch**: `content/work/vaultpay.mdx`, `content/work/cookeaze.mdx` (both real, evidenced Work→Knowledge candidates per `docs/67` §16, outside this pass's approved scope). **Not modified, full stop, no future batch implied**: `optimistic-vs-pessimistic-locking.mdx`, `haya.mdx`, `haya-invitation-gate-removal.mdx`, `gohunt.mdx`, `data-transfer-objects.mdx`, `how-jwt-works.mdx`, `money-floating-point.mdx` — none was ever recommended by `docs/67`, and none is required by any resolver, confirmed by direct re-inspection (§6–§7).

---

## 5. Article Title/Description/Metadata — Repeated Verbatim From §2 for This Section's Own Completeness

No changes from §2. Every value there is the exact, final, approved value — this document does not re-derive or re-litigate any of it, per this task's own §3 instruction not to invent alternative metadata.

---

## 6. Relationship Direction — Re-Verified Against the Actual Resolver Code

Re-read this turn, not assumed: `app/engineering-log/[slug]/page.tsx`, `app/knowledge/[slug]/page.tsx`, `relationships.ts`, `case-study-relationships.ts`.

- **Engineering Log → Knowledge, confirmed already fully supported**: `app/engineering-log/[slug]/page.tsx` calls `resolveArticleReferences(logEntry.frontmatter.relatedContent, knowledgeArticles, logEntry.slug, DEFAULT_RELATIONSHIP_LIMIT)` where `knowledgeArticles = getAllArticles()`. This function (`relationships.ts`) resolves a raw slug list against real, published Knowledge articles, silently skipping any slug that doesn't resolve — the same shared helper Knowledge's own Related Concepts and Work's own Related Knowledge already use. **No resolver modification is required or proposed** — this mechanism has been live since Task 6.2 and was already exercised correctly for Haya's own real link before this task.
- **Slug resolution, confirmed**: `getArticleSlugs()`/`articleExists()` (`articles.ts`) derive slugs from `fs.readdirSync()` over `content/knowledge/` — the moment `idempotency.mdx` exists, `"idempotency"` becomes a resolvable slug automatically, with no registration step.
- **Published-content filtering, confirmed**: `getAllArticles()` is `filterDrafts()`-wrapped — a `draft: true` article would be silently excluded; A3 will carry no `draft` field, defaulting `false` (real, published), consistent with every other real article.
- **Direction, confirmed correct**: `E4 → idempotency` (i.e., `cookeaze-webhook-reliability-gap.mdx` declaring `relatedContent: ["idempotency"]`) is the only direction any resolver in this repository reads. Re-confirmed via `app/knowledge/[slug]/page.tsx`: `resolveRelatedLearning(article, allArticles)` where `allArticles = getAllArticles()` — a Knowledge article's own `relatedContent` **only ever** resolves against other Knowledge articles. **No reciprocal declaration is proposed** — A3 declaring `relatedContent: ["cookeaze-webhook-reliability-gap"]` would pass schema validation (the field imposes no collection-scoping) but would be read by zero resolvers anywhere in this codebase, the identical structural fact `docs/59` §5 already established for the analogous Work↔Knowledge question. Adding it would be dead, misleading metadata — explicitly not part of this plan.

---

## 7. Same-Topic Behavior — Resolver-Traced, Asymmetry Stated Precisely

**Topic assigned to A3**: `distributed-systems` (§2). **Existing article sharing that topic**: `optimistic-vs-pessimistic-locking` — the only other real article in `distributed-systems`, re-confirmed this turn (`topic: "distributed-systems"`, frontmatter re-read directly, §1).

Traced directly against `relationships.ts`'s current, unmodified shape:

```ts
function resolveRelatedLearning(article, articles = getAllArticles()) {
  const continueLearning = resolveContinueLearning(article, articles); // series-based, always []
  const relatedConcepts = resolveRelated(article, articles);            // article's own relatedContent
  const sameTopic =
    continueLearning.length === 0 && relatedConcepts.length === 0
      ? resolveSameTopicFallback(article, articles)
      : [];
  ...
}
```

**A3's own authored relationship (§8/§19)**: A3 is authored with `relatedContent: ["optimistic-vs-pessimistic-locking"]` — the first real Knowledge↔Knowledge relationship this repository will have. This is part of *creating* the new file (§4 item 1), not a modification to an existing one.

**For A3**: `continueLearning = []` (no series). `relatedConcepts = resolveRelated(A3)` → resolves A3's own `relatedContent` → finds `optimistic-vs-pessimistic-locking` → returns one item. Since `relatedConcepts.length > 0`, **`sameTopic` does not fire for A3**. A3's own Related Learning region renders a **"Related Concepts"** group (the exact UI label, confirmed in `related-learning.tsx`) containing `optimistic-vs-pessimistic-locking` — not a "More From This Topic" group.

**For `optimistic-vs-pessimistic-locking`** (left untouched, per §4 — its own `relatedContent` stays `[]`): `continueLearning = []`, `relatedConcepts = []` (unchanged). Since both are empty, **`sameTopic` fires**: `resolveSameTopicFallback(locking, allArticles)` filters `topic === "distributed-systems"`, excludes self → finds A3 → returns `[A3]`. `optimistic-vs-pessimistic-locking`'s own Related Learning region gains a **"More From This Topic"** group (the exact rendered heading, confirmed in `related-learning.tsx` — internally named `sameTopic`, displayed as *"More From This Topic"*) containing A3 — the first time this group has ever rendered non-empty anywhere in this repository, since every topic has held at most one article until now.

**Not symmetric, stated precisely per this task's own instruction**: the connection is visible from both articles' own pages, but through two different, correctly-distinguished mechanisms — an authored "Related Concepts" link on A3's side, a structural "More From This Topic" fallback on `optimistic-vs-pessimistic-locking`'s side. This is the exact `docs/67` §15 finding, re-verified against the live component this turn (not just the resolver function) to confirm the actual rendered group labels match this description precisely.

**This is confirmed to be the first real multi-article topic in this repository's history** — every one of the four current real topics has held exactly one article since the corpus began (`docs/66` §3, unchanged).

---

## 8. Article Authoring Contract — Enough Detail to Author Without Guessing

Not written by this document — specified precisely enough for a future authoring pass.

**Frontmatter, exact shape and field order** (matching `knowledgeFrontmatterSchema`'s own declared field order, the same placement discipline `docs/60` §4 already used for `featured`):

```yaml
---
title: "Idempotency: Making 'Do This Twice, Safely' a Real Guarantee"
description: "A retried request or a redelivered webhook isn't a rare failure in a real system — it's a certainty. Idempotency is what makes handling the same operation twice as safe as handling it once."
topic: "distributed-systems"
publishedAt: "<SUPPLIED BY USER — see §3>"
tags: ["idempotency", "correctness", "concurrency", "payments"]
difficulty: "intermediate"
relatedContent: ["optimistic-vs-pessimistic-locking"]
---
```

Matches `optimistic-vs-pessimistic-locking.mdx`'s own field order exactly (`title`, `description`, `topic`, `publishedAt`, `tags`, `difficulty`) with `relatedContent` appended, the one field that article's own frontmatter doesn't carry. No `featured`, `technologies`, `series`, `seriesOrder`, `prerequisites`, `draft`, `author`, or `coverImage` line — all default silently, matching this collection's own established minimal-frontmatter convention.

**Heading hierarchy and expected sections**, per `docs/18-ARTICLE_TEMPLATE.md` and every real article's own confirmed shape (`docs/67` §8/§9):

1. `## Introduction` — motivate why "just don't call it twice" isn't achievable by assumption.
2. `## The Problem` — a request retried or a webhook redelivered is a certainty in networked systems; applying the duplicate is sometimes harmless, sometimes a real correctness failure.
3. `## The Core Concept` — idempotency defined; same-operation vs. new-operation semantics; the hard part is recognizing "this is the same operation again," which requires a stable identifier.
4. `## Visual Model` — a diagram of two resolution attempts against the same reference, one succeeding, one becoming a safe no-op (mirroring Cookeaze's own shape); optionally a brief second, explicitly-generic contrast (`SET x = 5` vs. `x = x + 1`).
5. `## Implementation` — two real, distinct mechanisms: VaultPay's dedicated idempotency-key table, checked atomically; Cookeaze's unique constraint plus state-transition guard.
6. `## Trade-offs` — Advantages / Disadvantages / Alternatives (VaultPay's rejected Redis-cache approach; Cookeaze's rejected whole-codepath locking) / When not to use it.
7. `## Common Mistakes` — assuming "only one thing should ever call this" is enough (Cookeaze's own Lessons Learned sentence, restructured); caching a key somewhere it can be silently evicted (VaultPay's own rejected alternative, restructured).
8. `## Real-world Examples` — VaultPay and Cookeaze, both named directly.
9. `## Key Takeaways` — a concise 3–4 item bullet summary.
10. `## Related Learning` — one sentence connecting to `optimistic-vs-pessimistic-locking` plus a `[Distributed Systems topic](/knowledge/distributed-systems)` link, matching every other real article's exact closing convention.

**Examples / code usage**: at minimum one SQL-shaped example (an idempotency-key check, mirroring `optimistic-vs-pessimistic-locking`'s own `SELECT ... FOR UPDATE` snippet style — short, focused, one point per block), one plain-text sequence/structural diagram in Visual Model. No `<Callout>` component — confirmed zero real Knowledge articles use one (`docs/67` §8); A3 should not introduce the first.

**Real project references**: VaultPay and Cookeaze, restricted strictly to §9's content boundary — no invented detail beyond what either case study states.

**Conclusion/takeaway style**: matches the tight, second-person-adjacent, non-promotional tone confirmed across all four real articles (`docs/67` §8).

---

## 9. Content Evidence Boundary — Carried Forward From `docs/67` §13

**Authorable — Direct evidence**: VaultPay's named "safe behavior under retried/duplicated requests" requirement; VaultPay's idempotency-key table and its Redis-rejection rationale; Cookeaze's `TransactionMapping`/unique-reference mechanism; Cookeaze's own "Idempotency has to be enforced at the data layer..." Lessons Learned sentence; E4's own restatement of the identical mechanism (mechanism-equivalence, term absent).

**Authorable — Editorial synthesis**: the general definition of idempotency; same-operation vs. new-operation semantics; the general idempotency-key pattern; naturally-idempotent vs. non-idempotent operations as a **clearly-labeled generic example**, never presented as project evidence.

**Forbidden — must not be invented**: exact retry counts, failure rates, transaction volumes, outage durations, customer-impact figures, undocumented Paystack/PostgreSQL provider behavior, any database constraint syntax not already shown in either source (beyond a labeled generic SQL example), any team discussion, or any project motivation beyond what each case study's own "Rationale" already states. Every one of these is independently re-confirmed absent from both full case-study bodies this turn (§1).

**`publishedAt`**: Requires confirmation — not authorable until supplied (§3).

---

## 10. Knowledge Article Style — Implementation Expectations, Re-Verified

Re-read all four real articles' complete bodies again this turn (§1), confirming `docs/67` §8's findings hold unchanged:

- **Heading hierarchy**: one `<h1>` from the document's own title (rendered by `DocumentHeader`, not authored in the MDX body); every body section is an `<h2>`, matching all four real articles exactly.
- **Paragraph density**: a few paragraphs per section, no section left as a single sentence, none padded.
- **Code blocks**: short, single-purpose, always preceded by prose explaining the approach before the code appears (`docs/18`'s own "explain the approach before showing code" rule) — never a large unexplained block.
- **Callouts**: none in any real Knowledge article body — A3 should not introduce the first.
- **Practical examples**: always grounded in a "Real-world Examples" section naming actual systems (this codebase's own case studies, or, where absent from the corpus, general industry examples like `optimistic-vs-pessimistic-locking`'s own Hibernate/Django mention) — A3's own real-world grounding is VaultPay and Cookeaze specifically, stronger than any of the four existing articles' own Work-side grounding (none of which name a specific real project by name inside their own body prose the way A3 will).
- **Terminology**: technical terms introduced gradually, plain language first (`docs/18`).
- **Conclusion**: "Key Takeaways" as a tight bullet list, then "Related Learning" closing with one sentence and a topic link — never a restated summary paragraph.
- **Article depth**: moderate-to-substantial, matching the four real articles' own range — A3's two full case-study anchors (one with an explicit named lesson) support at least this depth.

**No new article component or format is introduced** — `DocumentLayout`, `DocumentHeader`, `TableOfContents`, `ArticleBody`, `RelatedLearning`, `PreviousNext` are all reused exactly as they already render for the four existing real articles; none is modified by this plan.

---

## 11. Topic and Taxonomy — Re-Verified, Guardrails Stated

- **Topic slug**: `distributed-systems`, confirmed a real, current `TOPIC_SLUGS` member (`topics.ts`, re-read this turn — 8 slugs, unchanged since Milestone 4).
- **Topic label**: *"Distributed Systems"* — confirmed via `findTopic("distributed-systems")` (`placeholder-topics.ts`), the same display-metadata lookup `optimistic-vs-pessimistic-locking`'s own Related Learning closing sentence already renders (*"Browse more of the Distributed Systems topic"*).
- **Tags**: `idempotency` (new — confirmed absent from the current 22-value repository-wide tag vocabulary, re-grepped this turn), `correctness`/`concurrency`/`payments` (all three confirmed existing, re-grepped this turn against their current real usages).
- **Technologies**: none — confirmed no evidenced cross-collection need exists (§2).
- **Series**: none — confirmed zero real usage anywhere; **this plan explicitly forbids inventing one**.

**Explicit prevention, per this task's own instruction, for whoever authors A3 from this plan**:

- Do **not** invent a new topic — `distributed-systems` already exists and honestly fits (§7 of `docs/67`).
- Do **not** invent a Series — none exists anywhere in this repository's real content; inventing one to hold a single article violates `docs/51` Decision 1 and `docs/58` §12's own unreversed deferral.
- Do **not** casually introduce a new Technology value — none is justified (§2); if a future need arises, it is a separate, explicitly-scoped editorial decision, not an incidental addition here.
- Do **not** modify the global tag vocabulary — `idempotency` is one new free-form string addition, consistent with `docs/51` Decision 4 (tags stay free-form, no controlled vocabulary); no tag file, constant, or registry exists to "modify" in the first place.

---

## 12. Featured Decision — Confirmed Current State, Expected Behavior

Current real `featured` state, re-verified this turn: `how-jwt-works` (true), `money-floating-point` (true) — exactly 2, both Knowledge, unchanged since Task 7.6. `getFeaturedArticles()` (`articles.ts`, re-read in full) caps at `limit: 3`; current Start Here composition, re-derivable from real dates: `[money-floating-point, how-jwt-works, data-transfer-objects]` — the third slot is the one fallback slot, currently occupied by `data-transfer-objects`.

**Expected behavior after A3 is authored, `featured` omitted (default `false`) per §2**:

- A3 does **not** enter the featured set — it is not among `getFeaturedArticles()`'s featured-first group (only `how-jwt-works`/`money-floating-point` are).
- Existing featured ordering (`how-jwt-works`, `money-floating-point`, both featured) is unaffected — neither's own frontmatter is touched.
- `data-transfer-objects` is **not** displaced from its fallback slot by A3's mere existence — the fallback slot is filled by the newest **non-featured** article; A3 competing for that slot depends entirely on its own (currently unresolved) `publishedAt` relative to `data-transfer-objects`'s `2026-08-12` and `optimistic-vs-pessimistic-locking`'s `2026-08-12`. **This is the one part of Start Here's exact future composition this plan cannot fully predict until §3's prerequisite is resolved** — recorded here explicitly rather than asserted as unchanged with false confidence. What *is* certain regardless of the eventual date: the featured group itself (`how-jwt-works`, `money-floating-point`) does not change, and no article is fully evicted from the page — at most, which single article occupies the one fallback slot may shift.
- No article outside Knowledge's own featured/fallback computation is affected — Work's `getFeaturedCaseStudies()` reads a fully separate collection, untouched by anything in this plan.

**To be re-verified during implementation (§21)**, once the real `publishedAt` is known.

---

## 13. Search — No Code Change, Reasoning Stated

`search.ts` (re-read in full this turn) already matches `title`, `description`, and each individual `tags` value (`matchesQuery()`, unchanged since Task 7.2) against all three real collections via `getAllArticles()`/`getAllCaseStudies()`/`getAllEngineeringLogEntries()`. **The moment `idempotency.mdx` exists as a real, non-draft file, it becomes searchable automatically** — no registration step, no code change.

**Future release-gate verification**:
- Title search: `/search?q=idempotency` (or a substring of the title) returns A3.
- Description search: a substring unique to the description returns A3.
- Tag search: `/search?q=idempotency`, `/search?q=correctness`, `/search?q=concurrency`, `/search?q=payments` each return A3 among their results.
- Result grouping: A3 appears under the *"Knowledge"* group heading, not Work or Engineering Log — confirmed by `searchContent()`'s own per-collection grouping, unchanged.
- Correct URL: `/knowledge/idempotency`.
- No duplicate result: `matchesQuery()` is a single boolean predicate combined with `||` across all three fields — a query matching both title and a tag still produces exactly one filtered result per document, the same structural guarantee `docs/54` §9 already established and re-confirmed unchanged this turn.

---

## 14. RSS — No Code Change, Chronology Deferred to the Date Prerequisite

`rss.ts` (re-read in full this turn) already merges all three collections' real items into one chronologically-sorted feed via `getFeedItems()`, sorted by each item's real `pubDate` (`frontmatter.publishedAt`). **No code change is required.**

**Future release-gate verification, once §3's prerequisite is resolved**:
- A3 appears in `/rss.xml`.
- Title, description match the approved contract exactly (§2).
- `link`/`guid` are both `${SITE_URL}/knowledge/idempotency`.
- `pubDate` matches the eventually-supplied `publishedAt`, RFC-822-formatted (`toRfc822()`, unchanged).
- **Chronological position cannot be predicted or asserted by this plan** — it depends entirely on the real date not yet supplied. This plan does not invent an expected position; the release gate must compute it fresh against whatever date is actually used, the same "do not invent expected chronology until the input exists" discipline this task's own §14 instruction requires.

---

## 15. Sitemap — No Code Change

`sitemap.ts` (re-read in full this turn) already maps `getAllArticles()` directly into `knowledgeEntries`, each with `lastModified: item.frontmatter.updatedAt ?? item.frontmatter.publishedAt` — **no code change required.**

**Future release-gate verification**:
- `/sitemap.xml` contains `/knowledge/idempotency`.
- Total URL count increases by **exactly one** — re-verifiable precisely: the current count (re-confirmed live in `docs/66` §3) is 24; after A3, it should be 25, with every other category (6 static, 8 topics, 3 remaining Work case studies... i.e. all 4, 4 knowledge→5, 2 engineering log) unchanged in count.
- No duplicate URL.
- `lastModified` follows the existing, unmodified policy — `updatedAt ?? publishedAt`; since A3 will have no `updatedAt`, this resolves to whatever `publishedAt` is eventually supplied.

---

## 16. Knowledge Index — `getAllArticles()`/`getFeaturedArticles()` Behavior, Re-Verified

Both functions (`articles.ts`, re-read in full) are confirmed unmodified since Task 7.1/7.6. **This plan does not propose changing `sortByPublishedDate()` or either featured-selection function** — both are shared primitives used identically across Knowledge and Work, and modifying either would be a cross-cutting change well outside this single-article plan's scope.

**Future release-gate verification**:
- A3 appears in `/knowledge`'s Recently Published (top-4 newest, `app/knowledge/page.tsx`'s own `.slice(0, 4)`) if its eventual date ranks it among the four newest — a real, date-dependent outcome, not asserted in advance.
- A3 is confirmed published (no `draft` field, defaults `false`).
- A3 is confirmed not featured (§12).
- Ordering follows the existing, unmodified `sortByPublishedDate()` — newest-first, ties broken by array/filesystem order, unchanged.
- No existing article changes position **except** where the newly-supplied `publishedAt` naturally interleaves it among the current four — an expected, date-dependent consequence, not a regression.

---

## 17. Topic Page — Expected Behavior, First Two-Article Topic

`/knowledge/distributed-systems` (resolved by `app/knowledge/[slug]/page.tsx`'s Step 1, re-read in full this turn):

- A3 appears in the topic's article list — `getAllArticles().filter(a => a.frontmatter.topic === "distributed-systems")` will return `[optimistic-vs-pessimistic-locking, idempotency]` (order depends on `getFeaturedArticles()`'s Start Here selection first, then `sortByPublishedDate()` for the remainder — both already-proven, unmodified mechanisms).
- `optimistic-vs-pessimistic-locking` remains present, unaffected — its own frontmatter is never touched by this plan (§4).
- Article count increases from 1 to **2** for this topic specifically — re-confirmed via `TopicHero`'s own `articleCount={topicArticles.length}` prop, which already computes this live from the real filtered array, no code change needed.
- Start Here / article list behavior stays honest — `getFeaturedArticles({ articles: topicArticles, limit: 3 })` naturally includes both real articles (2 < 3, no fallback ambiguity), and `TopicArticleList`'s own "remaining shelf" logic correctly shows zero remaining articles once both are in Start Here.
- No placeholder content appears anywhere in this flow — confirmed, this route has read exclusively real content since Task 7.1 (`docs/52`, re-confirmed unchanged this turn).

**This is confirmed to be the first topic page in this repository's history to render two real articles** — every topic page has shown at most one since the corpus began (§7).

---

## 18. Related Knowledge Behavior — Each Direction Verified Independently

Per this task's own explicit instruction not to assume symmetry:

### E4 (`/engineering-log/cookeaze-webhook-reliability-gap`)

Should show a **"Related Knowledge"** section (exact heading, `related-knowledge.tsx` re-read this turn) containing A3, **if and only if** WI-4 (§20) is completed — this is not automatic from A3's mere existence; E4's own `relatedContent` field must be added. Before WI-4, E4 shows no Related Knowledge section at all (its frontmatter currently has no `relatedContent` field whatsoever — confirmed by direct re-read this turn, §1 — not even an empty array, unlike `vaultpay.mdx`/`cookeaze.mdx`, both of which already declare the field).

### A3 (`/knowledge/idempotency`)

Should show a **"Related Concepts"** section (exact heading, `related-learning.tsx`) containing `optimistic-vs-pessimistic-locking` — automatic the moment A3's own frontmatter includes `relatedContent: ["optimistic-vs-pessimistic-locking"]` (§7/§8), no separate work item required beyond authoring the file itself.

### `optimistic-vs-pessimistic-locking`

Should show a **"More From This Topic"** section (exact heading, `related-learning.tsx`) containing A3 — automatic the moment A3 exists as a real, published, `distributed-systems`-topic article, **with zero edit to `optimistic-vs-pessimistic-locking.mdx` itself** (§7). This is the Same-Topic fallback firing for the first time in this repository's history.

**All three verified independently, not assumed identical** — E4's link requires an explicit future metadata edit (WI-4); A3's and the locking article's do not, because they follow directly and automatically from A3's own authored contract (§7).

---

## 19. Content Relationship Manifest — Exact Future Metadata Changes

| File | Change | Mechanism | Automatic or requires a work item? |
|---|---|---|---|
| `content/knowledge/idempotency.mdx` (new) | Full frontmatter per §8, including `relatedContent: ["optimistic-vs-pessimistic-locking"]` | Knowledge → Knowledge | Part of WI-3 (authoring the file itself) |
| `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` | Gains a new `relatedContent: ["idempotency"]` field — **currently has no `relatedContent` field at all** (confirmed by direct re-read this turn, §1; not an empty array to populate, a field to add) | Engineering Log → Knowledge | WI-4 |
| `content/knowledge/optimistic-vs-pessimistic-locking.mdx` | **None** | — | N/A — its Same-Topic discovery of A3 is fully automatic (§7, §18) |
| `content/work/cookeaze.mdx` | **None, this pass** — real, evidenced, deferred (§4) | — | Out of scope, per this task's own §5 instruction |
| Any other content file | **None** | — | Not evidenced, not proposed |

**If live code inspection had proven otherwise, that would be documented here explicitly** — it did not; every resolver re-read this turn (§6) confirms this manifest is complete and correct as stated.

---

## 20. Dependency Order

```
WI-1 (contract and repository re-verification)
        │
        ▼
WI-2 (publication-date prerequisite — not implementation, a gate)
        │
        ▼
WI-3 (author idempotency.mdx)
        │
        ▼
WI-4 (add E4 → idempotency relatedContent)
        │
        ▼
WI-5 (Release Candidate Review)
```

### WI-1 — Contract and Repository Re-Verification

**Purpose**: confirm this document's §1–§19 findings haven't drifted between this plan's approval and actual authoring (content and code can both move between the two).

**Files**: none — verification only.

**Acceptance criteria**: `optimistic-vs-pessimistic-locking.mdx`, `cookeaze.mdx`, E4's frontmatter, and every resolver named in §6/§13–§17 match this document's citations exactly; any drift is reported and this plan revised before WI-3 proceeds, not silently authored against stale assumptions.

### WI-2 — Publication-Date Prerequisite

**Purpose**: gate WI-3 on the one external input this plan cannot resolve itself (§3).

**Files**: none — **this is not an implementation step**, it is the explicit checkpoint confirming the date has been supplied before any content is written. Per this task's own instruction, **this document does not ask the user for the date** — it records the gate.

**Acceptance criteria**: a real, non-invented `publishedAt` value exists, attributable to an explicit authoring decision, before WI-3 begins.

### WI-3 — Author `idempotency.mdx`

**Files**: `content/knowledge/idempotency.mdx` (new).

**Exact contract**: §2 (metadata), §7/§8 (frontmatter shape, including the `relatedContent` line), §9–§10 (narrative and evidence boundary), §11 (taxonomy guardrails).

**Dependencies**: WI-1, WI-2.

### WI-4 — Add E4 → Idempotency Relationship

**Files**: `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (modified — one new `relatedContent` field, per §19).

**Dependencies**: WI-3 (the slug must exist as a real value before it's referenced).

### WI-5 — Release Candidate Review

**Purpose**: the release gate (§21).

**Dependencies**: WI-1 through WI-4 complete.

---

## 21. Release Candidate Review — Comprehensive Future Verification Gate

**Content**
1. `idempotency.mdx` frontmatter validates against `knowledgeFrontmatterSchema` — `pnpm build` parses it without error.
2. Title, description, slug exactly match §2 — no substitution.
3. Topic is exactly `distributed-systems`.
4. Tags exactly `["idempotency", "correctness", "concurrency", "payments"]` — no fifth value, no substitution, no `distributed-systems` duplicate.
5. Technologies field absent — no value invented.
6. No `series`/`seriesOrder` field present.
7. `featured` absent or `false`.
8. `publishedAt` is the real, user-supplied value (§3) — not a reused project date, not fabricated.
9. Every claim in the body traces to §9's Direct-evidence or Editorial-synthesis categories; zero Forbidden-category content anywhere.
10. Article structure and tone match §10's style findings — no callout introduced, heading hierarchy correct.

**Relationships**
11. E4's own Related Knowledge section shows `idempotency` (WI-4 confirmed live).
12. A3's own Related Concepts section shows `optimistic-vs-pessimistic-locking` (§18).
13. `optimistic-vs-pessimistic-locking`'s own "More From This Topic" section shows `idempotency`, with **zero diff** on that file itself (§7, §18).
14. No reciprocal/invalid metadata anywhere — A3 does not declare `relatedContent` pointing at E4 or any Work document (§6).

**Discovery**
15. `/knowledge` index includes A3 in Recently Published per its real date; Start Here composition matches §12's conditional prediction once the date is known.
16. `/knowledge/distributed-systems` shows both real articles, count = 2 (§17).
17. `/knowledge/idempotency` resolves and renders correctly.
18. `/search?q=idempotency` (title/tag), and at least one description-substring query, both return A3 (§13).
19. `/rss.xml` includes A3 with correct title/description/URL/GUID/date (§14).
20. `/sitemap.xml` includes `/knowledge/idempotency`; total count = 25 (§15).

**Existing behavior**
21. `data-transfer-objects`, `how-jwt-works`, `money-floating-point` — each individually re-checked: correct featured/unfeatured status unchanged, no unrelated frontmatter diff.
22. E3 (`haya-invitation-gate-removal`) — zero diff, zero behavior change.
23. E4 — only its new `relatedContent` field differs from its pre-WI-4 state; title/description/publishedAt/tags byte-identical.
24. `/work`, `/work/vaultpay`, `/work/cookeaze`, `/work/gohunt`, `/work/haya` — zero diff (§4's narrower scope confirmed).
25. `/` (Homepage), `/engineering-log`, `/about`, and an invalid route (404) — all render with expected status, unaffected.

**Automated**
26. `pnpm exec eslint` clean.
27. `pnpm exec tsc --noEmit` clean.
28. `pnpm build` clean.

**Git**
29. `git status --short` / `git diff -- content/` shows exactly the two files in §4's manifest, only the fields specified — no unrelated content change.

**Release recommendation**: `APPROVED` or `REFINEMENTS REQUIRED`, the identical binary format every prior implementation plan in this series has used.

---

## 22. Regression Risks

| # | Risk | Concrete check |
|---|---|---|
| 1 | Invalid frontmatter | `pnpm build` fails frontmatter parsing — WI-5 item 1 |
| 2 | Duplicate slug | Re-verified unique this turn (§2); WI-1 re-confirms at authoring time |
| 3 | Missing topic | Schema requires `topic` on `knowledgeFrontmatterSchema` — build fails without it; WI-5 item 1 |
| 4 | Incorrect topic (e.g. `backend` substituted) | WI-5 item 3, exact string match |
| 5 | Unsupported technical claims | §9's boundary table; WI-5 item 9 |
| 6 | Accidental invented project detail (metric, retry count, outage duration) | §9 Forbidden list; WI-5 item 9 |
| 7 | Incorrect tags (wrong value, extra value, missing value) | WI-5 item 4, exact array match |
| 8 | Unexpected Technology metadata | WI-5 item 5 |
| 9 | Accidental Series assignment | WI-5 item 6 |
| 10 | Accidental `featured: true` | WI-5 item 7 |
| 11 | Incorrect publication date (reused from another project, or fabricated) | §3's explicit prerequisite; WI-5 item 8 |
| 12 | Incorrect E4 → A3 relationship (wrong slug, wrong direction, missing) | §6, §19; WI-5 item 11 |
| 13 | Invalid reciprocal relationship (A3 → E4, or A3 → any Work document) | §6's structural-inertness finding; WI-5 item 14 |
| 14 | Broken Same-Topic fallback (fires for A3 instead of / in addition to `optimistic-vs-pessimistic-locking`, or doesn't fire at all) | §7's exact resolver trace; WI-5 items 12–13 |
| 15 | Duplicate Related Knowledge result (same document appearing twice in one group) | `resolveArticleReferences()`'s own `seen` Set, unmodified, already prevents this structurally; WI-5 item 11 |
| 16 | Search omission | §13; WI-5 item 18 |
| 17 | RSS omission | §14; WI-5 item 19 |
| 18 | Sitemap omission | §15; WI-5 item 20 |
| 19 | Knowledge index regression (existing articles' composition/order breaks unexpectedly) | §16; WI-5 items 15, 21 |
| 20 | Topic-page regression (`distributed-systems` mis-renders, or `optimistic-vs-pessimistic-locking` disappears) | §17; WI-5 item 16 |
| 21 | Existing article regression (any of the other three real Knowledge articles' own frontmatter or rendering changes) | WI-5 item 21 |
| 22 | E4 regression (any field beyond `relatedContent` changes) | WI-5 item 23 |
| 23 | Unrelated content changes (Work files, other Engineering Log entries, other Knowledge articles) | §4's exact two-file manifest; WI-5 item 29 |

---

## 23. Guardrails

The future implementation must **not** modify: `src/lib/content/schema.ts`, `src/lib/content/articles.ts`, `src/lib/content/relationships.ts`, `src/lib/content/engineering-logs.ts`, `src/lib/content/case-study-relationships.ts`, `src/lib/content/search.ts`, `src/lib/content/rss.ts`, `src/app/sitemap.ts`, any Knowledge route or component, `content/work/*.mdx` (except where §4's own narrower scope is explicitly revisited in a future, separately-approved pass), any unrelated Knowledge article, E3, any unrelated Engineering Log entry, or navigation.

**Re-confirmed this turn, not assumed**: every resolver named above already fully supports this plan's entire scope with zero modification (§6, §13–§17). **If any such change becomes necessary during authoring, the correct response is to stop and report an architectural gap — not to silently expand scope**, the identical discipline this doc series has held to in every prior implementation plan (`docs/52`, `docs/54`, `docs/56`, `docs/60`, `docs/64`).

---

## 24. Expected Future File Manifest

**New**: `content/knowledge/idempotency.mdx`

**Modified**: `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` — expected modification limited to E4's `relatedContent` field only (a new field addition, since the file currently has none at all — §19).

**No other production files.** The exact publication date remains the only unresolved authoring input (§3).

---

## 25. No Production Changes Now — Confirmed

This task created only `docs/68-KNOWLEDGE_IDEMPOTENCY_IMPLEMENTATION_PLAN.md`.

```
git status --short
```

Confirmed: no content changes, no `src/` changes, no route changes, no schema changes, no component changes — only `docs/65`, `docs/66`, `docs/67` (from prior tasks, untouched by this one) and `docs/68` (this document) appear as untracked; `git diff --stat -- content/ src/` shows zero lines.

---

## Final Report

1. **Implementation-plan status**: complete, design-only, no production change made.
2. **Approved editorial contract**: carried forward exactly from `docs/67` (§2) — title, description, slug, topic, tags, technologies (none), series (none), featured (not recommended), narrative structure, evidence boundary — no alternative metadata invented.
3. **Publication-date prerequisite**: explicit external authoring input, not resolved, not invented, not reused from any other document (§3).
4. **Exact future A3 metadata**: full frontmatter block specified, field order matching the schema's own declared order and `optimistic-vs-pessimistic-locking.mdx`'s own precedent (§8).
5. **Article authoring contract**: exact heading list, expected content per section, example/code-usage expectations, real-project-reference boundary — sufficient for an author to proceed without guessing (§8).
6. **Evidence boundary**: Direct evidence / Editorial synthesis / Requires confirmation / Forbidden, carried forward from `docs/67` §13 (§9).
7. **Relationship direction**: `E4 → idempotency` re-confirmed as the only resolver-supported direction; a reciprocal declaration re-confirmed structurally inert, not merely discouraged (§6).
8. **Same-Topic behavior**: resolver-traced precisely; the relationship is asymmetric — "Related Concepts" on A3's own side (authored), "More From This Topic" on `optimistic-vs-pessimistic-locking`'s side (fallback, zero edit to that file) — the first real multi-article topic in this repository's history (§7).
9. **Featured behavior**: A3 not recommended for featuring; existing featured pair unaffected; the one genuinely date-dependent outcome (which article occupies the fallback slot) stated honestly as undetermined until §3 resolves, not asserted with false confidence (§12).
10. **Search behavior**: automatic, zero code change, re-verified against the live `matchesQuery()` shape (§13).
11. **RSS behavior**: automatic, zero code change; exact chronological position explicitly deferred until the real date exists, per this task's own instruction not to invent expected chronology in advance (§14).
12. **Sitemap behavior**: automatic, zero code change; URL count will go from 24 to exactly 25 (§15).
13. **Knowledge index behavior**: automatic via unmodified `sortByPublishedDate()`/`getFeaturedArticles()`; no shared sorting primitive touched (§16).
14. **Topic-page behavior**: `distributed-systems` becomes this repository's first two-real-article topic; `optimistic-vs-pessimistic-locking` unaffected in its own frontmatter (§17).
15. **Future file manifest**: exactly two files — `content/knowledge/idempotency.mdx` (new), `content/engineering-log/cookeaze-webhook-reliability-gap.mdx` (modified, `relatedContent` only) — narrower than `docs/67`'s own four-file recommendation, with the discrepancy recorded and reasoned explicitly, not silently reconciled (§4, §19, §24).
16. **Work items**: WI-1 through WI-5, each with files, dependencies, and acceptance criteria stated (§20).
17. **Dependency order**: linear, WI-1 → WI-2 (a gate, not an implementation step) → WI-3 → WI-4 → WI-5 (§20).
18. **Regression risks**: 23 individually named risks, each with a concrete, numbered verification step (§22).
19. **Release Candidate Review**: 29 individually stated checks across Content, Relationships, Discovery, Existing behavior, Automated, and Git categories (§21).
20. **Guardrails**: every file this plan must not touch is named explicitly; re-confirmed this turn that no resolver requires an exception (§23).
21. **Git verification**: `git status --short` confirms only this document (and the prior turn's `docs/65`–`docs/67`) as new; `git diff --stat -- content/ src/` is empty (§25).
22. **Final recommendation**: see below.

**READY WITH USER INPUT — A3 implementation plan is complete, but publication date must be supplied before authoring.**
