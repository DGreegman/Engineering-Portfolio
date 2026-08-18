# 81 — Task 8.1 (Metadata): Implementation Plan

## Status

Implementation Plan — translating `docs/80-METADATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md`'s approved architecture into an exact, dependency-ordered, buildable specification.

> This document authorizes no implementation. No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce it.

Task 8.1's implementation-planning turn. "Task 8.1" remains this repository's own execution designation for the Metadata deliverable in `docs/12`'s Milestone 8 — SEO & Performance list, not an official roadmap task number (`docs/79`, `docs/80` §1, unreversed here).

> **Note on this task's own instructions**: the incoming message arrived truncated — it ends mid-codeblock immediately after the illustrative title-architecture snippet in §2, before any "required output" or document-structure section arrived. This plan proceeds using the nine approved discovery findings stated explicitly in the prompt, the illustrative snippet as a candidate to evaluate (not a mandate — evaluated against repository evidence in §5), and this session's own established implementation-plan structure (`docs/75`, `docs/77`) for everything the message didn't reach.

---

## 1. Executive Implementation Recommendation

`docs/80`'s architecture review is complete and re-verifies exactly against the live repository this turn (§2) — zero drift since it was written. The nine approved findings restated in this task's own prompt are consistent with `docs/80`'s own conclusions in every respect but one, which this plan resolves explicitly rather than leaving open: `docs/80` §20 (Q1) named the exact identity wording as a genuine open editorial question; this task's own approved findings (2 and 3, read together — `SITE_NAME` is the documented identity, the duplicated `"Engineering Portfolio"` is not connected to it) resolve that question in favor of `SITE_NAME`, and this plan adopts that resolution concretely (§5).

**Conclusion: APPROVED — Metadata implementation plan is ready for building**, with one explicit divergence from the prompt's own illustrative snippet (the separator character, §5) stated and justified, not silently substituted.

---

## 2. Authoritative Source Documents — Read, Re-Verified

Read in full: `docs/80`. Re-inspected directly this turn (not carried forward unchecked): `src/app/layout.tsx`, every route-level metadata export (all 11 routes), every `generateMetadata()` function, `src/lib/constants/site.ts`, `src/lib/metadata/`, `src/lib/seo/`, current `SITE_NAME`/`SITE_URL` values, and every `"Engineering Portfolio"` occurrence.

**Re-verification result — zero drift found**:

- `src/lib/constants/site.ts` — byte-identical to `docs/80`'s own citation; `SITE_NAME = "Gracious Obeagu"`, `SITE_URL = process.env.SITE_URL ?? "http://localhost:3000"`, both docstrings unchanged.
- `src/app/layout.tsx` — unchanged: `title: "Engineering Portfolio"`, `description: "Engineering Portfolio project foundation."`, one `alternates.types` entry, no `metadataBase`, no title template.
- `"Engineering Portfolio"` / `"— Engineering Portfolio"` — still exactly 12 occurrences across the same 10 route files `docs/80` §6 counted (re-confirmed via direct grep this turn, file-by-file, matching exactly).
- `src/lib/metadata/`, `src/lib/seo/` — both still `.gitkeep`-only, zero real files, zero consumers.
- All three `generateMetadata()` functions (`knowledge/[slug]`, `work/[slug]`, `engineering-log/[slug]`) — unchanged, same two-branch/one-branch shapes, same `{}` fallback for a non-matching slug.
- `git status --short` at the start of this task showed only `docs/79` and `docs/80` as untracked, zero production file in the diff — confirming no implementation happened between the discovery review and this plan.

**No new drift to report.** Every fact this plan builds on is re-confirmed live, not inherited from `docs/80` on trust.

---

## 3. Exact Title Decision

### 3.1 — Identity: `SITE_NAME`, not `"Engineering Portfolio"`

Resolved directly from this task's own approved findings 2 and 3, read together: finding 2 states `SITE_NAME` is "the documented site identity and already exists as a shared constant"; finding 3 states the duplicated `"Engineering Portfolio"` "is not connected to `SITE_NAME`." The only reading consistent with both is that `SITE_NAME` is the value the *rest* of the site should converge onto — not the reverse. **`SITE_NAME` ("Gracious Obeagu") is the identity value used everywhere in this plan.**

### 3.2 — Separator: em dash (`—`), diverging explicitly from the prompt's own illustrative snippet

The prompt's own illustrative shape used a pipe: `` `%s | ${SITE_NAME}` ``. Checked directly against the live repository this turn: **em dash (`" — "`) is this codebase's own, exhaustively consistent separator convention** — every one of the 12 current title-suffix occurrences uses it (§2), and a direct grep of `src/components/` finds `" — "` used as a real UI-copy separator in at least 8 further files (breadcrumbs, hero copy, section headings). **Zero precedent for `|` as a copy separator exists anywhere in this codebase** — every `|` match found is TypeScript union-type syntax (`"align" | "alignOffset"`, `"Completed" | "In Progress"`), not rendered text.

Per `docs/80`'s own explicit instruction not to "blindly impose a generic SEO title format" and to "preserve" the workspace's own identity (`docs/80` §10): this plan recommends **keeping the em dash**, not adopting the prompt's own pipe example. The illustrative snippet's own *structure* (`title.default` + `title.template`) is correct and is adopted exactly (§3.3) — only its separator character is evaluated against evidence and changed. This divergence is stated here explicitly, not silently substituted, so it can be corrected in review if the pipe was in fact intended rather than illustrative.

### 3.3 — Exact structure adopted

```ts
title: {
  default: SITE_NAME,
  template: `%s — ${SITE_NAME}`,
},
```

Traced against this exact installed Next.js version's own documented semantics (`docs/80` §10, re-confirmed, not re-read a second time this turn since the package is unchanged): `title.template` supports exactly one `%s` substitution point, and has no effect on a route that doesn't itself define a title. This directly determines §6's per-route fragment design — the three-part current pattern (`"[Document] — [Section] — Engineering Portfolio"`) cannot collapse into a single root template; each route keeps authoring its own `"[Document] — [Section]"` (or, for section-listing pages, just `"[Section]"`) fragment, and the root template appends `" — Gracious Obeagu"` to whichever fragment a route provides.

### 3.4 — Homepage: `title.absolute`, not the template

The homepage's own current title (`` `${SITE_NAME} — Engineering Workspace` ``, i.e. *"Gracious Obeagu — Engineering Workspace"*) already places the identity **first**, the one route in the entire site that does — a distinct, evidently deliberate convention (identity-led, the way a homepage's own `<title>` conventionally reads), not an inconsistency `docs/80` flagged as a defect to fix (it named the wording as *different*, not as *wrong*, §6 Problem 1's own framing groups it as "a third distinct wording," not a bug). Running it through the new suffix-appending template would invert this to *"Engineering Workspace — Gracious Obeagu"* — a real, unrequested word-order change to the one page that already correctly uses `SITE_NAME`.

**Recommendation: the homepage keeps its exact current rendered title, expressed via `title.absolute`** (which, per the docs read during `docs/80`'s own research, "ignores `title.template` set in parent segments"):

```ts
title: { absolute: `${SITE_NAME} — Engineering Workspace` },
```

**Zero visible change to the homepage's own `<title>`** — this is a structural change (from a plain string to an explicit `absolute` object) made only so the homepage is correctly exempted from the new suffix template, not a wording change.

**Rejected alternative**: unify the homepage into the same template as every other route (`title: "Engineering Workspace"`, rendering `"Engineering Workspace — Gracious Obeagu"`). Rejected because it changes a currently-correct, currently-SITE_NAME-using title's own word order for no evidenced reason — `docs/80` never named this as a problem, and this plan does not manufacture one.

---

## 4. `metadataBase` — Exact Decision

Adopted exactly as `docs/80` §9/§15 recommended, re-verified, not re-litigated:

```ts
metadataBase: new URL(SITE_URL),
```

- Reuses the existing `SITE_URL` constant — no new value invented, no new environment variable introduced.
- Zero observable effect today: no route currently authors a URL-based field (`openGraph.images`, `alternates.canonical`, `twitter.images`) that would need it; the one existing `alternates.types` entry is already an absolute URL, which — per this exact Next.js version's own documented behavior (`docs/80` §9's own citation) — `metadataBase` is ignored for.
- `SITE_URL`'s own standing, already-documented production-configuration caveat (no verified guarantee the `SITE_URL` environment variable is actually set in any real deployment — `docs/80` §9) is unchanged by this plan and not resolved by it; this plan extends `SITE_URL` to one more consumer, it does not fix or hide that pre-existing limitation.

---

## 5. Description — Exact Decision

**Per-route descriptions**: unchanged, everywhere. Finding 7 ("descriptions are already good and should not be unnecessarily rewritten") is honored literally — no route's real, rendered `<meta name="description">` text changes in this plan.

**Root layout's own fallback description** (`docs/80` §6 Problem 3 — *"Engineering Portfolio project foundation."*, vestigial Milestone-1 text): traced precisely for where it could ever actually render. Per this exact Next.js version's own merging behavior (root-to-leaf, shallow merge, `docs/80` §5), every real route already overrides `description` — the root's own value is unreachable **except** for the one narrow edge case where a dynamic route's `generateMetadata()` returns `{}` for a non-matching slug (`/knowledge/[slug]`, `/work/[slug]`, `/engineering-log/[slug]`), which is immediately followed by the page's own independent `notFound()` call.

**Decision: remove the `description` field from root layout's metadata entirely, rather than replace it with new copy.** `description` has no `default`/template mechanism the way `title` does (confirmed — Next's own Metadata Fields reference names no such option for `description`), so there is no structural need to keep a placeholder value in its place; an absent `<meta name="description">` on the one edge case that reaches it (an invalid slug, immediately followed by a 404 response) is harmless and honest, and does not require this plan to author new marketing copy it has no editorial authority to write — the same restraint finding 7 already establishes for real, rendered descriptions, applied here to the one remaining unreachable-but-technically-present case rather than exempted from it.

---

## 6. Exact Per-Route Content Contract

Every title change, current → new, verified against this turn's own re-read (§2). No description changes anywhere in this table (§5).

| Route | File | Current `title` | New `title` | Rendered result |
|---|---|---|---|---|
| Root layout | `src/app/layout.tsx` | `"Engineering Portfolio"` | `{ default: SITE_NAME, template: `%s — ${SITE_NAME}` }` | N/A — infrastructure only, never rendered directly since every real route sets its own title |
| `/` | `src/app/page.tsx` | `` `${SITE_NAME} — Engineering Workspace` `` | `{ absolute: `${SITE_NAME} — Engineering Workspace` }` | *"Gracious Obeagu — Engineering Workspace"* — **unchanged** |
| `/about` | `src/app/about/page.tsx` | `"About — Engineering Portfolio"` | `"About"` | *"About — Gracious Obeagu"* |
| `/knowledge` | `src/app/knowledge/page.tsx` | `"Knowledge — Engineering Portfolio"` | `"Knowledge"` | *"Knowledge — Gracious Obeagu"* |
| `/knowledge/[topic]` (8 real topics) | `src/app/knowledge/[slug]/page.tsx` (topic branch) | `` `${topic.title} — Knowledge — Engineering Portfolio` `` | `` `${topic.title} — Knowledge` `` | *e.g. "Distributed Systems — Knowledge — Gracious Obeagu"* |
| `/knowledge/[slug]` (7 real articles) | Same file (article branch) | `` `${frontmatter.title} — Knowledge — Engineering Portfolio` `` | `` `${frontmatter.title} — Knowledge` `` | *e.g. "How JWT Works — Knowledge — Gracious Obeagu"* |
| Invalid `/knowledge/[slug]` | Same file (fallback branch) | `{}` (no title) | `{}` (unchanged) | Falls through to `title.default` → *"Gracious Obeagu"* alone, immediately followed by the page's own `notFound()` |
| `/work` | `src/app/work/page.tsx` | `"Work — Engineering Portfolio"` | `"Work"` | *"Work — Gracious Obeagu"* |
| `/work/library` | `src/app/work/library/page.tsx` | `"Case Study Library — Engineering Portfolio"` | `"Case Study Library"` | *"Case Study Library — Gracious Obeagu"* |
| `/work/[slug]` (4 real case studies) | `src/app/work/[slug]/page.tsx` | `` `${frontmatter.title} — Work — Engineering Portfolio` `` | `` `${frontmatter.title} — Work` `` | *e.g. "VaultPay: A Wallet Ledger Reasoned From First Principles — Work — Gracious Obeagu"* |
| Invalid `/work/[slug]` | Same file | `{}` | `{}` (unchanged) | Same fallback-to-default behavior as above |
| `/engineering-log` | `src/app/engineering-log/page.tsx` | `"Engineering Log — Engineering Portfolio"` | `"Engineering Log"` | *"Engineering Log — Gracious Obeagu"* |
| `/engineering-log/[slug]` (2 real entries) | `src/app/engineering-log/[slug]/page.tsx` | `` `${frontmatter.title} — Engineering Log — Engineering Portfolio` `` | `` `${frontmatter.title} — Engineering Log` `` | *e.g. "The Webhook That Wasn't Enough — Engineering Log — Gracious Obeagu"* |
| Invalid `/engineering-log/[slug]` | Same file | `{}` | `{}` (unchanged) | Same fallback-to-default behavior |
| `/search` | `src/app/search/page.tsx` | `"Search — Engineering Portfolio"` | `"Search"` | *"Search — Gracious Obeagu"* — `robots: { index: false, follow: true }` untouched |
| 404 | `src/app/not-found.tsx` | `"Page Not Found — Engineering Portfolio"` | `"Page Not Found"` | *"Page Not Found — Gracious Obeagu"* — no manual `robots` field, unchanged (§7) |

**Every real, currently-indexed page's rendered `<title>` changes its trailing identity segment from "Engineering Portfolio" to "Gracious Obeagu" — an intentional, evidenced consequence of resolving findings 2/3 (§3.1), not a side effect to hide.** No title's *document-specific* portion (the article/case-study/topic/section name) changes at all.

---

## 7. Draft Handling and Robots — Explicitly Excluded From This Pass

Finding 9 is directly binding here: *"Draft handling is a real architectural consideration but currently has zero draft content and must not be silently expanded into this task."* This plan does **not** add a conditional `robots` branch for draft content to any of the three dynamic routes — `docs/80` §20's own Q2 is left open, not resolved by this plan, consistent with finding 9's explicit instruction. `/search`'s existing `robots` field and 404's existing automatic-`noindex` behavior (`docs/80` §13) are both left completely untouched — confirmed by their absence from §6's own table above.

**Site-wide `app/robots.ts`** (`docs/80` §20 Q3) is likewise not addressed by this plan — not named in the nine approved findings, not part of `docs/12`'s own Milestone 8 deliverable list by name, and explicitly out of `docs/80`'s own resolved scope (§8 of that document). Remains an open question for a future task, not decided or built here.

---

## 8. Evidence Boundaries — Non-Goals, Restated as a Binding Implementation Constraint

Per `docs/80` §8/§19, restated here exactly as this plan's own boundary, with zero exception:

- **No `openGraph` field** — anywhere, on any route.
- **No `twitter` field** — anywhere.
- **No `alternates.canonical`** — anywhere. `metadataBase` (§4) makes this possible for a *future* task without a build error; this plan does not itself author the field.
- **No JSON-LD / structured data** — a different mechanism entirely (`<script type="application/ld+json">`), not touched.
- **No image optimization, no lazy-loading change** — `next.config.ts`, `mdx-components.tsx`'s `Img()` override, and `about-header.tsx`'s existing `next/image` use are all untouched.
- **No Lighthouse tooling, no CI change** — `.github/workflows/ci.yml` is untouched.
- **No content/frontmatter change** — every real document's own `title`/`description` remains exactly as authored; nothing in this plan reads or writes `.mdx` frontmatter.
- **No schema change** — `src/lib/content/schema.ts` untouched.
- **No new metadata helper library** — `src/lib/metadata/` and `src/lib/seo/` remain `.gitkeep`-only; the fix is two existing constants plus Next's own native `title.template`/`title.absolute`/`metadataBase` mechanisms, not a new abstraction.
- **No new npm dependency.**
- **No `app/robots.ts`** (§7).
- **No draft-content `robots` branch** (§7).

---

## 9. File Manifest

| # | File | Change | Exact scope |
|---|---|---|---|
| 1 | `src/app/layout.tsx` | Modified | Add `metadataBase` (§4); convert `title` to `{ default, template }` (§3.3); remove `description` (§5); `alternates.types` untouched |
| 2 | `src/app/page.tsx` | Modified | `title` becomes `{ absolute: ... }`, identical rendered text (§3.4) |
| 3 | `src/app/about/page.tsx` | Modified | `title` trimmed to fragment (§6) |
| 4 | `src/app/knowledge/page.tsx` | Modified | Same |
| 5 | `src/app/knowledge/[slug]/page.tsx` | Modified | Both `generateMetadata()` branches' `title` trimmed to fragment; fallback branch (`return {}`) untouched |
| 6 | `src/app/work/page.tsx` | Modified | Title trimmed to fragment |
| 7 | `src/app/work/library/page.tsx` | Modified | Same |
| 8 | `src/app/work/[slug]/page.tsx` | Modified | `generateMetadata()`'s `title` trimmed to fragment; fallback untouched |
| 9 | `src/app/engineering-log/page.tsx` | Modified | Title trimmed to fragment |
| 10 | `src/app/engineering-log/[slug]/page.tsx` | Modified | `generateMetadata()`'s `title` trimmed to fragment; fallback untouched |
| 11 | `src/app/search/page.tsx` | Modified | Title trimmed to fragment; `robots` untouched |
| 12 | `src/app/not-found.tsx` | Modified | Title trimmed to fragment |

**Exactly 12 files — every route/layout that currently exports metadata, and no others.** No new file is created. `src/lib/constants/site.ts` is read, not modified — `SITE_NAME`/`SITE_URL` are both reused exactly as they already exist.

---

## 10. Release Gate

Each criterion answerable **PASS / FAIL / NOT APPLICABLE**, per `docs/80` §18's own format, re-scoped to this plan's exact contract:

1. Root layout renders `metadataBase` resolving correctly against the local `SITE_URL` fallback (`http://localhost:3000` in dev/build, no production URL invented or asserted).
2. Root layout's `description` field is absent (confirmed by inspecting the built `<head>` for the one reachable edge case, an invalid dynamic slug).
3. Every one of the 12 real, currently-indexed pages (§6's own table, excluding the three fallback rows) renders the exact new title predicted in that table — no more, no fewer characters, no wrong section name.
4. The homepage's own rendered `<title>` is byte-identical to its current value.
5. An invalid `/knowledge/[slug]`, `/work/[slug]`, and `/engineering-log/[slug]` each resolve to `<title>Gracious Obeagu</title>` before their own `notFound()` call renders the 404 page.
6. `/search`'s `robots` value is unchanged: `{ index: false, follow: true }`.
7. 404's automatic `noindex` behavior is unchanged — no manual `robots` field was added to `not-found.tsx`.
8. No `openGraph`, `twitter`, or `alternates.canonical` field appears anywhere in the diff.
9. No `<script type="application/ld+json">` appears anywhere in the diff.
10. `next.config.ts` is unchanged.
11. No `.mdx` content file is changed.
12. `src/lib/content/schema.ts` is unchanged.
13. No resolver file (`relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `articles.ts`, `case-studies.ts`) is changed.
14. `src/app/sitemap.ts` and `src/app/rss.xml/route.ts` are unchanged.
15. No file appears under `src/lib/metadata/` or `src/lib/seo/` beyond the existing `.gitkeep`.
16. No new npm dependency is added.
17. `pnpm exec eslint` — clean.
18. `pnpm exec tsc --noEmit` — clean.
19. `pnpm build` — clean.
20. Full regression sweep: `/`, `/knowledge`, all 8 topic pages, all 7 Knowledge article pages, `/work`, `/work/library`, all 4 Work pages, `/engineering-log`, both Engineering Log entry pages, `/about`, `/search`, `/rss.xml`, `/sitemap.xml`, an invalid route — all expected statuses, zero unrelated diff.
21. `git status --short` / `git diff --stat` shows exactly the 12 files in §9, no others.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 11. Regression Risks

| # | Risk | Concrete test |
|---|---|---|
| 1 | The homepage's title accidentally changes | Gate item 4 — byte-for-byte comparison, not a visual approximation |
| 2 | A route's title fragment accidentally includes the old `"— Engineering Portfolio"` suffix, producing a double suffix | Gate item 3 — exact string comparison against §6's own table for every real route |
| 3 | `title.template` fails to apply because a route's fragment is malformed (e.g., still a full sentence rather than the fragment shape) | Same — verified per-route, not assumed from the diff alone |
| 4 | `metadataBase` throws at build time due to an invalid `SITE_URL` value | `SITE_URL` already has a documented, always-valid fallback (`http://localhost:3000`); `new URL(...)` on that value cannot throw — gate item 19 (`pnpm build`) is the concrete check |
| 5 | Removing root's `description` causes a build or type error | `description` is optional on the `Metadata` type; gate items 17–19 confirm no error |
| 6 | `/search`'s `robots` field is accidentally dropped while its `title` is edited | Gate item 6 — `robots` re-verified present and unchanged after the edit |
| 7 | A manual `robots` field is accidentally added to 404 during this pass | Gate item 7 — explicit check that none was added |
| 8 | Draft-content `robots` handling is accidentally introduced despite finding 9's exclusion (§7) | Gate items 8–9 combined with a direct diff review — no `robots` logic appears on any of the three dynamic routes beyond what already existed |
| 9 | An unrelated file is modified | Gate item 21 — exact 12-file manifest enforced |

---

## 12. Work Items and Dependencies

```
WI-1 (re-verify this plan's own contract against the live repository at authoring time)
        │
        ▼
WI-2 (root layout — metadataBase, title.default/template, description removal)
        │
        ▼
WI-3 (homepage — title.absolute, verify zero rendered change)
        │
        ▼
WI-4 (remaining 10 route files — trim each title to its fragment, per §6's table)
        │
        ▼
WI-5 (automated checks — eslint, tsc, build)
        │
        ▼
WI-6 (live verification — every route's rendered <title>, metadataBase, robots, 404, invalid-slug behavior)
        │
        ▼
WI-7 (full regression sweep)
        │
        ▼
WI-8 (Release Candidate Review)
```

**WI-2 before WI-3/WI-4**: the root layout's own template/default must exist before any child route's title can be correctly trimmed to a fragment and verified — trimming first would leave every route rendering only its own fragment with no suffix, an intermediate broken state worth avoiding even transiently.

**WI-3 before WI-4**: the homepage is the one route whose contract *differs* from every other (`absolute`, not a fragment) — sequencing it separately keeps its own verification isolated from the other ten routes' identical, repeatable pattern.

**No work item is executed by this document.**

---

## 13. Guardrails

- `src/lib/content/schema.ts`, every resolver file, `src/app/sitemap.ts`, `src/app/rss.xml/route.ts` — none touched, none imported differently, none re-verified beyond confirming zero diff (§10, gate items 12–14).
- `src/lib/constants/site.ts` — read only; `SITE_NAME`/`SITE_URL` are not renamed, retyped, or given new default values.
- `src/lib/metadata/`, `src/lib/seo/` — remain empty; no file is added to either.
- Every component under `src/components/` — untouched; this plan's entire scope is `<head>`-level metadata exports in `src/app/`.
- `content/` — zero files touched, zero frontmatter fields read differently than today.
- No architecture change of any kind beyond the twelve files named in §9.

---

## 14. Implementation Sequence

1. Agent re-verifies the approved contract (WI-1) — confirms this plan's own §2 findings still hold at authoring time.
2. Agent modifies root layout (WI-2).
3. Agent modifies the homepage (WI-3), confirms zero rendered-title change.
4. Agent modifies the remaining 10 routes (WI-4), each matched exactly against §6's own table.
5. Agent runs `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` (WI-5).
6. Agent performs live verification against every real route (WI-6).
7. Agent performs the full regression sweep (WI-7).
8. Agent reports `APPROVED` or `REFINEMENTS REQUIRED` (WI-8).

---

## 15. Final Authorization Statement

This document authorizes no implementation. All twelve files named in §9 remain future work, gated on approval of §3's own explicit identity/separator decision (the one place this plan makes a concrete editorial call the prompt's own truncated instructions left partially open) and §5's description-removal decision. No production file was created or modified to produce this document.

```
git status --short
```

Confirmed: only `docs/79`, `docs/80` (prior turns' own outputs, untouched by this task) and `docs/81` (this document) appear as new paths under `docs/`; no file under `content/`, `src/`, or any configuration path appears in the diff.

---

## Final Report

1. **Plan status**: complete; one open editorial question from `docs/80` (Q1, exact identity wording) resolved concretely by this plan using the task's own approved findings (§3.1); one explicit, justified divergence from the prompt's own illustrative snippet (separator character, §3.2), not silently substituted.
2. **Exact production manifest**: 12 files, all `src/app/` metadata exports, none elsewhere (§9).
3. **Title contract**: full before/after table for every real route, every rendered result stated precisely, not discovered at implementation time (§6).
4. **`metadataBase` contract**: `new URL(SITE_URL)`, zero current behavioral effect, reuses the existing constant (§4).
5. **Description contract**: zero change to any real, rendered description anywhere; root's own unreachable placeholder removed, not replaced with new copy (§5).
6. **Draft/robots exclusion**: explicitly not addressed, per finding 9, stated as a binding boundary (§7).
7. **Non-goals**: Open Graph, Twitter, canonical URLs, structured data, image optimization, lazy loading, Lighthouse, schema/content changes — all explicitly restated as untouched (§8).
8. **Work items**: WI-1 through WI-8, dependency-ordered (§12).
9. **Release gate**: 21 individually stated checks (§10).
10. **Regression risks**: 9 individually named risks, each with a concrete test (§11).
11. **Guardrails**: every file this plan must not touch named explicitly (§13).
12. **Git verification**: confirmed via `git status --short`; zero production change attributable to this task (§15).

**APPROVED — Metadata implementation plan is ready for building.**
