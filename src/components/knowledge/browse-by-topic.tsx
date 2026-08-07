/**
 * BrowseByTopic
 *
 * Displays the primary knowledge domains (Task 4.1 §5). Knowledge here is
 * organized by concept, not technology or chronology — see
 * docs/15-KNOWLEDGE_EXPERIENCE.md ("Topics" — "organized by concepts rather
 * than technologies").
 *
 * Each tile shows a description and, when present, an article count —
 * designed for that future expansion (Task 4.1 §5) without waiting on it:
 * `Topic.articleCount` is optional, and the count line simply doesn't
 * render until the Content Engine can compute a real one (see
 * `placeholder-topics.ts`'s docstring — no fabricated numbers today).
 *
 * The tile itself is `TopicTile` (extracted to its own file in Task 4.2) —
 * `RelatedTopics` on topic pages reuses it verbatim rather than
 * re-implementing the same tile with a second, differently-sized list.
 *
 * Fully data-agnostic: `topics` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { TopicTile } from "@/components/knowledge/topic-tile";
import { BROWSE_BY_TOPIC_COPY } from "@/lib/constants/knowledge-copy";
import type { Topic } from "@/lib/constants/placeholder-topics";

export function BrowseByTopic({ topics }: { topics: Topic[] }) {
  return (
    // width="full" — see KnowledgeHero's comment.
    <Section
      id="browse-by-topic"
      aria-labelledby="browse-by-topic-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="browse-by-topic-heading" className="text-h2 text-foreground">
            {BROWSE_BY_TOPIC_COPY.title}
          </h2>
          {BROWSE_BY_TOPIC_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {topics.length === 0 ? (
          <Stack gap="xs">
            {BROWSE_BY_TOPIC_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <TopicTile topic={topic} />
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
