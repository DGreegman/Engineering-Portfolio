/**
 * CurrentFocus
 *
 * The section immediately below the README Hero — answers "what is this
 * engineer currently exploring," not "what can this engineer do." See
 * docs/13-HOMEPAGE_EXPERIENCE.md ("Current Focus" — "highlight ongoing
 * learning") and docs/14-HOMEPAGE_COPY.md ("Current Exploring"). Copy is
 * reproduced verbatim from lib/constants/homepage-copy.ts's
 * `CURRENT_FOCUS_COPY`.
 *
 * Deliberately not a Skills section: no icons, logos, ratings, or
 * percentages — each card is a small muted "Exploring" label, a title, and
 * one reasoning sentence (why this area is being explored, not just its
 * name) — and the grid caps at two columns even on wide screens so every
 * card keeps room to read as a notebook page rather than a badge in a
 * tight row.
 *
 * Reuses `Card`/`CardHeader`/`CardContent` — the same primitives
 * `WorkspaceSnapshot` already established for the homepage's "notebook
 * card" visual language, rather than a second bespoke card style. Padding
 * is bumped up from Card's default via plain `py-6`/`px-6` overrides (the
 * same reliable mechanism `WorkspaceSnapshot` settled on after the
 * `--card-spacing` custom-property override went stale on this repo's dev
 * server — see that component's comments) rather than reassigning
 * `--card-spacing` again.
 *
 * Hover state (explicitly requested, an intentional exception to this
 * task's own "avoid animations" line): each card gets a very slight scale
 * and, next to its title, a terminal-style blinking caret — the same
 * `$ ` prompt idea the Hero's terminal snippet already uses, so the motion
 * reads as "this note is active" rather than a generic card-lift. Both the
 * scale and the blink are wrapped in `motion-safe:`, so
 * prefers-reduced-motion users get a static caret and no transform at all
 * (docs/07-DESIGN_SYSTEM.md's "reduced motion" accessibility principle).
 *
 * A Server Component: the hover/focus behavior is pure CSS, so no client
 * boundary is needed.
 */
import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CURRENT_FOCUS_COPY } from "@/lib/constants/homepage-copy";

type FocusArea = (typeof CURRENT_FOCUS_COPY.focusAreas)[number];

/**
 * One notebook-page card. Pulled out of the `.map()` (Task 3.2 §4 — "future
 * navigation") specifically so that turning these into links to Knowledge
 * articles later is a change made in exactly one place, not a redesign:
 * wrap the returned `<Card>` in `<Link href={...} className="block h-full">`
 * here, drop the outer `h-full` down onto the `Link`, and everything else
 * — the hover/focus classes (already keyed off `Card`'s own `group` and
 * `focus-within`, both of which a wrapping `<Link>` doesn't disturb), the
 * padding, the label — keeps working unchanged. No `href` field exists on
 * `FocusArea` yet because no Knowledge article slugs exist yet to point at
 * — adding one is a data change when they do, not a markup change.
 */
function FocusAreaCard({ area }: { area: FocusArea }) {
  return (
    <Card className="group h-full gap-6 py-6 transition-[transform,box-shadow] duration-150 ease-out hover:ring-foreground/20 focus-within:ring-foreground/20 motion-safe:hover:scale-[1.015] motion-safe:focus-within:scale-[1.015]">
      <CardHeader className="px-6">
        {/* Subtle eyebrow — reinforces "active exploration," not "finished
            skill." Sits close to the title (CardHeader's own small grid
            gap) so it reads as attached to it, not a separate line. */}
        <p className="text-caption text-muted-foreground">
          {CURRENT_FOCUS_COPY.focusAreaLabel}
        </p>
        <h3 className="text-h4 text-foreground">
          {area.title}
          {/* Terminal-style caret, not a generic hover effect — static
              until hovered/focused, and only blinks under motion-safe. */}
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-[0.9em] w-0.5 translate-y-[0.1em] bg-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:group-hover:animate-pulse motion-safe:group-focus-within:animate-pulse"
          />
        </h3>
      </CardHeader>
      <CardContent className="px-6">
        <p className="max-w-prose text-small leading-relaxed text-muted-foreground">
          {area.description}
        </p>
      </CardContent>
    </Card>
  );
}

export function CurrentFocus() {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer
    // for every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 className="text-h2 text-foreground">
            {CURRENT_FOCUS_COPY.title}
          </h2>
          {CURRENT_FOCUS_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {/* A semantic list — these four areas are a related set, not
            independent content blocks — capped at two columns (see file
            docstring) so each card has room to read as a notebook page,
            not a label. */}
        <ul className="grid gap-6 sm:grid-cols-2">
          {CURRENT_FOCUS_COPY.focusAreas.map((area) => (
            <li key={area.title}>
              <FocusAreaCard area={area} />
            </li>
          ))}
        </ul>
      </Stack>
    </Section>
  );
}
