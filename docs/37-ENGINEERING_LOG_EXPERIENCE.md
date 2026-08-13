# 37 — Engineering Log Experience

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.2's design proposal, following `docs/12-Implementation Roadmap.md`'s Milestone 6 — Core Pages sequence, after Task 6.1 (Homepage Integration & Core Navigation, `docs/35`/`docs/36`, complete and approved).

---

## 1. Purpose

Milestone 5 built the Work/Case Study system and, as part of it, the minimum Engineering Log *infrastructure* needed for Related Engineering Logs to resolve against something real: a registered `engineering-log` content collection, a loader (`getAllEngineeringLogEntries()`), and a resolver (`resolveRelatedEngineeringLogs()`). None of that built a reading experience — `content/engineering-log/` has always been empty by design, and no route has ever existed to read an entry even if one did.

Task 6.1 then wired the homepage's own Engineering Log Preview to that same real (empty) collection, and correctly made it render nothing rather than fabricate content — but a homepage preview section with nowhere to link to is only half a feature. Task 6.2 exists to design the other half: the dedicated `/engineering-log` and `/engineering-log/[slug]` experience every existing Engineering Log link (the homepage preview's CTA, `PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, and every Case Study's Related Engineering Logs section) already points at, none of which currently resolves.

This document is a design proposal only, following the same Documentation → Architecture Review → Implementation Plan → Implementation → Verification → Approval workflow every prior milestone in this repository has used (`docs/24-ENGINEERING_PRINCIPLES.md` Principle 1).

---

## 2. Current State (Reconnaissance)

Everything below was verified against the actual repository, not assumed from prior documentation. Git state at the time of writing: `main`, clean working tree, `eea2289` ("Implement homepage integration with featured articles and engineering logs") as the most recent commit — Task 6.1's own work, already merged.

### Content

`content/engineering-log/` contains exactly one file: `.gitkeep`. **Zero real entries exist.**

`engineering-log` is a registered collection in `lib/content/collections.ts`:

```ts
"engineering-log": {
  dir: path.join(CONTENT_ROOT, "engineering-log"),
  schema: articleFrontmatterSchema,
  type: "engineering-log",
},
```

It uses `articleFrontmatterSchema` **unmodified** — the same shared schema `knowledge/` and `work/` both extend, with **zero engineering-log-specific fields added**. Concretely, an Engineering Log entry's frontmatter today can carry: `title`, `description`, `publishedAt` (required), `updatedAt`, `tags` (free-form, multi-valued), `technologies`, `difficulty`, `featured`, `draft`, `coverImage`, `prerequisites`, `relatedContent`, `series`, `seriesOrder`, `author`. Drafts are supported (`draft: boolean`, default `false`) via the same `filterDrafts()` every collection already uses. Dates are required (`publishedAt: z.coerce.date()`). Slugs are derived from filename, never authored (`lib/content/loader.ts`'s `getSlugs()`), matching every other collection's URL-stability discipline.

**No relationship field points from an Engineering Log entry back to Work.** The only authored relationship today runs the other direction: `workFrontmatterSchema.engineeringLog: string[]` lets a *Case Study* declare which log entries relate to it. An Engineering Log entry has no equivalent field declaring which Case Study it relates to — this is a real, load-bearing gap for §12 below, not an oversight to silently work around.

### Loaders

`lib/content/engineering-logs.ts` (built in Task 5.3, entirely to give Related Engineering Logs something real to resolve against — its own docstring says exactly this) exposes:

```ts
getEngineeringLogSlugs(): string[]
engineeringLogEntryExists(slug: string): boolean
getEngineeringLogEntryBySlug(slug: string): ContentItem<ArticleFrontmatter>
getAllEngineeringLogEntries(): ContentItem<ArticleFrontmatter>[]   // draft-filtered, empty today
```

This is the exact same four-function shape `lib/content/case-studies.ts` and `lib/content/articles.ts` already establish for their own collections (`get*Slugs`, `*Exists`, `get*BySlug`, `getAll*`) — no `EngineeringLogFrontmatter` type exists because none is needed; `ArticleFrontmatter` already fits. No sorting is built into this file — callers sort themselves (Task 6.1's own homepage wiring calls `sortByPublishedDate()` externally, the same generic, collection-agnostic primitive from `lib/content/loader.ts` used everywhere else in this codebase).

`lib/content/case-study-relationships.ts` additionally exposes `resolveRelatedEngineeringLogs(caseStudy, logEntries, limit)` → `ResolvedEngineeringLogSummary[]`, where:

```ts
interface ResolvedEngineeringLogSummary {
  slug: string;
  title: string;
  description: string;
  href: string;        // `/engineering-log/${slug}` — already assumes this exact route shape
  publishedAt: string;  // pre-formatted via formatDate()
}
```

This resolver, and the shape it returns, **already commit to `/engineering-log/[slug]` as the route shape** — this proposal doesn't invent that URL structure, it's inherited from work Task 5.3 already did.

### Existing UI

- **Homepage preview** (`components/home/engineering-log.tsx`, Task 3.6, wired to real data in Task 6.1): the lightest-weight section on the homepage by explicit design — no card, no summary, no citation metadata beyond a quiet `LOG 00N · date` line and a title link. Returns `null` when `entries` is empty (Task 6.1's own fix). Its restraint ("do not use cards again... the leanest entry on the page, on purpose") is a real design signal this proposal should carry into the dedicated experience, not something only the homepage preview cares about.
- **Work's Related Engineering Logs** (`components/work/related-engineering-logs.tsx`, Task 5.3): a quieter row list (title + date), deliberately narrower than Related Knowledge's card treatment — "a log entry is supporting evidence of honesty, not a parallel piece of primary content." Returns `null` when empty.
- **Shared reading infrastructure** (built for Knowledge in Task 4.3, reused unmodified by Work in Task 5.3): `DocumentLayout` (slot-based skeleton — breadcrumb, header, optional banner, TOC + body, closing relationship sections, previous/next), `Breadcrumb`, `TableOfContents` + `ActiveSectionTracker`, `ArticleBody` (the MDX pipeline, `extractHeadings()`), the `Callout` family, `CodeBlock`, `PreviousNext`. All are collection-agnostic already — none of them know or care whether the document they're rendering is a Knowledge article, a Case Study, or (would-be) an Engineering Log entry.
- **Navigation**: `PRIMARY_NAVIGATION` and `FOOTER_NAVIGATION` (`lib/navigation/config.ts`) already list `{ label: "Engineering Log", href: "/engineering-log" }` — unchanged since Milestone 2, correctly pointing at a route that has never existed yet.

### Routes

**Neither `/engineering-log` nor `/engineering-log/[slug]` exists.** No file under `src/app/` matches either path. Confirmed via direct filesystem search, not inferred.

### 404 / not-found infrastructure

**No custom `app/not-found.tsx` exists anywhere in this repository.** `/work/[slug]` and `/knowledge/[slug]` both already call Next.js's `notFound()` (from `next/navigation`) on an unresolvable slug, which — absent a custom `not-found.tsx` — renders Next's built-in, unstyled default 404 page. This is a pre-existing, sitewide gap, not something Task 6.2 introduces or needs to fix; flagged here because `/engineering-log/[slug]`'s own invalid-slug behavior will inherit the identical, already-accepted behavior every other dynamic route in this codebase already has.

### Metadata / SEO infrastructure

Unchanged since `docs/35`'s own findings: `lib/metadata/`, `lib/seo/` are empty (`.gitkeep` only); no `SITE_URL`; every real route defines its own plain `export const metadata`/`generateMetadata`. Nothing new to report.

---

## 3. Discrepancies Found

- **`docs/03-SITEMAP.md`'s Engineering Log section** already describes exactly the right philosophy ("chronicle engineering discoveries and lessons as they happen — dated, narrower, and more personal than a Knowledge article... unlike Knowledge, entries aren't organized by fixed category — chronology is the primary structure") — this document and the current codebase agree; no discrepancy to resolve here, only to build from.
- **No discrepancy between documentation and code on scope**: every relevant doc (`docs/03`, `docs/25`–`34`, `docs/35`) already treats the Engineering Log as *unimplemented, future work* — nothing claims it exists today, and the code confirms it doesn't. This proposal isn't reconciling a conflict; it's the first document actually specifying the experience those other documents all deferred to.
- **One real, load-bearing gap, not a discrepancy**: the one-directional `Work → Log` relationship field (§2) means a Log Detail page cannot show "which Case Study does this relate to" from its own frontmatter today. §12 resolves this without a schema change.

---

## 4. Core Architectural Definition

Restated because it governs every decision below, not just as preamble:

```
Engineering Log        Case Study              Knowledge
     │                      │                       │
     ▼                      ▼                       ▼
Raw discovery/         Refined engineering      Reusable engineering
process                conclusion                explanation
```

An Engineering Log entry is **not** a smaller Case Study, a blog post, or a duplicate Knowledge article. It's the record of what was actually happening *before* a Case Study's polished account existed — a debugging session, a failed approach, an unexpected result, a small breakthrough — preserved with its original uncertainty intact, not retroactively tidied into "and then I chose the right answer." `docs/31-CASE_STUDY_EXPERIENCE.md` §6 already states the relationship precisely: *"A polished Engineering Decisions section can read as though the right answer was obvious from the start. Linking to the log where it wasn't... is what lets a reader trust that the reasoning shown is real, not reconstructed after the fact."* Every design choice in this proposal — visual restraint, no engineered "conclusion" section, chronology over taxonomy — exists to keep that honesty structurally true, not just editorially intended.

---

## 5. Problem Statement

The repository has a real Engineering Log *content model and resolver layer* (Milestone 5) and a real *homepage integration point* (Task 6.1), but no way for a reader to actually discover, browse, or read an entry — every existing link into this system currently 404s. Task 6.2 turns the existing infrastructure into a complete, navigable reading experience: discovery (an index, browsable chronologically), reading (an individual entry, rendered with the same MDX pipeline every other document uses), and onward navigation (back into Work/Knowledge where a real relationship exists, never fabricated).

---

## 6. Goals

- Establish `/engineering-log` as the one, canonical Engineering Log destination (mirroring `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md`'s "canonical browsing surface" principle, applied here).
- Establish `/engineering-log/[slug]` as the individual entry reading experience.
- Chronological discovery, not category-based — matching `docs/03`'s own stated principle for this collection specifically.
- Reuse the existing MDX rendering pipeline, `DocumentLayout` skeleton, and every reading-navigation primitive (TOC, Breadcrumb, Previous/Next) exactly as Work already reused them from Knowledge.
- A visually restrained presentation that reads as a raw journal, not a second Case Study Library — carrying forward `EngineeringLog`'s and `RelatedEngineeringLogs`' own already-established restraint.
- Real, resolver-based relationships to Work (§12) and Knowledge (§13) — never fabricated, never duplicated.
- Honest empty and invalid-slug states.
- Responsive, accessible, performant, server-first — no new standard this document needs to invent; the existing bar every prior document reading experience already met.
- A bounded SEO/metadata scope matching what `/work/[slug]` and `/knowledge/[slug]` already do — nothing more.

## 7. Non-Goals

Explicitly excluded from Task 6.2:

- Comments, likes, reactions, user accounts, bookmarks, reading progress, analytics — none exist anywhere in this codebase; none are introduced here.
- Full-text search, advanced filtering, a tags dashboard — `docs/12`'s own Milestone 7 (Discovery) scope, not Core Pages.
- RSS implementation — `docs/12`'s own Milestone 6 deliverable list names it separately from Engineering Log; a future Task 6.x, not this one.
- Social sharing infrastructure — none exists sitewide; not introduced here.
- A CMS, a database, an external API, an admin editor, AI-generated summaries — none of these exist anywhere in this codebase's architecture, and Task 6.2 doesn't need any of them; the existing MDX content engine already does everything required.
- Turning Engineering Logs into Case Studies, or building any machinery that would let one "graduate" into the other automatically — the two remain editorially and structurally distinct collections, connected only through the existing, explicit relationship fields (§12).
- Redesigning `/work` or `/knowledge` — this proposal reuses their infrastructure; it doesn't touch their own pages, components, or content.
- A custom `app/not-found.tsx` — the pre-existing sitewide gap (§2) stays exactly that; fixing it, if ever done, is a separate, cross-cutting task, not folded in here as a side effect.

None of these boundaries need to move based on anything found in the repository.

---

## 8. Information Architecture

```
Engineering Log
        │
        ▼
Log Index (/engineering-log)
        │
        ├── Log Index Header        Where am I, how much is here?
        ├── Chronological Listing    Every real entry, newest first
        └── Continue Exploring       Onward into Work / Knowledge

Log Detail (/engineering-log/[slug])
        │
        ├── Breadcrumb               Engineering Log → Title
        ├── Entry Header             Title, date, tags — not a Case Study header
        ├── Table of Contents        Same TableOfContents component, degrades to nothing for short entries
        ├── Entry Body (MDX)         The raw account itself
        ├── Related Work              Reverse-resolved — see §12
        ├── Related Knowledge         Editorial, resolveArticleReferences() — see §13
        └── Previous / Next           Pure chronological adjacency — see §14
```

### Log Index — section by section

**Log Index Header.** *Where am I, how much is here?* Orientation only, no argument to substantiate — the same role `LibraryHeader` plays for the Case Study Library (`docs/30` §1). States a real, honest count (`getAllEngineeringLogEntries().length`), never a guess.

**Chronological Listing.** *What has been logged, in order?* The one true collection this page exists to present. Newest-first by `publishedAt` (`sortByPublishedDate()`, already generic and already used this way by Task 6.1's homepage wiring) — no grouping by tag, technology, or any other facet, because `docs/03` is explicit this collection's organizing principle is chronology, not taxonomy, unlike Knowledge's topics or Work's domains. Each entry: title, date, and — unlike the homepage's deliberately bare preview — the one-line `description` already in frontmatter, since an index page (unlike a homepage preview competing with six other sections) can afford one more line without losing restraint. No "featured" tier, no filtering UI — a flat, honest, chronological list, exactly matching `docs/30` §4's own "the unfiltered listing must already be a complete, browsable archive in its own right" principle, applied here with recency as the *only* signal (unlike Work's "significance, not convenience" ordering — chronology *is* the correct signal for a journal, per `docs/03`'s own framing, not a placeholder for a better one).

**Continue Exploring.** *Where do I go next?* Reuses the same `ContinueExploring` component (`components/work/continue-exploring.tsx`, already generalized in Task 5.2 to accept `title`/`introduction`/`links` as props rather than importing its own copy) — the identical "contextual, never generic" discipline `docs/29` §1 established, applied here: links into `/work` and `/knowledge`, not a repeat of what the page just showed.

### Log Detail — section by section

**Breadcrumb.** `Engineering Log → {title}` — two segments, since there's no intermediate category tier (unlike Work's `Work → Case Study Library → {title}`) — chronology has no middle rung to name.

**Entry Header.** *What is this, when did it happen?* Deliberately **not** a reuse of `ProjectHeader` (Work's own header, built around Domain/Status/Timeline/Difficulty — none of which an Engineering Log entry has or needs) and **not** a reuse of `DocumentHeader` (Knowledge's own header, built around a required `topic`, which Engineering Log entries don't carry). A new, minimal header: title, date, and `tags` rendered as a quiet, low-weight line — closer to the homepage preview's own restraint (`LOG 00N · date`) than to either existing document header's metadata row. See §17 for why reusing either existing header would misrepresent this collection.

**Table of Contents.** Reused unmodified (`components/content/table-of-contents.tsx`) — it already renders nothing when a document has few or no headings (a short log entry), and becomes genuinely useful for the rare long investigation write-up, without this proposal needing two different reading layouts for "short" vs. "long" entries.

**Entry Body (MDX).** The account itself, rendered through the same `ArticleBody`/MDX pipeline every collection already shares. No imposed section structure (no fifteen-part template the way Case Studies have one) — `docs/03`'s own Engineering Log purpose statement asks only that an entry surface "what was the challenge, what was the outcome, what technologies were involved," which is guidance for what an author should *cover*, not a structural template this experience should *enforce*. Imposing Case Study-style headings here would be exactly the "polished conclusion" framing this collection exists to avoid.

**Related Work.** *What Case Study or Case Studies, if any, did this feed into?* See §12 — computed, not authored on the entry itself, and always a collection (the relationship is many-to-many, not one-to-one — §12's own Cardinality subsection).

**Related Knowledge.** *What concept does this touch?* See §13 — reuses `relatedContent`, already on `articleFrontmatterSchema`, exactly as Knowledge and Work both already use it.

**Previous / Next.** *What was logged just before/after this?* See §14 — pure chronological adjacency, the one place in this whole workspace where "previous/next by date" is the *correct*, not merely convenient, answer.

---

## 9. Reading / Discovery Journey

```
Arrival (homepage preview, primary nav, a Case Study's Related Engineering Logs, or a direct link)
        ↓
Log Index — "how much has been logged, and does anything catch my eye?"
        ↓
Log Detail — "what actually happened, in the author's own words, as it happened"
        ↓
Related Work / Related Knowledge — "where did this go, or what does it touch conceptually?"
        ↓
Previous / Next — "keep reading the journal, in order"
        ↓
Continue Exploring (Index only) / global nav — back into Work or Knowledge
```

Every arrival point already exists and already points here correctly (§2) — this journey's job is only to make the destination real, not to redesign any of the paths that already lead to it. The journey deliberately has no "evidence → argument → synthesis" escalation the way the Work Landing or a Case Study does (`docs/29` §2, `docs/31` §2) — a journal isn't building a case for anything; a reader should be able to land on any single entry via a direct link and get the full value of that one entry without needing the Index's context first, the same "leave with something even from a partial read" standard `docs/20`/`docs/31` already hold every other document type to.

---

## 10. Navigation

`PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, the homepage's Engineering Log Preview CTA, and every Case Study's Related Engineering Logs links **all already point at the correct destinations** (`/engineering-log`, `/engineering-log/[slug]`) — Task 6.2 makes those links resolve; it does not change where any of them point. No new navigation entry point is proposed. Breadcrumb, Previous/Next, and the Index's own Continue Exploring section are the only navigation surfaces this proposal adds, all built from existing, reused components.

---

## 11. Content Architecture

```
content/engineering-log/*.mdx  (articleFrontmatterSchema — unmodified)
                │
                ▼
       lib/content/engineering-logs.ts  (existing, unmodified)
                │
        ┌───────┴────────┐
        ▼                ▼
   Log Index          Log Detail
```

No new content collection. No new frontmatter fields **required** for the Index or the entry body itself — `title`, `description`, `publishedAt`, `tags`, `draft` already cover everything §8 above actually renders. `relatedContent` (already present, already used identically by Knowledge and Work) is reused for §13 without any change. The one open question this section flags rather than resolves is §12's Related Work relationship, addressed next.

---

## 12. Relationship with Work

**The gap (§2, restated precisely):** `WorkFrontmatter.engineeringLog: string[]` already lets a Case Study declare "these log entries relate to me." Nothing lets a log entry declare "I relate to this Case Study" from its own frontmatter — that field doesn't exist, and this proposal does not recommend adding one.

### Cardinality — verified against the actual schema and data, not assumed

Inspected directly, per this task's own instruction not to invent a constraint:

- **Schema:** `workFrontmatterSchema.engineeringLog: z.array(z.string()).default([])` (`lib/content/schema.ts`) — a plain array of strings, validated per-document by Zod. Zod has no visibility into any *other* document while validating one, so nothing at the schema level can or does enforce that a given log slug appears in at most one Case Study's array.
- **Loader / collection registry:** `lib/content/loader.ts` and `lib/content/collections.ts` contain no uniqueness check, no index, and no cross-document validation of any kind over `engineeringLog` — confirmed by direct inspection, not inferred from absence of documentation.
- **The existing resolver:** `resolveRelatedEngineeringLogs()` (`case-study-relationships.ts`) resolves one Case Study's `engineeringLog` array against the Log collection in complete isolation — it has no awareness of, and places no constraint on, what any *other* Case Study's own array might also contain.
- **Real data today:** all four real Case Studies (`vaultpay.mdx`, `gohunt.mdx`, `haya.mdx`, `cookeaze.mdx`) currently declare `engineeringLog: []` — empty. There is no existing real-content precedent demonstrating either cardinality in practice; the answer has to come from what the schema *permits*, not from what's been authored so far.

**Conclusion: the existing architecture establishes a many-to-many relationship, not a one-to-one invariant.** Nothing prevents two independent Case Studies from each naming the same log slug in their own `engineeringLog` array (e.g. a single debugging session that fed into both a payments Case Study and a separate infrastructure Case Study is a legitimate, realistic scenario the schema already accommodates without any change). This proposal does not introduce this cardinality — it already exists, unenforced-but-permitted, in the schema Task 5.3 shipped; this section only makes it explicit, since no prior document had stated it either way.

**The resolution — reverse-lookup, not a new field, and never a "pick one":** the exact relationship a Log Detail page needs ("which Case Study or Case Studies point at me") is already fully derivable from data that already exists, in exactly one place: scan `getAllCaseStudies()` for **every** case study whose `frontmatter.engineeringLog` array includes this log entry's slug — not the first match, not an arbitrary selection. This is a **new resolver function**, not a new schema field — the smallest possible extension, and the one this document recommends:

```ts
// Conceptual signature only — no implementation authorized by this document.
function resolveRelatedWorkForLog(
  logEntry: EngineeringLogItem,
  caseStudies: WorkItem[] = getAllCaseStudies(),
): ResolvedArticleSummary[] // always a collection — see Cardinality above; never a single item or null-vs-one union
```

Because cardinality is many-to-many, this function's return type is a **collection**, full stop — never `ResolvedArticleSummary | null`, never a signature that silently assumes at most one match and returns whichever it finds first. Capped the same way every other relationship group in this codebase already caps itself (`DEFAULT_RELATIONSHIP_LIMIT`, currently 4, from `case-study-relationships.ts`) — not because more than a handful of Case Studies are expected to share one log entry in practice, but because the resolver's contract shouldn't quietly change shape the day a second one shows up. This keeps the authored fact ("this case study's process is documented in these logs") in exactly the one place it already lives — `docs/24` Principle 3 (Single Source of Truth) applied to a *relationship*, not just a dataset, the identical discipline `docs/31` §7 already used to defer Related Case Studies rather than inventing a second relationship model for an already-derivable fact.

**If the invariant were instead one-to-one:** it isn't (see above), so no such handling is proposed. Recorded here only so a future reader doesn't have to re-derive why: had the schema instead enforced (or the architecture assumed) at most one Case Study per log entry, the correct response to a violation would still never be "silently pick one" — an unenforced invariant that's actually violated is a content-authoring error, not a resolver design problem, and the honest behavior would be to surface all matches anyway (the same "resolve what's real, never hide a fact to preserve an assumption" discipline this codebase applies everywhere else) rather than have the resolver quietly mask a real inconsistency. Since the invariant doesn't exist, this is moot in practice, but the principle — a resolver never guesses which of several true facts to report — holds either way.

### UI Behavior by Count

| Related Work count | Behavior |
|---|---|
| **Zero** | The Related Work section renders nothing (`null`) — the same precedent `RelatedEngineeringLogs`, `RelatedKnowledge`, and `PreviousNext` all already establish for an empty relationship group. Not an empty heading, not a "no related work yet" message. |
| **One** | The section renders with a single row — title + a quiet citation line (domain/status, mirroring `RelatedEngineeringLogs`' own single-row idiom on the Work side), using whatever single-item layout the section's own component already renders for a one-element list. No special-cased "singular" layout distinct from the multi-item case — a one-row list and a list that happens to contain one row are the same component state, not two different ones to build and maintain separately. |
| **Multiple (up to the cap)** | The same section, same row component, repeated — a short list, capped at `DEFAULT_RELATIONSHIP_LIMIT` (4), the identical treatment every other multi-item relationship group in this codebase already uses (`RelatedKnowledge`'s card grid, `RelatedEngineeringLogs`' row list). No ranking or "primary" designation among the matches — Case Studies are not ordered by significance here the way `getProjectLibrary()`'s own array is; a reverse-lookup over an unordered set of matches should present them in a stable, unranked order (e.g. the same order `getAllCaseStudies()` already returns), not invent a new significance judgment this proposal was never asked to make. |

This mirrors the exact pattern `RelatedKnowledge` and `RelatedEngineeringLogs` already establish for their own relationship groups (§15) — a single component, `null` when empty, otherwise a list whose length is whatever the resolved data actually contains, never a UI that assumes or special-cases "there's only ever one."

**Where this resolver lives:** `lib/content/engineering-logs.ts` is the natural home (mirroring how `case-study-relationships.ts` holds Work-scoped relationship logic, and `relationships.ts` holds Knowledge-scoped logic) — a small, Engineering-Log-scoped relationship file, or a function added directly to the existing `engineering-logs.ts`, is a smaller extension than introducing a fourth relationship file for one function; the implementation task should decide based on how large this file grows, not something this proposal needs to fix in advance.

**What this section explicitly does not do:** it does not build "Related Case Studies" in the general sense `docs/31` §7 already deferred (theme/domain adjacency across the whole Work collection) — this is narrower and already fully authorized by existing, real data: literally "does any Case Study's own frontmatter name this exact log entry." No inference, no keyword matching, no new taxonomy.

---

## 13. Relationship with Knowledge

No new mechanism. `relatedContent` (already on `articleFrontmatterSchema`, already resolved by the existing, exported `resolveArticleReferences()` in `lib/content/relationships.ts`) works identically for an Engineering Log entry as it already does for a Knowledge article's Related Concepts or a Case Study's Related Knowledge — same function, same cap (`DEFAULT_RELATIONSHIP_LIMIT`, currently 4), same "silently skip an unresolvable slug" honesty guarantee. This is the same "point, don't duplicate" discipline `docs/34-KNOWLEDGE_INTEGRATION.md` already established for Work, applied here without needing to be re-derived — Engineering Logs and Case Studies aren't different enough in their relationship to Knowledge to need a different mechanism.

---

## 14. Previous / Next Navigation

**Pure chronological adjacency — deliberately the one collection in this workspace where this is the *correct* signal, not a fallback.** `docs/31` §7 explicitly rejected chronology as Work's Previous/Next signal because Work's default order means engineering *significance* (`docs/30` §3), and falling back to publish order would misrepresent that. Engineering Log has no such competing signal to misrepresent — `docs/03`'s own stated organizing principle for this collection *is* chronology, so `sortByPublishedDate()`-based adjacency (the immediate next/previous entry by `publishedAt`) is the correct design here, not a last resort the way it would be for Work.

```ts
// Conceptual signature only.
function resolvePreviousNextLog(
  logEntry: EngineeringLogItem,
  allEntries: EngineeringLogItem[] = getAllEngineeringLogEntries(),
): { previous: ResolvedArticleSummary | null; next: ResolvedArticleSummary | null }
```

Reuses the existing `PreviousNext` component (`components/content/previous-next.tsx`) unmodified — it already renders `null` when both sides are absent, and already expects the `ResolvedArticleSummary`-shaped pair every other Previous/Next consumer already provides it, the same "reuse the presentation component, only add resolution" pattern Task 5.3 already proved out for Work.

---

## 15. Component Reuse

| Existing Component | Reuse Purpose | Modification Needed? |
|---|---|---|
| `DocumentLayout` | Both Index and Detail's structural skeleton | None — Detail uses it exactly as Work/Knowledge already do; Index does not need it (no TOC/body/relationship slots apply to a listing page — Index composes `Section`/`Stack` directly, the same pattern `app/work/library/page.tsx` already uses) |
| `Breadcrumb` | Detail's ancestry | None |
| `TableOfContents` + `ActiveSectionTracker` | Detail's reading navigation | None |
| `ArticleBody` / MDX pipeline | Detail's body | None |
| `Callout` family, `CodeBlock` | Detail's body content | None |
| `PreviousNext` | Detail's closing navigation | None |
| `ContinueExploring` | Index's closing section | None — same generalized props-driven component Work's Landing and Library already share |
| `RelatedKnowledge`-style card/row idiom | Detail's Related Knowledge | Reused as a *pattern*, not the literal Work component (route-ownership discipline — every route owns its own section components, per `FeaturedCaseStudies`' own established precedent) — a new, Engineering-Log-scoped component following the identical visual idiom |
| Stretched-link row idiom (used by `ProjectLibrary`, `RecentlyPublished`, `RelatedEngineeringLogs`, `EngineeringLog`) | Log Index listing rows, Related Work rows | Reused as a pattern, new component instances scoped to this route, same discipline as above |

**New components genuinely necessary** (all Server Components, all following existing idioms rather than inventing new visual language): a Log Index page composition, a Log Entry Header (§8's explicit reasoning for why this can't reuse `ProjectHeader`/`DocumentHeader`), a Log listing row component, and a Related Work section component. None of these introduce a new *pattern* — each is a recombination of idioms (title-as-link, quiet citation line, `null`-when-empty) that already exist in at least three other places in this codebase.

---

## 16. Data / Loader Architecture

**Reused, unmodified:** `getAllEngineeringLogEntries()`, `getEngineeringLogEntryBySlug()`, `engineeringLogEntryExists()`, `getEngineeringLogSlugs()`, `sortByPublishedDate()`, `resolveArticleReferences()`, `extractHeadings()`, `formatDate()`.

**New, smallest necessary:** `resolveRelatedWorkForLog()` (§12) and `resolvePreviousNextLog()` (§14) — two small resolver functions, not a new loader, not a new content collection, not a schema change. Both follow the exact "optional-with-a-default" argument shape (`entries = getAllEngineeringLogEntries()`) every other resolver in this codebase already uses, so a caller that's already fetched the collection (e.g. the Index page, which needs the full list anyway) can hand it to the Detail resolvers without a second disk read — the same discipline `app/work/[slug]/page.tsx` already applies (`getAllArticles()`, `getAllEngineeringLogEntries()`, `getAllCaseStudies()` each read once per request, shared across every resolver that needs them).

No new type beyond, at most, a narrow `ResolvedEngineeringLogSummary`-adjacent shape if Related Work's summary needs fields `ResolvedArticleSummary` doesn't carry (e.g. a Case Study's `domain`) — an implementation-task decision, not fixed here, following the same "don't invent a field this document didn't ask a component to render" discipline `docs/31`'s own schema note already established.

---

## 17. Visual Hierarchy / Design Restraint

The governing risk this section exists to name directly: it would be easy to build `/engineering-log/[slug]` by copying `/work/[slug]`'s own markup and swapping the header, and end up with something that *looks* like a smaller Case Study — badges, a metadata-heavy header, a polished multi-section body. That would be the exact failure mode §4 exists to prevent.

**Highest restraint, not highest emphasis:** unlike a Case Study (where Problem/Architecture/Decisions carry the *most* visual weight) or a Knowledge article (where the core concept does), an Engineering Log entry's own governing visual rule is **quietness throughout** — no section should be dressed up to look more conclusive than the entry actually is. This directly extends `EngineeringLog`'s and `RelatedEngineeringLogs`' own already-established restraint (no cards, minimal metadata, a title and a date) from the homepage/Work-relationship contexts into the entry's own dedicated page.

**Explicitly rejected, regardless of how long or short an entry is:** a Case Study-style metadata row (Domain/Status/Difficulty badges — an entry has none of these facts to show), a "Key Takeaways" or "Outcome" callout imposed structurally (an entry may genuinely have no resolved outcome yet — that's honest, not incomplete), a card-based listing on the Index (the flat, chronological row list `docs/03`'s own framing already implies is correct here, not a missed opportunity for cards).

---

## 18. Responsive Behavior

No new pattern. Index reuses the same list/row responsive behavior already proven on `/work/library` and `/knowledge`'s `RecentlyPublished`; Detail reuses `DocumentContainer`'s already-responsive TOC/body two-zone layout (stacked below `lg`, side-by-side above) exactly as `/work/[slug]` and `/knowledge/[slug]` already do. Nothing in this proposal introduces a table, a wide code block by default, or any content type with different overflow risk than what those two routes already handle correctly.

---

## 19. Accessibility

No new pattern. Exactly one `<h1>` per page (Index's own header, or Detail's Entry Header title); `Breadcrumb`'s existing `aria-current="page"` discipline; `TableOfContents`'s existing landmark and active-state behavior; `PreviousNext`'s existing `<nav aria-label="Previous and next article">` (or an Engineering-Log-appropriate label variant — an implementation-task wording decision, not an architecture one); visible focus via the same `focus-visible:ring-2` token every interactive element in this codebase already uses; reduced motion respected wherever any hover/transition is reused from an existing idiom. No accessibility requirement here depends on visual appearance alone.

---

## 20. Performance

No new client component anywhere in this proposal — both Index and Detail are fully server-rendered, reusing exactly the same server-first infrastructure `/work` and `/knowledge` already prove out at this content scale. `generateStaticParams()` on `/engineering-log/[slug]` mirrors `/work/[slug]`'s own pattern exactly. No image handling is proposed (no `coverImage` rendering is specified by §8 — an implementation-task decision if ever needed, not assumed here). No new performance infrastructure required.

---

## 21. SEO / Metadata Boundary

Both routes gain their own `export const metadata` / `generateMetadata`, matching `/work`'s and `/work/[slug]`'s exact existing pattern (`generateMetadata` returning `{}` for an unresolvable slug, matched by a `notFound()` call in the page body itself). No canonical URL, no Open Graph, no structured data — the identical, already-stated boundary `docs/35` §19 drew for the homepage, unchanged here: this workspace has no `SITE_URL` yet, and introducing one for this task alone would be the same one-off infrastructure every prior proposal in this family has declined to build ahead of need.

---

## 22. Empty / Failure States

| Condition | Behavior |
|---|---|
| `content/engineering-log/` has zero real entries (today's actual state) | `/engineering-log` renders its Index Header (an honest "0 entries" count) and an empty-state message in place of the listing — never a fabricated entry. This differs from the *homepage preview's* choice to render nothing at all (Task 6.1) specifically because the Index **is** the collection's own dedicated page — a reader who navigated here deliberately should see an honest "nothing here yet," not the page rendering as if it doesn't exist; the homepage's `null`-when-empty applies to a *preview section competing for attention on another page*, a different context with a different correct answer. |
| An invalid `/engineering-log/[slug]` | `notFound()` — the same call, same resulting (currently default, unstyled) 404 behavior every other dynamic route in this codebase already has (§2's own flagged, pre-existing, out-of-scope gap). |
| An entry has no resolvable Related Work | Section renders nothing (`null`), matching `RelatedEngineeringLogs`' own existing precedent on the Work side. See §12's "UI Behavior by Count" for the zero/one/multiple treatment in full — this row covers only the zero case. |
| An entry has no resolvable Related Knowledge | Section renders nothing (`null`), matching `RelatedKnowledge`'s own existing precedent. |
| An entry is the only one in the collection (no Previous/Next) | `PreviousNext` renders `null`, its own already-existing behavior, unmodified. |
| A `relatedContent` slug doesn't resolve | Silently skipped — `resolveArticleReferences()`'s existing, unmodified behavior. |

---

## 23. Architecture Decisions

### D1 — Reuse the Existing Reading Infrastructure Wholesale

**Context:** Knowledge (Task 4.3) and Work (Task 5.3) each built (Work) or established (Knowledge) the same `DocumentLayout`/`Breadcrumb`/`TableOfContents`/`ArticleBody`/`PreviousNext` reading skeleton.

**Options Considered:** (a) a third, Engineering-Log-specific reading layout tuned for a "lighter" document; (b) the same skeleton, with a narrower, Log-appropriate header and no imposed body structure.

**Chosen Approach:** (b).

**Rationale:** the skeleton itself (breadcrumb → header → TOC+body → relationships → prev/next) is already collection-agnostic — nothing about it assumes Knowledge's `topic` or Work's fifteen-section body. The *content* inside each slot is what needs to read as "raw journal" (§17), not the structural skeleton around it. Building a third layout primitive for a difference that's entirely about header/body content, not structure, would be exactly the "parallel system" `docs/24` Principle 2 warns against.

**Trade-offs:** none identified — this is a strict reuse with no compromise found.

**Consequences:** the eventual implementation task inherits every accessibility, responsive, and performance guarantee `DocumentLayout` already carries, for free.

### D2 — Related Work via Reverse Resolution, Not a New Schema Field

See §12 in full. Recorded here as a decision because it was a real fork: add a field, or compute the relationship. Chosen: compute. Rationale, trade-offs, and consequences are as stated in §12.

### D3 — Chronology, Not a Second Facet System, Governs This Collection

**Context:** Work has domain/theme facets (`docs/30` §3); Knowledge has topics. Engineering Log could, in principle, gain similar structure.

**Options Considered:** (a) introduce a facet/category system for Engineering Log, mirroring Work's Browse Lenses; (b) chronology only, no facets, matching `docs/03`'s own stated design for this collection.

**Chosen Approach:** (b).

**Rationale:** `docs/03-SITEMAP.md` already made this call explicitly, before this proposal existed ("unlike Knowledge, entries aren't organized by fixed category — chronology is the primary structure... future archival grouping... may be added without changing the site's structure"). This proposal inherits that decision rather than reopening it, and deliberately leaves the door D3's own source document already left open (future grouping by year/technology) as a documented future possibility, not current scope.

**Trade-offs:** a very large archive (hundreds of entries) would eventually need some form of pagination or grouping — explicitly deferred, matching the same "don't solve hypothetical scale problems" discipline `docs/30` §9 already modeled for Work at a much larger content volume than this collection is likely to reach soon.

**Consequences:** the Index page stays structurally simple (§8) regardless of how many real entries eventually exist, until a future task decides otherwise with real evidence that it's needed.

### D4 — No New Header Component Reuse from Work or Knowledge

See §8 ("Entry Header") and §17 for the full reasoning. Recorded as a decision because reusing `ProjectHeader` or `DocumentHeader` was a real, tempting option (less new code) rejected specifically because both carry metadata vocabularies (Domain/Status/Difficulty; topic) an Engineering Log entry doesn't have, and forcing it to have them would fabricate metadata this collection was never designed to carry.

---

## 24. Implementation Scope

### Must implement

- `app/engineering-log/page.tsx` — the Index.
- `app/engineering-log/[slug]/page.tsx` — the Detail route, with `generateStaticParams()` and `generateMetadata()`.
- `resolveRelatedWorkForLog()` and `resolvePreviousNextLog()` (§12, §14) — new, small resolver functions.
- A Log Entry Header component (§8, §17, D4).
- A Log Index listing row component and a Related Work section component (§15).
- Both routes' own `export const metadata`.

### May implement if already supported by existing infrastructure

- Nothing further — every other piece (TOC, body rendering, breadcrumb, previous/next presentation, Related Knowledge presentation) is already fully built and requires only wiring, not new implementation.

### Explicitly deferred

- RSS (a separate Milestone 6 deliverable per `docs/12`).
- Any facet/grouping system beyond chronology (D3).
- A custom `app/not-found.tsx` (§2, §7 — pre-existing, cross-cutting, not this task's).
- Real Engineering Log MDX content — authoring real entries is content work, not architecture, and (per this task's own instruction) explicitly not part of this proposal or its eventual implementation task.

---

## 25. Verification Plan

### Functional
- `/engineering-log` renders the Index, correctly empty today (§22), correctly populated once real/temporary-fixture content exists.
- `/engineering-log/[slug]` resolves for a real (or temporary verification fixture) entry; an invalid slug calls `notFound()`.
- Related Work resolves correctly for an entry a real Case Study's `engineeringLog` array names, and renders nothing for one that isn't named anywhere.
- Related Knowledge and Previous/Next behave identically to their already-verified Work-side counterparts.
- Every existing link into this system (`PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, homepage preview, Case Studies' Related Engineering Logs) now resolves instead of 404ing.

### Responsive / Accessibility / Technical
Identical bar to every prior document-reading-experience verification in this repository (`docs/31`'s own Task 5.3 verification, Task 5.7's RC review methodology): `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build`, heading hierarchy, keyboard navigation, focus visibility, no horizontal overflow, light/dark mode, reduced motion.

### Regression
`/work`, `/work/[slug]`, `/knowledge`, `/knowledge/[slug]`, and the homepage's own Task 6.1 wiring all remain unchanged — this proposal's implementation should touch no file any of them depend on, beyond the two new small resolver functions (§16), which are additive.

---

## 26. Acceptance Criteria

- Log Index and Log Detail information architecture is fully specified (§8).
- The Work relationship gap is resolved architecturally without a schema change (§12, D2).
- Every reused component is named explicitly, with modification needs stated (§15).
- Every new piece of logic is the smallest identified extension, not a new subsystem (§16).
- Visual restraint is stated as an explicit, testable design rule, not left implicit (§17).
- Empty and failure states are fully specified (§22).
- Implementation scope is bounded (§24).
- No production code, component, route, or content was modified to produce this document.

---

## 27. Open Questions

**Q1 — Should `Related Work`'s summary carry any Work-specific field (e.g. `domain`) beyond what `ResolvedArticleSummary` already provides?**
*Why it matters:* affects whether §16's new type is a bare reuse of the existing summary shape or a small, narrower/wider variant. *What's blocked:* nothing in this proposal — the Index and Detail's core experience are unaffected either way. *Evidence needed:* a design call once a real Case Study/Log relationship exists to look at, not resolvable from the repository alone today.

**Q2 — Should the Index eventually support the "future archival grouping (by year, by technology)" `docs/03` itself names as a possible future addition?**
*Why it matters:* purely a documentation/expectation-setting question — D3 already answers "not now," this just confirms the door stays open on purpose. *What's blocked:* nothing — explicitly deferred, consistent with `docs/03`'s own framing. *Evidence needed:* real entry volume, which doesn't exist yet.

**Q3 — Does an Engineering Log entry ever need a `coverImage`?**
*Why it matters:* `articleFrontmatterSchema` already has the field; nothing in §8 currently renders it. *What's blocked:* nothing — omitting it is the restrained default (§17); adding rendering for it later is additive, not a redesign. *Evidence needed:* an editorial decision, not an architectural one.

---

## 28. Final Recommendation

**Recommended architecture:** build `/engineering-log` and `/engineering-log/[slug]` as thin, fully server-rendered consumers of infrastructure that already exists almost entirely — the same MDX pipeline, the same `DocumentLayout` skeleton, the same relationship-resolution pattern Work already proved out twice (Knowledge → Work in Milestone 5). The only genuinely new logic is two small resolver functions (§12, §14), and the only genuinely new visual surface is a header and a listing row scoped to this collection's own, deliberately quieter register (§17) — never a second Case Study Library wearing a different label.

**Recommended implementation sequence**, once approved:
1. `resolveRelatedWorkForLog()` and `resolvePreviousNextLog()` (§12, §14, §16) — pure logic, independently testable before any UI exists.
2. `app/engineering-log/[slug]/page.tsx` and its new Entry Header/row components.
3. `app/engineering-log/page.tsx` (the Index) — depends on nothing the Detail route doesn't already establish.
4. Full verification pass (§25), including temporary, realistic fixture content added and fully removed, per this workspace's own established verification practice.

**Known risks:**
- The temptation to make Log Detail visually resemble Case Study Detail is real and worth naming explicitly for whoever implements this (§17) — the smallest-diff implementation path (copy `/work/[slug]`, swap the header) is also the wrong one architecturally.
- Zero real content exists to validate this design against until an implementation task adds real or temporary entries — the same situation Work faced before Task 5.7, resolved the same way (real, evidence-based content, never fabricated for its own sake).

**This document authorizes no implementation.** Task 6.2's actual build requires its own review and approval, following the same workflow every prior milestone in this repository has used.
