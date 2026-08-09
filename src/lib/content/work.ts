/**
 * Work Resolver
 *
 * The resolution-layer seam Task 5.1's architecture review asked for:
 * `app/work/page.tsx` and `app/work/library/page.tsx` should receive
 * already-resolved data rather than filtering/importing fixtures
 * themselves. See docs/22-COMPONENT_ARCHITECTURE.md ("Resolution Layer" —
 * "Presentation components consume resolved data rather than interpreting
 * raw content... Resolve once, reuse everywhere").
 *
 * Today every function here reads `PLACEHOLDER_WORK` / `PLACEHOLDER_
 * ARCHITECTURE_HIGHLIGHTS` / `PLACEHOLDER_ENGINEERING_LESSONS` — there is no
 * real `content/work/` collection yet, even though `lib/content/
 * collections.ts` already registers one (`type: "case-study"`) and
 * `lib/content/loader.ts` already has a generic `getSlugs`/`getBySlug` that
 * collection can use once MDX case studies exist. That's the point of this
 * file's shape: once real entries exist, each function's *body* becomes a
 * `getSlugs("work")` + `getBySlug` call (or an equivalent frontmatter
 * query) — its signature, and every caller, stays unchanged.
 *
 * ## Content Layer Boundary (Task 5.2 review refinement #7)
 *
 * A standing expectation for everything under `app/work/`, documented here
 * because this file is that boundary:
 *
 *   content/work/  →  Resolvers (this file)  →  Pages
 *
 * Pages should never import a `placeholder-*` constant or a `content/work/`
 * MDX collection directly — they depend on this file, and only this file
 * depends on where the data actually lives today. This is what keeps the
 * eventual transition to a real Content Engine collection isolated to this
 * one file: every function below is free to swap its placeholder-reading
 * body for a `getSlugs`/`getBySlug`-reading one without either page, or any
 * component either page renders, changing at all.
 *
 * ## Convergence with the Case Study Experience (Task 5.3 review refinement #2)
 *
 * Task 5.3 introduced a second, sibling resolver — `lib/content/case-
 * studies.ts` — reading real `content/work/*.mdx` documents for
 * `app/work/[slug]/page.tsx`, while this file keeps reading `PLACEHOLDER_
 * WORK`/`PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS`/`PLACEHOLDER_ENGINEERING_
 * LESSONS` for the Landing and Library. Two files, two data maturities,
 * documented explicitly (not a duplicate dataset solving the same problem
 * twice): `getFeaturedCaseStudies()`/`getProjectLibrary()`/
 * `getEngineeringThemes()`/`getEngineeringLessons()` here describe the
 * curated *preview* the Landing and Library show today; `case-studies.ts`
 * resolves the *actual documents* those pages will eventually link into.
 * Neither file's data is copied into the other — the Landing/Library
 * currently link to case studies by a hardcoded `href`
 * (`placeholder-work.ts`'s `CaseStudyEntry.href`), not by querying
 * `case-studies.ts`, which is the one honest seam this split leaves open
 * until the migration below happens.
 *
 * The intended long-term architecture, once a real Content Engine replaces
 * both placeholder fixtures and today's split:
 *
 * ```
 * Work Content Source
 *         ↓
 *   Work Resolver
 *         ↓
 *   ├── /work
 *   ├── /work/library
 *   └── /work/[slug]
 * ```
 *
 * One resolver layer, reading one real content source, serving all three
 * pages — this file and `case-studies.ts` merging into that single
 * resolver is the natural endpoint, not a hypothetical one: every function
 * in both files already reads through a named, swappable seam rather than
 * a page reaching into raw data itself, which is what makes that eventual
 * merge a change confined to the resolver layer rather than a rewrite of
 * `app/work/page.tsx`, `app/work/library/page.tsx`, or `app/work/[slug]/
 * page.tsx`. Until the Content Engine migration happens, the current
 * split is intentional and should remain — not a gap to close early by
 * inventing a second, premature dataset to bridge it.
 *
 * `getProjectLibrary`'s default order (Task 5.2 review refinement #4,
 * docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md §3): "the default order should
 * communicate engineering significance, not implementation convenience."
 * Today that coincides with `PLACEHOLDER_WORK`'s own array order (a proxy —
 * recency/authoring order — used only because no richer signal exists yet).
 * Presentation components never reorder this array themselves; they render
 * whatever order this function returns, so the day this function starts
 * ordering by something smarter than array position, no component changes.
 *
 * `getProjectLibraryHref` now returns the real `/work/library` route
 * (Task 5.2) — until this task, it returned the Landing's own in-page
 * anchor (`#project-library`) because the dedicated Case Study Library
 * experience didn't exist yet. This is the one-line change
 * docs/29-WORK_LANDING_PROPOSAL.md and docs/30-CASE_STUDY_LIBRARY_
 * PROPOSAL.md both anticipated: neither the Landing's `ContinueExploring`
 * call site nor `work-copy.ts`'s `CONTINUE_EXPLORING_COPY` needed to change
 * for the Landing to start pointing here.
 */
import {
  PLACEHOLDER_WORK,
  type CaseStudyEntry,
} from "@/lib/constants/placeholder-work";
import {
  PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS,
  PLACEHOLDER_ENGINEERING_LESSONS,
  type EngineeringThemeEntry,
  type EngineeringLessonEntry,
} from "@/lib/constants/placeholder-work-landing";

/**
 * The editorially curated subset of the Project Library — see
 * `placeholder-work.ts`'s `featured` docstring for why this is a filter
 * over the one project collection, never a second dataset
 * (docs/29-WORK_LANDING_PROPOSAL.md §3).
 */
export function getFeaturedCaseStudies(): CaseStudyEntry[] {
  return PLACEHOLDER_WORK.filter((entry) => entry.featured);
}

/**
 * The complete, unfiltered project collection, in the resolver's own
 * significance-ordered sequence — see this file's docstring on default
 * ordering. Deliberately the same source `getFeaturedCaseStudies` reads
 * from, not a copy of it. Consumed today by both `app/work/page.tsx`'s
 * Project Library preview and, via `getCaseStudyLibrary()`, `app/work/
 * library/page.tsx`'s complete Listing — one resolved collection, two
 * presentations, never two datasets (docs/30 §3, §5).
 */
export function getProjectLibrary(): CaseStudyEntry[] {
  return PLACEHOLDER_WORK;
}

/**
 * The engineering-theme vocabulary Architecture Highlights introduced on
 * the Landing (docs/29 §4), reused verbatim — not re-derived — by the
 * Library's theme Browse Lens (docs/30 §5: "Architecture Highlights and
 * Browse Lenses share a vocabulary, not a UI"). One theme collection, two
 * presentations at two different scopes, same single-source-of-truth
 * discipline as `getProjectLibrary`.
 *
 * Future architectural note (Task 5.2 review refinement #4, documentation
 * only — no implementation change now): this function should become the
 * single owner of every engineering-theme *relationship*, not just the
 * theme list itself. Concretely, once real case studies carry their own
 * theme frontmatter (the same future direction `architecture-highlights.tsx`
 * already documents — `Project → Engineering Themes → Architecture
 * Highlights`), this function's body should derive theme counts, each
 * theme's related case studies, and their ordering directly from
 * `getProjectLibrary()`'s collection, rather than reading a separately
 * maintained `PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS` array. Its signature —
 * `EngineeringThemeEntry[]`, already carrying `relatedCaseStudies` — does
 * not need to change for that to happen; only what computes the array
 * inside this function does.
 */
export function getEngineeringThemes(): EngineeringThemeEntry[] {
  return PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS;
}

/**
 * The reusable-knowledge lessons distilled from this work (docs/29 §6) —
 * moved here in Task 5.2 review refinement #7 so `app/work/page.tsx` no
 * longer imports `PLACEHOLDER_ENGINEERING_LESSONS` directly, closing the
 * one remaining page-to-placeholder dependency this file's Content Layer
 * Boundary note above now rules out everywhere.
 */
export function getEngineeringLessons(): EngineeringLessonEntry[] {
  return PLACEHOLDER_ENGINEERING_LESSONS;
}

/**
 * The Case Study Library's own route (Task 5.2). See this file's docstring
 * for why this function, rather than a literal, is what every caller reads.
 */
export function getProjectLibraryHref(): string {
  return "/work/library";
}

/**
 * One cohesive model for the entire Case Study Library page (Task 5.2
 * review refinement #1) — `app/work/library/page.tsx` calls this single
 * function rather than composing `getProjectLibrary()` and
 * `getEngineeringThemes()` itself. The page receives a resolved *library*,
 * not an assembly of parts it has to reason about combining.
 *
 * `count` is included even though it's currently a one-line derivation
 * (`caseStudies.length`) precisely so it doesn't stay one: this is the
 * single entry point `LibraryHeader`, `BrowseLenses`, and
 * `CaseStudyListing` all read from, so if "count" ever needs to mean
 * something other than array length — e.g. once pagination or a resolver-
 * level cap exists — it changes here once, not in three components that
 * would otherwise have each computed it themselves.
 *
 * Long-term, this is meant to be the single entry point for everything the
 * Library page needs — listing, Browse Lenses, counts, ordering — without
 * presentation changing shape. Grouping the Listing by domain, however, is
 * deliberately *not* part of this model (see `case-study-listing.tsx`'s own
 * docstring): grouping is a presentation decision applied to
 * `caseStudies`, not a property this resolver bakes into the collection
 * itself. `getCaseStudyLibrary()` hands back one ordered collection; how
 * `CaseStudyListing` chooses to group it for display is that component's
 * decision to make and remake independently.
 */
export interface CaseStudyLibrary {
  caseStudies: CaseStudyEntry[];
  themes: EngineeringThemeEntry[];
  count: number;
}

export function getCaseStudyLibrary(): CaseStudyLibrary {
  const caseStudies = getProjectLibrary();
  return {
    caseStudies,
    themes: getEngineeringThemes(),
    count: caseStudies.length,
  };
}
