# 47 — RSS Implementation Plan

## Status

Implementation Plan — translating the approved `docs/46-RSS_EXPERIENCE.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/46` establishes *what* Task 6.6 should do and *why* — RSS 2.0, three real content collections, a merged chronological order, and (its own central finding) a `SITE_URL` gap no prior task had to solve. This document establishes *exactly what changes, file by file* — the same role `docs/36`/`docs/38`/`docs/40`/`docs/42`/`docs/44` played for every prior Task 6.x. `docs/46`'s own architecture is preserved throughout; no decision it already made is reopened here without new repository evidence forcing it (§3 finds none).

---

## 2. Authoritative Inputs & Constraints

`docs/46-RSS_EXPERIENCE.md` is the architecture authority. Carried forward unchanged:

- **RSS 2.0**, at the already-committed `RSS_PATH = "/rss.xml"` (`docs/46` §8, D... via §13).
- **Three collections only** — Knowledge (`getAllArticles()`), Work/Case Studies (`getAllCaseStudies()` — **never** `lib/content/work.ts`), Engineering Log (`getAllEngineeringLogEntries()`) (`docs/46` §6).
- **Description-only items**, not full-content syndication (`docs/46` §9, D2).
- **One true chronological merge** across all three collections, sorted on real `Date` objects *before* any date formatting (`docs/46` §9, D3) — not three grouped sections the way Search presents its results.
- **`SITE_URL`**, unprefixed (no `NEXT_PUBLIC_`), introduced now because Sitemap will need the identical value (`docs/46` §7, D1; confirmed as a real, live dependency by `docs/48-SITEMAP_EXPERIENCE.md` §8, which explicitly defers to whichever of RSS/Sitemap implements first — this plan is that implementation).
- **Header, Footer, RSS_PATH, and every existing content loader stay unmodified** — this task's own explicit guardrails, and already `docs/46`'s own stated scope boundary (§11, §15).
- **No new dependency** — hand-built XML serialization, matching `docs/46` §13's own reasoning (no metadata-file convention exists for RSS in this Next.js version; a plain Route Handler using the Web Response API is the correct, complete mechanism).

---

## 3. Re-Inspection Findings

Re-verified directly against the actual repository this turn — not relied on from `docs/46` alone.

### Confirmed, matching `docs/46` exactly

- No `rss.xml`/`feed.xml` route, handler, or utility exists anywhere under `src/`.
- `lib/constants/site.ts` (confirmed by direct read): `SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `RSS_PATH = "/rss.xml"`, `FOOTER_CLOSING_MESSAGE` — no `SITE_URL`, exactly as `docs/46` found.
- No `.env*` file exists anywhere in the repository. No `process.env`/`NEXT_PUBLIC_` reference exists anywhere under `src/`.
- `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` all confirmed unchanged, all still `filterDrafts()`-backed.
- No XML/HTML-escaping utility exists anywhere in this codebase — confirmed by search; this plan's own WI-3 is the first place one is needed.

### New findings from this turn's own re-inspection — refining, not contradicting, `docs/46`

- **The correct, smallest location for `SITE_URL` is `lib/constants/site.ts` itself**, not a new file. Its own docstring already states its purpose precisely: *"Identity and external-link values referenced from more than one place (Header, Footer, Contact, and **SEO metadata**) — kept here once so none of them re-type the same string."* `SITE_URL` is exactly that kind of value, and this file is already imported by every consumer category (`Header`, `Footer`, `Contact`, and now RSS) that would ever need it. `lib/metadata/` and `lib/seo/` remain empty scaffolds (confirmed again) — reaching for either to hold one constant would be a new file for something an existing, already-correct file already fits, the same "don't invent a location that already exists" discipline this series has applied repeatedly (`about-copy.ts` extending `homepage-copy.ts`'s established shape rather than a new pattern; `WI-1`'s `Input` primitive matching `Button`'s existing convention rather than inventing one).
- **Reading `process.env.SITE_URL` in a Route Handler requires no special configuration** — confirmed against this project's own bundled Next.js docs (`node_modules/next/dist/docs/01-app/02-guides/environment-variables.md`): *"Next.js has built-in support for loading environment variables from `.env*` files into `process.env`"*, automatically available in Route Handlers with no `next.config.ts` change. A plain, unprefixed `SITE_URL` (§2) needs nothing beyond an optional local `.env.local` (gitignored by Next's own convention) and the real value set via the deployment platform for production.
- **The RSS route can remain statically prerendered, not forced dynamic.** Confirmed against this project's own bundled docs (`04-glossary.md`, "Request-time APIs"): a component/route only opts into dynamic rendering by calling `cookies()`, `headers()`, `searchParams`, or `draftMode()`. This route calls none of them — `process.env.SITE_URL` is read directly, not through a Request-time API, and all content comes from the filesystem via already-existing resolvers. **This is a meaningful contrast with `/search`** (forced dynamic because it reads `searchParams`, `docs/41` §17) — `/rss.xml` is expected to build and cache the same way `/about`/`/knowledge` do, confirmed as a real architectural property to verify (§9 WI-6 step), not assumed.

No discrepancy that changes `docs/46`'s own architecture was found — both new findings *refine* implementation-level detail `docs/46` itself flagged as needing verification (§46 §13's own "should be verified... not asserted here without that verification").

---

## 4. `SITE_URL` — The Shared Dependency, Resolved Here First

Per `docs/48-SITEMAP_EXPERIENCE.md` §8/Q4's own explicit framing: *"whichever of RSS or Sitemap is implemented first is the one whose implementation plan actually introduces the `SITE_URL` constant; the second one imports it, unmodified."* **This plan is that first implementation.** Sitemap's own future implementation plan is expected to import `SITE_URL` from `lib/constants/site.ts` directly, not redeclare it.

### The actual production URL is not available in this repository, and is not invented here

No `.env` file, no deployment configuration, no prior documentation anywhere in this repository states the real production domain. Per this task's own explicit instruction, **this is marked as an implementation prerequisite, not guessed.**

**How the value will be supplied, precisely:**

```ts
// lib/constants/site.ts — conceptual shape, not authorized for writing yet
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
```

- **Local development / `pnpm dev` / `pnpm build` without any `.env.local`**: falls back to `http://localhost:3000` — the feed still builds and is fully testable locally with zero required setup, honoring `docs/12` Milestone 1's own "no environment validation layer until first needed" restraint.
- **Production**: whoever controls deployment sets a real `SITE_URL` environment variable via the hosting platform's own configuration (e.g., a Vercel project environment variable) before or at deploy time. **This document does not know, and does not invent, that value.**
- **Not public.** No `NEXT_PUBLIC_` prefix — confirmed, this value's only consumer is a Route Handler (100% server-only; a Route Handler has no client bundle at all) and, in the future, Sitemap's own `sitemap.ts` (also server-only by the framework's own design, `docs/48` §4). No file found in this reconnaissance gives a reason a browser would ever need this value directly.
- **No duplicate constants.** `RSS_SITE_URL`/`SITEMAP_SITE_URL` are explicitly not created — one export, `SITE_URL`, in the one file already established for exactly this category of value.

---

## 5. Work Data Source — Re-Confirmed, Not Reopened

**Hard requirement, satisfied by design, re-verified this turn**: every Work item in the feed comes from `getAllCaseStudies()` (`src/lib/content/case-studies.ts`), which reads real `content/work/*.mdx` documents via `getAll<WorkFrontmatter>("work")`. `src/lib/content/work.ts`'s `getFeaturedCaseStudies()`/`getProjectLibrary()` (both backed by `PLACEHOLDER_WORK`, a hand-authored fixture already confirmed drifted from the real case studies' actual `description` text — `docs/42` §3, re-confirmed by `docs/46` §2/§6) are not imported anywhere in this plan's file manifest (§8). WI-6's own verification step tests this directly, the same evidenced way `docs/42`'s WI-10 step 2 already did for Search.

---

## 6. Work Items

### WI-1 — `SITE_URL` Constant

**Purpose:** the one shared piece of new configuration this task (and, later, Sitemap) depends on (§4).

**Files to modify:** `src/lib/constants/site.ts`.

**Exact responsibility:** add `export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";`, placed alongside `RSS_PATH` (both are route/origin-adjacent values), with a docstring stating the value's source, its fallback, and that production deployment must supply the real one — matching `RSS_PATH`'s own existing docstring convention in the same file.

**Dependencies:** none.

**Acceptance criteria:** no `NEXT_PUBLIC_` prefix; no second `SITE_URL`-equivalent constant created anywhere else; `RSS_PATH`, `SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `FOOTER_CLOSING_MESSAGE` all show zero diff beyond the one new export.

---

### WI-2 — Content Resolution & Chronological Merge (`lib/content/rss.ts`)

**Purpose:** read the three participating collections through their existing, real resolvers, and merge them into one true chronological order — before any date formatting occurs (`docs/46` §9, D3).

**Files to create:** `src/lib/content/rss.ts` — a new, collection-spanning resolver file, mirroring `lib/content/search.ts`'s own "one resolver file per cross-collection concern, existing loaders untouched" precedent (`docs/42`), not a modification to `articles.ts`/`case-studies.ts`/`engineering-logs.ts`/`loader.ts` (this task's own guardrail, and independently the correct call).

**Exact responsibility:**

```text
Knowledge  →  getAllArticles()             (real, filterDrafts() already applied)
Work       →  getAllCaseStudies()          (real — §5, never work.ts)
Eng. Log   →  getAllEngineeringLogEntries() (real, filterDrafts() already applied)
```

Each `ContentItem` normalized into a small, RSS-specific shape distinct from `ResolvedArticleSummary` (`docs/46` §12 already explains why that shape doesn't fit — pre-formatted display date, `readingTime`/`difficulty` fields RSS has no use for):

```text
// Conceptual shape — no implementation authorized by this document.
interface FeedItem {
  title: string;
  description: string;
  link: string;            // absolute — SITE_URL + the same path shape
                            // toSummary()/toCaseStudySummary()/
                            // toEngineeringLogArticleSummary() already use
                            // ("/knowledge/{slug}", "/work/{slug}",
                            // "/engineering-log/{slug}")
  pubDate: Date;            // frontmatter.publishedAt — real Date, not yet
                            // formatted (the D3 ordering requirement)
  guid: string;             // same as `link` — already unique, already stable
  category: "Knowledge" | "Work" | "Engineering Log";
}

function getFeedItems(): FeedItem[]
```

`getFeedItems()` concatenates all three normalized arrays and sorts the combined result by `pubDate` descending — the one true merge `docs/46` §9/D3 requires, done here, once, with real `Date` objects still intact.

**Dependencies:** WI-1 (needs `SITE_URL` to build each `link`).

**Acceptance criteria:** zero hand-written re-implementation of any existing resolver's own filesystem/parsing logic — this file only calls `getAllArticles()`/`getAllCaseStudies()`/`getAllEngineeringLogEntries()` and maps their output; `getFeedItems()`'s returned array is sorted correctly by real `Date`, verified with items from more than one collection interleaved (not merely each collection internally sorted).

---

### WI-3 — XML Serialization (`lib/content/rss.ts`)

**Purpose:** turn `FeedItem[]` into a valid, well-formed RSS 2.0 XML document — the one place text escaping and date formatting happen (`docs/46` §9's own explicit correctness requirement).

**Files:** same file as WI-2.

**Exact responsibility:**

```text
// Conceptual shape — no implementation authorized by this document.
function buildRssXml(items: FeedItem[], siteUrl: string): string
```

Produces the complete document:
- **Channel-level**: `<title>` (from `SITE_NAME`), `<link>` (`siteUrl`), `<description>`, `<language>en-us</language>`, `<lastBuildDate>` (the newest item's `pubDate`, or generation time if `items` is empty), and a self-referencing `<atom:link href="{siteUrl}{RSS_PATH}" rel="self" type="application/rss+xml" />` (`docs/46` §9's own recommended best practice — cheap once `SITE_URL` exists).
- **Per item**: `<title>`, `<link>`, `<description>`, `<pubDate>` (RFC 822, formatted *from* each item's real `Date` here — not earlier), `<guid isPermaLink="true">`, `<category>`.
- **Escaping**: every text node (`title`, `description` at minimum) passed through a dedicated escape step before being written into the XML string — entity-escaping (`&`, `<`, `>`, and, for attribute-safety, `"`/`'`) or CDATA-wrapping, applied uniformly. `docs/46` §9's own explicit requirement, satisfied here as one small, testable function rather than ad hoc string interpolation scattered through the template.

**Dependencies:** WI-2.

**Acceptance criteria:** a title or description containing `&`, `<`, or `>` produces valid XML (verified with a real or temporary test value, not assumed); the feed validates as well-formed XML; `<pubDate>` values are RFC 822-formatted; the self-referencing `<atom:link>` is present and correct once `SITE_URL` is set.

---

### WI-4 — Route Handler (`src/app/rss.xml/route.ts`)

**Purpose:** the actual `/rss.xml` endpoint — wiring WI-1/WI-2/WI-3's exports into a real HTTP response.

**Files to create:** `src/app/rss.xml/route.ts` — a literal folder named `rss.xml` containing `route.ts`, confirmed as the correct convention for this exact static path (`docs/46` §2/§13; no metadata-file convention exists for RSS the way it does for Sitemap, `docs/48` §4).

**Exact responsibility:**

```text
// Conceptual shape — no implementation authorized by this document.
import { SITE_URL, RSS_PATH } from "@/lib/constants/site";
import { getFeedItems, buildRssXml } from "@/lib/content/rss";

export async function GET() {
  const items = getFeedItems();
  const xml = buildRssXml(items, SITE_URL);
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
```

This file contains no matching, normalization, or XML-building logic of its own — the same "route file is thin; the resolver file does the work" precedent `app/search/page.tsx` already established (`docs/42` WI-5).

**Dependencies:** WI-1, WI-2, WI-3.

**Acceptance criteria:** no `params`/`searchParams` (this route has no dynamic segments or query variants in scope); `Content-Type` is exactly `application/rss+xml; charset=utf-8`; the route calls no Request-time API (§3's finding), so it prerenders statically rather than forcing dynamic rendering — verified directly (§9 WI-6), not assumed.

---

### WI-5 — Feed Discovery Metadata

**Purpose:** the one small, in-scope addition `docs/46` §11 already identified as touching neither Header nor Footer — standard `<link rel="alternate">` feed auto-discovery.

**Files to modify:** `src/app/layout.tsx`.

**Exact responsibility:** add `alternates: { types: { "application/rss+xml": \`${SITE_URL}${RSS_PATH}\` } }` to the existing root `export const metadata` object — confirmed as a real, documented Next.js Metadata API field (`docs/46` §2, verified against `generate-metadata.md`). No other line in this file changes — the existing `title`/`description`, `ThemeProvider`, `WorkspaceLayout`, and font setup are untouched.

**Dependencies:** WI-1 (needs `SITE_URL`).

**Acceptance criteria:** `git diff` on `layout.tsx` shows only the added `alternates` field; `Header`, `Footer`, `WorkspaceLayout`, `ThemeProvider` all show zero diff (confirming this task's own explicit "do not modify Header/Footer" guardrail held, since this file is neither).

---

### WI-6 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/36`'s WI-7, `docs/38`'s WI-9, `docs/40`'s WI-10, `docs/42`'s WI-10, and `docs/44`'s WI-4.

**When it runs:** only after WI-1 through WI-5 are complete.

**Verification steps:**

1. **Functional** — `/rss.xml` returns a valid, well-formed RSS 2.0 document; items from all three collections appear; items are in one true chronological order (not grouped by collection — verified by checking actual interleaving, not just that each collection's own items are individually ordered).
2. **Work data source, specifically** — an item's `<description>` matches real `content/work/*.mdx` frontmatter text (e.g., a phrase from `vaultpay.mdx`'s actual `description`), and `PLACEHOLDER_WORK`'s own drifted `summary` text does **not** appear anywhere in the feed — the same direct, evidenced test `docs/42` WI-10 step 2 already ran for Search.
3. **Absolute URLs** — every `<link>` and `<guid>` is a real absolute URL built from `SITE_URL`; with no `SITE_URL` env var set, they correctly fall back to `http://localhost:3000/...` rather than a relative path or an error.
4. **XML correctness** — a title/description containing `&`/`<`/`>` (real or temporarily substituted) does not break the document; the feed validates as well-formed XML.
5. **Rendering strategy** — `/rss.xml` is confirmed statically prerendered (not forced dynamic), verified against the actual `pnpm build` output the same way `/search`'s own `ƒ` (Dynamic) marker was confirmed in `docs/42`'s own verification.
6. **Scope boundary held** — no new dependency in `package.json`; `Header`, `Footer`, `RSS_PATH`'s own value, and every existing content loader show zero diff.
7. **Automated checks:** `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
8. **Git diff vs. this plan's file manifest (§7)** — exact match.
9. **Discovery metadata** — `alternates.types["application/rss+xml"]` present and correct in the rendered `<head>`.
10. **Regression** — every existing route (`/`, `/knowledge`, `/work`, `/engineering-log`, `/about`, `/search`, 404) still returns its expected status code.

**Release recommendation:** **Approved** or **Refinements Required**, the identical format every prior implementation plan in this series has used.

---

## 7. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/lib/constants/site.ts` | Modified (add `SITE_URL` only) | WI-1 |
| `src/lib/content/rss.ts` | New | WI-2, WI-3 |
| `src/app/rss.xml/route.ts` | New | WI-4 |
| `src/app/layout.tsx` | Modified (add `alternates.types` only) | WI-5 |

**Not touched by this plan, anywhere:** `components/navigation/header.tsx`, `components/navigation/footer.tsx`, `RSS_PATH`'s own value, `lib/content/work.ts`, `lib/constants/placeholder-work.ts`, `lib/content/articles.ts`, `lib/content/case-studies.ts`, `lib/content/engineering-logs.ts`, `lib/content/loader.ts`, `package.json`, every existing route.

Two new files, two modified files (one a single-constant addition, one a single-field addition) — a comparably small footprint to Search's own (`docs/42` §6), smaller than About's.

---

## 8. Sequencing

```
WI-1 (SITE_URL)
       │
       ▼
WI-2 (content resolution + merge) ──▶ WI-3 (XML serialization)
       │                                      │
       └──────────────────┬───────────────────┘
                           ▼
                    WI-4 (route handler)
                           │
                           ▼
                    WI-5 (discovery metadata)
                           │
                           ▼
                    WI-6 (RC review)
```

WI-1 has no dependency and must land first — everything else needs `SITE_URL`. WI-2 → WI-3 are sequential within `lib/content/rss.ts` (serialization needs resolved items). WI-4 depends on both. WI-5 depends only on WI-1 and can technically happen anytime after it, but is sequenced after WI-4 so the discovery metadata points at a route that actually already works. WI-6 is strictly last.

---

## 9. Explicit Guardrails

- No modification to `components/navigation/header.tsx` or `components/navigation/footer.tsx` — RSS's disabled icon/row stay exactly as they are; activation is a separate, later step (`docs/46` §11, §15).
- No modification to `RSS_PATH`'s own value — read, not renamed or redefined.
- No modification to any existing content loader (`articles.ts`, `case-studies.ts`, `engineering-logs.ts`, `loader.ts`, `collections.ts`).
- No new npm dependency.
- No second `SITE_URL`-equivalent constant (`RSS_SITE_URL`, etc.) anywhere.
- No `NEXT_PUBLIC_` prefix on `SITE_URL` without a demonstrated client-side consumer (none exists).
- Full-content (`content:encoded`) syndication not implemented (`docs/46` D2).
- No grouped/sectioned feed output — one true chronological merge only (`docs/46` D3).

---

## 10. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `SITE_URL` gets the `NEXT_PUBLIC_` prefix out of habit, since that's the name `docs/12`'s own example used | Medium | §4/WI-1 state the unprefixed name explicitly with the specific reasoning (server-only consumer), not left to convention-following alone |
| The merge sorts item arrays per-collection but concatenates without a final combined sort, silently reproducing three grouped blocks instead of one timeline | Medium | WI-2's acceptance criterion requires verifying interleaving across collections specifically, not just each collection's own internal order; WI-6 step 1 re-checks this live |
| XML escaping is skipped because no current content happens to contain `&`/`<`/`>`, so the gap isn't visible until real content does | Medium | WI-3's acceptance criterion and WI-6 step 4 both require testing with an actual special-character value, not just "it built without erroring" |
| `SITE_URL` fallback silently ships to production (real feed URLs pointing at `localhost`) because no one set the real env var | Low–Medium | §4 states this as an explicit prerequisite in writing, not an implementation detail buried in code comments; WI-6 step 3 verifies the fallback behavior exists and is correct, but cannot itself verify production configuration, which is outside this repository's own scope |
| A future editor reaches for `lib/content/work.ts` again out of habit | Low | §5/WI-2 state the correct source with the specific historical evidence (`docs/42`/`docs/46`'s own drift finding) already cited twice; WI-6 step 2 tests it directly |

---

## 11. Verification Plan

Inherits `docs/46` §16 in full; formally executed and signed off by WI-6.

---

## 12. Rollback Plan

WI-2/WI-3 (`lib/content/rss.ts`) and WI-4 (`route.ts`) are new, independently deletable files. WI-1 (`SITE_URL`) and WI-5 (`alternates.types`) are each a single additive line in an existing file, trivially revertable with no cross-file cleanup. No schema change, no data migration, no irreversible step anywhere in this plan.

---

## 13. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/46` — none introduces a new architectural decision beyond the implementation-level refinements §3 found and flagged explicitly.
- `SITE_URL`'s location, naming, and fallback behavior are each justified with direct evidence (`site.ts`'s own docstring; this project's own bundled Next.js docs), not asserted.
- Work's data source is re-confirmed, not merely re-asserted, with a live verification step (WI-6 step 2).
- The chronological-merge requirement (`docs/46` D3) is stated precisely enough, and tested specifically enough (WI-6 step 1), that grouped output can't silently pass review.
- File manifest (§7) is exhaustive; guardrails (§9) leave no reasonable path to modifying Header, Footer, `RSS_PATH`, or any content loader.
- No production code, component, route, or content was modified to produce this document.

---

## 14. Final Report Requirements

WI-6's own deliverable — work items completed, file manifest as actually diffed vs. this plan's prediction, all ten WI-6 verification steps individually, guardrail confirmation, and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/46-RSS_EXPERIENCE.md`'s architecture into six work items — one new shared constant (`SITE_URL`, located in the file already established for exactly this category of value, not a new one), one new content-resolution-and-serialization file reusing three existing, real resolvers, one new thin Route Handler, and one single-field addition to root metadata for feed discovery. Two re-inspection findings refined `docs/46`'s own open implementation questions with direct evidence rather than assumption: `SITE_URL`'s correct home is `lib/constants/site.ts`, and the route can remain statically prerendered since nothing in its implementation touches a Request-time API. The one real external dependency this plan cannot resolve itself — the actual production `SITE_URL` value — is named explicitly as a prerequisite (§4), not guessed at.
