/**
 * RelatedTopics
 *
 * The topic page's closing section (Task 4.2 §6) — adjacent engineering
 * domains, so readers naturally continue exploring instead of hitting a
 * dead end (docs/04-INFORMATION_ARCHITECTURE.md's "Dead-End Prevention").
 * The per-topic equivalent of the library-wide page's closing
 * `ExploreLibraryCta`: instead of one CTA pointing back into the same
 * page's topic grid, this offers several concrete next domains to jump to.
 *
 * Reuses `TopicTile` (extracted from `browse-by-topic.tsx` in this same
 * task) — a "related topic" and a "browsable topic" are the same kind of
 * object, just a different, smaller list, so this doesn't re-implement the
 * tile. Passes `inviteLabel="Explore →"` (design refinement #6), which
 * `BrowseByTopic` deliberately doesn't: this section is framed as a
 * concrete next step ("go here next"), not a neutral browse-everything
 * grid, so its tiles read as invitations rather than a flat link list.
 *
 * Fully data-agnostic: `topics` is a required prop, already resolved to
 * `Topic[]` by the caller (`app/knowledge/[slug]/page.tsx` maps the
 * current topic's `relatedTopics` slugs to full `Topic` objects — this
 * component doesn't know about slugs or do any lookup itself).
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { TopicTile } from "@/components/knowledge/topic-tile";
import type { Topic } from "@/lib/constants/placeholder-topics";

export function RelatedTopics({
  title,
  introduction,
  emptyState,
  topics,
}: {
  title: string;
  introduction: readonly string[];
  emptyState: readonly string[];
  topics: Topic[];
}) {
  return (
    <Section
      id="related-topics"
      aria-labelledby="related-topics-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="related-topics-heading" className="text-h2 text-foreground">
            {title}
          </h2>
          {introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {topics.length === 0 ? (
          <Stack gap="xs">
            {emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <TopicTile topic={topic} inviteLabel="Explore →" />
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
