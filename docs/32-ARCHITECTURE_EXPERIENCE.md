# 32 — Architecture Experience

> A design proposal for deepening `/work/[slug]`'s existing Architecture, Engineering Decisions, and Trade-offs sections — not a new document.

**Status:** Proposal — awaiting review and approval. No implementation is included in or authorized by this proposal (Task 5.4).

---

## Core Principle

> **Architecture is evidence of engineering reasoning, not decoration.**

A diagram should explain a relationship. A decision should explain a choice. A trade-off should explain a consequence. The architecture experience should help the reader understand not only what the system looks like, but why it became that way. Every recommendation in this proposal is a restatement of this one sentence applied to a specific question.

---

# Purpose

The Case Study answers *"how was this engineering problem solved"* (`docs/31-CASE_STUDY_EXPERIENCE.md`). The Architecture Experience answers a narrower question inside that same document:

> **Why was this system designed this way?**

This is not a new document, not a new page, and not a new top-to-bottom region. `docs/31`'s approved structure — Breadcrumb → Project Header → Table of Contents + Reading Layout → Case Study Body → Related Knowledge → Engineering Logs → Previous/Next — is untouched by this proposal. The Architecture Experience lives entirely inside the Case Study Body, in sections `docs/26-CASE_STUDY_TEMPLATE.md` and `docs/31` already established: **Architecture**, **Engineering Decisions**, and **Trade-offs** are its home; **Constraints**, **Requirements**, and **Investigation** feed it; **Implementation**, **Validation**, **Challenges Encountered**, and **Outcome** supply its evidence. Nothing in this proposal adds a heading `docs/26` doesn't already have.

Task 5.3's own verification fixture (since removed, per its own instructions) already demonstrated most of what this proposal formalizes — a text-diagram inside the Architecture section, per-decision Alternatives/Trade-offs/Rationale structure inside Engineering Decisions, and `security`/`performance`/`trade-off` Callouts used contextually rather than as badges. This proposal names and extends that pattern deliberately rather than treating it as incidental.

---

# 1. Architecture Information Model

## What Belongs in the Architecture Layer

A fact belongs in the architecture layer if it describes **structure** (what the pieces are and how they relate) or **reasoning** (why the structure is shaped that way) — never if it merely describes an outcome or a starting condition.

| Category | Belongs where | Why |
|---|---|---|
| System boundaries | Architecture | What's inside the system's control and what's an external dependency is a structural fact, stated once, that every later decision refers back to. |
| Components and responsibilities | Architecture | The named parts and what each one owns — the vocabulary the rest of the document's reasoning depends on existing. |
| Data flow (shape) | Architecture | *What* moves where, and in what order or direction — a structural claim, distinct from *how* it's coded. |
| Communication patterns (sync/async, request-response, event-driven) | Architecture | A structural decision about how components relate, not an implementation detail of one component. |
| External dependencies | Architecture | Named as part of the system boundary; *why* a dependency was required belongs in Constraints, which Architecture responds to. |
| Infrastructure | Architecture, at summary level | Only as much as the story needs — see §14 for why a full infrastructure inventory doesn't belong here even at high complexity. |
| Failure boundaries | Architecture (as structure) + Validation/Challenges Encountered (as evidence) | Where a failure stops is a structural fact; whether it actually stopped there is evidence — see §7. |
| Security boundaries | Architecture (as structure) + Engineering Decisions (as specific choices) | Where trust changes hands is structural; how authentication/authorization was implemented is a decision — see §8. |

## What Does Not Belong in the Architecture Layer

- **Problem, Constraints, Requirements, Investigation** — these are *inputs* to architecture, not architecture itself. Architecture responds to them; it doesn't restate them. See §2 for the exact causal chain.
- **Implementation** — code-level realization. Architecture describes shape; Implementation describes how the shape was built. `docs/31` §4 already draws this line ("Architecture... proposes the shape of a solution... Implementation shows the architecture and decisions becoming a real system") — this proposal doesn't redraw it, only relies on it.
- **Validation, Outcome** — evidence *about* whether the architecture worked, not the architecture's own claims. The one exception, made explicit in §7: Validation is also where architectural resilience claims (failure handling, degradation) get demonstrated, which makes it architectural *evidence* without making it part of the architecture layer's own description.
- **Lessons Learned** — generalizes beyond the one project; architecture can be a *source* of a lesson, but the lesson itself belongs to `docs/31` §4's synthesis role, not to the architecture layer.

The one-sentence version: **Architecture is what was built and why it takes that shape. Everything before it in the document is what made that shape necessary; everything after it is proof of whether the shape held.**

---

# 2. Architecture Narrative

```
Problem
   ↓
Constraints
   ↓
Architectural Requirements
   ↓
Architecture
   ↓
Decisions
   ↓
Trade-offs
   ↓
Consequences
```

This chain is a **zoomed-in view of `docs/31` §4's own Traceability chain** (`Problem → Architecture Decision → Implementation → Validation → Outcome`), not a competing one. Where that chain moves across the whole document, this one stays inside the architecture layer specifically, unpacking what "Architecture Decision" actually contains. Two of its steps are worth naming explicitly because they don't map onto a `docs/26` heading of their own:

- **Architectural Requirements** is not a new section. It's the opening move of the Architecture section's own prose — the sentence or paragraph that translates "here is the problem and here is what constrained us" (already stated) into "here is what any acceptable design therefore had to satisfy." `docs/26`'s existing Investigation section (the discovery work before a decision) is where this translation is often visibly worked out; Architecture's opening is where it gets stated as a conclusion. Stated precisely, to keep it from blurring into the document's own **Requirements** section: **Requirements describe what the system needs to accomplish** (functional and engineering requirements, per `docs/26`'s existing section of that name); **Architectural Requirements describe the structural properties the architecture must satisfy as a consequence of those requirements and the stated Constraints** — a requirement says "the system must do X"; an architectural requirement says "therefore, the design must be shaped so that Y is true." The second is a narrative role Architecture's own opening plays, never a second Requirements list and never a schema field.
- **Consequences** is not a new section either. It's `docs/26`'s existing **Trade-offs** and **Outcome** sections, read together, from the architecture's point of view: Trade-offs is the consequence anticipated at decision time, Outcome is the consequence confirmed afterward. Both already exist; this chain just names the role they play when a reader is specifically tracing *why the architecture turned out the way it did*. See §5 for the exact line between the two, stated as a rule authors can apply directly.

## Why the Order Matters

Each step is illegible without the one before it:

- **Architecture** proposed without stated **Constraints** reads as one arbitrary shape among many — a reader has no way to judge whether it was a reasonable response to anything.
- **Decisions** made without an **Architecture** already on the page have no system to hang onto — "we chose row-level locking" means nothing until the reader knows which row, in which system, doing what.
- **Trade-offs** stated before the **Decision** they belong to reads as a list of downsides with no context for why they were accepted anyway.
- **Consequences** — the confirmation — mean nothing without the **Trade-offs** they're confirming or complicating. A reader needs to already know what was *expected* to give up before "here's what we actually got" carries any evidentiary weight.

This is the same "raise a question, then answer it" discipline `docs/31` §4 already established for the whole document, applied at the resolution the architecture layer itself needs.

---

# 3. Architecture Diagrams

## When a Diagram Is Useful

A diagram earns its place only when it compresses a **spatial, structural, or temporal relationship** that prose would need many sentences to describe with equal clarity — never because the page has room for one, and never as proof that "architecture happened."

| Diagram type | The question it answers | When it's actually useful |
|---|---|---|
| System context | What does this system talk to, and who initiates? | The system's external boundary has enough distinct parties (services, third parties, actors) that prose enumeration gets hard to hold in one's head. |
| Container/component | What are the pieces, and how do they relate structurally? | More than a handful of named components have non-trivial relationships to each other — below that, a sentence or two already does the job. |
| Data flow | What moves where, in what order or direction? | The *direction or sequencing* of movement is the actual point being made (e.g., "the notification never blocks the transaction" — a claim about order, not just participants). |
| Sequence | What happens, in what order, across one specific operation? | The *timing* or interaction order within a single request/operation is the point — distinct from data flow's structural shape; a sequence diagram answers "in what order do these calls happen," not just "what talks to what." |
| Deployment/infrastructure | How is this physically or operationally arranged? | The physical/operational topology materially changes the story (latency, failure domains, regional boundaries) — rare; most case studies won't need one unless infrastructure genuinely *is* the engineering challenge. |

## The Litmus Test

Before including a diagram, ask: **if this diagram were deleted and only the surrounding prose remained, would the reader lose real information, or only a picture?** If the answer is "only a picture," the diagram doesn't belong — this is the direct operational form of the Core Principle.

A second, complementary rule governs a diagram's *size* once it has passed that test: **prefer the smallest diagram that answers the architectural question.** A diagram that technically satisfies the litmus test but tries to also show every adjacent component, every fallback path, and every future consideration in one image has stopped answering one question and started being a gallery of one. Where a complex system tempts a single sprawling diagram, prefer several small, single-purpose ones — see §14 for how this holds even at high infrastructure complexity.

## Where Diagrams Live

Inside the sections they support — primarily Architecture (system context, container/component, data flow), occasionally inside a specific Engineering Decision or Implementation discussion when that one decision's mechanics are genuinely sequential (a sequence diagram scoped to one operation, not the whole system). Never their own section. Never a "Diagrams" heading. Never more than the story needs — a case study earns a second diagram by needing to answer a second, genuinely different question, not by wanting visual variety.

---

# 4. Diagram + Narrative Relationship

`docs/18-ARTICLE_TEMPLATE.md` already states the governing rule for this workspace's diagrams generally: *"Use a diagram when it improves understanding... Do not include diagrams that merely decorate."* This proposal doesn't invent a new principle for architecture diagrams — it applies that existing one at the resolution architecture needs.

## The Ordering Convention

A diagram should never appear cold. The convention:

1. **Prose frames the question** the diagram is about to answer, in a sentence, before the diagram appears.
2. **The diagram shows it.**
3. **Prose afterward interprets it** — what the diagram means for the decisions that follow — so the diagram's role in the argument is stated, not left for the reader to infer.

## Supporting Three Reading Modes

- **Text-first readers** must be able to understand the architecture from prose alone. Every diagram's essential content must already be stated in words somewhere adjacent to it — not as alt-text standing in for missing information, but as a real sentence carrying the same claim the diagram carries visually. No architectural fact should exist *only* inside a diagram. Stated as an explicit rule, not just an implication: **diagrams may summarize, compress, or clarify architectural information, but they must never be the sole authoritative representation of an architectural fact.** If a diagram were lost, corrupted, or simply skipped, the document's claims must still be complete from prose alone — the diagram is a second, denser rendering of a fact, never the fact's only record.
- **Diagram-first readers** (skimming visuals, jumping from diagram to diagram) must be able to follow the throughline from diagrams alone. Each diagram should be self-labeled enough — a caption or an adjacent heading naming what decision or relationship it illustrates — that a reader doing this doesn't need to reconstruct context from scratch at each one.
- **Readers who want both** are served by the ordering convention above: reading linearly, prose and diagram reinforce the same claim twice, at two densities, rather than the diagram introducing new information the prose never states.

This is the same "diagram-first, text-first, both" requirement `docs/20-ARTICLE_EXPERIENCE.md`'s progressive-disclosure principle already serves for a Table of Contents (structure disclosed without forcing linear reading) — applied here to a single diagram's relationship to its surrounding paragraph instead of a whole document's relationship to its own headings.

---

# 5. Architectural Decisions

`docs/26`'s existing Engineering Decisions section already defines a per-decision shape — **Decision, Alternatives Considered, Trade-offs, Rationale** — and Task 5.3's own verification fixture already authored real decisions in exactly this shape. This proposal extends that shape by two elements the task asks for, without introducing a new section or a full ADR system:

**The complete per-decision narrative arc:**

1. **The problem** this specific decision addresses — a sentence tying back to the case study's own Problem/Constraints, reinforcing the traceability chain from §2 at the decision level, not just the document level.
2. **Available options** — `docs/26`'s existing "Alternatives Considered."
3. **Chosen approach** — `docs/26`'s existing "Decision."
4. **Rationale** — `docs/26`'s existing "Rationale."
5. **Trade-offs** — `docs/26`'s existing per-decision "Trade-offs" (distinct from the project-level Trade-offs section — see §6).
6. **Consequences** — new: what actually happened as a result, once it could be observed. Stated as an explicit rule so authors don't accidentally write the same information twice under two headings: **a Trade-off is what the team knowingly accepted when making the decision; a Consequence is what resulted after the decision was implemented and observed.** A trade-off is written *at decision time*, in the language of anticipation ("this will cost us X to gain Y"); a consequence is written *after the fact*, in the language of confirmation ("this did cost us X" or "this turned out differently than expected"), and should reference Validation/Outcome where real evidence exists rather than restating the trade-off as if repeating it were the same as confirming it.

This is a **writing and structuring convention**, authored as prose and existing MDX structure (headings, the existing `Callout` component) within the Engineering Decisions section — not a new schema, not a new component, not a new page region.

## The Seam a Future ADR System Would Extend

`docs/20-ARTICLE_EXPERIENCE.md` §5 and `docs/31` §3 both already named a `decision`-shaped Callout variant as a direction, never shipped in the current seven-variant set (`key-insight`, `best-practice`, `trade-off`, `security`, `performance`, `common-mistake`, `warning`). This proposal doesn't design that variant — it names, again, that the six-part narrative arc above is exactly what such a variant would eventually need to structure (Context/Decision/Consequences/Alternatives, in `docs/20`'s own words).

A precise note on numbering, since it's easy to misread otherwise: `docs/28-WORK_IMPLEMENTATION_PLAN.md` lists "Decision Records" among **this same Task 5.4's** own named deliverables — it is not a separately-numbered future task. This proposal is Task 5.4's design stage, and per its own explicit instruction ("do not introduce a full ADR system yet... establish the architectural storytelling model that future ADR functionality can extend"), it deliberately delivers only the narrative model above, not the structured, addressable record system `docs/28` also lists under this task's name. The full ADR system therefore remains **unbuilt future work carried by Task 5.4's own deliverable list**, not a later, differently-numbered milestone — whatever implementation phase eventually completes it should treat this proposal's six-part arc as the model to formalize, not a separate, earlier draft to reconcile with.

---

# 6. Trade-offs

`docs/31` §3 already distinguishes two levels `docs/26` keeps as separate sections: a **per-decision** trade-off ("this specific choice had this specific downside") and the **project-level** Trade-offs section ("here is what this whole project gave up to gain what it gained"). This proposal adds one narrative requirement to both levels, not a new section:

Every significant trade-off's prose should communicate four things:

1. **What was gained.**
2. **What was sacrificed.**
3. **Why the trade-off was acceptable** *given the stated constraints* — tying back to §2's chain, a trade-off's acceptability is always relative to a specific constraint, never a general claim.
4. **Under what conditions the decision might change** — the one genuinely new expectation this proposal introduces. A trade-off stated without a boundary condition reads as a universal truth; naming the condition ("this holds as long as per-wallet write volume stays low; revisit past 10x") is what keeps the case study honest that the decision was right *for this system, at this scale, under these constraints* — not right in general.

This directly serves the task's own instruction to avoid presenting architectural decisions as universally correct, and extends `docs/26`'s existing Trade-offs section rather than adding to it structurally.

---

# 7. Failure and Reliability

Failure and reliability content is **evidence woven through existing sections**, not a dedicated section or page. The test: a reader should be able to answer *"what happens when this fails?"* for the system's significant components — from prose already present in Architecture, Engineering Decisions, Validation, and Challenges Encountered — without the document ever needing a "Failure Modes" heading.

| Concept | Where it lives | Why there |
|---|---|---|
| Failure boundaries, partial failure, degradation | Architecture | Structural facts about where a failure stops — "a Redis outage degrades to unduplicated retries, not downtime" is a statement about the system's shape. |
| Retries, timeouts, idempotency | Engineering Decisions | These are almost always the direct subject of a specific, nameable decision, not a background property. |
| Recovery | Challenges Encountered | What broke and how it was fixed is, by definition, a challenge the project actually faced. |
| Observability | Implementation (what's instrumented) + Validation (what the instrumentation showed) | Observability is a claim about evidence-gathering; it belongs with the evidence it produced. |

Task 5.3's own fixture already demonstrated this pattern without any dedicated reliability section: idempotency was a named Engineering Decision, a Redis-outage degradation mode was named in project-level Trade-offs, and a locking-order deadlock was documented in Challenges Encountered with its fix. This proposal formalizes that pattern as the expected default, not a new structure.

---

# 8. Security Architecture

The same "evidence woven through existing sections" model as §7, applied to security, with one explicit rule: **security must be contextual to this system, never a generic badge list.** "✅ HTTPS ✅ Encrypted at rest" states nothing about this system's actual reasoning and belongs nowhere in this document.

| Concept | Where it lives |
|---|---|
| Trust boundaries | Architecture — stated as structure ("the API gateway is the trust boundary; nothing behind it accepts unauthenticated requests"). |
| Authentication, authorization | Engineering Decisions — specific, named choices with alternatives and rationale, same as any other decision. |
| Sensitive data handling | Engineering Decisions or Trade-offs, wherever the specific handling choice was made. |
| Attack surfaces, defensive controls | Architecture (what's exposed) + Engineering Decisions (what was done about it). |

Task 5.3's fixture already used the existing `security` Callout variant exactly this way — a contextual note inside an Engineering Decision about idempotency-key scoping and expiry, not a standalone security summary. This proposal names that as the model: a security Callout should always be attached to the specific decision or architectural fact it qualifies, never floating as a general-purpose seal of approval.

---

# 9. Relationship with the Case Study

Task 5.4 adds no new document, no new route, no new `DocumentLayout` region. It deepens three sections `docs/31` already renders — Architecture, Engineering Decisions, Trade-offs — and draws evidence from four more that already exist — Constraints, Requirements, Investigation, Validation, Challenges Encountered, Outcome. The Case Study remains, per `docs/31`'s own opening statement, **the canonical engineering document**; the Architecture Experience is a lens applied to part of that document's existing content, not a second document competing with it, and not a new region for `DocumentLayout`, `ArticleBody`, `TableOfContents`, or any other Task 5.3 infrastructure to accommodate.

---

# 10. Relationship with Knowledge

```
Architecture Decision
        ↓
Engineering Concept
        ↓
Knowledge Article
```

The same "point, don't duplicate" discipline `docs/31` §5 and §10 already established, applied specifically to architecture vocabulary: when an Architecture or Engineering Decisions section names a concept that already has a Knowledge article (idempotency, CQRS, optimistic locking, a circuit breaker), the case study links to it — inline, the first time the concept is substantively used — rather than re-explaining it. No new infrastructure is needed: Task 5.3 already built both mechanisms this relies on — an inline MDX link (the existing `A` component) at the point of use, and the document-level Related Knowledge section (resolved from `relatedContent`) for concepts worth surfacing again at the close. The Case Study explains how the concept was applied *here*; the Knowledge Library explains the concept itself, once, for every case study that ever needs it.

---

# 11. Relationship with Engineering Logs

**Logs = discovery. Case Study = conclusion.**

The Investigation section is often where a case study's prose visibly summarizes what an Engineering Log originally recorded raw — "three approaches were prototyped" is the refined, conclusion-shaped version of what may have been several separate, messier log entries at the time. The architecture and decisions this proposal deepens are the *settled* reasoning; Engineering Logs (already connected via Task 5.3's Related Engineering Logs section) are where a reader goes to see that the reasoning wasn't obvious in advance — that alternatives were genuinely tried and genuinely failed, not narrated as inevitable after the fact. No new relationship type is needed here either: Related Engineering Logs already resolves `frontmatter.engineeringLog` against real log entries; this proposal's only addition is editorial guidance that a specific Engineering Decision, when it exists, is a natural candidate for that link — the decision is the conclusion; the log is where its discovery lives.

---

# 12. Visual Hierarchy

This confirms and extends `docs/31` §8's existing tiers rather than introducing new ones:

**Highest emphasis** — unchanged from `docs/31` §8: Problem, Architecture, Engineering Decisions, rendered as plain prose at full reading width. A diagram, when present, sits at this same visual register — not larger, not full-bleed, not more prominent than the prose around it. A diagram is evidence, not a centerpiece.

**Secondary emphasis** — unchanged: Implementation, Validation, Trade-offs, plus Callouts used contextually (Trade-off, Security, Performance, the future Decision-shaped variant), at the existing Callout component's own restrained visual weight — this proposal asks for no louder treatment.

**Explicitly rejected, regardless of system complexity:**

- Diagram galleries or a "Diagrams" section.
- Decorative architecture graphics that don't answer a specific question (§3's litmus test).
- Badge walls ("✅ Secure ✅ Scalable ✅ Cloud-Native").
- Technology-logo walls.
- "Modern architecture" marketing language — `docs/25-WORK_EXPERIENCE.md`'s rejection of marketing language and unnecessary screenshots is a visual-hierarchy rule here as much as a writing one.

Architecture should read as documentation a peer engineer would trust, never as a pitch deck.

---

# 13. Accessibility

- **Diagrams need meaningful text alternatives** — not alt-text alone, but the adjacent prose §4 already requires, which does double duty as the accessible description.
- **No essential information exists only in a diagram** — the direct accessibility consequence of §4's "text-first readers" requirement; a screen-reader user following the prose should never miss an architectural fact a sighted, diagram-skimming reader would catch.
- **Keyboard accessibility** — not a concern for today's static diagrams (images, inline SVG, or text-based diagrams inside code blocks, as Task 5.3's fixture already used); becomes relevant only if a future interactive diagram (§15) introduces focusable elements, at which point it inherits this codebase's existing `focus-visible` conventions rather than needing a new pattern invented for it.
- **Readable labels, sufficient contrast** — diagram text must meet the same contrast and typography standards already verified for Callouts and Code Blocks in Task 4.3; no new tokens, no exception carved out for diagram content.
- **Reduced motion** — not applicable to any diagram this proposal describes, since none are animated or interactive. Stated now, as a constraint any future interactive or animated diagram implementation must satisfy (`prefers-reduced-motion`, the same `motion-safe:` discipline already used elsewhere in this codebase), so it isn't discovered as a gap later.

---

# 14. Scalability

**The governing principle is the one `docs/31` §9 already established, restated for architectural complexity specifically: increasing complexity should deepen the document, not widen it.**

- **A small backend service** — the Architecture section may be a few paragraphs with zero diagrams. Honest, not a gap, per `docs/31` §9's own "some sections may be genuinely short" principle.
- **A distributed application** — the Architecture section likely needs one or two diagrams (a system context and either a data-flow or sequence diagram) and several named Engineering Decisions. Still one Architecture section, one Engineering Decisions section.
- **A multi-service platform** — more components, more decisions, more trade-offs — met with *more content inside the same sections*, never a second Architecture section, never a per-service sub-page.
- **A system with significant infrastructure complexity** — the strongest temptation to add a dedicated "Infrastructure" page. Rejected explicitly: infrastructure discussion and diagrams stay inside Architecture, using §3's same diagram-when-useful test. A genuinely complex topology is served by **multiple smaller, targeted diagrams, each answering one specific question** (per §3), rather than one sprawling diagram attempting to show everything — the "no diagram gallery" constraint holds at every complexity level, not just small ones.

What never changes: the document stays one Architecture section, one Engineering Decisions section, one Trade-offs section, inside the same fifteen-section body and four-region skeleton `docs/31` already established. Complexity is absorbed as density, never as new structure.

---

# 15. Future Evolution

Documented as future possibilities only — none are current scope, and several are already named, planned milestones this proposal must not preempt.

- **Interactive architecture diagrams** — extends §3/§4's static diagrams into something a reader can manipulate; inherits §13's accessibility constraints (keyboard operability, reduced motion) as hard requirements from day one, not an afterthought.
- **Architecture Decision Records (ADRs)** — named under this same Task 5.4's own deliverable list in `docs/28` (see §5's numbering note) and `docs/31` §10's own named direction, but deliberately not built by this proposal; formalizes §5's six-part narrative arc into a structured, addressable record, extending it rather than replacing it, whenever a later implementation phase picks it up.
- **Architecture version history** — extends the existing `updatedAt` precedent (`docs/20` §8/§10) to track how a system's documented architecture changed across revisions, the same zero-schema-change path already identified for Knowledge articles.
- **Infrastructure views / deployment topology** — extends §3's deployment-diagram category into a dedicated, richer rendering; the underlying content still originates as an Architecture-section diagram, never a second document.
- **System evolution** — already `docs/28`'s own **Task 5.5 — Project Evolution** scope (Timeline, Milestones, Iterations); this proposal's Architecture and Engineering Decisions sections are the natural source content a future timeline would visualize, the same relationship `docs/31` §10 already named between Challenges Encountered and Task 5.5.
- **Dependency graphs** — extends §1's "external dependencies" and "components" facts across *multiple* case studies into a queryable, Library-level view — a `docs/30` (Case Study Library)-level feature building on this proposal's per-document facts, not a per-document feature itself.
- **Failure-path visualization** — extends §7's failure/reliability evidence into a diagram category of its own, using the same sequence/data-flow vocabulary §3 already defines.

Each of these deepens the architecture layer this proposal defines rather than replacing it, consistent with `24-ENGINEERING_PRINCIPLES.md` Principle 13 ("Incremental Evolution... additive whenever possible") and the same posture `docs/20` §9–10 and `docs/31` §10 already held toward their own future-evolution lists.

---

# Summary

The Architecture Experience answers *why this system was designed this way* without becoming a second document, a diagram gallery, or a badge wall. It lives entirely inside the Case Study's existing Architecture, Engineering Decisions, and Trade-offs sections, drawing evidence from Constraints, Requirements, Investigation, Implementation, Validation, Challenges Encountered, and Outcome — every one of them a section `docs/26` and `docs/31` already approved. Diagrams earn their place only by answering a question prose alone would struggle with; decisions are told as a complete arc from problem to consequence; trade-offs name their own boundary conditions rather than posing as universal truths; failure behavior and security are contextual evidence woven through existing prose, never a checklist or a badge.

Nothing here asks `docs/31`'s document skeleton to change, asks the Case Study to gain a new region, or asks for a parallel architecture portfolio. It is the same document, read more deeply in the three sections where architectural reasoning already lives — ready for architecture review ahead of a future implementation task.
