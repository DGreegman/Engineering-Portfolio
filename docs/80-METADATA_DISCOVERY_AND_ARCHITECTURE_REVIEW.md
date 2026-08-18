# 80 — Task 8.1 (Metadata): Discovery and Architecture Review

## 1. Status

Discovery and architecture review — design-stage only, no implementation authorized.

> No production code, content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or configuration file was created or modified to produce this document. No metadata helper was created. No Open Graph, canonical URL, structured data, or Lighthouse work was performed.

Opens execution of "Task 8.1 — Metadata," this repository's own execution designation (`docs/79`) for the first deliverable in `docs/12`'s Milestone 8 — SEO & Performance list. Every finding below is re-derived from the live repository this turn, including a direct read of this project's own installed Next.js version's bundled documentation (`node_modules/next/dist/docs/`) for exact Metadata API semantics — not carried forward from `docs/79` or any other prior document unchecked.

---

## 2. Executive Conclusion

Metadata coverage in this repository is **real but structurally inconsistent, not absent**. Every one of the 11 route/layout files already exports its own `title`/`description` (either statically or via `generateMetadata()`) — there is no missing-metadata route anywhere. The actual problem is narrower and more precise than "inconsistent": **the site's own identity is expressed as two different, uncoordinated strings** — `SITE_NAME` ("Gracious Obeagu," the documented identity per `docs/01-PERSONAL_BRAND.md`, already wired into the homepage title, RSS feed, and Footer) and the literal, hand-typed string `"Engineering Portfolio"` (repeated 12 times across 10 separate route files as a title suffix, plus once more as the root layout's own generic fallback title) — with **no shared constant or template connecting them**. This is real, evidenced duplication (`§6`), not a subjective style complaint.

The second concrete gap: **no `metadataBase` exists anywhere**, and none of the three URL-based deliverables this milestone still has ahead of it (Open Graph, Canonical URLs, and any future `alternates.languages`/Twitter-card work) can be authored with relative paths until one does — `SITE_URL` (`lib/constants/site.ts`) already exists, is already the exact value Sitemap and RSS both reuse, and is the correct value to reuse here too (§9).

**Recommended scope for Task 8.1**: (1) resolve the site-identity/title-suffix duplication behind one shared source of truth, (2) introduce `metadataBase` sourced from the existing `SITE_URL` constant, (3) audit and correct the root layout's own vestigial Milestone-1 fallback metadata, and (4) decide — not necessarily build — whether per-page `robots` handling should extend beyond `/search` to draft content, given the underlying content layer already documents that draft pages are directly reachable and currently carry no `noindex` signal (§13). **Open Graph, Twitter cards, canonical URLs, structured data, image optimization, lazy loading, and Lighthouse work are explicitly out of scope** (§8, §19) — nothing found in this review changes that boundary.

No implementation is authorized by this document.

---

## 3. Current Repository Metadata Inventory

Directly inspected this turn, file by file:

### Root layout (`src/app/layout.tsx`, lines 23–35)

```ts
export const metadata: Metadata = {
  title: "Engineering Portfolio",
  description: "Engineering Portfolio project foundation.",
  alternates: {
    types: { "application/rss+xml": `${SITE_URL}${RSS_PATH}` },
  },
};
```

A generic, Milestone-1-era title/description (the description literally reads *"project foundation"* — scaffolding text, not a real site description) plus one real, working `alternates.types` entry for RSS auto-discovery (Task 6.6). No `metadataBase`, no title template, no `openGraph`, no `robots` default, no `twitter`.

### Every route/layout metadata export, confirmed by direct grep of all 12 files that import `Metadata` from `"next"`

| File | Mechanism |
|---|---|
| `src/app/layout.tsx` | Static `export const metadata` |
| `src/app/page.tsx` (`/`) | Static |
| `src/app/about/page.tsx` (`/about`) | Static |
| `src/app/knowledge/page.tsx` (`/knowledge`) | Static |
| `src/app/knowledge/[slug]/page.tsx` (`/knowledge/[slug]`) | `generateMetadata()` — two branches (topic, article) plus an empty-object fallback |
| `src/app/work/page.tsx` (`/work`) | Static |
| `src/app/work/library/page.tsx` (`/work/library`) | Static |
| `src/app/work/[slug]/page.tsx` (`/work/[slug]`) | `generateMetadata()` |
| `src/app/engineering-log/page.tsx` (`/engineering-log`) | Static |
| `src/app/engineering-log/[slug]/page.tsx` (`/engineering-log/[slug]`) | `generateMetadata()` |
| `src/app/search/page.tsx` (`/search`) | Static, with an explicit `robots` field |
| `src/app/not-found.tsx` (404) | Static |

**Every route has metadata. Nothing is missing at the "does this route export anything" level.**

### `src/lib/metadata/`, `src/lib/seo/`

Both exist as directories, both contain only `.gitkeep` — anticipatory scaffolding, zero real code, confirmed by direct listing. **Not used by any current import anywhere** (confirmed by grep — no file imports from either path).

### `src/lib/constants/workspace-metadata.ts`

A real file, but **not SEO-related** — a genuine naming collision worth flagging precisely: this file exports `WORKSPACE_METADATA`, static "Branch / Last updated / Version" facts rendered in the Footer (Task 2.5), unrelated to search-engine or document `<head>` metadata. Not part of this review's own scope, named only so it isn't confused with `src/lib/metadata/` during implementation.

### `src/lib/constants/site.ts` — full content, re-read this turn

```ts
export const SITE_NAME = "Gracious Obeagu";
export const GITHUB_URL = "https://github.com/DGreegman";
export const LINKEDIN_URL = "https://linkedin.com/in/gracious-obeagu";
export const CONTACT_EMAIL = "graciousobeagu@gmail.com";
export const RSS_PATH = "/rss.xml";
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
export const FOOTER_CLOSING_MESSAGE = [...];
```

`SITE_URL`'s own docstring (re-read in full) already states its intended role precisely: *"the first value in this repository that anything needs an absolute URL for... Sitemap... is expected to import this constant directly rather than declare its own... Production deployment must set a real `SITE_URL` environment variable; this repository does not know, and does not invent, that value."* Already consumed by `src/app/sitemap.ts` and `src/app/rss.xml/route.ts` — confirmed by direct grep, no other consumer exists.

### `next.config.ts` — full content

```ts
const nextConfig: NextConfig = {/* config options here */};
```

Empty. No `images` domain configuration, no experimental flags, nothing metadata-relevant.

### Robots — current state

- **No `app/robots.ts`** exists anywhere (confirmed by `find`) — no site-wide `/robots.txt` is generated today.
- **One per-page `robots` field exists**, on `/search` only (`src/app/search/page.tsx`, lines 45–48): `{ index: false, follow: true }`, with an explicit docstring citing `docs/41` §18 as the reason.

### Sitemap (`src/app/sitemap.ts`) and RSS (`src/app/rss.xml/route.ts`)

Both already reuse `SITE_URL` directly, confirmed by re-reading both files in full this turn — no duplicated origin string anywhere in either. Both are already correct, already shipped (Milestone 6/7), and out of this review's own scope except as evidence that `SITE_URL` is the established, working pattern for absolute-URL needs (§9).

### Content frontmatter — is there enough to generate good metadata?

Every real Knowledge, Work, and Engineering Log document's `title`/`description` frontmatter fields are already required by schema (`articleFrontmatterSchema`, `z.string().min(1)` for both) and are already the exact source every `generateMetadata()` function reads. Spot-checked lengths across all 13 real documents this turn (title / description, characters):

| Document | Title length | Description length |
|---|---:|---:|
| `append-only-ledger` | 68 | 212 |
| `data-transfer-objects` | 81 | 221 |
| `how-jwt-works` | 13 | 59 |
| `idempotency` | 60 | 189 |
| `money-floating-point` | 41 | 135 |
| `optimistic-vs-pessimistic-locking` | 33 | 135 |
| `transactional-outbox` | 79 | 241 |
| `cookeaze` | 75 | 192 |
| `gohunt` | 72 | 179 |
| `haya` | 73 | 210 |
| `vaultpay` | 56 | 161 |
| `cookeaze-webhook-reliability-gap` | 30 | 204 |
| `haya-invitation-gate-removal` | 31 | 222 |

Reported as raw, factual data only — **no external character-count target is asserted or invented anywhere in this document** (§16's own explicit constraint). Every value is real, specific, human-written prose — none is placeholder or generic text, confirmed by direct reading of every file's own frontmatter during this and prior tasks' own work.

---

## 4. Route Metadata Matrix

For every real, currently-indexable route. Routes not listed either don't exist (`docs/79`'s own instruction not to invent routes) or are explicitly non-canonical (404, excluded per its own `robots`-equivalent behavior, §13).

| Route | Title (rendered) | Description | Static/generated | Inherits root? | Canonical URL? | Open Graph? | Twitter/X? | Robots directive? | Title template? | `metadataBase`? | Manually duplicated? | Accurately represents the page? |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `/` | `Gracious Obeagu — Engineering Workspace` | Real, page-specific | Static | Overrides root `title`/`description`; inherits nothing else (root sets no other field) | No | No | No | None (defaults to indexable) | No | No | `SITE_NAME` used correctly here | Yes |
| `/knowledge` | `Knowledge — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None | No | No | `"Engineering Portfolio"` hand-typed | Yes |
| `/knowledge/[topic]` (8 real topics) | `${topic.title} — Knowledge — Engineering Portfolio` | Real, topic-specific | Generated (`generateMetadata`) | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/knowledge/[slug]` (7 real articles) | `${frontmatter.title} — Knowledge — Engineering Portfolio` | Real, article frontmatter | Generated | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/work` | `Work — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/work/library` | `Case Study Library — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/work/[slug]` (4 real case studies) | `${frontmatter.title} — Work — Engineering Portfolio` | Real, case study frontmatter | Generated | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/engineering-log` | `Engineering Log — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/engineering-log/[slug]` (2 real entries) | `${frontmatter.title} — Engineering Log — Engineering Portfolio` | Real, entry frontmatter | Generated | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/about` | `About — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None | No | No | Same suffix hand-typed | Yes |
| `/search` | `Search — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | **`{ index: false, follow: true }`** | No | No | Same suffix hand-typed | Yes — the `robots` value correctly reflects that query-driven result pages shouldn't be indexed |
| 404 (`not-found.tsx`) | `Page Not Found — Engineering Portfolio` | Real, page-specific | Static | Same | No | No | No | None set manually — **Next.js itself injects `noindex` automatically for any 404-status response** (confirmed by this route's own docstring, itself citing `docs/43` §2/§19 D3, re-verified against this exact installed Next.js version's behavior, §13) | No | No | Same suffix hand-typed | Yes |

**Every "Accurately represents the page?" answer is Yes** — no placeholder, no misleading, no generic-boilerplate title/description was found anywhere in the live route tree. The problems this review identifies (§6) are about *duplication and missing infrastructure*, not about *inaccurate* content.

---

## 5. Current Architecture

**Mechanism**: every route independently authors its own complete `Metadata` object (or `generateMetadata()` function), inline, in its own file. No shared metadata-building helper exists anywhere (`src/lib/metadata/`/`src/lib/seo/` are both empty). No route relies on Next.js's own inheritance/template mechanism (§10) — every title is written as a complete, self-contained string per route, not a fragment relying on a parent's `title.template`.

**Merging behavior, confirmed against this exact installed Next.js version's own docs** (`node_modules/next/dist/docs/.../generate-metadata.md`, "Merging"/"Overwriting fields"): metadata is evaluated root-to-leaf and shallow-merged; a field defined at a child segment (a `page.tsx`) fully replaces the same field from a parent segment (`layout.tsx`), never deep-merges. Since root layout sets only `title`/`description`/`alternates.types`, and every page sets its own `title`/`description`, **every real route's rendered `<title>`/`<meta name="description">` comes entirely from that route's own file — root's title/description never actually reaches a reader**, except as the (currently unreachable) fallback for a route that defines neither, which none does.

**Site identity**: `SITE_NAME` ("Gracious Obeagu") is the one value this repository already treats as its documented, canonical identity (`docs/01-PERSONAL_BRAND.md`), already wired into three real consumers — homepage title, RSS `<title>`, Footer copyright line — confirmed by direct grep. It is **not** used by any of the 10 page-title-suffix locations, all of which instead hand-type the literal string `"Engineering Portfolio"`.

---

## 6. Problems Discovered

Stated precisely, each traced to source — not "metadata is inconsistent" as a vague summary.

### Problem 1 — Two uncoordinated site-identity strings, one of them duplicated 12 times

`"Engineering Portfolio"` appears as a hand-typed literal string in 12 places across 10 files (`grep -c '"Engineering Portfolio"' src/app/` confirms this exact count this turn) — every route's own title suffix, plus the root layout's own generic fallback title. `SITE_NAME` (`"Gracious Obeagu"`), the repository's own documented identity constant, is used in exactly 3 places (homepage title, RSS feed title, Footer), none of which overlap with the 10 files above. **No shared constant or template connects the two.** A future rebrand, or even a simple wording change (e.g., "Portfolio" → "Workspace," which the homepage's own title already independently uses — `"Engineering Workspace"`, not `"Engineering Portfolio"`, a third variant), would require editing 10 separate files by hand, with real risk of missing one — exactly the duplication failure mode `docs/24-ENGINEERING_PRINCIPLES.md`'s "Single Source of Truth" principle (already invoked throughout this codebase's own history, e.g. `SITE_URL`'s own docstring) exists to prevent.

### Problem 2 — No `metadataBase`

Confirmed by grep: zero occurrences anywhere in `src/`. Per this exact installed Next.js version's own documentation (§9), any future URL-based metadata field (`openGraph.images`, `alternates.canonical`, `twitter.images`) written as a relative path **without** `metadataBase` set **causes a build error**, not a soft warning. This is not a live problem today (zero such fields exist), but it is a real, concrete blocker the next two Milestone 8 deliverables (Open Graph, Canonical URLs) will each independently hit unless resolved once, here.

### Problem 3 — Root layout's own metadata is vestigial Milestone-1 placeholder text, never revisited

`description: "Engineering Portfolio project foundation."` reads exactly like scaffolding copy, not a real site description — and functionally, it is dead: since every real route overrides both `title` and `description` (§5), this text is never actually rendered to a reader on any real page today. It would only ever surface for a hypothetical future route that defines neither field.

### Problem 4 — Draft content has no `robots` signal, and this is not hypothetical infrastructure — it is an already-documented, deliberate routing behavior

`getArticleSlugs()`/`getCaseStudySlugs()`/`getEngineeringLogSlugs()` (the basis of `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()`, which gate both `generateMetadata()` and `generateStaticParams()`) read directly from the filesystem and are **not** draft-filtered — confirmed by `articles.ts`'s own docstring: *"Every Knowledge article slug on disk (drafts included) — the set Step 2 of the routing resolution order checks a candidate slug against."* Listing surfaces (`getAllArticles()`, used by Search/RSS/Sitemap/relationship resolvers) **are** draft-filtered. The net effect: **a draft document, if one existed, would be statically generated, directly reachable at its real URL, and would receive real, non-`noindex` metadata — while being invisible from every discovery surface.** This is a real, precise, already-designed-in architectural fact (not a defect this review is newly finding), but it is directly relevant to whether Task 8.1's own "metadata accurately represents the page" mandate should extend to it. **Zero real draft documents exist in the current corpus** (re-confirmed by grep this turn) — this is evaluated as an architectural readiness question, not a live indexing incident.

### Not a problem, confirmed explicitly

- **No route is missing metadata.**
- **No metadata is inaccurate or misleading** (§4).
- **`/search`'s existing `robots` exclusion is correct and intentional**, not a bug (§13).
- **404's own lack of a manual `robots` field is correct** — confirmed against this exact installed Next.js version's behavior (§13), not merely restated from `docs/43`.

---

## 7. Metadata Scope Definition

### What Task 8.1 should own, decided from repository evidence, not assumed from a generic checklist

| Candidate scope item | In scope? | Why |
|---|---|---|
| Title strategy (resolving Problem 1) | **Yes** | The single largest, most concrete, most evidenced problem this review found; purely a `<title>`-surface concern |
| Site identity consolidation | **Yes** | Directly causes Problem 1; `SITE_NAME` already exists and is already the documented identity — this is a wiring problem, not a new-value problem |
| `metadataBase` | **Yes** | A general `Metadata`-object-level field (categorized under "Other fields" in this Next.js version's own docs, not under `openGraph` or `alternates` specifically); reuses the already-existing `SITE_URL`; has zero behavioral effect until a URL-based field exists (§9) — pure, safe groundwork |
| Root layout fallback metadata (Problem 3) | **Yes** | A direct, small correction once the title/identity strategy is decided — the fallback's own shape depends on that decision (§10) |
| Route-level metadata *consistency* (verifying every real route's title/description follows the corrected convention) | **Yes** | The natural verification step of the title-strategy work — not a new investigation, the completion of §6's own finding |
| `robots` for draft content (Problem 4) | **Conditional — recommended, not mandatory** | Directly serves "metadata accurately represents the page," the same justification already used for `/search`'s own existing exclusion; low cost, but addresses a currently-theoretical (zero real drafts) case — named as an explicit implementation-plan decision, not pre-committed here |
| Site-wide `app/robots.ts` | **Open question, not decided here** | Next's own documentation groups `robots.txt` under "file-based metadata" alongside `sitemap.xml` (already built) and favicons/OG-images — a plausible Metadata-scope item by that taxonomy — but `docs/12` never names "robots" as a Milestone 8 deliverable at all, and it's arguably closer to site-wide indexing control than per-page title/description work. Flagged for the eventual implementation plan to explicitly resolve (§20), not silently included or excluded here |

### What Task 8.1 should NOT own

Named explicitly, per this task's own instruction not to let Task 8.1 silently absorb the other three closely-related deliverables:

- **Open Graph** (`openGraph.*` fields) — its own separate `docs/12` deliverable. Not touched, not authored, not stubbed.
- **Twitter/X cards** (`twitter.*` fields) — even though Next.js's own docs treat `twitter` as commonly paired with `openGraph`, this repository's roadmap doesn't name it as its own deliverable at all; this review treats it as bundled with Open Graph's own future scope, not Task 8.1's.
- **Canonical URLs** (`alternates.canonical`) — its own separate deliverable. `metadataBase` (recommended in scope) makes this *possible* later without a build error; it does not *implement* it now. No route gains an `alternates.canonical` value from this task.
- **JSON-LD / structured data** — its own separate deliverable, and a materially different mechanism (`<script type="application/ld+json">`, not the `Metadata` object at all) — zero implementation exists, zero is proposed.
- **Image Optimization / Lazy Loading** — a different architectural axis entirely (`next/image`/rendering, not `<head>` metadata); real, already-documented partial work exists (`about-header.tsx`'s `next/image` use, `mdx-components.tsx`'s deliberately-deferred raw `<img>`) but nothing here touches either file.
- **Lighthouse optimization** — a measurement pass over the outcome of every other deliverable; cannot begin meaningfully before they exist.

---

## 8. Metadata vs. Later Milestone 8 Deliverable Boundaries

Restated as a direct boundary table, since `docs/79` §8 already found this exact ambiguity (Metadata/Open-Graph/Canonical-URLs sharing one underlying `Metadata` object type) and asked a future document to resolve it — this section is that resolution:

| Field / concern | Lives in the `Metadata` object? | Owned by |
|---|---|---|
| `title`, `description` | Yes | **Task 8.1 (Metadata)** |
| `metadataBase` | Yes | **Task 8.1 (Metadata)** — general infrastructure, not itself an OG/canonical field |
| `robots` (per-page) | Yes | **Task 8.1 (Metadata)**, conditionally (§7) |
| `alternates.types` (RSS) | Yes | Already shipped (Task 6.6) — untouched by this review |
| `alternates.canonical` | Yes | **Canonical URLs deliverable** — not Task 8.1, even though it's technically one field on the same object |
| `alternates.languages` | Yes | Not evidenced as needed anywhere in this repository (no i18n exists); not scoped to any current deliverable |
| `openGraph.*` | Yes | **Open Graph deliverable** — not Task 8.1 |
| `twitter.*` | Yes | **Open Graph deliverable** (bundled, per §7) — not Task 8.1 |
| JSON-LD (`<script type="application/ld+json">`) | **No — a different mechanism entirely**, not a `Metadata` object field | **Structured Data deliverable** — not Task 8.1, not even adjacent to it technically |
| `app/robots.ts` (site-wide) | No — a separate file convention, not a `Metadata` object field | **Open question** (§7, §20) |

This table is the concrete boundary a future implementation plan should treat as binding: **Task 8.1 may touch `title`, `description`, `metadataBase`, and `robots` — and nothing else on the `Metadata` object.**

---

## 9. `metadataBase` Investigation

Addressed directly, per this task's own explicit emphasis:

- **Does the application currently have a reliable production base URL?** Partially. `SITE_URL` exists and is well-documented, but its own docstring already states plainly that production correctness depends on an environment variable this repository has never verified is actually configured: `process.env.SITE_URL ?? "http://localhost:3000"`. **Checked this turn**: no `.env.example`, no `vercel.json`, no CI workflow step, and no README mention of `SITE_URL` exists anywhere in this repository. If `SITE_URL` is unset in a real deployment, `metadataBase` (and Sitemap/RSS, already) would silently resolve to `http://localhost:3000` in production — a real, pre-existing risk this task would extend to one more consumer, not newly create.
- **Where should that value come from?** `SITE_URL` (`lib/constants/site.ts`) — already the exact value Sitemap and RSS both use, already documented as the intended shared source for exactly this need.
- **Does an environment variable exist?** `process.env.SITE_URL` is read; whether it is actually *set* in any real environment could not be verified from within this repository (no deployment config is checked in).
- **Should a new site constant be introduced?** No — `SITE_URL` already is that constant; introducing a second one would recreate Problem 1's own duplication pattern.
- **Do development/staging environments create ambiguity?** No new ambiguity beyond what `SITE_URL` already resolves: the `http://localhost:3000` fallback is explicitly designed for local `pnpm dev`/`pnpm build` (matching `docs/12` Milestone 1's own "no environment validation layer... until first needed" restraint, cited directly in `site.ts`'s own docstring). No staging-specific value exists or is proposed.
- **Does adding `metadataBase` now create coupling with Canonical URLs or Open Graph?** No implementation coupling — `metadataBase` alone authors zero `openGraph`/`alternates.canonical` fields; it only makes relative paths *possible* for whichever task authors those fields next, removing a repeated "where's our base URL" question from both of their own future scopes.
- **Introduce now, or defer?** **Recommend now.** It has zero observable effect today (no URL-based field currently exists to activate it; the one existing `alternates.types` entry is already an absolute URL, which the docs confirm `metadataBase` is ignored for), zero regression risk, and reuses an already-correct, already-documented value.

**If the repository does not establish a reliable canonical origin — stated explicitly, per this task's own instruction**: it does not, fully. `SITE_URL` is the best and only available value, and it is the correct one to use, but its own production reliability remains contingent on an environment variable with no verified deployment-time guarantee anywhere in this repository. This is named as a real, standing limitation, not resolved by this document, and not invented as a new problem — it is `site.ts`'s own already-written caveat, re-confirmed rather than silently trusted.

---

## 10. Title Architecture

**Current shape**: every route writes a complete, self-contained title string, e.g. `"Knowledge — Engineering Portfolio"`, `` `${frontmatter.title} — Work — Engineering Portfolio` ``. No route relies on `title.template`/`title.default` inheritance (§5) — confirmed absent everywhere.

**Are current titles already consistent enough?** Structurally, yes — every section-listing page follows `"[Section] — Engineering Portfolio"`, every document-detail page follows `` "[Document Title] — [Section] — Engineering Portfolio" ``. **The one real inconsistency is the identity suffix itself** (§6, Problem 1) — the homepage alone diverges, using `` `${SITE_NAME} — Engineering Workspace` `` (`"Gracious Obeagu — Engineering Workspace"`), a third distinct wording from both `"Engineering Portfolio"` (10 other routes) and `SITE_NAME` alone (Footer/RSS).

**A precise technical constraint, confirmed against this exact installed Next.js version's own docs (§9's own source), worth stating before any redesign is attempted**: `title.template` supports exactly one `%s` substitution point. The current three-part pattern (`"[Document] — [Section] — [Brand]"`) cannot collapse into a single root-level template, because the middle segment ("Knowledge"/"Work"/"Engineering Log") varies per collection, not per document — each route would still need to compose its own `` `${frontmatter.title} — Knowledge` `` (or equivalent) title fragment; only the trailing `" — [Brand]"` piece could be delegated to a root template.

**Does the workspace-not-marketing-site identity matter here?** Yes, and it constrains the recommendation: this review does not propose a generic, SEO-boilerplate title format (e.g., front-loading keywords, adding taglines) — the existing `"[Document] — [Section] — [Brand]"` shape is already a reasonable, specific, non-generic convention; the only defect is that "[Brand]" isn't sourced from one place.

**Would changing titles affect discoverability or user expectations?** If only the identity suffix's *source* changes (from a hardcoded literal to a shared constant/template) while its *rendered text* stays character-for-character identical, no — no existing indexed page's title text would change at all. If the identity suffix's own *wording* changes (e.g., unifying on `SITE_NAME` instead of "Engineering Portfolio," or vice versa), every currently-indexed page's title would change — a real, user- and search-engine-visible effect that this document does not authorize or decide (§20).

---

## 11. Description Architecture

- **Which routes already have meaningful descriptions?** All 11 (§3, §4) — every one is real, specific prose, none generic or placeholder.
- **Which routes lack them?** None.
- **Are article frontmatter descriptions sufficient?** Yes — already schema-required (`z.string().min(1)`), already real and specific across all 13 documents (§3's own length table), already the exact source every dynamic route's `generateMetadata()` reads. No gap found.
- **Do listing pages need authored descriptions?** They already have them (`/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`, `/search` — all static, all real, confirmed §3/§4).
- **Is the root fallback description appropriate?** No — Problem 3 (§6): it is vestigial placeholder text, never actually rendered to a reader today, and should be revisited alongside the title-identity work (§10), not left untouched by accident.
- **Should descriptions be centralized or stay route-specific?** **Stay route-specific.** Unlike the title suffix (a single repeated fragment, the actual duplication problem), every description is already unique, specific prose per route or per document — there is no repeated string to centralize, and centralizing genuinely distinct content would be exactly the kind of unnecessary abstraction this project's own engineering standards (`docs/12`'s "does not introduce unnecessary complexity") warn against.

---

## 12. Dynamic Route Analysis

`/knowledge/[slug]` and `/work/[slug]`, checked precisely against their live `generateMetadata()` bodies (re-read in full this turn, not modified):

| Behavior | `/knowledge/[slug]` | `/work/[slug]` |
|---|---|---|
| Missing/invalid slug | Falls through both the topic-branch and article-branch checks, returns `{}` (empty metadata object) — Next.js then falls back to whatever the root layout provides (`"Engineering Portfolio"` / the vestigial description, §6 Problem 3) | `if (!caseStudyExists(slug)) return {};` — identical fallback pattern |
| Draft content | Not distinguished — `articleExists()`/`caseStudyExists()` include drafts (§6, Problem 4); a draft's metadata would generate exactly like a published document's | Same |
| Title generation | `` `${frontmatter.title} — Knowledge — Engineering Portfolio}` `` (article) / `` `${topic.title} — Knowledge — Engineering Portfolio` `` (topic) | `` `${frontmatter.title} — Work — Engineering Portfolio` `` |
| Description generation | `frontmatter.description` (article) / `topic.description` (topic) | `frontmatter.description` |
| Fallback behavior | Empty object on no-match; the actual page component separately calls `notFound()` for the same no-match case (confirmed: `generateMetadata()` and the page's own default export perform this check independently, not sharing one result) | Same independent-check pattern |
| Consistency between Knowledge and Work | **Consistent in shape** (`Title — Section — Brand`, description from frontmatter, empty-object fallback) — the one structural difference is that Knowledge's `generateMetadata()` has two branches (topic and article) where Work has one, an accurate reflection of Knowledge's own two-step routing resolution (`docs/20`'s own "Topic vs. Article" order), not an inconsistency |

**This document does not change either function's behavior** — every finding above is descriptive, verifying current behavior precisely enough for a future implementation plan to build against, per this task's own explicit instruction.

---

## 13. Robots Analysis

- **Why does `/search` have `robots` behavior?** Its own docstring states the reason directly and precisely: search-results URLs are query-driven, non-canonical, and shouldn't be indexed — citing `docs/41` §18 as the original architectural decision. Re-verified this turn: the field is exactly `{ index: false, follow: true }` — not indexed, but links from the page are still followed (a deliberate, correctly-scoped choice, not a blanket exclusion).
- **Is it intentional?** Yes, confirmed both by the inline comment and by `docs/41`'s own prior decision, not something this review is newly rationalizing.
- **Do other routes need robots directives?** Checked against every real route (§4): no other route is query-driven or non-canonical in the way `/search` is. The one theoretical case is draft content (§6, Problem 4) — currently zero real instances exist, so this remains a forward-looking, not urgent, consideration (§7).
- **Does 404 need a manual `robots` field?** No — re-verified against this exact installed Next.js version's own documented default behavior (not merely restated from `docs/43`): Next.js automatically injects `<meta name="robots" content="noindex">` for any 404-status response. `not-found.tsx`'s own docstring already states this and cites the reasoning; this review independently confirms it's still accurate for the currently-installed Next.js 16.3.0, not stale from an earlier version.
- **Does robots belong in Task 8.1 or a later SEO task?** Per-page `robots` (the mechanism already used on `/search`) is a `Metadata` object field — squarely Task 8.1's own surface (§8). A site-wide `app/robots.ts` is a separate file convention with a broader, indexing-policy-wide scope not named anywhere in `docs/12`'s own Milestone 8 list — left as an open question (§7, §20), not decided here.
- **Could changing it accidentally affect indexing?** Only if implemented carelessly — e.g., a draft-content `robots` branch that misfires on published content. This review recommends the change be scoped narrowly and tested explicitly against every real published document (§18) precisely to guard against that risk, should it be implemented.

---

## 14. Architecture Options

### Option set 1 — Site identity / title suffix

**(A) Root-level `title.template` + `title.default`, with every route trimmed to its own fragment.**

- Benefits: uses Next.js's own idiomatic mechanism for exactly this problem (confirmed via this version's own docs, §10); one constant/template change updates every future page automatically; a new route that forgets to import anything still gets the correct suffix for free, as long as it sets *any* title.
- Drawbacks: touches every one of the 10–11 route files' own title strings (removing the suffix, keeping the section-name fragment); the three-part title pattern (§10) means the section-name segment still can't be templated away, only the trailing brand suffix.
- Maintenance impact: lowest going forward — one place to change the brand suffix.
- Coupling: low — the template lives once, in root layout; each route still fully owns its own title text.
- Consistency with existing architecture: strong — mirrors the "one constant, many consumers" pattern `SITE_URL` and (partially) `SITE_NAME` already establish.
- Migration cost: touches ~10 files, each a small, mechanical, low-risk edit.

**(B) Keep fully explicit per-route title strings, but interpolate a shared identity constant instead of the literal string.**

- Benefits: smaller conceptual change — no new Next.js templating semantics introduced; each route's rendered title stays a fully explicit, self-contained value with no inherited-suffix indirection to reason about.
- Drawbacks: identical file-touch footprint to (A) today; unlike (A), provides no automatic guarantee for a *future* route — a new page that forgets to import the constant silently reintroduces Problem 1.
- Maintenance impact: same today, weaker guarantee tomorrow.
- Coupling: a shared constant, same as (A) in kind.
- Consistency: acceptable, but doesn't use the Metadata API's own purpose-built feature.

**Recommendation: (A).** It resolves the exact problem this review found, using the mechanism this version of Next.js itself provides for it, with a stronger long-term guarantee than (B) for the same migration cost.

### Option set 2 — `metadataBase` now vs. later

Covered in full in §9. **Recommendation: now**, reusing `SITE_URL` — zero current behavioral effect, zero regression risk, removes duplicated future discovery work from the Open Graph and Canonical URLs deliverables.

### Option set 3 — Site constants vs. environment-only configuration for identity

**(A) Keep `SITE_NAME`/`SITE_URL` as TypeScript constants** (current pattern) — real values checked into source, with `SITE_URL` alone reading from `process.env` with a documented local fallback.

- Benefits: matches this repository's own established pattern exactly (already used identically for `SITE_URL`, `GITHUB_URL`, etc.); no new configuration surface to document or maintain; values are visible directly in source, not hidden behind undocumented environment variables.
- Drawbacks: `SITE_NAME` itself has no environment-variable override at all — if it ever needed to differ per-environment (it doesn't, today), this would require a code change, not a config change.

**(B) Move identity values fully into environment variables.**

- Benefits: theoretically allows per-environment overrides without a code change.
- Drawbacks: `SITE_NAME` is not the kind of value that plausibly varies by environment (a person's own name/brand, not a deployment-specific fact like a URL); introducing an environment variable for it would add configuration surface this repository has never needed and `docs/12` Milestone 1's own "no environment validation layer... until first needed" restraint explicitly warns against adding prematurely.

**Recommendation: (A), unchanged.** No evidence anywhere in this repository suggests `SITE_NAME` needs to vary by environment; only `SITE_URL` genuinely does, and it already has exactly that mechanism.

---

## 15. Recommended Architecture

1. **Resolve the title-suffix duplication via `title.template`/`title.default` in root layout** (Option 1A), sourced from `SITE_NAME` — the repository's own already-documented identity — not a new or different string. Exact final wording (whether the suffix reads "Engineering Portfolio," "Gracious Obeagu," or something reconciling both) is **not decided by this document** — it is a real, user-visible naming choice (§10, §20), not an architectural one this review has the evidence to make unilaterally.
2. **Introduce `metadataBase = new URL(SITE_URL)` in root layout** (§9) — zero current effect, real future value.
3. **Correct the root layout's own fallback `description`** (Problem 3) to be a real, honest site description rather than Milestone-1 scaffolding text, once the identity wording (item 1) is decided — the two are the same edit surface.
4. **Decide, in the implementation plan, whether to add conditional `robots: { index: false }` for draft content** on the three dynamic detail routes (§7, §13) — recommended as low-cost and directly justified by the same "accurately represents the page" standard `/search`'s own existing exclusion already established, but not mandatory, since zero real drafts currently exist to make this observable.
5. **Leave `app/robots.ts` (site-wide) as an explicitly open question** for the implementation plan to resolve in or out, not pre-decided here (§7, §20).

**No new metadata helper, abstraction, or `src/lib/metadata/`/`src/lib/seo/` file is recommended.** The fix for Problem 1 is a Next.js-native template mechanism plus reuse of an existing constant — not a new library. Creating one would be exactly the "abstraction that's only used once" pattern this codebase's own components (`document-layout.tsx`, `case-study-relationships.ts`, and others) have repeatedly declined to introduce without genuine reuse pressure.

---

## 16. Exact Implementation Boundary

**Files expected to change** (in a future implementation plan/task, not this one):

- `src/app/layout.tsx` — `metadataBase`, `title.template`/`title.default`, corrected fallback `description`.
- `src/app/page.tsx`, `about/page.tsx`, `knowledge/page.tsx`, `knowledge/[slug]/page.tsx`, `work/page.tsx`, `work/library/page.tsx`, `work/[slug]/page.tsx`, `engineering-log/page.tsx`, `engineering-log/[slug]/page.tsx`, `search/page.tsx`, `not-found.tsx` — each route's own `title` value trimmed to drop the now-templated brand suffix (mechanical, per-file, no logic change beyond the string itself); `search/page.tsx`'s existing `robots` field left untouched.
- Possibly `knowledge/[slug]/page.tsx`, `work/[slug]/page.tsx`, `engineering-log/[slug]/page.tsx` — a conditional `robots` branch for draft content, **if** item 4 (§15) is approved during implementation planning.

**Files that must NOT change**:

- Any `content/*.mdx` frontmatter — no metadata architecture decision in this review requires a content change; every real document's `title`/`description` already exists and is already sufficient (§3, §11).
- `src/lib/content/schema.ts` — no schema field is added, removed, or altered.
- `src/lib/content/relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `articles.ts`, `case-studies.ts` — no resolver logic changes; `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()`'s draft-inclusive behavior (§6, Problem 4) is read, not modified, by this review.
- `src/app/sitemap.ts`, `src/app/rss.xml/route.ts` — both already correct, both already reuse `SITE_URL`; zero change needed or proposed.
- `next.config.ts` — no image/experimental configuration is proposed (Image Optimization is out of scope, §8).
- `src/lib/constants/workspace-metadata.ts` — unrelated naming collision (§3), not touched.
- Any component under `src/components/` — this review's entire scope is `<head>`-level metadata, not rendered UI.

**New constants/helpers, if any**: none. `SITE_NAME` and `SITE_URL` (both already exist) are reused, not extended or duplicated.

**Later Milestone 8 work that must remain untouched by Task 8.1's own implementation**: Open Graph fields, Twitter/X fields, `alternates.canonical`, JSON-LD/structured data, `next/image` adoption beyond its current one real use, MDX image lazy-loading beyond its current `loading="lazy"` state, any Lighthouse tooling or CI step (§8, §19).

---

## 17. Verification Strategy

For a future implementation to confirm against, once built:

- **All 11 real routes** (§4's own matrix) — rendered `<title>` matches the corrected convention exactly; rendered `<meta name="description">` is unchanged from today's real, per-route text (only the title-suffix source changes, not description content, per §11).
- **Metadata inheritance** — confirm root layout's `title.default`/`title.template` actually applies to any route that would omit its own title (none does today, so this is a defensive/future-proofing check, not a currently-observable one) and that every real route's own explicit title fragment correctly composes with the template.
- **Dynamic route behavior** (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`) — every real document's title/description still resolves correctly post-change; the topic-branch title on `/knowledge/[topic]` also still resolves correctly.
- **Missing-slug behavior** — an invalid slug still returns `{}` from `generateMetadata()` and still correctly falls through to `notFound()` in the page body, unchanged.
- **Draft behavior** — if item 4 (§15) is implemented, verify via a manually-flagged `draft: true` test document (not authored as real content) that its `robots` value differs from a real published document's, and that no real published document's `robots` value changes.
- **Robots behavior** — `/search` continues to return exactly `{ index: false, follow: true }`, unchanged; 404 continues to rely on Next.js's own automatic `noindex` injection (confirmed still correct for this installed version, §13), not a manually-added field.
- **`metadataBase` verification without inventing a production URL**: confirmed via the local development/build fallback only (`SITE_URL`'s own documented `http://localhost:3000` default, §9) — inspect the rendered `<head>` for the presence and correct resolution of `metadataBase` against that local value; **no real production domain is invented, asserted, or hardcoded anywhere in this verification**, consistent with `SITE_URL`'s own existing, unresolved production-configuration caveat (§9).
- **Build**: `pnpm build` clean.
- **TypeScript**: `pnpm exec tsc --noEmit` clean.
- **ESLint**: `pnpm exec eslint` clean.
- **Regression**: `/`, `/knowledge`, all 8 topic pages, all 7 Knowledge article pages, `/work`, `/work/library`, all 4 Work pages, `/engineering-log`, both Engineering Log entry pages, `/about`, `/search`, `/rss.xml`, `/sitemap.xml`, an invalid route (404) — all unchanged in every respect *except* the title-suffix source and (if implemented) draft `robots` behavior.

---

## 18. Release Gate

Each criterion answerable as **PASS / FAIL / NOT APPLICABLE** by a later implementation agent:

1. Every one of the 11 real routes renders a `<title>` matching the corrected convention exactly.
2. No real route's rendered `<meta name="description">` content changed from its current, real text.
3. `metadataBase` is present in the rendered `<head>` and resolves correctly against the local `SITE_URL` fallback.
4. No `openGraph`, `twitter`, or `alternates.canonical` field appears anywhere in the diff.
5. No `<script type="application/ld+json">` appears anywhere in the diff.
6. `next.config.ts` is unchanged.
7. No `.mdx` content file is changed.
8. `src/lib/content/schema.ts` is unchanged.
9. No resolver file (`relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `articles.ts`, `case-studies.ts`) is changed.
10. `src/app/sitemap.ts` and `src/app/rss.xml/route.ts` are unchanged.
11. `/search`'s existing `robots` value is unchanged (`{ index: false, follow: true }`).
12. 404's automatic `noindex` behavior is unchanged (no manual `robots` field added to `not-found.tsx`).
13. If draft `robots` handling is implemented: a test draft document's `robots` differs from a real published document's; every real published document's `robots` value is unchanged from before the change.
14. No new file is created under `src/lib/metadata/` or `src/lib/seo/`.
15. No new npm dependency is added.
16. `pnpm exec eslint` — clean.
17. `pnpm exec tsc --noEmit` — clean.
18. `pnpm build` — clean.
19. Full regression sweep (§17's own route list) — all expected statuses, zero unrelated diff.

---

## 19. Explicit Non-Goals

Confirmed, none overridden by any evidence found this turn:

- No Open Graph implementation.
- No canonical URL implementation.
- No structured data / JSON-LD.
- No image optimization.
- No lazy-loading changes.
- No Lighthouse optimization.
- No redesign of page content.
- No unrelated route refactors.
- No changes to content frontmatter — every real document's `title`/`description` is already sufficient (§3, §11); nothing found requires a frontmatter schema or value change.
- No new metadata helper library (`src/lib/metadata/`/`src/lib/seo/` remain empty placeholders, untouched).
- No invented production domain or URL — `SITE_URL`'s own existing, documented value and caveat are used as-is (§9).
- No invented SEO metric or performance target — none is asserted anywhere in this document (§3's own length table is reported as neutral data, not a target).

---

## 20. Open Questions / Unresolved Dependencies

Named explicitly, not silently resolved:

**Q1 — What should the unified site-identity suffix actually say?** `"Engineering Portfolio"` (10 routes' current convention), `SITE_NAME` alone (`"Gracious Obeagu"`, the documented identity, already used 3 places), or a reconciled form (e.g., the homepage's own `"Engineering Workspace"` framing)? This is a real, user- and search-engine-visible naming decision (§10) this review's own evidence cannot make unilaterally — an editorial call, not an architectural one.

**Q2 — Should draft content receive a `robots: { index: false }` branch (§7, §15 item 4)?** Evidenced as low-cost and consistent with `/search`'s own precedent, but currently addresses a theoretical case (zero real drafts exist). Left for the implementation plan to decide explicitly.

**Q3 — Should `app/robots.ts` (site-wide robots.txt) be built as part of Task 8.1, a later Milestone 8 task, or not at all?** Not named anywhere in `docs/12`'s own Milestone 8 deliverable list; plausibly "Metadata" by Next's own file-convention taxonomy, plausibly its own separate concern. Not resolved here (§7, §8, §13).

**Q4 — Is `SITE_URL`'s production configuration actually guaranteed anywhere outside this repository (e.g., a hosting platform's own environment-variable dashboard)?** This repository contains no evidence either way (§9) — genuinely unknowable from source alone, named as a standing dependency on external, unverifiable deployment configuration.

**Q5 — Does the eventual Open Graph/Canonical-URLs task want per-route OG images, and if so, does that revive `public/og/`'s own already-created-but-empty directory (found during `docs/79`'s own review, re-confirmed still empty this turn)?** Out of this document's own scope entirely — named only so a future task doesn't have to rediscover that the directory already exists.

---

## 21. Final Recommendation

**Task 8.1's scope is Metadata, narrowly and precisely defined**: resolve the site-identity/title-suffix duplication (Problem 1), introduce `metadataBase` sourced from the already-existing `SITE_URL` (Problem 2), correct the vestigial root-layout fallback (Problem 3), and explicitly decide — during implementation planning, not here — whether draft-content `robots` handling (Problem 4) and a site-wide `app/robots.ts` (Q3) belong in this same pass or a later one. Every one of Open Graph, Twitter/X, Canonical URLs, Structured Data, Image Optimization, Lazy Loading, and Lighthouse optimization remains untouched, unimplemented, and unstubbed by this review, exactly as `docs/12`'s own separate deliverable list requires.

This review is grounded directly in the live repository (every file cited was read this turn, not assumed from `docs/79` or any other prior document) and in this exact installed Next.js version's own bundled documentation (`node_modules/next/dist/docs/`) for every claim about `metadataBase`, `title.template`, merging behavior, and default 404 `robots` behavior — not general web knowledge about "how Next.js usually works." Two real, user-visible decisions (Q1's exact identity wording, and Q2/Q3's draft/robots.txt scope) remain genuinely open and are named as such rather than silently resolved.

---

## Verification

```
git status --short
```

Confirmed:

```
?? docs/79-MILESTONE_8_ROADMAP_REVIEW.md
?? docs/80-METADATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
```

`docs/79` remains untracked from the prior task (it was never committed — this document's own earlier draft incorrectly assumed otherwise; corrected here rather than left inaccurate) and is not attributable to this task. No content, schema, resolver, route, component, or configuration file appears in the diff. The only file created by this task is `docs/80-METADATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md` itself.

**APPROVED — Metadata discovery and architecture review is complete and ready for implementation planning.**
