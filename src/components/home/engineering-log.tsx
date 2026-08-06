/**
 * EngineeringLog
 *
 * "A working journal, not polished documentation" (Task 3.6). The
 * lightest, least-decorated section on the homepage — chronology over
 * everything. See docs/13-HOMEPAGE_EXPERIENCE.md ("Engineering Log" —
 * "capture exploration, experiments, and discoveries... reinforces
 * authenticity") and docs/14-HOMEPAGE_COPY.md ("Engineering Log"). Copy is
 * reproduced verbatim from lib/constants/homepage-copy.ts's
 * `ENGINEERING_LOG_COPY`.
 *
 * Explicitly not a `Card`, and not styled like Engineering Case Studies'
 * divided list either — Task 3.6 was direct: "do not use cards again," and
 * the homepage already has four card/box-ish treatments (Hero,
 * Current Focus, Notebook, Case Studies). Entries here read like a commit
 * log: a small `LOG 00N · date` metadata line (joining the same
 * font-mono/text-caption idiom as the Hero's "README.md" tab, How I
 * Think's chapter numbers, and Case Studies' "CASE 00N" — but at a further
 * reduced `/60` opacity, quieter than any of those, per polish-pass
 * feedback "the date should feel like Git history. Quiet.") followed by
 * one plain-weight line of text — no bold heading weight, no summary, no
 * citation metadata. The identifier and date share one line rather than
 * two separate ones specifically to keep this the lightest section on the
 * page — a third line per entry would add back the weight this section is
 * built to not have. Rhythm is deliberately tighter than Case Studies
 * (`py-4` vs. `py-8`) and the divider deliberately quieter
 * (`divide-border/50` vs. full opacity) — a visibly lighter section for a
 * section about work still in progress.
 *
 * Fully data-agnostic, same pattern as `EngineeringNotebook`/
 * `EngineeringCaseStudies`: `entries` is a required prop; this component
 * doesn't know it's `PLACEHOLDER_LOG` (lib/constants/placeholder-log.ts)
 * today versus real Engineering Log entries later. The only data-driven
 * branch is presentational — an empty array renders
 * `ENGINEERING_LOG_COPY.emptyState`, genuine doc-14 copy for that real
 * future case.
 *
 * Whole-entry clickability via the same stretched-link pattern as the
 * other two collection sections: the title is the one real `<Link>`,
 * `after:absolute after:inset-0` extends its hit area to the full row.
 * Same quiet `hover:bg-muted/40` row tint and strong `focus-within:ring-2
 * ring-ring` keyboard indicator as Case Studies — reusing the established
 * non-card interactive-row pattern rather than inventing a fourth one.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { ENGINEERING_LOG_COPY } from "@/lib/constants/homepage-copy";
import type { EngineeringLogEntry } from "@/lib/constants/placeholder-log";

/**
 * One log line: a quiet `LOG 00N · date` metadata line, then the entry
 * itself. No summary, no card, no citation — the leanest entry on the
 * page, on purpose. `logNumber` is the entry's position in the list
 * (1-based), not stored data, same reasoning as Case Studies' `caseNumber`
 * — nothing to keep in sync when real entries replace the placeholders.
 */
function LogEntryRow({
  entry,
  logNumber,
}: {
  entry: EngineeringLogEntry;
  logNumber: number;
}) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-4 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        LOG {String(logNumber).padStart(3, "0")} · {entry.date}
      </p>
      <h4 className="mt-1 text-body font-normal text-foreground">
        <Link
          href={entry.href}
          className="after:absolute after:inset-0 focus:outline-none"
        >
          {entry.title}
        </Link>
      </h4>
    </li>
  );
}

export function EngineeringLog({
  entries,
}: {
  entries: EngineeringLogEntry[];
}) {
  return (
    <Section spacing="md" width="wide">
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 className="text-h2 text-foreground">
            {ENGINEERING_LOG_COPY.title}
          </h2>
          {ENGINEERING_LOG_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <Stack gap="sm">
          <h3 className="text-h4 text-foreground">
            {ENGINEERING_LOG_COPY.sectionLabel}
          </h3>

          {entries.length === 0 ? (
            <Stack gap="xs">
              {ENGINEERING_LOG_COPY.emptyState.map((paragraph) => (
                <p key={paragraph} className="text-body text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </Stack>
          ) : (
            // No negative margin here — same reasoning as
            // EngineeringCaseStudies: the hover/focus highlight is the same
            // padding box as the row's spacing, so canceling that padding
            // from the outside would drag the highlight into the heading
            // above and the button below.
            <ol className="max-w-reading divide-y divide-border/50">
              {entries.map((entry, index) => (
                <LogEntryRow
                  key={entry.href}
                  entry={entry}
                  logNumber={index + 1}
                />
              ))}
            </ol>
          )}
        </Stack>

        <div>
          <Button
            nativeButton={false}
            render={<Link href={ENGINEERING_LOG_COPY.primaryCta.href} />}
          >
            {ENGINEERING_LOG_COPY.primaryCta.label}
          </Button>
        </div>
      </Stack>
    </Section>
  );
}
