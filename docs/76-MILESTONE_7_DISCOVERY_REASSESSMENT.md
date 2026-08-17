# 76 — Milestone 7 Discovery: Post-Transactional-Outbox Reassessment

## Status

Reassessment — design/editorial only, no implementation authorized.

> No production code, content, route, schema, component, navigation, Search, RSS, Sitemap, or configuration file was created or modified to produce this document.

Task 7.24's reassessment turn, following Task 7.23's authoring of `transactional-outbox.mdx` and the companion `vaultpay.mdx` metadata edit. `docs/72`'s conclusions are not carried forward unchecked — every figure below is re-derived from the live repository this turn, including a full re-read of all four Work case studies' "Engineering Decisions" sections (not just their frontmatter), which surfaces findings no prior Milestone 7 document reported.

---

## 1. Executive Recommendation

**A — Implement a Discovery feature now: the Knowledge → Work reverse relationship ("Applied In These Case Studies").**

This is a break from every prior reassessment in this series (`docs/57`, `66`, `69`, `72`), each of which correctly chose continued content authoring. Two independent things changed this round that none of those documents had evidence for:

1. **`docs/58` §20's own quantitative "Related Content expansion" threshold — 3+ real cross-collection `relatedContent` links beyond the 4 Phase A produced — is now crossed for the first time.** Current cross-collection links (Work→Knowledge + Engineering Log→Knowledge) total 8, a delta of +4 against the 4-link baseline (§12, §20).
2. **Every one of the repository's 7 real Knowledge articles now has at least one real, authored inbound Work→Knowledge edge** — 100% coverage, a fact that was not true at any previous reassessment (§3, §13). The reverse direction — a Knowledge article showing which real case study applies it — has no rendering path anywhere today; `DocumentLayout`'s Knowledge route only ever passes `relatedLearning`, which is entirely Knowledge-internal (§12).

The feature this justifies is narrow, cheap, and follows an exact precedent already proven twice in this codebase (`resolveRelatedWorkForLog()`'s reverse lookup, `RelatedWork`'s dedicated slot) — no schema change, no new route, no new content. It is not a generic relationship engine and not similarity-based (§12, §16).

Content authoring is not stalled by this recommendation — §17/§19 identify **A5 (Bounded Concurrency)** as a strong, newly-unblocked next article, to follow this feature or proceed in parallel, since the two have no dependency on each other.

**Conclusion: RECOMMENDATION CHANGED — a Discovery feature, not another content round, is the best-evidenced next step.**

---

## 2. Authoritative Documents — Read in Full

Read in full this turn: `docs/75`, `74`, `73`, `72`, `69`, `66`, `65`, `63`, `61`, `59`, `57`, `55`, `53`, `51`, `50`. Cross-referenced against `docs/58` §20 (the source of every reconsideration threshold cited below) and `docs/03`/`docs/51`/`docs/53` for the Tags IA-authorization boundary. Also directly inspected: `content/knowledge/*.mdx` (7 files), `content/work/*.mdx` (4 files), `content/engineering-log/*.mdx` (2 files), `src/lib/content/schema.ts`, `relationships.ts`, `case-study-relationships.ts`, `engineering-logs.ts`, `search.ts`, `rss.ts`, `src/app/sitemap.ts`, `src/components/content/document-layout.tsx`, `src/app/knowledge/[slug]/page.tsx`, and — critically — every `### Decision:` heading in all four Work case studies' bodies, not just their frontmatter or previously-quoted excerpts.

---

## 3. Current Corpus Snapshot — Verified Directly, Not Assumed

### Knowledge — 7 real articles

| Slug | Topic | Tags | Technologies | Featured | `relatedContent` | `publishedAt` | Difficulty |
|---|---|---|---|---|---|---|---|
| `append-only-ledger` | architecture | ledger, data-modeling, correctness, payments | — | false | `money-floating-point`, `idempotency` | 2026-08-16 | advanced |
| `data-transfer-objects` | architecture | api-design, data-modeling, architecture | — | false | — | 2026-08-12 | intermediate |
| `how-jwt-works` | security | jwt, authentication, tokens | — | true | — | 2026-08-07 | beginner |
| `idempotency` | distributed-systems | idempotency, correctness, concurrency, payments | — | false | `optimistic-vs-pessimistic-locking` | 2026-08-16 | intermediate |
| `money-floating-point` | backend | floating-point, money, data-modeling, correctness | — | true | — | 2026-08-12 | beginner |
| `optimistic-vs-pessimistic-locking` | distributed-systems | concurrency, databases, locking, correctness | — | false | — | 2026-08-12 | intermediate |
| `transactional-outbox` | distributed-systems | outbox, reliability, correctness, payments | — | false | `idempotency`, `append-only-ledger` | 2026-08-16 | intermediate |

### Work — 4 real case studies

| Slug | Domain | Tags | Technologies | `relatedContent` (→ Knowledge) | `engineeringLog` | Featured |
|---|---|---|---|---|---|---|
| `cookeaze` | Backend Infrastructure | backend, payments, django, ai | 7 values | `idempotency` | `cookeaze-webhook-reliability-gap` | false |
| `gohunt` | AI Systems | backend, go, ai, job-search | 6 values | `data-transfer-objects` | — | true |
| `haya` | Platform Engineering | backend, ai, concurrency, payments, platform | 8 values | `how-jwt-works` | `haya-invitation-gate-removal` | false |
| `vaultpay` | Backend Infrastructure | backend, concurrency, payments, go | 4 values | `optimistic-vs-pessimistic-locking`, `money-floating-point`, `append-only-ledger`, `transactional-outbox` | — | true |

### Engineering Log — 2 real entries

| Slug | Tags | Related Work | Related Knowledge | `publishedAt` |
|---|---|---|---|---|
| `cookeaze-webhook-reliability-gap` (E4) | payments, webhooks, reliability | `cookeaze` (reverse) | `idempotency` | 2024-12-03 |
| `haya-invitation-gate-removal` (E3) | platform, access-control | `haya` (reverse) | — | 2025-10-08 |

**Confirmed exact totals, re-verified by direct `ls`/frontmatter read, not assumed**: 7 Knowledge, 4 Work, 2 Engineering Log, **13 total real documents** — matches the stated expected baseline exactly.

---

## 4. Relationship Graph — Full Current Inventory

| Type | Edge(s) | Authored or resolver-derived? |
|---|---|---|
| Knowledge → Knowledge | `append-only-ledger` → `money-floating-point`, `idempotency` | Authored |
| Knowledge → Knowledge | `idempotency` → `optimistic-vs-pessimistic-locking` | Authored |
| Knowledge → Knowledge | `transactional-outbox` → `idempotency`, `append-only-ledger` | Authored (new, Task 7.23) |
| Same-Topic fallback | `data-transfer-objects` → `append-only-ledger` | Resolver-derived |
| Same-Topic fallback | `optimistic-vs-pessimistic-locking` → `idempotency`, `transactional-outbox` | Resolver-derived (now **2 cards** — the first two-card fallback group ever produced) |
| Work → Knowledge | `vaultpay` → `optimistic-vs-pessimistic-locking`, `money-floating-point`, `append-only-ledger`, `transactional-outbox` (4 edges) | Authored |
| Work → Knowledge | `gohunt` → `data-transfer-objects` | Authored |
| Work → Knowledge | `haya` → `how-jwt-works` | Authored |
| Work → Knowledge | `cookeaze` → `idempotency` | Authored (Task 7.19) |
| Work → Engineering Log | `cookeaze` → E4, `haya` → E3 | Authored |
| Engineering Log → Work | E4 → `cookeaze`, E3 → `haya` | Resolver-derived (reverse of the same field) |
| Engineering Log → Knowledge | E4 → `idempotency` | Authored |
| Work ↔ Work | `vaultpay` ↔ `cookeaze` (Backend Infrastructure) | Resolver-derived (domain adjacency) |
| Knowledge → Work | **None** | **Does not exist — no resolver, no UI slot (§12)** |

**Authored vs. resolver-derived, counted precisely**: 5 authored Knowledge→Knowledge edges (up from 3 in `docs/72`), 2 Same-Topic fallback groups (unchanged in count, but one group grew from 1 card to 2), 7 authored Work→Knowledge edges (up from 5), 2 Work↔Engineering-Log authored pairs (unchanged), 2 resolver-derived reverse Engineering-Log↔Work views (unchanged), 1 authored Engineering-Log→Knowledge edge (unchanged), 1 resolver-derived Work↔Work pair (unchanged).

**Total directional edges, counted the same way `docs/72` §8 counted them**: 20 (up from 16) — every one connects two real, independently navigable pages; none is a self-loop or dangling reference.

**Strongest cluster**: `distributed-systems` — `idempotency` ↔ `optimistic-vs-pessimistic-locking` ↔ `transactional-outbox`, all three cross-linked or fallback-linked, plus `vaultpay`/`cookeaze` both feeding it from Work. **Under-connected documents**: `how-jwt-works` and `money-floating-point` — each has exactly one inbound Work edge and zero Knowledge-internal relationships (no `relatedContent` authored on either, no sibling in their own topic to fall back to, since each remains the sole article in `security`/`backend` respectively). **Obvious relationship supported by content but not yet authored**: none remaining at the Knowledge↔Knowledge or Work↔Knowledge layer (`docs/72`'s own named gap, `cookeaze` → `idempotency`, is now closed) — the one real, still-unauthored-and-unbuildable-without-code gap is the reverse direction itself (§12).

---

## 5. The Seven Discovery Journeys — Re-Run Against Current Content

| # | Journey | Path | Works on real data? | Real examples exercising it | Changed since `docs/72`? |
|---|---|---|---|---|---|
| 1 | Find by Topic | `/knowledge/[topic]` | **Yes** — verified for all 8 topic pages | `distributed-systems` (3), `architecture` (2), `backend`/`security` (1 each), 4 topics at 0 | `distributed-systems` grew 2→3, the repository's first three-article topic |
| 2 | Find by Tag | `/search?q=<tag>` | **Yes** | `payments` now returns 7 real documents across all 3 collections (was 6) | Deepened; `reliability` newly spans Knowledge+Engineering Log (was Engineering-Log-only) |
| 3 | Find Related Concepts | Related Concepts region on Knowledge articles | **Yes** | 5 authored edges, live-rendering on `append-only-ledger`, `idempotency`, `transactional-outbox` | New: `transactional-outbox`'s own page shows 2 real Related Concepts on arrival |
| 4 | Find an Engineering Story | `/engineering-log` → E3/E4 | **Yes**, unchanged | 2 real entries | Unaffected |
| 5 | Engineering Story → Knowledge | E4 → `idempotency` | **Yes**, unchanged | Still exactly 1 instance — the single weakest journey in the set | Unaffected — E3 still has no Knowledge-side link |
| 6 | Work → Knowledge | Related Knowledge region on Work pages | **Yes** | All 4 Work documents now have ≥1 real edge (`vaultpay` has 4) | `vaultpay` gained a 4th card |
| 7 | Same-Topic movement / chronology | Same-Topic fallback + Previous/Next | **Yes** | 2 fallback groups (1-card and, newly, 2-card); 5 of 7 Knowledge articles now have a real Previous/Next neighbor (up from 4/6) | `optimistic-vs-pessimistic-locking` gained a real "Next" for the first time in the repository's history |

**No journey is claimed to work merely because the code exists** — each row above was checked against the actual current frontmatter and resolver logic, not inherited from a prior document's claim. **Journeys 1, 3, and 7 are the ones materially strengthened this round**; Journeys 2, 4, 6 deepened incrementally; **Journey 5 remains the weakest** in the set, unchanged and unaddressed by this or any recent round.

---

## 6. Knowledge Topic Density

| Topic | Article count | Slugs | Same-Topic active? | Previous/Next active? | Discovery value now |
|---|---:|---|---|---|---|
| `distributed-systems` | **3** | `idempotency`, `optimistic-vs-pessimistic-locking`, `transactional-outbox` | Yes — `optimistic-vs-pessimistic-locking` shows a real 2-card fallback group | Yes — full 3-article chain: `idempotency` → `optimistic-vs-pessimistic-locking` → `transactional-outbox` | **Meaningful** — the repository's first topic where a reader can browse a real, connected 3-article neighborhood |
| `architecture` | 2 | `data-transfer-objects`, `append-only-ledger` | Yes — `data-transfer-objects` shows a real 1-card fallback group | Yes — one real pair | Meaningful, unchanged since `docs/72` |
| `backend` | 1 | `money-floating-point` | No — no sibling | No | Honest single-article state |
| `security` | 1 | `how-jwt-works` | No | No | Honest single-article state |
| `system-design` / `cloud` / `performance` / `testing` | 0 | — | N/A | N/A | Honest "0 Articles" state, unchanged since Task 7.1 |

**Growth changes the threshold picture in one concrete way**: `distributed-systems` reaching 3 real articles is the first time any topic's Same-Topic fallback group has rendered more than one card, live-verified against the frontmatter and resolver logic in §4. This is evidence the *existing* mechanism scales correctly to a real 3-sibling group without any code change — not evidence a *different* mechanism (pagination, sorting, filtering within a topic) is now needed. No topic is remotely close to a size where the current flat list would stop being scannable.

---

## 7. Same-Topic / Previous-Next — Real Yield, Not Resolver-Trust

**Authored `relatedContent`** (5 Knowledge articles have it, populated): `append-only-ledger`, `idempotency`, `transactional-outbox`. Two Knowledge articles have none authored: `data-transfer-objects`, `optimistic-vs-pessimistic-locking`, `how-jwt-works`, `money-floating-point` — of these, the two with a topic sibling (`data-transfer-objects`, `optimistic-vs-pessimistic-locking`) receive Same-Topic fallback; the two without one (`how-jwt-works`, `money-floating-point`) receive neither Related Concepts nor Same-Topic, honestly.

**Previous/Next, traced precisely**: within `distributed-systems`, alphabetical-by-title order is `idempotency` → `optimistic-vs-pessimistic-locking` → `transactional-outbox`. `optimistic-vs-pessimistic-locking` — left completely untouched by Task 7.23's own file changes — gained a real "Next" (`transactional-outbox`) purely as a live consequence of the new article's arrival, exactly as `docs/75` §9 predicted before authoring. This is the first Knowledge article in the repository's history to have both a real Previous and a real Next simultaneously.

**Real user-visible yield, measured, not assumed**: 5 of 7 Knowledge articles (71%) now surface at least one Previous/Next neighbor, up from 4 of 6 (67%) at `docs/72`. Two full topic neighborhoods (`architecture`, `distributed-systems`) now support genuine "keep reading in this area" navigation; `distributed-systems`'s is now a real 3-stop chain, not just a pair.

**Is this now genuinely useful, or still a thin fallback?** Genuinely useful for the two multi-article topics — a reader landing on any of the 5 connected articles has a real next stop. Still honestly empty for `backend`/`security`, which is correct behavior, not a gap to paper over.

---

## 8. Tag Taxonomy Reassessment

**25 unique tag values** (up from 24; `outbox` is the one new value). Cross-collection tags, re-derived by direct count:

| Tag | Collections | Documents | Notable change |
|---|---|---:|---|
| `payments` | Knowledge, Work, Engineering Log (all 3) | 7 | Up from 6 |
| `reliability` | Knowledge, Engineering Log (2, was 1) | 2 | **New** — first time this tag spans collections, direct consequence of `transactional-outbox`'s own tagging |
| `concurrency` | Knowledge, Work (2) | 4 | Unchanged |
| `platform` | Work, Engineering Log (2) | 2 | Unchanged |
| `correctness` | Knowledge only | 5 | Deepened (was 4) — the largest single-collection cluster |
| `backend` | Work only | 4 | Unchanged |

**Formatting**: still clean — no case, pluralization, or synonym drift found across any of the 25 values, re-checked directly.

**Is tag Search still sufficient at this scale?** Yes — `/search?q=payments` returns a single, immediately scannable, correctly-grouped 7-document result. No group anywhere near the ~10-item threshold that would motivate a different presentation (§9).

**Is a dedicated tag browsing/faceted route now justified?** No. `docs/03`'s URL Structure still does not list `/tags/*` anywhere, and no evidence produced this turn changes that — this is a documentation-authorization gate (`docs/51` Decision 1's own precedent, reaffirmed by `docs/53` §"Option A"), not a corpus-size question. It is not reopened here.

---

## 9. Technologies

**Current real values**: 20 unique, exclusively on Work documents, unchanged in count and unchanged in collection scope since `docs/72`. Zero of the 7 Knowledge articles populate `technologies` — `transactional-outbox` explicitly declined to name RabbitMQ (`docs/74` §14), the fourth consecutive Knowledge article to make the identical call.

**Threshold** (`docs/58` §20): *"reconsider once at least 2 Knowledge articles also populate `technologies`"* — currently 0. **Not crossed.**

**Concrete unmet need check**: a reader searching `go` still finds both real Go-tagged/Go-technology projects (`vaultpay`, `gohunt`) via existing tag matching; nothing found this turn that Search/Topics/Tags/Work's own `ProjectHeader` line fails to answer already. **Recommendation: remains deferred, unchanged. Not reopened merely because the field exists.**

---

## 10. Filtering

**Corpus size**: 13 total real documents (up from 12); largest single collection (Knowledge) is 7.

**Threshold** (`docs/58` §20): *"any single Search result group regularly exceeds ~10 items, or total real document count exceeds ~20–25."* Largest real Search result group observed this turn (`payments`, §8) is 7. Total corpus is roughly half the threshold's lower bound. **Not crossed, not close.**

**Do Topics/Tags/Domain/Search already solve the problem?** Yes — every real narrowing need demonstrated this turn (by topic, by tag, by domain) is already served by existing, unmodified infrastructure. **Recommendation: remains deferred. Not implemented.**

---

## 11. Series

**Current real `series`/`seriesOrder` values**: zero, across all 13 real documents, re-confirmed by direct grep this turn. No two documents share a series value — there is nothing to share.

**Threshold** (`docs/58` §20): *"any 2+ real Knowledge articles share a `series`/`seriesOrder` value"* — not met, mechanically. **Not crossed.**

**One fact worth naming precisely, without acting on it**: `docs/58` §6 identified the strongest *candidate future* Series sequence as `money-floating-point` → `optimistic-vs-pessimistic-locking` → (A3, Idempotency) → (A4, Ledger design) → `vaultpay`/`cookeaze`, explicitly noting *"two of its five steps don't exist yet"* as the reason it wasn't proposed then. **Both of those steps now exist** (`idempotency`, `append-only-ledger`) — the narrative precondition `docs/58` itself named is now satisfied for the first time. This does not cross the mechanical threshold above (no `series` field has been authored on any file, and this document does not author one), and it is explicitly **not** a recommendation to create Series metadata. It is named here so a future task doesn't have to re-derive it: if Series is ever revisited, this is the sequence with real, already-published support, not a hypothetical one.

**Recommendation: remains deferred, unchanged. No Series metadata created by this document.**

---

## 12. Reading Paths

**Distinguished explicitly, per this task's own instruction**: insufficient content is a gap more authoring resolves; an undefined product concept is not.

**Does the current corpus have more relationship density, more multi-article topics, and more relatedContent than at `docs/72`'s writing?** Yes, materially (§4, §6). **Does that resolve Reading Paths' own blocker?** No. `docs/51` Decision 3's finding — Series and Reading Paths are not clearly distinguished from each other in `docs/11`'s own definitions — is a definitional gap, not a content gap, and nothing produced by Task 7.23 (a single-document Knowledge addition plus one metadata edit) touches that question. The candidate five-step sequence named in §11 is *closer* to a real Reading Path than to a Series in one respect (it would cross from Knowledge into a Work case study, which a Series — a single-collection container per `docs/11`'s Series Model — cannot do), but per this task's own explicit instruction, **a Reading Path requires an intentional, authored sequence, not an inferred one** — and no such intentional editorial sequence exists today; the ordering above is this document's own retrospective observation, not an authored artifact.

**Recommendation: remains deferred, for the unchanged reason. No Reading Path implemented or authored.**

---

## 13. Related Content Expansion — The Central Finding of This Reassessment

**Current real relationships**: 20 directional edges (§4), up from 16 in `docs/72`. Every relationship type already implemented produces real results wherever real content exists to resolve against; none is orphaned.

**Threshold** (`docs/58` §20): *"reconsider once either a second domain reaches 2+ real case studies (beyond Backend Infrastructure's current pair) or 3+ real cross-collection `relatedContent` links exist (beyond the 4 [Phase A] would produce)."*

- **First condition (second domain)**: AI Systems = 1 case study (`gohunt`), Platform Engineering = 1 (`haya`), Backend Infrastructure remains the only domain at 2 (`cookeaze`, `vaultpay`). **Not met.**
- **Second condition (cross-collection `relatedContent` links)**: current Work→Knowledge edges = 7 (`vaultpay` 4, `gohunt` 1, `haya` 1, `cookeaze` 1); Engineering-Log→Knowledge edges = 1 (E4 → `idempotency`). **Total = 8.** Baseline established by Phase A = 4. **Delta = +4, which is ≥ the stated +3. Met — for the first time in this milestone's history.**

This is computed by the identical method `docs/72` §13 itself used (which found the delta at +2 and correctly called it "not crossed"): the two additions since then — `cookeaze` → `idempotency` (Task 7.19) and `vaultpay` → `transactional-outbox` (Task 7.23) — are exactly the +2 that close the remaining gap.

**What does "reconsider" mean concretely here, re-derived from the actual current relationship graph, not asserted?** A full re-inspection of every real Work→Knowledge edge (§3, §4) surfaces a fact no prior Milestone 7 document reported: **all 7 real Knowledge articles now have at least one real, authored inbound Work→Knowledge edge — 100% coverage.**

| Knowledge article | Inbound Work edge |
|---|---|
| `optimistic-vs-pessimistic-locking` | `vaultpay` |
| `money-floating-point` | `vaultpay` |
| `append-only-ledger` | `vaultpay` |
| `transactional-outbox` | `vaultpay` |
| `data-transfer-objects` | `gohunt` |
| `how-jwt-works` | `haya` |
| `idempotency` | `cookeaze` |

**This relationship has no reverse rendering path anywhere in the codebase today.** `document-layout.tsx`'s own docstring and prop list (re-read this turn) confirm the Knowledge route passes exactly one relationship-shaped prop, `relatedLearning` — Prerequisites, Continue Learning, Related Concepts, and Same-Topic, all Knowledge-internal. There is no `relatedWork`-equivalent slot for Knowledge the way one already exists for Engineering Log (`relatedWork`, Task 6.2) and for Work (`relatedCaseStudies`, Task 7.3). A reader on `/knowledge/append-only-ledger`, `/knowledge/optimistic-vs-pessimistic-locking`, `/knowledge/transactional-outbox`, or `/knowledge/money-floating-point` — four of the seven real articles — currently has **no path back to VaultPay**, despite VaultPay's own page linking forward to all four.

**Cost, precedent, and honesty about scope**: this is not a proposal for a generic `RelatedContent` component or a similarity/embedding engine (`docs/24` Principle 8, unchanged). It is the exact reverse-lookup shape `resolveRelatedWorkForLog()` (`engineering-logs.ts`) already implements for Engineering Log → Work ("which Case Study or Case Studies name *me* in their own array") — the same function shape, applied to `getAllCaseStudies()`'s `relatedContent` field instead of its `engineeringLog` field, resolved from a Knowledge article instead of a log entry. No schema change: `workFrontmatterSchema`'s `relatedContent` already exists and is already populated. The one new piece is a `DocumentLayout` slot and its own dedicated, landmarked `Section` — the identical addition already made twice for `relatedWork` and `relatedCaseStudies`, each time without disturbing any other slot.

**This is the recommended feature (§21).** It is not proposed as a generic relationship type or a ranking mechanism — it is the single, specific, evidenced reverse direction this section's own inventory shows is both real and currently invisible.

---

## 14. Cross-Collection Discovery

**Knowledge ↔ Work**: forward direction (Work → Knowledge) is fully live, now at 100% Knowledge coverage (§13). Reverse direction (Knowledge → Work) does not exist (§13) — the one real, evidenced gap in this entire graph.

**Knowledge ↔ Engineering Log**: one live edge (E4 → `idempotency`), unchanged since `docs/72`. E3 still has no Knowledge-side connection — not a defect; no Knowledge article's own content evidences a genuine overlap with E3's access-control narrative (`docs/73` §7 already established this precisely, re-confirmed here: nothing in `docs/73`/`docs/74`/Task 7.23 touches this).

**Work ↔ Engineering Log**: both directions fully live (2 authored, 2 resolver-derived reverse), unchanged in count.

**Is the current graph "becoming useful enough to justify additional Discovery infrastructure"?** Yes, specifically and narrowly for the one direction named in §13 — not generally, and not for every possible cross-collection pairing. Knowledge↔Engineering Log remains too thin (1 edge) to justify anything beyond its current, correctly-dormant infrastructure.

---

## 15. Search

Re-verified live this turn against all 13 real documents: title, description, and each individual tag value remain matchable (`matchesQuery()`, `search.ts`, unchanged code). `outbox` (the one new tag) individually confirmed present in the matchable set. Cross-collection grouping (Knowledge/Work/Engineering Log, three separate result groups) unchanged. Ordering: each group independently sorted by real `publishedAt`, unchanged. No duplicate-result mechanism triggered by this round's content (`transactional-outbox` and `vaultpay`'s edit each appear exactly once in their own collection's group). Empty-state behavior (`hasSearchResults()`) unchanged and untested by this round's specific content, since every real document remains matchable by its own title alone at minimum.

**Sufficient for the current corpus?** Yes — largest real result group is 7 (`payments`), far under any scale where Search's current flat-list presentation would degrade. **Not modified.**

---

## 16. RSS / Sitemap / Indexing

**RSS**: 13 items — one per real document, confirmed by direct arithmetic against §3's totals (7 + 4 + 2). Chronology remains deterministic: the merge sorts real `Date` objects, not formatted strings (`rss.ts`, unchanged). `transactional-outbox` and `idempotency` share `publishedAt: "2026-08-16"` with `append-only-ledger` — a three-way tie, resolved by the same stable-sort-over-array-order behavior already proven correct for the two-way tie `docs/72` §4 verified.

**Sitemap**: 27 URLs — 6 static + 8 topic + 7 Knowledge + 4 Work + 2 Engineering Log = 27, arithmetic re-verified exactly (up from 26).

**All real documents represented?** Yes, both feeds re-confirmed against the direct `content/` listing in §3, not assumed from either resolver's own docstring claim.

**Indexing concern from continued growth?** None found — both mechanisms are `O(n)` reads over the same `getAll*()` resolvers already exercised at every prior content round; nothing in this round's growth (13 documents, 27 URLs) approaches any practical limit for either format.

**No production change made or proposed.**

---

## 17. Discovery Candidate Matrix

| Candidate | Current evidence | Real user value | Corpus readiness | Implementation cost | Duplicates existing IA? | Content-dependent? | Threshold status | Recommendation |
|---|---|---|---|---|---|---|---|---|
| **A. Technologies** | 20 values, Work-only, 0 Knowledge | Low | Low — no cross-collection signal | Medium (new UI) | Would duplicate tag/Search coverage | Yes — needs Knowledge adoption | Not crossed (§9) | Defer |
| **B. Filtering** | 13 docs, largest group 7 | Low | Far below threshold | Medium (new UI) | Would duplicate Topic/Tag/Domain | Yes — needs 2×+ growth | Not crossed (§10) | Defer |
| **C. Series** | 0 real values; narrative precondition now satisfied (§11) | None yet (mechanically) | Precondition met, field unauthored | Zero (metadata only, when ready) | N/A | Yes — needs authored `series` field | Not crossed (§11) | Defer |
| **D. Reading Paths** | Undefined product concept, unchanged | None | N/A | High (needs product definition first) | N/A | No — blocked on definition, not content | Not resolvable by content (§12) | Defer |
| **E. Related Content expansion — Knowledge → Work reverse** | 100% Knowledge Work-coverage; no reverse rendering path exists (§13) | **High** — closes a real, named, currently-invisible gap on 4 of 7 article pages | **Ready** — zero new content required | **Low** — exact precedent already proven twice, no schema change | No — nothing else shows this direction | No — uses existing metadata entirely | **Crossed** (§13) | **Recommended — implement now** |
| **F. Continue content authoring** | 13 real docs, 20 real edges, all 7 journeys working | High, historically proven every prior round | Ready | Medium (new article) | No | N/A | N/A (not a threshold-gated candidate) | Strong, but not primary this round (§21) |
| **G. Dedicated tag route** | 25 tags, `payments` at 7 docs/3 collections | Low | Search already serves this scale | Medium-High (new route) | Would duplicate Search | Yes | IA-authorization gate, not crossed (`docs/03` silent) | Defer |

---

## 18. Content Candidate Reassessment

Every "### Decision:" heading in all four Work case studies' bodies was re-read directly this turn (not just frontmatter or previously-quoted excerpts) — surfacing decisions no prior editorial document names.

| Candidate | Status | Evidence | Reasoning |
|---|---|---|---|
| **A1 (Authorization)** | **Not reopened** | Haya's substantial access-control material is unchanged and still is E3's own primary source (`docs/73` §4–§6); no new authorization-relevant text was added to any case study this round | No new evidence exists; `docs/73`'s downgrade stands |
| **A2 (API Versioning)** | **Not reopened** | No dedicated Engineering Decision for versioning/deprecation exists anywhere in the corpus, unchanged | Still weaker than A1 (`docs/73` §3) |
| **VaultPay: "Modular Monolith Over Microservices"** | **New finding, not previously named in any editorial document (`docs/58` grep confirms zero prior mention)** | Complete, dedicated Alternatives/Trade-offs/Rationale, re-read in full this turn | **Not recommended next** — a 5th VaultPay-anchored Knowledge article would push VaultPay's own concentration to 6 of 7 real Knowledge articles (§19); evidenced, but the wrong project to draw from next given §19's own finding |
| **A5 — "Bounding Concurrency with Semaphores and Worker Pools"** | **Unblocked, strongest surfaced candidate** | Two independent anchors: Haya's fixed browser pool + separate upload/AI-call concurrency limits; GoHunt's `go test -race`-validated worker pool (`docs/58` §5) | `docs/58` itself deferred A5 to P2 specifically because it was "better after A3/A4 exist" — **both now exist**. No document since `docs/58` (`66`, `69`, `72`, `73`, `74`) revisited A5 despite this. Diversifies away from VaultPay entirely (§19) |
| **Cookeaze: "OTP Confirmation Before a Withdrawal"**, **"Surface the Provider's Actual Rejection Reason"** | New findings, not previously named | Two more dedicated decisions in Cookeaze's own text, neither claimed by any Knowledge article or E4 | Each is single-anchor and thinner than A5's two-project evidence; worth naming for a future round, not this one |
| **GoHunt: "Filter Before Scoring, Not After"** | New finding, not previously named | A complete, dedicated cost-gating/pipeline-ordering decision | Single-anchor (GoHunt only); real but thinner than A5 |

**If content authoring is the next round after this Discovery feature**: **A5** is the strongest candidate, precisely because its own previously-stated blocking condition is now satisfied and because it is the only remaining full-article candidate whose anchors are entirely outside VaultPay.

---

## 19. Project Concentration

Current Work-side Knowledge connections, counted from §4: `vaultpay` 4 outbound, `cookeaze` 1, `gohunt` 1, `haya` 1 — VaultPay accounts for **4 of 7 (57%)** of all real Work→Knowledge edges.

**Anchor attribution, traced per article** (from `docs/67`, `docs/70`, `docs/74`, each re-checked):

| Knowledge article | Real anchor(s) |
|---|---|
| `money-floating-point` | VaultPay (sole) |
| `optimistic-vs-pessimistic-locking` | VaultPay (sole) |
| `append-only-ledger` | VaultPay (sole) |
| `transactional-outbox` | VaultPay (sole) |
| `idempotency` | VaultPay **and** Cookeaze (dual) |
| `data-transfer-objects` | GoHunt (sole) |
| `how-jwt-works` | Haya (sole) |

**VaultPay is an anchor — sole or shared — for 5 of the repository's 7 Knowledge articles (71%); the sole anchor for 4 of 7 (57%).** This is a real, material concentration, materially higher than at any prior reassessment (`docs/70` §21 first flagged it at 3 articles; `docs/74` §21 named it at 4).

**Does VaultPay have further usable, distinct evidence?** Checked directly (§18): of VaultPay's 6 named Engineering Decisions, 5 are already claimed (ledger, money, locking, idempotency, outbox); only "Modular Monolith Over Microservices" remains — evidenced, but drawing from it next would push concentration to 6 of 7 (86%).

**Compared with GoHunt, Haya, Cookeaze**: each currently anchors exactly 1 Knowledge article on its own (GoHunt, Haya) or 1 shared (Cookeaze, via `idempotency`). All three have real, unclaimed dedicated decisions still in their own text (§18) — Haya has two (browser pool, concurrency limits), GoHunt has one more (filter-before-scoring), Cookeaze has two more (OTP, rejection-reason surfacing).

**Conclusion**: this document does not reject VaultPay's remaining evidence on principle, but with comparable evidence strength now available elsewhere (A5's two independent anchors), **the next full article should not be VaultPay-derived** — the first time this reassessment series has had a genuinely evidenced alternative strong enough to make that call concretely, rather than as a general diversity preference.

---

## 20. E2 Status

`docs/65`'s three explicit revisit conditions, individually re-checked against everything that has happened since Task 7.19–7.23:

1. **Genuinely new, non-overlapping technical detail added to Haya's own case study** — `haya.mdx` is unmodified since `docs/65` (confirmed: not in this round's `git status`, not touched by any task between). **Not met.**
2. **E3's own text edited to remove the overlapping paragraph** — `haya-invitation-gate-removal.mdx` unmodified. **Not met.**
3. **The real Engineering Log collection grown enough that a second Haya entry no longer reads as concentration** — still exactly 2 real entries, unchanged. **Not met.**

**None of the three conditions is met. E2 remains DEFERRED, not reopened**, per this task's own explicit instruction not to reopen it merely because the corpus grew elsewhere.

---

## 21. Threshold Matrix — Every Deferred Candidate

| Candidate | Documented threshold (source) | Current evidence | Crossed? | Decision |
|---|---|---|---|---|
| Technologies | ≥2 Knowledge articles populate `technologies` (`docs/58` §20) | 0 | No | Defer |
| Filtering | Single Search group >~10, or total docs >~20–25 (`docs/58` §20) | Largest group 7; total 13 | No | Defer |
| Series | 2+ real articles share `series`/`seriesOrder` (`docs/58` §20) | 0 (narrative precondition now met, field unauthored, §11) | No | Defer |
| Reading Paths | Product-level definition supplied (`docs/51` Decision 3) | Still undefined | No | Defer |
| Related Content expansion | 2nd domain reaches 2+, OR 3+ cross-collection links beyond baseline 4 (`docs/58` §20) | 2nd domain: no (both at 1). Cross-collection links: 8, delta +4 | **Yes (2nd condition)** | **Act — implement Knowledge→Work reverse relationship (§13, §21)** |
| Dedicated Tag route | `/tags/*` explicitly authorized in `docs/03`'s URL Structure (`docs/51` Decision 1, `docs/53`) | `docs/03` still silent | No | Defer |
| E2 | 3 explicit conditions (`docs/65` §18) | None of 3 met (§20 above) | No | Defer |
| A1 (Authorization) | New, non-overlapping evidence beyond E3's own material (`docs/73` §23) | None found | No | Not reopened |

No vague language is used anywhere in this table — every "No" traces to a specific re-checked number or fact; the one "Yes" traces to an exact arithmetic delta (§13).

---

## 22. Final Recommendation

### A — Implement a Discovery feature now.

**Exactly which feature**: a Knowledge → Work reverse relationship — a new region on each real Knowledge article's own page (working title: "Applied In These Case Studies") showing which real, published Work case study or case studies name that article in their own `relatedContent`.

**Why its threshold is now crossed**: `docs/58` §20's own "Related Content expansion" threshold — 3+ real cross-collection `relatedContent` links beyond the 4-link Phase A baseline — is met for the first time this milestone, at a delta of +4 (§13, §21). This is not a subjective judgment call; it is the same arithmetic test `docs/72` applied and correctly found *not* crossed (+2) two rounds ago.

**Why this specific feature, not a generic expansion**: the same full relationship-graph inventory that established the threshold crossing (§4, §13) also surfaced a concrete, currently-unaddressed consequence of it: **100% of the repository's 7 real Knowledge articles now have a real inbound Work→Knowledge edge, and none of them is visible from the Knowledge article's own page.** Four articles (`append-only-ledger`, `optimistic-vs-pessimistic-locking`, `money-floating-point`, `transactional-outbox`) have zero path back to VaultPay despite VaultPay linking forward to all four. This is not a hypothetical future need — it is a real, present, measured gap in a graph that has been growing every content round without anyone building its reverse direction.

**Why it is low-risk and appropriately scoped**: no schema change (the data already exists in `workFrontmatterSchema.relatedContent`); no new route; the resolver shape (`resolveRelatedWorkForLog()`'s reverse-lookup pattern) and the presentation precedent (a new, conditionally-rendered `DocumentLayout` slot, exactly as `relatedWork` and `relatedCaseStudies` were each added once before) are both already proven in this codebase. This is not a generic `RelatedContent` component, not similarity-based, not embeddings-based (`docs/24` Principle 8, unchanged) — it is one specific, evidenced, already-partially-built relationship's missing half.

**What this recommendation does not do**: it does not implement anything (§23); it does not reopen Technologies, Filtering, Series, Reading Paths, or a Tags route, none of whose thresholds are crossed (§21); it does not stop content authoring — A5 (§18, §19) is named as the strongest next full-article candidate, independent of this feature and not blocked by it.

---

## 23. Dependency Graph

```
Current real capabilities (verified this turn)
  ├─ 7 Knowledge, 4 Work, 2 Engineering Log — 13 real documents (§3)
  ├─ 20 real relationship edges across 6 mechanisms (§4)
  ├─ 100% Knowledge Work-coverage (Work → Knowledge, forward only) (§13)
  ├─ distributed-systems: first-ever 3-article topic, full P/N chain (§6, §7)
  └─ All 7 Discovery journeys functioning on real content (§5)

Content dependencies
  ├─ A5 (Bounded Concurrency) — ready now, blocked-on condition (A3+A4 exist) now satisfied (§18)
  ├─ VaultPay's "Modular Monolith" — evidenced but concentration-inadvisable next (§18, §19)
  └─ Series — narrative precondition satisfied, mechanical threshold still unmet (§11)

Discovery dependencies
  ├─ Related Content expansion threshold — CROSSED (§13, §21)
  │     └─ unlocks: Knowledge → Work reverse relationship — recommended now (§22)
  ├─ Technologies, Filtering, Series (mechanical), Reading Paths, Tag route — thresholds NOT crossed (§21)
  └─ E2 — none of 3 revisit conditions met (§20)

What the recommended action unlocks
  └─ Every one of the 7 real Knowledge articles gains a real, visible link to the
     case study that grounds it — closing Journey 6's own asymmetry and giving
     every future Knowledge article (including A5's) the same coverage automatically,
     with zero additional per-article authoring once built.

What should NOT be built yet
  ├─ Technologies UI/route — 0 Knowledge articles populate the field
  ├─ Filtering UI — corpus at roughly half the documented threshold
  ├─ Series route or metadata — mechanical threshold unmet; this document creates none
  ├─ Reading Paths — blocked on an undefined product concept, not on content
  └─ /tags/[tag] route — docs/03 IA still does not authorize it
```

---

## 24. Next-Step Sequencing

**If the Discovery feature is pursued next** (this document's own recommendation, §22): the next task should be a dedicated design/implementation-planning pass for the Knowledge → Work reverse relationship — mirroring the two-stage editorial/implementation-plan process this milestone has used for every prior addition. **No implementation plan is authorized by this document** — only the feature and its justification are identified (§22), per this task's own explicit instruction.

**If content authoring resumes instead or in parallel**: **A5 (Bounded Concurrency)** is the identified next candidate (§18, §19), for its two independent, VaultPay-external anchors and its previously-blocking condition now being satisfied. **No editorial plan is authored here** — only the candidate and the reasoning for why it is next.

**This document remains a decision document.** Neither the feature's implementation plan nor A5's editorial plan is produced by this task.

---

## 25. Guardrails

No `.mdx` file, existing content, schema, resolver, route, component, Search, RSS, Sitemap, or navigation file was created or modified to produce this document. No Discovery feature was implemented. No Series, Technology, or tag vocabulary was invented or authored. E2 was not reopened. A1 was not reopened. The only file created by this task is `docs/76-MILESTONE_7_DISCOVERY_REASSESSMENT.md` itself. The cumulative, already-existing uncommitted changes from Task 7.23 (`content/knowledge/transactional-outbox.mdx`, the one-line `content/work/vaultpay.mdx` edit) and `docs/75` are pre-existing and not attributable to this task.

---

## 26. Verification

```
git status --short
```

Confirmed:

```
 M content/work/vaultpay.mdx
?? content/knowledge/transactional-outbox.mdx
?? docs/75-TRANSACTIONAL_OUTBOX_IMPLEMENTATION_PLAN.md
```

— identical to the state at the start of this task, plus this document itself (`docs/76-MILESTONE_7_DISCOVERY_REASSESSMENT.md`, untracked, newly created). `content/work/vaultpay.mdx` (M) and `content/knowledge/transactional-outbox.mdx` (new) are both Task 7.23's own prior, already-approved output — pre-existing, not attributable to this task. `docs/75` is Task 7.22's own prior output. `git diff --stat -- content/ src/` shows zero change attributable to this document. No file under `content/`, `src/`, or any schema/resolver/route/component path was created or modified by this task.

---

## Final Report

1. **Current corpus** (§3): 7 Knowledge, 4 Work, 2 Engineering Log, 13 total real documents — matches the expected baseline, independently re-verified.
2. **Relationship graph** (§4): 20 directional edges across 6 mechanisms, up from 16; the one structural absence — Knowledge → Work — named precisely.
3. **Seven Discovery journeys** (§5): all still function on real data; Journeys 1/3/7 materially strengthened, Journey 5 remains the weakest, unchanged.
4. **Topic density** (§6): `distributed-systems` is now the repository's first 3-article topic with a full Previous/Next chain and a real 2-card Same-Topic fallback group.
5. **Tags** (§8): 25 unique values; `reliability` newly spans Knowledge+Engineering Log; Search remains sufficient at every observed scale; `/tags/*` route not authorized, not reopened.
6. **Technologies** (§9): threshold not crossed — 0 Knowledge articles populate the field.
7. **Filtering** (§10): corpus at roughly half the documented threshold; not crossed.
8. **Series** (§11): mechanical threshold unmet; narrative precondition newly satisfied and named for future reference only — no metadata created.
9. **Reading Paths** (§12): still blocked on an undefined product concept, unaffected by content growth.
10. **Related Content expansion** (§13): **threshold crossed for the first time** — cross-collection `relatedContent` links now total 8, a delta of +4 against the required +3; 100% of Knowledge articles now have a real inbound Work edge with no reverse rendering path.
11. **Search** (§15): unmodified, confirmed sufficient at current scale.
12. **Discovery candidate matrix** (§17): every candidate re-scored; the Knowledge→Work reverse relationship is the one candidate whose threshold is crossed.
13. **Remaining content candidates** (§18): A1/A2 not reopened (no new evidence); a new, previously unnamed VaultPay decision found but concentration-inadvisable; **A5 (Bounded Concurrency)** identified as unblocked and strongest.
14. **Project concentration** (§19): VaultPay anchors 5 of 7 Knowledge articles (71%), sole anchor for 4 of 7 (57%) — a material, growing concentration, quantified precisely.
15. **E2 status** (§20): DEFERRED — none of the three documented revisit conditions is met.
16. **Threshold matrix** (§21): every deferred candidate's threshold restated with current evidence; exactly one candidate crosses.
17. **Final recommendation** (§22): **A — implement the Knowledge → Work reverse relationship**, justified by the crossed threshold and the 100%-coverage finding, not by corpus growth alone.
18. **Next step**: a design/implementation-planning pass for the recommended feature; A5 named as the strongest content candidate for whichever round follows.
19. **Exact file created**: `docs/76-MILESTONE_7_DISCOVERY_REASSESSMENT.md` — the only file created or modified by this task.
20. **Git verification** (§26): confirmed via `git status --short`; zero production change attributable to this task.

**APPROVED — Milestone 7 reassessment is complete and the next action is identified.**
