/**
 * Placeholder Learning Series
 *
 * Fixture data for `LearningSeries` (Task 4.1) until real `series/`
 * collection entries exist (see `src/lib/content/schema.ts`'s
 * `seriesFrontmatterSchema` and docs/11-Content Model.md's "Series Model").
 * Same stand-in reasoning as `placeholder-topics.ts` / `placeholder-work.ts`.
 *
 * Titles are exactly Task 4.1's own examples ("Authentication
 * Fundamentals", "Distributed Systems", "Building Reliable APIs") — nothing
 * invented here beyond descriptions and part counts.
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
  topic?: string;
  href: string;
}

export const PLACEHOLDER_SERIES: LearningSeriesEntry[] = [
  {
    title: "Authentication Fundamentals",
    description:
      "From passwords to tokens to sessions — a progressive walk through how authentication actually works.",
    partCount: 4,
    topic: "Security",
    href: "/series/authentication-fundamentals",
  },
  {
    title: "Distributed Systems",
    description:
      "Consistency, availability, and coordination — the ideas that come up again and again once a system has more than one node.",
    partCount: 5,
    topic: "Distributed Systems",
    href: "/series/distributed-systems",
  },
  {
    title: "Building Reliable APIs",
    description:
      "Idempotency, rate limiting, versioning, and the small decisions that make an API something people can depend on.",
    partCount: 4,
    topic: "Backend",
    href: "/series/building-reliable-apis",
  },
];
