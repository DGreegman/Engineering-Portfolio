/**
 * KnowledgeHero
 *
 * The opening section of `/knowledge` — introduces the Engineering
 * Knowledge library itself, not a specific article (Task 4.1 §3). See
 * docs/15-KNOWLEDGE_EXPERIENCE.md ("Knowledge Homepage" — "prioritize
 * discovery over chronology") and docs/16-WRITING_GUIDELINES.md's tone
 * guidance. Copy is reproduced verbatim from
 * lib/constants/knowledge-copy.ts's `KNOWLEDGE_HERO_COPY`.
 *
 * Deliberately carries no CTA — Task 4.1 §8 asks for a single primary
 * action on the page, and that lives in `ExploreLibraryCta` at the bottom.
 * Repeating a CTA here would dilute which one is "the" primary action.
 *
 * `text-h1` (not the homepage's `text-display`) — the largest heading on
 * this page, but one step down from the site's actual homepage hero, so
 * `/knowledge` reads as a section landing page rather than a second
 * homepage.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { KNOWLEDGE_HERO_COPY } from "@/lib/constants/knowledge-copy";

export function KnowledgeHero() {
  return (
    // width="full": /knowledge renders under a sidebar, and
    // WorkspaceLayout now wraps the sidebar/main row in its own shared
    // Container — an inner "wide" Container here would double the gutter
    // and misalign this content from Header's brand again.
    <Section spacing="md" width="full">
      <Stack gap="lg" className="max-w-reading">
        <p className="font-mono text-caption text-muted-foreground">
          {KNOWLEDGE_HERO_COPY.eyebrow}
        </p>

        <h1 className="text-h1 text-foreground">
          {KNOWLEDGE_HERO_COPY.headline}
        </h1>

        <Stack gap="sm">
          {KNOWLEDGE_HERO_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>
      </Stack>
    </Section>
  );
}
