# 82 — Task 8.2 (Open Graph): Discovery and Architecture Review

## Status

Discovery and architecture review — design-stage only, no implementation authorized.

> No production code, content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or configuration file was created or modified to produce this document. No image asset was created. No Open Graph, Twitter Card, canonical URL, or Structured Data implementation was performed.

Opens execution of "Task 8.2 — Open Graph," this repository's own execution designation for the Open Graph deliverable in `docs/12`'s Milestone 8 list, following Task 8.1 (Metadata), complete and approved (`docs/81`).

---

## 1. Executive Conclusion

Task 8.1 left the repository in exactly the expected state (§2) — `SITE_NAME`/`SITE_URL`/`metadataBase`/the title template all exist and work; zero Open Graph or Twitter implementation exists anywhere (re-confirmed by direct grep this turn, not inherited from any prior document).

**The central finding of this review**: Open Graph's field architecture and its image strategy are two genuinely separable concerns, and the evidence for each points in different directions. The *field* architecture (title, description, type, url, siteName, article-specific fields) is fully buildable today — every real document already carries the exact data these fields want (`title`, `description`, `publishedAt`, `tags`, `topic`/`domain`), confirmed directly against this installed Next.js version's own TypeScript type definitions (§5, §11). The *image* strategy is not buildable today in any content-specific form — **zero of the 13 real documents across all three collections has any image at all** (§2, §10), and the one real image asset in the entire repository (`public/images/portrait.jpeg`, the About page's own portrait) is both the wrong aspect ratio for Open Graph use and semantically narrow (a personal photo, not representative of a Knowledge article or a Work case study).

**Recommendation**: build the Open Graph field architecture now, deliberately without `openGraph.images`/`twitter.images` populated — an honest, valid intermediate state, not a defect (§8, §9) — and treat image population as its own, explicitly-scoped follow-up, recommended toward generated (Option D) rather than photographed (Option A/B) imagery, for reasons stated in full in §8. Twitter Card metadata is recommended as part of this same task, not deferred (§7) — it costs nothing incremental once the Open Graph fields exist, and both this repository's own `docs/10-Technical Architecture.md` (bundles "Open Graph" and "Twitter Card" in one list) and `docs/06-CONTENT_STRATEGY.md` (names X/Twitter as a real intended content-repurposing channel) support building it now.

No implementation is authorized by this document.

---

## 2. Task 8.1 Baseline Verification

Directly re-checked against the live repository this turn, not assumed from `docs/81`:

| Assumption | Verified state |
|---|---|
| `SITE_NAME` is the site identity | **True** — `"Gracious Obeagu"`, unchanged, `src/lib/constants/site.ts` |
| `SITE_URL` exists | **True** — unchanged, `process.env.SITE_URL ?? "http://localhost:3000"` |
| `metadataBase` exists | **True** — `metadataBase: new URL(SITE_URL)`, `src/app/layout.tsx` line 46 |
| Root title template exists | **True** — `title: { default: SITE_NAME, template: `%s — ${SITE_NAME}` }` |
| Route metadata is centralized/consistent | **True** — every route's title is now a fragment completed by the root template (confirmed live during Task 8.1's own release gate); no route reintroduces a hardcoded suffix |
| Descriptions remain intact | **True** — every real route's description is byte-identical to pre-Task-8.1 |
| No Open Graph implementation exists yet | **True** — direct grep for `openGraph`, `og:`, `twitter`, across `src/` returns exactly two matches, both `metadataBase`-related comments/code in `layout.tsx`, zero `openGraph`/`twitter` fields anywhere |

**All seven assumptions hold. No discrepancy found.** `git status --short` at the start of this task showed the same 12 files modified by Task 8.1 (unstaged, uncommitted — consistent with every prior task this session) plus `docs/79`–`81` untracked, and nothing else.

---

## 3. Current Image Inventory

### Knowledge — 7 real articles

| Slug | `coverImage`? | Inline MDX image? | Image available? |
|---|---|---|---|
| `append-only-ledger` | No | No | **No** |
| `data-transfer-objects` | No | No | **No** |
| `how-jwt-works` | No | No | **No** |
| `idempotency` | No | No | **No** |
| `money-floating-point` | No | No | **No** |
| `optimistic-vs-pessimistic-locking` | No | No | **No** |
| `transactional-outbox` | No | No | **No** |

### Work — 4 real case studies

| Slug | `coverImage`? | Inline MDX image? | Image available? |
|---|---|---|---|
| `cookeaze` | No | No | **No** |
| `gohunt` | No | No | **No** |
| `haya` | No | No | **No** |
| `vaultpay` | No | No | **No** |

### Engineering Log — 2 real entries

| Slug | `coverImage`? | Inline MDX image? | Image available? |
|---|---|---|---|
| `cookeaze-webhook-reliability-gap` | No | No | **No** |
| `haya-invitation-gate-removal` | No | No | **No** |

**Confirmed by direct grep this turn**: `grep -rn "coverImage" content/` returns zero matches; `grep -rn '!\[' content/**/*.mdx` (markdown image syntax) returns zero matches. **Not assumed, not inferred from a partial sample** — every one of the 13 real documents was checked. `coverImage: z.string().optional()` exists on `articleFrontmatterSchema` (`schema.ts` line 27, shared by all three collections) — the schema anticipated this need; no author has ever used it.

**Title/description/publishedAt** — all real and already established (unchanged since `docs/80`'s own inventory, re-verified this turn against current frontmatter, zero drift).

---

## 4. Current Open Graph Inventory

Re-confirmed this turn, exhaustively, per this task's own "do not treat comments or documentation as implementation" instruction:

```
grep -rn "openGraph|og:title|og:description|og:image|og:url|og:type|twitter|images|metadataBase" src/
```

**Results, classified**:

| Match | File | Classification |
|---|---|---|
| `metadataBase: new URL(SITE_URL)` | `src/app/layout.tsx:46` | Real code — Task 8.1's own work, unrelated to Open Graph itself |
| `// ...metadataBase (above) has no effect...` | `src/app/layout.tsx:51` | A comment, not implementation |

**Zero `openGraph` field, zero `twitter` field, zero `og:*` literal string, zero `images` field on any `Metadata` object, anywhere in `src/`.** `docs/10-Technical Architecture.md` (an earlier, pre-implementation design document) names "Open Graph" and "Twitter Card" in a bulleted metadata list (§7 below) — correctly not counted as implementation, per this task's own explicit instruction.

---

## 5. Next.js 16.3.0 Semantics — Verified Against This Installed Version's Own Source and Docs

Read directly this turn: `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md` (the `openGraph`, `twitter`, `metadataBase`, "Merging"/"Overwriting"/"Inheriting" sections), `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md`, and the actual TypeScript type definitions at `node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts` — not general knowledge about "how Open Graph usually works."

### `openGraph` — exact shape

```ts
openGraph: {
  title?: string | TemplateString;
  description?: string;
  siteName?: string;
  url?: string | URL | null;
  images?: OGImage | OGImage[];
  locale?: string;
  type: 'website' | 'article' | 'profile' | 'book' | 'music.*' | 'video.*';
  // type: 'article' additionally supports:
  publishedTime?: string;
  modifiedTime?: string;
  expirationTime?: string;
  authors?: string | URL | (string | URL)[];
  section?: string;
  tags?: string | string[];
}
```

**A precise, load-bearing finding**: `OpenGraphArticle`'s own type (`opengraph-types.d.ts` line ~24) includes `tags` and `section` — and this repository's real content already carries exactly matching data: every document's own `frontmatter.tags` (already real, already required by schema) maps directly onto `openGraph.tags`; `frontmatter.topic` (Knowledge) or `frontmatter.domain` (Work) maps directly onto `openGraph.section`; `frontmatter.publishedAt` maps directly onto `openGraph.publishedTime`; `frontmatter.updatedAt` (already schema-optional) maps directly onto `openGraph.modifiedTime`. **No new data needs to be authored anywhere for the article-specific Open Graph fields — every value already exists in real frontmatter.**

### `images` — absolute-URL requirement, resolved by `metadataBase`

Per the docs' own example: `openGraph.images[].url` is documented as needing to resolve to an absolute URL, but a **relative** path (e.g. `/og-image.png`) is explicitly supported and composed against `metadataBase` — confirmed by the docs' own worked example (`images: '/og-image.png'` → `<meta property="og:image" content="https://acme.com/og-image.png" />`). Since Task 8.1 already established `metadataBase` (§2), any future OG image can be authored as a relative path without inventing a fully-qualified string anywhere in route code.

### `type: 'profile'` — exists, but requires data this repository doesn't structurally maintain

`OpenGraphProfile`'s own type (`opengraph-types.d.ts` line 42) requires `firstName`/`lastName`/`username`/`gender` to be meaningful. This repository maintains exactly one identity string (`SITE_NAME`, "Gracious Obeagu") — splitting it into `firstName`/`lastName` would be inventing structured data this repository doesn't already establish, and `gender` has no source anywhere. Evaluated and not recommended for `/about` (§11) on this basis.

### `twitter` — exact shape, and its `creator`/`site` fields specifically

```ts
twitter: {
  card?: 'summary' | 'summary_large_image' | 'player' | 'app';
  title?: string;
  description?: string;
  siteId?: string;
  creator?: string;
  creatorId?: string;
  images?: string | string[] | OGImage[];
}
```

`creator`/`site`/`siteId`/`creatorId` all require a real `@handle` or numeric ID. **No Twitter/X handle constant exists anywhere in this repository** (`GITHUB_URL`/`LINKEDIN_URL`/`CONTACT_EMAIL` exist; no `TWITTER_HANDLE` or equivalent, confirmed by direct grep) — these fields are correctly excluded from this plan's own future scope (§7), not silently invented.

### Merging — the one precise, load-bearing mechanic for this entire task

Confirmed directly against this version's own "Merging"/"Overwriting fields"/"Inheriting fields" documentation, re-read in full this turn (not re-derived from `docs/80`'s prior citation of the same sections, since `openGraph` specifically was not the field under test there):

- **If a child route does not define its own `openGraph` object at all, it fully inherits the root's entire `openGraph` object** — every field, verbatim.
- **If a child route defines any part of its own `openGraph` object, the entire object is replaced, not merged** — the docs' own worked example shows a child that sets only `openGraph.title` losing the parent's `openGraph.description` entirely, because the child's own `openGraph` object (containing only `title`) replaces the parent's wholesale.

**This is the single most consequential fact for §14's own architecture decision**: any dynamic detail route (Knowledge/Work/Engineering Log) that needs its own `openGraph.title`/`description`/`publishedTime` (which every one of them does) must re-specify its *entire* `openGraph` object in its own `generateMetadata()` — including `siteName`, `type`, and (once one exists) `images` — rather than relying on selectively inheriting only the pieces it doesn't override. Root cannot "seed" a partial `openGraph` default that dynamic children silently extend.

### `generateMetadata` — parent access

`generateMetadata`'s own second parameter, `parent: ResolvingMetadata`, is a promise of the already-resolved parent metadata — the docs' own example shows using it specifically to *extend* (not replace) a parent's `openGraph.images` array (`const previousImages = (await parent).openGraph?.images || []`). This is the one documented escape hatch from the "child replaces wholesale" rule above — available for a future implementation to use if root ever gains a real default image, not something this repository's current, image-less state has any use for yet.

---

## 6. Open Graph Scope — Restated as a Binding Boundary

Following `docs/80`/`docs/81`'s own established discipline of drawing this line explicitly rather than letting one Milestone 8 deliverable silently absorb another:

| Field | In scope for Task 8.2? |
|---|---|
| `openGraph.title`, `.description`, `.siteName`, `.type`, `.url`, `.images`, `.publishedTime`, `.modifiedTime`, `.authors`, `.section`, `.tags` | **Yes** |
| `twitter.card`, `.title`, `.description`, `.images` | **Yes** (§7) |
| `twitter.creator`, `.site`, `.creatorId`, `.siteId` | **No** — no real handle exists to populate them (§5) |
| `alternates.canonical` | **No** — Canonical URLs' own separate deliverable, even though `openGraph.url` (in scope) and `alternates.canonical` (out of scope) can look similar; kept distinct in §13 |
| JSON-LD (`<script type="application/ld+json">`) | **No** — Structured Data's own separate deliverable; a different mechanism entirely, not a `Metadata` object field |
| Actual OG/Twitter image asset creation | **Not by this document** — a follow-up, explicitly named (§9, §21) |
| `next/image`, lazy loading, `next.config.ts` image domains | **No** — Image Optimization's own separate deliverable |
| Lighthouse tooling | **No** |

---

## 7. Twitter/X Decision

**Recommendation: build Twitter Card metadata as part of this same Open Graph task, not a separate or deferred one.**

- **Historical precedent in this repository's own documents**: `docs/10-Technical Architecture.md` names "Open Graph" and "Twitter Card" together in one metadata bullet list — the earliest technical vision for this project already treated them as one unit of work, not two.
- **Real, evidenced intended use**: `docs/06-CONTENT_STRATEGY.md`'s own "repurposing" workflow explicitly names "X (Twitter)" as one of the channels this site's own content is meant to be shared to (alongside LinkedIn, Facebook) — a genuine, documented distribution intent, not a speculative "why not" addition.
- **Zero incremental content cost**: Twitter Card's own `title`/`description`/`images` fields reuse exactly the same values `openGraph` already establishes — no new prose, no new data.
- **What's correctly excluded**: `twitter.creator`/`twitter.site` (§5/§6) — no real `@handle` exists, and this document does not invent one.
- **Card type**: `summary_large_image` is the conventional choice paired with a 1200×630 image (§9); if the eventual image strategy lands on Option A's own single default image without that exact ratio, `summary` (a smaller, more forgiving square-ish card) remains available as a fallback — a decision for the eventual image-implementation task, not resolved here.

---

## 8. Image Strategy — Options Evaluated

### Option A — One shared default OG image

- Implementation complexity: **Very low** — one static file, one reference, reused everywhere.
- Visual quality: Generic — every real document (all 13) and the homepage would render an identical preview image; no differentiation between "The Ledger Pattern" and "VaultPay."
- Content coverage: 100% trivially (same image regardless of content).
- Maintenance: Trivial — one asset, changed rarely.
- Performance: Zero runtime cost — a static file.
- Reliability: High — no generation step, no failure mode.
- Compatibility with static generation: Perfect.
- Missing-image behavior: N/A (always present once the one file exists).
- Consistency: High, but at the direct cost of differentiation.
- Future extensibility: Low — doesn't grow into a richer per-document story without a rework.
- **Blocked today**: requires a real, designed image this document is explicitly instructed not to invent (§9).

### Option B — Content-specific images

- Content coverage: **0% today**, confirmed empirically across all 13 real documents (§3), not assumed. Fully infeasible as a standalone strategy right now.
- Every other axis is moot until coverage exists — not evaluated further; rejected on feasibility alone, not on any other merit.

### Option C — Hybrid (content-specific where suitable, shared default otherwise)

- Given Option B's own 0% real coverage, Option C **degrades exactly to Option A today** — there is nothing to hybridize with yet. Worth naming as the eventual, more mature destination once real per-document imagery exists (diagrams, architecture illustrations), but not a distinct, currently-actionable option from Option A.

### Option D — Generated OG images (Next's own `opengraph-image.tsx` file convention, `next/og`'s `ImageResponse`)

- Implementation complexity: **Moderate** — a real, new component per route segment (JSX + CSS, rendered via Satori), needs its own font-loading strategy (this repository's own Geist fonts are loaded via `next/font/google`, a different mechanism than `ImageResponse`'s own `fonts` option, which needs a raw font file read via `readFile` — a real, but well-precedented, implementation detail for whichever task builds this).
- Visual quality: **Potentially the best available option** — every card can render the real document title, section/topic, and this site's own visual identity, genuinely differentiated per document.
- Content coverage: **100%**, generated directly from data every document already has (title, topic/domain, description) — not blocked on missing photography the way Option B is.
- Maintenance: **Low ongoing burden** — zero per-document authoring once the template exists; every future Knowledge/Work/Engineering Log article automatically gets a correct, differentiated card.
- Performance: Per this exact installed Next.js version's own documentation, generated images are **statically optimized (built once, cached)** unless they use request-time data — this repository's entire content-detail surface is already 100% static/SSG (confirmed by Task 8.1's own build output, `● SSG` for every real document route), so this cost is a one-time build-time cost, not a runtime one.
- Reliability: High and deterministic — no external dependency, no "does this file exist" risk.
- Compatibility with static generation: Explicitly confirmed by Next's own docs for this exact use case.
- Missing-image behavior: N/A by construction — any route that adopts this convention always produces an image.
- Consistency: High — one shared template, per-document content.
- Future extensibility: **Excellent** — as the corpus grows (this milestone's own history shows steady content growth), zero additional design or photography work is ever needed.

**Recommendation: Option D is the correct target architecture** for the content-heavy routes (Knowledge/Work/Engineering Log detail pages, and plausibly the 8 Knowledge topic pages), on the strength of 100% coverage from data that already exists, zero ongoing authoring burden, and explicit static-generation compatibility. **Option A remains a legitimate, much cheaper interim state** for the handful of static/listing pages (`/`, `/about`, section-listing pages) where a generated per-document card adds little value over one well-designed shared image. **Neither is implemented by this document** — §9/§21 name this as explicit follow-up scope, and this task's own OG field architecture is deliberately designed to ship correctly with `images` unset in the meantime (§8's own opening finding, restated in §1).

---

## 9. Default OG Image — Not Created, Specified Only

Confirmed: no default OG image exists (`public/og/` is `.gitkeep`-only, confirmed unchanged since `docs/79`'s own original finding). Per this task's own explicit instruction, not created here. Specified for a future task:

- **Role**: the social-preview image for every static/listing route not covered by a generated, content-specific card (§8) — and, until any per-document strategy ships, the same functional role for every real document too.
- **Required dimensions/aspect ratio**: **1200×630px (1.91:1)** — cited directly from this installed Next.js version's own bundled documentation example (`node_modules/next/dist/docs/.../opengraph-image.md`'s own `ImageResponse` example, `size: { width: 1200, height: 630 }`), the same ratio the wider Open Graph/Twitter Card ecosystem documents this version's own example is itself drawn from — not invented by this document.
- **Where it should live**: `public/og/` — the directory already anticipates exactly this (`.gitkeep`-only, created during an earlier milestone per `docs/79`'s own finding), or, if Option D is adopted, `src/app/opengraph-image.tsx` (root) and per-segment equivalents, per Next's own file convention (§5) — the exact choice depends on which option (§8) is eventually implemented.
- **Generated or designed**: per §8's own recommendation, **generated** (Option D) for content-heavy routes; a **designed, static asset** (Option A) remains viable for the smaller set of listing/static pages, or as a faster interim step before Option D is built.
- **What later implementation work would be required**: for Option A — commissioning or designing one real image at the specified dimensions, adding it under `public/og/`, and wiring one `openGraph.images`/`twitter.images` reference at root (inherited by every route that doesn't override `openGraph`, per §5's own merging rule — meaning most static pages would get it "for free," while dynamic detail routes would each still need to explicitly re-include it per §5's "wholesale replacement" rule). For Option D — building the `opengraph-image.tsx` component(s), sourcing a font file compatible with `ImageResponse`, and deciding the exact visual template (title, section, brand mark) — none of which this document designs.

**No visual design is invented here** — only the dimensional/technical requirement, sourced directly from the installed framework's own documentation, not this document's own aesthetic judgment.

---

## 10. Content-Specific Image Feasibility

Calculated precisely from §3's own exhaustive inventory, not asserted:

| Collection | Documents with usable image | Documents without | Coverage |
|---|---:|---:|---:|
| Knowledge | 0 | 7 | **0%** |
| Work | 0 | 4 | **0%** |
| Engineering Log | 0 | 2 | **0%** |
| **Total** | **0** | **13** | **0%** |

**Would a content-specific strategy create inconsistent previews today?** The question is moot — there is no content-specific imagery to be inconsistent *with*; a strategy built on real per-document photography today would be building on nothing. Confirmed by exhaustive check, not sampled: every real `.mdx` file in all three collections was individually grepped for both `coverImage` frontmatter and inline markdown image syntax (§3), zero found in either.

---

## 11. OG Type Strategy

| Route(s) | `openGraph.type` | Why |
|---|---|---|
| `/` | `website` | The site's own entry point — not a single dated piece of content |
| `/knowledge`, `/work`, `/work/library`, `/engineering-log` | `website` | Listing/index pages — each represents a collection, not one authored, dated document |
| `/about` | `website` | Considered `profile` (§5) and rejected — would require inventing `firstName`/`lastName`/`gender` this repository has no structured source for beyond one combined `SITE_NAME` string |
| `/knowledge/[topic]` (8 real topics, sharing a route file with the article branch below) | `website` | A topic page is itself a listing of articles, not a single article, despite sharing `generateMetadata()`'s own function with the article branch — the two branches must diverge on `type`, not just on title/description |
| `/knowledge/[slug]` (7 real articles) | **`article`** | Each is a real, dated, authored document with a real `publishedAt` — `article:published_time`, `article:tags`, `article:section` are all real, already-existing frontmatter data (§5) |
| `/work/[slug]` (4 real case studies) | **`article`** | Same reasoning — real `publishedAt`, real `tags`, `domain` maps to `section` |
| `/engineering-log/[slug]` (2 real entries) | **`article`** | Same reasoning |
| `/search` | `website` | A query-driven results view, not content; robots exclusion unchanged (§16) |
| 404 | `website` (or omitted) | Not a canonical piece of content; already excluded from Sitemap |

**Not blindly `article` everywhere** — every listing/index page, including the topic-page branch that happens to share a file with an article-shaped branch, is `website`; only genuinely single-document, dated, authored pages use `article`.

---

## 12. Title/Description Strategy

**Recommendation: (A) inherit the existing metadata title/description automatically wherever possible; explicitly mirror them (B) only where Open Graph's own field shape requires a distinct value the plain `Metadata.title`/`.description` fields don't carry.**

- For every route, `openGraph.title` and `openGraph.description` should read the exact same underlying value the route's own `title`/`description` already resolves to (the fragment before the root template's suffix, and the real frontmatter/static description respectively) — **not** new, social-specific copy. This repository's own titles/descriptions are already specific, non-generic, real prose (`docs/80` §3/§11's own finding, unchanged) — there is no evidence anywhere that a *different* social-facing version would serve readers better, and inventing one would be exactly the "rewrite copy merely for SEO" this task explicitly warns against.
- **No route needs option (C)** — a genuinely different social-specific title/description — found anywhere in this review.
- One technical nuance: because `openGraph.title` accepts a plain string (not the same `template`/`default` object shape as the top-level `title` field, §5), a dynamic route's own `openGraph.title` should be written as the *fully resolved* string (e.g., `` `${frontmatter.title} — Knowledge` `` if consistency with the visible `<title>` is wanted) or just the bare document title (`frontmatter.title`) if a shorter, cleaner social title is preferred — a small, low-stakes implementation choice for the eventual build, not decided here since no evidence favors one over the other.

---

## 13. OG URL Strategy

- **`metadataBase`'s effect**: once set (already true, Task 8.1), any relative `openGraph.url` composes correctly into an absolute URL — confirmed against this version's own documented composition rules (§5). No route needs to manually interpolate `SITE_URL` into an OG URL string.
- **Should it be explicit or derived?** **Explicit, but relative** — e.g. `url: "/knowledge/idempotency"` for that article, `url: "/"` for the homepage — letting `metadataBase` do the absolute-URL composition, the same pattern already proven for RSS/Sitemap (both already use `SITE_URL` directly, unaffected by this recommendation).
- **Dynamic routes**: each `generateMetadata()` already knows its own `slug` — `openGraph.url` is a one-line, mechanical addition (`` `/knowledge/${slug}` `` etc.), no new data needed.
- **Listing pages**: yes, they need explicit URLs too (`/knowledge`, `/work`, etc.) — omitting `openGraph.url` doesn't break anything, but an explicit, correct value costs nothing and avoids relying on implicit request-URL inference.
- **Overlap with Canonical URLs — explicitly not conflated**: `openGraph.url` describes *which URL this content should be attributed to when shared socially*; `alternates.canonical` (a separate `Metadata` field, a separate Milestone 8 deliverable, §6) describes *which URL search engines should treat as authoritative for indexing*. They frequently hold the identical string in a simple, single-URL-per-document site like this one, but they are different fields serving different consumers (social platforms vs. search engines), and this document's own scope boundary (§6) means **only `openGraph.url` is in scope here — `alternates.canonical` is not added anywhere by this review's own recommendations.**

---

## 14. Metadata Merging — Root vs. Route-Specific

Per §5's own precise merging finding, applied concretely:

| Field | Root default? | Route-specific? | Why |
|---|---|---|---|
| `openGraph.siteName` | **Yes** | Inherited everywhere it isn't overridden | A true, unchanging site-wide fact (`SITE_NAME`) |
| `openGraph.locale` | **Yes** (`en_US`) | Inherited | No multi-locale content exists anywhere in this repository |
| `openGraph.type` | No sensible root default | **Every route must set its own** | `website` vs. `article` is a real, per-route fact (§11) — defaulting it at root would make every dynamic article page have to override anyway, and Next's own type system requires `type` to be present on every valid `OpenGraph` object |
| `openGraph.title`, `.description` | No root value | **Every route sets its own** | Root has no single title/description that makes sense as a fallback for a specific document (mirrors the same reasoning Task 8.1 already applied to the plain `description` field, §5 of `docs/81`) |
| `openGraph.url` | No root value | **Every route sets its own** | Each page's own real URL |
| `openGraph.images` | **Deferred entirely** (§8/§9) | N/A until an image strategy ships | Nothing to set at either level yet |
| `openGraph.publishedTime`/`.tags`/`.section`/`.authors` | No root value (not valid on `website`-typed root anyway) | **Only the `article`-typed dynamic routes** | Type-level constraint — these fields don't exist on the `website` variant of the `OpenGraph` union type at all (§5) |

**Would root-level fields accidentally leak into pages where they don't belong?** Only if a route defines *partial* `openGraph` object without including everything it needs — the exact risk §5's own "wholesale replacement" finding identifies. **Every dynamic route (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`) must therefore define a complete `openGraph` object of its own** (including `siteName`, even though it's also set at root) rather than assume partial inheritance — this is stated here explicitly so a future implementation doesn't discover it as a bug (a page silently missing `siteName` because it only set `title`/`description`/`type`).

---

## 15. Dynamic Route Behavior

For `/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]` — behavior traced, not modified:

| Case | Behavior |
|---|---|
| Valid document | Full `openGraph`/`twitter` object, per §11/§12/§13/§14 — `type: 'article'`, real title/description/url/publishedTime/tags/section |
| Missing/invalid slug | `generateMetadata()` already returns `{}` for this case (unmodified, Task 8.1) — under a future OG implementation, `{}` still means no `openGraph` override, so the page **fully inherits root's own `openGraph`** (§5's own "no `openGraph` at all → full inheritance" rule) — i.e., an invalid slug would render root's generic `website`-typed OG data, immediately followed by that page's own `notFound()` call, consistent with Task 8.1's own observed (not merely predicted) 404 behavior |
| Draft document | Unchanged from Task 8.1/`docs/80`'s own finding (§17 below) — `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` are not draft-filtered, so a draft document (none currently exist) would receive the same real, non-`noindex` `article`-typed OG metadata as a published one, exactly mirroring the identical, already-documented, already-deliberate architecture Task 8.1's own review found and explicitly declined to change |
| Static generation | No effect — `generateMetadata()`'s own resolution timing is unchanged; adding `openGraph` fields to an already-prerendered route doesn't change its `○`/`●` build classification |

**No route behavior is modified by this review.**

---

## 16. Static Route Behavior

| Route | OG meaningful? | Notes |
|---|---|---|
| `/` | Yes | Real, distinctive homepage description already exists (§12) |
| `/knowledge`, `/work`, `/work/library`, `/engineering-log` | Yes | Each has a real, specific listing description already |
| `/about` | Yes | Real, specific description already |
| `/search` | **Conditionally meaningful, robots unchanged** | `/search` already carries `robots: { index: false, follow: true }` (Task 8.1, unmodified here, §17). A search-results page being `noindex` for crawlers doesn't prevent a *person* from sharing a specific `/search?q=...` link directly (e.g., in a chat) and having it render a real preview — so `openGraph.title`/`.description` for the base `/search` page (not per-query) remain worth setting, exactly mirroring the page's own existing static metadata; **`robots` itself is not touched by this review** |
| 404 | Marginal | Already excluded from Sitemap; already auto-`noindex`ed by Next.js itself (Task 8.1's own confirmed finding) — an OG object here would rarely if ever be seen, since 404 pages aren't intentionally shared, but costs nothing to include for completeness if a future implementation chooses to |

**Not every page needs identical OG metadata** — confirmed precisely, not assumed uniform.

---

## 17. Draft Content — Investigated, Not Changed

Restated precisely from `docs/80`'s own already-established finding (re-verified unchanged this turn): `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` are **not** draft-filtered — a draft document (currently: zero real instances exist, re-confirmed by grep this turn) would be statically generated, directly reachable, and would receive real `article`-typed OG metadata identical to a published document's, with no `noindex` signal, exactly the same already-documented behavior Task 8.1's own review found and explicitly declined to resolve (finding 9 of that task's own prompt: *"must not be silently expanded into this task"*). **This review does not introduce draft-aware OG handling, and does not modify `robots` anywhere** — consistent with this task's own explicit instruction.

---

## 18. External Image Hosts

**Not applicable today.** §3/§10 confirm zero content-specific images exist anywhere, remote or local; the one real image asset (`public/images/portrait.jpeg`) is already local, already served from `public/`, no external host involved. `next.config.ts` remains empty — confirmed unchanged, no `images.remotePatterns`/`domains` configured. **If a future content-specific or externally-hosted image strategy is ever adopted, that would be a new implementation dependency for whichever task builds it** — named here as a standing "if this changes, configuration is required" fact, not a current blocker, since no evidence today calls for any remote image host at all.

**One relevant distinction, confirmed via §5's own research**: `openGraph.images`/`twitter.images` do **not** go through `next/image`'s own optimization pipeline — they're referenced directly as URLs in `<meta>` tags, read by external crawlers (Facebook, X, LinkedIn, Slack, etc.), not by this site's own rendering. `next.config.ts`'s `images` configuration (relevant to Image Optimization, a separate Milestone 8 deliverable, §6) has no bearing on Open Graph image URLs at all — a real, precise boundary worth stating so a future implementation doesn't conflate the two.

---

## 19. Performance

- **Static metadata generation** (root's `openGraph.siteName`/`.locale`): zero incremental cost — a plain object literal, same cost class as Task 8.1's own `title.template` addition.
- **Dynamic metadata generation** (`generateMetadata()` on the three dynamic routes): each already reads the exact same frontmatter object it already reads for `title`/`description` — adding `openGraph`/`twitter` fields costs zero additional filesystem reads, since `getArticleBySlug()`/`getCaseStudyBySlug()`/`getEngineeringLogEntryBySlug()` are each already called exactly once per request by the existing code, unmodified.
- **Image generation** (if Option D is later adopted): per §8's own citation of this version's own docs, statically optimized (build-time, cached) for this site's already-100%-static/SSG detail-page architecture — a one-time build cost, not a runtime one. Not incurred by this document, since no image work is implemented here.
- **Additional filesystem reads**: none introduced by the field architecture itself.
- **External image dependencies**: none (§18).
- **Build-time behavior**: no change beyond the same `pnpm build` already exercised by Task 8.1; a future OG-field implementation would still produce the same 33 static/SSG pages.
- **Runtime behavior**: no change — every affected route is already static or SSG; none becomes dynamic as a result of adding OG fields.

**No caching or new infrastructure is proposed** — none is evidenced as needed; the simplest architecture (plain object fields, reused existing data reads) is what this review recommends.

---

## 20. Search / RSS / Sitemap Impact

- **Search**: `search.ts`'s own `matchesQuery()` reads `title`/`description`/`tags` from `ContentItem` objects directly from the content layer — entirely independent of the `Metadata`/`generateMetadata()` surface this review concerns. **No effect.**
- **RSS**: `lib/content/rss.ts` builds its own XML `<title>`/`<description>`/`<link>` directly from frontmatter, never touching the `Metadata` API at all. **No effect.**
- **Sitemap**: `src/app/sitemap.ts` builds `MetadataRoute.Sitemap` entries directly from the same `getAll*()` resolvers, unrelated to `<head>` metadata. **No effect.**

**Verified, not assumed** — all three files were re-read this turn; none imports from or is imported by anything this review's own recommended fields would touch. The expected answer ("no") holds under direct inspection, exactly as this task's own instruction anticipated.

---

## 21. Accessibility

Open Graph metadata is not rendered page UI — it exists entirely in `<head>` `<meta>` tags, consumed by external crawlers/social platforms, never by a page's own visitor or any assistive technology reading the page's own DOM. **No UI is added for it, and none should be.** This review's own recommendations (§11–§14) touch zero rendered component, zero image `alt` text on any real page's own content, and zero accessibility-relevant markup. Page image `alt` text (e.g., `about-header.tsx`'s own `next/image` use) remains entirely governed by existing accessibility conventions this review does not touch. Social metadata and page accessibility are correctly, cleanly separate concerns here — confirmed, not merely asserted.

---

## 22. Exact Future Implementation Manifest

The smallest likely production footprint for the eventual Open Graph field implementation (not built by this document):

| File | Why it would change | What it would change | What must remain untouched |
|---|---|---|---|
| `src/app/layout.tsx` | Root-level OG/Twitter defaults (§14) | Add `openGraph: { siteName, locale, type: 'website' }`, `twitter: { card, title, description }` (no `images` yet, §8/§9) | `title`/`metadataBase`/`alternates.types` — Task 8.1's own work, unmodified |
| `src/app/page.tsx` | Homepage's own OG title/description/url/type | Add `openGraph`/`twitter` fields mirroring existing `title.absolute`/`description` (§12) | `title: { absolute: ... }` itself |
| `src/app/about/page.tsx`, `knowledge/page.tsx`, `work/page.tsx`, `work/library/page.tsx`, `engineering-log/page.tsx`, `search/page.tsx` | Each listing/static page's own OG fields | Add `openGraph`/`twitter` per §16 | Existing `title`/`description`/(`search/page.tsx`'s own `robots`, explicitly unmodified §17) |
| `src/app/not-found.tsx` | Marginal completeness (§16) | Optionally add a minimal `openGraph`/`twitter` object | Its own already-correct absence of a manual `robots` field (Task 8.1) |
| `src/app/knowledge/[slug]/page.tsx` | Both branches (topic, article) need diverging `type` (§11) and, for the article branch, the full article-shaped OG object (§5, §14) | `generateMetadata()`'s own return objects, both branches | Document loading, draft handling (§17), the `{}` fallback branch |
| `src/app/work/[slug]/page.tsx` | Same, single branch | `generateMetadata()`'s own return object | Same |
| `src/app/engineering-log/[slug]/page.tsx` | Same | `generateMetadata()`'s own return object | Same |

**Not expected to be needed**: any new file under `src/lib/metadata/`/`src/lib/seo/` (still empty, still no evidence a shared builder/helper is warranted — every field this review specifies is a direct, mechanical mapping from already-existing frontmatter, not complex enough to justify a new abstraction, matching Task 8.1's own explicit "no new metadata helper" precedent); any new site constant beyond what already exists (`SITE_NAME`, `SITE_URL`); any OG image asset (§9, explicit follow-up); `next.config.ts` (§18).

---

## 23. Release Gate (Design — for the Eventual Implementation, Not Executed Here)

Each criterion answerable **PASS / FAIL / NOT APPLICABLE** by a future implementation:

**Root/static pages**
1. `/` renders `og:site_name`, `og:type=website`, `og:title`, `og:description`, `og:url` matching its own existing `title`/`description`.
2. `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`, `/search` each render the same five fields, each matching that route's own existing `title`/`description`.
3. No route renders `og:image` unless a future, separately-approved image task has shipped one.

**Knowledge** (at least two real articles, e.g. `idempotency`, `transactional-outbox`)
4. `og:type=article`, `article:published_time` matches real `publishedAt`, `article:tag` values match real `tags`, `article:section` matches real `topic`.
5. Topic pages (e.g. `/knowledge/distributed-systems`) render `og:type=website`, not `article`.

**Work** (at least two real case studies, e.g. `vaultpay`, `cookeaze`)
6. `og:type=article`, `article:section` matches real `domain`.

**Engineering Log** (both real entries)
7. `og:type=article`, fields match real frontmatter for both `haya-invitation-gate-removal` and `cookeaze-webhook-reliability-gap`.

**Missing documents**
8. An invalid `/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]` each fall through to root's own inherited `openGraph` (website-typed), consistent with §15's own traced behavior, before their own `notFound()` renders 404.

**Images**
9. No broken `og:image`/`twitter:image` reference exists anywhere (trivially true while none is set).
10. If a future task adds an image: valid image renders correctly; a route without one falls back to root's inherited default (once one exists); the resolved URL is absolute (via `metadataBase`).

**Regression**
11. No `<link rel="canonical">` appears anywhere.
12. No `<script type="application/ld+json">` appears anywhere.
13. `/search`'s `robots` remains exactly `{ index: false, follow: true }`.
14. RSS item count unchanged (13).
15. Sitemap URL count unchanged (27).
16. Every one of Task 8.1's own already-verified titles remains unchanged.

**Automated**
17. `pnpm exec eslint` clean.
18. `pnpm exec tsc --noEmit` clean.
19. `pnpm build` clean, same 33-page static/SSG classification.

---

## 24. Risks

| # | Risk | Verification |
|---|---|---|
| 1 | Incorrect absolute image URLs | N/A while no image is set (§8/§9); once one is, gate item 10 |
| 2 | Broken `metadataBase` assumptions | Already proven correct for the one existing absolute-URL field (RSS `alternates.types`, Task 8.1); re-tested for any new relative OG URL at implementation time |
| 3 | Missing OG images read as a defect | Documented here explicitly as an intentional, valid intermediate state (§1, §8) — not a bug for a future reviewer to "fix" reflexively |
| 4 | Inconsistent image coverage | N/A — zero images exist anywhere yet, so no inconsistency is possible until a strategy ships |
| 5 | Incorrect `og:type` | §11's own table is the binding specification; gate items 4–7 test it per collection |
| 6 | Root metadata leaking into dynamic pages | §14's own "wholesale replacement" finding is the binding constraint — every dynamic route must define a complete `openGraph` object, not a partial one |
| 7 | Duplicated metadata | Every OG field is a direct read of already-existing frontmatter/title/description — no new duplicated string is introduced anywhere in this design |
| 8 | Accidental canonical implementation | §6/§13 draw the line explicitly — `openGraph.url` only, `alternates.canonical` never touched; gate item 11 |
| 9 | Accidental Structured Data implementation | §6 excludes it explicitly; gate item 12 |
| 10 | Draft content exposure | Unchanged, already-documented, already-deliberate behavior (§17) — not newly introduced or newly hidden by this review |
| 11 | Remote image-host problems | N/A — no remote image exists or is proposed (§18) |
| 12 | Build-time metadata failures | Every field is a plain, statically-typed literal or a direct frontmatter read — no new build-time computation is introduced |
| 13 | Social preview inconsistency | Mitigated by this review's own explicit decision to ship without images rather than a rushed, mismatched default (§1, §8) |
| 14 | Unnecessary image-generation complexity | Directly why this review does not implement Option D now, only recommends it as the evidenced future direction (§8) |
| 15 | Route-specific metadata regression | Gate item 16 — every Task 8.1 title verified unchanged |

---

## 25. Non-Goals

Confirmed, none overridden by any evidence found this turn:

- No canonical URLs, no `alternates.canonical`.
- No Structured Data / JSON-LD.
- No image optimization, no `next.config.ts` change.
- No lazy-loading change.
- No Lighthouse work.
- No redesign of content images — none exist to redesign (§3, §10).
- No content changes.
- No content frontmatter changes — every OG field this review specifies reads data that already exists; nothing requires a new frontmatter field or a new required value.
- No Search changes.
- No RSS changes.
- No Sitemap changes.
- No robots changes — `/search`'s existing exclusion and 404's automatic `noindex` are both read, not modified, anywhere in this review.
- No generic SEO abstraction — no new helper, builder, or `src/lib/metadata/`/`src/lib/seo/` file is recommended (§22).

---

## 26. Final Recommendation

Build the Open Graph field architecture (§11–§14) and Twitter Card metadata (§7) together, as this task's own scope, deliberately **without** `openGraph.images`/`twitter.images` populated — an honest, evidenced, zero-risk intermediate state, not a defect to be rushed past with a mismatched or invented image. Every field this review specifies reads data that already exists in real frontmatter or in the `SITE_NAME`/`SITE_URL` constants Task 8.1 already established; no new content, no new constant, no new abstraction is required. The image question (§8–§10) is fully investigated and has a clear, evidenced recommendation — Option D (generated, per-document cards) as the target, Option A (one static default) as a cheaper interim step — but is explicitly named as its own follow-up, not this task's own implementation.

This review is grounded directly in the live repository (every file cited was read this turn) and in this exact installed Next.js version's own bundled documentation and TypeScript type definitions (`node_modules/next/dist/docs/`, `node_modules/next/dist/lib/metadata/types/opengraph-types.d.ts`) for every claim about `openGraph`/`twitter` field shapes, merging behavior, and image-file conventions — not general web knowledge about "how Open Graph usually works."

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
```

The 12 modified `src/app/` files are Task 8.1's own already-approved, already-implemented output (`docs/81`), unmodified by this task — confirmed via `git diff --stat` showing zero additional change to any of them beyond what Task 8.1 itself produced. `docs/79`–`81` are prior tasks' own outputs. **Only `docs/82-OPEN_GRAPH_DISCOVERY_AND_ARCHITECTURE_REVIEW.md` is attributable to this task.**

---

## Final Report

1. **Discovery status**: complete; Task 8.1's baseline fully re-verified with zero discrepancy (§2).
2. **Current image situation**: zero images anywhere in real content (0/13, all three collections, exhaustively checked, §3/§10); the one real site image (`portrait.jpeg`) is wrong-shaped for OG use and semantically narrow.
3. **Current OG situation**: zero implementation anywhere, confirmed by direct grep, not assumed (§4).
4. **Recommended image strategy**: Option D (generated, per-document) as the target, Option A (single static default) as a cheaper interim step — neither implemented here, both explicitly scoped as follow-up (§8, §9).
5. **OG type strategy**: `website` for every listing/static page including the Knowledge topic-page branch; `article` for every real Knowledge/Work/Engineering Log detail document, using already-existing `publishedAt`/`tags`/`topic`/`domain` frontmatter (§11).
6. **Twitter/X decision**: build now, bundled with Open Graph — historically precedented (`docs/10`), a real intended distribution channel (`docs/06`), zero incremental cost; `creator`/`site` excluded (no real handle exists) (§7).
7. **OG URL strategy**: explicit, relative paths per route, composed via the already-existing `metadataBase`; kept distinct from the separate, still-deferred Canonical URLs deliverable (§13).
8. **Metadata merging strategy**: root supplies `siteName`/`locale` only; every dynamic route must define a complete `openGraph` object of its own, since Next's own merging replaces (not deep-merges) a child's partial `openGraph` object (§5, §14).
9. **Exact future implementation manifest**: 12 files, all already-existing `src/app/` metadata exports, zero new files, zero new abstractions (§22).
10. **Release gate**: 19 concrete, PASS/FAIL/NOT-APPLICABLE criteria (§23).
11. **Risks**: 15 named, each with a concrete verification (§24).
12. **Non-goals**: 13 restated, none overridden (§25).
13. **Git verification**: confirmed via `git status --short`; only `docs/82` attributable to this task; Task 8.1's own 12-file diff independently re-confirmed unchanged (§2, Verification section).

**APPROVED — Open Graph discovery and architecture review is complete and ready for implementation planning.**
