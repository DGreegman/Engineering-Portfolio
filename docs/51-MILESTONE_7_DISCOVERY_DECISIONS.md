# 51 — Milestone 7 Discovery: Architecture Resolution

## Status

Decision Record — resolving the five open questions `docs/50-MILESTONE_7_DISCOVERY.md` raised, before any Milestone 7 implementation plan is authorized.

> This document authorizes no implementation. No production source file, route, schema, component, or content was modified to produce it. Milestone 6 is not reopened or modified by anything recorded here.

---

## 1. Purpose

`docs/50` completed Milestone 7's discovery-stage reconnaissance and surfaced five questions it explicitly declined to resolve unilaterally: Series routing, Technologies' definition, Reading Paths' definition, the Tag vocabulary model, and placeholder-migration ownership. This document resolves each one explicitly, grounded in the material this task's authorization names (`docs/50`, `docs/12`, `docs/03`, `docs/10`, `docs/24-ENGINEERING_PRINCIPLES.md` — the same filename resolution `docs/50` §2 already recorded, unchanged here) plus direct re-inspection of the live repository where the named documents leave a question open. Where the evidence is genuinely insufficient, this document says so explicitly rather than inventing a model — the No Invention Rule (§15 of this task's own authorization) is treated as binding throughout, most consequentially for Reading Paths (§5).

---

## 2. Current Discovery State — Recap, Re-Verified

Re-confirmed against the live repository this turn (not carried forward from `docs/50` without re-checking):

- **Real content**: 4 Knowledge articles, 4 Work case studies, 0 Engineering Log entries. `content/series/` and `content/technologies/` remain empty (`.gitkeep` only).
- **Real-content-backed surfaces**: `/knowledge/{article}`, `/work/{case-study}`, `/engineering-log`, `/search`, `/sitemap.xml`, `/rss.xml`, and the Homepage's featured-Knowledge and Engineering-Log sections.
- **Fixture-backed surfaces, unchanged since `docs/50`**: `/knowledge` (landing), `/knowledge/{topic}` (all 8), `/work` (landing), `/work/library`, and the Homepage's featured-Case-Studies section (`getFeaturedCaseStudies()` from `lib/content/work.ts`, which reads `PLACEHOLDER_WORK` — re-confirmed by direct read this turn, not merely restated).
- **Tags**: confirmed this turn, for both Knowledge (`DocumentHeader`) and Engineering Log (`LogEntryHeader`), rendered identically as a plain, non-linking, comma-joined text line — `tags.length > 0 && entries.push({ key: "tags", content: tags.join(", ") })` (`document-header.tsx`). **New finding this turn**: Work's `ProjectHeader` never renders `tags` at all — grep across `app/work/` and `components/work/` for `frontmatter.tags`/`.tags` returns nothing. Work case studies author `tags` (all 4 real ones do) but the field is currently inert everywhere in the UI.
- **No controlled tag vocabulary exists anywhere** — confirmed by repository-wide grep for `TAG_SLUGS`/`TagSlug`, zero matches, unlike `TOPIC_SLUGS`/`TopicSlug` which is real and enforced.
- **No component named `RelatedContent` exists** — confirmed by grep; the relevant infrastructure is `RelatedLearning` (Knowledge), and case-study/engineering-log-specific resolvers in `case-study-relationships.ts`/`engineering-logs.ts` (§9).

---

## 3. Decision 1 — Series

**DECISION**

Approve Series as a real Milestone 7 content concept. **Do not build `/series/[slug]` as part of Milestone 7's initial scope.** Series should render as an in-page section within `/knowledge` and `/knowledge/{topic}` (once real-content-migrated, Decision 5) using the schema and resolver seam that already exists — real series membership authored in Knowledge frontmatter, surfaced by the existing `LearningSeries` component. A standalone `/series/[slug]` route is deferred pending an explicit amendment to `docs/03-SITEMAP.md`'s URL Structure, not assumed as part of "Series."

**EVIDENCE**

- `schema.ts`: `series: z.string().optional()`, `seriesOrder: z.number().int().optional()` already exist on `articleFrontmatterSchema`, real, live, currently unused by any of the 8 real documents.
- `relationships.ts`: `findSeriesNeighbor()`, `resolveContinueLearning()`, and the series-tier of `resolvePreviousNext()` already honor `series`/`seriesOrder` — real, working, tested-by-construction resolver logic with no route dependency.
- `docs/03-SITEMAP.md`'s "URL Structure" section — the IA document this task's own reading list names as authoritative — enumerates six Knowledge paths, five Work paths, `/engineering-log`, `/about`. **`/series/*` does not appear anywhere in it**, confirmed by direct re-read this turn. `docs/03`'s "Future Expansion" list (Now, Speaking, Resources, Open Source, Uses, Books, Newsletter, Labs, Security Research) doesn't name it either.
- `docs/10-Technical Architecture.md`'s "Routing" section lists `/series/system-design` as one of eight illustrative routing *examples* (`/`, `/knowledge`, `/knowledge/api-idempotency`, `/work/vaultpay`, `/engineering-log/...`, `/series/system-design`, `/about`, `/rss.xml`, `/sitemap.xml`) — an architecture-pattern illustration, not an enumerated, authoritative URL Structure the way `docs/03`'s own section is. Where the two disagree in weight of authority, `docs/03` — the document whose entire purpose is defining "the complete information architecture of the portfolio" — governs.
- `lib/constants/placeholder-series.ts`'s own docstring already concedes its `href` values (`/series/authentication-fundamentals`, etc.) are a prediction following `docs/10`'s illustrative example, not a route that resolves — confirmed still true (`docs/49` §3: "No `app/series/`... confirmed absent," re-confirmed again this turn).
- `docs/12`'s Milestone 7 line item is the single word "Series" — no route commitment either way.

**RATIONALE**

`docs/24-ENGINEERING_PRINCIPLES.md` Principle 1 ("Documentation Before Implementation... every significant feature should begin with documentation") and `docs/03`'s own "if a page does not contribute to the visitor's understanding of the engineer, it should not exist" both require a new top-level content-detail route to be explicitly authorized in the IA document before it's built — not inferred from an illustrative routing example in a different document, and not inherited from a placeholder fixture's own aspirational `href`. Meanwhile, Series as a *sequencing concept* — ordering, membership, Continue Learning/Previous-Next honoring that order — already has real, working infrastructure that needs authored content, not a new route, to start delivering value. Building the in-page section first, and treating the standalone route as a separate, explicitly-authorized IA decision, is the smaller and better-evidenced increment.

**CONSEQUENCES**

Milestone 7's Series work is content-authoring (add `series`/`seriesOrder` to real Knowledge frontmatter) plus a small, already-anticipated wiring change (feed real data into `LearningSeries` instead of `PLACEHOLDER_SERIES`, on the real-content-migrated `/knowledge`/`/knowledge/{topic}` pages, Decision 5). `PLACEHOLDER_SERIES`'s `href`s should not be carried forward unchanged into that wiring — each `SeriesRow` should link to the series' first real article, or render non-linking, until/unless a `/series/[slug]` route is separately authorized. No schema change is required by this decision (the fields already exist); no route is authorized by this decision.

---

## 4. Decision 2 — Technologies

**Three referents, identified precisely (re-confirmed by direct re-inspection this turn, not restated from `docs/50` unchecked):**

| # | Referent | Where | What it is | Content status | Rendered? | Route? |
|---|---|---|---|---|---|---|
| 1 | `content/technologies/` collection | `collections.ts` registration + `technologyFrontmatterSchema` (`name`, `description`, `category`, `officialWebsite`, `logo`, `color`) | A real, structured, potentially-routable content type | **Zero entries** (`.gitkeep` only) | No — no resolver anywhere reads this collection | No route exists |
| 2 | `technologies: string[]` frontmatter field | `articleFrontmatterSchema`, inherited by Knowledge and Work | Free-form author-chosen strings, e.g. `["Go", "Fiber", "PostgreSQL", "Redis"]` | **Real, authored data** — all 4 real case studies set it; none of the 4 real Knowledge articles do | Work only: `ProjectHeader`, plain non-linking text (`technologies.join(" · ")`). Knowledge: authored in schema, never rendered anywhere (confirmed this turn — `DocumentHeader`'s prop interface has no `technologies` field) | No |
| 3 | About's `Tools` section | `components/about/tools.tsx` + `TOOLS_COPY` | Fully static, hand-authored prose (`TOOLS_COPY.items.join(" · ")`) | Real, but editorial copy, not content-model data | Yes, on `/about` | N/A — not a collection at all |

Confirmed this turn: `tools.tsx` imports nothing from either #1 or #2 — the three are entirely disconnected, sharing only a name.

**DECISION**

The smallest trustworthy Technology model for Milestone 7 is: **treat `technologies` (referent #2) as a filter/browse facet over the free-form frontmatter field already authored and already partially rendered** — not activation of the empty `content/technologies/` collection (#1) into a full per-technology reference type with its own pages. About's `Tools` section (#3) is out of scope entirely; it's editorial prose, not content-model data, and `docs/01-PERSONAL_BRAND.md`'s "never a badge wall / never rate technologies" constraint governs it independently of anything Discovery does.

Referent #1 (the empty collection) is **explicitly deferred**, not rejected — recorded in §12.

**EVIDENCE**

- Only referent #2 has real, non-empty authored data today (all 4 real case studies).
- Only referent #2 is even partially surfaced in the UI already (Work's `ProjectHeader`).
- Activating referent #1 would mean authoring new content (5–15+ technology entries, matching what's actually referenced across the real 8 documents) that this task is not authorized to create (`content migration` is explicitly out of scope for this document), and — per the Real Data Principle (this task's own §8) — a second, hand-maintained technology list that must be kept in sync with the free-form strings already authored in Work/Knowledge frontmatter is exactly the kind of parallel data source that principle rules out, unless and until a real synchronization mechanism is designed (a genuine future task, not this one).
- `docs/11-Content Model.md`'s "Technology Model" section (read this turn as part of investigating Reading Paths, §5) describes technologies as "reusable entities rather than plain text" with a full field set matching `technologyFrontmatterSchema` almost exactly — confirming referent #1 *is* the intended long-term model, but gives no timeline or trigger for when it should be activated, and nothing in `docs/12` commits Milestone 7 specifically to building it.

**RATIONALE**

Per this task's own instruction not to merge concepts merely because they share a name, and to identify the *smallest trustworthy* model: building a facet over data that's already real, already authored, and partially already rendered is the only option with zero risk of the fixture-drift problem `docs/42` §3 already found once (a hand-maintained dataset silently diverging from the real content it's supposed to describe). The richer, entity-based Technology model `docs/11` describes remains the right long-term direction but requires a real content-authoring decision (which technologies get their own page, with what copy, logo, and category) that is a product/content decision, not an architectural one this document can respons­ibly make.

**CONSEQUENCES**

Milestone 7's Technologies work, if taken up, is a filter/aggregation feature over existing frontmatter (e.g., "show all documents mentioning Go") — not a new content collection, not new routes per technology, not new MDX authoring. The `content/technologies/` collection stays registered-but-unused, exactly as it is today, until a future, explicitly-scoped task activates it.

---

## 5. Decision 3 — Reading Paths

**Correction to `docs/50`'s own finding, made explicitly rather than carried forward silently:** `docs/50` §6 stated *"Reading Paths' appears in exactly one place in the entire documentation set — `docs/12`'s Milestone 7 deliverable list."* That finding was incomplete — `docs/50`'s own reading list didn't include `docs/11-Content Model.md`, which this task's broader investigation instruction (§5: "investigate every repository/document reference") surfaced. `docs/11` **does** define Reading Paths conceptually:

> *"A Reading Path is a curated sequence of knowledge nodes."* Example: Backend Fundamentals → HTTP → REST → Authentication → Authorization → Rate Limiting → Caching → Queues → Distributed Systems. *"Readers can move from beginner to advanced concepts naturally."*

This is a real definition, and this document treats it as such rather than repeating `docs/50`'s "zero definition" claim. What it is not, is a definition detailed enough to implement safely without inventing structure `docs/11` doesn't specify.

**Investigation, per this task's own five sub-questions:**

- **Defined anywhere?** Yes — `docs/11`, one paragraph plus an example, no fields, no schema.
- **Does content already model it?** No — zero real documents reference a Reading Path; no frontmatter field exists for it (confirmed: `articleFrontmatterSchema` has no `readingPath`/`readingPathOrder`); no `content/reading-paths/` directory exists.
- **Roadmap aspiration only?** `docs/12` names it once, as a bullet, with no elaboration. `docs/11` gives it a real (if thin) conceptual definition — so it's more than a bare roadmap word, but has never been carried into schema, resolver, component, or route anywhere.
- **UI references?** None — grep across `src/` for "reading path" (case-insensitive) returns zero matches.
- **Relationships that imply it?** `docs/20-ARTICLE_EXPERIENCE.md` uses the phrase "a topic's reading path" once, informally, describing Previous/Next navigation generally — not a reference to a distinct Reading Path *feature*, just ordinary English use of the phrase.
- **A learning-sequence model exists?** Yes — Series (§3), already implemented for exactly this purpose at the schema/resolver level.

**The concrete problem: `docs/11`'s own Reading Path and Series definitions are not clearly distinguished.**

| | Series (`docs/11` "Series Model") | Reading Path (`docs/11` "Reading Paths") |
|---|---|---|
| Definition | "An ordered collection of knowledge nodes... provide guided learning paths." | "A curated sequence of knowledge nodes... move from beginner to advanced concepts naturally." |
| Fields specified | title, description, slug, order, cover, related technologies | **None specified.** |
| Example scope | Single-domain-ish ("Backend Fundamentals," "System Design," "Security Engineering") | Explicitly cross-topic in its own worked example (spans HTTP/REST/Auth/Rate-Limiting/Caching/Queues/Distributed-Systems — at least three different real `TOPIC_SLUGS` values) |
| Real schema equivalent | Yes — `series`/`seriesOrder`, live | **None.** |

**Weakening the distinction further**: `placeholder-series.ts`'s own `LearningSeriesEntry.topics` field is already `string[]` (plural) specifically because, per that file's own docstring, *"a series can legitimately belong to more than one domain"* — meaning the real Series model, as already implemented, **already crosses topic boundaries**, the one property `docs/11`'s worked example uses to seemingly distinguish a Reading Path from a Series. If both concepts are ordered, curated, multi-node, and cross-topic, `docs/11` does not give enough evidence to say they're structurally different things rather than the same concept under two names.

**DECISION**

**Deferred — insufficient authoritative evidence to define a Reading Path model distinct from Series.**

Per this task's own No Invention Rule (§15), explicitly invoked here as instructed. Milestone 7 should not build a second schema/resolver/route system for Reading Paths alongside Series until one of the following is resolved by an explicit, future product/content decision — not guessed here:

1. **Reading Path = Series under a different name.** If so, `docs/12`'s two separate bullets ("Series," "Reading Paths") collapse into one deliverable, already covered by Decision 1 — no new work needed beyond Series.
2. **Reading Path is a genuinely distinct, higher-order concept** — e.g., a curated sequence spanning *multiple* series/topics/collections (Knowledge → Work → Engineering Log, not just Knowledge-to-Knowledge), which would need its own ownership model, its own fields, and its own answer to every one of this task's five sub-questions (ownership, ordering, membership, routing, indexability) — none of which `docs/11` or any other document specifies.

**EVIDENCE**

`docs/11`'s two definitions, quoted above, side by side; `placeholder-series.ts`'s own multi-topic `topics` field; zero real content, schema, resolver, component, or route reference anywhere in the live repository; `docs/12`'s single unelaborated bullet.

**RATIONALE**

Building a second, parallel sequencing system without a real, evidenced distinction from Series would directly violate `docs/24` Principle 2 ("identify whether an existing architectural seam can be extended... before introducing a new abstraction") and Principle 3 (Single Source of Truth) — two systems answering the same question ("what order should a reader follow?") is exactly the "parallel systems" architecture Principle 2 warns against, unless a real difference justifies the second one. No such difference is evidenced.

**CONSEQUENCES**

Reading Paths is not scoped as an independent Milestone 7 work item by this document. It is explicitly deferred (§12) pending a product-level definition pass — recorded as a genuine open question (§13), not silently dropped from the roadmap.

---

## 6. Decision 4 — Tags

**Investigated, per this task's own sub-questions (§2 above plus direct re-inspection):**

- **Where do tags live?** `tags: string[]` on `articleFrontmatterSchema`, inherited by all three article-shaped collections (Knowledge, Work, Engineering Log).
- **Shared across collections?** Schema-shared, yes. Resolver-shared: no — no function anywhere aggregates tags across collections today (no `getAllTags()` or equivalent exists).
- **Tag pages canonical?** No tag-detail route exists anywhere (`/tags/*` absent from `docs/03`, absent from the real route tree).
- **Normalized / case-sensitive?** Schema enforces nothing beyond `string[]` — no lowercase coercion, no dedup, no format validation. Two authors writing `"api-design"` and `"API Design"` would produce two distinct strings today.
- **Aliases possible?** No alias mechanism exists anywhere.
- **Unknown tags?** Yes, always — that's the defining property of a free-form field, not a defect.

**Milestone 6 design history, explicitly considered per this task's instruction:**

`components/engineering-log/log-entry-header.tsx`'s own docstring states the existing position directly: tags render *"as a quiet, low-weight line — free-form and multi-valued..., never a controlled facet the way Work's `domain` or Knowledge's `topic` are... not a filterable badge row."* **Confirmed this turn to also govern Knowledge's `DocumentHeader`** (identical `tags.join(", ")` treatment) — this is a repository-wide Milestone 6 position, not an Engineering-Log-specific one.

**DECISION**

**Option A — free-form authored strings — is preserved as the underlying data model.** Milestone 7 does not introduce a controlled vocabulary or a centrally-defined taxonomy (Options B/C) as a prerequisite. The one change Milestone 7 introduces on top of the unchanged free-form model: **read-time, presentation-layer normalization for grouping only** (trim + case-fold as a lookup key; original author-written casing preserved for display) — never enforced at the schema/authoring layer, never rejected, never validated against a fixed list.

**RATIONALE (what changed, why the old decision doesn't fully answer the new question, what justifies the addition)**

*What changed:* Milestone 6's stated position governed tags in the context of *one document's own header* — a single article displaying its own tags as a label. Milestone 7's Definition of Done ("navigate naturally through connected knowledge") introduces a genuinely new consumer Milestone 6 never had: a reader trying to find *other* documents sharing a tag, which Milestone 6 never needed to support.

*Why the old decision is insufficient as-is:* "Never a filterable badge row" was a statement about single-document presentation restraint (no badge-wall aesthetic on an article page), not a statement that tags can never power a separate browse/filter surface — the two are different questions, and `docs/50`'s own §7 finding 6 already flagged this needs an explicit answer rather than either quietly reversing or quietly ignoring the older ruling.

*What justifies the specific addition (read-time normalization only):* nothing in the roadmap or the repository's real, non-empty data (8 documents, dozens of author-chosen tag strings) demonstrates enough naming inconsistency yet to require enforcement — but grouping "backend" and "Backend" as the same facet if that ever happens is a presentation concern with no schema cost and no authoring-discipline burden, consistent with `docs/24` Principle 11 (Simplicity Over Cleverness): the simplest change that makes a tag-browse feature usable, nothing more.

**EVIDENCE**

`log-entry-header.tsx` and `document-header.tsx` docstrings/implementations (re-confirmed this turn); zero controlled-vocabulary infrastructure anywhere (`TAG_SLUGS` grep, zero matches); `docs/11`'s "Tag Model" section ("tags power filtering and discovery" — aspirational intent, no implementation mandate either way).

**CONSEQUENCES**

- No schema change (tags stay `z.array(z.string()).default([])`).
- No authoring-workflow change (no fixed list to pick from).
- A future tag-browse/filter feature is buildable as a read-time aggregation over existing real data, once the real-content migration (Decision 5) makes that data reachable from the surfaces a filter would live on.
- Work's currently-inert `tags` field (§2) becomes a real candidate for first-time UI exposure once cross-collection tag browsing exists — not before, and not as part of this decision alone.
- Per-tag canonical routes (`/tags/[tag]`) are **not** decided here either way — deferred as a routing question parallel to, and no more urgent than, Decision 1's Series-routing deferral, since nothing in `docs/03` currently authorizes one.

---

## 7. Decision 5 — Placeholder Migration

**Re-inspected this turn, not merely restated from `docs/50`:**

| Surface | Current source | Real equivalent exists? |
|---|---|---|
| `/knowledge` — Start Here, Recently Published | `PLACEHOLDER_START_HERE`, `PLACEHOLDER_RECENTLY_PUBLISHED` | **Yes** — `getFeaturedArticles()` (`featured: boolean` already in schema, already used identically by the Homepage) and `sortByPublishedDate(getAllArticles())` are real, already-built, already-proven equivalents |
| `/knowledge` — Browse by Topic | `PLACEHOLDER_TOPICS` | Topic *list* is real (`TOPIC_SLUGS`); per-topic article counts would need to be computed from `getAllArticles()` filtered by `topic`, which is a small, real computation, not a data source that needs to exist first |
| `/knowledge/{topic}` — Start Here, Article List | `PLACEHOLDER_TOPIC_ARTICLES[slug]` | **Yes** — `getAllArticles().filter(a => a.frontmatter.topic === slug)`, the exact filter `resolveSameTopicFallback()` (`relationships.ts`) already performs for a different purpose |
| `/knowledge`, `/knowledge/{topic}` — Learning Series | `PLACEHOLDER_SERIES` | Real equivalent requires real `series`/`seriesOrder` content first (Decision 1) — partially blocked on content authoring, not just a resolver swap |
| `/work`, `/work/library` — Featured/Project Library listing | `PLACEHOLDER_WORK` (via `lib/content/work.ts`) | **Yes** — `getAllCaseStudies()` (`case-studies.ts`), the exact resolver `docs/42` §3 already proved correct for Search, and the one `docs/49` already uses for Sitemap |
| `/work` — Architecture Highlights, Engineering Lessons | `PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS`, `PLACEHOLDER_ENGINEERING_LESSONS` | **No** — no equivalent field exists anywhere in `workFrontmatterSchema`; this is genuinely editorial content (hand-written engineering lessons, a theme taxonomy) with no frontmatter to compute it from |

This last row matters: **the migration is not 100% mechanical.** Most of what's fixture-backed today has a real, already-proven computational equivalent (the same `featured`/`topic`/`sortByPublishedDate`/`getAllCaseStudies()` seams already used elsewhere in this exact codebase). A genuinely editorial slice (Work Landing's Architecture Highlights and Engineering Lessons) does not, and closing that gap would require either a schema extension (explicitly out of this document's authority — "No schemas" — and out of Task 7.1's likely scope too) or continuing to hand-author that slice as curated content outside the frontmatter model, a legitimate but separate decision.

**DECISION**

**Option B — this migration should be Task 7.1 itself.** Not a vague, task-numberless "prerequisite" (Option A), and not folded back into Milestone 6 (Option C — explicitly foreclosed by this task's own §13 "Milestone 6 Protection," and Milestone 6 is closed and approved regardless). This decision is formalized as the concrete recommendation in §11.

**EVIDENCE**

- Sitemap (`docs/49`), RSS (`docs/47`, implied), Search (`docs/42` §3, with a concrete, evidenced correction), and the Homepage's Knowledge/Engineering-Log sections **all already read real content** — the fixture-backed surfaces are now the exception, not the norm, among the site's own data sources.
- `docs/42` §3's own direct evidence: `PLACEHOLDER_WORK`'s VaultPay `summary` text has already measurably drifted from the real `content/work/vaultpay.mdx` `description` — a concrete, already-occurred correctness failure this task's own §7 explicitly cites as the reason this decision matters ("placeholder Work has already caused real architecture problems in Search and Sitemap").
- `lib/content/work.ts`'s own docstring already predicts and endorses this exact convergence as the intended long-term architecture — this decision doesn't invent a new direction, it schedules one the codebase already documents as inevitable.

**RATIONALE — the architectural consequence of leaving placeholders in place**

Per the Real Data Principle (this task's own §8): *"Discovery must operate on the same authoritative content sources that the canonical pages, RSS, and Sitemap trust."* Every one of Milestone 7's data-shaped deliverables — Tags-as-facet, Series-in-page, Technologies-as-facet, Filtering — would, if built against `/knowledge`, `/knowledge/{topic}`, `/work`, `/work/library` today, either (a) filter/facet/group **fixture data a reader can reach no other way**, which is actively dishonest discovery (finding "more like this" among examples, not among the real published corpus), or (b) require each of those tasks to independently rediscover and fix the exact `work.ts`-vs-`case-studies.ts` problem `docs/42` §3 already solved once, multiplying a single already-known correction across N future tasks instead of resolving it once, up front, in one place. Leaving the fixture split in place doesn't just create rework — it creates a live drift risk (per the VaultPay evidence above) that gets wider, not narrower, every time a new Discovery feature is layered on top of it.

**CONSEQUENCES**

- Task 7.1 (§11) becomes a real-content migration for the four still-fixture-backed surfaces, using resolvers that already exist and are already proven elsewhere in this exact codebase (`getFeaturedArticles()`, `getAllArticles()`, `getAllCaseStudies()`, `sortByPublishedDate()`) — no new resolver architecture, per `docs/24` Principle 2.
- Architecture Highlights and Engineering Lessons (Work Landing) are explicitly **not** included in Task 7.1's migration — recorded as a known, bounded exception (§12), not silently left inconsistent.
- Every subsequent Milestone 7 task (Tags, Series, Technologies, Filtering) can build directly on real data without re-solving this problem.

---

## 8. Related Content Decision

**Re-inspected this turn**: `relationships.ts` (Prerequisites, Related Concepts, Continue Learning, Same-Topic fallback — all Knowledge-scoped), `case-study-relationships.ts` (Related Knowledge from a Case Study, Related Engineering Logs from a Case Study — both real, working), `engineering-logs.ts` (Related Work from a Log entry, the reverse direction). No component named `RelatedContent` exists; `RelatedLearning` is the real Knowledge-side consumer of this infrastructure.

**One concrete, already-named gap exists in the current architecture, not invented here**: `case-study-relationships.ts`'s own docstring states directly — *"This file also does not implement Related Case Studies (docs/31 §7's other navigation path, 'what else demonstrates a similar engineering concern')... It would resolve through this same file, using the same domain... adjacency this module already computes for Previous/Next, whenever the task that owns the Work relationship/navigation model in full picks it up."* A Work-to-Work "Related Case Studies" relationship is the one explicitly-deferred, explicitly-scoped, same-pattern extension already anticipated by existing code.

**DECISION**

Milestone 7's "Related Content" is scoped as: **(1) the existing per-document relationship resolvers stay exactly as they are — not rebuilt, not replaced; (2) the smallest concrete extension is the already-anticipated Related Case Studies (Work→Work) resolver, using the exact same authored/domain-adjacency pattern `resolvePreviousNextCaseStudy()` already established; (3) beyond that, "surfaced more broadly" means encouraging more authored `relatedContent`/`engineeringLog` cross-links in real frontmatter (an editorial task, not a code task) — today only one real cross-collection link exists in the entire content set (`haya.mdx`'s `relatedContent: ["how-jwt-works"]`).** No inferred, scored, ranked, or similarity-based recommendation system is proposed.

**RATIONALE**

Per this task's own §9 instruction — "prefer the smallest interpretation supported by the architecture... do not introduce search ranking or similarity infrastructure unless the roadmap explicitly requires it" — and `docs/24` Principle 8 ("prefer authored relationships over inferred recommendations... Knowledge should remain predictable, explainable, and maintainable"), which every existing relationship resolver in this codebase already honors without exception. `docs/12` names "Related Content" with no elaboration; nothing in it requires ranking or inference.

**EVIDENCE**

`case-study-relationships.ts`'s own docstring (quoted above); `docs/24` Principle 8; the 8-real-document corpus's single existing cross-collection link.

**CONSEQUENCES**

Related Content is the smallest-footprint Milestone 7 deliverable of the six evaluated (§10, §11) — a well-scoped resolver extension plus editorial follow-through, not new architecture.

---

## 9. Search Boundary — Preserved, Not Redesigned

Documented per this task's own explicit instruction, restating shipped fact:

**Milestone 6 Search (shipped, `docs/41`/`docs/42`, unchanged by this document):**
- A direct, GET-based `/search?q=` query — no client component, no debounce.
- Case-insensitive substring matching against `title`/`description` only — no `tags`, no `technologies`, no MDX body.
- Exactly three collections: Knowledge (`getAllArticles()`), Work (`getAllCaseStudies()` — the corrected resolver, `docs/42` §3), Engineering Log (`getAllEngineeringLogEntries()`).
- Results grouped by collection, each internally sorted by `sortByPublishedDate()`.
- No ranking, no index, no new dependency.

**Milestone 7 may add discovery mechanisms around that foundation** — e.g., once Tags/Technologies facets exist (Decisions 2, 4), `/search` could gain optional facet parameters layered on top of the same substring-match core. **Milestone 7 must not silently convert `/search` into a different search engine** — no ranking algorithm, no fuzzy/typo-tolerant matching, no index/library, no live-as-you-type behavior, no command palette, unless a future document explicitly re-opens `docs/41`'s own architecture decisions (D1/D2, `docs/41` §20), which this document does not do.

---

## 10. Dependency Graph

```text
                         ┌─────────────────────────────┐
                         │  Task 7.1 — Placeholder →   │
                         │  Real Content Migration      │
                         │  (Decision 5)                 │
                         │  /knowledge, /knowledge/[t], │
                         │  /work, /work/library         │
                         └───────────────┬───────────────┘
                                         │  unblocks
              ┌──────────────┬──────────┼──────────────┬───────────────┐
              ▼              ▼          ▼               ▼               │
        Tags-as-facet   Series-in-  Technologies-   Filtering            │
        (Decision 4)    page wiring  as-facet        (needs real         │
                        (Decision 1, (Decision 2)     content AND        │
                        needs real                    stable facets      │
                        series content                from the three     │
                        authored too)                 to its left)       │
                                                                          │
        ┌─────────────────────────────────────────────────────────────┘
        │  fully independent — no dependency on Task 7.1
        ▼
  Related Content: Work↔Work
  "Related Case Studies"
  (Decision 8/§8) — resolves
  against /work/[slug], already
  real content today

  ┌───────────────────────────────────────────────────────┐
  │  DEFERRED — not sequenced, blocked on external input:   │
  │  • /series/[slug] route      — needs docs/03 amendment │
  │  • /tags/[tag] canonical route — same open question     │
  │  • content/technologies/ activation — needs a product/  │
  │    content decision on a technology reference page      │
  │  • Reading Paths — needs a product definition pass       │
  │    (Decision 3) before ANY sequencing is possible        │
  │  • Search facet/ranking expansion — downstream of Tags/  │
  │    Technologies decisions, itself downstream of Task 7.1 │
  └───────────────────────────────────────────────────────┘
```

Not every feature depends on every other, per this task's own caution:

- **Related Content (Work↔Work) is the one deliverable that does not depend on Task 7.1 at all** — it resolves against `/work/[slug]`, already real content today, and could proceed in parallel with, or even before, the migration.
- **Filtering is the most downstream** of the four data-shaped features — it needs both real content (Task 7.1) and at least one stable facet (Tags or Technologies) to filter by; it should not be scoped first.
- **Reading Paths depends on nothing sequenceable** — it's blocked on a definition, not on any other Milestone 7 task's completion.

---

## 11. Recommended Task 7.1

**Recommendation: Task 7.1 = the Placeholder → Real Content Migration (Decision 5).**

Concretely: swap `/knowledge`'s Start Here/Recently Published/Browse-by-Topic-counts, `/knowledge/{topic}`'s Start Here/Article List, `/work`'s Featured/Project Library, and `/work/library`'s Listing off `PLACEHOLDER_*` fixtures onto `getFeaturedArticles()`, `getAllArticles()` (topic-filtered), and `getAllCaseStudies()` — resolvers that already exist, are already proven correct (`docs/42` §3, `docs/49`), and require no new architecture (`docs/24` Principle 2). Learning Series stays fixture-backed until Decision 1's content-authoring step happens (a related but separable piece of work). Work Landing's Architecture Highlights and Engineering Lessons are explicitly excluded from this task's scope (§7) — a known, bounded, documented exception, not a silent gap.

**Why this, over the six alternatives this task instructed be evaluated:**

| Alternative | Why not first |
|---|---|
| Tags | Needs real content to facet over (blocked on Task 7.1) and needs Decision 4's normalization approach — buildable, but its output would be invisible on the still-fixture-backed listing surfaces without the migration |
| Technologies | Same blocker as Tags, plus Decision 2 already scopes it to a facet over Work's `technologies` field — same downstream position |
| Series | Partially blocked on Task 7.1 (for the in-page wiring) *and* on real content authoring (Decision 1) — two prerequisites, not one |
| Related Content | **Genuinely independent** (§10) — a strong *parallel* candidate, but smaller in total impact than the migration, since it only touches one relationship type on one already-real route, versus the migration's effect on every other Milestone 7 deliverable's ability to mean anything real |
| Search expansion | Explicitly downstream of Tags/Technologies (§9) — cannot come first by definition |
| Reading Paths | Not sequenceable at all until Decision 3's deferral is lifted by a product definition |

**The test this task's own §12 poses** — *"What is the smallest valuable Discovery foundation that unlocks the most future work without creating rework?"* — is answered directly by §7's rationale: leaving the fixture split in place doesn't just block individual features, it guarantees each subsequent feature either operates dishonestly (faceting fixture data) or repeats a correction (`work.ts` vs. `case-studies.ts`) already made once. Migrating first is the one task that removes that repeated cost for every deliverable that follows it, using only resolvers this exact codebase has already built and proven — the smallest real architectural risk of anything evaluated.

**Secondary recommendation, not part of Task 7.1 itself**: Related Case Studies (§8) is well-scoped, independent, and small enough to run in parallel with Task 7.1 if capacity allows — recorded as a strong Task 7.2 candidate, not folded into 7.1's own scope to keep that task's footprint minimal and reviewable, consistent with every prior migration-shaped task in this series (`docs/47`, `docs/49`) staying to a single, tightly-scoped file manifest.

---

## 12. Explicitly Deferred Work

| Item | Deferred because | Revisit condition |
|---|---|---|
| `/series/[slug]` route | Not authorized by `docs/03`'s URL Structure (Decision 1) | An explicit IA amendment to `docs/03` |
| Reading Paths (any implementation) | No evidenced distinction from Series (Decision 3) | A product-level definition resolving whether it's a synonym for Series or a genuinely distinct cross-collection concept |
| `content/technologies/` collection activation | No evidenced product requirement for a per-technology reference page beyond the free-form facet (Decision 2) | An explicit content-strategy decision on whether that page is wanted |
| Tag controlled vocabulary / alias system | No evidenced naming-drift problem yet (Decision 4) | Real, observed tag-naming inconsistency across a larger real corpus |
| `/tags/[tag]` canonical route | Same unauthorized-by-`docs/03` status as Series (Decision 1's parallel) | Same kind of explicit IA amendment |
| Work Landing's Architecture Highlights / Engineering Lessons real-content migration | No frontmatter equivalent exists; a schema question, out of this document's authority (Decision 5) | A future, explicitly-scoped schema-extension decision |
| Search facet/ranking/index expansion | Downstream of Tags/Technologies; `docs/41` D1/D2 not reopened (§9) | Tags/Technologies decisions reaching real implementation first |

---

## 13. Remaining Open Questions

1. **Series IA amendment** — who owns updating `docs/03` to add `/series/*` (and, in parallel, `/tags/*`) if either is ever wanted as a canonical route, and when does that get proposed relative to Task 7.1?
2. **Reading Paths product definition** — is it a rename of Series, or a genuinely new cross-collection curriculum concept? Neither `docs/11` nor `docs/12` answers this; it needs a decision-maker outside this document's evidence base.
3. **`content/technologies/` activation trigger** — what real product signal (reader demand, portfolio scope growth, a specific new page like a "Uses" page) would justify the effort `docs/11`'s richer Technology Model implies?

None of these are answered here, per the No Invention Rule — each is recorded as a real, named gap rather than resolved by assumption.

---

## 14. Architectural Principles Carried Forward

- **`docs/24` Principle 2 (Extend Existing Architecture)** — every decision in this document reuses an existing resolver/schema seam (`getAllArticles()`, `getAllCaseStudies()`, `series`/`seriesOrder`, the domain-adjacency pattern) rather than proposing a parallel one.
- **`docs/24` Principle 3 (Single Source of Truth)** — the Real Data Principle (this task's own §8) is this document's operating rule throughout; Decision 5 exists specifically to restore it where it's currently violated.
- **`docs/24` Principle 8 (Explicit Knowledge, authored over inferred)** — governs both the Related Content decision (§8) and the Tags decision (§6): nothing proposed here infers, scores, or ranks; everything stays authored and explicit.
- **`docs/24` Principle 1 (Documentation Before Implementation)** — every routing question left open in this document (Series, Tags) is left open specifically because building the route first and documenting the IA decision after would invert this principle.
- **The No Invention Rule (this task's own §15)** — applied most consequentially to Reading Paths (§5), where a real but thin definition existed and was not stretched into an implementable model without evidence.

---

## Summary

Five decisions, each grounded in direct re-inspection rather than assumption: **Series** is approved as a content concept but not as a new route yet (Decision 1); **Technologies** resolves to the smallest trustworthy model — a facet over the real, already-authored `technologies` field, not activation of the empty structured collection (Decision 2); **Reading Paths** is explicitly deferred, with the specific overlap against Series that makes it unsafe to invent recorded in detail (Decision 3); **Tags** stay free-form, with only a light, non-breaking read-time normalization added on top of the unchanged Milestone 6 position (Decision 4); and the **placeholder migration** is resolved as Task 7.1 itself, the one change that unblocks every other data-shaped Milestone 7 deliverable without creating the repeated-correction risk `docs/42` already proved real once (Decision 5). Related Content is scoped to its smallest evidenced form — one already-anticipated resolver extension plus editorial follow-through, no inference. The Milestone 6 Search boundary is restated, not touched. No production code, route, schema, or content was modified to produce this document, and Milestone 6 remains exactly as shipped and approved.
