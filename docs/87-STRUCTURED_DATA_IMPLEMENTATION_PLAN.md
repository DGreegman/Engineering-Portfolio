# 87 — Task 8.4 (Structured Data): Implementation Plan

## 1. Executive Summary

`docs/86`'s architecture is re-verified exactly against the live repository this turn (§2) — zero drift on any schema-type decision. **One real, previously-unaddressed implementation-level refinement was found and resolved here, not in `docs/86`**: JSON-LD cannot be emitted from `generateMetadata()` (it returns a `Metadata` object, not JSX) — it must be rendered from each route's own default-exported page component, which is a **separate function invocation with its own scope**, not one that shares local variables with `generateMetadata()`. Every dynamic route already independently re-fetches its own content in both functions (confirmed live, §2) — this plan specifies that JSON-LD construction follows that exact, already-established pattern (re-fetch via the same resolver, recompute the same URL formula) rather than assuming a literal shared variable that doesn't exist across the function boundary.

`docs/86`'s own schema-type/property decisions (Adopt/Reject/Defer, its own §30) are treated as final and are not re-litigated here — this plan converts them into an exact, file-level, deterministic specification.

**No implementation is authorized by this document.**

---

## 2. Live Repository Re-Verification

| Item | Verified state | Matches `docs/86`? |
|---|---|---|
| `SITE_NAME`, `SITE_URL`, `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL` | Unchanged | Yes |
| `metadataBase`, root `openGraph`/`twitter` | Unchanged | Yes |
| `alternates.canonical` on all 10 Task 8.3 files | Present, self-referencing, unchanged | Yes |
| Zero JSON-LD anywhere | Re-confirmed by grep; the one `toc.ts` match is still the same unrelated comment | Yes |
| `articleFrontmatterSchema` — `author`, `coverImage` | Both still optional, still `0/13` real documents set either | Yes |
| `Breadcrumb` usage | Still exactly `knowledge/[slug]/page.tsx` (article branch only), `work/[slug]/page.tsx`, `engineering-log/[slug]/page.tsx` | Yes |
| Corpus | 7 Knowledge, 4 Work, 2 Engineering Log, 13 total, zero drafts | Yes |
| **`generateMetadata()` vs. the default page component** | **Two separate function invocations, each independently awaiting `params` and independently calling its own `getXBySlug(slug)` — confirmed by direct re-read of all three dynamic routes' complete files this turn** | **Refinement, not a contradiction — `docs/86` reasoned at the property/schema-type level and did not need to resolve this; this plan does (§21 below)** |
| `getArticleMetadata(article)` | A pure mapping over an already-fetched `ContentItem` — the page component has full access to `article.frontmatter.*` (title/description/publishedAt/updatedAt/tags/topic), the same data `generateMetadata()` independently reads | Confirms §21's own resolution is safe — no data is unavailable, only inaccessible *across the function boundary*, not inaccessible *at all* |
| `getCaseStudyLibrary().caseStudies` | The exact, real, rendered order `CaseStudyListing` consumes on `/work/library` | Yes, matches `docs/86` §12 |

**No discrepancy invalidates any part of `docs/86`'s own architecture.** The one refinement (§21) is additive precision, not a correction.

---

## 3. Architecture Decisions from `docs/86` — Reconciled, Not Reopened

All of `docs/86` §30's Adopt/Reject/Defer decisions stand exactly as written. Restated once, briefly, as this plan's own binding contract:

**Adopt**: `Person`, `WebSite`, `AboutPage`, `TechArticle` (Knowledge articles), `BlogPosting` (Engineering Log), `CreativeWork` (Work case studies), `CollectionPage`+`ItemList` (Knowledge topics, `/work/library`), `BreadcrumbList` (the three routes with a real, visible breadcrumb).

**Reject**: `Organization`, `ProfilePage`, `SearchAction`/any `/search` structured data, any 404 structured data, `ItemList` on `/work`, any `image` on content nodes (one narrow exception: `Person.image`, the real About-page portrait).

**Defer**: `Person.knowsAbout` (tag-derived), the exact per-collection helper-vs-inline decision (resolved concretely in this plan, §21).

---

## 4. Structured Data Route Matrix

| Route | Schema type(s) | `BreadcrumbList`? | `ItemList`? |
|---|---|---|---|
| `/` | `Person`, `WebSite` | No | No |
| `/about` | `AboutPage` | No | No |
| `/knowledge` | None | No | No |
| `/knowledge/[topic]` (8 real) | `CollectionPage` | **No** — no visible breadcrumb (re-confirmed §2) | Yes |
| `/knowledge/[slug]` article (7 real) | `TechArticle` | Yes | No |
| `/work` | None (§17) | No | No |
| `/work/library` | `CollectionPage` | No | Yes |
| `/work/[slug]` (4 real) | `CreativeWork` | Yes | No |
| `/engineering-log` | None | No | No |
| `/engineering-log/[slug]` (2 real) | `BlogPosting` | Yes | No |
| `/search` | None (§26) | No | No |
| 404 | None (§27) | No | No |

---

## 5. Entity Graph Strategy

**Adopt one `@graph`-wrapped `<script type="application/ld+json">` per page** — never multiple independent scripts on the same route. Concretely:

```json
{
  "@context": "https://schema.org",
  "@graph": [ /* every node this route contributes */ ]
}
```

- Homepage's own graph: `[Person, WebSite]`.
- `/about`'s own graph: `[AboutPage]`, with `mainEntity` pointing at `{"@id": "<SITE_URL>#person"}` — **not** a second, redefined `Person` node.
- Every `TechArticle`/`CreativeWork`/`BlogPosting` route's own graph: `[Article-shaped node, BreadcrumbList]` (two nodes, one script) where a breadcrumb exists; `[Article-shaped node]` alone where it doesn't apply.
- `CollectionPage` routes' own graph: `[CollectionPage]`, with the `ItemList` embedded as that node's own `mainEntity` property (not a sibling top-level graph member — it has no independent identity outside the page it belongs to).

**Not adopted**: a single, sitewide merged graph spanning multiple pages' own HTML responses — no such mechanism exists in a per-request, statically-generated architecture (§8's own reasoning).

---

## 6. `@id` Strategy

| Entity | `@id` | Where fully defined | Where referenced only |
|---|---|---|---|
| `Person` | `` `${SITE_URL}#person` `` | `/` (homepage) | `/about` (`AboutPage.mainEntity`), every `TechArticle`/`CreativeWork`/`BlogPosting`'s own `author`/`publisher` |
| `WebSite` | `` `${SITE_URL}#website` `` | `/` (homepage) | Not referenced elsewhere in this architecture — no other node's property points at it |
| Every content node (`TechArticle`, `CreativeWork`, `BlogPosting`, `CollectionPage`, `AboutPage`) | Its own real canonical URL (`alternates.canonical`'s own value, §16) | Fully defined on its own route | Never referenced from another route's own graph (no cross-document references beyond `Person`) |
| `BreadcrumbList` | None | Inline, per-route | N/A — never referenced by anything |

**Verified against the real `SITE_URL` value, not assumed**: `process.env.SITE_URL ?? "http://localhost:3000"`, unchanged (§2) — the exact same value already backing `metadataBase`/RSS/Sitemap.

**Duplicate-entity avoidance**: only `Person` is referenced from more than one route; every other node's `@id` is that route's own unique canonical URL, which is by construction never duplicated (no two routes share a canonical URL, confirmed by Task 8.3's own already-verified 1:1 route↔canonical mapping).

---

## 7. Person Strategy

| Property | Value | Source | Required/optional |
|---|---|---|---|
| `@type` | `"Person"` | — | Required |
| `@id` | `` `${SITE_URL}#person` `` | §6 | Required |
| `name` | `SITE_NAME` | `site.ts` | Required, available |
| `url` | `SITE_URL` | `site.ts` | Required, available |
| `description` | `ABOUT_HEADER_COPY.introduction.join(" ")` (or the first paragraph alone — an implementation-level wording choice, not an architecture one; either is real, unaltered prose) | `about-copy.ts` | Optional, available |
| `jobTitle` | `ABOUT_HEADER_COPY.headline` (`"Backend Engineer & Technical Lead."`) | `about-copy.ts` | Optional, available |
| `sameAs` | `[GITHUB_URL, LINKEDIN_URL]` | `site.ts` | Optional, available |
| `image` | Absolute URL to `public/images/portrait.jpeg`, composed via `metadataBase`; real dimensions 1080×998 | Real, existing asset | Optional, available — the one adopted exception (`docs/86` §26) |
| `email` | **Not included** | — | Available, but explicitly not exposed (below) |

**`email` — the one property this task's own prompt specifically asks to be resolved explicitly**: `CONTACT_EMAIL` is real and already publicly rendered as `mailto:` links (Footer, `/about`'s Contact section) — technically available and technically truthful. **Decision: omit it from `Person.email` in structured data.** Rationale: schema.org `Person.email` is documented as machine-readable-first, and structured data is scraped far more aggressively and indiscriminately than a page's own rendered `mailto:` link (which at least sits behind a page render, not a bare, crawlable JSON field) — the same email address already being visible in two places on the rendered site does not obligate a third, more scrape-friendly encoding of it. This is a deliberate omission of an *available* property, not a gap — stated explicitly per this task's own instruction to address the decision, not skip it silently.

---

## 8. WebSite Strategy

| Property | Value | Source |
|---|---|---|
| `@type` | `"WebSite"` | — |
| `@id` | `` `${SITE_URL}#website` `` | §6 |
| `url` | `SITE_URL` | `site.ts` |
| `name` | `SITE_NAME` | `site.ts` |
| `description` | The homepage's own real, existing description (already used for `openGraph.description`, Task 8.2) | `page.tsx`'s own existing `description` local const |
| `publisher` | `{"@id": "<SITE_URL>#person"}` | §6 — reference, not redefinition |

**No `potentialAction`/`SearchAction`** — `/search` is deliberately, entirely excluded from this architecture (§26; `docs/86` §17's own reasoning, unchanged: `SearchAction` would contradict `/search`'s own existing `noindex` policy). **No other property** — nothing else about this site's homepage is evidenced as a real, distinct `WebSite`-level fact beyond what's already listed.

---

## 9. AboutPage Strategy

| Property | Value | Source |
|---|---|---|
| `@type` | `"AboutPage"` | — |
| `@id` / `url` | `/about`'s own real canonical value (§16) | Already computed for `alternates.canonical` (Task 8.3) |
| `name` | `"About"` (matches the route's own existing `title` fragment) | `about/page.tsx`'s own existing `metadata.title` |
| `description` | The page's own real, existing description | `about/page.tsx`'s own existing `description` local const |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 — reference |
| `mainEntity` | `{"@id": "<SITE_URL>#person"}` | §6 — reference, **not** a redefined `Person` object (`docs/86` §11's own explicit instruction) |

---

## 10. Knowledge Article Strategy

Applies only to `/knowledge/[slug]`'s article branch (7 real articles) — **not** the topic branch (§11).

| Property | Value | Source | Populated? |
|---|---|---|---|
| `@type` | `"TechArticle"` | — | Always |
| `@id` / `url` | This article's real canonical URL | Recomputed in the page component as `` `/knowledge/${slug}` `` — the identical formula `generateMetadata()` already uses for its own `alternates.canonical`/`openGraph.url` (§21) | Always |
| `headline` / `name` | `article.frontmatter.title` | `getArticleBySlug(slug)`, already called by the page component for its own rendering | Always |
| `description` | `article.frontmatter.description` | Same | Always |
| `datePublished` | `article.frontmatter.publishedAt.toISOString()` | Same | Always (required field) |
| `dateModified` | `article.frontmatter.updatedAt?.toISOString()` | Same | **Currently never** — 0 of 7 real articles set it; correctly omitted, not defaulted to `datePublished` |
| `keywords` | `article.frontmatter.tags` | Same | Always (real, non-empty on every real article) |
| `author` | `{"@id": "<SITE_URL>#person"}` | §6, §18 | Always |
| `publisher` | `{"@id": "<SITE_URL>#person"}` | §6, §18 | Always |
| `mainEntityOfPage` | Same value as `@id`/`url` | Same computed value | Always |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 | Always |
| `image` | **Omitted** | — | Never (`docs/86` §26, zero real content images) |

---

## 11. Knowledge Topic Strategy

Applies only to the topic branch (8 real topics, 4 populated).

| Property | Value | Source |
|---|---|---|
| `@type` | `"CollectionPage"` | — |
| `@id` / `url` | This topic's real canonical URL, `` `/knowledge/${slug}` `` | Same recomputation pattern as §10 |
| `name` | `topic.title` | `resolveTopic(slug)`, already called by the page component |
| `description` | `topic.description` | Same |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 |
| `mainEntity` | An `ItemList` (below) | — |

**`ItemList`**:

| Property | Value | Source |
|---|---|---|
| `itemListElement` | One `ListItem` per article, `position` matching array index + 1, `url` = each article's own real canonical URL, `name` = each article's own title | **The exact same `topicArticles` array the page component already computes** (`getAllArticles().filter((a) => a.frontmatter.topic === slug)`) — no second filter, no re-sort |

**No `BreadcrumbList`** — re-confirmed live this turn (§2): the topic branch renders no `Breadcrumb` component at all.

**Ordering, stated precisely**: the page's own real rendered order (Start Here picks first, then the remaining shelf, per `TopicArticleList`'s own docstring) is a curated *presentation* order across two visually separate sections, not one flat list. **This plan recommends the `ItemList` use the page's own combined `topicArticles` array before that Start-Here/remainder split** — i.e., the full topic membership in the underlying resolver's own order — rather than re-deriving the two-tier presentation split into structured data, since `ItemList` describes "the members of this collection," not "the visual layout of this page." This is a deliberate, stated choice for the eventual implementation to follow exactly, not an ambiguity left open.

---

## 12. Work Case Study Strategy

| Property | Value | Source |
|---|---|---|
| `@type` | `"CreativeWork"` | — |
| `@id` / `url` | This case study's real canonical URL, `` `/work/${slug}` `` | Recomputed in the page component, same formula `generateMetadata()` uses |
| `name` | `caseStudy.frontmatter.title` | `getCaseStudyBySlug(slug)`, already called by the page component |
| `description` | `caseStudy.frontmatter.description` | Same |
| `datePublished` | `caseStudy.frontmatter.publishedAt.toISOString()` | Same |
| `dateModified` | `caseStudy.frontmatter.updatedAt?.toISOString()` | Same — currently absent on all 4 real case studies, correctly omitted |
| `keywords` | `caseStudy.frontmatter.tags` | Same |
| `author` | `{"@id": "<SITE_URL>#person"}` | §6, §18 |
| `publisher` | `{"@id": "<SITE_URL>#person"}` | §6, §18 |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 |

**Explicitly not mapped, re-confirmed against `workFrontmatterSchema` this turn** (`schema.ts`, unchanged): `domain`, `status`, `timeline`, `technologies` — none has a Schema.org property that fits without stretching its documented meaning (`docs/86` §13's own reasoning, unchanged). `technologies` specifically was considered again this turn: schema.org has no clean "tech stack" property on `CreativeWork` (`keywords` already carries `tags`; forcing `technologies` into `keywords` too would conflate two genuinely different, already-distinct real fields into one schema property, misrepresenting the source data). **No repository URL, no external project URL, no `creator`-distinct-from-`author` property** — none exists in the schema (`schema.ts`'s own docstring, re-read §2, explicitly excludes exactly these fields from the content model itself).

---

## 13. Work Library Strategy

| Property | Value | Source |
|---|---|---|
| `@type` | `"CollectionPage"` | — |
| `@id` / `url` | `/work/library`'s own real canonical value | Already computed for `alternates.canonical` (Task 8.3) |
| `name` | `"Case Study Library"` (matches the route's own existing `title`) | `work/library/page.tsx`'s own existing `metadata.title` |
| `description` | The page's own real, existing description | `work/library/page.tsx`'s own existing `description` local const |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 |
| `mainEntity` | An `ItemList` | — |

**`ItemList`**: `itemListElement` built directly from `library.caseStudies` (`getCaseStudyLibrary()`'s own return value, already called by this page's own component) — the complete, real 4-of-4 collection, in that array's own existing order. **No second selection algorithm** — `getCaseStudyLibrary()` is the one, single source (`docs/86` §12/§16's own explicit instruction, unchanged).

---

## 14. Engineering Log Strategy

| Property | Value | Source |
|---|---|---|
| `@type` | `"BlogPosting"` | — |
| `@id` / `url` | This entry's real canonical URL, `` `/engineering-log/${slug}` `` | Recomputed in the page component, same formula `generateMetadata()` uses |
| `headline` | `logEntry.frontmatter.title` | `getEngineeringLogEntryBySlug(slug)`, already called by the page component |
| `description` | `logEntry.frontmatter.description` | Same |
| `datePublished` | `logEntry.frontmatter.publishedAt.toISOString()` | Same |
| `dateModified` | `logEntry.frontmatter.updatedAt?.toISOString()` | Same — currently absent on both real entries |
| `keywords` | `logEntry.frontmatter.tags` | Same |
| `author` | `{"@id": "<SITE_URL>#person"}` | §6, §18 |
| `publisher` | `{"@id": "<SITE_URL>#person"}` | §6, §18 |
| `mainEntityOfPage` | Same as `@id`/`url` | — |
| `isPartOf` | `{"@id": "<SITE_URL>#website"}` | §6 |

**No `articleSection`** — `articleFrontmatterSchema` (which this collection uses directly, no `topic`/`domain`-equivalent) has nothing to map (`docs/86` §14, re-confirmed §2, unchanged).

---

## 15. Breadcrumb Strategy

Constructed **directly in each of the three routes**, not via a shared helper — per this task's own explicit preference ("prefer direct route construction unless a shared helper clearly reduces duplication without becoming a routing framework"). Each route's own breadcrumb shape is already different (2 vs. 3 levels, different labels) — a shared helper would need per-route configuration anyway, which is exactly the "routing framework" shape this task's own instruction warns against building.

**Exact source of labels/URLs/ordering — re-verified live this turn (§2), not inferred**:

| Route | `BreadcrumbList` items (`position`, `name`, `item` URL) |
|---|---|
| Knowledge article | 1: `"Knowledge"` → `/knowledge`; 2: `articleTopic.title` → `articleTopic.href`; 3 (the page itself): `metadata.title` → this page's own canonical URL |
| Work case study | 1: `"Work"` → `/work`; 2: `"Case Study Library"` → `/work/library`; 3: `metadata.title` → this page's own canonical URL |
| Engineering Log entry | 1: `"Engineering Log"` → `/engineering-log`; 2 (the page itself): `logEntry.frontmatter.title` → this page's own canonical URL |

**Every label and URL is read from the exact same `Breadcrumb items=[...] current={...}` props each route's own JSX already passes** (§2, re-read in full) — not re-derived, not a second hierarchy definition. The final segment (the current page) is included as a `ListItem` with no `item` URL required by the schema for the last position (schema.org's own documented convention for the terminal breadcrumb node), though including it is also valid and this plan does not mandate omitting it — a minor implementation-level choice, not an architectural one.

---

## 16. Canonical URL Integration

**One rule, applied everywhere**: every structured-data node's `url`/`@id` is the identical string already used for that route's own `alternates.canonical` (Task 8.3). For static routes, this is a literal, already-existing string constant in that file. For the three dynamic routes, this plan's own §21 resolves precisely how that value is *obtained* inside the page component (recomputed via the same formula, since the literal variable computed inside `generateMetadata()` is not in scope there). **No third URL-construction mechanism, no query parameter, no incoming-request-derived URL** anywhere in this plan.

---

## 17. Open Graph Integration

No `openGraph` field is copied wholesale into any JSON-LD node. Overlap is coincidental, not derivative: `TechArticle.headline`/`.description` and `openGraph.title`/`.description` hold the same real string only because both independently read `frontmatter.title`/`.description` — the same relationship already established between `alternates.canonical`, `openGraph.url`, and now each JSON-LD node's own `url` (§16). `metadataBase`, `alternates.canonical`, `openGraph.url`, and each structured-data node's `url`/`@id` remain four conceptually distinct fields serving four distinct consumers, per `docs/86` §23's own already-settled reasoning — unchanged here.

---

## 18. Author / Publisher Strategy

**Decision: `author` and `publisher` both resolve to `{"@id": "<SITE_URL>#person"}` on every `TechArticle`/`CreativeWork`/`BlogPosting` node** — not omitted, not inferred per-document from a frontmatter field that doesn't exist.

**Why this is not "inferring authorship merely because the site belongs to one person"** (the exact caution this task's own prompt names): this repository already treats `SITE_NAME` as every document's own implicit identity in a structural, already-shipped way — it is the title-template suffix on every single page (Task 8.1), the `openGraph.siteName` on every single page (Task 8.2). Attributing every document's own `author`/`publisher` to that same, single, already-established identity is not a new inference this task introduces; it is the same fact this milestone has already encoded twice, expressed a third time in the one remaining surface (structured data) where authorship has actual Schema.org meaning. **No per-document `author` frontmatter field is read or required** — the value is constant across all 13 real documents, correctly, because the underlying fact (one author, this whole site) is itself constant.

**No `Organization` publisher** — unchanged from `docs/86` §25; no evidence anywhere names or implies one.

---

## 19. Date Strategy

| Property | Source field | Format | Behavior if absent |
|---|---|---|---|
| `datePublished` | `frontmatter.publishedAt` (a real `Date` at runtime, `z.coerce.date()`) | `.toISOString()` | Never absent — required by schema on all three collections |
| `dateModified` | `frontmatter.updatedAt` (optional) | `.toISOString()` when present | **Omitted entirely** when absent — not defaulted to `datePublished`, not omitted-as-empty-string; the property simply does not appear in that node's own object |

Applies identically to Knowledge, Work, and Engineering Log — all three share `articleFrontmatterSchema`'s own `publishedAt`/`updatedAt` fields (`schema.ts`, re-confirmed §2). **No git history, filesystem timestamp, or build/deployment timestamp is used anywhere** — none of these is a content date this repository has ever treated as one, in any prior Milestone 8 task or otherwise.

---

## 20. Image Strategy

**No `image` property on any `TechArticle`/`BlogPosting`/`CreativeWork`/`CollectionPage`/`AboutPage`/`WebSite` node** — zero real content images exist anywhere (re-confirmed §2). **The one adopted exception**: `Person.image` (§7), the real, existing About-page portrait, at its true file dimensions, referenced by absolute URL. No fallback, placeholder, or logo image is substituted anywhere. This plan explicitly notes, per `docs/86` §30's own "Defer" list, that content images could be reconsidered *if* a future, separate Image Optimization task (still future, still separate) ever populates real per-document imagery — not resolved, decided, or implemented here.

---

## 21. Shared JSON-LD Renderer — Exact Responsibility, and the Function-Boundary Refinement

### 21.1 — `src/components/content/json-ld.tsx`

```ts
// Conceptual shape — no implementation authorized by this document.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

**Input type**: a single plain object (the already-assembled `{ "@context": ..., "@graph": [...] }` shape) — the component never assembles the graph itself, never chooses `@type`s, never fetches content, never computes a URL. **Serialization**: `JSON.stringify(data)`, nothing more — no pretty-printing, no schema transformation.

**Safe HTML injection, addressed explicitly per this task's own instruction**: `JSON.stringify`'s own output can contain a literal `</script>` sequence if a string property ever contained one (none of this repository's real content does today, confirmed — no document title/description contains `</script>`), which would prematurely close the script tag in a browser parser. **The plan requires the eventual implementation to escape the `<` character within `JSON.stringify`'s own output** (e.g., `JSON.stringify(data).replace(/</g, "\\u003c")`) before passing it to `dangerouslySetInnerHTML` — a single, standard, well-known JSON-in-HTML safety transform, not a schema transformation and not business logic; it belongs inside this same rendering primitive, since it's a property of *safely rendering JSON inside a `<script>` tag* in general, not of any one page's own content.

**The component does not**: load content, inspect the current route, generate URLs, decide which `@type` applies, fetch data, or make any metadata decision — every one of those responsibilities lives in the calling route's own file, per this task's own explicit constraint.

### 21.2 — The function-boundary refinement, resolved

**The problem, stated precisely** (§2): `generateMetadata()` and each route's default-exported page component are independent function invocations. Neither can read the other's local variables. `generateMetadata()` already computes a local `url`/`title` for its own `alternates.canonical`/`openGraph.url` (Tasks 8.2/8.3) — but JSON-LD must be rendered from the *page component*, which has no access to that specific variable.

**Resolution, adopted by this plan**: the page component **recomputes the identical URL formula** (`` `/knowledge/${slug}` ``, etc.) independently, using its own already-awaited `slug` — the exact same value, computed the exact same way, in a second, textually-separate expression. This is **not** a new source of truth (§16 still holds — both expressions produce the identical string, by construction, since both are the same literal template applied to the same real `slug`) and **not** the introduction of a shared variable across an API boundary Next.js doesn't support. It mirrors the existing, already-accepted precedent in this exact codebase: `generateMetadata()`'s own two branches (topic/article) each independently define their own local `title`/`url` rather than sharing one across branches, and the page component itself already independently re-fetches the same content a second time per request (`getArticleBySlug(slug)` is called once inside `generateMetadata()` and a second time inside the page component, confirmed unchanged since Task 4.3.1 through today) — recomputing one string template a second time is a strictly smaller repetition than the content-fetch repetition this codebase has already accepted throughout its own history.

**No shared URL-construction helper function is introduced** to avoid this repetition — each formula is a single template literal, one line, and extracting it into a cross-file function for a one-line formula used in two places per route would be the exact "unnecessary abstraction" this task's own §6/§20 instructions warn against, disproportionate to what it would save.

---

## 22. Source-of-Truth Strategy

Every property in §7–§14 above traces to one of exactly four sources: (1) `site.ts`'s existing constants, (2) `about-copy.ts`'s existing exports, (3) a content collection's existing `getXBySlug()`/`getAllX()` resolver — already called by the same page component for its own rendering — or (4) that route's own already-computed canonical URL formula (§21.2). **No new resolver, no new content query, no new filter/sort/selection logic is introduced anywhere in this plan.** The one gap `docs/86` named and did not solve (a `Person.knowsAbout` derived from aggregate tag data) remains unsolved here too — correctly deferred, not worked around.

---

## 23. Validation Strategy

**Static analysis**: `pnpm exec eslint`, `pnpm exec tsc --noEmit`.

**Build**: `pnpm build`, same static/SSG classification as every prior Milestone 8 task.

**Rendered HTML**, for the full route matrix (§4): confirm the `<script type="application/ld+json">` exists exactly where §4 says it should and nowhere it says it shouldn't; `JSON.parse` succeeds on its own content; `@context`/`@type`(s) match §4 exactly; every `url`/`@id` matches that route's own already-verified `alternates.canonical`; visible breadcrumbs (Header/DOM) match `BreadcrumbList` items exactly, in the same order; `ItemList` `itemListElement` matches the page's own actually-rendered list, same order, same count.

**Engineering Log verification, addressed per this task's own explicit caution**: both real Engineering Log entries already exist in the live corpus (`haya-invitation-gate-removal`, `cookeaze-webhook-reliability-gap`) — **no temporary or fabricated entry is needed for verification**; the collection is not empty, and this plan does not propose creating test fixtures.

**Three distinct validation tiers, restated from `docs/86` §27, unchanged**: (1) JSON syntax validity, (2) Schema.org structural validity (an external tool, e.g. the Schema.org validator or Google's Rich Results Test), (3) search-engine rich-result *eligibility* — a stricter, separate bar this architecture does not claim to meet for `TechArticle`/`BlogPosting`/`CreativeWork` nodes specifically because they correctly omit `image` (§20). **Passing tier 1 or 2 must never be reported as satisfying tier 3.**

---

## 24. Exact Future Implementation Manifest

Re-verified against the live repository this turn (§2), not blindly copied from `docs/86`'s own preliminary list:

| # | Path | Why it changes | Schema responsibility | Static/dynamic | Data source | Emits JSON-LD directly? | References shared entities? | Helper required? |
|---|---|---|---|---|---|---|---|---|
| 1 | `src/components/content/json-ld.tsx` (new) | The one new file — rendering primitive | None (pure presentation, §21.1) | N/A | None | N/A — it's the mechanism others use | N/A | **This is the helper; no further helper is required (§21.2)** |
| 2 | `src/app/page.tsx` | Add `Person`+`WebSite` graph | Full definition of both (§7, §8) | Static | `site.ts`, `about-copy.ts` | Yes, via `JsonLd` | Defines the entities others reference | No |
| 3 | `src/app/about/page.tsx` | Add `AboutPage` graph | `AboutPage` (§9) | Static | `about/page.tsx`'s own existing `description` | Yes | References `Person`, `WebSite` by `@id` | No |
| 4 | `src/app/knowledge/[slug]/page.tsx` | Topic branch: `CollectionPage`+`ItemList` (§11); article branch: `TechArticle`+`BreadcrumbList` (§10, §15) | Both node shapes, in the page component (§21.2) | Dynamic | `resolveTopic()`, `getArticleBySlug()`, `getAllArticles()` — all already called | Yes | References `Person`, `WebSite` by `@id` | No |
| 5 | `src/app/work/[slug]/page.tsx` | `CreativeWork`+`BreadcrumbList` (§12, §15) | `CreativeWork` | Dynamic | `getCaseStudyBySlug()`, already called | Yes | References `Person`, `WebSite` | No |
| 6 | `src/app/work/library/page.tsx` | `CollectionPage`+`ItemList` (§13) | `CollectionPage` | Static (reads `getCaseStudyLibrary()` at render time, but the route itself is static-shaped, matching Task 8.1–8.3's own classification of this file) | `getCaseStudyLibrary()`, already called | Yes | References `WebSite` | No |
| 7 | `src/app/engineering-log/[slug]/page.tsx` | `BlogPosting`+`BreadcrumbList` (§14, §15) | `BlogPosting` | Dynamic | `getEngineeringLogEntryBySlug()`, already called | Yes | References `Person`, `WebSite` | No |

**Exactly 7 files — 1 new, 6 modified.** No helper beyond file 1 is introduced anywhere.

---

## 25. Files Explicitly Not Changing

| File | Why it stays untouched |
|---|---|
| `src/app/work/page.tsx` | `docs/86` §11/§17: a curated, partial subset — no `ItemList`; a bare `CollectionPage` without one was considered marginal enough that `docs/86` itself left it to this plan to confirm, and this plan confirms it is **not** worth the file touch — no real, distinct machine-readable fact would be added beyond what `/work/library`'s own `CollectionPage` already provides more completely |
| `src/app/knowledge/page.tsx` | Listing page with no single deterministic collection shape distinct from the topic pages it links to |
| `src/app/engineering-log/page.tsx` | Same reasoning — the real chronological list already has its own better home (each entry's own `BlogPosting`, reachable via the page's own existing links) |
| `src/app/search/page.tsx` | §26 — `noindex`, structural rejection of `SearchAction`/any structured data, unchanged |
| `src/app/not-found.tsx` | §27 — no real, canonical content to describe |
| `src/app/sitemap.ts` | Unrelated mechanism (Sitemap protocol, not `<head>`/JSON-LD); read only if at all, for canonical-URL cross-checking, never modified |
| `src/app/rss.xml/route.ts`, `src/lib/content/rss.ts` | Unrelated mechanism (RSS XML), untouched |
| `src/lib/content/schema.ts` | No new frontmatter field is required — every property this plan specifies already exists (§22) |
| Every resolver file (`articles.ts`, `case-studies.ts`, `engineering-logs.ts`, `relationships.ts`, `case-study-relationships.ts`) | Read only, via calls each page component already makes; no new function, no signature change |
| `content/*.mdx` | No frontmatter change anywhere |
| `next.config.ts` | No configuration change |

---

## 26. Search — Restated

`/search` is not modified, receives no `SearchAction`, no `WebPage`, no structured data of any kind, and its existing `robots: { index: false, follow: true }` is untouched. This is a structural rejection tied directly to that page's own existing, unmodified policy (§8, `docs/86` §17) — not merely deferred, actively excluded.

---

## 27. 404 — Restated

`not-found.tsx` is not modified and emits no structured data. A 404 response describes no real, canonical, indexable resource — nothing in this architecture treats it as one.

---

## 28. Implementation Sequence

1. Re-verify this plan's own contract against the live repository at authoring time (mirrors §2).
2. Build `json-ld.tsx` (§21.1) — every other step depends on it existing first.
3. Homepage `Person`/`WebSite` (§7, §8) — must exist (as the entities other pages' `@id` references point at) before those references are meaningful, though nothing technically breaks if built out of order, since each page's own JSON-LD is independently valid JSON regardless of sequence; this order is for reviewability, not a hard technical dependency.
4. `/about` (§9).
5. Knowledge — both branches (§10, §11).
6. Work case studies (§12), `/work/library` (§13).
7. Engineering Log (§14).
8. `BreadcrumbList` integration — folded into steps 5–7 above, not a separate pass, since each route's breadcrumb node is added in the same file/commit as its own primary schema node.
9. Static analysis (`eslint`, `tsc`).
10. Production build.
11. Production HTML verification (§23).
12. External Schema.org/Rich-Results validation, with eligibility claims scoped honestly (§23).
13. `git diff`/`git status` review against §24's exact manifest.

---

## 29. Release Gate

1. Every route in §4's matrix emits exactly the specified schema type(s), no more, no fewer.
2. Every rejected route/type (`/search`, 404, `ItemList` on `/work`, any content `image`) emits none of the rejected data.
3. Every property traces to real repository data per §7–§14 — no fabricated author/publisher/image/date anywhere.
4. Every `url`/`@id` matches that route's own `alternates.canonical` value exactly (§16).
5. `openGraph`/`twitter` remain unchanged on every route (regression against Tasks 8.1–8.3).
6. Every visible breadcrumb matches its route's own `BreadcrumbList` exactly, same items, same order.
7. Every `ItemList` matches its page's own actually-rendered collection exactly, same items, same order, same count.
8. `Person`/`WebSite` are each defined exactly once (homepage); every other reference is a bare `@id` pointer.
9. Every JSON-LD block is valid JSON, correctly `<`-escaped (§21.1).
10. `/search`'s `robots` and `not-found.tsx`'s behavior are both unchanged.
11. `sitemap.ts`/RSS/`next.config.ts`/`schema.ts`/every resolver/every content file show zero diff.
12. ESLint / TypeScript / production build all clean.
13. `git diff --stat` matches §24's 7-file manifest exactly.

---

## 30. Risks

| # | Risk | Mitigation named in this plan |
|---|---|---|
| 1 | Incorrect schema semantic classification | §3 — every type decision inherited from `docs/86`'s own per-collection reasoning, not re-guessed |
| 2 | Fabricated properties | §7–§14 each trace every property to a real source; §7's own explicit `email`-omission decision |
| 3 | Stale data | Every value read live, at render time, from the same resolvers already in use (§22) |
| 4 | Duplicate entities | `@id`-reference architecture (§6) |
| 5 | Canonical/schema URL divergence | §16, §21.2's own explicit resolution of the one real mechanism that could have caused this |
| 6 | Breadcrumb mismatch | §15 — sourced from the exact same props each route's own visible `Breadcrumb` already uses |
| 7 | `ItemList` ordering mismatch | §11, §13 — sourced from the exact array each page already renders from |
| 8 | Author semantics | §18's own explicit reasoning |
| 9 | Date semantics | §19 |
| 10 | JSON serialization problems (unescaped `</script>`) | §21.1's own explicit escaping requirement |
| 11 | Payload duplication | One `@graph` per page (§5); `Person`/`WebSite` fully defined exactly once (§6) |
| 12 | Schema validation passing while rich-result eligibility is absent | §23's own explicit three-tier distinction, restated |
| 13 | Accidental scope expansion | §24's exact 7-file manifest; §25's explicit untouched-file list |

---

## 31. Rollback

Limited strictly to the 7 files in §24: delete `src/components/content/json-ld.tsx`, and remove the corresponding JSON-LD construction/rendering JSX from each of the 6 modified route files, reverting each to its exact Task 8.3 state. **Does not roll back** Task 8.1 (Metadata), Task 8.2 (Open Graph), Task 8.3 (Canonical URLs), Sitemap, RSS, robots, content, or any unrelated file — none is touched by this plan or its eventual implementation.

---

## Non-Goals

Metadata changes, canonical changes, Open Graph changes, Twitter changes, sitemap changes, RSS changes, robots changes, Search implementation, content changes, frontmatter changes, image optimization, image generation, lazy loading, Lighthouse optimization, analytics, route restructuring, redirects, middleware, URL rewriting, and any unrelated refactoring. Confirmed: none touched by this plan.

---

## Final Recommendation

Build the one new rendering primitive (`json-ld.tsx`) and add `@graph`-wrapped JSON-LD to exactly 6 existing route files, per §24's own deterministic manifest — every property sourced from data each route already fetches, every URL reusing Task 8.3's own already-established canonical values (via the same formula, recomputed once more inside each page component per §21.2's own resolution of the `generateMetadata`/page-component function boundary), every entity reference using stable `@id`s rather than duplicated definitions. `docs/86`'s own Adopt/Reject/Defer decisions are carried forward unchanged; this plan's own one substantive addition is §21.2's precise resolution of how JSON-LD construction actually reaches the data `generateMetadata()` already computes, since the two are — a fact this turn's own re-verification surfaced, not one `docs/86` needed to resolve at its own level of analysis.

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
?? docs/87-STRUCTURED_DATA_IMPLEMENTATION_PLAN.md
```

The 12 modified `src/app/` files are Tasks 8.1–8.3's own already-approved output, unchanged by this task. **Only `docs/87-STRUCTURED_DATA_IMPLEMENTATION_PLAN.md` is attributable to this task.**
