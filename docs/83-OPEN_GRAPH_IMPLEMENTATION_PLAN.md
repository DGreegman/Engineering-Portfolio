# 83 — Task 8.2 (Open Graph): Implementation Plan

## Status

Implementation Plan — translating `docs/82-OPEN_GRAPH_DISCOVERY_AND_ARCHITECTURE_REVIEW.md`'s approved architecture into an exact, dependency-ordered, buildable specification.

> This document authorizes no implementation. No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce it.

Task 8.2's implementation-planning turn, following Task 8.1 (Metadata), complete and approved (`docs/81`).

---

## 1. Executive Implementation Recommendation

`docs/82`'s architecture review is re-verified exactly against the live repository this turn (§2) — zero drift on any of its 18 approved findings. This plan resolves the two design choices `docs/82` itself left open for an implementation-planning stage to decide: (1) whether `openGraph.title` should mirror the visible `<title>` fragment exactly or use a shorter, bare document title — resolved in favor of **exact mirroring**, per `docs/82` §12's own governing instruction to "prefer consistency unless there is evidence for divergence" (no such evidence was found); (2) whether `not-found.tsx` needs its own explicit Open Graph object — resolved as **no**, since it correctly and fully inherits root's own minimal defaults, reducing this implementation's own file manifest by one file below what `docs/82` §22 conservatively estimated.

**Conclusion: APPROVED — Open Graph implementation plan is ready for building.**

---

## 2. Authoritative Source Documents — Read, Re-Verified

Read in full: `docs/82`, `docs/81`, `docs/80`. Re-inspected directly this turn: `src/app/layout.tsx`, every route's current metadata (post-Task-8.1), all three `generateMetadata()` functions, `src/lib/constants/site.ts`, all 13 real content documents' image inventory, `package.json`'s `next` version, and `node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts`.

**Re-verification result — all 18 approved discovery findings hold, zero drift**:

- `SITE_NAME`/`SITE_URL`/`metadataBase`/root title template — byte-identical to `docs/81`'s own delivered state.
- Every route's current title (post-Task-8.1 fragment shape) — re-confirmed unchanged (`"About"`, `"Knowledge"`, `"Work"`, `"Case Study Library"`, `"Engineering Log"`, `"Search"`, `"Page Not Found"`, and the three dynamic routes' own `` `${x} — [Section]` `` fragments).
- Zero `openGraph`/`twitter` field anywhere in `src/` — re-confirmed by direct grep this turn.
- All 13 real documents re-checked individually for `coverImage`/inline MDX images — zero found in either, matching `docs/82` §3/§10 exactly.
- Next.js `16.3.0` — unchanged; `opengraph-types.d.ts` re-read this turn, confirms `OpenGraphArticle`'s `tags`/`section`/`publishedTime`/`modifiedTime` fields exactly as `docs/82` §5 cited.
- `frontmatter.publishedAt`/`.updatedAt` are real `Date` objects at runtime (`z.coerce.date()`, `schema.ts`) — a precise detail `docs/82` didn't need but this plan does (§7): `openGraph.publishedTime`/`.modifiedTime` require `string`, so each needs `.toISOString()`, the same native-`Date`-method discipline `rss.ts`'s own `toUTCString()` already establishes for RFC 822 — no new dependency, matching existing precedent.

**No discrepancy found. Nothing in this plan implements around a stale assumption.**

---

## 3. Root Open Graph Metadata

**Exact contract**:

```ts
openGraph: {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
},
twitter: {
  card: "summary_large_image",
},
```

**Why only these three `openGraph` fields, and one `twitter` field, at root** — traced against `docs/82` §5/§14's own merging finding, not assumed: `siteName`/`locale` are the only two values genuinely true and unchanging for the entire site, with no per-route reason to differ. `type` is set at root as `website` — the correct default for the majority of routes (§4), and a required, non-optional discriminant on Next's own `OpenGraph` union type (`opengraph-types.d.ts` — `type` has no optional variant), so a root value must exist for the one case that actually consumes it (below). `title`/`description`/`url`/`images` are **not** set at root — no single value is a defensible default for a specific document, mirroring the identical reasoning `docs/81` already applied to the plain `description` field.

**Root defaults vs. detail-page complete objects — the architecture stated precisely**: because Next's own metadata merging **replaces** (not deep-merges) a child's `openGraph`/`twitter` object the moment a child defines either at all (`docs/82` §5, re-verified §2), **every route in this plan that needs its own `title`/`description`/`url`/`type` defines a complete `openGraph` object of its own, including `siteName`, even though `siteName` is also set at root.** Root's own three-field object is consumed, in full, by exactly two cases: (1) the invalid-slug fallback branch on all three dynamic routes (`return {}` → no `openGraph` override → full inheritance), and (2) `not-found.tsx`, which this plan deliberately does not give its own `openGraph`/`twitter` object (§9) — both receive `{ siteName: "Gracious Obeagu", locale: "en_US", type: "website" }` and `{ card: "summary_large_image" }`, an honest, minimal, non-empty state, not a broken one.

---

## 4. Exact Title/Description Decision — Resolved

Per `docs/82` §12's own explicit instruction ("prefer consistency unless there is evidence for divergence; do not rewrite copy merely for SEO") and this task's own charge to resolve what discovery left open: **`openGraph.title` and `twitter.title` use the exact same string expression already used for that route's own `title` field; `openGraph.description`/`twitter.description` use the exact same value as that route's own `description` field.** No new copy is authored anywhere in this plan. Applied precisely per route in §5–§7.

---

## 5. Static Route Strategy

| Route | File | `openGraph.title` | `type` | `url` | Complete object? |
|---|---|---|---|---|---|
| `/` | `page.tsx` | `` `${SITE_NAME} — Engineering Workspace` `` (matches `title.absolute`) | `website` | `"/"` | Yes |
| `/knowledge` | `knowledge/page.tsx` | `"Knowledge"` | `website` | `"/knowledge"` | Yes |
| `/work` | `work/page.tsx` | `"Work"` | `website` | `"/work"` | Yes |
| `/work/library` | `work/library/page.tsx` | `"Case Study Library"` | `website` | `"/work/library"` | Yes |
| `/engineering-log` | `engineering-log/page.tsx` | `"Engineering Log"` | `website` | `"/engineering-log"` | Yes |
| `/about` | `about/page.tsx` | `"About"` | `website` | `"/about"` | Yes |
| `/search` | `search/page.tsx` | `"Search"` | `website` | `"/search"` | Yes — `robots` untouched (§10) |
| 404 | `not-found.tsx` | — | — | — | **No — not modified (§9), inherits root's minimal defaults** |

**`/search`, decided precisely**: given its own real, already-approved `title`/`description` (Task 8.1) and `docs/82` §16's own reasoning (a person directly sharing a `/search` link should see an accurate preview, distinct from whether *search engines* index it), `/search` receives the identical complete-object treatment every other static route gets. This is not "adding social metadata merely because it technically can" — it mirrors metadata that already exists and is already approved; the one thing this plan does **not** do is touch `robots: { index: false, follow: true }`, confirmed untouched in every code sample below.

**Exact code, each file** (each static route's own file gets a local `const description` above `metadata`, avoiding a triple-literal inside one file — not a cross-file abstraction, purely local hygiene within the single file already holding that string):

```ts
// src/app/page.tsx — conceptual diff, no implementation authorized by this document
const description =
  "An engineering workspace: documented case studies, reusable engineering knowledge, and the trade-offs behind real backend systems.";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} — Engineering Workspace` },
  description,
  openGraph: {
    title: `${SITE_NAME} — Engineering Workspace`,
    description,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Engineering Workspace`,
    description,
  },
};
```

```ts
// src/app/knowledge/page.tsx (and identically shaped for work/page.tsx,
// work/library/page.tsx, engineering-log/page.tsx, about/page.tsx,
// search/page.tsx — title/url/description substituted per §5's own table;
// search/page.tsx's existing `robots` field is appended, unmodified)
const description = "A long-term collection of engineering concepts, ...";

export const metadata: Metadata = {
  title: "Knowledge",
  description,
  openGraph: {
    title: "Knowledge",
    description,
    url: "/knowledge",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Knowledge",
    description,
  },
};
```

---

## 6. Dynamic Knowledge Route — `/knowledge/[slug]`

Both branches of the existing `generateMetadata()` (topic, article) — exact mapping, per this task's own specified contract, verified against real frontmatter shapes this turn:

```text
Topic branch (website-typed — a topic page is a listing, not a single document, docs/82 §11):
  topic.title        → openGraph.title, twitter.title      (matches existing title field exactly)
  topic.description  → openGraph.description, twitter.description
  SITE_NAME           → openGraph.siteName
  `/knowledge/${slug}` → openGraph.url
  "website"           → openGraph.type

Article branch (article-typed):
  frontmatter.title                    → openGraph.title, twitter.title   (matches existing title field exactly, incl. "— Knowledge" suffix)
  frontmatter.description              → openGraph.description, twitter.description
  SITE_NAME                             → openGraph.siteName
  `/knowledge/${slug}`                  → openGraph.url
  "article"                             → openGraph.type
  frontmatter.tags                      → openGraph.tags
  frontmatter.topic                     → openGraph.section
  frontmatter.publishedAt.toISOString() → openGraph.publishedTime
  frontmatter.updatedAt?.toISOString()  → openGraph.modifiedTime (only if set — currently 0 of 7 real articles set updatedAt, so this resolves to undefined for every real document today, an honest, expected absence, not a defect)
```

```ts
// Conceptual shape — no implementation authorized by this document.
const topic = resolveTopic(slug);
if (topic) {
  return {
    title: `${topic.title} — Knowledge`,
    description: topic.description,
    openGraph: {
      title: `${topic.title} — Knowledge`,
      description: topic.description,
      url: `/knowledge/${slug}`,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} — Knowledge`,
      description: topic.description,
    },
  };
}

if (articleExists(slug)) {
  const { frontmatter } = getArticleBySlug(slug);
  const title = `${frontmatter.title} — Knowledge`;
  return {
    title,
    description: frontmatter.description,
    openGraph: {
      title,
      description: frontmatter.description,
      url: `/knowledge/${slug}`,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: frontmatter.publishedAt.toISOString(),
      modifiedTime: frontmatter.updatedAt?.toISOString(),
      tags: frontmatter.tags,
      section: frontmatter.topic,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: frontmatter.description,
    },
  };
}
```

**Missing/invalid slug**: `return {}` — unmodified. Falls through to root's own minimal `openGraph`/`twitter` defaults (§3), the same behavior Task 8.1 already proved live for the plain `title`/`description` fields.

---

## 7. Dynamic Work Route — `/work/[slug]`

```text
frontmatter.title                    → openGraph.title, twitter.title   (matches existing title field exactly, incl. "— Work" suffix)
frontmatter.description              → openGraph.description, twitter.description
SITE_NAME                             → openGraph.siteName
`/work/${slug}`                       → openGraph.url
"article"                             → openGraph.type
frontmatter.tags                      → openGraph.tags
frontmatter.domain                    → openGraph.section
frontmatter.publishedAt.toISOString() → openGraph.publishedTime
frontmatter.updatedAt?.toISOString()  → openGraph.modifiedTime
```

```ts
// Conceptual shape — no implementation authorized by this document.
const { frontmatter } = getCaseStudyBySlug(slug);
const title = `${frontmatter.title} — Work`;
return {
  title,
  description: frontmatter.description,
  openGraph: {
    title,
    description: frontmatter.description,
    url: `/work/${slug}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: frontmatter.publishedAt.toISOString(),
    modifiedTime: frontmatter.updatedAt?.toISOString(),
    tags: frontmatter.tags,
    section: frontmatter.domain,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: frontmatter.description,
  },
};
```

**`section: frontmatter.domain`, not `frontmatter.topic`** — Work case studies carry no `topic` field at all (`workFrontmatterSchema` deliberately excludes it, confirmed unchanged since Milestone 5); `domain` (`"Backend Infrastructure"`, `"AI Systems"`, `"Platform Engineering"`) is the real, already-required, structurally analogous field, exactly as `docs/82` §5/§7 already established.

**Missing/invalid slug**: `return {}` — unmodified, same root-inheritance fallback as §6.

---

## 8. Dynamic Engineering Log Route — `/engineering-log/[slug]`

```text
frontmatter.title                    → openGraph.title, twitter.title   (matches existing title field exactly, incl. "— Engineering Log" suffix)
frontmatter.description              → openGraph.description, twitter.description
SITE_NAME                             → openGraph.siteName
`/engineering-log/${slug}`            → openGraph.url
"article"                             → openGraph.type
frontmatter.tags                      → openGraph.tags
frontmatter.publishedAt.toISOString() → openGraph.publishedTime
frontmatter.updatedAt?.toISOString()  → openGraph.modifiedTime
```

```ts
// Conceptual shape — no implementation authorized by this document.
const { frontmatter } = getEngineeringLogEntryBySlug(slug);
const title = `${frontmatter.title} — Engineering Log`;
return {
  title,
  description: frontmatter.description,
  openGraph: {
    title,
    description: frontmatter.description,
    url: `/engineering-log/${slug}`,
    siteName: SITE_NAME,
    type: "article",
    publishedTime: frontmatter.publishedAt.toISOString(),
    modifiedTime: frontmatter.updatedAt?.toISOString(),
    tags: frontmatter.tags,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: frontmatter.description,
  },
};
```

**No `section` field** — `articleFrontmatterSchema` (which Engineering Log uses directly, with no `topic`/`domain`-equivalent field, confirmed unchanged since Task 6.2) has no structurally analogous value; omitted rather than forced onto an ill-fitting field, the identical "don't invent a mapping the schema doesn't support" discipline `docs/61`/`docs/63` already applied to this exact collection's own metadata scope.

**Missing/invalid slug**: `return {}` — unmodified, same root-inheritance fallback.

---

## 9. `not-found.tsx` — Explicitly Not Modified

Resolved (§1): `not-found.tsx` receives **no** `openGraph`/`twitter` object of its own in this implementation. It already defines no `openGraph`/`twitter` today, and per §3's own merging trace, it therefore fully inherits root's minimal three-field `openGraph` object and one-field `twitter` object — `{ siteName: "Gracious Obeagu", locale: "en_US", type: "website" }` / `{ card: "summary_large_image" }`. This is a deliberate, evidence-based decision, not an oversight: 404 pages are already excluded from the Sitemap, already auto-`noindex`ed by Next.js itself (Task 8.1's own confirmed finding), and are not realistically shared intentionally — the cost of a slightly sparser OG object here is zero in practice, and adding one would be scope this plan's own minimal-footprint discipline doesn't need to spend. **`not-found.tsx` is excluded from this plan's own file manifest (§11).**

---

## 10. Twitter Card and Robots — Restated as a Binding Constraint

Every `twitter` object in §5–§8 contains exactly `card`, `title`, `description` — never `creator`, `site`, `creatorId`, or `siteId`, per `docs/82` §5/§7/§13's own finding that no real Twitter/X handle exists anywhere in this repository to populate them. `search/page.tsx`'s existing `robots: { index: false, follow: true }` field is **appended to, never replaced** — every code sample in §5 that shows `/search`'s own metadata object includes this field unchanged; no work item in this plan touches it.

---

## 11. File Manifest

| # | File | Change |
|---|---|---|
| 1 | `src/app/layout.tsx` | Add root `openGraph`/`twitter` defaults (§3) |
| 2 | `src/app/page.tsx` | Complete `openGraph`/`twitter` object (§5) |
| 3 | `src/app/about/page.tsx` | Same |
| 4 | `src/app/knowledge/page.tsx` | Same |
| 5 | `src/app/work/page.tsx` | Same |
| 6 | `src/app/work/library/page.tsx` | Same |
| 7 | `src/app/engineering-log/page.tsx` | Same |
| 8 | `src/app/search/page.tsx` | Same; `robots` field appended to, not replaced |
| 9 | `src/app/knowledge/[slug]/page.tsx` | Both `generateMetadata()` branches gain complete `openGraph`/`twitter` objects (§6); fallback branch (`return {}`) untouched |
| 10 | `src/app/work/[slug]/page.tsx` | `generateMetadata()` gains a complete `openGraph`/`twitter` object (§7); fallback untouched |
| 11 | `src/app/engineering-log/[slug]/page.tsx` | `generateMetadata()` gains a complete `openGraph`/`twitter` object (§8); fallback untouched |

**11 files — one fewer than `docs/82` §22's own conservative estimate**, which had listed `not-found.tsx` as a possible-but-optional twelfth file; this plan resolves that ambiguity to "not touched" (§9), a concrete refinement this implementation-planning stage is responsible for making. No new file is created anywhere. No image asset, no new constant, no new helper — `SITE_NAME`/`SITE_URL`/`metadataBase` are reused exactly as Task 8.1 left them.

---

## 12. Release Gate

Each criterion answerable **PASS / FAIL / NOT APPLICABLE**:

**Root/static pages**
1. `/` renders `og:site_name`, `og:type=website`, `og:title`, `og:description`, `og:url=/`, `twitter:card=summary_large_image`, `twitter:title`, `twitter:description` — no `og:image`/`twitter:image`.
2. `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`, `/search` each render the same seven fields, matching §5's own table exactly.
3. `/search`'s `robots` remains exactly `{ index: false, follow: true }`, confirmed unchanged in the same request.
4. 404 renders exactly root's own inherited `og:site_name`, `og:type=website`, `twitter:card` — no `og:title`/`og:description`/`og:url`, confirmed as the expected, deliberate state (§9), not a missing-field defect.

**Knowledge** (at least two real articles, e.g. `idempotency`, `transactional-outbox`)
5. `og:type=article`; `article:published_time` matches the real `publishedAt`, ISO 8601 formatted; `article:tag` values match real `tags` exactly; `article:section` matches real `topic`.
6. A real topic page (e.g. `/knowledge/distributed-systems`) renders `og:type=website`, no `article:*` fields.

**Work** (at least two real case studies, e.g. `vaultpay`, `cookeaze`)
7. `og:type=article`; `article:section` matches real `domain`; `article:tag` matches real `tags`.

**Engineering Log** (both real entries)
8. `og:type=article` for both `haya-invitation-gate-removal` and `cookeaze-webhook-reliability-gap`; no `article:section` (§8); tags match real frontmatter.

**Missing documents**
9. An invalid `/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]` each render exactly root's own inherited OG defaults before their own `notFound()` renders 404 — same shape as item 4.

**Images**
10. No `og:image`/`twitter:image` tag renders anywhere on any route.

**Regression**
11. No `<link rel="canonical">` anywhere.
12. No `<script type="application/ld+json">` anywhere.
13. Every Task 8.1 title (post-fragment, post-template) renders unchanged.
14. RSS item count unchanged (13); Sitemap URL count unchanged (27).
15. `next.config.ts` unchanged.
16. No `.mdx` content file changed.

**Automated**
17. `pnpm exec eslint` — clean.
18. `pnpm exec tsc --noEmit` — clean (particular attention: `frontmatter.tags`/`frontmatter.updatedAt?.toISOString()` type-check correctly against `OpenGraphArticle`'s own `tags?: string | string[]`/`modifiedTime?: string` fields).
19. `pnpm build` — clean, same 33-page static/SSG classification as Task 8.1's own build.

---

## 13. Regression Risks

| # | Risk | Verification |
|---|---|---|
| 1 | A dynamic route's own `openGraph` object is missing a required field, losing `siteName` silently | Gate items 5–8 — every field individually checked, not assumed present from root inheritance |
| 2 | `article:published_time` renders in the wrong format | Gate item 5 — ISO 8601 checked directly against `.toISOString()`'s own known output shape |
| 3 | `frontmatter.updatedAt` being `undefined` for every real document causes a build error rather than an honestly-absent field | `modifiedTime?: string` is optional on the type; `frontmatter.updatedAt?.toISOString()` correctly resolves to `undefined`, not a thrown error — gate item 18 (`tsc --noEmit`) confirms no type error |
| 4 | `openGraph.section` incorrectly reuses `topic` for Work or `domain` for Knowledge | §6/§7 state the exact, collection-specific mapping; gate items 5/7 test each independently |
| 5 | `/search`'s `robots` field accidentally dropped while adding OG fields | Gate item 3 |
| 6 | `not-found.tsx` accidentally gains its own `openGraph` object despite §9's explicit decision | Gate item 4 — checked as an explicit "no `og:title` present" assertion, not merely "no error" |
| 7 | An image field is accidentally introduced anywhere | Gate item 10 |
| 8 | `alternates.canonical` or JSON-LD accidentally introduced while editing the same metadata objects | Gate items 11–12 |
| 9 | Root's own `openGraph.type: "website"` leaks onto an `article`-typed page because that page's own `generateMetadata()` forgot to override `type` | Structurally prevented — `type` is a required, non-optional discriminant on Next's own `OpenGraph` union type; a route that sets `openGraph` at all without `type` fails `tsc --noEmit` (gate item 18), not merely a runtime risk |
| 10 | Static route regression (title/description accidentally changed while adding OG fields) | Gate item 13 |
| 11 | RSS/Sitemap accidentally affected | Gate item 14 — neither file is touched by this plan, confirmed by the file manifest (§11) containing neither |

---

## 14. Work Items and Dependencies

```
WI-1 (re-verify this plan's own contract against the live repository at authoring time)
        │
        ▼
WI-2 (root layout — openGraph/twitter defaults)
        │
        ▼
WI-3 (seven static routes — complete openGraph/twitter objects, §5)
        │
        ▼
WI-4 (three dynamic routes — complete openGraph/twitter objects, §6–§8)
        │
        ▼
WI-5 (automated checks — eslint, tsc, build)
        │
        ▼
WI-6 (live verification — every route's rendered OG/Twitter tags, root-inheritance fallback cases)
        │
        ▼
WI-7 (full regression sweep)
        │
        ▼
WI-8 (Release Candidate Review)
```

**WI-2 before WI-3/WI-4**: root's own minimal defaults must exist before the invalid-slug/404 inheritance behavior (gate items 4, 9) can be meaningfully verified, and before any static/dynamic route's own complete object can be checked against "does it correctly diverge from root where it should."

**No work item is executed by this document.**

---

## 15. Guardrails

- `src/lib/content/schema.ts`, every resolver file, `src/app/sitemap.ts`, `src/app/rss.xml/route.ts`, `next.config.ts` — none touched.
- `src/lib/constants/site.ts` — read only; `SITE_NAME`/`SITE_URL` reused exactly as they exist, not renamed or extended.
- No new file under `src/lib/metadata/`/`src/lib/seo/`.
- No new site constant (e.g., no `TWITTER_HANDLE` invented, per §10).
- `content/` — zero files touched; every OG field this plan specifies reads frontmatter that already exists.
- `not-found.tsx` — explicitly not modified (§9, §11).
- `/search`'s `robots` field — read, never replaced (§10).

---

## 16. Implementation Sequence

1. Agent re-verifies the approved contract (WI-1).
2. Agent modifies root layout (WI-2).
3. Agent modifies the seven static routes (WI-3), each matched exactly against §5's own table.
4. Agent modifies the three dynamic routes (WI-4), each matched exactly against §6–§8.
5. Agent runs `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` (WI-5).
6. Agent performs live verification, including both root-inheritance fallback cases (invalid slug, 404) (WI-6).
7. Agent performs the full regression sweep (WI-7).
8. Agent reports `APPROVED` or `REFINEMENTS REQUIRED` (WI-8).

---

## 17. Final Authorization Statement

This document authorizes no implementation. All eleven files named in §11 remain future work. No production file was created or modified to produce this document.

```
git status --short
```

Confirmed: only `docs/79`–`82` (prior turns' own outputs, untouched by this task) and `docs/83` (this document) appear as new paths under `docs/`; the twelve `src/app/` files already modified by Task 8.1 show zero additional diff attributable to this task.

---

## Final Report

1. **Plan status**: complete; two open design choices from `docs/82` resolved concretely — title mirroring (favoring consistency, §4) and `not-found.tsx`'s exclusion from the file manifest (§9, §11).
2. **Exact production manifest**: 11 files, all already-existing `src/app/` metadata exports, zero new files (§11).
3. **Root contract**: three `openGraph` fields, one `twitter` field, consumed by exactly two real cases (invalid slug, 404) (§3).
4. **Static route contract**: full before/after specification for all 7 static routes plus 404's explicit exclusion (§5, §9).
5. **Dynamic route contracts**: exact field-by-field mapping for Knowledge (two branches), Work, and Engineering Log, each traced to real, already-existing frontmatter (§6–§8).
6. **Twitter/robots discipline**: `creator`/`site` never populated; `/search`'s `robots` field read, never replaced (§10).
7. **Release gate**: 19 individually stated checks (§12).
8. **Regression risks**: 11 individually named risks, each with a concrete test (§13).
9. **Work items**: WI-1 through WI-8, dependency-ordered (§14).
10. **Guardrails**: every file this plan must not touch named explicitly (§15).
11. **Git verification**: confirmed via `git status --short`; zero production change attributable to this task (§17).

**APPROVED — Open Graph implementation plan is ready for building.**
