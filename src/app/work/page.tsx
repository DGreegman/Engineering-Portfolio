import type { Metadata } from "next";

import { WorkHero } from "@/components/work/work-hero";
import { EngineeringPhilosophy } from "@/components/work/engineering-philosophy";
import { FeaturedCaseStudies } from "@/components/work/featured-case-studies";
import { ArchitectureHighlights } from "@/components/work/architecture-highlights";
import { ProjectLibrary } from "@/components/work/project-library";
import { EngineeringLessons } from "@/components/work/engineering-lessons";
import { ContinueExploring } from "@/components/work/continue-exploring";
import {
  getFeaturedCaseStudies,
  getProjectLibrary,
  getEngineeringThemes,
  getEngineeringLessons,
  getProjectLibraryHref,
} from "@/lib/content/work";
import { CONTINUE_EXPLORING_COPY } from "@/lib/constants/work-copy";

export const metadata: Metadata = {
  title: "Work — Engineering Portfolio",
  description:
    "Engineering case studies documenting the problems, constraints, architectural decisions, and trade-offs behind real systems.",
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
 */
export default function WorkPage() {
  // `app/work/page.tsx` receives already-resolved data from `lib/content/
  // work.ts` (Task 5.1 review refinement #1) rather than deriving it itself
  // — no `PLACEHOLDER_WORK.filter(...)` here. See that file's docstring for
  // what changes, and what doesn't, once a real Content Engine query
  // replaces its current placeholder-backed implementation.
  const featuredCaseStudies = getFeaturedCaseStudies();
  const projectLibrary = getProjectLibrary();
  const engineeringThemes = getEngineeringThemes();
  const engineeringLessons = getEngineeringLessons();
  const projectLibraryHref = getProjectLibraryHref();

  return (
    <>
      <WorkHero />
      <EngineeringPhilosophy />
      <FeaturedCaseStudies caseStudies={featuredCaseStudies} />
      <ArchitectureHighlights themes={engineeringThemes} />
      <ProjectLibrary caseStudies={projectLibrary} />
      <EngineeringLessons lessons={engineeringLessons} />
      <ContinueExploring
        title={CONTINUE_EXPLORING_COPY.title}
        introduction={CONTINUE_EXPLORING_COPY.introduction}
        links={CONTINUE_EXPLORING_COPY.links(projectLibraryHref)}
      />
    </>
  );
}
