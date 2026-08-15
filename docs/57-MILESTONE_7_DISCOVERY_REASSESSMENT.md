# 57 — Milestone 7 Discovery Reassessment: Design Proposal

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document. No route, component, schema, or content was created or modified to produce it.

Task 7.4's design-stage reassessment, following Tasks 7.1 (Real Content Migration), 7.2 (Tag Discovery), and 7.3 (Related Content), all complete and approved.

---

## 1. Objective and Final Recommendation, Stated Up Front

The final recommendation, selected from the required set (§21 gives the full reasoning):

> **F — Defer further Discovery feature work. Perform a content-authoring phase first.**

Not chosen by default, not chosen to avoid effort — chosen because every other candidate (A–E) fails the same evidence test, repeatedly, for the same underlying reason: **an 8-real-document corpus (4 Knowledge, 4 Work, 0 Engineering Log) is the actual bottleneck, and no code this task could design changes that number.** This finding recurs in every section below, not asserted once and assumed — this document treats that recurrence itself as the evidence.

---

## 2. Re-Inspection — Current Repository State, Post-Task-7.3

Verified by direct inspection this turn: `src/app/`, `src/components/`, `src/lib/content/`, `src/lib/constants/`, `content/`, `docs/`.

**Real content corpus, exact counts, not approximated:**

| Collection | Real documents | Confirmed |
|---|---:|---|
| Knowledge | 4 | `content/knowledge/*.mdx` |
| Work | 4 | `content/work/*.mdx` |
| Engineering Log | 0 | `.gitkeep` only |
| Series | 0 | `.gitkeep` only |
| Technologies (collection) | 0 | `.gitkeep` only |

**Navigation, routes — unchanged since Task 7.3**: `PRIMARY_NAVIGATION` still exactly four entries (Knowledge, Work, Engineering Log, About), re-confirmed by direct read. Route inventory unchanged: `/`, `/about`, `/engineering-log(/[slug])`, `/knowledge(/[slug])`, `/rss.xml`, `/search`, `/sitemap.xml`, `/work(/[slug])`, `/work/library`. No new route exists anywhere.

**Search — unchanged since Task 7.2**, re-confirmed by direct read of `matchesQuery()`: three fields (`title`, `description`, `tags`), case-insensitive substring, no ranking, no filter UI, no client component.

---

## 3. Current Discovery Inventory

| Mechanism | Status | Real, working today? |
|---|---|---|
| Global navigation (4 primary items) | Shipped | Yes |
| Search — title/description/tags | Shipped (Task 7.2) | Yes |
| Topic pages (`/knowledge/{topic}`) | Shipped (Task 4.2, real since Task 7.1) | Yes, for 4 of 8 topics |
| Related Case Studies (Work↔Work) | Shipped (Task 7.3) | Yes, for 1 of 4 case studies (§9) |
| Related Knowledge (Work→Knowledge, Eng.Log→Knowledge) | Shipped | Real for exactly one document (Haya) |
| Related Engineering Logs / Related Work | Shipped | Real for zero documents (0 real log entries) |
| Prerequisites / Related Concepts / Continue Learning / Same Topic (Knowledge→Knowledge) | Shipped | Real for zero documents (confirmed this turn — no real article sets `relatedContent` or `prerequisites`; every topic has exactly one article, so Same Topic never has a sibling) |
| Learning Series | Fixture-backed, `docs/51` Decision 1 unchanged | No real content |
| `/series/[slug]`, `/tags/[slug]`, `/technologies/[slug]` | Not authorized by `docs/03` | Do not exist |

---

## 4. Real Content Corpus — Full Detail

**Topics**: `TOPIC_SLUGS` has 8 values; 4 have real articles (`backend`, `architecture`, `distributed-systems`, `security`), each with **exactly one** real article. The other 4 (`system-design`, `cloud`, `performance`, `testing`) have zero.

**Tags**: 19 unique values across the 8 real Knowledge+Work documents (Engineering Log contributes none — zero entries). Real reuse within and across collections, re-confirmed: `backend` (4×, Work only), `payments` (3×), `ai` (3×), `concurrency` (3×, spanning Knowledge+Work), `correctness` (2×), `data-modeling` (2×), `go` (2×). No case or spelling drift found, re-confirmed.

**Technologies**: 20 unique values, **Work-only** — re-confirmed this turn, zero Knowledge articles set the field. Real reuse: `Redis` (3×), `Go`/`Fiber`/`PostgreSQL` (2× each), the remaining 15 values appear once each.

**Domains**: 3 unique values across 4 Work documents — `Backend Infrastructure` (2×: `vaultpay`, `cookeaze`), `AI Systems` (1×), `Platform Engineering` (1×). Work-only field, not schema-shared.

**Series**: 0 real values anywhere.

**Relationship results, exhaustively enumerated — the entire real yield of every relationship mechanism this repository has ever shipped**: one editorial link (`haya` → `how-jwt-works`, Task 6.2's `relatedContent`), one domain-adjacency pair (`vaultpay` ↔ `cookeaze`, Task 7.3). **That is the complete list.** Every other relationship type in `docs/55`'s own five-type inventory (re-confirmed unchanged) produces zero real results today.

**`featured` flags**: confirmed this turn — zero real documents, in either collection, set `featured: true`. Every "Featured"/"Start Here" surface on this site runs entirely on its newest-first fallback, never on real editorial curation.

---

## 5. Technologies (Candidate A)

`docs/51`'s decision — facet over the existing free-form field, not the empty structured collection — **still makes sense; nothing in Tasks 7.1–7.3 changes this.** Re-evaluated directly:

- 4 real Work documents use it; 0 Knowledge documents do. A technology filter would be **Work-only in practice**, confirmed unchanged.
- No existing UI surfaces `technologies` as a link or filter anywhere — only as a plain, non-linking line on `ProjectHeader` (unchanged since before Task 7.1).
- **New finding this turn, not present in `docs/53`**: two technology-adjacent words — `"go"` and (indirectly, via title) `"GoHunt"` — already function as *de facto* discovery paths through Search's existing tag-matching, because `go` happens to also be an authored tag on both `vaultpay` and `gohunt`. Searching `go` today already surfaces both Go-related projects, **without any Technologies feature existing**. This is coincidental, not designed, but it's real and it materially reduces the incremental value a Technologies facet would add for at least this one real case.
- For technology values that are *not* also tags (`PostgreSQL`, `Redis`, `Node.js`, `TypeScript`, and 13 others) — Search finds nothing today. A real gap exists, but at 4 total documents, a reader can read every case study's own technology line directly from `/work` in under a minute; a filter control's UX value over that baseline is marginal at this scale.
- **Whether the Work-only limitation is acceptable**: yes, if built — it would match reality rather than pretend a facet spans collections it doesn't. But "acceptable if built" is not the same as "currently justified" (§16's own required distinction).

**Assessment: real, clean data; legitimate future capability; not currently justified by corpus size or by the marginal gap over already-real Search behavior.**

---

## 6. Filtering (Candidate B)

Richer Search filtering (collection/topic/tag/technology/domain checkboxes or query params) was evaluated against `docs/53`'s own explicit caution: *"do not assume more controls means better UX."*

- Current max result set for any real query is 8 documents across 3 groups — already small enough to scan without narrowing.
- A collection-only filter (Journey F, §15) is the one concretely missing capability, but at ≤4 documents per collection, "narrowing" saves at most a few lines of scrolling.
- Building filter UI now would duplicate two things that already exist and already work: topic pages (already a real "narrow Knowledge by domain" mechanism) and domain-adjacency (already a real "narrow Work by domain" mechanism) — a filtering UI layered on top of `/search` would be a third way to ask a question two routes already answer.
- Server/client implications: any interactive filter (checkboxes that update results without a full page reload) would need a client boundary `docs/24` Principle 5 has no browser-API justification for yet — a GET-param-only filter avoids this, but still adds UI surface for a corpus this small.

**Assessment: not currently justified — the two real filtering needs (by topic, by domain) already have dedicated, working, real-data-backed pages; a general filter UI would be new surface area solving a problem existing pages already solve, at a scale where solving it isn't yet necessary.**

---

## 7. Series (Candidate C)

Verified: nothing has changed. Zero real content (§4), no `/series/[slug]` authorization in `docs/03` (re-confirmed absent), `docs/51` Decision 1 unmodified. **Remains deferred, exactly as before** — not because the architecture is unready (it isn't; `series`/`seriesOrder` and their resolvers are real and dormant, ready the moment real content exists) but because there is nothing real to discover.

---

## 8. Reading Paths (Candidate D)

Verified: nothing has changed since `docs/51`'s own deferral. `docs/11`'s conceptual definition still overlaps with Series' own definition in the same document (both "ordered/curated sequence... guided learning path"); no schema, no content, no route, no new distinguishing evidence has appeared. **Remains deferred under the No Invention Rule** — this document does not attempt a model.

---

## 9. Related Content Expansion (Candidate E)

Task 7.3's real yield, re-confirmed by direct testing this turn: **exactly one pair** (`vaultpay` ↔ `cookeaze`) — the two Backend Infrastructure case studies. `gohunt` and `haya` each show no Related Case Studies region, honestly, because neither shares a domain with any other real case study. Knowledge relationships (Prerequisites, Related Concepts, Continue Learning, Same Topic) produce zero real results (§4). Engineering Log relationships produce zero real results (zero real entries).

Expanding Related Content further has no evidenced next step that doesn't require either (a) new schema (out of scope, and `docs/51`/`docs/55` both already reasoned through why a new field isn't justified yet) or (b) inferred similarity (explicitly ruled out, `docs/24` Principle 8, this task's own guardrails). **This document does not recommend a generic recommendation engine, and finds no smaller evidenced expansion available either** — the domain-adjacency mechanism Task 7.3 shipped is already the smallest real extension this content model supports; there is no next-smallest one waiting to be built, only more content waiting to be authored into the mechanisms that already exist.

---

## 10. Tags (Candidate, Re-Evaluated)

Task 7.2's extension is working exactly as designed (Task 7.3's own report re-confirmed zero regression). Re-evaluated for further work:

- 19 unique tags, real cross-collection usage (`concurrency`), confirmed unchanged.
- `/tags/[slug]` remains unauthorized by `docs/03` — the same gap `docs/53` already found and deliberately routed around via Search extension rather than a new route. **Not reversed here** — no new evidence changes this.
- Does `?q=<tag>` already provide sufficient discovery? At 19 tags and 8 documents, yes — a reader who knows a tag types it; there's no meaningful browsing need (e.g., "show me all tags") that a corpus this size creates friction around. A tag-browsing/cloud UI would be solving a problem that doesn't exist yet at this scale.

**Assessment: no additional Tag work is justified. The existing capability already matches the corpus.**

---

## 11. Topics (Candidate, Re-Evaluated)

Topics already have the most mature Discovery infrastructure in this repository — real routes, real filtering (structurally, via the route), real per-topic counts (since Task 7.1). Re-evaluated:

- Is topic discovery sufficient? Yes, for what exists — but 4 of 8 topics have zero real articles, and the 4 that do have exactly one each. This isn't a Topics *feature* gap — the browsing mechanism works correctly and honestly (real "0 Articles" states, confirmed live during Task 7.1's own verification); it's a *content* gap.
- Would Search/filtering duplicate topic pages? Yes, precisely the concern §6 already raised — building a topic filter on `/search` would re-solve what `/knowledge/{topic}` already solves.

**Assessment: Topics should remain untouched. Not because it's finished — because the next unit of value here is a second real article in any one topic, not new code.**

---

## 12. Discovery Value Matrix

| Candidate | Real Data | Cross-Collection | User Value (today) | Architecture Ready | UX Complexity | New Schema? | New Route? | Recommendation |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Technologies | Yes (Work only, 20 values) | No | Low–Medium | Yes | Low (facet only) | No | No | Defer |
| Filtering | Yes (all existing fields) | Partially | Low | Partially (server-only GET filters feasible) | Medium | No | No | Defer |
| Series | **No** | N/A | None | Yes (dormant) | N/A | No | No (unauthorized) | Defer — blocked on content |
| Reading Paths | **No** | N/A | None | **No** (undefined) | N/A | Unknown | Unknown | Defer — blocked on definition |
| Related Content expansion | Yes (2 real instances total) | Yes (mechanism), No (results) | Low | Partial (no evidenced next step) | Low if built, but nothing left to build without new data/inference | No further option without one | No | Defer |
| Content-authoring/review phase | N/A | N/A | **High** | N/A | N/A | No | No | **Recommended** |

Every rating above traces to a specific number or fact in §2–§4, not an impression.

---

## 13. Dependencies

```text
Real content volume (more articles per topic, more case studies per domain,
real Engineering Log entries, authored relatedContent/prerequisites/
engineeringLog cross-links, at least one real featured: true)
        │
        ├──▶ Same Topic fallback ever showing real results
        ├──▶ Related Concepts / Prerequisites ever showing real results
        ├──▶ Related Case Studies growing beyond its one current pair
        ├──▶ Related Work / Related Knowledge (Eng. Log direction) activating at all
        ├──▶ Featured sections showing curated, not fallback, picks
        └──▶ A Technologies or Filtering feature having enough documents
             to be worth a UI, rather than a direct-read alternative

Series content authored
        │
        ▼
Series discovery (in-page section, per docs/51 Decision 1 — not a route)

Reading Path concept defined (product decision, not evidenced here)
        │
        ▼
Reading Path implementation
```

**Not manufactured**: every arrow above traces to a mechanism this document confirmed is real, dormant, and already coded — waiting on content, not on a future implementation task. No dependency here requires new architecture.

---

## 14. Current UX Gap

> What can a reader still not easily find that they reasonably should be able to find?

Tested directly (§15). The honest answer: **nothing that a code feature would fix.** The two incompletely-served journeys (D: explore a series; F: narrow search to one collection) are each traced to their real cause — D is blocked entirely on missing content (the mechanism is real and dormant), and F is a low-value gap at the current result-set size (≤8 documents, already grouped and readable in full). Every other journey already works, end-to-end, on real data, through mechanisms this milestone has already shipped.

---

## 15. User Journeys

| Journey | Current path | Works? | Friction | Would a new feature help? |
|---|---|---|---|---|
| A: "articles about concurrency" | `/search?q=concurrency` | **Yes** | None — real, cross-collection, verified (Task 7.2) | No |
| B: "projects involving Go" | `/search?q=go` | **Yes**, in this specific corpus — both real Go projects also carry `"go"` as a tag | None observed today; would break if a future Go project omitted the tag | A Technologies facet would make this robust rather than coincidental — the strongest single argument for Candidate A, noted but not enough alone to override §5's corpus-size finding |
| C: "reading VaultPay, want similar/connected projects" | `/work/vaultpay` → Related Case Studies | **Yes** | None — real, verified (Task 7.3) | No |
| D: "explore a series of related articles" | None — Learning Series is fixture-backed | **No** | Real gap | No — content-blocked, not feature-blocked (§7) |
| E: "don't know title, know a topic/tag" | `/knowledge/{topic}` or `/search?q=<tag>` | **Yes**, two independent real paths | None | No |
| F: "narrow a broad search to Work only" | None | **No** | Small — max 4 Work results today | Marginal value at current scale (§6) |

Four of six journeys already work end-to-end on real data. The two that don't are each explained, not hand-waved: one is a content dependency, one is a low-value gap at this scale.

---

## 16. Roadmap Deliverable vs. Currently Justified Capability

`docs/12` lists Filtering, Tags, Technologies, Series, Reading Paths, Related Content as Milestone 7 deliverables — a list of *possible* capabilities the roadmap anticipated might be needed, not a checklist requiring every item regardless of whether the content model justifies it yet. This document's own recurring finding — every candidate's real limiting factor is corpus size, not missing code — is exactly the evidence `docs/12`'s own list can't provide by itself. **A roadmap deliverable becomes a justified product capability when real data supports it; three of six roadmap items (Tags, Related Content, the real-content foundation itself) already crossed that line and shipped (Tasks 7.1–7.3); the other three (Filtering, Technologies, Series/Reading Paths) have not, for reasons specific to each, stated individually above rather than inferred from the roadmap's mere mention of them.**

---

## 17. No Invention Rule — Compliance Statement

No fake Series, Reading Paths, Technology metadata, relationship content, synthetic taxonomy values, or placeholder discovery cards were created or proposed anywhere in this document. Every number in §2–§4 traces to a direct `grep`/read of real repository content, performed this turn. Where content is missing, the dependency is named (§13), not filled.

---

## 18. Architectural Principles — Preserved

Every principle this task's own §18 lists is upheld by the recommendation itself: real content stays the source of truth (recommending *more* real content is the most direct possible application of this principle); no inferred similarity is proposed anywhere; no new schema is proposed; no new route is proposed; Server Components / thin routes / no unnecessary client state are unaffected because nothing is built. Single Source of Truth is reinforced, not tested, by this document's own refusal to invent a sixth data source when the existing five are underused.

---

## 19. Performance / Scale

8 real documents, growing slowly. The current in-memory, server-side filter/resolve architecture (`Array.filter()`/`Array.some()` over a full collection read per request) remains completely appropriate — **explicitly stated, not left implicit**: no indexing system, no search library, no caching layer is remotely justified at this scale, and building one now would be exactly the premature-abstraction risk `docs/24` Principle 2 and this task's own §18 warn against. This conclusion would not change even if every deferred candidate in this document were built — none of them individually or together approach a scale where linear scans stop being the right architecture.

---

## 20. SEO / IA

No candidate this document evaluates would introduce a new public route, canonical URL, sitemap entry, indexable page, or navigation change — because none is recommended for implementation. The existing IA boundaries (`docs/03` silent on `/series/*`, `/tags/*`, `/technologies/*`; `/search` itself `noindex`) are reconfirmed unchanged and are not proposed to be crossed by anything in this document.

---

## 21. Recommended Next Task

**F — a content-authoring phase, not a new Discovery feature.**

1. **Highest current user value**: every one of the four journeys that already work does so because real content backs them; the two that don't are blocked on content, not capability. More content directly improves Discovery; more Discovery code, at this corpus size, does not.
2. **Real content supports it**: this is the recommendation *about* real content — it doesn't need real content to justify itself the way a taxonomy feature would.
3. **Architecture supports it**: every dormant mechanism (§13) is already built, tested (by construction, via Tasks 7.1–7.3's own verification passes), and will activate the moment real content exists — no code changes are a prerequisite.
4. **What it unlocks**: Same Topic fallback, Prerequisites, Related Concepts, Continue Learning, Related Case Studies growing past one pair, Related Work/Knowledge in the Engineering Log direction, curated (not fallback-only) Featured sections — seven real, already-shipped mechanisms currently showing nothing, or showing the bare minimum, purely for lack of content.
5. **What it does NOT require**: no schema change, no new route, no new component, no new resolver — every mechanism it activates already exists.
6. **Why before the other candidates**: A–E each individually depend on the same missing ingredient (more real documents, more cross-links) to be worth building or to be worth using once built; building any of them now would be optimizing a UI layer on top of a data layer that isn't ready to be optimized around yet.
7. **What should remain deferred**: Technologies (A) — real but marginal at 4 documents; Filtering (B) — would duplicate Topics/Domain adjacency at this scale; Series (C) — zero content; Reading Paths (D) — undefined; Related Content expansion (E) — no evidenced next mechanism without new schema or inference.

**Concretely, what a content-authoring phase means** (not this document's to schedule or perform, since it's editorial, not architectural): author 1–2 more real Knowledge articles in at least one existing topic (activates Same Topic fallback); author `relatedContent`/`prerequisites` cross-links on real Knowledge articles; author at least one real Engineering Log entry (activates an entire collection's worth of dormant relationships and Previous/Next); author one more real case study in an existing domain, or set `featured: true` on a real document to activate genuine editorial curation instead of fallback-only behavior.

---

## 22. Deferred Capabilities

Technologies (A), Filtering (B), Series (C), Reading Paths (D), Related Content expansion (E) — each deferred with its own specific, stated reason in §5–§9, not a blanket "not now."

---

## 23. Open Questions

**Q1 — Who owns the content-authoring phase, and on what timeline?** This document identifies the need; it has no authority to schedule editorial work.

**Q2 — Once real content grows, which candidate should be re-evaluated first?** Based on this document's own evidence, likely Technologies (Journey B's real, if coincidental, near-miss) or Series (if series content is authored specifically) — but this is exactly the kind of judgment this document declines to make in advance of the data that would justify it, consistent with its own §16 discipline.

**Q3 — Should `featured: true` be set on any real document now, independent of a broader content phase?** A small, immediate, zero-risk editorial action (no schema, no code) that would activate real curation on Start Here and Featured Case Studies today — named here as a low-effort, high-leverage first step, not decided or performed by this document.

---

## 24. Confirmation

No production code, route, component, schema, or content was modified to produce this document. All figures in §2–§4 were gathered by direct inspection of the live repository this turn.

---

## Summary

Three tasks into Milestone 7, the pattern is now consistent enough to be the finding itself, not a coincidence: Task 7.1 found four of five relationship types were real but empty; Task 7.2 found tag data was clean but the corpus tiny; Task 7.3 shipped a real mechanism that yielded exactly one pair. This document's own fresh re-inspection adds one more data point in the same direction — zero real `featured` flags, zero real `prerequisites`/`relatedContent` on any Knowledge article, four of eight topics still empty — and concludes what that pattern has been pointing to all along: **the next unit of Discovery value in this repository is a document, not a feature.** Five candidates (Technologies, Filtering, Series, Reading Paths, Related Content expansion) are each deferred with their own specific, evidenced reason, not a shared excuse. Four of six tested user journeys already work end-to-end on real data through mechanisms this milestone already shipped; the two that don't are traced to their real cause rather than treated as a reason to build something new. No production code, route, component, schema, or content was modified to produce this document.
