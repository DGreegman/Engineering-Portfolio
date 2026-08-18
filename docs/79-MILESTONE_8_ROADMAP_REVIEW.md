# 79 — Milestone 8 Roadmap Review

## Status

Decision artifact — roadmap review and Task 8.1 identification only.

> No production code, content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or configuration file was created or modified to produce this document. No implementation plan was created.

Task 8.0 (pre-implementation review), opening Milestone 8. This document reads `docs/12-Implementation Roadmap.md` directly and reports what it actually says — not what the pattern of Milestone 7's own numbering might suggest it says.

---

## 1. Authoritative Milestone 8 Definition

Quoted exactly from `docs/12-Implementation Roadmap.md` (lines 238–256), no paraphrase:

```text
# Milestone 8 — SEO & Performance

## Objective

Optimize the platform.

## Deliverables

* Metadata
* Structured Data
* Open Graph
* Canonical URLs
* Image Optimization
* Lazy Loading
* Lighthouse optimization

## Definition of Done

Performance and discoverability meet project targets.
```

### 1. Exact title

**Milestone 8 — SEO & Performance.**

### 2. Objective

**Optimize the platform.** (Verbatim — the document states nothing more specific than this one sentence.)

### 3. Every named deliverable

Seven, listed in `docs/12`'s own order, as an unordered bullet list (no numbering in the source):

1. Metadata
2. Structured Data
3. Open Graph
4. Canonical URLs
5. Image Optimization
6. Lazy Loading
7. Lighthouse optimization

### 6. Explicit completion criteria

**Definition of Done**: *"Performance and discoverability meet project targets."* Verbatim. No specific numeric target (e.g., a Lighthouse score threshold, a Core Web Vitals budget) is stated anywhere in `docs/12` — this phrase is the entire completion criterion as written, and it is itself imprecise (§8, ambiguity 5).

---

## 2. Task Inventory

### 4. Every named task under Milestone 8, in order

**None exist in `docs/12`.** Confirmed by a full read of the document, not a partial scan: `docs/12` contains ten `# Milestone N — ...` sections, each with exactly three subsections — `## Objective`, `## Deliverables`, `## Definition of Done` — and nothing below the deliverable-bullet-list granularity anywhere in the file. No milestone in the entire document — not Milestone 7, not Milestone 8, not any other — names an individual numbered task (no "Task 8.1", no "Task N.1" of any kind appears in `docs/12`, confirmed by direct grep). **This document does not invent one.**

The "Task 7.1" … "Task 7.27" numbering used throughout this repository's own `docs/` history is a project-execution convention applied *by the documents that performed that work* (`docs/50` onward), not a numbering scheme `docs/12` itself defines or authorizes in advance. `docs/50` §1 states this relationship directly: it treats `docs/12`'s Milestone 7 section as the *source* of the deliverable list, then applies its own task numbering as work began — the same role this document performs for Milestone 8, below (§6).

**What this document reports instead**: the seven deliverables above, in `docs/12`'s own listed order — the only ordering signal the roadmap itself provides (§3).

---

## 3. Dependency/Order Analysis

### 5. Dependencies between those tasks

**`docs/12` states no explicit dependency graph for Milestone 8** — no deliverable's own bullet references another, no "after X" language appears anywhere in the section. The only ordering signal in the source text is the bullet list's own sequence (Metadata → Structured Data → Open Graph → Canonical URLs → Image Optimization → Lazy Loading → Lighthouse optimization), and `docs/12` never states whether that sequence is prescriptive or incidental.

**This document's own reasoned dependency analysis, clearly distinguished from the above as inference, not roadmap fact**:

| Deliverable | Reasoned dependency | Basis |
|---|---|---|
| Metadata | None — foundational | Next.js's `Metadata` API (`generateMetadata`/`export const metadata`) is the single mechanism every route's title/description already uses (§4); Structured Data, Open Graph, and Canonical URLs are all additional *fields* on that same object type, not separate mechanisms |
| Structured Data | Metadata | JSON-LD payloads typically restate the same title/description/URL facts Metadata already establishes per document type |
| Open Graph | Metadata | `openGraph` is itself a field on the same `Metadata` object; needs an absolute base URL (`metadataBase`) to resolve image paths correctly — a Metadata-layer concern (§4) |
| Canonical URLs | Metadata | `alternates.canonical` is likewise a field on the same `Metadata` object |
| Image Optimization | None — independent axis | Concerns `next/image`/rendering, not the `<head>` metadata surface; can proceed in parallel with the Metadata cluster |
| Lazy Loading | Image Optimization (partial overlap) | Overlaps where lazy-loading applies to images specifically (`loading="lazy"`, already partially present, §4), but also applies to non-image content (below-fold sections, deferred hydration) independent of images |
| Lighthouse optimization | All six others | A measurement/validation pass over the *outcome* of the other six — sequencing it first would mean auditing a platform that hasn't yet made the changes being audited |

**No dependency here is stated as roadmap fact** — each is this document's own engineering reasoning, offered because `docs/12` provides none, not attributed to the roadmap itself.

---

## 4. Current Repository State Relevant to Milestone 8

Directly inspected this turn — every finding below traces to a specific file or grep result, not assumed from `docs/12`'s own description (which says nothing about implementation state; it is a planning document, not a status report).

### Metadata

- **Every one of the 11 route/layout files under `src/app/` already exports its own metadata** (either `generateMetadata()` for dynamic routes — `knowledge/[slug]`, `work/[slug]`, `engineering-log/[slug]` — or a static `export const metadata` for the rest), confirmed by direct grep across every `page.tsx`/`layout.tsx`.
- Every one of those exports sets **only `title` and `description`** — confirmed by reading all three `generateMetadata()` implementations and a representative sample of the static exports in full.
- The root layout (`src/app/layout.tsx`) sets a generic, Milestone-1-era `title`/`description` ("Engineering Portfolio" / "Engineering Portfolio project foundation.") plus one `alternates.types` entry for RSS auto-discovery (Task 6.6) — no `metadataBase`, no title template, no `openGraph`, no `robots` default.
- `/search` is the **one route that already sets `robots: { index: false, follow: true }`**, with its own docstring explicitly citing `docs/41` §18 and naming Open Graph/canonical/structured-data as deliberately out of scope at the time it was built — direct evidence this work was anticipated and intentionally deferred, not overlooked.
- `SITE_URL` (`src/lib/constants/site.ts`) already exists — a documented, server-only absolute-origin constant, already consumed by RSS and Sitemap, explicitly noted as the value future absolute-URL consumers should import rather than re-declare. **No `metadataBase` in `layout.tsx` currently reuses it.**

### Structured Data

**Zero implementation.** Grepped for `application/ld+json`, `schema.org`, `JsonLd`, `StructuredData` across `src/` — no matches anywhere.

### Open Graph

**Zero implementation.** Grepped for `openGraph`, `og:image`, `twitter:card` — no matches anywhere. **One piece of anticipatory scaffolding exists**: `public/og/` is a real, already-created directory (`.gitkeep` only) — evidence this was planned for, never populated.

### Canonical URLs

**Zero implementation.** No route sets `alternates.canonical`. Every "canonical" grep hit across `src/` traces to unrelated prose (e.g., "canonical order," "canonical URL structure" used generically in docstrings) or `/search`'s own comment explicitly stating canonical is not set there — none is a real implementation.

### Image Optimization

**Partial.** `next/image` is used exactly once (`components/about/about-header.tsx`, the portrait), with its own docstring explaining why it's a good fit there (fixed, known dimensions). MDX body images use a deliberate, already-documented raw `<img>` instead: `mdx-components.tsx`'s `Img()` override states directly, *"A plain, lazy-loaded `<img>` is the correct trade-off for this task's literal ask... full `next/image` optimization is a future enhancement, not a regression introduced here."* — a precise, pre-existing acknowledgment that this is exactly the kind of work Milestone 8 exists for. `next.config.ts` carries no image-domain or optimization configuration (`{ /* config options here */ }`, empty). `public/icons/` also exists pre-created and empty.

### Lazy Loading

**Partial.** MDX body images already set `loading="lazy"` (the same `Img()` override above). No broader lazy-loading pattern (deferred hydration, `next/dynamic` for below-fold components) was found in this scope-appropriate check — a fuller audit is Task 8.1-adjacent work, not this document's own job (§7).

### Lighthouse optimization

**Zero tooling.** No `lighthouse` dependency in `package.json`; `.github/workflows/ci.yml` (read in full) runs exactly four steps — typecheck, lint, format check, build — no performance budget, no Lighthouse CI step, unchanged since Milestone 1's own "GitHub Actions (lint + typecheck + build)" deliverable.

---

## 5. Roadmap-vs-Repository Discrepancies

Per this task's own instruction to report drift rather than silently resolve it:

1. **`docs/12` names no task-level breakdown for Milestone 8 (or any milestone)** — the repository's own `docs/` history (Milestone 7's "Task 7.1"–"Task 7.27") is a numbering convention applied during execution, not a pre-existing plan `docs/12` defines. Not a contradiction, but a real structural gap between what the roadmap specifies and what this task asks this document to report (§2).
2. **The roadmap predates the current implementation and is silent on it** — `docs/12` was written before any Milestone-8-relevant code existed; it describes *what* to build, not what already exists. Every partial/anticipatory finding in §4 (the `/search` robots exclusion, `public/og/`, `public/icons/`, the MDX `Img()` deferral comment, `SITE_URL`) is real, current repository state that `docs/12` itself has no way to reference, since it was written first. This is expected drift, not an error in either document.
3. **No numeric Definition-of-Done target exists** — "Performance and discoverability meet project targets" names no specific Lighthouse score, Core Web Vitals threshold, or other measurable bar anywhere in `docs/12` or (checked this turn) any other document this task authorized reading. A future implementation plan for the Lighthouse-optimization deliverable specifically will need this decided or explicitly deferred as its own open question — not invented here.
4. **No content, schema, or route file was found to be missing or broken relative to `docs/12`'s Milestone 7 requirements** — Milestone 7's own closure (`docs/78`) is unaffected by anything found in this review; this section reports Milestone-8-relevant drift only.

No other discrepancy was found.

---

## 6. Task 8.1 Identification

### 9. Which task should be treated as Task 8.1

**Metadata.**

This is a designation this document is making, in the same role `docs/50` played for Milestone 7 (§2) — not a label `docs/12` itself assigns. Restated precisely so it is never mistaken for a roadmap quotation: `docs/12` names "Metadata" as one of seven unordered deliverables; this document is the one that proposes sequencing it first and calling that unit of work **Task 8.1**.

### 7. Why Task 8.1 should come first

1. **It is first in `docs/12`'s own listed order** — the only textual sequencing signal the roadmap provides (§3), not overridden by anything else in the document.
2. **Three of the next four deliverables are architecturally downstream of it** — Structured Data, Open Graph, and Canonical URLs are all fields on the exact same Next.js `Metadata` object Metadata work would establish and audit; building any of them well requires a complete, consistent per-route metadata contract (and a real `metadataBase`) to exist first (§3, §4).
3. **The current repository state directly supports starting here, not somewhere else** — every route already exports *some* metadata (title/description), but inconsistently and without `metadataBase`, a title template, or a deliberate `robots` policy anywhere but `/search` (§4). This is exactly the shape of a well-scoped first task: real groundwork exists, the gap is completion and consistency, not invention from nothing.
4. **It is the lowest-risk, most foundational starting point** — no new dependency, no new route, no schema change, no UI change; an audit-and-complete pass over an API surface (`Metadata`) every route already partially uses.

---

## 7. Repository Applicability Check

Per this task's own explicit instruction, checked directly (§4) rather than assumed: **is treating "Metadata" as Task 8.1 still applicable to the current implementation, or has the repository moved past it?**

**Still fully applicable, and, if anything, more clearly the correct starting point than a purely roadmap-only read would suggest.** Nothing in the current repository has already completed Metadata work in a way that would make this choice redundant — coverage is real but partial (title/description only, no `metadataBase`, no title template, `robots` set on exactly one route). Nothing in the repository contradicts this sequencing either — no Structured Data, Open Graph, or Canonical URL code exists anywhere to retroactively justify starting elsewhere. The one piece of evidence that could be read as "someone already started SEO work" — `/search`'s own `robots` exclusion and its explicit docstring naming OG/canonical/structured-data as deliberately deferred — is itself corroborating evidence for this document's own sequencing, not a contradiction of it: it shows this exact boundary (Metadata-adjacent work belongs to a later, dedicated task) was already anticipated by an earlier one.

### 8. What is explicitly NOT part of Task 8.1

- **Structured Data** (JSON-LD/schema.org) — a separate `docs/12` deliverable, sequenced after Metadata (§3), not bundled in.
- **Open Graph** — technically a field on the same `Metadata` object type, but treated here as its own separate deliverable/task, exactly as `docs/12` lists it — **not silently folded into Task 8.1's own scope** merely because the two share a TypeScript type. This exact boundary is named as an open scoping question for Task 8.1's own future implementation plan to resolve explicitly (§8, ambiguity 3), not resolved here.
- **Canonical URLs** — same reasoning as Open Graph: a separate listed deliverable, a field on the same object type, not bundled in.
- **Image Optimization / Lazy Loading** — a different architectural axis (`next/image`/rendering, not `<head>` metadata) with real, already-documented partial work of its own (§4) — independent of the Metadata cluster, not sequenced as part of it.
- **Lighthouse optimization** — a validation pass over the outcome of every other deliverable; cannot meaningfully begin until the others exist.
- **Any specific numeric performance/Lighthouse target** — undefined anywhere in the roadmap (§5, discrepancy 3); not invented by this document.
- **Any implementation** — this document identifies Task 8.1, it does not design, plan, or build it.

---

## 8. Ambiguities and Contradictions in the Roadmap

Restated together, consolidating §1–§5's individual findings:

1. **No task-level breakdown exists for any milestone in `docs/12`**, Milestone 8 included — every "Task N.M" reference in this repository's own history is an execution-time convention, not a roadmap-defined structure (§2).
2. **The seven-deliverable bullet list carries no stated ordering semantics** — this document treats the listed order as the strongest available signal (§3), but `docs/12` itself never confirms that reading.
3. **Metadata, Open Graph, and Canonical URLs are listed as three separate deliverables despite being three fields of one underlying Next.js API surface** — `docs/12` does not clarify whether this is intentional (three separate efforts, sequenced) or incidental (one mechanism, described in three parts). This document does not resolve the ambiguity; it names Task 8.1 as "Metadata" narrowly and leaves Open Graph/Canonical URLs as their own, separately-scoped future tasks (§7).
4. **The document's own high-level "Implementation Order" diagram** (`Foundation → Application Shell → Content Engine → Knowledge Experience → Core Pages → Discovery → Polish → Launch`) **names eight stages, not ten**, and "Polish"/"Launch" don't map one-to-one onto the ten explicitly-numbered milestones — "Polish" most plausibly spans Milestones 8 and 9 together (SEO & Performance, Accessibility), "Launch" maps to Milestone 10. Not a contradiction requiring resolution here, but a real terminology looseness worth naming so it isn't mistaken for a tighter specification than the document provides.
5. **No numeric Definition-of-Done target exists for Milestone 8** — "meet project targets" names no target (§1, §5).

### Anything explicitly deferred beyond Milestone 8

**None found.** No bullet in Milestone 8's own section states that any of its seven deliverables is deferred to Milestone 9 or 10 — both of those milestones have their own distinct, separately-listed deliverables (Accessibility: keyboard navigation, focus management, color contrast, semantic HTML, screen reader validation, reduced motion support; Production Launch: final testing, link validation, content validation, CI verification, production deployment, analytics, monitoring), none of which overlaps with Milestone 8's own list. Nothing in Milestone 8 is stated to spill over.

---

## 9. Next-Step Boundary

**This document identifies Task 8.1 as "Metadata." It does not design, scope, or authorize its implementation.** The next task, if this recommendation is accepted, is a design-stage proposal for Task 8.1 specifically — mirroring the two-stage (`docs/50`-then-`docs/5X`-implementation-plan) precedent this repository has followed for every prior milestone's own first task — auditing the exact current metadata state per route (already partially done in §4, but not yet at implementation-plan precision), deciding the `metadataBase`/title-template/`robots`-default questions this document surfaces but does not answer, and explicitly drawing the Metadata/Open-Graph/Canonical-URL boundary named as ambiguity 3 (§8). **No such design document is created by this task.**

---

## Guardrails

No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, navigation, or configuration file was created or modified to produce this document. No implementation plan was created. No task number was invented as if quoted from `docs/12` — every "Task 8.1" reference above is explicitly attributed to this document's own designation, not to the roadmap. The only file created by this task is `docs/79-MILESTONE_8_ROADMAP_REVIEW.md` itself.

---

## Verification

```
git status --short
```

Confirmed: prior to this task, the working tree was clean (`nothing to commit, working tree clean` — Milestone 7's own work, through `docs/78`, is already committed as of `7700f1e`). After this task, `git status --short` shows exactly one new, untracked file:

```
?? docs/79-MILESTONE_8_ROADMAP_REVIEW.md
```

No content, schema, resolver, route, component, or configuration file appears in the diff.

---

## Final Report

1. **Exact Milestone 8 title**: Milestone 8 — SEO & Performance (§1).
2. **Objective**: "Optimize the platform." (§1).
3. **Every named deliverable**: Metadata, Structured Data, Open Graph, Canonical URLs, Image Optimization, Lazy Loading, Lighthouse optimization — seven, unordered in the source but listed in this exact sequence (§1).
4. **Every named task under Milestone 8, in order**: none exist in `docs/12` — no milestone in the document names individual tasks; this is reported as a structural fact, not silently filled in (§2).
5. **Dependencies between those tasks**: none stated by `docs/12`; this document's own reasoned analysis places Metadata first as the shared foundation for Structured Data/Open Graph/Canonical URLs, Image Optimization/Lazy Loading as an independent axis, and Lighthouse optimization last as a validation pass (§3).
6. **Explicit completion criteria**: "Performance and discoverability meet project targets" — verbatim, with no numeric target stated anywhere (§1, §5).
7. **Anything explicitly deferred beyond Milestone 8**: none found — no Milestone 8 deliverable is stated to spill into Milestone 9 or 10 (§8).
8. **Ambiguity/contradiction**: five found, none blocking — no task-level breakdown; no stated deliverable ordering; Metadata/Open-Graph/Canonical-URL scope boundary undefined; the roadmap's own 8-stage summary diagram doesn't map 1:1 to its 10 milestones; no numeric performance target (§8).
9. **Task 8.1 identification**: Metadata — this document's own designation, not a roadmap quotation (§6).
10. **Why Task 8.1 comes first**: first in the roadmap's own listed order, architecturally foundational to three of the next four deliverables, matches the repository's own real-but-partial current coverage, lowest-risk starting point (§6).
11. **Repository applicability check**: confirmed still fully applicable — current partial coverage (§4) supports, not contradicts, starting here.
12. **What is explicitly NOT part of Task 8.1**: Structured Data, Open Graph, Canonical URLs, Image Optimization, Lazy Loading, Lighthouse optimization, any numeric performance target, and any implementation (§7).
13. **Next-step boundary**: a design-stage proposal for Task 8.1 (Metadata) specifically — not created by this document (§9).
14. **Exact file created**: `docs/79-MILESTONE_8_ROADMAP_REVIEW.md` — the only file created or modified by this task.
15. **Git verification**: confirmed via `git status --short` — one new untracked file, zero production change.

**APPROVED — Milestone 8 roadmap review is complete and Task 8.1 is identified.**
