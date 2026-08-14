# 45 — Milestone 6 Remaining Work Reconciliation

## Status

Reconnaissance / Reconciliation — not a design proposal, not an implementation plan.

> No production implementation is authorized by this document. No documentation other than this file was modified to produce it.

---

## 1. The Roadmap, Read Completely — Not From Summary

`docs/12-Implementation Roadmap.md` read in full, start to finish, this turn — not relied on from any earlier session summary.

### Milestone 6 — Core Pages, exact text

```text
# Milestone 6 — Core Pages

## Objective
Build the primary user-facing pages.

## Deliverables
* Homepage
* Knowledge
* Work
* Engineering Log
* About
* Search
* 404
* RSS
* Sitemap

## Definition of Done
The portfolio is fully navigable.
```

### Milestone 7 — Discovery, exact text (for the Search boundary question, §5)

```text
# Milestone 7 — Discovery

## Objective
Help users discover knowledge.

## Deliverables
* Search
* Filtering
* Tags
* Technologies
* Series
* Reading Paths
* Related Content

## Definition of Done
Users can navigate naturally through connected knowledge.
```

### What `docs/12` does *not* contain — stated precisely, not inferred

- **No task numbering of any kind.** `docs/12` is a flat list of milestone-level bullet deliverables. It never writes "Task 6.1," "Task 6.4," or any equivalent. The "Task 6.1–6.5" numbering this session has used throughout is a project-management convention layered on top of `docs/12` by this work, not something `docs/12` itself defines. This document does not invent a "Task 6.6" or "Task 6.7" for RSS/Sitemap — per this task's own instruction, and because `docs/12` gives no numbering scheme to extend in the first place.
- **No dependency graph between deliverables within a milestone.** `docs/12`'s only stated dependency structure is the milestone-to-milestone "Implementation Order" diagram (Foundation → Application Shell → Content Engine → Knowledge Experience → Core Pages → Discovery → Polish → Launch) — it says nothing about whether, say, Search must precede RSS, or 404 must precede Sitemap.
- **No per-deliverable content specification.** Exactly as was already true for Search, 404, and About before their own design proposals existed, `docs/12` names "RSS" and "Sitemap" and nothing else about them — no format, no included content, no route path. `docs/10-Technical Architecture.md` and `docs/03-SITEMAP.md` are where that detail (where it exists at all) actually lives — see §6/§7.
- **No milestone-level release-review or release-gate requirement, for Milestone 6 or any other milestone.** Every milestone entry follows the identical three-part shape — Objective, Deliverables, Definition of Done — and none of the ten milestones in this document mentions a review step, a sign-off, or a gate distinct from its own "Definition of Done" line. This is addressed directly in §8.

---

## 2. Reconciliation Against the Actual Repository

Verified by direct inspection this turn — file existence, route trees, dependencies — not assumed from any document's claims.

| Item | Verified present? | Evidence |
|---|---|---|
| Homepage | Yes | `src/app/page.tsx` exists, wired to real resolvers (Task 6.1) |
| Knowledge | Yes | `src/app/knowledge/`, `src/app/knowledge/[slug]/` |
| Work | Yes | `src/app/work/`, `src/app/work/library/`, `src/app/work/[slug]/` |
| Engineering Log | Yes | `src/app/engineering-log/`, `src/app/engineering-log/[slug]/` |
| About | Yes | `src/app/about/page.tsx`, portrait integrated (Task 6.3a) |
| Search | Yes | `src/app/search/page.tsx`, `lib/content/search.ts` |
| 404 | Yes | `src/app/not-found.tsx` |
| RSS | **No** | No `rss.xml`/`feed.xml` file or route handler anywhere under `src/app/`. `RSS_PATH = "/rss.xml"` exists as a defined-but-unconsumed constant in `lib/constants/site.ts`. `Header`'s RSS icon is still `disabled`, `aria-label="RSS feed (coming soon)"` (`header.tsx`). `Footer`'s RSS row is still a plain, non-interactive `<span>` reading `"RSS (coming soon)"`, not an `<a>` (`footer.tsx`). No RSS/feed-generation dependency in `package.json`. |
| Sitemap | **No** | No `sitemap.ts`/`sitemap.xml` route handler anywhere under `src/app/`. No `robots.ts` either (see §7's note — related but not itself a named Milestone 6 deliverable). `next.config.ts` has no sitemap-related configuration. |
| Navigation | Yes | `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION` (`lib/navigation/config.ts`) both list exactly Knowledge/Work/Engineering Log/About; `Header`, `MobileNavigation`, `Sidebar`, `Footer` all implemented and wired |
| Metadata / SEO infrastructure | **Still empty, unchanged since Task 6.1's own finding** | `src/lib/metadata/`, `src/lib/seo/`, `src/lib/analytics/`, `src/lib/search/` each contain only `.gitkeep` — confirmed again this turn. Every route defines its own plain, inline `export const metadata`. No `SITE_URL` constant exists anywhere. `lib/search/` remaining empty is not a gap — Task 6.4 built `lib/content/search.ts` instead (a content-layer resolver, the architecturally correct location per `docs/42`), the same "reserved scaffold intentionally left unpopulated" outcome `components/feedback/` had after Task 6.5 (`docs/44` §3). |

---

## 3. Reconciliation Against Completed Task Documents

Every one of the ten Task 6.1–6.5 documents was checked directly (not summarized) for its own stated RSS/Sitemap/final-review position. All ten agree with each other and with the live repository — no contradiction found across the whole document set:

- **`docs/35-HOMEPAGE_INTEGRATION.md`**: *"Any other advanced SEO work — sitemap.xml, robots.txt, RSS feed generation are Milestone 6's own later deliverables per docs/12, not this task's."* Documents Header's disabled Search/RSS icons and Footer's disabled RSS row as already-existing, pre-Task-6.1 state.
- **`docs/37-ENGINEERING_LOG_EXPERIENCE.md`**: *"RSS implementation — docs/12's own Milestone 6 deliverable list names it separately from Engineering Log; a future Task 6.x, not this one."*
- **`docs/38-ENGINEERING_LOG_IMPLEMENTATION_PLAN.md`**: *"No RSS, no search, no facet/filter UI... — docs/37 §7's Non-Goals, unchanged."*
- **`docs/41-SEARCH_CORE_DISCOVERY.md`**: *"404, RSS, and Sitemap are Milestone 6 siblings of Search in docs/12's own list, but none of them are this task's subject."* Also the source of the RSS-icon reconnaissance (`"RSS (coming soon)"`) later inherited unmodified by Task 6.4's implementation.
- **`docs/42-SEARCH_CORE_DISCOVERY_IMPLEMENTATION_PLAN.md`**: *"Out of scope regardless of milestone: 404, RSS, Sitemap."* Confirms the Header diff for Task 6.4 touched only the Search button, explicitly leaving the RSS button untouched.
- **`docs/43-404_EXPERIENCE.md`** / **`docs/44-404_IMPLEMENTATION_PLAN.md`**: list 404 itself as the subject and RSS/Sitemap/`global-not-found.js`/`error.tsx` as explicitly out of scope; also record that `docs/03-SITEMAP.md` (the *information-architecture* document — see §7's terminology note) never mentions 404 at all.
- **`docs/39`/`docs/40` (About)**: no RSS/Sitemap claims either way — not that milestone's subject; consistent by omission.

**No document in this set ever claims RSS or Sitemap is complete, in progress, or assigned to a specific task number.** Every one of them independently arrives at the same position this document does.

---

## 4. Milestone 6 Deliverable Reconciliation Table

| Roadmap Item | Roadmap Requirement (`docs/12`) | Current Repository State | Completed? | Evidence | Next Action |
|---|---|---|---|---|---|
| Homepage | Listed, no further detail | Real, resolver-backed, approved (Task 6.1) | ✅ Yes | `src/app/page.tsx` | None |
| Knowledge | Listed, no further detail | Real routes, real content, approved (pre-Milestone 6, carried in) | ✅ Yes | `src/app/knowledge/`, `src/app/knowledge/[slug]/` | None |
| Work | Listed, no further detail | Real routes, real case studies, approved | ✅ Yes | `src/app/work/`, `src/app/work/[slug]/`, `content/work/*.mdx` | None |
| Engineering Log | Listed, no further detail | Real routes, resolvers, approved (Task 6.2) | ✅ Yes | `src/app/engineering-log/` | None |
| About | Listed, no further detail | Real, real portrait, approved (Task 6.3 + 6.3a) | ✅ Yes | `src/app/about/page.tsx`, `public/images/portrait.jpeg` | None |
| Search | Listed; **also** listed in Milestone 7 under a different scope | Minimal entry point real and approved (Task 6.4); scope boundary explicitly held (§5) | ✅ Yes, at Milestone 6's own scope | `src/app/search/page.tsx`, `docs/41`/`docs/42` D1–D3 | None for Milestone 6. Full Discovery-scale Search is Milestone 7's own, separate future work. |
| 404 | Listed, no further detail | Real, catches all three existing `notFound()` throws plus genuinely unmatched URLs, approved (Task 6.5) | ✅ Yes | `src/app/not-found.tsx` | None |
| RSS | Listed by name only; `docs/10` adds real detail (§6) | **Not implemented.** Disabled icon in Header/Footer only. | ❌ No | No route/handler exists; `RSS_PATH` unconsumed; confirmed by direct search | Design proposal, then implementation plan, then implementation (§12) |
| Sitemap | Listed by name only; `docs/10` adds minimal detail (§7) | **Not implemented.** | ❌ No | No `sitemap.ts`/`sitemap.xml`; confirmed by direct search | Design proposal, then implementation plan, then implementation (§12) |
| Final Milestone 6 Release Review | **Not required anywhere in `docs/12`** (§8) | N/A — no such requirement exists to satisfy | N/A | `docs/12` full-text read, §1 above | A recommendation, not a roadmap requirement — see §8's own framing |

---

## 5. Search — Confirming the Milestone 6/7 Boundary Held

`docs/12` names "Search" as a deliverable of both Milestone 6 (alongside Homepage/Knowledge/Work/Engineering Log/About/404/RSS/Sitemap, under "the portfolio is fully navigable") and Milestone 7 (alongside Filtering/Tags/Technologies/Series/Reading Paths/Related Content, under "users can navigate naturally through connected knowledge"). This is the identical ambiguity already found and resolved once, in `docs/41` §2–§4, before Task 6.4 was authorized — not a new finding this turn, but re-verified against the actual shipped implementation rather than only against the design intent:

- **What actually shipped** (`src/app/search/page.tsx`, `lib/content/search.ts`, confirmed by direct read): a server-rendered, GET-based `/search?q=` page; case-insensitive substring matching against `title`/`description` only, across exactly Knowledge/Work/Engineering Log; results grouped by collection, ordered by publish date; zero client component; zero new dependency; zero ranking algorithm; zero faceted filtering.
- **What Milestone 7 still names, and this implementation does not touch**: Filtering, Tags, Technologies, Series, Reading Paths, Related Content — none of these exist anywhere in `lib/content/search.ts` or `app/search/page.tsx`. `series`/`technologies` collections remain unregistered participants in Search (confirmed: neither collection is imported by `search.ts`).
- **Conclusion**: the implemented Task 6.4 stayed within Milestone 6's own "minimal entry point" scope, exactly as `docs/41`/`docs/42` designed it to. **This document does not recommend adding any further Search capability** — that recommendation belongs to a future Milestone 7 design proposal, not this reconciliation, per this task's own explicit instruction.

---

## 6. RSS

### From `docs/12` — the deliverable itself

Named once, in Milestone 6's flat bullet list (`* RSS`), no task number, no further detail in this file.

### From `docs/10-Technical Architecture.md` — the only real content specification found

```text
# RSS

Automatically generated.

Includes:
* Knowledge
* Engineering Logs
* Case Studies

RSS should remain a first-class feature.
```

And, from the same document's Routing section: `/rss.xml` is listed as a real, permanent route alongside `/about`, `/sitemap.xml`, etc.

**Reading this precisely:**
- **Not explicitly deferred anywhere** — no document says "RSS is intentionally postponed"; every reference (§3) says "not this task's subject," which is a scoping statement, not a deferral decision.
- **Content scope, as specified**: Knowledge, Engineering Logs, "Case Studies" (= the Work collection, using `docs/26`'s own established naming). **About is not named.** This mirrors Search's own participating-collection set almost exactly (`docs/41`/`docs/42`: Knowledge, Work, Engineering Log; `series`/`technologies` excluded; About excluded) — worth noting as a real, corroborating cross-reference for whatever design proposal eventually addresses RSS, not something this document decides on that proposal's behalf.
- **"Automatically generated"** implies build-time or request-time generation from the existing content collections (`getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()` already exist and are exactly the functions this would need to read from), not hand-maintained XML — consistent with this codebase's own established "resolve from real content, never a parallel hand-authored dataset" discipline (`docs/24` Principle 3), but this is an observation about available building blocks, not a design decision this reconciliation is making.
- **"RSS should remain a first-class feature"** is `docs/10`'s own qualitative bar — not further specified.

### Repository evidence (§2's table, restated for completeness)

No route/handler exists. No feed-generation dependency exists. `lib/constants/site.ts`'s `RSS_PATH = "/rss.xml"` constant is defined but has never been consumed by any `href`, anywhere — confirmed by an exact-match search across `src/` (§2). `Header`'s RSS button and `Footer`'s RSS row are both still in their original disabled "(coming soon)" state, unmodified since before Milestone 6 began.

**No implementation planning is included here, per this task's own instruction.**

---

## 7. Sitemap

### A terminology collision worth naming explicitly, per this task's own "preserve terminology" instruction

**`docs/03-SITEMAP.md` and Milestone 6's "Sitemap" deliverable are two different things sharing one word.** `docs/03-SITEMAP.md` is this repository's information-architecture document — page structure, navigation, section content (the document already cited dozens of times across Tasks 6.1–6.5 for what About/Contact/Engineering Log should contain). `docs/12`'s Milestone 6 "Sitemap" deliverable refers to the XML sitemap feature (`/sitemap.xml`) search engines consume. **`docs/03-SITEMAP.md` never once mentions the XML sitemap feature** — confirmed by direct search; every match for "sitemap" in that file is either its own title or the file being cited by other documents for IA content, never for the XML-feed sense of the word. Recorded here so a future task doesn't conflate "docs/03 already covers Sitemap" with "the Milestone 6 Sitemap deliverable is specified" — it isn't, by that document.

### From `docs/12` — the deliverable itself

Named once, in Milestone 6's flat bullet list (`* Sitemap`), no task number, no further detail in this file.

### From `docs/10-Technical Architecture.md` — the only real content specification found

```text
# Sitemap

Generated automatically during build.
```

Three words. That's the entirety of the specification. The Routing section separately confirms `/sitemap.xml` as a real, permanent route.

**Reading this precisely:**
- **"Generated automatically during build"** is consistent with (though doesn't explicitly name) Next.js's own built-in `app/sitemap.ts` metadata-file convention — this project's established pattern of using framework-native conventions over hand-rolled infrastructure (the same reasoning `docs/43`/`docs/44` applied when choosing a plain root `not-found.tsx` over reinventing 404 handling) would suggest that same convention here, but `docs/10` doesn't say so explicitly, and this document isn't the place that decision gets made.
- **No route inclusion list is specified anywhere** — unlike RSS's "Knowledge, Engineering Logs, Case Studies," no document names which routes a sitemap should enumerate. A future design proposal would need to derive this from the actual route tree (§2's table) rather than from any existing written specification, because none exists.
- **`docs/10`'s immediately adjacent "Robots" entry** (*"Configured automatically"*) is related infrastructure but **is not itself named as a Milestone 6 deliverable** in `docs/12`'s own list — only "Sitemap" is. Whether a `robots.ts` should be built alongside a sitemap (a natural pairing, since Next's own conventions handle both similarly) is a question for that future design proposal, not a scope this reconciliation is expanding to include.

### Repository evidence (§2's table, restated for completeness)

No `sitemap.ts` or equivalent route handler exists anywhere under `src/app/`. No `robots.ts` either. No sitemap-related configuration in `next.config.ts`.

**No implementation planning is included here, per this task's own instruction.**

---

## 8. Final Milestone Release Gate

**`docs/12` does not explicitly require a final Milestone 6 release review.** This was checked directly against the full text of the document (§1) — every one of the ten milestones follows the identical Objective → Deliverables → Definition of Done shape, and none of the ten includes a review, sign-off, or gate step distinct from its own Definition of Done line. This isn't a gap unique to Milestone 6; it's how the entire document is structured.

**What this repository actually has instead**: a *per-task* release-review discipline, established and applied consistently across every Task 6.1–6.5 implementation plan — `docs/36` WI-7, `docs/38` WI-9, `docs/40` WI-10, `docs/42` WI-10, `docs/44` WI-4 — each a Release Candidate Review verifying that specific task's own work (functional behavior, accessibility, regression, automated checks) before recommending Approved/Refinements Required. This is this session's own extension of `docs/24-ENGINEERING_PRINCIPLES.md` Principle 1's documentation-first workflow, not something `docs/12` asked for by name.

**Do individual task reviews already satisfy a milestone-level gate?** Partially, and only for what each one actually checked:
- Each task's own RC review verified that task's own regression surface (e.g., `docs/44`'s WI-4 step 12 checked `/`, `/knowledge`, `/work`, `/engineering-log`, `/search`, `/about`, and the 404 route itself together, since 404 could affect any of them).
- **No task's RC review was scoped to verify Milestone 6 as a whole** — none of them checked, for instance, whether every `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION` link across the entire site still resolves after all five tasks combined, or ran a single combined `pnpm build`/`eslint`/`tsc` pass against the fully-integrated state of every task's changes together in one pass.
- **RSS and Sitemap, being unbuilt, are outside what any individual review could have checked** — a milestone-level review happening now would still find the same two gaps this document already found.

**Conclusion**: individual task reviews do not substitute for a milestone-level gate — per this task's own instruction not to treat them as substitutes unless `docs/12` explicitly allows it, and `docs/12` says nothing on the matter either way. Whether this project wants to adopt a final-integrated-review step as a practice (the same way it adopted per-task RC reviews as a practice beyond what `docs/12` required) is a recommendation this document makes in §12, not a requirement it discovered.

---

## 9. Conflicts Found — Recorded, Not Silently Repaired

| # | Conflict | Authoritative Source | Resolution | Needs a future doc correction? |
|---|---|---|---|---|
| 1 | `docs/12` lists "Search" under both Milestone 6 and Milestone 7 with no disambiguating note | `docs/12` itself (unedited) | Already resolved once, by task authorization + `docs/41`/`docs/42`'s own D1–D3 (Milestone 6 = minimal entry point; Milestone 7 = full Discovery); re-confirmed against the shipped implementation in §5 above | Optional — `docs/12` could gain a parenthetical note distinguishing the two, but every downstream document already carries the correct resolution, so this is cosmetic, not urgent |
| 2 | `docs/03-SITEMAP.md`'s title ("Sitemap," meaning information architecture) collides in name with Milestone 6's "Sitemap" deliverable (meaning the XML feed) | Both documents, as written | No functional conflict — they describe genuinely different things and neither claims to be the other. Recorded in §7 so a future task doesn't mistake IA coverage for XML-sitemap coverage | Optional — a rename or clarifying subtitle would remove the ambiguity, but nothing today is factually wrong |
| 3 | `docs/43-404_EXPERIENCE.md` already found and recorded that `docs/03-SITEMAP.md` never names 404's required content, unlike every other Core Page | `docs/43` §3 (already recorded there, re-confirmed this turn) | Not re-litigated here — already an open item in `docs/43`'s own Q1, carried forward, not duplicated as a new finding | Already flagged; no new action from this document |
| 4 | `docs/02-Product Requirements Document.md` lists "RSS Feed" under its own "Phase 4," a different phasing scheme than `docs/12`'s milestones | `docs/02` and `docs/12`, both as written | No functional conflict for this document's purpose — `docs/12` is this project's own authoritative implementation roadmap (its title says so directly), and `docs/02`'s "Phase 4" has never been the sequencing this session's Task 6.x numbering follows. Recorded for completeness since the task asked this document not to rely on selective reading | Optional — the two phasing vocabularies (docs/02's "Phases," docs/12's "Milestones") were never reconciled with each other anywhere in this repository; out of scope for this document to resolve on its own |

None of these conflicts block understanding what remains in Milestone 6. All four are naming/cross-reference issues, not factual disagreements about what has or hasn't been built.

---

## 10. Milestone Status

### B — Core Pages are complete, but Milestone 6 still has remaining infrastructure deliverables

Precisely:

- **Complete, approved, verified against the live repository**: Homepage, Knowledge, Work, Engineering Log, About (+ portrait), Search (at its correct Milestone 6 scope), 404.
- **Remaining, per `docs/12`'s own Milestone 6 deliverable list, not yet started**: **RSS**, **Sitemap**.
- **Not a roadmap requirement, but worth a decision**: whether to run a final, integrated Milestone 6 release review once RSS and Sitemap are also complete (§8) — recommended, not mandated.

This is not classification **C** — no Core Page work is incomplete; every named Core Page deliverable is real, built, and already approved. It is not classification **A** — two named Milestone 6 deliverables (RSS, Sitemap) remain entirely unbuilt, confirmed by direct repository inspection, not by assumption.

---

## 11. Recommended Next Sequence

Based on the evidence above — a sequence, not an implementation plan:

```text
Current (this document)
        ↓
RSS design proposal
        ↓
RSS implementation plan
        ↓
RSS implementation
        ↓
Sitemap design proposal
        ↓
Sitemap implementation plan
        ↓
Sitemap implementation
        ↓
(Optional, recommended, not roadmap-mandated)
Final integrated Milestone 6 release review
        ↓
Milestone 6 — Core Pages: fully complete
        ↓
Milestone 7 — Discovery (a new, separate milestone;
not this document's subject)
```

**Why RSS before Sitemap, rather than the reverse or in parallel:** no ordering dependency was found between them (§1) — this is a sequencing preference, not a discovered requirement. RSS has real, specific content guidance to build from (`docs/10`'s three-collection list, §6); Sitemap has almost none (§7) and would benefit from RSS's own design proposal already having re-confirmed the exact route inventory this reconciliation compiled in §2/§4 — one less rediscovery step for whoever writes that second proposal. Either order is architecturally valid; this is the lower-friction one.

**This document authorizes no implementation, no design proposal content, and no further documentation changes.** The next step, if this reconciliation is approved, is a design proposal for RSS — following the same Documentation → Architecture Review → Implementation Plan → Implementation → Verification → Approval workflow every prior Task 6.x has already used, with its own new document number assigned at that time.
