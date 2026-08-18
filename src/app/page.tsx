import type { Metadata } from "next";

import { ReadmeHero } from "@/components/home/readme-hero";
import { CurrentFocus } from "@/components/home/current-focus";
import { HowIThink } from "@/components/home/how-i-think";
import { EngineeringNotebook } from "@/components/home/engineering-notebook";
import { EngineeringCaseStudies } from "@/components/home/engineering-case-studies";
import { EngineeringLog } from "@/components/home/engineering-log";
import { BeyondTheCode } from "@/components/home/beyond-the-code";
import { getFeaturedArticles } from "@/lib/content/articles";
import { getFeaturedCaseStudies } from "@/lib/content/work";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";
import { sortByPublishedDate } from "@/lib/content/loader";
import { formatDate } from "@/lib/utils/format-date";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import type { NotebookArticle } from "@/lib/constants/placeholder-knowledge";
import type { EngineeringLogEntry } from "@/lib/constants/placeholder-log";
import type { ContentItem } from "@/types/content";
import type {
  ArticleFrontmatter,
  KnowledgeFrontmatter,
} from "@/lib/content/schema";

// Task 8.2 (docs/83 §5): one local const, read three times below (title,
// openGraph.description, twitter.description) — plain in-file reuse of a
// string this file already owns, not a cross-file abstraction.
const description =
  "An engineering workspace: documented case studies, reusable engineering knowledge, and the trade-offs behind real backend systems.";

const title = `${SITE_NAME} — Engineering Workspace`;

export const metadata: Metadata = {
  // Task 8.1 (docs/81 §3.4): the one route that leads with identity
  // ("Gracious Obeagu — ...") rather than trailing it — `absolute` keeps
  // this exact text and deliberately bypasses root layout's own
  // `title.template` (which would otherwise append a second "— Gracious
  // Obeagu" suffix), rather than reflowing this into the fragment shape
  // every other route now uses.
  title: { absolute: title },
  description,
  // Task 8.3 (docs/84, docs/85 §14): alternates is a nested Metadata field,
  // replaced wholesale (not deep-merged) the moment a route defines its
  // own — the identical rule already proven for openGraph/twitter, docs/83
  // §3. `types` is repeated here verbatim from root so this route doesn't
  // silently lose its RSS auto-discovery link.
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  // Task 8.2 (docs/83 §5): a complete openGraph/twitter object — root's
  // own siteName/type is repeated here on purpose (Next's own metadata
  // merging replaces, not deep-merges, a child's openGraph object the
  // moment one is defined at all, docs/83 §3).
  openGraph: {
    title,
    description,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

/**
 * Task 6.1 (docs/36-HOMEPAGE_IMPLEMENTATION_PLAN.md WI-3) — bridges
 * `getFeaturedArticles()`'s real `ContentItem<KnowledgeFrontmatter>` shape
 * to `EngineeringNotebook`'s existing `NotebookArticle` prop shape. Follows
 * the same `ContentItem<X> → flat display shape` idiom `toSummary()`
 * (`lib/content/relationships.ts`) and `toCaseStudySummary()`
 * (`lib/content/case-study-relationships.ts`) already use elsewhere.
 *
 * `topic` uses the raw `TopicSlug` value rather than a prettified label —
 * the only existing slug→label lookup (`findTopic()`) is private to
 * `app/knowledge/[slug]/page.tsx`, not a shared utility, and promoting it
 * is its own small decision outside this task's scope (docs/36 WI-3's own
 * note). Domain/status elsewhere in this codebase already receive the same
 * "raw slug, no prettifying layer" treatment.
 */
function toNotebookArticle(
  item: ContentItem<KnowledgeFrontmatter>,
): NotebookArticle {
  return {
    title: item.frontmatter.title,
    summary: item.frontmatter.description,
    topic: item.frontmatter.topic,
    readingTime: item.readingTime.text,
    publishedAt: formatDate(item.frontmatter.publishedAt),
    href: `/knowledge/${item.slug}`,
  };
}

/**
 * Task 6.1 (docs/36 WI-5) — mirrors `case-study-relationships.ts`'s
 * `toEngineeringLogSummary()` precisely: the identical
 * `ContentItem<ArticleFrontmatter> → { title, href, date }` mapping Work's
 * own Related Engineering Logs section already performs. `summary` is
 * intentionally omitted — `placeholder-log.ts`'s own docstring already
 * establishes that restraint ("intentionally never rendered by the
 * homepage preview... showing less, not more"), carried forward unchanged.
 */
function toEngineeringLogEntry(
  item: ContentItem<ArticleFrontmatter>,
): EngineeringLogEntry {
  return {
    date: formatDate(item.frontmatter.publishedAt),
    title: item.frontmatter.title,
    href: `/engineering-log/${item.slug}`,
  };
}

export default function Home() {
  const featuredArticles = getFeaturedArticles();
  const featuredCaseStudies = getFeaturedCaseStudies();
  const logEntries = sortByPublishedDate(getAllEngineeringLogEntries());

  return (
    <>
      <ReadmeHero />
      <CurrentFocus />
      <HowIThink />
      <EngineeringNotebook articles={featuredArticles.map(toNotebookArticle)} />
      <EngineeringCaseStudies caseStudies={featuredCaseStudies} />
      <EngineeringLog entries={logEntries.map(toEngineeringLogEntry)} />
      <BeyondTheCode />
    </>
  );
}
