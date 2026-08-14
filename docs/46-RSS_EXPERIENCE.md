# 46 — RSS Experience

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.6's design proposal, following `docs/45-MILESTONE_6_REMAINING_WORK.md`'s reconciliation, which identified RSS and Sitemap as Milestone 6's only remaining, unbuilt deliverables — Homepage, Knowledge, Work, Engineering Log, About, Search, and 404 are all complete and approved.

---

## 1. Purpose

`docs/12-Implementation Roadmap.md` names **RSS** as a Milestone 6 deliverable. `docs/10-Technical Architecture.md` adds the only real content specification found anywhere in this repository: *"Automatically generated. Includes: Knowledge, Engineering Logs, Case Studies. RSS should remain a first-class feature."* `lib/constants/site.ts` already defines `RSS_PATH = "/rss.xml"` — a route this codebase has been pointing at, unbuilt, since before this milestone began. `Header`'s RSS icon and `Footer`'s RSS row have both sat disabled with a `"(coming soon)"` label through every prior Core Pages task, honestly marking a gap rather than hiding it. Task 6.6 designs the feed that finally closes it.

---

## 2. Current State (Reconnaissance)

Verified against the actual repository this turn, not assumed from `docs/45`.

### RSS — confirmed not implemented, precisely

- **No route exists.** No file anywhere under `src/app/` named `rss.xml`, `feed.xml`, or equivalent.
- **No feed-generation utility exists.** No file under `src/lib/` builds or serializes XML of any kind.
- **`RSS_PATH` is defined, never consumed.** `src/lib/constants/site.ts:23`: `export const RSS_PATH = "/rss.xml";` — an exact-match search across `src/` (`grep -rn "RSS_PATH"`) returns only this one declaration. Nothing imports it.
- **`Header` has a disabled RSS control**, confirmed by direct read (`src/components/navigation/header.tsx`): a `Button` with `disabled`, `aria-label="RSS feed (coming soon)"`, `title="RSS feed (coming soon)"`, rendering a `lucide-react` `Rss` icon — positioned in the same utility icon cluster as the (now-active) Search button and the GitHub link.
- **`Footer` has a disabled RSS control**, confirmed by direct read (`src/components/navigation/footer.tsx`): not even a disabled `<button>` — a plain, non-interactive `<span>` reading `"RSS (coming soon)"`, with an inline comment: *"Not a link — /rss.xml isn't live yet (Milestone 6)."*
- **No RSS/feed-building dependency is installed.** `package.json` contains no `feed`, `rss`, `xmlbuilder`, or equivalent package.

### The content resolvers already available — confirmed exactly which functions are real

| Collection | Real resolver | Confirmed real content? |
|---|---|---|
| Knowledge | `getAllArticles()` (`lib/content/articles.ts`) | Yes — reads `content/knowledge/*.mdx` via `getAll<KnowledgeFrontmatter>("knowledge")`, `filterDrafts()` already applied internally |
| Work (Case Studies) | `getAllCaseStudies()` (`lib/content/case-studies.ts`) | Yes — reads `content/work/*.mdx` via `getAll<WorkFrontmatter>("work")`, `filterDrafts()` already applied internally |
| Engineering Log | `getAllEngineeringLogEntries()` (`lib/content/engineering-logs.ts`) | Yes — reads `content/engineering-log/*.mdx` via `getAll<ArticleFrontmatter>("engineering-log")`, `filterDrafts()` already applied internally (collection is currently empty — `.gitkeep` only — a real, expected zero-item state, not an error) |

**`lib/content/work.ts`'s `getFeaturedCaseStudies()`/`getProjectLibrary()` are confirmed, again, not the correct source** — both still read `PLACEHOLDER_WORK` (`lib/constants/placeholder-work.ts`), a hand-authored fixture whose `summary` text has already drifted from the real MDX `description` frontmatter for the same projects (the exact discrepancy `docs/42` §3 already documented and corrected for Search; re-verified here rather than assumed, since this task's own instructions asked specifically not to assume). Any RSS design that read `work.ts` would syndicate stale, non-canonical copy. This proposal's data-source recommendation (§6) uses `case-studies.ts` exclusively.

### The site-wide gap RSS surfaces — no existing base URL infrastructure

Confirmed by direct read of `lib/metadata/`, `lib/seo/` (both `.gitkeep` only — unchanged since `docs/35`'s own original finding) and every route's `export const metadata`: **no `SITE_URL` constant, no `metadataBase`, and no environment variable for the site's own canonical origin exist anywhere in this repository.** `docs/12-Implementation Roadmap.md` itself, in Milestone 1's own Deliverables list, already anticipates this: *"Environment validation will be introduced when the first project-specific environment variables are added (e.g. `NEXT_PUBLIC_SITE_URL`...). Until then, no environment validation layer is necessary."* RSS is the first real feature in this repository that cannot function correctly without one — every `<link>` and `<guid>` in an RSS feed must be an absolute URL per the RSS 2.0 specification; every route built so far (Homepage through 404) has only ever needed relative `href`s. §7 treats this as this proposal's central architectural question, not a footnote.

### Next.js's actual RSS-relevant conventions — verified against this project's own bundled docs

Confirmed via `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/`: this Next.js version has first-class metadata-file conventions for `sitemap.ts` and `robots.ts` (both listed under `01-metadata/`) — **but no equivalent convention exists for RSS**. There is no `feed.ts` or `rss.ts` metadata-file type. RSS must be built as an ordinary **Route Handler** (`route.ts`, confirmed via `03-file-conventions/route.md`) — a file exporting a `GET` function that returns a Web `Response` directly, the same underlying primitive every other Route Handler in the framework uses, just returning XML text instead of `Response.json()`. Also confirmed: the Metadata API's `alternates.types` field (`generate-metadata.md`) is a real, documented mechanism for feed auto-discovery — `alternates: { types: { "application/rss+xml": "..." } }` — relevant to §11.

---

## 3. Discrepancies Found

- **None found between `docs/45`'s prior reconciliation and this turn's direct re-verification.** Every fact `docs/45` §6 stated about RSS (no route, `RSS_PATH` unconsumed, Header/Footer disabled, `docs/10`'s three-collection scope) was independently re-confirmed against the live repository this turn, not merely re-cited.
- **A gap `docs/45` named but didn't develop**: `docs/45` §6 noted RSS content guidance exists in `docs/10` but didn't examine the base-URL problem RSS actually creates. That gap is real, and is this proposal's own primary subject (§7).
- No other discrepancy found.

---

## 4. Core Question: What Does a Correct RSS Feed Require Here?

```text
docs/10's content scope             The one thing no page has
(Knowledge, Engineering Logs,       needed until now:
Case Studies)                       an absolute site URL
        │                                    │
        ▼                                    ▼
Real, already-resolved            Every <link>, <guid>, and
content — reuse, don't            <atom:link> in a valid RSS
duplicate (§6)                    feed must be absolute (§7)
        │                                    │
        └──────────────┬─────────────────────┘
                        ▼
        A single, correctly-ordered, correctly-
        escaped RSS 2.0 document, served from
        the exact route (`/rss.xml`) this
        codebase has already been pointing at
```

Two genuinely separate problems, both real: *which content* (already well-specified by `docs/10`), and *how do we address it absolutely* (not specified anywhere, until this proposal).

---

## 5. Problem Statement

`/rss.xml` is the one Milestone 6 deliverable with real, specific content guidance (`docs/10`'s three-collection list) and zero existing infrastructure to build it from — no route convention, no base-URL constant, no feed-building code. Task 6.6 designs a minimal, correct RSS 2.0 feed reusing this codebase's own already-resolved content collections, and resolves — rather than works around — the absolute-URL gap that has never mattered to any prior Core Pages task.

---

## 6. Content Scope

### Included, per `docs/10`'s own explicit list — each justified independently, not by default

- **Knowledge** (`getAllArticles()`). Real, published articles; already the exact set `/knowledge` itself lists.
- **Engineering Log** (`getAllEngineeringLogEntries()`). Real, published entries; currently zero (collection is empty) — a valid, expected state (§10), not a reason to exclude the collection from the feed's design.
- **Work / Case Studies** (`getAllCaseStudies()`). Real, published case studies — **from `case-studies.ts`, never `lib/content/work.ts`** (§2's re-confirmed finding). `docs/10` names this collection "Case Studies," the same term `docs/26-CASE_STUDY_TEMPLATE.md` and every Work-adjacent document in this repository already use for the `work` collection — no renaming or reinterpretation needed.

### Excluded — each justified independently, matching this task's own instruction not to assume every collection belongs

| Collection / Page | Included? | Why |
|---|---|---|
| About | No | Not named in `docs/10`'s RSS list; a single static page, not a collection with a publish timeline — nothing about it fits an item-per-entry feed model. Same reasoning `docs/41`/`docs/42` already used to exclude About from Search (`docs/42` §3, D3). |
| Homepage | No | Not content — a composed index of the other collections' own items, which already appear in the feed individually. Including it would duplicate every other item under a fourth, redundant entry. |
| Search | No | A query interface, not a document — there is nothing about `/search` a feed reader would subscribe to. |
| 404 | No | Not content by definition. |
| `series` | No | Not named in `docs/10`'s RSS list. Confirmed (`lib/content/collections.ts`) still empty and still routeless — the identical "nothing to link a reader to" reasoning `docs/42` §3/D3 already applied when excluding it from Search. |
| `technologies` | No | Same reasoning as `series` — not named in `docs/10`'s list, still empty, still routeless, a taxonomy/reference collection rather than a standalone document collection. |

This table exists explicitly because this task's own instructions ask not to assume every collection belongs — `series`/`technologies` are excluded on the same evidentiary basis (unnamed by the one real specification that exists, and structurally unfit for a feed item) that already governed Search's identical decision, not a new policy invented for RSS alone.

---

## 7. The Site URL Gap — This Proposal's Central Architectural Question

### Why this can't be deferred or worked around silently

RSS 2.0's specification requires every `<item><link>` and (conventionally) every `<guid>` to be an absolute URL — a feed reader has no page context to resolve a relative `href` against, unlike a browser following an in-page `<Link>`. Every route built in this repository so far has only ever needed relative paths (`/knowledge/${slug}`, `href="/about"`, etc.) — confirmed by `grep`, no file under `src/` currently constructs or stores an absolute site URL anywhere. RSS is the first feature that structurally cannot be built without one.

### Two ways to get an absolute origin — weighed, not silently chosen

**Option A — Derive the origin from the incoming request.** A Route Handler receives a `NextRequest`, whose `nextUrl.origin` gives the exact protocol+host the request actually arrived on. This requires zero new configuration, zero environment variable, and works correctly in any deployment environment (local dev, preview deploys, production) without anyone needing to set anything.

**Option B — Introduce a `SITE_URL` environment variable now.** Exactly what `docs/12`'s own Milestone 1 section already anticipated ("introduced when the first project-specific environment variable is added... e.g. `NEXT_PUBLIC_SITE_URL`") — RSS is that first need. A single, stable value, independent of whatever host a given request happened to arrive on.

**Recommendation: Option B**, for a reason specific to this repository, not a generic preference: **Sitemap — Milestone 6's other remaining deliverable — will need this exact same absolute-URL problem solved again, and Next's own first-class `sitemap.ts` metadata-file convention is typically statically generated and has no incoming request to derive an origin from at all.** Solving this once, now, as a small named constant both RSS and the future Sitemap proposal can read, is the same "one fact, one place" discipline `docs/24` Principle 3 already governs everywhere else in this codebase — Option A would solve RSS correctly but leave Sitemap to independently reinvent the same answer (or worse, hardcode a domain string with no shared source). Additionally, Next's own `metadataBase` field (confirmed, `generate-metadata.md`) — the mechanism Milestone 8's future Open Graph/canonical-URL work will need — expects exactly this same single absolute-origin value; establishing it now means that future task inherits a real answer instead of solving the identical problem a third time.

**A naming refinement of `docs/12`'s own example, not a contradiction of it**: `docs/12` used `NEXT_PUBLIC_SITE_URL` as its own illustrative example. The `NEXT_PUBLIC_` prefix exists specifically to inline a value into client-side JavaScript bundles. RSS's only consumer is a Route Handler — 100% server-only code, never shipped to a browser (trivially satisfying `docs/24` Principle 5, since a Route Handler has no client/server boundary question at all). **A plain `SITE_URL` (no `NEXT_PUBLIC_` prefix) is the more precisely-scoped choice** unless a future task demonstrates an actual client-side consumer — which nothing found in this reconnaissance does. If Sitemap's own future proposal also turns out to be server-only (likely, since `sitemap.ts` is itself a server-side metadata file), the same unprefixed constant serves both.

**Local development must not be blocked.** A sensible fallback (e.g., `http://localhost:3000`) when `SITE_URL` is unset keeps `pnpm dev`/`pnpm build` working without requiring every contributor to configure `.env.local` before the feed route even runs — the same "don't introduce friction Milestone 1 explicitly said wasn't needed yet" restraint `docs/12` itself asked for. Production deployment is expected to set the real value via the hosting platform's own environment configuration — a deployment-operations detail, not something this proposal or its eventual implementation plan controls.

**This is a real architecture decision, recorded formally in §14, D1** — not a detail folded silently into an implementation plan later.

---

## 8. Feed Format

**RSS 2.0**, not Atom. `docs/10`'s own Routing section names the route `/rss.xml` (not `/atom.xml` or `/feed.xml`) and its content section is literally titled "RSS," not "Atom" or "Feed" — this proposal follows the terminology and the file extension the existing architecture already committed to, rather than substituting a technically-equivalent but differently-named alternative.

---

## 9. Feed Structure

### Channel-level (once, at the top of the document)

- `<title>`, `<link>` (the site's own homepage, absolute), `<description>` — drawn from `SITE_NAME`/existing site copy, not invented fresh.
- `<language>` — `en-us`, matching `docs/01-PERSONAL_BRAND.md`'s own English-language content.
- `<lastBuildDate>` — the most recent `publishedAt` (or feed-generation time) across all included items.
- An `<atom:link href="{SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />` self-reference — a widely-adopted RSS 2.0 best practice (a feed that correctly identifies its own canonical URL), worth including since it costs nothing new to compute once `SITE_URL` exists.

### Item-level (once per Knowledge/Work/Engineering Log entry)

- `<title>` — `frontmatter.title`.
- `<link>` — `{SITE_URL}{route}`, where `{route}` is the exact same path convention this codebase's own `toSummary()`/`toCaseStudySummary()`/`toEngineeringLogArticleSummary()` functions already use (`/knowledge/{slug}`, `/work/{slug}`, `/engineering-log/{slug}`) — reusing the established path shape, not inventing a new one.
- `<description>` — `frontmatter.description`, the same summary field every listing page in this codebase already surfaces. **Not the full MDX body.** Rendering full article content to HTML for a machine-readable feed would mean invoking the MDX compilation pipeline (`next-mdx-remote`, already a dependency but not a trivial addition to a Route Handler's request path) for every item, on every feed request — a real scope and performance question this proposal deliberately doesn't take on. RSS as "here's what's new, click through to read it" is a legitimate, common feed shape, and matches this codebase's own existing "description is the summary; the full document lives at its own URL" pattern everywhere else.
- `<pubDate>` — `frontmatter.publishedAt`, formatted per RFC 822 (the RSS 2.0 date format) — the same field `sortByPublishedDate()` already treats as this codebase's single canonical ordering signal, reused here rather than `updatedAt` (which has no clean RSS 2.0 equivalent field and isn't this codebase's existing sort key anywhere else).
- `<guid isPermaLink="true">` — the item's own absolute `<link>` value. A stable, already-unique identifier (slugs are already guaranteed unique per collection); no separate UUID scheme needed.
- `<category>` — the collection name ("Knowledge," "Work," or "Engineering Log") — a free, standard RSS 2.0 element that costs nothing to include and lets a feed reader distinguish item types at a glance, the same distinction Search's own grouped results (`docs/42` WI-6) already make visually.

### Ordering — one true chronological merge, not three grouped sections

**RSS feeds are conventionally a single linear timeline**, unlike Search's own grouped-by-collection presentation (`docs/42` WI-6) — a feed reader has no concept of "sections," only an ordered item list. This means the same trap `docs/42`'s own WI-3 named for Search (sorting after formatting a date to a display string loses the real `Date` needed to sort correctly) matters even more here, because RSS *cannot* sidestep it the way Search did by grouping: **all three collections' items must be merged into one real chronological order.** The correct sequence: read all three collections' raw `ContentItem`s (real `Date` objects intact) → normalize each into a small, feed-specific shape carrying its real `publishedAt: Date` (not yet formatted) → concatenate the three normalized arrays → sort the combined array by that real `Date`, descending → only then format each item's date to RFC 822 for XML output. Getting this ordering-of-operations detail explicit here, before an implementation plan exists, is this proposal's way of not letting the same mistake almost happen twice.

### Item count

No hard limit is architecturally required at this repository's current content volume (a handful of Knowledge articles, four Case Studies, zero Engineering Log entries) — the same "small, fully-known dataset, premature to optimize" reasoning `docs/41`/`docs/42` already applied to Search's own lack of pagination. A conventional cap (e.g., the most recent N items) is still good RSS practice as the collections grow, and is recommended as a real requirement for whoever writes the implementation plan — the exact number is an implementation-task decision, not fixed here, the same granularity judgment call this series has left open repeatedly (`docs/39`/`docs/40`'s own precedent).

### XML correctness — a requirement to state now, not discover during implementation

Frontmatter `title`/`description` text is free-form author-written prose and may contain characters (`&`, `<`, `>`) that are structurally significant in XML. **Every text node written into the feed must be properly escaped (entity-escaped or CDATA-wrapped) — never interpolated raw into the XML string.** Named explicitly here so an implementation plan doesn't treat it as an afterthought; this is a correctness requirement, not a style preference.

---

## 10. Empty / Failure States

| Condition | Behavior |
|---|---|
| A participating collection has zero items (Engineering Log, today) | Contributes zero `<item>` elements — no placeholder entry, no error. The feed remains valid XML with fewer items, the same "empty collection is a valid state" discipline `docs/37`'s own empty-state ruling already established, applied here to a machine-readable format instead of a rendered page. |
| All three collections are simultaneously empty (not the current state, but a real possible one) | A structurally valid RSS 2.0 document with channel metadata and zero `<item>` elements — never an HTTP error for "no content yet." |
| A single malformed content file | Already handled upstream — `loader.ts`'s `getAll()` logs a malformed file loudly and excludes it, never taking down the whole collection (confirmed, `loader.ts`'s own existing docstring) — RSS inherits this for free by reusing `getAll*()`-backed resolvers rather than reading the filesystem itself. |

---

## 11. Discovery — `<link rel="alternate">`, Not a Header/Footer Change

This task's own authorization explicitly excludes modifying `Header`/`Footer` — the disabled RSS icon and the disabled Footer row both stay exactly as they are for this proposal's own scope; their eventual activation is a separate, later step (the same "small, distinct follow-up" shape Task 6.3a already was relative to Task 6.3), not something this document plans on their behalf.

What *is* within this proposal's own natural scope, because it touches neither file: standard feed **auto-discovery** metadata — `alternates: { types: { "application/rss+xml": "{SITE_URL}/rss.xml" } }` in the root `layout.tsx`'s existing `export const metadata` (confirmed as a real, documented Next.js Metadata API field, §2) — the mechanism browsers and feed readers already know how to look for, independent of whether a visible icon is clickable yet. Recorded here as a real, low-cost recommendation for the implementation plan to pick up; not implemented by this document.

---

## 12. Component Reuse

| Existing Asset | Purpose | Reuse? |
|---|---|---|
| `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` | The entire content source | Yes, unmodified — this task's own guardrail (no content-loader changes) is also the architecturally correct call; nothing about RSS needs a new field or export from any of the three |
| `RSS_PATH` (`lib/constants/site.ts`) | The feed's own route path, already committed to `/rss.xml` | Yes, unmodified — read, not renamed |
| `SITE_NAME` (`lib/constants/site.ts`) | Channel-level `<title>`/`<description>` source material | Yes |

**Nothing existing is a fit for URL/date formatting** the way `toSummary()`/`toCaseStudySummary()`/`toEngineeringLogArticleSummary()` were for Search — those three functions produce `ResolvedArticleSummary`, a React-presentation shape (pre-formatted display date string, optional `difficulty`, a `readingTime` string) with no XML-safety or absolute-URL concept. RSS's own normalization step (§9) is a new, small, purpose-built shape — not a rejection of reuse, but reuse where it's real (the underlying content resolvers) and fresh code only where the output genuinely differs (machine-readable XML vs. a React component prop).

---

## 13. Route Convention

```text
src/app/rss.xml/route.ts
```

A literal folder named `rss.xml` containing a `route.ts` — the standard Next.js App Router pattern for a Route Handler at an exact, non-dynamic path (confirmed as the only mechanism available, §2 — no metadata-file convention exists for RSS the way it does for `sitemap.ts`/`robots.ts`). Exports a `GET` handler returning a `Response` with `Content-Type: application/rss+xml; charset=utf-8` and the serialized feed body. No `params`, no `searchParams` — the feed has no query variants in this proposal's scope. Fully server-only by construction (a Route Handler has no client/server boundary to reason about — `docs/24` Principle 5 is trivially satisfied, not merely followed).

**Caching**: a Route Handler's default behavior and this repository's actual Next.js version's specifics should be verified against `node_modules/next/dist/docs/` before being written into an implementation plan — not asserted here without that verification, per `AGENTS.md`'s own standing instruction. Worth flagging now as a real implementation-task question (should the feed be cached/revalidated on an interval, or regenerated every request given this content volume is tiny) rather than left undiscovered.

---

## 14. Architecture Decisions

### D1 — `SITE_URL` Environment Variable, Not Request-Derived Origin

**Context:** RSS's `<link>`/`<guid>` elements require an absolute URL; no such value exists anywhere in this repository today (§7).

**Options Considered:** (a) derive the origin from each incoming request (`NextRequest.nextUrl.origin`); (b) introduce a `SITE_URL` environment variable now, exactly as `docs/12` Milestone 1 already anticipated.

**Chosen Approach:** (b).

**Rationale:** Sitemap — the only other remaining Milestone 6 deliverable — will need this identical value, and its own likely implementation (Next's `sitemap.ts` metadata-file convention) has no request to derive an origin from at all; solving this once, as a shared constant, avoids two independently-invented answers to the same question and gives Milestone 8's future `metadataBase` work a real value to inherit rather than a third reinvention. This is `docs/24` Principle 3 (Single Source of Truth) applied prospectively, not retroactively.

**Trade-offs:** requires a documented local-dev fallback (§7) so this doesn't become a new local setup requirement `docs/12` Milestone 1 explicitly said wasn't needed yet; production deployment must set the real value.

**Consequences:** the implementation plan owns exactly one new constant (unprefixed `SITE_URL`, not `NEXT_PUBLIC_SITE_URL` — see §7's naming refinement) and one documented fallback value.

### D2 — Description-Only Items, Not Full-Content Syndication

**Context:** RSS feeds can carry either a summary or the full rendered content of each item.

**Options Considered:** (a) render each item's full MDX body to HTML for `<description>`/`<content:encoded>`; (b) use each item's existing `frontmatter.description` summary only.

**Chosen Approach:** (b).

**Rationale:** Full-content rendering means invoking the MDX compilation pipeline per item, per feed request — a real scope and performance question this proposal isn't the place to resolve, and not something `docs/10`'s own minimal RSS specification asks for ("Includes: Knowledge, Engineering Logs, Case Studies" — a content-scope statement, not a full-text-syndication requirement). Matches this codebase's own existing pattern everywhere else: `description` is the summary; the full document lives at its own URL.

**Trade-offs:** feed readers see a summary and must click through for full content — standard, widely-accepted RSS behavior, not a regression from any stated requirement.

**Consequences:** none blocking; a future task could add full-content syndication without changing the feed's URL, item identity, or channel structure.

### D3 — One Merged Chronological Feed, Not Three Grouped Sections

**Context:** Search (`docs/42` WI-6) presents its three collections as separate, grouped sections, specifically because merging normalized (already-date-formatted) results loses the real `Date` needed for a reliable cross-collection sort.

**Options Considered:** (a) mirror Search's own grouped presentation; (b) merge all three collections into one true chronological item list, sorting on real `Date` objects before any date formatting occurs.

**Chosen Approach:** (b).

**Rationale:** A feed reader has no concept of "sections" the way a web page does — RSS is inherently one linear timeline, so grouping isn't an available option the way it was for Search's own visual page. The trap Search's own WI-3 named (sort before formatting, not after) still applies, and is *more* consequential here since there's no grouping fallback to hide a wrong ordering behind.

**Trade-offs:** requires a small normalization step (§9) that keeps each item's `Date` object intact until after sorting — a few extra lines, not a new architectural layer.

**Consequences:** none blocking; this ordering logic lives entirely in the new route/resolver code this task's own guardrails already scope to, touching no existing file.

---

## 15. Implementation Scope

### Must implement

- `src/app/rss.xml/route.ts` — the feed itself, per §9/§13.
- A small, new RSS-specific normalization/merge step reading `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` — likely its own file (e.g. `lib/content/rss.ts`), mirroring `lib/content/search.ts`'s own "new resolver file per cross-collection concern, existing loaders untouched" precedent (`docs/42`), not a modification to any of the three existing loader files (this task's own guardrail, and the architecturally correct call independently).
- A `SITE_URL` constant with a documented local-dev fallback (D1).
- XML escaping for every text node (§9).

### May implement if already supported by existing infrastructure

- `alternates.types` feed-discovery metadata in root `layout.tsx` (§11) — a real, low-cost addition touching neither Header nor Footer.

### Explicitly deferred / out of scope

- Activating Header's/Footer's disabled RSS controls — this task's own explicit guardrail; a separate, later step.
- Full-content (`content:encoded`) syndication (D2).
- Sitemap — Milestone 6's other remaining deliverable, its own future proposal.
- Any Milestone 8 SEO infrastructure (`metadataBase`, Open Graph, structured data) beyond the one shared `SITE_URL` value this proposal recommends establishing now.

---

## 16. Verification Plan

### Functional
- `/rss.xml` returns valid, well-formed RSS 2.0 XML (validated against the spec, not merely "renders without a server error").
- Every `<item><link>` and `<guid>` is a real, absolute, resolvable URL.
- Items from all three collections appear, correctly merged into one true chronological order (not three grouped blocks).
- `series`/`technologies`/About/Homepage/Search/404 never appear as items.
- `PLACEHOLDER_WORK`'s own drifted text never appears in any Work item's `<description>` — the same direct, evidenced test `docs/42`'s own WI-10 step 2 already ran for Search, re-applicable here verbatim.

### Technical
`pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — the same bar every prior Core Pages task has held to.

### Regression
Every existing route, `Header`'s and `Footer`'s current disabled RSS state, and every existing content loader remain unchanged.

---

## 17. Acceptance Criteria

- The `SITE_URL` gap (§7) is treated as a first-class architecture decision (D1), not a detail discovered mid-implementation.
- Content scope (§6) is justified collection-by-collection, both inclusions and exclusions, matching `docs/10`'s own real specification rather than an assumed "everything belongs" default.
- Work's feed items are confirmed to come from `case-studies.ts`, never `lib/content/work.ts` (§2, §6).
- The chronological-merge ordering trap (§9, D3) is stated precisely enough that an implementation plan can't rediscover it as a bug.
- Header, Footer, `RSS_PATH`, and every existing content loader remain unmodified by this document and by this document's own recommended scope.
- No production code, component, route, or content was modified to produce this document.

---

## 18. Open Questions

**Q1 — What is the actual production `SITE_URL` value?**
*Why it matters:* the feed cannot ship correctly without a real answer; a placeholder or guessed domain would be exactly the kind of fabricated content this repository's own discipline (`docs/39`, `docs/43`, and every task since) has consistently refused to invent. *What's blocked:* nothing in this proposal — the architecture (D1) is decided regardless of the value. *Evidence needed:* the actual deployment domain, supplied by whoever controls hosting/DNS — not discoverable by inspecting this repository.

**Q2 — Should the feed cap item count, and at what number?**
*Why it matters:* affects one implementation-task parameter, not the architecture. *What's blocked:* nothing — no cap is safe at current content volume. *Evidence needed:* an implementation-task decision once content volume is large enough to matter.

**Q3 — Should full-content syndication (D2's deferred alternative) ever be added?**
*Why it matters:* a genuine future enhancement, not a current gap. *What's blocked:* nothing — description-only is a complete, valid feed today. *Evidence needed:* a future decision, not resolvable from this repository alone.

---

## 19. Final Recommendation

**Recommended architecture:** a single Route Handler at `src/app/rss.xml/route.ts`, reading Knowledge/Work(Case Studies)/Engineering Log through their existing, real content resolvers — never `lib/content/work.ts`'s placeholder — merged into one true chronological RSS 2.0 feed via a small new normalization step that sorts on real `Date` objects before any date formatting. The one real architectural addition this task requires beyond that: a single `SITE_URL` constant, introduced now rather than deferred, because Sitemap (Milestone 6's other remaining sibling) and Milestone 8's future SEO work will both need the identical value and shouldn't each reinvent it.

**Recommended implementation sequence**, once approved:
1. `SITE_URL` constant + documented local-dev fallback (D1).
2. `lib/content/rss.ts` (or equivalent) — the merge/normalize/sort step (§9, D3).
3. `src/app/rss.xml/route.ts` — the Route Handler itself, XML serialization, escaping.
4. `alternates.types` discovery metadata in root `layout.tsx` (§11).
5. Full verification pass (§16), including the direct placeholder-vs-real-content test (§16, mirroring `docs/42` WI-10 step 2).

**Known risks:**
- Q1 (§18) means this feed cannot actually go live with a correct, real `SITE_URL` until that value is supplied — an honest, external dependency, not a defect in this proposal's own architecture.
- The chronological-merge trap (D3) is exactly the kind of thing that's easy to get subtly wrong (sort after formatting instead of before) without this document's own explicit sequencing — named directly so an implementation plan doesn't rediscover it as a live bug.

**This document authorizes no implementation.** Task 6.6's actual build requires its own implementation plan and approval, following the same workflow every prior milestone in this repository has used.
