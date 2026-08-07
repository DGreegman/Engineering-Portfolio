/**
 * LearningSeries
 *
 * Displays learning series so they communicate progressive learning rather
 * than isolated articles (Task 4.1 §6). See docs/15-KNOWLEDGE_EXPERIENCE.md
 * ("Series" — "series navigation should clearly communicate progress").
 * Reused as-is by topic pages (Task 4.2 §4), filtered to the series
 * relevant to that one domain.
 *
 * Generalized in Task 4.2: `title`/`introduction`/`emptyState` are now
 * props instead of this component importing `LEARNING_SERIES_COPY`
 * directly — that's what lets `/knowledge` (library-wide copy) and
 * `/knowledge/[slug]` (topic-scoped copy, built from
 * `TOPIC_LEARNING_SERIES_COPY`) share this exact component instead of
 * duplicating it. `app/knowledge/page.tsx` now passes
 * `LEARNING_SERIES_COPY`'s fields explicitly.
 *
 * Renders as a single-column, `divide-y` list — closer to the homepage's
 * `EngineeringCaseStudies` "case file" treatment than a card grid, since a
 * series is a sequence to commit to, not a tile to skim. Each row shows the
 * series' topic(s), title, description, and part count, so "this is more
 * than one article" is legible before clicking in.
 *
 * Task 4.2 design refinement #5: each row also renders a small row of
 * step dots — one per part — next to the "N-part series" label. Not a
 * progress indicator (nothing has been read yet, so filling any of them in
 * would be dishonest); it's a structural cue that this entry is a path
 * with a fixed number of stops, not a single unit like an article.
 * `aria-hidden` on the dots themselves — the real information is the text
 * next to them, so screen readers get "4-part series" once, not a dot
 * repeated four times with no label.
 *

 * `LearningSeriesEntry.topics` (plural) — a series can belong to more than
 * one domain (see `placeholder-series.ts`'s docstring); the eyebrow line
 * joins them with " · " when there's more than one, rather than only ever
 * showing the first and silently dropping the rest.
 *
 * Reuses the same stretched-link row pattern as `EngineeringCaseStudies`'
 * `CaseFile`: the title is the one real `<Link>`, `after:absolute
 * after:inset-0` extends the hit area to the full row, and hover/focus is a
 * quiet row tint rather than a card lift.
 *
 * Fully data-agnostic: `series` is a required prop, same pattern as every
 * other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import type { LearningSeriesEntry } from "@/lib/constants/placeholder-series";

/** Capped defensively — real data tops out at 5, but a very long future
 * series shouldn't render a silly-long row of dots. */
const MAX_STEP_DOTS = 8;

function StepDots({ partCount }: { partCount: number }) {
  const dotCount = Math.min(partCount, MAX_STEP_DOTS);
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {Array.from({ length: dotCount }, (_, index) => (
        <span
          key={index}
          className="size-1.5 rounded-full bg-muted-foreground/40"
        />
      ))}
    </span>
  );
}

function SeriesRow({ series }: { series: LearningSeriesEntry }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-8 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      {series.topics && series.topics.length > 0 && (
        <p className="font-mono text-caption text-muted-foreground">
          {series.topics.join(" · ")}
        </p>
      )}
      <h3 className="mt-1 text-h4 text-foreground">
        <Link
          href={series.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {series.title}
        </Link>
      </h3>
      <Stack gap="xs" className="mt-2">
        <p className="text-small text-muted-foreground">{series.description}</p>
        <p className="flex items-center gap-2 text-caption text-muted-foreground/70">
          <StepDots partCount={series.partCount} />
          {series.partCount}-part series
        </p>
      </Stack>
    </li>
  );
}

export function LearningSeries({
  title,
  introduction,
  emptyState,
  series,
}: {
  title: string;
  introduction: readonly string[];
  emptyState: readonly string[];
  series: LearningSeriesEntry[];
}) {
  return (
    // width="full" — see KnowledgeHero's comment.
    <Section
      id="learning-series"
      aria-labelledby="learning-series-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="learning-series-heading" className="text-h2 text-foreground">
            {title}
          </h2>
          {introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {series.length === 0 ? (
          <Stack gap="xs">
            {emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ol className="max-w-reading divide-y divide-border">
            {series.map((entry) => (
              <SeriesRow key={entry.title} series={entry} />
            ))}
          </ol>
        )}
      </Stack>
    </Section>
  );
}
