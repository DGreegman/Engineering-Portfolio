# 34 — Knowledge Integration

> A design proposal for how the existing Case Study connects to the existing Knowledge Library — not a second Knowledge Library, not a graph product.

**Status:** Proposal — awaiting review and approval. No implementation is included in or authorized by this proposal (Task 5.6).

---

## Governing Principles

> **Work demonstrates. Knowledge explains.**
> **Link concepts where they matter; do not link every technical noun.**
> **Related Knowledge is a curated learning bridge, not a second index.**
> **One concept, one canonical explanation.**
> **More Knowledge articles should increase the richness of relationships, not the visual complexity of Case Studies.**

Every recommendation in this proposal is a specific application of these five sentences. Where a section seems to answer a narrow implementation question, it is really answering which of these five principles governs that question.

---

# Purpose

The Case Study answers *"how was this engineering problem solved"* (`docs/31-CASE_STUDY_EXPERIENCE.md`). Architecture Evolution and Project Evolution (`docs/32`, `docs/33`) both deepen that same document without adding a new one. Knowledge Integration is the same move applied to the Case Study's relationship with a different, already-existing collection:

> **What engineering concepts from this work are worth understanding more deeply?**

This is explicitly **not** a second Knowledge Library living inside Work. The division that governs everything below:

- **Case Study:** *"How was this concept applied in this system?"*
- **Knowledge Library:** *"What is this concept, how does it work generally, and what should engineers know about it?"*

Task 5.3 already built the infrastructure this proposal formalizes and extends editorially, not structurally: a document-level Related Knowledge section (`components/work/related-knowledge.tsx`), a resolver that reuses Knowledge's own relationship machinery verbatim (`resolveRelatedKnowledge()` in `case-study-relationships.ts`, calling the exported `resolveArticleReferences()` from `lib/content/relationships.ts`), and an MDX pipeline whose inline link component (`A`, `mdx-components.tsx`) already renders any Knowledge link a Case Study's prose contains. This proposal's job is to define *when* and *how much* to use what already exists — never to build a new mechanism beside it.

---

# 1. Information Model

Three mechanisms, three different jobs. They must never become three copies of the same relationship.

## Inline Conceptual Links

A concept is linked **at the point where it is first substantively used**, using the existing MDX `A` component — no new component, since any Markdown link inside a Case Study's MDX body already renders through it today.

> *"We used idempotency keys to make payment retries safe."*

"Idempotency keys" links to the relevant Knowledge article. The Case Study does not then stop to re-explain what idempotency is in general — that explanation already belongs to the linked article, per the Point, Don't Duplicate rule (§2).

## Related Knowledge

The existing document-level section (Task 5.3, unmodified) surfacing the small set of concepts most worth a reader's attention *after* finishing the account — a curated learning bridge, not an index of every concept the document happened to mention. Already capped at four (`DEFAULT_RELATIONSHIP_LIMIT` in `case-study-relationships.ts`) — see §4.

## Engineering Lessons

The Work Landing's own mechanism (`docs/29-WORK_LANDING_PROPOSAL.md` §6, implemented in Task 5.1 via `EngineeringLessonEntry.relatedKnowledge`), connecting a distilled, reusable lesson to the Knowledge article that generalizes it. This lives at the Landing level, aggregated across case studies — a Case Study's *own* Lessons Learned section participates in Knowledge Integration the same way any other section does, through inline links (above), not through a duplicate of the Landing's mechanism.

## Why Three, Not One

Each answers a different reader question: *"what does this term mean, right now, without leaving the paragraph I'm reading"* (inline); *"now that I've finished, what's worth reading next"* (Related Knowledge); *"what did this work teach that generalizes beyond this one project"* (Engineering Lessons). Collapsing them into one mechanism would force a single relationship to serve three different moments in a reader's attention — the same reasoning `docs/31` §3 already used to keep Related Knowledge and Related Engineering Logs as two sections rather than one.

---

# 2. The "Point, Don't Duplicate" Rule

**The governing principle for every mechanism in this proposal.** If the Knowledge Library already owns a concept's general explanation:

- Do not reproduce that explanation inside the Case Study.
- Link to the existing article instead.
- Keep the Case Study's own words focused on application, context, constraints, and trade-offs — what only *this* system's account can say.

The Case Study may still explain enough for a reader to follow the decision being discussed — that's context, not duplication. The boundary is exact:

> **Case Study:** *"Why we used idempotency here."*
> **Knowledge:** *"What idempotency is and how it works generally."*

This is not a new rule — it is `docs/31` §5, §10 and `docs/32` §10's existing "point, don't duplicate" discipline, restated as this proposal's own load-bearing principle because Knowledge Integration is the layer where it is tested most often.

---

# 3. When an Inline Link Is Appropriate

A link belongs at a specific point in the prose only when it is:

- **Relevant** — the concept is actually load-bearing for the sentence, not adjacent to it.
- **Contextual** — a reader needs to understand it *right there* to follow the argument.
- **Placed at substantive use** — the first time the concept does real work in the account, not the first time the word appears.
- **Useful at that exact point** — the reader benefits from following it *now*, not merely could.

## Explicitly Avoided

- Linking every technology name mentioned in passing.
- Linking every engineering term regardless of whether the sentence depends on it.
- Turning a paragraph into link-heavy reference material.
- Linking a concept merely because a Knowledge article happens to exist for it.

A reader should never feel like the Case Study is covered in hyperlinks. If a term appears five times, it earns one link — at its first substantive use — not five. This is an authoring discipline, not a technical constraint: nothing about the MDX pipeline enforces it, the same way nothing enforces `docs/25`'s rejection of marketing language beyond editorial judgment.

---

# 4. When Related Knowledge Is Appropriate

A concept earns a place in the document-level Related Knowledge section when it:

- Materially shaped an architectural decision.
- Explains an important trade-off.
- Is central to the engineering challenge itself.
- Represents a reusable lesson (see §6).
- Would help the reader understand *this system* more deeply — not knowledge in general.

Not every inline-linked concept resurfaces here — most shouldn't. Related Knowledge is the small, curated subset, not a rollup of every link in the document.

## The Cap

Already implemented, not proposed: `resolveRelatedKnowledge()` calls `resolveArticleReferences()` with a default limit of **four** (`DEFAULT_RELATIONSHIP_LIMIT`), the same cap Knowledge's own Related Concepts already uses for itself (`docs/20-ARTICLE_EXPERIENCE.md` §8's "cap Related Concepts visually... regardless of how many the frontmatter lists"). This proposal adopts that existing number rather than proposing a new one — consistency with an already-established constant, not a fresh design decision.

---

# 5. Knowledge Relationship Types

No taxonomy is introduced. The task's own candidate distinctions — *concept applied*, *decision informed by concept*, *lesson derived from concept* — are already fully expressible through **where** a link appears, not through any new field:

| Distinction | Expressed by |
|---|---|
| Concept applied | An inline link inside prose describing the system generally (Architecture, Implementation). |
| Decision informed by concept | The same inline link mechanism, placed inside an Engineering Decisions entry's Rationale. |
| Lesson derived from concept | The existing Engineering Lessons → Knowledge link (`docs/29` §6), or an inline link inside the Case Study's own Lessons Learned section. |

Editorial placement — which section a link sits in — already carries the semantic weight a new relationship-type field would otherwise exist to encode. Per the task's own instruction: where a distinction *could* be represented with new metadata or with placement alone, this proposal chooses placement, every time. No relationship type should exist merely to produce a label.

---

# 6. Relationship with Engineering Lessons

```
Case Study
     ↓
Engineering Lesson
     ↓
Knowledge Article
```

Already the Work Landing's own model (`docs/29` §6), implemented in Task 5.1: `EngineeringLessonEntry.relatedKnowledge` pairs a distilled lesson with the article that generalizes it. The Case Study demonstrates the lesson through real engineering work; the Knowledge article generalizes it for every reader, not just this project's.

**Not every lesson needs its own Knowledge article** — most lessons are specific enough to stay exactly where they are, inside one Case Study's Lessons Learned section, un-generalized. **Not every Knowledge article needs to originate from a Work lesson** — most Knowledge content will keep being authored directly, independent of any one project's experience. This proposal does not create an artificial one-to-one expectation between the two collections; `docs/29` §6 already rejected that framing explicitly, and this proposal inherits the rejection rather than re-deriving it.

---

# 7. Relationship with Architecture and Decisions

Knowledge Integration is strongest exactly where engineering reasoning is thickest — Architecture and Engineering Decisions, the two sections `docs/32` already deepened. All three examples below use the same inline-link mechanism (§1), placed in three different sections:

| Case Study says | Links to |
|---|---|
| *"Requests are processed asynchronously through a queue."* (Architecture) | "Message Queues" |
| *"We chose a queue instead of synchronous processing because..."* (Engineering Decisions) | "Backpressure," "Queue Semantics," or "Asynchronous Processing" |
| *"Accepted eventual consistency in exchange for..."* (Trade-offs) | "Eventual Consistency" |

No new mechanism is introduced for Architecture/Decisions specifically — this section exists to name where Knowledge Integration matters most, not to define a fourth mechanism beside the three in §1. The Case Study keeps the project-specific reasoning; Knowledge keeps the general explanation, exactly as §2 requires.

---

# 8. Relationship with Project Evolution

Reuses `docs/33-PROJECT_EVOLUTION.md`'s own distinction directly:

> **Project Evolution:** *"Why did this system change?"*
> **Knowledge:** *"What general engineering concept helps explain this change?"*

Example, following `docs/33` §8's own architecture-evolution shape: a system initially used synchronous processing; observed throughput pressure; the architecture changed to asynchronous processing. The Case Study's Engineering Decisions entry explains **why** that specific change happened, for this specific system, under its own constraints. An inline link to "Asynchronous Processing" or "Message Queues" lets a reader who wants the general concept go get it — but the historical narrative itself (the pressure, the decision, the trade-off) stays exactly where `docs/33` §3 already put it, inside the Case Study. **Knowledge never becomes a duplicate of that historical narrative** — it explains the concept the same way for every reader, regardless of which project's evolution brought them there.

---

# 9. Relationship with Engineering Logs

```
Engineering Log  →  Case Study  →  Knowledge
  (discovery)        (conclusion)    (generalization)
```

The three-tier model `docs/33` §4 already established, extended one step further. A reader can move Log → Case Study → Knowledge, but each destination answers a genuinely different question — discovery, settled conclusion, general principle. **Knowledge articles must never become cleaned-up copies of Engineering Log content.** A Log entry's raw, in-the-moment record and a Knowledge article's general, timeless explanation serve different readers at different moments; conflating them would make Knowledge start accumulating project-specific residue it was never meant to carry. No direct Log-to-Knowledge link is introduced by this proposal — the existing path already runs through the Case Study, which is exactly where the discovery becomes something general enough to be worth generalizing.

---

# 10. Relationship with Related Case Studies

```
Case Study A
      ↓
Knowledge: Idempotency
      ↓
Case Study B
```

Useful when two projects apply the same concept differently — a reader of Case Study A's idempotency decision might reasonably want to see Case Study B's different answer to the same underlying problem. This proposal does **not** build that bridge as new infrastructure:

- No graph UI.
- No explicit `"Case Study A → Case Study B because of Knowledge X"` relationship type.
- No new schema field connecting two case studies through a shared concept.

Related Case Studies itself remains deferred, exactly as `docs/31` §7 left it and Task 5.3's implementation confirmed — this proposal does not implement it either, and does not build a Knowledge-mediated substitute for it. The connection stays **implicit**: a reader follows Case Study A's Related Knowledge into the Knowledge article, and may independently encounter Case Study B later (through the Library's own domain/theme browsing, `docs/30`). Nothing here builds a "used by" backlink from Knowledge to Work, which would itself be new infrastructure and a step toward the shared-taxonomy vision `docs/29`/`docs/30` already scoped as future-only (see §19). The goal is better exploration for a reader willing to follow two separate, already-real links — not a knowledge-graph product connecting them automatically.

---

# 11. Knowledge Article Selection

Priority order for what a Case Study links to or surfaces, most to least authoritative:

1. **Explicitly authored relationships** — `relatedContent` in frontmatter, already how `resolveRelatedKnowledge()` works today. Nothing here changes.
2. **Concepts materially used** in the account — the inline-link test from §3.
3. **Concepts tied to a specific decision or trade-off** — §7's territory.
4. **Lessons that benefit from generalization** — §6's territory.

## Explicitly Ruled Out

**No automatic inference from keyword matching. No AI-assisted relationship extraction. No new automatic taxonomy.** Every relationship this proposal describes is authored — a human decides a link belongs, the same discipline `docs/24-ENGINEERING_PRINCIPLES.md` Principle 8 ("Explicit Knowledge... prefer authored relationships over inferred recommendations") already requires everywhere else in this workspace. This is not a gap this proposal leaves for later within its own scope — it's a permanent boundary, restated as future-only in §19 precisely so it doesn't drift into "current scope" by accident.

---

# 12. Missing or Invalid Knowledge References

Already solved, not proposed: `resolveArticleReferences()` (exported from `lib/content/relationships.ts`, reused by `resolveRelatedKnowledge()`) resolves a slug list against real, published Knowledge articles and **silently skips** any slug that doesn't match — no broken link, no fabricated title, no crash. This is the same "honest, not fabricated" behavior already verified for Related Engineering Logs in Task 5.3 and re-confirmed for the success path in Task 5.4's own follow-up verification.

Restated as the standing rule this proposal inherits rather than re-derives:

- Do not render a broken link.
- Do not fabricate a title for an unresolvable reference.
- Do not let one bad reference crash the page.
- Resolve what can be resolved; omit what cannot.

Knowledge Integration introduces no new failure mode here — every mechanism in §1 either resolves against a real article or renders nothing.

---

# 13. Visual Hierarchy

Knowledge links are **supporting navigation**, never competing content. Restating `docs/31` §8's existing tiers, unchanged:

**Highest emphasis** — unchanged: the engineering problem, architecture, decisions, trade-offs, outcome. A reader came to understand the work first; Knowledge is the optional deeper path, not a parallel attraction.

**Supporting emphasis** — Related Knowledge, at the same restrained visual register Task 5.3's own `RelatedKnowledgeCard` already established (a plain card: title, one-line description, a quiet citation line — no color-coded badges, no icons signaling "recommended"). Inline links use the existing `A` component's understated prose-link styling — visually part of the sentence, not a decorated call-out.

## Explicitly Rejected

- Knowledge-card walls (more cards than the existing four-item cap allows).
- Technology badge clouds.
- Excessive inline-link styling (bold, colored, or icon-decorated links competing with prose for attention).
- Large promotional CTAs ("Learn More About Idempotency →" treated as a primary action).
- A "Recommended Reading" treatment more visually prominent than the Case Study content above it.

---

# 14. Accessibility

Every requirement here is already satisfied by infrastructure verified in Tasks 4.3 and 5.3 — no new pattern is introduced:

- **Descriptive link text** — an inline Knowledge link's visible text is the concept itself ("idempotency keys"), never "click here" or a bare URL; Related Knowledge cards already render the article's real title.
- **Keyboard accessibility and visible focus** — the existing `A` component and `RelatedKnowledgeCard`'s `focus-visible` ring (Task 4.3.10's own accessibility fix, reused verbatim) already cover both mechanisms.
- **Sufficient contrast, no color-only link identification** — inline links already carry an underline, not color alone, the exact fix `DocumentHeader`'s topic link already required in Task 4.3.10; nothing new needed for Knowledge links specifically.
- **Screen-reader clarity for Related Knowledge** — the section's own `<h2>Related Knowledge</h2>` and one-line description already announce its purpose before a screen-reader user reaches the first card.
- **No duplicate accessible names** — each Related Knowledge card's one real link (the title) is the only interactive element per card, the same stretched-link pattern already used throughout this codebase.
- **Meaningful section labeling** — Related Knowledge already renders inside its own labeled `Section` region (`DocumentLayout`'s `relatedKnowledge` slot, Task 5.3).

No new accessibility pattern is proposed because none is needed.

---

# 15. Scalability

- **1–3 related concepts** — a handful of inline links, and Related Knowledge may legitimately show fewer than its own cap, or nothing at all if nothing clears the bar in §4. Honest, not a gap.
- **5–10 concepts** — the existing four-item cap already prevents Related Knowledge from growing past a curated size; more candidate concepts mean *better selection among them*, not a longer list.
- **A large Knowledge Library** — more articles to potentially link to does not mean more links per Case Study. The Case Study's own visual complexity stays fixed regardless of library size; what grows is the *quality* of the four (or fewer) relationships chosen, because a larger library gives an author more precise articles to choose from, not more slots to fill.

This is the same "growth increases richness of relationships, not complexity of navigation" principle `docs/29` §9, `docs/30` §9, `docs/31` §9, `docs/32` §14, and `docs/33` §14 have each already restated for their own layer — Knowledge Integration is the sixth, applying it to the Case Study's relationship with an external, independently-growing collection instead of an internal one.

---

# 16. Single Source of Truth

Knowledge articles remain owned, exclusively, by the Knowledge collection (`content/knowledge/`, `lib/content/articles.ts`). This proposal introduces:

- No copy of Knowledge metadata inside Work.
- No copy of an article's body or explanation inside a Case Study.
- No parallel or Work-scoped topic taxonomy.

Every Knowledge reference resolves through the existing Knowledge content infrastructure — `getAllArticles()`, the same function Knowledge's own pages already call — reused, not reimplemented, by `resolveRelatedKnowledge()`. A second Knowledge dataset under Work is exactly the failure mode `docs/29` §3 and `docs/30` §3 already named and rejected for Featured Case Studies and Architecture Highlights; this proposal holds Work's relationship to Knowledge to the identical standard.

---

# 17. Verification Strategy

Documented here as the plan a future implementation task should follow — not built now. Three temporary fixtures, exercising the model end to end:

**Fixture A — strong Knowledge integration.** A Case Study with several substantive inline links (placed inside Architecture, an Engineering Decision, and a Trade-off), a curated Related Knowledge set at or under the existing four-item cap, and at least one Lessons Learned entry connected to a Knowledge concept. Verifies every mechanism in §1 renders correctly together without visually competing (§13).

**Fixture B — no Knowledge integration.** A valid, complete Case Study that doesn't meaningfully depend on any existing Knowledge article — no `relatedContent`, no inline links. Verifies that Related Knowledge renders nothing rather than manufacturing a recommendation, the same "don't manufacture what isn't real" discipline `docs/33`'s own "no evolution" rule already established for a different section.

**Fixture C — invalid reference.** A Case Study with one valid and one dangling `relatedContent` slug in the same document. Verifies the valid reference renders, the dangling one disappears without a trace (§12), and the page remains fully functional — the same dual-reference pattern already used to verify Related Engineering Logs in Task 5.4's own follow-up round.

All fixtures use realistic engineering content, never lorem ipsum, and are removed after verification, per this workspace's established practice for every prior Work task.

---

# 18. Architecture Boundaries

Explicitly preserved. This proposal introduces none of the following:

- A Knowledge Graph UI.
- A Knowledge-only Work route.
- A second Knowledge collection.
- An AI recommendation engine.
- Automatic keyword-based relationship extraction.
- A new `DocumentLayout` region (Related Knowledge's existing slot, Task 5.3, is unchanged and sufficient).
- A new document type.
- A new taxonomy.
- Duplicate article content.
- A "related concepts" badge system.

Knowledge Integration extends the existing Case Study → Knowledge relationship infrastructure — `relatedContent`, `resolveRelatedKnowledge()`, `resolveArticleReferences()`, the `RelatedKnowledge` component, the MDX `A` component — through editorial discipline (§2, §3, §4, §5), not through new code.

---

# 19. Future Evolution

Documented as future possibilities only — none are current scope, and this section deliberately does not pull forward work `docs/29`/`docs/30` already scoped as future:

- **Automatic concept extraction** — deriving candidate Knowledge links from a Case Study's text automatically. Explicitly ruled out as current scope in §11; named here only so it isn't rediscovered as a gap.
- **Shared Work/Knowledge taxonomy** — already documented in `docs/29` §4 and `docs/30` §4 as a long-term direction (Architecture Highlights and Knowledge topics converging). This proposal does not advance that vision one step further than those two documents already did — Knowledge Integration's own relationships stay independent of it.
- **Concept pages** — a dedicated page per engineering concept aggregating every Case Study and Knowledge article that touches it. A plausible future evolution of §10's implicit bridge, not something this proposal builds.
- **Knowledge graph visualization** — explicitly rejected as current scope in §18; named here as the future form that rejection anticipates.
- **Bidirectional relationship discovery** — Knowledge articles surfacing which Case Studies reference them (the reverse of Related Knowledge). Would require new infrastructure on the Knowledge side, not something this proposal's Work-side scope authorizes.
- **Learning paths** — an authored sequence crossing Knowledge and Work, the same future concept `docs/30` §10 already named as "Curated Engineering Trails."
- **"All projects using this concept"** — a Library-level aggregation feature, building on `docs/30`'s own Browse Lens model rather than anything this proposal introduces.
- **Concept-level analytics** — usage or engagement metrics per concept, explicitly the kind of dashboard `docs/32` §12 and `docs/33` §9 already rejected as current scope, restated here for Knowledge specifically.

Each of these deepens the three-mechanism model this proposal defines rather than replacing it, consistent with `24-ENGINEERING_PRINCIPLES.md` Principle 13 and the identical posture every prior Work-milestone proposal in this family has already held toward its own future-evolution list.

---

# Summary

Knowledge Integration answers *what engineering concepts from this work are worth understanding more deeply* through three mechanisms that already mostly exist — inline links at the point of substantive use, a capped and curated Related Knowledge section, and the Work Landing's own Engineering Lessons bridge — never merged into one, never duplicated into a second Knowledge Library. The boundary holds everywhere this proposal touches: the Case Study explains application, context, and trade-offs; the Knowledge Library explains the concept once, for every reader who arrives there, from any project.

Nothing here asks `docs/31`'s document skeleton to change, asks `DocumentLayout` for a new region, or asks Work to maintain a second copy of anything Knowledge already owns. It is the same relationship infrastructure Task 5.3 already built, used more deliberately — ready for architecture review ahead of Task 5.6 implementation.
