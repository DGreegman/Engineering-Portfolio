/**
 * Journey — "How did they get here?" (docs/39 §8, WI-3).
 *
 * Prose, not a timeline widget — no date list, no "years active" figure,
 * no chronological marker rendered as a structural element (docs/39 §16's
 * "causality over chronology" ruling, the same discipline docs/33
 * §7 already applies to a system's own evolution narrative, extended here
 * to a person's). Any date that does appear does so only inside prose, and
 * only because `JOURNEY_COPY` itself states one.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { JOURNEY_COPY } from "@/lib/constants/about-copy";

export function Journey() {
  return (
    <Section
      id="journey"
      aria-labelledby="journey-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="sm" className="max-w-reading">
        <h2 id="journey-heading" className="text-h2 text-foreground">
          {JOURNEY_COPY.title}
        </h2>
        {JOURNEY_COPY.paragraphs.map((paragraph) => (
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
