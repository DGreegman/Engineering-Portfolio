/**
 * Homepage Copy — Hero
 *
 * Canonical hero copy, taken verbatim from docs/14-HOMEPAGE_COPY.md
 * ("Hero"). Kept as data — separate from the JSX in
 * components/home/readme-hero.tsx — so the source of truth stays
 * reviewable on its own, mirroring the existing site.ts /
 * workspace-metadata.ts pattern. Do not rewrite this copy; if it looks
 * wrong, the fix belongs in docs/14-HOMEPAGE_COPY.md first.
 *
 * Scoped to the Hero section only. Later homepage sections (Current
 * Focus, How I Think, …) should extend this same file rather than each
 * inventing their own copy constant.
 */

export const HERO_COPY = {
  readmeLabel: "README.md",
  headline: "An engineering workspace for curious developers.",
  supportingCopy: [
    "I build reliable backend systems, explore software architecture, and document the lessons, trade-offs, and engineering decisions behind the code.",
    "This workspace is where I share what I learn, how I solve problems, and the thinking behind the systems I build. Whether you're here to learn something new or simply curious about how I approach engineering, I hope you leave with an idea worth taking with you.",
  ],
  primaryCta: {
    label: "Explore Knowledge →",
    href: "/knowledge",
  },
  terminal: {
    command: "git status",
    output: ["On branch main", "Working tree clean"],
  },
} as const;

/**
 * Current Workspace — docs/14-HOMEPAGE_COPY.md ("Current Workspace").
 *
 * Structured as a list of labeled entries (rather than four separate named
 * fields) so the card that renders this can map over `entries` instead of
 * hand-writing one block per field — per the doc's own Notes: "content
 * should be configuration-driven and easy to update." Each entry is either
 * a short list (`items`) or a single line (`value`); the component decides
 * how to render each shape.
 */
export const WORKSPACE_SNAPSHOT_COPY = {
  title: "Current Workspace",
  entries: [
    {
      label: "Currently Exploring",
      items: [
        "Distributed Systems",
        "Cloud Architecture",
        "Security Engineering",
        "AI Engineering",
      ],
    },
    { label: "Currently Building", value: "Engineering Portfolio" },
    { label: "Latest Thought", value: "Documentation is part of engineering." },
    {
      label: "Currently Reading",
      value: "Designing Data-Intensive Applications",
    },
  ],
} as const;

/**
 * Current Focus — docs/14-HOMEPAGE_COPY.md ("Current Exploring").
 *
 * Named for the task's stable structural role (Task 3.2 — "Current
 * Focus"), not the doc's current heading/title text — doc 14's section
 * heading ("Current Exploring"), its own `Title` field ("Currently
 * Exploring"), and this constant's name have all drifted slightly from
 * each other already; keeping the constant name stable and only the
 * `title` value sourced from the doc means a future copy edit is a data
 * change here, not a rename across every file that imports it (see
 * `WORKSPACE_SNAPSHOT_COPY`'s naming note above for the same reasoning
 * learned the hard way on Task 3.1).
 *
 * `focusAreas` is a list of {title, description} — configuration-driven,
 * so a fifth area later is a data addition, not a markup change.
 *
 * `focusAreaLabel` is the small muted eyebrow each card shows above its
 * title (Task 3.2's polish pass, §2). Not sourced from doc 14 — it's
 * component chrome, not article copy — but shared as one value here rather
 * than repeated per-card, since every focus area is the same kind of thing
 * (an active area of exploration, not a finished skill).
 */
export const CURRENT_FOCUS_COPY = {
  title: "Currently Exploring",
  focusAreaLabel: "Exploring",
  introduction: [
    "Technology evolves constantly, and so should engineers.",
    "These are the areas I'm actively exploring, building, and thinking about. They represent where my curiosity is leading me today—not a checklist of completed skills.",
  ],
  focusAreas: [
    {
      title: "Distributed Systems",
      description:
        "Designing reliable systems that continue to perform as they grow in scale, complexity, and traffic.",
    },
    {
      title: "Cloud Architecture",
      description:
        "Learning how to build resilient, observable, and cost-effective infrastructure for modern applications.",
    },
    {
      title: "Security Engineering",
      description:
        "Understanding how to design systems where security is considered from the very beginning, not added later.",
    },
    {
      title: "AI Engineering",
      description:
        "Exploring practical ways AI can improve software development, developer workflows, and engineering productivity.",
    },
  ],
} as const;

/**
 * How I Think — docs/14-HOMEPAGE_COPY.md ("How I Think").
 *
 * Each principle's `explanation` is two paragraphs as authored in the doc
 * (kept as separate array entries rather than merged into one block —
 * Task 0's "do not rewrite or reinterpret the copy" extends to preserving
 * the doc's own paragraph breaks, not just its wording).
 */
export const HOW_I_THINK_COPY = {
  title: "How I Think",
  introduction: [
    "Technology changes. Frameworks come and go. But good engineering principles tend to last.",
    "These are the ideas that shape how I approach every system I design, every problem I solve, and every engineering decision I make.",
  ],
  principles: [
    {
      title: "Simplicity over Complexity",
      explanation: [
        "The best systems are often the easiest to understand.",
        "I prefer solutions that remain simple, maintainable, and predictable before introducing additional complexity.",
      ],
    },
    {
      title: "Reliability before Cleverness",
      explanation: [
        "Software should be dependable before it is impressive.",
        "A reliable system that engineers can trust will always outlast a clever solution that nobody understands.",
      ],
    },
    {
      title: "Documentation is Part of Engineering",
      explanation: [
        "Writing the code is only part of the work.",
        "If future engineers cannot understand why a system exists or how it works, the engineering isn't finished.",
      ],
    },
    {
      title: "Security is a Design Decision",
      explanation: [
        "Security shouldn't be something added at the end of development.",
        "It should influence architecture, APIs, data handling, and infrastructure from the very beginning.",
      ],
    },
    {
      title: "Learn Publicly",
      explanation: [
        "Every article, engineering log, and case study on this site exists because teaching is one of the best ways to learn.",
        "Teaching is one of the best ways to deepen understanding.",
      ],
    },
  ],
} as const;

/**
 * Engineering Notebook — docs/14-HOMEPAGE_COPY.md ("Engineering Notebook").
 *
 * `emptyState` is real copy, not a hypothetical — `EngineeringNotebook`
 * renders it whenever the `articles` it's given is empty (see that
 * component). Today the page always passes a non-empty placeholder array,
 * so this branch doesn't trigger, but it will be exactly correct the
 * moment `articles` is empty for real, with zero changes needed here.
 */
export const ENGINEERING_NOTEBOOK_COPY = {
  title: "Engineering Notebook",
  introduction: [
    "Ideas become clearer when they're written down.",
    "This notebook contains engineering concepts, architecture decisions, backend development, security, cloud computing, and lessons learned while building real systems.",
    "Every article exists to answer a question, explore a trade-off, or explain an engineering decision.",
  ],
  sectionLabel: "Recently Added",
  emptyState: [
    "Knowledge articles will appear here.",
    "Until then, the notebook is waiting for its first entry.",
  ],
  primaryCta: {
    label: "Browse All Knowledge →",
    href: "/knowledge",
  },
} as const;

/**
 * Engineering Case Studies — docs/14-HOMEPAGE_COPY.md ("Engineering Case
 * Studies").
 *
 * Same `emptyState`-is-real-copy pattern as `ENGINEERING_NOTEBOOK_COPY`:
 * `EngineeringCaseStudies` renders it whenever `caseStudies` is empty,
 * which doesn't happen today (the page always passes a non-empty
 * placeholder array) but will be exactly correct once it does.
 */
export const CASE_STUDIES_COPY = {
  title: "Engineering Case Studies",
  introduction: [
    "Every project tells a story.",
    "These case studies explore the problems, constraints, architectural decisions, trade-offs, and lessons behind the systems I've built.",
    "Rather than showing what I built, they explain why it was built that way.",
  ],
  sectionLabel: "Featured Work",
  emptyState: [
    "Case studies will appear here as new systems are documented.",
    "Every case study focuses on engineering decisions rather than project showcases.",
  ],
  primaryCta: {
    label: "View All Case Studies →",
    href: "/work",
  },
} as const;

/**
 * Engineering Log — docs/14-HOMEPAGE_COPY.md ("Engineering Log").
 *
 * `emptyState` is a single paragraph here (unlike Notebook/Case Studies'
 * two), matching the doc exactly — kept as a one-item array rather than a
 * bare string so `EngineeringLog` can map over it the same way the other
 * two sections map over theirs, with no special-casing.
 */
export const ENGINEERING_LOG_COPY = {
  title: "Engineering Log",
  introduction: [
    "Engineering is a continuous process of learning, experimenting, and refining ideas.",
    "This log captures the journey behind the finished work—small discoveries, lessons learned, architectural experiments, debugging sessions, and ideas that are still evolving.",
    "Not every entry becomes an article or a case study, but every entry represents progress.",
  ],
  sectionLabel: "Recent Log Entries",
  emptyState: [
    "The first engineering log entries will appear here as the workspace grows.",
  ],
  primaryCta: {
    label: "View Engineering Log →",
    href: "/engineering-log",
  },
} as const;

/**
 * Beyond the Code — docs/14-HOMEPAGE_COPY.md ("Beyond the Code").
 *
 * The homepage's final section. `primaryCta.href` is `/about`, not a
 * dedicated contact route — docs/03-SITEMAP.md is explicit that there is
 * no standalone Contact page ("this section is the frictionless way to
 * reach out"); Contact is one of `/about`'s own sections (Email, GitHub,
 * LinkedIn, Resume).
 */
export const BEYOND_THE_CODE_COPY = {
  title: "Beyond the Code",
  introduction: [
    "Every system tells a story, but so does the person who builds it.",
    "I'm a software engineer who enjoys understanding how systems work, why architectural decisions matter, and how thoughtful engineering can solve real problems.",
    "Writing, documenting, and teaching are extensions of that curiosity. Sharing what I learn helps me refine my own thinking while hopefully making someone else's path a little clearer.",
    "This workspace is a reflection of that journey. It's where ideas become notes, notes become systems, and systems become lessons worth sharing.",
  ],
  primaryCta: {
    label: "Let's Connect →",
    href: "/about",
  },
} as const;
