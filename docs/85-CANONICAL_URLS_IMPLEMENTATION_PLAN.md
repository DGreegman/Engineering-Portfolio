# 85 — Task 8.3 (Canonical URLs): Implementation Plan

## 1. Executive Summary

`docs/84-CANONICAL_URLS_DISCOVERY_AND_ARCHITECTURE_REVIEW.md`'s architecture is re-verified exactly against the live repository this turn (§2) — **zero discrepancy found on any of its findings.** This plan converts that review into a deterministic, file-exact specification: self-referencing `alternates.canonical` on every real, indexable route, reusing each route's own already-computed `openGraph.url` expression, with the RSS `alternates.types` entry explicitly repeated on every touched file to prevent the "replace, not deep-merge" regression `docs/84` §4/§15 identified as this task's own central risk.

**No implementation is authorized by this document.**

---

## 2. Live Repository Re-Verification

Every item `docs/84` depends on was re-inspected directly this turn, not trusted from that document:

| Item | Verified state | Matches `docs/84`? |
|---|---|---|
| `SITE_URL`, `SITE_NAME`, `RSS_PATH` (`site.ts`) | Unchanged, byte-identical | Yes |
| Root `metadataBase` | `new URL(SITE_URL)`, unchanged | Yes |
| Root `title` template | Unchanged | Yes |
| Root `openGraph`/`twitter` | `{ siteName, locale: "en_US", type: "website" }` / `{ card: "summary_large_image" }`, unchanged | Yes |
| Root `alternates.types` (RSS) | `{ "application/rss+xml": \`${SITE_URL}${RSS_PATH}\` }`, unchanged — the one entry this task must not lose on any route | Yes |
| Every static route's `openGraph.url` | Present, matches its own route path exactly (`/`, `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`, `/search`) | Yes |
| All three dynamic routes' `generateMetadata()` | Each computes `openGraph.url` as a template literal (`` `/knowledge/${slug}` ``, etc.) already in scope at the `return` statement — directly reusable, re-read in full this turn | Yes |
| `/search`'s `robots` | `{ index: false, follow: true }`, unchanged, positioned before `openGraph`/`twitter` in the object | Yes |
| `not-found.tsx` | `{ title: "Page Not Found", description: "..." }` only — no `openGraph`/`twitter`/`alternates` of its own, confirmed still absent | Yes |
| `sitemap.ts` `STATIC_PATHS` | `["/", "/knowledge", "/work", "/work/library", "/engineering-log", "/about"]` — **`/search` is not in this list**, a precise fact this plan's own §10 depends on | Yes, and clarifies `docs/84` §14 precisely (§10 below) |
| `sitemap.ts` topic/content entries | `TOPIC_SLUGS.map(...)`, `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` — all draft-filtered, all `${SITE_URL}/...` | Yes |
| `next.config.ts` | Empty (`{/* config options here */}`) — no `trailingSlash` setting | Yes |
| Trailing slash | `GET /knowledge/idempotency/` → `308` → `/knowledge/idempotency` | Yes |
| Query string | `GET /knowledge/idempotency?utm_source=test` → `200`, same content | Yes |
| Case variation | `GET /Knowledge/Idempotency` → `404` | Yes |
| RSS `<link>` presence | Confirmed live on `/`, `/knowledge/idempotency`, and `/search` alike, all via pure root inheritance | Yes |
| Draft content | Zero real draft documents anywhere; `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` remain not draft-filtered (unchanged) | Yes |
| `pnpm build` | Clean, same 33-page static/SSG classification | Yes |

**No discrepancy found anywhere. This plan proceeds on `docs/84`'s own architecture exactly as approved.**

---

## 3. Discovery Findings Reconciled

All of `docs/84`'s findings are treated as binding, per §2's own confirmation, with one clarification volunteered rather than left implicit: `docs/84` §14 states canonical URLs "resolve consistently with" Sitemap entries "for all relevant indexable routes." Re-verification (§2) shows `/search` is **not** one of Sitemap's own entries (`STATIC_PATHS` excludes it, consistent with its `noindex` status) — so `/search`'s own canonical has no Sitemap counterpart to agree with, and this plan's own consistency check (§10, §18) is scoped to the 6 static + topic + content routes Sitemap actually lists, not `/search`. This is a precision, not a contradiction of `docs/84`.

---

## 4. Architecture Decision

**Self-referencing `alternates.canonical` on every real, indexable route, each object also repeating the RSS `types` entry.** No cross-page canonicalization anywhere (`docs/84` §7 found none warranted; re-confirmed, nothing in the live repository contradicts that finding). No new URL-construction logic: every route's already-existing `openGraph.url` expression is reused verbatim for `alternates.canonical`'s own value.

**Why repetition, not a shared helper**: the RSS entry is one line, needed in exactly 10 files (§14), each already touched by this task for the canonical field itself — introducing a helper function to avoid re-typing one object literal would be exactly the "unnecessary abstraction" `docs/84` §18/§21 and this task's own §16 explicitly rule out. This mirrors the identical, already-approved precedent Task 8.2 set for `siteName`/`card` repetition across every route's `openGraph`/`twitter` object.

---

## 5. Route-by-Route Canonical Strategy

| Route | File | Canonical value | Basis |
|---|---|---|---|
| `/` | `page.tsx` | `"/"` | Matches existing `openGraph.url` |
| `/knowledge` | `knowledge/page.tsx` | `"/knowledge"` | Same |
| `/work` | `work/page.tsx` | `"/work"` | Same |
| `/work/library` | `work/library/page.tsx` | `"/work/library"` | Same |
| `/engineering-log` | `engineering-log/page.tsx` | `"/engineering-log"` | Same |
| `/about` | `about/page.tsx` | `"/about"` | Same |
| `/search` (query-agnostic) | `search/page.tsx` | `"/search"` | Same; static metadata cannot vary by `?q=`, which is exactly correct for consolidating every query variant (§9) |
| `/knowledge/[topic]` (8 real) | `knowledge/[slug]/page.tsx`, topic branch | `` `/knowledge/${slug}` `` | Matches this branch's own existing `openGraph.url` |
| `/knowledge/[slug]` (7 real articles) | Same file, article branch | `` `/knowledge/${slug}` `` | Matches this branch's own existing `openGraph.url` |
| `/work/[slug]` (4 real case studies) | `work/[slug]/page.tsx` | `` `/work/${slug}` `` | Matches existing `openGraph.url` |
| `/engineering-log/[slug]` (2 real) | `engineering-log/[slug]/page.tsx` | `` `/engineering-log/${slug}` `` | Matches existing `openGraph.url` |
| Invalid slug (all three dynamic routes' `return {}` fallback) | Same three files | **None** | Falls through to root inheritance; root sets no canonical (§4, mirrors `docs/84` §9/§12) |
| 404 (`not-found.tsx`) | Not modified | **None** | `sitemap.ts`'s own pre-existing "404 (not a canonical URL)" comment; consistent, not reopened |

No other public static route exists — re-confirmed by direct listing of `src/app/` this turn (§2); nothing beyond the 7 static + 3 dynamic route families is proposed.

---

## 6. Metadata Inheritance / RSS Preservation Strategy

**Binding rule, per `docs/84` §4/§15, re-verified empirically this turn (§2)**: `alternates` is a nested `Metadata` field, replaced wholesale (not deep-merged) the instant a route defines its own. **Every file this plan touches gains an `alternates` object shaped exactly as:**

```ts
alternates: {
  canonical: "<route-specific value, per §5>",
  types: {
    "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
  },
},
```

**`RSS_PATH` must be imported into every touched file that doesn't already import it** — currently imported only by `layout.tsx` (confirmed §2). `SITE_NAME` is already imported into all 10 files this plan touches (Task 8.2's own work); `SITE_URL` is **not** currently imported into any of the 7 static route files or `search/page.tsx` (only `layout.tsx`, `sitemap.ts`, and `rss.xml/route.ts` import it today) — each of the 10 files in §14 needs both `SITE_URL` and `RSS_PATH` added to its existing `@/lib/constants/site` import line.

---

## 7. URL Construction Strategy

Confirmed per §2: every route this plan touches already computes the exact string this task needs, as `openGraph.url`. **No second URL-building algorithm is introduced.** Concretely:

- Static routes: the literal string already passed to `openGraph.url` (e.g. `"/knowledge"`) is copied verbatim into `alternates.canonical`.
- Dynamic routes: the same `` `/knowledge/${slug}` `` (etc.) expression already computed for `openGraph.url` is referenced a second time for `alternates.canonical` — not recomputed, not extracted into a new shared variable beyond what already exists (the existing `title`/`url`-shaped locals already in scope at each `return` statement, per Task 8.2's own established pattern).

Reuse is technically straightforward everywhere — no case was found (§2) where the existing function structure prevents it, so no "smallest justified alternative" is needed.

---

## 8. Query Parameter Strategy

Per `docs/84` §6 (re-verified live, §2): query-string variants (e.g. `?utm_source=test`) render identical content and receive a `200`, the one real duplicate-content vector in this site. **Canonicalization, not redirection, is the approved mechanism** (per this task's own explicit instruction, §7 of the prompt). Every dynamic route's `generateMetadata()` reads only `params` (the slug), never `searchParams` — so its own computed canonical value is already, structurally, query-string-free; no stripping logic is needed anywhere, because the value was never query-string-aware to begin with. **No middleware, redirect, or query validation is proposed or required.**

---

## 9. `/search` Strategy

Re-confirmed (§2): `search/page.tsx` uses static `export const metadata`, not `generateMetadata()` — structurally incapable of varying by `?q=` even if a future change wanted it to. A single canonical value, `"/search"`, therefore correctly consolidates every `/search?q=...` variant by construction, not by any special-cased logic. **`robots: { index: false, follow: true }` is read, never modified** — it remains positioned exactly where it already is in the object, with `openGraph`/`twitter`/the new `alternates` block added after it, mirroring Task 8.2's own already-established file shape exactly (confirmed §2).

---

## 10. Sitemap Consistency

`sitemap.ts` is **not modified**. Verification (a future implementation's own responsibility, §17) is a direct string comparison: for every route Sitemap actually lists (`STATIC_PATHS`'s 6 entries, the 8 topic entries, and every real Knowledge/Work/Engineering-Log document), the corresponding route's own new `alternates.canonical` value, once resolved through `metadataBase`, must equal that same URL Sitemap already emits via `${SITE_URL}${path}`. **`/search` is correctly excluded from this comparison** (§3) — it has no Sitemap entry to agree with, and this plan does not manufacture one or treat its absence as a defect.

---

## 11. RSS Consistency

`rss.ts`/`app/rss.xml/route.ts` are **not modified**. The only RSS-relevant surface this plan touches is each route's own `alternates.types` entry (§6) — verification is a direct check that the RSS `<link rel="alternate" type="application/rss+xml">` tag remains present, with the identical `href` value, on every route this plan modifies, both before and after the change (a regression test, not a new behavior).

---

## 12. Draft / Publication Behavior

Re-confirmed (§2): zero real draft documents exist anywhere; `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` remain not draft-filtered, exactly as Tasks 8.1/8.2 already found and declined to change. **This plan introduces no draft-aware canonical logic.** Were a draft document to exist, it would receive the identical self-referencing canonical a published document gets — the same already-documented, already-deliberate architecture this entire Milestone 8 sequence has consistently left untouched, for the identical reason each prior task gave (no real instance exists to justify the added complexity, and it was never named as this task's own scope).

---

## 13. 404 Behavior

`not-found.tsx` is **not modified** (§5, §15). Verification (§17) confirms no `<link rel="canonical">` is emitted on an actual `404`-status response, and that an invalid dynamic slug (which resolves via each route's own `return {}` fallback, then a separate `notFound()` call in the page body) likewise emits none — both cases fall through to root's own canonical-less state, an honest absence, not a defect to correct within this task's own scope.

---

## 14. Exact Implementation Manifest

| # | Path | Why it changes | Exact responsibility | Expected metadata behavior | Static or dynamic? | RSS inheritance preserved how | Canonical/OG URL consistency |
|---|---|---|---|---|---|---|---|
| 1 | `src/app/page.tsx` | Add canonical for `/` | Add `alternates: { canonical: "/", types: {...} }` to the existing `metadata` object | `<link rel="canonical" href=".../">`, RSS `<link>` unchanged | Static | `types` entry repeated verbatim (§6) | `"/"` matches existing `openGraph.url` exactly |
| 2 | `src/app/about/page.tsx` | Add canonical for `/about` | Same shape, `canonical: "/about"` | Same pattern | Static | Repeated | Matches existing `openGraph.url` |
| 3 | `src/app/knowledge/page.tsx` | Add canonical for `/knowledge` | Same shape, `canonical: "/knowledge"` | Same pattern | Static | Repeated | Matches existing `openGraph.url` |
| 4 | `src/app/work/page.tsx` | Add canonical for `/work` | Same shape, `canonical: "/work"` | Same pattern | Static | Repeated | Matches existing `openGraph.url` |
| 5 | `src/app/work/library/page.tsx` | Add canonical for `/work/library` | Same shape, `canonical: "/work/library"` | Same pattern | Static | Repeated | Matches existing `openGraph.url` |
| 6 | `src/app/engineering-log/page.tsx` | Add canonical for `/engineering-log` | Same shape, `canonical: "/engineering-log"` | Same pattern | Static | Repeated | Matches existing `openGraph.url` |
| 7 | `src/app/search/page.tsx` | Add query-agnostic canonical for `/search` | Add `alternates` block **after** the existing `robots` field, same shape, `canonical: "/search"` | `<link rel="canonical" href=".../search">` regardless of `?q=`; `robots` unchanged | Static | Repeated | Matches existing `openGraph.url` |
| 8 | `src/app/knowledge/[slug]/page.tsx` | Add canonical to both `generateMetadata()` branches | Topic branch: `canonical: \`/knowledge/${slug}\`` (website-typed); article branch: same value (article-typed) | Both branches emit a correct, distinct-per-document canonical; `{}` fallback branch untouched | Dynamic (`generateMetadata`) | Repeated in both branches | Matches each branch's own existing `openGraph.url` |
| 9 | `src/app/work/[slug]/page.tsx` | Add canonical to `generateMetadata()` | `canonical: \`/work/${slug}\`` | Correct per-document canonical; `{}` fallback untouched | Dynamic | Repeated | Matches existing `openGraph.url` |
| 10 | `src/app/engineering-log/[slug]/page.tsx` | Add canonical to `generateMetadata()` | `canonical: \`/engineering-log/${slug}\`` | Correct per-document canonical; `{}` fallback untouched | Dynamic | Repeated | Matches existing `openGraph.url` |

**Exactly 10 files. No eleventh file.**

---

## 15. Files Explicitly Not Changing

- `src/app/layout.tsx` — root sets no canonical (§4); its own `alternates.types` stays exactly as-is, the value every touched file's own repeated entry must match.
- `src/app/not-found.tsx` — §13.
- `src/app/sitemap.ts` — §10; read only, for verification.
- `src/app/rss.xml/route.ts`, `src/lib/content/rss.ts` — §11; read only, for verification.
- `src/lib/content/schema.ts` and every resolver file (`relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `articles.ts`, `case-studies.ts`) — no data model or resolution logic is touched.
- `next.config.ts` — no trailing-slash, redirect, or rewrite configuration is added (§2, confirmed empty and staying that way).
- `src/lib/constants/site.ts` — `SITE_URL`/`SITE_NAME`/`RSS_PATH` are read, not modified, added, or renamed.
- Any `content/*.mdx` file — no frontmatter change.
- Any component under `src/components/` — this task's entire scope is `<head>`-level metadata.
- `src/lib/content/search.ts` — Search is unaffected and unmodified.

---

## 16. Implementation Sequence

1. Re-verify this plan's own contract against the live repository at authoring time (mirrors §2).
2. Root metadata/RSS inheritance strategy — confirmed unchanged, no edit (§4, §6, §15).
3. Static route metadata — files 1–7 (§14), each gaining `alternates`.
4. Knowledge metadata — file 8, both branches.
5. Work metadata — file 9.
6. Engineering Log metadata — file 10.
7. `/search` — file 7 (sequenced with the static routes, called out separately per this task's own instruction, §5, §9).
8. No shared helper — proven unnecessary (§4); this step is a deliberate no-op.
9. Production build (`pnpm build`).
10. Generated HTML verification — every route's rendered `<link rel="canonical">`.
11. RSS verification — every touched route's RSS `<link>` still present.
12. Sitemap/canonical consistency verification (§10).
13. Query-string canonical verification (§8) — at least one real Knowledge slug, at least one other collection.
14. `git diff`/`git status` review against the exact 10-file manifest (§14).

**No step in this sequence is executed by this document.**

---

## 17. Verification Plan

### Static analysis
- `pnpm exec eslint` — clean.
- `pnpm exec tsc --noEmit` — clean.

### Production build
- `pnpm build` — clean, same 33-page static/SSG classification already re-confirmed this turn (§2).

### Production HTML verification (not source inspection alone)
For every route in the matrix below, inspect the actual rendered HTML for:
- Exactly one `<link rel="canonical">`, no duplicates.
- `href` absolute (resolved via `metadataBase`).
- `href` matches the normalized production URL form (no trailing slash, no query string) — confirmed against §2's own live-tested trailing-slash/query-string behavior.
- `openGraph:url` (`<meta property="og:url">`) unchanged and matching the canonical value.
- RSS `<link rel="alternate" type="application/rss+xml">` still present, unchanged `href`.
- No unintended second canonical tag from any parent/child metadata interaction.

### Route matrix
`/`, `/knowledge`, a real Knowledge article, `/work`, `/work/library`, a real Work case study, `/engineering-log`, a real Engineering Log entry, `/search`, an invalid dynamic slug (404 path), and the bare 404 (`/this-route-does-not-exist`).

### Query-string test
`GET /knowledge/idempotency?utm_source=test` — canonical must equal the canonical rendered by `GET /knowledge/idempotency`. Repeat for one Work case study (e.g. `/work/vaultpay?ref=x`) and one Engineering Log entry.

### RSS regression
Re-run the same check §11 defines, on the full route matrix above, both before (already confirmed §2) and after implementation.

### Sitemap consistency
For every Sitemap-listed URL (§10), confirm the corresponding route's own rendered canonical resolves to the identical absolute URL. `sitemap.ts` itself is not modified.

### Git hygiene
```
git status --short
git diff --stat
git diff
```
Confirm only the 10 files in §14 changed, each diff matching this plan's own specification exactly.

---

## 18. Release Gate

Each criterion answerable **PASS / FAIL / NOT APPLICABLE**:

1. Every route in §5's own "canonical value" rows renders exactly the specified `<link rel="canonical">`.
2. Query-string variants (§8) resolve to the identical canonical as their bare-URL counterpart, verified for Knowledge, Work, and Engineering Log.
3. Every canonical URL uses the normalized production form — absolute, no trailing slash, no query string.
4. Every canonical URL agrees with its Sitemap counterpart, where one exists (§10).
5. `openGraph.url` remains correct and unchanged on every route (regression check against Task 8.2's own already-verified state).
6. RSS auto-discovery remains intact on every touched route (§11) — the single most important check this plan inherits from `docs/84`.
7. No metadata field is lost through `alternates` replacement anywhere — specifically, no route loses its RSS `types` entry.
8. `/search` retains its exact existing `robots: { index: false, follow: true }`.
9. 404 and every invalid-slug case render no canonical tag at all (§13).
10. `pnpm exec eslint` clean.
11. `pnpm exec tsc --noEmit` clean.
12. `pnpm build` clean, same 33-page classification.
13. Production HTML verification (§17) passes for the full route matrix.
14. `git diff --stat` shows exactly the 10 files in §14, no others.
15. No unrelated scope (Structured Data, images, robots.ts, redirects, middleware, Search/RSS/Sitemap code) appears anywhere in the diff.

---

## 19. Risks

| # | Risk | Verification |
|---|---|---|
| 1 | `alternates` replacement drops the RSS `types` entry on a touched route | The central, named risk (§6); gate items 6–7 |
| 2 | Canonical and Open Graph URL values diverge on the same route | Every canonical value is a direct copy of the already-verified `openGraph.url` expression (§7); gate item 5 |
| 3 | A query parameter accidentally leaks into a canonical value | Structurally impossible — no dynamic route reads `searchParams` in `generateMetadata()` (§8); gate item 2 |
| 4 | Static vs. dynamic routes handled inconsistently | §5's own table specifies both categories against the identical `alternates` shape (§6) |
| 5 | Canonical URLs disagree with Sitemap URLs | Gate item 4; `/search`'s own correct exclusion from this check is stated explicitly (§3, §10), not a silent gap |
| 6 | Accidental change to `/search`'s `robots` or indexing behavior | `robots` is positioned before, and untouched by, the new `alternates` block (§9); gate item 8 |
| 7 | Canonical metadata emitted for a 404/nonexistent resource | `not-found.tsx` and the `{}` fallback branches are explicitly excluded from this plan's own manifest (§13, §15); gate item 9 |
| 8 | Unnecessary abstraction or scope expansion (e.g., a URL-building helper, a new constant) | §4 states explicitly why none is introduced; §16's own step 8 is a deliberate no-op, not an oversight |

---

## 20. Rollback

Limited strictly to the 10 files in §14 — each change is additive (one new `alternates` field plus, where needed, one new import line), fully reversible by reverting exactly those 10 files to their pre-Task-8.3 state (i.e., their Task 8.2 state, already committed/known-good). **No rollback of Task 8.1 (Metadata) or Task 8.2 (Open Graph) is proposed or implied** — neither is touched by this plan, and neither needs to be touched to undo Task 8.3 specifically.

---

## 21. Non-Goals

Restated exactly as this task's own instruction requires, none overridden by anything found in re-verification (§2):

Structured Data, JSON-LD, images, Open Graph images, image optimization, lazy loading, Lighthouse optimization, robots changes (beyond leaving `/search`'s existing field untouched), Sitemap changes, RSS implementation changes, Search implementation changes, content changes, frontmatter changes, route restructuring, redirects, middleware, URL rewriting, trailing-slash configuration changes, case normalization, analytics, and any unrelated refactoring.

---

## 22. Final Recommendation

Implement self-referencing `alternates.canonical` on the 10 files named in §14, each reusing its own already-computed `openGraph.url` value and each explicitly repeating the RSS `types` entry to prevent the one concrete, empirically-confirmed regression this task's own research identified. No cross-page canonicalization, no query-string handling beyond the structural fact that no dynamic route's metadata ever reads `searchParams`, no changes to Sitemap, RSS, robots, or Search. This plan is grounded in a full re-verification of the live repository this turn (§2) — zero discrepancy against `docs/84` was found anywhere.

**No implementation is authorized by this document.**

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
?? docs/85-CANONICAL_URLS_IMPLEMENTATION_PLAN.md
```

The 12 modified `src/app/` files are Tasks 8.1/8.2's own already-approved, already-implemented output — `git diff --stat` re-confirmed this turn shows zero additional change beyond what those two tasks produced. **Only `docs/85-CANONICAL_URLS_IMPLEMENTATION_PLAN.md` is attributable to this task.**
