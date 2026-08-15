# 58 — Content Expansion & Editorial Readiness: Design Proposal

## Status

Proposal — awaiting review and approval.

> No production implementation, content, schema, or route change is authorized by this document.

Task 7.5's design-stage editorial plan, following `docs/57-MILESTONE_7_DISCOVERY_REASSESSMENT.md`'s conclusion: the Discovery architecture is ready; the content corpus is the limiting factor. This document is what that conclusion asks for — not a new feature, an audit and a concrete plan for what real content should be added next, and why.

---

## 1. Method — Full-Body Re-Read, Not Frontmatter Alone

Every prior Milestone 7 document audited frontmatter (tags, technologies, domain, topic). This document goes further, reading the **complete body** of all 8 real documents in full this turn — because the highest-value findings below come from what the articles and case studies actually *say*, not just how they're tagged. That re-read surfaced three concrete, textually-provable connections no prior document found (§9).

---

## 2. Current Content Inventory — Exact

### Knowledge (4 articles)

| Article | Topic | Tags | Difficulty | Published | `relatedContent` | `prerequisites` | `featured` |
|---|---|---|---|---|---|---|---|
| `data-transfer-objects` | architecture | api-design, data-modeling, architecture | intermediate | 2026-08-12 | — | — | false |
| `how-jwt-works` | security | jwt, authentication, tokens | beginner | 2026-08-07 | — | — | false |
| `money-floating-point` | backend | floating-point, money, data-modeling, correctness | beginner | 2026-08-12 | — | — | false |
| `optimistic-vs-pessimistic-locking` | distributed-systems | concurrency, databases, locking, correctness | intermediate | 2026-08-12 | — | — | false |

Zero series usage, zero `relatedContent`, zero `prerequisites`, zero `featured` — confirmed by direct grep, not approximated.

### Work (4 case studies)

| Case study | Domain | Technologies | Tags | Status | `relatedContent` | `featured` |
|---|---|---|---|---|---|---|
| `vaultpay` | Backend Infrastructure | Go, Fiber, PostgreSQL, Redis | backend, concurrency, payments, go | In Progress | — | false |
| `gohunt` | AI Systems | Go, Fiber, PostgreSQL, sqlc, Claude API, Next.js | backend, go, ai, job-search | Completed | — | false |
| `haya` | Platform Engineering | Node.js, TypeScript, Express, MongoDB, Redis, BullMQ, Puppeteer, OpenAI GPT-4o | backend, ai, concurrency, payments, platform | Completed | `["how-jwt-works"]` | false |
| `cookeaze` | Backend Infrastructure | Python, Django, Django REST Framework, MySQL, Celery, Redis, Paystack | backend, payments, django, ai | Completed | — | false |

One real relationship exists today — `haya` → `how-jwt-works`. Zero `featured` flags. Zero `engineeringLog` links (all four set `engineeringLog: []`).

### Engineering Log

Zero entries. `content/engineering-log/` contains `.gitkeep` only.

### Topics (`TOPIC_SLUGS`, 8 total)

`backend`, `architecture`, `distributed-systems`, `security` each have exactly **one** real article. `system-design`, `cloud`, `performance`, `testing` have **zero**.

---

## 3. Topic Coverage — Evaluated, Not Assumed to Need Uniform Filling

| Topic | Real articles | Genuinely aligned with demonstrated engineering focus? |
|---|---:|---|
| `backend` | 1 | Yes — this is the corpus's own center of gravity |
| `architecture` | 1 | Yes — DTOs, ledger design, pipeline design all recur |
| `distributed-systems` | 1 | Yes — concurrency control is a real, recurring theme across 3 of 4 case studies |
| `security` | 1 | Yes — auth is real and already has a natural next article cued (§5) |
| `system-design` | 0 | Partially — the case studies contain real system-design reasoning (pipeline architecture, queue design) but nothing has been written *as* a `system-design`-topic article yet |
| `cloud` | 0 | Weak evidence — no real deployment/infrastructure narrative exists in the corpus beyond incidental mentions (Docker tuning in Haya, §8) |
| `performance` | 0 | Weak evidence — no case study documents a measured performance investigation; VaultPay explicitly states load-test results don't exist yet |
| `testing` | 0 | Some evidence — GoHunt's `go test -race` CI discipline is real but thin as a sole article's foundation |

**Not every empty topic should be filled immediately.** `system-design`, `security`, `architecture`, `distributed-systems`, and `backend` all have real, demonstrated material to draw from (§5–§6). `cloud` and `performance` do not — filling them now would mean writing about infrastructure/optimization work this portfolio's real projects haven't actually done, which fails this task's own "authentic to demonstrated engineering interests" bar. `testing` sits in between: real but thin.

---

## 4. Content Clusters — Only Where Real Content Already Supports Them

| Cluster | Existing pieces | Missing foundational | Missing deeper | Potential Eng. Log | Potential Work links |
|---|---|---|---|---|---|
| **Correctness / Money / Ledgers** | `money-floating-point` (Knowledge) | — | Double-entry ledger design (§5, new) | — | `vaultpay`, `cookeaze` |
| **Concurrency Control** | `optimistic-vs-pessimistic-locking` (Knowledge) | — | Bounded concurrency / semaphores (§5, new) | — | `vaultpay`, `haya`, `gohunt` |
| **API / Data Boundaries** | `data-transfer-objects` (Knowledge) | — | API versioning (§5, new, explicitly cued) | — | `gohunt` |
| **Authentication / Security** | `how-jwt-works` (Knowledge) | — | Authorization (§5, new, explicitly cued) | — | `haya` |
| **Idempotency / Payment Reliability** | *(none yet)* | Idempotency in payment/distributed systems (§5, new) | — | Haya, Cookeaze candidates (§8) | `vaultpay`, `cookeaze` |

Every cluster above is grounded in at least one real Knowledge article or real case-study decision — none is speculative.

---

## 5. Article Candidates

Each candidate below traces to specific, quoted evidence in real content — not invented. None is written by this document.

### A1 — "Authorization: What JWT Doesn't Answer"

- **Topic**: `security`. **Reader/problem**: someone who's read `how-jwt-works` and now needs to know *what a verified user is allowed to do*.
- **Why it belongs**: `how-jwt-works`'s own closing text states this directly — *"They don't, by themselves, answer authorization... worth understanding as two different problems rather than one."* This is the author's own existing cue, not an invented gap.
- **Likely tags**: `authorization`, `rbac`, `permissions`, `security`.
- **Level**: beginner–intermediate, mirroring `how-jwt-works`.
- **Connects to Work?**: Yes — `haya`'s three-parallel-auth-method decision and its access-control evolution (§8) both touch authorization concerns directly.
- **Duplicates existing content?**: No.
- **Repository-supported**: the topic and its motivation, yes. The article's actual content/opinions: requires the user's own voice.

### A2 — "API Versioning and Backward Compatibility"

- **Topic**: `architecture`. **Reader/problem**: someone who's read `data-transfer-objects` and wants to know how a public contract stays stable over time.
- **Why it belongs**: `data-transfer-objects`'s own closing text states this directly — *"This is the same discipline API versioning and backward compatibility rely on more broadly."*
- **Likely tags**: `api-design`, `versioning`, `architecture`.
- **Level**: intermediate, matching `data-transfer-objects`.
- **Connects to Work?**: Plausible via GoHunt's own DTO boundary (§9) but not as directly as A1 connects to Haya.
- **Duplicates existing content?**: No — extends, doesn't repeat, `data-transfer-objects`.

### A3 — "Idempotency: Making 'Do This Twice, Safely' a Real Guarantee"

- **Topic**: `backend` or `distributed-systems`. **Reader/problem**: someone building a payment or distributed system who needs to know why "just don't call it twice" isn't a real guarantee.
- **Why it belongs**: **two independent real case studies** arrived at idempotency as a load-bearing design decision — VaultPay's *"Idempotency Keys Stored in PostgreSQL, Not Redis"* and Cookeaze's *"Idempotent Resolution Keyed on a Unique Transaction Reference."* This is the strongest-evidenced *new* article candidate in this document — two real, independent projects, not one.
- **Likely tags**: `idempotency`, `correctness`, `payments`, `distributed-systems`.
- **Level**: intermediate.
- **Connects to Work?**: Yes, directly — `vaultpay` and `cookeaze` both.
- **Duplicates existing content?**: No, but shares real conceptual territory with `optimistic-vs-pessimistic-locking` (both are concurrency-correctness mechanisms) — worth cross-linking, not merging.

### A4 — "Why a Wallet Balance Should Never Be a Column You Update"

- **Topic**: `backend` or `architecture`. **Reader/problem**: someone designing any system where a stored number has to be provably correct, not just probably correct.
- **Why it belongs**: VaultPay's own case study already states this as its **governing rule**, in a `<Callout type="key-insight">` — *"A wallet balance is never a column you update — it's a number you compute from an append-only ledger."* The thesis is already written; this would be the general, standalone teaching version of it.
- **Likely tags**: `data-modeling`, `correctness`, `architecture`, `payments`.
- **Level**: advanced, matching VaultPay's own stated difficulty.
- **Connects to Work?**: Yes, directly and primarily — `vaultpay`.
- **Duplicates existing content?**: No — complements `money-floating-point` (representation) with a different, structural concern (mutability).

### A5 — "Bounding Concurrency with Semaphores and Worker Pools" *(P2, weaker evidence than A1–A4)*

- **Topic**: `distributed-systems` or `performance`. **Reader/problem**: someone who needs to run many things in parallel without overwhelming a fixed-capacity resource.
- **Why it belongs**: Haya's architecture is built entirely around this (fixed browser pool, independent semaphores for uploads/AI calls); GoHunt's worker pool (`go test -race`-validated) is a smaller second example.
- **Connects to Work?**: Yes — `haya`, `gohunt`.
- **Why P2, not P1**: the concept is real but more implementation-specific than A1–A4's more broadly teachable shape; also closer in territory to the existing locking article than A1–A4 are.

**Not proposed, and why**: a "Technologies I Use" or general career-reflection article — no case study or existing article gestures at either; would be invented from nothing rather than drawn from evidence.

---

## 6. Content Clusters — Series/Reading-Path Potential, Evaluated Honestly

The closest thing to a natural sequence today: `money-floating-point` → `optimistic-vs-pessimistic-locking` → (A3, Idempotency) → (A4, Ledger design) → `vaultpay`/`cookeaze` — a real, evidence-grounded progression from "how do you represent money" through "how do you keep it correct under concurrency" to "here's a real system built on those answers." **Not sufficient today** — two of its five steps (A3, A4) don't exist yet. Named here as the strongest candidate for a *future* Series once A3/A4 are written, not proposed as one now (§12).

---

## 7. Featured Content — Concrete Recommendations, Grounded

Editorial rule applied: *featured content best represents the portfolio's engineering perspective or serves as an especially useful entry point* — not "newest," not "most recent."

**Work — recommend `featured: true` on exactly two:**

- **`vaultpay`** — the most architecturally rigorous, most narratively complete case study (explicit decision framework, governing rule stated as a callout, honest about what isn't yet measured). Best represents "reasoning from first principles."
- **`gohunt`** — the clearest "real tool in daily use, not just an exercise" story, with the DTO example that independently corroborates a real Knowledge article (§9). Best represents "learning by building something real."

**Corroborating, independent evidence**: `PLACEHOLDER_WORK` (the pre-Task-7.1 fixture, `lib/constants/placeholder-work.ts`) marked exactly these same two `featured: true`, before this document's own fresh read of the real content arrived at the same two independently. Not a coincidence to lean on alone, but a second, independent signal pointing the same direction.

**Not recommended for featured**: `haya` (excellent, but its strength — the Project Evolution narrative — is better served as an Engineering Log entry, §8) and `cookeaze` (strong, but its own webhook-reliability story is likewise better told as a focused Engineering Log entry than folded into a "featured" label).

**Knowledge — recommend `featured: true` on exactly two:**

- **`how-jwt-works`** — beginner difficulty, the most approachable single-concept explainer, already the topic with a real, cued next article (A1).
- **`money-floating-point`** — beginner difficulty, a vivid, memorable, concrete example (₦5,000 → kobo), the article most likely to hook a first-time reader.

**Keep the featured count small** — four items total across two collections, matching this task's own instruction and the existing `limit: 3` default already coded into `getFeaturedArticles()`/`getFeaturedCaseStudies()` (§7 leaves one Knowledge fallback slot for the newest-first mechanism to fill naturally).

**Not performed by this document** — no frontmatter was modified to produce this recommendation.

---

## 8. Engineering Log Candidates — Every One Traced to Already-Published Text

Per this task's own critical instruction: **nothing below is invented.** Each candidate quotes the real case study sentence it comes from. None is a hypothetical debugging session.

### E1 — "Getting Headless Chromium to Behave Inside Docker" — *repository-supported*

- **Source**: `haya`'s own "Challenges Encountered": *"Running headless Chromium reliably inside Docker required real container-level tuning (shared memory, sandboxing flags) beyond what runs locally without a container."*
- **Likely tags**: `docker`, `puppeteer`, `infrastructure`. **Related Work**: `haya`. **Related Knowledge**: none existing yet; could reference A5 if written.
- **Why Engineering Log, not a Knowledge article**: narrow, dated-enough, personal ("works on my machine" specific to this project), not an evergreen concept — exactly `docs/03`'s own Engineering Log definition.

### E2 — "When a Single-Attempt Payment Verification Wasn't Enough" — *repository-supported*

- **Source**: `haya`: *"verifying a Solana payment transaction against RPC calls that can themselves be flaky needed retry/backoff and a `PENDING` intermediate state added after the fact, once real-world RPC behavior under load showed the original single-attempt verification wasn't resilient enough."*
- **Likely tags**: `payments`, `reliability`, `blockchain`. **Related Work**: `haya`. **Related Knowledge**: A3 (Idempotency), once written.

### E3 — "Removing Haya's Invitation Gate" — *repository-supported, and unusually complete already*

- **Source**: `haya`'s own dedicated "Project Evolution" section — already structured as Initial State / Problem / Decision / Change / Result / New Understanding, a near-complete Engineering Log entry sitting inside a Work case study.
- **Likely tags**: `access-control`, `product-decisions`. **Related Work**: `haya`.
- **Note**: this is the strongest single candidate in this section — the real event, its reasoning, and its resolution are already fully documented; converting it to a standalone entry is closer to editorial restructuring than new writing.

### E4 — "The Webhook That Wasn't Enough" — *repository-supported*

- **Source**: `cookeaze`: *"The original design's dependence on the webhook alone surfaced as occasional payments that completed on Paystack's side without ever being reflected in the platform — the self-chaining poller was added directly in response to that gap."*
- **Likely tags**: `payments`, `webhooks`, `reliability`. **Related Work**: `cookeaze`. **Related Knowledge**: A3 (Idempotency).

### E5 — Modeling NIBSS Deferred Net Settlement — *requires user confirmation*

- **Source**: `vaultpay`: *"reasoning about Nigeria-specific settlement conventions... without a live NIBSS integration to validate the model against."*
- **Why flagged, not recommended outright**: framed in the case study as ongoing design reasoning, not a completed, dated event — the Engineering Log format (`docs/03`: *"what was actually learned... when it happened"*) fits a resolved moment better than an open design question. **Requires user confirmation** on whether this is ready to be told as a log entry yet.

### E6 — Greenhouse Pagination Truncation — *requires user confirmation, weaker*

- **Source**: `gohunt`: *"the fetcher doesn't yet walk every page of a very large board, so some listings from high-volume Greenhouse boards are missed... a known, currently accepted limitation rather than a resolved one."*
- **Why weaker than E1–E4**: explicitly unresolved — the same "no ending yet" issue as E5.

### E7 — Meta: The Portfolio's Own Discovery Migration — *requires user confirmation, unusual but real*

- **Source**: this repository's own `docs/50`–`docs/56` — Task 7.1's real content migration, Task 7.2's Search extension, Task 7.3's domain-adjacency resolver — all real, git-diffable, fully documented engineering work with real trade-offs and verification.
- **Why flagged separately**: writing Engineering Log entries about building the portfolio site *itself* is unusual but not fabricated — every claim is independently verifiable in this very `docs/` folder. **Requires user confirmation** because it's a stylistic/scope choice (does the user want the site's own build process as public content?), not a factual question.

---

## 9. Relationship Opportunities — The Highest-Leverage Finding in This Document

Found by the full-body re-read (§1), not by any prior task's frontmatter-only audit:

| Source | Target | Evidence | Confidence |
|---|---|---|---|
| `vaultpay` | `optimistic-vs-pessimistic-locking` | VaultPay's own "Pessimistic Locking for Concurrent Transfers" decision uses the *exact* `SELECT ... FOR UPDATE` mechanism, and the *exact* trade-off framing, the Knowledge article teaches | **Repository-supported** |
| `vaultpay` | `money-floating-point` | VaultPay's "Integer Arithmetic for Money" decision reuses the *exact* kobo/₦5,000 example the Knowledge article uses | **Repository-supported** |
| `gohunt` | `data-transfer-objects` | GoHunt's own DTO example — `FetchedJobDTO`, `StoredJob`, `PublicJobDTO`, a job listing — is near-identical in shape and naming to the Knowledge article's own hypothetical job-listing DTO example | **Repository-supported** |

Each is a real, evidenced editorial relationship — `resolveRelatedKnowledge()` already supports exactly this via `relatedContent`, no schema change needed, no new resolver needed (both `docs/55`/`docs/56` already built and shipped this mechanism). **Adding these three lines to three existing files' frontmatter would triple the number of real Work→Knowledge relationships in this repository — from one to four — without writing a single new sentence of prose.**

**Not recommended without more evidence**: `cookeaze` → `money-floating-point`. Cookeaze is a wallet/payment system, but — checked directly — its own text never discusses floating-point representation or integer-cents modeling the way VaultPay's does; forcing this link would be inferring a connection the text doesn't actually make.

**Knowledge ↔ Knowledge**: none evidenced yet — no existing article's body references another by name or shared example the way the Work↔Knowledge pairs above do.

**Work ↔ Work, Work ↔ Engineering Log, Engineering Log ↔ Knowledge**: already covered by Task 7.3 (domain adjacency) and blocked on Engineering Log content (§8) respectively — no new mechanism needed, only content.

---

## 10. Tag Quality Audit

19 unique tags across 8 real documents. Findings, audit only — **no tag is modified by this document**:

- **10 of 19 tags are singletons** (used exactly once): `jwt`, `tokens`, `api-design`, `architecture`, `floating-point`, `money`, `locking`, `databases`, `job-search`, `django`. A singleton tag provides zero clustering value by definition — worth knowing, not worth "fixing" by force.
- **`backend` appears on all 4 Work documents** — present on 100% of one collection, meaning it currently has zero discriminating power as a facet within Work.
- **A real vocabulary collision, found directly**: `data-transfer-objects.mdx` sets `topic: "architecture"` *and* includes `"architecture"` in its own `tags` array — the tag restates the topic rather than adding new information.
- No case/spelling drift found — re-confirmed, consistent with `docs/53`'s own finding.
- No duplicate-concept-different-spelling pairs found (e.g., no `auth` vs. `authentication` split).

---

## 11. Technology Metadata Audit

20 unique values across 4 Work documents, Work-only. Findings:

- No duplicates, no case inconsistency, no version strings (`"Go"`, never `"Go 1.22"`, confirmed despite the case studies' own prose mentioning specific versions like "Go 1.22" in body text — the frontmatter itself stays clean).
- No overly generic values — every technology named is specific enough to be meaningful (`Fiber`, not `web framework`; `sqlc`, not `SQL tool`).
- Real reuse exists and is meaningful: `Redis` (3 docs, for different purposes each time — caching/rate-limiting in VaultPay, job queue in Haya, Celery broker in Cookeaze — worth noting the *same* technology serves different architectural roles across projects, a genuinely interesting fact this audit surfaces but doesn't act on).

**No cleanup needed** — this is the one audit in this document with no findings requiring attention.

---

## 12. Series — Remains Deferred

Zero real content, re-confirmed (§2). The closest natural sequence (§6) requires two not-yet-written articles (A3, A4) before it would be coherent. **Recommendation: keep Series deferred**, exactly as `docs/51` Decision 1 and `docs/57` both already concluded. Do not force the four existing articles into a Series merely because two share adjacent topics — `data-transfer-objects` (architecture) and `optimistic-vs-pessimistic-locking` (distributed-systems) do not form a real sequence with each other today.

---

## 13. Reading Paths — Remains Deferred, Different Reason Than Series

Unlike Series, Reading Paths' blocker is **not** content volume — it's the unresolved definitional question `docs/51` Decision 3 already identified (is it a Series synonym, or a genuinely distinct cross-collection curriculum concept?). More content would not resolve this; a product decision would. **This document does not attempt to define one**, and notes explicitly that even the strongest possible content roadmap in this document (§16) doesn't change Reading Paths' status — this is the one candidate where "write more content" is not the applicable next step.

---

## 14. Content Quality Gaps

The honest finding: **the 8 real documents are already well-structured and thorough** — full Introduction/Problem/Trade-offs/Key-Takeaways shape (Knowledge), full Executive-Summary/Decisions/Validation/Outcome shape (Work). No missing introductions, no weak descriptions, no unclear titles were found. The real gaps are structural, not qualitative:

1. Zero cross-linking (§9) — the highest-leverage, lowest-effort fix available.
2. Zero `featured` flags (§7).
3. Four of eight topics empty, two of those four with real supporting material not yet written (§3).
4. An entire collection (Engineering Log) empty despite four case studies containing real, extractable log-shaped material (§8).

---

## 15. Prioritization

| Item | Priority | Discovery value | Editorial effort | Evidence strength | Dependencies |
|---|---|---|---|---|---|
| 3 `relatedContent` links (§9) | **P0** | High — triples real relationships | Minutes (frontmatter only) | Repository-supported | None |
| 4 `featured: true` flags (§7) | **P0** | Medium — activates real curation | Minutes (frontmatter only) | Repository-supported | None |
| A3 — Idempotency article | P1 | High — new cluster, 2 real Work links | Medium (new article) | Repository-supported (topic + motivation) | None |
| A4 — Ledger design article | P1 | High — strengthens Money/Ledger cluster | Medium | Repository-supported (thesis already written in VaultPay) | None |
| A1 — Authorization article | P1 | Medium-High — explicitly cued | Medium | Repository-supported | None |
| A2 — API Versioning article | P1 | Medium — explicitly cued | Medium | Repository-supported | None |
| E1–E4 Engineering Log entries | P1 | High — activates an entire empty collection | Medium (restructuring real content) | Repository-supported (event); user voice needed for prose | None |
| A5 — Bounded concurrency article | P2 | Medium | Medium | Repository-supported, less central | Better after A3/A4 exist |
| E5, E6 (unresolved-issue log entries) | P2 | Low-Medium | Low | Requires user confirmation | User decision on framing |
| E7 (meta engineering log) | P2 | Unclear until user decides | Low (source material already written) | Requires user confirmation | User decision on scope |
| `system-design`/`testing` topic content | P2 | Medium | High (thin existing material) | Partial | More real project material |
| `cloud`/`performance` topic content | Not prioritized | — | — | Insufficient evidence | Real infrastructure/perf work that hasn't happened yet |

---

## 16. Content Roadmap

**Phase A — Strengthen existing content (P0).** Author the 3 `relatedContent` links and 4 `featured` flags identified above. Zero new prose. Immediately activates real, already-built Discovery mechanisms (§19).

**Phase B — Fill explicitly-cued Knowledge gaps (P1, articles).** A1–A4, in the order the evidence is strongest: A3 (two independent real projects) and A4 (thesis already written) first, then A1 and A2 (each cued by one existing article's own closing text).

**Phase C — Establish the Engineering Log corpus (P1, log entries).** E1–E4, each restructured from already-published case-study text into its own dated, narrower entry — the highest-leverage single move for activating an entire currently-empty collection and its own dormant relationship types (Related Work, Related Knowledge in the Engineering Log direction, Previous/Next).

**Phase D — Reassess deferred Discovery candidates.** Only after Phases A–C, using the specific thresholds in §20 — not on a calendar, on evidence.

---

## 17. What Not to Write

- A dedicated "Technologies" glossary article — would restate frontmatter, not teach anything; populates a UI concern, not a reader's.
- Speculative `cloud` or `performance` topic articles — no real project in this corpus has done deployment/infrastructure or measured-performance work yet (VaultPay explicitly states load-test results don't exist); writing here would be inventing engineering experience the repository doesn't support.
- A Series or Reading Path container, built now, to "use" the existing four articles — explicitly what §12/§6 already found unsupported; two of the five steps in the only real candidate sequence don't exist yet.
- E5/E6 as written today — both describe *unresolved* issues; publishing them now would mean either fabricating a resolution or publishing an Engineering Log entry with no "what was learned," which isn't what the format is for.
- Any `career` or `teaching` topic content — not part of the real `TOPIC_SLUGS` vocabulary at all (that's an old, superseded list per `docs/03`'s known divergence, already documented in `docs/50`) — writing for it would mean inventing a taxonomy value, not filling an existing one.
- `cookeaze` → `money-floating-point` relatedContent link — checked directly, not supported by Cookeaze's own text (§9).

---

## 18. User Confirmation Boundary

**Repository-supported — this document confidently recommends these directly**: the 3 relatedContent links (§9), the 4 featured flags (§7), the *topics and motivations* for A1–A4 (each traces to a specific quoted sentence), the *events* underlying E1–E4 (each traces to a specific quoted sentence), the tag/technology audit findings (§10–§11), Series/Reading Paths remaining deferred (§12–§13).

**Requires user confirmation — this document identifies the possibility, not the answer**: the actual prose/voice of any new article or log entry (A1–A5, E1–E4) — identifying *what* to write about is repository-evidenced; the specific sentences, opinions, and first-person details are the user's own engineering judgment, not inferable from existing text. Whether E5/E6 are ready to be told at all, given their unresolved framing. Whether E7 (meta, about the portfolio's own build) is wanted as public content at all — a scope/style choice, not a factual one. Exact dates for any Engineering Log entry not already dated in its source case study.

---

## 19. Discovery Impact

| Recommendation | System(s) strengthened |
|---|---|
| 3 `relatedContent` links | Related Knowledge (Work→Knowledge) — 1 real result → 4 |
| 4 `featured` flags | Featured/Start Here — fallback-only → genuine curation |
| A1–A4 (new articles) | Search (more real title/description/tag matches), Topics (`security`/`architecture`/`backend`/`distributed-systems` each gain a second real article, activating Same Topic fallback for the first time ever), Related Knowledge (new linkable targets) |
| E1–E4 (Engineering Log entries) | Engineering Log listing (0 → 4 real entries), Related Work / Related Knowledge (Eng. Log direction, currently 100% dormant), Previous/Next (Eng. Log, currently untestable), RSS (Eng. Log items currently impossible — the feed has nothing to include), Sitemap (Eng. Log URLs currently zero) |
| Tag/technology audit | No direct system change — informs future editorial cleanup, not acted on here |

---

## 20. Reconsideration Thresholds — Evidence-Based, Not Arbitrary

- **Technologies**: reconsider once **at least 2 Knowledge articles also populate `technologies`** (currently 0) — the concrete signal that it's genuinely cross-collection, not a Work-only field wearing a shared schema.
- **Filtering**: reconsider once **any single Search result group regularly exceeds ~10 items**, or **total real document count exceeds ~20–25** — the point where a single scannable list stops being sufficient, derived from the current "8 documents, fits on one screen" baseline, not a round number picked arbitrarily.
- **Series**: reconsider the moment **any 2+ real Knowledge articles share a `series`/`seriesOrder` value** — the literal, already-built activation condition, not a document count.
- **Reading Paths**: reconsider only once **a product-level definition is provided** (`docs/51` Decision 3) — content growth alone does not resolve this candidate; named explicitly as the one exception to "more content is the answer."
- **Related Content expansion**: reconsider once **either a second domain reaches 2+ real case studies** (beyond Backend Infrastructure's current pair) **or 3+ real cross-collection `relatedContent` links exist** (beyond the 4 this document's Phase A would produce) — evidence of a real, recurring pattern beyond the first examples.

---

## 21. File Manifest

Only `docs/58-CONTENT_EXPANSION_EDITORIAL_PLAN.md` was created. No production, content, schema, or route file was touched.

---

## 22. Release Review

Confirmed via `git status` (§23's own confirmation) — zero production files, zero content files, zero schema files, zero route files, zero component files modified.

---

## 23. Confirmation

No production code, content, schema, route, or component was modified to produce this document. Every figure and quotation in §2–§11 was gathered by direct, full-body reading of the live repository's real content this turn, not carried forward from any prior document's frontmatter-only summary.

---

## Summary

Reading all 8 real documents' complete bodies — not just their frontmatter, which every prior Milestone 7 document had already audited — surfaced the single highest-leverage finding in this entire milestone: three real, textually-provable Work→Knowledge relationships (VaultPay's locking decision, VaultPay's kobo example, GoHunt's DTO example) that already exist in the *content* but not yet in the *metadata*. Authoring three `relatedContent` lines would triple this repository's real relationship count with zero new prose. Four featured-content recommendations are grounded in both fresh analysis and independent corroboration from the pre-migration fixture's own editorial judgment. Four new Knowledge article candidates (A1–A4) are each traced to a specific sentence an existing article or case study already wrote, not invented. Four Engineering Log candidates (E1–E4) are each traced to a specific already-published case-study sentence describing a real, resolved engineering event — the strongest of them (E3) is already written in all but format. Series and Reading Paths both remain deferred, for two different, precisely stated reasons — one blocked on volume, one blocked on definition. Reconsideration thresholds for every deferred Discovery candidate are stated as concrete, evidence-based triggers, not calendar dates. No production code, content, schema, or route was modified to produce this document.
