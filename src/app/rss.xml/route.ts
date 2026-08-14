/**
 * RSS Feed Route — `/rss.xml` (Task 6.6)
 *
 * A literal folder named `rss.xml` containing `route.ts` — the correct
 * Next.js App Router convention for a Route Handler at this exact,
 * non-dynamic path (`docs/46-RSS_EXPERIENCE.md` §2/§13; no metadata-file
 * convention exists for RSS the way `sitemap.ts`/`robots.ts` do for their
 * own deliverables).
 *
 * Thin by design (`docs/47-RSS_IMPLEMENTATION_PLAN.md` WI-4) — no
 * matching, normalization, sorting, or XML-construction logic lives here;
 * `lib/content/rss.ts` does all of that. The same "route file is thin; the
 * resolver file does the work" precedent `app/search/page.tsx` already
 * established (`docs/42` WI-5).
 *
 * Calls no Request-time API (`cookies()`, `headers()`, `searchParams`,
 * `draftMode()`) — `SITE_URL` is read from `process.env` directly, and
 * every content read goes through already-existing, filesystem-backed
 * resolvers. This keeps the route statically prerenderable rather than
 * forcing dynamic rendering, a direct contrast with `/search` (forced
 * dynamic by reading `searchParams`, `docs/41` §17).
 */
import { SITE_URL } from "@/lib/constants/site";
import { buildRssXml, getFeedItems } from "@/lib/content/rss";

export async function GET() {
  const items = getFeedItems(SITE_URL);
  const xml = buildRssXml(items, SITE_URL);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
