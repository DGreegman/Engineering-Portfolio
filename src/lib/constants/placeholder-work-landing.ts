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
    ],
  },
  {
    title: "Distributed Systems",
    description:
      "Keeping state consistent and correct once more than one process can touch it at the same time.",
    relatedCaseStudies: [{ title: "VaultPay", href: "/work/vaultpay" }],
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
      "An API's contract outlives whatever framework built it — design the shape first, the implementation second.",
    sourceProject: "GoHunt",
    relatedKnowledge: {
      label: "Understanding APIs Before You Build One",
      href: "/knowledge/understanding-apis",
    },
  },
];
