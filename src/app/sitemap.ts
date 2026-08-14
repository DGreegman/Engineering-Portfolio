/**
 * Sitemap — `/sitemap.xml` (Task 6.7)
 *
 * Implements `docs/49-SITEMAP_IMPLEMENTATION_PLAN.md` WI-1 (static + topic
 * entries), WI-2 (content-backed entries), and WI-3 (this file itself) in
 * one function — the "smallest correct footprint" `docs/49` §12 committed
 * to, since Next's own `sitemap.ts` convention needs no separate
 * resolver/serialization file the way `/rss.xml` did (that route hand-
 * builds XML; this one returns a plain array Next.js itself serializes).
 *
 * Reuses `SITE_URL` (`lib/constants/site.ts`) exactly as introduced by
 * Task 6.6 (RSS) — not redeclared, not duplicated (`docs/48` §8/Q4,
 * `docs/49` §3).
 *
 * Three content-backed collections — Knowledge, Work (Case Studies),
 * Engineering Log — read through the same real, draft-filtered `getAll*()`
 * resolvers RSS already uses. **Work reads `getAllCaseStudies()`
 * (`case-studies.ts`), never `lib/content/work.ts`'s `PLACEHOLDER_WORK`**
 * (`docs/48` §6, `docs/49` §3/§9 — the same correction already made twice
 * before, for Search and for RSS). Eight real topic pages come from
 * `TOPIC_SLUGS` (`lib/content/topics.ts`), never `PLACEHOLDER_TOPICS` (the
 * presentation-layer fixture `knowledge/[slug]/page.tsx`'s own
 * `generateStaticParams()` reads for a different, build-time-routes
 * reason).
 *
 * Excluded, each for a specific reason (`docs/49` §5): `/search` (its own
 * shipped `robots: { index: false }`), 404 (not a canonical URL), `/rss.xml`
 * (a different resource type with its own discovery mechanism —
 * `layout.tsx`'s `alternates.types`, Task 6.6 WI-5), `series`/`technologies`
 * (still empty and routeless).
 *
 * `lastModified` appears only on the three content-backed entry groups,
 * from real `frontmatter.updatedAt ?? publishedAt` — never fabricated for
 * static/topic entries, which have no real per-page modification date
 * tracked anywhere in this repository (`docs/49` §6). `changeFrequency`/
 * `priority` are omitted entirely — no trustworthy cadence or priority
 * model exists to back either claim (`docs/49` §6).
 *
 * No sorting beyond each collection's own natural array order — the
 * Sitemaps protocol has no ordering requirement, and reusing
 * `sortByPublishedDate()` here would be exactly the unnecessary sorting
 * infrastructure `docs/49` §24 warned against introducing.
 */
import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/constants/site";
import { TOPIC_SLUGS } from "@/lib/content/topics";
import { getAllArticles } from "@/lib/content/articles";
import { getAllCaseStudies } from "@/lib/content/case-studies";
import { getAllEngineeringLogEntries } from "@/lib/content/engineering-logs";

const STATIC_PATHS = [
  "/",
  "/knowledge",
  "/work",
  "/work/library",
  "/engineering-log",
  "/about",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  const topicEntries: MetadataRoute.Sitemap = TOPIC_SLUGS.map((slug) => ({
    url: `${SITE_URL}/knowledge/${slug}`,
  }));

  const knowledgeEntries: MetadataRoute.Sitemap = getAllArticles().map(
    (item) => ({
      url: `${SITE_URL}/knowledge/${item.slug}`,
      lastModified: item.frontmatter.updatedAt ?? item.frontmatter.publishedAt,
    }),
  );

  const workEntries: MetadataRoute.Sitemap = getAllCaseStudies().map(
    (item) => ({
      url: `${SITE_URL}/work/${item.slug}`,
      lastModified: item.frontmatter.updatedAt ?? item.frontmatter.publishedAt,
    }),
  );

  const engineeringLogEntries: MetadataRoute.Sitemap =
    getAllEngineeringLogEntries().map((item) => ({
      url: `${SITE_URL}/engineering-log/${item.slug}`,
      lastModified: item.frontmatter.updatedAt ?? item.frontmatter.publishedAt,
    }));

  return [
    ...staticEntries,
    ...topicEntries,
    ...knowledgeEntries,
    ...workEntries,
    ...engineeringLogEntries,
  ];
}
