/**
 * Knowledge Landing Copy
 *
 * Copy for the `/knowledge` landing page (Task 4.1), one constant per
 * section, mirroring the existing `homepage-copy.ts` pattern: copy lives as
 * data, separate from the JSX in `components/knowledge/*`, so the source of
 * truth stays reviewable on its own.
 *
 * Written to docs/16-WRITING_GUIDELINES.md's tone ("calm, thoughtful,
 * curious, honest, technical, approachable" — no marketing language) and
 * docs/15-KNOWLEDGE_EXPERIENCE.md's framing (discovery over chronology,
 * "closer to an engineering handbook than a news feed").
 *
 * Every `emptyState` here is genuine copy the matching component renders
 * whenever its data array is empty — not a hypothetical — following the
 * same pattern `homepage-copy.ts` already established for
 * `ENGINEERING_NOTEBOOK_COPY` etc. (docs/08-UX Guidelines.md "Empty
 * States": educate rather than disappoint.)
 */

export const KNOWLEDGE_HERO_COPY = {
  eyebrow: "Engineering Knowledge",
  headline: "A long-term reference for how I think about engineering.",
  introduction: [
    "This is where engineering concepts, architecture decisions, backend systems, security, cloud computing, and lessons learned live once they're worth keeping.",
    "Nothing here is written to be consumed once. Every article is meant to still be useful in two years, not just relevant this week.",
  ],
} as const;

export const START_HERE_COPY = {
  title: "Start Here",
  introduction: [
    "New here? These three articles are the clearest way into how this workspace thinks about engineering — start with whichever one matches what you're trying to understand.",
  ],
  /**
   * Small kicker rendered on each card (Task 4.1 design refinement #4) —
   * distinguishes these as editorially curated picks, not the newest or a
   * browsable category, the same way `CURRENT_FOCUS_COPY.focusAreaLabel`
   * ("Exploring") labels the homepage's cards as active exploration rather
   * than a finished skill. One shared label, not per-card data — every
   * Start Here entry carries the same designation.
   */
  cardLabel: "Recommended",
  emptyState: [
    "A starting point is being curated.",
    "Check back soon, or browse by topic below in the meantime.",
  ],
} as const;

export const BROWSE_BY_TOPIC_COPY = {
  title: "Browse by Topic",
  introduction: [
    "Knowledge here is organized by concept, not by chronology. Pick a domain and go deep.",
  ],
  emptyState: ["Topics will appear here as the library grows."],
} as const;

export const LEARNING_SERIES_COPY = {
  title: "Learning Series",
  introduction: [
    "Some ideas take more than one article to explain properly. These series build understanding in order, one part at a time.",
  ],
  emptyState: [
    "The first learning series is still being written.",
    "Individual articles are still the right place to start until then.",
  ],
} as const;

export const RECENTLY_PUBLISHED_COPY = {
  title: "Recently Published",
  introduction: [
    "The newest additions to the workspace — useful if you're already familiar with where things are, less useful if you're just getting started.",
  ],
  emptyState: [
    "Nothing has been published yet — the first article will appear here.",
  ],
} as const;

/**
 * Explore the Library — the page's single closing CTA (Task 4.1 §8). Points
 * back to the Browse by Topic grid (`#browse-by-topic`, the id `BrowseByTopic`
 * sets on its own `Section`) rather than an unbuilt "all articles" route:
 * this page *is* the library's entrance, and Search/filtering/pagination are
 * explicitly out of scope for this task, so the honest "explore more"
 * destination is the discovery section already on this page.
 */
export const EXPLORE_LIBRARY_CTA_COPY = {
  title: "Explore the Complete Library",
  description:
    "Every topic above is a starting point, not a destination. The library grows every week — come back often.",
  primaryCta: {
    label: "Browse by Topic ↑",
    href: "#browse-by-topic",
  },
} as const;
