# 43 — 404 Experience

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.5's design proposal, following `docs/12-Implementation Roadmap.md`'s Milestone 6 — Core Pages sequence, after Task 6.1 (Homepage Integration), Task 6.2 (Engineering Log Experience), Task 6.3 (About Experience), and Task 6.4 (Minimal Search), all complete and approved.

---

## 1. Purpose

`docs/12` lists **404** as one of Milestone 6's own deliverables, alongside Homepage, Knowledge, Work, Engineering Log, About, and Search — all five of which are now built. 404 is the last.

This isn't a hypothetical page being built ahead of need. **Three real call sites already throw into it today**: `app/knowledge/[slug]/page.tsx`, `app/work/[slug]/page.tsx`, and `app/engineering-log/[slug]/page.tsx` each call `notFound()` (`next/navigation`) for an unresolved slug — confirmed by direct read of all three files. With no `src/app/not-found.tsx` anywhere in this repository (confirmed by directory listing), every one of those three call sites, plus any genuinely mistyped URL, currently falls through to Next.js's own unstyled default 404 — the one moment in this entire workspace where a visitor sees an interface this project didn't design. Task 6.5 exists to close that gap.

---

## 2. Current State (Reconnaissance)

Verified against the actual repository, not assumed.

### The three existing `notFound()` call sites

| Route | Call site | Trigger |
|---|---|---|
| `/knowledge/[slug]` | `app/knowledge/[slug]/page.tsx:274` | Step 3 of the documented Topic → Article → 404 resolution order (`docs/20-ARTICLE_EXPERIENCE.md`) — neither a topic nor an article slug matched. |
| `/work/[slug]` | `app/work/[slug]/page.tsx:99` | `if (!caseStudyExists(slug)) notFound();` |
| `/engineering-log/[slug]` | `app/engineering-log/[slug]/page.tsx:76` | `if (!engineeringLogEntryExists(slug)) notFound();` |

All three check existence synchronously, near the top of an `async` Server Component, before any other data resolution or streaming begins — confirmed by direct read. This matters concretely (§7): a real `404` HTTP status can be returned cleanly in every case, not just a `noindex`-tagged `200`.

### No 404 infrastructure exists yet

Confirmed by directory listing: no `src/app/not-found.tsx`, no `src/app/error.tsx`, no `src/app/loading.tsx`, no `src/app/global-not-found.tsx`, no per-route `not-found.tsx` anywhere under `src/app/`.

### This Next.js version's 404 conventions — verified against this project's own bundled docs, not assumed

`AGENTS.md`'s own standing instruction applies directly here: this is a customized Next.js build, and its 404 conventions have changed from what trained knowledge would assume. Verified against `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/not-found.md` and the sibling `04-functions/not-found.md` (Next.js 16.3.0, confirmed via `package.json`):

- **Two separate conventions now exist.** `not-found.js` — the classic convention — renders for `notFound()` calls thrown within a route segment, wrapped by that segment's own layout chain. **`global-not-found.js`** is a new, *experimental* convention (requires an explicit `experimental.globalNotFound` flag in `next.config.ts`) for apps that can't compose a single global 404 through `layout.js` + `not-found.js` — specifically, apps with multiple root layouts or a root layout defined by a dynamic segment. **Neither applies to this repository**: there is exactly one root layout (`src/app/layout.tsx`), and it has no dynamic segments. `global-not-found.js` is not needed here, and this proposal doesn't recommend it.
- **A single root `app/not-found.tsx` already does everything this task needs.** Per this project's own docs, quoted directly: *"In addition to catching expected `notFound()` errors, the root `app/not-found.js`... file[s] handle any unmatched URLs for your whole application."* This has been true since Next 13.3.0 (confirmed in the doc's own Version History table). One file, at the App Router root, catches both: the three existing `notFound()` throws, and a genuinely mistyped or nonexistent URL. This is the concrete architectural reason the user's own Critical Rule — no route-specific `not-found.tsx` files — isn't just a scope restriction; it's redundant with what the root file already covers.
- **`not-found.js` renders wrapped in its layout chain.** Root layout.tsx (confirmed by direct read) wraps every route's `children` in `WorkspaceLayout` (`Header`, `Sidebar`, `Footer`) before `ThemeProvider`. A root `app/not-found.tsx` inherits this automatically — Header, Sidebar, and Footer render around it with zero additional wiring, the same as any other page. `Sidebar`'s own `getSidebarSections()` (`lib/navigation/sidebar-config.ts`, confirmed by direct read) already returns `null` for any unrecognized top-level path segment — an unmatched URL collapses the sidebar to nothing automatically, a case this proposal doesn't need to special-case.
- **`noindex` is automatic.** Per this project's own docs: *"Next.js also injects a `<meta name=\"robots\" content=\"noindex\" />` tag"* for `notFound()`, and more broadly *"for pages that return a 404 status code."* **This page needs no hand-written `robots` metadata export** — unlike `/search` (`docs/42` WI-8), which needed one explicitly. Writing one anyway would be redundant infrastructure this task doesn't need to add.
- **Status code**: *"Next.js will return a 200 HTTP status code for streamed responses, and 404 for non-streamed responses."* All three existing call sites resolve synchronously before any streaming begins (confirmed above), so a real `404` status applies cleanly in every case this task needs to cover — no Suspense-boundary caveat is relevant here.

### Governing content/tone guidance — real, already-approved, not invented for this task

`docs/24-ENGINEERING_PRINCIPLES.md`, "Error Handling" (confirmed by direct read): *"Use: custom error pages, not-found pages, graceful MDX failures, descriptive logging. Never expose internal errors to users."*

`docs/08-UX Guidelines.md` (confirmed by direct read) — two directly applicable sections:
- **"Error Experience"**: *"Errors should feel calm. The interface should explain: what went wrong, what users can do next, how to recover. Avoid technical jargon unless the audience benefits from it."*
- **"Empty States"**: *"Empty states should educate rather than disappoint... Every dead end should become a new path."* A 404 is the literal, ultimate dead end this principle was written for.

`docs/09-Component Specification.md`, Feedback Components → "Error State" (confirmed): *"Explains failures clearly. Offers recovery paths."*

`docs/07-DESIGN_SYSTEM.md`, "Calm Interfaces" (confirmed, already quoted by `Header`'s own docstring): no unnecessary gradients, no heavy shadows, no excessive animation.

`docs/08`'s "Signature Experience": *"Visitors should leave with the feeling that they have explored an engineer's workspace... Curiosity should naturally lead the journey."* Even a 404 should point toward real, specific destinations, not a bare "Go home" link.

### An existing component that already does exactly this job

`components/work/continue-exploring.tsx` (confirmed by direct read): a Server Component, already fully generalized to props (`title`, `introduction`, `links: {label, description, href}[]`) since Task 5.2 specifically so multiple pages could share it — and already imported outside `components/work/` (`app/engineering-log/page.tsx` uses it directly). Its own docstring states its purpose in almost the exact words `docs/08`'s "Empty States" section uses: *"Continue Exploring should always guide readers outward from the current experience... here are some honest next steps."* This is a direct, load-bearing reuse opportunity (§13) — not a new component to design.

### No search dependency, no new UI primitive needed

`components/ui/` now includes `button.tsx`, `card.tsx`, `dropdown-menu.tsx`, `input.tsx` (Task 6.4), `separator.tsx`, `skeleton.tsx`, `tooltip.tsx` — everything this task needs already exists.

---

## 3. Discrepancies Found

- **`docs/03-SITEMAP.md` never mentions 404, error pages, or missing-route behavior anywhere** — confirmed by an exhaustive case-insensitive search of the file for "404," "error," "missing," "broken," and "invalid," none of which return a single match. Every other Core Pages task in this milestone (Homepage, Engineering Log, About, Search) had at least a named section or an explicit sitemap entry to build from; 404 has neither. This is a real documentation gap, not a discrepancy this proposal silently reconciles — §5/§9 below ground this page's content in `docs/08`/`docs/09`/`docs/24` instead, all three of which do speak to error/empty-state behavior directly, and this gap is recorded here so a future documentation pass can close it in `docs/03` itself.
- **This task isn't preemptive.** Unlike every other page this milestone built, 404 already has three live trigger points shipped and in production use (`notFound()` in Knowledge, Work, and Engineering Log's detail routes) that are, right now, falling through to Next's unstyled default page. Recorded here because it changes this task's urgency, not its scope.
- No other discrepancy found — this project's actual 404 conventions (§2) matched what a careful reading of its own bundled Next.js docs predicted; nothing in the existing codebase contradicts what this proposal recommends.

---

## 4. Core Question: What Does a 404 Page Need to Do Here?

```text
A visitor arrives with a broken link, a typo, or a
removed/renamed page — with no idea what went wrong.
                    │
                    ▼
   docs/08 "Error Experience": explain what happened,
   calmly, without jargon
                    │
                    ▼
   docs/08 "Empty States" / docs/09 "Error State":
   offer real recovery paths — never a dead end
                    │
                    ▼
   docs/08 "Signature Experience": point toward
   genuine curiosity, not just "go home"
```

Three real, already-approved documents already answer "what should this page do" precisely — this proposal's job is composing their answers into one page, using components that already exist, not inventing new UX for a problem this workspace has already thought through in the abstract.

---

## 5. Problem Statement

`/knowledge/[slug]`, `/work/[slug]`, and `/engineering-log/[slug]` each already call `notFound()` for an unresolved slug, and any mistyped or removed URL across the whole site hits the same gap — with no `app/not-found.tsx`, every one of those falls through to Next's own unstyled default page, the only interface in this entire workspace this project didn't design. Task 6.5 designs the one file that closes this gap for the whole application at once, reusing this workspace's own already-established "here's where to go next" component rather than building new UI for a problem `docs/08`/`docs/09` have already specified the shape of.

---

## 6. Goals

- Define a single root `app/not-found.tsx` — matching Header/Sidebar/Footer, matching the rest of the site's visual language, matching `docs/08`'s Error Experience and Empty States guidance directly.
- Ground the page's content in what's already approved (`docs/08`, `docs/09`, `docs/24`) rather than inventing new copy guidance for this task alone.
- Reuse `ContinueExploring` for the page's entire "where do I go instead" section — zero new navigation component.
- Confirm, precisely, that this project's actual Next.js 16 conventions (§2) make a single root file sufficient — not `global-not-found.js`, not per-route files.
- Record the `docs/03` documentation gap explicitly (§3) rather than silently filling it in as if it had always specified this.
- Keep the page server-rendered, with no client component, no new dependency, and no new UI primitive.

## 7. Non-Goals

- `global-not-found.js` or any `next.config.ts` change — this repository's single, non-dynamic root layout doesn't need it (§2).
- Route-specific `not-found.tsx` files under `knowledge/[slug]/`, `work/[slug]/`, or `engineering-log/[slug]/` — the root file already catches all three (§2); a per-route file would be redundant, unreachable-in-practice UI this task doesn't need to build.
- A custom `error.tsx` (runtime/rendering error boundary) — a genuinely different problem (an exception during render, not a missing resource) `docs/24`'s own "Error Handling" list names separately ("custom error pages" and "not-found pages" as two distinct bullets); out of scope for this task.
- A search box embedded directly on the 404 page — `/search` (Task 6.4) is a real, complete destination now; this page links to it as one of `ContinueExploring`'s own honest next steps rather than duplicating its form.
- Any illustration, mascot, or custom 404 artwork — `docs/07`'s "Calm Interfaces" and `docs/01`'s "no unnecessary illustrations" both already rule this out; nothing about a missing-page state changes that.
- A `robots` metadata export — automatic for any 404-status response in this Next.js version (§2); writing one would be redundant.
- Fixing the `docs/03` documentation gap itself (§3) — noted, not resolved, by this proposal; that's a documentation-maintenance task, not this one.

None of these boundaries need to move based on anything found in the repository.

---

## 8. Route / File Convention

```text
src/app/not-found.tsx
```

One file, at the App Router root. Renders for:
1. Any of the three existing `notFound()` throws (Knowledge, Work, Engineering Log detail routes), and
2. Any URL that doesn't match a route in this application at all (a typo, a removed page, an external link pointing at content that no longer exists).

Both cases render identically — this page has no way to distinguish "you mistyped a URL" from "this specific article was removed," and `docs/08`'s own Error Experience guidance doesn't ask it to. A Server Component (the default for `not-found.tsx`, confirmed in this project's own docs) — no `"use client"`, no interactivity, no data fetching. Wrapped automatically by root `layout.tsx`'s `WorkspaceLayout` — Header, Sidebar (correctly collapsing itself for an unmatched path), and Footer all render around it exactly as they do for any other page, with zero additional composition needed in this file.

---

## 9. Content

Grounded directly in `docs/08`'s "Error Experience" (explain what happened, what's next, how to recover, no jargon) and "Empty States" (every dead end becomes a new path) — not invented fresh for this task.

**A quiet, honest headline** — no bare "404" as the primary message (`docs/08`'s "avoid technical jargon"); a small, muted "404" label in the same eyebrow register every other page already uses (`"Search"`, `"About"`, `"Engineering Log"`) is enough acknowledgment of what technically happened, with a real sentence as the actual `<h1>` — something in the register of *"This page doesn't exist."* or *"Nothing's here."*, calm and plain rather than apologetic or alarmed.

**One line of explanation** — the page or link that was requested doesn't exist in this workspace, stated once, without guessing at *why* (a stale link, a typo, removed content — the page can't know which, and shouldn't pretend to).

**A real "where to go instead" section — `ContinueExploring`, reused directly (§13).** This is where `docs/08`'s "every dead end should become a new path" and `docs/09`'s "offers recovery paths" both actually get satisfied — not by a single "Go home" link, but by the same honest, multi-destination list every other page in this workspace already closes on. Candidate destinations, each with its own one-line reason (matching `ContinueExploring`'s own established idiom, not a generic "you might like" list):

| Destination | Why it belongs here |
|---|---|
| Knowledge | "Browse the concepts documented so far." |
| Work | "See the engineering case studies." |
| Engineering Log | "Read the raw process behind the work." |
| About | "Find out who's behind this workspace." |
| Search | "Look for something specific by title or description." |
| Home | "Start from the workspace's own front door." |

Exact copy and final destination selection is an implementation-task decision (the same granularity every prior `ContinueExploring` call site — Work Landing, Work Library, Engineering Log — already made independently); the architectural point is that this section reuses the component wholesale, not that this proposal fixes its final wording.

---

## 10. Reading Flow

```text
Arrival (a broken link, a typo, or a real notFound() throw)
        ↓
Header, Sidebar (collapsed), unchanged — this still looks
like the same workspace, not an error screen bolted on
        ↓
"404" (quiet label) → a calm, plain headline → one line
of honest explanation
        ↓
ContinueExploring — real, specific destinations, each with
its own reason — never a single "Go home" link
        ↓
Footer, unchanged
```

A visitor never leaves the site's own visual language at any point in this flow — the entire point of building this page at all, instead of leaving Next's own default in place.

---

## 11. Navigation

No navigation-configuration change of any kind. `PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, `Header`, `MobileNavigation`, `Sidebar` all render exactly as they already do on every other page — a 404 is not a special navigation state, it's a page like any other that happens to have no dynamic content. `Sidebar`'s existing `getSidebarSections()` behavior (§2) already handles an unmatched path correctly with zero change.

---

## 12. Content Architecture

No content collection, no loader, no resolver. `not-found.tsx`'s text (the headline, the explanation line) is page-local — either inline JSX or, if this workspace's own "copy lives in `lib/constants/*.ts`, read directly by the page" pattern (`homepage-copy.ts`, `about-copy.ts`) is judged worth extending here, a small `not-found-copy.ts`. Either is architecturally correct; this proposal doesn't fix which — a page this small, with no second consumer of its copy, doesn't have the same "prevent duplicate claims across files" pressure `about-copy.ts` was built to solve (`docs/40` §4), so inlining is the simpler default unless the implementation plan finds a concrete reason to extract it.

`ContinueExploring`'s own `links` array is the one place this page does need real data — but it's a fixed, hand-authored list of six known destinations (§9's table), not anything resolved from a collection.

---

## 13. Component Reuse

| Existing Component | Purpose | Reuse? | Modification Needed? |
|---|---|---|---|
| `WorkspaceLayout` (via root `layout.tsx`) | Header/Sidebar/Footer wrapping | Yes, automatic | None |
| `Section` / `Stack` | Page layout rhythm | Yes | None |
| `ContinueExploring` (`components/work/continue-exploring.tsx`) | The entire "where to go instead" section | **Yes — direct reuse, not a new component.** Already generalized to props, already imported outside `components/work/` (`app/engineering-log/page.tsx`) | None |
| `Sidebar` | Already correctly collapses for unmatched paths | Yes, automatic | None |

**Nothing new is required beyond `app/not-found.tsx` itself.** This is the first Core Pages task in this milestone that adds zero new presentational components — even About (docs/40) needed seven, and Search (docs/42) needed two — because the one component this page's entire content section needs (`ContinueExploring`) already exists, already takes exactly the shape this page needs, and is already proven to work outside its original file location.

---

## 14. Data / Loader Architecture

None. No collection, no `getAll()` read, no relationship resolution. The simplest data layer of any page in this workspace — a fixed, hand-authored list of six links, the same "content that doesn't come from a collection" shape About's own `lib/constants/about-copy.ts` already established (`docs/40` §11), at an even smaller scale.

---

## 15. Visual Hierarchy / Restraint

No new pattern. `docs/07`'s "Calm Interfaces" (no gradients, no heavy shadows, no excessive animation) and `docs/01`'s "no unnecessary illustrations" both apply exactly as they do everywhere else in this workspace — a 404 page is not a moment to introduce a different visual register (an illustrated mascot, a large decorative "404" numeral, a joke). The "404" label reads at the same quiet, muted weight every other page's own eyebrow label already uses; nothing on this page is styled more prominently than `ContinueExploring`'s own already-established, restrained idiom.

---

## 16. Responsive Behavior

No new pattern. `Section`/`Stack` and `ContinueExploring`'s own already-responsive list — the identical rhythm every other page in this workspace already uses at every breakpoint. No table, no wide code block, no diagram — the lowest possible overflow-risk profile, tied with About's.

---

## 17. Accessibility

- One real `<h1>` — the calm headline (§9), not a bare "404."
- `ContinueExploring`'s own heading (`<h2>`, "Continue Exploring" or an equivalent honest label) follows it — no skipped level.
- Every recovery link is a real `<Link>` with a descriptive accessible name (`ContinueExploring`'s own already-established pattern — the link label *is* the destination's name, never "click here").
- Focus-visible, keyboard navigation, and semantic landmarks are all inherited unmodified — `docs/08`'s "Accessibility Experience" bar (keyboard-first, visible focus, semantic landmarks, descriptive link text, reduced motion, sufficient contrast) is met by composition, not by anything new this page needs to build.
- `WorkspaceLayout`'s existing "Skip to content" link works identically here — a 404 is a normal page in that landmark structure, not an exception to it.

---

## 18. Performance

Fully static or near-static — a `not-found.tsx` with no data fetching and no dynamic content is at least as cheap as any other page in this workspace, and cheaper than `/search` (which must read three collections per request). No client JavaScript beyond what `ContinueExploring`'s own plain `<Link>`s already require (none — it's a Server Component).

---

## 19. SEO / Metadata Boundary

**No hand-written `robots` metadata** — automatic for any 404-status response in this Next.js version (§2), confirmed directly against this project's own bundled docs. A real, calm `title`/`description` (e.g. *"Page Not Found — Engineering Portfolio"*) is still worth setting explicitly, matching every other route's own `export const metadata` pattern — the one piece of metadata this page does own. No canonical URL, no Open Graph, no structured data, matching the same bounded scope every other Core Pages task in this milestone already drew.

---

## 20. Empty / Failure States

This entire page *is* an empty/failure state — there's no further "what if this is empty" question to answer beneath it. The one real sub-case worth naming: `ContinueExploring`'s `links` array is fixed and hand-authored (§12), so it can never itself be empty the way a collection-backed listing could — there's no "even the recovery section has nothing to show" failure mode to design for here.

---

## 21. Architecture Decisions

### D1 — A Single Root `not-found.tsx`, Not `global-not-found.js`, Not Per-Route Files

**Context:** This Next.js version offers three ways to handle a missing page — root `not-found.tsx`, experimental `global-not-found.js`, or per-segment `not-found.tsx` files.

**Options Considered:** (a) `global-not-found.js`; (b) a `not-found.tsx` per dynamic route (`knowledge/[slug]/not-found.tsx`, etc.); (c) one root `app/not-found.tsx`.

**Chosen Approach:** (c).

**Rationale:** `global-not-found.js` solves a problem this repository doesn't have (multiple root layouts, or a dynamic root layout) and would mean hand-rebuilding the Header/Sidebar/Footer wrapping `WorkspaceLayout` already gives a normal `not-found.tsx` for free — strictly more work for a worse result. Per-route files would be redundant: this project's own docs confirm the root file already catches every `notFound()` throw with no closer file of its own, which is every real case this repository has today.

**Trade-offs:** None identified — this is the simplest option and also the architecturally correct one, a rare case where they fully coincide.

**Consequences:** If a future page ever needs meaningfully different 404 content (e.g., a Knowledge-specific "browse topics instead" message), a route-specific `not-found.tsx` remains available without conflicting with this one — but nothing in the current repository asks for that yet.

### D2 — `ContinueExploring`, Reused Wholesale, Not a New "Recovery Links" Component

**Context:** This page needs a "here's where to go instead" section; `ContinueExploring` already exists and already does exactly this.

**Options Considered:** (a) a new, 404-specific recovery-links component; (b) reuse `ContinueExploring` directly.

**Chosen Approach:** (b).

**Rationale:** `ContinueExploring` was already generalized to props specifically so more than one page could share it (`docs/29` §4, extended in Task 5.2), and is already proven to work outside `components/work/` (`app/engineering-log/page.tsx`). Building a second, near-identical component for 404 would be exactly the duplication `docs/24` Principle 3 rules out, for a component that has no 404-specific need at all — a missing page needs the same "honest next steps" shape any other page's closing section does.

**Trade-offs:** None identified.

**Consequences:** A future change to `ContinueExploring`'s own visual treatment updates 404's recovery section automatically, the same as it already does for Work Landing, Work Library, and Engineering Log.

### D3 — No `robots` Metadata Export

**Context:** Every other Core Pages task's metadata section (`docs/35`/`docs/37`/`docs/40`/`docs/42`) had to decide its own `robots` value; `/search` needed an explicit `noindex`.

**Options Considered:** (a) hand-write `robots: { index: false }`, matching `/search`'s own pattern; (b) omit it, relying on this Next.js version's automatic 404 behavior.

**Chosen Approach:** (b).

**Rationale:** This project's own bundled docs confirm `noindex` is injected automatically for any 404-status response — writing it by hand would be redundant, inert code that looks load-bearing but isn't. Every other Core Pages task's metadata boundary was about *adding* the minimum necessary; here, the minimum necessary is zero.

**Trade-offs:** None identified.

**Consequences:** If a future Next.js upgrade changes this automatic behavior, `docs/43`'s own §2 evidence is the place to re-verify it — not an assumption to carry forward silently.

---

## 22. Implementation Scope

### Must implement

- `app/not-found.tsx` — headline, one-line explanation, `ContinueExploring` with a real six-destination list (§9), its own `title`/`description` metadata (no `robots`).

### May implement if already supported by existing infrastructure

- A small `lib/constants/not-found-copy.ts`, only if the implementation plan finds a concrete reason to extract the page's two lines of copy rather than inlining them (§12) — not fixed by this proposal either way.

### Explicitly deferred / out of scope

- `global-not-found.js`, any `next.config.ts` change.
- Any per-route `not-found.tsx`.
- A runtime `error.tsx` boundary — a different problem (§7).
- An embedded search box (link to `/search` instead, via `ContinueExploring`).
- Fixing `docs/03`'s own silence on 404 (§3) — recorded, not resolved, here.

---

## 23. Verification Plan

### Functional
- Visiting a genuinely nonexistent URL (e.g. `/this-does-not-exist`) renders this page, wrapped in Header/Footer, with Sidebar correctly collapsed.
- Visiting `/knowledge/<nonexistent-slug>`, `/work/<nonexistent-slug>`, and `/engineering-log/<nonexistent-slug>` each render this same page (confirming the root file catches all three existing `notFound()` throws).
- Every `ContinueExploring` link resolves to a real, working page.
- HTTP status is `404` for all four cases above (verified directly, not assumed from this proposal's own reading of the docs).

### Responsive / Accessibility / Technical
Identical bar to every prior page-level verification in this repository: `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build`, heading hierarchy, keyboard navigation, focus visibility, no horizontal overflow, light/dark mode.

### Regression
Every existing route, `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION`, `Header`/`Sidebar`/`Footer`, and `ContinueExploring`'s three existing call sites (Work Landing, Work Library, Engineering Log) remain unchanged — this task's implementation should touch no file any of them depends on, beyond adding the one new root file.

---

## 24. Acceptance Criteria

- The single-root-file architecture (§8, D1) is justified with direct evidence from this project's own bundled Next.js docs, not assumed from general Next.js familiarity — the exact discipline `AGENTS.md` requires.
- `ContinueExploring`'s reuse (§13, D2) is a direct import, not a re-implementation.
- The automatic-`noindex` finding (§19, D3) is verified against this project's own docs before being relied on.
- The `docs/03` documentation gap (§3) is recorded explicitly, not silently patched over.
- No production code, component, route, or content was modified to produce this document.

---

## 25. Open Questions

**Q1 — Should `docs/03-SITEMAP.md` be amended to name 404's required content, closing the gap §3 identifies?**
*Why it matters:* every other Core Pages task had a named sitemap section to build from; this one didn't. *What's blocked:* nothing in this proposal — `docs/08`/`docs/09`/`docs/24` already supplied enough real guidance to design this page without it. *Evidence needed:* an editorial decision on whether `docs/03` should be kept current with pages that exist, a decision this proposal doesn't make on its own behalf.

**Q2 — Should the recovery section's six destinations (§9) all always appear, or should the list vary (e.g., omit Home if the referring context suggests the visitor already knows this is a portfolio)?**
*Why it matters:* affects `ContinueExploring`'s `links` array size but not this page's architecture. *What's blocked:* nothing — a fixed six-item list is a safe, simple default. *Evidence needed:* none required to proceed; an implementation-task-level copy decision, the same granularity every other `ContinueExploring` call site already made independently.

---

## 26. Final Recommendation

**Recommended architecture:** one file, `src/app/not-found.tsx` — a Server Component with no data fetching, wrapped automatically in this workspace's existing Header/Sidebar/Footer, its entire "what do I do now" section built from `ContinueExploring`, reused exactly as it already is. No new component, no new dependency, no `robots` metadata to hand-write, no `next.config.ts` change. This is the smallest implementation footprint of any Core Pages task in this milestone — smaller than About (seven components), smaller than Search (two components plus two resolver exports) — because the one thing this page needs already exists in exactly the right shape.

**Recommended implementation sequence**, once approved:
1. `app/not-found.tsx` — headline, explanation, metadata.
2. `ContinueExploring`, wired with a real six-destination list.
3. Full verification pass (§23), including a direct HTTP-status check against all three existing `notFound()` call sites, not just the page's own visual rendering.

**Known risks:**
- The temptation to add something 404-specific and clever (an illustration, a joke, a search box embedded inline) is real, and `docs/07`/`docs/01` already rule most of it out — worth naming for whoever implements this next, the same way every prior proposal in this series has named its own equivalent temptation.
- `docs/03`'s silence on 404 (Q1) means there's no sitemap-level check to catch scope drift the way About or Search each had — this proposal's own §9 table is the one concrete content spec to hold implementation to.

**This document authorizes no implementation.** Task 6.5's actual build requires its own implementation plan and approval, following the same workflow every prior milestone in this repository has used.
