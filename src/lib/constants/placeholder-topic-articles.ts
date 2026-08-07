/**
 * Placeholder Topic Articles
 *
 * Fixture data for `StartHere` and `TopicArticleList` on `/knowledge/[slug]`
 * (Task 4.2) until real Knowledge entries exist. Reuses Task 4.1's
 * `KnowledgeArticleCard` shape as-is — it already carries every field a
 * topic page needs (topic, difficulty, readingTime, publishedAt,
 * description, href) — rather than inventing a parallel type.
 *
 * Keyed by `Topic.slug` (placeholder-topics.ts). Only the three topics
 * Task 4.2 names as its own examples — Backend, System Design, Security —
 * are fully populated here; the other five (Cloud, Distributed Systems,
 * Architecture, Performance, Testing) intentionally have no entry. Looking
 * up a missing slug returns `undefined`, and `app/knowledge/[slug]/page.tsx`
 * treats that the same as an empty array — `StartHere`/`TopicArticleList`
 * already render their real, on-brand empty-state copy for that case (built
 * in Task 4.1), so this isn't a special case to handle, and it's a more
 * honest demonstration of "scales to hundreds of articles" than inventing
 * dozens of filler titles: both the populated and empty states of the same
 * components get genuinely exercised.
 *
 * Titles favor ones already named elsewhere in the docs over invented ones
 * where a fit exists — "Preventing IDOR Vulnerabilities"
 * (docs/05-KNOWLEDGE_ARCHITECTURE.md's Security Write-up example), "How
 * Rate Limiting Protects APIs" (docs/16-WRITING_GUIDELINES.md's Titles
 * example) — and reuse a few entries verbatim from
 * `placeholder-knowledge-landing.ts` where they're genuinely relevant to
 * the topic ("Understanding APIs Before You Build One" for Backend, "How
 * JWT Works" for Security) — an article legitimately being a good starting
 * point for both the whole-library audience and a specific topic's
 * audience is normal, not a bug.
 *
 * `href`s follow the documented `/knowledge/[slug]` flat article route
 * (docs/10-Technical Architecture.md). These don't resolve yet, same
 * "doesn't resolve yet" precedent as every other placeholder href in this
 * codebase.
 */

import type { KnowledgeArticleCard } from "@/lib/constants/placeholder-knowledge-landing";

export interface TopicArticles {
  /** Three curated, intentionally-selected starting points for this topic. */
  startHere: KnowledgeArticleCard[];
  /** The remaining articles for this topic, beyond the Start Here picks. */
  articles: KnowledgeArticleCard[];
}

export const PLACEHOLDER_TOPIC_ARTICLES: Record<string, TopicArticles> = {
  backend: {
    startHere: [
      {
        title: "Understanding APIs Before You Build One",
        description:
          "What actually makes an API good, before you pick a framework or a spec.",
        topic: "Backend",
        difficulty: "beginner",
        readingTime: "7 min read",
        publishedAt: "Jul 2026",
        href: "/knowledge/understanding-apis",
      },
      {
        title: "Choosing a Database for Your Backend",
        description:
          "Relational, document, key-value — the actual trade-offs behind the choice, not just the marketing.",
        topic: "Backend",
        difficulty: "beginner",
        readingTime: "8 min read",
        publishedAt: "Jun 2026",
        href: "/knowledge/choosing-a-database",
      },
      {
        title: "Why Money Should Never Use Floating Point",
        description:
          "The precision bug that's easy to miss in a demo and expensive to find in production.",
        topic: "Backend",
        difficulty: "beginner",
        readingTime: "5 min read",
        publishedAt: "Jul 2026",
        href: "/knowledge/money-floating-point",
      },
    ],
    articles: [
      {
        title: "Idempotency Keys Explained",
        description:
          "How to make a retried request safe to run twice without double-charging anyone.",
        topic: "Backend",
        difficulty: "intermediate",
        readingTime: "6 min read",
        publishedAt: "Aug 2026",
        href: "/knowledge/idempotency-keys",
      },
      {
        title: "Connection Pooling, Explained Simply",
        description:
          "Why opening a new database connection per request quietly kills throughput.",
        topic: "Backend",
        difficulty: "intermediate",
        readingTime: "6 min read",
        publishedAt: "Jun 2026",
        href: "/knowledge/connection-pooling",
      },
      {
        title: "Designing Webhooks That Don't Break",
        description:
          "Retries, signatures, and ordering — the parts of a webhook system that are easy to skip and expensive to add later.",
        topic: "Backend",
        difficulty: "intermediate",
        readingTime: "7 min read",
        publishedAt: "May 2026",
        href: "/knowledge/designing-webhooks",
      },
      {
        title: "Message Queues: When and Why",
        description:
          "The problem a queue solves that a direct API call can't — and when it's overkill.",
        topic: "Backend",
        difficulty: "intermediate",
        readingTime: "8 min read",
        publishedAt: "Apr 2026",
        href: "/knowledge/message-queues-when-and-why",
      },
      {
        title: "Caching Strategies for Backend Systems",
        description:
          "Cache-aside, write-through, and write-behind — and how to pick without guessing.",
        topic: "Backend",
        difficulty: "advanced",
        readingTime: "9 min read",
        publishedAt: "Mar 2026",
        href: "/knowledge/caching-strategies",
      },
    ],
  },

  "system-design": {
    startHere: [
      {
        title: "What Is System Design?",
        description:
          "A working definition of system design, and why it matters before you write a single line of code.",
        topic: "System Design",
        difficulty: "beginner",
        readingTime: "6 min read",
        publishedAt: "Aug 2026",
        href: "/knowledge/what-is-system-design",
      },
      {
        title: "The CAP Theorem, Practically",
        description:
          "What you actually give up when a system has to keep working during a network partition.",
        topic: "System Design",
        difficulty: "intermediate",
        readingTime: "7 min read",
        publishedAt: "Jul 2026",
        href: "/knowledge/cap-theorem-practically",
      },
      {
        title: "Load Balancing: The First Scaling Decision",
        description:
          "How traffic gets spread across multiple servers, and what breaks when it isn't.",
        topic: "System Design",
        difficulty: "beginner",
        readingTime: "6 min read",
        publishedAt: "Jun 2026",
        href: "/knowledge/load-balancing-first-decision",
      },
    ],
    articles: [
      {
        title: "Horizontal vs Vertical Scaling",
        description:
          'Adding more machines versus making one machine bigger — and why the answer isn\'t always "both."',
        topic: "System Design",
        difficulty: "intermediate",
        readingTime: "6 min read",
        publishedAt: "May 2026",
        href: "/knowledge/horizontal-vs-vertical-scaling",
      },
      {
        title: "Designing for Failure",
        description:
          "Every component eventually fails — the design decisions that decide whether your system notices.",
        topic: "System Design",
        difficulty: "advanced",
        readingTime: "9 min read",
        publishedAt: "Apr 2026",
        href: "/knowledge/designing-for-failure",
      },
      {
        title: "Consistent Hashing, Visually",
        description:
          "Why adding one more cache node shouldn't invalidate almost everything you've already cached.",
        topic: "System Design",
        difficulty: "advanced",
        readingTime: "8 min read",
        publishedAt: "Mar 2026",
        href: "/knowledge/consistent-hashing-visually",
      },
      {
        title: "Back-of-the-Envelope Capacity Estimation",
        description:
          "The rough math that tells you whether a design will survive real traffic before you build it.",
        topic: "System Design",
        difficulty: "intermediate",
        readingTime: "7 min read",
        publishedAt: "Feb 2026",
        href: "/knowledge/capacity-estimation",
      },
    ],
  },

  security: {
    startHere: [
      {
        title: "How JWT Works",
        description:
          "Why do JWTs exist, and what problem do they actually solve?",
        topic: "Security",
        difficulty: "beginner",
        readingTime: "6 min read",
        publishedAt: "Aug 2026",
        href: "/knowledge/how-jwt-works",
      },
      {
        title: "Authentication vs Authorization",
        description:
          "Two words that get used interchangeably and mean completely different things.",
        topic: "Security",
        difficulty: "beginner",
        readingTime: "5 min read",
        publishedAt: "Jul 2026",
        href: "/knowledge/authn-vs-authz",
      },
      {
        title: "Preventing IDOR Vulnerabilities",
        description:
          "The access-control bug that's invisible in code review and obvious in a penetration test.",
        topic: "Security",
        difficulty: "intermediate",
        readingTime: "7 min read",
        publishedAt: "Jun 2026",
        href: "/knowledge/preventing-idor",
      },
    ],
    articles: [
      {
        title: "How Rate Limiting Protects APIs",
        description:
          "How do you protect an API from being overwhelmed without punishing legitimate users?",
        topic: "Security",
        difficulty: "intermediate",
        readingTime: "7 min read",
        publishedAt: "May 2026",
        href: "/knowledge/rate-limiting-protects-apis",
      },
      {
        title: "Password Hashing Done Right",
        description:
          "Why plain hashing isn't enough, and what bcrypt/argon2 actually protect against.",
        topic: "Security",
        difficulty: "intermediate",
        readingTime: "6 min read",
        publishedAt: "Apr 2026",
        href: "/knowledge/password-hashing-done-right",
      },
      {
        title: "Session Management, Securely",
        description:
          "Cookies, tokens, and expiry — the decisions that decide whether a stolen session is a minor bug or a breach.",
        topic: "Security",
        difficulty: "advanced",
        readingTime: "8 min read",
        publishedAt: "Mar 2026",
        href: "/knowledge/session-management-securely",
      },
      {
        title: "Security Headers That Actually Matter",
        description:
          "Which HTTP headers meaningfully reduce attack surface, and which are cargo-culted.",
        topic: "Security",
        difficulty: "intermediate",
        readingTime: "6 min read",
        publishedAt: "Feb 2026",
        href: "/knowledge/security-headers-that-matter",
      },
    ],
  },
};
