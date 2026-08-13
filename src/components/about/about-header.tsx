/**
 * AboutHeader — `/about`'s opening section (Task 6.3, WI-2).
 *
 * "Who is this, in one line?" (docs/39 §8). The page's only `<h1>`.
 * Structurally the same eyebrow → h1 → intro-paragraphs shape every other
 * landing/index page in this workspace already opens with (WorkHero,
 * `app/engineering-log/page.tsx`'s own inline header) — reused as a
 * pattern, not imported across a route boundary, matching every prior
 * Core Pages task's "every route owns its own section components" rule.
 *
 * No portrait — none exists in this repository (docs/39 D3); this file
 * contains no `<img>`/`next/image` element, not a conditional one.
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ABOUT_HEADER_COPY } from "@/lib/constants/about-copy";

export function AboutHeader() {
  return (
    <Section spacing="md" width="full">
      <Stack gap="lg" className="max-w-reading">
        <p className="font-mono text-caption text-muted-foreground">
          {ABOUT_HEADER_COPY.eyebrow}
        </p>

        <h1 className="text-h1 text-foreground">
          {ABOUT_HEADER_COPY.headline}
        </h1>

        <Stack gap="sm">
          {ABOUT_HEADER_COPY.introduction.map((paragraph) => (
            <p
              key={paragraph}
              className="text-body leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </Stack>
      </Stack>
    </Section>
  );
}
