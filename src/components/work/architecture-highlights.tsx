/**
 * ArchitectureHighlights
 *
 * "Which engineering themes appear across multiple projects?" (docs/29-
 * WORK_LANDING_PROPOSAL.md §1/§4). Per the approved architecture review
 * (docs/29 §4), this section is not simply grouped content — it is the Work
 * experience's **second navigation model**, standing alongside the Project
 * Library below as an equally legitimate way to explore the same work:
 * Project Library navigates by project, this section navigates by
 * engineering concern. `ARCHITECTURE_HIGHLIGHTS_COPY.introduction` states
 * that distinction on the page itself rather than leaving it implicit.
 *
 * Each theme is deliberately *not* a single whole-tile `<Link>` the way
 * `TopicTile` is — no dedicated theme route exists yet (that would be
 * inventing a URL docs/28-WORK_IMPLEMENTATION_PLAN.md doesn't document),
 * and a fabricated one would contradict this codebase's existing "don't
 * link to routes that don't exist" discipline (see `work-copy.ts`'s
 * `CONTINUE_EXPLORING_COPY` docstring for the two routes that *are* allowed
 * to point ahead of themselves, and why). Instead, each theme's real
 * `relatedCaseStudies` render as direct links into the one shared project
 * collection (`placeholder-work.ts`) — clicking through a theme *is* the
 * navigation this section exists to offer, per docs/29 §4's "Two
 * Navigation Models, One Body of Work": a single case study may appear
 * under this theme and the Project Library below at the same time, because
 * both are views over the same underlying records, never a second dataset.
 *
 * `EngineeringThemeEntry` is its own local type
 * (`placeholder-work-landing.ts`), deliberately not `Topic`/`TopicSlug` from
 * `lib/content/topics.ts` — docs/29 §4 documents a shared taxonomy with the
 * Knowledge Library as future scope only, not this task's.
 *
 * Future architectural note (Task 5.1 review refinement #2, documentation
 * only — no implementation change now): `placeholder-work-landing.ts`'s
 * `theme → relatedCaseStudies` mapping is hand-authored today, which is
 * appropriate for placeholder content but is a second, manually curated
 * dataset sitting next to `placeholder-work.ts`'s project records — not yet
 * the single-source-of-truth shape the rest of this page holds itself to.
 * The intended long-term relationship is a *derived* one, flowing the other
 * direction:
 *
 *   Project → Engineering Themes (frontmatter) → Architecture Highlights
 *
 * i.e. once real case studies carry their own `themes`/`engineeringThemes`
 * frontmatter field, this section's data becomes an aggregation query over
 * the Project Library itself (which projects declare which themes) rather
 * than a second file a maintainer has to keep in sync by hand. `themes`
 * stays this component's prop either way — only what computes its value
 * upstream of `app/work/page.tsx` changes.
 *
 * Fully data-agnostic: `themes` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ARCHITECTURE_HIGHLIGHTS_COPY } from "@/lib/constants/work-copy";
import type { EngineeringThemeEntry } from "@/lib/constants/placeholder-work-landing";

function ThemeTile({ theme }: { theme: EngineeringThemeEntry }) {
  return (
    <div className="h-full rounded-lg border border-border p-5">
      <Stack gap="xs">
        <h3 className="text-h4 text-foreground">{theme.title}</h3>
        <p className="text-small text-muted-foreground">{theme.description}</p>
        {theme.relatedCaseStudies.length > 0 && (
          <p className="pt-1 text-caption text-muted-foreground/70">
            Related:{" "}
            {theme.relatedCaseStudies.map((entry, index) => (
              <span key={entry.href}>
                {index > 0 && " · "}
                <Link
                  href={entry.href}
                  className="text-foreground underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  {entry.title}
                </Link>
              </span>
            ))}
          </p>
        )}
      </Stack>
    </div>
  );
}

export function ArchitectureHighlights({
  themes,
}: {
  themes: EngineeringThemeEntry[];
}) {
  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="architecture-highlights"
      aria-labelledby="architecture-highlights-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="architecture-highlights-heading"
            className="text-h2 text-foreground"
          >
            {ARCHITECTURE_HIGHLIGHTS_COPY.title}
          </h2>
          {ARCHITECTURE_HIGHLIGHTS_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {themes.length === 0 ? (
          <Stack gap="xs">
            {ARCHITECTURE_HIGHLIGHTS_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <li key={theme.title}>
                <ThemeTile theme={theme} />
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
