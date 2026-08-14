# 48 — Sitemap Experience

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.7's design proposal, following `docs/45-MILESTONE_6_REMAINING_WORK.md`'s reconciliation and `docs/46-RSS_EXPERIENCE.md`'s own RSS proposal — Sitemap is the last remaining Milestone 6 deliverable.

> **Numbering note**: this document was requested as `docs/48-SITEMAP_EXPERIENCE.md`, skipping `docs/47`. Confirmed by directory listing: `docs/47` does not exist anywhere in this repository. Recorded here rather than silently renumbered — this document uses the exact filename requested, per this task's own explicit instruction, and does not invent or claim a `docs/47` on its own initiative.

---

## 1. Purpose

`docs/12-Implementation Roadmap.md` names **Sitemap** as a Milestone 6 deliverable — the same flat, unelaborated bullet list that named RSS. `docs/10-Technical Architecture.md` adds three words: *"Generated automatically during build."* Unlike RSS, which had no first-class Next.js convention to build on (`docs/46` §2), **Sitemap has one** — this repository's own bundled Next.js 16.3.0 docs define a dedicated `sitemap.ts` metadata-file convention purpose-built for exactly this. Task 6.7 designs the sitemap this codebase's actual route tree supports, using that convention, resolving the same absolute-URL question `docs/46` already predicted this task would need to answer again.

---

## 2. A Terminology Distinction, Restated From `docs/45`, Not Reopened

Two different things share the word "Sitemap" in this repository, and this task's own authorization already named the distinction precisely:

- **`docs/03-SITEMAP.md`** — this repository's information-architecture document (navigation structure, page hierarchy, per-page content requirements). Confirmed by direct re-read this turn: its own Page Hierarchy section lists Knowledge (with eight topic branches — Backend, Security, System Design, Go, Python, Node.js, Architecture, Career, Teaching), Work (five named case studies), Engineering Log, and About. It does not mention Search or 404 anywhere — the identical silence `docs/43` §3 already found and recorded for 404; not a new discrepancy, just confirmed still true.
- **Milestone 6's "Sitemap" deliverable** — the machine-readable `/sitemap.xml` document search engines consume. This document's actual subject.

`docs/45` §7 already made this distinction explicitly; this document doesn't reopen the question, only continues from it.

---

## 3. Current State (Reconnaissance)

Verified against the actual repository this turn.

- **No sitemap exists.** No `src/app/sitemap.ts`, no `sitemap.xml` file, no route handler, no sitemap-building utility anywhere under `src/`.
- **No `robots.txt`/`robots.ts` exists either.** Directly relevant because a conventional `robots.txt` references its sitemap's URL (§10), but Robots is not itself named as a Milestone 6 deliverable in `docs/12`'s own list — the identical "related, not in scope" relationship `docs/45` §7 already drew between Sitemap and Robots.
- **No sitemap-related dependency is installed.** `package.json` contains no `next-sitemap` or equivalent package.
- **`next.config.ts` has no sitemap-related configuration.**

### The route tree, enumerated directly from the actual `src/app/` structure and its resolvers — not assumed

| Route shape | Source | Count today |
|---|---|---|
| `/` | Static | 1 |
| `/knowledge` | Static | 1 |
| `/knowledge/{topic}` | `TOPIC_SLUGS` (`lib/content/topics.ts`) — confirmed real, content-layer-owned, **not** `PLACEHOLDER_TOPICS` (a presentation-layer fixture `knowledge/[slug]/page.tsx`'s own `generateStaticParams()` also reads, for a different reason — see §6) | 8 |
| `/knowledge/{article-slug}` | `getAllArticles()` (`lib/content/articles.ts`) | Real, published count (drafts excluded — see §6) |
| `/work` | Static | 1 |
| `/work/library` | Static | 1 |
| `/work/{case-study-slug}` | `getAllCaseStudies()` (`lib/content/case-studies.ts`) — **not** `lib/content/work.ts` (§6) | 4 (VaultPay, GoHunt, Haya, Cookeaze) |
| `/engineering-log` | Static | 1 |
| `/engineering-log/{entry-slug}` | `getAllEngineeringLogEntries()` (`lib/content/engineering-logs.ts`) | 0 today — real, expected empty state, not an error (§9) |
| `/about` | Static | 1 |
| `/search` | Static, but see §7 — excluded | — |

**Confirmed absent, correctly**: no `/series/*` route exists anywhere in `src/app/` despite `docs/10`'s own Routing section listing `/series/system-design` as an architecture example — the `series` collection remains unregistered to any route (confirmed earlier this milestone, re-verified: `content/series/` is empty, no `app/series/` directory exists). A sitemap cannot list a URL that 404s; this is excluded by fact, not by policy.

### The same site-URL gap `docs/46` already predicted

Confirmed: `lib/metadata/`, `lib/seo/` are still `.gitkeep`-only; no `SITE_URL` constant exists anywhere in this repository as of this document. `docs/46` §7/D1 predicted exactly this moment: *"Sitemap... will need this exact same absolute-URL problem solved again, and Next's own first-class `sitemap.ts` metadata-file convention is typically statically generated and has no incoming request to derive an origin from at all."* That prediction is now directly confirmed against Next's own docs (§4) rather than only argued from first principles. This document does not modify RSS (per its own guardrail) — it depends on and reuses `docs/46`'s own already-recommended `SITE_URL` constant rather than proposing a second, competing one (§8).

---

## 4. Next.js Convention — Verified Against This Project's Own Bundled Docs

Confirmed via `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md` (Next.js 16.3.0, matching `package.json`), not assumed from general Next.js familiarity, per `AGENTS.md`'s standing instruction:

- **`app/sitemap.ts`** is a real, first-class, documented metadata-file convention — a default-exported function returning `MetadataRoute.Sitemap`, an array of `{ url: string; lastModified?: string | Date; changeFrequency?: 'always'|'hourly'|'daily'|'weekly'|'monthly'|'yearly'|'never'; priority?: number; alternates?: { languages?: ... } }`. This is a genuinely different situation from RSS's (`docs/46` §2) — no Route Handler needs to be hand-built; Next.js already knows what a sitemap is.
- **Cached by default**, per the doc's own "Good to know," unless the function uses a request-time API or dynamic-config option — this repository's content-resolver reads (`getAllArticles()` etc., all pure filesystem reads with no request dependency) don't need dynamic behavior, so the framework's own default caching applies without this proposal needing to opt out of anything.
- **`generateSitemaps()`** (splitting output across multiple sitemap files, keyed by `id`) exists for large-scale applications — the doc's own example computes ranges against a 50,000-URL-per-file limit. **Not relevant here.** This repository's entire route inventory (§3) totals under twenty URLs today. Reaching for multi-file splitting now would be exactly the "abstraction built before a second real need justifies it" `docs/24` Principle 2 already warns against elsewhere in this codebase — a single `sitemap.ts` returning one array is the correct, proportionate choice.
- **`url` values must be fully absolute strings** in every example the documentation gives (`'https://acme.com'`, never a relative path) — confirming §3's finding that this task cannot be built without an absolute site origin, the same conclusion `docs/46` already reached for RSS.
- **`metadataBase` does not solve this for `sitemap.ts`.** Worth stating plainly since it's an easy adjacent field to reach for: `metadataBase` (Next's Metadata API field for auto-resolving *relative* URLs used elsewhere in `generateMetadata`) has no bearing on `sitemap.ts`'s own returned `url` values, which the documentation's own examples always write out fully qualified. The sitemap needs its own explicit absolute-URL source regardless of whether `metadataBase` is ever set elsewhere (a Milestone 8 concern, not this task's).

---

## 5. Discrepancies Found

- **None found in `docs/12`/`docs/10` themselves for this deliverable** — both are silent on implementation mechanism (as expected; neither document ever specifies *how*, only *that*, for any Milestone 6 item), and Next's own convention (§4) fills that gap cleanly.
- **`docs/10`'s Routing section lists a route (`/series/system-design`) that doesn't exist in the actual application** — recorded in §3, not silently corrected. This doesn't block Sitemap's design; it simply confirms that route is correctly excluded from the real route inventory this proposal builds from.
- No other discrepancy found.

---

## 6. Authoritative Data Sources — Confirmed, Not Assumed

Per this task's own explicit instruction to verify Work's sitemap entries don't come from `lib/content/work.ts`/`PLACEHOLDER_WORK`:

**Confirmed: `lib/content/work.ts`'s `getFeaturedCaseStudies()`/`getProjectLibrary()` are not used anywhere in this proposal.** The correct, real source is `getAllCaseStudies()` (`lib/content/case-studies.ts`), reading `content/work/*.mdx` directly — the same resolver `docs/46` §2/§6 already confirmed and re-verified for RSS, and the same one `app/work/[slug]/page.tsx` itself uses to render those pages. A sitemap entry pointing at a URL is a lower-stakes correctness question than RSS's own (no description text is being syndicated — just a URL and an optional date), but the underlying discipline is identical: **read from the collection that actually backs the live route, never a parallel fixture that merely happens to share its titles.**

**Draft filtering — a distinct, sitemap-specific correctness point.** `getArticleSlugs()`, `getCaseStudySlugs()`, and `getEngineeringLogSlugs()` (confirmed by direct read, all three) each return `getSlugs(collection)` directly — **no draft filtering.** These three functions exist for `generateStaticParams()`'s own purpose (Next needs to know every slug that should get a build-time route, including drafts, so visiting a draft's URL directly still resolves rather than 404ing during preview/review). **A sitemap must not use these.** The correct sources are the same draft-filtered `getAllArticles()` / `getAllCaseStudies()` / `getAllEngineeringLogEntries()` this proposal already commits to for Work (and that `docs/46` already committed to for RSS) — each already calls `filterDrafts()` internally. This is worth stating as its own, explicit finding: it would be easy to reach for `getArticleSlugs()` out of habit (it's the function literally named for "give me every slug"), and doing so would silently advertise draft content to search engines. Named here so an implementation plan doesn't discover it as a live bug.

**Topic pages**: `TOPIC_SLUGS` (`lib/content/topics.ts`) — confirmed the real, content-layer-owned constant, distinct from `PLACEHOLDER_TOPICS` (a presentation-layer fixture `knowledge/[slug]/page.tsx`'s own `generateStaticParams()` reads for its own, different reason — build-time route generation, the identical relationship `getArticleSlugs()` has to drafts, not a content-authority question). `TOPIC_SLUGS` is the fixed, eight-item, already-validated-by-schema vocabulary (`topicSchema = z.enum(TOPIC_SLUGS)`) — using it directly, rather than `PLACEHOLDER_TOPICS`, is the same "prefer the content-layer source of truth over a presentation fixture" discipline applied to a taxonomy instead of a document collection.

---

## 7. Route Inclusion — Justified, Not Assumed

### Included

All entries in §3's table except `/search` (below) — every static top-level page, every real topic page, every real published Knowledge/Work/Engineering-Log document.

### Excluded — each with a specific, evidenced reason

| Route | Included? | Why |
|---|---|---|
| `/search` (and any `?q=` variant) | **No** | `app/search/page.tsx`'s own `export const metadata` already declares `robots: { index: false, follow: true }` — confirmed by direct re-read this turn, unchanged since Task 6.4 (`docs/42` WI-8). A sitemap's entire purpose is telling search engines "please index this" — listing a page that simultaneously says "please don't index this" is directly contradictory, and major search engines explicitly advise against including `noindex` pages in a sitemap. This isn't a new policy this proposal invents; it's a direct, mechanical consequence of a decision already made and shipped. |
| `/404` (not-found) | No | Not a real, canonical content location — no sitemap convention anywhere lists error pages, and this route has no fixed URL a search engine could usefully crawl to (it renders for *any* unmatched path). |
| `/rss.xml` | No, by default — see Open Question Q1 | Some sites do list their own feed in their sitemap; most don't, since a sitemap communicates *pages*, and a feed is already self-describing and auto-discoverable through its own mechanism (`docs/46` §11's `alternates.types`). Not firmly decided either way here — flagged as Q1 rather than assumed, since reasonable real-world sites do it both ways. |
| `series`, `technologies` | No | Same fact-based exclusion `docs/42`/`docs/46` already applied: both collections are empty and routeless — confirmed again this turn (§3) — there is no URL to include. |
| Any individual draft document | No | Excluded structurally by using the draft-filtered resolvers (§6), not by a per-item check this proposal has to design. |

---

## 8. The Site URL Gap — Reusing, Not Reinventing, `docs/46`'s Own Answer

This task's own guardrails forbid modifying RSS. This proposal does not touch `docs/46` or introduce a second, competing `SITE_URL` decision — it **depends on and reuses** the exact constant `docs/46` §7/D1 already recommended (a plain, unprefixed `SITE_URL` — not `NEXT_PUBLIC_SITE_URL` — since both RSS's Route Handler and Sitemap's own metadata-file function are 100% server-only code, confirmed for Sitemap the same way `docs/46` already confirmed it for RSS: `sitemap.ts`'s exported function is never shipped to a browser).

**A real sequencing consequence, worth stating plainly**: whichever of RSS or Sitemap is implemented first is the one whose implementation plan actually introduces the `SITE_URL` constant; the second one imports it, unmodified. This proposal does not decide that order on its own (§12 leaves it explicit, not assumed) — but it does mean neither future implementation plan should treat `SITE_URL` as "that task's own new file" without first checking whether the other one already added it.

**Local development, restated from `docs/46` because it applies identically here**: a documented fallback (e.g. `http://localhost:3000`) when `SITE_URL` is unset keeps `pnpm dev`/`pnpm build` working without new required local configuration — `docs/12` Milestone 1's own "no environment validation layer until first needed" restraint, honored the same way for this second consumer of the same value.

---

## 9. `lastModified`, `changeFrequency`, `priority` — What's Honest to Claim

### `lastModified`

- **Content-backed pages** (Knowledge articles, case studies, log entries): `frontmatter.updatedAt ?? frontmatter.publishedAt` — the first real use of `updatedAt` anywhere in this codebase's own output. Worth contrasting directly with `docs/46`'s own RSS design: RSS's `<pubDate>` deliberately uses only `publishedAt` (D2/§9 there) because RSS's `pubDate` element means "when this was published," not "when this last changed" — a sitemap's `lastModified` means the latter, so the two proposals correctly reach different answers for what look like similar fields, for a real semantic reason, not an inconsistency between them.
- **Topic pages**: no real "last modified" signal exists for a fixed taxonomy entry — omitting `lastModified` (an optional field) is the honest choice, rather than fabricating one. Flagged as Q2 rather than silently defaulted.
- **Static singular pages** (`/`, `/knowledge`, `/work`, `/about`, etc.): no per-page modification tracking exists anywhere in this codebase — confirmed: `WORKSPACE_METADATA`'s own "Last updated" field (`lib/constants/workspace-metadata.ts`, rendered in `Footer`) is already a static placeholder value, not a real timestamp. Fabricating a `lastModified` date for these pages would be exactly the kind of invented claim this repository's own discipline (`docs/39`, `docs/43`, every task since) has consistently refused to make. Omitting the field, or using the sitemap's own build time (an honest "this is when the sitemap was generated," not a claim about the page's content), are both legitimate options — left as Q2, not decided here.

### `changeFrequency` / `priority`

Both fields are optional, and worth naming honestly rather than treating as load-bearing: major search engines have publicly stated they mostly ignore both in practice. Including them isn't harmful, but claiming a specific `changeFrequency` (e.g. `"weekly"`) for a page with no actual update cadence tracked anywhere would be an unverifiable claim, the same category of thing this repository has avoided everywhere else. If included at all, a coarse, defensible tiering (home highest, index pages next, detail pages lower) is the recommended shape — the exact values are an implementation-task decision (Q3), not fixed here, matching this series' own established pattern for presentational judgment calls (`docs/39`/`docs/40`'s precedent).

---

## 10. Robots — Adjacent, Confirmed Out of Scope

`docs/10`'s own "Robots" section (*"Configured automatically"*) sits immediately after its "Sitemap" section, and a conventional `robots.txt` references its sitemap's URL (confirmed, §4: `sitemap: 'https://acme.com/sitemap.xml'` in Next's own `robots.ts` example). **`docs/12`'s Milestone 6 deliverable list names only "Sitemap," not "Robots"** — the identical distinction `docs/45` §7 already drew, re-confirmed here rather than assumed. This proposal does not design `robots.ts`. Worth recording as a real, near-zero-cost future addition once this sitemap exists (a future `robots.ts` would simply point at `${SITE_URL}/sitemap.xml`), not something this document's own scope expands to cover.

---

## 11. Component Reuse

| Existing Asset | Purpose | Reuse? |
|---|---|---|
| `getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` | Draft-filtered content sources | Yes, unmodified — this task's own guardrail (no content-loader changes) is also the correct call |
| `TOPIC_SLUGS` (`lib/content/topics.ts`) | The eight real topic-page slugs | Yes, unmodified |
| `docs/46`'s recommended `SITE_URL` constant | Absolute URL base | Reused conceptually — not modified, not duplicated (§8) |

Nothing existing produces `MetadataRoute.Sitemap`-shaped entries directly — `ResolvedArticleSummary` (Search/relationship resolvers) carries a pre-formatted display date string and presentation-only fields (`readingTime`, `difficulty`) with no bearing on a sitemap entry; RSS's own normalization step (`docs/46` §9) is XML-item-shaped, not sitemap-entry-shaped. A small, purpose-built mapping from each `ContentItem` to `{ url, lastModified }` is genuinely new, minimal code — not a rejection of reuse, the same "reuse the resolvers, write only the output shape that's actually different" conclusion `docs/46` §12 already reached for RSS.

---

## 12. Implementation Scope

### Must implement

- `src/app/sitemap.ts` — a single, non-split `MetadataRoute.Sitemap`-returning function, per §4/§7.
- The `SITE_URL` constant, if RSS's own implementation hasn't already introduced it (§8) — this proposal's implementation plan must check for it rather than assume either way.
- `lastModified` sourcing per §9 for content-backed entries.

### May implement if already supported by existing infrastructure

- `changeFrequency`/`priority`, at whatever coarse tiering an implementation plan settles on (§9, Q3) — optional per Next's own type.

### Explicitly deferred / out of scope

- `robots.ts` (§10) — a related, future, near-zero-cost addition, not this task's.
- Any change to RSS, Header, Footer, or navigation — this task's own explicit guardrails.
- Multi-file sitemap splitting (`generateSitemaps()`) — not justified at this content volume (§4).
- `/rss.xml`'s own inclusion in the sitemap (Q1) — a real but undecided question, not silently resolved either way.

---

## 13. Verification Plan

### Functional
- `/sitemap.xml` returns a valid Sitemaps-protocol XML document.
- Every `<loc>` is a real, resolvable, absolute URL matching an actual route in this application — no `/series/*`, no draft slug, no `/search`, no `/404`.
- Case-study entries are confirmed sourced from `case-studies.ts` (verified the same direct way `docs/46`/`docs/42` already verified their own Work data source — checking the entries reflect real MDX content, not `PLACEHOLDER_WORK`'s own drifted values).
- Topic entries match `TOPIC_SLUGS` exactly (8 entries).

### Technical
`pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — the same bar every prior Core Pages/infrastructure task has held to.

### Regression
RSS, Header, Footer, navigation, and every existing content loader remain unchanged.

---

## 14. Acceptance Criteria

- Sitemap's route inventory (§3/§7) is derived from the actual `src/app/` tree and real resolvers, not assumed from `docs/03`/`docs/10` alone.
- Work's sitemap entries are confirmed sourced from `case-studies.ts`, never `lib/content/work.ts` (§6).
- The draft-filtering distinction between `getArticleSlugs()`-family functions and `getAllArticles()`-family functions is stated explicitly enough that an implementation plan can't rediscover it as a live bug (§6).
- `/search`'s exclusion is grounded in its own already-shipped `robots: noindex` declaration, not an assumed policy (§7).
- The `SITE_URL` dependency on `docs/46` is stated as a reuse, not a second, competing constant (§8).
- No production code, component, route, or content was modified to produce this document.

---

## 15. Open Questions

**Q1 — Should `/rss.xml` itself appear as a sitemap entry?**
*Why it matters:* real, observed practice varies across real-world sites; no convention in this repository's own documents settles it either way. *What's blocked:* nothing — the sitemap is complete and correct without deciding this. *Evidence needed:* an implementation-task or editorial decision, not resolvable from this repository alone.

**Q2 — Should static/topic pages carry a `lastModified` value at all, and if so, sourced how?**
*Why it matters:* affects whether those entries include the field or omit it; doesn't change the sitemap's correctness either way (§9). *What's blocked:* nothing. *Evidence needed:* a decision on whether "build time" is an honest enough proxy, or whether omission is preferred — an implementation-task call.

**Q3 — Should `changeFrequency`/`priority` be included at all, given their limited real-world effect?**
*Why it matters:* a cosmetic completeness question, not a functional one (§9). *What's blocked:* nothing. *Evidence needed:* none required to proceed either way.

**Q4 — Which of RSS or Sitemap gets implemented first, given the shared `SITE_URL` dependency (§8)?**
*Why it matters:* determines which implementation plan actually introduces the constant. *What's blocked:* nothing in either proposal's own architecture — both are correct regardless of order. *Evidence needed:* a sequencing decision at authorization time, not something either design proposal settles unilaterally.

---

## 16. Final Recommendation

**Recommended architecture:** a single `src/app/sitemap.ts`, using Next's own first-class metadata-file convention (no Route Handler, no new dependency, no multi-file splitting at this content volume), enumerating every real static page, all eight real topic pages (`TOPIC_SLUGS`), and every real, published, draft-filtered Knowledge/Work/Engineering-Log document — reading Work's entries from `case-studies.ts`, never `lib/content/work.ts`, and explicitly avoiding the un-filtered `getArticleSlugs()`-family functions that exist for a different, build-time purpose. `/search` is excluded on direct evidence (its own already-shipped `noindex`), not assumption. The one new piece of shared infrastructure this task depends on — `SITE_URL` — is not reinvented here; it's the same constant `docs/46` already recommended, reused.

**Recommended implementation sequence**, once approved (and once Q4's ordering is settled):
1. `SITE_URL` constant, if not already introduced by RSS's own implementation.
2. `src/app/sitemap.ts` — route enumeration, `lastModified` sourcing, optional `changeFrequency`/`priority`.
3. Full verification pass (§13), including the direct Work-data-source check.

**Known risks:**
- The draft-filtering trap (§6) is easy to hit by reaching for the "obviously named" `getArticleSlugs()` instead of `getAllArticles()` — named directly so an implementation plan doesn't rediscover it live.
- Q4's sequencing question means this proposal's own §12 "must implement" list has one conditional item (`SITE_URL`) whose owner isn't fixed by this document alone.

**This document authorizes no implementation.** Task 6.7's actual build requires its own implementation plan and approval, following the same workflow every prior milestone in this repository has used. Once both RSS and Sitemap are implemented and verified, Milestone 6 — Core Pages will have no remaining deliverables from `docs/12`'s own list.
