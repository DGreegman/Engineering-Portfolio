/**
 * RSS Feed Resolution — `/rss.xml` (Task 6.6)
 *
 * Implements `docs/47-RSS_IMPLEMENTATION_PLAN.md` WI-2 (content resolution
 * + chronological merge) and WI-3 (XML serialization) in one file — the
 * same "one resolver file per cross-collection concern, existing loaders
 * untouched" shape `lib/content/search.ts` already established (Task 6.4).
 *
 * Reads exactly three collections — Knowledge, Work (Case Studies),
 * Engineering Log — through their existing, real `getAll*()` resolvers.
 * **Work reads `getAllCaseStudies()` (`case-studies.ts`), the real
 * `content/work/*.mdx` collection — never `lib/content/work.ts`'s
 * `getFeaturedCaseStudies()`/`getProjectLibrary()`, which read the
 * hand-authored `PLACEHOLDER_WORK` fixture instead** (the same correction
 * `docs/42` §3 already made for Search, re-confirmed for RSS in `docs/46`
 * §2/§6 and `docs/47` §5).
 *
 * `series`/`technologies`/About/Homepage/Search/404 never participate —
 * none are named in `docs/10-Technical Architecture.md`'s own RSS content
 * scope ("Knowledge, Engineering Logs, Case Studies"), and none are a
 * standalone, dated document collection a feed item model fits
 * (`docs/46` §6).
 *
 * Chronological merge (`docs/46` §9, D3 — a HARD requirement, restated in
 * `docs/47` WI-2): all three collections' items are normalized into
 * `FeedItem` *while their real `publishedAt` `Date` objects are still
 * intact*, concatenated, and sorted by that real `Date` — never by an
 * already-formatted date string, and never left as three
 * separately-sorted-but-unmerged blocks. This is the one true chronological
 * timeline a feed reader expects; RSS has no "grouped sections" concept
 * the way Search's own results page does.
 */
import { getAllArticles } from "@/lib/content/articles";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";
import { SITE_NAME, RSS_PATH } from "@/lib/constants/site";
import type { ContentItem } from "@/types/content";
import type {
  ArticleFrontmatter,
  KnowledgeFrontmatter,
  WorkFrontmatter,
} from "@/lib/content/schema";

export type FeedCategory = "Knowledge" | "Work" | "Engineering Log";

export interface FeedItem {
  title: string;
  description: string;
  /** Absolute URL — built from the caller-supplied `siteUrl` (`getFeedItems`) or already absolute (`buildRssXml`'s own callers). */
  link: string;
  /** Real `Date`, not yet formatted — the value the chronological sort (§ below) depends on. */
  pubDate: Date;
  /** Same as `link` — already unique per collection+slug, already stable; no separate UUID/timestamp/index scheme needed. */
  guid: string;
  category: FeedCategory;
}

function toFeedItem(
  item: ContentItem<
    KnowledgeFrontmatter | WorkFrontmatter | ArticleFrontmatter
  >,
  href: string,
  category: FeedCategory,
  siteUrl: string,
): FeedItem {
  const link = `${siteUrl}${href}`;
  return {
    title: item.frontmatter.title,
    description: item.frontmatter.description,
    link,
    pubDate: item.frontmatter.publishedAt,
    guid: link,
    category,
  };
}

/**
 * The one true chronological merge (`docs/46` D3): each collection is
 * mapped to `FeedItem` (real `Date` intact), the three arrays are
 * concatenated, and the *combined* array is sorted — not three
 * independently-sorted arrays left concatenated in collection order, which
 * would silently reproduce grouped sections instead of one timeline.
 */
export function getFeedItems(siteUrl: string): FeedItem[] {
  const knowledgeItems = getAllArticles().map((item) =>
    toFeedItem(item, `/knowledge/${item.slug}`, "Knowledge", siteUrl),
  );
  const workItems = getAllCaseStudies().map((item) =>
    toFeedItem(item, `/work/${item.slug}`, "Work", siteUrl),
  );
  const engineeringLogItems = getAllEngineeringLogEntries().map((item) =>
    toFeedItem(
      item,
      `/engineering-log/${item.slug}`,
      "Engineering Log",
      siteUrl,
    ),
  );

  return [...knowledgeItems, ...workItems, ...engineeringLogItems].sort(
    (a, b) => b.pubDate.getTime() - a.pubDate.getTime(),
  );
}

/**
 * XML-escapes a text node — every piece of author-written text (`title`,
 * `description`) passes through this before being written into the feed.
 * Frontmatter is free-form prose and may contain `&`, `<`, `>`, or quote
 * characters that are structurally significant in XML; interpolating it
 * raw would produce an invalid document the moment real content does.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RFC 822 (RSS 2.0's own required `pubDate` format) — `Date.toUTCString()` already produces exactly this format natively; no dependency needed. */
function toRfc822(date: Date): string {
  return date.toUTCString();
}

function buildItemXml(item: FeedItem): string {
  return [
    "<item>",
    `<title>${escapeXml(item.title)}</title>`,
    `<link>${escapeXml(item.link)}</link>`,
    `<description>${escapeXml(item.description)}</description>`,
    `<pubDate>${toRfc822(item.pubDate)}</pubDate>`,
    `<guid isPermaLink="true">${escapeXml(item.guid)}</guid>`,
    `<category>${escapeXml(item.category)}</category>`,
    "</item>",
  ].join("");
}

/**
 * Serializes an already-resolved, already-sorted `FeedItem[]` into a
 * complete RSS 2.0 document. Contains all date formatting and all XML
 * escaping — `getFeedItems()` above deals in real `Date`s and plain text;
 * this is the one place either gets converted to its final XML-safe,
 * RFC-822 form, and only after sorting has already happened.
 */
export function buildRssXml(items: FeedItem[], siteUrl: string): string {
  const feedUrl = `${siteUrl}${RSS_PATH}`;
  const lastBuildDate = items.length > 0 ? items[0].pubDate : new Date();
  const description =
    "Knowledge, Work, and Engineering Log — the latest from the Engineering Portfolio.";

  const itemsXml = items.map(buildItemXml).join("");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${escapeXml(SITE_NAME)}</title>`,
    `<link>${escapeXml(siteUrl)}</link>`,
    `<description>${escapeXml(description)}</description>`,
    "<language>en-us</language>",
    `<lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>`,
    `<atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("");
}
