/**
 * TopicTile
 *
 * One knowledge-domain tile — extracted from `browse-by-topic.tsx` (Task
 * 4.1) into its own file in Task 4.2 so `RelatedTopics` can reuse the exact
 * same tile instead of re-implementing it. `BrowseByTopic` (library-wide
 * "browse everything") and `RelatedTopics` (topic-page "explore adjacent
 * domains") show the same kind of object, just different, differently-sized
 * lists of `Topic`s — the tile itself doesn't need to know which.
 *
 * `inviteLabel` (Task 4.2 design refinement #6) is what differentiates the
 * two contexts without forking the tile: `RelatedTopics` passes one (e.g.
 * "Explore →"), reading as a direct invitation to continue into that
 * specific domain; `BrowseByTopic` doesn't, keeping its tiles neutral —
 * appropriate for "here is everything," not "here's what's next." Rendered
 * as plain text, not a `Button` — the whole tile is already the single
 * click target (docs/08-UX Guidelines.md "Buttons should represent
 * actions... never navigation that could simply be a link"), so this is a
 * visual cue reinforcing the existing affordance, not a second action.
 *
 * A single whole-tile `<Link>` rather than the stretched-link pattern used
 * elsewhere: a tile has no other interactive content inside it, so there's
 * no nested-interactive-element problem to work around.
 */
import Link from "next/link";

import { Stack } from "@/components/layout/stack";
import type { Topic } from "@/lib/constants/placeholder-topics";

export function TopicTile({
  topic,
  inviteLabel,
}: {
  topic: Topic;
  inviteLabel?: string;
}) {
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
        {inviteLabel && (
          <p className="pt-1 text-caption text-foreground">{inviteLabel}</p>
        )}
      </Stack>
    </Link>
  );
}
