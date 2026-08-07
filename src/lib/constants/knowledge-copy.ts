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
   * Small kicker rendered on each card. Originally "Recommended" (Task 4.1
   * design refinement #4); renamed to "Start Here" in Task 4.2 design
   * refinement #4 to reinforce these specific cards as the intended entry
   * points rather than a general endorsement — applied here too (not just
   * on topic pages) since both pages render the exact same card via the
   * same `StartHere` component, and the reasoning is identical on both. One
   * shared label, not per-card data — every Start Here entry carries the
   * same designation.
   */
  cardLabel: "Start Here",
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

/**
 * Topic Page Copy (Task 4.2, `/knowledge/[slug]`)
 *
 * `StartHere`/`LearningSeries` were generalized in Task 4.2 to accept
 * `title`/`introduction`/`emptyState` as props instead of importing
 * `START_HERE_COPY`/`LEARNING_SERIES_COPY` directly — that's what lets a
 * topic page reuse the exact same components with topic-specific wording.
 * `app/knowledge/[slug]/page.tsx` builds each section's copy by calling
 * these generators with the resolved `Topic.title`, keeping the "copy lives
 * as data" convention rather than string-building inline in the page.
 *
 * Section *headings* stay identical to the library-wide page ("Start
 * Here", "Learning Series") — a visitor who's already seen `/knowledge`
 * recognizes the pattern immediately; only the introduction copy underneath
 * is topic-specific.
 */

export const TOPIC_START_HERE_COPY = {
  /** Same kicker as the library-wide Start Here — see its own comment. */
  cardLabel: "Start Here",
  introduction: (topicTitle: string) => [
    `New to ${topicTitle}? These three articles are the clearest way in — start with whichever one matches what you're trying to understand.`,
  ],
  emptyState: [
    "Curated starting points for this topic are still being selected.",
    "The related topics below are a good place to keep exploring in the meantime.",
  ],
} as const;

export const TOPIC_LEARNING_SERIES_COPY = {
  introduction: (topicTitle: string) => [
    `Some ${topicTitle} topics take more than one article to explain properly. These series build understanding in order, one part at a time.`,
  ],
  emptyState: [
    "No learning series here yet — individual articles below are still the right place to start.",
  ],
} as const;

/**
 * Articles — the topic page's remaining-articles section (Task 4.2 §5).
 * Deliberately named "Articles," not "Recently Published": this list isn't
 * primarily chronological (published date is one metadata field among
 * several, not the organizing principle), and framing it as "recent" would
 * misrepresent what's actually a topic's full remaining shelf.
 */
export const TOPIC_ARTICLES_COPY = {
  title: "Articles",
  introduction: (topicTitle: string) => [
    `The rest of the ${topicTitle} shelf — everything beyond the starting points above.`,
  ],
  emptyState: [
    "The rest of this topic's articles are still being written.",
    "Check back soon, or explore a related topic below.",
  ],
} as const;

/**
 * Related Topics — the topic page's closing section (Task 4.2 §6), the
 * per-topic equivalent of the library-wide page's `EXPLORE_LIBRARY_CTA_COPY`
 * close: instead of one CTA, a set of adjacent-domain tiles reusing
 * `BrowseByTopic`'s own `TopicTile` (see `related-topics.tsx`).
 */
export const RELATED_TOPICS_COPY = {
  title: "Related Topics",
  introduction: (topicTitle: string) => [
    `${topicTitle} rarely stands alone. These domains come up alongside it often enough to be worth exploring next.`,
  ],
  emptyState: ["Related topics for this domain are still being curated."],
} as const;
