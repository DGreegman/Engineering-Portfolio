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
 * The first case is a featured warm-surface panel; supporting cases use
 * quieter editorial rows. This establishes work as the page's main evidence
 * without turning every entry into an identical tile. No thumbnails,
 * logos, tech-stack listing, or "View Demo" — title, summary, context, and
 * truthful citation metadata carry the story.
 *
 * Fully data-agnostic, same as `EngineeringNotebook`: `caseStudies` is a
 * required prop; this component has no idea it's `PLACEHOLDER_WORK`
 * (lib/constants/placeholder-work.ts) today versus real Work entries
 * later. The only data-driven branch is presentational — an empty array
 * renders `CASE_STUDIES_COPY.emptyState`, genuine doc-14 copy for that
 * real future case.
 *
 * Each entry uses one stretched link, so the title remains the only
 * keyboard stop while the full panel or row stays clickable.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { ProjectDiagram } from "@/components/work/project-diagram";
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
  featured = false,
}: {
  entry: CaseStudyEntry;
  caseNumber: number;
  featured?: boolean;
}) {
  const citation = entry.publishedAt
    ? `${entry.domain} • ${entry.status} • ${entry.publishedAt}`
    : `${entry.domain} • ${entry.status}`;
  const compactVaultPay = featured && entry.href === "/work/vaultpay";

  return (
    <li
      className={
        featured
          ? `relative mb-6 rounded-xl border border-border bg-card p-6 shadow-sm shadow-foreground/5 transition-colors hover:border-brand-accent/40 focus-within:ring-2 focus-within:ring-ring sm:p-9 lg:col-span-2 ${compactVaultPay ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)] lg:items-center lg:gap-8" : ""}`
          : "relative border-t border-border px-6 py-6 transition-colors hover:bg-secondary/60 focus-within:bg-secondary/60 focus-within:ring-2 focus-within:ring-ring sm:px-9"
      }
    >
      <div className="min-w-0">
        <p className="font-mono text-caption font-medium uppercase tracking-[0.1em] text-brand-accent">
          CASE {String(caseNumber).padStart(3, "0")}
        </p>
        <h3
          className={
            featured
              ? "mt-2 max-w-[30ch] text-h2 text-foreground"
              : "mt-2 text-h4 text-foreground"
          }
        >
          <Link
            href={entry.href}
            className="after:absolute after:inset-0 focus:outline-none"
          >
            {entry.title}
          </Link>
        </h3>
        <Stack gap="xs" className="mt-2">
          <p
            className={
              featured
                ? "max-w-[72ch] text-body text-muted-foreground"
                : "max-w-[72ch] text-small text-muted-foreground"
            }
          >
            {entry.summary}
          </p>
          <p className="pt-1 text-caption text-muted-foreground">{citation}</p>
          <p className="text-small text-foreground/85">
            {entry.projectContext}
          </p>
        </Stack>
      </div>
      <ProjectDiagram
        href={entry.href}
        className={compactVaultPay ? "lg:mt-0" : undefined}
      />
    </li>
  );
}

export function EngineeringCaseStudies({
  caseStudies,
}: {
  caseStudies: CaseStudyEntry[];
}) {
  return (
    // width="full" — WorkspaceLayout supplies the shared PageContainer
    // for every page now; see readme-hero.tsx's comment for why.
    <Section spacing="md" width="full">
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
            <ol className="grid gap-x-10 lg:grid-cols-2">
              {caseStudies.map((entry, index) => (
                <CaseFile
                  key={entry.title}
                  entry={entry}
                  caseNumber={index + 1}
                  featured={index === 0}
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
