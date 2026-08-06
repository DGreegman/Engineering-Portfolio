/**
 * ReadmeHero
 *
 * The homepage's opening experience — not a marketing hero. Modeled on the
 * first screen of a well-maintained repository's README: a filename tab,
 * one heading, two short paragraphs of reasoning, a single link forward,
 * and a quiet terminal line. Alongside it, `WorkspaceSnapshot` renders as a
 * secondary column — supporting context, never competing with the README
 * for attention (docs/13-HOMEPAGE_EXPERIENCE.md's "README Introduction",
 * docs/14-HOMEPAGE_COPY.md's "Hero" and "Workspace Snapshot"). Copy for
 * both is reproduced verbatim from lib/constants/homepage-copy.ts.
 *
 * The two-column grid only applies at `lg:` — below that, the snapshot
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
    // max-w-xs (not w-fit) so this matches the CTA button's width below —
    // both are direct children of the same flex-col Stack, so both stretch
    // to fill this cap identically rather than each hugging its own
    // content width.
    <pre className="max-w-xs overflow-x-auto rounded-lg border border-border bg-muted/50 px-4 py-3">
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
    // width="wide" matches Header/Footer's PageContainer (both max-w-7xl)
    // so the hero's left edge lines up with the wordmark and footer content
    // above/below it. The text itself is still capped at max-w-reading
    // below so lines don't stretch to the full wide measure.
    //
    // The snapshot's track (24rem) is deliberately narrower than the
    // README's 1fr track, not an even split — the README stays the
    // visually larger, primary column; the snapshot is sized for a
    // presence that reads as "companion," not "equal."
    <Section spacing="md" width="wide">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <Stack gap="lg" className="max-w-reading">
          <p className="font-mono text-caption text-muted-foreground">
            {HERO_COPY.readmeLabel}
          </p>

          <h1 className="text-display text-foreground">{HERO_COPY.headline}</h1>

          <Stack gap="sm" as="div">
            {HERO_COPY.supportingCopy.map((paragraph) => (
              <p key={paragraph} className="text-body text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </Stack>

          {/* max-w-xs matches TerminalSnippet's cap below, so the two
              stretch to the same width instead of each hugging its own
              content. */}
          <div className="max-w-xs">
            {/* This renders an <a> (next/link), not a <button> — tell Base
                UI so it stops assuming native-button semantics on an
                element that doesn't have them. */}
            <Button
              nativeButton={false}
              render={<Link href={HERO_COPY.primaryCta.href} />}
              className="w-full"
            >
              {HERO_COPY.primaryCta.label}
            </Button>
          </div>

          <TerminalSnippet />
        </Stack>

        <WorkspaceSnapshot />
      </div>
    </Section>
  );
}
