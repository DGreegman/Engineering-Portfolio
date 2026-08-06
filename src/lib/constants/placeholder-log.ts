/**
 * Placeholder Log
 *
 * Fixture data for `EngineeringLog` (Task 3.6) until the real Engineering
 * Log collection exists. Own file, same reasoning as
 * `placeholder-knowledge.ts`/`placeholder-work.ts` — this isn't doc-14
 * copy, it's a stand-in swapped out later without touching the component.
 *
 * Entries and dates are exactly as specified in Task 3.6's own request.
 * `summary` exists on the type but is intentionally never rendered by the
 * homepage preview (see `EngineeringLog`) — it's reserved for a future
 * full log-entry page, not shown here, since "intentionally lightweight"
 * means showing less, not more.
 *
 * `href` follows docs/10-Technical Architecture.md's documented
 * `/engineering-log/[slug]` route shape (that doc's own routing example is
 * literally `/engineering-log/building-my-first-go-service`) — the route
 * doesn't resolve yet (Milestone 6), same situation as the other
 * placeholder collections.
 */

export interface EngineeringLogEntry {
  date: string;
  title: string;
  summary?: string;
  href: string;
}

export const PLACEHOLDER_LOG: EngineeringLogEntry[] = [
  {
    date: "06 Aug 2026",
    title: "Investigated Go scheduler behavior under high concurrency.",
    href: "/engineering-log/go-scheduler-under-concurrency",
  },
  {
    date: "04 Aug 2026",
    title: "Experimented with AI-assisted repository scoring.",
    href: "/engineering-log/ai-assisted-repository-scoring",
  },
  {
    date: "01 Aug 2026",
    title: "Documented lessons from designing VaultPay.",
    href: "/engineering-log/lessons-from-vaultpay",
  },
];
