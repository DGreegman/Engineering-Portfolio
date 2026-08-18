import type { Metadata } from "next";

import { WorkHero } from "@/components/work/work-hero";
import { EngineeringPhilosophy } from "@/components/work/engineering-philosophy";
import { FeaturedCaseStudies } from "@/components/work/featured-case-studies";
import { ArchitectureHighlights } from "@/components/work/architecture-highlights";
import { ProjectLibrary } from "@/components/work/project-library";
import { ContinueExploring } from "@/components/work/continue-exploring";
import {
  getAllCaseStudies,
  getFeaturedCaseStudies,
  getCaseStudyDomainGroups,
  toCaseStudyEntry,
} from "@/lib/content/case-studies";
import { getProjectLibraryHref } from "@/lib/content/work";
import { CONTINUE_EXPLORING_COPY } from "@/lib/constants/work-copy";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

// Task 8.2 (docs/83 §5): one local const, read three times below.
const description =
  "Engineering case studies documenting the problems, constraints, architectural decisions, and trade-offs behind real systems.";

export const metadata: Metadata = {
  title: "Work",
  description,
  // Task 8.3 (docs/84, docs/85 §14): types repeated verbatim from root.
  alternates: {
    canonical: "/work",
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  openGraph: {
    title: "Work",
    description,
    url: "/work",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work",
    description,
  },
};

/**
 * Future component organization (Task 5.1 review refinement #5, documentation
 * only — no restructuring now): `components/work/` holds seven flat files
 * today, which is appropriate at this size, same reasoning `components/
 * knowledge/` already applies at its own size. As the Work experience grows
 * to cover Task 5.2 (Case Study Library, now implemented at `app/work/
 * library/`) and Task 5.3 (Case Study Experience), it's expected to evolve
 * into `components/work/landing/`, `components/work/case-study/`, and
 * `components/work/shared/` — mirroring how `components/content/` already
 * separates reading-experience components from `components/navigation/`'s.
 * This file's own imports are the natural place that split shows up first:
 * everything imported below is landing-only and would move into
 * `components/work/landing/`. `ContinueExploring` is the first component to
 * actually earn `components/work/shared/` — Task 5.2 generalized it
 * specifically so both this page and `app/work/library/page.tsx` could
 * reuse it.
 *
 * Real Content Migration (Task 7.1, docs/52 WI-3/WI-5): every Work-facing
 * section below now reads `lib/content/case-studies.ts`'s
 * `getAllCaseStudies()` — the real `content/work/*.mdx` collection — never
 * `lib/content/work.ts`'s `PLACEHOLDER_WORK`-backed resolvers.
 * `getProjectLibraryHref()` is the one exception, still read from `work.ts`
 * unchanged: a pure route-string constant with no fixture dependency,
 * never part of the placeholder problem this migration solves (docs/52
 * §8). Architecture Highlights is reframed to a real domain grouping
 * (`getCaseStudyDomainGroups()`); Engineering Lessons no longer renders on
 * this page — no real field anywhere in the schema corresponds to it, and
 * fabricating its content is explicitly ruled out (docs/52 WI-5).
 */
export default function WorkPage() {
  const caseStudies = getAllCaseStudies();
  const featuredCaseStudies = getFeaturedCaseStudies({ caseStudies }).map(
    toCaseStudyEntry,
  );
  const projectLibrary = caseStudies.map(toCaseStudyEntry);
  const domainGroups = getCaseStudyDomainGroups(caseStudies);
  const projectLibraryHref = getProjectLibraryHref();

  return (
    <>
      <WorkHero />
      <EngineeringPhilosophy />
      <FeaturedCaseStudies caseStudies={featuredCaseStudies} />
      <ArchitectureHighlights domainGroups={domainGroups} />
      <ProjectLibrary caseStudies={projectLibrary} />
      <ContinueExploring
        title={CONTINUE_EXPLORING_COPY.title}
        introduction={CONTINUE_EXPLORING_COPY.introduction}
        links={CONTINUE_EXPLORING_COPY.links(projectLibraryHref)}
      />
    </>
  );
}
