/**
 * Engineering Log Index — `/engineering-log` (Task 6.2)
 *
 * Implements `docs/37-ENGINEERING_LOG_EXPERIENCE.md`'s approved four-part
 * structure: Log Index Header → Chronological Listing → Continue
 * Exploring. Composed directly from `Section`/`Stack`, not
 * `DocumentLayout` — this is a listing page, not a single document, the
 * same distinction `app/work/library/page.tsx` already draws relative to
 * `app/work/[slug]/page.tsx` (docs/37 §15's own "None of DocumentLayout's
 * slots apply to a listing page" ruling).
 *
 * Chronology, not facets, governs discovery here — no domain/theme
 * grouping, no Browse Lenses. `docs/03-SITEMAP.md` already establishes
 * this collection's own organizing principle before this task existed
 * ("unlike Knowledge, entries aren't organized by fixed category —
 * chronology is the primary structure"); this page inherits that decision
 * rather than reopening it (docs/37 Decision D3).
 *
 * Empty state (docs/37 §22) is deliberately **not** the homepage preview's
 * `null`-when-empty behavior (Task 6.1's own `EngineeringLog` fix) — this
 * page *is* the collection's dedicated destination, so a reader who
 * navigated here on purpose sees an honest "nothing logged yet" message,
 * not a page that renders as if it doesn't exist. Two different empty
 * states, both correct, for two different contexts — restated here so it
 * isn't implemented as a copy-paste of the other.
 */
import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ContinueExploring } from "@/components/work/continue-exploring";
import { LogEntryRow } from "@/components/engineering-log/log-entry-row";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";
import { sortByPublishedDate } from "@/lib/content/loader";
import { formatDate } from "@/lib/utils/format-date";

export const metadata: Metadata = {
  title: "Engineering Log — Engineering Portfolio",
  description:
    "A chronological record of engineering discovery — debugging sessions, experiments, failed approaches, and the process behind the finished work.",
};

export default function EngineeringLogIndexPage() {
  const entries = sortByPublishedDate(getAllEngineeringLogEntries());

  return (
    <>
      <Section spacing="md" width="full">
        <Stack gap="lg" className="max-w-reading">
          <p className="font-mono text-caption text-muted-foreground">
            Engineering Log
          </p>

          <h1 className="text-h1 text-foreground">
            The raw record, in the order it happened.
          </h1>

          <Stack gap="sm">
            <p className="text-body text-muted-foreground">
              Debugging sessions, experiments, failed approaches, and small
              breakthroughs — preserved with the uncertainty they actually had
              at the time, not rewritten into a polished conclusion.
            </p>
            <p className="text-small text-muted-foreground">
              {entries.length} {entries.length === 1 ? "entry" : "entries"}{" "}
              logged so far.
            </p>
          </Stack>
        </Stack>
      </Section>

      <Section
        id="engineering-log-listing"
        aria-labelledby="engineering-log-listing-heading"
        spacing="md"
        width="full"
      >
        <Stack gap="lg">
          <Stack gap="xs" className="max-w-reading">
            <h2
              id="engineering-log-listing-heading"
              className="text-h2 text-foreground"
            >
              Entries
            </h2>
          </Stack>

          {entries.length === 0 ? (
            <Stack gap="xs">
              <p className="text-body text-muted-foreground">
                Nothing logged yet.
              </p>
              <p className="text-body text-muted-foreground">
                This page will hold the raw process behind the work in Knowledge
                and Work as it happens — check back soon.
              </p>
            </Stack>
          ) : (
            <ol className="max-w-reading divide-y divide-border/50">
              {entries.map((entry) => (
                <LogEntryRow
                  key={entry.slug}
                  entry={{
                    slug: entry.slug,
                    title: entry.frontmatter.title,
                    description: entry.frontmatter.description,
                    href: `/engineering-log/${entry.slug}`,
                    publishedAt: formatDate(entry.frontmatter.publishedAt),
                  }}
                />
              ))}
            </ol>
          )}
        </Stack>
      </Section>

      <ContinueExploring
        title="Continue Exploring"
        introduction={[
          "This is the raw process. Where you go next depends on what you're curious about.",
        ]}
        links={[
          {
            label: "Continue into Work →",
            description:
              "Some of this process fed into a finished Case Study — see how it landed.",
            href: "/work",
          },
          {
            label: "Continue into the Knowledge Library →",
            description:
              "Some of this process touches a concept already explained in full.",
            href: "/knowledge",
          },
        ]}
      />
    </>
  );
}
