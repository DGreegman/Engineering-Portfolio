/**
 * Tools — "What do they actually build with?" (docs/39 §8, WI-6).
 *
 * Plain text, deliberately never a badge wall, a logo grid, or a
 * percentage-rated skill bar — docs/01's own "Things We Never Do" rejects
 * both outright ("Never use skill progress bars," "Never rate technologies
 * with percentages"). The same "quiet metadata line, never a primary
 * identity" register `ProjectHeader`'s own technologies line already
 * establishes for a project, applied here to a person's own toolset.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { TOOLS_COPY } from "@/lib/constants/about-copy";

export function Tools() {
  return (
    <Section
      id="tools"
      aria-labelledby="tools-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="sm" className="max-w-reading">
        <h2 id="tools-heading" className="text-h2 text-foreground">
          {TOOLS_COPY.title}
        </h2>
        {TOOLS_COPY.introduction.map((paragraph) => (
          <p
            key={paragraph}
            className="text-body text-justify leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
        <p className="text-body text-foreground">
          {TOOLS_COPY.items.join(" · ")}
        </p>
      </Stack>
    </Section>
  );
}
