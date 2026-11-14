/**
 * ReadmeHero
 *
 * The homepage's opening experience — not a marketing hero. Modeled on the
 * first screen of a well-maintained repository's README: a filename tab,
 * one heading, short engineering positioning, two clear actions, and a
 * quiet terminal line. Alongside it, `WorkspaceSnapshot` renders as a
 * secondary column — supporting context, never competing with the README
 * for attention (docs/13-HOMEPAGE_EXPERIENCE.md's "README Introduction",
 * docs/14-HOMEPAGE_COPY.md's "Hero" and "Workspace Snapshot"). Copy for
 * both is reproduced verbatim from lib/constants/homepage-copy.ts.
 *
 * The two-column grid only applies at `xl:` — below that, the snapshot
 * simply flows after the README content in normal document order, which is
 * also its accessibility/reading order at every breakpoint: the README is
 * the primary content and always reaches assistive tech first.
 *
 * A Server Component: nothing here needs interactivity, so it stays static
 * HTML per docs/10-Technical Architecture.md ("Rendering Strategy").
 */
import Link from "next/link";

import { Section } from "@/components/layout/section";
import { Stack } from "@/components/layout/stack";
import { Button } from "@/components/ui/button";
import { WorkspaceSnapshot } from "@/components/home/workspace-snapshot";
import { HERO_COPY } from "@/lib/constants/homepage-copy";

/**
 * The hero's "subtle terminal snippet" (docs/13, docs/14). Static markup
 * only — no copy button, no typing animation — this is a decorative echo
 * of the workspace metaphor, not the documented Milestone 4 "Terminal
 * Output" component (which supports success/error states for real command
 * output), so it stays private to this file rather than becoming a
 * reusable component.
 */
function TerminalSnippet() {
  return (
    // Keep the sample narrow so it reads as a supporting detail.
    <pre className="max-w-xs overflow-x-auto rounded-lg border border-border bg-surface-elevated/60 px-4 py-3">
      <code>
        <span className="text-muted-foreground">$ </span>
        {HERO_COPY.terminal.command}
        {"\n\n"}
        {HERO_COPY.terminal.output.join("\n")}
      </code>
    </pre>
  );
}

export function ReadmeHero() {
  return (
    // width="full": WorkspaceLayout now wraps every page's sidebar/main
    // row in one shared PageContainer (max-width 1400px, same responsive gutter
    // Header/Footer use) so the hero's left edge lines up with the
    // wordmark and footer content above/below it — an inner "wide"
    // Container here would double that gutter instead. On sidebar-less
    // routes like this one the empty <aside> collapses to zero width
    // (lg:empty:hidden), so the shared container spans the full viewport
    // exactly as this section's own "wide" Container used to. The text
    // the hero uses a fluid, wide text column while paragraph line lengths
    // remain controlled by the copy itself. The snapshot is the supporting
    // right-hand column in a slightly asymmetric editorial split.
    <Section spacing="md" width="full" className="relative xl:py-20">
      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(22rem,0.8fr)] xl:items-center xl:gap-16">
        <Stack gap="md" className="max-w-[52rem] xl:gap-8">
          <p className="font-mono text-caption font-medium uppercase tracking-[0.14em] text-brand-accent">
            {HERO_COPY.readmeLabel}
          </p>

          <h1 className="max-w-[14ch] text-display text-foreground">
            {HERO_COPY.headline}
          </h1>

          <Stack gap="sm" as="div">
            {HERO_COPY.supportingCopy.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>

          <div className="flex max-w-xl flex-col gap-3 sm:flex-row">
            {/* This renders an <a> (next/link), not a <button> — tell Base
                UI so it stops assuming native-button semantics on an
                element that doesn't have them. */}
            <Button
              nativeButton={false}
              size="lg"
              render={<Link href={HERO_COPY.primaryCta.href} />}
              className="w-full sm:w-auto"
            >
              {HERO_COPY.primaryCta.label}
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              size="lg"
              render={<Link href={HERO_COPY.secondaryCta.href} />}
              className="w-full sm:w-auto"
            >
              {HERO_COPY.secondaryCta.label}
            </Button>
          </div>

          <TerminalSnippet />
        </Stack>

        <div className="xl:pl-2">
          <WorkspaceSnapshot />
        </div>
      </div>
    </Section>
  );
}
