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
import { AppliedInCaseStudies } from "@/components/content/applied-in-case-studies";
import { PreviousNext } from "@/components/content/previous-next";
import { extractHeadings } from "@/lib/content/toc";
import {
  resolveRelatedLearning,
  resolvePreviousNext,
  hasRelatedLearningContent,
} from "@/lib/content/relationships";
import { resolveRelatedWorkForArticle } from "@/lib/content/case-study-relationships";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { findTopic, type Topic } from "@/lib/constants/placeholder-topics";
import { PLACEHOLDER_SERIES } from "@/lib/constants/placeholder-series";
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
  getFeaturedArticles,
  toKnowledgeArticleCard,
} from "@/lib/content/articles";
import { sortByPublishedDate } from "@/lib/content/loader";
import { TOPIC_SLUGS, type TopicSlug } from "@/lib/content/topics";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";

/**
 * Topic-slug validity, re-sourced to the real, authoritative vocabulary
 * (Real Content Migration, Task 7.1, docs/52 §6) — the same `TOPIC_SLUGS`
 * `knowledgeFrontmatterSchema` already validates real article frontmatter
 * against, rather than `PLACEHOLDER_TOPICS` array membership, which
 * happened to match but checked the wrong source.
 */
function isTopicSlug(slug: string): slug is TopicSlug {
  return (TOPIC_SLUGS as readonly string[]).includes(slug);
}

/**
 * Combines the real validity check above with the retained display-metadata
 * lookup (`findTopic()`, `lib/constants/placeholder-topics.ts`, docs/52
 * §9/§14) — a topic slug that's real but has no display entry yet is now an
 * honest, distinct gap from "not a topic at all," rather than the two being
 * silently conflated by a single `PLACEHOLDER_TOPICS.find()` call the way
 * this route did before this migration.
 */
function resolveTopic(slug: string): Topic | undefined {
  if (!isTopicSlug(slug)) return undefined;
  return findTopic(slug);
}

export function generateStaticParams() {
  const topicParams = TOPIC_SLUGS.map((slug) => ({ slug }));
  const articleParams = getArticleSlugs().map((slug) => ({ slug }));
  return [...topicParams, ...articleParams];
}

export async function generateMetadata({
  params,
}: PageProps<"/knowledge/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  const topic = resolveTopic(slug);
  if (topic) {
    const title = `${topic.title} — Knowledge`;
    const url = `/knowledge/${slug}`;
    return {
      title,
      description: topic.description,
      // Task 8.3 (docs/84, docs/85 §14): reuses the exact same `url` value
      // already computed for openGraph.url below; types repeated verbatim
      // from root so this branch doesn't lose RSS auto-discovery.
      alternates: {
        canonical: url,
        types: {
          "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
        },
      },
      // Task 8.2 (docs/83 §6): a topic page is a listing, not a single
      // authored document — website-typed, not article-typed, despite
      // sharing this generateMetadata() with the article branch below.
      openGraph: {
        title,
        description: topic.description,
        url,
        siteName: SITE_NAME,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: topic.description,
      },
    };
  }

  if (articleExists(slug)) {
    const { frontmatter } = getArticleBySlug(slug);
    const title = `${frontmatter.title} — Knowledge`;
    const url = `/knowledge/${slug}`;
    return {
      title,
      description: frontmatter.description,
      // Task 8.3 (docs/84, docs/85 §14): reuses the exact same `url` value
      // already computed for openGraph.url below; types repeated verbatim
      // from root so this branch doesn't lose RSS auto-discovery.
      alternates: {
        canonical: url,
        types: {
          "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
        },
      },
      // Task 8.2 (docs/83 §6): a complete openGraph/twitter object — every
      // field here is a direct read of frontmatter that already exists,
      // no new content authored. article:published_time needs a string;
      // publishedAt is a real Date at runtime (z.coerce.date(), schema.ts),
      // so toISOString() converts it, the same native-Date-method
      // discipline rss.ts's own toUTCString() already establishes.
      openGraph: {
        title,
        description: frontmatter.description,
        url,
        siteName: SITE_NAME,
        type: "article",
        publishedTime: frontmatter.publishedAt.toISOString(),
        modifiedTime: frontmatter.updatedAt?.toISOString(),
        tags: frontmatter.tags,
        section: frontmatter.topic,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: frontmatter.description,
      },
    };
  }

  return {};
}

export default async function KnowledgeSlugPage({
  params,
}: PageProps<"/knowledge/[slug]">) {
  const { slug } = await params;

  // Step 1 — Topic resolution. Task 4.2's experience; Start Here/Article
  // List re-sourced to real content by the Real Content Migration (Task
  // 7.1, docs/52 WI-2) — never `PLACEHOLDER_TOPIC_ARTICLES`.
  const topic = resolveTopic(slug);
  if (topic) {
    // Every published article whose frontmatter.topic matches this slug —
    // draft-filtered by `getAllArticles()` itself.
    const topicArticles = getAllArticles().filter(
      (article) => article.frontmatter.topic === slug,
    );
    const startHereArticles = getFeaturedArticles({
      articles: topicArticles,
      limit: 3,
    });
    const startHereSlugs = new Set(startHereArticles.map((a) => a.slug));
    // "The remaining shelf, beyond the three Start Here picks above it"
    // (`TopicArticleList`'s own docstring) — never the full topic list a
    // second time.
    const remainingArticles = sortByPublishedDate(
      topicArticles.filter((article) => !startHereSlugs.has(article.slug)),
    );

    const startHere = startHereArticles.map((article) =>
      toKnowledgeArticleCard(article, topic.title),
    );
    const articles = remainingArticles.map((article) =>
      toKnowledgeArticleCard(article, topic.title),
    );

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
          articleCount={topicArticles.length}
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
    // Task 7.26 (docs/76 §13, docs/77): the one new collection read this
    // route performs — Work has never been read from `/knowledge/[slug]`
    // before this feature. Read once, handed straight to the one resolver
    // that needs it, the same "read once per request" discipline
    // `allArticles` above already follows.
    const allCaseStudies = getAllCaseStudies();
    const appliedCaseStudies = resolveRelatedWorkForArticle(
      article,
      allCaseStudies,
    );

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
        appliedInCaseStudies={
          // Same "pass no element at all when empty" discipline as
          // relatedLearning above — DocumentLayout's own
          // `{appliedInCaseStudies && <Section>}` check only sees whether
          // the *prop* is truthy, not whether it would render anything.
          appliedCaseStudies.length > 0 ? (
            <AppliedInCaseStudies items={appliedCaseStudies} />
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
