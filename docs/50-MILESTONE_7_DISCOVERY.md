# 50 — Milestone 7 Discovery: Design Proposal

## Status

Proposal — awaiting review and approval.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, schema, or content was modified to produce it. Task 7.1's own authorization: design only.

Milestone 6 — Core Pages is complete and approved (Homepage, Knowledge, Work, Engineering Log, About, Search, 404, RSS, Sitemap — all nine `docs/12` deliverables shipped, the last three via `docs/44`/`docs/47`/`docs/49`). This document is the discovery-stage design proposal for the milestone that follows it.

---

## 1. Purpose

`docs/12-Implementation Roadmap.md` names Milestone 7 — Discovery next, with seven listed deliverables and one Definition of Done: *"Users can navigate naturally through connected knowledge."* This task's own authorization frames the distinction that must survive into this document unchanged:

> Milestone 6: *"Can a reader who already knows what they are looking for reach a real page?"*
> Milestone 7: *"Can a reader discover useful content they did not already know to look for?"*

That framing is not new — `docs/41-SEARCH_CORE_DISCOVERY.md` §4 already drew this exact line for Search specifically, during Milestone 6's own Task 6.4. This document's job is to extend that already-established boundary across the rest of Milestone 7's deliverables, grounded in what the repository actually contains today — not to re-litigate the Search boundary, and not to invent Discovery deliverables `docs/12` doesn't name.

---

## 2. Authoritative Documents — Read, With One Naming Discrepancy Noted

This task's authorization named six documents to read. Three resolved to different filenames than requested — confirmed by directory listing, not assumed:

| Requested | Actual file at that number | Resolution |
|---|---|---|
| `docs/24-ARCHITECTURE_PRINCIPLES.md` | `docs/24-ENGINEERING_PRINCIPLES.md` | Read the actual file — same milestone-numbered document, renamed at some point after this task's authorization was written. |
| `docs/41-SEARCH_EXPERIENCE.md` | `docs/41-SEARCH_CORE_DISCOVERY.md` | Read the actual file. |
| `docs/42-SEARCH_IMPLEMENTATION_PLAN.md` | `docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md` | Read the actual file. |

`docs/12-Implementation Roadmap.md`, `docs/03-SITEMAP.md`, and `docs/49-SITEMAP_IMPLEMENTATION_PLAN.md` matched exactly. All six were read in full, plus `docs/48-SITEMAP_EXPERIENCE.md` (referenced by `docs/49`) for additional context on what's actually shipped. Recorded here rather than silently substituted, per this task's own "document the overlap rather than silently choosing" instruction extended to a filename mismatch instead of a content one.

---

## 3. The Milestone 6 / Milestone 7 Boundary — Preserved, Not Reopened

`docs/41` §4 already resolved the one direct ambiguity in `docs/12` — "Search" is listed under both milestones:

```text
Milestone 6 — "fully navigable"          Milestone 7 — "navigate naturally
                                           through connected knowledge"
Can a reader who already knows          Can a reader who does NOT know
what they're looking for find it        what they're looking for be led
and reach it?                           to it?
A real /search route.                   Faceted filtering (tag,
Substring match, no ranking,            technology, topic). Series and
no facets, no index.                    Reading Paths. Related Content
                                         recommendations. Relevance
                                         ranking, indexing.
```

This document treats that resolution as settled fact, not a decision to remake. Task 6.4's `/search` (substring match, GET-based, Knowledge/Work/Engineering-Log only, no ranking, no facets — `docs/41`/`docs/42`, confirmed shipped, §5 below) is Milestone 6's complete discharge of the roadmap's first "Search" line item. Everything this document scopes is what's left: the second list, Milestone 7's own seven bullets, evaluated against what "navigate naturally through connected knowledge" requires that "fully navigable" didn't.

---

## 4. Roadmap Reconciliation — `docs/12`'s Milestone 7, Quoted Exactly

```text
Milestone 7 — Discovery

Objective
Help users discover knowledge.

Deliverables
* Search
* Filtering
* Tags
* Technologies
* Series
* Reading Paths
* Related Content

Definition of Done
Users can navigate naturally through connected knowledge.
```

Nothing invented beyond this list. "Search" is carried forward per §3 above — already discharged at Milestone 6's minimal scope; whatever remains under that name for Milestone 7 is addressed in §8.1, not assumed to mean "rebuild Search." The other six are each evaluated in §8 against the actual repository state established in §5–§7.

No other roadmap section names a Discovery deliverable `docs/12`'s Milestone 7 list doesn't already contain — `docs/03-SITEMAP.md`'s "Future Expansion" list (Now, Speaking, Resources, Open Source, Uses, Books, Newsletter, Labs, Security Research) is a different, page-level expansion list, not a Discovery-capability list, and none of its entries overlap with Filtering/Tags/Technologies/Series/Reading Paths/Related Content. No overlap to document there.

---

## 5. Current Content Model — Re-Inspected Against the Live Repository

Verified by direct read of `src/lib/content/`, `src/lib/constants/`, `content/`, `src/app/`, `src/components/` — not carried forward from any prior document's description of these files.

### 5.1 Collections registered vs. collections with real content

`src/lib/content/collections.ts`'s `COLLECTIONS` registry has five entries — confirmed unchanged since `docs/41`'s own reconnaissance:

| Collection | Schema | `content/` state |
|---|---|---|
| `knowledge` | `knowledgeFrontmatterSchema` | **4 real MDX files**: `data-transfer-objects.mdx`, `how-jwt-works.mdx`, `money-floating-point.mdx`, `optimistic-vs-pessimistic-locking.mdx` |
| `work` | `workFrontmatterSchema` | **4 real MDX files**: `cookeaze.mdx`, `gohunt.mdx`, `haya.mdx`, `vaultpay.mdx` |
| `engineering-log` | `articleFrontmatterSchema` | Empty (`.gitkeep` only) |
| `series` | `seriesFrontmatterSchema` | Empty (`.gitkeep` only) |
| `technologies` | `technologyFrontmatterSchema` | Empty (`.gitkeep` only) |

`content/pages/` also exists (`.gitkeep` only) — not a registered collection, not relevant to Discovery.

### 5.2 Frontmatter fields already available for Discovery-shaped use

`articleFrontmatterSchema` (`schema.ts`, shared by all three populated-or-populatable article collections) already carries, and real content already authors:

- **`tags: string[]`** — free-form, author-chosen, multi-valued. Every one of the 8 real Knowledge/Work documents sets it (e.g. `haya.mdx`: `["backend", "ai", "concurrency", "payments", "platform"]`).
- **`technologies: string[]`** — free-form strings, e.g. `vaultpay.mdx`: `["Go", "Fiber", "PostgreSQL", "Redis"]`. Not validated against, or linked to, the `technologies/` collection in any way — confirmed by direct read of every resolver that touches `technologies`: none of them cross-reference `content/technologies/`.
- **`series: string | undefined`, `seriesOrder: number | undefined`** — optional, authored. **Zero of the 8 real documents set either field.** No real series membership exists in content today, only in schema and resolver logic (§5.3).
- **`prerequisites: string[]`, `relatedContent: string[]`** — authored slug references, resolved by `relationships.ts`/`case-study-relationships.ts` (§5.3). **One real cross-collection link exists in the entire content set**: `haya.mdx`'s `relatedContent: ["how-jwt-works"]`. Every other document's `relatedContent`/`prerequisites`/`engineeringLog` array is empty.
- **`topic`** (Knowledge only, required) — a controlled vocabulary of exactly 8 values (`TOPIC_SLUGS`, `lib/content/topics.ts`): `backend`, `system-design`, `security`, `cloud`, `distributed-systems`, `architecture`, `performance`, `testing`. Every real Knowledge article sets a valid one.

### 5.3 Relationship infrastructure already built (Milestones 4–6)

Extensive, and directly relevant to "Related Content" and "Reading Paths" — re-confirmed by direct read of `relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`:

- **Prerequisites, Related Concepts, Continue Learning, Same-Topic fallback** — `resolveRelatedLearning()`, composing all four for a Knowledge article (`relationships.ts`).
- **Previous/Next** — series-order first, then topic-order, for Knowledge (`resolvePreviousNext()`); domain-order first, then collection-order, for Work (`resolvePreviousNextCaseStudy()`); pure chronological for Engineering Log (`resolvePreviousNextLog()`).
- **Related Knowledge from a Case Study**, **Related Engineering Logs from a Case Study**, and its reverse, **Related Work from a Log entry** (`case-study-relationships.ts`, `engineering-logs.ts`).
- All of it **authored-metadata-driven** — every resolver reads an explicit frontmatter array (`relatedContent`, `engineeringLog`, `prerequisites`) or an explicit scalar (`topic`, `domain`, `series`/`seriesOrder`) and does direct-equality or slug lookup. **None of it is similarity-scored, ranked, or inferred.** This is not an implementation gap; it is `docs/24-ENGINEERING_PRINCIPLES.md` Principle 8 (*"prefer authored relationships over inferred recommendations... Knowledge should remain predictable, explainable, and maintainable"*) applied consistently, confirmed at every call site inspected. Any Milestone 7 "Related Content" design that reaches for similarity scoring, tag-overlap heuristics, or embeddings would be introducing a new engineering posture this codebase has specifically avoided everywhere else — a decision `docs/41` §7 already flags as out of Milestone 6 scope and this document flags as needing to be made explicitly, not by default, if Milestone 7 chooses it (§8.7).

### 5.4 The load-bearing finding: most browse surfaces are still placeholder-fixture-driven

This is the single fact every other finding in this document depends on, confirmed by direct import-tracing of every listing/browse page, not inferred from any prior document's description:

| Route | Data source | Real or fixture? |
|---|---|---|
| `/` (Homepage) — featured Knowledge, Engineering Log | `getFeaturedArticles()`, `getAllEngineeringLogEntries()` | **Real** (`content/knowledge/`, `content/engineering-log/`) |
| `/` (Homepage) — featured Case Studies | `getFeaturedCaseStudies()` from `lib/content/work.ts` | **Fixture** (`PLACEHOLDER_WORK`) |
| `/knowledge` (landing) | `PLACEHOLDER_START_HERE`, `PLACEHOLDER_TOPICS`, `PLACEHOLDER_SERIES`, `PLACEHOLDER_RECENTLY_PUBLISHED` | **Fixture**, entirely |
| `/knowledge/{topic}` (8 topic pages) | `PLACEHOLDER_TOPICS`, `PLACEHOLDER_TOPIC_ARTICLES[slug]`, `PLACEHOLDER_SERIES` | **Fixture**, entirely |
| `/knowledge/{article}` (4 real articles) | `getArticleBySlug()` | **Real** |
| `/work` (landing) | `getFeaturedCaseStudies()`, `getProjectLibrary()` (`work.ts`) | **Fixture** (`PLACEHOLDER_WORK`) |
| `/work/library` | `getCaseStudyLibrary()` (`work.ts` → `PLACEHOLDER_WORK`) | **Fixture** |
| `/work/{case-study}` (4 real case studies) | `getCaseStudyBySlug()` (`case-studies.ts`) | **Real** |
| `/engineering-log` | `getAllEngineeringLogEntries()` | Real (0 items — valid empty state) |
| `/search` | `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` | **Real**, all three (`docs/42`'s own corrected resolver choice) |
| `/sitemap.xml`, `/rss.xml` | Same three real `getAll*()` resolvers | **Real** |

`lib/content/work.ts`'s own docstring already names this split explicitly and honestly (*"Two different data maturities today... a fixture array describing three example projects, and a real MDX collection"*) — this is not a bug this document is discovering, it's a documented, intentional Milestone 5 decision that Milestone 6 (Search, Sitemap, RSS) has already worked around by reading `case-studies.ts` instead, per `docs/42` §3's own corrected finding. **What's newly relevant here**: Milestone 7's Filtering/Tags/Series deliverables would need to operate on `/knowledge`, `/knowledge/{topic}`, `/work`, and `/work/library` — precisely the four surfaces still reading fixtures, not the real 8-document corpus. A tag filter built against `PLACEHOLDER_TOPIC_ARTICLES` would filter fixture data a reader can't actually reach any other way; a tag filter built against the real collections would need those four pages migrated first. This dependency is not stated in `docs/12`, `docs/41`, or `docs/49` — it is a finding of this re-inspection, not a restatement of prior documentation.

### 5.5 Tags are explicitly documented as non-filterable today

`components/engineering-log/log-entry-header.tsx`'s own docstring, confirmed by direct read:

> *"`tags` render as a quiet, low-weight line — free-form and multi-valued..., never a controlled facet the way Work's `domain` or Knowledge's `topic` are, so they're presented as plain text, not a filterable badge row."*

This is the codebase's own, already-stated position on tags as of Milestone 6 — carried forward here as fact, not reopened. A Milestone 7 "Tags" deliverable that makes tags filterable is a deliberate reversal of this stated design position, not an extension of it — worth naming explicitly (§8.3) rather than treated as a small, obvious addition.

### 5.6 `/series/[slug]` — referenced, never built, and not in the IA's own authoritative URL list

`lib/constants/placeholder-series.ts`'s own docstring states its `href` values (`/series/authentication-fundamentals`, etc.) follow `docs/10-Technical Architecture.md`'s predicted `/series/[slug]` route shape. Confirmed by direct inspection:

- No `src/app/series/` directory exists.
- `docs/03-SITEMAP.md` — the authoritative Information Architecture document per this task's own reading list — does **not** list `/series/*` anywhere in its "URL Structure" section (§ compare against the six knowledge-category paths, five work paths, and `/engineering-log`/`/about` it does list), and does not list Series in its "Future Expansion" list either.
- `docs/49`'s own re-confirmed route tree (§3 of that document) explicitly notes "No `app/series/`... confirmed absent."

This is a real, unresolved discrepancy between `docs/10` (predicts the route), `PLACEHOLDER_SERIES` (already hard-codes hrefs assuming it), and `docs/03` (the IA authority this task was told to read, which is silent on it). Not resolved here — flagged as Open Question 1 (§9).

### 5.7 `technologies/` collection vs. `technologies` frontmatter vs. About's "Tools" section — three unconnected things sharing a name

Confirmed by direct inspection, three genuinely separate concepts exist today with no cross-reference between any pair:

1. **`content/technologies/` + `technologyFrontmatterSchema`** (`name`, `description`, `category`, `officialWebsite`, `logo`, `color`) — a registered collection, empty, routeless, no resolver reads it anywhere in the codebase.
2. **`technologies: string[]`** on Knowledge/Work frontmatter — free-form strings (`"Go"`, `"PostgreSQL"`, `"Redis"`...), rendered today only as a plain supporting-metadata line on a Case Study's `ProjectHeader` and (per `docs/49`) not resolved against anything.
3. **About's `Tools` component** (`components/about/tools.tsx`) — fully static, hand-authored copy (`TOOLS_COPY.items`, a `join(" · ")`'d plain-text line), confirmed to import nothing from either of the above. `docs/01-PERSONAL_BRAND.md`'s "Never rate technologies with percentages" / "never a badge wall" constraint is the reason this stays plain text — a real, load-bearing design constraint Milestone 7 must respect if it builds anything resembling a technology index (§8.4).

A Milestone 7 "Technologies" deliverable has at least three plausible referents here, and `docs/12` doesn't disambiguate which. Flagged as Open Question 2 (§9).

### 5.8 Topic vocabulary — a known, already-resolved divergence from `docs/03`

`TOPIC_SLUGS` (8: backend, system-design, security, cloud, distributed-systems, architecture, performance, testing) does not match `docs/03-SITEMAP.md`'s own Knowledge "Categories" list (Backend, Security, Go, Node.js, System Design, Architecture, Career, Teaching). `placeholder-topics.ts`'s own docstring already documents this as an intentional Task 4.1 decision to follow `docs/15-KNOWLEDGE_EXPERIENCE.md`'s topic list instead of `docs/03`'s older "technology-mixed category list." **Not a new discrepancy this document is surfacing** — restated here only because Milestone 7's "Technologies" deliverable makes the distinction newly relevant: `docs/03`'s list mixes true topics (Backend, Security, Architecture) with what are really technologies (Go, Node.js) and non-technical categories (Career, Teaching) in one list, which is exactly the kind of conflation `topic` (controlled, one-per-article) vs. `technologies` (free-form, multi-valued) already separates in the real schema. Any Milestone 7 proposal reusing `docs/03`'s literal category list for anything would be reintroducing a conflation the content model has already moved past.

---

## 6. "Reading Paths" — No Infrastructure, No Prior Definition Anywhere

Confirmed by grep across every document read for this task and every prior implementation/design doc in `docs/`: **"Reading Paths" appears in exactly one place in the entire documentation set — `docs/12`'s Milestone 7 deliverable list.** No schema field, no resolver, no component, no other document defines what distinguishes a Reading Path from:

- A **Series** (already schema-modeled: `series`/`seriesOrder`, sequential, single-topic-ish grouping via `LearningSeriesEntry.topics`).
- **Continue Learning** (already built: `resolveContinueLearning()`, one-step-ahead series navigation).
- **Prerequisites** (already built: "read this before that").

The three most plausible interpretations — (a) a synonym for Series, (b) a cross-collection sequence (e.g., "read these 2 Knowledge articles, then this Case Study, in order" — something no current relationship type expresses, since every existing resolver is scoped within one collection except the Case-Study↔Engineering-Log link), or (c) an editorially curated multi-article guide independent of both `topic` and `series` — are structurally different features with different schema needs. This document does not choose among them; it names the ambiguity as Open Question 3 (§9), because `docs/12`'s one-line mention is the only evidence available and isn't enough to scope from responsibly.

---

## 7. Discrepancies Found — Consolidated

Per this task's own "document the overlap rather than silently choosing an interpretation" instruction:

1. **Filename mismatch** for three of the six requested reading-list documents (§2) — resolved by reading the same-numbered actual files.
2. **"Search" listed under both Milestone 6 and Milestone 7** in `docs/12` — not new; already resolved by `docs/41` §4, carried forward (§3).
3. **`/series/[slug]` predicted by `docs/10` and hard-coded into `PLACEHOLDER_SERIES`'s own `href`s, but absent from `docs/03`'s authoritative URL Structure** and absent from the real route tree (§5.6) — unresolved, Open Question 1.
4. **"Technologies" has three unconnected referents** in the current repository — an empty routeless collection, a free-form frontmatter field, and unrelated static About copy (§5.7) — unresolved, Open Question 2.
5. **"Reading Paths" has zero prior definition** anywhere in the documentation set outside `docs/12`'s own one-line mention (§6) — unresolved, Open Question 3.
6. **Tags are explicitly documented (Milestone 6) as non-filterable, presentation-only text** — a Milestone 7 "Tags" deliverable that filters by tag is a reversal of a stated design position, not a natural extension of it (§5.5) — flagged, not resolved, since resolving it is an implementation-plan-stage decision, not this document's to make unilaterally.
7. **The load-bearing finding (§5.4)**: `/knowledge`, `/knowledge/{topic}`, `/work`, and `/work/library` — four of the surfaces Milestone 7's Filtering/Tags/Series deliverables would most naturally extend — are still entirely placeholder-fixture-driven, not connected to the real 8-document content corpus. This dependency is not named in any prior roadmap or milestone document; it is this re-inspection's own finding, and it is the most consequential fact in this document for how Milestone 7 should be sequenced (§10).
8. **`docs/03`'s own Knowledge "Categories" list conflates topic, technology, and non-technical career categories** in one list, already superseded in practice by the real `TOPIC_SLUGS`/`technologies` field split (§5.8) — a known, already-resolved divergence, restated only because it bears on how "Technologies" should be scoped, not a new problem.

No other discrepancy found between what this task's authorization expected and what re-inspection confirms.

---

## 8. Per-Deliverable Analysis

Each of `docs/12`'s seven Milestone 7 bullets, evaluated against §5–§7's findings. This section identifies what each deliverable would concretely require and what's ambiguous about it — it does not commit to a final scope, since several items (§8.3, §8.4, §8.5, §8.6) have open questions (§9) an implementation plan can't responsibly proceed past without an answer.

### 8.1 Search

Already discharged at Milestone 6's deliberately minimal scope (§3). What legitimately remains under this name for Milestone 7, per `docs/41` §7's own explicit deferred list (not reopened, just restated as still-deferred and still real): faceted filtering integrated into `/search` itself, relevance ranking, a search index, live/as-you-type search, a command palette. None of these are separable from Filtering (§8.2) and Tags (§8.3) below — Search's own future enhancement is downstream of those two being scoped first, not an independent work item.

### 8.2 Filtering

No faceted filtering UI exists anywhere in the codebase today — confirmed, nothing beyond `/search`'s own single free-text query field. Filtering's natural facets, given the real schema, are `topic` (Knowledge only, controlled, 8 values), `tags` (free-form, all three collections), `technologies` (free-form, all three collections), and `domain`/`status` (Work only, controlled). **Filtering has no real corpus to operate against on the four placeholder-driven surfaces (§5.4/§7.7)** — this is the deliverable most directly blocked by that finding. A filter built today would either filter fixture data (misleading — a reader filtering by "backend" on the fixture-driven `/knowledge` page wouldn't see the real `money-floating-point.mdx`, which is also `topic: backend`) or would need those pages migrated to real data first.

### 8.3 Tags

Exist, are authored, are free-form — but are explicitly documented as presentation-only (§5.5). Turning them into a discovery mechanism requires deciding: stay free-form (a "tag cloud" with no per-tag page, or a filter with no controlled vocabulary — noisy, since nothing stops two authors from writing `"api-design"` and `"API Design"` as different tags) vs. introduce a controlled or semi-controlled vocabulary (more predictable, but a schema change and a real editorial decision, the kind `docs/24` Principle 1 says should be documented before code). Neither option is free — this is Open Question 4 (§9), not decided here.

### 8.4 Technologies

Three unconnected referents today (§5.7). The most architecturally coherent option — activating the already-registered, already-schema'd `technologies/` collection, giving it real entries and a real route — is also the option `docs/41` §11 explicitly named as out of Milestone 6 scope specifically *because* it was empty and routeless, deferring it to whichever milestone actually builds it out. That milestone is plausibly this one, but which of the three referents (§5.7) "Technologies" means changes the shape of the work substantially — Open Question 2 (§9).

### 8.5 Series

Schema and resolver infrastructure already exist (`series`/`seriesOrder`, `findSeriesNeighbor()`, Continue Learning, series-tier Previous/Next) — this is the most-ready deliverable of the six. What's missing: real content (zero of 8 real documents use it), and a routing decision for `/series/[slug]` that `docs/03` doesn't currently authorize (§5.6, Open Question 1). The `LearningSeries` component and its `PLACEHOLDER_SERIES` data already exist and already render on the (currently fixture-driven) `/knowledge` and `/knowledge/{topic}` pages — so Series is also downstream of §5.4's migration finding, same as Filtering.

### 8.6 Reading Paths

No infrastructure, no prior definition (§6) — the least-specified deliverable. Cannot be scoped further without first answering what distinguishes it from Series/Continue Learning/Prerequisites — Open Question 3 (§9).

### 8.7 Related Content

`docs/41` §7 already explicitly reserves this deliverable's real meaning: *"A Related Content recommendation engine (distinct from the per-document relationship resolvers... those stay exactly as they are)."* Confirmed by §5.3's re-inspection: the per-document resolvers are real, working, and authored-metadata-driven, and should not be rebuilt. What Milestone 7's "Related Content" adds on top, if anything, is a **cross-collection** recommendation surface — today, only one real cross-collection link exists in actual content (`haya.mdx`'s `relatedContent: ["how-jwt-works"]`), and `docs/24` Principle 8 constrains *how* any new recommendation logic can work: authored, explicit, predictable — not inferred, scored, or embedding-based, unless a future proposal explicitly revisits that principle (a decision bigger than this task, not proposed here). Given the current corpus is 8 documents with one authored cross-link, "Related Content" may be more honestly scoped as *encouraging/surfacing more authored cross-collection links* (an editorial task) than as new resolution code — worth stating plainly rather than defaulting to "build a recommendation engine" because the word "engine" appears in `docs/41`'s own phrasing.

---

## 9. Open Questions — Blocking a Responsible Implementation Plan

Per this task's own instruction to document ambiguity rather than silently resolve it, and following the exact precedent `docs/41` §24 set for Task 6.4:

**Q1 — Does Series get a standalone `/series/[slug]` route, amending `docs/03`'s IA, or does Series stay embedded only within Knowledge/topic pages (no dedicated URL), with `PLACEHOLDER_SERIES`'s existing `href`s corrected rather than fulfilled?**
*Why it matters:* determines whether Milestone 7 includes an IA amendment to `docs/03` or not — a decision `docs/24` Principle 1 says should be documented before implementation. *Evidence needed:* an explicit IA decision, the same weight `docs/03`'s own "three levels deep" / "predictable URLs" principles were applied with originally.

**Q2 — Which of "Technologies"'s three unconnected referents (§5.7) does `docs/12` mean: the empty `technologies/` collection getting real content + a route, the free-form `technologies` frontmatter field becoming a filter facet, or both?**
*Why it matters:* the collection-route option is a content-and-routing task; the filter-facet option is a filtering/data-modeling task; they're not the same size or shape of work. *Evidence needed:* an explicit scope decision, informed by whether cross-referencing free-form `technologies` strings against real `technologies/` entries (so e.g. every case study mentioning `"Go"` could link to one real `/technologies/go` page) is itself intended — which would mean building the connective resolver that doesn't exist today between these two data sources.

**Q3 — What is a "Reading Path," concretely, and how does it differ from Series/Continue Learning/Prerequisites?**
*Why it matters:* nothing can be scoped, schema'd, or estimated until this is answered (§6). *Evidence needed:* a concrete definition — ideally with a worked example (which two or three real documents would form one) — before any schema or resolver design is attempted.

**Q4 — Do Tags become a controlled vocabulary (validated, deduplicated, one canonical spelling) or stay free-form with filtering built directly against author-chosen strings?**
*Why it matters:* reverses §5.5's stated Milestone 6 design position either way; the controlled-vocabulary path is a schema change (`docs/24` Principle 1: document before implementing), the free-form path risks the noisy-duplicate problem named in §8.3. *Evidence needed:* an explicit editorial decision — the same kind `docs/49` §6 made explicitly for the sitemap's `lastModified` policy rather than leaving it to be discovered during implementation.

**Q5 — Should the placeholder-to-real migration for `/knowledge`, `/knowledge/{topic}`, `/work`, and `/work/library` (§5.4) be scoped as part of Milestone 7, or as a preliminary task before it?**
*Why it matters:* this document's own finding (§5.4/§7.7) is that Filtering, Tags, and Series all depend on it — building any of the three against fixture data would be building a discovery feature over content a reader can't otherwise reach, which contradicts Milestone 7's own Definition of Done ("navigate naturally through connected knowledge" — connected to what, if the browse surfaces still show curated examples instead of the real, published 8-document corpus?). *Evidence needed:* a sequencing decision — §10 below recommends one, but the recommendation isn't binding without approval.

---

## 10. Recommended Sequencing (Not a Commitment — A Starting Proposal for Review)

Offered as this document's own synthesis of §5–§9, in the same spirit `docs/41` §25 offered a "Recommended architecture" while still leaving implementation to a separate, later-approved plan:

1. **A foundational task, before any Milestone 7 discovery feature is designed further**: migrate `/knowledge`, `/knowledge/{topic}`, `/work`, and `/work/library` off `PLACEHOLDER_*` fixtures onto the real `getAllArticles()`/`getAllCaseStudies()` collections — the same resolver-correction `docs/42` §3 already made for Search specifically, generalized to the remaining placeholder-driven surfaces. This is arguably closer to a Milestone 6 loose end than new Milestone 7 scope, but nothing in Milestone 7's own deliverable list can be honestly built without it (§5.4/§7.7/Q5) — recorded as a recommendation for the approving reviewer to weigh, not decided here.
2. **Series** (§8.5) is the most schema-ready deliverable — real content plus Q1's IA decision, once made, likely the smallest concrete task.
3. **Tags and Technologies** (§8.3/§8.4) each need their own open question (Q4/Q2) answered before scoping — likely two separate design proposals, since they resolve differently-shaped problems (vocabulary control vs. a second content collection).
4. **Filtering** (§8.2) is downstream of #1 and of Tags/Technologies/Topic being stable facets — scope last among the four data-shaped deliverables.
5. **Related Content** (§8.7) is the smallest actual code surface (per §5.3, most of it already exists) but may be more of an editorial task (author more `relatedContent`/`engineeringLog` cross-links in real frontmatter) than a new resolver — worth confirming this reading before assuming new code is needed at all.
6. **Reading Paths** (§8.6) cannot be sequenced at all until Q3 gives it a concrete definition — recommended as the last deliverable to scope, not the first, despite being listed after Series in `docs/12`'s own order.

---

## 11. Explicit Non-Goals of This Document

- Does not create, modify, or propose exact schema fields, routes, or components — that is implementation-plan-stage work, following the same `docs/41` → `docs/42` two-stage precedent this document itself follows for its own first stage.
- Does not resolve Q1–Q5 — each requires an explicit decision this document surfaces but does not have the authority or the evidence to make unilaterally.
- Does not reopen Milestone 6's Search boundary (§3) or its "Search" scope (`docs/41`/`docs/42`, shipped and approved).
- Does not propose a similarity-scored, ranked, or inferred recommendation system for "Related Content" — `docs/24` Principle 8 stays governing unless a future document explicitly revisits it (§8.7).
- Does not treat `docs/12`'s Milestone 7 list as exhaustive of what "Discovery" could ever mean, nor as a license to add anything beyond its seven named bullets — no deliverable is proposed here that `docs/12` doesn't already name.

---

## 12. Acceptance Criteria (Document-Level)

- The Milestone 6 / Milestone 7 distinction from this task's own authorization is preserved and applied, not diluted into "add more search features" (§3).
- Every Milestone 7 deliverable `docs/12` names is addressed individually, with what exists today and what's genuinely missing or ambiguous about it (§8), not silently assumed.
- Every discrepancy found (filenames, `/series` routing, Technologies' three referents, Reading Paths' absence, Tags' stated non-filterable design, the placeholder/real content split) is documented explicitly rather than silently resolved (§7).
- The content model re-inspection (§5) is grounded in direct reads of the actual current repository, not carried forward from any prior document's description of it.
- No production code, component, route, schema, or content was modified to produce this document.

---

## Summary

Milestone 6's "fully navigable" bar is met — every real page is reachable. Milestone 7's "navigate naturally through connected knowledge" bar is a materially different, larger question, and this re-inspection's central finding is that it's currently blocked less by missing *code* than by missing *connections*: four of the site's own browse surfaces (`/knowledge`, `/knowledge/{topic}`, `/work`, `/work/library`) still render curated placeholder fixtures instead of the real, published 8-document corpus, and three of the seven Milestone 7 deliverables (Filtering, Tags, Series) would be building discovery features over content readers can't otherwise reach until that's fixed. Two deliverables (Technologies, Reading Paths) don't yet have a single, well-defined referent in this repository's own documentation or code — each needs an explicit decision (Q2, Q3) before it can be scoped at all. One deliverable (Related Content) may already be substantially built, if "Related Content" is read as the per-document resolvers `docs/41` §7 already distinguishes it from, plus more authored cross-links rather than new inference code — consistent with `docs/24` Principle 8's standing constraint against inferred recommendations. This document resolves none of the five open questions it raises; it exists so the next stage — a design proposal scoped to whichever of Series/Tags/Technologies/Filtering/Related-Content/Reading-Paths is taken up first, following the same `docs/41`-then-`docs/42` two-stage precedent — starts from verified fact rather than from `docs/12`'s seven-word deliverable list alone.
