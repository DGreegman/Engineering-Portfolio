/**
 * CaseStudyListing
 *
 * "What is the complete, ordered archive?" (docs/30-CASE_STUDY_LIBRARY_
 * PROPOSAL.md §1/§3). The one true collection this entire page exists to
 * present — every other section either approaches it (`BrowseLenses`) or
 * leaves from it (`ContinueExploring`).
 *
 * Grouped by **domain** — the Listing's one structural organizing axis.
 * docs/30 §3 documents five facets (domain, theme, technology, status,
 * complexity) but does not mandate the Listing itself be grouped by all of
 * them simultaneously (a case study can't visually belong to three group
 * headings at once). Domain was chosen as the Listing's own axis because
 * it's the most fundamental, best-modeled fact about a case study
 * (`CaseStudyEntry.domain`, established in Task 3.5) and the same axis
 * `ProjectLibrary` already surfaces on the Landing ("Organized by domain:"
 * — docs/30 §5's continuity requirement). Theme and status remain real,
 * but stay Browse-Lens-only (`BrowseLenses`) rather than second/third
 * groupings layered onto this same list — see that component's own
 * docstring for how a reader reaches a case study through those facets
 * instead.
 *
 * Groups render in the order their domain first appears in the resolved
 * collection — never re-sorted (alphabetically or otherwise) by this
 * component. Per docs/30 §3's strengthened Default Order principle ("the
 * default order should communicate engineering significance, not
 * implementation convenience... the presentation layer should never depend
 * on array ordering directly"), the *meaning* of that order is
 * `lib/content/work.ts`'s `getProjectLibrary()`'s responsibility, not this
 * component's — this component only respects whatever order it's handed.
 *
 * Future architectural note (Task 5.2 review refinement #3, documentation
 * only): the grouping-by-domain this component does is a **presentation
 * decision applied to the collection, not a property of the collection
 * itself.** `getCaseStudyLibrary()`/`getProjectLibrary()` hand back one flat,
 * ordered array — nothing about the resolver bakes "grouped by domain" into
 * what it returns, deliberately, so a future resolver is free to expose a
 * different ordering or grouping strategy (by theme, by significance, by
 * whatever the real Content Engine eventually supports) without this page's
 * architecture changing shape. If that grouping axis ever changes, it
 * changes here, in this component's own grouping logic — never by asking
 * the resolver to pre-shape the collection around one particular view of it.
 *
 * Filtering (docs/30 §4): this implementation deliberately does not hide
 * entries behind an interactive filter — "the unfiltered Listing must
 * already be a complete, browsable archive in its own right... filtering is
 * a convenience for narrowing, never a requirement" (docs/30 §4). Grouping
 * by domain *is* the narrowing mechanism here: a reader scanning to one
 * heading already sees only that domain's work, with zero client state,
 * zero query params, and zero risk of an honest "no results" dead end —
 * every entry is always reachable. `BrowseLenses` supplies the jump-to
 * entry points (`#domain-<slug>` anchors) into these same group headings.
 * See `browse-lenses.tsx`'s docstring for the full reasoning behind not
 * building the interactive/URL-addressable filter docs/30 §4 explicitly
 * scoped as future work.
 *
 * Reuses the "case file, not project tile" visual language `Featured
 * CaseStudies`/`EngineeringCaseStudies` already established (title is the
 * one real `<Link>`, stretched hit area, quiet citation line) rather than a
 * fourth visual treatment for the same kind of content — composition over
 * duplication. Does not repeat `FeaturedCaseStudies`' running "CASE 00N"
 * label — that numbering is a small-curated-set flourish; at archive scale,
 * across multiple domain groups, a running case number would either reset
 * confusingly per group or count in a way no group heading agrees with.
 * Featured entries instead get a quiet inline marker (docs/30 §5: "a quiet
 * marker, not a separate section") so the same `featured` flag that drives
 * `FeaturedCaseStudies` on the Landing reads consistently here.
 *
 * Fully data-agnostic: `caseStudies` is a required prop, same pattern as
 * every other section on this page.
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { slugify } from "@/lib/utils/slugify";
import { CASE_STUDY_LISTING_COPY } from "@/lib/constants/work-library-copy";
import type { CaseStudyEntry } from "@/lib/constants/placeholder-work";

/** The anchor id a domain group renders at — shared with `BrowseLenses`'
 * domain lens so its links resolve to a real heading on this page. */
export function domainAnchorId(domain: string): string {
  return `domain-${slugify(domain)}`;
}

function ListingEntry({ entry }: { entry: CaseStudyEntry }) {
  const citation = entry.publishedAt
    ? `${entry.status} • ${entry.publishedAt}`
    : entry.status;

  return (
    <li className="relative -mx-4 rounded-md px-4 py-6 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring">
      {entry.featured && (
        <p className="font-mono text-caption text-muted-foreground">
          {CASE_STUDY_LISTING_COPY.featuredLabel}
        </p>
      )}
      <h4 className="mt-1 text-h4 text-foreground first:mt-0">
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

function DomainGroup({
  domain,
  entries,
}: {
  domain: string;
  entries: CaseStudyEntry[];
}) {
  return (
    <li>
      <Stack gap="sm">
        <h3
          id={domainAnchorId(domain)}
          className="scroll-mt-24 text-h4 text-foreground"
        >
          {domain}{" "}
          <span className="font-mono text-caption text-muted-foreground/70">
            ({entries.length})
          </span>
        </h3>
        <ol className="divide-y divide-border">
          {entries.map((entry) => (
            <ListingEntry key={entry.href} entry={entry} />
          ))}
        </ol>
      </Stack>
    </li>
  );
}

export function CaseStudyListing({
  caseStudies,
}: {
  caseStudies: CaseStudyEntry[];
}) {
  // Group by domain, preserving first-appearance order — see this
  // component's docstring on why order is never recomputed here.
  const groups: { domain: string; entries: CaseStudyEntry[] }[] = [];
  for (const entry of caseStudies) {
    const group = groups.find((candidate) => candidate.domain === entry.domain);
    if (group) {
      group.entries.push(entry);
    } else {
      groups.push({ domain: entry.domain, entries: [entry] });
    }
  }

  return (
    <Section
      id="case-study-listing"
      aria-labelledby="case-study-listing-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="case-study-listing-heading"
            className="text-h2 text-foreground"
          >
            {CASE_STUDY_LISTING_COPY.title}
          </h2>
          {CASE_STUDY_LISTING_COPY.introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        {caseStudies.length === 0 ? (
          <Stack gap="xs">
            {CASE_STUDY_LISTING_COPY.emptyState.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>
        ) : (
          <Stack as="ul" gap="xl" className="max-w-reading">
            {groups.map((group) => (
              <DomainGroup
                key={group.domain}
                domain={group.domain}
                entries={group.entries}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Section>
  );
}
