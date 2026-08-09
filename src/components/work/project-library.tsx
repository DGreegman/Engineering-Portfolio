/**
 * ProjectLibrary
 *
 * "What engineering work is available?" (docs/29-WORK_LANDING_PROPOSAL.md
 * §1/§5). On the landing page, this section's job is only to represent the
 * *existence and shape* of the full archive and hand the reader off to it —
 * docs/29 §5 is explicit that this page previews the library, it does not
 * paginate, filter, or fully render it (that full experience is Task 5.2's
 * Case Study Library, per docs/28-WORK_IMPLEMENTATION_PLAN.md). Communicates
 * exactly the three things docs/29 §5 calls for and nothing more: scale (a
 * real count, never a guess), shape (the domains this work spans), and an
 * entry point. That entry point is now the real `/work/library` route
 * (Task 5.2, via `lib/content/work.ts`'s `getProjectLibraryHref()`) rather
 * than this section's own `#project-library` id — which this section still
 * keeps as its landmark id (harmless, still useful for the section's own
 * `aria-labelledby` pairing) even though `ContinueExploring` no longer
 * points at it directly.
 *
 * Deliberately the single source of truth referenced by `FeaturedCaseStudies`
 * above — this component receives the *entire* collection via
 * `lib/content/work.ts`'s `getProjectLibrary()`, unfiltered, while
 * `FeaturedCaseStudies` receives the same collection's `getFeaturedCaseStudies()`
 * slice. One resolved collection, two views, never two datasets
 * (docs/29 §3/§5) — and this component, like that one, has no idea either
 * function is reading a placeholder array today rather than a real Content
 * Engine query. Rendered visibly lighter-weight than `FeaturedCaseStudies`
 * on purpose — no summary, no case-file framing, just title/domain/status —
 * matching docs/29 §8's Visual Hierarchy ("Project Library entry point
 * ...an archive pointer, not a centerpiece").
 *
 * Shape tags are derived directly from `caseStudies[].domain` at render
 * time, not a separately maintained list — nothing here can drift out of
 * sync with the one collection it's reading from.
 *
 * Fully data-agnostic: `caseStudies` is a required prop, same pattern as
 * every other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { PROJECT_LIBRARY_COPY } from "@/lib/constants/work-copy";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";

function LibraryRow({ entry }: { entry: CaseStudyEntry }) {
  return (
    <li className="relative -mx-4 rounded-md px-4 py-4 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      <p className="font-mono text-caption text-muted-foreground/60">
        {entry.domain} · {entry.status}
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

export function ProjectLibrary({
  caseStudies,
}: {
  caseStudies: CaseStudyEntry[];
}) {
  const domains = Array.from(new Set(caseStudies.map((entry) => entry.domain)));

  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="project-library"
      aria-labelledby="project-library-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="project-library-heading" className="text-h2 text-foreground">
            {PROJECT_LIBRARY_COPY.title}
          </h2>
          {PROJECT_LIBRARY_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {caseStudies.length === 0 ? (
          <Stack gap="xs">
            {PROJECT_LIBRARY_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <>
            <Stack gap="xs">
              <p className="text-small text-muted-foreground">
                {PROJECT_LIBRARY_COPY.scaleLabel(caseStudies.length)}
              </p>
              <p className="text-caption text-muted-foreground/70">
                {PROJECT_LIBRARY_COPY.shapeLabel} {domains.join(" · ")}
              </p>
            </Stack>

            <ol className="max-w-reading divide-y divide-border/50">
              {caseStudies.map((entry) => (
                <LibraryRow key={entry.href} entry={entry} />
              ))}
            </ol>
          </>
        )}
      </Stack>
    </Section>
  );
}
