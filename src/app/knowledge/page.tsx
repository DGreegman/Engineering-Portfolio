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
          Knowledge collection later is a one-line change, not a redesign. */}
      <StartHere articles={PLACEHOLDER_START_HERE} />
      {/* Same data-agnostic pattern: `topics` comes from here, not from
          inside the component. */}
      <BrowseByTopic topics={PLACEHOLDER_TOPICS} />
      {/* Same pattern again: `series` comes from here. */}
      <LearningSeries series={PLACEHOLDER_SERIES} />
      {/* Same pattern again: `articles` comes from here. */}
      <RecentlyPublished articles={PLACEHOLDER_RECENTLY_PUBLISHED} />
      <ExploreLibraryCta />
    </>
  );
}
