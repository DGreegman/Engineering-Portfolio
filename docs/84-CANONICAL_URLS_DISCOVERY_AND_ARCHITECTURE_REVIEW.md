# 84 — Task 8.3 (Canonical URLs): Discovery and Architecture Review

## Status

Discovery and architecture review — design-stage only, no implementation authorized.

> No production code, content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or configuration file was created or modified to produce this document. No canonical URL implementation was performed.

Opens execution of "Task 8.3 — Canonical URLs," this repository's own execution designation for the Canonical URLs deliverable in `docs/12`'s Milestone 8 list, following Task 8.1 (Metadata) and Task 8.2 (Open Graph), both complete and approved.

> **Note on this task's own instructions**: the incoming message arrived truncated — it ends mid-codeblock immediately after stating the central three-way distinction (`metadataBase` / `openGraph.url` / `alternates.canonical`), before any document-structure or required-section list arrived. This review proceeds using that explicit distinction as its own governing frame, and mirrors `docs/82`'s own structure (the closest analogous prior discovery document in this exact sequence), since no other structure was specified.

---

## 1. Executive Conclusion

Tasks 8.1 and 8.2 left the repository in exactly the expected state (§2) — `metadataBase`/`openGraph`/`twitter` all present and correct; zero `alternates.canonical` anywhere (re-confirmed by direct grep this turn).

**The central finding of this review, not visible from any prior Milestone 8 document because canonical URLs were out of scope for all of them**: Next's own `alternates` object follows the identical "replace, not deep-merge" rule `docs/82`/`docs/83` already discovered and correctly designed around for `openGraph`/`twitter` — and root layout already populates `alternates.types` (the RSS auto-discovery link, live on every route today via inheritance, empirically re-confirmed this turn on a static page, a dynamic page, and `/search` alike). **If any route defines its own `alternates.canonical` without also re-specifying `types`, that route silently loses its RSS auto-discovery link** — a real, concrete regression risk this review identifies precisely so the eventual implementation doesn't rediscover it as a live bug.

**The second finding**: this site has exactly one live, demonstrated duplicate-content vector — query-string variation (e.g., `/knowledge/idempotency?utm_source=x` returns `200` and renders identically to the bare URL, empirically confirmed this turn, §8) — which is precisely what canonical URLs exist to solve. Trailing-slash duplication is already handled structurally by Next's own routing (a `308` redirect, not a duplicate render, empirically confirmed); case-sensitivity duplication doesn't exist (`404` on a differently-cased slug, confirmed). No cross-page duplicate content (e.g., two different real URLs serving substantively the same content) was found anywhere in this site.

**Recommendation**: every real, canonical-worthy route sets a **self-referencing** `alternates.canonical` (its own real URL, relative, composed via the already-existing `metadataBase`) — no cross-referencing is needed anywhere. Every route that does so must **repeat** `alternates.types`'s RSS entry in the same object, mirroring the exact discipline Task 8.2 already established for `openGraph`/`twitter`. 404 and the three dynamic routes' invalid-slug fallback receive **no** canonical, consistent with `sitemap.ts`'s own already-written reasoning ("404 (not a canonical URL)"). `/search` is evaluated in detail (§11) and recommended to receive a static, query-agnostic canonical pointing at the bare `/search` — coexisting with, not replacing, its existing `noindex` directive.

No implementation is authorized by this document.

---

## 2. Task 8.1/8.2 Baseline Verification

Directly re-checked this turn:

| Assumption | Verified state |
|---|---|
| `SITE_NAME`/`SITE_URL` unchanged | **True** |
| `metadataBase` present at root | **True** — `new URL(SITE_URL)`, unchanged |
| Root title template present | **True** |
| Root `openGraph`/`twitter` defaults present | **True** — `{ siteName, locale: "en_US", type: "website" }` / `{ card: "summary_large_image" }`, unchanged |
| Every static/dynamic route has a complete `openGraph`/`twitter` object | **True** — re-verified live this turn on `/`, `/knowledge`, `/search`, `/knowledge/idempotency` |
| Zero `alternates.canonical` anywhere | **True** — every "canonical" grep hit in `src/` is unrelated prose (`work/library/page.tsx`'s own "canonical browsing surface" language, `sitemap.ts`'s own "404 (not a canonical URL)" comment, `relationships.ts`'s "canonical reading sequence") — none is a real `alternates.canonical` implementation |
| RSS auto-discovery (`alternates.types`) works on every route today | **True, empirically re-confirmed this turn** — `<link rel="alternate" type="application/rss+xml" href=".../rss.xml">` present and identical on the homepage, a Knowledge article, and `/search` alike, all via pure inheritance from root (no route defines its own `alternates` today) |

**All assumptions hold. Zero drift.** `pnpm build` was re-run this turn as part of this verification — same 33-page static/SSG classification as Tasks 8.1/8.2 left it.

---

## 3. Current Canonical URL Inventory

| Route | Real, indexable page? | Current `alternates.canonical` | Notes |
|---|---|---|---|
| `/` | Yes | None | — |
| `/knowledge` | Yes | None | — |
| `/knowledge/[topic]` (8 real) | Yes | None | Shares a route file with the article branch below |
| `/knowledge/[slug]` (7 real articles) | Yes | None | — |
| `/work` | Yes | None | — |
| `/work/library` | Yes | None | — |
| `/work/[slug]` (4 real case studies) | Yes | None | — |
| `/engineering-log` | Yes | None | — |
| `/engineering-log/[slug]` (2 real) | Yes | None | — |
| `/about` | Yes | None | — |
| `/search` (and every `?q=...` variant) | **No — `robots: { index: false }`** | None | Evaluated in full, §11 |
| 404 / invalid slug | No — already excluded from Sitemap, already auto-`noindex`ed by Next itself | None | Evaluated in full, §12 |

**Zero canonical values exist anywhere today** — confirmed exhaustively, not sampled.

---

## 4. Next.js 16.3.0 Semantics — `alternates.canonical`

Re-read directly this turn: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`'s own `alternates` and `metadataBase` sections (the same sections `docs/82`/`docs/83` already cited for `openGraph`, re-read here specifically for the `alternates` object's own shape and merging behavior, not assumed carried over).

### Exact shape

```ts
alternates: {
  canonical?: string | URL | { url: string | URL; title?: string };
  languages?: Record<string, string | URL | ...>;
  media?: Record<string, string | URL | ...>;
  types?: Record<string, string | URL | ...>;
}
```

Rendered as `<link rel="canonical" href="..." />`.

### `metadataBase` composition — confirmed directly applicable

This exact installed version's own `metadataBase` documentation example (re-read this turn, the identical section `docs/82` §5 already cited) uses `alternates.canonical` as its own **first** worked example: `alternates: { canonical: '/', ... }` composes against `metadataBase: new URL('https://acme.com')` to produce `<link rel="canonical" href="https://acme.com" />`. **A relative canonical value is fully supported and is the correct pattern to use here**, exactly mirroring how `openGraph.url`/`openGraph.images` already compose relative paths via the same, already-established `metadataBase` (Task 8.1).

### The load-bearing merging finding — `alternates` is a nested object field, subject to the identical "replace, not deep-merge" rule

Per the same general merging rule `docs/82`/`docs/83` already proved for `openGraph`/`twitter` — restated in this exact version's own docs as *"metadata with nested fields such as `openGraph` and `robots`... are overwritten by the last segment to define them"* (the word "such as" naming examples, not an exhaustive list) — `alternates` is subject to the identical rule. **This was empirically re-confirmed this turn, not merely reasoned about**: root's own `alternates.types` entry (the RSS auto-discovery link) is currently live on every real route purely via inheritance, since no route today defines its own `alternates` object at all. The moment any route defines its own `alternates.canonical`, that route's entire `alternates` object replaces root's — **silently dropping the RSS `types` entry for that specific route, unless the route's own object re-includes it.**

---

## 5. Canonical URL Scope — the Three-Way Distinction, Made Concrete

Restated exactly as this task's own truncated instruction framed it, now grounded in this repository's real, current code:

| Field | Answers | Current state | This task's scope |
|---|---|---|---|
| `metadataBase` | *What absolute origin should relative URL-based fields resolve against?* | Already set (Task 8.1), `new URL(SITE_URL)` | **Reused, not modified** |
| `openGraph.url` | *Which URL should this content be attributed to when shared socially?* | Already set per-route (Task 8.2) | **Reused, not modified** |
| `alternates.canonical` | *Which URL should search engines treat as authoritative for this content, when duplicates or variants exist?* | **Unset everywhere** | **This task's own scope** |

**Not conflated anywhere in this review**: every real route's `openGraph.url` and its future `alternates.canonical` will, in this site's own concrete case, hold the *identical string value* (both are simply "this page's own real URL," since no cross-page duplicate content exists, §8) — but they remain two different fields serving two different consumers (social crawlers vs. search-indexing crawlers), exactly as `docs/82` §13 already established for the `openGraph.url`/canonical boundary in the abstract. This review makes that boundary concrete rather than re-arguing it.

---

## 6. Duplicate-Content Investigation — Empirical, Not Assumed

Directly tested against a live production build this turn, not inferred from routing configuration alone:

| Scenario | Test | Result | Conclusion |
|---|---|---|---|
| Trailing slash | `GET /knowledge/idempotency/` | `308` redirect → `/knowledge/idempotency` | **Already handled structurally by Next's own routing** — no duplicate is ever served; canonical doesn't need to address this |
| Query-string / tracking parameters | `GET /knowledge/idempotency?ref=twitter&utm_source=x` | `200`, renders identically to the bare URL | **A real, live duplicate-content vector** — exactly what `alternates.canonical` exists to resolve |
| Case sensitivity | `GET /Knowledge/Idempotency` | `404` | **No duplicate exists** — routing is case-sensitive, nothing to canonicalize away |
| `next.config.ts` `trailingSlash` setting | Direct read | Unset (default) | Confirms the `308` behavior above is Next's own default, not a custom rule this repository added |

**The one real, demonstrated need canonical URLs serve in this repository is query-string consolidation** — not cross-page duplicate content (none was found anywhere, §7) and not path-shape duplication (already handled by routing itself).

---

## 7. Cross-Page Duplicate Content — Checked, None Found

Explicitly checked for any two real, distinct URLs serving substantively the same content:

- `/work` (Landing — featured case studies, architecture highlights) vs. `/work/library` (complete archive) — **not duplicates**: `work/library/page.tsx`'s own docstring already states the intended relationship directly (*"the Landing's Featured Case Studies and Project Library preview both exist to lead here, never to compete with it"*) — the Landing shows a curated subset with different framing, the Library shows the complete list; each is a genuinely different page, each should self-canonicalize, not cross-reference.
- `/knowledge/[topic]` vs. `/knowledge/[slug]` (article) — two branches of one route *file*, but semantically and content-wise distinct pages (a topic listing vs. a single article) — not duplicates, no cross-canonicalization needed.
- No other pair of real routes was found serving overlapping primary content anywhere in this site.

**Conclusion: every real, canonical-worthy page in this site canonicalizes to itself. No page in this repository needs to canonicalize to a *different* page's URL.**

---

## 8. Static Route Strategy

| Route | Canonical value | Notes |
|---|---|---|
| `/` | `"/"` | |
| `/knowledge` | `"/knowledge"` | |
| `/work` | `"/work"` | |
| `/work/library` | `"/work/library"` | |
| `/engineering-log` | `"/engineering-log"` | |
| `/about` | `"/about"` | |
| `/search` | `"/search"` (query-agnostic — evaluated in full, §11) | |
| 404 | **None** | Not a canonical URL — `sitemap.ts`'s own existing comment already states this exact reasoning; consistent, not reopened |

Every value: relative, composed via the already-existing `metadataBase` (§4).

---

## 9. Dynamic Route Strategy

| Route | Canonical value | Notes |
|---|---|---|
| `/knowledge/[topic]` (8 real) | `` `/knowledge/${slug}` `` | Self-referencing; distinct from the article branch's own URL space |
| `/knowledge/[slug]` (7 real articles) | `` `/knowledge/${slug}` `` | Identical string already used for `openGraph.url` (Task 8.2) — same value, two different fields |
| `/work/[slug]` (4 real case studies) | `` `/work/${slug}` `` | Same pattern |
| `/engineering-log/[slug]` (2 real) | `` `/engineering-log/${slug}` `` | Same pattern |
| Invalid slug (all three routes' own `return {}` fallback) | **None** | Falls through to root inheritance (§10) — root itself sets no canonical, so none renders, consistent with the page's own imminent `notFound()` call |

Every dynamic route's own canonical value is **exactly the same string** its `generateMetadata()` already computes for `openGraph.url` (Task 8.2) — no new URL-construction logic, a direct reuse of an already-proven expression.

---

## 10. Root-Level Canonical — Deliberately Absent

Root layout sets **no** `alternates.canonical` — consistent with every other per-page field this milestone has established (`title`/`description` at Task 8.1, `openGraph.title`/`.description`/`.url` at Task 8.2): there is no single URL that is correctly "the canonical URL" for every page site-wide; only a genuine per-document/per-route value is ever correct here. The invalid-slug fallback and 404 (§9, §12) correctly render with no canonical at all, rather than an incorrect, borrowed one — an honest absence, not a gap.

---

## 11. `/search` — Evaluated in Full

Per this task's own implicit charge to determine "search-engine preferred URL" precisely, and given `docs/82`/`docs/83` already established `/search` receives real `openGraph` metadata despite its `noindex` status (a "person sharing a link" justification, distinct from indexing):

- **`/search/page.tsx` uses static `export const metadata`, not `generateMetadata()`** — confirmed by direct re-read this turn. This is structurally significant: the page's metadata **cannot** vary by the actual `?q=` query string even if a future author wanted it to, since static metadata is resolved once, not per-request. A single, query-agnostic canonical value (`"/search"`) is therefore not a compromise — it's the only value the current architecture can produce, and it happens to be exactly correct: every `/search?q=...` variant, whatever the query, canonicalizes to the same bare `/search` URL, precisely consolidating the one real duplicate-content vector this review found (§6).
- **Does `/search` need a canonical at all, given it's already `noindex`?** A real, weighable question, not a reflexive "yes." `robots: { index: false }` already tells a compliant crawler not to index `/search` in search results under any query — canonical's own primary purpose (picking one URL among indexable variants) is largely moot once indexing itself is refused. **Recommendation: set it anyway, as low-cost defense-in-depth** — it costs one line, is trivially correct (per the point above), and protects against any future, accidental removal of the `noindex` directive leaving zero consolidation signal behind. This is not "adding it merely because it's technically possible" (the same caution `docs/82`'s own review already applied to `/search`'s OG fields) — it's a deliberate, reasoned choice with a stated justification, not decorative completeness.
- **`robots` is not modified** — the existing `{ index: false, follow: true }` field is unaffected by this recommendation, exactly as `docs/82`/`docs/83` already established for Open Graph.

---

## 12. 404 / Invalid Slug — No Canonical

`not-found.tsx` and every dynamic route's own invalid-slug `return {}` fallback receive no canonical anywhere in this review's own recommendation — directly consistent with `sitemap.ts`'s own already-written, pre-existing reasoning (*"404 (not a canonical URL)"*, `sitemap.ts` line 27, unchanged since Task 6.7) and with 404's own already-confirmed automatic `noindex` behavior (Task 8.1's own live-verified finding). A 404 response has no real page for a canonical URL to name — this is an honest absence, not a gap.

---

## 13. Draft Content

Restated precisely from `docs/80`/`docs/82`'s own already-established, unmodified finding, re-confirmed unchanged this turn (zero real draft documents exist anywhere in the current corpus): `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` remain not draft-filtered, so a draft document — were one to exist — would receive the same real, self-referencing canonical as a published document, with no distinguishing signal. This is the same already-documented, already-deliberate architecture Tasks 8.1 and 8.2 both found and explicitly declined to change; this review does not introduce draft-aware canonical handling either, for the identical reason (no real instance exists to justify the added complexity, and doing so was never named as part of this task's own scope).

---

## 14. Sitemap Consistency

`src/app/sitemap.ts` already lists, for every real document, exactly `` `${SITE_URL}/knowledge/${slug}` `` (and the equivalent for Work/Engineering Log) — an absolute URL built directly from `SITE_URL`, not via `metadataBase`. This review's own recommended canonical values (§9, relative paths composed via `metadataBase`) resolve to the **identical final absolute URL** as Sitemap's own entries, since both `SITE_URL` and `metadataBase`'s own underlying value are the same constant (`docs/81`/`docs/82`, unchanged). **No inconsistency exists or would be introduced** — confirmed by direct comparison of both construction paths, not assumed from them merely sharing a constant's name.

---

## 15. Metadata Merging Discipline — The Central Implementation Constraint

Restated as the binding rule for whichever task implements this review's own recommendation, per §4's own finding:

**Every route that adds `alternates.canonical` to its own metadata object must also repeat the RSS `types` entry in that same `alternates` object** — otherwise that specific route silently loses its RSS auto-discovery `<link>` tag, a real, live, currently-working feature (Task 6.6) that predates this entire Milestone 8 sequence. This mirrors exactly the discipline Task 8.2 already established (every route repeats `siteName`/`card` in its own `openGraph`/`twitter` objects) — not a new lesson, the same one, now generalizing to a third nested `Metadata` field.

**Concretely, this means**: every one of the 11 route files this review's own recommendation would touch needs `RSS_PATH`/`SITE_URL` (or the already-composed absolute RSS URL) available to construct `` `${SITE_URL}${RSS_PATH}` `` inside its own `alternates.types` — currently imported only by `layout.tsx`. This is named here as a concrete implementation dependency for the eventual plan to account for, not resolved by this document.

---

## 16. Performance

- **Static routes**: zero incremental cost — a plain string literal in an already-existing object.
- **Dynamic routes**: each `generateMetadata()` already computes the exact same URL string for `openGraph.url` (Task 8.2) — the canonical value is a direct reuse of that already-computed expression, not a new read or computation.
- **No new filesystem reads, no new external dependency, no new build-time computation.**
- **Build-time behavior**: no change expected beyond the same 33-page static/SSG classification already re-confirmed this turn.

**No caching or new infrastructure is proposed** — none is evidenced as needed.

---

## 17. Search / RSS / Sitemap Impact

- **Search**: `search.ts` reads `title`/`description`/`tags` directly from content, entirely independent of the `Metadata`/`alternates` surface. **No effect**, provided §15's own constraint is honored — if it is not, `/search` itself (among others) would lose its own RSS link, a real, testable regression this review's own release gate (a future task's own responsibility) must check for explicitly.
- **RSS**: `rss.ts`/`app/rss.xml/route.ts` build their own XML directly from frontmatter, unrelated to `<head>` metadata. **No effect** on the feed's own content; **at direct risk of a regression** on every *other* route's own RSS auto-discovery `<link>` tag if §15 is not honored — the single most important regression risk this review identifies (§20).
- **Sitemap**: unaffected, and independently confirmed consistent with this review's own recommended values (§14).

---

## 18. Exact Future Implementation Manifest

The smallest likely production footprint for the eventual canonical URL implementation (not built by this document):

| File | Why it would change | What must remain untouched |
|---|---|---|
| `src/app/page.tsx`, `about/page.tsx`, `knowledge/page.tsx`, `work/page.tsx`, `work/library/page.tsx`, `engineering-log/page.tsx`, `search/page.tsx` | Each adds `alternates: { canonical: "...", types: { "application/rss+xml": ... } }` (§8, §15) | Existing `title`/`description`/`openGraph`/`twitter` (`search/page.tsx`'s own `robots`, explicitly unmodified, §11) |
| `src/app/knowledge/[slug]/page.tsx`, `work/[slug]/page.tsx`, `engineering-log/[slug]/page.tsx` | Each branch's `generateMetadata()` return adds the identical `alternates` shape (§9) | Document loading, draft handling (§13), the `{}` fallback branch (§9, §12) |

**Not expected to be needed**: any new file, any new constant beyond what already exists (`SITE_NAME`/`SITE_URL`/`RSS_PATH`), any new abstraction — the RSS-repetition requirement (§15) is a real, small piece of repeated code across 10 files, not large enough to justify a shared helper on its own, consistent with every prior Milestone 8 task's own "no generic SEO abstraction" restraint. `not-found.tsx` — not modified, mirroring Task 8.2's own precedent of excluding it entirely (§12).

---

## 19. Release Gate (Design — for the Eventual Implementation, Not Executed Here)

Each criterion answerable **PASS / FAIL / NOT APPLICABLE**:

1. Every real, indexable route (§8, §9) renders exactly one `<link rel="canonical">`, matching its own real URL.
2. Every one of those same routes' RSS auto-discovery `<link rel="alternate" type="application/rss+xml">` remains present and correct — the single most important check this review names (§15, §17).
3. `/search` renders the same `<link rel="canonical" href=".../search">` regardless of `?q=` value.
4. `/search`'s `robots` remains exactly `{ index: false, follow: true }`.
5. 404 and an invalid dynamic slug render **no** `<link rel="canonical">` at all.
6. Every canonical URL resolves to an absolute URL matching `metadataBase`'s own resolved origin.
7. Every real document's canonical URL is byte-identical to its own `openGraph.url` value (§5) and to its own Sitemap entry (§14).
8. No `openGraph`/`twitter` field regresses (unaffected fields still present, per Task 8.2's own already-verified state).
9. No `og:image`/`twitter:image`/JSON-LD appears anywhere (still out of scope).
10. `pnpm exec eslint` / `pnpm exec tsc --noEmit` / `pnpm build` all clean, same 33-page classification.

---

## 20. Risks

| # | Risk | Verification |
|---|---|---|
| 1 | A route's own `alternates.canonical` silently drops the RSS `types` entry | The central finding of this review (§4, §15); gate item 2 |
| 2 | Canonical URL doesn't match `openGraph.url`/Sitemap for the same document | Gate item 7 |
| 3 | `/search`'s `robots` accidentally weakened while adding canonical | Gate item 4 |
| 4 | 404/invalid-slug accidentally gains a canonical it shouldn't have | Gate item 5 |
| 5 | A relative canonical path fails to compose against `metadataBase` | Already proven correct for `openGraph.url` (Task 8.2, live-verified); same mechanism |
| 6 | Draft content exposure | Unchanged, already-documented, already-deliberate (§13) — not newly introduced |
| 7 | Cross-page canonicalization introduced where none is warranted | §7 explicitly found zero cross-page duplicates; every recommended value is self-referencing |

---

## 21. Non-Goals

- No Structured Data / JSON-LD.
- No image optimization, no lazy-loading change.
- No Lighthouse work.
- No `robots.ts` (site-wide) — still not named in `docs/12`'s own deliverable list, still not decided.
- No content or frontmatter changes.
- No Search/RSS/Sitemap code changes — both files are read, verified consistent (§14, §17), never modified.
- No new site constant, no new metadata helper.
- No draft-aware canonical logic (§13).
- No cross-page canonicalization (§7).

---

## Final Recommendation

Build self-referencing `alternates.canonical` on every real, indexable route (§8, §9), reusing the exact URL string each route already computes for `openGraph.url`, composed via the already-existing `metadataBase`. The one binding implementation constraint this review's own research surfaces — and the reason this task could not simply copy Task 8.2's own pattern verbatim — is that every route touched must also repeat the RSS `types` entry in its own `alternates` object, or silently lose a real, working, pre-Milestone-8 feature (§4, §15). `/search` gets a static, query-agnostic canonical as deliberate, justified defense-in-depth alongside its unmodified `noindex` directive (§11). 404 and invalid slugs get none, consistent with `sitemap.ts`'s own pre-existing language (§12). No cross-page canonicalization exists anywhere in this recommendation, because none is evidenced (§7).

This review is grounded directly in the live repository (every claim re-verified this turn, including live HTTP tests for trailing-slash/query-string/case-sensitivity behavior) and in this exact installed Next.js version's own bundled documentation for every claim about `alternates`/`metadataBase`/merging semantics.

---

## Verification

```
git status --short
```

Confirmed:

```
 M src/app/about/page.tsx
 M src/app/engineering-log/[slug]/page.tsx
 M src/app/engineering-log/page.tsx
 M src/app/knowledge/[slug]/page.tsx
 M src/app/knowledge/page.tsx
 M src/app/layout.tsx
 M src/app/not-found.tsx
 M src/app/page.tsx
 M src/app/search/page.tsx
 M src/app/work/[slug]/page.tsx
 M src/app/work/library/page.tsx
 M src/app/work/page.tsx
?? docs/79-MILESTONE_8_ROADMAP_REVIEW.md
?? docs/80-METADATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
?? docs/81-METADATA_IMPLEMENTATION_PLAN.md
?? docs/82-OPEN_GRAPH_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
?? docs/83-OPEN_GRAPH_IMPLEMENTATION_PLAN.md
?? docs/84-CANONICAL_URLS_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
```

The 12 modified `src/app/` files are Tasks 8.1/8.2's own already-approved, already-implemented output — re-confirmed via `git diff --stat` showing zero additional change to any of them beyond what those two tasks produced. **Only `docs/84-CANONICAL_URLS_DISCOVERY_AND_ARCHITECTURE_REVIEW.md` is attributable to this task.**

---

## Final Report

1. **Discovery status**: complete; Tasks 8.1/8.2's baseline fully re-verified with zero discrepancy (§2).
2. **Current canonical situation**: zero implementation anywhere, confirmed exhaustively (§3).
3. **The central finding**: `alternates` is subject to the same "replace, not deep-merge" rule already proven for `openGraph`/`twitter` — every route adding canonical must repeat the RSS `types` entry or silently break a real, working feature (§4, §15).
4. **Duplicate-content evidence**: query-string variation is the one real, live vector (empirically confirmed); trailing-slash and case-sensitivity are already handled structurally; no cross-page duplicates found anywhere (§6, §7).
5. **Recommended architecture**: self-referencing canonical everywhere, reusing each route's own already-computed `openGraph.url` string, composed via the already-existing `metadataBase` (§5, §8, §9).
6. **`/search`**: static, query-agnostic canonical as deliberate defense-in-depth alongside its unmodified `noindex` (§11).
7. **404/invalid slug**: no canonical, consistent with `sitemap.ts`'s own pre-existing language (§12).
8. **Exact future implementation manifest**: 10 files (all static routes except none excluded, plus 3 dynamic routes), zero new files, zero new abstractions (§18).
9. **Release gate**: 10 concrete, PASS/FAIL/NOT-APPLICABLE criteria (§19).
10. **Risks**: 7 named, each with a concrete verification (§20).
11. **Non-goals**: 9 restated, none overridden (§21).
12. **Git verification**: confirmed via `git status --short`; only `docs/84` attributable to this task; Tasks 8.1/8.2's own 12-file diff independently re-confirmed unchanged.

**APPROVED — Canonical URLs discovery and architecture review is complete and ready for implementation planning.**
