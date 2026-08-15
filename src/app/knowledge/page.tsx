import type { Metadata } from "next";

import { KnowledgeHero } from "@/components/knowledge/knowledge-hero";
import { StartHere } from "@/components/knowledge/start-here";
import { BrowseByTopic } from "@/components/knowledge/browse-by-topic";
import { LearningSeries } from "@/components/knowledge/learning-series";
import { RecentlyPublished } from "@/components/knowledge/recently-published";
import { ExploreLibraryCta } from "@/components/knowledge/explore-library-cta";
import {
  PLACEHOLDER_TOPICS,
  findTopic,
} from "@/lib/constants/placeholder-topics";
import { PLACEHOLDER_SERIES } from "@/lib/constants/placeholder-series";
import {
  START_HERE_COPY,
  LEARNING_SERIES_COPY,
} from "@/lib/constants/knowledge-copy";
import {
  getAllArticles,
  getFeaturedArticles,
  toKnowledgeArticleCard,
} from "@/lib/content/articles";
import { sortByPublishedDate } from "@/lib/content/loader";

export const metadata: Metadata = {
  title: "Knowledge — Engineering Portfolio",
  description:
    "A long-term collection of engineering concepts, architecture decisions, backend systems, security, cloud computing, and lessons learned.",
};

/**
 * Real Content Migration (Task 7.1, docs/52 WI-1): resolves a real
 * article's topic display label via the retained `PLACEHOLDER_TOPICS`
 * metadata (docs/52 §9 — presentation configuration, not placeholder
 * content), falling back to the raw slug in the (currently unreachable)
 * case a real, valid topic has no display entry — never crashing on a
 * data gap.
 */
function topicLabel(topicSlug: string): string {
  return findTopic(topicSlug)?.title ?? topicSlug;
}

export default function KnowledgePage() {
  // Real Content Migration (Task 7.1, docs/52 WI-1): Start Here and
  // Recently Published now read the real Knowledge collection
  // (`getAllArticles()`/`getFeaturedArticles()`, `lib/content/articles.ts`)
  // — never `PLACEHOLDER_START_HERE`/`PLACEHOLDER_RECENTLY_PUBLISHED`.
  // Browse by Topic and Learning Series are unchanged by this migration
  // (docs/52 §5, §9) — topic display metadata and Learning Series both stay
  // exactly as they were.
  const allArticles = getAllArticles();
  const startHere = getFeaturedArticles({
    articles: allArticles,
    limit: 3,
  }).map((article) =>
    toKnowledgeArticleCard(article, topicLabel(article.frontmatter.topic)),
  );
  // 4 — the same editorial limit `PLACEHOLDER_RECENTLY_PUBLISHED`'s own
  // fixed array length held before this migration (docs/52 §19), now an
  // explicit cap rather than an incidental fixture-array length.
  const recentlyPublished = sortByPublishedDate(allArticles)
    .slice(0, 4)
    .map((article) =>
      toKnowledgeArticleCard(article, topicLabel(article.frontmatter.topic)),
    );

  return (
    <>
      <KnowledgeHero />
      {/* `articles` is passed in from here, not decided inside the
          component. `StartHere` is shared with `/knowledge/[slug]` (Task
          4.2), so this page's own copy is passed explicitly rather than the
          component importing it. */}
      <StartHere
        title={START_HERE_COPY.title}
        introduction={START_HERE_COPY.introduction}
        cardLabel={START_HERE_COPY.cardLabel}
        emptyState={START_HERE_COPY.emptyState}
        articles={startHere}
      />
      {/* Same data-agnostic pattern: `topics` comes from here, not from
          inside the component. */}
      <BrowseByTopic topics={PLACEHOLDER_TOPICS} />
      {/* Same pattern again: `series` comes from here. Same copy-as-props
          reasoning as `StartHere` above — `LearningSeries` is also shared
          with topic pages now. */}
      <LearningSeries
        title={LEARNING_SERIES_COPY.title}
        introduction={LEARNING_SERIES_COPY.introduction}
        emptyState={LEARNING_SERIES_COPY.emptyState}
        series={PLACEHOLDER_SERIES}
      />
      {/* Same pattern again: `articles` comes from here. */}
      <RecentlyPublished articles={recentlyPublished} />
      <ExploreLibraryCta />
    </>
  );
}
