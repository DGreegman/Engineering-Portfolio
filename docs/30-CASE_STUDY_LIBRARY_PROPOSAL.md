# 30 — Case Study Library: Design Proposal (Task 5.2)

---

## Purpose

This document is the design proposal for **Task 5.2 — Case Study Library**, as defined in `28-WORK_IMPLEMENTATION_PLAN.md`.

It extends `25-WORK_EXPERIENCE.md`, `27-WORK_EXPERIENCE_DESIGN.md`, and `29-WORK_LANDING_PROPOSAL.md` rather than redefining them. Those documents established the Work section's philosophy and designed the Engineering Work Landing (Task 5.1, implemented). This document designs the page one level deeper: the complete, browsable archive the Landing's Project Library section previews but deliberately does not paginate, filter, or fully render (`29-WORK_LANDING_PROPOSAL.md` §5: "docs/29 §5 is explicit that this page previews the library, it does not paginate, filter, or fully render it — that full experience is Task 5.2's Case Study Library").

This is a design proposal only. It contains no components, no styling decisions, no animation behavior, and no implementation details. Per the review workflow in `28-WORK_IMPLEMENTATION_PLAN.md`, implementation of Task 5.2 should not begin until this proposal has been reviewed and approved.

**Revision note:** This draft incorporates the refinements from the first Architecture Review — establishing the Library as the canonical browsing surface (below), sharpening the distinction between Browse Lenses and filters (§4), documenting future addressable/shareable filtered-view URLs (§4), grounding default ordering in engineering significance rather than array convenience while keeping presentation independent of it (§3), requiring future metadata facets to stay orthogonal (§3), stating the Library-to-case-study transition as one continuous experience rather than a hand-off between tools (§6), adding a second scalability principle about discoverability through relationships (§9), and documenting Curated Engineering Trails as a third, distinct future path concept alongside Saved Collections and Engineering Collections (§10).

A concrete architectural note before the proposal itself: Task 5.1's implementation already reserved the seam this task fills in. `lib/content/work.ts`'s `getProjectLibraryHref()` returns the Landing's in-page anchor (`#project-library`) today specifically because "a dedicated Case Study Library experience is Task 5.2, not this task" — and documents that once that route exists, only its own return value changes (e.g. to `/work/library`), with no change required in the Landing's `ContinueExploring` component or copy. This proposal treats that seam as load-bearing: wherever this document says "the Library," it means whatever route `getProjectLibraryHref()` will resolve to once Task 5.2 is implemented.

## The Library Is the Canonical Browsing Surface

One architectural statement governs everything else in this document: **the Case Study Library is the canonical browsing surface for engineering work.** Not "a" browsing surface — "the" one. Future pages should not introduce competing ways to browse the archive. Whether a reader arrives from the Landing, from the Knowledge Library, from Engineering Logs, from a future search feature, or from a direct URL, the moment their intent shifts from "tell me about this one thing" to "let me browse engineering work," they should converge on this page. A second page that also lets a reader page through case studies — however locally reasonable it seems at the time it's proposed — would fragment the single authoritative exploration surface this proposal establishes, and should be treated as an architectural regression, not a convenience. This is the Library-scoped instance of `24-ENGINEERING_PRINCIPLES.md` Principle 3 (Single Source of Truth): browsing is resolved in exactly one place.

---

## The Question This Page Answers

> **What engineering work can I explore?**

This is a different question from the Landing's (*"What kind of engineering work does this engineer do?"*). The Landing introduces and argues; the Library exists once a reader is already persuaded and wants the complete, structured record. Where the Landing is curated and narrative, the Library is complete and structural — its job is coverage and findability, not persuasion.

---

# 1. Information Architecture

## Complete Page Structure

```
Case Study Library
        │
        ▼
Library Header
        │
        ▼
Browse Lenses
        │
        ▼
Case Study Listing
        │
        ▼
Continue Exploring
```

Four sections — noticeably fewer than the Landing's seven. That difference is deliberate, not incomplete: the Landing is a narrative that builds an argument beat by beat (philosophy → evidence → range → archive → synthesis → handoff); the Library is not an argument at all. It is one continuous, well-organized surface whose job is to get out of the way and let structure do the work. Fewer sections is the correct shape for a different kind of page, not a shortcut.

## Section-by-Section

**Library Header**
Question: *Where am I, and how much work is here?*
Orientation, not argument. States what this page is (the complete archive) and its real scale (an honest count, never a guess — same discipline `PROJECT_LIBRARY_COPY.scaleLabel` already established on the Landing). Carries no thesis and no evidence — unlike the Landing's Hero, this section makes no claim that the rest of the page has to substantiate. It exists purely so a reader arriving here (whether from the Landing, a direct link, or primary navigation) knows immediately that this is the full record, not another curated sample.

**Browse Lenses**
Question: *How can I approach this archive?*
The visible surface of the Organization Strategy (§3 below): domain, engineering theme, technology, and status, presented as entry points into the one Listing beneath them — not as separate content. This section exists because a reader's first instinct when facing a complete archive is "where do I start," and a single undifferentiated list answers that badly once the archive has any real size. Clicking into a lens narrows the same Listing; it never swaps in a different one. See §4 for the precise, strengthened distinction between this question and filtering's — the two are related but must not collapse into one concept.

**Case Study Listing**
Question: *What is the complete, ordered archive, and how do I narrow it to what I actually want?*
The one true collection — every case study, in a stable default order, each shown with the metadata described in §3/§8. This section exists because it *is* the library; everything else on the page exists to help a reader approach or narrow this one section. Filtering (§4) acts on this section; it does not introduce a second one.

**Continue Exploring**
Question: *Where do I go once I've found what I'm looking for — or found nothing?*
The same closing discipline the Landing's `ContinueExploring` established (docs/29 §4: contextual, never generic), scoped here to a reader who has now seen the complete archive. Handles both the successful case (into a specific case study) and the honest empty-filter case (broaden the filter, or route back into Knowledge/Engineering Logs) — a filtered-to-nothing result should never be a dead end.

---

# 2. Browsing Experience

## Arrival

Readers reach the Library from the Landing's Continue Exploring / Project Library entry point (via `getProjectLibraryHref()`, per this document's opening note), from primary navigation once it exists one level below "Work," or from a direct/shared link. All three arrivals land on the same page in the same state — there is no separate "referred from Landing" experience.

## Movement

The Library is not a sequence of pages to click through — it is one continuous, ordered surface. Moving through it should feel like scanning a well-organized index, not paging through search results. Browse Lenses let a reader jump into a relevant slice of that one surface without a hard navigation — narrowing in place, not navigating away — reinforcing "one archive, many entry points" rather than "many archives."

## What Encourages Exploration

- **Legible scale per lens.** A domain or theme heading that shows how much lives under it (per §3/§8) lets a reader triage before committing to read — "worth a look" becomes a visible judgment, not a gamble.
- **Freedom to pivot.** Narrowing by one lens (say, a theme) never hides the other lenses — a reader can approach the same entry by domain, by theme, or by technology without starting over, encouraging lateral browsing across axes rather than one linear scroll to the bottom.
- **No dead ends.** Every state — including a narrowed view that matches nothing — offers a next step (§1's Continue Exploring, or simply broadening the current lens). A reader should never hit a wall that only offers "go back."
- **Honest defaults.** The unfiltered Listing is already a complete, readable archive on its own (§4) — exploration is invited, never required, to make sense of what's here.

---

# 3. Organization Strategy

## The Governing Rule

Every organizing axis below is a **facet on the one case study record**, never a separate list. This is the same single-source-of-truth discipline `29-WORK_LANDING_PROPOSAL.md` §3 established for Featured Case Studies and extended to Architecture Highlights: a case study doesn't get filed into "the Backend Architecture collection" — it carries a `domain` (and, per below, a set of themes, a technology list, a status, and a complexity level), and every organizing view is a query over those facets against the one collection.

## The Facets

- **Engineering domain** — the broad area a project belongs to (e.g. Backend Infrastructure, AI Systems, Platform Engineering). Already modeled today (`CaseStudyEntry.domain`, established in Task 3.5).
- **Engineering theme** — the same vocabulary Architecture Highlights introduced on the Landing (docs/29 §4), applied here at full archive scale instead of a three-tile preview. A theme filter here and an Architecture Highlights tile on the Landing describe the same underlying relationship at two different scopes — not two taxonomies.
- **Technology** — the tech stack a case study documents, per `26-CASE_STUDY_TEMPLATE.md`'s frontmatter (`Tech Stack`). Not yet present on `CaseStudyEntry` — documented here as a facet this task's content model should extend to, not something to invent a parallel structure for.
- **Status** — Completed / In Progress, already modeled today. A legitimate organizing facet in its own right (a reader asking "what's finished" is a different, valid question from "what domain").
- **Complexity / Difficulty** — per `26-CASE_STUDY_TEMPLATE.md`'s frontmatter (`Difficulty`), not yet modeled on `CaseStudyEntry`. Mirrors the Knowledge Library's own `difficulty` field (`types/content.ts`'s `Difficulty`) conceptually, though — per the same reasoning Architecture Highlights used to stay independent of Knowledge's `TopicSlug` — this should remain the Work collection's own field, not a reused Knowledge type, unless and until a shared taxonomy becomes real scope (docs/29 §4's future vision, unchanged by this document).
- **Architecture** — not a separate facet from the above; "architecture" as the task's own prompt names it is what a case study's `theme`/`domain` facets already describe. Treating it as a fifth, independent facet would fragment one concept across two fields.

## Facets Must Stay Orthogonal

A short architectural note for whatever metadata is added to this model after this task: every facet must answer exactly one question, and no two facets should ever be able to answer the same one. Domain answers "what area of engineering is this." Theme answers "what engineering concern does it demonstrate." Status answers "is it finished." Complexity answers "how deep does it go." None of these should ever be allowed to drift into covering another's question — for instance, a future "difficulty" field creeping toward also encoding domain, or a "category" field added later that silently duplicates what theme already answers.

This is `24-ENGINEERING_PRINCIPLES.md`'s "one fact, one place" — Single Source of Truth — applied to the metadata model itself, not just to the collection as a whole: every future facet proposal should be checked against the existing list for overlap before it's added, the same way this proposal folded "architecture" into `theme`/`domain` rather than letting it become a fifth, redundant field.

## Default Order

**Guiding principle: the default order should communicate engineering significance, not implementation convenience.** "Whatever order the array happens to be in" is not, on its own, a defensible ordering — it's an accident of storage. What the Listing's default order should actually optimize for is putting a reader's attention on the work most worth their attention first.

Today that may coincide with publication order (today's array order, `PLACEHOLDER_WORK`'s own sequence) simply because publication order is the only signal available — recency is a reasonable proxy for significance in the absence of a better one, not a permanent commitment to chronology as the meaning of "default." Once richer signals exist (editorial weight, architectural depth, the same criteria `29-WORK_LANDING_PROPOSAL.md` §3 already uses for Featured selection), the resolver producing this order is free to evolve without the Library experience changing at all — §1's four sections don't know or care what produces the order they render, only that one exists and is stable.

This is precisely why `lib/content/work.ts` exists as a seam rather than the page reading `PLACEHOLDER_WORK` directly (the same discipline Task 5.1's own architecture review established for `getFeaturedCaseStudies()`/`getProjectLibrary()`): **the presentation layer should never depend on array ordering directly.** It calls a named resolver function and trusts the order that function returns; what that function does internally to decide "significance" is free to get smarter over time without a single component changing.

## Per-Entry Metadata

Consistent with `26-CASE_STUDY_TEMPLATE.md`'s frontmatter and `28-WORK_IMPLEMENTATION_PLAN.md`'s "Metadata presentation" deliverable, each Listing entry should surface: title, one-line engineering-challenge summary (not a product description — same discipline `EngineeringCaseStudies`/`FeaturedCaseStudies` already established), domain, status, and — once modeled — complexity and a compact technology line. This is data the Listing already needs regardless of filtering; filtering only decides which entries are shown, never what's shown per entry.

---

# 4. Filtering Philosophy

## Browse Lenses Answer a Different Question Than Filters

Strengthened per architecture review: §2 and §3 discussed Browse Lenses and filtering closely together, but they answer two distinct questions and should not collapse into one concept.

- **Browse Lenses answer "How can I approach this archive?"** They define the available *perspectives* — the fixed, small set of orthogonal facets §3 documents (domain, theme, technology, status, complexity). A Browse Lens is structural: it exists whether or not a reader ever narrows anything, the same way a table of contents exists whether or not a reader jumps to a specific heading.
- **Filters answer "How can I narrow the archive?"** They are what a reader *does* within a perspective a lens has already opened — the specific values applied (this theme, this status) to reduce the Listing to what matters right now. A filter has no meaning without a lens already defining what it's a value of.

The relationship is one-directional: **filters operate within Browse Lenses, not alongside them as a second, independent mechanism.** A future implementation should treat "which facets exist" (Browse Lenses, §3) and "which values are currently selected" (filters, this section) as two distinct concerns — the first is closer to Resolution-Layer vocabulary, the second closer to reader-driven, possibly URL-addressable state (see below). Keeping that boundary sharp now is what will make the implementation clean later.

## Why Filtering Exists

The same archive serves genuinely different reader intents at once: a hiring manager scanning for scale and completeness, a peer engineer looking for how a specific problem was solved, a curious learner following one theme. No single static ordering serves all three well. Filtering exists so one honest collection can answer several different reader questions without maintaining several different lists.

## What Filtering Answers

Each facet in §3 exists because it maps to a real question a reader actually arrives with:

- "What has this engineer built in distributed systems?" → theme
- "What's shipped versus still in progress?" → status
- "What's built on Postgres / Kafka / <technology>?" → technology
- "What's the deepest, most involved work available?" → complexity
- "What falls under backend versus AI systems?" → domain

Filtering that doesn't map to one of these real questions doesn't belong — this is the same discipline docs/29 §4 applied to Continue Exploring's links ("if a recommendation cannot be justified by something the reader just encountered, it does not belong"), applied here to filter facets instead of links.

## How Filtering Supports Exploration

- **Narrows, never replaces.** A filter always operates on the one Case Study Listing (§1) — it is a lens on the archive, never a route to a different one.
- **Composable, not exclusive.** Combining facets (e.g. theme + status) should behave predictably and additively — a reader shouldn't need to understand a query language to combine two honest questions into one.
- **Optional, not load-bearing.** The unfiltered Listing must already be a complete, browsable archive in its own right (§8, §9) — filtering is a convenience for narrowing, never a requirement for the page to make sense. This matters architecturally: a page that only works once filtered has quietly made its unfiltered state a degraded one, which contradicts the "every state is honest" principle running through this whole workspace.
- **Never a polish filter.** No default or implicit filter should favor "Completed" over "In Progress," or otherwise quietly hide less-finished work — consistent with `25-WORK_EXPERIENCE.md`'s rejection of marketing language. Status is a fact a reader can filter *by*, never a curtain the page draws on its own.

## Future Note: Addressable Filtered States

Documented as a future architectural direction only — it does not affect this proposal's current scope. Narrowing "in place" (§2) describes the reading experience, not a constraint that filtered states must stay invisible to the URL. A filtered view is a legitimate, nameable thing a reader may want to share, bookmark, or return to — eventually, the Library's URL should be able to represent it directly, for example:

```
/work/library?theme=distributed-systems
/work/library?domain=backend
/work/library?status=in-progress
```

This is future scope specifically because it's a routing/state concern, not an information-architecture one — nothing in §1's four sections needs to change shape to support it later. It's recorded here, next to the filtering discussion it belongs to, so a future implementation task designs filter state with shareability in mind from the start rather than retrofitting it after the fact.

---

# 5. Relationship with the Work Landing

The two pages divide labor along exactly the line `29-WORK_LANDING_PROPOSAL.md` already drew, extended one level further now that both exist:

```
Work Landing                          Case Study Library
     │                                       │
     ▼                                       ▼
Introduces (argument, curated)        Enables exploration (complete, structural)
     │                                       │
     ▼                                       ▼
Small, narrative, seven beats         One archive, four sections, no argument
```

- **No duplicated listing.** The Landing's Project Library section (Task 5.1) stays exactly as scoped in docs/29 §5 — scale, shape, and an entry point, never a full render. Once this Library exists, that section's entry point *is* this page; nothing about the Landing's own content needs to grow to accommodate the archive's real size, because the archive was never really rendered there in the first place.
- **Featured stays consistent, not reinterpreted.** The `featured` flag `29-WORK_LANDING_PROPOSAL.md` §3 established (one record, editorially marked, never a separate collection) should read the same way here — the Library's Listing may indicate which entries are Featured (e.g. as a quiet marker, not a separate section), but it must not re-curate a *different* "featured" set. Same flag, same meaning, two scopes.
- **Architecture Highlights and Browse Lenses share a vocabulary, not a UI.** The Landing's Architecture Highlights (a three-tile preview of themes) and the Library's theme lens (the same themes, applied to the full archive) describe the same underlying relationship — extending it here is not introducing a second taxonomy, it's the same one at full scale.
- **The seam is already built.** As noted in this document's opening, `getProjectLibraryHref()` is the one place this relationship becomes concrete — its return value is the only thing that needs to change for the Landing to point here instead of at its own anchor.
- **The Landing is a doorway, not a peer.** Consistent with this document's opening "canonical browsing surface" statement: the Landing's Featured Case Studies and Project Library preview both exist to get a persuaded reader here — neither is a second, smaller browsing experience competing with this one. Any future entry point (Knowledge, Engineering Logs, search, a direct link) should hold the same relationship to this page the Landing does.

---

# 6. Relationship with Case Studies

Each Listing entry is a doorway into its full case study (`26-CASE_STUDY_TEMPLATE.md`'s structure, Task 5.3's own scope). The transition should read as opening a folder from an index, not navigating to an unrelated page: the metadata surfaced in the Listing (domain, status, complexity, timeline) should be recognizable at the top of the case study itself once Task 5.3 defines that header, so a reader experiences continuity rather than a context switch. Put plainly: opening a case study should feel like opening a document from an archive, not navigating to a different application — the Library and the case study it opens are one continuous experience, not a browsing tool bolted onto a separate reading tool.

This relationship is intentionally one-directional in this task's scope: the Library launches a reader *into* a case study. What a case study offers for continued navigation from there — Previous/Next, Related Case Studies, Related Knowledge — belongs to Task 5.3 (Case Study Experience) and Task 5.6 (Knowledge Integration) respectively, per `28-WORK_IMPLEMENTATION_PLAN.md`'s own milestone breakdown, and is out of this proposal's scope. Where Previous/Next eventually exists, it should have the option to traverse the Library's current order or filter context — but deciding how is that task's design decision, not this one's.

---

# 7. Relationship with the Knowledge Library

The Library inherits the same non-duplication discipline docs/29 §6 established for the Landing: it must never become a second knowledge index. Its subject is *what engineering work exists*, not *what the concepts behind it mean*.

- **No inline concept explanations.** If a Listing entry's metadata references a concept the Knowledge Library already covers (a theme, a technology, a pattern), the Library links to that existing article rather than explaining it — the same "point, don't duplicate" rule applied throughout this workspace.
- **Shared theme vocabulary stays future scope.** docs/29 §4 documented a possible long-term shared taxonomy between Architecture Highlights and the Knowledge Library as future vision only. Filtering by theme at Library scale makes that convergence more tempting, not more urgent — this proposal does not pull it forward; the Library's theme facet remains Work-owned today, exactly as the Landing's Architecture Highlights already established.
- **Continue Exploring stays contextual.** The Library's closing section should route into Knowledge only where something on the page actually justifies it (a specific theme, a specific lesson-adjacent concept) — never a generic "browse Knowledge too" link, per the same discipline docs/29 §4 required of the Landing's own Continue Exploring.

---

# 8. Visual Hierarchy

The Landing's governing rule (docs/29 §8: emphasis follows engineering weight, never quantity or visual novelty) applies here under real pressure, since a filterable archive with a technology facet is exactly the kind of surface that tempts a logo grid or a badge wall.

**Highest emphasis**
- Each entry's engineering-challenge summary — the same "case file, not project tile" language `EngineeringCaseStudies`/`FeaturedCaseStudies` already established. This is what a reader is actually here to evaluate.

**Secondary emphasis**
- Domain and theme grouping labels — carry more visual weight than any individual entry's metadata, reinforcing browsing-by-concern over browsing-by-buzzword.
- Status and complexity — legible, but as short labels, not a color-coded badge system that starts reading as gamification.

**Supporting emphasis**
- Technology — a quiet metadata line and a filter facet, never an entry's primary visual identity. A reader should recognize a case study by the problem it solved, not by its stack.
- Filtering itself, whatever form it eventually takes — a tool sitting quietly above the content it acts on, never competing with the Listing for attention (`24-ENGINEERING_PRINCIPLES.md` Principle 12: "Design Supports Content").

---

# 9. Scalability

The Library's information architecture (§1) does not change shape as the archive grows — only how much interaction each part of it rewards changes.

**At 10 case studies**
Browse Lenses may be sparse — two or three domains, a handful of themes, most with only one or two entries. The unfiltered Listing is short enough to read top to bottom on its own; filtering is barely necessary. Both stay present anyway, because consistency of structure matters more than premature optimization for the current size — the same reasoning docs/29 §9 used for the Landing at 5 projects.

**At 50 case studies**
Browse Lenses become genuinely useful navigation, not decoration — a reader benefits from grouping rather than scanning the full Listing unaided. Filtering starts mattering for real: finding "the distributed systems work" among fifty entries is a meaningfully different task than among ten.

**At 200 case studies**
Browse Lenses become the primary way most readers approach the archive at all, rather than scrolling the full Listing top to bottom. The unfiltered Listing likely needs some form of incremental disclosure to stay usable at that length — but *how* (pagination, progressive loading, or otherwise) is an implementation decision explicitly deferred, not resolved here.

## The Governing Principle

What stays constant through all three sizes is the shape itself: one collection, a fixed small set of orthogonal facets, one Listing surface. Nothing about §1's four sections needs to change as the count grows — only the density of a reader's interaction with them does. This is the same principle docs/29 §9 established for the Landing, carried forward rather than re-derived: **growth should increase the richness of relationships, not the complexity of navigation.**

A second principle completes it, specific to a page whose whole job is browsing at scale: **increasing archive size should improve discoverability through relationships rather than requiring additional navigation layers.** At 200 case studies, the temptation is to solve scale by adding structure on top of structure — a second-level category page, a sub-filter within a filter, a "browse the browse lenses" page. That temptation should be resisted. The right response to more work is more (and better) relationships between the facets already in §3 — richer theme groupings, more precise technology tagging, tighter Related Case Study links once Task 5.6 exists — not a deeper navigation tree. A reader should always be at most one lens and one filter away from what they're looking for, at any archive size.

---

# 10. Future Evolution

Documented as future possibilities only — none change this proposal's current scope, and `28-WORK_IMPLEMENTATION_PLAN.md`'s own "Out of Scope" list (Search, Analytics, Comments, Bookmarks, Reading progress, AI-assisted navigation) still applies unless a future task explicitly revisits it.

- **Saved collections** — a reader-side ability to bookmark or personally curate a trail through the archive, distinct from the Landing's editorial "Featured" (which is authored, not personal).
- **Engineering paths** — a curated, ordered sequence across multiple case studies telling one larger story. This is the same future concept docs/29 §10 already documented for the Landing as "Engineering Collections" (the "Building VaultPay — Part 1–4" example) — a path and a collection describe the same idea from two angles; a future task should reconcile the naming rather than this proposal inventing a second concept.
- **Advanced filtering** — multi-facet combinations beyond simple narrowing, saved filter presets, or shareable filtered views.
- **Search** — full-text search across case studies, explicitly out of scope per `28-WORK_IMPLEMENTATION_PLAN.md`, restated here rather than silently reintroduced.
- **Comparison views** — viewing two case studies' architecture or trade-offs side by side, useful for an engineering-minded reader doing genuine due diligence rather than browsing.
- **Curated Engineering Trails** — learning-oriented journeys, distinct from both of the other path-like ideas already documented across this workspace's docs, worth naming precisely so the three don't blur together:
  - **Saved collections** (above) are reader-owned — a personal trail, built by whoever's browsing.
  - **Engineering Collections** (docs/29 §10, "Building VaultPay — Part 1–4") are author-owned and Work-only — one project's own multi-part story.
  - **Engineering Trails** are author-curated but cross section — an educational path built across *both* the Work and Knowledge sections at once, e.g.:

    ```
    Backend APIs (Knowledge)
            │
            ▼
    Distributed Systems (Knowledge)
            │
            ▼
    Observability (Knowledge)
            │
            ▼
    VaultPay Case Study (Work)
            │
            ▼
    Production Lessons (Work)
    ```

    Where a Collection deepens one project and a saved collection serves one reader's private curation, a Trail is a taught sequence — concept, concept, concept, then the concepts applied, then what was learned applying them — deliberately spanning the Knowledge/Work boundary this entire proposal has otherwise kept firm. That's exactly why it stays future-only: building it well requires the shared taxonomy docs/29 §4 already flagged as future vision, not before.

Each of these deepens the same four-section architecture rather than replacing it, consistent with `24-ENGINEERING_PRINCIPLES.md` Principle 13 ("Incremental Evolution... additive whenever possible").

---

# Summary

The Case Study Library exists to answer one question — *what engineering work can I explore* — and it answers that question with structure rather than argument. Where the Landing persuades in seven narrative beats, the Library orients, offers a small set of honest perspectives on the archive, presents the complete listing those perspectives narrow, and hands the reader onward. Every Browse Lens defines a way to approach the work; every filter narrows within one of those lenses toward a real question a reader actually arrived with. Neither exists to look comprehensive.

The discipline holding this together is the same one established for the Landing and now extended one level deeper: one collection, viewed through several honest, orthogonal facets, in an order that means something rather than one that was merely convenient to store — never a second dataset, never a duplicated taxonomy, never a concept re-explained where the Knowledge Library already owns it. That discipline, not any particular section, is what keeps this page working unchanged from ten case studies to two hundred, and it's also what makes this page the one and only place engineering work gets browsed — every other entry point exists to lead here, not to compete with it.

This proposal introduces no parallel browsing experience. It is the natural next layer of the architecture `25-WORK_EXPERIENCE.md`, `27-WORK_EXPERIENCE_DESIGN.md`, and `29-WORK_LANDING_PROPOSAL.md` already established, ready for architecture review ahead of Task 5.2 implementation.
