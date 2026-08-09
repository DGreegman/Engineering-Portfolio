# 29 — Engineering Work Landing: Design Proposal (Task 5.1)

---

## Purpose

This document is the design proposal for **Task 5.1 — Engineering Work Landing**, as defined in `28-WORK_IMPLEMENTATION_PLAN.md`.

It extends `25-WORK_EXPERIENCE.md` and `27-WORK_EXPERIENCE_DESIGN.md` rather than redefining them. Those documents establish the philosophy and the high-level narrative of the Work section as a whole. This document takes the landing page specifically — the first screen a reader encounters — and specifies its complete reader experience and information architecture in enough detail to review and approve before implementation begins.

This is a design proposal only. It contains no components, no styling decisions, no animation behavior, and no implementation details. Per the review workflow in `28-WORK_IMPLEMENTATION_PLAN.md`, implementation of Task 5.1 should not begin until this proposal has been reviewed and approved.

**Revision note:** This draft incorporates the refinements from the first Architecture Review — clarifying Featured Case Studies as a curated subset of the single Project Library source of truth (Section 3, Section 5), positioning Architecture Highlights as a secondary navigation model (Section 4), reframing Engineering Lessons around reusable knowledge and its role as the Knowledge Library's origin point (Section 6), requiring Continue Exploring's recommendations to be contextual (Section 1), documenting a future shared taxonomy between Architecture Highlights and the Knowledge Library (Section 4), adding a governing scalability principle (Section 9), and adding Engineering Collections as a future evolution (Section 10).

---

## The Question This Page Answers

> **What kind of engineering work does this engineer do?**

This is deliberately narrower than the question the Work section as a whole answers (*"How does this engineer solve problems?"*, per `25-WORK_EXPERIENCE.md`). The landing page is the entry point, not the destination. Its job is to let a reader correctly categorize the kind of engineer they are looking at — the domains, the depth, the seriousness — and then choose where to go deeper. The "how" is answered by case studies. The "what kind" is answered here.

---

# 1. Information Architecture

## Complete Top-to-Bottom Structure

```
Engineering Work
        │
        ▼
Engineering Philosophy
        │
        ▼
Featured Case Studies
        │
        ▼
Architecture Highlights
        │
        ▼
Project Library
        │
        ▼
Engineering Lessons
        │
        ▼
Continue Exploring
```

This is the same sequence established in `25-WORK_EXPERIENCE.md` and `27-WORK_EXPERIENCE_DESIGN.md`. This proposal does not alter the sequence — it specifies the question and rationale for each section, and adds one closing section (**Continue Exploring**) that the source documents imply but do not name.

## Section-by-Section

**Engineering Work (page frame)**
Question: *Where am I?*
Establishes that the reader has left the general portfolio narrative (Home) and entered engineering documentation. It sets expectation before content begins — this page will read like a technical section of a documentation site, not a marketing page.

**Engineering Philosophy**
Question: *How does this engineer approach problems, before I see any evidence?*
This section exists to prime the reader's interpretive frame. Everything that follows — the case studies, the highlights, the library — will be read through whatever lens is set here. Stating the philosophy first means the reader evaluates subsequent evidence against a stated position rather than reverse-engineering the position from scattered projects. It is a thesis statement, not a biography.

**Featured Case Studies**
Question: *What is the strongest evidence for that philosophy?*
This section exists to make the philosophy verifiable immediately. A claim about engineering discipline is worth little without evidence one click away. Featured work is the proof layer directly beneath the thesis.

**Architecture Highlights**
Question: *What engineering themes recur across this person's work, independent of any single project?*
This section exists because individual case studies prove depth on *one* problem; it does not by itself prove *range* or *consistency*. Grouping by theme (distributed systems, security, observability, etc.) lets a reader assess breadth without reading every case study. It also reveals that architectural thinking is a durable skill applied repeatedly, not a one-off achievement. Architecturally, this section is not merely a themed content block — it is the Work experience's **second navigation model**, standing alongside the Project Library as an equally legitimate way to explore the same underlying work. See Section 4 for the full treatment of this distinction.

**Project Library**
Question: *What is the complete body of work, beyond what was featured?*
This section exists for the reader who has moved past "is this person credible" and now wants the full record — a domain expert doing due diligence, a hiring manager scanning breadth, or a curious peer. It is the archive, positioned after the curated argument has already been made. It is also the single source of truth for every project, including those surfaced earlier as Featured — see Section 3 for how that relationship works.

**Engineering Lessons**
Question: *What reusable engineering knowledge emerged from this work?*
This section exists to close the loop back to the Philosophy section. Philosophy stated a position; the case studies and library supplied evidence; Lessons synthesizes what was actually learned across all of it. Framing this section around *reusable knowledge* rather than "what was learned" matters: it is what makes Engineering Lessons the deliberate bridge into the Knowledge Library, since lessons are the raw material articles are written from. Not every lesson becomes an article — but every article may originate from one of these lessons. See Section 6 for the full relationship.

**Continue Exploring**
Question: *Where do I go next?*
The landing page is an entry point, not a terminus. This closing section exists to explicitly route the reader onward — into the Case Study Library, into the Knowledge Library, or into Engineering Logs — rather than leaving them at a dead end after Lessons. This is wayfinding, not a new content section, and should carry no independent argument of its own.

**Design principle: recommendations here must be contextual, never generic.** Continue Exploring should never behave as a catch-all "you might also like" block. Every recommendation must extend the reader's current context rather than presenting arbitrary content — for example:

- Continue exploring related engineering work (same theme, same technology, same domain).
- Continue into the Knowledge Library (the concept behind a lesson just read).
- Continue into Engineering Logs (the raw process behind a case study just read).

If a recommendation cannot be justified by something the reader just encountered on this page, it does not belong in this section.

## Why This Order and No Other

The order moves from **claim → evidence → pattern → archive → synthesis → onward navigation**. Each section is only meaningful once the previous one has been read:

- Philosophy is meaningless without evidence (Featured Case Studies).
- Featured evidence looks like a highlight reel without a sense of theme (Architecture Highlights).
- Themes look abstract without an archive to check them against (Project Library).
- An archive without synthesis is just a list (Engineering Lessons).
- Synthesis without a next step leaves the reader stranded (Continue Exploring).

Reordering any of these sections breaks the chain of justification that comes before it.

---

# 2. Reading Journey

The reading journey is designed as an escalating commitment curve — each section asks slightly more of the reader's attention, and earns that attention by having satisfied the previous question.

1. **Arrival.** The reader lands from Home, navigation, or a direct link. They do not yet know if this section is worth their time.
2. **Philosophy sets a claim.** In a few sentences, the reader learns what kind of engineer they are dealing with — systems-minded, pragmatic, documentation-driven, whatever the actual position is. This is a low-cost read: short, declarative, skimmable in seconds. Its job is to earn ten more seconds of attention, not to convince.
3. **Featured Case Studies test the claim.** Curiosity shifts from "who is this" to "can they back it up." The reader samples two or three strong examples. This is where genuine interest either forms or doesn't — if the featured work doesn't substantiate the philosophy, the reader disengages here, and no later section will recover them.
4. **Architecture Highlights reveal range.** Having accepted that at least one project is credible, the reader's question naturally shifts from "is this one project good" to "is this consistent, or a lucky outlier." Grouping by theme answers that without requiring the reader to read every case study — it lets them sample horizontally instead of vertically.
5. **Project Library rewards the convinced reader.** By this point the reader has decided the engineer is credible. Curiosity shifts from evaluation to exploration — "what else has this person built." The library is presented as an archive to browse, not a wall to climb; it should feel optional, not mandatory reading.
6. **Engineering Lessons closes the argument.** The reader who has followed the whole page is now shown what was actually learned — the payoff for having read this far, and confirmation that the philosophy stated at the top was earned rather than asserted.
7. **Continue Exploring hands off.** The reader's curiosity, now warmed up, is redirected somewhere it can keep growing: a specific case study, the full library, a related article in the Knowledge Library, or the raw process behind the work in Engineering Logs.

At every step, a reader should be able to leave the page understanding *something*, whether they read one section or all seven. Nothing later in the page should be required to understand what came before it.

---

# 3. Featured Work Strategy

## How Featured Case Studies Should Be Selected

Featured status is a **curatorial judgment about engineering value**, never a mechanical ranking. Selection should weigh, per `25-WORK_EXPERIENCE.md`:

- Architectural complexity — did this project require genuine system design, not just implementation?
- Interesting trade-offs — are there decisions worth explaining, with real alternatives that were rejected?
- Engineering impact — did the decisions made actually matter to the outcome?
- Quality of documentation — is the case study itself written well enough to teach something?

A project that is large, polished, or commercially notable but explains none of its reasoning is a worse candidate for Featured than a smaller project with a sharply documented trade-off.

## Why They Appear Where They Do

Featured Case Studies sit immediately after Engineering Philosophy because they are the fastest possible proof of that philosophy. Placing them any later delays the moment a skeptical reader can verify the claim, and delay is where attention is lost. Featured work is also intentionally placed *before* Architecture Highlights and the Project Library — it should function as the reader's first, curated impression, not one option among many in an undifferentiated list.

## What Makes a Project "Featured"

A project earns Featured status by being the strongest available teaching example of engineering reasoning — not by being the biggest, the newest, or the most visually impressive. A useful test: *if a reader could only read one case study from this workspace, would this be defensible as the one to show them?* If the honest answer is no, it does not belong in the Featured set, regardless of its scale or prominence elsewhere.

Featured selection should also be intentionally small — a handful of projects, not a scrolling wall. The moment "featured" stops feeling curated, it has become a second Project Library and has lost its purpose.

## Featured Is Not a Separate Collection

This is stated explicitly to prevent future architectural drift: **Featured Case Studies are not a distinct dataset.** There is exactly one underlying source of truth for projects — the Project Library — and Featured is an editorial view over a subset of it, not a parallel collection with its own independent existence.

A project does not move "into" Featured the way it would move between two separate lists. It is marked as featured within its single project record, on the basis of engineering value, and it continues to exist unchanged in the Project Library at the same time. Featured selection is **editorial** — a human judgment call, revisited as new work is published — never **mechanical** — never a tag-based filter or a most-recent-N query pretending to be curation.

This matters architecturally, not just semantically. Two collections invite two failure modes: a project going stale in one while being updated in the other, and a reader encountering what looks like "the same project, twice" as two different things depending on where they found it. One project, one record, one place it can go out of date — Featured is a lens on that record, never a second record.

---

# 4. Architecture Highlights

## Purpose — A Secondary Navigation Model

Architecture Highlights groups engineering **themes**, not projects — and its role in the information architecture goes beyond grouping content. It is the Work experience's **second navigation model**, standing deliberately alongside the Project Library as an equally legitimate way to explore the same underlying engineering work:

```
Project Library          →  navigate by project
Architecture Highlights  →  navigate by engineering concern
```

These are not a primary index with a supplementary feature bolted on. They are two complete, complementary paths through the same body of work, and the information architecture should treat them as structurally equal. A reader who thinks in terms of "what did they build" belongs in the Project Library. A reader who thinks in terms of "how do they handle observability" belongs in Architecture Highlights. From this point in the page onward, the Work experience is intentionally bi-navigable, and neither path should be presented as more authoritative than the other.

Examples of the themes this navigation model organizes, consistent with `25-WORK_EXPERIENCE.md` and `27-WORK_EXPERIENCE_DESIGN.md`:

- Distributed Systems
- Backend Architecture
- Security
- Observability
- Performance
- API Design
- Infrastructure

## How It Should Read

Each theme should read as a standing engineering concern this person consistently addresses — not a tag or a category label. A reader encountering "Observability" here should understand it as a recurring discipline applied across several projects, evidenced by (and linking into) the specific case studies and architecture decisions where it shows up.

This section should feel like reading a table of contents for someone's engineering judgment, organized by concern rather than by chronology or by project name.

## Two Navigation Models, One Body of Work

The Project Library and Architecture Highlights are two indexes over the same underlying body of work, organized along different axes:

```
                Project Library          Architecture Highlights
Organized by    project / chronology     engineering theme
Answers         "what did they build?"   "what do they consistently think about?"
Best for        browsing the archive     assessing range and consistency
```

A single case study may appear once in the Project Library (as itself) and under several themes in Architecture Highlights (e.g., a payments system might surface under both Distributed Systems and Security). This is intentional — the two structures are not meant to be redundant listings of the same set, they are two different lenses on the same evidence. Architecture Highlights should never attempt to replace the Project Library's completeness, and the Project Library should never attempt to editorialize by theme the way Architecture Highlights does.

## Future Vision: A Shared Engineering Taxonomy

This is documented as a future architectural vision only — it does not change current scope. Today, Architecture Highlights' themes are local to the Work section. Long term, these themes could become a taxonomy shared with the Knowledge Library, so that a theme is not just a grouping of case studies but a hub connecting both halves of the Engineering Workspace:

```
Distributed Systems
        │
        ▼
Related Knowledge Articles
        │
        ▼
Related Case Studies
```

Under this vision, arriving at "Distributed Systems" from either the Work section or the Knowledge Library would surface the same theme, with the same two downstream views — the articles that explain it, and the case studies that demonstrate it. This is a natural extension of the existing Knowledge/Work relationship (Section 6) applied to Architecture Highlights specifically, and should be pursued only after the current two-collection architecture (Project Library and Architecture Highlights, each scoped to Work) has proven stable.

---

# 5. Project Library

## Organizing Principle

The Project Library is the complete, low-friction archive entry point on the landing page — not the library itself (that full experience is Task 5.2, per `28-WORK_IMPLEMENTATION_PLAN.md`). On the landing page, its role is to represent the *existence and shape* of the full archive and hand the reader off to it.

## Information Architecture (Landing Page Scope)

At the landing-page level, the library should communicate three things without requiring the reader to leave the page:

- **Scale** — roughly how much work exists (a count or an equivalent signal), so the reader calibrates expectations before diving in.
- **Shape** — the natural groupings the full library will offer (by domain, by technology, by recency, by challenge type — see `25-WORK_EXPERIENCE.md`'s navigation principles), previewed rather than fully rendered here.
- **Entry point** — an unambiguous path into the full Case Study Library experience.

## Why It Stays Concise Here

Consistent with `25-WORK_EXPERIENCE.md` ("Projects should remain concise. Detailed engineering discussions belong in Case Studies"), the landing page's Project Library section should not attempt to be the library. It previews the archive; it does not paginate it, filter it, or fully enumerate it. Its entire job is to make the reader confident that a deeper archive exists and worth visiting, and to send them there cleanly. Any browsing, filtering, or grouping mechanics belong to the dedicated library experience, not to this page.

## Single Source of Truth

The Project Library is the one and only underlying collection of projects. Featured Case Studies (Section 3) and, longer term, Architecture Highlights groupings are both views over this same collection — never independent datasets. A project's canonical record lives here; every other section that surfaces a project is referencing that record, not duplicating it.

---

# 6. Relationship to the Knowledge Library

The Work section and the Knowledge Library are deliberately complementary, not overlapping, per `25-WORK_EXPERIENCE.md`:

```
Knowledge Library                 Work
     │                              │
     ▼                              ▼
Explains a concept            Demonstrates the concept
     │                              │
     ▼                              ▼
Understanding                  Applied experience
```

On the landing page specifically, this relationship should surface in two places without becoming a duplicate content stream:

- **Engineering Lessons**, where a reusable insight naturally points to the article that explains the underlying concept in full — the case study proved it in practice, the article teaches it in general.
- **Continue Exploring**, where the Knowledge Library is offered as an explicit onward path for the reader whose curiosity is now conceptual rather than project-specific.

The landing page should never restate concept explanations that already live in the Knowledge Library. If a lesson references, say, idempotency or CQRS, the landing page links to the existing article rather than re-explaining the concept inline. The Work section's job is always to show the concept *applied*; explaining the concept *itself* is the Knowledge Library's exclusive responsibility. This division must hold even at the landing-page level, where the temptation to over-explain for a first-time visitor is highest.

## Engineering Lessons as the Bridge

Engineering Lessons deserves specific mention as the connective tissue in this relationship, not just one of two surface points. Reframed around its actual purpose — *what reusable engineering knowledge emerged from this work* — a lesson is a candidate concept, already validated in practice, that has not yet necessarily been written up as standalone teaching material.

The relationship should be documented explicitly:

- Not every lesson becomes an article. Many lessons are specific enough to a project that they belong only in that case study.
- Every article, however, may originate from one of these lessons. When a lesson proves general enough to be worth teaching independent of the project that produced it, the Knowledge Library is where it graduates to.

Engineering Lessons is therefore not simply a section that links to existing articles — it is the section most likely to be the *origin point* of future ones. Practical experience feeds the Knowledge Library through this exact seam.

---

# 7. Relationship to Engineering Logs

Engineering Logs and Case Studies represent two different points in the same timeline, per `27-WORK_EXPERIENCE_DESIGN.md`:

```
Engineering Log            Case Study
     │                          │
     ▼                          ▼
Experiment                Completed reasoning
Debugging                 Validated architecture
Discovery                 Documented outcome
     │                          │
     └────────► informs ───────►┘
```

Logs are the raw, in-progress record of experimentation, debugging, and investigation. Case studies are the refined, retrospective account of what that process ultimately produced. Neither replaces the other — a log entry may never become a case study, and a case study's polish depends on logs that were never meant to be polished themselves.

On the landing page, this relationship should stay implicit and secondary — surfaced only as an onward path (in **Continue Exploring**, and optionally as connective tissue within **Engineering Lessons**, where a lesson might point to the log entries where it was first discovered). The landing page should not attempt to summarize or feature individual log entries; doing so would blur the landing page's role as a curated argument with the log's role as an unfiltered process record. A reader who wants the raw discovery process should be able to find it, but the landing page's job stops at pointing the way, consistent with the log/case-study distinction already established.

---

# 8. Visual Hierarchy

Per `27-WORK_EXPERIENCE_DESIGN.md`, visual emphasis on the landing page should track engineering importance, not marketing appeal. Translated to the landing page's own sections:

**Highest emphasis**
- Engineering Philosophy (the thesis the whole page argues for)
- Featured Case Studies (the strongest evidence for that thesis)

**Secondary emphasis**
- Architecture Highlights (supporting evidence of range and consistency)
- Engineering Lessons (the synthesis that closes the argument)

**Supporting emphasis**
- Project Library entry point (an archive pointer, not a centerpiece)
- Continue Exploring (pure wayfinding)

This ordering intentionally does not favor whichever section is most visually dense or most "portfolio-like." A project thumbnail grid, for instance, is easy to make visually loud, but per `25-WORK_EXPERIENCE.md`'s explicit rejection of "portfolio galleries" and "product showcases," the Project Library entry point must remain visually subordinate to the Philosophy and Featured Case Studies sections even though it might contain the most items. Emphasis should always signal *engineering weight*, never *quantity of content* or *visual novelty*. A reader skimming only the highest-emphasis elements on the page should come away with the thesis and its best evidence — nothing else should be allowed to compete for that same level of attention.

---

# 9. Scalability

The landing page structure must remain unchanged whether the underlying body of work contains 5, 25, or 100 projects. Each section already has a bounded role that does not grow linearly with project count:

**At 5 projects**
Featured Case Studies may include most of the available work. Architecture Highlights may show only a few themes, each with one or two examples. The Project Library entry point may almost fully enumerate itself. This is an honest, appropriately modest presentation — the structure does not need to look "fuller" than the work actually is.

**At 25 projects**
Featured Case Studies stays small and curated by necessity — it must now genuinely select rather than merely list. Architecture Highlights becomes meaningfully useful, since real patterns start to emerge across a larger set. The Project Library entry point starts to matter as a distinct experience worth visiting rather than something the landing page could just show in full.

**At 100 projects**
Featured Case Studies remains exactly as small as it was at 5 or 25 — its size is a curatorial constant, not a proportion of the archive. Architecture Highlights becomes the primary tool for horizontal exploration, since no reader will reasonably scan 100 individual entries. The Project Library entry point becomes purely a gateway; all real browsing, filtering, and grouping happens one level deeper, in the dedicated library experience (Task 5.2), which is designed to absorb that scale — the landing page itself never attempts to.

## Why the Structure Holds

Scalability works because every section on the landing page is a **curated sample or a synthesized pattern**, never a complete enumeration. The only section whose size is allowed to grow with the archive is the Project Library's underlying count — and that growth is explicitly deferred to the dedicated library experience rather than absorbed into the landing page itself. This is the same principle stated in `25-WORK_EXPERIENCE.md`: adding new projects should never require structural changes, because the landing page's sections were never sized to project count in the first place.

## Guiding Principle

> **Growth should increase the richness of relationships, not the complexity of navigation.**

As the body of work grows, what should deepen is the density of connections between projects, themes, articles, and logs — a case study linking to more related knowledge, an Architecture Highlight surfacing more evidence, a lesson pointing to more prior discovery. What should *not* deepen is how many steps, sections, or decisions a reader must navigate through to find any of it. This is the architectural principle that keeps the landing page's seven-section structure valid indefinitely, and it should govern every future extension described in Section 10.

---

# 10. Future Evolution

The following are documented as future possibilities only. None require structural changes to the landing page architecture defined above, consistent with `25-WORK_EXPERIENCE.md`'s and `27-WORK_EXPERIENCE_DESIGN.md`'s principle that future capabilities should extend, not redefine, the existing experience.

- **Architecture galleries** — a visual index of system diagrams across projects, reachable from Architecture Highlights without changing its role as a theme index.
- **Interactive diagrams** — richer exploration of a single system's architecture, living within case studies rather than the landing page itself.
- **ADRs (Architecture Decision Records)** — a structured, browsable record of individual engineering decisions, complementary to the "Engineering Decisions" section already defined per case study in `26-CASE_STUDY_TEMPLATE.md`.
- **Project evolution views** — timelines showing how a system changed over time, extending the Project Library without altering the landing page's role as a preview of it.
- **Infrastructure views** — deployment and infrastructure visualizations tied to specific case studies, surfaced as an additional depth layer beneath Featured Case Studies or the Project Library, never as a new top-level landing page section.
- **Engineering metrics** — quantitative summaries (e.g., performance or reliability outcomes) that could enrich Engineering Lessons without changing its position or purpose in the page's narrative.
- **Shared engineering taxonomy** — Architecture Highlights' themes evolving into a taxonomy shared with the Knowledge Library, so a theme like Distributed Systems surfaces both related articles and related case studies from a single hub (see Section 4).
- **Engineering Collections** — grouping multiple related case studies into one larger engineering narrative that spans several parts. For example:

  ```
  Building VaultPay
          │
          ▼
  Part 1 — Architecture
          │
          ▼
  Part 2 — Transactions
          │
          ▼
  Part 3 — Observability
          │
          ▼
  Part 4 — Production Lessons
  ```

  This is not a new content type — a Collection would be a higher-level organization of existing case studies, each of which remains a complete, independently readable entry in the Project Library. A Collection simply asserts that several case studies belong to one continuous engineering story and should be read in sequence.

Each of these deepens an existing section rather than introducing a new one. The seven-section structure defined in Section 1 of this proposal is expected to remain stable through all of them.

---

# Summary

The Engineering Work Landing page exists to answer one question — *what kind of engineering work does this engineer do* — through a single, deliberate reading path: state a philosophy, prove it with featured evidence, demonstrate its consistency through recurring themes, offer the full archive to the convinced reader, synthesize what was learned, and hand the reader onward.

Every section exists because the section before it created the question the next section answers. Visual emphasis follows engineering weight, not content volume. The structure is sized to argument, not to archive size, which is what allows it to remain unchanged from five projects to a hundred, governed by the principle that growth should deepen relationships rather than complicate navigation. And at every point where this page could either explain a concept or point to where the concept is already explained — the Knowledge Library — or where it could either narrate the discovery process or point to where that process already lives — Engineering Logs — it should choose to point rather than duplicate.

Two disciplines protect this from drifting over time. First, there is exactly one source of truth for projects — the Project Library — and every other view of a project, whether Featured or (eventually) grouped by theme, is a lens over that one record rather than a second dataset. Second, every onward recommendation, in Continue Exploring above all, must be earned by something the reader just encountered on the page — never offered as generic, unrelated content.

This proposal introduces no parallel experience. It is a detailed specification of the landing page already outlined in `25-WORK_EXPERIENCE.md` and `27-WORK_EXPERIENCE_DESIGN.md`, refined through architecture review, and ready for Task 5.1 implementation.
