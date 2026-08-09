/**
 * BrowseLenses
 *
 * "How can I approach this archive?" (docs/30-CASE_STUDY_LIBRARY_PROPOSAL.md
 * §1/§2/§4). Per the approved architecture review's strengthened
 * distinction: **Browse Lenses answer "how can I approach this archive,"
 * filters answer "how can I narrow it."** This component renders the three
 * lenses as the fixed, always-present perspectives docs/30 §4 describes —
 * it does not implement a stateful filter widget, and deliberately so; see
 * "Why This Implementation Doesn't Build Interactive Filtering" below.
 *
 * Each lens answers a genuinely different question (docs/30 §4), and this
 * component gives each a different real mechanic rather than three copies
 * of the same tile:
 *
 * - **Domain** narrows for real: each value links to that domain's own
 *   heading inside `CaseStudyListing` (`domainAnchorId`, exported from that
 *   file so both components agree on the same anchor shape — single source
 *   of truth for the id itself, not just the data behind it).
 * - **Engineering Theme** reuses the exact vocabulary Architecture
 *   Highlights introduced on the Landing (`lib/content/work.ts`'s
 *   `getEngineeringThemes()` — docs/30 §5: "share a vocabulary, not a UI"),
 *   applied here at full scale: every related case study is linked, not a
 *   capped preview. The Listing isn't grouped by theme, so a theme value
 *   links directly to its case studies, the same mechanic
 *   `ArchitectureHighlights` already uses on the Landing.
 * - **Status** is informational only — a real, honest count answering "is
 *   it finished," with no anchor or link. Not every lens needs to be
 *   clickable to be a legitimate perspective (docs/30 §4: a lens "defines
 *   an available perspective," it doesn't have to be a jump target).
 *
 * ## Why This Implementation Doesn't Build Interactive Filtering
 *
 * docs/30 §4 documents a "Future Note: Addressable Filtered States"
 * (`?theme=`/`?domain=`/`?status=` query params) explicitly as future
 * architectural direction, not current scope. Building any form of
 * stateful, combinable, hide/show filtering now — whether via client state
 * or query params — would require either a client boundary this page has
 * no browser-API justification for (docs/24-ENGINEERING_PRINCIPLES.md
 * Principle 5) or exactly the URL-addressable mechanic docs/30 already
 * scoped to a future task. Grouping the Listing by domain and linking
 * Browse Lenses into it (via `#anchor`, the same zero-JS mechanic already
 * used site-wide) satisfies docs/28-WORK_IMPLEMENTATION_PLAN.md's
 * "Filtering" deliverable honestly today: every lens gives a reader a real
 * way to narrow their attention, and the unfiltered Listing beneath it
 * remains a complete, honest archive on its own (docs/30 §4: filtering
 * "optional, not load-bearing") — so there is no interactive "zero results"
 * state for `ContinueExploring` to handle in this implementation.
 *
 * ## Relationship to Future Filtering (Task 5.2 review refinement #2)
 *
 * Documented here so continuity is preserved when interactive, URL-driven
 * filtering eventually arrives (docs/30 §4's future note): **Browse Lenses
 * are expected to become the *inputs* to that future filtering, not be
 * replaced by it.** Conceptually:
 *
 * ```
 * Browse Lens
 *      │
 *      ▼
 * Filter Context
 *      │
 *      ▼
 * Case Study Listing
 * ```
 *
 * A Browse Lens today already *is* a perspective plus a value (e.g. "Domain:
 * AI Systems") — the only thing missing for that to become a real filter is
 * a Filter Context step between it and the Listing that turns "the reader
 * chose this lens value" into "the Listing renders only matching entries,"
 * addressably, via the URL. Nothing about this component's lens values, or
 * the questions they answer, needs to change for that step to be inserted
 * later — the lenses are already the right shape to feed it.
 *
 * Fully data-agnostic: `caseStudies` and `themes` are required props, same
 * pattern as every other section on this page. Domain and status counts are
 * computed here, at render time, from `caseStudies` directly — the same
 * "derive, don't separately maintain" precedent `ProjectLibrary`'s own
 * `domains` line already established on the Landing.
 *
 * A Server Component: static content, no interactivity.
 */
import type { ReactNode } from "react";
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { domainAnchorId } from "@/components/work/case-study-listing";
import { BROWSE_LENSES_COPY } from "@/lib/constants/work-library-copy";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";
import type { EngineeringThemeEntry } from "@/lib/constants/placeholder-work-landing";

function LensCluster({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Stack gap="sm">
      <Stack gap="xs">
        <h3 className="text-h4 text-foreground">{label}</h3>
        <p className="text-caption text-muted-foreground">{description}</p>
      </Stack>
      {children}
    </Stack>
  );
}

function DomainLens({ caseStudies }: { caseStudies: CaseStudyEntry[] }) {
  const domains: { domain: string; count: number }[] = [];
  for (const entry of caseStudies) {
    const existing = domains.find(
      (candidate) => candidate.domain === entry.domain,
    );
    if (existing) {
      existing.count += 1;
    } else {
      domains.push({ domain: entry.domain, count: 1 });
    }
  }

  if (domains.length === 0) {
    return (
      <p className="text-small text-muted-foreground">
        {BROWSE_LENSES_COPY.domain.emptyState}
      </p>
    );
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {domains.map(({ domain, count }) => (
        <li key={domain}>
          <Link
            href={`#${domainAnchorId(domain)}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-small text-foreground transition-colors duration-150 hover:border-foreground/30 hover:bg-muted/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            {domain}
            <span className="text-caption text-muted-foreground/70">
              {count}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ThemeLens({ themes }: { themes: EngineeringThemeEntry[] }) {
  if (themes.length === 0) {
    return (
      <p className="text-small text-muted-foreground">
        {BROWSE_LENSES_COPY.theme.emptyState}
      </p>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {themes.map((theme) => (
        <li key={theme.title} className="rounded-lg border border-border p-4">
          <Stack gap="xs">
            <h4 className="text-body font-medium text-foreground">
              {theme.title}
            </h4>
            <p className="text-caption text-muted-foreground">
              {theme.description}
            </p>
            {theme.relatedCaseStudies.length > 0 && (
              <p className="pt-1 text-caption text-muted-foreground/70">
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
        </li>
      ))}
    </ul>
  );
}

function StatusLens({ caseStudies }: { caseStudies: CaseStudyEntry[] }) {
  const completed = caseStudies.filter(
    (entry) => entry.status === "Completed",
  ).length;
  const inProgress = caseStudies.filter(
    (entry) => entry.status === "In Progress",
  ).length;

  return (
    <p className="text-small text-muted-foreground">
      {completed} Completed · {inProgress} In Progress
    </p>
  );
}

export function BrowseLenses({
  caseStudies,
  themes,
}: {
  caseStudies: CaseStudyEntry[];
  themes: EngineeringThemeEntry[];
}) {
  return (
    <Section
      id="browse-lenses"
      aria-labelledby="browse-lenses-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2 id="browse-lenses-heading" className="text-h2 text-foreground">
            {BROWSE_LENSES_COPY.title}
          </h2>
          {BROWSE_LENSES_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <div className="grid gap-8 lg:grid-cols-2">
          <LensCluster
            label={BROWSE_LENSES_COPY.domain.label}
            description={BROWSE_LENSES_COPY.domain.description}
          >
            <DomainLens caseStudies={caseStudies} />
          </LensCluster>

          <LensCluster
            label={BROWSE_LENSES_COPY.status.label}
            description={BROWSE_LENSES_COPY.status.description}
          >
            <StatusLens caseStudies={caseStudies} />
          </LensCluster>
        </div>

        <LensCluster
          label={BROWSE_LENSES_COPY.theme.label}
          description={BROWSE_LENSES_COPY.theme.description}
        >
          <ThemeLens themes={themes} />
        </LensCluster>
      </Stack>
    </Section>
  );
}
