/**
 * Placeholder Topics
 *
 * Fixture data for `BrowseByTopic` (Task 4.1) until topics can be derived
 * from the real Knowledge collection. Deliberately its own file, same
 * reasoning as `placeholder-knowledge.ts`: this is a stand-in for data that
 * will eventually be computed, and the task is explicit that it gets
 * swapped out without a component redesign.
 *
 * Topic names follow docs/15-KNOWLEDGE_EXPERIENCE.md's "Topics" list and
 * Task 4.1's own examples (a matching subset), not docs/03-SITEMAP.md's
 * older technology-mixed category list — see the plan note for Task 4.1 on
 * why those two docs disagree and which one this page follows.
 *
 * `articleCount` is deliberately `undefined` for every entry rather than a
 * fabricated number — no real count exists until the Content Engine can
 * compute one (AGENT.md "Error Handling": never fail silently, but also
 * never invent data). `BrowseByTopic` only renders a count when one is
 * present, so this is the real "zero content indexed yet" shape, not a
 * placeholder value standing in for a future one.
 *
 * `href` follows docs/03-SITEMAP.md's documented `/knowledge/[topic]` URL
 * structure. This route doesn't resolve yet — same "doesn't resolve yet"
 * precedent already used by `placeholder-work.ts` and
 * `placeholder-knowledge.ts` for their own hrefs.
 */

export interface Topic {
  title: string;
  slug: string;
  description: string;
  /** Present once the Content Engine can compute a real count. */
  articleCount?: number;
  href: string;
}

export const PLACEHOLDER_TOPICS: Topic[] = [
  {
    title: "Backend",
    slug: "backend",
    description:
      "API design, databases, caching, and the systems that keep services running.",
    href: "/knowledge/backend",
  },
  {
    title: "System Design",
    slug: "system-design",
    description:
      "Trade-offs behind building systems that scale, stay available, and stay understandable.",
    href: "/knowledge/system-design",
  },
  {
    title: "Security",
    slug: "security",
    description:
      "Authentication, authorization, threat modeling, and secure-by-default engineering.",
    href: "/knowledge/security",
  },
  {
    title: "Cloud",
    slug: "cloud",
    description:
      "Infrastructure, deployment, and the decisions behind running software reliably in the cloud.",
    href: "/knowledge/cloud",
  },
  {
    title: "Distributed Systems",
    slug: "distributed-systems",
    description:
      "Consistency, availability, and the hard problems that show up once a system has more than one node.",
    href: "/knowledge/distributed-systems",
  },
  {
    title: "Architecture",
    slug: "architecture",
    description:
      "Clean architecture, domain-driven design, and the structural decisions that outlast any framework.",
    href: "/knowledge/architecture",
  },
  {
    title: "Performance",
    slug: "performance",
    description:
      "Indexing, caching, batching, and the small decisions that add up to a fast system.",
    href: "/knowledge/performance",
  },
  {
    title: "Testing",
    slug: "testing",
    description:
      "Building confidence in a system without slowing down how fast it can change.",
    href: "/knowledge/testing",
  },
];
