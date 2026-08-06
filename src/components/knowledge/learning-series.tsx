/**
 * LearningSeries
 *
 * Displays learning series so they communicate progressive learning rather
 * than isolated articles (Task 4.1 §6). See docs/15-KNOWLEDGE_EXPERIENCE.md
 * ("Series" — "series navigation should clearly communicate progress").
 *
 * Renders as a single-column, `divide-y` list — closer to the homepage's
 * `EngineeringCaseStudies` "case file" treatment than a card grid, since a
 * series is a sequence to commit to, not a tile to skim. Each row shows the
 * series' topic, title, description, and part count, so "this is more than
 * one article" is legible before clicking in.
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
import { LEARNING_SERIES_COPY } from "@/lib/constants/knowledge-copy";
import type { LearningSeriesEntry } from "@/lib/constants/placeholder-series";

function SeriesRow({ series }: { series: LearningSeriesEntry }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-8 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      {series.topic && (
        <p className="font-mono text-caption text-muted-foreground">
          {series.topic}
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
        <p className="text-caption text-muted-foreground/70">
          {series.partCount} parts
        </p>
      </Stack>
    </li>
  );
}

export function LearningSeries({ series }: { series: LearningSeriesEntry[] }) {
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
            {LEARNING_SERIES_COPY.title}
          </h2>
          {LEARNING_SERIES_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {series.length === 0 ? (
          <Stack gap="xs">
            {LEARNING_SERIES_COPY.emptyState.map((paragraph) => (
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
