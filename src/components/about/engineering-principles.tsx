/**
 * EngineeringPrinciples — "How do they think about building software?"
 * (docs/39 §8, WI-4).
 *
 * The fuller reading of docs/01's own five-point Engineering Philosophy —
 * not the homepage's `HowIThink`, which explains a different five
 * principles at homepage-scoped depth (docs/40 §5's Homepage/About
 * separation). Reuses `EngineeringPhilosophy`'s (Work Landing) own plain,
 * borderless grid with a single top rule per cell — a reference list for a
 * set of short, parallel statements, not a card grid and not a chaptered
 * essay (the same idiom that component's own docstring establishes,
 * applied here to a person's principles instead of a project's
 * commitments).
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ENGINEERING_PRINCIPLES_COPY } from "@/lib/constants/about-copy";

export function EngineeringPrinciples() {
  return (
    <Section
      id="engineering-principles"
      aria-labelledby="engineering-principles-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="sm" className="max-w-reading">
          <h2
            id="engineering-principles-heading"
            className="text-h2 text-foreground"
          >
            {ENGINEERING_PRINCIPLES_COPY.title}
          </h2>
          {ENGINEERING_PRINCIPLES_COPY.introduction.map((paragraph) => (
            <p
              key={paragraph}
              className="text-body text-justify leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </Stack>

        <ul className="grid max-w-reading gap-6 sm:grid-cols-2">
          {ENGINEERING_PRINCIPLES_COPY.principles.map((principle) => (
            <li
              key={principle.title}
              className="border-t border-border/40 pt-4"
            >
              <h3 className="text-h4 text-foreground">{principle.title}</h3>
              <p className="mt-2 text-small text-justify text-muted-foreground">
                {principle.description}
              </p>
            </li>
          ))}
        </ul>
      </Stack>
    </Section>
  );
}
