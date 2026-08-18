/**
 * 404 — `src/app/not-found.tsx` (Task 6.5)
 *
 * Implements `docs/44-404_IMPLEMENTATION_PLAN.md` WI-1 (headline,
 * explanation), WI-2 (`ContinueExploring` integration), and WI-3
 * (metadata) — all three in this one file, the entire production footprint
 * of this task (`docs/43-404_EXPERIENCE.md` §26).
 *
 * A single root file, not `global-not-found.js` and not a per-route
 * `not-found.tsx` — this project's own bundled Next.js docs confirm the
 * root file already catches both a genuinely unmatched URL and every
 * `notFound()` call thrown by a route segment with no closer file of its
 * own, which today means all three existing call sites
 * (`app/knowledge/[slug]/page.tsx`, `app/work/[slug]/page.tsx`,
 * `app/engineering-log/[slug]/page.tsx`) — see `docs/43` §2/§8, D1.
 *
 * Renders wrapped in `WorkspaceLayout` (Header/Sidebar/Footer) exactly like
 * any other page — `layout.tsx` supplies that automatically; `Sidebar`'s
 * own `getSidebarSections()` already returns `null` for an unrecognized
 * path, so it collapses correctly with no change needed here.
 *
 * No `robots` metadata field — Next.js already injects `<meta
 * name="robots" content="noindex">` for any 404-status response
 * automatically (confirmed against this project's own bundled docs,
 * `docs/43` §2/§19, D3); adding one by hand would be redundant.
 *
 * A Server Component: no props (`not-found.tsx` accepts none), no data
 * fetching, no client interactivity.
 */
import type { Metadata } from "next";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { ContinueExploring } from "@/components/work/continue-exploring";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <Section spacing="md" width="full">
        <Stack gap="lg" className="max-w-reading">
          <p className="font-mono text-caption text-muted-foreground">404</p>
          <h1 className="text-h1 text-foreground">
            This page doesn&apos;t exist.
          </h1>
          <p className="text-body text-muted-foreground">
            The page or link you were looking for isn&apos;t here — it may have
            been moved, renamed, or never existed.
          </p>
        </Stack>
      </Section>

      <ContinueExploring
        title="Continue Exploring"
        introduction={["Here's where you can go instead."]}
        links={[
          {
            label: "Continue into Knowledge →",
            description: "Browse the concepts documented so far.",
            href: "/knowledge",
          },
          {
            label: "Continue into Work →",
            description: "See the engineering case studies.",
            href: "/work",
          },
          {
            label: "Continue into the Engineering Log →",
            description: "Read the raw process behind the work.",
            href: "/engineering-log",
          },
          {
            label: "Continue into About →",
            description: "Find out who's behind this workspace.",
            href: "/about",
          },
          {
            label: "Search the workspace →",
            description: "Look for something specific by title or description.",
            href: "/search",
          },
          {
            label: "Return to the front door →",
            description: "Start from the workspace's own homepage.",
            href: "/",
          },
        ]}
      />
    </>
  );
}
