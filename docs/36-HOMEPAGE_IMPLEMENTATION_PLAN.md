# 36 — Homepage Implementation Plan

## Status

Implementation Plan — translating the approved `docs/35-HOMEPAGE_INTEGRATION.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/35-HOMEPAGE_INTEGRATION.md` establishes *what* Task 6.1 should do and *why*. This document establishes *exactly what changes, file by file*, so that a future implementation pass can execute it without re-deriving design decisions or re-inspecting the repository from scratch. Every work item below traces back to a specific section of `docs/35`; nothing here introduces a decision `docs/35` didn't already make.

Where this document specifies a function signature, file path, or prop contract, it does so because the repository was re-inspected to confirm the exact current shape being changed — not assumed. Where a genuine implementation-level choice remains open (e.g. exact copy text), it's flagged as such rather than silently decided.

---

## 2. Authoritative Inputs & Constraints

`docs/35-HOMEPAGE_INTEGRATION.md` is the architecture authority. `docs/24-ENGINEERING_PRINCIPLES.md` governs how it's implemented. The following decisions are carried forward **unchanged** — this document does not revisit, reinterpret, or expand any of them.

- **D1 — Homepage is an integration layer.** No homepage-specific Knowledge or Work dataset. Every dynamic section is wired to an existing (or minimally extended) resolver, never a new collection.
- **D2 — `/work` and `/knowledge` are not migrated in this task.** `lib/content/work.ts` keeps reading `PLACEHOLDER_WORK` internally; `/knowledge`'s own placeholder-fed sections are untouched. Task 6.1 only changes what `app/page.tsx` calls, never what `getFeaturedCaseStudies()` (or `/knowledge`'s own page) does internally.
- **D3 — Server-first; one new client boundary.** The only new `"use client"` surface anywhere in this plan is the mobile navigation trigger/panel (WI-6). Nothing else changes rendering strategy.
- **D4 — Engineering Log and About are contracts, not routes.** No `/engineering-log`, `/engineering-log/[slug]`, or `/about` file is created. The homepage's Engineering Log Preview wiring (WI-5) points at a route that will 404 until its own task ships — this is the accepted, documented state, not a defect to route around.
- **D5 — Search stays out.** No `/search` route, no search logic, no change to `Header`'s existing disabled Search icon.

**Knowledge selection algorithm (approved, verbatim):**

1. Select articles with `featured === true`.
2. Order featured articles by `publishedAt` descending.
3. Take the configured homepage limit.
4. If fewer than the limit are featured, fill remaining slots with the newest non-featured articles.
5. Do not duplicate featured entries during the fallback fill.
6. Keep the selector reusable by future Knowledge surfaces (not homepage-only in name or shape).

This algorithm is implemented exactly as WI-2 below.

---

## 3. Current → Target Data Flow

```
                        BEFORE (today)                          AFTER (Task 6.1)

Knowledge Preview   PLACEHOLDER_KNOWLEDGE (3 fixture entries)  getFeaturedArticles() → real articles
                    imported directly into page.tsx             (featured-first, recency fallback)

Featured Work       PLACEHOLDER_WORK (same fixture              getFeaturedCaseStudies() (already exists,
                    /work already reads)                        already the correct call — page.tsx just
                                                                  stops importing the fixture directly)

Engineering Log     PLACEHOLDER_LOG (3 fixture entries,         getAllEngineeringLogEntries() (already
                    routes that don't resolve)                  exists; returns [] today — honest)

Homepage metadata   none (inherits root layout's generic         export const metadata (page-specific)
                    fallback)

Mobile navigation   none — PrimaryNavigation is                  a trigger (visible below `lg`) revealing
                    `hidden lg:block`, no alternate               PRIMARY_NAVIGATION in an accessible
                    rendering exists below `lg`                  disclosure
```

Every arrow on the right reuses an existing resolver except the Knowledge selector (new, WI-2) and the mobile-nav component (new, WI-6) — matching `docs/35` §15's own "smallest architectural extension" scoping exactly.

---

## 4. Work Items

### WI-1 — Homepage Metadata

**Traces to:** `docs/35` §19, §24 "Must implement."

**File:** `src/app/page.tsx`

**Current state:** no `export const metadata`. The page inherits `src/app/layout.tsx`'s generic fallback: `title: "Engineering Portfolio"`, `description: "Engineering Portfolio project foundation."`

**Target state:** `app/page.tsx` exports its own `Metadata` object, following the exact pattern `app/work/page.tsx` and `app/knowledge/page.tsx` already use:

```ts
export const metadata: Metadata = {
  title: "...",       // should incorporate SITE_NAME (lib/constants/site.ts), not restate the generic fallback
  description: "...", // a real description of the workspace, distinct from the root layout's placeholder text
};
```

**Explicit non-goal (per `docs/35` §19):** no canonical URL, no Open Graph fields, no structured data — `lib/constants/site.ts` has no `SITE_URL` today, and introducing one for this page alone would be exactly the one-off infrastructure `docs/35` rejects. Title/description only.

**Open implementation-level choice:** exact copy. Not decided here — a content decision for whoever implements this, consistent with `SITE_NAME` and the tone `docs/13-HOMEPAGE_EXPERIENCE.md` establishes (documentation-first, not marketing).

**Acceptance criteria:** `/` has its own, non-generic `<title>` and meta description in rendered HTML; root layout's fallback values no longer appear on `/`.

---

### WI-2 — Knowledge Selector: `getFeaturedArticles()`

**Traces to:** `docs/35` §11, §15, §27 Q1 (now resolved by the approved algorithm in §2 above).

**File:** `src/lib/content/articles.ts` (extended, not a new file — see rationale below).

**Why this file, not a new one:** `docs/35` §15 left the exact placement open between "`lib/content/articles.ts` itself, or a new file mirroring `lib/content/work.ts`'s role." Work's split (`work.ts` vs. `case-studies.ts`) exists specifically because Work has two data maturities — a placeholder-backed landing/library resolver and a real-content document resolver — that need to stay separable until `lib/content/work.ts` migrates (D2). Knowledge has no such duality: `articles.ts` already reads the one real collection, and `getFeaturedArticles()` reads that same collection. Adding it to `articles.ts` extends the existing resolver rather than introducing a second file with no structural reason to exist — `docs/24` Principle 2 ("extend existing architecture") applied directly, and the more restrained of the two options `docs/35` left open.

**Signature:**

```ts
export interface FeaturedArticlesOptions {
  /** Articles to select from. Defaults to a fresh getAllArticles() read. */
  articles?: ContentItem<KnowledgeFrontmatter>[];
  /** Maximum number of articles returned. */
  limit?: number;
}

export function getFeaturedArticles(
  options: FeaturedArticlesOptions = {},
): ContentItem<KnowledgeFrontmatter>[]
```

An options-object shape (not `articles.ts`'s usual positional-args-with-defaults convention, e.g. `resolvePrerequisites(article, articles, limit)`) is used deliberately here because, unlike every existing resolver in this file, `getFeaturedArticles()` has no "subject article" as its first, defining argument — it's a collection-level query, not a per-document relationship resolution. The approved direction (`getFeaturedArticles({ limit: 3 })`) already reflects this distinction; this plan keeps it rather than forcing positional args to match a pattern that doesn't fit this function's actual shape.

**Algorithm (implements §2's approved steps exactly):**

1. `const featured = articles.filter(a => a.frontmatter.featured)`
2. `const featuredSorted = sortByPublishedDate(featured)` — reuse the existing, already-generic `sortByPublishedDate<Frontmatter>()` from `lib/content/loader.ts` (confirmed present, collection-agnostic, non-mutating). Do not write a new comparator.
3. `const selected = featuredSorted.slice(0, limit)`
4. If `selected.length < limit`: compute `const selectedSlugs = new Set(selected.map(a => a.slug))`, then `const nonFeaturedSorted = sortByPublishedDate(articles.filter(a => !selectedSlugs.has(a.slug)))`, and append `nonFeaturedSorted.slice(0, limit - selected.length)`.
5. Return the concatenation, length ≤ `limit`.

**Dedup guarantee:** step 4's `selectedSlugs` exclusion is what step 5 of the approved algorithm ("do not duplicate featured entries during fallback") requires — an article already selected in step 1–3 can never reappear from the fallback pool, by construction, not by a secondary check.

**Reusability requirement (approved algorithm's own point 6):** the function reads `getAllArticles()` by default but accepts an already-fetched list — the same "optional-with-a-default" shape every other resolver in this file already uses (e.g. `resolvePrerequisites`) — so a future `/knowledge` migration (D2, out of this task's scope) can call `getFeaturedArticles({ articles: allArticles, limit: N })` against an already-fetched collection instead of triggering a second disk read, without this function's signature changing.

**Explicit non-goal:** this function does not read or write `draft` filtering itself — `getAllArticles()` already returns draft-filtered content (via `filterDrafts()`), so `getFeaturedArticles()` inherits that guarantee for free rather than re-implementing it.

**Acceptance criteria:** returns an array whose length never exceeds `limit`; contains no duplicate slugs; every featured, non-draft article appears before any non-featured one; ties (identical `publishedAt`, or missing `publishedAt`) resolve exactly however `sortByPublishedDate` already resolves them today (relative order preserved, undated items sort last) — no new tie-breaking logic introduced.

---

### WI-3 — Knowledge Preview Wiring (`EngineeringNotebook`)

**Traces to:** `docs/35` §6 (Knowledge Preview), §9, §11.

**Files:** `src/app/page.tsx` (caller change), a new small mapping step (location specified below) — `src/components/home/engineering-notebook.tsx` itself is **not modified**.

**The shape mismatch that must be bridged:** `EngineeringNotebook` expects `articles: NotebookArticle[]`, where

```ts
export interface NotebookArticle {
  title: string;
  summary: string;
  topic: string;
  readingTime: string;
  publishedAt: string;
  href: string;
}
```

(`src/lib/constants/placeholder-knowledge.ts`). `getFeaturedArticles()` (WI-2) returns `ContentItem<KnowledgeFrontmatter>[]` — a structurally different shape (`frontmatter.title`, `frontmatter.description` not `summary`, `readingTime: ReadingTimeResult` not a string, `frontmatter.publishedAt: Date` not a formatted string, no `href`). **A mapping function is required**; this is not optional wiring, and skipping it was the one place a naive "just swap the import" approach would fail to type-check.

**Precedent to reuse, not reinvent:** `lib/content/relationships.ts`'s `toSummary()` and `lib/content/case-study-relationships.ts`'s `toCaseStudySummary()`/`toEngineeringLogSummary()` already perform the identical kind of `ContentItem<X> → flat display shape` mapping, using `formatDate()` (`lib/utils/format-date.ts`, confirmed signature `formatDate(date: Date): string`, produces e.g. `"Aug 2026"`) and `.readingTime.text`. The new mapping function for this work item should follow that exact idiom:

```ts
function toNotebookArticle(item: ContentItem<KnowledgeFrontmatter>): NotebookArticle {
  return {
    title: item.frontmatter.title,
    summary: item.frontmatter.description,
    topic: item.frontmatter.topic,       // see topic-label note below
    readingTime: item.readingTime.text,
    publishedAt: formatDate(item.frontmatter.publishedAt),
    href: `/knowledge/${item.slug}`,
  };
}
```

**Topic display note (a real, scoped finding, not an open question blocking this work item):** the only existing topic-slug → display-label lookup (`findTopic()`) is a **private, unexported function local to `app/knowledge/[slug]/page.tsx`** — it is not a shared utility today. Exporting/sharing it would be its own small architectural decision outside what `docs/35` scoped for this task. **Recommendation: use the raw `TopicSlug` value** (e.g. `"system-design"`) as `NotebookArticle.topic` for this work item — the same "raw slug, no prettifying layer" treatment `domain`/`status` already receive elsewhere in Work's own listings. Formalizing a shared topic-label utility is deferred to whichever task migrates `/knowledge`'s own sections (D2) — it will need the identical lookup and can decide then whether to promote `findTopic()` into a shared export.

**Where the mapping function lives:** co-located in `src/app/page.tsx` as a small, page-local helper (matching the file's existing style — `page.tsx` already contains no logic beyond composition today, so a single small mapping function stays consistent with that, rather than adding a third file for one six-field transform). If a future task finds this mapping needed elsewhere, promoting it to `lib/content/articles.ts` alongside `getFeaturedArticles()` is a trivial, low-risk move at that point — not pre-built here on spec.

**Target `page.tsx` composition:**

```ts
const featuredArticles = getFeaturedArticles({ limit: HOMEPAGE_KNOWLEDGE_LIMIT });
// ...
<EngineeringNotebook articles={featuredArticles.map(toNotebookArticle)} />
```

**Acceptance criteria:** `EngineeringNotebook`'s own file is untouched (0 diff); the homepage's Knowledge Preview shows real articles' real titles/descriptions/reading times/dates; every card's `href` resolves to a real `/knowledge/[slug]` route.

---

### WI-4 — Featured Work Wiring (`EngineeringCaseStudies`)

**Traces to:** `docs/35` §6 (Featured Engineering Work), §10.

**File:** `src/app/page.tsx` only.

**No shape mismatch, no adapter needed:** `EngineeringCaseStudies` already expects `caseStudies: CaseStudyEntry[]` — the *exact* type `getFeaturedCaseStudies()` (`lib/content/work.ts`, unmodified by this task per D2) already returns. This is the simplest work item in this plan: replace

```ts
import { PLACEHOLDER_WORK } from "@/lib/constants/placeholder-work";
// ...
<EngineeringCaseStudies caseStudies={PLACEHOLDER_WORK} />
```

with

```ts
import { getFeaturedCaseStudies } from "@/lib/content/work";
// ...
<EngineeringCaseStudies caseStudies={getFeaturedCaseStudies()} />
```

**Acceptance criteria:** `EngineeringCaseStudies`'s own file is untouched (0 diff); `lib/content/work.ts` is untouched (0 diff, per D2); the homepage's Featured Work section shows exactly the same entries, in the same order, `/work`'s own Featured Case Studies section shows (verifiable by comparing rendered output on `/` against `/work` for the current fixture-backed set — VaultPay and GoHunt, per `placeholder-work.ts`'s current `featured: true` entries).

---

### WI-5 — Engineering Log Preview Wiring (`EngineeringLog`) + Empty State

**Traces to:** `docs/35` §6 (Engineering Log Preview), §12, §14, §20.

**Files:** `src/app/page.tsx` (caller change + mapping, same idiom as WI-3); `src/components/home/engineering-log.tsx` (verify/add empty-state handling — the one home component this plan touches).

**Shape mismatch:** `EngineeringLog` expects `entries: EngineeringLogEntry[]`, where

```ts
export interface EngineeringLogEntry {
  date: string;
  title: string;
  summary?: string;
  href: string;
}
```

`getAllEngineeringLogEntries()` returns `ContentItem<ArticleFrontmatter>[]`. Mapping precedent: `case-study-relationships.ts`'s `toEngineeringLogSummary()` already performs this *exact* transform (`ContentItem<ArticleFrontmatter> → { title, href: `/engineering-log/${slug}`, publishedAt: formatDate(...) }`) for Work's own Related Engineering Logs section. The homepage's mapping function should mirror it precisely:

```ts
function toEngineeringLogEntry(item: ContentItem<ArticleFrontmatter>): EngineeringLogEntry {
  return {
    date: formatDate(item.frontmatter.publishedAt),
    title: item.frontmatter.title,
    href: `/engineering-log/${item.slug}`,
    // summary intentionally omitted — see placeholder-log.ts's own documented
    // restraint: "summary exists on the type but is intentionally never
    // rendered by the homepage preview... showing less, not more." Carried
    // forward unchanged.
  };
}
```

**Ordering:** newest first — reuse `sortByPublishedDate()` (`lib/content/loader.ts`, same primitive WI-2 uses) rather than writing a second date-sort. No new sort logic anywhere in this task.

**Empty-state verification/fix (`docs/35` §12, §20):** `content/engineering-log/` has zero real entries today, so `getAllEngineeringLogEntries()` returns `[]`. Inspect `EngineeringLog`'s current render body: if it already has an `if (entries.length === 0) return null` (or equivalent) guard, no change is needed. If it does not — because it has only ever been fed `PLACEHOLDER_LOG`, which is never empty, this exact path may never have been exercised — add the same `null`-when-empty guard `RelatedKnowledge`/`RelatedEngineeringLogs` (Work, Task 5.3/5.7) already establish as this codebase's standard "don't render an empty heading over nothing" pattern. This is the one place this plan touches an existing home component's own file, and the change is scoped to exactly one conditional return, not a rewrite.

**Target `page.tsx` composition:**

```ts
const logEntries = getAllEngineeringLogEntries(); // real loader, returns [] today
// ...
<EngineeringLog entries={sortByPublishedDate(logEntries).map(toEngineeringLogEntry)} />
```

**Acceptance criteria:** with the real (empty) collection, the Engineering Log Preview section renders no visible output and no empty heading — verified by inspecting rendered HTML for the section's absence, not just visually. `href`s point at `/engineering-log/[slug]` (correctly not-yet-resolving per D4 — this is expected and correct, not a bug this work item fixes). A temporary, realistic verification fixture (one `.mdx` file matching `engineering-log`'s registered schema) may be used to confirm the *populated* rendering path during verification and must be fully removed afterward, per this workspace's established verification practice (`docs/28`, prior Work-milestone review reports) — this fixture is a verification step, not a checked-in change.

---

### WI-6 — Mobile Navigation

**Traces to:** `docs/35` §8, §14, §17, D3.

**Files (new):** one new client component, e.g. `src/components/navigation/mobile-navigation.tsx` (exact filename an implementation-level choice; this plan fixes its responsibility and boundary, not its file name). **Files (modified):** `src/components/navigation/header.tsx` (render the new trigger, positioned per §8's own placement guidance — visible only below `lg`, alongside the existing Search/RSS/GitHub/theme-toggle cluster).

**Responsibility boundary (exactly `docs/35` §8, restated precisely for implementation):**

- Reads `PRIMARY_NAVIGATION` from `lib/navigation/config.ts` — the same array `PrimaryNavigation`/`Footer` already read. **No second navigation list.**
- Renders the same four items via `NavLink` (`components/navigation/nav-link.tsx`) — reused as-is, not reimplemented, so active-state (`aria-current="page"`) behaves identically to desktop.
- Is the **only** new `"use client"` boundary in this entire plan (D3). Its own internal open/closed state (a `useState` or equivalent) is the concrete browser-interaction justification — a disclosure that cannot be server-rendered.
- Trigger: a real `<button>`, `aria-label="Open navigation"` (or equivalent, matching the precision of `Header`'s existing `aria-label="Search (coming soon)"`), `aria-expanded` reflecting open/closed state.
- Panel: labeled `<nav>` internally (reusing `PrimaryNavigation`'s own `aria-label="Primary"` rather than inventing a second landmark label for the identical list — `docs/35` §17's explicit requirement).
- Keyboard: `Escape` closes it; focus moves into the panel on open and returns to the trigger on close (standard disclosure pattern, no new pattern invented).
- Motion: any open/close transition wrapped in `motion-safe:`, matching the codebase's existing, universal convention.
- Visible only below `lg` (`lg:hidden` on the trigger, mirroring `PrimaryNavigation`'s own `hidden lg:block` inverted) — desktop rendering is completely unaffected.

**Panel scope — resolved, not an implementation-time decision.** The mobile panel contains **only** the four `PRIMARY_NAVIGATION` destinations — Knowledge, Work, Engineering Log, About — rendered via `NavLink`, exactly as `PrimaryNavigation` already renders them on desktop. This closes `docs/35` §27 Q3; that question is no longer open.

The panel **must not** contain Search, RSS, GitHub, LinkedIn, email, or the theme toggle. Those remain exactly where they are today — in `Header`'s existing icon cluster, already visible at every breakpoint (that cluster is not inside the `hidden lg:block` scoping that hides `PrimaryNavigation`, so it needs no mobile treatment at all). The mobile panel's entire responsibility is the one gap `docs/35` §8 identified: making the four primary destinations reachable below `lg`. Nothing else belongs in it — pulling utility icons into the panel as well would duplicate controls that already work correctly at every viewport, and would blur the panel's purpose from "primary navigation" into a second, general-purpose utility drawer.

**Acceptance criteria:** every one of the four `PRIMARY_NAVIGATION` destinations is reachable via keyboard and pointer at a sub-`lg` viewport without scrolling to the footer; the panel renders exactly four links and nothing else — no Search, RSS, GitHub, LinkedIn, email, or theme-toggle control anywhere inside it; desktop rendering (`lg` and above) has zero visual or behavioral change; `Header`'s own file otherwise remains structurally the same (one new rendered child, not a restructure).

---

### WI-7 — Task 6.1 Release Candidate Review

**Traces to:** `docs/35` §25, and this repository's established milestone review workflow (`docs/24-ENGINEERING_PRINCIPLES.md` Principle 1; the Task 5.7 report series' Review → Approved/Refinements Required pattern).

**When it runs:** only after WI-1 through WI-6 are complete. This is the release gate for Task 6.1 as a whole, not a work item that produces its own source changes — its only output is a review report (following the same format the Task 5.7 report series already established) plus, if needed, a list of refinements to route back through WI-1–WI-6 before re-review. **No file in this work item's own scope is a production file.**

**Verification steps (all required, none optional):**

1. **Complete functional verification** — every acceptance criterion listed under WI-1 through WI-6 individually, re-checked together against the same running instance, not re-derived from memory of each work item's own testing.
2. **Mobile navigation, keyboard-only** — no mouse/pointer: reach the trigger via `Tab`, open it, confirm focus moves into the panel, `Tab` through all four destinations, confirm `Escape` closes it and returns focus to the trigger. This must be performed as an actual keyboard-only pass, not inferred from the markup.
3. **Desktop navigation unchanged** — `lg` and above renders and behaves identically to the pre-Task-6.1 baseline; the new mobile trigger must not appear, and no spacing/layout shift in `Header` is introduced at desktop widths.
4. **Homepage dynamic sections verified against their actual data sources** — Knowledge Preview cards correspond to real `content/knowledge/` articles selected by the WI-2 algorithm (featured-first, recency fallback, no duplicates); Featured Work cards correspond exactly to `getFeaturedCaseStudies()`'s current output; both checked against the live collections, not against this document's predictions.
5. **Empty Engineering Log behavior verified** — with the real, empty `content/engineering-log/` collection, confirm the Engineering Log Preview section is absent from rendered output (no empty heading, no placeholder text); confirm the populated path separately via a temporary fixture (WI-5), then confirm the fixture was fully removed and `git status` is clean of it.
6. **No homepage placeholder imports remain** — grep `src/app/page.tsx` for `PLACEHOLDER_KNOWLEDGE`, `PLACEHOLDER_WORK`, `PLACEHOLDER_LOG`; none should appear. `PLACEHOLDER_KNOWLEDGE`, `PLACEHOLDER_WORK`, and `PLACEHOLDER_LOG` (the constant files themselves) may still exist on disk — deleting them is not in scope — but nothing in `page.tsx` should reference them any longer.
7. **No guardrail crossed** — walk §7's list item by item against the actual diff: confirm `lib/content/work.ts`, `app/knowledge/page.tsx`, `app/work/page.tsx`, `app/work/library/page.tsx`, and `lib/navigation/sidebar-config.ts` each show zero changes; confirm no `/about`, `/engineering-log`, `/engineering-log/[slug]`, or `/search` route file was created; confirm `PRIMARY_NAVIGATION` was not duplicated; confirm no `"use client"` boundary exists outside WI-6's own component; confirm no `SITE_URL`/canonical/Open Graph/structured-data code was added.
8. **Run the automated checks:**
   - `pnpm exec eslint`
   - `pnpm exec tsc --noEmit`
   - `pnpm build`

   All three must complete cleanly — zero errors, zero warnings introduced by this task's changes.
9. **Check `git diff` against the expected file manifest (§5)** — the actual set of changed files must match §5 exactly (same files, no extras); any discrepancy must be explained, not silently accepted.
10. **Check for console errors** — `/` loaded fresh, in both light and dark mode, at desktop and mobile widths, with the mobile panel opened and closed at least once; zero console errors or warnings.
11. **Responsive verification** — desktop, tablet, and mobile viewports; confirm no horizontal overflow anywhere on `/`; confirm the dynamic sections' card/row layouts degrade the same way `/work`'s and `/knowledge`'s equivalent sections already do (§16 of `docs/35`).
12. **Accessibility verification** — heading hierarchy unchanged, landmarks correct (including the mobile panel reusing `PrimaryNavigation`'s existing `aria-label="Primary"` rather than a second, differently-labeled nav), visible focus on every interactive element touched by this task, reduced-motion respected on the panel's open/close transition.

**Release recommendation:** WI-7 concludes with exactly one of:

- **Approved** — every verification step above passed; Task 6.1 is complete and ready for merge.
- **Refinements Required** — one or more steps failed; the specific failing step(s), the specific work item(s) responsible, and the specific fix required are listed explicitly, and the fix is routed back through the relevant WI-1–WI-6 item before WI-7 is re-run in full (not spot-checked only on the changed area — a full re-run, since a fix to one work item can regress another, e.g. a metadata change touching the same file a data-wiring change touches).

**Acceptance criteria (for WI-7 itself):** a written report exists covering all twelve verification steps above with pass/fail status for each, and states one of the two release recommendations explicitly — an implicit or assumed "looks fine" is not sufficient to close Task 6.1.

---

## 5. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/app/page.tsx` | Modified — replace `PLACEHOLDER_*` imports with resolver calls; add local mapping helpers; add `export const metadata` | WI-1, WI-3, WI-4, WI-5 |
| `src/lib/content/articles.ts` | Modified — add `getFeaturedArticles()` + `FeaturedArticlesOptions` | WI-2 |
| `src/components/home/engineering-log.tsx` | Modified — verify/add empty-state guard | WI-5 |
| `src/components/navigation/mobile-navigation.tsx` (or equivalent name) | **New** | WI-6 |
| `src/components/navigation/header.tsx` | Modified — render the new trigger below `lg` | WI-6 |
| *(none — review only)* | WI-7 produces a review report, not a source-file diff | WI-7 |

**Not touched by this plan, anywhere:** `engineering-notebook.tsx`, `engineering-case-studies.tsx`, `readme-hero.tsx`, `current-focus.tsx`, `how-i-think.tsx`, `beyond-the-code.tsx`, `workspace-snapshot.tsx`, `footer.tsx`, `primary-navigation.tsx`, `nav-link.tsx`, `sidebar.tsx`, `sidebar-config.ts`, `lib/content/work.ts`, `lib/content/case-studies.ts`, `lib/content/engineering-logs.ts`, `lib/content/loader.ts`, `lib/navigation/config.ts`, any file under `content/`, any file under `app/knowledge/` or `app/work/`.

---

## 6. Sequencing

1. **WI-1** (metadata) — zero dependencies, zero risk, can happen first or in any order.
2. **WI-2** (`getFeaturedArticles()`) — must precede WI-3, since WI-3 consumes it.
3. **WI-3** (Knowledge Preview wiring) — depends on WI-2.
4. **WI-4** (Featured Work wiring) — independent of WI-2/WI-3, can happen in parallel.
5. **WI-5** (Engineering Log wiring + empty state) — independent of the above, can happen in parallel.
6. **WI-6** (mobile navigation) — independent of all content-wiring work items; the only one touching `components/navigation/`.
7. **WI-7** (release candidate review) — strictly last. Depends on WI-1 through WI-6 all being complete; not a parallelizable step, and not partially runnable against an incomplete set of work items.

No work item blocks another except the stated WI-2 → WI-3 dependency and WI-7's own dependency on everything preceding it. This ordering minimizes the window in which `page.tsx` is mid-migration (partially real, partially fixture-backed) by grouping the three data-source swaps close together, but nothing here requires a specific sequence beyond those two dependencies.

---

## 7. Explicit Guardrails — Do Not Touch

Restated precisely, because this list is this document's own scope boundary as much as its content is its scope:

- `lib/content/work.ts` — **zero changes**. Still reads `PLACEHOLDER_WORK` internally (D2). `getFeaturedCaseStudies()`'s signature and behavior are consumed, not modified.
- `app/knowledge/page.tsx`, `app/work/page.tsx`, `app/work/library/page.tsx` — **zero changes**. Their own placeholder-fed sections are untouched (D2).
- `lib/navigation/sidebar-config.ts` — **zero changes**. Its empty `items: []` arrays for Work/Knowledge are a real, separately-flagged gap (`docs/35` §21) not in this task's scope.
- No new content collection, no new `.mdx` file left behind in `content/` after implementation (verification fixtures, WI-5, are temporary and removed — `docs/35` §20, §25).
- No `/about`, `/engineering-log`, `/engineering-log/[slug]`, or `/search` route file created (D4, D5).
- No second navigation array — `PRIMARY_NAVIGATION` (`lib/navigation/config.ts`) is read, never duplicated, by WI-6.
- No new `"use client"` boundary outside WI-6 (D3).
- No canonical URL / Open Graph / structured-data infrastructure (WI-1's explicit non-goal).

---

## 8. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `getFeaturedArticles()`'s fallback-fill silently duplicates an entry if the dedup set is built incorrectly | Low | Acceptance criteria (WI-2) explicitly test for zero duplicate slugs across the combined result |
| `EngineeringLog`'s empty-state guard was assumed present but isn't, and ships silently broken (an empty heading over nothing) | Medium | WI-5 explicitly calls for *verifying*, not assuming, current behavior before deciding whether a change is needed |
| A mapping function (WI-3, WI-5) drifts from its precedent (`toSummary`/`toCaseStudySummary`/`toEngineeringLogSummary`) in a way that produces a subtly different citation format than the rest of the site | Low | Each mapping function's spec explicitly names the precedent to mirror, field by field |
| Mobile navigation panel introduces a focus trap bug or an unreachable close control | Medium | Acceptance criteria (WI-6) require explicit keyboard-only verification, not just visual/pointer verification |
| Homepage metadata copy reads as marketing language, inconsistent with `docs/13`'s documentation-first tone | Low | Flagged explicitly as an open content decision (WI-1), not silently defaulted |

---

## 9. Verification Plan

Inherits `docs/35` §25 in full; the additions below are specific to what this plan's work items introduce. This section states *what* must be verified; **WI-7 is where it actually gets executed and formally signed off**, as the release gate for the task as a whole — the categories below and WI-7's twelve numbered steps describe the same verification obligation at two levels of detail, not two separate verification passes.

**Functional**
- `/` renders with real Knowledge articles and the real Featured Work set — verified against actual `content/knowledge/` and the current `PLACEHOLDER_WORK`-backed Featured set (per D2, this is still the correct, current "real" answer).
- `getFeaturedArticles()` unit-verified against the algorithm in §2: featured-first, recency-ordered, deduplicated fallback, respects `limit`.
- Engineering Log Preview renders nothing against the real (empty) collection; renders correctly against a temporary realistic fixture; fixture fully removed afterward with `git status` confirmed clean.
- Every `PRIMARY_NAVIGATION` destination is reachable from the new mobile panel at a sub-`lg` viewport.

**Accessibility**
- Mobile trigger: keyboard-reachable, `aria-expanded` toggles correctly, `Escape` closes, focus moves in on open and returns to trigger on close.
- No duplicate `aria-label="Primary"` landmark — confirm the mobile panel reuses `PrimaryNavigation`'s existing nav, not a second one.

**Technical**
- `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
- No console errors on `/`, at every breakpoint, in both themes.

**Regression**
- `/work`, `/work/library`, `/work/[slug]`, `/knowledge`, `/knowledge/[slug]` render identically to their pre-Task-6.1 state (this plan touches none of their files).
- Desktop navigation and footer behavior unchanged.

---

## 10. Rollback Plan

Every work item is independently revertible: WI-1 (metadata) and WI-6 (mobile nav) are additive and isolated; WI-2/WI-3/WI-4/WI-5 each replace one `page.tsx` import + JSX prop with another, meaning reverting any single one is a matter of restoring that one section's fixture import without affecting the others. No work item requires a data migration, a schema change, or any step that isn't cleanly reversible by reverting its own file diff.

---

## 11. Acceptance Criteria (Plan-Level)

- Every work item in §4 traces to a specific section of `docs/35` — none introduces a new architectural decision.
- Every new function/component signature is fully specified (§4, §5) — an implementer should not need to make a structural decision this document left ambiguous, only the explicitly-flagged content/copy choices.
- Mobile navigation's scope is fully resolved (WI-6) — no open decision remains about what the panel contains.
- The guardrail list (§7) is exhaustive enough that an implementer has no reasonable path to accidentally expanding scope into `/work`, `/knowledge`, `/about`, `/engineering-log`, or Search.
- Task 6.1 is not considered complete until WI-7 concludes with an explicit **Approved** recommendation — **Refinements Required** routes back through the relevant work item(s), not a partial or conditional close.
- No production code, component, route, or content was modified to produce this document.

---

## 12. Final Report Requirements

This is WI-7's own deliverable (§4) — restated here as a standalone checklist so it isn't only findable inside the work-item list. Whichever task executes this plan produces, as WI-7's output, a closing report following this repository's established pattern (`docs/28`'s Review Workflow; the Task 5.7 report series), including at minimum:

1. Which work items (§4, WI-1–WI-6) were completed, and confirmation each matches its specified contract exactly (or a documented, explained deviation).
2. The file manifest (§5) as actually diffed, compared against this document's prediction.
3. Results for all twelve of WI-7's verification steps, individually — not summarized as a single pass/fail.
4. Confirmation that no guardrail (§7) was crossed.
5. The one remaining open content decision this plan leaves unresolved (WI-1's exact metadata copy) and how it was resolved — WI-6's panel scope is no longer open (resolved above) and should not reappear as a decision point in this report.
6. The final release recommendation — **Approved** or **Refinements Required** — per WI-7.

---

## Summary

This plan converts `docs/35-HOMEPAGE_INTEGRATION.md`'s architecture into seven work items: six implementable in any order permitted by §6's dependencies, and a seventh — WI-7, the release candidate review — that gates the task's completion and must run last, in full, against all six. Of the six implementation items, five are pure composition of already-existing, already-correct resolvers (`getFeaturedCaseStudies()`, `getAllEngineeringLogEntries()`, `sortByPublishedDate()`, `formatDate()`) and one is a small, precisely-scoped new selector (`getFeaturedArticles()`) that extends an existing file rather than introducing a new one. The only genuinely new component is the mobile navigation trigger/panel, its scope now fully resolved to the four `PRIMARY_NAVIGATION` destinations and nothing else, and its entire responsibility is reading the same array every other nav surface already reads. Nothing in this plan asks `/work`, `/knowledge`, `/about`, `/engineering-log`, or Search to change, exist, or be implemented — and Task 6.1 is not complete until WI-7 says so explicitly.
