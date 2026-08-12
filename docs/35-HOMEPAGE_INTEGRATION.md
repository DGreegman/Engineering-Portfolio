# 35 — Homepage Integration & Core Navigation

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

This document is Task 6.1's design proposal, the first task of **Milestone 6 — Core Pages** (`docs/12-Implementation Roadmap.md`). It follows the same documentation-first workflow every prior milestone in this repository has used (`docs/24-ENGINEERING_PRINCIPLES.md` Principle 1): Documentation → Architecture Review → Implementation Plan → Implementation → Verification → Approval. This document is the first step only.

---

## 1. Purpose

Milestone 5 — Engineering Work is complete and verified (`docs/28`–`34`, Task 5.7's release-candidate review). The Knowledge and Work experiences are now substantially mature: four real Knowledge articles exist with a working reading experience, relationship resolution, and Previous/Next; four real Work case studies exist with the same, plus Architecture, Project Evolution, and Knowledge Integration patterns proven out against real content.

The homepage, by contrast, has not changed since Milestone 3 introduced it. It still renders entirely from hand-authored placeholder fixtures — `PLACEHOLDER_KNOWLEDGE`, `PLACEHOLDER_WORK`, `PLACEHOLDER_LOG` — passed directly from `src/app/page.tsx` into components that were always built to accept real data as props but have never actually received it (§2).

This matters architecturally, not just cosmetically. The homepage's job has changed. When it was built, it was necessarily a standalone preview of content that didn't exist yet. Now that Knowledge and Work are real, continuing to show fixture data on the homepage means the workspace's own front door contradicts what a visitor finds one click later — the exact "two collections, two sources of truth, drifting apart" failure mode `docs/24` Principle 3 and every Work-milestone proposal since have explicitly guarded against. Task 6.1 exists to close that gap: **the homepage becomes an integration and orientation layer over the Knowledge and Work systems that now exist, not a page that owns its own preview content.**

Task 6.1 additionally exists to establish primary navigation as a coherent, workspace-wide system — not because primary navigation doesn't exist (it does, see §2), but because it does not yet reach every viewport, and two of its four destinations don't resolve yet. Both are documented precisely in §8.

---

## 2. Current State

Everything below was verified by reading the current repository, not assumed from prior documentation.

### Homepage route

`src/app/page.tsx` renders seven sections in this order:

```
ReadmeHero
CurrentFocus
HowIThink
EngineeringNotebook   (fed PLACEHOLDER_KNOWLEDGE)
EngineeringCaseStudies (fed PLACEHOLDER_WORK)
EngineeringLog         (fed PLACEHOLDER_LOG)
BeyondTheCode
```

This sequence already matches `docs/13-HOMEPAGE_EXPERIENCE.md`'s approved narrative (README Introduction → Current Focus → How I Think → Knowledge Preview → Featured Work → Engineering Log → Meet the Engineer) almost exactly — the component names differ from the doc's generic section names, but the questions each answers line up one-to-one. **`app/page.tsx` has no `export const metadata`** — every other real route (`/work`, `/work/library`, `/knowledge`, `/work/[slug]`, `/knowledge/[slug]`) already defines one; the homepage currently falls back to the root layout's generic `"Engineering Portfolio"` / `"Engineering Portfolio project foundation."` fallback.

### Homepage components

`src/components/home/`: `readme-hero.tsx`, `current-focus.tsx`, `how-i-think.tsx`, `engineering-notebook.tsx`, `engineering-case-studies.tsx`, `engineering-log.tsx`, `beyond-the-code.tsx`, `workspace-snapshot.tsx` (used inside `ReadmeHero`). All are Server Components. The three data-bearing ones (`EngineeringNotebook`, `EngineeringCaseStudies`, `EngineeringLog`) already receive their data (`articles`, `caseStudies`, `entries`) as **required props** — none of them import a placeholder constant themselves. This is the exact "presentation receives already-resolved data" discipline `docs/22-COMPONENT_ARCHITECTURE.md`'s Resolution Layer requires, and it is already satisfied. The only thing wrong today is what `page.tsx` passes in.

`BeyondTheCode` is explicitly documented, in its own file, as the homepage's "Meet the Engineer" section — deliberately minimal (title, four paragraphs, one CTA to `/about`) and explicitly **not** a substitute About page.

### Root layout

`src/app/layout.tsx` composes `ThemeProvider` → `WorkspaceLayout` (`header`/`sidebar`/`footer` slots) → `{children}`. `WorkspaceLayout` (`components/layout/workspace-layout.tsx`) is a Server Component: skip-link, `<header>` rendered bare, a shared `PageContainer` wrapping the sidebar/main row, `<footer>`. No client state anywhere in this chain.

### Navigation

`lib/navigation/config.ts` — `PRIMARY_NAVIGATION` already contains exactly the four items this task's brief specifies:

```ts
[
  { label: "Knowledge", href: "/knowledge" },
  { label: "Work", href: "/work" },
  { label: "Engineering Log", href: "/engineering-log" },
  { label: "About", href: "/about" },
]
```

`FOOTER_NAVIGATION` aliases the same array. Home is intentionally absent (the wordmark links to `/`), matching `docs/03-SITEMAP.md`.

`Header` (`components/navigation/header.tsx`) renders `PrimaryNavigation` with `className="hidden lg:block"`. `PrimaryNavigation` renders a `<nav aria-label="Primary">` with `NavLink` items; `NavLink` is a small client component (`useIsActiveItem`) that sets `aria-current="page"` and a foreground-color style on the active item — this active-state pattern is shared by every nav surface that uses `NavLink`.

**No mobile navigation exists.** `PrimaryNavigation` in `Header` is desktop-only (`hidden lg:block`). `Sidebar` (the contextual secondary nav) is also desktop-only (`hidden lg:block` in `WorkspaceLayout`) and, separately, is not primary navigation at all — it shows section-local sub-structure (e.g. Knowledge topics) and renders `null` on routes without any. There is no hamburger menu, drawer, sheet, or disclosure component anywhere in `components/navigation/` or `components/layout/`; `components/ui/` contains only `button`, `card`, `dropdown-menu`, `separator`, `skeleton`, `tooltip` — no dialog/sheet primitive exists to build one from without adding a new primitive. **On any viewport below `lg`, a visitor's only way to reach Knowledge, Work, Engineering Log, or About is to scroll to the footer**, which is not hidden at any breakpoint and links the same four destinations via `FOOTER_NAVIGATION`.

Header also renders two `disabled` icon buttons — Search and RSS — each with a real `aria-label`/`title` reading `"(coming soon)"`. This is the codebase's own established pattern for a feature whose entry point exists but isn't implemented yet: visible, honestly labeled, disabled — never hidden and never a dead link. The RSS row in `Footer` follows the identical pattern (plain text, not an `<a>`, with a visible "(coming soon)" label).

`Sidebar` (`lib/navigation/sidebar-config.ts`) is keyed by top-level section (`"work" | "knowledge"`) and is currently hand-authored with **empty `items: []` arrays** for both — it has not been wired to the real Work or Knowledge collections that now exist. `getSidebarSections()` therefore still returns nothing usable on `/work` or `/knowledge` today. This is a real, verified gap, but it belongs to `/work` and `/knowledge` themselves, not to the homepage — noted here for completeness and flagged again in §21, not brought into this task's scope.

### Knowledge routes and implementation

`/knowledge` (`app/knowledge/page.tsx`) and `/knowledge/[slug]` both exist and both work. Critically: **`/knowledge` itself is *also* still entirely placeholder-fed** — `PLACEHOLDER_START_HERE`, `PLACEHOLDER_TOPICS`, `PLACEHOLDER_SERIES`, `PLACEHOLDER_RECENTLY_PUBLISHED` — despite four real articles existing in `content/knowledge/`. `/knowledge/[slug]` is the one Knowledge surface that reads real content, via `lib/content/articles.ts`'s `getAllArticles()`/`getArticleBySlug()`. There is currently no `getFeaturedArticles()` or `getRecentArticles()` selector anywhere — `getAllArticles()` is the only aggregate accessor into the real collection.

### Work routes and implementation

`/work`, `/work/library`, and `/work/[slug]` all exist and all work, verified end-to-end in Task 5.7. `/work` and `/work/library` are resolved through `lib/content/work.ts` (`getFeaturedCaseStudies()`, `getProjectLibrary()`, `getEngineeringThemes()`, `getEngineeringLessons()`, `getCaseStudyLibrary()`, `getProjectLibraryHref()`) — but that file's own docstring is explicit that every one of those functions **still reads `PLACEHOLDER_WORK`/`PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS`/`PLACEHOLDER_ENGINEERING_LESSONS`**, not the real `content/work/*.mdx` collection, even though that real collection now has four entries. `/work/[slug]` is the one Work surface reading real content, via `lib/content/case-studies.ts`. The same file documents this as a deliberate, temporary split ("two data maturities... until the Content Engine migration happens") — not an oversight, and not something this task should silently resolve (see Decision D2, §23).

### Content loaders and relationships

`lib/content/loader.ts` is the generic engine (`getAll`/`getBySlug`/`getSlugs`/`filterDrafts`) every collection-specific file narrows. `lib/content/collections.ts` registers five collections: `knowledge`, `work`, `engineering-log`, `series`, `technologies`. **`content/pages/` exists on disk (with a `.gitkeep` only) but is not a registered collection anywhere in `collections.ts`.** Nothing in the codebase reads from it. This is a real discrepancy between what the file tree anticipates and what the content engine actually supports — flagged in §13 and §27, not resolved here.

`engineering-log` **is** a registered collection (schema: `articleFrontmatterSchema`, type: `"engineering-log"`), and `lib/content/engineering-logs.ts` already provides a real, working loader (`getAllEngineeringLogEntries()`, `getEngineeringLogEntryBySlug()`, `engineeringLogEntryExists()`) — built in Task 5.3 specifically so Work's Related Engineering Logs had something real to resolve against. `content/engineering-log/` itself contains zero real entries. No `/engineering-log` or `/engineering-log/[slug]` route exists.

`lib/content/relationships.ts` is Knowledge's shared relationship-resolution module (`resolveArticleReferences`, `resolveRelatedLearning`, `resolvePreviousNext`, and — after Task 5.7's own refinement — `hasRelatedLearningContent`). `lib/content/case-study-relationships.ts` is Work's counterpart. Both are real, tested, and already reused correctly across their respective collections.

### Metadata / SEO infrastructure

`src/lib/metadata/`, `src/lib/seo/`, `src/lib/analytics/`, `src/lib/search/` each contain only a `.gitkeep` — none of these directories have any real code yet. Every route that defines metadata today does so with a plain, inline `export const metadata: Metadata = {...}` (or `generateMetadata` for dynamic routes) — there is no shared metadata-building helper, no `SITE_URL` constant, and no Open Graph/structured-data infrastructure anywhere in the repository. `lib/constants/site.ts` defines `SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `RSS_PATH` — no base URL.

### About / Engineering Log page infrastructure

Neither `/about` nor `/engineering-log` exists as a route. No component tree, no page, no layout file for either. `PRIMARY_NAVIGATION` already points at both (§ above).

### Footer

Already fully wired and content-complete: `FooterClosingMessage`, `FooterExplore` (= `FOOTER_NAVIGATION`), `FooterConnect` (GitHub, LinkedIn, email, RSS "(coming soon)"), `FooterMetadata` (a `WORKSPACE_METADATA` list + `© {year} {SITE_NAME}`). Matches `docs/03-SITEMAP.md`'s Footer section (navigation, social links, copyright, current year) closely; nothing about it needs to change for Task 6.1.

### Responsive behavior

Every layout primitive already used sitewide (`Section`, `Container`/`PageContainer`, `Stack`) is responsive by default (`sm:`/`lg:` breakpoint steps, `flex-wrap`, capped grid columns). Homepage sections already use these primitives (`CurrentFocus`'s card grid caps at two columns even on wide screens, explicitly to preserve reading comfort over density). Nothing homepage-specific has been built outside this shared system.

### Reusable components relevant to this task

`Section`, `Stack`, `Container`/`PageContainer`, `Card`/`CardHeader`/`CardContent`, `Button`, the stretched-link row idiom used across Work and Knowledge listings, `NavLink`, `Breadcrumb` (Work/Knowledge document routes only, not relevant to the homepage). All are Server Components except `NavLink`, `ThemeToggle`, and `Sidebar` (each a narrowly-scoped client island with a concrete browser-API justification).

---

## 3. Problem Statement

**Homepage ↔ Knowledge.** The homepage's Knowledge Preview (`EngineeringNotebook`) shows three hand-typed fixture entries that do not correspond to the four real articles now published. A visitor reading the homepage forms an impression of "what knowledge exists here" that is already wrong the moment they click through to `/knowledge` (which, separately, has the same problem against its own real content — see §2, §21).

**Homepage ↔ Work.** The homepage's Featured Work section (`EngineeringCaseStudies`) shows `PLACEHOLDER_WORK` directly — the same array `/work`'s own `getFeaturedCaseStudies()` reads, so the *content* happens to already match `/work`'s Featured section by coincidence of shared fixture data, not by design. That coincidence is fragile: `/work`'s real convergence path (§2) is to migrate off `PLACEHOLDER_WORK` eventually, and if the homepage keeps importing the fixture directly instead of calling the same resolver `/work` calls, the two pages will silently diverge the moment that migration happens.

**Engineering Log, future.** The homepage already has a real `EngineeringLog` section and a real (empty) collection/loader behind it, but the two aren't connected — the homepage currently shows `PLACEHOLDER_LOG`, three invented entries with routes that don't exist. Task 6.1 needs to define the *contract* between the homepage and this collection (§12) without building the reading experience the entries would eventually link to (that's a later 6.x task, per this task's own brief).

**About, future.** `BeyondTheCode`'s CTA already points at `/about`, which doesn't exist. The relationship is already correctly designed (§13) — it just points at a destination Task 6.1 is explicitly forbidden from building.

**Primary navigation.** Four destinations are declared; two exist and two don't yet (by design — see §8's Decision). Independently of that, no viewport below `lg` can reach *any* of the four through primary navigation at all — this is the one gap in this section that isn't "waiting on content," it's a genuine, currently-shipped accessibility and usability hole (§8, §17).

**Avoiding duplicated content.** Every fix above has the same shape: reuse the resolver the destination page already calls (or will call), never introduce a second query, a second dataset, or a second selection algorithm that happens to produce similar-looking results. This is the single thread running through §9–§11.

**Preserving workspace identity.** `docs/13-HOMEPAGE_EXPERIENCE.md`'s narrative, tone, and section purposes are already correctly implemented (§2). Task 6.1's job is to make what's *already there* honest about real content — not to redesign, reorder, or re-theme it.

---

## 4. Goals

- Establish the homepage as the workspace's entry point and integration layer, not a sixth content collection.
- Replace the homepage's placeholder Knowledge preview with a real, small selection from the actual Knowledge collection.
- Replace the homepage's placeholder Work preview with the same resolved Featured selection `/work` itself uses.
- Define (not build) the Engineering Log integration contract — collection, homepage preview shape, link destination, empty-state behavior.
- Define (not build) the About integration contract — what the homepage may preview, what stays exclusive to `/about`.
- Make primary navigation reach every viewport, not only `lg` and above.
- Resolve `/engineering-log` and `/about`'s current non-resolving state honestly in the design (§8's Decision) without building either route.
- Give the homepage its own `export const metadata`, matching the pattern every other real route already uses.
- Preserve `docs/13`'s approved narrative and section purposes exactly.
- Preserve server-first rendering — no new client component without a concrete browser-API justification.
- Preserve accessibility and responsive quality already established elsewhere in the codebase.
- Preserve single source of truth for every dataset the homepage touches.

## 5. Non-Goals

Explicitly out of scope for Task 6.1:

- Implementing `/engineering-log` (route, layout, or reading experience) — a later Task 6.x.
- Implementing `/about` — a later Task 6.x.
- Implementing Search in any form beyond what already exists (the disabled header icon) — see §22's boundary ruling.
- Discovery features: filtering, tags/technology browsing, reading paths — Milestone 7.
- Analytics, comments, bookmarks, reading progress.
- A CMS, database, or any content source beyond the existing MDX collections.
- A second Knowledge or Work dataset, however small or "just for the homepage."
- Unnecessary client-side state — the one new client surface this proposal anticipates (mobile navigation, §8) is scoped as narrowly as `NavLink`/`Sidebar` already are.
- Interactive architecture diagrams.
- Redesigning `/work` or `/knowledge`'s own information architecture, visual language, or component set. Their *data sources* migrating off placeholder fixtures is real, adjacent work (§21) but is these pages' own task, not this one's.

None of these boundaries need to move based on anything found in the repository. `docs/28`'s own "Out of Scope" list (Search, Analytics, Comments, Bookmarks, Reading progress, AI-assisted navigation) already established this discipline for Milestone 5; this task inherits it unchanged for Milestone 6's own equivalent list in `docs/12`.

---

## 6. Homepage Information Architecture

Section names below follow what's actually implemented (`docs/13`'s narrative, matched to the current component names) rather than the brief's own generic placeholder names, per this document's own "do not blindly preserve names" instruction.

### Workspace Header + README Introduction (`ReadmeHero`)

**Question:** *Where am I?* **Purpose:** establish that this is engineering documentation, not a portfolio, before any content loads. **Content:** editorial — static copy (`HERO_COPY`), no collection. **Displays:** headline, short statement, a terminal-style snippet, a primary CTA. **Belongs elsewhere:** nothing — this section has no deeper destination of its own. **CTA:** into Knowledge (already implemented this way). **Empty state:** not applicable — pure copy.

### Current Focus

**Question:** *What is this engineer actively exploring right now?* **Purpose:** show ongoing learning, not a skills list. **Content:** editorial — static copy (`CURRENT_FOCUS_COPY`), no collection; this is a deliberate authorial statement, not a derived "recent activity" feed. **Displays:** a small, capped set of focus areas with one reasoning sentence each. **Belongs elsewhere:** nothing — there is no "Current Focus" destination page. **CTA:** none (informational). **Empty state:** not applicable — editorial copy is never empty by construction; if this ever became dynamic, it should disappear entirely rather than show nothing.

### How I Think

**Question:** *How does this engineer approach problems?* **Purpose:** state engineering principles before any evidence is shown — the same "claim before evidence" ordering `docs/29-WORK_LANDING_PROPOSAL.md` §1 uses for the Work Landing's own Engineering Philosophy section, at the workspace's outermost scope. **Content:** editorial — static copy (`HOW_I_THINK_COPY`). **Belongs elsewhere:** nothing. **CTA:** none. **Empty state:** not applicable.

### Knowledge Preview (`EngineeringNotebook`)

**Question:** *What engineering knowledge exists here?* **Purpose:** demonstrate depth, invite exploration — never a second index. **Content:** dynamic, sourced from the real Knowledge collection (§9, §11). **Owning collection:** `content/knowledge/`, via `lib/content/articles.ts`'s `getAllArticles()`. **Displays:** a small, capped number of articles (title, one-line description, a quiet citation line — the same idiom `RelatedKnowledge`/`RecentlyPublished` already use). **Belongs on `/knowledge` instead:** the complete, browsable archive, topic grouping, series. **CTA:** into `/knowledge` (already implemented, generalized `ContinueExploring`-style routing, not a second browsing surface). **Empty state:** if zero published articles exist, the section should render nothing rather than an empty heading — the same `null`-when-empty discipline `RelatedKnowledge`/`RelatedLearning` already apply (moot today: four real articles exist).

### Featured Engineering Work (`EngineeringCaseStudies`)

**Question:** *What engineering work exists here?* **Purpose:** show engineering stories — problem, approach, trade-offs, outcome — never a project gallery. **Content:** dynamic, the *same* editorially-curated Featured subset `/work` itself shows (§10). **Owning collection:** the one Work project collection, via `lib/content/work.ts`'s `getFeaturedCaseStudies()`. **Displays:** title, one-line engineering-challenge summary, a quiet domain/status/date citation line — identical visual idiom to `/work`'s own `FeaturedCaseStudies`. **Belongs on `/work` instead:** the complete Project Library, Architecture Highlights, Engineering Lessons. **CTA:** into `/work` (or `/work/library` directly, mirroring how `/work`'s own Project Library section points at the Library, not a homepage-specific destination). **Empty state:** if the Featured set is ever empty (a valid editorial state — Featured is curated, not guaranteed non-empty), the section should render nothing, matching `FeaturedCaseStudies`' own existing empty-state handling on `/work` itself.

### Engineering Log Preview (`EngineeringLog`)

**Question:** *What is the raw engineering process behind this work?* **Purpose:** show discovery and experimentation — the "authenticity" beat `docs/13` names — distinct from the polished Knowledge/Work sections above it. **Content:** dynamic, sourced from the real (currently empty) `engineering-log` collection via the already-existing `getAllEngineeringLogEntries()`. **Belongs on `/engineering-log` instead:** the complete chronological archive. **CTA:** into `/engineering-log`. **Empty state:** see §12 — this is the one section where Task 6.1 must define real behavior today even though the collection is empty today.

### Meet the Engineer (`BeyondTheCode`)

**Question:** *Who is behind this workspace?* **Purpose:** introduce identity only after trust has been established by everything above it — already correctly positioned last, before the footer. **Content:** editorial — static copy (`BEYOND_THE_CODE_COPY`). **Belongs on `/about` instead:** full biography, journey, principles, current interests, tools, contact — everything `docs/03-SITEMAP.md`'s About section lists. **CTA:** into `/about` (already implemented). **Empty state:** not applicable — editorial copy.

### Workspace Footer

Global, not homepage-specific (§2). No change proposed.

**On not becoming a duplicate of `/knowledge` or `/work`:** every dynamic section above (Knowledge Preview, Featured Work, Engineering Log Preview) is capped, curated, and explicitly described as a *preview* whose entire job is to route a reader one level deeper — never a second instance of `/knowledge`'s Browse-by-Topic, `/work/library`'s Browse Lenses, or either page's complete listing. This is the identical discipline `docs/29-WORK_LANDING_PROPOSAL.md` §5 already established for the Work Landing's own Project Library preview relative to the real Case Study Library, one layer further out.

---

## 7. Visitor Journey

```
Welcome
  ↓
Discover the workspace          (README Introduction)
  ↓
Understand the mindset          (Current Focus, How I Think)
  ↓
See the knowledge               (Knowledge Preview)
  ↓
Explore the engineering work    (Featured Work)
  ↓
Discover the engineering process (Engineering Log Preview)
  ↓
Meet the engineer                (Meet the Engineer)
  ↓
Continue exploring                (Footer)
```

This is `docs/13`'s own approved journey, already implemented in this exact order (§2, §6) — this proposal does not reorder it. The sequence is appropriate specifically because it is not a generic portfolio sequence: knowledge and work are demonstrated *before* identity is introduced (`docs/13`'s "Knowledge Before Identity" principle), which is the one deliberate inversion of a typical portfolio's "who I am, then what I've built" order. Optimizing it toward a more conventional hero-then-bio-then-work structure would directly contradict the workspace's own stated philosophy and is explicitly not proposed here.

---

## 8. Primary Navigation Architecture

**Desktop (`lg` and above):** already correct. `Header` renders the wordmark (→ `/`) and `PrimaryNavigation` (`<nav aria-label="Primary">`, four `NavLink` items) side by side, sticky, with the Search/RSS/GitHub/theme-toggle cluster on the right.

**Mobile/tablet (below `lg`):** currently **broken as a navigation path**, not merely "less polished." No trigger, no drawer, no alternate rendering of `PrimaryNavigation` exists below `lg` (§2). The footer remains reachable and links the same four destinations, but requiring a full scroll to the bottom of every page to reach primary navigation is not "primary navigation on mobile" — it's the absence of it. This is the one item in this proposal that is a genuine, currently-shipped gap rather than a "not built yet" placeholder.

**What Task 6.1 should specify (not build):** a mobile navigation trigger in `Header`, visible only below `lg` (mirroring `PrimaryNavigation`'s own `hidden lg:block`, inverted), opening the same `PRIMARY_NAVIGATION` array in an accessible disclosure — a sheet/drawer/full-screen panel are all reasonable implementations; the specific choice belongs to the implementation task, not this proposal, but the source of the data must be `PRIMARY_NAVIGATION` unchanged, not a second, mobile-specific navigation list. `components/ui/` has no dialog/sheet primitive today (§2) — one narrowly-scoped client component is genuinely necessary here, not avoidable through reuse (§14).

**Active route behavior:** reuse `NavLink`/`useIsActiveItem` exactly as implemented — `aria-current="page"`, no separate mobile active-state logic.

**Keyboard navigation:** the trigger must be a real, focusable, keyboard-operable control (a native `<button>`); the opened panel must trap or otherwise sensibly manage focus while open, per standard disclosure-pattern practice, and must be closable via `Escape`. No requirement here is new — it matches the same rigor already applied to `Header`'s existing `NavLink`/`ThemeToggle` client islands.

**Focus behavior:** opening the panel should move focus into it (typically its first link or a close control); closing it should return focus to the trigger — the standard, already-expected pattern for any disclosure this codebase would introduce.

**Accessible labels:** the trigger needs a real `aria-label` (e.g. "Open navigation") and `aria-expanded` reflecting its state, matching the precision already used elsewhere (`Search (coming soon)`, `aria-label="Primary"`).

**Home as a nav item:** stays absent from `PRIMARY_NAVIGATION`, exactly as today — the wordmark is Home's only entry point in every context, including the new mobile panel, which should render the same four-item list, not five.

**Scaling for future sections:** `PRIMARY_NAVIGATION` is already a plain array read by every nav surface (`Header`, `Footer`, and — once built — the mobile panel) — a future fifth item (e.g. a `Now` page, per `docs/03`'s own "Future Expansion" list) is a one-line addition to that array, requiring no structural change to any of the three renderers. This is the existing architecture already working as intended; Task 6.1 doesn't need to change it to satisfy this requirement, only extend where it renders.

**No dropdowns:** none proposed. Four flat items remain a flat list on every surface, matching `docs/03`'s own "Navigation should remain intentionally small" principle.

---

## 9. Content Architecture

```
Knowledge Collection (content/knowledge/*.mdx)
        ↓
   getAllArticles() [existing]
        ↓
   ┌─────────────┴─────────────┐
   ▼                           ▼
/knowledge (own preview,    Homepage Knowledge Preview
 currently placeholder —     (new: a small selection call,
 not this task's scope)       reusing getAllArticles())
```

```
Work Collection (the one project collection, still PLACEHOLDER_WORK
today — see §2/§10)
        ↓
   getFeaturedCaseStudies() [existing, lib/content/work.ts]
        ↓
   ┌─────────────┴─────────────┐
   ▼                           ▼
/work's own Featured        Homepage Featured Work
 Case Studies section        (calls the same function)
```

```
Engineering Log Collection (content/engineering-log/*.mdx, empty today)
        ↓
   getAllEngineeringLogEntries() [existing, lib/content/engineering-logs.ts]
        ↓
   ┌─────────────┴─────────────┐
   ▼                           ▼
/engineering-log (future,   Homepage Engineering Log Preview
 Task 6.x, not this task)    (defines the contract now, §12)
```

The homepage must not create an independent copy of any of these three datasets. Concretely: `app/page.tsx` should call the same resolver function the owning destination page calls (or will call), never re-derive a similar-looking selection through its own filter/sort logic, and never import a `placeholder-*` constant directly once a real selector exists.

**Loader reuse:** `getAllArticles()`, `getFeaturedCaseStudies()`, `getAllEngineeringLogEntries()` — all pre-existing, all already load real content correctly.

**Relationship reuse:** not applicable at the homepage level — the homepage previews items, it doesn't resolve relationships between them. (Related Knowledge/Related Engineering Logs/Previous-Next remain document-level concerns, owned by `/knowledge/[slug]` and `/work/[slug]` respectively.)

**Filtering/selection strategy:** Knowledge Preview needs a *new*, small selector — "recent" or "featured," to be decided in the implementation task, not invented here — since no such selector exists yet (§2). Featured Work needs no new selector: `getFeaturedCaseStudies()` already does exactly what's needed. Engineering Log Preview needs no new selector either: `getAllEngineeringLogEntries()` combined with an existing recency sort is sufficient once entries exist.

**Editorial vs. dynamic:** README Introduction, Current Focus, How I Think, and Meet the Engineer stay fully editorial (static copy, no collection) — this is correct today and nothing here proposes changing it. Knowledge Preview, Featured Work, and Engineering Log Preview are dynamic, collection-backed selections.

**Ordering:** Featured Work already has a defined ordering discipline (`lib/content/work.ts`'s own docstring: "significance, not implementation convenience"). Knowledge Preview's ordering (most likely recency, i.e. `publishedAt` descending) is a decision for the implementation task once the new selector is designed — not resolved here, since no such selector exists yet to have an ordering policy at all.

**Limits:** each dynamic section should render a small, fixed cap (2–4 items), matching the restraint every other "preview" section in this codebase already uses (`DEFAULT_RELATIONSHIP_LIMIT = 4` in `relationships.ts`, `FeaturedCaseStudies`' own small curated set). The exact number is an implementation-task decision, not fixed here.

**Empty states:** see §6 (per-section) and §20 (systemically).

---

## 10. Work Integration

The homepage should consume Work exactly the way `/work` itself does: call `getFeaturedCaseStudies()` from `lib/content/work.ts` and pass its result straight into `EngineeringCaseStudies` — the same "pages receive already-resolved data" discipline Task 5.1's own review refinement #1 established, now applied one page further out. No new Work loader, selector, or type is needed; `EngineeringCaseStudies` already accepts `CaseStudyEntry[]`, the exact shape `getFeaturedCaseStudies()` already returns.

This proposal explicitly does **not** ask the homepage to read `content/work/*.mdx` directly, or to call `case-studies.ts`'s real-content resolvers (`getAllCaseStudies()`, etc.) — those serve `/work/[slug]`'s document-reading concerns (Previous/Next, Related Knowledge), which the homepage has no need for. The homepage's relationship to Work is exactly `/work`'s own Featured section's relationship to the project collection: an editorial, capped preview, never the complete archive.

If `lib/content/work.ts` is ever migrated off `PLACEHOLDER_WORK` onto the real collection (the convergence that file's own docstring already anticipates), the homepage requires **zero changes** — it will already be calling `getFeaturedCaseStudies()`, whose signature and meaning don't change, only its internal implementation. This is precisely why reusing the resolver, rather than importing `PLACEHOLDER_WORK` directly as `page.tsx` currently does, is the architecturally correct choice here, independent of whether that migration happens before or after Task 6.1 ships.

Engineering Themes and Architecture Highlights are **not** proposed for homepage inclusion — `docs/29-WORK_LANDING_PROPOSAL.md` §4 already scopes Architecture Highlights as the Work Landing's own second navigation model; duplicating it one layer further out at the homepage would be exactly the kind of navigation-complexity growth `docs/29` §9's governing principle ("growth should increase relationship richness, not navigation complexity") warns against.

---

## 11. Knowledge Integration

The homepage should consume Knowledge via `getAllArticles()` (`lib/content/articles.ts`), the same real loader `/knowledge/[slug]` already uses correctly. Unlike Work, there is currently **no existing "featured" or "recent" selector** to reuse (§2) — `getAllArticles()` returns the complete collection, unordered by any curation policy. The smallest architecturally-consistent extension is a new, small selector function (its exact name/shape is an implementation-task decision — a natural candidate, matching `lib/content/work.ts`'s own precedent, is a thin homepage-facing resolver that takes `getAllArticles()`'s result and returns a small ordered slice), not a new loader and not a new collection.

Card rendering reuses `EngineeringNotebook`'s existing card treatment (already built, already accepts real article-shaped data) — no new component. Relationship resolution (Related Learning, Previous/Next) is out of scope here entirely; the homepage links *into* an article, it doesn't need to know anything about that article's own relationships.

The homepage should link to `/knowledge` for "see everything," never render its own topic grouping, series list, or search/filter affordance — that is `/knowledge`'s own, already-designed information architecture (§6).

**A note on `/knowledge`'s own placeholder data (§2, §21):** this proposal deliberately does not ask Task 6.1 to also fix `/knowledge`'s own `PLACEHOLDER_START_HERE`/`PLACEHOLDER_RECENTLY_PUBLISHED`/etc. — that is `/knowledge`'s own migration to make, on its own schedule, and is explicitly excluded by this task's "do not redesign the Knowledge experience" boundary. It is flagged so the eventual selector this task introduces is designed as something `/knowledge` could *also* reuse later, rather than a homepage-only shortcut that would need to be redone.

---

## 12. Engineering Log Integration

Engineering Logs are a later task (`docs/28`'s own numbering makes this Milestone 6's own later 6.x task, not 6.1). Task 6.1 defines the contract only:

- **Expected collection/source:** `content/engineering-log/` (already a registered collection, `lib/content/collections.ts`), read through the already-existing `getAllEngineeringLogEntries()` (`lib/content/engineering-logs.ts`).
- **Expected homepage preview:** the same small, capped, editorial-feeling card treatment `EngineeringLog` already renders — title and a quiet date/citation line, nothing more (matching `PLACEHOLDER_LOG`'s own documented "summary exists on the type but is intentionally never rendered here" restraint, which should carry forward once real entries exist).
- **Expected link destination:** `/engineering-log`, once that route exists. Individual entries would link to `/engineering-log/[slug]`, matching the route shape `case-study-relationships.ts` already assumes for `ResolvedEngineeringLogSummary.href`.
- **Expected empty state before real logs exist:** the section should render **nothing** — no placeholder cards, no "coming soon" copy standing in for real content, no fabricated entries. This is `docs/26`/`docs/31`'s "never fabricate content, never render an empty heading over nothing" discipline, applied to the homepage. Concretely: `EngineeringLog` should follow the same `if (items.length === 0) return null` pattern `RelatedKnowledge`/`RelatedEngineeringLogs` already establish for Work, not the "always show something" pattern the current placeholder-fed version accidentally exhibits by having fixture data that's never actually empty.
- **Expected behavior once logs exist:** no change to the contract above — the section simply stops rendering `null` and starts rendering real entries, because it was already built to react to real collection size rather than to a hardcoded assumption that entries exist.

The architectural distinction this section must preserve: **Engineering Logs = discovery/process, Case Studies = refined conclusions, Knowledge = reusable explanations.** The homepage's Engineering Log Preview must never become a second, lighter-weight Case Study listing — it should read as raw and dated, the same tonal distinction `docs/26`'s closing diagram already establishes for the Work/Log relationship, one layer further out at the homepage.

---

## 13. About Integration

`/about` is a later task. Task 6.1 defines only the boundary:

- **Where the homepage points to About:** `BeyondTheCode`'s existing CTA — already correctly wired, already correctly worded, requires no change.
- **What may be previewed on the homepage:** nothing beyond what `BeyondTheCode` already shows — a short, reflective closing statement. No biography excerpt, no timeline snippet, no "here's a preview of my About page" pattern.
- **What belongs exclusively to `/about`:** biography, journey, engineering principles (the fuller version, not `How I Think`'s homepage-scoped statement), current interests, tools, learning roadmap, and contact — the full list `docs/03-SITEMAP.md`'s About section already specifies.
- **Does the homepage need a "Meet the Engineer" section?** No new one — `BeyondTheCode` already *is* that section, and is already correctly scoped as the homepage's closing beat, not a compressed About page (its own docstring states this explicitly). Nothing here proposes adding, removing, or expanding it.
- **How the homepage avoids becoming a biography page:** by construction — `BeyondTheCode` is deliberately the simplest, most restrained section on the page (title, four paragraphs, one CTA, no photo/timeline/stats/social grid), and this proposal does not ask it to grow.

---

## 14. Component Reuse

| Existing Component | Reuse Purpose | Modification Needed? |
|---|---|---|
| `ReadmeHero` | README Introduction | None |
| `CurrentFocus` | Current Focus | None |
| `HowIThink` | How I Think | None |
| `EngineeringNotebook` | Knowledge Preview | None — already accepts `articles` as a prop; only the caller (`page.tsx`) changes what it passes |
| `EngineeringCaseStudies` | Featured Work | None — already accepts `caseStudies` as a prop; only the caller changes |
| `EngineeringLog` | Engineering Log Preview | Small: add an empty-state `return null` (or equivalent) if it doesn't already degrade gracefully at zero entries — verify against real (empty) data before assuming; everything else about it stays |
| `BeyondTheCode` | Meet the Engineer | None |
| `Header` | Desktop primary navigation, brand, utility icons | Add a mobile-nav trigger, only rendered below `lg` |
| `PrimaryNavigation` | The four-item nav list | None — the new mobile panel reuses this same list/array, not a new one |
| `NavLink` | Active-state-aware link | None — reused as-is inside any new mobile panel |
| `Footer` | Global footer, already reaches every viewport | None |
| `Section` / `Stack` / `Container` | Layout rhythm | None |
| `Card` / `CardHeader` / `CardContent` | Card idiom already used by `CurrentFocus`, `WorkspaceSnapshot` | None |

**New component genuinely necessary:** a mobile navigation trigger + panel (§8). No existing component in `components/ui/` or `components/navigation/` can be reused or extended to fill this role — there is no dialog/sheet/drawer primitive in the codebase today, and stretching `PrimaryNavigation` itself to also handle disclosure state would break its current status as a pure Server Component. This is the one place this proposal asks for new code, and it is scoped as narrowly as `NavLink`/`ThemeToggle`/`Sidebar` already are (a single, small client island with a concrete browser-interaction justification — a viewport that can't otherwise reveal the panel).

No other new component is proposed.

---

## 15. Data / Loader Architecture

**Existing, reused as-is:** `getFeaturedCaseStudies()` (Work), `getAllArticles()` (Knowledge), `getAllEngineeringLogEntries()` (Engineering Log).

**New code required — the smallest extension:** one small selector function for Knowledge, analogous in spirit to `getFeaturedCaseStudies()`, taking `getAllArticles()`'s result and returning a small, ordered slice (recency- or featured-flag-driven — a decision left to the implementation task). This belongs in a new or existing Knowledge-scoped resolver file (`lib/content/articles.ts` itself, or a new file mirroring `lib/content/work.ts`'s role) — not in `app/page.tsx`, preserving the same "presentation never derives its own selection" discipline this whole proposal is built around.

No new loader, no new relationship resolver, no new content collection, and no new helper beyond that one selector are required. This document does not specify that function's implementation — only that it is the one legitimate piece of new logic Task 6.1's eventual implementation should introduce.

---

## 16. Responsive Behavior

**Desktop:** unchanged from today — the seven-section homepage already reads correctly at wide viewports, using the same `Section`/`Container` rhythm every other page uses.

**Tablet:** `CurrentFocus`'s card grid already caps at two columns (a deliberate choice, not an accident of the grid system) — this should hold; no section should need a tablet-specific redesign, only the ordinary breakpoint steps already baked into `Section`/`Stack`.

**Mobile:** the one real change is navigation (§8) — everything else (Knowledge Preview cards, Featured Work rows, Engineering Log Preview rows) should degrade the same way `/work`'s and `/knowledge`'s equivalent list sections already do: single-column, full-width, no horizontal scroll.

**Navigation:** primary navigation must be reachable at every breakpoint post-implementation (§8) — currently the one broken case.

**Section spacing / cards / typography / metadata:** no new pattern proposed; every dynamic section reuses an idiom (title + one-line description + quiet citation line) already proven responsive across `/work` and `/knowledge`.

**Footer:** already correct at every breakpoint (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), no change.

**Content density:** dynamic sections stay capped (§9) specifically so mobile density never grows unboundedly as the underlying collections grow — the same principle `docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md` §9 already established for the Work Library, applied to a homepage preview instead of a full archive.

**No horizontal overflow:** no section in this proposal introduces a table, wide code block, or diagram — the risk profile here is low, and nothing here should require the `overflow-x-auto` handling those content types need elsewhere.

---

## 17. Accessibility

- **Semantic landmarks:** unchanged — `<header>`, `<main id="main-content">`, `<footer>` already exist via `WorkspaceLayout`. The new mobile nav panel needs its own accessible name if implemented as a distinct landmark (e.g. a labeled `<nav>` inside the panel, matching `PrimaryNavigation`'s own `aria-label="Primary"` — the mobile panel should almost certainly reuse `PrimaryNavigation` directly rather than re-implementing its markup).
- **Heading hierarchy:** each homepage section already has its own `<h2>` (`ReadmeHero`'s `<h1>` is the page's one and only `<h1>`, matching every other route's "exactly one `<h1>`" rule) — no change needed for the sections whose data source changes, since the heading markup doesn't move.
- **Navigation landmarks:** `<nav aria-label="Primary">` already exists; the mobile panel must not introduce a second, differently-labeled navigation landmark for the identical list — reusing `PrimaryNavigation` avoids this by construction.
- **Keyboard navigation / visible focus:** the mobile trigger needs the same `focus-visible:ring-2` treatment already standard across every interactive element in this codebase (`Header`'s existing icon buttons, `NavLink`, `Breadcrumb`, etc.) — no new pattern, just applied to one more control.
- **Accessible link names:** every dynamic section's cards already use real, descriptive titles as their link text (the stretched-link idiom used throughout `/work` and `/knowledge`) — carried forward unchanged.
- **Image alt text:** not applicable — no images are proposed anywhere in this document (matching `docs/25`'s and every prior Work proposal's explicit rejection of decorative imagery, extended here to the homepage).
- **Reduced motion:** any transition on the new mobile panel (open/close) must be wrapped in `motion-safe:`, matching the codebase's existing, consistent pattern (`CurrentFocus`'s hover scale, the global `motion-safe:scroll-smooth`).
- **Color contrast:** no new color token is proposed; every element reuses existing, already-verified tokens.
- **Screen-reader behavior:** a screen-reader user should be able to reach every primary destination via the mobile panel exactly as a desktop keyboard/pointer user reaches them via `Header`'s own nav — this is the actual substance of "coherent navigation across the workspace," not just a visual requirement.
- **Mobile navigation accessibility:** covered above; this is the one accessibility requirement in this proposal that is not merely "preserve what's already correct" but "build correctly for the first time," since no mobile nav currently exists to preserve.

No accessibility requirement in this document depends on visual appearance alone — every one above is either a semantic/ARIA requirement or a keyboard-operability requirement, independent of theme or color.

---

## 18. Performance

- **Server Components by default:** every homepage section remains a Server Component; only the new mobile-nav trigger (§8, §14) is a client boundary, and it is justified by a real browser interaction (a click/tap revealing a panel) that cannot be server-rendered.
- **Static generation:** the homepage should remain statically generated wherever the underlying collections allow it — no different from how `/work` and `/knowledge` already build today.
- **Existing content loaders:** reused, not reimplemented (§9, §15) — no duplicate parsing of Knowledge or Work content anywhere.
- **No unnecessary client JavaScript / hydration:** the one new client island is scoped as narrowly as `NavLink`/`ThemeToggle` already are; nothing else on the homepage should gain a `"use client"` boundary.
- **Optimized images:** not applicable — no images proposed.
- **Minimal runtime data fetching:** all three dynamic sections resolve at build/request time through existing server-side loaders, identical to how `/work` and `/knowledge/[slug]` already work — no client-side fetch anywhere.
- **No duplicate content processing:** the entire point of §9–§11 is exactly this — one resolver call per collection, shared with (or identical to) the destination page's own call.

No new performance infrastructure (caching layer, CDN configuration, image pipeline) is proposed or required — the existing static-generation/server-component approach already satisfies this task's needs.

---

## 19. SEO / Metadata Boundary

Task 6.1 owns:

- **Page title / description:** `app/page.tsx` should gain its own `export const metadata`, matching the pattern `/work`'s and `/knowledge`'s own page files already establish (a plain object, `SITE_NAME`-derived title, a real description of the workspace). This closes the one concrete gap found in §2 (the homepage currently has no metadata of its own).
- **Semantic headings:** already correct, carried forward unchanged (§17).

Task 6.1 does **not** own, and should not attempt:

- **Canonical URL / absolute Open Graph URLs** — these need a site-wide base URL constant that doesn't exist yet (`lib/constants/site.ts` has no `SITE_URL`); introducing one for the homepage alone, without a workspace-wide metadata strategy, would be exactly the kind of one-off infrastructure this document's own Non-Goals reject. This belongs to `docs/12`'s Milestone 8 (SEO & Performance).
- **Structured data (JSON-LD, etc.)** — none exists anywhere in the codebase today; introducing it for the homepage only would be inconsistent with every other route, and is explicitly Milestone 8 scope.
- **Any other advanced SEO work** — sitemap.xml, robots.txt, RSS feed generation are Milestone 6's own later deliverables per `docs/12`, not this task's.

---

## 20. Empty / Failure States

The homepage must fail honestly — never fabricate content to fill a section.

| Condition | Behavior |
|---|---|
| Knowledge has zero published articles | Knowledge Preview section renders nothing (not an empty heading, not placeholder cards) |
| Work has zero featured entries | Featured Work section renders nothing — a valid editorial state, not an error |
| Engineering Log has zero entries | Engineering Log Preview section renders nothing — the honest, current, real state (§12) |
| Featured content references something unresolvable | Silently excluded, the same "resolve what can be resolved, omit what cannot" discipline `resolveArticleReferences()` and `resolveRelatedEngineeringLogs()` already apply everywhere else in this codebase — never a broken link, never a fabricated title |
| A referenced item becomes unavailable after publish | Same as above — omitted from the next render, not specially handled |

No section listed above should ever fall back to a different content source to avoid appearing empty (e.g. Featured Work should never silently fall back to "most recent" if Featured is empty) — an honest empty section is preferable to a section whose stated purpose (curated evidence) it no longer actually serves.

---

## 21. Navigation Relationships

```
Home
  │
  ├──▶ Knowledge          (Knowledge Preview CTA, primary nav, footer)
  ├──▶ Work                (Featured Work CTA, primary nav, footer)
  ├──▶ Engineering Log     (Engineering Log Preview CTA, primary nav, footer — link exists,
  │                          destination doesn't yet, §8's Decision)
  └──▶ About               (Meet the Engineer CTA, primary nav, footer — same)

Knowledge ──▶ Home          (wordmark, every page)
Work ──▶ Home                (wordmark, every page)
Work/Knowledge ──▶ each other (existing Related Knowledge / Knowledge Integration, Task 5.6)
```

Every destination connects back to Home the same way — the wordmark, present on every page via the shared `Header`. No page-specific "back to home" link is proposed or needed. `/work` and `/knowledge` already connect to each other where genuinely relevant (Related Knowledge on Case Studies); the homepage doesn't need to re-create that link, only route a first-time visitor toward whichever of the two is more relevant to what they just read (already correctly ordered: Knowledge before Work, per §7).

**Related discrepancy, flagged not fixed:** `Sidebar`'s own contextual navigation for `/work` and `/knowledge` (§2) is currently non-functional against real content (hardcoded empty `items: []`). This is not a homepage concern and is not brought into this task's scope — but a future task should reconcile it, ideally using the same real-content resolvers this proposal asks the homepage to start using, so `/work`, `/knowledge`, and the homepage all converge on identical selection logic rather than three independently-drifting ones.

---

## 22. Search Boundary

`docs/12-Implementation Roadmap.md` places "Search" under **both** Milestone 6 — Core Pages' own deliverable list *and*, again, under Milestone 7 — Discovery's ("Search, Filtering, Tags, Technologies, Series, Reading Paths, Related Content"). This is a real ambiguity in the roadmap document, not a misreading — both lists literally include the word "Search."

**Resolution proposed by this document:** Milestone 6's "Search" deliverable refers to a minimal, functional search entry point — at most, a dedicated `/search` route or an inline results view wired to a simple query over existing content (no ranking model, no filters, no faceted browsing). Milestone 7's "Search" is the full Discovery-grade capability — filtering, tags, technologies, series browsing, reading paths, related-content surfacing — built on top of whatever minimal capability Milestone 6 established.

**What belongs to Task 6.1 specifically:** nothing beyond what already exists. `Header`'s Search icon is already a correctly-scoped placeholder — `disabled`, honestly labeled `"Search (coming soon)"` — and this proposal does not ask it to change. Building the actual search entry point (however minimal) is a separate, later Task 6.x, not folded into Homepage Integration.

**Why this boundary matters:** without stating it explicitly, "Search" could plausibly be attempted twice — once as a minimal Task 6.x implementation, and again as part of Milestone 7 — without either team member spotting the duplication until both existed. This document exists specifically to prevent that: Milestone 6's eventual Search task should scope itself to "does a query resolve to something," and explicitly defer ranking, filtering, and faceting to Milestone 7, rather than either milestone quietly reinventing the other's scope.

---

## 23. Architecture Decisions

### D1 — Homepage as Integration Layer, Not a Sixth Collection

**Context:** the homepage currently owns three sets of fixture data that duplicate what Knowledge and Work already own for real.

**Options Considered:** (a) keep homepage-specific fixture/curated data indefinitely, treating the homepage as its own small content surface; (b) make the homepage call the same resolvers its destination pages call; (c) build a dedicated "homepage content" MDX collection.

**Chosen Approach:** (b).

**Rationale:** (a) is the status quo and is exactly the problem this task exists to fix — it's already visibly wrong now that real content exists. (c) introduces a sixth collection and a second source of truth for data Knowledge and Work already own, directly violating `docs/24` Principle 3. (b) requires zero new content infrastructure and guarantees the homepage can never show something `/work` or `/knowledge` themselves would disagree with.

**Trade-offs:** the homepage's featured selections are exactly as curated (or as sparse) as `/work`'s and `/knowledge`'s own — it cannot show a homepage-only "best of" that differs from what those pages consider featured. This is treated as a feature, not a limitation: two different "featured" answers for the same collection is the drift this decision exists to prevent.

**Consequences:** any future change to what counts as "featured" Work happens once, in `lib/content/work.ts`, and is inherited by both `/work` and the homepage automatically.

### D2 — Do Not Migrate `/work`'s or `/knowledge`'s Own Placeholder Data as Part of This Task

**Context:** both `/work` (via `lib/content/work.ts`) and `/knowledge` (via its own page-level placeholder imports) still read fixture data, not the real collections that now exist (§2).

**Options Considered:** (a) fold that migration into Task 6.1, since it's directly adjacent; (b) leave it untouched, scope Task 6.1 to the homepage's own data sourcing only.

**Chosen Approach:** (b).

**Rationale:** the task's own explicit boundary ("do not redesign the Work or Knowledge experiences") rules out (a); `lib/content/work.ts`'s own docstring already documents its placeholder-to-real migration as a deliberate, separately-scheduled step, not something to force now as a side effect of an unrelated task.

**Trade-offs:** the homepage's Featured Work section will, for now, keep showing whatever `getFeaturedCaseStudies()` returns today (three of the four real case studies — VaultPay, GoHunt marked `featured: true` in the current fixture) rather than a selection drawn from the full real collection. This is acceptable because it's `/work`'s own current, already-approved state — the homepage simply inherits it faithfully rather than disagreeing with it.

**Consequences:** when `lib/content/work.ts` eventually migrates, the homepage requires no follow-up work (D1's own consequence).

### D3 — Server-First Homepage, One New Client Boundary

**Context:** the homepage is entirely server-rendered today; this proposal's one new requirement (mobile navigation) needs real client interactivity.

**Options Considered:** (a) find a way to build mobile navigation without any client component (e.g. a pure-CSS checkbox-hack disclosure); (b) accept one small, justified client component, matching `NavLink`/`ThemeToggle`/`Sidebar`'s existing precedent.

**Chosen Approach:** (b).

**Rationale:** a CSS-only disclosure pattern is achievable but sacrifices real keyboard/focus/ARIA-state management (§8, §17) that this task's own accessibility requirements need — this codebase has already established, three times over, that a small `"use client"` island with a concrete interaction justification is the correct trade here, not an anti-pattern to avoid at all costs.

**Trade-offs:** one more client boundary than the homepage has today.

**Consequences:** none beyond the ordinary — this matches Principle 5's own test exactly ("why is client rendering required? can the boundary be made smaller?" — yes, scoped to the trigger/panel only, not the whole `Header`).

### D4 — Engineering Log and About Get Contracts, Not Routes

**Context:** `PRIMARY_NAVIGATION` already points at both; neither exists.

**Options Considered:** (a) build minimal stub pages now so no link 404s; (b) define the integration contract precisely and leave both routes unbuilt.

**Chosen Approach:** (b).

**Rationale:** the task's own Critical Rules explicitly forbid building either route in this pass. A stub page would also be exactly the "fabricate content to fill a section" failure mode `docs/26`/`docs/31` and this document's own §20 reject — a placeholder About or Engineering Log page would misrepresent the workspace's actual state more than a currently-non-resolving link does.

**Trade-offs:** two of four primary navigation items 404 until their own tasks ship — an explicitly accepted, temporary state, not a defect this task should paper over.

**Consequences:** the eventual Task 6.x that builds each route inherits a precise, already-reviewed contract (§12, §13) rather than having to reverse-engineer intent from a stub.

### D5 — Search Stays Out of Task 6.1 Entirely

See §22 in full; recorded here as a decision because it resolves a genuine roadmap ambiguity, not because it required weighing implementation alternatives.

---

## 24. Implementation Scope

### Must implement

- `app/page.tsx`: replace `PLACEHOLDER_KNOWLEDGE`/`PLACEHOLDER_WORK`/`PLACEHOLDER_LOG` imports with real resolver calls (`getFeaturedCaseStudies()`, a new small Knowledge selector, `getAllEngineeringLogEntries()`).
- `app/page.tsx`: add `export const metadata`.
- One new, small Knowledge selector function (§15), placed in the resolver layer, not the page.
- `EngineeringLog`: verify/add empty-state (`null`-when-empty) behavior against real (currently zero) data.
- A mobile navigation trigger + panel in `Header`, reusing `PrimaryNavigation`/`NavLink` and `PRIMARY_NAVIGATION` unchanged.

### May implement if already supported by existing infrastructure

- Nothing further — every other piece of this proposal (Featured Work sourcing, Engineering Log contract, About boundary, footer, responsive behavior) is either already correctly implemented or explicitly deferred; there is no "implement only if convenient" middle tier here.

### Explicitly deferred

- `/engineering-log` route and reading experience (later Task 6.x).
- `/about` route (later Task 6.x).
- Any Search implementation, however minimal (later Task 6.x).
- `/work`'s and `/knowledge`'s own migration off placeholder data (their own future tasks, D2).
- `Sidebar`'s wiring to real Work/Knowledge content (§21, not this task's).
- Canonical URLs, Open Graph, structured data, sitemap.xml, robots.txt, RSS (Milestone 6's later deliverables / Milestone 8).

---

## 25. Verification Plan

### Functional

- Homepage renders with real Knowledge and Work data (verified against actual `content/knowledge/` and Work collection state, not fixtures).
- Every primary navigation link resolves except `/engineering-log` and `/about` (expected, per D4) — both should be verified to fail *only* as an unbuilt-route 404, not a broken link from a typo or misconfigured `href`.
- Knowledge Preview resolves to real articles.
- Work Preview resolves to the same Featured set `/work` itself shows.
- Engineering Log Preview renders nothing today (verified against the real, empty collection) and is verified to render real entries once a temporary realistic fixture is added and then removed, per this workspace's established verification practice.
- About link resolves once `/about` exists (deferred verification, not this task's).
- No duplicate content source exists — confirmed by inspecting that `app/page.tsx` imports resolver functions, not `placeholder-*` constants, for every dynamic section.

### Responsive

Desktop, tablet, mobile — explicit focus on the new mobile navigation actually reaching all four destinations, and no horizontal overflow anywhere on the homepage.

### Accessibility

Heading hierarchy, keyboard navigation (including the new mobile trigger/panel), focus states, semantic landmarks, reduced motion on any new transition.

### Technical

`pnpm exec eslint`, `pnpm exec tsc --noEmit`, a production build, confirmation of static generation where applicable, no console errors.

### Regression

- Knowledge (`/knowledge`, `/knowledge/[slug]`) remains unchanged and unbroken.
- Work (`/work`, `/work/library`, `/work/[slug]`) remains unchanged and unbroken.
- Every existing route continues to resolve exactly as it did before this task.
- Existing navigation (desktop primary nav, footer) remains valid and unchanged in behavior.

---

## 26. Acceptance Criteria

- Homepage responsibilities are clearly defined (§1, §6). ✅ (this document)
- Homepage information architecture is documented (§6). ✅
- Existing Knowledge infrastructure is reused, not duplicated (§9, §11, §15). ✅
- Existing Work infrastructure is reused, not duplicated (§9, §10, §15). ✅
- Engineering Log integration boundary is defined (§12). ✅
- About integration boundary is defined (§13). ✅
- Primary navigation is defined, including the one genuine current gap (§8). ✅
- Search/Discovery boundary is explicitly resolved (§22). ✅
- No duplicate content source is introduced (§9, D1). ✅
- Server-first architecture is preserved, with one explicitly justified exception (§18, D3). ✅
- Responsive requirements are documented (§16). ✅
- Accessibility requirements are documented (§17). ✅
- Performance expectations are documented (§18). ✅
- Empty states are documented (§20). ✅
- Verification criteria are documented (§25). ✅
- Implementation scope is bounded (§24). ✅
- No production code was modified by this task. ✅ (confirmed — see report)

---

## 27. Open Questions

**Q1 — What should the new Knowledge selector's exact curation policy be (recency vs. an editorial `featured` flag)?**
*Why it matters:* Knowledge articles already carry a `featured: boolean` field (`articleFrontmatterSchema`) that nothing currently reads for selection purposes — the same field Work's `featured` already drives real curation with. *What decision is blocked:* whether the homepage's Knowledge Preview is "recently published" (mechanical, always fresh) or "editorially featured" (curated, matching Work's own model exactly). *Evidence needed:* a decision from whoever owns editorial judgment for this workspace — this is a content-strategy choice, not something inferable from the repository alone.

**Q2 — Should `content/pages/` be registered as a real collection now, in anticipation of About, or left exactly as it is until the About task needs it?**
*Why it matters:* the directory exists, unused, and its exact intended shape (a generic "pages" collection vs. an About-specific one) isn't documented anywhere found in this repository. *What decision is blocked:* nothing in Task 6.1 — this is flagged for whichever task eventually builds `/about`, so it doesn't have to rediscover this gap independently. *Evidence needed:* whether About's content should be MDX-authored (matching Knowledge/Work) or remain plain TSX/copy-constant-driven (matching the homepage's own current sections) — a decision for that task, not this one.

**Q3 — Should the mobile navigation panel also include the header's Search/RSS/GitHub/theme-toggle cluster, or only the four primary destinations?**
*Why it matters:* affects the panel's exact scope and the trigger's placement relative to the existing icon cluster. *What decision is blocked:* the implementation task's exact panel design (still no production code implied by answering this — the contract in §8 holds either way). *Evidence needed:* a design decision, not a repository fact — reasonable defaults exist (GitHub and theme-toggle are low-value to duplicate since they're small icon buttons already visible at every breakpoint in `Header`'s existing layout; Search is disabled everywhere regardless) but this document does not mandate one.

---

## 28. Final Recommendation

**Recommended architecture:** treat the homepage as a thin, server-rendered integration layer over the Knowledge and Work resolver functions that already exist and already work — no new content collection, no new relationship model, one new small Knowledge selector, and one new, narrowly-scoped client component for mobile navigation. Every other piece of this proposal is either already correctly implemented (§2, §6, §13) or explicitly, honestly deferred (§12, §20, §24).

**Recommended implementation sequence**, once this document is approved:

1. Add the homepage's `export const metadata` (trivial, zero-risk, unblocks nothing else but should not wait).
2. Add the new Knowledge selector function and wire `EngineeringNotebook` to it.
3. Wire `EngineeringCaseStudies` to `getFeaturedCaseStudies()` directly.
4. Wire `EngineeringLog` to `getAllEngineeringLogEntries()` and verify/build its empty-state behavior.
5. Build the mobile navigation trigger + panel, reusing `PrimaryNavigation`/`PRIMARY_NAVIGATION` unchanged.
6. Run the full verification plan (§25).

**Known risks:**
- The mobile navigation gap (§8) is real and currently shipped — until it's fixed, this remains a genuine accessibility/usability regression on every route, not just the homepage, since `Header` is global. This proposal recommends fixing it as part of Task 6.1 specifically because it's surfaced by this task's own "coherent primary navigation" objective, not because it's homepage-specific in cause.
- `/engineering-log` and `/about` will continue to 404 from primary navigation and the footer until their own tasks ship (D4) — an accepted, temporary, and now explicitly documented state rather than a silent gap.
- If Q1 (§27) isn't resolved before implementation begins, the Knowledge selector risks being built with an arbitrary default that later needs revisiting — worth resolving before, not during, implementation.

**This document authorizes no implementation.** Task 6.1's actual build — the homepage's resolver wiring, the new selector function, and the mobile navigation component — requires its own review and approval following the same Documentation → Architecture Review → Implementation Plan → Implementation → Verification → Approval workflow every prior milestone in this repository has used, per `docs/24-ENGINEERING_PRINCIPLES.md` Principle 1 and `docs/28-WORK_IMPLEMENTATION_PLAN.md`'s own Review Workflow.
