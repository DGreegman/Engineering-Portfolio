/**
 * ContinueExploring
 *
 * "Where do I go next?" (docs/29-WORK_LANDING_PROPOSAL.md §1). The closing
 * section of every Work page — wayfinding, not a new content section, and
 * it should carry no independent argument of its own (docs/29 §1).
 *
 * Per the approved architecture review (docs/29 §4's "Continue Exploring
 * Is Contextual, Not Generic" refinement), this deliberately renders
 * exactly the links it's given, each with its own one-line justification
 * tied to something already on the page it closes — never a generic "you
 * might also like" block.
 *
 * Navigation philosophy (Task 5.2 review refinement #5), stated once here
 * so it holds for every page that reuses this component: **Continue
 * Exploring should always guide readers outward from the current
 * experience, never deeper into the same information.** Its links point to
 * other sections of the Engineering Workspace (the Work overview, the
 * Knowledge Library, Engineering Logs) — never back into content the
 * current page has already shown in full. Where a reader needs to go
 * *deeper* into what's already on the page (a specific case study, a
 * specific domain group), that path belongs to the page's own content
 * sections above this one, not to Continue Exploring.
 *
 * Generalized in Task 5.2: `title`/`introduction`/`links` are now props
 * instead of this component importing `CONTINUE_EXPLORING_COPY` directly —
 * the same generalization `StartHere`/`LearningSeries` went through in the
 * Knowledge section's Task 4.2, for the identical reason: it's what lets
 * `app/work/page.tsx` (Landing copy, resolved `projectLibraryHref`) and
 * `app/work/library/page.tsx` (Library copy, its own contextual links) share
 * this exact component instead of duplicating its markup. Each page builds
 * its own `links` array from its own copy constant — `work-copy.ts`'s
 * `CONTINUE_EXPLORING_COPY.links(projectLibraryHref)` for the Landing,
 * `work-library-copy.ts`'s `LIBRARY_CONTINUE_EXPLORING_COPY.links` for the
 * Library — and passes the resolved array straight through; this component
 * has no idea which page it's rendering for.
 *
 * Rendered as a plain list of rows rather than a `Card` grid or a single
 * `Button` — several genuinely different destinations, not one primary
 * action, so this section doesn't borrow `ExploreLibraryCta`'s
 * single-button shape; each row's label is itself the link text (`Button`
 * `variant="link"` styling would be the wrong affordance for a full
 * navigable row), keeping this section structurally the simplest possible
 * shape for "here are some honest next steps."
 *
 * A Server Component: static content, no interactivity.
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";

export interface ContinueExploringLink {
  label: string;
  description: string;
  href: string;
}

export function ContinueExploring({
  title,
  introduction,
  links,
}: {
  title: string;
  introduction: readonly string[];
  links: readonly ContinueExploringLink[];
}) {
  return (
    // width="full" — see WorkHero's comment.
    <Section
      id="continue-exploring"
      aria-labelledby="continue-exploring-heading"
      spacing="md"
      width="full"
    >
      <Stack gap="lg">
        <Stack gap="xs" className="max-w-reading">
          <h2
            id="continue-exploring-heading"
            className="text-h2 text-foreground"
          >
            {title}
          </h2>
          {introduction.map((paragraph) => (
            <p key={paragraph} className="text-body text-muted-foreground">
              {paragraph}
            </p>
          ))}
        </Stack>

        <ul className="max-w-reading divide-y divide-border/50">
          {links.map((link) => (
            <li
              key={link.href}
              className="relative -mx-4 rounded-md px-4 py-5 transition-colors duration-150 hover:bg-muted/40 focus-within:bg-muted/40 focus-within:ring-2 focus-within:ring-ring"
            >
              <h3 className="text-h4 text-foreground">
                <Link
                  href={link.href}
                  className="after:absolute after:inset-0 focus:outline-none"
                >
                  {link.label}
                </Link>
              </h3>
              <p className="mt-1 text-small text-muted-foreground">
                {link.description}
              </p>
            </li>
          ))}
        </ul>
      </Stack>
    </Section>
  );
}
