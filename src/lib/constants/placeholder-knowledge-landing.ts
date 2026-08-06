/**
 * Placeholder Knowledge — Landing Page
 *
 * Fixture data for `StartHere` and `RecentlyPublished` (Task 4.1) until the
 * real Knowledge collection exists. Kept separate from
 * `placeholder-knowledge.ts` (the homepage's `EngineeringNotebook` fixture)
 * on purpose: `KnowledgeArticleCard` carries a `difficulty` field the
 * homepage's `NotebookArticle` doesn't need, per docs/09-Component
 * Specification.md's Knowledge Card spec ("difficulty" is one of its listed
 * fields) and docs/15-KNOWLEDGE_EXPERIENCE.md's Article Experience.  Adding
 * that field to the homepage's type would be a homepage-owned change for a
 * knowledge-landing-page need — this file exists so that stays untouched.
 *
 * `difficulty` uses the same lowercase values as
 * `src/lib/content/schema.ts`'s `difficultySchema` so this stays
 * representative of a real frontmatter shape; components display it via
 * Tailwind's `capitalize` utility rather than pre-capitalized strings.
 *
 * `PLACEHOLDER_START_HERE` favors beginner-friendly, concept-first entries
 * (reducing decision fatigue is this section's whole job — Task 4.1 §4).
 * `PLACEHOLDER_RECENTLY_PUBLISHED` is ordered newest first. Titles are drawn
 * from examples already named elsewhere in the docs — "Rate Limiting" and
 * "Node.js Event Loop" from docs/06-CONTENT_STRATEGY.md (also used by the
 * homepage notebook), "Optimistic vs Pessimistic Locking" from
 * docs/04-INFORMATION_ARCHITECTURE.md's Work→Articles example, and "Why
 * Money Should Never Use Floating Point" from
 * docs/05-KNOWLEDGE_ARCHITECTURE.md's Engineering Note example — not
 * invented from nothing.
 *
 * `href` follows docs/10-Technical Architecture.md's documented
 * `/knowledge/[slug]` route shape. These routes don't resolve yet, same
 * "doesn't resolve yet" precedent as every other placeholder href in this
 * codebase.
 */

import type { Difficulty } from "@/types/content";

export interface KnowledgeArticleCard {
  title: string;
  description: string;
  topic: string;
  difficulty?: Difficulty;
  readingTime: string;
  publishedAt: string;
  href: string;
}

export const PLACEHOLDER_START_HERE: KnowledgeArticleCard[] = [
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
    title: "How JWT Works",
    description: "Why do JWTs exist, and what problem do they actually solve?",
    topic: "Authentication",
    difficulty: "beginner",
    readingTime: "6 min read",
    publishedAt: "Aug 2026",
    href: "/knowledge/how-jwt-works",
  },
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
];

export const PLACEHOLDER_RECENTLY_PUBLISHED: KnowledgeArticleCard[] = [
  {
    title: "Optimistic vs Pessimistic Locking",
    description:
      "Two different ways to handle concurrent writes — and how to know which one a system actually needs.",
    topic: "Databases",
    readingTime: "6 min read",
    publishedAt: "Aug 2026",
    href: "/knowledge/optimistic-vs-pessimistic-locking",
  },
  {
    title: "Why Money Should Never Use Floating Point",
    description:
      "The precision bug that's easy to miss in a demo and expensive to find in production.",
    topic: "Backend",
    readingTime: "5 min read",
    publishedAt: "Jul 2026",
    href: "/knowledge/money-floating-point",
  },
  {
    title: "Node.js Event Loop",
    description: "What actually happens after your code calls setTimeout()?",
    topic: "Node.js",
    readingTime: "8 min read",
    publishedAt: "Jun 2026",
    href: "/knowledge/nodejs-event-loop",
  },
  {
    title: "Rate Limiting",
    description:
      "How do you protect an API from being overwhelmed without punishing legitimate users?",
    topic: "API Design",
    readingTime: "7 min read",
    publishedAt: "May 2026",
    href: "/knowledge/rate-limiting",
  },
];
