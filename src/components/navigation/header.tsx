/**
 * Header
 *
 * The workspace header: brand, primary navigation, and a small set of
 * global actions. Rendered into `WorkspaceLayout`'s `header` slot
 * (src/components/layout/workspace-layout.tsx) — this component owns the
 * `<header>` landmark itself (that component renders it bare, unwrapped).
 *
 * The `<header>` tag is the sticky element directly, not a `<div>` inside
 * a separately-wrapped `<header>`. It used to be the latter, but a
 * wrapping element exactly as tall as its sticky child gives the sticky
 * positioning nowhere to actually stick — scrolling past the header meant
 * scrolling past its containing block at the same instant, so it never
 * held its position (confirmed in Chrome desktop, not a browser quirk).
 * One `<header>`, sticky itself, fixes it — its containing block is now
 * `WorkspaceLayout`'s page-spanning wrapper, which is actually taller than
 * it.
 *
 * A Server Component: `NavLink` and `ThemeToggle` are the only client
 * islands it renders. Sticky positioning and the hairline border are this
 * component's own presentation choice — `WorkspaceLayout` stays visually
 * opinion-free by design (Task 2.1).
 *
 * See docs/09-Component Specification.md ("Header") and
 * docs/07-DESIGN_SYSTEM.md ("Calm Interfaces" — no shadow, no blur, one
 * hairline border).
 */
import Link from "next/link";
import { Rss, Search } from "lucide-react";

import { PageContainer } from "@/components/layout/container";
import { PrimaryNavigation } from "@/components/navigation/primary-navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { GithubIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { GITHUB_URL } from "@/lib/constants/site";

export function Header() {
  return (
    <header
      data-slot="workspace-header"
      className="sticky top-0 z-40 border-b border-border bg-background"
    >
      <PageContainer>
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Understated by design: the workspace's owner, not its focal
              point — same size/weight as the nav links beside it. */}
          <Link
            href="/"
            className="rounded-sm text-sm font-medium text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
          >
            Gracious Obeagu
          </Link>

          <PrimaryNavigation className="hidden lg:block" />

          <div className="flex items-center gap-1">
            {/* title (not just aria-label) so sighted pointer users also
                see why these look dimmed, not only screen readers. */}
            <Button
              variant="ghost"
              size="icon"
              disabled
              aria-label="Search (coming soon)"
              title="Search (coming soon)"
            >
              <Search />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              disabled
              aria-label="RSS feed (coming soon)"
              title="RSS feed (coming soon)"
            >
              <Rss />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              // This renders an <a>, not a <button> — tell Base UI so it
              // stops assuming native-button semantics on an element that
              // doesn't have them (see Task 3.1's Base UI console warning).
              nativeButton={false}
              render={
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                />
              }
            >
              <GithubIcon />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
