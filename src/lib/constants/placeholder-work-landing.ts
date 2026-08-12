/**
 * Placeholder Work — Landing Page
 *
 * Fixture data for `ArchitectureHighlights` and `EngineeringLessons` (Task
 * 5.1) until the real Work collection and a shared engineering-theme
 * taxonomy exist. Same "stand-in, not invention" posture as
 * `placeholder-knowledge-landing.ts` — kept in its own file so removing it
 * later, once the Content Engine can derive both of these from real case
 * study frontmatter, touches nothing else.
 *
 * `EngineeringThemeEntry` is intentionally its own local type, not
 * `Topic`/`TopicSlug` from `lib/content/topics.ts`. docs/29-WORK_LANDING_
 * PROPOSAL.md §4 documents a shared taxonomy between Architecture
 * Highlights and the Knowledge Library as a **future vision only** — "should
 * be pursued only after the current two-collection architecture... has
 * proven stable." Coupling this file to the Knowledge topic vocabulary
 * today would pull that future scope forward uninvited. Theme titles below
 * were still chosen from the exact theme examples already named in
 * docs/25-WORK_EXPERIENCE.md and docs/27-WORK_EXPERIENCE_DESIGN.md
 * ("distributed systems," "backend architecture," "performance") — nothing
 * here is invented vocabulary.
 *
 * `relatedCaseStudies` references entries from `placeholder-work.ts`'s
 * `PLACEHOLDER_WORK` by `title`/`href` — the single source of truth for
 * projects (see that file's `featured` docstring). A theme does not carry
 * its own copies of case study data, only pointers into the one collection
 * that owns it, per docs/29 §4/§5's single-source-of-truth requirement.
 *
 * Task 5.7's final refinement pass added Haya and Cookeaze to two existing
 * themes below — no new theme was invented for either. Both additions were
 * checked against each project's real case study content before being
 * added, the same evidence discipline `placeholder-work.ts` documents for
 * the entries themselves: Haya joins Backend Architecture because its case
 * study documents real service/API design (the analysis pipeline, the
 * access-control model); Cookeaze joins both Backend Architecture and
 * Distributed Systems, the latter specifically because its case study's
 * central engineering problem — reconciling wallet state once two
 * independent processes (a webhook and a poller) can both try to resolve
 * the same transaction — is exactly what that theme's own description
 * already names, not a stretch to fit it in.
 *
 * `EngineeringLessonEntry.relatedKnowledge` is what makes docs/29 §6
 * ("Engineering Lessons as the Bridge") concrete rather than aspirational:
 * every lesson below links to a real, already-existing entry from
 * `placeholder-knowledge-landing.ts` (same href, same title) instead of a
 * fabricated or duplicated explanation — the lesson states what was learned
 * in practice, the link is where the concept itself is taught in full.
 * `sourceProject` names which case study the lesson was distilled from, in
 * line with the same section's "not every lesson becomes an article, but
 * every article may originate from one of these lessons" — the lesson is
 * shown as evidence-backed, not asserted from nowhere.
 *
 * Task 5.7's final refinement pass resolved all three `relatedKnowledge`
 * links, which previously pointed at Knowledge articles that didn't exist
 * — each was evaluated on its own merits, not defaulted to "just create
 * something":
 *
 * - **Money as floating point** and **optimistic vs pessimistic locking**
 *   both cleared the bar — established, teachable, general engineering
 *   concepts, each directly grounded in a real, already-documented VaultPay
 *   decision (integer-cents arithmetic, pessimistic row locking). Both now
 *   have real articles at the exact hrefs already listed below; only
 *   `content/knowledge/` gained two files, nothing here changed for them.
 * - **"An API's contract outlives whatever framework built it"** (the
 *   original GoHunt entry, linking to `/knowledge/understanding-apis`) did
 *   not clear the bar on inspection — too broad a claim for the specific,
 *   narrower evidence GoHunt's case study actually supports. Rather than
 *   write a thin article to match a vague lesson, the lesson itself was
 *   replaced with GoHunt's real, precisely-evidenced insight (its actual
 *   "Separate DTOs for Fetched, Stored, and API-Exposed Job Data" decision,
 *   already documented in `content/work/gohunt.mdx`), paired with a new
 *   article scoped tightly to that same insight. `sourceProject` stays
 *   "GoHunt" — this is a correction to what the lesson claims, not a swap
 *   to a different project.
 */

export interface EngineeringThemeEntry {
  title: string;
  description: string;
  relatedCaseStudies: { title: string; href: string }[];
}

export const PLACEHOLDER_ARCHITECTURE_HIGHLIGHTS: EngineeringThemeEntry[] = [
  {
    title: "Backend Architecture",
    description:
      "Designing service boundaries, data models, and APIs that stay correct as requirements change underneath them.",
    relatedCaseStudies: [
      { title: "VaultPay", href: "/work/vaultpay" },
      { title: "GoHunt", href: "/work/gohunt" },
      { title: "Haya", href: "/work/haya" },
      { title: "Cookeaze", href: "/work/cookeaze" },
    ],
  },
  {
    title: "Distributed Systems",
    description:
      "Keeping state consistent and correct once more than one process can touch it at the same time.",
    relatedCaseStudies: [
      { title: "VaultPay", href: "/work/vaultpay" },
      { title: "Cookeaze", href: "/work/cookeaze" },
    ],
  },
  {
    title: "Performance",
    description:
      "Finding and removing the slow query, the uncached call, or the blocking operation setting the pace for everything else.",
    relatedCaseStudies: [{ title: "GoHunt", href: "/work/gohunt" }],
  },
];

export interface EngineeringLessonEntry {
  lesson: string;
  sourceProject: string;
  relatedKnowledge: { label: string; href: string };
}

export const PLACEHOLDER_ENGINEERING_LESSONS: EngineeringLessonEntry[] = [
  {
    lesson:
      "Money should never be represented with floating-point arithmetic — a wallet balance is exact, or it's wrong.",
    sourceProject: "VaultPay",
    relatedKnowledge: {
      label: "Why Money Should Never Use Floating Point",
      href: "/knowledge/money-floating-point",
    },
  },
  {
    lesson:
      "Concurrent writes need an explicit locking strategy chosen on purpose, not one inherited by accident.",
    sourceProject: "VaultPay",
    relatedKnowledge: {
      label: "Optimistic vs Pessimistic Locking",
      href: "/knowledge/optimistic-vs-pessimistic-locking",
    },
  },
  {
    lesson:
      "What a service fetches, stores, and exposes are three different concerns — one shared type lets a change in one silently leak into the others.",
    sourceProject: "GoHunt",
    relatedKnowledge: {
      label:
        "Data Transfer Objects: Why Fetched, Stored, and Exposed Data Need Different Types",
      href: "/knowledge/data-transfer-objects",
    },
  },
];
