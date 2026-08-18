import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";
import { Footer } from "@/components/navigation/footer";
import { RSS_PATH, SITE_NAME, SITE_URL } from "@/lib/constants/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Task 8.1 (docs/80, docs/81): SITE_NAME is the one documented site
  // identity (docs/01-PERSONAL_BRAND.md) — this template is what every
  // route's own title fragment (e.g. "Knowledge") is completed against,
  // replacing the 12 hand-typed "— Engineering Portfolio" occurrences this
  // task removed. `default` is required whenever `template` is set (Next's
  // own Metadata API contract) and is also the real, live fallback for the
  // one reachable edge case where a dynamic route's own generateMetadata()
  // returns {} (an invalid slug, immediately followed by that page's own
  // notFound() call) — see knowledge/[slug], work/[slug], and
  // engineering-log/[slug]'s own generateMetadata() functions, unmodified.
  title: {
    default: SITE_NAME,
    template: `%s — ${SITE_NAME}`,
  },
  // No root `description`: every real route already overrides it (Next's
  // own metadata merging is shallow, root-to-leaf, per-field — confirmed
  // against this installed Next.js version's own docs, docs/80 §5), so the
  // only Milestone-1-era placeholder text that lived here
  // ("Engineering Portfolio project foundation.") was dead prose no reader
  // ever saw. Removed rather than replaced with new copy (docs/81 §5) —
  // `description` has no `default`/template mechanism the way `title`
  // does, so there's nothing structural to fill its place with.
  metadataBase: new URL(SITE_URL),
  // Feed auto-discovery (Task 6.6, docs/47 WI-5) — the standard mechanism
  // browsers/feed readers use to find a site's RSS feed, independent of
  // whether Header's own RSS icon is clickable yet (it isn't — that
  // activation is a separate, later step, docs/46 §11/§15). Already an
  // absolute URL, so metadataBase (above) has no effect on it either way.
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  // Task 8.2 (docs/82, docs/83): the only three openGraph fields — and the
  // one twitter field — that are genuinely true for the entire site with
  // no per-route reason to differ. Every route that needs its own title/
  // description/url/type defines a *complete* openGraph/twitter object of
  // its own (docs/83 §3) — Next's own metadata merging replaces, not
  // deep-merges, a child's openGraph/twitter object the moment one is
  // defined at all, so these three fields are only ever actually inherited
  // by the two routes that intentionally define no openGraph of their own:
  // not-found.tsx (docs/83 §9) and the invalid-slug fallback branch on all
  // three dynamic routes (`return {}`, unmodified). No `images` field here
  // — no image asset exists yet (docs/82 §8/§9), a deliberate, honest
  // absence, not a gap to fill by default.
  openGraph: {
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // `motion-safe:scroll-smooth` (Task 4.3.5, Reading Navigation): the
      // entire "smoothly scroll to the section on click" requirement, done
      // with zero JavaScript — a native `<a href="#slug">` already updates
      // the URL fragment and browser history on its own; this one rule is
      // the only thing missing to make that jump smooth instead of instant.
      // `motion-safe:` (not a bare `scroll-smooth`) gates it behind
      // `prefers-reduced-motion: no-preference`, the same variant already
      // used elsewhere in this codebase (e.g. `CurrentFocus`'s hover
      // scale) — readers who've asked for reduced motion get an instant
      // jump instead, not a forced animation.
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased motion-safe:scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <WorkspaceLayout
            header={<Header />}
            sidebar={<Sidebar />}
            footer={<Footer />}
          >
            {children}
          </WorkspaceLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
