/**
 * HowIThink
 *
 * "The emotional center of the homepage" (Task 3.3) — the engineering
 * principles that guide decision-making, not an About section and not a
 * philosophy essay. See docs/13-HOMEPAGE_EXPERIENCE.md ("How I Think" —
 * "introduce engineering philosophy... principles, not marketing
 * statements") and docs/14-HOMEPAGE_COPY.md ("How I Think"). Copy is
 * reproduced verbatim from lib/constants/homepage-copy.ts's
 * `HOW_I_THINK_COPY`.
 *
 * Deliberately does not reuse Current Focus's `Card` grid — this section
 * needs its own visual identity (Task 3.3 §4). Principles read as a
 * progression, not a list (polish pass): a continuous vertical rail runs
 * down the left of the column, one small `border-l` segment per `<li>`
 * that optically joins into a single unbroken line because the items
 * stack with zero vertical gap — no absolute positioning, so there's
 * nothing that can misalign. Each principle gets a quiet "01"-style
 * chapter number above its title (font-mono/text-caption, the same small
 * numeric-label idiom already used for the Hero's "README.md" tab and the
 * Workspace Snapshot's field labels), reinforcing "chapter," not "grid
 * item." No horizontal dividers anywhere — whitespace (`py-10`) plus the
 * rail carry all the separation, deliberately quieter than the original
 * `divide-y`/`border-y` pass. Column width is capped at `max-w-prose`
 * (65ch, tighter than the rest of the homepage's `max-w-reading`/72ch) for
 * an easier long-form reading measure. Titles are `text-h3` sized but
 * `font-medium` rather than the token's default 600 weight, so the prose
 * carries more visual weight than the heading.
 *
 * No hover state and no motion anywhere in this file: Current Focus got an
 * explicit, requested exception to "avoid animations"; this task doesn't
 * ask for one, so this section stays fully static per its own constraint
 * list ("do not... add animations," "decorate the principles").
 *
 * A Server Component: static content, no interactivity.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { HOW_I_THINK_COPY } from "@/lib/constants/homepage-copy";

export function HowIThink() {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer
    // for every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <Stack gap="xl">
        <Stack gap="xs" className="max-w-prose">
          <h2 className="text-h2 text-foreground">{HOW_I_THINK_COPY.title}</h2>
          {HOW_I_THINK_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {/* Ordered list — the doc presents these five principles in a
            specific sequence, and now the layout says so too: each item's
            left border segment joins the next into one continuous rail,
            reading as a progression rather than independent entries. */}
        <ol className="max-w-prose">
          {HOW_I_THINK_COPY.principles.map((principle, index) => (
            <li
              key={principle.title}
              className="border-l border-border/40 py-10 pl-6 first:pt-0 last:pb-0"
            >
              <p className="font-mono text-caption text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-1 text-h3 font-medium text-foreground">
                {principle.title}
              </h3>
              <Stack gap="xs" className="mt-3">
                {principle.explanation.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-body leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </Stack>
            </li>
          ))}
        </ol>
      </Stack>
    </Section>
  );
}
