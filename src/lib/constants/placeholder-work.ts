/**
 * Placeholder Work
 *
 * Fixture data for `EngineeringCaseStudies` (Task 3.5) until the real Work
 * collection exists. Kept in its own file, separate from
 * `homepage-copy.ts`, for the same reason as `placeholder-knowledge.ts`:
 * this isn't doc-14 copy, it's a stand-in that gets swapped out once the
 * real collection exists ("should later consume the Work collection
 * without redesign") — deleting/replacing this file touches nothing else.
 *
 * Titles are exactly as specified in Task 3.5's own request — VaultPay,
 * GoHunt, and Haya are also the exact "Case Study" examples already named
 * in docs/06-CONTENT_STRATEGY.md, so nothing here is invented. Summaries
 * were rewritten per Task 3.5's review feedback §3 to state the
 * engineering problem or architectural challenge, not describe the
 * product. `publishedAt` is optional: an in-progress case study (Haya) has
 * no completion date yet, so its citation line renders with two parts
 * instead of three (see `EngineeringCaseStudies`).
 *
 * `href` follows docs/10-Technical Architecture.md's documented
 * `/work/[slug]` route shape (that doc's own routing example is literally
 * `/work/vaultpay`) — the route doesn't resolve yet (Milestone 6), same
 * situation as the header nav's existing `/work` link.
 *
 * `featured` (Task 5.1) — this file remains the **only** collection of
 * projects. docs/29-WORK_LANDING_PROPOSAL.md §3 ("Featured Is Not a
 * Separate Collection") is explicit that Featured Case Studies must never
 * become a second dataset: a project is marked featured on its own single
 * record, not copied into a parallel list. `lib/content/work.ts`'s
 * `getFeaturedCaseStudies()`/`getProjectLibrary()` are the only readers of
 * this array outside this file — one filtered, one not — so `app/work/
 * page.tsx` never touches `.filter()` itself (Task 5.1 review refinement
 * #1: presentation should receive already-resolved data, not derive it).
 * `featured` is optional and editorial, set by hand per §3's "editorial,
 * never mechanical" selection criteria (architectural complexity,
 * interesting trade-offs, documentation quality) — not derived from
 * `status` or list position. VaultPay and GoHunt are marked featured;
 * Haya — still `"In Progress"` and without a full case study yet — isn't,
 * consistent with that same section's "quality of documentation" criterion.
 */

export interface CaseStudyEntry {
  title: string;
  summary: string;
  domain: string;
  status: "Completed" | "In Progress";
  publishedAt?: string;
  href: string;
  /** Editorial pick for Featured Case Studies. See docstring above. */
  featured?: boolean;
}

export const PLACEHOLDER_WORK: CaseStudyEntry[] = [
  {
    title: "VaultPay",
    summary:
      "Designing a wallet infrastructure that remains correct under concurrent transactions.",
    domain: "Backend Infrastructure",
    status: "Completed",
    publishedAt: "Aug 2026",
    href: "/work/vaultpay",
    featured: true,
  },
  {
    title: "GoHunt",
    summary:
      "Matching engineers to opportunities using retrieval, scoring, and AI-assisted evaluation.",
    domain: "AI Systems",
    status: "Completed",
    publishedAt: "Jul 2026",
    href: "/work/gohunt",
    featured: true,
  },
  {
    title: "Haya",
    summary:
      "Turning raw websites into structured engineering insights using AI.",
    domain: "Platform Engineering",
    status: "In Progress",
    href: "/work/haya",
  },
];
