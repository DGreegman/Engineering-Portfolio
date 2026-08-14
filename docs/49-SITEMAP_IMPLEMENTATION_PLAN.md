# 49 — Sitemap Implementation Plan

## Status

Implementation Plan — translating the approved `docs/48-SITEMAP_EXPERIENCE.md` into a precise, implementation-ready specification, re-inspected against the repository's current state now that RSS (Task 6.6) is implemented.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/48` establishes *what* Task 6.7 should do and *why* — Next's own first-class `sitemap.ts` convention, a route inventory derived from the actual `src/app/` tree, and a dependency on the `SITE_URL` constant `docs/46`/`docs/47` predicted Sitemap would need. That prediction has now been fulfilled: RSS is implemented and approved, and `SITE_URL` is live in `lib/constants/site.ts`. This document establishes exactly what changes, file by file, re-verifying every fact `docs/48` relied on against the repository's current state rather than trusting it unchanged.

---

## 2. Authoritative Inputs & Constraints

`docs/48-SITEMAP_EXPERIENCE.md` is the architecture authority. Carried forward unchanged:

- **`src/app/sitemap.ts`**, Next's own first-class metadata-file convention — no Route Handler, no manual XML, no dependency (`docs/48` §4).
- **Three content-backed collections**: Knowledge, Work (Case Studies — `case-studies.ts`, never `work.ts`), Engineering Log (`docs/48` §6/§9).
- **Eight real topic pages**, sourced from `TOPIC_SLUGS` (`lib/content/topics.ts`), never `PLACEHOLDER_TOPICS` (`docs/48` §6).
- **`/search` excluded** — its own shipped `robots: { index: false }` (`docs/48` §7).
- **`SITE_URL` reused, not reinvented** — `docs/48` §8/Q4 explicitly deferred to whichever of RSS/Sitemap implemented first. RSS did (`docs/47`). This plan imports the existing constant.
- **No `generateSitemaps()` splitting** — not justified at this repository's URL count (`docs/48` §4).

---

## 3. Re-Inspection Findings — The Repository Has Changed Since `docs/48`

Re-verified directly against the actual repository this turn, not relied on from `docs/48` alone, per this task's own explicit instruction.

### `SITE_URL` — now real, confirmed exact shape

```ts
// src/lib/constants/site.ts, confirmed by direct read
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";
```

Unprefixed, exactly as `docs/46`/`docs/47` specified. **This plan imports this constant directly — it does not create `SITEMAP_SITE_URL`, a second environment variable, or move `SITE_URL` to a different file.** `RSS_PATH`, `SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `FOOTER_CLOSING_MESSAGE` all confirmed present and unchanged in the same file.

### RSS's actual implementation — evaluated for reuse, not blindly copied

Confirmed by direct read of `lib/content/rss.ts`, `app/rss.xml/route.ts`, `app/layout.tsx`:

- **`getFeedItems()`/`toFeedItem()`/`buildRssXml()` are not directly reusable for Sitemap**, and this is a real finding, not an oversight: RSS's `FeedItem` shape carries `title`, `description`, `pubDate` (as an RSS-item concept), `guid`, `category` — fields a `MetadataRoute.Sitemap` entry (`{ url, lastModified? }`) has no use for. `buildRssXml()` is XML-string serialization; `sitemap.ts` returns a plain array Next.js itself serializes. Forcing a shared abstraction across these two shapes would be exactly the "generalized SEO content model" this task's own instruction (§23) warns against building.
- **What genuinely is shared**: the *pattern* — read a real `getAllX()` resolver, build `${SITE_URL}${path}` using the same path convention `toSummary()`/`toCaseStudySummary()`/`toEngineeringLogArticleSummary()`/RSS's own `toFeedItem()` all independently already use (`/knowledge/{slug}`, `/work/{slug}`, `/engineering-log/{slug}`). This is reused as a convention, the same way every one of those four prior files already reuses it independently rather than through a shared helper (see §7's own route-helper evaluation for why this plan doesn't change that).
- **No refactor of RSS is needed or proposed.** `docs/47`'s own implementation is left exactly as shipped.

### Route tree — re-confirmed, no drift since `docs/48`

`src/app/` (confirmed by directory listing): `about/`, `engineering-log/` (+`[slug]/`), `knowledge/` (+`[slug]/`), `rss.xml/` (new since `docs/48`), `search/`, `work/` (+`library/`, +`[slug]/`), plus root `page.tsx`/`not-found.tsx`/`layout.tsx`. No `app/series/`, `app/technologies/`, `app/pages/` — confirmed absent. No topic-specific route folder — topics resolve through the single `knowledge/[slug]` dynamic route, unchanged.

### Draft-filtering semantics — re-confirmed byte-for-byte

`getArticleSlugs()`/`getCaseStudySlugs()`/`getEngineeringLogSlugs()` (confirmed, all three) still call raw `getSlugs(collection)` — no `filterDrafts()`. `getAllArticles()`/`getAllCaseStudies()`/`getAllEngineeringLogEntries()` (confirmed, all three) still call `filterDrafts(getAll(...))` internally. **Unchanged since `docs/48`; this plan uses the same draft-filtered resolvers RSS already uses.**

### Indexability — re-confirmed for every candidate static page

| Route | `robots` directive | Indexable? |
|---|---|---|
| `/` | None (confirmed, `app/page.tsx`) | Yes |
| `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about` | None (each confirmed) | Yes |
| `/knowledge/{topic}`, `/knowledge/{article}` | None found in `generateMetadata` (confirmed, `knowledge/[slug]/page.tsx`) | Yes |
| `/search` | `robots: { index: false, follow: true }` (confirmed, unchanged since Task 6.4) | **No** |
| `/rss.xml` | N/A — not an HTML page | Excluded (§6, a decision this plan makes explicitly, resolving `docs/48` Q1) |
| 404 (`not-found.tsx`) | N/A — not a canonical URL at all | Excluded structurally, not by a robots check |

No discrepancy found between this turn's re-inspection and `docs/48`'s own findings anywhere.

---

## 4. URL Corpus — Rebuilt From the Current Tree

| Category | Source | Count (current) |
|---|---|---|
| Static pages | Hand-enumerated (§6) | 6 (`/`, `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`) |
| Topic pages | `TOPIC_SLUGS` (`lib/content/topics.ts`) | 8 |
| Knowledge articles | `getAllArticles()` | 4 (current published count) |
| Work / Case Studies | `getAllCaseStudies()` | 4 (VaultPay, GoHunt, Haya, Cookeaze) |
| Engineering Log entries | `getAllEngineeringLogEntries()` | 0 (real, valid empty state — §11) |
| **Total** | | **22** |

Confirms `docs/48`'s own "roughly 20 total URLs" estimate — re-derived from the live tree, not assumed.

---

## 5. Route Inclusion — Confirmed, Not Assumed

| Route(s) | Included? | Evidence |
|---|---|---|
| `/`, `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about` | Yes | Real, static, no `robots` directive (§3) |
| `/knowledge/{topic}` × 8 | Yes | `TOPIC_SLUGS`, real, indexable (§3) |
| `/knowledge/{article}` | Yes, per published item | `getAllArticles()`, draft-filtered |
| `/work/{case-study}` | Yes, per published item | `getAllCaseStudies()`, draft-filtered — **never `work.ts`** |
| `/engineering-log/{entry}` | Yes, per published item (0 today) | `getAllEngineeringLogEntries()`, draft-filtered |
| `/search` | **No** | Own shipped `robots: { index: false }` (§3) |
| `/rss.xml` | **No** — decided here, resolving `docs/48` Q1 | A sitemap communicates crawlable HTML pages; a feed is a different resource type with its own discovery mechanism already shipped (`layout.tsx`'s `alternates.types`, `docs/47` WI-5). Mixing it into the page-sitemap is non-standard and not required by any document this task is grounded in. |
| Any draft Knowledge/Work/Engineering-Log document | No | Excluded structurally by using `getAllX()`, never `getXSlugs()` (§3) |
| `series`, `technologies`, `content/pages/` | No | Confirmed still empty and routeless (§3) |
| 404 | No | Not a canonical URL; excluded structurally, no per-URL check needed |

---

## 6. Optional Field Policy — Decided Here, Not Left Open

`docs/48` §9/Q2/Q3/Q4 correctly left `lastModified`/`changeFrequency`/`priority`/`/rss.xml` inclusion as open questions for a design proposal. An implementation plan needs concrete, buildable answers — decided here, with reasoning, per this task's own "document explicitly rather than silently decide" instruction:

- **`lastModified`**: included **only** for the three content-backed collections, as `frontmatter.updatedAt ?? frontmatter.publishedAt` — a real, trustworthy editorial date. **Omitted** for all six static pages and all eight topic pages — no real per-page modification date is tracked anywhere in this repository for either category (`WORKSPACE_METADATA`'s own "Last updated" field is already a static placeholder, confirmed in `docs/46`'s own reconnaissance and unchanged), and fabricating one (e.g., defaulting to build time) would claim a fact this repository doesn't actually know. One uniform rule — "only where a real date exists" — rather than a per-category judgment call.
- **`changeFrequency`**: **omitted entirely.** No trustworthy editorial cadence model exists anywhere in this repository (content is published irregularly, by hand, not on a schedule); inventing a tiering (e.g., "weekly" for listing pages) would be an unverifiable claim, and `docs/48` §9 already noted major search engines mostly ignore the field regardless.
- **`priority`**: **omitted entirely.** No priority-scoring system exists; inventing numbers would be fabricating an SEO signal with no real backing, the same category of claim `docs/01-PERSONAL_BRAND.md`'s own "Things We Never Do" list already rejects for different content (percentage-rated technologies) — the same discipline, applied here to page-importance scores instead.

This yields one simple, uniform sitemap-entry shape across the whole corpus: `{ url, lastModified? }` — never `changeFrequency`, never `priority`.

---

## 7. Route Helpers — Evaluated, Not Created

Per this task's own explicit instruction (§22 of the authorization): the `/knowledge/{slug}`, `/work/{slug}`, `/engineering-log/{slug}` path convention is already independently duplicated as a template literal in at least four existing places (`relationships.ts`'s `toSummary()`, `case-study-relationships.ts`'s `toCaseStudySummary()`, `engineering-logs.ts`'s `toEngineeringLogArticleSummary()`, and now `rss.ts`'s `toFeedItem()`) — confirmed by direct re-read (§3). Sitemap would be a fifth consumer of the identical convention.

**Decision: do not create a shared route-helper module now.** Introducing one would mean either (a) Sitemap alone reinvents the convention a fifth time — the option this plan actually takes, keeping the footprint minimal and touching zero existing files — or (b) refactoring the four existing consumers to adopt a new shared helper, which is a real, legitimate DRY improvement but is explicit scope creep beyond what Sitemap itself needs to function, and would touch files this task's own guardrails don't authorize changing. Recorded here as a genuine future opportunity, not silently ignored: a small `lib/content/paths.ts` (or similar) consolidating this five-times-duplicated convention would be a reasonable, small future task — not this one.

---

## 8. Next.js Convention — Reconfirmed

Unchanged since `docs/48` §4 (verified again this turn against the same bundled docs): `app/sitemap.ts` exports a default function returning `MetadataRoute.Sitemap`. Per the doc's own "Good to know": *"`sitemap.js` is a special Route Handler that is cached by default unless it uses a Request-time API or dynamic config option."* **This is `sitemap.ts`'s own documented behavior, stated on its own doc page — a different, more specific rule than the generic `route.ts` default this repository already learned applies differently during RSS's own implementation** (`docs/47`'s Route Handler defaulted to dynamic per-request rendering since Next 15, a fact discovered during RSS's own verification, not predicted correctly in advance). This plan predicts `/sitemap.xml` **will** build statically/cached, based on `sitemap.ts`'s own specific documented default — but states this as a testable prediction for WI-5 to verify against the actual `pnpm build` output, not an assumption carried forward uncritically, learning directly from the RSS implementation's own lesson (`docs/47` §3's incorrect prediction, corrected during verification rather than before it).

---

## 9. Work Items

### WI-1 — Static & Topic Route Composition

**Purpose:** the fixed, non-content-backed portion of the sitemap — six static pages, eight topic pages.

**Files:** part of `src/app/sitemap.ts` (§ WI-3; no separate file — see §12's own "smallest footprint" reasoning).

**Exact responsibility:** a hand-written array of the six static paths (`/`, `/knowledge`, `/work`, `/work/library`, `/engineering-log`, `/about`), each `{ url: \`${SITE_URL}${path}\` }` with no `lastModified` (§6); plus `TOPIC_SLUGS.map((slug) => ({ url: \`${SITE_URL}/knowledge/${slug}\` }))` — real, content-layer-owned topic slugs, never `PLACEHOLDER_TOPICS`.

**Dependencies:** `SITE_URL` (already live, `lib/constants/site.ts`), `TOPIC_SLUGS` (`lib/content/topics.ts`).

**Acceptance criteria:** exactly 6 static entries + exactly 8 topic entries; no entry carries `lastModified`, `changeFrequency`, or `priority`; `PLACEHOLDER_TOPICS` is not imported anywhere in this work item's code.

---

### WI-2 — Content-Backed Route Composition

**Purpose:** the three real, draft-filtered content collections.

**Files:** part of `src/app/sitemap.ts`.

**Exact responsibility:**

```text
Knowledge  →  getAllArticles()             → { url, lastModified: updatedAt ?? publishedAt }
Work       →  getAllCaseStudies()          → same shape — never lib/content/work.ts
Eng. Log   →  getAllEngineeringLogEntries() → same shape (0 items today — valid, not an error)
```

Each collection's own natural array order is preserved — no `sortByPublishedDate()` call, no re-sorting of any kind. The Sitemaps protocol has no ordering requirement, and reusing that function here would be exactly the "unnecessary sorting infrastructure" this task's own instruction (§24) warns against introducing.

**Dependencies:** `SITE_URL`.

**Acceptance criteria:** every entry's `lastModified` traces to a real `frontmatter.updatedAt`/`publishedAt` value, never a fabricated or filesystem-derived date; zero import of `lib/content/work.ts` or `PLACEHOLDER_WORK` anywhere in this work item's code; a collection with zero published items (Engineering Log, today) contributes zero entries, not a placeholder.

---

### WI-3 — `src/app/sitemap.ts`

**Purpose:** the actual file — Next's own metadata-file convention, combining WI-1 and WI-2's entries into one returned array.

**Files to create:** `src/app/sitemap.ts`.

**Exact responsibility:**

```text
// Conceptual shape — no implementation authorized by this document.
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";
import { TOPIC_SLUGS } from "@/lib/content/topics";
import { getAllArticles } from "@/lib/content/articles";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";

export default function sitemap(): MetadataRoute.Sitemap {
  // WI-1's static + topic entries, WI-2's content-backed entries,
  // concatenated in that fixed order (static, topics, Knowledge,
  // Work, Engineering Log) — deterministic by construction, no
  // sorting step (§ WI-2's own reasoning).
}
```

A single, non-split sitemap — no `generateSitemaps()` (not justified at 22 URLs, `docs/48` §4, reconfirmed §4 above).

**Dependencies:** WI-1, WI-2.

**Acceptance criteria:** returns exactly 22 entries today (6 + 8 + 4 + 4 + 0); every `url` is absolute (`${SITE_URL}${path}`, never a bare relative path); no `/search`, no `/rss.xml`, no 404, no draft content, no `series`/`technologies` URL anywhere in the output; no new npm dependency; the file contains no XML string-building of any kind (Next.js serializes the returned array itself, unlike RSS's own hand-built XML).

---

### WI-4 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/36`'s WI-7 through `docs/47`'s WI-6.

**When it runs:** only after WI-1 through WI-3 are complete.

**Verification steps:**

1. **Route** — `/sitemap.xml` returns HTTP 200.
2. **XML validity** — parsed with a real XML parser, not opened in a browser and eyeballed (the same discipline `docs/47` WI-6 step 3 already established for RSS).
3. **Structure** — a valid Sitemaps-protocol `<urlset>` document.
4. **URL count** — exactly matches §4's corpus (22 today), re-counted against the live output, not assumed.
5. **Static routes** — all 6 present.
6. **Topic routes** — all 8 present, matching `TOPIC_SLUGS` exactly.
7. **Knowledge routes** — every currently-published article present.
8. **Work routes** — every currently-published case study present; **explicitly verified sourced from `case-studies.ts`** via the same direct, evidenced test `docs/42` WI-10 step 2 / `docs/47` WI-6 step 2 already used (a phrase from real `vaultpay.mdx` frontmatter present via some other check, or — since a sitemap carries no description text to check — confirming the `/work/vaultpay` URL's presence traces to `getAllCaseStudies()` in the actual diffed source, and that `PLACEHOLDER_WORK`'s own entries, which include a fifth title "NETS" per `docs/03-SITEMAP.md`'s own Work list not present in the real `content/work/` collection, do **not** appear — a concrete, checkable absence test specific to Sitemap's own shape).
9. **Engineering Log routes** — 0 present today; re-verified as a valid state, not an error.
10. **Search excluded** — confirmed absent.
11. **404 excluded** — confirmed absent.
12. **Draft content excluded** — confirmed no mechanism exists for one to appear (structural, via resolver choice — §3).
13. **Placeholder Work excluded** — `/work/nets` (or any `PLACEHOLDER_WORK`-only entry) confirmed absent.
14. **Absolute URLs** — every `<loc>` begins with `SITE_URL`'s actual value.
15. **`SITE_URL` reuse** — confirmed imported from `lib/constants/site.ts`, not redeclared.
16. **`lastModified` policy** — confirmed present only on content-backed entries, absent on static/topic entries, per §6.
17. **Optional fields** — confirmed `changeFrequency`/`priority` absent from every entry, per §6.
18. **Rendering strategy** — confirmed against actual `pnpm build` output (§8's own prediction, tested rather than assumed).
19. **RSS regression** — `/rss.xml` still returns 200, correct content, unchanged.
20. **Full-site regression** — `/`, `/knowledge`, `/work`, `/engineering-log`, `/about`, `/search`, 404 all still return their expected status.
21. **Automated checks** — `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` all clean.
22. **Git diff vs. this plan's file manifest (§10)** — exact match; no temporary files or fixtures left behind.

**Release recommendation:** **Approved** or **Refinements Required**, the identical format every prior implementation plan in this series has used.

---

## 10. File Manifest

| File | Change | Work Item | Mandatory/Conditional |
|---|---|---|---|
| `src/app/sitemap.ts` | New | WI-1, WI-2, WI-3 | Mandatory |

**Not touched by this plan, anywhere:** `lib/constants/site.ts` (read, not modified — `SITE_URL` already exists), `lib/content/rss.ts`, `app/rss.xml/route.ts`, `app/layout.tsx`, `lib/content/work.ts`, `lib/content/articles.ts`/`case-studies.ts`/`engineering-logs.ts`/`topics.ts` (read-only, all reused unmodified), `content/`, every existing route, Header, Footer, `MobileNavigation`, navigation config, `robots.txt`/`robots.ts` (§11).

**One new file.** The smallest possible production footprint of any Milestone 6 task — smaller than RSS's own two-new-plus-two-modified (`docs/47` §7), smaller than 404's one-new-file (`docs/44` §6), tied only by the fact that this file needs no modification to any existing file at all, since `SITE_URL` was already introduced by RSS.

---

## 11. `robots.txt` — Explicitly Not Expanded Into This Task

Per this task's own explicit instruction not to auto-expand scope: `robots.txt`/`robots.ts` does not exist in this repository (confirmed, §3), and `docs/12`'s own Milestone 6 deliverable list names only "Sitemap," not "Robots" — the same distinction `docs/45` §7 and `docs/48` §10 already drew. **This plan does not create `robots.ts`.** Recorded as a separate, future, near-zero-cost concern: once `/sitemap.xml` exists, a future `robots.ts` would simply reference `${SITE_URL}/sitemap.xml` — not something this plan's own scope expands to cover.

---

## 12. Sequencing

```
WI-1 (static + topic entries) ──┐
                                  ├──▶ WI-3 (sitemap.ts, combines both)
WI-2 (content-backed entries) ──┘              │
                                                 ▼
                                          WI-4 (RC review)
```

WI-1 and WI-2 have no dependency on each other — both only need `SITE_URL`, already live — and can be written in either order or together, since both land in the same single file (§ WI-3's own "smallest footprint" reasoning — no separate resolver file the way RSS needed one). WI-3 is the file itself. WI-4 is strictly last.

---

## 13. Explicit Guardrails

- No modification to `lib/constants/site.ts` — `SITE_URL` is imported, not redeclared, not moved, not duplicated.
- No modification to `lib/content/rss.ts`, `app/rss.xml/route.ts`, or `app/layout.tsx` — RSS is left exactly as shipped.
- No modification to `lib/content/work.ts`, `articles.ts`, `case-studies.ts`, `engineering-logs.ts`, `topics.ts`, or any content loader.
- No modification to Header, Footer, `MobileNavigation`, navigation config, Homepage, Knowledge/Work/Engineering-Log/About routes, Search, or 404.
- No `robots.ts`/`robots.txt` (§11).
- No new npm dependency.
- No `generateSitemaps()` splitting.
- No `changeFrequency`/`priority` field anywhere (§6).
- No shared route-helper module created (§7).

---

## 14. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `sitemap.ts` is assumed to build statically without verification, repeating the exact mistake `docs/47`'s own re-inspection made for RSS | Medium | §8 states the prediction as testable, not assumed; WI-4 step 18 checks actual build output directly |
| A `lastModified` value gets fabricated for a static/topic page "just to fill the field in," since the Next.js type marks it optional but examples show it populated | Low–Medium | §6's uniform rule ("only where a real date exists") is stated as a firm decision with reasoning, not left as a per-entry judgment call during implementation |
| Implementation reaches for `lib/content/work.ts` out of habit, the fourth time this exact risk has been named in this milestone (`docs/42`, `docs/46`, `docs/47`) | Low | WI-2's acceptance criterion and WI-4 step 8/13 both test for it directly, the same evidenced way each prior task did |
| A shared route-helper gets introduced "while we're in here," refactoring the four existing path-building call sites beyond this task's own scope | Low | §7 states the decision and its reasoning explicitly, framing it as a future opportunity rather than an oversight to fix now |

---

## 15. Verification Plan

Inherits `docs/48` §13 in full; formally executed and signed off by WI-4.

---

## 16. Rollback Plan

One new, independently deletable file (`src/app/sitemap.ts`). No existing file is modified anywhere in this plan — rollback is deleting that one file, with zero cross-file cleanup. The simplest rollback profile of any Milestone 6 task, tied with 404's own.

---

## 17. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/48` — none introduces a new architectural decision beyond the implementation-level policy choices §6/§7/§8 explicitly make and justify.
- `SITE_URL` reuse is confirmed against its actual, current, live implementation — not assumed from `docs/48`'s own prediction.
- The `lastModified`/`changeFrequency`/`priority` policy is decided concretely, with reasoning, rather than left open the way a design proposal correctly could.
- Work's data source is re-confirmed with its own Sitemap-specific test (WI-4 step 8/13), not merely re-asserted from RSS's own prior verification.
- File manifest (§10) is exhaustive; guardrails (§13) leave no reasonable path to modifying RSS, `SITE_URL`'s declaration, or any protected route.
- No production code, component, route, or content was modified to produce this document.

---

## 18. Final Report Requirements

WI-4's own deliverable — work items completed, file manifest as actually diffed vs. this plan's prediction, all twenty-two WI-4 verification steps individually, guardrail confirmation, and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/48-SITEMAP_EXPERIENCE.md`'s architecture into four work items landing in a single new file, `src/app/sitemap.ts` — the smallest production footprint of any Milestone 6 task, made possible because `SITE_URL` already exists (introduced by RSS, per `docs/48`'s own predicted dependency, now confirmed fulfilled) and because Next's own metadata-file convention needs no hand-built serialization the way RSS did. Three implementation-level questions `docs/48` correctly left open for a design proposal are decided here with concrete reasoning: `lastModified` only where a real editorial date exists, `changeFrequency`/`priority` omitted entirely, and `/rss.xml` excluded from the page sitemap. One lesson carried forward directly from RSS's own implementation: `sitemap.ts`'s caching behavior is stated as a testable prediction for WI-4 to verify against real build output, not assumed correct in advance a second time.
