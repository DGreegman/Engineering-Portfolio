import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";
import { Footer } from "@/components/navigation/footer";
import {
  IS_SITE_INDEXABLE,
  RSS_PATH,
  SITE_NAME,
  SITE_URL,
} from "@/lib/constants/site";
import {
  createOpenGraphMetadata,
  createTwitterMetadata,
} from "@/lib/seo/metadata";
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
  description:
    "Engineering Desk — backend engineering, APIs, reliability, and the trade-offs behind production systems.",
  metadataBase: new URL(SITE_URL),
  // Feed auto-discovery for browsers and feed readers. The icon links in
  // both navigation locations now lead to this same feed route.
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
  },
  robots: {
    index: IS_SITE_INDEXABLE,
    follow: true,
    googleBot: {
      index: IS_SITE_INDEXABLE,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: createOpenGraphMetadata({
    title: SITE_NAME,
    description:
      "Engineering Desk — backend engineering, APIs, reliability, and the trade-offs behind production systems.",
    url: SITE_URL,
  }),
  twitter: createTwitterMetadata({
    title: SITE_NAME,
    description:
      "Engineering Desk — backend engineering, APIs, reliability, and the trade-offs behind production systems.",
  }),
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
