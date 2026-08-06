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
 * Each tile is a single whole-tile `<Link>` rather than the stretched-link
 * pattern used elsewhere on this page: a tile has no other interactive
 * content inside it, so there's no nested-interactive-element problem to
 * work around, and one real anchor covering the whole tile is simpler.
 *
 * Fully data-agnostic: `topics` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { BROWSE_BY_TOPIC_COPY } from "@/lib/constants/knowledge-copy";
import type { Topic } from "@/lib/constants/placeholder-topics";

function TopicTile({ topic }: { topic: Topic }) {
  return (
    <Link
      href={topic.href}
      className="block h-full rounded-lg border border-border p-5 transition-colors duration-150 hover:border-foreground/30 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
    >
      <Stack gap="xs">
        <h3 className="text-h4 text-foreground">{topic.title}</h3>
        <p className="text-small text-muted-foreground">{topic.description}</p>
        {typeof topic.articleCount === "number" && (
          <p className="text-caption text-muted-foreground/70">
            {topic.articleCount}{" "}
            {topic.articleCount === 1 ? "article" : "articles"}
          </p>
        )}
      </Stack>
    </Link>
  );
}

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
