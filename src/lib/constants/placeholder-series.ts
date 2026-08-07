/**
 * Placeholder Learning Series
 *
 * Fixture data for `LearningSeries` (Task 4.1, generalized in Task 4.2) until
 * real `series/` collection entries exist (see `src/lib/content/schema.ts`'s
 * `seriesFrontmatterSchema` and docs/11-Content Model.md's "Series Model").
 * Same stand-in reasoning as `placeholder-topics.ts` / `placeholder-work.ts`.
 *
 * Titles are exactly Task 4.1/4.2's own examples ("Authentication
 * Fundamentals", "Distributed Systems", "Building Reliable APIs", "REST API
 * Design", "Database Fundamentals") — nothing invented here beyond
 * descriptions and part counts.
 *
 * `topics` (plural — was a single `topic` string in Task 4.1) because a
 * series can legitimately belong to more than one domain: Task 4.2's own
 * Backend example lists "Authentication Fundamentals" as one of Backend's
 * learning series, even though it's equally a Security series. Topic pages
 * (Task 4.2) filter this list by `topics.includes(currentTopicTitle)`; the
 * library-wide `/knowledge` page shows all of them regardless of topic.
 *
 * `href` follows docs/10-Technical Architecture.md's documented
 * `/series/[slug]` route shape (that doc's own routing example is literally
 * `/series/system-design`) — the route doesn't resolve yet, same situation
 * as every other placeholder href in this codebase.
 */

export interface LearningSeriesEntry {
  title: string;
  description: string;
  partCount: number;
  topics?: string[];
  href: string;
}

export const PLACEHOLDER_SERIES: LearningSeriesEntry[] = [
  {
    title: "Authentication Fundamentals",
    description:
      "From passwords to tokens to sessions — a progressive walk through how authentication actually works.",
    partCount: 4,
    topics: ["Security", "Backend"],
    href: "/series/authentication-fundamentals",
  },
  {
    title: "Distributed Systems",
    description:
      "Consistency, availability, and coordination — the ideas that come up again and again once a system has more than one node.",
    partCount: 5,
    topics: ["Distributed Systems", "System Design"],
    href: "/series/distributed-systems",
  },
  {
    title: "Building Reliable APIs",
    description:
      "Idempotency, rate limiting, versioning, and the small decisions that make an API something people can depend on.",
    partCount: 4,
    topics: ["Backend", "System Design"],
    href: "/series/building-reliable-apis",
  },
  {
    title: "REST API Design",
    description:
      "Resources, status codes, versioning, and the conventions that make an API predictable to use.",
    partCount: 3,
    topics: ["Backend"],
    href: "/series/rest-api-design",
  },
  {
    title: "Database Fundamentals",
    description:
      "Indexing, normalization, transactions, and the storage decisions every backend system eventually depends on.",
    partCount: 5,
    topics: ["Backend"],
    href: "/series/database-fundamentals",
  },
];
