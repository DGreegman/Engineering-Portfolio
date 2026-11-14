/**
 * FeaturedCaseStudies
 *
 * "Which engineering work best represents this workspace?" (docs/29-WORK_
 * LANDING_PROPOSAL.md §1/§3). The page's first evidence for the claim
 * `EngineeringPhilosophy` just made — positioned immediately after it for
 * exactly that reason (docs/29 §1: "placing them any later delays the
 * moment a skeptical reader can verify the claim").
 *
 * Fully data-agnostic, same pattern as every other section on this page:
 * `caseStudies` is a required prop. `app/work/page.tsx` passes the result of
 * `lib/content/work.ts`'s `getFeaturedCaseStudies()` — this component has no
 * idea "featured" is a boolean flag on the one shared project record rather
 * than a separate collection (docs/29 §3, "Featured Is Not a Separate
 * Collection" — see `placeholder-work.ts`'s `featured` docstring for the
 * full reasoning), and no idea the resolver is reading a placeholder array
 * rather than a real Content Engine query. Both are resolution-layer
 * concerns this component is intentionally insulated from.
 *
 * Reuses the homepage `EngineeringCaseStudies`' "case file, not project
 * tile" visual language verbatim (no thumbnails, no tech-stack list, one
 * `<Link>` per row via the stretched-link pattern) rather than inventing a
 * second card treatment for the same kind of content — composition over
 * duplication (docs/24-ENGINEERING_PRINCIPLES.md Principle 6). Kept as its
 * own component/file rather than imported from `components/home/`: every
 * other route in this workspace (Knowledge included) owns its section
 * components in its own folder rather than reaching into another route's,
 * even where the visual pattern is shared — same separation of
 * responsibilities `components/knowledge/*` already established relative to
 * `components/home/*`.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ProjectDiagram } from "@/components/work/project-diagram";
import { FEATURED_CASE_STUDIES_COPY } from "@/lib/constants/work-copy";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";

/**
 * One case file. `caseNumber` is the entry's position within the featured
 * set (1-based), not stored data — same reasoning as the homepage's
 * `CaseFile`: nothing to keep in sync once real entries replace the
 * placeholders.
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

export function FeaturedCaseStudies({
  caseStudies,
}: {
  caseStudies: CaseStudyEntry[];
}) {
  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="featured-case-studies"
      aria-labelledby="featured-case-studies-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="featured-case-studies-heading"
            className="text-h2 text-foreground"
          >
            {FEATURED_CASE_STUDIES_COPY.title}
          </h2>
          {FEATURED_CASE_STUDIES_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {caseStudies.length === 0 ? (
          <Stack gap="xs">
            {FEATURED_CASE_STUDIES_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <Stack gap="sm">
            <h3 className="text-h4 text-foreground">
              {FEATURED_CASE_STUDIES_COPY.sectionLabel}
            </h3>
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
          </Stack>
        )}
      </Stack>
    </Section>
  );
}
