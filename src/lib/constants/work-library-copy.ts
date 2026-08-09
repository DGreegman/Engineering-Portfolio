/**
 * Case Study Library Copy
 *
 * Copy for the `/work/library` page (Task 5.2), one constant per section —
 * same "copy lives as data, separate from JSX" pattern `work-copy.ts`
 * already established for the Landing.
 *
 * Section order, names, and the question each one answers follow
 * docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md §1 exactly (approved, do not
 * reinterpret): Library Header → Browse Lenses → Case Study Listing →
 * Continue Exploring.
 *
 * Written to the same tone `work-copy.ts` and `knowledge-copy.ts` already
 * established (docs/16-WRITING_GUIDELINES.md: calm, technical, no marketing
 * language) — this page orients and organizes, per docs/30's framing of the
 * Library as structural rather than argumentative; its copy is deliberately
 * flatter and less rhetorical than the Landing's own.
 */

/**
 * Library Header — "Where am I, and how much work is here?" (docs/30 §1).
 * Orientation only, no thesis — unlike `WORK_HERO_COPY`, this section makes
 * no claim the rest of the page has to substantiate (docs/30 §1: "Carries
 * no thesis and no evidence"). `scaleLabel` is a function, not a fixed
 * string, same pattern `PROJECT_LIBRARY_COPY.scaleLabel` already uses — the
 * component supplies the real count.
 */
export const LIBRARY_HEADER_COPY = {
  eyebrow: "Case Study Library",
  headline: "The complete engineering archive.",
  introduction: [
    "Every case study documented in this workspace lives here — not a curated sample, the whole record. The Work overview highlights a few; this page is where you come once you want to see everything.",
  ],
  scaleLabel: (count: number) =>
    `${count} case ${count === 1 ? "study" : "studies"} documented so far.`,
} as const;

/**
 * Browse Lenses — "How can I approach this archive?" (docs/30 §1/§2,
 * approved refinement #2's exact framing, strengthened against filtering:
 * lenses define perspectives, filters narrow within one). Three lenses,
 * each answering a distinct question per docs/30 §4 — this copy states
 * that distinction in plain, reader-facing language rather than the
 * proposal's own internal vocabulary.
 *
 * Each lens's `label` is the heading over its own cluster; `description`
 * states the one question that lens exists to answer, following docs/30
 * §4's "each facet exists because it maps to a real question a reader
 * actually arrives with."
 */
export const BROWSE_LENSES_COPY = {
  title: "Browse Lenses",
  introduction: [
    "Three different ways to approach the same archive — pick whichever question matches what you're curious about. None of these are separate lists; every lens points back into the one Case Study Listing below.",
  ],
  domain: {
    label: "By Domain",
    description: "What area of engineering is this?",
    emptyState: "Domains will appear here once case studies are documented.",
  },
  theme: {
    label: "By Engineering Theme",
    description: "What engineering concern does this demonstrate?",
    emptyState: "Recurring themes will appear here as more work is documented.",
  },
  status: {
    label: "By Status",
    description: "Is it finished, or still in progress?",
  },
} as const;

/**
 * Case Study Listing — "What is the complete, ordered archive?" (docs/30
 * §1/§3). The one true collection, grouped by domain (the primary,
 * best-modeled facet — see `case-study-listing.tsx`'s own docstring for why
 * domain was chosen as the Listing's structural axis while theme and status
 * stay Browse-Lens-only). `featuredLabel` is the quiet marker docs/30 §5
 * asks for ("the Library's Listing may indicate which entries are
 * Featured... a quiet marker, not a separate section").
 */
export const CASE_STUDY_LISTING_COPY = {
  title: "Case Study Listing",
  introduction: [
    "Every case study, grouped by domain. This is the complete archive — nothing here is hidden behind a filter you have to apply first.",
  ],
  featuredLabel: "Featured",
  emptyState: [
    "The archive is still being populated.",
    "Check back soon as new engineering work is documented.",
  ],
} as const;

/**
 * Continue Exploring — "Where do I go once I've found what I'm looking
 * for?" (docs/30 §1). Reuses the exact generalized `ContinueExploring`
 * component `work-copy.ts`'s Landing copy already uses (Task 5.2) — see
 * that file's own `CONTINUE_EXPLORING_COPY` docstring for the shared-
 * component reasoning.
 *
 * Three links, each justified by something a reader has just done on this
 * page — the same "contextual, never generic" discipline docs/29 §4
 * established, applied here. Unlike the Landing's version, none of these
 * three needs to point at a resolved/future href: every Listing entry
 * above is already a direct link into a specific case study (docs/30 §1's
 * "successful case" is handled by the Listing itself, not duplicated
 * here) — so this section's job is purely the *outward* paths beyond the
 * archive, exactly as `ContinueExploring` was already scoped to do on the
 * Landing.
 */
export const LIBRARY_CONTINUE_EXPLORING_COPY = {
  title: "Continue Exploring",
  introduction: [
    "You've seen the complete archive. Where you go next depends on what you're curious about.",
  ],
  links: [
    {
      label: "Back to the Work overview ←",
      description:
        "This page is the complete record — the overview explains the thinking behind it.",
      href: "/work",
    },
    {
      label: "Continue into the Knowledge Library →",
      description:
        "Every case study here connects back to a concept — the Knowledge Library explains it in full.",
      href: "/knowledge",
    },
    {
      label: "Continue into Engineering Logs →",
      description:
        "This archive shows the outcome. Engineering Logs hold the process that led there.",
      href: "/engineering-log",
    },
  ],
} as const;
