# 41 — Search / Core Discovery Boundary

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.4's design proposal, following `docs/12-Implementation Roadmap.md`'s Milestone 6 — Core Pages sequence, after Task 6.1 (Homepage Integration), Task 6.2 (Engineering Log Experience), and Task 6.3 (About Experience), all complete and approved.

---

## 1. Purpose

`Header` already renders a disabled, honestly-labeled `aria-label="Search (coming soon)"` icon button — confirmed by direct read of `src/components/navigation/header.tsx`. This isn't a placeholder this task invents context for; it's an existing, deliberate boundary marker, the same idiom `Footer`'s own disabled RSS link already uses (`"RSS (coming soon)"`) for a feature this codebase already knows it hasn't built yet. Task 6.4 exists to decide, precisely, what crosses that boundary now and what stays on the far side of it — not to design Search from a blank page.

`docs/12-Implementation Roadmap.md` lists **"Search"** as a deliverable of both **Milestone 6 — Core Pages** and **Milestone 7 — Discovery**, verified by direct read (§2 below quotes both lists in full). That's the exact ambiguity this task's own authorization already resolved: Milestone 6 owns a **minimal entry point**; Milestone 7 owns the **full Discovery experience**. This document's job is to draw that line precisely enough that Task 6.4's eventual implementation can't drift into Milestone 7's territory, and Milestone 7's own future design proposal isn't left re-deciding what Task 6.4 already settled.

---

## 2. Current State (Reconnaissance)

Verified against the actual repository, not assumed.

### The roadmap ambiguity, quoted exactly

`docs/12-Implementation Roadmap.md`, Milestone 6 — Core Pages:

```text
Deliverables
* Homepage
* Knowledge
* Work
* Engineering Log
* About
* Search
* 404
* RSS
* Sitemap

Definition of Done
The portfolio is fully navigable.
```

`docs/12-Implementation Roadmap.md`, Milestone 7 — Discovery:

```text
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

Both lists name "Search" — confirmed, not inferred. Milestone 6's Definition of Done ("fully navigable") and Milestone 7's ("navigate naturally through connected knowledge") are themselves the distinction: Milestone 6 asks whether every real destination can be *reached*; Milestone 7 asks whether a reader can *discover* what they didn't already know to look for. Section 4 below turns that distinction into a concrete scope boundary.

### Navigation — the existing Search affordance

`src/components/navigation/header.tsx` (confirmed by direct read): a disabled `Button` — `disabled`, `aria-label="Search (coming soon)"`, `title="Search (coming soon)"`, rendering a `lucide-react` `Search` icon — sits in Header's utility icon cluster, alongside an identically-patterned disabled RSS button, a real GitHub link, and the theme toggle. Search is **not** a `PRIMARY_NAVIGATION` entry (`lib/navigation/config.ts` confirmed: only Knowledge, Work, Engineering Log, About) — it has always been scoped as a utility action, the same tier as RSS and GitHub, not a fifth primary destination. `src/components/navigation/mobile-navigation.tsx`'s own docstring confirms this isn't accidental: *"It does not duplicate Search, RSS, GitHub, LinkedIn, email, or the theme toggle — those already work correctly at every breakpoint via Header's own always-visible icon cluster."* Search staying out of the mobile panel is Task 6.1's own already-approved decision (docs/35/docs/36), not something this task reopens.

### Routes

No `src/app/search/` exists. No catch-all route. No `not-found.tsx`, no `sitemap.ts`/`.xml` route, no `rss.xml` route — confirmed by directory listing. **404, RSS, and Sitemap are Milestone 6 siblings of Search in `docs/12`'s own list, but none of them are this task's subject** — Task 6.4 is scoped to Search specifically; this document doesn't design any of the other three (§7).

### Content Systems — already built anticipating this

`src/lib/content/loader.ts`'s `getAll()` docstring (confirmed by direct read): *"Route-independent: reads directly from the filesystem, so it can be called from a page, a script, or **a future search indexer alike** (Task 1.6 requirement 4)."* This is not this proposal's own framing — the content layer was already documented, at Milestone 3, as something a future search feature would read from directly, the same way every other collection-backed page already does.

`src/lib/content/collections.ts`'s `COLLECTIONS` registry (confirmed): five entries — `knowledge`, `work`, `engineering-log`, `series`, `technologies`. `src/lib/content/schema.ts` (confirmed): `knowledgeFrontmatterSchema` and `workFrontmatterSchema` both `.extend()` a shared `articleFrontmatterSchema`; `engineering-log` uses `articleFrontmatterSchema` directly. All three share `title`, `description`, `tags`, `technologies`, `publishedAt` — one common shape already, not something this task needs to invent. `seriesFrontmatterSchema` and `technologyFrontmatterSchema` are structurally different (taxonomy/reference entries, not standalone readable documents) and — confirmed by directory listing — both `content/series/` and `content/technologies/` are currently empty, with **no route anywhere under `src/app/` that renders either collection as its own page**. Nothing in this codebase can currently link a reader to a "series" or "technology" result even if one existed.

`getAllArticles()` (`articles.ts`), `getProjectLibrary()`/`getFeaturedCaseStudies()` (`work.ts`), `getAllEngineeringLogEntries()` (`engineering-logs.ts`) — confirmed as the existing, already-resolved read paths for exactly the three collections that have real detail routes (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`).

No content-indexing utility exists anywhere in the codebase — confirmed, nothing beyond `loader.ts`'s generic `getAll()`/`getBySlug()`/`getSlugs()`.

### Existing UI Primitives

`src/components/ui/` (confirmed directory listing): `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `separator.tsx`, `skeleton.tsx`, `tooltip.tsx`. **No `Input` primitive exists.** **No `Dialog`/`Command`/`Combobox` primitive exists under `ui/`** — `@base-ui/react/dialog` is a project dependency and is already used directly (not wrapped) by `MobileNavigation` for its slide-in panel; no equivalent exists for a search-style overlay, and none is proposed here (§13). No filtering component, no result-card component, no list component beyond what each collection's own listing page already hand-builds (`LogEntryRow`, article list rows, case study cards).

The empty-state idiom this task would inherit, not invent, is already established repository-wide: `docs/37`/Task 6.2's own "honest, not fabricated" empty state (`app/engineering-log/page.tsx`'s "Nothing logged yet"), `ENGINEERING_NOTEBOOK_COPY.emptyState`/`CASE_STUDIES_COPY.emptyState` (homepage-copy.ts) — real copy for a real empty condition, never a fake placeholder result.

### Dependencies

`package.json` (confirmed): no search or indexing library of any kind — no Fuse.js, MiniSearch, Flexsearch, `cmdk`, Algolia, or similar. Nothing to reuse, nothing installed that this proposal needs to account for.

---

## 3. Discrepancies Found

- **`docs/12`'s own roadmap lists "Search" twice**, under Milestone 6 and Milestone 7, with no disambiguating note in the document itself. Not a documentation defect this proposal silently reconciles — this task's own authorization already supplies the resolution (Milestone 6 = minimal entry point, Milestone 7 = full experience); §4 makes that resolution concrete and testable rather than leaving it as a restated assumption.
- No other discrepancy found. The existing disabled Search button, the absence of any search route or library, and the content layer's own "future search indexer" framing are all exactly what a repository that hasn't yet built Search would look like — nothing inspected contradicts what this task expected to find.

---

## 4. Core Question: What Belongs to Milestone 6 vs. Milestone 7?

```text
Milestone 6 — "fully navigable"          Milestone 7 — "navigate naturally
                                           through connected knowledge"
        │                                          │
        ▼                                          ▼
Can a reader who already knows          Can a reader who does NOT know
what they're looking for find it        what they're looking for be led
and reach it?                           to it?
        │                                          │
        ▼                                          ▼
A real /search route.                   Faceted filtering (tag,
Type a word from a title or             technology, topic).
description; get a list of real         Dedicated Tag / Technology pages.
matches; click through.                 Series and Reading Paths.
                                         Related Content recommendations.
No ranking, no facets, no index.        Relevance ranking, indexing.
```

The dividing line isn't "how much UI" — it's **whether the feature helps someone who already has a term in mind reach a real page (Milestone 6), or helps someone without a specific term discover content they didn't know to search for (Milestone 7)**. A minimal, substring-matching `/search` page satisfies the first without attempting the second. §21 turns this into an explicit Must-Implement / Deferred table.

---

## 5. Problem Statement

`/search` is the only Milestone 6 destination still unbuilt — Homepage, Knowledge, Work, Engineering Log, and About are all complete and approved (Tasks 6.1–6.3). Header's own Search icon has been sitting disabled since before this milestone began, honestly labeled but non-functional, the same "documented gap, not a hidden one" position RSS is still in. Task 6.4 designs the minimal version of that destination — real, reachable, and useful for a reader who already knows roughly what they're looking for — without building the ranking, filtering, and cross-collection recommendation system `docs/12` explicitly reserves for Milestone 7.

---

## 6. Goals

- Define `/search` as a real, minimal, server-rendered route — the last of Milestone 6's `docs/12`-listed pages this task is responsible for.
- Resolve the Milestone 6 / Milestone 7 "Search" naming collision in `docs/12` precisely, so neither this task nor a future Milestone 7 proposal has to re-litigate it.
- Specify exactly which existing collections participate (Knowledge, Work, Engineering Log) and why the others (`series`, `technologies`) don't, grounded in what's actually routable today, not a policy invented for this task alone.
- Reuse the content layer's existing, already-documented-for-this-purpose read functions (`getAllArticles()`, `getProjectLibrary()`/`getFeaturedCaseStudies()`, `getAllEngineeringLogEntries()`) rather than building a parallel indexing path.
- Activate Header's existing disabled Search affordance honestly — a real destination once one exists, the identical treatment `RSS_PATH` is already sitting ready for.
- Keep the feature server-first, with no client-side index, no new dependency, and no interactive state beyond what an ordinary GET form already provides.
- Preserve visual and tonal consistency with the rest of the workspace — plain results, honest empty states, no fabricated relevance.

## 7. Non-Goals

**Deferred to Milestone 7 (per `docs/12`'s own Discovery deliverable list — not this task's to build):**

- Faceted filtering by tag, technology, or topic.
- Dedicated Tag pages, Technology pages.
- Series and Reading Paths.
- A Related Content recommendation engine (distinct from the per-document relationship resolvers — Related Knowledge, Related Work, Related Engineering Log — Tasks 4.x/5.x/6.2 already built; those stay exactly as they are and are not this task's concern either way).
- Relevance ranking or scoring of any kind.
- Any search index or library — Fuse.js, MiniSearch, Flexsearch, Algolia, `cmdk`, or similar.
- Live/instant search-as-you-type, debounced client-side querying, or any client component for the search input itself.
- A command palette, a keyboard shortcut trigger (⌘K), search analytics, or result snippet highlighting.

**Out of scope for this task entirely, regardless of milestone** (Milestone 6 siblings in `docs/12`'s list, but not Task 6.4's subject):

- 404 page.
- RSS feed (`/rss.xml`).
- Sitemap (`/sitemap.xml`).

None of these boundaries need to move based on anything found in the repository.

---

## 8. Information Architecture

```text
Search (/search)
        │
        ├── Query input            A single text field, submitted via GET
        │
        └── Results                Matches across Knowledge, Work, and
                                    Engineering Log, or an honest empty
                                    state if there are none (or no query
                                    yet)
```

Deliberately one section, not `docs/03`'s eventual Discovery-scale information architecture (facets, tag clouds, filters) — this is the whole page.

### The query mechanism

A plain, server-rendered `GET` form (`<form method="GET" action="/search">`, one `name="q"` field) submitting to `/search?q=...`. The results page reads the query string server-side and re-renders — no client component, no `onChange` handler, no debounce. This is the same "static unless a concrete browser interaction requires otherwise" posture every other page in this workspace already holds (Principle 5, `docs/24`), applied to the one page in this milestone that might otherwise be assumed to need client state by default. It doesn't: a GET-based query string is a complete, bookmarkable, shareable, JS-independent search implementation for a dataset this small.

### Matching behavior (Milestone 6 scope)

Case-insensitive substring matching against each candidate document's `title` and `description` — the two fields `docs/12`'s own "fully navigable" bar requires (find a real document by a term from its own title or summary) and nothing beyond that. No `tags`/`technologies` matching, no body-text matching, no fuzzy/typo-tolerant matching, no relevance score — ordering falls back to the same `sortByPublishedDate()` (`lib/content/loader.ts`) every other listing in this workspace already uses, not a ranking algorithm invented for this page alone.

---

## 9. Interaction Flow

```text
Arrival (Header's Search link, or a direct /search?q=... URL)
        ↓
No query yet → prompt state, no results section rendered
        ↓
Query submitted (GET) → server matches title/description across
Knowledge, Work, Engineering Log
        ↓
Results found → plain list, each linking to its real detail route,
                grouped or labeled by collection so a reader knows
                where a result leads before clicking
        ↓
No results found → honest "no matches for '<query>'" message,
                    never a fabricated near-match
```

A reader who already knows the exact page they want reaches it in one query and one click — the entire job Milestone 6's "fully navigable" bar asks this page to do.

---

## 10. Navigation

`Header`'s existing disabled Search button becomes a real link to `/search` — the same `render={<a href=... />}` pattern the adjacent GitHub icon button already uses in the identical cluster (confirmed, `header.tsx`), not a new interaction pattern. `aria-label`/`title` drop the "(coming soon)" qualifier once the destination is real, mirroring exactly what `RSS_PATH`'s own eventual activation will look like when that task ships. **No `PRIMARY_NAVIGATION` change** — Search stays a utility action in Header's icon cluster, not a fifth primary destination; `PRIMARY_NAVIGATION` remains Knowledge, Work, Engineering Log, About, unchanged. **No `MobileNavigation` change** — that component's own docstring already states it deliberately excludes Search, and nothing found in this reconnaissance gives a reason to reopen that decision.

---

## 11. Content Architecture

**Participating collections: Knowledge, Work, Engineering Log — and no others.** Grounded in what's actually true today, not a policy invented for this task:

- All three already extend or use `articleFrontmatterSchema` (`title`, `description`, `tags`, `technologies`, `publishedAt` in common) and already have a real, working detail route a search result can link to (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`).
- `series` and `technologies` do not: both are currently empty, both are taxonomy/reference schemas rather than standalone-document schemas, and — confirmed — neither has a route anywhere in `src/app/` that would give a search result somewhere real to link to. Including either would mean either building a new route this task doesn't otherwise need (scope creep into Milestone 7's own "Tags"/"Technologies" deliverables) or linking a search result to a page that doesn't exist. Excluded on that basis, not by unexamined default.
- About is a single static page, not a collection (`docs/39`/`docs/40`, approved) — it has no `getAll()`-style read path to loop over and doesn't fit this page's per-collection matching model without a special case built just for one document. Left out of Milestone 6's scope; §24 Q1 names it as an open question rather than deciding it here.

**No new content-loading path.** `/search` reads each of the three collections through the exact functions their own listing pages already use (`getAllArticles()`, `getProjectLibrary()`/`getFeaturedCaseStudies()`/equivalent, `getAllEngineeringLogEntries()`) — the same "reuse, don't duplicate" discipline every prior Core Pages task has held to, applied here to `loader.ts`'s own `getAll()`, which was documented at Milestone 3 as existing for exactly this future use.

---

## 12. Component Reuse

| Existing Component / Utility | Reuse Purpose | Modification Needed? |
|---|---|---|
| `Section` / `Stack` / `Container` | Page layout rhythm | None |
| `getAllArticles()`, `getProjectLibrary()`/`getFeaturedCaseStudies()`, `getAllEngineeringLogEntries()` | Source data for matching | None |
| `sortByPublishedDate()` (`loader.ts`) | Deterministic result ordering (no ranking algorithm) | None |
| `Button` | Header's Search icon (already exists, already disabled) | Enable — drop `disabled`, add `render={<a href="/search" />}`, matching the adjacent GitHub icon exactly |
| Existing collection-specific row/card components (`LogEntryRow` and equivalents) | Possible reuse for result rows, if a result's shape matches closely enough (an implementation-task decision, not fixed here) | None, or a small new generic result-row component if the three collections' existing rows don't compose cleanly — genuinely new only if reuse doesn't fit, not by default |

**New, genuinely necessary, not avoidable through reuse:** `app/search/page.tsx` itself, and a plain `<input type="search">` for the query field. **A gap worth naming directly:** no `Input` primitive exists under `components/ui/` today — this task's eventual implementation is the first to need one. Building a small, generic `ui/input.tsx` (styled consistently with `Button`'s own existing conventions) is the honest scope this creates, not a search-specific control; it's exactly the kind of small, load-bearing primitive gap Task 6.1 hit once already with `MobileNavigation`'s need for a client boundary that didn't exist yet.

---

## 13. Data / Loader Architecture

No index, no build step, no persisted search data structure. Each request to `/search?q=...` calls the same three already-existing read functions, filters the combined result set in memory against the query string, and renders — exactly as cheap as any other page in this workspace that reads `getAll()`-backed collections at request/build time, because the underlying dataset (a handful of MDX files today) makes anything more than a linear scan premature optimization for a page whose own scope is intentionally minimal. Milestone 7's "full Discovery experience" — if the dataset grows enough to need one — is the appropriate place to introduce indexing, not this task pre-building infrastructure for a scale that doesn't exist yet (the same "don't build the abstraction before a second real need justifies it" discipline `docs/24` Principle 2 already governs elsewhere in this codebase).

---

## 14. Visual Hierarchy / Restraint

No new pattern beyond what every other page here already holds to: minimal, generous whitespace, typographic hierarchy over decoration, no loading spinner (a GET-based page has nothing to spin for), no animated result-count-up, no fabricated "relevance" indicator or match percentage next to a result — `docs/01`'s own "Never use meaningless statistics" applies as directly to a search result page as it does to a skills section. Results read as a plain list, grouped or labeled by which collection each belongs to, so a reader always knows what kind of page a result leads to before clicking it.

---

## 15. Responsive Behavior

No new pattern. A query field and a plain, stacked result list — the same `Section`/`Stack` rhythm every page in this workspace already uses responsively. No table, no wide code block, no diagram — the same low-overflow-risk profile `docs/39`'s About page already set as this milestone's baseline.

---

## 16. Accessibility

- The query field is a real `<label>`-associated `<input type="search">` inside a real `<form>` — submittable by Enter alone, with no JavaScript dependency for the core interaction.
- Results render as a real list (`<ol>`/`<ul>`), each entry a real link with a descriptive accessible name (the document's own title, not "click here" or a bare icon).
- The empty/no-results state is real, readable text — not an ARIA-live region announcing nothing, and not a visual-only cue.
- Heading hierarchy: one `<h1>` for the page, results grouped under real `<h2>`s if grouped by collection.
- Focus-visible styling inherited unmodified from this workspace's existing input/link/button conventions once `ui/input.tsx` exists (§12) — no new focus pattern invented for this page specifically.

---

## 17. Performance

Fully server-rendered per request (query strings are inherently dynamic — this is the one Core Pages route that can't be fully static, the same reason `/knowledge/[slug]` etc. use `generateStaticParams` for their *known* slugs but this page can't: an arbitrary `?q=` value isn't a known param to pre-render against). No client JavaScript beyond what a plain HTML form already requires, no index to build or ship to the client, no new runtime dependency — the same "server-first, minimal client cost" bar every prior Core Pages task has held itself to, met here by a page with strictly less computation than any collection's own listing page (a linear scan over already-resolved, already-small arrays).

---

## 18. SEO / Metadata Boundary

`/search` gains its own `export const metadata`, matching every other real route's existing pattern. No canonical URL, no Open Graph, no structured data — the identical, already-repeated boundary `docs/35`/`docs/37`/`docs/40` each drew (this workspace has no `SITE_URL` yet). A search-results page conventionally sets `robots: noindex` on the query-bearing URL (`/search?q=...`) since indexing arbitrary query permutations serves no reader — worth stating as an explicit implementation-task requirement rather than leaving it to be discovered later, even though this task specifies no new SEO infrastructure to produce it (Next's own per-route `metadata` export already supports a `robots` field).

---

## 19. Empty / Failure States

| Condition | Behavior |
|---|---|
| No query yet (`/search` with no `?q=`) | A prompt state — no results section rendered at all, not an empty "0 results" message for a search that was never run. |
| Query submitted, zero matches | Honest "No results for '<query>'" text — never a fabricated near-match, never silently falling back to unrelated content. |
| Query submitted, one or more matches | A plain list, each entry linking to its real detail route, labeled by which collection it belongs to. |
| A collection with zero real entries (e.g., if Engineering Log were ever empty again) | Contributes zero candidates to the match set — no error, no placeholder entry standing in for a collection that has nothing yet, the same "empty collection is a valid state" discipline `docs/37`'s own empty-state ruling already established. |

---

## 20. Architecture Decisions

### D1 — Server-Rendered GET Query, Not a Client-Side Search Component

**Context:** Search could be built as a client component with local state, `onChange`-driven filtering, and debouncing — the common pattern for "instant search" UIs.

**Options Considered:** (a) a client component with live, as-you-type filtering; (b) a plain server-rendered page reading `?q=` from the URL.

**Chosen Approach:** (b).

**Rationale:** Milestone 6's own bar is "fully navigable," not "instant" — a GET-based query string is a complete, bookmarkable, shareable, zero-JS-dependency implementation of exactly that bar. Live-as-you-type filtering is a genuine UX improvement, but it's also the first real step toward Milestone 7's "full Discovery experience" register (the same territory as instant filtering, faceting, and result ranking) — building it now blurs the boundary this task exists to hold.

**Trade-offs:** No live results while typing; a reader submits the form (or presses Enter) to see matches. Acceptable for a minimal entry point; revisit only if Milestone 7's own design proposal decides live search belongs to the full Discovery experience.

**Consequences:** No new client component, no new client-side dependency, no debounce logic to build or maintain for this task.

### D2 — Substring Matching Only, No Ranking or Fuzzy Search

**Context:** A real search feature typically wants relevance ranking and typo tolerance, usually via a library (Fuse.js, MiniSearch, etc.).

**Options Considered:** (a) install a search/indexing library now; (b) plain case-insensitive substring matching against `title`/`description`, ordered by publish date.

**Chosen Approach:** (b).

**Rationale:** `docs/12` reserves ranking-adjacent capability for Milestone 7 by name ("Filtering," implicitly "Search" at full depth); installing an indexing library now to produce a Milestone 6 "minimal entry point" would be exactly the over-building this task's own authorization warns against. Substring matching against two fields is enough to satisfy "can a reader who knows a term from a title find that page."

**Trade-offs:** A misspelled query, or a query matching only a document's body text (not its title/description), returns nothing — an honest limitation of a minimal feature, not a defect to silently work around.

**Consequences:** Zero new dependencies. Milestone 7 has a real, unblocked opportunity to introduce proper indexing/ranking without this task's implementation being in the way.

### D3 — Knowledge, Work, and Engineering Log Only

**Context:** Five collections are registered (`knowledge`, `work`, `engineering-log`, `series`, `technologies`); About is a sixth, non-collection page.

**Options Considered:** (a) search everything; (b) search only the three collections with real detail routes and a shared frontmatter shape.

**Chosen Approach:** (b).

**Rationale:** `series`/`technologies` have no route to link a result to and are empty today regardless; About has no `getAll()`-style read path and is a single document, not a collection. Searching either would mean building new routing/indexing surface this task doesn't otherwise need — precisely the Milestone 7 territory §4 draws the line against.

**Trade-offs:** A reader searching a term that only appears on the About page, or in `series`/`technologies` metadata (once either has real content), gets no match. Named directly in §24 Q1/Q2 as an open question, not silently decided.

**Consequences:** `/search`'s scope stays exactly as wide as Milestone 6's three other content collections — no wider, no narrower.

### D4 — Header's Existing Icon Activates; No New Navigation Entry

**Context:** Search already has a disabled affordance in Header; it is not in `PRIMARY_NAVIGATION`.

**Options Considered:** (a) promote Search to a fifth `PRIMARY_NAVIGATION` destination; (b) activate the existing disabled utility icon in place, unchanged in position or tier.

**Chosen Approach:** (b).

**Rationale:** Nothing in this reconnaissance suggests Search was ever meant to be a primary destination — it has always been styled and positioned identically to RSS and the theme toggle, a utility action, not a top-level section of the site. Promoting it now would be an unreviewed navigation-architecture change this task wasn't asked to make.

**Trade-offs:** None identified — the existing icon already occupies exactly the right visual weight for what this task builds.

**Consequences:** `PRIMARY_NAVIGATION`, `MobileNavigation`, and `FOOTER_NAVIGATION` all remain unchanged by this task.

---

## 21. Implementation Scope

### Must implement (Milestone 6)

- `app/search/page.tsx` — server-rendered, reads `?q=`, its own `export const metadata` (with `robots: noindex`, §18).
- A plain GET `<form>` with one `<input type="search" name="q">`.
- Matching: case-insensitive substring against `title`/`description`, across Knowledge, Work, Engineering Log only, ordered by `sortByPublishedDate()`.
- Header's existing disabled Search button activated to link to `/search` (§10, §12).
- Honest empty/no-query/no-results states (§19).
- A new `ui/input.tsx` primitive, since none currently exists (§12) — small and generic, not search-specific.

### May implement if already supported by existing infrastructure

- Reuse of an existing collection row/card component for result rows, if one's shape fits without modification (§12) — otherwise a small new generic result-row component, not a search-specific design system.

### Explicitly deferred to Milestone 7

- Everything in §7's first list: filtering, tag/technology pages, series, reading paths, related-content recommendations, ranking, any search index/library, live search, command palette, analytics, snippet highlighting.

### Explicitly out of scope for this task, any milestone boundary aside

- 404, RSS, Sitemap (§7's second list) — `docs/12` Milestone 6 siblings, not this task's subject.

---

## 22. Verification Plan

### Functional
- `/search` renders a prompt state with no `?q=`, real results for a query matching an existing title/description, and an honest no-results message for a query matching nothing.
- Every rendered result links to a real, already-existing detail route (no dead links).
- Header's Search icon now links to `/search` instead of rendering disabled.
- `series`, `technologies`, and About content never appear as results (§11/D3 — confirmed by direct inspection, not assumed).

### Responsive / Accessibility / Technical
Identical bar to every prior page-level verification in this repository: `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build`, heading hierarchy, keyboard-only form submission, focus visibility, no horizontal overflow, light/dark mode.

### Regression
`PRIMARY_NAVIGATION`, `MobileNavigation`, `FOOTER_NAVIGATION`, and every existing collection's listing/detail pages remain unchanged — this task's implementation should touch no file any of them depends on, beyond the one-line activation of Header's existing Search button.

---

## 23. Acceptance Criteria

- The Milestone 6 / Milestone 7 "Search" naming collision in `docs/12` is resolved as an explicit, testable scope boundary (§4, §21), not left implicit.
- Participating collections (Knowledge, Work, Engineering Log) and excluded ones (`series`, `technologies`, About) are each justified by what's actually routable today, not by unexamined default (§11, D3).
- No search index, ranking algorithm, or new dependency is introduced or recommended (§13, D2).
- Header's existing Search affordance is reused and activated, not replaced or redesigned (§10, D4).
- No production code, component, route, or content was modified to produce this document.

---

## 24. Open Questions

**Q1 — Should About ever participate in Search, and if so, how, given it isn't a collection?**
*Why it matters:* About is real, checked-in content a reader might reasonably search for by name or topic, but it has no `getAll()`-style read path this page's matching model assumes. *What's blocked:* nothing in this proposal — About is simply excluded from Milestone 6's scope (D3) until this is answered. *Evidence needed:* a decision (by Milestone 7's own proposal, or a future amendment here) on whether a single-document special case is worth the model's added complexity, or whether About stays reachable only via navigation, never via search.

**Q2 — If `series`/`technologies` gain real content and routes in the future (Milestone 7's own deliverables), does `/search` automatically extend to them, or does that require this document's own revision?**
*Why it matters:* determines whether Milestone 7's "Tags"/"Technologies" work silently changes this page's behavior or requires an explicit amendment. *What's blocked:* nothing now — both collections are empty and routeless today (D3). *Evidence needed:* Milestone 7's own design proposal should state this explicitly when it defines those collections' real routes, rather than this document trying to pre-decide a system that doesn't exist yet.

**Q3 — Should search results be grouped by collection (Knowledge / Work / Engineering Log, each its own labeled group) or presented as one flat, date-ordered list?**
*Why it matters:* affects the result list's markup and heading structure (§16) but not this page's data model or scope. *What's blocked:* nothing architecturally — either is compatible with everything else in this proposal. *Evidence needed:* an implementation-task decision, the same granularity choice `docs/39`/`docs/40` already left open for other presentational calls; not resolved here because resolving it doesn't change what this task is scoped to build.

---

## 25. Final Recommendation

**Recommended architecture:** a single, server-rendered, GET-based `/search` page — no client component, no index, no ranking, no new dependency — matching against `title`/`description` across exactly the three collections that already have real detail routes and a shared frontmatter shape (Knowledge, Work, Engineering Log). Header's existing disabled Search icon activates to link to it, the same pattern its adjacent GitHub icon already uses. This satisfies Milestone 6's own "fully navigable" bar precisely, without reaching into Milestone 7's "navigate naturally through connected knowledge" territory — filtering, tags, technologies, series, reading paths, related-content recommendations, ranking, and any indexing library all stay exactly where `docs/12` already puts them.

**Recommended implementation sequence**, once approved:
1. `ui/input.tsx` — the one new shared primitive this task's scope requires (§12).
2. `app/search/page.tsx` — query form, matching logic, result rendering, empty states.
3. Header's Search button activation (§10).
4. Metadata, including `robots: noindex` on the query-bearing route (§18).
5. Full verification pass (§22).

**Known risks:**
- The temptation to add "just one more" Discovery-scale feature (a tag filter, a relevance score, live search) while already inside the search page's own code is real — worth naming for whoever implements this next, the same way `docs/39` §27 named the equivalent temptation for About's own copy.
- Q1–Q3 (§24) mean this page's coverage is intentionally partial (three collections, not the whole site) — an accepted, documented boundary (§4), not a defect.

**This document authorizes no implementation.** Task 6.4's actual build requires its own implementation plan and approval, following the same workflow every prior milestone in this repository has used.
