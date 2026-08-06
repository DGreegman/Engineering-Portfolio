/**
 * Placeholder Knowledge
 *
 * Fixture data for `EngineeringNotebook` (Task 3.4) until the real Content
 * Engine (Milestone 3) exists. Deliberately kept in its own file, separate
 * from `homepage-copy.ts` — this is not doc-14 copy, it's a stand-in for
 * data that will eventually come from the Knowledge collection, and the
 * task is explicit that it gets swapped out later ("should later consume
 * the Knowledge collection without requiring redesign"). When that
 * collection exists, this file is deleted and `app/page.tsx` passes real
 * entries into `EngineeringNotebook` instead — the component itself never
 * changes (Task 3.4 §5, "keep the component data-agnostic").
 *
 * Titles are drawn from the "Evergreen Article" examples already named in
 * docs/06-CONTENT_STRATEGY.md ("How JWT Works," "Node.js Event Loop,"
 * "Rate Limiting") rather than invented from nothing. Summaries are
 * written as the question or trade-off the article answers, not a
 * description of it — a curiosity hook, per Task 3.4's review feedback
 * §4 ("Curiosity Before Information").
 *
 * `href` follows docs/10-Technical Architecture.md's documented
 * `/knowledge/[slug]` route shape, matching how a real MDX entry's
 * frontmatter would declare its own `slug` explicitly rather than one
 * computed from the title — so this stays representative of the real
 * shape. The routes don't resolve yet (Milestone 6 builds `/knowledge`
 * pages), same as the header nav's existing links to `/knowledge`,
 * `/work`, etc. before those pages exist.
 */

export interface NotebookArticle {
  title: string;
  summary: string;
  topic: string;
  readingTime: string;
  publishedAt: string;
  href: string;
}

export const PLACEHOLDER_KNOWLEDGE: NotebookArticle[] = [
  {
    title: "How JWT Works",
    summary: "Why do JWTs exist, and what problem do they actually solve?",
    topic: "Authentication",
    readingTime: "6 min read",
    publishedAt: "Aug 2026",
    href: "/knowledge/how-jwt-works",
  },
  {
    title: "Node.js Event Loop",
    summary: "What actually happens after your code calls setTimeout()?",
    topic: "Node.js",
    readingTime: "8 min read",
    publishedAt: "Jul 2026",
    href: "/knowledge/nodejs-event-loop",
  },
  {
    title: "Rate Limiting",
    summary:
      "How do you protect an API from being overwhelmed without punishing legitimate users?",
    topic: "API Design",
    readingTime: "7 min read",
    publishedAt: "Jun 2026",
    href: "/knowledge/rate-limiting",
  },
];
