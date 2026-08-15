# 53 — Discovery Taxonomy: Design Proposal

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document. No route, component, schema, or content was created or modified to produce it.

Task 7.2's design-stage proposal, following Task 7.1 — Real Content Migration (`docs/52`, complete and approved): `/knowledge`, `/knowledge/[topic]`, `/work`, `/work/library` now read real content throughout, alongside Search, RSS, Sitemap, and every canonical detail page.

---

## 1. Purpose

The question this document answers is not *"which taxonomy should we add"* — it's: **what is the smallest trustworthy taxonomy/discovery capability that lets a reader find content they didn't already know to look for**, given what this repository's real, authored content actually contains today, not what a generic Discovery feature list would assume it contains. Five candidates are evaluated — Topics, Tags, Technologies, Series, Domains — against direct re-inspection of the post-migration repository, and the recommendation is grounded in that evidence, not in `docs/12`'s bare deliverable names.

---

## 2. Authoritative Decisions Carried Forward, Not Reopened

Per `docs/51-MILESTONE_7_DISCOVERY_DECISIONS.md`, re-read in full this turn:

- **Series** (Decision 1): a real content concept, schema-ready, zero real content today. **A public `/series/[slug]` route remains unauthorized** — `docs/03-SITEMAP.md`'s URL Structure still doesn't list it (re-confirmed, §8). Not redesigned here.
- **Technologies** (Decision 2): the smallest trustworthy model is a facet over the existing free-form `technologies` field — **not** activation of the empty `content/technologies/` collection. Re-confirmed, not reversed (§7).
- **Tags** (Decision 4): free-form authored strings, **not** a controlled vocabulary — this stays true in this document too (§6). What's evaluated here is narrower and different: not "should tags be controlled," but "should a *separate* discovery surface exist that groups content by tag" — a question Decision 4 explicitly left open for exactly this later stage (*"A future tag-browse/filter feature is buildable... once the real-content migration... makes that data reachable"*), not one it foreclosed.
- **Reading Paths** (Decision 3): deferred, insufficiently distinct from Series. **Not designed here, not touched.**
- **Placeholder migration** (Decision 5): complete (`docs/52`, approved). Its consequence for this document: every real value inventoried in §4 below is now reachable from a real, canonical page — a taxonomy proposal grounded in this data describes something a reader can actually land on, not a hypothetical.

---

## 3. Milestone 6 Design History — Explicitly Considered, Not Casually Reversed

`docs/51` Decision 4 already drew the precise line this document must not blur: *Milestone 6's "tags are not a filterable badge row" ruling governs one document's own header* — `DocumentHeader` (Knowledge) and `LogEntryHeader` (Engineering Log) both render tags as a quiet, comma-joined text line, confirmed unchanged by direct re-read this turn. **This proposal does not touch that.** No document's own header gains a badge row, a filter chip, or a click-to-filter affordance as part of anything recommended here. What's evaluated is a *separate* surface — grouping content across documents by shared tag — the same category of feature Search already is for title/description matching, not a redesign of how any one document presents its own metadata. If §11's recommendation is approved, the new requirement that justifies it is stated explicitly there, not assumed.

---

## 4. Re-Inspection — The Real Content Model, Post-Migration

Verified by direct read of every real `content/knowledge/*.mdx` and `content/work/*.mdx` frontmatter block this turn — not carried forward from `docs/50`/`docs/51` unchecked, since content-model facts are exactly the kind of thing that can silently drift.

### Real tag values (8 documents, all set `tags`; Engineering Log empty)

| Document | Collection | Tags |
|---|---|---|
| `optimistic-vs-pessimistic-locking` | Knowledge | `concurrency`, `databases`, `locking`, `correctness` |
| `how-jwt-works` | Knowledge | `jwt`, `authentication`, `tokens` |
| `money-floating-point` | Knowledge | `floating-point`, `money`, `data-modeling`, `correctness` |
| `data-transfer-objects` | Knowledge | `api-design`, `data-modeling`, `architecture` |
| `vaultpay` | Work | `backend`, `concurrency`, `payments`, `go` |
| `gohunt` | Work | `backend`, `go`, `ai`, `job-search` |
| `haya` | Work | `backend`, `ai`, `concurrency`, `payments`, `platform` |
| `cookeaze` | Work | `backend`, `payments`, `django`, `ai` |

**Real overlap, confirmed by direct comparison, not assumed**: `correctness` (2× Knowledge), `data-modeling` (2× Knowledge), `backend` (4× Work — every case study), `payments` (3× Work), `ai` (3× Work), `go` (2× Work) — and, most significant for a cross-collection question, **`concurrency` appears in both a Knowledge article (`optimistic-vs-pessimistic-locking`) and two Work case studies (`vaultpay`, `haya`)**. This is the one real, already-authored, cross-collection semantic link in this entire repository's tag data.

**Formatting, confirmed by direct inspection**: every one of the 19 unique tag values across all 8 documents is already lowercase, hyphen-separated, slug-shaped (`api-design`, `floating-point`, `job-search`) — **no case or spelling drift found in the real data today**, contrary to the hypothetical risk `docs/51` Decision 4 named as a reason to keep normalization light. This is a positive, evidenced finding, not an assumption: the risk `docs/51` guarded against hasn't materialized in practice yet.

**One real naming collision, worth flagging directly**: the string `"backend"` means two structurally different things depending on which collection it appears in — a Knowledge article's single, controlled `topic` value, versus a free-form `tag` on every one of the 4 real Work case studies. Nothing in the schema or the real data resolves this collision; a cross-collection taxonomy design has to either account for it or explicitly not conflate the two (§10, §11).

### Real technology values (Work only — confirmed, zero Knowledge articles set `technologies`)

| Document | Technologies |
|---|---|
| `vaultpay` | Go, Fiber, PostgreSQL, Redis |
| `gohunt` | Go, Fiber, PostgreSQL, sqlc, Claude API, Next.js |
| `haya` | Node.js, TypeScript, Express, MongoDB, Redis, BullMQ, Puppeteer, OpenAI GPT-4o |
| `cookeaze` | Python, Django, Django REST Framework, MySQL, Celery, Redis, Paystack |

Real overlap: `Go` (2×), `PostgreSQL` (2×), `Redis` (3×), `Fiber` (2×). **Formatting is proper-cased display names, not slugs** (`Go`, `PostgreSQL`, `Node.js`, `OpenAI GPT-4o`) — a genuinely different convention from tags' lowercase-slug shape, confirmed, not assumed. No version strings present (`"Go"`, never `"Go 1.21"`) — no obvious normalization noise from that direction either.

### Real domain values (Work only — schema-enforced, not shared)

`Backend Infrastructure` (vaultpay, cookeaze), `AI Systems` (gohunt), `Platform Engineering` (haya) — 3 unique values, 4 documents, confirmed unchanged since Task 7.1 (which read, never authored, this field).

### Real topic values (Knowledge only — schema-enforced, controlled vocabulary)

`backend`, `architecture`, `distributed-systems`, `security` — 4 of the 8 `TOPIC_SLUGS` values have real articles today; `system-design`, `cloud`, `performance`, `testing` have none yet (confirmed live via Task 7.1's own verification: `/knowledge/testing` renders an honest "0 Articles").

### Series — reconfirmed zero real usage

Direct grep for `series:`/`seriesOrder:` across every real `.mdx` file: zero matches. Unchanged since `docs/51`.

### Current display / filter status (re-confirmed live and by source, post-migration)

| Field | Displayed where | Filterable anywhere today |
|---|---|---|
| `topic` | `DocumentHeader`, Breadcrumb, `/knowledge/{topic}` (full page) | Yes — via the `/knowledge/{topic}` route itself |
| `tags` | `DocumentHeader` (Knowledge), `LogEntryHeader` (Engineering Log) — plain text, no links | **No** — confirmed, `search.ts`'s `matchesQuery()` still checks only `title`/`description`; no tag-based route or filter exists anywhere |
| `technologies` | `ProjectHeader` (Work) only — plain text, no links. **Confirmed this turn: never rendered on Work case studies' `tags`** (zero matches for any `tags` usage in `project-header.tsx`) | No |
| `domain` | `ProjectHeader`, `ArchitectureHighlights` (real since Task 7.1), `BrowseLenses`' `DomainLens` (Work Library) — the most-exposed field of the five, post-migration | Yes, informally — `DomainLens` links to an in-page anchor (`#domain-...`) within `/work/library`, not a separate filtered URL |
| `series` | `LearningSeries` (still fixture-backed, `docs/51` Decision 1) | No |

No `Badge`/`Chip`/pill UI primitive exists anywhere in `components/ui/` (confirmed: `button`, `card`, `dropdown-menu`, `input`, `separator`, `skeleton`, `tooltip` — seven files, no eighth) — any tag- or technology-facing UI this proposal recommends has to reuse plain-text/list-row conventions already established, not invent a new visual primitive.

---

## 5. Taxonomy Candidate Comparison

| | **Topics** | **Tags** | **Technologies** | **Series** | **Domains** |
|---|---|---|---|---|---|
| Semantic meaning | Which single shelf a Knowledge article lives on | Free-form concepts a document touches | What was built with | An authored learning sequence | Which engineering area a case study belongs to |
| Source of truth | `TOPIC_SLUGS` (`lib/content/topics.ts`) | Author-written, per document | Author-written, per document | `series`/`seriesOrder` frontmatter (unused) | Author-written, per case study |
| Schema field | `topic` (Knowledge only, required) | `tags` (shared, `articleFrontmatterSchema`) | `technologies` (shared, `articleFrontmatterSchema`) | `series`/`seriesOrder` (shared, optional) | `domain` (Work only, required) |
| Current real values | 4 of 8 slugs used | 19 unique values, real overlap | 15 unique values, real overlap | None | 3 unique values |
| Normalization | Enforced (`z.enum`) | None enforced; consistently formatted in practice anyway | None enforced; proper-cased, no observed drift | N/A — unused | None enforced; 3 clean, human-authored strings |
| Controlled vocabulary? | Yes | No | No | No | No |
| Authored or derived? | Authored (per article) | Authored | Authored | Authored (unused) | Authored |
| Routable today? | Yes — `/knowledge/{topic}` | No | No | No (Learning Series is in-page only) | No (in-page anchors only) |
| Currently displayed? | Yes, extensively | Yes, plain text only | Yes, plain text only (Work) | Yes (fixture data) | Yes, extensively (post-migration) |
| Currently filterable? | Yes | No | No | No | Informally, in-page only |
| Shared across collections (schema)? | No — Knowledge only | **Yes** — all three | Yes (schema), but Work-only in practice | Yes (schema), unused | No — Work only |
| Real cross-collection overlap in authored data? | N/A (single-collection) | **Yes — `concurrency`** | No (Knowledge never sets it) | N/A | N/A |
| Stable enough to expose publicly? | Yes, already proven | Yes — no drift found in real data | Yes for Work; untested for Knowledge (zero data) | No — no real content to expose | Yes for Work, but not evidenced as a cross-site concept |

**The one row that decides this document's recommendation**: Tags is the only candidate that is *simultaneously* schema-shared across all three collections, has real authored data in more than one collection, and shows a real, already-existing semantic overlap between those collections (`concurrency`). Every other candidate fails at least one of those three tests — Topics is single-collection by design; Technologies is schema-shared but practically single-collection today; Domains isn't schema-shared at all; Series has no real data to evaluate.

---

## 6. Topics — Already the First Discovery Taxonomy

Per this task's own §5 framing: Topics already constitutes a working, complete, well-evidenced Discovery taxonomy — controlled vocabulary, a real route, real filtering (via the route itself), real counts (post-Task-7.1, real per-topic article counts), sitemap inclusion (8 `TOPIC_SLUGS` entries, re-confirmed unchanged in `sitemap.ts` this turn), breadcrumb integration, related-topic cross-links. Nothing here is broken or incomplete.

**Recommendation: Option A only in the narrowest sense — no structural work is proposed for Topics in Task 7.2.** It's not a candidate this document is choosing *between* — it's the baseline every other candidate is measured against, and it already clears the bar. The one honest limitation, stated rather than silently accepted: Topics cannot become a cross-collection mechanism without a schema change (adding `topic` to `workFrontmatterSchema`/Engineering Log), which is out of this document's authority and not evidenced as needed — `schema.ts`'s own docstring already explains why Work/Engineering Log deliberately don't carry `topic` (they aren't "located" within one of the eight knowledge domains the way an evergreen article is). **Do not duplicate Topic functionality** — nothing proposed in §11 re-implements per-topic pages, counts, or breadcrumbs; Tags' proposed surface is additive, not a second Topics.

---

## 7. Tags — Editorial Metadata With Real, Demonstrated Discovery Value

Re-inspected per this task's own §6 sub-questions:

- **Which collections have tags**: Knowledge and Work today (both real); Engineering Log's schema supports it but has zero real entries to evaluate.
- **Actual values, overlap, case/spelling drift**: §4's table — 19 unique values, real overlap within and across collections, **zero drift observed**.
- **Slugs or display names**: slug-shaped (`api-design`, not `"API Design"`) — already close to routable/filterable form without transformation.
- **Meaningful enough for public discovery**: yes, evidenced directly — `concurrency` genuinely connects a Knowledge article about locking strategies to two Work case studies that had to solve concurrency problems in production. That is exactly `docs/50`'s own definition of Discovery: *"content [a reader] did not already know to look for."* A reader on the `optimistic-vs-pessimistic-locking` article has no way to learn `vaultpay` grappled with the same concern — not because the connection doesn't exist, but because nothing surfaces it today.
- **Genuinely editorial or merely presentation labels**: editorial. Every tag is a deliberate word choice made by the same author writing the document, describing a real concept the content addresses — not derived, not inferred, not decorative. This matters for `docs/24` Principle 8 (authored over inferred): a tag-based discovery surface would still be reading 100% author-authored signal, not an inferred similarity score.
- **Currently displayed / filterable**: displayed (Knowledge, Engineering Log convention; Work renders nothing), never filterable, confirmed (§4).

**No tag value is invented anywhere in this document** — every value named above is copied directly from real frontmatter.

---

## 8. Technologies — Real, But Not Yet a Cross-Collection Signal

Per this task's own §7 sub-questions:

- **Which content types**: Work only, in practice — confirmed, zero Knowledge articles set `technologies` despite the field being schema-available to them.
- **Values, frequency, naming consistency**: §4's table — 15 unique values, real reuse (`Go`, `PostgreSQL`, `Redis`), consistently proper-cased.
- **Case sensitivity, aliases, version strings**: no case conflicts observed (nothing today reuses a technology name with different casing); no alias mechanism exists or is needed yet; no version strings present.
- **Stable enough for public filtering**: yes, for Work — the data is clean. Untested for Knowledge, since none exists there yet.
- **Overlap with tags**: none in vocabulary shape (tags are lowercase-slugs; technologies are proper-cased product names) and none in practice — no string appears in both a document's `tags` and `technologies` arrays.

**The required conceptual distinction, stated explicitly per this task's own §7**:

```text
Tag           "concurrency"    — a concept the content addresses
Technology    "Go"             — what was built with
Topic         "backend"        — which single shelf a Knowledge article lives on (Knowledge only)
```

These are not collapsed into one taxonomy anywhere in this proposal. A `Go`-technology filter and a `concurrency`-tag filter would answer genuinely different reader questions ("show me everything built with Go" vs. "show me everything that grapples with concurrency"), and nothing here conflates them into a single "topic-like" facet.

**Recommendation**: Technologies remains `docs/51` Decision 2's own scope — the smallest trustworthy model (a facet over the real field) is unchanged — but it is **not** the candidate this document recommends building first (§11), because it lacks Tags' one decisive property: real, already-authored cross-collection overlap. A Technologies facet today would be functionally a Work-only feature wearing a cross-collection-shaped schema, until Knowledge articles start authoring it too.

---

## 9. Series — Reconfirmed Deferred, Not Fabricated

Per this task's own explicit instruction and `docs/51` Decision 1: zero real content, reconfirmed by direct grep this turn (§4). No example series is invented here.

**Determination, per this task's own three-way framing (§8)**: **deferred until real series content exists** — neither "surfaced now" (there's nothing real to surface) nor "used internally" (nothing currently reads `series`/`seriesOrder` except the already-built-but-currently-dormant `findSeriesNeighbor()`/`resolveContinueLearning()` resolvers, which activate automatically the moment real series content exists, requiring no new code). This is the same conclusion `docs/51` already reached; nothing in this turn's re-inspection changes it.

---

## 10. Domains — Work-Internal Editorial Grouping, Not a Global Taxonomy

Per this task's own explicit caution (§9): Domain's real, extensive use across three Work-page sections (`ProjectHeader`, `ArchitectureHighlights`, `BrowseLenses`) — all landing on real data only since Task 7.1 — does not by itself justify promoting it to a cross-site Discovery taxonomy. Direct evidence against doing so:

- **Schema-scoped to Work only** — `domain` is required on `workFrontmatterSchema`, absent from `articleFrontmatterSchema` (the shared base) and thus absent from Knowledge and Engineering Log entirely. Extending it cross-collection would be a schema change, out of this document's authority and not evidenced as needed.
- **No cross-collection analog exists conceptually either** — "Backend Infrastructure," "AI Systems," "Platform Engineering" describe *what kind of system a project is*, a question that doesn't obviously apply to a Knowledge article (which already has `topic` answering a related-but-distinct question) or an Engineering Log entry (chronological by design, per `docs/03`).
- **Its current three real values are Work's own editorial classification**, authored per-project the same way `status`/`timeline` are — presentation metadata for one collection, not a taxonomy this repository has ever treated as portable.

**Determination**: Domain stays exactly what Task 7.1 already made it — real, internal, Work-page presentation and grouping metadata. **Not recommended for promotion to a public, cross-collection Discovery taxonomy** in this document. Its presence and usefulness within Work is not evidence it belongs anywhere else.

---

## 11. Cross-Collection Model

```text
                    Knowledge              Work                   Engineering Log
Topic               Real, required,        Not applicable          Not applicable
                     controlled (8 slugs)   (no field)              (no field)

Tags                Real, authored,         Real, authored,        Schema-ready,
                     free-form               free-form               zero real entries
                     (4 documents)           (4 documents)

Technologies         Schema-ready,           Real, authored          Schema-ready,
                     zero real entries       (4 documents)           zero real entries

Series               Schema-ready,           Schema-ready,          Schema-ready,
                     zero real entries       zero real entries      zero real entries

Domain               Not applicable          Real, required,         Not applicable
                     (no field)              editorial (3 values)    (no field)
```

**Tags is the only row with real, non-zero data in two of three columns today** — the concrete basis for §5's comparison-table conclusion and §12's recommendation. Every other candidate either has real data in exactly one collection (Topic, Domain — structurally, by schema design, permanently single-collection) or real data in zero/one collection today with no cross-collection evidence to evaluate (Series everywhere; Technologies outside Work).

---

## 12. Recommendation: Tags as the Smallest Trustworthy Cross-Collection Discovery Capability

**What is recommended, precisely**: a discovery surface that lets a reader, starting from one document, find other documents — potentially in a different collection — that share an author-written tag. **What is not recommended**: any change to how tags render on a document's own header (§3); a controlled tag vocabulary (`docs/51` Decision 4, unreversed); a new content collection; any schema change.

### Mechanism — Extend `/search`, Do Not Invent a New Route

Two options exist for *where* this capability would live, evaluated per `docs/24` Principle 2 (extend existing architecture before adding a new one):

**Option A — a dedicated `/tags/[tag]` route.** Rejected for the same reason `docs/51` Decision 1 already rejected a dedicated `/series/[slug]` route: `docs/03-SITEMAP.md`'s URL Structure doesn't authorize it, and this document has no more authority to add a new top-level route than `docs/51` did. Building one here would repeat the exact gap `docs/51` already named and deferred, not resolve it.

**Option B — extend `/search`'s existing matching to include `tags`, and accept an optional tag-scoped query.** `/search` already exists, is already IA-authorized (it's a shipped Milestone 6 route), already groups results by collection (Knowledge/Work/Engineering Log — the identical presentation shape a cross-collection tag result needs), and already reads the exact three real resolvers (`getAllArticles()`, `getAllCaseStudies()`, `getAllEngineeringLogEntries()`) this capability would need. Concretely: `matchesQuery()` (`search.ts`) would test `tags` in addition to `title`/`description`, and each document's tag list would render alongside its result (a plain, comma-joined line — the same restrained treatment `DocumentHeader`/`LogEntryHeader` already use, not a new badge UI). A reader could reach this either by typing a tag as a search term (already works the moment matching extends to `tags`) or by clicking a tag rendered on a document's own header, could that link point at `/search?q=<tag>` — an extension of an existing, real link, not a new page.

**Recommended: Option B.**

### Architecture Decision — D1: Extend Search's Matching Surface, Don't Build a Parallel Discovery Route

**Context**: A cross-collection tag capability needs somewhere to live; `/search` and a new `/tags/[tag]` route are the two structurally plausible homes.

**Options Considered**: (a) new dedicated route; (b) extend `/search`'s existing matching.

**Chosen Approach**: (b).

**Rationale**: `docs/51`'s own Series decision already established the governing precedent for exactly this situation — a new top-level route needs explicit IA authorization this document doesn't have, while an existing, already-authorized route can be extended within its own already-approved boundary (`docs/51` §9's own "Milestone 7 may add discovery mechanisms around that foundation" — stated for Search specifically). Extending `matchesQuery()`'s field list is the smaller, better-evidenced change; it reuses `/search`'s already-built collection-grouping presentation rather than re-implementing it.

**Trade-offs**: Tag-based results are not visually or structurally distinguished from a title/description match within the same results list — a reader searching a term that happens to also be a tag can't tell which match type fired. Acceptable for a first, minimal capability; a future refinement could label which field matched, but that's presentation polish, not this decision's blocker.

**Consequences**: No new route, no new IA decision required, no new component beyond what `/search`'s existing result rendering already provides (a tag line, reusing the plain-text convention already established elsewhere). `docs/41`/`docs/42`'s own Search architecture (D1: server-rendered GET, D2: substring match, no ranking) is extended, not replaced — matching field count grows from two to three; the query mechanism, grouping, and no-ranking discipline all stay exactly as shipped.

---

## 13. Explicit Non-Goals

- No controlled tag vocabulary, alias system, or validation layer (`docs/51` Decision 4, unreversed).
- No `/tags/[tag]` or any other new route.
- No change to how tags render on any document's own header.
- No activation of `content/technologies/` (`docs/51` Decision 2, unreversed).
- No Series route, no Series content authored.
- No Reading Path design of any kind (`docs/51` Decision 3, unreversed).
- No promotion of `domain` to a cross-collection taxonomy.
- No ranking, scoring, or inferred-similarity logic — every match this proposal describes is a literal string comparison against author-written data, consistent with `docs/24` Principle 8 and with `docs/41`/`docs/42`'s own Search decisions.
- No schema change of any kind.

---

## 14. Open Questions

**Q1 — Should a document's own tag line (`DocumentHeader`/`LogEntryHeader`) become a link to `/search?q=<tag>` once Search's matching extends to tags, or stay plain text?** *Why it matters:* this is the one place §3's "no change to document-header presentation" boundary could reasonably be revisited, since linking a tag doesn't add a badge-wall, just an affordance. *Evidence needed:* an implementation-stage decision, not one this design proposal needs to resolve to establish the underlying capability.

**Q2 — Should Work's `ProjectHeader` start rendering `tags` at all, given it currently renders none?** *Why it matters:* Work's tags are real and authored but completely invisible today (§4) — a tag-based Search extension would make them discoverable via search without ever having been shown on their own document. *Evidence needed:* a presentation-layer decision independent of this document's core recommendation.

**Q3 — At what point does Engineering Log's zero-tag-data status stop being "not yet evaluated" and start being worth revisiting?** *Why it matters:* the collection is schema-ready but empty; nothing here evaluates it meaningfully because there's nothing real to evaluate. *Evidence needed:* real Engineering Log content, whenever the first entry is published.

---

## 15. Acceptance Criteria (Document-Level)

- All five candidates are evaluated against direct re-inspection of the live, post-Task-7.1 repository, not assumed from prior documents.
- No tag, technology, domain, or series value is invented anywhere in this document — every value cited traces to a real, quoted frontmatter field.
- `docs/51`'s settled decisions (Series routing, Technologies model, Tags' free-form status, Reading Paths' deferral) are each explicitly restated and preserved, not silently reopened.
- The one new architectural decision this document makes (D1, §12) is justified against `docs/24` Principle 2 and `docs/51`'s own Series precedent, not asserted without grounding.
- No production code, route, component, schema, or content was modified to produce this document.

---

## Summary

Five taxonomy candidates were evaluated against the real, post-migration content model, not against assumption. Topics already is a complete, working Discovery taxonomy and needs no further work here — it's Knowledge-only by design and stays that way. Domain is real and useful but Work-internal, not evidenced as a cross-collection concept, and not promoted. Series remains exactly as deferred as `docs/51` left it — still zero real content. Technologies is real and clean but, in practice, Work-only today, lacking the one property that matters most for a *cross-collection* Discovery capability. **Tags is the only candidate that is schema-shared across all three collections, has real authored data in two of them, and already shows a genuine, already-authored semantic link between collections** — `concurrency`, connecting a Knowledge article to two Work case studies neither links to today. The recommended mechanism extends `/search`'s existing matching to include `tags`, rather than inventing a new route `docs/03` doesn't authorize — the same discipline `docs/51` already applied to Series, applied here to Tags. Milestone 6's "tags are not a filterable badge row" ruling is preserved exactly as written: nothing here changes how a tag renders on its own document, only what else becomes reachable once a reader searches one.
