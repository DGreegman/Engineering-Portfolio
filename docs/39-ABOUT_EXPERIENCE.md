# 39 — About Experience

## Status

Proposal — awaiting review and approval.

> No production implementation is authorized by this document.

Task 6.3's design proposal, following `docs/12-Implementation Roadmap.md`'s Milestone 6 — Core Pages sequence, after Task 6.1 (Homepage Integration) and Task 6.2 (Engineering Log Experience), both complete and approved.

---

## 1. Purpose

Every homepage section built so far — `ReadmeHero`, `CurrentFocus`, `HowIThink`, and closing with `BeyondTheCode` — already exists and is already correctly scoped. `BeyondTheCode` in particular is explicitly documented, in its own file, as deliberately minimal: title, four paragraphs, one CTA, "no photo, skills list, timeline, stats, resume summary, or social grid." Its own docstring states its CTA points at `/about`, "where identity and contact actually live," specifically so it "stays reflective rather than becoming a second, compressed About page."

That destination has never existed. `docs/03-SITEMAP.md` already names what it should contain (Journey, Engineering Principles, Current Interests, Tools, Learning Roadmap, Contact); `docs/01-PERSONAL_BRAND.md` already contains substantial real identity, philosophy, and positioning content nothing on the site currently surfaces. Task 6.3 exists to design the page that finally uses that material — the one homepage's own closing section has been pointing at since it was built.

---

## 2. Current State (Reconnaissance)

Verified against the actual repository, not assumed.

### Homepage / `BeyondTheCode`

`src/app/page.tsx` renders `BeyondTheCode` last, before the global footer. `src/components/home/beyond-the-code.tsx` (confirmed by direct read): a Server Component, `Section` + `Stack`, title + `BEYOND_THE_CODE_COPY.introduction.map(...)` (four paragraphs) + one `Button`/`Link` CTA. No photo, no metadata, no grid — matches its own docstring exactly. `BEYOND_THE_CODE_COPY` (`lib/constants/homepage-copy.ts`, confirmed) is real, checked-in copy: *"Every system tells a story, but so does the person who builds it... I'm a backend engineer who enjoys understanding how systems work..."* CTA: `{ label: "Let's Connect →", href: "/about" }`. The CTA's own label — "Let's Connect," not "Learn More" or "Read More" — is itself evidence of how the homepage already expects About to be framed: a connection point first, a biography second.

### Navigation

`lib/navigation/config.ts`'s `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION` already list `{ label: "About", href: "/about" }` — unchanged since Milestone 2, alongside Knowledge/Work/Engineering Log. All three of those now resolve (Milestones 5–6.2); About is the last of the four to not yet exist.

### Route

**No `/about` route exists.** No file under `src/app/about/` anywhere.

### `content/pages/`

Exists on disk (`content/pages/.gitkeep` only) — **not** a registered collection in `lib/content/collections.ts` (confirmed: only `knowledge`, `work`, `engineering-log`, `series`, `technologies` are registered). Nothing in the codebase reads from it. This task's own Critical Rules explicitly forbid registering it. See §11 for why that's the architecturally correct call, not just a scope boundary being obeyed.

### Identity source material — real, substantial, and currently unused by any route

`docs/01-PERSONAL_BRAND.md` (confirmed by direct read) already contains, as real checked-in content, not something this proposal invents: a positioning statement ("Gracious Obeagu is a Backend Engineer and Technical Lead specializing in secure backend systems, developer tooling, API design, distributed systems, and engineering best practices"), an engineering philosophy (five stated principles, "Secure by design, not secure as an afterthought" foremost among them), a personality description (Curious, Thoughtful, Calm, Practical, Always learning), current and growing technical strengths, content pillars, and a stated long-term vision. This is the same relationship `docs/13`/`docs/14` already have to the homepage's own copy — a source-of-truth document the actual page copy is drawn from, not paraphrased freely.

`lib/constants/site.ts` already defines `SITE_NAME` ("Gracious Obeagu"), `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL` — every contact fact `docs/03`'s About section asks for except one.

**No resume file exists anywhere in the repository** — checked `public/` (`fonts/`, `icons/`, `images/`, `logos/`, `og/`, all confirmed empty except `fonts/`) and the repository root; no PDF, no resume asset of any kind. `docs/03`'s About section lists "Resume" under Contact's include list. This is a real, concrete content gap — flagged in §21/§26, not silently dropped and not fabricated.

**No portrait photo exists anywhere in the repository** — `public/images/` is empty. `docs/13-HOMEPAGE_EXPERIENCE.md` lists "portrait" as a *possible* About element ("concise biography, current interests, professional links, portrait, contact"), and `docs/01`'s own Visual Identity section says "Professional photography where appropriate" — appropriate, not required. No photo asset exists to make this decision moot either way; flagged, not resolved by fabricating one.

### Layout / typography / prose infrastructure

`Section`, `Stack`, `Container`/`PageContainer` (shared, already used by every page). `Card`/`CardHeader`/`CardContent` (used by `CurrentFocus`, `WorkspaceSnapshot`, and every relationship card across Knowledge/Work/Engineering Log). No MDX pipeline is proposed for this page (§11) — `ArticleBody`, `mdx-components.tsx`, `extractHeadings()`, `TableOfContents` are all Knowledge/Work/Log-specific reading infrastructure this page has no use for, the same way the homepage itself has never needed any of them.

### Metadata / SEO infrastructure

Unchanged since `docs/35`/`docs/37`'s own findings: `lib/metadata/`, `lib/seo/` are empty (`.gitkeep` only); no `SITE_URL`; every real route defines its own plain `export const metadata`.

---

## 3. Discrepancies Found

- **`docs/35-HOMEPAGE_INTEGRATION.md` §27 Q2 asked**: *"Should `content/pages/` be registered as a real collection now, in anticipation of About, or left exactly as it is until the About task needs it?"* This task's own Critical Rules answer it directly: **not registered, not by this task.** §11 below explains why that's also the architecturally correct answer, not merely a scope boundary — About doesn't need a *collection* at all, because there's only ever one About page, the same reason the homepage itself was never built as one.
- **`docs/03-SITEMAP.md`'s Contact "include" list names a Resume link** that has no corresponding asset anywhere in the repository. Not a documentation/code conflict to silently reconcile — a real content gap, reported in §21/§26.
- No other discrepancy found. Every other document consulted (`docs/01`, `docs/12`, `docs/13`, `docs/24`) already anticipated an About page that doesn't yet exist and none claims otherwise.

---

## 4. Core Question: What Does About Add Beyond `BeyondTheCode`?

```
Homepage                              About
   ↓                                     ↓
Meet the Engineer                    Deeper Context
   ↓                                     ↓
Brief orientation                    Who is the engineer?
(4 paragraphs, no structure,         How do they work?
1 CTA — "come find out more")        What do they value?
   ↓                                 Where have they been?
Why continue?                        What are they exploring?
                                      How can someone connect?
```

`BeyondTheCode` already answers *"is there a person behind this, and do they seem worth learning more about"* — that's its entire job, deliberately under-built (docs/13's own "identity reinforces the experience rather than leading it"). About exists to answer everything that question deliberately deferred: **structured** context (Journey, Principles, Interests, Tools, Roadmap — `docs/03`'s own named sections, each a real, separately-addressable question) rather than one continuous four-paragraph reflection, and a **real, complete way to act** on the interest `BeyondTheCode` created (Contact, with every real channel — email, GitHub, LinkedIn — not implied by a single "Let's Connect" link).

The distinction that must hold structurally, not just editorially: **`BeyondTheCode` is a closing beat in someone else's story (the homepage's); About is the opening page of its own.** Reusing `BeyondTheCode`'s own four paragraphs verbatim on `/about` would be the specific failure this task exists to prevent — a reader who followed the "Let's Connect" CTA expecting more would find the same four paragraphs they just read, restructured with a heading. About's content must be **additive**, not a repetition of `BeyondTheCode`'s own copy at greater length.

---

## 5. Problem Statement

`/about` is the last of `PRIMARY_NAVIGATION`'s four destinations to not exist, and the one destination `BeyondTheCode`'s own CTA has pointed at since before this milestone began. Real identity, philosophy, and positioning content already exists (`docs/01`) and is currently unused by any route. Task 6.3 designs the page that closes this gap — structured, deeper context distinct from the homepage's own brief orientation, and the one place `docs/03`'s "no standalone Contact page" decision actually needs to be honored with a real, complete contact section.

---

## 6. Goals

- Establish `/about` as the fourth and final primary navigation destination.
- Provide structured, deeper context the homepage's `BeyondTheCode` deliberately doesn't: Journey, Engineering Principles, Current Interests, Tools, Learning Roadmap (`docs/03`'s own named sections).
- Fold Contact into About as its closing section, honoring `docs/03`'s explicit "no standalone Contact page" decision.
- Ground every section's content in real, already-checked-in material (`docs/01-PERSONAL_BRAND.md`, `lib/constants/site.ts`) — never fabricated biography, credentials, or claims.
- Keep the page editorially content, not a data-collection-driven listing — About has no plural collection behind it the way Knowledge/Work/Engineering Log do.
- Preserve visual and tonal consistency with the rest of the Engineering Workspace — restrained, documentation-first, never a resume page or a marketing bio.
- Responsive, accessible, performant, server-first — the same bar every prior page in this workspace already meets.
- A bounded SEO/metadata scope matching every other route.

## 7. Non-Goals

- Registering `content/pages/` as a collection, or any MDX-based content model for this page (§11) — explicitly forbidden by this task, and architecturally unnecessary regardless.
- A resume/CV download — no such asset exists (§2); not fabricated, not stubbed with a dead link (§21, §26).
- A portrait photo — no such asset exists; not required by any governing document, not fabricated.
- A skills-rating system, a progress bar, a percentage-based competency chart — `docs/01`'s own "Things We Never Do" list already forbids "skill progress bars," "rate technologies with percentages" outright; restated here so this task doesn't reintroduce what that document already rejected.
- A blog, a timeline widget, an interactive resume builder, a contact form (email/GitHub/LinkedIn links already are the contact mechanism — `docs/03`'s own "footer's social links... double as the quick-contact path").
- A scheduling/calendar integration — `docs/03` names it explicitly as "(future)," not this task's.
- Analytics, comments, testimonials, a guestbook.
- Redesigning the homepage's `BeyondTheCode` — it stays exactly as it is; this task only builds the page it already points to.

None of these boundaries need to move based on anything found in the repository.

---

## 8. Information Architecture

```
About (/about)
        │
        ├── About Header             Who is this, in one line?
        ├── Journey                   How did they get here?
        ├── Engineering Principles    How do they think about building software?
        ├── Current Interests          What are they exploring right now?
        ├── Tools                      What do they actually build with?
        ├── Learning Roadmap           Where is this heading?
        └── Contact                    How does someone reach them?
```

Matches `docs/03-SITEMAP.md`'s own "Recommended sections" list for About exactly (Journey, Engineering Principles, Current Interests, Tools, Learning Roadmap, Contact) — this proposal doesn't reorder, rename, or add to that list; it specifies each section's question, source, and presentation.

### Section by section

**About Header.** *Who is this, in one line?* Editorial, static — name, a one-line positioning statement drawn directly from `docs/01`'s own Positioning Statement, not a restatement of `BeyondTheCode`'s four paragraphs. No portrait (§2 — none exists; §21/§26 for the open question of whether one should exist eventually).

**Journey.** *How did this engineer get here?* `docs/03`'s own word — "Journey," not "Experience" or "Career History" — matters: a narrative, not a resume-style chronological list of employers and dates. Grounded in real, verifiable facts only; where the repository doesn't yet contain enough real career-history detail to write this section truthfully, it should be written honestly at whatever length the real material supports, never padded to look more complete than it is (the identical discipline the Work case studies already held themselves to when real source material was thin — Task 5.7's own review found and corrected exactly this risk once already).

**Engineering Principles.** *How do they think about building software?* The one section with the most real, ready-to-use source material — `docs/01`'s own five-point Engineering Philosophy ("Correct before clever... Secure by design, not secure as an afterthought") is already written, already approved, already the same content `docs/13`'s "How I Think" section draws its own homepage-scoped version from. About's version can be the fuller statement `docs/01` already contains; `HowIThink` (homepage) stays the compressed, homepage-scoped one — same source document, two different depths, not two different claims (§12).

**Current Interests.** *What are they exploring right now?* The About-scoped, fuller counterpart to the homepage's own `CurrentFocus` section — same relationship as Engineering Principles/How I Think above: one real source, two depths, not two independent claims that could drift apart (§12).

**Tools.** *What do they actually build with?* `docs/01`'s own "Technical Strengths" (Current + Growing Expertise) and "Content Pillars" sections already name this — Go, Node.js, Python, backend architecture, API design, security engineering, etc. Presented as plain, quiet text — never a logo wall, never a percentage-rated skill bar (`docs/01`'s own explicit rejection of both, §7).

**Learning Roadmap.** *Where is this heading?* `docs/01`'s own "Future Identity" (Distributed Systems Engineer, Solutions Architect, Cloud Security Engineer...) and "Growing Expertise" sections already state this directly — a forward-looking section grounded in the same document as every other section, not invented fresh for this page.

**Contact.** *How does someone reach them?* The one section `docs/03` explicitly requires here rather than on a standalone page — Email, GitHub, LinkedIn (all three already real constants in `lib/constants/site.ts`), Resume (real gap, §21/§26), an optional scheduling link (`docs/03`'s own "(future)" — not this task's).

---

## 9. Reading Journey

```
Arrival (BeyondTheCode's "Let's Connect" CTA, primary nav, footer, or a direct link)
        ↓
About Header — "who is this, in one line"
        ↓
Journey — "how did they get here"
        ↓
Engineering Principles — "how do they think"
        ↓
Current Interests — "what are they exploring now"
        ↓
Tools — "what do they build with"
        ↓
Learning Roadmap — "where is this heading"
        ↓
Contact — "how do I reach them"
```

Ordered from *past* (Journey) through *present* (Principles, Interests, Tools) to *future* (Roadmap), closing on the one actionable step (Contact) — the same "orientation before action" shape `docs/13`'s own homepage narrative already uses at a larger scale (Knowledge/Work before Meet the Engineer before the footer). A reader arriving with high intent (already decided to reach out) can skip straight to Contact — nothing above it is a gate a reader has to pass through first, the same "leave with something even from a partial read" standard every document experience in this workspace already holds itself to.

---

## 10. Navigation

`PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, and `BeyondTheCode`'s own CTA **all already point at `/about` correctly** — this task makes that destination real; it does not change where anything points. No new navigation entry point is proposed. About needs no internal sub-navigation (no TOC, no sidebar) — six short sections read top to bottom on one page, the same "no reading-navigation infrastructure needed" call the homepage itself already makes.

---

## 11. Content Architecture — Why Not `content/pages/`

**The governing fact: About has no plural collection behind it.** Knowledge, Work, and Engineering Log each exist because there will be *more than one* article, case study, or log entry over time — that's exactly why each earned an MDX collection, a schema, a loader, and a listing page. There will only ever be **one** About page. A one-item "collection" is not a collection; it's a single, hand-authored document, and this workspace already has a proven pattern for exactly that: the **homepage itself**, which is not MDX-backed either — it's a Server Component tree reading copy from a `lib/constants/*.ts` file (`homepage-copy.ts`).

This task's Critical Rules (no `content/pages/` registration) align exactly with this reasoning, not merely constrain it. **Recommendation: About follows the homepage's own precedent precisely** — a new `lib/constants/about-copy.ts` (mirroring `homepage-copy.ts`'s own shape: one named export per section, e.g. `ABOUT_HEADER_COPY`, `JOURNEY_COPY`, `ENGINEERING_PRINCIPLES_COPY`, etc.) and a set of Server Components reading from it, composed directly in `app/about/page.tsx` — no MDX, no frontmatter schema, no loader.

`content/pages/` itself is not deleted or repurposed by this proposal — it's simply confirmed, precisely, to not be what About needs. If a future task ever introduces genuinely multiple, MDX-authored static pages (`docs/03`'s own "Future Expansion" list names candidates — Now, Speaking, Resources, Uses, Books — several of which *would* be genuinely plural or benefit from MDX's richer formatting), `content/pages/` may be exactly the right place for that — but that is a different, larger architectural question than one single About page needs answered now, and this proposal doesn't answer it on that future task's behalf.

---

## 12. Relationship with the Homepage's `BeyondTheCode`

```
BeyondTheCode (homepage)              About (/about)
        │                                    │
        ▼                                    ▼
Brief, reflective, closing            Structured, complete, opening
        │                                    │
        ▼                                    ▼
"Is there a person worth            "Who are they, how do they work,
 learning more about?"               what do they value, where have
                                      they been, what's next, how do
                                      I reach them?"
```

**Same source, different depth — never two independent claims.** Both draw from `docs/01-PERSONAL_BRAND.md`; `BeyondTheCode`'s four paragraphs stay exactly as they are (this proposal doesn't touch that file), and About's Engineering Principles/Current Interests sections are the fuller version of the same underlying philosophy/focus `docs/13`'s "How I Think"/"Current Focus" already compress for the homepage. This is the identical "one real source, several scoped depths" discipline `docs/29-WORK_LANDING_PROPOSAL.md` §6 already established for Engineering Lessons → Knowledge Articles, applied here to a single person's own stated identity instead of a technical concept.

**No literal text reuse.** About's Journey/Principles/Interests sections should be written at About's own depth, not `BeyondTheCode`'s four paragraphs copy-pasted under new headings — the specific failure mode §4 names directly.

**One remaining link, unchanged:** `BeyondTheCode`'s own CTA already reads "Let's Connect →" pointing at `/about` — this proposal doesn't ask for that copy to change; About's own Contact section is what finally makes good on it.

---

## 13. Relationship with Contact

`docs/03-SITEMAP.md` states this explicitly, not left to inference: *"There is no standalone Contact page — this section is the frictionless way to reach out that a dedicated page used to provide... Since there's no standalone Contact page, the footer's social links (GitHub, LinkedIn, Email) double as the quick-contact path."* Two consequences for this proposal:

- **About's Contact section is not a new mechanism** — it presents the same three real channels (`GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, all already in `lib/constants/site.ts`) the footer already surfaces, at About's own point in the page rather than only at the bottom of every page.
- **No contact form, no new backend, no email-sending infrastructure** — every existing contact path is already a direct link (`mailto:`, `https://github.com/...`, `https://linkedin.com/...`); About reuses the same links, not a new interactive mechanism.

---

## 14. Component Reuse

| Existing Component | Reuse Purpose | Modification Needed? |
|---|---|---|
| `Section` / `Stack` / `Container` | Every section's layout rhythm | None |
| `Card` / `CardHeader` / `CardContent` | If Tools or Current Interests benefit from a light card treatment (an implementation-task decision, not fixed here) | None |
| `Button` | Contact section's email/GitHub/LinkedIn links, if button-styled rather than plain links (implementation-task decision) | None |
| `GithubIcon`, `LinkedinIcon`, `Mail` (lucide) | Contact section — the exact icons `Footer`'s own `FooterConnect` already uses | None |
| `lib/constants/site.ts` | `GITHUB_URL`, `LINKEDIN_URL`, `CONTACT_EMAIL`, `SITE_NAME` | None |

**New, genuinely necessary:** `app/about/page.tsx` and a small set of Server Components under `components/about/` (one per §8 section, or a small number combining adjacent ones — an implementation-task granularity decision), plus `lib/constants/about-copy.ts` (§11). No new client component anywhere — every section is static, editorial content, the same server-first posture the homepage itself already holds.

---

## 15. Data / Loader Architecture

**None required.** This is the one Core Pages task in this milestone with no resolver, no loader, no relationship-resolution logic of any kind — About has no collection to query, no relationship to another collection to resolve, no Previous/Next (there's exactly one About page; adjacency is meaningless). The entire "data layer" is a copy-constants file read directly by Server Components, identical in kind to how `app/page.tsx` already reads `homepage-copy.ts`.

---

## 16. Visual Hierarchy / Restraint

`docs/01-PERSONAL_BRAND.md`'s own Visual Identity and "Things We Never Do" sections already state the governing rules for this page more specifically than any prior proposal in this series needed to restate them, because they're identity-brand rules, not just page-design ones:

**Explicitly rejected, per `docs/01` itself:** skill progress bars, percentage-rated technologies, spinning icons, loading animations, autoplaying video, excessive gradients, meaningless statistics, inflated experience claims. **Explicitly preferred:** minimal, generous whitespace, strong typographic hierarchy over decoration, motion that communicates state rather than entertains.

Applied to this page specifically: Tools reads as plain text, not a badge wall (the same "quiet metadata line, not a primary identity" restraint `docs/31-CASE_STUDY_EXPERIENCE.md` §3 already established for Work's own technology lists, now applied to a person's tools instead of a project's). Journey reads as prose, not a timeline widget with dates as its organizing structure (the identical "causality over chronology" principle `docs/33-PROJECT_EVOLUTION.md` §7 already established for Work's own evolution narrative — a person's journey deserves the same discipline a system's does). Contact is a short, quiet list of real links — never a prominent "Hire Me" button or a call-to-action styled more boldly than anything else on the page.

---

## 17. Responsive Behavior

No new pattern. Six short, prose-and-list sections, stacked vertically — the same `Section`/`Stack` rhythm every other page in this workspace already uses responsively. No table, no wide code block, no diagram — the lowest overflow-risk page profile of any route built so far.

---

## 18. Accessibility

No new pattern. Exactly one `<h1>` (the About Header's own title); each of the six sections gets its own `<h2>`; Contact's three links each carry real, descriptive accessible names (already true of `FooterConnect`'s identical links, reused verbatim); focus-visible styling inherited unmodified from `Button`/plain-link conventions already used everywhere else. No accessibility requirement here depends on visual appearance alone.

---

## 19. Performance

Fully server-rendered, zero client components — the same bar `docs/35` §18 and `docs/37` §20 already held their own pages to, met here by an even simpler page than either (no relationship resolution, no MDX compilation, nothing beyond static composition).

---

## 20. SEO / Metadata Boundary

`/about` gains its own `export const metadata`, matching every other real route's existing pattern — a real, page-specific title and description, not the root layout's generic fallback. No canonical URL, no Open Graph, no structured data — the identical, already-repeated boundary `docs/35` §19 and `docs/37` §21 both drew: this workspace has no `SITE_URL` yet, and this task doesn't introduce one either.

---

## 21. Empty / Failure States

About has no dynamic, collection-backed content, so most of this workspace's usual "what happens when a collection is empty" questions don't apply here — the relevant failure mode for this page is different in kind: **content that's expected but doesn't yet exist as a real asset.**

| Condition | Behavior |
|---|---|
| No resume file exists (confirmed, §2) | Contact section omits a Resume link entirely — the same "never a fabricated placeholder for a field that isn't there" rule `ProjectHeader`'s own `technologies` field already applies, restated here for a real, external asset instead of frontmatter. Never a dead link, never a "coming soon" placeholder standing in for content that isn't ready — `docs/37` §22's own "no copy standing in for real content" ruling, applied to a file instead of a collection. |
| No portrait photo exists (confirmed, §2) | About Header omits any image entirely — not a placeholder avatar, not a generic icon standing in for a photo. |
| Journey has less real material than the other sections | Written honestly at whatever length the real material supports — shorter is honest, padding it to match the other sections' length is not (§8's own explicit note). |
| A future scheduling link doesn't exist yet | Omitted entirely — `docs/03`'s own "(future)" framing, not stubbed. |

---

## 22. Architecture Decisions

### D1 — Copy-Constants, Not `content/pages/`

**Context:** `content/pages/` exists on disk, unregistered; About needs some content source.

**Options Considered:** (a) register `content/pages/` as a new MDX collection for About; (b) follow the homepage's own precedent — a `lib/constants/*.ts` file read directly by Server Components.

**Chosen Approach:** (b) — also this task's own Critical Rule, but independently the architecturally correct call (§11).

**Rationale:** About is a singular page, not a growing collection — MDX/schema/loader infrastructure exists in this workspace specifically to serve collections with more than one real member over time. Building that infrastructure for exactly one document that will never have a sibling is the "new abstraction where an existing pattern already fits" `docs/24` Principle 2 warns against, in the opposite direction from usual (over-building a collection system, not under-reusing one).

**Trade-offs:** editing About's copy requires a code change (a `.ts` file edit + redeploy), not a content-only MDX edit — identical to how editing the homepage's own copy already works today, so this isn't a new kind of friction this workspace doesn't already accept elsewhere.

**Consequences:** `content/pages/` remains available, unregistered, for a genuinely different future need (§11's own list of candidates) without this proposal pre-committing that future task to any particular shape.

### D2 — One Real Source Document, Several Scoped Depths

**Context:** `docs/01-PERSONAL_BRAND.md` already backs both the homepage's `HowIThink`/`CurrentFocus`/`BeyondTheCode` and (per this proposal) About's Engineering Principles/Current Interests/Journey.

**Options Considered:** (a) treat About's content as independent from the homepage's, written fresh; (b) treat both as different-depth readings of the same source document, explicitly.

**Chosen Approach:** (b).

**Rationale:** the person being described doesn't change between the homepage and About — only how much is said about them does. Writing About independently risks two pages making subtly different claims about the same engineer's philosophy or focus, exactly the "two collections, two sources of truth, drifting apart" failure mode `docs/24` Principle 3 exists to prevent, now applied to a person's own stated identity rather than a content collection.

**Trade-offs:** none identified.

**Consequences:** a future edit to `docs/01`'s own stated philosophy should prompt checking both the homepage's and About's copy for consistency — a content-maintenance discipline, not a code dependency (there's no shared import between `homepage-copy.ts` and the proposed `about-copy.ts`; the link is editorial, not structural).

### D3 — No Resume, No Portrait, Until Real Assets Exist

**Context:** `docs/03` names both; neither exists.

**Options Considered:** (a) build the UI slot for each now, disabled/placeholder, ready for a future asset; (b) omit both entirely until real assets exist.

**Chosen Approach:** (b).

**Rationale:** this workspace already has an established, different pattern for "real feature, not built yet" (`Header`'s disabled Search/RSS icons, honestly labeled "coming soon") versus "content that doesn't exist" (`docs/37` §22's "never a placeholder standing in for real content"). A resume and a portrait are the second kind — assets, not features — and this workspace's own discipline for that case is omission, not a styled placeholder.

**Trade-offs:** Contact section is one link lighter than `docs/03`'s own full list until a resume exists.

**Consequences:** none blocking — adding either later is a content change (drop a file in `public/`, add one link/image), not a redesign.

---

## 23. Implementation Scope

### Must implement

- `app/about/page.tsx` with its own `export const metadata`.
- `lib/constants/about-copy.ts` (§11), grounded in `docs/01-PERSONAL_BRAND.md`.
- Six Server Components (or a smaller number combining adjacent sections, an implementation-task granularity choice) under `components/about/`, covering §8's six sections.
- Contact section reusing `GITHUB_URL`/`LINKEDIN_URL`/`CONTACT_EMAIL` from `lib/constants/site.ts`.

### May implement if already supported by existing infrastructure

- Nothing further — this page needs no relationship resolution, no new shared-component modification, no loader.

### Explicitly deferred

- A resume/CV asset and its Contact link (D3, §21).
- A portrait photo (D3, §21).
- A scheduling/calendar link (`docs/03`'s own "(future)").
- Any MDX-based content model for About or for `content/pages/` generally (§11's own note that a future, genuinely-plural static-pages need is a separate question).

---

## 24. Verification Plan

### Functional
- `/about` renders all six sections with real, `docs/01`-grounded content — no lorem, no placeholder biography.
- Contact's three links resolve to the real `mailto:`/GitHub/LinkedIn destinations, matching the footer's own.
- Every existing link into this destination (`PRIMARY_NAVIGATION`, `FOOTER_NAVIGATION`, `BeyondTheCode`'s CTA) now resolves instead of 404ing.
- About's own copy is verified, side by side, to not be a verbatim reuse of `BeyondTheCode`'s four paragraphs (§4/§12's own explicit failure mode).

### Responsive / Accessibility / Technical
Identical bar to every prior page-level verification in this repository: `pnpm exec eslint`, `pnpm exec tsc --noEmit`, `pnpm build`, heading hierarchy, keyboard navigation, focus visibility, no horizontal overflow, light/dark mode, reduced motion.

### Regression
The homepage (`app/page.tsx`, `BeyondTheCode` and every other section), `PRIMARY_NAVIGATION`/`FOOTER_NAVIGATION`'s own files, and every existing route remain unchanged — this proposal's implementation should touch no file any of them depend on.

---

## 25. Acceptance Criteria

- The Homepage/About distinction (§4) is stated as an explicit, testable design rule, not left implicit.
- Information architecture matches `docs/03`'s own named About sections exactly (§8).
- The `content/pages/` question is resolved architecturally, not just avoided (§11, D1) — including why it's the correct call, not only the compliant one.
- Every section's content source is named and real (`docs/01`, `lib/constants/site.ts`) — nothing here asks a future task to fabricate biography.
- Missing assets (resume, portrait) are identified precisely and handled by omission, not fabrication or placeholder UI (§21, D3).
- No production code, component, route, or content was modified to produce this document.

---

## 26. Open Questions

**Q1 — Should a resume be authored and added to `public/`, or is Contact's real, final shape "Email, GitHub, LinkedIn" without one?**
*Why it matters:* affects whether Contact's implementation ships with three links or four. *What's blocked:* nothing in this proposal — omission is the correct default either way (D3) until the answer changes. *Evidence needed:* a real resume file, or an explicit decision that this workspace intentionally doesn't offer one (the case-study-driven, "show don't tell" positioning `docs/01` itself argues for arguably makes a traditional resume optional by design — but that's an editorial call this document doesn't make on its own).

**Q2 — Should a professional portrait eventually be added, and if so, where does the asset come from?**
*Why it matters:* `docs/01`'s "professional photography where appropriate" leaves this genuinely open, not settled either way. *What's blocked:* nothing — omission is correct until a real photo exists. *Evidence needed:* an editorial decision plus a real asset, neither of which this proposal can supply.

**Q3 — How much real "Journey" material actually exists to write from?**
*Why it matters:* determines whether Journey is a substantial section or a brief, honest one (§8/§21's own "shorter is honest" note). *What's blocked:* nothing architecturally — the section's shape doesn't change, only its length. *Evidence needed:* whoever authors this page's real copy providing (or confirming the limits of) real career-history detail; not resolvable by inspecting this repository alone.

---

## 27. Final Recommendation

**Recommended architecture:** a single, server-rendered, copy-constants-driven page — no MDX, no collection, no loader, no relationship resolution — following the homepage's own precedent exactly rather than reaching for the collection-and-schema pattern Knowledge/Work/Engineering Log each needed for a genuinely different reason (multiple real documents over time). The one architectural risk worth stating plainly: it would be easy to implement this page by copying `BeyondTheCode`'s four paragraphs under six new headings, satisfying the letter of `docs/03`'s section list while failing the actual point of this task (§4) — the real work is writing six sections that say something `BeyondTheCode` didn't, grounded in `docs/01`'s real material, not restating it at greater length.

**Recommended implementation sequence**, once approved:
1. `lib/constants/about-copy.ts`, drafted directly against `docs/01-PERSONAL_BRAND.md` section by section.
2. The six section components + `app/about/page.tsx`.
3. Metadata.
4. Full verification pass (§24), including the explicit side-by-side check that About's copy doesn't duplicate `BeyondTheCode`'s.

**Known risks:**
- Q1–Q3 (§26) mean Contact and Journey may ship intentionally incomplete relative to `docs/03`'s full aspirational list — an accepted, honest state (§21), not a defect.
- The temptation to under-invest in writing genuinely new copy for this page, given how much of `docs/01`'s material could be lifted with minimal editing, is real — worth naming for whoever implements this next.

**This document authorizes no implementation.** Task 6.3's actual build requires its own review and approval, following the same workflow every prior milestone in this repository has used.
