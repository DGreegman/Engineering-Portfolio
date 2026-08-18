/**
 * Engineering Log Detail — `/engineering-log/[slug]` (Task 6.2)
 *
 * Implements `docs/37-ENGINEERING_LOG_EXPERIENCE.md`'s approved structure
 * exactly: Breadcrumb → Log Entry Header → Table of Contents + Reading
 * Layout → Entry Body → Related Knowledge → Related Work → Previous/Next.
 * Structurally mirrors `app/work/[slug]/page.tsx` — the same
 * `DocumentLayout` skeleton, the same "resolve once, reuse everywhere"
 * discipline, the same existence-check-before-load pattern — because a
 * reading document is a reading document; only the header's metadata
 * vocabulary and the two closing relationship sections' *content* differ
 * (`docs/37` §17, Decision D4).
 *
 * Breadcrumb has two segments (`Engineering Log → {title}`), not three —
 * unlike Work's `Work → Case Study Library → {title}`, there is no
 * intermediate category tier: chronology has no middle rung to name
 * (`docs/37` §8).
 *
 * `relatedKnowledge` and `relatedWork` both use the "pass `undefined`, not
 * an always-truthy element, when the resolved list is empty" pattern
 * `app/work/[slug]/page.tsx` already established (Task 5.7 RC refinement
 * #2) — so `DocumentLayout`'s `{relatedWork && <Section>}` check actually
 * omits the region when there's nothing to show, rather than rendering an
 * empty, landmarked `<section aria-label="Related Work">`. Both
 * presentation components also keep their own `items.length === 0` →
 * `null` guard, the same belt-and-braces shape every other relationship
 * region in this codebase already uses.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocumentLayout } from "@/components/content/document-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { ArticleBody } from "@/components/content/article-body";
import { TableOfContents } from "@/components/content/table-of-contents";
import { PreviousNext } from "@/components/content/previous-next";
import { LogEntryHeader } from "@/components/engineering-log/log-entry-header";
import { RelatedKnowledge } from "@/components/engineering-log/related-knowledge";
import { RelatedWork } from "@/components/engineering-log/related-work";
import { extractHeadings } from "@/lib/content/toc";
import { getAllArticles } from "@/lib/content/articles";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { resolveArticleReferences } from "@/lib/content/relationships";
import { DEFAULT_RELATIONSHIP_LIMIT } from "@/lib/content/case-study-relationships";
import { formatDate } from "@/lib/utils/format-date";
import {
  engineeringLogEntryExists,
  getEngineeringLogEntryBySlug,
  getEngineeringLogSlugs,
  getAllEngineeringLogEntries,
  resolveRelatedWorkForLog,
  resolvePreviousNextLog,
} from "@/lib/content/engineering-logs";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

export function generateStaticParams() {
  return getEngineeringLogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/engineering-log/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!engineeringLogEntryExists(slug)) return {};

  const { frontmatter } = getEngineeringLogEntryBySlug(slug);
  const title = `${frontmatter.title} — Engineering Log`;
  const url = `/engineering-log/${slug}`;
  return {
    title,
    description: frontmatter.description,
    // Task 8.3 (docs/84, docs/85 §14): reuses the exact same `url` value
    // already computed for openGraph.url below; types repeated verbatim
    // from root so this route doesn't lose RSS auto-discovery.
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
      },
    },
    // Task 8.2 (docs/83 §8): no `section` field — articleFrontmatterSchema
    // (which this collection uses directly) has no topic/domain-equivalent
    // value; omitted rather than forced onto an ill-fitting field.
    openGraph: {
      title,
      description: frontmatter.description,
      url,
      siteName: SITE_NAME,
      type: "article",
      publishedTime: frontmatter.publishedAt.toISOString(),
      modifiedTime: frontmatter.updatedAt?.toISOString(),
      tags: frontmatter.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: frontmatter.description,
    },
  };
}

export default async function EngineeringLogEntryPage({
  params,
}: PageProps<"/engineering-log/[slug]">) {
  const { slug } = await params;
  if (!engineeringLogEntryExists(slug)) notFound();

  const logEntry = getEngineeringLogEntryBySlug(slug);
  // The single extraction this request performs — shared by the TOC list
  // and by ArticleBody's heading `id`s, same as the Work/Knowledge routes.
  const headings = extractHeadings(logEntry.body);

  // Each relationship's source collection is read from disk exactly once
  // per request, shared across the resolver that needs it.
  const knowledgeArticles = getAllArticles();
  const allCaseStudies = getAllCaseStudies();
  const allLogEntries = getAllEngineeringLogEntries();

  const relatedKnowledge = resolveArticleReferences(
    logEntry.frontmatter.relatedContent,
    knowledgeArticles,
    logEntry.slug,
    // This route has no wrapper function of its own to carry a default
    // limit the way case-study-relationships.ts's resolveRelatedKnowledge()
    // does for Work — importing the same shared constant directly here is
    // what keeps this the identical editorial ceiling, not a second number
    // that could drift from it.
    DEFAULT_RELATIONSHIP_LIMIT,
  );
  const relatedWork = resolveRelatedWorkForLog(logEntry, allCaseStudies);
  const previousNext = resolvePreviousNextLog(logEntry, allLogEntries);

  return (
    <DocumentLayout
      breadcrumb={
        <Breadcrumb
          items={[{ label: "Engineering Log", href: "/engineering-log" }]}
          current={logEntry.frontmatter.title}
        />
      }
      header={
        <LogEntryHeader
          title={logEntry.frontmatter.title}
          description={logEntry.frontmatter.description}
          publishedAt={formatDate(logEntry.frontmatter.publishedAt)}
          tags={logEntry.frontmatter.tags}
        />
      }
      tableOfContents={<TableOfContents headings={headings} />}
      body={<ArticleBody source={logEntry.body} headings={headings} />}
      relatedKnowledge={
        relatedKnowledge.length > 0 ? (
          <RelatedKnowledge items={relatedKnowledge} />
        ) : undefined
      }
      relatedWork={
        relatedWork.length > 0 ? <RelatedWork items={relatedWork} /> : undefined
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
