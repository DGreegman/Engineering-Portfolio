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
 * `/work/vaultpay`). As of Task 5.7's RC refinement pass, `/work/vaultpay`
 * and `/work/gohunt` resolve to real `content/work/*.mdx` case studies
 * (see `case-studies.ts`) sourced from the real, public VaultPay and GoHunt
 * repositories rather than invented content — this file's own
 * summary/domain lines were checked against that real content and still
 * hold. VaultPay's `status` below was updated from this array's original
 * fixture value ("Completed") to `"In Progress"` specifically because it
 * now describes a real project: the real repository shows early-stage,
 * phased development (the case study's own frontmatter and body document
 * this honestly), and a Landing/Library card claiming "Completed" beside a
 * case study that says otherwise would be exactly the kind of
 * self-contradicting metadata this workspace's single-source-of-truth
 * discipline exists to prevent.
 *
 * Task 5.7's final refinement pass added two more real entries, sourced
 * the identical way — from real local repositories, not invented — after
 * confirming each had enough genuine architecture/decision/trade-off
 * evidence to support a truthful, template-complete case study (this
 * task's own evidence bar, applied identically to all four projects in
 * this array):
 *
 * - **Haya** — `summary`/`domain`/`status` all corrected here from this
 *   array's original placeholder values (which predated any real Haya
 *   content existing) to match the real, private `Haya-Backend` repository
 *   this task inspected directly: a live, multi-tenant AI analysis
 *   platform, not the early-stage single-purpose tool the original
 *   placeholder summary described. `/work/haya` now resolves.
 * - **Cookeaze** — a new entry; no placeholder record existed for it
 *   before this task, because Task 3.5 never named it as one of the three
 *   original example projects. Added only after the same evidence check —
 *   see `content/work/cookeaze.mdx`'s own frontmatter and body.
 *
 * Both were inspected under the same privacy discipline: no secrets,
 * credentials, private customer data, or confidential implementation
 * detail from either repository was copied into this array or into either
 * case study — see this task's own RC Final Refinement Report for what was
 * deliberately left out and why.
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
 * `status` or list position. VaultPay and GoHunt are marked featured; Haya
 * and Cookeaze are deliberately left unfeatured by this task even though
 * both now have real, template-complete case studies — per this same
 * section's "editorial, never mechanical" rule, whether either belongs in
 * the small, curated Featured set is a judgment call for the site owner to
 * make deliberately, not one this refinement pass should make on their
 * behalf merely because a case study now exists. Both remain fully real,
 * fully linked entries in the Project Library either way.
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
    status: "In Progress",
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
      "Building the concurrency control and access-control model behind an AI-powered UX analysis platform.",
    domain: "Platform Engineering",
    status: "Completed",
    publishedAt: "Oct 2025",
    href: "/work/haya",
  },
  {
    title: "Cookeaze",
    summary:
      "Reconciling a wallet ledger once a payment webhook alone turned out not to be a reliable source of truth.",
    domain: "Backend Infrastructure",
    status: "Completed",
    publishedAt: "Dec 2024",
    href: "/work/cookeaze",
  },
];
