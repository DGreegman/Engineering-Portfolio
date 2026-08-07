# 20 — Engineering Article Experience

> A design proposal for `/knowledge/[slug]` — reading an engineering handbook, not a blog post.

**Status:** Proposal — awaiting review and approval. No implementation is included in or authorized by this proposal (Task 4.3).

---

# Purpose

Every page in the Engineering Workspace answers exactly one question. The Engineering Article answers:

> **How does this engineering concept work?**

Where the Knowledge Landing page (Task 4.1) helps a visitor decide *where to begin*, and the Topic page (Task 4.2) helps them decide *what to learn next within a domain*, the Article is where the actual teaching happens — the destination those two pages have been pointing toward. Its entire design should optimize for **comprehension retained after the reader leaves**, not time-on-page, scroll depth, or any other engagement proxy a marketing site would chase.

## A terminology choice, deliberate throughout this proposal

An Engineering Article is described here as a **document**, not merely a *page*. A page is a transient, URL-addressable view — something a router serves and a browser paints. A document is the underlying knowledge asset the page renders: something with a lifecycle (published, updated, eventually superseded), a shape (headings, sections, relationships to other documents), and — per `docs/18-ARTICLE_TEMPLATE.md`'s own opening line — a reason to "become a long-term reference, not a time-sensitive blog post." `docs/06-CONTENT_STRATEGY.md` frames evergreen knowledge the same way.

This distinction isn't decorative wording. It's why Section 10 (Future Evolution) exists at all: version history, reading state, semantic cross-references, and annotations are properties of a *document* that a page framework alone wouldn't naturally suggest — a "blog post page" doesn't obviously need a version history; a long-term engineering reference obviously does. Treating the Article as a document from the start of this proposal means the page that serves it is built to respect that, even where this proposal explicitly defers the features themselves.

This proposal is written to become `docs/20-ARTICLE_EXPERIENCE.md` in this repository's own documentation-first workflow — the "Experience Document" stage that must exist and be approved before an implementation task can begin (per this repo's own stage diagram and `AGENT.md`'s "produce a plan → wait for approval" rule). It does not compete with `docs/18` — that template defines what a *writer* produces (content structure, writing/code guidelines, Definition of Done); this proposal defines what a *reader* experiences (document structure, layout, navigation, components) around that content. Section 1 shows explicitly how the two map onto each other.

---

# A note on scope: this proposal assumes existing infrastructure, not a blank slate

Before designing anything new, it's worth stating plainly what the codebase already provides, so this proposal builds on it rather than re-specifying it:

| Already implemented | Where | What it means for this proposal |
|---|---|---|
| Frontmatter schema (title, description, publishedAt, updatedAt, tags, technologies, difficulty, featured, draft, coverImage, prerequisites, relatedContent, series, seriesOrder, author) | `src/lib/content/schema.ts` | The Article Header's metadata row is a direct, 1:1 render of fields that already exist and are already validated by Zod. No new metadata needs inventing. |
| Heading extraction (h2–h4, deduplicated slugs) | `src/lib/content/toc.ts` | The Table of Contents is a rendering problem, not a parsing problem — the structured data it needs already exists. |
| Reading time calculation | `src/lib/reading-time/` | The Article Header's reading-time figure is already computable from the MDX body. |
| Relationship resolution (`resolveRelated`, `resolvePrerequisites`, `resolveTechnologies`, `resolveSeries`) | `src/lib/content/relationships.ts` | Related Learning, Prerequisites, and Series banners have a resolution seam already built and intentionally left as placeholder-safe (returns the reference even before it can be fully resolved) — this proposal's navigation recommendations plug directly into these functions. |
| MDX rendering pipeline (`next-mdx-remote/rsc` + `remark-gfm`) | `src/lib/content/mdx.tsx` | Already a Server Component with an empty, caller-supplied `components` map — exactly the seam Section 5 of this proposal (MDX Components) is designed to fill. |
| Content loading (`getBySlug`, `getAll`, `filterDrafts`, `sortByPublishedDate`) | `src/lib/content/loader.ts` | Loading a single article by slug, and loading "all articles" for prev/next or related-content resolution, is already solved. |
| `content/knowledge/` directory | `content/knowledge/.gitkeep` | Empty today — this proposal doesn't require any content to exist yet, only the route and rendering layer around it. |

Nothing in this proposal asks for a second content pipeline, a second MDX renderer, or a second metadata schema. It is entirely a presentation-layer and information-architecture proposal on top of infrastructure that already exists.

---

# Routing Resolution Order

`docs/10-Technical Architecture.md` ("Routing") and `docs/11-Content Model.md` ("URL Philosophy") both independently specify a **flat** article URL: `/knowledge/api-idempotency`. `docs/03-SITEMAP.md` independently lists topic URLs at the same depth: `/knowledge/backend`. Task 4.2 already implemented `/knowledge/[topic]` as a real Next.js dynamic route.

Next.js's App Router allows exactly one dynamic segment name per path position — `app/knowledge/[topic]/` and a hypothetical `app/knowledge/[slug]/` cannot coexist as sibling folders; they occupy the same slot. This isn't a hypothetical conflict to resolve later — it's a fact about the routing layer that any future implementation task will hit immediately.

**This is not a case where one document is wrong.** All three documents are correct about what they're each specifying; they just specify two different things at the same URL depth. The resolution is a single dynamic route that disambiguates by content, not by URL shape. This is the canonical resolution order — the exact sequence `/knowledge/[slug]/page.tsx` must follow, in this order, every time:

```
/knowledge/[slug]/page.tsx

  Step 1 — Is `slug` a known Topic?
           (lookup against PLACEHOLDER_TOPICS today, the real Topic
           collection eventually)
           → YES: render the Topic Page experience (Task 4.2). Stop.
           → NO:  continue to Step 2.

  Step 2 — Is `slug` a known Article document?
           (lookup against content/knowledge/*.mdx via the existing
           getBySlug()/getSlugs() loader)
           → YES: render the Engineering Article experience (this proposal). Stop.
           → NO:  continue to Step 3.

  Step 3 — notFound().
```

Topic resolution is checked first, deliberately: topics are the smaller, fixed set (eight today), so checking them first keeps the common case (an article slug) from paying the cost of a topic lookup that almost always misses — a minor performance detail, but also the more important reason to order it this way: topics are structural/navigational and should never be shadowable by a future article that happens to reuse a topic's name (see the naming-discipline note below).

Concretely: the existing `app/knowledge/[topic]/page.tsx` from Task 4.2 is the same file that will grow this branch — not a new sibling route. (Renaming the folder from `[topic]` to `[slug]` is a cosmetic follow-up, not a structural one; the dynamic segment already captures any single path segment under `/knowledge/`, regardless of its parameter name.) I'm surfacing this now, as part of this proposal, specifically so the eventual implementation task doesn't discover it mid-build — it's exactly the kind of "major architectural decision" this proposal is meant to have already made.

One consequence worth stating plainly: a topic slug and an article slug must never collide (e.g., no article can be titled such that its slug becomes `backend`) — Step 1's topic check would shadow it and it would never resolve as an article. This is a naming-discipline requirement for content authors, not a technical one — worth a line in a future content-authoring guide, not a schema constraint.

---

# Required Schema Dependency: `topic`

`articleFrontmatterSchema` (`src/lib/content/schema.ts`) has no field today that assigns an article to a single engineering domain. This proposal depends on one existing, so it's documented here as a named, required dependency — not a "nice to have" folded into a general scalability note — because three separate parts of this proposal cannot function as designed without it.

## Why this can't be `tags`

`tags` already exists on every article and might look like it already solves this, but it's structurally the wrong shape for the job. Per `docs/11-Content Model.md`'s own Tag Model, "Tags represent concepts rather than technologies" and "power filtering and discovery" — tags are free-form, multi-valued, and cross-cutting by design. An article about idempotency keys might reasonably carry `tags: ["idempotency", "apis", "reliability"]` — several concepts, none of them more "primary" than another, and that's correct behavior for a tag.

A topic association is a different kind of fact: it's asking "which single shelf does this document live on?", not "which concepts does it touch?" The same way a physical book has exactly one call number even though it might be cross-referenced under several subject headings, an article needs exactly one `topic` — a controlled-vocabulary value validated against the known set of topic slugs (`PLACEHOLDER_TOPICS` today; the real Topic collection eventually) — separate from, and in addition to, its free-form `tags`.

## What depends on it

| Consumer | Without `topic` | With `topic` |
|---|---|---|
| **Breadcrumbs** (Section 4) | Degrades to `Knowledge → Article Title` — still correct, just less specific | Resolves the full `Knowledge → Topic → Article Title` trail |
| **Topic navigation** — Previous/Next same-topic fallback (Section 4), and Task 4.2's `TopicArticleList` section | No key to query real articles by; both stay populated by placeholder data indefinitely | Previous/Next can fall back to "another article in this domain"; `TopicArticleList` can finally render real content instead of its placeholder set |
| **Related Learning** (Section 4) | Related Topics can only ever come from an article's explicit, hand-authored `relatedContent` | An article's own `topic` lets the system suggest that topic's own curated `Topic.relatedTopics` (already modeled and populated in Task 4.2 — zero new data needed) as a fallback layer beneath article-level relationships, so a freshly-published article with few explicit `relatedContent` entries still surfaces meaningful "continue exploring" options on day one |

That third row is worth being explicit about, since it's a genuine, low-cost integration point rather than a hypothetical one: Task 4.2 already built and populated `Topic.relatedTopics` for all eight topics. The moment an article carries a `topic` field, its Related Learning section can consume that existing data directly — no new relationships need to be authored per-article for the fallback tier to work.

## Recommendation

Add `topic: z.enum([...known topic slugs])` (or an equivalent lookup-validated string) to `articleFrontmatterSchema`. Small, additive, non-breaking — but it's a dependency this proposal has on a file it doesn't own, so implementation should treat it as a precondition, not a follow-up task discovered mid-build.

---

# 1. Information Architecture

## Top-to-bottom document structure

```
┌─────────────────────────────────────────┐
│ Breadcrumb                               │  Where am I?
├─────────────────────────────────────────┤
│ Article Header                           │  What is this? Should I read it?
│   Title · Description · Metadata row     │
│   (difficulty, reading time, dates,      │
│   prerequisites teaser, tags)            │
├─────────────────────────────────────────┤
│ Series Banner (conditional)              │  Is this part of something bigger?
├─────────────────────────────────────────┤
│ Table of Contents                        │  What's the shape of this?
│   (sticky rail on desktop, collapsible   │
│   summary on mobile/tablet)              │
├─────────────────────────────────────────┤
│ Article Body (MDX)                       │  The actual teaching.
│   Introduction                           │
│   The Problem                            │
│   The Core Concept                       │
│   Visual Model (optional)                │
│   Implementation                         │
│   Trade-offs                             │
│   Common Mistakes                        │
│   Real-world Examples                    │
│   Key Takeaways                          │
├─────────────────────────────────────────┤
│ Related Learning                         │  Where do I go next?
│   Prerequisites · Related Topics ·       │
│   Series · Related Case Study/Log        │
├─────────────────────────────────────────┤
│ Previous / Next Navigation               │  Continue the sequence.
├─────────────────────────────────────────┤
│ Author Footer                            │  Who wrote this, and what else?
└─────────────────────────────────────────┘
```

The MDX Body's nine sections are `docs/18-ARTICLE_TEMPLATE.md`'s "Article Structure," rendered verbatim in the order that document already specifies — this proposal does not reorder, rename, or add to that list. Everything above and below the body is the *reading experience* wrapped around content the writer already knows how to structure.

## Why each section exists

**Breadcrumb.** Answers "where am I" before anything else loads visually. A reader arriving from search, a shared link, or an RSS reader has no context otherwise — the breadcrumb (`Knowledge → [Topic, if resolvable] → Article Title`) re-establishes it in one line, per `docs/08-UX Guidelines.md`'s "Navigation Should Be Predictable."

**Article Header.** This is the document's admission decision point. A reader should be able to determine "is this the right article, at the right level, right now?" in under five seconds — title, one-line description, difficulty, reading time, and a prerequisites teaser answer that without requiring any scrolling. This directly mirrors why Task 4.2's Topic page puts its hero before any content list: orientation before commitment.

**Series Banner.** If an article has a `series`/`seriesOrder`, its position in a deliberate sequence is load-bearing information — "this is part 2 of 4" changes how a reader should approach it (they may need part 1 first, or may be relieved that part 3 covers what they were worried about). Surfacing it immediately, not buried in metadata, matches `docs/15-KNOWLEDGE_EXPERIENCE.md`'s "Series navigation should clearly communicate progress."

**Table of Contents.** Gives the reader a map of the terrain before they commit to reading linearly — critical for a long technical piece where a reader may already know "The Problem" and want to jump straight to "Implementation." This is progressive disclosure at the structural level: the TOC discloses *shape* without forcing the reader through *content*.

**Article Body.** The teaching itself — `docs/18`'s nine-part structure already exists specifically to build understanding progressively (problem → concept → implementation → trade-offs → mistakes → takeaways), so this proposal's only job here is to render it without getting in its way.

**Related Learning.** Prevents the article from being a dead end (`docs/04-INFORMATION_ARCHITECTURE.md`'s "Dead-End Prevention" — "every page must contain at least one meaningful next step"). Distinct from Previous/Next: this is *lateral and downward* movement (things this article assumed, things adjacent to it), not sequential movement.

**Previous/Next.** *Sequential* movement, specifically for readers following a deliberate order (a series, or a topic's reading path) — see Section 4 for the exact precedence logic.

**Author Footer.** Minimal, per `docs/15`'s own "Author Footer" requirement — closes the document by connecting it back to the person, not by asking for anything (no newsletter signup, no share prompt; this is a documentation system, not a blog).

## Traceability to the Article Template's Definition of Done

`docs/18` states a reader should finish able to answer six questions. Every one of them is answerable from a section already in this structure — nothing here needs to invent new content to satisfy the Definition of Done, only present what `docs/18` already asks writers to include:

| Definition of Done question | Answered by |
|---|---|
| What is this? | Article Header (title, description) + The Core Concept |
| Why does it exist? | Introduction + The Problem |
| When should I use it? | Trade-offs ("when not to use it" is explicitly the inverse case, discussed together) |
| When should I avoid it? | Trade-offs |
| What trade-offs should I consider? | Trade-offs (dedicated section) |
| What should I learn next? | Key Takeaways + Related Learning + Previous/Next |

---

# 2. Layout Strategy

## Overall document structure

Three zones, not a rigid grid: a **reading column** (primary, always present), a **TOC rail** (secondary, desktop-only, appears/disappears based on viewport, never reflows the reading column's own width), and the site's existing **chrome** (`WorkspaceLayout`'s header/footer, unchanged — this document is not a special case at that level).

## Content width

Reuse `ReadingContainer` (the existing `max-w-reading` / 72ch token already defined in `styles/typography.css` and already named for exactly this purpose in `components/layout/container.tsx`'s own docstring: *"Long-form reading measure for article and journal entry bodies"*). This proposal does not introduce a new width token — one already exists, unused until now, built for this exact page. 72ch is the width where line length stays in the ~60–80 character range research on reading comprehension consistently favors, and it's already the width every other long-form treatment in this codebase caps its text at (`KnowledgeHero`, `TopicHero`, every section's intro paragraph).

## Sidebar strategy: a Table of Contents is not a Sidebar

Task 4.2 explicitly avoided the site's global `Sidebar` component ("avoid sidebar navigation for now... future milestones will introduce richer navigation once article pages exist") — this is that milestone, and the distinction matters:

- `Sidebar` (`components/navigation/sidebar.tsx`) is **browsing navigation** — it shows *other* content the reader hasn't chosen yet (Categories, Series lists), and is explicitly withheld from the Knowledge/Topic pages until it has real groups to show.
- The Article TOC is **reading navigation** — it shows only *this document's own structure*, generated from the exact `Heading[]` list `extractHeadings()` already produces for this specific article. It has no navigational reach outside the document it lives on.

Recommendation: the TOC is not routed through `WorkspaceLayout`'s `sidebar` slot at all. It's a page-local element, scoped to the reading column's layout, never claiming the site-wide `<aside>` landmark `Sidebar` uses. This keeps the two concerns — "browse the library" vs. "navigate this document" — architecturally separate, so a future Topic-page Sidebar (once Categories/Series have real content) and an Article TOC never compete for the same layout slot or the same mental model.

## Responsive behavior

- **Desktop (lg+):** TOC rail visible alongside the reading column, `position: sticky` within its own scroll container so it holds its vertical position as the reader scrolls the body (never fixed to the viewport — it should scroll out of view once the reader passes the footer, not float indefinitely).
- **Tablet/Mobile:** TOC collapses into a single collapsible summary positioned at the top of the article, above the body, using the same native `<details>`/`<summary>` disclosure pattern `SidebarGroup` already established (keyboard support and expand/collapse state from the browser, no custom JS). This matches `docs/15`'s explicit requirement: "Sticky on desktop / Collapsible on mobile."

## Reading flow

Strictly linear, top-to-bottom, single column. Unlike the Knowledge Landing and Topic pages — which are *discovery* surfaces and legitimately use grids (Start Here's 3-column cards, Browse by Topic's tile grid) because a visitor is scanning for a starting point — the Article is a *reading* surface. Multi-column competing content fragments attention exactly when a reading experience should be doing the opposite. The only departure from single-column is the TOC rail, which is explicitly a wayfinding device, not competing content.

## Spacing philosophy

Two different rhythms, deliberately not one:

- **Between structural sections** (Header → TOC → Body → Related Learning → Prev/Next → Author Footer): the existing `Section`/`SECTION_SPACING` scale, same tokens already used site-wide — no new spacing system.
- **Within the MDX body, between H2-level content sections** (Introduction → The Problem → The Core Concept → …): a *tighter*, prose-appropriate rhythm than `Section`'s page-level spacing — these are subsections of one continuous document, not independent page sections, and should read that way. `text-body`'s existing `line-height: 1.7` already establishes the within-paragraph rhythm; the recommendation here is that MDX heading spacing should sit closer to `STACK_GAP`'s "lg" step than `SECTION_SPACING`'s scale, so consecutive H2s feel like chapters in one document, not six separate homepage-style sections stacked on top of each other.

---

# 3. Reading Experience

## Typography

Reuse the existing type scale without exception. `text-h1` is reserved for the article title only, rendered once by the template from frontmatter — never authored inside the MDX body (see Accessibility, Section 7, for why this is an authoring constraint, not just a rendering rule). MDX body headings map directly to `text-h2`–`text-h4`, matching `extractHeadings()`'s already-enforced `depth: 2 | 3 | 4` range. Body text uses the same `text-body` (1rem / 1.7 line-height) already tuned site-wide for comfortable reading, not a special "article" typography scale — consistency across the site is what makes an article feel like part of the same workspace rather than a bolted-on blog template.

## Code readability

Covered fully in Section 6; the reading-experience implication here is that code blocks must visually interrupt prose reading *on purpose* — a clear boundary (monospace, distinct background, its own horizontal scroll container) so a reader always knows instantly whether they're reading explanation or reading code, without needing to parse font weight to tell the difference.

## Section transitions

No dividers, no decorative rules, no animated reveals between MDX sections — whitespace and heading hierarchy alone carry the transition, consistent with `docs/07-DESIGN_SYSTEM.md`'s "Calm Interfaces" ("no unnecessary gradients... no excessive animations") and "Content First" ("every visual element must justify its existence"). A divider between "The Problem" and "The Core Concept" wouldn't communicate anything the H2 doesn't already communicate.

## Cognitive load

Three techniques, all already-spec'd components rather than new inventions:

1. **Progressive disclosure via Accordion** (`docs/09`) — optional deep-dives or advanced asides that would otherwise force every reader through content only some of them need.
2. **Expandable code** — very long examples collapse by default with a line-count teaser (architecture readiness only for now; see Section 9).
3. **The TOC itself** — lets a reader with prior context skip straight to "Implementation" without cognitive tax from re-reading "The Problem."

## Visual hierarchy

Three visually distinct registers, so a skimming reader classifies content type at a glance without reading it closely:

- **Prose** — default typography, the majority of the document.
- **Callouts/knowledge components** (Trade-off Box, Security Note, etc.) — a left-border-plus-label treatment, distinct enough to notice while skimming, restrained enough not to compete with prose for attention (`docs/07`'s "Design North Star: choose the option that better supports learning" is the tie-breaker whenever a callout's prominence is in question).
- **Code** — monospace, its own background plane, unmistakable at a glance.

## Progressive disclosure (summary)

TOC before body, Accordion for optional depth, expandable code for long examples — the same principle applied at three different granularities: document-level, section-level, and block-level.

---

# 4. Navigation

## Breadcrumbs

`Knowledge → [Topic] → Article Title`. The `[Topic]` segment depends on the `topic` field described in "Required Schema Dependency: `topic`" above (articles don't yet carry an explicit topic association) — until that's added, the breadcrumb degrades gracefully to `Knowledge → Article Title`, which is still correct, just less specific. This is not a blocking dependency for this proposal; it's a forward-compatible design (add the field, the breadcrumb gets richer automatically, no redesign).

## Table of Contents

Auto-generated from `extractHeadings()` — no author-maintained TOC, ever (a hand-written TOC drifts from the actual document the moment a heading is edited). Highlights the currently-visible section via `aria-current` as the reader scrolls (scroll-driven, not click-driven) — see Section 7 for the explicit focus-management caveat this requires.

## Previous / Next Navigation

Precedence, most to least meaningful:

1. **Series order**, when the article has `series`/`seriesOrder` — the most intentional, author-defined sequence that exists. "Next" means the next part of the same series.
2. **Same-topic adjacency**, once the `topic` field ("Required Schema Dependency: `topic`," above) exists — falls back to another article in the same domain, in the topic's own reading order if one is defined, else publish order.
3. **Global chronological order**, as the last resort — never nothing. Per `docs/04`'s "Dead-End Prevention," an article must never be a place a reader's journey simply stops.

## Related Concepts

Rendered from `resolveRelated()`/`relatedContent` as a compact set of Knowledge Card previews (`docs/09`), not raw inline links — a reader scanning the bottom of the document should be able to judge relevance from a title + one-line summary, the same information density Start Here and Topic Article List already establish elsewhere in this system. Capped at a small number (recommend 3–4) regardless of how many relationships a well-connected article eventually accumulates — see Section 8.

### Vision: toward a knowledge graph (not current scope)

Today's Related Learning is a flat set of independently-resolved fields — `prerequisites`, `relatedContent`, `series` — each answering its own narrow question. `docs/11-Content Model.md` already names a richer set of relationship *types* than the schema currently models: Prerequisites, Related, Used In, References, and Inspired By, each with its own distinct meaning. Right now they're resolved independently (`relationships.ts`'s four separate functions); nothing yet models them as edges in one traversable graph a reader — or a future recommendation system — could walk.

Worth naming now, purely as a direction, **not a change to what's being implemented**: a future document graph could carry typed relationships beyond today's four, for example:

- **prerequisite-of** — already modeled (`prerequisites`); a hard dependency.
- **builds-upon** — a softer relationship than prerequisite: this document extends ideas from another without strictly requiring it first.
- **alternative-to** — this approach versus that one; a natural pairing with the Comparison MDX component (Section 5) and `docs/11`'s otherwise-unused idea of documenting trade-offs between whole documents, not just within one.
- **leads-to / next-concept** — a suggested continuation, distinct from `series`' strict authored ordering: "readers of this often go on to read that," discoverable rather than declared.

The only architectural consequence this vision should have *today* is a naming and shape discipline, not new functionality: keep `relatedContent` and friends as simple slug arrays for now (exactly as currently specified), but avoid modeling them in a way that would make adding a `type` to each edge later a breaking change rather than an additive one (e.g., a future `relatedContent: { slug: string; type: RelationType }[]` is a compatible superset of today's `relatedContent: string[]`, not a redesign, provided nothing downstream assumes the array only ever contains bare strings). `docs/11`'s own "Future Extensions" list already names graph visualization as a direction — this is the same idea, scoped to what the schema should tolerate later, not what it should do now.

## Prerequisites

Shown twice, at two different levels of commitment, resolving an apparent tension between two source documents rather than picking one: `docs/18` places Prerequisites only in the closing "Related Learning" section; `docs/15`'s Article Experience list places it among the *opening* metadata fields. Both are right, at different moments:

- A **teaser** in the Article Header's metadata row (e.g., "Requires: Database Transactions") — lets a reader self-select out *before* investing time, the same decision-fatigue-reduction goal Start Here already serves elsewhere in this system.
- The **full list**, with real links, in the closing Related Learning section — matching `docs/18` exactly.

---

# 5. MDX Components

Two distinct categories, worth separating explicitly because they're authored differently:

- **Template components** — rendered automatically by the document template from frontmatter/structure. Never invoked inside MDX body content. (Article Header, Breadcrumb, TOC, Series Banner, Related Learning, Previous/Next, Author Footer — all of Section 1's chrome.)
- **MDX-authorable components** — the vocabulary a writer reaches for *inside* the body of an article. This section is about these.

Every component below already has a name and a purpose defined in `docs/09-Component Specification.md`; this proposal doesn't rename or duplicate that spec — it organizes it for article authorship and recommends one implementation strategy (a shared `Callout` primitive) to avoid building eight near-identical components separately.

## The Callout family — one primitive, many variants

`docs/09` names Trade-off Box, Common Mistakes, Performance Tip, Security Note, Best Practice, and Warning as separate components; `docs/15`'s "Callouts" section frames these as *types* of one concept (Note, Tip, Warning, Best Practice, Trade-off, Performance, Security, Architecture). Building eight structurally-identical components (an icon/label, a colored left border, a body) would violate `AGENT.md`'s "prefer composition over duplication." Recommendation: **one `Callout` component with a `type` variant**, satisfying every name in `docs/09` as a specific, documented `type` value rather than a separate component:

| `docs/09` name | `type` value | Used for |
|---|---|---|
| — (general) | `note` | General clarifying asides |
| — (general) | `tip` | Optional but helpful advice |
| Warning | `warning` | Situations that could introduce bugs, security risks, or data loss — used sparingly, per `docs/09`'s own "reserved for" language |
| Security Note | `security` | Authentication, authorization, secrets, encryption, validation |
| Performance Tip | `performance` | Indexing, caching, batching, pooling |
| Trade-off Box | `trade-off` | Structured Why/Pros/Cons/Alternatives — see below |
| Best Practice | `best-practice` | Recommended approaches, with references where relevant |
| Decision Record | `decision` | ADR-style Context/Decision/Consequences/Alternatives |
| — (new, per this task's own suggestion) | `architecture` | Structural/design-decision context, distinct from a trade-off in a single implementation |

**Trade-off Box** deserves a note beyond "a callout variant": `docs/09` gives it explicit internal structure (*Why choose this? / Pros / Cons / Alternatives*) that a generic callout body wouldn't otherwise have. Recommend it as a `Callout type="trade-off"` that additionally accepts structured sub-content (four labeled slots) rather than free-form prose — this is the component every Trade-offs section in every article will use, per `docs/18`'s mandatory section, so its structure should be enforced by the component, not left to writer discipline.

## Sequencing and verification components

| Component | Purpose |
|---|---|
| **Steps** | Ordered, numbered walkthrough for a procedure inside an article (e.g., "how to configure X") — distinct from Checklist below in that steps are *sequential and explanatory* (each step has its own paragraph), not just a list of done/not-done items. |
| **Checklist** (`docs/09`'s "Implementation Checklist") | Step-by-step implementation guidance with progress-tracking affordance — for tutorials and guides specifically, per `docs/09`. |

## Explanation components

| Component | Purpose |
|---|---|
| **Definition** | A short, precisely-scoped block defining one term the moment it's introduced — directly serves `docs/16-WRITING_GUIDELINES.md`'s "Define the concept clearly... use precise terminology" and `docs/18`'s "Core Concept" section's instruction to introduce terminology gradually. Visually lighter than a Callout — closer to a styled definition than an aside. |
| **Comparison** | "X vs. Y" content, rendered as `docs/09`'s existing Table component under the hood, specialized for two/three-column technical comparisons — directly on-brand given how many placeholder article titles in this system are already comparisons ("Optimistic vs Pessimistic Locking," "Horizontal vs Vertical Scaling"). |
| **Table** (`docs/09`) | General tabular data — sticky headers, responsive scrolling, code formatting, inline badges, per spec. |
| **Diagram** (`docs/09`'s "Diagram Block") | Architecture, sequence, request-flow, state-transition, and data-flow diagrams — Mermaid-powered per `docs/10-Technical Architecture.md`. See Section 9 for the rendering-strategy recommendation. |
| **Reference** | A citation-style component for authoritative external sources (RFCs, official docs, papers) — maps to `docs/11-Content Model.md`'s "References" relationship type. Visually distinct from an inline link so a reader recognizes "this is a citation, not just a hyperlink" without following it. |
| **Quote** | Reserved narrowly for quoting a spec, an RFC, or another engineer's documented reasoning — explicitly *not* the "inspirational quote" blog convention, which would conflict with `docs/16`'s "avoid marketing language... exaggeration... unnecessary hype." |

## Interactive components (already spec'd in `docs/09`, confirmed relevant here)

| Component | Purpose |
|---|---|
| **Code Block** | See Section 6 in full. |
| **Command Block** | Shell commands specifically — visually similar to Code Block but with a `$ ` prompt convention (already established site-wide by `ReadmeHero`'s terminal snippet and `Header`'s `git status` example — reused, not reinvented) and no line numbers, since commands are copied-and-run, not referenced by line. |
| **API Endpoint Block** | Method, endpoint, auth, parameters, example request/response — for articles documenting an API directly. |
| **Terminal Output** | Realistic CLI output display, success/error states, monospaced — distinct from Command Block (input vs. output). |
| **Tabs** | Comparisons across languages/approaches (`docs/09`'s own example: Node.js / Go / Python) — useful when "Implementation" needs to show the same concept in more than one stack without duplicating the surrounding prose. |
| **Accordion** | Optional explanations, avoiding excessive nesting per `docs/09`. |

---

# 6. Code Experience

**Syntax highlighting.** Shiki, per `docs/10`. Highlighting should be computed **at build time**, producing static, pre-themed HTML for both light and dark variants — not a client-side highlighter re-tokenizing on every page load. This keeps code blocks renderable entirely as Server Components (no client JS required just to *display* code), directly serving `AGENT.md`'s "Avoid unnecessary client-side JavaScript" and the Lighthouse Performance ≥ 95 target in `docs/10`.

**Filenames.** Optional filename label above the block, shown only when the file's identity is meaningful to the example (e.g., `middleware.ts`) — omitted for conceptual/throwaway snippets, per `docs/16`'s "avoid unnecessary boilerplate."

**Copy actions.** A copy button on every Code Block and Command Block, with the same copy-confirmation micro-feedback `docs/08-UX Guidelines.md` already specifies generally ("copy confirmation" under Feedback). This is the one place in the article's code experience that genuinely needs client interactivity (`onClick` + clipboard API) — the recommendation is a small, isolated Client Component *wrapping only the button*, not the surrounding code block, preserving the server-rendered-by-default approach at a granular level rather than making an entire code block a client boundary because one button inside it needs one.

**Long examples.** Shiki's line-highlighting (per `docs/10`) draws attention to the 2–3 relevant lines in a longer example instead of relying on the reader to scan everything. For genuinely long examples, see Section 9's "Expandable code examples" — not built now, but the component's prop surface should anticipate a `collapsible`/`maxLines` capability from its first implementation, so this isn't a breaking redesign later.

**Inline code.** Standard monospace treatment with a subtle background — reuses the same `font-mono` + muted-background idiom already established by `ReadmeHero`'s terminal snippet, not a new pattern invented for articles.

**Command blocks.** Covered above under Interactive Components — the distinction from a general Code Block (prompt convention, no line numbers, copy-and-run framing) is intentional and should be a genuinely separate component, not a Code Block variant, since its purpose (execute this) differs from Code Block's purpose (understand this).

---

# 7. Accessibility

**Keyboard navigation.** Every interactive element — TOC links, copy buttons, Tabs triggers, Accordion triggers, Previous/Next links — reachable and operable by keyboard alone, using the same `focus-visible`/`focus-within` ring treatment already established consistently across this codebase (Tasks 4.1/4.2's stretched-link cards and rows). No new focus-styling pattern needed; the existing one already covers every interaction type this page introduces.

**Heading hierarchy.** Exactly one `<h1>` per article — the title, rendered by the template from frontmatter, **never authored inside the MDX body**. This is an authoring constraint, not just a rendering one: writers need explicit guidance (a line in a future content-authoring guide, or a lint rule against a leading `#` in MDX body content) that their body content starts at H2, since `extractHeadings()` already only extracts depth 2–4 and silently ignores any H1 a writer might mistakenly include — meaning a stray H1 wouldn't just be a structural mistake, it would be an invisible one until an accessibility audit catches it.

**Screen readers.** The MDX body renders inside a semantic `<article>` element with `aria-labelledby` pointing at the H1. The breadcrumb and TOC are each their own labeled `<nav>` landmark (e.g., `aria-label="Breadcrumb"`, `aria-label="On this page"`), following the same pattern the Sidebar already uses (`aria-label="Secondary"`). Callouts need an accessible label announcing their *type* — a sighted reader gets "security" from color and an icon; a screen-reader user needs the equivalent conveyed in text (e.g., a visually-hidden "Security note:" prefix, or `role="note"` with `aria-label`), so the callout's meaning isn't carried by color alone.

**Focus management.** The TOC's active-section highlighting (as the reader scrolls) must remain a purely visual/`aria-current` indicator — it must never programmatically move keyboard focus as the document scrolls. This is a common accessibility bug in TOC implementations generally (a scroll-triggered focus change unexpectedly yanks a keyboard or screen-reader user's position), and is worth stating explicitly as an anti-pattern to avoid rather than leaving it to be discovered during implementation.

**Color contrast.** Reuse the Design System's existing contrast-safe token pairs (`foreground`/`background`/`muted-foreground`) already verified elsewhere in this codebase. Each Callout `type`'s accent color needs verification in both light and dark themes specifically — this is a QA step against existing tokens, not a request for new ones, since `docs/07-DESIGN_SYSTEM.md` already reserves accent color specifically for "highlighting important information," which is exactly what a callout is.

**Responsive reading.** Code blocks scroll horizontally within their own container (`overflow-x-auto`, matching the existing terminal-snippet precedent) rather than breaking the document's own horizontal scroll. The TOC degrades to a collapsible summary rather than disappearing entirely on small viewports — a mobile reader still needs *some* way to see the document's shape, even without a persistent rail.

---

# 8. Scalability

**The Article document's own scalability strategy is narrowness.** Unlike the Knowledge Landing and Topic pages — which must represent the *whole library* or *whole domain* and therefore scale in surface area as content grows — the Article document's footprint is deliberately bounded: one header, one TOC, one body, a *few* related items, one prev/next pair. It never needs to know how many hundred other articles exist. That separation of concerns (listing pages carry the "how much content exists" burden; the Article document never does) is itself the scalability answer for this specific document, and is worth stating explicitly rather than left implicit.

**Series.** Already schema-supported (`series`, `seriesOrder`). Scales because series membership and ordering are frontmatter-driven, not a hand-maintained list anywhere in code — the same "data-driven, not hardcoded" principle already established by every placeholder-data component in Tasks 4.1/4.2.

**Prerequisites and Related Concepts.** Relationship resolution already exists (`relationships.ts`) but currently returns unresolved placeholders. As real content accumulates, a well-connected article could plausibly gather many related-content references — the design must not render an unbounded list. Recommendation: cap Related Concepts visually (3–4 shown, regardless of how many the frontmatter lists), the same capped-not-unbounded principle Task 4.2's `RelatedTopics` already applies to topic adjacency.

**The missing link: topic association.** The single most consequential scalability gap in this whole system is the missing `topic` field on `articleFrontmatterSchema` — see "Required Schema Dependency: `topic`" above for the full treatment (why it can't just be `tags`, and exactly what it unblocks in breadcrumbs, topic navigation, and Related Learning). Restated here only for its scalability angle: without it, Task 4.2's `TopicArticleList` section has no schema field to query against and stays populated by placeholder data indefinitely, regardless of how much real content gets written.

**Future diagrams.** See Section 9 — the rendering-strategy decision (build-time vs. client-side Mermaid) needs to be made now because it determines the component's Server/Client boundary from its first implementation, which is expensive to change retroactively once dozens of articles use it.

**Interactive examples.** Not built now, but `MDXContent`'s `components` prop is already exactly the shape (`Record<string, ComponentType>`) that makes adding a future `<Playground>` a one-line registry addition, not an architecture change.

**Version history.** `updatedAt` already exists in the schema — the minimum field needed to eventually bootstrap a "last updated" indicator (already recommended in Section 1's header) or a future diff view, without a schema change when that feature is prioritized.

---

# 9. Future Opportunities

Each item below is explicitly **not** being built now — the point of this section is architectural readiness, not a backlog.

**Mermaid diagrams.** `docs/10` already anticipates Mermaid being replaced by custom diagram components later ("Future custom diagram components may replace Mermaid where needed"). Readiness: the MDX-authoring contract for a diagram (raw diagram source in, rendered visual out) should be the stable, author-facing API — decoupled from *how* it's rendered, so swapping the rendering engine later never requires rewriting existing articles. Recommend build-time rendering to static SVG (a Mermaid-to-SVG step in the content pipeline) over client-side `mermaid.js`, for the same reasons as Shiki in Section 6 — performance, and no unnecessary client JavaScript for what's fundamentally static content once rendered.

**Interactive playgrounds.** Readiness: keep the MDX component registry open-ended (already true today) and don't architect any part of the route around a "the body is always static HTML" assumption. A future `<Playground>` component needing genuine client interactivity should be addable as one registry entry, using the same granular-client-island principle already recommended for the Copy Button (Section 6) — the surrounding document stays server-rendered.

**Version history.** Readiness: `updatedAt` exists today. A future implementation could read the existing git history of `content/knowledge/*.mdx` files directly rather than requiring a new versioning system — worth noting as a zero-schema-change path, not a promise to build it.

**Expandable code examples.** Readiness: Code Block's prop surface should include `collapsible`/`maxLines` from its very first implementation (even if unused by every article today), so this becomes a content-level toggle later, not a breaking component redesign.

**Search highlighting.** Readiness: since heading slugs are already deterministic (`extractHeadings()`), a future search result can already deep-link to `#slug` and rely on native browser scroll-to-anchor. Highlighting the matched term on arrival would be a small client-side enhancement layered on top of that existing anchor behavior, not a structural change.

**Reader annotations.** The most speculative item here, correctly scoped to *minimal* architectural influence: MDX's underlying AST already carries positional information that could support paragraph-level anchors later. Not worth designing further now — flagged only so a future implementation doesn't have to guess whether it was considered.

**Reading progress / resume position.** Not explicitly requested by this task, but a natural extension of the reading-progress indicator `docs/08` and `docs/15` already call for. Readiness: a scroll-position bookmark is a `localStorage`-only concern today (no schema, no backend) and becomes an account-level feature only once `docs/10`'s already-listed future "bookmarks"/"authentication" expansion happens — no architecture decision needed now beyond not blocking it.

**Comments/discussion.** Explicitly deferred per `docs/10-Technical Architecture.md`'s own "Future Expansion" list ("future comments"). Not addressed further here.

---

# 10. Future Evolution

Section 9 addressed reader-facing *features* deliberately not being built now. This section is narrower and more structural: it's about the **document model** underneath those features — the schema and content architecture should already be shaped so each of these is an extension when it's eventually prioritized, not a rewrite. Brief by design; each item is a readiness note, not a specification.

**Version history.** `updatedAt` already exists on every document. A future implementation reading the git history of `content/knowledge/*.mdx` directly is a genuine zero-schema-change path (see Section 9) — the document model doesn't need to anticipate this beyond continuing to treat `updatedAt` as meaningful, which it already does.

**Reading state.** Per-reader progress or a resume position (Section 9's "reading progress / resume position") is *reader* state, not *document* state — it belongs to a future per-user layer (bookmarks, authentication — both already named in `docs/10`'s own "Future Expansion" list), never to the document's own schema. Worth stating explicitly so it's never implemented as a document-level field by mistake.

**Semantic cross-references.** Directly the knowledge-graph vision sketched under Section 4's Related Concepts: today's relationship fields should stay simple slug arrays, shaped so a future typed edge (`builds-upon`, `alternative-to`, `leads-to`) is additive rather than a breaking schema migration.

**Annotations.** The most speculative item carried over from Section 9. MDX's underlying AST already carries positional information; a future paragraph- or line-level annotation feature could plausibly be built against that without restructuring the document model itself. Not designed further here.

None of the above changes what's being proposed for implementation now — Sections 1 through 8 remain the complete, current scope. This section exists only so a future contributor never has to wonder whether these directions were considered and rejected, versus considered and deliberately deferred.

---

# Summary of decisions requiring acknowledgment before implementation

Everything in this proposal is a recommendation except two items that are genuine prerequisites for implementation to proceed without rework — each given its own dedicated section above rather than a passing mention, precisely so neither gets treated as optional:

1. **Routing Resolution Order.** The Article is not served by a new sibling route — it extends Task 4.2's existing `/knowledge/[topic]` (or its renamed equivalent, `/knowledge/[slug]`) dynamic route with the topic-then-article-then-404 sequence specified there. This affects how an implementation task should be scoped (it touches an existing file, not just new ones).
2. **Required Schema Dependency: `topic`.** `articleFrontmatterSchema` needs a `topic` field — distinct from `tags` — before real content can exercise the breadcrumb, topic-based navigation, or Related Learning's topic-level fallback (Task 4.2's `TopicArticleList` included). This is a small, additive, non-breaking schema change, but it's a dependency this proposal has on a file it doesn't own.

Everything else — layout, components, navigation, accessibility, code experience, and the Future Evolution direction in Section 10 — is ready to hand to an implementation task as written.
