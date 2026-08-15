/**
 * Case Study Document — `/work/[slug]` (Task 5.3)
 *
 * Implements `docs/31-CASE_STUDY_EXPERIENCE.md`'s approved structure exactly:
 * Breadcrumb → Project Header → Table of Contents + Reading Layout → Case
 * Study Body → Related Knowledge → Engineering Logs → Previous/Next.
 *
 * Coexists with `app/work/page.tsx` (Landing) and `app/work/library/page.tsx`
 * (Library) without the routing conflict `docs/20-ARTICLE_EXPERIENCE.md` had
 * to resolve for Knowledge: `library` is a static path segment and `[slug]`
 * a dynamic one, and Next.js's App Router resolves a static sibling before
 * a dynamic one at the same position without ambiguity — unlike Knowledge's
 * `[topic]`/`[slug]` collision (two *dynamic* segments cannot coexist), so
 * no "topic-then-article" style resolution order is needed here. The one
 * content-authoring discipline worth stating anyway (`case-studies.ts`'s own
 * docstring carries the full reasoning): a case study's slug should never
 * be literally `"library"`.
 *
 * Resolves the document once (`getCaseStudyBySlug`), extracts its headings
 * once (`extractHeadings`, shared by `TableOfContents` and `ArticleBody`
 * exactly as the Knowledge route already does), and resolves each
 * relationship exactly once against an already-fetched collection —
 * `getAllArticles()`, `getAllEngineeringLogEntries()`, and
 * `getAllCaseStudies()` are each read from disk a single time per request,
 * the identical "resolve once, reuse everywhere" discipline
 * `docs/22-COMPONENT_ARCHITECTURE.md` requires and the Knowledge route
 * already demonstrates.
 *
 * Reuses, unmodified, exactly what `docs/31` §3 committed to reusing:
 * `DocumentLayout`, `Breadcrumb`, `TableOfContents`, `ArticleBody` (the MDX
 * pipeline), and `PreviousNext` (fed a Work-shaped but structurally
 * compatible `ResolvedArticleSummary` pair). `ProjectHeader`,
 * `RelatedKnowledge`, `RelatedEngineeringLogs`, and (Task 7.3)
 * `RelatedCaseStudies` are Work-scoped components (`components/work/`) —
 * see `docs/31` §3's "What Intentionally Differs" for why the first three,
 * specifically, needed their own shape rather than reusing
 * `DocumentHeader`/`RelatedLearning` as-is.
 *
 * **Related Case Studies is now implemented** (Task 7.3,
 * `docs/55-RELATED_CONTENT_DISCOVERY.md`,
 * `docs/56-RELATED_CONTENT_IMPLEMENTATION_PLAN.md`) — "what else
 * demonstrates a similar engineering concern" (`docs/31` §7), resolved by
 * same-`domain` adjacency via `resolveRelatedCaseStudies()`
 * (`lib/content/case-study-relationships.ts`), reusing the `allCaseStudies`
 * collection already fetched below for Previous/Next rather than a second
 * read. Theme adjacency remains out of scope, for the identical reason
 * `case-study-relationships.ts`'s own docstring still states: case studies
 * carry no theme metadata of their own.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentLayout } from "@/components/content/document-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { ArticleBody } from "@/components/content/article-body";
import { TableOfContents } from "@/components/content/table-of-contents";
import { PreviousNext } from "@/components/content/previous-next";
import { ProjectHeader } from "@/components/work/project-header";
import { RelatedKnowledge } from "@/components/work/related-knowledge";
import { RelatedEngineeringLogs } from "@/components/work/related-engineering-logs";
import { RelatedCaseStudies } from "@/components/work/related-case-studies";
import { extractHeadings } from "@/lib/content/toc";
import { getAllArticles } from "@/lib/content/articles";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";
import {
  caseStudyExists,
  getAllCaseStudies,
  getCaseStudyBySlug,
  getCaseStudyMetadata,
  getCaseStudySlugs,
} from "@/lib/content/case-studies";
import {
  resolveRelatedKnowledge,
  resolveRelatedEngineeringLogs,
  resolveRelatedCaseStudies,
  resolvePreviousNextCaseStudy,
} from "@/lib/content/case-study-relationships";

export function generateStaticParams() {
  return getCaseStudySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!caseStudyExists(slug)) return {};

  const { frontmatter } = getCaseStudyBySlug(slug);
  return {
    title: `${frontmatter.title} — Work — Engineering Portfolio`,
    description: frontmatter.description,
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  if (!caseStudyExists(slug)) notFound();

  const caseStudy = getCaseStudyBySlug(slug);
  const metadata = getCaseStudyMetadata(caseStudy);
  // The single extraction this request performs — shared by the TOC list
  // and by ArticleBody's heading `id`s, same as the Knowledge route.
  const headings = extractHeadings(caseStudy.body);

  // Each relationship's source collection is read from disk exactly once
  // per request, shared across the resolver that needs it.
  const knowledgeArticles = getAllArticles();
  const engineeringLogEntries = getAllEngineeringLogEntries();
  const allCaseStudies = getAllCaseStudies();

  const relatedKnowledge = resolveRelatedKnowledge(
    caseStudy,
    knowledgeArticles,
  );
  const relatedEngineeringLogs = resolveRelatedEngineeringLogs(
    caseStudy,
    engineeringLogEntries,
  );
  // Task 7.3: reuses the same `allCaseStudies` array already fetched above
  // for Previous/Next — no second getAllCaseStudies() read.
  const relatedCaseStudies = resolveRelatedCaseStudies(
    caseStudy,
    allCaseStudies,
  );
  const previousNext = resolvePreviousNextCaseStudy(caseStudy, allCaseStudies);

  return (
    <DocumentLayout
      breadcrumb={
        <Breadcrumb
          items={[
            { label: "Work", href: "/work" },
            { label: "Case Study Library", href: "/work/library" },
          ]}
          current={metadata.title}
        />
      }
      header={
        <ProjectHeader
          title={metadata.title}
          description={metadata.description}
          domain={metadata.domain}
          status={metadata.status}
          timeline={metadata.timeline}
          difficulty={metadata.difficulty}
          technologies={metadata.technologies}
        />
      }
      tableOfContents={<TableOfContents headings={headings} />}
      body={<ArticleBody source={caseStudy.body} headings={headings} />}
      relatedKnowledge={
        // Task 5.7 RC refinement #2: pass no element at all — not an
        // element that would itself render `null` — when there's nothing
        // to show, so `DocumentLayout`'s existing `{relatedKnowledge &&
        // <Section>}` check (which only sees whether the *prop* is
        // truthy, never whether it would render anything) actually omits
        // the region instead of rendering an empty, landmarked
        // `<section aria-label="Related Knowledge">`. `RelatedKnowledge`
        // itself still keeps its own `items.length === 0` → `null` check
        // too, so this stays correct even for a caller that doesn't
        // pre-check — the same belt-and-braces shape
        // `app/knowledge/[slug]/page.tsx` now applies to `relatedLearning`.
        relatedKnowledge.length > 0 ? (
          <RelatedKnowledge items={relatedKnowledge} />
        ) : undefined
      }
      engineeringLogs={
        relatedEngineeringLogs.length > 0 ? (
          <RelatedEngineeringLogs items={relatedEngineeringLogs} />
        ) : undefined
      }
      relatedCaseStudies={
        // Same "pass no element at all when empty" discipline as every
        // other relationship prop on this page (Task 5.7 RC refinement #2).
        relatedCaseStudies.length > 0 ? (
          <RelatedCaseStudies items={relatedCaseStudies} />
        ) : undefined
      }
      previousNext={
        <PreviousNext
          previous={previousNext.previous}
          next={previousNext.next}
        />
      }
    />
  );
}
