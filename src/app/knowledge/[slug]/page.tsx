/**
 * Knowledge Slug Resolution — `/knowledge/[slug]` (Task 4.2 Topic Pages,
 * extended by Task 4.3.1 Document Resolution)
 *
 * One route, two experiences, resolved in a fixed order — the exact
 * "Routing Resolution Order" docs/20-ARTICLE_EXPERIENCE.md specifies:
 *
 *   Step 1 — Is `slug` a known Topic?        → render the Topic Page (Task 4.2).
 *   Step 2 — Is `slug` a known Article?       → resolve the document (Task 4.3.1).
 *   Step 3 — Neither.                         → notFound().
 *
 * This file is the same route Task 4.2 built as `app/knowledge/[topic]/` —
 * renamed to `[slug]` rather than living beside a new sibling route,
 * because Next.js's App Router allows exactly one dynamic segment name per
 * path position; `[topic]` and `[slug]` cannot coexist as siblings under
 * `/knowledge/`. Topic resolution is checked first: topics are the
 * smaller, fixed set, and are structural/navigational, so they should
 * never be shadowable by an article that happens to reuse a topic's slug
 * (a content-authoring naming-discipline concern, not a technical one).
 *
 * Step 2 renders `DocumentLayout` — Task 4.3.2's structural skeleton for
 * the Engineering Article experience (`components/content/document-layout.tsx`)
 * — with its `breadcrumb`/`header`/`seriesBanner` slots filled by Task
 * 4.3.3's Document Header work, `body` filled by Task 4.3.4's MDX
 * rendering (`ArticleBody`), `tableOfContents` filled by Task 4.3.5's
 * Reading Navigation, `relatedLearning` filled by Task 4.3.8's relationship
 * resolution (`resolveRelatedLearning()`, rendered by `RelatedLearning`),
 * and now `previousNext` filled by Task 4.3.9's sequential navigation
 * (`resolvePreviousNext()`, both in `lib/content/relationships.ts`,
 * rendered by `PreviousNext`). `extractHeadings(article.body)` runs
 * exactly once here — its result is handed to both `TableOfContents` (the
 * nav list) and `ArticleBody` (matching heading `id`s), so there is one
 * heading extraction per request, not two; `resolveRelatedLearning(article)`
 * and `resolvePreviousNext(article)` each similarly read the Knowledge
 * collection exactly once and hand that result to every group/side they
 * respectively resolve.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TopicHero } from "@/components/knowledge/topic-hero";
import { StartHere } from "@/components/knowledge/start-here";
import { LearningSeries } from "@/components/knowledge/learning-series";
import { TopicArticleList } from "@/components/knowledge/topic-article-list";
import { RelatedTopics } from "@/components/knowledge/related-topics";
import { DocumentLayout } from "@/components/content/document-layout";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { DocumentHeader } from "@/components/content/document-header";
import { SeriesBanner } from "@/components/content/series-banner";
import { ArticleBody } from "@/components/content/article-body";
import { TableOfContents } from "@/components/content/table-of-contents";
import { RelatedLearning } from "@/components/content/related-learning";
import { PreviousNext } from "@/components/content/previous-next";
import { extractHeadings } from "@/lib/content/toc";
import {
  resolveRelatedLearning,
  resolvePreviousNext,
  hasRelatedLearningContent,
} from "@/lib/content/relationships";
import {
  PLACEHOLDER_TOPICS,
  type Topic,
} from "@/lib/constants/placeholder-topics";
import { PLACEHOLDER_SERIES } from "@/lib/constants/placeholder-series";
import { PLACEHOLDER_TOPIC_ARTICLES } from "@/lib/constants/placeholder-topic-articles";
import {
  TOPIC_START_HERE_COPY,
  TOPIC_LEARNING_SERIES_COPY,
  TOPIC_ARTICLES_COPY,
  RELATED_TOPICS_COPY,
} from "@/lib/constants/knowledge-copy";
import {
  articleExists,
  getAllArticles,
  getArticleBySlug,
  getArticleMetadata,
  getArticleSlugs,
} from "@/lib/content/articles";

function findTopic(slug: string): Topic | undefined {
  return PLACEHOLDER_TOPICS.find((topic) => topic.slug === slug);
}

export function generateStaticParams() {
  const topicParams = PLACEHOLDER_TOPICS.map((topic) => ({
    slug: topic.slug,
  }));
  const articleParams = getArticleSlugs().map((slug) => ({ slug }));
  return [...topicParams, ...articleParams];
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const topic = findTopic(slug);
  if (topic) {
    return {
      title: `${topic.title} — Knowledge — Engineering Portfolio`,
      description: topic.description,
    };
  }

  if (articleExists(slug)) {
    const { frontmatter } = getArticleBySlug(slug);
    return {
      title: `${frontmatter.title} — Knowledge — Engineering Portfolio`,
      description: frontmatter.description,
    };
  }

  return {};
}

export default async function KnowledgeSlugPage({
  params,
}: PageProps<"/knowledge/[slug]">) {
  const { slug } = await params;

  // Step 1 — Topic resolution. Task 4.2's experience, unchanged.
  const topic = findTopic(slug);
  if (topic) {
    // `hasContent` gates the hero's article count, not just which arrays
    // get passed down: showing an aspirational "14 Articles" next to a
    // Start Here/Articles section that both say "still being curated"
    // reads as a bug, not a preview of scale — verified by actually
    // looking at the rendered Cloud page, not just reasoning about it. The
    // three topics with real placeholder-topic-articles.ts content keep
    // their larger aspirational count (the library growing beyond what's
    // curated here is normal when there's real content demonstrating the
    // topic is active); topics with nothing rendered anywhere on the page
    // don't claim a count.
    const hasContent = slug in PLACEHOLDER_TOPIC_ARTICLES;
    const { startHere, articles } = PLACEHOLDER_TOPIC_ARTICLES[slug] ?? {
      startHere: [],
      articles: [],
    };

    const series = PLACEHOLDER_SERIES.filter((entry) =>
      entry.topics?.includes(topic.title),
    );

    const relatedTopics = (topic.relatedTopics ?? [])
      .map((relatedSlug) => findTopic(relatedSlug))
      .filter((related): related is Topic => related !== undefined);

    return (
      <>
        <TopicHero
          title={topic.title}
          description={topic.description}
          heroIntroduction={topic.heroIntroduction}
          articleCount={hasContent ? topic.articleCount : undefined}
          seriesCount={series.length > 0 ? series.length : undefined}
        />
        <StartHere
          title="Start Here"
          introduction={TOPIC_START_HERE_COPY.introduction(topic.title)}
          cardLabel={TOPIC_START_HERE_COPY.cardLabel}
          emptyState={TOPIC_START_HERE_COPY.emptyState}
          articles={startHere}
        />
        <LearningSeries
          title="Learning Series"
          introduction={TOPIC_LEARNING_SERIES_COPY.introduction(topic.title)}
          emptyState={TOPIC_LEARNING_SERIES_COPY.emptyState}
          series={series}
        />
        <TopicArticleList
          title={TOPIC_ARTICLES_COPY.title}
          introduction={TOPIC_ARTICLES_COPY.introduction(topic.title)}
          emptyState={TOPIC_ARTICLES_COPY.emptyState}
          articles={articles}
        />
        <RelatedTopics
          title={RELATED_TOPICS_COPY.title}
          introduction={RELATED_TOPICS_COPY.introduction(topic.title)}
          emptyState={RELATED_TOPICS_COPY.emptyState}
          topics={relatedTopics}
        />
      </>
    );
  }

  // Step 2 — Article resolution. Resolves the document once (Task 4.3.1)
  // and passes its Breadcrumb/Header/Series Banner/Body/Table of Contents/
  // Related Learning/Previous-Next content into Task 4.3.2's layout slots
  // (Tasks 4.3.3/4.3.4/4.3.5/4.3.8/4.3.9). Every `DocumentLayout` slot is
  // now filled.
  if (articleExists(slug)) {
    const article = getArticleBySlug(slug);
    const metadata = getArticleMetadata(article);
    // Every Knowledge article has a required `topic` (Task 4.3.1's schema
    // dependency), so this is always resolvable — `PLACEHOLDER_TOPICS` is
    // the same list `knowledgeFrontmatterSchema`'s enum validates against.
    const articleTopic = findTopic(metadata.topic);
    // The single extraction this request performs — shared by the TOC
    // list below and by `ArticleBody`'s heading `id`s (Task 4.3.5).
    const headings = extractHeadings(article.body);
    // Read once, shared by both relationship resolvers below — Task
    // 4.3.8's Related Learning and Task 4.3.9's Previous/Next are separate
    // resolutions (exploratory groups vs. the canonical sequence) but both
    // need the same Knowledge collection to resolve against, so this
    // request reads it from disk exactly once rather than twice.
    const allArticles = getAllArticles();
    const relatedLearningGroups = resolveRelatedLearning(article, allArticles);
    const previousNext = resolvePreviousNext(article, allArticles);

    return (
      <DocumentLayout
        breadcrumb={
          articleTopic && (
            <Breadcrumb
              items={[
                { label: "Knowledge", href: "/knowledge" },
                { label: articleTopic.title, href: articleTopic.href },
              ]}
              current={metadata.title}
            />
          )
        }
        header={
          articleTopic && (
            <DocumentHeader
              title={metadata.title}
              description={metadata.description}
              topic={articleTopic}
              difficulty={metadata.difficulty}
              readingTime={metadata.readingTime}
              publishedAt={metadata.publishedAt}
              updatedAt={metadata.updatedAt}
              tags={metadata.tags}
            />
          )
        }
        seriesBanner={
          metadata.series && (
            <SeriesBanner
              series={metadata.series}
              seriesOrder={metadata.seriesOrder}
            />
          )
        }
        tableOfContents={<TableOfContents headings={headings} />}
        body={<ArticleBody source={article.body} headings={headings} />}
        relatedLearning={
          // Task 5.7 RC refinement #2: pass no element at all — not an
          // element that would render `null` — when there's nothing here,
          // so `DocumentLayout`'s existing `{relatedLearning && <Section>}`
          // check (which only sees whether the *prop* is truthy, not
          // whether it would render anything) actually omits the region
          // rather than rendering an empty, landmarked `<section>`. Same
          // "no trace when absent" contract `seriesBanner` already gets
          // from its own `metadata.series && (...)` conditional above —
          // `RelatedLearning` still keeps its own internal check too
          // (`hasRelatedLearningContent`), so this remains correct even for
          // a caller that doesn't pre-check.
          hasRelatedLearningContent(relatedLearningGroups) ? (
            <RelatedLearning groups={relatedLearningGroups} />
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

  // Step 3 — Neither a known topic nor a known article.
  notFound();
}
