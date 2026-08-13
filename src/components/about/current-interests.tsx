/**
 * CurrentInterests — "What are they exploring right now?" (docs/39 §8,
 * WI-5).
 *
 * About's own depth on this material, distinct from the homepage's
 * `CurrentFocus` card grid — plain prose here, matching Journey's and
 * Learning Roadmap's register, not a second card grid for content that
 * isn't structured as parallel short items at this depth (docs/40 §5).
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { CURRENT_INTERESTS_COPY } from "@/lib/constants/about-copy";

export function CurrentInterests() {
  return (
    <Section
      id="current-interests"
      aria-labelledby="current-interests-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="sm" className="max-w-reading">
        <h2 id="current-interests-heading" className="text-h2 text-foreground">
          {CURRENT_INTERESTS_COPY.title}
        </h2>
        {CURRENT_INTERESTS_COPY.paragraphs.map((paragraph) => (
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
