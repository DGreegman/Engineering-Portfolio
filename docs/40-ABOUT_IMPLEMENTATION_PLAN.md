# 40 — About Implementation Plan

## Status

Implementation Plan — translating the approved `docs/39-ABOUT_EXPERIENCE.md` into a precise, implementation-ready specification.

> This document authorizes no implementation. It is documentation only. No production source file, component, route, or content was modified to produce it.

---

## 1. Purpose

`docs/39` establishes *what* Task 6.3 should do and *why*. This document establishes *exactly what changes, file by file* — the same role `docs/36`/`docs/38` played for Tasks 6.1/6.2. Every work item traces to a specific section of `docs/39`. Re-inspection of the actual repository (§3) confirmed `docs/39`'s own description of current state precisely — no discrepancy was found this time, unlike Task 6.2's `DocumentLayout` gap.

---

## 2. Authoritative Inputs & Constraints

`docs/39-ABOUT_EXPERIENCE.md` is the architecture authority; `docs/01-PERSONAL_BRAND.md` is the editorial source. Carried forward unchanged:

- **About is one canonical, static, server-rendered editorial page** — not a collection, not MDX, not a CMS, not a database record, not an API resource (`docs/39` §11, D1).
- **`content/pages/` is not registered.** No resolver, no `getAbout()`-style abstraction is introduced merely for its own sake — a single page reading a single constants module directly is the correct shape, not an abstraction gap to fill.
- **Same source, several depths, never a restatement** (`docs/39` §12, D2) — About's Journey/Engineering Principles/Current Interests sections must say something `BeyondTheCode`'s four paragraphs don't, grounded in the same source document, not copy-pasted under new headings.
- **No fabricated content** — years of experience, employers, project counts, certifications, education, or metrics not already present in `docs/01` or elsewhere in this repository must not be invented. Where real material doesn't exist (resume, portrait), the section is omitted, not stubbed (`docs/39` §21, D3).
- **`docs/01-PERSONAL_BRAND.md` is editorial source material, not a runtime dependency.** No file under `src/` imports from `docs/`. See §4 for exactly how its content becomes application content without that import ever existing.

---

## 3. Re-Inspection Findings

Re-verified directly against the actual repository — no discrepancy from `docs/39`'s own description found.

- `src/app/page.tsx`, `src/components/home/beyond-the-code.tsx`, `BEYOND_THE_CODE_COPY` (`lib/constants/homepage-copy.ts`): confirmed unchanged since `docs/39` was written — four paragraphs, one CTA (`"Let's Connect →"` → `/about`), no photo/grid/metadata.
- `lib/navigation/config.ts`: `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION` still list `{ label: "About", href: "/about" }`, unresolved.
- No `src/app/about/` directory exists.
- `content/pages/` still contains only `.gitkeep`; still unregistered in `lib/content/collections.ts`.
- `lib/metadata/`, `lib/seo/` still empty (`.gitkeep` only).
- `lib/constants/site.ts` confirmed: `SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL` all present, all real, all reusable as-is.
- `public/images/`, `public/logos/`, `public/og/` confirmed empty — no portrait or resume asset exists anywhere in the repository.
- `Section` (`components/layout/section.tsx`) and `Stack` (`components/layout/stack.tsx`) signatures confirmed precisely: `Section({ spacing = "md", width = "standard" | "full", className, children })`; `Stack({ gap, as = "div" | "ul" | "ol", className })`.
- `components/navigation/footer.tsx`'s `FooterConnect` confirmed as the exact existing pattern for the icon+link idiom Contact should reuse: `GithubIcon`/`LinkedinIcon` (`components/shared/icons.tsx`) and `Mail` (`lucide-react`), each an `<a>` with `target="_blank" rel="noopener noreferrer"` for external links, a plain `mailto:` for email.

No file's actual contract differs from what `docs/39` assumed. This plan proceeds without any correction to that document.

---

## 4. Editorial Source Rule — How `docs/01` Becomes Runtime Content

**The constraint, restated precisely:** `docs/01-PERSONAL_BRAND.md` is a Markdown file under `docs/`. Nothing under `src/` may `import` or `fetch` it at runtime, build time, or any other time — that would make production rendering depend on a documentation file's exact prose surviving unchanged, and would blur "this repository's own documentation about itself" with "content this repository serves to visitors," two things that must stay structurally separate even though one currently informs the other editorially.

**The mechanism:** a human transcribes and adapts `docs/01`'s relevant statements into `lib/constants/about-copy.ts` — the same relationship `docs/14-HOMEPAGE_COPY.md` already has to `homepage-copy.ts`, and `docs/26-CASE_STUDY_TEMPLATE.md` already has to every real `content/work/*.mdx` file: a design/content document a human writes *from*, never a file the application reads *from*. This is not a new pattern this plan invents — it is the exact, already-proven relationship between every prose-guidance doc in this repository and the TypeScript/MDX content it informs.

**Preserving one canonical representation, per this task's own instruction not to duplicate the same personal claim across unrelated constants:** `about-copy.ts` becomes the **one** application-side statement of each identity fact once this task ships. `BEYOND_THE_CODE_COPY` (homepage) is not modified by this plan and is not required to match `about-copy.ts` word-for-word — the two are deliberately different depths of the same underlying truth (`docs/39` D2) — but neither should `about-copy.ts` be treated as a second, competing source alongside a third rewrite somewhere else. Concretely: **no other file introduced by this plan restates a personal/professional claim already captured in `about-copy.ts`.** If a future task needs the same fact (e.g. `SITE_NAME`, already centralized in `site.ts`), it imports from wherever this plan puts it, rather than retyping the claim a third time.

**Where the line sits exactly:** `lib/constants/site.ts`'s existing facts (`SITE_NAME`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`) are **not** duplicated into `about-copy.ts` — `about-copy.ts` imports and reuses them (WI-1), the same "one fact, one file" discipline every other constants file in this codebase already holds itself to (`homepage-copy.ts` does not redeclare `SITE_NAME` either).

---

## 5. Homepage/About Separation Map

```
BEYOND_THE_CODE_COPY (homepage-copy.ts)         ABOUT_*_COPY (about-copy.ts, new)
        │                                               │
        ▼                                               ▼
"I'm a backend engineer who enjoys           Engineering Principles: the fuller,
 understanding how systems work..."           multi-point philosophy docs/01 states
        │                                       directly (5 stated principles)
        ▼                                               │
(4 paragraphs, one continuous reflection,               ▼
 no section structure)                        Journey / Current Interests / Tools /
                                                Learning Roadmap / Contact — five
                                                more sections BeyondTheCode never
                                                attempts
```

**Stays on the homepage, untouched by this plan:** `BeyondTheCode`'s own file, its four paragraphs, its CTA copy and destination.

**Lives only on About:** Journey, the full multi-point Engineering Principles statement, Current Interests at About's own depth, Tools, Learning Roadmap, Contact.

**Must not be duplicated verbatim:** `BEYOND_THE_CODE_COPY.introduction`'s four paragraphs must not appear, unedited, inside any `about-copy.ts` export — each About section's copy is written fresh against `docs/01` directly (a human-authorship instruction for whoever fills in `about-copy.ts`'s real strings, not something this plan's own file/component scaffolding can enforce mechanically — flagged as WI-9's own acceptance criterion, verified by direct comparison, not assumed).

---

## 6. Work Items

### WI-1 — `lib/constants/about-copy.ts`

**Purpose:** the one new content module this task needs — six named exports, one per `docs/39` §8 section, following `homepage-copy.ts`'s own established shape (one `export const X_COPY = {...} as const` per section).

**Files to create:** `src/lib/constants/about-copy.ts`.

**Exact responsibility:**

```ts
// Conceptual shape — no implementation authorized by this document.
export const ABOUT_HEADER_COPY = {
  eyebrow: string,        // e.g. matching WorkHero's/LibraryHeader's own eyebrow pattern
  headline: string,       // one-line positioning statement, drawn from docs/01's own
  introduction: string[], // Positioning Statement, not restated from BEYOND_THE_CODE_COPY
} as const;

export const JOURNEY_COPY = { title: string, paragraphs: string[] } as const;
export const ENGINEERING_PRINCIPLES_COPY = {
  title: string,
  introduction: string[],
  principles: { title: string; description: string }[], // docs/01's own 5-point philosophy
} as const;
export const CURRENT_INTERESTS_COPY = { title: string, paragraphs: string[] } as const;
export const TOOLS_COPY = { title: string, introduction: string[], items: string[] } as const;
export const LEARNING_ROADMAP_COPY = { title: string, paragraphs: string[] } as const;
export const ABOUT_CONTACT_COPY = {
  title: string,
  introduction: string[],
  // links composed from site.ts's existing constants at the component level
  // (WI-8), not re-declared as strings here — see §4's "one fact, one file."
} as const;
```

Every string value is transcribed and adapted from `docs/01-PERSONAL_BRAND.md`'s corresponding section (Positioning Statement → Header; Engineering Philosophy → Engineering Principles; Current/Growing Technical Strengths + Content Pillars → Tools; Future Identity + Growing Expertise → Learning Roadmap) — an editorial-authorship task, not a code-structure one; this plan fixes the shape each export must have, not the exact prose, which is WI-9's own acceptance criterion to verify against `docs/01` directly.

**Journey specifically:** per `docs/39` §8/§21's own "shorter is honest" ruling and this task's own "define as editorial input rather than creating placeholder claims" instruction — `JOURNEY_COPY.paragraphs` should be written at whatever real length `docs/01` (and any other real, already-approved source) actually supports. If that's a short section, it stays short. No years-of-experience figure, employer name, or project count not already stated somewhere in this repository's approved documentation may appear here.

**Dependencies:** none — first work item, everything else composes from it.

**Acceptance criteria:** every exported string is traceable to a specific sentence or section in `docs/01-PERSONAL_BRAND.md` (or an already-existing, already-approved constant); zero net-new biographical claims; `ABOUT_HEADER_COPY`'s and every other export's content is verified, by direct side-by-side comparison, to not reproduce `BEYOND_THE_CODE_COPY.introduction` verbatim.

---

### WI-2 — `AboutHeader` Component

**Purpose:** *who is this, in one line* — `docs/39` §8's Header section.

**Files to create:** `src/components/about/about-header.tsx`.

**Exact responsibility:** `Section` + `Stack`, an eyebrow, an `<h1>` headline, and `ABOUT_HEADER_COPY.introduction`'s paragraphs — structurally the closest match to `ReadmeHero`'s/`WorkHero`'s own opening-section shape (eyebrow → h1 → intro paragraphs), reused as a pattern, not imported across a route boundary (matching every prior task's "every route owns its own section components" precedent). No image element of any kind — no portrait exists (`docs/39` D3); this component's markup should contain no `<img>`/`next/image` tag to omit conditionally, because there is no conditional here at all, only an absence.

**Dependencies:** WI-1.

**Acceptance criteria:** exactly one `<h1>` on the page comes from this component; no image tag present anywhere in the file.

---

### WI-3 — `Journey` Component

**Purpose:** *how did they get here* — prose, not a timeline widget (`docs/39` §16's explicit "causality over chronology" ruling, extending `docs/33-PROJECT_EVOLUTION.md` §7's identical principle from systems to a person).

**Files to create:** `src/components/about/journey.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, and `JOURNEY_COPY.paragraphs` rendered as plain prose — no date list, no timeline component, no "years active" figure.

**Dependencies:** WI-1.

**Acceptance criteria:** no date, year range, or chronological marker rendered as a structural element (a heading, a list item, a timeline node) — dates may appear inside prose only if `docs/01` or another approved source actually states one, never invented to make the section look more complete.

---

### WI-4 — `EngineeringPrinciples` Component

**Purpose:** *how do they think about building software* — the fuller reading of the same philosophy `HowIThink` (homepage) already compresses.

**Files to create:** `src/components/about/engineering-principles.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, intro paragraph(s), then `ENGINEERING_PRINCIPLES_COPY.principles.map(...)` — reusing `EngineeringPhilosophy`'s (Work Landing) own "plain, borderless grid with a single top rule per cell" idiom for a set of parallel statements, per that component's own precedent for "a reference list, not a card grid, not a chaptered essay" when the content is several short, parallel points rather than a progression. Not `HowIThink`'s own component reused directly — a new, About-scoped component following the same idiom, per the standing "every route owns its own section components" rule.

**Dependencies:** WI-1.

**Acceptance criteria:** renders `docs/01`'s full five-point philosophy (or however many principles `about-copy.ts` actually carries) — visibly more complete than `HowIThink`'s own homepage-scoped version, confirmed by direct comparison, not merely assumed different because the component is different.

---

### WI-5 — `CurrentInterests` Component

**Purpose:** *what are they exploring right now* — About's own depth, distinct from the homepage's `CurrentFocus`.

**Files to create:** `src/components/about/current-interests.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, `CURRENT_INTERESTS_COPY.paragraphs` — plain prose, not `CurrentFocus`'s own card grid (that treatment is homepage-scoped; About's version is prose-depth, matching Journey's and Learning Roadmap's own register rather than reproducing a card layout for content that isn't structured as parallel short items here).

**Dependencies:** WI-1.

**Acceptance criteria:** no verbatim reuse of `CURRENT_FOCUS_COPY`'s own strings (`homepage-copy.ts`).

---

### WI-6 — `Tools` Component

**Purpose:** *what do they actually build with* — plain text, never a badge wall or a rated skill list (`docs/01`'s own explicit "Things We Never Do" list; `docs/39` §16).

**Files to create:** `src/components/about/tools.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, intro, and `TOOLS_COPY.items` rendered as a plain, `·`-joined or comma-joined text line (or a simple unstyled list) — explicitly **not** a `Card` grid, **not** a percentage/rating of any kind, **not** technology logos. The same "quiet metadata line, never a primary identity" register `ProjectHeader`'s own `technologies` line already established for Work, applied here to a person's own toolset.

**Dependencies:** WI-1.

**Acceptance criteria:** no numeric rating, percentage, or star/bar element anywhere in the rendered output; no logo image.

---

### WI-7 — `LearningRoadmap` Component

**Purpose:** *where is this heading* — forward-looking, grounded in `docs/01`'s own "Future Identity"/"Growing Expertise" sections.

**Files to create:** `src/components/about/learning-roadmap.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, `LEARNING_ROADMAP_COPY.paragraphs` — plain prose, the same register as Journey.

**Dependencies:** WI-1.

**Acceptance criteria:** content traceable to `docs/01`'s own stated future direction, not invented goals.

---

### WI-8 — `Contact` Component

**Purpose:** *how does someone reach them* — the section `docs/03-SITEMAP.md` explicitly requires here instead of a standalone Contact page.

**Files to create:** `src/components/about/contact.tsx`.

**Exact responsibility:** `Section` + `Stack`, an `<h2>`, `ABOUT_CONTACT_COPY.introduction`, then three real links — reusing `GITHUB_URL`/`LINKEDIN_URL`/`CONTACT_EMAIL` directly from `lib/constants/site.ts` (imported, not re-declared — §4), and the same `GithubIcon`/`LinkedinIcon`/`Mail` icon set `FooterConnect` already uses, applying the same external-link attributes (`target="_blank" rel="noopener noreferrer"` for GitHub/LinkedIn; a plain `mailto:` for email) `FooterConnect` already establishes as this codebase's correct pattern for exactly these three link types.

**No resume link, no scheduling link** — neither asset exists (`docs/39` §21/D3); this component's markup contains no conditional, no disabled state, no "coming soon" label for either — they are simply absent, the same way `EngineeringLog`'s (homepage) empty state renders nothing rather than a placeholder.

**No contact form.** Three links only.

**Dependencies:** WI-1.

**Acceptance criteria:** exactly three interactive links, each with a real, descriptive accessible name (not "click here," not a bare icon with no `aria-label` where the visible text doesn't already say where it goes); zero form elements; zero disabled/placeholder controls.

---

### WI-9 — Route: `/about`

**Purpose:** compose the seven sections into the actual page, with its own metadata.

**Files to create:** `src/app/about/page.tsx`.

**Exact responsibility:**

```tsx
// Conceptual composition — no implementation authorized by this document.
import type { Metadata } from "next";
import { AboutHeader } from "@/components/about/about-header";
import { Journey } from "@/components/about/journey";
import { EngineeringPrinciples } from "@/components/about/engineering-principles";
import { CurrentInterests } from "@/components/about/current-interests";
import { Tools } from "@/components/about/tools";
import { LearningRoadmap } from "@/components/about/learning-roadmap";
import { Contact } from "@/components/about/contact";

export const metadata: Metadata = {
  title: "...",       // matches /work's/​/knowledge's/​/engineering-log's own plain-object pattern
  description: "...", // real, page-specific — never the root layout's generic fallback
};

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <Journey />
      <EngineeringPrinciples />
      <CurrentInterests />
      <Tools />
      <LearningRoadmap />
      <Contact />
    </>
  );
}
```

A fully static composition — no props threaded from `page.tsx` into any section (unlike the homepage's own `EngineeringNotebook`/`EngineeringCaseStudies`/`EngineeringLog`, which are data-agnostic because they consume *resolved collection data*; About's sections each own their own copy import directly, because there is no collection to resolve — `docs/39` §15's own "no data/loader architecture required" finding, carried through to this component's actual shape). No `DocumentLayout` — this is a listing-adjacent page composed directly from `Section`/`Stack`-based components, the same shape `app/work/library/page.tsx` and (as of Task 6.2) `app/engineering-log/page.tsx` already use, not the single-document skeleton `/work/[slug]`/`/knowledge/[slug]`/`/engineering-log/[slug]` need.

**Dependencies:** WI-2 through WI-8.

**Acceptance criteria:** exactly one `<h1>` on the page (from `AboutHeader`); real, non-generic `<title>`/meta description; no `DocumentLayout` import; zero props passed into any child component beyond what each already owns internally.

---

### WI-10 — Release Candidate Review

**Purpose:** the release gate, mirroring `docs/36`'s WI-7 and `docs/38`'s WI-9 exactly.

**When it runs:** only after WI-1 through WI-9 are complete.

**Verification steps:**

1. **Functional** — `/about` renders all seven sections with real content; every acceptance criterion from WI-1–WI-9 re-checked live together.
2. **No verbatim duplication, specifically** — `BEYOND_THE_CODE_COPY.introduction` (homepage-copy.ts) diffed directly against every string in `about-copy.ts`; zero exact-paragraph matches.
3. **No fabricated content** — every claim in `about-copy.ts` traced back to `docs/01-PERSONAL_BRAND.md` or another already-approved source; zero invented years/employers/metrics/certifications.
4. **Missing assets correctly absent** — no `<img>`/`next/image` anywhere under `components/about/`; Contact renders exactly three links, no fourth (resume) or fifth (scheduling) slot, empty or otherwise.
5. **No new client component** — every file under `components/about/` and `app/about/page.tsx` itself is a Server Component (no `"use client"` anywhere in this task's own files).
6. **No guardrail crossed** — `content/pages/` remains unregistered; no file under `src/` imports from `docs/`; `homepage-copy.ts`, `beyond-the-code.tsx`, `lib/content/collections.ts` all show zero diff.
7. **Automated checks:** `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build` — all clean.
8. **Git diff vs. this plan's file manifest (§7)** — exact match.
9. **Console errors** — none, both themes, desktop and mobile.
10. **Responsive** — no horizontal overflow; prose sections respect a comfortable reading width, matching every other prose section in this codebase (`max-w-reading`/`max-w-prose`, whichever `Journey`/`EngineeringPrinciples`/etc. settle on — consistent with `CurrentFocus`'s and `BeyondTheCode`'s own existing width choices, not a new value invented for this page).
11. **Accessibility** — heading hierarchy (one `<h1>`, six or seven `<h2>`s, no skipped level), Contact's three links have real accessible names, focus-visible on every interactive element, reduced motion respected (moot if no motion is introduced at all — the more restrained and equally correct outcome).
12. **Existing links resolve** — `PRIMARY_NAVIGATION`'s and `FOOTER_NAVIGATION`'s "About" links, and `BeyondTheCode`'s own CTA, all now resolve to 200 instead of 404.

**Release recommendation:** **Approved** or **Refinements Required**, the identical format `docs/36`/`docs/38` already established.

---

## 7. Component Reuse Matrix

| Existing Component | Purpose | Reuse? | Modification? |
|---|---|---|---|
| `Section` | Every section's vertical rhythm | Yes | None |
| `Stack` | Every section's internal spacing | Yes | None |
| `GithubIcon` / `LinkedinIcon` (`components/shared/icons.tsx`) | Contact's icon set | Yes | None |
| `lucide-react`'s `Mail` | Contact's email icon | Yes (already used by `FooterConnect`) | None |
| `lib/constants/site.ts` | `GITHUB_URL`/`LINKEDIN_URL`/`CONTACT_EMAIL`/`SITE_NAME` | Yes | None |
| `Card`/`CardHeader`/`CardContent` | — | **No** — no section in `docs/39` §8 calls for a card treatment; Tools is explicitly plain text (WI-6), Engineering Principles follows `EngineeringPhilosophy`'s borderless-grid idiom, not a card grid | — |
| `Button` | Possible use for Contact's links | Optional, implementation-level choice — plain `<a>` styled as a quiet link (matching `FooterConnect`'s own idiom) is equally valid and arguably more consistent with §16's "never a prominent CTA-styled contact link" ruling | None either way |
| `DocumentLayout` | — | **No** — About is a static composition page, not a single MDX document (§ WI-9's own reasoning) | — |
| `ArticleBody` / MDX pipeline | — | **No** — no MDX content exists or is proposed for this page | — |
| `TableOfContents` | — | **No** — seven short sections read top to bottom; no reading-navigation infrastructure needed, the same call the homepage itself already makes | — |
| `PreviousNext` | — | **No** — exactly one About page; adjacency is meaningless (`docs/39` §15) | — |
| Timeline/identity/profile components | — | **None exist in this codebase**, and none are proposed — `docs/01`'s own "Things We Never Do" list already rules out the visual language (progress bars, ratings) such a component would typically carry | — |

**New components, all genuinely necessary, none avoidable through reuse:** the seven listed in WI-2–WI-8 — each renders real, section-specific copy no existing component was built to hold.

---

## 8. File Manifest

| File | Change | Work Item |
|---|---|---|
| `src/lib/constants/about-copy.ts` | New | WI-1 |
| `src/components/about/about-header.tsx` | New | WI-2 |
| `src/components/about/journey.tsx` | New | WI-3 |
| `src/components/about/engineering-principles.tsx` | New | WI-4 |
| `src/components/about/current-interests.tsx` | New | WI-5 |
| `src/components/about/tools.tsx` | New | WI-6 |
| `src/components/about/learning-roadmap.tsx` | New | WI-7 |
| `src/components/about/contact.tsx` | New | WI-8 |
| `src/app/about/page.tsx` | New | WI-9 |

**Not touched by this plan, anywhere:** `src/app/page.tsx`, `components/home/beyond-the-code.tsx`, `lib/constants/homepage-copy.ts`, `lib/constants/site.ts` (read, not modified), `lib/navigation/config.ts`, `content/pages/`, `lib/content/collections.ts`, any file under `app/work/`, `app/knowledge/`, `app/engineering-log/`, `components/content/document-layout.tsx`, `components/navigation/footer.tsx`.

Nine new files. Zero modified files — the first Core Pages task in this milestone with no shared-component change (unlike Task 6.2's `DocumentLayout` extension).

---

## 9. Sequencing

```
WI-1 (about-copy.ts)
  │
  ├──▶ WI-2 (AboutHeader)
  ├──▶ WI-3 (Journey)
  ├──▶ WI-4 (EngineeringPrinciples)
  ├──▶ WI-5 (CurrentInterests)
  ├──▶ WI-6 (Tools)
  ├──▶ WI-7 (LearningRoadmap)
  └──▶ WI-8 (Contact)
         │
         ▼
      WI-9 (page.tsx, composes all seven)
         │
         ▼
      WI-10 (RC review)
```

WI-2 through WI-8 have no dependency on each other and can proceed in any order or in parallel — each depends only on WI-1. WI-9 depends on all seven. WI-10 is strictly last.

---

## 10. Responsive Behavior

**Desktop:** seven sections stacked vertically, each using the same `Section`/`Stack` rhythm every other page already uses — no multi-column layout proposed anywhere (Tools' items render as a single wrapped text line or a simple list, not a grid).

**Tablet:** identical stacking; no breakpoint-specific redesign needed for prose-and-list content this simple.

**Mobile:** identical stacking, full-width within the shared `PageContainer` gutter every route already inherits from `WorkspaceLayout`.

**Reading width:** every prose section (`Journey`, `CurrentInterests`, `LearningRoadmap`, Engineering Principles' intro) uses the same `max-w-prose`/`max-w-reading` token `BeyondTheCode`/`CurrentFocus` already use — not a new width value invented for this page.

**Links (Contact):** three links, stacked or inline depending on implementation choice, both of which already have working precedent in `FooterConnect`'s own (vertical list) and `Header`'s own (horizontal icon row) layouts — either is acceptable, an implementation-level choice, not fixed by this plan.

**No horizontal overflow risk:** no table, no wide code block, no diagram anywhere on this page — the same low-risk profile `docs/39` §17 already predicted, confirmed by this plan's own component list containing nothing that could introduce one.

---

## 11. Accessibility

- **Semantic landmarks:** no new landmark beyond what `WorkspaceLayout`'s `<main>` already provides — this page needs no internal `<nav>` (no TOC, no sub-navigation).
- **Heading hierarchy:** exactly one `<h1>` (`AboutHeader`), one `<h2>` per remaining section (six more) — no skipped levels, no second `<h1>`.
- **Keyboard navigation / focus states:** every interactive element (Contact's three links) uses the same `focus-visible:ring-2` treatment already standard across this codebase — no new focus pattern.
- **External links:** GitHub/LinkedIn open in a new tab (`target="_blank" rel="noopener noreferrer"`, matching `FooterConnect`'s own existing pattern) — their accessible name should make that clear where relevant (visible text already says "GitHub"/"LinkedIn," which is sufficient per this codebase's existing precedent; no `aria-label` suffix like "(opens in new tab)" is used elsewhere in this codebase and none is introduced here for consistency).
- **Accessible link names:** real, descriptive text for all three Contact links — never a bare icon with no accessible name.
- **Images:** none exist on this page (§ WI-2, WI-8's own "no image tag" acceptance criteria) — no alt-text requirement to satisfy because no image requirement exists.
- **Reduced motion:** no motion is introduced by this plan at all — the strictest, simplest way to satisfy this requirement.

---

## 12. Server / Client Boundary

**Every file this plan creates is a Server Component.** No user interaction on this page requires a browser API — no disclosure, no toggle, no form, no client-side state of any kind. This is the simplest server/client boundary of any Core Pages task so far: not "one small, justified client island" (Task 6.1's mobile navigation) but zero client boundaries whatsoever, because nothing about this page's actual content needs one.

---

## 13. Missing Assets Handling

Restated as an explicit implementation constraint, not just an editorial preference:

- **No portrait image element anywhere in `components/about/about-header.tsx`** — not commented out, not behind a conditional checking for an asset that doesn't exist, simply never written.
- **No resume/CV link, disabled or otherwise, anywhere in `components/about/contact.tsx`.**
- **No scheduling link, disabled or otherwise, anywhere in `components/about/contact.tsx`.**

If either asset is added to the repository in the future, adding its corresponding section is a small, additive change to `about-copy.ts` + the relevant component — not a redesign, and not something this plan pre-builds a placeholder for now.

---

## 14. Explicit Guardrails

- `content/pages/` — **zero changes.** Not registered in `lib/content/collections.ts`.
- No file under `src/` imports from `docs/` — `docs/01-PERSONAL_BRAND.md` is transcribed into `about-copy.ts` by a human, never read at runtime.
- `homepage-copy.ts`, `beyond-the-code.tsx`, `app/page.tsx` — **zero changes.**
- `lib/navigation/config.ts` — **zero changes** (its existing `/about` entry already resolves correctly once WI-9 ships).
- No `getAbout()`, no About resolver, no new file under `lib/content/`.
- No new client component.
- No portrait, resume, or scheduling-link placeholder of any kind.
- No contact form, mail API, or newsletter infrastructure.
- No `DocumentLayout`, `ArticleBody`, `TableOfContents`, or `PreviousNext` usage anywhere in this task's files.

---

## 15. Risk Register

| Risk | Likelihood | Mitigation |
|---|---|---|
| `about-copy.ts`'s prose ends up a light rewording of `BEYOND_THE_CODE_COPY`, technically distinct but not meaningfully deeper | Medium | WI-10 step 2 requires a direct diff, not a visual skim, and §5/WI-1's own acceptance criteria state the failure mode by name before implementation begins |
| A future editor adds a "Resume" link pointing nowhere once this page ships, to match `docs/03`'s full list | Low | §13's constraint is explicit enough to catch in review; no code scaffold exists to make this an easy accidental addition |
| Engineering Principles quietly duplicates `HowIThink`'s exact wording instead of expanding it | Low | WI-4's acceptance criteria require a direct comparison against `HowIThink`, not an assumption of difference |
| A component reaches for `Card` by default (the most common content-block primitive in this codebase) where §7 specifically calls for plain text (Tools) | Low | Component Reuse Matrix (§7) states the "No" explicitly per component, with the specific document authority behind each |

---

## 16. Verification Plan

Inherits `docs/39` §24 in full; formally executed and signed off by WI-10, the same relationship every prior implementation plan in this series has established between "what must be verified" and "where it's actually checked."

---

## 17. Rollback Plan

Every work item is an independently deletable new file — no existing file is modified anywhere in this plan, so rollback of any single work item (or the whole task) is deleting the files it added, with zero cross-file cleanup required. This is the simplest rollback profile of any Core Pages task so far.

---

## 18. Acceptance Criteria (Plan-Level)

- Every work item traces to a specific section of `docs/39` — none introduces a new architectural decision.
- The editorial-source rule (§4) precisely specifies how `docs/01` becomes runtime content without ever being imported by it.
- The Homepage/About separation (§5) is stated as a directly-verifiable rule (WI-10 step 2), not left to editorial trust alone.
- Missing-asset handling (§13) is stated as an implementation constraint on specific files, not just a principle.
- File manifest (§8) is exhaustive; guardrails (§14) leave no reasonable path to registering `content/pages/`, adding a resolver, or importing `docs/` at runtime.
- No production code, component, route, or content was modified to produce this document.

---

## 19. Final Report Requirements

WI-10's own deliverable — a closing report following the same format every prior implementation plan's own final work item established: work items completed, file manifest as actually diffed vs. this plan's prediction, all twelve WI-10 verification steps individually, guardrail confirmation, and a final **Approved**/**Refinements Required** recommendation.

---

## Summary

This plan converts `docs/39-ABOUT_EXPERIENCE.md`'s architecture into ten work items — nine new files, zero modified files, the simplest file footprint of any Core Pages task in this milestone. There is no resolver, no relationship logic, no client boundary, and no shared-component change to make, because About has no collection behind it and needs no browser interaction to render. The one real risk this plan names directly (§15's own top row) is editorial, not architectural: it would be easy to satisfy every structural requirement in this document while still writing content that's just `BeyondTheCode`'s four paragraphs restated at greater length, and WI-10 verifies against that specific failure by direct comparison, not by assuming distinct components imply distinct content.
