# 33 — Project Evolution

> A design proposal for deepening `/work/[slug]`'s existing sections with the history of *why* they changed — not a new document, not a timeline page.

**Status:** Proposal — awaiting review and approval. No implementation is included in or authorized by this proposal (Task 5.5).

**Revision note:** This draft incorporates four prose clarifications from the first architecture review — an explicit "no evolution" authoring rule preventing manufactured history (Purpose), an explicit historical-state-vs-current-state rule preventing versioned copies of existing sections (§3), a clarification that "v1"/"v2" in §8's diagram are conceptual labels rather than proposed structure (§8), and confirmation that the evolution-event litmus test (§1/§5) and all existing scope boundaries remain unchanged. No heading, schema field, or document region was added.

---

## Core Principle

> **Project Evolution should explain why the system became what it is, not merely record what happened to it.**

A timeline answers *"when?"* Evolution answers *"why did it change?"* Every recommendation in this proposal exists to keep the second question in front of the first one, never the other way around.

---

# Purpose

The Case Study answers *"how was this engineering problem solved"* (`docs/31-CASE_STUDY_EXPERIENCE.md`). The Architecture Experience answers *"why was this system designed this way"* (`docs/32-ARCHITECTURE_EXPERIENCE.md`) for the system's current shape. Project Evolution answers a third, narrower question, for systems that have more than one chapter:

> **How did this system change, and why?**

This is not a new document, not a new page, and not a new top-to-bottom region. `docs/31`'s approved structure is untouched. Project Evolution lives entirely inside the same sections `docs/32` already deepened — primarily **Engineering Decisions** and **Architecture** — narrating how their content arrived at its current state rather than presenting that state as though it had always been true. `docs/26-CASE_STUDY_TEMPLATE.md`'s fifteen sections gain no sixteenth heading from this proposal, exactly as they gained none from `docs/32`.

Not every case study needs this layer. A system built once and never meaningfully redesigned has nothing to evolve — its Case Study is already complete without it. Project Evolution exists for the systems that *did* change, so that change can be documented as reasoning instead of disappearing the moment a section is rewritten to describe only the current state.

Stated as a concrete authoring rule, not just an observation: **if a Case Study contains no meaningful change that required weighing an alternative and accepting a new trade-off, no evolution narrative should be manufactured.** In that case, the existing Case Study remains complete on its own, exactly as `docs/31` and `docs/32` already left it. This rule exists specifically to prevent the failure mode a proposal like this one invites by existing at all — empty "evolution" content, artificial history, or retrospective storytelling added only because the capability is now available. A Case Study earns this layer by having real history to explain, never by being expected to have one.

---

# 1. Information Model

## What Counts as Evolution

A change qualifies as engineering evolution only if it required **weighing an alternative and accepting a new trade-off** — the same test `docs/32` §5 already applies to a single decision, now applied to whether a change is worth narrating as history at all. If a change didn't require that, it isn't evolution; it's ordinary work, and belongs in Implementation as ordinary work, undated and unremarkable.

| Category | Qualifies as evolution when... | Where it's narrated |
|---|---|---|
| Architecture changes | A structural shape was replaced, not just extended | Architecture (continuous narration — see §8) |
| Technology changes | A dependency was replaced *because* the original one hit a limit, not merely upgraded | Engineering Decisions (a new decision entry) |
| Requirement changes | A requirement that shaped the original design later changed and forced a redesign | Constraints/Requirements (updated) + Engineering Decisions (the response) |
| Scaling changes | A scale threshold was crossed that the original design didn't anticipate | Challenges Encountered (the pressure) + Engineering Decisions (the response) |
| Reliability changes | A failure mode was discovered that the original design didn't handle | Challenges Encountered + Engineering Decisions |
| Security changes | A trust assumption stopped holding | Engineering Decisions, using the same contextual `security` Callout `docs/32` §8 already established |
| Operational changes | How the system is run changed because running it the old way became a real cost | Engineering Decisions or Trade-offs |
| Lessons that caused redesign | A Lessons Learned insight from an earlier pass directly produced a later decision | Lessons Learned (naming what it caused) + the Engineering Decision it produced |
| Reversed/superseded decisions | An earlier decision was deliberately replaced | Engineering Decisions — see §6 |

## What Does Not Count

Commits, tickets, deployments, routine bug fixes, dependency bumps, and any change that extended the existing approach without changing its shape. None of these need narrating as evolution — most don't belong in the Case Study at all, and the ones that do belong in Implementation, described once, as how the current system works, not as a step in a history.

---

# 2. Evolution Narrative

```
Initial State
     ↓
Problem / Pressure
     ↓
Engineering Decision
     ↓
Change
     ↓
Observed Result
     ↓
New Understanding
```

This is `docs/31` §4's own Traceability chain (`Problem → Architecture Decision → Implementation → Validation → Outcome`) **walked a second time** — a system that evolved has traced that chain more than once, and this proposal's job is to keep both passes legible rather than letting the second pass silently overwrite the first. "Initial State" is what an earlier pass through Architecture/Engineering Decisions concluded; "Problem/Pressure" is new evidence (often surfacing in Challenges Encountered or Validation) that the initial state didn't anticipate; "Engineering Decision" and "Change" are a new Engineering Decisions entry and its effect on Architecture; "Observed Result" is new Validation/Outcome evidence; "New Understanding" is what Lessons Learned captures from the whole cycle.

## Why This Beats a Chronological Log

A chronological log answers "what happened, when" without giving a reader any way to judge whether a change was justified — it's a record of activity, not of reasoning. This chain, by contrast, lets a reader apply the exact same scrutiny `docs/32` §2 already demands of a single decision — is the pressure real, is the response proportionate, does the evidence support the new understanding — to how the *system's whole understanding of itself* developed. A log of dates can be replaced by a version-control history for free; a causal account of why the system changed cannot, which is exactly why the second one belongs in the Case Study and the first one does not.

---

# 3. Relationship with the Existing Case Study

Project Evolution reveals how existing sections changed; it does not duplicate them by adding a parallel account beside them.

| Section | Evolution's role in it |
|---|---|
| Problem / Constraints | Where a changed premise first shows up — a constraint that no longer holds is often the earliest sign a redesign is coming. |
| Architecture | Narrated continuously as one evolving account, not two competing ones — see §8. |
| Engineering Decisions | The primary home for evolution — a superseding decision is simply another entry in this section, per §6. |
| Trade-offs | A trade-off's own text should say when it stopped holding, if it did — the same "under what conditions this might change" clause `docs/32` §6 already asks every trade-off to carry. |
| Implementation | Describes the *current* system only. It is never rewritten into a history of every past implementation — that history lives in Engineering Decisions' prose, not in a second Implementation section. |
| Validation | Gains new evidence over time (a second load test, a later benchmark) attached to the decision it validates, not a separate "re-validation" section. |
| Challenges Encountered | Frequently *is* the recorded trigger — "under production load, X broke" is often the Problem/Pressure step of the chain in §2, already sitting in a section that already exists. |
| Outcome | Describes the current, evolved system's outcome — it may reference an earlier outcome for contrast, but it does not maintain two Outcome sections. |

The rule that keeps this from becoming duplication: **every section always describes the current, settled understanding as its primary content.** Evolution is the narration of *how the document arrived there*, carried almost entirely by Engineering Decisions (with Architecture, Challenges Encountered, and Trade-offs as its supporting texture) — never a parallel copy of any section restated at an earlier point in time.

Stated as its own explicit rule, because it's load-bearing for everything else in this proposal: **historical states provide context for explaining change; they do not become competing versions of the current Case Study.** Concretely — Architecture describes the *current* architecture, and evolution explains how it changed to become that; Engineering Decisions describes the decisions that matter to the *current* system, and evolution explains when and why an earlier decision stopped holding; Outcome describes the *current* outcome, and evolution may reference an earlier outcome only as evidence that something changed, never as a second, standing account of what the outcome used to be. No section gains a versioned copy of itself under this proposal — a historical state is always subordinate evidence inside the current section's narration, never a rival to it.

---

# 4. Relationship with Engineering Logs

Three tiers, from rawest to most settled:

```
Engineering Log            Project Evolution              Case Study's own sections
(raw discovery)      →     (refined historical account)   →   (current understanding)
```

- **Engineering Logs = discovery.** The uncertain, in-the-moment record — "noticed something odd under load today, not sure why yet." Already connected via Task 5.3's Related Engineering Logs section; unchanged by this proposal.
- **Project Evolution = the refined historical account.** Once discovery resolved into an actual decision, Evolution is where that arc — pressure, decision, change, result, new understanding — gets told as settled reasoning, per §2.
- **Case Study's own sections = current understanding and outcome.** The end state Evolution's narration arrives at — Architecture, Engineering Decisions, Trade-offs, and Outcome as they stand today.

The distinction that matters: a Log entry may never resolve into anything narrated in the Case Study at all (most don't, per `docs/31` §6's own "not every lesson becomes an article" reasoning, extended here to "not every log becomes an evolution event"). Evolution only exists for the discoveries that *did* produce a real decision — the ones that didn't stay exactly where Task 5.3 already put them: in the Logs, linked, not restated.

---

# 5. Evolution Events

## Qualifying Examples

Replacing an architectural component; changing a persistence strategy; introducing caching in response to an observed load pattern; changing a communication pattern (sync to async, or the reverse); redesigning for a scale the original design didn't anticipate; responding to a production failure with a structural change; changing authentication architecture; removing infrastructure that turned out to be unnecessary; reversing an earlier decision (§6).

## The Litmus Test

Before narrating something as an evolution event, ask: **did this require weighing an alternative and accepting a new trade-off, or did it simply extend the existing approach without changing its shape?** If the latter, it isn't evolution — it's Implementation, described once, as how the system works today. This is the direct operational form of §1's information model, applied the same way `docs/32` §3 uses its own litmus test to decide whether a diagram earns its place.

## What Never Qualifies

Individual commits, tickets, deployments, or routine bug fixes. A system can accumulate thousands of these without a single one rising to an evolution event — volume of activity is not evidence of engineering change, and treating every one as such is exactly what turns a Case Study into an activity log this proposal exists to prevent.

---

# 6. Decision Reversal

A mature engineering document should be able to say, plainly, inside an Engineering Decisions entry:

> *"We originally chose X because [reason], but later changed to Y because [new evidence]."*

This is **evidence of engineering reasoning working correctly**, not a failure to document defensively. `24-ENGINEERING_PRINCIPLES.md` Principle 10 ("Measure Before Changing... avoid changing architecture based solely on intuition") and Principle 11 ("Simplicity Over Cleverness") both already imply that a decision should change when evidence warrants it — a reversal recorded honestly is exactly that principle demonstrated, not contradicted. A case study that only ever shows decisions that turned out right reads as curated, not credible; one willing to show a reversal, with its reasons, reads as trustworthy in exactly the way `docs/25-WORK_EXPERIENCE.md`'s whole anti-portfolio thesis asks for.

## How It's Documented — Not a New Structure

A reversal is simply another Engineering Decisions entry, using the exact six-part arc `docs/32` §5 already established (problem → alternatives → chosen approach → rationale → trade-offs → consequences), with one additional narrative thread named explicitly rather than left implicit: **what this decision supersedes, and why the earlier one stopped holding.** This is a sentence inside the existing Rationale, not a new heading, a new schema field, or a new Callout variant — e.g., "This supersedes the original row-level locking approach, chosen when per-wallet write volume was an order of magnitude lower than it became by month eight." No reversal should ever be framed as *the previous engineer was wrong* — the correct frame is *the constraints changed, and the decision changed with them*, which is a fact about the system's history, not a verdict on the earlier choice.

---

# 7. Timeline vs. Causality

**Chronology** answers *"what happened when?"* **Causality** answers *"why did the system change?"* Project Evolution prioritizes the second, always.

Dates are not banned — `docs/26`'s own `Timeline` frontmatter field (already implemented, Task 5.3) and inline references ("by month eight, daily active wallets had grown past the original design's assumption") are legitimate supporting detail. What's rejected is dates *as the organizing structure* — no "Timeline" heading, no chronological list a reader is meant to scan top to bottom for its own sake. A date earns its place only when it's attached to a causal claim already being made ("this is when the pressure in §2 appeared"), never presented alone. A timeline may exist as a light supporting representation (§10) but must never become the primary narrative — if a reader could reconstruct the whole account from the dates alone with the causal prose removed, the proportions are backwards.

---

# 8. Architecture Evolution

```
Architecture v1
      ↓
Observed limitation
      ↓
Decision
      ↓
Architecture v2
      ↓
New trade-off
```

This chain is `docs/32` §2's own Architecture Narrative (`Problem → Constraints → Architectural Requirements → Architecture → Decisions → Trade-offs → Consequences`), walked twice — the same reuse this proposal's §2 already established for the document as a whole, applied specifically to the one section most likely to have a real "before" and "after."

A clarification worth stating precisely, since the diagram's own labels invite the opposite reading: **"v1" and "v2" above are conceptual labels for successive architectural states within one narrative — not proposed document headings, schema fields, versioned sections, or separate architecture documents.** They name a *before* and an *after* for the reasoning in this section to move between, nothing more; nothing in this proposal asks the implementation to render either one as its own addressable unit.

**Architecture Evolution reuses the existing Architecture narrative — it does not fork it into "Architecture v1" and "Architecture v2" subsections.** The implementation must continue to render Architecture as one continuous narrative, exactly as `docs/32` already established. The section stays one continuous account: *"Initially, the wallet service wrote directly to a single PostgreSQL instance. Once read load from balance checks began competing with write latency on the same instance, a read replica was introduced, accepting eventual consistency on the read path as the new trade-off in exchange for write latency staying inside budget."* One section, one narrative, the transition told as part of it — never a second Architecture document, and never a diagram gallery contrasting "before" and "after" as an end in itself (§10 covers when a before/after diagram is actually warranted).

---

# 9. Evidence

## What Counts

Benchmarks, test results, production observations, incident reports, engineering logs (linked, not restated — §4), metrics, the design decision itself, before/after architecture diagrams (§10), and implementation constraints that changed.

## Where It Lives

Evidence is never collected into a section of its own — it attaches to the specific claim it supports, in whichever existing section that claim already lives:

- Benchmarks, test results, metrics → **Validation**, the same section that already carries this evidentiary weight per `docs/32`'s own reasoning.
- Production observations, incident reports → **Challenges Encountered**.
- The decision itself and its reasoning → **Engineering Decisions**.

## The Rule

**Evidence should support the explanation, not become a metrics dashboard.** A number belongs in the document only when it's cited in service of a specific causal claim already being made ("p99 latency crossed 400ms, which is what prompted the redesign") — never displayed for its own sake, and never presented as an ongoing, updating metric. This is `docs/32` §12's rejection of badge walls and dashboards, applied to historical evidence instead of current-state claims.

---

# 10. Visual Representation

## When a Visual Is Useful

The same litmus test `docs/32` §3 already established, applied to evolution's own candidate diagram types:

| Type | Useful when |
|---|---|
| Before/after architecture diagram | The *shape* of the change is genuinely hard to describe in prose alone — two small, targeted diagrams (per `docs/32` §3's "prefer the smallest diagram" rule), never one sprawling comparison. |
| Simplified timeline | Purely as light supporting scaffolding for a reader orienting themselves across a genuinely long history — never the primary narrative (§7), and never interactive. |
| Architecture transition diagram | Functionally the same as a before/after diagram — a single visual showing what specifically moved, not a general-purpose "history" graphic. |
| Decision transition | Rarely warrants a diagram at all; a reversal (§6) is almost always better served by the prose pattern in that section than by any visual. |

## Explicitly Rejected

Interactive timeline components (a case study is a document, not a dashboard) and decorative project-history graphics of any kind. Every visual this proposal allows must answer a specific engineering question, exactly as `docs/32` §3's litmus test already requires — if deleting it would only remove a picture, not information, it doesn't belong.

---

# 11. Relationship with Knowledge

```
System changed because of a scaling problem
              ↓
    Case Study explains the change
              ↓
  Knowledge Article explains the underlying scaling concept
```

This is `docs/32` §10's own "Architecture Decision → Engineering Concept → Knowledge Article" pattern, reused without modification. No new relationship type is needed: an evolution event that surfaces a concept already covered in Knowledge (a caching strategy, a consistency model, a scaling pattern) links to it the same way any other Engineering Decision does — inline at the point of use, and via the existing, unmodified Related Knowledge section (Task 5.3). The Case Study explains how the concept applied *to this system's history*; the Knowledge Library explains the concept once, for every case study — including ones that haven't evolved yet.

---

# 12. Relationship with Related Case Studies

```
Architecture pattern
        ↓
Related Case Study
        ↓
Different implementation / trade-off
```

`docs/31-CASE_STUDY_EXPERIENCE.md` §7 already designed exactly this relationship — theme/domain adjacency surfacing other case studies sharing an engineering concern — and explicitly deferred implementing it, pending "the task that owns the Work relationship/navigation model in full." This proposal introduces no new relationship type to fill that gap: a reader who has just read how a system evolved and wants to see a *different* system's answer to a similar architectural pattern is asking exactly the question `docs/31` §7's Related Case Studies was already designed to answer. Nothing here should be built ahead of that deferred work — this proposal simply confirms the existing design already covers the need, rather than inventing a second, evolution-specific relationship beside it.

---

# 13. Visual Hierarchy

Priority order, matching the task's own list, translated into `docs/31`/`docs/32`'s existing tiers:

1. **Why the system changed** — Problem/Pressure, carried by Constraints and Challenges Encountered. Highest emphasis, unchanged from `docs/32` §12.
2. **The engineering decision that caused the change** — Engineering Decisions. Highest emphasis, unchanged.
3. **What changed technically** — Architecture, narrated continuously (§8). Highest emphasis, unchanged.
4. **What evidence validated the change** — Validation. Secondary emphasis, unchanged.
5. **What was learned** — Lessons Learned. Secondary emphasis — synthesis, read after the reasoning that produced it, per `docs/31` §1's own ordering logic.

**Dates remain supporting, lowest-tier information** — the same tier `docs/31` §3 already assigns Timeline metadata. This is worth restating plainly: **avoid making the experience look like a resume timeline.** A resume timeline organizes around dates and treats reasoning as decoration; this document does the opposite by construction, every time a date is left attached to the causal claim it supports rather than promoted to a heading of its own.

---

# 14. Scalability

**The same governing principle `docs/31` §9 and `docs/32` §14 already established, restated a third time because it answers this section's question exactly: growth should deepen the document, not widen it.**

- **A small project with 2–3 meaningful changes** — a few extra sentences in Engineering Decisions and Architecture. No dedicated treatment needed; most case studies will never need more than this.
- **A medium project with several architectural iterations** — more Engineering Decisions entries, each following the same six-part-plus-supersession arc (§6). Still one Engineering Decisions section, one Architecture section.
- **A large system with years of evolution** — meaningfully more decisions and a longer, denser Architecture narrative — met with *more content inside the same sections*, never a dedicated evolution page, never per-era sub-documents, never a second document type. A large history should read as a richer version of the same document, not a differently-organized one.

What never changes: the fifteen-section body and four-region skeleton `docs/31` established, and the same Architecture/Engineering Decisions/Trade-offs sections `docs/32` already deepened. A system with years of history is a *denser* instance of the same Case Study, never a structurally different one.

---

# 15. Future Evolution

Documented as future possibilities only — several overlap with directions `docs/31`/`docs/32` already named, cross-referenced rather than re-derived, so this proposal doesn't accidentally duplicate a future item under a new name.

- **Architecture version history** — already named in `docs/32` §15; this proposal's Architecture Evolution narrative (§8) is the prose precursor a future structured version history would formalize.
- **Decision timelines** — already named as "Engineering Decision Timeline" in `docs/32` §15; this proposal's §6/§7 (reversal narrative, causality-first ordering) is exactly the content such a timeline would visualize.
- **Before/after architecture comparisons** — a richer, dedicated rendering of §10's before/after diagram category, beyond today's static-text representation.
- **Deployment history, production incident history** — extend §5's evidence categories and §9's Challenges-Encountered-as-evidence pattern into their own structured, queryable records.
- **Migration tracking** — a structured version of the same "what replaced what" facts §6's decision-reversal narrative already states in prose.
- **Automated change extraction** — deriving candidate evolution events from git/deployment history automatically. Explicitly out of scope now (this proposal's own constraints forbid git integration) and worth flagging precisely because it's the most tempting shortcut: automation would surface *activity*, not *reasoning*, and this whole proposal exists to keep those two separate (§1, §5).
- **Engineering metrics over time** — a structured, chart-based extension of §9's evidence categories, kept distinct from a "metrics dashboard" per that section's own explicit rejection of one.
- **Project "eras" or major phases** — a possible future organizing device for genuinely long histories (§14's "large system" case), but not a structure this proposal introduces now; today, a long history is still one continuous Architecture and Engineering Decisions narrative.

Each of these deepens the model this proposal defines rather than replacing it, consistent with `24-ENGINEERING_PRINCIPLES.md` Principle 13 and the identical posture `docs/31` §10 and `docs/32` §15 already held toward their own future-evolution lists.

---

# Summary

Project Evolution answers *how did this system change, and why* by treating change as a second (or third, or tenth) pass through the same causal chain every other part of the Case Study already uses — never as a chronological record of activity, and never manufactured where no real change exists. It lives entirely inside Engineering Decisions and Architecture, the two sections `docs/32` already deepened, with Challenges Encountered, Trade-offs, Validation, and Lessons Learned supplying its pressure, its boundary conditions, its evidence, and its synthesis. A decision reversal is documented as legitimate engineering reasoning, not a failure; a diagram earns its place only by the same litmus test every other diagram in this workspace already has to pass; dates stay attached to the causal claims they support instead of organizing the account themselves. A historical state is always context subordinate to the current section it appears in — never a competing, versioned copy of it.

Nothing here asks `docs/31`'s document skeleton to change, asks the Case Study to gain a sixteenth section, or asks for a timeline page, a changelog, or a commit-history viewer. It is the same document, read once more for how its own understanding of itself developed — ready for architecture review ahead of a future implementation task.
