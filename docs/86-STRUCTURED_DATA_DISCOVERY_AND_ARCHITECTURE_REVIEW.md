# 86 — Task 8.4 (Structured Data): Discovery and Architecture Review

## 1. Executive Summary

Zero structured data exists anywhere in this repository today — confirmed by exhaustive grep, not assumed (§3). Tasks 8.1–8.3 left a complete, correct metadata foundation (`SITE_NAME`, `SITE_URL`, `metadataBase`, `openGraph`, `twitter`, `alternates.canonical`) this task reuses directly rather than reworking (§2).

**The central architectural fact this review establishes**: JSON-LD is not part of Next's `Metadata`/`generateMetadata` surface at all — it is rendered JSX (`<script type="application/ld+json">`), a genuinely different mechanism from everything Tasks 8.1–8.3 touched. This has real consequences: a small, shared rendering primitive is justified (not optional decoration, but the only safe way to inject a `dangerouslySetInnerHTML` script consistently across 10+ files), while entity *construction* logic should map 1:1 onto data each route already fetches for its own `generateMetadata()` — no second content-resolution path.

**Recommended architecture, in brief** (full reasoning in §6–§21, decisions summarized in §30): a site-wide `Person` (Gracious Obeagu) and `WebSite` entity, both carrying stable `@id`s, fully defined once (homepage) and referenced by `@id` elsewhere — not re-duplicated per page. `TechArticle` for Knowledge (evergreen technical reference), `BlogPosting` for Engineering Log (dated journal entries), `CreativeWork` for Work case studies (documentary/narrative, not journalistic or instructional — deliberately not forced into `Article`). `AboutPage` for `/about`. `CollectionPage` + `ItemList` for `/work/library` and Knowledge topic pages (both real, complete, deterministic collections) — explicitly **not** for `/work` (a curated, partial subset, §14). `BreadcrumbList` only on the three routes that render a real, visible breadcrumb (§15). No images beyond one narrow, well-evidenced exception (the About page's own real portrait, §26). No `Organization`, no `SearchAction`, no fabricated author/publisher/date/image data anywhere.

No implementation is authorized by this document.

---

## 2. Live Repository Re-Verification

Directly re-inspected this turn, not trusted from `docs/80`–`85`:

| Item | Verified state |
|---|---|
| `SITE_NAME` | `"Gracious Obeagu"`, unchanged |
| `SITE_URL` | `process.env.SITE_URL ?? "http://localhost:3000"`, unchanged |
| `metadataBase` | `new URL(SITE_URL)`, root layout, unchanged |
| Root `openGraph`/`twitter` | `{ siteName, locale: "en_US", type: "website" }` / `{ card: "summary_large_image" }`, unchanged |
| `alternates.canonical` | Present and self-referencing on all 10 files Task 8.3 touched, unchanged |
| `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL` | Real, unchanged, all three actually rendered (Footer, `/about`'s Contact section; `GITHUB_URL` also in Header) |
| Content schema (`schema.ts`) | `articleFrontmatterSchema` (shared by Knowledge/Work/Engineering Log) includes `coverImage?`, `author?` — both **optional**, both **unused by every real document** (confirmed, §5) |
| `git status` | 12 files modified (Tasks 8.1–8.3's own already-approved output), 7 docs untracked — zero drift |

All assumptions this task's own prompt states as established (§1 of the prompt) hold exactly.

---

## 3. Existing Structured Data State

```
grep -rln "application/ld+json|ld+json|schema.org|@context|@type|json-ld|JSON-LD|structuredData|structured data" src/
```

**One match, correctly not implementation**: `src/lib/content/toc.ts` line 32, a comment reading *"structured data only, no UI here"* — the generic English phrase ("well-organized data"), not a Schema.org reference. No `<script type="application/ld+json">` exists anywhere. No `schema-dts`, `next-seo`, or any JSON-LD library is a dependency (`package.json`, checked directly). **Zero structured data exists anywhere in this repository.**

---

## 4. Route and Content Inventory

| Route | Exists? | Content type |
|---|---|---|
| `/` | Yes | Homepage — featured Knowledge, featured Work, recent Engineering Log |
| `/about` | Yes | Static, single author-biography page |
| `/search` | Yes | Query-driven results view, `robots: { index: false }` |
| `/knowledge` | Yes | Listing/landing |
| `/knowledge/[slug]` — topic branch | Yes (8 real topics, 4 populated) | Listing of real articles sharing a topic |
| `/knowledge/[slug]` — article branch | Yes (7 real articles) | Single evergreen technical document |
| `/work` | Yes | Landing — curated/featured subset |
| `/work/library` | Yes | Complete case-study archive |
| `/work/[slug]` | Yes (4 real case studies) | Single project documentation |
| `/engineering-log` | Yes | Chronological listing |
| `/engineering-log/[slug]` | Yes (2 real entries) | Single dated journal entry |
| `not-found.tsx` (404) | Yes | Error page |

No route was invented. Corpus re-confirmed this turn: 7 Knowledge, 4 Work, 2 Engineering Log, 13 total real documents, zero drafts.

---

## 5. Content Semantics

Real frontmatter fields, by collection (`articleFrontmatterSchema`, extended per collection — `schema.ts`, re-read in full this turn):

| Field | Shared? | Required? | Real usage |
|---|---|---|---|
| `title`, `description` | All three | Required | 100% — every document |
| `publishedAt` | All three | Required | 100% |
| `updatedAt` | All three | Optional | **0 of 13** real documents set it |
| `tags` | All three | Default `[]` | Real, populated on every document |
| `technologies` | All three | Default `[]` | Work only, in practice (0 Knowledge/Engineering-Log documents set it) |
| `difficulty` | All three | Optional | Populated on most Knowledge/Work documents |
| `coverImage` | All three | Optional | **0 of 13** — confirmed by grep this turn |
| `author` | All three | Optional | **0 of 13** — confirmed by grep this turn |
| `series`/`seriesOrder` | All three | Optional | 0 of 13 |
| `topic` | Knowledge only | Required | 100% of Knowledge |
| `domain`, `status` | Work only | Required | 100% of Work |

**No document names its own author. No document sets a cover image.** Both facts are load-bearing for §24/§25/§26.

---

## 6. Site / Person Entity Analysis

Real, directly-verified evidence for a `Person` entity — every value traced to an actual, rendered source, none invented:

| Property | Value | Source |
|---|---|---|
| `name` | `"Gracious Obeagu"` | `SITE_NAME` |
| `url` | `SITE_URL` | Existing constant |
| `jobTitle` | `"Backend Engineer & Technical Lead"` | `ABOUT_HEADER_COPY.headline`, rendered verbatim on `/about` |
| `description` | The real `/about` introduction paragraphs | `ABOUT_HEADER_COPY.introduction` |
| `email` | `CONTACT_EMAIL` | Already publicly rendered as a `mailto:` link (Footer, `/about`) |
| `sameAs` | `[GITHUB_URL, LINKEDIN_URL]` | Both real, both already rendered as real `<a>` links |
| `image` | `public/images/portrait.jpeg`, 1080×998 | Real file, already `next/image`-rendered on `/about` (§26 — the one narrow exception to this review's own no-images default) |

**Explicitly not invented, confirmed by direct inspection of `about-copy.ts`'s own docstring** (*"no employer, year, or project count appears here that isn't already real, checked-in content"*): no `worksFor`, no `alumniOf`, no `award`, no physical `address`/location, no Twitter/X handle (none exists, `docs/82` §7's own finding, unchanged).

**Where should it live?** Fully defined once, with a stable `@id`, on the homepage (the page every crawler is most likely to treat as canonical for site-wide entities) — every other page that needs to reference it (as `author`, as `WebSite.publisher`, as `AboutPage`'s own subject) uses a bare `{"@id": "..."}` pointer, not a repeated full object (§20, §21).

---

## 7. Homepage Strategy

**Adopt**: `WebSite` (name, url, description — all real, matching existing `openGraph`) with `publisher` referencing the `Person` by `@id`; the full `Person` node itself, defined here.

**Reject**: `ProfilePage` for `/` — the homepage is a composite landing page (featured Knowledge, featured Work, recent log entries), not a single-entity profile view; `AboutPage`/`ProfilePage` semantics belong to `/about`, not `/`.

**Reject**: `ItemList` on the homepage — the featured selections shown here are explicitly curated, cross-collection, and not a single deterministic collection (§14's own reasoning applies with even more force here, three different curated subsets on one page).

**Reject**: `Organization` — no evidence anywhere in this repository that the site represents anything other than one individual (`docs/01-PERSONAL_BRAND.md`'s own framing, `SITE_NAME` itself being a person's name, not a company name).

---

## 8. About Page Strategy

`/about` is a single, static page whose entire content is a first-person biography (`about-copy.ts`, re-read this turn — Header, Journey, Engineering Principles, Current Interests, Tools, Learning Roadmap, Contact).

**Adopt**: `AboutPage`, with `mainEntity` referencing the `Person` node by `@id` (not redefining it — the full definition lives on the homepage, §6, §20).

**Reject**: stacking `ProfilePage` on top of `AboutPage`. Schema.org's `ProfilePage` is meant for a page whose primary content *is* a structured profile (social-network-style); `/about` is prose-shaped biography content, which `AboutPage` already describes correctly. Adding a second type here would be decorative, not evidence-based — the exact failure mode this task's own §4 warns against.

---

## 9. Knowledge Strategy

**Adopt: `TechArticle`** (a real, valid Schema.org subtype of `Article`), not `BlogPosting`, not generic `Article`, not `CreativeWork`.

**Why**: Knowledge is explicitly evergreen technical reference content (`/knowledge`'s own real description: *"A long-term collection of engineering concepts, architecture decisions..."*) — not dated commentary (`BlogPosting`'s own semantic fit) and not narrative/documentary (Work's own better fit, §16). `TechArticle` is the schema.org type specifically meant for exactly this shape of content.

**Properties populated, all from real frontmatter** (re-verified §5): `headline`/`name` (`title`), `description`, `datePublished` (`publishedAt.toISOString()`), `dateModified` (`updatedAt?.toISOString()`, correctly absent on all 7 real articles today), `keywords` (`tags`, a defensible, direct mapping — schema.org's own `keywords` property is documented as free-text/tag-shaped, matching this repository's own free-form tag model exactly), `author`/`publisher` (both reference `Person` by `@id`, §25), `url`/`@id` (the real canonical URL, §22), `mainEntityOfPage` (same canonical URL).

**Not populated, explicitly**: `image` (§26), `articleSection` (topic could map here, but see §12's own more careful treatment for why this is better expressed via the page's own `CollectionPage` relationship than duplicated onto every article).

---

## 10. Knowledge Topic Strategy

Topic pages (`/knowledge/[slug]`'s own topic branch, sharing a route file with the article branch but semantically distinct — confirmed live, §4) render a real, deterministic, filtered article list (`getAllArticles().filter(topic === slug)`, re-read this turn) via `TopicArticleList`/`StartHere`.

**Adopt: `CollectionPage`**, with a nested `ItemList` whose items are exactly the articles that page actually renders, in the same order the page itself uses.

**Not `ItemList` alone** — the page is the collection *page*, `ItemList` is one property of it (`mainEntity`), not the page's own top-level type.

**Ordering**: `docs/58`-era discipline (never chronological, never a ranking claim) already governs this page's own visible order; the `ItemList`'s `position` values must match that real rendered order exactly, not a re-sort — no new ordering logic is introduced, the existing resolver's own output order is used as-is.

**4 of 8 real topics are empty** (`system-design`, `cloud`, `performance`, `testing`) — these pages already render an honest "0 Articles" state; their own `CollectionPage`/`ItemList` would correctly show zero items, not be suppressed or fabricated with placeholder content.

---

## 11. Work Strategy

`/work` renders `getFeaturedCaseStudies()` — a **curated subset** (currently 3 of 4 real case studies, featured-then-date-fallback selection, re-read this turn) — plus `ArchitectureHighlights`/`EngineeringPhilosophy`, not the complete Work collection.

**Adopt**: `CollectionPage` (a real, if partial, collection of case studies is genuinely what this page shows).

**Reject**: an `ItemList` nested here. Exposing a 3-of-4 curated subset as a structured `ItemList` risks implying completeness the page doesn't actually have — the same "don't manufacture ordering/completeness" discipline this task's own §14 instruction names directly. The complete, unambiguous list belongs on `/work/library` (§12), which this page's own content already exists to lead readers toward (`work/library/page.tsx`'s own docstring: *"the Landing's Featured Case Studies... exist to lead here, never to compete with it"*) — structured data should respect that same relationship, not duplicate or contradict it.

---

## 12. Work Library Strategy

`/work/library` (`getCaseStudyLibrary()`, re-read this turn) returns **every** real case study — the complete, authoritative archive, confirmed by direct comparison against `getAllCaseStudies()`'s own count (4 of 4).

**Adopt**: `CollectionPage` with a nested, complete `ItemList` (4 items, real order — `case-study-listing.tsx`'s own rendered order, not re-derived).

**Distinguishes cleanly from `/work`** (§11) precisely because this page, unlike the Landing, genuinely is the complete collection — the structured-data distinction mirrors a real, already-documented content distinction, not an invented one.

---

## 13. Work Case Study Strategy

**Adopt: `CreativeWork`**, not `Article`, not `TechArticle`.

**Why, explicitly, per this task's own instruction not to assume `Article` by default**: a case study documents a real, sometimes-still-in-progress project (`vaultpay`'s own `status: "In Progress"`, confirmed §5) — narrative/documentary in shape (Problem → Investigation → Architecture → Decisions → Outcome), not journalistic (`Article`) and not instructional/how-to (`TechArticle`). Schema.org's own `CreativeWork` is the documented, appropriate umbrella type for exactly this case — broader than `Article`, and honest about not forcing a better-but-imperfect fit.

**Properties populated**: `name`, `description`, `datePublished`, `dateModified` (same rules as §9), `author`/`publisher` (`Person`, by `@id`), `url`/`@id` (canonical URL), `keywords` (`tags`).

**Explicitly rejected as fabricated, confirmed absent from the schema itself** (`schema.ts`'s own docstring, re-read §2): repository URLs, live-demo URLs, team size, role — `workFrontmatterSchema` deliberately excludes all of these (*"none of them are load-bearing for the reading experience... Adding schema fields a design proposal never asked... would be scope beyond what this task approved"*) — the identical restraint this review applies to structured data.

**`status`/`domain`**: real, required fields, but no clean Schema.org property exists for "project completion status" or "engineering domain" without stretching a property's own documented meaning — not mapped, rather than force-fit.

---

## 14. Engineering Log Strategy

**Adopt: `BlogPosting`**, deliberately distinct from Knowledge's `TechArticle` (§9) — per this task's own explicit instruction not to force both collections into one type.

**Why**: `/engineering-log`'s own real description — *"A chronological record of engineering discovery — debugging sessions, experiments, failed approaches..."* — is precisely `BlogPosting`'s own semantic territory (dated, journal-shaped, first-person-adjacent), the opposite framing from Knowledge's deliberately evergreen, non-time-sensitive one. This distinction is not invented for this review — it is this repository's own, already-documented Milestone 6/7 architecture (Engineering Log's own IA explicitly makes chronology its primary structure, a fact `case-study-relationships.ts`'s own docstring and `docs/37` both already state).

**Properties**: same shape as Knowledge (`headline`, `description`, `datePublished`, `dateModified`, `author`/`publisher`, `keywords`, `url`/`@id`) — no `articleSection` (Engineering Log carries no `topic`/`domain`-equivalent field, confirmed §5, mirroring the identical, already-established finding `docs/83` §8 made for this exact collection's Open Graph `section` field).

---

## 15. Breadcrumb Strategy

**Adopt `BreadcrumbList`, and only on the three routes that render a real, visible `Breadcrumb` component** — re-confirmed by direct grep this turn: `Breadcrumb` is imported in exactly `knowledge/[slug]/page.tsx` (article branch only — **not** the topic branch, confirmed by reading the actual JSX), `work/[slug]/page.tsx`, and `engineering-log/[slug]/page.tsx`. No other route renders one.

**Exact hierarchies, read directly from each route's own live JSX this turn — not inferred**:

| Route | Visible breadcrumb items |
|---|---|
| Knowledge article | Knowledge → [Topic] → [Article title] |
| Work case study | Work → Case Study Library → [Case study title] |
| Engineering Log entry | Engineering Log → [Entry title] (**two levels, not three** — no intermediate category, matching this collection's own chronology-first IA) |

**Every `item` URL uses the same real, canonical route path** (`/knowledge`, `/knowledge/[topic-slug]`, `/work`, `/work/library`, `/engineering-log`) already live in each page's own navigation.

**Reject `BreadcrumbList` anywhere else**: topic pages, listing pages, `/`, `/about`, `/search`, 404 — none renders a visible breadcrumb (confirmed by the same grep), and this task's own §18 instruction is explicit that structured breadcrumb data must never describe a hierarchy a reader can't actually see.

---

## 16. ItemList Strategy

Consolidated from §10/§11/§12: exactly two real, well-evidenced `ItemList` candidates — Knowledge topic pages (§10) and `/work/library` (§12) — both real, complete-for-what-they-represent, deterministically ordered collections already produced by existing resolvers. **No new selection algorithm is introduced anywhere** — every `ItemList`'s own items are read from the exact array the page's own component already renders, not re-queried or re-sorted. `/work` (§11) is the one considered-and-rejected case, specifically because its own list is a curated subset, not a complete collection — the risk of implying false completeness outweighs any benefit.

---

## 17. Search Strategy

**Reject all structured data on `/search`, including `SearchAction`.**

`SearchAction` (via `WebSite.potentialAction`) exists specifically to let a search engine construct new, parameterized URLs into a site's own search results (the "sitelinks search box" feature) — but `/search` already, deliberately carries `robots: { index: false }` (Task 8.1, unmodified since). Recommending `SearchAction` here would be directly self-contradictory: telling a crawler "please generate links into this page" while simultaneously telling it "do not index this page." This is not a historical-pattern-avoidance decision — it is a concrete, evidence-based rejection specific to this repository's own already-approved `robots` policy, which this task does not modify.

No `WebPage` node is proposed for `/search` either — nothing about a query-driven, non-indexable results view benefits from a structured-data description a crawler is explicitly told not to index.

---

## 18. 404 Strategy

**No structured data on `not-found.tsx`**, mirroring the identical, already-established reasoning Tasks 8.2/8.3 both applied (`openGraph`/`alternates.canonical` both correctly absent there too) and `sitemap.ts`'s own pre-existing comment (*"404 (not a canonical URL)"*). A 404 response has no real content or canonical identity for any schema type to truthfully describe — emitting one, even a generic `WebPage`, would misrepresent a nonexistent resource as valid, indexable content, exactly the failure mode this task's own §28 instruction warns against.

---

## 19. Draft / Publication Strategy

Re-confirmed this turn (§4): zero real draft documents exist anywhere; `articleExists()`/`caseStudyExists()`/`engineeringLogEntryExists()` remain not draft-filtered (the same, already-documented, already-deliberate architecture Tasks 8.1–8.3 each independently found and declined to change). **This review introduces no new draft-aware structured-data logic.** Were a draft document to exist, it would receive the identical structured-data treatment a published document gets — consistent with, not a new exception to, the pattern this entire Milestone 8 sequence has held to. No frontmatter, content, or publication-model change is proposed anywhere in this document.

---

## 20. Entity Graph Strategy

**Adopt: one `@graph`-wrapped JSON-LD document per page**, not several independent `<script>` tags — reduces `@context` repetition and lets a single page's own multiple entities (e.g., an Article plus a BreadcrumbList) reference each other cleanly within one document, the documented, commonly-used pattern for multi-entity pages.

**Cross-page entity reuse — the real constraint, stated precisely**: `@graph`/`@id` linking only de-duplicates entities *within one page's own JSON-LD document* — there is no mechanism for one page's script to literally reference another page's own separately-served HTML response. The correct pattern (and the one major search engines' own documentation describes for exactly this multi-page-single-entity case) is: define the `Person`/`WebSite` nodes **in full** on the one page most likely to be treated as their canonical source (the homepage, §7, and/or `/about`, §8), and have every *other* page's own `author`/`publisher` property be a **minimal `{"@id": "<SITE_URL>#person"}` reference**, not a repeated full object. This avoids the "duplicate entity" risk this task's own §35 names, without inventing a cross-page synchronization mechanism this static-generation architecture has no way to provide.

---

## 21. `@id` Strategy

| Entity | `@id` | Deserves a stable ID? |
|---|---|---|
| `Person` | `` `${SITE_URL}#person` `` | Yes — referenced from every content page's `author`/`publisher`, and from `AboutPage.mainEntity` |
| `WebSite` | `` `${SITE_URL}#website` `` | Yes — a natural anchor for `publisher`/site-wide references |
| Every `TechArticle`/`BlogPosting`/`CreativeWork` | Its own real canonical URL (§22, direct reuse, no new value) | Yes — already the natural, unique identifier for that document |
| `CollectionPage` (topic pages, `/work/library`) | Its own real canonical URL | Yes, same reasoning |
| `AboutPage` | `/about`'s own real canonical URL | Yes |
| `BreadcrumbList` | None needed | No — never referenced *by* another node in this architecture, so no cross-reference value from giving it one |

**Deterministic**: every `@id` is either the site origin plus a fixed fragment (`#person`, `#website`) or a document's own already-established canonical URL — no new ID-generation scheme, no randomness, no content-hash-based identifier.

---

## 22. Canonical URL Relationship

Every content node's `url`/`@id`/`mainEntityOfPage` value is the **exact same string** Task 8.3 already established as that route's own `alternates.canonical` value — not recomputed, not a second URL-construction path. Concretely: each dynamic route's existing local `url` variable (already shared between `alternates.canonical` and `openGraph.url` as of Task 8.3's own implementation, confirmed live §2) is reused a third time for the structured-data node's own identifiers. **No alternate URL variant, no query parameter, no non-canonical route form appears anywhere in this proposed architecture.**

---

## 23. Open Graph Relationship

`metadataBase` / `alternates.canonical` / `openGraph.url` / a structured-data node's own `url` may all resolve to the identical absolute string for a given document — and in this repository's own concrete case, they always will (§22) — but each still serves a distinct consumer: `metadataBase` is resolution infrastructure; `alternates.canonical` tells search-indexing crawlers which URL is authoritative; `openGraph.url` tells social-sharing crawlers which URL to attribute a shared link to; a structured-data node's own `url`/`@id` tells a machine-reading crawler which real-world entity a specific block of `<script>` content describes. **No Open Graph field is duplicated inside JSON-LD merely because a same-named property exists** — `openGraph.title`/`.description` and a `TechArticle.headline`/`.description` happen to hold the same real string in this repository, because both are reading the same underlying `frontmatter.title`/`.description`, not because one was copied from the other.

---

## 24. Date Strategy

**Adopt**: `datePublished` from `frontmatter.publishedAt.toISOString()` — real, required, already the exact source used for `openGraph.publishedTime` (Task 8.2). `dateModified` from `frontmatter.updatedAt?.toISOString()` — real, optional, correctly resolves to absent on all 13 real documents today (0 of 13 set it, §5), mirroring `openGraph.modifiedTime`'s own identical, already-proven-correct behavior.

**Explicitly rejected**: git commit dates, filesystem `mtime`, build timestamps — none of these is a content date this repository has ever treated as one anywhere in its own architecture (RSS, Sitemap, and every prior Milestone 8 task all read `publishedAt`/`updatedAt` exclusively) — introducing a different date source for structured data specifically would create a second, disagreeing notion of "when was this published," exactly the fabrication risk this task's own §4/§24 instruction warns against.

---

## 25. Author / Publisher Strategy

**Adopt: both `author` and `publisher` resolve to the same `Person` entity** (by `@id`, §20), on every `TechArticle`/`BlogPosting`/`CreativeWork` node.

**Why this is not fabrication despite zero document setting `author` in its own frontmatter** (§5): this is a single-author personal portfolio, not a multi-author publication — `SITE_NAME`'s own already-established role (the one documented site identity, `docs/01-PERSONAL_BRAND.md`, already used as `openGraph.siteName` on every page) already carries exactly this fact structurally. Attributing every document to the one real person who wrote this entire site is a true statement the repository already implies everywhere, not an invented one — the same reasoning that already justified reusing `SITE_NAME` as every route's own title suffix (Task 8.1).

**Reject `publisher: { "@type": "Organization" }`** — no evidence anywhere in this repository names or implies a company distinct from the individual author (§7). `publisher` here is the same `Person`, a legitimate, common, self-published-content pattern schema.org itself accommodates directly (author and publisher are not required to differ).

---

## 26. Image Strategy

Consistent with `docs/82` §3/§10's own already-exhaustive, re-confirmed-unchanged finding (§4): **zero content images exist anywhere** — no `coverImage`, no inline MDX image, across all 13 real documents. **No image property is added to any `TechArticle`/`BlogPosting`/`CreativeWork`/`CollectionPage` node.**

**One narrow, well-evidenced exception: `Person.image`.** `public/images/portrait.jpeg` is real, already publicly served, already `next/image`-rendered on `/about`, with known raw file dimensions (1080×998, confirmed by direct inspection this turn). This is a genuinely different case from content images — it is the one real, already-existing, already-verified image asset in the entire repository, directly representing the `Person` entity it would be attached to (not a generic placeholder, not a stand-in for missing content imagery). **Adopted**, referenced via its true absolute URL (composed via `metadataBase`, matching every other URL-based field's own established pattern) and its real file dimensions — **not** the CSS-cropped presentation dimensions used on `/about` itself (the crop is a rendering choice, not a property of the underlying file; structured data should describe the actual served asset).

**No placeholder or invented image is proposed anywhere.**

---

## 27. Validation Strategy

**Static analysis**: `pnpm exec eslint`, `pnpm exec tsc --noEmit` — both already part of every prior Milestone 8 task's own release gate, unchanged in kind.

**Build**: `pnpm build` must succeed with the same static/SSG classification already established.

**Rendered HTML** (not source objects alone): for every route this task's own eventual implementation touches, confirm a `<script type="application/ld+json">` exists, contains syntactically valid JSON (`JSON.parse` succeeds), has the correct `@context`/`@type`(s), and that every `url`/`@id` matches that route's own already-verified canonical value (Task 8.3).

**Three distinct validation tiers, not conflated**:
1. **Syntax validation** — the JSON itself parses. Necessary, not sufficient.
2. **Schema.org structural validation** — an external tool (e.g., Google's Rich Results Test or the Schema.org validator) confirms the chosen types/properties are structurally well-formed per the vocabulary. Also necessary, still not sufficient for the third tier.
3. **Search-engine rich-result eligibility** — a *separate*, stricter bar (e.g., Google's own documented Article rich-result requirements typically expect an `image` property). **This architecture does not claim rich-result eligibility for `TechArticle`/`BlogPosting`/`CreativeWork` nodes**, precisely because they correctly omit `image` (§26) — an accepted trade-off of truthfulness over decoration, stated explicitly rather than left as an implied claim this review has no evidence for.

---

## 28. Duplication / Source-of-Truth Strategy

Every structured-data property this review recommends is a **direct read of data an existing resolver already returns to the same route's own `generateMetadata()`** — `getArticleBySlug()`, `getCaseStudyBySlug()`, `getEngineeringLogEntryBySlug()`, `getAllArticles()` (topic branch), `getCaseStudyLibrary()`. **No second content-resolution path, no new query, no new filter/sort logic is introduced anywhere in this architecture.** The one real gap this review identifies without solving (per this task's own explicit "identify the gap, don't solve it during discovery" instruction, §31): none — every property this review recommends adopting already has a real, available source; every property without one is explicitly rejected or deferred (§30), not worked around.

---

## 29. Performance Considerations

One `@graph`-wrapped `<script>` per page (§20) — not per-entity separate scripts, minimizing repeated `@context` boilerplate. Payload size is small and bounded (a handful of string/date fields per node, no images, no nested large arrays beyond a topic page's own already-small article lists — currently at most 3 items per topic, §10). No new filesystem read is introduced (§28) — every value is already in memory by the time each route's own existing `generateMetadata()` runs. **No caching, no build-time precomputation beyond what static generation already does, is proposed** — none is evidenced as needed at this corpus size (13 real documents).

---

## 30. Adopt / Reject / Defer Decisions

### Adopt

- `Person` (site-wide, `@id`-referenced) — `name`, `url`, `jobTitle`, `description`, `email`, `sameAs` (GitHub, LinkedIn), `image` (the one real portrait, §26).
- `WebSite` (homepage) — `name`, `url`, `description`, `publisher` (→ Person).
- `AboutPage` (`/about`) — `mainEntity` (→ Person).
- `TechArticle` (Knowledge articles) — `headline`, `description`, `datePublished`, `dateModified` (when present), `keywords`, `author`/`publisher` (→ Person), `url`/`@id`, `mainEntityOfPage`.
- `BlogPosting` (Engineering Log entries) — same shape as `TechArticle`, no `articleSection`.
- `CreativeWork` (Work case studies) — `name`, `description`, `datePublished`, `dateModified`, `keywords`, `author`/`publisher` (→ Person), `url`/`@id`.
- `CollectionPage` + `ItemList` — Knowledge topic pages (§10), `/work/library` (§12).
- `BreadcrumbList` — Knowledge article, Work case study, Engineering Log entry routes only (§15), matching each route's own real, visible breadcrumb exactly.

### Reject

- `Organization` — no evidence of anything beyond one individual (§7, §25).
- `ProfilePage` — `AboutPage` already correctly describes `/about`; stacking both is decorative (§8).
- `ItemList` on `/work` — a curated, partial subset; risks implying false completeness (§11).
- `SearchAction`/any structured data on `/search` — directly contradicts its own existing `noindex` policy (§17).
- Any structured data on 404 — no real, canonical content exists to describe (§18).
- `image` on any content node (`TechArticle`/`BlogPosting`/`CreativeWork`/`CollectionPage`) — zero real content images exist anywhere (§26).
- Repository/live-demo URLs, team size, role on Work nodes — not modeled in the schema itself, would be invented (§13).
- `articleSection` on Engineering Log — no analogous field exists (§14).
- Twitter/X `sameAs` entry, `worksFor`, `alumniOf`, `award`, physical address on `Person` — none evidenced anywhere (§6).

### Defer

- `Person.knowsAbout` derived from aggregate tag/topic data — evidence-adjacent (tags are real), but treating an aggregate of authored *content* tags as an authored *skills* assertion is an editorial stretch this review does not resolve; a future task could revisit this with an explicit editorial decision, not inferred silently.
- Whether a small, per-collection entity-builder function (e.g., one pure mapping function per collection, mirroring `toSummary()`/`toCaseStudySummary()`'s own established precedent) is justified, versus inlining each node's construction directly in its own route file — a real design choice with reasonable arguments either way, left for the implementation plan to decide with the exact code in front of it (§31, §33).
- Any future content type gaining real cover imagery (Milestone 8's own Image Optimization task, still separate and future) — would reopen §26's "no content images" finding at that time, not before.

---

## 31. Exact Future Implementation Manifest

| # | Path | Change | Schema responsibility | Data source | Route scope | Static/dynamic | Shared helper? | Must remain untouched |
|---|---|---|---|---|---|---|---|---|
| 1 | `src/components/content/json-ld.tsx` (new) | New, small rendering primitive: takes a plain object, renders `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(...)}} />` | Rendering only — no entity construction, no data fetching | None (pure presentational) | Used by every route below | N/A | **Yes — the one new file, justified because raw script injection needs a single, consistent, safe implementation, not a data/URL abstraction** | — |
| 2 | `src/app/page.tsx` | Add `Person` + `WebSite` graph via the new component | Full `Person` definition (§6), `WebSite` (§7) | `SITE_NAME`, `SITE_URL`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `ABOUT_HEADER_COPY` | `/` | Static | — | Existing `metadata` export unchanged |
| 3 | `src/app/about/page.tsx` | Add `AboutPage` node, `Person` referenced by `@id` (not redefined) | `AboutPage` (§8) | Same constants, `@id` reference only | `/about` | Static | — | Existing `metadata` export unchanged |
| 4 | `src/app/knowledge/[slug]/page.tsx` | Topic branch: `CollectionPage`+`ItemList` (§10); article branch: `TechArticle`+`BreadcrumbList` (§9, §15) | Both node shapes | `getAllArticles()`, `getArticleBySlug()`, both already read by this file's own `generateMetadata()` | 8 topic + 7 article routes | Dynamic | Open question (§30, Defer) | Fallback (`{}`) branch behavior |
| 5 | `src/app/work/[slug]/page.tsx` | `CreativeWork`+`BreadcrumbList` (§13, §15) | `CreativeWork` | `getCaseStudyBySlug()`, already read | 4 routes | Dynamic | Open question | Fallback branch |
| 6 | `src/app/work/library/page.tsx` | `CollectionPage`+`ItemList` (§12) | `CollectionPage` | `getCaseStudyLibrary()`, already read | `/work/library` | Static | — | Existing `metadata` unchanged |
| 7 | `src/app/engineering-log/[slug]/page.tsx` | `BlogPosting`+`BreadcrumbList` (§14, §15) | `BlogPosting` | `getEngineeringLogEntryBySlug()`, already read | 2 routes | Dynamic | Open question | Fallback branch |

**Not expected to change**: `src/app/work/page.tsx` (§11 — `CollectionPage` without `ItemList` is a real, evidenced candidate, but marginal enough that the implementation plan should confirm it's worth the file touch at all, rather than this document pre-committing it); `src/app/knowledge/page.tsx`, `src/app/engineering-log/page.tsx` (listing pages with no single deterministic collection shape distinct from their own topic/library counterparts); `src/app/search/page.tsx`, `src/app/not-found.tsx` (§17, §18 — explicitly rejected); `sitemap.ts`, `rss.ts`/`rss.xml/route.ts`, `next.config.ts`, `schema.ts`, every resolver file, every content file — none is touched by anything in this review.

---

## 32. Implementation Sequence

Not executed here; named for the eventual implementation plan:

1. Re-verify this discovery's own findings against the live repository at authoring time.
2. Build the shared rendering primitive (§31, file 1) — the one prerequisite every other step depends on.
3. Homepage `Person`/`WebSite` (file 2) — must exist before any other page's `@id` references are meaningful.
4. `/about` (file 3).
5. Knowledge (file 4) — both branches.
6. Work case studies (file 5), `/work/library` (file 6).
7. Engineering Log (file 7).
8. Static analysis, build, rendered-HTML verification (§27).
9. External Schema.org/Rich-Results validation, with eligibility claims scoped honestly (§27).
10. Git scope review against this exact manifest.

---

## 33. Release Gate

Design only, for the eventual implementation:

1. Every route in §31's manifest renders exactly one `@graph`-wrapped `<script type="application/ld+json">`, valid JSON.
2. Every `@id`/`url` matches that route's own already-verified `alternates.canonical` value exactly (§22).
3. `Person`/`WebSite` are fully defined exactly once (homepage); every other reference is a bare `@id` pointer (§20).
4. No `image` property appears on any `TechArticle`/`BlogPosting`/`CreativeWork`/`CollectionPage` node.
5. `Person.image` (if implemented) resolves to the real, absolute portrait URL at its true file dimensions.
6. `BreadcrumbList` appears only on the three routes with a real, visible breadcrumb, matching that breadcrumb's own exact items.
7. No structured data appears on `/search` or 404.
8. `datePublished`/`dateModified` match real frontmatter exactly, with `dateModified` correctly absent where `updatedAt` is unset.
9. `openGraph`/`twitter`/`alternates.canonical` all remain unchanged (regression against Tasks 8.1–8.3).
10. ESLint / TypeScript / build all clean.
11. `git diff --stat` matches the manifest exactly.

---

## 34. Risks

| # | Risk | Mitigation named in this review |
|---|---|---|
| 1 | Fabricated schema properties | Every adopted property traced to real, existing data (§5–§26); every unavailable property explicitly rejected, not left ambiguous (§30) |
| 2 | Schema type mismatch with actual content semantics | §9/§13/§14 each individually justify their own type against the collection's own real, documented purpose, not a default |
| 3 | Duplicate entities | `@id`-reference architecture (§20, §21) |
| 4 | Conflicting `url`/canonical values | Every node reuses the exact Task 8.3 canonical string (§22) |
| 5 | Stale structured data | Sourced from the same live resolvers every other metadata surface already reads — no separate cache or snapshot |
| 6 | Structured data describing content not visible on the page | §15's own breadcrumb-matching discipline; §11's own rejection of `/work`'s partial-list `ItemList` |
| 7 | Incorrect author/publisher semantics | §25's own explicit reasoning for why `Person`-as-both is truthful here, not fabricated |
| 8 | Incorrect date semantics | §24 — only `publishedAt`/`updatedAt`, never git/filesystem/build dates |
| 9 | Duplicate JSON-LD graphs | One `@graph` per page (§20) |
| 10 | Unnecessary `ItemList` generation | §11's own explicit rejection for the one candidate that didn't clear the bar |
| 11 | Structured data on 404 | §18 |
| 12 | Structured data for unpublished/draft content | §19 — unchanged, already-deliberate architecture |
| 13 | Duplicated resolver logic | §28 — every property reads an already-fetched value |
| 14 | Payload bloat | §29 |
| 15 | False rich-result-eligibility assumptions | §27's own explicit three-tier validation distinction |

---

## 35. Rollback

Limited strictly to the files in §31's own manifest, once built — each addition is additive (a new component file, plus new JSX in each route's own body, no removal of existing `metadata` exports). Reverting is a matter of removing the new `json-ld.tsx` file and the corresponding JSX additions from each of the 6 modified route files. **No rollback of Task 8.1 (Metadata), Task 8.2 (Open Graph), or Task 8.3 (Canonical URLs) is proposed or implied** — none is touched by this review or would be touched by its eventual implementation. `sitemap.ts`/RSS/robots remain untouched throughout.

---

## 36. Non-Goals

Canonical URL changes, Open Graph changes, metadata title/description changes, robots changes, sitemap changes, RSS changes, Search implementation changes, content changes, frontmatter changes, image optimization, image generation, lazy loading, Lighthouse optimization, analytics, route restructuring, redirects, middleware, URL rewriting, and any performance work unrelated to structured data itself. Confirmed: none of these was touched by this review, and none is proposed for the eventual implementation.

---

## 37. Final Recommendation

Implement a `@graph`-based JSON-LD architecture, rendered via one new, small, purely presentational shared component (`json-ld.tsx` — the only new file this review identifies as justified), reusing every value from data each route already fetches for its own existing `generateMetadata()` call. Adopt `Person`/`WebSite` (site-wide, `@id`-referenced, fully defined once), `AboutPage`, `TechArticle` (Knowledge), `BlogPosting` (Engineering Log), `CreativeWork` (Work case studies), `CollectionPage`+`ItemList` (Knowledge topics, `/work/library` only), and `BreadcrumbList` (the three routes with a real, visible breadcrumb, matching exactly). Reject `Organization`, `ProfilePage`, `SearchAction`, any image beyond the one real portrait, any `ItemList` on `/work`'s own curated subset, and every property this review could not trace to real repository evidence. Every URL, date, and identifier reuses Tasks 8.1–8.3's own already-established values — nothing is recomputed, nothing is a second source of truth.

This review is grounded entirely in the live repository, re-verified this turn — every cited field, component, resolver, and route was read directly, not carried forward from any prior document unchecked.

**No implementation is authorized by this document.**

---

## Verification

```
git status --short
```

Confirmed:

```
 M src/app/about/page.tsx
 M src/app/engineering-log/[slug]/page.tsx
 M src/app/engineering-log/page.tsx
 M src/app/knowledge/[slug]/page.tsx
 M src/app/knowledge/page.tsx
 M src/app/layout.tsx
 M src/app/not-found.tsx
 M src/app/page.tsx
 M src/app/search/page.tsx
 M src/app/work/[slug]/page.tsx
 M src/app/work/library/page.tsx
 M src/app/work/page.tsx
?? docs/79-MILESTONE_8_ROADMAP_REVIEW.md
?? docs/80-METADATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
?? docs/81-METADATA_IMPLEMENTATION_PLAN.md
?? docs/82-OPEN_GRAPH_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
?? docs/83-OPEN_GRAPH_IMPLEMENTATION_PLAN.md
?? docs/84-CANONICAL_URLS_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
?? docs/85-CANONICAL_URLS_IMPLEMENTATION_PLAN.md
?? docs/86-STRUCTURED_DATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md
```

The 12 modified `src/app/` files are Tasks 8.1–8.3's own already-approved, already-implemented output — unchanged by this task. **Only `docs/86-STRUCTURED_DATA_DISCOVERY_AND_ARCHITECTURE_REVIEW.md` is attributable to this task.**
