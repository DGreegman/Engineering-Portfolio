import type { Metadata } from "next";

import { KnowledgeHero } from "@/components/knowledge/knowledge-hero";
import { StartHere } from "@/components/knowledge/start-here";
import { BrowseByTopic } from "@/components/knowledge/browse-by-topic";
import { LearningSeries } from "@/components/knowledge/learning-series";
import { RecentlyPublished } from "@/components/knowledge/recently-published";
import { ExploreLibraryCta } from "@/components/knowledge/explore-library-cta";
import { PLACEHOLDER_TOPICS } from "@/lib/constants/placeholder-topics";
import { PLACEHOLDER_SERIES } from "@/lib/constants/placeholder-series";
import {
  PLACEHOLDER_START_HERE,
  PLACEHOLDER_RECENTLY_PUBLISHED,
} from "@/lib/constants/placeholder-knowledge-landing";
import {
  START_HERE_COPY,
  LEARNING_SERIES_COPY,
} from "@/lib/constants/knowledge-copy";

export const metadata: Metadata = {
  title: "Knowledge — Engineering Portfolio",
  description:
    "A long-term collection of engineering concepts, architecture decisions, backend systems, security, cloud computing, and lessons learned.",
};

export default function KnowledgePage() {
  return (
    <>
      <KnowledgeHero />
      {/* `articles` is passed in from here, not decided inside the
          component — swapping this for a curated slice of the real
          Knowledge collection later is a one-line change, not a redesign.
          `StartHere` is now shared with `/knowledge/[slug]` (Task 4.2), so
          this page's own copy is passed explicitly rather than the
          component importing it. */}
      <StartHere
        title={START_HERE_COPY.title}
        introduction={START_HERE_COPY.introduction}
        cardLabel={START_HERE_COPY.cardLabel}
        emptyState={START_HERE_COPY.emptyState}
        articles={PLACEHOLDER_START_HERE}
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
      <RecentlyPublished articles={PLACEHOLDER_RECENTLY_PUBLISHED} />
      <ExploreLibraryCta />
    </>
  );
}
