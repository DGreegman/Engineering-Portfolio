/**
 * EngineeringCaseStudies
 *
 * "Case files, not project tiles" (Task 3.5). Introduces the Work
 * collection from the homepage as documented engineering decisions, not a
 * portfolio projects gallery. See docs/13-HOMEPAGE_EXPERIENCE.md
 * ("Featured Work" — "show engineering stories rather than project
 * galleries") and docs/14-HOMEPAGE_COPY.md ("Engineering Case Studies").
 * Copy is reproduced verbatim from lib/constants/homepage-copy.ts's
 * `CASE_STUDIES_COPY`.
 *
 * Deliberately not `Card`-based, unlike `EngineeringNotebook` — Task 3.5
 * §4 explicitly says "rather than a project card." Instead, entries render
 * as a single-column, `divide-y`-separated list (closer to How I Think's
 * document identity than Engineering Notebook's card grid), reinforcing
 * "case file" over "project tile." No thumbnails, no logos, no tech-stack
 * listing, no "View Demo" — title (the thesis), one-sentence summary (the
 * challenge), then a quiet citation line (domain, status, and — only when
 * the work is finished — a date).
 *
 * Fully data-agnostic, same as `EngineeringNotebook`: `caseStudies` is a
 * required prop; this component has no idea it's `PLACEHOLDER_WORK`
 * (lib/constants/placeholder-work.ts) today versus real Work entries
 * later. The only data-driven branch is presentational — an empty array
 * renders `CASE_STUDIES_COPY.emptyState`, genuine doc-14 copy for that
 * real future case.
 *
 * Whole-row clickability via the same stretched-link pattern
 * `EngineeringNotebook` settled on: the title is the one real `<Link>`,
 * `after:absolute after:inset-0` extends its hit area to the full row.
 * Unlike Engineering Notebook's card hover (scale + ring — a "card"
 * affordance this section is explicitly avoiding), hover/focus here is a
 * quiet full-row background tint, closer to highlighting a row in a
 * document than lifting a tile. Keyboard focus still gets the site's
 * standard strong `ring-2 ring-ring` indicator, kept distinct from the
 * subtler hover tint.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { CASE_STUDIES_COPY } from "@/lib/constants/homepage-copy";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";

/**
 * One case file. Citation line omits the date entirely when absent
 * (in-progress work) rather than showing a placeholder — three segments
 * when finished, two while still in progress, matching Task 3.5's own
 * example exactly.
 *
 * `caseNumber` is the entry's position in the list (1-based), not stored
 * data — a real Work collection's ordering already gives every entry a
 * position, so there's nothing to keep in sync. Rendered as "CASE 001"
 * above the title in the same small font-mono/text-caption/muted idiom
 * already used for the Hero's "README.md" tab and How I Think's chapter
 * numbers — quiet enough that it never competes with the title (review
 * feedback §2).
 */
function CaseFile({
  entry,
  caseNumber,
}: {
  entry: CaseStudyEntry;
  caseNumber: number;
}) {
  const citation = entry.publishedAt
    ? `${entry.domain} • ${entry.status} • ${entry.publishedAt}`
    : `${entry.domain} • ${entry.status}`;

  return (
    // py-8 is never trimmed on first/last (unlike How I Think's rail list)
    // — this padding also sizes the hover/focus highlight box via
    // rounded-md + bg-muted/40, so a first:pt-0/last:pb-0 would leave the
    // first and last entries' highlight looking cramped against their own
    // top/bottom edge while every entry in between stays symmetric. The
    // parent <ol> cancels the resulting extra outer space with -my-8
    // instead, so every entry's padding — and hover box — stays uniform.
    <li className="relative -mx-4 rounded-md px-4 py-8 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground">
        CASE {String(caseNumber).padStart(3, "0")}
      </p>
      <h4 className="mt-1 text-h4 text-foreground">
        <Link
          href={entry.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {entry.title}
        </Link>
      </h4>
      <Stack gap="xs" className="mt-2">
        <p className="text-small text-muted-foreground">{entry.summary}</p>
        <p className="text-caption text-muted-foreground/70">{citation}</p>
      </Stack>
    </li>
  );
}

export function EngineeringCaseStudies({
  caseStudies,
}: {
  caseStudies: CaseStudyEntry[];
}) {
  return (
    <Section spacing="md" width="wide">
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 className="text-h2 text-foreground">{CASE_STUDIES_COPY.title}</h2>
          {CASE_STUDIES_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <Stack gap="sm">
          <h3 className="text-h4 text-foreground">
            {CASE_STUDIES_COPY.sectionLabel}
          </h3>

          {caseStudies.length === 0 ? (
            <Stack gap="xs">
              {CASE_STUDIES_COPY.emptyState.map((paragraph) => (
                <p key={paragraph} className="text-body text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </Stack>
          ) : (
            // No negative margin here (a -my-8 was tried and reverted): the
            // hover/focus highlight is the same padding box as the row's
            // spacing, so pulling the <ol> up/down to cancel that padding
            // also drags the highlight box itself into the heading above
            // and the button below — the padding isn't just empty space,
            // it's the boundary of something visible. The natural, slightly
            // larger gap this leaves is intentional whitespace, not a bug.
            <ol className="max-w-reading divide-y divide-border">
              {caseStudies.map((entry, index) => (
                <CaseFile
                  key={entry.title}
                  entry={entry}
                  caseNumber={index + 1}
                />
              ))}
            </ol>
          )}
        </Stack>

        <div>
          <Button
            nativeButton={false}
            render={<Link href={CASE_STUDIES_COPY.primaryCta.href} />}
          >
            {CASE_STUDIES_COPY.primaryCta.label}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
