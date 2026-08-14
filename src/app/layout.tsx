import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { WorkspaceLayout } from "@/components/layout/workspace-layout";
import { Header } from "@/components/navigation/header";
import { Sidebar } from "@/components/navigation/sidebar";
import { Footer } from "@/components/navigation/footer";
import { RSS_PATH, SITE_URL } from "@/lib/constants/site";
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
  title: "Engineering Portfolio",
  description: "Engineering Portfolio project foundation.",
  // Feed auto-discovery (Task 6.6, docs/47 WI-5) — the standard mechanism
  // browsers/feed readers use to find a site's RSS feed, independent of
  // whether Header's own RSS icon is clickable yet (it isn't — that
  // activation is a separate, later step, docs/46 §11/§15).
  alternates: {
    types: {
      "application/rss+xml": `${SITE_URL}${RSS_PATH}`,
    },
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
