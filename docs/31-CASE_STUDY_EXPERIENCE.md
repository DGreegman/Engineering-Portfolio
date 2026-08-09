# 31 — Case Study Experience

> A design proposal for `/work/[slug]` — reading an engineering account, not a project page.

**Status:** Proposal — awaiting review and approval. No implementation is included in or authorized by this proposal (Task 5.3).

**Revision note:** This draft incorporates the refinements from the first Architecture Review — establishing the Case Study as the canonical engineering document (Purpose), stating Problem and Constraints as the two halves of one cause and adding an explicit Traceability chain (Section 4), elevating Validation's architectural role as evidence rather than narration (Section 4), stating Previous/Next's governing rule as "most meaningful continuation," not recency (Section 7), documenting Related Knowledge's future evolution into a resolved relationship (Section 5), stating the Project Header's explicit question set and adding Difficulty to its metadata vocabulary (Section 3), closing Scalability with a "deepen, not widen" principle (Section 9), and adding the Engineering Decision Timeline as a future capability (Section 10).

---

# Purpose

Every page in the Engineering Workspace answers exactly one question. The Case Study answers:

> **How was this engineering problem solved?**

Where the Work Landing (Task 5.1) argues *what kind of engineer this is*, and the Case Study Library (Task 5.2) lets a reader *find* a specific piece of work, the Case Study is where the actual account gets told — the destination those two pages exist to lead a reader toward. Its design should optimize for **engineering credibility retained after the reader leaves** — does the reader now believe this person makes sound decisions under real constraints — not time-on-page, visual polish, or any other engagement proxy a portfolio site would chase.

## A terminology choice, deliberate throughout this proposal

Per this task's own instruction, this document distinguishes three things that are easy to blur together:

- **Documenting engineering work** — the neutral record of what was built and why.
- **Explaining engineering decisions** — the reasoning behind specific choices, including the ones that weren't obvious in advance.
- **Presenting software** — screenshots, feature tours, "what it does" marketing.

A Case Study is the first two. It is explicitly *not* the third. `25-WORK_EXPERIENCE.md` already states this as a founding constraint ("avoid... feature lists, marketing language, unnecessary screenshots, technology logos without context"); this proposal's entire reading-experience design exists to make that constraint hold structurally, not just editorially — a section order and visual hierarchy that make it *harder* to write a feature-tour case study by accident, not merely a style guide asking authors not to.

## The Case Study Is the Canonical Engineering Document

One architectural statement governs everything else in this proposal, extending `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md`'s own "canonical browsing surface" principle one level deeper: **the Case Study is the canonical document for documenting engineering work.** Not "a" record of how a problem was solved — "the" one. The Work Landing, the Case Study Library, Engineering Logs, and Knowledge articles may all reference a case study — a Featured entry, a Library listing, a "Related Case Study" link, an Engineering Log entry pointing at the account it eventually became — but none of them should duplicate its engineering narrative. A Landing summary stays a one-line challenge statement; a Library entry stays title, domain, and status; neither should grow into a second, competing account of the decisions themselves. If a fact about *how* a problem was solved needs to be said, it belongs here, once. This is `24-ENGINEERING_PRINCIPLES.md` Principle 3 (Single Source of Truth) applied to the narrative itself, not just to the data behind it — the same discipline `docs/30`'s opening section already established for browsing, now established here for the account of the work itself.

This proposal is written to become `docs/31-CASE_STUDY_EXPERIENCE.md` in this repository's documentation-first workflow, following the exact role `docs/20-ARTICLE_EXPERIENCE.md` played for the Knowledge Article: it does not compete with `docs/26-CASE_STUDY_TEMPLATE.md` — that document defines what a *writer* produces (content structure, writing/code guidelines, Definition of Done); this proposal defines what a *reader* experiences (document structure, layout, navigation) around that content. Section 1 maps the two onto each other explicitly, the same way `docs/20`'s own Section 1 did for `docs/18`.

---

# A note on scope: this proposal assumes existing infrastructure, not a blank slate

Task 4.3 (the Engineering Article Experience) is complete and live at `/knowledge/[slug]`. Its components already exist, are already generic where genericity was designed in, and this proposal reuses them by name rather than re-specifying equivalents:

| Already implemented | Where | What it means for this proposal |
|---|---|---|
| `DocumentLayout`'s slot-based skeleton | `components/content/document-layout.tsx` | The same skeleton — breadcrumb, header, optional banner, TOC + body, closing relationship sections, sequential navigation — extends to the Case Study; no second layout primitive is needed. |
| `Breadcrumb` | `components/navigation/breadcrumb.tsx` | Already generic (`items`/`current` label/href pairs) and its own docstring already names "Work case studies" as an intended future consumer. Zero changes needed to reuse it here. |
| `TableOfContents` + `ActiveSectionTracker` | `components/content/table-of-contents.tsx` | Fed by the same `extractHeadings()` a case study's MDX body produces exactly like an article's does — the mechanism doesn't know or care which collection the document belongs to. |
| `ArticleBody`'s MDX pipeline (`MDXContent`, `getMdxComponents()`) | `components/content/article-body.tsx`, `mdx-components.tsx` | The same rendering pipeline, the same registered component map — a case study's MDX body is not a different kind of document from a rendering standpoint. |
| The `Callout` family (`key-insight`, `best-practice`, `trade-off`, `security`, `performance`, `common-mistake`, `warning`) | `components/content/callout.tsx` | Directly reusable as authored today — `docs/26-CASE_STUDY_TEMPLATE.md`'s "Trade-offs," "Engineering Decisions," and "Lessons Learned" sections map onto existing variants without inventing new ones for this task. |
| Code block, copy button, syntax highlighting | `components/content/code-block.tsx`, `copy-button.tsx`, `lib/content/highlight.ts` | `docs/26`'s "Code Guidelines" ("illustrate architectural concepts... demonstrate best practices") has the identical code-experience needs `docs/18`'s Article Template already does. |
| Relationship resolution seam (`resolveRelated`, `resolvePreviousNext`, etc.) | `lib/content/relationships.ts` | The pattern — resolve once, render many, never duplicate resolution logic in a component — extends directly; only the specific relationships resolved differ (Section 5–7). |
| `lib/content/work.ts`'s resolvers (`getProjectLibrary`, `getEngineeringThemes`, `getCaseStudyLibrary`) | `lib/content/work.ts` | Already the single source of truth for every case study record and the theme vocabulary this proposal's navigation (Section 7) depends on — nothing here is re-derived. |

Nothing in this proposal asks for a second document layout, a second MDX pipeline, a second relationship-resolution pattern, or a second Callout system. It is a presentation-layer and information-architecture proposal on top of infrastructure that already exists and, in `Breadcrumb`'s case, was explicitly built anticipating this exact reuse.

---

# 1. Information Architecture

## Complete top-to-bottom document structure

```
┌─────────────────────────────────────────┐
│ Breadcrumb                               │  Where am I?
│   Work → Case Study Library → Title      │
├─────────────────────────────────────────┤
│ Project Header                           │  What was built? Should I read this account?
│   Title · Summary · Metadata row         │
│   (domain, status, timeline, difficulty) │
├─────────────────────────────────────────┤
│ Table of Contents                        │  What's the shape of this account?
│   (sticky rail on desktop, collapsible   │
│   summary on mobile/tablet)              │
├─────────────────────────────────────────┤
│ Case Study Body (MDX)                    │  The engineering account itself.
│   Executive Summary                      │
│   Project Context                        │
│   The Problem                            │
│   Constraints                            │
│   Requirements                           │
│   Investigation                          │
│   Architecture                           │
│   Engineering Decisions                  │
│   Implementation                         │
│   Validation                             │
│   Challenges Encountered                 │
│   Trade-offs                             │
│   Outcome                                │
│   Lessons Learned                        │
│   Future Improvements                    │
├─────────────────────────────────────────┤
│ Related Knowledge                        │  What concepts does this apply?
├─────────────────────────────────────────┤
│ Related Engineering Logs                 │  What process led here?
├─────────────────────────────────────────┤
│ Previous / Next Case Study               │  Continue the sequence.
└─────────────────────────────────────────┘
```

The Case Study Body's fifteen sections are `docs/26-CASE_STUDY_TEMPLATE.md`'s own "Frontmatter" through "Future Improvements" structure, rendered verbatim in the order that document already specifies — this proposal does not reorder, rename, or add to that list, the identical discipline `docs/20`'s Section 1 held toward `docs/18`'s nine-part Article Structure. Everything above and below the body is the *reading experience* wrapped around content the writer already knows how to structure.

This resolves an apparent tension worth naming directly: `docs/27-WORK_EXPERIENCE_DESIGN.md`'s own "Case Study Experience" section lists Executive Summary through Lessons Learned as flat, individually-named steps in its reading journey, rather than one collapsed "body" node. That flat list and this proposal's nested one describe the same structure at two levels of resolution — `docs/27` was naming the engineering *narrative arc* (this proposal's Section 4 does the same work in prose); this proposal is additionally naming the *architectural* regions (chrome vs. body) the way `docs/20` did for the Article, because that distinction is what determines which parts are reusable infrastructure (Breadcrumb, TOC, closing navigation) and which parts are `docs/26`'s own content. Nothing about `docs/27`'s sequence is contradicted — it is fully preserved as the internal order of the one "Case Study Body" region.

## Why each section exists

**Breadcrumb.** Answers "where am I" before anything else loads — `Work → Case Study Library → Title`. Naming the Library as the middle segment, not the Work Landing, is deliberate: `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md`'s opening statement establishes the Library as "the canonical browsing surface for engineering work," so the breadcrumb's ancestry should reflect the page a reader would actually browse back to, not the page that merely introduces the section.

**Project Header.** The document's admission decision point — the Case Study equivalent of `docs/20`'s "Article Header." A reader should determine "is this the account I'm looking for?" in seconds: title, one-line challenge summary (not a product description — the same discipline `FeaturedCaseStudies`/`EngineeringCaseStudies` already established at the Landing and Library level), and a metadata row. See Section 3 for exactly which metadata replaces the Article's `difficulty`/reading-level framing.

**Table of Contents.** A case study is longer and more structurally complex than a typical Knowledge article — fifteen body sections against `docs/18`'s nine — making a map of the terrain, per `docs/20`'s own reasoning, *more* necessary here, not less. `docs/27` doesn't name this explicitly in its flat reading-journey list, the same way `docs/18` never had to ask for one either; this proposal adds it as reused reading-navigation infrastructure (`docs/22-COMPONENT_ARCHITECTURE.md`'s "Reading Navigation... page-local"), not as a reinterpretation of the approved journey.

**Case Study Body.** The account itself — `docs/26`'s fifteen-part structure exists specifically to build engineering credibility progressively (context → problem → constraints → investigation → architecture → decisions → implementation → validation → challenges → trade-offs → outcome → lessons), so this proposal's only job here, exactly as `docs/20`'s was for the Article Body, is to render it without getting in its way.

**Related Knowledge.** Prevents the case study from being a dead end in exactly one direction: concepts. Distinct from Related Engineering Logs (below) on purpose — see Section 5.

**Related Engineering Logs.** Prevents the case study from being a dead end in the other direction: process. See Section 6 for why this is architecturally separate from Related Knowledge rather than merged into one "Related" section the way the Article's four groups share one heading.

**Previous/Next Case Study.** *Sequential* movement through the Library's own ordering — see Section 7 for the exact precedence, which intentionally differs from the Article's.

No Author Footer, no Series Banner equivalent: `docs/22`'s `DocumentLayout` already omits an Author Footer slot ("no later task's scope has called for it"), and this proposal doesn't introduce one for the Case Study either, for the identical reason. A Series-Banner equivalent — "this case study is part of a larger, multi-part account" — is real future scope (`docs/29-WORK_LANDING_PROPOSAL.md` §10's "Engineering Collections") but explicitly future; see Section 10.

## Why the order matters

The order moves from **orientation → admission decision → map → context → problem → reasoning → evidence → reflection → onward**. Each step is only legible once the previous one has landed:

- A reader can't evaluate the Project Header's claims without knowing where they are (Breadcrumb).
- The Body's Problem/Constraints sections are unreadable as *engineering* content (rather than backstory) without the Project Header having already established what was actually built.
- Engineering Decisions and Trade-offs are meaningless without Architecture already having established the system those decisions were made inside.
- Validation and Outcome only carry evidentiary weight once a reader has seen the Trade-offs that were accepted to get there — evidence without visible trade-offs reads as marketing, exactly the failure mode this proposal exists to avoid.
- Lessons Learned only generalizes correctly once a reader has followed the specific reasoning that produced it — this is the same "evidence before synthesis" logic `docs/29`'s own Reading Journey used for the Work Landing's Engineering Lessons section, now applied within one document instead of across a whole page.
- Related Knowledge and Related Engineering Logs only make sense as *next steps* once the reader has finished forming an opinion about this account — offering them earlier would interrupt the account with exits before it's made its case.

---

# 2. Reading Journey

The reading journey mirrors `docs/20`'s Article journey structurally — orientation, low-cost admission decision, then escalating engineering depth — but the escalation curve is different in kind, not just content, because a Case Study builds toward *credibility*, not *comprehension*.

1. **Arrival and orientation.** Breadcrumb and Project Header answer "where am I" and "what is this" in the time it takes to glance, not read.
2. **The map.** The Table of Contents previews the account's shape — a reader can already tell from the headings alone whether this is a data-consistency story, a scaling story, or a security story, before committing to read linearly.
3. **Context becomes a real problem.** Project Context and The Problem convert an abstract "this person built X" into a concrete, evaluable engineering challenge — the exact moment a skimming reader either commits to reading or leaves, the same threshold `docs/20` identified for an Article's Header.
4. **Constraints and Requirements ground the challenge in reality.** A reader's next question after "what was the problem" is naturally "why wasn't the obvious answer available" — Constraints and Requirements answer that before Architecture arrives, so the architecture that follows reads as *earned*, not asserted.
5. **Investigation shows the thinking before the decision.** This is the section an engineering reader specifically looks for and a marketing page never includes — evidence that alternatives were actually considered, not just the winning option presented as inevitable.
6. **Architecture and Engineering Decisions are the credibility peak.** This is where a reader forms their real opinion of the engineer, per `docs/26`'s own framing ("this section forms the architectural heart of the case study"). Everything before this section existed to make these decisions legible; everything after exists to prove they held up.
7. **Implementation and Validation supply evidence, not narration.** A reader who trusts the decisions now wants proof they worked — Implementation shows the approach became real, Validation shows it was actually checked, not assumed.
8. **Challenges and Trade-offs supply honesty.** A case study that skips this reads as promotional; naming what went wrong and what was knowingly given up is what separates documentation from marketing, per this proposal's opening distinction.
9. **Outcome closes the account with evidence, and Lessons Learned generalizes it.** The reader who has followed the whole arc is shown the payoff and, more importantly, what of this generalizes beyond this one project — the same "synthesis, not just archive" role Engineering Lessons plays on the Work Landing (`docs/29` §1), now scoped to one project instead of the whole body of work.
10. **Related Knowledge and Related Engineering Logs hand curiosity off, in two different directions.** A reader whose curiosity is now conceptual goes to Knowledge; a reader curious about the messy process behind the polished account goes to Engineering Logs. See Sections 5–6 for why these stay separate.
11. **Previous/Next continues the sequence** for a reader who arrived here from the Library and wants to keep going rather than back up to browse again.

At every step, a reader who stops reading should still have learned something true and specific about how this engineer works — the same "leave with something even from a partial read" standard `docs/20`'s Reading Journey held itself to.

---

# 3. Relationship with the Article Experience

The Case Study Experience is a sibling of the Article Experience — same architectural family, same reading-navigation infrastructure, different subject and different narrative shape. This section documents both halves explicitly, per this task's own instruction not to leave the boundary implicit.

## What Reuses the Article Experience, Unmodified

- **`DocumentLayout`'s slot skeleton.** Breadcrumb → header → (optional banner) → TOC + body → closing relationship section(s) → sequential navigation. The Case Study fills the same slots; it does not need a second layout component.
- **`Breadcrumb`.** Already generic, already documented as intended for this exact reuse.
- **`TableOfContents` + `ActiveSectionTracker`.** Identical mechanism — heading extraction, sticky rail on desktop, collapsible summary on mobile, scroll-driven `aria-current` — because a case study's MDX body produces the same `Heading[]` shape an article's does.
- **The MDX rendering pipeline and component registry.** `ArticleBody`'s approach (compile MDX server-side, pass a registered component map) doesn't know or care which content collection it's rendering for.
- **The `Callout` family, as-is.** `docs/26`'s Trade-offs, Engineering Decisions, and Lessons Learned sections map onto existing variants (`trade-off`, `key-insight`, `security`, `performance`, `common-mistake`) without needing new ones for this task. (A future `decision`-shaped variant, Context/Decision/Consequences/Alternatives, was already named as a direction in `docs/20` §5 but never shipped in the current seven-variant set — worth noting as a natural extension point for whoever authors real case study MDX content, not something this proposal designs.)
- **Code experience** (code blocks, copy button, syntax highlighting) — identical needs, identical components.
- **Content width, typography scale, spacing rhythm.** `ReadingContainer`/`max-w-reading`, the existing `text-h1`–`text-body` scale, the existing `Section`/`STACK_GAP` rhythm — no new tokens, matching `docs/20` §2–3's own "reuse without exception" stance.
- **Accessibility discipline.** Exactly one `<h1>`, labeled `<nav>` landmarks per navigation region, `aria-current` never moving keyboard focus, color-contrast-safe tokens — the identical standard, not a relaxed one for Work content.

## What Intentionally Differs

**The header's metadata vocabulary.** An Article's `difficulty` field answers "how hard is this to learn" — a property of the *reader's* effort. A case study's `Difficulty` field (`docs/26`'s own frontmatter) answers a different question: how hard was the *engineering challenge itself*, independent of how hard the account is to read. Its Project Header should surface **Domain, Status, Timeline, and Difficulty** (per `docs/26`'s own frontmatter, and — for Domain and Status — the identical vocabulary `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md`'s Browse Lenses already established) — not a parallel, invented vocabulary, the same collection's own facets reused at the document level, continuing the single-source-of-truth discipline that already threads through the Landing, the Library, and now the document itself.

Stated as an explicit design rule rather than left to inference: **the Project Header should answer "what was built," "why was it built," and "how difficult was the engineering challenge" — never "which technologies were used."** The first three are what let a reader decide whether this account is relevant to them before committing to read it — the same admission-decision role `docs/20` assigns the Article Header. Technology is a supporting fact about the account, not part of its identity: `docs/25-WORK_EXPERIENCE.md`'s own rejection of "technology logos without context" is a header-design rule as much as a body-content one. A technology list belongs in the quiet metadata row alongside Timeline — present, honest, never elevated to the same visual or narrative weight as what the problem was or why it mattered.

**The closing relationship sections split in two, on purpose.** An Article has one "Related Learning" section grouping four kinds of relationship (Prerequisites, Continue Learning, Related Concepts, Same Topic) under one heading, because all four answer variations of the same question: *what else should I read to understand this concept.* A Case Study's two closing relationships — Related Knowledge and Related Engineering Logs — answer genuinely different questions (*what concept does this apply* vs. *what process produced this*), and `docs/26` itself already treats them as two named sections, not sub-groups of one. Merging them into a single "Related" heading the way the Article does would flatten a distinction `docs/25`/`docs/26`/`docs/27` all independently treat as load-bearing (Section 5–6 below). This is the single most important intentional structural difference in this proposal.

**Previous/Next's precedence logic differs.** An Article's precedence is Series → same Topic → global chronological order, ending in a "never nothing" chronological fallback. A Case Study should never fall back to raw chronology, because `docs/30` §3 already established that a case study collection's default order communicates *engineering significance*, not authoring convenience — falling back to "whatever was published last" for Previous/Next would quietly reintroduce the convenience-based ordering `docs/30` explicitly rejected. See Section 7 for the Case Study's own precedence.

**No Series Banner in current scope.** An Article's Series Banner is real, shipped functionality. A Case Study's nearest equivalent — a multi-part "Engineering Collection" — is documented future scope only (`docs/29` §10). This proposal deliberately does not build a placeholder banner for it now.

**Rhetorical job of the opening body section differs, inside a reused slot.** An Article's Introduction motivates an abstract concept ("why should you care about this idea"). A Case Study's Executive Summary — same architectural position, top of the body — instead previews a resolved, concrete situation (problem → approach → outcome) per `docs/26`'s own definition, so a reader who reads nothing else still knows what happened. Same slot, different job — not a difference in structure, a difference in what the writer is asked to do with it.

**The standard of evidence is higher for closing claims.** An Article's Key Takeaways can responsibly state general principles. A Case Study's Outcome section should state *measurable* results where possible (`docs/26`: "include measurable outcomes whenever possible") — this doesn't change any component, but it is a real difference in what "done" looks like for the section occupying an otherwise identical position in the document.

Where the Article optimizes for comprehension of an idea, the Case Study optimizes for credibility of a decision-maker — same skeleton, same reading-navigation muscles, a narrative shape built for evidence and reasoning rather than concept-teaching. This is what makes Work feel like a sibling of Knowledge, not a re-skin of it.

---

# 4. Engineering Narrative

`docs/26-CASE_STUDY_TEMPLATE.md`'s fifteen sections are not a checklist to fill independently — they build a single argument, and the order exists to make that argument sound rather than merely complete.

- **Problem** establishes that a real, nontrivial engineering challenge existed — without this, everything after reads as solving a problem nobody had.
- **Constraints** convert "the problem" into "the problem *as it actually had to be solved*" — time, budget, existing systems, team size. This is what makes later trade-offs legible: a decision only makes sense relative to what constrained it.
- **Architecture** proposes the shape of a solution — this is deliberately positioned *before* Engineering Decisions, not after: a reader needs the system's shape in view before individual decisions inside it will make sense.
- **Engineering Decisions** is the section `docs/26` itself calls "the architectural heart" — each decision paired with its alternatives, trade-offs, and rationale. This only works because Architecture already gave the reader a system to hang each decision on.
- **Trade-offs** (the dedicated section, distinct from the trade-offs already discussed per-decision above) names the compromises accepted *overall* — the difference between "this decision had a trade-off" and "here is what this whole project gave up to gain what it gained." Both levels matter; `docs/26` keeps them as two different sections for exactly this reason, and this proposal preserves that distinction rather than collapsing it.
- **Implementation** shows the architecture and decisions becoming a real system — positioned after decisions, not before, so a reader already understands *why* before seeing *how*, the same "explain before demonstrating" principle `docs/18`'s Writing Guidelines already establish for Articles, applied here to systems instead of concepts.
- **Validation** supplies evidence that the implementation actually does what was claimed — this section is what separates "we built X" from "we built X and confirmed it works," and its position (after Implementation, before Outcome) means a reader sees the proof before the payoff, not the other way around. See "Validation as Evidence, Not Narration" below for why this section's architectural role is stronger than its position in the list alone suggests.
- **Lessons Learned**, positioned last in the substantive narrative, generalizes what the whole preceding argument demonstrated — reusable insight, not project trivia, mirroring exactly the framing `docs/29-WORK_LANDING_PROPOSAL.md` §1/§6 already established for Engineering Lessons at the Work Landing level, now scoped to the one project that produced it.

Two sections deserve a note on where they sit without disrupting this arc: **Requirements** and **Investigation** sit between Constraints and Architecture as the last preparatory beats — Requirements makes explicit what the system had to do (functional and engineering requirements, per `docs/26`), Investigation shows the discovery work that happened before a decision was made, so Architecture doesn't appear to spring from nowhere. **Challenges Encountered** sits between Validation and Trade-offs as the honest record of what went wrong along the way — distinct from Trade-offs (which are *accepted* compromises) and distinct from Constraints (which were known *in advance*); Challenges are what wasn't known until the work was underway.

## Problem and Constraints: Two Halves of One Cause

Worth stating as its own architectural note rather than leaving implicit: **Problem defines what needed solving. Constraints define the environment in which the solution had to exist.** Neither is sufficient alone — a problem without constraints reads as an abstract puzzle with one obvious best answer; constraints without a stated problem read as arbitrary limitations with nothing to justify them. Together, they are the complete cause every later engineering decision must trace back to. Every decision documented in Engineering Decisions, every compromise named in Trade-offs, and every choice explained in Architecture should be explainable by pointing back at Problem, Constraints, or both — a decision that can't be traced to either is a sign the account is missing something, not a sign the decision was self-evidently correct.

## Traceability

The Article Experience's own strength — `docs/20`'s implicit chain from a stated question to its answer — is worth making an explicit design rule here rather than leaving it as a property that happens to emerge from good writing. Every Case Study should be traceable along one continuous chain:

```
Problem
   ↓
Architecture Decision
   ↓
Implementation
   ↓
Validation
   ↓
Outcome
```

Every implementation choice should be explainable by a preceding engineering decision; every engineering decision should be explainable by the problem and constraints that motivated it. This is not a new section or a new component — it's a reading-experience *test* this proposal's existing section order already exists to satisfy: if a reader can point to any sentence in Implementation and ask "why this way," the answer should already have been given earlier in the document, in Architecture or Engineering Decisions, not asserted for the first time at the point it's used. Section order alone can't guarantee an author writes this way, but an order that puts decisions strictly before the implementation and validation that depend on them is what makes writing this way the path of least resistance rather than something an author has to fight the structure to achieve.

## Validation as Evidence, Not Narration

Validation's position in the list above understates its architectural weight, so it's worth stating directly: **Validation is the evidence that the engineering decisions actually worked. Without validation, Implementation remains a claim, not a demonstrated fact.** This is the documentation-first philosophy (`24-ENGINEERING_PRINCIPLES.md` Principle 10, "Measure Before Changing... prefer measurements, benchmarks... avoid changing architecture based solely on intuition") applied to the reading experience itself: a case study that moves from Implementation straight to Outcome without Validation in between is asking a reader to trust an unverified claim exactly where the account should be at its most rigorous. Validation is what converts "this is what we built" into "this is what we built, and here is how we know it does what we said" — the hinge the entire second half of the traceability chain above depends on.

The throughline: every section either **raises a question** (Problem, Constraints, Requirements) or **answers one already raised** (Architecture answers "what shape," Decisions answer "why this shape specifically," Validation answers "did it actually work," Lessons Learned answers "what does this teach beyond itself"). A reader should never encounter a section whose reason for existing at that point isn't already obvious from what came before it.

---

# 5. Relationship with Knowledge

Related Knowledge exists to answer one question: *what engineering concepts does this account depend on, that are already explained elsewhere?* It must never become a second place those concepts get explained.

- **Point, don't duplicate.** If Engineering Decisions references idempotency, optimistic locking, or CQRS, the case study links to the existing Knowledge article the first time the concept is substantively used — it does not re-teach the concept inline. This is `24-ENGINEERING_PRINCIPLES.md` Principle 3 (Single Source of Truth) applied at the sentence level, not just the page level.
- **This is the payoff of the Work Landing's own Engineering Lessons bridge.** `docs/29` §6 established that "not every lesson becomes an article, but every article may originate from one of these lessons." A concept a case study leans on may already be a Knowledge article precisely *because* an earlier case study's lesson graduated into one — Related Knowledge is where that becomes visible to a reader, closing a loop `docs/29` only described in the abstract.
- **Rendered as resolved summaries, not raw links.** Following `docs/20` §4's own precedent for Related Concepts (compact previews, not bare inline links, capped at a small number regardless of how many a well-connected case study accumulates), so a reader can judge relevance before clicking, and a long-lived, heavily-referenced case study never renders an unbounded list.
- **Never fabricated.** A concept only gets linked if a real Knowledge article exists for it — an unlinked concept is left as prose, exactly as `docs/20`'s relationship resolution already treats an unresolved reference (visible, honest, never a broken or invented link).

## Future Note: From Editorial Links to a Resolved Relationship

Documented as a future architectural direction only — no implementation required now. Today, Related Knowledge is expected to be editorial: an author hand-links a concept to the Knowledge article that explains it, the same way `docs/26`'s frontmatter already anticipates (`Related Knowledge`). Long term, this should become a *resolved* relationship rather than a set of hand-maintained links, following the same shape `lib/content/work.ts`'s `getEngineeringThemes()` future-derivation note already commits to for themes:

```
Case Study
    ↓
Engineering Concepts
    ↓
Knowledge Articles
```

Concretely: once case studies and Knowledge articles share enough structured vocabulary (tags, concepts, or the same theme taxonomy `docs/29` §4 already names as a future direction), Related Knowledge's links could be derived from that shared vocabulary rather than authored by hand per case study — the same "resolve once, reuse everywhere" principle (`docs/22-COMPONENT_ARCHITECTURE.md`) already governing every other relationship in this workspace. This changes nothing about what a reader sees or what this section renders; it only changes what produces the list behind it, exactly the kind of change this proposal's resolver-boundary discipline (Section 3, `lib/content/work.ts`) is already built to absorb without a redesign.

---

# 6. Relationship with Engineering Logs

`docs/26`'s own closing diagram already states this relationship precisely: *"Knowledge provides theory. Work demonstrates application. Engineering Logs preserve discovery."* Related Engineering Logs exists to make that third leg visible from inside the account itself.

- **The Case Study is the destination; the Log is the journey.** `docs/27-WORK_EXPERIENCE_DESIGN.md`'s own diagram — Engineering Log → Experiment → Discovery → Case Study → Engineering Outcome — describes a timeline, not a hierarchy: the messy, uncertain version of a decision happened first, in a log; the polished, resolved version of that same decision is what Engineering Decisions or Investigation narrates here.
- **Links should be specific, not a general "see my logs" pointer.** A Related Engineering Log entry earns its place by being the actual log where a specific decision this case study describes was worked out — the same "contextual, never generic" discipline `docs/29` §4 required of the Work Landing's Continue Exploring, applied to a single relationship type instead of a whole section.
- **This is what keeps a case study honest rather than retrospectively tidy.** A polished Engineering Decisions section can read as though the right answer was obvious from the start. Linking to the log where it wasn't — where alternatives were actually tried and failed — is what lets a reader trust that the reasoning shown is real, not reconstructed after the fact.
- **Never merged into Related Knowledge.** See Section 3's "What Intentionally Differs" — concept and process are different questions, and collapsing them into one section would blur exactly the distinction this relationship exists to preserve.

---

# 7. Navigation

Four distinct paths forward, each answering a different question — a reader should always know which one they want before choosing it, not have to guess from an undifferentiated list.

| Path | Question it answers | Movement |
|---|---|---|
| **Related Case Studies** | What else demonstrates a similar engineering concern? | Lateral |
| **Related Knowledge** | What concept does this apply? | Outward, conceptual |
| **Engineering Logs** | What process produced this? | Outward, historical |
| **Previous / Next** | What's the next account in sequence? | Sequential |

**Related Case Studies.** Not a new relationship type to invent — it's `docs/30`'s own Architecture Highlights/Browse Lens theme and domain facets, applied at the document level instead of the Library level. A case study's "related" case studies are the other entries sharing its theme or domain, resolved from the exact same `getEngineeringThemes()`/`getProjectLibrary()` collections the Library already reads — one relationship, defined once, surfaced at two scopes (Library-wide browsing, single-document "you might also find this relevant"), the identical "resolve once, reuse everywhere" discipline `docs/22` requires.

**Related Knowledge** and **Engineering Logs** — see Sections 5 and 6.

**Previous/Next Case Study.** Precedence, most to least meaningful, deliberately different from the Article's (Section 3). Stated as a single governing rule before the precedence itself, so a future resolver has a test to build against rather than just a list to satisfy: **Previous/Next should represent the most meaningful continuation of engineering understanding — not simply the previous project created.** "Meaningful continuation" is the actual design constraint; the three-tier precedence below is one way of approximating it with what's resolvable today, not the definition of it. A future resolver is free to get better at approximating that same rule without this proposal's intent changing.

1. **Engineering Collection order**, once that future capability exists (`docs/29` §10) — the most intentional, author-defined sequence, exactly mirroring Series' role for Articles.
2. **Same-theme or same-domain adjacency**, using the Library's own significance-ordered collection (`docs/30` §3) — "next" means the next case study sharing an engineering concern, in the Library's own order, not by publish date.
3. **The Library's own default order**, as the last resort — never raw chronology, and never nothing (`docs/04-INFORMATION_ARCHITECTURE.md`'s "Dead-End Prevention" applies here exactly as it does for Articles), but ordered by whatever `getProjectLibrary()` returns, which `docs/30` §3 already commits to meaning engineering significance rather than authoring convenience.

Each tier is a progressively weaker proxy for "meaningful continuation," never a proxy for "recency" — this is the test a future implementation should apply if a fourth tier or a reordering of these three is ever proposed: does it get closer to *understanding* continuing meaningfully, or does it just make the resolver simpler to write.

All four paths appear after the reader has finished the account (Section 1's ordering rationale) — none of them interrupts the narrative arc Section 4 describes.

---

# 8. Visual Hierarchy

This section confirms and extends `docs/27-WORK_EXPERIENCE_DESIGN.md`'s own Visual Hierarchy, translated into reading-experience terms: engineering reasoning must visually outweigh implementation detail, which must outweigh promotional framing (which shouldn't exist at all).

**Highest emphasis**
- Problem, Architecture, Engineering Decisions — `docs/27`'s own highest tier, unchanged. These are rendered as plain, unembellished prose at full reading width — no callout treatment, no card — because they *are* the document, not an aside to it.

**Secondary emphasis**
- Implementation, Validation, Trade-offs — real content, rendered with the same prose treatment, but positioned (per Section 4) after the reasoning that justifies them, so a skimming reader's eye lands on decisions first even without deliberate visual weighting.
- Callouts (Trade-off, Decision-adjacent, Security, Performance) — visually distinct enough to notice while skimming, per the existing `Callout` component's own restrained left-border-plus-label treatment, never louder than the surrounding prose it's annotating.

**Supporting emphasis**
- Metadata (Domain, Status, Timeline), the Table of Contents, and code blocks — present, legible, never competing with prose for attention. Code specifically: illustrative per `docs/26`'s Code Guidelines, not a wall of implementation dropped in place of explanation — the same "code exists to support the engineering narrative, not replace it" instruction `docs/26` already gives writers, reinforced here by never letting a code block visually dominate the section it sits inside.

**What should never gain emphasis at all:** technology-stack badges, screenshots of a working product, logos, or a "Live Demo" link treated as a primary action. `docs/25`'s explicit rejection of "unnecessary screenshots" and "technology logos without context" is a visual-hierarchy rule, not just a writing one — if a future case study includes a repository or live-demo link, it belongs in the quiet metadata row, at the same visual weight as "Timeline," never as a prominent button competing with the reasoning above it.

---

# 9. Scalability

**The Case Study document's scalability strategy is the same narrowness `docs/20` §8 established for the Article, restated for a different axis.** An Article's footprint stays bounded regardless of how many other articles exist. A Case Study's structural footprint — one header, one TOC, one linear body, three closing relationship sections, one prev/next pair — stays bounded regardless of *how large the engineering system it describes is.* The document never needs to represent the whole system; it needs to represent the account of building it.

**Small projects.** Some of `docs/26`'s fifteen sections may be genuinely short — a paragraph each for Constraints or Requirements on a small project is honest, not a gap. The section list and order stay identical regardless — consistency of structure across the whole library matters more than trimming sections to match project size, the same principle already established for Architecture Highlights and the Project Library at the collection level (`docs/30` §9: structure doesn't grow or shrink with content; only density does).

**Medium projects.** This is the shape the current fifteen-section structure and the current Callout/code/relationship infrastructure were designed around — no scalability pressure beyond what's already addressed.

**Large engineering systems.** Individual sections need *more internal structure*, not more top-level sections: Architecture may cover several subsystems, Engineering Decisions may enumerate many named decisions, Implementation may reference several components. The Table of Contents becomes essential exactly as `docs/20` argued for long Knowledge articles (Section 1, above) — a reader with prior context needs to jump straight to "Engineering Decisions" without paying a re-reading tax. Related Case Studies, Related Knowledge, and Related Engineering Logs may each have more candidates for a long-lived, heavily-referenced system — the same capped-list discipline `docs/20` §4/§8 and `docs/30` §9 both already apply (recommend 3–4 visible per group, regardless of how many relationships exist underneath) prevents any of the three closing sections from becoming an unbounded wall of links.

**What never changes:** the fifteen-section body order, the four-section top-to-bottom skeleton (Section 1), and the resolve-once relationship pattern. A large system's case study is a *denser* instance of the same document, never a structurally different one — the identical invariant `docs/20` §8 committed to for Articles, now committed to here for a different scaling axis (system complexity rather than library size).

## The Governing Principle

Closing this section with the same kind of single-sentence discipline `docs/29` §9 and `docs/30` §9 each closed theirs with: **increasing engineering complexity should deepen the document, not widen it.** A larger system earns richer reasoning and more evidence — more named decisions in Engineering Decisions, more measured results in Validation and Outcome, a longer but still single-column body — never more parallel navigation, a second TOC, an alternate layout for "big" case studies, or additional top-level sections invented to hold the overflow. This is the same invariant Section 9's opening paragraph states structurally, restated here as the test to apply whenever a future large case study seems to strain the format: the fix is always more depth within the existing fifteen sections, never a wider page.

---

# 10. Future Evolution

Documented as future possibilities only — none of the following are current scope, and several are already named, planned milestones in `docs/28-WORK_IMPLEMENTATION_PLAN.md` that this proposal must not preempt.

- **Architecture Decision Records (ADRs)** and **Infrastructure diagrams** — already `docs/28`'s own **Task 5.4 — Architecture Experience** ("Architecture diagrams, Decision Records, Trade-off sections, Engineering decisions"). This proposal's Engineering Decisions section (Section 4) and the `Callout` family's already-noted-but-unshipped `decision` variant (Section 3) are the natural seam Task 5.4 extends — this proposal deliberately leaves that extension point visible rather than building toward it now.
- **Engineering Decision Timeline** — distinct from Task 5.5's project timeline below: not a record of *when milestones happened*, but a visualization of *how the reasoning progressed*, e.g.:

  ```
  Problem Identified
          ↓
  Architecture Chosen
          ↓
  Trade-off Accepted
          ↓
  Implementation
          ↓
  Validation
          ↓
  Production Learning
  ```

  This sits naturally between Task 5.4's ADR work and Task 5.5's Project Evolution work — narrower than a full project timeline, but richer than a single ADR, it would visualize this proposal's own Traceability chain (Section 4) rather than replace it. Readiness: nothing about this proposal's section order or the traceability discipline in Section 4 needs to change for a future visualization to be built directly against it — the chain already exists in prose; this would only give it a visual form.
- **Timeline visualizations, production incidents, and deployment history** — already `docs/28`'s own **Task 5.5 — Project Evolution** ("Timeline, Milestones, Iterations, Engineering evolution, Future improvements"). `docs/26`'s existing "Challenges Encountered" section (prose only, today) is the natural precursor content Task 5.5 would eventually visualize — again, a seam left visible, not built.
- **Engineering metrics** — named as future scope in both `docs/25-WORK_EXPERIENCE.md` and `docs/29-WORK_LANDING_PROPOSAL.md` §10 already; a case study's Outcome section (Section 4) is where quantitative results already live in prose form today, and would be the natural home for a future structured metrics presentation.
- **Engineering Collections** (multi-part case studies) — `docs/29` §10's already-documented future capability; this proposal's Section 1 explicitly declines to build a placeholder Series-Banner equivalent for it now, and Section 7's Previous/Next precedence already reserves the top precedence slot for it once it exists, so adopting it later doesn't require renegotiating navigation precedence.
- **Related Case Studies becoming URL-addressable by theme/domain** — a direct extension of `docs/30` §4's own already-documented future filtering direction, now visible from inside a single document as well as from the Library.

Each of these deepens the four-section skeleton and fifteen-section body this proposal establishes, rather than replacing either — consistent with `24-ENGINEERING_PRINCIPLES.md` Principle 13 ("Incremental Evolution... additive whenever possible") and with how `docs/20` §9–10 treated its own future-evolution list for the Article Experience.

---

# Summary

The Case Study Experience exists to answer one question — *how was this engineering problem solved* — by building credibility through evidence and reasoning, not by presenting a finished product. It reuses the Article Experience's entire reading-navigation skeleton (`DocumentLayout`, `Breadcrumb`, `TableOfContents`, the MDX pipeline, the `Callout` family, code experience, typography, accessibility discipline) because a reading document is a reading document — and it deliberately diverges wherever the underlying content is a genuinely different kind of thing: a metadata vocabulary drawn from the Work collection's own facets, answering what was built, why, and how difficult the challenge was — never which technologies were used; two separate closing relationships (Knowledge, Engineering Logs) instead of one merged "Related Learning"; a Previous/Next precedence that represents the most meaningful continuation of engineering understanding rather than chronology; no Series Banner, because the Case Study's version of that capability doesn't exist yet.

`docs/26`'s fifteen-part body structure is treated exactly as `docs/18`'s nine-part structure was for the Article: given, not redesigned, and rendered inside a reading experience built to carry one continuous, traceable argument — Problem and Constraints as its cause, Architecture Decision as its response, Implementation and Validation as its proof, Outcome as its close — without ever letting implementation detail or promotional framing outweigh the engineering thinking that's the actual point of the page.

This document is also, by design, the single canonical record of that argument. The Landing, the Library, Knowledge, and Engineering Logs may all point to it; none of them should retell it.

This proposal introduces no parallel reading experience. It is the Work section's own instance of the exact architecture `docs/20-ARTICLE_EXPERIENCE.md` already proved out for Knowledge, extended — not copied — to fit a document whose job is to demonstrate engineering judgment rather than teach a concept, ready for architecture review ahead of Task 5.3 implementation.
