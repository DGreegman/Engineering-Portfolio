/**
 * WorkHero
 *
 * "Engineering Work" — the opening section of `/work` (Task 5.1). Per
 * docs/29-WORK_LANDING_PROPOSAL.md §1, this is the page frame, distinct
 * from `EngineeringPhilosophy` beneath it: its job is only to establish
 * that the reader has left the general portfolio narrative and entered
 * engineering documentation, before any claim or evidence is introduced.
 *
 * Deliberately carries no CTA — same reasoning as `KnowledgeHero`: a single
 * primary action lives in `ContinueExploring` at the bottom of the page, not
 * repeated here.
 *
 * `text-h1` — the largest heading on this page, one step down from the
 * site's actual homepage hero, so `/work` reads as a section landing page,
 * matching `KnowledgeHero`'s own reasoning for the same choice.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { WORK_HERO_COPY } from "@/lib/constants/work-copy";

export function WorkHero() {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer for
    // every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <Stack gap="lg" className="max-w-reading">
        <p className="font-mono text-caption text-muted-foreground">
          {WORK_HERO_COPY.eyebrow}
        </p>

        <h1 className="text-h1 text-foreground">{WORK_HERO_COPY.headline}</h1>

        <Stack gap="sm">
          {WORK_HERO_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>
      </Stack>
    </Section>
  );
}
