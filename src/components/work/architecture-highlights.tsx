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
 * **Reframed by the Real Content Migration (Task 7.1, docs/52 WI-5)** from
 * a hand-authored engineering-theme taxonomy (`EngineeringThemeEntry[]`,
 * `placeholder-work-landing.ts`) to a real `domain` grouping
 * (`CaseStudyDomainGroup[]`, `lib/content/case-studies.ts`). Grounded in
 * direct evidence, not preference: no `themes`/`engineeringThemes` field
 * has ever existed in the real Work schema — this component's own prior
 * docstring already predicted that exact gap ("once real case studies
 * carry their own `themes`/`engineeringThemes` frontmatter field..."), and
 * that field was never added. `domain` is real, required on every case
 * study, and already used for exactly this kind of engineering-concern
 * navigation elsewhere in this codebase (`findDomainNeighbor()`,
 * `case-study-relationships.ts`). Each domain's real member case studies
 * render as direct links into the one shared, real collection — the
 * identical "clicking through a group is the navigation this section
 * offers" mechanic as before, now backed by real data instead of a
 * fixture; a single case study may still appear under its domain group here
 * and in the Project Library below at the same time, since both are views
 * over the same underlying real records, never a second dataset.
 *
 * No per-domain description renders (unlike the old per-theme
 * `description`): no real per-domain description exists anywhere in the
 * schema, and inventing one would be exactly the kind of fabrication this
 * migration's own guardrails rule out.
 *
 * Fully data-agnostic: `domainGroups` is a required prop, same pattern as
 * every other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ARCHITECTURE_HIGHLIGHTS_COPY } from "@/lib/constants/work-copy";
import type { CaseStudyDomainGroup } from "@/lib/content/case-studies";

function DomainTile({ group }: { group: CaseStudyDomainGroup }) {
  return (
    <div className="h-full rounded-lg border border-border p-5">
      <Stack gap="xs">
        <h3 className="text-h4 text-foreground">{group.domain}</h3>
        {group.caseStudies.length > 0 && (
          <p className="pt-1 text-caption text-muted-foreground/70">
            {group.caseStudies.map((entry, index) => (
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
  domainGroups,
}: {
  domainGroups: CaseStudyDomainGroup[];
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

        {domainGroups.length === 0 ? (
          <Stack gap="xs">
            {ARCHITECTURE_HIGHLIGHTS_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {domainGroups.map((group) => (
              <li key={group.domain}>
                <DomainTile group={group} />
              </li>
            ))}
          </ul>
        )}
      </Stack>
    </Section>
  );
}
