# 52 — Real Content Migration: Implementation Plan

## Status

Implementation Plan — translating `docs/51-MILESTONE_7_DISCOVERY_DECISIONS.md`'s Decision 5 (Task 7.1 = Placeholder → Real Content Migration) into a precise, file-by-file specification.

> This document authorizes no implementation. It is documentation only. No production source file, route, component, schema, or content was modified to produce it.

---

## 1. Purpose

`docs/51` Decision 5 resolved Task 7.1 as: *"`/knowledge`, `/knowledge/[topic]`, `/work`, and `/work/library` must stop depending on `PLACEHOLDER_*` fixtures and use the same authoritative real content sources already trusted by Homepage, Search, RSS, Sitemap, and canonical detail pages."* This document converts that decision into work items, file by file — the same role `docs/42`/`docs/49` played for Search and Sitemap. That decision is not reopened here; this plan implements it, resolver extensions live in the content layer (`lib/content/`) rather than in route files or component files, and `work.ts` is left exactly as shipped unless direct evidence proves otherwise (§8).

---

## 2. Authoritative Inputs

`docs/51-MILESTONE_7_DISCOVERY_DECISIONS.md` — architecture authority, unchanged: the Real Data Principle, Decision 1 (Series stays fixture-backed — out of scope), Decision 5's file-by-file evidence table. Supporting: `docs/50-MILESTONE_7_DISCOVERY.md`, `docs/12-Implementation Roadmap.md`, `docs/03-SITEMAP.md`, `docs/24-ENGINEERING_PRINCIPLES.md` (the file at that number — the same filename resolution `docs/50`/`docs/51` already recorded).

---

## 3. Current-State Map — Re-Inspected This Turn

Traced by direct import/data-flow inspection of `src/app/knowledge/`, `src/app/work/`, `src/components/knowledge/`, `src/components/work/`, `src/components/home/`, `src/lib/content/`, `src/lib/constants/`, `content/`, `src/lib/navigation/`.

| Surface | Section | Fixture import | Component |
|---|---|---|---|
| `/knowledge` | Start Here | `PLACEHOLDER_START_HERE` | `StartHere` |
| `/knowledge` | Browse by Topic | `PLACEHOLDER_TOPICS` | `BrowseByTopic` |
| `/knowledge` | Learning Series | `PLACEHOLDER_SERIES` | `LearningSeries` — **out of scope, `docs/51` Decision 1** |
| `/knowledge` | Recently Published | `PLACEHOLDER_RECENTLY_PUBLISHED` | `RecentlyPublished` |
| `/knowledge/[topic]` | Topic Hero | `PLACEHOLDER_TOPICS` (`findTopic()`) | `TopicHero` |
| `/knowledge/[topic]` | Start Here | `PLACEHOLDER_TOPIC_ARTICLES[slug]` | `StartHere` |
| `/knowledge/[topic]` | Learning Series | `PLACEHOLDER_SERIES` | `LearningSeries` — **out of scope** |
| `/knowledge/[topic]` | Article List | `PLACEHOLDER_TOPIC_ARTICLES[slug]` | `TopicArticleList` |
| `/knowledge/[topic]` | Related Topics | `PLACEHOLDER_TOPICS` | `RelatedTopics` |
| `/work` | Featured Case Studies | `getFeaturedCaseStudies()` (`work.ts` → `PLACEHOLDER_WORK`) | `FeaturedCaseStudies` |
| `/work` | Architecture Highlights | `getEngineeringThemes()` (`work.ts` → `PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS`) | `ArchitectureHighlights` |
| `/work` | Project Library | `getProjectLibrary()` (`work.ts` → `PLACEHOLDER_WORK`) | `ProjectLibrary` |
| `/work` | Engineering Lessons | `getEngineeringLessons()` (`work.ts` → `PLACEHOLDER_ENGINEERING_LESSONS`) | `EngineeringLessons` |
| `/work/library` | Library Header, Browse Lenses, Case Study Listing | `getCaseStudyLibrary()` (`work.ts` → `PLACEHOLDER_WORK` + `PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS`) | `LibraryHeader`, `BrowseLenses`, `CaseStudyListing` |

**Finding, confirmed by exhaustive grep this turn, not assumed**: `src/app/page.tsx` (Homepage, line 11) imports `getFeaturedCaseStudies` from `@/lib/content/work` directly, and `src/components/home/engineering-case-studies.tsx` types its own prop against `CaseStudyEntry` (`placeholder-work.ts`). **Homepage's Case Studies section is fixture-backed**, sharing `work.ts` with the two Work surfaces this plan touches — confirmed by grep as the *only* other consumer of `work.ts`'s `getFeaturedCaseStudies()`. This is the reason `work.ts` cannot be modified by this plan (§8) even though two of its four content-bearing exports (`getEngineeringThemes()`, `getEngineeringLessons()`) become orphaned once `/work` migrates (§10).

---

## 4. Target Surfaces — Confirmed, Not Expanded

1. `/knowledge` (`src/app/knowledge/page.tsx`)
2. `/knowledge/[topic]` — Step 1 (topic branch) of `src/app/knowledge/[slug]/page.tsx` only; Step 2 (article branch) is already real and untouched
3. `/work` (`src/app/work/page.tsx`)
4. `/work/library` (`src/app/work/library/page.tsx`)

**Protected — confirmed unchanged unless a direct dependency proves otherwise (none found)**: Homepage (`src/app/page.tsx`), Search, RSS, Sitemap, `/knowledge/[slug]` article branch, `/work/[slug]`, Engineering Log, About, 404, `lib/navigation/config.ts`, `MobileNavigation`, `case-studies.ts`'s and `articles.ts`'s *existing* exports (both files gain new exports, §21, but nothing already shipped in either changes behavior), `engineering-logs.ts` (confirmed by grep this turn: its only consumer is `/work/[slug]`, entirely outside this plan's four surfaces — zero diff). Learning Series stays fixture-backed on both Knowledge surfaces, per `docs/51` Decision 1.

---

## 5. WI-1 — Knowledge Landing (`/knowledge`)

**Real resolvers**: `getAllArticles()`, `getFeaturedArticles()` (`articles.ts`, both real, draft-filtered, already anticipate this migration — `getFeaturedArticles()`'s own docstring: *"a future caller (e.g. `/knowledge`'s own eventual migration off placeholder data) can pass an already-fetched list."*).

- **Start Here → `getFeaturedArticles({ limit: 3 })`.** Reuses the same `featured`-flag signal Homepage's `EngineeringNotebook` already reuses for an analogous purpose. Honest caveat, stated not hidden: `StartHere`'s own docstring frames its purpose as reducing first-time-visitor decision fatigue specifically, slightly narrower than `featured`'s general "editorially representative" framing — no dedicated flag exists for the narrower concept, and inventing one is a schema change outside this plan's authority. `featured` is the smallest, already-real signal available.
- **Browse by Topic → topic *validity* from `TOPIC_SLUGS`, display metadata from `PLACEHOLDER_TOPICS`, retained** — see §9's classification.
- **Recently Published → `sortByPublishedDate(getAllArticles())`** — the same function RSS/Sitemap/Search already use.
- **Learning Series → untouched**, per `docs/51` Decision 1.

**Mapping required**: a new `toKnowledgeArticleCard(item: ContentItem<KnowledgeFrontmatter>, topicLabel: string): KnowledgeArticleCard` in `articles.ts` (content layer, per this task's "resolver extensions belong in the content layer" instruction). Deliberately takes `topicLabel` as a plain string parameter rather than resolving it internally — see §14 for why the lookup itself cannot live in this function.

---

## 6. WI-2 — Knowledge Topic Page (`/knowledge/[topic]`)

**Topic taxonomy correction** — the one architectural fix this WI makes: topic *validity* currently checks `PLACEHOLDER_TOPICS` array membership (`findTopic()`'s current implementation), which happens to equal `TOPIC_SLUGS` today but checks the wrong source. **This plan re-sources validity to `TOPIC_SLUGS` (`lib/content/topics.ts`) directly** — the real source `knowledgeFrontmatterSchema`'s own `topicSchema` already validates against. Display metadata (title/description/`heroIntroduction`/`relatedTopics`) still comes from `PLACEHOLDER_TOPICS` — retained, not eliminated (§9).

- **Article filtering → `getAllArticles().filter(a => a.frontmatter.topic === slug)`** — the same filter `resolveSameTopicFallback()` (`relationships.ts`) already performs for a different purpose, reused as a pattern.
- **Start Here (per-topic) → `getFeaturedArticles({ articles: topicArticles, limit: 3 })`** — same resolver as WI-1, called with the topic-filtered list.
- **Article List → topic articles minus the Start Here selections, `sortByPublishedDate()`-ordered** — matching `TopicArticleList`'s own stated purpose, *"the remaining shelf, beyond the three Start Here picks."*
- **Related Topics → unchanged** — `relatedTopics` is real, hand-curated editorial data with no content-model equivalent; not a placeholder-content gap (§9).
- **`articleCount` → real, computed (`topicArticles.length`) for all 8 topics**, replacing the static aspirational number currently shown only for the 3 topics `PLACEHOLDER_TOPIC_ARTICLES` happens to populate. `seriesCount` is unchanged (still derived from the still-fixture-backed `PLACEHOLDER_SERIES` filter).

---

## 7. WI-3 — Work Landing, Real Case Study Data (`/work`)

**Scope**: Featured Case Studies and Project Library only. Architecture Highlights and Engineering Lessons are resolved separately in WI-5 (§8) — kept as its own work item rather than folded in here, because it is a distinct architectural decision (reframe vs. remove), not a resolver swap, and this task's own instruction to treat it as "a critical issue" warrants its own review checkpoint.

**Authoritative resolver: `case-studies.ts`'s `getAllCaseStudies()`. Never `work.ts`, never `PLACEHOLDER_WORK`.**

- **Featured Case Studies → new `getFeaturedCaseStudies()` added to `case-studies.ts`**, mirroring `articles.ts`'s `getFeaturedArticles()` exactly (options object, `caseStudies`/`limit` defaults, featured-first-then-newest-fallback). **Why the fallback is required, not optional**: confirmed by direct grep of all 4 real case studies' frontmatter, **zero set `featured: true`** — the field is inherited from `articleFrontmatterSchema` but unused today. A strict filter with no fallback would render an honest-but-empty section on day one; `getFeaturedArticles()`'s already-approved fallback avoids exactly this for Knowledge, and this plan reuses that pattern rather than inventing a divergent one for Work.
- **Project Library → `getAllCaseStudies()` directly**, unfiltered, in the collection's own resolved order.
- **Mapping required**: a new `toCaseStudyEntry(item: ContentItem<WorkFrontmatter>): CaseStudyEntry` in `case-studies.ts` — `summary` ← `description`, `domain`/`status` ← real, identical shape, no transform, `publishedAt` ← `formatDate()`, `href` ← `/work/${slug}`, `featured` ← real `frontmatter.featured`.

**Naming collision, named explicitly, resolved without touching `work.ts`**: this plan reuses the name `getFeaturedCaseStudies()` in `case-studies.ts` even though `work.ts` already exports an identically-named function reading placeholder data — the same "reach for the wrong file out of habit" risk `docs/42` §3 already found real once for Search. **Mitigation is confined entirely to the new file's own docstring** — the exact precedent `search.ts` already set for this identical problem (`search.ts`'s docstring documents the `work.ts`-vs-`case-studies.ts` correction; `work.ts` itself was never touched to add a cross-reference). `case-studies.ts`'s new `getFeaturedCaseStudies()` docstring must state plainly: *"This is the real, MDX-backed version. `lib/content/work.ts` also exports a function with this exact name, reading `PLACEHOLDER_WORK` — that version is intentionally left unmodified; it is still Homepage's only source for its own Case Studies section (`src/app/page.tsx`). Do not import from `work.ts` for any Knowledge-adjacent Discovery surface."* **`work.ts` itself gains zero lines from this plan** (§8).

---

## 8. §21 Compliance — `work.ts` Is Not Modified

Direct evidence checked, not assumed: `work.ts`'s `getFeaturedCaseStudies()` is consumed by Homepage (`src/app/page.tsx`, confirmed, §3) — outside this plan's four target surfaces and explicitly protected. `work.ts`'s `getEngineeringThemes()`/`getEngineeringLessons()`/`getCaseStudyLibrary()`/`getProjectLibrary()` are consumed **only** by the two Work surfaces this plan migrates (confirmed by exhaustive grep, §10) — once WI-3/WI-4/WI-5 land, those four exports have zero remaining callers, but **removing or editing them is not "required for something outside placeholder migration"** — no other file or route needs them changed, and `docs/51`'s own Decision 5 evidence table never asked for `work.ts`'s fixture architecture to be corrected, only for the four public surfaces to stop reading it. Per this task's own explicit instruction, orphaning is recorded as a finding (§10, WI-6) and left exactly as-is. **`getProjectLibraryHref()`** (`work.ts`) is a pure route-string constant (`"/work/library"`) with no fixture dependency at all — `/work/page.tsx` keeps importing this one function from `work.ts` after migration; it was never part of the placeholder problem and moving or duplicating it would be unjustified churn.

---

## 9. WI-4 — Work Library (`/work/library`)

**Sequenced after WI-5 (§13)** — `BrowseLenses`' Theme lens treatment depends on WI-5's decision.

**Authoritative resolver: a new `getCaseStudyLibrary()` in `case-studies.ts`**, returning its own locally-defined shape — `{ caseStudies: CaseStudyEntry[], themes: EngineeringThemeEntry[], count: number }` — **not importing `work.ts`'s `CaseStudyLibrary` interface**, even as a type-only import, to keep the two files fully decoupled going forward (§8's spirit — no incidental coupling introduced as a side effect of this migration either).

- **Library Header → `count` from real `getAllCaseStudies().length`.**
- **Browse Lenses — Domain, Status → already render real per-item fields (`domain`, `status`) at render time**, confirmed by direct read; passing real `CaseStudyEntry`-shaped data requires no component change.
- **Browse Lenses — Theme, Case Study Listing → depend on WI-5's outcome and real `getAllCaseStudies()` respectively** — see §11.

---

## 10. WI-5 — Architecture Highlights / Engineering Lessons Resolution

**Ground truth, confirmed by direct docstring read**: both components were built anticipating a future schema field that was never added — `ArchitectureHighlights`'s own docstring names the intended shape (*"Project → Engineering Themes (frontmatter) → Architecture Highlights"*), and `workFrontmatterSchema` has no `themes`/`engineeringThemes` field. `EngineeringLessons`' own docstring names its own intended shape (*"a lesson stops being typed by hand and becomes a resolved edge between a Knowledge article and the case study(s) it was distilled from"*), and no `lessons`/`sourceProject` field exists either. `docs/03-SITEMAP.md`'s Work page hierarchy names only the five case studies — neither section is IA-mandated. `docs/13-HOMEPAGE_EXPERIENCE.md`/`docs/14-HOMEPAGE_COPY.md`, re-checked this turn as instructed, contain zero reference to either concept (confirmed by grep) — their silence is recorded, not silently skipped.

**DECISION — Architecture Highlights: reframed to real `domain` grouping.** `domain` is real, required, already used for exactly this kind of engineering-concern navigation elsewhere in this codebase (`findDomainNeighbor()`, `case-study-relationships.ts`; `BrowseLenses`' own `DomainLens`, already real). Reframing preserves the section's stated purpose — *"a second navigation model... navigates by engineering concern"* — using zero fabricated data.

**DECISION — Engineering Lessons: removed from `/work`'s composition.** No real field anywhere in the schema even partially overlaps with the section's defining content (hand-written `lesson` prose, `sourceProject`, `relatedKnowledge`). Reframing is not available the way it is for Architecture Highlights; fabricating prose would violate this task's own no-fabrication rule. The component file itself is not deleted (a future Related-Content feature could reuse its row pattern) — only its rendering on `/work` is removed.

**Cascading consequence, confirmed by grep this turn**: `BrowseLenses`' `ThemeLens` (`/work/library`) consumes the identical `EngineeringThemeEntry[]` shape — the same decision applies: **WI-4 passes `[]`**, not the fixture. `ThemeLens` already has a real empty-state path (`BROWSE_LENSES_COPY.theme.emptyState`, confirmed present) — not a new state to build. `DomainLens`/`StatusLens` remain fully populated; Browse Lenses does not become broken, only its one unsupported perspective goes quiet.

**Required mapping**: a new grouping function in `case-studies.ts` — not a 1:1 item mapper — producing `{ domain, caseStudies: CaseStudyEntry[] }[]` from `getAllCaseStudies()`, grouped in first-appearance order (matching `CaseStudyListing`'s own "respect whatever order you're handed" discipline).

**Component contract change — the one exception to "reuse without modification"**: `ArchitectureHighlights`' prop shape changes from `{ themes: EngineeringThemeEntry[] }` to the domain-grouped shape above. This is the specific case this task's own instruction anticipates: *"do not force real content into a component whose data vocabulary only makes sense for the old fixture."*

---

## 11. WI-6 — Fixture Cleanup / Dead-Code Assessment (Assessment Only, No Deletion)

Per §8's own reasoning, extended consistently: this plan does not delete anything as a side effect of migration. WI-6 exists to **record**, with evidence, exactly what becomes unreferenced once WI-1–WI-5 land — so a future, separately-authorized cleanup task has an accurate starting point, rather than this plan silently leaving stale code undocumented.

| Symbol | File | Consumers before this plan | Consumers after WI-1–WI-5 | Disposition |
|---|---|---|---|---|
| `getFeaturedCaseStudies()` | `work.ts` | Homepage, `/work` | **Homepage only** | Alive — not dead code, do not touch |
| `getProjectLibraryHref()` | `work.ts` | `/work` | `/work` (unchanged, §8) | Alive — not fixture-related, do not touch |
| `getProjectLibrary()` | `work.ts` | `/work`, `getCaseStudyLibrary()` (internal) | **None** | Newly dead — recorded, not removed |
| `getEngineeringThemes()` | `work.ts` | `/work`, `getCaseStudyLibrary()` (internal) | **None** | Newly dead — recorded, not removed |
| `getEngineeringLessons()` | `work.ts` | `/work` | **None** | Newly dead — recorded, not removed |
| `getCaseStudyLibrary()` | `work.ts` | `/work/library` | **None** | Newly dead — recorded, not removed |
| `PLACEHOLDER_WORK` | `placeholder-work.ts` | `work.ts`, `/work`, Homepage's `EngineeringCaseStudies` | **`work.ts` (via `getFeaturedCaseStudies()`), Homepage** | Alive — do not touch |
| `PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS` | `placeholder-work-landing.ts` | `work.ts` only | **None** (once WI-5 lands) | Newly dead — recorded, not removed |
| `PLACEHOLDER_ENGINEERING_LESSONS` | `placeholder-work-landing.ts` | `work.ts`, `EngineeringLessons` component | **None** (component still exists but unrendered, §10) | Newly dead — recorded, not removed |
| `PLACEHOLDER_START_HERE` | `placeholder-knowledge-landing.ts` | `/knowledge` | **None** | Newly dead — recorded, not removed |
| `PLACEHOLDER_RECENTLY_PUBLISHED` | `placeholder-knowledge-landing.ts` | `/knowledge` | **None** | Newly dead — recorded, not removed |
| `PLACEHOLDER_TOPIC_ARTICLES` | `placeholder-topic-articles.ts` | `/knowledge/[slug]` | **None** | Newly dead — recorded, not removed |
| `KnowledgeArticleCard` (type) | `placeholder-knowledge-landing.ts` | `StartHere`, `RecentlyPublished`, `TopicArticleList` | **Same three, still real consumers** (now typing real-data mappings) | Alive — do not touch |
| `CaseStudyEntry` (type) | `placeholder-work.ts` | `FeaturedCaseStudies`, `ProjectLibrary`, `CaseStudyListing`, `BrowseLenses`, Homepage's `EngineeringCaseStudies`, `work.ts`, `schema.ts` (docstring mention only) | **Same components, now typing real-data mappings; `work.ts`/Homepage unchanged** | Alive — do not touch |
| `PLACEHOLDER_TOPICS` | `placeholder-topics.ts` | `/knowledge`, `/knowledge/[slug]`, `topic-tile.tsx`, `related-topics.tsx`, `browse-by-topic.tsx` | **Same consumers, reclassified (§14) — not eliminated** | Alive, intentionally retained |

**Recommendation, not an action this plan performs**: `work.ts`'s four newly-dead exports and `placeholder-work-landing.ts`'s two newly-dead constants are real candidates for a future, separately-scoped removal once no risk remains of a not-yet-discovered consumer reappearing — explicitly **not** part of Task 7.1's own footprint, per §8/§21's own instruction not to "fix" `work.ts`'s fixture architecture as a side effect of this migration.

---

## 12. WI-7 — Release Candidate Review

The final work item — the release gate. Runs only after WI-1 through WI-6 are complete. Per this task's own §26, at minimum:

1. `/knowledge` renders real articles (title/description match `content/knowledge/*.mdx` directly, not inferred from resolver correctness alone).
2. `/knowledge` contains no `PLACEHOLDER_START_HERE`/`PLACEHOLDER_RECENTLY_PUBLISHED` import anywhere in its diffed files.
3. `/knowledge/[topic]` renders real articles per topic, confirmed against `content/knowledge/*.mdx`'s actual `topic` frontmatter.
4. Topic filtering is correct — every article shown on a topic page actually has that `topic` value; no article from a different topic leaks in.
5. Unknown topic behavior is unchanged — a slug that is neither a real `TOPIC_SLUGS` value nor a real article slug still reaches `notFound()`.
6. `/work` renders real Case Studies (title/description match `content/work/*.mdx` directly).
7. `/work` contains zero import of `PLACEHOLDER_WORK`, directly or via `work.ts`'s `getFeaturedCaseStudies()`/`getProjectLibrary()`.
8. `/work/library` renders real Case Studies via `case-studies.ts`'s new `getCaseStudyLibrary()`, not `work.ts`'s.
9. Architecture Highlights (reframed) and the absence of Engineering Lessons on `/work` both contain zero fabricated data — every domain group and every case study link traces to a real `content/work/*.mdx` document.
10. Empty states render real, honest copy (§ per-surface empty-state paths) — never a placeholder card, on any of: zero articles, zero case studies, a topic with zero matching articles, zero domains.
11. Ordering is correct: `sortByPublishedDate()` for chronological sections, `getFeaturedArticles()`/`getFeaturedCaseStudies()`'s own featured-then-newest-fallback for curated sections, `getAllCaseStudies()`'s natural order for Project Library/Listing/domain-group-appearance-order for Architecture Highlights — none re-derived or newly invented.
12. Drafts are excluded everywhere — a manually-flagged `draft: true` test document does not appear on any of the four surfaces.
13. Metadata is unchanged — `/knowledge`, `/work`, `/work/library`'s static `title`/`description` are byte-identical to their pre-migration values (none were ever fixture-derived); `/knowledge/[topic]`'s `generateMetadata()` still resolves correctly via the retained `PLACEHOLDER_TOPICS`.
14. Homepage renders unchanged — its Case Studies section still works, still reads `work.ts`'s untouched `getFeaturedCaseStudies()`, confirmed directly rather than assumed from "we didn't touch that file."
15. Search unchanged — zero diff.
16. RSS unchanged — zero diff.
17. Sitemap unchanged — zero diff.
18. Canonical detail pages (`/knowledge/[slug]` article branch, `/work/[slug]`) unchanged — zero diff.
19. No unintended client components — zero `"use client"` introduced anywhere in the diff.
20. `pnpm exec eslint` clean.
21. `pnpm exec tsc --noEmit` clean.
22. `pnpm build` clean.
23. `git diff` matches the approved file manifest (§21) exactly — no unlisted file touched.
24. No fixture content remains wired into any of the four target public surfaces — re-verified by import trace against the diff, the same method §3 used to build the original current-state map, not merely re-asserted.

**Release recommendation: `APPROVED` or `REFINEMENTS REQUIRED`**, the identical binary format every prior implementation plan in this series has used.

---

## 13. Sequencing — Derived From the Repository, Not the Suggested Numbering

```text
WI-1 (Knowledge Landing) ──┐   independent — different collection,
                            │   different files, no shared dependency
WI-2 (Knowledge Topic) ─────┘

WI-3 (Work Landing —
 Featured + Project        │
 Library only) ─────────────┤
                            ▼
                     WI-5 (Architecture Highlights /
                      Engineering Lessons resolution)
                            │  produces the domain-grouping
                            │  helper WI-4's Theme-lens
                            │  disposition depends on
                            ▼
                     WI-4 (Work Library) — depends on BOTH
                      WI-3's new case-studies.ts exports AND
                      WI-5's Theme-lens decision
                            │
                            ▼
                     WI-6 (Fixture cleanup / dead-code
                      assessment — depends on WI-1–WI-5
                      all being complete, to assess accurately)
                            │
                            ▼
                     WI-7 (Release Candidate Review)
```

**Note on numbering vs. execution order**: this task's own §25 suggested WI-4 (Work Library) before WI-5 (Architecture Highlights/Engineering Lessons); direct re-inspection (§10) found `/work/library`'s own `BrowseLenses` consumes the identical fixture-backed `EngineeringThemeEntry[]` shape Architecture Highlights does, so WI-4 cannot be correctly implemented without WI-5's decision already made. The work items keep their suggested labels for traceability against this task's own menu; execution order is WI-1/WI-2 (parallel) → WI-3 → WI-5 → WI-4 → WI-6 → WI-7.

---

## 14. Topic Labels

`findTopic()` currently lives privately inside `app/knowledge/[slug]/page.tsx`. **Correction to this plan's own earlier draft, made explicitly**: an earlier version of this plan proposed exporting `findTopic()` from that route file so `articles.ts`'s new `toKnowledgeArticleCard()` mapper could call it directly — that would have made a content-layer file (`lib/content/articles.ts`) import from a route file (`src/app/knowledge/[slug]/page.tsx`), inverting this codebase's own layering (`docs/24` Principle 7, Separation of Responsibilities: routes depend on content, never the reverse). Corrected here: **`toKnowledgeArticleCard()` takes `topicLabel: string` as a plain parameter** (§5) and never performs the lookup itself. The lookup itself moves to **`lib/constants/placeholder-topics.ts`** — the file that already owns `PLACEHOLDER_TOPICS` — as a newly-exported `findTopic(slug: TopicSlug): Topic | undefined`. This is the correct layer for two reasons: it's a `lib/constants` → `lib/constants` self-contained helper (no new cross-layer dependency), and it now needs two independent real callers (`app/knowledge/page.tsx` for Start Here/Recently Published's per-article topic label, and `app/knowledge/[slug]/page.tsx` for its own existing uses plus the same per-article need) — exactly the "multiple real consumers" bar this task's own §14 sets for justifying an export, not a speculative generalization.

---

## 15. SEO / Metadata

Verified directly: `/knowledge`, `/work`, `/work/library` carry static, hand-written `Metadata` objects with zero dependency on any `PLACEHOLDER_*` symbol — this migration cannot regress them, because nothing about them was ever fixture-derived. `/knowledge/[topic]`'s `generateMetadata()` reads `PLACEHOLDER_TOPICS` (retained, §9) — unchanged. No canonical URL, Open Graph, or structured data logic exists on any of the four surfaces today, so none is at risk.

---

## 16. Draft / Published Semantics

Every resolver this plan adds or reuses is draft-aware by construction: `getAllArticles()`, `getAllCaseStudies()` both call `filterDrafts(getAll(...))` internally. This plan uses exactly these — never `getArticleSlugs()`/`getCaseStudySlugs()` (raw, non-draft-filtered enumeration meant for routing existence-checks, not listing).

---

## 17. Content Ownership

No MDX is created or edited by this plan. Where a fixture's information has no real source (Engineering Lessons, Architecture Highlights' original theme taxonomy), the response is removal/reframing (§10), not fabrication. One real editorial opportunity is named for the content owner's own future consideration, not performed here: marking a real case study `featured: true` would let Featured Case Studies rely on curated selection rather than solely the newest-first fallback (§7).

---

## 18. Empty States

| Surface | Condition | Behavior |
|---|---|---|
| Knowledge (Start Here, Recently Published) | Zero real articles | Existing `emptyState` props, unchanged |
| Topic (valid, zero matching articles) | e.g. a topic with nothing published yet | `StartHere`/`TopicArticleList` existing empty states — the same behavior `placeholder-topic-articles.ts` already exercises for its 5 unpopulated topics today, now driven by real data |
| Unknown topic slug | Neither a real `TOPIC_SLUGS` value nor a real article slug | Unchanged — falls through to `notFound()`, same as today |
| Work (Featured, Project Library) | Zero real case studies | Must confirm both components already guard `length === 0`; if either currently assumes non-empty (untested since `PLACEHOLDER_WORK` is never empty), WI-3 adds the same guard `StartHere`/`BrowseByTopic` already use — no new pattern |
| Work Library (Listing, Lenses) | Zero real case studies | `CaseStudyListing`'s grouping and `BrowseLenses`' `DomainLens`/`StatusLens` already guard `.length === 0`, confirmed by direct read — unchanged |
| Architecture Highlights (reframed) | Zero domains | Same discipline — no domain groups, no fabricated tile |

No placeholder card is substituted for a missing real item anywhere in this plan.

---

## 19. Sorting / Limits

**Sorting** — not inferred from placeholder-array order: `sortByPublishedDate()` for chronological sections; `getFeaturedArticles()`'s existing featured-then-newest algorithm, mirrored (not re-derived) for the new `getFeaturedCaseStudies()`; `getAllCaseStudies()`'s own natural resolved order for Project Library/Listing — explicitly inheriting the same *"temporary fallback, not a semantic ordering guarantee"* limitation `case-study-relationships.ts` already names for its own tier-3 fallback, not silently improved as an incidental side effect of this migration.

**Limits** — Start Here stays 3 (`getFeaturedArticles({ limit: 3 })`, matching the current curated-array length); Featured Case Studies' new limit is an explicit, stated choice (this plan recommends mirroring `getFeaturedArticles()`'s own default of 3, not left implicit); Project Library, Case Study Listing stay unfiltered, matching today.

---

## 20. Component Reuse

| Component | Disposition |
|---|---|
| `StartHere`, `RecentlyPublished`, `BrowseByTopic`, `TopicArticleList`, `TopicHero`, `RelatedTopics`, `TopicTile`, `FeaturedCaseStudies`, `ProjectLibrary`, `CaseStudyListing`, `LibraryHeader`, `BrowseLenses` (`DomainLens`/`StatusLens`) | Unchanged — already fully data-agnostic, confirmed by direct read of every file |
| `BrowseLenses` (`ThemeLens`) | Unchanged component, changed input only (`[]`, §10) |
| `ArchitectureHighlights` | **The one prop-contract change** (§10) — domain-grouped shape replaces the fixture theme shape |
| `EngineeringLessons` | Not rendered by `/work` post-migration; file itself untouched |

No component is duplicated to avoid adapting an existing one.

---

## 21. File Manifest

| File | New / Modified | Work Item | Exact Reason | Mandatory / Conditional |
|---|---|---|---|---|
| `src/lib/content/case-studies.ts` | Modified | WI-3, WI-4, WI-5 | Add `getFeaturedCaseStudies()`, `getCaseStudyLibrary()`, `toCaseStudyEntry()`, and the domain-grouping helper — the real Work resolver extensions, kept in the content layer per this task's own instruction | Mandatory |
| `src/lib/content/articles.ts` | Modified | WI-1, WI-2 | Add `toKnowledgeArticleCard()` — the real Knowledge presentation-shape mapper | Mandatory |
| `src/lib/constants/placeholder-topics.ts` | Modified | WI-1, WI-2, §14 | Export `findTopic()` (currently private to a route file) — the layer-correct home for a helper two independent route files now need | Mandatory |
| `src/app/knowledge/page.tsx` | Modified | WI-1 | Swap fixture imports for real resolver calls (Start Here, Recently Published, Browse by Topic's `articleCount`); Learning Series untouched | Mandatory |
| `src/app/knowledge/[slug]/page.tsx` | Modified | WI-2 | Topic branch only: validity re-sourced to `TOPIC_SLUGS`; Start Here/Article List/`articleCount` re-sourced to real resolvers; Related Topics, Learning Series, article branch untouched | Mandatory |
| `src/app/work/page.tsx` | Modified | WI-3, WI-5 | Swap Featured/Project Library imports to `case-studies.ts`; Architecture Highlights receives reframed domain-grouped data; Engineering Lessons removed from composition | Mandatory |
| `src/app/work/library/page.tsx` | Modified | WI-4 | Swap `getCaseStudyLibrary()` import from `work.ts` to `case-studies.ts` | Mandatory |
| `src/components/work/architecture-highlights.tsx` | Modified | WI-5 | Prop contract changes from `EngineeringThemeEntry[]` to the domain-grouped shape | Mandatory |

**Not modified by this plan, anywhere — confirmed, not assumed**: `src/lib/content/work.ts` (§8), `src/app/page.tsx` (Homepage), `src/lib/constants/placeholder-work.ts`, `placeholder-work-landing.ts`, `placeholder-knowledge-landing.ts`, `placeholder-topic-articles.ts`, `placeholder-series.ts` (all read from where still needed, none deleted — §11), `lib/content/relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `search.ts`, `sitemap.ts`, `rss.ts`, any schema file, any content file, `lib/navigation/config.ts`, Header, Footer, `MobileNavigation`, `components/home/*`, `components/work/featured-case-studies.tsx`, `project-library.tsx`, `case-study-listing.tsx`, `library-header.tsx`, `browse-lenses.tsx`, every `components/knowledge/*` file except none (all confirmed already data-agnostic).

**Eight files touched. No speculative file listed** — every entry above is required by a specific WI's own resolver or mapping need identified through direct re-inspection (§3, §5–§10), not a guess at what might be needed.

---

## 22. Guardrails

Per this task's own §23, each confirmed to remain unchanged, with the evidence that makes each claim checkable rather than asserted:

- **Homepage** — unchanged; its shared dependency on `work.ts` is documented (§3) but `work.ts` itself is not touched, so Homepage's behavior cannot regress.
- **Search, RSS, Sitemap** — unchanged; none of the three imports anything this plan modifies (`articles.ts`'s and `case-studies.ts`'s *existing* exports are untouched; only new exports are added).
- **`/knowledge/[slug]` (article branch), `/work/[slug]`** — unchanged; this plan touches only Step 1 of the former and none of the latter.
- **Engineering Log, About, 404** — unchanged; zero dependency on any file this plan touches.
- **Navigation config, `MobileNavigation`** — unchanged; zero dependency.
- **`case-studies.ts`, `articles.ts`** — modified, but only additively: every existing export's signature and behavior is unchanged; both files gain new exports only, justified individually in §21's own "Exact Reason" column, per this task's own "if a shared resolver must be modified, explain exactly why and verify existing consumers remain behaviorally unchanged."
- **`engineering-logs.ts`** — unchanged; confirmed by grep this turn to have exactly one consumer (`/work/[slug]`), entirely outside this plan's scope.

---

## 23. Regression Risks

| # | Risk | Verification that catches it |
|---|---|---|
| 1 | Replacing fixture data with a different shape breaks a component | Every mapping in this plan (§5, §7, §10) targets the component's *existing* prop shape exactly (`KnowledgeArticleCard`, `CaseStudyEntry`) except `ArchitectureHighlights`, whose contract change is explicit and isolated (§10, §20); WI-7 step 20–22 (lint/typecheck/build) catches any shape mismatch at compile time |
| 2 | Accidentally changing detail-page behavior | `/knowledge/[slug]`'s article branch and `/work/[slug]` are named explicitly as untouched (§4, §22); WI-7 step 18 diffs them directly |
| 3 | Exposing draft content | Every resolver used is the `filterDrafts()`-wrapped version, never raw slug enumeration (§16); WI-7 step 12 tests with a manually-drafted document |
| 4 | Reintroducing placeholder Work | `case-studies.ts`/`getAllCaseStudies()` only, never `work.ts`/`PLACEHOLDER_WORK`, stated as an explicit guardrail (§7); WI-7 step 7 checks the diff's imports directly |
| 5 | Losing topic filtering | WI-2's filter is explicit (`frontmatter.topic === slug`); WI-7 step 4 verifies every rendered article on a topic page actually carries that topic |
| 6 | Removing real metadata | §15 confirms none of the four surfaces' metadata was ever fixture-derived except the topic branch's, which is unchanged (`PLACEHOLDER_TOPICS` retained); WI-7 step 13 diffs metadata values directly |
| 7 | Inventing Architecture Highlights / Engineering Lessons content | §10's decision is grounded in direct schema/docstring evidence, explicitly rules out fabrication for Engineering Lessons; WI-7 step 9 checks every rendered fact traces to real frontmatter |
| 8 | Changing ordering | §19 states each surface's ordering is inherited from an existing, already-used function, never newly invented; WI-7 step 11 checks ordering explicitly |
| 9 | Changing empty-state behavior incorrectly | §18 reuses existing empty-state props/paths everywhere except where WI-3 must add a previously-untested guard (named explicitly, not silently assumed); WI-7 step 10 exercises every empty condition |
| 10 | Expanding scope into Tags/Technologies/Series prematurely | §24 restates the Milestone 7 boundary explicitly; no file in the manifest (§21) touches any tag, technology, or series concern beyond the already-scoped, already-decided Series exclusion (`docs/51` Decision 1) |

---

## 24. Milestone 7 Boundary

This migration does **not** implement Tags, Technologies, Series routes, Filtering, Reading Paths, new Related Content ranking, semantic search, search indexing, or recommendations. Its purpose, stated exactly as this task frames it: *make the existing public content surfaces authoritative and real so Discovery can safely build on them.* Every one of `docs/51`'s remaining open decisions (Tags' normalization, Technologies' facet, Series' real content and routing, Reading Paths' deferred definition, Related Content's Work↔Work extension) stays exactly where `docs/51` left it — this plan neither advances nor blocks any of them beyond making their eventual data source trustworthy.

---

## 25. Rollback Plan

Every file in §21 is a modification to an already-real, already-working file — revertable via standard diff revert, no cross-file cleanup, no schema/content/route change to unwind. `work.ts` is never touched, so no rollback risk exists there at all.

---

## 26. Acceptance Criteria (Plan-Level)

- Every work item traces to `docs/51` Decision 5's own scope; the one new architectural decision (Architecture Highlights/Engineering Lessons, WI-5) is grounded in direct evidence, not preference.
- `work.ts` is confirmed untouched, with direct evidence for why (§8), not merely asserted.
- `findTopic()`'s relocation respects this codebase's own layering (content layer never imports from the route layer) — a correction made explicitly in this document rather than carried forward as a latent error (§14).
- File manifest (§21) is exhaustive and minimal — eight files, each independently justified.
- Guardrails (§22) are each individually evidenced, not merely listed.
- No production code, route, schema, component, or content was modified to produce this document.

---

## 27. Final Report

1. **Current fixture architecture** — Knowledge Landing/Topic pages and Work Landing/Library are entirely `PLACEHOLDER_*`-driven (§3); Homepage's Case Studies section shares the same `work.ts` dependency as the Work surfaces, a finding this plan surfaced directly rather than inheriting from `docs/50`/`docs/51`.
2. **Real content sources** — `getAllArticles()`/`getFeaturedArticles()` (`articles.ts`), `getAllCaseStudies()` and two new sibling exports (`case-studies.ts`) — all draft-filtered, all already real.
3. **Knowledge migration strategy** — WI-1: `getFeaturedArticles()` for Start Here, `sortByPublishedDate(getAllArticles())` for Recently Published, `TOPIC_SLUGS`+retained `PLACEHOLDER_TOPICS` for Browse by Topic.
4. **Topic migration strategy** — WI-2: same resolvers scoped per-topic; validity re-sourced to `TOPIC_SLUGS`; real computed `articleCount`.
5. **Work migration strategy** — WI-3: new `case-studies.ts` `getFeaturedCaseStudies()` (with a required newest-first fallback, since zero real case studies are currently flagged featured) and `getAllCaseStudies()` for Project Library.
6. **Work Library migration strategy** — WI-4: new `case-studies.ts` `getCaseStudyLibrary()`, sequenced after WI-5 because of the shared Theme-lens dependency.
7. **Architecture Highlights / Engineering Lessons decision** — WI-5: Architecture Highlights reframed to real `domain` grouping; Engineering Lessons removed (no real field exists to reframe it from); both decisions grounded in the components' own docstrings and the real schema, not preference.
8. **Placeholder cleanup** — WI-6: assessed, not performed; four `work.ts` exports and two `placeholder-work-landing.ts` constants become dead code, explicitly recorded and explicitly left untouched, per this task's own instruction not to "fix" `work.ts` as a side effect.
9. **Empty-state behavior** — reuses existing, already-honest empty-state paths everywhere; one previously-untested guard may be needed in WI-3 (§18), named explicitly.
10. **Draft semantics** — `filterDrafts()`-wrapped resolvers only, never raw slug enumeration.
11. **Sorting/limits** — every ordering inherited from an existing function; every limit an explicit, stated choice.
12. **SEO/metadata preservation** — confirmed none of the three static-metadata surfaces was ever fixture-derived; the topic branch's metadata is unchanged since `PLACEHOLDER_TOPICS` is retained.
13. **Component reuse** — twelve components entirely unchanged; one (`ArchitectureHighlights`) has a justified, isolated contract change.
14. **Work items** — WI-1 through WI-7, per this task's own suggested menu, kept as labeled.
15. **Dependency order** — WI-1/WI-2 parallel → WI-3 → WI-5 → WI-4 → WI-6 → WI-7; WI-4 sequenced after WI-5 despite the suggested numbering, because direct re-inspection found a real shared dependency (§13).
16. **Exact file manifest** — eight files, §21, each independently justified, no speculative entries.
17. **Guardrails** — seven protected surfaces/files, each confirmed by direct evidence rather than asserted (§22).
18. **Regression strategy** — ten named risks, each with a specific, concrete verification step (§23).
19. **Release gate** — WI-7, 24 verification steps, ending in `APPROVED`/`REFINEMENTS REQUIRED` (§12).
20. **Confirmation**: no production code, route, schema, component, or content was modified to produce this document — `git status` shows only this file as a change.

---

## Summary

This plan converts `docs/51` Decision 5 into seven dependency-ordered work items across eight touched files — all resolver extensions living in the content layer (`case-studies.ts`, `articles.ts`, and `placeholder-topics.ts` for the one layer-correct helper export), never in route or component files beyond the one justified exception (`ArchitectureHighlights`' contract). `work.ts` is confirmed untouched throughout, with direct evidence for why: Homepage depends on it directly, a finding this plan's own re-inspection surfaced rather than inherited. Architecture Highlights is reframed to a real `domain` grouping; Engineering Lessons is removed rather than fabricated forward — both decisions traced to the components' own docstrings predicting a schema field that was never built. `PLACEHOLDER_TOPICS` survives, correctly reclassified as presentation configuration. A dead-code assessment (WI-6) records, but does not act on, four now-orphaned `work.ts` exports — left for a future, separately-authorized task. The final work item is a 24-point Release Candidate Review ending in an explicit `APPROVED`/`REFINEMENTS REQUIRED` verdict. This migration implements none of Tags, Technologies, Series routing, Filtering, Reading Paths, or Related Content ranking — its entire purpose is making the four public surfaces trustworthy so those decisions, already recorded in `docs/51`, can build on real data when their own time comes. No production code, route, schema, component, or content was modified to produce this document.
