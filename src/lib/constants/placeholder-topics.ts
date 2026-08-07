/**
 * Placeholder Topics
 *
 * Fixture data for `BrowseByTopic` (Task 4.1) and `TopicHero`/`RelatedTopics`
 * (Task 4.2) until topics can be derived from the real Knowledge collection.
 * Deliberately its own file, same reasoning as `placeholder-knowledge.ts`:
 * this is a stand-in for data that will eventually be computed, and the
 * task is explicit that it gets swapped out without a component redesign.
 *
 * Topic names follow docs/15-KNOWLEDGE_EXPERIENCE.md's "Topics" list and
 * Task 4.1's own examples (a matching subset), not docs/03-SITEMAP.md's
 * older technology-mixed category list — see the plan note for Task 4.1 on
 * why those two docs disagree and which one this page follows.
 *
 * `description` stays the short, one-line summary used everywhere a topic
 * is shown compactly (tiles, meta descriptions) — unchanged since Task 4.1.
 * `heroIntroduction` (Task 4.2 design refinement #1) is new: two full
 * paragraphs explaining *why the domain matters*, not another list of
 * sub-topics, for `TopicHero` specifically. Written to the same tone/length
 * as `KNOWLEDGE_HERO_COPY.introduction` in `knowledge-copy.ts` — the
 * library-wide hero earns two real paragraphs, so a topic hero should too,
 * rather than reusing the tile-sized `description`.
 *
 * `articleCount` is a populated placeholder number now — Task 4.2 §2
 * explicitly asks the topic hero to display one, unlike Task 4.1 where no
 * real count existed yet and showing one would have been fabrication. These
 * are round, plausible placeholders, not measurements of
 * `placeholder-topic-articles.ts`'s actual (much smaller) placeholder
 * content — they represent what the *real*, eventual library is meant to
 * look like once the Content Engine indexes it, matching Task 4.2's own
 * "24 Articles" example for Backend. There's no equivalent stored
 * `seriesCount`: unlike articles, the topic page's Learning Series section
 * isn't paginated or truncated — it shows every series for the topic — so a
 * separately-maintained count could silently drift from the list actually
 * rendered. `app/knowledge/[slug]/page.tsx` computes that count directly
 * from the filtered `PLACEHOLDER_SERIES` list length instead.
 *
 * `relatedTopics` are hand-curated adjacent-domain slugs (Task 4.2 §6) —
 * an editorial judgment call, not "every other topic." Every topic gets one
 * so `RelatedTopics` always has something to show, even for topics without
 * full `placeholder-topic-articles.ts` content yet.
 *
 * `href` follows docs/03-SITEMAP.md's documented `/knowledge/[topic]` URL
 * structure. This route now resolves (Task 4.2's `app/knowledge/[slug]/`,
 * extended by Task 4.3.1 to also resolve article documents at the same
 * path — see that route's own docstring for the resolution order).
 *
 * `slug` and `relatedTopics` are typed `TopicSlug`, imported from
 * `lib/content/topics.ts` — Task 4.3.1's "make the content layer the
 * single owner of the topic vocabulary" refinement. That file, not this
 * one, is now the source of truth for which eight slugs are valid; this
 * file's `slug`/`relatedTopics` values are checked against it at compile
 * time (a typo or a slug that no longer exists there is now a type error
 * here, not a silent drift). `title`/`description`/`heroIntroduction`/etc.
 * stay presentation-only and have no content-engine equivalent to import.
 */
import type { TopicSlug } from "@/lib/content/topics";

export interface Topic {
  title: string;
  slug: TopicSlug;
  description: string;
  href: string;
  /** Two paragraphs explaining the domain, for `TopicHero` (Task 4.2 §1). */
  heroIntroduction?: readonly string[];
  /** Present once the Content Engine can compute a real count. */
  articleCount?: number;
  /** Slugs of editorially adjacent topics, for `RelatedTopics`. */
  relatedTopics?: TopicSlug[];
}

export const PLACEHOLDER_TOPICS: Topic[] = [
  {
    title: "Backend",
    slug: "backend",
    description:
      "API design, databases, caching, and the systems that keep services running.",
    href: "/knowledge/backend",
    heroIntroduction: [
      "Backend engineering is where a product's promises become real — every request has to be handled correctly, every write has to survive a crash, and every dependency has to fail without taking the rest of the system down with it.",
      "This topic covers the systems that make that possible: APIs, databases, caching layers, message queues, and the operational discipline that keeps them running in production, not just in a demo.",
    ],
    articleCount: 24,
    relatedTopics: [
      "security",
      "system-design",
      "performance",
      "distributed-systems",
    ],
  },
  {
    title: "System Design",
    slug: "system-design",
    description:
      "Trade-offs behind building systems that scale, stay available, and stay understandable.",
    href: "/knowledge/system-design",
    heroIntroduction: [
      "System design is the practice of making trade-offs on purpose instead of by accident — deciding, before a single line of code is written, how a system should behave under load, under failure, and under growth.",
      "This topic covers the vocabulary and reasoning behind those decisions: scaling strategies, consistency models, and the back-of-the-envelope thinking that separates a design that survives real traffic from one that doesn't.",
    ],
    articleCount: 19,
    relatedTopics: [
      "distributed-systems",
      "architecture",
      "performance",
      "backend",
    ],
  },
  {
    title: "Security",
    slug: "security",
    description:
      "Authentication, authorization, threat modeling, and secure-by-default engineering.",
    href: "/knowledge/security",
    heroIntroduction: [
      "Security isn't a feature added at the end of a project — it's a set of assumptions baked into how a system authenticates users, authorizes actions, and handles data from the very first design decision.",
      "This topic covers those assumptions directly: authentication, authorization, threat modeling, and the secure-by-default habits that prevent the mistakes attackers rely on being common.",
    ],
    articleCount: 16,
    relatedTopics: ["backend", "cloud", "architecture", "testing"],
  },
  {
    title: "Cloud",
    slug: "cloud",
    description:
      "Infrastructure, deployment, and the decisions behind running software reliably in the cloud.",
    href: "/knowledge/cloud",
    heroIntroduction: [
      "Running software reliably in the cloud is a different problem than writing it — it's about infrastructure that recovers on its own, deployments that don't need a maintenance window, and costs that don't grow faster than the product does.",
      "This topic covers the operational side of backend engineering: how systems get deployed, observed, and kept running without someone getting paged at 3am.",
    ],
    articleCount: 14,
    relatedTopics: [
      "distributed-systems",
      "security",
      "performance",
      "backend",
    ],
  },
  {
    title: "Distributed Systems",
    slug: "distributed-systems",
    description:
      "Consistency, availability, and the hard problems that show up once a system has more than one node.",
    href: "/knowledge/distributed-systems",
    heroIntroduction: [
      "The moment a system has more than one node, its hardest problems stop being about algorithms and start being about physics — networks partition, clocks drift, and messages arrive out of order or not at all.",
      "This topic covers how real systems stay correct and available anyway: consistency models, coordination, and the trade-offs every distributed system is quietly making whether its designers noticed or not.",
    ],
    articleCount: 15,
    relatedTopics: ["system-design", "cloud", "architecture", "backend"],
  },
  {
    title: "Architecture",
    slug: "architecture",
    description:
      "Clean architecture, domain-driven design, and the structural decisions that outlast any framework.",
    href: "/knowledge/architecture",
    heroIntroduction: [
      "Architecture is the set of decisions that are expensive to change later — how a system is divided into parts, how those parts depend on each other, and how much a new requirement will cost to add.",
      "This topic covers the structural thinking behind those decisions: clean architecture, domain-driven design, and the discipline of keeping a codebase's shape legible as it grows.",
    ],
    articleCount: 12,
    relatedTopics: ["system-design", "backend", "testing", "performance"],
  },
  {
    title: "Performance",
    slug: "performance",
    description:
      "Indexing, caching, batching, and the small decisions that add up to a fast system.",
    href: "/knowledge/performance",
    heroIntroduction: [
      "Performance work rarely starts with a big rewrite — it starts with finding the one slow query, the one uncached call, or the one blocking operation that's quietly setting the pace for everything else.",
      "This topic covers the habits and techniques behind that kind of work: indexing, caching, batching, and measuring before optimizing, so effort goes where it actually matters.",
    ],
    articleCount: 11,
    relatedTopics: ["backend", "system-design", "cloud", "distributed-systems"],
  },
  {
    title: "Testing",
    slug: "testing",
    description:
      "Building confidence in a system without slowing down how fast it can change.",
    href: "/knowledge/testing",
    heroIntroduction: [
      "Testing exists to answer one question with confidence: can this system change without breaking what already works? Everything else — coverage numbers, test types, tooling — is in service of that.",
      "This topic covers how to build that confidence without slowing a codebase down: what's worth testing, what isn't, and how a test suite earns the right to be trusted.",
    ],
    articleCount: 9,
    relatedTopics: ["backend", "architecture", "security", "system-design"],
  },
];
