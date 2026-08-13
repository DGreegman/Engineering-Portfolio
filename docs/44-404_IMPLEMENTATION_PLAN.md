# 44 — 404 Experience — Implementation Plan

## Status

Implementation Plan — translating the approved `docs/43-404_EXPERIENCE.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/43` establishes *what* Task 6.5 should do and *why*, and already identified this as the smallest Core Pages task in the milestone — one new file, zero new components. This document establishes *exactly* what that one file contains, work item by work item, the same role `docs/36`/`docs/38`/`docs/40`/`docs/42` played for Tasks 6.1–6.4.

---

## 2. Authoritative Inputs & Constraints

`docs/43-404_EXPERIENCE.md` is the architecture authority. Carried forward unchanged:

- **One root file**: `src/app/not-found.tsx` — no `global-not-found.js`, no per-route `not-found.tsx` files, no `error.tsx` (`docs/43` §7/§8, D1).
- **`ContinueExploring` reused wholesale** for the entire recovery-links section — no new component (`docs/43` §13, D2).
- **No hand-written `robots` metadata** — automatic for any 404-status response in this Next.js version (`docs/43` §19, D3).
- **No search box embedded on the page** — Search is one of `ContinueExploring`'s own links, not a duplicated form (`docs/43` §7).
- **No illustration, mascot, or decorative artwork** (`docs/43` §7/§15).

---

## 3. Re-Inspection Findings

Re-verified directly against the actual repository.

### Confirmed, matching `docs/43` exactly

- All three `notFound()` call sites unchanged: `app/knowledge/[slug]/page.tsx:274`, `app/work/[slug]/page.tsx:99`, `app/engineering-log/[slug]/page.tsx:76`.
- No `src/app/not-found.tsx`, `error.tsx`, `loading.tsx`, or `global-not-found.tsx` anywhere.
- `ContinueExploring` (`components/work/continue-exploring.tsx`) unchanged — still the exact `{ title: string; introduction: readonly string[]; links: readonly ContinueExploringLink[] }` props contract, still a plain Server Component, still imported outside `components/work/` by `app/engineering-log/page.tsx`.
- Root `layout.tsx` unchanged — `WorkspaceLayout` still wraps `children` in Header/Sidebar/Footer automatically; nothing this plan adds needs to re-supply any of the three.
- `git status` is clean of anything but `docs/43-404_EXPERIENCE.md` at the start of this task — the prior four tasks' work has already been committed.

### One naming discrepancy in the authorization message, recorded per this session's standing practice

The task authorization referenced `docs/08-ERROR_EXPERIENCE.md` and `docs/09-EMPTY_STATES.md` as source documents. **Neither file exists.** Confirmed by directory listing: the actual files are `docs/08-UX Guidelines.md` (containing the "Error Experience" and "Empty States" *sections* `docs/43` §2 already quoted) and `docs/09-Component Specification.md` (containing the "Error State" section under "Feedback Components," also already quoted in `docs/43` §2). This plan reads from the real files — already fully inspected while writing `docs/43` — rather than the section names as if they were filenames. Not a blocking discrepancy: the content those section names point to was already correctly sourced.

### New finding — `components/feedback/` exists, empty, and stays that way

`src/components/feedback/` (confirmed) contains only `.gitkeep` — a reserved scaffold from `docs/12`'s Milestone 4 "Feedback Components" category (Loading/Empty/Error/Success states), never populated. This task does **not** populate it: building a new `ErrorState` component there would be exactly the "new component where an existing one already fits" `docs/43` D2 already ruled out — `ContinueExploring` covers this page's entire recovery-content need, and the page's headline/explanation are two lines of static text with no reason to become a component of their own. Recorded so a future task doesn't read the empty directory as evidence this one was supposed to fill it.

No other discrepancy found.

---

## 4. Route Contract

```text
src/app/not-found.tsx
```

Renders for:
1. Any of the three existing `notFound()` throws (Knowledge, Work, Engineering Log detail routes).
2. Any URL that doesn't match a route in this application at all.

A Server Component — no props (confirmed by this project's own bundled docs, `docs/43` §2: *"`not-found.js` or `global-not-found.js` components do not accept any props"*). No `params`, no `searchParams`, unlike every dynamic route this repository has built so far — the simplest possible route signature in this codebase.

---

## 5. Work Items

### WI-1 — Page Shell, Headline, Explanation

**Purpose:** the page's own static content — the "404" label, the calm `<h1>`, and one honest line of explanation (`docs/43` §9).

**Files to create:** `src/app/not-found.tsx` (this work item starts the file; WI-2 and WI-3 extend it — all three land in one file, kept as separate work items for independent traceability, the same convention `docs/42` WI-5/WI-7/WI-8 already used for `app/search/page.tsx`).

**Exact responsibility:**

```text
Section (spacing="md", width="full")
  Stack (gap="lg", className="max-w-reading")
    p.font-mono.text-caption   → "404"        (the eyebrow register every
                                                 other page's own label
                                                 already uses — "Search",
                                                 "About", "Engineering Log")
    h1.text-h1                 → "This page doesn't exist."
    p.text-body                → "The page or link you were looking for
                                    isn't here — it may have been moved,
                                    renamed, or never existed."
```

Matches the exact `Section`/`Stack`/eyebrow/`<h1>` shape `app/search/page.tsx` and `app/about/page.tsx`'s own header sections already use — no new layout idiom invented for this page.

**Dependencies:** none.

**Acceptance criteria:** exactly one `<h1>` in the file; no literal bare "404" anywhere except the small eyebrow label; the explanation line names no specific cause (never guesses "you mistyped the URL" vs. "this was removed" — `docs/43` §9's own "shouldn't pretend to know which" ruling).

---

### WI-2 — `ContinueExploring` Integration

**Purpose:** the page's entire recovery-links section — reused, not rebuilt (`docs/43` §13, D2).

**Files:** `src/app/not-found.tsx` (same file as WI-1).

**Exact responsibility:** import `ContinueExploring` from `@/components/work/continue-exploring` (the same cross-directory import `app/engineering-log/page.tsx` already establishes as correct) and render it with the six-destination list `docs/43` §9 specified exactly:

```text
title: "Continue Exploring"
introduction: ["Here's where you can go instead."]
links:
  { label: "Continue into Knowledge →",        href: "/knowledge",
    description: "Browse the concepts documented so far." }
  { label: "Continue into Work →",              href: "/work",
    description: "See the engineering case studies." }
  { label: "Continue into the Engineering Log →", href: "/engineering-log",
    description: "Read the raw process behind the work." }
  { label: "Continue into About →",             href: "/about",
    description: "Find out who's behind this workspace." }
  { label: "Search the workspace →",            href: "/search",
    description: "Look for something specific by title or description." }
  { label: "Return to the front door →",        href: "/",
    description: "Start from the workspace's own homepage." }
```

Link label style (`"Continue into X →"` / a trailing arrow) matches `app/engineering-log/page.tsx`'s own two existing `ContinueExploring` links exactly (`"Continue into Work →"`, `"Continue into the Knowledge Library →"`) — this page's six links extend that established label convention rather than inventing a new one, the same "every `ContinueExploring` call site writes its own contextual links, in the same voice" pattern `docs/29` §4 already established.

**No copy constant.** Per `docs/43` §12's own open item, resolved here: the `links` array is written inline in `not-found.tsx`, matching how `app/engineering-log/page.tsx` also inlines its own two-link array directly in the page rather than in a `lib/constants/*.ts` file. A copy-constants file earns its place when more than one consumer needs the same facts (`about-copy.ts`'s actual reason for existing, `docs/40` §4) — this page's link list has exactly one consumer, itself.

**Dependencies:** WI-1 (renders after the headline/explanation block, within the same returned JSX).

**Acceptance criteria:** `ContinueExploring` is imported, not reimplemented; all six `href`s resolve to real, already-existing routes; zero props passed to `ContinueExploring` beyond `title`/`introduction`/`links` (no modification to the component itself).

---

### WI-3 — Metadata

**Purpose:** this page's own `export const metadata` — the one piece of metadata this page owns (`docs/43` §19, D3).

**Files:** `src/app/not-found.tsx`.

**Exact responsibility:**

```text
export const metadata: Metadata = {
  title: "Page Not Found — Engineering Portfolio",
  description: "The page you're looking for doesn't exist.",
};
```

**No `robots` field** — confirmed automatic for any 404-status response by this project's own bundled Next.js docs (`docs/43` §2/§19); adding one by hand would be redundant, not merely unnecessary.

**Dependencies:** none (independent of WI-1/WI-2, same file).

**Acceptance criteria:** no `robots` key present anywhere in this file's `metadata` export; title/description are real and specific, not the root layout's generic fallback.

---

### WI-4 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/36`'s WI-7, `docs/38`'s WI-9, `docs/40`'s WI-10, and `docs/42`'s WI-10.

**When it runs:** only after WI-1 through WI-3 are complete.

**Verification steps:**

1. **Functional** — a genuinely nonexistent URL (e.g. `/this-does-not-exist`) renders this page; `/knowledge/<nonexistent-slug>`, `/work/<nonexistent-slug>`, and `/engineering-log/<nonexistent-slug>` each render the same page (confirming the root file catches all three existing `notFound()` throws, not just unmatched top-level paths).
2. **HTTP status** — all four cases above return a real `404` status, checked directly (`curl -o /dev/null -w "%{http_code}"` or equivalent), not assumed from `docs/43`'s own reading of the Next.js docs.
3. **`noindex` confirmed automatic** — the response includes `<meta name="robots" content="noindex">` (or the equivalent header) without this task having written one, proving `docs/43`/WI-3's own claim rather than trusting it untested.
4. **Layout wrapping** — Header, Footer render around the page exactly as on any other route; Sidebar collapses to nothing (confirming `getSidebarSections()`'s existing unmatched-path behavior, unmodified by this task).
5. **`ContinueExploring` links** — all six resolve to real, working pages; no dead link.
6. **Scope boundary held** — no `global-not-found.js`, no `next.config.ts` change, no per-route `not-found.tsx`, no `error.tsx`, no new component under `components/feedback/` or anywhere else.
7. **No client component** — `not-found.tsx` contains no `"use client"`.
8. **Guardrails held** — `git diff` shows exactly one new file (`src/app/not-found.tsx`); `continue-exploring.tsx`, `layout.tsx`, `sidebar-config.ts`, and every existing route show zero diff.
9. **Automated checks:** `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
10. **Accessibility** — one `<h1>`, no skipped heading level into `ContinueExploring`'s own `<h2>`, every link has a real accessible name, focus-visible present, keyboard-only navigation reaches every link.
11. **Responsive** — no horizontal overflow, desktop/tablet/mobile.
12. **Console errors** — none, both themes.

**Release recommendation:** **Approved** or **Refinements Required**, the identical format every prior implementation plan in this series has used.

---

## 6. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/app/not-found.tsx` | New | WI-1, WI-2, WI-3 |

**Not touched by this plan, anywhere:** `components/work/continue-exploring.tsx`, `app/layout.tsx`, `lib/navigation/config.ts`, `components/navigation/`, `lib/navigation/sidebar-config.ts`, `components/feedback/`, every existing route under `app/knowledge/`, `app/work/`, `app/engineering-log/`, `app/about/`, `app/search/`.

One new file. Zero modified files — the smallest production-code footprint of any Core Pages task this milestone, smaller than About's nine new files and Search's five.

---

## 7. Sequencing

```
WI-1 (headline, explanation)
       │
       ▼
WI-2 (ContinueExploring, six links)
       │
       ▼
WI-3 (metadata)
       │
       ▼
WI-4 (RC review)
```

WI-1 → WI-2 → WI-3 are sequential only in the sense that they compose the same returned JSX/export set in one file — none has a functional dependency on the others' internals (WI-3's `metadata` export is independent of WI-1/WI-2's JSX). WI-4 is strictly last.

---

## 8. Explicit Guardrails

- No `global-not-found.js`, no `next.config.ts` change.
- No per-route `not-found.tsx` under `knowledge/[slug]/`, `work/[slug]/`, or `engineering-log/[slug]/`.
- No `error.tsx`.
- No new component anywhere, including `components/feedback/` (§3's finding) — `ContinueExploring` is imported, not reimplemented.
- No `robots` metadata field.
- No client component, no `"use client"`.
- No modification to `continue-exploring.tsx`, `layout.tsx`, `workspace-layout.tsx`, `sidebar.tsx`, or `sidebar-config.ts`.

---

## 9. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Implementation adds a `robots` field out of habit, matching `/search`'s own pattern from Task 6.4 | Medium | WI-3's acceptance criterion states the absence explicitly, and WI-4 step 3 tests for the automatic behavior directly rather than trusting the omission alone |
| A "quick" custom recovery-links block gets hand-rolled instead of importing `ContinueExploring`, since the six-link list is easy to just write inline as plain JSX | Medium | WI-2 states the import path and exact prop shape explicitly, and WI-4 step 6 checks for it in review |
| HTTP status is assumed `404` without being checked, since the page visually renders correctly either way | Low | WI-4 step 2 is a direct, separate verification step from step 1's visual check |

---

## 10. Verification Plan

Inherits `docs/43` §23 in full; formally executed and signed off by WI-4.

---

## 11. Rollback Plan

One new, independently deletable file. No existing file is modified anywhere in this plan, so rollback is deleting `src/app/not-found.tsx` — the simplest rollback profile of any Core Pages task so far, tied with About's.

---

## 12. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/43` — none introduces a new architectural decision.
- The `docs/08-ERROR_EXPERIENCE.md`/`docs/09-EMPTY_STATES.md` naming discrepancy (§3) is recorded, and the plan proceeds from the real files' already-verified content instead.
- `components/feedback/`'s empty, unpopulated status is confirmed and explicitly not changed by this task (§3).
- File manifest (§6) is exhaustive; guardrails (§8) leave no reasonable path into any of `docs/43`'s named non-goals.
- No production code, component, route, or content was modified to produce this document.

---

## 13. Final Report Requirements

WI-4's own deliverable — work items completed, file manifest as actually diffed vs. this plan's prediction, all twelve WI-4 verification steps individually, guardrail confirmation, and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/43-404_EXPERIENCE.md`'s architecture into four work items — one new file, zero modified files, the smallest footprint of any Core Pages task this milestone. WI-1 and WI-3 are a handful of static lines each; WI-2 is a direct import of an already-proven, already-generalized component with a hand-authored six-link list. The one real risk this plan names directly (§9's own top row) is a habit risk, not an architectural one: carrying over `/search`'s own `robots` pattern into a page where that pattern is actively wrong, because this Next.js version already handles it automatically — WI-4 verifies against that specific failure by testing the live response, not by trusting the omission on faith.
