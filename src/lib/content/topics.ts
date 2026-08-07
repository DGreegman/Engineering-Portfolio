/**
 * Topic Vocabulary
 *
 * The single source of truth for the eight known topic slugs — the
 * controlled vocabulary a Knowledge article's `topic` field is validated
 * against (see `schema.ts`'s `knowledgeFrontmatterSchema`), and the same
 * list `lib/constants/placeholder-topics.ts` types its own `Topic.slug`/
 * `Topic.relatedTopics` fields against (Task 4.3.1 refinement: "make the
 * content layer the single owner of `TOPIC_SLUGS`; have presentation
 * import from it" — previously that file declared its own separate,
 * by-hand-synced copy of these values).
 *
 * Lives in `lib/content`, not `lib/constants`, because the vocabulary is a
 * content-modeling concern before it's a presentation one — validating
 * article frontmatter needs it regardless of whether any UI ever renders a
 * topic list. Presentation code (`placeholder-topics.ts` today; a real
 * Topic collection's loader eventually) imports `TOPIC_SLUGS`/`TopicSlug`
 * from here; this file has and should have no reverse dependency on
 * presentation code.
 */
export const TOPIC_SLUGS = [
  "backend",
  "system-design",
  "security",
  "cloud",
  "distributed-systems",
  "architecture",
  "performance",
  "testing",
] as const;

export type TopicSlug = (typeof TOPIC_SLUGS)[number];
