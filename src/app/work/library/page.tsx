import type { Metadata } from "next";

import { LibraryHeader } from "@/components/work/library-header";
import { BrowseLenses } from "@/components/work/browse-lenses";
import { CaseStudyListing } from "@/components/work/case-study-listing";
import { ContinueExploring } from "@/components/work/continue-exploring";
import { getCaseStudyLibrary } from "@/lib/content/case-studies";
import { LIBRARY_CONTINUE_EXPLORING_COPY } from "@/lib/constants/work-library-copy";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

// Task 8.2 (docs/83 §5): one local const, read three times below.
const description =
  "The complete archive of engineering case studies, organized by domain, engineering theme, and status.";

export const metadata: Metadata = {
  title: "Case Study Library",
  description,
  // Task 8.3 (docs/84, docs/85 §14): types repeated verbatim from root.
  alternates: {
    canonical: "/work/library",
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  openGraph: {
    title: "Case Study Library",
    description,
    url: "/work/library",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Study Library",
    description,
  },
};

/**
 * The Case Study Library (Task 5.2) — implements docs/30-CASE_STUDY_
 * LIBRARY_PROPOSAL.md's four approved sections, in the approved order, and
 * nothing else: Library Header → Browse Lenses → Case Study Listing →
 * Continue Exploring.
 *
 * Per docs/30's opening "canonical browsing surface" statement, this route
 * is the one place engineering work gets browsed — the Landing's Featured
 * Case Studies and Project Library preview both exist to lead here, never
 * to compete with it (see `getProjectLibraryHref()`, which now resolves to
 * this exact route). This remains the single canonical archive for
 * engineering work: future pages may link to it, but should never
 * re-render their own copy of the full listing — the same discipline
 * `getFeaturedCaseStudies()`/`getProjectLibrary()` already enforce at the
 * data layer, restated here at the page level.
 *
 * Receives one resolved model from `lib/content/work.ts`'s
 * `getCaseStudyLibrary()` (Task 5.2 review refinement #1) rather than
 * composing `getProjectLibrary()` and `getEngineeringThemes()` itself — this
 * page reasons about one cohesive library, not an assembly of parts. See
 * that function's docstring for what it's expected to grow into.
 */
export default function CaseStudyLibraryPage() {
  // Real Content Migration (Task 7.1, docs/52 WI-4): reads
  // `case-studies.ts`'s own `getCaseStudyLibrary()` — real
  // `content/work/*.mdx` case studies — never `lib/content/work.ts`'s
  // placeholder-backed version. `library.themes` is real-shaped but empty
  // by construction (docs/52 WI-5): no real per-case-study theme facet
  // exists yet. `BrowseLenses`' Domain and Status lenses remain fully real
  // and populated regardless — only its one unsupported Theme perspective
  // goes quiet, with its own existing, honest empty state.
  const library = getCaseStudyLibrary();

  return (
    <>
      <LibraryHeader count={library.count} />
      <BrowseLenses caseStudies={library.caseStudies} themes={library.themes} />
      <CaseStudyListing caseStudies={library.caseStudies} />
      <ContinueExploring
        title={LIBRARY_CONTINUE_EXPLORING_COPY.title}
        introduction={LIBRARY_CONTINUE_EXPLORING_COPY.introduction}
        links={LIBRARY_CONTINUE_EXPLORING_COPY.links}
      />
    </>
  );
}
