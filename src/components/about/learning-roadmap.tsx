/**
 * LearningRoadmap — "Where is this heading?" (docs/39 §8, WI-7).
 *
 * Forward-looking, grounded in docs/01's own "Future Identity" and
 * "Long-Term Vision" sections — plain prose, the same register as Journey.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { LEARNING_ROADMAP_COPY } from "@/lib/constants/about-copy";

export function LearningRoadmap() {
  return (
    <Section
      id="learning-roadmap"
      aria-labelledby="learning-roadmap-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="sm" className="max-w-reading">
        <h2 id="learning-roadmap-heading" className="text-h2 text-foreground">
          {LEARNING_ROADMAP_COPY.title}
        </h2>
        {LEARNING_ROADMAP_COPY.paragraphs.map((paragraph) => (
          <p
            key={paragraph}
            className="text-body text-justify leading-relaxed text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </Stack>
    </Section>
  );
}
