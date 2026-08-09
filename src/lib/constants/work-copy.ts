/**
 * Work Landing Copy
 *
 * Copy for the `/work` landing page (Task 5.1), one constant per section —
 * same "copy lives as data, separate from JSX" pattern already established
 * by `homepage-copy.ts` and `knowledge-copy.ts`.
 *
 * Section order, names, and the question each one answers follow
 * docs/29-WORK_LANDING_PROPOSAL.md §1 exactly (approved, do not
 * reinterpret): Engineering Work → Engineering Philosophy → Featured Case
 * Studies → Architecture Highlights → Project Library → Engineering Lessons
 * → Continue Exploring.
 *
 * Written to docs/16-WRITING_GUIDELINES.md's tone ("calm, thoughtful,
 * curious, honest, technical, approachable") and docs/25-WORK_EXPERIENCE.md
 * / docs/27-WORK_EXPERIENCE_DESIGN.md's explicit rejection of marketing
 * language, feature lists, and portfolio framing — every section reads as
 * engineering documentation, not project promotion.
 *
 * Every `emptyState` here is genuine copy the matching component renders
 * whenever its data array is empty, following the same "not a hypothetical"
 * convention `knowledge-copy.ts` established.
 */

/**
 * Engineering Work — the page's own hero/frame (docs/29 §1: "establishes
 * that the reader has left the general portfolio narrative... and entered
 * engineering documentation"). Carries no CTA, same reasoning as
 * `KNOWLEDGE_HERO_COPY`: a single primary action lives in `ContinueExploring`
 * at the bottom, not repeated here.
 */
export const WORK_HERO_COPY = {
  eyebrow: "Engineering Work",
  headline: "A record of how engineering problems actually get solved.",
  introduction: [
    "This isn't a portfolio of finished products. It's where the problems, constraints, architectural decisions, and trade-offs behind real systems get documented — the reasoning is the point, not just the outcome.",
    "Start with the philosophy below to understand how these decisions get made, then follow the evidence into the work itself.",
  ],
} as const;

/**
 * Engineering Philosophy — "How does this engineer approach problems,
 * before I see any evidence?" (docs/29 §1). Deliberately its own copy, not
 * a restatement of the homepage's `HOW_I_THINK_COPY` — that section explains
 * five general principles; this one is scoped specifically to how
 * engineering problems get approached under real constraints, and functions
 * as the thesis the rest of this page has to substantiate.
 */
export const ENGINEERING_PHILOSOPHY_COPY = {
  title: "Engineering Philosophy",
  introduction: [
    "Every meaningful project is a sequence of decisions made under constraints — time, scale, existing systems, the limits of what's actually known at the time. Those decisions are usually worth more than the finished product itself.",
    "The work below is presented as evidence of a consistent way of making them, not as a list of accomplishments.",
  ],
  commitmentsLabel: "What that looks like in practice",
  commitments: [
    {
      title: "System Thinking",
      description:
        "Every decision is evaluated against the system it's part of, not in isolation.",
    },
    {
      title: "Simplicity First",
      description:
        "Complexity gets added only after a simpler design has been tried and found wanting.",
    },
    {
      title: "Built to Last",
      description:
        "Maintainability is treated as a requirement from the start, not a cleanup pass at the end.",
    },
    {
      title: "Evidence Over Intuition",
      description:
        "Trade-offs are documented, not assumed — the reasoning matters as much as the result.",
    },
  ],
} as const;

/**
 * Featured Case Studies — "Which engineering work best represents this
 * workspace?" (docs/29 §1/§3). `introduction` states the single-source-of-
 * truth relationship explicitly (docs/29 §3 "Featured Is Not a Separate
 * Collection") rather than leaving it implicit, so the page itself teaches
 * a reader how Featured relates to the Project Library further down.
 */
export const FEATURED_CASE_STUDIES_COPY = {
  title: "Featured Case Studies",
  introduction: [
    "The strongest evidence for the philosophy above — chosen for architectural depth and the quality of the reasoning documented, not project size. These aren't a separate collection; they're the same Project Library below, with a curated subset marked out.",
  ],
  sectionLabel: "Featured",
  emptyState: [
    "No case study has been marked as a featured example yet.",
    "The complete Project Library below still reflects everything documented so far.",
  ],
} as const;

/**
 * Architecture Highlights — "Which engineering themes appear across
 * multiple projects?" (docs/29 §1/§4). `introduction` states the
 * navigation-model framing directly (docs/29 §4 approved refinement: "not
 * merely grouped content... the Work experience's second navigation
 * model"), so the distinction from the Project Library below is explained
 * on the page itself, not left for a reader to infer.
 */
export const ARCHITECTURE_HIGHLIGHTS_COPY = {
  title: "Architecture Highlights",
  introduction: [
    'A second way to explore the same work — by engineering concern instead of by project. The Project Library below answers "what was built." This answers "what keeps showing up in how it gets built."',
  ],
  emptyState: [
    "Recurring engineering themes will appear here once enough work has been documented to show a pattern.",
  ],
} as const;

/**
 * Project Library — "What engineering work is available?" (docs/29 §1/§5).
 * `scaleLabel` is a function, not a fixed string, the same pattern
 * `knowledge-copy.ts`'s `TOPIC_ARTICLES_COPY` uses for count-shaped copy —
 * the component supplies the real count, this file only owns the sentence
 * shape around it.
 */
export const PROJECT_LIBRARY_COPY = {
  title: "Project Library",
  introduction: [
    "The complete archive this page draws from — including the case studies featured above. Every project here is the same single record referenced everywhere else on this page; nothing below is a separate list.",
  ],
  scaleLabel: (count: number) =>
    `${count} engineering ${count === 1 ? "project" : "projects"} documented so far.`,
  shapeLabel: "Organized by domain:",
  emptyState: [
    "The Project Library is still being populated.",
    "Check back soon as new engineering work is documented.",
  ],
} as const;

/**
 * Engineering Lessons — "What reusable engineering knowledge emerged from
 * this work?" (docs/29 §1/§3/§6, approved refinement #3's exact framing).
 * `introduction` states the bridge to the Knowledge Library explicitly:
 * "not every lesson becomes an article, but every article may originate
 * from one of these lessons" (docs/29 §6).
 */
export const ENGINEERING_LESSONS_COPY = {
  title: "Engineering Lessons",
  introduction: [
    "What reusable engineering knowledge emerged from this work — not project trivia, but the kind of insight that outlives the project it came from.",
    "Not every lesson here becomes a standalone article, but every article in the Knowledge Library may have started as one of these.",
  ],
  emptyState: [
    "Lessons are still being distilled from the work documented so far.",
  ],
} as const;

/**
 * Continue Exploring — "Where do I go next?" (docs/29 §1, approved
 * refinement #4). Exactly three links, matching docs/29's own example list
 * verbatim in intent: related work, the Knowledge Library, Engineering
 * Logs. Each `description` states *why* this is the next step given what
 * was just read, not a generic "you might also like" line — docs/29 §4
 * ("Design principle: recommendations here must be contextual, never
 * generic... If a recommendation cannot be justified by something the
 * reader just encountered on this page, it does not belong in this
 * section.")
 *
 * `app/work/page.tsx` calls `.links(projectLibraryHref)` and passes the
 * resolved array into the now-generalized `ContinueExploring` component
 * (Task 5.2) as a prop — this file no longer needs to be read by that
 * component directly, only by the page composing it. The first link's
 * `href` is a parameter, not a literal (Task 5.1 review refinement #4)
 * because it comes from `lib/content/work.ts`'s `getProjectLibraryHref()`,
 * which returned the Landing's own in-page anchor (`#project-library`)
 * before Task 5.2 existed, and now returns the real `/work/library` route
 * — a change made once, in that resolver, with no edit needed here. The
 * other two links point at `/knowledge` (resolves today) and
 * `/engineering-log` (documented in `lib/navigation/config.ts`, doesn't
 * resolve yet) — the same "linked before the route resolves" precedent
 * already used by the header nav and the homepage's own Engineering Log
 * CTA.
 */
export const CONTINUE_EXPLORING_COPY = {
  title: "Continue Exploring",
  introduction: [
    "This page is an entry point, not a destination. Where you go next depends on what you're curious about.",
  ],
  links: (projectLibraryHref: string) =>
    [
      {
        label: "Browse the complete Case Study Library →",
        description:
          "Featured above is a curated subset — the Library holds every case study, organized to explore.",
        href: projectLibraryHref,
      },
      {
        label: "Continue into the Knowledge Library →",
        description:
          "Every lesson above traces back to a concept — the Knowledge Library explains it in full.",
        href: "/knowledge",
      },
      {
        label: "Continue into Engineering Logs →",
        description:
          "Case studies are the polished outcome. Engineering Logs hold the process that led there.",
        href: "/engineering-log",
      },
    ] as const,
} as const;
